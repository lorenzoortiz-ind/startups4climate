'use client'

import { motion } from 'framer-motion'
import { Zap, BarChart2, ArrowRight } from 'lucide-react'

const features = [
  { icon: Zap, title: 'Evaluación rápida', desc: 'Diseñado para founders ocupados. En menos de 5 minutos sabrás exactamente en qué etapa está tu startup y qué necesitas priorizar.' },
  { icon: BarChart2, title: 'Análisis integral', desc: 'Calificamos tu idea, mercado, equipo y modelo de negocio con un scoring preciso que te ubica en una de las 4 etapas del desarrollo.' },
  { icon: ArrowRight, title: 'Ruta de herramientas personalizada', desc: 'Al finalizar, desbloqueas acceso directo a las herramientas que corresponden a tu etapa exacta. Sin adivinar, sin perder tiempo.' },
]

const springReveal = {
  initial: { opacity: 0, y: 60 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: '-100px' },
  transition: { type: 'spring', damping: 20, stiffness: 100 } as any,
}

export default function DiagnosticFeature() {
  return (
    <section
      id="diagnostico-info"
      style={{
        padding: 'var(--section-py) 0',
        background: 'var(--color-ink)',
        color: 'var(--color-paper)',
      }}
    >
      <div style={{ maxWidth: 'var(--container-max)', margin: '0 auto', padding: '0 var(--container-px)' }}>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '4vw' }}>

          <motion.div
            {...springReveal}
            style={{ flex: 1, paddingBottom: '3rem' }}
          >
            <span style={{
              display: 'inline-block',
              fontFamily: 'var(--font-body)',
              fontSize: '12px',
              fontWeight: 600,
              letterSpacing: '0.12em',
              textTransform: 'uppercase' as const,
              color: 'var(--color-accent-primary)',
              marginBottom: '1.5rem',
            }}>
              EMPIEZA AQUÍ
            </span>
            <h2 style={{
              fontFamily: 'var(--font-heading)',
              fontSize: 'var(--text-display-lg)',
              fontWeight: 700,
              lineHeight: 1.05,
              letterSpacing: '-0.03em',
              marginBottom: '2rem',
              color: 'var(--color-paper)',
            }}>
              Diagnóstico de Startup Readiness
            </h2>
            <p style={{
              fontFamily: 'var(--font-body)',
              fontSize: 'var(--text-heading-lg)',
              lineHeight: 1.4,
              color: 'rgba(255,255,255,0.7)',
              maxWidth: 600,
            }}>
              10 preguntas que evalúan tu idea, mercado, equipo y modelo de negocio. Descubre tu etapa real y accede a las herramientas que necesitas hoy.
            </p>
          </motion.div>

          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '2.5rem' }}>
            {features.map((f, i) => (
              <motion.div
                key={f.title}
                initial={{ opacity: 0, x: 50 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, margin: '-100px' }}
                transition={{ type: 'spring', damping: 20, stiffness: 100, delay: i * 0.15 }}
                style={{
                  display: 'flex',
                  gap: '1.5rem',
                  alignItems: 'flex-start',
                }}
              >
                <div style={{
                  minWidth: 56,
                  height: 56,
                  borderRadius: 'var(--radius-full)',
                  background: 'rgba(255,255,255,0.1)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: 'var(--color-paper)',
                }}>
                  <f.icon size={24} strokeWidth={2} />
                </div>
                <div>
                  <h3 style={{
                    fontFamily: 'var(--font-heading)',
                    fontSize: 'var(--text-heading-lg)',
                    fontWeight: 700,
                    letterSpacing: '-0.02em',
                    marginBottom: '0.5rem',
                    color: 'var(--color-paper)',
                  }}>
                    {f.title}
                  </h3>
                  <p style={{
                    fontFamily: 'var(--font-body)',
                    fontSize: 'var(--text-body-lg)',
                    lineHeight: 1.5,
                    color: 'rgba(255,255,255,0.6)',
                    margin: 0,
                  }}>
                    {f.desc}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>

        </div>
      </div>
    </section>
  )
}
