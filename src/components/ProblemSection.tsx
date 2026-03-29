'use client'

import { motion } from 'framer-motion'
import { UserX, Laptop, BarChart3 } from 'lucide-react'

const problems = [
  {
    icon: UserX,
    title: 'Founders sin infraestructura',
    description:
      'Hay talento sobrado en LATAM para construir startups de impacto. Lo que falta son herramientas estructuradas y acompañamiento accesible.',
    accentColor: '#FF6B4A',
    iconBg: 'rgba(255,107,74,0.08)',
  },
  {
    icon: Laptop,
    title: 'Incubadoras sin tecnología',
    description:
      'Muchas gestionan cohortes con hojas de cálculo y correos. Sin visibilidad real del progreso, el acompañamiento pierde precisión y escala.',
    accentColor: '#0D9488',
    iconBg: 'rgba(13,148,136,0.08)',
  },
  {
    icon: BarChart3,
    title: 'Gobiernos sin visibilidad',
    description:
      'Los programas de innovación canalizan recursos importantes, pero carecen de herramientas para medir impacto real y mejorar políticas.',
    accentColor: '#2A222B',
    iconBg: 'rgba(42,34,43,0.06)',
  },
]

export default function ProblemSection() {
  return (
    <section
      id="problema"
      style={{
        padding: 'clamp(4rem, 8vw, 10rem) 0',
        background: '#FAF8F5',
      }}
    >
      <div style={{ maxWidth: 1200, margin: '0 auto', padding: '0 clamp(1.5rem, 4vw, 5rem)' }}>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-50px' }}
          transition={{ duration: 0.5, ease: 'easeOut' }}
          style={{ textAlign: 'center', marginBottom: 'clamp(3rem, 5vw, 5rem)' }}
        >
          <span
            style={{
              display: 'inline-block',
              fontSize: '0.8125rem',
              fontWeight: 600,
              letterSpacing: '0.1em',
              textTransform: 'uppercase' as const,
              color: '#93908C',
              marginBottom: '1.25rem',
            }}
          >
            El problema
          </span>
          <h2
            style={{
              fontSize: 'clamp(2rem, 4vw, 3rem)',
              fontWeight: 700,
              lineHeight: 1.1,
              letterSpacing: '-0.025em',
              color: '#2A222B',
              marginBottom: '1.25rem',
            }}
          >
            Tres brechas que frenan la innovación en la región
          </h2>
          <p
            style={{
              fontSize: 'clamp(1rem, 1.5vw, 1.125rem)',
              lineHeight: 1.7,
              color: '#5E5A60',
              maxWidth: 620,
              margin: '0 auto',
            }}
          >
            Miles de founders en Latinoamérica tienen ideas brillantes.
            Lo que les falta es un ecosistema que los acompañe desde el día uno.
          </p>
        </motion.div>

        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
            gap: '1.75rem',
            marginBottom: 'clamp(2.5rem, 4vw, 4rem)',
          }}
        >
          {problems.map((problem, i) => (
            <motion.div
              key={problem.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-50px' }}
              transition={{ duration: 0.45, delay: i * 0.1, ease: 'easeOut' }}
              whileHover={{
                y: -4,
                boxShadow: '0 12px 40px rgba(0,0,0,0.08)',
              }}
              style={{
                background: 'white',
                borderRadius: 16,
                border: '1px solid rgba(0,0,0,0.06)',
                boxShadow: '0 2px 8px rgba(0,0,0,0.04)',
                padding: '2.25rem 2rem',
                display: 'flex',
                flexDirection: 'column',
                transition: 'transform 0.3s ease, box-shadow 0.3s ease',
                cursor: 'default',
              }}
            >
              <div
                style={{
                  width: 52,
                  height: 52,
                  borderRadius: 12,
                  background: problem.iconBg,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginBottom: '1.5rem',
                }}
              >
                <problem.icon
                  size={24}
                  strokeWidth={1.5}
                  color={problem.accentColor}
                />
              </div>

              <h3
                style={{
                  fontSize: 'clamp(1.125rem, 1.5vw, 1.25rem)',
                  fontWeight: 700,
                  lineHeight: 1.25,
                  letterSpacing: '-0.01em',
                  color: '#2A222B',
                  marginBottom: '0.75rem',
                }}
              >
                {problem.title}
              </h3>

              <p
                style={{
                  fontSize: '0.9375rem',
                  lineHeight: 1.7,
                  color: '#5E5A60',
                  margin: 0,
                }}
              >
                {problem.description}
              </p>
            </motion.div>
          ))}
        </div>

        <motion.p
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-50px' }}
          transition={{ duration: 0.45, delay: 0.15 }}
          style={{
            textAlign: 'center',
            maxWidth: 660,
            margin: '0 auto',
            fontSize: 'clamp(1rem, 1.5vw, 1.0625rem)',
            lineHeight: 1.7,
            color: '#5E5A60',
          }}
        >
          Startups4Climate es una plataforma all-in-one que atiende estos tres frentes:{' '}
          <span style={{ fontWeight: 700, color: '#2A222B' }}>
            herramientas para founders, tecnología para organizaciones y datos
            para políticas de innovación
          </span>
          .
        </motion.p>
      </div>
    </section>
  )
}
