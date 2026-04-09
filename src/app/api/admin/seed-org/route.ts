import { createClient } from '@supabase/supabase-js'
import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  if (process.env.NODE_ENV === 'production') {
    return NextResponse.json({ error: 'Not available in production' }, { status: 404 })
  }

  const authHeader = request.headers.get('x-seed-secret')
  if (!process.env.SEED_SECRET || authHeader !== process.env.SEED_SECRET) {
    return Response.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
  const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

  // Use createClient from supabase-js (works in server context, no cookies needed)
  const supabase = createClient(supabaseUrl, supabaseKey, {
    auth: { autoRefreshToken: false, persistSession: false },
  })

  const email = 'org-test@redesignlab.org'
  const password = 'Org2026test'

  // If we have service role key, use admin API
  if (process.env.SUPABASE_SERVICE_ROLE_KEY) {
    // Delete existing user if any
    const { data: existingUsers } = await supabase.auth.admin.listUsers()
    const users = existingUsers?.users as Array<{ id: string; email?: string }> | undefined
    const existing = users?.find((u) => u.email === email)
    if (existing) {
      await supabase.auth.admin.deleteUser(existing.id)
    }

    const { data, error } = await supabase.auth.admin.createUser({
      email,
      password,
      email_confirm: true,
      user_metadata: { full_name: 'Admin RedesignLab', startup_name: 'RedesignLab' },
    })

    if (error) {
      return Response.json({ error: error.message, method: 'admin' }, { status: 400 })
    }

    if (data.user) {
      await supabase
        .from('profiles')
        .update({
          role: 'admin_org',
          org_id: '9bfabdf3-5e7b-4e4d-9a5e-35c115757f81',
          full_name: 'Admin RedesignLab',
          startup_name: 'RedesignLab',
        })
        .eq('id', data.user.id)
    }

    return Response.json({ success: true, method: 'admin', userId: data.user?.id })
  }

  // Fallback: use signUp with plain supabase-js client (no SSR/cookies)
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: { full_name: 'Admin RedesignLab', startup_name: 'RedesignLab' },
    },
  })

  if (error) {
    // If user already exists, try to just update the profile
    if (error.message.includes('already registered')) {
      return Response.json({
        success: false,
        error: 'User already exists. Try logging in with: ' + email + ' / ' + password,
        method: 'signUp-exists',
      })
    }
    return Response.json({ error: error.message, method: 'signUp' }, { status: 400 })
  }

  if (data.user) {
    // Use a server client with service-level access for profile update
    await supabase
      .from('profiles')
      .update({
        role: 'admin_org',
        org_id: '9bfabdf3-5e7b-4e4d-9a5e-35c115757f81',
        full_name: 'Admin RedesignLab',
        startup_name: 'RedesignLab',
      })
      .eq('id', data.user.id)
  }

  return Response.json({
    success: true,
    method: 'signUp',
    userId: data.user?.id,
    note: 'Login with ' + email + ' / ' + password,
  })
}
