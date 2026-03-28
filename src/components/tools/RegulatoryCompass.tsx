'use client'

import { useState, useMemo } from 'react'
import { ChevronDown, Save, CheckCircle2, FileText, Plus, Trash2 } from 'lucide-react'
import { useToolState } from '@/lib/useToolState'
import type { ToolComponentProps } from './ToolPage'

interface Requirement {
  [key: string]: unknown
  category: 'license' | 'certification' | 'registration' | 'tax' | 'data_privacy'
  name: string
  description: string
  entity: string
  estimated_time: string
  estimated_cost: string
  status: 'desconocido' | 'no iniciado' | 'en progreso' | 'completado'
  notes: string
}

interface Data {
  [key: string]: unknown
  country: string
  vertical: string
  requirements: Requirement[]
}

const emptyRequirement = (): Requirement => ({
  category: 'registration', name: '', description: '', entity: '', estimated_time: '', estimated_cost: '', status: 'desconocido', notes: '',
})

const DEFAULT: Data = {
  country: '',
  vertical: '',
  requirements: [emptyRequirement()],
}

const categoryLabels: Record<string, string> = {
  license: 'Licencia',
  certification: 'Certificación',
  registration: 'Registro',
  tax: 'Fiscal',
  data_privacy: 'Privacidad de datos',
}

const statusConfig: Record<string, { bg: string; color: string; label: string }> = {
  desconocido: { bg: '#F3F4F6', color: '#6B7280', label: 'Desconocido' },
  'no iniciado': { bg: '#FEE2E2', color: '#DC2626', label: 'No iniciado' },
  'en progreso': { bg: '#FEF3C7', color: '#D97706', label: 'En progreso' },
  completado: { bg: '#D1FAE5', color: '#059669', label: 'Completado' },
}

export default function RegulatoryCompass({ userId, onComplete, onGenerateReport }: ToolComponentProps) {
  const [data, setData] = useToolState<Data>(userId, 'regulatory-compass', DEFAULT)
  const [openSections, setOpenSections] = useState<Record<string, boolean>>({})
  const [saved, setSaved] = useState(false)

  const toggle = (k: string) => setOpenSections(p => ({ ...p, [k]: !p[k] }))

  const updateRequirement = (i: number, field: keyof Requirement, value: string) => {
    setData(p => {
      const requirements = [...p.requirements]
      requirements[i] = { ...requirements[i], [field]: value }
      return { ...p, requirements }
    })
  }

  const addRequirement = () => setData(p => ({ ...p, requirements: [...p.requirements, emptyRequirement()] }))
  const removeRequirement = (i: number) => setData(p => ({ ...p, requirements: p.requirements.filter((_, idx) => idx !== i) }))

  const completionPct = useMemo(() => {
    if (data.requirements.length === 0) return 0
    const done = data.requirements.filter(r => r.status === 'completado').length
    return Math.round((done / data.requirements.length) * 100)
  }, [data.requirements])

  const handleSave = () => { setSaved(true); setTimeout(() => setSaved(false), 2000) }

  const handleReport = () => {
    const content = `
BRÚJULA REGULATORIA

PAÍS: ${data.country || '(No definido)'}
VERTICAL: ${data.vertical || '(No definido)'}
PROGRESO: ${completionPct}% completado

REQUISITOS:
${data.requirements.map((r, i) => `${i + 1}. [${categoryLabels[r.category]}] ${r.name || '(Sin nombre)'}
   Estado: ${statusConfig[r.status].label}
   Entidad: ${r.entity || '(No definido)'}
   Descripción: ${r.description || '(No completado)'}
   Tiempo estimado: ${r.estimated_time || '(No definido)'}
   Costo estimado: ${r.estimated_cost || '(No definido)'}
   Notas: ${r.notes || '(Sin notas)'}`).join('\n\n')}
    `.trim()
    onGenerateReport(content)
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
      {/* Country & Vertical */}
      <div style={{ background: 'var(--color-bg-card)', borderRadius: 14, border: '1px solid var(--color-border)', padding: '1.25rem' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem', marginBottom: '1rem' }}>
          <div>
            <label style={labelStyle}>País</label>
            <input value={data.country} onChange={e => setData(p => ({ ...p, country: e.target.value }))} placeholder="Ej: México, Colombia, Chile" style={inputStyle} />
          </div>
          <div>
            <label style={labelStyle}>Vertical / Industria</label>
            <input value={data.vertical} onChange={e => setData(p => ({ ...p, vertical: e.target.value }))} placeholder="Ej: Fintech, Healthtech, Agritech" style={inputStyle} />
          </div>
        </div>
        {/* Progress */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
          <span style={{ fontFamily: 'var(--font-heading)', fontSize: '0.8125rem', fontWeight: 600, color: 'var(--color-text-secondary)' }}>Progreso regulatorio</span>
          <span style={{ fontFamily: 'var(--font-mono)', fontSize: '1rem', fontWeight: 700, color: completionPct >= 75 ? '#059669' : completionPct >= 50 ? '#D97706' : '#DC2626' }}>{completionPct}%</span>
        </div>
        <div style={{ height: 8, borderRadius: 4, background: 'var(--color-bg-muted)', overflow: 'hidden' }}>
          <div style={{ height: '100%', width: `${completionPct}%`, borderRadius: 4, background: completionPct >= 75 ? '#059669' : completionPct >= 50 ? '#D97706' : '#DC2626', transition: 'width 0.3s' }} />
        </div>
      </div>

      {/* Requirements */}
      <SectionCollapsible title="Requisitos regulatorios" sectionKey="requirements" open={openSections} toggle={toggle}>
        {data.requirements.map((r, i) => {
          const sc = statusConfig[r.status]
          return (
            <div key={i} style={{ padding: '1rem', borderRadius: 10, border: '1px solid var(--color-border)', marginBottom: '0.75rem', background: 'var(--color-bg-primary)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
                <span style={{ fontFamily: 'var(--font-heading)', fontSize: '0.8125rem', fontWeight: 700, color: 'var(--color-text-secondary)' }}>Requisito {i + 1}</span>
                {data.requirements.length > 1 && (
                  <button onClick={() => removeRequirement(i)} style={{ ...btnSmall, color: '#DC2626', borderColor: '#DC262630' }}><Trash2 size={12} /> Eliminar</button>
                )}
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.625rem', marginBottom: '0.625rem' }}>
                <div>
                  <label style={{ ...labelStyle, fontSize: '0.6875rem' }}>Categoría</label>
                  <select value={r.category} onChange={e => updateRequirement(i, 'category', e.target.value)} style={inputStyle}>
                    {Object.entries(categoryLabels).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
                  </select>
                </div>
                <div>
                  <label style={{ ...labelStyle, fontSize: '0.6875rem' }}>Estado</label>
                  <select value={r.status} onChange={e => updateRequirement(i, 'status', e.target.value)} style={{ ...inputStyle, background: sc.bg, color: sc.color, fontWeight: 600 }}>
                    {Object.entries(statusConfig).map(([k, v]) => <option key={k} value={k}>{v.label}</option>)}
                  </select>
                </div>
              </div>
              <input value={r.name} onChange={e => updateRequirement(i, 'name', e.target.value)} placeholder="Nombre del requisito" style={{ ...inputStyle, marginBottom: '0.5rem' }} />
              <textarea value={r.description} onChange={e => updateRequirement(i, 'description', e.target.value)} placeholder="Descripción detallada" rows={2} style={{ ...taStyle, marginBottom: '0.5rem' }} />
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '0.5rem', marginBottom: '0.5rem' }}>
                <div>
                  <label style={{ ...labelStyle, fontSize: '0.6875rem' }}>Entidad responsable</label>
                  <input value={r.entity} onChange={e => updateRequirement(i, 'entity', e.target.value)} placeholder="Ej: SAT, CNBV" style={inputStyle} />
                </div>
                <div>
                  <label style={{ ...labelStyle, fontSize: '0.6875rem' }}>Tiempo estimado</label>
                  <input value={r.estimated_time} onChange={e => updateRequirement(i, 'estimated_time', e.target.value)} placeholder="Ej: 2-4 semanas" style={inputStyle} />
                </div>
                <div>
                  <label style={{ ...labelStyle, fontSize: '0.6875rem' }}>Costo estimado</label>
                  <input value={r.estimated_cost} onChange={e => updateRequirement(i, 'estimated_cost', e.target.value)} placeholder="Ej: $5,000 MXN" style={inputStyle} />
                </div>
              </div>
              <textarea value={r.notes} onChange={e => updateRequirement(i, 'notes', e.target.value)} placeholder="Notas adicionales" rows={2} style={taStyle} />
            </div>
          )
        })}
        <button onClick={addRequirement} style={{ ...btnSmall, color: '#059669', borderColor: '#05966930' }}><Plus size={12} /> Agregar requisito</button>
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

const labelStyle: React.CSSProperties = {
  fontFamily: 'var(--font-heading)', fontSize: '0.75rem', fontWeight: 600,
  color: 'var(--color-text-secondary)', display: 'block', marginBottom: '0.25rem',
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
