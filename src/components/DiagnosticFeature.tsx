'use client'

import { motion } from 'framer-motion'
import { Zap, BarChart2, ArrowRight } from 'lucide-react'

const features = [
  { icon: Zap, title: 'Evaluación rápida', desc: 'Para founders ocupados. En menos de 5 minutos sabrás en qué etapa está tu startup y qué priorizar.' },
  { icon: BarChart2, title: 'Análisis integral', desc: 'Calificamos idea, mercado, equipo y modelo con un scoring que te ubica en una de las 4 etapas.' },
  { icon: ArrowRight, title: 'Ruta personalizada', desc: 'Al finalizar desbloqueas las herramientas que corresponden a tu etapa exacta. Sin adivinar.' },
]

export default function DiagnosticFeature() {
  return (
    <section
      id="diagnostico-info"
      style={{
        position: 'relative',
        padding: 'clamp(5rem, 10vw, 8rem) 0',
        background: 'var(--color-bg-primary)',
        color: 'var(--color-text-primary)',
        overflow: 'hidden',
      }}
    >
      <div
        className="orb orb-electric orb-sm"
        style={{ bottom: '-200px', right: '-200px', opacity: 0.25 }}
        aria-hidden
      />
      <div
        style={{
          maxWidth: 1280,
          margin: '0 auto',
          padding: '0 clamp(1.25rem, 4vw, 3rem)',
          position: 'relative',
          zIndex: 1,
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gap: 'clamp(2rem, 6vw, 5rem)',
          alignItems: 'center',
        }}
        className="diag-grid"
      >
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.6 }}
        >
          <span className="pill-electric" style={{ marginBottom: '1.5rem' }}>
            <span className="dot" /> Empieza aquí
          </span>
          <h2
            style={{
              fontFamily: 'var(--font-heading)',
              fontSize: 'clamp(2rem, 4.5vw, 3.4rem)',
              fontWeight: 500,
              lineHeight: 1.05,
              letterSpacing: '-0.03em',
              margin: '1rem 0 1.25rem',
              color: 'var(--color-ink)',
            }}
          >
            Diagnóstico de{' '}
            <span className="text-electric">Startup Readiness</span>
          </h2>
          <p
            style={{
              fontFamily: 'var(--font-body)',
              fontSize: 'clamp(1rem, 1.3vw, 1.15rem)',
              lineHeight: 1.55,
              color: 'var(--color-text-secondary)',
              margin: 0,
              maxWidth: 520,
            }}
          >
            10 preguntas que evalúan tu idea, mercado, equipo y modelo de negocio. Descubre tu etapa real y accede a las herramientas que necesitas hoy.
          </p>
        </motion.div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {features.map((f, i) => (
            <motion.div
              key={f.title}
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: '-80px' }}
              transition={{ duration: 0.5, delay: i * 0.08 }}
              className="glass-card"
              style={{
                display: 'flex',
                gap: '1.25rem',
                alignItems: 'flex-start',
                padding: '1.25rem 1.5rem',
                borderRadius: 16,
                border: '1px solid rgba(31,119,246,0.22)',
              }}
            >
              <div
                style={{
                  minWidth: 42,
                  height: 42,
                  borderRadius: 12,
                  background: 'linear-gradient(135deg, rgba(31,119,246,0.18), rgba(31,119,246,0.08))',
                  border: '1px solid rgba(31,119,246,0.35)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#5C9BFF',
                }}
              >
                <f.icon size={18} strokeWidth={2} />
              </div>
              <div>
                <h3
                  style={{
                    fontFamily: 'var(--font-heading)',
                    fontSize: '1.125rem',
                    fontWeight: 500,
                    letterSpacing: '-0.02em',
                    marginBottom: '0.35rem',
                    color: 'var(--color-ink)',
                    lineHeight: 1.2,
                  }}
                >
                  {f.title}
                </h3>
                <p
                  style={{
                    fontFamily: 'var(--font-body)',
                    fontSize: '0.9rem',
                    lineHeight: 1.5,
                    color: 'var(--color-text-secondary)',
                    margin: 0,
                  }}
                >
                  {f.desc}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      <style>{`
        @media (max-width: 900px) {
          .diag-grid {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </section>
  )
}
