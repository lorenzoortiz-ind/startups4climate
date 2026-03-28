'use client'

import { useState } from 'react'
import { ChevronDown, Save, CheckCircle2, FileText } from 'lucide-react'
import { useToolState } from '@/lib/useToolState'
import type { ToolComponentProps } from './ToolPage'

interface Data {
  [key: string]: unknown
  clientes: number | string
  mrr: number | string
  retencion: number | string
  nps: number | string
  testimoniales: string
  evidenciaVentas: string
  metricasClave: string
}

const DEFAULT: Data = { clientes: '', mrr: '', retencion: '', nps: '', testimoniales: '', evidenciaVentas: '', metricasClave: '' }

export default function TractionValidation({ userId, onComplete, onGenerateReport }: ToolComponentProps) {
  const [data, setData] = useToolState<Data>(userId, 'traction-validation', DEFAULT)
  const [openSections, setOpenSections] = useState<Record<string, boolean>>({})
  const [saved, setSaved] = useState(false)
  const toggle = (k: string) => setOpenSections(p => ({ ...p, [k]: !p[k] }))
  const handleSave = () => { setSaved(true); setTimeout(() => setSaved(false), 2000) }

  const handleReport = () => {
    const content = `
VALIDACIÓN DE TRACCIÓN

MÉTRICAS PRINCIPALES:
- Clientes actuales: ${data.clientes || '0'}
- MRR: $${Number(data.mrr).toLocaleString()}
- Tasa de retención mensual: ${data.retencion}%
- NPS / Satisfacción: ${data.nps}

TESTIMONIALES:
${data.testimoniales || '(No completado)'}

EVIDENCIA DE VENTAS:
${data.evidenciaVentas || '(No completado)'}

MÉTRICAS CLAVE DE TRACCIÓN:
${data.metricasClave || '(No completado)'}
    `.trim()
    onGenerateReport(content)
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
      {/* Number metrics - always visible */}
      <div style={cardStyle}>
        <div style={{ padding: '1rem 1.25rem' }}><span style={headingStyle}>Métricas de tracción</span></div>
        <div style={{ padding: '0 1.25rem 1.25rem' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
            <div>
              <label style={labelStyle}>Número de clientes actuales</label>
              <input type="number" value={data.clientes} onChange={e => setData(p => ({ ...p, clientes: e.target.value }))} placeholder="Ej: 25" step="1" style={inputStyle} />
            </div>
            <div>
              <label style={labelStyle}>MRR - Ingresos mensuales recurrentes</label>
              <div style={{ position: 'relative' }}>
                <span style={prefixStyle}>$</span>
                <input type="number" value={data.mrr} onChange={e => setData(p => ({ ...p, mrr: e.target.value }))} placeholder="Ej: 5000" step="100" style={{ ...inputStyle, paddingLeft: '1.75rem' }} />
              </div>
            </div>
            <div>
              <label style={labelStyle}>Tasa de retención mensual</label>
              <div style={{ position: 'relative' }}>
                <input type="number" value={data.retencion} onChange={e => setData(p => ({ ...p, retencion: e.target.value }))} placeholder="Ej: 95" step="0.1" min="0" max="100" style={{ ...inputStyle, paddingRight: '2.5rem' }} />
                <span style={suffixStyle}>%</span>
              </div>
            </div>
            <div>
              <label style={labelStyle}>NPS o satisfacción</label>
              <input type="number" value={data.nps} onChange={e => setData(p => ({ ...p, nps: e.target.value }))} placeholder="Ej: 72" step="1" min="-100" max="100" style={inputStyle} />
            </div>
          </div>

          {/* Summary display */}
          {(Number(data.clientes) > 0 || Number(data.mrr) > 0) && (
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr 1fr', gap: '0.5rem', marginTop: '1rem' }}>
              {[
                { label: 'Clientes', value: data.clientes || '0', color: '#059669' },
                { label: 'MRR', value: `$${Number(data.mrr).toLocaleString()}`, color: '#7C3AED' },
                { label: 'Retención', value: `${data.retencion || 0}%`, color: '#0891B2' },
                { label: 'NPS', value: String(data.nps || '—'), color: '#D97706' },
              ].map(m => (
                <div key={m.label} style={{ textAlign: 'center', padding: '0.75rem', borderRadius: 10, background: `${m.color}08`, border: `1px solid ${m.color}20` }}>
                  <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.625rem', color: m.color, textTransform: 'uppercase', letterSpacing: '0.05em' }}>{m.label}</div>
                  <div style={{ fontFamily: 'var(--font-heading)', fontSize: '1.125rem', fontWeight: 800, color: m.color }}>{m.value}</div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {[
        { key: 'testimoniales', title: 'Testimoniales', ph: 'Comparte citas o testimoniales de clientes satisfechos' },
        { key: 'evidenciaVentas', title: 'Evidencia de ventas', ph: 'LOIs, contratos firmados, pilotos completados, pagos recibidos...' },
        { key: 'metricasClave', title: 'Métricas clave de tracción', ph: 'Otras métricas relevantes: usuarios activos, engagement, pipeline, etc.' },
      ].map(s => (
        <div key={s.key} style={cardStyle}>
          <button onClick={() => toggle(s.key)} style={sectionBtn}>
            <span style={headingStyle}>{s.title}</span>
            <ChevronDown size={18} color="var(--color-text-muted)" style={{ transition: 'transform 0.2s', transform: openSections[s.key] ? 'rotate(180deg)' : 'rotate(0)' }} />
          </button>
          {openSections[s.key] && (
            <div style={{ padding: '0 1.25rem 1.25rem' }}>
              <textarea value={(data as Record<string, string>)[s.key]} onChange={e => setData(p => ({ ...p, [s.key]: e.target.value }))} placeholder={s.ph} rows={4} style={taStyle} />
            </div>
          )}
        </div>
      ))}

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
const sectionBtn: React.CSSProperties = { width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '1rem 1.25rem', background: 'none', border: 'none', cursor: 'pointer' }
const inputStyle: React.CSSProperties = { width: '100%', padding: '0.625rem 0.875rem', borderRadius: 8, border: '1px solid var(--color-border)', background: 'var(--color-bg-card)', fontFamily: 'var(--font-body)', fontSize: '0.875rem', color: 'var(--color-text-primary)', outline: 'none' }
const taStyle: React.CSSProperties = { ...inputStyle, resize: 'vertical' as const, lineHeight: 1.6 }
const labelStyle: React.CSSProperties = { fontFamily: 'var(--font-mono)', fontSize: '0.75rem', color: 'var(--color-text-muted)', marginBottom: '0.375rem', display: 'block' }
const btnOG: React.CSSProperties = { display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.75rem 1.25rem', borderRadius: 10, fontFamily: 'var(--font-body)', fontSize: '0.875rem', fontWeight: 600, background: 'transparent', color: '#059669', border: '1.5px solid #05966940', cursor: 'pointer' }
const btnSG: React.CSSProperties = { display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.75rem 1.25rem', borderRadius: 10, fontFamily: 'var(--font-body)', fontSize: '0.875rem', fontWeight: 600, background: '#059669', color: 'white', border: 'none', cursor: 'pointer', boxShadow: '0 2px 8px rgba(5,150,105,0.3)' }
const btnO: React.CSSProperties = { display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.75rem 1.25rem', borderRadius: 10, fontFamily: 'var(--font-body)', fontSize: '0.875rem', fontWeight: 600, background: 'transparent', color: 'var(--color-text-secondary)', border: '1.5px solid var(--color-border)', cursor: 'pointer' }
const prefixStyle: React.CSSProperties = { position: 'absolute', left: '0.75rem', top: '50%', transform: 'translateY(-50%)', fontFamily: 'var(--font-mono)', fontSize: '0.75rem', color: 'var(--color-text-muted)', pointerEvents: 'none' }
const suffixStyle: React.CSSProperties = { position: 'absolute', right: '0.75rem', top: '50%', transform: 'translateY(-50%)', fontFamily: 'var(--font-mono)', fontSize: '0.75rem', color: 'var(--color-text-muted)', pointerEvents: 'none' }
