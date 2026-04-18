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
    description: 'Desde la idea hasta el modelo validado. Marco conceptual, formularios guiados y outputs descargables.',
    accent: 'ember' as const,
  },
  {
    icon: Bot,
    title: 'Mentor AI',
    description: 'Retroalimentación contextual sobre tu modelo de negocio, mercado y estrategia, adaptada a tu vertical.',
    accent: 'electric' as const,
  },
  {
    icon: Radar,
    title: 'RADAR del ecosistema',
    description: 'Noticias, cambios regulatorios y tendencias de inversión en LATAM, curados para ti.',
    accent: 'ember' as const,
  },
  {
    icon: Gift,
    title: 'Oportunidades',
    description: 'Grants, competencias y fondos que coinciden con tu perfil, etapa y vertical. Actualizados semanalmente.',
    accent: 'electric' as const,
  },
  {
    icon: Stamp,
    title: 'Startup Passport',
    description: 'Perfil verificable de tu startup con métricas y madurez. Compartible con inversores y programas.',
    accent: 'ember' as const,
  },
  {
    icon: UserCircle,
    title: 'Perfil progresivo',
    description: 'Empieza con lo básico. Herramientas y recomendaciones se desbloquean a medida que avanzas.',
    accent: 'electric' as const,
  },
]

function FeatureCard({ feature, delay }: { feature: typeof features[0]; delay: number }) {
  const isEmber = feature.accent === 'ember'
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-80px' }}
      transition={{ duration: 0.5, delay }}
      className="glass-card"
      style={{
        padding: '1.75rem',
        borderRadius: 18,
        display: 'flex',
        flexDirection: 'column',
        gap: '1rem',
      }}
    >
      <div
        style={{
          width: 44,
          height: 44,
          borderRadius: 12,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: isEmber
            ? 'linear-gradient(135deg, rgba(218,78,36,0.18), rgba(255,137,24,0.10))'
            : 'linear-gradient(135deg, rgba(31,119,246,0.18), rgba(31,119,246,0.08))',
          border: isEmber
            ? '1px solid rgba(218,78,36,0.35)'
            : '1px solid rgba(31,119,246,0.35)',
          color: isEmber ? '#F0721D' : '#5C9BFF',
        }}
      >
        <feature.icon size={20} strokeWidth={2} />
      </div>
      <div>
        <h3
          style={{
            fontFamily: 'var(--font-heading)',
            fontSize: '1.125rem',
            fontWeight: 500,
            color: 'var(--color-ink)',
            marginBottom: '0.5rem',
            letterSpacing: '-0.02em',
            lineHeight: 1.2,
          }}
        >
          {feature.title}
        </h3>
        <p
          style={{
            fontFamily: 'var(--font-body)',
            fontSize: '0.92rem',
            lineHeight: 1.55,
            color: 'var(--color-text-secondary)',
            margin: 0,
          }}
        >
          {feature.description}
        </p>
      </div>
    </motion.div>
  )
}

export default function ValueProp() {
  return (
    <section
      id="plataforma"
      style={{
        position: 'relative',
        padding: 'clamp(5rem, 10vw, 8rem) 0',
        background: 'var(--color-bg-primary)',
        overflow: 'hidden',
      }}
    >
      <div
        className="orb orb-ember orb-sm"
        style={{ top: '20%', right: '-220px', opacity: 0.22 }}
        aria-hidden
      />
      <div
        style={{
          maxWidth: 1280,
          margin: '0 auto',
          padding: '0 clamp(1.25rem, 4vw, 3rem)',
          position: 'relative',
          zIndex: 1,
        }}
      >
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.6 }}
          style={{ textAlign: 'center', maxWidth: 760, margin: '0 auto 4rem' }}
        >
          <span className="pill-ember" style={{ marginBottom: '1.5rem' }}>
            <span className="dot" /> La plataforma
          </span>
          <h2
            style={{
              fontFamily: 'var(--font-heading)',
              fontSize: 'clamp(2rem, 4.5vw, 3.4rem)',
              fontWeight: 500,
              lineHeight: 1.05,
              letterSpacing: '-0.03em',
              color: 'var(--color-ink)',
              margin: '1rem 0 1.25rem',
            }}
          >
            Todo lo que tu startup{' '}
            <span className="text-ember">necesita</span>, en un solo lugar
          </h2>
          <p
            style={{
              fontFamily: 'var(--font-body)',
              fontSize: 'clamp(1rem, 1.3vw, 1.15rem)',
              lineHeight: 1.55,
              color: 'var(--color-text-secondary)',
              margin: 0,
            }}
          >
            Sin costo, sin aplicaciones, sin esperas. Crea tu cuenta y accede a la plataforma para desarrollar tu startup de impacto.
          </p>
        </motion.div>

        <div
          className="vp-grid"
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(3, 1fr)',
            gap: '1.25rem',
          }}
        >
          {features.map((feature, i) => (
            <FeatureCard key={feature.title} feature={feature} delay={i * 0.06} />
          ))}
        </div>
      </div>

      <style>{`
        @media (max-width: 900px) {
          .vp-grid { grid-template-columns: repeat(2, 1fr) !important; }
        }
        @media (max-width: 560px) {
          .vp-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </section>
  )
}
