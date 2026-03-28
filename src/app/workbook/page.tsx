'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { BookOpen, Download, CheckCircle2, ArrowRight, ChevronRight } from 'lucide-react'
import { useAuth } from '@/context/AuthContext'
import WorkbookMockup from '@/components/illustrations/WorkbookMockup'

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

const TOC_ITEMS = [
  { chapter: '01', title: 'Encuentra tu propósito como founder', stage: 'Pre-incubación', color: '#7C3AED' },
  { chapter: '02', title: 'Valida el problema y tu mercado', stage: 'Pre-incubación', color: '#7C3AED' },
  { chapter: '03', title: 'Diseña tu propuesta de valor', stage: 'Pre-incubación', color: '#7C3AED' },
  { chapter: '04', title: 'Construye tu MVP y primeras métricas', stage: 'Incubación', color: '#059669' },
  { chapter: '05', title: 'Consigue tus primeros clientes', stage: 'Incubación', color: '#059669' },
  { chapter: '06', title: 'Define tu modelo de negocio', stage: 'Aceleración', color: '#D97706' },
  { chapter: '07', title: 'Estructura tu proceso de ventas', stage: 'Aceleración', color: '#D97706' },
  { chapter: '08', title: 'Prepara tu startup para escalar', stage: 'Escalamiento', color: '#0891B2' },
]

/* ─── Shared Styles (matching DiagnosticForm) ─── */
const inputStyle: React.CSSProperties = {
  width: '100%',
  padding: '0.625rem 0.875rem',
  borderRadius: 10,
  border: '1px solid var(--color-border, #e5e7eb)',
  fontFamily: 'var(--font-body)',
  fontSize: '0.875rem',
  color: 'var(--color-text-primary, #111827)',
  background: 'var(--color-bg-primary, #ffffff)',
  outline: 'none',
  transition: 'border-color 0.2s',
  boxSizing: 'border-box' as const,
}

const selectStyle: React.CSSProperties = {
  ...inputStyle,
  appearance: 'none' as const,
  backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 12 12'%3E%3Cpath fill='%236B7280' d='M2 4l4 4 4-4'/%3E%3C/svg%3E")`,
  backgroundRepeat: 'no-repeat',
  backgroundPosition: 'right 0.75rem center',
  paddingRight: '2.25rem',
}

const labelStyle: React.CSSProperties = {
  display: 'block',
  fontFamily: 'var(--font-body)',
  fontSize: '0.8125rem',
  fontWeight: 600,
  color: 'var(--color-text-primary, #111827)',
  marginBottom: '0.25rem',
}

const cardStyle: React.CSSProperties = {
  borderRadius: 20,
  background: 'var(--color-bg-card, #ffffff)',
  border: '1px solid var(--color-border, #e5e7eb)',
  padding: '2rem',
  boxShadow: '0 2px 20px rgba(0,0,0,0.04)',
}

/* ─── Animation Variants ─── */
const fadeUp = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
}

export default function WorkbookPage() {
  const { user } = useAuth()
  const [nombre, setNombre] = useState('')
  const [email, setEmail] = useState('')
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
        background: 'var(--color-bg-primary, #FAFAFA)',
      }}
    >
      {/* Navigation */}
      <nav
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '1rem 2rem',
          maxWidth: 1200,
          margin: '0 auto',
        }}
      >
        <Link
          href="/"
          style={{
            fontFamily: 'var(--font-heading)',
            fontWeight: 700,
            fontSize: '1rem',
            color: 'var(--color-text-primary, #111827)',
            textDecoration: 'none',
          }}
        >
          Startups<span style={{ color: '#059669' }}>4</span>Climate
        </Link>
        <Link
          href="/tools"
          style={{
            fontFamily: 'var(--font-body)',
            fontSize: '0.8125rem',
            color: '#059669',
            textDecoration: 'none',
            fontWeight: 600,
          }}
        >
          Ir a la plataforma
        </Link>
      </nav>

      {/* Hero -- title + mockup */}
      <section
        style={{
          padding: '4rem 2rem 3rem',
          maxWidth: 1060,
          margin: '0 auto',
        }}
      >
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '3rem',
            flexWrap: 'wrap',
            justifyContent: 'center',
          }}
        >
          {/* Left column -- text */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            style={{ flex: '1 1 340px', maxWidth: 560 }}
          >
            <div
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.5rem',
                padding: '0.5rem 1rem',
                borderRadius: 9999,
                background: 'rgba(5,150,105,0.08)',
                border: '1px solid rgba(5,150,105,0.15)',
                marginBottom: '1.5rem',
              }}
            >
              <BookOpen size={16} color="#059669" />
              <span
                style={{
                  fontFamily: 'var(--font-mono)',
                  fontSize: '0.75rem',
                  fontWeight: 600,
                  color: '#059669',
                }}
              >
                Recurso gratuito
              </span>
            </div>

            <h1
              style={{
                fontFamily: 'var(--font-heading)',
                fontSize: 'clamp(2rem, 5vw, 3rem)',
                fontWeight: 800,
                color: 'var(--color-text-primary, #111827)',
                letterSpacing: '-0.03em',
                lineHeight: 1.15,
                marginBottom: '1rem',
              }}
            >
              Gu&iacute;a completa para{' '}
              <span style={{ color: '#059669' }}>founders de impacto</span>
            </h1>

            <p
              style={{
                fontFamily: 'var(--font-body)',
                fontSize: '1.125rem',
                color: 'var(--color-text-secondary, #6B7280)',
                maxWidth: 600,
                lineHeight: 1.7,
              }}
            >
              Todo lo que necesitas saber para lanzar, validar y escalar tu startup de impacto
              en Am&eacute;rica Latina. Desde la ideaci&oacute;n hasta el fundraising, paso a paso.
            </p>
          </motion.div>

          {/* Right column -- workbook mockup */}
          <motion.div
            initial={{ opacity: 0, scale: 0.92 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.15 }}
            style={{
              flex: '0 1 320px',
              display: 'flex',
              justifyContent: 'center',
            }}
          >
            <WorkbookMockup width={300} />
          </motion.div>
        </div>
      </section>

      {/* Two-column layout: TOC + Form */}
      <section
        style={{
          padding: '0 2rem 5rem',
          maxWidth: 1060,
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
          {/* Left column -- Table of Contents */}
          <motion.div
            {...fadeUp}
            transition={{ duration: 0.4, delay: 0.1 }}
            style={{ ...cardStyle, flex: 1, minWidth: 0 }}
          >
            <h2
              style={{
                fontFamily: 'var(--font-heading)',
                fontSize: '1.25rem',
                fontWeight: 700,
                color: 'var(--color-text-primary, #111827)',
                marginBottom: '1.5rem',
                letterSpacing: '-0.01em',
              }}
            >
              Contenido del workbook
            </h2>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              {TOC_ITEMS.map((item, i) => (
                <motion.div
                  key={item.chapter}
                  initial={{ opacity: 0, x: -12 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.2 + i * 0.05 }}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.875rem',
                    padding: '0.75rem 1rem',
                    borderRadius: 12,
                    background: `${item.color}06`,
                    border: `1px solid ${item.color}15`,
                  }}
                >
                  <span
                    style={{
                      fontFamily: 'var(--font-mono)',
                      fontSize: '0.6875rem',
                      fontWeight: 700,
                      color: item.color,
                      width: 28,
                      flexShrink: 0,
                    }}
                  >
                    {item.chapter}
                  </span>
                  <span
                    style={{
                      fontFamily: 'var(--font-body)',
                      fontSize: '0.875rem',
                      fontWeight: 500,
                      color: 'var(--color-text-primary, #111827)',
                      flex: 1,
                    }}
                  >
                    {item.title}
                  </span>
                  <span
                    style={{
                      fontFamily: 'var(--font-mono)',
                      fontSize: '0.5625rem',
                      fontWeight: 600,
                      color: item.color,
                      padding: '2px 8px',
                      borderRadius: 9999,
                      background: `${item.color}12`,
                      textTransform: 'uppercase',
                      letterSpacing: '0.03em',
                      flexShrink: 0,
                    }}
                  >
                    {item.stage}
                  </span>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Right column -- Download Form */}
          <motion.div
            {...fadeUp}
            transition={{ duration: 0.4, delay: 0.2 }}
            style={{ ...cardStyle, flex: 1, minWidth: 0 }}
            id="descargar"
          >
            {user ? (
              /* Logged-in user: direct download */
              <div style={{ textAlign: 'center' }}>
                <div
                  style={{
                    width: 56,
                    height: 56,
                    borderRadius: 14,
                    background: 'rgba(5,150,105,0.08)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    margin: '0 auto 1.25rem',
                  }}
                >
                  <Download size={24} color="#059669" />
                </div>
                <h2
                  style={{
                    fontFamily: 'var(--font-heading)',
                    fontSize: '1.25rem',
                    fontWeight: 700,
                    color: 'var(--color-text-primary, #111827)',
                    marginBottom: '0.5rem',
                  }}
                >
                  Descargar directamente
                </h2>
                <p
                  style={{
                    fontFamily: 'var(--font-body)',
                    fontSize: '0.875rem',
                    color: 'var(--color-text-secondary, #6B7280)',
                    marginBottom: '1.5rem',
                  }}
                >
                  Ya tienes sesi&oacute;n iniciada como {user.name}. Descarga tu copia gratuita.
                </p>
                <button
                  onClick={() => alert('La descarga del workbook estará disponible próximamente.')}
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '0.5rem',
                    padding: '0.875rem 2rem',
                    borderRadius: 12,
                    background: '#059669',
                    color: 'white',
                    fontFamily: 'var(--font-body)',
                    fontSize: '0.9375rem',
                    fontWeight: 600,
                    border: 'none',
                    cursor: 'pointer',
                    boxShadow: '0 2px 12px rgba(5,150,105,0.3)',
                    transition: 'all 0.2s',
                  }}
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
                style={{ textAlign: 'center' }}
              >
                <div
                  style={{
                    width: 56,
                    height: 56,
                    borderRadius: 14,
                    background: 'rgba(5,150,105,0.08)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    margin: '0 auto 1.25rem',
                  }}
                >
                  <CheckCircle2 size={28} color="#059669" />
                </div>
                <h2
                  style={{
                    fontFamily: 'var(--font-heading)',
                    fontSize: '1.25rem',
                    fontWeight: 700,
                    color: 'var(--color-text-primary, #111827)',
                    marginBottom: '0.5rem',
                  }}
                >
                  &iexcl;Listo! Revisa tu email
                </h2>
                <p
                  style={{
                    fontFamily: 'var(--font-body)',
                    fontSize: '0.875rem',
                    color: 'var(--color-text-secondary, #6B7280)',
                    lineHeight: 1.6,
                    marginBottom: '1.5rem',
                  }}
                >
                  Te enviamos el workbook a <strong>{email}</strong>.
                  <br />
                  Si no lo ves, revisa tu carpeta de spam.
                </p>
                <Link
                  href="/"
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '0.375rem',
                    fontFamily: 'var(--font-body)',
                    fontSize: '0.8125rem',
                    color: '#059669',
                    textDecoration: 'none',
                    fontWeight: 600,
                  }}
                >
                  Volver al inicio
                  <ArrowRight size={14} />
                </Link>
              </motion.div>
            ) : (
              /* Lead capture form */
              <>
                <h2
                  style={{
                    fontFamily: 'var(--font-heading)',
                    fontSize: '1.25rem',
                    fontWeight: 700,
                    color: 'var(--color-text-primary, #111827)',
                    marginBottom: '0.375rem',
                  }}
                >
                  Descarga gratis el workbook
                </h2>
                <p
                  style={{
                    fontFamily: 'var(--font-body)',
                    fontSize: '0.8125rem',
                    color: 'var(--color-text-secondary, #6B7280)',
                    marginBottom: '1.5rem',
                    lineHeight: 1.5,
                  }}
                >
                  Ingresa tus datos y te lo enviamos al instante.
                </p>

                <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                  {/* Nombre */}
                  <div>
                    <label style={labelStyle}>Nombre</label>
                    <input
                      type="text"
                      value={nombre}
                      onChange={(e) => setNombre(e.target.value)}
                      placeholder="Tu nombre completo"
                      required
                      style={inputStyle}
                    />
                  </div>

                  {/* Email */}
                  <div>
                    <label style={labelStyle}>Email</label>
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="tu@email.com"
                      required
                      style={inputStyle}
                    />
                  </div>

                  {/* Row: Country (flag dropdown) + Phone */}
                  <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
                    <div style={{ flex: '0 0 auto', minWidth: 130 }}>
                      <label style={labelStyle}>Pa&iacute;s</label>
                      <select
                        value={pais}
                        onChange={(e) => {
                          setPais(e.target.value)
                          const match = COUNTRY_OPTIONS.find((c) => c.name === e.target.value)
                          if (match) setPhoneCountryCode(match.code)
                        }}
                        required
                        style={{
                          ...selectStyle,
                          backgroundPosition: 'right 0.5rem center',
                          paddingRight: '1.75rem',
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
                    <div style={{ flex: '1 1 160px', minWidth: 0 }}>
                      <label style={labelStyle}>Tel&eacute;fono</label>
                      <div style={{ display: 'flex', gap: '0.375rem' }}>
                        <span
                          style={{
                            display: 'flex',
                            alignItems: 'center',
                            padding: '0 0.625rem',
                            borderRadius: 10,
                            border: '1px solid var(--color-border, #e5e7eb)',
                            background: 'var(--color-bg-card, #ffffff)',
                            fontFamily: 'var(--font-mono)',
                            fontSize: '0.8125rem',
                            color: 'var(--color-text-secondary, #6B7280)',
                            whiteSpace: 'nowrap',
                            flexShrink: 0,
                          }}
                        >
                          {phoneCountryCode}
                        </span>
                        <input
                          type="tel"
                          value={telefono}
                          onChange={(e) => setTelefono(e.target.value)}
                          placeholder="55 1234 5678"
                          style={{ ...inputStyle, flex: 1 }}
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
                      gap: '0.5rem',
                      width: '100%',
                      padding: '0.875rem',
                      borderRadius: 12,
                      background: submitting ? '#6B7280' : '#059669',
                      color: 'white',
                      fontFamily: 'var(--font-body)',
                      fontSize: '0.9375rem',
                      fontWeight: 600,
                      border: 'none',
                      cursor: submitting ? 'wait' : 'pointer',
                      boxShadow: '0 2px 12px rgba(5,150,105,0.3)',
                      transition: 'all 0.2s',
                      marginTop: '0.5rem',
                    }}
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
                    marginTop: '1.5rem',
                    textAlign: 'center',
                    borderTop: '1px solid var(--color-border, #e5e7eb)',
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
                      fontSize: '0.8125rem',
                      color: 'var(--color-text-secondary, #6B7280)',
                      textDecoration: 'none',
                    }}
                  >
                    &iquest;Ya tienes cuenta?{' '}
                    <span style={{ color: '#059669', fontWeight: 600 }}>Inicia sesi&oacute;n</span>
                    <ChevronRight size={14} color="#059669" />
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
