'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ArrowRight, ArrowLeft, CheckCircle2, User, Briefcase, Globe, Sparkles } from 'lucide-react'
import { useAuth } from '@/context/AuthContext'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'

const VERTICAL_OPTIONS = [
  { value: 'fintech', label: 'Fintech' },
  { value: 'healthtech', label: 'Healthtech' },
  { value: 'edtech', label: 'Edtech' },
  { value: 'agritech_foodtech', label: 'Agritech / Foodtech' },
  { value: 'cleantech_climatech', label: 'Cleantech / Climatech' },
  { value: 'biotech_deeptech', label: 'Biotech / Deeptech' },
  { value: 'logistics_mobility', label: 'Logística / Movilidad' },
  { value: 'saas_enterprise', label: 'SaaS / Enterprise' },
  { value: 'social_impact', label: 'Impacto Social' },
  { value: 'other', label: 'Otro' },
]

const LATAM_COUNTRIES = [
  'Argentina', 'Bolivia', 'Brasil', 'Chile', 'Colombia', 'Costa Rica', 'Cuba',
  'Ecuador', 'El Salvador', 'Guatemala', 'Honduras', 'México', 'Nicaragua',
  'Panamá', 'Paraguay', 'Perú', 'Puerto Rico', 'República Dominicana',
  'Uruguay', 'Venezuela',
]

const ROLE_OPTIONS = ['CEO / Founder', 'CTO', 'COO', 'CMO', 'CPO', 'Otro']

const EXPERIENCE_OPTIONS = [
  'Primera startup',
  '1-2 startups anteriores',
  '3+ startups',
  'Experiencia corporativa',
]

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
  color: 'var(--color-text-secondary, #374151)',
  marginBottom: '0.375rem',
}

export default function CompletarPerfilPage() {
  const { user } = useAuth()
  const router = useRouter()
  const [step, setStep] = useState(1)
  const [saving, setSaving] = useState(false)

  // Step 1 fields
  const [vertical, setVertical] = useState('')
  const [country, setCountry] = useState('')
  const [role, setRole] = useState('')
  const [experience, setExperience] = useState('')
  const [linkedin, setLinkedin] = useState('')

  // Step 2 fields
  const [description, setDescription] = useState('')
  const [teamSize, setTeamSize] = useState('')
  const [website, setWebsite] = useState('')

  const handleNext = () => {
    setStep(2)
  }

  const handleFinish = async () => {
    setSaving(true)
    const profileData = {
      vertical,
      country,
      role,
      experience,
      linkedin,
      description,
      teamSize: teamSize ? Number(teamSize) : null,
      website,
      completedAt: new Date().toISOString(),
    }

    // Save to localStorage
    localStorage.setItem('s4c_profile_extra', JSON.stringify(profileData))

    // Best-effort upsert to Supabase startups table
    try {
      if (user?.id) {
        await supabase.from('startups').upsert(
          {
            founder_id: user.id,
            name: user.startup || '',
            vertical,
            country,
            description,
            team_size: teamSize ? Number(teamSize) : null,
            website: website || null,
            linkedin: linkedin || null,
          },
          { onConflict: 'founder_id' }
        )
      }
    } catch {
      // Best effort — silently continue
    }

    router.push('/tools')
  }

  const step1Valid = vertical && country && role && experience

  return (
    <div
      style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '2rem 1rem',
        background: 'var(--color-bg-muted, #f9fafb)',
      }}
    >
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        style={{
          width: '100%',
          maxWidth: 540,
          background: 'var(--color-bg-card, #ffffff)',
          borderRadius: 16,
          border: '1px solid var(--color-border, #e5e7eb)',
          padding: '2.5rem 2rem',
          boxShadow: '0 4px 24px rgba(0,0,0,0.06)',
        }}
      >
        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <div
            style={{
              width: 48,
              height: 48,
              borderRadius: 12,
              background: '#ecfdf5',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 1rem',
            }}
          >
            <Sparkles size={24} color="#0D9488" />
          </div>
          <h1
            style={{
              fontFamily: 'var(--font-heading)',
              fontSize: '1.5rem',
              fontWeight: 700,
              color: 'var(--color-text-primary, #111827)',
              margin: 0,
            }}
          >
            Completa tu perfil
          </h1>
          <p
            style={{
              fontFamily: 'var(--font-body)',
              fontSize: '0.875rem',
              color: 'var(--color-text-muted, #6b7280)',
              margin: '0.5rem 0 0',
            }}
          >
            Personalicemos tu experiencia en S4C
          </p>
        </div>

        {/* Stepper */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '0.75rem',
            marginBottom: '2rem',
          }}
        >
          {[1, 2].map((s) => (
            <div key={s} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <div
                style={{
                  width: 28,
                  height: 28,
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '0.75rem',
                  fontWeight: 700,
                  fontFamily: 'var(--font-mono)',
                  background: step >= s ? '#0D9488' : 'var(--color-bg-muted, #f3f4f6)',
                  color: step >= s ? '#fff' : 'var(--color-text-muted, #9ca3af)',
                  transition: 'all 0.3s ease',
                }}
              >
                {step > s ? <CheckCircle2 size={14} /> : s}
              </div>
              <span
                style={{
                  fontFamily: 'var(--font-body)',
                  fontSize: '0.75rem',
                  fontWeight: step === s ? 600 : 400,
                  color: step === s ? 'var(--color-text-primary, #111827)' : 'var(--color-text-muted, #9ca3af)',
                }}
              >
                Paso {s} de 2
              </span>
              {s === 1 && (
                <div
                  style={{
                    width: 32,
                    height: 2,
                    background: step >= 2 ? '#0D9488' : 'var(--color-border, #e5e7eb)',
                    borderRadius: 1,
                    transition: 'background 0.3s ease',
                  }}
                />
              )}
            </div>
          ))}
        </div>

        {/* Steps */}
        <AnimatePresence mode="wait">
          {step === 1 && (
            <motion.div
              key="step1"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              transition={{ duration: 0.3 }}
            >
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                {/* Vertical */}
                <div>
                  <label style={labelStyle}>
                    <Briefcase size={14} style={{ marginRight: 6, verticalAlign: 'middle' }} />
                    Vertical
                  </label>
                  <select
                    style={selectStyle}
                    value={vertical}
                    onChange={(e) => setVertical(e.target.value)}
                  >
                    <option value="">Selecciona una vertical</option>
                    {VERTICAL_OPTIONS.map((v) => (
                      <option key={v.value} value={v.value}>
                        {v.label}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Country */}
                <div>
                  <label style={labelStyle}>
                    <Globe size={14} style={{ marginRight: 6, verticalAlign: 'middle' }} />
                    País
                  </label>
                  <select
                    style={selectStyle}
                    value={country}
                    onChange={(e) => setCountry(e.target.value)}
                  >
                    <option value="">Selecciona tu país</option>
                    {LATAM_COUNTRIES.map((c) => (
                      <option key={c} value={c}>
                        {c}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Role */}
                <div>
                  <label style={labelStyle}>
                    <User size={14} style={{ marginRight: 6, verticalAlign: 'middle' }} />
                    Rol en la startup
                  </label>
                  <select
                    style={selectStyle}
                    value={role}
                    onChange={(e) => setRole(e.target.value)}
                  >
                    <option value="">Selecciona tu rol</option>
                    {ROLE_OPTIONS.map((r) => (
                      <option key={r} value={r}>
                        {r}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Experience */}
                <div>
                  <label style={labelStyle}>Nivel de experiencia</label>
                  <select
                    style={selectStyle}
                    value={experience}
                    onChange={(e) => setExperience(e.target.value)}
                  >
                    <option value="">Selecciona tu experiencia</option>
                    {EXPERIENCE_OPTIONS.map((e) => (
                      <option key={e} value={e}>
                        {e}
                      </option>
                    ))}
                  </select>
                </div>

                {/* LinkedIn */}
                <div>
                  <label style={labelStyle}>LinkedIn URL</label>
                  <input
                    type="url"
                    style={inputStyle}
                    placeholder="https://linkedin.com/in/tu-perfil"
                    value={linkedin}
                    onChange={(e) => setLinkedin(e.target.value)}
                  />
                </div>
              </div>

              {/* Next button */}
              <button
                onClick={handleNext}
                disabled={!step1Valid}
                style={{
                  width: '100%',
                  marginTop: '1.75rem',
                  padding: '0.75rem 1.5rem',
                  borderRadius: 10,
                  border: 'none',
                  background: step1Valid ? '#0D9488' : 'var(--color-border, #d1d5db)',
                  color: '#fff',
                  fontFamily: 'var(--font-body)',
                  fontSize: '0.875rem',
                  fontWeight: 600,
                  cursor: step1Valid ? 'pointer' : 'not-allowed',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '0.5rem',
                  transition: 'background 0.2s ease',
                }}
              >
                Siguiente
                <ArrowRight size={16} />
              </button>
            </motion.div>
          )}

          {step === 2 && (
            <motion.div
              key="step2"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
            >
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                {/* Description */}
                <div>
                  <label style={labelStyle}>Descripción breve de tu startup</label>
                  <textarea
                    style={{
                      ...inputStyle,
                      minHeight: 100,
                      resize: 'vertical',
                    }}
                    placeholder="Cuéntanos en pocas palabras qué hace tu startup..."
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                  />
                </div>

                {/* Team size */}
                <div>
                  <label style={labelStyle}>Tamaño del equipo</label>
                  <input
                    type="number"
                    style={inputStyle}
                    placeholder="Ej: 5"
                    min={1}
                    value={teamSize}
                    onChange={(e) => setTeamSize(e.target.value)}
                  />
                </div>

                {/* Website */}
                <div>
                  <label style={labelStyle}>
                    Sitio web{' '}
                    <span style={{ fontWeight: 400, color: 'var(--color-text-muted, #9ca3af)' }}>
                      (opcional)
                    </span>
                  </label>
                  <input
                    type="url"
                    style={inputStyle}
                    placeholder="https://tu-startup.com"
                    value={website}
                    onChange={(e) => setWebsite(e.target.value)}
                  />
                </div>
              </div>

              {/* Buttons */}
              <div
                style={{
                  display: 'flex',
                  gap: '0.75rem',
                  marginTop: '1.75rem',
                }}
              >
                <button
                  onClick={() => setStep(1)}
                  style={{
                    padding: '0.75rem 1.25rem',
                    borderRadius: 10,
                    border: '1px solid var(--color-border, #e5e7eb)',
                    background: 'var(--color-bg-card, #ffffff)',
                    color: 'var(--color-text-secondary, #374151)',
                    fontFamily: 'var(--font-body)',
                    fontSize: '0.875rem',
                    fontWeight: 500,
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.375rem',
                    transition: 'background 0.2s ease',
                  }}
                >
                  <ArrowLeft size={16} />
                  Atrás
                </button>

                <button
                  onClick={handleFinish}
                  disabled={saving}
                  style={{
                    flex: 1,
                    padding: '0.75rem 1.5rem',
                    borderRadius: 10,
                    border: 'none',
                    background: '#0D9488',
                    color: '#fff',
                    fontFamily: 'var(--font-body)',
                    fontSize: '0.875rem',
                    fontWeight: 600,
                    cursor: saving ? 'not-allowed' : 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '0.5rem',
                    opacity: saving ? 0.7 : 1,
                    transition: 'background 0.2s ease, opacity 0.2s ease',
                  }}
                >
                  {saving ? 'Guardando...' : 'Completar perfil'}
                  {!saving && <CheckCircle2 size={16} />}
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Skip link */}
        <div style={{ textAlign: 'center', marginTop: '1.5rem' }}>
          <button
            onClick={() => router.push('/tools')}
            style={{
              background: 'none',
              border: 'none',
              fontFamily: 'var(--font-body)',
              fontSize: '0.8125rem',
              color: 'var(--color-text-muted, #9ca3af)',
              cursor: 'pointer',
              textDecoration: 'underline',
              textUnderlineOffset: '2px',
            }}
          >
            Saltar por ahora
          </button>
        </div>
      </motion.div>
    </div>
  )
}
