'use client'

import { useState } from 'react'
import { useToolState } from '@/lib/useToolState'
import type { ToolComponentProps } from './ToolPage'
import { ToolSection, ToolActionBar, ToolProgress, inputStyle, textareaStyle, labelStyle } from './shared'

interface Data {
  [key: string]: unknown
  clientes: number | string
  mrr: number | string
  retencion: number | string
  nps: number | string
  testimoniales: string
  evidenciaVentas: string
  metricasClave: string
}

const DEFAULT: Data = { clientes: '', mrr: '', retencion: '', nps: '', testimoniales: '', evidenciaVentas: '', metricasClave: '' }

export default function TractionValidation({ userId, onComplete, onGenerateReport }: ToolComponentProps) {
  const [data, setData] = useToolState<Data>(userId, 'traction-validation', DEFAULT)
  const [saved, setSaved] = useState(false)
  const handleSave = () => { setSaved(true); setTimeout(() => setSaved(false), 2000) }

  /* ── Progress ── */
  const filledKeys = ['clientes', 'mrr', 'retencion', 'nps', 'testimoniales', 'evidenciaVentas', 'metricasClave'] as const
  const filled = filledKeys.filter(k => String(data[k]).trim()).length

  const handleReport = () => {
    const content = `
VALIDACIÓN DE TRACCIÓN

MÉTRICAS PRINCIPALES:
- Clientes actuales: ${data.clientes || '0'}
- MRR: $${Number(data.mrr).toLocaleString()}
- Tasa de retención mensual: ${data.retencion}%
- NPS / Satisfacción: ${data.nps}

TESTIMONIALES:
${data.testimoniales || '(No completado)'}

EVIDENCIA DE VENTAS:
${data.evidenciaVentas || '(No completado)'}

MÉTRICAS CLAVE DE TRACCIÓN:
${data.metricasClave || '(No completado)'}
    `.trim()
    onGenerateReport(content)
  }

  const prefixStyle: React.CSSProperties = { position: 'absolute', left: '0.75rem', top: '50%', transform: 'translateY(-50%)', fontFamily: 'var(--font-body)', fontSize: '0.75rem', color: 'var(--color-text-muted)', pointerEvents: 'none' }
  const suffixStyle: React.CSSProperties = { position: 'absolute', right: '0.75rem', top: '50%', transform: 'translateY(-50%)', fontFamily: 'var(--font-body)', fontSize: '0.75rem', color: 'var(--color-text-muted)', pointerEvents: 'none' }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
      <ToolProgress filled={filled} total={filledKeys.length} accentColor="#0D9488" />

      <ToolSection
        number={1}
        title="Métricas de tracción"
        subtitle="Datos cuantitativos de tracción real"
        insight="La tracción no es vanity metrics. Es evidencia de que clientes reales están dispuestos a pagar o usar tu solución repetidamente."
        insightSource="Gabriel Weinberg, Traction"
        defaultOpen
      >
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
          <div>
            <label style={labelStyle}>Número de clientes actuales</label>
            <input type="number" value={data.clientes} onChange={e => setData(p => ({ ...p, clientes: e.target.value }))} placeholder="Ej: 25" step="1" style={inputStyle} />
          </div>
          <div>
            <label style={labelStyle}>MRR - Ingresos mensuales recurrentes</label>
            <div style={{ position: 'relative' }}>
              <span style={prefixStyle}>$</span>
              <input type="number" value={data.mrr} onChange={e => setData(p => ({ ...p, mrr: e.target.value }))} placeholder="Ej: 5000" step="100" style={{ ...inputStyle, paddingLeft: '1.75rem' }} />
            </div>
          </div>
          <div>
            <label style={labelStyle}>Tasa de retención mensual</label>
            <div style={{ position: 'relative' }}>
              <input type="number" value={data.retencion} onChange={e => setData(p => ({ ...p, retencion: e.target.value }))} placeholder="Ej: 95" step="0.1" min="0" max="100" style={{ ...inputStyle, paddingRight: '2.5rem' }} />
              <span style={suffixStyle}>%</span>
            </div>
          </div>
          <div>
            <label style={labelStyle}>NPS o satisfacción</label>
            <input type="number" value={data.nps} onChange={e => setData(p => ({ ...p, nps: e.target.value }))} placeholder="Ej: 72" step="1" min="-100" max="100" style={inputStyle} />
          </div>
        </div>

        {/* Summary display */}
        {(Number(data.clientes) > 0 || Number(data.mrr) > 0) && (
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr 1fr', gap: '0.5rem', marginTop: '1rem' }}>
            {[
              { label: 'Clientes', value: data.clientes || '0', color: '#0D9488' },
              { label: 'MRR', value: `$${Number(data.mrr).toLocaleString()}`, color: '#FF6B4A' },
              { label: 'Retención', value: `${data.retencion || 0}%`, color: '#0D9488' },
              { label: 'NPS', value: String(data.nps || '\u2014'), color: '#2A222B' },
            ].map(m => (
              <div key={m.label} style={{ textAlign: 'center', padding: '0.75rem', borderRadius: 10, background: `${m.color}08`, border: `1px solid ${m.color}20` }}>
                <div style={{ fontFamily: 'var(--font-body)', fontSize: '0.625rem', color: m.color, textTransform: 'uppercase', letterSpacing: '0.05em' }}>{m.label}</div>
                <div style={{ fontFamily: 'var(--font-heading)', fontSize: '1.125rem', fontWeight: 400, color: m.color }}>{m.value}</div>
              </div>
            ))}
          </div>
        )}
      </ToolSection>

      <ToolSection number={2} title="Testimoniales" subtitle="Citas o testimoniales de clientes satisfechos">
        <textarea value={data.testimoniales} onChange={e => setData(p => ({ ...p, testimoniales: e.target.value }))} placeholder="Comparte citas o testimoniales de clientes satisfechos" rows={4} style={textareaStyle} />
      </ToolSection>

      <ToolSection number={3} title="Evidencia de ventas" subtitle="LOIs, contratos, pilotos, pagos">
        <textarea value={data.evidenciaVentas} onChange={e => setData(p => ({ ...p, evidenciaVentas: e.target.value }))} placeholder="LOIs, contratos firmados, pilotos completados, pagos recibidos..." rows={4} style={textareaStyle} />
      </ToolSection>

      <ToolSection number={4} title="Métricas clave de tracción" subtitle="Usuarios activos, engagement, pipeline">
        <textarea value={data.metricasClave} onChange={e => setData(p => ({ ...p, metricasClave: e.target.value }))} placeholder="Otras métricas relevantes: usuarios activos, engagement, pipeline, etc." rows={4} style={textareaStyle} />
      </ToolSection>

      <ToolActionBar onSave={handleSave} onComplete={onComplete} onReport={handleReport} saved={saved} />
    </div>
  )
}
