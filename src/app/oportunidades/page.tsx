import type { Metadata } from 'next'
import { createClient } from '@supabase/supabase-js'
import Link from 'next/link'
import {
  Landmark,
  Rocket,
  Trophy,
  Banknote,
  GraduationCap,
  ArrowRight,
  MapPin,
} from 'lucide-react'

export const metadata: Metadata = {
  title: 'Oportunidades de Financiamiento LATAM | Startups4Climate',
  description:
    'Grants, aceleradoras, fondos de inversión y competencias para startups de impacto en América Latina. Actualizado diariamente con oportunidades verificadas.',
  keywords: [
    'grants startups LATAM',
    'fondos startups impacto',
    'aceleradoras america latina',
    'financiamiento startups climaticas',
    'oportunidades emprendimiento LATAM',
    'convocatorias startups 2026',
  ],
  alternates: {
    canonical: 'https://www.startups4climate.org/oportunidades',
  },
  openGraph: {
    title: 'Oportunidades de Financiamiento LATAM | Startups4Climate',
    description:
      'Grants, aceleradoras, fondos y competencias para startups de impacto en América Latina. Actualizado diariamente.',
    url: 'https://www.startups4climate.org/oportunidades',
    type: 'website',
  },
}

export const revalidate = 3600

type Opportunity = {
  id: string
  title: string
  organization: string
  description: string | null
  type: string
  amount_min: number | null
  amount_max: number | null
  currency: string
  eligible_countries: string[]
  is_rolling: boolean
  deadline: string | null
  application_url: string | null
}

const TYPE_CONFIG: Record<string, { icon: typeof Landmark; label: string; color: string }> = {
  grant: { icon: Landmark, label: 'Grant', color: '#1F77F6' },
  accelerator: { icon: Rocket, label: 'Aceleradora', color: '#DA4E24' },
  competition: { icon: Trophy, label: 'Competencia', color: '#D4A017' },
  fund: { icon: Banknote, label: 'Fondo', color: '#16a34a' },
  fellowship: { icon: GraduationCap, label: 'Fellowship', color: '#7c3aed' },
}

const COUNTRY_NAMES: Record<string, string> = {
  PE: 'Peru',
  CL: 'Chile',
  CO: 'Colombia',
  MX: 'Mexico',
  AR: 'Argentina',
  BR: 'Brasil',
}

function formatAmount(min: number | null, max: number | null): string {
  if (!min && !max) return ''
  const fmt = (n: number) => (n >= 1000 ? `$${(n / 1000).toFixed(0)}K` : `$${n}`)
  if (min && max) return `${fmt(min)} - ${fmt(max)}`
  if (max) return `Hasta ${fmt(max)}`
  return `Desde ${fmt(min!)}`
}

function formatDeadline(deadline: string | null, isRolling: boolean): string {
  if (isRolling) return 'Convocatoria permanente'
  if (!deadline) return ''
  const d = new Date(deadline)
  return `Cierre: ${d.toLocaleDateString('es-419', { day: 'numeric', month: 'long', year: 'numeric' })}`
}

async function getPublicOpportunities(): Promise<Opportunity[]> {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  if (!url || !key) return []

  const supabase = createClient(url, key, {
    auth: { persistSession: false, autoRefreshToken: false },
  })

  const { data } = await supabase
    .from('opportunities')
    .select('id, title, organization, description, type, amount_min, amount_max, currency, eligible_countries, is_rolling, deadline, application_url')
    .eq('is_active', true)
    .order('created_at', { ascending: false })
    .limit(12)

  return (data as Opportunity[]) || []
}

export default async function OportunidadesPublicPage() {
  const opportunities = await getPublicOpportunities()

  return (
    <main
      id="main-content"
      style={{
        maxWidth: 960,
        margin: '0 auto',
        padding: '3rem 1.5rem 4rem',
      }}
    >
      {/* Hero */}
      <div style={{ marginBottom: '2.5rem' }}>
        <div
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.375rem',
            padding: '0.25rem 0.75rem',
            borderRadius: 999,
            background: 'rgba(218,78,36,0.08)',
            border: '1px solid rgba(218,78,36,0.15)',
            fontSize: 'var(--text-2xs)',
            fontWeight: 600,
            color: '#DA4E24',
            marginBottom: '1rem',
          }}
        >
          <Banknote size={12} />
          Actualizado diariamente
        </div>
        <h1
          style={{
            fontFamily: 'var(--font-heading)',
            fontSize: 'clamp(1.5rem, 4vw, 2.25rem)',
            fontWeight: 500,
            letterSpacing: '-0.025em',
            lineHeight: 1.1,
            color: 'var(--color-ink)',
            margin: '0 0 0.75rem',
          }}
        >
          Oportunidades de Financiamiento para Startups LATAM
        </h1>
        <p
          style={{
            fontFamily: 'var(--font-body)',
            fontSize: 'var(--text-base)',
            color: 'var(--color-text-secondary)',
            lineHeight: 1.6,
            maxWidth: '60ch',
            margin: 0,
          }}
        >
          Grants, aceleradoras, fondos de inversión y competencias para startups de
          impacto en América Latina. Curado y verificado con IA.
        </p>
      </div>

      {/* Opportunities Grid */}
      {opportunities.length > 0 ? (
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(min(300px, 100%), 1fr))',
            gap: '1.25rem',
            marginBottom: '3rem',
          }}
        >
          {opportunities.map((opp) => {
            const config = TYPE_CONFIG[opp.type] || TYPE_CONFIG.grant
            const Icon = config.icon
            const amount = formatAmount(opp.amount_min, opp.amount_max)
            const deadline = formatDeadline(opp.deadline, opp.is_rolling)
            const countries = opp.eligible_countries
              ?.map((c) => COUNTRY_NAMES[c] || c)
              .join(', ')

            const href = opp.application_url || '#'
            return (
              <a
                key={opp.id}
                href={href}
                target={href !== '#' ? '_blank' : undefined}
                rel={href !== '#' ? 'noopener noreferrer' : undefined}
                style={{ textDecoration: 'none', color: 'inherit' }}
              >
              <article
                style={{
                  background: 'var(--color-bg-card)',
                  border: '1px solid var(--color-border)',
                  borderRadius: 'var(--radius-card)',
                  padding: '1.25rem',
                  boxShadow: 'var(--shadow-card)',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '0.625rem',
                  transition: 'border-color 0.15s ease, box-shadow 0.15s ease',
                  cursor: 'pointer',
                  height: '100%',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap' }}>
                  <span
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '0.25rem',
                      fontSize: 'var(--text-2xs)',
                      padding: '0.125rem 0.5rem',
                      borderRadius: 999,
                      background: `${config.color}10`,
                      border: `1px solid ${config.color}25`,
                      color: config.color,
                      fontWeight: 600,
                    }}
                  >
                    <Icon size={11} />
                    {config.label}
                  </span>
                  {amount && (
                    <span
                      style={{
                        fontSize: 'var(--text-2xs)',
                        fontWeight: 700,
                        color: 'var(--color-ink)',
                        fontFamily: 'var(--font-heading)',
                      }}
                    >
                      {amount}
                    </span>
                  )}
                </div>
                <h2
                  style={{
                    fontFamily: 'var(--font-heading)',
                    fontSize: '0.9375rem',
                    fontWeight: 600,
                    color: 'var(--color-ink)',
                    lineHeight: 1.35,
                    margin: 0,
                  }}
                >
                  {opp.title}
                </h2>
                <p
                  style={{
                    fontFamily: 'var(--font-body)',
                    fontSize: 'var(--text-2xs)',
                    color: 'var(--color-text-muted)',
                    margin: 0,
                  }}
                >
                  {opp.organization}
                </p>
                {opp.description && (
                  <p
                    style={{
                      fontFamily: 'var(--font-body)',
                      fontSize: 'var(--text-sm)',
                      color: 'var(--color-text-secondary)',
                      lineHeight: 1.55,
                      margin: 0,
                      display: '-webkit-box',
                      WebkitLineClamp: 3,
                      WebkitBoxOrient: 'vertical',
                      overflow: 'hidden',
                    }}
                  >
                    {opp.description}
                  </p>
                )}
                <div
                  style={{
                    marginTop: 'auto',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '0.25rem',
                    fontSize: 'var(--text-2xs)',
                    color: 'var(--color-text-muted)',
                    fontFamily: 'var(--font-body)',
                  }}
                >
                  {deadline && <span>{deadline}</span>}
                  {countries && (
                    <span style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                      <MapPin size={10} />
                      {countries}
                    </span>
                  )}
                </div>
              </article>
              </a>
            )
          })}
        </div>
      ) : (
        <p
          style={{
            fontFamily: 'var(--font-body)',
            color: 'var(--color-text-muted)',
            textAlign: 'center',
            padding: '3rem 0',
          }}
        >
          Las oportunidades se actualizan diariamente. Vuelve pronto.
        </p>
      )}

      {/* CTA */}
      <div
        style={{
          textAlign: 'center',
          padding: '2.5rem 1.5rem',
          borderRadius: 16,
          background: 'linear-gradient(135deg, rgba(218,78,36,0.04), rgba(31,119,246,0.04))',
          border: '1px solid rgba(218,78,36,0.1)',
        }}
      >
        <h2
          style={{
            fontFamily: 'var(--font-heading)',
            fontSize: 'var(--text-lg)',
            fontWeight: 600,
            color: 'var(--color-ink)',
            margin: '0 0 0.5rem',
          }}
        >
          Ve todas las oportunidades y filtra por tu perfil
        </h2>
        <p
          style={{
            fontFamily: 'var(--font-body)',
            fontSize: 'var(--text-sm)',
            color: 'var(--color-text-secondary)',
            maxWidth: '50ch',
            margin: '0 auto 1.25rem',
            lineHeight: 1.6,
          }}
        >
          Crea tu cuenta gratuita para filtrar por país, vertical y etapa de tu startup.
          Recibe alertas de nuevas oportunidades.
        </p>
        <Link
          href="/?auth=register"
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.5rem',
            padding: '0.75rem 1.5rem',
            borderRadius: 10,
            background: 'var(--color-ember)',
            color: '#fff',
            fontFamily: 'var(--font-heading)',
            fontSize: 'var(--text-sm)',
            fontWeight: 600,
            textDecoration: 'none',
          }}
        >
          Crear cuenta gratis
          <ArrowRight size={16} />
        </Link>
      </div>
    </main>
  )
}
