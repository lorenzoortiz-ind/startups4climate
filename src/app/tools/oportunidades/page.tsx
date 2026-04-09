'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import {
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

/* ─── Types ─── */
type OpportunityType = 'Grant' | 'Aceleradora' | 'Competencia' | 'Fondo' | 'Capacitación' | 'Programa'
type TimeFilter = 'Todas' | 'Vigentes' | 'Por vencer' | 'Cerradas'
type FilterCategory = 'Todas' | OpportunityType

interface Opportunity {
  name: string
  organization: string
  type: OpportunityType
  deadline: string
  description: string
  eligibility: string
  matchScore: number
  region: string
  amount?: string
}

/* ─── Type styling ─── */
const TYPE_COLORS: Record<OpportunityType, { color: string; bg: string; border: string }> = {
  Grant: { color: '#0D9488', bg: 'rgba(13,148,136,0.08)', border: 'rgba(13,148,136,0.2)' },
  Aceleradora: { color: '#2A222B', bg: 'rgba(42,34,43,0.08)', border: 'rgba(42,34,43,0.2)' },
  Competencia: { color: '#6366F1', bg: 'rgba(99,102,241,0.08)', border: 'rgba(99,102,241,0.2)' },
  Fondo: { color: '#0D9488', bg: 'rgba(13,148,136,0.08)', border: 'rgba(13,148,136,0.2)' },
  Capacitación: { color: '#EC4899', bg: 'rgba(236,72,153,0.08)', border: 'rgba(236,72,153,0.2)' },
  Programa: { color: '#FF6B4A', bg: 'rgba(255,107,74,0.08)', border: 'rgba(255,107,74,0.2)' },
}

const TYPE_ICONS: Record<OpportunityType, typeof Banknote> = {
  Grant: Banknote,
  Aceleradora: Rocket,
  Competencia: Trophy,
  Fondo: Banknote,
  Capacitación: GraduationCap,
  Programa: Globe,
}

const FILTER_CATEGORIES: FilterCategory[] = [
  'Todas',
  'Grant',
  'Competencia',
  'Aceleradora',
  'Fondo',
  'Capacitación',
]

/* ─── Placeholder data ─── */
const OPPORTUNITIES: Opportunity[] = [
  {
    name: 'Fondo de coinversión CORFO',
    organization: 'CORFO',
    type: 'Grant',
    deadline: '30 Abr 2026',
    description: 'Financiamiento no reembolsable para startups innovadoras con operaciones en Chile. Incluye acompañamiento técnico y acceso a red de mentores.',
    eligibility: 'Startups chilenas o con operaciones en Chile, facturación < $1M USD',
    matchScore: 92,
    region: 'Chile',
    amount: '$50K USD',
  },
  {
    name: 'Google for Startups Accelerator LATAM',
    organization: 'Google',
    type: 'Aceleradora',
    deadline: '15 May 2026',
    description: 'Programa de 12 semanas para startups de impacto que usan tecnología para resolver problemas regionales. Incluye $200K en créditos cloud.',
    eligibility: 'Startups con producto en mercado, Series Seed a A',
    matchScore: 88,
    region: 'Regional',
  },
  {
    name: 'BID Lab Social Entrepreneurship',
    organization: 'BID Lab',
    type: 'Grant',
    deadline: '1 Jun 2026',
    description: 'Fondo para emprendimientos sociales y ambientales que demuestren impacto medible en comunidades vulnerables de América Latina.',
    eligibility: 'Startups de impacto con al menos 1 año de operación',
    matchScore: 85,
    region: 'Regional',
    amount: '$150K USD',
  },
  {
    name: 'Y Combinator W2026',
    organization: 'Y Combinator',
    type: 'Aceleradora',
    deadline: '10 Abr 2026',
    description: 'La aceleradora más prestigiosa del mundo. Inversión de $500K, acceso a red global y demo day ante los principales VCs de Silicon Valley.',
    eligibility: 'Startups en cualquier etapa y vertical, founders comprometidos full-time',
    matchScore: 62,
    region: 'Global',
    amount: '$500K USD',
  },
  {
    name: 'Startup Chile Scale',
    organization: 'Startup Chile / CORFO',
    type: 'Programa',
    deadline: '20 May 2026',
    description: 'Programa de escalamiento para startups con tracción comprobada. Incluye financiamiento, mentoría y acceso a mercado chileno.',
    eligibility: 'Startups con ingresos recurrentes > $5K/mes, cualquier nacionalidad',
    matchScore: 78,
    region: 'Chile',
    amount: '$80K USD',
  },
  {
    name: 'FONDEP — Fondo de Desarrollo Productivo',
    organization: 'Gobierno del Perú',
    type: 'Grant',
    deadline: '30 Jun 2026',
    description: 'Cofinanciamiento para proyectos de innovación productiva que generen empleo y valor agregado en sectores estratégicos del Perú.',
    eligibility: 'Startups peruanas, MIPYMES innovadoras, cualquier sector',
    matchScore: 45,
    region: 'Perú',
    amount: '$30K USD',
  },
  {
    name: 'Wayra Hispam Open Innovation',
    organization: 'Telefónica / Wayra',
    type: 'Aceleradora',
    deadline: '15 Abr 2026',
    description: 'Programa de innovación abierta de Telefónica. Inversión, mentoría y acceso a +350M de clientes de Telefónica en Hispanoamérica.',
    eligibility: 'Startups B2B con producto validado, alineadas con verticales de Telefónica',
    matchScore: 71,
    region: 'Regional',
    amount: '$50K USD',
  },
  {
    name: '500 Global LATAM Batch 2026',
    organization: '500 Global',
    type: 'Aceleradora',
    deadline: '1 May 2026',
    description: 'Aceleradora con foco en startups de alto crecimiento en la región. Incluye inversión, mentoría intensiva y conexión con VCs internacionales.',
    eligibility: 'Startups con MVP y primeros clientes, pre-seed a seed',
    matchScore: 80,
    region: 'Regional',
    amount: '$150K USD',
  },
  {
    name: 'Climate Tech Competition 2026',
    organization: 'MIT Solve',
    type: 'Competencia',
    deadline: '8 Abr 2026',
    description: 'Competencia global para soluciones climáticas innovadoras. Los ganadores reciben premios en efectivo, mentoría del MIT y visibilidad global.',
    eligibility: 'Startups y proyectos de climatech en cualquier etapa',
    matchScore: 94,
    region: 'Global',
    amount: '$50K USD premio',
  },
  {
    name: 'Capacitación en Métricas de Impacto',
    organization: 'ANDE / Aspen Network',
    type: 'Capacitación',
    deadline: '25 Abr 2026',
    description: 'Programa de 6 semanas para aprender a medir y reportar impacto social y ambiental según estándares internacionales (IRIS+, SDGs).',
    eligibility: 'Founders y equipos de startups de impacto en LATAM',
    matchScore: 76,
    region: 'Regional',
  },
]

/* ─── Date helpers ─── */
const MONTH_MAP: Record<string, number> = {
  Ene: 0, Feb: 1, Mar: 2, Abr: 3, May: 4, Jun: 5,
  Jul: 6, Ago: 7, Sep: 8, Oct: 9, Nov: 10, Dic: 11,
}

function parseDeadline(deadline: string): Date | null {
  // Format: "30 Abr 2026"
  const parts = deadline.split(' ')
  if (parts.length !== 3) return null
  const day = parseInt(parts[0], 10)
  const month = MONTH_MAP[parts[1]]
  const year = parseInt(parts[2], 10)
  if (isNaN(day) || month === undefined || isNaN(year)) return null
  return new Date(year, month, day, 23, 59, 59)
}

function getTimeStatus(deadline: string): 'vigente' | 'por_vencer' | 'cerrada' {
  const date = parseDeadline(deadline)
  if (!date) return 'vigente'
  const now = new Date()
  if (date < now) return 'cerrada'
  const diffDays = (date.getTime() - now.getTime()) / (1000 * 60 * 60 * 24)
  if (diffDays <= 14) return 'por_vencer'
  return 'vigente'
}

const TIME_FILTERS: TimeFilter[] = ['Todas', 'Vigentes', 'Por vencer', 'Cerradas']

/* ─── Match score helpers ─── */
function getMatchColor(score: number): { color: string; bg: string; border: string } {
  if (score >= 75) return { color: '#0D9488', bg: 'rgba(13,148,136,0.08)', border: 'rgba(13,148,136,0.2)' }
  if (score >= 50) return { color: '#2A222B', bg: 'rgba(42,34,43,0.08)', border: 'rgba(42,34,43,0.2)' }
  return { color: '#9CA3AF', bg: 'rgba(156,163,175,0.08)', border: 'rgba(156,163,175,0.2)' }
}

/* ─── Components ─── */
function OpportunityCard({ item, index }: { item: Opportunity; index: number }) {
  const typeStyle = TYPE_COLORS[item.type]
  const TypeIcon = TYPE_ICONS[item.type]
  const matchStyle = getMatchColor(item.matchScore)

  return (
    <motion.div
      initial={{ opacity: 0, y: 18 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, delay: 0.05 + index * 0.05, ease: 'easeOut' }}
      style={{
        padding: '1.25rem',
        borderRadius: 12,
        background: 'var(--color-bg-card)',
        border: '1px solid var(--color-border)',
        borderLeft: `3px solid ${typeStyle.color}`,
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
      {/* Top row: type badge + match score */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '0.5rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap' }}>
          <span
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.25rem',
              padding: '0.125rem 0.5rem',
              borderRadius: 999,
              background: typeStyle.bg,
              border: `1px solid ${typeStyle.border}`,
              fontFamily: 'var(--font-body)',
              fontSize: 'var(--text-2xs)',
              fontWeight: 600,
              color: typeStyle.color,
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
          {item.amount && (
            <span
              style={{
                fontFamily: 'var(--font-body)',
                fontSize: 'var(--text-2xs)',
                fontWeight: 600,
                color: 'var(--color-text-secondary)',
              }}
            >
              {item.amount}
            </span>
          )}
        </div>
        <div
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.25rem',
            padding: '0.2rem 0.625rem',
            borderRadius: 999,
            background: matchStyle.bg,
            border: `1px solid ${matchStyle.border}`,
          }}
        >
          <span
            style={{
              fontFamily: 'var(--font-body)',
              fontSize: 'var(--text-xs)',
              fontWeight: 700,
              color: matchStyle.color,
            }}
          >
            {item.matchScore}% match
          </span>
        </div>
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
        <strong style={{ color: 'var(--color-text-secondary)' }}>Elegibilidad:</strong> {item.eligibility}
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
            color: '#EF4444',
            fontWeight: 600,
          }}
        >
          <Clock size={11} />
          Cierra: {item.deadline}
        </span>
        <button
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
            color: 'var(--color-ink)',
            cursor: 'pointer',
            transition: 'all 0.2s ease',
          }}
        >
          Ver más
          <ChevronRight size={12} />
        </button>
      </div>
    </motion.div>
  )
}

/* ─── Main page ─── */
export default function OportunidadesPage() {
  const [activeFilter, setActiveFilter] = useState<FilterCategory>('Todas')
  const [timeFilter, setTimeFilter] = useState<TimeFilter>('Todas')

  const filtered = OPPORTUNITIES
    .filter((o) => activeFilter === 'Todas' || o.type === activeFilter)
    .filter((o) => {
      if (timeFilter === 'Todas') return true
      const status = getTimeStatus(o.deadline)
      if (timeFilter === 'Vigentes') return status === 'vigente'
      if (timeFilter === 'Por vencer') return status === 'por_vencer'
      if (timeFilter === 'Cerradas') return status === 'cerrada'
      return true
    })

  // Sort by match score descending
  const sorted = [...filtered].sort((a, b) => b.matchScore - a.matchScore)

  return (
    <div
      style={{
        minHeight: '100vh',
        background: 'var(--color-bg-primary)',
        padding: '2rem',
      }}
    >
      <div style={{ maxWidth: 960, margin: '0 auto' }}>
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, ease: 'easeOut' }}
          style={{ marginBottom: '2rem' }}
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
                background: 'rgba(255,107,74,0.08)',
                border: '1px solid rgba(255,107,74,0.2)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0,
              }}
            >
              <Sparkles size={20} color="#FF6B4A" />
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
                Oportunidades para tu startup
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
                Grants, aceleradoras, fondos y programas personalizados para tu perfil
              </p>
            </div>
          </div>
        </motion.div>

        {/* Filter bar */}
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.1 }}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            marginBottom: '1rem',
            overflowX: 'auto',
            paddingBottom: '0.25rem',
          }}
        >
          <Filter size={14} color="var(--color-text-muted)" style={{ flexShrink: 0 }} />
          {FILTER_CATEGORIES.map((cat) => {
            const isActive = activeFilter === cat
            const catColor = cat === 'Todas' ? '#2A222B' : TYPE_COLORS[cat as OpportunityType]?.color ?? '#2A222B'
            return (
              <button
                key={cat}
                onClick={() => setActiveFilter(cat)}
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

        {/* Time filter */}
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
          {TIME_FILTERS.map((tf) => {
            const isActive = timeFilter === tf
            return (
              <button
                key={tf}
                onClick={() => setTimeFilter(tf)}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.25rem',
                  padding: '0.5rem 1rem',
                  borderRadius: 999,
                  border: isActive
                    ? '1px solid rgba(255,107,74,0.4)'
                    : '1px solid var(--color-border)',
                  background: isActive ? 'rgba(255,107,74,0.1)' : 'var(--color-bg-card)',
                  fontFamily: 'var(--font-body)',
                  fontSize: 'var(--text-sm)',
                  fontWeight: isActive ? 600 : 500,
                  color: isActive ? '#FF6B4A' : 'var(--color-text-secondary)',
                  cursor: 'pointer',
                  whiteSpace: 'nowrap',
                  transition: 'all 0.2s ease',
                }}
              >
                {tf}
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
            {sorted.length} oportunidad{sorted.length !== 1 ? 'es' : ''} encontrada{sorted.length !== 1 ? 's' : ''}
          </span>
        </motion.div>

        {/* Opportunity cards grid */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(min(280px, 100%), 1fr))',
            gap: '1rem',
          }}
        >
          {sorted.map((item, i) => (
            <OpportunityCard key={item.name} item={item} index={i} />
          ))}
        </div>
      </div>
    </div>
  )
}
