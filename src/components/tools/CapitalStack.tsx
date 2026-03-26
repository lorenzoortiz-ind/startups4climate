'use client'

import { useState } from 'react'
import { Download, Plus, Trash2 } from 'lucide-react'
import { useToolState } from '@/lib/useToolState'
import type { ToolComponentProps } from './ToolPage'

interface CapitalItem {
  id: string
  type: 'grant' | 'equity' | 'debt' | 'blended' | 'revenue'
  source: string
  amount: string
  stage: string
  dilution: string
  conditions: string
  status: 'identified' | 'applying' | 'secured' | 'rejected'
}

const CAPITAL_TYPES = [
  { value: 'grant', label: 'Grant / Subvención', color: '#059669', desc: 'Capital no dilutivo para I+D' },
  { value: 'equity', label: 'Equity VC / Angel', color: '#7C3AED', desc: 'Capital dilutivo de inversores' },
  { value: 'debt', label: 'Deuda / Venture Debt', color: '#0891B2', desc: 'Financiamiento no dilutivo a devolver' },
  { value: 'blended', label: 'Blended Finance', color: '#D97706', desc: 'Mezcla de capital público/privado' },
  { value: 'revenue', label: 'Revenue / Ingresos', color: '#DC2626', desc: 'Bootstrap / contratos pagados' },
]

const STAGE_OPTIONS = [
  'Pre-Seed (TRL 1-3)', 'Seed (TRL 4-6)', 'Serie A (TRL 7-8)', 'Serie B+ (TRL 9)', 'Growth'
]

const STATUS_CONFIG = {
  identified: { label: 'Identificado', color: '#9CA3AF' },
  applying: { label: 'Aplicando', color: '#D97706' },
  secured: { label: 'Asegurado', color: '#059669' },
  rejected: { label: 'Rechazado', color: '#DC2626' },
}

const REFERENCE_SOURCES = [
  { type: 'grant', sources: ['CONACYT / CONAHCYT (México)', 'CORFO (Chile)', 'COLCIENCIAS (Colombia)', 'FONDECYT', 'NSF SBIR (USA)', 'Horizon Europe', 'IDB Lab', 'LATAM Green Accelerator', 'Mission Innovation', 'US DOE ARPA-E'] },
  { type: 'equity', sources: ['Cuántica (Chile)', 'Pangea VC', 'Elemental Excelerator', 'Breakthrough Energy Ventures', 'Congruent Ventures', 'E8 Angels', 'Sistema.bio Ventures', 'Acre Venture Partners', 'Wavemaker Impact'] },
  { type: 'debt', sources: ['Kreos Capital', 'Silicon Valley Bank', 'Triodos Bank', 'COFIDE (Perú)', 'Bancoldex (Colombia)', 'NAFINSA (México)', 'CAF Venture Debt'] },
  { type: 'blended', sources: ['IDB / BID Invest', 'CAF Climate', 'Green Climate Fund (GCF)', 'Global Innovation Lab', 'Convergence Blended Finance', 'OPIC / DFC (USA)', 'PROPARCO (Francia)'] },
]

export default function CapitalStack({ userId, onComplete, onGenerateReport }: ToolComponentProps) {
  const [state, setState] = useToolState(userId, 'capital-stack', {
    items: [
      { id: '1', type: 'grant', source: 'CONACYT / CONAHCYT', amount: '200000', stage: 'Pre-Seed (TRL 1-3)', dilution: '0', conditions: 'Reporte técnico semestral', status: 'applying' },
      { id: '2', type: 'equity', source: 'Angel Climático', amount: '500000', stage: 'Seed (TRL 4-6)', dilution: '10', conditions: 'Board seat, pro-rata rights', status: 'identified' },
    ] as CapitalItem[],
  })
  const items = state.items
  const setItems = (updater: CapitalItem[] | ((prev: CapitalItem[]) => CapitalItem[])) =>
    setState((prev) => ({ ...prev, items: typeof updater === 'function' ? updater(prev.items) : updater }))
  const [showRef, setShowRef] = useState<string | null>(null)

  const add = () => setItems((p) => [...p, {
    id: Date.now().toString(), type: 'grant', source: '', amount: '', stage: 'Seed (TRL 4-6)', dilution: '0', conditions: '', status: 'identified'
  }])
  const update = (id: string, field: keyof CapitalItem, value: string) =>
    setItems((p) => p.map((it) => it.id === id ? { ...it, [field]: value } : it))
  const remove = (id: string) => setItems((p) => p.filter((it) => it.id !== id))

  const totalByType = CAPITAL_TYPES.map((ct) => ({
    ...ct,
    total: items.filter((it) => it.type === ct.value).reduce((s, it) => s + (parseFloat(it.amount) || 0), 0),
    secured: items.filter((it) => it.type === ct.value && it.status === 'secured').reduce((s, it) => s + (parseFloat(it.amount) || 0), 0),
  }))
  const grandTotal = totalByType.reduce((s, ct) => s + ct.total, 0)
  const totalSecured = totalByType.reduce((s, ct) => s + ct.secured, 0)
  const totalDilution = items.filter((it) => it.type === 'equity' && it.status !== 'rejected').reduce((s, it) => s + (parseFloat(it.dilution) || 0), 0)

  const handleReport = () => {
    const content = `
CLIMATE CAPITAL STACK
════════════════════

RESUMEN EJECUTIVO
Capital Total Mapeado: $${grandTotal.toLocaleString()} USD
Capital Asegurado: $${totalSecured.toLocaleString()} USD (${grandTotal > 0 ? Math.round(totalSecured / grandTotal * 100) : 0}%)
Dilución Equity Proyectada: ${totalDilution}%

POR TIPO DE CAPITAL:
${totalByType.filter((ct) => ct.total > 0).map((ct) => `  ${ct.label}: $${ct.total.toLocaleString()} USD (asegurado: $${ct.secured.toLocaleString()})`).join('\n')}

DETALLE DE FUENTES:
${items.map((it) => {
  const ct = CAPITAL_TYPES.find((c) => c.value === it.type)!
  const st = STATUS_CONFIG[it.status]
  return `
${ct.label} — ${it.source || 'Sin nombre'}
  Monto: $${parseFloat(it.amount || '0').toLocaleString()} USD
  Etapa: ${it.stage}
  ${it.type === 'equity' ? `Dilución: ${it.dilution}%` : ''}
  Estado: ${st.label}
  Condiciones: ${it.conditions || 'Sin especificar'}`
}).join('\n')}

ESTRATEGIA RECOMENDADA:
→ Prioriza grants no dilutivos en etapas tempranas (TRL 1-5)
→ Combina equity VC con grants de I+D para reducir dilución
→ Introduce venture debt post-tracción para extender runway sin dilución
→ Evalúa blended finance para proyectos de hardware con larga curva de madurez
→ Target LTV/CAC > 10x antes de levantar Serie A
    `.trim()
    onGenerateReport(content)
    onComplete()
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
      {/* Summary */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '0.75rem' }}>
        {[
          { label: 'Total Mapeado', value: `$${(grandTotal / 1000).toFixed(0)}K`, color: '#0891B2' },
          { label: 'Asegurado', value: `$${(totalSecured / 1000).toFixed(0)}K`, color: '#059669' },
          { label: 'Dilución Equity', value: `${totalDilution}%`, color: '#7C3AED' },
        ].map((m) => (
          <div key={m.label} style={{ background: 'var(--color-bg-card)', borderRadius: 12, border: '1px solid var(--color-border)', padding: '1rem', textAlign: 'center', boxShadow: 'var(--shadow-card)' }}>
            <div style={{ fontFamily: 'var(--font-mono)', fontSize: '1.5rem', fontWeight: 700, color: m.color }}>{m.value}</div>
            <div style={{ fontFamily: 'var(--font-body)', fontSize: '0.75rem', color: 'var(--color-text-muted)', marginTop: '0.25rem' }}>{m.label}</div>
          </div>
        ))}
      </div>

      {/* Stack visual */}
      <div style={{ background: 'var(--color-bg-card)', borderRadius: 16, border: '1px solid var(--color-border)', padding: '1.5rem', boxShadow: 'var(--shadow-card)' }}>
        <h3 style={{ fontFamily: 'var(--font-heading)', fontSize: '1rem', fontWeight: 700, color: 'var(--color-text-primary)', marginBottom: '1rem' }}>Composición del Capital Stack</h3>
        {totalByType.filter((ct) => ct.total > 0).map((ct) => (
          <div key={ct.value} style={{ marginBottom: '0.75rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.25rem' }}>
              <span style={{ fontFamily: 'var(--font-body)', fontSize: '0.8125rem', fontWeight: 500, color: 'var(--color-text-primary)' }}>{ct.label}</span>
              <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.8125rem', fontWeight: 600, color: ct.color }}>${ct.total.toLocaleString()}</span>
            </div>
            <div style={{ height: 8, borderRadius: 4, background: 'var(--color-bg-muted)', overflow: 'hidden' }}>
              <div style={{ height: '100%', borderRadius: 4, background: ct.color, width: grandTotal > 0 ? `${(ct.total / grandTotal) * 100}%` : '0%', transition: 'width 0.5s' }} />
            </div>
          </div>
        ))}
        {grandTotal === 0 && (
          <p style={{ fontFamily: 'var(--font-body)', fontSize: '0.875rem', color: 'var(--color-text-muted)', textAlign: 'center', padding: '1rem' }}>Añade fuentes de capital para visualizar tu stack</p>
        )}
      </div>

      {/* Capital items */}
      <div style={{ background: 'var(--color-bg-card)', borderRadius: 16, border: '1px solid var(--color-border)', padding: '1.5rem', boxShadow: 'var(--shadow-card)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
          <h3 style={{ fontFamily: 'var(--font-heading)', fontSize: '1rem', fontWeight: 700, color: 'var(--color-text-primary)' }}>Fuentes de Capital</h3>
          <button onClick={add} style={{ display: 'flex', alignItems: 'center', gap: '0.375rem', padding: '0.375rem 0.75rem', borderRadius: 8, background: 'rgba(5,150,105,0.07)', border: '1px solid rgba(5,150,105,0.2)', color: '#059669', fontFamily: 'var(--font-body)', fontSize: '0.75rem', fontWeight: 600, cursor: 'pointer' }}>
            <Plus size={13} /> Añadir fuente
          </button>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.875rem' }}>
          {items.map((item) => {
            const ct = CAPITAL_TYPES.find((c) => c.value === item.type)!
            const st = STATUS_CONFIG[item.status]
            const ref = REFERENCE_SOURCES.find((r) => r.type === item.type)
            return (
              <div key={item.id} style={{ padding: '1rem', borderRadius: 12, border: `1px solid ${ct.color}20`, background: `${ct.color}04` }}>
                <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', marginBottom: '0.75rem' }}>
                  <select value={item.type} onChange={(e) => update(item.id, 'type', e.target.value)}
                    style={{ flex: '0 1 160px', padding: '0.4rem 0.5rem', borderRadius: 7, border: `1px solid ${ct.color}30`, fontFamily: 'var(--font-body)', fontSize: '0.75rem', outline: 'none', background: 'var(--color-bg-card)', color: ct.color, fontWeight: 600 }}>
                    {CAPITAL_TYPES.map((t) => <option key={t.value} value={t.value}>{t.label}</option>)}
                  </select>
                  <input value={item.source} onChange={(e) => update(item.id, 'source', e.target.value)} placeholder="Fuente / Inversor / Fondo"
                    style={{ flex: '1 1 160px', padding: '0.4rem 0.625rem', borderRadius: 7, border: '1px solid var(--color-border)', fontFamily: 'var(--font-body)', fontSize: '0.875rem', outline: 'none', background: 'var(--color-bg-card)' }} />
                  {ref && (
                    <button onClick={() => setShowRef(showRef === item.id ? null : item.id)}
                      style={{ padding: '0.4rem 0.625rem', borderRadius: 7, border: `1px solid ${ct.color}30`, background: `${ct.color}08`, color: ct.color, fontFamily: 'var(--font-body)', fontSize: '0.6875rem', fontWeight: 600, cursor: 'pointer' }}>
                      Ver ejemplos
                    </button>
                  )}
                  <button onClick={() => remove(item.id)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#DC2626', display: 'flex', alignItems: 'center' }}><Trash2 size={14} /></button>
                </div>
                {showRef === item.id && ref && (
                  <div style={{ marginBottom: '0.75rem', padding: '0.625rem', borderRadius: 8, background: `${ct.color}08`, border: `1px solid ${ct.color}15` }}>
                    <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.625rem', fontWeight: 700, color: ct.color, textTransform: 'uppercase', marginBottom: '0.375rem' }}>Fuentes de referencia ({ct.label})</div>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.375rem' }}>
                      {ref.sources.map((s) => (
                        <button key={s} onClick={() => { update(item.id, 'source', s); setShowRef(null) }}
                          style={{ padding: '0.2rem 0.5rem', borderRadius: 6, border: `1px solid ${ct.color}25`, background: 'var(--color-bg-card)', color: 'var(--color-text-secondary)', fontFamily: 'var(--font-body)', fontSize: '0.6875rem', cursor: 'pointer' }}>
                          {s}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
                <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                  <div style={{ flex: '1 1 120px' }}>
                    <label style={{ display: 'block', fontFamily: 'var(--font-body)', fontSize: '0.6875rem', fontWeight: 600, color: 'var(--color-text-muted)', marginBottom: '0.25rem' }}>Monto (USD)</label>
                    <input value={item.amount} onChange={(e) => update(item.id, 'amount', e.target.value)} placeholder="500000" type="number"
                      style={{ width: '100%', padding: '0.4rem 0.625rem', borderRadius: 7, border: '1px solid var(--color-border)', fontFamily: 'var(--font-mono)', fontSize: '0.875rem', outline: 'none', background: 'var(--color-bg-card)' }} />
                  </div>
                  <div style={{ flex: '1 1 140px' }}>
                    <label style={{ display: 'block', fontFamily: 'var(--font-body)', fontSize: '0.6875rem', fontWeight: 600, color: 'var(--color-text-muted)', marginBottom: '0.25rem' }}>Etapa objetivo</label>
                    <select value={item.stage} onChange={(e) => update(item.id, 'stage', e.target.value)}
                      style={{ width: '100%', padding: '0.4rem 0.5rem', borderRadius: 7, border: '1px solid var(--color-border)', fontFamily: 'var(--font-body)', fontSize: '0.75rem', outline: 'none', background: 'var(--color-bg-card)' }}>
                      {STAGE_OPTIONS.map((s) => <option key={s}>{s}</option>)}
                    </select>
                  </div>
                  {item.type === 'equity' && (
                    <div style={{ flex: '0 1 100px' }}>
                      <label style={{ display: 'block', fontFamily: 'var(--font-body)', fontSize: '0.6875rem', fontWeight: 600, color: 'var(--color-text-muted)', marginBottom: '0.25rem' }}>Dilución (%)</label>
                      <input value={item.dilution} onChange={(e) => update(item.id, 'dilution', e.target.value)} placeholder="10" type="number"
                        style={{ width: '100%', padding: '0.4rem 0.625rem', borderRadius: 7, border: '1px solid var(--color-border)', fontFamily: 'var(--font-mono)', fontSize: '0.875rem', outline: 'none', background: 'var(--color-bg-card)' }} />
                    </div>
                  )}
                  <div style={{ flex: '0 1 120px' }}>
                    <label style={{ display: 'block', fontFamily: 'var(--font-body)', fontSize: '0.6875rem', fontWeight: 600, color: 'var(--color-text-muted)', marginBottom: '0.25rem' }}>Estado</label>
                    <select value={item.status} onChange={(e) => update(item.id, 'status', e.target.value as CapitalItem['status'])}
                      style={{ width: '100%', padding: '0.4rem 0.5rem', borderRadius: 7, border: `1px solid ${st.color}30`, background: `${st.color}08`, fontFamily: 'var(--font-body)', fontSize: '0.75rem', outline: 'none', color: st.color, fontWeight: 600 }}>
                      {Object.entries(STATUS_CONFIG).map(([k, v]) => <option key={k} value={k}>{v.label}</option>)}
                    </select>
                  </div>
                </div>
                <div style={{ marginTop: '0.5rem' }}>
                  <input value={item.conditions} onChange={(e) => update(item.id, 'conditions', e.target.value)} placeholder="Condiciones, compromisos, restricciones..."
                    style={{ width: '100%', padding: '0.4rem 0.625rem', borderRadius: 7, border: '1px solid var(--color-border)', fontFamily: 'var(--font-body)', fontSize: '0.8125rem', outline: 'none', background: 'var(--color-bg-card)' }} />
                </div>
              </div>
            )
          })}
        </div>
      </div>

      <button onClick={handleReport} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', width: '100%', padding: '0.875rem', borderRadius: 12, background: '#D97706', color: 'white', fontFamily: 'var(--font-body)', fontSize: '0.9375rem', fontWeight: 600, border: 'none', cursor: 'pointer', boxShadow: '0 4px 14px rgba(217,119,6,0.3)', transition: 'all 0.2s' }}
        onMouseEnter={(e) => (e.currentTarget.style.background = '#B45309')}
        onMouseLeave={(e) => (e.currentTarget.style.background = '#D97706')}
      >
        <Download size={17} /> Exportar Climate Capital Stack
      </button>
    </div>
  )
}
