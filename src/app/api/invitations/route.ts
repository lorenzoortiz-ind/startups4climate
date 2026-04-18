import { NextRequest, NextResponse } from 'next/server'
import { createSupabaseServer } from '@/lib/supabase-server'
import { Resend } from 'resend'

const resend = process.env.RESEND_API_KEY ? new Resend(process.env.RESEND_API_KEY) : null

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://startups4climate.vercel.app'

function escapeHtml(str: string): string {
  return str.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;')
}

export async function POST(request: NextRequest) {
  const supabase = await createSupabaseServer()

  // Auth check
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) {
    return NextResponse.json({ error: 'No autorizado' }, { status: 401 })
  }

  // Verify admin role
  const { data: profile } = await supabase
    .from('profiles')
    .select('role, org_id, full_name')
    .eq('id', user.id)
    .single()

  if (!profile || profile.role !== 'admin_org' || !profile.org_id) {
    return NextResponse.json({ error: 'Sin permisos' }, { status: 403 })
  }

  const body = await request.json()
  const { email, cohort_id } = body

  if (!email || typeof email !== 'string') {
    return NextResponse.json({ error: 'Email requerido' }, { status: 400 })
  }

  // Check if invitation already exists
  const { data: existing } = await supabase
    .from('invitations')
    .select('id')
    .eq('email', email.toLowerCase().trim())
    .eq('org_id', profile.org_id)
    .eq('status', 'pending')
    .maybeSingle()

  if (existing) {
    return NextResponse.json({ error: 'Ya existe una invitación pendiente para este email' }, { status: 409 })
  }

  // Create invitation
  const { data: invitation, error: insertError } = await supabase
    .from('invitations')
    .insert({
      org_id: profile.org_id,
      cohort_id: cohort_id || null,
      email: email.toLowerCase().trim(),
      invited_by: user.id,
    })
    .select('id, token')
    .single()

  if (insertError || !invitation) {
    return NextResponse.json({ error: 'Error al crear la invitación' }, { status: 500 })
  }

  // Get org name for the email
  const { data: org } = await supabase
    .from('organizations')
    .select('name')
    .eq('id', profile.org_id)
    .single()

  const inviteUrl = `${SITE_URL}/invite/${invitation.token}`
  const orgName = org?.name || 'una organización'

  // Send email via Resend
  try {
    if (!resend) throw new Error('RESEND_API_KEY not configured')
    await resend.emails.send({
      from: 'Startups4Climate <noreply@startups4climate.com>',
      to: email.toLowerCase().trim(),
      subject: `${escapeHtml(profile.full_name)} te invita a ${escapeHtml(orgName)} en Startups4Climate`,
      html: `
        <div style="font-family: 'Mluvka', Arial, sans-serif; max-width: 560px; margin: 0 auto; padding: 32px 24px;">
          <div style="text-align: center; margin-bottom: 32px;">
            <h1 style="font-size: 24px; font-weight: 700; color: #191919; margin: 0 0 8px;">
              Startups4Climate
            </h1>
          </div>

          <p style="font-size: 16px; color: #191919; margin: 0 0 16px;">
            <strong>${escapeHtml(profile.full_name)}</strong> te ha invitado a unirte a
            <strong>${escapeHtml(orgName)}</strong> en Startups4Climate.
          </p>

          <p style="font-size: 14px; color: #6B7280; margin: 0 0 24px;">
            Startups4Climate es una plataforma con +30 herramientas interactivas, mentores AI
            y recursos para llevar tu startup de impacto al siguiente nivel.
          </p>

          <div style="text-align: center; margin: 32px 0;">
            <a href="${inviteUrl}" style="
              display: inline-block; padding: 14px 32px;
              background: #DA4E24; color: #fff; font-size: 15px;
              font-weight: 600; text-decoration: none; border-radius: 8px;
            ">
              Aceptar invitación
            </a>
          </div>

          <p style="font-size: 12px; color: #9CA3AF; text-align: center; margin-top: 32px;">
            Esta invitación expira en 7 días.<br/>
            Si no esperabas esta invitación, puedes ignorar este email.
          </p>
        </div>
      `,
    })
  } catch {
    // Email failed but invitation was created — log but don't fail
    console.error('Failed to send invitation email')
  }

  return NextResponse.json({ success: true, invitation_id: invitation.id })
}

export async function GET() {
  const supabase = await createSupabaseServer()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) {
    return NextResponse.json({ error: 'No autorizado' }, { status: 401 })
  }

  const { data: profile } = await supabase
    .from('profiles')
    .select('role, org_id')
    .eq('id', user.id)
    .single()

  if (!profile || profile.role !== 'admin_org' || !profile.org_id) {
    return NextResponse.json({ error: 'Sin permisos' }, { status: 403 })
  }

  const { data: invitations } = await supabase
    .from('invitations')
    .select('*')
    .eq('org_id', profile.org_id)
    .order('created_at', { ascending: false })

  return NextResponse.json({ invitations: invitations || [] })
}
