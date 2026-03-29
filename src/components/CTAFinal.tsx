'use client'

import { motion } from 'framer-motion'
import { ArrowRight, LayoutDashboard, Mail } from 'lucide-react'
import { useAuth } from '@/context/AuthContext'
import { useRouter } from 'next/navigation'

export default function CTAFinal() {
  const { user, openAuthModal } = useAuth()
  const router = useRouter()

  return (
    <section style={{
      padding: '7rem 0',
      background: 'linear-gradient(160deg, #064E3B 0%, #047857 40%, #065F46 100%)',
      position: 'relative',
      overflow: 'hidden',
    }}>
      {/* Decorative glows */}
      <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none' }}>
        <div
          style={{
            position: 'absolute',
            top: '-25%',
            left: '15%',
            width: '45vw',
            height: '45vw',
            borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(167,243,208,0.15) 0%, transparent 70%)',
            filter: 'blur(80px)',
          }}
        />
        <div
          style={{
            position: 'absolute',
            bottom: '-20%',
            right: '10%',
            width: '35vw',
            height: '35vw',
            borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(103,232,249,0.1) 0%, transparent 70%)',
            filter: 'blur(60px)',
          }}
        />
      </div>

      <div style={{ maxWidth: 740, margin: '0 auto', padding: '0 2rem', textAlign: 'center', position: 'relative', zIndex: 1 }}>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-50px' }}
          transition={{ duration: 0.5 }}
        >
          <h2 style={{
            fontFamily: 'var(--font-heading)',
            fontSize: 'clamp(2rem, 4.5vw, 3.25rem)',
            fontWeight: 800,
            lineHeight: 1.1,
            letterSpacing: '-0.03em',
            color: 'white',
            marginBottom: '1.5rem',
          }}>
            Tu idea puede cambiar Latinoamérica. Te damos el ecosistema para lograrlo.
          </h2>
          <p style={{
            fontFamily: 'var(--font-body)',
            fontSize: 'clamp(1rem, 1.5vw, 1.1875rem)',
            lineHeight: 1.7,
            color: 'rgba(255,255,255,0.75)',
            maxWidth: 560,
            margin: '0 auto 1.5rem',
          }}>
            La Plataforma <span style={{ background: 'linear-gradient(135deg, #A7F3D0, #67E8F9)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', fontWeight: 700 }}>S4C</span> te
            da +30 herramientas gratuitas, mentores AI especializados, oportunidades y más.
          </p>
          <p style={{
            fontFamily: 'var(--font-body)',
            fontSize: 'clamp(1rem, 1.5vw, 1.1875rem)',
            lineHeight: 1.7,
            color: 'rgba(255,255,255,0.75)',
            maxWidth: 560,
            margin: '0 auto 2.75rem',
          }}>
            Escala tu startup, desde cualquier lugar de Latinoamérica.
          </p>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem', justifyContent: 'center' }}>
            {user ? (
              <button
                onClick={() => { window.location.href = '/tools' }}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  padding: '1.1rem 2.75rem',
                  borderRadius: 9999,
                  background: 'white',
                  color: '#064E3B',
                  fontFamily: 'var(--font-body)',
                  fontSize: '1.0625rem',
                  fontWeight: 700,
                  border: 'none',
                  cursor: 'pointer',
                  boxShadow: '0 6px 24px rgba(0,0,0,0.15)',
                  transition: 'all 0.3s ease-out',
                }}
              >
                <LayoutDashboard size={20} /> Ir a mi Plataforma
              </button>
            ) : (
              <button
                onClick={() => openAuthModal()}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  padding: '1.1rem 2.75rem',
                  borderRadius: 9999,
                  background: 'white',
                  color: '#064E3B',
                  fontFamily: 'var(--font-body)',
                  fontSize: '1.0625rem',
                  fontWeight: 700,
                  border: 'none',
                  cursor: 'pointer',
                  boxShadow: '0 6px 24px rgba(0,0,0,0.15)',
                  transition: 'all 0.3s ease-out',
                }}
              >
                Acceder gratis <ArrowRight size={20} />
              </button>
            )}
            <a
              href="mailto:hello@redesignlab.org"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.5rem',
                padding: '1.1rem 2.25rem',
                borderRadius: 9999,
                background: 'transparent',
                color: 'rgba(255,255,255,0.85)',
                fontFamily: 'var(--font-body)',
                fontSize: '1.0625rem',
                fontWeight: 500,
                textDecoration: 'none',
                border: '1px solid rgba(255,255,255,0.25)',
                transition: 'all 0.3s ease-out',
              }}
            >
              <Mail size={18} /> Solicitar demo
            </a>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
