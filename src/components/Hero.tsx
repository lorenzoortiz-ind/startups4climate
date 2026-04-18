'use client'

import { motion } from 'framer-motion'
import { ArrowRight } from 'lucide-react'
import { useAuth } from '@/context/AuthContext'
import { useRouter } from 'next/navigation'

function AnimatedCounter({ value, label }: { value: string; label: string }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
      <span
        style={{
          fontFamily: 'var(--font-heading)',
          fontSize: 'clamp(1.2rem, 3vw, 1.8rem)',
          fontWeight: 700,
          letterSpacing: '-0.04em',
          lineHeight: 1,
          color: 'var(--color-ink)',
        }}
      >
        {value}
      </span>
      <span
        style={{
          fontFamily: 'var(--font-body)',
          fontSize: '0.7rem',
          fontWeight: 500,
          color: 'var(--color-text-secondary)',
          letterSpacing: '-0.01em',
        }}
      >
        {label}
      </span>
    </div>
  )
}

export default function Hero() {
  const { user, openAuthModal } = useAuth()
  const router = useRouter()

  const springReveal = {
    initial: { opacity: 0, y: 60 },
    animate: { opacity: 1, y: 0 },
    transition: { type: 'spring', damping: 20, stiffness: 100 } as any,
  }

  const containerVars = {
    initial: {},
    animate: {
      transition: {
        staggerChildren: 0.15,
      },
    },
  }

  return (
    <section
      className="hero-stage"
      style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'var(--color-bg-primary)',
        paddingTop: '80px',
      }}
    >
      {/* Orbs decorativos firma — ember (cobre) abajo-izq, electric (azul) abajo-der */}
      <div
        className="orb orb-ember orb-lg"
        style={{ bottom: '-340px', left: '-280px' }}
        aria-hidden
      />
      <div
        className="orb orb-electric orb-lg"
        style={{ bottom: '-340px', right: '-280px' }}
        aria-hidden
      />

      <div
        style={{
          maxWidth: 'var(--container-max)',
          margin: '0 auto',
          padding: '0 var(--container-px)',
          width: '100%',
        }}
      >
        <motion.div
          variants={containerVars}
          initial="initial"
          animate="animate"
          style={{
            maxWidth: 1000,
            textAlign: 'left',
          }}
        >
          {/* Pill ember con glow inset */}
          <motion.div variants={springReveal} style={{ marginBottom: '1.75rem' }}>
            <span className="pill-ember">
              <span className="dot" />
              Plataforma all-in-one para climate founders
            </span>
          </motion.div>

          {/* Colossal Heading — General Sans 500, line-height 1.0 */}
          <motion.h1
            variants={springReveal}
            style={{
              fontFamily: 'var(--font-heading)',
              fontSize: 'var(--text-display-xl)',
              fontWeight: 500,
              lineHeight: 1.0,
              letterSpacing: '-0.025em',
              color: 'var(--color-ink)',
              margin: '0 0 2rem 0',
            }}
          >
            Tu startup de impacto merece la mejor infraestructura{' '}
            <span className="text-ember">para escalar globalmente</span>
          </motion.h1>

          {/* Subtitle */}
          <motion.p
            variants={springReveal}
            style={{
              fontFamily: 'var(--font-body)',
              fontSize: 'var(--text-heading-lg)',
              fontWeight: 400,
              lineHeight: 1.4,
              color: 'var(--color-text-secondary)',
              maxWidth: 750,
              marginBottom: '3rem',
            }}
          >
            Herramientas interactivas, mentores AI personalizados, oportunidades y más. Todo en un solo lugar, diseñado para founders en Latinoamérica.
          </motion.p>

          {/* CTAs */}
          <motion.div
            variants={springReveal}
            style={{
              display: 'flex',
              flexWrap: 'wrap',
              gap: '1rem',
              alignItems: 'center',
              marginBottom: '4rem',
            }}
          >
            <button
              onClick={() => user ? router.push('/tools') : openAuthModal('register')}
              className="btn-ember"
            >
              {user ? 'Ir a mi plataforma' : 'Acceder gratis'} <ArrowRight size={18} />
            </button>

            <a href="/organizaciones" className="btn-ghost">
              Para organizaciones
            </a>
          </motion.div>

          {/* Stats */}
          <motion.div
            variants={springReveal}
            style={{
              display: 'flex',
              flexWrap: 'wrap',
              gap: 'clamp(2rem, 5vw, 4rem)',
              paddingTop: '2rem',
              borderTop: '1px solid var(--color-border)',
            }}
          >
            <AnimatedCounter value="+30" label="Herramientas" />
            <AnimatedCounter value="AI" label="Personalizado" />
            <AnimatedCounter value="100%" label="Gratuito para founders" />
          </motion.div>
        </motion.div>
      </div>

    </section>
  )
}
