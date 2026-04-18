'use client'

import { motion } from 'framer-motion'
import { Users, Building2, BarChart3 } from 'lucide-react'

const problems = [
  {
    icon: Users,
    title: 'Founders sin infraestructura',
    description:
      'Hay talento de sobra en LATAM. Lo que falta son herramientas estructuradas y acompañamiento accesible para construir startups de impacto.',
    accent: 'ember' as const,
  },
  {
    icon: Building2,
    title: 'Incubadoras sin tecnología',
    description:
      'Cohortes gestionadas con hojas de cálculo y correos. Sin visibilidad real del progreso, el acompañamiento pierde precisión y escala.',
    accent: 'electric' as const,
  },
  {
    icon: BarChart3,
    title: 'Gobiernos sin visibilidad',
    description:
      'Programas de innovación canalizan recursos importantes, pero carecen de herramientas para medir impacto real y mejorar políticas.',
    accent: 'ember' as const,
  },
]

export default function ProblemSection() {
  return (
    <section
      id="problema"
      style={{
        position: 'relative',
        padding: 'clamp(5rem, 10vw, 8rem) 0',
        background: 'var(--color-bg-primary)',
        overflow: 'hidden',
      }}
    >
      <div
        className="orb orb-electric orb-sm"
        style={{ top: '10%', left: '-200px', opacity: 0.25 }}
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
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.6 }}
          style={{ textAlign: 'center', maxWidth: 760, margin: '0 auto 4rem' }}
        >
          <span className="pill-electric" style={{ marginBottom: '1.5rem' }}>
            <span className="dot" /> El problema
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
            Tres brechas frenan la innovación{' '}
            <span className="text-electric">en la región</span>
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
            En Latinoamérica sobra talento emprendedor. Lo que falta es la infraestructura para desarrollarlo a escala.
          </p>
        </motion.div>

        {/* Cards Grid */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
            gap: '1.25rem',
          }}
        >
          {problems.map((p, i) => {
            const Icon = p.icon
            const isEmber = p.accent === 'ember'
            return (
              <motion.div
                key={p.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-80px' }}
                transition={{ duration: 0.5, delay: i * 0.08 }}
                className="glass-card"
                style={{
                  padding: '2rem',
                  borderRadius: 20,
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '1rem',
                  border: isEmber
                    ? '1px solid rgba(218,78,36,0.25)'
                    : '1px solid rgba(31,119,246,0.25)',
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
                    border: isEmber
                      ? '1px solid rgba(218,78,36,0.35)'
                      : '1px solid rgba(31,119,246,0.35)',
                    color: isEmber ? '#FF8918' : '#5C9BFF',
                  }}
                >
                  <Icon size={20} strokeWidth={2} />
                </div>

                <h3
                  style={{
                    fontFamily: 'var(--font-heading)',
                    fontSize: '1.35rem',
                    fontWeight: 500,
                    letterSpacing: '-0.02em',
                    color: 'var(--color-ink)',
                    margin: 0,
                    lineHeight: 1.15,
                  }}
                >
                  {p.title}
                </h3>

                <p
                  style={{
                    fontFamily: 'var(--font-body)',
                    fontSize: '0.95rem',
                    lineHeight: 1.55,
                    color: 'var(--color-text-secondary)',
                    margin: 0,
                  }}
                >
                  {p.description}
                </p>
              </motion.div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
