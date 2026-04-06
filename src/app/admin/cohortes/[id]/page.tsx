'use client'

import { useState, useEffect, useCallback } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import Link from 'next/link'
import {
  ChevronLeft,
  Users,
  Calendar,
  Edit3,
  Trash2,
  Save,
  X,
  UserPlus,
  UserMinus,
  Loader2,
  AlertTriangle,
  Target,
  Mail,
} from 'lucide-react'
import { supabase } from '@/lib/supabase'
import { useAuth } from '@/context/AuthContext'

interface CohortData {
  id: string
  name: string
  description: string | null
  start_date: string | null
  end_date: string | null
  status: string
  milestones: { name: string; stage: string; deadline: string }[]
  org_id: string
}

interface StartupInCohort {
  assignment_id: string
  startup_id: string
  name: string
  founder_name: string
  vertical: string
  stage: string | null
  diagnostic_score: number | null
  tools_completed: number | null
  assignment_status: string
}

interface AvailableStartup {
  id: string
  name: string
  founder_name: string
  vertical: string
}

const STATUS_OPTIONS = [
  { value: 'planned', label: 'Planificada', color: '#3B82F6' },
  { value: 'active', label: 'Activa', color: '#0D9488' },
  { value: 'completed', label: 'Completada', color: '#6B7280' },
  { value: 'archived', label: 'Archivada', color: '#9CA3AF' },
]

const STAGE_LABELS: Record<string, string> = {
  pre_incubation: 'Pre-incubación',
  incubation: 'Incubación',
  acceleration: 'Aceleración',
  scaling: 'Escalamiento',
}

const VERTICAL_LABELS: Record<string, string> = {
  fintech: 'Fintech',
  healthtech: 'Healthtech',
  edtech: 'Edtech',
  agritech_foodtech: 'Agritech/Foodtech',
  cleantech_climatech: 'Cleantech/Climatech',
  biotech_deeptech: 'Biotech/Deeptech',
  logistics_mobility: 'Logística/Movilidad',
  saas_enterprise: 'SaaS/Enterprise',
  social_impact: 'Impacto social',
  other: 'Otro',
}

const cardStyle: React.CSSProperties = {
  background: 'var(--color-bg-card)',
  border: '1px solid var(--color-border)',
  borderRadius: 'var(--radius-md)',
  boxShadow: 'var(--shadow-card)',
}

const inputStyle: React.CSSProperties = {
  width: '100%',
  padding: '0.625rem 0.875rem',
  borderRadius: 'var(--radius-sm)',
  border: '1px solid var(--color-border)',
  background: 'var(--color-bg-card)',
  fontFamily: 'var(--font-body)',
  fontSize: '0.875rem',
  color: 'var(--color-text-primary)',
  outline: 'none',
}

const labelStyle: React.CSSProperties = {
  fontFamily: 'var(--font-body)',
  fontSize: '0.8125rem',
  fontWeight: 600,
  color: 'var(--color-text-primary)',
  marginBottom: '0.375rem',
  display: 'block',
}

export default function CohortDetailPage() {
  const params = useParams()
  const router = useRouter()
  const { appUser } = useAuth()
  const cohortId = params.id as string

  const [cohort, setCohort] = useState<CohortData | null>(null)
  const [startups, setStartups] = useState<StartupInCohort[]>([])
  const [loading, setLoading] = useState(true)
  const [editing, setEditing] = useState(false)
  const [editForm, setEditForm] = useState({ name: '', description: '', start_date: '', end_date: '' })
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)
  const [deleting, setDeleting] = useState(false)
  const [showAddStartup, setShowAddStartup] = useState(false)
  const [availableStartups, setAvailableStartups] = useState<AvailableStartup[]>([])
  const [loadingStartups, setLoadingStartups] = useState(false)
  const [inviteEmail, setInviteEmail] = useState('')
  const [inviting, setInviting] = useState(false)
  const [inviteSuccess, setInviteSuccess] = useState<string | null>(null)

  const loadCohort = useCallback(async () => {
    setLoading(true)
    setError(null)

    const { data: cohortData, error: cohortError } = await supabase
      .from('cohorts')
      .select('*')
      .eq('id', cohortId)
      .single()

    if (cohortError || !cohortData) {
      setError('No se encontró la cohorte.')
      setLoading(false)
      return
    }

    setCohort({
      ...cohortData,
      milestones: (cohortData.milestones as CohortData['milestones']) || [],
    })
    setEditForm({
      name: cohortData.name,
      description: cohortData.description || '',
      start_date: cohortData.start_date || '',
      end_date: cohortData.end_date || '',
    })

    // Load startups in this cohort
    const { data: assignments } = await supabase
      .from('cohort_startups')
      .select('id, startup_id, status')
      .eq('cohort_id', cohortId)

    if (assignments && assignments.length > 0) {
      const startupIds = assignments.map((a) => a.startup_id)
      const { data: startupsData } = await supabase
        .from('startups')
        .select('id, name, vertical, stage, diagnostic_score, tools_completed, founder_id')
        .in('id', startupIds)

      if (startupsData) {
        const founderIds = startupsData.map((s) => s.founder_id).filter(Boolean)
        const { data: profiles } = await supabase
          .from('profiles')
          .select('id, full_name')
          .in('id', founderIds)

        const profileMap: Record<string, string> = {}
        profiles?.forEach((p) => { profileMap[p.id] = p.full_name })

        const merged: StartupInCohort[] = startupsData.map((s) => {
          const assignment = assignments.find((a) => a.startup_id === s.id)
          return {
            assignment_id: assignment?.id || '',
            startup_id: s.id,
            name: s.name,
            founder_name: profileMap[s.founder_id] || 'Sin founder',
            vertical: s.vertical,
            stage: s.stage,
            diagnostic_score: s.diagnostic_score,
            tools_completed: s.tools_completed,
            assignment_status: assignment?.status || 'active',
          }
        })
        setStartups(merged)
      }
    } else {
      setStartups([])
    }

    setLoading(false)
  }, [cohortId])

  useEffect(() => {
    loadCohort()
  }, [loadCohort])

  const handleSaveEdit = async () => {
    if (!editForm.name.trim()) return
    setSaving(true)
    const { error: updateError } = await supabase
      .from('cohorts')
      .update({
        name: editForm.name.trim(),
        description: editForm.description.trim() || null,
        start_date: editForm.start_date || null,
        end_date: editForm.end_date || null,
      })
      .eq('id', cohortId)

    if (updateError) {
      setError('Error al guardar los cambios.')
    } else {
      setEditing(false)
      loadCohort()
    }
    setSaving(false)
  }

  const handleStatusChange = async (newStatus: string) => {
    const { error: updateError } = await supabase
      .from('cohorts')
      .update({ status: newStatus })
      .eq('id', cohortId)

    if (!updateError && cohort) {
      setCohort({ ...cohort, status: newStatus })
    }
  }

  const handleDelete = async () => {
    setDeleting(true)
    // Remove startup assignments first
    await supabase.from('cohort_startups').delete().eq('cohort_id', cohortId)
    const { error: deleteError } = await supabase.from('cohorts').delete().eq('id', cohortId)

    if (deleteError) {
      setError('Error al eliminar la cohorte.')
      setDeleting(false)
    } else {
      router.push('/admin/cohortes')
    }
  }

  const handleRemoveStartup = async (assignmentId: string) => {
    const { error: removeError } = await supabase
      .from('cohort_startups')
      .delete()
      .eq('id', assignmentId)

    if (!removeError) {
      setStartups((prev) => prev.filter((s) => s.assignment_id !== assignmentId))
    }
  }

  const loadAvailableStartups = async () => {
    setLoadingStartups(true)
    const currentIds = startups.map((s) => s.startup_id)

    // Get startups from the org's founders only
    const { data: orgProfiles } = await supabase
      .from('profiles')
      .select('id, full_name')
      .eq('org_id', appUser?.org_id)
      .eq('role', 'founder')

    const orgFounderIds = (orgProfiles || []).map((p) => p.id)
    const { data: allStartups } = orgFounderIds.length > 0
      ? await supabase.from('startups').select('id, name, vertical, founder_id').in('founder_id', orgFounderIds)
      : { data: [] }

    if (allStartups) {
      const profileMap: Record<string, string> = {}
      orgProfiles?.forEach((p) => { profileMap[p.id] = p.full_name })

      setAvailableStartups(
        allStartups
          .filter((s) => !currentIds.includes(s.id))
          .map((s) => ({
            id: s.id,
            name: s.name,
            founder_name: profileMap[s.founder_id] || 'Sin founder',
            vertical: s.vertical,
          }))
      )
    }
    setLoadingStartups(false)
  }

  const handleAddStartup = async (startupId: string) => {
    const { error: addError } = await supabase
      .from('cohort_startups')
      .insert({ cohort_id: cohortId, startup_id: startupId })

    if (!addError) {
      setShowAddStartup(false)
      loadCohort()
    }
  }

  if (loading) {
    return (
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '60vh' }}>
        <Loader2 size={28} color="var(--color-accent-primary)" style={{ animation: 'spin 1s linear infinite' }} />
        <style>{`@keyframes spin{from{transform:rotate(0)}to{transform:rotate(360deg)}}`}</style>
      </div>
    )
  }

  if (!cohort) {
    return (
      <div style={{ padding: '2rem 1.5rem', textAlign: 'center' }}>
        <p style={{ fontFamily: 'var(--font-body)', color: 'var(--color-text-secondary)' }}>
          {error || 'Cohorte no encontrada.'}
        </p>
        <Link href="/admin/cohortes" style={{
          color: 'var(--color-accent-primary)', fontFamily: 'var(--font-body)',
          fontSize: '0.875rem', marginTop: '1rem', display: 'inline-block',
        }}>
          Volver a cohortes
        </Link>
      </div>
    )
  }

  const statusConfig = STATUS_OPTIONS.find((s) => s.value === cohort.status) || STATUS_OPTIONS[0]

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: 'easeOut' }}
      style={{ padding: '2rem 1.5rem', maxWidth: 1200, margin: '0 auto' }}
    >
      {/* Back link */}
      <Link
        href="/admin/cohortes"
        style={{
          display: 'inline-flex', alignItems: 'center', gap: '0.375rem',
          fontFamily: 'var(--font-body)', fontSize: '0.8125rem',
          color: 'var(--color-text-secondary)', textDecoration: 'none',
          marginBottom: '1.5rem',
        }}
      >
        <ChevronLeft size={16} />
        Volver a cohortes
      </Link>

      {/* Error */}
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

      {/* Cohort Header */}
      <div style={{ ...cardStyle, padding: '1.5rem', marginBottom: '1.5rem' }}>
        {editing ? (
          /* Edit Mode */
          <div>
            <div style={{ marginBottom: '1rem' }}>
              <label style={labelStyle}>Nombre</label>
              <input
                type="text"
                value={editForm.name}
                onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                style={inputStyle}
              />
            </div>
            <div style={{ marginBottom: '1rem' }}>
              <label style={labelStyle}>Descripción</label>
              <textarea
                value={editForm.description}
                onChange={(e) => setEditForm({ ...editForm, description: e.target.value })}
                rows={2}
                style={{ ...inputStyle, resize: 'vertical' }}
              />
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1rem' }}>
              <div>
                <label style={labelStyle}>Fecha inicio</label>
                <input
                  type="date"
                  value={editForm.start_date}
                  onChange={(e) => setEditForm({ ...editForm, start_date: e.target.value })}
                  style={inputStyle}
                />
              </div>
              <div>
                <label style={labelStyle}>Fecha fin</label>
                <input
                  type="date"
                  value={editForm.end_date}
                  onChange={(e) => setEditForm({ ...editForm, end_date: e.target.value })}
                  style={inputStyle}
                />
              </div>
            </div>
            <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'flex-end' }}>
              <button
                onClick={() => setEditing(false)}
                style={{
                  padding: '0.5rem 1rem', borderRadius: 'var(--radius-sm)',
                  border: '1px solid var(--color-border)', background: 'var(--color-bg-card)',
                  fontFamily: 'var(--font-body)', fontSize: '0.8125rem',
                  color: 'var(--color-text-secondary)', cursor: 'pointer',
                }}
              >
                <X size={14} style={{ marginRight: 4, verticalAlign: 'middle' }} />
                Cancelar
              </button>
              <button
                onClick={handleSaveEdit}
                disabled={saving}
                style={{
                  padding: '0.5rem 1rem', borderRadius: 'var(--radius-sm)',
                  border: 'none', background: 'var(--color-accent-primary)',
                  fontFamily: 'var(--font-body)', fontSize: '0.8125rem',
                  color: '#fff', cursor: 'pointer', fontWeight: 600,
                  opacity: saving ? 0.7 : 1,
                }}
              >
                <Save size={14} style={{ marginRight: 4, verticalAlign: 'middle' }} />
                {saving ? 'Guardando...' : 'Guardar'}
              </button>
            </div>
          </div>
        ) : (
          /* View Mode */
          <div>
            <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '1rem', flexWrap: 'wrap' }}>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.5rem', flexWrap: 'wrap' }}>
                  <h1 style={{
                    fontFamily: 'var(--font-heading)', fontWeight: 700,
                    fontSize: '1.5rem', color: 'var(--color-text-primary)',
                  }}>
                    {cohort.name}
                  </h1>
                  <select
                    value={cohort.status}
                    onChange={(e) => handleStatusChange(e.target.value)}
                    style={{
                      padding: '0.25rem 0.5rem', borderRadius: 'var(--radius-xl)',
                      border: `1px solid ${statusConfig.color}`,
                      background: `${statusConfig.color}12`,
                      color: statusConfig.color,
                      fontFamily: 'var(--font-body)', fontSize: '0.75rem',
                      fontWeight: 600, cursor: 'pointer', outline: 'none',
                    }}
                  >
                    {STATUS_OPTIONS.map((s) => (
                      <option key={s.value} value={s.value}>{s.label}</option>
                    ))}
                  </select>
                </div>
                {cohort.description && (
                  <p style={{
                    fontFamily: 'var(--font-body)', fontSize: '0.875rem',
                    color: 'var(--color-text-secondary)', marginBottom: '0.75rem',
                  }}>
                    {cohort.description}
                  </p>
                )}
                <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem', flexWrap: 'wrap' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.375rem' }}>
                    <Users size={14} color="var(--color-text-muted)" />
                    <span style={{ fontFamily: 'var(--font-body)', fontSize: '0.8125rem', color: 'var(--color-text-secondary)' }}>
                      {startups.length} startups
                    </span>
                  </div>
                  {cohort.start_date && cohort.end_date && (
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.375rem' }}>
                      <Calendar size={14} color="var(--color-text-muted)" />
                      <span style={{ fontFamily: 'var(--font-body)', fontSize: '0.8125rem', color: 'var(--color-text-secondary)' }}>
                        {new Date(cohort.start_date).toLocaleDateString('es-CL', { day: 'numeric', month: 'short', year: 'numeric' })}
                        {' - '}
                        {new Date(cohort.end_date).toLocaleDateString('es-CL', { day: 'numeric', month: 'short', year: 'numeric' })}
                      </span>
                    </div>
                  )}
                </div>
              </div>
              <div style={{ display: 'flex', gap: '0.5rem' }}>
                <button
                  onClick={() => setEditing(true)}
                  style={{
                    padding: '0.5rem 0.875rem', borderRadius: 'var(--radius-sm)',
                    border: '1px solid var(--color-border)', background: 'var(--color-bg-card)',
                    fontFamily: 'var(--font-body)', fontSize: '0.8125rem',
                    color: 'var(--color-text-secondary)', cursor: 'pointer',
                    display: 'flex', alignItems: 'center', gap: '0.375rem',
                  }}
                >
                  <Edit3 size={14} />
                  Editar
                </button>
                <button
                  onClick={() => setShowDeleteConfirm(true)}
                  style={{
                    padding: '0.5rem 0.875rem', borderRadius: 'var(--radius-sm)',
                    border: '1px solid #FECACA', background: '#FEF2F2',
                    fontFamily: 'var(--font-body)', fontSize: '0.8125rem',
                    color: '#DC2626', cursor: 'pointer',
                    display: 'flex', alignItems: 'center', gap: '0.375rem',
                  }}
                >
                  <Trash2 size={14} />
                  Eliminar
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Milestones */}
      {cohort.milestones.length > 0 && (
        <div style={{ ...cardStyle, padding: '1.5rem', marginBottom: '1.5rem' }}>
          <h2 style={{
            fontFamily: 'var(--font-heading)', fontWeight: 600,
            fontSize: '1.0625rem', color: 'var(--color-text-primary)',
            marginBottom: '1rem',
          }}>
            <Target size={16} style={{ marginRight: 6, verticalAlign: 'middle' }} />
            Hitos del programa
          </h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            {cohort.milestones.map((m, i) => (
              <div key={i} style={{
                display: 'flex', alignItems: 'center', gap: '1rem',
                padding: '0.75rem', borderRadius: 'var(--radius-sm)',
                background: 'var(--color-bg-primary)', flexWrap: 'wrap',
              }}>
                <span style={{
                  fontFamily: 'var(--font-body)', fontSize: '0.875rem',
                  fontWeight: 500, color: 'var(--color-text-primary)', flex: 1, minWidth: 150,
                }}>
                  {m.name}
                </span>
                <span style={{
                  fontFamily: 'var(--font-body)', fontSize: '0.75rem',
                  color: 'var(--color-text-muted)', background: 'var(--color-bg-muted)',
                  padding: '0.125rem 0.5rem', borderRadius: 'var(--radius-xl)',
                }}>
                  {STAGE_LABELS[m.stage] || m.stage}
                </span>
                {m.deadline && (
                  <span style={{
                    fontFamily: 'var(--font-body)', fontSize: '0.75rem',
                    color: 'var(--color-text-muted)',
                  }}>
                    {new Date(m.deadline).toLocaleDateString('es-CL', { day: 'numeric', month: 'short' })}
                  </span>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Startups Table */}
      <div style={{ ...cardStyle, padding: '1.5rem' }}>
        <div style={{
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          marginBottom: '1.25rem', flexWrap: 'wrap', gap: '0.75rem',
        }}>
          <h2 style={{
            fontFamily: 'var(--font-heading)', fontWeight: 600,
            fontSize: '1.0625rem', color: 'var(--color-text-primary)',
          }}>
            Startups ({startups.length})
          </h2>
          <button
            onClick={() => { setShowAddStartup(true); loadAvailableStartups() }}
            style={{
              display: 'inline-flex', alignItems: 'center', gap: '0.375rem',
              padding: '0.5rem 0.875rem', borderRadius: 'var(--radius-sm)',
              background: 'var(--color-accent-primary)', color: '#fff',
              fontFamily: 'var(--font-body)', fontSize: '0.8125rem', fontWeight: 600,
              border: 'none', cursor: 'pointer',
            }}
          >
            <UserPlus size={14} />
            Agregar startup
          </button>
        </div>

        {startups.length === 0 ? (
          <div style={{
            padding: '2.5rem 1rem', textAlign: 'center',
          }}>
            <Users size={32} color="var(--color-text-muted)" style={{ marginBottom: '0.75rem' }} />
            <p style={{
              fontFamily: 'var(--font-body)', fontSize: '0.875rem',
              color: 'var(--color-text-secondary)',
            }}>
              No hay startups asignadas a esta cohorte todavía.
            </p>
          </div>
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <table style={{
              width: '100%', borderCollapse: 'collapse',
              fontFamily: 'var(--font-body)', fontSize: '0.8125rem',
            }}>
              <thead>
                <tr style={{ borderBottom: '1px solid var(--color-border)' }}>
                  {['Startup', 'Founder', 'Vertical', 'Etapa', 'Score', 'Tools', ''].map((h) => (
                    <th key={h} style={{
                      padding: '0.75rem 0.5rem', textAlign: 'left',
                      fontWeight: 600, color: 'var(--color-text-muted)',
                      fontSize: '0.75rem', textTransform: 'uppercase',
                    }}>
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {startups.map((s) => (
                  <tr key={s.assignment_id} style={{ borderBottom: '1px solid var(--color-border)' }}>
                    <td style={{ padding: '0.75rem 0.5rem', fontWeight: 500, color: 'var(--color-text-primary)' }}>
                      {s.name}
                    </td>
                    <td style={{ padding: '0.75rem 0.5rem', color: 'var(--color-text-secondary)' }}>
                      {s.founder_name}
                    </td>
                    <td style={{ padding: '0.75rem 0.5rem', color: 'var(--color-text-secondary)' }}>
                      {VERTICAL_LABELS[s.vertical] || s.vertical}
                    </td>
                    <td style={{ padding: '0.75rem 0.5rem', color: 'var(--color-text-secondary)' }}>
                      {s.stage ? STAGE_LABELS[s.stage] || s.stage : '-'}
                    </td>
                    <td style={{ padding: '0.75rem 0.5rem', color: 'var(--color-text-secondary)' }}>
                      {s.diagnostic_score ?? '-'}
                    </td>
                    <td style={{ padding: '0.75rem 0.5rem', color: 'var(--color-text-secondary)' }}>
                      {s.tools_completed ?? 0}
                    </td>
                    <td style={{ padding: '0.75rem 0.5rem', textAlign: 'right' }}>
                      <button
                        onClick={() => handleRemoveStartup(s.assignment_id)}
                        title="Remover de la cohorte"
                        style={{
                          background: 'none', border: 'none', cursor: 'pointer',
                          color: 'var(--color-text-muted)', padding: '0.25rem',
                          borderRadius: 4, display: 'flex',
                        }}
                        onMouseEnter={(e) => (e.currentTarget.style.color = '#DC2626')}
                        onMouseLeave={(e) => (e.currentTarget.style.color = 'var(--color-text-muted)')}
                      >
                        <UserMinus size={14} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Delete Confirmation Modal */}
      <AnimatePresence>
        {showDeleteConfirm && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            style={{
              position: 'fixed', inset: 0, zIndex: 100,
              background: 'rgba(0,0,0,0.5)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              padding: '1rem',
            }}
            onClick={() => setShowDeleteConfirm(false)}
          >
            <motion.div
              initial={{ scale: 0.95 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.95 }}
              onClick={(e) => e.stopPropagation()}
              style={{
                ...cardStyle,
                padding: '2rem',
                maxWidth: 400,
                width: '100%',
                textAlign: 'center',
              }}
            >
              <AlertTriangle size={40} color="#DC2626" style={{ marginBottom: '1rem' }} />
              <h3 style={{
                fontFamily: 'var(--font-heading)', fontWeight: 600,
                fontSize: '1.125rem', color: 'var(--color-text-primary)',
                marginBottom: '0.5rem',
              }}>
                ¿Eliminar esta cohorte?
              </h3>
              <p style={{
                fontFamily: 'var(--font-body)', fontSize: '0.875rem',
                color: 'var(--color-text-secondary)', marginBottom: '1.5rem',
              }}>
                Se eliminarán todas las asignaciones de startups. Esta acción no se puede deshacer.
              </p>
              <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'center' }}>
                <button
                  onClick={() => setShowDeleteConfirm(false)}
                  style={{
                    padding: '0.625rem 1.25rem', borderRadius: 'var(--radius-sm)',
                    border: '1px solid var(--color-border)', background: 'var(--color-bg-card)',
                    fontFamily: 'var(--font-body)', fontSize: '0.875rem',
                    color: 'var(--color-text-secondary)', cursor: 'pointer',
                  }}
                >
                  Cancelar
                </button>
                <button
                  onClick={handleDelete}
                  disabled={deleting}
                  style={{
                    padding: '0.625rem 1.25rem', borderRadius: 'var(--radius-sm)',
                    border: 'none', background: '#DC2626',
                    fontFamily: 'var(--font-body)', fontSize: '0.875rem', fontWeight: 600,
                    color: '#fff', cursor: 'pointer',
                    opacity: deleting ? 0.7 : 1,
                  }}
                >
                  {deleting ? 'Eliminando...' : 'Sí, eliminar'}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Add Startup Modal */}
      <AnimatePresence>
        {showAddStartup && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            style={{
              position: 'fixed', inset: 0, zIndex: 100,
              background: 'rgba(0,0,0,0.5)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              padding: '1rem',
            }}
            onClick={() => setShowAddStartup(false)}
          >
            <motion.div
              initial={{ scale: 0.95 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.95 }}
              onClick={(e) => e.stopPropagation()}
              style={{
                ...cardStyle,
                padding: '1.5rem',
                maxWidth: 500,
                width: '100%',
                maxHeight: '70vh',
                overflowY: 'auto',
              }}
            >
              <div style={{
                display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                marginBottom: '1.25rem',
              }}>
                <h3 style={{
                  fontFamily: 'var(--font-heading)', fontWeight: 600,
                  fontSize: '1.125rem', color: 'var(--color-text-primary)',
                }}>
                  Agregar startup a la cohorte
                </h3>
                <button
                  onClick={() => setShowAddStartup(false)}
                  style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--color-text-muted)' }}
                >
                  <X size={18} />
                </button>
              </div>

              {/* Invite by email */}
              <div style={{
                padding: '1rem', borderRadius: 'var(--radius-sm)',
                background: 'var(--color-bg-primary)', marginBottom: '1rem',
                border: '1px solid var(--color-border)',
              }}>
                <p style={{
                  fontFamily: 'var(--font-body)', fontSize: '0.8125rem',
                  fontWeight: 600, color: 'var(--color-text-primary)', marginBottom: '0.5rem',
                }}>
                  <Mail size={14} style={{ verticalAlign: 'middle', marginRight: 4 }} />
                  Invitar founder por email
                </p>
                {inviteSuccess && (
                  <div style={{
                    padding: '0.5rem 0.75rem', borderRadius: 'var(--radius-sm)',
                    background: 'rgba(13,148,136,0.08)', color: '#0D9488',
                    fontFamily: 'var(--font-body)', fontSize: '0.8125rem',
                    marginBottom: '0.5rem',
                  }}>
                    {inviteSuccess}
                  </div>
                )}
                <div style={{ display: 'flex', gap: '0.5rem' }}>
                  <input
                    type="email"
                    value={inviteEmail}
                    onChange={(e) => setInviteEmail(e.target.value)}
                    placeholder="email@ejemplo.com"
                    style={{ ...inputStyle, fontSize: '0.8125rem', flex: 1 }}
                  />
                  <button
                    onClick={async () => {
                      if (!inviteEmail.trim()) return
                      setInviting(true)
                      setInviteSuccess(null)
                      setError(null)
                      try {
                        const res = await fetch('/api/invitations', {
                          method: 'POST',
                          headers: { 'Content-Type': 'application/json' },
                          body: JSON.stringify({ email: inviteEmail, cohort_id: cohortId }),
                        })
                        const data = await res.json()
                        if (res.ok) {
                          setInviteSuccess(`Invitación enviada a ${inviteEmail}`)
                          setInviteEmail('')
                        } else {
                          setError(data.error || 'Error al enviar invitación')
                        }
                      } catch {
                        setError('Error al enviar invitación')
                      }
                      setInviting(false)
                    }}
                    disabled={inviting || !inviteEmail.trim()}
                    style={{
                      padding: '0.5rem 1rem', borderRadius: 'var(--radius-sm)',
                      background: 'var(--color-accent-primary)', color: '#fff',
                      fontFamily: 'var(--font-body)', fontSize: '0.8125rem', fontWeight: 600,
                      border: 'none', cursor: 'pointer', whiteSpace: 'nowrap',
                      opacity: inviting ? 0.7 : 1,
                    }}
                  >
                    {inviting ? 'Enviando...' : 'Invitar'}
                  </button>
                </div>
              </div>

              {/* Existing startups */}
              {loadingStartups ? (
                <div style={{ textAlign: 'center', padding: '2rem' }}>
                  <Loader2 size={24} color="var(--color-accent-primary)" style={{ animation: 'spin 1s linear infinite' }} />
                </div>
              ) : availableStartups.length === 0 ? (
                <p style={{
                  fontFamily: 'var(--font-body)', fontSize: '0.875rem',
                  color: 'var(--color-text-secondary)', textAlign: 'center',
                  padding: '1rem 0',
                }}>
                  No hay startups registradas disponibles para agregar.
                </p>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                  {availableStartups.map((s) => (
                    <div
                      key={s.id}
                      style={{
                        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                        padding: '0.75rem', borderRadius: 'var(--radius-sm)',
                        border: '1px solid var(--color-border)', gap: '0.75rem',
                      }}
                    >
                      <div>
                        <div style={{
                          fontFamily: 'var(--font-body)', fontSize: '0.875rem',
                          fontWeight: 500, color: 'var(--color-text-primary)',
                        }}>
                          {s.name}
                        </div>
                        <div style={{
                          fontFamily: 'var(--font-body)', fontSize: '0.75rem',
                          color: 'var(--color-text-muted)',
                        }}>
                          {s.founder_name} · {VERTICAL_LABELS[s.vertical] || s.vertical}
                        </div>
                      </div>
                      <button
                        onClick={() => handleAddStartup(s.id)}
                        style={{
                          padding: '0.375rem 0.75rem', borderRadius: 'var(--radius-sm)',
                          background: 'var(--color-accent-primary)', color: '#fff',
                          fontFamily: 'var(--font-body)', fontSize: '0.75rem', fontWeight: 600,
                          border: 'none', cursor: 'pointer', whiteSpace: 'nowrap',
                        }}
                      >
                        Agregar
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  )
}
