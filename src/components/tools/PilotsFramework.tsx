'use client'

import { Download } from 'lucide-react'
import { useToolState } from '@/lib/useToolState'
import type { ToolComponentProps } from './ToolPage'

const SECTION_FIELDS = [
  { section: 'Cliente', fields: [
    { id: 'company', label: 'Empresa cliente', placeholder: 'Nombre de la empresa' },
    { id: 'contact', label: 'Contacto principal', placeholder: 'Nombre, cargo y email' },
    { id: 'decisionMaker', label: 'Tomador de decisión final', placeholder: 'CEO / VP de Operaciones...' },
    { id: 'problem', label: 'Problema específico a resolver', placeholder: 'Describe el dolor principal del cliente' },
  ]},
  { section: 'Alcance del Piloto', fields: [
    { id: 'scope', label: 'Alcance técnico del piloto', placeholder: 'Ej: instalar 1 unidad en planta X, medir consumo energético durante 6 meses' },
    { id: 'location', label: 'Localización / planta', placeholder: 'Ciudad, país, instalación específica' },
    { id: 'duration', label: 'Duración del piloto', placeholder: 'Ej: 6 meses (Enero-Junio 2025)' },
    { id: 'investment', label: 'Inversión del cliente (USD)', placeholder: 'Costo de instalación, tiempo de equipo, etc.' },
  ]},
  { section: 'KPIs de Éxito', fields: [
    { id: 'kpi1', label: 'KPI 1 (Técnico — impacto de la solución)', placeholder: 'Ej: Reducción de consumo energético ≥ 20%' },
    { id: 'kpi2', label: 'KPI 2 (Comercial — validación de negocio)', placeholder: 'Ej: Disponibilidad del sistema ≥ 95%' },
    { id: 'kpi3', label: 'KPI 3 (Impacto ambiental)', placeholder: 'Ej: Reducción de CO2 ≥ 50 toneladas' },
    { id: 'successThreshold', label: '¿Cuándo se convierte el piloto en Offtake?', placeholder: 'Ej: Si KPI 1 y 2 se cumplen, cliente firma contrato de 5 años automáticamente' },
  ]},
  { section: 'Estructura Económica', fields: [
    { id: 'pricing', label: 'Estructura de precio del piloto', placeholder: 'Ej: Sin costo para el cliente (absorbe la startup) / Costo compartido...' },
    { id: 'offtakeTerms', label: 'Términos del Offtake esperado (si el piloto tiene éxito)', placeholder: 'Precio, volumen, duración del contrato post-piloto' },
    { id: 'paymentTrigger', label: 'Gatillo de pago para la startup', placeholder: 'Ej: 50% al inicio, 50% al alcanzar KPI 1' },
  ]},
  { section: 'Legal y Gobernanza', fields: [
    { id: 'ip', label: 'Propiedad de datos e IP del piloto', placeholder: 'Los datos de rendimiento son propiedad de la startup. IP permanece en la startup.' },
    { id: 'exclusivity', label: 'Cláusula de exclusividad (si aplica)', placeholder: 'Ej: 12 meses de exclusividad en el sector industrial para este cliente' },
    { id: 'termination', label: 'Condiciones de terminación anticipada', placeholder: '60 días de aviso previo por cualquiera de las partes' },
  ]},
]

export default function PilotsFramework({ userId, onComplete, onGenerateReport }: ToolComponentProps) {
  const [values, setValues] = useToolState(userId, 'pilots-framework', {} as Record<string, string>)

  const set = (id: string, v: string) => setValues((p) => ({ ...p, [id]: v }))
  const allFields = SECTION_FIELDS.flatMap((s) => s.fields)
  const filled = allFields.filter((f) => values[f.id]?.trim()).length

  const handleReport = () => {
    const content = `
FRAMEWORK PILOTOS B2B & LOIs

${SECTION_FIELDS.map((s) => `${s.section.toUpperCase()}:
${s.fields.map((f) => `  ${f.label}:
  ${values[f.id] || '(No completado)'}`).join('\n\n')}`).join('\n\n---\n\n')}

Completado: ${filled}/${allFields.length} campos

BORRADOR DE LOI (Carta de Intención):

Por medio de la presente, [Empresa Cliente] y [Startup] expresan su intención de colaborar en un
piloto de [alcance del piloto], con duración de [duración del piloto].

Los KPIs que determinarán el éxito del piloto son:
1. ${values.kpi1 || '[KPI 1]'}
2. ${values.kpi2 || '[KPI 2]'}
3. ${values.kpi3 || '[KPI 3]'}

En caso de alcanzar los KPIs establecidos, ambas partes acuerdan avanzar hacia un contrato comercial bajo los siguientes términos: ${values.offtakeTerms || '[Términos del offtake]'}
    `.trim()
    onGenerateReport(content)
    onComplete()
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
      <div style={{ background: 'var(--color-bg-card)', borderRadius: 12, border: '1px solid var(--color-border)', padding: '1rem 1.25rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.375rem' }}>
          <span style={{ fontFamily: 'var(--font-body)', fontSize: '0.875rem', fontWeight: 600, color: 'var(--color-text-primary)' }}>Framework completado</span>
          <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.875rem', fontWeight: 700, color: '#059669' }}>{filled}/{allFields.length}</span>
        </div>
        <div style={{ height: 4, borderRadius: 2, background: 'var(--color-bg-muted)' }}>
          <div style={{ height: '100%', borderRadius: 2, background: '#059669', width: `${(filled / allFields.length) * 100}%`, transition: 'width 0.4s' }} />
        </div>
      </div>

      {SECTION_FIELDS.map((section, si) => (
        <div key={si} style={{ background: 'var(--color-bg-card)', borderRadius: 16, border: '1px solid var(--color-border)', padding: '1.5rem', boxShadow: 'var(--shadow-card)' }}>
          <h3 style={{ fontFamily: 'var(--font-heading)', fontSize: '1rem', fontWeight: 700, color: 'var(--color-text-primary)', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <span style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: 24, height: 24, borderRadius: '50%', background: 'rgba(5,150,105,0.1)', fontFamily: 'var(--font-mono)', fontSize: '0.6875rem', fontWeight: 700, color: '#059669' }}>{si + 1}</span>
            {section.section}
          </h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {section.fields.map((f) => (
              <div key={f.id}>
                <label style={{ display: 'block', fontFamily: 'var(--font-body)', fontSize: '0.8125rem', fontWeight: 600, color: 'var(--color-text-primary)', marginBottom: '0.375rem' }}>{f.label}</label>
                <textarea value={values[f.id] || ''} onChange={(e) => set(f.id, e.target.value)} placeholder={f.placeholder} rows={2}
                  style={{ width: '100%', padding: '0.625rem 0.75rem', borderRadius: 8, border: `1px solid ${values[f.id] ? 'rgba(5,150,105,0.3)' : 'var(--color-border)'}`, fontFamily: 'var(--font-body)', fontSize: '0.875rem', lineHeight: 1.5, color: 'var(--color-text-primary)', outline: 'none', resize: 'vertical', background: 'var(--color-bg-primary)', transition: 'border 0.15s' }}
                  onFocus={(e) => (e.currentTarget.style.borderColor = '#059669')}
                  onBlur={(e) => (e.currentTarget.style.borderColor = values[f.id] ? 'rgba(5,150,105,0.3)' : 'var(--color-border)')}
                />
              </div>
            ))}
          </div>
        </div>
      ))}

      <button onClick={handleReport} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', width: '100%', padding: '0.875rem', borderRadius: 12, background: '#059669', color: 'white', fontFamily: 'var(--font-body)', fontSize: '0.9375rem', fontWeight: 600, border: 'none', cursor: 'pointer', boxShadow: '0 4px 14px rgba(5,150,105,0.3)', transition: 'all 0.2s' }}
        onMouseEnter={(e) => (e.currentTarget.style.background = '#047857')}
        onMouseLeave={(e) => (e.currentTarget.style.background = '#059669')}
      >
        <Download size={17} /> Generar Framework de Piloto + Borrador LOI
      </button>
    </div>
  )
}
