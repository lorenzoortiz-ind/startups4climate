'use client'

import { useState } from 'react'
import { useToolState } from '@/lib/useToolState'
import type { ToolComponentProps } from './ToolPage'
import { ToolSection, ToolActionBar, ToolProgress, inputStyle, textareaStyle, labelStyle } from './shared'

interface Data {
  precio: number | string
  frecuencia: string
  valorCliente: number | string
  precioAlternativa: number | string
  justificacion: string
  tiers: string
}

const DEFAULT: Data = { precio: '', frecuencia: 'Mensual', valorCliente: '', precioAlternativa: '', justificacion: '', tiers: '' }
const FRECUENCIAS = ['Mensual', 'Anual', 'Por uso', '\u00danico']

const ACCENT = '#1F77F6'

const prefixStyle: React.CSSProperties = {
  position: 'absolute',
  left: '0.75rem',
  top: '50%',
  transform: 'translateY(-50%)',
  fontFamily: 'var(--font-body)',
  fontSize: '0.75rem',
  color: 'var(--color-text-muted)',
  pointerEvents: 'none',
}

export default function PricingFramework({ userId, onComplete, onGenerateReport }: ToolComponentProps) {
  const [data, setData] = useToolState<Data>(userId, 'pricing-framework', DEFAULT)
  const [saved, setSaved] = useState(false)
  const handleSave = () => { setSaved(true); setTimeout(() => setSaved(false), 2000) }

  const ratio = Number(data.precio) > 0 ? (Number(data.valorCliente) / Number(data.precio)).toFixed(1) : '\u2014'

  /* Progress: precio, valorCliente, precioAlternativa, justificacion, tiers */
  const sections = [
    String(data.precio).trim().length > 0,
    String(data.valorCliente).trim().length > 0,
    String(data.precioAlternativa).trim().length > 0,
    data.justificacion.trim().length > 0,
    data.tiers.trim().length > 0,
  ]
  const filled = sections.filter(Boolean).length

  const handleReport = () => {
    const content = `
FRAMEWORK DE PRICING

PRECIO PROPUESTO: $${Number(data.precio).toLocaleString()} (${data.frecuencia})
VALOR ENTREGADO AL CLIENTE: $${Number(data.valorCliente).toLocaleString()}
RATIO VALOR/PRECIO: ${ratio}x
PRECIO DE ALTERNATIVA M\u00c1S CERCANA: $${Number(data.precioAlternativa).toLocaleString()}

JUSTIFICACI\u00d3N DEL PRECIO:
${data.justificacion || '(No completado)'}

TIERS/PLANES:
${data.tiers || '(No completado)'}
    `.trim()
    onGenerateReport(content)
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
      <ToolProgress filled={filled} total={5} accentColor={ACCENT} />

      <ToolSection
        number={1}
        title="Definici\u00f3n de precio"
        subtitle="Precio, valor percibido y comparaci\u00f3n con alternativas"
        insight="El precio no se basa en costo. Se basa en el valor percibido por el cliente comparado con sus alternativas actuales."
        insightSource="MIT Sloan, Pricing Strategy"
        defaultOpen
        accentColor={ACCENT}
      >
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr auto', gap: '0.75rem' }}>
            <div>
              <label style={labelStyle}>Precio propuesto</label>
              <div style={{ position: 'relative' }}>
                <span style={prefixStyle}>$</span>
                <input type="number" value={data.precio} onChange={e => setData(p => ({ ...p, precio: e.target.value }))} placeholder="Ej: 99" step="0.01" style={{ ...inputStyle, paddingLeft: '1.75rem' }} />
              </div>
            </div>
            <div>
              <label style={labelStyle}>Frecuencia</label>
              <select value={data.frecuencia} onChange={e => setData(p => ({ ...p, frecuencia: e.target.value }))} style={inputStyle}>
                {FRECUENCIAS.map(f => <option key={f} value={f}>{f}</option>)}
              </select>
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
            <div>
              <label style={labelStyle}>Valor entregado al cliente</label>
              <div style={{ position: 'relative' }}>
                <span style={prefixStyle}>$</span>
                <input type="number" value={data.valorCliente} onChange={e => setData(p => ({ ...p, valorCliente: e.target.value }))} placeholder="Ej: 1000" step="1" style={{ ...inputStyle, paddingLeft: '1.75rem' }} />
              </div>
            </div>
            <div>
              <label style={labelStyle}>Precio alternativa m\u00e1s cercana</label>
              <div style={{ position: 'relative' }}>
                <span style={prefixStyle}>$</span>
                <input type="number" value={data.precioAlternativa} onChange={e => setData(p => ({ ...p, precioAlternativa: e.target.value }))} placeholder="Ej: 150" step="1" style={{ ...inputStyle, paddingLeft: '1.75rem' }} />
              </div>
            </div>
          </div>

          {/* Ratio display */}
          <div style={{
            padding: '1rem',
            borderRadius: 12,
            textAlign: 'center',
            background: Number(ratio) >= 3 ? 'linear-gradient(135deg, #1F77F6, #1F77F6)' : Number(ratio) >= 1 ? 'linear-gradient(135deg, #2A222B, #F59E0B)' : 'linear-gradient(135deg, #DC2626, #EF4444)',
            color: 'white',
          }}>
            <div style={{ fontFamily: 'var(--font-body)', fontSize: '0.6875rem', textTransform: 'uppercase', letterSpacing: '0.05em', opacity: 0.8 }}>Ratio Valor / Precio</div>
            <div style={{ fontFamily: 'var(--font-heading)', fontSize: '1.75rem', fontWeight: 400 }}>{ratio}x</div>
            <div style={{ fontFamily: 'var(--font-body)', fontSize: '0.75rem', opacity: 0.8 }}>
              {Number(ratio) >= 3 ? 'Excelente \u2014 el cliente percibe mucho m\u00e1s valor' : Number(ratio) >= 1 ? 'Aceptable \u2014 considera aumentar el valor percibido' : 'Bajo \u2014 el precio supera el valor percibido'}
            </div>
          </div>
        </div>
      </ToolSection>

      <ToolSection
        number={2}
        title="Justificaci\u00f3n del precio"
        subtitle="Argumenta por qu\u00e9 este precio es el correcto"
        accentColor={ACCENT}
      >
        <textarea
          value={data.justificacion}
          onChange={e => setData(p => ({ ...p, justificacion: e.target.value }))}
          placeholder="\u00bfPor qu\u00e9 este precio es el correcto? \u00bfC\u00f3mo llegaste a esta cifra?"
          rows={4}
          style={textareaStyle}
        />
      </ToolSection>

      <ToolSection
        number={3}
        title="Tiers / Planes"
        subtitle="Niveles de servicio que ofreces"
        accentColor={ACCENT}
      >
        <textarea
          value={data.tiers}
          onChange={e => setData(p => ({ ...p, tiers: e.target.value }))}
          placeholder="Describe los diferentes planes o niveles de servicio que ofreces"
          rows={5}
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
