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
    color: '#FF6B4A',
    bg: 'rgba(255,107,74,0.07)',
  },
  {
    icon: Bot,
    title: 'Mentores AI',
    description: 'Retroalimentación contextual sobre tu modelo de negocio, mercado y estrategia, adaptada a tu startup y vertical.',
    color: '#0D9488',
    bg: 'rgba(13,148,136,0.07)',
  },
  {
    icon: Radar,
    title: 'RADAR del ecosistema',
    description: 'Noticias, cambios regulatorios y tendencias de mercado en LATAM, todo para estar al día en tu industria.',
    color: '#2A222B',
    bg: 'rgba(42,34,43,0.06)',
  },
  {
    icon: Gift,
    title: 'Oportunidades',
    description: 'Grants, competencias y fondos que coinciden con tu perfil, etapa y vertical. Actualizados semanalmente.',
    color: '#FF6B4A',
    bg: 'rgba(255,107,74,0.07)',
  },
  {
    icon: Stamp,
    title: 'Startup Passport',
    description: 'Un perfil verificable de tu startup con métricas y nivel de madurez. Compartible con inversores y programas.',
    color: '#0D9488',
    bg: 'rgba(13,148,136,0.07)',
  },
  {
    icon: UserCircle,
    title: 'Perfil progresivo',
    description: 'Empieza con lo básico y la plataforma se adapta. Herramientas y recomendaciones se desbloquean a medida que avanzas.',
    color: '#2A222B',
    bg: 'rgba(42,34,43,0.06)',
  },
]

function FeatureCard({ feature, delay }: { feature: typeof features[0]; delay: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-30px' }}
      transition={{ duration: 0.4, delay, ease: 'easeOut' }}
      whileHover={{ y: -4, boxShadow: '0 12px 40px rgba(0,0,0,0.08)' }}
      style={{
        background: 'white',
        borderRadius: 16,
        border: '1px solid rgba(0,0,0,0.06)',
        padding: '2.25rem 2rem',
        position: 'relative',
        overflow: 'hidden',
        boxShadow: '0 2px 8px rgba(0,0,0,0.04)',
        transition: 'transform 0.3s ease, box-shadow 0.3s ease',
        cursor: 'default',
      }}
    >
      <div style={{
        width: 52,
        height: 52,
        borderRadius: 12,
        background: feature.bg,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: '1.25rem',
      }}>
        <feature.icon size={24} strokeWidth={1.5} color={feature.color} />
      </div>
      <h3 style={{
        fontSize: 'clamp(1rem, 1.3vw, 1.125rem)',
        fontWeight: 700,
        color: '#2A222B',
        marginBottom: '0.625rem',
        letterSpacing: '-0.01em',
      }}>
        {feature.title}
      </h3>
      <p style={{
        fontSize: '0.9375rem',
        lineHeight: 1.7,
        color: '#5E5A60',
        margin: 0,
      }}>
        {feature.description}
      </p>
    </motion.div>
  )
}

export default function ValueProp() {
  return (
    <section id="plataforma" style={{ padding: 'clamp(4rem, 8vw, 10rem) 0', background: 'white' }}>
      <div style={{ maxWidth: 1200, margin: '0 auto', padding: '0 clamp(1.5rem, 4vw, 5rem)' }}>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-50px' }}
          transition={{ duration: 0.5, ease: 'easeOut' }}
          style={{ textAlign: 'center', maxWidth: 720, margin: '0 auto clamp(3rem, 5vw, 5rem)' }}
        >
          <span
            style={{
              display: 'inline-block',
              fontSize: '0.8125rem',
              fontWeight: 600,
              letterSpacing: '0.1em',
              textTransform: 'uppercase' as const,
              color: '#93908C',
              marginBottom: '1.25rem',
            }}
          >
            La plataforma
          </span>
          <h2
            style={{
              fontSize: 'clamp(2rem, 4vw, 3rem)',
              fontWeight: 700,
              lineHeight: 1.1,
              letterSpacing: '-0.025em',
              color: '#2A222B',
              marginBottom: '1.25rem',
            }}
          >
            Un ecosistema completo para desarrollar tu startup
          </h2>
          <p
            style={{
              fontSize: 'clamp(1rem, 1.5vw, 1.125rem)',
              lineHeight: 1.7,
              color: '#5E5A60',
            }}
          >
            Sin costo, sin aplicaciones, sin esperas. Crea tu cuenta y accede a la Plataforma{' '}
            <span style={{ fontWeight: 700, color: '#FF6B4A' }}>S4C</span>
            {' '}para desarrollar tu startup de impacto.
          </p>
        </motion.div>

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
