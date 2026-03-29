'use client'

import { useState } from 'react'
import { ChevronDown, Save, CheckCircle2, FileText } from 'lucide-react'
import { useToolState } from '@/lib/useToolState'
import type { ToolComponentProps } from './ToolPage'

interface Data {
  mercado: string
  justificacion: string
  tamano: number | string
  moneda: string
  accesibilidad: number
  planExpansion: string
}

const DEFAULT: Data = { mercado: '', justificacion: '', tamano: '', moneda: 'USD', accesibilidad: 3, planExpansion: '' }

export default function BeachheadMarket({ userId, onComplete, onGenerateReport }: ToolComponentProps) {
  const [data, setData] = useToolState<Data>(userId, 'beachhead-market', DEFAULT)
  const [openSections, setOpenSections] = useState<Record<string, boolean>>({})
  const [saved, setSaved] = useState(false)
  const toggle = (k: string) => setOpenSections(p => ({ ...p, [k]: !p[k] }))
  const handleSave = () => { setSaved(true); setTimeout(() => setSaved(false), 2000) }

  const handleReport = () => {
    const content = `
MERCADO CABEZA DE PLAYA

MERCADO INICIAL SELECCIONADO:
${data.mercado || '(No completado)'}

JUSTIFICACIÓN:
${data.justificacion || '(No completado)'}

TAMAÑO ESTIMADO:
${data.tamano ? `${data.moneda} ${Number(data.tamano).toLocaleString()}` : '(No completado)'}

ACCESIBILIDAD: ${data.accesibilidad}/5

PLAN DE EXPANSIÓN FUTURA:
${data.planExpansion || '(No completado)'}
    `.trim()
    onGenerateReport(content)
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
      <Collapsible title="Mercado inicial seleccionado" k="mercado" open={openSections} toggle={toggle}>
        <input value={data.mercado} onChange={e => setData(p => ({ ...p, mercado: e.target.value }))} placeholder="Nombre del mercado inicial que atacarás primero" style={inputStyle} />
      </Collapsible>

      <Collapsible title="Justificación" k="justificacion" open={openSections} toggle={toggle}>
        <textarea value={data.justificacion} onChange={e => setData(p => ({ ...p, justificacion: e.target.value }))} placeholder="¿Por qué elegiste este mercado como punto de entrada?" rows={4} style={taStyle} />
      </Collapsible>

      {/* Number sections - always visible */}
      <div style={cardStyle}>
        <div style={{ padding: '1rem 1.25rem' }}>
          <span style={headingStyle}>Tamaño estimado y accesibilidad</span>
        </div>
        <div style={{ padding: '0 1.25rem 1.25rem' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr auto', gap: '0.625rem', marginBottom: '1rem' }}>
            <div style={{ position: 'relative' }}>
              <span style={{ position: 'absolute', left: '0.75rem', top: '50%', transform: 'translateY(-50%)', fontFamily: 'var(--font-body)', fontSize: '0.75rem', color: 'var(--color-text-muted)', pointerEvents: 'none' }}>$</span>
              <input type="number" value={data.tamano} onChange={e => setData(p => ({ ...p, tamano: e.target.value }))} placeholder="Ej: 5000000" step="100000" style={{ ...inputStyle, paddingLeft: '1.75rem' }} />
            </div>
            <select value={data.moneda} onChange={e => setData(p => ({ ...p, moneda: e.target.value }))} style={{ ...inputStyle, width: 'auto' }}>
              <option value="USD">USD</option>
              <option value="EUR">EUR</option>
              <option value="MXN">MXN</option>
              <option value="CLP">CLP</option>
              <option value="COP">COP</option>
              <option value="BRL">BRL</option>
            </select>
          </div>
          <label style={labelStyle}>Accesibilidad: {data.accesibilidad}/5</label>
          <input type="range" min={1} max={5} step={1} value={data.accesibilidad} onChange={e => setData(p => ({ ...p, accesibilidad: parseInt(e.target.value) }))} style={{ width: '100%' }} />
          <div style={{ display: 'flex', justifyContent: 'space-between', fontFamily: 'var(--font-body)', fontSize: '0.5625rem', color: 'var(--color-text-muted)', marginTop: '0.125rem' }}>
            <span>1 = Muy bajo</span><span>3 = Medio</span><span>5 = Muy alto</span>
          </div>
        </div>
      </div>

      <Collapsible title="Plan de expansión futura" k="planExpansion" open={openSections} toggle={toggle}>
        <textarea value={data.planExpansion} onChange={e => setData(p => ({ ...p, planExpansion: e.target.value }))} placeholder="¿Cómo planeas expandirte a otros mercados después de dominar el beachhead?" rows={4} style={taStyle} />
      </Collapsible>

      <BtnBar saved={saved} onSave={handleSave} onComplete={onComplete} onReport={handleReport} />
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
function BtnBar({ saved, onSave, onComplete, onReport }: { saved: boolean; onSave: () => void; onComplete: () => void; onReport: () => void }) {
  return (
    <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap', marginTop: '0.5rem' }}>
      <button onClick={onSave} style={btnOG}><Save size={15} /> {saved ? '¡Guardado!' : 'Guardar progreso'}</button>
      <button onClick={onComplete} style={btnSG}><CheckCircle2 size={15} /> Marcar como completada</button>
      <button onClick={onReport} style={btnO}><FileText size={15} /> Generar reporte</button>
    </div>
  )
}

const cardStyle: React.CSSProperties = { background: 'var(--color-bg-card)', borderRadius: 14, border: '1px solid var(--color-border)', overflow: 'hidden' }
const headingStyle: React.CSSProperties = { fontFamily: 'var(--font-heading)', fontSize: '0.9375rem', fontWeight: 700, color: 'var(--color-text-primary)' }
const sectionBtn: React.CSSProperties = { width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '1rem 1.25rem', background: 'none', border: 'none', cursor: 'pointer' }
const inputStyle: React.CSSProperties = { width: '100%', padding: '0.625rem 0.875rem', borderRadius: 8, border: '1px solid var(--color-border)', background: 'var(--color-bg-card)', fontFamily: 'var(--font-body)', fontSize: '0.875rem', color: 'var(--color-text-primary)', outline: 'none' }
const taStyle: React.CSSProperties = { ...inputStyle, resize: 'vertical' as const, lineHeight: 1.6 }
const labelStyle: React.CSSProperties = { fontFamily: 'var(--font-body)', fontSize: '0.75rem', color: 'var(--color-text-muted)', marginBottom: '0.25rem', display: 'block' }
const btnOG: React.CSSProperties = { display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.75rem 1.25rem', borderRadius: 10, fontFamily: 'var(--font-body)', fontSize: '0.875rem', fontWeight: 600, background: 'transparent', color: '#0D9488', border: '1.5px solid #0D948840', cursor: 'pointer' }
const btnSG: React.CSSProperties = { display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.75rem 1.25rem', borderRadius: 10, fontFamily: 'var(--font-body)', fontSize: '0.875rem', fontWeight: 600, background: '#0D9488', color: 'white', border: 'none', cursor: 'pointer', boxShadow: '0 2px 8px rgba(13,148,136,0.3)' }
const btnO: React.CSSProperties = { display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.75rem 1.25rem', borderRadius: 10, fontFamily: 'var(--font-body)', fontSize: '0.875rem', fontWeight: 600, background: 'transparent', color: 'var(--color-text-secondary)', border: '1.5px solid var(--color-border)', cursor: 'pointer' }
