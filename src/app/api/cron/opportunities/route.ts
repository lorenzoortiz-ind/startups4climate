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
- "application_url": string, URL real verificable de la organización
- "is_rolling": boolean
- "deadline": string ISO 8601 o null

REGLAS:
- Organizaciones REALES que operan en LATAM
- Montos realistas (grants: 5000-500000, accelerators: 20000-150000, funds: 100000-5000000)
- Mezcla oportunidades regionales con específicas de país
- NO repitas organización
- Genera exactamente 10 objetos`

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
    const content = (json.choices?.[0]?.message?.content ?? '').replace(/```json\s*/g, '').replace(/```/g, '')
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
