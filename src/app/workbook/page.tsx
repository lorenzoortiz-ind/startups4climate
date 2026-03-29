'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { BookOpen, Download, CheckCircle2, ArrowRight, ChevronRight } from 'lucide-react'
import { useAuth } from '@/context/AuthContext'
import Image from 'next/image'

/* ─── Country data with flag emojis ─── */
const COUNTRY_OPTIONS = [
  { name: 'Argentina', flag: '\u{1F1E6}\u{1F1F7}', code: '+54' },
  { name: 'Bolivia', flag: '\u{1F1E7}\u{1F1F4}', code: '+591' },
  { name: 'Brasil', flag: '\u{1F1E7}\u{1F1F7}', code: '+55' },
  { name: 'Chile', flag: '\u{1F1E8}\u{1F1F1}', code: '+56' },
  { name: 'Colombia', flag: '\u{1F1E8}\u{1F1F4}', code: '+57' },
  { name: 'Costa Rica', flag: '\u{1F1E8}\u{1F1F7}', code: '+506' },
  { name: 'Cuba', flag: '\u{1F1E8}\u{1F1FA}', code: '+53' },
  { name: 'Ecuador', flag: '\u{1F1EA}\u{1F1E8}', code: '+593' },
  { name: 'El Salvador', flag: '\u{1F1F8}\u{1F1FB}', code: '+503' },
  { name: 'Guatemala', flag: '\u{1F1EC}\u{1F1F9}', code: '+502' },
  { name: 'Honduras', flag: '\u{1F1ED}\u{1F1F3}', code: '+504' },
  { name: 'México', flag: '\u{1F1F2}\u{1F1FD}', code: '+52' },
  { name: 'Nicaragua', flag: '\u{1F1F3}\u{1F1EE}', code: '+505' },
  { name: 'Panamá', flag: '\u{1F1F5}\u{1F1E6}', code: '+507' },
  { name: 'Paraguay', flag: '\u{1F1F5}\u{1F1FE}', code: '+595' },
  { name: 'Perú', flag: '\u{1F1F5}\u{1F1EA}', code: '+51' },
  { name: 'Puerto Rico', flag: '\u{1F1F5}\u{1F1F7}', code: '+1' },
  { name: 'República Dominicana', flag: '\u{1F1E9}\u{1F1F4}', code: '+1' },
  { name: 'Uruguay', flag: '\u{1F1FA}\u{1F1FE}', code: '+598' },
  { name: 'Venezuela', flag: '\u{1F1FB}\u{1F1EA}', code: '+58' },
]

const VERTICAL_OPTIONS = [
  'Fintech', 'Healthtech', 'Edtech', 'Agritech', 'Cleantech / Energía',
  'Logística / Movilidad', 'Proptech', 'Biotech', 'Deep Tech', 'Otra',
]

const TOC_ITEMS = [
  { chapter: '01', title: 'Define tu propósito', stage: 'Pre-incubación', color: '#FF6B4A' },
  { chapter: '02', title: 'Valida el problema y tu mercado', stage: 'Pre-incubación', color: '#FF6B4A' },
  { chapter: '03', title: 'Diseña tu propuesta de valor', stage: 'Pre-incubación', color: '#FF6B4A' },
  { chapter: '04', title: 'Construye tu MVP', stage: 'Incubación', color: '#0D9488' },
  { chapter: '05', title: 'Consigue tus primeros clientes', stage: 'Incubación', color: '#0D9488' },
  { chapter: '06', title: 'Define tu modelo de negocio', stage: 'Aceleración', color: '#D97706' },
  { chapter: '07', title: 'Estructura tu proceso de ventas', stage: 'Aceleración', color: '#D97706' },
  { chapter: '08', title: 'Prepara tu startup para escalar', stage: 'Escalamiento', color: '#3B82F6' },
]

const springReveal = {
  initial: { opacity: 0, y: 40 },
  animate: { opacity: 1, y: 0 },
  transition: { type: 'spring', damping: 20, stiffness: 100 } as const,
}

/* Typeform-style input field */
function TFInput({
  label,
  type = 'text',
  value,
  onChange,
  placeholder,
  required = false,
}: {
  label: string
  type?: string
  value: string
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void
  placeholder?: string
  required?: boolean
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
          letterSpacing: '0.08em',
          marginBottom: '0.125rem',
        }}
      >
        {label}
      </label>
      <div
        style={{
          borderBottom: `2px solid ${focused ? 'var(--color-ink)' : 'var(--color-border)'}`,
          transition: 'border-color 0.2s ease',
        }}
      >
        <input
          type={type}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          required={required}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          style={{
            width: '100%',
            padding: '0.5rem 0 0.875rem',
            border: 'none',
            background: 'transparent',
            fontFamily: 'var(--font-body)',
            fontSize: 'var(--text-heading-md)',
            color: 'var(--color-ink)',
            outline: 'none',
            letterSpacing: '-0.01em',
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
  required = false,
}: {
  label: string
  value: string
  onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void
  options: string[]
  placeholder: string
  required?: boolean
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
          letterSpacing: '0.08em',
          marginBottom: '0.125rem',
        }}
      >
        {label}
      </label>
      <div
        style={{
          borderBottom: `2px solid ${focused ? 'var(--color-ink)' : 'var(--color-border)'}`,
          transition: 'border-color 0.2s ease',
        }}
      >
        <select
          value={value}
          onChange={onChange}
          required={required}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          style={{
            width: '100%',
            padding: '0.5rem 2rem 0.875rem 0',
            border: 'none',
            background: 'transparent',
            fontFamily: 'var(--font-body)',
            fontSize: 'var(--text-heading-md)',
            color: value ? 'var(--color-ink)' : 'var(--color-text-muted)',
            outline: 'none',
            appearance: 'none',
            backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='14' height='14' viewBox='0 0 14 14'%3E%3Cpath fill='%235E5E5E' d='M2 4l5 6 5-6'/%3E%3C/svg%3E")`,
            backgroundRepeat: 'no-repeat',
            backgroundPosition: 'right 0.25rem center',
            letterSpacing: '-0.01em',
            cursor: 'pointer',
          }}
        >
          <option value="">{placeholder}</option>
          {options.map((o) => (
            <option key={o} value={o}>{o}</option>
          ))}
        </select>
      </div>
    </div>
  )
}

export default function WorkbookPage() {
  const { user } = useAuth()
  const [nombre, setNombre] = useState('')
  const [startupName, setStartupName] = useState('')
  const [email, setEmail] = useState('')
  const [vertical, setVertical] = useState('')
  const [pais, setPais] = useState('')
  const [phoneCountryCode, setPhoneCountryCode] = useState('+52')
  const [telefono, setTelefono] = useState('')
  const [submitted, setSubmitted] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth <= 768)
    check()
    window.addEventListener('resize', check)
    return () => window.removeEventListener('resize', check)
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!nombre || !email || !pais) return
    setSubmitting(true)
    await new Promise((r) => setTimeout(r, 1200))
    setSubmitting(false)
    setSubmitted(true)
  }

  return (
    <div
      style={{
        minHeight: '100vh',
        background: 'var(--color-bg-primary)',
      }}
    >
      {/* Hero section */}
      <section
        style={{
          padding: 'clamp(3rem, 6vw, 6rem) var(--container-px) clamp(2rem, 4vw, 4rem)',
          maxWidth: 'var(--container-max)',
          margin: '0 auto',
        }}
      >
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 'clamp(2rem, 5vw, 5rem)',
            flexWrap: isMobile ? 'wrap' : 'nowrap',
          }}
        >
          {/* Left: editorial text */}
          <motion.div
            {...springReveal}
            style={{ flex: '1 1 340px', maxWidth: 600 }}
          >
            {/* Eyebrow */}
            <div
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.5rem',
                padding: '0.375rem 0.875rem',
                borderRadius: 'var(--radius-full)',
                background: 'rgba(255,107,74,0.08)',
                border: '1px solid rgba(255,107,74,0.15)',
                marginBottom: '1.75rem',
              }}
            >
              <BookOpen size={14} color="var(--color-accent-secondary)" />
              <span
                style={{
                  fontFamily: 'var(--font-body)',
                  fontSize: '0.75rem',
                  fontWeight: 700,
                  color: 'var(--color-accent-secondary)',
                  letterSpacing: '0.04em',
                  textTransform: 'uppercase',
                }}
              >
                Recurso gratuito
              </span>
            </div>

            <h1
              style={{
                fontFamily: 'var(--font-heading)',
                fontSize: 'var(--text-display-lg)',
                fontWeight: 700,
                color: 'var(--color-ink)',
                letterSpacing: '-0.04em',
                lineHeight: 1.05,
                marginBottom: '1.5rem',
              }}
            >
              Guía completa para{' '}
              <span style={{ color: 'var(--color-accent-primary)' }}>founders de impacto</span>
            </h1>

            <p
              style={{
                fontFamily: 'var(--font-body)',
                fontSize: 'var(--text-body-lg)',
                color: 'var(--color-text-secondary)',
                maxWidth: 540,
                lineHeight: 1.6,
                marginBottom: '2rem',
                letterSpacing: '-0.01em',
              }}
            >
              Todo lo que necesitas saber para lanzar, validar y escalar tu startup de impacto
              en América Latina. Desde la ideación hasta el fundraising, paso a paso.
            </p>

            {/* Stats row */}
            <div style={{ display: 'flex', gap: '2rem', flexWrap: 'wrap' }}>
              {[
                { num: '8', label: 'capítulos' },
                { num: '100+', label: 'páginas' },
                { num: '4', label: 'etapas' },
              ].map((stat) => (
                <div key={stat.label}>
                  <div
                    style={{
                      fontFamily: 'var(--font-heading)',
                      fontSize: 'var(--text-display-md)',
                      fontWeight: 700,
                      color: 'var(--color-ink)',
                      letterSpacing: '-0.05em',
                      lineHeight: 1,
                    }}
                  >
                    {stat.num}
                  </div>
                  <div
                    style={{
                      fontFamily: 'var(--font-body)',
                      fontSize: '0.875rem',
                      color: 'var(--color-text-muted)',
                      marginTop: '0.25rem',
                    }}
                  >
                    {stat.label}
                  </div>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Right: workbook mockup — flex:1 to match right column below */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ type: 'spring', damping: 20, stiffness: 100, delay: 0.15 }}
            style={{
              flex: 1,
              minWidth: 0,
              display: 'flex',
              justifyContent: 'center',
            }}
          >
            <Image
              src="/workbook-cover.png"
              alt="Workbook: De la idea al escalamiento"
              width={280}
              height={430}
              style={{
                borderRadius: 'var(--radius-lg)',
                boxShadow: '0 24px 48px -12px rgba(25,25,25,0.15), 0 8px 16px -4px rgba(25,25,25,0.08)',
                objectFit: 'cover',
                maxWidth: 280,
                height: 'auto',
              }}
              priority
            />
          </motion.div>
        </div>
      </section>

      {/* Two-column layout: TOC + Form */}
      <section
        style={{
          padding: '0 var(--container-px) clamp(4rem, 8vw, 8rem)',
          maxWidth: 'var(--container-max)',
          margin: '0 auto',
        }}
      >
        <div
          style={{
            display: 'flex',
            gap: '2rem',
            flexDirection: isMobile ? 'column' : 'row',
            alignItems: 'flex-start',
          }}
        >
          {/* Left column: Table of Contents */}
          <motion.div
            initial={{ opacity: 0, y: 32 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ type: 'spring', damping: 20, stiffness: 100, delay: 0.1 }}
            style={{
              flex: 1,
              minWidth: 0,
              background: 'var(--color-paper)',
              borderRadius: 'var(--radius-lg)',
              border: '1px solid var(--color-border)',
              padding: '2.5rem',
              boxShadow: 'var(--shadow-float)',
            }}
          >
            <h2
              style={{
                fontFamily: 'var(--font-heading)',
                fontSize: 'var(--text-display-md)',
                fontWeight: 700,
                color: 'var(--color-ink)',
                letterSpacing: '-0.04em',
                lineHeight: 1.05,
                marginBottom: '2rem',
              }}
            >
              Contenido
            </h2>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0' }}>
              {TOC_ITEMS.map((item, i) => (
                <motion.div
                  key={item.chapter}
                  initial={{ opacity: 0, x: -16 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ type: 'spring', damping: 20, stiffness: 100, delay: 0.2 + i * 0.05 }}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '1.25rem',
                    padding: '1rem 0',
                    borderBottom: i < TOC_ITEMS.length - 1 ? '1px solid var(--color-border)' : 'none',
                  }}
                >
                  <span
                    style={{
                      fontFamily: 'var(--font-heading)',
                      fontSize: 'var(--text-heading-md)',
                      fontWeight: 700,
                      color: `${item.color}30`,
                      width: 44,
                      flexShrink: 0,
                      lineHeight: 1,
                      letterSpacing: '-0.04em',
                    }}
                  >
                    {item.chapter}
                  </span>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div
                      style={{
                        fontFamily: 'var(--font-heading)',
                        fontSize: 'clamp(0.875rem, 1.5vw, 1.1rem)',
                        fontWeight: 700,
                        color: 'var(--color-ink)',
                        letterSpacing: '-0.02em',
                        marginBottom: '0.125rem',
                        whiteSpace: 'nowrap',
                      }}
                    >
                      {item.title}
                    </div>
                    <span
                      style={{
                        fontFamily: 'var(--font-body)',
                        fontSize: '0.8rem',
                        fontWeight: 600,
                        color: item.color,
                        textTransform: 'uppercase',
                        letterSpacing: '0.06em',
                      }}
                    >
                      {item.stage}
                    </span>
                  </div>
                  <div
                    style={{
                      width: 6,
                      height: 6,
                      borderRadius: 'var(--radius-full)',
                      background: item.color,
                      flexShrink: 0,
                    }}
                  />
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Right column: Download Form */}
          <motion.div
            initial={{ opacity: 0, y: 32 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ type: 'spring', damping: 20, stiffness: 100, delay: 0.18 }}
            style={{
              flex: 1,
              minWidth: 0,
              background: 'var(--color-paper)',
              borderRadius: 'var(--radius-lg)',
              border: '1px solid var(--color-border)',
              padding: '2.5rem',
              boxShadow: 'var(--shadow-float)',
            }}
            id="descargar"
          >
            {user ? (
              /* Logged-in user: direct download */
              <div style={{ textAlign: 'center', padding: '1rem 0' }}>
                <div
                  style={{
                    width: 72,
                    height: 72,
                    borderRadius: 'var(--radius-full)',
                    background: 'rgba(255,107,74,0.08)',
                    border: '1px solid rgba(255,107,74,0.15)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    margin: '0 auto 1.5rem',
                  }}
                >
                  <Download size={28} color="var(--color-accent-secondary)" />
                </div>
                <h2
                  style={{
                    fontFamily: 'var(--font-heading)',
                    fontSize: 'var(--text-display-md)',
                    fontWeight: 700,
                    color: 'var(--color-ink)',
                    letterSpacing: '-0.04em',
                    lineHeight: 1.05,
                    marginBottom: '0.75rem',
                  }}
                >
                  Descarga directa
                </h2>
                <p
                  style={{
                    fontFamily: 'var(--font-body)',
                    fontSize: 'var(--text-body-lg)',
                    color: 'var(--color-text-secondary)',
                    marginBottom: '2rem',
                    lineHeight: 1.5,
                    letterSpacing: '-0.01em',
                  }}
                >
                  Ya tienes sesión como <strong style={{ color: 'var(--color-ink)' }}>{user.name}</strong>. Descarga tu copia gratuita.
                </p>
                <button
                  onClick={() => alert('Descarga iniciada. Revisa tu carpeta de descargas.')}
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '0.625rem',
                    padding: '1rem 2.5rem',
                    borderRadius: 'var(--radius-full)',
                    background: 'var(--color-ink)',
                    color: 'var(--color-paper)',
                    fontFamily: 'var(--font-body)',
                    fontSize: 'var(--text-body-lg)',
                    fontWeight: 700,
                    border: 'none',
                    cursor: 'pointer',
                    letterSpacing: '-0.01em',
                    transition: 'background 0.2s ease',
                  }}
                  onMouseEnter={(e) => { e.currentTarget.style.background = 'var(--color-accent-primary)' }}
                  onMouseLeave={(e) => { e.currentTarget.style.background = 'var(--color-ink)' }}
                >
                  <Download size={18} />
                  Descargar Workbook (PDF)
                </button>
              </div>
            ) : submitted ? (
              /* Success state */
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ type: 'spring', damping: 20, stiffness: 100 }}
                style={{ textAlign: 'center', padding: '1rem 0' }}
              >
                <div
                  style={{
                    width: 72,
                    height: 72,
                    borderRadius: 'var(--radius-full)',
                    background: 'rgba(255,107,74,0.08)',
                    border: '1px solid rgba(255,107,74,0.15)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    margin: '0 auto 1.5rem',
                  }}
                >
                  <CheckCircle2 size={32} color="var(--color-accent-secondary)" />
                </div>
                <h2
                  style={{
                    fontFamily: 'var(--font-heading)',
                    fontSize: 'var(--text-display-md)',
                    fontWeight: 700,
                    color: 'var(--color-ink)',
                    letterSpacing: '-0.04em',
                    lineHeight: 1.05,
                    marginBottom: '0.75rem',
                  }}
                >
                  ¡Revisa tu email!
                </h2>
                <p
                  style={{
                    fontFamily: 'var(--font-body)',
                    fontSize: 'var(--text-body-lg)',
                    color: 'var(--color-text-secondary)',
                    lineHeight: 1.6,
                    marginBottom: '2rem',
                    letterSpacing: '-0.01em',
                  }}
                >
                  Te enviamos el workbook a <strong style={{ color: 'var(--color-ink)' }}>{email}</strong>.<br />
                  Si no lo ves, revisa tu carpeta de spam.
                </p>
                <Link
                  href="/"
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '0.375rem',
                    fontFamily: 'var(--font-body)',
                    fontSize: 'var(--text-body-lg)',
                    color: 'var(--color-accent-secondary)',
                    textDecoration: 'none',
                    fontWeight: 700,
                    letterSpacing: '-0.01em',
                  }}
                >
                  Volver al inicio
                  <ArrowRight size={16} />
                </Link>
              </motion.div>
            ) : (
              /* Lead capture form */
              <>
                <h2
                  style={{
                    fontFamily: 'var(--font-heading)',
                    fontSize: 'var(--text-display-md)',
                    fontWeight: 700,
                    color: 'var(--color-ink)',
                    letterSpacing: '-0.04em',
                    lineHeight: 1.05,
                    marginBottom: '0.5rem',
                  }}
                >
                  Descarga gratis
                </h2>
                <p
                  style={{
                    fontFamily: 'var(--font-body)',
                    fontSize: 'var(--text-body-lg)',
                    color: 'var(--color-text-secondary)',
                    marginBottom: '2.25rem',
                    lineHeight: 1.5,
                    letterSpacing: '-0.01em',
                  }}
                >
                  Ingresa tus datos y te lo enviamos al instante.
                </p>

                <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.75rem' }}>
                  <TFInput
                    label="Nombre"
                    value={nombre}
                    onChange={(e) => setNombre(e.target.value)}
                    placeholder="Tu nombre completo"
                    required
                  />

                  <TFInput
                    label="Nombre de tu startup"
                    value={startupName}
                    onChange={(e) => setStartupName(e.target.value)}
                    placeholder="Nombre de tu startup"
                  />

                  <TFSelect
                    label="Vertical"
                    value={vertical}
                    onChange={(e) => setVertical(e.target.value)}
                    options={VERTICAL_OPTIONS}
                    placeholder="Selecciona una vertical"
                  />

                  <TFInput
                    label="Email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="tu@email.com"
                    required
                  />

                  {/* Country + Phone */}
                  <div style={{ display: 'flex', gap: '1.5rem', flexWrap: 'wrap' }}>
                    <div style={{ flex: '0 1 200px', minWidth: 160 }}>
                      <label
                        style={{
                          display: 'block',
                          fontFamily: 'var(--font-body)',
                          fontSize: '0.75rem',
                          fontWeight: 700,
                          color: 'var(--color-text-muted)',
                          textTransform: 'uppercase',
                          letterSpacing: '0.08em',
                          marginBottom: '0.125rem',
                        }}
                      >
                        País
                      </label>
                      <div style={{ borderBottom: '2px solid var(--color-border)' }}>
                        <select
                          value={pais}
                          onChange={(e) => {
                            setPais(e.target.value)
                            const match = COUNTRY_OPTIONS.find((c) => c.name === e.target.value)
                            if (match) setPhoneCountryCode(match.code)
                          }}
                          required
                          style={{
                            width: '100%',
                            padding: '0.5rem 2rem 0.875rem 0',
                            border: 'none',
                            background: 'transparent',
                            fontFamily: 'var(--font-body)',
                            fontSize: 'var(--text-heading-md)',
                            color: pais ? 'var(--color-ink)' : 'var(--color-text-muted)',
                            outline: 'none',
                            appearance: 'none',
                            backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='14' height='14' viewBox='0 0 14 14'%3E%3Cpath fill='%235E5E5E' d='M2 4l5 6 5-6'/%3E%3C/svg%3E")`,
                            backgroundRepeat: 'no-repeat',
                            backgroundPosition: 'right 0.25rem center',
                            letterSpacing: '-0.01em',
                            cursor: 'pointer',
                          }}
                        >
                          <option value="">Selecciona</option>
                          {COUNTRY_OPTIONS.map((c) => (
                            <option key={c.name} value={c.name}>
                              {c.flag} {c.name}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>
                    <div style={{ flex: '1 1 160px', minWidth: 0 }}>
                      <label
                        style={{
                          display: 'block',
                          fontFamily: 'var(--font-body)',
                          fontSize: '0.75rem',
                          fontWeight: 700,
                          color: 'var(--color-text-muted)',
                          textTransform: 'uppercase',
                          letterSpacing: '0.08em',
                          marginBottom: '0.125rem',
                        }}
                      >
                        Teléfono
                      </label>
                      <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'flex-end', borderBottom: '2px solid var(--color-border)' }}>
                        <span
                          style={{
                            fontFamily: 'var(--font-body)',
                            fontSize: 'var(--text-heading-md)',
                            color: 'var(--color-text-muted)',
                            paddingBottom: '0.875rem',
                            flexShrink: 0,
                            letterSpacing: '-0.01em',
                          }}
                        >
                          {phoneCountryCode}
                        </span>
                        <input
                          type="tel"
                          value={telefono}
                          onChange={(e) => setTelefono(e.target.value)}
                          placeholder="55 1234 5678"
                          style={{
                            flex: 1,
                            padding: '0.5rem 0 0.875rem',
                            border: 'none',
                            background: 'transparent',
                            fontFamily: 'var(--font-body)',
                            fontSize: 'var(--text-heading-md)',
                            color: 'var(--color-ink)',
                            outline: 'none',
                            letterSpacing: '-0.01em',
                          }}
                        />
                      </div>
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={submitting}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '0.625rem',
                      width: '100%',
                      padding: '1.125rem 2rem',
                      borderRadius: 'var(--radius-full)',
                      background: submitting ? 'var(--color-text-secondary)' : 'var(--color-ink)',
                      color: 'var(--color-paper)',
                      fontFamily: 'var(--font-body)',
                      fontSize: 'var(--text-body-lg)',
                      fontWeight: 700,
                      border: 'none',
                      cursor: submitting ? 'wait' : 'pointer',
                      letterSpacing: '-0.01em',
                      marginTop: '0.25rem',
                      transition: 'background 0.2s ease',
                    }}
                    onMouseEnter={(e) => { if (!submitting) e.currentTarget.style.background = 'var(--color-accent-primary)' }}
                    onMouseLeave={(e) => { if (!submitting) e.currentTarget.style.background = 'var(--color-ink)' }}
                  >
                    {submitting ? (
                      'Enviando...'
                    ) : (
                      <>
                        Descargar workbook gratis
                        <ArrowRight size={18} />
                      </>
                    )}
                  </button>
                </form>

                <div
                  style={{
                    marginTop: '1.75rem',
                    textAlign: 'center',
                    borderTop: '1px solid var(--color-border)',
                    paddingTop: '1.25rem',
                  }}
                >
                  <Link
                    href="/"
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '0.375rem',
                      fontFamily: 'var(--font-body)',
                      fontSize: '0.9375rem',
                      color: 'var(--color-text-secondary)',
                      textDecoration: 'none',
                      letterSpacing: '-0.01em',
                    }}
                  >
                    ¿Ya tienes cuenta?{' '}
                    <span style={{ color: 'var(--color-accent-secondary)', fontWeight: 700 }}>Inicia sesión</span>
                    <ChevronRight size={14} color="var(--color-accent-secondary)" />
                  </Link>
                </div>
              </>
            )}
          </motion.div>
        </div>
      </section>
    </div>
  )
}
