'use client'

import { motion } from 'framer-motion'
import { ArrowRight } from 'lucide-react'
import AnimatedCounter from './AnimatedCounter'
import { useAuth } from '@/context/AuthContext'

export default function Hero() {
  const { user, openAuthModal } = useAuth()

  const fadeUp = (delay: number) => ({
    initial: { opacity: 0, y: 30 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.6, delay, ease: [0.25, 0.1, 0.25, 1] as [number, number, number, number] },
  })

  return (
    <section
      style={{
        position: 'relative',
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        background: '#FFFFFF',
      }}
    >
      <div
        style={{
          maxWidth: 960,
          margin: '0 auto',
          padding: '160px clamp(1.5rem, 4vw, 5rem) 100px',
          width: '100%',
          textAlign: 'center',
        }}
      >
        {/* Badge */}
        <motion.div {...fadeUp(0)}>
          <span
            style={{
              display: 'inline-block',
              padding: '0.375rem 1rem',
              borderRadius: 8,
              background: '#FAF8F5',
              border: '1px solid #E8E4DF',
              fontFamily: 'var(--font-body)',
              fontSize: '12px',
              fontWeight: 600,
              color: '#93908C',
              letterSpacing: '0.12em',
              textTransform: 'uppercase',
              marginBottom: '2rem',
            }}
          >
            Ecosistema all-in-one para startups de impacto
          </span>
        </motion.div>

        {/* Heading */}
        <motion.h1
          {...fadeUp(0.1)}
          style={{
            fontFamily: 'var(--font-heading)',
            fontSize: 'clamp(2.5rem, 5.5vw, 4.5rem)',
            fontWeight: 400,
            lineHeight: 1.08,
            letterSpacing: '-0.02em',
            color: '#2A222B',
            marginBottom: '1.5rem',
            maxWidth: 800,
            marginLeft: 'auto',
            marginRight: 'auto',
          }}
        >
          Tu startup de impacto merece la misma infraestructura que las de Silicon Valley
        </motion.h1>

        {/* Subtitle */}
        <motion.p
          {...fadeUp(0.2)}
          style={{
            fontFamily: 'var(--font-body)',
            fontSize: 'clamp(1rem, 1.5vw, 1.25rem)',
            fontWeight: 400,
            lineHeight: 1.7,
            color: '#5E5A60',
            maxWidth: 580,
            marginLeft: 'auto',
            marginRight: 'auto',
            marginBottom: '2.5rem',
          }}
        >
          Herramientas interactivas, mentores AI personalizados, oportunidades
          personalizadas y mas. Todo en un solo lugar,
          disenado para founders en Latinoamerica.
        </motion.p>

        {/* CTAs */}
        <motion.div
          {...fadeUp(0.3)}
          style={{
            display: 'flex',
            flexWrap: 'wrap',
            gap: '0.875rem',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <button
            onClick={() => user ? (window.location.href = '/tools') : openAuthModal('register')}
            className="hero-cta-primary"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.5rem',
              padding: '14px 28px',
              borderRadius: 8,
              backgroundColor: '#2A222B',
              color: '#FFFFFF',
              fontFamily: 'var(--font-body)',
              fontSize: '1rem',
              fontWeight: 600,
              border: 'none',
              cursor: 'pointer',
              transition: 'transform 0.2s ease, box-shadow 0.2s ease',
            }}
          >
            {user ? 'Ir a mi plataforma' : 'Acceder gratis'} <ArrowRight size={17} />
          </button>
          <a
            href="/organizaciones"
            className="hero-cta-secondary"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.5rem',
              padding: '14px 28px',
              borderRadius: 8,
              backgroundColor: 'transparent',
              color: '#2A222B',
              fontFamily: 'var(--font-body)',
              fontSize: '1rem',
              fontWeight: 600,
              textDecoration: 'none',
              border: '1.5px solid #2A222B',
              cursor: 'pointer',
              transition: 'background-color 0.2s ease',
            }}
          >
            Para organizaciones <ArrowRight size={17} />
          </a>
        </motion.div>

        {/* Stats */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.5, ease: [0.25, 0.1, 0.25, 1] }}
          className="hero-stats"
          style={{
            display: 'flex',
            gap: '4rem',
            marginTop: '5rem',
            justifyContent: 'center',
          }}
        >
          {[
            { value: 30, prefix: '+', suffix: '', label: 'Herramientas' },
            { value: 0, prefix: '', suffix: '', label: 'AI personalizado', customDisplay: 'AI' },
            { value: 100, prefix: '', suffix: '%', label: 'Gratuito para founders' },
          ].map((stat) => (
            <div key={stat.label} style={{ textAlign: 'center' }}>
              <div
                style={{
                  fontFamily: 'var(--font-heading)',
                  fontSize: '2.25rem',
                  fontWeight: 400,
                  color: '#2A222B',
                  lineHeight: 1.2,
                }}
              >
                {stat.customDisplay ? (
                  <span>{stat.customDisplay}</span>
                ) : (
                  <AnimatedCounter value={stat.value} prefix={stat.prefix} suffix={stat.suffix} duration={1.5} />
                )}
              </div>
              <div
                style={{
                  fontFamily: 'var(--font-body)',
                  fontSize: '0.875rem',
                  color: '#93908C',
                  marginTop: '0.375rem',
                  fontWeight: 400,
                }}
              >
                {stat.label}
              </div>
            </div>
          ))}
        </motion.div>
      </div>

      <style>{`
        .hero-cta-primary:hover {
          transform: scale(1.02) !important;
          box-shadow: 0 4px 12px rgba(42,34,43,0.15) !important;
        }
        .hero-cta-secondary:hover {
          background-color: rgba(42,34,43,0.04) !important;
        }
        @media (max-width: 640px) {
          .hero-stats {
            flex-wrap: wrap !important;
            gap: 2rem !important;
          }
        }
      `}</style>
    </section>
  )
}
