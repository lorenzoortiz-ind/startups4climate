'use client'

import { motion } from 'framer-motion'
import { Wrench, Bot, Radar, Gift } from 'lucide-react'

const pillars = [
  {
    icon: Wrench,
    title: '+30 herramientas interactivas',
    subtitle: 'Paso a paso, con marco conceptual',
    description: 'Cada herramienta te guía desde la teoría hasta la ejecución. No necesitas un MBA: el marco conceptual viene incluido para que aprendas mientras construyes tu startup.',
    color: '#059669',
    bg: 'rgba(5,150,105,0.06)',
  },
  {
    icon: Bot,
    title: 'Mentores AI por vertical',
    subtitle: 'Fintech, healthtech, climatetech y más',
    description: 'Accede a mentores de inteligencia artificial especializados en tu industria. Recibe retroalimentación contextual sobre tu modelo de negocio, mercado y estrategia de crecimiento.',
    color: '#0891B2',
    bg: 'rgba(8,145,178,0.06)',
  },
  {
    icon: Radar,
    title: 'RADAR del ecosistema',
    subtitle: 'Noticias, regulaciones y tendencias',
    description: 'Mantente al día con lo que está pasando en el ecosistema emprendedor de LATAM. Noticias relevantes, cambios regulatorios y tendencias de inversión, curados para ti.',
    color: '#7C3AED',
    bg: 'rgba(124,58,237,0.06)',
  },
  {
    icon: Gift,
    title: 'Oportunidades personalizadas',
    subtitle: 'Grants, competencias y fondos',
    description: 'La plataforma identifica convocatorias, competencias, grants y fondos de inversión que coinciden con tu perfil, vertical y etapa. Deja de buscar oportunidades a ciegas.',
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
            La plataforma
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
            Un ecosistema completo para desarrollar tu startup
          </h2>
          <p style={{
            fontFamily: 'var(--font-body)',
            fontSize: '1.0625rem',
            lineHeight: 1.7,
            color: 'var(--color-text-secondary)',
          }}>
            No es solo un toolkit. Es la infraestructura que conecta herramientas, conocimiento,
            inteligencia artificial y oportunidades reales en un solo lugar.
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
