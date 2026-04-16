'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { ArrowLeft, Save, User, CheckCircle2, Mail, Phone, Globe, Link2 } from 'lucide-react'
import { useAuth } from '@/context/AuthContext'
import { STAGE_META } from '@/lib/tools-data'
import { supabase } from '@/lib/supabase'

const ROLE_OPTIONS = [
  'CEO / Founder',
  'CTO',
  'COO',
  'CMO',
  'CPO',
  'Otro',
]

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
  'Panamá', 'Paraguay', 'Perú', 'Puerto Rico', 'República Dominicana', 'Uruguay', 'Venezuela',
]

const STAGE_LABELS: Record<string, { label: string; color: string; bg: string }> = {
  '1': { label: 'Pre-incubación', color: STAGE_META[1].color, bg: STAGE_META[1].bg },
  '2': { label: 'Incubación', color: STAGE_META[2].color, bg: STAGE_META[2].bg },
  '3': { label: 'Aceleración', color: STAGE_META[3].color, bg: STAGE_META[3].bg },
  '4': { label: 'Escalamiento', color: STAGE_META[4].color, bg: STAGE_META[4].bg },
}

/* Typeform-style input: border-bottom only */
function TFInput({
  label,
  icon,
  type = 'text',
  value,
  onChange,
  placeholder,
  readOnly = false,
}: {
  label: string
  icon?: React.ReactNode
  type?: string
  value: string
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void
  placeholder?: string
  readOnly?: boolean
}) {
  const [focused, setFocused] = useState(false)
  return (
    <div>
      <label
        style={{
          display: 'block',
          fontFamily: 'var(--font-body)',
          fontSize: '0.75rem',
          fontWeight: 700,
          color: 'var(--color-text-muted)',
          textTransform: 'uppercase',
          letterSpacing: '0.06em',
          marginBottom: '0.25rem',
        }}
      >
        {label}
      </label>
      <div
        style={{
          display: 'flex',
          alignItems: 'flex-end',
          gap: '0.625rem',
          borderBottom: `2px solid ${focused && !readOnly ? 'var(--color-ink)' : 'var(--color-border)'}`,
          transition: 'border-color 0.2s ease',
          paddingBottom: '0.125rem',
        }}
      >
        {icon && (
          <span style={{ flexShrink: 0, paddingBottom: '0.75rem', opacity: focused ? 1 : 0.4, transition: 'opacity 0.2s', color: 'var(--color-text-secondary)' }}>
            {icon}
          </span>
        )}
        <input
          type={type}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          readOnly={readOnly}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          style={{
            flex: 1,
            padding: '0.375rem 0 0.75rem',
            border: 'none',
            background: 'transparent',
            fontFamily: 'var(--font-body)',
            fontSize: 'var(--text-heading-md)',
            color: readOnly ? 'var(--color-text-muted)' : 'var(--color-ink)',
            outline: 'none',
            letterSpacing: '-0.01em',
            cursor: readOnly ? 'not-allowed' : 'text',
          }}
        />
      </div>
    </div>
  )
}

function TFSelect({
  label,
  value,
  onChange,
  options,
  placeholder,
}: {
  label: string
  value: string
  onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void
  options: { value: string; label: string }[] | string[]
  placeholder: string
}) {
  const [focused, setFocused] = useState(false)
  const normalizedOptions = options.map((o) =>
    typeof o === 'string' ? { value: o, label: o } : o
  )
  return (
    <div>
      <label
        style={{
          display: 'block',
          fontFamily: 'var(--font-body)',
          fontSize: '0.75rem',
          fontWeight: 700,
          color: 'var(--color-text-muted)',
          textTransform: 'uppercase',
          letterSpacing: '0.06em',
          marginBottom: '0.25rem',
        }}
      >
        {label}
      </label>
      <div
        style={{
          borderBottom: `2px solid ${focused ? 'var(--color-ink)' : 'var(--color-border)'}`,
          transition: 'border-color 0.2s ease',
          paddingBottom: '0.125rem',
        }}
      >
        <select
          value={value}
          onChange={onChange}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          style={{
            width: '100%',
            padding: '0.375rem 2rem 0.75rem 0',
            border: 'none',
            background: 'transparent',
            fontFamily: 'var(--font-body)',
            fontSize: 'var(--text-heading-md)',
            color: value ? 'var(--color-ink)' : 'var(--color-text-muted)',
            outline: 'none',
            letterSpacing: '-0.01em',
            appearance: 'none',
            backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='14' height='14' viewBox='0 0 14 14'%3E%3Cpath fill='%2394a3b8' d='M2 4l5 6 5-6'/%3E%3C/svg%3E")`,
            backgroundRepeat: 'no-repeat',
            backgroundPosition: 'right 0.25rem center',
            cursor: 'pointer',
          }}
        >
          <option value="">{placeholder}</option>
          {normalizedOptions.map((o) => (
            <option key={o.value} value={o.value}>
              {o.label}
            </option>
          ))}
        </select>
      </div>
    </div>
  )
}

export default function PerfilPage() {
  const { user, appUser, updateProfile } = useAuth()

  const [nombre, setNombre] = useState('')
  const [startupName, setStartupName] = useState('')
  const [descripcion, setDescripcion] = useState('')
  const [vertical, setVertical] = useState('')
  const [country, setCountry] = useState('')
  const [phone, setPhone] = useState('')
  const [linkedin, setLinkedin] = useState('')
  const [website, setWebsite] = useState('')
  const [role, setRole] = useState('')
  const [teamSize, setTeamSize] = useState('')
  const [saved, setSaved] = useState(false)
  const [saving, setSaving] = useState(false)
  const [radarNewsletter, setRadarNewsletter] = useState(false)
  const [oppsNewsletter, setOppsNewsletter] = useState(false)

  useEffect(() => {
    if (user) {
      setNombre(user.name || '')
      setStartupName(user.startup || '')
    }

    async function loadStartupData() {
      if (!appUser) return

      try {
        const { data: startup } = await supabase
          .from('startups')
          .select('*')
          .eq('founder_id', appUser.id)
          .single()

        if (startup) {
          if (startup.name) setStartupName(startup.name)
          if (startup.description) setDescripcion(startup.description)
          if (startup.vertical) setVertical(startup.vertical)
          if (startup.country) setCountry(startup.country)
          if (startup.website) setWebsite(startup.website)
          if (startup.team_size) setTeamSize(String(startup.team_size))
          if (typeof window !== 'undefined') {
            try {
              const extraKey = appUser ? `s4c_${appUser.id}_profile_extra` : 's4c_profile_extra'
              const extra = JSON.parse(localStorage.getItem(extraKey) || localStorage.getItem('s4c_profile_extra') || '{}')
              if (extra.role) setRole(extra.role)
              if (extra.linkedin) setLinkedin(extra.linkedin)
              if (extra.phone) setPhone(extra.phone)
              if (extra.radarNewsletter) setRadarNewsletter(extra.radarNewsletter)
              if (extra.oppsNewsletter) setOppsNewsletter(extra.oppsNewsletter)
            } catch { /* ignore */ }
          }
          return
        }
      } catch { /* Supabase query failed — fall through to localStorage */ }

      if (typeof window !== 'undefined') {
        try {
          const extraKey = appUser ? `s4c_${appUser.id}_profile_extra` : 's4c_profile_extra'
          const extra = JSON.parse(localStorage.getItem(extraKey) || localStorage.getItem('s4c_profile_extra') || '{}')
          if (extra.role) setRole(extra.role)
          if (extra.linkedin) setLinkedin(extra.linkedin)
          if (extra.descripcion) setDescripcion(extra.descripcion)
          if (extra.vertical) setVertical(extra.vertical)
          if (extra.country) setCountry(extra.country)
          if (extra.phone) setPhone(extra.phone)
          if (extra.website) setWebsite(extra.website)
          if (extra.teamSize) setTeamSize(String(extra.teamSize))
          if (extra.radarNewsletter) setRadarNewsletter(extra.radarNewsletter)
          if (extra.oppsNewsletter) setOppsNewsletter(extra.oppsNewsletter)
        } catch { /* ignore */ }
      }
    }

    loadStartupData()
  }, [user, appUser])

  const handleSave = async () => {
    if (!user) return
    setSaving(true)

    await updateProfile({ full_name: nombre, startup_name: startupName })

    const extraData = { role, linkedin, descripcion, vertical, country, phone, website, teamSize, radarNewsletter, oppsNewsletter }
    const extraKey = appUser ? `s4c_${appUser.id}_profile_extra` : 's4c_profile_extra'
    localStorage.setItem(extraKey, JSON.stringify(extraData))

    if (appUser) {
      try {
        const { error: startupError } = await supabase.from('startups').upsert(
          {
            founder_id: appUser.id,
            name: startupName,
            description: descripcion,
            vertical,
            country,
            website,
            team_size: teamSize ? Number(teamSize) : null,
          },
          { onConflict: 'founder_id' }
        )
        if (startupError) console.warn('Failed to upsert startups table:', startupError.message)
      } catch (err) {
        console.warn('Error upserting startups table:', err)
      }
    }

    setSaving(false)
    setSaved(true)
    setTimeout(() => setSaved(false), 3000)
  }

  if (!user) return null

  const stageNum = user.stage || '1'
  const stageInfo = STAGE_LABELS[stageNum] || STAGE_LABELS['1']
  const initials = nombre?.split(' ').map((n) => n[0]).slice(0, 2).join('').toUpperCase() || 'U'

  return (
    <div
      style={{
        minHeight: '100vh',
        background: 'var(--color-bg-primary)',
        padding: '2.5rem 1.75rem',
      }}
    >
      <div style={{ maxWidth: 720, margin: '0 auto' }}>
        {/* Back link */}
        <Link
          href="/tools"
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.375rem',
            fontFamily: 'var(--font-body)',
            fontSize: '0.875rem',
            fontWeight: 500,
            color: 'var(--color-text-secondary)',
            textDecoration: 'none',
            marginBottom: '2rem',
            transition: 'color 0.2s',
          }}
          onMouseEnter={(e) => { e.currentTarget.style.color = 'var(--color-ink)' }}
          onMouseLeave={(e) => { e.currentTarget.style.color = 'var(--color-text-secondary)' }}
        >
          <ArrowLeft size={15} />
          Volver al dashboard
        </Link>

        {/* Profile header */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ type: 'spring', damping: 20, stiffness: 100 }}
          style={{ marginBottom: '2.5rem' }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem', flexWrap: 'wrap' }}>
            {/* Avatar */}
            <div
              style={{
                width: 80,
                height: 80,
                borderRadius: 'var(--radius-full)',
                background: 'var(--color-ink)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0,
                border: '3px solid var(--color-paper)',
                boxShadow: 'var(--shadow-float)',
              }}
            >
              <span
                style={{
                  fontFamily: 'var(--font-heading)',
                  fontSize: '1.5rem',
                  fontWeight: 700,
                  color: 'var(--color-paper)',
                  letterSpacing: '-0.02em',
                }}
              >
                {initials}
              </span>
            </div>
            <div>
              <div
                style={{
                  fontFamily: 'var(--font-body)',
                  fontSize: '0.75rem',
                  fontWeight: 700,
                  color: stageInfo.color,
                  textTransform: 'uppercase',
                  letterSpacing: '0.08em',
                  marginBottom: '0.25rem',
                }}
              >
                {stageInfo.label}
              </div>
              <h1
                style={{
                  fontFamily: 'var(--font-heading)',
                  fontSize: 'clamp(1.75rem, 3vw, 2.5rem)',
                  fontWeight: 700,
                  color: 'var(--color-ink)',
                  letterSpacing: '-0.04em',
                  lineHeight: 1.05,
                  marginBottom: '0.25rem',
                }}
              >
                {nombre || 'Tu nombre'}
              </h1>
              <p
                style={{
                  fontFamily: 'var(--font-body)',
                  fontSize: 'var(--text-body-lg)',
                  color: 'var(--color-text-secondary)',
                  letterSpacing: '-0.01em',
                }}
              >
                {startupName || 'Tu startup'} · {user.email}
              </p>
            </div>
          </div>
        </motion.div>

        {/* Profile form card */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ type: 'spring', damping: 20, stiffness: 100, delay: 0.07 }}
          style={{
            background: 'var(--color-paper)',
            borderRadius: 'var(--radius-lg)',
            border: '1px solid var(--color-border)',
            padding: '2.5rem',
            boxShadow: 'var(--shadow-float)',
          }}
        >
          {/* Section: Personal */}
          <div style={{ marginBottom: '2.5rem' }}>
            <div
              style={{
                fontFamily: 'var(--font-body)',
                fontSize: '0.75rem',
                fontWeight: 700,
                color: 'var(--color-text-muted)',
                textTransform: 'uppercase',
                letterSpacing: '0.1em',
                marginBottom: '1.75rem',
                paddingBottom: '0.75rem',
                borderBottom: '1px solid var(--color-border)',
              }}
            >
              Datos personales
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.75rem' }}>
              <TFInput
                label="Nombre completo"
                icon={<User size={16} />}
                value={nombre}
                onChange={(e) => setNombre(e.target.value)}
                placeholder="Tu nombre completo"
              />

              <TFInput
                label="Email"
                icon={<Mail size={16} />}
                type="email"
                value={user.email}
                readOnly
              />

              <TFSelect
                label="Rol en la startup"
                value={role}
                onChange={(e) => setRole(e.target.value)}
                options={ROLE_OPTIONS}
                placeholder="Selecciona tu rol"
              />

              <TFInput
                label="Teléfono"
                icon={<Phone size={16} />}
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="+52 55 1234 5678"
              />

              <TFInput
                label="LinkedIn URL"
                icon={<Link2 size={16} />}
                type="url"
                value={linkedin}
                onChange={(e) => setLinkedin(e.target.value)}
                placeholder="https://linkedin.com/in/tu-perfil"
              />
            </div>
          </div>

          {/* Section: Startup */}
          <div style={{ marginBottom: '2.5rem' }}>
            <div
              style={{
                fontFamily: 'var(--font-body)',
                fontSize: '0.75rem',
                fontWeight: 700,
                color: 'var(--color-text-muted)',
                textTransform: 'uppercase',
                letterSpacing: '0.1em',
                marginBottom: '1.75rem',
                paddingBottom: '0.75rem',
                borderBottom: '1px solid var(--color-border)',
              }}
            >
              Tu startup
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.75rem' }}>
              <TFInput
                label="Nombre de la startup"
                value={startupName}
                onChange={(e) => setStartupName(e.target.value)}
                placeholder="Nombre de tu startup"
              />

              {/* Description */}
              <div>
                <label
                  style={{
                    display: 'block',
                    fontFamily: 'var(--font-body)',
                    fontSize: '0.75rem',
                    fontWeight: 700,
                    color: 'var(--color-text-muted)',
                    textTransform: 'uppercase',
                    letterSpacing: '0.06em',
                    marginBottom: '0.25rem',
                  }}
                >
                  Descripción
                </label>
                <div style={{ borderBottom: '2px solid var(--color-border)', paddingBottom: '0.125rem' }}>
                  <textarea
                    value={descripcion}
                    onChange={(e) => setDescripcion(e.target.value)}
                    placeholder="Cuéntanos brevemente sobre tu startup y lo que estás construyendo..."
                    rows={3}
                    style={{
                      width: '100%',
                      padding: '0.375rem 0 0.75rem',
                      border: 'none',
                      background: 'transparent',
                      fontFamily: 'var(--font-body)',
                      fontSize: 'var(--text-body-lg)',
                      color: 'var(--color-ink)',
                      outline: 'none',
                      resize: 'vertical' as const,
                      letterSpacing: '-0.01em',
                      minHeight: 80,
                    }}
                  />
                </div>
              </div>

              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fit, minmax(min(250px, 100%), 1fr))',
                  gap: '1.75rem',
                }}
              >
                <TFSelect
                  label="Vertical"
                  value={vertical}
                  onChange={(e) => setVertical(e.target.value)}
                  options={VERTICAL_OPTIONS}
                  placeholder="Selecciona tu vertical"
                />

                <TFSelect
                  label="País"
                  value={country}
                  onChange={(e) => setCountry(e.target.value)}
                  options={LATAM_COUNTRIES}
                  placeholder="Selecciona tu país"
                />
              </div>

              <TFInput
                label="Sitio web"
                icon={<Globe size={16} />}
                type="url"
                value={website}
                onChange={(e) => setWebsite(e.target.value)}
                placeholder="https://tustartup.com"
              />

              <TFInput
                label="Tamaño del equipo"
                value={teamSize}
                onChange={(e) => setTeamSize(e.target.value)}
                type="number"
                placeholder="Número de personas"
              />

              {/* Stage read-only */}
              <div>
                <div
                  style={{
                    fontFamily: 'var(--font-body)',
                    fontSize: '0.75rem',
                    fontWeight: 700,
                    color: 'var(--color-text-muted)',
                    textTransform: 'uppercase',
                    letterSpacing: '0.06em',
                    marginBottom: '0.5rem',
                  }}
                >
                  Etapa (del diagnóstico)
                </div>
                <div
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '0.5rem',
                    padding: '0.5rem 1rem',
                    borderRadius: 'var(--radius-full)',
                    background: stageInfo.bg,
                    border: `1px solid ${stageInfo.color}30`,
                  }}
                >
                  <div
                    style={{
                      width: 8,
                      height: 8,
                      borderRadius: 'var(--radius-full)',
                      background: stageInfo.color,
                      flexShrink: 0,
                    }}
                  />
                  <span
                    style={{
                      fontFamily: 'var(--font-body)',
                      fontSize: '0.9375rem',
                      fontWeight: 600,
                      color: stageInfo.color,
                      letterSpacing: '-0.01em',
                    }}
                  >
                    {stageInfo.label}
                  </span>
                  {user.diagnosticScore != null && (
                    <span style={{ color: 'var(--color-text-muted)', fontSize: '0.8125rem' }}>
                      · {user.diagnosticScore}/100
                    </span>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Section: Suscripciones */}
          <div style={{ marginBottom: '2.5rem' }}>
            <div
              style={{
                fontFamily: 'var(--font-body)',
                fontSize: '0.75rem',
                fontWeight: 700,
                color: 'var(--color-text-muted)',
                textTransform: 'uppercase',
                letterSpacing: '0.1em',
                marginBottom: '1.5rem',
                paddingBottom: '0.75rem',
                borderBottom: '1px solid var(--color-border)',
              }}
            >
              Suscripciones
            </div>

            <div
              style={{
                borderRadius: 'var(--radius-md)',
                border: '1px solid var(--color-border)',
                overflow: 'hidden',
              }}
            >
              {[
                {
                  key: 'radar',
                  label: 'Newsletter RADAR',
                  desc: 'Recibe novedades del ecosistema de innovación',
                  checked: radarNewsletter,
                  toggle: () => setRadarNewsletter((v) => !v),
                },
                {
                  key: 'opps',
                  label: 'Newsletter Oportunidades',
                  desc: 'Recibe convocatorias y fondos para tu startup',
                  checked: oppsNewsletter,
                  toggle: () => setOppsNewsletter((v) => !v),
                },
              ].map((item, i) => (
                <label
                  key={item.key}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '1.125rem 1.25rem',
                    cursor: 'pointer',
                    borderTop: i > 0 ? '1px solid var(--color-border)' : 'none',
                    gap: '1rem',
                  }}
                >
                  <div>
                    <div
                      style={{
                        fontFamily: 'var(--font-body)',
                        fontSize: '0.9375rem',
                        fontWeight: 600,
                        color: 'var(--color-ink)',
                        marginBottom: '0.125rem',
                        letterSpacing: '-0.01em',
                      }}
                    >
                      {item.label}
                    </div>
                    <div
                      style={{
                        fontFamily: 'var(--font-body)',
                        fontSize: '0.8125rem',
                        color: 'var(--color-text-secondary)',
                      }}
                    >
                      {item.desc}
                    </div>
                  </div>
                  <input
                    type="checkbox"
                    checked={item.checked}
                    onChange={item.toggle}
                    style={{ width: 20, height: 20, accentColor: 'var(--color-accent-secondary)', cursor: 'pointer', flexShrink: 0 }}
                  />
                </label>
              ))}
            </div>
          </div>

          {/* Save button */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <button
              onClick={handleSave}
              disabled={saving}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.625rem',
                padding: '0.875rem 2rem',
                borderRadius: 'var(--radius-full)',
                background: saving ? 'var(--color-text-secondary)' : 'var(--color-ink)',
                color: 'var(--color-paper)',
                fontFamily: 'var(--font-body)',
                fontSize: 'var(--text-body-lg)',
                fontWeight: 700,
                border: 'none',
                cursor: saving ? 'wait' : 'pointer',
                letterSpacing: '-0.01em',
                transition: 'background 0.2s ease',
              }}
              onMouseEnter={(e) => { if (!saving) e.currentTarget.style.background = 'var(--color-accent-primary)' }}
              onMouseLeave={(e) => { if (!saving) e.currentTarget.style.background = 'var(--color-ink)' }}
            >
              <Save size={17} />
              {saving ? 'Guardando...' : 'Guardar cambios'}
            </button>
            {saved && (
              <motion.div
                initial={{ opacity: 0, x: -8 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0 }}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.375rem',
                  fontFamily: 'var(--font-body)',
                  fontSize: '0.9375rem',
                  color: 'var(--color-accent-secondary)',
                  fontWeight: 600,
                  letterSpacing: '-0.01em',
                }}
              >
                <CheckCircle2 size={16} />
                Guardado
              </motion.div>
            )}
          </div>
        </motion.div>
      </div>
    </div>
  )
}
