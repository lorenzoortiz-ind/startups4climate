'use client'

import { useState } from 'react'
import { useToolState } from '@/lib/useToolState'
import type { ToolComponentProps } from './ToolPage'
import { ToolSection, ToolActionBar, ToolProgress, inputStyle, textareaStyle, labelStyle } from './shared'

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
  const [saved, setSaved] = useState(false)
  const handleSave = () => { setSaved(true); setTimeout(() => setSaved(false), 2000) }
  const u = (field: keyof Data, value: string) => setData(p => ({ ...p, [field]: value }))

  const filledCount = [
    data.nombre,
    data.edad ? String(data.edad) : '',
    data.cargo,
    data.empresaTipo,
    data.diaTipico,
    data.frustraciones,
    data.motivaciones,
    data.criteriosCompra,
    data.cita,
  ].filter(Boolean).length

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
      <ToolProgress filled={filledCount} total={9} />

      <ToolSection
        number={1}
        title="Datos básicos de la persona"
        subtitle="Identidad y contexto profesional"
        insight="Tu persona no es un avatar ficticio — es el composite de 5+ entrevistas reales con usuarios potenciales."
        insightSource="Steve Blank, The Startup Owner's Manual"
        defaultOpen
      >
        <div style={{ display: 'grid', gridTemplateColumns: '1fr auto 1fr 1fr', gap: '0.625rem' }}>
          <div>
            <label style={labelStyle}>Nombre</label>
            <input value={data.nombre} onChange={e => u('nombre', e.target.value)} placeholder="Nombre de la persona" style={inputStyle} />
          </div>
          <div>
            <label style={labelStyle}>Edad</label>
            <input type="number" value={data.edad} onChange={e => u('edad', e.target.value)} placeholder="Edad" style={{ ...inputStyle, width: 80 }} />
          </div>
          <div>
            <label style={labelStyle}>Cargo / Rol</label>
            <input value={data.cargo} onChange={e => u('cargo', e.target.value)} placeholder="Cargo / Rol" style={inputStyle} />
          </div>
          <div>
            <label style={labelStyle}>Empresa tipo</label>
            <input value={data.empresaTipo} onChange={e => u('empresaTipo', e.target.value)} placeholder="Empresa tipo" style={inputStyle} />
          </div>
        </div>
      </ToolSection>

      <ToolSection
        number={2}
        title="Día típico"
        subtitle="Rutina diaria, herramientas y decisiones"
      >
        <textarea value={(data as Record<string, string>).diaTipico} onChange={e => u('diaTipico', e.target.value)} placeholder="¿Cómo es un día típico de esta persona? ¿Qué tareas hace, qué herramientas usa?" rows={4} style={textareaStyle} />
      </ToolSection>

      <ToolSection
        number={3}
        title="Frustraciones principales"
        subtitle="Los problemas que enfrenta constantemente"
        insight="Las mejores oportunidades de negocio nacen de frustraciones que el usuario ya intenta resolver con workarounds manuales o herramientas inadecuadas."
        insightSource="Ash Maurya, Running Lean"
      >
        <textarea value={(data as Record<string, string>).frustraciones} onChange={e => u('frustraciones', e.target.value)} placeholder="¿Qué le frustra? ¿Qué problemas enfrenta constantemente?" rows={4} style={textareaStyle} />
      </ToolSection>

      <ToolSection
        number={4}
        title="Motivaciones"
        subtitle="Metas profesionales y personales"
      >
        <textarea value={(data as Record<string, string>).motivaciones} onChange={e => u('motivaciones', e.target.value)} placeholder="¿Qué la motiva? ¿Qué quiere lograr profesional y personalmente?" rows={4} style={textareaStyle} />
      </ToolSection>

      <ToolSection
        number={5}
        title="Criterios de decisión de compra"
        subtitle="Factores que influyen en su elección de solución"
      >
        <textarea value={(data as Record<string, string>).criteriosCompra} onChange={e => u('criteriosCompra', e.target.value)} placeholder="¿Qué factores considera al evaluar una solución? Precio, facilidad, soporte..." rows={4} style={textareaStyle} />
      </ToolSection>

      <ToolSection
        number={6}
        title="Cita representativa"
        subtitle="Una frase que esta persona diría sobre su problema"
      >
        <textarea value={(data as Record<string, string>).cita} onChange={e => u('cita', e.target.value)} placeholder='Una frase que esta persona diría sobre su problema o necesidad...' rows={3} style={textareaStyle} />
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
