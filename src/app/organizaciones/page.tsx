'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import {
  Building2,
  LayoutDashboard,
  Users,
  ArrowRight,
  ChevronRight,
  Mail,
  MessageCircle,
  Brain,
  ClipboardCheck,
  Download,
  Wrench,
  Check,
  MapPin,
} from 'lucide-react'
import { useAuth } from '@/context/AuthContext'
import OrgDashboardMockup from '@/components/illustrations/OrgDashboardMockup'

/* ------------------------------------------------------------------ */
/*  DATA                                                               */
/* ------------------------------------------------------------------ */

const FEATURES = [
  {
    icon: Users,
    title: 'Gestión de cohortes',
    description: 'Crea cohortes, invita founders por email y organiza tus programas sin hojas de cálculo.',
    accent: '#5C9BFF',
    accentBg: 'rgba(31,119,246,0.10)',
  },
  {
    icon: Mail,
    title: 'Invitación por email',
    description: 'Envía invitaciones directas a founders. Se registran y quedan vinculados a tu cohorte automáticamente.',
    accent: '#5C9BFF',
    accentBg: 'rgba(31,119,246,0.10)',
  },
  {
    icon: LayoutDashboard,
    title: 'Dashboard en tiempo real',
    description: 'Visualiza el progreso de cada startup y de la cohorte completa con métricas actualizadas al instante.',
    accent: '#F0721D',
    accentBg: 'rgba(218,78,36,0.10)',
  },
  {
    icon: Download,
    title: 'Reportes Excel descargables',
    description: 'Genera reportes detallados en Excel listos para compartir con stakeholders y equipos directivos.',
    accent: '#F0721D',
    accentBg: 'rgba(218,78,36,0.10)',
  },
  {
    icon: Wrench,
    title: '+30 herramientas interactivas',
    description: 'Tus founders acceden a herramientas de estrategia, modelo de negocio, finanzas y más, todo en un solo lugar.',
    accent: '#8B5CF6',
    accentBg: 'rgba(139,92,246,0.06)',
  },
  {
    icon: Brain,
    title: 'Mentor AI personalizado',
    description: 'Cada founder recibe retroalimentación inteligente adaptada a su vertical, etapa y contexto.',
    accent: '#EC4899',
    accentBg: 'rgba(236,72,153,0.06)',
  },
  {
    icon: ClipboardCheck,
    title: 'Diagnóstico de startup readiness',
    description: 'Evalúa el nivel de preparación de cada startup con un diagnóstico integral y accionable.',
    accent: '#10B981',
    accentBg: 'rgba(16,185,129,0.06)',
  },
]

const PLANS = [
  {
    name: 'Regional',
    price: 'Gratis',
    priceSub: null,
    description: 'Para incubadoras y aceleradoras regionales (fuera de Lima) o en zonas con poblaciones vulnerables',
    accent: '#5C9BFF',
    accentBg: 'rgba(31,119,246,0.10)',
    features: [
      'Hasta 20 startups por programa',
      'Acceso a todas las herramientas',
      'Dashboard de seguimiento',
      'Reportes básicos',
    ],
    cta: 'Aplica gratis',
    ctaLink: `https://wa.me/51989338401?text=${encodeURIComponent('Hola, me interesa el plan Regional gratuito de S4C para mi incubadora.')}`,
    highlighted: false,
    badge: null,
    ideal: 'Ideal para programas regionales de innovación',
  },
  {
    name: 'Profesional',
    price: '$300',
    priceSub: 'USD / año',
    description: 'Para incubadoras y aceleradoras en Lima',
    accent: '#F0721D',
    accentBg: 'rgba(218,78,36,0.10)',
    features: [
      'Hasta 30 startups por programa',
      'Todo lo del plan Regional',
      'Reportes avanzados en Excel',
      'Benchmarking de cohortes',
      'Soporte prioritario por WhatsApp',
    ],
    cta: 'Comenzar ahora',
    ctaLink: `https://wa.me/51989338401?text=${encodeURIComponent('Hola, me interesa el plan Profesional de S4C.')}`,
    highlighted: true,
    badge: 'Mas popular',
    ideal: null,
  },
]


/* ------------------------------------------------------------------ */
/*  ANIMATION HELPERS                                                  */
/* ------------------------------------------------------------------ */

const springReveal = {
  initial: { opacity: 0, y: 40 },
  animate: { opacity: 1, y: 0 },
  transition: { type: 'spring', damping: 20, stiffness: 100 } as const,
}

/* ------------------------------------------------------------------ */
/*  SUB-COMPONENTS                                                     */
/* ------------------------------------------------------------------ */

function FeatureCard({ feature, i }: { feature: (typeof FEATURES)[0]; i: number }) {
  const [hovered, setHovered] = useState(false)
  const IconComp = feature.icon

  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-50px' }}
      transition={{ type: 'spring', damping: 20, stiffness: 100, delay: i * 0.08 }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        background: 'var(--color-paper)',
        borderRadius: 'var(--radius-lg)',
        border: `1px solid ${hovered ? feature.accent : 'var(--color-border)'}`,
        padding: '2.25rem 1.75rem',
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
          width: 48,
          height: 48,
          borderRadius: 'var(--radius-md)',
          background: hovered ? feature.accentBg : 'var(--color-bg-primary)',
          border: `1px solid ${hovered ? feature.accent + '30' : 'var(--color-border)'}`,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          marginBottom: '1.25rem',
          transition: 'background 0.2s ease, border-color 0.2s ease',
        }}
      >
        <IconComp
          size={22}
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
          marginBottom: '0.5rem',
          letterSpacing: '-0.03em',
          lineHeight: 1.15,
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

function PricingCard({ plan, i }: { plan: (typeof PLANS)[0]; i: number }) {
  const [hovered, setHovered] = useState(false)

  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-50px' }}
      transition={{ type: 'spring', damping: 20, stiffness: 100, delay: i * 0.12 }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        position: 'relative',
        background: plan.highlighted
          ? 'linear-gradient(180deg, rgba(218,78,36,0.10) 0%, rgba(218,78,36,0.02) 60%, var(--color-bg-elevated) 100%)'
          : 'var(--color-bg-card)',
        borderRadius: 'var(--radius-xl)',
        border: plan.highlighted
          ? '1.5px solid rgba(218,78,36,0.45)'
          : `1px solid ${hovered ? plan.accent : 'var(--color-border-strong)'}`,
        padding: '2.5rem 2rem',
        display: 'flex',
        flexDirection: 'column',
        transition: 'transform 0.2s var(--ease-spring), box-shadow 0.2s ease, border-color 0.2s ease',
        transform: hovered ? 'translateY(-8px)' : 'translateY(0)',
        boxShadow: hovered
          ? plan.highlighted
            ? '0 24px 48px -12px rgba(218,78,36,0.35)'
            : '0 12px 32px -8px rgba(0,0,0,0.4)'
          : plan.highlighted
            ? '0 8px 24px -8px rgba(218,78,36,0.2)'
            : '0 1px 4px rgba(0,0,0,0.2)',
        flex: '1 1 300px',
        maxWidth: 400,
      }}
    >
      {/* Badge */}
      {plan.badge && (
        <div
          style={{
            position: 'absolute',
            top: -14,
            left: '50%',
            transform: 'translateX(-50%)',
            background: 'var(--color-accent-primary)',
            color: '#fff',
            fontFamily: 'var(--font-body)',
            fontSize: '0.6rem',
            fontWeight: 700,
            letterSpacing: '0.04em',
            textTransform: 'uppercase',
            padding: '0.375rem 1rem',
            borderRadius: 'var(--radius-full)',
            whiteSpace: 'nowrap',
          }}
        >
          {plan.badge}
        </div>
      )}

      {/* Plan name */}
      <h3
        style={{
          fontFamily: 'var(--font-heading)',
          fontSize: 'var(--text-heading-md)',
          fontWeight: 700,
          color: 'var(--color-text-primary)',
          letterSpacing: '-0.03em',
          marginBottom: '0.5rem',
        }}
      >
        {plan.name}
      </h3>

      {/* Price */}
      <div style={{ marginBottom: '0.75rem' }}>
        <span
          style={{
            fontFamily: 'var(--font-heading)',
            fontSize: 'clamp(1.6rem, 4vw, 2.24rem)',
            fontWeight: 700,
            color: plan.highlighted ? 'var(--color-accent-primary)' : plan.accent,
            letterSpacing: '-0.04em',
            lineHeight: 1,
          }}
        >
          {plan.price}
        </span>
        {plan.priceSub && (
          <span
            style={{
              fontFamily: 'var(--font-body)',
              fontSize: '0.7rem',
              color: 'var(--color-text-muted)',
              marginLeft: '0.5rem',
            }}
          >
            {plan.priceSub}
          </span>
        )}
      </div>

      {/* Description */}
      <p
        style={{
          fontFamily: 'var(--font-body)',
          fontSize: '0.75rem',
          color: 'var(--color-text-secondary)',
          lineHeight: 1.5,
          marginBottom: '1.5rem',
          letterSpacing: '-0.01em',
        }}
      >
        {plan.description}
      </p>

      {/* Divider */}
      <div
        style={{
          height: 1,
          background: plan.highlighted ? 'rgba(218,78,36,0.18)' : 'var(--color-border)',
          marginBottom: '1.5rem',
        }}
      />

      {/* Features list */}
      <ul style={{ listStyle: 'none', padding: 0, margin: 0, flex: 1 }}>
        {plan.features.map((feat) => (
          <li
            key={feat}
            style={{
              display: 'flex',
              alignItems: 'flex-start',
              gap: '0.625rem',
              marginBottom: '0.75rem',
              fontFamily: 'var(--font-body)',
              fontSize: '0.75rem',
              color: 'var(--color-text-primary)',
              lineHeight: 1.4,
            }}
          >
            <Check
              size={16}
              strokeWidth={2.5}
              color={plan.highlighted ? 'var(--color-accent-primary)' : plan.accent}
              style={{ flexShrink: 0, marginTop: 2 }}
            />
            {feat}
          </li>
        ))}
      </ul>

      {/* Ideal note */}
      {plan.ideal && (
        <p
          style={{
            fontFamily: 'var(--font-body)',
            fontSize: '0.65rem',
            color: 'var(--color-text-muted)',
            fontStyle: 'italic',
            marginTop: '0.75rem',
            marginBottom: '0.5rem',
          }}
        >
          {plan.ideal}
        </p>
      )}

      {/* CTA */}
      <a
        href={plan.ctaLink}
        target="_blank"
        rel="noopener noreferrer"
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '0.5rem',
          marginTop: '1.5rem',
          padding: '1rem 1.5rem',
          borderRadius: 'var(--radius-full)',
          background: plan.highlighted ? 'var(--color-accent-primary)' : 'transparent',
          color: plan.highlighted ? '#fff' : 'var(--color-text-primary)',
          fontFamily: 'var(--font-body)',
          fontSize: 'var(--text-body)',
          fontWeight: 700,
          textDecoration: 'none',
          border: plan.highlighted ? 'none' : '1px solid var(--color-border-strong)',
          cursor: 'pointer',
          transition: 'transform 0.2s var(--ease-spring), opacity 0.2s ease',
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.transform = 'translateY(-2px)'
          e.currentTarget.style.opacity = '0.9'
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.transform = 'translateY(0)'
          e.currentTarget.style.opacity = '1'
        }}
      >
        {plan.cta}
        <ArrowRight size={18} strokeWidth={2.5} />
      </a>
    </motion.div>
  )
}

/* ------------------------------------------------------------------ */
/*  PAGE                                                               */
/* ------------------------------------------------------------------ */

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
    <div style={{ minHeight: '100dvh', background: 'var(--color-bg-primary)' }}>

      {/* ============================================================ */}
      {/*  HERO                                                        */}
      {/* ============================================================ */}
      <section
        className="hero-stage"
        style={{
          padding: 'clamp(3rem, 6vw, 6rem) var(--container-px) clamp(2rem, 4vw, 4rem)',
        }}
      >
        <div
          className="orb orb-ember orb-lg"
          style={{ bottom: '-340px', left: '-280px' }}
          aria-hidden
        />
        <div
          className="orb orb-electric orb-lg"
          style={{ bottom: '-340px', right: '-280px' }}
          aria-hidden
        />
        <div
          style={{
            maxWidth: 'var(--container-max)',
            margin: '0 auto',
          }}
        >
        <div
          style={{
            display: 'grid',
            alignItems: 'center',
            gap: 'clamp(2rem, 5vw, 5rem)',
            gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr',
          }}
        >
          {/* Left: editorial text */}
          <motion.div
            {...springReveal}
            style={{ maxWidth: 600 }}
          >
            {/* Eyebrow ember */}
            <div style={{ marginBottom: '1.75rem' }}>
              <span className="pill-ember">
                <Building2 size={12} />
                Para organizaciones
              </span>
            </div>

            <h1
              style={{
                fontFamily: 'var(--font-heading)',
                fontSize: 'var(--text-display-lg)',
                fontWeight: 500,
                color: 'var(--color-ink)',
                letterSpacing: '-0.025em',
                lineHeight: 1.0,
                marginBottom: '1.5rem',
              }}
            >
              Gestiona tu{' '}
              <span className="text-ember">programa de innovación</span>{' '}
              con datos reales
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
              Universidades, incubadoras, aceleradoras y gobiernos usan S4C para gestionar cohortes,
              medir el progreso de cada startup y generar reportes ejecutivos. Todo en una sola plataforma.
            </p>

            {/* Stats row */}
            <div style={{ display: 'flex', gap: '2rem', flexWrap: 'wrap', marginBottom: '2.5rem' }}>
              {[
                { num: '+30', label: 'herramientas' },
                { num: 'Real-time', label: 'métricas' },
                { num: 'Excel', label: 'reportes descargables' },
              ].map((stat) => (
                <div key={stat.label}>
                  <div
                    style={{
                      fontFamily: 'var(--font-heading)',
                      fontSize: 'clamp(1.2rem, 3vw, 1.8rem)',
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
                      fontSize: '0.7rem',
                      color: 'var(--color-text-muted)',
                      marginTop: '0.25rem',
                    }}
                  >
                    {stat.label}
                  </div>
                </div>
              ))}
            </div>

            {/* Hero CTA buttons */}
            <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', alignItems: 'center' }}>
              <a
                href={`https://wa.me/51989338401?text=${encodeURIComponent('Hola, me interesa S4C para mi programa de innovación.')}`}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-ember"
              >
                <MessageCircle size={18} strokeWidth={2} />
                Hablar por WhatsApp
              </a>
              <a href="#precios" className="btn-ghost">
                Ver planes <ChevronRight size={16} />
              </a>
            </div>
          </motion.div>

          {/* Right: dashboard mockup */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ type: 'spring', damping: 20, stiffness: 100, delay: 0.15 }}
            style={{
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              width: '100%',
            }}
          >
            <div style={{ width: '100%', maxWidth: 520 }}>
              <OrgDashboardMockup width="100%" />
            </div>
          </motion.div>
        </div>
        </div>
      </section>

      {/* ============================================================ */}
      {/*  FEATURES                                                     */}
      {/* ============================================================ */}
      <section
        style={{
          padding: 'clamp(3rem, 6vw, 5rem) var(--container-px)',
          maxWidth: 'var(--container-max)',
          margin: '0 auto',
        }}
      >
        <motion.div
          initial={{ opacity: 0, y: 32 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ type: 'spring', damping: 20, stiffness: 100 }}
          style={{ textAlign: 'center', marginBottom: '3rem' }}
        >
          <span
            style={{
              display: 'inline-block',
              fontFamily: 'var(--font-body)',
              fontSize: '0.6rem',
              fontWeight: 700,
              letterSpacing: '0.1em',
              textTransform: 'uppercase',
              color: 'var(--color-accent-primary)',
              marginBottom: '1rem',
            }}
          >
            Funcionalidades
          </span>
          <h2
            style={{
              fontFamily: 'var(--font-heading)',
              fontSize: 'var(--text-display-md)',
              fontWeight: 700,
              color: 'var(--color-ink)',
              letterSpacing: '-0.04em',
              lineHeight: 1.05,
              marginBottom: '1rem',
            }}
          >
            Todo lo que necesitas para gestionar tu programa
          </h2>
          <p
            style={{
              fontFamily: 'var(--font-body)',
              fontSize: 'var(--text-body-lg)',
              color: 'var(--color-text-secondary)',
              maxWidth: 600,
              margin: '0 auto',
              lineHeight: 1.6,
            }}
          >
            Desde la invitación de founders hasta los reportes finales, una plataforma integrada para todo el ciclo.
          </p>
        </motion.div>

        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
            gap: '1.25rem',
          }}
        >
          {FEATURES.map((feature, i) => (
            <FeatureCard key={feature.title} feature={feature} i={i} />
          ))}
        </div>
      </section>

      {/* ============================================================ */}
      {/*  PRICING                                                      */}
      {/* ============================================================ */}
      <section
        id="precios"
        style={{
          padding: 'clamp(4rem, 8vw, 6rem) var(--container-px)',
          maxWidth: 'var(--container-max)',
          margin: '0 auto',
        }}
      >
        <motion.div
          initial={{ opacity: 0, y: 32 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ type: 'spring', damping: 20, stiffness: 100 }}
          style={{ textAlign: 'center', marginBottom: '3.5rem' }}
        >
          <span
            style={{
              display: 'inline-block',
              fontFamily: 'var(--font-body)',
              fontSize: '0.6rem',
              fontWeight: 700,
              letterSpacing: '0.1em',
              textTransform: 'uppercase',
              color: 'var(--color-accent-primary)',
              marginBottom: '1rem',
            }}
          >
            Precios
          </span>
          <h2
            style={{
              fontFamily: 'var(--font-heading)',
              fontSize: 'var(--text-display-md)',
              fontWeight: 700,
              color: 'var(--color-ink)',
              letterSpacing: '-0.04em',
              lineHeight: 1.05,
              marginBottom: '1rem',
            }}
          >
            Planes diseñados para tu programa
          </h2>
          <p
            style={{
              fontFamily: 'var(--font-body)',
              fontSize: 'var(--text-body-lg)',
              color: 'var(--color-text-secondary)',
              maxWidth: 560,
              margin: '0 auto',
              lineHeight: 1.6,
            }}
          >
            Sin sorpresas. Elige el plan que se adapta a tu organización y escala cuando lo necesites.
          </p>
        </motion.div>

        {/* Pricing cards */}
        <div
          style={{
            display: 'flex',
            gap: '1.5rem',
            flexWrap: 'wrap',
            justifyContent: 'center',
            alignItems: 'stretch',
          }}
        >
          {PLANS.map((plan, i) => (
            <PricingCard key={plan.name} plan={plan} i={i} />
          ))}
        </div>

        {/* Regional CTA callout */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ type: 'spring', damping: 20, stiffness: 100, delay: 0.2 }}
          style={{
            marginTop: '3rem',
            background: 'rgba(31,119,246,0.10)',
            border: '1px solid rgba(31,119,246,0.15)',
            borderRadius: 'var(--radius-lg)',
            padding: '2rem 2.5rem',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: '1.5rem',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', flex: '1 1 300px' }}>
            <MapPin size={24} color="#F0721D" strokeWidth={1.5} />
            <div>
              <p
                style={{
                  fontFamily: 'var(--font-heading)',
                  fontSize: 'var(--text-heading-md)',
                  fontWeight: 700,
                  color: 'var(--color-ink)',
                  letterSpacing: '-0.03em',
                  lineHeight: 1.2,
                  marginBottom: '0.25rem',
                }}
              >
                Eres una incubadora regional?
              </p>
              <p
                style={{
                  fontFamily: 'var(--font-body)',
                  fontSize: 'var(--text-body)',
                  color: 'var(--color-text-secondary)',
                }}
              >
                Aplica al plan gratuito y potencia tu programa de innovación sin costo.
              </p>
            </div>
          </div>
          <a
            href={`https://wa.me/51989338401?text=${encodeURIComponent('Hola, soy una incubadora regional y quiero aplicar al plan gratuito de S4C.')}`}
            target="_blank"
            rel="noopener noreferrer"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.625rem',
              padding: '0.875rem 1.75rem',
              borderRadius: 'var(--radius-full)',
              background: '#DA4E24',
              color: '#fff',
              fontFamily: 'var(--font-body)',
              fontSize: 'var(--text-body)',
              fontWeight: 700,
              textDecoration: 'none',
              whiteSpace: 'nowrap',
              transition: 'transform 0.2s var(--ease-spring), opacity 0.2s ease',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'translateY(-2px)'
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'translateY(0)'
            }}
          >
            Aplica gratis
            <ArrowRight size={18} strokeWidth={2.5} />
          </a>
        </motion.div>
      </section>

      {/* ============================================================ */}
      {/*  BOTTOM CTA                                                   */}
      {/* ============================================================ */}
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
            background: 'linear-gradient(180deg, var(--color-bg-elevated) 0%, var(--color-bg-card) 100%)',
            border: '1px solid var(--color-border-strong)',
            borderRadius: 'var(--radius-xl)',
            padding: 'clamp(3rem, 6vw, 5rem) clamp(2rem, 5vw, 4rem)',
            textAlign: 'center',
            position: 'relative',
            overflow: 'hidden',
          }}
        >
          {/* Decorative accents */}
          <div
            style={{
              position: 'absolute',
              top: -80,
              right: -80,
              width: 300,
              height: 300,
              borderRadius: '50%',
              background: 'rgba(218,78,36,0.10)',
              pointerEvents: 'none',
            }}
          />
          <div
            style={{
              position: 'absolute',
              bottom: -60,
              left: -60,
              width: 200,
              height: 200,
              borderRadius: '50%',
              background: 'rgba(31,119,246,0.05)',
              pointerEvents: 'none',
            }}
          />

          <span
            style={{
              display: 'inline-block',
              fontFamily: 'var(--font-body)',
              fontSize: '0.6rem',
              fontWeight: 700,
              letterSpacing: '0.1em',
              textTransform: 'uppercase',
              color: 'var(--color-accent-primary)',
              marginBottom: '1.25rem',
            }}
          >
            Comienza hoy
          </span>

          <h3
            style={{
              fontFamily: 'var(--font-heading)',
              fontSize: 'var(--text-display-md)',
              fontWeight: 700,
              letterSpacing: '-0.04em',
              lineHeight: 1.05,
              marginBottom: '1.25rem',
              color: 'var(--color-text-primary)',
            }}
          >
            Listo para potenciar tu programa?
          </h3>
          <p
            style={{
              fontFamily: 'var(--font-body)',
              fontSize: 'var(--text-body-lg)',
              lineHeight: 1.6,
              color: 'var(--color-text-secondary)',
              maxWidth: 560,
              margin: '0 auto 2.5rem',
              letterSpacing: '-0.01em',
            }}
          >
            Conversemos sobre cómo S4C puede integrarse a tu operación.
            Respondemos en menos de 24 horas.
          </p>

          {/* CTA buttons */}
          <div
            style={{
              display: 'flex',
              gap: '1rem',
              justifyContent: 'center',
              flexWrap: 'wrap',
            }}
          >
            <a
              href={`https://wa.me/51989338401?text=${encodeURIComponent('Hola, me interesa S4C para mi organización. Quisiera agendar una demo.')}`}
              target="_blank"
              rel="noopener noreferrer"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.75rem',
                padding: '1.25rem 2.5rem',
                borderRadius: 'var(--radius-full)',
                background: 'var(--color-accent-primary)',
                color: '#fff',
                fontFamily: 'var(--font-body)',
                fontSize: 'var(--text-body-lg)',
                fontWeight: 700,
                border: 'none',
                cursor: 'pointer',
                textDecoration: 'none',
                letterSpacing: '-0.01em',
                transition: 'transform 0.2s var(--ease-spring), opacity 0.2s ease',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-2px)'
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)'
              }}
            >
              <MessageCircle size={20} strokeWidth={2} />
              WhatsApp
            </a>

            <a
              href="mailto:hello@redesignlab.org?subject=Interés en S4C para organizaciones"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.75rem',
                padding: '1.25rem 2.5rem',
                borderRadius: 'var(--radius-full)',
                background: 'transparent',
                color: 'var(--color-text-primary)',
                fontFamily: 'var(--font-body)',
                fontSize: 'var(--text-body-lg)',
                fontWeight: 700,
                border: '1px solid var(--color-border-strong)',
                cursor: 'pointer',
                textDecoration: 'none',
                letterSpacing: '-0.01em',
                transition: 'transform 0.2s var(--ease-spring), background 0.2s ease, border-color 0.2s ease',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-2px)'
                e.currentTarget.style.background = 'rgba(218,78,36,0.08)'
                e.currentTarget.style.borderColor = 'rgba(218,78,36,0.4)'
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)'
                e.currentTarget.style.background = 'transparent'
                e.currentTarget.style.borderColor = 'var(--color-border-strong)'
              }}
            >
              <Mail size={20} strokeWidth={2} />
              hello@redesignlab.org
            </a>
          </div>

          {/* Login link */}
          <div style={{ marginTop: '1.75rem' }}>
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
                fontSize: '0.7rem',
                color: 'var(--color-text-secondary)',
                cursor: 'pointer',
                padding: 0,
              }}
            >
              Ya tienes acceso?{' '}
              <span style={{ color: 'var(--color-accent-primary)', fontWeight: 700 }}>Iniciar sesión</span>
              <ChevronRight size={14} color="var(--color-accent-primary)" />
            </button>
          </div>
        </motion.div>
      </section>
    </div>
  )
}
