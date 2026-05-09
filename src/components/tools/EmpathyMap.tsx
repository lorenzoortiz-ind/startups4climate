'use client'

import { useState } from 'react'
import { useToolState } from '@/lib/useToolState'
import type { ToolComponentProps } from './ToolPage'
import {
  ToolSection, ToolActionBar, ToolProgress,
  inputStyle, textareaStyle, labelStyle,
} from './shared'

interface Data {
  personName: string
  personContext: string
  thinksFeel: string
  sees: string
  saysDoes: string
  hears: string
  insights: string[]
}

const DEFAULT: Data = {
  personName: '',
  personContext: '',
  thinksFeel: '',
  sees: '',
  saysDoes: '',
  hears: '',
  insights: ['', '', ''],
}

const ACCENT = '#16A34A'

const QUADRANTS = [
  {
    key: 'thinksFeel' as const,
    title: 'Piensa y siente',
    subtitle: 'Sus preocupaciones, aspiraciones, miedos internos (lo que no dice en voz alta)',
    placeholder: 'Ej: Teme que su negocio no sobreviva la próxima temporada. Se preocupa por cómo pagar la educación de sus hijos. Aspira a tener más control sobre el precio de venta de su cosecha.',
  },
  {
    key: 'sees' as const,
    title: 'Ve',
    subtitle: 'Su entorno físico, lo que observa a diario, los influenciadores que sigue',
    placeholder: 'Ej: Ve a sus vecinos usando la misma tecnología de hace 20 años. Observa que los intermediarios se llevan el 40% del margen. Sigue a líderes de su comunidad en WhatsApp.',
  },
  {
    key: 'saysDoes' as const,
    title: 'Dice y hace',
    subtitle: 'Comportamiento observable, lo que declara públicamente, sus acciones reales',
    placeholder: 'Ej: Dice que "el sistema no está hecho para nosotros". Participa en reuniones de la cooperativa pero raramente habla. Vende directamente a intermediarios aunque sabe que pierde margen.',
  },
  {
    key: 'hears' as const,
    title: 'Escucha',
    subtitle: 'Lo que le dicen colegas, familia, medios, figuras de autoridad',
    placeholder: 'Ej: Sus hijos le dicen que deje de trabajar la tierra. El gobierno le dice que aplique a subsidios pero el trámite es imposible. Sus pares le dicen que no hay alternativa.',
  },
]

export default function EmpathyMap({ userId, onComplete, onGenerateReport }: ToolComponentProps) {
  const [data, setData] = useToolState<Data>(userId, 'empathy-map', DEFAULT)
  const [saved, setSaved] = useState(false)

  const filledQuadrants = [data.thinksFeel, data.sees, data.saysDoes, data.hears].filter(v => v.trim()).length
  const filledInsights = data.insights.filter(i => i.trim()).length
  const filledCount = (data.personName.trim() ? 1 : 0) + (filledQuadrants >= 4 ? 1 : 0) + (filledInsights >= 3 ? 1 : 0)

  const updateInsight = (i: number, value: string) =>
    setData(p => { const ins = [...p.insights]; ins[i] = value; return { ...p, insights: ins } })

  const handleReport = () => {
    const content = `
MAPA DE EMPATÍA

PERSONA: ${data.personName || '(Sin nombre)'}
CONTEXTO: ${data.personContext || '(No completado)'}

PIENSA Y SIENTE:
${data.thinksFeel || '(No completado)'}

VE:
${data.sees || '(No completado)'}

DICE Y HACE:
${data.saysDoes || '(No completado)'}

ESCUCHA:
${data.hears || '(No completado)'}

INSIGHTS SÍNTESIS:
${data.insights.map((ins, i) => `${i + 1}. ${ins || '(No completado)'}`).join('\n')}
`.trim()
    onGenerateReport(content)
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
      <ToolProgress filled={filledCount} total={3} accentColor={ACCENT} />

      <ToolSection
        number={1}
        title="¿De quién es este mapa?"
        subtitle="La persona que vive el problema que seleccionaste"
        insight="Shift fundamental del Design Thinking: el founder deja de ser el protagonista. El afectado ocupa el centro. Esta perspectiva es el corazón del Human-Centered Design."
        insightSource="XPLANE / Dave Gray — Mapa de Empatía · Stanford d.school"
        defaultOpen={true}
        accentColor={ACCENT}
      >
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
          <div>
            <label style={labelStyle}>Nombre ficticio de la persona</label>
            <input
              value={data.personName}
              onChange={e => setData(p => ({ ...p, personName: e.target.value }))}
              placeholder="Ej: María, 38 años"
              style={inputStyle}
            />
          </div>
          <div>
            <label style={labelStyle}>Contexto / perfil breve</label>
            <input
              value={data.personContext}
              onChange={e => setData(p => ({ ...p, personContext: e.target.value }))}
              placeholder="Ej: Agricultora de café, comunidad rural en Perú"
              style={inputStyle}
            />
          </div>
        </div>
      </ToolSection>

      <ToolSection
        number={2}
        title="Los 4 cuadrantes"
        subtitle="Describe qué experimenta la persona desde adentro"
        defaultOpen={true}
        accentColor={ACCENT}
      >
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.875rem' }}>
          {QUADRANTS.map(q => (
            <div key={q.key} style={{
              padding: '1rem', borderRadius: 12,
              border: `1px solid ${data[q.key].trim() ? ACCENT + '40' : 'var(--color-border)'}`,
              background: 'var(--color-bg-primary)',
            }}>
              <div style={{
                fontFamily: 'var(--font-heading)', fontSize: '0.8125rem',
                fontWeight: 700, color: ACCENT, marginBottom: '0.25rem',
              }}>
                {q.title}
              </div>
              <div style={{
                fontFamily: 'var(--font-body)', fontSize: '0.6875rem',
                color: 'var(--color-text-muted)', marginBottom: '0.625rem', lineHeight: 1.4,
              }}>
                {q.subtitle}
              </div>
              <textarea
                value={data[q.key]}
                onChange={e => setData(p => ({ ...p, [q.key]: e.target.value }))}
                placeholder={q.placeholder}
                style={{ ...textareaStyle, minHeight: 110, fontSize: '0.8125rem' }}
              />
            </div>
          ))}
        </div>
      </ToolSection>

      <ToolSection
        number={3}
        title="3 insights síntesis"
        subtitle="¿Qué revela este mapa que no sabías antes?"
        insight="Un insight no es una observación — es una contradicción, una tensión no resuelta, o una necesidad oculta que nadie estaba satisfaciendo."
        insightSource="IDEO — Design Thinking"
        defaultOpen={true}
        accentColor={ACCENT}
      >
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.625rem' }}>
          {data.insights.map((insight, i) => (
            <div key={i} style={{ display: 'flex', gap: '0.75rem', alignItems: 'flex-start' }}>
              <div style={{
                width: 28, height: 28, borderRadius: '50%', flexShrink: 0,
                background: insight.trim() ? `${ACCENT}15` : 'var(--color-border)',
                border: `1.5px solid ${insight.trim() ? ACCENT : 'var(--color-border)'}`,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontFamily: 'var(--font-heading)', fontSize: '0.75rem', fontWeight: 700,
                color: insight.trim() ? ACCENT : 'var(--color-text-muted)',
              }}>
                {i + 1}
              </div>
              <textarea
                value={insight}
                onChange={e => updateInsight(i, e.target.value)}
                placeholder={`Insight ${i + 1}: Aunque [la persona] dice X, en realidad necesita/siente Y porque...`}
                style={{ ...textareaStyle, flex: 1, minHeight: 60 }}
              />
            </div>
          ))}
        </div>
      </ToolSection>

      <ToolActionBar
        onSave={() => { setSaved(true); setTimeout(() => setSaved(false), 2000) }}
        onComplete={onComplete}
        onReport={handleReport}
        saved={saved}
        accentColor={ACCENT}
      />
    </div>
  )
}
