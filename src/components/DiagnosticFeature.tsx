'use client'

import { motion } from 'framer-motion'
import { Clock, BarChart2, ArrowRight } from 'lucide-react'

const features = [
  { icon: Clock, title: 'Evaluación rápida', desc: 'Diseñado para founders ocupados. En menos de 5 minutos sabrás exactamente en qué etapa está tu startup y qué necesitas priorizar.' },
  { icon: BarChart2, title: 'Análisis integral', desc: 'Calificamos tu idea, mercado, equipo y modelo de negocio con un scoring preciso que te ubica en una de las 4 etapas del desarrollo.' },
  { icon: ArrowRight, title: 'Ruta personalizada', desc: 'Al finalizar, desbloqueas acceso directo a las herramientas que corresponden a tu etapa exacta. Sin adivinar, sin perder tiempo.' },
]

export default function DiagnosticFeature() {
  return (
    <section style={{
      padding: 'clamp(4rem, 8vw, 10rem) 0',
      background: '#2A222B',
      position: 'relative',
      overflow: 'hidden',
    }}>
      <div style={{ maxWidth: 1100, margin: '0 auto', padding: '0 clamp(1.5rem, 4vw, 5rem)', textAlign: 'center', position: 'relative', zIndex: 1 }}>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-50px' }}
          transition={{ duration: 0.5, ease: 'easeOut' }}
        >
          <span style={{
            display: 'inline-block',
            fontSize: '0.8125rem',
            fontWeight: 600,
            letterSpacing: '0.1em',
            textTransform: 'uppercase' as const,
            color: '#FF6B4A',
            marginBottom: '1.25rem',
          }}>
            Empieza aquí
          </span>
          <h2 style={{
            fontSize: 'clamp(2rem, 4vw, 3rem)',
            fontWeight: 700,
            lineHeight: 1.1,
            letterSpacing: '-0.025em',
            color: 'white',
            marginBottom: '1.25rem',
          }}>
            Evalúa tu{' '}
            <span style={{
              background: 'linear-gradient(135deg, #FF6B4A, #0D9488)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
            }}>
              Startup Readiness
            </span>
          </h2>
          <p style={{
            fontSize: 'clamp(1rem, 1.5vw, 1.125rem)',
            lineHeight: 1.7,
            color: 'rgba(255,255,255,0.65)',
            maxWidth: 620,
            margin: '0 auto clamp(2.5rem, 4vw, 4rem)',
          }}>
            10 preguntas que evalúan tu idea, mercado, equipo y modelo de negocio.
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
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-30px' }}
              transition={{ duration: 0.4, delay: i * 0.1, ease: 'easeOut' }}
              whileHover={{ y: -4, boxShadow: '0 16px 48px rgba(0,0,0,0.3)' }}
              style={{
                background: 'rgba(255,255,255,0.06)',
                borderRadius: 16,
                border: '1px solid rgba(255,255,255,0.08)',
                padding: '2.25rem 2rem',
                textAlign: 'center',
                cursor: 'default',
                transition: 'transform 0.3s ease, box-shadow 0.3s ease',
              }}
            >
              <div style={{
                width: 52,
                height: 52,
                borderRadius: 12,
                background: 'rgba(255,107,74,0.12)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 1.25rem',
              }}>
                <f.icon size={24} strokeWidth={1.5} color="#FF6B4A" />
              </div>
              <h3 style={{
                fontSize: 'clamp(1rem, 1.3vw, 1.125rem)',
                fontWeight: 700,
                color: 'white',
                marginBottom: '0.625rem',
                letterSpacing: '-0.01em',
              }}>
                {f.title}
              </h3>
              <p style={{
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
        @media (max-width: 768px) {
          .diagnostic-cards-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </section>
  )
}
