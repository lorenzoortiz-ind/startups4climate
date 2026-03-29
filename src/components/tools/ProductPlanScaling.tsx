'use client'

import { useState } from 'react'
import { ChevronDown, Save, CheckCircle2, FileText, Plus, Trash2 } from 'lucide-react'
import { useToolState } from '@/lib/useToolState'
import type { ToolComponentProps } from './ToolPage'

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
      <Collapsible title="Features próxima versión" k="featuresProxima" open={openSections} toggle={toggle}>
        <textarea value={data.featuresProxima} onChange={e => setData(p => ({ ...p, featuresProxima: e.target.value }))} placeholder="¿Qué features planeas lanzar en la siguiente versión?" rows={5} style={taStyle} />
      </Collapsible>

      <Collapsible title="Features versión 2" k="featuresV2" open={openSections} toggle={toggle}>
        <textarea value={data.featuresV2} onChange={e => setData(p => ({ ...p, featuresV2: e.target.value }))} placeholder="¿Qué features vendrán en la versión 2 del producto?" rows={5} style={taStyle} />
      </Collapsible>

      {/* Markets - has number fields */}
      <div style={cardStyle}>
        <div style={{ padding: '1rem 1.25rem' }}><span style={headingStyle}>Mercados adyacentes</span></div>
        <div style={{ padding: '0 1.25rem 1.25rem' }}>
          {data.markets.map((m, i) => (
            <div key={i} style={{ padding: '1rem', borderRadius: 10, border: '1px solid var(--color-border)', marginBottom: '0.75rem', background: 'var(--color-bg-primary)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.625rem' }}>
                <span style={{ fontFamily: 'var(--font-heading)', fontSize: '0.8125rem', fontWeight: 700, color: 'var(--color-text-secondary)' }}>Mercado {i + 1}</span>
                {data.markets.length > 1 && <button onClick={() => removeMarket(i)} style={btnDanger}><Trash2 size={12} /></button>}
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr auto', gap: '0.625rem', marginBottom: '0.625rem' }}>
                <input value={m.name} onChange={e => updateMarket(i, 'name', e.target.value)} placeholder="Nombre del mercado" style={inputStyle} />
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                  <span style={{ fontFamily: 'var(--font-body)', fontSize: '0.8125rem', color: 'var(--color-text-muted)' }}>$</span>
                  <input type="number" value={m.tamEstimate} onChange={e => updateMarket(i, 'tamEstimate', e.target.value)} placeholder="TAM estimado" style={{ ...inputStyle, width: 130 }} />
                </div>
              </div>
              <button onClick={() => toggle(`entry-${i}`)} style={{ ...sectionBtnSmall, marginBottom: openSections[`entry-${i}`] ? '0.5rem' : 0 }}>
                <span style={{ fontSize: '0.8125rem', fontWeight: 600, color: 'var(--color-text-secondary)', fontFamily: 'var(--font-body)' }}>Estrategia de entrada</span>
                <ChevronDown size={14} color="var(--color-text-muted)" style={{ transform: openSections[`entry-${i}`] ? 'rotate(180deg)' : 'rotate(0)', transition: 'transform 0.2s' }} />
              </button>
              {openSections[`entry-${i}`] && <textarea value={m.entryStrategy} onChange={e => updateMarket(i, 'entryStrategy', e.target.value)} placeholder="¿Cómo planeas entrar a este mercado?" rows={3} style={taStyle} />}
            </div>
          ))}
          <button onClick={addMarket} style={btnAdd}><Plus size={14} /> Agregar mercado</button>
        </div>
      </div>

      <Collapsible title="Estrategia de expansión" k="estrategiaExpansion" open={openSections} toggle={toggle}>
        <textarea value={data.estrategiaExpansion} onChange={e => setData(p => ({ ...p, estrategiaExpansion: e.target.value }))} placeholder="¿Cuál es tu plan general de escalamiento y expansión?" rows={5} style={taStyle} />
      </Collapsible>

      <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap', marginTop: '0.5rem' }}>
        <button onClick={handleSave} style={btnOG}><Save size={15} /> {saved ? '¡Guardado!' : 'Guardar progreso'}</button>
        <button onClick={onComplete} style={btnSG}><CheckCircle2 size={15} /> Marcar como completada</button>
        <button onClick={handleReport} style={btnO}><FileText size={15} /> Generar reporte</button>
      </div>
    </div>
  )
}

function Collapsible({ title, k, open, toggle, children }: { title: string; k: string; open: Record<string, boolean>; toggle: (k: string) => void; children: React.ReactNode }) {
  return (
    <div style={cardStyle}>
      <button onClick={() => toggle(k)} style={sectionBtn}>
        <span style={headingStyle}>{title}</span>
        <ChevronDown size={18} color="var(--color-text-muted)" style={{ transition: 'transform 0.2s', transform: open[k] ? 'rotate(180deg)' : 'rotate(0)' }} />
      </button>
      {open[k] && <div style={{ padding: '0 1.25rem 1.25rem' }}>{children}</div>}
    </div>
  )
}

const cardStyle: React.CSSProperties = { background: 'var(--color-bg-card)', borderRadius: 14, border: '1px solid var(--color-border)', overflow: 'hidden' }
const headingStyle: React.CSSProperties = { fontFamily: 'var(--font-heading)', fontSize: '0.9375rem', fontWeight: 700, color: 'var(--color-text-primary)' }
const sectionBtn: React.CSSProperties = { width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '1rem 1.25rem', background: 'none', border: 'none', cursor: 'pointer' }
const sectionBtnSmall: React.CSSProperties = { width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0.5rem 0', background: 'none', border: 'none', cursor: 'pointer', fontFamily: 'var(--font-body)' }
const inputStyle: React.CSSProperties = { width: '100%', padding: '0.625rem 0.875rem', borderRadius: 8, border: '1px solid var(--color-border)', background: 'var(--color-bg-card)', fontFamily: 'var(--font-body)', fontSize: '0.875rem', color: 'var(--color-text-primary)', outline: 'none' }
const taStyle: React.CSSProperties = { ...inputStyle, resize: 'vertical' as const, lineHeight: 1.6 }
const btnDanger: React.CSSProperties = { display: 'flex', alignItems: 'center', padding: '0.25rem 0.5rem', borderRadius: 6, background: 'transparent', color: '#DC2626', border: '1px solid #DC262630', cursor: 'pointer' }
const btnAdd: React.CSSProperties = { display: 'flex', alignItems: 'center', gap: '0.375rem', padding: '0.5rem 1rem', borderRadius: 8, fontSize: '0.8125rem', fontFamily: 'var(--font-body)', fontWeight: 600, background: 'transparent', color: '#0D9488', border: '1px solid #0D948830', cursor: 'pointer' }
const btnOG: React.CSSProperties = { display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.75rem 1.25rem', borderRadius: 10, fontFamily: 'var(--font-body)', fontSize: '0.875rem', fontWeight: 600, background: 'transparent', color: '#0D9488', border: '1.5px solid #0D948840', cursor: 'pointer' }
const btnSG: React.CSSProperties = { display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.75rem 1.25rem', borderRadius: 10, fontFamily: 'var(--font-body)', fontSize: '0.875rem', fontWeight: 600, background: '#0D9488', color: 'white', border: 'none', cursor: 'pointer', boxShadow: '0 2px 8px rgba(13,148,136,0.3)' }
const btnO: React.CSSProperties = { display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.75rem 1.25rem', borderRadius: 10, fontFamily: 'var(--font-body)', fontSize: '0.875rem', fontWeight: 600, background: 'transparent', color: 'var(--color-text-secondary)', border: '1.5px solid var(--color-border)', cursor: 'pointer' }
