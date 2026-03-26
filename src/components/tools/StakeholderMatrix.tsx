'use client'

import { Plus, Trash2, Download } from 'lucide-react'
import { useToolState } from '@/lib/useToolState'
import type { ToolComponentProps } from './ToolPage'

interface Stakeholder {
  id: string
  name: string
  type: string
  influence: number
  interest: number
  strategy: string
  notes: string
}

const TYPES = ['Cliente B2B', 'Cliente B2G', 'Regulador', 'Inversor', 'Aliado Estratégico', 'Corporativo / CVC', 'Academia / Investigación', 'ONG / Sociedad Civil', 'Proveedor Clave', 'Media']
const QUADRANTS = [
  { label: 'Gestionar de Cerca', desc: 'Alto poder, alto interés. Mantén informados y comprometidos.', color: '#7C3AED', x: 'alto', y: 'alto' },
  { label: 'Mantener Satisfechos', desc: 'Alto poder, bajo interés. No ignores, pero no abrumes.', color: '#D97706', x: 'bajo', y: 'alto' },
  { label: 'Informar Regularmente', desc: 'Bajo poder, alto interés. Comparte actualizaciones. Pueden ser embajadores.', color: '#059669', x: 'alto', y: 'bajo' },
  { label: 'Monitorear', desc: 'Bajo poder, bajo interés. Monitorea cambios de posición.', color: '#9CA3AF', x: 'bajo', y: 'bajo' },
]

export default function StakeholderMatrix({ userId, onComplete, onGenerateReport }: ToolComponentProps) {
  const [state, setState] = useToolState(userId, 'stakeholder-matrix', {
    stakeholders: [
      { id: '1', name: 'Ministerio de Energía', type: 'Regulador', influence: 5, interest: 4, strategy: 'Gestionar de Cerca', notes: '' },
      { id: '2', name: 'Cliente Piloto 1', type: 'Cliente B2B', influence: 3, interest: 5, strategy: 'Gestionar de Cerca', notes: '' },
    ] as Stakeholder[],
  })
  const stakeholders = state.stakeholders
  const setStakeholders = (updater: Stakeholder[] | ((prev: Stakeholder[]) => Stakeholder[])) =>
    setState((prev) => ({
      ...prev,
      stakeholders: typeof updater === 'function' ? updater(prev.stakeholders) : updater,
    }))

  const add = () => setStakeholders((p) => [...p, { id: Date.now().toString(), name: '', type: 'Cliente B2B', influence: 3, interest: 3, strategy: 'Informar Regularmente', notes: '' }])
  const update = (id: string, field: keyof Stakeholder, value: string | number) =>
    setStakeholders((p) => p.map((s) => s.id === id ? { ...s, [field]: value } : s))
  const remove = (id: string) => setStakeholders((p) => p.filter((s) => s.id !== id))

  const getQuadrant = (s: Stakeholder) => {
    const highInfluence = s.influence >= 3
    const highInterest = s.interest >= 3
    if (highInfluence && highInterest) return QUADRANTS[0]
    if (!highInfluence && highInterest) return QUADRANTS[2]
    if (highInfluence && !highInterest) return QUADRANTS[1]
    return QUADRANTS[3]
  }

  const handleReport = () => {
    const content = `
MATRIZ DE STAKEHOLDERS

Total de stakeholders mapeados: ${stakeholders.length}

Por cuadrante:
${QUADRANTS.map((q) => {
  const inQ = stakeholders.filter((s) => getQuadrant(s).label === q.label)
  return `${q.label} (${inQ.length}):
${inQ.map((s) => `  - ${s.name} (${s.type}) — Poder: ${s.influence}/5, Interés: ${s.interest}/5
    ${s.notes ? 'Notas: ' + s.notes : ''}`).join('\n') || '  Ninguno'}`
}).join('\n\n')}

Plan de Engagement:
${QUADRANTS[0].label}: Comunicación semanal/quincenal. Involucra en decisiones clave.
${QUADRANTS[1].label}: Actualizaciones mensuales. Briefings ejecutivos cuando haya hitos.
${QUADRANTS[2].label}: Newsletter mensual. Convierte en advocates de tu solución.
${QUADRANTS[3].label}: Monitoreo trimestral. Actualiza si cambia su posición.
    `.trim()
    onGenerateReport(content)
    onComplete()
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
      {/* Visual matrix */}
      <div style={{ background: 'var(--color-bg-card)', borderRadius: 16, border: '1px solid var(--color-border)', padding: '1.5rem', boxShadow: 'var(--shadow-card)' }}>
        <h3 style={{ fontFamily: 'var(--font-heading)', fontSize: '1rem', fontWeight: 700, marginBottom: '0.375rem' }}>Mapa de Influencia vs. Interés</h3>
        <div style={{ position: 'relative', height: 300, border: '1px solid var(--color-border)', borderRadius: 12, overflow: 'hidden', background: '#FAFAF8' }}>
          {/* Quadrant labels */}
          <div style={{ position: 'absolute', top: '5%', right: '5%', fontFamily: 'var(--font-mono)', fontSize: '0.5625rem', color: '#7C3AED', fontWeight: 600, textTransform: 'uppercase' }}>Gestionar de Cerca</div>
          <div style={{ position: 'absolute', top: '5%', left: '5%', fontFamily: 'var(--font-mono)', fontSize: '0.5625rem', color: '#D97706', fontWeight: 600, textTransform: 'uppercase' }}>Mantener Satisfechos</div>
          <div style={{ position: 'absolute', bottom: '5%', right: '5%', fontFamily: 'var(--font-mono)', fontSize: '0.5625rem', color: '#059669', fontWeight: 600, textTransform: 'uppercase' }}>Informar Regularmente</div>
          <div style={{ position: 'absolute', bottom: '5%', left: '5%', fontFamily: 'var(--font-mono)', fontSize: '0.5625rem', color: 'var(--color-text-muted)', fontWeight: 600, textTransform: 'uppercase' }}>Monitorear</div>
          {/* Axes */}
          <div style={{ position: 'absolute', top: '50%', left: 0, right: 0, height: 1, background: 'var(--color-border)' }} />
          <div style={{ position: 'absolute', left: '50%', top: 0, bottom: 0, width: 1, background: 'var(--color-border)' }} />
          {/* Dots */}
          {stakeholders.map((s, i) => {
            const q = getQuadrant(s)
            const x = (s.interest / 5) * 90 + 5
            const y = 100 - ((s.influence / 5) * 90 + 5)
            return (
              <div key={s.id} title={`${s.name}\nInfluencia: ${s.influence}/5\nInterés: ${s.interest}/5`}
                style={{ position: 'absolute', left: `${x}%`, top: `${y}%`, transform: 'translate(-50%,-50%)', width: 32, height: 32, borderRadius: '50%', background: q.color, border: '2px solid white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'var(--font-mono)', fontSize: '0.625rem', fontWeight: 700, color: 'white', cursor: 'default', boxShadow: '0 2px 6px rgba(0,0,0,0.15)', zIndex: 2 }}>
                {(i + 1).toString()}
              </div>
            )
          })}
          {/* Axis labels */}
          <div style={{ position: 'absolute', bottom: 4, left: '50%', transform: 'translateX(-50%)', fontFamily: 'var(--font-body)', fontSize: '0.625rem', color: 'var(--color-text-muted)' }}>← Bajo interés · Alto interés →</div>
          <div style={{ position: 'absolute', left: 4, top: '50%', transform: 'translateY(-50%) rotate(-90deg)', fontFamily: 'var(--font-body)', fontSize: '0.625rem', color: 'var(--color-text-muted)', whiteSpace: 'nowrap' }}>← Bajo poder · Alto poder →</div>
        </div>
      </div>

      {/* Stakeholder list */}
      <div style={{ background: 'var(--color-bg-card)', borderRadius: 16, border: '1px solid var(--color-border)', padding: '1.5rem', boxShadow: 'var(--shadow-card)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
          <h3 style={{ fontFamily: 'var(--font-heading)', fontSize: '1rem', fontWeight: 700 }}>Stakeholders</h3>
          <button onClick={add} style={{ display: 'flex', alignItems: 'center', gap: '0.375rem', padding: '0.375rem 0.75rem', borderRadius: 8, background: 'rgba(124,58,237,0.07)', border: '1px solid rgba(124,58,237,0.15)', color: '#7C3AED', fontFamily: 'var(--font-body)', fontSize: '0.75rem', fontWeight: 600, cursor: 'pointer' }}>
            <Plus size={13} /> Añadir
          </button>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
          {stakeholders.map((s, i) => {
            const q = getQuadrant(s)
            return (
              <div key={s.id} style={{ padding: '1rem', borderRadius: 10, border: `1px solid ${q.color}20`, background: `${q.color}05` }}>
                <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', marginBottom: '0.625rem' }}>
                  <div style={{ width: 24, height: 24, borderRadius: '50%', background: q.color, display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'var(--font-mono)', fontSize: '0.625rem', fontWeight: 700, color: 'white', flexShrink: 0 }}>{i + 1}</div>
                  <input value={s.name} onChange={(e) => update(s.id, 'name', e.target.value)} placeholder="Nombre del stakeholder" style={{ flex: '1 1 140px', padding: '0.4rem 0.625rem', borderRadius: 7, border: '1px solid var(--color-border)', fontFamily: 'var(--font-body)', fontSize: '0.875rem', outline: 'none', background: 'var(--color-bg-card)' }} />
                  <select value={s.type} onChange={(e) => update(s.id, 'type', e.target.value)} style={{ flex: '0 1 130px', padding: '0.4rem 0.5rem', borderRadius: 7, border: '1px solid var(--color-border)', fontFamily: 'var(--font-body)', fontSize: '0.75rem', outline: 'none', background: 'var(--color-bg-card)' }}>
                    {TYPES.map((t) => <option key={t} value={t}>{t}</option>)}
                  </select>
                  <button onClick={() => remove(s.id)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#DC2626', display: 'flex' }}><Trash2 size={14} /></button>
                </div>
                <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
                  <SliderInput label="Poder/Influencia" value={s.influence} onChange={(v) => update(s.id, 'influence', v)} color={q.color} />
                  <SliderInput label="Interés/Impacto" value={s.interest} onChange={(v) => update(s.id, 'interest', v)} color={q.color} />
                </div>
                <div style={{ marginTop: '0.5rem', display: 'inline-flex', alignItems: 'center', gap: '0.375rem', padding: '0.25rem 0.625rem', borderRadius: 9999, background: `${q.color}12`, fontFamily: 'var(--font-mono)', fontSize: '0.625rem', fontWeight: 600, color: q.color }}>
                  {q.label}
                </div>
              </div>
            )
          })}
        </div>
      </div>

      <button onClick={handleReport} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', width: '100%', padding: '0.875rem', borderRadius: 12, background: '#7C3AED', color: 'white', fontFamily: 'var(--font-body)', fontSize: '0.9375rem', fontWeight: 600, border: 'none', cursor: 'pointer', boxShadow: '0 4px 14px rgba(124,58,237,0.3)', transition: 'all 0.2s' }}
        onMouseEnter={(e) => (e.currentTarget.style.background = '#6D28D9')}
        onMouseLeave={(e) => (e.currentTarget.style.background = '#7C3AED')}
      >
        <Download size={17} /> Generar Mapa de Stakeholders
      </button>
    </div>
  )
}

function SliderInput({ label, value, onChange, color }: { label: string; value: number; onChange: (v: number) => void; color: string }) {
  return (
    <div style={{ flex: '1 1 120px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.25rem' }}>
        <span style={{ fontFamily: 'var(--font-body)', fontSize: '0.6875rem', color: 'var(--color-text-secondary)' }}>{label}</span>
        <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.6875rem', fontWeight: 700, color }}>{value}/5</span>
      </div>
      <input type="range" min={1} max={5} value={value} onChange={(e) => onChange(parseInt(e.target.value))}
        style={{ width: '100%', accentColor: color }}
      />
    </div>
  )
}
