'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ChevronRight, Download, CheckCircle2, AlertCircle, Info } from 'lucide-react'
import { useToolState } from '@/lib/useToolState'
import type { ToolComponentProps } from './ToolPage'

const TRL_QUESTIONS = [
  { id: 'q1', trl: 1, text: '¿Has identificado y documentado los principios básicos de tu tecnología?', domain: 'Ciencia Básica' },
  { id: 'q2', trl: 2, text: '¿Has formulado el concepto tecnológico y su aplicación práctica?', domain: 'Concepto Formulado' },
  { id: 'q3', trl: 3, text: '¿Has realizado una prueba de concepto analítica o experimental en laboratorio?', domain: 'Prueba de Concepto' },
  { id: 'q4', trl: 4, text: '¿Tienes un componente o sistema validado en entorno de laboratorio controlado?', domain: 'Validación Lab' },
  { id: 'q5', trl: 5, text: '¿Has validado el componente o sistema en un entorno relevante (fuera del laboratorio)?', domain: 'Validación Entorno Relevante' },
  { id: 'q6', trl: 6, text: '¿Tienes un prototipo o sistema demostrado en entorno relevante?', domain: 'Prototipo Demostrado' },
  { id: 'q7', trl: 7, text: '¿Tienes un prototipo del sistema completo demostrado en entorno operacional?', domain: 'Sistema Demostrado' },
  { id: 'q8', trl: 8, text: '¿Está tu sistema completo calificado y demostrado en el entorno final?', domain: 'Sistema Calificado' },
  { id: 'q9', trl: 9, text: '¿Está tu tecnología probada exitosamente a escala comercial?', domain: 'Escala Comercial' },
]

const CRL_QUESTIONS = [
  { id: 'c1', crl: 1, text: '¿Has identificado al menos un segmento de cliente específico con un problema definido?', domain: 'Descubrimiento' },
  { id: 'c2', crl: 2, text: '¿Has realizado más de 20 entrevistas con clientes potenciales?', domain: 'Validación del Problema' },
  { id: 'c3', crl: 3, text: '¿Tienes Cartas de Intención (LOIs) firmadas con clientes potenciales?', domain: 'LOIs' },
  { id: 'c4', crl: 4, text: '¿Has realizado al menos un piloto no pagado con un cliente real?', domain: 'Piloto' },
  { id: 'c5', crl: 5, text: '¿Has completado al menos un piloto pagado con resultados documentados?', domain: 'Piloto Pagado' },
  { id: 'c6', crl: 6, text: '¿Tienes contratos B2B activos con ingresos recurrentes o un Offtake Agreement?', domain: 'Tracción Comercial' },
]

const TRL_DESC: Record<number, { label: string; color: string; advice: string }> = {
  1: { label: 'Principios básicos observados', color: '#6B7280', advice: 'Enfócate en documentar los principios científicos y publicar resultados preliminares.' },
  2: { label: 'Concepto tecnológico formulado', color: '#7C3AED', advice: 'Desarrolla un análisis de viabilidad y formula hipótesis testables.' },
  3: { label: 'Prueba de concepto experimental', color: '#7C3AED', advice: 'Ejecuta experimentos controlados para probar la viabilidad técnica.' },
  4: { label: 'Validado en laboratorio', color: '#0891B2', advice: 'Construye un prototipo básico y valida en entorno de laboratorio.' },
  5: { label: 'Validado en entorno relevante', color: '#0891B2', advice: 'Prepara tu tecnología para demostración fuera del laboratorio.' },
  6: { label: 'Prototipo demostrado', color: '#059669', advice: 'Busca socios de piloto industrial y estructura tu primer PoC pagado.' },
  7: { label: 'Sistema demostrado operacionalmente', color: '#059669', advice: 'Documenta resultados y prepara para Due Diligence técnico de inversores.' },
  8: { label: 'Sistema calificado y listo', color: '#D97706', advice: 'Prepara el paquete de bancabilidad y busca capital FOAK.' },
  9: { label: 'Tecnología probada comercialmente', color: '#D97706', advice: 'Escala agresivamente. Busca deuda para proyectos y nuevos mercados.' },
}

export default function TRLCalculator({ userId, onComplete, onGenerateReport }: ToolComponentProps) {
  const [answers, setAnswers] = useToolState(userId, 'trl-calculator', {
    trlAnswers: {} as Record<string, boolean | null>,
    crlAnswers: {} as Record<string, boolean | null>,
  })
  const { trlAnswers, crlAnswers } = answers
  const setTrlAnswers = (updater: (prev: Record<string, boolean | null>) => Record<string, boolean | null>) =>
    setAnswers((prev) => ({ ...prev, trlAnswers: updater(prev.trlAnswers) }))
  const setCrlAnswers = (updater: (prev: Record<string, boolean | null>) => Record<string, boolean | null>) =>
    setAnswers((prev) => ({ ...prev, crlAnswers: updater(prev.crlAnswers) }))
  const [tab, setTab] = useState<'trl' | 'crl'>('trl')
  const [showResults, setShowResults] = useState(false)

  const trlScore = TRL_QUESTIONS.reduce((max, q) => {
    if (trlAnswers[q.id] === true) return Math.max(max, q.trl)
    return max
  }, 0)

  const crlScore = CRL_QUESTIONS.reduce((max, q) => {
    if (crlAnswers[q.id] === true) return Math.max(max, q.crl)
    return max
  }, 0)

  const trlComplete = TRL_QUESTIONS.every((q) => trlAnswers[q.id] !== undefined)
  const crlComplete = CRL_QUESTIONS.every((q) => crlAnswers[q.id] !== undefined)

  const handleReport = () => {
    const trlInfo = TRL_DESC[trlScore || 1]
    const crlInfo = TRL_DESC[crlScore || 1]
    const content = `
EVALUACIÓN DE MADUREZ TECNOLÓGICA Y COMERCIAL

TRL — Technology Readiness Level
Score: ${trlScore || 0}/9
Nivel: ${trlInfo?.label || 'No calculado'}

Respuestas TRL:
${TRL_QUESTIONS.map((q) => `  [${trlAnswers[q.id] === true ? '✓' : trlAnswers[q.id] === false ? '✗' : '—'}] TRL ${q.trl}: ${q.domain} — ${q.text}`).join('\n')}

Análisis y Recomendaciones TRL:
${trlInfo?.advice || ''}

---

CRL — Commercial Readiness Level
Score: ${crlScore || 0}/6
Nivel: ${CRL_QUESTIONS[Math.max(0, crlScore - 1)]?.domain || 'No calculado'}

Respuestas CRL:
${CRL_QUESTIONS.map((q) => `  [${crlAnswers[q.id] === true ? '✓' : crlAnswers[q.id] === false ? '✗' : '—'}] CRL ${q.crl}: ${q.domain} — ${q.text}`).join('\n')}

---

Análisis de Brechas:
${trlScore > 0 && crlScore > 0 ? `TRL-CRL Gap: ${Math.abs(trlScore * (6/9) - crlScore)} puntos. ${trlScore * (6/9) > crlScore ? 'Tu tecnología está más avanzada que tu validación comercial. Prioriza entrevistas con clientes y primeros pilotos.' : 'Tu tracción comercial supera tu madurez técnica. Acelera el desarrollo del producto.'}` : 'Completa ambas evaluaciones para ver el análisis de brechas.'}

Prioridades de Acción:
${TRL_QUESTIONS.filter((q) => trlAnswers[q.id] === false).slice(0, 3).map((q) => `  → TRL ${q.trl}: ${q.domain}`).join('\n') || '  Sin brechas tecnológicas identificadas.'}
    `.trim()
    onGenerateReport(content)
    onComplete()
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
      {/* Tabs */}
      <div
        style={{
          display: 'flex',
          gap: '0.5rem',
          background: 'var(--color-bg-card)',
          borderRadius: 16,
          border: '1px solid var(--color-border)',
          padding: '0.875rem',
        }}
      >
        {(['trl', 'crl'] as const).map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            style={{
              flex: 1,
              padding: '0.75rem 1rem',
              borderRadius: 10,
              border: 'none',
              background: tab === t ? '#7C3AED' : 'transparent',
              color: tab === t ? 'white' : 'var(--color-text-secondary)',
              fontFamily: 'var(--font-heading)',
              fontSize: '0.875rem',
              fontWeight: 600,
              cursor: 'pointer',
              transition: 'all 0.2s',
            }}
          >
            {t.toUpperCase()} — {t === 'trl' ? 'Madurez Tecnológica' : 'Madurez Comercial'}
            {t === 'trl' && trlComplete && (
              <span style={{ marginLeft: '0.5rem', fontSize: '0.75rem' }}>✓</span>
            )}
            {t === 'crl' && crlComplete && (
              <span style={{ marginLeft: '0.5rem', fontSize: '0.75rem' }}>✓</span>
            )}
          </button>
        ))}
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={tab}
          initial={{ opacity: 0, x: 10 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -10 }}
          transition={{ duration: 0.2 }}
          style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}
        >
          {tab === 'trl'
            ? TRL_QUESTIONS.map((q) => (
                <QuestionCard
                  key={q.id}
                  id={q.id}
                  text={q.text}
                  domain={q.domain}
                  level={`TRL ${q.trl}`}
                  color="#7C3AED"
                  answer={trlAnswers[q.id] ?? null}
                  onAnswer={(v) => setTrlAnswers((p) => ({ ...p, [q.id]: v }))}
                />
              ))
            : CRL_QUESTIONS.map((q) => (
                <QuestionCard
                  key={q.id}
                  id={q.id}
                  text={q.text}
                  domain={q.domain}
                  level={`CRL ${q.crl}`}
                  color="#059669"
                  answer={crlAnswers[q.id] ?? null}
                  onAnswer={(v) => setCrlAnswers((p) => ({ ...p, [q.id]: v }))}
                />
              ))}
        </motion.div>
      </AnimatePresence>

      {/* Scores */}
      {(trlComplete || crlComplete) && (
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          style={{
            background: 'var(--color-bg-card)',
            borderRadius: 16,
            border: '1px solid var(--color-border)',
            padding: '1.5rem',
            boxShadow: 'var(--shadow-card)',
          }}
        >
          <h3 style={{ fontFamily: 'var(--font-heading)', fontSize: '1rem', fontWeight: 700, color: 'var(--color-text-primary)', marginBottom: '1.25rem' }}>
            Resultados parciales
          </h3>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1.25rem' }}>
            <ScoreDisplay
              label="TRL"
              score={trlScore}
              max={9}
              color="#7C3AED"
              description={TRL_DESC[trlScore]?.label || 'Sin datos'}
              complete={trlComplete}
            />
            <ScoreDisplay
              label="CRL"
              score={crlScore}
              max={6}
              color="#059669"
              description={CRL_QUESTIONS[Math.max(0, crlScore - 1)]?.domain || 'Sin datos'}
              complete={crlComplete}
            />
          </div>
          {trlComplete && crlScore > 0 && (
            <div
              style={{
                padding: '0.875rem',
                borderRadius: 10,
                background: 'rgba(5,150,105,0.05)',
                border: '1px solid rgba(5,150,105,0.12)',
                marginBottom: '1.25rem',
              }}
            >
              <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'flex-start' }}>
                <Info size={14} color="#059669" style={{ flexShrink: 0, marginTop: 2 }} />
                <p style={{ fontFamily: 'var(--font-body)', fontSize: '0.8125rem', lineHeight: 1.6, color: 'var(--color-text-secondary)' }}>
                  <strong>Recomendación:</strong> {TRL_DESC[trlScore || 1]?.advice}
                </p>
              </div>
            </div>
          )}
          {trlComplete && crlComplete && (
            <button
              onClick={handleReport}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '0.5rem',
                width: '100%',
                padding: '0.875rem',
                borderRadius: 12,
                background: '#7C3AED',
                color: 'white',
                fontFamily: 'var(--font-body)',
                fontSize: '0.9375rem',
                fontWeight: 600,
                border: 'none',
                cursor: 'pointer',
                boxShadow: '0 4px 14px rgba(124,58,237,0.3)',
                transition: 'all 0.2s',
              }}
              onMouseEnter={(e) => (e.currentTarget.style.background = '#6D28D9')}
              onMouseLeave={(e) => (e.currentTarget.style.background = '#7C3AED')}
            >
              <Download size={17} />
              Generar Reporte TRL/CRL
            </button>
          )}
        </motion.div>
      )}
    </div>
  )
}

function QuestionCard({
  id, text, domain, level, color, answer, onAnswer,
}: {
  id: string; text: string; domain: string; level: string; color: string;
  answer: boolean | null; onAnswer: (v: boolean) => void;
}) {
  return (
    <div
      style={{
        background: 'var(--color-bg-card)',
        borderRadius: 12,
        border: `1px solid ${answer === true ? color + '30' : answer === false ? 'var(--color-border)' : 'var(--color-border)'}`,
        padding: '1.125rem 1.25rem',
        transition: 'all 0.2s',
      }}
    >
      <div style={{ display: 'flex', gap: '0.875rem', alignItems: 'flex-start' }}>
        <div
          style={{
            padding: '0.2rem 0.5rem',
            borderRadius: 6,
            background: answer === true ? color + '12' : 'var(--color-bg-muted)',
            fontFamily: 'var(--font-mono)',
            fontSize: '0.625rem',
            fontWeight: 700,
            color: answer === true ? color : 'var(--color-text-muted)',
            flexShrink: 0,
            whiteSpace: 'nowrap',
          }}
        >
          {level}
        </div>
        <div style={{ flex: 1 }}>
          <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.6875rem', color: 'var(--color-text-muted)', marginBottom: '0.375rem' }}>
            {domain}
          </div>
          <p style={{ fontFamily: 'var(--font-body)', fontSize: '0.875rem', lineHeight: 1.55, color: 'var(--color-text-primary)', marginBottom: '0.875rem' }}>
            {text}
          </p>
          <div style={{ display: 'flex', gap: '0.5rem' }}>
            <button
              onClick={() => onAnswer(true)}
              style={{
                padding: '0.4375rem 1rem',
                borderRadius: 8,
                border: `1.5px solid ${answer === true ? color : 'var(--color-border)'}`,
                background: answer === true ? color + '10' : 'var(--color-bg-card)',
                color: answer === true ? color : 'var(--color-text-secondary)',
                fontFamily: 'var(--font-body)',
                fontSize: '0.8125rem',
                fontWeight: answer === true ? 600 : 400,
                cursor: 'pointer',
                transition: 'all 0.15s',
                display: 'flex', alignItems: 'center', gap: '0.375rem',
              }}
            >
              {answer === true && <CheckCircle2 size={13} />}
              Sí
            </button>
            <button
              onClick={() => onAnswer(false)}
              style={{
                padding: '0.4375rem 1rem',
                borderRadius: 8,
                border: `1.5px solid ${answer === false ? '#DC2626' : 'var(--color-border)'}`,
                background: answer === false ? 'rgba(220,38,38,0.05)' : 'var(--color-bg-card)',
                color: answer === false ? '#DC2626' : 'var(--color-text-secondary)',
                fontFamily: 'var(--font-body)',
                fontSize: '0.8125rem',
                fontWeight: answer === false ? 600 : 400,
                cursor: 'pointer',
                transition: 'all 0.15s',
                display: 'flex', alignItems: 'center', gap: '0.375rem',
              }}
            >
              {answer === false && <AlertCircle size={13} />}
              No
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

function ScoreDisplay({ label, score, max, color, description, complete }: {
  label: string; score: number; max: number; color: string; description: string; complete: boolean;
}) {
  const pct = (score / max) * 100
  return (
    <div style={{ padding: '1rem', borderRadius: 12, background: color + '08', border: `1px solid ${color}18` }}>
      <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.625rem', fontWeight: 700, color, textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.5rem' }}>
        {label}
      </div>
      <div style={{ fontFamily: 'var(--font-mono)', fontSize: '2rem', fontWeight: 700, color, lineHeight: 1 }}>
        {complete ? score : '—'}
        <span style={{ fontSize: '0.875rem', color: 'var(--color-text-muted)', fontWeight: 400 }}>/{max}</span>
      </div>
      <p style={{ fontFamily: 'var(--font-body)', fontSize: '0.75rem', color: 'var(--color-text-secondary)', marginTop: '0.375rem', lineHeight: 1.4 }}>
        {complete ? description : 'Completa las preguntas'}
      </p>
      {complete && (
        <div style={{ marginTop: '0.625rem', height: 4, borderRadius: 2, background: color + '20' }}>
          <div style={{ height: '100%', borderRadius: 2, background: color, width: `${pct}%`, transition: 'width 0.6s ease' }} />
        </div>
      )}
    </div>
  )
}
