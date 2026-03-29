'use client'

import { motion } from 'framer-motion'
import { ArrowRight, LayoutDashboard, Mail } from 'lucide-react'
import { useAuth } from '@/context/AuthContext'

export default function CTAFinal() {
  const { user, openAuthModal } = useAuth()

  return (
    <section style={{
      padding: 'clamp(4rem, 8vw, 10rem) 0',
      background: '#2A222B',
      position: 'relative',
      overflow: 'hidden',
    }}>
      <div style={{ maxWidth: 740, margin: '0 auto', padding: '0 clamp(1.5rem, 4vw, 5rem)', textAlign: 'center', position: 'relative', zIndex: 1 }}>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-50px' }}
          transition={{ duration: 0.5, ease: 'easeOut' }}
        >
          <h2 style={{
            fontSize: 'clamp(2rem, 4.5vw, 3.25rem)',
            fontWeight: 700,
            lineHeight: 1.1,
            letterSpacing: '-0.025em',
            color: 'white',
            marginBottom: '1.5rem',
          }}>
            Tu idea puede cambiar Latinoamérica. Te damos el ecosistema para lograrlo.
          </h2>
          <p style={{
            fontSize: 'clamp(1rem, 1.5vw, 1.1875rem)',
            lineHeight: 1.7,
            color: 'rgba(255,255,255,0.65)',
            maxWidth: 560,
            margin: '0 auto 1.5rem',
          }}>
            La Plataforma <span style={{ color: '#FF6B4A', fontWeight: 700 }}>S4C</span> te
            da +30 herramientas gratuitas, mentores AI especializados, oportunidades y más.
          </p>
          <p style={{
            fontSize: 'clamp(1rem, 1.5vw, 1.1875rem)',
            lineHeight: 1.7,
            color: 'rgba(255,255,255,0.65)',
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
                  padding: '14px 28px',
                  borderRadius: 8,
                  background: '#FF6B4A',
                  color: 'white',
                  fontSize: '1rem',
                  fontWeight: 600,
                  border: 'none',
                  cursor: 'pointer',
                  transition: 'all 0.3s ease',
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
                  padding: '14px 28px',
                  borderRadius: 8,
                  background: '#FF6B4A',
                  color: 'white',
                  fontSize: '1rem',
                  fontWeight: 600,
                  border: 'none',
                  cursor: 'pointer',
                  transition: 'all 0.3s ease',
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
                padding: '14px 28px',
                borderRadius: 8,
                background: 'transparent',
                color: 'rgba(255,255,255,0.8)',
                fontSize: '1rem',
                fontWeight: 500,
                textDecoration: 'none',
                border: '1px solid rgba(255,255,255,0.2)',
                transition: 'all 0.3s ease',
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
