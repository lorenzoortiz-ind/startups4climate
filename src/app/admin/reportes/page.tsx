'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import {
  FileBarChart,
  Download,
  ChevronDown,
  Loader2,
} from 'lucide-react'
import { supabase } from '@/lib/supabase'
import { useAuth } from '@/context/AuthContext'

interface CohortOption {
  id: string
  name: string
}

const REPORT_TYPES = [
  {
    value: 'cohort',
    label: 'Reporte de cohorte',
    description: 'Resumen general del avance de todas las startups en la cohorte seleccionada, incluyendo métricas de progreso, herramientas completadas y distribución por etapa.',
  },
  {
    value: 'individual',
    label: 'Reporte individual',
    description: 'Reporte detallado por startup con scores diagnósticos, herramientas completadas, hitos alcanzados y recomendaciones personalizadas.',
  },
]

const cardStyle: React.CSSProperties = {
  background: 'var(--color-bg-card)',
  border: '1px solid var(--color-border)',
  borderRadius: 'var(--radius-md)',
  padding: '1.5rem',
  boxShadow: 'var(--shadow-card)',
}

const selectStyle: React.CSSProperties = {
  width: '100%',
  padding: '0.625rem 0.875rem',
  borderRadius: 'var(--radius-sm)',
  border: '1px solid var(--color-border)',
  background: 'var(--color-bg-card)',
  fontFamily: 'var(--font-body)',
  fontSize: '0.875rem',
  color: 'var(--color-text-primary)',
  outline: 'none',
  appearance: 'none',
  cursor: 'pointer',
}

const labelStyle: React.CSSProperties = {
  fontFamily: 'var(--font-body)',
  fontSize: '0.8125rem',
  fontWeight: 600,
  color: 'var(--color-text-primary)',
  marginBottom: '0.375rem',
  display: 'block',
}

export default function ReportesPage() {
  const { appUser } = useAuth()
  const [cohorts, setCohorts] = useState<CohortOption[]>([])
  const [loadingCohorts, setLoadingCohorts] = useState(true)
  const [selectedCohort, setSelectedCohort] = useState('')
  const [selectedType, setSelectedType] = useState('cohort')
  const [generating, setGenerating] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!appUser?.org_id) return

    async function loadCohorts() {
      const { data } = await supabase
        .from('cohorts')
        .select('id, name')
        .eq('org_id', appUser!.org_id!)
        .order('created_at', { ascending: false })

      setCohorts(data || [])
      setLoadingCohorts(false)
    }

    loadCohorts()
  }, [appUser?.org_id])

  const handleGenerate = async () => {
    if (!selectedCohort) return
    setGenerating(true)
    setError(null)

    try {
      const res = await fetch('/api/reports/cohort', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ cohortId: selectedCohort }),
      })

      if (!res.ok) {
        const data = await res.json()
        setError(data.error || 'Error al generar el reporte')
        setGenerating(false)
        return
      }

      // Download the file
      const blob = await res.blob()
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      const cohortName = cohorts.find((c) => c.id === selectedCohort)?.name || 'cohorte'
      a.download = `reporte-${cohortName.replace(/\s+/g, '-').toLowerCase()}.xlsx`
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      URL.revokeObjectURL(url)
    } catch {
      setError('Error al generar el reporte. Intenta de nuevo.')
    }

    setGenerating(false)
  }

  const activeType = REPORT_TYPES.find((t) => t.value === selectedType)

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: 'easeOut' }}
      style={{ padding: '2rem 1.5rem', maxWidth: 800, margin: '0 auto' }}
    >
      <div style={{ marginBottom: '2rem' }}>
        <h1 style={{
          fontFamily: 'var(--font-heading)', fontWeight: 700,
          fontSize: '1.5rem', color: 'var(--color-text-primary)',
          marginBottom: '0.25rem',
        }}>
          Reportes
        </h1>
        <p style={{
          fontFamily: 'var(--font-body)', fontSize: '0.875rem',
          color: 'var(--color-text-secondary)',
        }}>
          Genera reportes detallados del avance de tus cohortes
        </p>
      </div>

      {error && (
        <div style={{
          padding: '0.75rem 1rem', borderRadius: 'var(--radius-sm)',
          background: '#FEF2F2', border: '1px solid #FECACA',
          color: '#DC2626', fontFamily: 'var(--font-body)', fontSize: '0.875rem',
          marginBottom: '1rem',
        }}>
          {error}
        </div>
      )}

      {/* Configuration card */}
      <div style={{ ...cardStyle, marginBottom: '1.5rem' }}>
        <h2 style={{
          fontFamily: 'var(--font-heading)', fontWeight: 600,
          fontSize: '1.0625rem', color: 'var(--color-text-primary)',
          marginBottom: '1.25rem',
        }}>
          Configurar reporte
        </h2>

        {/* Cohort selector */}
        <div style={{ marginBottom: '1.25rem' }}>
          <label style={labelStyle}>Seleccionar cohorte</label>
          <div style={{ position: 'relative' }}>
            {loadingCohorts ? (
              <div style={{ padding: '0.625rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <Loader2 size={16} color="var(--color-text-muted)" style={{ animation: 'spin 1s linear infinite' }} />
                <span style={{ fontFamily: 'var(--font-body)', fontSize: '0.875rem', color: 'var(--color-text-muted)' }}>
                  Cargando cohortes...
                </span>
              </div>
            ) : (
              <>
                <select
                  value={selectedCohort}
                  onChange={(e) => setSelectedCohort(e.target.value)}
                  style={selectStyle}
                >
                  <option value="">Selecciona una cohorte...</option>
                  {cohorts.map((c) => (
                    <option key={c.id} value={c.id}>{c.name}</option>
                  ))}
                </select>
                <ChevronDown
                  size={16}
                  color="var(--color-text-muted)"
                  style={{
                    position: 'absolute', right: 12, top: '50%',
                    transform: 'translateY(-50%)', pointerEvents: 'none',
                  }}
                />
              </>
            )}
          </div>
        </div>

        {/* Report type */}
        <div style={{ marginBottom: '1.25rem' }}>
          <label style={labelStyle}>Tipo de reporte</label>
          <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
            {REPORT_TYPES.map((type) => (
              <button
                key={type.value}
                type="button"
                onClick={() => setSelectedType(type.value)}
                style={{
                  flex: '1 1 200px',
                  padding: '0.75rem 1rem',
                  borderRadius: 'var(--radius-sm)',
                  border: `1.5px solid ${selectedType === type.value
                    ? 'var(--color-accent-primary)'
                    : 'var(--color-border)'}`,
                  background: selectedType === type.value
                    ? 'rgba(13,148,136,0.04)' : 'var(--color-bg-card)',
                  cursor: 'pointer',
                  textAlign: 'left',
                  transition: 'all 0.15s',
                }}
              >
                <div style={{
                  fontFamily: 'var(--font-body)', fontSize: '0.875rem',
                  fontWeight: 600,
                  color: selectedType === type.value
                    ? 'var(--color-accent-primary)'
                    : 'var(--color-text-primary)',
                }}>
                  {type.label}
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Description of selected type */}
        {activeType && (
          <div style={{
            padding: '1rem',
            borderRadius: 'var(--radius-sm)',
            background: 'var(--color-bg-primary)',
            border: '1px solid var(--color-border)',
            marginBottom: '1.25rem',
          }}>
            <p style={{
              fontFamily: 'var(--font-body)', fontSize: '0.8125rem',
              color: 'var(--color-text-secondary)', lineHeight: 1.6,
            }}>
              {activeType.description}
            </p>
          </div>
        )}

        {/* Generate button */}
        <button
          onClick={handleGenerate}
          disabled={!selectedCohort || generating}
          style={{
            display: 'inline-flex', alignItems: 'center', gap: '0.5rem',
            padding: '0.625rem 1.5rem', borderRadius: 'var(--radius-sm)',
            background: !selectedCohort
              ? 'var(--color-text-muted)'
              : 'var(--color-accent-primary)',
            color: '#fff', border: 'none', cursor: 'pointer',
            fontFamily: 'var(--font-body)', fontSize: '0.875rem', fontWeight: 600,
            transition: 'background 0.15s',
            opacity: generating ? 0.7 : 1,
          }}
        >
          {generating ? (
            <Loader2 size={16} style={{ animation: 'spin 1s linear infinite' }} />
          ) : (
            <Download size={16} />
          )}
          {generating ? 'Generando...' : 'Descargar reporte Excel'}
        </button>
        <style>{`@keyframes spin{from{transform:rotate(0)}to{transform:rotate(360deg)}}`}</style>
      </div>

      {/* Info */}
      <div style={{
        ...cardStyle,
        textAlign: 'center',
        padding: '3rem 2rem',
      }}>
        <div style={{
          width: 56, height: 56, borderRadius: '50%',
          background: 'var(--color-bg-muted)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          margin: '0 auto 1rem',
        }}>
          <FileBarChart size={24} color="var(--color-text-muted)" />
        </div>
        <h3 style={{
          fontFamily: 'var(--font-heading)', fontWeight: 600,
          fontSize: '1rem', color: 'var(--color-text-primary)',
          marginBottom: '0.5rem',
        }}>
          Reportes en formato Excel
        </h3>
        <p style={{
          fontFamily: 'var(--font-body)', fontSize: '0.875rem',
          color: 'var(--color-text-secondary)', maxWidth: 420,
          margin: '0 auto', lineHeight: 1.6,
        }}>
          Los reportes incluyen métricas de avance, distribución por etapa, herramientas completadas,
          scores diagnósticos y datos de cada startup del programa.
        </p>
      </div>
    </motion.div>
  )
}
