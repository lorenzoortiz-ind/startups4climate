'use client'

import { useState } from 'react'
import { Plus, Trash2, ChevronDown } from 'lucide-react'
import { useToolState } from '@/lib/useToolState'
import type { ToolComponentProps } from './ToolPage'
import { ToolSection, ToolActionBar, ToolProgress, inputStyle, textareaStyle, btnSmall } from './shared'

interface AdjacentMarket { name: string; tamEstimate: number | string; entryStrategy: string }

interface Data {
  featuresProxima: string
  featuresV2: string
  markets: AdjacentMarket[]
  estrategiaExpansion: string
}

const emptyMarket = (): AdjacentMarket => ({ name: '', tamEstimate: '', entryStrategy: '' })

const DEFAULT: Data = {
  featuresProxima: '',
  featuresV2: '',
  markets: [emptyMarket()],
  estrategiaExpansion: '',
}

export default function ProductPlanScaling({ userId, onComplete, onGenerateReport }: ToolComponentProps) {
  const [data, setData] = useToolState<Data>(userId, 'product-plan-scaling', DEFAULT)
  const [openSections, setOpenSections] = useState<Record<string, boolean>>({})
  const [saved, setSaved] = useState(false)
  const toggle = (k: string) => setOpenSections(p => ({ ...p, [k]: !p[k] }))
  const handleSave = () => { setSaved(true); setTimeout(() => setSaved(false), 2000) }

  const updateMarket = (i: number, field: keyof AdjacentMarket, value: string) => {
    setData(p => { const m = [...p.markets]; m[i] = { ...m[i], [field]: value }; return { ...p, markets: m } })
  }
  const addMarket = () => setData(p => ({ ...p, markets: [...p.markets, emptyMarket()] }))
  const removeMarket = (i: number) => setData(p => ({ ...p, markets: p.markets.filter((_, idx) => idx !== i) }))

  /* ── Progress ── */
  const filled = [
    data.featuresProxima.trim(),
    data.featuresV2.trim(),
    data.markets.some(m => m.name.trim()),
    data.estrategiaExpansion.trim(),
  ].filter(Boolean).length

  const handleReport = () => {
    const content = `
PLAN DE PRODUCTO Y ESCALAMIENTO

FEATURES PRÓXIMA VERSIÓN:
${data.featuresProxima || '(No completado)'}

FEATURES VERSIÓN 2:
${data.featuresV2 || '(No completado)'}

MERCADOS ADYACENTES:
${data.markets.map((m, i) => `${i + 1}. ${m.name || '(Sin nombre)'}
   TAM estimado: $${Number(m.tamEstimate).toLocaleString()}
   Estrategia de entrada: ${m.entryStrategy || '(No completado)'}`).join('\n')}

ESTRATEGIA DE EXPANSIÓN:
${data.estrategiaExpansion || '(No completado)'}
    `.trim()
    onGenerateReport(content)
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
      <ToolProgress filled={filled} total={4} accentColor="#1F77F6" />

      <ToolSection
        number={1}
        title="Features próxima versión"
        subtitle="Roadmap inmediato de producto"
        insight="Escalar prematuramente es la causa #1 de muerte de startups. Primero domina tu beachhead, luego expande metódicamente."
        insightSource="Startup Genome Project"
        defaultOpen
      >
        <textarea value={data.featuresProxima} onChange={e => setData(p => ({ ...p, featuresProxima: e.target.value }))} placeholder="¿Qué features planeas lanzar en la siguiente versión?" rows={5} style={textareaStyle} />
      </ToolSection>

      <ToolSection number={2} title="Features versión 2" subtitle="Visión a mediano plazo del producto">
        <textarea value={data.featuresV2} onChange={e => setData(p => ({ ...p, featuresV2: e.target.value }))} placeholder="¿Qué features vendrán en la versión 2 del producto?" rows={5} style={textareaStyle} />
      </ToolSection>

      <ToolSection number={3} title="Mercados adyacentes" subtitle="Oportunidades de expansión geográfica o vertical">
        {data.markets.map((m, i) => (
          <div key={i} style={{ padding: '1rem', borderRadius: 10, border: '1px solid var(--color-border)', marginBottom: '0.75rem', background: 'var(--color-bg-primary)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.625rem' }}>
              <span style={{ fontFamily: 'var(--font-heading)', fontSize: '0.8125rem', fontWeight: 700, color: 'var(--color-text-secondary)' }}>Mercado {i + 1}</span>
              {data.markets.length > 1 && (
                <button onClick={() => removeMarket(i)} style={{ ...btnSmall, color: '#DC2626', border: '1px solid #DC262630' }}>
                  <Trash2 size={12} />
                </button>
              )}
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr auto', gap: '0.625rem', marginBottom: '0.625rem' }}>
              <input value={m.name} onChange={e => updateMarket(i, 'name', e.target.value)} placeholder="Nombre del mercado" style={inputStyle} />
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                <span style={{ fontFamily: 'var(--font-body)', fontSize: '0.8125rem', color: 'var(--color-text-muted)' }}>$</span>
                <input type="number" value={m.tamEstimate} onChange={e => updateMarket(i, 'tamEstimate', e.target.value)} placeholder="TAM estimado" style={{ ...inputStyle, width: 130 }} />
              </div>
            </div>

            <button onClick={() => toggle(`entry-${i}`)} style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0.5rem 0', background: 'none', border: 'none', cursor: 'pointer', marginBottom: openSections[`entry-${i}`] ? '0.5rem' : 0 }}>
              <span style={{ fontSize: '0.8125rem', fontWeight: 600, color: 'var(--color-text-secondary)', fontFamily: 'var(--font-body)' }}>Estrategia de entrada</span>
              <ChevronDown size={14} color="var(--color-text-muted)" style={{ transform: openSections[`entry-${i}`] ? 'rotate(180deg)' : 'rotate(0)', transition: 'transform 0.2s' }} />
            </button>
            {openSections[`entry-${i}`] && <textarea value={m.entryStrategy} onChange={e => updateMarket(i, 'entryStrategy', e.target.value)} placeholder="¿Cómo planeas entrar a este mercado?" rows={3} style={textareaStyle} />}
          </div>
        ))}
        <button onClick={addMarket} style={{ ...btnSmall, color: '#1F77F6', border: '1px solid #1F77F630' }}>
          <Plus size={14} /> Agregar mercado
        </button>
      </ToolSection>

      <ToolSection number={4} title="Estrategia de expansión" subtitle="Plan general de escalamiento">
        <textarea value={data.estrategiaExpansion} onChange={e => setData(p => ({ ...p, estrategiaExpansion: e.target.value }))} placeholder="¿Cuál es tu plan general de escalamiento y expansión?" rows={5} style={textareaStyle} />
      </ToolSection>

      <ToolActionBar onSave={handleSave} onComplete={onComplete} onReport={handleReport} saved={saved} />
    </div>
  )
}
