'use client'

import { useState } from 'react'
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
} from 'lucide-react'

/* ─── Types ─── */
type Category = 'Inversión' | 'Regulación' | 'Tendencia' | 'Programa'
type Tab = 'noticias' | 'vertical'

interface NewsItem {
  title: string
  source: string
  date: string
  category: Category
  excerpt: string
}

interface VerticalItem {
  title: string
  source: string
  date: string
}


/* ─── Category styling ─── */
const CATEGORY_COLORS: Record<Category, { color: string; bg: string; border: string }> = {
  Inversión: { color: '#059669', bg: 'rgba(5,150,105,0.08)', border: 'rgba(5,150,105,0.2)' },
  Regulación: { color: '#6366F1', bg: 'rgba(99,102,241,0.08)', border: 'rgba(99,102,241,0.2)' },
  Tendencia: { color: '#D97706', bg: 'rgba(217,119,6,0.08)', border: 'rgba(217,119,6,0.2)' },
  Programa: { color: '#EC4899', bg: 'rgba(236,72,153,0.08)', border: 'rgba(236,72,153,0.2)' },
}

const CATEGORY_ICONS: Record<Category, typeof TrendingUp> = {
  Inversión: TrendingUp,
  Regulación: Scale,
  Tendencia: Lightbulb,
  Programa: Award,
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

const VERTICAL_ITEMS: VerticalItem[] = [
  {
    title: 'Nuevas regulaciones de bonos verdes podrían beneficiar a startups del sector',
    source: 'Climate Policy Initiative',
    date: '24 Mar 2026',
  },
  {
    title: 'Oportunidad: grandes corporaciones buscan proveedores de soluciones de medición de huella de carbono',
    source: 'GreenBiz',
    date: '22 Mar 2026',
  },
  {
    title: 'Mercado de soluciones ESG en LATAM alcanzará $2.5B en 2027',
    source: 'Deloitte',
    date: '20 Mar 2026',
  },
  {
    title: 'Nuevo estándar de reporte climático será obligatorio en Chile, Colombia y México',
    source: 'IFRS Foundation',
    date: '18 Mar 2026',
  },
]


const TABS: { id: Tab; label: string; icon: typeof Newspaper }[] = [
  { id: 'noticias', label: 'Noticias del ecosistema', icon: Newspaper },
  { id: 'vertical', label: 'Relevante para tu startup', icon: Target },
]

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
        borderRadius: 9999,
        background: style.bg,
        border: `1px solid ${style.border}`,
        fontFamily: 'var(--font-mono)',
        fontSize: '0.625rem',
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
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, delay: 0.05 + index * 0.06, ease: 'easeOut' }}
      style={{
        padding: '1.25rem 1.5rem',
        borderRadius: 14,
        background: 'var(--color-bg-card)',
        border: '1px solid var(--color-border)',
        boxShadow: 'var(--shadow-card, 0 1px 3px rgba(0,0,0,0.04))',
        display: 'flex',
        flexDirection: 'column',
        gap: '0.5rem',
        cursor: 'default',
        transition: 'all 0.2s ease',
        overflowWrap: 'break-word',
        wordBreak: 'break-word',
      }}
      whileHover={{
        boxShadow: '0 4px 20px rgba(0,0,0,0.06)',
        y: -2,
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap' }}>
        <CategoryPill category={item.category} />
        <span
          style={{
            fontFamily: 'var(--font-mono)',
            fontSize: '0.625rem',
            color: 'var(--color-text-muted)',
          }}
        >
          {item.date}
        </span>
      </div>
      <h3
        style={{
          fontFamily: 'var(--font-heading)',
          fontSize: '0.9375rem',
          fontWeight: 700,
          color: 'var(--color-text-primary)',
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
          lineHeight: 1.55,
          margin: 0,
        }}
      >
        {item.excerpt}
      </p>
      <span
        style={{
          fontFamily: 'var(--font-body)',
          fontSize: '0.6875rem',
          color: 'var(--color-text-muted)',
          fontStyle: 'italic',
        }}
      >
        Fuente: {item.source}
      </span>
    </motion.div>
  )
}

function VerticalCard({ item, vertical, index }: { item: VerticalItem; vertical: string; index: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, delay: 0.05 + index * 0.06, ease: 'easeOut' }}
      style={{
        padding: '1.25rem 1.5rem',
        borderRadius: 14,
        background: 'var(--color-bg-card)',
        border: '1px solid var(--color-border)',
        boxShadow: 'var(--shadow-card, 0 1px 3px rgba(0,0,0,0.04))',
        display: 'flex',
        flexDirection: 'column',
        gap: '0.5rem',
        cursor: 'default',
        transition: 'all 0.2s ease',
        overflowWrap: 'break-word',
        wordBreak: 'break-word',
      }}
      whileHover={{
        boxShadow: '0 4px 20px rgba(0,0,0,0.06)',
        y: -2,
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
        <span
          style={{
            display: 'inline-block',
            padding: '0.125rem 0.5rem',
            borderRadius: 9999,
            background: 'rgba(99,102,241,0.08)',
            border: '1px solid rgba(99,102,241,0.2)',
            fontFamily: 'var(--font-mono)',
            fontSize: '0.625rem',
            fontWeight: 600,
            color: '#6366F1',
            whiteSpace: 'nowrap',
          }}
        >
          {vertical}
        </span>
        <span
          style={{
            fontFamily: 'var(--font-mono)',
            fontSize: '0.625rem',
            color: 'var(--color-text-muted)',
          }}
        >
          {item.date}
        </span>
      </div>
      <h3
        style={{
          fontFamily: 'var(--font-heading)',
          fontSize: '0.9375rem',
          fontWeight: 700,
          color: 'var(--color-text-primary)',
          lineHeight: 1.35,
          margin: 0,
        }}
      >
        {item.title}
      </h3>
      <span
        style={{
          fontFamily: 'var(--font-body)',
          fontSize: '0.6875rem',
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
export default function RadarPage() {
  const [activeTab, setActiveTab] = useState<Tab>('noticias')

  // Try to read user vertical from localStorage
  let userVertical = 'Cleantech / Climatech'
  if (typeof window !== 'undefined') {
    try {
      const profile = localStorage.getItem('s4c_profile')
      if (profile) {
        const parsed = JSON.parse(profile)
        if (parsed.vertical) userVertical = parsed.vertical
      }
    } catch {
      // ignore
    }
  }

  return (
    <div
      style={{
        minHeight: '100vh',
        background: 'var(--color-bg-primary)',
        padding: '3rem 1.5rem 4rem',
      }}
    >
      <div style={{ maxWidth: 880, margin: '0 auto' }}>
        {/* AI Banner */}
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
              marginBottom: '0.75rem',
              flexWrap: 'wrap' as const,
              minHeight: 'auto',
            }}
          >
            <div
              style={{
                width: 40,
                height: 40,
                borderRadius: 12,
                background:
                  'linear-gradient(135deg, rgba(99,102,241,0.12), rgba(99,102,241,0.04))',
                border: '1px solid rgba(99,102,241,0.2)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0,
              }}
            >
              <Radio size={20} color="#6366F1" />
            </div>
            <div style={{ overflow: 'visible', minHeight: 'auto', flex: 1, minWidth: 0 }}>
              <h1
                style={{
                  fontFamily: 'var(--font-heading)',
                  fontSize: '1.5rem',
                  fontWeight: 800,
                  color: 'var(--color-text-primary)',
                  lineHeight: 1.3,
                  overflow: 'visible',
                  wordBreak: 'break-word',
                  overflowWrap: 'break-word',
                }}
              >
                RADAR del ecosistema
              </h1>
              <p
                style={{
                  fontFamily: 'var(--font-body)',
                  fontSize: '0.8125rem',
                  color: 'var(--color-text-muted)',
                  lineHeight: 1.4,
                }}
              >
                Mantente informado sobre lo que pasa en el ecosistema de innovación en LATAM
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
            }}
          >
            <Clock size={12} color="var(--color-text-muted)" />
            <span
              style={{
                fontFamily: 'var(--font-mono)',
                fontSize: '0.6875rem',
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
          {TABS.map((tab) => {
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
                  borderRadius: 10,
                  border: isActive
                    ? '1px solid rgba(99,102,241,0.3)'
                    : '1px solid var(--color-border)',
                  background: isActive ? 'rgba(99,102,241,0.08)' : 'var(--color-bg-card)',
                  fontFamily: 'var(--font-body)',
                  fontSize: '0.8125rem',
                  fontWeight: isActive ? 600 : 500,
                  color: isActive ? '#6366F1' : 'var(--color-text-secondary)',
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
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            {NEWS_ITEMS.map((item, i) => (
              <NewsCard key={item.title} item={item} index={i} />
            ))}
          </div>
        )}

        {activeTab === 'vertical' && (
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
                borderRadius: 10,
                background: 'rgba(99,102,241,0.04)',
                border: '1px solid rgba(99,102,241,0.1)',
                marginBottom: '1rem',
              }}
            >
              <Target size={14} color="#6366F1" />
              <span
                style={{
                  fontFamily: 'var(--font-body)',
                  fontSize: '0.8125rem',
                  color: 'var(--color-text-secondary)',
                }}
              >
                Mostrando noticias relevantes para:{' '}
                <strong style={{ color: '#6366F1' }}>{userVertical}</strong>
              </span>
            </motion.div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              {VERTICAL_ITEMS.map((item, i) => (
                <VerticalCard key={item.title} item={item} vertical={userVertical} index={i} />
              ))}
            </div>
          </div>
        )}

      </div>
    </div>
  )
}
