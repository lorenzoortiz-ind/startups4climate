'use client'

import { useState, useEffect, useCallback } from 'react'
import { motion } from 'framer-motion'
import {
  ScrollText, Building2, Shield, Users, Mail, LifeBuoy,
  Activity, Calendar, ChevronDown, Loader2,
} from 'lucide-react'
import { useAuth } from '@/context/AuthContext'
import { supabase } from '@/lib/supabase'

interface ActivityEntry {
  id: string
  actor_id: string | null
  action: string
  entity_type: string
  entity_id: string | null
  metadata: Record<string, unknown> | null
  created_at: string
  actor_name?: string
}

const ACTION_ICONS: Record<string, typeof Building2> = {
  'org.created': Building2,
  'user.role_changed': Shield,
  'cohort.created': Users,
  'invitation.sent': Mail,
  'ticket.created': LifeBuoy,
}

const ACTION_COLORS: Record<string, string> = {
  'org.created': '#3B82F6',
  'user.role_changed': '#8B5CF6',
  'cohort.created': '#0D9488',
  'invitation.sent': '#EA580C',
  'ticket.created': '#DC2626',
}

const ENTITY_TYPES = [
  { value: 'all', label: 'Todos' },
  { value: 'organization', label: 'Organización' },
  { value: 'profile', label: 'Perfil' },
  { value: 'cohort', label: 'Cohorte' },
  { value: 'startup', label: 'Startup' },
  { value: 'invitation', label: 'Invitación' },
]

const cardStyle: React.CSSProperties = {
  background: 'var(--color-bg-card)',
  border: '1px solid var(--color-border)',
  borderRadius: 'var(--radius-md)',
  padding: '1.5rem',
  boxShadow: 'var(--shadow-card)',
}

const selectStyle: React.CSSProperties = {
  padding: '0.5rem 0.75rem',
  borderRadius: 'var(--radius-md)',
  border: '1px solid var(--color-border)',
  background: 'var(--color-bg-card)',
  fontFamily: 'var(--font-body)',
  fontSize: '0.8125rem',
  color: 'var(--color-text-primary)',
  outline: 'none',
  cursor: 'pointer',
  appearance: 'none' as const,
  backgroundImage: 'url("data:image/svg+xml,%3Csvg xmlns=\'http://www.w3.org/2000/svg\' width=\'12\' height=\'12\' viewBox=\'0 0 24 24\' fill=\'none\' stroke=\'%236B7280\' stroke-width=\'2\'%3E%3Cpath d=\'M6 9l6 6 6-6\'/%3E%3C/svg%3E")',
  backgroundRepeat: 'no-repeat',
  backgroundPosition: 'right 0.75rem center',
  paddingRight: '2rem',
}

const inputStyle: React.CSSProperties = {
  padding: '0.5rem 0.75rem',
  borderRadius: 'var(--radius-md)',
  border: '1px solid var(--color-border)',
  background: 'var(--color-bg-card)',
  fontFamily: 'var(--font-body)',
  fontSize: '0.8125rem',
  color: 'var(--color-text-primary)',
  outline: 'none',
}

const fadeUp = {
  initial: { opacity: 0, y: 16 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.4, ease: 'easeOut' as const },
}

function relativeTime(dateStr: string): string {
  const now = new Date()
  const date = new Date(dateStr)
  const diffMs = now.getTime() - date.getTime()
  const diffSec = Math.floor(diffMs / 1000)
  const diffMin = Math.floor(diffSec / 60)
  const diffHour = Math.floor(diffMin / 60)
  const diffDay = Math.floor(diffHour / 24)

  if (diffSec < 60) return 'hace unos segundos'
  if (diffMin < 60) return `hace ${diffMin} min`
  if (diffHour < 24) return `hace ${diffHour}h`
  if (diffDay < 7) return `hace ${diffDay}d`
  return date.toLocaleDateString('es-CL', { day: '2-digit', month: 'short', year: 'numeric' })
}

export default function ActividadPage() {
  const { appUser } = useAuth()
  const [entries, setEntries] = useState<ActivityEntry[]>([])
  const [loading, setLoading] = useState(true)
  const [loadingMore, setLoadingMore] = useState(false)
  const [hasMore, setHasMore] = useState(true)

  // Filters
  const [entityFilter, setEntityFilter] = useState('all')
  const [dateFrom, setDateFrom] = useState('')
  const [dateTo, setDateTo] = useState('')

  const isSuperadmin = appUser?.role === 'superadmin'
  const PAGE_SIZE = 50

  const loadEntries = useCallback(async (offset: number, append: boolean) => {
    if (offset === 0) setLoading(true)
    else setLoadingMore(true)

    let query = supabase
      .from('activity_log')
      .select('*')
      .order('created_at', { ascending: false })
      .range(offset, offset + PAGE_SIZE - 1)

    if (entityFilter !== 'all') {
      query = query.eq('entity_type', entityFilter)
    }
    if (dateFrom) {
      query = query.gte('created_at', new Date(dateFrom).toISOString())
    }
    if (dateTo) {
      const endDate = new Date(dateTo)
      endDate.setHours(23, 59, 59, 999)
      query = query.lte('created_at', endDate.toISOString())
    }

    const { data } = await query

    if (!data) {
      if (!append) setEntries([])
      setHasMore(false)
      setLoading(false)
      setLoadingMore(false)
      return
    }

    // Resolve actor names
    const actorIds = [...new Set(data.map((e) => e.actor_id).filter(Boolean))]
    let actorMap: Record<string, string> = {}
    if (actorIds.length > 0) {
      const { data: profiles } = await supabase
        .from('profiles')
        .select('id, full_name')
        .in('id', actorIds)
      if (profiles) {
        actorMap = Object.fromEntries(profiles.map((p) => [p.id, p.full_name || 'Sin nombre']))
      }
    }

    const enriched: ActivityEntry[] = data.map((e) => ({
      ...e,
      metadata: e.metadata || null,
      actor_name: e.actor_id ? actorMap[e.actor_id] || 'Usuario desconocido' : 'Sistema',
    }))

    if (append) {
      setEntries((prev) => [...prev, ...enriched])
    } else {
      setEntries(enriched)
    }

    setHasMore(data.length === PAGE_SIZE)
    setLoading(false)
    setLoadingMore(false)
  }, [entityFilter, dateFrom, dateTo])

  // Reload when filters change
  useEffect(() => {
    if (!isSuperadmin) return
    loadEntries(0, false)
  }, [isSuperadmin, loadEntries])

  const handleLoadMore = () => {
    loadEntries(entries.length, true)
  }

  const getActionIcon = (action: string) => {
    const Icon = ACTION_ICONS[action] || Activity
    const color = ACTION_COLORS[action] || 'var(--color-text-muted)'
    return { Icon, color }
  }

  const getActionDescription = (entry: ActivityEntry): string => {
    const meta = entry.metadata || {}
    switch (entry.action) {
      case 'org.created':
        return `creó la organización "${meta.org_name || entry.entity_id || ''}"`
      case 'user.role_changed':
        return `cambió el rol de un usuario a ${meta.new_role || 'desconocido'}`
      case 'cohort.created':
        return `creó la cohorte "${meta.cohort_name || entry.entity_id || ''}"`
      case 'invitation.sent':
        return `envió una invitación a ${meta.email || 'un usuario'}`
      case 'ticket.created':
        return `creó un ticket de soporte`
      default:
        return entry.action.replace(/[._]/g, ' ')
    }
  }

  if (!isSuperadmin) {
    return (
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '60vh' }}>
        <p style={{ fontFamily: 'var(--font-body)', color: 'var(--color-text-secondary)' }}>
          Acceso restringido a superadmins.
        </p>
      </div>
    )
  }

  if (loading) {
    return (
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '60vh' }}>
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
          style={{
            width: 32, height: 32,
            border: '3px solid var(--color-border)',
            borderTopColor: '#0D9488',
            borderRadius: '50%',
          }}
        />
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
      {/* Header */}
      <div style={{ marginBottom: '1.5rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.25rem' }}>
          <ScrollText size={20} color="#0D9488" />
          <h1 style={{ fontFamily: 'var(--font-heading)', fontWeight: 700, fontSize: '1.25rem', color: 'var(--color-text-primary)' }}>
            Actividad
          </h1>
        </div>
        <p style={{ fontFamily: 'var(--font-body)', fontSize: '0.8125rem', color: 'var(--color-text-secondary)' }}>
          Registro de actividad y auditoría de la plataforma
        </p>
      </div>

      {/* Filters */}
      <motion.div {...fadeUp} style={{ ...cardStyle, marginBottom: '1.5rem' }}>
        <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', alignItems: 'center' }}>
          <div>
            <label style={{ fontFamily: 'var(--font-body)', fontSize: '0.75rem', fontWeight: 600, color: 'var(--color-text-secondary)', display: 'block', marginBottom: '0.375rem' }}>
              Tipo de entidad
            </label>
            <select value={entityFilter} onChange={(e) => setEntityFilter(e.target.value)} style={{ ...selectStyle, minWidth: 160 }}>
              {ENTITY_TYPES.map((et) => (
                <option key={et.value} value={et.value}>{et.label}</option>
              ))}
            </select>
          </div>
          <div>
            <label style={{ fontFamily: 'var(--font-body)', fontSize: '0.75rem', fontWeight: 600, color: 'var(--color-text-secondary)', display: 'block', marginBottom: '0.375rem' }}>
              Desde
            </label>
            <input
              type="date"
              value={dateFrom}
              onChange={(e) => setDateFrom(e.target.value)}
              style={inputStyle}
            />
          </div>
          <div>
            <label style={{ fontFamily: 'var(--font-body)', fontSize: '0.75rem', fontWeight: 600, color: 'var(--color-text-secondary)', display: 'block', marginBottom: '0.375rem' }}>
              Hasta
            </label>
            <input
              type="date"
              value={dateTo}
              onChange={(e) => setDateTo(e.target.value)}
              style={inputStyle}
            />
          </div>
        </div>
      </motion.div>

      {/* Timeline */}
      <motion.div {...fadeUp} transition={{ ...fadeUp.transition, delay: 0.1 }} style={cardStyle}>
        {entries.length === 0 ? (
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: 200, textAlign: 'center', padding: '2rem' }}>
            <div style={{ width: 48, height: 48, borderRadius: '50%', background: 'var(--color-bg-muted)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '0.75rem' }}>
              <ScrollText size={20} color="var(--color-text-muted)" />
            </div>
            <p style={{ fontFamily: 'var(--font-body)', fontSize: '0.8125rem', color: 'var(--color-text-muted)' }}>
              No hay actividad registrada aún
            </p>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            {entries.map((entry, i) => {
              const { Icon, color } = getActionIcon(entry.action)
              return (
                <div
                  key={entry.id}
                  style={{
                    display: 'flex',
                    gap: '1rem',
                    padding: '1rem 0',
                    borderBottom: i < entries.length - 1 ? '1px solid var(--color-border)' : 'none',
                  }}
                >
                  {/* Timeline icon */}
                  <div style={{ flexShrink: 0, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                    <div
                      style={{
                        width: 36, height: 36, borderRadius: '50%',
                        background: `${color}14`,
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                      }}
                    >
                      <Icon size={16} color={color} />
                    </div>
                  </div>

                  {/* Content */}
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap', marginBottom: '0.25rem' }}>
                      <span style={{ fontFamily: 'var(--font-body)', fontSize: '0.8125rem', fontWeight: 600, color: 'var(--color-text-primary)' }}>
                        {entry.actor_name}
                      </span>
                      <span style={{ fontFamily: 'var(--font-body)', fontSize: '0.8125rem', color: 'var(--color-text-secondary)' }}>
                        {getActionDescription(entry)}
                      </span>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                      <span style={{
                        fontFamily: 'var(--font-body)', fontSize: '0.6875rem',
                        color: 'var(--color-text-muted)',
                        display: 'inline-flex', alignItems: 'center', gap: '0.25rem',
                      }}>
                        <Calendar size={10} />
                        {relativeTime(entry.created_at)}
                      </span>
                      <span style={{
                        padding: '0.125rem 0.5rem', borderRadius: 999,
                        fontSize: '0.625rem', fontWeight: 500, textTransform: 'uppercase', letterSpacing: '0.04em',
                        background: 'var(--color-bg-muted)', color: 'var(--color-text-muted)',
                        fontFamily: 'var(--font-body)',
                      }}>
                        {entry.entity_type}
                      </span>
                    </div>
                  </div>
                </div>
              )
            })}

            {/* Load more */}
            {hasMore && (
              <div style={{ display: 'flex', justifyContent: 'center', paddingTop: '1.25rem' }}>
                <button
                  onClick={handleLoadMore}
                  disabled={loadingMore}
                  style={{
                    display: 'inline-flex', alignItems: 'center', gap: '0.5rem',
                    padding: '0.375rem 0.75rem', borderRadius: 6,
                    border: '1px solid var(--color-border)', background: 'var(--color-bg-card)',
                    fontFamily: 'var(--font-body)', fontSize: '0.75rem', fontWeight: 500,
                    color: 'var(--color-text-primary)', cursor: 'pointer',
                    transition: 'all 0.15s ease',
                    opacity: loadingMore ? 0.6 : 1,
                  }}
                >
                  {loadingMore ? (
                    <>
                      <Loader2 size={14} style={{ animation: 'spin 1s linear infinite' }} />
                      Cargando...
                    </>
                  ) : (
                    <>
                      <ChevronDown size={14} />
                      Cargar mas
                    </>
                  )}
                </button>
              </div>
            )}
          </div>
        )}
      </motion.div>

    </motion.div>
  )
}
