/**
 * GET /api/cron/opportunities
 * Daily cron: uses Gemini to generate/refresh curated opportunities
 * for LATAM impact startups (grants, accelerators, competitions, funds).
 * Protected by CRON_SECRET (Vercel cron header).
 */
import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

export const dynamic = 'force-dynamic'
export const runtime = 'nodejs'
export const maxDuration = 60

/** Clean Gemini JSON output for safe parsing */
function sanitizeJsonString(raw: string): string {
  return raw
    .replace(/[\x00-\x09\x0b\x0c\x0e-\x1f\x7f]/g, ' ') // strip all control chars except \n \r
    .replace(/\r?\n/g, ' ')                                // newlines to spaces (JSON allows it)
    .replace(/,\s*([}\]])/g, '$1')                         // trailing commas
}

// Known real organizations and their verified homepage URLs
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
  'proinnóvate': 'https://www.proinnovate.gob.pe',
  'proinnovate': 'https://www.proinnovate.gob.pe',
  'endeavor': 'https://endeavor.org',
  'village capital': 'https://vilcap.com',
  'y combinator': 'https://www.ycombinator.com',
  'techstars': 'https://www.techstars.com',
  '500 global': 'https://500.co',
  'seedstars': 'https://www.seedstars.com',
  'nxtp ventures': 'https://www.nxtpventures.com',
  'kaszek': 'https://www.kaszek.com',
  'cometa': 'https://www.cometa.com.co',
  'gridx': 'https://www.gridx.africa',
  'giz': 'https://www.giz.de',
  'usaid': 'https://www.usaid.gov',
  'green climate fund': 'https://www.greenclimate.fund',
  'clean energy ventures': 'https://www.cleanenergyventures.com',
  'climateworks': 'https://www.climateworks.org',
  'acumen': 'https://acumen.org',
  'omidyar network': 'https://omidyar.com',
  'google for startups': 'https://startup.google.com',
  'microsoft for startups': 'https://www.microsoft.com/en-us/startups',
  'aws activate': 'https://aws.amazon.com/activate/',
  'fontagro': 'https://www.fontagro.org',
  'caf': 'https://www.caf.com',
  'fao': 'https://www.fao.org',
}

/** Resolve application URL to a known verified homepage */
function resolveUrl(org: string, rawUrl: string): string {
  const orgLower = org.toLowerCase()
  for (const [key, url] of Object.entries(VERIFIED_ORG_URLS)) {
    if (orgLower.includes(key)) return url
  }
  // If Gemini gave a URL, use only the origin (homepage)
  try {
    const u = new URL(rawUrl)
    return `${u.origin}/`
  } catch {
    return rawUrl
  }
}

export async function GET(request: NextRequest) {
  // Vercel cron auth
  const authHeader = request.headers.get('authorization') || ''
  const cronSecret = process.env.CRON_SECRET
  if (!cronSecret || authHeader !== `Bearer ${cronSecret}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY
  const apiKey = process.env.GEMINI_API_KEY
  if (!supabaseUrl || !serviceKey) {
    return NextResponse.json({ error: 'Supabase env missing' }, { status: 500 })
  }
  if (!apiKey) {
    return NextResponse.json({ error: 'GEMINI_API_KEY missing' }, { status: 500 })
  }

  const supabase = createClient(supabaseUrl, serviceKey, {
    auth: { persistSession: false, autoRefreshToken: false },
  })

  const results = { inserted: 0, updated: 0, errors: [] as string[] }

  const prompt = `Eres un investigador de oportunidades de financiamiento para startups de impacto en América Latina.
Genera exactamente 5 oportunidades REALES y ACTUALES (2025-2026) para founders de startups de clima, agritech, fintech, healthtech y emprendimiento de impacto en LATAM.

Incluye una mezcla de: grants, programas de aceleración, fondos de inversión, competencias y convocatorias.

Responde SOLO con un array JSON válido. Sin texto antes ni después. Sin bloques de código markdown.

Cada objeto del array debe tener exactamente estas propiedades:
- "title": string, nombre de la oportunidad en español
- "organization": string, nombre real de la organización (BID Lab, Wayra, CORFO, etc.)
- "description": string, 60-100 palabras en español
- "type": string, uno de: "grant", "accelerator", "competition", "fund", "fellowship"
- "amount_min": number o null (en USD)
- "amount_max": number o null (en USD)
- "currency": "USD"
- "eligible_countries": array de strings, códigos ISO: "PE", "CL", "CO", "MX", "AR", "BR"
- "eligible_verticals": array de strings, valores: "cleantech_climatech", "agritech_foodtech", "fintech", "healthtech", "edtech", "logistics_mobility", "other"
- "eligible_stages": array de strings, valores: "idea", "pre_seed", "seed", "series_a", "growth"
- "application_url": string, URL HOMEPAGE de la organización (ej: "https://bidlab.org", "https://www.startupchile.org"). NUNCA inventes subrutas, usa SOLO el dominio raíz.
- "is_rolling": boolean
- "deadline": string ISO 8601 o null

REGLAS:
- SOLO organizaciones REALES que operan en LATAM (BID Lab, CORFO, Start-Up Chile, Innpulsa, Wayra, Seedstars, 500 Global, Endeavor, Proinnovate, CONCYTEC, CAF, FONTAGRO, Google for Startups, Techstars, Y Combinator, etc.)
- Montos realistas (grants: 5000-500000, accelerators: 20000-150000, funds: 100000-5000000)
- Mezcla oportunidades regionales con específicas de país
- NO repitas organización
- Genera exactamente 5 objetos
- Descripciones cortas de máximo 50 palabras
- application_url DEBE ser la homepage real de la organización. NUNCA generes URLs inventadas con paths específicos.`

  try {
    const aiRes = await fetch(
      'https://generativelanguage.googleapis.com/v1beta/openai/chat/completions',
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${apiKey}` },
        body: JSON.stringify({
          model: 'gemini-2.5-flash',
          messages: [{ role: 'user', content: prompt }],
          max_completion_tokens: 8000,
          response_format: { type: 'json_object' },
          reasoning_effort: 'none',
        }),
        signal: AbortSignal.timeout(55000),
      }
    )

    if (!aiRes.ok) {
      results.errors.push(`Gemini HTTP ${aiRes.status}`)
      return NextResponse.json(results, { status: 502 })
    }

    const rawJson = await aiRes.json() as Record<string, unknown>
    const content = (
      (rawJson as { choices?: Array<{ message?: { content?: string } }> }).choices?.[0]?.message?.content ?? ''
    ).replace(/```json\s*/gi, '').replace(/```/g, '').trim()
    const jsonMatch = /\[[\s\S]*\]/.exec(content)

    if (!jsonMatch) {
      results.errors.push(`No valid JSON array (len=${content.length})`)
      return NextResponse.json({ ...results, _debug: { content: content.slice(0, 800), keys: Object.keys(rawJson) } }, { status: 502 })
    }

    const sanitized = sanitizeJsonString(jsonMatch[0])

    let items: Array<{
      title: string
      organization: string
      description: string
      type: string
      amount_min: number | null
      amount_max: number | null
      currency: string
      eligible_countries: string[]
      eligible_verticals: string[]
      eligible_stages: string[]
      application_url: string
      is_rolling: boolean
      deadline: string | null
    }>

    try {
      items = JSON.parse(sanitized)
    } catch (parseErr) {
      results.errors.push(`JSON parse: ${parseErr instanceof Error ? parseErr.message : 'unknown'}`)
      const errPos = parseErr instanceof Error ? parseInt(parseErr.message.match(/position (\d+)/)?.[1] || '0') : 0
      return NextResponse.json({ ...results, _debug: sanitized.slice(Math.max(0, errPos - 100), errPos + 100), _pos: errPos, _totalLen: sanitized.length }, { status: 502 })
    }

    const VALID_TYPES = ['grant', 'accelerator', 'competition', 'fund', 'fellowship']

    for (const item of items) {
      if (!item.title || !item.organization) continue
      // Normalize type to valid enum
      const itemType = VALID_TYPES.includes(item.type) ? item.type : 'fund'

      const { data: existing } = await supabase
        .from('opportunities')
        .select('id')
        .eq('title', item.title.slice(0, 500))
        .eq('organization', item.organization)
        .maybeSingle()

      // Resolve URL to verified homepage
      const verifiedUrl = resolveUrl(item.organization, item.application_url)

      if (existing) {
        const { error } = await supabase
          .from('opportunities')
          .update({
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
            updated_at: new Date().toISOString(),
          })
          .eq('id', existing.id)
        if (error) results.errors.push(`Update ${item.title}: ${error.message}`)
        else results.updated++
      } else {
        const { error } = await supabase
          .from('opportunities')
          .insert({
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
        if (error) results.errors.push(`Insert ${item.title}: ${error.message}`)
        else results.inserted++
      }
    }

    // Deactivate opportunities with expired deadlines
    await supabase
      .from('opportunities')
      .update({ is_active: false })
      .lt('deadline', new Date().toISOString())
      .eq('is_rolling', false)
      .eq('is_active', true)

  } catch (err) {
    results.errors.push(`Gemini: ${err instanceof Error ? err.message : 'unknown'}`)
  }

  console.log('[S4C OPPORTUNITIES]', JSON.stringify(results))

  return NextResponse.json(results)
}
