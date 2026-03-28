'use client'

import { motion } from 'framer-motion'
import { LayoutDashboard, Users, FileText, TrendingUp, ArrowRight } from 'lucide-react'

const features = [
  {
    icon: LayoutDashboard,
    title: 'Panel de portafolio',
    description: 'Dashboard centralizado con m\u00e9tricas en tiempo real de todas las startups de tu programa.',
    color: '#7C3AED',
    bg: 'rgba(124,58,237,0.06)',
  },
  {
    icon: Users,
    title: 'Gesti\u00f3n de cohortes',
    description: 'Crea cohortes, asigna startups y define milestones. Sin hojas de c\u00e1lculo ni cadenas de correos.',
    color: '#059669',
    bg: 'rgba(5,150,105,0.06)',
  },
  {
    icon: FileText,
    title: 'Reportes autom\u00e1ticos',
    description: 'Genera reportes PDF de progreso por cohorte o por startup. Listos para compartir con stakeholders.',
    color: '#0891B2',
    bg: 'rgba(8,145,178,0.06)',
  },
  {
    icon: TrendingUp,
    title: 'Benchmarking regional',
    description: 'Compara el desempe\u00f1o de tus startups contra promedios por vertical, pa\u00eds y etapa.',
    color: '#D97706',
    bg: 'rgba(217,119,6,0.06)',
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
            La tecnolog\u00eda que tu programa de innovaci\u00f3n necesita
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

        {/* Feature cards — 2x2 grid */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(2, 1fr)',
          gap: '1.25rem',
          marginBottom: '3.5rem',
        }}
          className="org-features-grid"
        >
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

        {/* CTA section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-30px' }}
          transition={{ duration: 0.5 }}
          style={{
            background: 'linear-gradient(135deg, rgba(124,58,237,0.04) 0%, rgba(5,150,105,0.04) 100%)',
            borderRadius: 20,
            border: '1px solid rgba(124,58,237,0.12)',
            padding: '3rem 2rem',
            textAlign: 'center',
            maxWidth: 720,
            margin: '0 auto',
          }}
        >
          <h3 style={{
            fontFamily: 'var(--font-heading)',
            fontSize: 'clamp(1.125rem, 2.5vw, 1.5rem)',
            fontWeight: 700,
            color: 'var(--color-text-primary)',
            marginBottom: '0.75rem',
          }}>
            {'\u00BF'}Gestionas un programa de incubaci\u00f3n o aceleraci\u00f3n?
          </h3>
          <p style={{
            fontFamily: 'var(--font-body)',
            fontSize: '0.9375rem',
            lineHeight: 1.7,
            color: 'var(--color-text-secondary)',
            maxWidth: 520,
            margin: '0 auto 1.5rem',
          }}>
            Agenda una llamada y te mostramos c\u00f3mo la plataforma puede integrarse a tu operaci\u00f3n.
          </p>
          <a
            href="https://calendly.com/redesignlab"
            target="_blank"
            rel="noopener noreferrer"
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
            Agenda una llamada
            <ArrowRight size={18} />
          </a>
        </motion.div>
      </div>

      <style>{`
        @media (max-width: 768px) {
          .org-features-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </section>
  )
}
