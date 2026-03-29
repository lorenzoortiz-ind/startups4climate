'use client'

import { useState } from 'react'
import { ChevronDown, Save, CheckCircle2, FileText, Plus, Trash2 } from 'lucide-react'
import { useToolState } from '@/lib/useToolState'
import type { ToolComponentProps } from './ToolPage'

interface Segment { name: string; industry: string; sizeEstimate: string; accessibility: number }
interface Data {
  segments: Segment[]
  criterios: string
  topOportunidades: string
}

const DEFAULT: Data = {
  segments: [{ name: '', industry: '', sizeEstimate: '', accessibility: 3 }],
  criterios: '',
  topOportunidades: '',
}

export default function MarketSegmentation({ userId, onComplete, onGenerateReport }: ToolComponentProps) {
  const [data, setData] = useToolState<Data>(userId, 'market-segmentation', DEFAULT)
  const [openSections, setOpenSections] = useState<Record<string, boolean>>({})
  const [saved, setSaved] = useState(false)

  const toggle = (k: string) => setOpenSections(p => ({ ...p, [k]: !p[k] }))

  const updateSegment = (i: number, field: keyof Segment, value: string | number) => {
    setData(p => {
      const segments = [...p.segments]
      segments[i] = { ...segments[i], [field]: value }
      return { ...p, segments }
    })
  }
  const addSegment = () => setData(p => ({ ...p, segments: [...p.segments, { name: '', industry: '', sizeEstimate: '', accessibility: 3 }] }))
  const removeSegment = (i: number) => setData(p => ({ ...p, segments: p.segments.filter((_, idx) => idx !== i) }))

  const handleSave = () => { setSaved(true); setTimeout(() => setSaved(false), 2000) }

  const handleReport = () => {
    const content = `
SEGMENTACIÓN DE MERCADO

SEGMENTOS POTENCIALES:
${data.segments.map((s, i) => `${i + 1}. ${s.name || '(Sin nombre)'}
   Industria: ${s.industry || '-'}
   Tamaño estimado: ${s.sizeEstimate || '-'}
   Accesibilidad: ${s.accessibility}/5`).join('\n')}

CRITERIOS DE EVALUACIÓN:
${data.criterios || '(No completado)'}

TOP OPORTUNIDADES SELECCIONADAS:
${data.topOportunidades || '(No completado)'}
    `.trim()
    onGenerateReport(content)
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
      {/* Segments - always visible since it has number inputs */}
      <div style={cardStyle}>
        <div style={cardHeader}>
          <span style={headingStyle}>Lista de segmentos potenciales</span>
        </div>
        <div style={{ padding: '0 1.25rem 1.25rem' }}>
          {data.segments.map((s, i) => (
            <div key={i} style={{ padding: '1rem', borderRadius: 10, border: '1px solid var(--color-border)', marginBottom: '0.75rem', background: 'var(--color-bg-primary)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
                <span style={{ fontFamily: 'var(--font-heading)', fontSize: '0.8125rem', fontWeight: 700, color: 'var(--color-text-secondary)' }}>Segmento {i + 1}</span>
                {data.segments.length > 1 && (
                  <button onClick={() => removeSegment(i)} style={btnDanger}><Trash2 size={12} /> Eliminar</button>
                )}
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.625rem', marginBottom: '0.625rem' }}>
                <input value={s.name} onChange={e => updateSegment(i, 'name', e.target.value)} placeholder="Nombre del segmento" style={inputStyle} />
                <input value={s.industry} onChange={e => updateSegment(i, 'industry', e.target.value)} placeholder="Industria" style={inputStyle} />
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.625rem' }}>
                <input value={s.sizeEstimate} onChange={e => updateSegment(i, 'sizeEstimate', e.target.value)} placeholder="Tamaño estimado" style={inputStyle} />
                <div>
                  <label style={labelStyle}>Accesibilidad: {s.accessibility}/5</label>
                  <input type="range" min={1} max={5} step={1} value={s.accessibility} onChange={e => updateSegment(i, 'accessibility', parseInt(e.target.value))} style={{ width: '100%' }} />
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontFamily: 'var(--font-body)', fontSize: '0.5625rem', color: 'var(--color-text-muted)', marginTop: '0.125rem' }}>
                    <span>1 = Muy bajo</span><span>3 = Medio</span><span>5 = Muy alto</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
          <button onClick={addSegment} style={btnAdd}><Plus size={14} /> Agregar segmento</button>
        </div>
      </div>

      <CollapsibleSection title="Criterios de evaluación" sectionKey="criterios" open={openSections} toggle={toggle}>
        <textarea value={data.criterios} onChange={e => setData(p => ({ ...p, criterios: e.target.value }))} placeholder="¿Qué criterios usas para evaluar y priorizar estos segmentos?" rows={4} style={taStyle} />
      </CollapsibleSection>

      <CollapsibleSection title="Top oportunidades seleccionadas" sectionKey="topOportunidades" open={openSections} toggle={toggle}>
        <textarea value={data.topOportunidades} onChange={e => setData(p => ({ ...p, topOportunidades: e.target.value }))} placeholder="¿Cuáles son los 2-3 segmentos más prometedores y por qué?" rows={4} style={taStyle} />
      </CollapsibleSection>

      <ButtonBar saved={saved} onSave={handleSave} onComplete={onComplete} onReport={handleReport} />
    </div>
  )
}

function CollapsibleSection({ title, sectionKey, open, toggle, children }: { title: string; sectionKey: string; open: Record<string, boolean>; toggle: (k: string) => void; children: React.ReactNode }) {
  return (
    <div style={cardStyle}>
      <button onClick={() => toggle(sectionKey)} style={sectionBtn}>
        <span style={headingStyle}>{title}</span>
        <ChevronDown size={18} color="var(--color-text-muted)" style={{ transition: 'transform 0.2s', transform: open[sectionKey] ? 'rotate(180deg)' : 'rotate(0)' }} />
      </button>
      {open[sectionKey] && <div style={{ padding: '0 1.25rem 1.25rem' }}>{children}</div>}
    </div>
  )
}

function ButtonBar({ saved, onSave, onComplete, onReport }: { saved: boolean; onSave: () => void; onComplete: () => void; onReport: () => void }) {
  return (
    <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap', marginTop: '0.5rem' }}>
      <button onClick={onSave} style={btnOutlineGreen}><Save size={15} /> {saved ? '¡Guardado!' : 'Guardar progreso'}</button>
      <button onClick={onComplete} style={btnSolidGreen}><CheckCircle2 size={15} /> Marcar como completada</button>
      <button onClick={onReport} style={btnOutline}><FileText size={15} /> Generar reporte</button>
    </div>
  )
}

const cardStyle: React.CSSProperties = { background: 'var(--color-bg-card)', borderRadius: 14, border: '1px solid var(--color-border)', overflow: 'hidden' }
const cardHeader: React.CSSProperties = { padding: '1rem 1.25rem' }
const headingStyle: React.CSSProperties = { fontFamily: 'var(--font-heading)', fontSize: '0.9375rem', fontWeight: 700, color: 'var(--color-text-primary)' }
const sectionBtn: React.CSSProperties = { width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '1rem 1.25rem', background: 'none', border: 'none', cursor: 'pointer' }
const inputStyle: React.CSSProperties = { width: '100%', padding: '0.625rem 0.875rem', borderRadius: 8, border: '1px solid var(--color-border)', background: 'var(--color-bg-card)', fontFamily: 'var(--font-body)', fontSize: '0.875rem', color: 'var(--color-text-primary)', outline: 'none' }
const taStyle: React.CSSProperties = { ...inputStyle, resize: 'vertical' as const, lineHeight: 1.6 }
const labelStyle: React.CSSProperties = { fontFamily: 'var(--font-body)', fontSize: '0.75rem', color: 'var(--color-text-muted)', marginBottom: '0.25rem', display: 'block' }
const btnDanger: React.CSSProperties = { display: 'flex', alignItems: 'center', gap: '0.25rem', padding: '0.35rem 0.75rem', borderRadius: 6, fontSize: '0.75rem', fontFamily: 'var(--font-body)', fontWeight: 600, background: 'transparent', color: '#DC2626', border: '1px solid #DC262630', cursor: 'pointer' }
const btnAdd: React.CSSProperties = { display: 'flex', alignItems: 'center', gap: '0.375rem', padding: '0.5rem 1rem', borderRadius: 8, fontSize: '0.8125rem', fontFamily: 'var(--font-body)', fontWeight: 600, background: 'transparent', color: '#0D9488', border: '1px solid #0D948830', cursor: 'pointer' }
const btnOutlineGreen: React.CSSProperties = { display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.75rem 1.25rem', borderRadius: 10, fontFamily: 'var(--font-body)', fontSize: '0.875rem', fontWeight: 600, background: 'transparent', color: '#0D9488', border: '1.5px solid #0D948840', cursor: 'pointer' }
const btnSolidGreen: React.CSSProperties = { display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.75rem 1.25rem', borderRadius: 10, fontFamily: 'var(--font-body)', fontSize: '0.875rem', fontWeight: 600, background: '#0D9488', color: 'white', border: 'none', cursor: 'pointer', boxShadow: '0 2px 8px rgba(13,148,136,0.3)' }
const btnOutline: React.CSSProperties = { display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.75rem 1.25rem', borderRadius: 10, fontFamily: 'var(--font-body)', fontSize: '0.875rem', fontWeight: 600, background: 'transparent', color: 'var(--color-text-secondary)', border: '1.5px solid var(--color-border)', cursor: 'pointer' }
