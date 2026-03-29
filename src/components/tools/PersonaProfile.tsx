'use client'

import { useState } from 'react'
import { ChevronDown, Save, CheckCircle2, FileText } from 'lucide-react'
import { useToolState } from '@/lib/useToolState'
import type { ToolComponentProps } from './ToolPage'

interface Data {
  [key: string]: unknown
  nombre: string
  edad: number | string
  cargo: string
  empresaTipo: string
  diaTipico: string
  frustraciones: string
  motivaciones: string
  criteriosCompra: string
  cita: string
}

const DEFAULT: Data = { nombre: '', edad: '', cargo: '', empresaTipo: '', diaTipico: '', frustraciones: '', motivaciones: '', criteriosCompra: '', cita: '' }

export default function PersonaProfile({ userId, onComplete, onGenerateReport }: ToolComponentProps) {
  const [data, setData] = useToolState<Data>(userId, 'persona-profile', DEFAULT)
  const [openSections, setOpenSections] = useState<Record<string, boolean>>({})
  const [saved, setSaved] = useState(false)
  const toggle = (k: string) => setOpenSections(p => ({ ...p, [k]: !p[k] }))
  const handleSave = () => { setSaved(true); setTimeout(() => setSaved(false), 2000) }
  const u = (field: keyof Data, value: string) => setData(p => ({ ...p, [field]: value }))

  const handleReport = () => {
    const content = `
PERFIL DE PERSONA

NOMBRE: ${data.nombre || '(No completado)'}
EDAD: ${data.edad || '(No completado)'}
CARGO/ROL: ${data.cargo || '(No completado)'}
EMPRESA TIPO: ${data.empresaTipo || '(No completado)'}

DÍA TÍPICO:
${data.diaTipico || '(No completado)'}

FRUSTRACIONES PRINCIPALES:
${data.frustraciones || '(No completado)'}

MOTIVACIONES:
${data.motivaciones || '(No completado)'}

CRITERIOS DE DECISIÓN DE COMPRA:
${data.criteriosCompra || '(No completado)'}

CITA REPRESENTATIVA:
"${data.cita || '(No completado)'}"
    `.trim()
    onGenerateReport(content)
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
      {/* Basic info - number fields always visible */}
      <div style={cardStyle}>
        <div style={{ padding: '1rem 1.25rem' }}><span style={headingStyle}>Datos básicos de la persona</span></div>
        <div style={{ padding: '0 1.25rem 1.25rem' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr auto 1fr 1fr', gap: '0.625rem' }}>
            <input value={data.nombre} onChange={e => u('nombre', e.target.value)} placeholder="Nombre de la persona" style={inputStyle} />
            <input type="number" value={data.edad} onChange={e => u('edad', e.target.value)} placeholder="Edad" style={{ ...inputStyle, width: 80 }} />
            <input value={data.cargo} onChange={e => u('cargo', e.target.value)} placeholder="Cargo / Rol" style={inputStyle} />
            <input value={data.empresaTipo} onChange={e => u('empresaTipo', e.target.value)} placeholder="Empresa tipo" style={inputStyle} />
          </div>
        </div>
      </div>

      {[
        { key: 'diaTipico', title: 'Día típico', ph: '¿Cómo es un día típico de esta persona? ¿Qué tareas hace, qué herramientas usa?' },
        { key: 'frustraciones', title: 'Frustraciones principales', ph: '¿Qué le frustra? ¿Qué problemas enfrenta constantemente?' },
        { key: 'motivaciones', title: 'Motivaciones', ph: '¿Qué la motiva? ¿Qué quiere lograr profesional y personalmente?' },
        { key: 'criteriosCompra', title: 'Criterios de decisión de compra', ph: '¿Qué factores considera al evaluar una solución? Precio, facilidad, soporte...' },
        { key: 'cita', title: 'Cita representativa', ph: 'Una frase que esta persona diría sobre su problema o necesidad...' },
      ].map(s => (
        <div key={s.key} style={cardStyle}>
          <button onClick={() => toggle(s.key)} style={sectionBtn}>
            <span style={headingStyle}>{s.title}</span>
            <ChevronDown size={18} color="var(--color-text-muted)" style={{ transition: 'transform 0.2s', transform: openSections[s.key] ? 'rotate(180deg)' : 'rotate(0)' }} />
          </button>
          {openSections[s.key] && (
            <div style={{ padding: '0 1.25rem 1.25rem' }}>
              <textarea value={(data as Record<string, string>)[s.key]} onChange={e => u(s.key as keyof Data, e.target.value)} placeholder={s.ph} rows={4} style={taStyle} />
            </div>
          )}
        </div>
      ))}

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
const sectionBtn: React.CSSProperties = { width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '1rem 1.25rem', background: 'none', border: 'none', cursor: 'pointer' }
const inputStyle: React.CSSProperties = { width: '100%', padding: '0.625rem 0.875rem', borderRadius: 8, border: '1px solid var(--color-border)', background: 'var(--color-bg-card)', fontFamily: 'var(--font-body)', fontSize: '0.875rem', color: 'var(--color-text-primary)', outline: 'none' }
const taStyle: React.CSSProperties = { ...inputStyle, resize: 'vertical' as const, lineHeight: 1.6 }
const btnOG: React.CSSProperties = { display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.75rem 1.25rem', borderRadius: 10, fontFamily: 'var(--font-body)', fontSize: '0.875rem', fontWeight: 600, background: 'transparent', color: '#0D9488', border: '1.5px solid #0D948840', cursor: 'pointer' }
const btnSG: React.CSSProperties = { display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.75rem 1.25rem', borderRadius: 10, fontFamily: 'var(--font-body)', fontSize: '0.875rem', fontWeight: 600, background: '#0D9488', color: 'white', border: 'none', cursor: 'pointer', boxShadow: '0 2px 8px rgba(13,148,136,0.3)' }
const btnO: React.CSSProperties = { display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.75rem 1.25rem', borderRadius: 10, fontFamily: 'var(--font-body)', fontSize: '0.875rem', fontWeight: 600, background: 'transparent', color: 'var(--color-text-secondary)', border: '1.5px solid var(--color-border)', cursor: 'pointer' }
