'use client'

import { useState } from 'react'
import { ChevronDown, Save, CheckCircle2, FileText, Plus, Trash2 } from 'lucide-react'
import { useToolState } from '@/lib/useToolState'
import type { ToolComponentProps } from './ToolPage'

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

  const riesgoColor = (r: string) => r === 'Alto' ? '#DC2626' : r === 'Medio' ? '#D97706' : '#0D9488'
  const resultadoColor = (r: string) => r === 'Validado' ? '#0D9488' : r === 'Invalidado' ? '#DC2626' : '#9CA3AF'

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
      {/* Summary */}
      <div style={{ background: 'var(--color-bg-card)', borderRadius: 12, border: '1px solid var(--color-border)', padding: '1rem 1.25rem', display: 'flex', gap: '1.5rem', flexWrap: 'wrap' }}>
        {RESULTADOS.map(r => (
          <div key={r} style={{ display: 'flex', alignItems: 'center', gap: '0.375rem' }}>
            <div style={{ width: 8, height: 8, borderRadius: '50%', background: resultadoColor(r) }} />
            <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.75rem', color: 'var(--color-text-muted)' }}>
              {r}: {data.assumptions.filter(a => a.resultado === r).length}
            </span>
          </div>
        ))}
      </div>

      <div style={cardStyle}>
        <div style={{ padding: '1rem 1.25rem' }}><span style={headingStyle}>Supuestos clave</span></div>
        <div style={{ padding: '0 1.25rem 1.25rem' }}>
          {data.assumptions.map((a, i) => (
            <div key={i} style={{ padding: '1rem', borderRadius: 10, border: `1px solid ${riesgoColor(a.riesgo)}25`, borderLeft: `3px solid ${riesgoColor(a.riesgo)}`, marginBottom: '0.75rem', background: 'var(--color-bg-primary)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.625rem' }}>
                <span style={{ fontFamily: 'var(--font-heading)', fontSize: '0.8125rem', fontWeight: 700, color: 'var(--color-text-secondary)' }}>Supuesto {i + 1}</span>
                {data.assumptions.length > 1 && <button onClick={() => removeAssumption(i)} style={btnDanger}><Trash2 size={12} /></button>}
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
              {/* Collapsible text fields */}
              <button onClick={() => toggle(`exp-${i}`)} style={{ ...sectionBtnSmall, marginBottom: openSections[`exp-${i}`] ? '0.5rem' : 0 }}>
                <span style={subLabel}>Experimento de validación</span>
                <ChevronDown size={14} color="var(--color-text-muted)" style={{ transform: openSections[`exp-${i}`] ? 'rotate(180deg)' : 'rotate(0)', transition: 'transform 0.2s' }} />
              </button>
              {openSections[`exp-${i}`] && <textarea value={a.experimento} onChange={e => updateAssumption(i, 'experimento', e.target.value)} placeholder="¿Cómo vas a validar este supuesto?" rows={2} style={{ ...taStyle, marginBottom: '0.5rem' }} />}

              <input value={a.criterioExito} onChange={e => updateAssumption(i, 'criterioExito', e.target.value)} placeholder="Criterio de éxito" style={{ ...inputStyle, marginBottom: '0.5rem' }} />

              <button onClick={() => toggle(`apr-${i}`)} style={{ ...sectionBtnSmall, marginBottom: openSections[`apr-${i}`] ? '0.5rem' : 0 }}>
                <span style={subLabel}>Aprendizaje</span>
                <ChevronDown size={14} color="var(--color-text-muted)" style={{ transform: openSections[`apr-${i}`] ? 'rotate(180deg)' : 'rotate(0)', transition: 'transform 0.2s' }} />
              </button>
              {openSections[`apr-${i}`] && <textarea value={a.aprendizaje} onChange={e => updateAssumption(i, 'aprendizaje', e.target.value)} placeholder="¿Qué aprendiste del resultado?" rows={2} style={taStyle} />}
            </div>
          ))}
          <button onClick={addAssumption} style={btnAdd}><Plus size={14} /> Agregar supuesto</button>
        </div>
      </div>

      <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap', marginTop: '0.5rem' }}>
        <button onClick={handleSave} style={btnOG}><Save size={15} /> {saved ? '¡Guardado!' : 'Guardar progreso'}</button>
        <button onClick={onComplete} style={btnSG}><CheckCircle2 size={15} /> Marcar como completada</button>
        <button onClick={handleReport} style={btnO}><FileText size={15} /> Generar reporte</button>
      </div>
    </div>
  )
}

const cardStyle: React.CSSProperties = { background: 'var(--color-bg-card)', borderRadius: 14, border: '1px solid var(--color-border)', overflow: 'hidden' }
const headingStyle: React.CSSProperties = { fontFamily: 'var(--font-heading)', fontSize: '0.9375rem', fontWeight: 700, color: 'var(--color-text-primary)' }
const subLabel: React.CSSProperties = { fontSize: '0.8125rem', fontWeight: 600, color: 'var(--color-text-secondary)', fontFamily: 'var(--font-body)' }
const sectionBtnSmall: React.CSSProperties = { width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0.5rem 0', background: 'none', border: 'none', cursor: 'pointer', fontFamily: 'var(--font-body)' }
const inputStyle: React.CSSProperties = { width: '100%', padding: '0.625rem 0.875rem', borderRadius: 8, border: '1px solid var(--color-border)', background: 'var(--color-bg-card)', fontFamily: 'var(--font-body)', fontSize: '0.875rem', color: 'var(--color-text-primary)', outline: 'none' }
const taStyle: React.CSSProperties = { ...inputStyle, resize: 'vertical' as const, lineHeight: 1.6 }
const labelStyle: React.CSSProperties = { fontFamily: 'var(--font-mono)', fontSize: '0.75rem', color: 'var(--color-text-muted)', marginBottom: '0.25rem', display: 'block' }
const btnDanger: React.CSSProperties = { display: 'flex', alignItems: 'center', padding: '0.25rem 0.5rem', borderRadius: 6, background: 'transparent', color: '#DC2626', border: '1px solid #DC262630', cursor: 'pointer' }
const btnAdd: React.CSSProperties = { display: 'flex', alignItems: 'center', gap: '0.375rem', padding: '0.5rem 1rem', borderRadius: 8, fontSize: '0.8125rem', fontFamily: 'var(--font-body)', fontWeight: 600, background: 'transparent', color: '#0D9488', border: '1px solid #0D948830', cursor: 'pointer' }
const btnOG: React.CSSProperties = { display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.75rem 1.25rem', borderRadius: 10, fontFamily: 'var(--font-body)', fontSize: '0.875rem', fontWeight: 600, background: 'transparent', color: '#0D9488', border: '1.5px solid #0D948840', cursor: 'pointer' }
const btnSG: React.CSSProperties = { display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.75rem 1.25rem', borderRadius: 10, fontFamily: 'var(--font-body)', fontSize: '0.875rem', fontWeight: 600, background: '#0D9488', color: 'white', border: 'none', cursor: 'pointer', boxShadow: '0 2px 8px rgba(13,148,136,0.3)' }
const btnO: React.CSSProperties = { display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.75rem 1.25rem', borderRadius: 10, fontFamily: 'var(--font-body)', fontSize: '0.875rem', fontWeight: 600, background: 'transparent', color: 'var(--color-text-secondary)', border: '1.5px solid var(--color-border)', cursor: 'pointer' }
