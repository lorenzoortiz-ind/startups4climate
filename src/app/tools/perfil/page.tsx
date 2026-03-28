'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { ArrowLeft, Save, User, CheckCircle2 } from 'lucide-react'
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
  'Argentina',
  'Bolivia',
  'Brasil',
  'Chile',
  'Colombia',
  'Costa Rica',
  'Cuba',
  'Ecuador',
  'El Salvador',
  'Guatemala',
  'Honduras',
  'México',
  'Nicaragua',
  'Panamá',
  'Paraguay',
  'Perú',
  'Puerto Rico',
  'República Dominicana',
  'Uruguay',
  'Venezuela',
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

const readOnlyStyle: React.CSSProperties = {
  ...inputStyle,
  background: 'var(--color-bg-muted, #f3f4f6)',
  color: 'var(--color-text-secondary, #6B7280)',
  cursor: 'not-allowed',
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

    // Try to load startup data from Supabase first, then fall back to localStorage
    async function loadStartupData() {
      if (!appUser) return

      try {
        const { data: startup } = await supabase
          .from('startups')
          .select('*')
          .eq('founder_id', appUser.id)
          .single()

        if (startup) {
          // Populate fields from Supabase startups table (authoritative source)
          if (startup.name) setStartupName(startup.name)
          if (startup.description) setDescripcion(startup.description)
          if (startup.vertical) setVertical(startup.vertical)
          if (startup.country) setCountry(startup.country)
          if (startup.website) setWebsite(startup.website)
          if (startup.team_size) setTeamSize(String(startup.team_size))
          // Load remaining fields from localStorage (not stored in startups table)
          if (typeof window !== 'undefined') {
            try {
              const extra = JSON.parse(localStorage.getItem('s4c_profile_extra') || '{}')
              if (extra.role) setRole(extra.role)
              if (extra.linkedin) setLinkedin(extra.linkedin)
              if (extra.phone) setPhone(extra.phone)
              if (extra.radarNewsletter) setRadarNewsletter(extra.radarNewsletter)
              if (extra.oppsNewsletter) setOppsNewsletter(extra.oppsNewsletter)
            } catch {
              // ignore
            }
          }
          return
        }
      } catch {
        // Supabase query failed — fall through to localStorage
      }

      // Fallback: load all fields from localStorage
      if (typeof window !== 'undefined') {
        try {
          const extra = JSON.parse(localStorage.getItem('s4c_profile_extra') || '{}')
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
        } catch {
          // ignore
        }
      }
    }

    loadStartupData()
  }, [user, appUser])

  const handleSave = async () => {
    if (!user) return
    setSaving(true)

    // Update profiles table via auth context
    const result = await updateProfile({
      full_name: nombre,
      startup_name: startupName,
    })

    // Save extra profile fields to localStorage
    const extraData = { role, linkedin, descripcion, vertical, country, phone, website, teamSize, radarNewsletter, oppsNewsletter }
    localStorage.setItem('s4c_profile_extra', JSON.stringify(extraData))

    // Also try to update startups table in Supabase (best effort)
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
        if (startupError) {
          console.warn('Failed to upsert startups table:', startupError.message)
        }
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
            Tu startup est&aacute; en la etapa de {stageInfo.label}
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
          {/* Full name */}
          <div>
            <label style={labelStyle}>Nombre completo</label>
            <input
              type="text"
              value={nombre}
              onChange={(e) => setNombre(e.target.value)}
              style={inputStyle}
            />
          </div>

          {/* Email (read-only) */}
          <div>
            <label style={labelStyle}>Email</label>
            <input
              type="email"
              value={user.email}
              readOnly
              style={readOnlyStyle}
            />
          </div>

          {/* Startup name */}
          <div>
            <label style={labelStyle}>Nombre de la startup</label>
            <input
              type="text"
              value={startupName}
              onChange={(e) => setStartupName(e.target.value)}
              style={inputStyle}
            />
          </div>

          {/* Description */}
          <div>
            <label style={labelStyle}>Descripci&oacute;n</label>
            <textarea
              value={descripcion}
              onChange={(e) => setDescripcion(e.target.value)}
              placeholder="Cu&eacute;ntanos brevemente sobre tu startup y lo que est&aacute;s construyendo..."
              rows={4}
              style={{
                ...inputStyle,
                resize: 'vertical' as const,
                minHeight: 100,
              }}
            />
          </div>

          {/* Two-column grid */}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(min(250px, 100%), 1fr))',
              gap: '1.25rem',
            }}
          >
            {/* Vertical */}
            <div>
              <label style={labelStyle}>Vertical</label>
              <select
                value={vertical}
                onChange={(e) => setVertical(e.target.value)}
                style={selectStyle}
              >
                <option value="">Selecciona tu vertical</option>
                {VERTICAL_OPTIONS.map((v) => (
                  <option key={v.value} value={v.value}>
                    {v.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Country */}
            <div>
              <label style={labelStyle}>Pa&iacute;s</label>
              <select
                value={country}
                onChange={(e) => setCountry(e.target.value)}
                style={selectStyle}
              >
                <option value="">Selecciona tu pa&iacute;s</option>
                {LATAM_COUNTRIES.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
            </div>

            {/* Phone */}
            <div>
              <label style={labelStyle}>Tel&eacute;fono</label>
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="+52 55 1234 5678"
                style={inputStyle}
              />
            </div>

            {/* Role */}
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
          </div>

          {/* LinkedIn URL */}
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

          {/* Website */}
          <div>
            <label style={labelStyle}>Sitio web</label>
            <input
              type="url"
              value={website}
              onChange={(e) => setWebsite(e.target.value)}
              placeholder="https://tustartup.com"
              style={inputStyle}
            />
          </div>

          {/* Team size */}
          <div>
            <label style={labelStyle}>Tama&ntilde;o del equipo</label>
            <input
              type="number"
              min={1}
              value={teamSize}
              onChange={(e) => setTeamSize(e.target.value)}
              placeholder="N&uacute;mero de personas en el equipo"
              style={inputStyle}
            />
          </div>

          {/* Newsletter subscriptions */}
          <div style={{
            padding: '1rem',
            borderRadius: 12,
            background: 'var(--color-bg-muted, #f9fafb)',
            border: '1px solid var(--color-border, #e5e7eb)',
          }}>
            <label style={{ ...labelStyle, marginBottom: '0.75rem' }}>Suscripciones</label>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              <label style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                cursor: 'pointer',
              }}>
                <div>
                  <div style={{ fontFamily: 'var(--font-body)', fontSize: '0.8125rem', fontWeight: 500, color: 'var(--color-text-primary)' }}>
                    Newsletter RADAR
                  </div>
                  <div style={{ fontFamily: 'var(--font-body)', fontSize: '0.75rem', color: 'var(--color-text-muted)' }}>
                    Recibe novedades del ecosistema de innovaci&oacute;n
                  </div>
                </div>
                <input
                  type="checkbox"
                  checked={radarNewsletter}
                  onChange={(e) => setRadarNewsletter(e.target.checked)}
                  style={{ width: 18, height: 18, accentColor: '#059669', cursor: 'pointer' }}
                />
              </label>

              <div style={{ height: 1, background: 'var(--color-border, #e5e7eb)' }} />

              <label style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                cursor: 'pointer',
              }}>
                <div>
                  <div style={{ fontFamily: 'var(--font-body)', fontSize: '0.8125rem', fontWeight: 500, color: 'var(--color-text-primary)' }}>
                    Newsletter Oportunidades
                  </div>
                  <div style={{ fontFamily: 'var(--font-body)', fontSize: '0.75rem', color: 'var(--color-text-muted)' }}>
                    Recibe convocatorias y fondos para tu startup
                  </div>
                </div>
                <input
                  type="checkbox"
                  checked={oppsNewsletter}
                  onChange={(e) => setOppsNewsletter(e.target.checked)}
                  style={{ width: 18, height: 18, accentColor: '#059669', cursor: 'pointer' }}
                />
              </label>
            </div>
          </div>

          {/* Stage (read-only) */}
          <div>
            <label style={labelStyle}>Etapa (del diagn&oacute;stico)</label>
            <div
              style={{
                ...readOnlyStyle,
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
              }}
            >
              <div
                style={{
                  width: 8,
                  height: 8,
                  borderRadius: '50%',
                  background: stageInfo.color,
                  flexShrink: 0,
                }}
              />
              {stageInfo.label}
              {user.diagnosticScore != null && (
                <span style={{ color: 'var(--color-text-muted)', marginLeft: 'auto', fontSize: '0.8125rem' }}>
                  Puntaje: {user.diagnosticScore}/100
                </span>
              )}
            </div>
          </div>

          {/* Save button */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginTop: '0.5rem' }}>
            <button
              onClick={handleSave}
              disabled={saving}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.5rem',
                padding: '0.75rem 1.75rem',
                borderRadius: 10,
                background: saving ? '#6B7280' : '#059669',
                color: 'white',
                fontFamily: 'var(--font-body)',
                fontSize: '0.875rem',
                fontWeight: 600,
                border: 'none',
                cursor: saving ? 'wait' : 'pointer',
                boxShadow: '0 2px 10px rgba(5,150,105,0.25)',
                transition: 'all 0.2s',
              }}
            >
              <Save size={16} />
              {saving ? 'Guardando...' : 'Guardar cambios'}
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
