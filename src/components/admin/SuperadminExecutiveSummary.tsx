'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import {
  Building2, Users, Briefcase, Target, ChevronRight, Loader2,
  TrendingUp, UserPlus, Plus,
} from 'lucide-react'
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

interface PlatformMetrics {
  totalOrgs: number
  totalFounders: number
  totalAdmins: number
  totalStartups: number
  totalCohorts: number
  activeCohorts: number
  pendingRequests: number
  recentOrgs: { id: string; name: string; plan: string; created_at: string }[]
  recentFounders: { id: string; full_name: string; email: string; created_at: string }[]
}

export function SuperadminExecutiveSummary() {
  const [metrics, setMetrics] = useState<PlatformMetrics | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function load() {
      try {
        const [
          { count: totalOrgs },
          { count: totalFounders },
          { count: totalAdmins },
          { count: totalStartups },
          { count: totalCohorts },
          { count: activeCohorts },
          { count: pendingRequests },
          { data: recentOrgs },
          { data: recentFounders },
        ] = await Promise.all([
          supabase.from('organizations').select('id', { count: 'exact', head: true }),
          supabase.from('profiles').select('id', { count: 'exact', head: true }).eq('role', 'founder'),
          supabase.from('profiles').select('id', { count: 'exact', head: true }).eq('role', 'admin_org'),
          supabase.from('startups').select('id', { count: 'exact', head: true }),
          supabase.from('cohorts').select('id', { count: 'exact', head: true }),
          supabase.from('cohorts').select('id', { count: 'exact', head: true }).eq('status', 'active'),
          supabase.from('cohort_requests').select('id', { count: 'exact', head: true }).eq('status', 'pending'),
          supabase.from('organizations').select('id, name, plan, created_at').order('created_at', { ascending: false }).limit(5),
          supabase.from('profiles').select('id, full_name, email, created_at').eq('role', 'founder').order('created_at', { ascending: false }).limit(5),
        ])

        setMetrics({
          totalOrgs: totalOrgs ?? 0,
          totalFounders: totalFounders ?? 0,
          totalAdmins: totalAdmins ?? 0,
          totalStartups: totalStartups ?? 0,
          totalCohorts: totalCohorts ?? 0,
          activeCohorts: activeCohorts ?? 0,
          pendingRequests: pendingRequests ?? 0,
          recentOrgs: recentOrgs ?? [],
          recentFounders: recentFounders ?? [],
        })
      } catch (err) {
        console.error('[S4C Superadmin] Error loading metrics:', err)
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [])

  if (loading) {
    return (
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '60vh' }}>
        <Loader2 size={28} color="var(--color-accent-primary)" style={{ animation: 'spin 1s linear infinite' }} />
      </div>
    )
  }

  if (!metrics) return null

  const kpis = [
    { label: 'Organizaciones', value: metrics.totalOrgs, icon: Building2, color: '#DA4E24', href: '/superadmin/organizaciones' },
    { label: 'Admins de org', value: metrics.totalAdmins, icon: Users, color: '#8B5CF6', href: '/superadmin/usuarios' },
    { label: 'Founders', value: metrics.totalFounders, icon: UserPlus, color: '#1F77F6', href: '/superadmin/usuarios' },
    { label: 'Startups', value: metrics.totalStartups, icon: Briefcase, color: '#F0721D', href: '/superadmin/usuarios' },
    { label: 'Cohortes activas', value: `${metrics.activeCohorts}/${metrics.totalCohorts}`, icon: Target, color: '#10B981', href: '/superadmin/organizaciones' },
    { label: 'Solicitudes pendientes', value: metrics.pendingRequests, icon: TrendingUp, color: metrics.pendingRequests > 0 ? '#F59E0B' : '#6B7280', href: '/superadmin/organizaciones' },
  ]

  return (
    <div style={{ padding: '2rem 1.5rem', maxWidth: 1100, margin: '0 auto' }}>
      {/* Header */}
      <motion.div {...fadeUp} style={{ marginBottom: '1.5rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h1 style={{
            fontFamily: 'var(--font-heading)', fontWeight: 700,
            fontSize: '1.375rem', color: 'var(--color-text-primary)',
            margin: 0,
          }}>
            Panel Superadmin
          </h1>
          <p style={{
            fontFamily: 'var(--font-body)', fontSize: '0.8125rem',
            color: 'var(--color-text-secondary)', margin: '0.25rem 0 0',
          }}>
            Vista consolidada de la plataforma · Datos en tiempo real
          </p>
        </div>
        <Link
          href="/superadmin/organizaciones/nueva"
          style={{
            display: 'inline-flex', alignItems: 'center', gap: '0.375rem',
            padding: '0.5rem 1rem', borderRadius: 8,
            background: 'var(--color-accent-primary)', color: '#fff',
            fontFamily: 'var(--font-body)', fontSize: '0.8125rem', fontWeight: 600,
            textDecoration: 'none',
          }}
        >
          <Plus size={16} />
          Nueva organización
        </Link>
      </motion.div>

      {/* KPI grid */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))',
        gap: '0.875rem',
        marginBottom: '1.5rem',
      }}>
        {kpis.map((kpi, i) => {
          const Icon = kpi.icon
          return (
            <motion.div
              key={kpi.label}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.35, delay: i * 0.05 }}
            >
              <Link href={kpi.href} style={{ textDecoration: 'none' }}>
                <div
                  style={{
                    ...cardStyle,
                    padding: '1.125rem',
                    cursor: 'pointer',
                    transition: 'border-color 0.15s',
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.borderColor = kpi.color)}
                  onMouseLeave={(e) => (e.currentTarget.style.borderColor = 'var(--color-border)')}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.625rem' }}>
                    <div style={{
                      width: 28, height: 28, borderRadius: 6,
                      background: `${kpi.color}15`,
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                    }}>
                      <Icon size={14} color={kpi.color} />
                    </div>
                  </div>
                  <div style={{
                    fontFamily: 'var(--font-heading)', fontWeight: 700,
                    fontSize: '1.5rem', color: 'var(--color-text-primary)',
                    lineHeight: 1.1,
                  }}>
                    {kpi.value}
                  </div>
                  <div style={{
                    fontFamily: 'var(--font-body)', fontSize: '0.6875rem',
                    color: 'var(--color-text-muted)', marginTop: '0.25rem',
                  }}>
                    {kpi.label}
                  </div>
                </div>
              </Link>
            </motion.div>
          )
        })}
      </div>

      {/* Two-column: Recent orgs + Recent founders */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
        gap: '1rem',
      }}>
        {/* Recent organizations */}
        <motion.div {...fadeUp} style={cardStyle}>
          <div style={{
            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
            marginBottom: '1rem',
          }}>
            <h2 style={{
              fontFamily: 'var(--font-heading)', fontWeight: 600,
              fontSize: '0.9375rem', color: 'var(--color-text-primary)', margin: 0,
            }}>
              Últimas organizaciones
            </h2>
            <Link href="/superadmin/organizaciones" style={{
              fontFamily: 'var(--font-body)', fontSize: '0.6875rem',
              color: 'var(--color-accent-primary)', textDecoration: 'none',
              display: 'flex', alignItems: 'center', gap: '0.25rem',
            }}>
              Ver todas <ChevronRight size={12} />
            </Link>
          </div>
          {metrics.recentOrgs.length === 0 ? (
            <p style={{ fontFamily: 'var(--font-body)', fontSize: '0.8125rem', color: 'var(--color-text-muted)' }}>
              No hay organizaciones aún.
            </p>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.625rem' }}>
              {metrics.recentOrgs.map((org) => (
                <Link
                  key={org.id}
                  href={`/superadmin/organizaciones/${org.id}`}
                  style={{
                    display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                    padding: '0.625rem 0.75rem', borderRadius: 8,
                    border: '1px solid var(--color-border)',
                    textDecoration: 'none', transition: 'border-color 0.15s',
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.borderColor = 'var(--color-accent-primary)')}
                  onMouseLeave={(e) => (e.currentTarget.style.borderColor = 'var(--color-border)')}
                >
                  <div>
                    <div style={{
                      fontFamily: 'var(--font-body)', fontSize: '0.8125rem',
                      fontWeight: 600, color: 'var(--color-text-primary)',
                    }}>
                      {org.name}
                    </div>
                    <div style={{
                      fontFamily: 'var(--font-body)', fontSize: '0.6875rem',
                      color: 'var(--color-text-muted)', marginTop: '0.125rem',
                    }}>
                      Plan {org.plan} · {new Date(org.created_at).toLocaleDateString('es-PE', { day: 'numeric', month: 'short', year: 'numeric' })}
                    </div>
                  </div>
                  <ChevronRight size={14} color="var(--color-text-muted)" />
                </Link>
              ))}
            </div>
          )}
        </motion.div>

        {/* Recent founders */}
        <motion.div {...fadeUp} style={cardStyle}>
          <div style={{
            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
            marginBottom: '1rem',
          }}>
            <h2 style={{
              fontFamily: 'var(--font-heading)', fontWeight: 600,
              fontSize: '0.9375rem', color: 'var(--color-text-primary)', margin: 0,
            }}>
              Últimos founders registrados
            </h2>
            <Link href="/superadmin/usuarios" style={{
              fontFamily: 'var(--font-body)', fontSize: '0.6875rem',
              color: 'var(--color-accent-primary)', textDecoration: 'none',
              display: 'flex', alignItems: 'center', gap: '0.25rem',
            }}>
              Ver todos <ChevronRight size={12} />
            </Link>
          </div>
          {metrics.recentFounders.length === 0 ? (
            <p style={{ fontFamily: 'var(--font-body)', fontSize: '0.8125rem', color: 'var(--color-text-muted)' }}>
              No hay founders registrados aún.
            </p>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.625rem' }}>
              {metrics.recentFounders.map((f) => (
                <div
                  key={f.id}
                  style={{
                    display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                    padding: '0.625rem 0.75rem', borderRadius: 8,
                    border: '1px solid var(--color-border)',
                  }}
                >
                  <div>
                    <div style={{
                      fontFamily: 'var(--font-body)', fontSize: '0.8125rem',
                      fontWeight: 600, color: 'var(--color-text-primary)',
                    }}>
                      {f.full_name || 'Sin nombre'}
                    </div>
                    <div style={{
                      fontFamily: 'var(--font-body)', fontSize: '0.6875rem',
                      color: 'var(--color-text-muted)', marginTop: '0.125rem',
                    }}>
                      {f.email} · {new Date(f.created_at).toLocaleDateString('es-PE', { day: 'numeric', month: 'short', year: 'numeric' })}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </motion.div>
      </div>
    </div>
  )
}
