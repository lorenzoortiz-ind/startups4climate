'use client'

import { motion } from 'framer-motion'
import {
  Presentation,
  Calculator,
  Rocket,
  ShieldCheck,
  Layers,
  CheckCircle2,
  ArrowRight,
  CalendarCheck,
} from 'lucide-react'
import type { LucideIcon } from 'lucide-react'

interface Service {
  icon: LucideIcon
  title: string
  description: string
  includes: string[]
  mailto: string
}

const services: Service[] = [
  {
    icon: Presentation,
    title: 'Diseno de Pitch Deck para Inversores Climaticos',
    description:
      'Disenamos pitch decks listos para inversores especializados en climate tech. Incluye narrativa estrategica, visualizacion de datos de impacto y proyecciones financieras alineadas con tesis climaticas.',
    includes: [
      'Narrativa y storytelling climatico',
      'Visualizacion de metricas de impacto y unit economics',
      'Proyecciones financieras a 5 anos con escenarios',
      'Diseno profesional listo para enviar',
    ],
    mailto: 'Pitch Deck para Inversores Climaticos',
  },
  {
    icon: Calculator,
    title: 'Modelacion Financiera y Unit Economics',
    description:
      'Modelos financieros a medida para startups de deep tech y hardware climatico. Analisis de escenarios, modelacion DSCR, y outputs listos para due diligence con inversores.',
    includes: [
      'Modelo financiero completo en Excel/Sheets',
      'Analisis de escenarios (base, optimista, conservador)',
      'Modelacion de DSCR y debt capacity',
      'Unit economics detallado con sensitivity analysis',
    ],
    mailto: 'Modelacion Financiera y Unit Economics',
  },
  {
    icon: Rocket,
    title: 'Estrategia de Go-to-Market Climatico',
    description:
      'Estrategia de entrada al mercado adaptada a climate tech en Latam. Desde customer discovery hasta estructuracion de pilotos, pricing y desarrollo de partnerships estrategicos.',
    includes: [
      'Customer discovery y segmentacion de mercado',
      'Estructuracion de pilotos B2B y offtake agreements',
      'Estrategia de pricing y revenue model',
      'Pipeline de partnerships y canales de distribucion',
    ],
    mailto: 'Estrategia de Go-to-Market Climatico',
  },
  {
    icon: ShieldCheck,
    title: 'Preparacion para Due Diligence',
    description:
      'Paquete completo de preparacion para DD: data room organizado, revision legal, auditoria de propiedad intelectual y documentacion tecnica lista para inversores.',
    includes: [
      'Estructuracion y poblacion del data room',
      'Revision legal y compliance check',
      'Auditoria de IP y documentacion de patentes',
      'Technical documentation y risk assessment',
    ],
    mailto: 'Preparacion para Due Diligence',
  },
  {
    icon: Layers,
    title: 'Diseno de Capital Stack y Fundraising',
    description:
      'Estrategia de blended finance: mapeo de grants, equity y deuda. Identificacion de inversores target, preparacion de pitch y acompanamiento en el proceso de fundraising.',
    includes: [
      'Mapeo de grants + equity + debt (blended finance)',
      'Identificacion y targeting de inversores climaticos',
      'Preparacion de pitch y materiales de fundraising',
      'Acompanamiento en negociaciones y term sheets',
    ],
    mailto: 'Diseno de Capital Stack y Fundraising',
  },
]

export default function ServicesDetail() {
  return (
    <section
      id="servicios-detalle"
      style={{
        padding: '6rem 0',
        background: 'linear-gradient(180deg, var(--color-bg-primary) 0%, var(--color-bg-warm) 50%, var(--color-bg-primary) 100%)',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* Subtle decorative blob */}
      <div
        style={{
          position: 'absolute',
          top: '10%',
          right: '-5%',
          width: 400,
          height: 400,
          borderRadius: '50%',
          background: 'rgba(5,150,105,0.03)',
          filter: 'blur(80px)',
          pointerEvents: 'none',
        }}
      />

      <div style={{ maxWidth: 1200, margin: '0 auto', padding: '0 1.5rem', position: 'relative' }}>
        {/* Section header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-50px' }}
          transition={{ duration: 0.5 }}
          style={{ textAlign: 'center', maxWidth: 720, margin: '0 auto 4rem' }}
        >
          <span
            style={{
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
            }}
          >
            Servicios en Detalle
          </span>

          <h2
            style={{
              fontFamily: 'var(--font-heading)',
              fontSize: 'clamp(1.75rem, 3.5vw, 2.5rem)',
              fontWeight: 800,
              lineHeight: 1.15,
              letterSpacing: '-0.02em',
              color: 'var(--color-text-primary)',
              marginBottom: '1rem',
            }}
          >
            Todo lo que necesitas para levantar capital climatico
          </h2>

          <p
            style={{
              fontFamily: 'var(--font-body)',
              fontSize: '1.0625rem',
              lineHeight: 1.7,
              color: 'var(--color-text-secondary)',
            }}
          >
            Consultoria especializada para startups climate tech en Latam. Cada servicio esta
            disenado para acelerar tu camino al siguiente hito de financiamiento.
          </p>
        </motion.div>

        {/* Service cards */}
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '1.5rem',
          }}
        >
          {services.map((service, i) => {
            const Icon = service.icon
            const encodedSubject = encodeURIComponent(service.mailto)

            return (
              <motion.div
                key={service.title}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-40px' }}
                transition={{ duration: 0.45, delay: i * 0.08 }}
                style={{
                  display: 'grid',
                  gridTemplateColumns: '1fr',
                  background: 'var(--color-bg-card)',
                  borderRadius: 20,
                  border: '1px solid var(--color-border)',
                  padding: '2rem',
                  transition: 'box-shadow 0.3s ease, border-color 0.3s ease',
                }}
                whileHover={{
                  boxShadow: '0 4px 30px rgba(5,150,105,0.10)',
                  borderColor: 'rgba(5,150,105,0.25)',
                }}
              >
                <div
                  style={{
                    display: 'grid',
                    gridTemplateColumns: '1fr',
                    gap: '1.5rem',
                  }}
                >
                  {/* Top row: icon + title + description */}
                  <div
                    style={{
                      display: 'grid',
                      gridTemplateColumns: 'auto 1fr',
                      gap: '1.25rem',
                      alignItems: 'start',
                    }}
                  >
                    <div
                      style={{
                        width: 52,
                        height: 52,
                        borderRadius: 14,
                        background: 'rgba(5,150,105,0.06)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        flexShrink: 0,
                      }}
                    >
                      <Icon size={26} strokeWidth={1.5} color="#059669" />
                    </div>

                    <div>
                      <h3
                        style={{
                          fontFamily: 'var(--font-heading)',
                          fontSize: '1.1875rem',
                          fontWeight: 700,
                          color: 'var(--color-text-primary)',
                          lineHeight: 1.3,
                          marginBottom: '0.5rem',
                        }}
                      >
                        {service.title}
                      </h3>
                      <p
                        style={{
                          fontFamily: 'var(--font-body)',
                          fontSize: '0.9375rem',
                          lineHeight: 1.65,
                          color: 'var(--color-text-secondary)',
                          marginBottom: '1rem',
                        }}
                      >
                        {service.description}
                      </p>

                      {/* Includes list */}
                      <ul
                        style={{
                          listStyle: 'none',
                          padding: 0,
                          margin: 0,
                          display: 'grid',
                          gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
                          gap: '0.5rem',
                        }}
                      >
                        {service.includes.map((item) => (
                          <li
                            key={item}
                            style={{
                              display: 'flex',
                              alignItems: 'flex-start',
                              gap: '0.5rem',
                            }}
                          >
                            <CheckCircle2
                              size={16}
                              strokeWidth={2}
                              color="#059669"
                              style={{ marginTop: 3, flexShrink: 0 }}
                            />
                            <span
                              style={{
                                fontFamily: 'var(--font-body)',
                                fontSize: '0.8125rem',
                                lineHeight: 1.5,
                                color: 'var(--color-text-secondary)',
                              }}
                            >
                              {item}
                            </span>
                          </li>
                        ))}
                      </ul>

                      {/* CTA */}
                      <div style={{ marginTop: '1.25rem' }}>
                        <a
                          href={`mailto:hello@redesignlab.co?subject=${encodedSubject}`}
                          style={{
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '0.375rem',
                            padding: '0.625rem 1.25rem',
                            borderRadius: 10,
                            background: 'rgba(5,150,105,0.06)',
                            color: '#059669',
                            fontFamily: 'var(--font-body)',
                            fontSize: '0.8125rem',
                            fontWeight: 600,
                            textDecoration: 'none',
                            border: '1px solid rgba(5,150,105,0.15)',
                            transition: 'all 0.2s ease',
                          }}
                        >
                          Solicitar este servicio
                          <ArrowRight size={14} strokeWidth={2} />
                        </a>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            )
          })}
        </div>

        {/* General CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-30px' }}
          transition={{ duration: 0.5, delay: 0.2 }}
          style={{
            textAlign: 'center',
            marginTop: '3.5rem',
          }}
        >
          <p
            style={{
              fontFamily: 'var(--font-body)',
              fontSize: '1rem',
              lineHeight: 1.6,
              color: 'var(--color-text-secondary)',
              marginBottom: '1.25rem',
            }}
          >
            No sabes por donde empezar? Agenda una llamada y disenamos un plan a tu medida.
          </p>

          <a
            href="https://calendly.com/redesignlab"
            target="_blank"
            rel="noopener noreferrer"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.5rem',
              padding: '0.875rem 2rem',
              borderRadius: 12,
              background: '#059669',
              color: 'white',
              fontFamily: 'var(--font-body)',
              fontSize: '0.9375rem',
              fontWeight: 600,
              textDecoration: 'none',
              transition: 'all 0.2s ease',
              boxShadow: '0 4px 20px rgba(5,150,105,0.25)',
            }}
          >
            <CalendarCheck size={18} strokeWidth={2} />
            Agenda una llamada
          </a>
        </motion.div>
      </div>
    </section>
  )
}
