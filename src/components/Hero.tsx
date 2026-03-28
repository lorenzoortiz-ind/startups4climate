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
        background: 'var(--gradient-hero)',
      }}
    >
      {/* Gradient mesh blobs */}
      <div style={{ position: 'absolute', inset: 0, overflow: 'hidden', pointerEvents: 'none' }}>
        <div
          className="animate-blob"
          style={{
            position: 'absolute',
            top: '-10%',
            right: '-5%',
            width: '40vw',
            height: '40vw',
            borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(254,205,211,0.4) 0%, transparent 70%)',
            filter: 'blur(60px)',
          }}
        />
        <div
          className="animate-blob animation-delay-2000"
          style={{
            position: 'absolute',
            bottom: '0%',
            left: '-5%',
            width: '35vw',
            height: '35vw',
            borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(167,243,208,0.35) 0%, transparent 70%)',
            filter: 'blur(60px)',
          }}
        />
        <div
          className="animate-blob animation-delay-4000"
          style={{
            position: 'absolute',
            top: '30%',
            left: '40%',
            width: '30vw',
            height: '30vw',
            borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(254,215,170,0.3) 0%, transparent 70%)',
            filter: 'blur(60px)',
          }}
        />
      </div>

      <div style={{ maxWidth: 1200, margin: '0 auto', padding: '7rem 1.5rem 5rem', width: '100%', position: 'relative', zIndex: 1 }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '3rem', alignItems: 'center' }} className="lg:!grid-cols-[55fr_45fr]">
          {/* Left column */}
          <div>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <span
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  padding: '0.375rem 1rem',
                  borderRadius: 9999,
                  background: 'rgba(5,150,105,0.08)',
                  border: '1px solid rgba(5,150,105,0.15)',
                  fontFamily: 'var(--font-body)',
                  fontSize: '0.75rem',
                  fontWeight: 600,
                  color: '#059669',
                  letterSpacing: '0.03em',
                  textTransform: 'uppercase',
                  marginBottom: '1.5rem',
                }}
              >
                <Zap size={14} strokeWidth={2} />
                Ecosistema all-in-one para startups de impacto
              </span>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              style={{
                fontFamily: 'var(--font-heading)',
                fontSize: 'clamp(2.25rem, 5vw, 3.5rem)',
                fontWeight: 800,
                lineHeight: 1.1,
                letterSpacing: '-0.025em',
                color: 'var(--color-text-primary)',
                marginBottom: '1.5rem',
              }}
            >
              Tu startup de impacto merece{' '}
              <span className="gradient-text">
                la misma infraestructura que las de Silicon Valley
              </span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              style={{
                fontFamily: 'var(--font-body)',
                fontSize: '1.125rem',
                lineHeight: 1.7,
                color: 'var(--color-text-secondary)',
                maxWidth: 520,
                marginBottom: '2rem',
              }}
            >
              Herramientas interactivas, mentores AI por vertical, oportunidades
              personalizadas y radar del ecosistema. Todo en un solo lugar,
              diseñado para founders en Latinoamérica.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              style={{ display: 'flex', flexWrap: 'wrap', gap: '0.75rem', alignItems: 'center' }}
            >
              <button
                onClick={() => user ? router.push('/tools') : openAuthModal('register')}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  padding: '0.875rem 2rem',
                  borderRadius: 9999,
                  backgroundColor: '#059669',
                  color: 'white',
                  fontFamily: 'var(--font-body)',
                  fontSize: '0.9375rem',
                  fontWeight: 600,
                  border: 'none',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease',
                  boxShadow: '0 4px 16px rgba(5,150,105,0.3)',
                }}
              >
                {user ? 'Ir a mi plataforma' : 'Acceder gratis'}
                <ArrowRight size={18} />
              </button>
              <a
                href="#organizaciones"
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  padding: '0.875rem 2rem',
                  borderRadius: 9999,
                  backgroundColor: 'white',
                  color: 'var(--color-text-primary)',
                  fontFamily: 'var(--font-body)',
                  fontSize: '0.9375rem',
                  fontWeight: 600,
                  textDecoration: 'none',
                  border: '1px solid var(--color-border)',
                  transition: 'all 0.2s ease',
                }}
              >
                Para organizaciones
              </a>
            </motion.div>

            {/* Mini stats */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.5 }}
              className="hero-stats"
              style={{
                display: 'flex',
                gap: '2rem',
                marginTop: '3rem',
                paddingTop: '1.5rem',
                borderTop: '1px solid var(--color-border)',
              }}
            >
              {[
                { value: 30, prefix: '+', suffix: '', label: 'Herramientas' },
                { value: 0, prefix: '', suffix: '', label: 'AI personalizado', customDisplay: 'AI' },
                { value: 100, prefix: '', suffix: '%', label: 'Gratuito para founders' },
              ].map((stat) => (
                <div key={stat.label}>
                  <div style={{ fontFamily: 'var(--font-mono)', fontSize: '1.5rem', fontWeight: 700, color: '#059669' }}>
                    {stat.customDisplay ? (
                      <span>{stat.customDisplay}</span>
                    ) : (
                      <AnimatedCounter value={stat.value} prefix={stat.prefix} suffix={stat.suffix} duration={1.5} />
                    )}
                  </div>
                  <div style={{ fontFamily: 'var(--font-body)', fontSize: '0.75rem', color: 'var(--color-text-muted)' }}>
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
            transition={{ duration: 0.8, delay: 0.3 }}
            className="hidden lg:block"
          >
            <div
              style={{
                background: 'white',
                borderRadius: 20,
                border: '1px solid var(--color-border)',
                boxShadow: 'var(--shadow-elevated)',
                padding: '1.75rem',
                position: 'relative',
                overflow: 'hidden',
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
                borderRadius: '20px 20px 0 0',
              }} />

              {/* Terminal header */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1.25rem' }}>
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
              <div style={{ textAlign: 'center', marginBottom: '1.5rem' }}>
                <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.6875rem', color: 'var(--color-text-muted)', marginBottom: '0.5rem', textTransform: 'uppercase', letterSpacing: '0.1em' }}>
                  Startup Readiness Score
                </div>
                <div style={{ fontFamily: 'var(--font-mono)', fontSize: '3rem', fontWeight: 700, color: '#059669', lineHeight: 1 }}>
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
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                {[
                  { label: 'Validación de mercado', value: 75, color: '#059669' },
                  { label: 'Propuesta de valor', value: 60, color: '#7C3AED' },
                  { label: 'Tracción comercial', value: 45, color: '#D97706' },
                  { label: 'Estructura de negocio', value: 55, color: '#0891B2' },
                ].map((dim) => (
                  <div key={dim.label}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.25rem' }}>
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
                marginTop: '1.25rem',
                padding: '0.75rem',
                borderRadius: 10,
                background: '#F0FDF4',
                border: '1px solid rgba(5,150,105,0.1)',
              }}>
                <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.625rem', color: 'var(--color-text-muted)', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '0.375rem' }}>
                  Herramientas recomendadas
                </div>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.375rem' }}>
                  {['Lean Canvas de Impacto', 'Propuesta de Valor', 'Perfil del Usuario'].map(tool => (
                    <span key={tool} style={{
                      padding: '0.2rem 0.625rem',
                      borderRadius: 6,
                      background: 'white',
                      border: '1px solid rgba(5,150,105,0.15)',
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
        @media (max-width: 640px) {
          .hero-stats {
            flex-wrap: wrap !important;
            gap: 1.25rem !important;
          }
        }
      `}</style>
    </section>
  )
}
