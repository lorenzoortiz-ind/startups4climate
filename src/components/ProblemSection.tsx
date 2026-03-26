'use client'

import { motion } from 'framer-motion'
import { AlertTriangle, TrendingDown, BarChart3, Wallet } from 'lucide-react'

const problems = [
  {
    icon: AlertTriangle,
    title: 'Aceleradoras que no entienden hard-tech',
    subtitle: 'Diseñadas para SaaS, no para tu realidad',
    description: 'Las aceleradoras tradicionales aplican plantillas de software a startups que necesitan años de I+D y CAPEX intensivo. Tu tecnología climática merece un enfoque especializado.',
  },
  {
    icon: TrendingDown,
    title: 'El Valle de la Muerte financiero',
    subtitle: 'Demasiado grande para VC, muy riesgoso para bancos',
    description: 'Tu primera planta comercial necesita millones que el VC no cubre, pero los bancos no financian riesgo técnico. Es en este limbo donde mueren las mejores tecnologías climáticas.',
  },
  {
    icon: BarChart3,
    title: 'Latam capta solo el 6% del capital climático',
    subtitle: '+$2T globales, pero casi nada llega aquí',
    description: 'El financiamiento climático global supera los $2 billones, pero Latinoamérica recibe una fracción mínima. Las startups compiten sin las métricas ni el lenguaje que los fondos exigen.',
  },
  {
    icon: Wallet,
    title: 'El rompecabezas del Climate Capital Stack',
    subtitle: 'Grants + Equity + Deuda + Project Finance',
    description: 'Levantar una ronda de equity es solo el inicio. El verdadero reto es orquestar grants, venture capital, deuda y financiamiento de proyectos sin diluirte en el proceso.',
  },
]

export default function ProblemSection() {
  return (
    <section id="problema" style={{ padding: '6rem 0', background: 'var(--color-bg-primary)' }}>
      <div style={{ maxWidth: 1200, margin: '0 auto', padding: '0 1.5rem' }}>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-50px' }}
          transition={{ duration: 0.5 }}
          style={{ maxWidth: 640, marginBottom: '3.5rem' }}
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
            1,200+ startups climáticas en Latam. La mayoría no sobrevive el escalamiento.
          </h2>
          <p style={{
            fontFamily: 'var(--font-body)',
            fontSize: '1.0625rem',
            lineHeight: 1.7,
            color: 'var(--color-text-secondary)',
          }}>
            El ecosistema de apoyo no fue diseñado para deep tech ni infraestructura climática. Las barreras son estructurales y el capital disponible exige un nivel de preparación que pocos alcanzan solos.
          </p>
        </motion.div>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
          gap: '1.25rem',
        }}>
          {problems.map((problem, i) => (
            <motion.div
              key={problem.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-30px' }}
              transition={{ duration: 0.4, delay: i * 0.1 }}
              whileHover={{ y: -3, boxShadow: '0 4px 20px rgba(0,0,0,0.08)' }}
              style={{
                background: 'white',
                borderRadius: 16,
                border: '1px solid var(--color-border)',
                padding: '1.75rem',
              }}
            >
              <div style={{
                width: 44,
                height: 44,
                borderRadius: 12,
                background: 'rgba(220,38,38,0.06)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginBottom: '1rem',
              }}>
                <problem.icon size={22} strokeWidth={1.5} color="#DC2626" />
              </div>
              <h3 style={{
                fontFamily: 'var(--font-heading)',
                fontSize: '1.0625rem',
                fontWeight: 700,
                color: 'var(--color-text-primary)',
                marginBottom: '0.25rem',
              }}>
                {problem.title}
              </h3>
              <p style={{
                fontFamily: 'var(--font-mono)',
                fontSize: '0.75rem',
                color: '#DC2626',
                fontWeight: 500,
                marginBottom: '0.75rem',
              }}>
                {problem.subtitle}
              </p>
              <p style={{
                fontFamily: 'var(--font-body)',
                fontSize: '0.875rem',
                lineHeight: 1.65,
                color: 'var(--color-text-secondary)',
              }}>
                {problem.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
