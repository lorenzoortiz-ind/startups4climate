'use client'

import { motion } from 'framer-motion'
import { Clock, BarChart2, ArrowRight } from 'lucide-react'

const features = [
  { icon: Clock, title: 'Evaluacion rapida', desc: 'Disenado para founders ocupados. En menos de 5 minutos sabras exactamente en que etapa esta tu startup y que necesitas priorizar.' },
  { icon: BarChart2, title: 'Analisis integral', desc: 'Calificamos tu idea, mercado, equipo y modelo de negocio con un scoring preciso que te ubica en una de las 4 etapas del desarrollo.' },
  { icon: ArrowRight, title: 'Ruta personalizada', desc: 'Al finalizar, desbloqueas acceso directo a las herramientas que corresponden a tu etapa exacta. Sin adivinar, sin perder tiempo.' },
]

const ease = [0.25, 0.1, 0.25, 1] as [number, number, number, number]

export default function DiagnosticFeature() {
  return (
    <section
      id="diagnostico"
      style={{
        padding: 'clamp(5rem, 10vw, 10rem) 0',
        background: '#2A222B',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      <div style={{ maxWidth: 1100, margin: '0 auto', padding: '0 clamp(1.5rem, 4vw, 5rem)', textAlign: 'center', position: 'relative', zIndex: 1 }}>
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.6, ease }}
        >
          <span style={{
            display: 'inline-block',
            fontFamily: 'var(--font-body)',
            fontSize: '12px',
            fontWeight: 600,
            letterSpacing: '0.12em',
            textTransform: 'uppercase',
            color: '#FF6B4A',
            marginBottom: '1.25rem',
          }}>
            Empieza aqui
          </span>
          <h2 style={{
            fontFamily: 'var(--font-heading)',
            fontSize: 'clamp(2rem, 4vw, 3rem)',
            fontWeight: 400,
            lineHeight: 1.1,
            letterSpacing: '-0.02em',
            color: 'white',
            marginBottom: '1.25rem',
          }}>
            Evalua tu{' '}
            <span style={{ color: '#FF6B4A' }}>
              Startup Readiness
            </span>
          </h2>
          <p style={{
            fontFamily: 'var(--font-body)',
            fontSize: 'clamp(1rem, 1.5vw, 1.125rem)',
            lineHeight: 1.7,
            color: 'rgba(255,255,255,0.65)',
            maxWidth: 620,
            margin: '0 auto clamp(2.5rem, 4vw, 4rem)',
          }}>
            10 preguntas que evaluan tu idea, mercado, equipo y modelo de negocio.
            Descubre tu etapa real y accede a las herramientas que necesitas hoy.
          </p>
        </motion.div>

        <div
          className="diagnostic-cards-grid"
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(3, 1fr)',
            gap: '1.75rem',
          }}
        >
          {features.map((f, i) => (
            <motion.div
              key={f.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-80px' }}
              transition={{ duration: 0.6, delay: i * 0.1, ease }}
              className="diagnostic-card"
              style={{
                background: 'rgba(255,255,255,0.06)',
                borderRadius: 12,
                border: '1px solid rgba(255,255,255,0.08)',
                padding: '2.25rem 2rem',
                textAlign: 'center',
                cursor: 'default',
                transition: 'transform 0.3s ease, box-shadow 0.3s ease',
              }}
            >
              <div style={{
                width: 48,
                height: 48,
                borderRadius: 10,
                background: 'rgba(255,107,74,0.12)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 1.25rem',
              }}>
                <f.icon size={24} strokeWidth={1.5} color="#FF6B4A" />
              </div>
              <h3 style={{
                fontFamily: 'var(--font-heading)',
                fontSize: 'clamp(1rem, 1.3vw, 1.125rem)',
                fontWeight: 400,
                color: 'white',
                marginBottom: '0.625rem',
                letterSpacing: '-0.02em',
              }}>
                {f.title}
              </h3>
              <p style={{
                fontFamily: 'var(--font-body)',
                fontSize: '0.9375rem',
                lineHeight: 1.7,
                color: 'rgba(255,255,255,0.55)',
                margin: 0,
              }}>
                {f.desc}
              </p>
            </motion.div>
          ))}
        </div>
      </div>

      <style>{`
        .diagnostic-card:hover {
          transform: translateY(-4px) !important;
          box-shadow: 0 16px 48px rgba(0,0,0,0.3) !important;
        }
        @media (max-width: 768px) {
          .diagnostic-cards-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </section>
  )
}
