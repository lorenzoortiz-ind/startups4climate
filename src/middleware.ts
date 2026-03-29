import { createServerClient } from '@supabase/ssr'
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export async function middleware(request: NextRequest) {
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

  const pathname = request.nextUrl.pathname

  // Protected routes: /tools/* requires authentication
  if (pathname.startsWith('/tools') && !user) {
    const redirectUrl = request.nextUrl.clone()
    redirectUrl.pathname = '/'
    redirectUrl.searchParams.set('auth', 'login')
    return NextResponse.redirect(redirectUrl)
  }

  // Admin routes: /admin/* requires authentication + admin role
  if (pathname.startsWith('/admin')) {
    if (!user) {
      const redirectUrl = request.nextUrl.clone()
      redirectUrl.pathname = '/'
      redirectUrl.searchParams.set('auth', 'login')
      return NextResponse.redirect(redirectUrl)
    }

    // Check role from profiles table using direct REST to avoid PostgREST cache issues
    try {
      const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
      const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

      // Get the access token from cookies (Supabase stores it as sb-*-auth-token)
      const {
        data: { session },
      } = await supabase.auth.getSession()

      const accessToken = session?.access_token

      if (!accessToken) {
        // No session token — deny access
        const redirectUrl = request.nextUrl.clone()
        redirectUrl.pathname = '/'
        return NextResponse.redirect(redirectUrl)
      }

      const res = await fetch(
        `${supabaseUrl}/rest/v1/profiles?select=role&id=eq.${user.id}`,
        {
          headers: {
            apikey: anonKey,
            Authorization: `Bearer ${accessToken}`,
            Accept: 'application/json',
          },
        }
      )

      if (res.ok) {
        const rows = await res.json()
        const role = rows?.[0]?.role
        if (role === 'admin_org' || role === 'superadmin') {
          // Authorized — allow through
          return supabaseResponse
        }
      }

      // If the REST call failed or role is not admin, try Supabase client as fallback
      const { data: profile } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', user.id)
        .single()

      if (profile?.role === 'admin_org' || profile?.role === 'superadmin') {
        return supabaseResponse
      }

      // Neither method confirmed admin role — redirect away
      const redirectUrl = request.nextUrl.clone()
      redirectUrl.pathname = '/tools'
      return NextResponse.redirect(redirectUrl)
    } catch {
      // On any error, allow through — the admin page itself will verify client-side
      // This prevents legitimate admins from being locked out by transient DB issues
      return supabaseResponse
    }
  }

  return supabaseResponse
}

export const config = {
  matcher: ['/tools/:path*', '/admin/:path*'],
}
