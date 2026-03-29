'use client'

import { motion } from 'framer-motion'
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from 'recharts'
import { TrendingUp, TrendingDown, Minus } from 'lucide-react'

const BENCHMARK_DATA = [
  {
    metric: 'Herramientas completadas',
    org: 12.3,
    platform: 8.7,
  },
  {
    metric: 'Avance de etapa (%)',
    org: 68,
    platform: 52,
  },
  {
    metric: 'Score diagnóstico',
    org: 6.8,
    platform: 5.9,
  },
]

const CHART_DATA = [
  { name: 'Herramientas', tuOrg: 12.3, promedio: 8.7 },
  { name: 'Avance (%)', tuOrg: 68, promedio: 52 },
  { name: 'Score diag.', tuOrg: 6.8, promedio: 5.9 },
]

function getTrend(org: number, platform: number) {
  const diff = org - platform
  const pct = platform > 0 ? ((diff / platform) * 100).toFixed(0) : '0'
  if (diff > 0) return { icon: TrendingUp, color: '#0D9488', text: `+${pct}% vs promedio` }
  if (diff < 0) return { icon: TrendingDown, color: '#DC2626', text: `${pct}% vs promedio` }
  return { icon: Minus, color: '#6B7280', text: 'Igual al promedio' }
}

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

export default function BenchmarkingPage() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: 'easeOut' }}
      style={{ padding: '2rem 1.5rem', maxWidth: 1200, margin: '0 auto' }}
    >
      <div style={{ marginBottom: '2rem' }}>
        <h1 style={{
          fontFamily: 'var(--font-heading)', fontWeight: 700,
          fontSize: '1.5rem', color: 'var(--color-text-primary)',
          marginBottom: '0.25rem',
        }}>
          Benchmarking
        </h1>
        <p style={{
          fontFamily: 'var(--font-body)', fontSize: '0.875rem',
          color: 'var(--color-text-secondary)',
        }}>
          Compara las métricas de tu organización con el promedio de la plataforma
        </p>
      </div>

      {/* Comparison cards */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
        gap: '1rem',
        marginBottom: '2rem',
      }}>
        {BENCHMARK_DATA.map((item, i) => {
          const trend = getTrend(item.org, item.platform)
          const TrendIcon = trend.icon
          return (
            <motion.div
              key={item.metric}
              {...fadeUp}
              transition={{ ...fadeUp.transition, delay: i * 0.08 }}
              style={cardStyle}
            >
              <h3 style={{
                fontFamily: 'var(--font-body)', fontSize: '0.8125rem',
                fontWeight: 500, color: 'var(--color-text-secondary)',
                marginBottom: '1rem',
              }}>
                {item.metric}
              </h3>

              <div style={{
                display: 'flex', alignItems: 'flex-end',
                justifyContent: 'space-between', marginBottom: '0.75rem',
              }}>
                <div>
                  <div style={{
                    fontFamily: 'var(--font-mono)', fontSize: '0.625rem',
                    fontWeight: 600, color: 'var(--color-text-muted)',
                    textTransform: 'uppercase', letterSpacing: '0.05em',
                    marginBottom: '0.25rem',
                  }}>
                    Tu organización
                  </div>
                  <div style={{
                    fontFamily: 'var(--font-heading)', fontWeight: 700,
                    fontSize: '1.75rem', color: 'var(--color-text-primary)',
                    lineHeight: 1,
                  }}>
                    {item.org}
                  </div>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <div style={{
                    fontFamily: 'var(--font-mono)', fontSize: '0.625rem',
                    fontWeight: 600, color: 'var(--color-text-muted)',
                    textTransform: 'uppercase', letterSpacing: '0.05em',
                    marginBottom: '0.25rem',
                  }}>
                    Promedio plataforma
                  </div>
                  <div style={{
                    fontFamily: 'var(--font-heading)', fontWeight: 700,
                    fontSize: '1.75rem', color: 'var(--color-text-muted)',
                    lineHeight: 1,
                  }}>
                    {item.platform}
                  </div>
                </div>
              </div>

              {/* Progress bars */}
              <div style={{ marginBottom: '0.75rem' }}>
                <div style={{
                  height: 6, borderRadius: 3,
                  background: 'var(--color-bg-muted)',
                  position: 'relative', overflow: 'hidden',
                }}>
                  <div style={{
                    position: 'absolute', top: 0, left: 0, height: '100%',
                    borderRadius: 3, background: 'var(--color-accent-primary)',
                    width: `${Math.min((item.org / Math.max(item.org, item.platform)) * 100, 100)}%`,
                    transition: 'width 0.6s ease',
                  }} />
                </div>
                <div style={{
                  height: 4, borderRadius: 2,
                  background: 'var(--color-bg-muted)',
                  marginTop: 4, position: 'relative', overflow: 'hidden',
                }}>
                  <div style={{
                    position: 'absolute', top: 0, left: 0, height: '100%',
                    borderRadius: 2, background: 'var(--color-text-muted)',
                    width: `${Math.min((item.platform / Math.max(item.org, item.platform)) * 100, 100)}%`,
                    transition: 'width 0.6s ease',
                  }} />
                </div>
              </div>

              <div style={{
                display: 'flex', alignItems: 'center', gap: '0.375rem',
              }}>
                <TrendIcon size={14} color={trend.color} />
                <span style={{
                  fontFamily: 'var(--font-body)', fontSize: '0.75rem',
                  fontWeight: 600, color: trend.color,
                }}>
                  {trend.text}
                </span>
              </div>
            </motion.div>
          )
        })}
      </div>

      {/* Chart */}
      <motion.div
        {...fadeUp}
        transition={{ ...fadeUp.transition, delay: 0.3 }}
        style={cardStyle}
      >
        <h3 style={{
          fontFamily: 'var(--font-heading)', fontWeight: 600,
          fontSize: '1rem', color: 'var(--color-text-primary)',
          marginBottom: '1.5rem',
        }}>
          Comparación visual
        </h3>
        <div style={{ width: '100%', height: 320 }}>
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={CHART_DATA} barGap={8}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
              <XAxis
                dataKey="name"
                tick={{ fontFamily: 'var(--font-body)', fontSize: 12, fill: 'var(--color-text-secondary)' }}
                axisLine={{ stroke: 'var(--color-border)' }}
                tickLine={false}
              />
              <YAxis
                tick={{ fontFamily: 'var(--font-body)', fontSize: 12, fill: 'var(--color-text-secondary)' }}
                axisLine={{ stroke: 'var(--color-border)' }}
                tickLine={false}
              />
              <Tooltip
                contentStyle={{
                  background: 'var(--color-bg-card)',
                  border: '1px solid var(--color-border)',
                  borderRadius: 8,
                  fontFamily: 'var(--font-body)',
                  fontSize: '0.8125rem',
                }}
              />
              <Legend
                wrapperStyle={{ fontFamily: 'var(--font-body)', fontSize: '0.8125rem' }}
              />
              <Bar dataKey="tuOrg" name="Tu organización" fill="#0D9488" radius={[4, 4, 0, 0]} />
              <Bar dataKey="promedio" name="Promedio plataforma" fill="#94A3B8" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </motion.div>
    </motion.div>
  )
}
