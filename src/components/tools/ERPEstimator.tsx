'use client'

import { useState, useMemo } from 'react'
import { motion } from 'framer-motion'
import { Download, Leaf } from 'lucide-react'
import { useToolState } from '@/lib/useToolState'
import type { ToolComponentProps } from './ToolPage'

const TECH_TYPES = [
  { id: 'solar', label: 'Energía Solar / Eólica', baseEmissions: 0.7, unit: 'MWh' },
  { id: 'efficiency', label: 'Eficiencia Energética Industrial', baseEmissions: 0.4, unit: 'MWh ahorrado' },
  { id: 'transportation', label: 'Movilidad / Transporte limpio', baseEmissions: 2.3, unit: 'vehículo/año' },
  { id: 'agriculture', label: 'Agricultura / Bioeconomía', baseEmissions: 3.5, unit: 'hectárea/año' },
  { id: 'materials', label: 'Materiales Sostenibles / Química Verde', baseEmissions: 1.8, unit: 'tonelada producida' },
  { id: 'carbon_capture', label: 'Captura y Almacenamiento de Carbono', baseEmissions: 1.0, unit: 'tonelada capturada' },
  { id: 'waste', label: 'Gestión de Residuos / Economía Circular', baseEmissions: 1.2, unit: 'tonelada procesada' },
  { id: 'water', label: 'Agua y Saneamiento', baseEmissions: 0.5, unit: 'm³ tratado' },
]

export default function ERPEstimator({ userId, onComplete, onGenerateReport }: ToolComponentProps) {
  const [values, setValues] = useToolState(userId, 'erp-estimator', {
    techType: TECH_TYPES[0].id,
    annualUnits: '100',
    technologyEmissionFactor: '0.05',
    deploymentGrowthRate: '40',
    usefulLifeYears: '15',
    additionalityFactor: '85',
  } as Record<string, string>)

  const techType = values.techType
  const annualUnits = values.annualUnits
  const technologyEmissionFactor = values.technologyEmissionFactor
  const deploymentGrowthRate = values.deploymentGrowthRate
  const usefulLifeYears = values.usefulLifeYears
  const additionalityFactor = values.additionalityFactor
  const setField = (field: string, value: string) => setValues((prev) => ({ ...prev, [field]: value }))

  const selected = TECH_TYPES.find((t) => t.id === techType) || TECH_TYPES[0]

  const calc = useMemo(() => {
    const units = parseFloat(annualUnits) || 0
    const techFactor = parseFloat(technologyEmissionFactor) || 0
    const growth = parseFloat(deploymentGrowthRate) / 100 || 0
    const life = parseFloat(usefulLifeYears) || 1
    const additionality = parseFloat(additionalityFactor) / 100 || 0.85

    const baselinePerUnit = selected.baseEmissions
    const techPerUnit = techFactor
    const reductionPerUnit = (baselinePerUnit - techPerUnit) * additionality

    const year1 = units * reductionPerUnit
    let total10 = 0
    let currentUnits = units
    for (let i = 0; i < 10; i++) {
      total10 += currentUnits * reductionPerUnit
      if (i < 9) currentUnits *= 1 + growth
    }
    const lifetime = units * reductionPerUnit * life * ((1 + growth) ** (life / 2))

    const costPerTon = year1 > 0 ? 50000 / year1 : 0 // proxy at $50k/year cost

    return {
      reductionPerUnit: Math.round(reductionPerUnit * 100) / 100,
      year1: Math.round(year1),
      total10: Math.round(total10),
      lifetime: Math.round(lifetime),
      costPerTon: Math.round(costPerTon),
    }
  }, [selected, annualUnits, technologyEmissionFactor, deploymentGrowthRate, usefulLifeYears, additionalityFactor])

  const years10Projection = useMemo(() => {
    const units = parseFloat(annualUnits) || 0
    const growth = parseFloat(deploymentGrowthRate) / 100 || 0
    const additionality = parseFloat(additionalityFactor) / 100 || 0.85
    const reductionPerUnit = (selected.baseEmissions - (parseFloat(technologyEmissionFactor) || 0)) * additionality
    return Array.from({ length: 10 }, (_, i) => {
      const u = units * (1 + growth) ** i
      return Math.round(u * reductionPerUnit)
    })
  }, [selected, annualUnits, technologyEmissionFactor, deploymentGrowthRate, additionalityFactor])

  const maxBar = Math.max(...years10Projection)

  const handleReport = () => {
    const content = `
ESTIMADOR DE EMISIONES REDUCIDAS (ERP)
Metodología: IRIS+ / Project Frame

Tecnología: ${selected.label}
Unidad de medida: ${selected.unit}

Parámetros:
  Unidades desplegadas (Año 1): ${parseInt(annualUnits).toLocaleString('es')} ${selected.unit}s
  Factor de emisiones línea base: ${selected.baseEmissions} tCO2eq/${selected.unit}
  Factor de emisiones tecnología: ${technologyEmissionFactor} tCO2eq/${selected.unit}
  Tasa de crecimiento anual: ${deploymentGrowthRate}%
  Vida útil del sistema: ${usefulLifeYears} años
  Factor de adicionalidad: ${additionalityFactor}%

Resultados:

Reducción por unidad: ${calc.reductionPerUnit} tCO2eq/${selected.unit}
Año 1 — tCO2eq reducidas: ${calc.year1.toLocaleString('es')} toneladas
Acumulado 10 años: ${calc.total10.toLocaleString('es')} toneladas
Impacto de vida útil: ~${calc.lifetime.toLocaleString('es')} toneladas

Proyección Año a Año (tCO2eq):
${years10Projection.map((v, i) => `  Año ${i + 1}: ${v.toLocaleString('es')} tCO2eq`).join('\n')}

Métricas IRIS+:
  PI2731 — GHG Emissions Reduced: ${calc.year1.toLocaleString('es')} tCO2eq/año
  PI3713 — Clean Energy Generated: Relevante si aplica
  Clase de activo: ${calc.total10 > 100000 ? 'Escala Gigaton — apto para fondos de impacto institucionales' : calc.total10 > 10000 ? 'Escala Megaton — apto para VCs climáticos' : 'Escala Kilaton — etapa temprana de impacto'}

Comparativa de mercado de carbono:
  A $15/tCO2eq (mercado voluntario): $${(calc.year1 * 15).toLocaleString('es')}/año
  A $50/tCO2eq (mercado regulado EU): $${(calc.year1 * 50).toLocaleString('es')}/año
    `.trim()
    onGenerateReport(content)
    onComplete()
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.25rem' }}>
        {/* Inputs */}
        <div style={{ background: 'var(--color-bg-card)', borderRadius: 16, border: '1px solid var(--color-border)', padding: '1.5rem', boxShadow: 'var(--shadow-card)' }}>
          <h3 style={{ fontFamily: 'var(--font-heading)', fontSize: '1rem', fontWeight: 700, color: 'var(--color-text-primary)', marginBottom: '1.25rem' }}>
            Parámetros de Impacto
          </h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.875rem' }}>
            <div>
              <label style={{ display: 'block', fontFamily: 'var(--font-body)', fontSize: '0.75rem', fontWeight: 600, color: 'var(--color-text-primary)', marginBottom: '0.375rem' }}>
                Tipo de tecnología climática
              </label>
              <select
                value={techType}
                onChange={(e) => setField('techType', e.target.value)}
                style={{ width: '100%', padding: '0.625rem 0.75rem', borderRadius: 8, border: '1px solid var(--color-border)', background: 'var(--color-bg-primary)', fontFamily: 'var(--font-body)', fontSize: '0.875rem', color: 'var(--color-text-primary)', outline: 'none' }}
              >
                {TECH_TYPES.map((t) => <option key={t.id} value={t.id}>{t.label}</option>)}
              </select>
            </div>
            <SimpleInput label={`Unidades desplegadas en Año 1 (${selected.unit}s)`} value={annualUnits} onChange={(v) => setField('annualUnits', v)} suffix={selected.unit} />
            <SimpleInput label={`Factor de emisiones de tu tecnología (tCO2eq/${selected.unit})`} value={technologyEmissionFactor} onChange={(v) => setField('technologyEmissionFactor', v)} hint={`Línea base del sector: ${selected.baseEmissions} tCO2eq/${selected.unit}`} />
            <SimpleInput label="Tasa de crecimiento anual del despliegue (%)" value={deploymentGrowthRate} onChange={(v) => setField('deploymentGrowthRate', v)} suffix="%" />
            <SimpleInput label="Vida útil del sistema (años)" value={usefulLifeYears} onChange={(v) => setField('usefulLifeYears', v)} suffix="años" />
            <SimpleInput label="Factor de adicionalidad (%)" value={additionalityFactor} onChange={(v) => setField('additionalityFactor', v)} suffix="%" hint="% del impacto atribuible a tu intervención (típico: 75-95%)" />
          </div>
        </div>

        {/* Results */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.875rem' }}>
          <div style={{ background: 'linear-gradient(135deg, rgba(5,150,105,0.06), rgba(5,150,105,0.02))', borderRadius: 16, border: '1px solid rgba(5,150,105,0.15)', padding: '1.25rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.875rem' }}>
              <Leaf size={16} color="#059669" />
              <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.6875rem', fontWeight: 700, color: '#059669', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                Impacto Climático
              </span>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '0.75rem' }}>
              <ImpactStat label="Año 1" value={`${calc.year1.toLocaleString('es')} tCO2eq`} color="#059669" />
              <ImpactStat label="Acumulado 10 años" value={`${calc.total10.toLocaleString('es')} tCO2eq`} color="#0D9488" />
              <ImpactStat label="Por unidad desplegada" value={`${calc.reductionPerUnit} tCO2eq`} color="#0891B2" />
            </div>
          </div>

          {/* 10-year bar chart */}
          <div style={{ background: 'var(--color-bg-card)', borderRadius: 16, border: '1px solid var(--color-border)', padding: '1.25rem', boxShadow: 'var(--shadow-card)' }}>
            <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.625rem', fontWeight: 600, color: 'var(--color-text-muted)', textTransform: 'uppercase', marginBottom: '0.875rem' }}>
              Proyección 10 años (tCO2eq)
            </div>
            <div style={{ display: 'flex', alignItems: 'flex-end', gap: '3px', height: 80 }}>
              {years10Projection.map((v, i) => (
                <motion.div
                  key={i}
                  initial={{ height: 0 }}
                  animate={{ height: `${maxBar > 0 ? (v / maxBar) * 80 : 0}px` }}
                  transition={{ duration: 0.5, delay: i * 0.05 }}
                  style={{
                    flex: 1,
                    borderRadius: '3px 3px 0 0',
                    background: `linear-gradient(180deg, #059669, #0D9488)`,
                    minHeight: 2,
                    position: 'relative',
                  }}
                  title={`Año ${i + 1}: ${v.toLocaleString('es')} tCO2eq`}
                />
              ))}
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '0.25rem' }}>
              <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.5625rem', color: 'var(--color-text-muted)' }}>Año 1</span>
              <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.5625rem', color: 'var(--color-text-muted)' }}>Año 10</span>
            </div>
          </div>

          <div style={{ background: 'var(--color-bg-card)', borderRadius: 12, border: '1px solid var(--color-border)', padding: '1rem' }}>
            <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.625rem', color: 'var(--color-text-muted)', textTransform: 'uppercase', marginBottom: '0.375rem' }}>
              Clasificación de Escala
            </div>
            <div style={{ fontFamily: 'var(--font-heading)', fontSize: '0.9375rem', fontWeight: 700, color: calc.total10 > 100000 ? '#7C3AED' : calc.total10 > 10000 ? '#059669' : '#D97706' }}>
              {calc.total10 > 100000 ? 'Gigaton Pathway' : calc.total10 > 10000 ? 'Climate Relevant' : 'Early Stage Impact'}
            </div>
            <div style={{ fontFamily: 'var(--font-body)', fontSize: '0.75rem', color: 'var(--color-text-secondary)', marginTop: '0.25rem' }}>
              {calc.total10 > 100000 ? 'Apto para fondos de impacto institucionales y desarrollo de proyectos a gran escala.' : calc.total10 > 10000 ? 'Apto para VCs climáticos y fondos de blended finance. Cuantifica impacto en tu pitch.' : 'Etapa temprana. Crece el despliegue y valida tu modelo de impacto con LCA.'}
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
        Generar Reporte ERP
      </button>
    </div>
  )
}

function SimpleInput({ label, value, onChange, suffix, hint }: {
  label: string; value: string; onChange: (v: string) => void; suffix?: string; hint?: string;
}) {
  const [focused, setFocused] = useState(false)
  return (
    <div>
      <label style={{ display: 'block', fontFamily: 'var(--font-body)', fontSize: '0.75rem', fontWeight: 600, color: 'var(--color-text-primary)', marginBottom: '0.25rem' }}>{label}</label>
      {hint && <div style={{ fontFamily: 'var(--font-body)', fontSize: '0.6875rem', color: 'var(--color-text-muted)', marginBottom: '0.25rem' }}>{hint}</div>}
      <div style={{ display: 'flex', alignItems: 'center', borderRadius: 8, border: `1px solid ${focused ? '#059669' : 'var(--color-border)'}`, overflow: 'hidden', transition: 'border 0.15s' }}>
        <input type="number" value={value} onChange={(e) => onChange(e.target.value)} onFocus={() => setFocused(true)} onBlur={() => setFocused(false)}
          style={{ flex: 1, padding: '0.5625rem 0.625rem', border: 'none', background: 'var(--color-bg-primary)', fontFamily: 'var(--font-mono)', fontSize: '0.875rem', color: 'var(--color-text-primary)', outline: 'none' }}
        />
        {suffix && <span style={{ padding: '0 0.5rem', fontFamily: 'var(--font-mono)', fontSize: '0.75rem', color: 'var(--color-text-muted)', borderLeft: '1px solid var(--color-border)', background: 'var(--color-bg-muted)' }}>{suffix}</span>}
      </div>
    </div>
  )
}

function ImpactStat({ label, value, color }: { label: string; value: string; color: string }) {
  return (
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
      <span style={{ fontFamily: 'var(--font-body)', fontSize: '0.8125rem', color: 'var(--color-text-secondary)' }}>{label}</span>
      <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.9375rem', fontWeight: 700, color }}>{value}</span>
    </div>
  )
}
