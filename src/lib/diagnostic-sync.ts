import type { SupabaseClient } from '@supabase/supabase-js'

const ALLOWED_VERTICALS = new Set([
  'fintech',
  'healthtech',
  'edtech',
  'agritech_foodtech',
  'cleantech_climatech',
  'biotech_deeptech',
  'logistics_mobility',
  'saas_enterprise',
  'social_impact',
  'other',
])

const ALLOWED_STAGES = new Set([
  'pre_incubation',
  'incubation',
  'acceleration',
  'scaling',
])

// Maps DiagnosticForm dropdown labels (Spanish) to the enum values
// enforced by the startups.vertical CHECK constraint.
const VERTICAL_LABEL_MAP: Record<string, string> = {
  fintech: 'fintech',
  healthtech: 'healthtech',
  edtech: 'edtech',
  agritech: 'agritech_foodtech',
  'cleantech / energía': 'cleantech_climatech',
  'cleantech/energía': 'cleantech_climatech',
  'cleantech / energia': 'cleantech_climatech',
  cleantech: 'cleantech_climatech',
  'logística / movilidad': 'logistics_mobility',
  'logistica / movilidad': 'logistics_mobility',
  'logística/movilidad': 'logistics_mobility',
  'logistica/movilidad': 'logistics_mobility',
  biotech: 'biotech_deeptech',
  'deep tech': 'biotech_deeptech',
  deeptech: 'biotech_deeptech',
  proptech: 'other',
  otra: 'other',
  other: 'other',
}

export function normalizeVertical(raw: string | null | undefined): string {
  if (!raw) return 'other'
  const direct = raw.trim().toLowerCase()
  if (ALLOWED_VERTICALS.has(direct)) return direct
  return VERTICAL_LABEL_MAP[direct] ?? 'other'
}

export function normalizeStage(
  raw: number | string | null | undefined,
): string | null {
  if (raw == null) return null
  const s = String(raw).trim().toLowerCase()
  if (ALLOWED_STAGES.has(s)) return s
  switch (s) {
    case '1':
    case 'etapa 1':
      return 'pre_incubation'
    case '2':
    case 'etapa 2':
      return 'incubation'
    case '3':
    case 'etapa 3':
      return 'acceleration'
    case '4':
    case 'etapa 4':
      return 'scaling'
    default:
      return null
  }
}

export interface DiagnosticPayload {
  total_score?: number | null
  perfil_etapa?: number | string | null
  dimension_scores?: Record<string, number> | null
  answers?: Record<string, unknown> | null
  tags?: Record<string, unknown> | null
}

/**
 * Hydrate the founder's profile + startup row from a completed diagnostic.
 * Idempotent: re-running with the same input yields the same DB state.
 *
 * - profiles: writes stage, diagnostic_score, diagnostic_data
 * - startups: upserts vertical, country, stage, diagnostic_score,
 *   diagnostic_answers, score_by_dimension. Preserves an existing
 *   name when the row already exists; falls back to profiles.startup_name
 *   when inserting a new row.
 */
export async function applyDiagnosticToProfile(
  supabase: SupabaseClient,
  userId: string,
  payload: DiagnosticPayload,
): Promise<{ ok: boolean; error?: string }> {
  if (!userId) return { ok: false, error: 'missing userId' }

  const answers = (payload.answers ?? {}) as Record<string, unknown>
  const verticalRaw =
    typeof answers.vertical === 'string' ? answers.vertical : null
  const countryRaw =
    typeof answers.country === 'string' ? answers.country : null

  const vertical = normalizeVertical(verticalRaw)
  const stage = normalizeStage(payload.perfil_etapa ?? null)

  const profileUpdate: Record<string, unknown> = {
    diagnostic_data: payload.answers ?? {},
  }
  if (stage) profileUpdate.stage = stage
  if (payload.total_score != null) {
    profileUpdate.diagnostic_score = payload.total_score
  }

  const { error: profileErr } = await supabase
    .from('profiles')
    .update(profileUpdate)
    .eq('id', userId)
  if (profileErr) {
    console.error('[S4C Sync] applyDiagnostic profile update:', profileErr)
  }

  // Fetch existing startup so we know whether we need a `name` for INSERT
  // and so we can preserve user-edited fields like description/team_size.
  const { data: existing } = await supabase
    .from('startups')
    .select('id, name, country')
    .eq('founder_id', userId)
    .maybeSingle()

  const startupPayload: Record<string, unknown> = {
    founder_id: userId,
    vertical,
    country: countryRaw || existing?.country || 'Perú',
    diagnostic_answers: payload.answers ?? null,
    score_by_dimension: payload.dimension_scores ?? null,
  }
  if (stage) startupPayload.stage = stage
  if (payload.total_score != null) {
    startupPayload.diagnostic_score = payload.total_score
  }

  if (existing) {
    startupPayload.name = existing.name
  } else {
    const { data: profileRow } = await supabase
      .from('profiles')
      .select('startup_name')
      .eq('id', userId)
      .maybeSingle()
    startupPayload.name = profileRow?.startup_name?.trim() || 'Mi startup'
  }

  const { error: startupErr } = await supabase
    .from('startups')
    .upsert(startupPayload, { onConflict: 'founder_id' })
  if (startupErr) {
    console.error('[S4C Sync] applyDiagnostic startup upsert:', startupErr)
    return { ok: false, error: startupErr.message }
  }

  return { ok: true }
}
