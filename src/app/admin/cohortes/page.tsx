'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import Link from 'next/link'
import {
  Plus,
  Users,
  Calendar,
  ChevronRight,
} from 'lucide-react'

interface Cohort {
  id: string
  name: string
  startupsCount: number
  startDate: string
  endDate: string
  status: 'active' | 'planned' | 'completed'
}

const MOCK_COHORTS: Cohort[] = [
  {
    id: '1',
    name: 'Cohorte Climate 2026-I',
    startupsCount: 12,
    startDate: '2026-01-15',
    endDate: '2026-06-15',
    status: 'active',
  },
  {
    id: '2',
    name: 'Cohorte Impacto LATAM',
    startupsCount: 8,
    startDate: '2026-03-01',
    endDate: '2026-08-31',
    status: 'active',
  },
  {
    id: '3',
    name: 'Pre-incubación Q4 2025',
    startupsCount: 15,
    startDate: '2025-10-01',
    endDate: '2025-12-31',
    status: 'completed',
  },
]

const STATUS_CONFIG = {
  active: { label: 'Activa', color: '#059669', bg: 'rgba(5,150,105,0.08)' },
  planned: { label: 'Planificada', color: '#3B82F6', bg: 'rgba(59,130,246,0.08)' },
  completed: { label: 'Completada', color: '#6B7280', bg: 'rgba(107,114,128,0.08)' },
}

const cardStyle: React.CSSProperties = {
  background: 'var(--color-bg-card)',
  border: '1px solid var(--color-border)',
  borderRadius: 'var(--radius-md)',
  boxShadow: 'var(--shadow-card)',
}

export default function CohortesPage() {
  const [cohorts] = useState<Cohort[]>(MOCK_COHORTS)

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: 'easeOut' }}
      style={{ padding: '2rem 1.5rem', maxWidth: 1200, margin: '0 auto' }}
    >
      {/* Header */}
      <div style={{
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        flexWrap: 'wrap', gap: '1rem', marginBottom: '2rem',
      }}>
        <div>
          <h1 style={{
            fontFamily: 'var(--font-heading)', fontWeight: 700,
            fontSize: '1.5rem', color: 'var(--color-text-primary)',
            marginBottom: '0.25rem',
          }}>
            Cohortes
          </h1>
          <p style={{
            fontFamily: 'var(--font-body)', fontSize: '0.875rem',
            color: 'var(--color-text-secondary)',
          }}>
            Gestiona los grupos de startups de tu programa
          </p>
        </div>
        <Link
          href="/admin/cohortes/nueva"
          style={{
            display: 'inline-flex', alignItems: 'center', gap: '0.5rem',
            padding: '0.625rem 1.25rem', borderRadius: 'var(--radius-sm)',
            background: 'var(--color-accent-primary)', color: '#fff',
            fontFamily: 'var(--font-body)', fontSize: '0.875rem', fontWeight: 600,
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
            fontFamily: 'var(--font-body)', fontSize: '1rem',
            fontWeight: 600, color: 'var(--color-text-primary)',
            marginBottom: '0.5rem',
          }}>
            Aún no has creado ninguna cohorte
          </p>
          <p style={{
            fontFamily: 'var(--font-body)', fontSize: '0.875rem',
            color: 'var(--color-text-secondary)', marginBottom: '1.5rem',
            maxWidth: 400,
          }}>
            Crea tu primera cohorte para comenzar a agrupar y dar seguimiento a las startups de tu programa.
          </p>
          <Link
            href="/admin/cohortes/nueva"
            style={{
              display: 'inline-flex', alignItems: 'center', gap: '0.5rem',
              padding: '0.625rem 1.25rem', borderRadius: 'var(--radius-sm)',
              background: 'var(--color-accent-primary)', color: '#fff',
              fontFamily: 'var(--font-body)', fontSize: '0.875rem', fontWeight: 600,
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
            const status = STATUS_CONFIG[cohort.status]
            return (
              <motion.div
                key={cohort.id}
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
                      fontSize: '1rem', color: 'var(--color-text-primary)',
                    }}>
                      {cohort.name}
                    </h3>
                    <span style={{
                      padding: '0.125rem 0.625rem', borderRadius: 'var(--radius-xl)',
                      background: status.bg, color: status.color,
                      fontFamily: 'var(--font-body)', fontSize: '0.6875rem',
                      fontWeight: 600,
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
                        fontFamily: 'var(--font-body)', fontSize: '0.8125rem',
                        color: 'var(--color-text-secondary)',
                      }}>
                        {cohort.startupsCount} startups
                      </span>
                    </div>
                    <div style={{
                      display: 'flex', alignItems: 'center', gap: '0.375rem',
                    }}>
                      <Calendar size={14} color="var(--color-text-muted)" />
                      <span style={{
                        fontFamily: 'var(--font-body)', fontSize: '0.8125rem',
                        color: 'var(--color-text-secondary)',
                      }}>
                        {new Date(cohort.startDate).toLocaleDateString('es-CL', { month: 'short', year: 'numeric' })}
                        {' - '}
                        {new Date(cohort.endDate).toLocaleDateString('es-CL', { month: 'short', year: 'numeric' })}
                      </span>
                    </div>
                  </div>
                </div>
                <ChevronRight size={18} color="var(--color-text-muted)" />
              </motion.div>
            )
          })}
        </div>
      )}
    </motion.div>
  )
}
