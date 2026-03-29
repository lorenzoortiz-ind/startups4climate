'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { LayoutDashboard, Users, FileText, TrendingUp, ArrowRight } from 'lucide-react'

const features = [
  {
    icon: LayoutDashboard,
    title: 'Panel de portafolio',
    description: 'Dashboard centralizado con métricas en tiempo real de todas las startups de tu programa.',
    accent: 'var(--color-accent-primary)',
    accentBg: 'rgba(255,107,74,0.06)',
  },
  {
    icon: Users,
    title: 'Gestión de cohortes',
    description: 'Crea cohortes, asigna startups y define milestones. Sin hojas de cálculo ni cadenas de correos.',
    accent: 'var(--color-accent-secondary)',
    accentBg: 'rgba(13,148,136,0.06)',
  },
  {
    icon: FileText,
    title: 'Reportes automáticos',
    description: 'Genera reportes PDF de progreso por cohorte o por startup. Listos para compartir con stakeholders.',
    accent: 'var(--color-accent-primary)',
    accentBg: 'rgba(255,107,74,0.06)',
  },
  {
    icon: TrendingUp,
    title: 'Benchmarking regional',
    description: 'Compara el desempeño de tus startups contra promedios por vertical, país y etapa.',
    accent: 'var(--color-accent-secondary)',
    accentBg: 'rgba(13,148,136,0.06)',
  },
]

const springReveal = {
  initial: { opacity: 0, y: 60 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: '-100px' },
  transition: { type: 'spring', damping: 20, stiffness: 100 } as any,
}

function FeatureCard({ feature, i }: { feature: typeof features[0]; i: number }) {
  const [hovered, setHovered] = useState(false)
  const IconComp = feature.icon

  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-50px' }}
      transition={{ type: 'spring', damping: 20, stiffness: 100, delay: i * 0.1 }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        background: 'var(--color-paper)',
        borderRadius: 'var(--radius-lg)',
        border: `1px solid ${hovered ? feature.accent : 'var(--color-border)'}`,
        padding: '3rem 2.5rem',
        display: 'flex',
        flexDirection: 'column',
        transition: 'transform 0.2s var(--ease-spring), box-shadow 0.2s ease, border-color 0.2s ease',
        transform: hovered ? 'translateY(-6px)' : 'translateY(0)',
        boxShadow: hovered ? 'var(--shadow-float)' : '0 1px 4px rgba(25,25,25,0.04)',
        cursor: 'default',
      }}
    >
      <div
        style={{
          width: 60,
          height: 60,
          borderRadius: 'var(--radius-md)',
          background: hovered ? feature.accentBg : 'var(--color-bg-primary)',
          border: `1px solid ${hovered ? feature.accent + '30' : 'var(--color-border)'}`,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          marginBottom: '2rem',
          transition: 'background 0.2s ease, border-color 0.2s ease',
        }}
      >
        <IconComp
          size={28}
          strokeWidth={1.5}
          color={hovered ? feature.accent : 'var(--color-ink)'}
          style={{ transition: 'color 0.2s ease' }}
        />
      </div>
      <h3
        style={{
          fontFamily: 'var(--font-heading)',
          fontSize: 'var(--text-heading-md)',
          fontWeight: 700,
          color: 'var(--color-ink)',
          marginBottom: '1rem',
          letterSpacing: '-0.03em',
          lineHeight: 1.1,
        }}
      >
        {feature.title}
      </h3>
      <p
        style={{
          fontFamily: 'var(--font-body)',
          fontSize: 'var(--text-body-lg)',
          lineHeight: 1.6,
          color: 'var(--color-text-secondary)',
          letterSpacing: '-0.01em',
        }}
      >
        {feature.description}
      </p>
    </motion.div>
  )
}

export default function ForOrganizations() {
  return (
    <section
      id="organizaciones"
      style={{
        padding: 'var(--section-py) 0',
        background: 'var(--color-bg-primary)',
        position: 'relative',
      }}
    >
      <div style={{ maxWidth: 'var(--container-max)', margin: '0 auto', padding: '0 var(--container-px)' }}>

        {/* Section header */}
        <motion.div {...springReveal} style={{ maxWidth: 880, margin: '0 auto 5rem' }}>
          <span
            style={{
              display: 'inline-block',
              fontFamily: 'var(--font-body)',
              fontSize: '0.75rem',
              fontWeight: 700,
              letterSpacing: '0.1em',
              textTransform: 'uppercase',
              color: 'var(--color-accent-primary)',
              marginBottom: '1.5rem',
            }}
          >
            Para organizaciones
          </span>
          <h2
            style={{
              fontFamily: 'var(--font-heading)',
              fontSize: 'var(--text-display-md)',
              fontWeight: 700,
              lineHeight: 1.05,
              letterSpacing: '-0.04em',
              color: 'var(--color-ink)',
              marginBottom: '1.5rem',
            }}
          >
            La tecnología que tu programa<br />de innovación necesita
          </h2>
          <p
            style={{
              fontFamily: 'var(--font-body)',
              fontSize: 'var(--text-body-lg)',
              lineHeight: 1.6,
              color: 'var(--color-text-secondary)',
              maxWidth: 640,
              letterSpacing: '-0.01em',
            }}
          >
            Incubadoras, aceleradoras y gobiernos usan nuestra plataforma para gestionar cohortes,
            medir progreso y generar reportes con datos reales de sus startups.
          </p>
        </motion.div>

        {/* Feature cards: 2x2 grid */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))',
            gap: '1.5rem',
            marginBottom: '5rem',
          }}
        >
          {features.map((feature, i) => (
            <FeatureCard key={feature.title} feature={feature} i={i} />
          ))}
        </div>

        {/* Dark CTA block */}
        <motion.div
          {...springReveal}
          style={{
            background: 'var(--color-ink)',
            borderRadius: 'var(--radius-xl)',
            padding: 'clamp(3rem, 6vw, 5rem) clamp(2rem, 5vw, 4rem)',
            textAlign: 'center',
            maxWidth: 920,
            margin: '0 auto',
            color: 'var(--color-paper)',
            position: 'relative',
            overflow: 'hidden',
          }}
        >
          {/* Decorative accent */}
          <div
            style={{
              position: 'absolute',
              top: -80,
              right: -80,
              width: 300,
              height: 300,
              borderRadius: '50%',
              background: 'rgba(255,107,74,0.06)',
              pointerEvents: 'none',
            }}
          />

          <span
            style={{
              display: 'inline-block',
              fontFamily: 'var(--font-body)',
              fontSize: '0.75rem',
              fontWeight: 700,
              letterSpacing: '0.1em',
              textTransform: 'uppercase',
              color: 'var(--color-accent-primary)',
              marginBottom: '1.25rem',
            }}
          >
            Agenda una llamada
          </span>

          <h3
            style={{
              fontFamily: 'var(--font-heading)',
              fontSize: 'var(--text-display-md)',
              fontWeight: 700,
              letterSpacing: '-0.04em',
              lineHeight: 1.05,
              marginBottom: '1.25rem',
              color: 'var(--color-paper)',
            }}
          >
            ¿Gestionas un programa de<br />incubación o aceleración?
          </h3>
          <p
            style={{
              fontFamily: 'var(--font-body)',
              fontSize: 'var(--text-body-lg)',
              lineHeight: 1.6,
              color: 'rgba(255,255,255,0.6)',
              maxWidth: 560,
              margin: '0 auto 2.5rem',
              letterSpacing: '-0.01em',
            }}
          >
            Agenda una llamada y te mostramos cómo la plataforma puede integrarse a tu operación.
          </p>
          <a
            href="https://calendly.com/redesignlab"
            target="_blank"
            rel="noopener noreferrer"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.75rem',
              padding: '1.25rem 2.5rem',
              borderRadius: 'var(--radius-full)',
              background: 'var(--color-paper)',
              color: 'var(--color-ink)',
              fontFamily: 'var(--font-body)',
              fontSize: 'var(--text-body-lg)',
              fontWeight: 700,
              border: 'none',
              cursor: 'pointer',
              transition: 'background 0.2s ease, color 0.2s ease, transform 0.2s var(--ease-spring)',
              textDecoration: 'none',
              letterSpacing: '-0.01em',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = 'var(--color-accent-primary)'
              e.currentTarget.style.color = 'var(--color-paper)'
              e.currentTarget.style.transform = 'translateY(-2px)'
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = 'var(--color-paper)'
              e.currentTarget.style.color = 'var(--color-ink)'
              e.currentTarget.style.transform = 'translateY(0)'
            }}
          >
            Agenda una llamada
            <ArrowRight size={20} strokeWidth={2.5} />
          </a>
        </motion.div>
      </div>
    </section>
  )
}
