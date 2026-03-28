'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import {
  Rocket,
  Activity,
  Target,
  Wrench,
  Plus,
  FileBarChart,
  BarChart3,
  Bell,
} from 'lucide-react'
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts'

const MOCK_METRICS = [
  { label: 'Total startups', value: '24', icon: Rocket, color: '#059669', bg: 'rgba(5,150,105,0.08)' },
  { label: 'Activas este mes', value: '18', icon: Activity, color: '#3B82F6', bg: 'rgba(59,130,246,0.08)' },
  { label: 'Score promedio', value: '6.8', icon: Target, color: '#D97706', bg: 'rgba(217,119,6,0.08)' },
  { label: 'Herramientas promedio', value: '12.3', icon: Wrench, color: '#8B5CF6', bg: 'rgba(139,92,246,0.08)' },
]

const STAGE_DATA = [
  { name: 'Pre-incubación', value: 8, color: '#8B5CF6' },
  { name: 'Incubación', value: 9, color: '#059669' },
  { name: 'Aceleración', value: 5, color: '#D97706' },
  { name: 'Escalamiento', value: 2, color: '#3B82F6' },
]

const QUICK_ACTIONS = [
  { label: 'Crear cohorte', href: '/admin/cohortes/nueva', icon: Plus, color: '#059669' },
  { label: 'Generar reporte', href: '/admin/reportes', icon: FileBarChart, color: '#3B82F6' },
  { label: 'Ver benchmarking', href: '/admin/benchmarking', icon: BarChart3, color: '#8B5CF6' },
]

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

export default function AdminDashboard() {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.35 }}
      style={{ padding: '2rem 1.5rem', maxWidth: 1200, margin: '0 auto' }}
    >
      <div style={{ marginBottom: '2rem' }}>
        <h1 style={{
          fontFamily: 'var(--font-heading)', fontWeight: 700,
          fontSize: '1.5rem', color: 'var(--color-text-primary)',
          marginBottom: '0.25rem',
        }}>
          Dashboard
        </h1>
        <p style={{
          fontFamily: 'var(--font-body)', fontSize: '0.875rem',
          color: 'var(--color-text-secondary)',
        }}>
          Resumen general de tu programa de incubación
        </p>
      </div>

      {/* Metric cards */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
        gap: '1rem',
        marginBottom: '1.5rem',
      }}>
        {MOCK_METRICS.map((m, i) => {
          const Icon = m.icon
          return (
            <motion.div
              key={m.label}
              {...fadeUp}
              transition={{ ...fadeUp.transition, delay: i * 0.06 }}
              style={cardStyle}
            >
              <div style={{
                display: 'flex', alignItems: 'center', gap: '0.75rem',
                marginBottom: '1rem',
              }}>
                <div style={{
                  width: 40, height: 40, borderRadius: 'var(--radius-sm)',
                  background: m.bg, display: 'flex', alignItems: 'center',
                  justifyContent: 'center', flexShrink: 0,
                }}>
                  <Icon size={20} color={m.color} />
                </div>
              </div>
              <div style={{
                fontFamily: 'var(--font-heading)', fontWeight: 700,
                fontSize: '1.75rem', color: 'var(--color-text-primary)',
                lineHeight: 1, marginBottom: '0.25rem',
              }}>
                {m.value}
              </div>
              <div style={{
                fontFamily: 'var(--font-body)', fontSize: '0.8125rem',
                color: 'var(--color-text-secondary)',
              }}>
                {m.label}
              </div>
            </motion.div>
          )
        })}
      </div>

      {/* Middle row: Chart + Alerts */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
        gap: '1.5rem',
        marginBottom: '1.5rem',
      }}>
        {/* Stage distribution chart */}
        <motion.div {...fadeUp} transition={{ ...fadeUp.transition, delay: 0.25 }} style={cardStyle}>
          <h3 style={{
            fontFamily: 'var(--font-heading)', fontWeight: 600,
            fontSize: '1rem', color: 'var(--color-text-primary)',
            marginBottom: '1rem',
          }}>
            Distribución por etapa
          </h3>
          <div style={{ width: '100%', height: 240 }}>
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={STAGE_DATA}
                  cx="50%"
                  cy="50%"
                  innerRadius={55}
                  outerRadius={90}
                  paddingAngle={3}
                  dataKey="value"
                >
                  {STAGE_DATA.map((entry, idx) => (
                    <Cell key={idx} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    background: 'var(--color-bg-card)',
                    border: '1px solid var(--color-border)',
                    borderRadius: 8,
                    fontFamily: 'var(--font-body)',
                    fontSize: '0.8125rem',
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
          {/* Legend */}
          <div style={{
            display: 'flex', flexWrap: 'wrap', gap: '0.75rem',
            justifyContent: 'center', marginTop: '0.5rem',
          }}>
            {STAGE_DATA.map((s) => (
              <div key={s.name} style={{
                display: 'flex', alignItems: 'center', gap: '0.375rem',
              }}>
                <div style={{
                  width: 8, height: 8, borderRadius: '50%', background: s.color,
                }} />
                <span style={{
                  fontFamily: 'var(--font-body)', fontSize: '0.75rem',
                  color: 'var(--color-text-secondary)',
                }}>
                  {s.name} ({s.value})
                </span>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Alerts */}
        <motion.div {...fadeUp} transition={{ ...fadeUp.transition, delay: 0.3 }} style={cardStyle}>
          <div style={{
            display: 'flex', alignItems: 'center', gap: '0.5rem',
            marginBottom: '1rem',
          }}>
            <Bell size={18} color="var(--color-text-muted)" />
            <h3 style={{
              fontFamily: 'var(--font-heading)', fontWeight: 600,
              fontSize: '1rem', color: 'var(--color-text-primary)',
            }}>
              Alertas recientes
            </h3>
          </div>
          <div style={{
            display: 'flex', flexDirection: 'column',
            alignItems: 'center', justifyContent: 'center',
            minHeight: 200, textAlign: 'center',
            padding: '2rem',
          }}>
            <div style={{
              width: 48, height: 48, borderRadius: '50%',
              background: 'var(--color-bg-muted)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              marginBottom: '0.75rem',
            }}>
              <Bell size={20} color="var(--color-text-muted)" />
            </div>
            <p style={{
              fontFamily: 'var(--font-body)', fontSize: '0.875rem',
              color: 'var(--color-text-muted)', marginBottom: '0.25rem',
            }}>
              No hay alertas recientes
            </p>
            <p style={{
              fontFamily: 'var(--font-body)', fontSize: '0.75rem',
              color: 'var(--color-text-muted)',
            }}>
              Las alertas aparecerán aquí cuando haya actividad relevante
            </p>
          </div>
        </motion.div>
      </div>

      {/* Quick actions */}
      <motion.div {...fadeUp} transition={{ ...fadeUp.transition, delay: 0.35 }} style={cardStyle}>
        <h3 style={{
          fontFamily: 'var(--font-heading)', fontWeight: 600,
          fontSize: '1rem', color: 'var(--color-text-primary)',
          marginBottom: '1rem',
        }}>
          Acciones rápidas
        </h3>
        <div style={{
          display: 'flex', flexWrap: 'wrap', gap: '0.75rem',
        }}>
          {QUICK_ACTIONS.map((action) => {
            const Icon = action.icon
            return (
              <Link
                key={action.label}
                href={action.href}
                style={{
                  display: 'inline-flex', alignItems: 'center', gap: '0.5rem',
                  padding: '0.625rem 1.25rem', borderRadius: 'var(--radius-sm)',
                  border: '1px solid var(--color-border)',
                  background: 'var(--color-bg-card)',
                  fontFamily: 'var(--font-body)', fontSize: '0.875rem',
                  fontWeight: 500, color: 'var(--color-text-primary)',
                  textDecoration: 'none', transition: 'all 0.15s ease',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.borderColor = action.color
                  e.currentTarget.style.boxShadow = `0 0 0 1px ${action.color}22`
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.borderColor = 'var(--color-border)'
                  e.currentTarget.style.boxShadow = 'none'
                }}
              >
                <Icon size={16} color={action.color} />
                {action.label}
              </Link>
            )
          })}
        </div>
      </motion.div>
    </motion.div>
  )
}
