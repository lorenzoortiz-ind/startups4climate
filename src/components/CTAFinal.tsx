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
      padding: '6rem 0',
      background: 'var(--gradient-hero)',
      position: 'relative',
      overflow: 'hidden',
    }}>
      <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none' }}>
        <div
          className="animate-blob"
          style={{
            position: 'absolute',
            top: '-20%',
            left: '20%',
            width: '40vw',
            height: '40vw',
            borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(167,243,208,0.3) 0%, transparent 70%)',
            filter: 'blur(60px)',
          }}
        />
      </div>
      <div style={{ maxWidth: 700, margin: '0 auto', padding: '0 1.5rem', textAlign: 'center', position: 'relative', zIndex: 1 }}>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-50px' }}
          transition={{ duration: 0.5 }}
        >
          <h2 style={{
            fontFamily: 'var(--font-heading)',
            fontSize: 'clamp(1.75rem, 4vw, 2.75rem)',
            fontWeight: 800,
            lineHeight: 1.15,
            letterSpacing: '-0.02em',
            color: 'var(--color-text-primary)',
            marginBottom: '1rem',
          }}>
            Tu idea puede cambiar Latinoamérica. Te damos el ecosistema para lograrlo.
          </h2>
          <p style={{
            fontFamily: 'var(--font-body)',
            fontSize: '1.125rem',
            lineHeight: 1.7,
            color: 'var(--color-text-secondary)',
            maxWidth: 520,
            margin: '0 auto 2rem',
          }}>
            +30 herramientas gratuitas, mentores AI por vertical y oportunidades
            personalizadas. De la idea al negocio validado, desde cualquier lugar
            de Latinoamérica.
          </p>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.75rem', justifyContent: 'center' }}>
            {user ? (
              <button
                onClick={() => router.push('/tools')}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  padding: '1rem 2.5rem',
                  borderRadius: 9999,
                  background: '#059669',
                  color: 'white',
                  fontFamily: 'var(--font-body)',
                  fontSize: '1rem',
                  fontWeight: 600,
                  border: 'none',
                  cursor: 'pointer',
                  boxShadow: '0 4px 20px rgba(5,150,105,0.3)',
                  transition: 'all 0.2s',
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
                  padding: '1rem 2.5rem',
                  borderRadius: 9999,
                  background: '#059669',
                  color: 'white',
                  fontFamily: 'var(--font-body)',
                  fontSize: '1rem',
                  fontWeight: 600,
                  border: 'none',
                  cursor: 'pointer',
                  boxShadow: '0 4px 20px rgba(5,150,105,0.3)',
                  transition: 'all 0.2s',
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
                padding: '1rem 2rem',
                borderRadius: 9999,
                background: 'transparent',
                color: 'var(--color-text-secondary)',
                fontFamily: 'var(--font-body)',
                fontSize: '1rem',
                fontWeight: 500,
                textDecoration: 'none',
                border: '1px solid var(--color-border)',
                transition: 'all 0.2s',
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
