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
      padding: '5rem 0',
      background: 'linear-gradient(180deg, var(--color-bg-primary) 0%, var(--color-bg-warm) 100%)',
    }}>
      <div style={{ maxWidth: 1100, margin: '0 auto', padding: '0 1.5rem', textAlign: 'center' }}>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-50px' }}
          transition={{ duration: 0.5 }}
        >
          <span style={{
            display: 'inline-block',
            padding: '0.3rem 0.875rem',
            borderRadius: 9999,
            background: '#059669',
            fontFamily: 'var(--font-body)',
            fontSize: '0.6875rem',
            fontWeight: 700,
            color: '#FFFFFF',
            letterSpacing: '0.06em',
            textTransform: 'uppercase',
            marginBottom: '0.625rem',
          }}>
            EMPIEZA AQUÍ CON TU DIAGNÓSTICO GRATUITO
          </span>
          <h2 style={{
            fontFamily: 'var(--font-heading)',
            fontSize: 'clamp(1.75rem, 3.5vw, 2.5rem)',
            fontWeight: 800,
            lineHeight: 1.15,
            letterSpacing: '-0.02em',
            color: 'var(--color-text-primary)',
            marginBottom: '1rem',
          }}>
            Evalúa tu <span style={{ background: 'linear-gradient(135deg, #059669, #0891B2)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>Startup Readiness</span>
          </h2>
          <p style={{
            fontFamily: 'var(--font-body)',
            fontSize: '1.0625rem',
            lineHeight: 1.7,
            color: 'var(--color-text-secondary)',
            maxWidth: 600,
            margin: '0 auto 2.5rem',
          }}>
            10 preguntas que evalúan tu idea, mercado, equipo y modelo de negocio.
            Descubre tu etapa real y accede a las herramientas que necesitas hoy.
          </p>
        </motion.div>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
          gap: '1rem',
        }}>
          {features.map((f, i) => (
            <motion.div
              key={f.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-30px' }}
              transition={{ duration: 0.4, delay: i * 0.1 }}
              whileHover={{ y: -4, boxShadow: '0 8px 30px rgba(0,0,0,0.08)' }}
              style={{
                background: 'white',
                borderRadius: 16,
                border: '1px solid var(--color-border)',
                padding: '2rem 1.75rem',
                textAlign: 'center',
                cursor: 'default',
              }}
            >
              <div style={{
                width: 48,
                height: 48,
                borderRadius: 14,
                background: 'rgba(5,150,105,0.06)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 0.75rem',
              }}>
                <f.icon size={22} strokeWidth={1.5} color="#059669" />
              </div>
              <h3 style={{
                fontFamily: 'var(--font-heading)',
                fontSize: '1rem',
                fontWeight: 700,
                color: 'var(--color-text-primary)',
                marginBottom: '0.5rem',
              }}>
                {f.title}
              </h3>
              <p style={{
                fontFamily: 'var(--font-body)',
                fontSize: '0.8125rem',
                lineHeight: 1.6,
                color: 'var(--color-text-secondary)',
              }}>
                {f.desc}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
