'use client'

import { useState } from 'react'
import { Plus, Trash2 } from 'lucide-react'
import { useToolState } from '@/lib/useToolState'
import type { ToolComponentProps } from './ToolPage'
import { ToolSection, ToolProgress, ToolActionBar, inputStyle, textareaStyle, labelStyle, btnSmall } from './shared'

interface Metric {
  [key: string]: unknown
  name: string
  category: 'output' | 'outcome' | 'impact'
  description: string
  baseline: number
  target: number
  current: number
  unit: string
  measurement_method: string
}

interface Data {
  [key: string]: unknown
  ods_alignment: number[]
  impact_thesis: string
  theory_of_change: string
  metrics: Metric[]
}

const emptyMetric = (): Metric => ({
  name: '', category: 'output', description: '', baseline: 0, target: 100, current: 0, unit: '', measurement_method: '',
})

const DEFAULT: Data = {
  ods_alignment: [],
  impact_thesis: '',
  theory_of_change: '',
  metrics: [emptyMetric()],
}

const ODS_NAMES: Record<number, string> = {
  1: 'Fin de la pobreza',
  2: 'Hambre cero',
  3: 'Salud y bienestar',
  4: 'Educación de calidad',
  5: 'Igualdad de género',
  6: 'Agua limpia y saneamiento',
  7: 'Energía asequible y no contaminante',
  8: 'Trabajo decente y crecimiento económico',
  9: 'Industria, innovación e infraestructura',
  10: 'Reducción de las desigualdades',
  11: 'Ciudades y comunidades sostenibles',
  12: 'Producción y consumo responsables',
  13: 'Acción por el clima',
  14: 'Vida submarina',
  15: 'Vida de ecosistemas terrestres',
  16: 'Paz, justicia e instituciones sólidas',
  17: 'Alianzas para lograr los objetivos',
}

const ODS_COLORS: Record<number, string> = {
  1: '#E5243B', 2: '#DDA63A', 3: '#4C9F38', 4: '#C5192D', 5: '#FF3A21',
  6: '#26BDE2', 7: '#FCC30B', 8: '#A21942', 9: '#FD6925', 10: '#DD1367',
  11: '#FD9D24', 12: '#BF8B2E', 13: '#3F7E44', 14: '#0A97D9', 15: '#56C02B',
  16: '#00689D', 17: '#19486A',
}

const categoryLabels: Record<string, { label: string; color: string }> = {
  output: { label: 'Output', color: '#1F77F6' },
  outcome: { label: 'Outcome', color: '#DA4E24' },
  impact: { label: 'Impacto', color: '#1F77F6' },
}

const progressColor = (pct: number) => {
  if (pct >= 70) return '#1F77F6'
  if (pct >= 40) return '#2A222B'
  return '#DC2626'
}

const ACCENT = '#1F77F6'

export default function ImpactMetrics({ userId, onComplete, onGenerateReport }: ToolComponentProps) {
  const [data, setData] = useToolState<Data>(userId, 'impact-metrics', DEFAULT)
  const [saved, setSaved] = useState(false)

  const toggleODS = (n: number) => {
    setData(p => ({
      ...p,
      ods_alignment: p.ods_alignment.includes(n) ? p.ods_alignment.filter(x => x !== n) : [...p.ods_alignment, n].sort((a, b) => a - b),
    }))
  }

  const updateMetric = (i: number, field: keyof Metric, value: string | number) => {
    setData(p => {
      const metrics = [...p.metrics]
      metrics[i] = { ...metrics[i], [field]: value }
      return { ...p, metrics }
    })
  }

  const addMetric = () => setData(p => ({ ...p, metrics: [...p.metrics, emptyMetric()] }))
  const removeMetric = (i: number) => setData(p => ({ ...p, metrics: p.metrics.filter((_, idx) => idx !== i) }))

  const metricProgress = (m: Metric) => {
    const range = m.target - m.baseline
    if (range === 0) return 0
    return Math.min(Math.max(Math.round(((m.current - m.baseline) / range) * 100), 0), 100)
  }

  const handleSave = () => { setSaved(true); setTimeout(() => setSaved(false), 2000) }

  // Progress: count filled sections
  const filledSections = [
    data.ods_alignment.length > 0,
    data.impact_thesis.trim().length > 0,
    data.theory_of_change.trim().length > 0,
    data.metrics.some(m => m.name.trim().length > 0),
  ].filter(Boolean).length

  const handleReport = () => {
    const content = `
MARCO DE MEDICIÓN DE IMPACTO

ODS ALINEADOS: ${data.ods_alignment.length > 0 ? data.ods_alignment.map(n => `ODS ${n} — ${ODS_NAMES[n]}`).join(', ') : '(Ninguno seleccionado)'}

TESIS DE IMPACTO:
${data.impact_thesis || '(No completado)'}

TEORÍA DEL CAMBIO:
${data.theory_of_change || '(No completado)'}

MÉTRICAS DE IMPACTO:
${data.metrics.map((m, i) => `${i + 1}. ${m.name || '(Sin nombre)'} [${categoryLabels[m.category].label}]
   Descripción: ${m.description || '(No completado)'}
   Baseline: ${m.baseline} ${m.unit} → Meta: ${m.target} ${m.unit} → Actual: ${m.current} ${m.unit} (${metricProgress(m)}%)
   Método de medición: ${m.measurement_method || '(No definido)'}`).join('\n\n')}
    `.trim()
    onGenerateReport(content)
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
      <ToolProgress filled={filledSections} total={4} accentColor={ACCENT} />

      {/* ODS Alignment */}
      <ToolSection
        number={1}
        title="Alineación con los ODS"
        subtitle="Selecciona los Objetivos de Desarrollo Sostenible relevantes"
        insight="Mide impacto con la misma rigurosidad que mides revenue. tCO2eq reducidas, vidas impactadas, empleos creados — los inversores de impacto exigen datos."
        insightSource="GIIN Impact Measurement Framework"
        defaultOpen
        accentColor={ACCENT}
      >
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: '0.5rem' }}>
          {Array.from({ length: 17 }, (_, i) => i + 1).map(n => {
            const selected = data.ods_alignment.includes(n)
            return (
              <label key={n} style={{
                display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.5rem 0.75rem', borderRadius: 8,
                border: `1.5px solid ${selected ? ODS_COLORS[n] : 'var(--color-border)'}`,
                background: selected ? `${ODS_COLORS[n]}10` : 'var(--color-bg-primary)',
                cursor: 'pointer', transition: 'all 0.15s',
              }}>
                <input type="checkbox" checked={selected} onChange={() => toggleODS(n)} style={{ accentColor: ODS_COLORS[n] }} />
                <span style={{
                  fontFamily: 'var(--font-body)', fontSize: '0.6875rem', fontWeight: 700,
                  color: ODS_COLORS[n], minWidth: 30,
                }}>ODS {n}</span>
                <span style={{ fontFamily: 'var(--font-body)', fontSize: '0.75rem', color: 'var(--color-text-secondary)', lineHeight: 1.3 }}>{ODS_NAMES[n]}</span>
              </label>
            )
          })}
        </div>
      </ToolSection>

      {/* Impact thesis */}
      <ToolSection
        number={2}
        title="Tesis de impacto"
        subtitle="Define el cambio positivo que genera tu startup"
        accentColor={ACCENT}
      >
        <textarea value={data.impact_thesis} onChange={e => setData(p => ({ ...p, impact_thesis: e.target.value }))} placeholder="¿Cuál es el cambio positivo que tu startup genera en el mundo? Describe tu tesis de impacto en 2-3 párrafos." rows={5} style={textareaStyle} />
      </ToolSection>

      {/* Theory of change */}
      <ToolSection
        number={3}
        title="Teoría del cambio"
        subtitle="Describe la cadena causal de actividades a impacto"
        accentColor={ACCENT}
      >
        <textarea value={data.theory_of_change} onChange={e => setData(p => ({ ...p, theory_of_change: e.target.value }))} placeholder="Describe la cadena causal: ¿cómo tus actividades llevan a outputs, outcomes y finalmente al impacto deseado?" rows={5} style={textareaStyle} />
      </ToolSection>

      {/* Metrics */}
      <ToolSection
        number={4}
        title="Métricas de impacto"
        subtitle="Define métricas cuantificables con baseline, meta y progreso"
        accentColor={ACCENT}
      >
        {data.metrics.map((m, i) => {
          const pct = metricProgress(m)
          const catInfo = categoryLabels[m.category]
          return (
            <div key={i} style={{ padding: '1rem', borderRadius: 10, border: '1px solid var(--color-border)', marginBottom: '0.75rem', background: 'var(--color-bg-primary)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <span style={{ ...labelStyle, marginBottom: 0 }}>Métrica {i + 1}</span>
                  <span style={{ padding: '0.15rem 0.5rem', borderRadius: 8, background: `${catInfo.color}15`, color: catInfo.color, fontFamily: 'var(--font-body)', fontSize: '0.625rem', fontWeight: 700, textTransform: 'uppercase' }}>{catInfo.label}</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <span style={{ fontFamily: 'var(--font-body)', fontSize: '0.75rem', fontWeight: 700, color: progressColor(pct) }}>{pct}%</span>
                  {data.metrics.length > 1 && (
                    <button onClick={() => removeMetric(i)} style={{ ...btnSmall, color: '#DC2626', borderColor: '#DC262630', padding: '0.2rem 0.4rem' }}><Trash2 size={11} /></button>
                  )}
                </div>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '0.625rem', marginBottom: '0.5rem' }}>
                <input value={m.name} onChange={e => updateMetric(i, 'name', e.target.value)} placeholder="Nombre de la métrica" style={inputStyle} />
                <select value={m.category} onChange={e => updateMetric(i, 'category', e.target.value)} style={inputStyle}>
                  <option value="output">Output</option>
                  <option value="outcome">Outcome</option>
                  <option value="impact">Impacto</option>
                </select>
              </div>
              <textarea value={m.description} onChange={e => updateMetric(i, 'description', e.target.value)} placeholder="Descripción de la métrica" rows={2} style={{ ...textareaStyle, marginBottom: '0.5rem' }} />
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr 1fr', gap: '0.5rem', marginBottom: '0.5rem' }}>
                <div>
                  <label style={{ ...labelStyle, fontSize: '0.6875rem' }}>Baseline</label>
                  <input type="number" value={m.baseline || ''} onChange={e => updateMetric(i, 'baseline', Number(e.target.value))} placeholder="0" style={inputStyle} />
                </div>
                <div>
                  <label style={{ ...labelStyle, fontSize: '0.6875rem' }}>Meta</label>
                  <input type="number" value={m.target || ''} onChange={e => updateMetric(i, 'target', Number(e.target.value))} placeholder="0" style={inputStyle} />
                </div>
                <div>
                  <label style={{ ...labelStyle, fontSize: '0.6875rem' }}>Actual</label>
                  <input type="number" value={m.current || ''} onChange={e => updateMetric(i, 'current', Number(e.target.value))} placeholder="0" style={inputStyle} />
                </div>
                <div>
                  <label style={{ ...labelStyle, fontSize: '0.6875rem' }}>Unidad</label>
                  <input value={m.unit} onChange={e => updateMetric(i, 'unit', e.target.value)} placeholder="Ej: ton CO2" style={inputStyle} />
                </div>
              </div>
              <input value={m.measurement_method} onChange={e => updateMetric(i, 'measurement_method', e.target.value)} placeholder="Método de medición" style={{ ...inputStyle, marginBottom: '0.5rem' }} />
              {/* Progress bar */}
              <div style={{ height: 8, borderRadius: 4, background: 'var(--color-bg-muted)', overflow: 'hidden' }}>
                <div style={{ height: '100%', width: `${pct}%`, borderRadius: 4, background: progressColor(pct), transition: 'width 0.3s' }} />
              </div>
            </div>
          )
        })}
        <button onClick={addMetric} style={{ ...btnSmall, color: ACCENT, borderColor: `${ACCENT}30` }}><Plus size={12} /> Agregar métrica</button>
      </ToolSection>

      <ToolActionBar onSave={handleSave} onComplete={onComplete} onReport={handleReport} saved={saved} accentColor={ACCENT} />
    </div>
  )
}
