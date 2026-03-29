'use client'

import { motion } from 'framer-motion'

const problems = [
  {
    number: '01',
    title: 'Founders sin infraestructura',
    description:
      'Hay talento de sobra en LATAM para construir startups de impacto. Lo que falta son herramientas estructuradas y acompañamiento accesible.',
    accentColor: 'var(--color-accent-primary)',
  },
  {
    number: '02',
    title: 'Incubadoras sin tecnología',
    description:
      'Muchas gestionan cohortes con hojas de cálculo y correos. Sin visibilidad real del progreso, el acompañamiento pierde precisión y escala.',
    accentColor: 'var(--color-accent-secondary)',
  },
  {
    number: '03',
    title: 'Gobiernos sin visibilidad',
    description:
      'Los programas de innovación canalizan recursos importantes, pero carecen de herramientas para medir impacto real y mejorar políticas.',
    accentColor: 'var(--color-accent-primary)',
  },
]

export default function ProblemSection() {
  return (
    <section
      id="problema"
      style={{
        padding: 'var(--section-py) 0',
        background: 'var(--color-bg-primary)',
        borderTop: '1px solid var(--color-border)',
      }}
    >
      <div style={{ maxWidth: 'var(--container-max)', margin: '0 auto', padding: '0 var(--container-px)' }}>

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 60 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-100px' }}
          transition={{ type: 'spring', damping: 20, stiffness: 100 }}
          style={{ textAlign: 'left', marginBottom: 'clamp(4rem, 8vw, 8rem)' }}
        >
          <h2
            style={{
              fontFamily: 'var(--font-heading)',
              fontSize: 'var(--text-display-lg)',
              fontWeight: 700,
              lineHeight: 1.05,
              letterSpacing: '-0.03em',
              color: 'var(--color-ink)',
              maxWidth: 900,
              marginBottom: '2rem',
            }}
          >
            Tres brechas que frenan la innovación en la región
          </h2>
          <p
            style={{
              fontFamily: 'var(--font-body)',
              fontSize: 'var(--text-heading-lg)',
              lineHeight: 1.4,
              color: 'var(--color-text-secondary)',
              maxWidth: 700,
            }}
          >
            En Latinoamérica sobra talento emprendedor. Lo que falta es la infraestructura para desarrollarlo.
          </p>
        </motion.div>

        {/* Cards Grid */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
            gap: '2rem',
          }}
        >
          {problems.map((problem, i) => (
            <motion.div
              key={problem.title}
              initial={{ opacity: 0, y: 60 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-100px' }}
              transition={{ type: 'spring', damping: 20, stiffness: 100, delay: i * 0.1 }}
              whileHover={{ y: -6, boxShadow: '0 24px 48px -12px rgba(25,25,25,0.12)' }}
              style={{
                background: 'var(--color-paper)',
                borderRadius: 'var(--radius-lg)',
                border: '1px solid var(--color-border)',
                padding: '2.5rem',
                display: 'flex',
                flexDirection: 'column',
                position: 'relative',
                overflow: 'hidden',
                cursor: 'default',
                transition: 'box-shadow 0.2s var(--ease-smooth)',
              }}
            >
              {/* Top accent line */}
              <div
                style={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  right: 0,
                  height: 3,
                  background: problem.accentColor,
                  borderRadius: 'var(--radius-lg) var(--radius-lg) 0 0',
                }}
              />

              {/* Large decorative number */}
              <span
                style={{
                  fontFamily: 'var(--font-heading)',
                  fontSize: 'clamp(4rem, 8vw, 7rem)',
                  fontWeight: 700,
                  letterSpacing: '-0.05em',
                  lineHeight: 1,
                  color: 'var(--color-border)',
                  marginBottom: '1.5rem',
                  display: 'block',
                  userSelect: 'none',
                }}
              >
                {problem.number}
              </span>

              <h3
                style={{
                  fontFamily: 'var(--font-heading)',
                  fontSize: 'var(--text-heading-lg)',
                  fontWeight: 700,
                  letterSpacing: '-0.02em',
                  color: 'var(--color-ink)',
                  marginBottom: '1rem',
                  lineHeight: 1.2,
                }}
              >
                {problem.title}
              </h3>

              <p
                style={{
                  fontFamily: 'var(--font-body)',
                  fontSize: 'var(--text-body-lg)',
                  lineHeight: 1.6,
                  color: 'var(--color-text-secondary)',
                  margin: 0,
                }}
              >
                {problem.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
