'use client'

import { useState } from 'react'
import { ChevronDown, Save, CheckCircle2, FileText } from 'lucide-react'
import { useToolState } from '@/lib/useToolState'
import type { ToolComponentProps } from './ToolPage'

interface Data {
  precio: number | string
  frecuencia: string
  valorCliente: number | string
  precioAlternativa: number | string
  justificacion: string
  tiers: string
}

const DEFAULT: Data = { precio: '', frecuencia: 'Mensual', valorCliente: '', precioAlternativa: '', justificacion: '', tiers: '' }
const FRECUENCIAS = ['Mensual', 'Anual', 'Por uso', 'Único']

export default function PricingFramework({ userId, onComplete, onGenerateReport }: ToolComponentProps) {
  const [data, setData] = useToolState<Data>(userId, 'pricing-framework', DEFAULT)
  const [openSections, setOpenSections] = useState<Record<string, boolean>>({})
  const [saved, setSaved] = useState(false)
  const toggle = (k: string) => setOpenSections(p => ({ ...p, [k]: !p[k] }))
  const handleSave = () => { setSaved(true); setTimeout(() => setSaved(false), 2000) }

  const ratio = Number(data.precio) > 0 ? (Number(data.valorCliente) / Number(data.precio)).toFixed(1) : '—'

  const handleReport = () => {
    const content = `
FRAMEWORK DE PRICING

PRECIO PROPUESTO: $${Number(data.precio).toLocaleString()} (${data.frecuencia})
VALOR ENTREGADO AL CLIENTE: $${Number(data.valorCliente).toLocaleString()}
RATIO VALOR/PRECIO: ${ratio}x
PRECIO DE ALTERNATIVA MÁS CERCANA: $${Number(data.precioAlternativa).toLocaleString()}

JUSTIFICACIÓN DEL PRECIO:
${data.justificacion || '(No completado)'}

TIERS/PLANES:
${data.tiers || '(No completado)'}
    `.trim()
    onGenerateReport(content)
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
      {/* Number fields - always visible */}
      <div style={cardStyle}>
        <div style={{ padding: '1rem 1.25rem' }}><span style={headingStyle}>Definición de precio</span></div>
        <div style={{ padding: '0 1.25rem 1.25rem' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr auto', gap: '0.75rem', marginBottom: '1rem' }}>
            <div>
              <label style={labelStyle}>Precio propuesto</label>
              <div style={{ position: 'relative' }}>
                <span style={prefixStyle}>$</span>
                <input type="number" value={data.precio} onChange={e => setData(p => ({ ...p, precio: e.target.value }))} placeholder="Ej: 99" step="0.01" style={{ ...inputStyle, paddingLeft: '1.75rem' }} />
              </div>
            </div>
            <div>
              <label style={labelStyle}>Frecuencia</label>
              <select value={data.frecuencia} onChange={e => setData(p => ({ ...p, frecuencia: e.target.value }))} style={inputStyle}>
                {FRECUENCIAS.map(f => <option key={f} value={f}>{f}</option>)}
              </select>
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem', marginBottom: '1rem' }}>
            <div>
              <label style={labelStyle}>Valor entregado al cliente</label>
              <div style={{ position: 'relative' }}>
                <span style={prefixStyle}>$</span>
                <input type="number" value={data.valorCliente} onChange={e => setData(p => ({ ...p, valorCliente: e.target.value }))} placeholder="Ej: 1000" step="1" style={{ ...inputStyle, paddingLeft: '1.75rem' }} />
              </div>
            </div>
            <div>
              <label style={labelStyle}>Precio alternativa más cercana</label>
              <div style={{ position: 'relative' }}>
                <span style={prefixStyle}>$</span>
                <input type="number" value={data.precioAlternativa} onChange={e => setData(p => ({ ...p, precioAlternativa: e.target.value }))} placeholder="Ej: 150" step="1" style={{ ...inputStyle, paddingLeft: '1.75rem' }} />
              </div>
            </div>
          </div>

          {/* Ratio display */}
          <div style={{
            padding: '1rem', borderRadius: 12, textAlign: 'center',
            background: Number(ratio) >= 3 ? 'linear-gradient(135deg, #059669, #10B981)' : Number(ratio) >= 1 ? 'linear-gradient(135deg, #D97706, #F59E0B)' : 'linear-gradient(135deg, #DC2626, #EF4444)',
            color: 'white',
          }}>
            <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.6875rem', textTransform: 'uppercase', letterSpacing: '0.05em', opacity: 0.8 }}>Ratio Valor / Precio</div>
            <div style={{ fontFamily: 'var(--font-heading)', fontSize: '1.75rem', fontWeight: 800 }}>{ratio}x</div>
            <div style={{ fontFamily: 'var(--font-body)', fontSize: '0.75rem', opacity: 0.8 }}>
              {Number(ratio) >= 3 ? 'Excelente — el cliente percibe mucho más valor' : Number(ratio) >= 1 ? 'Aceptable — considera aumentar el valor percibido' : 'Bajo — el precio supera el valor percibido'}
            </div>
          </div>
        </div>
      </div>

      <Collapsible title="Justificación del precio" k="justificacion" open={openSections} toggle={toggle}>
        <textarea value={data.justificacion} onChange={e => setData(p => ({ ...p, justificacion: e.target.value }))} placeholder="¿Por qué este precio es el correcto? ¿Cómo llegaste a esta cifra?" rows={4} style={taStyle} />
      </Collapsible>

      <Collapsible title="Tiers / Planes" k="tiers" open={openSections} toggle={toggle}>
        <textarea value={data.tiers} onChange={e => setData(p => ({ ...p, tiers: e.target.value }))} placeholder="Describe los diferentes planes o niveles de servicio que ofreces" rows={5} style={taStyle} />
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
