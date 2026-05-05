'use client'

import { useState, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { ArrowLeft, Building2, Loader2, UserPlus, Eye, EyeOff, CheckCircle2, Upload, X } from 'lucide-react'
import Link from 'next/link'
import Image from 'next/image'
import { useAuth } from '@/context/AuthContext'
import { useSuperadmin } from '@/context/SuperadminContext'

const ORG_TYPES = [
  { value: 'university', label: 'Universidad' },
  { value: 'incubator', label: 'Incubadora' },
  { value: 'accelerator', label: 'Aceleradora' },
  { value: 'government', label: 'Gobierno' },
  { value: 'ngo', label: 'ONG' },
  { value: 'other', label: 'Otro' },
]

const PLANS = [
  { value: 'starter', label: 'Starter — hasta 25 startups' },
  { value: 'professional', label: 'Professional — hasta 50 startups' },
  { value: 'enterprise', label: 'Enterprise — ilimitado' },
]

const LATAM_COUNTRIES = [
  'Argentina', 'Bolivia', 'Brasil', 'Chile', 'Colombia', 'Costa Rica',
  'Ecuador', 'El Salvador', 'Guatemala', 'Honduras', 'México', 'Nicaragua',
  'Panamá', 'Paraguay', 'Perú', 'Puerto Rico', 'República Dominicana',
  'Uruguay', 'Venezuela',
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

const sectionTitle: React.CSSProperties = {
  fontFamily: 'var(--font-heading)',
  fontWeight: 600,
  fontSize: '0.9375rem',
  color: 'var(--color-text-primary)',
  marginBottom: '1rem',
  display: 'flex',
  alignItems: 'center',
  gap: '0.5rem',
}

export default function NuevaOrganizacionPage() {
  const { appUser } = useAuth()
  const { isSuperadmin } = useSuperadmin()
  const router = useRouter()

  const [form, setForm] = useState({
    name: '',
    type: 'university',
    country: 'Perú',
    plan: 'starter',
    max_startups: 25,
    billing_email: '',
    website: '',
    contract_end: '',
    // Admin user fields
    adminFullName: '',
    adminEmail: '',
    adminPassword: '',
  })
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<{ orgName: string; email: string } | null>(null)
  const [showPassword, setShowPassword] = useState(false)
  const [logoFile, setLogoFile] = useState<File | null>(null)
  const [logoPreview, setLogoPreview] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  if (appUser?.role !== 'superadmin' || !isSuperadmin) {
    router.replace('/admin')
    return null
  }

  function updateField(field: string, value: string | number) {
    setForm((prev) => ({ ...prev, [field]: value }))
    setError(null)
  }

  // Auto-generate email suggestion from org name
  function suggestEmail(orgName: string): string {
    const slug = orgName
      .toLowerCase()
      .normalize('NFD')
      .replace(/[̀-ͯ]/g, '')
      .replace(/[^a-z0-9]+/g, '')
      .slice(0, 20)
    return slug ? `${slug}@startups4climate.org` : ''
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError(null)
    setSuccess(null)

    if (!form.name.trim()) {
      setError('El nombre de la organización es requerido.')
      return
    }
    if (!form.adminEmail.trim()) {
      setError('El email del administrador es requerido.')
      return
    }
    if (!form.adminPassword || form.adminPassword.length < 8) {
      setError('La contraseña debe tener al menos 8 caracteres.')
      return
    }

    setSubmitting(true)

    try {
      const formData = new FormData()
      formData.append('orgName', form.name.trim())
      formData.append('orgType', form.type)
      formData.append('country', form.country)
      formData.append('plan', form.plan)
      formData.append('maxStartups', String(form.max_startups))
      if (form.billing_email.trim()) formData.append('billingEmail', form.billing_email.trim())
      if (form.website.trim()) formData.append('website', form.website.trim())
      if (form.contract_end) formData.append('contractEnd', form.contract_end)
      formData.append('adminFullName', form.adminFullName.trim())
      formData.append('adminEmail', form.adminEmail.trim())
      formData.append('adminPassword', form.adminPassword)
      if (logoFile) formData.append('logo', logoFile)

      const res = await fetch('/api/superadmin/create-org-admin', {
        method: 'POST',
        body: formData,
      })

      const data = await res.json()

      if (!res.ok) {
        setError(data.error || 'Error al crear la organización.')
        setSubmitting(false)
        return
      }

      setSuccess({ orgName: data.organization.name, email: data.user.email })
    } catch (err) {
      console.error('[S4C Superadmin] Create org error:', err)
      setError('Error de conexión. Intenta de nuevo.')
    } finally {
      setSubmitting(false)
    }
  }

  if (success) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        style={{ padding: '2rem 1.5rem', maxWidth: 720, margin: '0 auto' }}
      >
        <div style={{ ...cardStyle, textAlign: 'center', padding: '3rem 2rem' }}>
          <CheckCircle2 size={48} color="#1F77F6" style={{ margin: '0 auto 1rem' }} />
          <h2 style={{
            fontFamily: 'var(--font-heading)', fontWeight: 700,
            fontSize: '1.25rem', color: 'var(--color-text-primary)',
            marginBottom: '0.5rem',
          }}>
            Organización creada
          </h2>
          <p style={{
            fontFamily: 'var(--font-body)', fontSize: '0.875rem',
            color: 'var(--color-text-secondary)', marginBottom: '1.5rem',
          }}>
            <strong>{success.orgName}</strong> ya tiene acceso a la plataforma.
          </p>
          <div style={{
            background: 'rgba(31,119,246,0.06)', borderRadius: 'var(--radius-sm)',
            padding: '1rem', marginBottom: '1.5rem', textAlign: 'left',
          }}>
            <p style={{ fontFamily: 'var(--font-body)', fontSize: '0.8125rem', color: 'var(--color-text-primary)', marginBottom: '0.25rem' }}>
              <strong>Email:</strong> {success.email}
            </p>
            <p style={{ fontFamily: 'var(--font-body)', fontSize: '0.8125rem', color: 'var(--color-text-primary)' }}>
              <strong>URL:</strong> https://startups4climate.org (login → panel admin)
            </p>
          </div>
          <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'center' }}>
            <button
              onClick={() => {
                setSuccess(null)
                setLogoFile(null)
                setLogoPreview(null)
                setForm({
                  name: '', type: 'university', country: 'Perú', plan: 'starter',
                  max_startups: 25, billing_email: '', website: '', contract_end: '',
                  adminFullName: '', adminEmail: '', adminPassword: '',
                })
              }}
              style={{
                padding: '0.5rem 1rem', borderRadius: 8,
                border: '1px solid var(--color-border)',
                background: 'var(--color-bg-card)', color: 'var(--color-text-primary)',
                fontFamily: 'var(--font-body)', fontSize: '0.8125rem', fontWeight: 500,
                cursor: 'pointer',
              }}
            >
              Crear otra
            </button>
            <Link
              href="/superadmin/organizaciones"
              style={{
                display: 'inline-flex', alignItems: 'center',
                padding: '0.5rem 1rem', borderRadius: 8,
                background: 'var(--color-accent-primary)', color: '#fff',
                fontFamily: 'var(--font-body)', fontSize: '0.8125rem', fontWeight: 600,
                textDecoration: 'none',
              }}
            >
              Ver organizaciones
            </Link>
          </div>
        </div>
      </motion.div>
    )
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: 'easeOut' }}
      style={{ padding: '2rem 1.5rem', maxWidth: 720, margin: '0 auto' }}
    >
      <Link
        href="/superadmin/organizaciones"
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

      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1.5rem' }}>
        <Building2 size={20} color="var(--color-accent-primary)" />
        <h1 style={{
          fontFamily: 'var(--font-heading)', fontWeight: 700,
          fontSize: '1.25rem', color: 'var(--color-text-primary)',
        }}>
          Nueva organización
        </h1>
      </div>

      <form onSubmit={handleSubmit}>
        {/* ── Organization details ── */}
        <div style={{ ...cardStyle, marginBottom: '1.25rem' }}>
          <div style={sectionTitle}>
            <Building2 size={16} color="var(--color-accent-primary)" />
            Datos de la organización
          </div>
          <div style={{
            display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
            gap: '1.25rem',
          }}>
            <div style={{ gridColumn: '1 / -1' }}>
              <label style={labelStyle}>
                Nombre <span style={{ color: '#EF4444' }}>*</span>
              </label>
              <input
                type="text"
                value={form.name}
                onChange={(e) => {
                  updateField('name', e.target.value)
                  // Auto-suggest admin email if empty
                  if (!form.adminEmail || form.adminEmail === suggestEmail(form.name)) {
                    setForm((prev) => ({ ...prev, name: e.target.value, adminEmail: suggestEmail(e.target.value) }))
                  }
                }}
                placeholder="Ej. Universidad del Valle"
                style={inputStyle}
                onFocus={(e) => (e.currentTarget.style.borderColor = 'var(--color-accent-primary)')}
                onBlur={(e) => (e.currentTarget.style.borderColor = 'var(--color-border)')}
                required
              />
            </div>

            <div style={{ gridColumn: '1 / -1' }}>
              <label style={labelStyle}>Logo</label>
              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                {logoPreview ? (
                  <div style={{ position: 'relative' }}>
                    <Image
                      src={logoPreview}
                      alt="Logo preview"
                      width={64}
                      height={64}
                      style={{
                        borderRadius: 'var(--radius-sm)',
                        border: '1px solid var(--color-border)',
                        objectFit: 'contain',
                        background: '#fff',
                      }}
                    />
                    <button
                      type="button"
                      onClick={() => {
                        setLogoFile(null)
                        setLogoPreview(null)
                        if (fileInputRef.current) fileInputRef.current.value = ''
                      }}
                      style={{
                        position: 'absolute', top: -6, right: -6,
                        width: 20, height: 20, borderRadius: '50%',
                        background: 'var(--color-bg-primary)', border: '1px solid var(--color-border)',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        cursor: 'pointer', color: 'var(--color-text-muted)',
                      }}
                    >
                      <X size={10} />
                    </button>
                  </div>
                ) : (
                  <div
                    style={{
                      width: 64, height: 64, borderRadius: 'var(--radius-sm)',
                      border: '1px dashed var(--color-border)',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      color: 'var(--color-text-muted)',
                    }}
                  >
                    <Building2 size={24} />
                  </div>
                )}
                <div>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/png,image/jpeg,image/webp,image/svg+xml"
                    style={{ display: 'none' }}
                    onChange={(e) => {
                      const file = e.target.files?.[0]
                      if (!file) return
                      if (file.size > 2 * 1024 * 1024) {
                        setError('El logo debe pesar menos de 2 MB.')
                        return
                      }
                      setLogoFile(file)
                      setLogoPreview(URL.createObjectURL(file))
                      setError(null)
                    }}
                  />
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    style={{
                      display: 'inline-flex', alignItems: 'center', gap: '0.375rem',
                      padding: '0.375rem 0.75rem', borderRadius: 6,
                      border: '1px solid var(--color-border)',
                      background: 'var(--color-bg-card)', color: 'var(--color-text-primary)',
                      fontFamily: 'var(--font-body)', fontSize: '0.75rem', fontWeight: 500,
                      cursor: 'pointer',
                    }}
                  >
                    <Upload size={13} />
                    {logoFile ? 'Cambiar logo' : 'Subir logo'}
                  </button>
                  <p style={{
                    fontFamily: 'var(--font-body)', fontSize: '0.6875rem',
                    color: 'var(--color-text-muted)', marginTop: '0.25rem',
                  }}>
                    PNG, JPG o SVG. Max 2 MB.
                  </p>
                </div>
              </div>
            </div>

            <div>
              <label style={labelStyle}>Tipo</label>
              <select value={form.type} onChange={(e) => updateField('type', e.target.value)} style={inputStyle}>
                {ORG_TYPES.map((t) => <option key={t.value} value={t.value}>{t.label}</option>)}
              </select>
            </div>

            <div>
              <label style={labelStyle}>País</label>
              <select value={form.country} onChange={(e) => updateField('country', e.target.value)} style={inputStyle}>
                <option value="">Seleccionar</option>
                {LATAM_COUNTRIES.map((c) => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>

            <div>
              <label style={labelStyle}>Plan</label>
              <select value={form.plan} onChange={(e) => updateField('plan', e.target.value)} style={inputStyle}>
                {PLANS.map((p) => <option key={p.value} value={p.value}>{p.label}</option>)}
              </select>
            </div>

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

            <div>
              <label style={labelStyle}>Email de facturación</label>
              <input
                type="email"
                value={form.billing_email}
                onChange={(e) => updateField('billing_email', e.target.value)}
                placeholder="facturacion@org.com"
                style={inputStyle}
                onFocus={(e) => (e.currentTarget.style.borderColor = 'var(--color-accent-primary)')}
                onBlur={(e) => (e.currentTarget.style.borderColor = 'var(--color-border)')}
              />
            </div>

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

            <div>
              <label style={labelStyle}>Fin de contrato</label>
              <input
                type="date"
                value={form.contract_end}
                onChange={(e) => updateField('contract_end', e.target.value)}
                style={inputStyle}
                onFocus={(e) => (e.currentTarget.style.borderColor = 'var(--color-accent-primary)')}
                onBlur={(e) => (e.currentTarget.style.borderColor = 'var(--color-border)')}
              />
            </div>
          </div>
        </div>

        {/* ── Admin user ── */}
        <div style={{ ...cardStyle, marginBottom: '1.25rem' }}>
          <div style={sectionTitle}>
            <UserPlus size={16} color="#8B5CF6" />
            Usuario administrador
          </div>
          <p style={{
            fontFamily: 'var(--font-body)', fontSize: '0.75rem',
            color: 'var(--color-text-muted)', marginBottom: '1rem', marginTop: '-0.5rem',
          }}>
            Este usuario podrá gestionar cohortes, startups y reportes de la organización.
          </p>
          <div style={{
            display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
            gap: '1.25rem',
          }}>
            <div style={{ gridColumn: '1 / -1' }}>
              <label style={labelStyle}>Nombre completo</label>
              <input
                type="text"
                value={form.adminFullName}
                onChange={(e) => updateField('adminFullName', e.target.value)}
                placeholder="Ej. Sandra Arista"
                style={inputStyle}
                onFocus={(e) => (e.currentTarget.style.borderColor = 'var(--color-accent-primary)')}
                onBlur={(e) => (e.currentTarget.style.borderColor = 'var(--color-border)')}
              />
            </div>

            <div>
              <label style={labelStyle}>
                Email de acceso <span style={{ color: '#EF4444' }}>*</span>
              </label>
              <input
                type="email"
                value={form.adminEmail}
                onChange={(e) => updateField('adminEmail', e.target.value)}
                placeholder="usuario@startups4climate.org"
                style={inputStyle}
                onFocus={(e) => (e.currentTarget.style.borderColor = 'var(--color-accent-primary)')}
                onBlur={(e) => (e.currentTarget.style.borderColor = 'var(--color-border)')}
                required
              />
            </div>

            <div>
              <label style={labelStyle}>
                Contraseña <span style={{ color: '#EF4444' }}>*</span>
              </label>
              <div style={{ position: 'relative' }}>
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={form.adminPassword}
                  onChange={(e) => updateField('adminPassword', e.target.value)}
                  placeholder="Mínimo 8 caracteres"
                  style={{ ...inputStyle, paddingRight: '2.5rem' }}
                  onFocus={(e) => (e.currentTarget.style.borderColor = 'var(--color-accent-primary)')}
                  onBlur={(e) => (e.currentTarget.style.borderColor = 'var(--color-border)')}
                  required
                  minLength={8}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((v) => !v)}
                  style={{
                    position: 'absolute', right: '0.5rem', top: '50%', transform: 'translateY(-50%)',
                    background: 'none', border: 'none', cursor: 'pointer',
                    color: 'var(--color-text-muted)', display: 'flex',
                  }}
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Error */}
        {error && (
          <div style={{
            marginBottom: '1.25rem', padding: '0.75rem 1rem',
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
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', justifyContent: 'flex-end' }}>
          <Link
            href="/superadmin/organizaciones"
            style={{
              padding: '0.375rem 0.75rem', borderRadius: 6,
              border: '1px solid var(--color-border)',
              background: 'var(--color-bg-card)', color: 'var(--color-text-primary)',
              fontFamily: 'var(--font-body)', fontSize: '0.75rem', fontWeight: 500,
              textDecoration: 'none',
            }}
          >
            Cancelar
          </Link>
          <button
            type="submit"
            disabled={submitting}
            style={{
              display: 'inline-flex', alignItems: 'center', gap: '0.5rem',
              padding: '0.5rem 1.25rem', borderRadius: 8,
              background: submitting ? 'var(--color-text-muted)' : 'var(--color-accent-primary)',
              color: '#fff', border: 'none', cursor: submitting ? 'not-allowed' : 'pointer',
              fontFamily: 'var(--font-body)', fontSize: '0.8125rem', fontWeight: 600,
            }}
          >
            {submitting && <Loader2 size={16} style={{ animation: 'spin 1s linear infinite' }} />}
            {submitting ? 'Creando...' : 'Crear organización + admin'}
          </button>
        </div>
      </form>
    </motion.div>
  )
}
