'use client'

import { motion } from 'framer-motion'
import { AlertTriangle, TrendingDown, BarChart3, Wallet } from 'lucide-react'

const stats = [
  {
    icon: TrendingDown,
    metric: '2%',
    label: 'del venture capital global llega a Latinoamerica',
    color: '#DC2626',
  },
  {
    icon: AlertTriangle,
    metric: '90%',
    label: 'de las startups fracasan en sus primeros 3 anos',
    color: '#D97706',
  },
  {
    icon: Wallet,
    metric: '3 de 4',
    label: 'founders no tienen acceso a programas de incubacion',
    color: '#7C3AED',
  },
  {
    icon: BarChart3,
    metric: '$1B+',
    label: 'en inversion de impacto disponible pero inalcanzable',
    color: '#059669',
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
        {/* Two-problem layout */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: '1fr',
          gap: '3rem',
          marginBottom: '3.5rem',
        }} className="lg:!grid-cols-2">
          {/* Problem 1 */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-50px' }}
            transition={{ duration: 0.5 }}
            style={{
              background: 'white',
              borderRadius: 20,
              border: '1px solid var(--color-border)',
              borderTop: '4px solid #DC2626',
              padding: '2rem',
            }}
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
              Problema 1
            </span>
            <h2 style={{
              fontFamily: 'var(--font-heading)',
              fontSize: 'clamp(1.5rem, 3vw, 2rem)',
              fontWeight: 800,
              lineHeight: 1.15,
              letterSpacing: '-0.02em',
              color: 'var(--color-text-primary)',
              marginBottom: '1rem',
            }}>
              El capital de inversion existe — pero no llega a todos
            </h2>
            <p style={{
              fontFamily: 'var(--font-body)',
              fontSize: '1rem',
              lineHeight: 1.7,
              color: 'var(--color-text-secondary)',
              marginBottom: '1.25rem',
            }}>
              Latinoamerica recibe apenas el 2% del venture capital global. Miles de millones de dolares
              en inversion de impacto estan disponibles, pero las barreras estructurales — falta de
              redes, conocimiento y preparacion — impiden que lleguen a quienes mas los necesitan.
            </p>
            <div style={{
              display: 'flex',
              gap: '1.5rem',
              flexWrap: 'wrap',
            }}>
              <div>
                <div style={{ fontFamily: 'var(--font-mono)', fontSize: '1.75rem', fontWeight: 700, color: '#DC2626' }}>2%</div>
                <div style={{ fontFamily: 'var(--font-body)', fontSize: '0.75rem', color: 'var(--color-text-muted)' }}>del VC global va a LATAM</div>
              </div>
              <div>
                <div style={{ fontFamily: 'var(--font-mono)', fontSize: '1.75rem', fontWeight: 700, color: '#DC2626' }}>$1B+</div>
                <div style={{ fontFamily: 'var(--font-body)', fontSize: '0.75rem', color: 'var(--color-text-muted)' }}>disponible pero inalcanzable</div>
              </div>
            </div>
          </motion.div>

          {/* Problem 2 */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-50px' }}
            transition={{ duration: 0.5, delay: 0.15 }}
            style={{
              background: 'white',
              borderRadius: 20,
              border: '1px solid var(--color-border)',
              borderTop: '4px solid #D97706',
              padding: '2rem',
            }}
          >
            <span style={{
              display: 'inline-block',
              padding: '0.3rem 0.875rem',
              borderRadius: 9999,
              background: 'rgba(217,119,6,0.06)',
              border: '1px solid rgba(217,119,6,0.12)',
              fontFamily: 'var(--font-body)',
              fontSize: '0.75rem',
              fontWeight: 600,
              color: '#D97706',
              letterSpacing: '0.03em',
              textTransform: 'uppercase',
              marginBottom: '1rem',
            }}>
              Problema 2
            </span>
            <h2 style={{
              fontFamily: 'var(--font-heading)',
              fontSize: 'clamp(1.5rem, 3vw, 2rem)',
              fontWeight: 800,
              lineHeight: 1.15,
              letterSpacing: '-0.02em',
              color: 'var(--color-text-primary)',
              marginBottom: '1rem',
            }}>
              El conocimiento y las herramientas existen — pero no llegan a todos
            </h2>
            <p style={{
              fontFamily: 'var(--font-body)',
              fontSize: '1rem',
              lineHeight: 1.7,
              color: 'var(--color-text-secondary)',
              marginBottom: '1.25rem',
            }}>
              Las metodologias de emprendimiento mas efectivas del mundo existen en universidades como
              MIT y Stanford, pero estan encerradas detras de programas costosos, filtros de seleccion
              y barreras geograficas. El 90% de las startups fracasan — muchas por falta de estructura,
              no de talento.
            </p>
            <div style={{
              display: 'flex',
              gap: '1.5rem',
              flexWrap: 'wrap',
            }}>
              <div>
                <div style={{ fontFamily: 'var(--font-mono)', fontSize: '1.75rem', fontWeight: 700, color: '#D97706' }}>90%</div>
                <div style={{ fontFamily: 'var(--font-body)', fontSize: '0.75rem', color: 'var(--color-text-muted)' }}>de startups fracasan</div>
              </div>
              <div>
                <div style={{ fontFamily: 'var(--font-mono)', fontSize: '1.75rem', fontWeight: 700, color: '#D97706' }}>3 de 4</div>
                <div style={{ fontFamily: 'var(--font-body)', fontSize: '0.75rem', color: 'var(--color-text-muted)' }}>sin acceso a incubacion</div>
              </div>
            </div>
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
            padding: '2rem',
            textAlign: 'center',
            maxWidth: 800,
            margin: '0 auto 3.5rem',
          }}
        >
          <p style={{
            fontFamily: 'var(--font-body)',
            fontSize: '1.0625rem',
            lineHeight: 1.75,
            color: 'var(--color-text-secondary)',
          }}>
            Reconocemos el trabajo de incubadoras y aceleradoras, pero su alcance no es suficiente.
            La plataforma busca que{' '}
            <span style={{ fontWeight: 700, color: '#059669' }}>
              cualquier persona con acceso a internet
            </span>{' '}
            pueda crear y desarrollar su startup desde donde este.
          </p>
        </motion.div>

        {/* Stat cards */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
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
