import type { Metadata } from 'next'
import { createClient } from '@supabase/supabase-js'
import Link from 'next/link'
import {
  Newspaper,
  TrendingUp,
  Globe,
  ArrowRight,
  Zap,
} from 'lucide-react'

export const metadata: Metadata = {
  title: 'RADAR del Ecosistema LATAM | Startups4Climate',
  description:
    'Noticias, tendencias e inversiones del ecosistema de startups de impacto en America Latina. Actualizado diariamente con fuentes verificadas y curado con IA.',
  keywords: [
    'noticias startups LATAM',
    'ecosistema emprendimiento latinoamerica',
    'inversiones climate tech',
    'tendencias startups impacto',
    'radar startups america latina',
  ],
  alternates: {
    canonical: 'https://www.startups4climate.org/radar',
  },
  openGraph: {
    title: 'RADAR del Ecosistema LATAM | Startups4Climate',
    description:
      'Noticias, tendencias e inversiones del ecosistema de startups de impacto en America Latina. Actualizado diariamente.',
    url: 'https://www.startups4climate.org/radar',
    type: 'website',
  },
}

export const revalidate = 3600 // revalidate every hour

type NewsItem = {
  id: string
  title: string
  summary: string | null
  source_name: string
  source_url: string
  vertical: string | null
  country: string | null
  content_type: string
  published_at: string | null
}

const VERTICAL_LABELS: Record<string, string> = {
  cleantech_climatech: 'Climate Tech',
  agritech_foodtech: 'Agritech',
  fintech: 'Fintech',
  healthtech: 'Healthtech',
  edtech: 'Edtech',
  logistics_mobility: 'Movilidad',
}

const TYPE_ICONS: Record<string, typeof Newspaper> = {
  news: Newspaper,
  investment: TrendingUp,
  trend: Zap,
}

async function getPublicNews(): Promise<NewsItem[]> {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  if (!url || !key) return []

  const supabase = createClient(url, key, {
    auth: { persistSession: false, autoRefreshToken: false },
  })

  const { data } = await supabase
    .from('news_items')
    .select('id, title, summary, source_name, source_url, vertical, country, content_type, published_at')
    .eq('is_active', true)
    .order('published_at', { ascending: false })
    .limit(12)

  return (data as NewsItem[]) || []
}

function formatDate(dateStr: string | null): string {
  if (!dateStr) return ''
  const d = new Date(dateStr)
  return d.toLocaleDateString('es-419', { day: 'numeric', month: 'short', year: 'numeric' })
}

export default async function RadarPublicPage() {
  const news = await getPublicNews()

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
            background: 'rgba(31,119,246,0.08)',
            border: '1px solid rgba(31,119,246,0.15)',
            fontSize: 'var(--text-2xs)',
            fontWeight: 600,
            color: '#1F77F6',
            marginBottom: '1rem',
          }}
        >
          <Globe size={12} />
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
          RADAR del Ecosistema LATAM
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
          Noticias, inversiones y tendencias del ecosistema de startups de impacto
          en America Latina. Curado con fuentes verificadas y actualizado con IA.
        </p>
      </div>

      {/* News Grid */}
      {news.length > 0 ? (
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(min(300px, 100%), 1fr))',
            gap: '1.25rem',
            marginBottom: '3rem',
          }}
        >
          {news.map((item) => {
            const Icon = TYPE_ICONS[item.content_type] || Newspaper
            return (
              <a
                key={item.id}
                href={item.source_url}
                target="_blank"
                rel="noopener noreferrer"
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
                  gap: '0.75rem',
                  transition: 'border-color 0.15s ease, box-shadow 0.15s ease',
                  cursor: 'pointer',
                  height: '100%',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap' }}>
                  <Icon size={14} color="var(--color-text-muted)" />
                  <span
                    style={{
                      fontSize: 'var(--text-2xs)',
                      color: 'var(--color-text-muted)',
                      fontFamily: 'var(--font-body)',
                    }}
                  >
                    {item.source_name}
                  </span>
                  {item.vertical && VERTICAL_LABELS[item.vertical] && (
                    <span
                      style={{
                        fontSize: 'var(--text-2xs)',
                        padding: '0.125rem 0.5rem',
                        borderRadius: 999,
                        background: 'rgba(31,119,246,0.06)',
                        border: '1px solid rgba(31,119,246,0.12)',
                        color: '#1F77F6',
                        fontWeight: 600,
                      }}
                    >
                      {VERTICAL_LABELS[item.vertical]}
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
                  {item.title}
                </h2>
                {item.summary && (
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
                    {item.summary}
                  </p>
                )}
                <div
                  style={{
                    marginTop: 'auto',
                    fontSize: 'var(--text-2xs)',
                    color: 'var(--color-text-muted)',
                    fontFamily: 'var(--font-body)',
                  }}
                >
                  {formatDate(item.published_at)}
                  {item.country && ` · ${item.country}`}
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
          El RADAR se actualiza diariamente. Vuelve pronto para ver las ultimas noticias.
        </p>
      )}

      {/* CTA */}
      <div
        style={{
          textAlign: 'center',
          padding: '2.5rem 1.5rem',
          borderRadius: 16,
          background: 'linear-gradient(135deg, rgba(31,119,246,0.04), rgba(218,78,36,0.04))',
          border: '1px solid rgba(31,119,246,0.1)',
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
          Accede al RADAR completo
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
          Crea tu cuenta gratuita para ver todas las noticias, filtrar por vertical
          y pais, y recibir actualizaciones del ecosistema LATAM.
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
