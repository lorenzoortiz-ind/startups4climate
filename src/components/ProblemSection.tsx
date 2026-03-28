'use client'

import { motion } from 'framer-motion'
import { UserX, Laptop, BarChart3 } from 'lucide-react'

const problems = [
  {
    icon: UserX,
    title: 'Founders sin infraestructura',
    description:
      'En Latinoamérica hay talento sobrado para construir startups de impacto. Lo que falta son herramientas estructuradas, metodología accesible y acompañamiento que no dependa de vivir en la ciudad correcta o conocer a las personas indicadas.',
    color: '#DC2626',
    bg: 'rgba(220,38,38,0.06)',
    borderColor: '#DC2626',
  },
  {
    icon: Laptop,
    title: 'Incubadoras sin tecnología',
    description:
      'Las incubadoras y aceleradoras hacen un trabajo fundamental, pero muchas gestionan sus cohortes con hojas de cálculo y correos. Sin visibilidad real del progreso de cada startup, el acompañamiento pierde precisión y escala.',
    color: '#D97706',
    bg: 'rgba(217,119,6,0.06)',
    borderColor: '#D97706',
  },
  {
    icon: BarChart3,
    title: 'Gobiernos sin visibilidad',
    description:
      'Los programas gubernamentales de innovación canalizan recursos importantes hacia el emprendimiento, pero carecen de herramientas para medir impacto real. Sin datos estructurados, es difícil justificar inversión y mejorar las políticas.',
    color: '#7C3AED',
    bg: 'rgba(124,58,237,0.06)',
    borderColor: '#7C3AED',
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
            Tres brechas que frenan la innovación en la región
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
          El talento emprendedor está distribuido por toda Latinoamérica. La infraestructura para
          desarrollarlo, no.
        </motion.p>

        {/* Three problem cards */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
          gap: '1.5rem',
          marginBottom: '3rem',
        }}>
          {problems.map((problem, i) => (
            <motion.div
              key={problem.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-50px' }}
              transition={{ duration: 0.5, delay: i * 0.12 }}
              style={{
                background: 'white',
                borderRadius: 20,
                border: '1px solid var(--color-border)',
                borderTop: `3px solid ${problem.borderColor}`,
                padding: '2.5rem 2rem',
              }}
            >
              <div style={{
                width: 48,
                height: 48,
                borderRadius: 12,
                background: problem.bg,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginBottom: '1.25rem',
              }}>
                <problem.icon size={24} strokeWidth={1.5} color={problem.color} />
              </div>
              <h3 style={{
                fontFamily: 'var(--font-heading)',
                fontSize: '1.25rem',
                fontWeight: 700,
                lineHeight: 1.2,
                letterSpacing: '-0.01em',
                color: 'var(--color-text-primary)',
                marginBottom: '1rem',
              }}>
                {problem.title}
              </h3>
              <p style={{
                fontFamily: 'var(--font-body)',
                fontSize: '0.9375rem',
                lineHeight: 1.75,
                color: 'var(--color-text-secondary)',
              }}>
                {problem.description}
              </p>
            </motion.div>
          ))}
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
            padding: '2.5rem 2rem',
            textAlign: 'center',
            maxWidth: 840,
            margin: '0 auto',
          }}
        >
          <p style={{
            fontFamily: 'var(--font-body)',
            fontSize: '1.0625rem',
            lineHeight: 1.75,
            color: 'var(--color-text-secondary)',
          }}>
            Construimos una plataforma que atiende los tres lados del problema:{' '}
            <span style={{ fontWeight: 700, color: '#059669' }}>
              herramientas para founders, tecnología para organizaciones y datos para quienes diseñan políticas de innovación
            </span>.
          </p>
        </motion.div>
      </div>
    </section>
  )
}
