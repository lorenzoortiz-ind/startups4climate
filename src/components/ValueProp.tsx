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
    color: '#059669',
    bg: 'rgba(5,150,105,0.06)',
  },
  {
    icon: Bot,
    title: 'Mentores AI',
    description: 'Retroalimentación contextual sobre tu modelo de negocio, mercado y estrategia, adaptada a tu vertical.',
    color: '#0891B2',
    bg: 'rgba(8,145,178,0.06)',
  },
  {
    icon: Radar,
    title: 'RADAR del ecosistema',
    description: 'Noticias, cambios regulatorios y tendencias de inversión en LATAM, curados para ti.',
    color: '#7C3AED',
    bg: 'rgba(124,58,237,0.06)',
  },
  {
    icon: Gift,
    title: 'Oportunidades',
    description: 'Grants, competencias y fondos que coinciden con tu perfil, etapa y vertical. Actualizados semanalmente.',
    color: '#D97706',
    bg: 'rgba(217,119,6,0.06)',
  },
  {
    icon: Stamp,
    title: 'Startup Passport',
    description: 'Un perfil verificable de tu startup con métricas y nivel de madurez. Compartible con inversores y programas.',
    color: '#DC2626',
    bg: 'rgba(220,38,38,0.06)',
  },
  {
    icon: UserCircle,
    title: 'Perfil progresivo',
    description: 'Empieza con lo básico y la plataforma se adapta. Herramientas y recomendaciones se desbloquean a medida que avanzas.',
    color: '#0891B2',
    bg: 'rgba(8,145,178,0.06)',
  },
]

function FeatureCard({ feature, delay }: { feature: typeof features[0]; delay: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-30px' }}
      transition={{ duration: 0.4, delay }}
      whileHover={{ y: -3, boxShadow: '0 4px 20px rgba(0,0,0,0.08)' }}
      style={{
        background: 'white',
        borderRadius: 16,
        border: '1px solid var(--color-border)',
        padding: '1.75rem',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      <div style={{
        width: 44,
        height: 44,
        borderRadius: 12,
        background: feature.bg,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: '1rem',
      }}>
        <feature.icon size={22} strokeWidth={1.5} color={feature.color} />
      </div>
      <h3 style={{
        fontFamily: 'var(--font-heading)',
        fontSize: '1rem',
        fontWeight: 700,
        color: 'var(--color-text-primary)',
        marginBottom: '0.5rem',
      }}>
        {feature.title}
      </h3>
      <p style={{
        fontFamily: 'var(--font-body)',
        fontSize: '0.875rem',
        lineHeight: 1.65,
        color: 'var(--color-text-secondary)',
      }}>
        {feature.description}
      </p>
    </motion.div>
  )
}

export default function ValueProp() {
  return (
    <section id="plataforma" style={{ padding: '5rem 0 3rem', background: 'white' }}>
      <div style={{ maxWidth: 1200, margin: '0 auto', padding: '0 1.5rem' }}>
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-50px' }}
          transition={{ duration: 0.5 }}
          style={{ textAlign: 'center', maxWidth: 700, margin: '0 auto 3rem' }}
        >
          <span
            style={{
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
              textTransform: 'uppercase' as const,
              marginBottom: '1rem',
            }}
          >
            La plataforma
          </span>
          <h2
            style={{
              fontFamily: 'var(--font-heading)',
              fontSize: 'clamp(1.75rem, 3.5vw, 2.5rem)',
              fontWeight: 800,
              lineHeight: 1.15,
              letterSpacing: '-0.02em',
              color: 'var(--color-text-primary)',
              marginBottom: '1rem',
            }}
          >
            Un ecosistema completo para desarrollar tu startup
          </h2>
          <p
            style={{
              fontFamily: 'var(--font-body)',
              fontSize: '1.0625rem',
              lineHeight: 1.7,
              color: 'var(--color-text-secondary)',
            }}
          >
            Sin costo, sin aplicaciones, sin esperas. Crea tu cuenta y accede a la Plataforma{' '}
            <span style={{ background: 'linear-gradient(135deg, #059669, #0891B2)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', fontWeight: 700 }}>S4C</span>
            {' '}para desarrollar tu startup de impacto.
          </p>
        </motion.div>

        {/* Feature cards grid */}
        <div
          className="valueprop-features-grid"
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(3, 1fr)',
            gap: '1.25rem',
            marginTop: '3rem',
          }}
        >
          {features.map((feature, i) => (
            <FeatureCard key={feature.title} feature={feature} delay={i * 0.08} />
          ))}
        </div>
      </div>

      <style>{`
        @media (max-width: 768px) {
          .valueprop-features-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </section>
  )
}
