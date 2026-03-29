'use client'

import { useState, useMemo } from 'react'
import { ChevronDown, Save, CheckCircle2, FileText, Plus, Trash2 } from 'lucide-react'
import { useToolState } from '@/lib/useToolState'
import type { ToolComponentProps } from './ToolPage'

interface RevenueStream {
  [key: string]: unknown
  name: string
  type: 'suscripción' | 'transacción' | 'único' | 'marketplace'
  unit_price: number
  growth_rate_monthly: number
  initial_units: number
}

interface FixedCost {
  [key: string]: unknown
  name: string
  monthly_amount: number
}

interface VariableCost {
  [key: string]: unknown
  name: string
  per_unit_cost: number
}

interface TeamMember {
  [key: string]: unknown
  role: string
  salary: number
  start_month: number
}

interface FundingRound {
  [key: string]: unknown
  name: string
  amount: number
  month: number
  dilution: number
}

interface Data {
  [key: string]: unknown
  start_date: string
  projection_months: number
  currency: string
  revenue_streams: RevenueStream[]
  fixed_costs: FixedCost[]
  variable_costs: VariableCost[]
  team: TeamMember[]
  initial_capital: number
  planned_rounds: FundingRound[]
}

const DEFAULT: Data = {
  start_date: new Date().toISOString().slice(0, 7),
  projection_months: 36,
  currency: 'USD',
  revenue_streams: [{ name: '', type: 'suscripción', unit_price: 0, growth_rate_monthly: 5, initial_units: 10 }],
  fixed_costs: [{ name: 'Oficina / Coworking', monthly_amount: 0 }],
  variable_costs: [{ name: '', per_unit_cost: 0 }],
  team: [{ role: '', salary: 0, start_month: 1 }],
  initial_capital: 0,
  planned_rounds: [],
}

const revenueTypeLabels: Record<string, string> = {
  'suscripción': 'Suscripción',
  'transacción': 'Transacción',
  'único': 'Pago único',
  'marketplace': 'Marketplace',
}

export default function FinancialModelBuilder({ userId, onComplete, onGenerateReport }: ToolComponentProps) {
  const [data, setData] = useToolState<Data>(userId, 'financial-model-builder', DEFAULT)
  const [openSections, setOpenSections] = useState<Record<string, boolean>>({})
  const [saved, setSaved] = useState(false)

  const toggle = (k: string) => setOpenSections(p => ({ ...p, [k]: !p[k] }))

  // Array updaters
  const updateRevenue = (i: number, field: keyof RevenueStream, value: string | number) => {
    setData(p => { const arr = [...p.revenue_streams]; arr[i] = { ...arr[i], [field]: value }; return { ...p, revenue_streams: arr } })
  }
  const addRevenue = () => setData(p => ({ ...p, revenue_streams: [...p.revenue_streams, { name: '', type: 'suscripción', unit_price: 0, growth_rate_monthly: 5, initial_units: 10 }] }))
  const removeRevenue = (i: number) => setData(p => ({ ...p, revenue_streams: p.revenue_streams.filter((_, idx) => idx !== i) }))

  const updateFixed = (i: number, field: keyof FixedCost, value: string | number) => {
    setData(p => { const arr = [...p.fixed_costs]; arr[i] = { ...arr[i], [field]: value }; return { ...p, fixed_costs: arr } })
  }
  const addFixed = () => setData(p => ({ ...p, fixed_costs: [...p.fixed_costs, { name: '', monthly_amount: 0 }] }))
  const removeFixed = (i: number) => setData(p => ({ ...p, fixed_costs: p.fixed_costs.filter((_, idx) => idx !== i) }))

  const updateVariable = (i: number, field: keyof VariableCost, value: string | number) => {
    setData(p => { const arr = [...p.variable_costs]; arr[i] = { ...arr[i], [field]: value }; return { ...p, variable_costs: arr } })
  }
  const addVariable = () => setData(p => ({ ...p, variable_costs: [...p.variable_costs, { name: '', per_unit_cost: 0 }] }))
  const removeVariable = (i: number) => setData(p => ({ ...p, variable_costs: p.variable_costs.filter((_, idx) => idx !== i) }))

  const updateTeam = (i: number, field: keyof TeamMember, value: string | number) => {
    setData(p => { const arr = [...p.team]; arr[i] = { ...arr[i], [field]: value }; return { ...p, team: arr } })
  }
  const addTeam = () => setData(p => ({ ...p, team: [...p.team, { role: '', salary: 0, start_month: 1 }] }))
  const removeTeam = (i: number) => setData(p => ({ ...p, team: p.team.filter((_, idx) => idx !== i) }))

  const updateRound = (i: number, field: keyof FundingRound, value: string | number) => {
    setData(p => { const arr = [...p.planned_rounds]; arr[i] = { ...arr[i], [field]: value }; return { ...p, planned_rounds: arr } })
  }
  const addRound = () => setData(p => ({ ...p, planned_rounds: [...p.planned_rounds, { name: '', amount: 0, month: 6, dilution: 10 }] }))
  const removeRound = (i: number) => setData(p => ({ ...p, planned_rounds: p.planned_rounds.filter((_, idx) => idx !== i) }))

  // Auto-calculated projections
  const projections = useMemo(() => {
    const months = Math.min(data.projection_months, 60)
    const monthly: { month: number; revenue: number; costs: number; net: number }[] = []

    for (let m = 1; m <= months; m++) {
      // Revenue
      let totalRevenue = 0
      for (const rs of data.revenue_streams) {
        const units = rs.initial_units * Math.pow(1 + rs.growth_rate_monthly / 100, m - 1)
        totalRevenue += units * rs.unit_price
      }

      // Fixed costs
      let totalFixed = 0
      for (const fc of data.fixed_costs) {
        totalFixed += fc.monthly_amount
      }

      // Variable costs (per total units across all revenue streams)
      let totalUnits = 0
      for (const rs of data.revenue_streams) {
        totalUnits += rs.initial_units * Math.pow(1 + rs.growth_rate_monthly / 100, m - 1)
      }
      let totalVariable = 0
      for (const vc of data.variable_costs) {
        totalVariable += vc.per_unit_cost * totalUnits
      }

      // Team costs
      let totalTeam = 0
      for (const tm of data.team) {
        if (m >= tm.start_month) {
          totalTeam += tm.salary
        }
      }

      const costs = totalFixed + totalVariable + totalTeam
      monthly.push({ month: m, revenue: Math.round(totalRevenue), costs: Math.round(costs), net: Math.round(totalRevenue - costs) })
    }

    return monthly
  }, [data])

  const summaryMetrics = useMemo(() => {
    if (projections.length === 0) return { burnRate: 0, runway: 0, breakEvenMonth: null as number | null }

    // Use first month burn rate for runway calculation
    const firstMonthBurn = projections[0].costs - projections[0].revenue
    const burnRate = Math.max(firstMonthBurn, 0)

    // Add funding rounds to capital
    let totalCapital = data.initial_capital
    for (const round of data.planned_rounds) {
      totalCapital += round.amount
    }

    const runway = burnRate > 0 ? Math.round(totalCapital / burnRate) : Infinity

    // Find break-even month
    let breakEvenMonth: number | null = null
    for (const p of projections) {
      if (p.net >= 0) {
        breakEvenMonth = p.month
        break
      }
    }

    return { burnRate, runway: runway === Infinity ? 999 : runway, breakEvenMonth }
  }, [projections, data.initial_capital, data.planned_rounds])

  const fmt = (n: number) => {
    if (Math.abs(n) >= 1000000) return `${(n / 1000000).toFixed(1)}M`
    if (Math.abs(n) >= 1000) return `${(n / 1000).toFixed(1)}K`
    return n.toLocaleString()
  }

  const handleSave = () => { setSaved(true); setTimeout(() => setSaved(false), 2000) }

  const handleReport = () => {
    const content = `
MODELO FINANCIERO

SUPUESTOS:
  Fecha de inicio: ${data.start_date}
  Meses de proyección: ${data.projection_months}
  Moneda: ${data.currency}
  Capital inicial: ${data.currency} ${fmt(data.initial_capital)}

FUENTES DE INGRESO:
${data.revenue_streams.map((rs, i) => `  ${i + 1}. ${rs.name || '(Sin nombre)'} (${revenueTypeLabels[rs.type]})
     Precio unitario: ${data.currency} ${rs.unit_price} | Unidades iniciales: ${rs.initial_units} | Crecimiento mensual: ${rs.growth_rate_monthly}%`).join('\n')}

COSTOS FIJOS:
${data.fixed_costs.map((fc, i) => `  ${i + 1}. ${fc.name || '(Sin nombre)'}: ${data.currency} ${fmt(fc.monthly_amount)}/mes`).join('\n')}

COSTOS VARIABLES:
${data.variable_costs.map((vc, i) => `  ${i + 1}. ${vc.name || '(Sin nombre)'}: ${data.currency} ${vc.per_unit_cost}/unidad`).join('\n')}

EQUIPO:
${data.team.map((tm, i) => `  ${i + 1}. ${tm.role || '(Sin rol)'}: ${data.currency} ${fmt(tm.salary)}/mes (desde mes ${tm.start_month})`).join('\n')}

RONDAS PLANIFICADAS:
${data.planned_rounds.length > 0 ? data.planned_rounds.map((r, i) => `  ${i + 1}. ${r.name || '(Sin nombre)'}: ${data.currency} ${fmt(r.amount)} en mes ${r.month} (${r.dilution}% dilución)`).join('\n') : '  (Ninguna)'}

MÉTRICAS CLAVE:
  Burn rate mensual (mes 1): ${data.currency} ${fmt(summaryMetrics.burnRate)}
  Runway estimado: ${summaryMetrics.runway >= 999 ? 'Indefinido' : summaryMetrics.runway + ' meses'}
  Mes de break-even: ${summaryMetrics.breakEvenMonth ? 'Mes ' + summaryMetrics.breakEvenMonth : 'No alcanzado en el periodo'}

PROYECCIÓN MENSUAL (primeros 12 meses):
${projections.slice(0, 12).map(p => `  Mes ${p.month}: Ingreso ${data.currency} ${fmt(p.revenue)} | Costos ${data.currency} ${fmt(p.costs)} | Neto ${data.currency} ${fmt(p.net)}`).join('\n')}
    `.trim()
    onGenerateReport(content)
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
      {/* Assumptions */}
      <div style={{ background: 'var(--color-bg-card)', borderRadius: 14, border: '1px solid var(--color-border)', padding: '1.25rem' }}>
        <span style={{ fontFamily: 'var(--font-heading)', fontSize: '0.9375rem', fontWeight: 700, color: 'var(--color-text-primary)', display: 'block', marginBottom: '0.75rem' }}>Supuestos generales</span>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr 1fr', gap: '0.75rem' }}>
          <div>
            <label style={labelStyle}>Fecha de inicio</label>
            <input type="month" value={data.start_date} onChange={e => setData(p => ({ ...p, start_date: e.target.value }))} style={inputStyle} />
          </div>
          <div>
            <label style={labelStyle}>Meses de proyección</label>
            <select value={data.projection_months} onChange={e => setData(p => ({ ...p, projection_months: Number(e.target.value) }))} style={inputStyle}>
              <option value={36}>36 meses</option>
              <option value={60}>60 meses</option>
            </select>
          </div>
          <div>
            <label style={labelStyle}>Moneda</label>
            <select value={data.currency} onChange={e => setData(p => ({ ...p, currency: e.target.value }))} style={inputStyle}>
              {['USD', 'MXN', 'COP', 'CLP', 'BRL', 'ARS', 'PEN', 'EUR'].map(c => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>
          <div>
            <label style={labelStyle}>Capital inicial ({data.currency})</label>
            <input type="number" value={data.initial_capital || ''} onChange={e => setData(p => ({ ...p, initial_capital: Number(e.target.value) || 0 }))} placeholder="0" style={inputStyle} />
          </div>
        </div>
      </div>

      {/* Revenue Streams */}
      <SectionCollapsible title="Fuentes de ingreso" sectionKey="revenue" open={openSections} toggle={toggle}>
        {data.revenue_streams.map((rs, i) => (
          <div key={i} style={{ padding: '0.75rem', borderRadius: 8, border: '1px solid var(--color-border)', marginBottom: '0.625rem', background: 'var(--color-bg-primary)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
              <span style={{ fontFamily: 'var(--font-heading)', fontSize: '0.75rem', fontWeight: 700, color: 'var(--color-text-secondary)' }}>Ingreso {i + 1}</span>
              {data.revenue_streams.length > 1 && (
                <button onClick={() => removeRevenue(i)} style={{ ...btnSmall, color: '#DC2626', borderColor: '#DC262630', padding: '0.2rem 0.4rem' }}><Trash2 size={11} /></button>
              )}
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '0.5rem', marginBottom: '0.5rem' }}>
              <input value={rs.name} onChange={e => updateRevenue(i, 'name', e.target.value)} placeholder="Nombre" style={inputStyle} />
              <select value={rs.type} onChange={e => updateRevenue(i, 'type', e.target.value)} style={inputStyle}>
                {Object.entries(revenueTypeLabels).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
              </select>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '0.5rem' }}>
              <div>
                <label style={{ ...labelStyle, fontSize: '0.6875rem' }}>Precio unitario ({data.currency})</label>
                <input type="number" value={rs.unit_price || ''} onChange={e => updateRevenue(i, 'unit_price', Number(e.target.value) || 0)} placeholder="0" style={inputStyle} />
              </div>
              <div>
                <label style={{ ...labelStyle, fontSize: '0.6875rem' }}>Unidades iniciales</label>
                <input type="number" value={rs.initial_units} onChange={e => updateRevenue(i, 'initial_units', Number(e.target.value))} style={inputStyle} />
              </div>
              <div>
                <label style={{ ...labelStyle, fontSize: '0.6875rem' }}>Crecimiento mensual (%)</label>
                <input type="number" value={rs.growth_rate_monthly} onChange={e => updateRevenue(i, 'growth_rate_monthly', Number(e.target.value))} style={inputStyle} />
              </div>
            </div>
          </div>
        ))}
        <button onClick={addRevenue} style={{ ...btnSmall, color: '#0D9488', borderColor: '#0D948830' }}><Plus size={12} /> Agregar fuente de ingreso</button>
      </SectionCollapsible>

      {/* Fixed Costs */}
      <SectionCollapsible title="Costos fijos" sectionKey="fixed" open={openSections} toggle={toggle}>
        {data.fixed_costs.map((fc, i) => (
          <div key={i} style={{ display: 'flex', gap: '0.5rem', marginBottom: '0.5rem', alignItems: 'center' }}>
            <input value={fc.name} onChange={e => updateFixed(i, 'name', e.target.value)} placeholder="Nombre del costo" style={{ ...inputStyle, flex: 2 }} />
            <input type="number" value={fc.monthly_amount || ''} onChange={e => updateFixed(i, 'monthly_amount', Number(e.target.value) || 0)} placeholder="Monto mensual" style={{ ...inputStyle, flex: 1 }} />
            {data.fixed_costs.length > 1 && (
              <button onClick={() => removeFixed(i)} style={{ ...btnSmall, color: '#DC2626', borderColor: '#DC262630', padding: '0.3rem 0.5rem' }}><Trash2 size={11} /></button>
            )}
          </div>
        ))}
        <button onClick={addFixed} style={{ ...btnSmall, color: '#0D9488', borderColor: '#0D948830' }}><Plus size={12} /> Agregar costo fijo</button>
      </SectionCollapsible>

      {/* Variable Costs */}
      <SectionCollapsible title="Costos variables" sectionKey="variable" open={openSections} toggle={toggle}>
        {data.variable_costs.map((vc, i) => (
          <div key={i} style={{ display: 'flex', gap: '0.5rem', marginBottom: '0.5rem', alignItems: 'center' }}>
            <input value={vc.name} onChange={e => updateVariable(i, 'name', e.target.value)} placeholder="Nombre del costo" style={{ ...inputStyle, flex: 2 }} />
            <input type="number" value={vc.per_unit_cost || ''} onChange={e => updateVariable(i, 'per_unit_cost', Number(e.target.value) || 0)} placeholder="Costo por unidad" style={{ ...inputStyle, flex: 1 }} />
            {data.variable_costs.length > 1 && (
              <button onClick={() => removeVariable(i)} style={{ ...btnSmall, color: '#DC2626', borderColor: '#DC262630', padding: '0.3rem 0.5rem' }}><Trash2 size={11} /></button>
            )}
          </div>
        ))}
        <button onClick={addVariable} style={{ ...btnSmall, color: '#0D9488', borderColor: '#0D948830' }}><Plus size={12} /> Agregar costo variable</button>
      </SectionCollapsible>

      {/* Team */}
      <SectionCollapsible title="Equipo" sectionKey="team" open={openSections} toggle={toggle}>
        {data.team.map((tm, i) => (
          <div key={i} style={{ display: 'flex', gap: '0.5rem', marginBottom: '0.5rem', alignItems: 'center' }}>
            <input value={tm.role} onChange={e => updateTeam(i, 'role', e.target.value)} placeholder="Rol" style={{ ...inputStyle, flex: 2 }} />
            <div style={{ flex: 1 }}>
              <input type="number" value={tm.salary || ''} onChange={e => updateTeam(i, 'salary', Number(e.target.value) || 0)} placeholder="Salario mensual" style={inputStyle} />
            </div>
            <div style={{ flex: 0.7 }}>
              <input type="number" value={tm.start_month} onChange={e => updateTeam(i, 'start_month', Number(e.target.value))} placeholder="Mes inicio" min={1} style={inputStyle} />
            </div>
            {data.team.length > 1 && (
              <button onClick={() => removeTeam(i)} style={{ ...btnSmall, color: '#DC2626', borderColor: '#DC262630', padding: '0.3rem 0.5rem' }}><Trash2 size={11} /></button>
            )}
          </div>
        ))}
        <button onClick={addTeam} style={{ ...btnSmall, color: '#0D9488', borderColor: '#0D948830' }}><Plus size={12} /> Agregar miembro</button>
      </SectionCollapsible>

      {/* Funding Rounds */}
      <SectionCollapsible title="Rondas de financiamiento" sectionKey="funding" open={openSections} toggle={toggle}>
        {data.planned_rounds.map((r, i) => (
          <div key={i} style={{ display: 'flex', gap: '0.5rem', marginBottom: '0.5rem', alignItems: 'center', flexWrap: 'wrap' }}>
            <input value={r.name} onChange={e => updateRound(i, 'name', e.target.value)} placeholder="Nombre (Pre-seed, Seed...)" style={{ ...inputStyle, flex: 2, minWidth: 140 }} />
            <input type="number" value={r.amount || ''} onChange={e => updateRound(i, 'amount', Number(e.target.value) || 0)} placeholder="Monto" style={{ ...inputStyle, flex: 1, minWidth: 100 }} />
            <input type="number" value={r.month} onChange={e => updateRound(i, 'month', Number(e.target.value))} placeholder="Mes" min={1} style={{ ...inputStyle, flex: 0.5, minWidth: 70 }} />
            <input type="number" value={r.dilution} onChange={e => updateRound(i, 'dilution', Number(e.target.value))} placeholder="% dilución" style={{ ...inputStyle, flex: 0.5, minWidth: 70 }} />
            <button onClick={() => removeRound(i)} style={{ ...btnSmall, color: '#DC2626', borderColor: '#DC262630', padding: '0.3rem 0.5rem' }}><Trash2 size={11} /></button>
          </div>
        ))}
        <button onClick={addRound} style={{ ...btnSmall, color: '#0D9488', borderColor: '#0D948830' }}><Plus size={12} /> Agregar ronda</button>
      </SectionCollapsible>

      {/* Auto-calculated outputs */}
      <div style={{ background: 'var(--color-bg-card)', borderRadius: 14, border: '1px solid var(--color-border)', padding: '1.25rem' }}>
        <span style={{ fontFamily: 'var(--font-heading)', fontSize: '0.9375rem', fontWeight: 700, color: 'var(--color-text-primary)', display: 'block', marginBottom: '1rem' }}>Resultados calculados</span>

        {/* Key metrics */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '0.75rem', marginBottom: '1.25rem' }}>
          <div style={{ padding: '1rem', borderRadius: 10, background: 'var(--color-bg-muted)', textAlign: 'center' }}>
            <span style={{ fontFamily: 'var(--font-body)', fontSize: '0.625rem', textTransform: 'uppercase', color: 'var(--color-text-muted)', fontWeight: 600, letterSpacing: '0.05em', display: 'block', marginBottom: '0.25rem' }}>Burn rate (mes 1)</span>
            <span style={{ fontFamily: 'var(--font-heading)', fontSize: '1.25rem', fontWeight: 700, color: '#DC2626' }}>{data.currency} {fmt(summaryMetrics.burnRate)}</span>
          </div>
          <div style={{ padding: '1rem', borderRadius: 10, background: 'var(--color-bg-muted)', textAlign: 'center' }}>
            <span style={{ fontFamily: 'var(--font-body)', fontSize: '0.625rem', textTransform: 'uppercase', color: 'var(--color-text-muted)', fontWeight: 600, letterSpacing: '0.05em', display: 'block', marginBottom: '0.25rem' }}>Runway estimado</span>
            <span style={{ fontFamily: 'var(--font-heading)', fontSize: '1.25rem', fontWeight: 700, color: summaryMetrics.runway >= 18 ? '#0D9488' : summaryMetrics.runway >= 12 ? '#2A222B' : '#DC2626' }}>
              {summaryMetrics.runway >= 999 ? '∞' : `${summaryMetrics.runway} meses`}
            </span>
          </div>
          <div style={{ padding: '1rem', borderRadius: 10, background: 'var(--color-bg-muted)', textAlign: 'center' }}>
            <span style={{ fontFamily: 'var(--font-body)', fontSize: '0.625rem', textTransform: 'uppercase', color: 'var(--color-text-muted)', fontWeight: 600, letterSpacing: '0.05em', display: 'block', marginBottom: '0.25rem' }}>Break-even</span>
            <span style={{ fontFamily: 'var(--font-heading)', fontSize: '1.25rem', fontWeight: 700, color: summaryMetrics.breakEvenMonth ? '#0D9488' : '#6B7280' }}>
              {summaryMetrics.breakEvenMonth ? `Mes ${summaryMetrics.breakEvenMonth}` : 'No alcanzado'}
            </span>
          </div>
        </div>

        {/* Monthly projection table (first 12 months) */}
        <span style={{ fontFamily: 'var(--font-heading)', fontSize: '0.8125rem', fontWeight: 600, color: 'var(--color-text-secondary)', display: 'block', marginBottom: '0.5rem' }}>Proyección mensual (primeros 12 meses)</span>
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontFamily: 'var(--font-body)', fontSize: '0.75rem' }}>
            <thead>
              <tr>
                <th style={thStyle}>Mes</th>
                <th style={thStyle}>Ingreso</th>
                <th style={thStyle}>Costos</th>
                <th style={thStyle}>Neto</th>
              </tr>
            </thead>
            <tbody>
              {projections.slice(0, 12).map(p => (
                <tr key={p.month}>
                  <td style={tdStyle}>{p.month}</td>
                  <td style={{ ...tdStyle, color: '#0D9488' }}>{data.currency} {fmt(p.revenue)}</td>
                  <td style={{ ...tdStyle, color: '#DC2626' }}>{data.currency} {fmt(p.costs)}</td>
                  <td style={{ ...tdStyle, color: p.net >= 0 ? '#0D9488' : '#DC2626', fontWeight: 600 }}>{data.currency} {fmt(p.net)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Buttons */}
      <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap', marginTop: '0.5rem' }}>
        <button onClick={handleSave} style={btnOutlineGreen}>
          <Save size={15} /> {saved ? '¡Guardado!' : 'Guardar progreso'}
        </button>
        <button onClick={onComplete} style={btnSolidGreen}>
          <CheckCircle2 size={15} /> Marcar como completada
        </button>
        <button onClick={handleReport} style={btnOutline}>
          <FileText size={15} /> Generar reporte
        </button>
      </div>
    </div>
  )
}

/* ── Shared sub-components & styles ── */

function SectionCollapsible({ title, sectionKey, open, toggle, children }: {
  title: string; sectionKey: string; open: Record<string, boolean>; toggle: (k: string) => void; children: React.ReactNode
}) {
  return (
    <div style={{ background: 'var(--color-bg-card)', borderRadius: 14, border: '1px solid var(--color-border)', overflow: 'hidden' }}>
      <button onClick={() => toggle(sectionKey)} style={sectionBtn}>
        <span style={{ fontFamily: 'var(--font-heading)', fontSize: '0.9375rem', fontWeight: 700, color: 'var(--color-text-primary)' }}>{title}</span>
        <ChevronDown size={18} color="var(--color-text-muted)" style={{ transition: 'transform 0.2s', transform: open[sectionKey] ? 'rotate(180deg)' : 'rotate(0)' }} />
      </button>
      {open[sectionKey] && <div style={{ padding: '0 1.25rem 1.25rem' }}>{children}</div>}
    </div>
  )
}

const sectionBtn: React.CSSProperties = {
  width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'space-between',
  padding: '1rem 1.25rem', background: 'none', border: 'none', cursor: 'pointer',
}

const inputStyle: React.CSSProperties = {
  width: '100%', padding: '0.625rem 0.875rem', borderRadius: 8,
  border: '1px solid var(--color-border)', background: 'var(--color-bg-card)',
  fontFamily: 'var(--font-body)', fontSize: '0.875rem', color: 'var(--color-text-primary)',
  outline: 'none',
}

const labelStyle: React.CSSProperties = {
  fontFamily: 'var(--font-heading)', fontSize: '0.75rem', fontWeight: 600,
  color: 'var(--color-text-secondary)', display: 'block', marginBottom: '0.25rem',
}

const btnSmall: React.CSSProperties = {
  display: 'inline-flex', alignItems: 'center', gap: '0.3rem',
  padding: '0.35rem 0.75rem', borderRadius: 6, fontSize: '0.75rem',
  fontFamily: 'var(--font-body)', fontWeight: 600, background: 'transparent',
  border: '1px solid var(--color-border)', cursor: 'pointer',
}

const thStyle: React.CSSProperties = {
  padding: '0.5rem 0.75rem', textAlign: 'left', fontWeight: 600,
  color: 'var(--color-text-secondary)', borderBottom: '2px solid var(--color-border)',
  fontSize: '0.6875rem', textTransform: 'uppercase', letterSpacing: '0.03em',
}

const tdStyle: React.CSSProperties = {
  padding: '0.375rem 0.75rem', borderBottom: '1px solid var(--color-border)',
  color: 'var(--color-text-primary)',
}

const btnOutlineGreen: React.CSSProperties = {
  display: 'flex', alignItems: 'center', gap: '0.5rem',
  padding: '0.75rem 1.25rem', borderRadius: 10,
  fontFamily: 'var(--font-body)', fontSize: '0.875rem', fontWeight: 600,
  background: 'transparent', color: '#0D9488',
  border: '1.5px solid #0D948840', cursor: 'pointer',
}

const btnSolidGreen: React.CSSProperties = {
  display: 'flex', alignItems: 'center', gap: '0.5rem',
  padding: '0.75rem 1.25rem', borderRadius: 10,
  fontFamily: 'var(--font-body)', fontSize: '0.875rem', fontWeight: 600,
  background: '#0D9488', color: 'white',
  border: 'none', cursor: 'pointer', boxShadow: '0 2px 8px rgba(13,148,136,0.3)',
}

const btnOutline: React.CSSProperties = {
  display: 'flex', alignItems: 'center', gap: '0.5rem',
  padding: '0.75rem 1.25rem', borderRadius: 10,
  fontFamily: 'var(--font-body)', fontSize: '0.875rem', fontWeight: 600,
  background: 'transparent', color: 'var(--color-text-secondary)',
  border: '1.5px solid var(--color-border)', cursor: 'pointer',
}
