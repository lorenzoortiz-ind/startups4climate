'use client'

import { useState } from 'react'
import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'
import { BookOpen, Download, CheckCircle2, ArrowRight, ChevronRight } from 'lucide-react'
import { useAuth } from '@/context/AuthContext'

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
  'M\u00e9xico',
  'Nicaragua',
  'Panam\u00e1',
  'Paraguay',
  'Per\u00fa',
  'Puerto Rico',
  'Rep\u00fablica Dominicana',
  'Uruguay',
  'Venezuela',
]

const TOC_ITEMS = [
  { chapter: '01', title: 'Encuentra tu prop\u00f3sito como founder', stage: 'Pre-incubaci\u00f3n', color: '#7C3AED' },
  { chapter: '02', title: 'Valida el problema y tu mercado', stage: 'Pre-incubaci\u00f3n', color: '#7C3AED' },
  { chapter: '03', title: 'Dise\u00f1a tu propuesta de valor', stage: 'Pre-incubaci\u00f3n', color: '#7C3AED' },
  { chapter: '04', title: 'Construye tu MVP y primeras m\u00e9tricas', stage: 'Incubaci\u00f3n', color: '#059669' },
  { chapter: '05', title: 'Consigue tus primeros clientes', stage: 'Incubaci\u00f3n', color: '#059669' },
  { chapter: '06', title: 'Define tu modelo de negocio', stage: 'Aceleraci\u00f3n', color: '#D97706' },
  { chapter: '07', title: 'Estructura tu proceso de ventas', stage: 'Aceleraci\u00f3n', color: '#D97706' },
  { chapter: '08', title: 'Prepara tu startup para escalar', stage: 'Escalamiento', color: '#0891B2' },
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

export default function WorkbookPage() {
  const { user } = useAuth()
  const [nombre, setNombre] = useState('')
  const [email, setEmail] = useState('')
  const [pais, setPais] = useState('')
  const [submitted, setSubmitted] = useState(false)
  const [submitting, setSubmitting] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!nombre || !email || !pais) return
    setSubmitting(true)
    // Simulate API call
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

      {/* Hero */}
      <section
        style={{
          padding: '4rem 2rem 3rem',
          maxWidth: 900,
          margin: '0 auto',
          textAlign: 'center',
        }}
      >
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
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
              margin: '0 auto',
              lineHeight: 1.7,
            }}
          >
            Todo lo que necesitas saber para lanzar, validar y escalar tu startup de impacto
            en Am&eacute;rica Latina. Desde la ideaci&oacute;n hasta el fundraising, paso a paso.
          </p>
        </motion.div>
      </section>

      {/* Table of Contents */}
      <section style={{ padding: '0 2rem 3rem', maxWidth: 700, margin: '0 auto' }}>
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.15 }}
          style={{
            borderRadius: 20,
            background: 'var(--color-bg-card, #ffffff)',
            border: '1px solid var(--color-border, #e5e7eb)',
            padding: '2rem',
            boxShadow: '0 2px 20px rgba(0,0,0,0.04)',
            marginBottom: '2rem',
          }}
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
      </section>

      {/* Download section */}
      <section
        id="descargar"
        style={{
          padding: '0 2rem 5rem',
          maxWidth: 560,
          margin: '0 auto',
        }}
      >
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.3 }}
          style={{
            borderRadius: 20,
            background: 'var(--color-bg-card, #ffffff)',
            border: '1px solid var(--color-border, #e5e7eb)',
            padding: '2rem',
            boxShadow: '0 2px 20px rgba(0,0,0,0.04)',
          }}
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
                onClick={() => alert('La descarga del workbook estar\u00e1 disponible pr\u00f3ximamente.')}
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
                <div>
                  <label
                    style={{
                      display: 'block',
                      fontFamily: 'var(--font-body)',
                      fontSize: '0.8125rem',
                      fontWeight: 600,
                      color: 'var(--color-text-primary, #111827)',
                      marginBottom: '0.375rem',
                    }}
                  >
                    Nombre
                  </label>
                  <input
                    type="text"
                    value={nombre}
                    onChange={(e) => setNombre(e.target.value)}
                    placeholder="Tu nombre completo"
                    required
                    style={inputStyle}
                  />
                </div>

                <div>
                  <label
                    style={{
                      display: 'block',
                      fontFamily: 'var(--font-body)',
                      fontSize: '0.8125rem',
                      fontWeight: 600,
                      color: 'var(--color-text-primary, #111827)',
                      marginBottom: '0.375rem',
                    }}
                  >
                    Email
                  </label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="tu@email.com"
                    required
                    style={inputStyle}
                  />
                </div>

                <div>
                  <label
                    style={{
                      display: 'block',
                      fontFamily: 'var(--font-body)',
                      fontSize: '0.8125rem',
                      fontWeight: 600,
                      color: 'var(--color-text-primary, #111827)',
                      marginBottom: '0.375rem',
                    }}
                  >
                    Pa&iacute;s
                  </label>
                  <select
                    value={pais}
                    onChange={(e) => setPais(e.target.value)}
                    required
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
                      <Download size={18} />
                      Descargar Workbook
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
      </section>
    </div>
  )
}
