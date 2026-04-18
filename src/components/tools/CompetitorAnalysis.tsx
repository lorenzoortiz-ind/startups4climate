'use client'

import { useState } from 'react'
import { Plus, Trash2 } from 'lucide-react'
import { useToolState } from '@/lib/useToolState'
import type { ToolComponentProps } from './ToolPage'
import { ToolSection, ToolProgress, ToolActionBar, inputStyle, textareaStyle, labelStyle, btnSmall } from './shared'

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
  if (s >= 4) return '#1F77F6'
  if (s >= 3) return '#2A222B'
  if (s >= 2) return '#EA580C'
  return '#DC2626'
}

const ACCENT = '#1F77F6'

export default function CompetitorAnalysis({ userId, onComplete, onGenerateReport }: ToolComponentProps) {
  const [data, setData] = useToolState<Data>(userId, 'competitor-analysis', DEFAULT)
  const [saved, setSaved] = useState(false)

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

  // Progress: count sections with data
  const filledSections = [
    data.competitors.some(c => c.name.trim()),
    data.matrix_dimensions.some(d => Object.keys(d.scores).length > 0),
    data.differentiation.trim().length > 0,
  ].filter(Boolean).length

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
      <ToolProgress filled={filledSections} total={3} accentColor={ACCENT} />

      {/* Competitors */}
      <ToolSection
        number={1}
        title="Competidores"
        subtitle="Identifica a los principales competidores y alternativas en tu mercado"
        insight="No compitas contra competidores — compite contra la alternativa actual del cliente, que muchas veces es 'no hacer nada'."
        insightSource="Peter Thiel, Zero to One"
        defaultOpen
        accentColor={ACCENT}
      >
        {data.competitors.map((c, i) => (
          <div key={i} style={{ padding: '1rem', borderRadius: 10, border: '1px solid var(--color-border)', marginBottom: '0.75rem', background: 'var(--color-bg-primary)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
              <span style={{ ...labelStyle, marginBottom: 0 }}>Competidor {i + 1}</span>
              {data.competitors.length > 1 && (
                <button onClick={() => removeCompetitor(i)} style={{ ...btnSmall, color: '#DC2626', borderColor: '#DC262630' }}><Trash2 size={12} /> Eliminar</button>
              )}
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.625rem', marginBottom: '0.625rem' }}>
              <input value={c.name} onChange={e => updateCompetitor(i, 'name', e.target.value)} placeholder="Nombre" style={inputStyle} />
              <input value={c.website} onChange={e => updateCompetitor(i, 'website', e.target.value)} placeholder="Sitio web" style={inputStyle} />
            </div>
            <textarea value={c.description} onChange={e => updateCompetitor(i, 'description', e.target.value)} placeholder="Descripción del competidor" rows={2} style={textareaStyle} />
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.625rem', marginTop: '0.5rem' }}>
              <textarea value={c.strengths} onChange={e => updateCompetitor(i, 'strengths', e.target.value)} placeholder="Fortalezas" rows={2} style={textareaStyle} />
              <textarea value={c.weaknesses} onChange={e => updateCompetitor(i, 'weaknesses', e.target.value)} placeholder="Debilidades" rows={2} style={textareaStyle} />
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.625rem', marginTop: '0.5rem' }}>
              <input value={c.pricing} onChange={e => updateCompetitor(i, 'pricing', e.target.value)} placeholder="Modelo de precios" style={inputStyle} />
              <input value={c.target_market} onChange={e => updateCompetitor(i, 'target_market', e.target.value)} placeholder="Mercado objetivo" style={inputStyle} />
            </div>
          </div>
        ))}
        <button onClick={addCompetitor} style={{ ...btnSmall, color: ACCENT, borderColor: `${ACCENT}30` }}><Plus size={12} /> Agregar competidor</button>
      </ToolSection>

      {/* Competitive Matrix */}
      <ToolSection
        number={2}
        title="Matriz competitiva"
        subtitle="Evalúa a cada competidor en dimensiones clave de 1 a 5"
        accentColor={ACCENT}
      >
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
        <button onClick={addDimension} style={{ ...btnSmall, color: ACCENT, borderColor: `${ACCENT}30`, marginTop: '0.75rem' }}><Plus size={12} /> Agregar dimensión</button>
      </ToolSection>

      {/* Differentiation */}
      <ToolSection
        number={3}
        title="Resumen de diferenciación"
        subtitle="Define tu ventaja competitiva sostenible"
        accentColor={ACCENT}
      >
        <textarea value={data.differentiation} onChange={e => setData(p => ({ ...p, differentiation: e.target.value }))} placeholder="¿Qué hace única a tu startup frente a la competencia? ¿Cuál es tu ventaja competitiva sostenible?" rows={5} style={textareaStyle} />
      </ToolSection>

      <ToolActionBar onSave={handleSave} onComplete={onComplete} onReport={handleReport} saved={saved} accentColor={ACCENT} />
    </div>
  )
}

/* ── Local table styles ── */

const thStyle: React.CSSProperties = {
  padding: '0.5rem 0.625rem', textAlign: 'left', fontWeight: 600,
  color: 'var(--color-text-secondary)', borderBottom: '2px solid var(--color-border)',
}

const tdStyle: React.CSSProperties = {
  padding: '0.375rem 0.625rem', borderBottom: '1px solid var(--color-border)',
}
