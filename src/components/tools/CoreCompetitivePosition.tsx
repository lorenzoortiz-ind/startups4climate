'use client'

import { useState } from 'react'
import { ChevronDown, Save, CheckCircle2, FileText } from 'lucide-react'
import { useToolState } from '@/lib/useToolState'
import type { ToolComponentProps } from './ToolPage'

interface Data {
  definicionCore: string
  barreras: string
  ejeXLabel: string
  ejeYLabel: string
  tuX: number | string
  tuY: number | string
  comp1Name: string
  comp1X: number | string
  comp1Y: number | string
  comp2Name: string
  comp2X: number | string
  comp2Y: number | string
}

const DEFAULT: Data = {
  definicionCore: '', barreras: '',
  ejeXLabel: '', ejeYLabel: '',
  tuX: 5, tuY: 5,
  comp1Name: '', comp1X: 5, comp1Y: 5,
  comp2Name: '', comp2X: 5, comp2Y: 5,
}

export default function CoreCompetitivePosition({ userId, onComplete, onGenerateReport }: ToolComponentProps) {
  const [data, setData] = useToolState<Data>(userId, 'core-competitive-position', DEFAULT)
  const [openSections, setOpenSections] = useState<Record<string, boolean>>({})
  const [saved, setSaved] = useState(false)
  const toggle = (k: string) => setOpenSections(p => ({ ...p, [k]: !p[k] }))
  const handleSave = () => { setSaved(true); setTimeout(() => setSaved(false), 2000) }

  const handleReport = () => {
    const content = `
POSICIÓN COMPETITIVA CORE

DEFINICIÓN DEL CORE:
${data.definicionCore || '(No completado)'}

BARRERAS DE ENTRADA:
${data.barreras || '(No completado)'}

MAPA DE POSICIONAMIENTO:
- Eje X: ${data.ejeXLabel || '(No definido)'}
- Eje Y: ${data.ejeYLabel || '(No definido)'}
- Tu posición: (${data.tuX}, ${data.tuY})
- ${data.comp1Name || 'Competidor 1'}: (${data.comp1X}, ${data.comp1Y})
- ${data.comp2Name || 'Competidor 2'}: (${data.comp2X}, ${data.comp2Y})
    `.trim()
    onGenerateReport(content)
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
      <Collapsible title="Definición del core" k="definicionCore" open={openSections} toggle={toggle}>
        <textarea value={data.definicionCore} onChange={e => setData(p => ({ ...p, definicionCore: e.target.value }))} placeholder="¿Cuál es la capacidad central que te hace competitivo? ¿Qué haces mejor que nadie?" rows={4} style={taStyle} />
      </Collapsible>

      <Collapsible title="Barreras de entrada" k="barreras" open={openSections} toggle={toggle}>
        <textarea value={data.barreras} onChange={e => setData(p => ({ ...p, barreras: e.target.value }))} placeholder="¿Qué barreras protegen tu posición? IP, datos, red de contactos, regulación..." rows={4} style={taStyle} />
      </Collapsible>

      {/* Positioning map - number inputs always visible */}
      <div style={cardStyle}>
        <div style={{ padding: '1rem 1.25rem' }}><span style={headingStyle}>Mapa de posicionamiento</span></div>
        <div style={{ padding: '0 1.25rem 1.25rem' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem', marginBottom: '1rem' }}>
            <div>
              <label style={labelStyle}>Eje X (etiqueta)</label>
              <input value={data.ejeXLabel} onChange={e => setData(p => ({ ...p, ejeXLabel: e.target.value }))} placeholder="Ej: Precio" style={inputStyle} />
            </div>
            <div>
              <label style={labelStyle}>Eje Y (etiqueta)</label>
              <input value={data.ejeYLabel} onChange={e => setData(p => ({ ...p, ejeYLabel: e.target.value }))} placeholder="Ej: Calidad" style={inputStyle} />
            </div>
          </div>

          {/* Tu posición */}
          <div style={{ padding: '0.875rem', borderRadius: 10, border: '2px solid #0D948830', background: '#0D948808', marginBottom: '0.75rem' }}>
            <span style={{ ...labelStyle, color: '#0D9488', fontWeight: 700 }}>Tu startup</span>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.625rem', marginTop: '0.375rem' }}>
              <div>
                <label style={labelStyle}>{data.ejeXLabel || 'Eje X'}: {data.tuX}</label>
                <input type="range" min={1} max={10} value={Number(data.tuX)} onChange={e => setData(p => ({ ...p, tuX: parseInt(e.target.value) }))} style={{ width: '100%' }} />
                <div style={{ display: 'flex', justifyContent: 'space-between', fontFamily: 'var(--font-body)', fontSize: '0.5625rem', color: 'var(--color-text-muted)', marginTop: '0.125rem' }}>
                  <span>1 = Mínimo</span><span>5 = Moderado</span><span>10 = Máximo</span>
                </div>
              </div>
              <div>
                <label style={labelStyle}>{data.ejeYLabel || 'Eje Y'}: {data.tuY}</label>
                <input type="range" min={1} max={10} value={Number(data.tuY)} onChange={e => setData(p => ({ ...p, tuY: parseInt(e.target.value) }))} style={{ width: '100%' }} />
                <div style={{ display: 'flex', justifyContent: 'space-between', fontFamily: 'var(--font-body)', fontSize: '0.5625rem', color: 'var(--color-text-muted)', marginTop: '0.125rem' }}>
                  <span>1 = Mínimo</span><span>5 = Moderado</span><span>10 = Máximo</span>
                </div>
              </div>
            </div>
          </div>

          {/* Competidores */}
          {[
            { label: 'Competidor 1', nameKey: 'comp1Name' as const, xKey: 'comp1X' as const, yKey: 'comp1Y' as const },
            { label: 'Competidor 2', nameKey: 'comp2Name' as const, xKey: 'comp2X' as const, yKey: 'comp2Y' as const },
          ].map(comp => (
            <div key={comp.label} style={{ padding: '0.875rem', borderRadius: 10, border: '1px solid var(--color-border)', marginBottom: '0.75rem' }}>
              <input value={data[comp.nameKey] as string} onChange={e => setData(p => ({ ...p, [comp.nameKey]: e.target.value }))} placeholder={`Nombre del ${comp.label.toLowerCase()}`} style={{ ...inputStyle, marginBottom: '0.5rem' }} />
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.625rem' }}>
                <div>
                  <label style={labelStyle}>{data.ejeXLabel || 'Eje X'}: {data[comp.xKey] as number}</label>
                  <input type="range" min={1} max={10} value={Number(data[comp.xKey])} onChange={e => setData(p => ({ ...p, [comp.xKey]: parseInt(e.target.value) }))} style={{ width: '100%' }} />
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontFamily: 'var(--font-body)', fontSize: '0.5625rem', color: 'var(--color-text-muted)', marginTop: '0.125rem' }}>
                    <span>1 = Mínimo</span><span>5 = Moderado</span><span>10 = Máximo</span>
                  </div>
                </div>
                <div>
                  <label style={labelStyle}>{data.ejeYLabel || 'Eje Y'}: {data[comp.yKey] as number}</label>
                  <input type="range" min={1} max={10} value={Number(data[comp.yKey])} onChange={e => setData(p => ({ ...p, [comp.yKey]: parseInt(e.target.value) }))} style={{ width: '100%' }} />
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontFamily: 'var(--font-body)', fontSize: '0.5625rem', color: 'var(--color-text-muted)', marginTop: '0.125rem' }}>
                    <span>1 = Mínimo</span><span>5 = Moderado</span><span>10 = Máximo</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
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
const labelStyle: React.CSSProperties = { fontFamily: 'var(--font-body)', fontSize: '0.75rem', color: 'var(--color-text-muted)', marginBottom: '0.25rem', display: 'block' }
const btnOG: React.CSSProperties = { display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.75rem 1.25rem', borderRadius: 10, fontFamily: 'var(--font-body)', fontSize: '0.875rem', fontWeight: 600, background: 'transparent', color: '#0D9488', border: '1.5px solid #0D948840', cursor: 'pointer' }
const btnSG: React.CSSProperties = { display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.75rem 1.25rem', borderRadius: 10, fontFamily: 'var(--font-body)', fontSize: '0.875rem', fontWeight: 600, background: '#0D9488', color: 'white', border: 'none', cursor: 'pointer', boxShadow: '0 2px 8px rgba(13,148,136,0.3)' }
const btnO: React.CSSProperties = { display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.75rem 1.25rem', borderRadius: 10, fontFamily: 'var(--font-body)', fontSize: '0.875rem', fontWeight: 600, background: 'transparent', color: 'var(--color-text-secondary)', border: '1.5px solid var(--color-border)', cursor: 'pointer' }
