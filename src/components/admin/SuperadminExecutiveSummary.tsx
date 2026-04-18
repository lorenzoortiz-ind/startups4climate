'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'
import {
  Briefcase, Users, MapPin, AlertTriangle, Calendar,
  TrendingUp, Award, ChevronRight, Wrench, Gauge,
} from 'lucide-react'
import {
  DEMO_PROGRAMS, DEMO_MINPRO_KPIS, DEMO_REGION_DISTRIBUTION,
  DEMO_ALERTS, DEMO_UPCOMING_MILESTONES, formatUSD,
} from '@/lib/demo/superadmin-fixtures'
import { useAuth } from '@/context/AuthContext'

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

export function SuperadminExecutiveSummary() {
  const { isDemo } = useAuth()

  // In live mode, the superadmin executive summary is not yet populated with
  // real cross-org aggregates. Render an empty state instead of demo fixtures.
  if (!isDemo) {
    return (
      <div style={{ padding: '4rem 1.5rem', maxWidth: 720, margin: '0 auto', textAlign: 'center' }}>
        <Briefcase size={36} color="var(--color-text-muted)" style={{ marginBottom: '1rem' }} />
        <h1 style={{
          fontFamily: 'var(--font-heading)', fontWeight: 700,
          fontSize: 'var(--text-xl)', color: 'var(--color-text-primary)',
          margin: '0 0 0.5rem',
        }}>
          Resumen ejecutivo
        </h1>
        <p style={{
          fontFamily: 'var(--font-body)', fontSize: 'var(--text-sm)',
          color: 'var(--color-text-secondary)', margin: '0 0 1.5rem',
        }}>
          Aún no hay programas configurados para mostrar agregados a nivel
          superadmin. Crea organizaciones y cohortes para comenzar a ver datos consolidados.
        </p>
        <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'center', flexWrap: 'wrap' }}>
          <Link href="/superadmin/organizaciones" style={{
            padding: '0.6rem 1.1rem', borderRadius: 'var(--radius-sm)',
            background: '#FF6B4A', color: '#fff', textDecoration: 'none',
            fontFamily: 'var(--font-body)', fontSize: '0.85rem', fontWeight: 600,
          }}>
            Ver organizaciones
          </Link>
          <Link href="/superadmin/programas" style={{
            padding: '0.6rem 1.1rem', borderRadius: 'var(--radius-sm)',
            border: '1px solid var(--color-border)',
            color: 'var(--color-text-primary)', textDecoration: 'none',
            fontFamily: 'var(--font-body)', fontSize: '0.85rem', fontWeight: 600,
          }}>
            Ver programas
          </Link>
        </div>
      </div>
    )
  }

  const topPerformers = [...DEMO_PROGRAMS]
    .sort((a, b) => b.readinessAvg - a.readinessAvg)
    .slice(0, 4)

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.35 }}
      style={{ padding: '2rem 1.5rem', maxWidth: 1240, margin: '0 auto' }}
    >
      <div style={{
        display: 'inline-flex', alignItems: 'center', gap: '0.5rem',
        padding: '0.375rem 0.75rem', borderRadius: 999,
        background: 'var(--color-warning-light)',
        border: '1px solid var(--color-warning-border)',
        color: 'var(--color-warning)',
        fontFamily: 'var(--font-body)', fontSize: 'var(--text-xs)',
        fontWeight: 500, marginBottom: '1rem',
      }}>
        Modo demo · datos ilustrativos para reunión MINPRO
      </div>

      {/* Header */}
      <div style={{ marginBottom: '1.5rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '0.4rem' }}>
          <Briefcase size={22} color="#FF6B4A" />
          <h1 style={{
            fontFamily: 'var(--font-heading)', fontWeight: 700,
            fontSize: 'var(--text-xl)', color: 'var(--color-text-primary)',
            margin: 0,
          }}>
            Resumen ejecutivo · Ministerio de la Producción
          </h1>
        </div>
        <p style={{
          fontFamily: 'var(--font-body)', fontSize: 'var(--text-sm)',
          color: 'var(--color-text-secondary)', margin: 0,
        }}>
          Visión consolidada de los 8 programas de innovación financiados a nivel nacional.
        </p>
      </div>

      {/* KPI strip */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))',
        gap: '0.75rem', marginBottom: '1.5rem',
      }}>
        {[
          { icon: Briefcase, label: 'Programas activos', value: DEMO_MINPRO_KPIS.programsActive, color: '#FF6B4A' },
          { icon: Users, label: 'Startups apoyadas', value: DEMO_MINPRO_KPIS.startupsTotal, color: '#0D9488' },
          { icon: Gauge, label: 'Readiness promedio', value: `${DEMO_MINPRO_KPIS.readinessAvg}/100`, color: '#3B82F6' },
          { icon: Wrench, label: 'Tools completion', value: `${DEMO_MINPRO_KPIS.toolsCompletionPct}%`, color: '#16A34A' },
          { icon: TrendingUp, label: 'Funding levantado', value: formatUSD(DEMO_MINPRO_KPIS.fundingRaisedUSD), color: '#8B5CF6' },
          { icon: Award, label: 'Startups graduadas', value: DEMO_MINPRO_KPIS.graduatedStartups, color: '#EC4899' },
          { icon: MapPin, label: 'Regiones cubiertas', value: DEMO_MINPRO_KPIS.regions, color: '#F59E0B' },
        ].map((k, i) => {
          const Icon = k.icon
          return (
            <motion.div
              key={k.label}
              {...fadeUp}
              transition={{ ...fadeUp.transition, delay: i * 0.04 }}
              style={{
                ...cardStyle, padding: '1rem',
                background: `${k.color}0F`,
                borderColor: `${k.color}33`,
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
                <Icon size={16} color={k.color} />
              </div>
              <div style={{
                fontFamily: 'var(--font-heading)', fontWeight: 700,
                fontSize: '1.4rem', color: 'var(--color-text-primary)',
                lineHeight: 1.1, marginBottom: '0.2rem',
              }}>
                {k.value}
              </div>
              <div style={{
                fontFamily: 'var(--font-body)', fontSize: '0.66rem',
                color: 'var(--color-text-secondary)',
                textTransform: 'uppercase', letterSpacing: '0.05em',
              }}>
                {k.label}
              </div>
            </motion.div>
          )
        })}
      </div>

      {/* Two-column: regional execution + alerts */}
      <div style={{
        display: 'grid', gap: '1rem',
        gridTemplateColumns: 'minmax(0, 3fr) minmax(0, 2fr)',
        marginBottom: '1.5rem',
      }} className="exec-twocol">
        {/* Regional execution */}
        <motion.div {...fadeUp} style={cardStyle}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem' }}>
            <MapPin size={18} color="var(--color-text-muted)" />
            <h3 style={{
              fontFamily: 'var(--font-heading)', fontWeight: 600,
              fontSize: 'var(--text-md)', color: 'var(--color-text-primary)',
              margin: 0,
            }}>
              Ejecución por región
            </h3>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem' }}>
            {DEMO_REGION_DISTRIBUTION.filter((r) => r.programs > 0).map((r) => {
              const max = Math.max(...DEMO_REGION_DISTRIBUTION.map((x) => x.startups))
              const pct = (r.startups / max) * 100
              return (
                <div key={r.region}>
                  <div style={{
                    display: 'flex', justifyContent: 'space-between',
                    marginBottom: '0.25rem',
                  }}>
                    <span style={{
                      fontFamily: 'var(--font-body)', fontSize: '0.78rem',
                      color: 'var(--color-text-primary)', fontWeight: 500,
                    }}>
                      {r.region}
                    </span>
                    <span style={{
                      fontFamily: 'var(--font-body)', fontSize: '0.72rem',
                      color: 'var(--color-text-secondary)',
                      fontVariantNumeric: 'tabular-nums',
                    }}>
                      {r.startups} startups · {r.programs} prog.
                    </span>
                  </div>
                  <div style={{ height: 8, borderRadius: 4, background: 'var(--color-bg-muted)', overflow: 'hidden' }}>
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${pct}%` }}
                      transition={{ duration: 0.6, ease: 'easeOut' }}
                      style={{ height: '100%', background: r.color, borderRadius: 4 }}
                    />
                  </div>
                </div>
              )
            })}
          </div>
        </motion.div>

        {/* Alerts */}
        <motion.div {...fadeUp} transition={{ ...fadeUp.transition, delay: 0.05 }} style={cardStyle}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem' }}>
            <AlertTriangle size={18} color="#FF6B4A" />
            <h3 style={{
              fontFamily: 'var(--font-heading)', fontWeight: 600,
              fontSize: 'var(--text-md)', color: 'var(--color-text-primary)',
              margin: 0,
            }}>
              Alertas activas
            </h3>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.55rem' }}>
            {DEMO_ALERTS.map((a) => {
              const sev = a.severity === 'high'
                ? { bg: 'rgba(255,107,74,0.10)', color: '#FF6B4A', label: 'Alta' }
                : { bg: 'rgba(245,158,11,0.10)', color: '#F59E0B', label: 'Media' }
              return (
                <Link
                  key={a.id}
                  href={`/superadmin/programas/${a.programId}`}
                  style={{
                    display: 'flex', alignItems: 'flex-start', gap: '0.6rem',
                    padding: '0.65rem 0.8rem', borderRadius: 'var(--radius-sm)',
                    background: sev.bg, textDecoration: 'none',
                  }}
                >
                  <span style={{
                    padding: '0.1rem 0.4rem', borderRadius: 4,
                    fontFamily: 'var(--font-body)', fontSize: '0.62rem',
                    fontWeight: 700, color: sev.color, background: '#fff',
                    textTransform: 'uppercase', letterSpacing: '0.05em',
                    flexShrink: 0,
                  }}>
                    {sev.label}
                  </span>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{
                      fontFamily: 'var(--font-body)', fontSize: '0.78rem',
                      color: 'var(--color-text-primary)', fontWeight: 500,
                      marginBottom: '0.15rem',
                    }}>
                      {a.title}
                    </div>
                    <div style={{
                      fontFamily: 'var(--font-body)', fontSize: '0.66rem',
                      color: 'var(--color-text-secondary)',
                    }}>
                      {new Date(a.date).toLocaleDateString('es-PE', { day: '2-digit', month: 'short', year: 'numeric' })}
                    </div>
                  </div>
                  <ChevronRight size={14} color="var(--color-text-muted)" style={{ flexShrink: 0, marginTop: 2 }} />
                </Link>
              )
            })}
          </div>
        </motion.div>
      </div>

      {/* Top performers */}
      <motion.div {...fadeUp} style={{ ...cardStyle, marginBottom: '1.5rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Award size={18} color="var(--color-text-muted)" />
            <h3 style={{
              fontFamily: 'var(--font-heading)', fontWeight: 600,
              fontSize: 'var(--text-md)', color: 'var(--color-text-primary)',
              margin: 0,
            }}>
              Top programas por readiness
            </h3>
          </div>
          <Link href="/superadmin/programas" style={{
            fontFamily: 'var(--font-body)', fontSize: '0.75rem',
            color: '#FF6B4A', textDecoration: 'none', fontWeight: 600,
          }}>
            Ver todos →
          </Link>
        </div>
        <div style={{
          display: 'grid', gap: '0.65rem',
          gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
        }}>
          {topPerformers.map((p) => (
            <Link key={p.id} href={`/superadmin/programas/${p.id}`} style={{
              padding: '0.85rem 1rem', borderRadius: 'var(--radius-sm)',
              border: '1px solid var(--color-border)',
              background: 'var(--color-bg-card)',
              textDecoration: 'none',
              display: 'block', transition: 'border-color 0.15s',
            }}>
              <div style={{
                fontFamily: 'var(--font-body)', fontSize: '0.85rem',
                fontWeight: 600, color: 'var(--color-text-primary)',
                marginBottom: '0.2rem',
              }}>
                {p.name}
              </div>
              <div style={{
                display: 'flex', gap: '0.75rem',
                fontFamily: 'var(--font-body)', fontSize: '0.7rem',
                color: 'var(--color-text-secondary)',
              }}>
                <span>Readiness <strong style={{ color: '#0D9488' }}>{p.readinessAvg}</strong></span>
                <span>NPS <strong style={{ color: '#3B82F6' }}>{p.nps}</strong></span>
                <span>{p.startupsCount} startups</span>
              </div>
            </Link>
          ))}
        </div>
      </motion.div>

      {/* Próximos hitos */}
      <motion.div {...fadeUp} style={cardStyle}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem' }}>
          <Calendar size={18} color="var(--color-text-muted)" />
          <h3 style={{
            fontFamily: 'var(--font-heading)', fontWeight: 600,
            fontSize: 'var(--text-md)', color: 'var(--color-text-primary)',
            margin: 0,
          }}>
            Próximos hitos
          </h3>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.45rem' }}>
          {DEMO_UPCOMING_MILESTONES.map((m, i) => (
            <div key={i} style={{
              display: 'flex', alignItems: 'center', gap: '0.75rem',
              padding: '0.55rem 0.7rem', borderRadius: 'var(--radius-sm)',
              background: 'var(--color-bg-muted)',
            }}>
              <div style={{
                fontFamily: 'var(--font-body)', fontSize: '0.7rem',
                fontWeight: 700, color: '#FF6B4A',
                width: 78, flexShrink: 0,
                fontVariantNumeric: 'tabular-nums',
              }}>
                {new Date(m.date).toLocaleDateString('es-PE', { day: '2-digit', month: 'short' })}
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{
                  fontFamily: 'var(--font-body)', fontSize: '0.78rem',
                  color: 'var(--color-text-primary)', fontWeight: 500,
                }}>
                  {m.title}
                </div>
                <div style={{
                  fontFamily: 'var(--font-body)', fontSize: '0.66rem',
                  color: 'var(--color-text-secondary)',
                }}>
                  {m.program}
                </div>
              </div>
            </div>
          ))}
        </div>
      </motion.div>

      <style jsx>{`
        @media (max-width: 880px) {
          :global(.exec-twocol) { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </motion.div>
  )
}
