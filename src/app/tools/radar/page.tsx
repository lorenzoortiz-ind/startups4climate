'use client'

import { useEffect, useMemo, useRef, useState } from 'react'
import { usePathname } from 'next/navigation'
import Link from 'next/link'
import { motion } from 'framer-motion'
import {
  ArrowLeft,
  Radio,
  Newspaper,
  Target,
  Clock,
  TrendingUp,
  Scale,
  Lightbulb,
  Award,
  ExternalLink,
  Calendar,
  FileText,
} from 'lucide-react'
import { supabase } from '@/lib/supabase'
import { useAuth } from '@/context/AuthContext'

/* ─── Types ─── */
type ContentType = 'news' | 'regulation' | 'investment' | 'trend' | 'event' | 'report'
type Tab = 'noticias' | 'vertical'

interface NewsRow {
  id: string
  title: string
  summary: string | null
  source_name: string | null
  source_url: string | null
  vertical: string | null
  country: string | null
  content_type: ContentType
  tags: string[] | null
  published_at: string | null
}

const TYPE_LABELS: Record<ContentType, string> = {
  news: 'Noticia',
  regulation: 'Regulación',
  investment: 'Inversión',
  trend: 'Tendencia',
  event: 'Programa',
  report: 'Reporte',
}

const TYPE_COLORS: Record<ContentType, { color: string; bg: string; border: string; accent: string }> = {
  news: { color: '#2A222B', bg: 'rgba(42,34,43,0.08)', border: 'rgba(42,34,43,0.2)', accent: '#2A222B' },
  regulation: { color: '#2A222B', bg: 'rgba(42,34,43,0.08)', border: 'rgba(42,34,43,0.2)', accent: '#2A222B' },
  investment: { color: '#1F77F6', bg: 'rgba(31,119,246,0.08)', border: 'rgba(31,119,246,0.2)', accent: '#1F77F6' },
  trend: { color: '#6366F1', bg: 'rgba(99,102,241,0.08)', border: 'rgba(99,102,241,0.2)', accent: '#6366F1' },
  event: { color: '#EC4899', bg: 'rgba(236,72,153,0.08)', border: 'rgba(236,72,153,0.2)', accent: '#EC4899' },
  report: { color: '#0EA5E9', bg: 'rgba(14,165,233,0.08)', border: 'rgba(14,165,233,0.2)', accent: '#0EA5E9' },
}

const TYPE_ICONS: Record<ContentType, typeof TrendingUp> = {
  news: Newspaper,
  regulation: Scale,
  investment: TrendingUp,
  trend: Lightbulb,
  event: Award,
  report: FileText,
}

const TABS: { id: Tab; label: string; icon: typeof Newspaper }[] = [
  { id: 'noticias', label: 'Noticias del ecosistema', icon: Newspaper },
  { id: 'vertical', label: 'Relevante para tu startup', icon: Target },
]

const COUNTRY_LABELS: Record<string, string> = {
  PE: 'Perú', CL: 'Chile', CO: 'Colombia', MX: 'México',
  AR: 'Argentina', BR: 'Brasil', EC: 'Ecuador',
}

function formatDate(iso: string | null): string {
  if (!iso) return ''
  return new Date(iso).toLocaleDateString('es', { day: '2-digit', month: 'short', year: 'numeric' })
}

function CategoryPill({ type }: { type: ContentType }) {
  const style = TYPE_COLORS[type]
  const Icon = TYPE_ICONS[type]
  return (
    <span
      style={{
        display: 'inline-flex', alignItems: 'center', gap: '0.25rem',
        padding: '0.125rem 0.5rem', borderRadius: 999,
        background: style.bg, border: `1px solid ${style.border}`,
        fontFamily: 'var(--font-body)', fontSize: 'var(--text-2xs)',
        fontWeight: 600, color: style.color, whiteSpace: 'nowrap',
      }}
    >
      <Icon size={10} />
      {TYPE_LABELS[type]}
    </span>
  )
}

function NewsCard({ item, index }: { item: NewsRow; index: number }) {
  const accent = TYPE_COLORS[item.content_type].accent
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, delay: 0.05 + index * 0.04, ease: 'easeOut' }}
      style={{
        padding: '1.25rem', borderRadius: 12,
        background: 'var(--color-bg-card)',
        border: '1px solid var(--color-border)',
        boxShadow: 'var(--shadow-card)',
        display: 'flex', flexDirection: 'column', gap: '0.5rem',
        overflowWrap: 'break-word', wordBreak: 'break-word',
      }}
      whileHover={{ boxShadow: 'var(--shadow-card-hover)', y: -2 }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap' }}>
        <CategoryPill type={item.content_type} />
        {item.country && (
          <span style={{ fontFamily: 'var(--font-body)', fontSize: 'var(--text-2xs)', color: 'var(--color-text-muted)', fontWeight: 600 }}>
            {COUNTRY_LABELS[item.country] || item.country}
          </span>
        )}
        <span style={{ marginLeft: 'auto', display: 'inline-flex', alignItems: 'center', gap: 4, fontFamily: 'var(--font-body)', fontSize: 'var(--text-2xs)', color: 'var(--color-text-muted)' }}>
          <Calendar size={10} /> {formatDate(item.published_at)}
        </span>
      </div>
      <h3 style={{ fontFamily: 'var(--font-heading)', fontSize: '0.875rem', fontWeight: 600, color: 'var(--color-ink)', lineHeight: 1.35, margin: 0 }}>
        {item.title}
      </h3>
      {item.summary && (
        <p style={{ fontFamily: 'var(--font-body)', fontSize: '0.8125rem', color: 'var(--color-text-secondary)', lineHeight: 1.6, margin: 0 }}>
          {item.summary}
        </p>
      )}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: 4, gap: 8, flexWrap: 'wrap' }}>
        {item.source_name && (
          <span style={{ fontFamily: 'var(--font-body)', fontSize: 'var(--text-xs)', color: 'var(--color-text-muted)' }}>
            Fuente: {item.source_name}
          </span>
        )}
        {item.source_url && (
          <a
            href={item.source_url.match(/^https?:\/\//) ? item.source_url : `https://${item.source_url}`}
            target="_blank"
            rel="noopener noreferrer"
            style={{
              display: 'inline-flex', alignItems: 'center', gap: 4,
              fontFamily: 'var(--font-body)', fontSize: '0.75rem', fontWeight: 600,
              color: accent, textDecoration: 'none',
            }}
          >
            Leer más <ExternalLink size={11} />
          </a>
        )}
      </div>
    </motion.div>
  )
}

export default function RadarPage() {
  const { appUser } = useAuth()
  const pathname = usePathname()
  const toolsBase = pathname.startsWith('/demo-tools') ? '/demo-tools' : '/tools'
  const [activeTab, setActiveTab] = useState<Tab>('noticias')
  const [items, setItems] = useState<NewsRow[]>([])
  const [startup, setStartup] = useState<{ vertical: string | null; country: string | null } | null>(null)
  const [loading, setLoading] = useState(true)
  const [aiInsight, setAiInsight] = useState<string | null>(null)
  const [aiLoading, setAiLoading] = useState(false)
  const insightFetched = useRef(false)
  // Filter state
  const [catFilter, setCatFilter] = useState<string>('Todos')
  const [regionFilter, setRegionFilter] = useState<string>('Todos')
  const [refreshing, setRefreshing] = useState(false)
  const isSuperadmin = appUser?.role === 'superadmin'

  const handleRefreshRadar = async () => {
    setRefreshing(true)
    try {
      const res = await fetch('/api/admin/refresh-radar', { method: 'POST' })
      const data = await res.json() as { rss_inserted?: number; ai_inserted?: number; errors?: string[] }
      if (res.ok) {
        window.location.reload()
      } else {
        console.error('[S4C Radar refresh]', data)
        alert('Error al refrescar. Ver consola.')
      }
    } catch (err) {
      console.error('[S4C Radar refresh]', err)
    } finally {
      setRefreshing(false)
    }
  }

  useEffect(() => {
    let cancelled = false
    async function load() {
      try {
        const newsPromise = supabase
          .from('news_items')
          .select('id,title,summary,source_name,source_url,vertical,country,content_type,tags,published_at')
          .eq('is_active', true)
          .order('published_at', { ascending: false })
          .limit(50)
        const userRes = await supabase.auth.getUser()
        const uid = userRes.data.user?.id
        const startupPromise = uid
          ? supabase.from('startups').select('vertical, country').eq('founder_id', uid).maybeSingle()
          : Promise.resolve({ data: null, error: null })

        const [newsRes, startupRes] = await Promise.all([newsPromise, startupPromise])
        if (cancelled) return
        if (newsRes.error) console.error('[S4C RADAR]', newsRes.error)
        setItems((newsRes.data as NewsRow[]) || [])
        setStartup(startupRes.data || null)
      } catch (err) {
        console.error('[S4C RADAR] load error:', err)
      } finally {
        if (!cancelled) setLoading(false)
      }
    }
    load()
    return () => { cancelled = true }
  }, [])

  // Fetch AI insight once per session, only for authenticated (non-demo) users
  useEffect(() => {
    if (insightFetched.current) return
    if (!appUser?.id) return
    insightFetched.current = true

    setAiLoading(true)
    fetch('/api/ai/radar', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ type: 'founder_insight' }),
    })
      .then(async (res) => {
        if (!res.ok) return
        const json = (await res.json()) as { insight?: string }
        if (json.insight) setAiInsight(json.insight)
      })
      .catch((err) => {
        console.error('[S4C AI] radar insight fetch failed:', err)
      })
      .finally(() => {
        setAiLoading(false)
      })
  }, [appUser?.id])

  const userVertical = startup?.vertical || 'tu vertical'

  // Items sorted so vertical-matching ones appear first in the "noticias" tab
  const sortedItems = useMemo(() => {
    if (!startup?.vertical) return items
    const vLower = startup.vertical.toLowerCase()
    const matches = (it: NewsRow) =>
      (it.vertical !== null && it.vertical !== undefined &&
        (it.vertical.toLowerCase().includes(vLower) || vLower.includes(it.vertical.toLowerCase())))
    const matched: NewsRow[] = []
    const rest: NewsRow[] = []
    for (const it of items) {
      if (matches(it)) matched.push(it)
      else rest.push(it)
    }
    return [...matched, ...rest]
  }, [items, startup?.vertical])

  const verticalItems = useMemo(() => {
    if (!startup) return items
    return items.filter((it) => {
      const verticalMatch = startup.vertical && it.vertical === startup.vertical
      const countryMatch = startup.country && it.country === startup.country
      const isGlobal = !it.country && !it.vertical
      return verticalMatch || countryMatch || isGlobal
    })
  }, [items, startup])

  const lastUpdated = items[0]?.published_at
    ? new Date(items[0].published_at).toLocaleDateString('es', { day: '2-digit', month: 'short', year: 'numeric' })
    : '—'

  const renderAiInsightCard = () => {
    if (!appUser?.id) return null
    if (!aiLoading && !aiInsight) return null
    return (
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: 'easeOut' }}
        style={{
          marginBottom: '1.5rem',
          padding: '1.25rem 1.5rem',
          borderRadius: 14,
          background: 'linear-gradient(135deg, rgba(99,102,241,0.07) 0%, rgba(31,119,246,0.05) 100%)',
          border: '1px solid rgba(99,102,241,0.2)',
          boxShadow: 'var(--shadow-card)',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.75rem' }}>
          <span style={{ fontSize: '1.1rem', lineHeight: 1 }}>✨</span>
          <span
            style={{
              fontFamily: 'var(--font-heading)',
              fontSize: '0.875rem',
              fontWeight: 700,
              color: '#6366F1',
              letterSpacing: '-0.01em',
            }}
          >
            Insight de la semana para tu startup
          </span>
        </div>
        {aiLoading ? (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            {[100, 85, 70].map((w, i) => (
              <div
                key={i}
                style={{
                  height: 14,
                  borderRadius: 7,
                  background: 'rgba(99,102,241,0.12)',
                  width: `${w}%`,
                  animation: 'pulse 1.5s ease-in-out infinite',
                }}
              />
            ))}
          </div>
        ) : (
          <p
            style={{
              fontFamily: 'var(--font-body)',
              fontSize: '0.875rem',
              color: 'var(--color-text-secondary)',
              lineHeight: 1.65,
              margin: 0,
            }}
          >
            {aiInsight}
          </p>
        )}
      </motion.div>
    )
  }

  const renderList = (list: NewsRow[]) => {
    if (loading) {
      return (
        <div style={{ padding: '3rem 1.5rem', textAlign: 'center', fontFamily: 'var(--font-body)', fontSize: '0.875rem', color: 'var(--color-text-muted)' }}>
          Cargando radar…
        </div>
      )
    }
    if (list.length === 0) {
      return (
        <div
          style={{
            padding: '3rem 1.5rem', textAlign: 'center',
            border: '1px dashed var(--color-border)', borderRadius: 12,
            background: 'var(--color-bg-card)',
          }}
        >
          <Radio size={28} color="var(--color-text-muted)" style={{ marginBottom: '0.5rem' }} />
          <p style={{ fontFamily: 'var(--font-body)', fontSize: '0.9rem', color: 'var(--color-text-secondary)', margin: 0 }}>
            Aún no hay noticias en este radar.
          </p>
        </div>
      )
    }
    return (
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(min(280px, 100%), 1fr))',
          gap: '1rem',
        }}
      >
        {list.map((item, i) => (
          <NewsCard key={item.id} item={item} index={i} />
        ))}
      </div>
    )
  }

  const CATEGORIES = ['Todos', 'Energía', 'Agua', 'Economía circular', 'Biodiversidad', 'Movilidad', 'Fondos']
  const REGIONS = ['Todos', 'LATAM', 'Perú', 'México', 'Colombia', 'Chile', 'Brasil']

  const REGION_COUNTRY_MAP: Record<string, string[]> = {
    'LATAM': [],   // show all
    'Perú': ['PE'],
    'México': ['MX'],
    'Colombia': ['CO'],
    'Chile': ['CL'],
    'Brasil': ['BR'],
  }

  // Map vertical names and content types to category filter
  const filtered = items.filter((item) => {
    const catOk = catFilter === 'Todos' ||
      (item.vertical?.toLowerCase().includes(catFilter.toLowerCase())) ||
      (catFilter === 'Fondos' && item.content_type === 'investment') ||
      (item.tags && item.tags.some((t) => t.toLowerCase().includes(catFilter.toLowerCase())))
    const regionOk = regionFilter === 'Todos' || regionFilter === 'LATAM' ||
      (item.country && (REGION_COUNTRY_MAP[regionFilter] ?? []).includes(item.country))
    return catOk && regionOk
  })

  return (
    <div style={{ maxWidth: 1200, margin: '0 auto', padding: '0 1.5rem' }}>
      {/* Page header */}
      <div style={{
        padding: '1.25rem 0',
        borderBottom: '1px solid rgba(255,255,255,0.07)',
        display: 'flex',
        alignItems: 'flex-end',
        justifyContent: 'space-between',
      }}>
        <div>
          <h1 style={{ fontSize: '1.125rem', fontWeight: 700, color: 'rgba(255,255,255,0.88)', margin: 0 }}>
            Radar
          </h1>
          <p style={{ fontSize: '0.6875rem', color: 'rgba(255,255,255,0.35)', margin: '0.25rem 0 0' }}>
            {loading ? 'Cargando…' : `${filtered.length} artículos · actualizado ${lastUpdated}`}
          </p>
        </div>
        {isSuperadmin && (
          <button
            onClick={handleRefreshRadar}
            disabled={refreshing}
            style={{
              marginLeft: 'auto', display: 'inline-flex', alignItems: 'center', gap: '0.375rem',
              padding: '0.375rem 0.875rem', borderRadius: 6,
              background: refreshing ? 'rgba(218,78,36,0.06)' : 'rgba(218,78,36,0.10)',
              border: '1px solid rgba(218,78,36,0.25)',
              fontFamily: 'var(--font-body)', fontSize: '0.75rem', fontWeight: 600,
              color: refreshing ? 'rgba(218,78,36,0.5)' : '#DA4E24',
              cursor: refreshing ? 'wait' : 'pointer',
            }}
          >
            {refreshing ? 'Actualizando…' : '✦ Actualizar con IA'}
          </button>
        )}
      </div>

      {/* Body */}
      <div style={{ display: 'flex', gap: '1.5rem', paddingTop: '1rem' }}>
        {/* Filters */}
        <div style={{
          width: 200,
          flexShrink: 0,
          borderRight: '1px solid rgba(255,255,255,0.06)',
          paddingRight: '0.75rem',
          display: 'flex',
          flexDirection: 'column',
          gap: '0.25rem',
        }}>
          <div style={{ fontSize: '0.6875rem', fontFamily: 'monospace', textTransform: 'uppercase', letterSpacing: '0.08em', color: 'rgba(255,255,255,0.2)', margin: '0 0 0.25rem' }}>
            Categoría
          </div>
          {CATEGORIES.map((cat) => (
            <button key={cat} onClick={() => setCatFilter(cat)} style={{
              fontSize: '0.8125rem', color: catFilter === cat ? '#DA4E24' : 'rgba(255,255,255,0.4)',
              background: catFilter === cat ? 'rgba(218,78,36,0.10)' : 'transparent',
              border: 'none', borderRadius: 5, padding: '4px 8px', cursor: 'pointer', textAlign: 'left',
            }}>
              {cat}
            </button>
          ))}
          <div style={{ height: 1, background: 'rgba(255,255,255,0.05)', margin: '0.5rem 0' }} />
          <div style={{ fontSize: '0.6875rem', fontFamily: 'monospace', textTransform: 'uppercase', letterSpacing: '0.08em', color: 'rgba(255,255,255,0.2)', margin: '0 0 0.25rem' }}>
            Región
          </div>
          {REGIONS.map((region) => (
            <button key={region} onClick={() => setRegionFilter(region)} style={{
              fontSize: '0.8125rem', color: regionFilter === region ? '#DA4E24' : 'rgba(255,255,255,0.4)',
              background: regionFilter === region ? 'rgba(218,78,36,0.10)' : 'transparent',
              border: 'none', borderRadius: 5, padding: '4px 8px', cursor: 'pointer', textAlign: 'left',
            }}>
              {region}
            </button>
          ))}
        </div>

        {/* List */}
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '0.375rem', paddingBottom: '1.5rem' }}>
          {loading ? (
            <div style={{ color: 'rgba(255,255,255,0.35)', fontSize: '0.75rem', padding: '2rem 0' }}>Cargando…</div>
          ) : filtered.length === 0 ? (
            <div style={{ color: 'rgba(255,255,255,0.35)', fontSize: '0.75rem', padding: '2rem 0' }}>Sin resultados para este filtro.</div>
          ) : filtered.map((item) => (
            <a
              key={item.id}
              href={item.source_url ?? '#'}
              target="_blank"
              rel="noopener noreferrer"
              style={{
                display: 'flex', alignItems: 'center', gap: '0.75rem',
                padding: '0.5rem 0.75rem', borderRadius: 7,
                border: '1px solid rgba(255,255,255,0.06)',
                background: '#111111', textDecoration: 'none', cursor: 'pointer',
                transition: 'border-color 0.15s, background 0.15s',
              }}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLElement).style.borderColor = 'rgba(255,255,255,0.12)'
                ;(e.currentTarget as HTMLElement).style.background = '#161616'
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLElement).style.borderColor = 'rgba(255,255,255,0.06)'
                ;(e.currentTarget as HTMLElement).style.background = '#111111'
              }}
            >
              <span style={{
                width: 5, height: 5, borderRadius: '50%',
                background: item.content_type === 'investment' ? '#3B82F6' : '#DA4E24',
                flexShrink: 0,
              }} />
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontSize: '0.9375rem', fontWeight: 600, color: 'rgba(255,255,255,0.88)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                  {item.title}
                </div>
                <div style={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.4)', marginTop: 2 }}>
                  {item.source_name}{item.published_at ? ` · ${new Date(item.published_at).toLocaleDateString('es-419', { day: 'numeric', month: 'short' })}` : ''}
                </div>
              </div>
              {(item.vertical || item.content_type) && (
                <span style={{
                  fontSize: '0.6875rem', fontFamily: 'monospace', borderRadius: 3, padding: '2px 6px',
                  background: item.content_type === 'investment' ? 'rgba(29,78,216,0.08)' : 'rgba(218,78,36,0.08)',
                  color: item.content_type === 'investment' ? 'rgba(59,130,246,0.7)' : 'rgba(218,78,36,0.7)',
                  flexShrink: 0, whiteSpace: 'nowrap',
                }}>
                  {item.vertical ?? TYPE_LABELS[item.content_type]}
                </span>
              )}
            </a>
          ))}
        </div>
      </div>

      <style>{`
        @media (max-width: 768px) {
          .radar-body { flex-direction: column !important; }
        }
      `}</style>
    </div>
  )
}
