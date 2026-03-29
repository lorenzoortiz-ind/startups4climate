'use client'

import { motion } from 'framer-motion'
import { Clock, BarChart2, ArrowRight } from 'lucide-react'

const features = [
  { icon: Clock, title: 'Evaluación rápida', desc: 'Diseñado para founders ocupados. En menos de 5 minutos sabrás exactamente en qué etapa está tu startup y qué necesitas priorizar.' },
  { icon: BarChart2, title: 'Análisis integral', desc: 'Calificamos tu idea, mercado, equipo y modelo de negocio con un scoring preciso que te ubica en una de las 4 etapas del desarrollo.' },
  { icon: ArrowRight, title: 'Ruta de herramientas personalizada', desc: 'Al finalizar, desbloqueas acceso directo a las herramientas que corresponden a tu etapa exacta. Sin adivinar, sin perder tiempo.' },
]

export default function DiagnosticFeature() {
  return (
    <section style={{
      padding: '6rem 0',
      background: 'linear-gradient(160deg, #064E3B 0%, #0F766E 50%, #115E59 100%)',
      position: 'relative',
      overflow: 'hidden',
    }}>
      {/* Subtle decorative glow */}
      <div style={{
        position: 'absolute',
        top: '-30%',
        right: '-10%',
        width: '50vw',
        height: '50vw',
        borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(167,243,208,0.12) 0%, transparent 70%)',
        filter: 'blur(80px)',
        pointerEvents: 'none',
      }} />

      <div style={{ maxWidth: 1100, margin: '0 auto', padding: '0 2rem', textAlign: 'center', position: 'relative', zIndex: 1 }}>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-50px' }}
          transition={{ duration: 0.5 }}
        >
          <span style={{
            display: 'inline-block',
            padding: '0.4rem 1.25rem',
            borderRadius: 9999,
            background: 'rgba(255,255,255,0.12)',
            backdropFilter: 'blur(8px)',
            border: '1px solid rgba(255,255,255,0.15)',
            fontFamily: 'var(--font-body)',
            fontSize: '0.75rem',
            fontWeight: 700,
            color: '#A7F3D0',
            letterSpacing: '0.08em',
            textTransform: 'uppercase',
            marginBottom: '1.25rem',
          }}>
            EMPIEZA AQUÍ CON TU DIAGNÓSTICO GRATUITO
          </span>
          <h2 style={{
            fontFamily: 'var(--font-heading)',
            fontSize: 'clamp(2rem, 4vw, 3rem)',
            fontWeight: 800,
            lineHeight: 1.1,
            letterSpacing: '-0.03em',
            color: 'white',
            marginBottom: '1.25rem',
          }}>
            Evalúa tu{' '}
            <span style={{
              background: 'linear-gradient(135deg, #A7F3D0, #67E8F9)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
            }}>
              Startup Readiness
            </span>
          </h2>
          <p style={{
            fontFamily: 'var(--font-body)',
            fontSize: 'clamp(1rem, 1.5vw, 1.125rem)',
            lineHeight: 1.7,
            color: 'rgba(255,255,255,0.75)',
            maxWidth: 620,
            margin: '0 auto 3.5rem',
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
              transition={{ duration: 0.4, delay: i * 0.1 }}
              whileHover={{ y: -4, boxShadow: '0 16px 48px rgba(0,0,0,0.2)' }}
              style={{
                background: 'rgba(255,255,255,0.07)',
                backdropFilter: 'blur(12px)',
                borderRadius: 24,
                border: '1px solid rgba(255,255,255,0.1)',
                padding: '2.25rem 2rem',
                textAlign: 'center',
                cursor: 'default',
                boxShadow: '0 4px 24px rgba(0,0,0,0.1)',
                transition: 'transform 0.3s ease-out, box-shadow 0.3s ease-out',
              }}
            >
              <div style={{
                width: 56,
                height: 56,
                borderRadius: '50%',
                background: 'rgba(167,243,208,0.12)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 1.25rem',
              }}>
                <f.icon size={24} strokeWidth={1.5} color="#A7F3D0" />
              </div>
              <h3 style={{
                fontFamily: 'var(--font-heading)',
                fontSize: 'clamp(1rem, 1.3vw, 1.125rem)',
                fontWeight: 700,
                color: 'white',
                marginBottom: '0.625rem',
                letterSpacing: '-0.01em',
              }}>
                {f.title}
              </h3>
              <p style={{
                fontFamily: 'var(--font-body)',
                fontSize: '0.9375rem',
                lineHeight: 1.7,
                color: 'rgba(255,255,255,0.65)',
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
