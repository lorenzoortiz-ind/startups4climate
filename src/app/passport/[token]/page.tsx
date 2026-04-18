import { notFound } from 'next/navigation'
import { createClient } from '@supabase/supabase-js'
import S4CLogo from '@/components/S4CLogo'
import { Activity, Globe, Link2, MapPin, Target, Users } from 'lucide-react'

export const dynamic = 'force-dynamic'
export const runtime = 'nodejs'

type StartupRow = {
  id: string
  name: string
  description: string | null
  vertical: string | null
  country: string | null
  stage: string | null
  diagnostic_score: number | null
  team_size: number | null
  website: string | null
  linkedin: string | null
  logo_url: string | null
  has_mvp: boolean | null
  has_paying_customers: boolean | null
  paying_customers_count: number | null
  monthly_revenue: number | null
  tools_completed: number | null
  is_public: boolean
  public_share_token: string | null
  updated_at: string
}

const STAGE_LABELS: Record<string, string> = {
  '1': 'Idea',
  '2': 'Pre-incubación',
  '3': 'Incubación',
  '4': 'Aceleración',
  '5': 'Escalamiento',
  ideation: 'Idea',
  pre_incubation: 'Pre-incubación',
  incubation: 'Incubación',
  acceleration: 'Aceleración',
  scaling: 'Escalamiento',
}

async function loadStartup(token: string): Promise<StartupRow | null> {
  // Use the anon client — RLS guarantees we only see is_public rows.
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    { auth: { persistSession: false, autoRefreshToken: false } }
  )

  const { data, error } = await supabase
    .from('startups')
    .select(
      'id,name,description,vertical,country,stage,diagnostic_score,team_size,website,linkedin,logo_url,has_mvp,has_paying_customers,paying_customers_count,monthly_revenue,tools_completed,is_public,public_share_token,updated_at'
    )
    .eq('public_share_token', token)
    .eq('is_public', true)
    .maybeSingle()

  if (error || !data) return null
  return data as StartupRow
}

const card: React.CSSProperties = {
  background: 'var(--color-bg-card)',
  border: '1px solid var(--color-border)',
  borderRadius: 'var(--radius-md)',
  padding: '1.5rem',
}

const label: React.CSSProperties = {
  fontFamily: 'var(--font-body)',
  fontSize: '0.65rem',
  color: 'var(--color-text-muted)',
  textTransform: 'uppercase',
  letterSpacing: '0.05em',
  marginBottom: 4,
}

const value: React.CSSProperties = {
  fontFamily: 'var(--font-body)',
  fontSize: '0.95rem',
  color: 'var(--color-text-primary)',
  fontWeight: 600,
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ token: string }>
}) {
  const { token } = await params
  const startup = await loadStartup(token)
  if (!startup) return { title: 'Startup Passport · Startups4Climate' }
  return {
    title: `${startup.name} · Startup Passport`,
    description:
      startup.description?.slice(0, 160) ||
      `Pasaporte público de ${startup.name} en Startups4Climate.`,
    openGraph: {
      title: `${startup.name} · Startup Passport`,
      description: startup.description?.slice(0, 160) || undefined,
    },
    robots: { index: true, follow: true },
  }
}

export default async function PublicPassportPage({
  params,
}: {
  params: Promise<{ token: string }>
}) {
  const { token } = await params
  const startup = await loadStartup(token)
  if (!startup) notFound()

  const stage = startup.stage ? STAGE_LABELS[startup.stage] || startup.stage : '—'

  return (
    <div
      style={{
        minHeight: '100vh',
        background: 'var(--color-bg-primary)',
        padding: '3rem 1.25rem',
      }}
    >
      <div style={{ maxWidth: 880, margin: '0 auto' }}>
        {/* Brand strip */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.6rem',
            marginBottom: '2rem',
          }}
        >
          <S4CLogo size={26} />
          <span
            style={{
              fontFamily: 'var(--font-heading)',
              fontWeight: 700,
              fontSize: '0.95rem',
              color: 'var(--color-text-primary)',
            }}
          >
            Startups<span style={{ color: '#DA4E24' }}>4</span>Climate
          </span>
          <span
            style={{
              marginLeft: 'auto',
              fontFamily: 'var(--font-body)',
              fontSize: '0.7rem',
              color: 'var(--color-text-muted)',
              padding: '0.25rem 0.6rem',
              border: '1px solid var(--color-border)',
              borderRadius: 999,
            }}
          >
            Passport público · solo lectura
          </span>
        </div>

        {/* Header card */}
        <div style={{ ...card, marginBottom: '1rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1rem' }}>
            {startup.logo_url ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={startup.logo_url}
                alt={`Logo ${startup.name}`}
                style={{ width: 64, height: 64, borderRadius: 12, objectFit: 'cover' }}
              />
            ) : (
              <div
                style={{
                  width: 64,
                  height: 64,
                  borderRadius: 12,
                  background: 'var(--color-bg-muted)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontFamily: 'var(--font-heading)',
                  fontWeight: 700,
                  fontSize: '1.5rem',
                  color: 'var(--color-text-secondary)',
                }}
              >
                {startup.name.charAt(0)}
              </div>
            )}
            <div style={{ flex: 1, minWidth: 0 }}>
              <h1
                style={{
                  fontFamily: 'var(--font-heading)',
                  fontWeight: 700,
                  fontSize: '1.5rem',
                  color: 'var(--color-text-primary)',
                  margin: 0,
                }}
              >
                {startup.name}
              </h1>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.75rem', marginTop: 6 }}>
                {startup.vertical && (
                  <span style={{ fontFamily: 'var(--font-body)', fontSize: '0.8rem', color: 'var(--color-text-secondary)' }}>
                    {startup.vertical}
                  </span>
                )}
                {startup.country && (
                  <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4, fontFamily: 'var(--font-body)', fontSize: '0.8rem', color: 'var(--color-text-secondary)' }}>
                    <MapPin size={12} /> {startup.country}
                  </span>
                )}
              </div>
            </div>
          </div>

          {startup.description && (
            <p
              style={{
                fontFamily: 'var(--font-body)',
                fontSize: '0.95rem',
                lineHeight: 1.65,
                color: 'var(--color-text-secondary)',
                margin: 0,
              }}
            >
              {startup.description}
            </p>
          )}
        </div>

        {/* KPI grid */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))',
            gap: '0.75rem',
            marginBottom: '1rem',
          }}
        >
          <div style={card}>
            <div style={label}>Etapa</div>
            <div style={value}>{stage}</div>
          </div>
          <div style={card}>
            <div style={label}>Score</div>
            <div style={value}>
              {startup.diagnostic_score ?? '—'}
              {startup.diagnostic_score != null && (
                <span style={{ fontWeight: 400, color: 'var(--color-text-muted)' }}>/100</span>
              )}
            </div>
          </div>
          <div style={card}>
            <div style={label}>Equipo</div>
            <div style={value}>
              {startup.team_size ?? '—'}{' '}
              {startup.team_size != null && (
                <Users size={14} style={{ display: 'inline', verticalAlign: 'middle', color: 'var(--color-text-muted)' }} />
              )}
            </div>
          </div>
          <div style={card}>
            <div style={label}>Tools completados</div>
            <div style={value}>{startup.tools_completed ?? 0}</div>
          </div>
        </div>

        {/* Traction */}
        <div style={{ ...card, marginBottom: '1rem' }}>
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              marginBottom: '1rem',
            }}
          >
            <Target size={16} color="var(--color-text-muted)" />
            <h3
              style={{
                fontFamily: 'var(--font-heading)',
                fontWeight: 600,
                fontSize: '1rem',
                color: 'var(--color-text-primary)',
                margin: 0,
              }}
            >
              Tracción
            </h3>
          </div>
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
              gap: '0.75rem',
            }}
          >
            <div>
              <div style={label}>MVP</div>
              <div style={value}>{startup.has_mvp ? 'Sí' : 'No'}</div>
            </div>
            <div>
              <div style={label}>Clientes pagando</div>
              <div style={value}>
                {startup.has_paying_customers
                  ? startup.paying_customers_count ?? 'Sí'
                  : 'No'}
              </div>
            </div>
            <div>
              <div style={label}>Ingresos mensuales (USD)</div>
              <div style={value}>
                {startup.monthly_revenue != null
                  ? `$${Number(startup.monthly_revenue).toLocaleString('es')}`
                  : '—'}
              </div>
            </div>
          </div>
        </div>

        {/* Links */}
        {(startup.website || startup.linkedin) && (
          <div style={{ ...card, marginBottom: '1rem' }}>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.75rem' }}>
              {startup.website && (
                <a
                  href={startup.website}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: 6,
                    padding: '0.5rem 0.9rem',
                    border: '1px solid var(--color-border)',
                    borderRadius: 'var(--radius-sm)',
                    color: 'var(--color-text-primary)',
                    textDecoration: 'none',
                    fontFamily: 'var(--font-body)',
                    fontSize: '0.85rem',
                  }}
                >
                  <Globe size={14} /> {new URL(startup.website).hostname}
                </a>
              )}
              {startup.linkedin && (
                <a
                  href={startup.linkedin}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: 6,
                    padding: '0.5rem 0.9rem',
                    border: '1px solid var(--color-border)',
                    borderRadius: 'var(--radius-sm)',
                    color: 'var(--color-text-primary)',
                    textDecoration: 'none',
                    fontFamily: 'var(--font-body)',
                    fontSize: '0.85rem',
                  }}
                >
                  <Link2 size={14} /> LinkedIn
                </a>
              )}
            </div>
          </div>
        )}

        {/* Footer */}
        <div
          style={{
            marginTop: '2rem',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: '0.75rem',
            fontFamily: 'var(--font-body)',
            fontSize: '0.7rem',
            color: 'var(--color-text-muted)',
          }}
        >
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: 5 }}>
            <Activity size={11} /> Actualizado{' '}
            {new Date(startup.updated_at).toLocaleDateString('es', {
              day: '2-digit',
              month: 'short',
              year: 'numeric',
            })}
          </div>
          <a
            href="https://startups4climate.org"
            style={{ color: 'var(--color-text-muted)', textDecoration: 'none' }}
          >
            startups4climate.org
          </a>
        </div>
      </div>
    </div>
  )
}
