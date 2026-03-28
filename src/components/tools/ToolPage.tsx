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
import { ToolIllustration } from '../illustrations/StageIllustrations'
import { ToolCategoryIcon } from '../illustrations/ToolCategoryIcons'
import { getToolById } from '@/lib/tools-data'
import { markToolCompleted, markReportGenerated, getProgress } from '@/lib/progress'
import { generateToolReport } from '@/lib/pdf-generator'

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
      if (!user || !tool) return
      markReportGenerated(user.id, toolId)
      setReportGenerated(true)
      generateToolReport(tool, user, toolId, content)
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
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', minWidth: 0, flex: 1, overflow: 'hidden' }}>
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
              flexShrink: 0,
            }}
            onMouseEnter={(e) => (e.currentTarget.style.color = 'var(--color-text-primary)')}
            onMouseLeave={(e) => (e.currentTarget.style.color = 'var(--color-text-muted)')}
          >
            <ArrowLeft size={14} />
            Dashboard
          </Link>
          <ChevronRight size={12} color="#D1D5DB" />
          <span style={{ fontFamily: 'var(--font-body)', fontSize: '0.8125rem', color: 'var(--color-text-secondary)', fontWeight: 500, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', minWidth: 0 }}>
            {tool.shortName}
          </span>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.625rem', flexShrink: 0 }}>
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

      <div style={{ maxWidth: 900, margin: '0 auto', padding: '2rem 1.5rem', overflowWrap: 'break-word', wordBreak: 'break-word' }}>
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
            {/* Subtle decorative illustration */}
            <div
              style={{
                position: 'absolute',
                right: 12,
                top: '50%',
                transform: 'translateY(-50%)',
                pointerEvents: 'none',
              }}
            >
              <ToolIllustration width={120} height={120} />
            </div>
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
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '0.3rem',
                      padding: '0.2rem 0.625rem',
                      borderRadius: 9999,
                      background: 'var(--color-bg-muted)',
                      fontFamily: 'var(--font-mono)',
                      fontSize: '0.625rem',
                      color: 'var(--color-text-muted)',
                      textTransform: 'uppercase',
                    }}
                  >
                    <ToolCategoryIcon category={tool.category} width={11} height={11} color="var(--color-text-muted)" />
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
