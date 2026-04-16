'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import {
  Building2, Users, TrendingUp, BarChart3,
  Plus, FileText, ChevronRight, Rocket,
  GraduationCap, Calendar, Download
} from 'lucide-react'
import { useAuth } from '@/context/AuthContext'
import { supabase } from '@/lib/supabase'
import { Card } from '@/components/ui'
import { SuperadminExecutiveSummary } from '@/components/admin/SuperadminExecutiveSummary'
import {
  DEMO_ORG, DEMO_COHORTS, DEMO_STARTUPS, DEMO_VERTICAL_DISTRIBUTION,
  DEMO_STAGE_DISTRIBUTION, topStartupsByReadiness,
} from '@/lib/demo/admin-fixtures'

interface OrgMetrics {
  totalStartups: number
  activeCohorts: number
  avgScore: number
  avgToolsCompleted: number
}

interface StartupRow {
  id: string
  name: string
  vertical: string
  stage: string
  diagnostic_score: number | null
  tools_completed: number | null
  founder_name: string
  country: string
}

interface CohortRow {
  id: string
  name: string
  status: string
  start_date: string
  end_date: string
  startup_count: number
}

// Card styling handled by <Card> component from @/components/ui

const fadeUp = {
  initial: { opacity: 0, y: 16 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.4, ease: 'easeOut' as const },
}

const STATUS_COLORS: Record<string, { bg: string; text: string }> = {
  active: { bg: 'rgba(13,148,136,0.1)', text: '#0D9488' },
  planned: { bg: 'rgba(59,130,246,0.1)', text: '#3B82F6' },
  completed: { bg: 'rgba(107,114,128,0.1)', text: '#6B7280' },
}

const MOCK_DEMO_COHORTS: CohortRow[] = [
  {
    id: 'demo-cohort-otono-2025',
    name: 'Cohorte Otoño 2025',
    status: 'active',
    start_date: '2025-09-01',
    end_date: '2025-12-15',
    startup_count: 12,
  },
  {
    id: 'demo-cohort-primavera-2026',
    name: 'Cohorte Primavera 2026',
    status: 'active',
    start_date: '2026-03-01',
    end_date: '2026-06-30',
    startup_count: 8,
  },
  {
    id: 'demo-cohort-verano-2025',
    name: 'Cohorte Verano 2025',
    status: 'completed',
    start_date: '2025-06-01',
    end_date: '2025-08-31',
    startup_count: 10,
  },
]

const MOCK_DEMO_STARTUPS: StartupRow[] = [
  {
    id: 'demo-startup-1',
    name: 'EcoAgro Perú',
    vertical: 'agritech',
    stage: 'mvp',
    diagnostic_score: 7.4,
    tools_completed: 5,
    founder_name: 'Ana Quispe',
    country: 'Perú',
  },
  {
    id: 'demo-startup-2',
    name: 'BioCultiva',
    vertical: 'biotech',
    stage: 'growth',
    diagnostic_score: 8.1,
    tools_completed: 7,
    founder_name: 'Luis Torres',
    country: 'Perú',
  },
  {
    id: 'demo-startup-3',
    name: 'SolarAndes',
    vertical: 'cleantech',
    stage: 'ideation',
    diagnostic_score: 5.8,
    tools_completed: 2,
    founder_name: 'María Paredes',
    country: 'Perú',
  },
  {
    id: 'demo-startup-4',
    name: 'HidroVerde',
    vertical: 'cleantech',
    stage: 'mvp',
    diagnostic_score: 6.9,
    tools_completed: 4,
    founder_name: 'Carlos Mendoza',
    country: 'Perú',
  },
  {
    id: 'demo-startup-5',
    name: 'AgroSmart LATAM',
    vertical: 'agritech',
    stage: 'growth',
    diagnostic_score: 7.8,
    tools_completed: 6,
    founder_name: 'Rosa Huamán',
    country: 'Perú',
  },
]

const MOCK_DEMO_METRICS: OrgMetrics = {
  totalStartups: MOCK_DEMO_STARTUPS.length,
  activeCohorts: MOCK_DEMO_COHORTS.filter((c) => c.status === 'active' || c.status === 'planned').length,
  avgScore: Math.round((MOCK_DEMO_STARTUPS.reduce((sum, s) => sum + (s.diagnostic_score || 0), 0) / MOCK_DEMO_STARTUPS.length) * 10) / 10,
  avgToolsCompleted: Math.round((MOCK_DEMO_STARTUPS.reduce((sum, s) => sum + (s.tools_completed || 0), 0) / MOCK_DEMO_STARTUPS.length) * 10) / 10,
}

export default function AdminDashboard() {
  const { appUser, isDemo } = useAuth()

  // Superadmin (MINPRO) demo dashboard — render executive summary instead of org-specific data
  if (isDemo && appUser?.role === 'superadmin') {
    return <SuperadminExecutiveSummary />
  }

  return <AdminOrgDashboard />
}

function AdminOrgDashboard() {
  const { appUser, isDemo } = useAuth()
  const [metrics, setMetrics] = useState<OrgMetrics>({
    totalStartups: 0,
    activeCohorts: 0,
    avgScore: 0,
    avgToolsCompleted: 0,
  })
  const [startups, setStartups] = useState<StartupRow[]>([])
  const [cohorts, setCohorts] = useState<CohortRow[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [orgLogo, setOrgLogo] = useState<string | null>(null)
  const [orgName, setOrgName] = useState<string | null>(null)

  useEffect(() => {
    if (isDemo) {
      setOrgName(DEMO_ORG.name)
      setOrgLogo(null)
      const cohorts: CohortRow[] = DEMO_COHORTS.map((c) => ({
        id: c.id,
        name: c.name,
        status: c.status,
        start_date: c.startDate,
        end_date: c.endDate,
        startup_count: c.startupIds.length,
      }))
      const top = topStartupsByReadiness(5)
      const startupRows: StartupRow[] = top.map((s) => ({
        id: s.id,
        name: s.name,
        vertical: s.verticalLabel,
        stage: s.stageLabel,
        diagnostic_score: s.diagnosticScore,
        tools_completed: s.toolsCompleted,
        founder_name: s.founderName,
        country: 'Perú',
      }))
      setCohorts(cohorts)
      setStartups(startupRows)
      setMetrics({
        totalStartups: DEMO_ORG.activeStartups,
        activeCohorts: DEMO_COHORTS.filter((c) => c.status === 'active').length,
        avgScore: 7.3,
        avgToolsCompleted: 23,
      })
      setLoading(false)
      return
    }

    async function loadData() {
      if (!appUser?.org_id) {
        setLoading(false)
        return
      }

      try {
        // Load org info and cohorts in parallel
        const [orgRes, cohortRes] = await Promise.all([
          supabase.from('organizations').select('name, logo_url').eq('id', appUser.org_id).single(),
          supabase.from('cohorts').select('id, name, status, start_date, end_date').eq('org_id', appUser.org_id),
        ])

        if (orgRes.data) {
          setOrgLogo(orgRes.data.logo_url)
          setOrgName(orgRes.data.name)
        }

        const cohortData = cohortRes.data || []
        const cohortIds = cohortData.map((c) => c.id)

        // Load ALL cohort_startups in one batch query (fixes N+1)
        let startupList: StartupRow[] = []
        let cohortList: CohortRow[] = []

        if (cohortIds.length > 0) {
          const { data: csData } = await supabase
            .from('cohort_startups')
            .select('cohort_id, startup_id')
            .in('cohort_id', cohortIds)

          // Count startups per cohort from the batch result
          const countMap: Record<string, number> = {}
          const startupIds = new Set<string>()
          ;(csData || []).forEach((cs) => {
            countMap[cs.cohort_id] = (countMap[cs.cohort_id] || 0) + 1
            startupIds.add(cs.startup_id)
          })

          cohortList = cohortData.map((c) => ({
            ...c,
            startup_count: countMap[c.id] || 0,
          }))

          if (startupIds.size > 0) {
            // Load startups and founder profiles in parallel
            const { data: startupData } = await supabase
              .from('startups')
              .select('id, name, vertical, stage, diagnostic_score, tools_completed, country, founder_id')
              .in('id', Array.from(startupIds))

            const founderIds = (startupData || []).map((s) => s.founder_id).filter(Boolean)
            const { data: profileData } = founderIds.length > 0
              ? await supabase.from('profiles').select('id, full_name').in('id', founderIds)
              : { data: [] }

            startupList = (startupData || []).map((s) => ({
              ...s,
              founder_name:
                profileData?.find((p) => p.id === s.founder_id)?.full_name || 'Sin nombre',
            })) as StartupRow[]
          }
        } else {
          cohortList = cohortData.map((c) => ({ ...c, startup_count: 0 }))
        }

        setCohorts(cohortList)
        setStartups(startupList)
        setMetrics({
          totalStartups: startupList.length,
          activeCohorts: cohortList.filter(
            (c) => c.status === 'active' || c.status === 'planned'
          ).length,
          avgScore:
            startupList.length > 0
              ? Math.round(
                  (startupList.reduce(
                    (sum, s) => sum + (s.diagnostic_score || 0),
                    0
                  ) /
                    startupList.length) *
                    10
                ) / 10
              : 0,
          avgToolsCompleted:
            startupList.length > 0
              ? Math.round(
                  (startupList.reduce(
                    (sum, s) => sum + (s.tools_completed || 0),
                    0
                  ) /
                    startupList.length) *
                    10
                ) / 10
              : 0,
        })
      } catch (err) {
        console.error('[S4C Admin] Error loading dashboard:', err)
        setError('No se pudieron cargar los datos. Intenta recargar la página.')
      } finally {
        setLoading(false)
      }
    }
    loadData()
  }, [appUser, isDemo])

  const METRIC_CARDS = [
    {
      label: 'Total startups',
      value: metrics.totalStartups,
      icon: Rocket,
      color: '#0D9488',
      bg: 'rgba(13,148,136,0.08)',
    },
    {
      label: 'Cohortes activas',
      value: metrics.activeCohorts,
      icon: GraduationCap,
      color: '#3B82F6',
      bg: 'rgba(59,130,246,0.08)',
    },
    {
      label: 'Score promedio',
      value: metrics.avgScore,
      icon: TrendingUp,
      color: '#2A222B',
      bg: 'rgba(42,34,43,0.08)',
    },
    {
      label: 'Herramientas promedio',
      value: metrics.avgToolsCompleted,
      icon: BarChart3,
      color: '#8B5CF6',
      bg: 'rgba(139,92,246,0.08)',
    },
  ]

  const QUICK_ACTIONS = [
    {
      label: 'Crear cohorte',
      href: '/admin/cohortes/nueva',
      icon: Plus,
      color: '#0D9488',
    },
    {
      label: 'Generar reporte',
      href: '/admin/reportes',
      icon: FileText,
      color: '#3B82F6',
    },
    {
      label: 'Descargar datos',
      href: '/admin/reportes',
      icon: Download,
      color: '#8B5CF6',
    },
  ]

  if (loading) {
    return (
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          minHeight: '60vh',
        }}
      >
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
          style={{
            width: 32,
            height: 32,
            border: '3px solid var(--color-border)',
            borderTopColor: '#0D9488',
            borderRadius: '50%',
          }}
        />
      </div>
    )
  }

  if (error) {
    return (
      <div style={{
        display: 'flex', flexDirection: 'column', alignItems: 'center',
        justifyContent: 'center', minHeight: '60vh', padding: '2rem',
        textAlign: 'center',
      }}>
        <div style={{
          width: 48, height: 48, borderRadius: '50%',
          background: '#FEF2F2', display: 'flex', alignItems: 'center',
          justifyContent: 'center', marginBottom: '1rem',
        }}>
          <span style={{ fontSize: '1.25rem' }}>⚠</span>
        </div>
        <p style={{
          fontFamily: 'var(--font-body)', fontSize: 'var(--text-base)',
          fontWeight: 600, color: 'var(--color-text-primary)', marginBottom: '0.5rem',
        }}>
          Error al cargar el dashboard
        </p>
        <p style={{
          fontFamily: 'var(--font-body)', fontSize: 'var(--text-sm)',
          color: 'var(--color-text-secondary)', marginBottom: '1.5rem', maxWidth: 400,
        }}>
          {error}
        </p>
        <button
          onClick={() => { setError(null); setLoading(true); window.location.reload() }}
          style={{
            padding: '0.5rem 1.5rem', borderRadius: 'var(--radius-sm)',
            background: 'var(--color-accent-primary)', color: '#fff',
            border: 'none', fontFamily: 'var(--font-body)', fontSize: 'var(--text-sm)',
            fontWeight: 600, cursor: 'pointer',
          }}
        >
          Reintentar
        </button>
      </div>
    )
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.35 }}
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

      {/* Welcome header */}
      <div style={{ marginBottom: '2rem' }}>
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.75rem',
            marginBottom: '0.5rem',
          }}
        >
          {orgLogo ? (
            <img
              src={orgLogo}
              alt={orgName || ''}
              style={{
                width: 44, height: 44, borderRadius: 10,
                objectFit: 'contain', background: '#fff',
                border: '1px solid var(--color-border)',
                flexShrink: 0,
              }}
            />
          ) : (
            <Building2 size={20} color="#0D9488" />
          )}
          <div>
            <h1
              style={{
                fontFamily: 'var(--font-heading)',
                fontWeight: 700,
                fontSize: 'var(--text-xl)',
                color: 'var(--color-text-primary)',
                margin: 0,
              }}
            >
              {appUser?.full_name
                ? `Bienvenido, ${appUser.full_name}`
                : 'Dashboard'}
            </h1>
            <p
              style={{
                fontFamily: 'var(--font-body)',
                fontSize: 'var(--text-sm)',
                color: 'var(--color-text-secondary)',
                margin: 0,
              }}
            >
              {orgName || 'Resumen general de tu programa de incubación'}
            </p>
          </div>
        </div>
      </div>

      {/* Metric cards */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
          gap: '1rem',
          marginBottom: '1.5rem',
        }}
      >
        {METRIC_CARDS.map((m, i) => {
          const Icon = m.icon
          return (
            <motion.div
              key={m.label}
              {...fadeUp}
              transition={{ ...fadeUp.transition, delay: i * 0.06 }}
            >
              <Card padding="none" style={{ padding: '1.5rem' }}>
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.75rem',
                    marginBottom: '1rem',
                  }}
                >
                  <div
                    style={{
                      width: 40,
                      height: 40,
                      borderRadius: 'var(--radius-sm)',
                      background: m.bg,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      flexShrink: 0,
                    }}
                  >
                    <Icon size={20} color={m.color} />
                  </div>
                </div>
                <div
                  style={{
                    fontFamily: 'var(--font-heading)',
                    fontWeight: 700,
                    fontSize: 'var(--text-2xl)',
                    color: 'var(--color-text-primary)',
                    lineHeight: 1,
                    marginBottom: '0.25rem',
                  }}
                >
                  {m.value}
                </div>
                <div
                  style={{
                    fontFamily: 'var(--font-body)',
                    fontSize: 'var(--text-xs)',
                    color: 'var(--color-text-secondary)',
                  }}
                >
                  {m.label}
                </div>
              </Card>
            </motion.div>
          )
        })}
      </div>

      {/* Demo-only enriched insights */}
      {isDemo && (
        <motion.div
          {...fadeUp}
          transition={{ ...fadeUp.transition, delay: 0.18 }}
          style={{ marginBottom: '1.5rem' }}
        >
          <Card padding="none" style={{ padding: '1.5rem' }}>
            <div style={{
              display: 'grid', gap: '1rem',
              gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))',
              marginBottom: '1.25rem',
            }}>
              {[
                { label: 'Financiamiento gestionado', value: 'USD 1.2M', bg: 'rgba(255,107,74,0.08)', color: '#FF6B4A' },
                { label: 'Tools completion rate', value: `${DEMO_ORG.toolsCompletionRate}%`, bg: 'rgba(13,148,136,0.08)', color: '#0D9488' },
                { label: 'NPS promedio', value: DEMO_ORG.averageNps, bg: 'rgba(59,130,246,0.08)', color: '#3B82F6' },
                { label: 'Mentores activos', value: DEMO_ORG.mentors, bg: 'rgba(139,92,246,0.08)', color: '#8B5CF6' },
              ].map((k) => (
                <div key={k.label} style={{
                  padding: '0.85rem 1rem', borderRadius: 'var(--radius-sm)',
                  background: k.bg,
                }}>
                  <div style={{
                    fontFamily: 'var(--font-heading)', fontWeight: 700,
                    fontSize: '1.3rem', color: 'var(--color-text-primary)',
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
                </div>
              ))}
            </div>

            <div style={{
              display: 'grid', gap: '1.25rem',
              gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
            }}>
              <div>
                <h4 style={{
                  fontFamily: 'var(--font-body)', fontSize: '0.7rem',
                  fontWeight: 700, color: 'var(--color-text-secondary)',
                  textTransform: 'uppercase', letterSpacing: '0.06em',
                  marginBottom: '0.55rem',
                }}>
                  Distribución por vertical
                </h4>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                  {DEMO_VERTICAL_DISTRIBUTION.map((v) => {
                    const total = DEMO_VERTICAL_DISTRIBUTION.reduce((s, x) => s + x.count, 0)
                    const pct = (v.count / total) * 100
                    return (
                      <div key={v.key}>
                        <div style={{
                          display: 'flex', justifyContent: 'space-between',
                          fontFamily: 'var(--font-body)', fontSize: '0.75rem',
                          color: 'var(--color-text-primary)',
                          marginBottom: '0.2rem',
                        }}>
                          <span>{v.label}</span>
                          <span style={{ fontVariantNumeric: 'tabular-nums', color: 'var(--color-text-secondary)' }}>{v.count}</span>
                        </div>
                        <div style={{ height: 6, borderRadius: 3, background: 'var(--color-bg-muted)', overflow: 'hidden' }}>
                          <div style={{ height: '100%', width: `${pct}%`, background: v.color, borderRadius: 3 }} />
                        </div>
                      </div>
                    )
                  })}
                </div>
              </div>

              <div>
                <h4 style={{
                  fontFamily: 'var(--font-body)', fontSize: '0.7rem',
                  fontWeight: 700, color: 'var(--color-text-secondary)',
                  textTransform: 'uppercase', letterSpacing: '0.06em',
                  marginBottom: '0.55rem',
                }}>
                  Distribución por etapa
                </h4>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                  {DEMO_STAGE_DISTRIBUTION.map((s) => {
                    const total = DEMO_STAGE_DISTRIBUTION.reduce((sum, x) => sum + x.count, 0)
                    const pct = (s.count / total) * 100
                    return (
                      <div key={s.key}>
                        <div style={{
                          display: 'flex', justifyContent: 'space-between',
                          fontFamily: 'var(--font-body)', fontSize: '0.75rem',
                          color: 'var(--color-text-primary)',
                          marginBottom: '0.2rem',
                        }}>
                          <span>{s.label}</span>
                          <span style={{ fontVariantNumeric: 'tabular-nums', color: 'var(--color-text-secondary)' }}>{s.count}</span>
                        </div>
                        <div style={{ height: 6, borderRadius: 3, background: 'var(--color-bg-muted)', overflow: 'hidden' }}>
                          <div style={{ height: '100%', width: `${pct}%`, background: s.color, borderRadius: 3 }} />
                        </div>
                      </div>
                    )
                  })}
                </div>
              </div>
            </div>
          </Card>
        </motion.div>
      )}

      {/* Cohorts section */}
      <motion.div
        {...fadeUp}
        transition={{ ...fadeUp.transition, delay: 0.25 }}
        style={{ marginBottom: '1.5rem' }}
      >
        <Card padding="none" style={{ padding: '1.5rem' }}>
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginBottom: '1rem',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <GraduationCap size={18} color="var(--color-text-muted)" />
            <h3
              style={{
                fontFamily: 'var(--font-heading)',
                fontWeight: 600,
                fontSize: 'var(--text-md)',
                color: 'var(--color-text-primary)',
              }}
            >
              Cohortes
            </h3>
          </div>
          <Link
            href="/admin/cohortes/nueva"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.375rem',
              fontFamily: 'var(--font-body)',
              fontSize: 'var(--text-xs)',
              color: '#0D9488',
              textDecoration: 'none',
              fontWeight: 500,
            }}
          >
            <Plus size={14} />
            Nueva cohorte
          </Link>
        </div>

        {cohorts.length === 0 ? (
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              minHeight: 140,
              textAlign: 'center',
              padding: '2rem',
            }}
          >
            <div
              style={{
                width: 48,
                height: 48,
                borderRadius: '50%',
                background: 'var(--color-bg-muted)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginBottom: '0.75rem',
              }}
            >
              <GraduationCap size={20} color="var(--color-text-muted)" />
            </div>
            <p
              style={{
                fontFamily: 'var(--font-body)',
                fontSize: 'var(--text-sm)',
                color: 'var(--color-text-muted)',
                marginBottom: '0.25rem',
              }}
            >
              No hay cohortes aún
            </p>
            <p
              style={{
                fontFamily: 'var(--font-body)',
                fontSize: 'var(--text-2xs)',
                color: 'var(--color-text-muted)',
              }}
            >
              Crea tu primera cohorte para comenzar a organizar startups
            </p>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            {cohorts.map((cohort) => {
              const statusStyle = STATUS_COLORS[cohort.status] || STATUS_COLORS.planned
              return (
                <div
                  key={cohort.id}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '0.75rem 1rem',
                    borderRadius: 'var(--radius-sm)',
                    border: '1px solid var(--color-border)',
                    background: 'var(--color-bg-card)',
                  }}
                >
                  <div>
                    <div
                      style={{
                        fontFamily: 'var(--font-heading)',
                        fontWeight: 600,
                        fontSize: 'var(--text-base)',
                        color: 'var(--color-text-primary)',
                        marginBottom: '0.125rem',
                      }}
                    >
                      {cohort.name}
                    </div>
                    <div
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.75rem',
                        fontFamily: 'var(--font-body)',
                        fontSize: 'var(--text-2xs)',
                        color: 'var(--color-text-secondary)',
                      }}
                    >
                      <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.25rem' }}>
                        <Users size={12} />
                        {cohort.startup_count} startups
                      </span>
                      <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.25rem' }}>
                        <Calendar size={12} />
                        {cohort.start_date
                          ? new Date(cohort.start_date).toLocaleDateString('es-CL', {
                              month: 'short',
                              year: 'numeric',
                            })
                          : 'Sin fecha'}
                      </span>
                    </div>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                    <span
                      style={{
                        padding: '0.25rem 0.625rem',
                        borderRadius: 999,
                        fontSize: 'var(--text-xs)',
                        fontFamily: 'var(--font-body)',
                        fontWeight: 500,
                        background: statusStyle.bg,
                        color: statusStyle.text,
                      }}
                    >
                      {cohort.status === 'active'
                        ? 'Activa'
                        : cohort.status === 'planned'
                          ? 'Planificada'
                          : 'Completada'}
                    </span>
                    <ChevronRight size={16} color="var(--color-text-muted)" />
                  </div>
                </div>
              )
            })}
          </div>
        )}
        </Card>
      </motion.div>

      {/* Startups table */}
      <motion.div
        {...fadeUp}
        transition={{ ...fadeUp.transition, delay: 0.3 }}
        style={{ marginBottom: '1.5rem' }}
      >
        <Card padding="none" style={{ padding: '1.5rem' }}>
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginBottom: '1rem',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Rocket size={18} color="var(--color-text-muted)" />
            <h3
              style={{
                fontFamily: 'var(--font-heading)',
                fontWeight: 600,
                fontSize: 'var(--text-md)',
                color: 'var(--color-text-primary)',
              }}
            >
              Startups
            </h3>
          </div>
          {startups.length > 0 && (
            <span
              style={{
                fontFamily: 'var(--font-body)',
                fontSize: 'var(--text-2xs)',
                color: 'var(--color-text-secondary)',
              }}
            >
              {startups.length} registrada{startups.length !== 1 ? 's' : ''}
            </span>
          )}
        </div>

        {startups.length === 0 ? (
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              minHeight: 140,
              textAlign: 'center',
              padding: '2rem',
            }}
          >
            <div
              style={{
                width: 48,
                height: 48,
                borderRadius: '50%',
                background: 'var(--color-bg-muted)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginBottom: '0.75rem',
              }}
            >
              <Rocket size={20} color="var(--color-text-muted)" />
            </div>
            <p
              style={{
                fontFamily: 'var(--font-body)',
                fontSize: 'var(--text-sm)',
                color: 'var(--color-text-muted)',
                marginBottom: '0.25rem',
              }}
            >
              No hay startups registradas aún
            </p>
            <p
              style={{
                fontFamily: 'var(--font-body)',
                fontSize: 'var(--text-2xs)',
                color: 'var(--color-text-muted)',
              }}
            >
              Las startups aparecerán aquí cuando se unan a una cohorte
            </p>
          </div>
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <table
              style={{
                width: '100%',
                borderCollapse: 'collapse',
                fontFamily: 'var(--font-body)',
                fontSize: 'var(--text-xs)',
              }}
            >
              <thead>
                <tr>
                  {['Startup', 'Fundador/a', 'Vertical', 'Etapa', 'Score', 'Herramientas'].map(
                    (header) => (
                      <th
                        key={header}
                        style={{
                          textAlign: 'left',
                          padding: '0.625rem 0.75rem',
                          borderBottom: '1px solid var(--color-border)',
                          fontWeight: 600,
                          color: 'var(--color-text-secondary)',
                          fontSize: 'var(--text-xs)',
                          textTransform: 'uppercase',
                          letterSpacing: '0.04em',
                        }}
                      >
                        {header}
                      </th>
                    )
                  )}
                </tr>
              </thead>
              <tbody>
                {startups.map((startup) => (
                  <tr
                    key={startup.id}
                    style={{ borderBottom: '1px solid var(--color-border)' }}
                  >
                    <td
                      style={{
                        padding: '0.75rem',
                        fontWeight: 600,
                        color: 'var(--color-text-primary)',
                        whiteSpace: 'nowrap',
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <div
                          style={{
                            width: 28,
                            height: 28,
                            borderRadius: 'var(--radius-sm)',
                            background: 'rgba(13,148,136,0.08)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            flexShrink: 0,
                            fontSize: 'var(--text-2xs)',
                            fontWeight: 700,
                            color: '#0D9488',
                          }}
                        >
                          {startup.name?.charAt(0).toUpperCase() || 'S'}
                        </div>
                        {startup.name}
                      </div>
                    </td>
                    <td
                      style={{
                        padding: '0.75rem',
                        color: 'var(--color-text-secondary)',
                        whiteSpace: 'nowrap',
                      }}
                    >
                      {startup.founder_name}
                    </td>
                    <td
                      style={{
                        padding: '0.75rem',
                        color: 'var(--color-text-secondary)',
                        whiteSpace: 'nowrap',
                      }}
                    >
                      {startup.vertical || '-'}
                    </td>
                    <td
                      style={{
                        padding: '0.75rem',
                        whiteSpace: 'nowrap',
                      }}
                    >
                      <span
                        style={{
                          padding: '0.1875rem 0.5rem',
                          borderRadius: 999,
                          fontSize: 'var(--text-xs)',
                          fontWeight: 500,
                          background: 'rgba(13,148,136,0.08)',
                          color: '#0D9488',
                        }}
                      >
                        {startup.stage || 'Sin etapa'}
                      </span>
                    </td>
                    <td
                      style={{
                        padding: '0.75rem',
                        color: 'var(--color-text-primary)',
                        fontWeight: 600,
                        fontVariantNumeric: 'tabular-nums',
                      }}
                    >
                      {startup.diagnostic_score != null
                        ? startup.diagnostic_score.toFixed(1)
                        : '-'}
                    </td>
                    <td
                      style={{
                        padding: '0.75rem',
                        color: 'var(--color-text-primary)',
                        fontVariantNumeric: 'tabular-nums',
                      }}
                    >
                      {startup.tools_completed != null
                        ? startup.tools_completed
                        : '-'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
        </Card>
      </motion.div>

      {/* Quick actions */}
      <motion.div
        {...fadeUp}
        transition={{ ...fadeUp.transition, delay: 0.35 }}
      >
        <Card padding="none" style={{ padding: '1.5rem' }}>
          <h3
            style={{
              fontFamily: 'var(--font-heading)',
              fontWeight: 600,
              fontSize: 'var(--text-md)',
              color: 'var(--color-text-primary)',
              marginBottom: '1rem',
            }}
          >
            Acciones rápidas
          </h3>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.75rem' }}>
            {QUICK_ACTIONS.map((action) => {
              const Icon = action.icon
              return (
                <Link
                  key={action.label}
                  href={action.href}
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '0.5rem',
                    padding: '0.5rem 1rem',
                    borderRadius: 'var(--radius-sm)',
                    border: '1px solid var(--color-border)',
                    background: 'var(--color-bg-card)',
                    fontFamily: 'var(--font-body)',
                    fontSize: 'var(--text-sm)',
                    fontWeight: 600,
                    color: 'var(--color-text-primary)',
                    textDecoration: 'none',
                    transition: 'all 0.15s ease',
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
        </Card>
      </motion.div>
    </motion.div>
  )
}
