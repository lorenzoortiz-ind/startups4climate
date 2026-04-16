'use client'

import { Suspense, useEffect, useState } from 'react'
import { useRouter, usePathname, useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'
import {
  LayoutDashboard,
  LogOut,
  Menu,
  X,
  CheckCircle2,
  Circle,
  ChevronDown,
  ChevronRight,
  Radio,
  Target,
  FileText,
  BookOpen,
  User,
  Building2,
  Users,
} from 'lucide-react'
import { useAuth } from '@/context/AuthContext'
import S4CLogo from '@/components/S4CLogo'
import MentorWidget from '@/components/ai/MentorWidget'
import { TOOLS_BY_STAGE, TRANSVERSAL_TOOLS, type ToolDef } from '@/lib/tools-data'
import { getProgress, hydrateProgressFromSupabase } from '@/lib/progress'
import { ErrorBoundary } from '@/components/ErrorBoundary'
import { supabase } from '@/lib/supabase'

const STAGE_CONFIG = {
  1: { label: 'Pre-incubación', color: '#FF6B4A' },
  2: { label: 'Incubación', color: '#0D9488' },
  3: { label: 'Aceleración', color: '#D97706' },
  4: { label: 'Escalamiento', color: '#3B82F6' },
} as const

/* ─── Sidebar palette ─── */
const SB = {
  bg: '#0f0f1a',
  text: '#94A3B8',
  textActive: '#FFFFFF',
  textHover: '#F1F5F9',
  textMuted: 'rgba(255,255,255,0.35)',
  divider: 'rgba(255,255,255,0.06)',
  hoverBg: 'rgba(255,255,255,0.06)',
  cardBg: 'rgba(255,255,255,0.04)',
}

function StageSidebarSection({
  stageNum,
  tools,
  completedIds,
  currentPath,
  currentSearchStage,
}: {
  stageNum: 1 | 2 | 3 | 4
  tools: ToolDef[]
  completedIds: Set<string>
  currentPath: string
  currentSearchStage: number | null
}) {
  const cfg = STAGE_CONFIG[stageNum]
  const [open, setOpen] = useState(false)
  const nonTransversalTools = tools.filter((t) => !t.transversal)
  const transversalInStage = TRANSVERSAL_TOOLS
  const totalToolCount = nonTransversalTools.length + transversalInStage.length
  const completedCount =
    nonTransversalTools.filter((t) => completedIds.has(t.id)).length +
    transversalInStage.filter((t) => completedIds.has(`${t.id}__stage${stageNum}`)).length

  return (
    <div style={{ marginBottom: '0.125rem' }}>
      <button
        onClick={() => setOpen((o) => !o)}
        style={{
          width: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '0.4375rem 0.75rem',
          borderRadius: 8,
          background: open ? SB.cardBg : 'transparent',
          border: 'none',
          cursor: 'pointer',
          transition: 'background 0.15s',
        }}
        onMouseEnter={(e) => { if (!open) e.currentTarget.style.background = SB.hoverBg }}
        onMouseLeave={(e) => { if (!open) e.currentTarget.style.background = 'transparent' }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <div
            style={{
              width: 5,
              height: 5,
              borderRadius: '50%',
              background: cfg.color,
              flexShrink: 0,
            }}
          />
          <span
            style={{
              fontFamily: 'var(--font-body)',
              fontSize: '0.6875rem',
              fontWeight: 600,
              color: cfg.color,
              textTransform: 'uppercase',
              letterSpacing: '0.06em',
            }}
          >
            {cfg.label}
          </span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.375rem' }}>
          <span
            style={{
              fontFamily: 'var(--font-body)',
              fontSize: '0.5625rem',
              color: SB.textMuted,
              fontWeight: 500,
            }}
          >
            {completedCount}/{totalToolCount}
          </span>
          {open ? (
            <ChevronDown size={11} color={SB.textMuted} />
          ) : (
            <ChevronRight size={11} color={SB.textMuted} />
          )}
        </div>
      </button>

      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            style={{ overflow: 'hidden' }}
          >
            <div style={{ display: 'flex', flexDirection: 'column', gap: 1, paddingLeft: '0.25rem', paddingTop: '0.125rem' }}>
              {nonTransversalTools.map((tool) => {
                const active = currentPath === `/tools/${tool.id}`
                const done = completedIds.has(tool.id)
                return (
                  <Link
                    key={tool.id}
                    href={`/tools/${tool.id}`}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.5rem',
                      padding: '0.375rem 0.625rem',
                      borderRadius: 6,
                      background: active ? 'rgba(255,107,74,0.12)' : 'transparent',
                      textDecoration: 'none',
                      transition: 'all 0.15s ease',
                    }}
                    onMouseEnter={(e) => {
                      if (!active) e.currentTarget.style.background = SB.hoverBg
                    }}
                    onMouseLeave={(e) => {
                      if (!active) e.currentTarget.style.background = 'transparent'
                    }}
                  >
                    {done ? (
                      <CheckCircle2 size={12} color={cfg.color} style={{ flexShrink: 0 }} />
                    ) : (
                      <Circle
                        size={12}
                        color={active ? '#FF6B4A' : SB.textMuted}
                        style={{ flexShrink: 0 }}
                      />
                    )}
                    <span
                      title={tool.shortName}
                      style={{
                        fontFamily: 'var(--font-body)',
                        fontSize: '0.6875rem',
                        fontWeight: active ? 600 : 400,
                        color: active ? SB.textActive : SB.text,
                        lineHeight: 1.3,
                        flex: 1,
                        minWidth: 0,
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        whiteSpace: 'nowrap',
                      }}
                    >
                      {tool.shortName}
                    </span>
                  </Link>
                )
              })}
              {/* Transversal tools */}
              {TRANSVERSAL_TOOLS.map((tool) => {
                const href = `/tools/${tool.id}?stage=${stageNum}`
                const active = currentPath === `/tools/${tool.id}` && currentSearchStage === stageNum
                const storageKey = `${tool.id}__stage${stageNum}`
                const done = completedIds.has(storageKey)
                return (
                  <Link
                    key={`transversal-${tool.id}-s${stageNum}`}
                    href={href}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.5rem',
                      padding: '0.375rem 0.625rem',
                      borderRadius: 6,
                      background: active ? 'rgba(255,107,74,0.12)' : 'transparent',
                      textDecoration: 'none',
                      transition: 'all 0.15s ease',
                    }}
                    onMouseEnter={(e) => {
                      if (!active) e.currentTarget.style.background = SB.hoverBg
                    }}
                    onMouseLeave={(e) => {
                      if (!active) e.currentTarget.style.background = 'transparent'
                    }}
                  >
                    {done ? (
                      <CheckCircle2 size={12} color={cfg.color} style={{ flexShrink: 0 }} />
                    ) : (
                      <Circle
                        size={12}
                        color={active ? '#FF6B4A' : SB.textMuted}
                        style={{ flexShrink: 0 }}
                      />
                    )}
                    <span
                      title={tool.shortName}
                      style={{
                        fontFamily: 'var(--font-body)',
                        fontSize: '0.6875rem',
                        fontWeight: active ? 600 : 400,
                        color: active ? SB.textActive : SB.text,
                        lineHeight: 1.3,
                        flex: 1,
                        minWidth: 0,
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        whiteSpace: 'nowrap',
                      }}
                    >
                      {tool.shortName}
                    </span>
                    <span
                      style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        padding: '0px 5px',
                        borderRadius: 4,
                        background: 'rgba(255,255,255,0.06)',
                        color: SB.textMuted,
                        fontFamily: 'var(--font-body)',
                        fontSize: '0.5rem',
                        fontWeight: 500,
                        lineHeight: 1.6,
                        flexShrink: 0,
                      }}
                    >
                      T
                    </span>
                  </Link>
                )
              })}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

function ToolsLayoutInner({ children }: { children: React.ReactNode }) {
  const { user, appUser, loading, logout, isDemo } = useAuth()
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const stageParam = searchParams.get('stage')
  const currentSearchStage = stageParam ? parseInt(stageParam, 10) : null
  const [mobileOpen, setMobileOpen] = useState(false)
  const [completedIds, setCompletedIds] = useState<Set<string>>(new Set())
  const [profileIncomplete, setProfileIncomplete] = useState(false)
  const [orgName, setOrgName] = useState<string | null>(null)

  // Scroll to top on route change
  useEffect(() => {
    window.scrollTo(0, 0)
  }, [pathname])

  useEffect(() => {
    if (!loading && !user) {
      router.replace('/')
    }
  }, [user, loading, router])

  useEffect(() => {
    if (!loading && user && pathname === '/tools' && !isDemo) {
      const checked = sessionStorage.getItem('s4c_profile_checked')
      if (checked) return
      sessionStorage.setItem('s4c_profile_checked', '1')
      try {
        const extra = localStorage.getItem(`s4c_${user.id}_profile_extra`)
          || localStorage.getItem('s4c_profile_extra') // legacy fallback
        if (!extra || extra === '{}') {
          router.replace('/tools/completar-perfil')
        }
      } catch {
        // ignore
      }
    }
  }, [user, loading, pathname, router, isDemo])

  useEffect(() => {
    if (!user) return
    try {
      const extra = localStorage.getItem(`s4c_${user.id}_profile_extra`)
        || localStorage.getItem('s4c_profile_extra') // legacy fallback
      if (!extra || extra === '{}') {
        setProfileIncomplete(true)
      } else {
        const parsed = JSON.parse(extra)
        const missing = !parsed.vertical || !parsed.country || !parsed.role
        setProfileIncomplete(missing)
      }
    } catch {
      setProfileIncomplete(true)
    }
  }, [user])

  // Load org name if founder belongs to one
  useEffect(() => {
    if (appUser?.org_id) {
      supabase
        .from('organizations')
        .select('name')
        .eq('id', appUser.org_id)
        .single()
        .then(({ data }) => {
          if (data?.name) setOrgName(data.name)
        })
    }
  }, [appUser?.org_id])

  useEffect(() => {
    if (user) {
      const progress = getProgress(user.id)
      setCompletedIds(new Set(Object.entries(progress).filter(([, v]) => v.completed).map(([k]) => k)))
      if (isDemo) return
      // Hydrate from Supabase on first load
      hydrateProgressFromSupabase(user.id).then((changed) => {
        if (changed) {
          const updated = getProgress(user.id)
          setCompletedIds(new Set(Object.entries(updated).filter(([, v]) => v.completed).map(([k]) => k)))
        }
      })
    }
  }, [user, pathname, isDemo])

  if (loading || !user) {
    return (
      <div
        style={{
          minHeight: '100vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: 'var(--color-bg-primary)',
        }}
      >
        <div
          style={{
            width: 36,
            height: 36,
            borderRadius: '50%',
            border: '2px solid #E8E4DF',
            borderTopColor: '#0D9488',
            animation: 'spin 0.8s linear infinite',
          }}
        />

      </div>
    )
  }

  const nonTransversalCount = Object.values(TOOLS_BY_STAGE).flat().filter((t) => !t.transversal).length
  const totalTools = nonTransversalCount + TRANSVERSAL_TOOLS.length * 4
  const completedCount = completedIds.size
  const progressPct = totalTools > 0 ? Math.round((completedCount / totalTools) * 100) : 0

  const sidebarContent = (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        height: '100%',
        padding: '1.25rem 0.75rem',
        overflowY: 'auto',
      }}
    >
      {/* Logo */}
      <Link
        href="/"
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '0.5rem',
          textDecoration: 'none',
          marginBottom: '1.25rem',
          padding: '0 0.5rem',
        }}
      >
        <S4CLogo size={26} />
        <span
          style={{
            fontFamily: 'var(--font-heading)',
            fontWeight: 700,
            fontSize: '0.625rem',
            color: '#FFFFFF',
            letterSpacing: '-0.02em',
          }}
        >
          Startups<span style={{ color: '#FF6B4A' }}>4</span>Climate
        </span>
      </Link>

      {/* Role badge */}
      <div style={{
        display: 'inline-block',
        background: 'rgba(13,148,136,0.15)',
        color: '#0D9488',
        fontFamily: 'var(--font-body)',
        fontSize: '0.5625rem',
        fontWeight: 600,
        textTransform: 'uppercase',
        padding: '0.2rem 0.5rem',
        borderRadius: 4,
        letterSpacing: '0.06em',
        marginBottom: '0.5rem',
      }}>
        Founder
      </div>

      {/* User card + progress */}
      <div
        style={{
          padding: '0.625rem 0.75rem',
          borderRadius: 10,
          background: SB.cardBg,
          border: '1px solid rgba(255,255,255,0.04)',
          marginBottom: '0.875rem',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
          <div
            style={{
              width: 28,
              height: 28,
              borderRadius: 7,
              background: 'rgba(255,107,74,0.12)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0,
            }}
          >
            <span
              style={{
                fontFamily: 'var(--font-body)',
                fontSize: '0.6875rem',
                fontWeight: 700,
                color: '#FF6B4A',
              }}
            >
              {user.name?.charAt(0)?.toUpperCase() || 'U'}
            </span>
          </div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div
              style={{
                fontFamily: 'var(--font-body)',
                fontSize: '0.6875rem',
                fontWeight: 600,
                color: '#FFFFFF',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                whiteSpace: 'nowrap',
                lineHeight: 1.2,
              }}
            >
              {user.name}
            </div>
            <div
              style={{
                fontFamily: 'var(--font-body)',
                fontSize: '0.625rem',
                color: SB.textMuted,
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                whiteSpace: 'nowrap',
                lineHeight: 1.3,
              }}
            >
              {user.startup || user.email}
            </div>
          </div>
          <span
            style={{
              fontFamily: 'var(--font-body)',
              fontSize: '0.625rem',
              fontWeight: 700,
              color: '#FF6B4A',
            }}
          >
            {progressPct}%
          </span>
        </div>
        <div style={{ height: 3, borderRadius: 2, background: 'rgba(255,255,255,0.06)' }}>
          <div
            style={{
              height: '100%',
              borderRadius: 2,
              background: 'linear-gradient(90deg, #FF6B4A, #0D9488)',
              width: `${progressPct}%`,
              transition: 'width 0.6s ease',
            }}
          />
        </div>
        <div
          style={{
            fontFamily: 'var(--font-body)',
            fontSize: '0.5625rem',
            color: SB.textMuted,
            marginTop: '0.25rem',
          }}
        >
          {completedCount}/{totalTools} herramientas completadas
        </div>
      </div>

      {profileIncomplete && (
        <Link
          href="/tools/perfil"
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            padding: '0.4375rem 0.75rem',
            borderRadius: 8,
            background: 'rgba(255,107,74,0.06)',
            border: '1px solid rgba(255,107,74,0.1)',
            textDecoration: 'none',
            marginBottom: '0.625rem',
            transition: 'all 0.15s',
          }}
        >
          <span
            style={{
              fontFamily: 'var(--font-body)',
              fontSize: '0.6875rem',
              color: '#FF6B4A',
              lineHeight: 1.4,
            }}
          >
            Completa tu perfil para recomendaciones personalizadas
          </span>
        </Link>
      )}

      {/* Mi programa section */}
      <div
        style={{
          padding: '0.5rem 0.75rem',
          borderRadius: 8,
          background: SB.cardBg,
          border: '1px solid rgba(255,255,255,0.04)',
          marginBottom: '0.875rem',
        }}
      >
        <div
          style={{
            fontFamily: 'var(--font-body)',
            fontSize: '0.5625rem',
            fontWeight: 600,
            color: SB.textMuted,
            textTransform: 'uppercase',
            letterSpacing: '0.08em',
            marginBottom: '0.375rem',
          }}
        >
          Mi programa
        </div>
        {appUser?.org_id && orgName ? (
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.375rem' }}>
            <Building2 size={12} color="#0D9488" style={{ flexShrink: 0 }} />
            <span
              style={{
                fontFamily: 'var(--font-body)',
                fontSize: '0.6875rem',
                fontWeight: 500,
                color: SB.textActive,
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                whiteSpace: 'nowrap',
              }}
            >
              {orgName}
            </span>
          </div>
        ) : (
          <Link
            href="/tools/programas"
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.375rem',
              textDecoration: 'none',
              padding: '0.125rem 0',
              transition: 'opacity 0.15s',
            }}
            onMouseEnter={(e) => { e.currentTarget.style.opacity = '0.8' }}
            onMouseLeave={(e) => { e.currentTarget.style.opacity = '1' }}
          >
            <Users size={12} color={SB.textMuted} style={{ flexShrink: 0 }} />
            <span
              style={{
                fontFamily: 'var(--font-body)',
                fontSize: '0.625rem',
                color: SB.text,
              }}
            >
              Unirse a un programa
            </span>
          </Link>
        )}
      </div>

      {/* Dashboard link */}
      <Link
        href="/tools"
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '0.5rem',
          padding: '0.5rem 0.75rem',
          borderRadius: 9999,
          background: pathname === '/tools' ? '#FF6B4A' : 'transparent',
          textDecoration: 'none',
          marginBottom: '0.25rem',
          transition: 'all 0.15s',
        }}
        onMouseEnter={(e) => {
          if (pathname !== '/tools') e.currentTarget.style.background = SB.hoverBg
        }}
        onMouseLeave={(e) => {
          if (pathname !== '/tools') e.currentTarget.style.background = 'transparent'
        }}
      >
        <LayoutDashboard size={18} color={pathname === '/tools' ? '#FFFFFF' : SB.text} />
        <span
          style={{
            fontFamily: 'var(--font-body)',
            fontSize: '0.6875rem',
            fontWeight: pathname === '/tools' ? 600 : 400,
            color: pathname === '/tools' ? SB.textActive : SB.text,
          }}
        >
          Dashboard
        </span>
      </Link>

      <div style={{ height: 1, background: SB.divider, margin: '0.25rem 0.5rem 0.5rem' }} />

      {/* Featured tools */}
      {[
        { label: 'RADAR', icon: Radio, href: '/tools/radar', color: '#0D9488' },
        { label: 'Oportunidades', icon: Target, href: '/tools/oportunidades', color: '#FF6B4A' },
        { label: 'Passport', icon: FileText, href: '/tools/passport', color: '#0D9488' },
      ].map((item) => {
        const active = pathname === item.href
        const IconComp = item.icon
        return (
          <Link
            key={item.href}
            href={item.href}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              padding: '0.5rem 0.75rem',
              borderRadius: 9999,
              background: active ? '#FF6B4A' : 'transparent',
              textDecoration: 'none',
              marginBottom: '0.0625rem',
              transition: 'all 0.15s',
            }}
            onMouseEnter={(e) => {
              if (!active) e.currentTarget.style.background = SB.hoverBg
            }}
            onMouseLeave={(e) => {
              if (!active) e.currentTarget.style.background = 'transparent'
            }}
          >
            <IconComp size={18} color={active ? '#FFFFFF' : SB.text} />
            <span
              style={{
                fontFamily: 'var(--font-body)',
                fontSize: '0.6875rem',
                fontWeight: active ? 600 : 400,
                color: active ? SB.textActive : SB.text,
                flex: 1,
              }}
            >
              {item.label}
            </span>
          </Link>
        )
      })}

      {/* Recursos */}
      <Link
        href="/tools/recursos"
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '0.5rem',
          padding: '0.5rem 0.75rem',
          borderRadius: 9999,
          background: pathname === '/tools/recursos' ? '#FF6B4A' : 'transparent',
          textDecoration: 'none',
          color: pathname === '/tools/recursos' ? '#FFFFFF' : SB.text,
          fontFamily: 'var(--font-body)',
          fontSize: '0.6875rem',
          fontWeight: pathname === '/tools/recursos' ? 600 : 400,
          transition: 'all 0.15s',
          marginBottom: '0.125rem',
        }}
        onMouseEnter={(e) => {
          if (pathname !== '/tools/recursos') e.currentTarget.style.background = SB.hoverBg
        }}
        onMouseLeave={(e) => {
          if (pathname !== '/tools/recursos') e.currentTarget.style.background = 'transparent'
        }}
      >
        <BookOpen size={18} />
        Recursos
      </Link>

      <div style={{ height: 1, background: SB.divider, margin: '0.375rem 0.5rem 0.5rem' }} />

      {/* Section label */}
      <div
        style={{
          fontFamily: 'var(--font-body)',
          fontSize: '0.5625rem',
          fontWeight: 600,
          color: SB.textMuted,
          textTransform: 'uppercase',
          letterSpacing: '0.08em',
          padding: '0 0.75rem',
          marginBottom: '0.375rem',
        }}
      >
        Herramientas por etapa
      </div>

      {/* Tools by stage */}
      {([1, 2, 3, 4] as const).map((stage) => (
        <StageSidebarSection
          key={stage}
          stageNum={stage}
          tools={TOOLS_BY_STAGE[stage]}
          completedIds={completedIds}
          currentPath={pathname}
          currentSearchStage={currentSearchStage}
        />
      ))}

      {/* Bottom actions */}
      <div style={{ marginTop: 'auto', paddingTop: '0.75rem' }}>
        <div style={{ height: 1, background: SB.divider, margin: '0 0.5rem 0.75rem' }} />

        {/* Perfil */}
        <Link
          href="/tools/perfil"
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            padding: '0.5rem 0.75rem',
            borderRadius: 9999,
            background: pathname === '/tools/perfil' ? '#FF6B4A' : 'transparent',
            textDecoration: 'none',
            color: pathname === '/tools/perfil' ? '#FFFFFF' : SB.text,
            fontFamily: 'var(--font-body)',
            fontSize: '0.6875rem',
            fontWeight: pathname === '/tools/perfil' ? 600 : 400,
            transition: 'all 0.15s',
            marginBottom: '0.25rem',
          }}
          onMouseEnter={(e) => {
            if (pathname !== '/tools/perfil') e.currentTarget.style.background = SB.hoverBg
          }}
          onMouseLeave={(e) => {
            if (pathname !== '/tools/perfil') e.currentTarget.style.background = 'transparent'
          }}
        >
          <User size={16} />
          Perfil
        </Link>

        <button
          onClick={logout}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            padding: '0.5rem 0.75rem',
            borderRadius: 9999,
            background: 'transparent',
            border: 'none',
            cursor: 'pointer',
            color: SB.text,
            fontFamily: 'var(--font-body)',
            fontSize: '0.6875rem',
            width: '100%',
            textAlign: 'left',
            transition: 'color 0.15s',
          }}
          onMouseEnter={(e) => (e.currentTarget.style.color = '#FCA5A5')}
          onMouseLeave={(e) => (e.currentTarget.style.color = SB.text)}
        >
          <LogOut size={16} />
          Cerrar sesión
        </button>
      </div>
    </div>
  )

  return (
    <div
      data-app-layout
      style={{
        display: 'flex',
        minHeight: '100vh',
        background: 'var(--color-bg-primary)',
      }}
    >
      {/* Desktop sidebar */}
      <aside
        className="hidden lg:flex"
        style={{
          width: 240,
          flexShrink: 0,
          background: SB.bg,
          position: 'fixed',
          top: 0,
          left: 0,
          bottom: 0,
          zIndex: 40,
          flexDirection: 'column',
          borderRight: '1px solid rgba(255,255,255,0.04)',
        }}
      >
        {sidebarContent}
      </aside>

      {/* Mobile header */}
      <header
        className="lg:hidden"
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          zIndex: 50,
          height: 52,
          background: SB.bg,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '0 1rem',
          borderBottom: '1px solid rgba(255,255,255,0.04)',
        }}
      >
        <Link
          href="/tools"
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            textDecoration: 'none',
          }}
        >
          <S4CLogo size={24} />
          <span
            style={{
              fontFamily: 'var(--font-heading)',
              fontWeight: 700,
              fontSize: '0.625rem',
              color: '#FFFFFF',
              letterSpacing: '-0.02em',
            }}
          >
            Plataforma
          </span>
        </Link>
        <button
          onClick={() => setMobileOpen((o) => !o)}
          aria-label={mobileOpen ? "Cerrar menú" : "Abrir menú"}
          style={{
            background: 'none',
            border: 'none',
            cursor: 'pointer',
            color: '#FFFFFF',
            display: 'flex',
          }}
        >
          {mobileOpen ? <X size={20} /> : <Menu size={20} />}
        </button>
      </header>

      {/* Mobile drawer */}
      <AnimatePresence>
        {mobileOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setMobileOpen(false)}
              style={{
                position: 'fixed',
                inset: 0,
                zIndex: 55,
                background: 'rgba(0,0,0,0.5)',
              }}
            />
            <motion.aside
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'tween', duration: 0.25, ease: 'easeInOut' }}
              style={{
                position: 'fixed',
                top: 0,
                left: 0,
                bottom: 0,
                width: 260,
                zIndex: 60,
                background: SB.bg,
              }}
              onClick={(e) => e.stopPropagation()}
            >
              {sidebarContent}
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      {/* Main content */}
      <main
        style={{
          flex: 1,
          minHeight: '100vh',
          minWidth: 0,
          overflowX: 'hidden',
          overflowWrap: 'break-word' as const,
          wordBreak: 'break-word' as const,
        }}
        className="lg:ml-[240px] pt-14 lg:pt-0"
      >
        <ErrorBoundary>{children}</ErrorBoundary>
      </main>

      {/* Floating Mentor AI Widget */}
      <MentorWidget />
    </div>
  )
}

export default function ToolsLayout({ children }: { children: React.ReactNode }) {
  return (
    <Suspense
      fallback={
        <div
          style={{
            minHeight: '100vh',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            background: 'var(--color-bg-primary)',
          }}
        >
          <div
            style={{
              width: 36,
              height: 36,
              borderRadius: '50%',
              border: '2px solid #E8E4DF',
              borderTopColor: '#0D9488',
              animation: 'spin 0.8s linear infinite',
            }}
          />
        </div>
      }
    >
      <ToolsLayoutInner>{children}</ToolsLayoutInner>
    </Suspense>
  )
}
