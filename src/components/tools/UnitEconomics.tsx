'use client'

import { useState, useMemo } from 'react'
import { motion } from 'framer-motion'
import { Download, Info, TrendingUp, TrendingDown } from 'lucide-react'
import { useToolState } from '@/lib/useToolState'
import type { ToolComponentProps } from './ToolPage'

const DEFAULT_INPUTS: Record<string, string> = {
  revenuePerClient: '50000',
  cogsPerUnit: '15000',
  installationCost: '8000',
  salesCycleMonths: '9',
  churnRateAnnual: '8',
  fossilAlternativePrice: '45000',
  marketingCostPerLead: '500',
  conversionRate: '10',
}

export default function UnitEconomics({ userId, onComplete, onGenerateReport }: ToolComponentProps) {
  const [inputs, setInputs] = useToolState(userId, 'unit-economics', DEFAULT_INPUTS)

  const set = (field: string) => (e: React.ChangeEvent<HTMLInputElement>) =>
    setInputs((p) => ({ ...p, [field]: e.target.value }))

  const calc = useMemo(() => {
    const rev = parseFloat(inputs.revenuePerClient) || 0
    const cogs = parseFloat(inputs.cogsPerUnit) || 0
    const install = parseFloat(inputs.installationCost) || 0
    const cycle = parseFloat(inputs.salesCycleMonths) || 1
    const churn = parseFloat(inputs.churnRateAnnual) / 100 || 0.1
    const fossil = parseFloat(inputs.fossilAlternativePrice) || 0
    const mktg = parseFloat(inputs.marketingCostPerLead) || 0
    const conv = parseFloat(inputs.conversionRate) / 100 || 0.1

    const cac = (mktg / conv) + (rev * (cycle / 12) * 0.2) // simplified: mktg + sales cost proxy
    const grossMargin = rev - cogs
    const grossMarginPct = rev > 0 ? (grossMargin / rev) * 100 : 0
    const ltv = rev > 0 ? grossMargin / churn : 0
    const ltvCacRatio = cac > 0 ? ltv / cac : 0
    const paybackMonths = grossMargin > 0 ? (cac / (grossMargin / 12)) : 0
    const greenPremium = fossil > 0 ? ((rev - fossil) / fossil) * 100 : 0
    const parityGap = rev - fossil

    return {
      cac: Math.round(cac),
      grossMargin: Math.round(grossMargin),
      grossMarginPct: Math.round(grossMarginPct),
      ltv: Math.round(ltv),
      ltvCacRatio: Math.round(ltvCacRatio * 10) / 10,
      paybackMonths: Math.round(paybackMonths),
      greenPremium: Math.round(greenPremium * 10) / 10,
      parityGap: Math.round(parityGap),
    }
  }, [inputs])

  const handleReport = () => {
    const content = `
UNIT ECONOMICS & GREEN PREMIUM

Entradas del Modelo:
  Ingresos por cliente (anual): $${parseInt(inputs.revenuePerClient).toLocaleString('es')}
  COGS por unidad: $${parseInt(inputs.cogsPerUnit).toLocaleString('es')}
  Costo de instalación: $${parseInt(inputs.installationCost).toLocaleString('es')}
  Ciclo de ventas: ${inputs.salesCycleMonths} meses
  Churn rate anual: ${inputs.churnRateAnnual}%
  Precio alternativa fósil: $${parseInt(inputs.fossilAlternativePrice).toLocaleString('es')}
  Costo de marketing por lead: $${parseInt(inputs.marketingCostPerLead).toLocaleString('es')}
  Tasa de conversión: ${inputs.conversionRate}%

Resultados:

Customer Acquisition Cost (CAC): $${calc.cac.toLocaleString('es')}
Margen Bruto por cliente: $${calc.grossMargin.toLocaleString('es')} (${calc.grossMarginPct}%)
Lifetime Value (LTV): $${calc.ltv.toLocaleString('es')}
Ratio LTV/CAC: ${calc.ltvCacRatio}x ${calc.ltvCacRatio >= 3 ? '✓ Saludable (≥3x)' : calc.ltvCacRatio >= 1 ? '⚠ Mejorable (<3x)' : '✗ Crítico (<1x)'}
Payback Period: ${calc.paybackMonths} meses ${calc.paybackMonths <= 18 ? '✓ Saludable (≤18m)' : '⚠ Largo (>18m)'}

Green Premium: ${calc.greenPremium > 0 ? '+' : ''}${calc.greenPremium}% vs. alternativa fósil
  ${calc.parityGap > 0 ? `Tu solución cuesta $${Math.abs(calc.parityGap).toLocaleString('es')} más que la alternativa fósil. Cuantifica el valor de las externalidades positivas (reducción de CO2, subsidios, incentivos).` : `Tu solución ya está en paridad o por debajo de la alternativa fósil. Ventaja competitiva demostrada.`}

Recomendaciones:
${calc.ltvCacRatio < 3 ? '  → Optimiza tu proceso de ventas o reduce costo de adquisición con referidos y partnerships.' : '  → Ratio LTV/CAC saludable. Considera invertir más en ventas para escalar.'}
${calc.paybackMonths > 18 ? '  → Considera modelo HaaS/PPA para reducir la inversión inicial del cliente y acelerar el ciclo.' : '  → Payback period competitivo. Usa este dato como argumento de venta.'}
${calc.greenPremium > 15 ? '  → Green premium alto. Cuantifica CO2 reducido y busca contratos con empresas con compromisos net-zero.' : '  → Trabaja hacia paridad de precio para desbloquear mercados masivos sin depender del premium verde.'}
    `.trim()
    onGenerateReport(content)
    onComplete()
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.25rem' }}>
        {/* Inputs panel */}
        <div style={{ background: 'var(--color-bg-card)', borderRadius: 16, border: '1px solid var(--color-border)', padding: '1.5rem', boxShadow: 'var(--shadow-card)' }}>
          <h3 style={{ fontFamily: 'var(--font-heading)', fontSize: '1rem', fontWeight: 700, color: 'var(--color-text-primary)', marginBottom: '1.25rem' }}>
            Parámetros del Modelo
          </h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.875rem' }}>
            <NumberInput label="Ingresos anuales por cliente (USD)" value={inputs.revenuePerClient} onChange={set('revenuePerClient')} prefix="$" />
            <NumberInput label="COGS por unidad (USD)" value={inputs.cogsPerUnit} onChange={set('cogsPerUnit')} prefix="$" hint="Costo de fabricación/instalación por cliente" />
            <NumberInput label="Costo de instalación (USD)" value={inputs.installationCost} onChange={set('installationCost')} prefix="$" />
            <NumberInput label="Ciclo de ventas (meses)" value={inputs.salesCycleMonths} onChange={set('salesCycleMonths')} suffix="meses" />
            <NumberInput label="Churn rate anual (%)" value={inputs.churnRateAnnual} onChange={set('churnRateAnnual')} suffix="%" />
            <NumberInput label="Precio alternativa fósil (USD/año)" value={inputs.fossilAlternativePrice} onChange={set('fossilAlternativePrice')} prefix="$" hint="Costo del servicio equivalente con tecnología convencional" />
            <NumberInput label="Costo de marketing por lead (USD)" value={inputs.marketingCostPerLead} onChange={set('marketingCostPerLead')} prefix="$" />
            <NumberInput label="Tasa de conversión lead → cliente (%)" value={inputs.conversionRate} onChange={set('conversionRate')} suffix="%" />
          </div>
        </div>

        {/* Results panel */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.875rem' }}>
          <MetricCard label="Customer Acquisition Cost" value={`$${calc.cac.toLocaleString('es')}`} sub="Costo de adquirir un cliente" color="#0891B2" />
          <MetricCard label="Margen Bruto" value={`$${calc.grossMargin.toLocaleString('es')}`} sub={`${calc.grossMarginPct}% sobre ingresos`} color={calc.grossMarginPct > 50 ? '#059669' : '#D97706'} />
          <MetricCard label="Lifetime Value (LTV)" value={`$${calc.ltv.toLocaleString('es')}`} sub="Valor total del cliente" color="#7C3AED" />
          <div style={{ background: 'var(--color-bg-card)', borderRadius: 12, border: '1px solid var(--color-border)', padding: '1rem', boxShadow: 'var(--shadow-card)' }}>
            <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.625rem', color: 'var(--color-text-muted)', textTransform: 'uppercase', marginBottom: '0.375rem' }}>LTV / CAC Ratio</div>
            <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.5rem' }}>
              <span style={{ fontFamily: 'var(--font-mono)', fontSize: '1.75rem', fontWeight: 700, color: calc.ltvCacRatio >= 3 ? '#059669' : calc.ltvCacRatio >= 1 ? '#D97706' : '#DC2626' }}>
                {calc.ltvCacRatio}x
              </span>
              {calc.ltvCacRatio >= 3 ? <TrendingUp size={16} color="#059669" /> : <TrendingDown size={16} color="#D97706" />}
            </div>
            <div style={{ fontFamily: 'var(--font-body)', fontSize: '0.75rem', color: 'var(--color-text-secondary)', marginTop: '0.25rem' }}>
              {calc.ltvCacRatio >= 3 ? '✓ Saludable — objetivo ≥3x' : calc.ltvCacRatio >= 1 ? '⚠ Mejorable — objetivo ≥3x' : '✗ Crítico — revisar modelo'}
            </div>
            <div style={{ marginTop: '0.5rem', height: 4, borderRadius: 2, background: 'var(--color-bg-muted)' }}>
              <div style={{ height: '100%', borderRadius: 2, background: calc.ltvCacRatio >= 3 ? '#059669' : '#D97706', width: `${Math.min(100, (calc.ltvCacRatio / 5) * 100)}%`, transition: 'width 0.6s' }} />
            </div>
          </div>
          <div style={{ background: 'var(--color-bg-card)', borderRadius: 12, border: '1px solid var(--color-border)', padding: '1rem', boxShadow: 'var(--shadow-card)' }}>
            <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.625rem', color: 'var(--color-text-muted)', textTransform: 'uppercase', marginBottom: '0.375rem' }}>Green Premium</div>
            <div style={{ fontFamily: 'var(--font-mono)', fontSize: '1.75rem', fontWeight: 700, color: calc.greenPremium > 0 ? '#D97706' : '#059669' }}>
              {calc.greenPremium > 0 ? '+' : ''}{calc.greenPremium}%
            </div>
            <div style={{ fontFamily: 'var(--font-body)', fontSize: '0.75rem', color: 'var(--color-text-secondary)', marginTop: '0.25rem' }}>
              {calc.greenPremium > 0 ? `$${Math.abs(calc.parityGap).toLocaleString('es')} sobre alternativa fósil` : 'En paridad o por debajo del fósil ✓'}
            </div>
          </div>
        </div>
      </div>

      <button
        onClick={handleReport}
        style={{
          display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem',
          width: '100%', padding: '0.875rem', borderRadius: 12,
          background: '#059669', color: 'white',
          fontFamily: 'var(--font-body)', fontSize: '0.9375rem', fontWeight: 600,
          border: 'none', cursor: 'pointer', boxShadow: '0 4px 14px rgba(5,150,105,0.3)',
          transition: 'all 0.2s',
        }}
        onMouseEnter={(e) => (e.currentTarget.style.background = '#047857')}
        onMouseLeave={(e) => (e.currentTarget.style.background = '#059669')}
      >
        <Download size={17} />
        Generar Reporte de Unit Economics
      </button>
    </div>
  )
}

function NumberInput({ label, value, onChange, prefix, suffix, hint }: {
  label: string; value: string; onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  prefix?: string; suffix?: string; hint?: string;
}) {
  const [focused, setFocused] = useState(false)
  return (
    <div>
      <label style={{ display: 'block', fontFamily: 'var(--font-body)', fontSize: '0.75rem', fontWeight: 600, color: 'var(--color-text-primary)', marginBottom: '0.25rem' }}>
        {label}
      </label>
      {hint && <div style={{ fontFamily: 'var(--font-body)', fontSize: '0.6875rem', color: 'var(--color-text-muted)', marginBottom: '0.25rem' }}>{hint}</div>}
      <div style={{ display: 'flex', alignItems: 'center', borderRadius: 8, border: `1px solid ${focused ? '#059669' : 'var(--color-border)'}`, background: 'var(--color-bg-primary)', overflow: 'hidden', transition: 'border 0.15s', boxShadow: focused ? '0 0 0 2px rgba(5,150,105,0.08)' : 'none' }}>
        {prefix && <span style={{ padding: '0 0.5rem', fontFamily: 'var(--font-mono)', fontSize: '0.8125rem', color: 'var(--color-text-muted)', borderRight: '1px solid var(--color-border)', background: 'var(--color-bg-muted)' }}>{prefix}</span>}
        <input type="number" value={value} onChange={onChange} onFocus={() => setFocused(true)} onBlur={() => setFocused(false)}
          style={{ flex: 1, padding: '0.5625rem 0.625rem', border: 'none', background: 'transparent', fontFamily: 'var(--font-mono)', fontSize: '0.875rem', color: 'var(--color-text-primary)', outline: 'none' }}
        />
        {suffix && <span style={{ padding: '0 0.5rem', fontFamily: 'var(--font-mono)', fontSize: '0.8125rem', color: 'var(--color-text-muted)', borderLeft: '1px solid var(--color-border)', background: 'var(--color-bg-muted)' }}>{suffix}</span>}
      </div>
    </div>
  )
}

function MetricCard({ label, value, sub, color }: { label: string; value: string; sub: string; color: string }) {
  return (
    <div style={{ background: 'var(--color-bg-card)', borderRadius: 12, border: '1px solid var(--color-border)', padding: '1rem', boxShadow: 'var(--shadow-card)' }}>
      <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.625rem', color: 'var(--color-text-muted)', textTransform: 'uppercase', marginBottom: '0.25rem' }}>{label}</div>
      <div style={{ fontFamily: 'var(--font-mono)', fontSize: '1.5rem', fontWeight: 700, color }}>{value}</div>
      <div style={{ fontFamily: 'var(--font-body)', fontSize: '0.75rem', color: 'var(--color-text-secondary)', marginTop: '0.125rem' }}>{sub}</div>
    </div>
  )
}
