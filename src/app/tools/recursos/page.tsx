'use client'

import { motion } from 'framer-motion'
import {
  Layers,
  FlaskConical,
  Rocket,
  Building2,
  TrendingUp,
  ExternalLink,
} from 'lucide-react'

/* ─── Stage definitions ─── */
interface Tool {
  name: string
  description: string
  tag: string
}

interface Stage {
  id: number
  label: string
  sublabel: string
  color: string
  bg: string
  border: string
  icon: typeof FlaskConical
  tools: Tool[]
}

const stages: Stage[] = [
  {
    id: 1,
    label: 'Pre-incubacion',
    sublabel: 'Ideacion y validacion inicial',
    color: '#7C3AED',
    bg: 'rgba(124,58,237,0.06)',
    border: 'rgba(124,58,237,0.15)',
    icon: FlaskConical,
    tools: [
      {
        name: 'Google Workspace',
        description:
          'Documentos, hojas de calculo y presentaciones colaborativas. Gratis.',
        tag: 'Gratis',
      },
      {
        name: 'Notion',
        description:
          'Base de conocimiento y gestion de proyectos. Gratis para equipos pequenos.',
        tag: 'Gratis',
      },
      {
        name: 'Claude',
        description:
          'Analisis profundo, investigacion y estrategia con IA. Free tier disponible.',
        tag: 'Free tier',
      },
      {
        name: 'Canva',
        description:
          'Diseno de presentaciones, logos y materiales visuales. Gratis.',
        tag: 'Gratis',
      },
      {
        name: 'WhatsApp Business',
        description: 'Comunicacion con potenciales clientes. Gratis.',
        tag: 'Gratis',
      },
    ],
  },
  {
    id: 2,
    label: 'Incubacion',
    sublabel: 'Validacion de mercado y prototipo',
    color: '#059669',
    bg: 'rgba(5,150,105,0.06)',
    border: 'rgba(5,150,105,0.15)',
    icon: Rocket,
    tools: [
      {
        name: 'Figma',
        description:
          'Prototipado y diseno de interfaces. Gratis para hasta 3 proyectos.',
        tag: 'Gratis',
      },
      {
        name: 'Typeform / Google Forms',
        description:
          'Encuestas y formularios de validacion. Gratis.',
        tag: 'Gratis',
      },
      {
        name: 'Mailchimp / Brevo',
        description:
          'Email marketing para nutrir leads. Gratis hasta 300 envios/dia.',
        tag: 'Gratis',
      },
      {
        name: 'Trello / Linear',
        description: 'Gestion de tareas y sprints. Gratis.',
        tag: 'Gratis',
      },
      {
        name: 'Calendly',
        description: 'Agenda reuniones automaticamente. Gratis.',
        tag: 'Gratis',
      },
    ],
  },
  {
    id: 3,
    label: 'Aceleracion',
    sublabel: 'Producto en mercado y primeros clientes',
    color: '#D97706',
    bg: 'rgba(217,119,6,0.06)',
    border: 'rgba(217,119,6,0.15)',
    icon: Building2,
    tools: [
      {
        name: 'Supabase',
        description:
          'Base de datos, auth y storage para tu producto. Gratis.',
        tag: 'Gratis',
      },
      {
        name: 'Vercel / Netlify',
        description: 'Despliegue de aplicaciones web. Gratis.',
        tag: 'Gratis',
      },
      {
        name: 'Stripe',
        description: 'Procesamiento de pagos. Paga por uso.',
        tag: 'Paga por uso',
      },
      {
        name: 'HubSpot CRM',
        description:
          'Gestion de clientes y pipeline de ventas. Gratis.',
        tag: 'Gratis',
      },
      {
        name: 'Google Analytics',
        description: 'Analitica web y de producto. Gratis.',
        tag: 'Gratis',
      },
    ],
  },
  {
    id: 4,
    label: 'Escalamiento',
    sublabel: 'Crecimiento y expansion',
    color: '#0891B2',
    bg: 'rgba(8,145,178,0.06)',
    border: 'rgba(8,145,178,0.15)',
    icon: TrendingUp,
    tools: [
      {
        name: 'AWS / GCP',
        description:
          'Infraestructura cloud escalable. Creditos para startups.',
        tag: 'Free tier',
      },
      {
        name: 'Mixpanel / Amplitude',
        description: 'Analitica de producto avanzada. Free tier.',
        tag: 'Free tier',
      },
      {
        name: 'Notion + Pitch',
        description: 'Data Room y pitch deck profesional.',
        tag: 'Gratis',
      },
      {
        name: 'QuickBooks / Xero',
        description: 'Contabilidad y finanzas. Prueba gratis.',
        tag: 'Prueba gratis',
      },
      {
        name: 'Loom',
        description: 'Videos de demo y onboarding. Gratis.',
        tag: 'Gratis',
      },
    ],
  },
]

function ToolCard({
  tool,
  stageColor,
  stageBg,
  stageBorder,
  index,
}: {
  tool: Tool
  stageColor: string
  stageBg: string
  stageBorder: string
  index: number
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 14 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-20px' }}
      transition={{ duration: 0.35, delay: index * 0.06 }}
      style={{
        background: 'var(--color-bg-card, #ffffff)',
        borderRadius: 14,
        border: '1px solid var(--color-border, #e5e7eb)',
        padding: '1.125rem 1.25rem',
        display: 'flex',
        alignItems: 'flex-start',
        gap: '0.875rem',
        transition: 'all 0.2s ease',
        cursor: 'default',
      }}
      whileHover={{
        boxShadow: `0 4px 24px ${stageColor}15`,
        borderColor: stageBorder,
        y: -2,
      }}
    >
      {/* Accent dot */}
      <div
        style={{
          width: 8,
          height: 8,
          borderRadius: '50%',
          background: stageColor,
          flexShrink: 0,
          marginTop: 7,
        }}
      />
      <div style={{ flex: 1, minWidth: 0 }}>
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.625rem',
            marginBottom: '0.25rem',
            flexWrap: 'wrap',
          }}
        >
          <span
            style={{
              fontFamily: 'var(--font-heading)',
              fontSize: '0.9375rem',
              fontWeight: 700,
              color: 'var(--color-text-primary)',
            }}
          >
            {tool.name}
          </span>
          <span
            style={{
              display: 'inline-block',
              padding: '0.125rem 0.5rem',
              borderRadius: 9999,
              background: stageBg,
              border: `1px solid ${stageBorder}`,
              fontFamily: 'var(--font-mono)',
              fontSize: '0.625rem',
              fontWeight: 600,
              color: stageColor,
              whiteSpace: 'nowrap',
            }}
          >
            {tool.tag}
          </span>
        </div>
        <p
          style={{
            fontFamily: 'var(--font-body)',
            fontSize: '0.8125rem',
            lineHeight: 1.55,
            color: 'var(--color-text-secondary)',
            margin: 0,
          }}
        >
          {tool.description}
        </p>
      </div>
    </motion.div>
  )
}

export default function RecursosPage() {
  return (
    <div style={{ padding: '2.5rem 1.5rem 4rem', maxWidth: 960, margin: '0 auto' }}>
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.45 }}
        style={{ marginBottom: '3rem', textAlign: 'center' }}
      >
        <div
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.5rem',
            padding: '0.3rem 0.875rem',
            borderRadius: 9999,
            background: 'rgba(5,150,105,0.06)',
            border: '1px solid rgba(5,150,105,0.12)',
            fontFamily: 'var(--font-mono)',
            fontSize: '0.6875rem',
            fontWeight: 600,
            color: '#059669',
            letterSpacing: '0.05em',
            textTransform: 'uppercase',
            marginBottom: '1rem',
          }}
        >
          <Layers size={12} />
          Recursos
        </div>
        <h1
          style={{
            fontFamily: 'var(--font-heading)',
            fontSize: 'clamp(1.75rem, 4vw, 2.5rem)',
            fontWeight: 800,
            lineHeight: 1.15,
            letterSpacing: '-0.025em',
            color: 'var(--color-text-primary)',
            marginBottom: '0.75rem',
          }}
        >
          Stack Tecnologico Recomendado
        </h1>
        <p
          style={{
            fontFamily: 'var(--font-body)',
            fontSize: '1.0625rem',
            lineHeight: 1.7,
            color: 'var(--color-text-secondary)',
            maxWidth: 640,
            margin: '0 auto',
          }}
        >
          Las herramientas que necesitas en cada etapa para avanzar sin gastar de mas.
          Todas son gratuitas o tienen planes accesibles para startups.
        </p>
      </motion.div>

      {/* Stages */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '2.5rem' }}>
        {stages.map((stage, si) => {
          const Icon = stage.icon
          return (
            <motion.section
              key={stage.id}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-40px' }}
              transition={{ duration: 0.45, delay: si * 0.08 }}
              style={{
                background: 'var(--color-bg-card, #ffffff)',
                borderRadius: 20,
                border: '1px solid var(--color-border, #e5e7eb)',
                overflow: 'hidden',
                boxShadow: '0 1px 3px rgba(0,0,0,0.04)',
              }}
            >
              {/* Stage header */}
              <div
                style={{
                  padding: '1.5rem 1.75rem',
                  background: stage.bg,
                  borderBottom: `1px solid ${stage.border}`,
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.875rem',
                }}
              >
                <div
                  style={{
                    width: 40,
                    height: 40,
                    borderRadius: 11,
                    background: 'var(--color-bg-card, #ffffff)',
                    border: `1px solid ${stage.border}`,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0,
                  }}
                >
                  <Icon size={18} color={stage.color} strokeWidth={1.5} />
                </div>
                <div>
                  <div
                    style={{
                      fontFamily: 'var(--font-heading)',
                      fontSize: '1.125rem',
                      fontWeight: 700,
                      color: 'var(--color-text-primary)',
                      lineHeight: 1.2,
                    }}
                  >
                    Etapa {stage.id}: {stage.label}
                  </div>
                  <div
                    style={{
                      fontFamily: 'var(--font-body)',
                      fontSize: '0.8125rem',
                      color: 'var(--color-text-secondary)',
                      marginTop: '0.125rem',
                    }}
                  >
                    {stage.sublabel}
                  </div>
                </div>
                <div
                  style={{
                    marginLeft: 'auto',
                    padding: '0.25rem 0.75rem',
                    borderRadius: 9999,
                    background: 'var(--color-bg-card, #ffffff)',
                    border: `1px solid ${stage.border}`,
                    fontFamily: 'var(--font-mono)',
                    fontSize: '0.6875rem',
                    fontWeight: 700,
                    color: stage.color,
                    whiteSpace: 'nowrap',
                  }}
                >
                  {stage.tools.length} herramientas
                </div>
              </div>

              {/* Tool cards */}
              <div
                style={{
                  padding: '1rem 1.25rem 1.25rem',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '0.625rem',
                }}
              >
                {stage.tools.map((tool, i) => (
                  <ToolCard
                    key={tool.name}
                    tool={tool}
                    stageColor={stage.color}
                    stageBg={stage.bg}
                    stageBorder={stage.border}
                    index={i}
                  />
                ))}
              </div>
            </motion.section>
          )
        })}
      </div>

      {/* Footer note */}
      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5, delay: 0.2 }}
        style={{
          marginTop: '3rem',
          padding: '1.5rem 2rem',
          borderRadius: 16,
          background: 'linear-gradient(135deg, rgba(5,150,105,0.04), rgba(124,58,237,0.04))',
          border: '1px solid rgba(5,150,105,0.1)',
          textAlign: 'center',
        }}
      >
        <p
          style={{
            fontFamily: 'var(--font-body)',
            fontSize: '0.9375rem',
            lineHeight: 1.65,
            color: 'var(--color-text-secondary)',
            margin: 0,
          }}
        >
          Este stack se actualiza regularmente. Si conoces una herramienta que deberia
          estar aqui, escribenos a{' '}
          <a
            href="https://wa.me/51989338401?text=Hola, tengo una sugerencia de herramienta para el stack tecnologico"
            target="_blank"
            rel="noopener noreferrer"
            style={{
              color: '#059669',
              fontWeight: 600,
              textDecoration: 'none',
            }}
          >
            WhatsApp
            <ExternalLink
              size={12}
              style={{ display: 'inline', marginLeft: 3, verticalAlign: 'middle' }}
            />
          </a>
          .
        </p>
      </motion.div>
    </div>
  )
}
