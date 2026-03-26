'use client'

import { motion } from 'framer-motion'
import { ArrowRight, CheckCircle2, MessageCircle } from 'lucide-react'

const benefits = [
  'Pipeline cualificado de startups climáticas por TRL y vertical',
  'Datos estructurados: cap table, ERP, modelo financiero y data room listos',
  'Reducción del 60% en tiempo de due diligence técnico y ESG',
  'Acceso a deal flow de proyectos con offtakes pre-negociados',
  'Métricas climate-native: green premium, TRL, bankability score',
]

export default function ForInvestors() {
  return (
    <section id="inversores" style={{ padding: '6rem 0', background: 'var(--color-bg-primary)' }}>
      <div style={{ maxWidth: 720, margin: '0 auto', padding: '0 1.5rem' }}>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-50px' }}
          transition={{ duration: 0.5 }}
          style={{ textAlign: 'center' }}
        >
          <span style={{
            display: 'inline-block',
            padding: '0.3rem 0.875rem',
            borderRadius: 9999,
            background: 'rgba(8,145,178,0.06)',
            border: '1px solid rgba(8,145,178,0.12)',
            fontFamily: 'var(--font-body)',
            fontSize: '0.75rem',
            fontWeight: 600,
            color: '#0891B2',
            letterSpacing: '0.03em',
            textTransform: 'uppercase',
            marginBottom: '1rem',
          }}>
            Para Inversores
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
            Deal flow estructurado y listo para due diligence
          </h2>
          <p style={{
            fontFamily: 'var(--font-body)',
            fontSize: '1.0625rem',
            lineHeight: 1.7,
            color: 'var(--color-text-secondary)',
            marginBottom: '2rem',
          }}>
            Las startups que superan nuestro diagnóstico llegan a tu comité de inversión hablando tu idioma: con data institucional, métricas de impacto claras y readiness financiero validado.
          </p>
        </motion.div>

        <motion.ul
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-30px' }}
          transition={{ duration: 0.4, delay: 0.1 }}
          style={{ listStyle: 'none', padding: 0, display: 'flex', flexDirection: 'column', gap: '0.75rem', marginBottom: '2.5rem' }}
        >
          {benefits.map(b => (
            <li key={b} style={{ display: 'flex', alignItems: 'flex-start', gap: '0.75rem' }}>
              <CheckCircle2 size={18} color="#059669" style={{ marginTop: 2, flexShrink: 0 }} />
              <span style={{ fontFamily: 'var(--font-body)', fontSize: '0.9375rem', lineHeight: 1.55, color: 'var(--color-text-secondary)' }}>
                {b}
              </span>
            </li>
          ))}
        </motion.ul>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-30px' }}
          transition={{ duration: 0.4, delay: 0.2 }}
          style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem', justifyContent: 'center' }}
        >
          <a
            href="mailto:hello@redesignlab.org"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.5rem',
              padding: '0.875rem 2rem',
              borderRadius: 9999,
              background: '#0891B2',
              color: 'white',
              fontFamily: 'var(--font-body)',
              fontSize: '0.9375rem',
              fontWeight: 600,
              textDecoration: 'none',
              boxShadow: '0 4px 16px rgba(8,145,178,0.25)',
            }}
          >
            Acceder al deal flow <ArrowRight size={18} />
          </a>
          <a
            href="https://wa.me/51989338401"
            target="_blank"
            rel="noopener noreferrer"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.5rem',
              padding: '0.875rem 2rem',
              borderRadius: 9999,
              background: 'white',
              color: '#0891B2',
              fontFamily: 'var(--font-body)',
              fontSize: '0.9375rem',
              fontWeight: 600,
              textDecoration: 'none',
              border: '1px solid rgba(8,145,178,0.25)',
            }}
          >
            <MessageCircle size={18} /> WhatsApp
          </a>
        </motion.div>
      </div>
    </section>
  )
}
