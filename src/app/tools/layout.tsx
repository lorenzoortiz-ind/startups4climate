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
  ExternalLink,
  ChevronDown,
  ChevronRight,
  Radio,
  Target,
  FileText,
  BookOpen,
  User,
} from 'lucide-react'
import { useAuth } from '@/context/AuthContext'
import S4CLogo from '@/components/S4CLogo'
import DarkModeToggle from '@/components/tools/DarkModeToggle'
import MentorWidget from '@/components/ai/MentorWidget'
import { TOOLS_BY_STAGE, TRANSVERSAL_TOOLS, type ToolDef } from '@/lib/tools-data'
import { getProgress } from '@/lib/progress'

const STAGE_CONFIG = {
  1: { label: 'Pre-incubación', color: '#7C3AED', bg: 'rgba(124,58,237,0.07)' },
  2: { label: 'Incubación', color: '#059669', bg: 'rgba(5,150,105,0.07)' },
  3: { label: 'Aceleración', color: '#D97706', bg: 'rgba(217,119,6,0.07)' },
  4: { label: 'Escalamiento', color: '#0891B2', bg: 'rgba(8,145,178,0.07)' },
} as const

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
  // Non-transversal tools in this stage
  const nonTransversalTools = tools.filter((t) => !t.transversal)
  // Transversal tools (from all stages) shown in this section
  const transversalInStage = TRANSVERSAL_TOOLS
  const totalToolCount = nonTransversalTools.length + transversalInStage.length
  const completedCount =
    nonTransversalTools.filter((t) => completedIds.has(t.id)).length +
    transversalInStage.filter((t) => completedIds.has(`${t.id}__stage${stageNum}`)).length

  return (
    <div style={{ marginBottom: '0.25rem' }}>
      <button
        onClick={() => setOpen((o) => !o)}
        style={{
          width: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '0.5rem 0.75rem',
          borderRadius: 8,
          background: 'transparent',
          border: 'none',
          cursor: 'pointer',
          marginBottom: '0.25rem',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <div
            style={{
              width: 6,
              height: 6,
              borderRadius: '50%',
              background: cfg.color,
              flexShrink: 0,
            }}
          />
          <span
            style={{
              fontFamily: 'var(--font-mono)',
              fontSize: '0.6875rem',
              fontWeight: 700,
              color: cfg.color,
              textTransform: 'uppercase',
              letterSpacing: '0.05em',
            }}
          >
            {cfg.label}
          </span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.375rem' }}>
          <span
            style={{
              fontFamily: 'var(--font-mono)',
              fontSize: '0.625rem',
              color: 'var(--color-text-muted)',
            }}
          >
            {completedCount}/{totalToolCount}
          </span>
          {open ? <ChevronDown size={12} color="#9CA3AF" /> : <ChevronRight size={12} color="#9CA3AF" />}
        </div>
      </button>

      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.22 }}
            style={{ overflow: 'hidden' }}
          >
            <div style={{ display: 'flex', flexDirection: 'column', gap: 2, paddingLeft: '0.375rem' }}>
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
                      padding: '0.4375rem 0.625rem',
                      borderRadius: 8,
                      background: active ? cfg.bg : 'transparent',
                      border: active ? `1px solid ${cfg.color}22` : '1px solid transparent',
                      textDecoration: 'none',
                      transition: 'all 0.15s ease',
                    }}
                    onMouseEnter={(e) => {
                      if (!active) e.currentTarget.style.background = 'var(--color-bg-muted)'
                    }}
                    onMouseLeave={(e) => {
                      if (!active) e.currentTarget.style.background = 'transparent'
                    }}
                  >
                    {done ? (
                      <CheckCircle2 size={13} color={cfg.color} style={{ flexShrink: 0 }} />
                    ) : (
                      <Circle
                        size={13}
                        color={active ? cfg.color : '#D1D5DB'}
                        style={{ flexShrink: 0 }}
                      />
                    )}
                    <span
                      title={tool.shortName}
                      style={{
                        fontFamily: 'var(--font-body)',
                        fontSize: '0.8125rem',
                        fontWeight: active ? 600 : 400,
                        color: active
                          ? cfg.color
                          : done
                          ? 'var(--color-text-secondary)'
                          : 'var(--color-text-secondary)',
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
              {/* Transversal tools — shown in every stage with stage-specific link */}
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
                      padding: '0.4375rem 0.625rem',
                      borderRadius: 8,
                      background: active ? cfg.bg : 'transparent',
                      border: active
                        ? `1px solid ${cfg.color}22`
                        : '1px solid transparent',
                      textDecoration: 'none',
                      transition: 'all 0.15s ease',
                    }}
                    onMouseEnter={(e) => {
                      if (!active) e.currentTarget.style.background = 'var(--color-bg-muted)'
                    }}
                    onMouseLeave={(e) => {
                      if (!active) e.currentTarget.style.background = 'transparent'
                    }}
                  >
                    {done ? (
                      <CheckCircle2 size={13} color={cfg.color} style={{ flexShrink: 0 }} />
                    ) : (
                      <Circle
                        size={13}
                        color={active ? cfg.color : '#D1D5DB'}
                        style={{ flexShrink: 0 }}
                      />
                    )}
                    <span
                      title={tool.shortName}
                      style={{
                        fontFamily: 'var(--font-body)',
                        fontSize: '0.8125rem',
                        fontWeight: active ? 600 : 400,
                        color: active
                          ? cfg.color
                          : done
                          ? 'var(--color-text-secondary)'
                          : 'var(--color-text-secondary)',
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
                        padding: '1px 5px',
                        borderRadius: 9999,
                        background: 'rgba(107,114,128,0.1)',
                        color: 'var(--color-text-muted)',
                        fontFamily: 'var(--font-mono)',
                        fontSize: '0.5rem',
                        fontWeight: 600,
                        lineHeight: 1.6,
                        flexShrink: 0,
                        letterSpacing: '0.02em',
                      }}
                    >
                      Transversal
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
  const { user, loading, logout } = useAuth()
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const stageParam = searchParams.get('stage')
  const currentSearchStage = stageParam ? parseInt(stageParam, 10) : null
  const [mobileOpen, setMobileOpen] = useState(false)
  const [completedIds, setCompletedIds] = useState<Set<string>>(new Set())
  const [profileIncomplete, setProfileIncomplete] = useState(false)

  useEffect(() => {
    if (!loading && !user) {
      router.replace('/')
    }
  }, [user, loading, router])

  useEffect(() => {
    if (!loading && user && pathname === '/tools') {
      const checked = sessionStorage.getItem('s4c_profile_checked')
      if (checked) return
      sessionStorage.setItem('s4c_profile_checked', '1')

      try {
        const extra = localStorage.getItem('s4c_profile_extra')
        if (!extra || extra === '{}') {
          router.replace('/tools/completar-perfil')
        }
      } catch {
        // ignore
      }
    }
  }, [user, loading, pathname, router])

  useEffect(() => {
    try {
      const extra = localStorage.getItem('s4c_profile_extra')
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
  }, [])

  // Apply dark mode on mount, clean up on unmount (so landing stays light)
  useEffect(() => {
    const saved = localStorage.getItem('s4c_dark_mode')
    if (saved === 'true') {
      document.documentElement.setAttribute('data-theme', 'dark')
    }
    return () => {
      document.documentElement.removeAttribute('data-theme')
    }
  }, [])

  useEffect(() => {
    if (user) {
      const progress = getProgress(user.id)
      setCompletedIds(new Set(Object.entries(progress).filter(([, v]) => v.completed).map(([k]) => k)))
    }
  }, [user, pathname])

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
            width: 40,
            height: 40,
            borderRadius: '50%',
            border: '3px solid #E5E7EB',
            borderTopColor: '#059669',
            animation: 'spin 0.8s linear infinite',
          }}
        />
        <style>{`@keyframes spin{from{transform:rotate(0)}to{transform:rotate(360deg)}}`}</style>
      </div>
    )
  }

  // Non-transversal tools + transversal tools * 4 stages
  const nonTransversalCount = Object.values(TOOLS_BY_STAGE).flat().filter((t) => !t.transversal).length
  const totalTools = nonTransversalCount + TRANSVERSAL_TOOLS.length * 4
  const completedCount = completedIds.size

  const sidebarContent = (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        height: '100%',
        padding: '1.25rem 0.875rem',
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
          marginBottom: '1.5rem',
          padding: '0 0.375rem',
        }}
      >
        <S4CLogo size={30} />
        <span
          style={{
            fontFamily: 'var(--font-heading)',
            fontWeight: 700,
            fontSize: '0.9rem',
            color: 'var(--color-text-primary)',
            letterSpacing: '-0.01em',
          }}
        >
          Startups<span style={{ color: '#059669' }}>4</span>Climate
        </span>
      </Link>

      {/* User info */}
      <div
        style={{
          padding: '0.875rem',
          borderRadius: 12,
          background: 'linear-gradient(135deg, rgba(5,150,105,0.06), rgba(5,150,105,0.02))',
          border: '1px solid rgba(5,150,105,0.12)',
          marginBottom: '1.25rem',
        }}
      >
        <div
          style={{
            fontFamily: 'var(--font-body)',
            fontSize: '0.8125rem',
            fontWeight: 600,
            color: 'var(--color-text-primary)',
            marginBottom: '0.125rem',
          }}
        >
          {user.name}
        </div>
        <div
          style={{
            fontFamily: 'var(--font-body)',
            fontSize: '0.75rem',
            color: 'var(--color-text-secondary)',
            marginBottom: '0.625rem',
          }}
        >
          {user.startup}
        </div>
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginBottom: '0.375rem',
          }}
        >
          <span
            style={{
              fontFamily: 'var(--font-mono)',
              fontSize: '0.625rem',
              color: 'var(--color-text-muted)',
            }}
          >
            Progreso general
          </span>
          <span
            style={{
              fontFamily: 'var(--font-mono)',
              fontSize: '0.625rem',
              fontWeight: 700,
              color: '#059669',
            }}
          >
            {completedCount}/{totalTools}
          </span>
        </div>
        <div style={{ height: 4, borderRadius: 2, background: 'rgba(5,150,105,0.12)' }}>
          <div
            style={{
              height: '100%',
              borderRadius: 2,
              background: '#059669',
              width: `${(completedCount / totalTools) * 100}%`,
              transition: 'width 0.6s ease',
            }}
          />
        </div>
      </div>

      {profileIncomplete && (
        <Link
          href="/tools/perfil"
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            padding: '0.5rem 0.75rem',
            borderRadius: 8,
            background: 'rgba(217,119,6,0.08)',
            border: '1px solid rgba(217,119,6,0.15)',
            textDecoration: 'none',
            marginBottom: '0.75rem',
            transition: 'all 0.15s',
          }}
        >
          <span style={{
            fontFamily: 'var(--font-body)',
            fontSize: '0.6875rem',
            color: '#D97706',
            lineHeight: 1.4,
          }}>
            Completa tu perfil para recomendaciones personalizadas
          </span>
        </Link>
      )}

      {/* Dashboard link */}
      <Link
        href="/tools"
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '0.5rem',
          padding: '0.5rem 0.75rem',
          borderRadius: 8,
          background: pathname === '/tools' ? 'rgba(5,150,105,0.07)' : 'transparent',
          border: pathname === '/tools' ? '1px solid rgba(5,150,105,0.15)' : '1px solid transparent',
          textDecoration: 'none',
          marginBottom: '0.75rem',
          transition: 'all 0.15s',
        }}
        onMouseEnter={(e) => {
          if (pathname !== '/tools') e.currentTarget.style.background = 'var(--color-bg-muted)'
        }}
        onMouseLeave={(e) => {
          if (pathname !== '/tools') e.currentTarget.style.background = 'transparent'
        }}
      >
        <LayoutDashboard
          size={15}
          color={pathname === '/tools' ? '#059669' : '#9CA3AF'}
        />
        <span
          style={{
            fontFamily: 'var(--font-body)',
            fontSize: '0.8125rem',
            fontWeight: pathname === '/tools' ? 600 : 400,
            color: pathname === '/tools' ? '#059669' : 'var(--color-text-secondary)',
          }}
        >
          Dashboard
        </span>
      </Link>

      <div
        style={{
          height: 1,
          background: 'var(--color-border)',
          margin: '0 0.375rem 0.75rem',
        }}
      />

      {/* Featured tools */}
      {[
        { label: 'RADAR', icon: Radio, href: '/tools/radar', color: '#6366F1' },
        { label: 'Oportunidades', icon: Target, href: '/tools/oportunidades', color: '#D97706' },
        { label: 'Passport', icon: FileText, href: '/tools/passport', color: '#0891B2' },
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
              borderRadius: 8,
              background: active ? `${item.color}0D` : 'transparent',
              border: active ? `1px solid ${item.color}25` : '1px solid transparent',
              textDecoration: 'none',
              marginBottom: '0.125rem',
              transition: 'all 0.15s',
            }}
            onMouseEnter={(e) => {
              if (!active) e.currentTarget.style.background = 'var(--color-bg-muted)'
            }}
            onMouseLeave={(e) => {
              if (!active) e.currentTarget.style.background = 'transparent'
            }}
          >
            <IconComp size={15} color={active ? item.color : '#9CA3AF'} />
            <span
              style={{
                fontFamily: 'var(--font-body)',
                fontSize: '0.8125rem',
                fontWeight: active ? 600 : 400,
                color: active ? item.color : 'var(--color-text-secondary)',
                flex: 1,
              }}
            >
              {item.label}
            </span>
            <span
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                padding: '1px 6px',
                borderRadius: 9999,
                background: '#059669',
                color: 'white',
                fontFamily: 'var(--font-mono)',
                fontSize: '0.5625rem',
                fontWeight: 700,
                lineHeight: 1.6,
              }}
            >
              Nuevo
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
          borderRadius: 8,
          background: pathname === '/tools/recursos' ? 'rgba(5,150,105,0.07)' : 'transparent',
          border: pathname === '/tools/recursos' ? '1px solid rgba(5,150,105,0.15)' : '1px solid transparent',
          textDecoration: 'none',
          color: pathname === '/tools/recursos' ? '#059669' : 'var(--color-text-muted)',
          fontFamily: 'var(--font-body)',
          fontSize: '0.8125rem',
          fontWeight: pathname === '/tools/recursos' ? 600 : 400,
          transition: 'all 0.15s',
          marginBottom: '0.25rem',
        }}
        onMouseEnter={(e) => {
          if (pathname !== '/tools/recursos') e.currentTarget.style.color = 'var(--color-text-primary)'
        }}
        onMouseLeave={(e) => {
          if (pathname !== '/tools/recursos') e.currentTarget.style.color = 'var(--color-text-muted)'
        }}
      >
        <BookOpen size={13} />
        Recursos
      </Link>

      <div
        style={{
          height: 1,
          background: 'var(--color-border)',
          margin: '0.5rem 0.375rem 0.75rem',
        }}
      />

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
      <div style={{ marginTop: 'auto', paddingTop: '1rem' }}>
        <div style={{ height: 1, background: 'var(--color-border)', margin: '0 0.375rem 1rem' }} />

        {/* Perfil */}
        <Link
          href="/tools/perfil"
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            padding: '0.5rem 0.75rem',
            borderRadius: 8,
            background: pathname === '/tools/perfil' ? 'rgba(5,150,105,0.07)' : 'transparent',
            border: pathname === '/tools/perfil' ? '1px solid rgba(5,150,105,0.15)' : '1px solid transparent',
            textDecoration: 'none',
            color: pathname === '/tools/perfil' ? '#059669' : 'var(--color-text-muted)',
            fontFamily: 'var(--font-body)',
            fontSize: '0.8125rem',
            fontWeight: pathname === '/tools/perfil' ? 600 : 400,
            transition: 'all 0.15s',
            marginBottom: '0.75rem',
          }}
          onMouseEnter={(e) => {
            if (pathname !== '/tools/perfil') e.currentTarget.style.color = 'var(--color-text-primary)'
          }}
          onMouseLeave={(e) => {
            if (pathname !== '/tools/perfil') e.currentTarget.style.color = 'var(--color-text-muted)'
          }}
        >
          <User size={13} />
          Perfil
        </Link>
        <DarkModeToggle />
        <Link
          href="/"
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            padding: '0.5rem 0.75rem',
            borderRadius: 8,
            textDecoration: 'none',
            color: 'var(--color-text-muted)',
            fontFamily: 'var(--font-body)',
            fontSize: '0.8125rem',
            transition: 'color 0.15s',
            marginBottom: '0.25rem',
          }}
          onMouseEnter={(e) => (e.currentTarget.style.color = 'var(--color-text-primary)')}
          onMouseLeave={(e) => (e.currentTarget.style.color = 'var(--color-text-muted)')}
        >
          <ExternalLink size={13} />
          Volver al inicio
        </Link>
        <button
          onClick={logout}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            padding: '0.5rem 0.75rem',
            borderRadius: 8,
            background: 'transparent',
            border: 'none',
            cursor: 'pointer',
            color: 'var(--color-text-muted)',
            fontFamily: 'var(--font-body)',
            fontSize: '0.8125rem',
            width: '100%',
            textAlign: 'left',
            transition: 'color 0.15s',
          }}
          onMouseEnter={(e) => (e.currentTarget.style.color = '#DC2626')}
          onMouseLeave={(e) => (e.currentTarget.style.color = 'var(--color-text-muted)')}
        >
          <LogOut size={13} />
          Cerrar sesión
        </button>
      </div>
    </div>
  )

  return (
    <div
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
          background: 'var(--color-bg-card)',
          borderRight: '1px solid var(--color-border)',
          position: 'fixed',
          top: 0,
          left: 0,
          bottom: 0,
          zIndex: 40,
          flexDirection: 'column',
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
          height: 56,
          background: 'var(--color-bg-card)',
          backdropFilter: 'blur(16px)',
          borderBottom: '1px solid var(--color-border)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '0 1rem',
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
          <S4CLogo size={28} />
          <span style={{ fontFamily: 'var(--font-heading)', fontWeight: 700, fontSize: '0.9rem', color: 'var(--color-text-primary)' }}>
            Plataforma
          </span>
        </Link>
        <button
          onClick={() => setMobileOpen((o) => !o)}
          style={{
            background: 'none',
            border: 'none',
            cursor: 'pointer',
            color: 'var(--color-text-primary)',
            display: 'flex',
          }}
        >
          {mobileOpen ? <X size={22} /> : <Menu size={22} />}
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
                background: 'rgba(0,0,0,0.3)',
              }}
            />
            <motion.aside
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'tween', duration: 0.28, ease: 'easeInOut' }}
              style={{
                position: 'fixed',
                top: 0,
                left: 0,
                bottom: 0,
                width: 260,
                zIndex: 60,
                background: 'var(--color-bg-card)',
                borderRight: '1px solid var(--color-border)',
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
          marginLeft: 0,
          paddingTop: 0,
          minHeight: '100vh',
          minWidth: 0,
          overflowX: 'hidden',
          overflowWrap: 'break-word' as const,
          wordBreak: 'break-word' as const,
        }}
        className="lg:ml-[240px] pt-14 lg:pt-0"
      >
        {children}
      </main>

      {/* Floating Mentor AI Widget */}
      <MentorWidget />
    </div>
  )
}

export default function ToolsLayout({ children }: { children: React.ReactNode }) {
  return (
    <Suspense>
      <ToolsLayoutInner>{children}</ToolsLayoutInner>
    </Suspense>
  )
}
