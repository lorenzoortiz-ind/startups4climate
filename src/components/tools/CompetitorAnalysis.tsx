'use client'

import { useState } from 'react'
import { ChevronDown, Save, CheckCircle2, FileText, Plus, Trash2 } from 'lucide-react'
import { useToolState } from '@/lib/useToolState'
import type { ToolComponentProps } from './ToolPage'

interface Competitor {
  [key: string]: unknown
  name: string
  website: string
  description: string
  strengths: string
  weaknesses: string
  pricing: string
  target_market: string
}

interface MatrixDimension {
  [key: string]: unknown
  name: string
  scores: Record<number, number>
}

interface Data {
  [key: string]: unknown
  competitors: Competitor[]
  matrix_dimensions: MatrixDimension[]
  differentiation: string
}

const emptyCompetitor = (): Competitor => ({
  name: '', website: '', description: '', strengths: '', weaknesses: '', pricing: '', target_market: '',
})

const DEFAULT: Data = {
  competitors: [emptyCompetitor()],
  matrix_dimensions: [{ name: 'Precio', scores: {} }, { name: 'Calidad del producto', scores: {} }, { name: 'Experiencia de usuario', scores: {} }],
  differentiation: '',
}

const scoreColor = (s: number) => {
  if (s >= 4) return '#0D9488'
  if (s >= 3) return '#D97706'
  if (s >= 2) return '#EA580C'
  return '#DC2626'
}

export default function CompetitorAnalysis({ userId, onComplete, onGenerateReport }: ToolComponentProps) {
  const [data, setData] = useToolState<Data>(userId, 'competitor-analysis', DEFAULT)
  const [openSections, setOpenSections] = useState<Record<string, boolean>>({})
  const [saved, setSaved] = useState(false)

  const toggle = (k: string) => setOpenSections(p => ({ ...p, [k]: !p[k] }))

  const updateCompetitor = (i: number, field: keyof Competitor, value: string) => {
    setData(p => {
      const competitors = [...p.competitors]
      competitors[i] = { ...competitors[i], [field]: value }
      return { ...p, competitors }
    })
  }

  const addCompetitor = () => setData(p => ({ ...p, competitors: [...p.competitors, emptyCompetitor()] }))
  const removeCompetitor = (i: number) => setData(p => ({ ...p, competitors: p.competitors.filter((_, idx) => idx !== i) }))

  const addDimension = () => setData(p => ({ ...p, matrix_dimensions: [...p.matrix_dimensions, { name: '', scores: {} }] }))
  const removeDimension = (i: number) => setData(p => ({ ...p, matrix_dimensions: p.matrix_dimensions.filter((_, idx) => idx !== i) }))

  const updateDimensionName = (i: number, name: string) => {
    setData(p => {
      const dims = [...p.matrix_dimensions]
      dims[i] = { ...dims[i], name }
      return { ...p, matrix_dimensions: dims }
    })
  }

  const updateScore = (dimIdx: number, compIdx: number, score: number) => {
    setData(p => {
      const dims = [...p.matrix_dimensions]
      dims[dimIdx] = { ...dims[dimIdx], scores: { ...dims[dimIdx].scores, [compIdx]: score } }
      return { ...p, matrix_dimensions: dims }
    })
  }

  const handleSave = () => { setSaved(true); setTimeout(() => setSaved(false), 2000) }

  const handleReport = () => {
    const content = `
ANÁLISIS COMPETITIVO

COMPETIDORES:
${data.competitors.map((c, i) => `Competidor ${i + 1}: ${c.name || '(Sin nombre)'}
  Sitio web: ${c.website || '(No completado)'}
  Descripción: ${c.description || '(No completado)'}
  Fortalezas: ${c.strengths || '(No completado)'}
  Debilidades: ${c.weaknesses || '(No completado)'}
  Pricing: ${c.pricing || '(No completado)'}
  Mercado objetivo: ${c.target_market || '(No completado)'}`).join('\n\n')}

MATRIZ COMPETITIVA:
${data.matrix_dimensions.map(d => `${d.name || '(Sin nombre)'}: ${data.competitors.map((c, ci) => `${c.name || 'Comp ' + (ci + 1)}: ${d.scores[ci] || '-'}/5`).join(' | ')}`).join('\n')}

RESUMEN DE DIFERENCIACIÓN:
${data.differentiation || '(No completado)'}
    `.trim()
    onGenerateReport(content)
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
      {/* Competitors */}
      <SectionCollapsible title="Competidores" sectionKey="competitors" open={openSections} toggle={toggle}>
        {data.competitors.map((c, i) => (
          <div key={i} style={{ padding: '1rem', borderRadius: 10, border: '1px solid var(--color-border)', marginBottom: '0.75rem', background: 'var(--color-bg-primary)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
              <span style={{ fontFamily: 'var(--font-heading)', fontSize: '0.8125rem', fontWeight: 700, color: 'var(--color-text-secondary)' }}>Competidor {i + 1}</span>
              {data.competitors.length > 1 && (
                <button onClick={() => removeCompetitor(i)} style={{ ...btnSmall, color: '#DC2626', borderColor: '#DC262630' }}><Trash2 size={12} /> Eliminar</button>
              )}
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.625rem', marginBottom: '0.625rem' }}>
              <input value={c.name} onChange={e => updateCompetitor(i, 'name', e.target.value)} placeholder="Nombre" style={inputStyle} />
              <input value={c.website} onChange={e => updateCompetitor(i, 'website', e.target.value)} placeholder="Sitio web" style={inputStyle} />
            </div>
            <textarea value={c.description} onChange={e => updateCompetitor(i, 'description', e.target.value)} placeholder="Descripción del competidor" rows={2} style={taStyle} />
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.625rem', marginTop: '0.5rem' }}>
              <textarea value={c.strengths} onChange={e => updateCompetitor(i, 'strengths', e.target.value)} placeholder="Fortalezas" rows={2} style={taStyle} />
              <textarea value={c.weaknesses} onChange={e => updateCompetitor(i, 'weaknesses', e.target.value)} placeholder="Debilidades" rows={2} style={taStyle} />
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.625rem', marginTop: '0.5rem' }}>
              <input value={c.pricing} onChange={e => updateCompetitor(i, 'pricing', e.target.value)} placeholder="Modelo de precios" style={inputStyle} />
              <input value={c.target_market} onChange={e => updateCompetitor(i, 'target_market', e.target.value)} placeholder="Mercado objetivo" style={inputStyle} />
            </div>
          </div>
        ))}
        <button onClick={addCompetitor} style={{ ...btnSmall, color: '#0D9488', borderColor: '#0D948830' }}><Plus size={12} /> Agregar competidor</button>
      </SectionCollapsible>

      {/* Competitive Matrix */}
      <SectionCollapsible title="Matriz competitiva" sectionKey="matrix" open={openSections} toggle={toggle}>
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontFamily: 'var(--font-body)', fontSize: '0.8125rem' }}>
            <thead>
              <tr>
                <th style={{ ...thStyle, minWidth: 140 }}>Dimensión</th>
                {data.competitors.map((c, ci) => (
                  <th key={ci} style={{ ...thStyle, minWidth: 100 }}>{c.name || `Comp ${ci + 1}`}</th>
                ))}
                <th style={thStyle}></th>
              </tr>
            </thead>
            <tbody>
              {data.matrix_dimensions.map((d, di) => (
                <tr key={di}>
                  <td style={tdStyle}>
                    <input value={d.name} onChange={e => updateDimensionName(di, e.target.value)} placeholder="Dimensión" style={{ ...inputStyle, padding: '0.4rem 0.6rem', fontSize: '0.8125rem' }} />
                  </td>
                  {data.competitors.map((_, ci) => (
                    <td key={ci} style={tdStyle}>
                      <select
                        value={d.scores[ci] || ''}
                        onChange={e => updateScore(di, ci, Number(e.target.value))}
                        style={{
                          ...inputStyle,
                          padding: '0.4rem 0.6rem',
                          fontSize: '0.8125rem',
                          background: d.scores[ci] ? `${scoreColor(d.scores[ci])}15` : 'var(--color-bg-card)',
                          color: d.scores[ci] ? scoreColor(d.scores[ci]) : 'var(--color-text-primary)',
                          fontWeight: d.scores[ci] ? 700 : 400,
                        }}
                      >
                        <option value="">—</option>
                        {[1, 2, 3, 4, 5].map(s => <option key={s} value={s}>{s}</option>)}
                      </select>
                    </td>
                  ))}
                  <td style={tdStyle}>
                    {data.matrix_dimensions.length > 1 && (
                      <button onClick={() => removeDimension(di)} style={{ ...btnSmall, color: '#DC2626', borderColor: '#DC262630', padding: '0.25rem 0.5rem' }}><Trash2 size={11} /></button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <button onClick={addDimension} style={{ ...btnSmall, color: '#0D9488', borderColor: '#0D948830', marginTop: '0.75rem' }}><Plus size={12} /> Agregar dimensión</button>
      </SectionCollapsible>

      {/* Differentiation */}
      <SectionCollapsible title="Resumen de diferenciación" sectionKey="differentiation" open={openSections} toggle={toggle}>
        <textarea value={data.differentiation} onChange={e => setData(p => ({ ...p, differentiation: e.target.value }))} placeholder="¿Qué hace única a tu startup frente a la competencia? ¿Cuál es tu ventaja competitiva sostenible?" rows={5} style={taStyle} />
      </SectionCollapsible>

      {/* Buttons */}
      <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap', marginTop: '0.5rem' }}>
        <button onClick={handleSave} style={btnOutlineGreen}>
          <Save size={15} /> {saved ? '¡Guardado!' : 'Guardar progreso'}
        </button>
        <button onClick={onComplete} style={btnSolidGreen}>
          <CheckCircle2 size={15} /> Marcar como completada
        </button>
        <button onClick={handleReport} style={btnOutline}>
          <FileText size={15} /> Generar reporte
        </button>
      </div>
    </div>
  )
}

/* ── Shared sub-components & styles ── */

function SectionCollapsible({ title, sectionKey, open, toggle, children }: {
  title: string; sectionKey: string; open: Record<string, boolean>; toggle: (k: string) => void; children: React.ReactNode
}) {
  return (
    <div style={{ background: 'var(--color-bg-card)', borderRadius: 14, border: '1px solid var(--color-border)', overflow: 'hidden' }}>
      <button onClick={() => toggle(sectionKey)} style={sectionBtn}>
        <span style={{ fontFamily: 'var(--font-heading)', fontSize: '0.9375rem', fontWeight: 700, color: 'var(--color-text-primary)' }}>{title}</span>
        <ChevronDown size={18} color="var(--color-text-muted)" style={{ transition: 'transform 0.2s', transform: open[sectionKey] ? 'rotate(180deg)' : 'rotate(0)' }} />
      </button>
      {open[sectionKey] && <div style={{ padding: '0 1.25rem 1.25rem' }}>{children}</div>}
    </div>
  )
}

const sectionBtn: React.CSSProperties = {
  width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'space-between',
  padding: '1rem 1.25rem', background: 'none', border: 'none', cursor: 'pointer',
}

const inputStyle: React.CSSProperties = {
  width: '100%', padding: '0.625rem 0.875rem', borderRadius: 8,
  border: '1px solid var(--color-border)', background: 'var(--color-bg-card)',
  fontFamily: 'var(--font-body)', fontSize: '0.875rem', color: 'var(--color-text-primary)',
  outline: 'none',
}

const taStyle: React.CSSProperties = {
  ...inputStyle, resize: 'vertical' as const, lineHeight: 1.6,
}

const btnSmall: React.CSSProperties = {
  display: 'inline-flex', alignItems: 'center', gap: '0.3rem',
  padding: '0.35rem 0.75rem', borderRadius: 6, fontSize: '0.75rem',
  fontFamily: 'var(--font-body)', fontWeight: 600, background: 'transparent',
  border: '1px solid var(--color-border)', cursor: 'pointer',
}

const thStyle: React.CSSProperties = {
  padding: '0.5rem 0.625rem', textAlign: 'left', fontWeight: 600,
  color: 'var(--color-text-secondary)', borderBottom: '2px solid var(--color-border)',
}

const tdStyle: React.CSSProperties = {
  padding: '0.375rem 0.625rem', borderBottom: '1px solid var(--color-border)',
}

const btnOutlineGreen: React.CSSProperties = {
  display: 'flex', alignItems: 'center', gap: '0.5rem',
  padding: '0.75rem 1.25rem', borderRadius: 10,
  fontFamily: 'var(--font-body)', fontSize: '0.875rem', fontWeight: 600,
  background: 'transparent', color: '#0D9488',
  border: '1.5px solid #0D948840', cursor: 'pointer',
}

const btnSolidGreen: React.CSSProperties = {
  display: 'flex', alignItems: 'center', gap: '0.5rem',
  padding: '0.75rem 1.25rem', borderRadius: 10,
  fontFamily: 'var(--font-body)', fontSize: '0.875rem', fontWeight: 600,
  background: '#0D9488', color: 'white',
  border: 'none', cursor: 'pointer', boxShadow: '0 2px 8px rgba(13,148,136,0.3)',
}

const btnOutline: React.CSSProperties = {
  display: 'flex', alignItems: 'center', gap: '0.5rem',
  padding: '0.75rem 1.25rem', borderRadius: 10,
  fontFamily: 'var(--font-body)', fontSize: '0.875rem', fontWeight: 600,
  background: 'transparent', color: 'var(--color-text-secondary)',
  border: '1.5px solid var(--color-border)', cursor: 'pointer',
}
