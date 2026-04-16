'use client'

import { motion } from 'framer-motion'
import Image from 'next/image'

const founders = [
  {
    photo: '/eddie.png',
    name: 'Eddie Ajalcriña',
    role: 'Co-Founder & CEO',
    bio: 'Estrategia de impacto y desarrollo de negocio en Latam. Experiencia en ecosistemas de innovación y conexión con capital.',
    tags: ['Impact Strategy', 'Business Dev', 'LATAM Ecosystems'],
  },
  {
    photo: '/lorenzo.png',
    name: 'Lorenzo Ortiz',
    role: 'Co-Founder & CTO',
    bio: 'Tecnología, producto y diseño de nuevos negocios. Background en finanzas avanzadas, desarrollo tech y escalamiento de startups.',
    tags: ['Product Dev', 'Ops & Tech', 'Startup Tools'],
  },
]

const partners = ['BID', 'MIT', 'SingularityU', 'ClimateKIC', 'Wyss Academy', 'Unión Europea', 'NESsT', 'CATAL1.5°T', 'Stanford University']

const springReveal = {
  initial: { opacity: 0, y: 60 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: '-100px' },
  transition: { type: 'spring', damping: 20, stiffness: 100 } as any,
}

export default function AboutRedesignLab() {
  return (
    <section
      id="about"
      style={{
        padding: 'clamp(3rem, 6vw, 6rem) 0',
        background: 'var(--color-bg-primary)',
        overflow: 'hidden',
        borderTop: '1px solid var(--color-border)',
      }}
    >
      <div style={{ maxWidth: 'var(--container-max)', margin: '0 auto', padding: '0 var(--container-px)' }}>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '5rem' }}>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
            gap: '4rem',
            alignItems: 'start',
          }}>
            {/* Left Column */}
            <motion.div {...springReveal}>
              <span style={{
                display: 'inline-block',
                fontFamily: 'var(--font-body)',
                fontSize: '9.6px',
                fontWeight: 600,
                letterSpacing: '0.12em',
                textTransform: 'uppercase' as const,
                color: 'var(--color-text-secondary)',
                marginBottom: '1.5rem',
              }}>
                Quiénes somos
              </span>
              <h2 style={{
                fontFamily: 'var(--font-heading)',
                fontSize: 'var(--text-display-md)',
                fontWeight: 700,
                lineHeight: 1.1,
                letterSpacing: '-0.03em',
                color: 'var(--color-ink)',
                marginBottom: '1.5rem',
              }}>
                Creado por Re<span style={{ color: '#E63946' }}>.</span>design <span style={{ color: '#E63946' }}>Lab</span>
              </h2>
              <p style={{
                fontFamily: 'var(--font-body)',
                fontSize: 'var(--text-body-lg)',
                lineHeight: 1.6,
                color: 'var(--color-text-secondary)',
                maxWidth: 480,
              }}>
                Construimos la infraestructura operativa que los founders necesitan para dejar de improvisar y enfocarse en lo que importa: crear soluciones que transformen la región.
              </p>
            </motion.div>

            {/* Right Column: Founder Cards */}
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
              gap: '1.5rem',
            }}>
              {founders.map((f, i) => (
                <motion.div
                  key={f.name}
                  initial={{ opacity: 0, y: 60 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: '-100px' }}
                  transition={{ type: 'spring', damping: 20, stiffness: 100, delay: i * 0.1 }}
                  whileHover={{ y: -4, boxShadow: '0 12px 32px -8px rgba(0,0,0,0.5)' }}
                  style={{
                    background: 'var(--color-paper)',
                    borderRadius: 'var(--radius-lg)',
                    border: '1px solid var(--color-border)',
                    padding: '2.5rem 1.5rem',
                    textAlign: 'center',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    cursor: 'default',
                    transition: 'box-shadow 0.2s var(--ease-smooth)',
                  }}
                >
                  <div style={{
                    width: 72,
                    height: 72,
                    borderRadius: 'var(--radius-full)',
                    background: 'var(--color-border)',
                    overflow: 'hidden',
                    marginBottom: '1.5rem',
                    flexShrink: 0,
                  }}>
                    <Image
                      src={f.photo}
                      alt={f.name}
                      width={72}
                      height={72}
                      style={{ objectFit: 'cover', width: '100%', height: '100%' }}
                    />
                  </div>
                  <h3 style={{
                    fontFamily: 'var(--font-heading)',
                    fontSize: 'var(--text-heading-md)',
                    fontWeight: 700,
                    color: 'var(--color-ink)',
                    marginBottom: '0.25rem',
                    letterSpacing: '-0.01em',
                  }}>
                    {f.name}
                  </h3>
                  <p style={{
                    fontFamily: 'var(--font-body)',
                    fontSize: '0.6rem',
                    fontWeight: 600,
                    textTransform: 'uppercase' as const,
                    letterSpacing: '0.05em',
                    color: 'var(--color-text-secondary)',
                    marginBottom: '1rem',
                  }}>
                    {f.role}
                  </p>
                  <p style={{
                    fontFamily: 'var(--font-body)',
                    fontSize: 'var(--text-body)',
                    lineHeight: 1.6,
                    color: 'var(--color-text-secondary)',
                    marginBottom: '1.5rem',
                  }}>
                    {f.bio}
                  </p>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', justifyContent: 'center' }}>
                    {f.tags.map(tag => (
                      <span key={tag} style={{
                        padding: '0.25rem 0.75rem',
                        background: 'var(--color-bg-primary)',
                        border: '1px solid var(--color-border)',
                        borderRadius: 'var(--radius-full)',
                        fontFamily: 'var(--font-body)',
                        fontSize: '0.5rem',
                        fontWeight: 600,
                        color: 'var(--color-ink)',
                        letterSpacing: '0.02em',
                        textTransform: 'uppercase' as const,
                      }}>
                        {tag}
                      </span>
                    ))}
                  </div>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Marquee partners */}
          <div style={{
            paddingTop: '3rem',
            borderTop: '1px solid var(--color-border)',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '2rem',
          }}>
            <span style={{
              fontFamily: 'var(--font-body)',
              fontSize: '8.8px',
              fontWeight: 600,
              textTransform: 'uppercase' as const,
              letterSpacing: '0.12em',
              color: 'var(--color-text-secondary)',
            }}>
              Alianzas que respaldan nuestra metodología
            </span>
            <div style={{
              width: '100%',
              overflow: 'hidden',
              maskImage: 'linear-gradient(to right, transparent, black 10%, black 90%, transparent)',
              WebkitMaskImage: 'linear-gradient(to right, transparent, black 10%, black 90%, transparent)',
            }}>
              <div
                style={{
                  display: 'flex',
                  gap: '4rem',
                  width: 'max-content',
                  animation: 'marquee-scroll 40s linear infinite',
                }}
              >
                {[...partners, ...partners, ...partners].map((name, i) => (
                  <span
                    key={`${name}-${i}`}
                    style={{
                      fontFamily: 'var(--font-heading)',
                      fontSize: 'var(--text-heading-md)',
                      fontWeight: 700,
                      color: 'var(--color-text-secondary)',
                      opacity: 0.4,
                      whiteSpace: 'nowrap',
                      letterSpacing: '-0.02em',
                    }}
                  >
                    {name}
                  </span>
                ))}
              </div>
            </div>
          </div>

        </div>
      </div>

      <style>{`
        @keyframes marquee-scroll {
          0% { transform: translateX(0); }
          100% { transform: translateX(-33.33%); }
        }
      `}</style>
    </section>
  )
}
