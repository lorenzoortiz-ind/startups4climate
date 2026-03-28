'use client'

import { motion } from 'framer-motion'
import { LayoutDashboard, Users, FileText, TrendingUp, ArrowRight, Check } from 'lucide-react'

const features = [
  {
    icon: LayoutDashboard,
    title: 'Panel de portafolio',
    description: 'Dashboard centralizado con métricas en tiempo real de todas las startups de tu programa. Progreso, etapa, herramientas completadas y alertas de inactividad.',
    color: '#7C3AED',
    bg: 'rgba(124,58,237,0.06)',
  },
  {
    icon: Users,
    title: 'Gestión de cohortes',
    description: 'Crea cohortes, asigna startups, define milestones y da seguimiento estructurado. Sin hojas de cálculo ni cadenas de correos interminables.',
    color: '#059669',
    bg: 'rgba(5,150,105,0.06)',
  },
  {
    icon: FileText,
    title: 'Reportes automáticos',
    description: 'Genera reportes PDF de progreso por cohorte, por startup o por programa completo. Listos para compartir con stakeholders y donantes.',
    color: '#0891B2',
    bg: 'rgba(8,145,178,0.06)',
  },
  {
    icon: TrendingUp,
    title: 'Benchmarking regional',
    description: 'Compara el desempeño de tus startups contra promedios de la plataforma por vertical, país y etapa. Identifica fortalezas y áreas de mejora con datos reales.',
    color: '#D97706',
    bg: 'rgba(217,119,6,0.06)',
  },
]

const plans = [
  {
    name: 'Starter',
    price: '$199',
    period: '/mes',
    description: 'Para programas pequeños y pilotos',
    capacity: 'Hasta 25 startups',
    features: [
      'Panel de portafolio',
      'Gestión de 1 cohorte',
      'Reportes mensuales',
      'Soporte por correo',
    ],
    highlighted: false,
  },
  {
    name: 'Professional',
    price: '$499',
    period: '/mes',
    description: 'Para incubadoras y aceleradoras activas',
    capacity: 'Hasta 100 startups',
    features: [
      'Todo en Starter',
      'Cohortes ilimitadas',
      'Reportes en tiempo real',
      'Benchmarking regional',
      'Soporte prioritario',
    ],
    highlighted: true,
  },
  {
    name: 'Enterprise',
    price: 'A medida',
    period: '',
    description: 'Para gobiernos y redes de programas',
    capacity: 'Startups ilimitadas',
    features: [
      'Todo en Professional',
      'Multi-organización',
      'API de integración',
      'Reportes personalizados',
      'Gerente de cuenta dedicado',
    ],
    highlighted: false,
  },
]

export default function ForOrganizations() {
  return (
    <section id="organizaciones" style={{ padding: '6rem 0', background: 'white' }}>
      <div style={{ maxWidth: 1200, margin: '0 auto', padding: '0 1.5rem' }}>
        {/* Section header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-50px' }}
          transition={{ duration: 0.5 }}
          style={{ textAlign: 'center', maxWidth: 740, margin: '0 auto 3.5rem' }}
        >
          <span style={{
            display: 'inline-block',
            padding: '0.3rem 0.875rem',
            borderRadius: 9999,
            background: 'rgba(124,58,237,0.06)',
            border: '1px solid rgba(124,58,237,0.12)',
            fontFamily: 'var(--font-body)',
            fontSize: '0.75rem',
            fontWeight: 600,
            color: '#7C3AED',
            letterSpacing: '0.03em',
            textTransform: 'uppercase',
            marginBottom: '1rem',
          }}>
            Para organizaciones
          </span>
          <h2 style={{
            fontFamily: 'var(--font-heading)',
            fontSize: 'clamp(1.75rem, 3.5vw, 2.5rem)',
            fontWeight: 800,
            lineHeight: 1.15,
            letterSpacing: '-0.02em',
            color: 'var(--color-text-primary)',
            marginBottom: '1rem',
          }}>
            La tecnología que tu programa de innovación necesita
          </h2>
          <p style={{
            fontFamily: 'var(--font-body)',
            fontSize: '1.0625rem',
            lineHeight: 1.7,
            color: 'var(--color-text-secondary)',
          }}>
            Incubadoras, aceleradoras y gobiernos usan nuestra plataforma para gestionar cohortes,
            medir progreso y generar reportes con datos reales de sus startups.
          </p>
        </motion.div>

        {/* Feature cards */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
          gap: '1.25rem',
          marginBottom: '4rem',
        }}>
          {features.map((feature, i) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-30px' }}
              transition={{ duration: 0.4, delay: i * 0.1 }}
              whileHover={{ y: -3, boxShadow: '0 4px 20px rgba(0,0,0,0.08)' }}
              style={{
                background: 'var(--color-bg-primary)',
                borderRadius: 16,
                border: '1px solid var(--color-border)',
                padding: '1.75rem',
              }}
            >
              <div style={{
                width: 44,
                height: 44,
                borderRadius: 12,
                background: feature.bg,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginBottom: '1rem',
              }}>
                <feature.icon size={22} strokeWidth={1.5} color={feature.color} />
              </div>
              <h3 style={{
                fontFamily: 'var(--font-heading)',
                fontSize: '1.0625rem',
                fontWeight: 700,
                color: 'var(--color-text-primary)',
                marginBottom: '0.5rem',
              }}>
                {feature.title}
              </h3>
              <p style={{
                fontFamily: 'var(--font-body)',
                fontSize: '0.875rem',
                lineHeight: 1.65,
                color: 'var(--color-text-secondary)',
              }}>
                {feature.description}
              </p>
            </motion.div>
          ))}
        </div>

        {/* Pricing preview */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-50px' }}
          transition={{ duration: 0.5 }}
          style={{ textAlign: 'center', marginBottom: '2.5rem' }}
        >
          <h3 style={{
            fontFamily: 'var(--font-heading)',
            fontSize: 'clamp(1.25rem, 2.5vw, 1.75rem)',
            fontWeight: 700,
            color: 'var(--color-text-primary)',
            marginBottom: '0.5rem',
          }}>
            Planes para organizaciones
          </h3>
          <p style={{
            fontFamily: 'var(--font-body)',
            fontSize: '0.9375rem',
            color: 'var(--color-text-secondary)',
          }}>
            Elige el plan que se ajuste al tamaño de tu programa
          </p>
        </motion.div>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
          gap: '1.5rem',
          marginBottom: '3rem',
        }}>
          {plans.map((plan, i) => (
            <motion.div
              key={plan.name}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-30px' }}
              transition={{ duration: 0.4, delay: i * 0.1 }}
              style={{
                background: plan.highlighted ? 'linear-gradient(135deg, rgba(124,58,237,0.03) 0%, rgba(5,150,105,0.03) 100%)' : 'white',
                borderRadius: 20,
                border: plan.highlighted ? '2px solid #7C3AED' : '1px solid var(--color-border)',
                padding: '2rem',
                position: 'relative',
                overflow: 'hidden',
              }}
            >
              {plan.highlighted && (
                <div style={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  right: 0,
                  height: 4,
                  background: 'linear-gradient(90deg, #7C3AED, #059669)',
                }} />
              )}
              <div style={{
                fontFamily: 'var(--font-mono)',
                fontSize: '0.6875rem',
                fontWeight: 600,
                color: plan.highlighted ? '#7C3AED' : 'var(--color-text-muted)',
                textTransform: 'uppercase',
                letterSpacing: '0.08em',
                marginBottom: '0.5rem',
              }}>
                {plan.name}
              </div>
              <div style={{
                display: 'flex',
                alignItems: 'baseline',
                gap: '0.25rem',
                marginBottom: '0.5rem',
              }}>
                <span style={{
                  fontFamily: 'var(--font-heading)',
                  fontSize: '2rem',
                  fontWeight: 800,
                  color: 'var(--color-text-primary)',
                }}>
                  {plan.price}
                </span>
                {plan.period && (
                  <span style={{
                    fontFamily: 'var(--font-body)',
                    fontSize: '0.875rem',
                    color: 'var(--color-text-muted)',
                  }}>
                    {plan.period}
                  </span>
                )}
              </div>
              <p style={{
                fontFamily: 'var(--font-body)',
                fontSize: '0.875rem',
                color: 'var(--color-text-secondary)',
                marginBottom: '0.25rem',
              }}>
                {plan.description}
              </p>
              <p style={{
                fontFamily: 'var(--font-mono)',
                fontSize: '0.75rem',
                fontWeight: 600,
                color: '#059669',
                marginBottom: '1.25rem',
              }}>
                {plan.capacity}
              </p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.625rem' }}>
                {plan.features.map((feat) => (
                  <div key={feat} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <Check size={16} strokeWidth={2} color="#059669" />
                    <span style={{
                      fontFamily: 'var(--font-body)',
                      fontSize: '0.8125rem',
                      color: 'var(--color-text-secondary)',
                    }}>
                      {feat}
                    </span>
                  </div>
                ))}
              </div>
            </motion.div>
          ))}
        </div>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-30px' }}
          transition={{ duration: 0.5 }}
          style={{ textAlign: 'center' }}
        >
          <a
            href="mailto:hello@redesignlab.org?subject=Demo%20de%20la%20plataforma%20para%20organizaciones"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.5rem',
              padding: '0.875rem 2.5rem',
              borderRadius: 9999,
              backgroundColor: '#7C3AED',
              color: 'white',
              fontFamily: 'var(--font-body)',
              fontSize: '0.9375rem',
              fontWeight: 600,
              border: 'none',
              cursor: 'pointer',
              transition: 'all 0.2s ease',
              boxShadow: '0 4px 16px rgba(124,58,237,0.3)',
              textDecoration: 'none',
            }}
          >
            Solicitar demo
            <ArrowRight size={18} />
          </a>
          <p style={{
            fontFamily: 'var(--font-body)',
            fontSize: '0.8125rem',
            color: 'var(--color-text-muted)',
            marginTop: '0.75rem',
          }}>
            Te respondemos en menos de 24 horas
          </p>
        </motion.div>
      </div>
    </section>
  )
}
