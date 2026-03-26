'use client'

import { useState } from 'react'
import { Download, ChevronDown, ChevronRight } from 'lucide-react'
import { useToolState } from '@/lib/useToolState'
import type { ToolComponentProps } from './ToolPage'

const SECTIONS = [
  {
    id: 'team', title: '1. Equipo Fundador', color: '#7C3AED',
    intro: 'Los inversores climáticos primero invierten en el equipo. Prepara respuestas honestas — los gaps son oportunidades de mejora, no descalificadores.',
    questions: [
      { id: 'q_t1', label: '¿Tiene el equipo experiencia técnica en el sector específico (no solo en ciencia)?', placeholder: 'Ej: El CTO tiene 8 años en electroquímica industrial y ha trabajado en 2 scaleups de electrolizadores' },
      { id: 'q_t2', label: '¿Existe un co-fundador o líder comercial con track record en ventas B2B industriales?', placeholder: 'Ej: El CEO tiene 10 años en Pemex, lideró $200M en contratos de proveedor industrial' },
      { id: 'q_t3', label: '¿Tienen el equipo completo para llegar al hito de TRL 7 / primer piloto pagado?', placeholder: 'Gaps identificados: Necesitamos un CFO con experiencia en project finance y un Sales Director con red en industria' },
      { id: 'q_t4', label: '¿Cuál es el plan de vesting y qué pasa si un co-fundador sale?', placeholder: '4 años de vesting, 1 año cliff. Existe shareholder agreement firmado con drag-along y tag-along.' },
    ],
  },
  {
    id: 'tech', title: '2. Tecnología e IP', color: '#0891B2',
    intro: 'Los inversores contratarán un Technical Due Diligence independiente. Prepara la documentación antes de que llegue el term sheet.',
    questions: [
      { id: 'q_tech1', label: '¿A qué TRL está realmente la tecnología HOY (con evidencia)?', placeholder: 'TRL 5: Validado en laboratorio a 10 kW con 200 horas de operación. Datos de rendimiento disponibles.' },
      { id: 'q_tech2', label: '¿Qué IP está protegida (patentes, trade secrets, contratos)?', placeholder: '1 patente provisional en tramitación (USPTO, Feb 2024). Know-how protegido por NDA con toda la plantilla.' },
      { id: 'q_tech3', label: '¿Cuáles son los riesgos técnicos principales y cómo los estás mitigando?', placeholder: 'Riesgo 1: Degradación de la membrana a 80°C. Mitigación: Testing acelerado con 3 proveedores alternativos.' },
      { id: 'q_tech4', label: '¿Qué demuestra que tu solución es superior a las alternativas existentes?', placeholder: '30% menor consumo energético vs. electrolizadores PEM de Siemens (datos de lab, no publicados aún).' },
    ],
  },
  {
    id: 'market', title: '3. Mercado y Tracción', color: '#059669',
    intro: 'La tracción convence más que cualquier análisis de mercado. Muestra evidencia concreta de que el mercado quiere tu solución hoy.',
    questions: [
      { id: 'q_m1', label: '¿Cuántos clientes potenciales has entrevistado? ¿Qué te dijeron exactamente?', placeholder: '25 entrevistas con VPs de Operaciones de petroquímicas. El 72% paga hoy >$5/kg por H2 gris y busca alternativas.' },
      { id: 'q_m2', label: '¿Qué evidencia de tracción tienes (LOIs, pilotos, ingresos)?', placeholder: '2 LOIs firmados con Pemex Fertilizantes y Ternium. 1 piloto pagado de $80K en ejecución desde Oct 2024.' },
      { id: 'q_m3', label: '¿Quiénes son tus competidores directos e indirectos y por qué ganarás?', placeholder: 'Directos: Nel Hydrogen (Noruega, TRL9), ITM Power (UK). Ventaja: 30% más barato en OPEX para escala <5MW.' },
      { id: 'q_m4', label: '¿Cuál es tu Go-to-Market para los primeros $1M ARR?', placeholder: 'Año 1: 3 pilotos en México (red de ex-Pemex del CEO). Año 2: Chile y Colombia via alianza con ENGIE Latam.' },
    ],
  },
  {
    id: 'finance', title: '4. Finanzas y Modelo', color: '#D97706',
    intro: 'Los inversores climáticos entienden que el hardware tarda en escalar. Pero necesitan ver un path creíble a la rentabilidad y supuestos defendibles.',
    questions: [
      { id: 'q_f1', label: '¿Cuáles son los unit economics reales (no aspiracionales)?', placeholder: 'CAC actual: $120K. LTV proyectado por contrato 10 años: $1.2M. Gross margin en escala: ~45%.' },
      { id: 'q_f2', label: '¿Cuál es el burn mensual, runway actual y cómo llegas al siguiente hito?', placeholder: 'Burn: $55K/mes. Runway: 14 meses. Hito post-ronda: TRL 7 + 2 pilotos pagados en 18 meses.' },
      { id: 'q_f3', label: '¿En qué supuesto cambia más dramáticamente tu modelo financiero?', placeholder: 'El precio de la electricidad renovable. Sensibilidad: $0.01/kWh de variación = 8% en margen bruto.' },
      { id: 'q_f4', label: '¿Cuál es el camino más realista a la rentabilidad operacional?', placeholder: 'Q3 2026 con 3 plantas FOAK operativas. EBITDA positivo con 5MW acumulados de capacidad instalada.' },
    ],
  },
  {
    id: 'impact', title: '5. Impacto Climático y ESG', color: '#10B981',
    intro: 'Para inversores climáticos, el impacto es tan importante como el retorno. Necesitas métricas auditables, no storytelling.',
    questions: [
      { id: 'q_i1', label: '¿Cuál es tu metodología de medición de impacto (LCA, GHG Protocol, etc.)?', placeholder: 'LCA siguiendo ISO 14044. Scope 1 y 2 medidos directamente. Scope 3 con factor de emisión de red eléctrica.' },
      { id: 'q_i2', label: '¿Cuántas tCO2eq evitas por unidad / por año a escala?', placeholder: 'Por planta FOAK 1MW: 850 tCO2eq/año vs H2 gris. A 10 plantas (2027): 8,500 tCO2eq/año.' },
      { id: 'q_i3', label: '¿Cómo evitas el riesgo de greenwashing en tu medición?', placeholder: 'Datos verificados por DNV cada año. Reporte de impacto público. Metodología SBTI-aligned.' },
      { id: 'q_i4', label: '¿Tienes políticas de diversidad, gobierno y ética ya establecidas?', placeholder: 'Política de diversidad: 40% mujeres en equipo directivo (2024). Advisory Board con representación indígena en proyectos rurales.' },
    ],
  },
  {
    id: 'risks', title: '6. Riesgos y Mitigaciones', color: '#DC2626',
    intro: 'Los inversores prefieren fundadores que conocen sus riesgos a fundadores que los niegan. Prepara un risk register honesto.',
    questions: [
      { id: 'q_r1', label: '¿Cuáles son los 3 riesgos que podrían matar el negocio?', placeholder: '1. Fallo técnico del prototipo escala. 2. Caída del precio del H2 gris. 3. No conseguir offtake en 18 meses.' },
      { id: 'q_r2', label: '¿Qué planes de contingencia tienes para cada riesgo principal?', placeholder: '1. Proveedor alternativo de membranas identificado. 2. Modelo es rentable hasta $1.2/kg H2 gris. 3. LOIs como bridge.' },
      { id: 'q_r3', label: '¿Qué dependencias regulatorias o de política pública tienes?', placeholder: 'Incentivos de CONACYT (20% del financiamiento). Riesgo: cambio de administración. Mitigo: contratos pre-firmados.' },
    ],
  },
]

export default function ReverseDueDiligence({ userId, onComplete, onGenerateReport }: ToolComponentProps) {
  const [values, setValues] = useToolState(userId, 'reverse-dd', {} as Record<string, string>)
  const [openSections, setOpenSections] = useState<Set<string>>(new Set())

  const allQuestions = SECTIONS.flatMap((s) => s.questions)
  const filled = allQuestions.filter((q) => values[q.id]?.trim()).length
  const pct = Math.round((filled / allQuestions.length) * 100)

  const handleReport = () => {
    const content = `
REVERSE DUE DILIGENCE — PREPARACIÓN PARA INVERSORES
Completado: ${filled}/${allQuestions.length} preguntas (${pct}%)

════════════════════════════════════════════════

${SECTIONS.map((s) => `
${'═'.repeat(60)}
${s.title.toUpperCase()}
${'═'.repeat(60)}

${s.questions.map((q) => `▶ ${q.label}

${values[q.id] || '(Sin respuesta)'}`).join('\n\n───────────────────────────────────\n\n')}`).join('\n\n')}

════════════════════════════════════════════════

CHECKLIST FINAL PRE-RAISE:
□ Todos los miembros del equipo tienen contratos y NDAs firmados
□ Data room completado (ver herramienta Data Room)
□ Cap table actualizado y documentado
□ Modelo financiero auditado por tercero
□ LCA / Environmental impact report disponible
□ Pipeline de inversores identificado con warm intros
□ Term sheet template revisado por abogado especializado en VC

Este documento está diseñado para uso interno.
NO compartas versión completa con inversores antes de revisar.
    `.trim()
    onGenerateReport(content)
    onComplete()
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
      {/* Progress */}
      <div style={{ background: 'var(--color-bg-card)', borderRadius: 12, border: '1px solid var(--color-border)', padding: '1rem 1.25rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.375rem' }}>
          <span style={{ fontFamily: 'var(--font-body)', fontSize: '0.875rem', fontWeight: 600, color: 'var(--color-text-primary)' }}>Preparación completada</span>
          <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.875rem', fontWeight: 700, color: pct >= 80 ? '#059669' : '#D97706' }}>{filled}/{allQuestions.length} · {pct}%</span>
        </div>
        <div style={{ height: 6, borderRadius: 3, background: 'var(--color-bg-muted)' }}>
          <div style={{ height: '100%', borderRadius: 3, background: pct >= 80 ? '#059669' : pct >= 50 ? '#D97706' : '#DC2626', width: `${pct}%`, transition: 'width 0.4s' }} />
        </div>
        {pct < 80 && (
          <p style={{ fontFamily: 'var(--font-body)', fontSize: '0.75rem', color: 'var(--color-text-muted)', marginTop: '0.5rem' }}>
            Completa al menos el 80% antes de iniciar conversaciones con inversores.
          </p>
        )}
      </div>

      {/* Sections */}
      {SECTIONS.map((sec) => {
        const secFilled = sec.questions.filter((q) => values[q.id]?.trim()).length
        const isOpen = openSections.has(sec.id)
        return (
          <div key={sec.id} style={{ background: 'var(--color-bg-card)', borderRadius: 14, border: '1px solid var(--color-border)', overflow: 'hidden', boxShadow: 'var(--shadow-card)' }}>
            <button onClick={() => setOpenSections((s) => { const n = new Set(s); isOpen ? n.delete(sec.id) : n.add(sec.id); return n })}
              style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0.875rem 1.25rem', background: `${sec.color}08`, border: 'none', cursor: 'pointer' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.625rem' }}>
                <div style={{ width: 6, height: 6, borderRadius: '50%', background: sec.color }} />
                <span style={{ fontFamily: 'var(--font-heading)', fontSize: '0.9375rem', fontWeight: 600, color: 'var(--color-text-primary)' }}>{sec.title}</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.625rem', color: secFilled === sec.questions.length ? '#059669' : sec.color }}>{secFilled}/{sec.questions.length}</span>
                {isOpen ? <ChevronDown size={14} color="#9CA3AF" /> : <ChevronRight size={14} color="#9CA3AF" />}
              </div>
            </button>
            {isOpen && (
              <div style={{ padding: '1.25rem' }}>
                <div style={{ padding: '0.75rem', borderRadius: 8, background: `${sec.color}06`, border: `1px solid ${sec.color}15`, marginBottom: '1rem' }}>
                  <p style={{ fontFamily: 'var(--font-body)', fontSize: '0.8125rem', lineHeight: 1.6, color: 'var(--color-text-secondary)' }}>{sec.intro}</p>
                </div>
                {sec.questions.map((q) => (
                  <div key={q.id} style={{ marginBottom: '1rem' }}>
                    <label style={{ display: 'block', fontFamily: 'var(--font-body)', fontSize: '0.8125rem', fontWeight: 600, color: 'var(--color-text-primary)', marginBottom: '0.375rem', lineHeight: 1.4 }}>{q.label}</label>
                    <textarea value={values[q.id] || ''} onChange={(e) => setValues((p) => ({ ...p, [q.id]: e.target.value }))} placeholder={q.placeholder} rows={3}
                      style={{ width: '100%', padding: '0.625rem 0.75rem', borderRadius: 8, border: `1px solid ${values[q.id] ? sec.color + '30' : 'var(--color-border)'}`, fontFamily: 'var(--font-body)', fontSize: '0.875rem', lineHeight: 1.5, color: 'var(--color-text-primary)', outline: 'none', resize: 'vertical', background: 'var(--color-bg-primary)', transition: 'border 0.15s' }}
                      onFocus={(e) => (e.currentTarget.style.borderColor = sec.color)}
                      onBlur={(e) => (e.currentTarget.style.borderColor = values[q.id] ? sec.color + '30' : 'var(--color-border)')}
                    />
                  </div>
                ))}
              </div>
            )}
          </div>
        )
      })}

      <button onClick={handleReport} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', width: '100%', padding: '0.875rem', borderRadius: 12, background: '#DC2626', color: 'white', fontFamily: 'var(--font-body)', fontSize: '0.9375rem', fontWeight: 600, border: 'none', cursor: 'pointer', boxShadow: '0 4px 14px rgba(220,38,38,0.3)', transition: 'all 0.2s' }}
        onMouseEnter={(e) => (e.currentTarget.style.background = '#B91C1C')}
        onMouseLeave={(e) => (e.currentTarget.style.background = '#DC2626')}
      >
        <Download size={17} /> Generar Due Diligence Completo
      </button>
    </div>
  )
}
