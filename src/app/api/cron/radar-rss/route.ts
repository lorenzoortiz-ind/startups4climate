import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

export const dynamic = 'force-dynamic'
export const runtime = 'nodejs'
export const maxDuration = 60

// Curated LATAM climate + startup ecosystem feeds
const FEEDS: Array<{
  url: string
  source_name: string
  default_vertical: string | null
  default_country: string | null
  default_type: 'news' | 'investment' | 'trend'
}> = [
  {
    url: 'https://latamlist.com/feed/',
    source_name: 'LatamList',
    default_vertical: null,
    default_country: null,
    default_type: 'news',
  },
  {
    url: 'https://contxto.com/en/feed/',
    source_name: 'Contxto',
    default_vertical: null,
    default_country: null,
    default_type: 'investment',
  },
  {
    url: 'https://labsnews.com/en/feed/',
    source_name: 'LABS News',
    default_vertical: null,
    default_country: null,
    default_type: 'news',
  },
  {
    url: 'https://agfundernews.com/feed/',
    source_name: 'AgFunder News',
    default_vertical: 'agritech_foodtech',
    default_country: null,
    default_type: 'trend',
  },
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
  PE: ['peru', 'perú', 'lima'],
  CL: ['chile', 'santiago'],
  CO: ['colombia', 'bogotá', 'bogota', 'medellín', 'medellin'],
  MX: ['mexico', 'méxico'],
  AR: ['argentina', 'buenos aires'],
  BR: ['brazil', 'brasil', 'são paulo', 'sao paulo'],
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

  // Deactivate items older than 45 days to keep RADAR fresh
  await supabase
    .from('news_items')
    .update({ is_active: false })
    .lt('published_at', new Date(Date.now() - 45 * 24 * 60 * 60 * 1000).toISOString())
    .eq('is_active', true)

  console.log('[S4C RADAR]', JSON.stringify(results))

  return NextResponse.json(results)
}
