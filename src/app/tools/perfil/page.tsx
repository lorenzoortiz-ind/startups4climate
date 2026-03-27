'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { ArrowLeft, Save, User, CheckCircle2 } from 'lucide-react'
import { useAuth } from '@/context/AuthContext'
import { STAGE_META } from '@/lib/tools-data'

const ROLE_OPTIONS = [
  'CEO / Founder',
  'CTO',
  'COO',
  'CMO',
  'CPO',
  'Otro',
]

const STAGE_LABELS: Record<string, { label: string; color: string; bg: string }> = {
  '1': { label: 'Pre-incubación', color: STAGE_META[1].color, bg: STAGE_META[1].bg },
  '2': { label: 'Incubación', color: STAGE_META[2].color, bg: STAGE_META[2].bg },
  '3': { label: 'Aceleración', color: STAGE_META[3].color, bg: STAGE_META[3].bg },
  '4': { label: 'Escalamiento', color: STAGE_META[4].color, bg: STAGE_META[4].bg },
}

const inputStyle: React.CSSProperties = {
  width: '100%',
  padding: '0.75rem 1rem',
  borderRadius: 10,
  border: '1px solid var(--color-border, #e5e7eb)',
  fontFamily: 'var(--font-body)',
  fontSize: '0.875rem',
  color: 'var(--color-text-primary, #111827)',
  background: 'var(--color-bg-card, #ffffff)',
  outline: 'none',
  transition: 'border-color 0.2s ease, box-shadow 0.2s ease',
  boxSizing: 'border-box' as const,
}

const selectStyle: React.CSSProperties = {
  ...inputStyle,
  appearance: 'none' as const,
  backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 12 12'%3E%3Cpath fill='%236B7280' d='M2 4l4 4 4-4'/%3E%3C/svg%3E")`,
  backgroundRepeat: 'no-repeat',
  backgroundPosition: 'right 1rem center',
  paddingRight: '2.5rem',
}

const labelStyle: React.CSSProperties = {
  display: 'block',
  fontFamily: 'var(--font-body)',
  fontSize: '0.8125rem',
  fontWeight: 600,
  color: 'var(--color-text-primary, #111827)',
  marginBottom: '0.375rem',
}

export default function PerfilPage() {
  const { user } = useAuth()

  const [nombre, setNombre] = useState('')
  const [startupName, setStartupName] = useState('')
  const [role, setRole] = useState('')
  const [linkedin, setLinkedin] = useState('')
  const [descripcion, setDescripcion] = useState('')
  const [saved, setSaved] = useState(false)

  useEffect(() => {
    if (user) {
      setNombre(user.name || '')
      setStartupName(user.startup || '')
    }
    // Load extra profile fields from localStorage
    if (typeof window !== 'undefined') {
      try {
        const extra = JSON.parse(localStorage.getItem('s4c_profile_extra') || '{}')
        if (extra.role) setRole(extra.role)
        if (extra.linkedin) setLinkedin(extra.linkedin)
        if (extra.descripcion) setDescripcion(extra.descripcion)
      } catch {
        // ignore
      }
    }
  }, [user])

  const handleSave = () => {
    if (!user) return

    // Update user data in s4c_session localStorage
    try {
      const usersRaw = localStorage.getItem('s4c_users')
      if (usersRaw) {
        const users = JSON.parse(usersRaw)
        const record = users[user.email]
        if (record) {
          record.user.name = nombre
          record.user.startup = startupName
          users[user.email] = record
          localStorage.setItem('s4c_users', JSON.stringify(users))
        }
      }
    } catch {
      // ignore
    }

    // Save extra profile fields
    localStorage.setItem(
      's4c_profile_extra',
      JSON.stringify({ role, linkedin, descripcion })
    )

    setSaved(true)
    setTimeout(() => setSaved(false), 3000)
  }

  if (!user) return null

  const stageNum = user.stage || '1'
  const stageInfo = STAGE_LABELS[stageNum] || STAGE_LABELS['1']

  return (
    <div style={{ padding: '2rem 1.5rem', maxWidth: 700, margin: '0 auto' }}>
      {/* Back link */}
      <Link
        href="/tools"
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '0.375rem',
          fontFamily: 'var(--font-body)',
          fontSize: '0.8125rem',
          color: 'var(--color-text-muted)',
          textDecoration: 'none',
          marginBottom: '1.5rem',
        }}
      >
        <ArrowLeft size={14} />
        Volver al dashboard
      </Link>

      {/* Stage banner */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35 }}
        style={{
          background: stageInfo.bg,
          border: `1px solid ${stageInfo.color}30`,
          borderRadius: 14,
          padding: '1rem 1.5rem',
          marginBottom: '1.5rem',
          display: 'flex',
          alignItems: 'center',
          gap: '0.75rem',
        }}
      >
        <div
          style={{
            width: 40,
            height: 40,
            borderRadius: 10,
            background: `${stageInfo.color}18`,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexShrink: 0,
          }}
        >
          <User size={20} color={stageInfo.color} />
        </div>
        <div>
          <div
            style={{
              fontFamily: 'var(--font-heading)',
              fontSize: '1rem',
              fontWeight: 700,
              color: stageInfo.color,
            }}
          >
            Tu startup está en la etapa de {stageInfo.label}
          </div>
          <div
            style={{
              fontFamily: 'var(--font-body)',
              fontSize: '0.8125rem',
              color: 'var(--color-text-secondary)',
              marginTop: '0.125rem',
            }}
          >
            {user.email}
          </div>
        </div>
      </motion.div>

      {/* Profile form */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.05 }}
        style={{
          background: 'var(--color-bg-card, #ffffff)',
          borderRadius: 16,
          border: '1px solid var(--color-border, #e5e7eb)',
          padding: '2rem',
          boxShadow: '0 1px 3px rgba(0,0,0,0.04)',
        }}
      >
        <h1
          style={{
            fontFamily: 'var(--font-heading)',
            fontSize: '1.5rem',
            fontWeight: 800,
            color: 'var(--color-text-primary)',
            letterSpacing: '-0.02em',
            marginBottom: '1.5rem',
          }}
        >
          Tu perfil
        </h1>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          <div>
            <label style={labelStyle}>Nombre completo</label>
            <input
              type="text"
              value={nombre}
              onChange={(e) => setNombre(e.target.value)}
              style={inputStyle}
            />
          </div>

          <div>
            <label style={labelStyle}>Nombre de la startup</label>
            <input
              type="text"
              value={startupName}
              onChange={(e) => setStartupName(e.target.value)}
              style={inputStyle}
            />
          </div>

          <div>
            <label style={labelStyle}>Rol en la startup</label>
            <select
              value={role}
              onChange={(e) => setRole(e.target.value)}
              style={selectStyle}
            >
              <option value="">Selecciona tu rol</option>
              {ROLE_OPTIONS.map((r) => (
                <option key={r} value={r}>
                  {r}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label style={labelStyle}>LinkedIn URL</label>
            <input
              type="url"
              value={linkedin}
              onChange={(e) => setLinkedin(e.target.value)}
              placeholder="https://linkedin.com/in/tu-perfil"
              style={inputStyle}
            />
          </div>

          <div>
            <label style={labelStyle}>Descripción breve</label>
            <textarea
              value={descripcion}
              onChange={(e) => setDescripcion(e.target.value)}
              placeholder="Cuéntanos brevemente sobre tu startup y lo que estás construyendo..."
              rows={4}
              style={{
                ...inputStyle,
                resize: 'vertical' as const,
                minHeight: 100,
              }}
            />
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginTop: '0.5rem' }}>
            <button
              onClick={handleSave}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.5rem',
                padding: '0.75rem 1.75rem',
                borderRadius: 10,
                background: '#059669',
                color: 'white',
                fontFamily: 'var(--font-body)',
                fontSize: '0.875rem',
                fontWeight: 600,
                border: 'none',
                cursor: 'pointer',
                boxShadow: '0 2px 10px rgba(5,150,105,0.25)',
                transition: 'all 0.2s',
              }}
            >
              <Save size={16} />
              Guardar cambios
            </button>
            {saved && (
              <motion.div
                initial={{ opacity: 0, x: -8 }}
                animate={{ opacity: 1, x: 0 }}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.375rem',
                  fontFamily: 'var(--font-body)',
                  fontSize: '0.8125rem',
                  color: '#059669',
                  fontWeight: 500,
                }}
              >
                <CheckCircle2 size={15} />
                Guardado
              </motion.div>
            )}
          </div>
        </div>
      </motion.div>
    </div>
  )
}
