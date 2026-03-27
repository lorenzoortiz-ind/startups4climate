'use client'

import { useState } from 'react'
import { ChevronDown, Save, CheckCircle2, FileText } from 'lucide-react'
import { useToolState } from '@/lib/useToolState'
import type { ToolComponentProps } from './ToolPage'

interface FounderEntry {
  name: string
  role: string
  skills: string
  gaps: string
}

interface Data {
  mision: string
  valores: string
  pasion: string
  founders: FounderEntry[]
  reclutamiento: string
}

const DEFAULT: Data = {
  mision: '',
  valores: '',
  pasion: '',
  founders: [{ name: '', role: '', skills: '', gaps: '' }],
  reclutamiento: '',
}

export default function PassionPurpose({ userId, onComplete, onGenerateReport }: ToolComponentProps) {
  const [data, setData] = useToolState<Data>(userId, 'passion-purpose', DEFAULT)
  const [openSections, setOpenSections] = useState<Record<string, boolean>>({})
  const [saved, setSaved] = useState(false)

  const toggle = (k: string) => setOpenSections(p => ({ ...p, [k]: !p[k] }))
  const update = (field: keyof Data, value: string) => setData(p => ({ ...p, [field]: value }))

  const updateFounder = (i: number, field: keyof FounderEntry, value: string) => {
    setData(p => {
      const founders = [...p.founders]
      founders[i] = { ...founders[i], [field]: value }
      return { ...p, founders }
    })
  }

  const addFounder = () => setData(p => ({ ...p, founders: [...p.founders, { name: '', role: '', skills: '', gaps: '' }] }))
  const removeFounder = (i: number) => setData(p => ({ ...p, founders: p.founders.filter((_, idx) => idx !== i) }))

  const handleSave = () => { setSaved(true); setTimeout(() => setSaved(false), 2000) }

  const handleReport = () => {
    const content = `
PASIÓN Y PROPÓSITO

MISIÓN:
${data.mision || '(No completado)'}

VALORES FUNDAMENTALES:
${data.valores || '(No completado)'}

PASIÓN PERSONAL:
${data.pasion || '(No completado)'}

HABILIDADES DEL EQUIPO:
${data.founders.map((f, i) => `Fundador ${i + 1}: ${f.name || '(Sin nombre)'}
  Rol: ${f.role || '(No definido)'}
  Habilidades: ${f.skills || '(No completado)'}
  Brechas: ${f.gaps || '(No completado)'}`).join('\n')}

PLAN DE RECLUTAMIENTO:
${data.reclutamiento || '(No completado)'}
    `.trim()
    onGenerateReport(content)
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
      {/* Misión */}
      <SectionCollapsible title="Misión" sectionKey="mision" open={openSections} toggle={toggle}>
        <textarea value={data.mision} onChange={e => update('mision', e.target.value)} placeholder="¿Cuál es la razón de ser de tu startup? ¿Qué impacto quieres generar en el mundo?" rows={4} style={taStyle} />
      </SectionCollapsible>

      {/* Valores */}
      <SectionCollapsible title="Valores fundamentales" sectionKey="valores" open={openSections} toggle={toggle}>
        <textarea value={data.valores} onChange={e => update('valores', e.target.value)} placeholder="¿Qué principios guían las decisiones de tu equipo? Lista los 3-5 valores más importantes." rows={4} style={taStyle} />
      </SectionCollapsible>

      {/* Pasión */}
      <SectionCollapsible title="Pasión personal" sectionKey="pasion" open={openSections} toggle={toggle}>
        <textarea value={data.pasion} onChange={e => update('pasion', e.target.value)} placeholder="¿Qué te motiva personalmente a trabajar en este problema? ¿Por qué dedicas tu energía a esto?" rows={4} style={taStyle} />
      </SectionCollapsible>

      {/* Founders */}
      <SectionCollapsible title="Habilidades del equipo" sectionKey="founders" open={openSections} toggle={toggle}>
        {data.founders.map((f, i) => (
          <div key={i} style={{ padding: '1rem', borderRadius: 10, border: '1px solid var(--color-border)', marginBottom: '0.75rem', background: 'var(--color-bg-primary)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
              <span style={{ fontFamily: 'var(--font-heading)', fontSize: '0.8125rem', fontWeight: 700, color: 'var(--color-text-secondary)' }}>Fundador {i + 1}</span>
              {data.founders.length > 1 && (
                <button onClick={() => removeFounder(i)} style={{ ...btnSmall, color: '#DC2626', borderColor: '#DC262630' }}>Eliminar</button>
              )}
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.625rem', marginBottom: '0.625rem' }}>
              <input value={f.name} onChange={e => updateFounder(i, 'name', e.target.value)} placeholder="Nombre" style={inputStyle} />
              <input value={f.role} onChange={e => updateFounder(i, 'role', e.target.value)} placeholder="Rol" style={inputStyle} />
            </div>
            <textarea value={f.skills} onChange={e => updateFounder(i, 'skills', e.target.value)} placeholder="Habilidades clave" rows={2} style={taStyle} />
            <textarea value={f.gaps} onChange={e => updateFounder(i, 'gaps', e.target.value)} placeholder="Brechas o áreas de mejora" rows={2} style={{ ...taStyle, marginTop: '0.5rem' }} />
          </div>
        ))}
        <button onClick={addFounder} style={{ ...btnSmall, color: '#059669', borderColor: '#05966930' }}>+ Agregar fundador</button>
      </SectionCollapsible>

      {/* Reclutamiento */}
      <SectionCollapsible title="Plan de reclutamiento" sectionKey="reclutamiento" open={openSections} toggle={toggle}>
        <textarea value={data.reclutamiento} onChange={e => update('reclutamiento', e.target.value)} placeholder="¿Qué perfiles necesitas incorporar? ¿Cómo planeas atraer talento?" rows={4} style={taStyle} />
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

const btnSmall: React.CSSProperties = {
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
