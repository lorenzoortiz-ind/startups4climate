'use client'

import { useCallback, useEffect, useMemo, useState } from 'react'
import { usePathname } from 'next/navigation'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { Check, Inbox, Loader2, X } from 'lucide-react'

type RequestStatus = 'pending' | 'approved' | 'rejected'

interface CohortRequestRow {
  id: string
  cohort_id: string
  founder_id: string
  startup_id: string
  status: RequestStatus
  message: string | null
  review_note: string | null
  reviewed_by: string | null
  reviewed_at: string | null
  created_at: string
  cohorts: {
    id: string
    name: string
    start_date: string | null
    end_date: string | null
  } | null
  startups: { id: string; name: string } | null
  profiles: { id: string; full_name: string | null; email: string | null } | null
}

interface ApiResponse {
  requests?: CohortRequestRow[]
  error?: string
}

interface CountsMap {
  pending: number
  approved: number
  rejected: number
}

const TABS: { value: RequestStatus; label: string }[] = [
  { value: 'pending', label: 'Pendientes' },
  { value: 'approved', label: 'Aprobadas' },
  { value: 'rejected', label: 'Rechazadas' },
]

const cardStyle: React.CSSProperties = {
  background: 'var(--color-bg-card)',
  border: '1px solid var(--color-border)',
  borderRadius: 'var(--radius-md)',
  boxShadow: 'var(--shadow-card)',
}

function formatDateTime(value: string | null | undefined): string {
  if (!value) return '—'
  try {
    return new Date(value).toLocaleString('es-419', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    })
  } catch {
    return '—'
  }
}

export default function AdminCohortRequestsPage() {
  const pathname = usePathname()
  const adminBase = pathname.startsWith('/demo-admin') ? '/demo-admin' : '/admin'
  const [activeTab, setActiveTab] = useState<RequestStatus>('pending')
  const [rows, setRows] = useState<CohortRequestRow[]>([])
  const [counts, setCounts] = useState<CountsMap>({ pending: 0, approved: 0, rejected: 0 })
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [actingId, setActingId] = useState<string | null>(null)
  const [rejectOpenFor, setRejectOpenFor] = useState<string | null>(null)
  const [rejectNote, setRejectNote] = useState('')

  const fetchForStatus = useCallback(async (status: RequestStatus): Promise<CohortRequestRow[]> => {
    const res = await fetch(`/api/cohort-requests?status=${status}`, { cache: 'no-store' })
    const json = (await res.json()) as ApiResponse
    if (!res.ok) {
      throw new Error(json.error || 'Error al obtener solicitudes')
    }
    return json.requests || []
  }, [])

  const refreshCounts = useCallback(async () => {
    try {
      const [p, a, r] = await Promise.all([
        fetchForStatus('pending'),
        fetchForStatus('approved'),
        fetchForStatus('rejected'),
      ])
      setCounts({ pending: p.length, approved: a.length, rejected: r.length })
    } catch (err) {
      console.error('[S4C Admin] Error loading request counts:', err)
    }
  }, [fetchForStatus])

  const loadTab = useCallback(
    async (status: RequestStatus) => {
      setLoading(true)
      setError(null)
      try {
        const data = await fetchForStatus(status)
        setRows(data)
      } catch (err) {
        console.error('[S4C Admin] Error loading cohort requests:', err)
        setError('No se pudieron cargar las solicitudes. Intenta recargar la página.')
      } finally {
        setLoading(false)
      }
    },
    [fetchForStatus]
  )

  useEffect(() => {
    loadTab(activeTab)
  }, [activeTab, loadTab])

  useEffect(() => {
    refreshCounts()
  }, [refreshCounts])

  const handleAction = useCallback(
    async (id: string, status: 'approved' | 'rejected', reviewNote?: string) => {
      setActingId(id)
      try {
        const res = await fetch(`/api/cohort-requests/${id}`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ status, review_note: reviewNote || undefined }),
        })
        const json = (await res.json()) as { error?: string }
        if (!res.ok) {
          throw new Error(json.error || 'Error al actualizar la solicitud')
        }
        // Optimistically remove the row if we're on the "pending" tab
        setRows((prev) => prev.filter((r) => r.id !== id))
        setRejectOpenFor(null)
        setRejectNote('')
        refreshCounts()
      } catch (err) {
        console.error('[S4C Admin] Error on cohort request action:', err)
        alert(err instanceof Error ? err.message : 'Error al actualizar la solicitud')
      } finally {
        setActingId(null)
      }
    },
    [refreshCounts]
  )

  const emptyCopy = useMemo(() => {
    if (activeTab === 'pending') return 'No hay solicitudes pendientes.'
    if (activeTab === 'approved') return 'Aún no has aprobado solicitudes.'
    return 'Aún no has rechazado solicitudes.'
  }, [activeTab])

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: 'easeOut' }}
      style={{ padding: '2rem 1.5rem', maxWidth: 1200, margin: '0 auto' }}
    >
      {/* Header */}
      <div style={{ marginBottom: '2rem' }}>
        <h1
          style={{
            fontFamily: 'var(--font-heading)',
            fontWeight: 700,
            fontSize: 'var(--text-xl)',
            color: 'var(--color-text-primary)',
            marginBottom: '0.25rem',
          }}
        >
          Solicitudes
        </h1>
        <p
          style={{
            fontFamily: 'var(--font-body)',
            fontSize: 'var(--text-sm)',
            color: 'var(--color-text-secondary)',
          }}
        >
          Revisa y aprueba las solicitudes de founders para ingresar a tus cohortes abiertas.
        </p>
      </div>

      {/* Tabs */}
      <div
        style={{
          display: 'flex',
          gap: '0.5rem',
          marginBottom: '1.5rem',
          flexWrap: 'wrap',
        }}
      >
        {TABS.map((tab) => {
          const active = tab.value === activeTab
          const count = counts[tab.value]
          return (
            <button
              key={tab.value}
              onClick={() => setActiveTab(tab.value)}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.5rem',
                padding: '0.5rem 0.875rem',
                borderRadius: 'var(--radius-xl)',
                border: '1px solid',
                borderColor: active ? 'var(--color-accent-primary)' : 'var(--color-border)',
                background: active ? 'var(--color-accent-primary)' : 'var(--color-bg-card)',
                color: active ? '#fff' : 'var(--color-text-primary)',
                fontFamily: 'var(--font-body)',
                fontSize: 'var(--text-sm)',
                fontWeight: 600,
                cursor: 'pointer',
                transition: 'all 0.15s',
              }}
            >
              <span>{tab.label}</span>
              <span
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  minWidth: 22,
                  height: 22,
                  padding: '0 0.375rem',
                  borderRadius: 999,
                  background: active ? 'rgba(255,255,255,0.22)' : 'var(--color-bg-muted)',
                  color: active ? '#fff' : 'var(--color-text-secondary)',
                  fontSize: '0.6875rem',
                  fontWeight: 700,
                }}
              >
                {count}
              </span>
            </button>
          )
        })}
      </div>

      {/* Content */}
      {loading ? (
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            minHeight: '40vh',
          }}
        >
          <Loader2 size={28} color="var(--color-accent-primary)" style={{ animation: 'spin 1s linear infinite' }} />
        </div>
      ) : error ? (
        <div
          style={{
            ...cardStyle,
            padding: '2rem',
            textAlign: 'center',
          }}
        >
          <p
            style={{
              fontFamily: 'var(--font-body)',
              fontSize: 'var(--text-sm)',
              color: 'var(--color-text-secondary)',
              marginBottom: '1rem',
            }}
          >
            {error}
          </p>
          <button
            onClick={() => loadTab(activeTab)}
            style={{
              padding: '0.5rem 1.25rem',
              borderRadius: 'var(--radius-sm)',
              background: 'var(--color-accent-primary)',
              color: '#fff',
              border: 'none',
              fontFamily: 'var(--font-body)',
              fontSize: 'var(--text-sm)',
              fontWeight: 600,
              cursor: 'pointer',
            }}
          >
            Reintentar
          </button>
        </div>
      ) : rows.length === 0 ? (
        <div
          style={{
            ...cardStyle,
            padding: '4rem 2rem',
            textAlign: 'center',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
          }}
        >
          <div
            style={{
              width: 56,
              height: 56,
              borderRadius: '50%',
              background: 'var(--color-bg-muted)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              marginBottom: '1rem',
            }}
          >
            <Inbox size={24} color="var(--color-text-muted)" />
          </div>
          <p
            style={{
              fontFamily: 'var(--font-body)',
              fontSize: 'var(--text-base)',
              fontWeight: 600,
              color: 'var(--color-text-primary)',
              marginBottom: '0.5rem',
            }}
          >
            {emptyCopy}
          </p>
          {activeTab === 'pending' && (
            <>
              <p
                style={{
                  fontFamily: 'var(--font-body)',
                  fontSize: 'var(--text-sm)',
                  color: 'var(--color-text-secondary)',
                  marginBottom: '1.5rem',
                  maxWidth: 420,
                }}
              >
                Cuando un founder postule a una cohorte abierta, aparecerá aquí para que la revises.
              </p>
              <Link
                href={`${adminBase}/cohortes`}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  padding: '0.5rem 1rem',
                  borderRadius: 8,
                  background: 'var(--color-accent-primary)',
                  color: '#fff',
                  fontFamily: 'var(--font-body)',
                  fontSize: '0.8125rem',
                  fontWeight: 600,
                  textDecoration: 'none',
                }}
              >
                Ir a cohortes
              </Link>
            </>
          )}
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
          {rows.map((row, i) => {
            const founderName = row.profiles?.full_name || 'Founder sin nombre'
            const founderEmail = row.profiles?.email || '—'
            const startupName = row.startups?.name || '—'
            const cohortName = row.cohorts?.name || '—'
            const isActing = actingId === row.id
            const rejectOpen = rejectOpenFor === row.id
            return (
              <motion.div
                key={row.id}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: i * 0.04 }}
                style={{
                  ...cardStyle,
                  padding: '1.25rem 1.5rem',
                }}
              >
                <div
                  style={{
                    display: 'flex',
                    gap: '1rem',
                    flexWrap: 'wrap',
                    alignItems: 'flex-start',
                    justifyContent: 'space-between',
                  }}
                >
                  <div style={{ flex: 1, minWidth: 240 }}>
                    <div
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.5rem',
                        flexWrap: 'wrap',
                        marginBottom: '0.375rem',
                      }}
                    >
                      <h3
                        style={{
                          fontFamily: 'var(--font-heading)',
                          fontWeight: 600,
                          fontSize: 'var(--text-base)',
                          color: 'var(--color-text-primary)',
                        }}
                      >
                        {founderName}
                      </h3>
                      <span
                        style={{
                          fontFamily: 'var(--font-body)',
                          fontSize: 'var(--text-xs)',
                          color: 'var(--color-text-secondary)',
                        }}
                      >
                        {founderEmail}
                      </span>
                    </div>
                    <div
                      style={{
                        display: 'flex',
                        flexWrap: 'wrap',
                        gap: '0.5rem 1.25rem',
                        fontFamily: 'var(--font-body)',
                        fontSize: 'var(--text-sm)',
                        color: 'var(--color-text-secondary)',
                        marginBottom: row.message ? '0.75rem' : 0,
                      }}
                    >
                      <div>
                        <strong style={{ color: 'var(--color-text-primary)' }}>Startup:</strong> {startupName}
                      </div>
                      <div>
                        <strong style={{ color: 'var(--color-text-primary)' }}>Cohorte:</strong> {cohortName}
                      </div>
                      <div>
                        <strong style={{ color: 'var(--color-text-primary)' }}>Solicitada:</strong>{' '}
                        {formatDateTime(row.created_at)}
                      </div>
                    </div>
                    {row.message && (
                      <div
                        style={{
                          marginTop: '0.5rem',
                          padding: '0.75rem 0.875rem',
                          background: 'var(--color-bg-muted)',
                          borderRadius: 'var(--radius-sm)',
                          fontFamily: 'var(--font-body)',
                          fontSize: 'var(--text-sm)',
                          color: 'var(--color-text-primary)',
                          whiteSpace: 'pre-wrap',
                        }}
                      >
                        {row.message}
                      </div>
                    )}
                    {activeTab !== 'pending' && row.review_note && (
                      <div
                        style={{
                          marginTop: '0.5rem',
                          fontFamily: 'var(--font-body)',
                          fontSize: 'var(--text-xs)',
                          color: 'var(--color-text-secondary)',
                        }}
                      >
                        <strong>Nota de revisión:</strong> {row.review_note}
                      </div>
                    )}
                  </div>

                  {activeTab === 'pending' && (
                    <div
                      style={{
                        display: 'flex',
                        gap: '0.5rem',
                        alignItems: 'center',
                        flexWrap: 'wrap',
                      }}
                    >
                      <button
                        onClick={() => handleAction(row.id, 'approved')}
                        disabled={isActing}
                        style={{
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '0.375rem',
                          padding: '0.5rem 0.875rem',
                          borderRadius: 8,
                          background: '#16A34A',
                          color: '#fff',
                          border: 'none',
                          fontFamily: 'var(--font-body)',
                          fontSize: '0.8125rem',
                          fontWeight: 600,
                          cursor: isActing ? 'not-allowed' : 'pointer',
                          opacity: isActing ? 0.6 : 1,
                        }}
                      >
                        <Check size={14} />
                        Aprobar
                      </button>
                      <button
                        onClick={() => {
                          setRejectOpenFor(rejectOpen ? null : row.id)
                          setRejectNote('')
                        }}
                        disabled={isActing}
                        style={{
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '0.375rem',
                          padding: '0.5rem 0.875rem',
                          borderRadius: 8,
                          background: 'var(--color-bg-card)',
                          color: 'var(--color-text-secondary)',
                          border: '1px solid var(--color-border)',
                          fontFamily: 'var(--font-body)',
                          fontSize: '0.8125rem',
                          fontWeight: 500,
                          cursor: isActing ? 'not-allowed' : 'pointer',
                        }}
                      >
                        <X size={14} />
                        Rechazar
                      </button>
                    </div>
                  )}
                </div>

                {rejectOpen && (
                  <div
                    style={{
                      marginTop: '1rem',
                      padding: '0.875rem',
                      background: 'var(--color-bg-muted)',
                      borderRadius: 'var(--radius-sm)',
                    }}
                  >
                    <label
                      htmlFor={`reject-note-${row.id}`}
                      style={{
                        display: 'block',
                        fontFamily: 'var(--font-body)',
                        fontSize: 'var(--text-xs)',
                        fontWeight: 600,
                        color: 'var(--color-text-primary)',
                        marginBottom: '0.375rem',
                      }}
                    >
                      Motivo (opcional, se incluirá en el correo al founder)
                    </label>
                    <textarea
                      id={`reject-note-${row.id}`}
                      value={rejectNote}
                      onChange={(e) => setRejectNote(e.target.value)}
                      rows={3}
                      style={{
                        width: '100%',
                        padding: '0.5rem 0.625rem',
                        borderRadius: 'var(--radius-sm)',
                        border: '1px solid var(--color-border)',
                        fontFamily: 'var(--font-body)',
                        fontSize: 'var(--text-sm)',
                        color: 'var(--color-text-primary)',
                        background: 'var(--color-bg-card)',
                        resize: 'vertical',
                      }}
                      placeholder="Ej. Tu startup aún no encaja con el foco de esta cohorte."
                    />
                    <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'flex-end', marginTop: '0.625rem' }}>
                      <button
                        onClick={() => {
                          setRejectOpenFor(null)
                          setRejectNote('')
                        }}
                        disabled={isActing}
                        style={{
                          padding: '0.375rem 0.75rem',
                          borderRadius: 'var(--radius-sm)',
                          background: 'transparent',
                          border: 'none',
                          color: 'var(--color-text-secondary)',
                          fontFamily: 'var(--font-body)',
                          fontSize: '0.8125rem',
                          cursor: 'pointer',
                        }}
                      >
                        Cancelar
                      </button>
                      <button
                        onClick={() => handleAction(row.id, 'rejected', rejectNote.trim() || undefined)}
                        disabled={isActing}
                        style={{
                          padding: '0.375rem 0.875rem',
                          borderRadius: 'var(--radius-sm)',
                          background: '#DC2626',
                          color: '#fff',
                          border: 'none',
                          fontFamily: 'var(--font-body)',
                          fontSize: '0.8125rem',
                          fontWeight: 600,
                          cursor: isActing ? 'not-allowed' : 'pointer',
                          opacity: isActing ? 0.6 : 1,
                        }}
                      >
                        Confirmar rechazo
                      </button>
                    </div>
                  </div>
                )}
              </motion.div>
            )
          })}
        </div>
      )}
    </motion.div>
  )
}
