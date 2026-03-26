'use client'

import { motion } from 'framer-motion'

const partners = ['IDB Lab', 'GIZ', 'CAF', 'UNEP', 'COP16', 'Horizonte Europa']

export default function SocialProof() {
  return (
    <section style={{ padding: '3rem 0', borderBottom: '1px solid var(--color-border)', background: 'white' }}>
      <div style={{ maxWidth: 1200, margin: '0 auto', padding: '0 1.5rem' }}>
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          style={{ textAlign: 'center' }}
        >
          <p style={{
            fontFamily: 'var(--font-body)',
            fontSize: '0.75rem',
            fontWeight: 500,
            color: 'var(--color-text-muted)',
            textTransform: 'uppercase',
            letterSpacing: '0.1em',
            marginBottom: '1.5rem',
          }}>
            Herramientas validadas por el ecosistema climático de Latam
          </p>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexWrap: 'wrap',
            gap: '2rem',
          }}>
            {partners.map((name, i) => (
              <motion.span
                key={name}
                initial={{ opacity: 0, y: 8 }}
                whileInView={{ opacity: 0.6, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: i * 0.08 }}
                whileHover={{ opacity: 1, scale: 1.05 }}
                style={{
                  fontFamily: 'var(--font-heading)',
                  fontSize: '0.9375rem',
                  fontWeight: 600,
                  color: 'var(--color-text-muted)',
                  cursor: 'default',
                }}
              >
                {name}
              </motion.span>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  )
}
