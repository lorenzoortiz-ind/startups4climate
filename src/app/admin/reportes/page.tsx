'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import {
  FileBarChart,
  Download,
  ChevronDown,
  Loader2,
  Sheet,
  CalendarClock,
} from 'lucide-react'
import { supabase } from '@/lib/supabase'
import { useAuth } from '@/context/AuthContext'
import { DEMO_COHORTS, DEMO_ADMIN_REPORTS } from '@/lib/demo/admin-fixtures'

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

const MOCK_DEMO_COHORTS: CohortOption[] = DEMO_COHORTS.map((c) => ({ id: c.id, name: c.name }))

export default function ReportesPage() {
  const { appUser, isDemo } = useAuth()
  const [cohorts, setCohorts] = useState<CohortOption[]>([])
  const [loadingCohorts, setLoadingCohorts] = useState(true)
  const [selectedCohort, setSelectedCohort] = useState('')
  const [selectedType, setSelectedType] = useState('cohort')
  const [generating, setGenerating] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (isDemo) {
      setCohorts(MOCK_DEMO_COHORTS)
      setLoadingCohorts(false)
      return
    }

    if (!appUser?.org_id) return

    async function loadCohorts() {
      try {
        const { data, error: err } = await supabase
          .from('cohorts')
          .select('id, name')
          .eq('org_id', appUser!.org_id!)
          .order('created_at', { ascending: false })

        if (err) throw err
        setCohorts(data || [])
      } catch (err) {
        console.error('[S4C Admin] Error loading cohorts for reports:', err)
        setError('No se pudieron cargar las cohortes.')
      } finally {
        setLoadingCohorts(false)
      }
    }

    loadCohorts()
  }, [appUser?.org_id, isDemo])

  const handleGenerate = async () => {
    if (!selectedCohort) return

    if (isDemo) {
      setError('La generación de reportes está deshabilitada en modo demo.')
      return
    }

    setGenerating(true)
    setError(null)

    try {
      const controller = new AbortController()
      const timeout = setTimeout(() => controller.abort(), 30000) // 30s timeout
      const res = await fetch('/api/reports/cohort', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ cohortId: selectedCohort }),
        signal: controller.signal,
      })
      clearTimeout(timeout)

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
                    ? 'rgba(31,119,246,0.04)' : 'var(--color-bg-card)',
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

      </div>

      {/* Info / Demo gallery */}
      {isDemo ? (
        <div>
          <div style={{
            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
            marginBottom: '0.75rem',
          }}>
            <h2 style={{
              fontFamily: 'var(--font-heading)', fontWeight: 600,
              fontSize: '1.0625rem', color: 'var(--color-text-primary)',
            }}>
              Reportes ya generados
            </h2>
            <span style={{
              fontFamily: 'var(--font-body)', fontSize: '0.75rem',
              color: 'var(--color-text-muted)',
            }}>
              {DEMO_ADMIN_REPORTS.length} reportes disponibles
            </span>
          </div>
          <div style={{
            display: 'grid', gap: '0.85rem',
            gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
          }}>
            {DEMO_ADMIN_REPORTS.map((r, i) => (
              <motion.div
                key={r.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.35, delay: i * 0.05 }}
                style={{ ...cardStyle, padding: '1.1rem 1.2rem' }}
              >
                <div style={{
                  display: 'flex', alignItems: 'flex-start',
                  justifyContent: 'space-between', gap: '0.5rem',
                  marginBottom: '0.5rem',
                }}>
                  <div style={{
                    width: 32, height: 32, borderRadius: 'var(--radius-sm)',
                    background: 'rgba(218,78,36,0.10)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    flexShrink: 0,
                  }}>
                    <FileBarChart size={16} color="#DA4E24" />
                  </div>
                  <div style={{
                    display: 'flex', gap: '0.4rem',
                    fontFamily: 'var(--font-body)', fontSize: '0.65rem',
                    color: 'var(--color-text-muted)',
                  }}>
                    <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.2rem' }}>
                      <Sheet size={12} /> {r.sheets} hojas
                    </span>
                    <span>·</span>
                    <span>{r.rows} filas</span>
                  </div>
                </div>
                <h3 style={{
                  fontFamily: 'var(--font-heading)', fontWeight: 600,
                  fontSize: '0.95rem', color: 'var(--color-text-primary)',
                  marginBottom: '0.2rem',
                }}>
                  {r.title}
                </h3>
                <p style={{
                  fontFamily: 'var(--font-body)', fontSize: '0.78rem',
                  color: 'var(--color-text-secondary)',
                  lineHeight: 1.45, marginBottom: '0.85rem',
                }}>
                  {r.subtitle}
                </p>
                <div style={{
                  display: 'grid', gap: '0.35rem',
                  gridTemplateColumns: '1fr 1fr',
                  marginBottom: '0.85rem',
                }}>
                  {r.metrics.map((m) => (
                    <div key={m.label} style={{
                      padding: '0.45rem 0.55rem',
                      borderRadius: 'var(--radius-sm)',
                      background: 'var(--color-bg-muted)',
                    }}>
                      <div style={{
                        fontFamily: 'var(--font-body)', fontSize: '0.6rem',
                        color: 'var(--color-text-muted)',
                        textTransform: 'uppercase', letterSpacing: '0.04em',
                        marginBottom: '0.15rem',
                      }}>
                        {m.label}
                      </div>
                      <div style={{
                        fontFamily: 'var(--font-body)', fontSize: '0.78rem',
                        fontWeight: 600, color: 'var(--color-text-primary)',
                        fontVariantNumeric: 'tabular-nums',
                      }}>
                        {m.value}
                      </div>
                    </div>
                  ))}
                </div>
                <div style={{
                  display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                  paddingTop: '0.7rem',
                  borderTop: '1px solid var(--color-border)',
                }}>
                  <div style={{
                    display: 'inline-flex', alignItems: 'center', gap: '0.3rem',
                    fontFamily: 'var(--font-body)', fontSize: '0.7rem',
                    color: 'var(--color-text-muted)',
                  }}>
                    <CalendarClock size={12} />
                    {new Date(r.lastGenerated).toLocaleDateString('es-PE', { day: '2-digit', month: 'short', year: 'numeric' })}
                  </div>
                  <button
                    onClick={() => setError('La descarga de reportes está deshabilitada en modo demo.')}
                    style={{
                      display: 'inline-flex', alignItems: 'center', gap: '0.3rem',
                      padding: '0.35rem 0.65rem', borderRadius: 'var(--radius-sm)',
                      background: 'var(--color-accent-primary)', color: '#fff',
                      fontFamily: 'var(--font-body)', fontSize: '0.7rem',
                      fontWeight: 600, border: 'none', cursor: 'pointer',
                    }}
                  >
                    <Download size={12} />
                    Excel
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      ) : (
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
      )}
    </motion.div>
  )
}
