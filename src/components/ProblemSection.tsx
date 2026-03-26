'use client'

import { motion } from 'framer-motion'
import { AlertTriangle, TrendingDown, BarChart3, Wallet } from 'lucide-react'

const stats = [
  {
    icon: TrendingDown,
    metric: '6%',
    label: 'del capital climático global llega a Latam',
    color: '#DC2626',
  },
  {
    icon: AlertTriangle,
    metric: '1,200+',
    label: 'startups climáticas en Latam sin soporte adecuado',
    color: '#D97706',
  },
  {
    icon: Wallet,
    metric: '$2T+',
    label: 'en financiamiento climático global disponible',
    color: '#059669',
  },
  {
    icon: BarChart3,
    metric: '70%',
    label: 'no sobrevive el valle de la muerte financiero',
    color: '#7C3AED',
  },
]

export default function ProblemSection() {
  return (
    <section id="problema" style={{ padding: '6rem 0', background: 'var(--color-bg-primary)' }}>
      <div style={{
        maxWidth: 1200,
        margin: '0 auto',
        padding: '0 1.5rem',
        display: 'grid',
        gridTemplateColumns: '2fr 3fr',
        gap: '3rem',
        alignItems: 'start',
      }}>
        {/* Left column — header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-50px' }}
          transition={{ duration: 0.5 }}
          style={{ position: 'sticky', top: '6rem' }}
        >
          <span style={{
            display: 'inline-block',
            padding: '0.3rem 0.875rem',
            borderRadius: 9999,
            background: 'rgba(220,38,38,0.06)',
            border: '1px solid rgba(220,38,38,0.12)',
            fontFamily: 'var(--font-body)',
            fontSize: '0.75rem',
            fontWeight: 600,
            color: '#DC2626',
            letterSpacing: '0.03em',
            textTransform: 'uppercase',
            marginBottom: '1rem',
          }}>
            El Problema
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
            El capital climático existe. Pero no llega a Latam.
          </h2>
          <p style={{
            fontFamily: 'var(--font-body)',
            fontSize: '1.0625rem',
            lineHeight: 1.7,
            color: 'var(--color-text-secondary)',
          }}>
            Las barreras son estructurales: ecosistema fragmentado, capital mal distribuido y startups sin el soporte que necesitan para escalar.
          </p>
        </motion.div>

        {/* Right column — stat grid */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(2, 1fr)',
          gap: '1.25rem',
        }}>
          {stats.map((stat, i) => (
            <motion.div
              key={stat.metric}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-30px' }}
              transition={{ duration: 0.4, delay: i * 0.1 }}
              whileHover={{ y: -3, boxShadow: '0 4px 20px rgba(0,0,0,0.08)' }}
              style={{
                background: 'white',
                borderRadius: 16,
                border: '1px solid var(--color-border)',
                borderTop: `3px solid ${stat.color}`,
                padding: '1.5rem',
                display: 'flex',
                flexDirection: 'column',
                gap: '0.75rem',
              }}
            >
              <div style={{
                width: 40,
                height: 40,
                borderRadius: 10,
                background: `${stat.color}0F`,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}>
                <stat.icon size={20} strokeWidth={1.5} color={stat.color} />
              </div>
              <span style={{
                fontFamily: 'var(--font-mono)',
                fontSize: 'clamp(1.75rem, 3vw, 2.25rem)',
                fontWeight: 700,
                lineHeight: 1,
                color: stat.color,
                letterSpacing: '-0.02em',
              }}>
                {stat.metric}
              </span>
              <span style={{
                fontFamily: 'var(--font-body)',
                fontSize: '0.875rem',
                lineHeight: 1.45,
                color: 'var(--color-text-secondary)',
              }}>
                {stat.label}
              </span>
            </motion.div>
          ))}
        </div>
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
