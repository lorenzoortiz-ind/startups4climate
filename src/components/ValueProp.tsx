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
    title: '+30 herramientas interactivas',
    description: 'Desde la idea hasta el modelo validado. Cada herramienta incluye marco conceptual, formularios guiados y outputs descargables.',
    color: '#059669',
    bg: 'rgba(5,150,105,0.08)',
  },
  {
    icon: Bot,
    title: 'Mentores AI',
    description: 'Retroalimentación contextual sobre tu modelo de negocio, mercado y estrategia, adaptada a tu startup y vertical.',
    color: '#0891B2',
    bg: 'rgba(8,145,178,0.08)',
  },
  {
    icon: Radar,
    title: 'RADAR del ecosistema',
    description: 'Noticias, cambios regulatorios y tendencias de mercado en LATAM, todo para estar al día en tu industria.',
    color: '#7C3AED',
    bg: 'rgba(124,58,237,0.08)',
  },
  {
    icon: Gift,
    title: 'Oportunidades',
    description: 'Grants, competencias y fondos que coinciden con tu perfil, etapa y vertical. Actualizados semanalmente.',
    color: '#D97706',
    bg: 'rgba(217,119,6,0.08)',
  },
  {
    icon: Stamp,
    title: 'Startup Passport',
    description: 'Un perfil verificable de tu startup con métricas y nivel de madurez. Compartible con inversores y programas.',
    color: '#DC2626',
    bg: 'rgba(220,38,38,0.08)',
  },
  {
    icon: UserCircle,
    title: 'Perfil progresivo',
    description: 'Empieza con lo básico y la plataforma se adapta. Herramientas y recomendaciones se desbloquean a medida que avanzas.',
    color: '#0891B2',
    bg: 'rgba(8,145,178,0.08)',
  },
]

function FeatureCard({ feature, delay }: { feature: typeof features[0]; delay: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-30px' }}
      transition={{ duration: 0.4, delay }}
      whileHover={{ y: -4, boxShadow: '0 12px 40px rgba(0,0,0,0.08)' }}
      style={{
        background: 'white',
        borderRadius: 24,
        border: '1px solid rgba(0,0,0,0.06)',
        padding: '2.25rem 2rem',
        position: 'relative',
        overflow: 'hidden',
        boxShadow: '0 2px 12px rgba(0,0,0,0.03)',
        transition: 'transform 0.3s ease-out, box-shadow 0.3s ease-out',
        cursor: 'default',
      }}
    >
      <div style={{
        width: 56,
        height: 56,
        borderRadius: '50%',
        background: feature.bg,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: '1.25rem',
      }}>
        <feature.icon size={24} strokeWidth={1.5} color={feature.color} />
      </div>
      <h3 style={{
        fontFamily: 'var(--font-heading)',
        fontSize: 'clamp(1rem, 1.3vw, 1.125rem)',
        fontWeight: 700,
        color: 'var(--color-text-primary)',
        marginBottom: '0.625rem',
        letterSpacing: '-0.01em',
      }}>
        {feature.title}
      </h3>
      <p style={{
        fontFamily: 'var(--font-body)',
        fontSize: '0.9375rem',
        lineHeight: 1.7,
        color: 'var(--color-text-secondary)',
        margin: 0,
      }}>
        {feature.description}
      </p>
    </motion.div>
  )
}

export default function ValueProp() {
  return (
    <section id="plataforma" style={{ padding: '6rem 0', background: 'white' }}>
      <div style={{ maxWidth: 1200, margin: '0 auto', padding: '0 2rem' }}>
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-50px' }}
          transition={{ duration: 0.5 }}
          style={{ textAlign: 'center', maxWidth: 720, margin: '0 auto 4rem' }}
        >
          <span
            style={{
              display: 'inline-block',
              padding: '0.35rem 1rem',
              borderRadius: 9999,
              background: 'rgba(5,150,105,0.06)',
              border: '1px solid rgba(5,150,105,0.12)',
              fontFamily: 'var(--font-body)',
              fontSize: '0.8125rem',
              fontWeight: 600,
              color: '#059669',
              letterSpacing: '0.03em',
              textTransform: 'uppercase' as const,
              marginBottom: '1.25rem',
            }}
          >
            La plataforma
          </span>
          <h2
            style={{
              fontFamily: 'var(--font-heading)',
              fontSize: 'clamp(2rem, 4vw, 3rem)',
              fontWeight: 800,
              lineHeight: 1.1,
              letterSpacing: '-0.03em',
              color: 'var(--color-text-primary)',
              marginBottom: '1.25rem',
            }}
          >
            Un ecosistema completo para desarrollar tu startup
          </h2>
          <p
            style={{
              fontFamily: 'var(--font-body)',
              fontSize: 'clamp(1rem, 1.5vw, 1.125rem)',
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
            gap: '1.75rem',
          }}
        >
          {features.map((feature, i) => (
            <FeatureCard key={feature.title} feature={feature} delay={i * 0.08} />
          ))}
        </div>
      </div>

      <style>{`
        @media (max-width: 900px) {
          .valueprop-features-grid { grid-template-columns: repeat(2, 1fr) !important; }
        }
        @media (max-width: 600px) {
          .valueprop-features-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </section>
  )
}
