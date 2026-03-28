'use client'

import { motion } from 'framer-motion'
import { Lightbulb, FlaskConical, Rocket, TrendingUp, ChevronRight } from 'lucide-react'

const stages = [
  {
    number: 1,
    name: 'Pre-incubación',
    tools: '6 herramientas',
    icon: Lightbulb,
    color: '#7C3AED',
    bg: 'rgba(124,58,237,0.08)',
  },
  {
    number: 2,
    name: 'Incubación',
    tools: '10 herramientas',
    icon: FlaskConical,
    color: '#2563EB',
    bg: 'rgba(37,99,235,0.08)',
  },
  {
    number: 3,
    name: 'Aceleración',
    tools: '8 herramientas',
    icon: Rocket,
    color: '#059669',
    bg: 'rgba(5,150,105,0.08)',
  },
  {
    number: 4,
    name: 'Escalamiento',
    tools: '6 herramientas',
    icon: TrendingUp,
    color: '#D97706',
    bg: 'rgba(217,119,6,0.08)',
  },
]

export default function ValueProp() {
  return (
    <section id="plataforma" style={{ padding: '5rem 0 3rem', background: 'white' }}>
      <div style={{ maxWidth: 1200, margin: '0 auto', padding: '0 1.5rem' }}>
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-50px' }}
          transition={{ duration: 0.5 }}
          style={{ textAlign: 'center', maxWidth: 700, margin: '0 auto 3rem' }}
        >
          <span
            style={{
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
              textTransform: 'uppercase' as const,
              marginBottom: '1rem',
            }}
          >
            La plataforma
          </span>
          <h2
            style={{
              fontFamily: 'var(--font-heading)',
              fontSize: 'clamp(1.75rem, 3.5vw, 2.5rem)',
              fontWeight: 800,
              lineHeight: 1.15,
              letterSpacing: '-0.02em',
              color: 'var(--color-text-primary)',
              marginBottom: '1rem',
            }}
          >
            Un ecosistema completo para desarrollar tu startup
          </h2>
          <p
            style={{
              fontFamily: 'var(--font-body)',
              fontSize: '1.0625rem',
              lineHeight: 1.7,
              color: 'var(--color-text-secondary)',
            }}
          >
            La infraestructura que conecta herramientas, conocimiento,
            inteligencia artificial y oportunidades reales en un solo lugar.
          </p>
        </motion.div>

        {/* Stage roadmap */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-50px' }}
          transition={{ duration: 0.5, delay: 0.15 }}
          style={{
            background: '#f8f9fa',
            borderRadius: 16,
            border: '1px solid var(--color-border)',
            padding: '2.5rem 2rem',
            maxWidth: 900,
            margin: '0 auto',
          }}
        >
          {/* Label */}
          <p
            style={{
              textAlign: 'center',
              fontFamily: 'var(--font-body)',
              fontSize: '0.8125rem',
              fontWeight: 600,
              textTransform: 'uppercase' as const,
              letterSpacing: '0.05em',
              color: 'var(--color-text-secondary)',
              marginBottom: '1.75rem',
            }}
          >
            Ruta de desarrollo
          </p>

          {/* Stages row */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 0,
              flexWrap: 'wrap',
            }}
          >
            {stages.map((stage, i) => (
              <div
                key={stage.name}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                }}
              >
                {/* Stage node */}
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true, margin: '-30px' }}
                  transition={{ duration: 0.35, delay: 0.2 + i * 0.1 }}
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    gap: '0.625rem',
                    minWidth: 130,
                  }}
                >
                  {/* Number + icon circle */}
                  <div
                    style={{
                      width: 56,
                      height: 56,
                      borderRadius: '50%',
                      background: stage.bg,
                      border: `2px solid ${stage.color}`,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      position: 'relative',
                    }}
                  >
                    <stage.icon size={24} strokeWidth={1.5} color={stage.color} />
                    <span
                      style={{
                        position: 'absolute',
                        top: -6,
                        right: -6,
                        width: 22,
                        height: 22,
                        borderRadius: '50%',
                        background: stage.color,
                        color: 'white',
                        fontFamily: 'var(--font-body)',
                        fontSize: '0.6875rem',
                        fontWeight: 700,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        lineHeight: 1,
                      }}
                    >
                      {stage.number}
                    </span>
                  </div>

                  {/* Stage name */}
                  <span
                    style={{
                      fontFamily: 'var(--font-heading)',
                      fontSize: '0.9375rem',
                      fontWeight: 700,
                      color: 'var(--color-text-primary)',
                      textAlign: 'center',
                    }}
                  >
                    {stage.name}
                  </span>

                  {/* Tool count */}
                  <span
                    style={{
                      fontFamily: 'var(--font-body)',
                      fontSize: '0.8125rem',
                      color: stage.color,
                      fontWeight: 600,
                    }}
                  >
                    {stage.tools}
                  </span>
                </motion.div>

                {/* Arrow connector (not after last) */}
                {i < stages.length - 1 && (
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      padding: '0 0.25rem',
                      marginBottom: '2.5rem',
                    }}
                  >
                    <div
                      style={{
                        width: 32,
                        height: 2,
                        background: 'var(--color-border)',
                      }}
                    />
                    <ChevronRight
                      size={16}
                      strokeWidth={2}
                      color="var(--color-text-secondary)"
                      style={{ marginLeft: -4 }}
                    />
                  </div>
                )}
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  )
}
