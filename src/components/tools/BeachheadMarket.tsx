'use client'

import { useState } from 'react'
import { useToolState } from '@/lib/useToolState'
import type { ToolComponentProps } from './ToolPage'
import { ToolSection, ToolActionBar, ToolProgress, inputStyle, textareaStyle, labelStyle } from './shared'

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
  const [saved, setSaved] = useState(false)
  const handleSave = () => { setSaved(true); setTimeout(() => setSaved(false), 2000) }

  const filledCount = [
    data.mercado,
    data.justificacion,
    data.tamano ? String(data.tamano) : '',
    data.planExpansion,
  ].filter(Boolean).length

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
      <ToolProgress filled={filledCount} total={4} />

      <ToolSection
        number={1}
        title="Mercado inicial seleccionado"
        subtitle="El primer mercado que vas a dominar"
        insight="Tu beachhead market debe ser lo suficientemente pequeño para dominarlo y lo suficientemente grande para financiar tu crecimiento."
        insightSource="MIT Disciplined Entrepreneurship, Step 4"
        defaultOpen
      >
        <input value={data.mercado} onChange={e => setData(p => ({ ...p, mercado: e.target.value }))} placeholder="Nombre del mercado inicial que atacarás primero" style={inputStyle} />
      </ToolSection>

      <ToolSection
        number={2}
        title="Justificación"
        subtitle="¿Por qué este mercado es el punto de entrada ideal?"
        insight="Un buen beachhead tiene: cliente con dolor urgente, ciclo de venta corto, boca a boca natural y un camino claro hacia mercados adyacentes."
        insightSource="Bill Aulet, Disciplined Entrepreneurship"
      >
        <textarea value={data.justificacion} onChange={e => setData(p => ({ ...p, justificacion: e.target.value }))} placeholder="¿Por qué elegiste este mercado como punto de entrada?" rows={4} style={textareaStyle} />
      </ToolSection>

      <ToolSection
        number={3}
        title="Tamaño estimado y accesibilidad"
        subtitle="Cuantifica la oportunidad en tu mercado inicial"
      >
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
      </ToolSection>

      <ToolSection
        number={4}
        title="Plan de expansión futura"
        subtitle="Tu estrategia para crecer más allá del beachhead"
      >
        <textarea value={data.planExpansion} onChange={e => setData(p => ({ ...p, planExpansion: e.target.value }))} placeholder="¿Cómo planeas expandirte a otros mercados después de dominar el beachhead?" rows={4} style={textareaStyle} />
      </ToolSection>

      <ToolActionBar
        onSave={handleSave}
        onComplete={onComplete}
        onReport={handleReport}
        saved={saved}
      />
    </div>
  )
}
