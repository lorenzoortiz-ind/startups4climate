'use client'

import { useState } from 'react'
import { Unlock } from 'lucide-react'
import { useToolState } from '@/lib/useToolState'
import { supabase } from '@/lib/supabase'
import { useAuth } from '@/context/AuthContext'
import type { ToolComponentProps } from './ToolPage'
import {
  ToolSection, ToolActionBar, ToolProgress,
  inputStyle, textareaStyle, labelStyle,
} from './shared'

interface Data {
  problem: string
  problemEvidence: string
  customer: string
  problemFrequency: 'Diaria' | 'Semanal' | 'Mensual' | 'Esporádica'
  currentSolutions: string
  hypothesis: string
  whyUs: string
  riskiestAssumption: string
}

const FREQUENCY_OPTIONS = ['Diaria', 'Semanal', 'Mensual', 'Esporádica'] as const

const DEFAULT: Data = {
  problem: '',
  problemEvidence: '',
  customer: '',
  problemFrequency: 'Semanal',
  currentSolutions: '',
  hypothesis: '',
  whyUs: '',
  riskiestAssumption: '',
}

const ACCENT = '#16A34A'

export default function InitialIdea({ userId, onComplete, onGenerateReport }: ToolComponentProps) {
  const [data, setData] = useToolState<Data>(userId, 'initial-idea', DEFAULT)
  const [saved, setSaved] = useState(false)
  const [unlocking, setUnlocking] = useState(false)
  const { refreshUser } = useAuth()

  const fields: (keyof Data)[] = [
    'problem', 'problemEvidence', 'customer', 'currentSolutions',
    'hypothesis', 'whyUs', 'riskiestAssumption',
  ]
  const filledCount = fields.filter(f => (data[f] as string).trim()).length

  const handleComplete = async () => {
    onComplete()

    setUnlocking(true)
    try {
      const { error } = await supabase
        .from('profiles')
        .update({ stage: 'pre-incubacion' })
        .eq('id', userId)

      if (error) {
        console.error('[S4C Sync] Error unlocking Pre-incubación:', error)
      } else {
        // Refresh AuthContext so the new stage is reflected immediately
        await refreshUser()
      }
    } catch (err) {
      console.error('[S4C Sync] Error unlocking Pre-incubación:', err)
    } finally {
      setUnlocking(false)
    }
  }

  const handleReport = () => {
    const content = `
IDEA INICIAL

PROBLEMA: ${data.problem || '(No completado)'}
  Evidencia: ${data.problemEvidence || '(Sin evidencia documentada)'}

CLIENTE: ${data.customer || '(No completado)'}
  Frecuencia del problema: ${data.problemFrequency}
  Soluciones actuales: ${data.currentSolutions || '(No completado)'}

HIPÓTESIS DE SOLUCIÓN: ${data.hypothesis || '(No completada)'}
  Por qué nosotros: ${data.whyUs || '(No completado)'}

SUPUESTO MÁS RIESGOSO: ${data.riskiestAssumption || '(No identificado)'}
`.trim()
    onGenerateReport(content)
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
      <ToolProgress filled={filledCount} total={fields.length} accentColor={ACCENT} />

      <div style={{
        padding: '1rem 1.25rem', borderRadius: 12,
        background: `${ACCENT}08`, border: `1px solid ${ACCENT}25`,
        display: 'flex', gap: '0.875rem', alignItems: 'flex-start',
      }}>
        <Unlock size={20} color={ACCENT} style={{ flexShrink: 0, marginTop: 2 }} />
        <div>
          <div style={{ fontFamily: 'var(--font-heading)', fontSize: '0.875rem', fontWeight: 700, color: ACCENT, marginBottom: '0.25rem' }}>
            Esta herramienta desbloquea Pre-incubación
          </div>
          <div style={{ fontFamily: 'var(--font-body)', fontSize: '0.8125rem', color: 'var(--color-text-secondary)', lineHeight: 1.5 }}>
            Al completarla, el módulo de Pre-incubación se activa y tu hipótesis de problema y cliente se pre-carga en las primeras herramientas.
          </div>
        </div>
      </div>

      <ToolSection
        number={1}
        title="El problema"
        subtitle="Específico, desde la perspectiva del afectado"
        insight="DE Step 0 (Aulet): el problema debe ser articulado desde el punto de vista del afectado, con evidencia de entrevistas reales. Un problema sin evidencia es solo una hipótesis."
        insightSource="Disciplined Entrepreneurship Step 0 — Bill Aulet, MIT"
        defaultOpen={true}
        accentColor={ACCENT}
      >
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
          <div>
            <label style={labelStyle}>Describe el problema (1-2 oraciones, desde el afectado)</label>
            <textarea
              value={data.problem}
              onChange={e => setData(p => ({ ...p, problem: e.target.value }))}
              placeholder="Los pequeños agricultores de café en regiones remotas de Perú pierden entre 20-35% de su ingreso potencial porque no tienen acceso a precios de mercado en tiempo real al momento de negociar con intermediarios."
              style={{ ...textareaStyle, minHeight: 80 }}
            />
          </div>
          <div>
            <label style={labelStyle}>Evidencia de entrevistas que lo confirma</label>
            <textarea
              value={data.problemEvidence}
              onChange={e => setData(p => ({ ...p, problemEvidence: e.target.value }))}
              placeholder='Citas o hallazgos concretos de tus entrevistas. Ej: "En 4 de 5 entrevistas, los agricultores mencionaron que el intermediario siempre llega con el precio ya decidido y ellos no tienen con qué comparar."'
              style={{ ...textareaStyle, minHeight: 80 }}
            />
          </div>
        </div>
      </ToolSection>

      <ToolSection
        number={2}
        title="El cliente"
        subtitle="¿Quién sufre este problema? ¿Con qué frecuencia?"
        defaultOpen={true}
        accentColor={ACCENT}
      >
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
          <div>
            <label style={labelStyle}>Descripción del afectado principal</label>
            <input
              value={data.customer}
              onChange={e => setData(p => ({ ...p, customer: e.target.value }))}
              placeholder="Ej: Agricultor de café en comunidades rurales de Perú/Colombia/Bolivia, sin acceso a internet estable, vende a intermediarios 2-4 veces por año."
              style={inputStyle}
            />
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
            <div>
              <label style={labelStyle}>Frecuencia del problema</label>
              <select
                value={data.problemFrequency}
                onChange={e => setData(p => ({ ...p, problemFrequency: e.target.value as Data['problemFrequency'] }))}
                style={{ ...inputStyle, cursor: 'pointer' }}
              >
                {FREQUENCY_OPTIONS.map(f => <option key={f} value={f}>{f}</option>)}
              </select>
            </div>
            <div>
              <label style={labelStyle}>Soluciones actuales que usa (aunque sean malas)</label>
              <input
                value={data.currentSolutions}
                onChange={e => setData(p => ({ ...p, currentSolutions: e.target.value }))}
                placeholder="¿Cómo resuelve hoy el problema?"
                style={inputStyle}
              />
            </div>
          </div>
        </div>
      </ToolSection>

      <ToolSection
        number={3}
        title="Hipótesis de solución"
        subtitle="¿Qué harías diferente? ¿Por qué tú?"
        defaultOpen={true}
        accentColor={ACCENT}
      >
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
          <div>
            <label style={labelStyle}>¿Qué harías diferente? (1-2 oraciones)</label>
            <textarea
              value={data.hypothesis}
              onChange={e => setData(p => ({ ...p, hypothesis: e.target.value }))}
              placeholder="Una app offline-first que proporciona precios de mercado en tiempo real via SMS y permite a los agricultores comparar antes de negociar, sin necesitar internet."
              style={{ ...textareaStyle, minHeight: 70 }}
            />
          </div>
          <div>
            <label style={labelStyle}>¿Por qué tú? ¿Qué ventaja tienes para resolver esto?</label>
            <textarea
              value={data.whyUs}
              onChange={e => setData(p => ({ ...p, whyUs: e.target.value }))}
              placeholder="Conocimiento del territorio (crecí en comunidad agrícola), red de contacto con 3 cooperativas en Ucayali, experiencia técnica en apps de bajo ancho de banda."
              style={{ ...textareaStyle, minHeight: 70 }}
            />
          </div>
        </div>
      </ToolSection>

      <ToolSection
        number={4}
        title="Supuesto más riesgoso"
        subtitle="La cosa más crítica que debes confirmar antes de seguir"
        insight="Lean Startup (Ries): identifica el supuesto que, si resultase falso, hundiría toda la hipótesis. Ese es el que debes testar primero en Pre-incubación."
        insightSource="Lean Startup — Eric Ries"
        defaultOpen={true}
        accentColor={ACCENT}
      >
        <textarea
          value={data.riskiestAssumption}
          onChange={e => setData(p => ({ ...p, riskiestAssumption: e.target.value }))}
          placeholder="Ej: Que los agricultores están dispuestos a pagar $3/mes por acceso a precios de mercado en tiempo real, y que tienen el modelo mental para usar una app de consulta antes de negociar."
          style={{ ...textareaStyle, minHeight: 90 }}
        />
      </ToolSection>

      <ToolActionBar
        onSave={() => { setSaved(true); setTimeout(() => setSaved(false), 2000) }}
        onComplete={handleComplete}
        onReport={handleReport}
        saved={saved || unlocking}
        accentColor={ACCENT}
      />
    </div>
  )
}
