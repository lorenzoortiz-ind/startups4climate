'use client'

import { useState } from 'react'
import { ChevronDown, Save, CheckCircle2, FileText, Plus, Trash2 } from 'lucide-react'
import { useToolState } from '@/lib/useToolState'
import type { ToolComponentProps } from './ToolPage'

interface Data {
  nombre: string
  descripcionLinea: string
  features: string[]
  noHace: string
  diferenciadores: string
  brochure: string
}

const DEFAULT: Data = { nombre: '', descripcionLinea: '', features: [''], noHace: '', diferenciadores: '', brochure: '' }

export default function ProductSpecification({ userId, onComplete, onGenerateReport }: ToolComponentProps) {
  const [data, setData] = useToolState<Data>(userId, 'product-specification', DEFAULT)
  const [openSections, setOpenSections] = useState<Record<string, boolean>>({})
  const [saved, setSaved] = useState(false)
  const toggle = (k: string) => setOpenSections(p => ({ ...p, [k]: !p[k] }))
  const handleSave = () => { setSaved(true); setTimeout(() => setSaved(false), 2000) }

  const updateFeature = (i: number, v: string) => setData(p => { const f = [...p.features]; f[i] = v; return { ...p, features: f } })
  const addFeature = () => setData(p => ({ ...p, features: [...p.features, ''] }))
  const removeFeature = (i: number) => setData(p => ({ ...p, features: p.features.filter((_, idx) => idx !== i) }))

  const handleReport = () => {
    const content = `
ESPECIFICACIÓN DE PRODUCTO

NOMBRE: ${data.nombre || '(No completado)'}
DESCRIPCIÓN EN UNA LÍNEA: ${data.descripcionLinea || '(No completado)'}

FEATURES PRINCIPALES:
${data.features.filter(f => f.trim()).map((f, i) => `${i + 1}. ${f}`).join('\n') || '(No completado)'}

LO QUE NO HACE EL PRODUCTO:
${data.noHace || '(No completado)'}

DIFERENCIADORES CLAVE:
${data.diferenciadores || '(No completado)'}

BROCHURE VISUAL:
${data.brochure || '(No completado)'}
    `.trim()
    onGenerateReport(content)
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
      <Collapsible title="Nombre del producto" k="nombre" open={openSections} toggle={toggle}>
        <input value={data.nombre} onChange={e => setData(p => ({ ...p, nombre: e.target.value }))} placeholder="Nombre de tu producto o servicio" style={inputStyle} />
      </Collapsible>

      <Collapsible title="Descripción en una línea" k="descripcionLinea" open={openSections} toggle={toggle}>
        <input value={data.descripcionLinea} onChange={e => setData(p => ({ ...p, descripcionLinea: e.target.value }))} placeholder="Describe tu producto en una sola oración clara y convincente" style={inputStyle} />
      </Collapsible>

      <Collapsible title="Features principales" k="features" open={openSections} toggle={toggle}>
        {data.features.map((f, i) => (
          <div key={i} style={{ display: 'flex', gap: '0.5rem', marginBottom: '0.5rem' }}>
            <input value={f} onChange={e => updateFeature(i, e.target.value)} placeholder={`Feature ${i + 1}`} style={{ ...inputStyle, flex: 1 }} />
            {data.features.length > 1 && <button onClick={() => removeFeature(i)} style={btnDanger}><Trash2 size={14} /></button>}
          </div>
        ))}
        <button onClick={addFeature} style={btnAdd}><Plus size={14} /> Agregar feature</button>
      </Collapsible>

      <Collapsible title="Lo que NO hace el producto" k="noHace" open={openSections} toggle={toggle}>
        <textarea value={data.noHace} onChange={e => setData(p => ({ ...p, noHace: e.target.value }))} placeholder="Define claramente qué está fuera del alcance de tu producto" rows={4} style={taStyle} />
      </Collapsible>

      <Collapsible title="Diferenciadores clave" k="diferenciadores" open={openSections} toggle={toggle}>
        <textarea value={data.diferenciadores} onChange={e => setData(p => ({ ...p, diferenciadores: e.target.value }))} placeholder="¿Qué hace único a tu producto vs las alternativas?" rows={4} style={taStyle} />
      </Collapsible>

      <Collapsible title="Brochure visual" k="brochure" open={openSections} toggle={toggle}>
        <textarea value={data.brochure} onChange={e => setData(p => ({ ...p, brochure: e.target.value }))} placeholder="Describe cómo se vería el brochure de tu producto: mensajes clave, visuales, estructura..." rows={4} style={taStyle} />
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
const btnAdd: React.CSSProperties = { display: 'flex', alignItems: 'center', gap: '0.375rem', padding: '0.5rem 1rem', borderRadius: 8, fontSize: '0.8125rem', fontFamily: 'var(--font-body)', fontWeight: 600, background: 'transparent', color: '#0D9488', border: '1px solid #0D948830', cursor: 'pointer' }
const btnOG: React.CSSProperties = { display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.75rem 1.25rem', borderRadius: 10, fontFamily: 'var(--font-body)', fontSize: '0.875rem', fontWeight: 600, background: 'transparent', color: '#0D9488', border: '1.5px solid #0D948840', cursor: 'pointer' }
const btnSG: React.CSSProperties = { display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.75rem 1.25rem', borderRadius: 10, fontFamily: 'var(--font-body)', fontSize: '0.875rem', fontWeight: 600, background: '#0D9488', color: 'white', border: 'none', cursor: 'pointer', boxShadow: '0 2px 8px rgba(13,148,136,0.3)' }
const btnO: React.CSSProperties = { display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.75rem 1.25rem', borderRadius: 10, fontFamily: 'var(--font-body)', fontSize: '0.875rem', fontWeight: 600, background: 'transparent', color: 'var(--color-text-secondary)', border: '1.5px solid var(--color-border)', cursor: 'pointer' }
