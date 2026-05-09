'use client'

import { useToolState } from '@/lib/useToolState'
import { ToolSection, ToolActionBar, inputStyle, textareaStyle, labelStyle } from '@/components/tools/shared'
import { PlusCircle, Trash2, FlaskConical } from 'lucide-react'

const ACCENT = '#1F77F6'

interface Experiment {
  id: string
  hypothesis: string
  action: string
  metric: string
  successCriteria: string
  failureCriteria: string
  sampleSize: string
  duration: string
  status: 'design' | 'running' | 'completed'
  results: string
  learning: string
  changedMVBP: boolean
}

interface Data {
  assumptionSource: string
  experiments: Experiment[]
}

function newExperiment(): Experiment {
  return {
    id: Math.random().toString(36).slice(2),
    hypothesis: '',
    action: '',
    metric: '',
    successCriteria: '',
    failureCriteria: '',
    sampleSize: '',
    duration: '',
    status: 'design',
    results: '',
    learning: '',
    changedMVBP: false,
  }
}

const DEFAULT: Data = {
  assumptionSource: '',
  experiments: [newExperiment(), newExperiment(), newExperiment()],
}

interface Props {
  userId: string
  onComplete: () => void
  onGenerateReport: (content: string) => void
}

export default function KeyExperiments({ userId, onComplete, onGenerateReport }: Props) {
  const [data, setData] = useToolState<Data>(userId, 'key-experiments', DEFAULT)

  function update(field: keyof Data, value: string) {
    setData((prev) => ({ ...prev, [field]: value }))
  }

  function updateExp(id: string, field: keyof Experiment, value: string | boolean) {
    setData((prev) => ({
      ...prev,
      experiments: prev.experiments.map((e) =>
        e.id === id ? { ...e, [field]: value } : e,
      ),
    }))
  }

  function addExperiment() {
    setData((prev) => ({ ...prev, experiments: [...prev.experiments, newExperiment()] }))
  }

  function removeExperiment(id: string) {
    if (data.experiments.length <= 3) return
    setData((prev) => ({ ...prev, experiments: prev.experiments.filter((e) => e.id !== id) }))
  }

  function handleReport() {
    const lines: string[] = ['DISEÑO DE EXPERIMENTOS — DE Step 21\n']
    if (data.assumptionSource.trim()) {
      lines.push(`Supuestos de base (04.1):\n${data.assumptionSource}\n`)
    }
    data.experiments.forEach((exp, i) => {
      lines.push(`────────────────────────────`)
      lines.push(`EXPERIMENTO ${i + 1} [${exp.status.toUpperCase()}]`)
      lines.push(`Hipótesis: ${exp.hypothesis}`)
      lines.push(`Experimento: ${exp.action}`)
      lines.push(`Métrica: ${exp.metric}`)
      lines.push(`Criterio de éxito: ${exp.successCriteria}`)
      lines.push(`Criterio de fracaso: ${exp.failureCriteria}`)
      lines.push(`Muestra mínima: ${exp.sampleSize}`)
      lines.push(`Duración: ${exp.duration}`)
      if (exp.status !== 'design') {
        lines.push(`\nResultados: ${exp.results}`)
        lines.push(`Aprendizaje: ${exp.learning}`)
        lines.push(`¿Cambia el MVBP?: ${exp.changedMVBP ? 'Sí' : 'No'}`)
      }
      lines.push('')
    })
    onGenerateReport(lines.join('\n'))
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      {/* Context banner */}
      <div
        style={{
          padding: '1rem 1.25rem',
          borderRadius: 10,
          border: `1px solid ${ACCENT}30`,
          background: `${ACCENT}08`,
          fontSize: '0.88rem',
          color: 'var(--color-text-secondary)',
          lineHeight: 1.55,
        }}
      >
        <strong style={{ color: ACCENT }}>David Bland — Testing Business Ideas:</strong> Un experimento bien
        diseñado define el criterio de éxito <em>antes</em> de correr el experimento. Sin eso, cualquier
        resultado confirmará lo que ya creías.
      </div>

      {/* Section 1: Reference assumptions from 04.1 */}
      <ToolSection
        number={1}
        title="¿De qué supuestos partes?"
        subtitle="Referencia los 3 supuestos priorizados en Supuestos Clave (04.1)"
        accentColor={ACCENT}
      >
        <div>
          <label style={labelStyle}>Resumen de los 3 supuestos de 04.1 que vas a testar</label>
          <textarea
            style={{ ...textareaStyle, minHeight: 90 }}
            placeholder={
              'Ej: 1) Los restaurantes pagarían $150/mes por automatizar el inventario. ' +
              '2) El gerente de operaciones es el Champion (no el dueño). ' +
              '3) El CAC vía referidos es < $200.'
            }
            value={data.assumptionSource}
            onChange={(e) => update('assumptionSource', e.target.value)}
          />
        </div>
      </ToolSection>

      {/* Section 2: Experiment designs */}
      <ToolSection
        number={2}
        title="Diseña 3 experimentos"
        subtitle="Un experimento por supuesto. Define todos los campos antes de ejecutar."
        accentColor={ACCENT}
      >
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.75rem' }}>
          {data.experiments.map((exp, idx) => (
            <div
              key={exp.id}
              style={{
                padding: '1.5rem',
                borderRadius: 12,
                border: '1px solid rgba(255,255,255,0.08)',
                background: 'rgba(255,255,255,0.02)',
                display: 'flex',
                flexDirection: 'column',
                gap: '1rem',
              }}
            >
              {/* Header */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span
                  style={{
                    fontFamily: 'var(--font-heading)',
                    fontSize: '0.95rem',
                    fontWeight: 600,
                    color: ACCENT,
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.4rem',
                  }}
                >
                  <FlaskConical size={15} strokeWidth={2} />
                  Experimento {idx + 1}
                </span>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <select
                    style={{ ...inputStyle, width: 'auto', cursor: 'pointer', padding: '6px 10px' }}
                    value={exp.status}
                    onChange={(e) => updateExp(exp.id, 'status', e.target.value)}
                  >
                    <option value="design">En diseño</option>
                    <option value="running">En ejecución</option>
                    <option value="completed">Completado</option>
                  </select>
                  {data.experiments.length > 3 && (
                    <button
                      onClick={() => removeExperiment(exp.id)}
                      style={{
                        background: 'none',
                        border: 'none',
                        color: 'var(--color-text-muted)',
                        cursor: 'pointer',
                        padding: 4,
                        display: 'flex',
                      }}
                      title="Eliminar experimento"
                    >
                      <Trash2 size={14} />
                    </button>
                  )}
                </div>
              </div>

              {/* Hypothesis & action */}
              <div>
                <label style={labelStyle}>Hipótesis — &quot;Creemos que...&quot;</label>
                <textarea
                  style={{ ...textareaStyle, minHeight: 60 }}
                  placeholder="Creemos que los gerentes de restaurante pagarían $150/mes para eliminar las pérdidas por inventario mal controlado."
                  value={exp.hypothesis}
                  onChange={(e) => updateExp(exp.id, 'hypothesis', e.target.value)}
                />
              </div>
              <div>
                <label style={labelStyle}>Experimento — &quot;Para validarlo, haremos...&quot;</label>
                <textarea
                  style={{ ...textareaStyle, minHeight: 60 }}
                  placeholder="Ofreceremos 10 demostraciones con propuesta de precio real ($150/mes) a gerentes de restaurante en Lima, sin descuento introductorio."
                  value={exp.action}
                  onChange={(e) => updateExp(exp.id, 'action', e.target.value)}
                />
              </div>

              {/* 2-column grid */}
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: '1fr 1fr',
                  gap: '1rem',
                }}
              >
                <div>
                  <label style={labelStyle}>Métrica</label>
                  <input
                    type="text"
                    style={inputStyle}
                    placeholder="% de asistentes que solicitan contrato"
                    value={exp.metric}
                    onChange={(e) => updateExp(exp.id, 'metric', e.target.value)}
                  />
                </div>
                <div>
                  <label style={labelStyle}>Muestra mínima</label>
                  <input
                    type="text"
                    style={inputStyle}
                    placeholder="10 demostraciones"
                    value={exp.sampleSize}
                    onChange={(e) => updateExp(exp.id, 'sampleSize', e.target.value)}
                  />
                </div>
                <div>
                  <label style={labelStyle}>Criterio de ÉXITO (definir antes)</label>
                  <input
                    type="text"
                    style={inputStyle}
                    placeholder="3 de 10 solicitan contrato (30%+)"
                    value={exp.successCriteria}
                    onChange={(e) => updateExp(exp.id, 'successCriteria', e.target.value)}
                  />
                </div>
                <div>
                  <label style={labelStyle}>Criterio de FRACASO (definir antes)</label>
                  <input
                    type="text"
                    style={inputStyle}
                    placeholder="Menos de 1 de 10 solicita contrato (<10%)"
                    value={exp.failureCriteria}
                    onChange={(e) => updateExp(exp.id, 'failureCriteria', e.target.value)}
                  />
                </div>
                <div>
                  <label style={labelStyle}>Duración del experimento</label>
                  <input
                    type="text"
                    style={inputStyle}
                    placeholder="2 semanas"
                    value={exp.duration}
                    onChange={(e) => updateExp(exp.id, 'duration', e.target.value)}
                  />
                </div>
              </div>

              {/* Results section — visible when running or completed */}
              {exp.status !== 'design' && (
                <div
                  style={{
                    paddingTop: '1rem',
                    borderTop: '1px solid rgba(255,255,255,0.07)',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '1rem',
                  }}
                >
                  <p
                    style={{
                      fontFamily: 'var(--font-body)',
                      fontSize: '0.78rem',
                      color: ACCENT,
                      fontWeight: 600,
                      margin: 0,
                      textTransform: 'uppercase',
                      letterSpacing: '0.05em',
                    }}
                  >
                    Resultados
                  </p>
                  <div>
                    <label style={labelStyle}>¿Qué pasó? (datos reales)</label>
                    <textarea
                      style={{ ...textareaStyle, minHeight: 70 }}
                      placeholder="Hicimos 10 demos. 4 solicitaron contrato (40%). 2 pidieron bajar precio a $100."
                      value={exp.results}
                      onChange={(e) => updateExp(exp.id, 'results', e.target.value)}
                    />
                  </div>
                  <div>
                    <label style={labelStyle}>¿Qué aprendiste?</label>
                    <textarea
                      style={{ ...textareaStyle, minHeight: 70 }}
                      placeholder="El supuesto se confirma: hay disposición a pagar. El segmento más receptivo: restaurantes de 20+ mesas. Los de <10 mesas no ven suficiente problema."
                      value={exp.learning}
                      onChange={(e) => updateExp(exp.id, 'learning', e.target.value)}
                    />
                  </div>
                  <label
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.6rem',
                      cursor: 'pointer',
                      fontFamily: 'var(--font-body)',
                      fontSize: '0.88rem',
                      color: 'var(--color-text-secondary)',
                    }}
                  >
                    <input
                      type="checkbox"
                      checked={exp.changedMVBP}
                      onChange={(e) => updateExp(exp.id, 'changedMVBP', e.target.checked)}
                      style={{ cursor: 'pointer', accentColor: ACCENT }}
                    />
                    Este resultado cambia el alcance del MVBP o el modelo de negocio
                  </label>
                </div>
              )}
            </div>
          ))}

          {/* Add experiment button */}
          <button
            onClick={addExperiment}
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '0.5rem',
              background: 'none',
              border: `1px dashed ${ACCENT}50`,
              borderRadius: 10,
              padding: '0.75rem 1.25rem',
              color: ACCENT,
              cursor: 'pointer',
              fontSize: '0.88rem',
              fontFamily: 'var(--font-body)',
              width: '100%',
              transition: 'border-color 0.15s',
            }}
          >
            <PlusCircle size={15} />
            Agregar experimento adicional
          </button>
        </div>
      </ToolSection>

      <ToolActionBar
        onComplete={onComplete}
        onReport={handleReport}
        accentColor={ACCENT}
      />
    </div>
  )
}
