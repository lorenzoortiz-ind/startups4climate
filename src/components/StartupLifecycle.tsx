'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Link from 'next/link'
import {
  FlaskConical,
  Rocket,
  Building2,
  TrendingUp,
  Users,
  BarChart3,
  Target,
  Calculator,
  UserCircle,
  Map,
  Layers,
  Lightbulb,
  DollarSign,
  Handshake,
  Shield,
  PieChart,
  Megaphone,
  LineChart,
  FileText,
  Briefcase,
  ArrowRight,
  ShieldCheck,
  Beaker,
  Package,
  Expand,
  Presentation,
  Wallet,
  FolderOpen,
  TrendingUp as ScaleIcon,
} from 'lucide-react'

const stages = [
  {
    id: 'pre-incubacion',
    icon: FlaskConical,
    number: '01',
    title: 'Pre-incubación',
    subtitle: 'Ideación y Descubrimiento',
    focus: 'Define tu propósito, descubre tu mercado y entiende a tu usuario',
    stageColor: '#FF6B4A',
    stageBg: 'rgba(255,107,74,0.07)',
    stageBorder: 'rgba(255,107,74,0.18)',
    tools: [
      { name: 'Propósito & Equipo', category: 'EQUIPO', icon: Users, desc: 'Define por qué existes como startup y evalúa las brechas de tu equipo fundador.' },
      { name: 'Segmentación', category: 'MERCADO', icon: BarChart3, desc: 'Explora y lista todos los posibles segmentos de mercado donde tu idea podría crear valor.' },
      { name: 'Mercado inicial', category: 'MERCADO', icon: Target, desc: 'Elige tu primer mercado de entrada, el nicho donde ganarás tu primera batalla.' },
      { name: 'Usuario Final', category: 'MERCADO', icon: UserCircle, desc: 'Construye un perfil detallado de quién es el usuario final de tu producto.' },
      { name: 'Cálculo del TAM', category: 'FINANZAS', icon: Calculator, desc: 'Calcula el tamaño de tu mercado usando análisis bottom-up.' },
      { name: 'Persona', category: 'MERCADO', icon: Map, desc: 'Crea una persona concreta y representativa de tu mercado inicial.' },
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
    stageBg: 'rgba(13,148,136,0.07)',
    stageBorder: 'rgba(13,148,136,0.18)',
    tools: [
      { name: 'Ciclo de Uso', category: 'PRODUCTO', icon: Layers, desc: 'Mapea cómo tu Persona descubre, adquiere, usa y recomienda tu producto.' },
      { name: 'Especificación', category: 'PRODUCTO', icon: FileText, desc: 'Define qué hace tu producto y qué NO hace con una brochure visual.' },
      { name: 'Propuesta de Valor', category: 'ESTRATEGIA', icon: Lightbulb, desc: 'Cuantifica en números concretos el valor que tu producto entrega al cliente.' },
      { name: 'Primeros 10 Clientes', category: 'VENTAS', icon: Handshake, desc: 'Identifica con nombre y apellido a tus primeros 10 clientes potenciales.' },
      { name: 'Core & Competencia', category: 'ESTRATEGIA', icon: Shield, desc: 'Define tu ventaja competitiva sostenible y mapea tu posición vs. la competencia.' },
      { name: 'Lean Canvas', category: 'ESTRATEGIA', icon: PieChart, desc: 'Modelo de negocio en una página que sintetiza problema, solución y métricas.' },
    ],
  },
  {
    id: 'aceleracion',
    icon: Building2,
    number: '03',
    title: 'Aceleración',
    subtitle: 'Modelo de Negocio y Crecimiento',
    focus: 'Estructura tu modelo de negocio, pricing y proceso de ventas',
    stageColor: '#F59E0B',
    stageBg: 'rgba(245,158,11,0.10)',
    stageBorder: 'rgba(245,158,11,0.25)',
    tools: [
      { name: 'DMU', category: 'VENTAS', icon: Briefcase, desc: 'Identifica todas las personas que influyen en la decisión de compra.' },
      { name: 'Adquisición', category: 'MARKETING', icon: Megaphone, desc: 'Mapea paso a paso cómo un cliente pasa de no conocerte a comprar.' },
      { name: 'Modelo de Negocio', category: 'ESTRATEGIA', icon: Layers, desc: 'Elige y estructura cómo tu startup genera, entrega y captura valor.' },
      { name: 'Pricing', category: 'FINANZAS', icon: DollarSign, desc: 'Define tu estructura de precios basándote en el valor que entregas.' },
      { name: 'LTV & Economics', category: 'FINANZAS', icon: LineChart, desc: 'Calcula el Lifetime Value de tus clientes, COCA y métricas clave.' },
      { name: 'Proceso de Ventas', category: 'VENTAS', icon: Handshake, desc: 'Diseña tu proceso de ventas de principio a fin para que sea escalable.' },
    ],
  },
  {
    id: 'escalamiento',
    icon: TrendingUp,
    number: '04',
    title: 'Escalamiento',
    subtitle: 'Producto, Plan y Fundraising',
    focus: 'Valida tu tracción, construye tu producto y prepara tu ronda de inversión',
    stageColor: '#0D9488',
    stageBg: 'rgba(13,148,136,0.07)',
    stageBorder: 'rgba(13,148,136,0.18)',
    tools: [
      { name: 'Supuestos Clave', category: 'ESTRATEGIA', icon: Beaker, desc: 'Lista y prioriza los supuestos más riesgosos y diseña experimentos rápidos.' },
      { name: 'Producto Min. Viable', category: 'PRODUCTO', icon: Package, desc: 'Define la versión más pequeña de tu producto que entrega valor suficiente.' },
      { name: 'Validación', category: 'VENTAS', icon: ShieldCheck, desc: 'Demuestra con evidencia real que los clientes quieren y pagan por tu producto.' },
      { name: 'Plan & Expansión', category: 'PRODUCTO', icon: Expand, desc: 'Desarrolla tu roadmap de producto y mapea mercados adyacentes.' },
      { name: 'Pitch Deck', category: 'MARKETING', icon: Presentation, desc: 'Construye tu narrativa para inversores con los 12 slides esenciales.' },
      { name: 'Cap Table', category: 'FINANZAS', icon: Wallet, desc: 'Simula tu estructura accionaria en múltiples rondas de inversión.' },
    ],
  },
]

const CATEGORY_COLORS: Record<string, { color: string; bg: string }> = {
  ESTRATEGIA: { color: '#FF6B4A', bg: 'rgba(255,107,74,0.08)' },
  MERCADO: { color: '#0D9488', bg: 'rgba(13,148,136,0.08)' },
  PRODUCTO: { color: '#0D9488', bg: 'rgba(13,148,136,0.08)' },
  FINANZAS: { color: '#F59E0B', bg: 'rgba(245,158,11,0.10)' },
  VENTAS: { color: '#FF6B4A', bg: 'rgba(255,107,74,0.08)' },
  MARKETING: { color: '#FF6B4A', bg: 'rgba(255,107,74,0.08)' },
  EQUIPO: { color: '#0D9488', bg: 'rgba(13,148,136,0.08)' },
}

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
                borderRadius: 'var(--radius-md)',
                border: isActive ? `1px solid ${s.stageColor}55` : '1px solid var(--color-border)',
                background: isActive ? 'var(--color-bg-elevated)' : 'var(--color-bg-card)',
                color: 'var(--color-text-primary)',
                cursor: 'pointer',
                textAlign: 'left',
                transition: 'all 0.15s var(--ease-smooth)',
                display: 'flex',
                flexDirection: 'column',
                gap: '0.75rem',
                boxShadow: isActive ? `0 0 0 1px ${s.stageColor}30, 0 4px 14px rgba(0,0,0,0.4)` : 'none',
              }}
            >
              <div style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: isActive ? s.stageColor : 'var(--color-text-secondary)' }}>
                  <s.icon size={18} strokeWidth={2} />
                  <span style={{
                    fontFamily: 'var(--font-body)',
                    fontSize: '0.6rem',
                    fontWeight: 700,
                    letterSpacing: '0.05em',
                    textTransform: 'uppercase' as const,
                  }}>
                    {s.number}
                  </span>
                </div>
                <span style={{
                  padding: '0.2rem 0.6rem',
                  borderRadius: 'var(--radius-full)',
                  background: isActive ? `${s.stageColor}15` : 'rgba(255,255,255,0.04)',
                  border: `1px solid ${isActive ? s.stageColor + '33' : 'var(--color-border)'}`,
                  fontFamily: 'var(--font-body)',
                  fontSize: '0.65rem',
                  fontWeight: 600,
                  color: isActive ? s.stageColor : 'var(--color-text-muted)',
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
                color: 'var(--color-text-primary)',
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
            {/* Stage subtitle */}
            <div style={{
              marginBottom: '2rem',
              borderBottom: '1px solid var(--color-border)',
              paddingBottom: '1.5rem',
              display: 'flex',
              alignItems: 'center',
              gap: '1rem',
            }}>
              <div style={{
                width: 40,
                height: 40,
                borderRadius: 'var(--radius-sm)',
                background: stage.stageBg,
                border: `1px solid ${stage.stageBorder}`,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0,
              }}>
                <stage.icon size={20} color={stage.stageColor} />
              </div>
              <div>
                <span style={{
                  fontFamily: 'var(--font-body)',
                  fontSize: '0.65rem',
                  fontWeight: 700,
                  color: stage.stageColor,
                  textTransform: 'uppercase',
                  letterSpacing: '0.08em',
                }}>
                  Etapa {stage.number}
                </span>
                <p style={{
                  fontFamily: 'var(--font-body)',
                  fontSize: 'var(--text-body-lg)',
                  color: 'var(--color-text-secondary)',
                  margin: 0,
                }}>
                  {stage.focus}
                </p>
              </div>
            </div>

            {/* Tools grid - 3 columns */}
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(3, 1fr)',
              gap: '1.25rem',
            }}
            className="tools-landing-grid"
            >
              {stage.tools.map((tool, i) => {
                const catColor = CATEGORY_COLORS[tool.category] || { color: 'var(--color-ink)', bg: 'rgba(0,0,0,0.06)' }
                const ToolIcon = tool.icon
                return (
                  <motion.div
                    key={tool.name}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ type: 'spring', damping: 20, stiffness: 100, delay: i * 0.06 }}
                    whileHover={{ y: -3, boxShadow: '0 12px 28px -8px rgba(0,0,0,0.5)' }}
                    style={{
                      padding: '1.75rem',
                      borderRadius: 12,
                      border: '1px solid var(--color-border)',
                      background: 'var(--color-bg-card)',
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '0.875rem',
                      cursor: 'default',
                      transition: 'box-shadow 0.15s var(--ease-smooth), transform 0.15s var(--ease-smooth), border-color 0.15s ease',
                      boxShadow: 'var(--shadow-card)',
                      position: 'relative',
                      overflow: 'hidden',
                    }}
                  >
                    {/* Subtle gradient overlay */}
                    <div style={{
                      position: 'absolute',
                      top: 0,
                      right: 0,
                      width: 120,
                      height: 120,
                      background: `radial-gradient(circle at top right, ${stage.stageBg}, transparent)`,
                      pointerEvents: 'none',
                    }} />

                    {/* Top row: icon + badges */}
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', position: 'relative' }}>
                      <div style={{
                        width: 42,
                        height: 42,
                        borderRadius: 'var(--radius-sm)',
                        background: stage.stageBg,
                        border: `1px solid ${stage.stageBorder}`,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        flexShrink: 0,
                      }}>
                        <ToolIcon size={20} color={stage.stageColor} strokeWidth={1.8} />
                      </div>
                      <div style={{ display: 'flex', gap: '0.375rem', flexWrap: 'wrap' }}>
                        <span style={{
                          padding: '3px 10px',
                          borderRadius: 'var(--radius-full)',
                          background: catColor.bg,
                          fontFamily: 'var(--font-body)',
                          fontSize: '0.65rem',
                          fontWeight: 700,
                          color: catColor.color,
                          letterSpacing: '0.06em',
                          textTransform: 'uppercase',
                        }}>
                          {tool.category}
                        </span>
                      </div>
                    </div>

                    {/* Tool name */}
                    <h4 style={{
                      fontFamily: 'var(--font-heading)',
                      fontSize: 'var(--text-heading-md)',
                      fontWeight: 700,
                      color: 'var(--color-ink)',
                      letterSpacing: '-0.02em',
                      margin: 0,
                      lineHeight: 1.2,
                      position: 'relative',
                    }}>
                      {tool.name}
                    </h4>

                    {/* Description */}
                    <p style={{
                      fontFamily: 'var(--font-body)',
                      fontSize: '0.75rem',
                      lineHeight: 1.55,
                      color: 'var(--color-text-secondary)',
                      margin: 0,
                      position: 'relative',
                    }}>
                      {tool.desc}
                    </p>
                  </motion.div>
                )
              })}
            </div>

            {/* CTA link */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
              style={{
                marginTop: '2.5rem',
                textAlign: 'center',
              }}
            >
              <Link
                href="/tools"
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  fontFamily: 'var(--font-body)',
                  fontSize: '0.8rem',
                  fontWeight: 600,
                  color: '#fff',
                  textDecoration: 'none',
                  padding: '0.875rem 1.75rem',
                  borderRadius: 12,
                  background: 'var(--color-accent-primary)',
                  border: 'none',
                  boxShadow: '0 4px 14px rgba(255,107,74,0.25)',
                  transition: 'all 0.15s ease',
                }}
                className="tools-cta-link"
              >
                Ver todas las herramientas
                <ArrowRight size={18} />
              </Link>
            </motion.div>
          </motion.div>
        </AnimatePresence>
      </div>

      <style>{`
        .tools-landing-grid {
          grid-template-columns: repeat(3, 1fr) !important;
        }
        @media (max-width: 900px) {
          .tools-landing-grid {
            grid-template-columns: repeat(2, 1fr) !important;
          }
        }
        @media (max-width: 600px) {
          .tools-landing-grid {
            grid-template-columns: 1fr !important;
          }
        }
        .tools-cta-link:hover {
          background-color: var(--color-accent-hover) !important;
          color: #fff !important;
          transform: translateY(-1px);
        }
      `}</style>
    </section>
  )
}
