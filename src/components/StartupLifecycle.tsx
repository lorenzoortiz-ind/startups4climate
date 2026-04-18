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
} from 'lucide-react'

const stages = [
  {
    id: 'pre-incubacion',
    icon: FlaskConical,
    number: '01',
    title: 'Pre-incubación',
    focus: 'Define tu propósito, descubre tu mercado y entiende a tu usuario',
    accent: 'ember' as const,
    tools: [
      { name: 'Propósito & Equipo', icon: Users, desc: 'Define por qué existes y evalúa brechas del equipo fundador.' },
      { name: 'Segmentación', icon: BarChart3, desc: 'Explora todos los posibles segmentos donde tu idea crea valor.' },
      { name: 'Mercado inicial', icon: Target, desc: 'Elige tu primer mercado de entrada, donde ganarás tu primera batalla.' },
      { name: 'Usuario final', icon: UserCircle, desc: 'Construye un perfil detallado de quién es el usuario final.' },
      { name: 'Cálculo del TAM', icon: Calculator, desc: 'Calcula el tamaño de tu mercado con análisis bottom-up.' },
      { name: 'Persona', icon: Map, desc: 'Crea una persona concreta y representativa de tu mercado.' },
    ],
  },
  {
    id: 'incubacion',
    icon: Rocket,
    number: '02',
    title: 'Incubación',
    focus: 'Valida tu propuesta de valor y diseña tu producto mínimo viable',
    accent: 'electric' as const,
    tools: [
      { name: 'Ciclo de uso', icon: Layers, desc: 'Mapea cómo tu Persona descubre, adquiere, usa y recomienda.' },
      { name: 'Especificación', icon: FileText, desc: 'Define qué hace tu producto y qué NO hace.' },
      { name: 'Propuesta de valor', icon: Lightbulb, desc: 'Cuantifica en números el valor que entregas al cliente.' },
      { name: 'Primeros 10 clientes', icon: Handshake, desc: 'Identifica con nombre y apellido a tus primeros 10 clientes.' },
      { name: 'Core & Competencia', icon: Shield, desc: 'Define tu ventaja competitiva sostenible y mapea la competencia.' },
      { name: 'Lean Canvas', icon: PieChart, desc: 'Modelo de negocio en una página que sintetiza problema y solución.' },
    ],
  },
  {
    id: 'aceleracion',
    icon: Building2,
    number: '03',
    title: 'Aceleración',
    focus: 'Estructura tu modelo de negocio, pricing y proceso de ventas',
    accent: 'ember' as const,
    tools: [
      { name: 'DMU', icon: Briefcase, desc: 'Identifica todas las personas que influyen en la decisión de compra.' },
      { name: 'Adquisición', icon: Megaphone, desc: 'Mapea paso a paso cómo un cliente pasa de no conocerte a comprar.' },
      { name: 'Modelo de negocio', icon: Layers, desc: 'Estructura cómo tu startup genera, entrega y captura valor.' },
      { name: 'Pricing', icon: DollarSign, desc: 'Define tu estructura de precios basada en valor entregado.' },
      { name: 'LTV & Economics', icon: LineChart, desc: 'Calcula LTV, COCA y métricas clave de tus clientes.' },
      { name: 'Proceso de ventas', icon: Handshake, desc: 'Diseña tu proceso de ventas para que sea escalable.' },
    ],
  },
  {
    id: 'escalamiento',
    icon: TrendingUp,
    number: '04',
    title: 'Escalamiento',
    focus: 'Valida tu tracción, construye tu producto y prepara tu ronda de inversión',
    accent: 'electric' as const,
    tools: [
      { name: 'Supuestos clave', icon: Beaker, desc: 'Lista y prioriza los supuestos más riesgosos con experimentos rápidos.' },
      { name: 'Producto mínimo viable', icon: Package, desc: 'Define la versión más pequeña de tu producto que entrega valor.' },
      { name: 'Validación', icon: ShieldCheck, desc: 'Demuestra con evidencia que los clientes quieren y pagan.' },
      { name: 'Plan & Expansión', icon: Expand, desc: 'Desarrolla tu roadmap de producto y mercados adyacentes.' },
      { name: 'Pitch deck', icon: Presentation, desc: 'Construye tu narrativa para inversores con los 12 slides esenciales.' },
      { name: 'Cap table', icon: Wallet, desc: 'Simula tu estructura accionaria en múltiples rondas de inversión.' },
    ],
  },
]

export default function StartupLifecycle() {
  const [activeStage, setActiveStage] = useState(0)
  const stage = stages[activeStage]
  const isEmber = stage.accent === 'ember'
  const accentColor = isEmber ? '#F0721D' : '#5C9BFF'

  return (
    <section
      id="ciclo-de-vida"
      style={{
        position: 'relative',
        padding: 'clamp(5rem, 10vw, 8rem) 0',
        background: 'var(--color-bg-primary)',
        overflow: 'hidden',
      }}
    >
      <div
        style={{
          maxWidth: 1280,
          margin: '0 auto',
          padding: '0 clamp(1.25rem, 4vw, 3rem)',
          position: 'relative',
          zIndex: 1,
        }}
      >
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.6 }}
          style={{ textAlign: 'center', maxWidth: 760, margin: '0 auto 3.5rem' }}
        >
          <span className="pill-ember" style={{ marginBottom: '1.5rem' }}>
            <span className="dot" /> Toolkit por etapa
          </span>
          <h2
            style={{
              fontFamily: 'var(--font-heading)',
              fontSize: 'clamp(2rem, 4.5vw, 3.4rem)',
              fontWeight: 500,
              lineHeight: 1.05,
              letterSpacing: '-0.03em',
              color: 'var(--color-ink)',
              margin: '1rem 0 1.25rem',
            }}
          >
            +30 herramientas para{' '}
            <span className="text-ember">crecer y escalar</span>
          </h2>
          <p
            style={{
              fontFamily: 'var(--font-body)',
              fontSize: 'clamp(1rem, 1.3vw, 1.15rem)',
              lineHeight: 1.55,
              color: 'var(--color-text-secondary)',
              margin: 0,
            }}
          >
            Organizadas en las 4 etapas clave del desarrollo de tu startup.
          </p>
        </motion.div>

        {/* Stage tabs */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
            gap: '0.75rem',
            marginBottom: '2.5rem',
          }}
        >
          {stages.map((s, i) => {
            const isActive = activeStage === i
            const sIsEmber = s.accent === 'ember'
            const sAccent = sIsEmber ? '#F0721D' : '#5C9BFF'
            return (
              <button
                key={s.id}
                onClick={() => setActiveStage(i)}
                style={{
                  padding: '1.1rem 1.25rem',
                  borderRadius: 14,
                  border: isActive
                    ? `1px solid ${sAccent}55`
                    : '1px solid rgba(255,255,255,0.08)',
                  background: isActive
                    ? sIsEmber
                      ? 'rgba(218,78,36,0.08)'
                      : 'rgba(31,119,246,0.08)'
                    : 'rgba(14,14,14,0.6)',
                  color: 'var(--color-text-primary)',
                  cursor: 'pointer',
                  textAlign: 'left',
                  transition: 'all 0.2s var(--ease-smooth)',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '0.5rem',
                  backdropFilter: 'blur(12px)',
                  WebkitBackdropFilter: 'blur(12px)',
                }}
              >
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem',
                    color: isActive ? sAccent : 'var(--color-text-muted)',
                  }}
                >
                  <s.icon size={16} strokeWidth={2} />
                  <span
                    style={{
                      fontFamily: 'var(--font-body)',
                      fontSize: '0.65rem',
                      fontWeight: 600,
                      letterSpacing: '0.08em',
                      textTransform: 'uppercase',
                    }}
                  >
                    Etapa {s.number}
                  </span>
                </div>
                <span
                  style={{
                    fontFamily: 'var(--font-heading)',
                    fontSize: '1.05rem',
                    fontWeight: 500,
                    letterSpacing: '-0.02em',
                    color: 'var(--color-ink)',
                  }}
                >
                  {s.title}
                </span>
              </button>
            )
          })}
        </div>

        {/* Stage content */}
        <AnimatePresence mode="wait">
          <motion.div
            key={stage.id}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.3 }}
          >
            {/* Focus banner */}
            <div
              className="glass-card"
              style={{
                padding: '1.25rem 1.5rem',
                borderRadius: 14,
                marginBottom: '1.5rem',
                display: 'flex',
                alignItems: 'center',
                gap: '1rem',
                border: `1px solid ${accentColor}33`,
              }}
            >
              <div
                style={{
                  width: 38,
                  height: 38,
                  borderRadius: 10,
                  background: isEmber
                    ? 'linear-gradient(135deg, rgba(218,78,36,0.18), rgba(255,137,24,0.10))'
                    : 'linear-gradient(135deg, rgba(31,119,246,0.18), rgba(31,119,246,0.08))',
                  border: `1px solid ${accentColor}55`,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: accentColor,
                  flexShrink: 0,
                }}
              >
                <stage.icon size={18} />
              </div>
              <p
                style={{
                  fontFamily: 'var(--font-body)',
                  fontSize: '0.95rem',
                  color: 'var(--color-text-secondary)',
                  margin: 0,
                  lineHeight: 1.4,
                }}
              >
                {stage.focus}
              </p>
            </div>

            {/* Tools grid */}
            <div
              className="lc-tools-grid"
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(3, 1fr)',
                gap: '1rem',
              }}
            >
              {stage.tools.map((tool, i) => {
                const ToolIcon = tool.icon
                return (
                  <motion.div
                    key={tool.name}
                    initial={{ opacity: 0, y: 14 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4, delay: i * 0.04 }}
                    className="glass-card"
                    style={{
                      padding: '1.5rem',
                      borderRadius: 14,
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '0.75rem',
                    }}
                  >
                    <div
                      style={{
                        width: 38,
                        height: 38,
                        borderRadius: 10,
                        background: isEmber
                          ? 'linear-gradient(135deg, rgba(218,78,36,0.18), rgba(255,137,24,0.10))'
                          : 'linear-gradient(135deg, rgba(31,119,246,0.18), rgba(31,119,246,0.08))',
                        border: `1px solid ${accentColor}40`,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: accentColor,
                        flexShrink: 0,
                      }}
                    >
                      <ToolIcon size={16} strokeWidth={2} />
                    </div>
                    <h4
                      style={{
                        fontFamily: 'var(--font-heading)',
                        fontSize: '1.05rem',
                        fontWeight: 500,
                        color: 'var(--color-ink)',
                        letterSpacing: '-0.02em',
                        margin: 0,
                        lineHeight: 1.2,
                      }}
                    >
                      {tool.name}
                    </h4>
                    <p
                      style={{
                        fontFamily: 'var(--font-body)',
                        fontSize: '0.82rem',
                        lineHeight: 1.5,
                        color: 'var(--color-text-secondary)',
                        margin: 0,
                      }}
                    >
                      {tool.desc}
                    </p>
                  </motion.div>
                )
              })}
            </div>

            <div style={{ marginTop: '2.5rem', textAlign: 'center' }}>
              <Link href="/tools" className="btn-ember">
                Ver todas las herramientas <ArrowRight size={16} />
              </Link>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>

      <style>{`
        @media (max-width: 900px) {
          .lc-tools-grid {
            grid-template-columns: repeat(2, 1fr) !important;
          }
        }
        @media (max-width: 600px) {
          .lc-tools-grid {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </section>
  )
}
