'use client'

import { useState } from 'react'
import { Download } from 'lucide-react'
import { useToolState } from '@/lib/useToolState'
import type { ToolComponentProps } from './ToolPage'

const BLOCKS = [
  { id: 'problem', label: 'Problema', hint: 'Top 3 problemas del cliente. ¿Qué está roto? ¿Qué alternativas existen hoy?', color: '#DC2626', row: 0, col: 0, span: 1 },
  { id: 'solution', label: 'Solución', hint: 'Top 3 características de tu solución que resuelven el problema directamente.', color: '#7C3AED', row: 0, col: 1, span: 1 },
  { id: 'uvp', label: 'Propuesta de Valor Única', hint: 'Un mensaje claro y convincente: ¿qué te hace diferente y por qué importa?', color: '#059669', row: 0, col: 2, span: 1 },
  { id: 'advantage', label: 'Ventaja Diferencial', hint: 'Algo que no puede copiarse fácilmente: IP, red, datos exclusivos, acceso regulatorio.', color: '#0891B2', row: 0, col: 3, span: 1 },
  { id: 'segments', label: 'Segmentos de Cliente', hint: '¿A quién le vendes? Define el early adopter más específico posible.', color: '#D97706', row: 0, col: 4, span: 1 },
  { id: 'metrics', label: 'Métricas Clave', hint: 'Las 3-5 métricas que miden la salud del negocio (TRL, MWh, tCO2eq, contratos LOI).', color: '#0D9488', row: 1, col: 0, span: 1 },
  { id: 'channels', label: 'Canales', hint: '¿Cómo llega tu solución al cliente? Venta directa, distribuidores, partnerships.', color: '#7C3AED', row: 1, col: 3, span: 1 },
  { id: 'costs', label: 'Estructura de Costos', hint: 'Costos fijos y variables más relevantes: I+D, manufactura, ventas, capex.', color: '#DC2626', row: 2, col: 0, span: 2 },
  { id: 'revenue', label: 'Flujo de Ingresos', hint: 'Cómo generas dinero: precio, HaaS/PPA, licencias, grants, créditos de carbono.', color: '#059669', row: 2, col: 2, span: 2 },
  { id: 'impact', label: 'Impacto Ambiental', hint: 'tCO2eq reducidas/año, energía renovable generada, residuos evitados. Cuantifica.', color: '#10B981', row: 2, col: 0, span: 1 },
  { id: 'regulatory', label: 'Contexto Regulatorio', hint: 'Normativas aplicables, subsidios disponibles, barreras de certificación y plazos.', color: '#F97316', row: 2, col: 1, span: 1 },
]

export default function LeanCanvas({ userId, onComplete, onGenerateReport }: ToolComponentProps) {
  const defaultValues = Object.fromEntries(BLOCKS.map((b) => [b.id, ''])) as Record<string, string>
  const [values, setValues] = useToolState(userId, 'lean-canvas', defaultValues)
  const [activeBlock, setActiveBlock] = useState<string | null>(null)

  const filled = BLOCKS.filter((b) => values[b.id]?.trim().length > 0).length
  const pct = Math.round((filled / BLOCKS.length) * 100)

  const handleReport = () => {
    const content = `
CLIMATE LEAN CANVAS

${BLOCKS.map((b) => `${b.label.toUpperCase()}:
${values[b.id] || '(No completado)'}
`).join('\n')}

Completado: ${filled}/${BLOCKS.length} bloques (${pct}%)
    `.trim()
    onGenerateReport(content)
    onComplete()
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
      {/* Progress */}
      <div style={{ background: 'var(--color-bg-card)', borderRadius: 12, border: '1px solid var(--color-border)', padding: '1rem 1.25rem', display: 'flex', alignItems: 'center', gap: '1rem' }}>
        <div style={{ flex: 1 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.375rem' }}>
            <span style={{ fontFamily: 'var(--font-body)', fontSize: '0.8125rem', color: 'var(--color-text-secondary)' }}>Completado</span>
            <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.8125rem', fontWeight: 700, color: '#7C3AED' }}>{filled}/{BLOCKS.length} bloques</span>
          </div>
          <div style={{ height: 4, borderRadius: 2, background: 'var(--color-bg-muted)' }}>
            <div style={{ height: '100%', borderRadius: 2, background: '#7C3AED', width: `${pct}%`, transition: 'width 0.4s' }} />
          </div>
        </div>
      </div>

      {/* Canvas grid — 3 columns max */}
      <div style={{ background: 'var(--color-bg-card)', borderRadius: 16, border: '1px solid var(--color-border)', padding: '1.25rem', boxShadow: 'var(--shadow-card)' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '0.625rem' }}>
          {/* Row 1: Problem, Solution, UVP */}
          {BLOCKS.slice(0, 3).map((block) => (
            <CanvasBlock key={block.id} block={block} value={values[block.id]} onChange={(v) => setValues((p) => ({ ...p, [block.id]: v }))} active={activeBlock === block.id} onFocus={() => setActiveBlock(block.id)} onBlur={() => setActiveBlock(null)} />
          ))}
          {/* Row 2: Advantage, Segments, Metrics */}
          {[BLOCKS[3], BLOCKS[4], BLOCKS[5]].map((block) => (
            <CanvasBlock key={block.id} block={block} value={values[block.id]} onChange={(v) => setValues((p) => ({ ...p, [block.id]: v }))} active={activeBlock === block.id} onFocus={() => setActiveBlock(block.id)} onBlur={() => setActiveBlock(null)} />
          ))}
          {/* Row 3: Channels, Costs, Revenue */}
          {[BLOCKS[6], BLOCKS[7], BLOCKS[8]].map((block) => (
            <CanvasBlock key={block.id} block={block} value={values[block.id]} onChange={(v) => setValues((p) => ({ ...p, [block.id]: v }))} active={activeBlock === block.id} onFocus={() => setActiveBlock(block.id)} onBlur={() => setActiveBlock(null)} />
          ))}
        </div>

        {/* Climate extra blocks */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.625rem', marginTop: '0.625rem' }}>
          {BLOCKS.slice(9).map((block) => (
            <CanvasBlock key={block.id} block={block} value={values[block.id]} onChange={(v) => setValues((p) => ({ ...p, [block.id]: v }))} active={activeBlock === block.id} onFocus={() => setActiveBlock(block.id)} onBlur={() => setActiveBlock(null)} climate />
          ))}
        </div>
      </div>

      <button
        onClick={handleReport}
        style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', width: '100%', padding: '0.875rem', borderRadius: 12, background: '#7C3AED', color: 'white', fontFamily: 'var(--font-body)', fontSize: '0.9375rem', fontWeight: 600, border: 'none', cursor: 'pointer', boxShadow: '0 4px 14px rgba(124,58,237,0.3)', transition: 'all 0.2s' }}
        onMouseEnter={(e) => (e.currentTarget.style.background = '#6D28D9')}
        onMouseLeave={(e) => (e.currentTarget.style.background = '#7C3AED')}
      >
        <Download size={17} />
        Exportar Canvas Completo
      </button>
    </div>
  )
}

function CanvasBlock({ block, value, onChange, active, onFocus, onBlur, climate }: {
  block: typeof BLOCKS[0]; value: string; onChange: (v: string) => void;
  active: boolean; onFocus: () => void; onBlur: () => void; climate?: boolean;
}) {
  return (
    <div style={{ borderRadius: 10, border: `1.5px solid ${active ? block.color : value ? block.color + '30' : 'var(--color-border)'}`, background: active ? block.color + '06' : 'var(--color-bg-card)', transition: 'all 0.18s', overflow: 'hidden' }}>
      <div style={{ padding: '0.5rem 0.625rem', background: block.color + '10', borderBottom: `1px solid ${block.color}20`, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <span style={{ fontFamily: 'var(--font-heading)', fontSize: '0.6875rem', fontWeight: 700, color: block.color }}>{block.label}</span>
        {climate && <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.5625rem', color: block.color, textTransform: 'uppercase' }}>Climático</span>}
      </div>
      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onFocus={onFocus}
        onBlur={onBlur}
        placeholder={block.hint}
        rows={7}
        style={{ width: '100%', padding: '0.625rem 0.75rem', border: 'none', background: 'transparent', fontFamily: 'var(--font-body)', fontSize: '0.875rem', lineHeight: 1.6, color: 'var(--color-text-primary)', outline: 'none', resize: 'vertical', minHeight: 130 }}
      />
    </div>
  )
}
