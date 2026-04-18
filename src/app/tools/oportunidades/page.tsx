'use client'

import { useEffect, useMemo, useState } from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import {
  ArrowLeft,
  Sparkles,
  Filter,
  Trophy,
  Banknote,
  GraduationCap,
  Rocket,
  Globe,
  Clock,
  MapPin,
  ExternalLink,
  ChevronRight,
} from 'lucide-react'
import { supabase } from '@/lib/supabase'

/* ─── Types ─── */
type DbType =
  | 'grant'
  | 'competition'
  | 'accelerator'
  | 'investment_fund'
  | 'soft_loan'
  | 'award'
  | 'fellowship'
type DisplayType =
  | 'Grant'
  | 'Aceleradora'
  | 'Competencia'
  | 'Fondo'
  | 'Préstamo'
  | 'Premio'
  | 'Fellowship'
type TimeFilter = 'Todas' | 'Vigentes' | 'Por vencer' | 'Cerradas'
type FilterCategory = 'Todas' | DisplayType

interface OpportunityRow {
  id: string
  title: string
  organization: string
  description: string | null
  type: DbType
  amount_min: number | null
  amount_max: number | null
  currency: string | null
  eligible_countries: string[] | null
  eligible_verticals: string[] | null
  eligible_stages: string[] | null
  application_url: string | null
  deadline: string | null
  is_rolling: boolean | null
}

interface Opportunity extends OpportunityRow {
  displayType: DisplayType
  amountLabel: string | null
  regionLabel: string
  matchScore: number
  matchReasons: string[]
}

const TYPE_LABELS: Record<DbType, DisplayType> = {
  grant: 'Grant',
  competition: 'Competencia',
  accelerator: 'Aceleradora',
  investment_fund: 'Fondo',
  soft_loan: 'Préstamo',
  award: 'Premio',
  fellowship: 'Fellowship',
}

const TYPE_COLORS: Record<DisplayType, { color: string; bg: string; border: string }> = {
  Grant: { color: '#0D9488', bg: 'rgba(13,148,136,0.08)', border: 'rgba(13,148,136,0.2)' },
  Aceleradora: { color: '#2A222B', bg: 'rgba(42,34,43,0.08)', border: 'rgba(42,34,43,0.2)' },
  Competencia: { color: '#6366F1', bg: 'rgba(99,102,241,0.08)', border: 'rgba(99,102,241,0.2)' },
  Fondo: { color: '#0D9488', bg: 'rgba(13,148,136,0.08)', border: 'rgba(13,148,136,0.2)' },
  Préstamo: { color: '#0EA5E9', bg: 'rgba(14,165,233,0.08)', border: 'rgba(14,165,233,0.2)' },
  Premio: { color: '#F59E0B', bg: 'rgba(245,158,11,0.08)', border: 'rgba(245,158,11,0.2)' },
  Fellowship: { color: '#EC4899', bg: 'rgba(236,72,153,0.08)', border: 'rgba(236,72,153,0.2)' },
}

const TYPE_ICONS: Record<DisplayType, typeof Banknote> = {
  Grant: Banknote,
  Aceleradora: Rocket,
  Competencia: Trophy,
  Fondo: Banknote,
  Préstamo: Banknote,
  Premio: Trophy,
  Fellowship: GraduationCap,
}

const FILTER_CATEGORIES: FilterCategory[] = [
  'Todas',
  'Grant',
  'Aceleradora',
  'Competencia',
  'Fondo',
  'Premio',
  'Fellowship',
]

const TIME_FILTERS: TimeFilter[] = ['Todas', 'Vigentes', 'Por vencer', 'Cerradas']

const COUNTRY_LABELS: Record<string, string> = {
  PE: 'Perú',
  CL: 'Chile',
  CO: 'Colombia',
  MX: 'México',
  AR: 'Argentina',
  BR: 'Brasil',
  EC: 'Ecuador',
  BO: 'Bolivia',
  UY: 'Uruguay',
  PY: 'Paraguay',
}

function formatAmount(min: number | null, max: number | null, currency: string | null): string | null {
  if ((!min && !max) || (min === 0 && max === 0)) return null
  const cur = currency || 'USD'
  const fmt = (n: number) =>
    n >= 1000 ? `$${Math.round(n / 1000)}K` : `$${n}`
  if (min && max && min !== max) return `${fmt(min)}–${fmt(max)} ${cur}`
  return `${fmt(max ?? min!)} ${cur}`
}

function formatRegion(countries: string[] | null): string {
  if (!countries || countries.length === 0) return 'Global'
  if (countries.length === 1) return COUNTRY_LABELS[countries[0]] || countries[0]
  if (countries.length >= 6) return 'Regional LATAM'
  return countries.map((c) => COUNTRY_LABELS[c] || c).join(', ')
}

function formatDeadline(deadline: string | null, isRolling: boolean | null): string {
  if (isRolling) return 'Postulación abierta'
  if (!deadline) return 'Sin fecha definida'
  return new Date(deadline).toLocaleDateString('es', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  })
}

function getTimeStatus(deadline: string | null, isRolling: boolean | null): 'vigente' | 'por_vencer' | 'cerrada' {
  if (isRolling) return 'vigente'
  if (!deadline) return 'vigente'
  const date = new Date(deadline)
  const now = new Date()
  if (date < now) return 'cerrada'
  const diffDays = (date.getTime() - now.getTime()) / (1000 * 60 * 60 * 24)
  if (diffDays <= 14) return 'por_vencer'
  return 'vigente'
}

function computeMatch(
  op: OpportunityRow,
  startup: { vertical: string | null; country: string | null; stage: string | null } | null
): { score: number; reasons: string[] } {
  if (!startup) return { score: 70, reasons: [] }
  let score = 50
  const reasons: string[] = []

  if (startup.country && op.eligible_countries?.includes(startup.country)) {
    score += 20
    reasons.push(`Elegible en ${COUNTRY_LABELS[startup.country] || startup.country}`)
  } else if (!op.eligible_countries || op.eligible_countries.length === 0) {
    score += 10
  }

  if (startup.vertical && op.eligible_verticals?.includes(startup.vertical)) {
    score += 20
    reasons.push(`Vertical compatible: ${startup.vertical}`)
  }

  if (startup.stage && op.eligible_stages?.includes(startup.stage)) {
    score += 10
    reasons.push('Etapa compatible')
  }

  return { score: Math.min(score, 99), reasons }
}

function getMatchColor(score: number): { color: string; bg: string; border: string } {
  if (score >= 75) return { color: '#0D9488', bg: 'rgba(13,148,136,0.08)', border: 'rgba(13,148,136,0.2)' }
  if (score >= 50) return { color: '#2A222B', bg: 'rgba(42,34,43,0.08)', border: 'rgba(42,34,43,0.2)' }
  return { color: '#9CA3AF', bg: 'rgba(156,163,175,0.08)', border: 'rgba(156,163,175,0.2)' }
}

/* ─── Card ─── */
function OpportunityCard({ item, index }: { item: Opportunity; index: number }) {
  const typeStyle = TYPE_COLORS[item.displayType]
  const TypeIcon = TYPE_ICONS[item.displayType]
  const matchStyle = getMatchColor(item.matchScore)
  const status = getTimeStatus(item.deadline, item.is_rolling)
  const deadlineColor = status === 'cerrada' ? '#9CA3AF' : status === 'por_vencer' ? '#EF4444' : 'var(--color-text-secondary)'

  return (
    <motion.div
      initial={{ opacity: 0, y: 18 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, delay: 0.05 + index * 0.04, ease: 'easeOut' }}
      style={{
        padding: '1.25rem',
        borderRadius: 12,
        background: 'var(--color-bg-card)',
        border: `1px solid var(--color-border)`,
        borderTop: `2px solid ${typeStyle.color}`,
        boxShadow: 'var(--shadow-card)',
        display: 'flex',
        flexDirection: 'column',
        gap: '0.625rem',
        overflowWrap: 'break-word',
        wordBreak: 'break-word',
      }}
      whileHover={{ boxShadow: 'var(--shadow-card-hover)', y: -2 }}
    >
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '0.5rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap' }}>
          <span
            style={{
              display: 'inline-flex', alignItems: 'center', gap: '0.25rem',
              padding: '0.125rem 0.5rem', borderRadius: 999,
              background: typeStyle.bg, border: `1px solid ${typeStyle.border}`,
              fontFamily: 'var(--font-body)', fontSize: 'var(--text-2xs)',
              fontWeight: 600, color: typeStyle.color, whiteSpace: 'nowrap',
            }}
          >
            <TypeIcon size={10} />
            {item.displayType}
          </span>
          <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.25rem', fontFamily: 'var(--font-body)', fontSize: 'var(--text-2xs)', color: 'var(--color-text-muted)' }}>
            <MapPin size={10} />
            {item.regionLabel}
          </span>
          {item.amountLabel && (
            <span style={{ fontFamily: 'var(--font-body)', fontSize: 'var(--text-2xs)', fontWeight: 600, color: 'var(--color-text-secondary)' }}>
              {item.amountLabel}
            </span>
          )}
        </div>
        <div
          style={{
            display: 'inline-flex', alignItems: 'center', gap: '0.25rem',
            padding: '0.2rem 0.625rem', borderRadius: 999,
            background: matchStyle.bg, border: `1px solid ${matchStyle.border}`,
          }}
        >
          <span style={{ fontFamily: 'var(--font-body)', fontSize: 'var(--text-xs)', fontWeight: 700, color: matchStyle.color }}>
            {item.matchScore}% match
          </span>
        </div>
      </div>

      <h3 style={{ fontFamily: 'var(--font-heading)', fontSize: '0.875rem', fontWeight: 600, color: 'var(--color-ink)', lineHeight: 1.35, margin: 0 }}>
        {item.title}
      </h3>

      <p style={{ fontFamily: 'var(--font-body)', fontSize: '0.8125rem', fontWeight: 600, color: 'var(--color-text-secondary)', margin: 0 }}>
        {item.organization}
      </p>

      {item.description && (
        <p style={{ fontFamily: 'var(--font-body)', fontSize: '0.8125rem', color: 'var(--color-text-secondary)', lineHeight: 1.6, margin: 0 }}>
          {item.description}
        </p>
      )}

      {item.matchReasons.length > 0 && (
        <p style={{ fontFamily: 'var(--font-body)', fontSize: '0.75rem', color: 'var(--color-text-muted)', lineHeight: 1.5, margin: 0 }}>
          <strong style={{ color: 'var(--color-text-secondary)' }}>Por qué te aplica:</strong> {item.matchReasons.join(' · ')}
        </p>
      )}

      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: '0.25rem', flexWrap: 'wrap', gap: '0.5rem' }}>
        <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.25rem', fontFamily: 'var(--font-body)', fontSize: 'var(--text-xs)', color: deadlineColor, fontWeight: 600 }}>
          <Clock size={11} />
          {item.is_rolling ? formatDeadline(item.deadline, item.is_rolling) : `Cierra: ${formatDeadline(item.deadline, item.is_rolling)}`}
        </span>
        {item.application_url ? (
          <a
            href={item.application_url}
            target="_blank"
            rel="noopener noreferrer"
            style={{
              display: 'inline-flex', alignItems: 'center', gap: '0.3rem',
              padding: '0.5rem 1rem', borderRadius: 8,
              background: 'var(--color-bg-primary)', border: '1px solid var(--color-border)',
              fontFamily: 'var(--font-body)', fontSize: '0.8125rem', fontWeight: 600,
              color: 'var(--color-ink)', textDecoration: 'none', cursor: 'pointer',
            }}
          >
            Aplicar
            <ExternalLink size={12} />
          </a>
        ) : (
          <button
            disabled
            style={{
              display: 'inline-flex', alignItems: 'center', gap: '0.25rem',
              padding: '0.5rem 1rem', borderRadius: 8,
              background: 'var(--color-bg-primary)', border: '1px solid var(--color-border)',
              fontFamily: 'var(--font-body)', fontSize: '0.8125rem', fontWeight: 600,
              color: 'var(--color-text-muted)', cursor: 'not-allowed',
            }}
          >
            Próximamente
            <ChevronRight size={12} />
          </button>
        )}
      </div>
    </motion.div>
  )
}

/* ─── Main page ─── */
export default function OportunidadesPage() {
  const [activeFilter, setActiveFilter] = useState<FilterCategory>('Todas')
  const [timeFilter, setTimeFilter] = useState<TimeFilter>('Vigentes')
  const [rows, setRows] = useState<OpportunityRow[]>([])
  const [startup, setStartup] = useState<{ vertical: string | null; country: string | null; stage: string | null } | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let cancelled = false
    async function load() {
      // Load opportunities + current user's startup in parallel
      const opsPromise = supabase
        .from('opportunities')
        .select(
          'id,title,organization,description,type,amount_min,amount_max,currency,eligible_countries,eligible_verticals,eligible_stages,application_url,deadline,is_rolling'
        )
        .eq('is_active', true)
        .order('deadline', { ascending: true, nullsFirst: false })

      const userRes = await supabase.auth.getUser()
      const uid = userRes.data.user?.id
      const startupPromise = uid
        ? supabase
            .from('startups')
            .select('vertical, country, stage')
            .eq('founder_id', uid)
            .maybeSingle()
        : Promise.resolve({ data: null, error: null })

      const [opsRes, startupRes] = await Promise.all([opsPromise, startupPromise])
      if (cancelled) return

      if (opsRes.error) {
        console.error('[S4C Opportunities]', opsRes.error)
      }
      setRows((opsRes.data as OpportunityRow[]) || [])
      setStartup(startupRes.data || null)
      setLoading(false)
    }
    load()
    return () => {
      cancelled = true
    }
  }, [])

  const enriched: Opportunity[] = useMemo(
    () =>
      rows.map((r) => {
        const { score, reasons } = computeMatch(r, startup)
        return {
          ...r,
          displayType: TYPE_LABELS[r.type] || 'Grant',
          amountLabel: formatAmount(r.amount_min, r.amount_max, r.currency),
          regionLabel: formatRegion(r.eligible_countries),
          matchScore: score,
          matchReasons: reasons,
        }
      }),
    [rows, startup]
  )

  const filtered = enriched
    .filter((o) => activeFilter === 'Todas' || o.displayType === activeFilter)
    .filter((o) => {
      if (timeFilter === 'Todas') return true
      const status = getTimeStatus(o.deadline, o.is_rolling)
      if (timeFilter === 'Vigentes') return status === 'vigente'
      if (timeFilter === 'Por vencer') return status === 'por_vencer'
      if (timeFilter === 'Cerradas') return status === 'cerrada'
      return true
    })

  const sorted = [...filtered].sort((a, b) => b.matchScore - a.matchScore)

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
              background: 'rgba(255,107,74,0.08)', border: '1px solid rgba(255,107,74,0.2)',
              display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
            }}
          >
            <Sparkles size={20} color="#FF6B4A" />
          </div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <h1
              style={{
                fontFamily: 'var(--font-heading)', fontSize: 'var(--text-xl)',
                fontWeight: 700, color: 'var(--color-ink)', letterSpacing: '-0.02em',
                lineHeight: 1.3, margin: 0,
              }}
            >
              Oportunidades para tu startup
            </h1>
            <p style={{ fontFamily: 'var(--font-body)', fontSize: 'var(--text-sm)', color: 'var(--color-text-secondary)', lineHeight: 1.5, margin: 0 }}>
              Grants, aceleradoras, competencias y fondos personalizados para tu perfil
            </p>
          </div>
        </div>
      </motion.div>

      {/* Category filter */}
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.1 }}
        style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem', overflowX: 'auto', paddingBottom: '0.25rem' }}
      >
        <Filter size={14} color="var(--color-text-muted)" style={{ flexShrink: 0 }} />
        {FILTER_CATEGORIES.map((cat) => {
          const isActive = activeFilter === cat
          const catColor = cat === 'Todas' ? '#2A222B' : TYPE_COLORS[cat as DisplayType]?.color ?? '#2A222B'
          return (
            <button
              key={cat}
              onClick={() => setActiveFilter(cat)}
              style={{
                display: 'inline-flex', alignItems: 'center', gap: '0.25rem',
                padding: '0.5rem 1rem', borderRadius: 999,
                border: isActive ? `1px solid ${catColor}40` : '1px solid var(--color-border)',
                background: isActive ? `${catColor}10` : 'var(--color-bg-card)',
                fontFamily: 'var(--font-body)', fontSize: 'var(--text-sm)',
                fontWeight: isActive ? 600 : 500,
                color: isActive ? catColor : 'var(--color-text-secondary)',
                cursor: 'pointer', whiteSpace: 'nowrap',
              }}
            >
              {cat}
            </button>
          )
        })}
      </motion.div>

      {/* Time filter */}
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.15 }}
        style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1.5rem', overflowX: 'auto', paddingBottom: '0.25rem' }}
      >
        <Clock size={14} color="var(--color-text-muted)" style={{ flexShrink: 0 }} />
        {TIME_FILTERS.map((tf) => {
          const isActive = timeFilter === tf
          return (
            <button
              key={tf}
              onClick={() => setTimeFilter(tf)}
              style={{
                display: 'inline-flex', alignItems: 'center', gap: '0.25rem',
                padding: '0.5rem 1rem', borderRadius: 999,
                border: isActive ? '1px solid rgba(255,107,74,0.4)' : '1px solid var(--color-border)',
                background: isActive ? 'rgba(255,107,74,0.1)' : 'var(--color-bg-card)',
                fontFamily: 'var(--font-body)', fontSize: 'var(--text-sm)',
                fontWeight: isActive ? 600 : 500,
                color: isActive ? '#FF6B4A' : 'var(--color-text-secondary)',
                cursor: 'pointer', whiteSpace: 'nowrap',
              }}
            >
              {tf}
            </button>
          )
        })}
      </motion.div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.2, delay: 0.15 }}
        style={{ marginBottom: '1rem' }}
      >
        <span style={{ fontFamily: 'var(--font-body)', fontSize: 'var(--text-xs)', color: 'var(--color-text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
          {loading
            ? 'Cargando…'
            : `${sorted.length} oportunidad${sorted.length !== 1 ? 'es' : ''} encontrada${sorted.length !== 1 ? 's' : ''}`}
        </span>
      </motion.div>

      {!loading && sorted.length === 0 && (
        <div
          style={{
            padding: '3rem 1.5rem', textAlign: 'center',
            border: '1px dashed var(--color-border)', borderRadius: 12,
            background: 'var(--color-bg-card)',
          }}
        >
          <Globe size={28} color="var(--color-text-muted)" style={{ marginBottom: '0.5rem' }} />
          <p style={{ fontFamily: 'var(--font-body)', fontSize: '0.9rem', color: 'var(--color-text-secondary)', margin: 0 }}>
            No hay oportunidades que coincidan con estos filtros.
          </p>
        </div>
      )}

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(min(280px, 100%), 1fr))',
          gap: '1rem',
        }}
      >
        {sorted.map((item, i) => (
          <OpportunityCard key={item.id} item={item} index={i} />
        ))}
      </div>
    </div>
  )
}
