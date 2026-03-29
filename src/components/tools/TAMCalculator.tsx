'use client'

import { useState } from 'react'
import { ChevronDown, Save, CheckCircle2, FileText } from 'lucide-react'
import { useToolState } from '@/lib/useToolState'
import type { ToolComponentProps } from './ToolPage'

interface Data {
  clientes: number | string
  precioAnual: number | string
  metodologia: string
  fuentes: string
}

const DEFAULT: Data = { clientes: '', precioAnual: '', metodologia: '', fuentes: '' }

export default function TAMCalculator({ userId, onComplete, onGenerateReport }: ToolComponentProps) {
  const [data, setData] = useToolState<Data>(userId, 'tam-calculator', DEFAULT)
  const [openSections, setOpenSections] = useState<Record<string, boolean>>({})
  const [saved, setSaved] = useState(false)
  const toggle = (k: string) => setOpenSections(p => ({ ...p, [k]: !p[k] }))
  const handleSave = () => { setSaved(true); setTimeout(() => setSaved(false), 2000) }

  const tam = (Number(data.clientes) || 0) * (Number(data.precioAnual) || 0)

  const handleReport = () => {
    const content = `
CALCULADORA TAM

NÚMERO DE CLIENTES POTENCIALES: ${data.clientes || '(No completado)'}
PRECIO PROMEDIO ANUAL POR CLIENTE: $${Number(data.precioAnual).toLocaleString() || '(No completado)'}
TAM CALCULADO: $${tam.toLocaleString()}

METODOLOGÍA UTILIZADA:
${data.metodologia || '(No completado)'}

FUENTES DE DATOS:
${data.fuentes || '(No completado)'}
    `.trim()
    onGenerateReport(content)
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
      {/* Number inputs - always visible */}
      <div style={cardStyle}>
        <div style={{ padding: '1rem 1.25rem' }}>
          <span style={headingStyle}>Cálculo del TAM</span>
        </div>
        <div style={{ padding: '0 1.25rem 1.25rem' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem', marginBottom: '1rem' }}>
            <div>
              <label style={labelStyle}>Número de clientes potenciales</label>
              <div style={{ position: 'relative' }}>
                <input type="number" value={data.clientes} onChange={e => setData(p => ({ ...p, clientes: e.target.value }))} placeholder="Ej: 10000" step="1" style={inputStyle} />
              </div>
            </div>
            <div>
              <label style={labelStyle}>Precio promedio anual</label>
              <div style={{ position: 'relative' }}>
                <span style={prefixStyle}>$</span>
                <input type="number" value={data.precioAnual} onChange={e => setData(p => ({ ...p, precioAnual: e.target.value }))} placeholder="Ej: 1200" step="1" style={{ ...inputStyle, paddingLeft: '1.75rem' }} />
              </div>
            </div>
          </div>

          {/* TAM display */}
          <div style={{
            padding: '1.25rem', borderRadius: 12, textAlign: 'center',
            background: 'linear-gradient(135deg, #0D9488, #0D9488)',
            color: 'white', boxShadow: '0 4px 14px rgba(13,148,136,0.3)',
          }}>
            <div style={{ fontFamily: 'var(--font-body)', fontSize: '0.6875rem', textTransform: 'uppercase', letterSpacing: '0.05em', opacity: 0.8, marginBottom: '0.375rem' }}>
              TAM Calculado
            </div>
            <div style={{ fontFamily: 'var(--font-heading)', fontSize: '2rem', fontWeight: 400, letterSpacing: '-0.02em' }}>
              ${tam.toLocaleString()}
            </div>
            <div style={{ fontFamily: 'var(--font-body)', fontSize: '0.75rem', opacity: 0.8, marginTop: '0.25rem' }}>
              {Number(data.clientes) || 0} clientes × ${Number(data.precioAnual).toLocaleString() || 0}/año
            </div>
          </div>
        </div>
      </div>

      <Collapsible title="Metodología utilizada" k="metodologia" open={openSections} toggle={toggle}>
        <textarea value={data.metodologia} onChange={e => setData(p => ({ ...p, metodologia: e.target.value }))} placeholder="¿Cómo calculaste estos números? Top-down, bottom-up, o análisis por analogía..." rows={4} style={taStyle} />
      </Collapsible>

      <Collapsible title="Fuentes de datos" k="fuentes" open={openSections} toggle={toggle}>
        <textarea value={data.fuentes} onChange={e => setData(p => ({ ...p, fuentes: e.target.value }))} placeholder="¿De dónde provienen los datos? Reportes de industria, estudios de mercado, datos propios..." rows={4} style={taStyle} />
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
const labelStyle: React.CSSProperties = { fontFamily: 'var(--font-body)', fontSize: '0.75rem', color: 'var(--color-text-muted)', marginBottom: '0.375rem', display: 'block' }
const btnOG: React.CSSProperties = { display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.75rem 1.25rem', borderRadius: 10, fontFamily: 'var(--font-body)', fontSize: '0.875rem', fontWeight: 600, background: 'transparent', color: '#0D9488', border: '1.5px solid #0D948840', cursor: 'pointer' }
const btnSG: React.CSSProperties = { display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.75rem 1.25rem', borderRadius: 10, fontFamily: 'var(--font-body)', fontSize: '0.875rem', fontWeight: 600, background: '#0D9488', color: 'white', border: 'none', cursor: 'pointer', boxShadow: '0 2px 8px rgba(13,148,136,0.3)' }
const btnO: React.CSSProperties = { display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.75rem 1.25rem', borderRadius: 10, fontFamily: 'var(--font-body)', fontSize: '0.875rem', fontWeight: 600, background: 'transparent', color: 'var(--color-text-secondary)', border: '1.5px solid var(--color-border)', cursor: 'pointer' }
const prefixStyle: React.CSSProperties = { position: 'absolute', left: '0.75rem', top: '50%', transform: 'translateY(-50%)', fontFamily: 'var(--font-body)', fontSize: '0.75rem', color: 'var(--color-text-muted)', pointerEvents: 'none' }
