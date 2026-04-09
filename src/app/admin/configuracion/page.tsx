'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Save, Building2, CreditCard, Globe, Loader2 } from 'lucide-react'
import { supabase } from '@/lib/supabase'
import { useAuth } from '@/context/AuthContext'

const PLAN_LABELS: Record<string, string> = {
  starter: 'Starter',
  professional: 'Professional',
  enterprise: 'Enterprise',
  institutional: 'Institutional',
}

const cardStyle: React.CSSProperties = {
  background: 'var(--color-bg-card)',
  border: '1px solid var(--color-border)',
  borderRadius: 'var(--radius-md)',
  padding: '1.5rem',
  boxShadow: 'var(--shadow-card)',
}

const inputStyle: React.CSSProperties = {
  width: '100%',
  padding: '0.5rem 0.75rem',
  borderRadius: 'var(--radius-sm)',
  border: '1px solid var(--color-border)',
  background: 'var(--color-bg-card)',
  fontFamily: 'var(--font-body)',
  fontSize: '0.8125rem',
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

interface OrgData {
  name: string
  website: string | null
  logo_url: string | null
  billing_email: string | null
  plan: string
  max_startups: number
  contract_end: string | null
}

export default function ConfiguracionPage() {
  const { appUser } = useAuth()
  const [loading, setLoading] = useState(true)
  const [orgName, setOrgName] = useState('')
  const [website, setWebsite] = useState('')
  const [logoUrl, setLogoUrl] = useState('')
  const [billingEmail, setBillingEmail] = useState('')
  const [plan, setPlan] = useState('starter')
  const [maxStartups, setMaxStartups] = useState(25)
  const [contractEnd, setContractEnd] = useState<string | null>(null)
  const [startupCount, setStartupCount] = useState(0)
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!appUser?.org_id) return

    async function loadOrg() {
      setLoading(true)
      const { data: org } = await supabase
        .from('organizations')
        .select('*')
        .eq('id', appUser!.org_id!)
        .single()

      if (org) {
        setOrgName(org.name || '')
        setWebsite(org.website || '')
        setLogoUrl(org.logo_url || '')
        setBillingEmail(org.billing_email || '')
        setPlan(org.plan || 'starter')
        setMaxStartups(org.max_startups || 25)
        setContractEnd(org.contract_end)
      }

      // Count startups in org's cohorts
      const { data: cohorts } = await supabase
        .from('cohorts')
        .select('id')
        .eq('org_id', appUser!.org_id!)

      if (cohorts && cohorts.length > 0) {
        const { count } = await supabase
          .from('cohort_startups')
          .select('id', { count: 'exact', head: true })
          .in('cohort_id', cohorts.map((c) => c.id))

        setStartupCount(count || 0)
      }

      setLoading(false)
    }

    loadOrg()
  }, [appUser?.org_id])

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!appUser?.org_id) return

    setSaving(true)
    setError(null)

    const { error: updateError } = await supabase
      .from('organizations')
      .update({
        name: orgName.trim(),
        website: website.trim() || null,
        logo_url: logoUrl.trim() || null,
        billing_email: billingEmail.trim() || null,
      })
      .eq('id', appUser.org_id)

    if (updateError) {
      setError('Error al guardar los cambios. Intenta de nuevo.')
    } else {
      setSaved(true)
      setTimeout(() => setSaved(false), 3000)
    }
    setSaving(false)
  }

  if (loading) {
    return (
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '60vh' }}>
        <Loader2 size={28} color="var(--color-accent-primary)" style={{ animation: 'spin 1s linear infinite' }} />

      </div>
    )
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
          fontSize: '1.25rem', color: 'var(--color-text-primary)',
          marginBottom: '0.25rem',
        }}>
          Configuración
        </h1>
        <p style={{
          fontFamily: 'var(--font-body)', fontSize: '0.8125rem',
          color: 'var(--color-text-secondary)',
        }}>
          Administra los datos de tu organización y plan
        </p>
      </div>

      {error && (
        <div style={{
          padding: '0.75rem 1rem', borderRadius: 'var(--radius-sm)',
          background: '#FEF2F2', border: '1px solid #FECACA',
          color: '#DC2626', fontFamily: 'var(--font-body)', fontSize: '0.8125rem',
          marginBottom: '1rem',
        }}>
          {error}
        </div>
      )}

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
              fontSize: '1rem', color: 'var(--color-text-primary)',
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
              placeholder="https://miorganización.com"
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
              fontSize: '1rem', color: 'var(--color-text-primary)',
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
                  Plan {PLAN_LABELS[plan] || plan}
                </div>
                <div style={{
                  fontFamily: 'var(--font-body)', fontSize: '0.8125rem',
                  color: 'var(--color-text-secondary)',
                }}>
                  Hasta {maxStartups} startups
                </div>
              </div>
              <span style={{
                padding: '0.25rem 0.75rem', borderRadius: 'var(--radius-xl)',
                background: 'rgba(13,148,136,0.08)', color: '#0D9488',
                fontFamily: 'var(--font-body)', fontSize: '0.6875rem', fontWeight: 500,
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
                  fontFamily: 'var(--font-body)', fontSize: '0.625rem',
                  color: 'var(--color-text-muted)', textTransform: 'uppercase',
                  letterSpacing: '0.05em', marginBottom: '0.125rem',
                }}>
                  Startups usadas
                </div>
                <div style={{
                  fontFamily: 'var(--font-heading)', fontWeight: 600,
                  fontSize: '0.9375rem', color: 'var(--color-text-primary)',
                }}>
                  {startupCount} / {maxStartups}
                </div>
              </div>
              <div>
                <div style={{
                  fontFamily: 'var(--font-body)', fontSize: '0.625rem',
                  color: 'var(--color-text-muted)', textTransform: 'uppercase',
                  letterSpacing: '0.05em', marginBottom: '0.125rem',
                }}>
                  Fin del contrato
                </div>
                <div style={{
                  fontFamily: 'var(--font-heading)', fontWeight: 600,
                  fontSize: '0.9375rem', color: 'var(--color-text-primary)',
                }}>
                  {contractEnd
                    ? new Date(contractEnd).toLocaleDateString('es-CL', { day: 'numeric', month: 'short', year: 'numeric' })
                    : 'Sin definir'}
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
              placeholder="facturación@miorganización.com"
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
              padding: '0.5rem 1rem', borderRadius: 8,
              background: 'var(--color-accent-primary)',
              color: '#fff', border: 'none', cursor: 'pointer',
              fontFamily: 'var(--font-body)', fontSize: '0.8125rem', fontWeight: 600,
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
