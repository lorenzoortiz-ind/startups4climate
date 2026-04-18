'use client'

import { motion } from 'framer-motion'
import { LayoutDashboard, Users, FileText, TrendingUp, ArrowRight } from 'lucide-react'

const features = [
  {
    icon: LayoutDashboard,
    title: 'Panel de portafolio',
    description: 'Dashboard centralizado con métricas en tiempo real de todas las startups de tu programa.',
    accent: 'ember' as const,
  },
  {
    icon: Users,
    title: 'Gestión de cohortes',
    description: 'Crea cohortes, asigna startups y define milestones. Sin hojas de cálculo ni cadenas de correos.',
    accent: 'electric' as const,
  },
  {
    icon: FileText,
    title: 'Reportes automáticos',
    description: 'Genera reportes Excel de progreso por cohorte o startup. Listos para compartir con stakeholders.',
    accent: 'ember' as const,
  },
  {
    icon: TrendingUp,
    title: 'Benchmarking regional',
    description: 'Compara el desempeño de tus startups contra promedios por vertical, país y etapa.',
    accent: 'electric' as const,
  },
]

function FeatureCard({ feature, i }: { feature: typeof features[0]; i: number }) {
  const Icon = feature.icon
  const isEmber = feature.accent === 'ember'
  const accentColor = isEmber ? '#FF8918' : '#5C9BFF'

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-50px' }}
      transition={{ duration: 0.5, delay: i * 0.06 }}
      className="glass-card"
      style={{
        padding: '2rem',
        borderRadius: 18,
        display: 'flex',
        flexDirection: 'column',
        gap: '1rem',
        border: `1px solid ${accentColor}30`,
      }}
    >
      <div
        style={{
          width: 44,
          height: 44,
          borderRadius: 12,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: isEmber
            ? 'linear-gradient(135deg, rgba(218,78,36,0.18), rgba(255,137,24,0.10))'
            : 'linear-gradient(135deg, rgba(31,119,246,0.18), rgba(31,119,246,0.08))',
          border: `1px solid ${accentColor}55`,
          color: accentColor,
        }}
      >
        <Icon size={20} strokeWidth={2} />
      </div>
      <h3
        style={{
          fontFamily: 'var(--font-heading)',
          fontSize: '1.2rem',
          fontWeight: 500,
          color: 'var(--color-ink)',
          margin: 0,
          letterSpacing: '-0.02em',
          lineHeight: 1.2,
        }}
      >
        {feature.title}
      </h3>
      <p
        style={{
          fontFamily: 'var(--font-body)',
          fontSize: '0.92rem',
          lineHeight: 1.55,
          color: 'var(--color-text-secondary)',
          margin: 0,
        }}
      >
        {feature.description}
      </p>
    </motion.div>
  )
}

export default function ForOrganizations() {
  return (
    <section
      id="organizaciones"
      style={{
        position: 'relative',
        padding: 'clamp(5rem, 10vw, 8rem) 0',
        background: 'var(--color-bg-primary)',
        overflow: 'hidden',
      }}
    >
      <div
        className="orb orb-ember orb-sm"
        style={{ top: '10%', right: '-220px', opacity: 0.22 }}
        aria-hidden
      />

      <div
        style={{
          maxWidth: 1280,
          margin: '0 auto',
          padding: '0 clamp(1.25rem, 4vw, 3rem)',
          position: 'relative',
          zIndex: 1,
        }}
      >
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.6 }}
          style={{ maxWidth: 760, margin: '0 auto 3rem', textAlign: 'center' }}
        >
          <span className="pill-ember" style={{ marginBottom: '1.25rem' }}>
            <span className="dot" /> Para organizaciones
          </span>
          <h2
            style={{
              fontFamily: 'var(--font-heading)',
              fontSize: 'clamp(2rem, 4.5vw, 3.4rem)',
              fontWeight: 500,
              lineHeight: 1.05,
              letterSpacing: '-0.03em',
              color: 'var(--color-ink)',
              margin: '1rem 0 1.25rem',
            }}
          >
            La tecnología que tu programa{' '}
            <span className="text-ember">de innovación necesita</span>
          </h2>
          <p
            style={{
              fontFamily: 'var(--font-body)',
              fontSize: 'clamp(1rem, 1.3vw, 1.15rem)',
              lineHeight: 1.55,
              color: 'var(--color-text-secondary)',
              margin: 0,
            }}
          >
            Incubadoras, aceleradoras y gobiernos usan nuestra plataforma para gestionar cohortes,
            medir progreso y generar reportes con datos reales.
          </p>
        </motion.div>

        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))',
            gap: '1.25rem',
            marginBottom: '4rem',
          }}
        >
          {features.map((feature, i) => (
            <FeatureCard key={feature.title} feature={feature} i={i} />
          ))}
        </div>

        {/* Ember CTA card */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.6 }}
          className="glass-card"
          style={{
            padding: 'clamp(2.5rem, 5vw, 4rem)',
            borderRadius: 24,
            textAlign: 'center',
            maxWidth: 920,
            margin: '0 auto',
            border: '1px solid rgba(218,78,36,0.45)',
            background: 'rgba(14, 14, 14, 0.85)',
            boxShadow:
              'inset 0 0 14px rgba(217,119,87,0.40), inset 0 0 28px rgba(217,119,87,0.18), 0 30px 80px -20px rgba(218,78,36,0.40)',
          }}
        >
          <span className="pill-ember" style={{ marginBottom: '1.25rem' }}>
            <span className="dot" /> Agenda una llamada
          </span>
          <h3
            style={{
              fontFamily: 'var(--font-heading)',
              fontSize: 'clamp(1.6rem, 3.5vw, 2.4rem)',
              fontWeight: 500,
              letterSpacing: '-0.03em',
              lineHeight: 1.1,
              margin: '1rem 0 1rem',
              color: 'var(--color-ink)',
            }}
          >
            ¿Gestionas un programa{' '}
            <span className="text-ember">de incubación?</span>
          </h3>
          <p
            style={{
              fontFamily: 'var(--font-body)',
              fontSize: '1rem',
              lineHeight: 1.55,
              color: 'var(--color-text-secondary)',
              maxWidth: 520,
              margin: '0 auto 2rem',
            }}
          >
            Te mostramos en 30 minutos cómo la plataforma puede integrarse a tu operación.
          </p>
          <a
            href="https://calendly.com/redesignlab"
            target="_blank"
            rel="noopener noreferrer"
            className="btn-ember"
          >
            Agenda una llamada
            <ArrowRight size={16} strokeWidth={2.4} />
          </a>
        </motion.div>
      </div>
    </section>
  )
}
