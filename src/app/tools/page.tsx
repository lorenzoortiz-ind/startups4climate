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
import { formatToolData } from '@/lib/report-formatters'

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
  { label: 'Productos', href: '/tools/productos', active: false },
  { label: 'Servicios', href: '/tools/servicios', active: false },
]

/* ─── Category color mapping ─── */
const CATEGORY_COLORS: Record<ToolCategory, { color: string; bg: string }> = {
  Estrategia: { color: '#6366F1', bg: 'rgba(99,102,241,0.1)' },
  Mercado: { color: '#0891B2', bg: 'rgba(8,145,178,0.1)' },
  Cliente: { color: '#D946EF', bg: 'rgba(217,70,239,0.1)' },
  Producto: { color: '#059669', bg: 'rgba(5,150,105,0.1)' },
  Finanzas: { color: '#D97706', bg: 'rgba(217,119,6,0.1)' },
  Ventas: { color: '#DC2626', bg: 'rgba(220,38,38,0.1)' },
  Marketing: { color: '#7C3AED', bg: 'rgba(124,58,237,0.1)' },
  'Modelo de Negocio': { color: '#0D9488', bg: 'rgba(13,148,136,0.1)' },
  Equipo: { color: '#EA580C', bg: 'rgba(234,88,12,0.1)' },
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
        overflow: 'hidden',
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
              fontFamily: 'var(--font-mono)',
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
            whiteSpace: 'nowrap',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
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
              fontFamily: 'var(--font-mono)',
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
                fontFamily: 'var(--font-mono)',
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

    const completedTools = TOOLS.filter((t) => progress[t.id]?.completed)
    const stagesCovered = new Set(completedTools.map((t) => t.stage))

    const stageNames: Record<number, string> = {
      1: 'Pre-incubación',
      2: 'Incubación',
      3: 'Aceleración',
      4: 'Escalamiento',
    }
    const stageColors: Record<number, string> = {
      1: '#7C3AED',
      2: '#059669',
      3: '#D97706',
      4: '#0891B2',
    }

    const toolSections = completedTools
      .map((tool) => {
        const entry = progress[tool.id]
        const data = entry?.data ?? {}
        const completedAt = entry?.completedAt
          ? new Date(entry.completedAt).toLocaleDateString('es-ES', {
              day: 'numeric',
              month: 'long',
              year: 'numeric',
            })
          : 'N/A'

        const dataHtml =
          Object.keys(data).length > 0
            ? formatToolData(tool.id, data)
            : '<p style="color:#9CA3AF;font-style:italic;font-size:0.8125rem">Sin datos guardados</p>'

        return `
          <div style="margin-bottom:32px;background:white;border-radius:16px;border:1px solid #E5E7EB;overflow:hidden;box-shadow:0 1px 3px rgba(0,0,0,0.06)">
            <div style="padding:20px 24px;border-bottom:1px solid #F3F4F6;display:flex;align-items:center;justify-content:space-between;flex-wrap:wrap;gap:12px">
              <div>
                <h3 style="font-family:'Plus Jakarta Sans',sans-serif;font-size:1.125rem;font-weight:700;color:#111827;margin:0 0 4px 0">${tool.name}</h3>
                <p style="font-family:'Inter',sans-serif;font-size:0.75rem;color:#6B7280;margin:0">Completado: ${completedAt} &middot; ${tool.category}</p>
              </div>
              <span style="display:inline-block;padding:4px 14px;border-radius:9999px;font-family:'JetBrains Mono',monospace;font-size:0.6875rem;font-weight:600;color:${stageColors[tool.stage]};background:${tool.stageBg};border:1px solid ${tool.stageBorder}">${tool.stageName}</span>
            </div>
            <div style="padding:20px 24px">${dataHtml}</div>
          </div>`
      })
      .join('\n')

    const html = `<!DOCTYPE html>
<html lang="es">
<head>
<meta charset="UTF-8" />
<meta name="viewport" content="width=device-width, initial-scale=1.0" />
<title>Reporte Global - ${user.startup}</title>
<link rel="preconnect" href="https://fonts.googleapis.com" />
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
<link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;600;700;800&family=Inter:wght@400;500;600&family=JetBrains+Mono:wght@400;600;700&display=swap" rel="stylesheet" />
<style>
  * { margin: 0; padding: 0; box-sizing: border-box; }
  body { font-family: 'Inter', sans-serif; background: #F9FAFB; color: #111827; }
  @media print {
    body { background: white; }
    .no-print { display: none !important; }
    .page-break { page-break-before: always; }
  }
</style>
</head>
<body>
  <div style="max-width:800px;margin:0 auto;padding:48px 24px">
    <!-- Header -->
    <div style="background:linear-gradient(135deg,#059669,#047857);border-radius:20px;padding:40px 36px;margin-bottom:36px;color:white">
      <div style="font-family:'JetBrains Mono',monospace;font-size:0.6875rem;font-weight:600;text-transform:uppercase;letter-spacing:0.08em;opacity:0.8;margin-bottom:8px">Startups4Climate</div>
      <h1 style="font-family:'Plus Jakarta Sans',sans-serif;font-size:1.875rem;font-weight:800;margin-bottom:8px;letter-spacing:-0.02em">Reporte Global &mdash; ${user.startup}</h1>
      <p style="font-family:'Inter',sans-serif;font-size:0.9375rem;opacity:0.85">${user.name} &middot; Generado el ${new Date().toLocaleDateString('es-ES', { day: 'numeric', month: 'long', year: 'numeric' })}</p>
    </div>

    <!-- Summary stats -->
    <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(180px,1fr));gap:16px;margin-bottom:36px">
      <div style="background:white;border-radius:14px;border:1px solid #E5E7EB;padding:20px 24px;box-shadow:0 1px 3px rgba(0,0,0,0.06)">
        <div style="font-family:'JetBrains Mono',monospace;font-size:1.5rem;font-weight:700;color:#059669">${completedTools.length}<span style="font-size:0.875rem;color:#9CA3AF;font-weight:400">/${TOOLS.length}</span></div>
        <div style="font-family:'Inter',sans-serif;font-size:0.8125rem;color:#6B7280;margin-top:4px">Herramientas completadas</div>
      </div>
      <div style="background:white;border-radius:14px;border:1px solid #E5E7EB;padding:20px 24px;box-shadow:0 1px 3px rgba(0,0,0,0.06)">
        <div style="font-family:'JetBrains Mono',monospace;font-size:1.5rem;font-weight:700;color:#059669">${stagesCovered.size}<span style="font-size:0.875rem;color:#9CA3AF;font-weight:400">/4</span></div>
        <div style="font-family:'Inter',sans-serif;font-size:0.8125rem;color:#6B7280;margin-top:4px">Etapas cubiertas</div>
      </div>
      <div style="background:white;border-radius:14px;border:1px solid #E5E7EB;padding:20px 24px;box-shadow:0 1px 3px rgba(0,0,0,0.06)">
        <div style="font-family:'Inter',sans-serif;font-size:0.8125rem;color:#6B7280;margin-bottom:4px">Etapas</div>
        <div style="display:flex;gap:6px;flex-wrap:wrap">${Array.from(stagesCovered)
          .sort()
          .map(
            (s) =>
              `<span style="display:inline-block;padding:3px 10px;border-radius:9999px;font-family:'JetBrains Mono',monospace;font-size:0.6875rem;font-weight:600;color:${stageColors[s]};background:rgba(0,0,0,0.04)">${stageNames[s]}</span>`
          )
          .join('')}</div>
      </div>
    </div>

    <!-- Tool sections -->
    <h2 style="font-family:'Plus Jakarta Sans',sans-serif;font-size:1.25rem;font-weight:700;color:#111827;margin-bottom:20px;letter-spacing:-0.01em">Detalle por herramienta</h2>
    ${toolSections}

    <!-- Footer -->
    <div class="no-print" style="margin-top:48px;padding:24px 0;border-top:1px solid #E5E7EB;display:flex;align-items:center;justify-content:center;gap:16px;flex-wrap:wrap">
      <button onclick="window.print()" style="display:inline-flex;align-items:center;gap:8px;padding:10px 24px;border-radius:9999px;background:#059669;color:white;font-family:'Inter',sans-serif;font-size:0.875rem;font-weight:600;border:none;cursor:pointer;box-shadow:0 2px 10px rgba(5,150,105,0.3)">Imprimir / Guardar PDF</button>
      <a href="mailto:?subject=Reporte%20Global%20-%20${encodeURIComponent(user.startup)}&body=Adjunto%20el%20reporte%20global%20de%20Startups4Climate" style="display:inline-flex;align-items:center;gap:8px;padding:10px 24px;border-radius:9999px;background:white;color:#059669;font-family:'Inter',sans-serif;font-size:0.875rem;font-weight:600;border:1px solid rgba(5,150,105,0.3);text-decoration:none;cursor:pointer">Enviar por email</a>
    </div>
    <p style="text-align:center;font-family:'JetBrains Mono',monospace;font-size:0.6875rem;color:#9CA3AF;margin-top:16px">&copy; ${new Date().getFullYear()} Startups4Climate. Todos los derechos reservados.</p>
  </div>
</body>
</html>`

    const reportWindow = window.open('', '_blank')
    if (reportWindow) {
      reportWindow.document.write(html)
      reportWindow.document.close()
    }
  }, [user, progress])

  if (!user) return null

  return (
    <div style={{ padding: '2rem 1.5rem', maxWidth: 960, margin: '0 auto' }}>
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
          padding: '0.75rem 2rem',
          overflow: 'visible',
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
              background: tab.active ? '#059669' : 'transparent',
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
                fontFamily: 'var(--font-mono)',
                fontSize: '0.6875rem',
                fontWeight: 600,
                color: '#059669',
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
              {user.startup} · Roadmap de Climate Tech
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
                    stroke="#059669"
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
                    fontFamily: 'var(--font-mono)',
                    fontSize: '0.75rem',
                    fontWeight: 700,
                    color: '#059669',
                  }}
                >
                  {pct}%
                </div>
              </div>
              <div>
                <div
                  style={{
                    fontFamily: 'var(--font-mono)',
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
                  background: '#059669',
                  color: 'white',
                  fontFamily: 'var(--font-body)',
                  fontSize: '0.875rem',
                  fontWeight: 600,
                  border: 'none',
                  cursor: 'pointer',
                  boxShadow: '0 2px 10px rgba(5,150,105,0.3)',
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
                background: 'linear-gradient(135deg, #F0FDF4, #ECFDF5)',
                borderRadius: 16,
                border: '1px solid rgba(5,150,105,0.18)',
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
                    background: 'rgba(5,150,105,0.1)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0,
                  }}
                >
                  <TrendingUp size={18} color="#059669" />
                </div>
                <div>
                  <div
                    style={{
                      fontFamily: 'var(--font-body)',
                      fontSize: '0.75rem',
                      color: '#059669',
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
                        fontFamily: 'var(--font-mono)',
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
                  background: '#059669',
                  color: 'white',
                  fontFamily: 'var(--font-body)',
                  fontSize: '0.875rem',
                  fontWeight: 600,
                  textDecoration: 'none',
                  boxShadow: '0 2px 10px rgba(5,150,105,0.3)',
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
                background: isActive ? '#059669' : 'var(--color-bg-card)',
                border: `1px solid ${isActive ? '#059669' : 'var(--color-border)'}`,
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
            background: 'linear-gradient(to bottom, #7C3AED, #059669, #D97706, #0891B2)',
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
                  borderRadius: 18,
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
                            fontFamily: 'var(--font-mono)',
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
                              fontFamily: 'var(--font-mono)',
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
                              background: 'rgba(5,150,105,0.1)',
                              fontFamily: 'var(--font-mono)',
                              fontSize: '0.5625rem',
                              fontWeight: 600,
                              color: '#059669',
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
                          fontFamily: 'var(--font-mono)',
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
                    gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
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
