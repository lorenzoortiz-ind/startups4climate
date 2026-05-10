import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

export const dynamic = 'force-dynamic'
export const runtime = 'nodejs'
export const maxDuration = 60

// Curated LATAM + Global climate & startup ecosystem feeds
const FEEDS: Array<{
  url: string
  source_name: string
  default_vertical: string | null
  default_country: string | null
  default_type: 'news' | 'investment' | 'trend'
}> = [
  // ── LATAM ecosystem ──
  { url: 'https://latamlist.com/feed/',              source_name: 'LatamList',           default_vertical: null,                  default_country: null, default_type: 'news' },
  { url: 'https://contxto.com/en/feed/',             source_name: 'Contxto',             default_vertical: null,                  default_country: null, default_type: 'investment' },
  { url: 'https://labsnews.com/en/feed/',            source_name: 'LABS News',           default_vertical: null,                  default_country: null, default_type: 'news' },
  { url: 'https://techcrunch.com/tag/latin-america/feed/', source_name: 'TechCrunch LATAM', default_vertical: null,              default_country: null, default_type: 'investment' },
  { url: 'https://www.pv-magazine-latam.com/feed/',  source_name: 'PV Magazine LATAM',   default_vertical: 'cleantech_climatech', default_country: null, default_type: 'news' },
  { url: 'https://startupeable.com/feed/',           source_name: 'Startupeable',        default_vertical: null,                  default_country: null, default_type: 'news' },
  { url: 'https://agfundernews.com/feed/',           source_name: 'AgFunder News',       default_vertical: 'agritech_foodtech',   default_country: null, default_type: 'trend' },
  { url: 'https://es.mongabay.com/feed/',            source_name: 'Mongabay LATAM',      default_vertical: 'cleantech_climatech', default_country: null, default_type: 'news' },
  // ── Global — USA ──
  { url: 'https://electrek.co/feed/',                source_name: 'Electrek',            default_vertical: 'cleantech_climatech', default_country: 'US', default_type: 'trend' },
  { url: 'https://cleantechnica.com/feed/',          source_name: 'CleanTechnica',       default_vertical: 'cleantech_climatech', default_country: 'US', default_type: 'trend' },
  { url: 'https://insideclimatenews.org/feed/',      source_name: 'Inside Climate News', default_vertical: 'cleantech_climatech', default_country: 'US', default_type: 'news' },
  { url: 'https://techcrunch.com/tag/climate/feed/', source_name: 'TechCrunch Climate',  default_vertical: 'cleantech_climatech', default_country: 'US', default_type: 'trend' },
  { url: 'https://www.canarymedia.com/rss',          source_name: 'Canary Media',        default_vertical: 'cleantech_climatech', default_country: 'US', default_type: 'trend' },
  { url: 'https://news.crunchbase.com/feed/',        source_name: 'Crunchbase News',     default_vertical: null,                  default_country: 'US', default_type: 'investment' },
  // ── Global — UK / Europa ──
  { url: 'https://www.carbonbrief.org/feed/',        source_name: 'Carbon Brief',        default_vertical: 'cleantech_climatech', default_country: 'GB', default_type: 'news' },
  { url: 'https://www.climatechangenews.com/feed/',  source_name: 'Climate Home News',   default_vertical: 'cleantech_climatech', default_country: 'GB', default_type: 'news' },
  { url: 'https://www.theguardian.com/environment/rss', source_name: 'The Guardian Environment', default_vertical: 'cleantech_climatech', default_country: 'GB', default_type: 'news' },
  { url: 'https://eu-startups.com/feed/',            source_name: 'EU Startups',         default_vertical: null,                  default_country: 'DE', default_type: 'investment' },
  // ── Global — Asia ──
  { url: 'https://www.techinasia.com/feed',          source_name: 'Tech in Asia',        default_vertical: null,                  default_country: 'SG', default_type: 'news' },
  { url: 'https://kr.asia/feed/',                    source_name: 'KrASIA',              default_vertical: null,                  default_country: 'SG', default_type: 'investment' },
]

// Vertical keywords for auto-tagging
const VERTICAL_KEYWORDS: Record<string, string[]> = {
  cleantech_climatech: ['climate', 'clean energy', 'solar', 'renewable', 'carbon', 'emission', 'sustainability', 'green', 'climático', 'energía renovable', 'sostenibilidad'],
  agritech_foodtech: ['agritech', 'foodtech', 'agriculture', 'farm', 'food', 'agricultura', 'alimento'],
  fintech: ['fintech', 'banking', 'payment', 'crypto', 'finanzas', 'pago'],
  healthtech: ['healthtech', 'health', 'medical', 'biotech', 'salud', 'médico'],
  edtech: ['edtech', 'education', 'learning', 'educación'],
  logistics_mobility: ['logistics', 'mobility', 'transport', 'logística', 'movilidad'],
}

const COUNTRY_KEYWORDS: Record<string, string[]> = {
  // LATAM
  PE: ['peru', 'perú', 'lima'],
  CL: ['chile', 'santiago'],
  CO: ['colombia', 'bogotá', 'bogota', 'medellín', 'medellin'],
  MX: ['mexico', 'méxico'],
  AR: ['argentina', 'buenos aires'],
  BR: ['brazil', 'brasil', 'são paulo', 'sao paulo'],
  // Global — Norte América
  US: ['united states', 'u.s.', 'usa', 'silicon valley', 'new york', 'california', 'washington d.c.', 'boston', 'chicago'],
  CA: ['canada', 'toronto', 'vancouver', 'montreal'],
  // Global — Europa
  GB: ['united kingdom', 'britain', 'u.k.', 'london', 'england', 'scotland'],
  DE: ['germany', 'deutschland', 'berlin', 'munich', 'münchen', 'hamburg'],
  FR: ['france', 'paris', 'lyon'],
  ES: ['spain', 'españa', 'madrid', 'barcelona'],
  NL: ['netherlands', 'amsterdam'],
  SE: ['sweden', 'stockholm'],
  // Global — Asia-Pacífico
  CN: ['china', 'beijing', 'shanghai', 'shenzhen', 'guangzhou'],
  IN: ['india', 'bangalore', 'mumbai', 'delhi', 'bengaluru'],
  JP: ['japan', 'tokyo', 'osaka'],
  KR: ['south korea', 'korea', 'seoul'],
  SG: ['singapore'],
  AU: ['australia', 'sydney', 'melbourne'],
}

function decodeHtml(s: string): string {
  return s
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&apos;/g, "'")
    .replace(/&#(\d+);/g, (_, d) => String.fromCharCode(parseInt(d, 10)))
    .replace(/&nbsp;/g, ' ')
}

function stripTags(html: string): string {
  return html.replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim()
}

function extractCDATA(block: string): string {
  // Match <![CDATA[...]]> or plain content between tags
  const cdata = /<!\[CDATA\[([\s\S]*?)\]\]>/.exec(block)
  return cdata ? cdata[1] : block
}

function extractTag(xml: string, tag: string): string | null {
  const re = new RegExp(`<${tag}[^>]*>([\\s\\S]*?)</${tag}>`, 'i')
  const m = re.exec(xml)
  if (!m) return null
  return decodeHtml(extractCDATA(m[1])).trim()
}

type ParsedItem = {
  title: string
  link: string
  description: string | null
  pubDate: string | null
}

function parseRss(xml: string): ParsedItem[] {
  const items: ParsedItem[] = []
  const itemRegex = /<item[^>]*>([\s\S]*?)<\/item>/gi
  let match: RegExpExecArray | null
  while ((match = itemRegex.exec(xml)) !== null) {
    const block = match[1]
    const title = extractTag(block, 'title')
    const link = extractTag(block, 'link')
    const description = extractTag(block, 'description')
    const pubDate = extractTag(block, 'pubDate')
    if (title && link) {
      items.push({
        title,
        link,
        description: description ? stripTags(description).slice(0, 600) : null,
        pubDate,
      })
    }
  }
  return items
}

function classifyItem(text: string): { vertical: string | null; country: string | null } {
  const lower = text.toLowerCase()

  let vertical: string | null = null
  for (const [vert, keywords] of Object.entries(VERTICAL_KEYWORDS)) {
    if (keywords.some((k) => lower.includes(k))) {
      vertical = vert
      break
    }
  }

  let country: string | null = null
  for (const [code, keywords] of Object.entries(COUNTRY_KEYWORDS)) {
    if (keywords.some((k) => lower.includes(k))) {
      country = code
      break
    }
  }

  return { vertical, country }
}

export async function GET(request: NextRequest) {
  // Vercel cron sets Authorization: Bearer ${CRON_SECRET}
  const authHeader = request.headers.get('authorization') || ''
  const cronSecret = process.env.CRON_SECRET
  if (!cronSecret || authHeader !== `Bearer ${cronSecret}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY
  if (!supabaseUrl || !serviceKey) {
    return NextResponse.json({ error: 'Supabase env missing' }, { status: 500 })
  }

  const supabase = createClient(supabaseUrl, serviceKey, {
    auth: { persistSession: false, autoRefreshToken: false },
  })

  const results = {
    feeds_processed: 0,
    items_fetched: 0,
    items_inserted: 0,
    errors: [] as string[],
  }

  for (const feed of FEEDS) {
    try {
      const res = await fetch(feed.url, {
        headers: { 'User-Agent': 'Startups4ClimateBot/1.0 (+https://startups4climate.org)' },
        signal: AbortSignal.timeout(15000),
      })
      if (!res.ok) {
        results.errors.push(`${feed.source_name}: HTTP ${res.status}`)
        continue
      }
      const xml = await res.text()
      const items = parseRss(xml).slice(0, 20) // cap per feed
      results.feeds_processed++
      results.items_fetched += items.length

      for (const item of items) {
        const text = `${item.title} ${item.description || ''}`
        const { vertical, country } = classifyItem(text)

        const published_at = item.pubDate ? new Date(item.pubDate).toISOString() : null

        const { error: upErr } = await supabase
          .from('news_items')
          .upsert({
            title: item.title.slice(0, 500),
            summary: item.description,
            source_name: feed.source_name,
            source_url: item.link,
            vertical: vertical || feed.default_vertical,
            country: country || feed.default_country,
            content_type: feed.default_type,
            published_at,
            scraped_at: new Date().toISOString(),
            is_active: true,
          }, { onConflict: 'source_url', ignoreDuplicates: false })

        if (upErr) {
          results.errors.push(`${feed.source_name} upsert: ${upErr.message}`)
        } else {
          results.items_inserted++
        }
      }
    } catch (err) {
      results.errors.push(`${feed.source_name}: ${err instanceof Error ? err.message : 'unknown'}`)
    }
  }

  // ── Phase 2: Gemini-generated curated items ──
  const apiKey = process.env.GEMINI_API_KEY
  if (apiKey) {
    try {
      // Note: source_url for AI items is set server-side as a Google News search URL
      // (unique per title, always working, finds the actual article)
      const aiPrompt = `Eres un curador de noticias globales de clima, cleantech y startups de impacto.
Genera exactamente 12 noticias (2025-2026). DISTRIBUCIÓN OBLIGATORIA:

BLOQUE LATAM (7 noticias):
- 2 energía/cleantech en LATAM
- 2 agritech/food en LATAM
- 1 movilidad sostenible en LATAM
- 2 inversión/fondos de impacto en LATAM

BLOQUE GLOBAL (5 noticias):
- 2 de USA (US): cleantech, VC o política climática
- 2 de Europa (GB/DE/FR/ES/NL/SE): clima o startups de impacto
- 1 de Asia (CN/IN/JP/KR/SG/AU): energía renovable o agritech

Responde SOLO con un array JSON válido, sin texto adicional:
[
  {
    "title": "Título en español (máx 120 caracteres). Específico: empresa, monto, país.",
    "summary": "80-120 palabras. Datos concretos: montos, porcentajes, países, nombres.",
    "source_name": "Medio real: Reuters, Bloomberg, TechCrunch, Guardian, Carbon Brief, Contxto, AgFunder, Nikkei Asia",
    "content_type": "news|investment|trend|regulation|event|report",
    "vertical": "cleantech_climatech|agritech_foodtech|fintech|healthtech|logistics_mobility|other",
    "country": "Código ISO 2 letras (PE|CL|CO|MX|AR|BR|US|GB|DE|FR|CN|IN|JP|KR|SG|AU|CA|ES|NL|SE|null para LATAM regional)"
  }
]
NO incluyas campo source_url. Usa datos realistas de 2025-2026.`

      const aiRes = await fetch(
        'https://generativelanguage.googleapis.com/v1beta/openai/chat/completions',
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${apiKey}` },
          body: JSON.stringify({
            model: 'gemini-2.5-flash',
            messages: [{ role: 'user', content: aiPrompt }],
            max_completion_tokens: 8000,
            response_format: { type: 'json_object' },
            reasoning_effort: 'none',
          }),
          signal: AbortSignal.timeout(30000),
        }
      )
      if (aiRes.ok) {
        const json = await aiRes.json() as { choices?: Array<{ message?: { content?: string } }> }
        const content = (json.choices?.[0]?.message?.content ?? '').replace(/```json\s*/g, '').replace(/```/g, '')
        const jsonMatch = /\[[\s\S]*\]/.exec(content)
        if (jsonMatch) {
          const items = JSON.parse(jsonMatch[0]) as Array<{
            title: string; summary: string; source_name: string;
            content_type: string; vertical: string | null; country: string | null
          }>
          for (const item of items) {
            if (!item.title) continue
            // Build a Google News search URL — unique per title, always functional, finds the real article
            const searchUrl = `https://news.google.com/search?q=${encodeURIComponent(item.title.slice(0, 100))}&hl=es-419&gl=US&ceid=US:es-419`
            const { error } = await supabase.from('news_items').upsert({
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
            if (error) results.errors.push(`AI upsert: ${error.message}`)
            else (results as Record<string, unknown>).ai_inserted = ((results as Record<string, unknown>).ai_inserted as number || 0) + 1
          }
        }
      }
    } catch (err) {
      results.errors.push(`Gemini: ${err instanceof Error ? err.message : 'unknown'}`)
    }
  }

  // Deactivate items older than 45 days to keep RADAR fresh
  await supabase
    .from('news_items')
    .update({ is_active: false })
    .lt('published_at', new Date(Date.now() - 45 * 24 * 60 * 60 * 1000).toISOString())
    .eq('is_active', true)

  console.log('[S4C RADAR]', JSON.stringify(results))

  return NextResponse.json(results)
}
