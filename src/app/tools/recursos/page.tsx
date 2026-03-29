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
  url: string
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
    label: 'Pre-incubación',
    sublabel: 'Ideación y validación inicial',
    color: '#FF6B4A',
    bg: 'rgba(255,107,74,0.06)',
    border: 'rgba(255,107,74,0.15)',
    icon: FlaskConical,
    tools: [
      {
        name: 'Google Workspace',
        description:
          'Documentos, hojas de cálculo y presentaciones colaborativas. Gratis.',
        tag: 'Gratis',
        url: 'https://workspace.google.com/',
      },
      {
        name: 'Notion',
        description:
          'Base de conocimiento y gestión de proyectos. Gratis para equipos pequeños.',
        tag: 'Gratis',
        url: 'https://www.notion.so/',
      },
      {
        name: 'Claude',
        description:
          'Análisis profundo, investigación y estrategia con IA. Free tier disponible.',
        tag: 'Free tier',
        url: 'https://claude.ai/',
      },
      {
        name: 'Canva',
        description:
          'Diseño de presentaciones, logos y materiales visuales. Gratis.',
        tag: 'Gratis',
        url: 'https://www.canva.com/',
      },
      {
        name: 'WhatsApp Business',
        description: 'Comunicación con potenciales clientes. Gratis.',
        tag: 'Gratis',
        url: 'https://business.whatsapp.com/',
      },
    ],
  },
  {
    id: 2,
    label: 'Incubación',
    sublabel: 'Validación de mercado y prototipo',
    color: '#0D9488',
    bg: 'rgba(13,148,136,0.06)',
    border: 'rgba(13,148,136,0.15)',
    icon: Rocket,
    tools: [
      {
        name: 'Figma',
        description:
          'Prototipado y diseño de interfaces. Gratis para hasta 3 proyectos.',
        tag: 'Gratis',
        url: 'https://www.figma.com/',
      },
      {
        name: 'Typeform / Google Forms',
        description:
          'Encuestas y formularios de validación. Gratis.',
        tag: 'Gratis',
        url: 'https://www.typeform.com/',
      },
      {
        name: 'Mailchimp / Brevo',
        description:
          'Email marketing para nutrir leads. Gratis hasta 300 envíos/día.',
        tag: 'Gratis',
        url: 'https://mailchimp.com/',
      },
      {
        name: 'Trello / Linear',
        description: 'Gestión de tareas y sprints. Gratis.',
        tag: 'Gratis',
        url: 'https://trello.com/',
      },
      {
        name: 'Calendly',
        description: 'Agenda reuniones automáticamente. Gratis.',
        tag: 'Gratis',
        url: 'https://calendly.com/',
      },
    ],
  },
  {
    id: 3,
    label: 'Aceleración',
    sublabel: 'Producto en mercado y primeros clientes',
    color: '#2A222B',
    bg: 'rgba(42,34,43,0.06)',
    border: 'rgba(42,34,43,0.15)',
    icon: Building2,
    tools: [
      {
        name: 'Supabase',
        description:
          'Base de datos, auth y storage para tu producto. Gratis.',
        tag: 'Gratis',
        url: 'https://supabase.com/',
      },
      {
        name: 'Vercel / Netlify',
        description: 'Despliegue de aplicaciones web. Gratis.',
        tag: 'Gratis',
        url: 'https://vercel.com/',
      },
      {
        name: 'Stripe',
        description: 'Procesamiento de pagos. Paga por uso.',
        tag: 'Paga por uso',
        url: 'https://stripe.com/',
      },
      {
        name: 'HubSpot CRM',
        description:
          'Gestión de clientes y pipeline de ventas. Gratis.',
        tag: 'Gratis',
        url: 'https://www.hubspot.com/products/crm',
      },
      {
        name: 'Google Analytics',
        description: 'Analítica web y de producto. Gratis.',
        tag: 'Gratis',
        url: 'https://analytics.google.com/',
      },
    ],
  },
  {
    id: 4,
    label: 'Escalamiento',
    sublabel: 'Crecimiento y expansión',
    color: '#0D9488',
    bg: 'rgba(13,148,136,0.06)',
    border: 'rgba(13,148,136,0.15)',
    icon: TrendingUp,
    tools: [
      {
        name: 'AWS / GCP',
        description:
          'Infraestructura cloud escalable. Créditos para startups.',
        tag: 'Free tier',
        url: 'https://aws.amazon.com/startups/',
      },
      {
        name: 'Mixpanel / Amplitude',
        description: 'Analítica de producto avanzada. Free tier.',
        tag: 'Free tier',
        url: 'https://mixpanel.com/',
      },
      {
        name: 'Notion + Pitch',
        description: 'Data Room y pitch deck profesional.',
        tag: 'Gratis',
        url: 'https://pitch.com/',
      },
      {
        name: 'QuickBooks / Xero',
        description: 'Contabilidad y finanzas. Prueba gratis.',
        tag: 'Prueba gratis',
        url: 'https://quickbooks.intuit.com/',
      },
      {
        name: 'Loom',
        description: 'Videos de demo y onboarding. Gratis.',
        tag: 'Gratis',
        url: 'https://www.loom.com/',
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
    <motion.a
      href={tool.url}
      target="_blank"
      rel="noopener noreferrer"
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
        cursor: 'pointer',
        textDecoration: 'none',
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
              borderRadius: 8,
              background: stageBg,
              border: `1px solid ${stageBorder}`,
              fontFamily: 'var(--font-body)',
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
      <ExternalLink size={14} color={stageColor} style={{ flexShrink: 0, marginTop: 5, opacity: 0.6 }} />
    </motion.a>
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
            borderRadius: 8,
            background: 'rgba(13,148,136,0.06)',
            border: '1px solid rgba(13,148,136,0.12)',
            fontFamily: 'var(--font-body)',
            fontSize: '0.6875rem',
            fontWeight: 600,
            color: '#0D9488',
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
            fontWeight: 400,
            lineHeight: 1.15,
            letterSpacing: '-0.025em',
            color: 'var(--color-text-primary)',
            marginBottom: '0.75rem',
          }}
        >
          Herramientas y Recursos Esenciales
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
          Las herramientas que necesitas en cada etapa para avanzar sin gastar de más.
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
                    borderRadius: 8,
                    background: 'var(--color-bg-card, #ffffff)',
                    border: `1px solid ${stage.border}`,
                    fontFamily: 'var(--font-body)',
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
          background: 'linear-gradient(135deg, rgba(13,148,136,0.04), rgba(255,107,74,0.04))',
          border: '1px solid rgba(13,148,136,0.1)',
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
          Este stack se actualiza regularmente. Si conoces una herramienta que debería
          estar aquí, escríbenos a{' '}
          <a
            href="https://wa.me/51989338401?text=Hola%2C%20vengo%20de%20Startups4climate%20y%20tengo%20una%20sugerencia%20de%20herramienta%20para%20el%20stack%20tecnol%C3%B3gico."
            target="_blank"
            rel="noopener noreferrer"
            style={{
              color: '#0D9488',
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
