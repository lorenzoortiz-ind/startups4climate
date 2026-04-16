'use client'

import { useState } from 'react'
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
  Users,
} from 'lucide-react'
import { useAuth } from '@/context/AuthContext'
import { useRouter } from 'next/navigation'

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
}

/* ─── Type styling ─── */
const TYPE_CONFIG: Record<OpportunityType, { color: string; bg: string; border: string; icon: typeof DollarSign }> = {
  Grant:        { color: '#0D9488', bg: 'rgba(13,148,136,0.08)',  border: 'rgba(13,148,136,0.2)',  icon: DollarSign },
  Aceleradora:  { color: '#FF6B4A', bg: 'rgba(255,107,74,0.08)', border: 'rgba(255,107,74,0.2)',  icon: Rocket },
  Competencia:  { color: '#F59E0B', bg: 'rgba(245,158,11,0.08)', border: 'rgba(245,158,11,0.2)',  icon: Trophy },
  Fondo:        { color: '#8B5CF6', bg: 'rgba(139,92,246,0.08)', border: 'rgba(139,92,246,0.2)',  icon: Landmark },
  Capacitación: { color: '#3B82F6', bg: 'rgba(59,130,246,0.08)', border: 'rgba(59,130,246,0.2)',  icon: GraduationCap },
  Programa:     { color: '#EC4899', bg: 'rgba(236,72,153,0.08)', border: 'rgba(236,72,153,0.2)',  icon: Award },
}

const TYPE_FILTERS: TypeFilter[] = ['Todos', 'Grant', 'Aceleradora', 'Competencia', 'Fondo', 'Capacitación', 'Programa']
const STATUS_FILTERS: StatusFilter[] = ['Vigentes', 'Por vencer', 'Todas']

/* ─── Data ─── */
const OPPORTUNITIES: Opportunity[] = [
  {
    name: 'Green Climate Fund - Convocatoria abierta',
    organization: 'Green Climate Fund (GCF)',
    type: 'Grant',
    amount: 'USD 50K - 500K',
    deadline: '15 Jun 2026',
    description: 'Financiamiento climático para proyectos de mitigación y adaptación en países en desarrollo. Apoya startups con soluciones escalables en energía, transporte, agricultura y resiliencia urbana.',
    eligibility: 'Startups con al menos 2 años de operación en países en desarrollo, proyecto alineado con NDCs nacionales',
    region: 'Global',
  },
  {
    name: 'ClimateLaunch LATAM 2026',
    organization: 'ClimateLaunch',
    type: 'Competencia',
    amount: 'USD 25K premio',
    deadline: '10 Jul 2026',
    description: 'Competencia regional para las startups climáticas más innovadoras de América Latina. Incluye mentoría, visibilidad mediática y acceso a red de inversores de impacto.',
    eligibility: 'Startups de climatech con MVP funcional, operaciones en LATAM, equipo de al menos 2 personas',
    region: 'Regional',
  },
  {
    name: 'BID Lab Innovation Fund',
    organization: 'BID Lab (Banco Interamericano de Desarrollo)',
    type: 'Fondo',
    amount: 'USD 100K - 1M',
    deadline: '30 Ago 2026',
    description: 'Fondo de innovación para emprendimientos que demuestren impacto social y ambiental medible en comunidades vulnerables de América Latina y el Caribe.',
    eligibility: 'Startups con al menos 1 año de operación, impacto verificable, modelo de negocio sostenible',
    region: 'Regional',
  },
  {
    name: 'Start-Up Chile Scale',
    organization: 'Start-Up Chile / CORFO',
    type: 'Aceleradora',
    amount: 'USD 100K equity-free',
    deadline: '20 May 2026',
    description: 'Programa de escalamiento para startups con tracción comprobada. Incluye financiamiento no reembolsable, mentoría intensiva, espacio de coworking y acceso al mercado chileno.',
    eligibility: 'Startups con ingresos recurrentes > $5K/mes, cualquier nacionalidad, dispuestas a operar desde Chile',
    region: 'Chile',
  },
  {
    name: 'CORFO Semilla Inicia',
    organization: 'CORFO',
    type: 'Grant',
    amount: 'USD 40K',
    deadline: '30 Jun 2026',
    description: 'Subsidio no reembolsable para startups en etapa temprana con soluciones innovadoras. Cubre desarrollo de producto, validación de mercado y primeras contrataciones.',
    eligibility: 'Startups chilenas o con operaciones en Chile, facturación < $500K USD anual, menos de 3 años de operación',
    region: 'Chile',
  },
  {
    name: 'Google for Startups Climate',
    organization: 'Google',
    type: 'Programa',
    amount: 'USD 200K en créditos',
    deadline: '15 Jul 2026',
    description: 'Programa de 12 semanas para startups climáticas que usan tecnología para resolver desafíos ambientales. Incluye créditos cloud, mentoría de ingenieros de Google y acceso a la red global.',
    eligibility: 'Startups con producto en mercado, Series Seed a A, enfoque en sostenibilidad o climatech',
    region: 'Global',
  },
  {
    name: 'MassChallenge LATAM',
    organization: 'MassChallenge',
    type: 'Aceleradora',
    amount: 'USD 0 equity',
    deadline: '1 Ago 2026',
    description: 'Aceleradora zero-equity de 4 meses con acceso a mentores, corporativos y red global de MassChallenge. Los ganadores del programa acceden a premios en efectivo sin ceder participación.',
    eligibility: 'Startups en cualquier vertical con producto validado, dispuestas a participar presencialmente en Ciudad de México',
    region: 'Regional',
  },
  {
    name: 'CAF Ventures Climate',
    organization: 'CAF - Banco de Desarrollo de América Latina',
    type: 'Fondo',
    amount: 'USD 250K - 2M',
    deadline: '15 Sep 2026',
    description: 'Vehículo de inversión de CAF enfocado en startups climáticas de la región. Ticket de inversión en equity o notas convertibles con términos favorables para founders.',
    eligibility: 'Startups con ingresos anuales > $100K, modelo de negocio probado, impacto climático cuantificable',
    region: 'Regional',
  },
  {
    name: 'Finanzas climáticas para startups',
    organization: 'Climate Policy Initiative (CPI)',
    type: 'Capacitación',
    amount: 'Gratuito',
    deadline: '10 May 2026',
    description: 'Curso intensivo de 6 semanas sobre financiamiento climático, bonos de carbono, taxonomía verde y cómo estructurar proyectos para acceder a fondos internacionales.',
    eligibility: 'Founders y equipos de startups de impacto en LATAM, no requiere conocimiento previo en finanzas',
    region: 'Regional',
  },
  {
    name: 'Premios Latinoamérica Verde',
    organization: 'Fundación Latinoamérica Verde',
    type: 'Competencia',
    amount: 'USD 10K premio',
    deadline: '25 Jun 2026',
    description: 'Los premios ambientales más grandes de la región. Reconocen los 500 mejores proyectos sociales y ambientales de América Latina con visibilidad, networking y premios económicos.',
    eligibility: 'Proyectos y startups con impacto ambiental demostrable, cualquier etapa, operaciones en LATAM',
    region: 'Regional',
  },
]

/* ─── Date helpers ─── */
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
function OpportunityCard({ item, index }: { item: Opportunity; index: number }) {
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
          color: '#FF6B4A',
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
          Gestionar
          <ChevronRight size={12} />
        </button>
      </div>
    </motion.div>
  )
}

/* ─── Main page ─── */
export default function AdminOportunidadesPage() {
  const { appUser } = useAuth()
  const router = useRouter()
  const [typeFilter, setTypeFilter] = useState<TypeFilter>('Todos')
  const [statusFilter, setStatusFilter] = useState<StatusFilter>('Vigentes')

  if (!appUser || (appUser.role !== 'admin_org' && appUser.role !== 'superadmin')) {
    router.replace('/admin')
    return null
  }

  const filtered = OPPORTUNITIES
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
        minHeight: '100vh',
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
                background: 'rgba(255,107,74,0.08)',
                border: '1px solid rgba(255,107,74,0.2)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0,
              }}
            >
              <Lightbulb size={20} color="#FF6B4A" />
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

        {/* Opportunity cards grid */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(min(340px, 100%), 1fr))',
            gap: '1rem',
          }}
        >
          {filtered.map((item, i) => (
            <OpportunityCard key={item.name} item={item} index={i} />
          ))}
        </div>

        {/* Empty state */}
        {filtered.length === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3 }}
            style={{
              textAlign: 'center',
              padding: '3rem 1rem',
            }}
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
