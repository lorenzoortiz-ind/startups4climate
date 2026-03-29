'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Building2, LayoutDashboard, Users, FileText, TrendingUp, ArrowRight, ChevronRight } from 'lucide-react'
import { useAuth } from '@/context/AuthContext'
import OrgDashboardMockup from '@/components/illustrations/OrgDashboardMockup'

const FEATURES = [
  {
    icon: LayoutDashboard,
    title: 'Panel de portafolio',
    description: 'Dashboard centralizado con métricas en tiempo real de todas las startups de tu programa.',
    accent: '#FF6B4A',
    accentBg: 'rgba(255,107,74,0.06)',
  },
  {
    icon: Users,
    title: 'Gestión de cohortes',
    description: 'Crea cohortes, asigna startups y define milestones. Sin hojas de cálculo ni cadenas de correos.',
    accent: '#0D9488',
    accentBg: 'rgba(13,148,136,0.06)',
  },
  {
    icon: FileText,
    title: 'Reportes automáticos',
    description: 'Genera reportes PDF de progreso por cohorte o por startup. Listos para compartir con stakeholders.',
    accent: '#D97706',
    accentBg: 'rgba(217,119,6,0.06)',
  },
  {
    icon: TrendingUp,
    title: 'Benchmarking regional',
    description: 'Compara el desempeño de tus startups contra promedios por vertical, país y etapa.',
    accent: '#3B82F6',
    accentBg: 'rgba(59,130,246,0.06)',
  },
]

const springReveal = {
  initial: { opacity: 0, y: 40 },
  animate: { opacity: 1, y: 0 },
  transition: { type: 'spring', damping: 20, stiffness: 100 } as const,
}

function FeatureCard({ feature, i }: { feature: typeof FEATURES[0]; i: number }) {
  const [hovered, setHovered] = useState(false)
  const IconComp = feature.icon

  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-50px' }}
      transition={{ type: 'spring', damping: 20, stiffness: 100, delay: i * 0.1 }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        background: 'var(--color-paper)',
        borderRadius: 'var(--radius-lg)',
        border: `1px solid ${hovered ? feature.accent : 'var(--color-border)'}`,
        padding: '2.5rem 2rem',
        display: 'flex',
        flexDirection: 'column',
        transition: 'transform 0.2s var(--ease-spring), box-shadow 0.2s ease, border-color 0.2s ease',
        transform: hovered ? 'translateY(-6px)' : 'translateY(0)',
        boxShadow: hovered ? 'var(--shadow-float)' : '0 1px 4px rgba(25,25,25,0.04)',
        cursor: 'default',
      }}
    >
      <div
        style={{
          width: 52,
          height: 52,
          borderRadius: 'var(--radius-md)',
          background: hovered ? feature.accentBg : 'var(--color-bg-primary)',
          border: `1px solid ${hovered ? feature.accent + '30' : 'var(--color-border)'}`,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          marginBottom: '1.5rem',
          transition: 'background 0.2s ease, border-color 0.2s ease',
        }}
      >
        <IconComp
          size={24}
          strokeWidth={1.5}
          color={hovered ? feature.accent : 'var(--color-ink)'}
          style={{ transition: 'color 0.2s ease' }}
        />
      </div>
      <h3
        style={{
          fontFamily: 'var(--font-heading)',
          fontSize: 'var(--text-heading-md)',
          fontWeight: 700,
          color: 'var(--color-ink)',
          marginBottom: '0.75rem',
          letterSpacing: '-0.03em',
          lineHeight: 1.1,
        }}
      >
        {feature.title}
      </h3>
      <p
        style={{
          fontFamily: 'var(--font-body)',
          fontSize: 'var(--text-body)',
          lineHeight: 1.6,
          color: 'var(--color-text-secondary)',
          letterSpacing: '-0.01em',
        }}
      >
        {feature.description}
      </p>
    </motion.div>
  )
}

export default function OrganizacionesPage() {
  const { openAuthModal } = useAuth()
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth <= 768)
    check()
    window.addEventListener('resize', check)
    return () => window.removeEventListener('resize', check)
  }, [])

  return (
    <div style={{ minHeight: '100vh', background: 'var(--color-bg-primary)' }}>
      {/* Hero section — similar to workbook layout */}
      <section
        style={{
          padding: 'clamp(3rem, 6vw, 6rem) var(--container-px) clamp(2rem, 4vw, 4rem)',
          maxWidth: 'var(--container-max)',
          margin: '0 auto',
        }}
      >
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 'clamp(2rem, 5vw, 5rem)',
            flexWrap: isMobile ? 'wrap' : 'nowrap',
          }}
        >
          {/* Left: editorial text */}
          <motion.div
            {...springReveal}
            style={{ flex: '1 1 340px', maxWidth: 600 }}
          >
            {/* Eyebrow */}
            <div
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.5rem',
                padding: '0.375rem 0.875rem',
                borderRadius: 'var(--radius-full)',
                background: 'rgba(255,107,74,0.08)',
                border: '1px solid rgba(255,107,74,0.15)',
                marginBottom: '1.75rem',
              }}
            >
              <Building2 size={14} color="var(--color-accent-primary)" />
              <span
                style={{
                  fontFamily: 'var(--font-body)',
                  fontSize: '0.75rem',
                  fontWeight: 700,
                  color: 'var(--color-accent-primary)',
                  letterSpacing: '0.04em',
                  textTransform: 'uppercase',
                }}
              >
                Para organizaciones
              </span>
            </div>

            <h1
              style={{
                fontFamily: 'var(--font-heading)',
                fontSize: 'var(--text-display-lg)',
                fontWeight: 700,
                color: 'var(--color-ink)',
                letterSpacing: '-0.04em',
                lineHeight: 1.05,
                marginBottom: '1.5rem',
              }}
            >
              La tecnología que tu{' '}
              <span style={{ color: 'var(--color-accent-primary)' }}>programa de innovación</span> necesita
            </h1>

            <p
              style={{
                fontFamily: 'var(--font-body)',
                fontSize: 'var(--text-body-lg)',
                color: 'var(--color-text-secondary)',
                maxWidth: 540,
                lineHeight: 1.6,
                marginBottom: '2rem',
                letterSpacing: '-0.01em',
              }}
            >
              Incubadoras, aceleradoras y gobiernos usan nuestra plataforma para gestionar cohortes,
              medir progreso y generar reportes con datos reales de sus startups.
            </p>

            {/* Stats row */}
            <div style={{ display: 'flex', gap: '2rem', flexWrap: 'wrap' }}>
              {[
                { num: '+30', label: 'herramientas' },
                { num: 'Real-time', label: 'métricas' },
                { num: 'PDF', label: 'reportes automáticos' },
              ].map((stat) => (
                <div key={stat.label}>
                  <div
                    style={{
                      fontFamily: 'var(--font-heading)',
                      fontSize: 'clamp(1.5rem, 3vw, 2.25rem)',
                      fontWeight: 700,
                      color: 'var(--color-ink)',
                      letterSpacing: '-0.05em',
                      lineHeight: 1,
                    }}
                  >
                    {stat.num}
                  </div>
                  <div
                    style={{
                      fontFamily: 'var(--font-body)',
                      fontSize: '0.875rem',
                      color: 'var(--color-text-muted)',
                      marginTop: '0.25rem',
                    }}
                  >
                    {stat.label}
                  </div>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Right: dashboard mockup */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ type: 'spring', damping: 20, stiffness: 100, delay: 0.15 }}
            style={{
              flex: '0 1 480px',
              display: 'flex',
              justifyContent: 'flex-end',
              paddingLeft: '2rem',
            }}
          >
            <OrgDashboardMockup width="100%" />
          </motion.div>
        </div>
      </section>

      {/* Feature cards — 2x2 grid */}
      <section
        style={{
          padding: '0 var(--container-px) clamp(3rem, 6vw, 5rem)',
          maxWidth: 'var(--container-max)',
          margin: '0 auto',
        }}
      >
        <motion.h2
          initial={{ opacity: 0, y: 32 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ type: 'spring', damping: 20, stiffness: 100 }}
          style={{
            fontFamily: 'var(--font-heading)',
            fontSize: 'var(--text-display-md)',
            fontWeight: 700,
            color: 'var(--color-ink)',
            letterSpacing: '-0.04em',
            lineHeight: 1.05,
            marginBottom: '2rem',
          }}
        >
          Funcionalidades
        </motion.h2>

        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))',
            gap: '1.25rem',
          }}
        >
          {FEATURES.map((feature, i) => (
            <FeatureCard key={feature.title} feature={feature} i={i} />
          ))}
        </div>
      </section>

      {/* Full-width CTA */}
      <section
        style={{
          padding: '0 var(--container-px) clamp(4rem, 8vw, 8rem)',
          maxWidth: 'var(--container-max)',
          margin: '0 auto',
        }}
      >
        <motion.div
          initial={{ opacity: 0, y: 32 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ type: 'spring', damping: 20, stiffness: 100 }}
          style={{
            background: 'var(--color-ink)',
            borderRadius: 'var(--radius-xl)',
            padding: 'clamp(3rem, 6vw, 5rem) clamp(2rem, 5vw, 4rem)',
            textAlign: 'center',
            position: 'relative',
            overflow: 'hidden',
          }}
        >
          {/* Decorative accent */}
          <div
            style={{
              position: 'absolute',
              top: -80,
              right: -80,
              width: 300,
              height: 300,
              borderRadius: '50%',
              background: 'rgba(255,107,74,0.06)',
              pointerEvents: 'none',
            }}
          />

          <span
            style={{
              display: 'inline-block',
              fontFamily: 'var(--font-body)',
              fontSize: '0.75rem',
              fontWeight: 700,
              letterSpacing: '0.1em',
              textTransform: 'uppercase',
              color: 'var(--color-accent-primary)',
              marginBottom: '1.25rem',
            }}
          >
            Contáctanos
          </span>

          <h3
            style={{
              fontFamily: 'var(--font-heading)',
              fontSize: 'var(--text-display-md)',
              fontWeight: 700,
              letterSpacing: '-0.04em',
              lineHeight: 1.05,
              marginBottom: '1.25rem',
              color: 'var(--color-paper)',
            }}
          >
            ¿Gestionas un programa de<br />incubación o aceleración?
          </h3>
          <p
            style={{
              fontFamily: 'var(--font-body)',
              fontSize: 'var(--text-body-lg)',
              lineHeight: 1.6,
              color: 'rgba(255,255,255,0.6)',
              maxWidth: 560,
              margin: '0 auto 2.5rem',
              letterSpacing: '-0.01em',
            }}
          >
            Agenda una llamada y te mostramos cómo la plataforma puede integrarse a tu operación.
          </p>
          <a
            href="https://calendly.com/redesignlab"
            target="_blank"
            rel="noopener noreferrer"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.75rem',
              padding: '1.25rem 2.5rem',
              borderRadius: 'var(--radius-full)',
              background: 'var(--color-paper)',
              color: 'var(--color-ink)',
              fontFamily: 'var(--font-body)',
              fontSize: 'var(--text-body-lg)',
              fontWeight: 700,
              border: 'none',
              cursor: 'pointer',
              textDecoration: 'none',
              letterSpacing: '-0.01em',
              transition: 'background 0.2s ease, color 0.2s ease, transform 0.2s var(--ease-spring)',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = 'var(--color-accent-primary)'
              e.currentTarget.style.color = 'var(--color-paper)'
              e.currentTarget.style.transform = 'translateY(-2px)'
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = 'var(--color-paper)'
              e.currentTarget.style.color = 'var(--color-ink)'
              e.currentTarget.style.transform = 'translateY(0)'
            }}
          >
            Agenda una llamada
            <ArrowRight size={20} strokeWidth={2.5} />
          </a>

          <div
            style={{
              marginTop: '1.5rem',
              paddingTop: '1.25rem',
              borderTop: '1px solid rgba(255,255,255,0.1)',
              display: 'inline-block',
            }}
          >
            <button
              type="button"
              onClick={() => openAuthModal('login')}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.375rem',
                background: 'none',
                border: 'none',
                fontFamily: 'var(--font-body)',
                fontSize: '0.875rem',
                color: 'rgba(255,255,255,0.5)',
                cursor: 'pointer',
                padding: 0,
              }}
            >
              ¿Ya tienes acceso?{' '}
              <span style={{ color: 'var(--color-accent-primary)', fontWeight: 700 }}>Iniciar sesión</span>
              <ChevronRight size={14} color="var(--color-accent-primary)" />
            </button>
          </div>
        </motion.div>
      </section>
    </div>
  )
}
