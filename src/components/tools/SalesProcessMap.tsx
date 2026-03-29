'use client'

import { useState } from 'react'
import { ChevronDown, Save, CheckCircle2, FileText, Plus, Trash2 } from 'lucide-react'
import { useToolState } from '@/lib/useToolState'
import type { ToolComponentProps } from './ToolPage'

interface PipelineStage { name: string; description: string; avgDays: number | string; conversionRate: number | string }

interface Data {
  [key: string]: unknown
  stages: PipelineStage[]
  kpis: string
  scripts: string
  herramientas: string
}

const emptyStage = (): PipelineStage => ({ name: '', description: '', avgDays: '', conversionRate: '' })

const DEFAULT: Data = {
  stages: [emptyStage()],
  kpis: '',
  scripts: '',
  herramientas: '',
}

export default function SalesProcessMap({ userId, onComplete, onGenerateReport }: ToolComponentProps) {
  const [data, setData] = useToolState<Data>(userId, 'sales-process-map', DEFAULT)
  const [openSections, setOpenSections] = useState<Record<string, boolean>>({})
  const [saved, setSaved] = useState(false)
  const toggle = (k: string) => setOpenSections(p => ({ ...p, [k]: !p[k] }))
  const handleSave = () => { setSaved(true); setTimeout(() => setSaved(false), 2000) }

  const updateStage = (i: number, field: keyof PipelineStage, value: string) => {
    setData(p => { const s = [...p.stages]; s[i] = { ...s[i], [field]: value }; return { ...p, stages: s } })
  }
  const addStage = () => setData(p => ({ ...p, stages: [...p.stages, emptyStage()] }))
  const removeStage = (i: number) => setData(p => ({ ...p, stages: p.stages.filter((_, idx) => idx !== i) }))

  const handleReport = () => {
    const content = `
MAPA DEL PROCESO DE VENTAS

ETAPAS DEL PIPELINE:
${data.stages.map((s, i) => `${i + 1}. ${s.name || '(Sin nombre)'}
   Descripción: ${s.description || '-'}
   Días promedio: ${s.avgDays || '-'}
   Tasa de conversión: ${s.conversionRate || '-'}%`).join('\n')}

KPIs DE VENTAS:
${data.kpis || '(No completado)'}

SCRIPTS/TEMPLATES POR ETAPA:
${data.scripts || '(No completado)'}

HERRAMIENTAS DE VENTAS UTILIZADAS:
${data.herramientas || '(No completado)'}
    `.trim()
    onGenerateReport(content)
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
      {/* Pipeline stages - has numbers, always visible */}
      <div style={cardStyle}>
        <div style={{ padding: '1rem 1.25rem' }}><span style={headingStyle}>Etapas del pipeline</span></div>
        <div style={{ padding: '0 1.25rem 1.25rem' }}>
          {data.stages.map((s, i) => (
            <div key={i} style={{ padding: '1rem', borderRadius: 10, border: '1px solid var(--color-border)', marginBottom: '0.75rem', background: 'var(--color-bg-primary)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.625rem' }}>
                <span style={{ fontFamily: 'var(--font-heading)', fontSize: '0.8125rem', fontWeight: 700, color: 'var(--color-text-secondary)' }}>Etapa {i + 1}</span>
                {data.stages.length > 1 && <button onClick={() => removeStage(i)} style={btnDanger}><Trash2 size={12} /></button>}
              </div>
              <input value={s.name} onChange={e => updateStage(i, 'name', e.target.value)} placeholder="Nombre de la etapa" style={{ ...inputStyle, marginBottom: '0.5rem' }} />
              <div style={{ display: 'grid', gridTemplateColumns: '1fr auto auto', gap: '0.5rem', marginBottom: '0.5rem' }}>
                <input value={s.description} onChange={e => updateStage(i, 'description', e.target.value)} placeholder="Descripción" style={inputStyle} />
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                  <input type="number" value={s.avgDays} onChange={e => updateStage(i, 'avgDays', e.target.value)} placeholder="0" style={{ ...inputStyle, width: 60, textAlign: 'center' }} />
                  <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.6875rem', color: 'var(--color-text-muted)' }}>días</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                  <input type="number" value={s.conversionRate} onChange={e => updateStage(i, 'conversionRate', e.target.value)} placeholder="0" style={{ ...inputStyle, width: 60, textAlign: 'center' }} />
                  <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.6875rem', color: 'var(--color-text-muted)' }}>%</span>
                </div>
              </div>
            </div>
          ))}
          <button onClick={addStage} style={btnAdd}><Plus size={14} /> Agregar etapa</button>
        </div>
      </div>

      {[
        { key: 'kpis', title: 'KPIs de ventas', ph: '¿Qué métricas mides en ventas? Deal size, ciclo de venta, win rate...' },
        { key: 'scripts', title: 'Scripts/templates por etapa', ph: 'Describe los scripts de venta, emails o presentaciones que usas en cada etapa' },
        { key: 'herramientas', title: 'Herramientas de ventas utilizadas', ph: 'CRM, herramientas de email, video calls, propuestas... ¿Qué stack usas?' },
      ].map(s => (
        <Collapsible key={s.key} title={s.title} k={s.key} open={openSections} toggle={toggle}>
          <textarea value={(data as Record<string, string>)[s.key]} onChange={e => setData(p => ({ ...p, [s.key]: e.target.value }))} placeholder={s.ph} rows={4} style={taStyle} />
        </Collapsible>
      ))}

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
const inputStyle: React.CSSProperties = { width: '100%', padding: '0.625rem 0.875rem', borderRadius: 8, border: '1px solid var(--color-border)', background: 'var(--color-bg-card)', fontFamily: 'var(--font-body)', fontSize: '0.875rem', color: 'var(--color-text-primary)', outline: 'none' }
const taStyle: React.CSSProperties = { ...inputStyle, resize: 'vertical' as const, lineHeight: 1.6 }
const btnDanger: React.CSSProperties = { display: 'flex', alignItems: 'center', padding: '0.25rem 0.5rem', borderRadius: 6, background: 'transparent', color: '#DC2626', border: '1px solid #DC262630', cursor: 'pointer' }
const btnAdd: React.CSSProperties = { display: 'flex', alignItems: 'center', gap: '0.375rem', padding: '0.5rem 1rem', borderRadius: 8, fontSize: '0.8125rem', fontFamily: 'var(--font-body)', fontWeight: 600, background: 'transparent', color: '#0D9488', border: '1px solid #0D948830', cursor: 'pointer' }
const btnOG: React.CSSProperties = { display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.75rem 1.25rem', borderRadius: 10, fontFamily: 'var(--font-body)', fontSize: '0.875rem', fontWeight: 600, background: 'transparent', color: '#0D9488', border: '1.5px solid #0D948840', cursor: 'pointer' }
const btnSG: React.CSSProperties = { display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.75rem 1.25rem', borderRadius: 10, fontFamily: 'var(--font-body)', fontSize: '0.875rem', fontWeight: 600, background: '#0D9488', color: 'white', border: 'none', cursor: 'pointer', boxShadow: '0 2px 8px rgba(13,148,136,0.3)' }
const btnO: React.CSSProperties = { display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.75rem 1.25rem', borderRadius: 10, fontFamily: 'var(--font-body)', fontSize: '0.875rem', fontWeight: 600, background: 'transparent', color: 'var(--color-text-secondary)', border: '1.5px solid var(--color-border)', cursor: 'pointer' }
