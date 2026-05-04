'use client'

import { motion } from 'framer-motion'
import { ArrowRight, LayoutDashboard, Mail } from 'lucide-react'
import { useAuth } from '@/context/AuthContext'
import { useRouter } from 'next/navigation'

export default function CTAFinal() {
  const { user, openAuthModal } = useAuth()
  const router = useRouter()

  return (
    <section
      style={{
        position: 'relative',
        padding: 'clamp(5rem, 10vw, 9rem) 0',
        background: 'var(--color-bg-primary)',
        overflow: 'hidden',
      }}
    >
      <div
        className="orb orb-ember orb-lg"
        style={{ top: '-380px', left: '-260px' }}
        aria-hidden
      />
      <div
        className="orb orb-electric orb-lg"
        style={{ bottom: '-380px', right: '-260px' }}
        aria-hidden
      />

      <div
        style={{
          maxWidth: 1100,
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
          className="glass-card"
          style={{
            padding: 'clamp(2.5rem, 6vw, 5rem) clamp(1.5rem, 5vw, 4rem)',
            borderRadius: 28,
            textAlign: 'center',
            border: '1px solid rgba(255, 255, 255, 0.08)',
            background: 'rgba(14, 14, 14, 0.85)',
            boxShadow: '0 24px 48px -12px rgba(0,0,0,0.5)',
          }}
        >
          <span className="pill-ember" style={{ marginBottom: '1.75rem' }}>
            <span className="dot" /> Empieza gratis
          </span>

          <h2
            style={{
              fontFamily: 'var(--font-heading)',
              fontSize: 'clamp(2rem, 5vw, 3.6rem)',
              fontWeight: 500,
              lineHeight: 1.05,
              letterSpacing: '-0.03em',
              margin: '0 auto 1.5rem',
              color: 'var(--color-ink)',
              maxWidth: 760,
            }}
          >
            Tu idea puede cambiar Latinoamérica.{' '}
            <span className="text-ember">
              Te damos el ecosistema para lograrlo.
            </span>
          </h2>

          <p
            style={{
              fontFamily: 'var(--font-body)',
              fontSize: 'clamp(1rem, 1.3vw, 1.15rem)',
              lineHeight: 1.55,
              color: 'var(--color-text-secondary)',
              maxWidth: 580,
              margin: '0 auto 2.5rem',
            }}
          >
            +30 herramientas gratuitas, mentor AI, oportunidades y métricas en tiempo real. Escala tu startup desde cualquier lugar de Latinoamérica.
          </p>

          <div
            style={{
              display: 'flex',
              flexWrap: 'wrap',
              gap: '0.75rem',
              justifyContent: 'center',
            }}
          >
            {user ? (
              <button onClick={() => router.push('/tools')} className="btn-ember">
                <LayoutDashboard size={16} strokeWidth={2.4} />
                Ir a mi plataforma
              </button>
            ) : (
              <button onClick={() => openAuthModal()} className="btn-ember">
                Acceder gratis
                <ArrowRight size={16} strokeWidth={2.4} />
              </button>
            )}

            <a href="mailto:hello@redesignlab.org" className="btn-ghost">
              <Mail size={16} strokeWidth={2.4} />
              Solicitar demo
            </a>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
