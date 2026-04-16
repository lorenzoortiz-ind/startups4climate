'use client'

import { useState } from 'react'
import { useToolState } from '@/lib/useToolState'
import type { ToolComponentProps } from './ToolPage'
import { ToolSection, ToolActionBar, ToolProgress, inputStyle, textareaStyle } from './shared'

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
  const [saved, setSaved] = useState(false)
  const handleSave = () => { setSaved(true); setTimeout(() => setSaved(false), 2000) }

  const fields = ['nombre', 'demograficos', 'psicograficos', 'dolores', 'necesidades', 'contextoUso'] as const
  const filledCount = fields.filter(k => Boolean((data as Record<string, string>)[k])).length

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

  const sections: Array<{ key: string; title: string; subtitle: string; type: 'input' | 'textarea'; placeholder: string; insight?: string; insightSource?: string }> = [
    { key: 'nombre', title: 'Nombre del perfil', subtitle: 'Dale un nombre concreto a tu usuario ideal', type: 'input', placeholder: 'Ej: "María, Directora de Sostenibilidad"', insight: 'No diseñes para un segmento abstracto. Describe a una persona real con nombre, rutina diaria y frustraciones concretas.', insightSource: 'MIT Disciplined Entrepreneurship, Step 5' },
    { key: 'demograficos', title: 'Datos demográficos', subtitle: 'Características observables de tu usuario', type: 'textarea', placeholder: 'Edad, género, ubicación, nivel de ingresos, educación...' },
    { key: 'psicograficos', title: 'Datos psicográficos', subtitle: 'Valores, actitudes y motivaciones internas', type: 'textarea', placeholder: 'Valores, intereses, estilo de vida, actitudes hacia la sostenibilidad...', insight: 'Los psicográficos predicen el comportamiento de compra mucho mejor que los demográficos. Un CEO de 25 y uno de 55 pueden tener los mismos dolores.', insightSource: 'Clayton Christensen, Jobs To Be Done' },
    { key: 'dolores', title: 'Dolores y frustraciones', subtitle: 'Los problemas que enfrenta día a día', type: 'textarea', placeholder: '¿Qué problemas enfrenta día a día? ¿Qué le frustra de las soluciones actuales?' },
    { key: 'necesidades', title: 'Necesidades no satisfechas', subtitle: 'Lo que busca y no encuentra en el mercado', type: 'textarea', placeholder: '¿Qué necesita y no encuentra en el mercado actual?' },
    { key: 'contextoUso', title: 'Contexto de uso del producto', subtitle: 'Dónde, cuándo y cómo usaría tu solución', type: 'textarea', placeholder: '¿Dónde, cuándo y cómo usaría tu producto?' },
  ]

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
      <ToolProgress filled={filledCount} total={6} />

      {sections.map((s, i) => (
        <ToolSection
          key={s.key}
          number={i + 1}
          title={s.title}
          subtitle={s.subtitle}
          insight={s.insight}
          insightSource={s.insightSource}
          defaultOpen={i === 0}
        >
          {s.type === 'input' ? (
            <input value={(data as Record<string, string>)[s.key]} onChange={e => setData(p => ({ ...p, [s.key]: e.target.value }))} placeholder={s.placeholder} style={inputStyle} />
          ) : (
            <textarea value={(data as Record<string, string>)[s.key]} onChange={e => setData(p => ({ ...p, [s.key]: e.target.value }))} placeholder={s.placeholder} rows={4} style={textareaStyle} />
          )}
        </ToolSection>
      ))}

      <ToolActionBar
        onSave={handleSave}
        onComplete={onComplete}
        onReport={handleReport}
        saved={saved}
      />
    </div>
  )
}
