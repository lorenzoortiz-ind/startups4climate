'use client'

import { useState } from 'react'
import { useToolState } from '@/lib/useToolState'
import type { ToolComponentProps } from './ToolPage'
import { ToolSection, ToolActionBar, ToolProgress, InsightPanel, textareaStyle } from './shared'

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
  { key: 'descubrimiento', title: 'Descubrimiento', subtitle: 'Primer contacto con tu solución', ph: '¿Cómo se entera el usuario de tu solución? ¿Qué canales o momentos lo llevan a descubrirte?' },
  { key: 'evaluacion', title: 'Evaluación', subtitle: 'Comparación y análisis', ph: '¿Cómo evalúa si tu solución le sirve? ¿Qué información busca? ¿Con quién la compara?' },
  { key: 'compra', title: 'Compra', subtitle: 'Decisión y adquisición', ph: '¿Cómo compra? ¿Cuál es el proceso de decisión? ¿Quién aprueba la compra?' },
  { key: 'usoInicial', title: 'Uso inicial', subtitle: 'Onboarding y primera experiencia', ph: '¿Cuál es la primera experiencia del usuario? ¿Qué espera lograr en los primeros minutos/días?' },
  { key: 'usoContinuo', title: 'Uso continuo', subtitle: 'Retención y hábito', ph: '¿Cómo usa el producto de manera recurrente? ¿Con qué frecuencia? ¿Qué valor obtiene cada vez?' },
  { key: 'recomendacion', title: 'Recomendación', subtitle: 'Viralidad y referidos', ph: '¿Cómo recomienda tu producto a otros? ¿Qué lo motiva a hacerlo?' },
  { key: 'puntosFriccion', title: 'Puntos de fricción identificados', subtitle: 'Riesgos de abandono en el ciclo', ph: '¿Dónde puede haber fricción en todo el ciclo de vida? ¿Qué podría hacer que el usuario abandone?' },
]

export default function FullLifecycleUseCase({ userId, onComplete, onGenerateReport }: ToolComponentProps) {
  const [data, setData] = useToolState<Data>(userId, 'full-lifecycle-usecase', DEFAULT)
  const [saved, setSaved] = useState(false)
  const handleSave = () => { setSaved(true); setTimeout(() => setSaved(false), 2000) }

  const filled = SECTIONS.filter(s => (data as Record<string, string>)[s.key]?.trim().length > 0).length

  const handleReport = () => {
    const content = SECTIONS.map(s =>
      `${s.title.toUpperCase()}:\n${(data as Record<string, string>)[s.key] || '(No completado)'}`
    ).join('\n\n')
    onGenerateReport(`CASO DE USO — CICLO DE VIDA COMPLETO\n\n${content}`)
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
      <ToolProgress filled={filled} total={SECTIONS.length} accentColor="#1F77F6" />

      <InsightPanel title="Referencia académica">
        <p style={{ margin: 0 }}>
          &ldquo;Mapea el ciclo completo del usuario: desde que descubre su problema hasta que tu solución se vuelve parte de su rutina.&rdquo;
        </p>
        <span style={{
          fontFamily: 'var(--font-body)',
          fontSize: '0.6875rem',
          color: 'var(--color-text-muted)',
          marginTop: '0.25rem',
          display: 'block',
        }}>
          — MIT Disciplined Entrepreneurship, Step 8
        </span>
      </InsightPanel>

      {SECTIONS.map((s, i) => (
        <ToolSection
          key={s.key}
          number={i + 1}
          title={s.title}
          subtitle={s.subtitle}
          accentColor="#1F77F6"
        >
          <textarea
            value={(data as Record<string, string>)[s.key]}
            onChange={e => setData(p => ({ ...p, [s.key]: e.target.value }))}
            placeholder={s.ph}
            rows={4}
            style={textareaStyle}
          />
        </ToolSection>
      ))}

      <ToolActionBar
        onSave={handleSave}
        onComplete={onComplete}
        onReport={handleReport}
        saved={saved}
        accentColor="#1F77F6"
      />
    </div>
  )
}
