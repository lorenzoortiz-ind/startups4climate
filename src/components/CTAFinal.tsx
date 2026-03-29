'use client'

import { motion } from 'framer-motion'
import { ArrowRight, LayoutDashboard, Mail } from 'lucide-react'
import { useAuth } from '@/context/AuthContext'

const ease = [0.25, 0.1, 0.25, 1] as [number, number, number, number]

export default function CTAFinal() {
  const { user, openAuthModal } = useAuth()

  return (
    <section style={{
      padding: 'clamp(5rem, 10vw, 10rem) 0',
      background: '#2A222B',
      position: 'relative',
      overflow: 'hidden',
    }}>
      <div style={{ maxWidth: 740, margin: '0 auto', padding: '0 clamp(1.5rem, 4vw, 5rem)', textAlign: 'center', position: 'relative', zIndex: 1 }}>
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.6, ease }}
        >
          <h2 style={{
            fontFamily: 'var(--font-heading)',
            fontSize: 'clamp(2rem, 4.5vw, 3.25rem)',
            fontWeight: 400,
            lineHeight: 1.1,
            letterSpacing: '-0.02em',
            color: 'white',
            marginBottom: '1.5rem',
          }}>
            Tu idea puede cambiar Latinoamerica. Te damos el ecosistema para lograrlo.
          </h2>
          <p style={{
            fontFamily: 'var(--font-body)',
            fontSize: 'clamp(1rem, 1.5vw, 1.1875rem)',
            lineHeight: 1.7,
            color: 'rgba(255,255,255,0.65)',
            maxWidth: 560,
            margin: '0 auto 1.5rem',
          }}>
            La Plataforma <span style={{ color: '#FF6B4A', fontWeight: 700 }}>S4C</span> te
            da +30 herramientas gratuitas, mentores AI especializados, oportunidades y mas.
          </p>
          <p style={{
            fontFamily: 'var(--font-body)',
            fontSize: 'clamp(1rem, 1.5vw, 1.1875rem)',
            lineHeight: 1.7,
            color: 'rgba(255,255,255,0.65)',
            maxWidth: 560,
            margin: '0 auto 2.75rem',
          }}>
            Escala tu startup, desde cualquier lugar de Latinoamerica.
          </p>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem', justifyContent: 'center' }}>
            {user ? (
              <button
                onClick={() => { window.location.href = '/tools' }}
                className="cta-coral-btn"
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  padding: '14px 28px',
                  borderRadius: 8,
                  background: '#FF6B4A',
                  color: 'white',
                  fontFamily: 'var(--font-body)',
                  fontSize: '1rem',
                  fontWeight: 600,
                  border: 'none',
                  cursor: 'pointer',
                  transition: 'background-color 0.2s ease, transform 0.2s ease',
                }}
              >
                <LayoutDashboard size={20} /> Ir a mi Plataforma
              </button>
            ) : (
              <button
                onClick={() => openAuthModal()}
                className="cta-coral-btn"
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  padding: '14px 28px',
                  borderRadius: 8,
                  background: '#FF6B4A',
                  color: 'white',
                  fontFamily: 'var(--font-body)',
                  fontSize: '1rem',
                  fontWeight: 600,
                  border: 'none',
                  cursor: 'pointer',
                  transition: 'background-color 0.2s ease, transform 0.2s ease',
                }}
              >
                Acceder gratis <ArrowRight size={20} />
              </button>
            )}
            <a
              href="mailto:hello@redesignlab.org"
              className="cta-outline-btn"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.5rem',
                padding: '14px 28px',
                borderRadius: 8,
                background: 'transparent',
                color: 'rgba(255,255,255,0.8)',
                fontFamily: 'var(--font-body)',
                fontSize: '1rem',
                fontWeight: 500,
                textDecoration: 'none',
                border: '1.5px solid rgba(255,255,255,0.2)',
                transition: 'border-color 0.2s ease, color 0.2s ease',
              }}
            >
              <Mail size={18} /> Solicitar demo
            </a>
          </div>
        </motion.div>
      </div>

      <style>{`
        .cta-coral-btn:hover {
          background-color: #E85D3A !important;
          transform: scale(1.02) !important;
        }
        .cta-outline-btn:hover {
          border-color: rgba(255,255,255,0.5) !important;
          color: #FFFFFF !important;
        }
      `}</style>
    </section>
  )
}
