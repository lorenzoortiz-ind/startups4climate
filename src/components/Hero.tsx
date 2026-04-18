'use client'

import { motion } from 'framer-motion'
import { ArrowRight, Sparkles } from 'lucide-react'
import { useAuth } from '@/context/AuthContext'
import { useRouter } from 'next/navigation'

export default function Hero() {
  const { user, openAuthModal } = useAuth()
  const router = useRouter()

  const reveal = {
    initial: { opacity: 0, y: 30 },
    animate: { opacity: 1, y: 0 },
  }

  const stagger = {
    initial: {},
    animate: { transition: { staggerChildren: 0.12, delayChildren: 0.05 } },
  }

  return (
    <section
      className="hero-stage"
      style={{
        position: 'relative',
        minHeight: '100vh',
        background: 'var(--color-bg-primary)',
        paddingTop: 'clamp(7rem, 14vh, 10rem)',
        paddingBottom: 'clamp(4rem, 8vh, 7rem)',
        overflow: 'hidden',
      }}
    >
      {/* Orbs firma — ember (cobre) abajo-izq, electric (azul) abajo-der */}
      <div
        className="orb orb-ember orb-lg"
        style={{ bottom: '-380px', left: '-300px' }}
        aria-hidden
      />
      <div
        className="orb orb-electric orb-lg"
        style={{ bottom: '-380px', right: '-300px' }}
        aria-hidden
      />

      {/* Container centrado */}
      <div
        style={{
          maxWidth: 1280,
          marginLeft: 'auto',
          marginRight: 'auto',
          paddingLeft: 'clamp(1.25rem, 4vw, 3rem)',
          paddingRight: 'clamp(1.25rem, 4vw, 3rem)',
          position: 'relative',
          zIndex: 1,
        }}
      >
        <motion.div
          variants={stagger}
          initial="initial"
          animate="animate"
          style={{
            maxWidth: 880,
            textAlign: 'center',
            marginLeft: 'auto',
            marginRight: 'auto',
          }}
        >
          {/* Pill ember */}
          <motion.div variants={reveal} style={{ marginBottom: '2rem' }}>
            <span className="pill-ember">
              <span className="dot" />
              Plataforma all-in-one para climate founders
            </span>
          </motion.div>

          {/* Hero h1 — General Sans 500, gigante, line-height 1.0 */}
          <motion.h1
            variants={reveal}
            style={{
              fontFamily: 'var(--font-heading)',
              fontSize: 'clamp(2.6rem, 7vw, 5.2rem)',
              fontWeight: 500,
              lineHeight: 1.0,
              letterSpacing: '-0.03em',
              color: 'var(--color-ink)',
              margin: '0 0 1.5rem 0',
            }}
          >
            La infraestructura que tu{' '}
            <span className="text-ember">startup climática</span>{' '}
            merece para escalar
          </motion.h1>

          {/* Subtitle */}
          <motion.p
            variants={reveal}
            style={{
              fontFamily: 'var(--font-body)',
              fontSize: 'clamp(1rem, 1.4vw, 1.2rem)',
              fontWeight: 400,
              lineHeight: 1.55,
              color: 'var(--color-text-secondary)',
              maxWidth: 640,
              margin: '0 auto 2.5rem',
              letterSpacing: '-0.005em',
            }}
          >
            Herramientas interactivas, mentor AI personalizado, oportunidades y métricas en
            tiempo real. Todo lo que necesitas para construir tu startup de impacto.
          </motion.p>

          {/* CTAs centrados */}
          <motion.div
            variants={reveal}
            style={{
              display: 'flex',
              gap: '0.75rem',
              alignItems: 'center',
              justifyContent: 'center',
              flexWrap: 'wrap',
              marginBottom: '4rem',
            }}
          >
            <button
              onClick={() => user ? router.push('/tools') : openAuthModal('register')}
              className="btn-ember"
            >
              {user ? 'Ir a mi plataforma' : 'Empezar gratis'}
              <ArrowRight size={18} />
            </button>
            <a href="/organizaciones" className="btn-ghost">
              Para organizaciones
            </a>
          </motion.div>

          {/* Hero visual mockup — chat AI floating card (estilo FusionAI) */}
          <motion.div
            variants={reveal}
            style={{
              position: 'relative',
              maxWidth: 720,
              margin: '0 auto',
            }}
          >
            <div
              className="glass-card"
              style={{
                padding: '1rem 1.25rem',
                borderRadius: 16,
                background: 'rgba(14, 14, 14, 0.85)',
                border: '1px solid rgba(218, 78, 36, 0.50)',
                boxShadow:
                  'inset 0 0 12px rgba(217,119,87,0.45), inset 0 0 24px rgba(217,119,87,0.20), 0 30px 80px -20px rgba(218,78,36,0.35)',
                backdropFilter: 'blur(20px)',
                WebkitBackdropFilter: 'blur(20px)',
              }}
            >
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.75rem',
                  paddingBottom: '0.875rem',
                  borderBottom: '1px solid var(--color-border)',
                  marginBottom: '0.875rem',
                }}
              >
                <div
                  style={{
                    width: 28,
                    height: 28,
                    borderRadius: '50%',
                    background: 'linear-gradient(135deg, #DA4E24, #FF8918)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0,
                  }}
                >
                  <Sparkles size={14} color="#fff" strokeWidth={2.4} />
                </div>
                <span
                  style={{
                    fontFamily: 'var(--font-body)',
                    fontSize: '0.78rem',
                    color: 'var(--color-text-secondary)',
                    fontWeight: 500,
                    flex: 1,
                    textAlign: 'left',
                  }}
                >
                  Mentor AI · Gemini 2.5
                </span>
                <span
                  style={{
                    width: 8,
                    height: 8,
                    borderRadius: '50%',
                    background: '#10B981',
                    boxShadow: '0 0 8px #10B981',
                  }}
                />
              </div>
              <p
                style={{
                  fontFamily: 'var(--font-body)',
                  fontSize: '0.95rem',
                  color: 'var(--color-text-primary)',
                  textAlign: 'left',
                  margin: 0,
                  lineHeight: 1.5,
                }}
              >
                Diseña mi modelo de revenue para vender créditos de carbono a empresas
                en Perú con margen 40%
              </p>
              <div
                style={{
                  display: 'flex',
                  gap: '0.5rem',
                  marginTop: '0.875rem',
                  flexWrap: 'wrap',
                }}
              >
                {['Unit Economics', 'Pitch Deck', 'Lean Canvas'].map((chip) => (
                  <span
                    key={chip}
                    style={{
                      padding: '0.3rem 0.75rem',
                      borderRadius: 999,
                      background: 'rgba(255,255,255,0.04)',
                      border: '1px solid var(--color-border-strong)',
                      fontFamily: 'var(--font-body)',
                      fontSize: '0.72rem',
                      color: 'var(--color-text-secondary)',
                      fontWeight: 500,
                    }}
                  >
                    {chip}
                  </span>
                ))}
              </div>
            </div>
          </motion.div>

          {/* Stats discretas debajo del mockup */}
          <motion.div
            variants={reveal}
            style={{
              display: 'flex',
              justifyContent: 'center',
              gap: 'clamp(2rem, 5vw, 4rem)',
              marginTop: '3.5rem',
              flexWrap: 'wrap',
            }}
          >
            {[
              { v: '+30', l: 'Herramientas' },
              { v: 'AI', l: 'Personalizado' },
              { v: '100%', l: 'Gratis para founders' },
            ].map((s) => (
              <div key={s.l} style={{ textAlign: 'center' }}>
                <div
                  style={{
                    fontFamily: 'var(--font-heading)',
                    fontSize: 'clamp(1.4rem, 3vw, 2rem)',
                    fontWeight: 500,
                    color: 'var(--color-ink)',
                    letterSpacing: '-0.03em',
                    lineHeight: 1,
                  }}
                >
                  {s.v}
                </div>
                <div
                  style={{
                    fontFamily: 'var(--font-body)',
                    fontSize: '0.72rem',
                    color: 'var(--color-text-muted)',
                    marginTop: '0.4rem',
                    letterSpacing: '-0.005em',
                  }}
                >
                  {s.l}
                </div>
              </div>
            ))}
          </motion.div>
        </motion.div>
      </div>
    </section>
  )
}
