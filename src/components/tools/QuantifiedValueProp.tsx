'use client'

import { useState } from 'react'
import { useToolState } from '@/lib/useToolState'
import type { ToolComponentProps } from './ToolPage'
import { ToolSection, ToolActionBar, ToolProgress, InsightPanel, inputStyle, textareaStyle, labelStyle } from './shared'

interface Data {
  ahorroEconomico: number | string
  ahorroTiempo: number | string
  reduccionRiesgo: string
  statusQuo: string
  comparacion: string
  roi: number | string
}

const DEFAULT: Data = { ahorroEconomico: '', ahorroTiempo: '', reduccionRiesgo: '', statusQuo: '', comparacion: '', roi: '' }

const prefixStyle: React.CSSProperties = { position: 'absolute', left: '0.75rem', top: '50%', transform: 'translateY(-50%)', fontFamily: 'var(--font-body)', fontSize: '0.75rem', color: 'var(--color-text-muted)', pointerEvents: 'none' }
const suffixStyle: React.CSSProperties = { position: 'absolute', right: '0.75rem', top: '50%', transform: 'translateY(-50%)', fontFamily: 'var(--font-body)', fontSize: '0.75rem', color: 'var(--color-text-muted)', pointerEvents: 'none' }

export default function QuantifiedValueProp({ userId, onComplete, onGenerateReport }: ToolComponentProps) {
  const [data, setData] = useToolState<Data>(userId, 'quantified-value-prop', DEFAULT)
  const [saved, setSaved] = useState(false)
  const handleSave = () => { setSaved(true); setTimeout(() => setSaved(false), 2000) }

  const sectionKeys = ['ahorroEconomico', 'ahorroTiempo', 'roi', 'reduccionRiesgo', 'statusQuo', 'comparacion'] as const
  const filled = sectionKeys.filter(k => {
    const v = data[k]
    if (typeof v === 'number') return true
    return typeof v === 'string' && v.trim().length > 0
  }).length

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
      <ToolProgress filled={filled} total={sectionKeys.length} accentColor="#0D9488" />

      <InsightPanel title="Referencia académica">
        <p style={{ margin: 0 }}>
          &ldquo;Si no puedes cuantificar cuánto vale tu solución en dólares/tiempo/riesgo para el cliente, no tienes una propuesta de valor — tienes una esperanza.&rdquo;
        </p>
        <span style={{
          fontFamily: 'var(--font-body)',
          fontSize: '0.6875rem',
          color: 'var(--color-text-muted)',
          fontStyle: 'italic',
          marginTop: '0.25rem',
          display: 'block',
        }}>
          — MIT Disciplined Entrepreneurship, Step 10
        </span>
      </InsightPanel>

      <ToolSection number={1} title="Valor entregado al cliente" subtitle="Métricas cuantificables de impacto" defaultOpen accentColor="#0D9488">
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
      </ToolSection>

      <ToolSection number={2} title="Reducción de riesgo" subtitle="Valor intangible cuantificado" accentColor="#0D9488">
        <textarea value={data.reduccionRiesgo} onChange={e => setData(p => ({ ...p, reduccionRiesgo: e.target.value }))} placeholder="¿Qué riesgos reduces para el cliente? ¿Cómo los cuantificas?" rows={4} style={textareaStyle} />
      </ToolSection>

      <ToolSection number={3} title="Status quo actual del cliente" subtitle="El costo de no hacer nada" accentColor="#0D9488">
        <textarea value={data.statusQuo} onChange={e => setData(p => ({ ...p, statusQuo: e.target.value }))} placeholder="¿Cómo resuelve el cliente este problema hoy? ¿Cuánto le cuesta en tiempo, dinero y frustración?" rows={4} style={textareaStyle} />
      </ToolSection>

      <ToolSection number={4} title="Comparación cuantificada" subtitle="Antes vs después con números" accentColor="#0D9488">
        <textarea value={data.comparacion} onChange={e => setData(p => ({ ...p, comparacion: e.target.value }))} placeholder="Compara numéricamente: antes vs después de usar tu solución" rows={4} style={textareaStyle} />
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
