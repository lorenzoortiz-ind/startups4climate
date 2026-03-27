'use client'

import { motion } from 'framer-motion'
import { Zap, Target, BookOpen, Globe } from 'lucide-react'

const pillars = [
  {
    icon: Zap,
    title: 'Herramientas paso a paso',
    subtitle: 'A tu ritmo, sin rigidez',
    description: 'A tu ritmo, sin programas rigidos de 12 semanas. 24 herramientas que siguen una metodologia probada basada en los 24 pasos del MIT Disciplined Entrepreneurship.',
    color: '#059669',
    bg: 'rgba(5,150,105,0.06)',
  },
  {
    icon: Target,
    title: 'Diagnostico personalizado',
    subtitle: 'Tu punto de partida exacto',
    description: 'Evaluamos en que etapa estas y te mostramos exactamente que herramientas necesitas ahora. Sin perder tiempo en lo que no corresponde a tu momento.',
    color: '#0891B2',
    bg: 'rgba(8,145,178,0.06)',
  },
  {
    icon: BookOpen,
    title: 'Marco conceptual incluido',
    subtitle: 'No asumimos que ya sabes todo',
    description: 'Cada herramienta viene con una explicacion de por que la necesitas y las bases teoricas detras. Aprendes mientras construyes — no necesitas un MBA para empezar.',
    color: '#7C3AED',
    bg: 'rgba(124,58,237,0.06)',
  },
  {
    icon: Globe,
    title: 'Acceso desde cualquier lugar',
    subtitle: 'Democratizacion real',
    description: 'Cualquier founder en Latinoamerica con internet puede acceder. Sin filtros, sin aplicaciones, sin esperar turno. La plataforma esta disponible para ti hoy.',
    color: '#D97706',
    bg: 'rgba(217,119,6,0.06)',
  },
]

export default function ValueProp() {
  return (
    <section id="plataforma" style={{ padding: '6rem 0', background: 'white' }}>
      <div style={{ maxWidth: 1200, margin: '0 auto', padding: '0 1.5rem' }}>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-50px' }}
          transition={{ duration: 0.5 }}
          style={{ textAlign: 'center', maxWidth: 700, margin: '0 auto 3.5rem' }}
        >
          <span style={{
            display: 'inline-block',
            padding: '0.3rem 0.875rem',
            borderRadius: 9999,
            background: 'rgba(5,150,105,0.06)',
            border: '1px solid rgba(5,150,105,0.12)',
            fontFamily: 'var(--font-body)',
            fontSize: '0.75rem',
            fontWeight: 600,
            color: '#059669',
            letterSpacing: '0.03em',
            textTransform: 'uppercase',
            marginBottom: '1rem',
          }}>
            La Plataforma
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
            Todo lo que necesitas para construir tu startup de impacto
          </h2>
          <p style={{
            fontFamily: 'var(--font-body)',
            fontSize: '1.0625rem',
            lineHeight: 1.7,
            color: 'var(--color-text-secondary)',
          }}>
            La plataforma que democratiza el desarrollo de startups de impacto en Latinoamerica.
            Herramientas estructuradas, metodologia probada y acceso libre para cualquier founder.
          </p>
        </motion.div>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
          gap: '1.25rem',
        }}>
          {pillars.map((pillar, i) => (
            <motion.div
              key={pillar.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-30px' }}
              transition={{ duration: 0.4, delay: i * 0.1 }}
              whileHover={{ y: -3, boxShadow: '0 4px 20px rgba(0,0,0,0.08)' }}
              style={{
                background: 'var(--color-bg-primary)',
                borderRadius: 16,
                border: '1px solid var(--color-border)',
                padding: '1.75rem',
              }}
            >
              <div style={{
                width: 44,
                height: 44,
                borderRadius: 12,
                background: pillar.bg,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginBottom: '1rem',
              }}>
                <pillar.icon size={22} strokeWidth={1.5} color={pillar.color} />
              </div>
              <h3 style={{
                fontFamily: 'var(--font-heading)',
                fontSize: '1.0625rem',
                fontWeight: 700,
                color: 'var(--color-text-primary)',
                marginBottom: '0.25rem',
              }}>
                {pillar.title}
              </h3>
              <p style={{
                fontFamily: 'var(--font-mono)',
                fontSize: '0.75rem',
                color: pillar.color,
                fontWeight: 500,
                marginBottom: '0.75rem',
              }}>
                {pillar.subtitle}
              </p>
              <p style={{
                fontFamily: 'var(--font-body)',
                fontSize: '0.875rem',
                lineHeight: 1.65,
                color: 'var(--color-text-secondary)',
              }}>
                {pillar.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
