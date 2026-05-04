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
Genera exactamente 10 oportunidades REALES y ACTUALES (2025-2026) para founders de startups de clima, agritech, fintech, healthtech y emprendimiento de impacto en LATAM.

Incluye una mezcla de: grants, programas de aceleración, fondos de inversión, competencias y convocatorias.

Responde SOLO con un array JSON válido, sin texto adicional:
[
  {
    "title": "Nombre exacto de la oportunidad en español",
    "organization": "Nombre de la organización que ofrece (e.g. BID Lab, Wayra, CORFO, CONACYT, Village Capital)",
    "description": "Descripción en español de 60-100 palabras. Qué ofrece, para quién, beneficios concretos.",
    "type": "grant|accelerator|competition|fund|fellowship",
    "amount_min": null o número en USD,
    "amount_max": null o número en USD,
    "currency": "USD",
    "eligible_countries": ["PE","CL","CO","MX","AR","BR"] o subset específico,
    "eligible_verticals": ["cleantech_climatech","agritech_foodtech","fintech","healthtech","edtech","logistics_mobility","other"] o subset,
    "eligible_stages": ["idea","pre_seed","seed","series_a","growth"] o subset,
    "application_url": "URL verificada de la página principal de la organización o programa — NUNCA inventes subrutas.",
    "is_rolling": true si es convocatoria permanente, false si tiene deadline,
    "deadline": "2026-06-30T00:00:00Z" o null si is_rolling=true
  }
]
REGLAS:
- Usa organizaciones REALES que existen y operan en LATAM.
- Los montos deben ser realistas (grants: $5K-$500K, accelerators: $20K-$150K, funds: $100K-$5M).
- Mezcla oportunidades regionales (todo LATAM) con específicas de país.
- NO repitas la misma organización más de una vez.
- application_url DEBE ser una URL verificable real (homepage o sección principal).`

  try {
    const aiRes = await fetch(
      'https://generativelanguage.googleapis.com/v1beta/openai/chat/completions',
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${apiKey}` },
        body: JSON.stringify({
          model: 'gemini-2.5-flash',
          messages: [{ role: 'user', content: prompt }],
          max_tokens: 4000,
        }),
        signal: AbortSignal.timeout(45000),
      }
    )

    if (!aiRes.ok) {
      results.errors.push(`Gemini HTTP ${aiRes.status}`)
      return NextResponse.json(results, { status: 502 })
    }

    const json = await aiRes.json() as { choices?: Array<{ message?: { content?: string } }> }
    const content = json.choices?.[0]?.message?.content ?? ''
    const jsonMatch = /\[[\s\S]*\]/.exec(content)

    if (!jsonMatch) {
      results.errors.push('No valid JSON array in Gemini response')
      return NextResponse.json(results, { status: 502 })
    }

    const items = JSON.parse(jsonMatch[0]) as Array<{
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

    for (const item of items) {
      if (!item.title || !item.organization) continue

      const { data: existing } = await supabase
        .from('opportunities')
        .select('id')
        .eq('title', item.title.slice(0, 500))
        .eq('organization', item.organization)
        .maybeSingle()

      if (existing) {
        // Update existing
        const { error } = await supabase
          .from('opportunities')
          .update({
            description: item.description?.slice(0, 1000),
            type: item.type || 'grant',
            amount_min: item.amount_min,
            amount_max: item.amount_max,
            currency: item.currency || 'USD',
            eligible_countries: item.eligible_countries || [],
            eligible_verticals: item.eligible_verticals || [],
            eligible_stages: item.eligible_stages || [],
            application_url: item.application_url,
            is_rolling: item.is_rolling ?? false,
            deadline: item.deadline,
            is_active: true,
            updated_at: new Date().toISOString(),
          })
          .eq('id', existing.id)
        if (error) results.errors.push(`Update ${item.title}: ${error.message}`)
        else results.updated++
      } else {
        // Insert new
        const { error } = await supabase
          .from('opportunities')
          .insert({
            title: item.title.slice(0, 500),
            organization: item.organization,
            description: item.description?.slice(0, 1000),
            type: item.type || 'grant',
            amount_min: item.amount_min,
            amount_max: item.amount_max,
            currency: item.currency || 'USD',
            eligible_countries: item.eligible_countries || [],
            eligible_verticals: item.eligible_verticals || [],
            eligible_stages: item.eligible_stages || [],
            application_url: item.application_url,
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
