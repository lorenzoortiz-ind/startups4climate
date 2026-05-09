'use client'

import { useState } from 'react'
import { Plus, Trash2, CheckCircle2 } from 'lucide-react'
import { useToolState } from '@/lib/useToolState'
import type { ToolComponentProps } from './ToolPage'
import {
  ToolSection, ToolActionBar, ToolProgress,
  inputStyle, textareaStyle, labelStyle, btnSmall,
} from './shared'

interface ProblemScore {
  name: string
  urgency: number
  market: number
  willingness: number
  impact: number
}

interface Data {
  problems: ProblemScore[]
  selectedIndex: number | null
  justification: string
}

const DEFAULT: Data = {
  problems: [
    { name: '', urgency: 3, market: 3, willingness: 3, impact: 3 },
    { name: '', urgency: 3, market: 3, willingness: 3, impact: 3 },
    { name: '', urgency: 3, market: 3, willingness: 3, impact: 3 },
  ],
  selectedIndex: null,
  justification: '',
}

const ACCENT = '#16A34A'

const DIMENSIONS = [
  { key: 'urgency' as const, label: 'Urgencia', hint: '¿Qué tan doloroso es? ¿Con qué frecuencia ocurre?' },
  { key: 'market' as const, label: 'Mercado', hint: '¿Cuántas personas lo viven? ¿Hay masa crítica?' },
  { key: 'willingness' as const, label: 'Disposición a pagar', hint: '¿Pagarían por resolverlo? ¿Ya gastan en soluciones parciales?' },
  { key: 'impact' as const, label: 'Impacto climático/social', hint: '¿Qué tan relevante para un futuro sostenible?' },
]

function ScoreInput({ value, onChange }: { value: number; onChange: (v: number) => void }) {
  return (
    <div style={{ display: 'flex', gap: '0.25rem' }}>
      {[1, 2, 3, 4, 5].map(n => (
        <button
          key={n}
          onClick={() => onChange(n)}
          style={{
            width: 32, height: 32, borderRadius: 6,
            border: `1.5px solid ${n <= value ? ACCENT : 'var(--color-border)'}`,
            background: n <= value ? `${ACCENT}15` : 'transparent',
            color: n <= value ? ACCENT : 'var(--color-text-muted)',
            fontFamily: 'var(--font-heading)', fontSize: '0.8125rem', fontWeight: 700,
            cursor: 'pointer', transition: 'all 0.1s',
          }}
        >
          {n}
        </button>
      ))}
    </div>
  )
}

export default function ProblemSelection({ userId, onComplete, onGenerateReport }: ToolComponentProps) {
  const [data, setData] = useToolState<Data>(userId, 'problem-selection', DEFAULT)
  const [saved, setSaved] = useState(false)

  const totalScore = (p: ProblemScore) => p.urgency + p.market + p.willingness + p.impact

  const updateProblem = (i: number, field: keyof ProblemScore, value: string | number) =>
    setData(p => { const ps = [...p.problems]; ps[i] = { ...ps[i], [field]: value }; return { ...p, problems: ps } })

  const addProblem = () =>
    setData(p => ({ ...p, problems: [...p.problems, { name: '', urgency: 3, market: 3, willingness: 3, impact: 3 }] }))

  const removeProblem = (i: number) =>
    setData(p => ({
      ...p,
      problems: p.problems.filter((_, idx) => idx !== i),
      selectedIndex: p.selectedIndex === i ? null : p.selectedIndex !== null && p.selectedIndex > i ? p.selectedIndex - 1 : p.selectedIndex,
    }))

  const filledCount = [
    data.problems.filter(p => p.name.trim()).length > 0 ? 1 : 0,
    data.selectedIndex !== null ? 1 : 0,
    data.justification.trim() ? 1 : 0,
  ].filter(Boolean).length

  const sortedByScore = [...data.problems]
    .map((p, i) => ({ ...p, originalIndex: i, total: totalScore(p) }))
    .sort((a, b) => b.total - a.total)

  const handleReport = () => {
    const selected = data.selectedIndex !== null ? data.problems[data.selectedIndex] : null
    const content = `
SELECCIÓN DEL PROBLEMA

MATRIZ DE EVALUACIÓN:
${data.problems.map((p, i) => `
Problema ${i + 1}: ${p.name || '(Sin nombre)'}
  Urgencia: ${p.urgency}/5
  Mercado: ${p.market}/5
  Disposición a pagar: ${p.willingness}/5
  Impacto climático/social: ${p.impact}/5
  TOTAL: ${totalScore(p)}/20`).join('\n')}

PROBLEMA SELECCIONADO: ${selected?.name || '(No seleccionado)'}
Puntuación: ${selected ? `${totalScore(selected)}/20` : '—'}

JUSTIFICACIÓN: ${data.justification || '(No completada)'}
`.trim()
    onGenerateReport(content)
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
      <ToolProgress filled={filledCount} total={3} accentColor={ACCENT} />

      <ToolSection
        number={1}
        title="Evalúa cada problema"
        subtitle="Puntúa del 1 (mínimo) al 5 (máximo) en cada dimensión"
        insight="Metodología ICE adaptada con criterio de impacto: los mejores problemas para una startup de impacto tienen alta urgencia, mercado suficiente Y relevancia climática/social."
        insightSource="DE Step 0 (Aulet, MIT) · Matriz ICE"
        defaultOpen={true}
        accentColor={ACCENT}
      >
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          {data.problems.map((problem, i) => (
            <div key={i} style={{
              padding: '1rem 1.25rem', borderRadius: 12,
              border: `1.5px solid ${data.selectedIndex === i ? ACCENT : 'var(--color-border)'}`,
              background: data.selectedIndex === i ? `${ACCENT}05` : 'var(--color-bg-primary)',
              transition: 'all 0.2s',
            }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.875rem' }}>
                <input
                  value={problem.name}
                  onChange={e => updateProblem(i, 'name', e.target.value)}
                  placeholder={`Nombre corto del problema ${i + 1}`}
                  style={{
                    ...inputStyle, fontWeight: 600,
                    fontSize: '0.875rem', flex: 1, marginRight: '0.75rem',
                  }}
                />
                <div style={{
                  fontFamily: 'var(--font-heading)', fontSize: '1.125rem',
                  fontWeight: 700, color: ACCENT, minWidth: 48, textAlign: 'right',
                }}>
                  {totalScore(problem)}/20
                </div>
                {data.problems.length > 2 && (
                  <button onClick={() => removeProblem(i)} style={{ ...btnSmall, marginLeft: '0.5rem', color: '#EF4444' }}>
                    <Trash2 size={12} />
                  </button>
                )}
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.625rem' }}>
                {DIMENSIONS.map(dim => (
                  <div key={dim.key} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '0.75rem' }}>
                    <div style={{ minWidth: 180 }}>
                      <span style={{ fontFamily: 'var(--font-body)', fontSize: '0.8125rem', fontWeight: 600, color: 'var(--color-text-primary)' }}>
                        {dim.label}
                      </span>
                      <span style={{ fontFamily: 'var(--font-body)', fontSize: '0.6875rem', color: 'var(--color-text-muted)', display: 'block' }}>
                        {dim.hint}
                      </span>
                    </div>
                    <ScoreInput value={problem[dim.key]} onChange={v => updateProblem(i, dim.key, v)} />
                  </div>
                ))}
              </div>
            </div>
          ))}
          {data.problems.length < 8 && (
            <button onClick={addProblem} style={{
              ...btnSmall, color: ACCENT, borderColor: `${ACCENT}40`,
              borderStyle: 'dashed', padding: '0.625rem', borderRadius: 10, width: '100%', justifyContent: 'center',
            }}>
              <Plus size={14} /> Agregar problema
            </button>
          )}
        </div>
      </ToolSection>

      <ToolSection
        number={2}
        title="Selecciona el problema ganador"
        subtitle="Elige el que llevarás a Mapa de Empatía"
        defaultOpen={true}
        accentColor={ACCENT}
      >
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', marginBottom: '1rem' }}>
          {sortedByScore.map((problem, rank) => (
            <button
              key={problem.originalIndex}
              onClick={() => setData(p => ({ ...p, selectedIndex: problem.originalIndex }))}
              style={{
                display: 'flex', alignItems: 'center', gap: '0.75rem',
                padding: '0.75rem 1rem', borderRadius: 10,
                border: `1.5px solid ${data.selectedIndex === problem.originalIndex ? ACCENT : 'var(--color-border)'}`,
                background: data.selectedIndex === problem.originalIndex ? `${ACCENT}08` : 'var(--color-bg-primary)',
                cursor: 'pointer', textAlign: 'left', transition: 'all 0.15s',
              }}
            >
              <span style={{
                fontFamily: 'var(--font-heading)', fontSize: '0.6875rem', fontWeight: 700,
                color: rank === 0 ? ACCENT : 'var(--color-text-muted)',
                minWidth: 20,
              }}>
                #{rank + 1}
              </span>
              <span style={{ fontFamily: 'var(--font-body)', fontSize: '0.875rem', color: 'var(--color-text-primary)', flex: 1 }}>
                {problem.name || '(Sin nombre)'}
              </span>
              <span style={{
                fontFamily: 'var(--font-heading)', fontSize: '0.875rem', fontWeight: 700, color: ACCENT,
              }}>
                {problem.total}/20
              </span>
              {data.selectedIndex === problem.originalIndex && <CheckCircle2 size={16} color={ACCENT} />}
            </button>
          ))}
        </div>

        <label style={labelStyle}>¿Por qué elegiste este problema? (justifica con evidencia)</label>
        <textarea
          value={data.justification}
          onChange={e => setData(p => ({ ...p, justification: e.target.value }))}
          placeholder="Explica por qué este problema tiene más potencial que los demás. ¿Tienes evidencia de la urgencia? ¿Conoces personas que lo viven? ¿Has visto que otros intentaron resolverlo y fallaron?"
          style={{ ...textareaStyle, minHeight: 100 }}
        />
      </ToolSection>

      <ToolActionBar
        onSave={() => { setSaved(true); setTimeout(() => setSaved(false), 2000) }}
        onComplete={onComplete}
        onReport={handleReport}
        saved={saved}
        accentColor={ACCENT}
      />
    </div>
  )
}
