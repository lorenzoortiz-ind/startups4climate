'use client'

import { motion } from 'framer-motion'
import Image from 'next/image'

const founders = [
  {
    photo: '/eddie.png',
    name: 'Eddie Ajalcrina',
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

export default function AboutRedesignLab() {
  return (
    <section id="about" style={{ padding: '6rem 0', background: '#F7F8FA', overflow: 'hidden' }}>
      <div style={{ maxWidth: 1100, margin: '0 auto', padding: '0 2rem' }}>
        <div
          style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '4rem', alignItems: 'center' }}
          className="lg:!grid-cols-[1fr_1fr]"
        >
          {/* Left -- editorial content */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-50px' }}
            transition={{ duration: 0.5 }}
          >
            <span style={{
              display: 'inline-block',
              padding: '0.35rem 1rem',
              borderRadius: 9999,
              background: 'rgba(5,150,105,0.06)',
              border: '1px solid rgba(5,150,105,0.12)',
              fontFamily: 'var(--font-body)',
              fontSize: '0.8125rem',
              fontWeight: 600,
              color: '#059669',
              letterSpacing: '0.03em',
              textTransform: 'uppercase',
              marginBottom: '1.5rem',
            }}>
              Quiénes somos
            </span>

            <h2 style={{
              fontFamily: 'var(--font-heading)',
              fontSize: 'clamp(2rem, 4vw, 2.75rem)',
              fontWeight: 800,
              lineHeight: 1.1,
              letterSpacing: '-0.03em',
              color: 'var(--color-text-primary)',
              marginBottom: '1.5rem',
            }}>
              Creado por{' '}
              <span style={{
                background: 'linear-gradient(135deg, #1A1A1A, #E50012)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
              }}>
                Redesign Lab
              </span>
            </h2>

            <p style={{
              fontFamily: 'var(--font-body)',
              fontSize: 'clamp(1rem, 1.5vw, 1.125rem)',
              lineHeight: 1.75,
              color: 'var(--color-text-secondary)',
              marginBottom: '1.5rem',
            }}>
              Construimos la infraestructura operativa que los founders necesitan para dejar de
              improvisar y enfocarse en lo que importa: crear soluciones que transformen la región.
            </p>
          </motion.div>

          {/* Right -- founder cards */}
          <div className="about-founder-cards" style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(2, 1fr)',
            gap: '1.5rem',
          }}>
            {founders.map((f, i) => (
              <motion.div
                key={f.name}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-30px' }}
                transition={{ duration: 0.4, delay: i * 0.12 }}
                whileHover={{ y: -4, boxShadow: '0 12px 40px rgba(0,0,0,0.08)' }}
                style={{
                  background: 'white',
                  borderRadius: 24,
                  border: '1px solid rgba(0,0,0,0.06)',
                  boxShadow: '0 2px 12px rgba(0,0,0,0.04)',
                  padding: '2.25rem 1.5rem',
                  textAlign: 'center',
                  transition: 'transform 0.3s ease-out, box-shadow 0.3s ease-out',
                  cursor: 'default',
                }}
              >
                <div style={{
                  width: 80,
                  height: 80,
                  borderRadius: '50%',
                  overflow: 'hidden',
                  margin: '0 auto 1.25rem',
                  border: '3px solid rgba(229,0,18,0.12)',
                  boxShadow: '0 4px 16px rgba(229,0,18,0.08)',
                }}>
                  <Image
                    src={f.photo}
                    alt={f.name}
                    width={80}
                    height={80}
                    style={{ objectFit: 'cover', display: 'block', width: '100%', height: '100%' }}
                  />
                </div>
                <h3 style={{
                  fontFamily: 'var(--font-heading)',
                  fontSize: '1.125rem',
                  fontWeight: 700,
                  color: 'var(--color-text-primary)',
                  marginBottom: '0.375rem',
                  letterSpacing: '-0.01em',
                }}>
                  {f.name}
                </h3>
                <p style={{
                  fontFamily: 'var(--font-mono)',
                  fontSize: '0.75rem',
                  color: '#E50012',
                  fontWeight: 600,
                  marginBottom: '0.75rem',
                  letterSpacing: '0.02em',
                }}>
                  {f.role}
                </p>
                <p style={{
                  fontFamily: 'var(--font-body)',
                  fontSize: '0.875rem',
                  lineHeight: 1.65,
                  color: 'var(--color-text-secondary)',
                  marginBottom: '1rem',
                }}>
                  {f.bio}
                </p>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem', justifyContent: 'center' }}>
                  {f.tags.map(tag => (
                    <span key={tag} style={{
                      padding: '0.2rem 0.625rem',
                      borderRadius: 8,
                      background: 'rgba(229,0,18,0.05)',
                      fontFamily: 'var(--font-mono)',
                      fontSize: '0.625rem',
                      color: '#E50012',
                      fontWeight: 600,
                      letterSpacing: '0.01em',
                    }}>
                      {tag}
                    </span>
                  ))}
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Partner logos marquee */}
        <div style={{
          marginTop: '4.5rem',
          paddingTop: '3rem',
          borderTop: '1px solid rgba(0,0,0,0.06)',
        }}>
          <p style={{
            fontFamily: 'var(--font-body)',
            fontSize: '0.8125rem',
            fontWeight: 600,
            color: 'var(--color-text-muted)',
            textTransform: 'uppercase',
            letterSpacing: '0.1em',
            textAlign: 'center',
            marginBottom: '1.75rem',
          }}>
            Alianzas y colaboraciones
          </p>

          <div style={{
            position: 'relative',
            overflow: 'hidden',
            maskImage: 'linear-gradient(to right, transparent, black 10%, black 90%, transparent)',
            WebkitMaskImage: 'linear-gradient(to right, transparent, black 10%, black 90%, transparent)',
          }}>
            <div
              className="partner-marquee"
              style={{
                display: 'flex',
                gap: '3.5rem',
                width: 'max-content',
                animation: 'marquee-scroll 30s linear infinite',
              }}
            >
              {/* Duplicate the list for seamless loop */}
              {[...partners, ...partners].map((name, i) => (
                <span
                  key={`${name}-${i}`}
                  className="partner-logo-item"
                  style={{
                    fontFamily: 'var(--font-heading)',
                    fontSize: '1.0625rem',
                    fontWeight: 700,
                    color: 'var(--color-text-primary)',
                    opacity: 0.3,
                    whiteSpace: 'nowrap',
                    cursor: 'default',
                    transition: 'opacity 0.3s ease',
                    letterSpacing: '-0.01em',
                  }}
                >
                  {name}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes marquee-scroll {
          0% {
            transform: translateX(0);
          }
          100% {
            transform: translateX(-50%);
          }
        }
        .partner-logo-item:hover {
          opacity: 0.85 !important;
        }
        @media (max-width: 640px) {
          .about-founder-cards {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </section>
  )
}
