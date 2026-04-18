'use client'

import { useEffect, useState, useCallback } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import {
  ChevronLeft,
  ChevronRight,
  X,
  Maximize2,
  Minimize2,
  Users,
  Target,
  Globe,
  MapPin,
  TrendingUp,
  Activity,
} from 'lucide-react'
import { supabase } from '@/lib/supabase'
import S4CLogo from '@/components/S4CLogo'

interface Slide {
  id: string
  name: string
  description: string | null
  vertical: string | null
  country: string | null
  stage: string | null
  diagnostic_score: number | null
  team_size: number | null
  has_mvp: boolean | null
  has_paying_customers: boolean | null
  paying_customers_count: number | null
  monthly_revenue: number | null
  tools_completed: number | null
  logo_url: string | null
  founder_name: string | null
}

const STAGE_LABELS: Record<string, string> = {
  '1': 'Idea', '2': 'Pre-incubación', '3': 'Incubación', '4': 'Aceleración', '5': 'Escalamiento',
  ideation: 'Idea', pre_incubation: 'Pre-incubación', incubation: 'Incubación',
  acceleration: 'Aceleración', scaling: 'Escalamiento',
}

export default function DemoDayPage() {
  const params = useParams<{ id: string }>()
  const router = useRouter()
  const [cohortName, setCohortName] = useState('')
  const [slides, setSlides] = useState<Slide[]>([])
  const [index, setIndex] = useState(0)
  const [loading, setLoading] = useState(true)
  const [fullscreen, setFullscreen] = useState(false)

  useEffect(() => {
    async function load() {
      const cohortId = params?.id
      if (!cohortId) return
      const { data: cohort } = await supabase
        .from('cohorts').select('name').eq('id', cohortId).maybeSingle()
      if (cohort) setCohortName(cohort.name)
      const { data: assignments } = await supabase
        .from('cohort_startups').select('startup_id').eq('cohort_id', cohortId)
      const startupIds = (assignments || []).map((a) => a.startup_id)
      if (startupIds.length === 0) { setLoading(false); return }
      const { data: startups } = await supabase
        .from('startups')
        .select('id,name,description,vertical,country,stage,diagnostic_score,team_size,has_mvp,has_paying_customers,paying_customers_count,monthly_revenue,tools_completed,logo_url,founder_id')
        .in('id', startupIds)
      const founderIds = (startups || []).map((s) => s.founder_id).filter(Boolean) as string[]
      let founders: Record<string, string> = {}
      if (founderIds.length) {
        const { data: profs } = await supabase
          .from('profiles').select('id, full_name').in('id', founderIds)
        founders = Object.fromEntries((profs || []).map((p) => [p.id, p.full_name]))
      }
      const enriched: Slide[] = (startups || []).map((s) => ({
        ...s,
        founder_name: s.founder_id ? founders[s.founder_id] || null : null,
      }))
      // Sort by score desc so the strongest open
      enriched.sort((a, b) => (b.diagnostic_score ?? 0) - (a.diagnostic_score ?? 0))
      setSlides(enriched)
      setLoading(false)
    }
    load()
  }, [params])

  const next = useCallback(() => setIndex((i) => (slides.length ? (i + 1) % slides.length : 0)), [slides.length])
  const prev = useCallback(() => setIndex((i) => (slides.length ? (i - 1 + slides.length) % slides.length : 0)), [slides.length])

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === 'ArrowRight' || e.key === ' ') { e.preventDefault(); next() }
      else if (e.key === 'ArrowLeft') { e.preventDefault(); prev() }
      else if (e.key === 'Escape') {
        if (document.fullscreenElement) document.exitFullscreen().catch(() => {})
        else router.push(`/admin/cohortes/${params?.id}`)
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [next, prev, params, router])

  function toggleFullscreen() {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().then(() => setFullscreen(true)).catch(() => {})
    } else {
      document.exitFullscreen().then(() => setFullscreen(false)).catch(() => {})
    }
  }

  const current = slides[index]

  return (
    <div
      style={{
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #0F172A 0%, #1E293B 100%)',
        color: '#F8FAFC',
        display: 'flex', flexDirection: 'column',
        position: 'relative',
      }}
    >
      {/* Top bar */}
      <div
        style={{
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          padding: '1rem 1.5rem',
          borderBottom: '1px solid rgba(255,255,255,0.08)',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <S4CLogo size={24} />
          <span style={{ fontFamily: 'var(--font-heading)', fontWeight: 700, fontSize: '0.95rem' }}>
            Demo Day · {cohortName || 'Cohort'}
          </span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <span style={{ fontFamily: 'var(--font-body)', fontSize: '0.8rem', color: 'rgba(248,250,252,0.6)' }}>
            {slides.length > 0 ? `${index + 1} / ${slides.length}` : '0 / 0'}
          </span>
          <button
            onClick={toggleFullscreen}
            title={fullscreen ? 'Salir de pantalla completa' : 'Pantalla completa'}
            style={{
              display: 'inline-flex', alignItems: 'center', gap: 4,
              padding: '0.4rem 0.7rem', borderRadius: 8,
              background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.12)',
              color: '#F8FAFC', cursor: 'pointer', fontSize: '0.8rem',
            }}
          >
            {fullscreen ? <Minimize2 size={14} /> : <Maximize2 size={14} />}
          </button>
          <button
            onClick={() => router.push(`/admin/cohortes/${params?.id}`)}
            title="Salir"
            style={{
              display: 'inline-flex', alignItems: 'center', gap: 4,
              padding: '0.4rem 0.7rem', borderRadius: 8,
              background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.12)',
              color: '#F8FAFC', cursor: 'pointer', fontSize: '0.8rem',
            }}
          >
            <X size={14} />
          </button>
        </div>
      </div>

      {/* Slide area */}
      <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '2rem 4rem', position: 'relative' }}>
        {loading ? (
          <div style={{ fontFamily: 'var(--font-body)', color: 'rgba(248,250,252,0.6)' }}>Cargando demo day…</div>
        ) : !current ? (
          <div style={{ textAlign: 'center', color: 'rgba(248,250,252,0.6)' }}>
            <p style={{ fontFamily: 'var(--font-body)' }}>Aún no hay startups asignadas a este cohort.</p>
          </div>
        ) : (
          <>
            <button
              onClick={prev}
              aria-label="Anterior"
              style={{
                position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)',
                width: 44, height: 44, borderRadius: 999,
                background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.12)',
                color: '#F8FAFC', cursor: 'pointer',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}
            >
              <ChevronLeft size={20} />
            </button>
            <button
              onClick={next}
              aria-label="Siguiente"
              style={{
                position: 'absolute', right: '1rem', top: '50%', transform: 'translateY(-50%)',
                width: 44, height: 44, borderRadius: 999,
                background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.12)',
                color: '#F8FAFC', cursor: 'pointer',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}
            >
              <ChevronRight size={20} />
            </button>

            <AnimatePresence mode="wait">
              <motion.div
                key={current.id}
                initial={{ opacity: 0, y: 24 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -24 }}
                transition={{ duration: 0.4, ease: 'easeOut' }}
                style={{ width: '100%', maxWidth: 980 }}
              >
                {/* Header */}
                <div style={{ display: 'flex', alignItems: 'center', gap: 18, marginBottom: 24 }}>
                  {current.logo_url ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={current.logo_url} alt={current.name} style={{ width: 80, height: 80, borderRadius: 18, objectFit: 'cover' }} />
                  ) : (
                    <div
                      style={{
                        width: 80, height: 80, borderRadius: 18,
                        background: 'rgba(255,255,255,0.08)',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        fontFamily: 'var(--font-heading)', fontWeight: 700, fontSize: '1.8rem',
                        color: '#F8FAFC',
                      }}
                    >
                      {current.name.charAt(0)}
                    </div>
                  )}
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <h1 style={{ fontFamily: 'var(--font-heading)', fontWeight: 700, fontSize: 'clamp(1.8rem, 4vw, 2.6rem)', margin: 0, lineHeight: 1.1 }}>
                      {current.name}
                    </h1>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 12, marginTop: 8, color: 'rgba(248,250,252,0.7)' }}>
                      {current.founder_name && (
                        <span style={{ fontFamily: 'var(--font-body)', fontSize: '0.95rem' }}>{current.founder_name}</span>
                      )}
                      {current.vertical && (
                        <span style={{ fontFamily: 'var(--font-body)', fontSize: '0.95rem' }}>· {current.vertical}</span>
                      )}
                      {current.country && (
                        <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4, fontFamily: 'var(--font-body)', fontSize: '0.95rem' }}>
                          · <MapPin size={13} /> {current.country}
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                {/* Description */}
                {current.description && (
                  <p style={{ fontFamily: 'var(--font-body)', fontSize: 'clamp(1rem, 1.6vw, 1.2rem)', lineHeight: 1.6, color: 'rgba(248,250,252,0.85)', marginBottom: 28 }}>
                    {current.description}
                  </p>
                )}

                {/* KPI grid */}
                <div
                  style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fit, minmax(170px, 1fr))',
                    gap: 12,
                  }}
                >
                  {[
                    { label: 'Etapa', value: current.stage ? STAGE_LABELS[current.stage] || current.stage : '—', icon: Activity },
                    { label: 'Score', value: current.diagnostic_score != null ? `${current.diagnostic_score}/100` : '—', icon: TrendingUp },
                    { label: 'Equipo', value: current.team_size != null ? `${current.team_size}` : '—', icon: Users },
                    { label: 'MVP', value: current.has_mvp ? 'Sí' : 'No', icon: Target },
                    { label: 'Clientes pagando', value: current.has_paying_customers ? (current.paying_customers_count ?? 'Sí') : 'No', icon: Users },
                    { label: 'MRR (USD)', value: current.monthly_revenue != null ? `$${Number(current.monthly_revenue).toLocaleString('es')}` : '—', icon: TrendingUp },
                    { label: 'Tools completados', value: current.tools_completed ?? 0, icon: Globe },
                  ].map((k) => {
                    const Icon = k.icon
                    return (
                      <div
                        key={k.label}
                        style={{
                          padding: '1rem 1.1rem', borderRadius: 14,
                          background: 'rgba(255,255,255,0.04)',
                          border: '1px solid rgba(255,255,255,0.08)',
                        }}
                      >
                        <div style={{ display: 'flex', alignItems: 'center', gap: 6, color: 'rgba(248,250,252,0.55)', fontFamily: 'var(--font-body)', fontSize: '0.7rem', textTransform: 'uppercase', letterSpacing: '0.05em', fontWeight: 600, marginBottom: 6 }}>
                          <Icon size={11} /> {k.label}
                        </div>
                        <div style={{ fontFamily: 'var(--font-heading)', fontSize: '1.5rem', fontWeight: 700 }}>
                          {k.value}
                        </div>
                      </div>
                    )
                  })}
                </div>
              </motion.div>
            </AnimatePresence>
          </>
        )}
      </div>

      {/* Footer */}
      <div
        style={{
          padding: '0.75rem 1.5rem',
          borderTop: '1px solid rgba(255,255,255,0.08)',
          fontFamily: 'var(--font-body)', fontSize: '0.7rem',
          color: 'rgba(248,250,252,0.5)',
          display: 'flex', justifyContent: 'space-between',
        }}
      >
        <span>← / → para navegar · Esc para salir · Espacio = siguiente</span>
        <span>Startups<span style={{ color: '#DA4E24' }}>4</span>Climate</span>
      </div>
    </div>
  )
}
