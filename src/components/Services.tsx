'use client'

import { motion } from 'framer-motion'
import { ArrowRight, Package, Briefcase } from 'lucide-react'
import Link from 'next/link'

const categories = [
  {
    icon: Package,
    title: 'Productos digitales',
    color: '#059669',
    bg: 'rgba(5,150,105,0.04)',
    description: 'Modelos financieros, kits legales, bases de datos y plantillas listas para usar. Compra lo que necesitas y empieza hoy.',
    items: [
      'Modelos financieros avanzados',
      'Kits legales para deep tech',
      'Base de datos de +500 VCs climáticos',
      'Plantillas TEA y pitch deck',
    ],
    link: '/productos',
    linkText: 'Ver productos →',
  },
  {
    icon: Briefcase,
    title: 'Servicios profesionales',
    color: '#0891B2',
    bg: 'rgba(8,145,178,0.04)',
    description: 'Consultoría especializada para fundadores e inversores de climate tech. Desde sesiones estratégicas hasta advisory de alto nivel.',
    items: [
      'Para fundadores: pitch, financiamiento, go-to-market',
      'Para inversores: deal flow, DD scoring, portfolio monitoring',
      'CFO as a service para blended finance',
      'Diseño de proyectos para fondos internacionales',
    ],
    link: '/servicios',
    linkText: 'Ver servicios →',
  },
]

export default function Services() {
  return (
    <section id="servicios" style={{ padding: '6rem 0', background: 'white' }}>
      <div style={{ maxWidth: 1200, margin: '0 auto', padding: '0 1.5rem' }}>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-50px' }}
          transition={{ duration: 0.5 }}
          style={{ textAlign: 'center', maxWidth: 700, margin: '0 auto 3.5rem' }}
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
            Servicios
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
            Todo lo que necesitas para escalar tu climate tech
          </h2>
          <p style={{
            fontFamily: 'var(--font-body)',
            fontSize: '1.0625rem',
            lineHeight: 1.7,
            color: 'var(--color-text-secondary)',
          }}>
            Desde herramientas de autoservicio para avanzar por tu cuenta, hasta consultoría especializada a medida que tus rondas de financiamiento se vuelven más complejas.
          </p>
        </motion.div>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))',
          gap: '2rem',
          alignItems: 'stretch',
        }}>
          {categories.map((cat, i) => (
            <motion.div
              key={cat.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-30px' }}
              transition={{ duration: 0.4, delay: i * 0.15 }}
              style={{
                background: cat.bg,
                borderRadius: 20,
                border: `2px solid ${cat.color}20`,
                padding: '2.25rem',
                display: 'flex',
                flexDirection: 'column',
              }}
            >
              <div style={{
                width: 48,
                height: 48,
                borderRadius: 14,
                background: `${cat.color}12`,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginBottom: '1.25rem',
              }}>
                <cat.icon size={24} strokeWidth={1.5} color={cat.color} />
              </div>

              <h3 style={{
                fontFamily: 'var(--font-heading)',
                fontSize: '1.375rem',
                fontWeight: 700,
                color: 'var(--color-text-primary)',
                marginBottom: '0.75rem',
              }}>
                {cat.title}
              </h3>

              <p style={{
                fontFamily: 'var(--font-body)',
                fontSize: '0.9375rem',
                lineHeight: 1.65,
                color: 'var(--color-text-secondary)',
                marginBottom: '1.5rem',
              }}>
                {cat.description}
              </p>

              <ul style={{ listStyle: 'none', padding: 0, display: 'flex', flexDirection: 'column', gap: '0.75rem', flex: 1 }}>
                {cat.items.map(item => (
                  <li key={item} style={{ display: 'flex', alignItems: 'flex-start', gap: '0.5rem' }}>
                    <ArrowRight size={14} color={cat.color} style={{ marginTop: 4, flexShrink: 0 }} />
                    <span style={{ fontFamily: 'var(--font-body)', fontSize: '0.875rem', lineHeight: 1.55, color: 'var(--color-text-secondary)' }}>
                      {item}
                    </span>
                  </li>
                ))}
              </ul>

              <Link
                href={cat.link}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.375rem',
                  fontFamily: 'var(--font-body)',
                  fontSize: '0.9375rem',
                  fontWeight: 600,
                  color: cat.color,
                  textDecoration: 'none',
                  marginTop: '1.75rem',
                  transition: 'gap 0.2s ease',
                }}
              >
                {cat.linkText} <ArrowRight size={16} />
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
