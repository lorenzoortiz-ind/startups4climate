'use client'

import { useState } from 'react'
import { useToolState } from '@/lib/useToolState'
import type { ToolComponentProps } from './ToolPage'
import { ToolSection, ToolActionBar, ToolProgress, InsightPanel, inputStyle, textareaStyle, labelStyle } from './shared'

interface Data {
  clientes: number | string
  precioAnual: number | string
  metodologia: string
  fuentes: string
}

const DEFAULT: Data = { clientes: '', precioAnual: '', metodologia: '', fuentes: '' }

export default function TAMCalculator({ userId, onComplete, onGenerateReport }: ToolComponentProps) {
  const [data, setData] = useToolState<Data>(userId, 'tam-calculator', DEFAULT)
  const [saved, setSaved] = useState(false)
  const handleSave = () => { setSaved(true); setTimeout(() => setSaved(false), 2000) }

  const tam = (Number(data.clientes) || 0) * (Number(data.precioAnual) || 0)

  const filledCount = [
    data.clientes ? String(data.clientes) : '',
    data.precioAnual ? String(data.precioAnual) : '',
    data.metodologia,
    data.fuentes,
  ].filter(Boolean).length

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
      <ToolProgress filled={filledCount} total={4} />

      <ToolSection
        number={1}
        title="Cálculo del TAM"
        subtitle="Total Addressable Market — el techo de tu oportunidad"
        insight="Siempre calcula TAM bottom-up. Un TAM top-down inflado destruye tu credibilidad ante inversores."
        insightSource="Harvard Business School, Entrepreneurial Finance"
        defaultOpen
      >
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem', marginBottom: '1rem' }}>
          <div>
            <label style={labelStyle}>Número de clientes potenciales</label>
            <input type="number" value={data.clientes} onChange={e => setData(p => ({ ...p, clientes: e.target.value }))} placeholder="Ej: 10000" step="1" style={inputStyle} />
          </div>
          <div>
            <label style={labelStyle}>Precio promedio anual</label>
            <div style={{ position: 'relative' }}>
              <span style={{ position: 'absolute', left: '0.75rem', top: '50%', transform: 'translateY(-50%)', fontFamily: 'var(--font-body)', fontSize: '0.75rem', color: 'var(--color-text-muted)', pointerEvents: 'none' }}>$</span>
              <input type="number" value={data.precioAnual} onChange={e => setData(p => ({ ...p, precioAnual: e.target.value }))} placeholder="Ej: 1200" step="1" style={{ ...inputStyle, paddingLeft: '1.75rem' }} />
            </div>
          </div>
        </div>

        {/* TAM display card */}
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
      </ToolSection>

      <ToolSection
        number={2}
        title="Metodología utilizada"
        subtitle="Explica cómo llegaste a estos números"
        insight="Inversores sofisticados prefieren un TAM bottom-up de $50M bien fundamentado que un top-down de $10B sacado de un reporte genérico."
        insightSource="Y Combinator, Series A Guide"
      >
        <textarea value={data.metodologia} onChange={e => setData(p => ({ ...p, metodologia: e.target.value }))} placeholder="¿Cómo calculaste estos números? Top-down, bottom-up, o análisis por analogía..." rows={4} style={textareaStyle} />
      </ToolSection>

      <ToolSection
        number={3}
        title="Fuentes de datos"
        subtitle="Documenta la evidencia detrás de tus estimaciones"
      >
        <textarea value={data.fuentes} onChange={e => setData(p => ({ ...p, fuentes: e.target.value }))} placeholder="¿De dónde provienen los datos? Reportes de industria, estudios de mercado, datos propios..." rows={4} style={textareaStyle} />

        <div style={{ marginTop: '1rem' }}>
          <InsightPanel title="Tip de presentación">
            <p style={{ margin: 0 }}>
              Presenta tu TAM en tres capas: TAM (mercado total), SAM (mercado alcanzable) y SOM (mercado que puedes capturar en 1-2 años). Esto demuestra pensamiento estratégico.
            </p>
          </InsightPanel>
        </div>
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
