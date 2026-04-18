'use client'

import { useState } from 'react'
import { Plus, Trash2 } from 'lucide-react'
import { useToolState } from '@/lib/useToolState'
import type { ToolComponentProps } from './ToolPage'
import { ToolSection, ToolActionBar, ToolProgress, inputStyle, textareaStyle, labelStyle, btnSmall } from './shared'

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
  const [saved, setSaved] = useState(false)

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

  const filledCount = [
    data.segments.some(s => s.name) ? 'filled' : '',
    data.criterios,
    data.topOportunidades,
  ].filter(Boolean).length

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
      <ToolProgress filled={filledCount} total={3} />

      <ToolSection
        number={1}
        title="Lista de segmentos potenciales"
        subtitle="Identifica todos los segmentos de mercado posibles"
        insight="No segmentes por demografía; segmenta por necesidad urgente. El segmento ideal es homogéneo en su dolor."
        insightSource="MIT Disciplined Entrepreneurship, Step 1"
        defaultOpen
      >
        {data.segments.map((s, i) => (
          <div key={i} style={{ padding: '1rem', borderRadius: 10, border: '1px solid var(--color-border)', marginBottom: '0.75rem', background: 'var(--color-bg-primary)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
              <span style={labelStyle}>Segmento {i + 1}</span>
              {data.segments.length > 1 && (
                <button onClick={() => removeSegment(i)} style={{ ...btnSmall, color: '#DC2626', borderColor: '#DC262630' }}><Trash2 size={12} /> Eliminar</button>
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
        <button onClick={addSegment} style={{ ...btnSmall, color: '#1F77F6', borderColor: '#1F77F630' }}><Plus size={14} /> Agregar segmento</button>
      </ToolSection>

      <ToolSection
        number={2}
        title="Criterios de evaluación"
        subtitle="Define cómo priorizas entre segmentos"
        insight="Evalúa cada segmento con criterios objetivos: urgencia del dolor, capacidad de pago, tamaño, acceso a canales y alineación con tu equipo."
        insightSource="Bill Aulet, MIT Martin Trust Center"
      >
        <textarea value={data.criterios} onChange={e => setData(p => ({ ...p, criterios: e.target.value }))} placeholder="¿Qué criterios usas para evaluar y priorizar estos segmentos?" rows={4} style={textareaStyle} />
      </ToolSection>

      <ToolSection
        number={3}
        title="Top oportunidades seleccionadas"
        subtitle="Los 2-3 segmentos más prometedores"
      >
        <textarea value={data.topOportunidades} onChange={e => setData(p => ({ ...p, topOportunidades: e.target.value }))} placeholder="¿Cuáles son los 2-3 segmentos más prometedores y por qué?" rows={4} style={textareaStyle} />
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
