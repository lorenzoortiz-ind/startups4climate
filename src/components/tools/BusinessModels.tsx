'use client'

import { Download, ChevronRight } from 'lucide-react'
import { useToolState } from '@/lib/useToolState'
import type { ToolComponentProps } from './ToolPage'

const MODELS = {
  saas: {
    name: 'SaaS Climático', color: '#0891B2',
    desc: 'Suscripción digital. Ideal para datos, monitoreo, mercados de carbono y plataformas de análisis.',
    pros: ['Escalable y capital eficiente', 'Ciclo de ventas corto', 'Métricas SaaS familiares para VCs'],
    cons: ['Difícil diferenciarse', 'Churn alto si el valor no es claro', 'No captura el "green premium"'],
    capital: 'Pre-Seed / Seed VC',
    examples: 'Xpansiv (mercados de carbono), Patch (offsets), Pachama (monitore forestales)',
  },
  capex: {
    name: 'Venta CAPEX (Hardware)', color: '#DC2626',
    desc: 'Vendes el equipo directamente al cliente. El cliente pone el capital. Útil para hardware probado.',
    pros: ['Ingresos inmediatos', 'Sin deuda en el balance propio', 'Simple de estructurar'],
    cons: ['Barrera de adopción alta (CAPEX del cliente)', 'Escalamiento lento', 'Sin ingresos recurrentes'],
    capital: 'Seed VC + Grants',
    examples: 'Electrolizadores vendidos a industrias, paneles solares residenciales',
  },
  haas: {
    name: 'Hardware-as-a-Service (HaaS) / PPA', color: '#059669',
    desc: 'Cobras por el rendimiento o uso del hardware. El cliente paga OPEX. Modelo óptimo para climate tech.',
    pros: ['Elimina barrera de CAPEX del cliente', 'Ingresos recurrentes predecibles', 'Alineación de incentivos con el cliente'],
    cons: ['Capital intensivo (necesitas fondear el hardware)', 'Balance complejo', 'Requiere bancabilidad para escalar'],
    capital: 'Blended Finance: VC + Venture Debt + Grants',
    examples: 'Sunrun (solar PPA), Husk Power (microgrids PPA), Ciircularity (residuos HaaS)',
  },
  licensing: {
    name: 'Licenciamiento de IP', color: '#7C3AED',
    desc: 'Licencias tu tecnología a grandes corporaciones o fabricantes. Ideal para ciencia difícil de replicar.',
    pros: ['Capital eficiente', 'Escalamiento rápido vía socios', 'Sin necesidad de manufactura propia'],
    cons: ['Ingresos tardíos', 'Dependencia de socios', 'Pérdida de control sobre el despliegue'],
    capital: 'Grants + Angel/Seed VC',
    examples: 'Tecnologías de baterías (licenciadas a fabricantes de autos), materiales de construcción',
  },
  esco: {
    name: 'ESCO / Proyecto de Rendimiento', color: '#D97706',
    desc: 'Empresa de Servicios Energéticos. Te pagas con los ahorros que generas al cliente.',
    pros: ['Sin CAPEX para el cliente', 'Ingresos garantizados por contrato largo', 'Bancable con deuda de proyecto'],
    cons: ['Ciclo de negociación muy largo (12-24 meses)', 'Requiere historial de rendimiento demostrado', 'Complejo de estructurar legalmente'],
    capital: 'Project Finance + Development Finance (CAF, IDB)',
    examples: 'Eficiencia energética industrial, cogeneración, climatización de edificios',
  },
}

const QUESTIONS = [
  { id: 'q1', text: '¿Tu tecnología requiere hardware físico para funcionar?', yes: 'q2', no: 'saas' },
  { id: 'q2', text: '¿Tus clientes objetivo tienen presupuesto de CAPEX disponible y voluntad de invertirlo?', yes: 'capex', no: 'q3' },
  { id: 'q3', text: '¿Puedes demostrar un rendimiento predecible y medible (ahorro energético, productividad)?', yes: 'q4', no: 'q5' },
  { id: 'q4', text: '¿Los ahorros o beneficios que generas son suficientemente grandes para pagar tu servicio anualmente?', yes: 'esco', no: 'haas' },
  { id: 'q5', text: '¿Tu IP es difícil de replicar y tienes acceso a grandes socios industriales?', yes: 'licensing', no: 'haas' },
]

export default function BusinessModels({ userId, onComplete, onGenerateReport }: ToolComponentProps) {
  const [state, setToolState] = useToolState(userId, 'business-models', {
    path: [] as string[],
    result: null as string | null,
  })
  const path = state.path
  const result = state.result
  const setPath = (updater: string[] | ((prev: string[]) => string[])) =>
    setToolState((prev) => ({
      ...prev,
      path: typeof updater === 'function' ? updater(prev.path) : updater,
    }))
  const setResult = (value: string | null) =>
    setToolState((prev) => ({ ...prev, result: value }))

  const currentQuestion = path.length === 0 ? QUESTIONS[0] : (() => {
    const last = path[path.length - 1]
    return QUESTIONS.find((q) => q.id === last) || null
  })()

  const answer = (qId: string, yes: boolean) => {
    const q = QUESTIONS.find((q) => q.id === qId)
    if (!q) return
    const next = yes ? q.yes : q.no
    if (MODELS[next as keyof typeof MODELS]) {
      setResult(next)
      setPath((p) => [...p, next])
    } else {
      setPath((p) => [...p, next])
    }
  }

  const reset = () => { setPath([]); setResult(null) }
  const model = result ? MODELS[result as keyof typeof MODELS] : null

  const handleReport = () => {
    if (!model) return
    const content = `
RECOMENDACIÓN DE MODELO DE NEGOCIO CLIMÁTICO

Modelo Recomendado: ${model.name}

Descripción: ${model.desc}

Ventajas:
${model.pros.map((p) => `  ✓ ${p}`).join('\n')}

Consideraciones:
${model.cons.map((c) => `  ⚠ ${c}`).join('\n')}

Estructura de Capital Recomendada: ${model.capital}

Ejemplos de referencia: ${model.examples}

Path de decisión tomado: ${path.join(' → ')}
    `.trim()
    onGenerateReport(content)
    onComplete()
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
      {!result ? (
        <div style={{ background: 'var(--color-bg-card)', borderRadius: 16, border: '1px solid var(--color-border)', padding: '2rem', boxShadow: 'var(--shadow-card)' }}>
          <div style={{ display: 'flex', gap: '0.375rem', marginBottom: '1.5rem', flexWrap: 'wrap' }}>
            {path.map((step, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                <span style={{ padding: '0.25rem 0.5rem', borderRadius: 6, background: 'var(--color-bg-muted)', fontFamily: 'var(--font-mono)', fontSize: '0.625rem', color: 'var(--color-text-muted)' }}>{step}</span>
                {i < path.length - 1 && <ChevronRight size={12} color="#D1D5DB" />}
              </div>
            ))}
          </div>
          {currentQuestion && !MODELS[path[path.length - 1] as keyof typeof MODELS] && (
            <div>
              <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.6875rem', fontWeight: 600, color: '#059669', textTransform: 'uppercase', marginBottom: '0.75rem' }}>
                Pregunta {path.length + 1}/5
              </div>
              <h3 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.125rem', fontWeight: 700, color: 'var(--color-text-primary)', lineHeight: 1.35, marginBottom: '2rem' }}>
                {currentQuestion.text}
              </h3>
              <div style={{ display: 'flex', gap: '1rem' }}>
                <button onClick={() => answer(currentQuestion.id, true)}
                  style={{ flex: 1, padding: '1rem', borderRadius: 12, border: '2px solid #059669', background: 'rgba(5,150,105,0.06)', color: '#059669', fontFamily: 'var(--font-heading)', fontSize: '1rem', fontWeight: 700, cursor: 'pointer', transition: 'all 0.2s' }}
                  onMouseEnter={(e) => (e.currentTarget.style.background = 'rgba(5,150,105,0.12)')}
                  onMouseLeave={(e) => (e.currentTarget.style.background = 'rgba(5,150,105,0.06)')}
                >Sí</button>
                <button onClick={() => answer(currentQuestion.id, false)}
                  style={{ flex: 1, padding: '1rem', borderRadius: 12, border: '2px solid #DC2626', background: 'rgba(220,38,38,0.05)', color: '#DC2626', fontFamily: 'var(--font-heading)', fontSize: '1rem', fontWeight: 700, cursor: 'pointer', transition: 'all 0.2s' }}
                  onMouseEnter={(e) => (e.currentTarget.style.background = 'rgba(220,38,38,0.1)')}
                  onMouseLeave={(e) => (e.currentTarget.style.background = 'rgba(220,38,38,0.05)')}
                >No</button>
              </div>
            </div>
          )}
        </div>
      ) : model ? (
        <div>
          <div style={{ background: 'var(--color-bg-card)', borderRadius: 16, border: `2px solid ${model.color}`, padding: '2rem', boxShadow: 'var(--shadow-card)', marginBottom: '1.25rem' }}>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', padding: '0.3rem 0.875rem', borderRadius: 9999, background: `${model.color}12`, border: `1px solid ${model.color}30`, fontFamily: 'var(--font-mono)', fontSize: '0.6875rem', fontWeight: 700, color: model.color, marginBottom: '0.875rem', textTransform: 'uppercase' }}>
              Modelo Recomendado
            </div>
            <h3 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.5rem', fontWeight: 800, color: 'var(--color-text-primary)', marginBottom: '0.75rem' }}>{model.name}</h3>
            <p style={{ fontFamily: 'var(--font-body)', fontSize: '0.9375rem', lineHeight: 1.6, color: 'var(--color-text-secondary)', marginBottom: '1.25rem' }}>{model.desc}</p>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1rem' }}>
              <div style={{ padding: '1rem', borderRadius: 10, background: 'rgba(5,150,105,0.05)', border: '1px solid rgba(5,150,105,0.12)' }}>
                <div style={{ fontFamily: 'var(--font-heading)', fontSize: '0.8125rem', fontWeight: 700, color: '#059669', marginBottom: '0.5rem' }}>Ventajas</div>
                {model.pros.map((p) => <div key={p} style={{ fontFamily: 'var(--font-body)', fontSize: '0.8125rem', color: 'var(--color-text-secondary)', marginBottom: '0.25rem' }}>✓ {p}</div>)}
              </div>
              <div style={{ padding: '1rem', borderRadius: 10, background: 'rgba(217,119,6,0.05)', border: '1px solid rgba(217,119,6,0.12)' }}>
                <div style={{ fontFamily: 'var(--font-heading)', fontSize: '0.8125rem', fontWeight: 700, color: '#D97706', marginBottom: '0.5rem' }}>A considerar</div>
                {model.cons.map((c) => <div key={c} style={{ fontFamily: 'var(--font-body)', fontSize: '0.8125rem', color: 'var(--color-text-secondary)', marginBottom: '0.25rem' }}>⚠ {c}</div>)}
              </div>
            </div>
            <div style={{ padding: '0.875rem', borderRadius: 10, background: 'var(--color-bg-muted)', border: '1px solid var(--color-border)' }}>
              <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.6875rem', fontWeight: 700, color: 'var(--color-text-muted)', textTransform: 'uppercase' }}>Capital recomendado: </span>
              <span style={{ fontFamily: 'var(--font-body)', fontSize: '0.875rem', color: 'var(--color-text-primary)', fontWeight: 500 }}>{model.capital}</span>
            </div>
          </div>
          <button onClick={reset} style={{ width: '100%', padding: '0.75rem', borderRadius: 10, border: '1px solid var(--color-border)', background: 'var(--color-bg-card)', fontFamily: 'var(--font-body)', fontSize: '0.875rem', color: 'var(--color-text-secondary)', cursor: 'pointer', marginBottom: '0.75rem' }}>
            Reiniciar árbol de decisión
          </button>
          <button onClick={handleReport} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', width: '100%', padding: '0.875rem', borderRadius: 12, background: '#059669', color: 'white', fontFamily: 'var(--font-body)', fontSize: '0.9375rem', fontWeight: 600, border: 'none', cursor: 'pointer', boxShadow: '0 4px 14px rgba(5,150,105,0.3)' }}>
            <Download size={17} /> Generar Análisis de Modelo de Negocio
          </button>
        </div>
      ) : null}
    </div>
  )
}
