'use client'

import { motion } from 'framer-motion'
import { ArrowRight, LayoutDashboard, Mail } from 'lucide-react'
import { useAuth } from '@/context/AuthContext'
import { useRouter } from 'next/navigation'

const springReveal = {
  initial: { opacity: 0, y: 60 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: '-100px' },
  transition: { type: 'spring', damping: 20, stiffness: 100 } as any,
}

export default function CTAFinal() {
  const { user, openAuthModal } = useAuth()
  const router = useRouter()

  return (
    <section style={{
      padding: 'clamp(6rem, 12vw, 12rem) 0',
      background: 'var(--color-ink)',
      color: 'var(--color-paper)',
      position: 'relative',
      overflow: 'hidden',
    }}>
      {/* Decorative diagonal lines background */}
      <div
        aria-hidden="true"
        style={{
          position: 'absolute',
          inset: 0,
          backgroundImage: `repeating-linear-gradient(
            -45deg,
            transparent,
            transparent 40px,
            rgba(255,255,255,0.025) 40px,
            rgba(255,255,255,0.025) 41px
          )`,
          pointerEvents: 'none',
        }}
      />

      {/* Subtle radial glow center */}
      <div
        aria-hidden="true"
        style={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: '80vw',
          height: '80vw',
          maxWidth: 900,
          maxHeight: 900,
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(255,107,74,0.06) 0%, transparent 70%)',
          pointerEvents: 'none',
        }}
      />

      <div style={{
        maxWidth: 'var(--container-max)',
        margin: '0 auto',
        padding: '0 var(--container-px)',
        textAlign: 'center',
        position: 'relative',
        zIndex: 1,
      }}>
        <motion.div {...springReveal} style={{ maxWidth: 900, margin: '0 auto' }}>

          <h2 style={{
            fontFamily: 'var(--font-heading)',
            fontSize: 'var(--text-display-lg)',
            fontWeight: 700,
            lineHeight: 1.05,
            letterSpacing: '-0.03em',
            marginBottom: '2rem',
            color: 'var(--color-paper)',
          }}>
            Tu idea puede cambiar Latinoamérica.{' '}
            <span style={{ color: 'var(--color-accent-primary)' }}>
              Te damos el ecosistema para lograrlo.
            </span>
          </h2>

          <p style={{
            fontFamily: 'var(--font-body)',
            fontSize: 'var(--text-body-lg)',
            lineHeight: 1.6,
            color: 'rgba(255, 255, 255, 0.7)',
            maxWidth: 640,
            margin: '0 auto 3rem',
          }}>
            La Plataforma S4C te da +30 herramientas gratuitas, mentores AI especializados, oportunidades y más. Escala tu startup, desde cualquier lugar de Latinoamérica.
          </p>

          <div style={{
            display: 'flex',
            flexWrap: 'wrap',
            gap: '1rem',
            justifyContent: 'center',
          }}>
            {user ? (
              <button
                onClick={() => router.push('/tools')}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.75rem',
                  padding: '1.25rem 2.5rem',
                  background: 'var(--color-paper)',
                  color: 'var(--color-ink)',
                  borderRadius: 'var(--radius-full)',
                  fontFamily: 'var(--font-body)',
                  fontSize: '1rem',
                  fontWeight: 700,
                  border: 'none',
                  cursor: 'pointer',
                  transition: 'transform 0.2s var(--ease-spring), background 0.2s ease',
                }}
                onMouseOver={(e) => {
                  e.currentTarget.style.transform = 'translateY(-2px)'
                  e.currentTarget.style.background = '#f0efea'
                }}
                onMouseOut={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)'
                  e.currentTarget.style.background = 'var(--color-paper)'
                }}
              >
                <LayoutDashboard size={20} strokeWidth={2.5} />
                Ir a mi Plataforma
              </button>
            ) : (
              <button
                onClick={() => openAuthModal()}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.75rem',
                  padding: '1.25rem 2.5rem',
                  background: 'var(--color-paper)',
                  color: 'var(--color-ink)',
                  borderRadius: 'var(--radius-full)',
                  fontFamily: 'var(--font-body)',
                  fontSize: '1rem',
                  fontWeight: 700,
                  border: 'none',
                  cursor: 'pointer',
                  transition: 'transform 0.2s var(--ease-spring), background 0.2s ease',
                }}
                onMouseOver={(e) => {
                  e.currentTarget.style.transform = 'translateY(-2px)'
                  e.currentTarget.style.background = '#f0efea'
                }}
                onMouseOut={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)'
                  e.currentTarget.style.background = 'var(--color-paper)'
                }}
              >
                Acceder gratis
                <ArrowRight size={20} strokeWidth={2.5} />
              </button>
            )}

            <a
              href="mailto:hello@redesignlab.org"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.75rem',
                padding: '1.25rem 2.5rem',
                background: 'transparent',
                color: 'var(--color-paper)',
                border: '1px solid rgba(255, 255, 255, 0.3)',
                borderRadius: 'var(--radius-full)',
                fontFamily: 'var(--font-body)',
                fontSize: '1rem',
                fontWeight: 600,
                textDecoration: 'none',
                transition: 'border-color 0.2s ease, transform 0.2s var(--ease-spring)',
              }}
              onMouseOver={(e) => {
                e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.8)'
                e.currentTarget.style.transform = 'translateY(-2px)'
              }}
              onMouseOut={(e) => {
                e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.3)'
                e.currentTarget.style.transform = 'translateY(0)'
              }}
            >
              <Mail size={18} strokeWidth={2.5} />
              Solicitar demo
            </a>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
