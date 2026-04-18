'use client'

import { useState } from 'react'
import { useToolState } from '@/lib/useToolState'
import type { ToolComponentProps } from './ToolPage'
import { ToolSection, ToolActionBar, ToolProgress, InsightPanel, inputStyle, textareaStyle, labelStyle } from './shared'

interface Data {
  definicionCore: string
  barreras: string
  ejeXLabel: string
  ejeYLabel: string
  tuX: number | string
  tuY: number | string
  comp1Name: string
  comp1X: number | string
  comp1Y: number | string
  comp2Name: string
  comp2X: number | string
  comp2Y: number | string
}

const DEFAULT: Data = {
  definicionCore: '', barreras: '',
  ejeXLabel: '', ejeYLabel: '',
  tuX: 5, tuY: 5,
  comp1Name: '', comp1X: 5, comp1Y: 5,
  comp2Name: '', comp2X: 5, comp2Y: 5,
}

export default function CoreCompetitivePosition({ userId, onComplete, onGenerateReport }: ToolComponentProps) {
  const [data, setData] = useToolState<Data>(userId, 'core-competitive-position', DEFAULT)
  const [saved, setSaved] = useState(false)
  const handleSave = () => { setSaved(true); setTimeout(() => setSaved(false), 2000) }

  const sectionKeys = ['definicionCore', 'barreras', 'ejeXLabel'] as const
  const filled = [
    data.definicionCore.trim().length > 0,
    data.barreras.trim().length > 0,
    data.ejeXLabel.trim().length > 0 || data.ejeYLabel.trim().length > 0,
  ].filter(Boolean).length

  const handleReport = () => {
    const content = `
POSICIÓN COMPETITIVA CORE

DEFINICIÓN DEL CORE:
${data.definicionCore || '(No completado)'}

BARRERAS DE ENTRADA:
${data.barreras || '(No completado)'}

MAPA DE POSICIONAMIENTO:
- Eje X: ${data.ejeXLabel || '(No definido)'}
- Eje Y: ${data.ejeYLabel || '(No definido)'}
- Tu posición: (${data.tuX}, ${data.tuY})
- ${data.comp1Name || 'Competidor 1'}: (${data.comp1X}, ${data.comp1Y})
- ${data.comp2Name || 'Competidor 2'}: (${data.comp2X}, ${data.comp2Y})
    `.trim()
    onGenerateReport(content)
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
      <ToolProgress filled={filled} total={sectionKeys.length} accentColor="#1F77F6" />

      <InsightPanel title="Referencia académica">
        <p style={{ margin: 0 }}>
          &ldquo;Tu ventaja competitiva sostenible no puede ser &lsquo;mejor tecnología&rsquo;. Debe ser algo estructural: network effects, datos propietarios, o switching costs.&rdquo;
        </p>
        <span style={{
          fontFamily: 'var(--font-body)',
          fontSize: '0.6875rem',
          color: 'var(--color-text-muted)',
          fontStyle: 'italic',
          marginTop: '0.25rem',
          display: 'block',
        }}>
          — Harvard Business School, Strategy
        </span>
      </InsightPanel>

      <ToolSection number={1} title="Definición del core" subtitle="Tu capacidad central diferenciadora" accentColor="#1F77F6">
        <textarea value={data.definicionCore} onChange={e => setData(p => ({ ...p, definicionCore: e.target.value }))} placeholder="¿Cuál es la capacidad central que te hace competitivo? ¿Qué haces mejor que nadie?" rows={4} style={textareaStyle} />
      </ToolSection>

      <ToolSection number={2} title="Barreras de entrada" subtitle="Defensas estructurales de tu posición" accentColor="#1F77F6">
        <textarea value={data.barreras} onChange={e => setData(p => ({ ...p, barreras: e.target.value }))} placeholder="¿Qué barreras protegen tu posición? IP, datos, red de contactos, regulación..." rows={4} style={textareaStyle} />
      </ToolSection>

      <ToolSection number={3} title="Mapa de posicionamiento" subtitle="Visualiza tu posición vs competidores" defaultOpen accentColor="#1F77F6">
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem', marginBottom: '1rem' }}>
          <div>
            <label style={labelStyle}>Eje X (etiqueta)</label>
            <input value={data.ejeXLabel} onChange={e => setData(p => ({ ...p, ejeXLabel: e.target.value }))} placeholder="Ej: Precio" style={inputStyle} />
          </div>
          <div>
            <label style={labelStyle}>Eje Y (etiqueta)</label>
            <input value={data.ejeYLabel} onChange={e => setData(p => ({ ...p, ejeYLabel: e.target.value }))} placeholder="Ej: Calidad" style={inputStyle} />
          </div>
        </div>

        {/* Tu posición */}
        <div style={{ padding: '0.875rem', borderRadius: 10, border: '2px solid #1F77F630', background: '#1F77F608', marginBottom: '0.75rem' }}>
          <span style={{ ...labelStyle, color: '#1F77F6', fontWeight: 700 }}>Tu startup</span>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.625rem', marginTop: '0.375rem' }}>
            <div>
              <label style={labelStyle}>{data.ejeXLabel || 'Eje X'}: {data.tuX}</label>
              <input type="range" min={1} max={10} value={Number(data.tuX)} onChange={e => setData(p => ({ ...p, tuX: parseInt(e.target.value) }))} style={{ width: '100%' }} />
              <div style={{ display: 'flex', justifyContent: 'space-between', fontFamily: 'var(--font-body)', fontSize: '0.5625rem', color: 'var(--color-text-muted)', marginTop: '0.125rem' }}>
                <span>1 = Mínimo</span><span>5 = Moderado</span><span>10 = Máximo</span>
              </div>
            </div>
            <div>
              <label style={labelStyle}>{data.ejeYLabel || 'Eje Y'}: {data.tuY}</label>
              <input type="range" min={1} max={10} value={Number(data.tuY)} onChange={e => setData(p => ({ ...p, tuY: parseInt(e.target.value) }))} style={{ width: '100%' }} />
              <div style={{ display: 'flex', justifyContent: 'space-between', fontFamily: 'var(--font-body)', fontSize: '0.5625rem', color: 'var(--color-text-muted)', marginTop: '0.125rem' }}>
                <span>1 = Mínimo</span><span>5 = Moderado</span><span>10 = Máximo</span>
              </div>
            </div>
          </div>
        </div>

        {/* Competidores */}
        {[
          { label: 'Competidor 1', nameKey: 'comp1Name' as const, xKey: 'comp1X' as const, yKey: 'comp1Y' as const },
          { label: 'Competidor 2', nameKey: 'comp2Name' as const, xKey: 'comp2X' as const, yKey: 'comp2Y' as const },
        ].map(comp => (
          <div key={comp.label} style={{ padding: '0.875rem', borderRadius: 10, border: '1px solid var(--color-border)', marginBottom: '0.75rem' }}>
            <input value={data[comp.nameKey] as string} onChange={e => setData(p => ({ ...p, [comp.nameKey]: e.target.value }))} placeholder={`Nombre del ${comp.label.toLowerCase()}`} style={{ ...inputStyle, marginBottom: '0.5rem' }} />
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.625rem' }}>
              <div>
                <label style={labelStyle}>{data.ejeXLabel || 'Eje X'}: {data[comp.xKey] as number}</label>
                <input type="range" min={1} max={10} value={Number(data[comp.xKey])} onChange={e => setData(p => ({ ...p, [comp.xKey]: parseInt(e.target.value) }))} style={{ width: '100%' }} />
                <div style={{ display: 'flex', justifyContent: 'space-between', fontFamily: 'var(--font-body)', fontSize: '0.5625rem', color: 'var(--color-text-muted)', marginTop: '0.125rem' }}>
                  <span>1 = Mínimo</span><span>5 = Moderado</span><span>10 = Máximo</span>
                </div>
              </div>
              <div>
                <label style={labelStyle}>{data.ejeYLabel || 'Eje Y'}: {data[comp.yKey] as number}</label>
                <input type="range" min={1} max={10} value={Number(data[comp.yKey])} onChange={e => setData(p => ({ ...p, [comp.yKey]: parseInt(e.target.value) }))} style={{ width: '100%' }} />
                <div style={{ display: 'flex', justifyContent: 'space-between', fontFamily: 'var(--font-body)', fontSize: '0.5625rem', color: 'var(--color-text-muted)', marginTop: '0.125rem' }}>
                  <span>1 = Mínimo</span><span>5 = Moderado</span><span>10 = Máximo</span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </ToolSection>

      <ToolActionBar
        onSave={handleSave}
        onComplete={onComplete}
        onReport={handleReport}
        saved={saved}
        accentColor="#1F77F6"
      />
    </div>
  )
}
