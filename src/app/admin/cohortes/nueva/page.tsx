'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import {
  ChevronLeft,
  Plus,
  Trash2,
  Save,
} from 'lucide-react'
import Link from 'next/link'
import { supabase } from '@/lib/supabase'

interface Milestone {
  id: string
  name: string
  stage: string
  deadline: string
}

const STAGES = [
  { value: 'pre_incubation', label: 'Pre-incubación' },
  { value: 'incubation', label: 'Incubación' },
  { value: 'acceleration', label: 'Aceleración' },
  { value: 'scaling', label: 'Escalamiento' },
]

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
  transition: 'border-color 0.15s',
}

const labelStyle: React.CSSProperties = {
  fontFamily: 'var(--font-body)',
  fontSize: '0.8125rem',
  fontWeight: 600,
  color: 'var(--color-text-primary)',
  marginBottom: '0.375rem',
  display: 'block',
}

const cardStyle: React.CSSProperties = {
  background: 'var(--color-bg-card)',
  border: '1px solid var(--color-border)',
  borderRadius: 'var(--radius-md)',
  padding: '1.5rem',
  boxShadow: 'var(--shadow-card)',
}

export default function NuevaCohorte() {
  const router = useRouter()
  const [saving, setSaving] = useState(false)
  const [name, setName] = useState('')
  const [description, setDescription] = useState('')
  const [startDate, setStartDate] = useState('')
  const [endDate, setEndDate] = useState('')
  const [milestones, setMilestones] = useState<Milestone[]>([])

  const addMilestone = () => {
    setMilestones((prev) => [
      ...prev,
      { id: crypto.randomUUID(), name: '', stage: 'pre_incubation', deadline: '' },
    ])
  }

  const updateMilestone = (id: string, field: keyof Milestone, value: string) => {
    setMilestones((prev) =>
      prev.map((m) => (m.id === id ? { ...m, [field]: value } : m))
    )
  }

  const removeMilestone = (id: string) => {
    setMilestones((prev) => prev.filter((m) => m.id !== id))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!name.trim() || !startDate || !endDate) return

    setSaving(true)
    try {
      const { error } = await supabase.from('cohorts').insert({
        name: name.trim(),
        description: description.trim(),
        start_date: startDate,
        end_date: endDate,
        milestones: milestones
          .filter((m) => m.name.trim())
          .map(({ name, stage, deadline }) => ({ name, stage, deadline })),
        status: 'planned',
      })

      if (!error) {
        router.push('/admin/cohortes')
      }
    } catch {
      // handle silently for now
    } finally {
      setSaving(false)
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: 'easeOut' }}
      style={{ padding: '2rem 1.5rem', maxWidth: 720, margin: '0 auto' }}
    >
      {/* Back link */}
      <Link
        href="/admin/cohortes"
        style={{
          display: 'inline-flex', alignItems: 'center', gap: '0.375rem',
          fontFamily: 'var(--font-body)', fontSize: '0.8125rem',
          color: 'var(--color-text-secondary)', textDecoration: 'none',
          marginBottom: '1.5rem', transition: 'color 0.15s',
        }}
        onMouseEnter={(e) => (e.currentTarget.style.color = 'var(--color-accent-primary)')}
        onMouseLeave={(e) => (e.currentTarget.style.color = 'var(--color-text-secondary)')}
      >
        <ChevronLeft size={16} />
        Volver a cohortes
      </Link>

      <h1 style={{
        fontFamily: 'var(--font-heading)', fontWeight: 700,
        fontSize: '1.5rem', color: 'var(--color-text-primary)',
        marginBottom: '0.25rem',
      }}>
        Crear nueva cohorte
      </h1>
      <p style={{
        fontFamily: 'var(--font-body)', fontSize: '0.875rem',
        color: 'var(--color-text-secondary)', marginBottom: '2rem',
      }}>
        Define los datos de tu nueva cohorte y sus hitos
      </p>

      <form onSubmit={handleSubmit}>
        {/* Basic info */}
        <div style={{ ...cardStyle, marginBottom: '1.5rem' }}>
          <h2 style={{
            fontFamily: 'var(--font-heading)', fontWeight: 600,
            fontSize: '1.0625rem', color: 'var(--color-text-primary)',
            marginBottom: '1.25rem',
          }}>
            Información básica
          </h2>

          <div style={{ marginBottom: '1rem' }}>
            <label style={labelStyle}>Nombre *</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Ej: Cohorte Climate 2026-II"
              required
              style={inputStyle}
              onFocus={(e) => (e.currentTarget.style.borderColor = 'var(--color-accent-primary)')}
              onBlur={(e) => (e.currentTarget.style.borderColor = 'var(--color-border)')}
            />
          </div>

          <div style={{ marginBottom: '1rem' }}>
            <label style={labelStyle}>Descripción</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Describe brevemente los objetivos de esta cohorte..."
              rows={3}
              style={{ ...inputStyle, resize: 'vertical' }}
              onFocus={(e) => (e.currentTarget.style.borderColor = 'var(--color-accent-primary)')}
              onBlur={(e) => (e.currentTarget.style.borderColor = 'var(--color-border)')}
            />
          </div>

          <div style={{
            display: 'grid', gridTemplateColumns: '1fr 1fr',
            gap: '1rem',
          }}>
            <div>
              <label style={labelStyle}>Fecha inicio *</label>
              <input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                required
                style={inputStyle}
                onFocus={(e) => (e.currentTarget.style.borderColor = 'var(--color-accent-primary)')}
                onBlur={(e) => (e.currentTarget.style.borderColor = 'var(--color-border)')}
              />
            </div>
            <div>
              <label style={labelStyle}>Fecha fin *</label>
              <input
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                required
                style={inputStyle}
                onFocus={(e) => (e.currentTarget.style.borderColor = 'var(--color-accent-primary)')}
                onBlur={(e) => (e.currentTarget.style.borderColor = 'var(--color-border)')}
              />
            </div>
          </div>
        </div>

        {/* Milestones */}
        <div style={{ ...cardStyle, marginBottom: '2rem' }}>
          <div style={{
            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
            marginBottom: '1.25rem',
          }}>
            <h2 style={{
              fontFamily: 'var(--font-heading)', fontWeight: 600,
              fontSize: '1.0625rem', color: 'var(--color-text-primary)',
            }}>
              Hitos del programa
            </h2>
            <button
              type="button"
              onClick={addMilestone}
              style={{
                display: 'inline-flex', alignItems: 'center', gap: '0.375rem',
                padding: '0.375rem 0.875rem', borderRadius: 'var(--radius-sm)',
                border: '1px solid var(--color-border)',
                background: 'var(--color-bg-card)',
                fontFamily: 'var(--font-body)', fontSize: '0.8125rem',
                color: 'var(--color-accent-primary)', cursor: 'pointer',
                fontWeight: 500, transition: 'all 0.15s',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = 'var(--color-accent-primary)'
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = 'var(--color-border)'
              }}
            >
              <Plus size={14} />
              Agregar hito
            </button>
          </div>

          {milestones.length === 0 ? (
            <p style={{
              fontFamily: 'var(--font-body)', fontSize: '0.875rem',
              color: 'var(--color-text-muted)', textAlign: 'center',
              padding: '1.5rem 0',
            }}>
              Agrega hitos para definir los objetivos clave del programa
            </p>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {milestones.map((m, idx) => (
                <motion.div
                  key={m.id}
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  style={{
                    padding: '1rem',
                    borderRadius: 'var(--radius-sm)',
                    border: '1px solid var(--color-border)',
                    background: 'var(--color-bg-primary)',
                  }}
                >
                  <div style={{
                    display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                    marginBottom: '0.75rem',
                  }}>
                    <span style={{
                      fontFamily: 'var(--font-body)', fontSize: '0.6875rem',
                      fontWeight: 600, color: 'var(--color-text-muted)',
                      textTransform: 'uppercase',
                    }}>
                      Hito {idx + 1}
                    </span>
                    <button
                      type="button"
                      onClick={() => removeMilestone(m.id)}
                      style={{
                        background: 'none', border: 'none', cursor: 'pointer',
                        color: 'var(--color-text-muted)', display: 'flex',
                        padding: '0.25rem', borderRadius: 4,
                        transition: 'color 0.15s',
                      }}
                      onMouseEnter={(e) => (e.currentTarget.style.color = '#DC2626')}
                      onMouseLeave={(e) => (e.currentTarget.style.color = 'var(--color-text-muted)')}
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                  <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
                    gap: '0.75rem',
                  }}>
                    <div>
                      <label style={{ ...labelStyle, fontSize: '0.75rem' }}>Nombre</label>
                      <input
                        type="text"
                        value={m.name}
                        onChange={(e) => updateMilestone(m.id, 'name', e.target.value)}
                        placeholder="Ej: Demo Day"
                        style={{ ...inputStyle, fontSize: '0.8125rem', padding: '0.5rem 0.75rem' }}
                        onFocus={(e) => (e.currentTarget.style.borderColor = 'var(--color-accent-primary)')}
                        onBlur={(e) => (e.currentTarget.style.borderColor = 'var(--color-border)')}
                      />
                    </div>
                    <div>
                      <label style={{ ...labelStyle, fontSize: '0.75rem' }}>Etapa</label>
                      <select
                        value={m.stage}
                        onChange={(e) => updateMilestone(m.id, 'stage', e.target.value)}
                        style={{ ...inputStyle, fontSize: '0.8125rem', padding: '0.5rem 0.75rem' }}
                      >
                        {STAGES.map((s) => (
                          <option key={s.value} value={s.value}>{s.label}</option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label style={{ ...labelStyle, fontSize: '0.75rem' }}>Fecha límite</label>
                      <input
                        type="date"
                        value={m.deadline}
                        onChange={(e) => updateMilestone(m.id, 'deadline', e.target.value)}
                        style={{ ...inputStyle, fontSize: '0.8125rem', padding: '0.5rem 0.75rem' }}
                        onFocus={(e) => (e.currentTarget.style.borderColor = 'var(--color-accent-primary)')}
                        onBlur={(e) => (e.currentTarget.style.borderColor = 'var(--color-border)')}
                      />
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>

        {/* Actions */}
        <div style={{
          display: 'flex', alignItems: 'center', justifyContent: 'flex-end',
          gap: '0.75rem',
        }}>
          <Link
            href="/admin/cohortes"
            style={{
              display: 'inline-flex', alignItems: 'center',
              padding: '0.625rem 1.25rem', borderRadius: 'var(--radius-sm)',
              border: '1px solid var(--color-border)',
              background: 'var(--color-bg-card)',
              fontFamily: 'var(--font-body)', fontSize: '0.875rem',
              fontWeight: 500, color: 'var(--color-text-secondary)',
              textDecoration: 'none', transition: 'all 0.15s',
            }}
          >
            Cancelar
          </Link>
          <button
            type="submit"
            disabled={saving || !name.trim() || !startDate || !endDate}
            style={{
              display: 'inline-flex', alignItems: 'center', gap: '0.5rem',
              padding: '0.625rem 1.5rem', borderRadius: 'var(--radius-sm)',
              background: !name.trim() || !startDate || !endDate
                ? 'var(--color-text-muted)'
                : 'var(--color-accent-primary)',
              color: '#fff', border: 'none', cursor: 'pointer',
              fontFamily: 'var(--font-body)', fontSize: '0.875rem', fontWeight: 600,
              transition: 'background 0.15s',
              opacity: saving ? 0.7 : 1,
            }}
          >
            <Save size={16} />
            {saving ? 'Guardando...' : 'Crear cohorte'}
          </button>
        </div>
      </form>
    </motion.div>
  )
}
