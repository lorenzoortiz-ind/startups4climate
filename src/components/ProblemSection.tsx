'use client'

import { motion } from 'framer-motion'
import { UserX, Laptop, BarChart3 } from 'lucide-react'

const problems = [
  {
    icon: UserX,
    number: '01',
    title: 'Founders sin infraestructura',
    description:
      'Hay talento sobrado en LATAM para construir startups de impacto. Lo que falta son herramientas estructuradas y acompa\u00f1amiento accesible.',
    color: '#DC2626',
    bg: 'rgba(220,38,38,0.06)',
  },
  {
    icon: Laptop,
    number: '02',
    title: 'Incubadoras sin tecnolog\u00eda',
    description:
      'Muchas gestionan cohortes con hojas de c\u00e1lculo y correos. Sin visibilidad real del progreso, el acompa\u00f1amiento pierde precisi\u00f3n y escala.',
    color: '#D97706',
    bg: 'rgba(217,119,6,0.06)',
  },
  {
    icon: BarChart3,
    number: '03',
    title: 'Gobiernos sin visibilidad',
    description:
      'Los programas de innovaci\u00f3n canalizan recursos importantes, pero carecen de herramientas para medir impacto real y mejorar pol\u00edticas.',
    color: '#7C3AED',
    bg: 'rgba(124,58,237,0.06)',
  },
]

export default function ProblemSection() {
  return (
    <section id="problema" style={{ padding: '6rem 0', background: 'var(--color-bg-primary)' }}>
      <div style={{
        maxWidth: 1200,
        margin: '0 auto',
        padding: '0 1.5rem',
      }}>
        {/* Section title */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-50px' }}
          transition={{ duration: 0.5 }}
          style={{ textAlign: 'center', marginBottom: '1rem' }}
        >
          <h2 style={{
            fontFamily: 'var(--font-heading)',
            fontSize: 'clamp(1.75rem, 3.5vw, 2.5rem)',
            fontWeight: 800,
            lineHeight: 1.15,
            letterSpacing: '-0.02em',
            color: 'var(--color-text-primary)',
          }}>
            Tres brechas que frenan la innovaci\u00f3n en la regi\u00f3n
          </h2>
        </motion.div>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-50px' }}
          transition={{ duration: 0.5, delay: 0.1 }}
          style={{
            textAlign: 'center',
            maxWidth: 680,
            margin: '0 auto 3.5rem',
            fontFamily: 'var(--font-body)',
            fontSize: '1.0625rem',
            lineHeight: 1.7,
            color: 'var(--color-text-secondary)',
          }}
        >
          El talento emprendedor est\u00e1 distribuido por toda Latinoam\u00e9rica. La infraestructura para
          desarrollarlo, no.
        </motion.p>

        {/* Numbered vertical stack with alternating alignment */}
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          gap: '1.5rem',
          maxWidth: 900,
          margin: '0 auto 3rem',
        }}>
          {problems.map((problem, i) => {
            const isEven = i % 2 === 0
            return (
              <motion.div
                key={problem.title}
                initial={{ opacity: 0, x: isEven ? -30 : 30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, margin: '-50px' }}
                transition={{ duration: 0.5, delay: i * 0.12 }}
                style={{
                  display: 'flex',
                  alignItems: 'flex-start',
                  gap: '1.5rem',
                  background: 'white',
                  borderRadius: 16,
                  border: '1px solid var(--color-border)',
                  padding: '2rem',
                  alignSelf: isEven ? 'flex-start' : 'flex-end',
                  maxWidth: 720,
                  width: '100%',
                }}
              >
                <div style={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  gap: '0.5rem',
                  flexShrink: 0,
                }}>
                  <span style={{
                    fontFamily: 'var(--font-mono)',
                    fontSize: '1.5rem',
                    fontWeight: 800,
                    color: problem.color,
                    lineHeight: 1,
                  }}>
                    {problem.number}
                  </span>
                  <div style={{
                    width: 44,
                    height: 44,
                    borderRadius: 12,
                    background: problem.bg,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}>
                    <problem.icon size={22} strokeWidth={1.5} color={problem.color} />
                  </div>
                </div>
                <div>
                  <h3 style={{
                    fontFamily: 'var(--font-heading)',
                    fontSize: '1.125rem',
                    fontWeight: 700,
                    lineHeight: 1.2,
                    letterSpacing: '-0.01em',
                    color: 'var(--color-text-primary)',
                    marginBottom: '0.5rem',
                  }}>
                    {problem.title}
                  </h3>
                  <p style={{
                    fontFamily: 'var(--font-body)',
                    fontSize: '0.9375rem',
                    lineHeight: 1.65,
                    color: 'var(--color-text-secondary)',
                  }}>
                    {problem.description}
                  </p>
                </div>
              </motion.div>
            )
          })}
        </div>

        {/* Bridge message */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-50px' }}
          transition={{ duration: 0.5, delay: 0.2 }}
          style={{
            background: 'linear-gradient(135deg, rgba(5,150,105,0.04) 0%, rgba(124,58,237,0.04) 100%)',
            borderRadius: 16,
            border: '1px solid rgba(5,150,105,0.12)',
            padding: '2rem',
            textAlign: 'center',
            maxWidth: 720,
            margin: '0 auto',
          }}
        >
          <p style={{
            fontFamily: 'var(--font-body)',
            fontSize: '1rem',
            lineHeight: 1.7,
            color: 'var(--color-text-secondary)',
          }}>
            Construimos una plataforma que atiende los tres lados:{' '}
            <span style={{ fontWeight: 700, color: '#059669' }}>
              herramientas para founders, tecnolog\u00eda para organizaciones y datos para pol\u00edticas de innovaci\u00f3n
            </span>.
          </p>
        </motion.div>
      </div>
    </section>
  )
}
