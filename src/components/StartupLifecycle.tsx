'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { FlaskConical, Rocket, Building2, TrendingUp, ChevronRight } from 'lucide-react'

const stages = [
  {
    id: 'pre-incubacion',
    icon: FlaskConical,
    number: '01',
    title: 'Pre-incubacion',
    subtitle: 'Ideacion y Descubrimiento',
    focus: 'Define tu proposito, descubre tu mercado y entiende a tu usuario',
    color: '#7C3AED',
    bg: 'rgba(124,58,237,0.06)',
    borderColor: 'rgba(124,58,237,0.15)',
    tools: [
      { name: 'Proposito & Equipo', category: 'Equipo', desc: 'Define la mision de tu startup y evalua las capacidades y brechas de tu equipo fundador.' },
      { name: 'Segmentacion de Mercado', category: 'Mercado', desc: 'Identifica y mapea los segmentos de mercado donde tu solucion puede generar mayor impacto.' },
      { name: 'Beachhead Market', category: 'Estrategia', desc: 'Selecciona tu primer mercado de entrada usando criterios de accesibilidad, tamano y traccion.' },
      { name: 'Perfil del Usuario Final', category: 'Cliente', desc: 'Construye un perfil detallado de tu usuario final: comportamientos, necesidades y contexto.' },
      { name: 'Calculo del TAM', category: 'Mercado', desc: 'Estima el tamano total de tu mercado direccionable con metodologias bottom-up y top-down.' },
      { name: 'Perfil de la Persona', category: 'Cliente', desc: 'Crea un arquetipo detallado de tu cliente ideal con datos demograficos, motivaciones y puntos de dolor.' },
    ],
  },
  {
    id: 'incubacion',
    icon: Rocket,
    number: '02',
    title: 'Incubacion',
    subtitle: 'Validacion y Producto',
    focus: 'Valida tu propuesta de valor y disenr tu producto minimo viable',
    color: '#059669',
    bg: 'rgba(5,150,105,0.06)',
    borderColor: 'rgba(5,150,105,0.15)',
    tools: [
      { name: 'Caso de Uso del Ciclo Completo', category: 'Producto', desc: 'Mapea el recorrido completo de tu usuario desde el descubrimiento hasta la retencion y referencia.' },
      { name: 'Especificacion de Producto', category: 'Producto', desc: 'Define las funcionalidades clave, la arquitectura y los requerimientos tecnicos de tu producto.' },
      { name: 'Propuesta de Valor Cuantificada', category: 'Estrategia', desc: 'Cuantifica el valor que entregas a tu cliente en terminos medibles: ahorro, eficiencia o impacto.' },
      { name: 'Primeros 10 Clientes', category: 'Ventas', desc: 'Estrategia para identificar, contactar y convertir tus primeros 10 clientes pagadores o usuarios.' },
      { name: 'Core y Posicionamiento', category: 'Marketing', desc: 'Define tu ventaja competitiva sostenible y como te posicionas frente a alternativas en el mercado.' },
      { name: 'Lean Canvas de Impacto', category: 'Modelo de Negocio', desc: 'Modelo de negocio en una pagina adaptado para startups de impacto con metricas sociales y ambientales.' },
    ],
  },
  {
    id: 'aceleracion',
    icon: Building2,
    number: '03',
    title: 'Aceleracion',
    subtitle: 'Modelo de Negocio y Crecimiento',
    focus: 'Estructura tu modelo de negocio, pricing y proceso de ventas',
    color: '#D97706',
    bg: 'rgba(217,119,6,0.06)',
    borderColor: 'rgba(217,119,6,0.15)',
    tools: [
      { name: 'DMU (Unidad de Decision)', category: 'Ventas', desc: 'Identifica a todas las personas involucradas en la decision de compra y sus motivaciones.' },
      { name: 'Proceso de Adquisicion', category: 'Marketing', desc: 'Disena el embudo completo de adquisicion de clientes: desde awareness hasta conversion.' },
      { name: 'Modelo de Negocio', category: 'Modelo de Negocio', desc: 'Estructura tu modelo de ingresos, canales de distribucion y relacion con el cliente.' },
      { name: 'Framework de Pricing', category: 'Finanzas', desc: 'Define tu estrategia de precios basada en valor percibido, costos y dinamica competitiva.' },
      { name: 'LTV y Unit Economics', category: 'Finanzas', desc: 'Calcula el valor de vida del cliente, costo de adquisicion y la rentabilidad por unidad.' },
      { name: 'Proceso de Ventas', category: 'Ventas', desc: 'Disena tu proceso de ventas repetible: desde la prospectacion hasta el cierre y seguimiento.' },
    ],
  },
  {
    id: 'escalamiento',
    icon: TrendingUp,
    number: '04',
    title: 'Escalamiento',
    subtitle: 'Producto, Plan y Fundraising',
    focus: 'Valida tu traccion, construye tu producto y prepara tu ronda de inversion',
    color: '#0891B2',
    bg: 'rgba(8,145,178,0.06)',
    borderColor: 'rgba(8,145,178,0.15)',
    tools: [
      { name: 'Supuestos Clave', category: 'Estrategia', desc: 'Identifica y prioriza los supuestos criticos que deben validarse antes de escalar tu negocio.' },
      { name: 'MVBP (Producto Minimo Viable)', category: 'Producto', desc: 'Define y construye la version minima de tu producto que prueba tu propuesta de valor central.' },
      { name: 'Validacion de Traccion', category: 'Mercado', desc: 'Mide y documenta las metricas de traccion que demuestran product-market fit a inversores.' },
      { name: 'Plan de Producto y Expansion', category: 'Estrategia', desc: 'Disenr la hoja de ruta de producto y la estrategia de expansion a nuevos mercados y segmentos.' },
      { name: 'Pitch Deck', category: 'Finanzas', desc: 'Crea una presentacion de inversion profesional con narrativa, metricas y ask claros.' },
      { name: 'Cap Table y Fundraising', category: 'Finanzas', desc: 'Estructura tu tabla de capitalizacion y prepara tu estrategia de levantamiento de capital.' },
    ],
  },
]

const categoryColors: Record<string, string> = {
  'Equipo': '#7C3AED',
  'Mercado': '#059669',
  'Estrategia': '#0891B2',
  'Cliente': '#D97706',
  'Producto': '#2563EB',
  'Ventas': '#DC2626',
  'Marketing': '#DB2777',
  'Modelo de Negocio': '#059669',
  'Finanzas': '#D97706',
}

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
            24 Herramientas en 4 Etapas
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
            24 herramientas operativas organizadas en 4 etapas de desarrollo. Basadas en la
            metodologia Disciplined Entrepreneurship del MIT. Descubre tu arsenal.
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
                minWidth: 180,
                padding: '1.25rem 1.25rem',
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
                fontSize: '0.9375rem',
                fontWeight: 700,
                color: activeStage === i ? 'var(--color-text-primary)' : 'var(--color-text-secondary)',
                marginBottom: '0.125rem',
              }}>
                {s.title}
              </h3>
              <p style={{
                fontFamily: 'var(--font-body)',
                fontSize: '0.75rem',
                color: 'var(--color-text-muted)',
              }}>
                6 herramientas
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
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.375rem', flexWrap: 'wrap' }}>
                        <h4 style={{
                          fontFamily: 'var(--font-heading)',
                          fontSize: '0.9375rem',
                          fontWeight: 700,
                          color: 'var(--color-text-primary)',
                        }}>
                          {tool.name}
                        </h4>
                        <span style={{
                          padding: '0.1rem 0.5rem',
                          borderRadius: 6,
                          background: `${categoryColors[tool.category] || stage.color}10`,
                          border: `1px solid ${categoryColors[tool.category] || stage.color}25`,
                          fontFamily: 'var(--font-mono)',
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
