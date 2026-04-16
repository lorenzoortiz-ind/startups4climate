'use client'

import { useState } from 'react'
import { Plus, Trash2 } from 'lucide-react'
import { useToolState } from '@/lib/useToolState'
import type { ToolComponentProps } from './ToolPage'
import { ToolSection, ToolActionBar, ToolProgress, InsightPanel, inputStyle, textareaStyle, btnSmall } from './shared'

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
  const [saved, setSaved] = useState(false)
  const handleSave = () => { setSaved(true); setTimeout(() => setSaved(false), 2000) }

  const updateFeature = (i: number, v: string) => setData(p => { const f = [...p.features]; f[i] = v; return { ...p, features: f } })
  const addFeature = () => setData(p => ({ ...p, features: [...p.features, ''] }))
  const removeFeature = (i: number) => setData(p => ({ ...p, features: p.features.filter((_, idx) => idx !== i) }))

  const sectionKeys = ['nombre', 'descripcionLinea', 'features', 'noHace', 'diferenciadores', 'brochure'] as const
  const filled = sectionKeys.filter(k => {
    if (k === 'features') return data.features.some(f => f.trim().length > 0)
    return data[k]?.trim().length > 0
  }).length

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

  const btnDanger: React.CSSProperties = { display: 'flex', alignItems: 'center', padding: '0.35rem 0.5rem', borderRadius: 6, background: 'transparent', color: '#DC2626', border: '1px solid #DC262630', cursor: 'pointer' }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
      <ToolProgress filled={filled} total={sectionKeys.length} accentColor="#0D9488" />

      <InsightPanel title="Referencia académica">
        <p style={{ margin: 0 }}>
          &ldquo;Tu MVP no es tu producto final — es el experimento más pequeño que valida tu hipótesis central.&rdquo;
        </p>
        <span style={{
          fontFamily: 'var(--font-body)',
          fontSize: '0.6875rem',
          color: 'var(--color-text-muted)',
          fontStyle: 'italic',
          marginTop: '0.25rem',
          display: 'block',
        }}>
          — Eric Ries, The Lean Startup
        </span>
      </InsightPanel>

      <ToolSection number={1} title="Nombre del producto" subtitle="Identidad de tu solución" accentColor="#0D9488">
        <input value={data.nombre} onChange={e => setData(p => ({ ...p, nombre: e.target.value }))} placeholder="Nombre de tu producto o servicio" style={inputStyle} />
      </ToolSection>

      <ToolSection number={2} title="Descripción en una línea" subtitle="Elevator pitch en una oración" accentColor="#0D9488">
        <input value={data.descripcionLinea} onChange={e => setData(p => ({ ...p, descripcionLinea: e.target.value }))} placeholder="Describe tu producto en una sola oración clara y convincente" style={inputStyle} />
      </ToolSection>

      <ToolSection number={3} title="Features principales" subtitle="Funcionalidades clave de tu MVP" accentColor="#0D9488">
        {data.features.map((f, i) => (
          <div key={i} style={{ display: 'flex', gap: '0.5rem', marginBottom: '0.5rem' }}>
            <input value={f} onChange={e => updateFeature(i, e.target.value)} placeholder={`Feature ${i + 1}`} style={{ ...inputStyle, flex: 1 }} />
            {data.features.length > 1 && <button onClick={() => removeFeature(i)} style={btnDanger}><Trash2 size={14} /></button>}
          </div>
        ))}
        <button onClick={addFeature} style={{ ...btnSmall, color: '#0D9488', borderColor: '#0D948830' }}><Plus size={14} /> Agregar feature</button>
      </ToolSection>

      <ToolSection number={4} title="Lo que NO hace el producto" subtitle="Límites claros del alcance" accentColor="#0D9488">
        <textarea value={data.noHace} onChange={e => setData(p => ({ ...p, noHace: e.target.value }))} placeholder="Define claramente qué está fuera del alcance de tu producto" rows={4} style={textareaStyle} />
      </ToolSection>

      <ToolSection number={5} title="Diferenciadores clave" subtitle="Tu ventaja vs alternativas" accentColor="#0D9488">
        <textarea value={data.diferenciadores} onChange={e => setData(p => ({ ...p, diferenciadores: e.target.value }))} placeholder="¿Qué hace único a tu producto vs las alternativas?" rows={4} style={textareaStyle} />
      </ToolSection>

      <ToolSection number={6} title="Brochure visual" subtitle="Comunicación visual del producto" accentColor="#0D9488">
        <textarea value={data.brochure} onChange={e => setData(p => ({ ...p, brochure: e.target.value }))} placeholder="Describe cómo se vería el brochure de tu producto: mensajes clave, visuales, estructura..." rows={4} style={textareaStyle} />
      </ToolSection>

      <ToolActionBar
        onSave={handleSave}
        onComplete={onComplete}
        onReport={handleReport}
        saved={saved}
        accentColor="#0D9488"
      />
    </div>
  )
}
