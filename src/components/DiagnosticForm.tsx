'use client'

import { useState, useEffect, useCallback } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { motion, AnimatePresence } from 'framer-motion'
import { ArrowLeft, ArrowRight, Loader2, CheckCircle2 } from 'lucide-react'
import { supabase } from '@/lib/supabase'

/* ─── Schema ─── */
const contactSchema = z.object({
  nombre: z.string().min(2, 'Nombre requerido'),
  email: z.string().email('Email inválido'),
  startup_name: z.string().min(2, 'Nombre de startup requerido'),
  website: z.string().optional(),
})

type ContactData = z.infer<typeof contactSchema>

/* ─── Questions ─── */
interface Question {
  id: string
  text: string
  subtitle: string
  options: { label: string; value: string; score?: number }[]
  type: 'score' | 'tag'
}

const questions: Question[] = [
  {
    id: 'P1',
    text: '¿Cuál es la naturaleza principal de tu tecnología climática?',
    subtitle: 'Naturaleza Tecnológica',
    type: 'tag',
    options: [
      { label: 'Software / SaaS Climático (datos, mercados de carbono)', value: 'software' },
      { label: 'Deep Tech / Bioeconomía (nuevos materiales, química, biología)', value: 'deeptech' },
      { label: 'Hard-Tech / Infraestructura (energía, captura directa, maquinaria)', value: 'hardtech' },
    ],
  },
  {
    id: 'P2',
    text: '¿En qué fase de desarrollo tecnológico te encuentras hoy?',
    subtitle: 'Nivel de Madurez Tecnológica (TRL)',
    type: 'score',
    options: [
      { label: 'Idea o prueba de concepto en laboratorio (TRL 1-3)', value: 'trl1-3', score: 1 },
      { label: 'Prototipo funcional validado en entorno controlado (TRL 4-5)', value: 'trl4-5', score: 2 },
      { label: 'Piloto comercial u operando a pequeña escala (TRL 6-7)', value: 'trl6-7', score: 3 },
      { label: 'Planta a escala comercial / FOAK o despliegue masivo (TRL 8-9)', value: 'trl8-9', score: 4 },
    ],
  },
  {
    id: 'P3',
    text: '¿Cuál es el estado actual de la validación de tu mercado?',
    subtitle: 'Validación Comercial (CRL)',
    type: 'score',
    options: [
      { label: 'Validando el problema mediante entrevistas (Customer Discovery)', value: 'discovery', score: 1 },
      { label: 'Tenemos LOIs (Cartas de Intención) o pilotos no pagados', value: 'lois', score: 2 },
      { label: 'Pilotos B2B pagados o primeros ingresos iniciales', value: 'pilots', score: 3 },
      { label: 'Ingresos recurrentes demostrados o Acuerdos Offtake firmados', value: 'revenue', score: 4 },
    ],
  },
  {
    id: 'P4',
    text: '¿Cómo planeas entregar y cobrar tu solución al cliente?',
    subtitle: 'Intensidad de Capital',
    type: 'tag',
    options: [
      { label: 'Suscripción puramente digital (SaaS)', value: 'saas' },
      { label: 'Venta directa del equipo/hardware al cliente (CAPEX para el cliente)', value: 'capex' },
      { label: 'Hardware-as-a-Service / PPA (OPEX para el cliente)', value: 'haas' },
      { label: 'Licenciamiento de Propiedad Intelectual (IP)', value: 'licensing' },
    ],
  },
  {
    id: 'P5',
    text: '¿Cómo cuantificas el impacto climático de tu startup?',
    subtitle: 'Medición de Impacto',
    type: 'score',
    options: [
      { label: 'Aún no medimos o solo tenemos una narrativa cualitativa', value: 'none', score: 1 },
      { label: 'Tenemos un cálculo interno básico de emisiones reducidas (ERP)', value: 'basic', score: 2 },
      { label: 'Contamos con un Análisis de Ciclo de Vida (LCA) o verificación de terceros', value: 'lca', score: 4 },
    ],
  },
  {
    id: 'P6',
    text: '¿Cuánto capital buscas levantar en los próximos 12-18 meses?',
    subtitle: 'Necesidad de Financiamiento',
    type: 'score',
    options: [
      { label: 'Bootstrapping / Buscamos menos de $250k', value: 'bootstrap', score: 1 },
      { label: 'Entre $250k y $1.5M (Pre-Seed / Seed)', value: 'seed', score: 2 },
      { label: 'Entre $1.5M y $5M (Series A)', value: 'seriesA', score: 3 },
      { label: 'Más de $5M (FOAK / Series B o posterior)', value: 'foak', score: 4 },
    ],
  },
  {
    id: 'P7',
    text: '¿Qué estructura de capital estás priorizando?',
    subtitle: 'Estructura del Capital',
    type: 'tag',
    options: [
      { label: 'Exclusivamente Venture Capital (Equity / SAFEs)', value: 'vc' },
      { label: 'Grants (Subvenciones gubernamentales o corporativas no dilutivas)', value: 'grants' },
      { label: 'Financiamiento mixto (Blended Finance): VC + Deuda + Grants', value: 'blended' },
    ],
  },
  {
    id: 'P8',
    text: '¿Cuál es el balance actual del equipo fundador?',
    subtitle: 'Equipo Fundador',
    type: 'score',
    options: [
      { label: 'Perfil 100% técnico/científico', value: 'tech', score: 1 },
      { label: 'Principalmente negocio, buscando expertise técnico', value: 'biz', score: 2 },
      { label: 'Balanceado (Técnico + Comercial) dedicado a tiempo completo', value: 'balanced', score: 3 },
    ],
  },
  {
    id: 'P9',
    text: '¿Cuál es el principal obstáculo que no te deja dormir hoy?',
    subtitle: 'Cuello de Botella Operativo',
    type: 'tag',
    options: [
      { label: 'Desarrollar la tecnología o patentar la ciencia', value: 'tech' },
      { label: 'Estructurar financieramente nuestro modelo y Unit Economics', value: 'finance' },
      { label: 'Cerrar ventas complejas con corporativos (Pilotos a Offtakes)', value: 'sales' },
      { label: 'Superar el Due Diligence técnico/ESG de inversores institucionales', value: 'dd' },
    ],
  },
  {
    id: 'P10',
    text: '¿Si un inversor te pidiera acceso a tu Data Room hoy, qué tan listo estás?',
    subtitle: 'Preparación del Data Room',
    type: 'score',
    options: [
      { label: 'No tenemos Data Room estructurado aún', value: 'none', score: 1 },
      { label: 'Tenemos Pitch Deck básico y proyecciones a 12 meses', value: 'basic', score: 2 },
      { label: 'Financieros completos, Cap Table y documentos legales listos', value: 'ready', score: 3 },
      { label: 'Todo lo anterior + Análisis Técnico-Económico (TEA) y auditorías listas', value: 'full', score: 4 },
    ],
  },
]

/* ─── Profiles ─── */
const profiles = [
  {
    range: [6, 11] as [number, number],
    name: 'ETAPA 1: Pre-incubación',
    tag: 'Lab-to-Market',
    description: 'Tu startup está en fase de validación científica y búsqueda de mercado. Las herramientas de esta etapa te ayudarán a estructurar tu propuesta y encontrar tu early adopter.',
    tools: ['Calculadora TRL/CRL', 'Climate Lean Canvas', 'Guía Lab-to-Market', 'Auditoría de Equipo'],
    color: '#7C3AED',
  },
  {
    range: [12, 18] as [number, number],
    name: 'ETAPA 2: Incubación',
    tag: 'Go-to-Market',
    description: 'Tu ciencia está probada y necesitas construir un modelo de negocio escalable. Enfócate en unit economics, demostración de impacto y cerrar tus primeros pilotos B2B.',
    tools: ['Calculadora Unit Economics', 'Estimador ERP', 'Framework Pilotos B2B', 'Pitch Deck S2B'],
    color: '#059669',
  },
  {
    range: [19, 24] as [number, number],
    name: 'ETAPA 3: Aceleración',
    tag: 'FOAK / Scale',
    description: 'Estás listo para levantar capital significativo y financiar tu primera instalación comercial. Estructura tu blended finance y prepárate para el Due Diligence institucional.',
    tools: ['Simulador Cap Table', 'Mapeador Capital Stack', 'Data Room Climático', 'Framework Offtakes'],
    color: '#D97706',
  },
]

/* ─── Component ─── */
const TOTAL_STEPS = 12 // 0: contact, 1-10: questions, 11: loading, 12: results

export default function DiagnosticForm() {
  const [step, setStep] = useState(0)
  const [answers, setAnswers] = useState<Record<string, string>>({})
  const [scores, setScores] = useState<Record<string, number>>({})
  const [totalScore, setTotalScore] = useState(0)
  const [profile, setProfile] = useState(profiles[0])
  const [submitted, setSubmitted] = useState(false)
  const [countUp, setCountUp] = useState(0)

  const { register, handleSubmit, formState: { errors } } = useForm<ContactData>({
    resolver: zodResolver(contactSchema),
  })

  const calculateResults = useCallback(() => {
    let total = 0
    const scoreQuestions = ['P2', 'P3', 'P5', 'P6', 'P8', 'P10']
    scoreQuestions.forEach(qId => {
      total += scores[qId] || 0
    })
    setTotalScore(total)
    const matched = profiles.find(p => total >= p.range[0] && total <= p.range[1]) || profiles[0]
    setProfile(matched)
    return { total, matched }
  }, [scores])

  const handleContactSubmit = (data: ContactData) => {
    setAnswers(prev => ({ ...prev, ...data }))
    setStep(1)
  }

  const handleAnswer = (questionIndex: number, value: string, score?: number) => {
    const qId = questions[questionIndex].id
    setAnswers(prev => ({ ...prev, [qId]: value }))
    if (score !== undefined) {
      setScores(prev => ({ ...prev, [qId]: score }))
    }
    setTimeout(() => {
      if (questionIndex < questions.length - 1) {
        setStep(questionIndex + 2)
      } else {
        setStep(11) // loading
      }
    }, 400)
  }

  // Loading → Results
  useEffect(() => {
    if (step === 11 && !submitted) {
      const { total, matched } = calculateResults()

      // Supabase inserts
      const insertLead = async () => {
        try {
          await supabase.from('diagnostic_leads').insert({
            nombre: answers.nombre,
            email: answers.email,
            startup_name: answers.startup_name,
            website: answers.website || null,
            score: total,
            profile: matched.tag,
            answers: JSON.stringify(answers),
            tags: JSON.stringify({
              tech_type: answers.P1,
              capital_intensity: answers.P4,
              capital_structure: answers.P7,
              bottleneck: answers.P9,
            }),
          })
        } catch {
          // Continue to results even if DB fails
        }
      }

      // Save to diagnostics table with dimension scores
      const insertDiagnostic = async () => {
        try {
          const dimensionScores = {
            trl: scores.P2 || 0,
            crl: scores.P3 || 0,
            impacto: scores.P5 || 0,
            financiamiento: scores.P6 || 0,
            equipo: scores.P8 || 0,
            data_room: scores.P10 || 0,
          }

          // Look up user by email to get their UUID
          const { data: userData } = await supabase
            .from('users')
            .select('id')
            .eq('email', answers.email?.toLowerCase())
            .single()

          await supabase.from('diagnostics').insert({
            user_id: userData?.id || null,
            score: total,
            profile: matched.tag,
            answers,
            dimension_scores: dimensionScores,
          })
        } catch {
          // Continue to results even if DB fails
        }
      }

      insertLead()
      insertDiagnostic()

      setTimeout(() => {
        setSubmitted(true)
        setStep(12)
      }, 2500)
    }
  }, [step, submitted, calculateResults, answers])

  // Counter animation
  useEffect(() => {
    if (step === 12 && countUp < totalScore) {
      const timer = setTimeout(() => setCountUp(prev => prev + 1), 80)
      return () => clearTimeout(timer)
    }
  }, [step, countUp, totalScore])

  const progress = step <= 11 ? ((step) / 11) * 100 : 100

  return (
    <section id="diagnostico" style={{ padding: '4rem 0 6rem', background: 'var(--color-bg-warm)' }}>
      <div style={{ maxWidth: 760, margin: '0 auto', padding: '0 1.5rem' }}>
        <div style={{
          background: 'white',
          borderRadius: 24,
          border: '1px solid var(--color-border)',
          boxShadow: 'var(--shadow-elevated)',
          overflow: 'hidden',
          position: 'relative',
        }}>
          {/* Top gradient accent */}
          <div style={{
            height: 4,
            background: 'linear-gradient(90deg, #059669, #0D9488, #F97316)',
          }} />

          {/* Progress bar */}
          {step < 12 && (
            <div style={{ padding: '1rem 2rem 0' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.6875rem', color: 'var(--color-text-muted)' }}>
                  {step === 0 ? 'Datos de contacto' : step <= 10 ? `Pregunta ${step}/10` : 'Procesando...'}
                </span>
                <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.6875rem', color: '#059669', fontWeight: 600 }}>
                  {Math.round(progress)}%
                </span>
              </div>
              <div style={{ height: 4, borderRadius: 2, background: '#F3F4F6' }}>
                <motion.div
                  animate={{ width: `${progress}%` }}
                  transition={{ duration: 0.3 }}
                  style={{ height: '100%', borderRadius: 2, background: '#059669' }}
                />
              </div>
            </div>
          )}

          <div style={{ padding: '2rem' }}>
            <AnimatePresence mode="wait">
              {/* Step 0: Contact form */}
              {step === 0 && (
                <motion.div
                  key="contact"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.3 }}
                >
                  <h3 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.375rem', fontWeight: 700, marginBottom: '0.5rem', color: 'var(--color-text-primary)' }}>
                    Comienza tu diagnóstico
                  </h3>
                  <p style={{ fontFamily: 'var(--font-body)', fontSize: '0.875rem', color: 'var(--color-text-secondary)', marginBottom: '1.5rem' }}>
                    Ingresa tus datos para recibir tu reporte personalizado.
                  </p>
                  <form onSubmit={handleSubmit(handleContactSubmit)} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                    {[
                      { name: 'nombre' as const, label: 'Tu nombre', placeholder: 'María García' },
                      { name: 'email' as const, label: 'Email', placeholder: 'maria@startup.com' },
                      { name: 'startup_name' as const, label: 'Nombre de tu startup', placeholder: 'CleanTech Solutions' },
                      { name: 'website' as const, label: 'Sitio web (opcional)', placeholder: 'https://...' },
                    ].map(field => (
                      <div key={field.name}>
                        <label style={{ display: 'block', fontFamily: 'var(--font-body)', fontSize: '0.8125rem', fontWeight: 600, color: 'var(--color-text-primary)', marginBottom: '0.375rem' }}>
                          {field.label}
                        </label>
                        <input
                          {...register(field.name)}
                          placeholder={field.placeholder}
                          style={{
                            width: '100%',
                            padding: '0.75rem 1rem',
                            borderRadius: 10,
                            border: `1px solid ${errors[field.name] ? '#DC2626' : 'var(--color-border)'}`,
                            fontFamily: 'var(--font-body)',
                            fontSize: '0.875rem',
                            color: 'var(--color-text-primary)',
                            outline: 'none',
                            transition: 'border-color 0.2s',
                            background: 'var(--color-bg-primary)',
                          }}
                          onFocus={e => (e.currentTarget.style.borderColor = '#059669')}
                          onBlur={e => (e.currentTarget.style.borderColor = errors[field.name] ? '#DC2626' : 'var(--color-border)')}
                        />
                        {errors[field.name] && (
                          <p style={{ fontFamily: 'var(--font-body)', fontSize: '0.75rem', color: '#DC2626', marginTop: '0.25rem' }}>
                            {errors[field.name]?.message}
                          </p>
                        )}
                      </div>
                    ))}
                    <button
                      type="submit"
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '0.5rem',
                        width: '100%',
                        padding: '0.875rem',
                        borderRadius: 12,
                        background: '#059669',
                        color: 'white',
                        fontFamily: 'var(--font-body)',
                        fontSize: '0.9375rem',
                        fontWeight: 600,
                        border: 'none',
                        cursor: 'pointer',
                        transition: 'background 0.2s',
                        marginTop: '0.5rem',
                      }}
                    >
                      Comenzar Diagnóstico <ArrowRight size={18} />
                    </button>
                  </form>
                </motion.div>
              )}

              {/* Steps 1-10: Questions */}
              {step >= 1 && step <= 10 && (
                <motion.div
                  key={`q-${step}`}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.3 }}
                >
                  <button
                    onClick={() => setStep(step - 1)}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.375rem',
                      background: 'none',
                      border: 'none',
                      fontFamily: 'var(--font-body)',
                      fontSize: '0.8125rem',
                      color: 'var(--color-text-muted)',
                      cursor: 'pointer',
                      marginBottom: '1rem',
                      padding: 0,
                    }}
                  >
                    <ArrowLeft size={16} /> Anterior
                  </button>
                  <p style={{ fontFamily: 'var(--font-mono)', fontSize: '0.6875rem', fontWeight: 600, color: '#059669', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '0.5rem' }}>
                    {questions[step - 1].subtitle}
                  </p>
                  <h3 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.25rem', fontWeight: 700, color: 'var(--color-text-primary)', marginBottom: '1.5rem', lineHeight: 1.3 }}>
                    {questions[step - 1].text}
                  </h3>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.625rem' }}>
                    {questions[step - 1].options.map(opt => {
                      const selected = answers[questions[step - 1].id] === opt.value
                      return (
                        <button
                          key={opt.value}
                          onClick={() => handleAnswer(step - 1, opt.value, opt.score)}
                          style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '0.75rem',
                            padding: '1rem 1.25rem',
                            borderRadius: 12,
                            border: selected ? '2px solid #059669' : '1px solid var(--color-border)',
                            background: selected ? 'rgba(5,150,105,0.04)' : 'white',
                            cursor: 'pointer',
                            textAlign: 'left',
                            transition: 'all 0.15s ease',
                            fontFamily: 'var(--font-body)',
                            fontSize: '0.875rem',
                            color: 'var(--color-text-primary)',
                            width: '100%',
                          }}
                        >
                          <div style={{
                            width: 20,
                            height: 20,
                            borderRadius: '50%',
                            border: selected ? '6px solid #059669' : '2px solid var(--color-border-strong)',
                            flexShrink: 0,
                            transition: 'border 0.15s',
                          }} />
                          {opt.label}
                        </button>
                      )
                    })}
                  </div>
                </motion.div>
              )}

              {/* Step 11: Loading */}
              {step === 11 && (
                <motion.div
                  key="loading"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  style={{ textAlign: 'center', padding: '3rem 0' }}
                >
                  <Loader2 size={40} color="#059669" style={{ animation: 'spin 1s linear infinite', margin: '0 auto 1rem' }} />
                  <style>{`@keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }`}</style>
                  <h3 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.25rem', fontWeight: 700, color: 'var(--color-text-primary)', marginBottom: '0.5rem' }}>
                    Analizando tu startup...
                  </h3>
                  <p style={{ fontFamily: 'var(--font-body)', fontSize: '0.875rem', color: 'var(--color-text-secondary)' }}>
                    Calculando tu Climate Readiness Score y preparando tu roadmap personalizado.
                  </p>
                </motion.div>
              )}

              {/* Step 12: Results */}
              {step === 12 && (
                <motion.div
                  key="results"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5 }}
                >
                  <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
                    <CheckCircle2 size={32} color="#059669" style={{ margin: '0 auto 0.75rem' }} />
                    <h3 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.5rem', fontWeight: 800, color: 'var(--color-text-primary)', marginBottom: '0.375rem' }}>
                      Tu Climate Readiness Score
                    </h3>
                    <div style={{
                      fontFamily: 'var(--font-mono)',
                      fontSize: '3.5rem',
                      fontWeight: 700,
                      color: profile.color,
                      lineHeight: 1,
                      margin: '0.75rem 0',
                    }}>
                      {countUp}<span style={{ fontSize: '1.5rem', color: 'var(--color-text-muted)' }}>/24</span>
                    </div>
                    <span style={{
                      display: 'inline-block',
                      padding: '0.375rem 1rem',
                      borderRadius: 9999,
                      background: `${profile.color}10`,
                      border: `1px solid ${profile.color}30`,
                      fontFamily: 'var(--font-mono)',
                      fontSize: '0.8125rem',
                      fontWeight: 700,
                      color: profile.color,
                    }}>
                      {profile.name}
                    </span>
                  </div>

                  {/* Score bar */}
                  <div style={{ margin: '0 0 1.5rem' }}>
                    <div style={{ height: 8, borderRadius: 4, background: '#F3F4F6', position: 'relative' }}>
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${(totalScore / 24) * 100}%` }}
                        transition={{ duration: 1, delay: 0.3 }}
                        style={{ height: '100%', borderRadius: 4, background: profile.color }}
                      />
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '0.375rem' }}>
                      <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.625rem', color: 'var(--color-text-muted)' }}>Pre-incubación</span>
                      <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.625rem', color: 'var(--color-text-muted)' }}>Incubación</span>
                      <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.625rem', color: 'var(--color-text-muted)' }}>Aceleración</span>
                    </div>
                  </div>

                  {/* Description */}
                  <p style={{
                    fontFamily: 'var(--font-body)',
                    fontSize: '0.9375rem',
                    lineHeight: 1.7,
                    color: 'var(--color-text-secondary)',
                    marginBottom: '1.5rem',
                    textAlign: 'center',
                  }}>
                    {profile.description}
                  </p>

                  {/* Recommended tools */}
                  <div style={{
                    padding: '1.25rem',
                    borderRadius: 14,
                    background: 'var(--color-bg-primary)',
                    border: '1px solid var(--color-border)',
                    marginBottom: '1.5rem',
                  }}>
                    <h4 style={{ fontFamily: 'var(--font-heading)', fontSize: '0.9375rem', fontWeight: 700, marginBottom: '0.75rem', color: 'var(--color-text-primary)' }}>
                      Tu Caja de Herramientas
                    </h4>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                      {profile.tools.map(tool => (
                        <span key={tool} style={{
                          padding: '0.375rem 0.875rem',
                          borderRadius: 8,
                          background: `${profile.color}08`,
                          border: `1px solid ${profile.color}20`,
                          fontFamily: 'var(--font-body)',
                          fontSize: '0.8125rem',
                          color: profile.color,
                          fontWeight: 500,
                        }}>
                          {tool}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* CTAs */}
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                    <a
                      href="https://calendly.com"
                      target="_blank"
                      rel="noopener noreferrer"
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '0.5rem',
                        width: '100%',
                        padding: '0.875rem',
                        borderRadius: 12,
                        background: '#059669',
                        color: 'white',
                        fontFamily: 'var(--font-body)',
                        fontSize: '0.9375rem',
                        fontWeight: 600,
                        textDecoration: 'none',
                      }}
                    >
                      Agenda una Sesión Estratégica <ArrowRight size={18} />
                    </a>
                    <a
                      href="#ciclo-de-vida"
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        width: '100%',
                        padding: '0.875rem',
                        borderRadius: 12,
                        background: 'var(--color-bg-primary)',
                        border: '1px solid var(--color-border)',
                        color: 'var(--color-text-primary)',
                        fontFamily: 'var(--font-body)',
                        fontSize: '0.9375rem',
                        fontWeight: 600,
                        textDecoration: 'none',
                      }}
                    >
                      Explorar Herramientas Gratuitas
                    </a>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </section>
  )
}
