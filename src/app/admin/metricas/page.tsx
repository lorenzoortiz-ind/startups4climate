'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import {
  Building2, Users, Rocket, GraduationCap,
  Wrench, Target, Mail, AlertCircle,
  BarChart3, PieChart, TrendingUp,
} from 'lucide-react'
import { useAuth } from '@/context/AuthContext'
import { supabase } from '@/lib/supabase'

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

interface MetricCard {
  label: string
  value: number | string
  icon: React.ComponentType<{ size?: number; color?: string }>
  color: string
  bg: string
}

interface GroupCount {
  label: string
  count: number
}

export default function MetricasPage() {
  const { appUser } = useAuth()
  const [loading, setLoading] = useState(true)

  // Top metrics
  const [totalOrgs, setTotalOrgs] = useState(0)
  const [totalFounders, setTotalFounders] = useState(0)
  const [totalStartups, setTotalStartups] = useState(0)
  const [activeCohorts, setActiveCohorts] = useState(0)

  // Second row
  const [avgToolsCompleted, setAvgToolsCompleted] = useState(0)
  const [avgDiagnosticScore, setAvgDiagnosticScore] = useState(0)
  const [pendingInvitations, setPendingInvitations] = useState(0)
  const [openTickets, setOpenTickets] = useState(0)

  // Breakdown sections
  const [orgsByPlan, setOrgsByPlan] = useState<GroupCount[]>([])
  const [foundersByStage, setFoundersByStage] = useState<GroupCount[]>([])
  const [dailyRegistrations, setDailyRegistrations] = useState<{ date: string; count: number }[]>([])

  useEffect(() => {
    async function loadMetrics() {
      setLoading(true)

      // Run all count queries in parallel
      const [
        orgsResult,
        foundersResult,
        startupsResult,
        activeCohortsResult,
        startupsDataResult,
        invitationsResult,
        ticketsResult,
        orgsPlanResult,
        profilesStageResult,
        recentProfilesResult,
      ] = await Promise.all([
        // 1. Total organizations
        supabase.from('organizations').select('*', { count: 'exact', head: true }),
        // 2. Total founders
        supabase.from('profiles').select('*', { count: 'exact', head: true }).eq('role', 'founder'),
        // 3. Total startups
        supabase.from('startups').select('*', { count: 'exact', head: true }),
        // 4. Active cohorts
        supabase.from('cohorts').select('*', { count: 'exact', head: true }).eq('status', 'active'),
        // 5. Startups data for averages
        supabase.from('startups').select('tools_completed, diagnostic_score'),
        // 6. Pending invitations
        supabase.from('invitations').select('*', { count: 'exact', head: true }).eq('status', 'pending'),
        // 7. Open tickets
        supabase.from('support_tickets').select('*', { count: 'exact', head: true }).eq('status', 'open'),
        // 8. Orgs by plan
        supabase.from('organizations').select('plan'),
        // 9. Profiles by stage (founders)
        supabase.from('profiles').select('stage').eq('role', 'founder'),
        // 10. Recent profiles (last 30 days)
        supabase.from('profiles').select('created_at').gte(
          'created_at',
          new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString()
        ),
      ])

      setTotalOrgs(orgsResult.count || 0)
      setTotalFounders(foundersResult.count || 0)
      setTotalStartups(startupsResult.count || 0)
      setActiveCohorts(activeCohortsResult.count || 0)

      // Compute averages from startups data
      const startupsData = startupsDataResult.data || []
      if (startupsData.length > 0) {
        const toolsSum = startupsData.reduce((s, r) => s + (r.tools_completed || 0), 0)
        setAvgToolsCompleted(Math.round((toolsSum / startupsData.length) * 10) / 10)

        const withScore = startupsData.filter((r) => r.diagnostic_score != null)
        if (withScore.length > 0) {
          const scoreSum = withScore.reduce((s, r) => s + (r.diagnostic_score || 0), 0)
          setAvgDiagnosticScore(Math.round((scoreSum / withScore.length) * 10) / 10)
        }
      }

      setPendingInvitations(invitationsResult.count || 0)
      setOpenTickets(ticketsResult.count || 0)

      // Orgs by plan
      const planCounts: Record<string, number> = {}
      for (const row of orgsPlanResult.data || []) {
        const plan = row.plan || 'sin_plan'
        planCounts[plan] = (planCounts[plan] || 0) + 1
      }
      setOrgsByPlan(
        Object.entries(planCounts)
          .map(([label, count]) => ({ label, count }))
          .sort((a, b) => b.count - a.count)
      )

      // Founders by stage
      const stageCounts: Record<string, number> = {}
      for (const row of profilesStageResult.data || []) {
        const stage = row.stage || 'Sin etapa'
        stageCounts[stage] = (stageCounts[stage] || 0) + 1
      }
      setFoundersByStage(
        Object.entries(stageCounts)
          .map(([label, count]) => ({ label, count }))
          .sort((a, b) => b.count - a.count)
      )

      // Daily registrations (last 30 days)
      const dayCounts: Record<string, number> = {}
      for (const row of recentProfilesResult.data || []) {
        const day = row.created_at.substring(0, 10) // YYYY-MM-DD
        dayCounts[day] = (dayCounts[day] || 0) + 1
      }
      // Fill all 30 days
      const dailyData: { date: string; count: number }[] = []
      for (let i = 29; i >= 0; i--) {
        const d = new Date(Date.now() - i * 24 * 60 * 60 * 1000)
        const key = d.toISOString().substring(0, 10)
        dailyData.push({ date: key, count: dayCounts[key] || 0 })
      }
      setDailyRegistrations(dailyData)

      setLoading(false)
    }

    loadMetrics()
  }, [])

  if (appUser?.role !== 'superadmin') {
    return (
      <div style={{
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        minHeight: '60vh', fontFamily: 'var(--font-body)',
        color: 'var(--color-text-secondary)', fontSize: 'var(--text-sm)',
      }}>
        No tienes acceso a esta sección.
      </div>
    )
  }

  if (loading) {
    return (
      <div style={{
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        minHeight: '60vh',
      }}>
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
          style={{
            width: 32, height: 32,
            border: '3px solid var(--color-border)',
            borderTopColor: '#0D9488', borderRadius: '50%',
          }}
        />
      </div>
    )
  }

  const TOP_METRICS: MetricCard[] = [
    { label: 'Total organizaciones', value: totalOrgs, icon: Building2, color: '#0D9488', bg: 'rgba(13,148,136,0.08)' },
    { label: 'Total founders', value: totalFounders, icon: Users, color: '#3B82F6', bg: 'rgba(59,130,246,0.08)' },
    { label: 'Total startups', value: totalStartups, icon: Rocket, color: '#8B5CF6', bg: 'rgba(139,92,246,0.08)' },
    { label: 'Cohortes activos', value: activeCohorts, icon: GraduationCap, color: '#F59E0B', bg: 'rgba(245,158,11,0.08)' },
  ]

  const SECOND_METRICS: MetricCard[] = [
    { label: 'Herramientas completadas (prom.)', value: avgToolsCompleted, icon: Wrench, color: '#0D9488', bg: 'rgba(13,148,136,0.08)' },
    { label: 'Score diagnóstico (prom.)', value: avgDiagnosticScore, icon: Target, color: '#3B82F6', bg: 'rgba(59,130,246,0.08)' },
    { label: 'Invitaciones pendientes', value: pendingInvitations, icon: Mail, color: '#F59E0B', bg: 'rgba(245,158,11,0.08)' },
    { label: 'Incidencias abiertas', value: openTickets, icon: AlertCircle, color: '#DC2626', bg: 'rgba(220,38,38,0.08)' },
  ]

  const PLAN_LABELS: Record<string, string> = {
    starter: 'Starter',
    professional: 'Professional',
    enterprise: 'Enterprise',
    institutional: 'Institutional',
    sin_plan: 'Sin plan',
  }

  const maxDailyCount = Math.max(...dailyRegistrations.map((d) => d.count), 1)

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.35 }}
      style={{ padding: '2rem 1.5rem', maxWidth: 1200, margin: '0 auto' }}
    >
      {/* Header */}
      <div style={{ marginBottom: '1.5rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.25rem' }}>
          <BarChart3 size={20} color="#0D9488" />
          <h1 style={{
            fontFamily: 'var(--font-heading)', fontWeight: 700,
            fontSize: 'var(--text-xl)', color: 'var(--color-text-primary)',
          }}>
            Métricas globales
          </h1>
        </div>
        <p style={{
          fontFamily: 'var(--font-body)', fontSize: 'var(--text-sm)',
          color: 'var(--color-text-secondary)',
        }}>
          Visión general de la plataforma Startups4Climate
        </p>
      </div>

      {/* Top metrics row */}
      <div style={{
        display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
        gap: '1rem', marginBottom: '1rem',
      }}>
        {TOP_METRICS.map((m, i) => {
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
                fontSize: 'var(--text-2xl)', color: 'var(--color-text-primary)',
                lineHeight: 1, marginBottom: '0.25rem',
              }}>
                {m.value}
              </div>
              <div style={{
                fontFamily: 'var(--font-body)', fontSize: 'var(--text-xs)',
                color: 'var(--color-text-secondary)',
              }}>
                {m.label}
              </div>
            </motion.div>
          )
        })}
      </div>

      {/* Second metrics row */}
      <div style={{
        display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
        gap: '1rem', marginBottom: '1.5rem',
      }}>
        {SECOND_METRICS.map((m, i) => {
          const Icon = m.icon
          return (
            <motion.div
              key={m.label}
              {...fadeUp}
              transition={{ ...fadeUp.transition, delay: 0.24 + i * 0.06 }}
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
                fontSize: 'var(--text-2xl)', color: 'var(--color-text-primary)',
                lineHeight: 1, marginBottom: '0.25rem',
              }}>
                {m.value}
              </div>
              <div style={{
                fontFamily: 'var(--font-body)', fontSize: 'var(--text-xs)',
                color: 'var(--color-text-secondary)',
              }}>
                {m.label}
              </div>
            </motion.div>
          )
        })}
      </div>

      {/* Two-column breakdown */}
      <div style={{
        display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
        gap: '1.5rem', marginBottom: '1.5rem',
      }}>
        {/* Orgs by plan */}
        <motion.div
          {...fadeUp}
          transition={{ ...fadeUp.transition, delay: 0.5 }}
          style={cardStyle}
        >
          <div style={{
            display: 'flex', alignItems: 'center', gap: '0.5rem',
            marginBottom: '1.25rem',
          }}>
            <PieChart size={18} color="var(--color-text-muted)" />
            <h3 style={{
              fontFamily: 'var(--font-heading)', fontWeight: 600,
              fontSize: 'var(--text-md)', color: 'var(--color-text-primary)',
            }}>
              Organizaciones por plan
            </h3>
          </div>

          {orgsByPlan.length === 0 ? (
            <p style={{
              fontFamily: 'var(--font-body)', fontSize: 'var(--text-xs)',
              color: 'var(--color-text-muted)', textAlign: 'center', padding: '1rem 0',
            }}>
              Sin datos
            </p>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.625rem' }}>
              {orgsByPlan.map((item) => {
                const maxCount = Math.max(...orgsByPlan.map((i) => i.count), 1)
                const pct = (item.count / maxCount) * 100
                return (
                  <div key={item.label}>
                    <div style={{
                      display: 'flex', justifyContent: 'space-between',
                      marginBottom: '0.25rem',
                    }}>
                      <span style={{
                        fontFamily: 'var(--font-body)', fontSize: 'var(--text-xs)',
                        color: 'var(--color-text-primary)', fontWeight: 500,
                      }}>
                        {PLAN_LABELS[item.label] || item.label}
                      </span>
                      <span style={{
                        fontFamily: 'var(--font-body)', fontSize: 'var(--text-xs)',
                        color: 'var(--color-text-secondary)',
                        fontVariantNumeric: 'tabular-nums',
                      }}>
                        {item.count}
                      </span>
                    </div>
                    <div style={{
                      height: 6, borderRadius: 3,
                      background: 'var(--color-border)',
                      overflow: 'hidden',
                    }}>
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${pct}%` }}
                        transition={{ duration: 0.6, delay: 0.1, ease: 'easeOut' }}
                        style={{
                          height: '100%', borderRadius: 3,
                          background: '#0D9488',
                        }}
                      />
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </motion.div>

        {/* Founders by stage */}
        <motion.div
          {...fadeUp}
          transition={{ ...fadeUp.transition, delay: 0.55 }}
          style={cardStyle}
        >
          <div style={{
            display: 'flex', alignItems: 'center', gap: '0.5rem',
            marginBottom: '1.25rem',
          }}>
            <TrendingUp size={18} color="var(--color-text-muted)" />
            <h3 style={{
              fontFamily: 'var(--font-heading)', fontWeight: 600,
              fontSize: 'var(--text-md)', color: 'var(--color-text-primary)',
            }}>
              Founders por etapa
            </h3>
          </div>

          {foundersByStage.length === 0 ? (
            <p style={{
              fontFamily: 'var(--font-body)', fontSize: 'var(--text-xs)',
              color: 'var(--color-text-muted)', textAlign: 'center', padding: '1rem 0',
            }}>
              Sin datos
            </p>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.625rem' }}>
              {foundersByStage.map((item) => {
                const maxCount = Math.max(...foundersByStage.map((i) => i.count), 1)
                const pct = (item.count / maxCount) * 100
                return (
                  <div key={item.label}>
                    <div style={{
                      display: 'flex', justifyContent: 'space-between',
                      marginBottom: '0.25rem',
                    }}>
                      <span style={{
                        fontFamily: 'var(--font-body)', fontSize: 'var(--text-xs)',
                        color: 'var(--color-text-primary)', fontWeight: 500,
                      }}>
                        {item.label}
                      </span>
                      <span style={{
                        fontFamily: 'var(--font-body)', fontSize: 'var(--text-xs)',
                        color: 'var(--color-text-secondary)',
                        fontVariantNumeric: 'tabular-nums',
                      }}>
                        {item.count}
                      </span>
                    </div>
                    <div style={{
                      height: 6, borderRadius: 3,
                      background: 'var(--color-border)',
                      overflow: 'hidden',
                    }}>
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${pct}%` }}
                        transition={{ duration: 0.6, delay: 0.1, ease: 'easeOut' }}
                        style={{
                          height: '100%', borderRadius: 3,
                          background: '#3B82F6',
                        }}
                      />
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </motion.div>
      </div>

      {/* Daily registrations - last 30 days */}
      <motion.div
        {...fadeUp}
        transition={{ ...fadeUp.transition, delay: 0.6 }}
        style={cardStyle}
      >
        <div style={{
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          marginBottom: '1.25rem',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Users size={18} color="var(--color-text-muted)" />
            <h3 style={{
              fontFamily: 'var(--font-heading)', fontWeight: 600,
              fontSize: 'var(--text-md)', color: 'var(--color-text-primary)',
            }}>
              Registros últimos 30 días
            </h3>
          </div>
          <span style={{
            fontFamily: 'var(--font-body)', fontSize: 'var(--text-2xs)',
            color: 'var(--color-text-secondary)',
          }}>
            Total: {dailyRegistrations.reduce((s, d) => s + d.count, 0)}
          </span>
        </div>

        {/* Simple bar chart */}
        <div style={{
          display: 'flex', alignItems: 'flex-end', gap: 2,
          height: 120, padding: '0 0.25rem',
        }}>
          {dailyRegistrations.map((day) => {
            const heightPct = maxDailyCount > 0 ? (day.count / maxDailyCount) * 100 : 0
            return (
              <motion.div
                key={day.date}
                initial={{ height: 0 }}
                animate={{ height: `${Math.max(heightPct, 2)}%` }}
                transition={{ duration: 0.5, delay: 0.05, ease: 'easeOut' }}
                title={`${day.date}: ${day.count} registro${day.count !== 1 ? 's' : ''}`}
                style={{
                  flex: 1,
                  minWidth: 4,
                  borderRadius: '2px 2px 0 0',
                  background: day.count > 0 ? '#0D9488' : 'var(--color-border)',
                  cursor: 'default',
                  transition: 'opacity 0.15s',
                }}
                whileHover={{ opacity: 0.7 }}
              />
            )
          })}
        </div>

        {/* X axis labels (show first, middle, last) */}
        <div style={{
          display: 'flex', justifyContent: 'space-between',
          marginTop: '0.5rem', padding: '0 0.25rem',
        }}>
          {[0, 14, 29].map((idx) => {
            const day = dailyRegistrations[idx]
            if (!day) return null
            return (
              <span key={idx} style={{
                fontFamily: 'var(--font-body)', fontSize: 'var(--text-2xs)',
                color: 'var(--color-text-muted)',
              }}>
                {new Date(day.date).toLocaleDateString('es-CL', {
                  day: 'numeric', month: 'short',
                })}
              </span>
            )
          })}
        </div>
      </motion.div>
    </motion.div>
  )
}
