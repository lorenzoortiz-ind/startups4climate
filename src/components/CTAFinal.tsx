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
      background: 'linear-gradient(180deg, var(--color-bg-primary) 0%, var(--color-bg-card) 100%)',
      color: 'var(--color-text-primary)',
      position: 'relative',
      overflow: 'hidden',
      borderTop: '1px solid var(--color-border)',
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
            rgba(255,255,255,0.018) 40px,
            rgba(255,255,255,0.018) 41px
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
            color: 'var(--color-text-primary)',
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
            color: 'var(--color-text-secondary)',
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
                  padding: '1.05rem 2rem',
                  background: 'var(--color-accent-primary)',
                  color: '#fff',
                  borderRadius: 12,
                  fontFamily: 'var(--font-body)',
                  fontSize: '1rem',
                  fontWeight: 600,
                  border: 'none',
                  cursor: 'pointer',
                  boxShadow: '0 4px 16px rgba(255,107,74,0.30)',
                  transition: 'transform 0.15s var(--ease-spring), background 0.15s ease, box-shadow 0.15s ease',
                }}
                onMouseOver={(e) => {
                  e.currentTarget.style.transform = 'translateY(-1px)'
                  e.currentTarget.style.background = 'var(--color-accent-hover)'
                }}
                onMouseOut={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)'
                  e.currentTarget.style.background = 'var(--color-accent-primary)'
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
                  padding: '1.05rem 2rem',
                  background: 'var(--color-accent-primary)',
                  color: '#fff',
                  borderRadius: 12,
                  fontFamily: 'var(--font-body)',
                  fontSize: '1rem',
                  fontWeight: 600,
                  border: 'none',
                  cursor: 'pointer',
                  boxShadow: '0 4px 16px rgba(255,107,74,0.30)',
                  transition: 'transform 0.15s var(--ease-spring), background 0.15s ease, box-shadow 0.15s ease',
                }}
                onMouseOver={(e) => {
                  e.currentTarget.style.transform = 'translateY(-1px)'
                  e.currentTarget.style.background = 'var(--color-accent-hover)'
                }}
                onMouseOut={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)'
                  e.currentTarget.style.background = 'var(--color-accent-primary)'
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
                padding: '1.05rem 2rem',
                background: 'rgba(255,255,255,0.03)',
                color: 'var(--color-text-primary)',
                border: '1px solid var(--color-border-strong)',
                borderRadius: 12,
                fontFamily: 'var(--font-body)',
                fontSize: '1rem',
                fontWeight: 500,
                textDecoration: 'none',
                transition: 'border-color 0.15s ease, transform 0.15s var(--ease-spring), background 0.15s ease',
              }}
              onMouseOver={(e) => {
                e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.18)'
                e.currentTarget.style.background = 'rgba(255,255,255,0.05)'
                e.currentTarget.style.transform = 'translateY(-1px)'
              }}
              onMouseOut={(e) => {
                e.currentTarget.style.borderColor = 'var(--color-border-strong)'
                e.currentTarget.style.background = 'rgba(255,255,255,0.03)'
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
