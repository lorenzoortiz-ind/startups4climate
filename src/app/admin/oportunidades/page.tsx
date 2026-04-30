'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import {
  Lightbulb,
  DollarSign,
  Rocket,
  Trophy,
  Landmark,
  GraduationCap,
  Award,
  Filter,
  Clock,
  CalendarDays,
  MapPin,
  ChevronRight,
  ExternalLink,
  Users,
} from 'lucide-react'
import { useAuth } from '@/context/AuthContext'
import { useRouter, usePathname } from 'next/navigation'
import { supabase } from '@/lib/supabase'

/* ─── Types ─── */
type OpportunityType = 'Grant' | 'Aceleradora' | 'Competencia' | 'Fondo' | 'Capacitación' | 'Programa'
type StatusFilter = 'Vigentes' | 'Por vencer' | 'Todas'
type TypeFilter = 'Todos' | OpportunityType

interface Opportunity {
  name: string
  organization: string
  type: OpportunityType
  amount: string
  deadline: string
  description: string
  eligibility: string
  region: string
  url?: string | null
}

/* ─── Type styling ─── */
const TYPE_CONFIG: Record<OpportunityType, { color: string; bg: string; border: string; icon: typeof DollarSign }> = {
  Grant:        { color: '#1F77F6', bg: 'rgba(31,119,246,0.08)',  border: 'rgba(31,119,246,0.2)',  icon: DollarSign },
  Aceleradora:  { color: '#DA4E24', bg: 'rgba(218,78,36,0.08)', border: 'rgba(218,78,36,0.2)',  icon: Rocket },
  Competencia:  { color: '#F59E0B', bg: 'rgba(245,158,11,0.08)', border: 'rgba(245,158,11,0.2)',  icon: Trophy },
  Fondo:        { color: '#8B5CF6', bg: 'rgba(139,92,246,0.08)', border: 'rgba(139,92,246,0.2)',  icon: Landmark },
  Capacitación: { color: '#1F77F6', bg: 'rgba(59,130,246,0.08)', border: 'rgba(59,130,246,0.2)',  icon: GraduationCap },
  Programa:     { color: '#EC4899', bg: 'rgba(236,72,153,0.08)', border: 'rgba(236,72,153,0.2)',  icon: Award },
}

const TYPE_FILTERS: TypeFilter[] = ['Todos', 'Grant', 'Aceleradora', 'Competencia', 'Fondo', 'Capacitación', 'Programa']
const STATUS_FILTERS: StatusFilter[] = ['Vigentes', 'Por vencer', 'Todas']

/* ─── Date helpers ─── */
const MONTH_ES = ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic']
function fmtDeadline(iso: string): string {
  const d = new Date(iso)
  return `${d.getDate()} ${MONTH_ES[d.getMonth()]} ${d.getFullYear()}`
}

const MONTH_MAP: Record<string, number> = {
  Ene: 0, Feb: 1, Mar: 2, Abr: 3, May: 4, Jun: 5,
  Jul: 6, Ago: 7, Sep: 8, Oct: 9, Nov: 10, Dic: 11,
}

function parseDeadline(deadline: string): Date | null {
  const parts = deadline.split(' ')
  if (parts.length !== 3) return null
  const day = parseInt(parts[0], 10)
  const month = MONTH_MAP[parts[1]]
  const year = parseInt(parts[2], 10)
  if (isNaN(day) || month === undefined || isNaN(year)) return null
  return new Date(year, month, day, 23, 59, 59)
}

function getDaysUntil(deadline: string): number | null {
  const date = parseDeadline(deadline)
  if (!date) return null
  const now = new Date()
  return Math.ceil((date.getTime() - now.getTime()) / (1000 * 60 * 60 * 24))
}

function getTimeStatus(deadline: string): 'vigente' | 'por_vencer' | 'cerrada' {
  const days = getDaysUntil(deadline)
  if (days === null) return 'vigente'
  if (days < 0) return 'cerrada'
  if (days <= 30) return 'por_vencer'
  return 'vigente'
}

/* ─── Card component ─── */
function OpportunityCard({ item, index, showCohortBadge }: { item: Opportunity & { cohortMatchCount?: number }; index: number; showCohortBadge?: boolean }) {
  const config = TYPE_CONFIG[item.type]
  const TypeIcon = config.icon
  const daysLeft = getDaysUntil(item.deadline)
  const isUrgent = daysLeft !== null && daysLeft <= 30 && daysLeft >= 0

  return (
    <motion.div
      initial={{ opacity: 0, y: 18 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, delay: 0.05 + index * 0.05, ease: 'easeOut' }}
      style={{
        padding: '1.25rem',
        borderRadius: 12,
        background: 'var(--color-bg-card)',
        borderTop: '1px solid var(--color-border)',
        borderRight: '1px solid var(--color-border)',
        borderBottom: '1px solid var(--color-border)',
        borderLeft: `3px solid ${config.color}`,
        boxShadow: 'var(--shadow-card)',
        display: 'flex',
        flexDirection: 'column',
        gap: '0.625rem',
        cursor: 'default',
        transition: 'all 0.2s ease',
        overflowWrap: 'break-word',
        wordBreak: 'break-word',
      }}
      whileHover={{
        boxShadow: 'var(--shadow-card-hover)',
        y: -2,
      }}
    >
      {/* Top row: type badge + region */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '0.5rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap' }}>
          <span
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.25rem',
              padding: '0.125rem 0.5rem',
              borderRadius: 999,
              background: config.bg,
              border: `1px solid ${config.border}`,
              fontFamily: 'var(--font-body)',
              fontSize: 'var(--text-2xs)',
              fontWeight: 600,
              color: config.color,
              whiteSpace: 'nowrap',
            }}
          >
            <TypeIcon size={10} />
            {item.type}
          </span>
          <span
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.25rem',
              fontFamily: 'var(--font-body)',
              fontSize: 'var(--text-2xs)',
              color: 'var(--color-text-muted)',
            }}
          >
            <MapPin size={10} />
            {item.region}
          </span>
        </div>
        {isUrgent && (
          <span
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.25rem',
              padding: '0.125rem 0.5rem',
              borderRadius: 999,
              background: 'rgba(239,68,68,0.08)',
              border: '1px solid rgba(239,68,68,0.2)',
              fontFamily: 'var(--font-body)',
              fontSize: 'var(--text-2xs)',
              fontWeight: 600,
              color: '#EF4444',
              whiteSpace: 'nowrap',
            }}
          >
            <Clock size={10} />
            {daysLeft} días
          </span>
        )}
        {showCohortBadge && typeof item.cohortMatchCount === 'number' && item.cohortMatchCount > 0 && (
          <span
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.25rem',
              padding: '0.125rem 0.5rem',
              borderRadius: 999,
              background: 'rgba(22,163,74,0.08)',
              border: '1px solid rgba(22,163,74,0.25)',
              fontFamily: 'var(--font-body)',
              fontSize: 'var(--text-2xs)',
              fontWeight: 600,
              color: '#16A34A',
              whiteSpace: 'nowrap',
            }}
          >
            <Users size={10} />
            {item.cohortMatchCount} founder{item.cohortMatchCount !== 1 ? 's' : ''} califican
          </span>
        )}
      </div>

      {/* Title */}
      <h3
        style={{
          fontFamily: 'var(--font-heading)',
          fontSize: '0.875rem',
          fontWeight: 600,
          color: 'var(--color-ink)',
          lineHeight: 1.35,
          margin: 0,
        }}
      >
        {item.name}
      </h3>

      {/* Organization */}
      <p
        style={{
          fontFamily: 'var(--font-body)',
          fontSize: '0.8125rem',
          fontWeight: 600,
          color: 'var(--color-text-secondary)',
          margin: 0,
        }}
      >
        {item.organization}
      </p>

      {/* Amount */}
      <span
        style={{
          fontFamily: 'var(--font-heading)',
          fontSize: '1rem',
          fontWeight: 700,
          color: '#DA4E24',
        }}
      >
        {item.amount}
      </span>

      {/* Description */}
      <p
        style={{
          fontFamily: 'var(--font-body)',
          fontSize: '0.8125rem',
          color: 'var(--color-text-secondary)',
          lineHeight: 1.6,
          margin: 0,
        }}
      >
        {item.description}
      </p>

      {/* Eligibility */}
      <p
        style={{
          fontFamily: 'var(--font-body)',
          fontSize: '0.8125rem',
          color: 'var(--color-text-muted)',
          lineHeight: 1.6,
          margin: 0,
        }}
      >
        <strong style={{ color: 'var(--color-text-secondary)' }}>
          <Users size={11} style={{ display: 'inline', verticalAlign: '-1px', marginRight: '0.25rem' }} />
          Elegibilidad:
        </strong>{' '}
        {item.eligibility}
      </p>

      {/* Bottom row: deadline + CTA */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: '0.25rem' }}>
        <span
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.25rem',
            fontFamily: 'var(--font-body)',
            fontSize: 'var(--text-xs)',
            color: isUrgent ? '#EF4444' : 'var(--color-text-muted)',
            fontWeight: 600,
          }}
        >
          <CalendarDays size={12} />
          Cierra: {item.deadline}
        </span>
        {item.url ? (
          <a
            href={item.url.match(/^https?:\/\//) ? item.url : `https://${item.url}`}
            target="_blank"
            rel="noopener noreferrer"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.25rem',
              padding: '0.5rem 1rem',
              borderRadius: 8,
              background: config.color,
              border: `1px solid ${config.color}`,
              fontFamily: 'var(--font-body)',
              fontSize: '0.8125rem',
              fontWeight: 600,
              color: '#fff',
              textDecoration: 'none',
              transition: 'all 0.2s ease',
            }}
          >
            Ver convocatoria
            <ExternalLink size={12} />
          </a>
        ) : (
          <span
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.25rem',
              padding: '0.5rem 1rem',
              borderRadius: 8,
              background: 'var(--color-bg-primary)',
              border: '1px solid var(--color-border)',
              fontFamily: 'var(--font-body)',
              fontSize: '0.8125rem',
              fontWeight: 600,
              color: 'var(--color-text-muted)',
            }}
          >
            Próximamente
            <ChevronRight size={12} />
          </span>
        )}
      </div>
    </motion.div>
  )
}

interface LiveOpportunity extends Opportunity {
  cohortMatchCount: number
}

/* ─── Main page ─── */
export default function AdminOportunidadesPage() {
  const { appUser, isDemo } = useAuth()
  const router = useRouter()
  const pathname = usePathname()
  const adminBase = pathname.startsWith('/demo-admin') ? '/demo-admin' : '/admin'
  const [typeFilter, setTypeFilter] = useState<TypeFilter>('Todos')
  const [statusFilter, setStatusFilter] = useState<StatusFilter>('Vigentes')
  const [liveOpps, setLiveOpps] = useState<LiveOpportunity[] | null>(null)
  const [cohortDataAvailable, setCohortDataAvailable] = useState(false)

  useEffect(() => {
    if (!appUser) return
    let cancelled = false
    ;(async () => {
      try {
      const orgId = appUser.org_id ?? null

      // Load opportunities and cohort founder verticals in parallel
      const [oppsRes, foundersRes] = await Promise.all([
        supabase
          .from('opportunities')
          .select('id, title, organization, type, amount_min, amount_max, currency, deadline, application_url, eligible_countries, eligible_verticals, eligible_stages, description')
          .eq('is_active', true)
          .order('deadline', { ascending: true, nullsFirst: false })
          .limit(60),
        orgId
          ? supabase
              .from('profiles')
              .select('id, startups!inner(vertical, stage, cohort_startups!inner(cohort_id, cohorts!inner(org_id)))')
              .eq('role', 'founder')
              .eq('startups.cohort_startups.cohorts.org_id', orgId)
          : Promise.resolve({ data: null, error: null }),
      ])

      if (cancelled) return

      // Build set of founder verticals from cohort
      const founderVerticals: string[] = []
      if (foundersRes.data && Array.isArray(foundersRes.data)) {
        setCohortDataAvailable(true)
        for (const profile of foundersRes.data as Array<{ startups?: Array<{ vertical?: string | null }> | { vertical?: string | null } }>) {
          const startups = Array.isArray(profile.startups) ? profile.startups : (profile.startups ? [profile.startups] : [])
          for (const s of startups) {
            if (s.vertical) founderVerticals.push(s.vertical.toLowerCase())
          }
        }
      }

      const { data, error } = oppsRes
      if (error || !data) { if (!cancelled) setLiveOpps([]); return }

      const TYPE_MAP: Record<string, OpportunityType> = {
        grant: 'Grant',
        fund: 'Fondo',
        accelerator: 'Aceleradora',
        competition: 'Competencia',
        program: 'Programa',
        training: 'Capacitación',
      }
      const fmtAmount = (min: number | null, max: number | null, cur: string | null): string => {
        const c = cur || 'USD'
        if (!min && !max) return 'Variable'
        if (min && max) return `${c} ${(min/1000).toFixed(0)}K - ${(max/1000).toFixed(0)}K`
        const v = (min || max)!
        return `${c} ${(v/1000).toFixed(0)}K`
      }

      const opps: LiveOpportunity[] = data.map((r: Record<string, unknown>) => {
        const oppVerticals = ((r.eligible_verticals as string[] | null) ?? []).map((v) => v.toLowerCase())
        const cohortMatchCount = oppVerticals.length === 0
          ? founderVerticals.length
          : founderVerticals.filter((fv) => oppVerticals.some((ov) => ov === fv || ov.includes(fv) || fv.includes(ov))).length

        return {
          name: r.title as string,
          organization: (r.organization as string) || '—',
          type: TYPE_MAP[(r.type as string) || ''] || 'Programa',
          amount: fmtAmount(r.amount_min as number | null, r.amount_max as number | null, r.currency as string | null),
          deadline: r.deadline ? fmtDeadline(r.deadline as string) : 'Rolling',
          description: (r.description as string) || 'Convocatoria del ecosistema regional.',
          eligibility: [
            (r.eligible_verticals as string[] | null)?.join(', '),
            (r.eligible_stages as string[] | null)?.join(', '),
            (r.eligible_countries as string[] | null)?.join(', '),
          ].filter(Boolean).join(' · ') || 'Ver convocatoria para detalles',
          region: ((r.eligible_countries as string[] | null) || []).slice(0, 2).join(', ') || 'LATAM',
          url: (r.application_url as string) || null,
          cohortMatchCount,
        }
      })

      // Sort by cohort match count descending when data is available, else keep deadline order
      if (founderVerticals.length > 0) {
        opps.sort((a, b) => b.cohortMatchCount - a.cohortMatchCount)
      }

      setLiveOpps(opps)
      } catch (err) {
        console.error('[S4C Oportunidades] fetch error:', err)
        if (!cancelled) setLiveOpps([])
      }
    })()
    return () => { cancelled = true }
  }, [appUser])

  if (!appUser || (appUser.role !== 'admin_org' && appUser.role !== 'superadmin')) {
    router.replace(adminBase)
    return null
  }

  const sourceList: LiveOpportunity[] = liveOpps ?? []
  const filtered = sourceList
    .filter((o) => typeFilter === 'Todos' || o.type === typeFilter)
    .filter((o) => {
      if (statusFilter === 'Todas') return true
      const status = getTimeStatus(o.deadline)
      if (statusFilter === 'Vigentes') return status === 'vigente' || status === 'por_vencer'
      if (statusFilter === 'Por vencer') return status === 'por_vencer'
      return true
    })

  return (
    <div
      style={{
        minHeight: '100dvh',
        background: 'var(--color-bg-primary)',
        padding: '2rem 1.5rem',
      }}
    >
      <div style={{ maxWidth: 1200, margin: '0 auto' }}>
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, ease: 'easeOut' }}
          style={{ marginBottom: '1.5rem' }}
        >
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.75rem',
              marginBottom: '0.5rem',
            }}
          >
            <div
              style={{
                width: 40,
                height: 40,
                borderRadius: 12,
                background: 'rgba(218,78,36,0.08)',
                border: '1px solid rgba(218,78,36,0.2)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0,
              }}
            >
              <Lightbulb size={20} color="#DA4E24" />
            </div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <h1
                style={{
                  fontFamily: 'var(--font-heading)',
                  fontSize: 'var(--text-xl)',
                  fontWeight: 700,
                  color: 'var(--color-ink)',
                  letterSpacing: '-0.02em',
                  lineHeight: 1.3,
                  margin: 0,
                }}
              >
                Oportunidades
              </h1>
              <p
                style={{
                  fontFamily: 'var(--font-body)',
                  fontSize: 'var(--text-sm)',
                  color: 'var(--color-text-secondary)',
                  lineHeight: 1.5,
                  margin: 0,
                }}
              >
                Oportunidades para tu ecosistema
              </p>
            </div>
          </div>
        </motion.div>

        {/* Info banner */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.05, ease: 'easeOut' }}
          style={{
            marginBottom: '1.5rem',
            padding: '1rem 1.25rem',
            borderRadius: 'var(--radius-md)',
            background: 'var(--color-accent-light)',
            border: '1px solid var(--color-accent-primary)',
            display: 'flex',
            alignItems: 'center',
            gap: '0.75rem',
          }}
        >
          <Lightbulb size={18} color="var(--color-accent-primary)" style={{ flexShrink: 0 }} />
          <span style={{
            fontFamily: 'var(--font-body)', fontSize: '0.8125rem',
            color: 'var(--color-accent-primary)', fontWeight: 500,
          }}>
            Vista de administrador: todas las oportunidades del ecosistema. Los founders ven solo las relevantes a su vertical.
          </span>
        </motion.div>

        {/* Type filter */}
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.1 }}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            marginBottom: '0.75rem',
            overflowX: 'auto',
            paddingBottom: '0.25rem',
          }}
        >
          <Filter size={14} color="var(--color-text-muted)" style={{ flexShrink: 0 }} />
          {TYPE_FILTERS.map((cat) => {
            const isActive = typeFilter === cat
            const catColor = cat === 'Todos' ? '#2A222B' : TYPE_CONFIG[cat as OpportunityType]?.color ?? '#2A222B'
            return (
              <button
                key={cat}
                onClick={() => setTypeFilter(cat)}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.25rem',
                  padding: '0.5rem 1rem',
                  borderRadius: 999,
                  border: isActive
                    ? `1px solid ${catColor}40`
                    : '1px solid var(--color-border)',
                  background: isActive ? `${catColor}10` : 'var(--color-bg-card)',
                  fontFamily: 'var(--font-body)',
                  fontSize: 'var(--text-sm)',
                  fontWeight: isActive ? 600 : 500,
                  color: isActive ? catColor : 'var(--color-text-secondary)',
                  cursor: 'pointer',
                  whiteSpace: 'nowrap',
                  transition: 'all 0.2s ease',
                }}
              >
                {cat}
              </button>
            )
          })}
        </motion.div>

        {/* Status filter */}
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.15 }}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            marginBottom: '1.5rem',
            overflowX: 'auto',
            paddingBottom: '0.25rem',
          }}
        >
          <Clock size={14} color="var(--color-text-muted)" style={{ flexShrink: 0 }} />
          {STATUS_FILTERS.map((sf) => {
            const isActive = statusFilter === sf
            return (
              <button
                key={sf}
                onClick={() => setStatusFilter(sf)}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.25rem',
                  padding: '0.5rem 1rem',
                  borderRadius: 999,
                  border: isActive
                    ? '1px solid rgba(218,78,36,0.4)'
                    : '1px solid var(--color-border)',
                  background: isActive ? 'rgba(218,78,36,0.1)' : 'var(--color-bg-card)',
                  fontFamily: 'var(--font-body)',
                  fontSize: 'var(--text-sm)',
                  fontWeight: isActive ? 600 : 500,
                  color: isActive ? '#DA4E24' : 'var(--color-text-secondary)',
                  cursor: 'pointer',
                  whiteSpace: 'nowrap',
                  transition: 'all 0.2s ease',
                }}
              >
                {sf}
              </button>
            )
          })}
        </motion.div>

        {/* Results count */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.2, delay: 0.15 }}
          style={{ marginBottom: '1rem' }}
        >
          <span
            style={{
              fontFamily: 'var(--font-body)',
              fontSize: 'var(--text-xs)',
              color: 'var(--color-text-muted)',
              textTransform: 'uppercase',
              letterSpacing: '0.05em',
            }}
          >
            {filtered.length} oportunidad{filtered.length !== 1 ? 'es' : ''} encontrada{filtered.length !== 1 ? 's' : ''}
          </span>
        </motion.div>

        {/* Section header when cohort data is available */}
        {!isDemo && cohortDataAvailable && (
          <motion.div
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.18 }}
            style={{ marginBottom: '0.875rem' }}
          >
            <span style={{
              fontFamily: 'var(--font-body)',
              fontSize: 'var(--text-sm)',
              fontWeight: 600,
              color: 'var(--color-text-secondary)',
            }}>
              Oportunidades ordenadas por relevancia para tu cohorte
            </span>
          </motion.div>
        )}

        {/* Opportunity cards grid */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(min(340px, 100%), 1fr))',
            gap: '1rem',
          }}
        >
          {filtered.map((item, i) => (
            <OpportunityCard key={item.name} item={item} index={i} showCohortBadge={!isDemo && cohortDataAvailable} />
          ))}
        </div>

        {/* Empty state */}
        {liveOpps === null && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3 }}
            style={{ textAlign: 'center', padding: '3rem 1rem' }}
          >
            <p style={{
              fontFamily: 'var(--font-body)',
              fontSize: '0.875rem',
              color: 'var(--color-text-muted)',
            }}>
              Cargando oportunidades…
            </p>
          </motion.div>
        )}
        {liveOpps !== null && sourceList.length === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3 }}
            style={{ textAlign: 'center', padding: '3rem 1rem' }}
          >
            <p style={{
              fontFamily: 'var(--font-body)',
              fontSize: '0.875rem',
              color: 'var(--color-text-muted)',
              marginBottom: '0.5rem',
            }}>
              No hay datos disponibles aún.
            </p>
            <p style={{
              fontFamily: 'var(--font-body)',
              fontSize: 'var(--text-xs)',
              color: 'var(--color-text-muted)',
            }}>
              Agrega oportunidades desde el panel de Supabase.
            </p>
          </motion.div>
        )}
        {filtered.length === 0 && sourceList.length > 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3 }}
            style={{ textAlign: 'center', padding: '3rem 1rem' }}
          >
            <p style={{
              fontFamily: 'var(--font-body)',
              fontSize: '0.875rem',
              color: 'var(--color-text-muted)',
            }}>
              No hay oportunidades que coincidan con los filtros seleccionados.
            </p>
          </motion.div>
        )}
      </div>
    </div>
  )
}
