'use client'

import { motion } from 'framer-motion'
import Image from 'next/image'

const founders = [
  {
    photo: '/eddie.png',
    name: 'Eddie Ajalcriña',
    role: 'Co-Founder & CEO',
    bio: 'Estrategia climática y desarrollo de negocio en Latam. Experiencia en blended finance y ecosistemas de innovación.',
    tags: ['Climate Strategy', 'Blended Finance', 'Business Dev'],
  },
  {
    photo: '/lorenzo.png',
    name: 'Lorenzo Ortiz',
    role: 'Co-Founder & CTO',
    bio: 'Tecnología, producto y diseño de plataformas. Background en ingeniería de software y deep tech.',
    tags: ['Product & Tech', 'Software Engineering', 'Deep Tech'],
  },
]

export default function AboutRedesignLab() {
  return (
    <section style={{ padding: '6rem 0', background: 'white' }}>
      <div style={{ maxWidth: 1100, margin: '0 auto', padding: '0 1.5rem' }}>
        <div
          style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '3.5rem', alignItems: 'center' }}
          className="lg:!grid-cols-[1fr_1fr]"
        >
          {/* Left — editorial content */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-50px' }}
            transition={{ duration: 0.5 }}
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
              marginBottom: '1.25rem',
            }}>
              Quiénes Somos
            </span>

            <h2 style={{
              fontFamily: 'var(--font-heading)',
              fontSize: 'clamp(1.75rem, 3.5vw, 2.25rem)',
              fontWeight: 800,
              lineHeight: 1.15,
              letterSpacing: '-0.02em',
              color: 'var(--color-text-primary)',
              marginBottom: '1.25rem',
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
              fontSize: '1.0625rem',
              lineHeight: 1.75,
              color: 'var(--color-text-secondary)',
              marginBottom: '1.5rem',
            }}>
              Diseñamos la infraestructura operativa que los fundadores de climate tech necesitan
              para dejar de improvisar con frameworks genéricos y concentrar toda su energía en
              escalar soluciones reales para el planeta.
            </p>

            <div style={{
              display: 'flex',
              flexWrap: 'wrap',
              gap: '0.5rem',
            }}>
              {['Climate Tech', 'Latam', 'Blended Finance', 'Deep Tech', 'Impact'].map(tag => (
                <span key={tag} style={{
                  padding: '0.25rem 0.75rem',
                  borderRadius: 9999,
                  background: 'rgba(26,26,26,0.06)',
                  border: '1px solid rgba(26,26,26,0.1)',
                  fontFamily: 'var(--font-mono)',
                  fontSize: '0.6875rem',
                  fontWeight: 600,
                  color: '#1A1A1A',
                  letterSpacing: '0.02em',
                }}>
                  {tag}
                </span>
              ))}
            </div>
          </motion.div>

          {/* Right — founder cards */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(2, 1fr)',
            gap: '1.25rem',
          }}>
            {founders.map((f, i) => (
              <motion.div
                key={f.name}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-30px' }}
                transition={{ duration: 0.4, delay: i * 0.12 }}
                style={{
                  background: 'var(--color-bg-primary)',
                  borderRadius: 16,
                  border: '1px solid var(--color-border)',
                  boxShadow: 'var(--shadow-card)',
                  padding: '1.75rem 1.25rem',
                  textAlign: 'center',
                }}
              >
                <div style={{
                  width: 72,
                  height: 72,
                  borderRadius: '50%',
                  overflow: 'hidden',
                  margin: '0 auto 1rem',
                  border: '3px solid rgba(229,0,18,0.15)',
                }}>
                  <Image
                    src={f.photo}
                    alt={f.name}
                    width={72}
                    height={72}
                    style={{ objectFit: 'cover', display: 'block', width: '100%', height: '100%' }}
                  />
                </div>
                <h3 style={{
                  fontFamily: 'var(--font-heading)',
                  fontSize: '1.0625rem',
                  fontWeight: 700,
                  color: 'var(--color-text-primary)',
                  marginBottom: '0.25rem',
                }}>
                  {f.name}
                </h3>
                <p style={{
                  fontFamily: 'var(--font-mono)',
                  fontSize: '0.6875rem',
                  color: '#E50012',
                  fontWeight: 600,
                  marginBottom: '0.625rem',
                  letterSpacing: '0.02em',
                }}>
                  {f.role}
                </p>
                <p style={{
                  fontFamily: 'var(--font-body)',
                  fontSize: '0.8125rem',
                  lineHeight: 1.6,
                  color: 'var(--color-text-secondary)',
                  marginBottom: '0.875rem',
                }}>
                  {f.bio}
                </p>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.375rem', justifyContent: 'center' }}>
                  {f.tags.map(tag => (
                    <span key={tag} style={{
                      padding: '0.15rem 0.5rem',
                      borderRadius: 6,
                      background: 'rgba(229,0,18,0.06)',
                      fontFamily: 'var(--font-mono)',
                      fontSize: '0.5625rem',
                      color: '#E50012',
                      fontWeight: 600,
                    }}>
                      {tag}
                    </span>
                  ))}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
