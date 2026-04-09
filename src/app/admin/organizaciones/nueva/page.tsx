'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { ArrowLeft, Building2, Loader2 } from 'lucide-react'
import Link from 'next/link'
import { useAuth } from '@/context/AuthContext'
import { useSuperadmin } from '@/context/SuperadminContext'
import { supabase } from '@/lib/supabase'

const ORG_TYPES = [
  { value: 'university', label: 'Universidad' },
  { value: 'incubator', label: 'Incubadora' },
  { value: 'accelerator', label: 'Aceleradora' },
  { value: 'government', label: 'Gobierno' },
  { value: 'ngo', label: 'ONG' },
  { value: 'other', label: 'Otro' },
]

const PLANS = [
  { value: 'starter', label: 'Starter' },
  { value: 'professional', label: 'Professional' },
  { value: 'enterprise', label: 'Enterprise' },
]

const cardStyle: React.CSSProperties = {
  background: 'var(--color-bg-card)',
  border: '1px solid var(--color-border)',
  borderRadius: 'var(--radius-md)',
  boxShadow: 'var(--shadow-card)',
  padding: '2rem',
}

const labelStyle: React.CSSProperties = {
  display: 'block',
  fontFamily: 'var(--font-body)',
  fontSize: '0.8125rem',
  fontWeight: 600,
  color: 'var(--color-text-primary)',
  marginBottom: '0.375rem',
}

const inputStyle: React.CSSProperties = {
  width: '100%',
  padding: '0.625rem 0.75rem',
  borderRadius: 'var(--radius-sm)',
  border: '1px solid var(--color-border)',
  background: 'var(--color-bg-card)',
  color: 'var(--color-text-primary)',
  fontFamily: 'var(--font-body)',
  fontSize: '0.8125rem',
  outline: 'none',
  transition: 'border-color 0.15s',
}

export default function NuevaOrganizacionPage() {
  const { appUser } = useAuth()
  const { isSuperadmin } = useSuperadmin()
  const router = useRouter()

  const [form, setForm] = useState({
    name: '',
    type: 'university',
    country: '',
    plan: 'starter',
    max_startups: 25,
    billing_email: '',
    website: '',
  })
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  if (appUser?.role !== 'superadmin' || !isSuperadmin) {
    router.replace('/admin')
    return null
  }

  function updateField(field: string, value: string | number) {
    setForm((prev) => ({ ...prev, [field]: value }))
    setError(null)
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError(null)

    if (!form.name.trim()) {
      setError('El nombre de la organización es requerido.')
      return
    }

    setSubmitting(true)

    const { error: insertError } = await supabase
      .from('organizations')
      .insert({
        name: form.name.trim(),
        type: form.type,
        country: form.country.trim() || null,
        plan: form.plan,
        max_startups: form.max_startups,
        billing_email: form.billing_email.trim() || null,
        website: form.website.trim() || null,
        is_active: true,
      })

    if (insertError) {
      setError(`Error al crear la organización: ${insertError.message}`)
      setSubmitting(false)
      return
    }

    router.push('/admin/organizaciones')
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
        href="/admin/organizaciones"
        style={{
          display: 'inline-flex', alignItems: 'center', gap: '0.375rem',
          fontFamily: 'var(--font-body)', fontSize: '0.8125rem',
          color: 'var(--color-text-secondary)', textDecoration: 'none',
          marginBottom: '1.5rem', transition: 'color 0.15s',
        }}
        onMouseEnter={(e) => (e.currentTarget.style.color = 'var(--color-text-primary)')}
        onMouseLeave={(e) => (e.currentTarget.style.color = 'var(--color-text-secondary)')}
      >
        <ArrowLeft size={14} />
        Volver a organizaciones
      </Link>

      {/* Header */}
      <div style={{
        display: 'flex', alignItems: 'center', gap: '0.5rem',
        marginBottom: '1.5rem',
      }}>
        <Building2 size={20} color="var(--color-accent-primary)" />
        <h1 style={{
          fontFamily: 'var(--font-heading)', fontWeight: 700,
          fontSize: '1.25rem', color: 'var(--color-text-primary)',
        }}>
          Nueva organizacion
        </h1>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit}>
        <div style={cardStyle}>
          <div style={{
            display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
            gap: '1.25rem',
          }}>
            {/* Name */}
            <div style={{ gridColumn: '1 / -1' }}>
              <label style={labelStyle}>
                Nombre <span style={{ color: '#EF4444' }}>*</span>
              </label>
              <input
                type="text"
                value={form.name}
                onChange={(e) => updateField('name', e.target.value)}
                placeholder="Ej. Universidad del Valle"
                style={inputStyle}
                onFocus={(e) => (e.currentTarget.style.borderColor = 'var(--color-accent-primary)')}
                onBlur={(e) => (e.currentTarget.style.borderColor = 'var(--color-border)')}
                required
              />
            </div>

            {/* Type */}
            <div>
              <label style={labelStyle}>Tipo</label>
              <select
                value={form.type}
                onChange={(e) => updateField('type', e.target.value)}
                style={inputStyle}
              >
                {ORG_TYPES.map((t) => (
                  <option key={t.value} value={t.value}>{t.label}</option>
                ))}
              </select>
            </div>

            {/* Country */}
            <div>
              <label style={labelStyle}>Pais</label>
              <input
                type="text"
                value={form.country}
                onChange={(e) => updateField('country', e.target.value)}
                placeholder="Ej. Colombia"
                style={inputStyle}
                onFocus={(e) => (e.currentTarget.style.borderColor = 'var(--color-accent-primary)')}
                onBlur={(e) => (e.currentTarget.style.borderColor = 'var(--color-border)')}
              />
            </div>

            {/* Plan */}
            <div>
              <label style={labelStyle}>Plan</label>
              <select
                value={form.plan}
                onChange={(e) => updateField('plan', e.target.value)}
                style={inputStyle}
              >
                {PLANS.map((p) => (
                  <option key={p.value} value={p.value}>{p.label}</option>
                ))}
              </select>
            </div>

            {/* Max startups */}
            <div>
              <label style={labelStyle}>Max startups</label>
              <input
                type="number"
                value={form.max_startups}
                onChange={(e) => updateField('max_startups', parseInt(e.target.value) || 0)}
                min={1}
                style={inputStyle}
                onFocus={(e) => (e.currentTarget.style.borderColor = 'var(--color-accent-primary)')}
                onBlur={(e) => (e.currentTarget.style.borderColor = 'var(--color-border)')}
              />
            </div>

            {/* Billing email */}
            <div>
              <label style={labelStyle}>Email de facturación</label>
              <input
                type="email"
                value={form.billing_email}
                onChange={(e) => updateField('billing_email', e.target.value)}
                placeholder="facturación@org.com"
                style={inputStyle}
                onFocus={(e) => (e.currentTarget.style.borderColor = 'var(--color-accent-primary)')}
                onBlur={(e) => (e.currentTarget.style.borderColor = 'var(--color-border)')}
              />
            </div>

            {/* Website */}
            <div>
              <label style={labelStyle}>Sitio web</label>
              <input
                type="url"
                value={form.website}
                onChange={(e) => updateField('website', e.target.value)}
                placeholder="https://org.com"
                style={inputStyle}
                onFocus={(e) => (e.currentTarget.style.borderColor = 'var(--color-accent-primary)')}
                onBlur={(e) => (e.currentTarget.style.borderColor = 'var(--color-border)')}
              />
            </div>
          </div>

          {/* Error message */}
          {error && (
            <div style={{
              marginTop: '1.25rem', padding: '0.75rem 1rem',
              borderRadius: 'var(--radius-sm)',
              background: 'rgba(239,68,68,0.08)',
              border: '1px solid rgba(239,68,68,0.2)',
              fontFamily: 'var(--font-body)', fontSize: '0.8125rem',
              color: '#EF4444',
            }}>
              {error}
            </div>
          )}

          {/* Actions */}
          <div style={{
            display: 'flex', alignItems: 'center', gap: '0.75rem',
            marginTop: '1.5rem', justifyContent: 'flex-end',
          }}>
            <Link
              href="/admin/organizaciones"
              style={{
                padding: '0.375rem 0.75rem', borderRadius: 6,
                border: '1px solid var(--color-border)',
                background: 'var(--color-bg-card)', color: 'var(--color-text-primary)',
                fontFamily: 'var(--font-body)', fontSize: '0.75rem', fontWeight: 500,
                textDecoration: 'none', transition: 'border-color 0.15s',
              }}
              onMouseEnter={(e) => (e.currentTarget.style.borderColor = 'var(--color-text-muted)')}
              onMouseLeave={(e) => (e.currentTarget.style.borderColor = 'var(--color-border)')}
            >
              Cancelar
            </Link>
            <button
              type="submit"
              disabled={submitting}
              style={{
                display: 'inline-flex', alignItems: 'center', gap: '0.5rem',
                padding: '0.5rem 1rem', borderRadius: 8,
                background: submitting ? 'var(--color-text-muted)' : 'var(--color-accent-primary)',
                color: '#fff', border: 'none', cursor: submitting ? 'not-allowed' : 'pointer',
                fontFamily: 'var(--font-body)', fontSize: '0.8125rem', fontWeight: 600,
                transition: 'background 0.15s',
              }}
            >
              {submitting && <Loader2 size={16} style={{ animation: 'spin 1s linear infinite' }} />}
              {submitting ? 'Creando...' : 'Crear organización'}
            </button>
          </div>
        </div>
      </form>

    </motion.div>
  )
}
