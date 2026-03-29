'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { FlaskConical, Rocket, Building2, TrendingUp } from 'lucide-react'

const stages = [
  {
    id: 'pre-incubacion',
    icon: FlaskConical,
    number: '01',
    title: 'Pre-incubación',
    subtitle: 'Ideación y Descubrimiento',
    focus: 'Define tu propósito, descubre tu mercado y entiende a tu usuario',
    stageColor: '#FF6B4A',
    tools: [
      { name: 'Propósito & Equipo', category: 'Equipo', desc: 'Evalúa las capacidades y brechas de tu equipo fundador.' },
      { name: 'Segmentación de Mercado', category: 'Mercado', desc: 'Identifica los segmentos con mayor potencial de impacto.' },
      { name: 'Mercado inicial', category: 'Estrategia', desc: 'Selecciona tu nicho considerando tamaño y accesibilidad.' },
      { name: 'Perfil de Usuario', category: 'Mercado', desc: 'Define las necesidades, dolores y contexto de tu target.' },
      { name: 'Cálculo del TAM', category: 'Mercado', desc: 'Averigua el volumen total de tu mercado potencial.' },
      { name: 'Buyer Persona', category: 'Mercado', desc: 'Crea el arquetipo exacto de tu cliente ideal.' },
    ],
  },
  {
    id: 'incubacion',
    icon: Rocket,
    number: '02',
    title: 'Incubación',
    subtitle: 'Validación y Producto',
    focus: 'Valida tu propuesta de valor y diseña tu producto mínimo viable',
    stageColor: '#0D9488',
    tools: [
      { name: 'User Journey', category: 'Producto', desc: 'Mapea la interacción completa de tu usuario.' },
      { name: 'Especificación del MVP', category: 'Producto', desc: 'Estructura qué construirás para arrancar.' },
      { name: 'Propuesta de Valor', category: 'Estrategia', desc: 'Cuantifica el valor único que ofreces.' },
      { name: 'Primeros 10 Clientes', category: 'Ventas', desc: 'Roadmap para cerrar ventas iniciales.' },
      { name: 'Posicionamiento', category: 'Marketing', desc: 'Diferénciate del ruido del mercado.' },
      { name: 'Lean Canvas', category: 'Estrategia', desc: 'Resume tu modelo de impacto en 1 página.' },
    ],
  },
  {
    id: 'aceleracion',
    icon: Building2,
    number: '03',
    title: 'Aceleración',
    subtitle: 'Modelo de Negocio y Crecimiento',
    focus: 'Estructura tu modelo de negocio, pricing y proceso de ventas',
    stageColor: '#D97706',
    tools: [
      { name: 'Decisiones de Compra', category: 'Ventas', desc: '¿Quién decide realmente en tu industria?' },
      { name: 'Embudo de Adquisición', category: 'Marketing', desc: 'Mapea desde el discovery hasta el pago.' },
      { name: 'Modelo de Negocio', category: 'Estrategia', desc: 'Estructura real para generar ingresos.' },
      { name: 'Pricing Strategy', category: 'Finanzas', desc: 'Decide cuánto, cómo y por qué cobrar.' },
      { name: 'Unit Economics', category: 'Finanzas', desc: 'CAC vs LTV, el pulso financiero de tu startup.' },
      { name: 'Proceso de Ventas', category: 'Ventas', desc: 'Sistematiza cómo cierras deals.' },
    ],
  },
  {
    id: 'escalamiento',
    icon: TrendingUp,
    number: '04',
    title: 'Escalamiento',
    subtitle: 'Producto, Plan y Fundraising',
    focus: 'Valida tu tracción, construye tu producto y prepara tu ronda de inversión',
    stageColor: '#3B82F6',
    tools: [
      { name: 'Supuestos Clave', category: 'Estrategia', desc: '¿Qué debe ser cierto para que tu negocio gane?' },
      { name: 'Validación Lógica', category: 'Producto', desc: 'Comprueba el product-market fit.' },
      { name: 'Tracción', category: 'Mercado', desc: 'Indicadores que piden los inversores.' },
      { name: 'Roadmap de Expansión', category: 'Estrategia', desc: 'Hacia dónde ir sin perder foco.' },
      { name: 'Pitch Deck', category: 'Finanzas', desc: 'Narrativa estructurada para fundraising.' },
      { name: 'Cap Table', category: 'Finanzas', desc: 'Simula cómo distribuyes el equity.' },
    ],
  },
]

export default function StartupLifecycle() {
  const [activeStage, setActiveStage] = useState(0)
  const stage = stages[activeStage]

  return (
    <section
      id="ciclo-de-vida"
      style={{
        padding: 'var(--section-py) 0',
        background: 'var(--color-bg-primary)',
        borderTop: '1px solid var(--color-border)',
      }}
    >
      <div style={{ maxWidth: 'var(--container-max)', margin: '0 auto', padding: '0 var(--container-px)' }}>

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 60 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-100px' }}
          transition={{ type: 'spring', damping: 20, stiffness: 100 }}
          style={{ textAlign: 'left', maxWidth: 900, marginBottom: 'clamp(3rem, 6vw, 5rem)' }}
        >
          <h2 style={{
            fontFamily: 'var(--font-heading)',
            fontSize: 'var(--text-display-md)',
            fontWeight: 700,
            lineHeight: 1.05,
            letterSpacing: '-0.03em',
            color: 'var(--color-ink)',
            marginBottom: '1.5rem',
          }}>
            El <span style={{ color: 'var(--color-accent-primary)' }}>Toolkit</span> que necesitas para crecer y escalar
          </h2>
          <p style={{
            fontFamily: 'var(--font-body)',
            fontSize: 'var(--text-body-lg)',
            lineHeight: 1.5,
            color: 'var(--color-text-secondary)',
            maxWidth: 600,
          }}>
            +30 herramientas organizadas en las 4 etapas clave del desarrollo de tu startup.
          </p>
        </motion.div>

        {/* Stage selector tabs */}
        <div
          style={{
            display: 'flex',
            gap: '1rem',
            marginBottom: '3rem',
            overflowX: 'auto',
            paddingBottom: '0.5rem',
          }}
        >
          {stages.map((s, i) => {
            const isActive = activeStage === i
            return (
            <button
              key={s.id}
              onClick={() => setActiveStage(i)}
              style={{
                flex: '1 0 200px',
                padding: '1.5rem',
                borderRadius: 'var(--radius-lg)',
                border: isActive ? '2px solid var(--color-ink)' : '1px solid var(--color-border)',
                background: isActive ? 'var(--color-ink)' : 'var(--color-paper)',
                color: isActive ? 'var(--color-paper)' : 'var(--color-ink)',
                cursor: 'pointer',
                textAlign: 'left',
                transition: 'all 0.2s var(--ease-smooth)',
                display: 'flex',
                flexDirection: 'column',
                gap: '0.75rem',
              }}
            >
              <div style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', opacity: isActive ? 1 : 0.5, color: isActive ? 'var(--color-paper)' : 'var(--color-ink)' }}>
                  <s.icon size={18} strokeWidth={2} />
                  <span style={{
                    fontFamily: 'var(--font-body)',
                    fontSize: '0.75rem',
                    fontWeight: 700,
                    letterSpacing: '0.05em',
                    textTransform: 'uppercase' as const,
                    color: isActive ? 'var(--color-paper)' : 'inherit',
                  }}>
                    {s.number}
                  </span>
                </div>
                <span style={{
                  padding: '0.2rem 0.6rem',
                  borderRadius: 'var(--radius-full)',
                  background: isActive ? 'rgba(255,255,255,0.15)' : 'var(--color-bg-primary)',
                  border: isActive ? '1px solid rgba(255,255,255,0.2)' : '1px solid var(--color-border)',
                  fontFamily: 'var(--font-body)',
                  fontSize: '0.625rem',
                  fontWeight: 600,
                  color: isActive ? 'var(--color-paper)' : 'var(--color-text-secondary)',
                  letterSpacing: '0.02em',
                  whiteSpace: 'nowrap' as const,
                }}>
                  6 herramientas
                </span>
              </div>
              <h3 style={{
                fontFamily: 'var(--font-heading)',
                fontSize: 'var(--text-heading-md)',
                fontWeight: 700,
                letterSpacing: '-0.02em',
                margin: 0,
                lineHeight: 1.2,
                color: isActive ? 'var(--color-paper)' : 'var(--color-ink)',
              }}>
                {s.title}
              </h3>
              <div style={{
                width: '100%',
                height: 3,
                borderRadius: 2,
                background: isActive ? s.stageColor : 'transparent',
                transition: 'background 0.2s ease',
              }} />
            </button>
            )
          })}
        </div>

        {/* Stage content */}
        <AnimatePresence mode="wait">
          <motion.div
            key={stage.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ type: 'spring', damping: 20, stiffness: 100, duration: 0.3 }}
          >
            <div style={{
              marginBottom: '3rem',
              borderBottom: '1px solid var(--color-border)',
              paddingBottom: '2rem',
            }}>
              <p style={{
                fontFamily: 'var(--font-body)',
                fontSize: 'var(--text-body-lg)',
                color: 'var(--color-text-secondary)',
                margin: 0,
                whiteSpace: 'nowrap' as const,
              }}>
                {stage.focus}
              </p>
            </div>

            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
              gap: '1.5rem',
            }}>
              {stage.tools.map((tool, i) => (
                <motion.div
                  key={tool.name}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ type: 'spring', damping: 20, stiffness: 100, delay: i * 0.06 }}
                  whileHover={{ y: -4, boxShadow: 'var(--shadow-float)' }}
                  style={{
                    padding: '2rem',
                    borderRadius: 'var(--radius-lg)',
                    border: '1px solid var(--color-border)',
                    background: 'var(--color-paper)',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '0.75rem',
                    cursor: 'default',
                    transition: 'box-shadow 0.2s var(--ease-smooth)',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <span style={{
                      padding: '0.25rem 0.75rem',
                      borderRadius: 'var(--radius-full)',
                      background: 'var(--color-bg-primary)',
                      border: '1px solid var(--color-border)',
                      fontFamily: 'var(--font-body)',
                      fontSize: '0.625rem',
                      fontWeight: 700,
                      color: 'var(--color-ink)',
                      letterSpacing: '0.04em',
                      textTransform: 'uppercase' as const,
                    }}>
                      {tool.category}
                    </span>
                  </div>
                  <h4 style={{
                    fontFamily: 'var(--font-heading)',
                    fontSize: 'var(--text-heading-md)',
                    fontWeight: 700,
                    color: 'var(--color-ink)',
                    letterSpacing: '-0.02em',
                    margin: 0,
                    lineHeight: 1.2,
                  }}>
                    {tool.name}
                  </h4>
                  <p style={{
                    fontFamily: 'var(--font-body)',
                    fontSize: 'var(--text-body-lg)',
                    lineHeight: 1.5,
                    color: 'var(--color-text-secondary)',
                    margin: 0,
                  }}>
                    {tool.desc}
                  </p>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </AnimatePresence>
      </div>
    </section>
  )
}
