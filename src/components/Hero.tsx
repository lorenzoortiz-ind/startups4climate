'use client'

import { motion, useReducedMotion } from 'framer-motion'
import { ArrowRight, Zap } from 'lucide-react'
import AnimatedCounter from './AnimatedCounter'
import { useAuth } from '@/context/AuthContext'
import { useRouter } from 'next/navigation'

export default function Hero() {
  const { user, openAuthModal } = useAuth()
  const router = useRouter()
  const prefersReducedMotion = useReducedMotion()
  return (
    <section
      style={{
        position: 'relative',
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        overflow: 'hidden',
        background: 'linear-gradient(180deg, #FAFDFB 0%, #F0FDF4 40%, #FAFAFA 100%)',
      }}
    >
      {/* Subtle background texture — soft radial gradients */}
      <div style={{ position: 'absolute', inset: 0, overflow: 'hidden', pointerEvents: 'none' }}>
        <div
          style={{
            position: 'absolute',
            top: '-20%',
            right: '-10%',
            width: '60vw',
            height: '60vw',
            borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(5,150,105,0.04) 0%, transparent 70%)',
            filter: 'blur(80px)',
          }}
        />
        <div
          style={{
            position: 'absolute',
            bottom: '-10%',
            left: '-10%',
            width: '50vw',
            height: '50vw',
            borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(167,243,208,0.15) 0%, transparent 70%)',
            filter: 'blur(80px)',
          }}
        />
      </div>

      <div style={{ maxWidth: 1200, margin: '0 auto', padding: '8rem 1.5rem 6rem', width: '100%', position: 'relative', zIndex: 1 }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '4rem', alignItems: 'center' }} className="lg:!grid-cols-[55fr_45fr]">
          {/* Left column */}
          <div>
            <motion.div
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, ease: [0.4, 0, 0.2, 1] }}
            >
              <span
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  padding: '0.4rem 1rem',
                  borderRadius: 9999,
                  background: 'rgba(5,150,105,0.06)',
                  border: '1px solid rgba(5,150,105,0.12)',
                  fontFamily: 'var(--font-body)',
                  fontSize: '0.8125rem',
                  fontWeight: 600,
                  color: '#059669',
                  letterSpacing: '0.02em',
                  textTransform: 'uppercase',
                  marginBottom: '2rem',
                }}
              >
                <Zap size={14} strokeWidth={2} />
                Ecosistema all-in-one para startups de impacto
              </span>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.1, ease: [0.4, 0, 0.2, 1] }}
              style={{
                fontFamily: 'var(--font-heading)',
                fontSize: 'clamp(2.5rem, 6vw, 4rem)',
                fontWeight: 800,
                lineHeight: 1.08,
                letterSpacing: '-0.03em',
                color: 'var(--color-text-primary)',
                marginBottom: '1.75rem',
              }}
            >
              Tu startup de impacto merece{' '}
              <span className="gradient-text">
                la misma infraestructura que las de Silicon Valley
              </span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.2, ease: [0.4, 0, 0.2, 1] }}
              style={{
                fontFamily: 'var(--font-body)',
                fontSize: '1.125rem',
                lineHeight: 1.75,
                color: 'var(--color-text-secondary)',
                maxWidth: 600,
                marginBottom: '2.5rem',
              }}
            >
              Herramientas interactivas, mentores AI personalizados, oportunidades
              personalizadas y más. Todo en un solo lugar,
              diseñado para founders en Latinoamérica.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.3, ease: [0.4, 0, 0.2, 1] }}
              style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem', alignItems: 'center' }}
            >
              <button
                onClick={() => user ? (window.location.href = '/tools') : openAuthModal('register')}
                className="hero-cta-primary"
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  padding: '1rem 2.5rem',
                  borderRadius: 9999,
                  backgroundColor: '#059669',
                  color: 'white',
                  fontFamily: 'var(--font-body)',
                  fontSize: '1rem',
                  fontWeight: 600,
                  border: 'none',
                  cursor: 'pointer',
                  transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                  boxShadow: '0 4px 20px rgba(5,150,105,0.3), 0 1px 3px rgba(0,0,0,0.08)',
                }}
              >
                {user ? 'Ir a mi plataforma' : 'Acceder gratis'}
                <ArrowRight size={18} />
              </button>
              <a
                href="/organizaciones"
                className="hero-cta-secondary"
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  padding: '1rem 2.5rem',
                  borderRadius: 9999,
                  backgroundColor: 'transparent',
                  color: 'var(--color-text-primary)',
                  fontFamily: 'var(--font-body)',
                  fontSize: '1rem',
                  fontWeight: 600,
                  textDecoration: 'none',
                  border: '2px solid rgba(0,0,0,0.12)',
                  transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                }}
              >
                Para organizaciones
              </a>
            </motion.div>

            {/* Stats section */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.6 }}
              className="hero-stats"
              style={{
                display: 'flex',
                gap: '3rem',
                marginTop: '4rem',
                paddingTop: '2rem',
                borderTop: '1px solid rgba(0,0,0,0.06)',
              }}
            >
              {[
                { value: 30, prefix: '+', suffix: '', label: 'Herramientas' },
                { value: 0, prefix: '', suffix: '', label: 'AI personalizado', customDisplay: 'AI' },
                { value: 100, prefix: '', suffix: '%', label: 'Gratuito para founders' },
              ].map((stat) => (
                <div key={stat.label}>
                  <div style={{ fontFamily: 'var(--font-mono)', fontSize: '2rem', fontWeight: 700, color: '#059669', lineHeight: 1.2 }}>
                    {stat.customDisplay ? (
                      <span>{stat.customDisplay}</span>
                    ) : (
                      <AnimatedCounter value={stat.value} prefix={stat.prefix} suffix={stat.suffix} duration={1.5} />
                    )}
                  </div>
                  <div style={{ fontFamily: 'var(--font-body)', fontSize: '0.8125rem', color: 'var(--color-text-muted)', marginTop: '0.25rem', fontWeight: 500 }}>
                    {stat.label}
                  </div>
                </div>
              ))}
            </motion.div>
          </div>

          {/* Right column — Dashboard preview card */}
          <motion.div
            initial={{ opacity: 0, x: 40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.9, delay: 0.4, ease: [0.4, 0, 0.2, 1] }}
            className="hidden lg:block"
          >
            <div
              className="hero-card"
              style={{
                background: 'white',
                borderRadius: 24,
                border: '1px solid rgba(0,0,0,0.06)',
                boxShadow: '0 8px 40px rgba(0,0,0,0.06), 0 1px 3px rgba(0,0,0,0.04)',
                padding: '2rem',
                position: 'relative',
                overflow: 'hidden',
                transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
              }}
            >
              {/* Top gradient accent */}
              <div style={{
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                height: 4,
                background: 'linear-gradient(90deg, #7C3AED, #059669, #D97706, #0891B2)',
                borderRadius: '24px 24px 0 0',
              }} />

              {/* Terminal header */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1.5rem' }}>
                <div style={{ width: 10, height: 10, borderRadius: '50%', background: '#EF4444' }} />
                <div style={{ width: 10, height: 10, borderRadius: '50%', background: '#F59E0B' }} />
                <div style={{ width: 10, height: 10, borderRadius: '50%', background: '#10B981' }} />
                <span style={{
                  fontFamily: 'var(--font-mono)',
                  fontSize: '0.6875rem',
                  color: 'var(--color-text-muted)',
                  marginLeft: '0.5rem',
                }}>
                  startup_readiness_report.json
                </span>
              </div>

              {/* Score display */}
              <div style={{ textAlign: 'center', marginBottom: '1.75rem' }}>
                <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.6875rem', color: 'var(--color-text-muted)', marginBottom: '0.5rem', textTransform: 'uppercase', letterSpacing: '0.1em' }}>
                  Startup Readiness Score
                </div>
                <div style={{ fontFamily: 'var(--font-mono)', fontSize: '3.25rem', fontWeight: 700, color: '#059669', lineHeight: 1 }}>
                  72<span style={{ fontSize: '1.25rem', color: 'var(--color-text-muted)' }}>/100</span>
                </div>
                <div style={{
                  display: 'inline-block',
                  marginTop: '0.5rem',
                  padding: '0.25rem 0.75rem',
                  borderRadius: 9999,
                  background: 'rgba(5,150,105,0.08)',
                  fontFamily: 'var(--font-mono)',
                  fontSize: '0.6875rem',
                  fontWeight: 600,
                  color: '#059669',
                }}>
                  ETAPA 2: INCUBACIÓN
                </div>
              </div>

              {/* Dimension bars */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.875rem' }}>
                {[
                  { label: 'Validación de mercado', value: 75, color: '#059669' },
                  { label: 'Propuesta de valor', value: 60, color: '#7C3AED' },
                  { label: 'Tracción comercial', value: 45, color: '#D97706' },
                  { label: 'Estructura de negocio', value: 55, color: '#0891B2' },
                ].map((dim) => (
                  <div key={dim.label}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.375rem' }}>
                      <span style={{ fontFamily: 'var(--font-body)', fontSize: '0.75rem', color: 'var(--color-text-secondary)' }}>
                        {dim.label}
                      </span>
                      <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.75rem', fontWeight: 600, color: dim.color }}>
                        {dim.value}%
                      </span>
                    </div>
                    <div style={{ height: 6, borderRadius: 3, background: '#F3F4F6' }}>
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${dim.value}%` }}
                        transition={{ duration: 1.2, delay: 0.8, ease: 'easeOut' }}
                        style={{ height: '100%', borderRadius: 3, background: dim.color }}
                      />
                    </div>
                  </div>
                ))}
              </div>

              {/* Recommended tools */}
              <div style={{
                marginTop: '1.5rem',
                padding: '0.875rem',
                borderRadius: 14,
                background: '#F0FDF4',
                border: '1px solid rgba(5,150,105,0.08)',
              }}>
                <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.625rem', color: 'var(--color-text-muted)', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '0.5rem' }}>
                  Herramientas recomendadas
                </div>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.375rem' }}>
                  {['Lean Canvas de Impacto', 'Propuesta de Valor', 'Perfil del Usuario'].map(tool => (
                    <span key={tool} style={{
                      padding: '0.25rem 0.625rem',
                      borderRadius: 8,
                      background: 'white',
                      border: '1px solid rgba(5,150,105,0.12)',
                      fontFamily: 'var(--font-body)',
                      fontSize: '0.6875rem',
                      color: '#059669',
                      fontWeight: 500,
                    }}>
                      {tool}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
      <style>{`
        .hero-cta-primary:hover {
          background-color: #047857 !important;
          transform: translateY(-2px);
          box-shadow: 0 8px 30px rgba(5,150,105,0.35), 0 2px 4px rgba(0,0,0,0.08) !important;
        }
        .hero-cta-secondary:hover {
          border-color: #059669 !important;
          color: #059669 !important;
          background-color: rgba(5,150,105,0.04) !important;
          transform: translateY(-2px);
        }
        .hero-card:hover {
          box-shadow: 0 16px 60px rgba(0,0,0,0.1), 0 2px 6px rgba(0,0,0,0.04) !important;
          transform: translateY(-4px);
        }
        @media (max-width: 640px) {
          .hero-stats {
            flex-wrap: wrap !important;
            gap: 1.5rem !important;
          }
        }
      `}</style>
    </section>
  )
}
