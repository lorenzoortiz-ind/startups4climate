'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'
import {
  ArrowLeft,
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
        background: 'var(--color-bg-card)',
        borderRadius: 12,
        border: '1px solid var(--color-border)',
        borderLeft: `3px solid ${stageColor}`,
        padding: '1.25rem',
        boxShadow: 'var(--shadow-card)',
        display: 'flex',
        alignItems: 'flex-start',
        gap: '0.875rem',
        transition: 'all 0.2s ease',
        cursor: 'pointer',
        textDecoration: 'none',
      }}
      whileHover={{
        boxShadow: 'var(--shadow-card-hover)',
        y: -2,
      }}
    >
      <div style={{ flex: 1, minWidth: 0 }}>
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.625rem',
            marginBottom: '0.375rem',
            flexWrap: 'wrap',
          }}
        >
          <span
            style={{
              fontFamily: 'var(--font-heading)',
              fontSize: '0.875rem',
              fontWeight: 600,
              color: 'var(--color-ink)',
            }}
          >
            {tool.name}
          </span>
          <span
            style={{
              display: 'inline-block',
              padding: '0.125rem 0.5rem',
              borderRadius: 999,
              background: stageBg,
              border: `1px solid ${stageBorder}`,
              fontFamily: 'var(--font-body)',
              fontSize: 'var(--text-2xs)',
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
    <div style={{ padding: '2rem', maxWidth: 960, margin: '0 auto' }}>
        {/* Back link */}
        <Link
          href="/tools"
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.375rem',
            fontFamily: 'var(--font-body)',
            fontSize: 'var(--text-sm)',
            color: 'var(--color-text-muted)',
            textDecoration: 'none',
            marginBottom: '1.5rem',
          }}
        >
          <ArrowLeft size={14} />
          Volver al dashboard
        </Link>

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, ease: 'easeOut' }}
          style={{ marginBottom: '2rem' }}
        >
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.75rem',
              marginBottom: '0.5rem',
            }}
          >
            <div
              style={{
                width: 40,
                height: 40,
                borderRadius: 12,
                background: 'rgba(217,119,6,0.08)',
                border: '1px solid rgba(217,119,6,0.2)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0,
              }}
            >
              <Layers size={20} color="#D97706" />
            </div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <h1
                style={{
                  fontFamily: 'var(--font-heading)',
                  fontSize: 'var(--text-xl)',
                  fontWeight: 700,
                  color: 'var(--color-ink)',
                  letterSpacing: '-0.02em',
                  lineHeight: 1.3,
                  margin: 0,
                }}
              >
                Herramientas y Recursos Esenciales
              </h1>
              <p
                style={{
                  fontFamily: 'var(--font-body)',
                  fontSize: 'var(--text-sm)',
                  color: 'var(--color-text-secondary)',
                  lineHeight: 1.5,
                  margin: 0,
                }}
              >
                Las herramientas que necesitas en cada etapa para avanzar sin gastar de más
              </p>
            </div>
          </div>
        </motion.div>

        {/* Stages */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
          {stages.map((stage, si) => {
            const Icon = stage.icon
            return (
              <motion.section
                key={stage.id}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-40px' }}
                transition={{ duration: 0.45, delay: si * 0.08 }}
              >
                {/* Stage header */}
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.75rem',
                    marginBottom: '1rem',
                  }}
                >
                  <div
                    style={{
                      width: 36,
                      height: 36,
                      borderRadius: 10,
                      background: stage.bg,
                      border: `1px solid ${stage.border}`,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      flexShrink: 0,
                    }}
                  >
                    <Icon size={17} color={stage.color} strokeWidth={1.5} />
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div
                      style={{
                        fontFamily: 'var(--font-heading)',
                        fontSize: '0.875rem',
                        fontWeight: 700,
                        color: 'var(--color-ink)',
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
                      padding: '0.125rem 0.5rem',
                      borderRadius: 999,
                      background: stage.bg,
                      border: `1px solid ${stage.border}`,
                      fontFamily: 'var(--font-body)',
                      fontSize: 'var(--text-2xs)',
                      fontWeight: 700,
                      color: stage.color,
                      whiteSpace: 'nowrap',
                    }}
                  >
                    {stage.tools.length} herramientas
                  </div>
                </div>

                {/* Tool cards grid */}
                <div
                  style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fill, minmax(min(280px, 100%), 1fr))',
                    gap: '1rem',
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
            marginTop: '2.5rem',
            padding: '1.25rem 1.5rem',
            borderRadius: 12,
            background: 'linear-gradient(135deg, rgba(13,148,136,0.04), rgba(255,107,74,0.04))',
            border: '1px solid rgba(13,148,136,0.1)',
            textAlign: 'center',
          }}
        >
          <p
            style={{
              fontFamily: 'var(--font-body)',
              fontSize: '0.8125rem',
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
