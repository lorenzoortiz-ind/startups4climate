'use client'

import { useState } from 'react'
import { ChevronDown, Save, CheckCircle2, FileText } from 'lucide-react'
import { useToolState } from '@/lib/useToolState'
import type { ToolComponentProps } from './ToolPage'

interface Data {
  [key: string]: unknown
  nombre: string
  demograficos: string
  psicograficos: string
  dolores: string
  necesidades: string
  contextoUso: string
}

const DEFAULT: Data = { nombre: '', demograficos: '', psicograficos: '', dolores: '', necesidades: '', contextoUso: '' }

export default function EndUserProfile({ userId, onComplete, onGenerateReport }: ToolComponentProps) {
  const [data, setData] = useToolState<Data>(userId, 'end-user-profile', DEFAULT)
  const [openSections, setOpenSections] = useState<Record<string, boolean>>({})
  const [saved, setSaved] = useState(false)
  const toggle = (k: string) => setOpenSections(p => ({ ...p, [k]: !p[k] }))
  const handleSave = () => { setSaved(true); setTimeout(() => setSaved(false), 2000) }

  const handleReport = () => {
    const content = `
PERFIL DEL USUARIO FINAL

NOMBRE DEL PERFIL: ${data.nombre || '(No completado)'}

DATOS DEMOGRÁFICOS:
${data.demograficos || '(No completado)'}

DATOS PSICOGRÁFICOS:
${data.psicograficos || '(No completado)'}

DOLORES Y FRUSTRACIONES:
${data.dolores || '(No completado)'}

NECESIDADES NO SATISFECHAS:
${data.necesidades || '(No completado)'}

CONTEXTO DE USO DEL PRODUCTO:
${data.contextoUso || '(No completado)'}
    `.trim()
    onGenerateReport(content)
  }

  const sections = [
    { key: 'nombre', title: 'Nombre del perfil', type: 'input' as const, placeholder: 'Ej: "María, Directora de Sostenibilidad"' },
    { key: 'demograficos', title: 'Datos demográficos', type: 'textarea' as const, placeholder: 'Edad, género, ubicación, nivel de ingresos, educación...' },
    { key: 'psicograficos', title: 'Datos psicográficos', type: 'textarea' as const, placeholder: 'Valores, intereses, estilo de vida, actitudes hacia la sostenibilidad...' },
    { key: 'dolores', title: 'Dolores y frustraciones', type: 'textarea' as const, placeholder: '¿Qué problemas enfrenta día a día? ¿Qué le frustra de las soluciones actuales?' },
    { key: 'necesidades', title: 'Necesidades no satisfechas', type: 'textarea' as const, placeholder: '¿Qué necesita y no encuentra en el mercado actual?' },
    { key: 'contextoUso', title: 'Contexto de uso del producto', type: 'textarea' as const, placeholder: '¿Dónde, cuándo y cómo usaría tu producto?' },
  ]

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
      {sections.map(s => (
        <div key={s.key} style={cardStyle}>
          <button onClick={() => toggle(s.key)} style={sectionBtn}>
            <span style={headingStyle}>{s.title}</span>
            <ChevronDown size={18} color="var(--color-text-muted)" style={{ transition: 'transform 0.2s', transform: openSections[s.key] ? 'rotate(180deg)' : 'rotate(0)' }} />
          </button>
          {openSections[s.key] && (
            <div style={{ padding: '0 1.25rem 1.25rem' }}>
              {s.type === 'input' ? (
                <input value={(data as Record<string, string>)[s.key]} onChange={e => setData(p => ({ ...p, [s.key]: e.target.value }))} placeholder={s.placeholder} style={inputStyle} />
              ) : (
                <textarea value={(data as Record<string, string>)[s.key]} onChange={e => setData(p => ({ ...p, [s.key]: e.target.value }))} placeholder={s.placeholder} rows={4} style={taStyle} />
              )}
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
