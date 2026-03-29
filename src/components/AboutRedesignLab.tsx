'use client'

import { motion } from 'framer-motion'
import Image from 'next/image'

const founders = [
  {
    photo: '/eddie.png',
    name: 'Eddie Ajalcrina',
    role: 'Co-Founder & CEO',
    bio: 'Estrategia de impacto y desarrollo de negocio en Latam. Experiencia en ecosistemas de innovacion y conexion con capital.',
    tags: ['Impact Strategy', 'Business Dev', 'LATAM Ecosystems'],
  },
  {
    photo: '/lorenzo.png',
    name: 'Lorenzo Ortiz',
    role: 'Co-Founder & CTO',
    bio: 'Tecnologia, producto y diseno de nuevos negocios. Background en finanzas avanzadas, desarrollo tech y escalamiento de startups.',
    tags: ['Product Dev', 'Ops & Tech', 'Startup Tools'],
  },
]

const partners = ['BID', 'MIT', 'SingularityU', 'ClimateKIC', 'Wyss Academy', 'Union Europea', 'NESsT', 'CATAL1.5T', 'Stanford University']

const ease = [0.25, 0.1, 0.25, 1] as [number, number, number, number]

export default function AboutRedesignLab() {
  return (
    <section id="about" style={{ padding: 'clamp(5rem, 10vw, 10rem) 0', background: '#FAF8F5', overflow: 'hidden' }}>
      <div style={{ maxWidth: 1200, margin: '0 auto', padding: '0 clamp(1.5rem, 4vw, 5rem)' }}>
        <div
          style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '4rem', alignItems: 'center' }}
          className="lg:!grid-cols-[1fr_1fr]"
        >
          {/* Text left */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-80px' }}
            transition={{ duration: 0.6, ease }}
          >
            <span style={{
              display: 'inline-block',
              fontFamily: 'var(--font-body)',
              fontSize: '12px',
              fontWeight: 600,
              letterSpacing: '0.12em',
              textTransform: 'uppercase',
              color: '#93908C',
              marginBottom: '1.5rem',
            }}>
              Quienes somos
            </span>

            <h2 style={{
              fontFamily: 'var(--font-heading)',
              fontSize: 'clamp(2rem, 4vw, 2.75rem)',
              fontWeight: 400,
              lineHeight: 1.1,
              letterSpacing: '-0.02em',
              color: '#2A222B',
              marginBottom: '1.5rem',
            }}>
              Creado por{' '}
              <span style={{ color: '#FF6B4A' }}>
                Redesign Lab
              </span>
            </h2>

            <p style={{
              fontFamily: 'var(--font-body)',
              fontSize: 'clamp(1rem, 1.5vw, 1.125rem)',
              lineHeight: 1.75,
              color: '#5E5A60',
              marginBottom: '1.5rem',
            }}>
              Construimos la infraestructura operativa que los founders necesitan para dejar de
              improvisar y enfocarse en lo que importa: crear soluciones que transformen la region.
            </p>
          </motion.div>

          {/* Founder cards right */}
          <div className="about-founder-cards" style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(2, 1fr)',
            gap: '1.5rem',
          }}>
            {founders.map((f, i) => (
              <motion.div
                key={f.name}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-80px' }}
                transition={{ duration: 0.6, delay: i * 0.1, ease }}
                className="founder-card"
                style={{
                  background: 'white',
                  borderRadius: 12,
                  border: '1px solid #E8E4DF',
                  boxShadow: '0 1px 3px rgba(0,0,0,0.04), 0 6px 16px rgba(0,0,0,0.04)',
                  padding: '2.25rem 1.5rem',
                  textAlign: 'center',
                  transition: 'transform 0.3s ease, box-shadow 0.3s ease',
                  cursor: 'default',
                }}
              >
                <div style={{
                  width: 80,
                  height: 80,
                  borderRadius: '50%',
                  overflow: 'hidden',
                  margin: '0 auto 1.25rem',
                  border: '3px solid rgba(255,107,74,0.15)',
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
                  fontWeight: 400,
                  color: '#2A222B',
                  marginBottom: '0.375rem',
                  letterSpacing: '-0.02em',
                }}>
                  {f.name}
                </h3>
                <p style={{
                  fontFamily: 'var(--font-body)',
                  fontSize: '0.75rem',
                  color: '#FF6B4A',
                  fontWeight: 600,
                  marginBottom: '0.75rem',
                  letterSpacing: '0.02em',
                  textTransform: 'uppercase',
                }}>
                  {f.role}
                </p>
                <p style={{
                  fontFamily: 'var(--font-body)',
                  fontSize: '0.875rem',
                  lineHeight: 1.65,
                  color: '#5E5A60',
                  marginBottom: '1rem',
                }}>
                  {f.bio}
                </p>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem', justifyContent: 'center' }}>
                  {f.tags.map(tag => (
                    <span key={tag} style={{
                      padding: '0.2rem 0.625rem',
                      borderRadius: 8,
                      background: 'rgba(255,107,74,0.06)',
                      fontFamily: 'var(--font-body)',
                      fontSize: '0.625rem',
                      color: '#FF6B4A',
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

        {/* Partners marquee */}
        <div style={{
          marginTop: '4.5rem',
          paddingTop: '3rem',
          borderTop: '1px solid rgba(0,0,0,0.06)',
        }}>
          <p style={{
            fontFamily: 'var(--font-body)',
            fontSize: '12px',
            fontWeight: 600,
            color: '#93908C',
            textTransform: 'uppercase',
            letterSpacing: '0.12em',
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
              {[...partners, ...partners].map((name, i) => (
                <span
                  key={`${name}-${i}`}
                  className="partner-logo-item"
                  style={{
                    fontFamily: 'var(--font-body)',
                    fontSize: '1.0625rem',
                    fontWeight: 700,
                    color: '#2A222B',
                    opacity: 0.25,
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
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        .partner-logo-item:hover { opacity: 0.85 !important; }
        .founder-card:hover {
          transform: translateY(-4px) !important;
          box-shadow: 0 12px 40px rgba(0,0,0,0.08) !important;
        }
        @media (max-width: 640px) {
          .about-founder-cards { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </section>
  )
}
