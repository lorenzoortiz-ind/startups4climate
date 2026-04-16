'use client'

import { useState } from 'react'
import { useToolState } from '@/lib/useToolState'
import type { ToolComponentProps } from './ToolPage'
import { ToolSection, ToolActionBar, ToolProgress, inputStyle, textareaStyle, labelStyle } from './shared'

interface Data {
  [key: string]: string | number
  awareness: string
  awarenessConversion: number | string
  interes: string
  interesConversion: number | string
  evaluacion: string
  evaluacionConversion: number | string
  compra: string
  compraConversion: number | string
  onboarding: string
  canales: string
  costoCanal: string
}

const DEFAULT: Data = {
  awareness: '', awarenessConversion: '',
  interes: '', interesConversion: '',
  evaluacion: '', evaluacionConversion: '',
  compra: '', compraConversion: '',
  onboarding: '', canales: '', costoCanal: '',
}

const STAGES = [
  { key: 'awareness', title: 'Awareness', convKey: 'awarenessConversion', ph: '\u00bfC\u00f3mo generas conocimiento de tu marca? \u00bfQu\u00e9 canales usas?' },
  { key: 'interes', title: 'Inter\u00e9s', convKey: 'interesConversion', ph: '\u00bfC\u00f3mo conviertes awareness en inter\u00e9s activo?' },
  { key: 'evaluacion', title: 'Evaluaci\u00f3n', convKey: 'evaluacionConversion', ph: '\u00bfQu\u00e9 hace el prospecto para evaluar tu soluci\u00f3n?' },
  { key: 'compra', title: 'Compra', convKey: 'compraConversion', ph: '\u00bfCu\u00e1l es el proceso de cierre de venta?' },
]

const ACCENT = '#0D9488'

export default function CustomerAcquisitionProcess({ userId, onComplete, onGenerateReport }: ToolComponentProps) {
  const [data, setData] = useToolState<Data>(userId, 'customer-acquisition-process', DEFAULT)
  const [saved, setSaved] = useState(false)
  const handleSave = () => { setSaved(true); setTimeout(() => setSaved(false), 2000) }

  /* Progress: count filled text fields (stages + onboarding + canales + costoCanal = 7) */
  const textFields = [...STAGES.map(s => s.key), 'onboarding', 'canales', 'costoCanal']
  const filled = textFields.filter(k => (data as Record<string, string>)[k]?.trim()).length

  const handleReport = () => {
    const content = `
PROCESO DE ADQUISICI\u00d3N DE CLIENTES

${STAGES.map(s => `ETAPA ${s.title.toUpperCase()}:
${(data as Record<string, string>)[s.key] || '(No completado)'}
Tasa de conversi\u00f3n: ${(data as Record<string, string>)[s.convKey] || '(No definida)'}%`).join('\n\n')}

ONBOARDING:
${data.onboarding || '(No completado)'}

CANALES PRIORITARIOS:
${data.canales || '(No completado)'}

COSTO ESTIMADO POR CANAL:
${data.costoCanal || '(No completado)'}
    `.trim()
    onGenerateReport(content)
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
      <ToolProgress filled={filled} total={textFields.length} accentColor={ACCENT} />

      {STAGES.map((s, idx) => (
        <ToolSection
          key={s.key}
          number={idx + 1}
          title={`Etapa: ${s.title}`}
          subtitle="Describe la etapa y define la tasa de conversi\u00f3n"
          insight={idx === 0 ? 'El costo de adquisici\u00f3n de cliente (CAC) debe recuperarse en menos de 12 meses. Si no, tu modelo no es sostenible.' : undefined}
          insightSource={idx === 0 ? 'David Skok, For Entrepreneurs' : undefined}
          defaultOpen={idx === 0}
          accentColor={ACCENT}
        >
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <label style={{ ...labelStyle, margin: 0, whiteSpace: 'nowrap' }}>Conversi\u00f3n:</label>
              <input
                type="number"
                value={(data as Record<string, string>)[s.convKey]}
                onChange={e => setData(p => ({ ...p, [s.convKey]: e.target.value }))}
                placeholder="0"
                style={{ ...inputStyle, width: 80, textAlign: 'center' }}
              />
              <span style={{ fontFamily: 'var(--font-body)', fontSize: '0.8125rem', color: 'var(--color-text-muted)' }}>%</span>
            </div>
            <div>
              <label style={labelStyle}>Descripci\u00f3n de la etapa</label>
              <textarea
                value={(data as Record<string, string>)[s.key]}
                onChange={e => setData(p => ({ ...p, [s.key]: e.target.value }))}
                placeholder={s.ph}
                rows={3}
                style={textareaStyle}
              />
            </div>
          </div>
        </ToolSection>
      ))}

      <ToolSection
        number={5}
        title="Onboarding"
        subtitle="Proceso de incorporaci\u00f3n del nuevo cliente"
        accentColor={ACCENT}
      >
        <textarea
          value={data.onboarding}
          onChange={e => setData(p => ({ ...p, onboarding: e.target.value }))}
          placeholder="\u00bfC\u00f3mo es el proceso de onboarding del nuevo cliente?"
          rows={4}
          style={textareaStyle}
        />
      </ToolSection>

      <ToolSection
        number={6}
        title="Canales prioritarios"
        subtitle="Los canales m\u00e1s efectivos para llegar a tus clientes"
        accentColor={ACCENT}
      >
        <textarea
          value={data.canales}
          onChange={e => setData(p => ({ ...p, canales: e.target.value }))}
          placeholder="\u00bfCu\u00e1les son los canales m\u00e1s efectivos para llegar a tus clientes?"
          rows={4}
          style={textareaStyle}
        />
      </ToolSection>

      <ToolSection
        number={7}
        title="Costo estimado por canal"
        subtitle="Cu\u00e1nto cuesta adquirir un cliente por cada canal"
        accentColor={ACCENT}
      >
        <textarea
          value={data.costoCanal}
          onChange={e => setData(p => ({ ...p, costoCanal: e.target.value }))}
          placeholder="\u00bfCu\u00e1nto cuesta adquirir un cliente por cada canal?"
          rows={4}
          style={textareaStyle}
        />
      </ToolSection>

      <ToolActionBar
        onSave={handleSave}
        onComplete={onComplete}
        onReport={handleReport}
        saved={saved}
        accentColor={ACCENT}
      />
    </div>
  )
}
