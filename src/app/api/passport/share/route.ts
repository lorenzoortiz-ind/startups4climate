import { NextRequest } from 'next/server'
import { createSupabaseServer } from '@/lib/supabase-server'
import { randomBytes } from 'crypto'

/**
 * POST /api/passport/share
 *
 * Body: { enabled: boolean }
 *
 * Toggles the founder's public passport. When `enabled` is true and no
 * share token exists yet, generates one. When false, the row is hidden
 * (token kept so toggling back on preserves the link).
 *
 * Returns: { is_public, public_share_token, share_url }
 */
export async function POST(request: NextRequest) {
  const supabase = await createSupabaseServer()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return Response.json({ error: 'No autenticado' }, { status: 401 })
  }

  const body = (await request.json().catch(() => ({}))) as { enabled?: boolean }
  const enabled = body.enabled !== false // default true

  const { data: startup, error: loadErr } = await supabase
    .from('startups')
    .select('id, public_share_token')
    .eq('founder_id', user.id)
    .maybeSingle()

  if (loadErr || !startup) {
    return Response.json(
      { error: 'No tienes una startup registrada todavía.' },
      { status: 404 }
    )
  }

  let token = startup.public_share_token
  if (enabled && !token) {
    // 24-char URL-safe slug — collision odds are astronomical
    token = randomBytes(18).toString('base64url')
  }

  const { data: updated, error: updErr } = await supabase
    .from('startups')
    .update({
      is_public: enabled,
      public_share_token: token,
      updated_at: new Date().toISOString(),
    })
    .eq('id', startup.id)
    .select('is_public, public_share_token')
    .maybeSingle()

  if (updErr || !updated) {
    return Response.json({ error: 'Error guardando preferencia.' }, { status: 500 })
  }

  const baseUrl =
    process.env.NEXT_PUBLIC_SITE_URL ||
    request.headers.get('origin') ||
    `https://${request.headers.get('host')}`

  return Response.json({
    is_public: updated.is_public,
    public_share_token: updated.public_share_token,
    share_url: updated.public_share_token
      ? `${baseUrl}/passport/${updated.public_share_token}`
      : null,
  })
}
