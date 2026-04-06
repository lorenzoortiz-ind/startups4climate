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
  startup_description: z.string().min(10, 'Mínimo 10 caracteres'),
  vertical: z.string().min(1, 'Selecciona vertical'),
  country: z.string().optional(),
  phone: z.string().optional(),
  website: z.string().optional(),
})

type ContactData = z.infer<typeof contactSchema>

/* ─── Dropdown Options ─── */
const verticalOptions = [
  'Fintech',
  'Healthtech',
  'Edtech',
  'Agritech',
  'Cleantech / Energía',
  'Logística / Movilidad',
  'Proptech',
  'Biotech',
  'Deep Tech',
  'Otra',
]

const phoneCountryOptions = [
  { name: 'Argentina', flag: '\u{1F1E6}\u{1F1F7}', code: '+54' },
  { name: 'Bolivia', flag: '\u{1F1E7}\u{1F1F4}', code: '+591' },
  { name: 'Brasil', flag: '\u{1F1E7}\u{1F1F7}', code: '+55' },
  { name: 'Chile', flag: '\u{1F1E8}\u{1F1F1}', code: '+56' },
  { name: 'Colombia', flag: '\u{1F1E8}\u{1F1F4}', code: '+57' },
  { name: 'Costa Rica', flag: '\u{1F1E8}\u{1F1F7}', code: '+506' },
  { name: 'Ecuador', flag: '\u{1F1EA}\u{1F1E8}', code: '+593' },
  { name: 'El Salvador', flag: '\u{1F1F8}\u{1F1FB}', code: '+503' },
  { name: 'Guatemala', flag: '\u{1F1EC}\u{1F1F9}', code: '+502' },
  { name: 'Honduras', flag: '\u{1F1ED}\u{1F1F3}', code: '+504' },
  { name: 'México', flag: '\u{1F1F2}\u{1F1FD}', code: '+52' },
  { name: 'Nicaragua', flag: '\u{1F1F3}\u{1F1EE}', code: '+505' },
  { name: 'Panamá', flag: '\u{1F1F5}\u{1F1E6}', code: '+507' },
  { name: 'Paraguay', flag: '\u{1F1F5}\u{1F1FE}', code: '+595' },
  { name: 'Perú', flag: '\u{1F1F5}\u{1F1EA}', code: '+51' },
  { name: 'República Dominicana', flag: '\u{1F1E9}\u{1F1F4}', code: '+1' },
  { name: 'Uruguay', flag: '\u{1F1FA}\u{1F1FE}', code: '+598' },
]

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
    text: '¿En qué vertical se encuentra tu startup?',
    subtitle: 'Naturaleza del Producto',
    type: 'tag',
    options: [
      { label: 'SaaS / Software', value: 'saas' },
      { label: 'Hardware / IoT', value: 'hardware' },
      { label: 'Deep Tech / Biotech', value: 'deeptech' },
      { label: 'Marketplace / Plataforma', value: 'marketplace' },
      { label: 'Servicios / Consultoría', value: 'services' },
    ],
  },
  {
    id: 'P2',
    text: '¿En qué fase de desarrollo se encuentra tu startup hoy?',
    subtitle: 'Nivel de Madurez',
    type: 'score',
    options: [
      { label: 'Idea o prueba de concepto inicial', value: 'idea', score: 1 },
      { label: 'Prototipo funcional o MVP lanzado', value: 'prototype', score: 2 },
      { label: 'Pilotos con clientes o primeros usuarios activos', value: 'pilots', score: 3 },
      { label: 'Ingresos recurrentes y tracción demostrada', value: 'revenue', score: 4 },
    ],
  },
  {
    id: 'P3',
    text: '¿Cuál es el estado actual de la validación de tu mercado?',
    subtitle: 'Validación Comercial',
    type: 'score',
    options: [
      { label: 'Validando el problema mediante entrevistas', value: 'discovery', score: 1 },
      { label: 'Tenemos cartas de intención o pilotos no pagados', value: 'lois', score: 2 },
      { label: 'Pilotos pagados o primeros ingresos iniciales', value: 'pilots', score: 3 },
      { label: 'Ingresos recurrentes demostrados o contratos firmados', value: 'revenue', score: 4 },
    ],
  },
  {
    id: 'P4',
    text: '¿Cuál es tu modelo de ingresos principal?',
    subtitle: 'Modelo de Negocio',
    type: 'tag',
    options: [
      { label: 'Suscripción (SaaS)', value: 'saas' },
      { label: 'Venta directa', value: 'direct' },
      { label: 'Marketplace / comisiones', value: 'marketplace' },
      { label: 'Freemium', value: 'freemium' },
      { label: 'Licenciamiento', value: 'licensing' },
    ],
  },
  {
    id: 'P5',
    text: '¿Cómo mides el impacto positivo de tu startup?',
    subtitle: 'Medición de Impacto',
    type: 'score',
    options: [
      { label: 'Aún no medimos o solo tenemos una narrativa cualitativa', value: 'none', score: 1 },
      { label: 'Tenemos métricas básicas internas de impacto', value: 'basic', score: 2 },
      { label: 'Contamos con verificación de terceros o certificaciones', value: 'verified', score: 4 },
    ],
  },
  {
    id: 'P6',
    text: '¿Cuánto capital buscas levantar en los próximos 12-18 meses?',
    subtitle: 'Necesidad de Financiamiento',
    type: 'score',
    options: [
      { label: 'Bootstrapping o menos de $250k', value: 'bootstrap', score: 1 },
      { label: 'Entre $250k y $1.5M', value: 'seed', score: 2 },
      { label: 'Entre $1.5M y $5M', value: 'seriesA', score: 3 },
      { label: 'Más de $5M', value: 'seriesB', score: 4 },
    ],
  },
  {
    id: 'P7',
    text: '¿Cuántas personas hay en tu equipo fundador?',
    subtitle: 'Equipo Fundador',
    type: 'tag',
    options: [
      { label: 'Solo founder', value: 'solo' },
      { label: '2 co-founders', value: 'duo' },
      { label: '3+ co-founders', value: 'trio' },
      { label: 'Equipo completo (>5)', value: 'full' },
    ],
  },
  {
    id: 'P8',
    text: '¿Cuál es el balance actual del equipo fundador?',
    subtitle: 'Composición del Equipo',
    type: 'score',
    options: [
      { label: 'Perfil 100% técnico/científico', value: 'tech', score: 1 },
      { label: 'Principalmente negocio, buscando expertise técnico', value: 'biz', score: 2 },
      { label: 'Equilibrado entre perfil técnico y de negocios', value: 'balanced', score: 3 },
    ],
  },
  {
    id: 'P9',
    text: '¿Cuál es tu principal obstáculo hoy?',
    subtitle: 'Cuello de Botella Operativo',
    type: 'tag',
    options: [
      { label: 'Encontrar product-market fit', value: 'pmf' },
      { label: 'Conseguir clientes', value: 'customers' },
      { label: 'Estructurar financieramente', value: 'finance' },
      { label: 'Levantar inversión', value: 'fundraising' },
    ],
  },
  {
    id: 'P10',
    text: '¿Si un inversor te pidiera acceso a tu Data Room hoy, qué tan listo estás?',
    subtitle: 'Preparación para Inversión',
    type: 'score',
    options: [
      { label: 'No tenemos Data Room estructurado aún', value: 'none', score: 1 },
      { label: 'Tenemos Pitch Deck básico y proyecciones a 12 meses', value: 'basic', score: 2 },
      { label: 'Modelo financiero y aspectos legales listos', value: 'ready', score: 3 },
      { label: 'Todo lo anterior + métricas de tracción y auditorías listas', value: 'full', score: 4 },
    ],
  },
]

/* ─── Profiles ─── */
const profiles = [
  {
    range: [6, 11] as [number, number],
    name: 'ETAPA 1: Pre-incubación',
    tag: 'Ideación',
    description: 'Tu startup está en fase de encontrar su idea y entender el mercado. Las herramientas de esta etapa te ayudarán a definir tu propósito, segmentar tu mercado y perfilar a tu usuario ideal.',
    tools: ['Propósito & Equipo', 'Segmentación de Mercado', 'Mercado inicial', 'Perfil del Usuario'],
    color: '#FF6B4A',
  },
  {
    range: [12, 18] as [number, number],
    name: 'ETAPA 2: Incubación',
    tag: 'Validación',
    description: 'Es momento de construir tu producto y conseguir tus primeros clientes. Enfócate en validar tu propuesta de valor, iterar con usuarios reales y estructurar tu modelo de negocio.',
    tools: ['Propuesta de Valor', 'Primeros 10 Clientes', 'Lean Canvas', 'Especificación de Producto'],
    color: '#0D9488',
  },
  {
    range: [19, 21] as [number, number],
    name: 'ETAPA 3: Aceleración',
    tag: 'Crecimiento',
    description: 'Tu modelo de negocio está validado y es momento de escalar. Optimiza tus unit economics, profesionaliza tu proceso de ventas y afina tu estrategia de pricing.',
    tools: ['Unit Economics', 'Proceso de Ventas', 'Modelo de Negocio', 'Framework de Pricing'],
    color: '#D97706',
  },
  {
    range: [22, 24] as [number, number],
    name: 'ETAPA 4: Escalamiento',
    tag: 'Escala',
    description: 'Estás listo para levantar capital significativo y ejecutar tu plan de producto a gran escala. Prepara tu pitch deck, estructura tu cap table y valida tu tracción para inversores.',
    tools: ['Pitch Deck', 'Cap Table', 'Plan de Producto', 'Validación de Tracción'],
    color: '#3B82F6',
  },
]

/* ─── Shared Styles ─── */
const inputStyle = {
  width: '100%',
  padding: '0.5rem 0 0.875rem',
  borderRadius: 0,
  border: 'none',
  borderBottom: '2px solid var(--color-border)',
  fontFamily: 'var(--font-body)',
  fontSize: 'var(--text-heading-md)',
  color: 'var(--color-ink)',
  outline: 'none',
  transition: 'border-color 0.2s',
  background: 'transparent',
  letterSpacing: '-0.01em',
} as const

const labelStyle = {
  display: 'block',
  fontFamily: 'var(--font-body)',
  fontSize: '0.75rem',
  fontWeight: 700,
  color: 'var(--color-text-muted)',
  textTransform: 'uppercase' as const,
  letterSpacing: '0.08em',
  marginBottom: '0.125rem',
} as const

/* ─── Responsive row helper ─── */
const rowStyle = {
  display: 'flex',
  gap: '0.75rem',
  flexWrap: 'wrap' as const,
}

const halfColStyle = {
  flex: '1 1 220px',
  minWidth: 0,
}

/* ─── Component ─── */
// eslint-disable-next-line @typescript-eslint/no-unused-vars
const TOTAL_STEPS = 12 // 0: contact, 1-10: questions, 11: loading, 12: results

export default function DiagnosticForm() {
  const [step, setStep] = useState(0)
  const [answers, setAnswers] = useState<Record<string, string>>({})
  const [scores, setScores] = useState<Record<string, number>>({})
  const [totalScore, setTotalScore] = useState(0)
  const [profile, setProfile] = useState(profiles[0])
  const [submitted, setSubmitted] = useState(false)
  const [countUp, setCountUp] = useState(0)
  const [phoneCountryCode, setPhoneCountryCode] = useState('+52')

  const { register, handleSubmit, formState: { errors } } = useForm<ContactData>({
    resolver: zodResolver(contactSchema),
  })

  const calculateResults = useCallback((currentScores: Record<string, number>) => {
    let total = 0
    const scoreQuestions = ['P2', 'P3', 'P5', 'P6', 'P8', 'P10']
    scoreQuestions.forEach(qId => {
      total += currentScores[qId] || 0
    })
    setTotalScore(total)
    const matched = profiles.find(p => total >= p.range[0] && total <= p.range[1]) || profiles[0]
    setProfile(matched)
    return { total, matched }
  }, [])

  const handleContactSubmit = (data: ContactData) => {
    const phone = data.phone ? `${phoneCountryCode} ${data.phone}` : undefined
    const selectedCountry = phoneCountryOptions.find(c => c.code === phoneCountryCode)
    setAnswers(prev => ({ ...prev, ...data, phone: phone || '', country: selectedCountry?.name || '' }))
    setStep(1)
  }

  const handleAnswer = (questionIndex: number, value: string, score?: number) => {
    const qId = questions[questionIndex].id
    
    // Create updated objects for answers and scores
    const updatedAnswers = { ...answers, [qId]: value }
    setAnswers(updatedAnswers)
    
    let updatedScores = scores
    if (score !== undefined) {
      updatedScores = { ...scores, [qId]: score }
      setScores(updatedScores)
    }

    setTimeout(() => {
      if (questionIndex < questions.length - 1) {
        setStep(questionIndex + 2)
      } else {
        // Final question! Calculate everything NOW to ensure the loading effect has the final data
        calculateResults(updatedScores)
        setStep(11) // loading
      }
    }, 400)
  }

  // Loading -> Results
  useEffect(() => {
    if (step === 11 && !submitted) {
      const { total, matched } = calculateResults(scores)

      const insertLead = async () => {
        try {
          await supabase.from('diagnostic_leads').insert({
            nombre: answers.nombre,
            email: answers.email,
            startup_name: answers.startup_name,
            startup_description: answers.startup_description || null,
            vertical: answers.vertical || null,
            country: answers.country || null,
            phone: answers.phone || null,
            website: answers.website || null,
            score: total,
            profile: matched.tag,
            answers: JSON.stringify(answers),
            tags: JSON.stringify({
              product_type: answers.P1,
              revenue_model: answers.P4,
              team_size: answers.P7,
              bottleneck: answers.P9,
            }),
          })
        } catch {
          // Continue to results even if DB fails
        }
      }

      const insertDiagnostic = async () => {
        try {
          const dimensionScores = {
            madurez: scores.P2 || 0,
            validacion: scores.P3 || 0,
            impacto: scores.P5 || 0,
            financiamiento: scores.P6 || 0,
            equipo: scores.P8 || 0,
            data_room: scores.P10 || 0,
          }

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

      // Store diagnostic results in localStorage for users who are not yet registered.
      // The AuthContext register() flow will pick this up and persist it to the profile.
      try {
        const stageTag = matched.tag
        const pendingData = {
          score: total,
          stage: stageTag,
          answers: { ...answers, scores: { ...scores } },
          completedAt: new Date().toISOString(),
        }
        localStorage.setItem('s4c_diagnostic_pending', JSON.stringify(pendingData))
      } catch {
        // localStorage unavailable — ignore
      }

      setTimeout(() => {
        setSubmitted(true)
        setStep(12)
      }, 2500)
    }
  }, [step, submitted, calculateResults, answers, scores])

  // Counter animation
  useEffect(() => {
    if (step === 12 && countUp < totalScore) {
      const timer = setTimeout(() => setCountUp(prev => prev + 1), 80)
      return () => clearTimeout(timer)
    }
  }, [step, countUp, totalScore])

  const progress = step <= 11 ? ((step) / 11) * 100 : 100

  const handleFocus = (e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    e.currentTarget.style.borderColor = 'var(--color-ink)'
  }

  const handleBlur = (fieldName: keyof ContactData) => (e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    e.currentTarget.style.borderColor = errors[fieldName] ? '#DC2626' : 'var(--color-border)'
  }

  return (
    <section id="diagnostico" style={{ padding: '4rem 0 6rem', background: 'var(--color-bg-primary)' }}>
      <div style={{ maxWidth: 760, margin: '0 auto', padding: '0 1.5rem' }}>
        <div style={{
          background: 'var(--color-paper)',
          borderRadius: 'var(--radius-lg)',
          border: '1px solid var(--color-border)',
          boxShadow: 'var(--shadow-float)',
          overflow: 'hidden',
          position: 'relative',
        }}>
          {/* Top gradient accent */}
          <div style={{
            height: 4,
            background: 'linear-gradient(90deg, #FF6B4A, #0D9488, #D97706, #3B82F6)',
          }} />

          {/* Progress bar */}
          {step < 12 && (
            <div style={{ padding: '1rem 2rem 0' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                <span style={{ fontFamily: 'var(--font-body)', fontSize: '0.6875rem', color: 'var(--color-text-muted)' }}>
                  {step === 0 ? 'Datos de contacto' : step <= 10 ? `Pregunta ${step}/10` : 'Procesando...'}
                </span>
                <span style={{ fontFamily: 'var(--font-body)', fontSize: '0.6875rem', color: 'var(--color-accent-primary)', fontWeight: 600 }}>
                  {Math.round(progress)}%
                </span>
              </div>
              <div style={{ height: 4, borderRadius: 2, background: 'var(--color-border)' }}>
                <motion.div
                  animate={{ width: `${progress}%` }}
                  transition={{ duration: 0.3 }}
                  style={{ height: '100%', borderRadius: 2, background: 'var(--color-accent-primary)' }}
                />
              </div>
            </div>
          )}

          <div style={{ padding: '1.5rem 2rem 2rem' }}>
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
                  <h3 style={{ fontFamily: 'var(--font-heading)', fontSize: 'var(--text-heading-lg)', fontWeight: 700, marginBottom: '0.375rem', color: 'var(--color-ink)', letterSpacing: '-0.03em' }}>
                    Realiza tu diagnóstico
                  </h3>
                  <p style={{ fontFamily: 'var(--font-body)', fontSize: '0.875rem', color: 'var(--color-text-secondary)', marginBottom: '1.25rem' }}>
                    Ingresa tus datos para recibir tu reporte personalizado.
                  </p>
                  <form onSubmit={handleSubmit(handleContactSubmit)} style={{ display: 'flex', flexDirection: 'column', gap: '0.625rem' }}>
                    {/* Row: Nombre + Email */}
                    <div style={rowStyle}>
                      <div style={halfColStyle}>
                        <label style={labelStyle}>Tu nombre</label>
                        <input
                          {...register('nombre')}
                          placeholder="María García"
                          style={{
                            ...inputStyle,
                            borderColor: errors.nombre ? '#DC2626' : 'var(--color-border)',
                          }}
                          onFocus={handleFocus}
                          onBlur={handleBlur('nombre')}
                        />
                        {errors.nombre && (
                          <p style={{ fontFamily: 'var(--font-body)', fontSize: '0.75rem', color: '#DC2626', marginTop: '0.125rem' }}>
                            {errors.nombre.message}
                          </p>
                        )}
                      </div>
                      <div style={halfColStyle}>
                        <label style={labelStyle}>Email</label>
                        <input
                          {...register('email')}
                          placeholder="maria@startup.com"
                          style={{
                            ...inputStyle,
                            borderColor: errors.email ? '#DC2626' : 'var(--color-border)',
                          }}
                          onFocus={handleFocus}
                          onBlur={handleBlur('email')}
                        />
                        {errors.email && (
                          <p style={{ fontFamily: 'var(--font-body)', fontSize: '0.75rem', color: '#DC2626', marginTop: '0.125rem' }}>
                            {errors.email.message}
                          </p>
                        )}
                      </div>
                    </div>

                    {/* Row: Startup Name + Vertical */}
                    <div style={rowStyle}>
                      <div style={halfColStyle}>
                        <label style={labelStyle}>Nombre de tu startup</label>
                        <input
                          {...register('startup_name')}
                          placeholder="Mi Startup"
                          style={{
                            ...inputStyle,
                            borderColor: errors.startup_name ? '#DC2626' : 'var(--color-border)',
                          }}
                          onFocus={handleFocus}
                          onBlur={handleBlur('startup_name')}
                        />
                        {errors.startup_name && (
                          <p style={{ fontFamily: 'var(--font-body)', fontSize: '0.75rem', color: '#DC2626', marginTop: '0.125rem' }}>
                            {errors.startup_name.message}
                          </p>
                        )}
                      </div>
                      <div style={halfColStyle}>
                        <label style={labelStyle}>Vertical</label>
                        <select
                          {...register('vertical')}
                          defaultValue=""
                          style={{
                            ...inputStyle,
                            borderColor: errors.vertical ? '#DC2626' : 'var(--color-border)',
                            appearance: 'none',
                            backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 12 12'%3E%3Cpath fill='%236B7280' d='M2 4l4 4 4-4'/%3E%3C/svg%3E")`,
                            backgroundRepeat: 'no-repeat',
                            backgroundPosition: 'right 1rem center',
                            paddingRight: '2.5rem',
                          }}
                          onFocus={handleFocus}
                          onBlur={handleBlur('vertical')}
                        >
                          <option value="" disabled>Selecciona vertical</option>
                          {verticalOptions.map(v => (
                            <option key={v} value={v}>{v}</option>
                          ))}
                        </select>
                        {errors.vertical && (
                          <p style={{ fontFamily: 'var(--font-body)', fontSize: '0.75rem', color: '#DC2626', marginTop: '0.125rem' }}>
                            {errors.vertical.message}
                          </p>
                        )}
                      </div>
                    </div>

                    {/* Startup Description (full width) */}
                    <div>
                      <label style={labelStyle}>Describe brevemente tu idea</label>
                      <textarea
                        {...register('startup_description')}
                        placeholder="¿Qué problema resuelve tu startup y para quién?"
                        rows={2}
                        style={{
                          ...inputStyle,
                          resize: 'vertical' as const,
                          minHeight: 64,
                          borderColor: errors.startup_description ? '#DC2626' : 'var(--color-border)',
                        }}
                        onFocus={handleFocus}
                        onBlur={handleBlur('startup_description')}
                      />
                      {errors.startup_description && (
                        <p style={{ fontFamily: 'var(--font-body)', fontSize: '0.75rem', color: '#DC2626', marginTop: '0.125rem' }}>
                          {errors.startup_description.message}
                        </p>
                      )}
                    </div>

                    {/* Row: Country phone code + Phone */}
                    <div style={rowStyle}>
                      <div style={{ flex: '0 0 auto', minWidth: 130 }}>
                        <label style={labelStyle}>País</label>
                        <select
                          value={phoneCountryCode}
                          onChange={(e) => setPhoneCountryCode(e.target.value)}
                          style={{
                            ...inputStyle,
                            appearance: 'none',
                            backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 12 12'%3E%3Cpath fill='%236B7280' d='M2 4l4 4 4-4'/%3E%3C/svg%3E")`,
                            backgroundRepeat: 'no-repeat',
                            backgroundPosition: 'right 0.5rem center',
                            paddingRight: '1.75rem',
                          }}
                          onFocus={handleFocus}
                        >
                          {phoneCountryOptions.map(c => (
                            <option key={c.code + c.name} value={c.code}>
                              {c.flag} {c.code}
                            </option>
                          ))}
                        </select>
                      </div>
                      <div style={{ flex: '1 1 160px', minWidth: 0 }}>
                        <label style={labelStyle}>Teléfono (WhatsApp)</label>
                        <input
                          {...register('phone')}
                          placeholder="55 1234 5678"
                          style={{
                            ...inputStyle,
                            borderColor: errors.phone ? '#DC2626' : 'var(--color-border)',
                          }}
                          onFocus={handleFocus}
                          onBlur={handleBlur('phone')}
                        />
                      </div>
                    </div>

                    {/* Website (optional, full width) */}
                    <div>
                      <label style={labelStyle}>Sitio web (opcional)</label>
                      <input
                        {...register('website')}
                        placeholder="https://..."
                        style={{
                          ...inputStyle,
                          borderColor: errors.website ? '#DC2626' : 'var(--color-border)',
                        }}
                        onFocus={handleFocus}
                        onBlur={handleBlur('website')}
                      />
                    </div>

                    <button
                      type="submit"
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '0.5rem',
                        width: '100%',
                        padding: '1rem',
                        borderRadius: 'var(--radius-full)',
                        background: 'var(--color-ink)',
                        color: 'white',
                        fontFamily: 'var(--font-body)',
                        fontSize: '0.9375rem',
                        fontWeight: 700,
                        border: 'none',
                        cursor: 'pointer',
                        transition: 'background 0.2s, transform 0.2s var(--ease-spring)',
                        marginTop: '0.25rem',
                        letterSpacing: '-0.01em',
                      }}
                      onMouseEnter={(e) => { e.currentTarget.style.background = 'var(--color-accent-primary)'; e.currentTarget.style.transform = 'translateY(-2px)' }}
                      onMouseLeave={(e) => { e.currentTarget.style.background = 'var(--color-ink)'; e.currentTarget.style.transform = 'translateY(0)' }}
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
                  <p style={{ fontSize: '0.75rem', fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--color-accent-primary)', marginBottom: '0.5rem' }}>
                    {questions[step - 1].subtitle}
                  </p>
                  <h3 style={{ fontFamily: 'var(--font-heading)', fontSize: 'var(--text-heading-lg)', fontWeight: 700, letterSpacing: '-0.03em', color: 'var(--color-ink)', marginBottom: '1.5rem', lineHeight: 1.3 }}>
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
                            padding: '1.25rem 1.5rem',
                            borderRadius: 'var(--radius-lg)',
                            border: selected ? '2px solid var(--color-ink)' : '1.5px solid var(--color-border)',
                            background: selected ? 'rgba(25,25,25,0.03)' : 'var(--color-paper)',
                            cursor: 'pointer',
                            textAlign: 'left',
                            transition: 'all 0.2s var(--ease-smooth)',
                            fontFamily: 'var(--font-body)',
                            fontSize: 'var(--text-body-lg)',
                            fontWeight: 500,
                            color: 'var(--color-ink)',
                            width: '100%',
                          }}
                          onMouseEnter={(e) => { if (!selected) { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = 'var(--shadow-float)' } }}
                          onMouseLeave={(e) => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = 'none' }}
                        >
                          <div style={{
                            width: 20,
                            height: 20,
                            borderRadius: '50%',
                            border: selected ? '6px solid var(--color-accent-primary)' : '2px solid var(--color-border)',
                            flexShrink: 0,
                            transition: 'border 0.2s var(--ease-smooth)',
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
                  <Loader2 size={40} color="var(--color-accent-primary)" style={{ animation: 'spin 1s linear infinite', margin: '0 auto 1rem' }} />
                  <style>{`@keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }`}</style>
                  <h3 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.25rem', fontWeight: 700, color: 'var(--color-ink)', marginBottom: '0.5rem', letterSpacing: '-0.02em' }}>
                    Analizando tu startup...
                  </h3>
                  <p style={{ fontFamily: 'var(--font-body)', fontSize: '0.875rem', color: 'var(--color-text-secondary)' }}>
                    Calculando tu Startup Readiness Score y preparando tu roadmap personalizado.
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
                    <CheckCircle2 size={32} color={profile.color} style={{ margin: '0 auto 0.75rem' }} />
                    <h3 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.5rem', fontWeight: 700, color: 'var(--color-ink)', marginBottom: '0.375rem', letterSpacing: '-0.03em' }}>
                      Tu Startup Readiness Score
                    </h3>
                    <div style={{
                      fontFamily: 'var(--font-body)',
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
                      borderRadius: 'var(--radius-full)',
                      background: `${profile.color}10`,
                      border: `1px solid ${profile.color}30`,
                      fontFamily: 'var(--font-body)',
                      fontSize: '0.8125rem',
                      fontWeight: 700,
                      color: profile.color,
                    }}>
                      {profile.name}
                    </span>
                  </div>

                  {/* Score bar */}
                  <div style={{ margin: '0 0 1.5rem' }}>
                    <div style={{ height: 8, borderRadius: 4, background: 'var(--color-border)', position: 'relative' }}>
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${(totalScore / 24) * 100}%` }}
                        transition={{ duration: 1, delay: 0.3 }}
                        style={{ height: '100%', borderRadius: 4, background: profile.color }}
                      />
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '0.375rem' }}>
                      <span style={{ fontFamily: 'var(--font-body)', fontSize: '0.625rem', color: 'var(--color-text-muted)' }}>Pre-incubación</span>
                      <span style={{ fontFamily: 'var(--font-body)', fontSize: '0.625rem', color: 'var(--color-text-muted)' }}>Incubación</span>
                      <span style={{ fontFamily: 'var(--font-body)', fontSize: '0.625rem', color: 'var(--color-text-muted)' }}>Aceleración</span>
                      <span style={{ fontFamily: 'var(--font-body)', fontSize: '0.625rem', color: 'var(--color-text-muted)' }}>Escalamiento</span>
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
                    borderRadius: 'var(--radius-lg)',
                    background: 'var(--color-bg-primary)',
                    border: '1px solid var(--color-border)',
                    marginBottom: '1.5rem',
                  }}>
                    <h4 style={{ fontFamily: 'var(--font-heading)', fontSize: '0.9375rem', fontWeight: 700, marginBottom: '0.75rem', color: 'var(--color-ink)', letterSpacing: '-0.02em' }}>
                      Tu Caja de Herramientas
                    </h4>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                      {profile.tools.map(tool => (
                        <span key={tool} style={{
                          padding: '0.375rem 0.875rem',
                          borderRadius: 'var(--radius-full)',
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
                      href="/tools"
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '0.5rem',
                        width: '100%',
                        padding: '1rem',
                        borderRadius: 'var(--radius-full)',
                        background: 'var(--color-ink)',
                        color: 'white',
                        fontFamily: 'var(--font-body)',
                        fontSize: '0.9375rem',
                        fontWeight: 700,
                        textDecoration: 'none',
                        transition: 'background 0.2s, transform 0.2s var(--ease-spring)',
                        letterSpacing: '-0.01em',
                      }}
                      onMouseEnter={(e) => { e.currentTarget.style.background = 'var(--color-accent-primary)'; e.currentTarget.style.transform = 'translateY(-2px)' }}
                      onMouseLeave={(e) => { e.currentTarget.style.background = 'var(--color-ink)'; e.currentTarget.style.transform = 'translateY(0)' }}
                    >
                      Acceder a las Herramientas <ArrowRight size={18} />
                    </a>
                    <a
                      href="https://calendly.com"
                      target="_blank"
                      rel="noopener noreferrer"
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        width: '100%',
                        padding: '1rem',
                        borderRadius: 'var(--radius-full)',
                        background: 'transparent',
                        border: '1.5px solid var(--color-ink)',
                        color: 'var(--color-ink)',
                        fontFamily: 'var(--font-body)',
                        fontSize: '0.9375rem',
                        fontWeight: 700,
                        textDecoration: 'none',
                        transition: 'all 0.2s var(--ease-smooth)',
                        letterSpacing: '-0.01em',
                      }}
                      onMouseEnter={(e) => { e.currentTarget.style.background = 'var(--color-ink)'; e.currentTarget.style.color = 'var(--color-paper)' }}
                      onMouseLeave={(e) => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = 'var(--color-ink)' }}
                    >
                      Agenda una Sesión Estratégica
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
