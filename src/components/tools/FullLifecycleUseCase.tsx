'use client'

import { useState } from 'react'
import { ChevronDown, Save, CheckCircle2, FileText } from 'lucide-react'
import { useToolState } from '@/lib/useToolState'
import type { ToolComponentProps } from './ToolPage'

interface Data {
  [key: string]: unknown
  descubrimiento: string
  evaluacion: string
  compra: string
  usoInicial: string
  usoContinuo: string
  recomendacion: string
  puntosFriccion: string
}

const DEFAULT: Data = { descubrimiento: '', evaluacion: '', compra: '', usoInicial: '', usoContinuo: '', recomendacion: '', puntosFriccion: '' }

const SECTIONS = [
  { key: 'descubrimiento', title: 'Descubrimiento', ph: '¿Cómo se entera el usuario de tu solución? ¿Qué canales o momentos lo llevan a descubrirte?' },
  { key: 'evaluacion', title: 'Evaluación', ph: '¿Cómo evalúa si tu solución le sirve? ¿Qué información busca? ¿Con quién la compara?' },
  { key: 'compra', title: 'Compra', ph: '¿Cómo compra? ¿Cuál es el proceso de decisión? ¿Quién aprueba la compra?' },
  { key: 'usoInicial', title: 'Uso inicial', ph: '¿Cuál es la primera experiencia del usuario? ¿Qué espera lograr en los primeros minutos/días?' },
  { key: 'usoContinuo', title: 'Uso continuo', ph: '¿Cómo usa el producto de manera recurrente? ¿Con qué frecuencia? ¿Qué valor obtiene cada vez?' },
  { key: 'recomendacion', title: 'Recomendación', ph: '¿Cómo recomienda tu producto a otros? ¿Qué lo motiva a hacerlo?' },
  { key: 'puntosFriccion', title: 'Puntos de fricción identificados', ph: '¿Dónde puede haber fricción en todo el ciclo de vida? ¿Qué podría hacer que el usuario abandone?' },
]

export default function FullLifecycleUseCase({ userId, onComplete, onGenerateReport }: ToolComponentProps) {
  const [data, setData] = useToolState<Data>(userId, 'full-lifecycle-usecase', DEFAULT)
  const [openSections, setOpenSections] = useState<Record<string, boolean>>({})
  const [saved, setSaved] = useState(false)
  const toggle = (k: string) => setOpenSections(p => ({ ...p, [k]: !p[k] }))
  const handleSave = () => { setSaved(true); setTimeout(() => setSaved(false), 2000) }

  const handleReport = () => {
    const content = SECTIONS.map(s =>
      `${s.title.toUpperCase()}:\n${(data as Record<string, string>)[s.key] || '(No completado)'}`
    ).join('\n\n')
    onGenerateReport(`CASO DE USO — CICLO DE VIDA COMPLETO\n\n${content}`)
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
      {SECTIONS.map(s => (
        <div key={s.key} style={cardStyle}>
          <button onClick={() => toggle(s.key)} style={sectionBtn}>
            <span style={headingStyle}>{s.title}</span>
            <ChevronDown size={18} color="var(--color-text-muted)" style={{ transition: 'transform 0.2s', transform: openSections[s.key] ? 'rotate(180deg)' : 'rotate(0)' }} />
          </button>
          {openSections[s.key] && (
            <div style={{ padding: '0 1.25rem 1.25rem' }}>
              <textarea value={(data as Record<string, string>)[s.key]} onChange={e => setData(p => ({ ...p, [s.key]: e.target.value }))} placeholder={s.ph} rows={4} style={taStyle} />
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
const taStyle: React.CSSProperties = { width: '100%', padding: '0.625rem 0.875rem', borderRadius: 8, border: '1px solid var(--color-border)', background: 'var(--color-bg-card)', fontFamily: 'var(--font-body)', fontSize: '0.875rem', color: 'var(--color-text-primary)', outline: 'none', resize: 'vertical' as const, lineHeight: 1.6 }
const btnOG: React.CSSProperties = { display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.75rem 1.25rem', borderRadius: 10, fontFamily: 'var(--font-body)', fontSize: '0.875rem', fontWeight: 600, background: 'transparent', color: '#059669', border: '1.5px solid #05966940', cursor: 'pointer' }
const btnSG: React.CSSProperties = { display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.75rem 1.25rem', borderRadius: 10, fontFamily: 'var(--font-body)', fontSize: '0.875rem', fontWeight: 600, background: '#059669', color: 'white', border: 'none', cursor: 'pointer', boxShadow: '0 2px 8px rgba(5,150,105,0.3)' }
const btnO: React.CSSProperties = { display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.75rem 1.25rem', borderRadius: 10, fontFamily: 'var(--font-body)', fontSize: '0.875rem', fontWeight: 600, background: 'transparent', color: 'var(--color-text-secondary)', border: '1.5px solid var(--color-border)', cursor: 'pointer' }
