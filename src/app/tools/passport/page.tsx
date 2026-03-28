'use client'

import { useEffect, useState, useRef, useCallback } from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import {
  ArrowLeft,
  Download,
  Award,
  Users,
  DollarSign,
  Target,
  TrendingUp,
  UserCheck,
  CheckCircle2,
  Globe,
  Briefcase,
  Printer,
} from 'lucide-react'
import { useAuth } from '@/context/AuthContext'
import { TOOLS, STAGE_META } from '@/lib/tools-data'
import { getProgress } from '@/lib/progress'

const LATAM_VERTICALS: Record<string, string> = {
  fintech: 'Fintech',
  healthtech: 'Healthtech',
  edtech: 'Edtech',
  agritech_foodtech: 'Agritech / Foodtech',
  cleantech_climatech: 'Cleantech / Climatech',
  biotech_deeptech: 'Biotech / Deeptech',
  logistics_mobility: 'Logística / Movilidad',
  saas_enterprise: 'SaaS / Enterprise',
  social_impact: 'Impacto Social',
  other: 'Otro',
}

const STAGE_NAMES: Record<number, string> = {
  1: 'Pre-incubación',
  2: 'Incubación',
  3: 'Aceleración',
  4: 'Escalamiento',
}

interface PassportData {
  startupName: string
  vertical: string
  country: string
  founderName: string
  teamSize: number
  tam: string
  ltv: string
  cac: string
  mrr: string
  payingCustomers: number
  unitEconomics: string
  runway: string
}

interface StageProgress {
  stage: number
  name: string
  color: string
  total: number
  completed: number
}

/* ─── Circular Progress ─── */

function CircularProgress({ score, size = 110 }: { score: number; size?: number }) {
  const strokeWidth = 9
  const radius = (size - strokeWidth) / 2
  const circumference = 2 * Math.PI * radius
  const offset = circumference - (score / 100) * circumference
  const color = score >= 70 ? '#059669' : score >= 40 ? '#D97706' : '#DC2626'

  return (
    <div style={{ position: 'relative', width: size, height: size }}>
      <svg width={size} height={size} style={{ transform: 'rotate(-90deg)' }}>
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="var(--color-border, #e5e7eb)"
          strokeWidth={strokeWidth}
        />
        <motion.circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke={color}
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeDasharray={circumference}
          initial={{ strokeDashoffset: circumference }}
          animate={{ strokeDashoffset: offset }}
          transition={{ duration: 1.2, ease: 'easeOut' }}
        />
      </svg>
      <div
        style={{
          position: 'absolute',
          inset: 0,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <span
          style={{
            fontFamily: 'var(--font-heading)',
            fontSize: size * 0.28,
            fontWeight: 800,
            color: 'var(--color-text-primary)',
            lineHeight: 1,
          }}
        >
          {score}
        </span>
        <span
          style={{
            fontFamily: 'var(--font-mono)',
            fontSize: size * 0.1,
            color: 'var(--color-text-muted)',
            marginTop: 2,
          }}
        >
          /100
        </span>
      </div>
    </div>
  )
}

/* ─── Metric Card ─── */

function MetricCard({
  icon: Icon,
  label,
  value,
  color,
}: {
  icon: React.ElementType
  label: string
  value: string | number
  color: string
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35 }}
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: '0.75rem',
        padding: '0.75rem 1rem',
        borderRadius: 12,
        background: 'var(--color-bg-primary)',
        border: '1px solid var(--color-border)',
      }}
    >
      <div
        style={{
          width: 36,
          height: 36,
          borderRadius: 9,
          background: `${color}12`,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          flexShrink: 0,
        }}
      >
        <Icon size={17} color={color} />
      </div>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div
          style={{
            fontFamily: 'var(--font-mono)',
            fontSize: '0.625rem',
            color: 'var(--color-text-muted)',
            textTransform: 'uppercase',
            letterSpacing: '0.05em',
            marginBottom: 2,
          }}
        >
          {label}
        </div>
        <div
          style={{
            fontFamily: 'var(--font-heading)',
            fontSize: '0.9375rem',
            fontWeight: 700,
            color: 'var(--color-text-primary)',
          }}
        >
          {value || '—'}
        </div>
      </div>
    </motion.div>
  )
}

/* ─── Stage Progress Bar ─── */

function StageProgressBar({ stage }: { stage: StageProgress }) {
  const pct = stage.total > 0 ? (stage.completed / stage.total) * 100 : 0
  const isComplete = stage.completed === stage.total && stage.total > 0

  return (
    <div style={{ marginBottom: '1rem' }}>
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginBottom: '0.375rem',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          {isComplete ? (
            <CheckCircle2 size={14} color={stage.color} />
          ) : (
            <div
              style={{
                width: 14,
                height: 14,
                borderRadius: '50%',
                border: `2px solid ${stage.color}50`,
              }}
            />
          )}
          <span
            style={{
              fontFamily: 'var(--font-body)',
              fontSize: '0.8125rem',
              fontWeight: 600,
              color: 'var(--color-text-primary)',
            }}
          >
            {stage.name}
          </span>
        </div>
        <span
          style={{
            fontFamily: 'var(--font-mono)',
            fontSize: '0.6875rem',
            fontWeight: 700,
            color: isComplete ? stage.color : 'var(--color-text-muted)',
          }}
        >
          {stage.completed}/{stage.total}
        </span>
      </div>
      <div
        style={{
          height: 6,
          borderRadius: 3,
          background: `${stage.color}15`,
          overflow: 'hidden',
        }}
      >
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${pct}%` }}
          transition={{ duration: 0.8, ease: 'easeOut', delay: stage.stage * 0.1 }}
          style={{
            height: '100%',
            borderRadius: 3,
            background: `linear-gradient(90deg, ${stage.color}, ${stage.color}BB)`,
          }}
        />
      </div>
    </div>
  )
}

/* ─── Print styles ─── */

const PRINT_STYLE = `
@media print {
  body * { visibility: hidden !important; }
  #passport-printable, #passport-printable * { visibility: visible !important; }
  #passport-printable {
    position: absolute;
    left: 0;
    top: 0;
    width: 100%;
    padding: 2rem;
    -webkit-print-color-adjust: exact !important;
    print-color-adjust: exact !important;
  }
  nav, header, footer, .no-print { display: none !important; }
}
`

/* ═══════════════════════════════════════════════════
   PASSPORT PAGE
   ═══════════════════════════════════════════════════ */

export default function PassportPage() {
  const { user } = useAuth()
  const [passportData, setPassportData] = useState<PassportData | null>(null)
  const [completedCount, setCompletedCount] = useState(0)
  const [stageCertificates, setStageCertificates] = useState<number[]>([])
  const [stageProgressList, setStageProgressList] = useState<StageProgress[]>([])
  const printRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!user) return

    // Load passport data from localStorage profile extras + tool data
    try {
      const extra = JSON.parse(localStorage.getItem('s4c_profile_extra') || '{}')
      const progress = getProgress(user.id)

      // Try to pull metrics from completed tool data
      const tamData = progress['tam-calculator']?.data
      const ltvData = progress['ltv-calculator']?.data || progress['unit-economics']?.data
      const cacData = progress['unit-economics']?.data
      const mrrData = progress['financial-projections']?.data || progress['unit-economics']?.data

      const hasData = user.startup || extra.vertical || extra.country

      if (hasData || Object.keys(progress).length > 0) {
        setPassportData({
          startupName: user.startup || '',
          vertical: extra.vertical || '',
          country: extra.country || '',
          founderName: user.name || '',
          teamSize: extra.teamSize ? Number(extra.teamSize) : 0,
          tam: (tamData?.tam as string) || extra.tam || '',
          ltv: (ltvData?.ltv as string) || extra.ltv || '',
          cac: (cacData?.cac as string) || extra.cac || '',
          mrr: (mrrData?.mrr as string) || extra.mrr || '',
          payingCustomers: extra.payingCustomers ? Number(extra.payingCustomers) : 0,
          unitEconomics: (cacData?.unitEconomics as string) || extra.unitEconomics || '',
          runway: (mrrData?.runway as string) || extra.runway || '',
        })
      }

      // Calculate tool progress per stage
      const completed = Object.values(progress).filter((v) => v.completed)
      setCompletedCount(completed.length)

      const completedIds = new Set(
        Object.entries(progress)
          .filter(([, v]) => v.completed)
          .map(([k]) => k)
      )

      // Stage progress
      const stageList: StageProgress[] = []
      const certs: number[] = []

      for (const stageNum of [1, 2, 3, 4] as const) {
        const stageTools = TOOLS.filter((t) => t.stage === stageNum)
        const stageCompleted = stageTools.filter((t) => completedIds.has(t.id)).length
        const meta = STAGE_META[stageNum]

        stageList.push({
          stage: stageNum,
          name: meta.name,
          color: meta.color,
          total: stageTools.length,
          completed: stageCompleted,
        })

        if (stageTools.length > 0 && stageTools.every((t) => completedIds.has(t.id))) {
          certs.push(stageNum)
        }
      }

      setStageProgressList(stageList)
      setStageCertificates(certs)
    } catch {
      // ignore
    }
  }, [user])

  const handlePrint = useCallback(() => {
    window.print()
  }, [])

  if (!user) return null

  const diagnosticScore = user.diagnosticScore ?? 0
  const stageNum = user.stage ? Number(user.stage) : 1
  const stageMeta = STAGE_META[stageNum as 1 | 2 | 3 | 4] || STAGE_META[1]
  const totalTools = TOOLS.length

  // Empty state
  if (!passportData && !diagnosticScore) {
    return (
      <div style={{ padding: '2rem 1.5rem', maxWidth: 700, margin: '0 auto' }}>
        <Link
          href="/tools"
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.375rem',
            fontFamily: 'var(--font-body)',
            fontSize: '0.8125rem',
            color: 'var(--color-text-muted)',
            textDecoration: 'none',
            marginBottom: '1.5rem',
          }}
        >
          <ArrowLeft size={14} />
          Volver al dashboard
        </Link>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          style={{
            textAlign: 'center',
            padding: '4rem 2rem',
            borderRadius: 20,
            background: 'var(--color-bg-card)',
            border: '1px solid var(--color-border)',
          }}
        >
          <div
            style={{
              width: 64,
              height: 64,
              borderRadius: 16,
              background: 'rgba(5,150,105,0.08)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 1.5rem',
            }}
          >
            <Award size={28} color="#059669" />
          </div>
          <h1
            style={{
              fontFamily: 'var(--font-heading)',
              fontSize: '1.5rem',
              fontWeight: 800,
              color: 'var(--color-text-primary)',
              marginBottom: '0.75rem',
            }}
          >
            Startup Passport
          </h1>
          <p
            style={{
              fontFamily: 'var(--font-body)',
              fontSize: '0.9375rem',
              color: 'var(--color-text-secondary)',
              maxWidth: 420,
              margin: '0 auto',
              lineHeight: 1.6,
            }}
          >
            Completa el diagnóstico para generar tu Startup Passport
          </p>
          <Link
            href="/tools"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.5rem',
              marginTop: '1.5rem',
              padding: '0.75rem 1.5rem',
              borderRadius: 10,
              background: '#059669',
              color: 'white',
              fontFamily: 'var(--font-body)',
              fontSize: '0.875rem',
              fontWeight: 600,
              textDecoration: 'none',
              boxShadow: '0 2px 10px rgba(5,150,105,0.25)',
            }}
          >
            Ir al diagnóstico
          </Link>
        </motion.div>
      </div>
    )
  }

  return (
    <>
      {/* Print styles injected */}
      <style dangerouslySetInnerHTML={{ __html: PRINT_STYLE }} />

      <div style={{ padding: '2rem 1.5rem', maxWidth: 800, margin: '0 auto' }}>
        {/* Back link */}
        <div className="no-print">
          <Link
            href="/tools"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.375rem',
              fontFamily: 'var(--font-body)',
              fontSize: '0.8125rem',
              color: 'var(--color-text-muted)',
              textDecoration: 'none',
              marginBottom: '1.5rem',
            }}
          >
            <ArrowLeft size={14} />
            Volver al dashboard
          </Link>
        </div>

        {/* ═══ Printable Passport Area ═══ */}
        <div id="passport-printable" ref={printRef}>
          {/* ── Passport Card ── */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            style={{
              borderRadius: 24,
              background: 'var(--color-bg-card)',
              border: `2px solid ${stageMeta.color}30`,
              overflow: 'hidden',
              boxShadow: '0 4px 30px rgba(0,0,0,0.06)',
              marginBottom: '1.5rem',
            }}
          >
            {/* Header band */}
            <div
              style={{
                background: `linear-gradient(135deg, ${stageMeta.color}, ${stageMeta.color}CC)`,
                padding: '1.5rem 2rem',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                flexWrap: 'wrap',
                gap: '1rem',
              }}
            >
              <div>
                <div
                  style={{
                    fontFamily: 'var(--font-mono)',
                    fontSize: '0.625rem',
                    fontWeight: 700,
                    color: 'rgba(255,255,255,0.7)',
                    textTransform: 'uppercase',
                    letterSpacing: '0.1em',
                    marginBottom: '0.25rem',
                  }}
                >
                  Startup Passport
                </div>
                <div
                  style={{
                    fontFamily: 'var(--font-heading)',
                    fontSize: '1.5rem',
                    fontWeight: 800,
                    color: 'white',
                  }}
                >
                  {passportData?.startupName || user.startup || 'Mi Startup'}
                </div>
                {passportData?.vertical && (
                  <div
                    style={{
                      fontFamily: 'var(--font-body)',
                      fontSize: '0.8125rem',
                      color: 'rgba(255,255,255,0.8)',
                      marginTop: '0.25rem',
                    }}
                  >
                    {LATAM_VERTICALS[passportData.vertical] || passportData.vertical}
                  </div>
                )}
              </div>
              <div
                style={{
                  padding: '0.375rem 0.875rem',
                  borderRadius: 9999,
                  background: 'rgba(255,255,255,0.2)',
                  backdropFilter: 'blur(8px)',
                  fontFamily: 'var(--font-mono)',
                  fontSize: '0.6875rem',
                  fontWeight: 700,
                  color: 'white',
                }}
              >
                {stageMeta.name}
              </div>
            </div>

            {/* Body */}
            <div style={{ padding: '2rem' }}>
              {/* Top section: info + score */}
              <div
                style={{
                  display: 'flex',
                  gap: '2rem',
                  alignItems: 'flex-start',
                  flexWrap: 'wrap',
                  marginBottom: '2rem',
                }}
              >
                {/* Left: founder info */}
                <div style={{ flex: 1, minWidth: 200 }}>
                  <div style={{ marginBottom: '1rem' }}>
                    <div
                      style={{
                        fontFamily: 'var(--font-mono)',
                        fontSize: '0.625rem',
                        color: 'var(--color-text-muted)',
                        textTransform: 'uppercase',
                        letterSpacing: '0.05em',
                        marginBottom: 4,
                      }}
                    >
                      Founder
                    </div>
                    <div
                      style={{
                        fontFamily: 'var(--font-heading)',
                        fontSize: '1.125rem',
                        fontWeight: 700,
                        color: 'var(--color-text-primary)',
                      }}
                    >
                      {passportData?.founderName || user.name}
                    </div>
                  </div>

                  <div
                    style={{
                      display: 'grid',
                      gridTemplateColumns: '1fr 1fr',
                      gap: '0.75rem',
                    }}
                  >
                    <div>
                      <div
                        style={{
                          fontFamily: 'var(--font-mono)',
                          fontSize: '0.625rem',
                          color: 'var(--color-text-muted)',
                          textTransform: 'uppercase',
                          letterSpacing: '0.05em',
                          marginBottom: 4,
                          display: 'flex',
                          alignItems: 'center',
                          gap: '0.25rem',
                        }}
                      >
                        <Briefcase size={10} />
                        Vertical
                      </div>
                      <div
                        style={{
                          fontFamily: 'var(--font-body)',
                          fontSize: '0.8125rem',
                          fontWeight: 600,
                          color: 'var(--color-text-primary)',
                        }}
                      >
                        {LATAM_VERTICALS[passportData?.vertical || ''] || passportData?.vertical || '—'}
                      </div>
                    </div>
                    <div>
                      <div
                        style={{
                          fontFamily: 'var(--font-mono)',
                          fontSize: '0.625rem',
                          color: 'var(--color-text-muted)',
                          textTransform: 'uppercase',
                          letterSpacing: '0.05em',
                          marginBottom: 4,
                          display: 'flex',
                          alignItems: 'center',
                          gap: '0.25rem',
                        }}
                      >
                        <Globe size={10} />
                        País
                      </div>
                      <div
                        style={{
                          fontFamily: 'var(--font-body)',
                          fontSize: '0.8125rem',
                          fontWeight: 600,
                          color: 'var(--color-text-primary)',
                        }}
                      >
                        {passportData?.country || '—'}
                      </div>
                    </div>
                    <div>
                      <div
                        style={{
                          fontFamily: 'var(--font-mono)',
                          fontSize: '0.625rem',
                          color: 'var(--color-text-muted)',
                          textTransform: 'uppercase',
                          letterSpacing: '0.05em',
                          marginBottom: 4,
                        }}
                      >
                        Etapa actual
                      </div>
                      <div
                        style={{
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '0.375rem',
                          padding: '0.125rem 0.625rem',
                          borderRadius: 9999,
                          background: `${stageMeta.color}15`,
                          border: `1px solid ${stageMeta.color}30`,
                        }}
                      >
                        <div
                          style={{
                            width: 6,
                            height: 6,
                            borderRadius: '50%',
                            background: stageMeta.color,
                          }}
                        />
                        <span
                          style={{
                            fontFamily: 'var(--font-body)',
                            fontSize: '0.75rem',
                            fontWeight: 700,
                            color: stageMeta.color,
                          }}
                        >
                          {stageMeta.name}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Right: diagnostic score */}
                <div style={{ textAlign: 'center' }}>
                  <div
                    style={{
                      fontFamily: 'var(--font-mono)',
                      fontSize: '0.625rem',
                      color: 'var(--color-text-muted)',
                      textTransform: 'uppercase',
                      letterSpacing: '0.05em',
                      marginBottom: '0.75rem',
                    }}
                  >
                    Puntaje diagnóstico
                  </div>
                  <CircularProgress score={diagnosticScore} size={110} />
                </div>
              </div>
            </div>
          </motion.div>

          {/* ── Tools Progress by Stage ── */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            style={{
              borderRadius: 20,
              background: 'var(--color-bg-card)',
              border: '1px solid var(--color-border)',
              padding: '1.5rem 2rem',
              marginBottom: '1.5rem',
              boxShadow: '0 2px 16px rgba(0,0,0,0.04)',
            }}
          >
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                marginBottom: '1.25rem',
              }}
            >
              <h2
                style={{
                  fontFamily: 'var(--font-heading)',
                  fontSize: '1.0625rem',
                  fontWeight: 800,
                  color: 'var(--color-text-primary)',
                  margin: 0,
                }}
              >
                Progreso por etapa
              </h2>
              <span
                style={{
                  fontFamily: 'var(--font-mono)',
                  fontSize: '0.75rem',
                  fontWeight: 700,
                  color: '#059669',
                  padding: '0.25rem 0.625rem',
                  borderRadius: 9999,
                  background: 'rgba(5,150,105,0.08)',
                }}
              >
                {completedCount}/{totalTools} herramientas
              </span>
            </div>

            {/* Overall progress bar */}
            <div style={{ marginBottom: '1.5rem' }}>
              <div
                style={{
                  height: 8,
                  borderRadius: 4,
                  background: 'rgba(5,150,105,0.10)',
                  overflow: 'hidden',
                }}
              >
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${totalTools > 0 ? (completedCount / totalTools) * 100 : 0}%` }}
                  transition={{ duration: 1, ease: 'easeOut' }}
                  style={{
                    height: '100%',
                    borderRadius: 4,
                    background: 'linear-gradient(90deg, #059669, #34D399)',
                  }}
                />
              </div>
            </div>

            {/* Per-stage progress */}
            {stageProgressList.map((sp) => (
              <StageProgressBar key={sp.stage} stage={sp} />
            ))}
          </motion.div>

          {/* ── Key Metrics ── */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            style={{
              borderRadius: 20,
              background: 'var(--color-bg-card)',
              border: '1px solid var(--color-border)',
              padding: '1.5rem 2rem',
              marginBottom: '1.5rem',
              boxShadow: '0 2px 16px rgba(0,0,0,0.04)',
            }}
          >
            <h2
              style={{
                fontFamily: 'var(--font-heading)',
                fontSize: '1.0625rem',
                fontWeight: 800,
                color: 'var(--color-text-primary)',
                margin: '0 0 1rem 0',
              }}
            >
              Métricas clave
            </h2>
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))',
                gap: '0.75rem',
              }}
            >
              <MetricCard icon={Target} label="TAM" value={passportData?.tam || '—'} color="#6366F1" />
              <MetricCard icon={DollarSign} label="LTV" value={passportData?.ltv || '—'} color="#059669" />
              <MetricCard icon={DollarSign} label="CAC" value={passportData?.cac || '—'} color="#D97706" />
              <MetricCard icon={TrendingUp} label="MRR" value={passportData?.mrr || '—'} color="#0891B2" />
              <MetricCard
                icon={Users}
                label="Equipo"
                value={passportData?.teamSize ? `${passportData.teamSize} personas` : '—'}
                color="#7C3AED"
              />
              <MetricCard
                icon={UserCheck}
                label="Clientes pagando"
                value={passportData?.payingCustomers || '—'}
                color="#DC2626"
              />
              {passportData?.unitEconomics && (
                <MetricCard
                  icon={TrendingUp}
                  label="Unit Economics"
                  value={passportData.unitEconomics}
                  color="#059669"
                />
              )}
              {passportData?.runway && (
                <MetricCard
                  icon={DollarSign}
                  label="Runway"
                  value={passportData.runway}
                  color="#6366F1"
                />
              )}
            </div>
          </motion.div>

          {/* ── Stage Certificates ── */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            style={{
              borderRadius: 20,
              background: 'var(--color-bg-card)',
              border: '1px solid var(--color-border)',
              padding: '1.5rem 2rem',
              marginBottom: '1.5rem',
              boxShadow: '0 2px 16px rgba(0,0,0,0.04)',
            }}
          >
            <h2
              style={{
                fontFamily: 'var(--font-heading)',
                fontSize: '1.0625rem',
                fontWeight: 800,
                color: 'var(--color-text-primary)',
                margin: '0 0 1rem 0',
              }}
            >
              Certificados de etapa
            </h2>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))', gap: '0.75rem' }}>
              {([1, 2, 3, 4] as const).map((s) => {
                const meta = STAGE_META[s]
                const earned = stageCertificates.includes(s)
                const stageInfo = stageProgressList.find((sp) => sp.stage === s)
                const pct = stageInfo && stageInfo.total > 0
                  ? Math.round((stageInfo.completed / stageInfo.total) * 100)
                  : 0

                return (
                  <motion.div
                    key={s}
                    initial={{ scale: 0.9, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ delay: 0.3 + s * 0.1 }}
                    style={{
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      gap: '0.5rem',
                      padding: '1.25rem 1rem',
                      borderRadius: 16,
                      background: earned ? `${meta.color}08` : 'var(--color-bg-primary)',
                      border: `2px solid ${earned ? meta.color : 'var(--color-border)'}`,
                      opacity: earned ? 1 : 0.5,
                      position: 'relative',
                      overflow: 'hidden',
                    }}
                  >
                    {/* Badge glow for earned */}
                    {earned && (
                      <div
                        style={{
                          position: 'absolute',
                          top: -20,
                          right: -20,
                          width: 60,
                          height: 60,
                          borderRadius: '50%',
                          background: `${meta.color}15`,
                          filter: 'blur(20px)',
                        }}
                      />
                    )}
                    <div
                      style={{
                        width: 44,
                        height: 44,
                        borderRadius: 12,
                        background: earned ? `${meta.color}15` : 'var(--color-bg-primary)',
                        border: `1.5px solid ${earned ? meta.color + '40' : 'var(--color-border)'}`,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                      }}
                    >
                      <Award
                        size={22}
                        color={earned ? meta.color : 'var(--color-text-muted)'}
                        strokeWidth={earned ? 2.5 : 1.5}
                      />
                    </div>
                    <span
                      style={{
                        fontFamily: 'var(--font-body)',
                        fontSize: '0.75rem',
                        fontWeight: 700,
                        color: earned ? meta.color : 'var(--color-text-muted)',
                        textAlign: 'center',
                      }}
                    >
                      {meta.name}
                    </span>
                    <span
                      style={{
                        fontFamily: 'var(--font-mono)',
                        fontSize: '0.625rem',
                        color: earned ? meta.color : 'var(--color-text-muted)',
                      }}
                    >
                      {earned ? 'Completado' : `${pct}%`}
                    </span>
                  </motion.div>
                )
              })}
            </div>
          </motion.div>
        </div>

        {/* ── Download / Print Button ── */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.5 }}
          className="no-print"
          style={{
            display: 'flex',
            gap: '0.75rem',
            flexWrap: 'wrap',
          }}
        >
          <button
            onClick={handlePrint}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.5rem',
              padding: '0.75rem 1.75rem',
              borderRadius: 12,
              background: stageMeta.color,
              color: 'white',
              fontFamily: 'var(--font-body)',
              fontSize: '0.875rem',
              fontWeight: 600,
              border: 'none',
              cursor: 'pointer',
              boxShadow: `0 2px 12px ${stageMeta.color}40`,
              transition: 'all 0.2s',
            }}
          >
            <Printer size={16} />
            Descargar Passport
          </button>
          <button
            onClick={handlePrint}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.5rem',
              padding: '0.75rem 1.75rem',
              borderRadius: 12,
              background: 'var(--color-bg-primary)',
              color: 'var(--color-text-primary)',
              fontFamily: 'var(--font-body)',
              fontSize: '0.875rem',
              fontWeight: 600,
              border: '1px solid var(--color-border)',
              cursor: 'pointer',
              transition: 'all 0.2s',
            }}
          >
            <Download size={16} />
            Imprimir
          </button>
        </motion.div>
      </div>
    </>
  )
}
