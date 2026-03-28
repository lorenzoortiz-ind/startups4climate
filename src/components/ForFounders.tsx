'use client'

import { motion } from 'framer-motion'
import {
  Wrench,
  Bot,
  Radar,
  Gift,
  Stamp,
  UserCircle,
  ArrowRight,
} from 'lucide-react'
import { useAuth } from '@/context/AuthContext'
import { useRouter } from 'next/navigation'

const featured = {
  icon: Wrench,
  title: '30 herramientas interactivas',
  description: 'Desde la idea hasta el modelo validado. Cada herramienta incluye marco conceptual, formularios guiados y outputs descargables.',
  color: '#059669',
  bg: 'rgba(5,150,105,0.06)',
}

const row2 = [
  {
    icon: Bot,
    title: 'Mentores AI',
    description: 'Retroalimentaci\u00f3n contextual sobre tu modelo de negocio, mercado y estrategia, adaptada a tu vertical.',
    color: '#0891B2',
    bg: 'rgba(8,145,178,0.06)',
  },
  {
    icon: Radar,
    title: 'RADAR del ecosistema',
    description: 'Noticias, cambios regulatorios y tendencias de inversi\u00f3n en LATAM, curados para ti.',
    color: '#7C3AED',
    bg: 'rgba(124,58,237,0.06)',
  },
  {
    icon: Gift,
    title: 'Oportunidades',
    description: 'Grants, competencias y fondos que coinciden con tu perfil, etapa y vertical. Actualizados semanalmente.',
    color: '#D97706',
    bg: 'rgba(217,119,6,0.06)',
  },
]

const row3 = [
  {
    icon: Stamp,
    title: 'Startup Passport',
    description: 'Un perfil verificable de tu startup con m\u00e9tricas y nivel de madurez. Compartible con inversores y programas.',
    color: '#DC2626',
    bg: 'rgba(220,38,38,0.06)',
  },
  {
    icon: UserCircle,
    title: 'Perfil progresivo',
    description: 'Empieza con lo b\u00e1sico y la plataforma se adapta. Herramientas y recomendaciones se desbloquean a medida que avanzas.',
    color: '#0891B2',
    bg: 'rgba(8,145,178,0.06)',
  },
]

function FeatureCard({ feature, delay, style }: { feature: typeof row2[0]; delay: number; style?: React.CSSProperties }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-30px' }}
      transition={{ duration: 0.4, delay }}
      whileHover={{ y: -3, boxShadow: '0 4px 20px rgba(0,0,0,0.08)' }}
      style={{
        background: 'white',
        borderRadius: 16,
        border: '1px solid var(--color-border)',
        padding: '1.75rem',
        ...style,
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
        fontSize: '1rem',
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
  )
}

export default function ForFounders() {
  const { user, openAuthModal } = useAuth()
  const router = useRouter()

  return (
    <section id="founders" style={{ padding: '6rem 0', background: 'var(--color-bg-primary)' }}>
      <div style={{ maxWidth: 1200, margin: '0 auto', padding: '0 1.5rem' }}>
        {/* Section header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-50px' }}
          transition={{ duration: 0.5 }}
          style={{ textAlign: 'center', maxWidth: 700, margin: '0 auto 3.5rem' }}
        >
          <span style={{
            display: 'inline-block',
            padding: '0.3rem 0.875rem',
            borderRadius: 9999,
            background: 'rgba(5,150,105,0.06)',
            border: '1px solid rgba(5,150,105,0.12)',
            fontFamily: 'var(--font-body)',
            fontSize: '0.75rem',
            fontWeight: 600,
            color: '#059669',
            letterSpacing: '0.03em',
            textTransform: 'uppercase',
            marginBottom: '1rem',
          }}>
            Para founders
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
            Todo lo que necesitas para pasar de la idea al negocio validado
          </h2>
          <p style={{
            fontFamily: 'var(--font-body)',
            fontSize: '1.0625rem',
            lineHeight: 1.7,
            color: 'var(--color-text-secondary)',
          }}>
            Sin costo, sin aplicaciones, sin esperas. Crea tu cuenta y accede a la infraestructura
            completa para desarrollar tu startup de impacto.
          </p>
        </motion.div>

        {/* Row 1: Featured card — full width */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-30px' }}
          transition={{ duration: 0.5 }}
          whileHover={{ y: -3, boxShadow: '0 6px 28px rgba(0,0,0,0.08)' }}
          style={{
            background: 'linear-gradient(135deg, rgba(5,150,105,0.04) 0%, rgba(5,150,105,0.01) 100%)',
            borderRadius: 20,
            border: '1px solid rgba(5,150,105,0.15)',
            padding: '2.5rem',
            marginBottom: '1.25rem',
            display: 'flex',
            alignItems: 'center',
            gap: '2rem',
            flexWrap: 'wrap',
          }}
        >
          <div style={{
            width: 56,
            height: 56,
            borderRadius: 14,
            background: featured.bg,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexShrink: 0,
          }}>
            <featured.icon size={28} strokeWidth={1.5} color={featured.color} />
          </div>
          <div style={{ flex: 1, minWidth: 240 }}>
            <h3 style={{
              fontFamily: 'var(--font-heading)',
              fontSize: '1.25rem',
              fontWeight: 700,
              color: 'var(--color-text-primary)',
              marginBottom: '0.375rem',
            }}>
              {featured.title}
            </h3>
            <p style={{
              fontFamily: 'var(--font-body)',
              fontSize: '0.9375rem',
              lineHeight: 1.65,
              color: 'var(--color-text-secondary)',
              maxWidth: 600,
            }}>
              {featured.description}
            </p>
          </div>
        </motion.div>

        {/* Row 2: 3 cards */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(3, 1fr)',
          gap: '1.25rem',
          marginBottom: '1.25rem',
        }}
          className="founders-row2"
        >
          {row2.map((feature, i) => (
            <FeatureCard key={feature.title} feature={feature} delay={i * 0.08} />
          ))}
        </div>

        {/* Row 3: 2 cards */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(2, 1fr)',
          gap: '1.25rem',
          marginBottom: '3rem',
        }}
          className="founders-row3"
        >
          {row3.map((feature, i) => (
            <FeatureCard key={feature.title} feature={feature} delay={i * 0.08 + 0.24} />
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
          <button
            onClick={() => user ? router.push('/tools') : openAuthModal('register')}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.5rem',
              padding: '0.875rem 2.5rem',
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
        </motion.div>
      </div>

      <style>{`
        @media (max-width: 768px) {
          .founders-row2 { grid-template-columns: 1fr !important; }
          .founders-row3 { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </section>
  )
}
