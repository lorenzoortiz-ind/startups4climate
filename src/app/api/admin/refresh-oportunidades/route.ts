/**
 * POST /api/admin/refresh-oportunidades
 * Admin-triggered version of the opportunities cron.
 * Calls Gemini to generate/refresh curated opportunities and seeds Supabase.
 * Auth: admin_org or superadmin only.
 */
import { NextRequest, NextResponse } from 'next/server'
import { createSupabaseServer } from '@/lib/supabase-server'
import { createClient } from '@supabase/supabase-js'

export const dynamic = 'force-dynamic'
export const runtime = 'nodejs'
export const maxDuration = 60

function sanitizeJsonString(raw: string): string {
  return raw
    .replace(/[\x00-\x09\x0b\x0c\x0e-\x1f\x7f]/g, ' ')
    .replace(/\r?\n/g, ' ')
    .replace(/,\s*([}\]])/g, '$1')
}

const VERIFIED_ORG_URLS: Record<string, string> = {
  'bid lab': 'https://bidlab.org',
  'idb lab': 'https://bidlab.org',
  'wayra': 'https://www.wayra.com',
  'corfo': 'https://www.corfo.cl',
  'start-up chile': 'https://www.startupchile.org',
  'startup chile': 'https://www.startupchile.org',
  'innpulsa': 'https://www.innpulsacolombia.com',
  'fondep': 'https://www.fondep.gob.pe',
  'concytec': 'https://www.gob.pe/concytec',
  'prociencia': 'https://www.gob.pe/prociencia',
  'proinnovate': 'https://www.proinnovate.gob.pe',
  'endeavor': 'https://endeavor.org',
  'village capital': 'https://vilcap.com',
  'y combinator': 'https://www.ycombinator.com',
  'techstars': 'https://www.techstars.com',
  '500 global': 'https://500.co',
  'seedstars': 'https://www.seedstars.com',
  'kaszek': 'https://www.kaszek.com',
  'giz': 'https://www.giz.de',
  'usaid': 'https://www.usaid.gov',
  'green climate fund': 'https://www.greenclimate.fund',
  'climateworks': 'https://www.climateworks.org',
  'acumen': 'https://acumen.org',
  'google for startups': 'https://startup.google.com',
  'microsoft for startups': 'https://www.microsoft.com/en-us/startups',
  'fontagro': 'https://www.fontagro.org',
  'caf': 'https://www.caf.com',
  'fao': 'https://www.fao.org',
  'clean energy ventures': 'https://www.cleanenergyventures.com',
}

function resolveUrl(org: string, rawUrl: string): string {
  const orgLower = org.toLowerCase()
  for (const [key, url] of Object.entries(VERIFIED_ORG_URLS)) {
    if (orgLower.includes(key)) return url
  }
  try {
    return `${new URL(rawUrl).origin}/`
  } catch {
    return rawUrl
  }
}

export async function POST(_request: NextRequest) {
  // Auth: admin_org or superadmin
  const supabase = await createSupabaseServer()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { data: profile } = await supabase.from('profiles').select('role').eq('id', user.id).maybeSingle()
  if (!profile || !['admin_org', 'superadmin'].includes(profile.role ?? '')) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
  }

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY
  const apiKey = process.env.GEMINI_API_KEY
  if (!supabaseUrl || !serviceKey || !apiKey) {
    return NextResponse.json({ error: 'Server config error' }, { status: 500 })
  }

  const adminDb = createClient(supabaseUrl, serviceKey, {
    auth: { persistSession: false, autoRefreshToken: false },
  })

  const results = { inserted: 0, updated: 0, errors: [] as string[] }

  const prompt = `Eres un investigador de oportunidades de financiamiento para startups de impacto en América Latina.
Genera exactamente 10 oportunidades REALES y ACTUALES (2025-2026) para founders de startups de clima, agritech, fintech, healthtech y emprendimiento de impacto en LATAM.

Incluye: al menos 3 grants, 3 aceleradoras, 2 fondos de inversión, 1 competencia y 1 fellowship.

Responde SOLO con un array JSON válido. Sin texto antes ni después.

Cada objeto debe tener exactamente estas propiedades:
{
  "title": "nombre de la oportunidad en español",
  "organization": "nombre real de la organización",
  "description": "50-80 palabras en español, concreto y directo",
  "type": "grant|accelerator|competition|fund|fellowship",
  "amount_min": número o null,
  "amount_max": número o null,
  "currency": "USD",
  "eligible_countries": ["PE","CL","CO","MX","AR","BR"],
  "eligible_verticals": ["cleantech_climatech","agritech_foodtech","fintech","healthtech","other"],
  "eligible_stages": ["idea","pre_seed","seed","series_a","growth"],
  "application_url": "homepage real de la organización",
  "is_rolling": true o false,
  "deadline": "YYYY-MM-DD" o null
}

Organizaciones válidas: BID Lab, CORFO, Start-Up Chile, Innpulsa, Wayra, Seedstars, 500 Global, Endeavor, Proinnovate, CONCYTEC, CAF, FONTAGRO, GIZ, Green Climate Fund, ClimateLaunchpad, ClimateWorks, Village Capital, Techstars, Y Combinator, AWS Activate, Google for Startups, Acumen, Microsoft for Startups.
Montos realistas. NO repitas organizaciones. Genera exactamente 10 objetos.`

  try {
    const aiRes = await fetch(
      'https://generativelanguage.googleapis.com/v1beta/openai/chat/completions',
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${apiKey}` },
        body: JSON.stringify({
          model: 'gemini-2.5-flash',
          messages: [{ role: 'user', content: prompt }],
          max_tokens: 6000,
        }),
        signal: AbortSignal.timeout(50000),
      }
    )

    if (!aiRes.ok) {
      results.errors.push(`Gemini HTTP ${aiRes.status}`)
      return NextResponse.json(results, { status: 502 })
    }

    const rawJson = await aiRes.json() as { choices?: Array<{ message?: { content?: string } }> }
    const content = (rawJson.choices?.[0]?.message?.content ?? '')
      .replace(/```json\s*/gi, '').replace(/```/g, '').trim()
    const jsonMatch = /\[[\s\S]*\]/.exec(content)
    if (!jsonMatch) {
      results.errors.push('No valid JSON array from Gemini')
      return NextResponse.json(results, { status: 502 })
    }

    const items = JSON.parse(sanitizeJsonString(jsonMatch[0])) as Array<{
      title: string; organization: string; description: string; type: string
      amount_min: number | null; amount_max: number | null; currency: string
      eligible_countries: string[]; eligible_verticals: string[]
      eligible_stages: string[]; application_url: string
      is_rolling: boolean; deadline: string | null
    }>

    const VALID_TYPES = ['grant', 'accelerator', 'competition', 'fund', 'fellowship']

    for (const item of items) {
      if (!item.title || !item.organization) continue
      const itemType = VALID_TYPES.includes(item.type) ? item.type : 'grant'
      const verifiedUrl = resolveUrl(item.organization, item.application_url)

      const { data: existing } = await adminDb
        .from('opportunities')
        .select('id')
        .eq('title', item.title.slice(0, 500))
        .eq('organization', item.organization)
        .maybeSingle()

      if (existing) {
        const { error } = await adminDb.from('opportunities').update({
          description: item.description?.slice(0, 1000),
          type: itemType,
          amount_min: item.amount_min,
          amount_max: item.amount_max,
          currency: item.currency || 'USD',
          eligible_countries: item.eligible_countries || [],
          eligible_verticals: item.eligible_verticals || [],
          eligible_stages: item.eligible_stages || [],
          application_url: verifiedUrl,
          is_rolling: item.is_rolling ?? false,
          deadline: item.deadline,
          is_active: true,
        }).eq('id', existing.id)
        if (error) results.errors.push(`Update: ${error.message}`)
        else results.updated++
      } else {
        const { error } = await adminDb.from('opportunities').insert({
          title: item.title.slice(0, 500),
          organization: item.organization,
          description: item.description?.slice(0, 1000),
          type: itemType,
          amount_min: item.amount_min,
          amount_max: item.amount_max,
          currency: item.currency || 'USD',
          eligible_countries: item.eligible_countries || [],
          eligible_verticals: item.eligible_verticals || [],
          eligible_stages: item.eligible_stages || [],
          application_url: verifiedUrl,
          is_rolling: item.is_rolling ?? false,
          deadline: item.deadline,
          is_active: true,
        })
        if (error) results.errors.push(`Insert: ${error.message}`)
        else results.inserted++
      }
    }

    // Deactivate expired deadlines
    await adminDb.from('opportunities')
      .update({ is_active: false })
      .lt('deadline', new Date().toISOString())
      .eq('is_rolling', false)
      .eq('is_active', true)

  } catch (err) {
    results.errors.push(`Error: ${err instanceof Error ? err.message : 'unknown'}`)
  }

  console.log('[S4C OPORTUNIDADES REFRESH]', JSON.stringify(results))
  return NextResponse.json(results)
}
