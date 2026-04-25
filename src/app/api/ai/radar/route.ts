import { NextRequest } from 'next/server'
import { createSupabaseServer } from '@/lib/supabase-server'
import { chatCompletion } from '@/lib/ai/client'
import {
  checkAndLogAIUsage,
  rateLimitHeaders,
  type RateLimitRole,
} from '@/lib/rate-limit'

export const dynamic = 'force-dynamic'

/* ─── Types ─── */
interface NewsItemRow {
  id: string
  title: string
  summary: string | null
  source: string | null
  source_url: string | null
  category: string | null
  vertical_tags: string[] | null
  country_tags: string[] | null
  created_at: string
}

interface RadarRequestBody {
  type: 'founder_insight' | 'org_digest'
}

interface RadarResponse {
  insight: string
  verticals: string[]
  newsCount: number
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

    const body = (await request.json()) as RadarRequestBody
    const { type } = body

    if (type !== 'founder_insight' && type !== 'org_digest') {
      return Response.json({ error: 'Tipo de solicitud inválido.' }, { status: 400 })
    }

    // Load profile for rate-limit role
    const { data: profileRow } = await supabase
      .from('profiles')
      .select('role, org_id')
      .eq('id', user.id)
      .maybeSingle()

    const role: RateLimitRole =
      profileRow?.role === 'admin_org' || profileRow?.role === 'superadmin'
        ? (profileRow.role as RateLimitRole)
        : 'founder'

    // Rate-limit check
    const rateLimit = await checkAndLogAIUsage(supabase, user.id, 'radar', role)
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

    if (type === 'founder_insight') {
      return await handleFounderInsight(supabase, user.id)
    } else {
      return await handleOrgDigest(supabase, user.id, profileRow?.org_id ?? null)
    }
  } catch (err) {
    console.error('[S4C AI] radar route unhandled error:', err)
    return Response.json({ error: 'Error interno del servidor.' }, { status: 500 })
  }
}

/* ─── Founder insight ─── */
async function handleFounderInsight(
  supabase: Awaited<ReturnType<typeof createSupabaseServer>>,
  userId: string
): Promise<Response> {
  // Load startup profile
  const { data: startupRow } = await supabase
    .from('startups')
    .select('vertical, stage, country')
    .eq('founder_id', userId)
    .maybeSingle()

  const vertical = startupRow?.vertical ?? null
  const stage = startupRow?.stage ?? 'temprana'
  const country = startupRow?.country ?? 'LATAM'

  // Load last 10 active news, filtered by vertical if possible
  const { data: allNews, error: newsError } = await supabase
    .from('news_items')
    .select('id, title, summary, source, source_url, category, vertical_tags, country_tags, created_at')
    .eq('is_active', true)
    .order('created_at', { ascending: false })
    .limit(10)

  if (newsError) {
    console.error('[S4C AI] radar news fetch error (founder):', newsError.message)
    return Response.json({ error: 'Error al cargar noticias.' }, { status: 500 })
  }

  const newsRows = (allNews ?? []) as NewsItemRow[]

  // Filter to vertical-matching items; fall back to all if none match
  let relevantNews = newsRows
  if (vertical) {
    const vLower = vertical.toLowerCase()
    const matched = newsRows.filter(
      (n) =>
        Array.isArray(n.vertical_tags) &&
        n.vertical_tags.some((t) => t.toLowerCase().includes(vLower) || vLower.includes(t.toLowerCase()))
    )
    if (matched.length > 0) {
      relevantNews = matched
    }
  }

  if (relevantNews.length === 0) {
    return Response.json({ insight: '', verticals: [], newsCount: 0 })
  }

  const newsJson = JSON.stringify(
    relevantNews.map((n) => ({
      title: n.title,
      summary: n.summary,
      category: n.category,
    }))
  )

  const prompt = `Eres un radar de ecosistema de innovación para LATAM. El founder tiene una startup de ${vertical ?? 'tecnología sostenible'} en etapa ${stage} en ${country}.

Basándote en estas noticias recientes del ecosistema, genera un insight estratégico de 3-4 oraciones en español (es-419) que:
1. Identifique la tendencia más relevante para su vertical
2. Mencione una oportunidad o riesgo concreto
3. Sugiera una acción específica que podría tomar esta semana

Noticias: ${newsJson}

Responde SOLO con el insight, sin títulos ni bullets.`

  try {
    const completion = await chatCompletion(
      [{ role: 'user', content: prompt }],
      { max_tokens: 200 }
    )
    const insight = completion.choices[0]?.message?.content?.trim() ?? ''
    return Response.json({
      insight,
      verticals: vertical ? [vertical] : [],
      newsCount: relevantNews.length,
    })
  } catch (err) {
    console.error('[S4C AI] radar founder insight generation failed:', err)
    return Response.json({ error: 'Error al generar insight.' }, { status: 500 })
  }
}

/* ─── Org digest ─── */
async function handleOrgDigest(
  supabase: Awaited<ReturnType<typeof createSupabaseServer>>,
  userId: string,
  orgId: string | null
): Promise<Response> {
  if (!orgId) {
    return Response.json({ error: 'No tienes una organización asociada.' }, { status: 400 })
  }

  // Load cohort founders' verticals via: cohorts → cohort_startups → startups
  const { data: cohortsData } = await supabase
    .from('cohorts')
    .select('id')
    .eq('org_id', orgId)
    .eq('status', 'active')

  const cohortIds = (cohortsData ?? []).map((c: { id: string }) => c.id)

  let uniqueVerticals: string[] = []

  if (cohortIds.length > 0) {
    const { data: cohortStartups } = await supabase
      .from('cohort_startups')
      .select('startup_id')
      .in('cohort_id', cohortIds)

    const startupIds = (cohortStartups ?? []).map((cs: { startup_id: string }) => cs.startup_id)

    if (startupIds.length > 0) {
      const { data: startupRows } = await supabase
        .from('startups')
        .select('vertical')
        .in('id', startupIds)
        .not('vertical', 'is', null)

      const verticals = (startupRows ?? [])
        .map((s: { vertical: string | null }) => s.vertical)
        .filter((v): v is string => v !== null && v.trim() !== '')

      uniqueVerticals = [...new Set(verticals)]
    }
  }

  // Load last 15 active news
  const { data: allNews, error: newsError } = await supabase
    .from('news_items')
    .select('id, title, summary, source, source_url, category, vertical_tags, country_tags, created_at')
    .eq('is_active', true)
    .order('created_at', { ascending: false })
    .limit(15)

  if (newsError) {
    console.error('[S4C AI] radar news fetch error (org):', newsError.message)
    return Response.json({ error: 'Error al cargar noticias.' }, { status: 500 })
  }

  const newsRows = (allNews ?? []) as NewsItemRow[]

  if (newsRows.length === 0) {
    return Response.json({ insight: '', verticals: uniqueVerticals, newsCount: 0 })
  }

  const verticalsLabel =
    uniqueVerticals.length > 0 ? uniqueVerticals.join(', ') : 'tecnología sostenible e impacto'

  const newsJson = JSON.stringify(
    newsRows.map((n) => ({
      title: n.title,
      summary: n.summary,
      category: n.category,
    }))
  )

  const prompt = `Eres un radar de ecosistema para gestores de programas de innovación en LATAM. Tu cohort tiene startups en los siguientes sectores: ${verticalsLabel}.

Basándote en estas noticias recientes, genera un digest ejecutivo de 4-5 oraciones en español (es-419) para el gestor del programa que:
1. Identifique las 2-3 tendencias más relevantes para los sectores de tu cohort
2. Mencione oportunidades de funding o regulación que afecten a tus founders
3. Sugiera un tema para la próxima sesión de mentoría grupal

Noticias: ${newsJson}

Responde SOLO con el digest ejecutivo, sin títulos.`

  try {
    const completion = await chatCompletion(
      [{ role: 'user', content: prompt }],
      { max_tokens: 250 }
    )
    const insight = completion.choices[0]?.message?.content?.trim() ?? ''
    return Response.json({
      insight,
      verticals: uniqueVerticals,
      newsCount: newsRows.length,
    })
  } catch (err) {
    console.error('[S4C AI] radar org digest generation failed:', err)
    return Response.json({ error: 'Error al generar digest.' }, { status: 500 })
  }
}
