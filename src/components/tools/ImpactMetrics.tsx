'use client'

import { useState } from 'react'
import { ChevronDown, Save, CheckCircle2, FileText, Plus, Trash2 } from 'lucide-react'
import { useToolState } from '@/lib/useToolState'
import type { ToolComponentProps } from './ToolPage'

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
  output: { label: 'Output', color: '#0891B2' },
  outcome: { label: 'Outcome', color: '#7C3AED' },
  impact: { label: 'Impacto', color: '#0D9488' },
}

const progressColor = (pct: number) => {
  if (pct >= 70) return '#0D9488'
  if (pct >= 40) return '#D97706'
  return '#DC2626'
}

export default function ImpactMetrics({ userId, onComplete, onGenerateReport }: ToolComponentProps) {
  const [data, setData] = useToolState<Data>(userId, 'impact-metrics', DEFAULT)
  const [openSections, setOpenSections] = useState<Record<string, boolean>>({})
  const [saved, setSaved] = useState(false)

  const toggle = (k: string) => setOpenSections(p => ({ ...p, [k]: !p[k] }))

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
      {/* ODS Alignment */}
      <SectionCollapsible title="Alineación con los ODS" sectionKey="ods" open={openSections} toggle={toggle}>
        <p style={{ fontFamily: 'var(--font-body)', fontSize: '0.8125rem', color: 'var(--color-text-muted)', marginBottom: '0.75rem' }}>
          Selecciona los Objetivos de Desarrollo Sostenible con los que se alinea tu startup.
        </p>
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
                  fontFamily: 'var(--font-mono)', fontSize: '0.6875rem', fontWeight: 700,
                  color: ODS_COLORS[n], minWidth: 30,
                }}>ODS {n}</span>
                <span style={{ fontFamily: 'var(--font-body)', fontSize: '0.75rem', color: 'var(--color-text-secondary)', lineHeight: 1.3 }}>{ODS_NAMES[n]}</span>
              </label>
            )
          })}
        </div>
      </SectionCollapsible>

      {/* Impact thesis */}
      <SectionCollapsible title="Tesis de impacto" sectionKey="thesis" open={openSections} toggle={toggle}>
        <textarea value={data.impact_thesis} onChange={e => setData(p => ({ ...p, impact_thesis: e.target.value }))} placeholder="¿Cuál es el cambio positivo que tu startup genera en el mundo? Describe tu tesis de impacto en 2-3 párrafos." rows={5} style={taStyle} />
      </SectionCollapsible>

      {/* Theory of change */}
      <SectionCollapsible title="Teoría del cambio" sectionKey="toc" open={openSections} toggle={toggle}>
        <textarea value={data.theory_of_change} onChange={e => setData(p => ({ ...p, theory_of_change: e.target.value }))} placeholder="Describe la cadena causal: ¿cómo tus actividades llevan a outputs, outcomes y finalmente al impacto deseado?" rows={5} style={taStyle} />
      </SectionCollapsible>

      {/* Metrics */}
      <SectionCollapsible title="Métricas de impacto" sectionKey="metrics" open={openSections} toggle={toggle}>
        {data.metrics.map((m, i) => {
          const pct = metricProgress(m)
          const catInfo = categoryLabels[m.category]
          return (
            <div key={i} style={{ padding: '1rem', borderRadius: 10, border: '1px solid var(--color-border)', marginBottom: '0.75rem', background: 'var(--color-bg-primary)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <span style={{ fontFamily: 'var(--font-heading)', fontSize: '0.8125rem', fontWeight: 700, color: 'var(--color-text-secondary)' }}>Métrica {i + 1}</span>
                  <span style={{ padding: '0.15rem 0.5rem', borderRadius: 9999, background: `${catInfo.color}15`, color: catInfo.color, fontFamily: 'var(--font-mono)', fontSize: '0.625rem', fontWeight: 700, textTransform: 'uppercase' }}>{catInfo.label}</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.75rem', fontWeight: 700, color: progressColor(pct) }}>{pct}%</span>
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
              <textarea value={m.description} onChange={e => updateMetric(i, 'description', e.target.value)} placeholder="Descripción de la métrica" rows={2} style={{ ...taStyle, marginBottom: '0.5rem' }} />
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
                  <input value={m.unit} onChange={e => updateMetric(i, 'unit', e.target.value)} placeholder="Ej: ton CO₂" style={inputStyle} />
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
        <button onClick={addMetric} style={{ ...btnSmall, color: '#0D9488', borderColor: '#0D948830' }}><Plus size={12} /> Agregar métrica</button>
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

const labelStyle: React.CSSProperties = {
  fontFamily: 'var(--font-heading)', fontSize: '0.75rem', fontWeight: 600,
  color: 'var(--color-text-secondary)', display: 'block', marginBottom: '0.25rem',
}

const btnSmall: React.CSSProperties = {
  display: 'inline-flex', alignItems: 'center', gap: '0.3rem',
  padding: '0.35rem 0.75rem', borderRadius: 6, fontSize: '0.75rem',
  fontFamily: 'var(--font-body)', fontWeight: 600, background: 'transparent',
  border: '1px solid var(--color-border)', cursor: 'pointer',
}

const btnOutlineGreen: React.CSSProperties = {
  display: 'flex', alignItems: 'center', gap: '0.5rem',
  padding: '0.75rem 1.25rem', borderRadius: 10,
  fontFamily: 'var(--font-body)', fontSize: '0.875rem', fontWeight: 600,
  background: 'transparent', color: '#0D9488',
  border: '1.5px solid #0D948840', cursor: 'pointer',
}

const btnSolidGreen: React.CSSProperties = {
  display: 'flex', alignItems: 'center', gap: '0.5rem',
  padding: '0.75rem 1.25rem', borderRadius: 10,
  fontFamily: 'var(--font-body)', fontSize: '0.875rem', fontWeight: 600,
  background: '#0D9488', color: 'white',
  border: 'none', cursor: 'pointer', boxShadow: '0 2px 8px rgba(13,148,136,0.3)',
}

const btnOutline: React.CSSProperties = {
  display: 'flex', alignItems: 'center', gap: '0.5rem',
  padding: '0.75rem 1.25rem', borderRadius: 10,
  fontFamily: 'var(--font-body)', fontSize: '0.875rem', fontWeight: 600,
  background: 'transparent', color: 'var(--color-text-secondary)',
  border: '1.5px solid var(--color-border)', cursor: 'pointer',
}
