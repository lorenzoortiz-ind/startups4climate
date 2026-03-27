'use client'

import { useState } from 'react'
import { ChevronDown, Save, CheckCircle2, FileText } from 'lucide-react'
import { useToolState } from '@/lib/useToolState'
import type { ToolComponentProps } from './ToolPage'

interface Data {
  [key: string]: string | number
  awareness: string
  awarenessConversion: number | string
  interes: string
  interesConversion: number | string
  evaluacion: string
  evaluacionConversion: number | string
  compra: string
  compraConversion: number | string
  onboarding: string
  canales: string
  costoCanal: string
}

const DEFAULT: Data = {
  awareness: '', awarenessConversion: '',
  interes: '', interesConversion: '',
  evaluacion: '', evaluacionConversion: '',
  compra: '', compraConversion: '',
  onboarding: '', canales: '', costoCanal: '',
}

const STAGES = [
  { key: 'awareness', title: 'Awareness', convKey: 'awarenessConversion', ph: '¿Cómo generas conocimiento de tu marca? ¿Qué canales usas?' },
  { key: 'interes', title: 'Interés', convKey: 'interesConversion', ph: '¿Cómo conviertes awareness en interés activo?' },
  { key: 'evaluacion', title: 'Evaluación', convKey: 'evaluacionConversion', ph: '¿Qué hace el prospecto para evaluar tu solución?' },
  { key: 'compra', title: 'Compra', convKey: 'compraConversion', ph: '¿Cuál es el proceso de cierre de venta?' },
]

export default function CustomerAcquisitionProcess({ userId, onComplete, onGenerateReport }: ToolComponentProps) {
  const [data, setData] = useToolState<Data>(userId, 'customer-acquisition-process', DEFAULT)
  const [openSections, setOpenSections] = useState<Record<string, boolean>>({})
  const [saved, setSaved] = useState(false)
  const toggle = (k: string) => setOpenSections(p => ({ ...p, [k]: !p[k] }))
  const handleSave = () => { setSaved(true); setTimeout(() => setSaved(false), 2000) }

  const handleReport = () => {
    const content = `
PROCESO DE ADQUISICIÓN DE CLIENTES

${STAGES.map(s => `ETAPA ${s.title.toUpperCase()}:
${(data as Record<string, string>)[s.key] || '(No completado)'}
Tasa de conversión: ${(data as Record<string, string>)[s.convKey] || '(No definida)'}%`).join('\n\n')}

ONBOARDING:
${data.onboarding || '(No completado)'}

CANALES PRIORITARIOS:
${data.canales || '(No completado)'}

COSTO ESTIMADO POR CANAL:
${data.costoCanal || '(No completado)'}
    `.trim()
    onGenerateReport(content)
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
      {/* Funnel stages - each has textarea (collapsible) + conversion rate (always visible) */}
      {STAGES.map(s => (
        <div key={s.key} style={cardStyle}>
          <div style={{ padding: '1rem 1.25rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={headingStyle}>Etapa: {s.title}</span>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <label style={{ ...labelStyle, margin: 0 }}>Conversión:</label>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                <input type="number" value={(data as Record<string, string>)[s.convKey]} onChange={e => setData(p => ({ ...p, [s.convKey]: e.target.value }))} placeholder="0" style={{ ...inputStyle, width: 70, textAlign: 'center' }} />
                <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.8125rem', color: 'var(--color-text-muted)' }}>%</span>
              </div>
            </div>
          </div>
          <div style={{ padding: '0 1.25rem' }}>
            <button onClick={() => toggle(s.key)} style={{ ...sectionBtnSmall, marginBottom: openSections[s.key] ? '0.75rem' : '0.75rem' }}>
              <span style={{ fontSize: '0.8125rem', fontWeight: 600, color: 'var(--color-text-secondary)', fontFamily: 'var(--font-body)' }}>Descripción de la etapa</span>
              <ChevronDown size={14} color="var(--color-text-muted)" style={{ transform: openSections[s.key] ? 'rotate(180deg)' : 'rotate(0)', transition: 'transform 0.2s' }} />
            </button>
            {openSections[s.key] && (
              <div style={{ paddingBottom: '1rem' }}>
                <textarea value={(data as Record<string, string>)[s.key]} onChange={e => setData(p => ({ ...p, [s.key]: e.target.value }))} placeholder={s.ph} rows={3} style={taStyle} />
              </div>
            )}
          </div>
        </div>
      ))}

      <Collapsible title="Onboarding" k="onboarding" open={openSections} toggle={toggle}>
        <textarea value={data.onboarding} onChange={e => setData(p => ({ ...p, onboarding: e.target.value }))} placeholder="¿Cómo es el proceso de onboarding del nuevo cliente?" rows={4} style={taStyle} />
      </Collapsible>

      <Collapsible title="Canales prioritarios" k="canales" open={openSections} toggle={toggle}>
        <textarea value={data.canales} onChange={e => setData(p => ({ ...p, canales: e.target.value }))} placeholder="¿Cuáles son los canales más efectivos para llegar a tus clientes?" rows={4} style={taStyle} />
      </Collapsible>

      <Collapsible title="Costo estimado por canal" k="costoCanal" open={openSections} toggle={toggle}>
        <textarea value={data.costoCanal} onChange={e => setData(p => ({ ...p, costoCanal: e.target.value }))} placeholder="¿Cuánto cuesta adquirir un cliente por cada canal?" rows={4} style={taStyle} />
      </Collapsible>

      <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap', marginTop: '0.5rem' }}>
        <button onClick={handleSave} style={btnOG}><Save size={15} /> {saved ? '¡Guardado!' : 'Guardar progreso'}</button>
        <button onClick={onComplete} style={btnSG}><CheckCircle2 size={15} /> Marcar como completada</button>
        <button onClick={handleReport} style={btnO}><FileText size={15} /> Generar reporte</button>
      </div>
    </div>
  )
}

function Collapsible({ title, k, open, toggle, children }: { title: string; k: string; open: Record<string, boolean>; toggle: (k: string) => void; children: React.ReactNode }) {
  return (
    <div style={cardStyle}>
      <button onClick={() => toggle(k)} style={sectionBtn}>
        <span style={headingStyle}>{title}</span>
        <ChevronDown size={18} color="var(--color-text-muted)" style={{ transition: 'transform 0.2s', transform: open[k] ? 'rotate(180deg)' : 'rotate(0)' }} />
      </button>
      {open[k] && <div style={{ padding: '0 1.25rem 1.25rem' }}>{children}</div>}
    </div>
  )
}

const cardStyle: React.CSSProperties = { background: 'var(--color-bg-card)', borderRadius: 14, border: '1px solid var(--color-border)', overflow: 'hidden' }
const headingStyle: React.CSSProperties = { fontFamily: 'var(--font-heading)', fontSize: '0.9375rem', fontWeight: 700, color: 'var(--color-text-primary)' }
const sectionBtn: React.CSSProperties = { width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '1rem 1.25rem', background: 'none', border: 'none', cursor: 'pointer' }
const sectionBtnSmall: React.CSSProperties = { width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0.5rem 0', background: 'none', border: 'none', cursor: 'pointer' }
const inputStyle: React.CSSProperties = { width: '100%', padding: '0.625rem 0.875rem', borderRadius: 8, border: '1px solid var(--color-border)', background: 'var(--color-bg-card)', fontFamily: 'var(--font-body)', fontSize: '0.875rem', color: 'var(--color-text-primary)', outline: 'none' }
const taStyle: React.CSSProperties = { ...inputStyle, resize: 'vertical' as const, lineHeight: 1.6 }
const labelStyle: React.CSSProperties = { fontFamily: 'var(--font-mono)', fontSize: '0.75rem', color: 'var(--color-text-muted)', marginBottom: '0.25rem', display: 'block' }
const btnOG: React.CSSProperties = { display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.75rem 1.25rem', borderRadius: 10, fontFamily: 'var(--font-body)', fontSize: '0.875rem', fontWeight: 600, background: 'transparent', color: '#059669', border: '1.5px solid #05966940', cursor: 'pointer' }
const btnSG: React.CSSProperties = { display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.75rem 1.25rem', borderRadius: 10, fontFamily: 'var(--font-body)', fontSize: '0.875rem', fontWeight: 600, background: '#059669', color: 'white', border: 'none', cursor: 'pointer', boxShadow: '0 2px 8px rgba(5,150,105,0.3)' }
const btnO: React.CSSProperties = { display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.75rem 1.25rem', borderRadius: 10, fontFamily: 'var(--font-body)', fontSize: '0.875rem', fontWeight: 600, background: 'transparent', color: 'var(--color-text-secondary)', border: '1.5px solid var(--color-border)', cursor: 'pointer' }
