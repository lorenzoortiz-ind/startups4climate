'use client'

import { useState, useMemo } from 'react'
import { useToolState } from '@/lib/useToolState'
import type { ToolComponentProps } from './ToolPage'
import { ToolSection, ToolProgress, ToolActionBar, inputStyle, btnSmall } from './shared'

interface Document {
  [key: string]: unknown
  name: string
  status: 'pendiente' | 'borrador' | 'listo'
  notes: string
  file_url: string
}

interface Category {
  [key: string]: unknown
  name: string
  documents: Document[]
}

interface Data {
  [key: string]: unknown
  categories: Category[]
}

const INITIAL_CATEGORIES: Category[] = [
  {
    name: 'Legal',
    documents: [
      { name: 'Acta constitutiva', status: 'pendiente', notes: '', file_url: '' },
      { name: 'Poderes legales', status: 'pendiente', notes: '', file_url: '' },
      { name: 'Contratos con cofundadores', status: 'pendiente', notes: '', file_url: '' },
      { name: 'Propiedad intelectual / Patentes', status: 'pendiente', notes: '', file_url: '' },
      { name: 'Términos y condiciones', status: 'pendiente', notes: '', file_url: '' },
    ],
  },
  {
    name: 'Financiero',
    documents: [
      { name: 'Estados financieros', status: 'pendiente', notes: '', file_url: '' },
      { name: 'Cap table actual', status: 'pendiente', notes: '', file_url: '' },
      { name: 'Proyecciones financieras', status: 'pendiente', notes: '', file_url: '' },
      { name: 'Historial de rondas previas', status: 'pendiente', notes: '', file_url: '' },
      { name: 'Declaraciones fiscales', status: 'pendiente', notes: '', file_url: '' },
    ],
  },
  {
    name: 'Producto',
    documents: [
      { name: 'Demo / Prototipo', status: 'pendiente', notes: '', file_url: '' },
      { name: 'Roadmap de producto', status: 'pendiente', notes: '', file_url: '' },
      { name: 'Arquitectura técnica', status: 'pendiente', notes: '', file_url: '' },
      { name: 'Métricas de producto', status: 'pendiente', notes: '', file_url: '' },
    ],
  },
  {
    name: 'Equipo',
    documents: [
      { name: 'CVs de fundadores', status: 'pendiente', notes: '', file_url: '' },
      { name: 'Organigrama', status: 'pendiente', notes: '', file_url: '' },
      { name: 'Plan de contratación', status: 'pendiente', notes: '', file_url: '' },
      { name: 'Acuerdos de vesting', status: 'pendiente', notes: '', file_url: '' },
    ],
  },
  {
    name: 'Mercado',
    documents: [
      { name: 'Análisis de mercado (TAM/SAM/SOM)', status: 'pendiente', notes: '', file_url: '' },
      { name: 'Análisis competitivo', status: 'pendiente', notes: '', file_url: '' },
      { name: 'Testimonios / Casos de estudio', status: 'pendiente', notes: '', file_url: '' },
      { name: 'Pipeline de clientes', status: 'pendiente', notes: '', file_url: '' },
    ],
  },
]

const DEFAULT: Data = {
  categories: INITIAL_CATEGORIES,
}

const statusColors: Record<string, { bg: string; color: string; label: string }> = {
  pendiente: { bg: '#FEE2E2', color: '#DC2626', label: 'Pendiente' },
  borrador: { bg: '#FEF3C7', color: '#2A222B', label: 'Borrador' },
  listo: { bg: '#CCFBF1', color: '#0D9488', label: 'Listo' },
}

const ACCENT = '#0D9488'

export default function DataRoomBuilder({ userId, onComplete, onGenerateReport }: ToolComponentProps) {
  const [data, setData] = useToolState<Data>(userId, 'data-room-builder', DEFAULT)
  const [saved, setSaved] = useState(false)

  const updateDocument = (catIdx: number, docIdx: number, field: keyof Document, value: string) => {
    setData(p => {
      const categories = [...p.categories]
      const docs = [...categories[catIdx].documents]
      docs[docIdx] = { ...docs[docIdx], [field]: value }
      categories[catIdx] = { ...categories[catIdx], documents: docs }
      return { ...p, categories }
    })
  }

  const addDocument = (catIdx: number) => {
    setData(p => {
      const categories = [...p.categories]
      categories[catIdx] = {
        ...categories[catIdx],
        documents: [...categories[catIdx].documents, { name: '', status: 'pendiente', notes: '', file_url: '' }],
      }
      return { ...p, categories }
    })
  }

  const removeDocument = (catIdx: number, docIdx: number) => {
    setData(p => {
      const categories = [...p.categories]
      categories[catIdx] = {
        ...categories[catIdx],
        documents: categories[catIdx].documents.filter((_, i) => i !== docIdx),
      }
      return { ...p, categories }
    })
  }

  const categoryReadiness = (cat: Category) => {
    if (cat.documents.length === 0) return 0
    const listo = cat.documents.filter(d => d.status === 'listo').length
    return Math.round((listo / cat.documents.length) * 100)
  }

  const overallReadiness = useMemo(() => {
    const allDocs = data.categories.flatMap(c => c.documents)
    if (allDocs.length === 0) return 0
    const listo = allDocs.filter(d => d.status === 'listo').length
    return Math.round((listo / allDocs.length) * 100)
  }, [data.categories])

  // Progress: count categories that have at least one 'listo' doc
  const filledSections = data.categories.filter(cat => cat.documents.some(d => d.status === 'listo')).length

  const handleSave = () => { setSaved(true); setTimeout(() => setSaved(false), 2000) }

  const handleReport = () => {
    const content = `
DATA ROOM — ESTADO DE PREPARACIÓN

SCORE GENERAL: ${overallReadiness}%

${data.categories.map(cat => `${cat.name.toUpperCase()} (${categoryReadiness(cat)}% listo):
${cat.documents.map(d => `  [${statusColors[d.status].label}] ${d.name || '(Sin nombre)'}${d.notes ? ' — ' + d.notes : ''}${d.file_url ? ' — Link: ' + d.file_url : ''}`).join('\n')}`).join('\n\n')}
    `.trim()
    onGenerateReport(content)
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
      <ToolProgress filled={filledSections} total={data.categories.length} accentColor={ACCENT} />

      {/* Overall readiness */}
      <div style={{ background: 'var(--color-bg-card)', borderRadius: 16, border: '1px solid var(--color-border)', padding: '1.25rem', boxShadow: '0 1px 3px rgba(0,0,0,0.03)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
          <span style={{ fontFamily: 'var(--font-heading)', fontSize: '0.9375rem', fontWeight: 700, color: 'var(--color-text-primary)' }}>Preparación general del Data Room</span>
          <span style={{ fontFamily: 'var(--font-body)', fontSize: '1.25rem', fontWeight: 700, color: overallReadiness >= 75 ? '#0D9488' : overallReadiness >= 50 ? '#2A222B' : '#DC2626' }}>{overallReadiness}%</span>
        </div>
        <div style={{ height: 10, borderRadius: 5, background: 'var(--color-bg-muted)', overflow: 'hidden' }}>
          <div style={{ height: '100%', width: `${overallReadiness}%`, borderRadius: 5, background: overallReadiness >= 75 ? '#0D9488' : overallReadiness >= 50 ? '#2A222B' : '#DC2626', transition: 'width 0.3s' }} />
        </div>
      </div>

      {/* Categories */}
      {data.categories.map((cat, catIdx) => {
        const readiness = categoryReadiness(cat)
        return (
          <ToolSection
            key={catIdx}
            number={catIdx + 1}
            title={cat.name}
            subtitle={`${readiness}% listo`}
            insight={catIdx === 0 ? 'Un data room bien organizado demuestra madurez operativa. Los inversores evalúan tu disciplina tanto como tu producto.' : undefined}
            insightSource={catIdx === 0 ? 'Y Combinator, Series A Guide' : undefined}
            accentColor={ACCENT}
          >
            {/* Progress bar per category */}
            <div style={{ height: 6, borderRadius: 3, background: 'var(--color-bg-muted)', overflow: 'hidden', marginBottom: '1rem' }}>
              <div style={{ height: '100%', width: `${readiness}%`, borderRadius: 3, background: readiness >= 75 ? '#0D9488' : readiness >= 50 ? '#2A222B' : '#DC2626', transition: 'width 0.3s' }} />
            </div>

            {cat.documents.map((doc, docIdx) => {
              const sc = statusColors[doc.status]
              return (
                <div key={docIdx} style={{ padding: '0.75rem', borderRadius: 10, border: '1px solid var(--color-border)', marginBottom: '0.5rem', background: 'var(--color-bg-primary)' }}>
                  <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center', marginBottom: '0.5rem', flexWrap: 'wrap' }}>
                    <input value={doc.name} onChange={e => updateDocument(catIdx, docIdx, 'name', e.target.value)} placeholder="Nombre del documento" style={{ ...inputStyle, flex: 1, minWidth: 160 }} />
                    <select value={doc.status} onChange={e => updateDocument(catIdx, docIdx, 'status', e.target.value)} style={{ ...inputStyle, width: 'auto', padding: '0.5rem 0.75rem', background: sc.bg, color: sc.color, fontWeight: 600, fontSize: '0.75rem' }}>
                      <option value="pendiente">Pendiente</option>
                      <option value="borrador">Borrador</option>
                      <option value="listo">Listo</option>
                    </select>
                    {cat.documents.length > 1 && (
                      <button onClick={() => removeDocument(catIdx, docIdx)} style={{ ...btnSmall, color: '#DC2626', borderColor: '#DC262630', padding: '0.3rem 0.5rem' }}>✕</button>
                    )}
                  </div>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem' }}>
                    <input value={doc.notes} onChange={e => updateDocument(catIdx, docIdx, 'notes', e.target.value)} placeholder="Notas" style={{ ...inputStyle, fontSize: '0.8125rem' }} />
                    <input value={doc.file_url} onChange={e => updateDocument(catIdx, docIdx, 'file_url', e.target.value)} placeholder="URL del archivo" style={{ ...inputStyle, fontSize: '0.8125rem' }} />
                  </div>
                </div>
              )
            })}
            <button onClick={() => addDocument(catIdx)} style={{ ...btnSmall, color: ACCENT, borderColor: `${ACCENT}30`, marginTop: '0.25rem' }}>+ Agregar documento</button>
          </ToolSection>
        )
      })}

      <ToolActionBar onSave={handleSave} onComplete={onComplete} onReport={handleReport} saved={saved} accentColor={ACCENT} />
    </div>
  )
}
