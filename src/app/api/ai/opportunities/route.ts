import { NextRequest } from 'next/server'
import { createSupabaseServer } from '@/lib/supabase-server'
import { chatCompletion } from '@/lib/ai/client'
import {
  checkAndLogAIUsage,
  rateLimitHeaders,
  type RateLimitRole,
} from '@/lib/rate-limit'

/* ─── Types ─── */
interface OpportunityRow {
  id: string
  title: string
  organization: string
  description: string | null
  type: string
  amount_min: number | null
  amount_max: number | null
  currency: string | null
  eligible_countries: string[] | null
  eligible_verticals: string[] | null
  eligible_stages: string[] | null
  application_url: string | null
  deadline: string | null
  is_rolling: boolean | null
  geographic_scope: string | null
  vertical_tags: string[] | null
  stage_requirements: string[] | null
}

interface MatchBreakdown {
  vertical_match: number
  stage_match: number
  country_match: number
  score_bonus: number
}

interface ScoredOpportunity extends OpportunityRow {
  matchScore: number
  matchBreakdown: MatchBreakdown
  aiBlurb?: string
}

interface StartupProfile {
  vertical: string | null
  stage: string | null
  country: string | null
  diagnostic_score: number | null
}

/* ─── Algorithmic scoring ─── */
function scoreOpportunity(
  op: OpportunityRow,
  startup: StartupProfile
): { score: number; breakdown: MatchBreakdown } {
  // vertical_match: use vertical_tags if present, else eligible_verticals
  const verticalTags: string[] = op.vertical_tags ?? op.eligible_verticals ?? []
  let vertical_match = 0
  if (startup.vertical) {
    const v = startup.vertical.toLowerCase()
    const exactMatch = verticalTags.some((t) => t.toLowerCase() === v)
    const partialMatch = verticalTags.some(
      (t) => t.toLowerCase().includes(v) || v.includes(t.toLowerCase())
    )
    if (exactMatch) {
      vertical_match = 40
    } else if (partialMatch) {
      vertical_match = 20
    }
  }

  // stage_match: use stage_requirements if present, else eligible_stages
  const stageReqs: string[] = op.stage_requirements ?? op.eligible_stages ?? []
  let stage_match = 0
  if (stageReqs.length === 0) {
    // Open to all stages
    stage_match = 20
  } else if (startup.stage) {
    const s = startup.stage.toLowerCase()
    const found = stageReqs.some((r) => r.toLowerCase() === s)
    if (found) stage_match = 30
  }

  // country_match: use eligible_countries
  const countries: string[] = op.eligible_countries ?? []
  let country_match = 0
  const geoScope = op.geographic_scope ?? ''
  if (startup.country) {
    if (countries.includes(startup.country)) {
      country_match = 20
    } else if (
      countries.length === 0 ||
      geoScope.toLowerCase().includes('latam') ||
      geoScope.toLowerCase().includes('regional')
    ) {
      country_match = 15
    }
  } else {
    // No country on startup — treat as regional LATAM match
    country_match = 15
  }

  // score_bonus
  const ds = startup.diagnostic_score ?? 0
  let score_bonus = 0
  if (ds >= 60) {
    score_bonus = 10
  } else if (ds >= 40) {
    score_bonus = 5
  }

  const score = Math.min(100, Math.max(0, vertical_match + stage_match + country_match + score_bonus))
  return { score, breakdown: { vertical_match, stage_match, country_match, score_bonus } }
}

/* ─── Route handler ─── */
export async function POST(request: NextRequest) {
  try {
    const supabase = await createSupabaseServer()

    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return Response.json({ error: 'No autenticado.' }, { status: 401 })
    }

    const body = (await request.json()) as {
      opportunityId?: string
      generateBlurbs?: boolean
    }

    const { opportunityId, generateBlurbs } = body

    // Load profile for role
    const { data: profileRow } = await supabase
      .from('profiles')
      .select('role, org_id')
      .eq('id', user.id)
      .maybeSingle()

    const role: RateLimitRole =
      profileRow?.role === 'admin_org' || profileRow?.role === 'superadmin'
        ? (profileRow.role as RateLimitRole)
        : 'founder'

    // Rate-limit only when AI blurbs are requested
    if (generateBlurbs) {
      const rateLimit = await checkAndLogAIUsage(supabase, user.id, 'opportunities', role)
      if (!rateLimit.allowed) {
        const minutes = Math.max(1, Math.ceil((rateLimit.resetAt.getTime() - Date.now()) / 60000))
        return Response.json(
          {
            error: `Has alcanzado el límite de generaciones por hora. Intenta en ${minutes} min.`,
            remaining: 0,
            resetAt: rateLimit.resetAt.toISOString(),
          },
          { status: 429, headers: rateLimitHeaders(rateLimit) }
        )
      }
    }

    // Admin role: return opportunities without personal matching
    if (role === 'admin_org' || role === 'superadmin') {
      const { data: opps, error: oppsError } = await supabase
        .from('opportunities')
        .select(
          'id,title,organization,description,type,amount_min,amount_max,currency,eligible_countries,eligible_verticals,eligible_stages,application_url,deadline,is_rolling,geographic_scope,vertical_tags,stage_requirements'
        )
        .eq('is_active', true)
        .order('deadline', { ascending: true, nullsFirst: false })

      if (oppsError) {
        console.error('[S4C AI] opportunities fetch error (admin):', oppsError.message)
        return Response.json({ error: 'Error al cargar oportunidades.' }, { status: 500 })
      }

      const scored: ScoredOpportunity[] = ((opps ?? []) as OpportunityRow[]).map((op) => ({
        ...op,
        matchScore: 0,
        matchBreakdown: { vertical_match: 0, stage_match: 0, country_match: 0, score_bonus: 0 },
      }))

      return Response.json({ opportunities: scored, note: 'admin_view' })
    }

    // Founder: load startup profile
    const { data: startupRow } = await supabase
      .from('startups')
      .select('vertical, stage, country, diagnostic_score')
      .eq('founder_id', user.id)
      .maybeSingle()

    const startup: StartupProfile = {
      vertical: startupRow?.vertical ?? null,
      stage: startupRow?.stage ?? null,
      country: startupRow?.country ?? null,
      diagnostic_score: startupRow?.diagnostic_score ?? null,
    }

    // Load opportunities (one or all)
    let oppsQuery = supabase
      .from('opportunities')
      .select(
        'id,title,organization,description,type,amount_min,amount_max,currency,eligible_countries,eligible_verticals,eligible_stages,application_url,deadline,is_rolling,geographic_scope,vertical_tags,stage_requirements'
      )
      .eq('is_active', true)

    if (opportunityId) {
      oppsQuery = oppsQuery.eq('id', opportunityId)
    }

    const { data: opps, error: oppsError } = await oppsQuery.order('deadline', {
      ascending: true,
      nullsFirst: false,
    })

    if (oppsError) {
      console.error('[S4C AI] opportunities fetch error:', oppsError.message)
      return Response.json({ error: 'Error al cargar oportunidades.' }, { status: 500 })
    }

    const rows = (opps ?? []) as OpportunityRow[]

    // Score all opportunities algorithmically
    const scored: ScoredOpportunity[] = rows.map((op) => {
      const { score, breakdown } = scoreOpportunity(op, startup)
      return { ...op, matchScore: score, matchBreakdown: breakdown }
    })

    // Sort descending by match score
    scored.sort((a, b) => b.matchScore - a.matchScore)

    // Generate AI blurbs if requested
    if (generateBlurbs && startup.vertical) {
      // When a specific opportunity is requested, generate for that one;
      // otherwise generate for top 5 with score >= 30
      const targets = opportunityId
        ? scored
        : scored.filter((op) => op.matchScore >= 30).slice(0, 5)

      await Promise.all(
        targets.map(async (op) => {
          try {
            const prompt = `Eres un asesor de startups de impacto en LATAM. En máximo 2 oraciones en español (es-419), explica por qué la oportunidad "${op.title}" de ${op.organization} es relevante para una startup de ${startup.vertical} en etapa ${startup.stage ?? 'temprana'} en ${startup.country ?? 'LATAM'} con score diagnóstico ${startup.diagnostic_score ?? 0}/100. Sé específico y directo. No uses "su startup", usa "tu startup".`

            const completion = await chatCompletion(
              [{ role: 'user', content: prompt }],
              { max_tokens: 120 }
            )

            const blurb = completion.choices[0]?.message?.content?.trim() ?? ''
            if (blurb) {
              op.aiBlurb = blurb
            }
          } catch (err) {
            // Never fail the whole request — just skip this blurb
            console.error('[S4C AI] blurb generation failed for', op.id, ':', err)
          }
        })
      )
    }

    return Response.json({ opportunities: scored })
  } catch (err) {
    console.error('[S4C AI] opportunities route unhandled error:', err)
    return Response.json({ error: 'Error interno del servidor.' }, { status: 500 })
  }
}
