'use client'

import { useEffect, useMemo, useState } from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { ArrowLeft, LineChart, TrendingUp, TrendingDown, Minus, Save, Calendar } from 'lucide-react'
import { supabase } from '@/lib/supabase'

interface KpiRow {
  id: string
  startup_id: string
  week_start: string // YYYY-MM-DD
  mrr: number | null
  customers: number | null
  active_users: number | null
  runway_months: number | null
  notes: string | null
  created_at: string
}

/** ISO Monday of the given date (YYYY-MM-DD) */
function mondayOf(date: Date): string {
  const d = new Date(date)
  d.setHours(0, 0, 0, 0)
  const day = d.getDay() // 0 sun .. 6 sat
  const diff = (day === 0 ? -6 : 1 - day)
  d.setDate(d.getDate() + diff)
  return d.toISOString().slice(0, 10)
}

function formatWeek(iso: string): string {
  const d = new Date(iso + 'T00:00:00')
  const end = new Date(d)
  end.setDate(d.getDate() + 6)
  return `${d.toLocaleDateString('es', { day: '2-digit', month: 'short' })} – ${end.toLocaleDateString('es', { day: '2-digit', month: 'short', year: 'numeric' })}`
}

function delta(current: number | null, previous: number | null): { pct: number | null; dir: 'up' | 'down' | 'flat' | 'none' } {
  if (current == null || previous == null) return { pct: null, dir: 'none' }
  if (previous === 0) return { pct: null, dir: current > 0 ? 'up' : 'flat' }
  const pct = ((current - previous) / previous) * 100
  if (Math.abs(pct) < 0.5) return { pct, dir: 'flat' }
  return { pct, dir: pct > 0 ? 'up' : 'down' }
}

function DeltaBadge({ current, previous }: { current: number | null; previous: number | null }) {
  const { pct, dir } = delta(current, previous)
  if (dir === 'none' || pct == null) return null
  const Icon = dir === 'up' ? TrendingUp : dir === 'down' ? TrendingDown : Minus
  const color = dir === 'up' ? '#0D9488' : dir === 'down' ? '#EF4444' : 'var(--color-text-muted)'
  return (
    <span style={{
      display: 'inline-flex', alignItems: 'center', gap: 4,
      fontFamily: 'var(--font-body)', fontSize: '0.7rem', fontWeight: 600, color,
    }}>
      <Icon size={11} /> {pct > 0 ? '+' : ''}{pct.toFixed(1)}%
    </span>
  )
}

const card: React.CSSProperties = {
  background: 'var(--color-bg-card)',
  border: '1px solid var(--color-border)',
  borderRadius: 12,
  padding: '1.25rem',
}

const inputStyle: React.CSSProperties = {
  width: '100%',
  padding: '0.55rem 0.75rem',
  borderRadius: 8,
  border: '1px solid var(--color-border)',
  background: 'var(--color-bg-primary)',
  fontFamily: 'var(--font-body)',
  fontSize: '0.9rem',
  color: 'var(--color-text-primary)',
}

const labelStyle: React.CSSProperties = {
  display: 'block',
  fontFamily: 'var(--font-body)',
  fontSize: '0.7rem',
  textTransform: 'uppercase',
  letterSpacing: '0.05em',
  color: 'var(--color-text-muted)',
  fontWeight: 600,
  marginBottom: 4,
}

export default function KpisPage() {
  const [startupId, setStartupId] = useState<string | null>(null)
  const [rows, setRows] = useState<KpiRow[]>([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [message, setMessage] = useState<{ kind: 'ok' | 'err'; text: string } | null>(null)

  const [weekStart, setWeekStart] = useState(mondayOf(new Date()))
  const [mrr, setMrr] = useState('')
  const [customers, setCustomers] = useState('')
  const [activeUsers, setActiveUsers] = useState('')
  const [runway, setRunway] = useState('')
  const [notes, setNotes] = useState('')

  useEffect(() => {
    async function load() {
      const { data: userRes } = await supabase.auth.getUser()
      const uid = userRes.user?.id
      if (!uid) { setLoading(false); return }
      const { data: startup } = await supabase
        .from('startups').select('id').eq('founder_id', uid).maybeSingle()
      if (!startup) { setLoading(false); return }
      setStartupId(startup.id)
      const { data: kpis } = await supabase
        .from('weekly_kpis')
        .select('id,startup_id,week_start,mrr,customers,active_users,runway_months,notes,created_at')
        .eq('startup_id', startup.id)
        .order('week_start', { ascending: false })
        .limit(12)
      setRows((kpis as KpiRow[]) || [])
      setLoading(false)
    }
    load()
  }, [])

  const sortedAsc = useMemo(() => [...rows].sort((a, b) => a.week_start.localeCompare(b.week_start)), [rows])
  const latest = sortedAsc[sortedAsc.length - 1] || null
  const previous = sortedAsc[sortedAsc.length - 2] || null

  // Tiny SVG sparkline for MRR
  const sparkline = useMemo(() => {
    const series = sortedAsc.map((r) => r.mrr ?? 0)
    if (series.length < 2) return null
    const w = 220, h = 50, pad = 4
    const max = Math.max(...series, 1)
    const min = Math.min(...series, 0)
    const range = max - min || 1
    const points = series.map((v, i) => {
      const x = pad + (i / (series.length - 1)) * (w - pad * 2)
      const y = h - pad - ((v - min) / range) * (h - pad * 2)
      return `${x.toFixed(1)},${y.toFixed(1)}`
    }).join(' ')
    return { points, w, h }
  }, [sortedAsc])

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!startupId) {
      setMessage({ kind: 'err', text: 'Necesitas una startup registrada para guardar KPIs.' })
      return
    }
    setSaving(true)
    setMessage(null)
    const payload = {
      startup_id: startupId,
      week_start: weekStart,
      mrr: mrr === '' ? null : Number(mrr),
      customers: customers === '' ? null : Number(customers),
      active_users: activeUsers === '' ? null : Number(activeUsers),
      runway_months: runway === '' ? null : Number(runway),
      notes: notes || null,
      updated_at: new Date().toISOString(),
    }
    const { error } = await supabase
      .from('weekly_kpis')
      .upsert(payload, { onConflict: 'startup_id,week_start' })
    setSaving(false)
    if (error) {
      console.error('[S4C KPI]', error)
      setMessage({ kind: 'err', text: 'Error guardando. Reintenta.' })
      return
    }
    setMessage({ kind: 'ok', text: 'KPIs guardados.' })
    // Refresh history
    const { data: kpis } = await supabase
      .from('weekly_kpis')
      .select('id,startup_id,week_start,mrr,customers,active_users,runway_months,notes,created_at')
      .eq('startup_id', startupId)
      .order('week_start', { ascending: false })
      .limit(12)
    setRows((kpis as KpiRow[]) || [])
  }

  return (
    <div style={{ padding: '2rem', maxWidth: 960, margin: '0 auto' }}>
      <Link
        href="/tools"
        style={{
          display: 'inline-flex', alignItems: 'center', gap: '0.375rem',
          fontFamily: 'var(--font-body)', fontSize: 'var(--text-sm)',
          color: 'var(--color-text-muted)', textDecoration: 'none', marginBottom: '1.5rem',
        }}
      >
        <ArrowLeft size={14} /> Volver al dashboard
      </Link>

      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: 'easeOut' }}
        style={{ marginBottom: '2rem' }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <div
            style={{
              width: 40, height: 40, borderRadius: 12,
              background: 'rgba(99,102,241,0.08)', border: '1px solid rgba(99,102,241,0.2)',
              display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
            }}
          >
            <LineChart size={20} color="#6366F1" />
          </div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <h1 style={{ fontFamily: 'var(--font-heading)', fontSize: 'var(--text-xl)', fontWeight: 700, color: 'var(--color-ink)', letterSpacing: '-0.02em', lineHeight: 1.3, margin: 0 }}>
              KPIs semanales
            </h1>
            <p style={{ fontFamily: 'var(--font-body)', fontSize: 'var(--text-sm)', color: 'var(--color-text-secondary)', lineHeight: 1.5, margin: 0 }}>
              Registra tus métricas cada semana y revisa tu trayectoria. Tu organización podrá ver tu progreso.
            </p>
          </div>
        </div>
      </motion.div>

      {/* Snapshot */}
      <div
        style={{
          display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))',
          gap: '0.75rem', marginBottom: '1rem',
        }}
      >
        {[
          { label: 'MRR (USD)', cur: latest?.mrr ?? null, prev: previous?.mrr ?? null, fmt: (v: number) => `$${v.toLocaleString('es')}` },
          { label: 'Clientes', cur: latest?.customers ?? null, prev: previous?.customers ?? null, fmt: (v: number) => v.toLocaleString('es') },
          { label: 'Usuarios activos', cur: latest?.active_users ?? null, prev: previous?.active_users ?? null, fmt: (v: number) => v.toLocaleString('es') },
          { label: 'Runway (meses)', cur: latest?.runway_months ?? null, prev: previous?.runway_months ?? null, fmt: (v: number) => v.toFixed(1) },
        ].map((k) => (
          <div key={k.label} style={card}>
            <div style={labelStyle}>{k.label}</div>
            <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', gap: 6 }}>
              <span style={{ fontFamily: 'var(--font-heading)', fontSize: '1.25rem', fontWeight: 700, color: 'var(--color-text-primary)' }}>
                {k.cur != null ? k.fmt(k.cur) : '—'}
              </span>
              <DeltaBadge current={k.cur} previous={k.prev} />
            </div>
          </div>
        ))}
      </div>

      {/* Sparkline */}
      {sparkline && (
        <div style={{ ...card, marginBottom: '1rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 }}>
            <span style={{ fontFamily: 'var(--font-body)', fontSize: '0.8rem', fontWeight: 600, color: 'var(--color-text-secondary)' }}>
              Trayectoria MRR (últimas {sortedAsc.length} semanas)
            </span>
          </div>
          <svg width="100%" height={sparkline.h} viewBox={`0 0 ${sparkline.w} ${sparkline.h}`} preserveAspectRatio="none">
            <polyline
              fill="none"
              stroke="#6366F1"
              strokeWidth={2}
              points={sparkline.points}
            />
          </svg>
        </div>
      )}

      {/* Form */}
      <form onSubmit={handleSubmit} style={{ ...card, marginBottom: '1rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12 }}>
          <Calendar size={16} color="var(--color-text-muted)" />
          <h2 style={{ fontFamily: 'var(--font-heading)', fontSize: '1rem', fontWeight: 600, color: 'var(--color-text-primary)', margin: 0 }}>
            Registrar semana
          </h2>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: '0.75rem' }}>
          <div>
            <label style={labelStyle}>Inicio de semana (lunes)</label>
            <input type="date" value={weekStart} onChange={(e) => setWeekStart(e.target.value)} style={inputStyle} required />
          </div>
          <div>
            <label style={labelStyle}>MRR (USD)</label>
            <input type="number" step="0.01" min="0" value={mrr} onChange={(e) => setMrr(e.target.value)} style={inputStyle} placeholder="0" />
          </div>
          <div>
            <label style={labelStyle}>Clientes</label>
            <input type="number" min="0" value={customers} onChange={(e) => setCustomers(e.target.value)} style={inputStyle} placeholder="0" />
          </div>
          <div>
            <label style={labelStyle}>Usuarios activos</label>
            <input type="number" min="0" value={activeUsers} onChange={(e) => setActiveUsers(e.target.value)} style={inputStyle} placeholder="0" />
          </div>
          <div>
            <label style={labelStyle}>Runway (meses)</label>
            <input type="number" step="0.1" min="0" value={runway} onChange={(e) => setRunway(e.target.value)} style={inputStyle} placeholder="0" />
          </div>
        </div>

        <div style={{ marginTop: 12 }}>
          <label style={labelStyle}>Notas de la semana (opcional)</label>
          <textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            rows={3}
            style={{ ...inputStyle, resize: 'vertical', fontFamily: 'var(--font-body)' }}
            placeholder="Wins, bloqueos, próximos pasos…"
          />
        </div>

        {message && (
          <div
            style={{
              marginTop: 12, padding: '0.6rem 0.9rem', borderRadius: 8,
              background: message.kind === 'ok' ? 'rgba(13,148,136,0.08)' : 'rgba(220,38,38,0.08)',
              border: `1px solid ${message.kind === 'ok' ? 'rgba(13,148,136,0.2)' : 'rgba(220,38,38,0.2)'}`,
              fontFamily: 'var(--font-body)', fontSize: '0.85rem',
              color: message.kind === 'ok' ? '#0D9488' : '#DC2626',
            }}
          >
            {message.text}
          </div>
        )}

        <div style={{ marginTop: 12, display: 'flex', justifyContent: 'flex-end' }}>
          <button
            type="submit"
            disabled={saving || !startupId}
            style={{
              display: 'inline-flex', alignItems: 'center', gap: 6,
              padding: '0.6rem 1.1rem', borderRadius: 8,
              background: saving ? 'var(--color-bg-muted)' : '#6366F1',
              color: '#fff', border: 'none',
              fontFamily: 'var(--font-body)', fontSize: '0.875rem', fontWeight: 600,
              cursor: saving ? 'wait' : 'pointer',
              opacity: !startupId ? 0.5 : 1,
            }}
          >
            <Save size={14} /> {saving ? 'Guardando…' : 'Guardar semana'}
          </button>
        </div>
      </form>

      {/* History */}
      <div style={card}>
        <h2 style={{ fontFamily: 'var(--font-heading)', fontSize: '1rem', fontWeight: 600, color: 'var(--color-text-primary)', margin: '0 0 12px 0' }}>
          Historial reciente
        </h2>
        {loading ? (
          <p style={{ fontFamily: 'var(--font-body)', fontSize: '0.875rem', color: 'var(--color-text-muted)', margin: 0 }}>Cargando…</p>
        ) : rows.length === 0 ? (
          <p style={{ fontFamily: 'var(--font-body)', fontSize: '0.875rem', color: 'var(--color-text-muted)', margin: 0 }}>
            Aún no has registrado KPIs. Empieza esta semana.
          </p>
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontFamily: 'var(--font-body)', fontSize: '0.85rem' }}>
              <thead>
                <tr style={{ textAlign: 'left', color: 'var(--color-text-muted)', borderBottom: '1px solid var(--color-border)' }}>
                  <th style={{ padding: '0.5rem 0.75rem', fontWeight: 600 }}>Semana</th>
                  <th style={{ padding: '0.5rem 0.75rem', fontWeight: 600, textAlign: 'right' }}>MRR</th>
                  <th style={{ padding: '0.5rem 0.75rem', fontWeight: 600, textAlign: 'right' }}>Clientes</th>
                  <th style={{ padding: '0.5rem 0.75rem', fontWeight: 600, textAlign: 'right' }}>Usuarios</th>
                  <th style={{ padding: '0.5rem 0.75rem', fontWeight: 600, textAlign: 'right' }}>Runway</th>
                </tr>
              </thead>
              <tbody>
                {rows.map((r) => (
                  <tr key={r.id} style={{ borderBottom: '1px solid var(--color-border)' }}>
                    <td style={{ padding: '0.5rem 0.75rem', color: 'var(--color-text-secondary)' }}>{formatWeek(r.week_start)}</td>
                    <td style={{ padding: '0.5rem 0.75rem', textAlign: 'right', color: 'var(--color-text-primary)' }}>{r.mrr != null ? `$${Number(r.mrr).toLocaleString('es')}` : '—'}</td>
                    <td style={{ padding: '0.5rem 0.75rem', textAlign: 'right', color: 'var(--color-text-primary)' }}>{r.customers ?? '—'}</td>
                    <td style={{ padding: '0.5rem 0.75rem', textAlign: 'right', color: 'var(--color-text-primary)' }}>{r.active_users ?? '—'}</td>
                    <td style={{ padding: '0.5rem 0.75rem', textAlign: 'right', color: 'var(--color-text-primary)' }}>{r.runway_months != null ? `${Number(r.runway_months).toFixed(1)}` : '—'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}
