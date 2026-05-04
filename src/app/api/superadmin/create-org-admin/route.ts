/**
 * POST /api/superadmin/create-org-admin
 * Atomic org + admin user creation.  Requires superadmin role.
 * Uses SUPABASE_SERVICE_ROLE_KEY to create auth user + profile.
 */
import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { supabase } from '@/lib/supabase'

export async function POST(request: Request) {
  /* ── Auth guard: must be superadmin ── */
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'No autenticado' }, { status: 401 })

  const { data: profile } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', user.id)
    .maybeSingle()

  if (!profile || profile.role !== 'superadmin') {
    return NextResponse.json({ error: 'Sin permisos' }, { status: 403 })
  }

  /* ── Validate env ── */
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

  if (!supabaseUrl || !serviceKey) {
    return NextResponse.json(
      { error: 'SUPABASE_SERVICE_ROLE_KEY no configurada en el servidor.' },
      { status: 500 },
    )
  }

  const adminClient = createClient(supabaseUrl, serviceKey, {
    auth: { persistSession: false, autoRefreshToken: false },
  })

  /* ── Parse body ── */
  const body = await request.json()
  const {
    orgName,
    orgType,
    country,
    plan,
    maxStartups,
    billingEmail,
    website,
    contractEnd,
    adminFullName,
    adminEmail,
    adminPassword,
  } = body as {
    orgName: string
    orgType: string
    country: string
    plan: string
    maxStartups: number
    billingEmail: string
    website: string
    contractEnd: string | null
    adminFullName: string
    adminEmail: string
    adminPassword: string
  }

  if (!orgName?.trim()) {
    return NextResponse.json({ error: 'El nombre de la organización es requerido.' }, { status: 400 })
  }
  if (!adminEmail?.trim() || !adminPassword) {
    return NextResponse.json({ error: 'Email y contraseña del admin son requeridos.' }, { status: 400 })
  }
  if (adminPassword.length < 8) {
    return NextResponse.json({ error: 'La contraseña debe tener al menos 8 caracteres.' }, { status: 400 })
  }

  /* ── 1. Create organization ── */
  const { data: org, error: orgError } = await adminClient
    .from('organizations')
    .insert({
      name: orgName.trim(),
      type: orgType || 'university',
      country: country?.trim() || null,
      plan: plan || 'starter',
      max_startups: maxStartups || 25,
      billing_email: billingEmail?.trim() || null,
      website: website?.trim() || null,
      contract_end: contractEnd || null,
      is_active: true,
    })
    .select('id, name')
    .single()

  if (orgError || !org) {
    console.error('[S4C Superadmin] Error creating org:', orgError)
    return NextResponse.json(
      { error: `Error al crear la organización: ${orgError?.message || 'desconocido'}` },
      { status: 500 },
    )
  }

  /* ── 2. Create auth user ── */
  const { data: authData, error: authError } = await adminClient.auth.admin.createUser({
    email: adminEmail.trim(),
    password: adminPassword,
    email_confirm: true,
    user_metadata: {
      full_name: adminFullName?.trim() || orgName.trim(),
      role: 'admin_org',
      org_id: org.id,
    },
  })

  if (authError || !authData.user) {
    // Rollback: delete the org we just created
    await adminClient.from('organizations').delete().eq('id', org.id)
    console.error('[S4C Superadmin] Error creating auth user:', authError)
    return NextResponse.json(
      { error: `Error al crear el usuario: ${authError?.message || 'desconocido'}` },
      { status: 500 },
    )
  }

  /* ── 3. Upsert profile (trigger may have created it) ── */
  const { error: profileError } = await adminClient
    .from('profiles')
    .upsert({
      id: authData.user.id,
      email: adminEmail.trim(),
      full_name: adminFullName?.trim() || orgName.trim(),
      role: 'admin_org',
      org_id: org.id,
    })

  if (profileError) {
    console.error('[S4C Superadmin] Error upserting profile:', profileError)
    // Non-fatal: the trigger should have created it. Log but continue.
  }

  return NextResponse.json({
    success: true,
    organization: { id: org.id, name: org.name },
    user: { id: authData.user.id, email: authData.user.email },
  })
}
