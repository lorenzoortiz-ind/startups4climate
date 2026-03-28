'use client'

import { useState, useCallback } from 'react'
import Link from 'next/link'
import dynamic from 'next/dynamic'
import { motion } from 'framer-motion'
import {
  ArrowLeft,
  CheckCircle2,
  Clock,
  FileText,
  ChevronRight,
  ChevronDown,
  BookOpen,
  Lightbulb,
} from 'lucide-react'
import { useAuth } from '@/context/AuthContext'
import { getToolById } from '@/lib/tools-data'
import { markToolCompleted, markReportGenerated, getProgress } from '@/lib/progress'

// Dynamic imports — only loads the tool component the user navigates to (bundle-dynamic-imports)
// Note: New tools will show "en construcción" until their components are created
const TOOL_COMPONENTS: Record<string, React.ComponentType<ToolComponentProps>> = {
  'passion-purpose': dynamic(() => import('./PassionPurpose')),
  'market-segmentation': dynamic(() => import('./MarketSegmentation')),
  'beachhead-market': dynamic(() => import('./BeachheadMarket')),
  'end-user-profile': dynamic(() => import('./EndUserProfile')),
  'tam-calculator': dynamic(() => import('./TAMCalculator')),
  'persona-profile': dynamic(() => import('./PersonaProfile')),
  'full-lifecycle-usecase': dynamic(() => import('./FullLifecycleUseCase')),
  'product-specification': dynamic(() => import('./ProductSpecification')),
  'quantified-value-prop': dynamic(() => import('./QuantifiedValueProp')),
  'first-10-customers': dynamic(() => import('./FirstTenCustomers')),
  'core-competitive-position': dynamic(() => import('./CoreCompetitivePosition')),
  'lean-canvas': dynamic(() => import('./LeanCanvas')),
  'decision-making-unit': dynamic(() => import('./DecisionMakingUnit')),
  'customer-acquisition-process': dynamic(() => import('./CustomerAcquisitionProcess')),
  'business-model-design': dynamic(() => import('./BusinessModelDesign')),
  'pricing-framework': dynamic(() => import('./PricingFramework')),
  'ltv-unit-economics': dynamic(() => import('./UnitEconomics')),
  'sales-process-map': dynamic(() => import('./SalesProcessMap')),
  'key-assumptions': dynamic(() => import('./KeyAssumptions')),
  'mvbp-definition': dynamic(() => import('./MVBPDefinition')),
  'traction-validation': dynamic(() => import('./TractionValidation')),
  'product-plan-scaling': dynamic(() => import('./ProductPlanScaling')),
  'pitch-deck-builder': dynamic(() => import('./PitchDeck')),
  'cap-table-fundraising': dynamic(() => import('./CapTable')),
  'competitor-analysis': dynamic(() => import('./CompetitorAnalysis')),
  'data-room-builder': dynamic(() => import('./DataRoomBuilder')),
  'okr-tracker': dynamic(() => import('./OKRTracker')),
  'regulatory-compass': dynamic(() => import('./RegulatoryCompass')),
  'impact-metrics': dynamic(() => import('./ImpactMetrics')),
  'financial-model-builder': dynamic(() => import('./FinancialModelBuilder')),
}

export interface ToolComponentProps {
  userId: string
  onComplete: () => void
  onGenerateReport: (content: string) => void
}

export default function ToolPage({ toolId }: { toolId: string }) {
  const { user } = useAuth()
  const tool = getToolById(toolId)
  const [preambOpen, setPreambOpen] = useState(true)
  const [completed, setCompleted] = useState(() => {
    if (!user) return false
    const p = getProgress(user.id)
    return p[toolId]?.completed ?? false
  })
  const [reportGenerated, setReportGenerated] = useState(() => {
    if (!user) return false
    const p = getProgress(user.id)
    return p[toolId]?.reportGenerated ?? false
  })

  const handleComplete = useCallback(() => {
    if (!user) return
    markToolCompleted(user.id, toolId)
    setCompleted(true)
  }, [user, toolId])

  const handleGenerateReport = useCallback(
    (content: string) => {
      if (!user) return
      markReportGenerated(user.id, toolId)
      setReportGenerated(true)

      const dateStr = new Date().toLocaleDateString('es-ES', { day: 'numeric', month: 'long', year: 'numeric' })
      const stageColor = tool?.stageColor || '#059669'

      // Parse content into styled sections
      const formatContent = (raw: string) => {
        return raw
          .replace(/^(={2,}.*$)/gm, '')
          .replace(/^(─{2,}.*$)/gm, '<hr/>')
          .replace(/^(---+)$/gm, '<hr/>')
          .replace(/^([A-ZÁÉÍÓÚÑ][A-ZÁÉÍÓÚÑ\s&()\/\-—:,\.0-9]+):?\s*$/gm, '<h2 class="section-title">$1</h2>')
          .replace(/^(▶\s?)(.+)$/gm, '<h3 class="question">$2</h3>')
          .replace(/^(\s*[→✓✗⚠]\s?)(.+)$/gm, '<div class="list-item">$1$2</div>')
          .replace(/^(\s*[-•]\s?)(.+)$/gm, '<div class="list-item bullet">$2</div>')
          .replace(/\n{3,}/g, '\n\n')
      }

      const win = window.open('', '_blank')
      if (!win) return
      win.document.write(`<!DOCTYPE html>
<html lang="es">
<head>
<meta charset="UTF-8">
<title>Reporte: ${tool?.name} — ${user.startup}</title>
<link rel="preconnect" href="https://fonts.googleapis.com">
<link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@500;600;700;800&family=Inter:wght@400;500;600&family=JetBrains+Mono:wght@400;600&display=swap" rel="stylesheet">
<style>
  * { box-sizing: border-box; margin: 0; padding: 0; }
  body { font-family: 'Inter', system-ui, sans-serif; color: #111827; background: #F8F7F4; padding: 0; }
  .page { max-width: 800px; margin: 0 auto; padding: 2rem; }

  .header {
    background: linear-gradient(135deg, ${stageColor}, ${stageColor}DD);
    color: white; padding: 2.5rem; border-radius: 16px; margin-bottom: 1.5rem;
    position: relative; overflow: hidden;
  }
  .header::before { content: ''; position: absolute; top: -50%; right: -20%; width: 60%; height: 200%; background: radial-gradient(circle, rgba(255,255,255,0.08) 0%, transparent 60%); }
  .header .logo { font-family: 'Plus Jakarta Sans', sans-serif; font-weight: 800; font-size: 0.8125rem; letter-spacing: 0.05em; text-transform: uppercase; opacity: 0.7; margin-bottom: 1rem; }
  .header .badge { display: inline-block; padding: 0.3rem 0.875rem; border-radius: 9999px; background: rgba(255,255,255,0.15); backdrop-filter: blur(10px); font-family: 'JetBrains Mono', monospace; font-size: 0.6875rem; font-weight: 600; text-transform: uppercase; margin-bottom: 0.875rem; letter-spacing: 0.03em; }
  .header h1 { font-family: 'Plus Jakarta Sans', sans-serif; font-size: 1.75rem; font-weight: 800; line-height: 1.2; letter-spacing: -0.02em; margin-bottom: 0.625rem; }
  .header .subtitle { font-size: 0.9375rem; opacity: 0.85; line-height: 1.5; }
  .header .meta { display: flex; gap: 2rem; margin-top: 1.25rem; font-size: 0.8125rem; opacity: 0.75; flex-wrap: wrap; }
  .header .meta span { display: flex; align-items: center; gap: 0.375rem; }

  .info-bar { display: flex; gap: 0.75rem; margin-bottom: 1.5rem; flex-wrap: wrap; }
  .info-card { flex: 1; min-width: 140px; background: white; border-radius: 12px; border: 1px solid #E5E7EB; padding: 1rem; text-align: center; }
  .info-card .label { font-family: 'JetBrains Mono', monospace; font-size: 0.625rem; text-transform: uppercase; color: #9CA3AF; font-weight: 600; letter-spacing: 0.05em; }
  .info-card .value { font-family: 'Plus Jakarta Sans', sans-serif; font-size: 1.125rem; font-weight: 700; color: ${stageColor}; margin-top: 0.25rem; }

  .content {
    background: white; padding: 2.5rem; border-radius: 16px; border: 1px solid #E5E7EB;
    font-size: 0.9375rem; line-height: 1.8; white-space: pre-wrap;
    box-shadow: 0 1px 3px rgba(0,0,0,0.04);
  }
  .content h2.section-title {
    font-family: 'Plus Jakarta Sans', sans-serif; font-size: 1.0625rem; font-weight: 700;
    color: ${stageColor}; margin: 2rem 0 0.875rem; padding-bottom: 0.5rem;
    border-bottom: 2px solid ${stageColor}20; text-transform: none;
  }
  .content h2.section-title:first-child { margin-top: 0; }
  .content h3.question { font-family: 'Inter', sans-serif; font-size: 0.9375rem; font-weight: 600; color: #374151; margin: 1.25rem 0 0.5rem; }
  .content .list-item { padding: 0.25rem 0 0.25rem 0.5rem; font-size: 0.875rem; }
  .content .list-item.bullet::before { content: '→ '; color: ${stageColor}; font-weight: 600; }
  .content hr { border: none; border-top: 1px solid #F3F4F6; margin: 1.5rem 0; }

  .footer {
    margin-top: 2rem; padding: 1.5rem; text-align: center;
    border-top: 1px solid #E5E7EB;
  }
  .footer p { font-size: 0.75rem; color: #9CA3AF; margin-bottom: 0.75rem; }
  .footer .actions { display: flex; gap: 0.75rem; justify-content: center; flex-wrap: wrap; }
  .btn { display: inline-flex; align-items: center; gap: 0.5rem; padding: 0.625rem 1.5rem; border-radius: 10px; font-family: 'Inter', sans-serif; font-size: 0.875rem; font-weight: 600; border: none; cursor: pointer; transition: all 0.15s; text-decoration: none; }
  .btn-primary { background: ${stageColor}; color: white; box-shadow: 0 2px 8px ${stageColor}40; }
  .btn-primary:hover { filter: brightness(0.9); transform: translateY(-1px); }
  .btn-secondary { background: white; color: #374151; border: 1px solid #E5E7EB; }
  .btn-secondary:hover { background: #F9FAFB; }

  .disclaimer { background: #FFFBEB; border: 1px solid #FDE68A; border-radius: 10px; padding: 1rem 1.25rem; margin-top: 1.5rem; font-size: 0.8125rem; color: #92400E; line-height: 1.5; }

  @media print {
    body { background: white; padding: 0; }
    .page { padding: 0; }
    .no-print { display: none !important; }
    .header { break-after: avoid; }
    .content { border: none; box-shadow: none; padding: 1.5rem 0; }
  }
</style>
</head>
<body>
<div class="page">
  <div class="header">
    <div class="logo">Startups4Climate</div>
    <div class="badge">${tool?.stageName} · ${tool?.category}</div>
    <h1>${tool?.name}</h1>
    <div class="subtitle">${tool?.description}</div>
    <div class="meta">
      <span>📋 ${user.startup}</span>
      <span>👤 ${user.name}</span>
      <span>📅 ${dateStr}</span>
    </div>
  </div>

  <div class="info-bar no-print">
    <div class="info-card">
      <div class="label">Etapa</div>
      <div class="value">${tool?.stageName}</div>
    </div>
    <div class="info-card">
      <div class="label">Categoría</div>
      <div class="value" style="font-size:0.875rem;color:#374151">${tool?.category}</div>
    </div>
    <div class="info-card">
      <div class="label">Tiempo estimado</div>
      <div class="value" style="font-size:0.875rem;color:#374151">${tool?.estimatedTime}</div>
    </div>
  </div>

  <div class="content">${formatContent(content)}</div>

  <div class="disclaimer">
    Este reporte fue generado automáticamente basado en la información ingresada. Valida los datos con tu equipo y asesores antes de compartirlo con inversores o stakeholders.
  </div>

  <div class="footer no-print">
    <p>Generado con Startups4Climate · startups4climate.org</p>
    <div class="actions">
      <button class="btn btn-primary" onclick="window.print()">🖨️ Imprimir / Guardar PDF</button>
      <a class="btn btn-secondary" href="mailto:${user.email}?subject=${encodeURIComponent('Reporte: ' + (tool?.name || '') + ' — ' + user.startup)}&body=${encodeURIComponent('Adjunto el reporte de ' + (tool?.name || '') + ' generado en Startups4Climate.\n\nPara ver el reporte completo, accede a la plataforma en startups4climate.org/tools/' + toolId)}">✉️ Enviar por email</a>
    </div>
  </div>
</div>
</body>
</html>`)
      win.document.close()
    },
    [user, toolId, tool]
  )

  if (!tool || !user) return null

  const ToolComponent = TOOL_COMPONENTS[toolId]

  return (
    <div style={{ minHeight: '100vh', background: 'var(--color-bg-primary)' }}>
      {/* Top bar */}
      <div
        style={{
          background: 'var(--color-bg-card)',
          borderBottom: '1px solid var(--color-border)',
          padding: '0 2rem',
          height: 56,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          position: 'sticky',
          top: 0,
          zIndex: 20,
        }}
        className="lg:top-0 top-14"
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <Link
            href="/tools"
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.375rem',
              fontFamily: 'var(--font-body)',
              fontSize: '0.8125rem',
              color: 'var(--color-text-muted)',
              textDecoration: 'none',
              transition: 'color 0.15s',
            }}
            onMouseEnter={(e) => (e.currentTarget.style.color = 'var(--color-text-primary)')}
            onMouseLeave={(e) => (e.currentTarget.style.color = 'var(--color-text-muted)')}
          >
            <ArrowLeft size={14} />
            Dashboard
          </Link>
          <ChevronRight size={12} color="#D1D5DB" />
          <span style={{ fontFamily: 'var(--font-body)', fontSize: '0.8125rem', color: 'var(--color-text-secondary)', fontWeight: 500 }}>
            {tool.shortName}
          </span>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.625rem' }}>
          {reportGenerated && (
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.375rem',
                padding: '0.3rem 0.75rem',
                borderRadius: 9999,
                background: 'rgba(8,145,178,0.07)',
                border: '1px solid rgba(8,145,178,0.15)',
                fontFamily: 'var(--font-mono)',
                fontSize: '0.625rem',
                fontWeight: 600,
                color: '#0891B2',
                textTransform: 'uppercase',
              }}
            >
              <FileText size={11} />
              Reporte generado
            </div>
          )}
          {completed && (
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.375rem',
                padding: '0.3rem 0.75rem',
                borderRadius: 9999,
                background: `${tool.stageColor}10`,
                border: `1px solid ${tool.stageColor}22`,
                fontFamily: 'var(--font-mono)',
                fontSize: '0.625rem',
                fontWeight: 600,
                color: tool.stageColor,
                textTransform: 'uppercase',
              }}
            >
              <CheckCircle2 size={11} />
              Completado
            </div>
          )}
        </div>
      </div>

      <div style={{ maxWidth: 900, margin: '0 auto', padding: '2rem 1.5rem' }}>
        {/* Tool header */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35 }}
          style={{ marginBottom: '2rem' }}
        >
          <div
            style={{
              background: 'var(--color-bg-card)',
              borderRadius: 20,
              border: '1px solid var(--color-border)',
              padding: '1.75rem',
              boxShadow: 'var(--shadow-card)',
              position: 'relative',
              overflow: 'hidden',
            }}
          >
            <div
              style={{
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                height: 4,
                background: `linear-gradient(90deg, ${tool.stageColor}, ${tool.stageColor}88)`,
              }}
            />
            <div
              style={{
                display: 'flex',
                alignItems: 'flex-start',
                gap: '1.25rem',
                flexWrap: 'wrap',
              }}
            >
              <div
                style={{
                  width: 52,
                  height: 52,
                  borderRadius: 14,
                  background: tool.stageBg,
                  border: `1px solid ${tool.stageBorder}`,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0,
                }}
              >
                <span style={{ fontFamily: 'var(--font-mono)', fontSize: '1.125rem', color: tool.stageColor, fontWeight: 700 }}>
                  {(tool.stepNumber + 1).toString().padStart(2, '0')}
                </span>
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', alignItems: 'center', marginBottom: '0.5rem' }}>
                  <span
                    style={{
                      padding: '0.2rem 0.625rem',
                      borderRadius: 9999,
                      background: tool.stageBg,
                      border: `1px solid ${tool.stageBorder}`,
                      fontFamily: 'var(--font-mono)',
                      fontSize: '0.625rem',
                      fontWeight: 700,
                      color: tool.stageColor,
                      textTransform: 'uppercase',
                    }}
                  >
                    {tool.stageName}
                  </span>
                  <span
                    style={{
                      padding: '0.2rem 0.625rem',
                      borderRadius: 9999,
                      background: 'var(--color-bg-muted)',
                      fontFamily: 'var(--font-mono)',
                      fontSize: '0.625rem',
                      color: 'var(--color-text-muted)',
                      textTransform: 'uppercase',
                    }}
                  >
                    {tool.category}
                  </span>
                  <span
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.25rem',
                      fontFamily: 'var(--font-mono)',
                      fontSize: '0.625rem',
                      color: 'var(--color-text-muted)',
                    }}
                  >
                    <Clock size={10} />
                    {tool.estimatedTime}
                  </span>
                </div>
                <h1
                  style={{
                    fontFamily: 'var(--font-heading)',
                    fontSize: 'clamp(1.25rem, 2.5vw, 1.625rem)',
                    fontWeight: 800,
                    color: 'var(--color-text-primary)',
                    letterSpacing: '-0.02em',
                    marginBottom: '0.5rem',
                  }}
                >
                  {tool.name}
                </h1>
                <p
                  style={{
                    fontFamily: 'var(--font-body)',
                    fontSize: '0.9375rem',
                    lineHeight: 1.6,
                    color: 'var(--color-text-secondary)',
                    marginBottom: '0.875rem',
                  }}
                >
                  {tool.description}
                </p>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.375rem' }}>
                  {tool.outputs.map((out) => (
                    <span
                      key={out}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.3rem',
                        padding: '0.25rem 0.625rem',
                        borderRadius: 6,
                        background: 'var(--color-bg-muted)',
                        fontFamily: 'var(--font-body)',
                        fontSize: '0.75rem',
                        color: 'var(--color-text-secondary)',
                      }}
                    >
                      <CheckCircle2 size={11} color={tool.stageColor} />
                      {out}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Preámbulo — Why you need this tool */}
        {tool.preambulo && (
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.08 }}
            style={{ marginBottom: '1.5rem' }}
          >
            <button
              onClick={() => setPreambOpen(!preambOpen)}
              style={{
                width: '100%',
                display: 'flex',
                alignItems: 'center',
                gap: '0.75rem',
                padding: '1rem 1.25rem',
                borderRadius: preambOpen ? '14px 14px 0 0' : 14,
                background: 'var(--color-bg-card)',
                border: '1px solid var(--color-border)',
                borderBottom: preambOpen ? '1px solid var(--color-border)' : undefined,
                cursor: 'pointer',
                transition: 'all 0.2s',
              }}
            >
              <div style={{
                width: 36,
                height: 36,
                borderRadius: 10,
                background: `${tool.stageColor}10`,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0,
              }}>
                <BookOpen size={18} color={tool.stageColor} />
              </div>
              <div style={{ flex: 1, textAlign: 'left' }}>
                <span style={{
                  fontFamily: 'var(--font-heading)',
                  fontSize: '0.9375rem',
                  fontWeight: 700,
                  color: 'var(--color-text-primary)',
                }}>
                  ¿Por qué necesitas esta herramienta?
                </span>
                <span style={{
                  display: 'block',
                  fontFamily: 'var(--font-body)',
                  fontSize: '0.75rem',
                  color: 'var(--color-text-muted)',
                  marginTop: '0.125rem',
                }}>
                  Lee el contexto antes de comenzar
                </span>
              </div>
              <ChevronDown
                size={18}
                color="var(--color-text-muted)"
                style={{
                  transition: 'transform 0.2s',
                  transform: preambOpen ? 'rotate(180deg)' : 'rotate(0deg)',
                }}
              />
            </button>
            {preambOpen && (
              <div style={{
                padding: '1.25rem 1.5rem',
                background: 'var(--color-bg-card)',
                border: '1px solid var(--color-border)',
                borderTop: 'none',
                borderRadius: '0 0 14px 14px',
              }}>
                <p style={{
                  fontFamily: 'var(--font-body)',
                  fontSize: '0.9375rem',
                  lineHeight: 1.8,
                  color: 'var(--color-text-secondary)',
                }}>
                  {tool.preambulo}
                </p>
              </div>
            )}
          </motion.div>
        )}

        {/* Tool content */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35, delay: 0.1 }}
        >
          {ToolComponent ? (
            <ToolComponent
              userId={user.id}
              onComplete={handleComplete}
              onGenerateReport={handleGenerateReport}
            />
          ) : (
            <div
              style={{
                background: 'var(--color-bg-card)',
                borderRadius: 16,
                border: '1px solid var(--color-border)',
                padding: '3rem',
                textAlign: 'center',
                color: 'var(--color-text-muted)',
                fontFamily: 'var(--font-body)',
              }}
            >
              Herramienta en construcción...
            </div>
          )}
          {/* Recommendations after completion */}
          {completed && (
            <div style={{
              marginTop: '1.5rem',
              padding: '1.25rem 1.5rem',
              borderRadius: 14,
              background: `${tool.stageColor}08`,
              border: `1px solid ${tool.stageColor}18`,
            }}>
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.75rem' }}>
                <Lightbulb size={20} color={tool.stageColor} style={{ marginTop: 2, flexShrink: 0 }} />
                <div>
                  <h4 style={{
                    fontFamily: 'var(--font-heading)',
                    fontSize: '0.9375rem',
                    fontWeight: 700,
                    color: 'var(--color-text-primary)',
                    marginBottom: '0.5rem',
                  }}>
                    Recomendaciones para mejorar
                  </h4>
                  <ul style={{
                    fontFamily: 'var(--font-body)',
                    fontSize: '0.875rem',
                    lineHeight: 1.7,
                    color: 'var(--color-text-secondary)',
                    paddingLeft: '1rem',
                    margin: 0,
                  }}>
                    <li>Revisa tus respuestas con tu equipo cofundador y busca puntos ciegos.</li>
                    <li>Valida la información con datos reales de tu mercado, no suposiciones.</li>
                    <li>Genera el reporte y compártelo con un mentor o advisor para feedback externo.</li>
                    <li>Itera: esta herramienta no se llena una sola vez. Vuelve a ella conforme avances.</li>
                  </ul>
                </div>
              </div>
            </div>
          )}
        </motion.div>
      </div>
    </div>
  )
}
