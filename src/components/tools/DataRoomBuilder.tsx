'use client'

import { useState, useMemo } from 'react'
import { ChevronDown, Save, CheckCircle2, FileText } from 'lucide-react'
import { useToolState } from '@/lib/useToolState'
import type { ToolComponentProps } from './ToolPage'

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
  borrador: { bg: '#FEF3C7', color: '#D97706', label: 'Borrador' },
  listo: { bg: '#D1FAE5', color: '#059669', label: 'Listo' },
}

export default function DataRoomBuilder({ userId, onComplete, onGenerateReport }: ToolComponentProps) {
  const [data, setData] = useToolState<Data>(userId, 'data-room-builder', DEFAULT)
  const [openSections, setOpenSections] = useState<Record<string, boolean>>({})
  const [saved, setSaved] = useState(false)

  const toggle = (k: string) => setOpenSections(p => ({ ...p, [k]: !p[k] }))

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
      {/* Overall readiness */}
      <div style={{ background: 'var(--color-bg-card)', borderRadius: 14, border: '1px solid var(--color-border)', padding: '1.25rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
          <span style={{ fontFamily: 'var(--font-heading)', fontSize: '0.9375rem', fontWeight: 700, color: 'var(--color-text-primary)' }}>Preparación general del Data Room</span>
          <span style={{ fontFamily: 'var(--font-mono)', fontSize: '1.25rem', fontWeight: 700, color: overallReadiness >= 75 ? '#059669' : overallReadiness >= 50 ? '#D97706' : '#DC2626' }}>{overallReadiness}%</span>
        </div>
        <div style={{ height: 10, borderRadius: 5, background: 'var(--color-bg-muted)', overflow: 'hidden' }}>
          <div style={{ height: '100%', width: `${overallReadiness}%`, borderRadius: 5, background: overallReadiness >= 75 ? '#059669' : overallReadiness >= 50 ? '#D97706' : '#DC2626', transition: 'width 0.3s' }} />
        </div>
      </div>

      {/* Categories */}
      {data.categories.map((cat, catIdx) => {
        const readiness = categoryReadiness(cat)
        return (
          <SectionCollapsible key={catIdx} title={cat.name} sectionKey={`cat-${catIdx}`} open={openSections} toggle={toggle}
            right={<span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.75rem', fontWeight: 600, color: readiness >= 75 ? '#059669' : readiness >= 50 ? '#D97706' : '#DC2626' }}>{readiness}%</span>}
          >
            {/* Progress bar per category */}
            <div style={{ height: 6, borderRadius: 3, background: 'var(--color-bg-muted)', overflow: 'hidden', marginBottom: '1rem' }}>
              <div style={{ height: '100%', width: `${readiness}%`, borderRadius: 3, background: readiness >= 75 ? '#059669' : readiness >= 50 ? '#D97706' : '#DC2626', transition: 'width 0.3s' }} />
            </div>

            {cat.documents.map((doc, docIdx) => {
              const sc = statusColors[doc.status]
              return (
                <div key={docIdx} style={{ padding: '0.75rem', borderRadius: 8, border: '1px solid var(--color-border)', marginBottom: '0.5rem', background: 'var(--color-bg-primary)' }}>
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
            <button onClick={() => addDocument(catIdx)} style={{ ...btnSmall, color: '#059669', borderColor: '#05966930', marginTop: '0.25rem' }}>+ Agregar documento</button>
          </SectionCollapsible>
        )
      })}

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

function SectionCollapsible({ title, sectionKey, open, toggle, children, right }: {
  title: string; sectionKey: string; open: Record<string, boolean>; toggle: (k: string) => void; children: React.ReactNode; right?: React.ReactNode
}) {
  return (
    <div style={{ background: 'var(--color-bg-card)', borderRadius: 14, border: '1px solid var(--color-border)', overflow: 'hidden' }}>
      <button onClick={() => toggle(sectionKey)} style={sectionBtn}>
        <span style={{ fontFamily: 'var(--font-heading)', fontSize: '0.9375rem', fontWeight: 700, color: 'var(--color-text-primary)' }}>{title}</span>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          {right}
          <ChevronDown size={18} color="var(--color-text-muted)" style={{ transition: 'transform 0.2s', transform: open[sectionKey] ? 'rotate(180deg)' : 'rotate(0)' }} />
        </div>
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

const btnSmall: React.CSSProperties = {
  display: 'inline-flex', alignItems: 'center', gap: '0.3rem',
  padding: '0.35rem 0.75rem', borderRadius: 6, fontSize: '0.75rem',
  fontFamily: 'var(--font-body)', fontWeight: 600, background: 'transparent',
  border: '1px solid var(--color-border)', cursor: 'pointer',
}

const btnOutlineGreen: React.CSSProperties = {
  display: 'flex', alignItems: 'center', gap: '0.5rem',
  padding: '0.75rem 1.25rem', borderRadius: 10,
  fontFamily: 'var(--font-body)', fontSize: '0.875rem', fontWeight: 600,
  background: 'transparent', color: '#059669',
  border: '1.5px solid #05966940', cursor: 'pointer',
}

const btnSolidGreen: React.CSSProperties = {
  display: 'flex', alignItems: 'center', gap: '0.5rem',
  padding: '0.75rem 1.25rem', borderRadius: 10,
  fontFamily: 'var(--font-body)', fontSize: '0.875rem', fontWeight: 600,
  background: '#059669', color: 'white',
  border: 'none', cursor: 'pointer', boxShadow: '0 2px 8px rgba(5,150,105,0.3)',
}

const btnOutline: React.CSSProperties = {
  display: 'flex', alignItems: 'center', gap: '0.5rem',
  padding: '0.75rem 1.25rem', borderRadius: 10,
  fontFamily: 'var(--font-body)', fontSize: '0.875rem', fontWeight: 600,
  background: 'transparent', color: 'var(--color-text-secondary)',
  border: '1.5px solid var(--color-border)', cursor: 'pointer',
}
