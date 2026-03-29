'use client'

import { useState } from 'react'
import { ChevronDown, Save, CheckCircle2, FileText, Plus, Trash2 } from 'lucide-react'
import { useToolState } from '@/lib/useToolState'
import type { ToolComponentProps } from './ToolPage'

interface Stakeholder {
  rol: string
  nombre: string
  influencia: number
  estrategia: string
  objeciones: string
}

interface Data {
  stakeholders: Stakeholder[]
}

const ROLES = ['Champion', 'Comprador económico', 'Usuario final', 'Influenciador técnico', 'Bloqueador potencial']

const emptyStakeholder = (): Stakeholder => ({ rol: 'Champion', nombre: '', influencia: 3, estrategia: '', objeciones: '' })

const DEFAULT: Data = { stakeholders: [emptyStakeholder()] }

export default function DecisionMakingUnit({ userId, onComplete, onGenerateReport }: ToolComponentProps) {
  const [data, setData] = useToolState<Data>(userId, 'decision-making-unit', DEFAULT)
  const [openSections, setOpenSections] = useState<Record<string, boolean>>({})
  const [saved, setSaved] = useState(false)
  const toggle = (k: string) => setOpenSections(p => ({ ...p, [k]: !p[k] }))
  const handleSave = () => { setSaved(true); setTimeout(() => setSaved(false), 2000) }

  const updateStakeholder = (i: number, field: keyof Stakeholder, value: string | number) => {
    setData(p => { const s = [...p.stakeholders]; s[i] = { ...s[i], [field]: value }; return { ...p, stakeholders: s } })
  }
  const addStakeholder = () => setData(p => ({ ...p, stakeholders: [...p.stakeholders, emptyStakeholder()] }))
  const removeStakeholder = (i: number) => setData(p => ({ ...p, stakeholders: p.stakeholders.filter((_, idx) => idx !== i) }))

  const rolColor = (r: string) => {
    switch (r) {
      case 'Champion': return '#0D9488'
      case 'Comprador económico': return '#2A222B'
      case 'Usuario final': return '#0D9488'
      case 'Influenciador técnico': return '#FF6B4A'
      case 'Bloqueador potencial': return '#DC2626'
      default: return '#9CA3AF'
    }
  }

  const handleReport = () => {
    const content = `
UNIDAD DE TOMA DE DECISIONES

${data.stakeholders.map((s, i) => `STAKEHOLDER ${i + 1}:
  Rol: ${s.rol}
  Nombre/Cargo: ${s.nombre || '(No completado)'}
  Nivel de influencia: ${s.influencia}/5
  Estrategia de abordaje: ${s.estrategia || '(No completado)'}
  Objeciones anticipadas: ${s.objeciones || '(No completado)'}`).join('\n\n')}
    `.trim()
    onGenerateReport(content)
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
      <div style={cardStyle}>
        <div style={{ padding: '1rem 1.25rem' }}><span style={headingStyle}>Stakeholders en la decisión de compra</span></div>
        <div style={{ padding: '0 1.25rem 1.25rem' }}>
          {data.stakeholders.map((s, i) => (
            <div key={i} style={{ padding: '1rem', borderRadius: 10, border: `1px solid ${rolColor(s.rol)}25`, borderLeft: `3px solid ${rolColor(s.rol)}`, marginBottom: '0.75rem', background: 'var(--color-bg-primary)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
                <span style={{ fontFamily: 'var(--font-heading)', fontSize: '0.8125rem', fontWeight: 700, color: rolColor(s.rol) }}>Stakeholder {i + 1}</span>
                {data.stakeholders.length > 1 && <button onClick={() => removeStakeholder(i)} style={btnDanger}><Trash2 size={12} /></button>}
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: 'auto 1fr', gap: '0.625rem', marginBottom: '0.625rem' }}>
                <select value={s.rol} onChange={e => updateStakeholder(i, 'rol', e.target.value)} style={{ ...inputStyle, width: 'auto', color: rolColor(s.rol), fontWeight: 600 }}>
                  {ROLES.map(r => <option key={r} value={r}>{r}</option>)}
                </select>
                <input value={s.nombre} onChange={e => updateStakeholder(i, 'nombre', e.target.value)} placeholder="Nombre / Cargo" style={inputStyle} />
              </div>
              <div style={{ marginBottom: '0.625rem' }}>
                <label style={labelStyle}>Nivel de influencia: {s.influencia}/5</label>
                <input type="range" min={1} max={5} step={1} value={s.influencia} onChange={e => updateStakeholder(i, 'influencia', parseInt(e.target.value))} style={{ width: '100%' }} />
                <div style={{ display: 'flex', justifyContent: 'space-between', fontFamily: 'var(--font-body)', fontSize: '0.5625rem', color: 'var(--color-text-muted)', marginTop: '0.125rem' }}>
                  <span>1 = Muy bajo</span><span>3 = Medio</span><span>5 = Muy alto</span>
                </div>
              </div>
              {/* Collapsible text sections within each stakeholder */}
              <button onClick={() => toggle(`estrategia-${i}`)} style={{ ...sectionBtnSmall, marginBottom: openSections[`estrategia-${i}`] ? '0.5rem' : 0 }}>
                <span style={{ fontSize: '0.8125rem', fontWeight: 600, color: 'var(--color-text-secondary)' }}>Estrategia de abordaje</span>
                <ChevronDown size={14} color="var(--color-text-muted)" style={{ transform: openSections[`estrategia-${i}`] ? 'rotate(180deg)' : 'rotate(0)', transition: 'transform 0.2s' }} />
              </button>
              {openSections[`estrategia-${i}`] && <textarea value={s.estrategia} onChange={e => updateStakeholder(i, 'estrategia', e.target.value)} placeholder="¿Cómo vas a convencer a esta persona?" rows={3} style={{ ...taStyle, marginBottom: '0.5rem' }} />}

              <button onClick={() => toggle(`objeciones-${i}`)} style={{ ...sectionBtnSmall, marginBottom: openSections[`objeciones-${i}`] ? '0.5rem' : 0 }}>
                <span style={{ fontSize: '0.8125rem', fontWeight: 600, color: 'var(--color-text-secondary)' }}>Objeciones anticipadas</span>
                <ChevronDown size={14} color="var(--color-text-muted)" style={{ transform: openSections[`objeciones-${i}`] ? 'rotate(180deg)' : 'rotate(0)', transition: 'transform 0.2s' }} />
              </button>
              {openSections[`objeciones-${i}`] && <textarea value={s.objeciones} onChange={e => updateStakeholder(i, 'objeciones', e.target.value)} placeholder="¿Qué objeciones podría tener?" rows={3} style={taStyle} />}
            </div>
          ))}
          <button onClick={addStakeholder} style={btnAdd}><Plus size={14} /> Agregar stakeholder</button>
        </div>
      </div>

      <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap', marginTop: '0.5rem' }}>
        <button onClick={handleSave} style={btnOG}><Save size={15} /> {saved ? '¡Guardado!' : 'Guardar progreso'}</button>
        <button onClick={onComplete} style={btnSG}><CheckCircle2 size={15} /> Marcar como completada</button>
        <button onClick={handleReport} style={btnO}><FileText size={15} /> Generar reporte</button>
      </div>
    </div>
  )
}

const cardStyle: React.CSSProperties = { background: 'var(--color-bg-card)', borderRadius: 14, border: '1px solid var(--color-border)', overflow: 'hidden' }
const headingStyle: React.CSSProperties = { fontFamily: 'var(--font-heading)', fontSize: '0.9375rem', fontWeight: 700, color: 'var(--color-text-primary)' }
const inputStyle: React.CSSProperties = { width: '100%', padding: '0.625rem 0.875rem', borderRadius: 8, border: '1px solid var(--color-border)', background: 'var(--color-bg-card)', fontFamily: 'var(--font-body)', fontSize: '0.875rem', color: 'var(--color-text-primary)', outline: 'none' }
const taStyle: React.CSSProperties = { ...inputStyle, resize: 'vertical' as const, lineHeight: 1.6 }
const labelStyle: React.CSSProperties = { fontFamily: 'var(--font-body)', fontSize: '0.75rem', color: 'var(--color-text-muted)', marginBottom: '0.25rem', display: 'block' }
const sectionBtnSmall: React.CSSProperties = { width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0.5rem 0', background: 'none', border: 'none', cursor: 'pointer', fontFamily: 'var(--font-body)' }
const btnDanger: React.CSSProperties = { display: 'flex', alignItems: 'center', padding: '0.25rem 0.5rem', borderRadius: 6, background: 'transparent', color: '#DC2626', border: '1px solid #DC262630', cursor: 'pointer' }
const btnAdd: React.CSSProperties = { display: 'flex', alignItems: 'center', gap: '0.375rem', padding: '0.5rem 1rem', borderRadius: 8, fontSize: '0.8125rem', fontFamily: 'var(--font-body)', fontWeight: 600, background: 'transparent', color: '#0D9488', border: '1px solid #0D948830', cursor: 'pointer' }
const btnOG: React.CSSProperties = { display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.75rem 1.25rem', borderRadius: 10, fontFamily: 'var(--font-body)', fontSize: '0.875rem', fontWeight: 600, background: 'transparent', color: '#0D9488', border: '1.5px solid #0D948840', cursor: 'pointer' }
const btnSG: React.CSSProperties = { display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.75rem 1.25rem', borderRadius: 10, fontFamily: 'var(--font-body)', fontSize: '0.875rem', fontWeight: 600, background: '#0D9488', color: 'white', border: 'none', cursor: 'pointer', boxShadow: '0 2px 8px rgba(13,148,136,0.3)' }
const btnO: React.CSSProperties = { display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.75rem 1.25rem', borderRadius: 10, fontFamily: 'var(--font-body)', fontSize: '0.875rem', fontWeight: 600, background: 'transparent', color: 'var(--color-text-secondary)', border: '1.5px solid var(--color-border)', cursor: 'pointer' }
