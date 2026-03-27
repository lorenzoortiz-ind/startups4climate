'use client'

import { motion } from 'framer-motion'

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
            fontSize: '0.9375rem',
            fontWeight: 500,
            color: 'var(--color-text-muted)',
            letterSpacing: '0.02em',
          }}>
            Construida para el ecosistema de startups de Latinoamérica
          </p>
        </motion.div>
      </div>
    </section>
  )
}
