'use client'

import { motion } from 'framer-motion'
import { Sparkles, Trophy, Banknote, GraduationCap, Rocket } from 'lucide-react'

const CATEGORIES = [
  {
    icon: Banknote,
    title: 'Grants y fondos no reembolsables',
    description:
      'Convocatorias de financiamiento no dilutivo para startups de impacto en la region.',
    color: '#059669',
  },
  {
    icon: Trophy,
    title: 'Competencias y premios',
    description:
      'Concursos de innovacion, pitch competitions y premios para emprendedores.',
    color: '#D97706',
  },
  {
    icon: Rocket,
    title: 'Programas de aceleracion',
    description:
      'Aceleradoras e incubadoras con convocatorias abiertas en LATAM.',
    color: '#6366F1',
  },
  {
    icon: GraduationCap,
    title: 'Capacitacion y mentoria',
    description:
      'Programas formativos, bootcamps y redes de mentores para founders.',
    color: '#EC4899',
  },
]

export default function OportunidadesPage() {
  return (
    <div
      style={{
        minHeight: '100vh',
        background: 'var(--color-bg-primary)',
        padding: '2rem 1.5rem',
      }}
    >
      <div style={{ maxWidth: 800, margin: '0 auto' }}>
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, ease: 'easeOut' }}
          style={{ marginBottom: '2rem' }}
        >
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.75rem',
              marginBottom: '0.75rem',
            }}
          >
            <div
              style={{
                width: 40,
                height: 40,
                borderRadius: 12,
                background:
                  'linear-gradient(135deg, rgba(217,119,6,0.12), rgba(217,119,6,0.04))',
                border: '1px solid rgba(217,119,6,0.2)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <Sparkles size={20} color="#D97706" />
            </div>
            <h1
              style={{
                fontFamily: 'var(--font-heading)',
                fontSize: '1.5rem',
                fontWeight: 800,
                color: 'var(--color-text-primary)',
              }}
            >
              Oportunidades para tu startup
            </h1>
          </div>
          <p
            style={{
              fontFamily: 'var(--font-body)',
              fontSize: '0.9375rem',
              color: 'var(--color-text-secondary)',
              lineHeight: 1.6,
              maxWidth: 560,
            }}
          >
            Proximamente: grants, competencias, fondos y programas de
            aceleracion personalizados para tu perfil.
          </p>
        </motion.div>

        {/* Category grid */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
            gap: '1rem',
          }}
        >
          {CATEGORIES.map((cat, i) => {
            const Icon = cat.icon
            return (
              <motion.div
                key={cat.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{
                  duration: 0.35,
                  delay: 0.1 + i * 0.08,
                  ease: 'easeOut',
                }}
                style={{
                  padding: '1.5rem',
                  borderRadius: 14,
                  background: 'var(--color-bg-card)',
                  border: '1px solid var(--color-border)',
                  boxShadow: 'var(--shadow-card)',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '0.75rem',
                }}
              >
                <div
                  style={{
                    width: 40,
                    height: 40,
                    borderRadius: 10,
                    background: `${cat.color}14`,
                    border: `1px solid ${cat.color}25`,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <Icon size={20} color={cat.color} />
                </div>
                <h2
                  style={{
                    fontFamily: 'var(--font-heading)',
                    fontSize: '0.9375rem',
                    fontWeight: 700,
                    color: 'var(--color-text-primary)',
                  }}
                >
                  {cat.title}
                </h2>
                <p
                  style={{
                    fontFamily: 'var(--font-body)',
                    fontSize: '0.8125rem',
                    color: 'var(--color-text-secondary)',
                    lineHeight: 1.5,
                  }}
                >
                  {cat.description}
                </p>
                <div
                  style={{
                    marginTop: 'auto',
                    paddingTop: '0.5rem',
                  }}
                >
                  <span
                    style={{
                      fontFamily: 'var(--font-mono)',
                      fontSize: '0.6875rem',
                      fontWeight: 600,
                      color: cat.color,
                      textTransform: 'uppercase',
                      letterSpacing: '0.05em',
                    }}
                  >
                    Proximamente
                  </span>
                </div>
              </motion.div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
