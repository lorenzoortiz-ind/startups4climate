'use client'

import { useState } from 'react'
import { useToolState } from '@/lib/useToolState'
import type { ToolComponentProps } from './ToolPage'
import { ToolSection, ToolActionBar, ToolProgress, inputStyle, textareaStyle, labelStyle, btnSmall } from './shared'

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
  const [saved, setSaved] = useState(false)

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

  /* Count non-empty fields for progress */
  const filledCount = [
    data.mision,
    data.valores,
    data.pasion,
    data.founders.some(f => f.name || f.skills) ? 'filled' : '',
    data.reclutamiento,
  ].filter(Boolean).length

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
      <ToolProgress filled={filledCount} total={5} />

      <ToolSection
        number={1}
        title="Misión"
        subtitle="Define el cambio que tu startup quiere generar"
        insight="Una misión efectiva describe el cambio que quieres ver en el mundo, no tu producto. Piensa en el 'por qué' antes que el 'qué'."
        insightSource="Simon Sinek, Start With Why"
        defaultOpen
      >
        <textarea
          value={data.mision}
          onChange={e => update('mision', e.target.value)}
          placeholder="¿Cuál es la razón de ser de tu startup? ¿Qué impacto quieres generar en el mundo?"
          rows={4}
          style={textareaStyle}
        />
      </ToolSection>

      <ToolSection
        number={2}
        title="Valores fundamentales"
        subtitle="Los principios que guían las decisiones de tu equipo"
      >
        <textarea
          value={data.valores}
          onChange={e => update('valores', e.target.value)}
          placeholder="¿Qué principios guían las decisiones de tu equipo? Lista los 3-5 valores más importantes."
          rows={4}
          style={textareaStyle}
        />
      </ToolSection>

      <ToolSection
        number={3}
        title="Pasión personal"
        subtitle="Tu conexión emocional con el problema"
        insight="Los founders que conectan su pasión personal con un problema real tienen 3x más probabilidad de persistir tras el primer pivote."
        insightSource="Stanford Lean LaunchPad"
      >
        <textarea
          value={data.pasion}
          onChange={e => update('pasion', e.target.value)}
          placeholder="¿Qué te motiva personalmente a trabajar en este problema? ¿Por qué dedicas tu energía a esto?"
          rows={4}
          style={textareaStyle}
        />
      </ToolSection>

      <ToolSection
        number={4}
        title="Habilidades del equipo"
        subtitle="Mapea las fortalezas y brechas de cada fundador"
      >
        {data.founders.map((f, i) => (
          <div key={i} style={{ padding: '1rem', borderRadius: 10, border: '1px solid var(--color-border)', marginBottom: '0.75rem', background: 'var(--color-bg-primary)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
              <span style={labelStyle}>Fundador {i + 1}</span>
              {data.founders.length > 1 && (
                <button onClick={() => removeFounder(i)} style={{ ...btnSmall, color: '#DC2626', borderColor: '#DC262630' }}>Eliminar</button>
              )}
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.625rem', marginBottom: '0.625rem' }}>
              <input value={f.name} onChange={e => updateFounder(i, 'name', e.target.value)} placeholder="Nombre" style={inputStyle} />
              <input value={f.role} onChange={e => updateFounder(i, 'role', e.target.value)} placeholder="Rol" style={inputStyle} />
            </div>
            <textarea value={f.skills} onChange={e => updateFounder(i, 'skills', e.target.value)} placeholder="Habilidades clave" rows={2} style={textareaStyle} />
            <textarea value={f.gaps} onChange={e => updateFounder(i, 'gaps', e.target.value)} placeholder="Brechas o áreas de mejora" rows={2} style={{ ...textareaStyle, marginTop: '0.5rem' }} />
          </div>
        ))}
        <button onClick={addFounder} style={{ ...btnSmall, color: '#1F77F6', borderColor: '#1F77F630' }}>+ Agregar fundador</button>
      </ToolSection>

      <ToolSection
        number={5}
        title="Plan de reclutamiento"
        subtitle="Estrategia para atraer el talento que necesitas"
      >
        <textarea
          value={data.reclutamiento}
          onChange={e => update('reclutamiento', e.target.value)}
          placeholder="¿Qué perfiles necesitas incorporar? ¿Cómo planeas atraer talento?"
          rows={4}
          style={textareaStyle}
        />
      </ToolSection>

      <ToolActionBar
        onSave={handleSave}
        onComplete={onComplete}
        onReport={handleReport}
        saved={saved}
      />
    </div>
  )
}
