'use client'

import { useEffect, useMemo, useState } from 'react'
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
        borderTop: `2px solid ${accent}`,
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
          <span style={{ fontFamily: 'var(--font-body)', fontSize: 'var(--text-xs)', color: 'var(--color-text-muted)', fontStyle: 'italic' }}>
            Fuente: {item.source_name}
          </span>
        )}
        {item.source_url && (
          <a
            href={item.source_url}
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
  const [activeTab, setActiveTab] = useState<Tab>('noticias')
  const [items, setItems] = useState<NewsRow[]>([])
  const [startup, setStartup] = useState<{ vertical: string | null; country: string | null } | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let cancelled = false
    async function load() {
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
      setLoading(false)
    }
    load()
    return () => { cancelled = true }
  }, [])

  const userVertical = startup?.vertical || 'tu vertical'

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

  return (
    <div style={{ padding: '2rem', maxWidth: 960, margin: '0 auto' }}>
      <Link
        href="/tools"
        style={{
          display: 'inline-flex', alignItems: 'center', gap: '0.375rem',
          fontFamily: 'var(--font-body)', fontSize: 'var(--text-sm)',
          color: 'var(--color-text-muted)', textDecoration: 'none', marginBottom: '1.5rem',
        }}
      >
        <ArrowLeft size={14} />
        Volver al dashboard
      </Link>

      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: 'easeOut' }}
        style={{ marginBottom: '2rem' }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.5rem' }}>
          <div
            style={{
              width: 40, height: 40, borderRadius: 12,
              background: 'rgba(31,119,246,0.08)', border: '1px solid rgba(31,119,246,0.2)',
              display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
            }}
          >
            <Radio size={20} color="#1F77F6" />
          </div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <h1
              style={{
                fontFamily: 'var(--font-heading)', fontSize: 'var(--text-xl)',
                fontWeight: 700, color: 'var(--color-ink)', letterSpacing: '-0.02em',
                lineHeight: 1.3, margin: 0,
              }}
            >
              RADAR del ecosistema
            </h1>
            <p style={{ fontFamily: 'var(--font-body)', fontSize: 'var(--text-sm)', color: 'var(--color-text-secondary)', lineHeight: 1.5, margin: 0 }}>
              Mantente informado sobre lo que pasa en el ecosistema de innovación en LATAM
            </p>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.375rem', marginTop: '0.5rem', marginLeft: 52 }}>
          <Clock size={12} color="var(--color-text-muted)" />
          <span style={{ fontFamily: 'var(--font-body)', fontSize: 'var(--text-xs)', color: 'var(--color-text-muted)' }}>
            Última actualización: {lastUpdated}
          </span>
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.1 }}
        style={{ display: 'flex', gap: '0.5rem', marginBottom: '1.5rem', overflowX: 'auto', paddingBottom: '0.25rem' }}
      >
        {TABS.map((tab) => {
          const Icon = tab.icon
          const isActive = activeTab === tab.id
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              style={{
                display: 'inline-flex', alignItems: 'center', gap: '0.375rem',
                padding: '0.5rem 1rem', borderRadius: 999,
                border: isActive ? '1px solid rgba(31,119,246,0.3)' : '1px solid var(--color-border)',
                background: isActive ? 'rgba(31,119,246,0.08)' : 'var(--color-bg-card)',
                fontFamily: 'var(--font-body)', fontSize: 'var(--text-sm)',
                fontWeight: isActive ? 600 : 500,
                color: isActive ? '#1F77F6' : 'var(--color-text-secondary)',
                cursor: 'pointer', whiteSpace: 'nowrap',
              }}
            >
              <Icon size={14} />
              {tab.label}
            </button>
          )
        })}
      </motion.div>

      {activeTab === 'noticias' && renderList(items)}

      {activeTab === 'vertical' && (
        <div>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3 }}
            style={{
              display: 'flex', alignItems: 'center', gap: '0.5rem',
              padding: '0.75rem 1rem', borderRadius: 12,
              background: 'rgba(31,119,246,0.04)',
              border: '1px solid rgba(31,119,246,0.1)',
              marginBottom: '1rem',
            }}
          >
            <Target size={14} color="#1F77F6" />
            <span style={{ fontFamily: 'var(--font-body)', fontSize: 'var(--text-sm)', color: 'var(--color-text-secondary)' }}>
              Mostrando noticias relevantes para:{' '}
              <strong style={{ color: '#1F77F6' }}>{userVertical}</strong>
              {startup?.country && (
                <> en <strong style={{ color: '#1F77F6' }}>{COUNTRY_LABELS[startup.country] || startup.country}</strong></>
              )}
            </span>
          </motion.div>
          {renderList(verticalItems)}
        </div>
      )}
    </div>
  )
}
