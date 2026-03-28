'use client'

import { useState } from 'react'
import { ChevronDown, Save, CheckCircle2, FileText } from 'lucide-react'
import { useToolState } from '@/lib/useToolState'
import type { ToolComponentProps } from './ToolPage'

interface Data {
  ahorroEconomico: number | string
  ahorroTiempo: number | string
  reduccionRiesgo: string
  statusQuo: string
  comparacion: string
  roi: number | string
}

const DEFAULT: Data = { ahorroEconomico: '', ahorroTiempo: '', reduccionRiesgo: '', statusQuo: '', comparacion: '', roi: '' }

export default function QuantifiedValueProp({ userId, onComplete, onGenerateReport }: ToolComponentProps) {
  const [data, setData] = useToolState<Data>(userId, 'quantified-value-prop', DEFAULT)
  const [openSections, setOpenSections] = useState<Record<string, boolean>>({})
  const [saved, setSaved] = useState(false)
  const toggle = (k: string) => setOpenSections(p => ({ ...p, [k]: !p[k] }))
  const handleSave = () => { setSaved(true); setTimeout(() => setSaved(false), 2000) }

  const handleReport = () => {
    const content = `
PROPUESTA DE VALOR CUANTIFICADA

VALOR ENTREGADO:
- Ahorro económico: $${Number(data.ahorroEconomico).toLocaleString()}/año
- Ahorro de tiempo: ${data.ahorroTiempo} horas/mes
- ROI estimado para el cliente: ${data.roi}%

REDUCCIÓN DE RIESGO:
${data.reduccionRiesgo || '(No completado)'}

STATUS QUO ACTUAL DEL CLIENTE:
${data.statusQuo || '(No completado)'}

COMPARACIÓN CUANTIFICADA:
${data.comparacion || '(No completado)'}
    `.trim()
    onGenerateReport(content)
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
      {/* Number sections - always visible */}
      <div style={cardStyle}>
        <div style={{ padding: '1rem 1.25rem' }}><span style={headingStyle}>Valor entregado al cliente</span></div>
        <div style={{ padding: '0 1.25rem 1.25rem' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '0.75rem' }}>
            <div>
              <label style={labelStyle}>Ahorro económico (anual)</label>
              <div style={{ position: 'relative' }}>
                <span style={prefixStyle}>$</span>
                <input type="number" value={data.ahorroEconomico} onChange={e => setData(p => ({ ...p, ahorroEconomico: e.target.value }))} placeholder="Ej: 50000" step="1000" style={{ ...inputStyle, paddingLeft: '1.75rem' }} />
              </div>
            </div>
            <div>
              <label style={labelStyle}>Ahorro de tiempo (mensual)</label>
              <div style={{ position: 'relative' }}>
                <input type="number" value={data.ahorroTiempo} onChange={e => setData(p => ({ ...p, ahorroTiempo: e.target.value }))} placeholder="Ej: 40" step="1" style={{ ...inputStyle, paddingRight: '2.5rem' }} />
                <span style={suffixStyle}>hrs</span>
              </div>
            </div>
            <div>
              <label style={labelStyle}>ROI estimado</label>
              <div style={{ position: 'relative' }}>
                <input type="number" value={data.roi} onChange={e => setData(p => ({ ...p, roi: e.target.value }))} placeholder="Ej: 300" step="1" style={{ ...inputStyle, paddingRight: '2.5rem' }} />
                <span style={suffixStyle}>%</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <Collapsible title="Reducción de riesgo" k="reduccionRiesgo" open={openSections} toggle={toggle}>
        <textarea value={data.reduccionRiesgo} onChange={e => setData(p => ({ ...p, reduccionRiesgo: e.target.value }))} placeholder="¿Qué riesgos reduces para el cliente? ¿Cómo los cuantificas?" rows={4} style={taStyle} />
      </Collapsible>

      <Collapsible title="Status quo actual del cliente" k="statusQuo" open={openSections} toggle={toggle}>
        <textarea value={data.statusQuo} onChange={e => setData(p => ({ ...p, statusQuo: e.target.value }))} placeholder="¿Cómo resuelve el cliente este problema hoy? ¿Cuánto le cuesta en tiempo, dinero y frustración?" rows={4} style={taStyle} />
      </Collapsible>

      <Collapsible title="Comparación cuantificada" k="comparacion" open={openSections} toggle={toggle}>
        <textarea value={data.comparacion} onChange={e => setData(p => ({ ...p, comparacion: e.target.value }))} placeholder="Compara numéricamente: antes vs después de usar tu solución" rows={4} style={taStyle} />
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
const inputStyle: React.CSSProperties = { width: '100%', padding: '0.625rem 0.875rem', borderRadius: 8, border: '1px solid var(--color-border)', background: 'var(--color-bg-card)', fontFamily: 'var(--font-body)', fontSize: '0.875rem', color: 'var(--color-text-primary)', outline: 'none' }
const taStyle: React.CSSProperties = { ...inputStyle, resize: 'vertical' as const, lineHeight: 1.6 }
const labelStyle: React.CSSProperties = { fontFamily: 'var(--font-mono)', fontSize: '0.75rem', color: 'var(--color-text-muted)', marginBottom: '0.375rem', display: 'block' }
const btnOG: React.CSSProperties = { display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.75rem 1.25rem', borderRadius: 10, fontFamily: 'var(--font-body)', fontSize: '0.875rem', fontWeight: 600, background: 'transparent', color: '#059669', border: '1.5px solid #05966940', cursor: 'pointer' }
const btnSG: React.CSSProperties = { display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.75rem 1.25rem', borderRadius: 10, fontFamily: 'var(--font-body)', fontSize: '0.875rem', fontWeight: 600, background: '#059669', color: 'white', border: 'none', cursor: 'pointer', boxShadow: '0 2px 8px rgba(5,150,105,0.3)' }
const btnO: React.CSSProperties = { display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.75rem 1.25rem', borderRadius: 10, fontFamily: 'var(--font-body)', fontSize: '0.875rem', fontWeight: 600, background: 'transparent', color: 'var(--color-text-secondary)', border: '1.5px solid var(--color-border)', cursor: 'pointer' }
const prefixStyle: React.CSSProperties = { position: 'absolute', left: '0.75rem', top: '50%', transform: 'translateY(-50%)', fontFamily: 'var(--font-mono)', fontSize: '0.75rem', color: 'var(--color-text-muted)', pointerEvents: 'none' }
const suffixStyle: React.CSSProperties = { position: 'absolute', right: '0.75rem', top: '50%', transform: 'translateY(-50%)', fontFamily: 'var(--font-mono)', fontSize: '0.75rem', color: 'var(--color-text-muted)', pointerEvents: 'none' }
