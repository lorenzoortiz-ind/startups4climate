'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Save, Building2, CreditCard, Globe } from 'lucide-react'

const cardStyle: React.CSSProperties = {
  background: 'var(--color-bg-card)',
  border: '1px solid var(--color-border)',
  borderRadius: 'var(--radius-md)',
  padding: '1.5rem',
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

export default function ConfiguracionPage() {
  const [orgName, setOrgName] = useState('Mi Organización')
  const [website, setWebsite] = useState('https://')
  const [logoUrl, setLogoUrl] = useState('')
  const [billingEmail, setBillingEmail] = useState('')
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)
    // Placeholder: will connect to Supabase later
    await new Promise((r) => setTimeout(r, 1000))
    setSaving(false)
    setSaved(true)
    setTimeout(() => setSaved(false), 3000)
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: 'easeOut' }}
      style={{ padding: '2rem 1.5rem', maxWidth: 720, margin: '0 auto' }}
    >
      <div style={{ marginBottom: '2rem' }}>
        <h1 style={{
          fontFamily: 'var(--font-heading)', fontWeight: 700,
          fontSize: '1.5rem', color: 'var(--color-text-primary)',
          marginBottom: '0.25rem',
        }}>
          Configuración
        </h1>
        <p style={{
          fontFamily: 'var(--font-body)', fontSize: '0.875rem',
          color: 'var(--color-text-secondary)',
        }}>
          Administra los datos de tu organización y plan
        </p>
      </div>

      <form onSubmit={handleSave}>
        {/* Organization info */}
        <div style={{ ...cardStyle, marginBottom: '1.5rem' }}>
          <div style={{
            display: 'flex', alignItems: 'center', gap: '0.5rem',
            marginBottom: '1.25rem',
          }}>
            <Building2 size={18} color="var(--color-accent-primary)" />
            <h2 style={{
              fontFamily: 'var(--font-heading)', fontWeight: 600,
              fontSize: '1.0625rem', color: 'var(--color-text-primary)',
            }}>
              Organización
            </h2>
          </div>

          <div style={{ marginBottom: '1rem' }}>
            <label style={labelStyle}>Nombre de la organización</label>
            <input
              type="text"
              value={orgName}
              onChange={(e) => setOrgName(e.target.value)}
              placeholder="Nombre de tu organización"
              style={inputStyle}
              onFocus={(e) => (e.currentTarget.style.borderColor = 'var(--color-accent-primary)')}
              onBlur={(e) => (e.currentTarget.style.borderColor = 'var(--color-border)')}
            />
          </div>

          <div style={{ marginBottom: '1rem' }}>
            <label style={labelStyle}>Logo URL</label>
            <input
              type="url"
              value={logoUrl}
              onChange={(e) => setLogoUrl(e.target.value)}
              placeholder="https://ejemplo.com/logo.png"
              style={inputStyle}
              onFocus={(e) => (e.currentTarget.style.borderColor = 'var(--color-accent-primary)')}
              onBlur={(e) => (e.currentTarget.style.borderColor = 'var(--color-border)')}
            />
            <p style={{
              fontFamily: 'var(--font-body)', fontSize: '0.75rem',
              color: 'var(--color-text-muted)', marginTop: '0.25rem',
            }}>
              URL directa a la imagen de tu logo (PNG o SVG recomendado)
            </p>
          </div>

          <div>
            <label style={labelStyle}>
              <Globe size={13} style={{ display: 'inline', verticalAlign: '-2px', marginRight: 4 }} />
              Sitio web
            </label>
            <input
              type="url"
              value={website}
              onChange={(e) => setWebsite(e.target.value)}
              placeholder="https://miorganizacion.com"
              style={inputStyle}
              onFocus={(e) => (e.currentTarget.style.borderColor = 'var(--color-accent-primary)')}
              onBlur={(e) => (e.currentTarget.style.borderColor = 'var(--color-border)')}
            />
          </div>
        </div>

        {/* Plan info */}
        <div style={{ ...cardStyle, marginBottom: '1.5rem' }}>
          <div style={{
            display: 'flex', alignItems: 'center', gap: '0.5rem',
            marginBottom: '1.25rem',
          }}>
            <CreditCard size={18} color="var(--color-accent-primary)" />
            <h2 style={{
              fontFamily: 'var(--font-heading)', fontWeight: 600,
              fontSize: '1.0625rem', color: 'var(--color-text-primary)',
            }}>
              Plan y facturación
            </h2>
          </div>

          {/* Plan display */}
          <div style={{
            padding: '1rem',
            borderRadius: 'var(--radius-sm)',
            background: 'rgba(13,148,136,0.04)',
            border: '1px solid rgba(13,148,136,0.12)',
            marginBottom: '1.25rem',
          }}>
            <div style={{
              display: 'flex', alignItems: 'center', justifyContent: 'space-between',
              marginBottom: '0.75rem',
            }}>
              <div>
                <div style={{
                  fontFamily: 'var(--font-heading)', fontWeight: 700,
                  fontSize: '1rem', color: 'var(--color-text-primary)',
                  marginBottom: '0.125rem',
                }}>
                  Plan Incubadora
                </div>
                <div style={{
                  fontFamily: 'var(--font-body)', fontSize: '0.8125rem',
                  color: 'var(--color-text-secondary)',
                }}>
                  Hasta 30 startups
                </div>
              </div>
              <span style={{
                padding: '0.25rem 0.75rem', borderRadius: 'var(--radius-xl)',
                background: 'rgba(13,148,136,0.08)', color: '#0D9488',
                fontFamily: 'var(--font-body)', fontSize: '0.75rem', fontWeight: 600,
              }}>
                Activo
              </span>
            </div>
            <div style={{
              display: 'grid', gridTemplateColumns: '1fr 1fr',
              gap: '0.75rem',
            }}>
              <div>
                <div style={{
                  fontFamily: 'var(--font-mono)', fontSize: '0.625rem',
                  color: 'var(--color-text-muted)', textTransform: 'uppercase',
                  letterSpacing: '0.05em', marginBottom: '0.125rem',
                }}>
                  Startups usadas
                </div>
                <div style={{
                  fontFamily: 'var(--font-heading)', fontWeight: 600,
                  fontSize: '0.9375rem', color: 'var(--color-text-primary)',
                }}>
                  24 / 30
                </div>
              </div>
              <div>
                <div style={{
                  fontFamily: 'var(--font-mono)', fontSize: '0.625rem',
                  color: 'var(--color-text-muted)', textTransform: 'uppercase',
                  letterSpacing: '0.05em', marginBottom: '0.125rem',
                }}>
                  Próxima renovación
                </div>
                <div style={{
                  fontFamily: 'var(--font-heading)', fontWeight: 600,
                  fontSize: '0.9375rem', color: 'var(--color-text-primary)',
                }}>
                  15 abr 2026
                </div>
              </div>
            </div>
          </div>

          <div>
            <label style={labelStyle}>Email de facturación</label>
            <input
              type="email"
              value={billingEmail}
              onChange={(e) => setBillingEmail(e.target.value)}
              placeholder="facturacion@miorganizacion.com"
              style={inputStyle}
              onFocus={(e) => (e.currentTarget.style.borderColor = 'var(--color-accent-primary)')}
              onBlur={(e) => (e.currentTarget.style.borderColor = 'var(--color-border)')}
            />
          </div>
        </div>

        {/* Save */}
        <div style={{
          display: 'flex', alignItems: 'center', justifyContent: 'flex-end',
          gap: '0.75rem',
        }}>
          {saved && (
            <motion.span
              initial={{ opacity: 0, x: 8 }}
              animate={{ opacity: 1, x: 0 }}
              style={{
                fontFamily: 'var(--font-body)', fontSize: '0.8125rem',
                fontWeight: 500, color: '#0D9488',
              }}
            >
              Cambios guardados
            </motion.span>
          )}
          <button
            type="submit"
            disabled={saving}
            style={{
              display: 'inline-flex', alignItems: 'center', gap: '0.5rem',
              padding: '0.625rem 1.5rem', borderRadius: 'var(--radius-sm)',
              background: 'var(--color-accent-primary)',
              color: '#fff', border: 'none', cursor: 'pointer',
              fontFamily: 'var(--font-body)', fontSize: '0.875rem', fontWeight: 600,
              transition: 'background 0.15s',
              opacity: saving ? 0.7 : 1,
            }}
            onMouseEnter={(e) => (e.currentTarget.style.background = 'var(--color-accent-hover)')}
            onMouseLeave={(e) => (e.currentTarget.style.background = 'var(--color-accent-primary)')}
          >
            <Save size={16} />
            {saving ? 'Guardando...' : 'Guardar cambios'}
          </button>
        </div>
      </form>
    </motion.div>
  )
}
