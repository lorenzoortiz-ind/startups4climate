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
import { Button, Card } from '@/components/ui'
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
  Estrategia: { color: 'var(--color-accent-primary)', bg: 'rgba(255,107,74,0.08)' },
  Mercado: { color: 'var(--color-accent-secondary)', bg: 'rgba(13,148,136,0.08)' },
  Producto: { color: 'var(--color-accent-secondary)', bg: 'rgba(13,148,136,0.08)' },
  Finanzas: { color: 'var(--color-ink)', bg: 'rgba(25,25,25,0.06)' },
  Ventas: { color: 'var(--color-accent-primary)', bg: 'rgba(255,107,74,0.08)' },
  Marketing: { color: 'var(--color-accent-primary)', bg: 'rgba(255,107,74,0.08)' },
  Equipo: { color: 'var(--color-accent-secondary)', bg: 'rgba(13,148,136,0.08)' },
}

const springReveal = {
  initial: { opacity: 0, y: 24 },
  animate: { opacity: 1, y: 0 },
  transition: { type: 'spring', damping: 20, stiffness: 100 } as const,
}

/* ─── Tool card (redesigned) ─── */
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
  const [hovered, setHovered] = useState(false)

  const inner = (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, delay: idx * 0.04 }}
      onMouseEnter={() => !locked && setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: '0.75rem',
        padding: '1.25rem 1.375rem',
        borderRadius: 'var(--radius-md)',
        background: done ? `linear-gradient(135deg, ${tool.stageBg}, var(--color-paper))` : 'var(--color-paper)',
        border: `1px solid ${done ? tool.stageBorder : 'var(--color-border)'}`,
        borderLeft: `4px solid ${locked ? 'var(--color-border)' : tool.stageColor}`,
        textDecoration: 'none',
        transition: 'transform 0.25s var(--ease-spring), box-shadow 0.25s ease, border-color 0.2s ease',
        position: 'relative' as const,
        overflow: 'hidden',
        opacity: locked ? 0.45 : 1,
        cursor: locked ? 'not-allowed' : 'pointer',
        transform: hovered && !locked ? 'translateY(-4px)' : 'translateY(0)',
        boxShadow: hovered && !locked ? '0 16px 32px -8px rgba(25,25,25,0.1)' : '0 2px 8px rgba(25,25,25,0.04)',
        minHeight: 130,
      }}
    >
      {/* Subtle gradient corner */}
      {!locked && (
        <div style={{
          position: 'absolute',
          top: 0,
          right: 0,
          width: 80,
          height: 80,
          background: `radial-gradient(circle at top right, ${tool.stageBg}, transparent)`,
          pointerEvents: 'none',
        }} />
      )}

      {/* Top row: category badge + completion */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: '0.5rem',
      }}>
        <span
          style={{
            display: 'inline-block',
            padding: '3px 10px',
            borderRadius: 'var(--radius-full)',
            fontFamily: 'var(--font-body)',
            fontSize: 'var(--text-2xs)',
            fontWeight: 700,
            color: catColor.color,
            background: catColor.bg,
            textTransform: 'uppercase',
            letterSpacing: '0.06em',
          }}
        >
          {tool.category}
        </span>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          {done && !locked && (
            <span style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.25rem',
              padding: '2px 8px',
              borderRadius: 'var(--radius-full)',
              background: 'rgba(13,148,136,0.08)',
              fontFamily: 'var(--font-body)',
              fontSize: 'var(--text-2xs)',
              fontWeight: 700,
              color: 'var(--color-accent-secondary)',
            }}>
              <CheckCircle2 size={10} />
              Completada
            </span>
          )}
          {locked && (
            <Lock size={13} color="var(--color-text-muted)" style={{ flexShrink: 0 }} />
          )}
        </div>
      </div>

      {/* Tool name */}
      <div
        style={{
          fontFamily: 'var(--font-heading)',
          fontSize: 'var(--text-base)',
          fontWeight: 700,
          color: locked ? 'var(--color-text-muted)' : 'var(--color-ink)',
          letterSpacing: '-0.02em',
          lineHeight: 1.3,
          overflowWrap: 'break-word',
          wordBreak: 'break-word',
        }}
      >
        {tool.shortName}
      </div>

      {/* Description */}
      <p
        style={{
          fontFamily: 'var(--font-body)',
          fontSize: 'var(--text-sm)',
          lineHeight: 1.5,
          color: 'var(--color-text-secondary)',
          margin: 0,
          flex: 1,
          display: '-webkit-box',
          WebkitLineClamp: 2,
          WebkitBoxOrient: 'vertical' as const,
          overflow: 'hidden',
        }}
      >
        {tool.description}
      </p>

      {/* Bottom row: time + arrow */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginTop: 'auto',
      }}>
        <span style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
          <Clock size={11} color="var(--color-text-muted)" />
          <span
            style={{
              fontFamily: 'var(--font-body)',
              fontSize: 'var(--text-xs)',
              color: 'var(--color-text-muted)',
            }}
          >
            {tool.estimatedTime}
          </span>
        </span>
        {!locked && (
          <ArrowRight
            size={15}
            color={done ? tool.stageColor : 'var(--color-text-muted)'}
            style={{ flexShrink: 0, opacity: hovered ? 1 : 0.5, transition: 'opacity 0.2s' }}
          />
        )}
      </div>
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

  const completedIds = useMemo(
    () => new Set(Object.entries(progress).filter(([, v]) => v.completed).map(([k]) => k)),
    [progress]
  )

  const userStageNum = useMemo(() => {
    let baseStage = 1
    if (user?.stage) {
      const parsed = parseInt(user.stage, 10)
      if (parsed >= 1 && parsed <= 4) baseStage = parsed
    }
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

  const nextTool = useMemo(() => {
    return TOOLS.find((t) => !completedIds.has(t.id) && t.stage <= userStageNum)
  }, [completedIds, userStageNum])

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

  const generateGlobalReport = useCallback(() => {
    if (!user) return
    generateGlobalReportUtil(user)
  }, [user])

  if (!user) return null

  return (
    <div
      style={{
        padding: '2.5rem 2rem',
        maxWidth: 1060,
        margin: '0 auto',
        overflowWrap: 'break-word',
        wordBreak: 'break-word',
      }}
    >
      {/* ─── Navigation tabs ─── */}
      <motion.nav
        {...springReveal}
        style={{
          display: 'flex',
          gap: '0.375rem',
          marginBottom: '2.75rem',
          background: 'var(--color-paper)',
          borderRadius: 'var(--radius-md)',
          border: '1px solid var(--color-border)',
          padding: '0.375rem',
          overflowX: 'auto',
          flexWrap: 'nowrap',
          WebkitOverflowScrolling: 'touch',
          scrollbarWidth: 'none',
          msOverflowStyle: 'none',
          boxShadow: '0 1px 3px rgba(25,25,25,0.04)',
        }}
      >
        {NAV_TABS.map((tab) => (
          <Link
            key={tab.href}
            href={tab.href}
            style={{
              padding: '0.625rem 1.375rem',
              borderRadius: 'var(--radius-sm)',
              fontFamily: 'var(--font-body)',
              fontSize: 'var(--text-base)',
              fontWeight: tab.active ? 700 : 500,
              color: tab.active ? 'var(--color-paper)' : 'var(--color-text-secondary)',
              background: tab.active ? 'var(--color-ink)' : 'transparent',
              textDecoration: 'none',
              transition: 'all 0.15s ease',
              whiteSpace: 'nowrap',
              letterSpacing: tab.active ? '-0.01em' : 'normal',
            }}
          >
            {tab.label}
          </Link>
        ))}
      </motion.nav>

      {/* ─── Hero greeting ─── */}
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ type: 'spring', damping: 20, stiffness: 100, delay: 0.05 }}
        style={{ marginBottom: '2.5rem' }}
      >
        <div
          style={{
            display: 'flex',
            alignItems: 'flex-end',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: '2rem',
          }}
        >
          <div>
            <div
              style={{
                fontFamily: 'var(--font-body)',
                fontSize: 'var(--text-xs)',
                fontWeight: 700,
                color: 'var(--color-accent-primary)',
                letterSpacing: '0.1em',
                textTransform: 'uppercase',
                marginBottom: '0.625rem',
              }}
            >
              Bienvenido de vuelta
            </div>
            <h1
              style={{
                fontFamily: 'var(--font-heading)',
                fontSize: 'clamp(1.5rem, 4vw, 2rem)',
                fontWeight: 700,
                color: 'var(--color-ink)',
                letterSpacing: '-0.02em',
                lineHeight: 1.2,
                marginBottom: '0.5rem',
              }}
            >
              Hola, {user.name?.split(' ')[0] || user.name}
            </h1>
            <p
              style={{
                fontFamily: 'var(--font-body)',
                fontSize: 'var(--text-base)',
                color: 'var(--color-text-secondary)',
                lineHeight: 1.5,
              }}
            >
              {user.startup || 'Tu startup'} · Roadmap de impacto
            </p>
          </div>

          {/* Progress stats */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', flexWrap: 'wrap' }}>
            {/* Progress ring card */}
            <Card
              variant="elevated"
              padding="none"
              style={{
                padding: '1.25rem 1.5rem',
                display: 'flex',
                alignItems: 'center',
                gap: '1rem',
                minWidth: 200,
              }}
            >
              <div style={{ position: 'relative', width: 60, height: 60, flexShrink: 0 }}>
                <svg width="60" height="60" style={{ transform: 'rotate(-90deg)' }}>
                  <circle cx="30" cy="30" r="25" fill="none" stroke="var(--color-border)" strokeWidth="5" />
                  <circle
                    cx="30"
                    cy="30"
                    r="25"
                    fill="none"
                    stroke="var(--color-accent-secondary)"
                    strokeWidth="5"
                    strokeLinecap="round"
                    strokeDasharray={`${2 * Math.PI * 25}`}
                    strokeDashoffset={`${2 * Math.PI * 25 * (1 - pct / 100)}`}
                    style={{ transition: 'stroke-dashoffset 1s ease' }}
                  />
                </svg>
                <div
                  style={{
                    position: 'absolute',
                    inset: 0,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontFamily: 'var(--font-heading)',
                    fontSize: 'var(--text-base)',
                    fontWeight: 700,
                    color: 'var(--color-accent-secondary)',
                    letterSpacing: '-0.02em',
                  }}
                >
                  {pct}%
                </div>
              </div>
              <div>
                <div
                  style={{
                    fontFamily: 'var(--font-heading)',
                    fontSize: 'var(--text-xl)',
                    fontWeight: 700,
                    color: 'var(--color-ink)',
                    letterSpacing: '-0.03em',
                    lineHeight: 1,
                  }}
                >
                  {totalCompleted}
                  <span
                    style={{
                      fontSize: 'var(--text-sm)',
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
                    fontSize: 'var(--text-sm)',
                    color: 'var(--color-text-secondary)',
                    marginTop: '0.25rem',
                  }}
                >
                  herramientas completadas
                </div>
              </div>
            </Card>

            {/* Global report button */}
            {totalCompleted >= 3 && (
              <Button
                variant="success"
                size="lg"
                icon={<Download size={15} />}
                onClick={generateGlobalReport}
                style={{
                  borderRadius: 'var(--radius-full)',
                }}
              >
                Reporte Global
              </Button>
            )}
          </div>
        </div>
      </motion.div>

      {/* ─── Stage indicator banner ─── */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ type: 'spring', damping: 20, stiffness: 100, delay: 0.1 }}
        style={{ marginBottom: '2rem' }}
      >
        <Card
          variant="flat"
          accent={STAGE_META[userStageNum as 1 | 2 | 3 | 4].color}
          padding="none"
          style={{
            background: STAGE_META[userStageNum as 1 | 2 | 3 | 4].bg,
            border: `1px solid ${STAGE_META[userStageNum as 1 | 2 | 3 | 4].border}`,
            padding: '1.25rem 1.75rem',
            display: 'flex',
            alignItems: 'center',
            gap: '1rem',
          }}
        >
          {(() => {
            const StageIcon = STAGE_ICONS[userStageNum as 1 | 2 | 3 | 4]
            return (
              <div
                style={{
                  width: 40,
                  height: 40,
                  borderRadius: 'var(--radius-sm)',
                  background: `${STAGE_META[userStageNum as 1 | 2 | 3 | 4].color}18`,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0,
                }}
              >
                <StageIcon size={20} color={STAGE_META[userStageNum as 1 | 2 | 3 | 4].color} />
              </div>
            )
          })()}
          <div>
            <div
              style={{
                fontFamily: 'var(--font-body)',
                fontSize: 'var(--text-xs)',
                fontWeight: 700,
                color: STAGE_META[userStageNum as 1 | 2 | 3 | 4].color,
                textTransform: 'uppercase',
                letterSpacing: '0.06em',
                marginBottom: '0.125rem',
              }}
            >
              Tu etapa actual
            </div>
            <span
              style={{
                fontFamily: 'var(--font-heading)',
                fontSize: 'var(--text-lg)',
                fontWeight: 700,
                color: STAGE_META[userStageNum as 1 | 2 | 3 | 4].color,
                letterSpacing: '-0.02em',
              }}
            >
              {STAGE_META[userStageNum as 1 | 2 | 3 | 4].name}
            </span>
          </div>
        </Card>
      </motion.div>

      {/* ─── Continue CTA ─── */}
      <AnimatePresence>
        {nextTool && (
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ type: 'spring', damping: 20, stiffness: 100, delay: 0.15 }}
            style={{ marginBottom: '2.5rem' }}
          >
            <Card
              variant="elevated"
              accent="var(--color-accent-secondary)"
              padding="none"
              style={{
                padding: '1.5rem 1.75rem',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                flexWrap: 'wrap',
                gap: '1.25rem',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '1.125rem' }}>
                <div
                  style={{
                    width: 48,
                    height: 48,
                    borderRadius: 'var(--radius-sm)',
                    background: 'rgba(13,148,136,0.08)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0,
                  }}
                >
                  <TrendingUp size={20} color="var(--color-accent-secondary)" />
                </div>
                <div>
                  <div
                    style={{
                      fontFamily: 'var(--font-body)',
                      fontSize: 'var(--text-xs)',
                      fontWeight: 700,
                      color: 'var(--color-accent-secondary)',
                      textTransform: 'uppercase',
                      letterSpacing: '0.08em',
                      marginBottom: '0.375rem',
                    }}
                  >
                    Continua donde lo dejaste
                  </div>
                  <div
                    style={{
                      fontFamily: 'var(--font-heading)',
                      fontSize: 'var(--text-lg)',
                      fontWeight: 700,
                      color: 'var(--color-ink)',
                      letterSpacing: '-0.02em',
                      lineHeight: 1.3,
                    }}
                  >
                    {nextTool.shortName}
                    <span
                      style={{
                        fontFamily: 'var(--font-body)',
                        fontSize: 'var(--text-sm)',
                        color: 'var(--color-text-muted)',
                        marginLeft: '0.75rem',
                        fontWeight: 400,
                        letterSpacing: 'normal',
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
                  gap: '0.625rem',
                  padding: '0.875rem 2rem',
                  borderRadius: 'var(--radius-full)',
                  background: 'var(--color-ink)',
                  color: 'var(--color-paper)',
                  fontFamily: 'var(--font-body)',
                  fontSize: 'var(--text-base)',
                  fontWeight: 700,
                  textDecoration: 'none',
                  letterSpacing: '-0.01em',
                  whiteSpace: 'nowrap',
                  transition: 'transform 0.2s ease, box-shadow 0.2s ease',
                }}
              >
                Comenzar
                <ArrowRight size={17} />
              </Link>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ─── Category filter bar ─── */}
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ type: 'spring', damping: 20, stiffness: 100, delay: 0.18 }}
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
                padding: '0.4375rem 1rem',
                borderRadius: 'var(--radius-full)',
                fontFamily: 'var(--font-body)',
                fontSize: 'var(--text-sm)',
                fontWeight: isActive ? 700 : 500,
                color: isActive ? 'var(--color-paper)' : 'var(--color-text-secondary)',
                background: isActive ? 'var(--color-ink)' : 'var(--color-paper)',
                border: `1px solid ${isActive ? 'var(--color-ink)' : 'var(--color-border)'}`,
                cursor: 'pointer',
                transition: 'all 0.15s ease',
                whiteSpace: 'nowrap',
                flexShrink: 0,
                letterSpacing: isActive ? '-0.01em' : 'normal',
              }}
            >
              {cat}
            </button>
          )
        })}
      </motion.div>

      {/* ─── Roadmap: stage sections with 3-col grid ─── */}
      {([1, 2, 3, 4] as const).map((stageNum, si) => {
        const meta = STAGE_META[stageNum]
        const Icon = STAGE_ICONS[stageNum]
        const stageTools = filteredToolsByStage[stageNum]
        const allStageTools = TOOLS_BY_STAGE[stageNum]
        const stageDone = allStageTools.filter((t) => completedIds.has(t.id)).length
        const stageTotal = allStageTools.length
        const isLocked = stageNum > userStageNum
        const isStageComplete = stageDone === stageTotal && stageTotal > 0

        if (stageTools.length === 0 && activeCategory !== 'Todos') return null

        return (
          <motion.section
            key={stageNum}
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ type: 'spring', damping: 20, stiffness: 100, delay: 0.1 + si * 0.08 }}
            style={{
              marginBottom: si < 3 ? '2.5rem' : 0,
            }}
          >
            {/* Stage header card */}
            <div
              style={{
                background: isLocked ? 'rgba(0,0,0,0.015)' : meta.bg,
                borderRadius: 'var(--radius-lg) var(--radius-lg) 0 0',
                border: `1px solid ${isLocked ? 'var(--color-border)' : meta.border}`,
                borderLeft: `4px solid ${isLocked ? 'var(--color-border)' : meta.color}`,
                borderBottom: 'none',
                padding: '1.5rem 1.75rem 1.25rem',
                opacity: isLocked ? 0.55 : 1,
                transition: 'opacity 0.3s ease',
              }}
            >
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  flexWrap: 'wrap',
                  gap: '0.75rem',
                  marginBottom: '0.75rem',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                  <div
                    style={{
                      width: 42,
                      height: 42,
                      borderRadius: 'var(--radius-sm)',
                      background: isLocked ? 'var(--color-bg-primary)' : `${meta.color}18`,
                      border: `1.5px solid ${isLocked ? 'var(--color-border)' : meta.color}`,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      flexShrink: 0,
                    }}
                  >
                    {isLocked ? (
                      <Lock size={16} color="var(--color-text-muted)" />
                    ) : (
                      <Icon size={18} color={meta.color} strokeWidth={1.8} />
                    )}
                  </div>
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.25rem' }}>
                      <span
                        style={{
                          fontFamily: 'var(--font-body)',
                          fontSize: 'var(--text-xs)',
                          fontWeight: 700,
                          color: isLocked ? 'var(--color-text-muted)' : meta.color,
                          textTransform: 'uppercase',
                          letterSpacing: '0.08em',
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
                            padding: '2px 8px',
                            borderRadius: 'var(--radius-xs)',
                            background: 'rgba(0,0,0,0.05)',
                            fontFamily: 'var(--font-body)',
                            fontSize: 'var(--text-2xs)',
                            color: 'var(--color-text-muted)',
                            fontWeight: 600,
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
                            padding: '2px 8px',
                            borderRadius: 'var(--radius-xs)',
                            background: 'rgba(13,148,136,0.08)',
                            fontFamily: 'var(--font-body)',
                            fontSize: 'var(--text-2xs)',
                            fontWeight: 700,
                            color: 'var(--color-accent-secondary)',
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
                        fontSize: 'var(--text-lg)',
                        fontWeight: 700,
                        color: isLocked ? 'var(--color-text-muted)' : 'var(--color-ink)',
                        letterSpacing: '-0.02em',
                        margin: 0,
                      }}
                    >
                      {meta.name}
                    </h2>
                  </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                  <span
                    style={{
                      fontFamily: 'var(--font-body)',
                      fontSize: 'var(--text-xs)',
                      color: 'var(--color-text-secondary)',
                      fontStyle: 'italic',
                    }}
                  >
                    {meta.subtitle}
                  </span>
                  <div
                    style={{
                      padding: '0.25rem 0.875rem',
                      borderRadius: 'var(--radius-full)',
                      background: 'var(--color-paper)',
                      border: `1px solid ${isLocked ? 'var(--color-border)' : meta.border}`,
                      fontFamily: 'var(--font-heading)',
                      fontSize: 'var(--text-sm)',
                      fontWeight: 700,
                      color: isLocked ? 'var(--color-text-muted)' : meta.color,
                      letterSpacing: '-0.02em',
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
                  background: isLocked ? 'var(--color-border)' : 'rgba(255,255,255,0.5)',
                }}
              >
                <div
                  style={{
                    height: '100%',
                    borderRadius: 2,
                    background: isLocked ? 'var(--color-text-muted)' : meta.color,
                    width: `${stageTotal > 0 ? (stageDone / stageTotal) * 100 : 0}%`,
                    transition: 'width 0.8s ease',
                  }}
                />
              </div>
            </div>

            {/* Tools grid - 3 columns */}
            <div
              style={{
                background: 'var(--color-paper)',
                borderRadius: '0 0 var(--radius-lg) var(--radius-lg)',
                border: `1px solid ${isLocked ? 'var(--color-border)' : meta.border}`,
                borderLeft: `4px solid ${isLocked ? 'var(--color-border)' : meta.color}`,
                borderTop: 'none',
                padding: '1.25rem',
                opacity: isLocked ? 0.55 : 1,
                boxShadow: isLocked ? 'none' : 'var(--shadow-float)',
              }}
            >
              <div
                className="tools-dash-grid"
                style={{
                  display: 'grid',
                  gap: '0.875rem',
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
                      fontSize: 'var(--text-sm)',
                      color: 'var(--color-text-muted)',
                    }}
                  >
                    No hay herramientas en esta categoría para esta etapa.
                  </div>
                )}
              </div>
            </div>

            {/* Phase completion advice banner */}
            {isStageComplete && !isLocked && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                transition={{ duration: 0.4 }}
                style={{
                  marginTop: '0.75rem',
                  borderRadius: 'var(--radius-md)',
                  overflow: 'hidden',
                }}
              >
                <Card
                  variant="flat"
                  accent={meta.color}
                  padding="none"
                  style={{
                    padding: '1.25rem 1.5rem',
                    background: `linear-gradient(135deg, ${meta.bg}, rgba(255,255,255,0.5))`,
                    border: `1px solid ${meta.border}`,
                    display: 'flex',
                    gap: '1rem',
                    alignItems: 'flex-start',
                  }}
                >
                  <div
                    style={{
                      width: 36,
                      height: 36,
                      borderRadius: 'var(--radius-sm)',
                      background: meta.bg,
                      border: `1px solid ${meta.border}`,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      flexShrink: 0,
                      marginTop: 2,
                    }}
                  >
                    <Lightbulb size={16} color={meta.color} />
                  </div>
                  <div>
                    <div
                      style={{
                        fontFamily: 'var(--font-body)',
                        fontSize: 'var(--text-sm)',
                        fontWeight: 700,
                        color: meta.color,
                        marginBottom: '0.375rem',
                        textTransform: 'uppercase',
                        letterSpacing: '0.04em',
                      }}
                    >
                      Consejo antes de avanzar
                    </div>
                    <p
                      style={{
                        fontFamily: 'var(--font-body)',
                        fontSize: 'var(--text-sm)',
                        color: 'var(--color-text-secondary)',
                        lineHeight: 1.6,
                        margin: 0,
                      }}
                    >
                      {meta.phaseAdvice}
                    </p>
                  </div>
                </Card>
              </motion.div>
            )}
          </motion.section>
        )
      })}

      <style>{`
        .tools-dash-grid {
          grid-template-columns: repeat(3, 1fr);
        }
        @media (max-width: 900px) {
          .tools-dash-grid {
            grid-template-columns: repeat(2, 1fr);
          }
        }
        @media (max-width: 600px) {
          .tools-dash-grid {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </div>
  )
}
