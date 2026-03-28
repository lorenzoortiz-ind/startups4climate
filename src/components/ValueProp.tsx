'use client'

import { motion } from 'framer-motion'

export default function ValueProp() {
  return (
    <section id="plataforma" style={{ padding: '5rem 0 3rem', background: 'white' }}>
      <div style={{ maxWidth: 1200, margin: '0 auto', padding: '0 1.5rem' }}>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-50px' }}
          transition={{ duration: 0.5 }}
          style={{ textAlign: 'center', maxWidth: 700, margin: '0 auto' }}
        >
          <span style={{
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
            textTransform: 'uppercase',
            marginBottom: '1rem',
          }}>
            La plataforma
          </span>
          <h2 style={{
            fontFamily: 'var(--font-heading)',
            fontSize: 'clamp(1.75rem, 3.5vw, 2.5rem)',
            fontWeight: 800,
            lineHeight: 1.15,
            letterSpacing: '-0.02em',
            color: 'var(--color-text-primary)',
            marginBottom: '1rem',
          }}>
            Un ecosistema completo para desarrollar tu startup
          </h2>
          <p style={{
            fontFamily: 'var(--font-body)',
            fontSize: '1.0625rem',
            lineHeight: 1.7,
            color: 'var(--color-text-secondary)',
          }}>
            La infraestructura que conecta herramientas, conocimiento,
            inteligencia artificial y oportunidades reales en un solo lugar.
          </p>
        </motion.div>
      </div>
    </section>
  )
}
