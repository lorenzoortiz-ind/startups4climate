'use client'

import { motion } from 'framer-motion'

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
          style={{ textAlign: 'center', marginBottom: '3.5rem' }}
        >
          <h2 style={{
            fontFamily: 'var(--font-heading)',
            fontSize: 'clamp(1.75rem, 3.5vw, 2.5rem)',
            fontWeight: 800,
            lineHeight: 1.15,
            letterSpacing: '-0.02em',
            color: 'var(--color-text-primary)',
          }}>
            El acceso define quién puede emprender
          </h2>
        </motion.div>

        {/* Two problem cards */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: '1fr',
          gap: '2rem',
          marginBottom: '3rem',
        }} className="lg:!grid-cols-2">
          {/* Card 1: El capital */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-50px' }}
            transition={{ duration: 0.5 }}
            style={{
              background: 'white',
              borderRadius: 20,
              border: '1px solid var(--color-border)',
              borderTop: '3px solid #DC2626',
              padding: '2.5rem 2rem',
            }}
          >
            <h3 style={{
              fontFamily: 'var(--font-heading)',
              fontSize: '1.5rem',
              fontWeight: 700,
              lineHeight: 1.2,
              letterSpacing: '-0.01em',
              color: 'var(--color-text-primary)',
              marginBottom: '1.25rem',
            }}>
              El capital
            </h3>
            <p style={{
              fontFamily: 'var(--font-body)',
              fontSize: '1rem',
              lineHeight: 1.75,
              color: 'var(--color-text-secondary)',
            }}>
              La inversión de venture capital existe a escala global, pero apenas el 2% llega a
              Latinoamérica. Los founders de la región enfrentan barreras estructurales para acceder
              a financiamiento que sus contrapartes en Silicon Valley simplemente no tienen: falta de
              redes, desconexión geográfica y ecosistemas de capital aún incipientes.
            </p>
          </motion.div>

          {/* Card 2: El conocimiento */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-50px' }}
            transition={{ duration: 0.5, delay: 0.15 }}
            style={{
              background: 'white',
              borderRadius: 20,
              border: '1px solid var(--color-border)',
              borderTop: '3px solid #D97706',
              padding: '2.5rem 2rem',
            }}
          >
            <h3 style={{
              fontFamily: 'var(--font-heading)',
              fontSize: '1.5rem',
              fontWeight: 700,
              lineHeight: 1.2,
              letterSpacing: '-0.01em',
              color: 'var(--color-text-primary)',
              marginBottom: '1.25rem',
            }}>
              El conocimiento
            </h3>
            <p style={{
              fontFamily: 'var(--font-body)',
              fontSize: '1rem',
              lineHeight: 1.75,
              color: 'var(--color-text-secondary)',
            }}>
              Las mejores metodologías, frameworks y herramientas para construir startups existen,
              pero están encerradas detrás de programas costosos, contenido exclusivamente en inglés
              o redes que dependen de la geografía. El talento está distribuido; el acceso al
              conocimiento, no.
            </p>
          </motion.div>
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
            Las incubadoras y aceleradoras hacen un trabajo fundamental, pero su capacidad es
            limitada. Millones de personas con ideas transformadoras quedan fuera. Esta plataforma
            existe para que{' '}
            <span style={{ fontWeight: 700, color: '#059669' }}>
              cualquier founder en Latinoamérica, con acceso a internet
            </span>
            , pueda desarrollar su startup con herramientas de clase mundial.
          </p>
        </motion.div>
      </div>

      {/* Responsive: stack columns on mobile */}
      <style>{`
        @media (max-width: 768px) {
          #problema > div:first-child {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </section>
  )
}
