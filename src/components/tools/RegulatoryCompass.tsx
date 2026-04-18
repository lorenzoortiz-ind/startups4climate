'use client'

import { useState, useMemo } from 'react'
import { Plus, Trash2 } from 'lucide-react'
import { useToolState } from '@/lib/useToolState'
import type { ToolComponentProps } from './ToolPage'
import { ToolSection, ToolProgress, ToolActionBar, inputStyle, textareaStyle, labelStyle, btnSmall } from './shared'

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
  'en progreso': { bg: '#FEF3C7', color: '#2A222B', label: 'En progreso' },
  completado: { bg: '#CCFBF1', color: '#1F77F6', label: 'Completado' },
}

const ACCENT = '#1F77F6'

export default function RegulatoryCompass({ userId, onComplete, onGenerateReport }: ToolComponentProps) {
  const [data, setData] = useToolState<Data>(userId, 'regulatory-compass', DEFAULT)
  const [saved, setSaved] = useState(false)

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

  // Progress: count filled sections
  const filledSections = [
    data.country.trim().length > 0 || data.vertical.trim().length > 0,
    data.requirements.some(r => r.name.trim().length > 0),
  ].filter(Boolean).length

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
      <ToolProgress filled={filledSections} total={2} accentColor={ACCENT} />

      {/* Country & Vertical */}
      <ToolSection
        number={1}
        title="Contexto regulatorio"
        subtitle="Define tu país y vertical para mapear requisitos"
        insight="La regulación no es un obstáculo — es una barrera de entrada que protege a quienes la navegan primero."
        insightSource="MIT Sloan, Regulatory Strategy"
        defaultOpen
        accentColor={ACCENT}
      >
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
          <span style={{ fontFamily: 'var(--font-body)', fontSize: '1rem', fontWeight: 700, color: completionPct >= 75 ? '#1F77F6' : completionPct >= 50 ? '#2A222B' : '#DC2626' }}>{completionPct}%</span>
        </div>
        <div style={{ height: 8, borderRadius: 4, background: 'var(--color-bg-muted)', overflow: 'hidden' }}>
          <div style={{ height: '100%', width: `${completionPct}%`, borderRadius: 4, background: completionPct >= 75 ? '#1F77F6' : completionPct >= 50 ? '#2A222B' : '#DC2626', transition: 'width 0.3s' }} />
        </div>
      </ToolSection>

      {/* Requirements */}
      <ToolSection
        number={2}
        title="Requisitos regulatorios"
        subtitle="Lista todos los requisitos legales y regulatorios necesarios"
        accentColor={ACCENT}
      >
        {data.requirements.map((r, i) => {
          const sc = statusConfig[r.status]
          return (
            <div key={i} style={{ padding: '1rem', borderRadius: 10, border: '1px solid var(--color-border)', marginBottom: '0.75rem', background: 'var(--color-bg-primary)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
                <span style={{ ...labelStyle, marginBottom: 0 }}>Requisito {i + 1}</span>
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
              <textarea value={r.description} onChange={e => updateRequirement(i, 'description', e.target.value)} placeholder="Descripción detallada" rows={2} style={{ ...textareaStyle, marginBottom: '0.5rem' }} />
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
              <textarea value={r.notes} onChange={e => updateRequirement(i, 'notes', e.target.value)} placeholder="Notas adicionales" rows={2} style={textareaStyle} />
            </div>
          )
        })}
        <button onClick={addRequirement} style={{ ...btnSmall, color: ACCENT, borderColor: `${ACCENT}30` }}><Plus size={12} /> Agregar requisito</button>
      </ToolSection>

      <ToolActionBar onSave={handleSave} onComplete={onComplete} onReport={handleReport} saved={saved} accentColor={ACCENT} />
    </div>
  )
}
