'use client'

import { useState } from 'react'
import { Plus, Trash2 } from 'lucide-react'
import { useToolState } from '@/lib/useToolState'
import type { ToolComponentProps } from './ToolPage'
import { ToolSection, ToolActionBar, ToolProgress, inputStyle, textareaStyle, labelStyle, btnSmall } from './shared'

interface RevenueStream { name: string; monthly: number | string }

interface Data {
  modelo: string
  justificacion: string
  streams: RevenueStream[]
  costos: string
  margenBruto: number | string
}

const MODELOS = ['SaaS/Suscripci\u00f3n', 'Marketplace', 'Freemium', 'Licenciamiento', 'Hardware-as-a-Service', 'Venta directa', 'Pay-per-use', 'Otro']

const DEFAULT: Data = {
  modelo: 'SaaS/Suscripci\u00f3n',
  justificacion: '',
  streams: [{ name: '', monthly: '' }],
  costos: '',
  margenBruto: '',
}

const ACCENT = '#0D9488'

export default function BusinessModelDesign({ userId, onComplete, onGenerateReport }: ToolComponentProps) {
  const [data, setData] = useToolState<Data>(userId, 'business-model-design', DEFAULT)
  const [saved, setSaved] = useState(false)
  const handleSave = () => { setSaved(true); setTimeout(() => setSaved(false), 2000) }

  const updateStream = (i: number, field: keyof RevenueStream, value: string) => {
    setData(p => { const s = [...p.streams]; s[i] = { ...s[i], [field]: value }; return { ...p, streams: s } })
  }
  const addStream = () => setData(p => ({ ...p, streams: [...p.streams, { name: '', monthly: '' }] }))
  const removeStream = (i: number) => setData(p => ({ ...p, streams: p.streams.filter((_, idx) => idx !== i) }))

  const totalRevenue = data.streams.reduce((sum, s) => sum + (Number(s.monthly) || 0), 0)

  /* Progress: modelo always filled, justificacion, at least 1 stream with name, costos, margenBruto */
  const sections = [
    true, // modelo always selected
    data.justificacion.trim().length > 0,
    data.streams.some(s => s.name.trim().length > 0),
    data.costos.trim().length > 0,
    String(data.margenBruto).trim().length > 0,
  ]
  const filled = sections.filter(Boolean).length

  const handleReport = () => {
    const content = `
DISE\u00d1O DE MODELO DE NEGOCIO

MODELO SELECCIONADO: ${data.modelo}

JUSTIFICACI\u00d3N:
${data.justificacion || '(No completado)'}

FLUJOS DE INGRESOS:
${data.streams.map((s, i) => `${i + 1}. ${s.name || '(Sin nombre)'}: $${Number(s.monthly).toLocaleString()}/mes`).join('\n')}
Total mensual estimado: $${totalRevenue.toLocaleString()}/mes

ESTRUCTURA DE COSTOS PRINCIPALES:
${data.costos || '(No completado)'}

MARGEN BRUTO ESTIMADO: ${data.margenBruto}%
    `.trim()
    onGenerateReport(content)
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
      <ToolProgress filled={filled} total={5} accentColor={ACCENT} />

      <ToolSection
        number={1}
        title="Modelo de negocio"
        subtitle="Selecciona y justifica tu modelo"
        insight="Un modelo de negocio no es una hoja de c\u00e1lculo \u2014 es una hip\u00f3tesis sobre c\u00f3mo creas, entregas y capturas valor."
        insightSource="Alexander Osterwalder, Business Model Generation"
        defaultOpen
        accentColor={ACCENT}
      >
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
          <div>
            <label style={labelStyle}>Modelo seleccionado</label>
            <select value={data.modelo} onChange={e => setData(p => ({ ...p, modelo: e.target.value }))} style={inputStyle}>
              {MODELOS.map(m => <option key={m} value={m}>{m}</option>)}
            </select>
          </div>
        </div>
      </ToolSection>

      <ToolSection
        number={2}
        title="Justificaci\u00f3n"
        subtitle="\u00bfPor qu\u00e9 este modelo es el correcto para tu startup?"
        accentColor={ACCENT}
      >
        <textarea
          value={data.justificacion}
          onChange={e => setData(p => ({ ...p, justificacion: e.target.value }))}
          placeholder="\u00bfPor qu\u00e9 elegiste este modelo? \u00bfC\u00f3mo se alinea con tu mercado y producto?"
          rows={4}
          style={textareaStyle}
        />
      </ToolSection>

      <ToolSection
        number={3}
        title="Flujos de ingresos"
        subtitle="Define tus fuentes de revenue"
        defaultOpen
        accentColor={ACCENT}
      >
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
          {data.streams.map((s, i) => (
            <div key={i} style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
              <input value={s.name} onChange={e => updateStream(i, 'name', e.target.value)} placeholder="Fuente de ingreso" style={{ ...inputStyle, flex: 1 }} />
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                <span style={{ fontFamily: 'var(--font-body)', fontSize: '0.8125rem', color: 'var(--color-text-muted)' }}>$</span>
                <input type="number" value={s.monthly} onChange={e => updateStream(i, 'monthly', e.target.value)} placeholder="0" style={{ ...inputStyle, width: 110 }} />
                <span style={{ fontFamily: 'var(--font-body)', fontSize: '0.75rem', color: 'var(--color-text-muted)' }}>/mes</span>
              </div>
              {data.streams.length > 1 && (
                <button onClick={() => removeStream(i)} style={{ ...btnSmall, color: '#DC2626', border: '1px solid #DC262630', padding: '0.35rem 0.5rem' }}>
                  <Trash2 size={12} />
                </button>
              )}
            </div>
          ))}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '0.5rem' }}>
            <button onClick={addStream} style={{ ...btnSmall, color: ACCENT, border: `1px solid ${ACCENT}30`, gap: '0.375rem' }}>
              <Plus size={14} /> Agregar flujo
            </button>
            <span style={{ fontFamily: 'var(--font-heading)', fontSize: '0.9375rem', fontWeight: 700, color: ACCENT }}>
              Total: ${totalRevenue.toLocaleString()}/mes
            </span>
          </div>
        </div>
      </ToolSection>

      <ToolSection
        number={4}
        title="Estructura de costos principales"
        subtitle="Costos fijos y variables clave"
        accentColor={ACCENT}
      >
        <textarea
          value={data.costos}
          onChange={e => setData(p => ({ ...p, costos: e.target.value }))}
          placeholder="\u00bfCu\u00e1les son tus principales costos fijos y variables?"
          rows={4}
          style={textareaStyle}
        />
      </ToolSection>

      <ToolSection
        number={5}
        title="Margen bruto estimado"
        subtitle="Porcentaje de margen sobre ingresos"
        accentColor={ACCENT}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <input
            type="number"
            value={data.margenBruto}
            onChange={e => setData(p => ({ ...p, margenBruto: e.target.value }))}
            placeholder="0"
            style={{ ...inputStyle, width: 100, textAlign: 'center' }}
          />
          <span style={{ fontFamily: 'var(--font-body)', fontSize: '0.875rem', color: 'var(--color-text-muted)' }}>%</span>
        </div>
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
