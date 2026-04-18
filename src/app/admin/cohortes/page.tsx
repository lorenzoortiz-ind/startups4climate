'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import Link from 'next/link'
import {
  Plus,
  Users,
  Calendar,
  ChevronRight,
  Loader2,
} from 'lucide-react'
import { supabase } from '@/lib/supabase'
import { useAuth } from '@/context/AuthContext'
import { DEMO_COHORTS } from '@/lib/demo/admin-fixtures'

interface CohortRow {
  id: string
  name: string
  description: string | null
  start_date: string | null
  end_date: string | null
  status: string
  created_at: string
}

const STATUS_CONFIG: Record<string, { label: string; color: string; bg: string }> = {
  active: { label: 'Activa', color: '#1F77F6', bg: 'rgba(31,119,246,0.08)' },
  planned: { label: 'Planificada', color: '#1F77F6', bg: 'rgba(59,130,246,0.08)' },
  completed: { label: 'Completada', color: '#6B7280', bg: 'rgba(107,114,128,0.08)' },
  archived: { label: 'Archivada', color: '#9CA3AF', bg: 'rgba(156,163,175,0.08)' },
}

const cardStyle: React.CSSProperties = {
  background: 'var(--color-bg-card)',
  border: '1px solid var(--color-border)',
  borderRadius: 'var(--radius-md)',
  boxShadow: 'var(--shadow-card)',
}

const MOCK_DEMO_COHORTS: (CohortRow & { startupsCount: number })[] = DEMO_COHORTS.map((c) => ({
  id: c.id,
  name: c.name,
  description: c.description,
  start_date: c.startDate,
  end_date: c.endDate,
  status: c.status,
  created_at: c.startDate,
  startupsCount: c.startupIds.length,
}))

export default function CohortesPage() {
  const { appUser, isDemo } = useAuth()
  const [cohorts, setCohorts] = useState<(CohortRow & { startupsCount: number })[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (isDemo) {
      setCohorts(MOCK_DEMO_COHORTS)
      setLoading(false)
      setError(null)
      return
    }

    if (!appUser?.org_id) return

    async function loadCohorts() {
      setLoading(true)
      setError(null)

      try {
        // Fetch cohorts for this org
        const { data: cohortsData, error: cohortErr } = await supabase
          .from('cohorts')
          .select('*')
          .eq('org_id', appUser!.org_id!)
          .order('created_at', { ascending: false })

        if (cohortErr) throw cohortErr

        if (!cohortsData || cohortsData.length === 0) {
          setCohorts([])
          setLoading(false)
          return
        }

        // Get startup counts per cohort
        const cohortIds = cohortsData.map((c) => c.id)
        const { data: assignments } = await supabase
          .from('cohort_startups')
          .select('cohort_id')
          .in('cohort_id', cohortIds)

        const countMap: Record<string, number> = {}
        assignments?.forEach((a) => {
          countMap[a.cohort_id] = (countMap[a.cohort_id] || 0) + 1
        })

        setCohorts(
          cohortsData.map((c) => ({
            ...c,
            startupsCount: countMap[c.id] || 0,
          }))
        )
      } catch (err) {
        console.error('[S4C Admin] Error loading cohorts:', err)
        setError('No se pudieron cargar las cohortes. Intenta recargar la página.')
      } finally {
        setLoading(false)
      }
    }

    loadCohorts()
  }, [appUser?.org_id, isDemo])

  if (loading) {
    return (
      <div style={{
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        minHeight: '60vh',
      }}>
        <Loader2 size={28} color="var(--color-accent-primary)" style={{ animation: 'spin 1s linear infinite' }} />
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
          Error al cargar cohortes
        </p>
        <p style={{
          fontFamily: 'var(--font-body)', fontSize: 'var(--text-sm)',
          color: 'var(--color-text-secondary)', marginBottom: '1.5rem', maxWidth: 400,
        }}>
          {error}
        </p>
        <button
          onClick={() => window.location.reload()}
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

      {/* Header */}
      <div style={{
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        flexWrap: 'wrap', gap: '1rem', marginBottom: '2rem',
      }}>
        <div>
          <h1 style={{
            fontFamily: 'var(--font-heading)', fontWeight: 700,
            fontSize: 'var(--text-xl)', color: 'var(--color-text-primary)',
            marginBottom: '0.25rem',
          }}>
            Cohortes
          </h1>
          <p style={{
            fontFamily: 'var(--font-body)', fontSize: 'var(--text-sm)',
            color: 'var(--color-text-secondary)',
          }}>
            Gestiona los grupos de startups de tu programa
          </p>
        </div>
        <Link
          href="/admin/cohortes/nueva"
          style={{
            display: 'inline-flex', alignItems: 'center', gap: '0.5rem',
            padding: '0.5rem 1rem', borderRadius: 8,
            background: 'var(--color-accent-primary)', color: '#fff',
            fontFamily: 'var(--font-body)', fontSize: '0.8125rem', fontWeight: 600,
            textDecoration: 'none', transition: 'background 0.15s',
          }}
          onMouseEnter={(e) => (e.currentTarget.style.background = 'var(--color-accent-hover)')}
          onMouseLeave={(e) => (e.currentTarget.style.background = 'var(--color-accent-primary)')}
        >
          <Plus size={16} />
          Crear nueva cohorte
        </Link>
      </div>

      {/* Cohorts list */}
      {cohorts.length === 0 ? (
        <div style={{
          ...cardStyle,
          padding: '4rem 2rem',
          textAlign: 'center',
          display: 'flex', flexDirection: 'column', alignItems: 'center',
        }}>
          <div style={{
            width: 56, height: 56, borderRadius: '50%',
            background: 'var(--color-bg-muted)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            marginBottom: '1rem',
          }}>
            <Users size={24} color="var(--color-text-muted)" />
          </div>
          <p style={{
            fontFamily: 'var(--font-body)', fontSize: 'var(--text-base)',
            fontWeight: 600, color: 'var(--color-text-primary)',
            marginBottom: '0.5rem',
          }}>
            Aún no has creado ninguna cohorte
          </p>
          <p style={{
            fontFamily: 'var(--font-body)', fontSize: 'var(--text-sm)',
            color: 'var(--color-text-secondary)', marginBottom: '1.5rem',
            maxWidth: 400,
          }}>
            Crea tu primera cohorte para comenzar a agrupar y dar seguimiento a las startups de tu programa.
          </p>
          <Link
            href="/admin/cohortes/nueva"
            style={{
              display: 'inline-flex', alignItems: 'center', gap: '0.5rem',
              padding: '0.5rem 1rem', borderRadius: 8,
              background: 'var(--color-accent-primary)', color: '#fff',
              fontFamily: 'var(--font-body)', fontSize: '0.8125rem', fontWeight: 600,
              textDecoration: 'none',
            }}
          >
            <Plus size={16} />
            Crear primera cohorte
          </Link>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
          {cohorts.map((cohort, i) => {
            const status = STATUS_CONFIG[cohort.status] || STATUS_CONFIG.planned
            return (
              <Link
                key={cohort.id}
                href={`/admin/cohortes/${cohort.id}`}
                style={{ textDecoration: 'none' }}
              >
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.35, delay: i * 0.06 }}
                  style={{
                    ...cardStyle,
                    padding: '1.25rem 1.5rem',
                    display: 'flex', alignItems: 'center',
                    justifyContent: 'space-between',
                    gap: '1rem', cursor: 'pointer',
                    transition: 'border-color 0.15s, box-shadow 0.15s',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.borderColor = 'var(--color-border-strong)'
                    e.currentTarget.style.boxShadow = 'var(--shadow-elevated)'
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.borderColor = 'var(--color-border)'
                    e.currentTarget.style.boxShadow = 'var(--shadow-card)'
                  }}
                >
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{
                      display: 'flex', alignItems: 'center', gap: '0.75rem',
                      marginBottom: '0.5rem', flexWrap: 'wrap',
                    }}>
                      <h3 style={{
                        fontFamily: 'var(--font-heading)', fontWeight: 600,
                        fontSize: 'var(--text-base)', color: 'var(--color-text-primary)',
                      }}>
                        {cohort.name}
                      </h3>
                      <span style={{
                        padding: '0.125rem 0.625rem', borderRadius: 'var(--radius-xl)',
                        background: status.bg, color: status.color,
                        fontFamily: 'var(--font-body)', fontSize: '0.6875rem',
                        fontWeight: 500,
                      }}>
                        {status.label}
                      </span>
                    </div>
                    <div style={{
                      display: 'flex', alignItems: 'center', gap: '1.25rem',
                      flexWrap: 'wrap',
                    }}>
                      <div style={{
                        display: 'flex', alignItems: 'center', gap: '0.375rem',
                      }}>
                        <Users size={14} color="var(--color-text-muted)" />
                        <span style={{
                          fontFamily: 'var(--font-body)', fontSize: 'var(--text-sm)',
                          color: 'var(--color-text-secondary)',
                        }}>
                          {cohort.startupsCount} startups
                        </span>
                      </div>
                      {cohort.start_date && cohort.end_date && (
                        <div style={{
                          display: 'flex', alignItems: 'center', gap: '0.375rem',
                        }}>
                          <Calendar size={14} color="var(--color-text-muted)" />
                          <span style={{
                            fontFamily: 'var(--font-body)', fontSize: 'var(--text-sm)',
                            color: 'var(--color-text-secondary)',
                          }}>
                            {new Date(cohort.start_date).toLocaleDateString('es-CL', { month: 'short', year: 'numeric' })}
                            {' - '}
                            {new Date(cohort.end_date).toLocaleDateString('es-CL', { month: 'short', year: 'numeric' })}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                  <ChevronRight size={18} color="var(--color-text-muted)" />
                </motion.div>
              </Link>
            )
          })}
        </div>
      )}
    </motion.div>
  )
}
