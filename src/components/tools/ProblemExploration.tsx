'use client'

import { useState } from 'react'
import { Plus, Trash2 } from 'lucide-react'
import { useToolState } from '@/lib/useToolState'
import type { ToolComponentProps } from './ToolPage'
import {
  ToolSection, ToolActionBar, ToolProgress,
  inputStyle, textareaStyle, labelStyle, btnSmall,
} from './shared'

interface Problem {
  description: string
  context: string
  affected: string
  frequency: 'Diaria' | 'Semanal' | 'Mensual' | 'Esporádica'
}

interface Data {
  territory: string
  problems: Problem[]
}

const FREQUENCY_OPTIONS = ['Diaria', 'Semanal', 'Mensual', 'Esporádica'] as const
const emptyProblem = (): Problem => ({
  description: '', context: '', affected: '', frequency: 'Semanal',
})
const DEFAULT: Data = { territory: '', problems: [emptyProblem()] }

const ACCENT = '#16A34A'

export default function ProblemExploration({ userId, onComplete, onGenerateReport }: ToolComponentProps) {
  const [data, setData] = useToolState<Data>(userId, 'problem-exploration', DEFAULT)
  const [saved, setSaved] = useState(false)

  const updateProblem = (i: number, field: keyof Problem, value: string) =>
    setData(p => { const ps = [...p.problems]; ps[i] = { ...ps[i], [field]: value }; return { ...p, problems: ps } })
  const addProblem = () => setData(p => ({ ...p, problems: [...p.problems, emptyProblem()] }))
  const removeProblem = (i: number) =>
    setData(p => ({ ...p, problems: p.problems.filter((_, idx) => idx !== i) }))

  const filledCount = data.problems.filter(p => p.description.trim() && p.affected.trim()).length
  const totalCount = Math.max(data.problems.length, 1)

  const handleReport = () => {
    const content = `
EXPLORACIÓN DE PROBLEMAS

TERRITORIO EXPLORADO: ${data.territory || '(No completado)'}

PROBLEMAS IDENTIFICADOS:
${data.problems.map((p, i) => `
Problema ${i + 1}: ${p.description || '(No completado)'}
  Contexto: ${p.context || '(No completado)'}
  Personas afectadas: ${p.affected || '(No completado)'}
  Frecuencia: ${p.frequency}`).join('\n')}

TOTAL: ${data.problems.length} problema(s) identificado(s)
`.trim()
    onGenerateReport(content)
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
      <ToolProgress filled={filledCount} total={Math.min(totalCount, 5)} accentColor={ACCENT} />

      {/* Section 1: Territory */}
      <ToolSection
        number={1}
        title="Elige tu territorio"
        subtitle="¿Desde qué comunidad, sector o contexto observarás?"
        insight="El Design Thinking (Stanford d.school) comienza con empatía en un territorio específico. Mientras más familiar sea el contexto, más rica será la observación."
        insightSource="Stanford d.school — Design Thinking"
        defaultOpen={true}
        accentColor={ACCENT}
      >
        <label style={labelStyle}>Describe el territorio o contexto que conoces bien</label>
        <textarea
          value={data.territory}
          onChange={e => setData(p => ({ ...p, territory: e.target.value }))}
          placeholder="Ej: Pequeños agricultores de la selva amazónica que venden en mercados locales. Conozco este contexto porque crecí en Ucayali y he trabajado con cooperativas."
          style={{ ...textareaStyle, minHeight: 90 }}
        />
      </ToolSection>

      {/* Section 2: Problems */}
      <ToolSection
        number={2}
        title="Mapea los problemas"
        subtitle={`${data.problems.length} problema(s) — apunta a 5-8`}
        insight="Pregunta guía: ¿Qué le resulta difícil, costoso, lento o injusto a la gente en este contexto? No pienses en soluciones aún — solo observa y documenta."
        insightSource="IDEO Human-Centered Design"
        defaultOpen={true}
        accentColor={ACCENT}
      >
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {data.problems.map((problem, i) => (
            <div
              key={i}
              style={{
                padding: '1rem',
                borderRadius: 12,
                border: '1px solid var(--color-border)',
                background: 'var(--color-bg-primary)',
                position: 'relative',
              }}
            >
              <div style={{
                display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                marginBottom: '0.75rem',
              }}>
                <span style={{
                  fontFamily: 'var(--font-heading)', fontSize: '0.75rem',
                  fontWeight: 700, color: ACCENT,
                }}>
                  Problema {i + 1}
                </span>
                {data.problems.length > 1 && (
                  <button
                    onClick={() => removeProblem(i)}
                    style={{ ...btnSmall, color: '#EF4444', borderColor: '#FCA5A580' }}
                  >
                    <Trash2 size={12} /> Eliminar
                  </button>
                )}
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                <div>
                  <label style={labelStyle}>¿Cuál es el problema?</label>
                  <textarea
                    value={problem.description}
                    onChange={e => updateProblem(i, 'description', e.target.value)}
                    placeholder="Describe el problema desde el punto de vista de quien lo sufre, no de la solución técnica."
                    style={{ ...textareaStyle, minHeight: 70 }}
                  />
                </div>
                <div>
                  <label style={labelStyle}>¿En qué contexto ocurre?</label>
                  <input
                    value={problem.context}
                    onChange={e => updateProblem(i, 'context', e.target.value)}
                    placeholder="Situación específica donde aparece el problema"
                    style={inputStyle}
                  />
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
                  <div>
                    <label style={labelStyle}>¿Quiénes lo viven?</label>
                    <input
                      value={problem.affected}
                      onChange={e => updateProblem(i, 'affected', e.target.value)}
                      placeholder="Describe al afectado típico"
                      style={inputStyle}
                    />
                  </div>
                  <div>
                    <label style={labelStyle}>¿Con qué frecuencia?</label>
                    <select
                      value={problem.frequency}
                      onChange={e => updateProblem(i, 'frequency', e.target.value as Problem['frequency'])}
                      style={{ ...inputStyle, cursor: 'pointer' }}
                    >
                      {FREQUENCY_OPTIONS.map(f => <option key={f} value={f}>{f}</option>)}
                    </select>
                  </div>
                </div>
              </div>
            </div>
          ))}
          {data.problems.length < 8 && (
            <button onClick={addProblem} style={{
              ...btnSmall, color: ACCENT,
              borderColor: `${ACCENT}40`, borderStyle: 'dashed',
              padding: '0.625rem 1rem', borderRadius: 10, width: '100%',
              justifyContent: 'center',
            }}>
              <Plus size={14} /> Agregar otro problema
            </button>
          )}
        </div>
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
