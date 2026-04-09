'use client'

import { motion } from 'framer-motion'
import { Radar, Newspaper, TrendingUp, Globe } from 'lucide-react'
import { useAuth } from '@/context/AuthContext'
import { useRouter } from 'next/navigation'

const cardStyle: React.CSSProperties = {
  background: 'var(--color-bg-card)',
  border: '1px solid var(--color-border)',
  borderRadius: 'var(--radius-md)',
  padding: '1.5rem',
  boxShadow: 'var(--shadow-card)',
}

const fadeUp = {
  initial: { opacity: 0, y: 16 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.4, ease: 'easeOut' as const },
}

const PLACEHOLDER_ITEMS = [
  {
    title: 'Tendencias regulatorias en LATAM',
    category: 'Regulación',
    date: 'Abril 2026',
    icon: Globe,
  },
  {
    title: 'Nuevos fondos climáticos abiertos',
    category: 'Financiamiento',
    date: 'Abril 2026',
    icon: TrendingUp,
  },
  {
    title: 'Convocatorias de incubadoras activas',
    category: 'Ecosistema',
    date: 'Abril 2026',
    icon: Newspaper,
  },
]

export default function AdminRadarPage() {
  const { appUser } = useAuth()
  const router = useRouter()

  if (!appUser || (appUser.role !== 'admin_org' && appUser.role !== 'superadmin')) {
    router.replace('/admin')
    return null
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: 'easeOut' }}
      style={{ padding: '2rem 1.5rem', maxWidth: 1200, margin: '0 auto' }}
    >
      <div style={{ marginBottom: '2rem' }}>
        <h1 style={{
          fontFamily: 'var(--font-heading)', fontWeight: 700,
          fontSize: '1.25rem', color: 'var(--color-text-primary)',
          marginBottom: '0.25rem',
        }}>
          RADAR del ecosistema
        </h1>
        <p style={{
          fontFamily: 'var(--font-body)', fontSize: '0.8125rem',
          color: 'var(--color-text-secondary)',
        }}>
          Vista general del ecosistema para tu organización. Noticias, tendencias y señales relevantes sin filtro por vertical.
        </p>
      </div>

      {/* Info banner */}
      <motion.div
        {...fadeUp}
        style={{
          ...cardStyle,
          marginBottom: '1.5rem',
          background: 'var(--color-accent-light)',
          border: '1px solid var(--color-accent-primary)',
          display: 'flex',
          alignItems: 'center',
          gap: '0.75rem',
        }}
      >
        <Radar size={20} color="var(--color-accent-primary)" />
        <span style={{
          fontFamily: 'var(--font-body)', fontSize: '0.8125rem',
          color: 'var(--color-accent-primary)', fontWeight: 500,
        }}>
          Esta vista muestra información general del ecosistema para administradores. Los founders ven una versión filtrada por su vertical.
        </span>
      </motion.div>

      {/* Placeholder cards */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
        gap: '1rem',
      }}>
        {PLACEHOLDER_ITEMS.map((item, i) => {
          const Icon = item.icon
          return (
            <motion.div
              key={item.title}
              {...fadeUp}
              transition={{ ...fadeUp.transition, delay: i * 0.08 }}
              style={cardStyle}
            >
              <div style={{
                display: 'flex', alignItems: 'center', gap: '0.75rem',
                marginBottom: '1rem',
              }}>
                <div style={{
                  width: 36, height: 36, borderRadius: 'var(--radius-sm)',
                  background: 'var(--color-bg-muted)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                }}>
                  <Icon size={18} color="var(--color-text-secondary)" />
                </div>
                <div>
                  <span style={{
                    fontFamily: 'var(--font-body)', fontSize: '0.6875rem',
                    fontWeight: 600, color: 'var(--color-text-muted)',
                    textTransform: 'uppercase', letterSpacing: '0.05em',
                  }}>
                    {item.category}
                  </span>
                </div>
              </div>
              <h3 style={{
                fontFamily: 'var(--font-heading)', fontWeight: 600,
                fontSize: '1rem', color: 'var(--color-text-primary)',
                marginBottom: '0.5rem',
              }}>
                {item.title}
              </h3>
              <p style={{
                fontFamily: 'var(--font-body)', fontSize: '0.8125rem',
                color: 'var(--color-text-secondary)',
              }}>
                {item.date}
              </p>
            </motion.div>
          )
        })}
      </div>

      {/* Empty state note */}
      <div style={{
        textAlign: 'center', padding: '3rem 1rem', marginTop: '2rem',
      }}>
        <p style={{
          fontFamily: 'var(--font-body)', fontSize: '0.8125rem',
          color: 'var(--color-text-muted)',
        }}>
          Próximamente: contenido generado por AI con noticias y tendencias del ecosistema climático en LATAM.
        </p>
      </div>
    </motion.div>
  )
}
