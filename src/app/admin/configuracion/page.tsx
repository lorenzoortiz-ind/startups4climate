'use client'

import { useState, useEffect, useRef } from 'react'
import { motion } from 'framer-motion'
import { Save, Building2, CreditCard, Globe, Loader2, Image as ImageIcon, Upload } from 'lucide-react'
import { supabase } from '@/lib/supabase'
import { useAuth } from '@/context/AuthContext'
import { DEMO_ORG } from '@/lib/demo/admin-fixtures'

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

const MOCK_DEMO_ORG: OrgData & { startup_count: number } = {
  name: DEMO_ORG.name,
  website: 'https://bioinnova.unamad.edu.pe',
  logo_url: null,
  billing_email: 'facturacion@bioinnova.unamad.edu.pe',
  plan: DEMO_ORG.plan.toLowerCase(),
  max_startups: DEMO_ORG.maxStartups,
  contract_end: DEMO_ORG.contractEnd,
  startup_count: DEMO_ORG.activeStartups,
}

export default function ConfiguracionPage() {
  const { appUser, isDemo } = useAuth()
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
  const [uploading, setUploading] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (isDemo) {
      setOrgName(MOCK_DEMO_ORG.name)
      setWebsite(MOCK_DEMO_ORG.website || '')
      setLogoUrl(MOCK_DEMO_ORG.logo_url || '')
      setBillingEmail(MOCK_DEMO_ORG.billing_email || '')
      setPlan(MOCK_DEMO_ORG.plan)
      setMaxStartups(MOCK_DEMO_ORG.max_startups)
      setContractEnd(MOCK_DEMO_ORG.contract_end)
      setStartupCount(MOCK_DEMO_ORG.startup_count)
      setLoading(false)
      setError(null)
      return
    }

    if (!appUser?.org_id) return

    async function loadOrg() {
      setLoading(true)
      setError(null)

      try {
        const { data: org, error: orgErr } = await supabase
          .from('organizations')
          .select('*')
          .eq('id', appUser!.org_id!)
          .single()

        if (orgErr) throw orgErr

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
      } catch (err) {
        console.error('[S4C Admin] Error loading org settings:', err)
        setError('No se pudieron cargar los datos de la organización.')
      } finally {
        setLoading(false)
      }
    }

    loadOrg()
  }, [appUser?.org_id, isDemo])

  const handleLogoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file || !appUser?.org_id) return

    if (isDemo) {
      setError('La subida de logos está deshabilitada en modo demo.')
      if (fileInputRef.current) fileInputRef.current.value = ''
      return
    }

    const allowedTypes = ['image/png', 'image/jpeg', 'image/svg+xml']
    if (!allowedTypes.includes(file.type)) {
      setError('Solo se permiten archivos PNG, JPG o SVG.')
      return
    }

    setUploading(true)
    setError(null)

    const fileExt = file.name.split('.').pop()
    const filePath = `org-logos/${appUser.org_id}/${Date.now()}.${fileExt}`

    const { error: uploadError } = await supabase.storage
      .from('logos')
      .upload(filePath, file, { upsert: true })

    if (uploadError) {
      setError('Error al subir el logo. Intenta de nuevo.')
      setUploading(false)
      return
    }

    const { data: publicUrlData } = supabase.storage
      .from('logos')
      .getPublicUrl(filePath)

    setLogoUrl(publicUrlData.publicUrl)
    setUploading(false)

    // Reset file input
    if (fileInputRef.current) fileInputRef.current.value = ''
  }

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!appUser?.org_id) return

    if (isDemo) {
      setSaved(true)
      setTimeout(() => setSaved(false), 3000)
      return
    }

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
      {isDemo && (
        <div
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.5rem',
            padding: '0.375rem 0.75rem',
            borderRadius: 999,
            background: 'var(--color-warning-light)',
            border: '1px solid var(--color-warning-border)',
            color: 'var(--color-warning)',
            fontFamily: 'var(--font-body)',
            fontSize: 'var(--text-xs)',
            fontWeight: 500,
            marginBottom: '1rem',
          }}
        >
          Modo demo — los datos son ilustrativos
        </div>
      )}

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
            <label style={labelStyle}>Logo</label>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '0.75rem' }}>
              {/* Logo preview */}
              <div style={{
                width: 80, height: 80, borderRadius: 'var(--radius-md)',
                border: '1px solid var(--color-border)',
                background: 'var(--color-bg-card)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                overflow: 'hidden', flexShrink: 0,
              }}>
                {logoUrl ? (
                  <img
                    src={logoUrl}
                    alt="Logo de la organización"
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                  />
                ) : (
                  <Building2 size={32} color="var(--color-text-muted)" strokeWidth={1.5} />
                )}
              </div>

              {/* Upload controls */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.375rem' }}>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept=".png,.jpg,.jpeg,.svg"
                  onChange={handleLogoUpload}
                  style={{ display: 'none' }}
                />
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  disabled={uploading}
                  style={{
                    display: 'inline-flex', alignItems: 'center', gap: '0.375rem',
                    padding: '0.4rem 0.75rem', borderRadius: 'var(--radius-sm)',
                    border: '1px solid var(--color-border)',
                    background: 'var(--color-bg-card)',
                    color: 'var(--color-text-primary)',
                    fontFamily: 'var(--font-body)', fontSize: '0.8125rem', fontWeight: 500,
                    cursor: uploading ? 'not-allowed' : 'pointer',
                    transition: 'border-color 0.15s, background 0.15s',
                    opacity: uploading ? 0.7 : 1,
                  }}
                  onMouseEnter={(e) => { e.currentTarget.style.borderColor = 'var(--color-accent-primary)'; e.currentTarget.style.background = 'rgba(13,148,136,0.04)' }}
                  onMouseLeave={(e) => { e.currentTarget.style.borderColor = 'var(--color-border)'; e.currentTarget.style.background = 'var(--color-bg-card)' }}
                >
                  {uploading ? (
                    <Loader2 size={14} style={{ animation: 'spin 1s linear infinite' }} />
                  ) : (
                    <Upload size={14} />
                  )}
                  {uploading ? 'Subiendo...' : 'Subir logo'}
                </button>
                <span style={{
                  fontFamily: 'var(--font-body)', fontSize: '0.6875rem',
                  color: 'var(--color-text-muted)',
                }}>
                  O ingresa una URL manualmente
                </span>
              </div>
            </div>

            {/* URL input */}
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
              PNG, JPG o SVG recomendado
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
