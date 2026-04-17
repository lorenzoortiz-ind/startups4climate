import { createServerClient } from '@supabase/ssr'
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

// Demo path rewrite map: /demo-* → real base + cookie role
const DEMO_PATHS = [
  { prefix: '/demo-tools',      realBase: '/tools',      role: 'founder'    },
  { prefix: '/demo-admin',      realBase: '/admin',      role: 'admin_org'  },
  { prefix: '/demo-superadmin', realBase: '/superadmin', role: 'superadmin' },
] as const

export async function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname

  // ── Demo entry rewrites ──────────────────────────────────────────────────
  // Intercept /demo-tools/*, /demo-admin/*, /demo-superadmin/*,
  // set the s4c_demo cookie, and rewrite the request to the real path
  // WITHOUT redirecting — the browser URL stays at /demo-*.
  for (const { prefix, realBase, role } of DEMO_PATHS) {
    if (pathname === prefix || pathname.startsWith(prefix + '/')) {
      const subPath = pathname.slice(prefix.length) // e.g. '/passport' or ''
      const rewriteUrl = request.nextUrl.clone()
      rewriteUrl.pathname = realBase + subPath

      const response = NextResponse.rewrite(rewriteUrl)
      // Always refresh the cookie so stale/expired values don't break the demo.
      // httpOnly: false so the client JS (AuthContext) can read it.
      response.cookies.set('s4c_demo', role, {
        path: '/',
        maxAge: 60 * 60 * 24, // 24 hours (matches /api/demo/[role] behavior)
        httpOnly: false,
        sameSite: 'lax',
      })
      // Prevent any CDN/browser caching of demo entry HTML so the cookie
      // is always sent on the first load.
      response.headers.set('cache-control', 'private, no-store, must-revalidate')
      return response
    }
  }

  // ── Supabase session refresh ──────────────────────────────────────────────
  let supabaseResponse = NextResponse.next({
    request,
  })

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll()
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) =>
            request.cookies.set(name, value)
          )
          supabaseResponse = NextResponse.next({
            request,
          })
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          )
        },
      },
    }
  )

  // Refresh session — important for keeping tokens valid
  let user = null
  try {
    const { data } = await supabase.auth.getUser()
    user = data.user
  } catch {
    // If getUser fails (e.g. network/DB error), allow the request through
    // and let client-side auth handle it
    return supabaseResponse
  }

  const demoRole = request.cookies.get('s4c_demo')?.value as 'founder' | 'admin_org' | 'superadmin' | undefined
  const isDemoAdminOrg = demoRole === 'admin_org'
  const isDemoSuperadmin = demoRole === 'superadmin'
  const isDemoAdminLike = isDemoAdminOrg || isDemoSuperadmin

  // /superadmin routes: require authenticated superadmin (or demo superadmin cookie)
  if (pathname.startsWith('/superadmin')) {
    if (!user && !isDemoSuperadmin) {
      const redirectUrl = request.nextUrl.clone()
      redirectUrl.pathname = '/'
      redirectUrl.searchParams.set('auth', 'login')
      return NextResponse.redirect(redirectUrl)
    }

    if (user && !isDemoSuperadmin) {
      const { data: profile } = await Promise.race([
        supabase.from('profiles').select('role').eq('id', user.id).single(),
        new Promise<{ data: null; error: { message: string } }>((resolve) =>
          setTimeout(() => resolve({ data: null, error: { message: 'Timeout' } }), 3000)
        ),
      ])

      if (!profile || profile.role !== 'superadmin') {
        const redirectUrl = request.nextUrl.clone()
        redirectUrl.pathname = profile?.role === 'admin_org' ? '/admin' : '/tools'
        return NextResponse.redirect(redirectUrl)
      }
    }

    return supabaseResponse
  }

  // /admin routes: require authentication + admin_org role (or demo admin cookie).
  // Superadmins are redirected into /superadmin instead.
  if (pathname.startsWith('/admin') && !user && !isDemoAdminLike) {
    const redirectUrl = request.nextUrl.clone()
    redirectUrl.pathname = '/'
    redirectUrl.searchParams.set('auth', 'login')
    return NextResponse.redirect(redirectUrl)
  }

  if (pathname.startsWith('/admin') && isDemoSuperadmin) {
    const redirectUrl = request.nextUrl.clone()
    redirectUrl.pathname = '/superadmin'
    return NextResponse.redirect(redirectUrl)
  }

  if (pathname.startsWith('/admin') && user && !isDemoAdminLike) {
    const { data: profile } = await Promise.race([
      supabase.from('profiles').select('role').eq('id', user.id).single(),
      new Promise<{ data: null; error: { message: string } }>((resolve) =>
        setTimeout(() => resolve({ data: null, error: { message: 'Timeout' } }), 3000)
      ),
    ])

    if (!profile) {
      const redirectUrl = request.nextUrl.clone()
      redirectUrl.pathname = '/tools'
      return NextResponse.redirect(redirectUrl)
    }

    if (profile.role === 'superadmin') {
      const redirectUrl = request.nextUrl.clone()
      redirectUrl.pathname = '/superadmin'
      return NextResponse.redirect(redirectUrl)
    }

    if (profile.role !== 'admin_org') {
      const redirectUrl = request.nextUrl.clone()
      redirectUrl.pathname = '/tools'
      return NextResponse.redirect(redirectUrl)
    }
  }

  // /tools routes: auth handled client-side by AuthProvider
  return supabaseResponse
}

export const config = {
  matcher: [
    '/tools/:path*',
    '/admin/:path*',
    '/superadmin/:path*',
    '/demo-tools',
    '/demo-tools/:path*',
    '/demo-admin',
    '/demo-admin/:path*',
    '/demo-superadmin',
    '/demo-superadmin/:path*',
  ],
}
