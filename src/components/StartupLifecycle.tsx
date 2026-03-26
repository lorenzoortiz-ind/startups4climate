'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { FlaskConical, Rocket, Building2, ChevronRight } from 'lucide-react'

const stages = [
  {
    id: 'pre-incubacion',
    icon: FlaskConical,
    number: '01',
    title: 'Pre-incubación',
    subtitle: 'Del Laboratorio al Mercado',
    trl: 'TRL 1-4',
    focus: 'Validación de la ciencia y descubrimiento del cliente',
    color: '#7C3AED',
    bg: 'rgba(124,58,237,0.06)',
    borderColor: 'rgba(124,58,237,0.15)',
    tools: [
      { name: 'Calculadora TRL/CRL', desc: 'Framework de evaluación de madurez tecnológica y comercial basado en estándares NASA/Horizonte Europa' },
      { name: 'Climate Lean Canvas', desc: 'Modelo de negocio adaptado con bloques de impacto ambiental, LCA preliminar y riesgos regulatorios' },
      { name: 'Guía Lab-to-Market', desc: 'Manual de transferencia de tecnología, licencias IP y estructuración de spin-offs universitarias' },
      { name: 'Matriz de Stakeholders', desc: 'Mapeo de actores regulatorios, clientes B2B/B2G y tomadores de decisión corporativos' },
      { name: 'Auditoría de Equipo Fundador', desc: 'Evaluación de brechas entre perfiles científicos y comerciales para ser invertible' },
    ],
  },
  {
    id: 'incubacion',
    icon: Rocket,
    number: '02',
    title: 'Incubación',
    subtitle: 'Construcción del Negocio y Tracción',
    trl: 'TRL 4-7',
    focus: 'Construcción del modelo de negocio y unit economics',
    color: '#059669',
    bg: 'rgba(5,150,105,0.06)',
    borderColor: 'rgba(5,150,105,0.15)',
    tools: [
      { name: 'Matriz Modelos de Negocio Climáticos', desc: 'Guía interactiva: SaaS vs Licensing vs Hardware-as-a-Service (HaaS) — vende desempeño, no equipos' },
      { name: 'Calculadora Unit Economics & Green Premium', desc: 'Desglose de costos marginales y proyección de paridad de precios vs. alternativa fósil' },
      { name: 'Estimador ERP (Emisiones)', desc: 'Calculadora basada en IRIS+ y Project Frame para modelar reducción de megatoneladas de CO2eq' },
      { name: 'Framework Pilotos B2B & LOIs', desc: 'Plantillas legales para estructurar PoCs con KPIs que detonan Offtake Agreements automáticos' },
      { name: 'Pitch Deck "Science-to-Business"', desc: 'Plantilla diseñada para inversores climáticos: TEA, ruta de escalamiento, panorama regulatorio y ERP' },
    ],
  },
  {
    id: 'aceleracion',
    icon: Building2,
    number: '03',
    title: 'Aceleración',
    subtitle: 'Investment ready y primera planta',
    trl: 'TRL 7-9',
    focus: 'Preparación para inversión y estructuración de capital',
    color: '#D97706',
    bg: 'rgba(217,119,6,0.06)',
    borderColor: 'rgba(217,119,6,0.15)',
    tools: [
      { name: 'Simulador Cap Table Complejo', desc: 'Modelo Excel avanzado que simula la interacción de VC, grants y venture debt en múltiples rondas' },
      { name: 'Mapeador Climate Capital Stack', desc: 'Directorio de +500 VCs climáticos, CVCs, agencias gubernamentales y fondos de blended finance' },
      { name: 'Arquitectura Data Room Climático', desc: 'Índice de carpetas y checklists para Due Diligence ESG, técnico, LCA, FTO de patentes' },
      { name: 'Framework Bankability & Offtakes', desc: 'Plantillas de Advance Market Commitments con Fortune 500s — la llave de oro para la bancabilidad' },
      { name: 'Reverse Due Diligence', desc: 'Tablero para evaluar la paciencia del capital, tesis ESG y valor agregado de cada fondo inversor' },
    ],
  },
]

export default function StartupLifecycle() {
  const [activeStage, setActiveStage] = useState(0)
  const stage = stages[activeStage]

  return (
    <section id="ciclo-de-vida" style={{ padding: '6rem 0', background: 'var(--color-bg-primary)' }}>
      <div style={{ maxWidth: 1200, margin: '0 auto', padding: '0 1.5rem' }}>
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-50px' }}
          transition={{ duration: 0.5 }}
          style={{ textAlign: 'center', maxWidth: 700, margin: '0 auto 3rem' }}
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
            Ciclo de Vida
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
            El ecosistema de herramientas exacto para tu etapa actual
          </h2>
          <p style={{
            fontFamily: 'var(--font-body)',
            fontSize: '1.0625rem',
            lineHeight: 1.7,
            color: 'var(--color-text-secondary)',
          }}>
            Más de 15 herramientas operativas de alto valor, organizadas según tu nivel de madurez tecnológica y comercial. Descubre tu arsenal.
          </p>
        </motion.div>

        {/* Stage selector tabs */}
        <div style={{
          display: 'flex',
          gap: '0.75rem',
          marginBottom: '2rem',
          overflowX: 'auto',
          paddingBottom: '0.5rem',
        }}>
          {stages.map((s, i) => (
            <button
              key={s.id}
              onClick={() => setActiveStage(i)}
              style={{
                flex: '1 1 0',
                minWidth: 200,
                padding: '1.25rem 1.5rem',
                borderRadius: 14,
                border: activeStage === i ? `2px solid ${s.color}` : '1px solid var(--color-border)',
                background: activeStage === i ? s.bg : 'white',
                cursor: 'pointer',
                textAlign: 'left',
                transition: 'all 0.2s ease',
                position: 'relative',
                overflow: 'hidden',
              }}
            >
              {activeStage === i && (
                <div style={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  right: 0,
                  height: 3,
                  background: s.color,
                }} />
              )}
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.5rem' }}>
                <s.icon size={20} strokeWidth={1.5} color={activeStage === i ? s.color : '#9CA3AF'} />
                <span style={{
                  fontFamily: 'var(--font-mono)',
                  fontSize: '0.6875rem',
                  fontWeight: 600,
                  color: activeStage === i ? s.color : 'var(--color-text-muted)',
                }}>
                  {s.number}
                </span>
              </div>
              <h3 style={{
                fontFamily: 'var(--font-heading)',
                fontSize: '1rem',
                fontWeight: 700,
                color: activeStage === i ? 'var(--color-text-primary)' : 'var(--color-text-secondary)',
                marginBottom: '0.125rem',
              }}>
                {s.title}
              </h3>
              <p style={{
                fontFamily: 'var(--font-body)',
                fontSize: '0.8125rem',
                color: 'var(--color-text-muted)',
              }}>
                {s.trl}
              </p>
            </button>
          ))}
        </div>

        {/* Stage content */}
        <AnimatePresence mode="wait">
          <motion.div
            key={stage.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.3 }}
            style={{
              background: 'white',
              borderRadius: 20,
              border: '1px solid var(--color-border)',
              padding: '2rem',
              boxShadow: 'var(--shadow-card)',
            }}
          >
            {/* Stage info bar */}
            <div style={{
              display: 'flex',
              flexWrap: 'wrap',
              alignItems: 'center',
              gap: '1rem',
              marginBottom: '1.5rem',
              paddingBottom: '1.5rem',
              borderBottom: '1px solid var(--color-border)',
            }}>
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.75rem',
              }}>
                <div style={{
                  width: 48,
                  height: 48,
                  borderRadius: 14,
                  background: stage.bg,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}>
                  <stage.icon size={24} strokeWidth={1.5} color={stage.color} />
                </div>
                <div>
                  <h3 style={{
                    fontFamily: 'var(--font-heading)',
                    fontSize: '1.25rem',
                    fontWeight: 700,
                    color: 'var(--color-text-primary)',
                  }}>
                    {stage.title}: {stage.subtitle}
                  </h3>
                  <p style={{
                    fontFamily: 'var(--font-body)',
                    fontSize: '0.875rem',
                    color: 'var(--color-text-secondary)',
                  }}>
                    {stage.focus}
                  </p>
                </div>
              </div>
            </div>

            {/* Tools grid */}
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
              gap: '1rem',
            }}>
              {stage.tools.map((tool, i) => (
                <motion.div
                  key={tool.name}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: i * 0.05 }}
                  style={{
                    padding: '1.25rem',
                    borderRadius: 12,
                    border: `1px solid ${stage.borderColor}`,
                    background: stage.bg,
                    transition: 'transform 0.2s, box-shadow 0.2s',
                  }}
                  onMouseEnter={e => {
                    e.currentTarget.style.transform = 'translateY(-1px)'
                    e.currentTarget.style.boxShadow = 'var(--shadow-card)'
                  }}
                  onMouseLeave={e => {
                    e.currentTarget.style.transform = 'translateY(0)'
                    e.currentTarget.style.boxShadow = 'none'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.75rem' }}>
                    <ChevronRight size={16} color={stage.color} style={{ marginTop: 3, flexShrink: 0 }} />
                    <div>
                      <h4 style={{
                        fontFamily: 'var(--font-heading)',
                        fontSize: '0.9375rem',
                        fontWeight: 700,
                        color: 'var(--color-text-primary)',
                        marginBottom: '0.375rem',
                      }}>
                        {tool.name}
                      </h4>
                      <p style={{
                        fontFamily: 'var(--font-body)',
                        fontSize: '0.8125rem',
                        lineHeight: 1.6,
                        color: 'var(--color-text-secondary)',
                      }}>
                        {tool.desc}
                      </p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </AnimatePresence>
      </div>
    </section>
  )
}
