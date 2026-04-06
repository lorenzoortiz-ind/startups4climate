import { NextRequest, NextResponse } from 'next/server'
import { createSupabaseServer } from '@/lib/supabase-server'

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params
  const supabase = await createSupabaseServer()

  // Auth check
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) {
    return NextResponse.json({ error: 'No autorizado' }, { status: 401 })
  }

  // Verify admin role
  const { data: profile } = await supabase
    .from('profiles')
    .select('role, org_id')
    .eq('id', user.id)
    .single()

  if (!profile || (profile.role !== 'admin_org' && profile.role !== 'superadmin')) {
    return NextResponse.json({ error: 'Sin permisos para revisar solicitudes' }, { status: 403 })
  }

  const body = await request.json()
  const { status } = body

  if (!status || (status !== 'approved' && status !== 'rejected')) {
    return NextResponse.json({ error: 'Status debe ser "approved" o "rejected"' }, { status: 400 })
  }

  // Get the request
  const { data: cohortRequest } = await supabase
    .from('cohort_requests')
    .select('*, cohorts(id, org_id)')
    .eq('id', id)
    .single()

  if (!cohortRequest) {
    return NextResponse.json({ error: 'Solicitud no encontrada' }, { status: 404 })
  }

  if (cohortRequest.status !== 'pending') {
    return NextResponse.json({ error: 'Esta solicitud ya fue revisada' }, { status: 400 })
  }

  // If admin_org, verify they own the cohort's org
  if (profile.role === 'admin_org') {
    const cohortOrgId = cohortRequest.cohorts?.org_id
    if (cohortOrgId !== profile.org_id) {
      return NextResponse.json({ error: 'No tienes permisos sobre esta cohorte' }, { status: 403 })
    }
  }

  // If approved, add startup to cohort
  if (status === 'approved') {
    const { error: insertError } = await supabase
      .from('cohort_startups')
      .insert({
        cohort_id: cohortRequest.cohort_id,
        startup_id: cohortRequest.startup_id,
      })

    if (insertError) {
      console.error('Error adding startup to cohort:', insertError)
      return NextResponse.json({ error: 'Error al agregar startup a la cohorte' }, { status: 500 })
    }
  }

  // Update request status
  const { data: updated, error: updateError } = await supabase
    .from('cohort_requests')
    .update({
      status,
      reviewed_by: user.id,
      reviewed_at: new Date().toISOString(),
    })
    .eq('id', id)
    .select()
    .single()

  if (updateError) {
    console.error('Error updating request:', updateError)
    return NextResponse.json({ error: 'Error al actualizar la solicitud' }, { status: 500 })
  }

  return NextResponse.json({ success: true, request: updated })
}
