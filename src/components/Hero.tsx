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
          fontSize: 'clamp(1.5rem, 3vw, 2.25rem)',
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
          fontSize: '0.875rem',
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
      style={{
        position: 'relative',
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'var(--color-bg-primary)',
        paddingTop: '80px',
      }}
    >
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
          {/* Badge */}
          <motion.div variants={springReveal} style={{ marginBottom: '1.5rem' }}>
            <span
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.5rem',
                padding: '0.5rem 1.25rem',
                borderRadius: 'var(--radius-full)',
                background: 'var(--color-paper)',
                border: '1px solid var(--color-border)',
                fontFamily: 'var(--font-body)',
                fontSize: '0.875rem',
                fontWeight: 600,
                color: 'var(--color-text-secondary)',
                letterSpacing: '-0.01em',
              }}
            >
              <span style={{
                width: 8,
                height: 8,
                borderRadius: '50%',
                background: 'var(--color-accent-primary)',
                display: 'inline-block',
                flexShrink: 0,
              }} />
              Ecosistema all-in-one para startups de impacto
            </span>
          </motion.div>

          {/* Colossal Heading */}
          <motion.h1
            variants={springReveal}
            style={{
              fontFamily: 'var(--font-heading)',
              fontSize: 'var(--text-display-xl)',
              fontWeight: 700,
              lineHeight: 1.05,
              letterSpacing: '-0.04em',
              color: 'var(--color-ink)',
              margin: '0 0 2rem 0',
            }}
          >
            Tu startup de impacto merece la misma infraestructura{' '}
            <span style={{ color: 'var(--color-accent-primary)' }}>que las de Silicon Valley</span>
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
            Herramientas interactivas, mentores AI por vertical, oportunidades personalizadas y radar del ecosistema. Todo en un solo lugar, diseñado para founders en Latinoamérica.
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
              className="hero-primary-btn"
            >
              {user ? 'Ir a mi plataforma' : 'Acceder gratis'} <ArrowRight size={20} />
            </button>

            <a
              href="/organizaciones"
              className="hero-secondary-link"
            >
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

      <style>{`
        .hero-primary-btn {
          display: inline-flex;
          align-items: center;
          gap: 0.75rem;
          padding: 1.25rem 2.5rem;
          border-radius: var(--radius-xl);
          background-color: var(--color-ink);
          color: var(--color-paper);
          font-family: var(--font-body);
          font-size: var(--text-body-lg);
          font-weight: 700;
          border: none;
          cursor: pointer;
          transition: background-color 0.2s ease, transform 0.2s var(--ease-spring);
        }
        .hero-primary-btn:hover {
          background-color: var(--color-accent-primary);
          transform: translateY(-2px);
        }
        .hero-secondary-link {
          display: inline-flex;
          align-items: center;
          padding: 1.25rem 1.5rem;
          color: var(--color-ink);
          font-family: var(--font-body);
          font-size: var(--text-body-lg);
          font-weight: 600;
          text-decoration: underline;
          text-underline-offset: 4px;
          transition: color 0.2s ease;
        }
        .hero-secondary-link:hover {
          color: var(--color-accent-primary);
        }
      `}</style>
    </section>
  )
}
