import { NextRequest, NextResponse } from 'next/server'
import { createSupabaseServer } from '@/lib/supabase-server'

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
  const { id } = await params
  const supabase = await createSupabaseServer()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) {
    return NextResponse.json({ error: 'No autorizado' }, { status: 401 })
  }

  const { data: profile } = await supabase
    .from('profiles')
    .select('role, org_id')
    .eq('id', user.id)
    .maybeSingle()

  if (!profile || profile.role !== 'admin_org' || !profile.org_id) {
    return NextResponse.json({ error: 'Sin permisos' }, { status: 403 })
  }

  // Revoke the invitation
  const { error } = await supabase
    .from('invitations')
    .update({ status: 'revoked' })
    .eq('id', id)
    .eq('org_id', profile.org_id)

  if (error) {
    return NextResponse.json({ error: 'Error al revocar' }, { status: 500 })
  }

  return NextResponse.json({ success: true })
  } catch (err) {
    console.error('[S4C Admin] invitation revoke error:', err)
    return NextResponse.json({ error: 'Error interno del servidor' }, { status: 500 })
  }
}
