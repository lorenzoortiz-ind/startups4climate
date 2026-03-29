'use client'

import { useState, useMemo } from 'react'
import { ChevronDown, Save, CheckCircle2, FileText, Plus, Trash2 } from 'lucide-react'
import { useToolState } from '@/lib/useToolState'
import type { ToolComponentProps } from './ToolPage'

interface KeyResult {
  [key: string]: unknown
  description: string
  target: number
  current: number
  unit: string
}

interface Objective {
  [key: string]: unknown
  title: string
  key_results: KeyResult[]
}

interface Data {
  [key: string]: unknown
  quarter: string
  year: number
  objectives: Objective[]
}

const currentYear = new Date().getFullYear()

const DEFAULT: Data = {
  quarter: 'Q1',
  year: currentYear,
  objectives: [
    {
      title: '',
      key_results: [{ description: '', target: 100, current: 0, unit: '%' }],
    },
  ],
}

const progressColor = (pct: number) => {
  if (pct >= 70) return '#0D9488'
  if (pct >= 40) return '#D97706'
  return '#DC2626'
}

export default function OKRTracker({ userId, onComplete, onGenerateReport }: ToolComponentProps) {
  const [data, setData] = useToolState<Data>(userId, 'okr-tracker', DEFAULT)
  const [openSections, setOpenSections] = useState<Record<string, boolean>>({})
  const [saved, setSaved] = useState(false)

  const toggle = (k: string) => setOpenSections(p => ({ ...p, [k]: !p[k] }))

  const krProgress = (kr: KeyResult) => {
    if (kr.target === 0) return 0
    return Math.min(Math.round((kr.current / kr.target) * 100), 100)
  }

  const objectiveScore = (obj: Objective) => {
    if (obj.key_results.length === 0) return 0
    const total = obj.key_results.reduce((sum, kr) => sum + krProgress(kr), 0)
    return Math.round(total / obj.key_results.length)
  }

  const overallScore = useMemo(() => {
    if (data.objectives.length === 0) return 0
    const total = data.objectives.reduce((sum, obj) => sum + objectiveScore(obj), 0)
    return Math.round(total / data.objectives.length)
  }, [data.objectives])

  const updateObjectiveTitle = (i: number, title: string) => {
    setData(p => {
      const objectives = [...p.objectives]
      objectives[i] = { ...objectives[i], title }
      return { ...p, objectives }
    })
  }

  const updateKR = (objIdx: number, krIdx: number, field: keyof KeyResult, value: string | number) => {
    setData(p => {
      const objectives = [...p.objectives]
      const krs = [...objectives[objIdx].key_results]
      krs[krIdx] = { ...krs[krIdx], [field]: value }
      objectives[objIdx] = { ...objectives[objIdx], key_results: krs }
      return { ...p, objectives }
    })
  }

  const addObjective = () => setData(p => ({
    ...p,
    objectives: [...p.objectives, { title: '', key_results: [{ description: '', target: 100, current: 0, unit: '%' }] }],
  }))

  const removeObjective = (i: number) => setData(p => ({ ...p, objectives: p.objectives.filter((_, idx) => idx !== i) }))

  const addKR = (objIdx: number) => {
    setData(p => {
      const objectives = [...p.objectives]
      objectives[objIdx] = {
        ...objectives[objIdx],
        key_results: [...objectives[objIdx].key_results, { description: '', target: 100, current: 0, unit: '%' }],
      }
      return { ...p, objectives }
    })
  }

  const removeKR = (objIdx: number, krIdx: number) => {
    setData(p => {
      const objectives = [...p.objectives]
      objectives[objIdx] = {
        ...objectives[objIdx],
        key_results: objectives[objIdx].key_results.filter((_, i) => i !== krIdx),
      }
      return { ...p, objectives }
    })
  }

  const handleSave = () => { setSaved(true); setTimeout(() => setSaved(false), 2000) }

  const handleReport = () => {
    const content = `
OKR TRACKER — ${data.quarter} ${data.year}

SCORE GENERAL: ${overallScore}%

${data.objectives.map((obj, i) => `OBJETIVO ${i + 1}: ${obj.title || '(Sin título)'} — Score: ${objectiveScore(obj)}%
${obj.key_results.map((kr, j) => `  KR ${j + 1}: ${kr.description || '(Sin descripción)'}
    Progreso: ${kr.current}/${kr.target} ${kr.unit} (${krProgress(kr)}%)`).join('\n')}`).join('\n\n')}
    `.trim()
    onGenerateReport(content)
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
      {/* Quarter selector */}
      <div style={{ background: 'var(--color-bg-card)', borderRadius: 14, border: '1px solid var(--color-border)', padding: '1.25rem' }}>
        <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center', flexWrap: 'wrap' }}>
          <label style={labelStyle}>Trimestre</label>
          <select value={data.quarter} onChange={e => setData(p => ({ ...p, quarter: e.target.value }))} style={{ ...inputStyle, width: 'auto' }}>
            {['Q1', 'Q2', 'Q3', 'Q4'].map(q => <option key={q} value={q}>{q}</option>)}
          </select>
          <label style={labelStyle}>Año</label>
          <input type="number" value={data.year || ''} onChange={e => setData(p => ({ ...p, year: Number(e.target.value) }))} placeholder="2026" style={{ ...inputStyle, width: 100 }} />
          <div style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <span style={labelStyle}>Score general:</span>
            <span style={{ fontFamily: 'var(--font-mono)', fontSize: '1.5rem', fontWeight: 700, color: progressColor(overallScore) }}>{overallScore}%</span>
          </div>
        </div>
      </div>

      {/* Objectives */}
      {data.objectives.map((obj, objIdx) => {
        const score = objectiveScore(obj)
        return (
          <SectionCollapsible
            key={objIdx}
            title={`Objetivo ${objIdx + 1}${obj.title ? ': ' + obj.title : ''}`}
            sectionKey={`obj-${objIdx}`}
            open={openSections}
            toggle={toggle}
            right={<span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.75rem', fontWeight: 700, color: progressColor(score) }}>{score}%</span>}
          >
            <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1rem', alignItems: 'center' }}>
              <input value={obj.title} onChange={e => updateObjectiveTitle(objIdx, e.target.value)} placeholder="Título del objetivo" style={{ ...inputStyle, flex: 1, fontWeight: 600 }} />
              {data.objectives.length > 1 && (
                <button onClick={() => removeObjective(objIdx)} style={{ ...btnSmall, color: '#DC2626', borderColor: '#DC262630' }}><Trash2 size={12} /> Eliminar</button>
              )}
            </div>

            {obj.key_results.map((kr, krIdx) => {
              const pct = krProgress(kr)
              return (
                <div key={krIdx} style={{ padding: '0.75rem', borderRadius: 8, border: '1px solid var(--color-border)', marginBottom: '0.625rem', background: 'var(--color-bg-primary)' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                    <span style={{ fontFamily: 'var(--font-heading)', fontSize: '0.75rem', fontWeight: 600, color: 'var(--color-text-muted)' }}>Key Result {krIdx + 1}</span>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.75rem', fontWeight: 700, color: progressColor(pct) }}>{pct}%</span>
                      {obj.key_results.length > 1 && (
                        <button onClick={() => removeKR(objIdx, krIdx)} style={{ ...btnSmall, color: '#DC2626', borderColor: '#DC262630', padding: '0.2rem 0.4rem' }}><Trash2 size={10} /></button>
                      )}
                    </div>
                  </div>
                  <input value={kr.description} onChange={e => updateKR(objIdx, krIdx, 'description', e.target.value)} placeholder="Descripción del key result" style={{ ...inputStyle, marginBottom: '0.5rem' }} />
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '0.5rem', marginBottom: '0.5rem' }}>
                    <div>
                      <label style={{ ...labelStyle, fontSize: '0.6875rem' }}>Meta</label>
                      <input type="number" value={kr.target || ''} onChange={e => updateKR(objIdx, krIdx, 'target', Number(e.target.value))} placeholder="0" style={inputStyle} />
                    </div>
                    <div>
                      <label style={{ ...labelStyle, fontSize: '0.6875rem' }}>Actual</label>
                      <input type="number" value={kr.current || ''} onChange={e => updateKR(objIdx, krIdx, 'current', Number(e.target.value))} placeholder="0" style={inputStyle} />
                    </div>
                    <div>
                      <label style={{ ...labelStyle, fontSize: '0.6875rem' }}>Unidad</label>
                      <input value={kr.unit} onChange={e => updateKR(objIdx, krIdx, 'unit', e.target.value)} style={inputStyle} />
                    </div>
                  </div>
                  {/* Progress bar */}
                  <div style={{ height: 8, borderRadius: 4, background: 'var(--color-bg-muted)', overflow: 'hidden' }}>
                    <div style={{ height: '100%', width: `${pct}%`, borderRadius: 4, background: progressColor(pct), transition: 'width 0.3s' }} />
                  </div>
                </div>
              )
            })}
            <button onClick={() => addKR(objIdx)} style={{ ...btnSmall, color: '#0D9488', borderColor: '#0D948830' }}><Plus size={12} /> Agregar Key Result</button>
          </SectionCollapsible>
        )
      })}

      <button onClick={addObjective} style={{ ...btnSmall, color: '#0D9488', borderColor: '#0D948830', padding: '0.625rem 1rem', fontSize: '0.8125rem', alignSelf: 'flex-start' }}><Plus size={14} /> Agregar objetivo</button>

      {/* Buttons */}
      <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap', marginTop: '0.5rem' }}>
        <button onClick={handleSave} style={btnOutlineGreen}>
          <Save size={15} /> {saved ? '¡Guardado!' : 'Guardar progreso'}
        </button>
        <button onClick={onComplete} style={btnSolidGreen}>
          <CheckCircle2 size={15} /> Marcar como completada
        </button>
        <button onClick={handleReport} style={btnOutline}>
          <FileText size={15} /> Generar reporte
        </button>
      </div>
    </div>
  )
}

/* ── Shared sub-components & styles ── */

function SectionCollapsible({ title, sectionKey, open, toggle, children, right }: {
  title: string; sectionKey: string; open: Record<string, boolean>; toggle: (k: string) => void; children: React.ReactNode; right?: React.ReactNode
}) {
  return (
    <div style={{ background: 'var(--color-bg-card)', borderRadius: 14, border: '1px solid var(--color-border)', overflow: 'hidden' }}>
      <button onClick={() => toggle(sectionKey)} style={sectionBtn}>
        <span style={{ fontFamily: 'var(--font-heading)', fontSize: '0.9375rem', fontWeight: 700, color: 'var(--color-text-primary)' }}>{title}</span>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          {right}
          <ChevronDown size={18} color="var(--color-text-muted)" style={{ transition: 'transform 0.2s', transform: open[sectionKey] ? 'rotate(180deg)' : 'rotate(0)' }} />
        </div>
      </button>
      {open[sectionKey] && <div style={{ padding: '0 1.25rem 1.25rem' }}>{children}</div>}
    </div>
  )
}

const sectionBtn: React.CSSProperties = {
  width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'space-between',
  padding: '1rem 1.25rem', background: 'none', border: 'none', cursor: 'pointer',
}

const inputStyle: React.CSSProperties = {
  width: '100%', padding: '0.625rem 0.875rem', borderRadius: 8,
  border: '1px solid var(--color-border)', background: 'var(--color-bg-card)',
  fontFamily: 'var(--font-body)', fontSize: '0.875rem', color: 'var(--color-text-primary)',
  outline: 'none',
}

const labelStyle: React.CSSProperties = {
  fontFamily: 'var(--font-heading)', fontSize: '0.75rem', fontWeight: 600,
  color: 'var(--color-text-secondary)', display: 'block', marginBottom: '0.25rem',
}

const btnSmall: React.CSSProperties = {
  display: 'inline-flex', alignItems: 'center', gap: '0.3rem',
  padding: '0.35rem 0.75rem', borderRadius: 6, fontSize: '0.75rem',
  fontFamily: 'var(--font-body)', fontWeight: 600, background: 'transparent',
  border: '1px solid var(--color-border)', cursor: 'pointer',
}

const btnOutlineGreen: React.CSSProperties = {
  display: 'flex', alignItems: 'center', gap: '0.5rem',
  padding: '0.75rem 1.25rem', borderRadius: 10,
  fontFamily: 'var(--font-body)', fontSize: '0.875rem', fontWeight: 600,
  background: 'transparent', color: '#0D9488',
  border: '1.5px solid #0D948840', cursor: 'pointer',
}

const btnSolidGreen: React.CSSProperties = {
  display: 'flex', alignItems: 'center', gap: '0.5rem',
  padding: '0.75rem 1.25rem', borderRadius: 10,
  fontFamily: 'var(--font-body)', fontSize: '0.875rem', fontWeight: 600,
  background: '#0D9488', color: 'white',
  border: 'none', cursor: 'pointer', boxShadow: '0 2px 8px rgba(13,148,136,0.3)',
}

const btnOutline: React.CSSProperties = {
  display: 'flex', alignItems: 'center', gap: '0.5rem',
  padding: '0.75rem 1.25rem', borderRadius: 10,
  fontFamily: 'var(--font-body)', fontSize: '0.875rem', fontWeight: 600,
  background: 'transparent', color: 'var(--color-text-secondary)',
  border: '1.5px solid var(--color-border)', cursor: 'pointer',
}
