'use client'

import { useState, useEffect, useCallback } from 'react'
import { useParams, useRouter, usePathname } from 'next/navigation'
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
import { loadCohortDetail } from '@/lib/admin-data/cohort-detail'
// Demo-only display fixture (cohort progress KPIs panel rendered behind isDemo guard)
import { getCohortById } from '@/lib/demo/admin-fixtures'

interface CohortData {
  id: string
  name: string
  description: string | null
  start_date: string | null
  end_date: string | null
  status: string
  milestones: { name: string; stage: string; deadline: string }[]
  org_id: string
  access_mode: 'open' | 'closed'
  share_token: string | null
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
  unaffiliated: boolean
}

const STATUS_OPTIONS = [
  { value: 'planned', label: 'Planificada', color: '#1F77F6' },
  { value: 'active', label: 'Activa', color: '#1F77F6' },
  { value: 'completed', label: 'Completada', color: '#6B7280' },
  { value: 'archived', label: 'Archivada', color: '#9CA3AF' },
]

const STAGE_LABELS: Record<string, string> = {
  pre_incubation: 'Pre-incubación',
  incubation: 'Incubación',
  acceleration: 'Aceleración',
  scaling: 'Escalamiento',
  completed: 'Completado',
  pending: 'Pendiente',
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
  // demo extras
  biomateriales: 'Biomateriales',
  agritech: 'Agritech',
  energia: 'Energía',
  otros: 'Otros',
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
  const pathname = usePathname()
  const cohortsHref = pathname.startsWith('/demo-admin') ? '/demo-admin/cohortes' : '/admin/cohortes'
  const { appUser, isDemo } = useAuth()
  const cohortId = params.id as string

  const [cohort, setCohort] = useState<CohortData | null>(null)
  const [startups, setStartups] = useState<StartupInCohort[]>([])
  const [loading, setLoading] = useState(true)
  const [editing, setEditing] = useState(false)
  const [editForm, setEditForm] = useState<{
    name: string
    description: string
    start_date: string
    end_date: string
    access_mode: 'open' | 'closed'
  }>({ name: '', description: '', start_date: '', end_date: '', access_mode: 'closed' })
  const [statusError, setStatusError] = useState<string | null>(null)
  const [addStartupError, setAddStartupError] = useState<string | null>(null)
  const [addingStartupId, setAddingStartupId] = useState<string | null>(null)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)
  const [deleting, setDeleting] = useState(false)
  const [showAddStartup, setShowAddStartup] = useState(false)
  const [availableStartups, setAvailableStartups] = useState<AvailableStartup[]>([])
  const [loadingStartups, setLoadingStartups] = useState(false)
  const [inviteEmail, setInviteEmail] = useState('')
  const [inviteLink, setInviteLink] = useState<string | null>(null)
  const [linkCopied, setLinkCopied] = useState(false)
  const [shareLinkCopied, setShareLinkCopied] = useState(false)
  const [regenerating, setRegenerating] = useState(false)
  const [inviting, setInviting] = useState(false)
  const [inviteSuccess, setInviteSuccess] = useState<string | null>(null)

  const loadCohort = useCallback(async () => {
    setLoading(true)
    setError(null)

    try {
      const { cohort: cohortData, startups: startupsList } = await loadCohortDetail({ isDemo, cohortId })
      setCohort(cohortData)
      setEditForm({
        name: cohortData.name,
        description: cohortData.description || '',
        start_date: cohortData.start_date || '',
        end_date: cohortData.end_date || '',
        access_mode: cohortData.access_mode,
      })
      setStartups(startupsList)
    } catch (err) {
      const code = err instanceof Error ? err.message : ''
      if (code === 'demo_not_found') setError('No se encontró la cohorte (demo).')
      else if (code === 'cohort_not_found') setError('No se encontró la cohorte.')
      else {
        console.error('[S4C Admin] cohort load failed:', err)
        setError('No se pudo cargar la cohorte.')
      }
    } finally {
      setLoading(false)
    }
  }, [cohortId, isDemo])

  useEffect(() => {
    loadCohort()
  }, [loadCohort])

  const handleSaveEdit = async () => {
    if (!editForm.name.trim()) return
    if (isDemo) {
      setEditing(false)
      return
    }
    setSaving(true)
    const { error: updateError } = await supabase
      .from('cohorts')
      .update({
        name: editForm.name.trim(),
        description: editForm.description.trim() || null,
        start_date: editForm.start_date || null,
        end_date: editForm.end_date || null,
        access_mode: editForm.access_mode,
      })
      .eq('id', cohortId)

    if (updateError) {
      console.error('[S4C Admin] cohort update failed:', updateError)
      setError('Error al guardar los cambios.')
    } else {
      setEditing(false)
      loadCohort()
    }
    setSaving(false)
  }

  const handleStatusChange = async (newStatus: string) => {
    if (isDemo) {
      if (cohort) setCohort({ ...cohort, status: newStatus })
      return
    }
    if (!cohort) return
    const prevStatus = cohort.status
    // Optimistic update
    setCohort({ ...cohort, status: newStatus })
    setStatusError(null)
    const { error: updateError } = await supabase
      .from('cohorts')
      .update({ status: newStatus })
      .eq('id', cohortId)

    if (updateError) {
      console.error('[S4C Admin] cohort status update failed:', updateError)
      // Revert
      setCohort({ ...cohort, status: prevStatus })
      setStatusError(`No se pudo actualizar el estado: ${updateError.message}`)
    }
  }

  const handleDelete = async () => {
    if (isDemo) {
      setShowDeleteConfirm(false)
      router.push(cohortsHref)
      return
    }
    setDeleting(true)
    // Remove startup assignments first
    await supabase.from('cohort_startups').delete().eq('cohort_id', cohortId)
    const { error: deleteError } = await supabase.from('cohorts').delete().eq('id', cohortId)

    if (deleteError) {
      setError('Error al eliminar la cohorte.')
      setDeleting(false)
    } else {
      router.push(cohortsHref)
    }
  }

  const handleRemoveStartup = async (assignmentId: string) => {
    if (isDemo) {
      setStartups((prev) => prev.filter((s) => s.assignment_id !== assignmentId))
      return
    }
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
    if (isDemo) {
      setAvailableStartups([])
      setLoadingStartups(false)
      return
    }
    const currentIds = startups.map((s) => s.startup_id)

    // Get founders in admin's org OR unaffiliated founders (org_id IS NULL)
    const orgId = appUser?.org_id
    const profilesQuery = supabase
      .from('profiles')
      .select('id, full_name, org_id')
      .eq('role', 'founder')

    const { data: orgProfiles, error: profilesError } = orgId
      ? await profilesQuery.or(`org_id.eq.${orgId},org_id.is.null`)
      : await profilesQuery.is('org_id', null)

    if (profilesError) {
      console.error('[S4C Admin] profiles load failed:', profilesError)
    }

    const orgFounderIds = (orgProfiles || []).map((p) => p.id)
    const { data: allStartups } = orgFounderIds.length > 0
      ? await supabase.from('startups').select('id, name, vertical, founder_id').in('founder_id', orgFounderIds)
      : { data: [] }

    if (allStartups) {
      const profileMap: Record<string, { full_name: string; org_id: string | null }> = {}
      orgProfiles?.forEach((p) => {
        profileMap[p.id] = { full_name: p.full_name, org_id: p.org_id }
      })

      setAvailableStartups(
        allStartups
          .filter((s) => !currentIds.includes(s.id))
          .map((s) => {
            const prof = profileMap[s.founder_id]
            return {
              id: s.id,
              name: s.name,
              founder_name: prof?.full_name || 'Sin founder',
              vertical: s.vertical,
              unaffiliated: !prof?.org_id,
            }
          })
      )
    }
    setLoadingStartups(false)
  }

  const handleAddStartup = async (startupId: string) => {
    if (isDemo) {
      setShowAddStartup(false)
      return
    }
    setAddStartupError(null)
    setAddingStartupId(startupId)
    const { error: addError } = await supabase
      .from('cohort_startups')
      .insert({ cohort_id: cohortId, startup_id: startupId })

    if (addError) {
      console.error('[S4C Admin] cohort_startups insert failed:', addError)
      const code = addError.code
      let msg = 'No se pudo agregar. Intenta de nuevo.'
      if (code === '23505') msg = 'Esta startup ya está en el cohorte.'
      else if (code === '42501' || /row-level security|permission/i.test(addError.message)) {
        msg = 'No tienes permiso para agregar esta startup.'
      }
      setAddStartupError(`No se pudo agregar: ${msg}`)
      setAddingStartupId(null)
      return
    }
    setAddingStartupId(null)
    setAddStartupError(null)
    setShowAddStartup(false)
    loadCohort()
  }

  if (loading) {
    return (
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '60vh' }}>
        <Loader2 size={28} color="var(--color-accent-primary)" style={{ animation: 'spin 1s linear infinite' }} />

      </div>
    )
  }

  if (!cohort) {
    return (
      <div style={{ padding: '2rem 1.5rem', textAlign: 'center' }}>
        <p style={{ fontFamily: 'var(--font-body)', color: 'var(--color-text-secondary)' }}>
          {error || 'Cohorte no encontrada.'}
        </p>
        <Link href={cohortsHref} style={{
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
        href={cohortsHref}
        style={{
          display: 'inline-flex', alignItems: 'center', gap: '0.375rem',
          fontFamily: 'var(--font-body)', fontSize: '0.8125rem',
          color: 'var(--color-text-secondary)', textDecoration: 'none',
          marginBottom: '1rem',
        }}
      >
        <ChevronLeft size={16} />
        Volver a cohortes
      </Link>

      {isDemo && (
        <div
          style={{
            display: 'inline-flex', alignItems: 'center', gap: '0.5rem',
            padding: '0.375rem 0.75rem', borderRadius: 999,
            background: 'var(--color-warning-light)',
            border: '1px solid var(--color-warning-border)',
            color: 'var(--color-warning)',
            fontFamily: 'var(--font-body)', fontSize: 'var(--text-xs)',
            fontWeight: 500, marginBottom: '1rem', marginLeft: '0.75rem',
          }}
        >
          Modo demo — los datos son ilustrativos
        </div>
      )}

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
            <div style={{ marginBottom: '1rem' }}>
              <label style={labelStyle}>Modo de acceso</label>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
                {([
                  { value: 'open', title: 'Abierto', desc: 'Los founders pueden descubrirlo y solicitar ingreso. Tú apruebas.' },
                  { value: 'closed', title: 'Cerrado', desc: 'Solo tú puedes asignar startups manualmente.' },
                ] as const).map((opt) => {
                  const selected = editForm.access_mode === opt.value
                  return (
                    <button
                      type="button"
                      key={opt.value}
                      onClick={() => setEditForm({ ...editForm, access_mode: opt.value })}
                      style={{
                        textAlign: 'left',
                        padding: '0.75rem 0.875rem',
                        borderRadius: 'var(--radius-sm)',
                        border: selected ? '1px solid var(--color-accent-primary)' : '1px solid var(--color-border)',
                        background: selected ? 'rgba(31,119,246,0.06)' : 'var(--color-bg-card)',
                        cursor: 'pointer',
                        transition: 'all 0.15s',
                      }}
                    >
                      <div style={{
                        fontFamily: 'var(--font-body)', fontSize: '0.8125rem', fontWeight: 600,
                        color: selected ? 'var(--color-accent-primary)' : 'var(--color-text-primary)',
                        marginBottom: '0.25rem',
                      }}>
                        {opt.title}
                      </div>
                      <div style={{
                        fontFamily: 'var(--font-body)', fontSize: '0.75rem',
                        color: 'var(--color-text-secondary)', lineHeight: 1.4,
                      }}>
                        {opt.desc}
                      </div>
                    </button>
                  )
                })}
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
                  {statusError && (
                    <span style={{
                      fontFamily: 'var(--font-body)', fontSize: '0.75rem',
                      color: '#DC2626',
                    }}>
                      {statusError}
                    </span>
                  )}
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
              <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                <Link
                  href={`${cohortsHref}/${cohort.id}/demo-day`}
                  style={{
                    padding: '0.5rem 0.875rem', borderRadius: 'var(--radius-sm)',
                    border: '1px solid rgba(99,102,241,0.3)', background: 'rgba(99,102,241,0.08)',
                    fontFamily: 'var(--font-body)', fontSize: '0.8125rem',
                    color: '#6366F1', cursor: 'pointer', textDecoration: 'none',
                    display: 'flex', alignItems: 'center', gap: '0.375rem', fontWeight: 600,
                  }}
                >
                  <Target size={14} />
                  Demo Day
                </Link>
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

      {/* Demo: Cohort progress + platform KPIs panel */}
      {isDemo && (() => {
        const demoCohort = getCohortById(cohortId)
        if (!demoCohort) return null
        const monthPct = Math.round((demoCohort.monthCurrent / demoCohort.monthTotal) * 100)
        const fmtUSD = (n: number) =>
          n >= 1_000_000 ? `USD ${(n / 1_000_000).toFixed(1)}M` :
          n >= 1_000 ? `USD ${(n / 1_000).toFixed(0)}K` : `USD ${n.toLocaleString('es-PE')}`
        return (
          <div style={{ ...cardStyle, padding: '1.5rem', marginBottom: '1.5rem' }}>
            <h2 style={{
              fontFamily: 'var(--font-heading)', fontWeight: 600,
              fontSize: '1.0625rem', color: 'var(--color-text-primary)',
              marginBottom: '1rem',
            }}>
              KPIs de cohorte
            </h2>
            <div style={{
              display: 'grid', gap: '1rem',
              gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
              marginBottom: '1.25rem',
            }}>
              {[
                { label: 'Tools completion', value: `${demoCohort.toolsCompletionPct}%`, color: '#1F77F6' },
                { label: 'NPS founders', value: `${demoCohort.npsFounders}`, color: '#1F77F6' },
                { label: 'Funding levantado', value: fmtUSD(demoCohort.fundingRaisedUSD), color: '#16A34A' },
                { label: 'Graduados', value: `${demoCohort.graduates}`, color: '#DA4E24' },
              ].map((k) => (
                <div key={k.label} style={{
                  padding: '0.85rem 1rem', borderRadius: 'var(--radius-sm)',
                  background: `${k.color}0F`, border: `1px solid ${k.color}33`,
                }}>
                  <div style={{
                    fontFamily: 'var(--font-body)', fontSize: '0.66rem',
                    color: 'var(--color-text-secondary)',
                    textTransform: 'uppercase', letterSpacing: '0.05em',
                    marginBottom: '0.3rem',
                  }}>
                    {k.label}
                  </div>
                  <div style={{
                    fontFamily: 'var(--font-heading)', fontWeight: 700,
                    fontSize: '1.15rem', color: 'var(--color-text-primary)',
                    fontVariantNumeric: 'tabular-nums',
                  }}>
                    {k.value}
                  </div>
                </div>
              ))}
            </div>
            <div style={{ marginBottom: '0.85rem' }}>
              <div style={{
                display: 'flex', justifyContent: 'space-between',
                marginBottom: '0.35rem',
              }}>
                <span style={{
                  fontFamily: 'var(--font-body)', fontSize: '0.8125rem',
                  color: 'var(--color-text-primary)', fontWeight: 500,
                }}>
                  Retención de founders
                </span>
                <span style={{
                  fontFamily: 'var(--font-body)', fontSize: '0.8125rem',
                  color: 'var(--color-text-secondary)',
                  fontVariantNumeric: 'tabular-nums',
                }}>
                  {demoCohort.retentionRate}%
                </span>
              </div>
              <div style={{ height: 8, borderRadius: 4, background: 'var(--color-bg-muted)', overflow: 'hidden' }}>
                <div style={{ width: `${demoCohort.retentionRate}%`, height: '100%', background: '#1F77F6' }} />
              </div>
            </div>
            <div>
              <div style={{
                display: 'flex', justifyContent: 'space-between',
                marginBottom: '0.35rem',
              }}>
                <span style={{
                  fontFamily: 'var(--font-body)', fontSize: '0.8125rem',
                  color: 'var(--color-text-primary)', fontWeight: 500,
                }}>
                  Avance temporal · mes {demoCohort.monthCurrent} de {demoCohort.monthTotal}
                </span>
                <span style={{
                  fontFamily: 'var(--font-body)', fontSize: '0.8125rem',
                  color: 'var(--color-text-secondary)',
                  fontVariantNumeric: 'tabular-nums',
                }}>
                  {monthPct}%
                </span>
              </div>
              <div style={{ height: 8, borderRadius: 4, background: 'var(--color-bg-muted)', overflow: 'hidden' }}>
                <div style={{ width: `${monthPct}%`, height: '100%', background: '#DA4E24' }} />
              </div>
            </div>
          </div>
        )
      })()}

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
            onClick={() => { setShowAddStartup(true); setAddStartupError(null); loadAvailableStartups() }}
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
            onClick={() => { setShowAddStartup(false); setAddStartupError(null) }}
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
                  onClick={() => { setShowAddStartup(false); setAddStartupError(null) }}
                  style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--color-text-muted)' }}
                >
                  <X size={18} />
                </button>
              </div>

              {addStartupError && (
                <div style={{
                  padding: '0.625rem 0.875rem', borderRadius: 'var(--radius-sm)',
                  background: '#FEF2F2', border: '1px solid #FECACA',
                  color: '#DC2626', fontFamily: 'var(--font-body)', fontSize: '0.8125rem',
                  marginBottom: '0.875rem',
                }}>
                  {addStartupError}
                </div>
              )}

              {/* Public share link */}
              {cohort.share_token && (
                <div style={{
                  padding: '1rem', borderRadius: 'var(--radius-sm)',
                  background: 'var(--color-bg-primary)', marginBottom: '1rem',
                  border: '1px solid var(--color-border)',
                }}>
                  <p style={{
                    fontFamily: 'var(--font-body)', fontSize: '0.8125rem',
                    fontWeight: 600, color: 'var(--color-text-primary)', marginBottom: '0.25rem',
                  }}>
                    Link público
                  </p>
                  <p style={{
                    fontFamily: 'var(--font-body)', fontSize: '0.6875rem',
                    color: 'var(--color-text-muted)', marginBottom: '0.625rem',
                  }}>
                    Compártelo con tus founders. Cada uno crea una solicitud que tú apruebas en /admin/cohort-requests.
                  </p>
                  <div style={{ display: 'flex', gap: '0.375rem', alignItems: 'center' }}>
                    <code style={{
                      flex: 1, padding: '0.5rem 0.625rem',
                      background: 'var(--color-bg-card)', border: '1px solid var(--color-border)',
                      borderRadius: 4, fontSize: '0.6875rem',
                      overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
                      color: 'var(--color-text-primary)',
                    }}>
                      {`${typeof window !== 'undefined' ? window.location.origin : ''}/cohort-join/${cohort.share_token}`}
                    </code>
                    <button
                      onClick={async () => {
                        if (!cohort?.share_token) return
                        const url = `${window.location.origin}/cohort-join/${cohort.share_token}`
                        try {
                          await navigator.clipboard.writeText(url)
                          setShareLinkCopied(true)
                          setTimeout(() => setShareLinkCopied(false), 2000)
                        } catch { /* noop */ }
                      }}
                      style={{
                        padding: '0.5rem 0.75rem', borderRadius: 4,
                        background: 'var(--color-accent-primary)', color: '#fff',
                        border: 'none', cursor: 'pointer',
                        fontSize: '0.75rem', fontWeight: 600, fontFamily: 'var(--font-body)',
                        whiteSpace: 'nowrap',
                      }}
                    >
                      {shareLinkCopied ? '✓ Copiado' : 'Copiar'}
                    </button>
                    <button
                      onClick={async () => {
                        if (!cohort?.id) return
                        const ok = window.confirm('Regenerar el link invalida el actual. Founders con el link viejo no podrán postular. ¿Continuar?')
                        if (!ok) return
                        setRegenerating(true)
                        const { data } = await supabase.rpc('regenerate_cohort_share_token', { p_cohort_id: cohort.id })
                        const payload = data as { ok: boolean; share_token?: string; error?: string } | null
                        if (payload?.ok && payload.share_token) {
                          setCohort({ ...cohort, share_token: payload.share_token })
                        } else {
                          alert('No se pudo regenerar el link.')
                        }
                        setRegenerating(false)
                      }}
                      disabled={regenerating}
                      title="Regenerar link"
                      style={{
                        padding: '0.5rem 0.625rem', borderRadius: 4,
                        background: 'transparent', color: 'var(--color-text-muted)',
                        border: '1px solid var(--color-border)', cursor: regenerating ? 'wait' : 'pointer',
                        fontSize: '0.6875rem', fontWeight: 500, fontFamily: 'var(--font-body)',
                        whiteSpace: 'nowrap',
                      }}
                    >
                      {regenerating ? '…' : 'Regenerar'}
                    </button>
                  </div>
                </div>
              )}

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
                    background: 'rgba(31,119,246,0.08)', color: '#1F77F6',
                    fontFamily: 'var(--font-body)', fontSize: '0.8125rem',
                    marginBottom: '0.5rem',
                  }}>
                    {inviteSuccess}
                  </div>
                )}
                {inviteLink && (
                  <div style={{
                    padding: '0.625rem 0.75rem', borderRadius: 'var(--radius-sm)',
                    background: 'rgba(240,114,29,0.08)', border: '1px solid rgba(240,114,29,0.2)',
                    fontFamily: 'var(--font-body)', fontSize: '0.75rem', color: 'var(--color-text-primary)',
                    marginBottom: '0.5rem', display: 'flex', flexDirection: 'column', gap: '0.375rem',
                  }}>
                    <span style={{ color: '#F0721D', fontWeight: 600 }}>
                      Email no enviado — comparte este link manualmente:
                    </span>
                    <div style={{ display: 'flex', gap: '0.375rem', alignItems: 'center' }}>
                      <code style={{
                        flex: 1, padding: '0.375rem 0.5rem',
                        background: 'var(--color-bg-card)', borderRadius: 4,
                        fontSize: '0.6875rem', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
                      }}>
                        {inviteLink}
                      </code>
                      <button
                        onClick={async () => {
                          try {
                            await navigator.clipboard.writeText(inviteLink)
                            setLinkCopied(true)
                            setTimeout(() => setLinkCopied(false), 2000)
                          } catch { /* noop */ }
                        }}
                        style={{
                          padding: '0.375rem 0.625rem', borderRadius: 4,
                          background: 'var(--color-accent-primary)', color: '#fff',
                          border: 'none', cursor: 'pointer',
                          fontSize: '0.6875rem', fontWeight: 600, fontFamily: 'var(--font-body)',
                          whiteSpace: 'nowrap',
                        }}
                      >
                        {linkCopied ? '✓ Copiado' : 'Copiar'}
                      </button>
                    </div>
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
                      setInviteLink(null)
                      setError(null)
                      try {
                        const res = await fetch('/api/invitations', {
                          method: 'POST',
                          headers: { 'Content-Type': 'application/json' },
                          body: JSON.stringify({ email: inviteEmail, cohort_id: cohortId }),
                        })
                        const data = await res.json()
                        if (res.ok) {
                          if (data.email_sent) {
                            setInviteSuccess(`Invitación enviada a ${inviteEmail}`)
                          } else {
                            setInviteSuccess(`Invitación creada para ${inviteEmail}`)
                            setInviteLink(data.invite_url || null)
                          }
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
                          display: 'flex', alignItems: 'center', gap: '0.375rem',
                          fontFamily: 'var(--font-body)', fontSize: '0.875rem',
                          fontWeight: 500, color: 'var(--color-text-primary)',
                          flexWrap: 'wrap',
                        }}>
                          {s.name}
                          {s.unaffiliated && (
                            <span style={{
                              fontFamily: 'var(--font-body)', fontSize: '0.6875rem',
                              fontWeight: 500, color: 'var(--color-text-muted)',
                              background: 'var(--color-bg-muted)',
                              padding: '0.125rem 0.5rem',
                              borderRadius: 'var(--radius-xl)',
                            }}>
                              Sin org
                            </span>
                          )}
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
                        disabled={addingStartupId === s.id}
                        style={{
                          padding: '0.375rem 0.75rem', borderRadius: 'var(--radius-sm)',
                          background: 'var(--color-accent-primary)', color: '#fff',
                          fontFamily: 'var(--font-body)', fontSize: '0.75rem', fontWeight: 600,
                          border: 'none', cursor: 'pointer', whiteSpace: 'nowrap',
                          opacity: addingStartupId === s.id ? 0.7 : 1,
                        }}
                      >
                        {addingStartupId === s.id ? 'Agregando...' : 'Agregar'}
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
