'use client'

import React, { useState, useEffect, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  LifeBuoy, Plus, Search, ChevronDown, ChevronUp,
  Send, X, AlertCircle, Clock, CheckCircle2, XCircle,
  MessageSquare, Lock,
} from 'lucide-react'
import { useAuth } from '@/context/AuthContext'
import { supabase } from '@/lib/supabase'

interface Ticket {
  id: string
  title: string
  description: string
  status: 'open' | 'in_progress' | 'resolved' | 'closed'
  priority: 'low' | 'medium' | 'high' | 'critical'
  category: string
  reporter_id: string
  org_id: string | null
  created_at: string
  reporter_name?: string
  org_name?: string
}

interface TicketMessage {
  id: string
  ticket_id: string
  author_id: string
  content: string
  is_internal: boolean
  created_at: string
  author_name?: string
}

interface Organization {
  id: string
  name: string
}

const STATUS_CONFIG: Record<string, { bg: string; text: string; label: string }> = {
  open: { bg: 'rgba(59,130,246,0.1)', text: '#3B82F6', label: 'Abierto' },
  in_progress: { bg: 'rgba(234,179,8,0.1)', text: '#CA8A04', label: 'En progreso' },
  resolved: { bg: 'rgba(34,197,94,0.1)', text: '#16A34A', label: 'Resuelto' },
  closed: { bg: 'rgba(107,114,128,0.1)', text: '#6B7280', label: 'Cerrado' },
}

const PRIORITY_CONFIG: Record<string, { bg: string; text: string; label: string }> = {
  low: { bg: 'rgba(107,114,128,0.1)', text: '#6B7280', label: 'Baja' },
  medium: { bg: 'rgba(59,130,246,0.1)', text: '#3B82F6', label: 'Media' },
  high: { bg: 'rgba(249,115,22,0.1)', text: '#EA580C', label: 'Alta' },
  critical: { bg: 'rgba(239,68,68,0.1)', text: '#DC2626', label: 'Critica' },
}

const CATEGORIES = [
  { value: 'account', label: 'Cuenta' },
  { value: 'billing', label: 'Facturación' },
  { value: 'bug', label: 'Bug' },
  { value: 'feature_request', label: 'Solicitud de funcionalidad' },
  { value: 'other', label: 'Otro' },
]

const cardStyle: React.CSSProperties = {
  background: 'var(--color-bg-card)',
  border: '1px solid var(--color-border)',
  borderRadius: 'var(--radius-md)',
  padding: '1.5rem',
  boxShadow: 'var(--shadow-card)',
}

const inputStyle: React.CSSProperties = {
  width: '100%',
  padding: '0.625rem 0.75rem',
  borderRadius: 'var(--radius-md)',
  border: '1px solid var(--color-border)',
  background: 'var(--color-bg-card)',
  fontFamily: 'var(--font-body)',
  fontSize: '0.8125rem',
  color: 'var(--color-text-primary)',
  outline: 'none',
}

const selectStyle: React.CSSProperties = {
  ...inputStyle,
  cursor: 'pointer',
  appearance: 'none' as const,
  backgroundImage: 'url("data:image/svg+xml,%3Csvg xmlns=\'http://www.w3.org/2000/svg\' width=\'12\' height=\'12\' viewBox=\'0 0 24 24\' fill=\'none\' stroke=\'%236B7280\' stroke-width=\'2\'%3E%3Cpath d=\'M6 9l6 6 6-6\'/%3E%3C/svg%3E")',
  backgroundRepeat: 'no-repeat',
  backgroundPosition: 'right 0.75rem center',
  paddingRight: '2rem',
}

const btnPrimary: React.CSSProperties = {
  display: 'inline-flex',
  alignItems: 'center',
  gap: '0.5rem',
  padding: '0.5rem 1rem',
  borderRadius: 8,
  border: 'none',
  background: 'var(--color-accent-primary)',
  color: '#fff',
  fontFamily: 'var(--font-body)',
  fontSize: '0.8125rem',
  fontWeight: 600,
  cursor: 'pointer',
  transition: 'opacity 0.15s',
}

const fadeUp = {
  initial: { opacity: 0, y: 16 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.4, ease: 'easeOut' as const },
}

export default function IncidenciasPage() {
  const { appUser } = useAuth()
  const [tickets, setTickets] = useState<Ticket[]>([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [expandedId, setExpandedId] = useState<string | null>(null)
  const [messages, setMessages] = useState<TicketMessage[]>([])
  const [loadingMessages, setLoadingMessages] = useState(false)
  const [orgs, setOrgs] = useState<Organization[]>([])

  // Filters
  const [filterStatus, setFilterStatus] = useState('all')
  const [filterPriority, setFilterPriority] = useState('all')
  const [search, setSearch] = useState('')

  // New ticket form
  const [newTitle, setNewTitle] = useState('')
  const [newDesc, setNewDesc] = useState('')
  const [newPriority, setNewPriority] = useState('medium')
  const [newCategory, setNewCategory] = useState('other')
  const [newOrgId, setNewOrgId] = useState('')
  const [submitting, setSubmitting] = useState(false)

  // Message form
  const [newMessage, setNewMessage] = useState('')
  const [isInternal, setIsInternal] = useState(false)
  const [sendingMessage, setSendingMessage] = useState(false)

  // Status update
  const [statusUpdate, setStatusUpdate] = useState('')
  const [savingStatus, setSavingStatus] = useState(false)

  const isSuperadmin = appUser?.role === 'superadmin'

  const loadTickets = useCallback(async () => {
    const { data: ticketData } = await supabase
      .from('support_tickets')
      .select('*')
      .order('created_at', { ascending: false })

    if (!ticketData) {
      setTickets([])
      setLoading(false)
      return
    }

    // Get reporter profiles
    const reporterIds = [...new Set(ticketData.map((t) => t.reporter_id).filter(Boolean))]
    const orgIds = [...new Set(ticketData.map((t) => t.org_id).filter(Boolean))]

    let profileMap: Record<string, string> = {}
    if (reporterIds.length > 0) {
      const { data: profiles } = await supabase
        .from('profiles')
        .select('id, full_name')
        .in('id', reporterIds)
      if (profiles) {
        profileMap = Object.fromEntries(profiles.map((p) => [p.id, p.full_name || 'Sin nombre']))
      }
    }

    let orgMap: Record<string, string> = {}
    if (orgIds.length > 0) {
      const { data: orgData } = await supabase
        .from('organizations')
        .select('id, name')
        .in('id', orgIds)
      if (orgData) {
        orgMap = Object.fromEntries(orgData.map((o) => [o.id, o.name]))
      }
    }

    setTickets(
      ticketData.map((t) => ({
        ...t,
        reporter_name: profileMap[t.reporter_id] || 'Desconocido',
        org_name: t.org_id ? orgMap[t.org_id] || '-' : '-',
      }))
    )
    setLoading(false)
  }, [])

  useEffect(() => {
    if (!isSuperadmin) return
    loadTickets()

    // Load organizations for the form
    supabase
      .from('organizations')
      .select('id, name')
      .order('name')
      .then(({ data }) => {
        if (data) setOrgs(data)
      })
  }, [isSuperadmin, loadTickets])

  const loadMessages = useCallback(async (ticketId: string) => {
    setLoadingMessages(true)
    const { data } = await supabase
      .from('ticket_messages')
      .select('*')
      .eq('ticket_id', ticketId)
      .order('created_at', { ascending: true })

    if (data && data.length > 0) {
      const authorIds = [...new Set(data.map((m) => m.author_id).filter(Boolean))]
      let authorMap: Record<string, string> = {}
      if (authorIds.length > 0) {
        const { data: profiles } = await supabase
          .from('profiles')
          .select('id, full_name')
          .in('id', authorIds)
        if (profiles) {
          authorMap = Object.fromEntries(profiles.map((p) => [p.id, p.full_name || 'Sin nombre']))
        }
      }
      setMessages(
        data.map((m) => ({
          ...m,
          author_name: authorMap[m.author_id] || 'Desconocido',
        }))
      )
    } else {
      setMessages([])
    }
    setLoadingMessages(false)
  }, [])

  const handleExpand = (ticket: Ticket) => {
    if (expandedId === ticket.id) {
      setExpandedId(null)
      setMessages([])
      return
    }
    setExpandedId(ticket.id)
    setStatusUpdate(ticket.status)
    setNewMessage('')
    setIsInternal(false)
    loadMessages(ticket.id)
  }

  const handleSubmitTicket = async () => {
    if (!newTitle.trim() || !appUser) return
    setSubmitting(true)

    const { error } = await supabase.from('support_tickets').insert({
      title: newTitle.trim(),
      description: newDesc.trim(),
      priority: newPriority,
      category: newCategory,
      org_id: newOrgId || null,
      reporter_id: appUser.id,
      status: 'open',
    })

    if (!error) {
      setNewTitle('')
      setNewDesc('')
      setNewPriority('medium')
      setNewCategory('other')
      setNewOrgId('')
      setShowForm(false)
      loadTickets()
    }
    setSubmitting(false)
  }

  const handleStatusSave = async (ticketId: string) => {
    setSavingStatus(true)
    await supabase
      .from('support_tickets')
      .update({ status: statusUpdate })
      .eq('id', ticketId)
    await loadTickets()
    setSavingStatus(false)
  }

  const handleSendMessage = async (ticketId: string) => {
    if (!newMessage.trim() || !appUser) return
    setSendingMessage(true)

    const { error } = await supabase.from('ticket_messages').insert({
      ticket_id: ticketId,
      author_id: appUser.id,
      content: newMessage.trim(),
      is_internal: isInternal,
    })

    if (!error) {
      setNewMessage('')
      setIsInternal(false)
      loadMessages(ticketId)
    }
    setSendingMessage(false)
  }

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString('es-CL', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    })
  }

  const filtered = tickets.filter((t) => {
    if (filterStatus !== 'all' && t.status !== filterStatus) return false
    if (filterPriority !== 'all' && t.priority !== filterPriority) return false
    if (search) {
      const q = search.toLowerCase()
      return (
        t.title.toLowerCase().includes(q) ||
        (t.reporter_name || '').toLowerCase().includes(q) ||
        (t.org_name || '').toLowerCase().includes(q)
      )
    }
    return true
  })

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
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.25rem' }}>
            <LifeBuoy size={20} color="#0D9488" />
            <h1 style={{ fontFamily: 'var(--font-heading)', fontWeight: 700, fontSize: '1.25rem', color: 'var(--color-text-primary)' }}>
              Incidencias
            </h1>
          </div>
          <p style={{ fontFamily: 'var(--font-body)', fontSize: '0.8125rem', color: 'var(--color-text-secondary)' }}>
            Gestiona tickets de soporte y reportes de problemas
          </p>
        </div>
        <button
          onClick={() => setShowForm(!showForm)}
          style={btnPrimary}
        >
          {showForm ? <X size={16} /> : <Plus size={16} />}
          {showForm ? 'Cancelar' : 'Nueva incidencia'}
        </button>
      </div>

      {/* New ticket form */}
      <AnimatePresence>
        {showForm && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            style={{ overflow: 'hidden', marginBottom: '1.5rem' }}
          >
            <div style={cardStyle}>
              <h3 style={{ fontFamily: 'var(--font-heading)', fontWeight: 600, fontSize: '0.9375rem', color: 'var(--color-text-primary)', marginBottom: '1rem' }}>
                Nueva incidencia
              </h3>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1rem' }}>
                <div style={{ gridColumn: '1 / -1' }}>
                  <label style={{ fontFamily: 'var(--font-body)', fontSize: '0.75rem', fontWeight: 600, color: 'var(--color-text-secondary)', display: 'block', marginBottom: '0.375rem' }}>
                    Título *
                  </label>
                  <input
                    type="text"
                    value={newTitle}
                    onChange={(e) => setNewTitle(e.target.value)}
                    placeholder="Describe brevemente el problema"
                    style={inputStyle}
                  />
                </div>
                <div style={{ gridColumn: '1 / -1' }}>
                  <label style={{ fontFamily: 'var(--font-body)', fontSize: '0.75rem', fontWeight: 600, color: 'var(--color-text-secondary)', display: 'block', marginBottom: '0.375rem' }}>
                    Descripción
                  </label>
                  <textarea
                    value={newDesc}
                    onChange={(e) => setNewDesc(e.target.value)}
                    placeholder="Detalla el problema, pasos para reproducir, etc."
                    rows={4}
                    style={{ ...inputStyle, resize: 'vertical' }}
                  />
                </div>
                <div>
                  <label style={{ fontFamily: 'var(--font-body)', fontSize: '0.75rem', fontWeight: 600, color: 'var(--color-text-secondary)', display: 'block', marginBottom: '0.375rem' }}>
                    Prioridad
                  </label>
                  <select value={newPriority} onChange={(e) => setNewPriority(e.target.value)} style={selectStyle}>
                    <option value="low">Baja</option>
                    <option value="medium">Media</option>
                    <option value="high">Alta</option>
                    <option value="critical">Critica</option>
                  </select>
                </div>
                <div>
                  <label style={{ fontFamily: 'var(--font-body)', fontSize: '0.75rem', fontWeight: 600, color: 'var(--color-text-secondary)', display: 'block', marginBottom: '0.375rem' }}>
                    Categoría
                  </label>
                  <select value={newCategory} onChange={(e) => setNewCategory(e.target.value)} style={selectStyle}>
                    {CATEGORIES.map((c) => (
                      <option key={c.value} value={c.value}>{c.label}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label style={{ fontFamily: 'var(--font-body)', fontSize: '0.75rem', fontWeight: 600, color: 'var(--color-text-secondary)', display: 'block', marginBottom: '0.375rem' }}>
                    Organización (opcional)
                  </label>
                  <select value={newOrgId} onChange={(e) => setNewOrgId(e.target.value)} style={selectStyle}>
                    <option value="">Sin organización</option>
                    {orgs.map((o) => (
                      <option key={o.id} value={o.id}>{o.name}</option>
                    ))}
                  </select>
                </div>
              </div>
              <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                <button
                  onClick={handleSubmitTicket}
                  disabled={!newTitle.trim() || submitting}
                  style={{ ...btnPrimary, opacity: !newTitle.trim() || submitting ? 0.5 : 1 }}
                >
                  <Send size={14} />
                  {submitting ? 'Creando...' : 'Crear incidencia'}
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Filters */}
      <motion.div {...fadeUp} style={{ ...cardStyle, marginBottom: '1.5rem' }}>
        <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', alignItems: 'center' }}>
          <div style={{ position: 'relative', flex: '1 1 200px' }}>
            <Search size={16} color="var(--color-text-secondary)" style={{ position: 'absolute', left: '0.75rem', top: '50%', transform: 'translateY(-50%)' }} />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Buscar por título, reportador u organización..."
              style={{ ...inputStyle, paddingLeft: '2.25rem' }}
            />
          </div>
          <div style={{ flex: '0 0 auto' }}>
            <select value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)} style={{ ...selectStyle, width: 'auto', minWidth: 140 }}>
              <option value="all">Todos los estados</option>
              <option value="open">Abierto</option>
              <option value="in_progress">En progreso</option>
              <option value="resolved">Resuelto</option>
              <option value="closed">Cerrado</option>
            </select>
          </div>
          <div style={{ flex: '0 0 auto' }}>
            <select value={filterPriority} onChange={(e) => setFilterPriority(e.target.value)} style={{ ...selectStyle, width: 'auto', minWidth: 140 }}>
              <option value="all">Todas las prioridades</option>
              <option value="low">Baja</option>
              <option value="medium">Media</option>
              <option value="high">Alta</option>
              <option value="critical">Critica</option>
            </select>
          </div>
        </div>
      </motion.div>

      {/* Tickets table */}
      <motion.div {...fadeUp} transition={{ ...fadeUp.transition, delay: 0.1 }} style={cardStyle}>
        {filtered.length === 0 ? (
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: 200, textAlign: 'center', padding: '2rem' }}>
            <div style={{ width: 48, height: 48, borderRadius: '50%', background: 'var(--color-bg-muted)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '0.75rem' }}>
              <LifeBuoy size={20} color="var(--color-text-muted)" />
            </div>
            <p style={{ fontFamily: 'var(--font-body)', fontSize: '0.8125rem', color: 'var(--color-text-muted)', marginBottom: '0.25rem' }}>
              No hay incidencias registradas
            </p>
            <p style={{ fontFamily: 'var(--font-body)', fontSize: '0.75rem', color: 'var(--color-text-muted)' }}>
              Crea una nueva incidencia para empezar a gestionar reportes
            </p>
          </div>
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontFamily: 'var(--font-body)', fontSize: '0.8125rem' }}>
              <thead>
                <tr>
                  {['Título', 'Reportado por', 'Organización', 'Prioridad', 'Estado', 'Fecha'].map((header) => (
                    <th
                      key={header}
                      style={{
                        textAlign: 'left', padding: '0.625rem 0.75rem',
                        borderBottom: '1px solid var(--color-border)',
                        fontWeight: 600, color: 'var(--color-text-secondary)',
                        fontSize: '0.6875rem', textTransform: 'uppercase', letterSpacing: '0.04em',
                      }}
                    >
                      {header}
                    </th>
                  ))}
                  <th style={{ width: 40, borderBottom: '1px solid var(--color-border)' }} />
                </tr>
              </thead>
              <tbody>
                {filtered.map((ticket) => {
                  const statusCfg = STATUS_CONFIG[ticket.status] || STATUS_CONFIG.open
                  const priorityCfg = PRIORITY_CONFIG[ticket.priority] || PRIORITY_CONFIG.medium
                  const isExpanded = expandedId === ticket.id

                  return (
                    <React.Fragment key={ticket.id}>
                      <tr
                        onClick={() => handleExpand(ticket)}
                        style={{ borderBottom: isExpanded ? 'none' : '1px solid var(--color-border)', cursor: 'pointer', transition: 'background 0.1s' }}
                        onMouseEnter={(e) => { e.currentTarget.style.background = 'var(--color-bg-muted)' }}
                        onMouseLeave={(e) => { e.currentTarget.style.background = 'transparent' }}
                      >
                        <td style={{ padding: '0.75rem', fontWeight: 600, color: 'var(--color-text-primary)', maxWidth: 300 }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                            {ticket.priority === 'critical' && <AlertCircle size={14} color="#DC2626" />}
                            {ticket.priority === 'high' && <AlertCircle size={14} color="#EA580C" />}
                            <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{ticket.title}</span>
                          </div>
                        </td>
                        <td style={{ padding: '0.75rem', color: 'var(--color-text-secondary)', whiteSpace: 'nowrap' }}>
                          {ticket.reporter_name}
                        </td>
                        <td style={{ padding: '0.75rem', color: 'var(--color-text-secondary)', whiteSpace: 'nowrap' }}>
                          {ticket.org_name}
                        </td>
                        <td style={{ padding: '0.75rem' }}>
                          <span style={{
                            padding: '0.1875rem 0.5rem', borderRadius: 999,
                            fontSize: '0.6875rem', fontWeight: 500,
                            background: priorityCfg.bg, color: priorityCfg.text,
                          }}>
                            {priorityCfg.label}
                          </span>
                        </td>
                        <td style={{ padding: '0.75rem' }}>
                          <span style={{
                            display: 'inline-flex', alignItems: 'center', gap: '0.25rem',
                            padding: '0.1875rem 0.5rem', borderRadius: 999,
                            fontSize: '0.6875rem', fontWeight: 500,
                            background: statusCfg.bg, color: statusCfg.text,
                          }}>
                            {ticket.status === 'open' && <Clock size={10} />}
                            {ticket.status === 'in_progress' && <Clock size={10} />}
                            {ticket.status === 'resolved' && <CheckCircle2 size={10} />}
                            {ticket.status === 'closed' && <XCircle size={10} />}
                            {statusCfg.label}
                          </span>
                        </td>
                        <td style={{ padding: '0.75rem', color: 'var(--color-text-secondary)', whiteSpace: 'nowrap', fontSize: '0.75rem' }}>
                          {formatDate(ticket.created_at)}
                        </td>
                        <td style={{ padding: '0.75rem', textAlign: 'center' }}>
                          {isExpanded ? <ChevronUp size={16} color="var(--color-text-muted)" /> : <ChevronDown size={16} color="var(--color-text-muted)" />}
                        </td>
                      </tr>

                      {/* Expanded detail */}
                      {isExpanded && (
                        <tr>
                          <td colSpan={7} style={{ padding: 0, borderBottom: '1px solid var(--color-border)' }}>
                            <motion.div
                              initial={{ opacity: 0, height: 0 }}
                              animate={{ opacity: 1, height: 'auto' }}
                              style={{ overflow: 'hidden', padding: '1rem 1.5rem 1.5rem', background: 'var(--color-bg-muted)' }}
                            >
                              {/* Description */}
                              {ticket.description && (
                                <div style={{ marginBottom: '1.25rem' }}>
                                  <h4 style={{ fontFamily: 'var(--font-heading)', fontSize: '0.8125rem', fontWeight: 600, color: 'var(--color-text-primary)', marginBottom: '0.5rem' }}>
                                    Descripción
                                  </h4>
                                  <p style={{ fontFamily: 'var(--font-body)', fontSize: '0.8125rem', color: 'var(--color-text-secondary)', lineHeight: 1.6, whiteSpace: 'pre-wrap' }}>
                                    {ticket.description}
                                  </p>
                                </div>
                              )}

                              {/* Status change */}
                              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.25rem' }}>
                                <label style={{ fontFamily: 'var(--font-body)', fontSize: '0.75rem', fontWeight: 600, color: 'var(--color-text-secondary)' }}>
                                  Cambiar estado:
                                </label>
                                <select
                                  value={statusUpdate}
                                  onChange={(e) => setStatusUpdate(e.target.value)}
                                  style={{ ...selectStyle, width: 'auto', minWidth: 160 }}
                                >
                                  <option value="open">Abierto</option>
                                  <option value="in_progress">En progreso</option>
                                  <option value="resolved">Resuelto</option>
                                  <option value="closed">Cerrado</option>
                                </select>
                                <button
                                  onClick={() => handleStatusSave(ticket.id)}
                                  disabled={savingStatus || statusUpdate === ticket.status}
                                  style={{
                                    ...btnPrimary,
                                    padding: '0.5rem 1rem',
                                    fontSize: '0.8125rem',
                                    opacity: savingStatus || statusUpdate === ticket.status ? 0.5 : 1,
                                  }}
                                >
                                  {savingStatus ? 'Guardando...' : 'Guardar'}
                                </button>
                              </div>

                              {/* Messages thread */}
                              <div>
                                <h4 style={{ fontFamily: 'var(--font-heading)', fontSize: '0.8125rem', fontWeight: 600, color: 'var(--color-text-primary)', marginBottom: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.375rem' }}>
                                  <MessageSquare size={14} />
                                  Mensajes
                                </h4>

                                {loadingMessages ? (
                                  <p style={{ fontFamily: 'var(--font-body)', fontSize: '0.8125rem', color: 'var(--color-text-muted)' }}>
                                    Cargando mensajes...
                                  </p>
                                ) : messages.length === 0 ? (
                                  <p style={{ fontFamily: 'var(--font-body)', fontSize: '0.8125rem', color: 'var(--color-text-muted)', marginBottom: '1rem' }}>
                                    No hay mensajes aún.
                                  </p>
                                ) : (
                                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.625rem', marginBottom: '1rem' }}>
                                    {messages.map((msg) => (
                                      <div
                                        key={msg.id}
                                        style={{
                                          padding: '0.75rem 1rem',
                                          borderRadius: 'var(--radius-md)',
                                          background: msg.is_internal ? 'rgba(234,179,8,0.06)' : 'var(--color-bg-card)',
                                          border: `1px solid ${msg.is_internal ? 'rgba(234,179,8,0.2)' : 'var(--color-border)'}`,
                                        }}
                                      >
                                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.375rem' }}>
                                          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                            <span style={{ fontFamily: 'var(--font-body)', fontSize: '0.75rem', fontWeight: 600, color: 'var(--color-text-primary)' }}>
                                              {msg.author_name}
                                            </span>
                                            {msg.is_internal && (
                                              <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.1875rem', fontFamily: 'var(--font-body)', fontSize: '0.625rem', color: '#CA8A04', fontWeight: 600 }}>
                                                <Lock size={9} />
                                                Nota interna
                                              </span>
                                            )}
                                          </div>
                                          <span style={{ fontFamily: 'var(--font-body)', fontSize: '0.6875rem', color: 'var(--color-text-muted)' }}>
                                            {formatDate(msg.created_at)}
                                          </span>
                                        </div>
                                        <p style={{ fontFamily: 'var(--font-body)', fontSize: '0.8125rem', color: 'var(--color-text-secondary)', lineHeight: 1.5, whiteSpace: 'pre-wrap' }}>
                                          {msg.content}
                                        </p>
                                      </div>
                                    ))}
                                  </div>
                                )}

                                {/* New message */}
                                <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'flex-end' }}>
                                  <div style={{ flex: 1 }}>
                                    <textarea
                                      value={newMessage}
                                      onChange={(e) => setNewMessage(e.target.value)}
                                      placeholder="Escribe un mensaje..."
                                      rows={2}
                                      style={{ ...inputStyle, resize: 'vertical' }}
                                    />
                                    <label style={{ display: 'flex', alignItems: 'center', gap: '0.375rem', marginTop: '0.5rem', cursor: 'pointer' }}>
                                      <input
                                        type="checkbox"
                                        checked={isInternal}
                                        onChange={(e) => setIsInternal(e.target.checked)}
                                        style={{ accentColor: '#CA8A04' }}
                                      />
                                      <span style={{ fontFamily: 'var(--font-body)', fontSize: '0.75rem', color: 'var(--color-text-secondary)' }}>
                                        Nota interna
                                      </span>
                                    </label>
                                  </div>
                                  <button
                                    onClick={() => handleSendMessage(ticket.id)}
                                    disabled={!newMessage.trim() || sendingMessage}
                                    style={{
                                      ...btnPrimary,
                                      padding: '0.625rem',
                                      opacity: !newMessage.trim() || sendingMessage ? 0.5 : 1,
                                    }}
                                  >
                                    <Send size={16} />
                                  </button>
                                </div>
                              </div>
                            </motion.div>
                          </td>
                        </tr>
                      )}
                    </React.Fragment>
                  )
                })}
              </tbody>
            </table>
          </div>
        )}
      </motion.div>
    </motion.div>
  )
}

