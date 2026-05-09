import { NextRequest, NextResponse } from 'next/server'
import { createSupabaseServer } from '@/lib/supabase-server'
import { createClient } from '@supabase/supabase-js'

export const dynamic = 'force-dynamic'
export const runtime = 'nodejs'
export const maxDuration = 60

// RSS feeds — climate tech, impact, LATAM innovation
const FEEDS = [
  { url: 'https://latamlist.com/feed/', source_name: 'LatamList', default_type: 'news' as const },
  { url: 'https://contxto.com/en/feed/', source_name: 'Contxto', default_type: 'investment' as const },
  { url: 'https://labsnews.com/en/feed/', source_name: 'LABS News', default_type: 'news' as const },
  { url: 'https://agfundernews.com/feed/', source_name: 'AgFunder News', default_type: 'trend' as const },
  { url: 'https://pulsosocial.com/feed/', source_name: 'Pulso Social', default_type: 'news' as const },
  { url: 'https://www.bloomberglinea.com/feed/', source_name: 'Bloomberg Línea', default_type: 'investment' as const },
  { url: 'https://techcrunch.com/tag/climate/feed/', source_name: 'TechCrunch Climate', default_type: 'trend' as const },
  { url: 'https://climatetechvc.org/feed/', source_name: 'ClimateTech VC', default_type: 'investment' as const },
  { url: 'https://cleanenergyfinanceforum.com/feed/', source_name: 'Clean Energy Finance', default_type: 'investment' as const },
]

function decodeHtml(s: string): string {
  return s.replace(/&amp;/g,'&').replace(/&lt;/g,'<').replace(/&gt;/g,'>').replace(/&quot;/g,'"').replace(/&#39;/g,"'").replace(/&nbsp;/g,' ')
}
function stripTags(html: string): string {
  return html.replace(/<[^>]*>/g,' ').replace(/\s+/g,' ').trim()
}
function extractCDATA(block: string): string {
  const m = /<!\[CDATA\[([\s\S]*?)\]\]>/.exec(block)
  return m ? m[1] : block
}
function extractTag(xml: string, tag: string): string | null {
  const m = new RegExp(`<${tag}[^>]*>([\\s\\S]*?)</${tag}>`, 'i').exec(xml)
  if (!m) return null
  return decodeHtml(extractCDATA(m[1])).trim()
}

const VERTICAL_KEYWORDS: Record<string, string[]> = {
  cleantech_climatech: ['climate','carbon','emission','solar','renewable','green','sustainability','cleantech'],
  agritech_foodtech: ['agritech','foodtech','agriculture','farm','food'],
  fintech: ['fintech','banking','payment','crypto'],
  healthtech: ['healthtech','health','medical','biotech'],
  edtech: ['edtech','education','learning'],
}
const COUNTRY_KEYWORDS: Record<string, string[]> = {
  PE: ['peru','perú','lima'],
  CL: ['chile','santiago'],
  CO: ['colombia','bogotá','bogota'],
  MX: ['mexico','méxico'],
  AR: ['argentina','buenos aires'],
  BR: ['brazil','brasil'],
}

function classify(text: string) {
  const lower = text.toLowerCase()
  let vertical: string | null = null
  for (const [v, kws] of Object.entries(VERTICAL_KEYWORDS)) {
    if (kws.some(k => lower.includes(k))) { vertical = v; break }
  }
  let country: string | null = null
  for (const [c, kws] of Object.entries(COUNTRY_KEYWORDS)) {
    if (kws.some(k => lower.includes(k))) { country = c; break }
  }
  return { vertical, country }
}

async function callGemini(prompt: string): Promise<string | null> {
  const apiKey = process.env.GEMINI_API_KEY
  if (!apiKey) return null
  try {
    const res = await fetch(
      'https://generativelanguage.googleapis.com/v1beta/openai/chat/completions',
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${apiKey}` },
        body: JSON.stringify({
          model: 'gemini-2.5-flash',
          messages: [{ role: 'user', content: prompt }],
          max_tokens: 3000,
        }),
        signal: AbortSignal.timeout(30000),
      }
    )
    if (!res.ok) return null
    const json = await res.json() as { choices?: Array<{ message?: { content?: string } }> }
    return json.choices?.[0]?.message?.content ?? null
  } catch {
    return null
  }
}

export async function POST(_request: NextRequest) {
  // Verify admin auth
  const supabase = await createSupabaseServer()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { data: profile } = await supabase.from('profiles').select('role').eq('id', user.id).maybeSingle()
  if (!profile || !['admin_org', 'superadmin'].includes(profile.role ?? '')) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
  }

  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  if (!serviceKey || !supabaseUrl) {
    return NextResponse.json({ error: 'Server config error' }, { status: 500 })
  }
  const adminDb = createClient(supabaseUrl, serviceKey, {
    auth: { persistSession: false, autoRefreshToken: false },
  })

  const stats = { rss_inserted: 0, ai_inserted: 0, errors: [] as string[] }

  // ── Phase 1: RSS feeds ──
  for (const feed of FEEDS) {
    try {
      const res = await fetch(feed.url, {
        headers: { 'User-Agent': 'Startups4ClimateBot/1.0' },
        signal: AbortSignal.timeout(12000),
      })
      if (!res.ok) { stats.errors.push(`${feed.source_name}: HTTP ${res.status}`); continue }
      const xml = await res.text()
      const items: Array<{ title: string; link: string; description: string | null; pubDate: string | null }> = []
      const itemRegex = /<item[^>]*>([\s\S]*?)<\/item>/gi
      let m: RegExpExecArray | null
      while ((m = itemRegex.exec(xml)) !== null) {
        const block = m[1]
        const title = extractTag(block, 'title')
        const link = extractTag(block, 'link')
        const description = extractTag(block, 'description')
        const pubDate = extractTag(block, 'pubDate')
        if (title && link) {
          items.push({ title, link, description: description ? stripTags(description).slice(0, 500) : null, pubDate })
        }
      }
      for (const item of items.slice(0, 15)) {
        const { vertical, country } = classify(`${item.title} ${item.description || ''}`)
        const { error } = await adminDb.from('news_items').upsert({
          title: item.title.slice(0, 500),
          summary: item.description,
          source_name: feed.source_name,
          source_url: item.link,
          vertical,
          country,
          content_type: feed.default_type,
          published_at: item.pubDate ? new Date(item.pubDate).toISOString() : null,
          scraped_at: new Date().toISOString(),
          is_active: true,
        }, { onConflict: 'source_url', ignoreDuplicates: false })
        if (error) stats.errors.push(`RSS upsert: ${error.message}`)
        else stats.rss_inserted++
      }
    } catch (err) {
      stats.errors.push(`${feed.source_name}: ${err instanceof Error ? err.message : 'unknown'}`)
    }
  }

  // ── Phase 2: Gemini-generated curated items ──
  // Note: source_url for AI items is set server-side as a Google News search URL
  // (unique per title, always working, finds the actual article). Gemini only provides
  // the title, summary, source_name, content_type, vertical, country.
  const aiPrompt = `Eres un curador de noticias del ecosistema de startups de impacto en Latinoamérica.
Genera exactamente 15 noticias recientes y relevantes del ecosistema LATAM de startups de clima, agritech, fintech, healthtech y emprendimiento de impacto. Incluye al menos 5 sobre cleantech/clima, 3 sobre agritech, 3 sobre inversión/fondos, 2 sobre regulación y 2 sobre programas de aceleración.
Responde SOLO con un array JSON válido, sin texto adicional:
[
  {
    "title": "Título de la noticia en español (máx 120 caracteres). Sé específico: incluye nombre de empresa, monto, país.",
    "summary": "Resumen en español de 80-120 palabras. Datos concretos: montos, porcentajes, países, nombres de empresas. Sin clichés.",
    "source_name": "Nombre del medio real (e.g. Contxto, LatamList, Bloomberg Línea, Reuters, Gestión, El Economista, El Cronista, AgFunder News)",
    "content_type": "news|investment|trend|regulation|event|report",
    "vertical": "cleantech_climatech|agritech_foodtech|fintech|healthtech|edtech|logistics_mobility|other o null",
    "country": "PE|CL|CO|MX|AR|BR o null si es LATAM regional"
  }
]
NO incluyas campo source_url — se generará automáticamente.
Enfócate en: rondas de inversión, regulación ambiental, programas de aceleración, tendencias de mercado, fondos de impacto. Usa datos realistas de 2025-2026. Cada noticia debe ser distinta y específica.`

  const aiResponse = await callGemini(aiPrompt)
  if (aiResponse) {
    try {
      const jsonMatch = /\[[\s\S]*\]/.exec(aiResponse)
      if (jsonMatch) {
        const items = JSON.parse(jsonMatch[0]) as Array<{
          title: string; summary: string; source_name: string;
          content_type: string; vertical: string | null; country: string | null
        }>
        for (const item of items) {
          if (!item.title) continue
          // Build a Google News search URL — unique per title, always functional, finds the real article
          const searchUrl = `https://news.google.com/search?q=${encodeURIComponent(item.title.slice(0, 100))}&hl=es-419&gl=US&ceid=US:es-419`
          const { error } = await adminDb.from('news_items').upsert({
            title: item.title.slice(0, 500),
            summary: item.summary?.slice(0, 800),
            source_name: item.source_name || 'S4C AI',
            source_url: searchUrl,
            vertical: item.vertical || null,
            country: item.country || null,
            content_type: (item.content_type as string) || 'news',
            published_at: new Date().toISOString(),
            scraped_at: new Date().toISOString(),
            is_active: true,
          }, { onConflict: 'source_url', ignoreDuplicates: false })
          if (error) stats.errors.push(`AI upsert: ${error.message}`)
          else stats.ai_inserted++
        }
      }
    } catch (err) {
      stats.errors.push(`AI parse: ${err instanceof Error ? err.message : 'unknown'}`)
    }
  }

  // Deactivate items older than 60 days
  await adminDb.from('news_items')
    .update({ is_active: false })
    .lt('published_at', new Date(Date.now() - 60 * 24 * 60 * 60 * 1000).toISOString())
    .eq('is_active', true)

  return NextResponse.json(stats)
}
