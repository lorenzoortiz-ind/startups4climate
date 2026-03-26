'use client'

import { useCallback, useEffect, useState } from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import {
  CheckCircle2,
  Clock,
  ArrowRight,
  Zap,
  FlaskConical,
  Rocket,
  Building2,
  TrendingUp,
  Download,
} from 'lucide-react'
import { useAuth } from '@/context/AuthContext'
import { TOOLS, TOOLS_BY_STAGE, type ToolDef } from '@/lib/tools-data'
import { getProgress, type ProgressMap } from '@/lib/progress'
import { formatToolData } from '@/lib/report-formatters'

const STAGE_INFO = {
  1: {
    icon: FlaskConical,
    label: 'Pre-incubación',
    sublabel: 'TRL 1–4',
    color: '#7C3AED',
    bg: 'rgba(124,58,237,0.06)',
    border: 'rgba(124,58,237,0.15)',
  },
  2: {
    icon: Rocket,
    label: 'Incubación',
    sublabel: 'TRL 4–7',
    color: '#059669',
    bg: 'rgba(5,150,105,0.06)',
    border: 'rgba(5,150,105,0.15)',
  },
  3: {
    icon: Building2,
    label: 'Aceleración',
    sublabel: 'TRL 7–9',
    color: '#D97706',
    bg: 'rgba(217,119,6,0.06)',
    border: 'rgba(217,119,6,0.15)',
  },
} as const

function ToolCard({
  tool,
  done,
  idx,
}: {
  tool: ToolDef
  done: boolean
  idx: number
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, delay: idx * 0.05 }}
    >
      <Link
        href={`/tools/${tool.id}`}
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '0.875rem',
          padding: '1rem 1.125rem',
          borderRadius: 12,
          background: done ? tool.stageBg : 'var(--color-bg-card)',
          border: `1px solid ${done ? tool.stageBorder : 'var(--color-border)'}`,
          textDecoration: 'none',
          transition: 'all 0.18s ease',
          position: 'relative',
          overflow: 'hidden',
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.transform = 'translateY(-1px)'
          e.currentTarget.style.boxShadow = 'var(--shadow-elevated)'
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.transform = 'translateY(0)'
          e.currentTarget.style.boxShadow = 'none'
        }}
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
            width: 36,
            height: 36,
            borderRadius: 10,
            background: tool.stageBg,
            border: `1px solid ${tool.stageBorder}`,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexShrink: 0,
          }}
        >
          {done ? (
            <CheckCircle2 size={17} color={tool.stageColor} />
          ) : (
            <Zap size={16} color={tool.stageColor} strokeWidth={1.5} />
          )}
        </div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div
            style={{
              fontFamily: 'var(--font-heading)',
              fontSize: '0.875rem',
              fontWeight: 600,
              color: 'var(--color-text-primary)',
              marginBottom: '0.125rem',
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
            }}
          >
            <span
              style={{
                fontFamily: 'var(--font-mono)',
                fontSize: '0.625rem',
                color: 'var(--color-text-muted)',
                textTransform: 'uppercase',
              }}
            >
              {tool.category}
            </span>
            <span style={{ color: 'var(--color-border-strong)', fontSize: '0.625rem' }}>·</span>
            <Clock size={10} color="var(--color-text-muted)" />
            <span
              style={{ fontFamily: 'var(--font-mono)', fontSize: '0.625rem', color: 'var(--color-text-muted)' }}
            >
              {tool.estimatedTime}
            </span>
          </div>
        </div>
        <ArrowRight size={14} color={done ? tool.stageColor : 'var(--color-text-muted)'} style={{ flexShrink: 0 }} />
      </Link>
    </motion.div>
  )
}

export default function ToolsDashboard() {
  const { user } = useAuth()
  const [progress, setProgress] = useState<ProgressMap>({})

  useEffect(() => {
    if (user) {
      setProgress(getProgress(user.id))
    }
  }, [user])

  const generateGlobalReport = useCallback(() => {
    if (!user) return

    const completedTools = TOOLS.filter((t) => progress[t.id]?.completed)
    const stagesCovered = new Set(completedTools.map((t) => t.stage))

    const stageNames: Record<number, string> = { 1: 'Pre-incubacion', 2: 'Incubacion', 3: 'Aceleracion' }
    const stageColors: Record<number, string> = { 1: '#7C3AED', 2: '#059669', 3: '#D97706' }

    const toolSections = completedTools
      .map((tool) => {
        const entry = progress[tool.id]
        const data = entry?.data ?? {}
        const completedAt = entry?.completedAt
          ? new Date(entry.completedAt).toLocaleDateString('es-ES', { day: 'numeric', month: 'long', year: 'numeric' })
          : 'N/A'

        const dataHtml = Object.keys(data).length > 0 ? formatToolData(tool.id, data) : '<p style="color:#9CA3AF;font-style:italic;font-size:0.8125rem">Sin datos guardados</p>'

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
        <div style="font-family:'JetBrains Mono',monospace;font-size:1.5rem;font-weight:700;color:#059669">${stagesCovered.size}<span style="font-size:0.875rem;color:#9CA3AF;font-weight:400">/3</span></div>
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

  const completedIds = new Set(Object.entries(progress).filter(([, v]) => v.completed).map(([k]) => k))
  const totalCompleted = completedIds.size
  const total = TOOLS.length
  const pct = Math.round((totalCompleted / total) * 100)

  // Suggest next tool
  const nextTool = TOOLS.find((t) => !completedIds.has(t.id))

  return (
    <div style={{ padding: '2.5rem 2rem', maxWidth: 960, margin: '0 auto' }}>
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        style={{ marginBottom: '2rem' }}
      >
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem' }}>
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
            <p style={{ fontFamily: 'var(--font-body)', fontSize: '0.9375rem', color: 'var(--color-text-secondary)' }}>
              {user.startup} · Toolkit de Climate Tech
            </p>
          </div>

          {/* Progress ring */}
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
              <div style={{ fontFamily: 'var(--font-mono)', fontSize: '1.25rem', fontWeight: 700, color: 'var(--color-text-primary)', lineHeight: 1 }}>
                {totalCompleted}
                <span style={{ fontFamily: 'var(--font-body)', fontSize: '0.75rem', color: 'var(--color-text-muted)', fontWeight: 400 }}>
                  /{total}
                </span>
              </div>
              <div style={{ fontFamily: 'var(--font-body)', fontSize: '0.75rem', color: 'var(--color-text-secondary)', marginTop: '0.25rem' }}>
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
                marginTop: '1rem',
              }}
            >
              <Download size={15} />
              Generar Reporte Global
            </button>
          )}
        </div>
      </motion.div>

      {/* Continue CTA */}
      {nextTool && (
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.1 }}
          style={{ marginBottom: '2rem' }}
        >
          <div
            style={{
              background: 'linear-gradient(135deg, #F0FDF4, #ECFDF5)',
              borderRadius: 16,
              border: '1px solid rgba(5,150,105,0.18)',
              padding: '1.25rem 1.5rem',
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
                <div style={{ fontFamily: 'var(--font-body)', fontSize: '0.75rem', color: '#059669', fontWeight: 600, marginBottom: '0.125rem' }}>
                  Continúa donde lo dejaste
                </div>
                <div style={{ fontFamily: 'var(--font-heading)', fontSize: '0.9375rem', fontWeight: 700, color: 'var(--color-text-primary)' }}>
                  {nextTool.name}
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

      {/* Stages grid */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
          gap: '1.5rem',
        }}
      >
        {([1, 2, 3] as const).map((stageNum, si) => {
          const cfg = STAGE_INFO[stageNum]
          const stageTools = TOOLS_BY_STAGE[stageNum]
          const stageDone = stageTools.filter((t) => completedIds.has(t.id)).length
          const Icon = cfg.icon

          return (
            <motion.div
              key={stageNum}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.15 + si * 0.08 }}
              style={{
                background: 'var(--color-bg-card)',
                borderRadius: 20,
                border: '1px solid var(--color-border)',
                overflow: 'hidden',
                boxShadow: 'var(--shadow-card)',
              }}
            >
              {/* Stage header */}
              <div
                style={{
                  padding: '1.25rem 1.25rem 1rem',
                  background: cfg.bg,
                  borderBottom: `1px solid ${cfg.border}`,
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.625rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.625rem' }}>
                    <div
                      style={{
                        width: 34,
                        height: 34,
                        borderRadius: 9,
                        background: 'var(--color-bg-card)',
                        border: `1px solid ${cfg.border}`,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                      }}
                    >
                      <Icon size={16} color={cfg.color} strokeWidth={1.5} />
                    </div>
                    <div>
                      <div style={{ fontFamily: 'var(--font-heading)', fontSize: '0.9375rem', fontWeight: 700, color: 'var(--color-text-primary)' }}>
                        {cfg.label}
                      </div>
                      <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.625rem', color: cfg.color, fontWeight: 600 }}>
                        {cfg.sublabel}
                      </div>
                    </div>
                  </div>
                  <div
                    style={{
                      padding: '0.25rem 0.625rem',
                      borderRadius: 9999,
                      background: 'var(--color-bg-card)',
                      border: `1px solid ${cfg.border}`,
                      fontFamily: 'var(--font-mono)',
                      fontSize: '0.625rem',
                      fontWeight: 700,
                      color: cfg.color,
                    }}
                  >
                    {stageDone}/{stageTools.length}
                  </div>
                </div>
                <div style={{ height: 3, borderRadius: 2, background: 'rgba(255,255,255,0.6)' }}>
                  <div
                    style={{
                      height: '100%',
                      borderRadius: 2,
                      background: cfg.color,
                      width: `${(stageDone / stageTools.length) * 100}%`,
                      transition: 'width 0.6s ease',
                    }}
                  />
                </div>
              </div>

              {/* Tools list */}
              <div style={{ padding: '0.875rem', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                {stageTools.map((tool, i) => (
                  <ToolCard
                    key={tool.id}
                    tool={tool}
                    done={completedIds.has(tool.id)}
                    idx={i}
                  />
                ))}
              </div>
            </motion.div>
          )
        })}
      </div>
    </div>
  )
}
