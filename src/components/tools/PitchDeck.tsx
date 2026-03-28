'use client'

import { useState } from 'react'
import { Download, ChevronDown, ChevronRight } from 'lucide-react'
import { useToolState } from '@/lib/useToolState'
import type { ToolComponentProps } from './ToolPage'

const SLIDES = [
  { id: 's1', title: '1. Portada', color: '#7C3AED', guide: 'Nombre de la startup, logo, tagline de 1 línea, nombre del fundador y fecha. El tagline debe responder: "¿Qué haces y para quién?"', fields: [{ id: 'tagline', label: 'Tagline (1 línea)', ph: 'Ej: Producimos hidrógeno verde a paridad de precio con el hidrógeno gris' }, { id: 'name_role', label: 'Nombre del presentador y cargo', ph: 'María García, CEO & Co-fundadora' }] },
  { id: 's2', title: '2. El Problema', color: '#DC2626', guide: 'Cuantifica el problema. ¿Cuánto CO2 emite este sector? ¿Cuánto dinero pierde el cliente por no resolverlo? Las métricas hacen el problema creíble.', fields: [{ id: 'problem_stat', label: 'Estadística clave del problema', ph: 'Ej: El sector industrial representa el 20% de las emisiones globales de CO2 y no tiene alternativas de descarbonización accesibles' }, { id: 'current_solutions', label: 'Soluciones actuales y sus limitaciones', ph: 'Ej: Compensación de carbono (no reduce emisiones reales), hidrógeno gris (2x más barato pero fósil)' }] },
  { id: 's3', title: '3. La Solución', color: '#059669', guide: 'Demo o visualización si es posible. ¿Cómo funciona en 30 segundos? Evita jargon científico. El inversionista no es experto.', fields: [{ id: 'solution_desc', label: 'Descripción de la solución (sin jerga)', ph: 'Ej: Un electrolizador de nueva generación que usa agua y electricidad renovable para producir hidrógeno verde a $1.5/kg' }, { id: 'differentiation', label: '¿Qué te hace diferente a nivel técnico?', ph: 'Ej: Nuestra membrana propietaria reduce el consumo energético un 30% vs. soluciones actuales' }] },
  { id: 's4', title: '4. Tecnología y TRL', color: '#0891B2', guide: 'Este slide es crucial para inversores climáticos. Muestra TRL actual, IP, y timeline al siguiente nivel. Los inversores necesitan entender el riesgo técnico.', fields: [{ id: 'trl_current', label: 'TRL actual y evidencia', ph: 'TRL 6: Prototipo validado en planta piloto de 100 kW. 500 horas de operación documentadas.' }, { id: 'ip_status', label: 'Estado de la IP (patentes, trade secrets)', ph: '2 patentes provisionales en proceso en US y EU. Know-how protegido por secreto comercial.' }, { id: 'trl_timeline', label: 'Timeline al TRL comercial', ph: 'TRL 7 (12 meses): Piloto 1 MW. TRL 8 (24 meses): FOAK 10 MW.' }] },
  { id: 's5', title: '5. Mercado', color: '#D97706', guide: 'TAM/SAM/SOM con fuentes. El TAM climático tiende a ser enorme, pero eso no es creíble sin un SAM y SOM bien definidos. Muestra tu ruta al $100M ARR.', fields: [{ id: 'tam', label: 'TAM (Mercado Total Disponible)', ph: 'Ej: $800B en hidrógeno industrial global para 2030 (BloombergNEF)' }, { id: 'sam', label: 'SAM (Mercado Dirigible)', ph: 'Ej: $45B en descarbonización industrial en Latam 2025-2030' }, { id: 'som', label: 'SOM (Mercado Objetivo a 5 años)', ph: 'Ej: $150M en captura de 5 plantas FOAK + 20 pilotos industriales' }] },
  { id: 's6', title: '6. Modelo de Negocio', color: '#7C3AED', guide: 'HaaS/PPA es el modelo más atractivo para inversores climáticos porque genera ingresos recurrentes. Muestra el unit economics: ¿cuánto ganas por unidad desplegada?', fields: [{ id: 'business_model', label: 'Modelo de ingresos principal', ph: 'HaaS (Hardware-as-a-Service): Cliente paga $X/MWh producido. Sin CAPEX para el cliente.' }, { id: 'unit_economics', label: 'Unit economics clave', ph: 'CAC: $50K, LTV: $900K, LTV/CAC: 18x, Payback: 4 años' }, { id: 'pricing', label: 'Estrategia de precio vs. alternativa', ph: 'Precio: $2.5/kg H2. Paridad con H2 gris proyectada para 2027 a escala.' }] },
  { id: 's7', title: '7. Impacto Ambiental (ERP)', color: '#10B981', guide: 'Este slide diferencia tu pitch de uno de SaaS. Los inversores climáticos evaluarán esto en su Due Diligence. Sé específico con la metodología.', fields: [{ id: 'erp', label: 'Emisiones Reducidas Proyectadas (ERP)', ph: 'Una planta FOAK de 10 MW reduce 8,500 tCO2eq/año. A escala de 10 plantas: 85,000 tCO2eq/año' }, { id: 'lca', label: 'Resumen del LCA (si disponible)', ph: 'LCA preliminar (NREL 2024): 2.1 kgCO2eq/kgH2 vs. 10.9 kgCO2eq/kgH2 del H2 gris' }, { id: 'sdgs', label: 'SDGs relevantes', ph: 'SDG 7 (Energía limpia), SDG 13 (Acción climática), SDG 9 (Industria sostenible)' }] },
  { id: 's8', title: '8. Tracción y Go-to-Market', color: '#059669', guide: 'Muestra evidencia de que el mercado quiere tu solución HOY. LOIs, pilotos pagados, conversaciones avanzadas. La tracción convence más que cualquier análisis de mercado.', fields: [{ id: 'traction', label: 'Tracción actual (LOIs, pilotos, ingresos)', ph: '2 LOIs firmados con empresas del Fortune 500. 1 piloto pagado en ejecución ($120K). 3 conversaciones avanzadas.' }, { id: 'gtm', label: 'Estrategia de Go-to-Market', ph: 'Año 1: 2 pilotos B2B en México. Año 2: Expansión a Chile y Colombia via partnerships energéticos.' }] },
  { id: 's9', title: '9. Equipo', color: '#7C3AED', guide: 'Para climate tech, el equipo debe tener: (1) expertise científico/técnico y (2) expertise comercial/industrial. Muestra track record, no solo títulos.', fields: [{ id: 'team_desc', label: 'Equipo fundador y track record', ph: 'CEO: 10 años en industria petroquímica (ex-Pemex). CTO: PhD MIT en electroquímica, 8 papers publicados.' }, { id: 'advisors', label: 'Advisors y respaldos clave', ph: 'Prof. X (Nobel Chemistry 2022), ex-CEO de empresa energética, partner de fondo climático top 10' }] },
  { id: 's10', title: '10. Finanzas', color: '#D97706', guide: 'P&L a 5 años, camino a la rentabilidad y supuestos claramente documentados. Los inversores climáticos entienden que los negocios de hardware tardan más en ser rentables.', fields: [{ id: 'financials', label: 'Proyección de ingresos a 3 años', ph: '2025: $500K (1 piloto). 2026: $2.5M (3 plantas). 2027: $12M (8 plantas FOAK)' }, { id: 'burn_runway', label: 'Burn mensual actual y runway', ph: '$45K/mes burn. Runway actual: 18 meses. Post-ronda: 36 meses.' }] },
  { id: 's11', title: '11. Levantamiento y Uso de Fondos', color: '#DC2626', guide: 'Sé específico en el uso de fondos. Vincula cada partida a un hito medible (TRL, KPI). Muestra cómo llegas al TRL 8 con esta ronda.', fields: [{ id: 'raise', label: 'Monto a levantar y tipo de instrumento', ph: '$3M — SAFE con cap de $15M pre-money (o Equity Seed Round)' }, { id: 'use_of_funds', label: 'Uso de fondos (vinculado a hitos)', ph: '40% I+D (Prototipo 1 MW — TRL 7), 35% Primer Piloto Comercial, 15% Equipo, 10% Operaciones' }] },
  { id: 's12', title: '12. Visión y Ask', color: '#059669', guide: 'Termina con la visión grande y el ask concreto. ¿Qué pides al inversionista más allá del capital? ¿Conexiones en la industria? ¿Co-liderazgo de ronda?', fields: [{ id: 'vision', label: 'Visión a 10 años', ph: 'En 2035, nuestras plantas producen el 5% del hidrógeno verde global, evitando 50M tCO2eq/año' }, { id: 'ask', label: 'El Ask específico', ph: 'Buscamos $3M en Q1 2025. Lead investor preferiblemente con portfolio en energía industrial y Latam.' }] },
]

export default function PitchDeck({ userId, onComplete, onGenerateReport, toolStorageId }: ToolComponentProps) {
  const [values, setValues] = useToolState(userId, toolStorageId ?? 'pitch-deck', {} as Record<string, string>)
  const [openSlides, setOpenSlides] = useState(new Set(['s1', 's2']))

  const allFields = SLIDES.flatMap((s) => s.fields)
  const filled = allFields.filter((f) => values[f.id]?.trim()).length

  const handleReport = () => {
    const content = `
PITCH DECK SCIENCE-TO-BUSINESS — GUÍA COMPLETA

${SLIDES.map((s) => `
${s.title.toUpperCase()}
${s.guide}

${s.fields.map((f) => `${f.label}:
${values[f.id] || '(Sin completar)'}`).join('\n\n')}`).join('\n\n' + '─'.repeat(60) + '\n\n')}

Completado: ${filled}/${allFields.length} campos (${Math.round(filled / allFields.length * 100)}%)
    `.trim()
    onGenerateReport(content)
    onComplete()
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
      <div style={{ background: 'var(--color-bg-card)', borderRadius: 12, border: '1px solid var(--color-border)', padding: '1rem 1.25rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.375rem' }}>
          <span style={{ fontFamily: 'var(--font-body)', fontSize: '0.875rem', fontWeight: 600, color: 'var(--color-text-primary)' }}>Slides completados</span>
          <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.875rem', fontWeight: 700, color: '#059669' }}>{filled}/{allFields.length} campos</span>
        </div>
        <div style={{ height: 4, borderRadius: 2, background: 'var(--color-bg-muted)' }}>
          <div style={{ height: '100%', borderRadius: 2, background: '#059669', width: `${(filled / allFields.length) * 100}%`, transition: 'width 0.4s' }} />
        </div>
      </div>

      {SLIDES.map((slide) => {
        const isOpen = openSlides.has(slide.id)
        const slideFilled = slide.fields.filter((f) => values[f.id]?.trim()).length
        return (
          <div key={slide.id} style={{ background: 'var(--color-bg-card)', borderRadius: 14, border: '1px solid var(--color-border)', overflow: 'hidden', boxShadow: 'var(--shadow-card)' }}>
            <button onClick={() => setOpenSlides((s) => { const n = new Set(s); isOpen ? n.delete(slide.id) : n.add(slide.id); return n })}
              style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0.875rem 1.25rem', background: `${slide.color}08`, border: 'none', cursor: 'pointer' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.625rem' }}>
                <div style={{ width: 6, height: 6, borderRadius: '50%', background: slide.color }} />
                <span style={{ fontFamily: 'var(--font-heading)', fontSize: '0.9375rem', fontWeight: 600, color: 'var(--color-text-primary)' }}>{slide.title}</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.625rem', color: slideFilled === slide.fields.length ? '#059669' : slide.color }}>{slideFilled}/{slide.fields.length}</span>
                {isOpen ? <ChevronDown size={14} color="#9CA3AF" /> : <ChevronRight size={14} color="#9CA3AF" />}
              </div>
            </button>
            {isOpen && (
              <div style={{ padding: '1.25rem' }}>
                <div style={{ padding: '0.75rem', borderRadius: 8, background: `${slide.color}08`, border: `1px solid ${slide.color}15`, marginBottom: '1rem' }}>
                  <p style={{ fontFamily: 'var(--font-body)', fontSize: '0.8125rem', lineHeight: 1.6, color: 'var(--color-text-secondary)' }}>{slide.guide}</p>
                </div>
                {slide.fields.map((f) => (
                  <div key={f.id} style={{ marginBottom: '0.875rem' }}>
                    <label style={{ display: 'block', fontFamily: 'var(--font-body)', fontSize: '0.8125rem', fontWeight: 600, color: 'var(--color-text-primary)', marginBottom: '0.375rem' }}>{f.label}</label>
                    <textarea value={values[f.id] || ''} onChange={(e) => setValues((p) => ({ ...p, [f.id]: e.target.value }))} placeholder={f.ph} rows={2}
                      style={{ width: '100%', padding: '0.625rem 0.75rem', borderRadius: 8, border: `1px solid ${values[f.id] ? slide.color + '30' : 'var(--color-border)'}`, fontFamily: 'var(--font-body)', fontSize: '0.875rem', lineHeight: 1.5, color: 'var(--color-text-primary)', outline: 'none', resize: 'vertical', background: 'var(--color-bg-primary)', transition: 'border 0.15s' }}
                      onFocus={(e) => (e.currentTarget.style.borderColor = slide.color)}
                      onBlur={(e) => (e.currentTarget.style.borderColor = values[f.id] ? slide.color + '30' : 'var(--color-border)')}
                    />
                  </div>
                ))}
              </div>
            )}
          </div>
        )
      })}

      <button onClick={handleReport} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', width: '100%', padding: '0.875rem', borderRadius: 12, background: '#059669', color: 'white', fontFamily: 'var(--font-body)', fontSize: '0.9375rem', fontWeight: 600, border: 'none', cursor: 'pointer', boxShadow: '0 4px 14px rgba(5,150,105,0.3)', transition: 'all 0.2s' }}
        onMouseEnter={(e) => (e.currentTarget.style.background = '#047857')}
        onMouseLeave={(e) => (e.currentTarget.style.background = '#059669')}
      >
        <Download size={17} /> Exportar Guía Completa del Pitch Deck
      </button>
    </div>
  )
}
