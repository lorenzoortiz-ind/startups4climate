import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url)
  const code = searchParams.get('code')
  const token_hash = searchParams.get('token_hash')
  const type = searchParams.get('type')
  const rawType = searchParams.get('type')
  // Recovery links (password reset) must land on /auth/reset, not /tools
  const defaultNext = rawType === 'recovery' ? '/auth/reset' : '/tools'
  const next = searchParams.get('next') ?? defaultNext

  // Use env-based site URL for redirects (handles Vercel preview vs production).
  // Falls back to the request origin (works for localhost too).
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || origin

  // Handle error responses from Supabase (e.g. expired link, invalid token).
  // Since email confirmation is no longer required, redirect to /tools gracefully.
  if (searchParams.get('error')) {
    return NextResponse.redirect(`${siteUrl}/tools`)
  }

  const cookieStore = await cookies()
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll()
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) => {
            cookieStore.set(name, value, options)
          })
        },
      },
    }
  )

  // PKCE flow — exchange authorization code for session
  if (code) {
    const { error: exchangeError } =
      await supabase.auth.exchangeCodeForSession(code)
    if (!exchangeError) {
      return NextResponse.redirect(`${siteUrl}${next}`)
    }
    // If exchange fails (e.g. expired code), redirect to /tools gracefully
    return NextResponse.redirect(`${siteUrl}/tools`)
  }

  // Email confirmation flow — verify OTP token hash
  if (token_hash && type) {
    const { error: verifyError } = await supabase.auth.verifyOtp({
      token_hash,
      type: type as 'email' | 'signup' | 'recovery' | 'invite',
    })
    if (!verifyError) {
      return NextResponse.redirect(`${siteUrl}${next}`)
    }
    // If verification fails (e.g. otp_expired), redirect to /tools gracefully
    return NextResponse.redirect(`${siteUrl}/tools`)
  }

  // No recognized params — redirect to /tools
  return NextResponse.redirect(`${siteUrl}/tools`)
}
