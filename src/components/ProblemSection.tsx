'use client'

import { motion } from 'framer-motion'
import { UserX, Laptop, BarChart3 } from 'lucide-react'

const problems = [
  {
    icon: UserX,
    title: 'Founders sin infraestructura',
    description:
      'Hay talento sobrado en LATAM para construir startups de impacto. Lo que falta son herramientas estructuradas y acompañamiento accesible.',
    accentColor: '#DC2626',
    iconBg: 'rgba(220,38,38,0.07)',
  },
  {
    icon: Laptop,
    title: 'Incubadoras sin tecnología',
    description:
      'Muchas gestionan cohortes con hojas de cálculo y correos. Sin visibilidad real del progreso, el acompañamiento pierde precisión y escala.',
    accentColor: '#D97706',
    iconBg: 'rgba(217,119,6,0.07)',
  },
  {
    icon: BarChart3,
    title: 'Gobiernos sin visibilidad',
    description:
      'Los programas de innovación canalizan recursos importantes, pero carecen de herramientas para medir impacto real y mejorar políticas.',
    accentColor: '#7C3AED',
    iconBg: 'rgba(124,58,237,0.07)',
  },
]

export default function ProblemSection() {
  return (
    <section
      id="problema"
      style={{
        padding: '6rem 0',
        background: '#F7F8FA',
      }}
    >
      <div style={{ maxWidth: 1200, margin: '0 auto', padding: '0 2rem' }}>
        {/* Section header */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-50px' }}
          transition={{ duration: 0.5 }}
          style={{ textAlign: 'center', marginBottom: '4rem' }}
        >
          <h2
            style={{
              fontFamily: 'var(--font-heading)',
              fontSize: 'clamp(2rem, 4vw, 3rem)',
              fontWeight: 800,
              lineHeight: 1.1,
              letterSpacing: '-0.03em',
              color: 'var(--color-text-primary)',
              marginBottom: '1.25rem',
            }}
          >
            Tres brechas que frenan la innovación en la región
          </h2>
          <p
            style={{
              fontFamily: 'var(--font-body)',
              fontSize: 'clamp(1rem, 1.5vw, 1.125rem)',
              lineHeight: 1.7,
              color: 'var(--color-text-secondary)',
              maxWidth: 620,
              margin: '0 auto',
            }}
          >
            Miles de founders en Latinoamérica tienen ideas brillantes.
            Lo que les falta es un ecosistema que los acompañe desde el día uno.
          </p>
        </motion.div>

        {/* 3-column grid */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
            gap: '2rem',
            marginBottom: '4rem',
          }}
        >
          {problems.map((problem, i) => (
            <motion.div
              key={problem.title}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-50px' }}
              transition={{ duration: 0.45, delay: i * 0.1 }}
              whileHover={{
                y: -4,
                boxShadow: '0 12px 40px rgba(0,0,0,0.08)',
              }}
              style={{
                background: 'white',
                borderRadius: 24,
                border: '1px solid rgba(0,0,0,0.06)',
                boxShadow: '0 2px 12px rgba(0,0,0,0.04)',
                overflow: 'hidden',
                display: 'flex',
                flexDirection: 'column',
                transition: 'transform 0.3s ease-out, box-shadow 0.3s ease-out',
                cursor: 'default',
              }}
            >
              <div style={{ padding: '2.25rem 2rem' }}>
                {/* Icon */}
                <div
                  style={{
                    width: 56,
                    height: 56,
                    borderRadius: '50%',
                    background: problem.iconBg,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    marginBottom: '1.5rem',
                  }}
                >
                  <problem.icon
                    size={26}
                    strokeWidth={1.5}
                    color={problem.accentColor}
                  />
                </div>

                {/* Title */}
                <h3
                  style={{
                    fontFamily: 'var(--font-heading)',
                    fontSize: 'clamp(1.125rem, 1.5vw, 1.25rem)',
                    fontWeight: 700,
                    lineHeight: 1.25,
                    letterSpacing: '-0.01em',
                    color: 'var(--color-text-primary)',
                    marginBottom: '0.75rem',
                  }}
                >
                  {problem.title}
                </h3>

                {/* Description */}
                <p
                  style={{
                    fontFamily: 'var(--font-body)',
                    fontSize: '0.9375rem',
                    lineHeight: 1.7,
                    color: 'var(--color-text-secondary)',
                    margin: 0,
                  }}
                >
                  {problem.description}
                </p>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Bridge message */}
        <motion.p
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-50px' }}
          transition={{ duration: 0.45, delay: 0.15 }}
          style={{
            textAlign: 'center',
            maxWidth: 660,
            margin: '0 auto',
            fontFamily: 'var(--font-body)',
            fontSize: 'clamp(1rem, 1.5vw, 1.0625rem)',
            lineHeight: 1.7,
            color: 'var(--color-text-secondary)',
          }}
        >
          Startups4climate es una plataforma all-in-one que atiende estos tres frentes:{' '}
          <span style={{ fontWeight: 700, color: '#059669' }}>
            herramientas para founders, tecnología para organizaciones y datos
            para políticas de innovación
          </span>
          .
        </motion.p>
      </div>
    </section>
  )
}
