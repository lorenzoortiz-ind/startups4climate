'use client'

import { useState } from 'react'
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion'
import { FlaskConical, Rocket, Building2, TrendingUp, ChevronRight } from 'lucide-react'

const stages = [
  {
    id: 'pre-incubacion',
    icon: FlaskConical,
    number: '01',
    title: 'Pre-incubacion',
    subtitle: 'Ideacion y Descubrimiento',
    focus: 'Define tu proposito, descubre tu mercado y entiende a tu usuario',
    color: '#FF6B4A',
    bg: 'rgba(255,107,74,0.05)',
    borderColor: 'rgba(255,107,74,0.15)',
    tools: [
      { name: 'Proposito & Equipo', category: 'Equipo', desc: 'Define la mision de tu startup y evalua las capacidades y brechas de tu equipo fundador.' },
      { name: 'Segmentacion de Mercado', category: 'Mercado', desc: 'Identifica y mapea los segmentos de mercado donde tu solucion puede generar mayor impacto.' },
      { name: 'Mercado inicial', category: 'Estrategia', desc: 'Selecciona tu primer mercado de entrada usando criterios de accesibilidad, tamano y traccion.' },
      { name: 'Perfil de Usuario', category: 'Mercado', desc: 'Construye un perfil detallado de tu usuario final: comportamientos, necesidades y contexto.' },
      { name: 'Calculo del TAM', category: 'Mercado', desc: 'Estima el tamano total de tu mercado direccionable con metodologias bottom-up y top-down.' },
      { name: 'Buyer Persona', category: 'Mercado', desc: 'Crea un arquetipo detallado de tu cliente ideal con datos demograficos, motivaciones y puntos de dolor.' },
    ],
  },
  {
    id: 'incubacion',
    icon: Rocket,
    number: '02',
    title: 'Incubacion',
    subtitle: 'Validacion y Producto',
    focus: 'Valida tu propuesta de valor y disena tu producto minimo viable',
    color: '#0D9488',
    bg: 'rgba(13,148,136,0.05)',
    borderColor: 'rgba(13,148,136,0.15)',
    tools: [
      { name: 'User Journey', category: 'Producto', desc: 'Mapea el recorrido completo de tu usuario desde el descubrimiento hasta la retencion y referencia.' },
      { name: 'Especificacion de Producto', category: 'Producto', desc: 'Define las funcionalidades clave, la arquitectura y los requerimientos tecnicos de tu producto.' },
      { name: 'Propuesta de Valor', category: 'Estrategia', desc: 'Cuantifica el valor que entregas a tu cliente en terminos medibles: ahorro, eficiencia o impacto.' },
      { name: 'Primeros 10 Clientes', category: 'Ventas', desc: 'Estrategia para identificar, contactar y convertir tus primeros 10 clientes pagadores o usuarios.' },
      { name: 'Posicionamiento', category: 'Marketing', desc: 'Define tu ventaja competitiva sostenible y como te posicionas frente a alternativas en el mercado.' },
      { name: 'Lean Canvas de Impacto', category: 'Estrategia', desc: 'Modelo de negocio en una pagina adaptado para startups de impacto con metricas sociales y ambientales.' },
    ],
  },
  {
    id: 'aceleracion',
    icon: Building2,
    number: '03',
    title: 'Aceleracion',
    subtitle: 'Modelo de Negocio y Crecimiento',
    focus: 'Estructura tu modelo de negocio, pricing y proceso de ventas',
    color: '#2A222B',
    bg: 'rgba(42,34,43,0.04)',
    borderColor: 'rgba(42,34,43,0.12)',
    tools: [
      { name: 'Decisiones de Compra', category: 'Ventas', desc: 'Identifica a todas las personas involucradas en la decision de compra final, sus intenciones y motivaciones.' },
      { name: 'Proceso de Adquisicion', category: 'Marketing', desc: 'Disena el embudo completo de adquisicion de clientes: desde awareness hasta conversion.' },
      { name: 'Modelo de Negocio', category: 'Estrategia', desc: 'Estructura tu modelo de ingresos, canales de distribucion y relacion con el cliente.' },
      { name: 'Framework de Pricing', category: 'Finanzas', desc: 'Define tu estrategia de precios basada en valor percibido, costos y dinamica competitiva.' },
      { name: 'LTV y Unit Economics', category: 'Finanzas', desc: 'Calcula el valor de vida del cliente, costo de adquisicion y la rentabilidad por unidad.' },
      { name: 'Proceso de Ventas', category: 'Ventas', desc: 'Disena tu proceso de ventas repetible: desde la prospeccion hasta el cierre y seguimiento.' },
    ],
  },
  {
    id: 'escalamiento',
    icon: TrendingUp,
    number: '04',
    title: 'Escalamiento',
    subtitle: 'Plan y Fundraising',
    focus: 'Valida tu traccion, construye tu producto y prepara tu ronda de inversion',
    color: '#0D9488',
    bg: 'rgba(13,148,136,0.05)',
    borderColor: 'rgba(13,148,136,0.15)',
    tools: [
      { name: 'Supuestos Clave', category: 'Estrategia', desc: 'Identifica y prioriza los supuestos criticos que deben validarse antes de escalar tu negocio.' },
      { name: 'Producto Minimo Viable', category: 'Producto', desc: 'Define y construye la version minima de tu producto que prueba tu propuesta de valor central.' },
      { name: 'Validacion de Traccion', category: 'Mercado', desc: 'Mide y documenta las metricas de traccion que demuestran product-market fit a inversores.' },
      { name: 'Producto y Expansion', category: 'Estrategia', desc: 'Disena la hoja de ruta de producto y la estrategia de expansion a nuevos mercados y segmentos.' },
      { name: 'Pitch Deck', category: 'Finanzas', desc: 'Crea una presentacion de inversion profesional con narrativa, metricas y ask claros.' },
      { name: 'Cap Table y Fundraising', category: 'Finanzas', desc: 'Estructura tu tabla de capitalizacion y prepara tu estrategia de levantamiento de capital.' },
    ],
  },
]

const categoryColors: Record<string, string> = {
  'Equipo': '#FF6B4A',
  'Mercado': '#0D9488',
  'Estrategia': '#2A222B',
  'Producto': '#0D9488',
  'Ventas': '#FF6B4A',
  'Marketing': '#FF6B4A',
  'Modelo': '#0D9488',
  'Finanzas': '#2A222B',
}

const ease = [0.25, 0.1, 0.25, 1] as [number, number, number, number]

export default function StartupLifecycle() {
  const [activeStage, setActiveStage] = useState(0)
  const stage = stages[activeStage]
  const prefersReducedMotion = useReducedMotion()

  const staggerContainer = {
    hidden: {},
    visible: {
      transition: { staggerChildren: prefersReducedMotion ? 0 : 0.1 },
    },
  }
  const staggerItem = {
    hidden: prefersReducedMotion ? {} : { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease } },
  }

  return (
    <section id="ciclo-de-vida" style={{ padding: 'clamp(5rem, 10vw, 10rem) 0', background: 'white' }}>
      <div style={{ maxWidth: 1200, margin: '0 auto', padding: '0 clamp(1.5rem, 4vw, 5rem)' }}>
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.6, ease }}
          style={{ textAlign: 'center', maxWidth: 700, margin: '0 auto 3rem' }}
        >
          <span style={{
            display: 'inline-block',
            fontFamily: 'var(--font-body)',
            fontSize: '12px',
            fontWeight: 600,
            letterSpacing: '0.12em',
            textTransform: 'uppercase',
            color: '#93908C',
            marginBottom: '1rem',
          }}>
            +30 Herramientas en 4 Etapas
          </span>
          <h2 style={{
            fontFamily: 'var(--font-heading)',
            fontSize: 'clamp(1.75rem, 3.5vw, 2.5rem)',
            fontWeight: 400,
            lineHeight: 1.15,
            letterSpacing: '-0.02em',
            color: '#2A222B',
            marginBottom: '1rem',
          }}>
            El Toolkit que necesita todo founder para crecer y escalar
          </h2>
        </motion.div>

        {/* Stage selector tabs */}
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-40px' }}
          className="lifecycle-tabs"
          style={{
            display: 'flex',
            gap: '0.75rem',
            marginBottom: '2rem',
            overflowX: 'auto',
            paddingBottom: '0.5rem',
          }}
        >
          {stages.map((s, i) => (
            <motion.button
              variants={staggerItem}
              key={s.id}
              onClick={() => setActiveStage(i)}
              style={{
                flex: '1 1 0',
                minWidth: 180,
                padding: '1.25rem 1.25rem',
                borderRadius: 12,
                border: activeStage === i ? `2px solid ${s.color}` : '1px solid #E8E4DF',
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
                <s.icon size={20} strokeWidth={1.5} color={activeStage === i ? s.color : '#93908C'} />
                <span style={{
                  fontFamily: 'var(--font-body)',
                  fontSize: '0.6875rem',
                  fontWeight: 600,
                  color: activeStage === i ? s.color : '#93908C',
                  letterSpacing: '0.05em',
                }}>
                  {s.number}
                </span>
              </div>
              <h3 style={{
                fontFamily: 'var(--font-heading)',
                fontSize: '0.9375rem',
                fontWeight: 400,
                color: activeStage === i ? '#2A222B' : '#5E5A60',
                marginBottom: '0.125rem',
                letterSpacing: '-0.02em',
              }}>
                {s.title}
              </h3>
              <p style={{
                fontFamily: 'var(--font-body)',
                fontSize: '0.75rem',
                color: '#93908C',
              }}>
                6 herramientas
              </p>
            </motion.button>
          ))}
        </motion.div>

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
              borderRadius: 12,
              border: '1px solid #E8E4DF',
              padding: '2rem',
              boxShadow: '0 1px 3px rgba(0,0,0,0.04), 0 6px 16px rgba(0,0,0,0.04)',
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
              borderBottom: '1px solid #E8E4DF',
            }}>
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.75rem',
              }}>
                <div style={{
                  width: 48,
                  height: 48,
                  borderRadius: 10,
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
                    fontWeight: 400,
                    color: '#2A222B',
                    letterSpacing: '-0.02em',
                  }}>
                    {stage.title}: {stage.subtitle}
                  </h3>
                  <p style={{
                    fontFamily: 'var(--font-body)',
                    fontSize: '0.875rem',
                    color: '#5E5A60',
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
                  className="lifecycle-tool-card"
                  style={{
                    padding: '1.25rem',
                    borderRadius: 12,
                    border: `1px solid ${stage.borderColor}`,
                    background: stage.bg,
                    transition: 'transform 0.2s, box-shadow 0.2s',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.75rem' }}>
                    <ChevronRight size={16} color={stage.color} style={{ marginTop: 3, flexShrink: 0 }} />
                    <div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.375rem', flexWrap: 'wrap' }}>
                        <h4 style={{
                          fontFamily: 'var(--font-heading)',
                          fontSize: '0.9375rem',
                          fontWeight: 400,
                          color: '#2A222B',
                          letterSpacing: '-0.02em',
                        }}>
                          {tool.name}
                        </h4>
                        <span style={{
                          padding: '0.1rem 0.5rem',
                          borderRadius: 8,
                          background: `${categoryColors[tool.category] || stage.color}10`,
                          border: `1px solid ${categoryColors[tool.category] || stage.color}25`,
                          fontFamily: 'var(--font-body)',
                          fontSize: '0.5625rem',
                          fontWeight: 600,
                          color: categoryColors[tool.category] || stage.color,
                          letterSpacing: '0.02em',
                          textTransform: 'uppercase',
                          whiteSpace: 'nowrap',
                        }}>
                          {tool.category}
                        </span>
                      </div>
                      <p style={{
                        fontFamily: 'var(--font-body)',
                        fontSize: '0.8125rem',
                        lineHeight: 1.6,
                        color: '#5E5A60',
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

      <style>{`
        .lifecycle-tool-card:hover {
          transform: translateY(-1px) !important;
          box-shadow: 0 1px 3px rgba(0,0,0,0.04), 0 6px 16px rgba(0,0,0,0.04) !important;
        }
      `}</style>
    </section>
  )
}
