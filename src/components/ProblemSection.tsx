'use client'

import { motion } from 'framer-motion'
import { UserX, Laptop, BarChart3 } from 'lucide-react'

const problems = [
  {
    icon: UserX,
    title: 'Founders sin infraestructura',
    description:
      'Hay talento sobrado en LATAM para construir startups de impacto. Lo que falta son herramientas estructuradas y acompanamiento accesible.',
    accentColor: '#FF6B4A',
    iconBg: 'rgba(255,107,74,0.08)',
  },
  {
    icon: Laptop,
    title: 'Incubadoras sin tecnologia',
    description:
      'Muchas gestionan cohortes con hojas de calculo y correos. Sin visibilidad real del progreso, el acompanamiento pierde precision y escala.',
    accentColor: '#0D9488',
    iconBg: 'rgba(13,148,136,0.08)',
  },
  {
    icon: BarChart3,
    title: 'Gobiernos sin visibilidad',
    description:
      'Los programas de innovacion canalizan recursos importantes, pero carecen de herramientas para medir impacto real y mejorar politicas.',
    accentColor: '#2A222B',
    iconBg: 'rgba(42,34,43,0.06)',
  },
]

const ease = [0.25, 0.1, 0.25, 1] as [number, number, number, number]

export default function ProblemSection() {
  return (
    <section
      id="problema"
      style={{
        padding: 'clamp(5rem, 10vw, 10rem) 0',
        background: '#FAF8F5',
      }}
    >
      <div style={{ maxWidth: 1200, margin: '0 auto', padding: '0 clamp(1.5rem, 4vw, 5rem)' }}>
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.6, ease }}
          style={{ textAlign: 'center', marginBottom: 'clamp(3rem, 5vw, 5rem)' }}
        >
          <span
            style={{
              display: 'inline-block',
              fontFamily: 'var(--font-body)',
              fontSize: '12px',
              fontWeight: 600,
              letterSpacing: '0.12em',
              textTransform: 'uppercase',
              color: '#93908C',
              marginBottom: '1.25rem',
            }}
          >
            El problema
          </span>
          <h2
            style={{
              fontFamily: 'var(--font-heading)',
              fontSize: 'clamp(2rem, 4vw, 3rem)',
              fontWeight: 400,
              lineHeight: 1.1,
              letterSpacing: '-0.02em',
              color: '#2A222B',
              marginBottom: '1.25rem',
            }}
          >
            Tres brechas que frenan la innovacion en la region
          </h2>
          <p
            style={{
              fontFamily: 'var(--font-body)',
              fontSize: 'clamp(1rem, 1.5vw, 1.125rem)',
              lineHeight: 1.7,
              color: '#5E5A60',
              maxWidth: 620,
              margin: '0 auto',
            }}
          >
            Miles de founders en Latinoamerica tienen ideas brillantes.
            Lo que les falta es un ecosistema que los acompane desde el dia uno.
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
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-80px' }}
              transition={{ duration: 0.6, delay: i * 0.1, ease }}
              className="problem-card"
              style={{
                background: 'white',
                borderRadius: 12,
                border: '1px solid #E8E4DF',
                boxShadow: '0 1px 3px rgba(0,0,0,0.04), 0 6px 16px rgba(0,0,0,0.04)',
                padding: '2.25rem 2rem',
                display: 'flex',
                flexDirection: 'column',
                transition: 'transform 0.3s ease, box-shadow 0.3s ease',
                cursor: 'default',
              }}
            >
              <div
                style={{
                  width: 48,
                  height: 48,
                  borderRadius: 10,
                  background: problem.iconBg,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginBottom: '1.5rem',
                }}
              >
                <problem.icon size={24} strokeWidth={1.5} color={problem.accentColor} />
              </div>

              <h3
                style={{
                  fontFamily: 'var(--font-heading)',
                  fontSize: 'clamp(1.125rem, 1.5vw, 1.25rem)',
                  fontWeight: 400,
                  lineHeight: 1.25,
                  letterSpacing: '-0.02em',
                  color: '#2A222B',
                  marginBottom: '0.75rem',
                }}
              >
                {problem.title}
              </h3>

              <p
                style={{
                  fontFamily: 'var(--font-body)',
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
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.6, delay: 0.15, ease }}
          style={{
            textAlign: 'center',
            maxWidth: 660,
            margin: '0 auto',
            fontFamily: 'var(--font-body)',
            fontSize: 'clamp(1rem, 1.5vw, 1.0625rem)',
            lineHeight: 1.7,
            color: '#5E5A60',
          }}
        >
          Startups4Climate es una plataforma all-in-one que atiende estos tres frentes:{' '}
          <span style={{ fontWeight: 700, color: '#2A222B' }}>
            herramientas para founders, tecnologia para organizaciones y datos
            para politicas de innovacion
          </span>
          .
        </motion.p>
      </div>

      <style>{`
        .problem-card:hover {
          transform: translateY(-4px) !important;
          box-shadow: 0 12px 40px rgba(0,0,0,0.08) !important;
        }
      `}</style>
    </section>
  )
}
