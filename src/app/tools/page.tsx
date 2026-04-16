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
  X,
  Layers,
  Award,
  FileText,
  Target,
  Sparkles,
} from 'lucide-react'
import { useAuth } from '@/context/AuthContext'
import {
  Button,
  Card,
  ProgressRing,
  MetricCard,
  SectionHeader,
  InsightBox,
  Chip,
} from '@/components/ui'
import {
  TOOLS,
  TOOLS_BY_STAGE,
  STAGE_META,
  CATEGORIES,
  type ToolDef,
  type ToolCategory,
} from '@/lib/tools-data'
import { getProgress, hydrateProgressFromSupabase, type ProgressMap } from '@/lib/progress'
import { generateGlobalReport as generateGlobalReportUtil } from '@/lib/global-report'

/* ─── Stage icon mapping ─── */
const STAGE_ICONS = {
  1: FlaskConical,
  2: Rocket,
  3: Building2,
  4: TrendingUp,
} as const

/* ─── Category color mapping (kept for ToolCard) ─── */
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

/* ─── Tool card (unchanged from original) ─── */
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
  const { user, isDemo } = useAuth()
  const [progress, setProgress] = useState<ProgressMap>({})
  const [activeCategory, setActiveCategory] = useState<ToolCategory | 'Todos'>('Todos')
  const [demoBannerDismissed, setDemoBannerDismissed] = useState(false)

  useEffect(() => {
    if (user) {
      setProgress(getProgress(user.id))
      if (isDemo) return
      hydrateProgressFromSupabase(user.id).then((changed) => {
        if (changed) {
          setProgress(getProgress(user.id))
        }
      })
    }
  }, [user, isDemo])

  const completedIds = useMemo(
    () => new Set(Object.entries(progress).filter(([, v]) => v.completed).map(([k]) => k)),
    [progress]
  )

  const reportsGeneratedCount = useMemo(
    () => Object.values(progress).filter((v) => v.reportGenerated).length,
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

  const firstName = user.name?.split(' ')[0] || user.name
  const startupName = user.startup || 'Tu startup'
  const currentStageMeta = STAGE_META[userStageNum as 1 | 2 | 3 | 4]
  const CurrentStageIcon = STAGE_ICONS[userStageNum as 1 | 2 | 3 | 4]
  const diagnosticScore = user.diagnosticScore ?? null

  return (
    <div
      style={{
        padding: '2.5rem 2rem 4rem',
        maxWidth: 1200,
        margin: '0 auto',
        overflowWrap: 'break-word',
        wordBreak: 'break-word',
        overflow: 'hidden',
      }}
    >
      {/* ─── Demo banner ─── */}
      <AnimatePresence>
        {isDemo && !demoBannerDismissed && (
          <motion.div
            initial={{ opacity: 0, y: -8, height: 0 }}
            animate={{ opacity: 1, y: 0, height: 'auto' }}
            exit={{ opacity: 0, y: -8, height: 0 }}
            transition={{ duration: 0.3 }}
            style={{ marginBottom: '1.5rem', position: 'relative' }}
          >
            <InsightBox variant="warning" title="Estás viendo S4C en modo demo" icon={Sparkles}>
              Los datos mostrados son de ejemplo para explorar la plataforma. Inicia sesión con tu cuenta
              real para guardar tu progreso.
            </InsightBox>
            <button
              type="button"
              onClick={() => setDemoBannerDismissed(true)}
              aria-label="Cerrar banner demo"
              style={{
                position: 'absolute',
                top: 10,
                right: 10,
                background: 'transparent',
                border: 'none',
                padding: 4,
                cursor: 'pointer',
                color: 'var(--color-text-muted)',
                borderRadius: 'var(--radius-full)',
                display: 'inline-flex',
                alignItems: 'center',
              }}
            >
              <X size={16} />
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ─── Hero section ─── */}
      <motion.section
        {...springReveal}
        transition={{ type: 'spring', damping: 20, stiffness: 100, delay: 0.05 }}
        style={{ marginBottom: '2rem' }}
      >
        <Card
          variant="elevated"
          padding="none"
          style={{
            padding: 'clamp(1.5rem, 3vw, 2.5rem)',
            background:
              'linear-gradient(135deg, var(--color-paper) 0%, var(--color-cream) 100%)',
            border: '1px solid var(--color-border)',
            position: 'relative',
            overflow: 'hidden',
          }}
        >
          {/* Decorative corner accent */}
          <div
            aria-hidden
            style={{
              position: 'absolute',
              top: -60,
              right: -60,
              width: 240,
              height: 240,
              background:
                'radial-gradient(circle, rgba(255,107,74,0.12), transparent 70%)',
              pointerEvents: 'none',
            }}
          />

          <div
            className="hero-grid"
            style={{
              display: 'grid',
              gridTemplateColumns: 'minmax(0, 1fr) auto',
              gap: 'clamp(1.5rem, 4vw, 3rem)',
              alignItems: 'center',
              position: 'relative',
            }}
          >
            {/* Left: greeting + identity */}
            <div style={{ minWidth: 0 }}>
              <div
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  fontFamily: 'var(--font-body)',
                  fontSize: 'var(--text-2xs)',
                  fontWeight: 700,
                  color: 'var(--color-accent-primary)',
                  letterSpacing: '0.12em',
                  textTransform: 'uppercase',
                  marginBottom: '0.875rem',
                }}
              >
                <span
                  style={{
                    width: 6,
                    height: 6,
                    borderRadius: '50%',
                    background: 'var(--color-accent-primary)',
                  }}
                />
                Founder Dashboard
              </div>

              <h1
                style={{
                  fontFamily: 'var(--font-heading)',
                  fontSize: 'clamp(1.75rem, 4vw, 2.5rem)',
                  fontWeight: 700,
                  color: 'var(--color-ink)',
                  letterSpacing: '-0.035em',
                  lineHeight: 1.1,
                  marginBottom: '0.625rem',
                  overflowWrap: 'break-word',
                  wordBreak: 'break-word',
                  minWidth: 0,
                }}
              >
                Bienvenida, {firstName}
                <span
                  style={{
                    color: 'var(--color-text-muted)',
                    fontWeight: 400,
                    margin: '0 0.5rem',
                  }}
                >
                  ·
                </span>
                <span style={{ color: 'var(--color-accent-primary)' }}>{startupName}</span>
              </h1>

              <p
                style={{
                  fontFamily: 'var(--font-body)',
                  fontSize: 'var(--text-md)',
                  color: 'var(--color-text-secondary)',
                  lineHeight: 1.55,
                  maxWidth: '52ch',
                  marginBottom: '1.5rem',
                }}
              >
                Tu roadmap de impacto en {currentStageMeta.name.toLowerCase()}. Cada herramienta que
                completas fortalece tu startup y desbloquea la siguiente fase.
              </p>

              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flexWrap: 'wrap' }}>
                <Chip
                  variant={
                    userStageNum === 1
                      ? 'stage-1'
                      : userStageNum === 2
                      ? 'stage-2'
                      : userStageNum === 3
                      ? 'stage-3'
                      : 'stage-4'
                  }
                  icon={CurrentStageIcon}
                  size="md"
                >
                  Etapa {userStageNum}: {currentStageMeta.name}
                </Chip>
                {diagnosticScore !== null && (
                  <Chip variant="info" icon={Award} size="md">
                    Diagnóstico {diagnosticScore}/100
                  </Chip>
                )}
              </div>
            </div>

            {/* Right: ProgressRing */}
            <div
              className="hero-ring"
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: '0.5rem',
                flexShrink: 0,
              }}
            >
              <ProgressRing
                value={pct}
                size={156}
                strokeWidth={12}
                color="var(--color-accent-primary)"
                trackColor="var(--color-border)"
                showPercentage
              />
              <div
                style={{
                  fontFamily: 'var(--font-body)',
                  fontSize: 'var(--text-xs)',
                  color: 'var(--color-text-secondary)',
                  textTransform: 'uppercase',
                  letterSpacing: '0.1em',
                  fontWeight: 600,
                  textAlign: 'center',
                }}
              >
                {totalCompleted} de {total} completadas
              </div>
            </div>
          </div>
        </Card>
      </motion.section>

      {/* ─── StatGrid of MetricCards ─── */}
      <motion.section
        {...springReveal}
        transition={{ type: 'spring', damping: 20, stiffness: 100, delay: 0.1 }}
        style={{ marginBottom: '2rem' }}
      >
        <div
          className="metrics-grid"
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(4, minmax(0, 1fr))',
            gap: '1rem',
          }}
        >
          <MetricCard
            label="Herramientas"
            value={totalCompleted}
            unit={`/ ${total}`}
            icon={Layers}
            accent="primary"
            size="md"
            description="Completadas"
          />
          <MetricCard
            label="Etapa actual"
            value={`E${userStageNum}`}
            icon={CurrentStageIcon}
            accent={
              userStageNum === 2 ? 'success' : userStageNum === 3 ? 'warning' : userStageNum === 4 ? 'info' : 'primary'
            }
            size="md"
            description={currentStageMeta.name}
          />
          <MetricCard
            label="Diagnóstico"
            value={diagnosticScore ?? '—'}
            unit={diagnosticScore !== null ? '/100' : undefined}
            icon={Award}
            accent="info"
            size="md"
            description={diagnosticScore !== null ? 'Readiness score' : 'Sin diagnóstico'}
          />
          <MetricCard
            label="Reportes"
            value={reportsGeneratedCount}
            icon={FileText}
            accent="neutral"
            size="md"
            description="Generados"
          />
        </div>
      </motion.section>

      {/* ─── Passport + Continue row ─── */}
      <motion.section
        {...springReveal}
        transition={{ type: 'spring', damping: 20, stiffness: 100, delay: 0.15 }}
        style={{ marginBottom: '2.5rem' }}
      >
        <div
          className="passport-grid"
          style={{
            display: 'grid',
            gridTemplateColumns: nextTool ? '1.1fr 1fr' : '1fr',
            gap: '1rem',
          }}
        >
          {/* Passport card */}
          <Card
            variant="default"
            accent="var(--color-ink)"
            padding="none"
            style={{
              padding: '1.5rem 1.75rem',
              background: 'var(--color-paper)',
              border: '1px solid var(--color-border)',
              display: 'flex',
              flexDirection: 'column',
              gap: '1rem',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'flex-start', gap: '1rem' }}>
              <div
                style={{
                  width: 44,
                  height: 44,
                  borderRadius: 'var(--radius-sm)',
                  background: 'var(--color-ink)',
                  color: 'var(--color-paper)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0,
                }}
              >
                <Target size={20} strokeWidth={2} />
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div
                  style={{
                    fontFamily: 'var(--font-body)',
                    fontSize: 'var(--text-2xs)',
                    fontWeight: 700,
                    color: 'var(--color-accent-primary)',
                    textTransform: 'uppercase',
                    letterSpacing: '0.1em',
                    marginBottom: '0.25rem',
                  }}
                >
                  Tu Passport
                </div>
                <div
                  style={{
                    fontFamily: 'var(--font-heading)',
                    fontSize: 'var(--text-lg)',
                    fontWeight: 700,
                    color: 'var(--color-ink)',
                    letterSpacing: '-0.02em',
                    lineHeight: 1.25,
                    marginBottom: '0.375rem',
                  }}
                >
                  {startupName}
                </div>
                <p
                  style={{
                    fontFamily: 'var(--font-body)',
                    fontSize: 'var(--text-sm)',
                    color: 'var(--color-text-secondary)',
                    lineHeight: 1.5,
                    margin: 0,
                  }}
                >
                  Tu perfil consolidado con diagnóstico, herramientas completadas y score de impacto.
                  {totalCompleted >= 3
                    ? ' Genera un reporte ejecutivo listo para compartir con inversores.'
                    : ' Completa 3 herramientas para desbloquear el reporte global.'}
                </p>
              </div>
            </div>

            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.625rem',
                flexWrap: 'wrap',
                paddingTop: '0.75rem',
                borderTop: '1px solid var(--color-border)',
              }}
            >
              <Link href="/tools/passport" style={{ textDecoration: 'none' }}>
                <Button variant="secondary" size="sm" icon={<ArrowRight size={14} />}>
                  Ver Passport
                </Button>
              </Link>
              <Button
                variant={totalCompleted >= 3 ? 'success' : 'secondary'}
                size="sm"
                icon={<Download size={14} />}
                onClick={generateGlobalReport}
                disabled={totalCompleted < 3}
              >
                Generar reporte global
              </Button>
            </div>
          </Card>

          {/* Continue CTA */}
          {nextTool && (
            <Card
              variant="elevated"
              accent="var(--color-accent-primary)"
              padding="none"
              style={{
                padding: '1.5rem 1.75rem',
                background:
                  'linear-gradient(135deg, rgba(255,107,74,0.06), var(--color-paper))',
                border: '1px solid rgba(255,107,74,0.2)',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                gap: '1rem',
              }}
            >
              <div>
                <div
                  style={{
                    fontFamily: 'var(--font-body)',
                    fontSize: 'var(--text-2xs)',
                    fontWeight: 700,
                    color: 'var(--color-accent-primary)',
                    textTransform: 'uppercase',
                    letterSpacing: '0.1em',
                    marginBottom: '0.5rem',
                  }}
                >
                  Continúa donde lo dejaste
                </div>
                <div
                  style={{
                    fontFamily: 'var(--font-heading)',
                    fontSize: 'var(--text-lg)',
                    fontWeight: 700,
                    color: 'var(--color-ink)',
                    letterSpacing: '-0.02em',
                    lineHeight: 1.25,
                    marginBottom: '0.375rem',
                  }}
                >
                  {nextTool.shortName}
                </div>
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.625rem',
                    flexWrap: 'wrap',
                  }}
                >
                  <Chip variant="default" size="xs" icon={Clock}>
                    {nextTool.estimatedTime}
                  </Chip>
                  <Chip variant="default" size="xs">
                    {nextTool.stageName}
                  </Chip>
                </div>
              </div>

              <Link href={`/tools/${nextTool.id}`} style={{ textDecoration: 'none' }}>
                <Button variant="primary" size="md" icon={<ArrowRight size={16} />}>
                  Comenzar herramienta
                </Button>
              </Link>
            </Card>
          )}
        </div>
      </motion.section>

      {/* ─── Category filter ─── */}
      <motion.div
        {...springReveal}
        transition={{ type: 'spring', damping: 20, stiffness: 100, delay: 0.18 }}
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '0.5rem',
          marginBottom: '1.75rem',
          overflowX: 'auto',
          paddingBottom: '0.25rem',
        }}
      >
        <Filter size={14} color="var(--color-text-muted)" style={{ flexShrink: 0 }} />
        {(['Todos', ...CATEGORIES] as const).map((cat) => {
          const isActive = activeCategory === cat
          return (
            <Chip
              key={cat}
              variant={isActive ? 'primary' : 'default'}
              size="sm"
              onClick={() => setActiveCategory(cat as ToolCategory | 'Todos')}
            >
              {cat}
            </Chip>
          )
        })}
      </motion.div>

      {/* ─── Stage sections ─── */}
      {([1, 2, 3, 4] as const).map((stageNum, si) => {
        const meta = STAGE_META[stageNum]
        const Icon = STAGE_ICONS[stageNum]
        const stageTools = filteredToolsByStage[stageNum]
        const allStageTools = TOOLS_BY_STAGE[stageNum]
        const stageDone = allStageTools.filter((t) => completedIds.has(t.id)).length
        const stageTotal = allStageTools.length
        const stagePct = stageTotal > 0 ? Math.round((stageDone / stageTotal) * 100) : 0
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
            {/* SectionHeader */}
            <div style={{ marginBottom: '1rem' }}>
              <SectionHeader
                kicker={`Etapa ${stageNum} · ${meta.subtitle}`}
                title={meta.name}
                description={meta.description}
                action={
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.75rem',
                      flexWrap: 'wrap',
                      justifyContent: 'flex-end',
                    }}
                  >
                    {isLocked ? (
                      <Chip variant="default" size="sm" icon={Lock}>
                        Bloqueada
                      </Chip>
                    ) : isStageComplete ? (
                      <Chip variant="success" size="sm" icon={CheckCircle2}>
                        Completada
                      </Chip>
                    ) : null}
                    <div
                      style={{
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'flex-end',
                        gap: '0.375rem',
                        minWidth: 160,
                      }}
                    >
                      <div
                        style={{
                          display: 'flex',
                          alignItems: 'baseline',
                          gap: '0.375rem',
                        }}
                      >
                        <span
                          style={{
                            fontFamily: 'var(--font-display)',
                            fontSize: 'var(--text-xl)',
                            fontWeight: 700,
                            color: isLocked ? 'var(--color-text-muted)' : meta.color,
                            letterSpacing: '-0.02em',
                            lineHeight: 1,
                          }}
                        >
                          {stageDone}
                          <span
                            style={{
                              fontSize: 'var(--text-sm)',
                              color: 'var(--color-text-muted)',
                              fontWeight: 400,
                            }}
                          >
                            /{stageTotal}
                          </span>
                        </span>
                        <span
                          style={{
                            fontFamily: 'var(--font-body)',
                            fontSize: 'var(--text-xs)',
                            color: 'var(--color-text-muted)',
                            textTransform: 'uppercase',
                            letterSpacing: '0.08em',
                            fontWeight: 600,
                          }}
                        >
                          completadas
                        </span>
                      </div>
                      <div
                        style={{
                          width: 160,
                          height: 4,
                          borderRadius: 'var(--radius-full)',
                          background: 'var(--color-border)',
                          overflow: 'hidden',
                        }}
                      >
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ width: `${stagePct}%` }}
                          transition={{ duration: 0.7, ease: [0.25, 1, 0.5, 1] }}
                          style={{
                            height: '100%',
                            background: isLocked ? 'var(--color-text-muted)' : meta.color,
                            borderRadius: 'var(--radius-full)',
                          }}
                        />
                      </div>
                    </div>
                  </div>
                }
              />
            </div>

            {/* Stage icon strip — visual anchor */}
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.75rem',
                marginBottom: '1rem',
                paddingLeft: '0.25rem',
              }}
            >
              <div
                style={{
                  width: 32,
                  height: 32,
                  borderRadius: 'var(--radius-sm)',
                  background: isLocked ? 'var(--color-cream)' : `${meta.color}15`,
                  border: `1px solid ${isLocked ? 'var(--color-border)' : `${meta.color}40`}`,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0,
                }}
              >
                {isLocked ? (
                  <Lock size={14} color="var(--color-text-muted)" />
                ) : (
                  <Icon size={16} color={meta.color} strokeWidth={2} />
                )}
              </div>
              <div
                style={{
                  flex: 1,
                  height: 1,
                  background:
                    'linear-gradient(to right, var(--color-border), transparent)',
                }}
              />
            </div>

            {/* Tools grid */}
            <div
              style={{
                opacity: isLocked ? 0.5 : 1,
                transition: 'opacity 0.3s ease',
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

            {/* Phase completion advice */}
            {isStageComplete && !isLocked && (
              <motion.div
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4 }}
                style={{ marginTop: '1rem' }}
              >
                <InsightBox variant="tip" title="Consejo antes de avanzar" icon={Lightbulb}>
                  {meta.phaseAdvice}
                </InsightBox>
              </motion.div>
            )}
          </motion.section>
        )
      })}

      <style>{`
        .tools-dash-grid {
          grid-template-columns: repeat(3, 1fr);
        }
        @media (max-width: 1100px) {
          .metrics-grid {
            grid-template-columns: repeat(2, minmax(0, 1fr)) !important;
          }
        }
        @media (max-width: 900px) {
          .tools-dash-grid {
            grid-template-columns: repeat(2, 1fr);
          }
          .passport-grid {
            grid-template-columns: 1fr !important;
          }
          .hero-grid {
            grid-template-columns: 1fr !important;
          }
          .hero-ring {
            justify-self: center;
          }
        }
        @media (max-width: 600px) {
          .tools-dash-grid {
            grid-template-columns: 1fr;
          }
          .metrics-grid {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </div>
  )
}
