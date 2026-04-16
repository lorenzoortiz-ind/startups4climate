'use client'

import { useState } from 'react'
import { Plus, Trash2, ChevronDown } from 'lucide-react'
import { useToolState } from '@/lib/useToolState'
import type { ToolComponentProps } from './ToolPage'
import { ToolSection, ToolActionBar, ToolProgress, inputStyle, textareaStyle, labelStyle, btnSmall } from './shared'

interface Assumption {
  supuesto: string
  riesgo: string
  experimento: string
  criterioExito: string
  resultado: string
  aprendizaje: string
}

interface Data { assumptions: Assumption[] }

const RIESGOS = ['Alto', 'Medio', 'Bajo']
const RESULTADOS = ['Pendiente', 'Validado', 'Invalidado']

const emptyAssumption = (): Assumption => ({ supuesto: '', riesgo: 'Medio', experimento: '', criterioExito: '', resultado: 'Pendiente', aprendizaje: '' })
const DEFAULT: Data = { assumptions: [emptyAssumption()] }

export default function KeyAssumptions({ userId, onComplete, onGenerateReport }: ToolComponentProps) {
  const [data, setData] = useToolState<Data>(userId, 'key-assumptions', DEFAULT)
  const [openSections, setOpenSections] = useState<Record<string, boolean>>({})
  const [saved, setSaved] = useState(false)
  const toggle = (k: string) => setOpenSections(p => ({ ...p, [k]: !p[k] }))
  const handleSave = () => { setSaved(true); setTimeout(() => setSaved(false), 2000) }

  const updateAssumption = (i: number, field: keyof Assumption, value: string) => {
    setData(p => { const a = [...p.assumptions]; a[i] = { ...a[i], [field]: value }; return { ...p, assumptions: a } })
  }
  const addAssumption = () => setData(p => ({ ...p, assumptions: [...p.assumptions, emptyAssumption()] }))
  const removeAssumption = (i: number) => setData(p => ({ ...p, assumptions: p.assumptions.filter((_, idx) => idx !== i) }))

  const riesgoColor = (r: string) => r === 'Alto' ? '#DC2626' : r === 'Medio' ? '#2A222B' : '#0D9488'
  const resultadoColor = (r: string) => r === 'Validado' ? '#0D9488' : r === 'Invalidado' ? '#DC2626' : '#9CA3AF'

  /* ── Progress calculation ── */
  const filledCount = data.assumptions.filter(a => a.supuesto.trim() && a.experimento.trim()).length
  const totalCount = data.assumptions.length

  const handleReport = () => {
    const content = `
SUPUESTOS CLAVE

${data.assumptions.map((a, i) => `SUPUESTO ${i + 1}: ${a.supuesto || '(No completado)'}
  Nivel de riesgo: ${a.riesgo}
  Experimento: ${a.experimento || '(No completado)'}
  Criterio de éxito: ${a.criterioExito || '(No completado)'}
  Resultado: ${a.resultado}
  Aprendizaje: ${a.aprendizaje || '(No completado)'}`).join('\n\n')}

RESUMEN:
- Total supuestos: ${data.assumptions.length}
- Validados: ${data.assumptions.filter(a => a.resultado === 'Validado').length}
- Invalidados: ${data.assumptions.filter(a => a.resultado === 'Invalidado').length}
- Pendientes: ${data.assumptions.filter(a => a.resultado === 'Pendiente').length}
    `.trim()
    onGenerateReport(content)
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
      <ToolProgress filled={filledCount} total={totalCount} accentColor="#0D9488" />

      {/* Summary badges */}
      <div style={{ background: 'var(--color-bg-card)', borderRadius: 12, border: '1px solid var(--color-border)', padding: '1rem 1.25rem', display: 'flex', gap: '1.5rem', flexWrap: 'wrap' }}>
        {RESULTADOS.map(r => (
          <div key={r} style={{ display: 'flex', alignItems: 'center', gap: '0.375rem' }}>
            <div style={{ width: 8, height: 8, borderRadius: '50%', background: resultadoColor(r) }} />
            <span style={{ fontFamily: 'var(--font-body)', fontSize: '0.75rem', color: 'var(--color-text-muted)' }}>
              {r}: {data.assumptions.filter(a => a.resultado === r).length}
            </span>
          </div>
        ))}
      </div>

      <ToolSection
        number={1}
        title="Supuestos clave"
        subtitle="Identifica y prioriza las hipótesis más riesgosas de tu modelo"
        insight="Toda startup es un conjunto de hipótesis no validadas. Tu trabajo es identificar las más riesgosas y diseñar experimentos para probarlas."
        insightSource="Steve Blank, The Four Steps to the Epiphany"
        defaultOpen
      >
        {data.assumptions.map((a, i) => (
          <div key={i} style={{ padding: '1rem', borderRadius: 10, borderTop: `1px solid ${riesgoColor(a.riesgo)}25`, borderRight: `1px solid ${riesgoColor(a.riesgo)}25`, borderBottom: `1px solid ${riesgoColor(a.riesgo)}25`, borderLeft: `3px solid ${riesgoColor(a.riesgo)}`, marginBottom: '0.75rem', background: 'var(--color-bg-primary)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.625rem' }}>
              <span style={{ fontFamily: 'var(--font-heading)', fontSize: '0.8125rem', fontWeight: 700, color: 'var(--color-text-secondary)' }}>Supuesto {i + 1}</span>
              {data.assumptions.length > 1 && (
                <button onClick={() => removeAssumption(i)} style={{ ...btnSmall, color: '#DC2626', border: '1px solid #DC262630' }}>
                  <Trash2 size={12} />
                </button>
              )}
            </div>
            <input value={a.supuesto} onChange={e => updateAssumption(i, 'supuesto', e.target.value)} placeholder="¿Cuál es el supuesto?" style={{ ...inputStyle, marginBottom: '0.5rem' }} />
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem', marginBottom: '0.5rem' }}>
              <div>
                <label style={labelStyle}>Nivel de riesgo</label>
                <select value={a.riesgo} onChange={e => updateAssumption(i, 'riesgo', e.target.value)} style={{ ...inputStyle, color: riesgoColor(a.riesgo), fontWeight: 600 }}>
                  {RIESGOS.map(r => <option key={r} value={r}>{r}</option>)}
                </select>
              </div>
              <div>
                <label style={labelStyle}>Resultado</label>
                <select value={a.resultado} onChange={e => updateAssumption(i, 'resultado', e.target.value)} style={{ ...inputStyle, color: resultadoColor(a.resultado), fontWeight: 600 }}>
                  {RESULTADOS.map(r => <option key={r} value={r}>{r}</option>)}
                </select>
              </div>
            </div>

            {/* Collapsible: Experimento */}
            <button onClick={() => toggle(`exp-${i}`)} style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0.5rem 0', background: 'none', border: 'none', cursor: 'pointer', marginBottom: openSections[`exp-${i}`] ? '0.5rem' : 0 }}>
              <span style={{ fontSize: '0.8125rem', fontWeight: 600, color: 'var(--color-text-secondary)', fontFamily: 'var(--font-body)' }}>Experimento de validación</span>
              <ChevronDown size={14} color="var(--color-text-muted)" style={{ transform: openSections[`exp-${i}`] ? 'rotate(180deg)' : 'rotate(0)', transition: 'transform 0.2s' }} />
            </button>
            {openSections[`exp-${i}`] && <textarea value={a.experimento} onChange={e => updateAssumption(i, 'experimento', e.target.value)} placeholder="¿Cómo vas a validar este supuesto?" rows={2} style={{ ...textareaStyle, marginBottom: '0.5rem' }} />}

            <input value={a.criterioExito} onChange={e => updateAssumption(i, 'criterioExito', e.target.value)} placeholder="Criterio de éxito" style={{ ...inputStyle, marginBottom: '0.5rem' }} />

            {/* Collapsible: Aprendizaje */}
            <button onClick={() => toggle(`apr-${i}`)} style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0.5rem 0', background: 'none', border: 'none', cursor: 'pointer', marginBottom: openSections[`apr-${i}`] ? '0.5rem' : 0 }}>
              <span style={{ fontSize: '0.8125rem', fontWeight: 600, color: 'var(--color-text-secondary)', fontFamily: 'var(--font-body)' }}>Aprendizaje</span>
              <ChevronDown size={14} color="var(--color-text-muted)" style={{ transform: openSections[`apr-${i}`] ? 'rotate(180deg)' : 'rotate(0)', transition: 'transform 0.2s' }} />
            </button>
            {openSections[`apr-${i}`] && <textarea value={a.aprendizaje} onChange={e => updateAssumption(i, 'aprendizaje', e.target.value)} placeholder="¿Qué aprendiste del resultado?" rows={2} style={textareaStyle} />}
          </div>
        ))}
        <button onClick={addAssumption} style={{ ...btnSmall, color: '#0D9488', border: '1px solid #0D948830' }}>
          <Plus size={14} /> Agregar supuesto
        </button>
      </ToolSection>

      <ToolActionBar onSave={handleSave} onComplete={onComplete} onReport={handleReport} saved={saved} />
    </div>
  )
}
