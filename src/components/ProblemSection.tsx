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
    iconBg: 'rgba(220,38,38,0.08)',
  },
  {
    icon: Laptop,
    title: 'Incubadoras sin tecnología',
    description:
      'Muchas gestionan cohortes con hojas de cálculo y correos. Sin visibilidad real del progreso, el acompañamiento pierde precisión y escala.',
    accentColor: '#D97706',
    iconBg: 'rgba(217,119,6,0.08)',
  },
  {
    icon: BarChart3,
    title: 'Gobiernos sin visibilidad',
    description:
      'Los programas de innovación canalizan recursos importantes, pero carecen de herramientas para medir impacto real y mejorar políticas.',
    accentColor: '#7C3AED',
    iconBg: 'rgba(124,58,237,0.08)',
  },
]

export default function ProblemSection() {
  return (
    <section
      id="problema"
      style={{
        padding: '6rem 0',
        background: '#f8f9fa',
      }}
    >
      <div style={{ maxWidth: 1200, margin: '0 auto', padding: '0 1.5rem' }}>
        {/* Section header */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-50px' }}
          transition={{ duration: 0.5 }}
          style={{ textAlign: 'center', marginBottom: '3.5rem' }}
        >
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
            Tres brechas que frenan la innovación en la región
          </h2>
          <p
            style={{
              fontFamily: 'var(--font-body)',
              fontSize: '1.0625rem',
              lineHeight: 1.7,
              color: 'var(--color-text-secondary)',
              maxWidth: 600,
              margin: '0 auto',
            }}
          >
            El talento emprendedor está distribuido por toda Latinoamérica.
            La infraestructura para desarrollarlo, no.
          </p>
        </motion.div>

        {/* 3-column grid */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
            gap: '1.5rem',
            marginBottom: '3rem',
          }}
        >
          {problems.map((problem, i) => (
            <motion.div
              key={problem.title}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-50px' }}
              transition={{ duration: 0.45, delay: i * 0.1 }}
              style={{
                background: 'white',
                borderRadius: 12,
                border: '1px solid var(--color-border)',
                boxShadow: 'var(--shadow-sm)',
                overflow: 'hidden',
                display: 'flex',
                flexDirection: 'column',
              }}
            >
              {/* Accent top line */}
              <div
                style={{
                  height: 3,
                  background: problem.accentColor,
                  borderRadius: '12px 12px 0 0',
                }}
              />

              <div style={{ padding: '1.75rem 1.5rem' }}>
                {/* Icon */}
                <div
                  style={{
                    width: 44,
                    height: 44,
                    borderRadius: 10,
                    background: problem.iconBg,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    marginBottom: '1.25rem',
                  }}
                >
                  <problem.icon
                    size={22}
                    strokeWidth={1.5}
                    color={problem.accentColor}
                  />
                </div>

                {/* Title */}
                <h3
                  style={{
                    fontFamily: 'var(--font-heading)',
                    fontSize: '1.125rem',
                    fontWeight: 700,
                    lineHeight: 1.25,
                    letterSpacing: '-0.01em',
                    color: 'var(--color-text-primary)',
                    marginBottom: '0.625rem',
                  }}
                >
                  {problem.title}
                </h3>

                {/* Description */}
                <p
                  style={{
                    fontFamily: 'var(--font-body)',
                    fontSize: '0.9375rem',
                    lineHeight: 1.65,
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
            maxWidth: 640,
            margin: '0 auto',
            fontFamily: 'var(--font-body)',
            fontSize: '1rem',
            lineHeight: 1.7,
            color: 'var(--color-text-secondary)',
          }}
        >
          Una plataforma que atiende los tres lados:{' '}
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
