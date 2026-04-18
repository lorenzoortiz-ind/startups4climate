'use client'

import { useMemo, useState } from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import {
  Briefcase, MapPin, TrendingUp, Users, AlertTriangle,
  ChevronRight, Filter, BarChart3, Building2,
} from 'lucide-react'
import { useAuth } from '@/context/AuthContext'
import {
  DEMO_PROGRAMS,
  DEMO_MINPRO_KPIS,
  DEMO_REGION_DISTRIBUTION,
  formatUSD,
  type DemoProgram,
} from '@/lib/demo/superadmin-fixtures'

const cardStyle: React.CSSProperties = {
  background: 'var(--color-bg-card)',
  border: '1px solid var(--color-border)',
  borderRadius: 'var(--radius-md)',
  padding: '1.5rem',
  boxShadow: 'var(--shadow-card)',
}

const fadeUp = {
  initial: { opacity: 0, y: 16 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.4, ease: 'easeOut' as const },
}

const STATUS_LABELS: Record<DemoProgram['status'], { label: string; bg: string; color: string }> = {
  active: { label: 'Activo', bg: 'rgba(31,119,246,0.12)', color: '#1F77F6' },
  completed: { label: 'Completado', bg: 'rgba(107,114,128,0.12)', color: '#6B7280' },
  planned: { label: 'Planificado', bg: 'rgba(59,130,246,0.12)', color: '#1F77F6' },
  at_risk: { label: 'En riesgo', bg: 'rgba(218,78,36,0.12)', color: '#DA4E24' },
}

export default function ProgramasPage() {
  const { appUser, isDemo } = useAuth()
  const [filterRegion, setFilterRegion] = useState<string>('all')
  const [filterVertical, setFilterVertical] = useState<string>('all')

  const allRegions = useMemo(() => Array.from(new Set(DEMO_PROGRAMS.map((p) => p.region))).sort(), [])
  const allVerticals = useMemo(() => Array.from(new Set(DEMO_PROGRAMS.map((p) => p.vertical))).sort(), [])

  const filteredPrograms = useMemo(() => {
    return DEMO_PROGRAMS.filter((p) => {
      if (filterRegion !== 'all' && p.region !== filterRegion) return false
      if (filterVertical !== 'all' && p.vertical !== filterVertical) return false
      return true
    })
  }, [filterRegion, filterVertical])

  if (!appUser) return null
  if (appUser.role !== 'superadmin') {
    return (
      <div style={{
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        minHeight: '60vh', fontFamily: 'var(--font-body)',
        color: 'var(--color-text-secondary)', fontSize: 'var(--text-sm)',
      }}>
        Esta sección está disponible solo para Superadmin (MINPRO).
      </div>
    )
  }

  const maxStartups = Math.max(...filteredPrograms.map((p) => p.startupsCount), 1)
  const maxFunding = Math.max(...filteredPrograms.map((p) => p.fundingRaisedUSD), 1)

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.35 }}
      style={{ padding: '2rem 1.5rem', maxWidth: 1240, margin: '0 auto' }}
    >
      {isDemo && (
        <div
          style={{
            display: 'inline-flex', alignItems: 'center', gap: '0.5rem',
            padding: '0.375rem 0.75rem', borderRadius: 999,
            background: 'var(--color-warning-light)',
            border: '1px solid var(--color-warning-border)',
            color: 'var(--color-warning)',
            fontFamily: 'var(--font-body)', fontSize: 'var(--text-xs)',
            fontWeight: 500, marginBottom: '1rem',
          }}
        >
          Modo demo · datos ilustrativos para reunión MINPRO
        </div>
      )}

      {/* Header */}
      <div style={{ marginBottom: '1.5rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '0.4rem' }}>
          <Briefcase size={22} color="#DA4E24" />
          <h1 style={{
            fontFamily: 'var(--font-heading)', fontWeight: 700,
            fontSize: 'var(--text-xl)', color: 'var(--color-text-primary)',
            margin: 0,
          }}>
            Programas de Innovación · Ministerio de la Producción
          </h1>
        </div>
        <p style={{
          fontFamily: 'var(--font-body)', fontSize: 'var(--text-sm)',
          color: 'var(--color-text-secondary)', margin: 0,
        }}>
          Gestión y comparación de los programas financiados por el MINPRO a nivel nacional.
        </p>
      </div>

      {/* KPI strip */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(170px, 1fr))',
        gap: '0.75rem', marginBottom: '1.5rem',
      }}>
        {[
          { label: 'Programas activos', value: DEMO_MINPRO_KPIS.programsActive, color: '#DA4E24' },
          { label: 'Startups activas', value: DEMO_MINPRO_KPIS.startupsTotal, color: '#1F77F6' },
          { label: 'Readiness promedio', value: DEMO_MINPRO_KPIS.readinessAvg, color: '#1F77F6' },
          { label: 'Tools completion', value: `${DEMO_MINPRO_KPIS.toolsCompletionPct}%`, color: '#8B5CF6' },
          { label: 'Funding levantado', value: formatUSD(DEMO_MINPRO_KPIS.fundingRaisedUSD), color: '#16A34A' },
          { label: 'Regiones', value: DEMO_MINPRO_KPIS.regions, color: '#F59E0B' },
        ].map((k, i) => (
          <motion.div
            key={k.label}
            {...fadeUp}
            transition={{ ...fadeUp.transition, delay: i * 0.04 }}
            style={{
              ...cardStyle, padding: '1rem 1.1rem',
              background: `${k.color}0F`,
              borderColor: `${k.color}33`,
            }}
          >
            <div style={{
              fontFamily: 'var(--font-heading)', fontWeight: 700,
              fontSize: '1.4rem', color: 'var(--color-text-primary)',
              lineHeight: 1.1, marginBottom: '0.2rem',
            }}>
              {k.value}
            </div>
            <div style={{
              fontFamily: 'var(--font-body)', fontSize: '0.7rem',
              color: 'var(--color-text-secondary)',
              textTransform: 'uppercase', letterSpacing: '0.04em',
            }}>
              {k.label}
            </div>
          </motion.div>
        ))}
      </div>

      {/* Two-column: budget chart + region list */}
      <div style={{
        display: 'grid', gridTemplateColumns: 'minmax(0, 2fr) minmax(0, 1fr)',
        gap: '1rem', marginBottom: '1.5rem',
      }}
        className="programas-twocol"
      >
        {/* Reach chart */}
        <motion.div {...fadeUp} style={cardStyle}>
          <div style={{
            display: 'flex', alignItems: 'center', gap: '0.5rem',
            marginBottom: '1.25rem',
          }}>
            <BarChart3 size={18} color="var(--color-text-muted)" />
            <h3 style={{
              fontFamily: 'var(--font-heading)', fontWeight: 600,
              fontSize: 'var(--text-md)', color: 'var(--color-text-primary)',
              margin: 0,
            }}>
              Startups acompañadas y funding levantado por programa
            </h3>
          </div>
          <ReachBars programs={filteredPrograms} maxStartups={maxStartups} maxFunding={maxFunding} />
          <div style={{
            display: 'flex', gap: '1rem', marginTop: '1rem',
            fontFamily: 'var(--font-body)', fontSize: '0.75rem',
            color: 'var(--color-text-secondary)',
          }}>
            <Legend color="#DA4E24" label="Startups activas" />
            <Legend color="#1F77F6" label="Funding levantado (USD)" />
          </div>
        </motion.div>

        {/* Region list */}
        <motion.div {...fadeUp} transition={{ ...fadeUp.transition, delay: 0.05 }} style={cardStyle}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem' }}>
            <MapPin size={18} color="var(--color-text-muted)" />
            <h3 style={{
              fontFamily: 'var(--font-heading)', fontWeight: 600,
              fontSize: 'var(--text-md)', color: 'var(--color-text-primary)',
              margin: 0,
            }}>
              Cobertura regional
            </h3>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            {DEMO_REGION_DISTRIBUTION.map((r) => (
              <div key={r.region} style={{
                display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                padding: '0.5rem 0.65rem', borderRadius: 'var(--radius-sm)',
                background: r.programs > 0 ? `${r.color}10` : 'var(--color-bg-muted)',
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', minWidth: 0 }}>
                  <div style={{
                    width: 10, height: 10, borderRadius: '50%',
                    background: r.programs > 0 ? r.color : 'var(--color-text-muted)',
                    flexShrink: 0,
                  }} />
                  <span style={{
                    fontFamily: 'var(--font-body)', fontSize: '0.8rem',
                    color: 'var(--color-text-primary)', fontWeight: 500,
                  }}>
                    {r.region}
                  </span>
                </div>
                <div style={{
                  fontFamily: 'var(--font-body)', fontSize: '0.7rem',
                  color: 'var(--color-text-secondary)',
                  fontVariantNumeric: 'tabular-nums',
                }}>
                  {r.programs} prog · {r.startups} startups
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Filters */}
      <div style={{
        display: 'flex', alignItems: 'center', gap: '0.6rem',
        marginBottom: '0.75rem', flexWrap: 'wrap',
      }}>
        <Filter size={14} color="var(--color-text-muted)" />
        <span style={{
          fontFamily: 'var(--font-body)', fontSize: '0.75rem',
          color: 'var(--color-text-secondary)', fontWeight: 600,
          textTransform: 'uppercase', letterSpacing: '0.04em',
        }}>
          Filtros:
        </span>
        <SelectFilter value={filterRegion} onChange={setFilterRegion} options={[{ value: 'all', label: 'Todas las regiones' }, ...allRegions.map(r => ({ value: r, label: r }))]} />
        <SelectFilter value={filterVertical} onChange={setFilterVertical} options={[{ value: 'all', label: 'Todos los verticales' }, ...allVerticals.map(v => ({ value: v, label: v }))]} />
        <span style={{
          fontFamily: 'var(--font-body)', fontSize: '0.75rem',
          color: 'var(--color-text-secondary)', marginLeft: 'auto',
        }}>
          {filteredPrograms.length} programa{filteredPrograms.length !== 1 ? 's' : ''}
        </span>
      </div>

      {/* Comparative table */}
      <motion.div {...fadeUp} style={{ ...cardStyle, padding: 0, overflow: 'hidden' }}>
        <div style={{ overflowX: 'auto' }}>
          <table style={{
            width: '100%', borderCollapse: 'collapse',
            fontFamily: 'var(--font-body)', fontSize: '0.78rem',
          }}>
            <thead>
              <tr>
                {['Programa', 'Ejecutor', 'Región', 'Vertical', 'Startups', 'Readiness', 'Tools %', 'NPS', 'Funding', 'tCO₂eq', 'Status', ''].map((h) => (
                  <th key={h} style={{
                    textAlign: 'left', padding: '0.75rem 0.85rem',
                    borderBottom: '1px solid var(--color-border)',
                    fontWeight: 600, color: 'var(--color-text-secondary)',
                    fontSize: '0.66rem', textTransform: 'uppercase',
                    letterSpacing: '0.05em', whiteSpace: 'nowrap',
                    background: 'var(--color-bg-muted)',
                  }}>
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filteredPrograms.map((p) => {
                const status = STATUS_LABELS[p.status]
                return (
                  <tr key={p.id} style={{
                    borderBottom: '1px solid var(--color-border)',
                    transition: 'background 0.12s',
                  }}>
                    <td style={{
                      padding: '0.7rem 0.85rem', fontWeight: 600,
                      color: 'var(--color-text-primary)', whiteSpace: 'nowrap',
                    }}>
                      {p.name}
                    </td>
                    <td style={{ padding: '0.7rem 0.85rem', color: 'var(--color-text-secondary)', whiteSpace: 'nowrap' }}>
                      {p.executingOrg}
                    </td>
                    <td style={{ padding: '0.7rem 0.85rem', color: 'var(--color-text-secondary)' }}>
                      {p.region}
                    </td>
                    <td style={{ padding: '0.7rem 0.85rem', color: 'var(--color-text-secondary)' }}>
                      {p.vertical}
                    </td>
                    <td style={{ padding: '0.7rem 0.85rem', color: 'var(--color-text-primary)', fontVariantNumeric: 'tabular-nums' }}>
                      {p.startupsCount}
                    </td>
                    <td style={{ padding: '0.7rem 0.85rem', color: 'var(--color-text-primary)', fontVariantNumeric: 'tabular-nums' }}>
                      {p.readinessAvg}
                    </td>
                    <td style={{ padding: '0.7rem 0.85rem', whiteSpace: 'nowrap' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <span style={{ color: 'var(--color-text-primary)', fontVariantNumeric: 'tabular-nums' }}>{p.toolsCompletionPct}%</span>
                        <span style={{
                          padding: '0.1rem 0.4rem', borderRadius: 4,
                          fontSize: '0.65rem', fontWeight: 600,
                          background: p.toolsCompletionPct >= 60 ? 'rgba(31,119,246,0.12)' : 'rgba(245,158,11,0.12)',
                          color: p.toolsCompletionPct >= 60 ? '#1F77F6' : '#F59E0B',
                        }}>
                          {p.toolsCompletionPct >= 60 ? 'OK' : 'Bajo'}
                        </span>
                      </div>
                    </td>
                    <td style={{ padding: '0.7rem 0.85rem', color: 'var(--color-text-primary)', fontVariantNumeric: 'tabular-nums' }}>
                      {p.nps}
                    </td>
                    <td style={{ padding: '0.7rem 0.85rem', color: 'var(--color-text-primary)', fontVariantNumeric: 'tabular-nums', whiteSpace: 'nowrap' }}>
                      {formatUSD(p.fundingRaisedUSD)}
                    </td>
                    <td style={{ padding: '0.7rem 0.85rem', color: 'var(--color-text-primary)', fontVariantNumeric: 'tabular-nums' }}>
                      {p.co2Avoided.toLocaleString('es-PE')}
                    </td>
                    <td style={{ padding: '0.7rem 0.85rem', whiteSpace: 'nowrap' }}>
                      <span style={{
                        padding: '0.18rem 0.55rem', borderRadius: 999,
                        fontSize: '0.66rem', fontWeight: 600,
                        background: status.bg, color: status.color,
                      }}>
                        {status.label}
                      </span>
                    </td>
                    <td style={{ padding: '0.7rem 0.85rem' }}>
                      <Link href={`/superadmin/programas/${p.id}`} style={{ color: 'var(--color-text-muted)', display: 'inline-flex' }}>
                        <ChevronRight size={16} />
                      </Link>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      </motion.div>

      {/* Quick links */}
      <motion.div {...fadeUp} style={{ ...cardStyle, marginTop: '1.5rem' }}>
        <h3 style={{
          fontFamily: 'var(--font-heading)', fontWeight: 600,
          fontSize: 'var(--text-md)', color: 'var(--color-text-primary)',
          marginBottom: '0.75rem',
        }}>
          Atajos
        </h3>
        <div style={{ display: 'flex', gap: '0.6rem', flexWrap: 'wrap' }}>
          <QuickLink href="/admin" label="Resumen ejecutivo" icon={TrendingUp} />
          <QuickLink href="/superadmin/metricas" label="Métricas comparativas" icon={BarChart3} />
          <QuickLink href="/superadmin/organizaciones" label="Organizaciones ejecutoras" icon={Building2} />
          <QuickLink href="/superadmin/incidencias" label="Alertas y riesgos" icon={AlertTriangle} />
          <QuickLink href="/superadmin/usuarios" label="Founders apoyados" icon={Users} />
        </div>
      </motion.div>

      <style jsx>{`
        @media (max-width: 880px) {
          :global(.programas-twocol) { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </motion.div>
  )
}

function ReachBars({ programs, maxStartups, maxFunding }: { programs: DemoProgram[]; maxStartups: number; maxFunding: number }) {
  if (programs.length === 0) {
    return (
      <p style={{
        fontFamily: 'var(--font-body)', fontSize: '0.8rem',
        color: 'var(--color-text-muted)', textAlign: 'center', padding: '1rem',
      }}>
        Sin programas que coincidan con los filtros.
      </p>
    )
  }

  return (
    <svg
      viewBox={`0 0 600 ${programs.length * 38 + 10}`}
      style={{ width: '100%', height: programs.length * 38 + 10 }}
      role="img"
      aria-label="Gráfico de startups y funding por programa"
    >
      {programs.map((p, i) => {
        const y = i * 38 + 4
        const startupsW = (p.startupsCount / maxStartups) * 360
        const fundingW = (p.fundingRaisedUSD / maxFunding) * 360
        return (
          <g key={p.id}>
            <text x={0} y={y + 14} fontFamily="var(--font-body)" fontSize={11} fill="var(--color-text-secondary)">
              {p.name.length > 28 ? `${p.name.slice(0, 27)}…` : p.name}
            </text>
            <rect x={210} y={y + 4} width={startupsW} height={10} rx={3} fill="rgba(218,78,36,0.85)" />
            <rect x={210} y={y + 16} width={fundingW} height={10} rx={3} fill="#1F77F6" />
            <text x={210 + Math.max(startupsW, fundingW) + 6} y={y + 22} fontFamily="var(--font-body)" fontSize={10} fill="var(--color-text-secondary)">
              {p.startupsCount} · {formatUSD(p.fundingRaisedUSD)}
            </text>
          </g>
        )
      })}
    </svg>
  )
}

function Legend({ color, label }: { color: string; label: string }) {
  return (
    <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.35rem' }}>
      <span style={{ width: 12, height: 8, borderRadius: 2, background: color, display: 'inline-block' }} />
      {label}
    </span>
  )
}

function SelectFilter({
  value,
  onChange,
  options,
}: {
  value: string
  onChange: (v: string) => void
  options: { value: string; label: string }[]
}) {
  return (
    <select
      value={value}
      onChange={(e) => onChange(e.target.value)}
      style={{
        padding: '0.35rem 0.65rem', borderRadius: 'var(--radius-sm)',
        border: '1px solid var(--color-border)',
        background: 'var(--color-bg-card)',
        color: 'var(--color-text-primary)',
        fontFamily: 'var(--font-body)', fontSize: '0.78rem',
        outline: 'none', cursor: 'pointer',
      }}
    >
      {options.map((o) => (
        <option key={o.value} value={o.value}>{o.label}</option>
      ))}
    </select>
  )
}

function QuickLink({
  href,
  label,
  icon: Icon,
}: {
  href: string
  label: string
  icon: React.ComponentType<{ size?: number; color?: string }>
}) {
  return (
    <Link href={href} style={{
      display: 'inline-flex', alignItems: 'center', gap: '0.45rem',
      padding: '0.5rem 0.85rem', borderRadius: 'var(--radius-sm)',
      border: '1px solid var(--color-border)',
      background: 'var(--color-bg-card)',
      color: 'var(--color-text-primary)',
      fontFamily: 'var(--font-body)', fontSize: '0.78rem', fontWeight: 500,
      textDecoration: 'none', transition: 'all 0.15s',
    }}>
      <Icon size={14} color="#DA4E24" />
      {label}
    </Link>
  )
}
