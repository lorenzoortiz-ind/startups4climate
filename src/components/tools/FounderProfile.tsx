'use client'

import { useState } from 'react'
import { useToolState } from '@/lib/useToolState'
import type { ToolComponentProps } from './ToolPage'
import {
  ToolSection,
  ToolActionBar,
  ToolProgress,
  inputStyle,
  textareaStyle,
  labelStyle,
  btnSmall,
} from './shared'

/* ─── Types ─────────────────────────────────────────────────────── */

interface FounderEntry {
  name: string
  role: string          // CEO, CTO, COO, CMO, otro
  background: string    // Experiencia previa relevante
  education: string     // Formación académica o autodidacta
}

interface IkigaiEntry {
  passion: string       // Qué te apasiona
  strengths: string     // En qué eres bueno
  marketNeed: string    // Qué necesita el mercado
  monetization: string  // Por qué alguien pagaría
  intersection: string  // La intersección — tu ikigai como founder
}

interface Data {
  founders: FounderEntry[]
  problemConnection: string     // Founder-Problem Fit: historia personal
  livingTheProblem: string      // ¿Has vivido el problema en carne propia?
  ikigai: IkigaiEntry[]         // Uno por founder
  unfairAdvantage: string       // Ventaja injusta del equipo
  whyUs: string                 // Por qué nosotros como equipo
  whyNow: string                // Por qué este momento es el correcto
  complementarity: string       // Cómo se complementan los co-founders (si hay 2)
  selfScore: {
    connection: number          // 1-5: conexión personal con el problema
    expertise: number           // 1-5: experiencia relevante
    network: number             // 1-5: red de contactos en el sector
    timing: number              // 1-5: ventaja por el momento del mercado
  }
}

const DEFAULT_FOUNDER: FounderEntry = {
  name: '',
  role: '',
  background: '',
  education: '',
}

const DEFAULT_IKIGAI: IkigaiEntry = {
  passion: '',
  strengths: '',
  marketNeed: '',
  monetization: '',
  intersection: '',
}

const DEFAULT: Data = {
  founders: [{ ...DEFAULT_FOUNDER }],
  problemConnection: '',
  livingTheProblem: '',
  ikigai: [{ ...DEFAULT_IKIGAI }],
  unfairAdvantage: '',
  whyUs: '',
  whyNow: '',
  complementarity: '',
  selfScore: {
    connection: 0,
    expertise: 0,
    network: 0,
    timing: 0,
  },
}

/* ─── Score pills ────────────────────────────────────────────────── */
const scoreLabels: Record<number, string> = {
  0: '—', 1: 'Bajo', 2: 'Medio-bajo', 3: 'Medio', 4: 'Alto', 5: 'Muy alto',
}

const scoreColor = (v: number) => {
  if (v === 0) return { bg: 'var(--color-bg-primary)', color: 'var(--color-text-muted)' }
  if (v <= 2) return { bg: 'rgba(239,68,68,0.1)', color: '#EF4444' }
  if (v === 3) return { bg: 'rgba(234,179,8,0.12)', color: '#CA8A04' }
  return { bg: 'rgba(22,163,74,0.1)', color: '#16A34A' }
}

function ScoreSelector({
  label,
  sublabel,
  value,
  onChange,
}: {
  label: string
  sublabel: string
  value: number
  onChange: (v: number) => void
}) {
  const { bg, color } = scoreColor(value)
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <span style={{ ...labelStyle, display: 'block' }}>{label}</span>
          <span style={{ fontFamily: 'var(--font-body)', fontSize: '0.75rem', color: 'var(--color-text-muted)' }}>
            {sublabel}
          </span>
        </div>
        <span style={{
          padding: '2px 10px',
          borderRadius: 'var(--radius-full)',
          background: bg,
          color,
          fontFamily: 'var(--font-body)',
          fontSize: '0.75rem',
          fontWeight: 700,
          minWidth: 72,
          textAlign: 'center',
        }}>
          {value > 0 ? `${value}/5 — ${scoreLabels[value]}` : '—'}
        </span>
      </div>
      <div style={{ display: 'flex', gap: '0.375rem' }}>
        {[1, 2, 3, 4, 5].map(n => (
          <button
            key={n}
            type="button"
            onClick={() => onChange(value === n ? 0 : n)}
            style={{
              flex: 1,
              height: 32,
              borderRadius: 8,
              border: `1px solid ${value >= n ? scoreColor(n).color + '60' : 'var(--color-border)'}`,
              background: value >= n ? scoreColor(n).bg : 'var(--color-bg-primary)',
              color: value >= n ? scoreColor(n).color : 'var(--color-text-muted)',
              cursor: 'pointer',
              fontFamily: 'var(--font-body)',
              fontSize: '0.8rem',
              fontWeight: value >= n ? 700 : 400,
              transition: 'all 0.15s ease',
            }}
          >
            {n}
          </button>
        ))}
      </div>
    </div>
  )
}

/* ─── Ikigai visual ──────────────────────────────────────────────── */
function IkigaiDiagram({
  entry,
  founderName,
  onChange,
}: {
  entry: IkigaiEntry
  founderName: string
  onChange: (field: keyof IkigaiEntry, value: string) => void
}) {
  const quadrants: { key: keyof IkigaiEntry; label: string; sublabel: string; placeholder: string; accent: string }[] = [
    {
      key: 'passion',
      label: 'Pasión',
      sublabel: 'Lo que te apasiona y motiva profundamente',
      placeholder: '¿Qué harías aunque no te pagaran? ¿Qué problemas te quitan el sueño en el buen sentido?',
      accent: '#DA4E24',
    },
    {
      key: 'strengths',
      label: 'Fortalezas',
      sublabel: 'En qué eres genuinamente bueno',
      placeholder: '¿Qué habilidades únicas tienes? ¿Qué logros demuestran tu capacidad en este dominio?',
      accent: '#16A34A',
    },
    {
      key: 'marketNeed',
      label: 'Necesidad del mercado',
      sublabel: 'Lo que el mundo realmente necesita',
      placeholder: '¿Qué problema o necesidad sin resolver existe en este mercado? ¿Cuánta gente lo sufre?',
      accent: '#1F77F6',
    },
    {
      key: 'monetization',
      label: 'Potencial de monetización',
      sublabel: 'Por qué alguien pagaría por esto',
      placeholder: '¿Quién pagaría por resolver este problema? ¿Cuánto dolería si no existiera tu solución?',
      accent: '#7C3AED',
    },
  ]

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.875rem' }}>
      {founderName && (
        <div style={{
          fontFamily: 'var(--font-body)',
          fontSize: '0.8rem',
          fontWeight: 700,
          color: 'var(--color-text-muted)',
          textTransform: 'uppercase',
          letterSpacing: '0.08em',
        }}>
          {founderName}
        </div>
      )}

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
        {quadrants.map(q => (
          <div key={q.key} style={{
            padding: '0.875rem',
            borderRadius: 10,
            border: `1px solid ${q.accent}30`,
            background: `${q.accent}08`,
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.375rem', marginBottom: '0.375rem' }}>
              <span style={{
                width: 8,
                height: 8,
                borderRadius: '50%',
                background: q.accent,
                flexShrink: 0,
                display: 'inline-block',
              }} />
              <span style={{ ...labelStyle, color: q.accent }}>{q.label}</span>
            </div>
            <span style={{
              display: 'block',
              fontFamily: 'var(--font-body)',
              fontSize: '0.75rem',
              color: 'var(--color-text-muted)',
              marginBottom: '0.5rem',
            }}>
              {q.sublabel}
            </span>
            <textarea
              value={entry[q.key]}
              onChange={e => onChange(q.key, e.target.value)}
              placeholder={q.placeholder}
              rows={3}
              style={textareaStyle}
            />
          </div>
        ))}
      </div>

      <div style={{
        padding: '0.875rem',
        borderRadius: 10,
        border: '1px solid rgba(124,58,237,0.25)',
        background: 'rgba(124,58,237,0.06)',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.375rem', marginBottom: '0.5rem' }}>
          <span style={{
            padding: '2px 8px',
            borderRadius: 20,
            background: 'rgba(124,58,237,0.12)',
            color: '#7C3AED',
            fontFamily: 'var(--font-body)',
            fontSize: '0.7rem',
            fontWeight: 700,
            textTransform: 'uppercase',
            letterSpacing: '0.08em',
          }}>
            Tu ikigai como founder
          </span>
        </div>
        <textarea
          value={entry.intersection}
          onChange={e => onChange('intersection', e.target.value)}
          placeholder="¿Cuál es la intersección de las 4 dimensiones? Describe en 2-3 oraciones qué te hace único como founder para esta misión específica."
          rows={3}
          style={textareaStyle}
        />
      </div>
    </div>
  )
}

/* ─── Main component ─────────────────────────────────────────────── */
export default function FounderProfile({ userId, onComplete, onGenerateReport }: ToolComponentProps) {
  const [data, setData] = useToolState<Data>(userId, 'founder-profile', DEFAULT)
  const [saved, setSaved] = useState(false)

  /* Helpers */
  const updateFounder = (i: number, field: keyof FounderEntry, value: string) => {
    setData(p => {
      const founders = [...p.founders]
      founders[i] = { ...founders[i], [field]: value }
      // Mantener ikigai en sync con founders (misma cantidad)
      return { ...p, founders }
    })
  }

  const addFounder = () => {
    if (data.founders.length >= 2) return
    setData(p => ({
      ...p,
      founders: [...p.founders, { ...DEFAULT_FOUNDER }],
      ikigai: [...p.ikigai, { ...DEFAULT_IKIGAI }],
    }))
  }

  const removeFounder = () => {
    if (data.founders.length <= 1) return
    setData(p => ({
      ...p,
      founders: p.founders.slice(0, 1),
      ikigai: p.ikigai.slice(0, 1),
    }))
  }

  const updateIkigai = (i: number, field: keyof IkigaiEntry, value: string) => {
    setData(p => {
      const ikigai = [...p.ikigai]
      // Ensure ikigai[i] exists
      while (ikigai.length <= i) ikigai.push({ ...DEFAULT_IKIGAI })
      ikigai[i] = { ...ikigai[i], [field]: value }
      return { ...p, ikigai }
    })
  }

  const updateScore = (field: keyof Data['selfScore'], value: number) => {
    setData(p => ({ ...p, selfScore: { ...p.selfScore, [field]: value } }))
  }

  const handleSave = () => { setSaved(true); setTimeout(() => setSaved(false), 2000) }

  /* Progress */
  const filledCount = [
    data.founders[0]?.name,
    data.founders[0]?.role,
    data.founders[0]?.background,
    data.problemConnection,
    data.ikigai[0]?.passion,
    data.ikigai[0]?.strengths,
    data.ikigai[0]?.intersection,
    data.unfairAdvantage,
    data.whyUs,
    data.whyNow,
    Object.values(data.selfScore).some(v => v > 0) ? 'scored' : '',
  ].filter(Boolean).length

  /* Report */
  const handleReport = () => {
    const scoreAvg = Object.values(data.selfScore).filter(v => v > 0)
    const avgScore = scoreAvg.length > 0
      ? (scoreAvg.reduce((a, b) => a + b, 0) / scoreAvg.length).toFixed(1)
      : '—'

    const content = `
PERFIL DEL FOUNDER

━━━━━━━━━━━━━━━━━━━━━━━━━━━━
EQUIPO FUNDADOR
━━━━━━━━━━━━━━━━━━━━━━━━━━━━
${data.founders.map((f, i) => `
Founder ${i + 1}: ${f.name || '(Sin nombre)'}
  Rol: ${f.role || '(No definido)'}
  Background relevante: ${f.background || '(No completado)'}
  Formación: ${f.education || '(No completado)'}
`).join('')}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━
FOUNDER-PROBLEM FIT
━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Conexión personal con el problema:
${data.problemConnection || '(No completado)'}

¿Has vivido el problema en carne propia?
${data.livingTheProblem || '(No completado)'}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━
IKIGAI DEL FOUNDER
━━━━━━━━━━━━━━━━━━━━━━━━━━━━
${data.founders.map((f, i) => {
  const ik = data.ikigai[i] || DEFAULT_IKIGAI
  return `
${f.name || `Founder ${i + 1}`}:
  Pasión: ${ik.passion || '(No completado)'}
  Fortalezas: ${ik.strengths || '(No completado)'}
  Necesidad del mercado: ${ik.marketNeed || '(No completado)'}
  Monetización: ${ik.monetization || '(No completado)'}
  Ikigai (intersección): ${ik.intersection || '(No completado)'}
`
}).join('')}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━
VENTAJA INJUSTA
━━━━━━━━━━━━━━━━━━━━━━━━━━━━
${data.unfairAdvantage || '(No completado)'}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━
¿POR QUÉ NOSOTROS? ¿POR QUÉ AHORA?
━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Por qué nosotros:
${data.whyUs || '(No completado)'}

Por qué ahora:
${data.whyNow || '(No completado)'}

${data.founders.length > 1 ? `Complementariedad del equipo:
${data.complementarity || '(No completado)'}` : ''}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━
AUTOEVALUACIÓN — FOUNDER-PROBLEM FIT SCORE
━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Conexión personal con el problema: ${data.selfScore.connection}/5 (${scoreLabels[data.selfScore.connection]})
Experiencia/expertise relevante:   ${data.selfScore.expertise}/5 (${scoreLabels[data.selfScore.expertise]})
Red de contactos en el sector:     ${data.selfScore.network}/5 (${scoreLabels[data.selfScore.network]})
Ventaja por timing de mercado:     ${data.selfScore.timing}/5 (${scoreLabels[data.selfScore.timing]})

Promedio: ${avgScore}/5
    `.trim()
    onGenerateReport(content)
  }

  const hasSecondFounder = data.founders.length >= 2

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
      <ToolProgress filled={filledCount} total={11} />

      {/* 1. Equipo fundador */}
      <ToolSection
        number={1}
        title="Equipo fundador"
        subtitle="Máximo 2 founders — quiénes son y qué traen"
        insight="Los inversores de Y Combinator afirman evaluar al equipo antes que la idea en el 90% de los casos. Un perfil fundador bien articulado es tu carta de presentación más importante."
        insightSource="Y Combinator — How to Evaluate Startup Ideas"
        defaultOpen
      >
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {data.founders.map((f, i) => (
            <div key={i} style={{
              padding: '1rem',
              borderRadius: 10,
              border: '1px solid var(--color-border)',
              background: 'var(--color-bg-primary)',
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.875rem' }}>
                <span style={{
                  fontFamily: 'var(--font-heading)',
                  fontSize: '0.875rem',
                  fontWeight: 700,
                  color: i === 0 ? '#DA4E24' : '#1F77F6',
                }}>
                  {i === 0 ? 'Founder principal' : 'Co-founder'}
                </span>
                {i > 0 && (
                  <button onClick={removeFounder} style={{ ...btnSmall, color: '#DC2626', borderColor: '#DC262630' }}>
                    Eliminar co-founder
                  </button>
                )}
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.625rem', marginBottom: '0.625rem' }}>
                <div>
                  <label style={labelStyle}>Nombre completo</label>
                  <input
                    value={f.name}
                    onChange={e => updateFounder(i, 'name', e.target.value)}
                    placeholder="Tu nombre completo"
                    style={inputStyle}
                  />
                </div>
                <div>
                  <label style={labelStyle}>Rol en la startup</label>
                  <input
                    value={f.role}
                    onChange={e => updateFounder(i, 'role', e.target.value)}
                    placeholder="CEO, CTO, COO..."
                    style={inputStyle}
                  />
                </div>
              </div>
              <div style={{ marginBottom: '0.625rem' }}>
                <label style={labelStyle}>Experiencia relevante</label>
                <textarea
                  value={f.background}
                  onChange={e => updateFounder(i, 'background', e.target.value)}
                  placeholder="¿Qué experiencia profesional o personal te convierte en la persona indicada para este problema? Sé específico: industrias, roles, logros concretos."
                  rows={3}
                  style={textareaStyle}
                />
              </div>
              <div>
                <label style={labelStyle}>Formación</label>
                <input
                  value={f.education}
                  onChange={e => updateFounder(i, 'education', e.target.value)}
                  placeholder="Universidad, área de estudio o formación autodidacta relevante"
                  style={inputStyle}
                />
              </div>
            </div>
          ))}

          {!hasSecondFounder && (
            <button
              onClick={addFounder}
              style={{ ...btnSmall, color: '#1F77F6', borderColor: '#1F77F630', alignSelf: 'flex-start' }}
            >
              + Agregar co-founder
            </button>
          )}
        </div>
      </ToolSection>

      {/* 2. Founder-Problem Fit */}
      <ToolSection
        number={2}
        title="Founder-Problem Fit"
        subtitle="Tu historia personal con el problema"
        insight="First Round Capital muestra que los founders con una conexión personal con el problema tienen 2.4x mayor tasa de supervivencia a los 3 años. No es solo motivación — es ventaja informativa."
        insightSource="First Round Capital — The 30 Questions Every Founder Should Ask"
      >
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.875rem' }}>
          <div>
            <label style={labelStyle}>Tu conexión con el problema</label>
            <textarea
              value={data.problemConnection}
              onChange={e => setData(p => ({ ...p, problemConnection: e.target.value }))}
              placeholder="¿Por qué te importa este problema? ¿Qué te llevó a elegirlo entre todos los problemas del mundo? Sé honesto y específico — los inversores huelen la autenticidad."
              rows={4}
              style={textareaStyle}
            />
          </div>
          <div>
            <label style={labelStyle}>¿Has vivido el problema en carne propia?</label>
            <textarea
              value={data.livingTheProblem}
              onChange={e => setData(p => ({ ...p, livingTheProblem: e.target.value }))}
              placeholder="¿Fuiste tú el afectado? ¿Un familiar, un colega? ¿Trabajaste en la industria y lo observaste de cerca? Describe el momento específico en que tomaste conciencia del problema."
              rows={3}
              style={textareaStyle}
            />
          </div>
        </div>
      </ToolSection>

      {/* 3. Ikigai */}
      <ToolSection
        number={3}
        title="Ikigai del founder"
        subtitle="La intersección de pasión, habilidades, mercado y negocio"
        insight="El Ikigai (生き甲斐 — 'razón de ser') adaptado al emprendimiento identifica la zona donde lo que amas, lo que dominas, lo que el mundo necesita y lo que puedes monetizar convergen. Es donde los mejores founders operan."
        insightSource="Héctor García & Francesc Miralles — Ikigai"
      >
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          {data.founders.map((f, i) => (
            <IkigaiDiagram
              key={i}
              entry={data.ikigai[i] || DEFAULT_IKIGAI}
              founderName={hasSecondFounder ? (f.name || `Founder ${i + 1}`) : ''}
              onChange={(field, value) => updateIkigai(i, field, value)}
            />
          ))}
        </div>
      </ToolSection>

      {/* 4. Ventaja injusta */}
      <ToolSection
        number={4}
        title="Ventaja injusta"
        subtitle="Lo que tienes y que otros no pueden replicar fácilmente"
        insight="La 'Unfair Advantage' (Ash Maurya) es lo único que no puede comprarse ni copiarse en el corto plazo: conocimiento insider, acceso privilegiado, comunidad propia, propiedad intelectual, marca personal, o posición regulatoria."
        insightSource="Ash Maurya — Running Lean"
      >
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(3, 1fr)',
            gap: '0.5rem',
            marginBottom: '0.5rem',
          }}>
            {[
              { label: 'Conocimiento insider', desc: 'Sabes algo que otros no saben sobre esta industria' },
              { label: 'Acceso privilegiado', desc: 'Tienes acceso a datos, personas o recursos únicos' },
              { label: 'Comunidad propia', desc: 'Tienes audiencia, red o comunidad en este dominio' },
              { label: 'IP o tecnología', desc: 'Tienes propiedad intelectual o capacidad técnica diferencial' },
              { label: 'Marca personal', desc: 'Eres reconocido como experto en este campo' },
              { label: 'Ventaja regulatoria', desc: 'Tienes licencias, certificaciones o posición regulatoria' },
            ].map(v => (
              <div key={v.label} style={{
                padding: '0.625rem 0.75rem',
                borderRadius: 8,
                border: '1px solid var(--color-border)',
                background: 'var(--color-bg-primary)',
              }}>
                <div style={{ fontFamily: 'var(--font-body)', fontSize: '0.75rem', fontWeight: 700, color: 'var(--color-ink)', marginBottom: 2 }}>
                  {v.label}
                </div>
                <div style={{ fontFamily: 'var(--font-body)', fontSize: '0.7rem', color: 'var(--color-text-muted)', lineHeight: 1.4 }}>
                  {v.desc}
                </div>
              </div>
            ))}
          </div>
          <textarea
            value={data.unfairAdvantage}
            onChange={e => setData(p => ({ ...p, unfairAdvantage: e.target.value }))}
            placeholder="¿Cuál es tu ventaja injusta concreta? Describe qué tienes tú (o tu equipo) que un competidor con igual capital no podría replicar en 6 meses."
            rows={4}
            style={textareaStyle}
          />
        </div>
      </ToolSection>

      {/* 5. Por qué nosotros / Por qué ahora */}
      <ToolSection
        number={5}
        title="¿Por qué nosotros? ¿Por qué ahora?"
        subtitle="Las dos preguntas que todo inversor de Sequoia hace primero"
        insight="Doug Leone de Sequoia Capital enseña que 'Why Now' es la pregunta más importante: ¿qué cambió en el mundo (tecnológico, regulatorio, conductual) que hace que este sea el momento correcto y que antes fuera imposible?"
        insightSource="Sequoia Capital — How to Write a Business Plan"
      >
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.875rem' }}>
          <div>
            <label style={labelStyle}>¿Por qué nosotros como equipo?</label>
            <textarea
              value={data.whyUs}
              onChange={e => setData(p => ({ ...p, whyUs: e.target.value }))}
              placeholder="¿Por qué está mejor posicionado TU equipo que cualquier otra persona o empresa para resolver este problema? Combina tu Founder-Problem Fit y tu ventaja injusta en una respuesta directa."
              rows={3}
              style={textareaStyle}
            />
          </div>
          <div>
            <label style={labelStyle}>¿Por qué ahora?</label>
            <textarea
              value={data.whyNow}
              onChange={e => setData(p => ({ ...p, whyNow: e.target.value }))}
              placeholder="¿Qué cambió recientemente (tecnología, regulación, comportamiento del consumidor, crisis, etc.) que hace que esta sea la ventana de oportunidad correcta? ¿Por qué en 2023 no era posible y hoy sí?"
              rows={3}
              style={textareaStyle}
            />
          </div>

          {hasSecondFounder && (
            <div>
              <label style={labelStyle}>Complementariedad del equipo</label>
              <textarea
                value={data.complementarity}
                onChange={e => setData(p => ({ ...p, complementarity: e.target.value }))}
                placeholder="¿Cómo se complementan tus habilidades con las de tu co-founder? Describe los gaps que cubre cada uno y por qué juntos son más fuertes que solos."
                rows={3}
                style={textareaStyle}
              />
            </div>
          )}
        </div>
      </ToolSection>

      {/* 6. Autoevaluación */}
      <ToolSection
        number={6}
        title="Autoevaluación de Founder-Problem Fit"
        subtitle="Sé honesto — esta evaluación es solo para ti"
        insight="Esta evaluación no es para impresionar a nadie. Es un diagnóstico honesto de tus fortalezas y vulnerabilidades como founder frente a este problema específico. Los founders que entienden sus debilidades las mitigan antes de que sean fatales."
        insightSource="Steve Blank — The Startup Owner's Manual"
      >
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <ScoreSelector
            label="Conexión personal con el problema"
            sublabel="¿Qué tan profundamente lo has vivido o investigado?"
            value={data.selfScore.connection}
            onChange={v => updateScore('connection', v)}
          />
          <ScoreSelector
            label="Experiencia / expertise relevante"
            sublabel="¿Qué tan competente eres en el dominio del problema?"
            value={data.selfScore.expertise}
            onChange={v => updateScore('expertise', v)}
          />
          <ScoreSelector
            label="Red de contactos en el sector"
            sublabel="¿Tienes acceso a clientes, expertos o aliados clave?"
            value={data.selfScore.network}
            onChange={v => updateScore('network', v)}
          />
          <ScoreSelector
            label="Ventaja por timing del mercado"
            sublabel="¿Qué tan fuerte es el 'Why Now' que identificaste?"
            value={data.selfScore.timing}
            onChange={v => updateScore('timing', v)}
          />

          {/* Score summary */}
          {Object.values(data.selfScore).some(v => v > 0) && (() => {
            const values = Object.values(data.selfScore).filter(v => v > 0)
            const avg = values.reduce((a, b) => a + b, 0) / values.length
            const { bg, color } = scoreColor(Math.round(avg))
            return (
              <div style={{
                padding: '0.875rem 1rem',
                borderRadius: 10,
                background: bg,
                border: `1px solid ${color}30`,
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
              }}>
                <span style={{ fontFamily: 'var(--font-body)', fontSize: '0.875rem', fontWeight: 600, color }}>
                  Founder-Problem Fit promedio
                </span>
                <span style={{ fontFamily: 'var(--font-display)', fontSize: '1.25rem', fontWeight: 700, color }}>
                  {avg.toFixed(1)}/5
                </span>
              </div>
            )
          })()}
        </div>
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
