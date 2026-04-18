'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import {
  Radio,
  Newspaper,
  Target,
  Clock,
  TrendingUp,
  Scale,
  Lightbulb,
  Award,
  ExternalLink,
} from 'lucide-react'
import { useAuth } from '@/context/AuthContext'
import { useRouter } from 'next/navigation'
import { DEMO_ECOSYSTEM_ACTORS } from '@/lib/demo/admin-fixtures'
import { supabase } from '@/lib/supabase'

/* ─── Types ─── */
type Category = 'Inversión' | 'Regulación' | 'Tendencia' | 'Programa'
type Tab = 'noticias' | 'programa' | 'actores'

interface NewsItem {
  title: string
  source: string
  date: string
  category: Category
  excerpt: string
  url?: string | null
}

interface ProgramItem {
  title: string
  source: string
  date: string
  excerpt: string
}

/* ─── Category styling ─── */
const CATEGORY_COLORS: Record<Category, { color: string; bg: string; border: string }> = {
  Inversión: { color: '#1F77F6', bg: 'rgba(31,119,246,0.08)', border: 'rgba(31,119,246,0.2)' },
  Regulación: { color: '#2A222B', bg: 'rgba(42,34,43,0.08)', border: 'rgba(42,34,43,0.2)' },
  Tendencia: { color: '#2A222B', bg: 'rgba(42,34,43,0.08)', border: 'rgba(42,34,43,0.2)' },
  Programa: { color: '#EC4899', bg: 'rgba(236,72,153,0.08)', border: 'rgba(236,72,153,0.2)' },
}

const CATEGORY_ICONS: Record<Category, typeof TrendingUp> = {
  Inversión: TrendingUp,
  Regulación: Scale,
  Tendencia: Lightbulb,
  Programa: Award,
}

const CATEGORY_ACCENT: Record<Category, string> = {
  Inversión: '#1F77F6',
  Regulación: '#2A222B',
  Tendencia: '#6366F1',
  Programa: '#EC4899',
}

/* ─── Placeholder data ─── */
const NEWS_ITEMS: NewsItem[] = [
  {
    title: 'BID Lab anuncia fondo de $50M para startups de impacto en LATAM',
    source: 'TechCrunch LATAM',
    date: '25 Mar 2026',
    category: 'Inversión',
    excerpt: 'El fondo se enfocará en startups de climatech, fintech inclusivo y healthtech con operaciones en al menos dos países de la región.',
  },
  {
    title: 'Chile lanza nuevo programa de visas para founders internacionales',
    source: 'Diario Financiero',
    date: '24 Mar 2026',
    category: 'Regulación',
    excerpt: 'La visa Start-Up Chile Global permitirá a emprendedores de cualquier nacionalidad residir y operar sus startups desde Chile por 2 años.',
  },
  {
    title: 'El mercado de créditos de carbono en LATAM crecerá 340% para 2030',
    source: 'Bloomberg Línea',
    date: '23 Mar 2026',
    category: 'Tendencia',
    excerpt: 'Un nuevo reporte de McKinsey proyecta que Latinoamérica se posicionará como el mayor proveedor de créditos de carbono del mundo.',
  },
  {
    title: 'Google for Startups abre convocatoria para aceleradora climática regional',
    source: 'Contxto',
    date: '22 Mar 2026',
    category: 'Programa',
    excerpt: 'El programa de 12 semanas incluye $200K en créditos cloud, mentoría y acceso a la red global de Google para startups de impacto ambiental.',
  },
  {
    title: 'Colombia aprueba ley de sandbox regulatorio para fintechs',
    source: 'La República',
    date: '21 Mar 2026',
    category: 'Regulación',
    excerpt: 'El nuevo marco permite a startups fintech operar bajo supervisión reducida durante 24 meses mientras validan sus modelos de negocio.',
  },
  {
    title: 'SoftBank LATAM Fund III cierra en $1.2B con foco en AI y clima',
    source: 'Reuters',
    date: '20 Mar 2026',
    category: 'Inversión',
    excerpt: 'El tercer fondo regional de SoftBank priorizará inversiones en inteligencia artificial aplicada y soluciones climáticas escalables.',
  },
  {
    title: 'Startups de agritech en LATAM recaudan récord de $800M en 2025',
    source: 'AgFunder News',
    date: '19 Mar 2026',
    category: 'Tendencia',
    excerpt: 'Brasil, Argentina y México lideran la inversión en tecnología agrícola, con soluciones de agricultura regenerativa captando el mayor interés.',
  },
  {
    title: 'CORFO lanza programa Semilla Inicia 2026 con $40K por startup',
    source: 'Pulso',
    date: '18 Mar 2026',
    category: 'Programa',
    excerpt: 'El programa ofrece financiamiento no reembolsable de hasta $40,000 USD para startups en etapa temprana con operaciones en Chile.',
  },
]

const PROGRAM_ITEMS: ProgramItem[] = [
  {
    title: 'IADB publica guía actualizada de mejores prácticas para programas de incubación en LATAM',
    source: 'Inter-American Development Bank',
    date: '24 Mar 2026',
    excerpt: 'La guía incluye marcos de medición de impacto, modelos de sostenibilidad financiera y estrategias de vinculación con el sector privado.',
  },
  {
    title: 'Convocatoria abierta: fondos de matching para aceleradoras que apoyen startups climáticas',
    source: 'Climate Policy Initiative',
    date: '22 Mar 2026',
    excerpt: 'Programas de incubación y aceleración en LATAM pueden postular a fondos de co-inversión de hasta $500K para apoyar startups de su portafolio.',
  },
  {
    title: 'Nuevo estándar de medición de impacto para programas de apoyo a emprendimiento',
    source: 'ANDE (Aspen Network)',
    date: '20 Mar 2026',
    excerpt: 'El marco ANDE 2026 propone métricas estandarizadas para medir el impacto de incubadoras y aceleradoras en el ecosistema.',
  },
  {
    title: 'México anuncia incentivos fiscales para organizaciones que operen programas de aceleración',
    source: 'El Economista',
    date: '18 Mar 2026',
    excerpt: 'Las organizaciones que operen programas certificados de aceleración podrán deducir hasta el 150% de su inversión en apoyo a startups.',
  },
]

const CATEGORIES: (Category | 'Todos')[] = ['Todos', 'Inversión', 'Regulación', 'Tendencia', 'Programa']

const TABS: { id: Tab; label: string; icon: typeof Newspaper }[] = [
  { id: 'noticias', label: 'Noticias del ecosistema', icon: Newspaper },
  { id: 'programa', label: 'Relevante para tu programa', icon: Target },
  { id: 'actores', label: 'Actores del ecosistema', icon: Radio },
]

const ACTOR_CATEGORY_LABELS: Record<string, string> = {
  incubator: 'Incubadoras',
  fund: 'Fondos / VC',
  gov: 'Gobierno',
  university: 'Universidades',
  corporate: 'Corporates',
  media: 'Medios',
  event: 'Eventos',
}

const ACTOR_CATEGORY_COLORS: Record<string, string> = {
  incubator: '#1F77F6',
  fund: '#8B5CF6',
  gov: '#1F77F6',
  university: '#16A34A',
  corporate: '#DA4E24',
  media: '#F59E0B',
  event: '#EC4899',
}

/* ─── Components ─── */
function CategoryPill({ category }: { category: Category }) {
  const style = CATEGORY_COLORS[category]
  const Icon = CATEGORY_ICONS[category]
  return (
    <span
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: '0.25rem',
        padding: '0.125rem 0.5rem',
        borderRadius: 999,
        background: style.bg,
        border: `1px solid ${style.border}`,
        fontFamily: 'var(--font-body)',
        fontSize: 'var(--text-2xs)',
        fontWeight: 600,
        color: style.color,
        whiteSpace: 'nowrap',
      }}
    >
      <Icon size={10} />
      {category}
    </span>
  )
}

function NewsCard({ item, index }: { item: NewsItem; index: number }) {
  const accent = CATEGORY_ACCENT[item.category]
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, delay: 0.05 + index * 0.06, ease: 'easeOut' }}
      style={{
        padding: '1.25rem',
        borderRadius: 12,
        background: 'var(--color-bg-card)',
        borderTop: '1px solid var(--color-border)',
        borderRight: '1px solid var(--color-border)',
        borderBottom: '1px solid var(--color-border)',
        borderLeft: `3px solid ${accent}`,
        boxShadow: 'var(--shadow-card)',
        display: 'flex',
        flexDirection: 'column',
        gap: '0.5rem',
        cursor: 'default',
        transition: 'all 0.2s ease',
        overflowWrap: 'break-word',
        wordBreak: 'break-word',
      }}
      whileHover={{
        boxShadow: 'var(--shadow-card-hover)',
        y: -2,
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap' }}>
        <CategoryPill category={item.category} />
        <span
          style={{
            fontFamily: 'var(--font-body)',
            fontSize: 'var(--text-2xs)',
            color: 'var(--color-text-muted)',
          }}
        >
          {item.date}
        </span>
      </div>
      <h3
        style={{
          fontFamily: 'var(--font-heading)',
          fontSize: '0.875rem',
          fontWeight: 600,
          color: 'var(--color-ink)',
          lineHeight: 1.35,
          margin: 0,
        }}
      >
        {item.title}
      </h3>
      <p
        style={{
          fontFamily: 'var(--font-body)',
          fontSize: '0.8125rem',
          color: 'var(--color-text-secondary)',
          lineHeight: 1.6,
          margin: 0,
        }}
      >
        {item.excerpt}
      </p>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '0.5rem', flexWrap: 'wrap', marginTop: '0.25rem' }}>
        <span
          style={{
            fontFamily: 'var(--font-body)',
            fontSize: 'var(--text-xs)',
            color: 'var(--color-text-muted)',
            fontStyle: 'italic',
          }}
        >
          Fuente: {item.source}
        </span>
        {item.url && (
          <a
            href={item.url}
            target="_blank"
            rel="noopener noreferrer"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.25rem',
              fontFamily: 'var(--font-body)',
              fontSize: 'var(--text-xs)',
              fontWeight: 600,
              color: accent,
              textDecoration: 'none',
            }}
          >
            Leer más <ExternalLink size={11} />
          </a>
        )}
      </div>
    </motion.div>
  )
}

function ProgramCard({ item, index }: { item: ProgramItem; index: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, delay: 0.05 + index * 0.06, ease: 'easeOut' }}
      style={{
        padding: '1.25rem',
        borderRadius: 12,
        background: 'var(--color-bg-card)',
        borderTop: '1px solid var(--color-border)',
        borderRight: '1px solid var(--color-border)',
        borderBottom: '1px solid var(--color-border)',
        borderLeft: '3px solid #6366F1',
        boxShadow: 'var(--shadow-card)',
        display: 'flex',
        flexDirection: 'column',
        gap: '0.5rem',
        cursor: 'default',
        transition: 'all 0.2s ease',
        overflowWrap: 'break-word',
        wordBreak: 'break-word',
      }}
      whileHover={{
        boxShadow: 'var(--shadow-card-hover)',
        y: -2,
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
        <span
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.25rem',
            padding: '0.125rem 0.5rem',
            borderRadius: 999,
            background: 'rgba(99,102,241,0.08)',
            border: '1px solid rgba(99,102,241,0.2)',
            fontFamily: 'var(--font-body)',
            fontSize: 'var(--text-2xs)',
            fontWeight: 600,
            color: '#6366F1',
            whiteSpace: 'nowrap',
          }}
        >
          <Target size={10} />
          Programas
        </span>
        <span
          style={{
            fontFamily: 'var(--font-body)',
            fontSize: 'var(--text-2xs)',
            color: 'var(--color-text-muted)',
          }}
        >
          {item.date}
        </span>
      </div>
      <h3
        style={{
          fontFamily: 'var(--font-heading)',
          fontSize: '0.875rem',
          fontWeight: 600,
          color: 'var(--color-ink)',
          lineHeight: 1.35,
          margin: 0,
        }}
      >
        {item.title}
      </h3>
      <p
        style={{
          fontFamily: 'var(--font-body)',
          fontSize: '0.8125rem',
          color: 'var(--color-text-secondary)',
          lineHeight: 1.6,
          margin: 0,
        }}
      >
        {item.excerpt}
      </p>
      <span
        style={{
          fontFamily: 'var(--font-body)',
          fontSize: 'var(--text-xs)',
          color: 'var(--color-text-muted)',
          fontStyle: 'italic',
        }}
      >
        Fuente: {item.source}
      </span>
    </motion.div>
  )
}

/* ─── Main page ─── */
export default function AdminRadarPage() {
  const { appUser, isDemo } = useAuth()
  const router = useRouter()
  const [activeTab, setActiveTab] = useState<Tab>('noticias')
  const [activeCategory, setActiveCategory] = useState<Category | 'Todos'>('Todos')
  const [liveNews, setLiveNews] = useState<NewsItem[] | null>(null)

  useEffect(() => {
    let cancelled = false
    ;(async () => {
      const { data, error } = await supabase
        .from('news_items')
        .select('title, source_name, source_url, published_at, content_type, summary, tags')
        .eq('is_active', true)
        .order('published_at', { ascending: false })
        .limit(40)
      if (cancelled || error || !data) return
      const mapType = (t: string | null, tags: string[] | null): Category => {
        const tagStr = (tags || []).join(' ').toLowerCase()
        if (t === 'funding' || tagStr.includes('inversión') || tagStr.includes('fondo')) return 'Inversión'
        if (t === 'regulation' || tagStr.includes('regulación') || tagStr.includes('ley')) return 'Regulación'
        if (t === 'program' || tagStr.includes('convocatoria') || tagStr.includes('aceleradora')) return 'Programa'
        return 'Tendencia'
      }
      const fmt = (iso: string) => {
        const d = new Date(iso)
        const months = ['Ene','Feb','Mar','Abr','May','Jun','Jul','Ago','Sep','Oct','Nov','Dic']
        return `${d.getDate()} ${months[d.getMonth()]} ${d.getFullYear()}`
      }
      setLiveNews(
        data.map((r: Record<string, unknown>) => ({
          title: r.title as string,
          source: (r.source_name as string) || 'Fuente desconocida',
          date: fmt(r.published_at as string),
          category: mapType(r.content_type as string | null, r.tags as string[] | null),
          excerpt: (r.summary as string) || '',
          url: (r.source_url as string) || null,
        }))
      )
    })()
    return () => { cancelled = true }
  }, [])

  if (!appUser || (appUser.role !== 'admin_org' && appUser.role !== 'superadmin')) {
    router.replace('/admin')
    return null
  }

  // Filter out actores tab when not in demo mode
  const visibleTabs = isDemo ? TABS : TABS.filter((t) => t.id !== 'actores')

  const newsSource = liveNews && liveNews.length > 0 ? liveNews : NEWS_ITEMS
  const filteredNews =
    activeCategory === 'Todos'
      ? newsSource
      : newsSource.filter((item) => item.category === activeCategory)

  return (
    <div
      style={{
        minHeight: '100vh',
        background: 'var(--color-bg-primary)',
        padding: '2rem',
      }}
    >
      <div style={{ maxWidth: 960, margin: '0 auto' }}>
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
                background: 'rgba(31,119,246,0.08)',
                border: '1px solid rgba(31,119,246,0.2)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0,
              }}
            >
              <Radio size={20} color="#1F77F6" />
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
                RADAR del ecosistema
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
                Noticias, tendencias y oportunidades relevantes para tu programa y el ecosistema LATAM
              </p>
            </div>
          </div>

          {/* Last updated */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.375rem',
              marginTop: '0.5rem',
              marginLeft: 52,
            }}
          >
            <Clock size={12} color="var(--color-text-muted)" />
            <span
              style={{
                fontFamily: 'var(--font-body)',
                fontSize: 'var(--text-xs)',
                color: 'var(--color-text-muted)',
              }}
            >
              Última actualización: 27 Mar 2026, 09:00 AM
            </span>
          </div>
        </motion.div>

        {/* Tabs */}
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.1 }}
          style={{
            display: 'flex',
            gap: '0.5rem',
            marginBottom: '1.5rem',
            overflowX: 'auto',
            paddingBottom: '0.25rem',
          }}
        >
          {visibleTabs.map((tab) => {
            const Icon = tab.icon
            const isActive = activeTab === tab.id
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.375rem',
                  padding: '0.5rem 1rem',
                  borderRadius: 999,
                  border: isActive
                    ? '1px solid rgba(31,119,246,0.3)'
                    : '1px solid var(--color-border)',
                  background: isActive ? 'rgba(31,119,246,0.08)' : 'var(--color-bg-card)',
                  fontFamily: 'var(--font-body)',
                  fontSize: 'var(--text-sm)',
                  fontWeight: isActive ? 600 : 500,
                  color: isActive ? '#1F77F6' : 'var(--color-text-secondary)',
                  cursor: 'pointer',
                  whiteSpace: 'nowrap',
                  transition: 'all 0.2s ease',
                }}
              >
                <Icon size={14} />
                {tab.label}
              </button>
            )
          })}
        </motion.div>

        {/* Tab content */}
        {activeTab === 'noticias' && (
          <div>
            {/* Category filter pills */}
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 0.15 }}
              style={{
                display: 'flex',
                gap: '0.375rem',
                marginBottom: '1.25rem',
                overflowX: 'auto',
                paddingBottom: '0.25rem',
              }}
            >
              {CATEGORIES.map((cat) => {
                const isActive = activeCategory === cat
                const catIcon = cat !== 'Todos' ? CATEGORY_ICONS[cat] : null
                return (
                  <button
                    key={cat}
                    onClick={() => setActiveCategory(cat)}
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '0.25rem',
                      padding: '0.25rem 0.75rem',
                      borderRadius: 999,
                      border: isActive
                        ? '1px solid rgba(31,119,246,0.3)'
                        : '1px solid var(--color-border)',
                      background: isActive ? 'rgba(31,119,246,0.08)' : 'transparent',
                      fontFamily: 'var(--font-body)',
                      fontSize: 'var(--text-xs)',
                      fontWeight: isActive ? 600 : 500,
                      color: isActive ? '#1F77F6' : 'var(--color-text-muted)',
                      cursor: 'pointer',
                      whiteSpace: 'nowrap',
                      transition: 'all 0.2s ease',
                    }}
                  >
                    {catIcon && (() => { const CatIcon = catIcon; return <CatIcon size={11} /> })()}
                    {cat}
                  </button>
                )
              })}
            </motion.div>

            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fill, minmax(min(280px, 100%), 1fr))',
                gap: '1rem',
              }}
            >
              {filteredNews.map((item, i) => (
                <NewsCard key={item.title} item={item} index={i} />
              ))}
            </div>

            {filteredNews.length === 0 && (
              <div style={{ textAlign: 'center', padding: '3rem 1rem' }}>
                <p
                  style={{
                    fontFamily: 'var(--font-body)',
                    fontSize: 'var(--text-sm)',
                    color: 'var(--color-text-muted)',
                  }}
                >
                  No hay noticias en esta categoría.
                </p>
              </div>
            )}
          </div>
        )}

        {activeTab === 'programa' && (
          <div>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.3 }}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                padding: '0.75rem 1rem',
                borderRadius: 12,
                background: 'rgba(99,102,241,0.04)',
                border: '1px solid rgba(99,102,241,0.1)',
                marginBottom: '1rem',
              }}
            >
              <Target size={14} color="#6366F1" />
              <span
                style={{
                  fontFamily: 'var(--font-body)',
                  fontSize: 'var(--text-sm)',
                  color: 'var(--color-text-secondary)',
                }}
              >
                Mostrando noticias relevantes para:{' '}
                <strong style={{ color: '#6366F1' }}>Programas de incubación y aceleración</strong>
              </span>
            </motion.div>
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fill, minmax(min(280px, 100%), 1fr))',
                gap: '1rem',
              }}
            >
              {PROGRAM_ITEMS.map((item, i) => (
                <ProgramCard key={item.title} item={item} index={i} />
              ))}
            </div>
          </div>
        )}

        {activeTab === 'actores' && isDemo && (
          <div>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.3 }}
              style={{
                display: 'flex', alignItems: 'center', gap: '0.5rem',
                padding: '0.75rem 1rem', borderRadius: 12,
                background: 'rgba(31,119,246,0.04)',
                border: '1px solid rgba(31,119,246,0.15)',
                marginBottom: '1.25rem',
              }}
            >
              <Radio size={14} color="#1F77F6" />
              <span style={{
                fontFamily: 'var(--font-body)', fontSize: 'var(--text-sm)',
                color: 'var(--color-text-secondary)',
              }}>
                Mapa del ecosistema · {DEMO_ECOSYSTEM_ACTORS.length} actores activos en Perú y LATAM
              </span>
            </motion.div>

            {Object.keys(ACTOR_CATEGORY_LABELS).map((cat) => {
              const items = DEMO_ECOSYSTEM_ACTORS.filter((a) => a.category === cat)
              if (items.length === 0) return null
              const color = ACTOR_CATEGORY_COLORS[cat]
              return (
                <div key={cat} style={{ marginBottom: '1.5rem' }}>
                  <div style={{
                    display: 'flex', alignItems: 'center', gap: '0.5rem',
                    marginBottom: '0.75rem',
                  }}>
                    <span style={{
                      width: 8, height: 8, borderRadius: '50%', background: color,
                    }} />
                    <h3 style={{
                      fontFamily: 'var(--font-heading)', fontWeight: 600,
                      fontSize: '0.95rem', color: 'var(--color-text-primary)',
                      margin: 0,
                    }}>
                      {ACTOR_CATEGORY_LABELS[cat]}
                    </h3>
                    <span style={{
                      fontFamily: 'var(--font-body)', fontSize: '0.7rem',
                      color: 'var(--color-text-muted)',
                    }}>
                      ({items.length})
                    </span>
                  </div>
                  <div style={{
                    display: 'grid', gap: '0.6rem',
                    gridTemplateColumns: 'repeat(auto-fill, minmax(min(220px, 100%), 1fr))',
                  }}>
                    {items.map((a) => (
                      <div key={a.id} style={{
                        padding: '0.75rem 0.85rem',
                        borderRadius: 'var(--radius-sm)',
                        background: `${color}0A`,
                        border: `1px solid ${color}33`,
                      }}>
                        <div style={{
                          fontFamily: 'var(--font-body)', fontSize: '0.82rem',
                          fontWeight: 600, color: 'var(--color-text-primary)',
                          marginBottom: '0.2rem',
                        }}>
                          {a.name}
                        </div>
                        <div style={{
                          fontFamily: 'var(--font-body)', fontSize: '0.66rem',
                          color: 'var(--color-text-muted)',
                          textTransform: 'uppercase', letterSpacing: '0.04em',
                          marginBottom: '0.35rem',
                        }}>
                          {a.region}
                        </div>
                        <div style={{
                          fontFamily: 'var(--font-body)', fontSize: '0.72rem',
                          color: 'var(--color-text-secondary)', lineHeight: 1.4,
                        }}>
                          {a.description}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}
