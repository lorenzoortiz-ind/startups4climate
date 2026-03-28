'use client'

import { motion } from 'framer-motion'
import {
  Wrench,
  Bot,
  Radar,
  Gift,
  Stamp,
  BookOpen,
  UserCircle,
  ArrowRight,
} from 'lucide-react'
import { useAuth } from '@/context/AuthContext'
import { useRouter } from 'next/navigation'

const features = [
  {
    icon: Wrench,
    title: '30 herramientas interactivas',
    description: 'Desde la idea hasta el modelo validado. Cada herramienta incluye marco teórico, formularios guiados y outputs descargables.',
    color: '#059669',
    bg: 'rgba(5,150,105,0.06)',
  },
  {
    icon: Bot,
    title: 'Mentor AI especializado',
    description: 'Un mentor de inteligencia artificial que entiende tu vertical (fintech, healthtech, edtech, climatetech) y te da retroalimentación accionable.',
    color: '#0891B2',
    bg: 'rgba(8,145,178,0.06)',
  },
  {
    icon: Radar,
    title: 'RADAR del ecosistema',
    description: 'Noticias, cambios regulatorios y tendencias de inversión en LATAM. Información curada para que tomes mejores decisiones.',
    color: '#7C3AED',
    bg: 'rgba(124,58,237,0.06)',
  },
  {
    icon: Gift,
    title: 'Oportunidades personalizadas',
    description: 'Grants, competencias, fondos y programas que coinciden con tu perfil, etapa y vertical. Actualizados semanalmente.',
    color: '#D97706',
    bg: 'rgba(217,119,6,0.06)',
  },
  {
    icon: Stamp,
    title: 'Startup Passport',
    description: 'Un perfil verificable de tu startup con métricas, herramientas completadas y nivel de madurez. Compartible con inversores y programas.',
    color: '#DC2626',
    bg: 'rgba(220,38,38,0.06)',
  },
  {
    icon: BookOpen,
    title: 'Workbook gratuito',
    description: 'Descarga tu workbook completo con todos los outputs de las herramientas. Tu plan de negocio construido paso a paso.',
    color: '#059669',
    bg: 'rgba(5,150,105,0.06)',
  },
  {
    icon: UserCircle,
    title: 'Perfil progresivo',
    description: 'Empieza con lo básico y la plataforma se adapta. A medida que avanzas, se desbloquean herramientas más avanzadas y recomendaciones más precisas.',
    color: '#0891B2',
    bg: 'rgba(8,145,178,0.06)',
  },
]

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

        {/* Feature cards grid */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
          gap: '1.25rem',
          marginBottom: '3rem',
        }}>
          {features.map((feature, i) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-30px' }}
              transition={{ duration: 0.4, delay: i * 0.08 }}
              whileHover={{ y: -3, boxShadow: '0 4px 20px rgba(0,0,0,0.08)' }}
              style={{
                background: 'white',
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
    </section>
  )
}
