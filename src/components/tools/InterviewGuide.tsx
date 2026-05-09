'use client'

import { useState } from 'react'
import { Plus, Trash2, AlertTriangle, CheckCircle2 } from 'lucide-react'
import { useToolState } from '@/lib/useToolState'
import type { ToolComponentProps } from './ToolPage'
import {
  ToolSection, ToolActionBar, ToolProgress,
  inputStyle, textareaStyle, labelStyle, btnSmall,
} from './shared'

interface Question {
  text: string
  type: 'past-behavior' | 'context' | 'pain-depth' | 'current-solution'
}

interface Interview {
  interviewee: string
  date: string
  quotes: string
  patterns: string
  validated: string
  refuted: string
}

interface Data {
  questions: Question[]
  interviews: Interview[]
  synthesis: string
}

const QUESTION_TYPES = [
  { value: 'past-behavior' as const, label: 'Comportamiento pasado', color: '#16A34A' },
  { value: 'context' as const, label: 'Contexto', color: '#1F77F6' },
  { value: 'pain-depth' as const, label: 'Profundidad del dolor', color: '#DA4E24' },
  { value: 'current-solution' as const, label: 'Solución actual', color: '#9333EA' },
]

const emptyQuestion = (): Question => ({ text: '', type: 'past-behavior' })
const emptyInterview = (): Interview => ({
  interviewee: '', date: '', quotes: '', patterns: '', validated: '', refuted: '',
})
const DEFAULT: Data = {
  questions: [emptyQuestion(), emptyQuestion(), emptyQuestion()],
  interviews: [emptyInterview()],
  synthesis: '',
}

const ACCENT = '#16A34A'

export default function InterviewGuide({ userId, onComplete, onGenerateReport }: ToolComponentProps) {
  const [data, setData] = useToolState<Data>(userId, 'interview-guide', DEFAULT)
  const [saved, setSaved] = useState(false)

  const filledQuestions = data.questions.filter(q => q.text.trim()).length
  const filledInterviews = data.interviews.filter(i => i.interviewee.trim() && i.quotes.trim()).length

  const filledCount = (filledQuestions >= 6 ? 1 : 0) + (filledInterviews >= 3 ? 1 : 0) + (data.synthesis.trim() ? 1 : 0)

  const updateQuestion = (i: number, field: keyof Question, value: string) =>
    setData(p => { const qs = [...p.questions]; qs[i] = { ...qs[i], [field]: value as Question[keyof Question] }; return { ...p, questions: qs } })

  const addQuestion = () => setData(p => ({ ...p, questions: [...p.questions, emptyQuestion()] }))
  const removeQuestion = (i: number) => setData(p => ({ ...p, questions: p.questions.filter((_, idx) => idx !== i) }))

  const updateInterview = (i: number, field: keyof Interview, value: string) =>
    setData(p => { const ivs = [...p.interviews]; ivs[i] = { ...ivs[i], [field]: value }; return { ...p, interviews: ivs } })

  const addInterview = () => setData(p => ({ ...p, interviews: [...p.interviews, emptyInterview()] }))
  const removeInterview = (i: number) => setData(p => ({ ...p, interviews: p.interviews.filter((_, idx) => idx !== i) }))

  const handleReport = () => {
    const content = `
GUÍA DE ENTREVISTA

PREGUNTAS DISEÑADAS:
${data.questions.map((q, i) => `${i + 1}. [${q.type}] ${q.text || '(No completada)'}`).join('\n')}

REGISTRO DE ENTREVISTAS (${data.interviews.length}):
${data.interviews.map((iv, i) => `
Entrevista ${i + 1}: ${iv.interviewee || '(Sin nombre)'} — ${iv.date || 'Sin fecha'}
  Citas relevantes: ${iv.quotes || '(No registradas)'}
  Patrones: ${iv.patterns || '(No registrados)'}
  Supuestos VALIDADOS: ${iv.validated || '(Ninguno)'}
  Supuestos REFUTADOS: ${iv.refuted || '(Ninguno)'}`).join('\n')}

SÍNTESIS DE PATRONES:
${data.synthesis || '(No completada)'}
`.trim()
    onGenerateReport(content)
  }

  const typeColor = (type: Question['type']) =>
    QUESTION_TYPES.find(t => t.value === type)?.color ?? ACCENT

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
      <ToolProgress filled={filledCount} total={3} accentColor={ACCENT} />

      <ToolSection
        number={1}
        title="Diseña tu guía de preguntas"
        subtitle={`${data.questions.filter(q => q.text.trim()).length}/${data.questions.length} preguntas escritas — mínimo 6`}
        insight="The Mom Test (Fitzpatrick): nunca preguntes si les gusta tu idea. Pregunta sobre el pasado: '¿Cuándo fue la última vez que...?' No reveles tu solución. Busca comportamiento real, no intención hipotética."
        insightSource="The Mom Test — Rob Fitzpatrick"
        defaultOpen={true}
        accentColor={ACCENT}
      >
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', marginBottom: '0.75rem' }}>
          {data.questions.map((q, i) => (
            <div key={i} style={{
              display: 'flex', gap: '0.75rem', alignItems: 'flex-start',
              padding: '0.875rem', borderRadius: 10,
              border: `1px solid ${q.text.trim() ? typeColor(q.type) + '40' : 'var(--color-border)'}`,
              background: 'var(--color-bg-primary)',
            }}>
              <div style={{
                width: 24, height: 24, borderRadius: 6, flexShrink: 0, marginTop: 2,
                background: `${typeColor(q.type)}15`,
                border: `1.5px solid ${typeColor(q.type)}40`,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontFamily: 'var(--font-heading)', fontSize: '0.75rem', fontWeight: 700,
                color: typeColor(q.type),
              }}>
                {i + 1}
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '0.5rem', flexWrap: 'wrap' }}>
                  {QUESTION_TYPES.map(t => (
                    <button
                      key={t.value}
                      onClick={() => updateQuestion(i, 'type', t.value)}
                      style={{
                        ...btnSmall,
                        color: q.type === t.value ? '#fff' : t.color,
                        background: q.type === t.value ? t.color : 'transparent',
                        borderColor: `${t.color}40`,
                        fontSize: '0.625rem',
                        padding: '0.2rem 0.5rem',
                      }}
                    >
                      {t.label}
                    </button>
                  ))}
                </div>
                <textarea
                  value={q.text}
                  onChange={e => updateQuestion(i, 'text', e.target.value)}
                  placeholder="Escribe la pregunta completa tal como la harías en la entrevista..."
                  style={{ ...textareaStyle, minHeight: 55, fontSize: '0.875rem' }}
                />
              </div>
              {data.questions.length > 3 && (
                <button onClick={() => removeQuestion(i)} style={{ ...btnSmall, color: '#EF4444', marginTop: 2 }}>
                  <Trash2 size={12} />
                </button>
              )}
            </div>
          ))}
        </div>
        {data.questions.length < 10 && (
          <button onClick={addQuestion} style={{
            ...btnSmall, color: ACCENT, borderColor: `${ACCENT}40`,
            borderStyle: 'dashed', padding: '0.625rem', borderRadius: 10,
            width: '100%', justifyContent: 'center',
          }}>
            <Plus size={14} /> Agregar pregunta
          </button>
        )}

        <div style={{
          marginTop: '1rem', padding: '0.875rem 1rem', borderRadius: 10,
          background: 'rgba(251,191,36,0.06)', border: '1px solid rgba(251,191,36,0.2)',
          display: 'flex', gap: '0.625rem', alignItems: 'flex-start',
        }}>
          <AlertTriangle size={14} color="#F59E0B" style={{ flexShrink: 0, marginTop: 2 }} />
          <span style={{ fontFamily: 'var(--font-body)', fontSize: '0.75rem', color: 'var(--color-text-secondary)', lineHeight: 1.5 }}>
            <strong>Revisa antes de entrevistar:</strong> ¿Alguna pregunta empieza con &quot;¿Te gustaría…?&quot; o &quot;¿Estarías dispuesto a…?&quot;? Esas revelan tu solución y sesgan la respuesta. Reformúlalas en tiempo pasado.
          </span>
        </div>
      </ToolSection>

      <ToolSection
        number={2}
        title="Registro de entrevistas"
        subtitle={`${filledInterviews} entrevista(s) registrada(s) — mínimo 3`}
        defaultOpen={filledInterviews > 0}
        accentColor={ACCENT}
      >
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {data.interviews.map((iv, i) => (
            <div key={i} style={{
              padding: '1rem', borderRadius: 12,
              border: `1px solid ${iv.interviewee.trim() ? ACCENT + '30' : 'var(--color-border)'}`,
              background: 'var(--color-bg-primary)',
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.75rem' }}>
                <span style={{ fontFamily: 'var(--font-heading)', fontSize: '0.8125rem', fontWeight: 700, color: ACCENT }}>
                  Entrevista {i + 1}
                </span>
                {data.interviews.length > 1 && (
                  <button onClick={() => removeInterview(i)} style={{ ...btnSmall, color: '#EF4444' }}>
                    <Trash2 size={12} /> Eliminar
                  </button>
                )}
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem', marginBottom: '0.75rem' }}>
                <div>
                  <label style={labelStyle}>Entrevistado/a (nombre o alias)</label>
                  <input value={iv.interviewee} onChange={e => updateInterview(i, 'interviewee', e.target.value)} placeholder="María R., 38 años, agricultora" style={inputStyle} />
                </div>
                <div>
                  <label style={labelStyle}>Fecha</label>
                  <input type="date" value={iv.date} onChange={e => updateInterview(i, 'date', e.target.value)} style={inputStyle} />
                </div>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.625rem' }}>
                <div>
                  <label style={labelStyle}>Citas textuales más relevantes (entre comillas)</label>
                  <textarea value={iv.quotes} onChange={e => updateInterview(i, 'quotes', e.target.value)} placeholder='"Cuando llevo mi cosecha al mercado siempre pierdo porque no sé el precio del día..."' style={{ ...textareaStyle, minHeight: 70 }} />
                </div>
                <div>
                  <label style={labelStyle}>Patrones observados / comportamientos notables</label>
                  <textarea value={iv.patterns} onChange={e => updateInterview(i, 'patterns', e.target.value)} placeholder="Qué fue sorprendente, qué se repitió, qué contradicción observaste" style={{ ...textareaStyle, minHeight: 60 }} />
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
                  <div>
                    <label style={{ ...labelStyle, color: '#16A34A' }}>Supuestos CONFIRMADOS</label>
                    <textarea value={iv.validated} onChange={e => updateInterview(i, 'validated', e.target.value)} placeholder="¿Qué creías antes que esto confirmó?" style={{ ...textareaStyle, minHeight: 60 }} />
                  </div>
                  <div>
                    <label style={{ ...labelStyle, color: '#DC2626' }}>Supuestos REFUTADOS</label>
                    <textarea value={iv.refuted} onChange={e => updateInterview(i, 'refuted', e.target.value)} placeholder="¿Qué creías antes que esto refutó?" style={{ ...textareaStyle, minHeight: 60 }} />
                  </div>
                </div>
              </div>
            </div>
          ))}
          <button onClick={addInterview} style={{
            ...btnSmall, color: ACCENT, borderColor: `${ACCENT}40`,
            borderStyle: 'dashed', padding: '0.625rem', borderRadius: 10, width: '100%', justifyContent: 'center',
          }}>
            <Plus size={14} /> Agregar entrevista
          </button>
        </div>
      </ToolSection>

      <ToolSection
        number={3}
        title="Síntesis de patrones"
        subtitle="¿Qué aprendiste de todas las entrevistas juntas?"
        defaultOpen={filledInterviews >= 2}
        accentColor={ACCENT}
      >
        <textarea
          value={data.synthesis}
          onChange={e => setData(p => ({ ...p, synthesis: e.target.value }))}
          placeholder="Describe los 3-5 patrones que se repitieron en las entrevistas. ¿Qué supuestos quedaron confirmados? ¿Qué te sorprendió? ¿Cambió alguna hipótesis importante?"
          style={{ ...textareaStyle, minHeight: 110 }}
        />
        {filledInterviews >= 3 && (
          <div style={{
            marginTop: '0.75rem', padding: '0.75rem', borderRadius: 10,
            background: `${ACCENT}08`, border: `1px solid ${ACCENT}25`,
            display: 'flex', gap: '0.5rem', alignItems: 'center',
          }}>
            <CheckCircle2 size={14} color={ACCENT} />
            <span style={{ fontFamily: 'var(--font-body)', fontSize: '0.75rem', color: ACCENT, fontWeight: 600 }}>
              Con {filledInterviews} entrevistas completadas puedes avanzar a la Idea inicial.
            </span>
          </div>
        )}
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
