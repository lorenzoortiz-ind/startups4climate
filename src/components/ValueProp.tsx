'use client'

import { motion } from 'framer-motion'
import {
  Wrench,
  Bot,
  Radar,
  Gift,
  Stamp,
  UserCircle,
} from 'lucide-react'

const features = [
  {
    icon: Wrench,
    title: '30 herramientas interactivas',
    description: 'Desde la idea hasta el modelo validado. Cada herramienta incluye marco conceptual, formularios guiados y outputs descargables.',
  },
  {
    icon: Bot,
    title: 'Mentores AI',
    description: 'Retroalimentación contextual sobre tu modelo de negocio, mercado y estrategia, adaptada a tu vertical.',
  },
  {
    icon: Radar,
    title: 'RADAR del ecosistema',
    description: 'Noticias, cambios regulatorios y tendencias de inversión en LATAM, curados para ti.',
  },
  {
    icon: Gift,
    title: 'Oportunidades',
    description: 'Grants, competencias y fondos que coinciden con tu perfil, etapa y vertical. Actualizados semanalmente.',
  },
  {
    icon: Stamp,
    title: 'Startup Passport',
    description: 'Un perfil verificable de tu startup con métricas y nivel de madurez. Compartible con inversores y programas.',
  },
  {
    icon: UserCircle,
    title: 'Perfil progresivo',
    description: 'Empieza con lo básico y la plataforma se adapta. Herramientas y recomendaciones se desbloquean a medida que avanzas.',
  },
]

const springReveal = {
  initial: { opacity: 0, y: 60 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: '-100px' },
  transition: { type: 'spring', damping: 20, stiffness: 100 } as any,
}

function FeatureCard({ feature, delay }: { feature: typeof features[0]; delay: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 60 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-100px' }}
      transition={{ type: 'spring', damping: 20, stiffness: 100, delay }}
      whileHover={{ y: -6, boxShadow: '0 24px 48px -12px rgba(25,25,25,0.12)' }}
      style={{
        background: 'var(--color-paper)',
        borderRadius: 'var(--radius-lg)',
        border: '1px solid var(--color-border)',
        padding: '3rem 2rem',
        display: 'flex',
        flexDirection: 'column',
        gap: '1.5rem',
        cursor: 'default',
        transition: 'box-shadow 0.2s var(--ease-smooth)',
      }}
    >
      <div style={{
        width: 52,
        height: 52,
        borderRadius: 'var(--radius-full)',
        background: 'var(--color-ink)',
        color: 'var(--color-paper)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        flexShrink: 0,
      }}>
        <feature.icon size={22} strokeWidth={2} />
      </div>
      <div>
        <h3 style={{
          fontFamily: 'var(--font-heading)',
          fontSize: 'var(--text-heading-md)',
          fontWeight: 700,
          color: 'var(--color-ink)',
          marginBottom: '0.75rem',
          letterSpacing: '-0.02em',
          lineHeight: 1.2,
        }}>
          {feature.title}
        </h3>
        <p style={{
          fontFamily: 'var(--font-body)',
          fontSize: 'var(--text-body-lg)',
          lineHeight: 1.6,
          color: 'var(--color-text-secondary)',
          margin: 0,
        }}>
          {feature.description}
        </p>
      </div>
    </motion.div>
  )
}

export default function ValueProp() {
  return (
    <section id="plataforma" style={{ padding: 'var(--section-py) 0', background: 'var(--color-paper)' }}>
      <div style={{ maxWidth: 'var(--container-max)', margin: '0 auto', padding: '0 var(--container-px)' }}>

        <motion.div
          {...springReveal}
          style={{ textAlign: 'left', maxWidth: 900, marginBottom: 'clamp(4rem, 8vw, 6rem)' }}
        >
          <span
            style={{
              display: 'inline-block',
              fontFamily: 'var(--font-body)',
              fontSize: '12px',
              fontWeight: 600,
              letterSpacing: '0.12em',
              textTransform: 'uppercase',
              color: 'var(--color-text-secondary)',
              marginBottom: '1rem',
            }}
          >
            La plataforma
          </span>
          <h2
            style={{
              fontFamily: 'var(--font-heading)',
              fontSize: 'var(--text-display-md)',
              fontWeight: 700,
              lineHeight: 1.05,
              letterSpacing: '-0.03em',
              color: 'var(--color-ink)',
              marginBottom: '1.5rem',
            }}
          >
            Un ecosistema completo para desarrollar tu startup
          </h2>
          <p
            style={{
              fontFamily: 'var(--font-body)',
              fontSize: 'var(--text-body-lg)',
              lineHeight: 1.5,
              color: 'var(--color-text-secondary)',
              maxWidth: 680,
            }}
          >
            Sin costo, sin aplicaciones, sin esperas. Crea tu cuenta y accede a la Plataforma para desarrollar tu startup de impacto.
          </p>
        </motion.div>

        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
            gap: '2rem',
          }}
        >
          {features.map((feature, i) => (
            <FeatureCard key={feature.title} feature={feature} delay={i * 0.1} />
          ))}
        </div>
      </div>
    </section>
  )
}
