'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { BookOpen, CheckCircle2 } from 'lucide-react'
import Image from 'next/image'

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

export default function WorkbookPage() {
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth <= 768)
    check()
    window.addEventListener('resize', check)
    return () => window.removeEventListener('resize', check)
  }, [])

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
                  fontSize: '0.6rem',
                  fontWeight: 700,
                  color: 'var(--color-accent-secondary)',
                  letterSpacing: '0.04em',
                  textTransform: 'uppercase',
                }}
              >
                USD $15
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
              Guía profesional para{' '}
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
              Lleva tu startup de la idea al escalamiento con metodología profesional.
              Profundiza el uso de las herramientas de la plataforma y aprende a validar,
              construir y escalar paso a paso en América Latina.
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
                      fontSize: '0.7rem',
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
                        fontSize: 'clamp(0.7rem, 1.5vw, 0.88rem)',
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
                        fontSize: '0.64rem',
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

          {/* Right column: Purchase CTA */}
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
            id="comprar"
          >
            {/* Purchase CTA */}
            <div style={{ textAlign: 'center', padding: '1rem 0' }}>
              <div
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  padding: '0.375rem 0.875rem',
                  borderRadius: 'var(--radius-full)',
                  background: 'rgba(255,107,74,0.08)',
                  border: '1px solid rgba(255,107,74,0.15)',
                  marginBottom: '1.5rem',
                }}
              >
                <BookOpen size={14} color="var(--color-accent-secondary)" />
                <span
                  style={{
                    fontFamily: 'var(--font-body)',
                    fontSize: '0.6rem',
                    fontWeight: 700,
                    color: 'var(--color-accent-secondary)',
                    letterSpacing: '0.04em',
                    textTransform: 'uppercase',
                  }}
                >
                  Recurso profesional
                </span>
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
                Adquiere tu Workbook
              </h2>

              <div
                style={{
                  fontFamily: 'var(--font-heading)',
                  fontSize: 'var(--text-display-lg)',
                  fontWeight: 700,
                  color: 'var(--color-accent-primary)',
                  letterSpacing: '-0.04em',
                  lineHeight: 1,
                  marginBottom: '1rem',
                }}
              >
                USD $15
              </div>

              <p
                style={{
                  fontFamily: 'var(--font-body)',
                  fontSize: 'var(--text-body-lg)',
                  color: 'var(--color-text-secondary)',
                  marginBottom: '1.5rem',
                  lineHeight: 1.6,
                  letterSpacing: '-0.01em',
                }}
              >
                Metodología profesional para llevar tu startup de la idea al escalamiento.
                Saca el máximo provecho de las herramientas de la plataforma S4C.
              </p>

              {/* Benefits list */}
              <div
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '0.75rem',
                  textAlign: 'left',
                  marginBottom: '2rem',
                }}
              >
                {[
                  '8 capítulos con metodología paso a paso',
                  'De la ideación al fundraising y escalamiento',
                  'Complemento profesional de las herramientas S4C',
                  'Enfocado en startups de impacto en LATAM',
                ].map((benefit) => (
                  <div
                    key={benefit}
                    style={{
                      display: 'flex',
                      alignItems: 'flex-start',
                      gap: '0.625rem',
                    }}
                  >
                    <CheckCircle2
                      size={18}
                      color="var(--color-accent-secondary)"
                      style={{ flexShrink: 0, marginTop: '0.125rem' }}
                    />
                    <span
                      style={{
                        fontFamily: 'var(--font-body)',
                        fontSize: '0.75rem',
                        color: 'var(--color-text-secondary)',
                        lineHeight: 1.4,
                        letterSpacing: '-0.01em',
                      }}
                    >
                      {benefit}
                    </span>
                  </div>
                ))}
              </div>

              {/* WhatsApp CTA button */}
              <a
                href="https://wa.me/51989338401?text=Hola%2C%20me%20interesa%20adquirir%20el%20Workbook%20de%20Startups4Climate%20%F0%9F%9A%80"
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '0.625rem',
                  width: '100%',
                  padding: '1.125rem 2rem',
                  borderRadius: 'var(--radius-full)',
                  background: '#25D366',
                  color: '#fff',
                  fontFamily: 'var(--font-body)',
                  fontSize: 'var(--text-body-lg)',
                  fontWeight: 700,
                  border: 'none',
                  cursor: 'pointer',
                  letterSpacing: '-0.01em',
                  textDecoration: 'none',
                  transition: 'background 0.2s ease',
                }}
                onMouseEnter={(e) => { e.currentTarget.style.background = '#1EB954' }}
                onMouseLeave={(e) => { e.currentTarget.style.background = '#25D366' }}
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                </svg>
                Comprar por WhatsApp
              </a>

              <p
                style={{
                  fontFamily: 'var(--font-body)',
                  fontSize: '0.65rem',
                  color: 'var(--color-text-muted)',
                  marginTop: '1rem',
                  lineHeight: 1.5,
                }}
              >
                Pago seguro. Recibes el PDF al instante.
              </p>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  )
}
