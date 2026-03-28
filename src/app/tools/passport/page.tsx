'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { ArrowLeft, Download, Award, Users, DollarSign, Target, TrendingUp, UserCheck } from 'lucide-react'
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
}

function CircularProgress({ score, size = 100 }: { score: number; size?: number }) {
  const strokeWidth = 8
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
    <div
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
    </div>
  )
}

export default function PassportPage() {
  const { user } = useAuth()
  const [passportData, setPassportData] = useState<PassportData | null>(null)
  const [completedCount, setCompletedCount] = useState(0)
  const [stageCertificates, setStageCertificates] = useState<number[]>([])

  useEffect(() => {
    if (!user) return

    // Load passport data from localStorage profile extras
    try {
      const extra = JSON.parse(localStorage.getItem('s4c_profile_extra') || '{}')
      const hasData = user.startup || extra.vertical || extra.country

      if (hasData) {
        setPassportData({
          startupName: user.startup || '',
          vertical: extra.vertical || '',
          country: extra.country || '',
          founderName: user.name || '',
          teamSize: extra.teamSize ? Number(extra.teamSize) : 0,
          tam: extra.tam || '',
          ltv: extra.ltv || '',
          cac: extra.cac || '',
          mrr: extra.mrr || '',
          payingCustomers: extra.payingCustomers ? Number(extra.payingCustomers) : 0,
        })
      }
    } catch {
      // ignore
    }

    // Calculate tool progress
    const progress = getProgress(user.id)
    const completed = Object.values(progress).filter((v) => v.completed)
    setCompletedCount(completed.length)

    // Check stage certificates
    const certs: number[] = []
    const completedIds = new Set(
      Object.entries(progress)
        .filter(([, v]) => v.completed)
        .map(([k]) => k)
    )

    for (const stageNum of [1, 2, 3, 4] as const) {
      const stageTools = TOOLS.filter((t) => t.stage === stageNum)
      if (stageTools.length > 0 && stageTools.every((t) => completedIds.has(t.id))) {
        certs.push(stageNum)
      }
    }
    setStageCertificates(certs)
  }, [user])

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
            Completa el diagn&oacute;stico para generar tu Startup Passport
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
            Ir al diagn&oacute;stico
          </Link>
        </motion.div>
      </div>
    )
  }

  return (
    <div style={{ padding: '2rem 1.5rem', maxWidth: 800, margin: '0 auto' }}>
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

      {/* Passport Card */}
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
                    }}
                  >
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
                    }}
                  >
                    Pa&iacute;s
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
                    Etapa
                  </div>
                  <div
                    style={{
                      fontFamily: 'var(--font-body)',
                      fontSize: '0.8125rem',
                      fontWeight: 600,
                      color: stageMeta.color,
                    }}
                  >
                    {stageMeta.name}
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
                Puntaje diagn&oacute;stico
              </div>
              <CircularProgress score={diagnosticScore} size={110} />
            </div>
          </div>

          {/* Metrics grid */}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))',
              gap: '0.75rem',
              marginBottom: '2rem',
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
          </div>

          {/* Tools progress */}
          <div
            style={{
              padding: '1.25rem 1.5rem',
              borderRadius: 14,
              background: 'var(--color-bg-primary)',
              border: '1px solid var(--color-border)',
              marginBottom: '1.5rem',
            }}
          >
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                marginBottom: '0.625rem',
              }}
            >
              <span
                style={{
                  fontFamily: 'var(--font-body)',
                  fontSize: '0.8125rem',
                  fontWeight: 600,
                  color: 'var(--color-text-primary)',
                }}
              >
                Herramientas completadas
              </span>
              <span
                style={{
                  fontFamily: 'var(--font-mono)',
                  fontSize: '0.75rem',
                  fontWeight: 700,
                  color: '#059669',
                }}
              >
                {completedCount}/{totalTools}
              </span>
            </div>
            <div style={{ height: 8, borderRadius: 4, background: 'rgba(5,150,105,0.12)' }}>
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${(completedCount / totalTools) * 100}%` }}
                transition={{ duration: 1, ease: 'easeOut' }}
                style={{
                  height: '100%',
                  borderRadius: 4,
                  background: 'linear-gradient(90deg, #059669, #34D399)',
                }}
              />
            </div>
          </div>

          {/* Stage certificates */}
          <div style={{ marginBottom: '1.5rem' }}>
            <div
              style={{
                fontFamily: 'var(--font-body)',
                fontSize: '0.8125rem',
                fontWeight: 600,
                color: 'var(--color-text-primary)',
                marginBottom: '0.75rem',
              }}
            >
              Certificados de etapa
            </div>
            <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
              {([1, 2, 3, 4] as const).map((s) => {
                const meta = STAGE_META[s]
                const earned = stageCertificates.includes(s)
                return (
                  <motion.div
                    key={s}
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ delay: s * 0.1 }}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.5rem',
                      padding: '0.5rem 1rem',
                      borderRadius: 10,
                      background: earned ? `${meta.color}12` : 'var(--color-bg-primary)',
                      border: `1px solid ${earned ? meta.color + '40' : 'var(--color-border)'}`,
                      opacity: earned ? 1 : 0.4,
                    }}
                  >
                    <Award size={16} color={earned ? meta.color : 'var(--color-text-muted)'} />
                    <span
                      style={{
                        fontFamily: 'var(--font-body)',
                        fontSize: '0.75rem',
                        fontWeight: 600,
                        color: earned ? meta.color : 'var(--color-text-muted)',
                      }}
                    >
                      {meta.name}
                    </span>
                  </motion.div>
                )
              })}
            </div>
          </div>

          {/* Export button */}
          <button
            onClick={() => alert('La descarga de PDF estar\u00e1 disponible pr\u00f3ximamente.')}
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
            <Download size={16} />
            Descargar PDF
          </button>
        </div>
      </motion.div>
    </div>
  )
}
