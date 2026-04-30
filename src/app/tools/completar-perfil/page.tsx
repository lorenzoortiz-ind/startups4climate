'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  ArrowRight,
  ArrowLeft,
  CheckCircle2,
  User,
  Briefcase,
  Globe,
  Sparkles,
  Target,
  DollarSign,
  Award,
} from 'lucide-react'
import { useAuth, DEMO_FOUNDER_ID } from '@/context/AuthContext'
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

const PERU_REGIONS = [
  'Amazonas', 'Áncash', 'Apurímac', 'Arequipa', 'Ayacucho', 'Cajamarca',
  'Callao', 'Cusco', 'Huancavelica', 'Huánuco', 'Ica', 'Junín', 'La Libertad',
  'Lambayeque', 'Lima', 'Loreto', 'Madre de Dios', 'Moquegua', 'Pasco',
  'Piura', 'Puno', 'San Martín', 'Tacna', 'Tumbes', 'Ucayali',
  'Resto LATAM',
]

const ROLE_OPTIONS = ['CEO / Founder', 'CTO', 'COO', 'CMO', 'CPO', 'Otro']

const EXPERIENCE_OPTIONS = [
  'Primera startup',
  '1-2 startups anteriores',
  '3+ startups',
  'Experiencia corporativa',
]

const BUSINESS_MODEL_OPTIONS = [
  'B2B',
  'B2C',
  'B2B2C',
  'Marketplace',
  'SaaS',
  'Hardware',
  'Servicios',
]

const PRICING_PLACEHOLDER = 'Ej: Suscripción mensual + setup fee'

const CERTIFICATION_OPTIONS = [
  'B Corp',
  'B Corp en proceso',
  'ISO 14001',
  'TÜV Compostable',
  'TÜV Compostable en proceso',
  'EN 13432',
  'Comercio Justo',
  'Orgánico',
  'Carbono Neutro',
  'Ninguna',
]

const SDG_OPTIONS = [
  'ODS 1', 'ODS 2', 'ODS 3', 'ODS 4', 'ODS 5', 'ODS 6', 'ODS 7',
  'ODS 8', 'ODS 9', 'ODS 10', 'ODS 11', 'ODS 12', 'ODS 13', 'ODS 14',
  'ODS 15', 'ODS 16', 'ODS 17',
]

const inputStyle: React.CSSProperties = {
  width: '100%',
  padding: '0.75rem 1rem',
  borderRadius: 10,
  border: '1px solid var(--color-border)',
  fontFamily: 'var(--font-body)',
  fontSize: '0.875rem',
  color: 'var(--color-text-primary)',
  background: 'var(--color-bg-card)',
  outline: 'none',
  transition: 'border-color 0.2s ease, box-shadow 0.2s ease',
  boxSizing: 'border-box' as const,
}

const selectStyle: React.CSSProperties = {
  ...inputStyle,
  appearance: 'none' as const,
  backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 12 12'%3E%3Cpath fill='%2394a3b8' d='M2 4l4 4 4-4'/%3E%3C/svg%3E")`,
  backgroundRepeat: 'no-repeat',
  backgroundPosition: 'right 1rem center',
  paddingRight: '2.5rem',
}

const labelStyle: React.CSSProperties = {
  display: 'block',
  fontFamily: 'var(--font-body)',
  fontSize: '0.8125rem',
  fontWeight: 600,
  color: 'var(--color-text-secondary)',
  marginBottom: '0.375rem',
}

const chipBase: React.CSSProperties = {
  padding: '0.375rem 0.75rem',
  borderRadius: 999,
  fontFamily: 'var(--font-body)',
  fontSize: '0.75rem',
  fontWeight: 500,
  cursor: 'pointer',
  border: '1px solid var(--color-border)',
  background: 'var(--color-bg-card)',
  color: 'var(--color-text-secondary)',
  transition: 'all 0.15s ease',
  userSelect: 'none' as const,
}

const chipActive: React.CSSProperties = {
  ...chipBase,
  background: 'var(--color-accent-secondary)',
  color: '#fff',
  borderColor: 'var(--color-accent-secondary)',
}

function Chips({
  options,
  selected,
  onToggle,
}: {
  options: string[]
  selected: string[]
  onToggle: (v: string) => void
}) {
  return (
    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.375rem' }}>
      {options.map((opt) => {
        const isActive = selected.includes(opt)
        return (
          <span
            key={opt}
            onClick={() => onToggle(opt)}
            style={isActive ? chipActive : chipBase}
          >
            {opt}
          </span>
        )
      })}
    </div>
  )
}

export default function CompletarPerfilPage() {
  const { user, isDemo } = useAuth()
  const router = useRouter()
  const [step, setStep] = useState(1)
  const [saving, setSaving] = useState(false)

  // Step 1 — quién eres
  const [vertical, setVertical] = useState('')
  const [country, setCountry] = useState('')
  const [region, setRegion] = useState('')
  const [role, setRole] = useState('')
  const [experience, setExperience] = useState('')
  const [linkedin, setLinkedin] = useState('')

  // Step 2 — tu startup
  const [description, setDescription] = useState('')
  const [teamSize, setTeamSize] = useState('')
  const [foundedYear, setFoundedYear] = useState('')
  const [website, setWebsite] = useState('')
  const [businessModel, setBusinessModel] = useState('')
  const [pricingModel, setPricingModel] = useState('')

  // Step 3 — tracción + impacto
  const [currentMRR, setCurrentMRR] = useState('')
  const [totalFunding, setTotalFunding] = useState('')
  const [mainCustomers, setMainCustomers] = useState('')
  const [certifications, setCertifications] = useState<string[]>([])
  const [sdgImpact, setSdgImpact] = useState<string[]>([])
  const [mainChallenges, setMainChallenges] = useState('')

  // Demo pre-fill for Ana Quispe
  useEffect(() => {
    if (!isDemo || user?.id !== DEMO_FOUNDER_ID) return
    setVertical('cleantech_climatech')
    setCountry('Perú')
    setRegion('Madre de Dios')
    setRole('CEO / Founder')
    setExperience('1-2 startups anteriores')
    setLinkedin('https://linkedin.com/in/ana-quispe-ecobio')
    setDescription(
      'EcoBio Perú transforma cáscara de cacao y bagazo de yuca de cooperativas amazónicas en empaques compostables de alta performance para el food service latinoamericano. 23 clientes B2B activos (Hilton, Belmond, Central, Maido), $47K MRR, 12% MoM, certificación EN 13432, 3 patentes en proceso.'
    )
    setTeamSize('7')
    setFoundedYear('2023')
    setWebsite('https://ecobioperu.com')
    setBusinessModel('B2B')
    setPricingModel(
      'Suscripción mensual recurrente con descuento por volumen anual + branding personalizado (+15% premium) + dashboard ESG ($300/mes Enterprise)'
    )
    setCurrentMRR('47000')
    setTotalFunding('0')
    setMainCustomers(
      '1) Cadenas hoteleras premium (Hilton Lima, Belmond Miraflores, Marriott) — 38% del MRR. 2) Restaurantes de autor (Central, Maido, Astrid & Gastón, La Mar) — 32% del MRR. 3) Cadenas gastronómicas medianas (Sabores del Pacífico 12 locales, IK, Panchita del Grupo Acurio) — 30% del MRR.'
    )
    setCertifications(['B Corp en proceso', 'TÜV Compostable en proceso', 'EN 13432', 'Comercio Justo'])
    setSdgImpact(['ODS 12', 'ODS 13', 'ODS 15', 'ODS 8'])
    setMainChallenges(
      '1) Escalar producción industrial de 50K a 200K unidades/mes manteniendo calidad y margen bruto >60%. 2) Cerrar ronda pre-seed de $500K para financiar molde industrial y expansión a Chile/Colombia. 3) Obtener certificación TÜV Compostable internacional sin frenar velocidad comercial local.'
    )
  }, [isDemo, user?.id])

  // Prefill from previously saved data so founders don't re-enter what they
  // already provided in the diagnostic or in a prior completar-perfil run.
  // Sources (in priority order): supabase.startups row → localStorage backup.
  useEffect(() => {
    if (isDemo || !user?.id) return
    let cancelled = false

    const setIfEmpty = (
      current: string,
      next: unknown,
      setter: (v: string) => void,
    ) => {
      if (current) return
      if (typeof next === 'string' && next.trim()) setter(next)
      else if (typeof next === 'number') setter(String(next))
    }

    const setListIfEmpty = (
      current: string[],
      next: unknown,
      setter: (v: string[]) => void,
    ) => {
      if (current.length > 0) return
      if (Array.isArray(next)) setter(next.filter((x) => typeof x === 'string'))
    }

    ;(async () => {
      try {
        const [startupRes, profileRes] = await Promise.all([
          supabase
            .from('startups')
            .select(
              'vertical, country, description, team_size, website, linkedin'
            )
            .eq('founder_id', user.id)
            .maybeSingle(),
          supabase
            .from('profiles')
            .select('diagnostic_data')
            .eq('id', user.id)
            .maybeSingle(),
        ])

        if (cancelled) return

        const s = startupRes.data
        if (s) {
          setIfEmpty(vertical, s.vertical, setVertical)
          setIfEmpty(country, s.country, setCountry)
          setIfEmpty(description, s.description, setDescription)
          setIfEmpty(teamSize, s.team_size, setTeamSize)
          setIfEmpty(website, s.website, setWebsite)
          setIfEmpty(linkedin, s.linkedin, setLinkedin)
        }

        // Diagnostic answers may carry country in human form ("Perú") even
        // when startups.country was populated as fallback ("PE"). Prefer the
        // diagnostic value only if startups.country is empty.
        const diag = (profileRes.data?.diagnostic_data ?? {}) as Record<
          string,
          unknown
        >
        if (diag) {
          setIfEmpty(country, diag.country, setCountry)
        }

        // Local backup written by handleFinish — restores extra fields not
        // mirrored to Supabase (region, role, experience, MRR, etc).
        const extraKey = `s4c_${user.id}_profile_extra`
        const extraRaw = localStorage.getItem(extraKey)
        if (extraRaw) {
          try {
            const extra = JSON.parse(extraRaw) as Record<string, unknown>
            setIfEmpty(region, extra.region, setRegion)
            setIfEmpty(role, extra.role, setRole)
            setIfEmpty(experience, extra.experience, setExperience)
            setIfEmpty(linkedin, extra.linkedin, setLinkedin)
            setIfEmpty(description, extra.description, setDescription)
            setIfEmpty(teamSize, extra.teamSize, setTeamSize)
            setIfEmpty(foundedYear, extra.foundedYear, setFoundedYear)
            setIfEmpty(website, extra.website, setWebsite)
            setIfEmpty(businessModel, extra.businessModel, setBusinessModel)
            setIfEmpty(pricingModel, extra.pricingModel, setPricingModel)
            setIfEmpty(currentMRR, extra.currentMRR, setCurrentMRR)
            setIfEmpty(totalFunding, extra.totalFunding, setTotalFunding)
            setIfEmpty(mainCustomers, extra.mainCustomers, setMainCustomers)
            setListIfEmpty(certifications, extra.certifications, setCertifications)
            setListIfEmpty(sdgImpact, extra.sdgImpact, setSdgImpact)
            setIfEmpty(mainChallenges, extra.mainChallenges, setMainChallenges)
          } catch {
            /* ignore corrupt backup */
          }
        }
      } catch (err) {
        console.error('[S4C Sync] completar-perfil prefill failed:', err)
      }
    })()

    return () => {
      cancelled = true
    }
    // We deliberately depend only on user/demo to run a single hydration
    // pass; we never overwrite values the user is currently editing.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isDemo, user?.id])

  const toggle = (list: string[], setList: (v: string[]) => void) => (v: string) => {
    if (list.includes(v)) setList(list.filter((x) => x !== v))
    else setList([...list, v])
  }

  const handleFinish = async () => {
    setSaving(true)
    const profileData = {
      vertical,
      country,
      region,
      role,
      experience,
      linkedin,
      description,
      teamSize: teamSize ? Number(teamSize) : null,
      foundedYear: foundedYear ? Number(foundedYear) : null,
      website,
      businessModel,
      pricingModel,
      currentMRR: currentMRR ? Number(currentMRR) : null,
      totalFunding: totalFunding ? Number(totalFunding) : null,
      mainCustomers,
      certifications,
      sdgImpact,
      mainChallenges,
      completedAt: new Date().toISOString(),
    }

    // Save to localStorage (namespaced by userId) — full payload
    const extraKey = user?.id ? `s4c_${user.id}_profile_extra` : 's4c_profile_extra'
    try {
      localStorage.setItem(extraKey, JSON.stringify(profileData))
    } catch {
      // ignore quota errors
    }

    // Best-effort upsert to Supabase startups table — only fields that map to existing columns
    if (!isDemo && user?.id) {
      try {
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
      } catch {
        // Best effort — silently continue, full payload still in localStorage
      }
    }

    router.push('/tools')
  }

  const step1Valid = vertical && country && role && experience
  const step2Valid = description && teamSize && businessModel

  return (
    <div
      style={{
        minHeight: '100dvh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '2rem 1rem',
        background: 'var(--color-bg-primary)',
      }}
    >
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        style={{
          width: '100%',
          maxWidth: 580,
          background: 'var(--color-bg-card)',
          borderRadius: 16,
          border: '1px solid var(--color-border)',
          padding: '2.5rem 2rem',
          boxShadow: 'var(--shadow-card)',
        }}
      >
        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <div
            style={{
              width: 48,
              height: 48,
              borderRadius: 12,
              background: 'var(--color-success-light)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 1rem',
            }}
          >
            <Sparkles size={24} color="var(--color-accent-secondary)" />
          </div>
          <h1
            style={{
              fontFamily: 'var(--font-heading)',
              fontSize: '1.5rem',
              fontWeight: 700,
              color: 'var(--color-text-primary)',
              margin: 0,
            }}
          >
            Completa tu perfil
          </h1>
          <p
            style={{
              fontFamily: 'var(--font-body)',
              fontSize: '0.875rem',
              color: 'var(--color-text-muted)',
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
            gap: '0.5rem',
            marginBottom: '2rem',
            flexWrap: 'wrap',
          }}
        >
          {[1, 2, 3].map((s) => (
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
                  fontFamily: 'var(--font-body)',
                  background: step >= s ? 'var(--color-accent-secondary)' : 'var(--color-cream)',
                  color: step >= s ? '#fff' : 'var(--color-text-muted)',
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
                  color: step === s ? 'var(--color-text-primary)' : 'var(--color-text-muted)',
                }}
              >
                Paso {s} de 3
              </span>
              {s < 3 && (
                <div
                  style={{
                    width: 24,
                    height: 2,
                    background: step > s ? 'var(--color-accent-secondary)' : 'var(--color-border)',
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

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
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
                      <option value="">Selecciona país</option>
                      {LATAM_COUNTRIES.map((c) => (
                        <option key={c} value={c}>
                          {c}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label style={labelStyle}>Región</label>
                    <select
                      style={selectStyle}
                      value={region}
                      onChange={(e) => setRegion(e.target.value)}
                    >
                      <option value="">Selecciona región</option>
                      {PERU_REGIONS.map((r) => (
                        <option key={r} value={r}>
                          {r}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

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

              <button
                onClick={() => setStep(2)}
                disabled={!step1Valid}
                style={{
                  width: '100%',
                  marginTop: '1.75rem',
                  padding: '0.75rem 1.5rem',
                  borderRadius: 10,
                  border: 'none',
                  background: step1Valid ? 'var(--color-accent-secondary)' : 'var(--color-border)',
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
                <div>
                  <label style={labelStyle}>Descripción breve de tu startup</label>
                  <textarea
                    style={{ ...inputStyle, minHeight: 100, resize: 'vertical' }}
                    placeholder="¿Qué hace tu startup? ¿Qué problema resuelve y para quién?"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                  />
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
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
                  <div>
                    <label style={labelStyle}>Año de fundación</label>
                    <input
                      type="number"
                      style={inputStyle}
                      placeholder="Ej: 2024"
                      min={1990}
                      max={new Date().getFullYear()}
                      value={foundedYear}
                      onChange={(e) => setFoundedYear(e.target.value)}
                    />
                  </div>
                </div>

                <div>
                  <label style={labelStyle}>
                    Sitio web{' '}
                    <span style={{ fontWeight: 400, color: 'var(--color-text-muted)' }}>
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

                <div>
                  <label style={labelStyle}>Modelo de negocio</label>
                  <select
                    style={selectStyle}
                    value={businessModel}
                    onChange={(e) => setBusinessModel(e.target.value)}
                  >
                    <option value="">Selecciona modelo</option>
                    {BUSINESS_MODEL_OPTIONS.map((m) => (
                      <option key={m} value={m}>
                        {m}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label style={labelStyle}>
                    Modelo de pricing{' '}
                    <span style={{ fontWeight: 400, color: 'var(--color-text-muted)' }}>
                      (opcional)
                    </span>
                  </label>
                  <input
                    type="text"
                    style={inputStyle}
                    placeholder={PRICING_PLACEHOLDER}
                    value={pricingModel}
                    onChange={(e) => setPricingModel(e.target.value)}
                  />
                </div>
              </div>

              <div style={{ display: 'flex', gap: '0.75rem', marginTop: '1.75rem' }}>
                <button
                  onClick={() => setStep(1)}
                  style={{
                    padding: '0.75rem 1.25rem',
                    borderRadius: 10,
                    border: '1px solid var(--color-border)',
                    background: 'var(--color-bg-card)',
                    color: 'var(--color-text-secondary)',
                    fontFamily: 'var(--font-body)',
                    fontSize: '0.875rem',
                    fontWeight: 500,
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.375rem',
                  }}
                >
                  <ArrowLeft size={16} />
                  Atrás
                </button>
                <button
                  onClick={() => setStep(3)}
                  disabled={!step2Valid}
                  style={{
                    flex: 1,
                    padding: '0.75rem 1.5rem',
                    borderRadius: 10,
                    border: 'none',
                    background: step2Valid ? 'var(--color-accent-secondary)' : 'var(--color-border)',
                    color: '#fff',
                    fontFamily: 'var(--font-body)',
                    fontSize: '0.875rem',
                    fontWeight: 600,
                    cursor: step2Valid ? 'pointer' : 'not-allowed',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '0.5rem',
                  }}
                >
                  Siguiente
                  <ArrowRight size={16} />
                </button>
              </div>
            </motion.div>
          )}

          {step === 3 && (
            <motion.div
              key="step3"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
            >
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
                  <div>
                    <label style={labelStyle}>
                      <DollarSign size={14} style={{ marginRight: 6, verticalAlign: 'middle' }} />
                      MRR actual (USD){' '}
                      <span style={{ fontWeight: 400, color: 'var(--color-text-muted)' }}>
                        (opcional)
                      </span>
                    </label>
                    <input
                      type="number"
                      style={inputStyle}
                      placeholder="Ej: 5000"
                      min={0}
                      value={currentMRR}
                      onChange={(e) => setCurrentMRR(e.target.value)}
                    />
                  </div>
                  <div>
                    <label style={labelStyle}>
                      Funding total (USD){' '}
                      <span style={{ fontWeight: 400, color: 'var(--color-text-muted)' }}>
                        (opcional)
                      </span>
                    </label>
                    <input
                      type="number"
                      style={inputStyle}
                      placeholder="Ej: 100000"
                      min={0}
                      value={totalFunding}
                      onChange={(e) => setTotalFunding(e.target.value)}
                    />
                  </div>
                </div>

                <div>
                  <label style={labelStyle}>
                    ¿Quiénes son tus 3 principales clientes/segmentos?
                  </label>
                  <textarea
                    style={{ ...inputStyle, minHeight: 80, resize: 'vertical' }}
                    placeholder="Lista tus principales clientes o segmentos con un breve detalle..."
                    value={mainCustomers}
                    onChange={(e) => setMainCustomers(e.target.value)}
                  />
                </div>

                <div>
                  <label style={labelStyle}>
                    <Award size={14} style={{ marginRight: 6, verticalAlign: 'middle' }} />
                    Certificaciones
                  </label>
                  <Chips
                    options={CERTIFICATION_OPTIONS}
                    selected={certifications}
                    onToggle={toggle(certifications, setCertifications)}
                  />
                </div>

                <div>
                  <label style={labelStyle}>
                    <Target size={14} style={{ marginRight: 6, verticalAlign: 'middle' }} />
                    ODS de impacto
                  </label>
                  <Chips
                    options={SDG_OPTIONS}
                    selected={sdgImpact}
                    onToggle={toggle(sdgImpact, setSdgImpact)}
                  />
                </div>

                <div>
                  <label style={labelStyle}>
                    ¿Cuáles son tus 3 retos principales actualmente?
                  </label>
                  <textarea
                    style={{ ...inputStyle, minHeight: 90, resize: 'vertical' }}
                    placeholder="Ej: 1) Escalar producción. 2) Acceso a capital. 3) Talento técnico..."
                    value={mainChallenges}
                    onChange={(e) => setMainChallenges(e.target.value)}
                  />
                </div>
              </div>

              <div style={{ display: 'flex', gap: '0.75rem', marginTop: '1.75rem' }}>
                <button
                  onClick={() => setStep(2)}
                  style={{
                    padding: '0.75rem 1.25rem',
                    borderRadius: 10,
                    border: '1px solid var(--color-border)',
                    background: 'var(--color-bg-card)',
                    color: 'var(--color-text-secondary)',
                    fontFamily: 'var(--font-body)',
                    fontSize: '0.875rem',
                    fontWeight: 500,
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.375rem',
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
                    background: 'var(--color-accent-secondary)',
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
              color: 'var(--color-text-muted)',
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
