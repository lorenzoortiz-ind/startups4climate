'use client'

import { useCallback, useEffect, useMemo, useState } from 'react'
import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'
import {
  CheckCircle2,
  Clock,
  ArrowRight,
  FlaskConical,
  Rocket,
  Building2,
  TrendingUp,
  Download,
  Lock,
  Lightbulb,
  Filter,
} from 'lucide-react'
import { useAuth } from '@/context/AuthContext'
import {
  TOOLS,
  TOOLS_BY_STAGE,
  STAGE_META,
  CATEGORIES,
  type ToolDef,
  type ToolCategory,
} from '@/lib/tools-data'
import { getProgress, type ProgressMap } from '@/lib/progress'
import { generateGlobalReport as generateGlobalReportUtil } from '@/lib/global-report'

/* ─── Stage icon mapping ─── */
const STAGE_ICONS = {
  1: FlaskConical,
  2: Rocket,
  3: Building2,
  4: TrendingUp,
} as const

/* ─── Navigation tabs ─── */
const NAV_TABS = [
  { label: 'Herramientas', href: '/tools', active: true },
  { label: 'Recursos', href: '/tools/recursos', active: false },
  { label: 'RADAR', href: '/tools/radar', active: false },
  { label: 'Oportunidades', href: '/tools/oportunidades', active: false },
]

/* ─── Category color mapping ─── */
const CATEGORY_COLORS: Record<ToolCategory, { color: string; bg: string }> = {
  Estrategia: { color: '#FF6B4A', bg: 'rgba(255,107,74,0.1)' },
  Mercado: { color: '#0D9488', bg: 'rgba(13,148,136,0.1)' },
  Producto: { color: '#0D9488', bg: 'rgba(13,148,136,0.1)' },
  Finanzas: { color: '#2A222B', bg: 'rgba(42,34,43,0.1)' },
  Ventas: { color: '#FF6B4A', bg: 'rgba(255,107,74,0.1)' },
  Marketing: { color: '#FF6B4A', bg: 'rgba(255,107,74,0.1)' },
  Equipo: { color: '#0D9488', bg: 'rgba(13,148,136,0.1)' },
}

/* ─── Tool card ─── */
function ToolCard({
  tool,
  done,
  locked,
  idx,
}: {
  tool: ToolDef
  done: boolean
  locked: boolean
  idx: number
}) {
  const catColor = CATEGORY_COLORS[tool.category]

  const inner = (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, delay: idx * 0.04 }}
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: '0.875rem',
        padding: '1rem 1.125rem',
        borderRadius: 14,
        background: locked
          ? 'var(--color-bg-card)'
          : done
            ? tool.stageBg
            : 'var(--color-bg-card)',
        border: `1px solid ${locked ? 'var(--color-border)' : done ? tool.stageBorder : 'var(--color-border)'}`,
        textDecoration: 'none',
        transition: 'all 0.18s ease',
        position: 'relative' as const,
        overflow: 'visible',
        opacity: locked ? 0.5 : 1,
        filter: locked ? 'grayscale(0.7)' : 'none',
        cursor: locked ? 'not-allowed' : 'pointer',
      }}
      whileHover={locked ? {} : { y: -2, boxShadow: '0 4px 20px rgba(0,0,0,0.08)' }}
    >
      {done && (
        <div
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: 3,
            height: '100%',
            background: tool.stageColor,
            borderRadius: '3px 0 0 3px',
          }}
        />
      )}
      <div
        style={{
          width: 38,
          height: 38,
          borderRadius: 10,
          background: tool.stageBg,
          border: `1px solid ${tool.stageBorder}`,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          flexShrink: 0,
        }}
      >
        {locked ? (
          <Lock size={16} color="var(--color-text-muted)" strokeWidth={1.5} />
        ) : done ? (
          <CheckCircle2 size={17} color={tool.stageColor} />
        ) : (
          <div
            style={{
              fontSize: '0.6875rem',
              fontWeight: 700,
              color: tool.stageColor,
            }}
          >
            {tool.stepNumber + 1}
          </div>
        )}
      </div>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div
          style={{
            fontFamily: 'var(--font-heading)',
            fontSize: '0.875rem',
            fontWeight: 600,
            color: locked ? 'var(--color-text-muted)' : 'var(--color-text-primary)',
            marginBottom: '0.25rem',
            overflowWrap: 'break-word',
            wordBreak: 'break-word',
          }}
        >
          {tool.shortName}
        </div>
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            flexWrap: 'wrap',
          }}
        >
          <span
            style={{
              display: 'inline-block',
              padding: '1px 8px',
              borderRadius: 9999,
              fontSize: '0.5625rem',
              fontWeight: 600,
              color: catColor.color,
              background: catColor.bg,
              textTransform: 'uppercase',
              letterSpacing: '0.02em',
            }}
          >
            {tool.category}
          </span>
          <span style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
            <Clock size={10} color="var(--color-text-muted)" />
            <span
              style={{
                fontSize: '0.625rem',
                color: 'var(--color-text-muted)',
              }}
            >
              {tool.estimatedTime}
            </span>
          </span>
        </div>
      </div>
      {!locked && (
        <ArrowRight
          size={14}
          color={done ? tool.stageColor : 'var(--color-text-muted)'}
          style={{ flexShrink: 0 }}
        />
      )}
      {locked && (
        <Lock
          size={13}
          color="var(--color-text-muted)"
          style={{ flexShrink: 0 }}
        />
      )}
    </motion.div>
  )

  if (locked) {
    return <div>{inner}</div>
  }

  return (
    <Link href={`/tools/${tool.id}`} style={{ textDecoration: 'none' }}>
      {inner}
    </Link>
  )
}

/* ─── Main dashboard ─── */
export default function ToolsDashboard() {
  const { user } = useAuth()
  const [progress, setProgress] = useState<ProgressMap>({})
  const [activeCategory, setActiveCategory] = useState<ToolCategory | 'Todos'>('Todos')

  useEffect(() => {
    if (user) {
      setProgress(getProgress(user.id))
    }
  }, [user])

  /* ─── Derived state ─── */
  const completedIds = useMemo(
    () => new Set(Object.entries(progress).filter(([, v]) => v.completed).map(([k]) => k)),
    [progress]
  )

  // Determine the user's unlocked stage
  const userStageNum = useMemo(() => {
    // Parse user.stage to a number (1-4), default to 1
    let baseStage = 1
    if (user?.stage) {
      const parsed = parseInt(user.stage, 10)
      if (parsed >= 1 && parsed <= 4) baseStage = parsed
    }

    // Check if completing all tools in a stage unlocks the next one
    let effectiveStage = baseStage
    for (let s = 1 as 1 | 2 | 3 | 4; s <= 4; s++) {
      const stageTools = TOOLS_BY_STAGE[s as 1 | 2 | 3 | 4]
      const allDone = stageTools.every((t) => completedIds.has(t.id))
      if (allDone && s >= effectiveStage) {
        effectiveStage = Math.min(s + 1, 4) as 1 | 2 | 3 | 4
      }
    }

    return Math.max(baseStage, effectiveStage)
  }, [user, completedIds])

  const totalCompleted = completedIds.size
  const total = TOOLS.length
  const pct = Math.round((totalCompleted / total) * 100)

  // Find the first incomplete, unlocked tool
  const nextTool = useMemo(() => {
    return TOOLS.find((t) => !completedIds.has(t.id) && t.stage <= userStageNum)
  }, [completedIds, userStageNum])

  // Filter tools by category
  const filteredToolsByStage = useMemo(() => {
    const result: Record<1 | 2 | 3 | 4, ToolDef[]> = { 1: [], 2: [], 3: [], 4: [] }
    for (const s of [1, 2, 3, 4] as const) {
      result[s] =
        activeCategory === 'Todos'
          ? TOOLS_BY_STAGE[s]
          : TOOLS_BY_STAGE[s].filter((t) => t.category === activeCategory)
    }
    return result
  }, [activeCategory])

  /* ─── Global report generation ─── */
  const generateGlobalReport = useCallback(() => {
    if (!user) return
    generateGlobalReportUtil(user)
  }, [user])

  if (!user) return null

  return (
    <div style={{ padding: '2rem 1.5rem', maxWidth: 960, margin: '0 auto', overflowWrap: 'break-word', wordBreak: 'break-word' }}>
      {/* ─── Navigation tabs ─── */}
      <motion.nav
        initial={{ opacity: 0, y: -8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        style={{
          display: 'flex',
          gap: '0.5rem',
          marginBottom: '2rem',
          background: 'var(--color-bg-card)',
          borderRadius: 12,
          border: '1px solid var(--color-border)',
          padding: '0.75rem 1rem',
          overflowX: 'auto',
          flexWrap: 'nowrap',
          WebkitOverflowScrolling: 'touch',
          scrollbarWidth: 'none',
          msOverflowStyle: 'none',
          paddingBottom: '0.25rem',
        }}
      >
        {NAV_TABS.map((tab) => (
          <Link
            key={tab.href}
            href={tab.href}
            style={{
              padding: '0.625rem 1.25rem',
              borderRadius: 9,
              fontFamily: 'var(--font-body)',
              fontSize: '0.8125rem',
              fontWeight: tab.active ? 600 : 500,
              color: tab.active ? 'white' : 'var(--color-text-secondary)',
              background: tab.active ? '#0D9488' : 'transparent',
              textDecoration: 'none',
              transition: 'all 0.15s ease',
              whiteSpace: 'nowrap',
            }}
          >
            {tab.label}
          </Link>
        ))}
      </motion.nav>

      {/* ─── Header with progress ring ─── */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        style={{ marginBottom: '1.5rem' }}
      >
        <div
          style={{
            display: 'flex',
            alignItems: 'flex-start',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: '1rem',
          }}
        >
          <div>
            <div
              style={{
                fontSize: '0.6875rem',
                fontWeight: 600,
                color: '#0D9488',
                letterSpacing: '0.05em',
                textTransform: 'uppercase',
                marginBottom: '0.375rem',
              }}
            >
              Bienvenido de vuelta
            </div>
            <h1
              style={{
                fontFamily: 'var(--font-heading)',
                fontSize: 'clamp(1.5rem, 3vw, 2rem)',
                fontWeight: 800,
                color: 'var(--color-text-primary)',
                letterSpacing: '-0.025em',
                marginBottom: '0.375rem',
              }}
            >
              {user.name}
            </h1>
            <p
              style={{
                fontFamily: 'var(--font-body)',
                fontSize: '0.9375rem',
                color: 'var(--color-text-secondary)',
              }}
            >
              {user.startup} · Roadmap de impacto
            </p>
          </div>

          {/* Progress ring */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '1.25rem',
              flexWrap: 'wrap',
            }}
          >
            <div
              style={{
                background: 'var(--color-bg-card)',
                borderRadius: 16,
                border: '1px solid var(--color-border)',
                padding: '1.25rem 1.5rem',
                boxShadow: 'var(--shadow-card)',
                display: 'flex',
                alignItems: 'center',
                gap: '1rem',
                minWidth: 200,
              }}
            >
              <div style={{ position: 'relative', width: 56, height: 56, flexShrink: 0 }}>
                <svg width="56" height="56" style={{ transform: 'rotate(-90deg)' }}>
                  <circle cx="28" cy="28" r="23" fill="none" stroke="#F3F4F6" strokeWidth="5" />
                  <circle
                    cx="28"
                    cy="28"
                    r="23"
                    fill="none"
                    stroke="#FF6B4A"
                    strokeWidth="5"
                    strokeLinecap="round"
                    strokeDasharray={`${2 * Math.PI * 23}`}
                    strokeDashoffset={`${2 * Math.PI * 23 * (1 - pct / 100)}`}
                    style={{ transition: 'stroke-dashoffset 0.8s ease' }}
                  />
                </svg>
                <div
                  style={{
                    position: 'absolute',
                    inset: 0,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '0.75rem',
                    fontWeight: 700,
                    color: '#FF6B4A',
                  }}
                >
                  {pct}%
                </div>
              </div>
              <div>
                <div
                  style={{
                    fontSize: '1.25rem',
                    fontWeight: 700,
                    color: 'var(--color-text-primary)',
                    lineHeight: 1,
                  }}
                >
                  {totalCompleted}
                  <span
                    style={{
                      fontFamily: 'var(--font-body)',
                      fontSize: '0.75rem',
                      color: 'var(--color-text-muted)',
                      fontWeight: 400,
                    }}
                  >
                    /{total}
                  </span>
                </div>
                <div
                  style={{
                    fontFamily: 'var(--font-body)',
                    fontSize: '0.75rem',
                    color: 'var(--color-text-secondary)',
                    marginTop: '0.25rem',
                  }}
                >
                  herramientas completadas
                </div>
              </div>
            </div>

            {/* Global report button */}
            {totalCompleted >= 3 && (
              <button
                onClick={generateGlobalReport}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  padding: '0.625rem 1.25rem',
                  borderRadius: 9999,
                  background: '#0D9488',
                  color: 'white',
                  fontFamily: 'var(--font-body)',
                  fontSize: '0.875rem',
                  fontWeight: 600,
                  border: 'none',
                  cursor: 'pointer',
                  boxShadow: '0 2px 10px rgba(13,148,136,0.3)',
                  whiteSpace: 'nowrap',
                }}
              >
                <Download size={15} />
                Reporte Global
              </button>
            )}
          </div>
        </div>
      </motion.div>

      {/* ─── Stage indicator banner ─── */}
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35, delay: 0.05 }}
        style={{ marginBottom: '1.5rem' }}
      >
        <div
          style={{
            background: STAGE_META[userStageNum as 1 | 2 | 3 | 4].bg,
            border: `1px solid ${STAGE_META[userStageNum as 1 | 2 | 3 | 4].border}`,
            borderRadius: 14,
            padding: '0.875rem 1.25rem',
            display: 'flex',
            alignItems: 'center',
            gap: '0.75rem',
          }}
        >
          {(() => {
            const StageIcon = STAGE_ICONS[userStageNum as 1 | 2 | 3 | 4]
            return (
              <div
                style={{
                  width: 36,
                  height: 36,
                  borderRadius: 10,
                  background: `${STAGE_META[userStageNum as 1 | 2 | 3 | 4].color}18`,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0,
                }}
              >
                <StageIcon size={18} color={STAGE_META[userStageNum as 1 | 2 | 3 | 4].color} />
              </div>
            )
          })()}
          <span
            style={{
              fontFamily: 'var(--font-heading)',
              fontSize: '0.9375rem',
              fontWeight: 700,
              color: STAGE_META[userStageNum as 1 | 2 | 3 | 4].color,
            }}
          >
            Tu startup está en la etapa de {STAGE_META[userStageNum as 1 | 2 | 3 | 4].name}
          </span>
        </div>
      </motion.div>

      {/* ─── Continue CTA ─── */}
      <AnimatePresence>
        {nextTool && (
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.4, delay: 0.1 }}
            style={{ marginBottom: '1.5rem' }}
          >
            <div
              style={{
                background: 'linear-gradient(135deg, #F0FDFA, #CCFBF1)',
                borderRadius: 16,
                border: '1px solid rgba(13,148,136,0.18)',
                padding: '1.125rem 1.5rem',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                flexWrap: 'wrap',
                gap: '0.875rem',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.875rem' }}>
                <div
                  style={{
                    width: 40,
                    height: 40,
                    borderRadius: 10,
                    background: 'rgba(13,148,136,0.1)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0,
                  }}
                >
                  <TrendingUp size={18} color="#0D9488" />
                </div>
                <div>
                  <div
                    style={{
                      fontFamily: 'var(--font-body)',
                      fontSize: '0.75rem',
                      color: '#0D9488',
                      fontWeight: 600,
                      marginBottom: '0.125rem',
                    }}
                  >
                    Continua donde lo dejaste
                  </div>
                  <div
                    style={{
                      fontFamily: 'var(--font-heading)',
                      fontSize: '0.9375rem',
                      fontWeight: 700,
                      color: 'var(--color-text-primary)',
                    }}
                  >
                    {nextTool.shortName}
                    <span
                      style={{
                        fontSize: '0.625rem',
                        color: 'var(--color-text-muted)',
                        marginLeft: '0.5rem',
                        fontWeight: 400,
                      }}
                    >
                      {nextTool.stageName}
                    </span>
                  </div>
                </div>
              </div>
              <Link
                href={`/tools/${nextTool.id}`}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.375rem',
                  padding: '0.625rem 1.25rem',
                  borderRadius: 9999,
                  background: '#0D9488',
                  color: 'white',
                  fontFamily: 'var(--font-body)',
                  fontSize: '0.875rem',
                  fontWeight: 600,
                  textDecoration: 'none',
                  boxShadow: '0 2px 10px rgba(13,148,136,0.3)',
                  whiteSpace: 'nowrap',
                }}
              >
                Comenzar
                <ArrowRight size={15} />
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ─── Category filter bar ─── */}
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35, delay: 0.15 }}
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '0.5rem',
          marginBottom: '2rem',
          overflowX: 'auto',
          paddingBottom: '0.25rem',
        }}
      >
        <Filter size={14} color="var(--color-text-muted)" style={{ flexShrink: 0 }} />
        {(['Todos', ...CATEGORIES] as const).map((cat) => {
          const isActive = activeCategory === cat
          return (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat as ToolCategory | 'Todos')}
              style={{
                padding: '0.375rem 0.875rem',
                borderRadius: 9999,
                fontFamily: 'var(--font-body)',
                fontSize: '0.75rem',
                fontWeight: isActive ? 600 : 500,
                color: isActive ? 'white' : 'var(--color-text-secondary)',
                background: isActive ? '#0D9488' : 'var(--color-bg-card)',
                border: `1px solid ${isActive ? '#0D9488' : 'var(--color-border)'}`,
                cursor: 'pointer',
                transition: 'all 0.15s ease',
                whiteSpace: 'nowrap',
                flexShrink: 0,
              }}
            >
              {cat}
            </button>
          )
        })}
      </motion.div>

      {/* ─── Roadmap: vertical journey ─── */}
      <div style={{ position: 'relative' }}>
        {/* Vertical connecting line */}
        <div
          style={{
            position: 'absolute',
            left: 24,
            top: 0,
            bottom: 0,
            width: 2,
            background: 'linear-gradient(to bottom, #FF6B4A, #0D9488, #2A222B, #0D9488)',
            borderRadius: 2,
            opacity: 0.18,
            zIndex: 0,
          }}
        />

        {([1, 2, 3, 4] as const).map((stageNum, si) => {
          const meta = STAGE_META[stageNum]
          const Icon = STAGE_ICONS[stageNum]
          const stageTools = filteredToolsByStage[stageNum]
          const allStageTools = TOOLS_BY_STAGE[stageNum]
          const stageDone = allStageTools.filter((t) => completedIds.has(t.id)).length
          const stageTotal = allStageTools.length
          const isLocked = stageNum > userStageNum
          const isStageComplete = stageDone === stageTotal && stageTotal > 0

          // Don't render the stage section if all tools are filtered out
          if (stageTools.length === 0 && activeCategory !== 'Todos') return null

          return (
            <motion.section
              key={stageNum}
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.45, delay: 0.1 + si * 0.08 }}
              style={{
                position: 'relative',
                marginBottom: si < 3 ? '2.5rem' : 0,
                paddingLeft: 56,
                zIndex: 1,
              }}
            >
              {/* Stage node on the vertical line */}
              <div
                style={{
                  position: 'absolute',
                  left: 8,
                  top: 4,
                  width: 34,
                  height: 34,
                  borderRadius: '50%',
                  background: isLocked ? '#F3F4F6' : meta.bg,
                  border: `2px solid ${isLocked ? 'var(--color-border)' : meta.color}`,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  zIndex: 2,
                }}
              >
                {isLocked ? (
                  <Lock size={14} color="var(--color-text-muted)" />
                ) : (
                  <Icon size={15} color={meta.color} strokeWidth={1.8} />
                )}
              </div>

              {/* Stage header */}
              <div
                style={{
                  background: 'var(--color-bg-card)',
                  borderRadius: 16,
                  border: `1px solid ${isLocked ? 'var(--color-border)' : meta.border}`,
                  borderLeft: `4px solid ${isLocked ? 'var(--color-border)' : meta.color}`,
                  overflow: 'hidden',
                  boxShadow: 'var(--shadow-card)',
                  opacity: isLocked ? 0.6 : 1,
                }}
              >
                {/* Stage top bar */}
                <div
                  style={{
                    padding: '1.25rem 1.5rem 1rem',
                    background: isLocked ? 'rgba(0,0,0,0.02)' : meta.bg,
                    borderBottom: `1px solid ${isLocked ? 'var(--color-border)' : meta.border}`,
                  }}
                >
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      marginBottom: '0.5rem',
                      flexWrap: 'wrap',
                      gap: '0.5rem',
                    }}
                  >
                    <div>
                      <div
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '0.5rem',
                          marginBottom: '0.125rem',
                        }}
                      >
                        <span
                          style={{
                            fontSize: '0.625rem',
                            fontWeight: 700,
                            color: isLocked ? 'var(--color-text-muted)' : meta.color,
                            textTransform: 'uppercase',
                            letterSpacing: '0.05em',
                          }}
                        >
                          Etapa {stageNum}
                        </span>
                        {isLocked && (
                          <span
                            style={{
                              display: 'inline-flex',
                              alignItems: 'center',
                              gap: '0.25rem',
                              padding: '1px 8px',
                              borderRadius: 9999,
                              background: 'rgba(0,0,0,0.05)',
                              fontSize: '0.5625rem',
                              color: 'var(--color-text-muted)',
                            }}
                          >
                            <Lock size={9} />
                            Bloqueada
                          </span>
                        )}
                        {isStageComplete && !isLocked && (
                          <span
                            style={{
                              display: 'inline-flex',
                              alignItems: 'center',
                              gap: '0.25rem',
                              padding: '1px 8px',
                              borderRadius: 9999,
                              background: 'rgba(13,148,136,0.1)',
                              fontSize: '0.5625rem',
                              fontWeight: 600,
                              color: '#0D9488',
                            }}
                          >
                            <CheckCircle2 size={10} />
                            Completada
                          </span>
                        )}
                      </div>
                      <h2
                        style={{
                          fontFamily: 'var(--font-heading)',
                          fontSize: '1.125rem',
                          fontWeight: 700,
                          color: isLocked
                            ? 'var(--color-text-muted)'
                            : 'var(--color-text-primary)',
                          letterSpacing: '-0.01em',
                        }}
                      >
                        {meta.name}
                      </h2>
                      <p
                        style={{
                          fontFamily: 'var(--font-body)',
                          fontSize: '0.8125rem',
                          color: 'var(--color-text-secondary)',
                          marginTop: '0.125rem',
                        }}
                      >
                        {meta.subtitle}
                      </p>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                      <div
                        style={{
                          padding: '0.25rem 0.75rem',
                          borderRadius: 9999,
                          background: 'var(--color-bg-card)',
                          border: `1px solid ${isLocked ? 'var(--color-border)' : meta.border}`,
                          fontSize: '0.6875rem',
                          fontWeight: 700,
                          color: isLocked ? 'var(--color-text-muted)' : meta.color,
                        }}
                      >
                        {stageDone}/{stageTotal}
                      </div>
                    </div>
                  </div>
                  {/* Stage progress bar */}
                  <div
                    style={{
                      height: 3,
                      borderRadius: 2,
                      background: isLocked ? 'var(--color-border)' : 'rgba(255,255,255,0.6)',
                    }}
                  >
                    <div
                      style={{
                        height: '100%',
                        borderRadius: 2,
                        background: isLocked ? 'var(--color-text-muted)' : meta.color,
                        width: `${stageTotal > 0 ? (stageDone / stageTotal) * 100 : 0}%`,
                        transition: 'width 0.6s ease',
                      }}
                    />
                  </div>
                </div>

                {/* Tools grid */}
                <div
                  style={{
                    padding: '1rem',
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fill, minmax(min(280px, 100%), 1fr))',
                    gap: '0.625rem',
                  }}
                >
                  {stageTools.length > 0 ? (
                    stageTools.map((tool, i) => (
                      <ToolCard
                        key={tool.id}
                        tool={tool}
                        done={completedIds.has(tool.id)}
                        locked={isLocked}
                        idx={i}
                      />
                    ))
                  ) : (
                    <div
                      style={{
                        gridColumn: '1 / -1',
                        padding: '1.5rem',
                        textAlign: 'center',
                        fontFamily: 'var(--font-body)',
                        fontSize: '0.8125rem',
                        color: 'var(--color-text-muted)',
                      }}
                    >
                      No hay herramientas en esta categoria para esta etapa.
                    </div>
                  )}
                </div>

                {/* Phase completion advice banner */}
                {isStageComplete && !isLocked && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    transition={{ duration: 0.4 }}
                    style={{
                      borderTop: `1px solid ${meta.border}`,
                    }}
                  >
                    <div
                      style={{
                        padding: '1.25rem 1.5rem',
                        background: `linear-gradient(135deg, ${meta.bg}, rgba(255,255,255,0.5))`,
                        display: 'flex',
                        gap: '0.875rem',
                        alignItems: 'flex-start',
                      }}
                    >
                      <div
                        style={{
                          width: 32,
                          height: 32,
                          borderRadius: 8,
                          background: meta.bg,
                          border: `1px solid ${meta.border}`,
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          flexShrink: 0,
                          marginTop: 2,
                        }}
                      >
                        <Lightbulb size={15} color={meta.color} />
                      </div>
                      <div>
                        <div
                          style={{
                            fontFamily: 'var(--font-heading)',
                            fontSize: '0.8125rem',
                            fontWeight: 700,
                            color: meta.color,
                            marginBottom: '0.375rem',
                          }}
                        >
                          Consejo antes de avanzar
                        </div>
                        <p
                          style={{
                            fontFamily: 'var(--font-body)',
                            fontSize: '0.8125rem',
                            color: 'var(--color-text-secondary)',
                            lineHeight: 1.6,
                            margin: 0,
                          }}
                        >
                          {meta.phaseAdvice}
                        </p>
                      </div>
                    </div>
                  </motion.div>
                )}
              </div>
            </motion.section>
          )
        })}
      </div>
    </div>
  )
}
