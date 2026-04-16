'use client'

import { useState, useEffect } from 'react'
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
import { TrendingUp, TrendingDown, Minus, Loader2 } from 'lucide-react'
import { supabase } from '@/lib/supabase'
import { useAuth } from '@/context/AuthContext'
import { DEMO_STARTUPS, DEMO_ORG } from '@/lib/demo/admin-fixtures'

interface BenchmarkMetric {
  metric: string
  org: number
  platform: number
}

function getTrend(org: number, platform: number) {
  const diff = org - platform
  const pct = platform > 0 ? ((diff / platform) * 100).toFixed(0) : '0'
  if (diff > 0) return { icon: TrendingUp, color: '#0D9488', text: `+${pct}% vs promedio` }
  if (diff < 0) return { icon: TrendingDown, color: '#DC2626', text: `${pct}% vs promedio` }
  return { icon: Minus, color: '#6B7280', text: 'Igual al promedio' }
}

function avg(arr: number[]): number {
  if (arr.length === 0) return 0
  return Math.round((arr.reduce((a, b) => a + b, 0) / arr.length) * 10) / 10
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

// Auto-derived from DEMO_STARTUPS for consistency with the rest of the demo
const DEMO_TOOLS_AVG = +(DEMO_STARTUPS.reduce((s, x) => s + x.toolsCompleted, 0) / DEMO_STARTUPS.length).toFixed(1)
const DEMO_READINESS_AVG = +(DEMO_STARTUPS.reduce((s, x) => s + x.readiness, 0) / DEMO_STARTUPS.length).toFixed(1)
const DEMO_DIAG_AVG = +(DEMO_STARTUPS.reduce((s, x) => s + x.diagnosticScore, 0) / DEMO_STARTUPS.length).toFixed(1)

const MOCK_DEMO_BENCHMARK: BenchmarkMetric[] = [
  { metric: 'Herramientas completadas (de 32)', org: DEMO_TOOLS_AVG, platform: 11.4 },
  { metric: 'Readiness score (0-100)', org: DEMO_READINESS_AVG, platform: 56 },
  { metric: 'Score diagnóstico (0-10)', org: DEMO_DIAG_AVG, platform: 5.6 },
  { metric: 'NPS programa', org: DEMO_ORG.averageNps, platform: 62 },
]

const MOCK_DEMO_CHART: { name: string; tuOrg: number; promedio: number }[] = [
  { name: 'Herramientas', tuOrg: DEMO_TOOLS_AVG, promedio: 11.4 },
  { name: 'Readiness', tuOrg: DEMO_READINESS_AVG, promedio: 56 },
  { name: 'Score diag.', tuOrg: DEMO_DIAG_AVG, promedio: 5.6 },
  { name: 'NPS', tuOrg: DEMO_ORG.averageNps, promedio: 62 },
]

export default function BenchmarkingPage() {
  const { appUser, isDemo } = useAuth()
  const [loading, setLoading] = useState(true)
  const [benchmarkData, setBenchmarkData] = useState<BenchmarkMetric[]>([])
  const [chartData, setChartData] = useState<{ name: string; tuOrg: number; promedio: number }[]>([])

  useEffect(() => {
    if (isDemo) {
      setBenchmarkData(MOCK_DEMO_BENCHMARK)
      setChartData(MOCK_DEMO_CHART)
      setLoading(false)
      return
    }

    if (!appUser?.org_id) return

    async function loadBenchmark() {
      setLoading(true)

      // Get org's cohorts
      const { data: cohorts } = await supabase
        .from('cohorts')
        .select('id')
        .eq('org_id', appUser!.org_id!)

      const cohortIds = cohorts?.map((c) => c.id) || []

      // Get org's startup IDs
      let orgStartupIds: string[] = []
      if (cohortIds.length > 0) {
        const { data: assignments } = await supabase
          .from('cohort_startups')
          .select('startup_id')
          .in('cohort_id', cohortIds)
        orgStartupIds = assignments?.map((a) => a.startup_id) || []
      }

      // Get org's startups
      let orgStartups: { diagnostic_score: number | null; tools_completed: number | null; stage: string | null }[] = []
      if (orgStartupIds.length > 0) {
        const { data } = await supabase
          .from('startups')
          .select('diagnostic_score, tools_completed, stage')
          .in('id', orgStartupIds)
        orgStartups = data || []
      }

      // Get all platform startups
      const { data: allStartups } = await supabase
        .from('startups')
        .select('diagnostic_score, tools_completed, stage')

      const platformStartups = allStartups || []

      // Calculate metrics
      const orgScores = orgStartups.filter((s) => s.diagnostic_score != null).map((s) => s.diagnostic_score!)
      const platformScores = platformStartups.filter((s) => s.diagnostic_score != null).map((s) => s.diagnostic_score!)

      const orgTools = orgStartups.map((s) => s.tools_completed || 0)
      const platformTools = platformStartups.map((s) => s.tools_completed || 0)

      // Stage progress: map stages to % (pre=25, inc=50, acc=75, scal=100)
      const stageToPercent: Record<string, number> = {
        pre_incubation: 25,
        incubation: 50,
        acceleration: 75,
        scaling: 100,
      }
      const orgProgress = orgStartups.map((s) => stageToPercent[s.stage || ''] || 0)
      const platformProgress = platformStartups.map((s) => stageToPercent[s.stage || ''] || 0)

      const metrics: BenchmarkMetric[] = [
        { metric: 'Herramientas completadas', org: avg(orgTools), platform: avg(platformTools) },
        { metric: 'Avance de etapa (%)', org: avg(orgProgress), platform: avg(platformProgress) },
        { metric: 'Score diagnóstico', org: avg(orgScores), platform: avg(platformScores) },
      ]

      setBenchmarkData(metrics)
      setChartData([
        { name: 'Herramientas', tuOrg: metrics[0].org, promedio: metrics[0].platform },
        { name: 'Avance (%)', tuOrg: metrics[1].org, promedio: metrics[1].platform },
        { name: 'Score diag.', tuOrg: metrics[2].org, promedio: metrics[2].platform },
      ])
      setLoading(false)
    }

    loadBenchmark()
  }, [appUser?.org_id, isDemo])

  if (loading) {
    return (
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '60vh' }}>
        <Loader2 size={28} color="var(--color-accent-primary)" style={{ animation: 'spin 1s linear infinite' }} />

      </div>
    )
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: 'easeOut' }}
      style={{ padding: '2rem 1.5rem', maxWidth: 1200, margin: '0 auto' }}
    >
      {isDemo && (
        <div
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.5rem',
            padding: '0.375rem 0.75rem',
            borderRadius: 999,
            background: 'var(--color-warning-light)',
            border: '1px solid var(--color-warning-border)',
            color: 'var(--color-warning)',
            fontFamily: 'var(--font-body)',
            fontSize: 'var(--text-xs)',
            fontWeight: 500,
            marginBottom: '1rem',
          }}
        >
          Modo demo — los datos son ilustrativos
        </div>
      )}

      <div style={{ marginBottom: '2rem' }}>
        <h1 style={{
          fontFamily: 'var(--font-heading)', fontWeight: 700,
          fontSize: '1.25rem', color: 'var(--color-text-primary)',
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
        {benchmarkData.map((item, i) => {
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
                    fontFamily: 'var(--font-body)', fontSize: '0.625rem',
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
                    fontFamily: 'var(--font-body)', fontSize: '0.625rem',
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
                    width: `${Math.max(item.org, item.platform) > 0 ? Math.min((item.org / Math.max(item.org, item.platform)) * 100, 100) : 0}%`,
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
                    width: `${Math.max(item.org, item.platform) > 0 ? Math.min((item.platform / Math.max(item.org, item.platform)) * 100, 100) : 0}%`,
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
            <BarChart data={chartData} barGap={8}>
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

      {/* Demo: Startups comparison table */}
      {isDemo && (
        <motion.div
          {...fadeUp}
          transition={{ ...fadeUp.transition, delay: 0.4 }}
          style={{ ...cardStyle, marginTop: '1.5rem' }}
        >
          <div style={{
            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
            marginBottom: '1rem', flexWrap: 'wrap', gap: '0.5rem',
          }}>
            <h3 style={{
              fontFamily: 'var(--font-heading)', fontWeight: 600,
              fontSize: '1rem', color: 'var(--color-text-primary)',
            }}>
              Comparativo por startup ({DEMO_STARTUPS.length})
            </h3>
            <span style={{
              fontFamily: 'var(--font-body)', fontSize: '0.72rem',
              color: 'var(--color-text-muted)',
            }}>
              Ordenado por readiness · USD MRR · Crecimiento MoM
            </span>
          </div>
          <div style={{ overflowX: 'auto' }}>
            <table style={{
              width: '100%', borderCollapse: 'collapse',
              fontFamily: 'var(--font-body)', fontSize: '0.8rem',
            }}>
              <thead>
                <tr style={{ borderBottom: '1px solid var(--color-border)' }}>
                  {['Startup', 'Vertical', 'Etapa', 'Readiness', 'MRR (USD)', 'TAM (USD)', '↑ MoM', 'Estado'].map((h) => (
                    <th key={h} style={{
                      padding: '0.6rem 0.5rem', textAlign: 'left',
                      fontWeight: 600, color: 'var(--color-text-muted)',
                      fontSize: '0.7rem', textTransform: 'uppercase',
                      letterSpacing: '0.04em',
                    }}>
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {[...DEMO_STARTUPS]
                  .sort((a, b) => b.readiness - a.readiness)
                  .map((s) => {
                    const statusColor = s.status === 'on_track' ? '#0D9488' : s.status === 'at_risk' ? '#F59E0B' : '#DC2626'
                    const statusLabel = s.status === 'on_track' ? 'On track' : s.status === 'at_risk' ? 'En riesgo' : 'Alerta'
                    return (
                      <tr key={s.id} style={{ borderBottom: '1px solid var(--color-border)' }}>
                        <td style={{ padding: '0.55rem 0.5rem', fontWeight: 500, color: 'var(--color-text-primary)' }}>
                          {s.name}
                        </td>
                        <td style={{ padding: '0.55rem 0.5rem', color: 'var(--color-text-secondary)' }}>
                          {s.verticalLabel}
                        </td>
                        <td style={{ padding: '0.55rem 0.5rem', color: 'var(--color-text-secondary)' }}>
                          {s.stageLabel}
                        </td>
                        <td style={{ padding: '0.55rem 0.5rem', color: 'var(--color-text-primary)', fontVariantNumeric: 'tabular-nums', fontWeight: 600 }}>
                          {s.readiness}
                        </td>
                        <td style={{ padding: '0.55rem 0.5rem', color: 'var(--color-text-secondary)', fontVariantNumeric: 'tabular-nums' }}>
                          {s.mrr > 0 ? `$${s.mrr.toLocaleString('en-US')}` : '—'}
                        </td>
                        <td style={{ padding: '0.55rem 0.5rem', color: 'var(--color-text-secondary)', fontVariantNumeric: 'tabular-nums' }}>
                          ${(s.tam / 1_000_000).toFixed(0)}M
                        </td>
                        <td style={{ padding: '0.55rem 0.5rem', color: 'var(--color-text-secondary)', fontVariantNumeric: 'tabular-nums' }}>
                          {s.growthRate > 0 ? `+${s.growthRate}%` : '—'}
                        </td>
                        <td style={{ padding: '0.55rem 0.5rem' }}>
                          <span style={{
                            padding: '0.15rem 0.5rem', borderRadius: 'var(--radius-xl)',
                            background: `${statusColor}1A`, color: statusColor,
                            fontSize: '0.65rem', fontWeight: 600,
                          }}>
                            {statusLabel}
                          </span>
                        </td>
                      </tr>
                    )
                  })}
              </tbody>
            </table>
          </div>
        </motion.div>
      )}
    </motion.div>
  )
}
