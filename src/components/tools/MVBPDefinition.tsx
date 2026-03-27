'use client'

import { useState } from 'react'
import { ChevronDown, Save, CheckCircle2, FileText, Plus, Trash2 } from 'lucide-react'
import { useToolState } from '@/lib/useToolState'
import type { ToolComponentProps } from './ToolPage'

interface Data {
  nombre: string
  featuresIncluidas: string[]
  featuresExcluidas: string[]
  criterioExito: string
  timeline: string
  recursos: string
}

const DEFAULT: Data = {
  nombre: '',
  featuresIncluidas: [''],
  featuresExcluidas: [''],
  criterioExito: '',
  timeline: '',
  recursos: '',
}

export default function MVBPDefinition({ userId, onComplete, onGenerateReport }: ToolComponentProps) {
  const [data, setData] = useToolState<Data>(userId, 'mvbp-definition', DEFAULT)
  const [openSections, setOpenSections] = useState<Record<string, boolean>>({})
  const [saved, setSaved] = useState(false)
  const toggle = (k: string) => setOpenSections(p => ({ ...p, [k]: !p[k] }))
  const handleSave = () => { setSaved(true); setTimeout(() => setSaved(false), 2000) }

  const updateList = (field: 'featuresIncluidas' | 'featuresExcluidas', i: number, v: string) => {
    setData(p => { const list = [...p[field]]; list[i] = v; return { ...p, [field]: list } })
  }
  const addToList = (field: 'featuresIncluidas' | 'featuresExcluidas') => setData(p => ({ ...p, [field]: [...p[field], ''] }))
  const removeFromList = (field: 'featuresIncluidas' | 'featuresExcluidas', i: number) => setData(p => ({ ...p, [field]: p[field].filter((_, idx) => idx !== i) }))

  const handleReport = () => {
    const content = `
DEFINICIÓN DEL MVBP

NOMBRE DEL MVBP: ${data.nombre || '(No completado)'}

FEATURES INCLUIDAS:
${data.featuresIncluidas.filter(f => f.trim()).map((f, i) => `${i + 1}. ${f}`).join('\n') || '(No completado)'}

FEATURES EXCLUIDAS:
${data.featuresExcluidas.filter(f => f.trim()).map((f, i) => `${i + 1}. ${f}`).join('\n') || '(No completado)'}

CRITERIO DE ÉXITO MÍNIMO:
${data.criterioExito || '(No completado)'}

TIMELINE DE DESARROLLO:
${data.timeline || '(No completado)'}

RECURSOS NECESARIOS:
${data.recursos || '(No completado)'}
    `.trim()
    onGenerateReport(content)
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
      <Collapsible title="Nombre del MVBP" k="nombre" open={openSections} toggle={toggle}>
        <input value={data.nombre} onChange={e => setData(p => ({ ...p, nombre: e.target.value }))} placeholder="Nombre o versión del producto mínimo viable de negocio" style={inputStyle} />
      </Collapsible>

      <Collapsible title="Features incluidas" k="featuresIncluidas" open={openSections} toggle={toggle}>
        {data.featuresIncluidas.map((f, i) => (
          <div key={i} style={{ display: 'flex', gap: '0.5rem', marginBottom: '0.5rem' }}>
            <div style={{ width: 6, borderRadius: 3, background: '#059669', flexShrink: 0, marginTop: '0.5rem', marginBottom: '0.5rem' }} />
            <input value={f} onChange={e => updateList('featuresIncluidas', i, e.target.value)} placeholder={`Feature incluida ${i + 1}`} style={{ ...inputStyle, flex: 1 }} />
            {data.featuresIncluidas.length > 1 && <button onClick={() => removeFromList('featuresIncluidas', i)} style={btnDanger}><Trash2 size={14} /></button>}
          </div>
        ))}
        <button onClick={() => addToList('featuresIncluidas')} style={btnAdd}><Plus size={14} /> Agregar feature</button>
      </Collapsible>

      <Collapsible title="Features excluidas" k="featuresExcluidas" open={openSections} toggle={toggle}>
        {data.featuresExcluidas.map((f, i) => (
          <div key={i} style={{ display: 'flex', gap: '0.5rem', marginBottom: '0.5rem' }}>
            <div style={{ width: 6, borderRadius: 3, background: '#DC2626', flexShrink: 0, marginTop: '0.5rem', marginBottom: '0.5rem' }} />
            <input value={f} onChange={e => updateList('featuresExcluidas', i, e.target.value)} placeholder={`Feature excluida ${i + 1}`} style={{ ...inputStyle, flex: 1 }} />
            {data.featuresExcluidas.length > 1 && <button onClick={() => removeFromList('featuresExcluidas', i)} style={btnDanger}><Trash2 size={14} /></button>}
          </div>
        ))}
        <button onClick={() => addToList('featuresExcluidas')} style={btnAdd}><Plus size={14} /> Agregar feature</button>
      </Collapsible>

      <Collapsible title="Criterio de éxito mínimo" k="criterioExito" open={openSections} toggle={toggle}>
        <textarea value={data.criterioExito} onChange={e => setData(p => ({ ...p, criterioExito: e.target.value }))} placeholder="¿Qué debe lograr el MVBP para considerarse exitoso?" rows={4} style={taStyle} />
      </Collapsible>

      <Collapsible title="Timeline de desarrollo" k="timeline" open={openSections} toggle={toggle}>
        <textarea value={data.timeline} onChange={e => setData(p => ({ ...p, timeline: e.target.value }))} placeholder="¿Cuál es el plan de desarrollo? Hitos, plazos, sprints..." rows={4} style={taStyle} />
      </Collapsible>

      <Collapsible title="Recursos necesarios" k="recursos" open={openSections} toggle={toggle}>
        <textarea value={data.recursos} onChange={e => setData(p => ({ ...p, recursos: e.target.value }))} placeholder="¿Qué recursos necesitas? Equipo, herramientas, presupuesto..." rows={4} style={taStyle} />
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
const btnDanger: React.CSSProperties = { display: 'flex', alignItems: 'center', padding: '0.35rem 0.5rem', borderRadius: 6, background: 'transparent', color: '#DC2626', border: '1px solid #DC262630', cursor: 'pointer' }
const btnAdd: React.CSSProperties = { display: 'flex', alignItems: 'center', gap: '0.375rem', padding: '0.5rem 1rem', borderRadius: 8, fontSize: '0.8125rem', fontFamily: 'var(--font-body)', fontWeight: 600, background: 'transparent', color: '#059669', border: '1px solid #05966930', cursor: 'pointer' }
const btnOG: React.CSSProperties = { display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.75rem 1.25rem', borderRadius: 10, fontFamily: 'var(--font-body)', fontSize: '0.875rem', fontWeight: 600, background: 'transparent', color: '#059669', border: '1.5px solid #05966940', cursor: 'pointer' }
const btnSG: React.CSSProperties = { display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.75rem 1.25rem', borderRadius: 10, fontFamily: 'var(--font-body)', fontSize: '0.875rem', fontWeight: 600, background: '#059669', color: 'white', border: 'none', cursor: 'pointer', boxShadow: '0 2px 8px rgba(5,150,105,0.3)' }
const btnO: React.CSSProperties = { display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.75rem 1.25rem', borderRadius: 10, fontFamily: 'var(--font-body)', fontSize: '0.875rem', fontWeight: 600, background: 'transparent', color: 'var(--color-text-secondary)', border: '1.5px solid var(--color-border)', cursor: 'pointer' }
