// Tool-specific HTML formatters for the global report
// Each formatter understands the data shape of its tool and produces readable HTML

const S = {
  label: 'color:#6B7280;font-size:0.75rem;font-weight:600;text-transform:uppercase;letter-spacing:0.04em;margin-bottom:4px',
  value: 'color:#111827;font-size:0.875rem;line-height:1.6',
  card: 'background:#0E0E0E;border-radius:10px;padding:14px 16px;margin-bottom:8px',
  grid2: 'display:grid;grid-template-columns:1fr 1fr;gap:8px',
  grid3: 'display:grid;grid-template-columns:1fr 1fr 1fr;gap:8px',
  sectionTitle: 'font-family:"Mluvka",system-ui,sans-serif;font-size:0.9375rem;font-weight:700;color:#111827;margin:16px 0 8px 0',
  badge: (color: string) => `display:inline-block;padding:2px 10px;border-radius:8px;font-size:0.6875rem;font-weight:600;color:${color};background:${color}15`,
  status: (s: string) => {
    const m: Record<string, string> = { done: '#1F77F6', partial: '#2A222B', 'in-progress': '#2A222B', pending: '#9CA3AF', missing: '#EF4444', na: '#9CA3AF', identified: '#6B7280', applying: '#1F77F6', secured: '#1F77F6', rejected: '#EF4444' }
    const labels: Record<string, string> = { done: 'Completado', partial: 'Parcial', 'in-progress': 'En progreso', pending: 'Pendiente', missing: 'Faltante', na: 'N/A', identified: 'Identificado', applying: 'Aplicando', secured: 'Asegurado', rejected: 'Rechazado' }
    const c = m[s] || '#6B7280'
    return `<span style="${S.badge(c)}">${labels[s] || s}</span>`
  },
  field: (label: string, value: string) => value?.trim() ? `<div style="${S.card}"><div style="${S.label}">${label}</div><div style="${S.value}">${value}</div></div>` : '',
}

// ──────────── TRL Calculator ────────────
const TRL_LABELS: Record<string, string> = {
  q1: 'Principios básicos observados y reportados',
  q2: 'Concepto tecnológico formulado',
  q3: 'Prueba de concepto experimental',
  q4: 'Validación en laboratorio',
  q5: 'Validación en entorno relevante',
  q6: 'Demostración en entorno relevante',
  q7: 'Demostración en entorno operativo',
  q8: 'Sistema completo cualificado',
  q9: 'Sistema probado en entorno operativo real',
}
const CRL_LABELS: Record<string, string> = {
  c1: 'Hipótesis de mercado identificada',
  c2: 'Validación con clientes potenciales',
  c3: 'Piloto o LOI firmado',
  c4: 'Primer ingreso recurrente',
  c5: 'Modelo de negocio escalable validado',
  c6: 'Revenue predictable y creciente',
}

function formatTRL(data: Record<string, unknown>): string {
  const v = (data.values || data) as Record<string, unknown>
  const trl = (v.trlAnswers || {}) as Record<string, boolean | null>
  const crl = (v.crlAnswers || {}) as Record<string, boolean | null>
  const trlScore = Object.entries(trl).filter(([, a]) => a === true).length
  const crlScore = Object.entries(crl).filter(([, a]) => a === true).length

  const renderAnswers = (answers: Record<string, boolean | null>, labels: Record<string, string>) =>
    Object.entries(labels).map(([k, label]) => {
      const a = answers[k]
      const icon = a === true ? '✅' : a === false ? '❌' : '⬜'
      return `<div style="display:flex;gap:8px;align-items:center;padding:4px 0;font-size:0.8125rem"><span>${icon}</span><span style="color:#374151">${label}</span></div>`
    }).join('')

  return `
    <div style="${S.grid2}">
      <div style="${S.card}"><div style="${S.label}">TRL Score</div><div style="font-size:1.5rem;font-weight:700;color:#DA4E24">${trlScore}/9</div></div>
      <div style="${S.card}"><div style="${S.label}">CRL Score</div><div style="font-size:1.5rem;font-weight:700;color:#1F77F6">${crlScore}/6</div></div>
    </div>
    <div style="${S.sectionTitle}">Madurez Tecnológica (TRL)</div>
    ${renderAnswers(trl, TRL_LABELS)}
    <div style="${S.sectionTitle}">Madurez Comercial (CRL)</div>
    ${renderAnswers(crl, CRL_LABELS)}
  `
}

// ──────────── Lean Canvas ────────────
const CANVAS_LABELS: Record<string, string> = {
  problem: 'Problema', solution: 'Solución', uvp: 'Propuesta de Valor Única',
  advantage: 'Ventaja Competitiva', segments: 'Segmentos de Clientes',
  metrics: 'Métricas Clave', channels: 'Canales', costs: 'Estructura de Costos',
  revenue: 'Flujo de Ingresos', impact: 'Impacto Climático', regulatory: 'Marco Regulatorio',
}

function formatLeanCanvas(data: Record<string, unknown>): string {
  const v = (data.values || data) as Record<string, string>
  return Object.entries(CANVAS_LABELS)
    .map(([k, label]) => S.field(label, v[k] || ''))
    .filter(Boolean)
    .join('')
}

// ──────────── Lab to Market ────────────
function formatLabToMarket(data: Record<string, unknown>): string {
  const v = (data.values || data) as Record<string, unknown>
  const sections = (v.sections || []) as Array<{ id: string; title: string; items: Array<{ label: string; desc: string; status: string }> }>
  return sections.map(sec => {
    const total = sec.items.length
    const done = sec.items.filter(i => i.status === 'done').length
    return `
      <div style="${S.sectionTitle}">${sec.title} <span style="font-size:0.75rem;color:#6B7280;font-weight:400">(${done}/${total})</span></div>
      ${sec.items.map(item => `<div style="display:flex;align-items:center;gap:8px;padding:5px 0;font-size:0.8125rem">${S.status(item.status)}<span style="color:#111827">${item.label}</span></div>`).join('')}
    `
  }).join('')
}

// ──────────── Stakeholder Matrix ────────────
function formatStakeholders(data: Record<string, unknown>): string {
  const v = (data.values || data) as Record<string, unknown>
  const list = (v.stakeholders || []) as Array<{ name: string; type: string; influence: number; interest: number; strategy: string; notes: string }>
  if (list.length === 0) return '<p style="color:#9CA3AF;font-style:italic">Sin stakeholders registrados</p>'
  return `
    <table style="width:100%;border-collapse:collapse;font-size:0.8125rem">
      <thead><tr style="border-bottom:2px solid #E5E7EB">
        <th style="text-align:left;padding:8px;color:#6B7280;font-weight:600">Nombre</th>
        <th style="text-align:left;padding:8px;color:#6B7280;font-weight:600">Tipo</th>
        <th style="text-align:center;padding:8px;color:#6B7280;font-weight:600">Influencia</th>
        <th style="text-align:center;padding:8px;color:#6B7280;font-weight:600">Interés</th>
        <th style="text-align:left;padding:8px;color:#6B7280;font-weight:600">Estrategia</th>
      </tr></thead>
      <tbody>${list.map(s => `<tr style="border-bottom:1px solid #F3F4F6">
        <td style="padding:8px;color:#111827;font-weight:500">${s.name}</td>
        <td style="padding:8px;color:#6B7280">${s.type}</td>
        <td style="padding:8px;text-align:center;color:#111827;font-weight:600">${s.influence}/5</td>
        <td style="padding:8px;text-align:center;color:#111827;font-weight:600">${s.interest}/5</td>
        <td style="padding:8px;color:#374151">${s.strategy || '—'}</td>
      </tr>`).join('')}</tbody>
    </table>
  `
}

// ──────────── Founder Audit ────────────
const SKILL_LABELS: Record<string, string> = {
  tech: 'Técnico', commercial: 'Comercial', finance: 'Financiero',
  ops: 'Operaciones', regulatory: 'Regulatorio', climate: 'Clima / Impacto',
}

function formatFounderAudit(data: Record<string, unknown>): string {
  const v = (data.values || data) as Record<string, unknown>
  const founders = (v.founders || []) as Array<{ name: string; role: string; scores: Record<string, number> }>
  return founders.map(f => {
    const avg = Object.values(f.scores).reduce((a, b) => a + b, 0) / Math.max(Object.values(f.scores).length, 1)
    return `
      <div style="${S.card}">
        <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:8px">
          <div><strong style="color:#111827">${f.name}</strong><span style="margin-left:8px;color:#6B7280;font-size:0.75rem">${f.role}</span></div>
          <span style="${S.badge('#DA4E24')}">Promedio: ${avg.toFixed(1)}/5</span>
        </div>
        <div style="${S.grid3}">${Object.entries(SKILL_LABELS).map(([k, label]) => `<div style="text-align:center"><div style="font-size:1rem;font-weight:700;color:#DA4E24">${f.scores[k] ?? 0}</div><div style="font-size:0.6875rem;color:#6B7280">${label}</div></div>`).join('')}</div>
      </div>
    `
  }).join('')
}

// ──────────── Business Models ────────────
const MODEL_LABELS: Record<string, { name: string; desc: string }> = {
  saas: { name: 'SaaS / Plataforma', desc: 'Modelo de software como servicio con ingresos recurrentes.' },
  capex: { name: 'CAPEX / Venta de equipos', desc: 'Venta directa de activos o infraestructura.' },
  haas: { name: 'Hardware-as-a-Service', desc: 'El cliente paga por uso o suscripción del hardware.' },
  licensing: { name: 'Licenciamiento de IP', desc: 'Monetización vía licencias de propiedad intelectual.' },
  esco: { name: 'ESCO / Performance Contract', desc: 'Ahorro compartido basado en rendimiento energético.' },
}

function formatBusinessModels(data: Record<string, unknown>): string {
  const v = (data.values || data) as Record<string, unknown>
  const result = v.result as string | null
  if (!result) return '<p style="color:#9CA3AF;font-style:italic">Aún no se ha completado el árbol de decisión</p>'
  const model = MODEL_LABELS[result] || { name: result, desc: '' }
  return `
    <div style="${S.card};border-left:4px solid #1F77F6">
      <div style="${S.label}">Modelo recomendado</div>
      <div style="font-size:1.125rem;font-weight:700;color:#1F77F6;margin-bottom:4px">${model.name}</div>
      <div style="font-size:0.8125rem;color:#4B5563">${model.desc}</div>
    </div>
  `
}

// ──────────── Unit Economics ────────────
const UE_LABELS: Record<string, string> = {
  revenuePerClient: 'Ingreso anual por cliente (USD)',
  cogsPerUnit: 'COGS por unidad (USD)',
  installationCost: 'Costo de instalación (USD)',
  salesCycleMonths: 'Ciclo de venta (meses)',
  churnRateAnnual: 'Tasa de churn anual (%)',
  fossilAlternativePrice: 'Precio alternativa fósil (USD)',
  marketingCostPerLead: 'Costo por lead (USD)',
  conversionRate: 'Tasa de conversión (%)',
}

function formatUnitEconomics(data: Record<string, unknown>): string {
  const v = (data.values || data) as Record<string, string>
  const revenue = parseFloat(v.revenuePerClient) || 0
  const cogs = parseFloat(v.cogsPerUnit) || 0
  const churn = (parseFloat(v.churnRateAnnual) || 0) / 100
  const mktCost = parseFloat(v.marketingCostPerLead) || 0
  const conv = (parseFloat(v.conversionRate) || 1) / 100
  const cac = conv > 0 ? mktCost / conv : 0
  const ltv = churn > 0 ? (revenue - cogs) / churn : 0
  const ltvCac = cac > 0 ? ltv / cac : 0
  const fossil = parseFloat(v.fossilAlternativePrice) || 0
  const greenPremium = fossil > 0 ? ((revenue - fossil) / fossil * 100) : 0

  return `
    <div style="${S.grid2};margin-bottom:12px">
      <div style="${S.card};border-left:4px solid #1F77F6"><div style="${S.label}">LTV</div><div style="font-size:1.25rem;font-weight:700;color:#1F77F6">$${ltv.toLocaleString('en', { maximumFractionDigits: 0 })}</div></div>
      <div style="${S.card};border-left:4px solid #1F77F6"><div style="${S.label}">CAC</div><div style="font-size:1.25rem;font-weight:700;color:#1F77F6">$${cac.toLocaleString('en', { maximumFractionDigits: 0 })}</div></div>
      <div style="${S.card};border-left:4px solid ${ltvCac >= 3 ? '#1F77F6' : '#2A222B'}"><div style="${S.label}">LTV / CAC</div><div style="font-size:1.25rem;font-weight:700;color:${ltvCac >= 3 ? '#1F77F6' : '#2A222B'}">${ltvCac.toFixed(1)}x</div></div>
      <div style="${S.card};border-left:4px solid ${greenPremium <= 20 ? '#1F77F6' : '#EF4444'}"><div style="${S.label}">Green Premium</div><div style="font-size:1.25rem;font-weight:700;color:${greenPremium <= 20 ? '#1F77F6' : '#EF4444'}">${greenPremium.toFixed(1)}%</div></div>
    </div>
    <div style="${S.sectionTitle}">Inputs</div>
    <div style="${S.grid2}">${Object.entries(UE_LABELS).map(([k, label]) => `<div style="${S.card}"><div style="${S.label}">${label}</div><div style="${S.value}">${v[k] || '—'}</div></div>`).join('')}</div>
  `
}

// ──────────── ERP Estimator ────────────
const ERP_LABELS: Record<string, string> = {
  techType: 'Tipo de tecnología',
  annualUnits: 'Unidades anuales',
  technologyEmissionFactor: 'Factor de emisión (tCO2/unidad)',
  deploymentGrowthRate: 'Tasa de crecimiento anual (%)',
  usefulLifeYears: 'Vida útil (años)',
  additionalityFactor: 'Factor de adicionalidad (%)',
}

function formatERP(data: Record<string, unknown>): string {
  const v = (data.values || data) as Record<string, string>
  const units = parseFloat(v.annualUnits) || 0
  const ef = parseFloat(v.technologyEmissionFactor) || 0
  const growth = (parseFloat(v.deploymentGrowthRate) || 0) / 100
  const life = parseFloat(v.usefulLifeYears) || 1
  const additionality = (parseFloat(v.additionalityFactor) || 100) / 100
  const annualReduction = units * ef * additionality
  let tenYear = 0
  for (let y = 0; y < 10; y++) tenYear += annualReduction * Math.pow(1 + growth, y) * life

  return `
    <div style="${S.grid2};margin-bottom:12px">
      <div style="${S.card};border-left:4px solid #1F77F6"><div style="${S.label}">Reducción anual</div><div style="font-size:1.25rem;font-weight:700;color:#1F77F6">${annualReduction.toLocaleString('en', { maximumFractionDigits: 0 })} tCO₂eq</div></div>
      <div style="${S.card};border-left:4px solid #DA4E24"><div style="${S.label}">Proyección 10 años</div><div style="font-size:1.25rem;font-weight:700;color:#DA4E24">${tenYear.toLocaleString('en', { maximumFractionDigits: 0 })} tCO₂eq</div></div>
    </div>
    <div style="${S.sectionTitle}">Parámetros</div>
    <div style="${S.grid2}">${Object.entries(ERP_LABELS).map(([k, label]) => `<div style="${S.card}"><div style="${S.label}">${label}</div><div style="${S.value}">${v[k] || '—'}</div></div>`).join('')}</div>
  `
}

// ──────────── Pilots Framework ────────────
const PILOT_SECTIONS: Array<{ title: string; fields: Array<{ id: string; label: string }> }> = [
  { title: 'Cliente Piloto', fields: [{ id: 'client_name', label: 'Nombre del cliente' }, { id: 'client_sector', label: 'Sector' }, { id: 'client_contact', label: 'Contacto' }, { id: 'client_motivation', label: 'Motivación' }] },
  { title: 'Alcance del Piloto', fields: [{ id: 'scope_objective', label: 'Objetivo' }, { id: 'scope_duration', label: 'Duración' }, { id: 'scope_location', label: 'Ubicación' }, { id: 'scope_resources', label: 'Recursos necesarios' }] },
  { title: 'KPIs', fields: [{ id: 'kpi_primary', label: 'KPI primario' }, { id: 'kpi_secondary', label: 'KPI secundario' }, { id: 'kpi_baseline', label: 'Línea base' }, { id: 'kpi_target', label: 'Meta' }] },
  { title: 'Propuesta Económica', fields: [{ id: 'econ_cost', label: 'Costo del piloto' }, { id: 'econ_pricing', label: 'Modelo de pricing' }, { id: 'econ_conversion', label: 'Ruta a contrato' }] },
  { title: 'Marco Legal', fields: [{ id: 'legal_nda', label: 'NDA' }, { id: 'legal_ip', label: 'Propiedad intelectual' }, { id: 'legal_liability', label: 'Responsabilidad' }, { id: 'legal_exit', label: 'Cláusula de salida' }] },
]

function formatPilots(data: Record<string, unknown>): string {
  const v = (data.values || data) as Record<string, string>
  return PILOT_SECTIONS.map(sec => {
    const filled = sec.fields.filter(f => v[f.id]?.trim())
    if (filled.length === 0) return ''
    return `<div style="${S.sectionTitle}">${sec.title}</div>${filled.map(f => S.field(f.label, v[f.id])).join('')}`
  }).filter(Boolean).join('')
}

// ──────────── Pitch Deck ────────────
const PITCH_SLIDES: Array<{ title: string; fields: Array<{ id: string; label: string }> }> = [
  { title: 'Portada', fields: [{ id: 's1_tagline', label: 'Tagline' }, { id: 's1_name_role', label: 'Nombre y rol' }] },
  { title: 'Problema', fields: [{ id: 's2_problem_stat', label: 'Estadística del problema' }, { id: 's2_problem_desc', label: 'Descripción' }] },
  { title: 'Solución', fields: [{ id: 's3_solution', label: 'Solución' }, { id: 's3_how_it_works', label: 'Cómo funciona' }] },
  { title: 'Mercado', fields: [{ id: 's4_tam', label: 'TAM' }, { id: 's4_sam', label: 'SAM' }, { id: 's4_som', label: 'SOM' }] },
  { title: 'Modelo de Negocio', fields: [{ id: 's5_revenue_model', label: 'Modelo de ingresos' }, { id: 's5_pricing', label: 'Pricing' }] },
  { title: 'Tracción', fields: [{ id: 's6_metrics', label: 'Métricas clave' }, { id: 's6_milestones', label: 'Hitos' }] },
  { title: 'Tecnología / IP', fields: [{ id: 's7_tech', label: 'Stack tecnológico' }, { id: 's7_ip', label: 'Propiedad intelectual' }] },
  { title: 'Impacto Climático', fields: [{ id: 's8_co2', label: 'Reducción CO₂' }, { id: 's8_sdgs', label: 'ODS relacionados' }] },
  { title: 'Competencia', fields: [{ id: 's9_competitors', label: 'Competidores' }, { id: 's9_diff', label: 'Diferenciación' }] },
  { title: 'Equipo', fields: [{ id: 's10_team', label: 'Equipo fundador' }, { id: 's10_advisors', label: 'Advisors' }] },
  { title: 'Financiamiento', fields: [{ id: 's11_ask', label: 'Monto solicitado' }, { id: 's11_use_of_funds', label: 'Uso de fondos' }] },
  { title: 'Cierre / CTA', fields: [{ id: 's12_vision', label: 'Visión' }, { id: 's12_contact', label: 'Contacto' }] },
]

function formatPitchDeck(data: Record<string, unknown>): string {
  const v = (data.values || data) as Record<string, string>
  return PITCH_SLIDES.map(slide => {
    const filled = slide.fields.filter(f => v[f.id]?.trim())
    if (filled.length === 0) return ''
    return `<div style="${S.sectionTitle}">${slide.title}</div>${filled.map(f => S.field(f.label, v[f.id])).join('')}`
  }).filter(Boolean).join('')
}

// ──────────── Cap Table ────────────
function formatCapTable(data: Record<string, unknown>): string {
  const v = (data.values || data) as Record<string, unknown>
  const founders = (v.founders || []) as Array<{ name: string; shares: string }>
  const rounds = (v.rounds || []) as Array<{ name: string; type: string; preMoneyValuation: string; amountRaised: string; investorName: string }>
  const optionPool = v.optionPool as string || '0'

  const totalShares = founders.reduce((s, f) => s + (parseFloat(f.shares) || 0), 0)

  let html = `<div style="${S.sectionTitle}">Fundadores</div>
    <table style="width:100%;border-collapse:collapse;font-size:0.8125rem">
      <thead><tr style="border-bottom:2px solid #E5E7EB">
        <th style="text-align:left;padding:8px;color:#6B7280">Nombre</th>
        <th style="text-align:right;padding:8px;color:#6B7280">Acciones</th>
        <th style="text-align:right;padding:8px;color:#6B7280">%</th>
      </tr></thead>
      <tbody>${founders.map(f => {
        const pct = totalShares > 0 ? ((parseFloat(f.shares) || 0) / totalShares * 100) : 0
        return `<tr style="border-bottom:1px solid #F3F4F6"><td style="padding:8px;color:#111827;font-weight:500">${f.name}</td><td style="padding:8px;text-align:right;color:#111827">${Number(f.shares || 0).toLocaleString()}</td><td style="padding:8px;text-align:right;font-weight:600;color:#DA4E24">${pct.toFixed(1)}%</td></tr>`
      }).join('')}</tbody>
    </table>`

  if (rounds.length > 0) {
    html += `<div style="${S.sectionTitle}">Rondas</div>
      <table style="width:100%;border-collapse:collapse;font-size:0.8125rem">
        <thead><tr style="border-bottom:2px solid #E5E7EB">
          <th style="text-align:left;padding:8px;color:#6B7280">Ronda</th>
          <th style="text-align:left;padding:8px;color:#6B7280">Tipo</th>
          <th style="text-align:right;padding:8px;color:#6B7280">Pre-money</th>
          <th style="text-align:right;padding:8px;color:#6B7280">Monto</th>
          <th style="text-align:left;padding:8px;color:#6B7280">Inversor</th>
        </tr></thead>
        <tbody>${rounds.map(r => `<tr style="border-bottom:1px solid #F3F4F6"><td style="padding:8px;color:#111827;font-weight:500">${r.name}</td><td style="padding:8px">${S.status(r.type)}</td><td style="padding:8px;text-align:right;color:#111827">$${Number(r.preMoneyValuation || 0).toLocaleString()}</td><td style="padding:8px;text-align:right;color:#1F77F6;font-weight:600">$${Number(r.amountRaised || 0).toLocaleString()}</td><td style="padding:8px;color:#374151">${r.investorName || '—'}</td></tr>`).join('')}</tbody>
      </table>`
  }

  html += `<div style="${S.card};margin-top:12px"><div style="${S.label}">Option Pool</div><div style="${S.value};font-weight:600">${optionPool}%</div></div>`
  return html
}

// ──────────── Capital Stack ────────────
const CAPITAL_TYPE_LABELS: Record<string, string> = {
  grant: 'Grant', equity: 'Equity', debt: 'Deuda', blended: 'Blended Finance', revenue: 'Revenue-based',
}

function formatCapitalStack(data: Record<string, unknown>): string {
  const v = (data.values || data) as Record<string, unknown>
  const items = (v.items || []) as Array<{ type: string; source: string; amount: string; stage: string; dilution: string; conditions: string; status: string }>
  if (items.length === 0) return '<p style="color:#9CA3AF;font-style:italic">Sin fuentes de capital registradas</p>'

  const total = items.reduce((s, i) => s + (parseFloat(i.amount) || 0), 0)
  return `
    <div style="${S.card};border-left:4px solid #1F77F6;margin-bottom:12px"><div style="${S.label}">Capital total mapeado</div><div style="font-size:1.25rem;font-weight:700;color:#1F77F6">$${total.toLocaleString()}</div></div>
    <table style="width:100%;border-collapse:collapse;font-size:0.8125rem">
      <thead><tr style="border-bottom:2px solid #E5E7EB">
        <th style="text-align:left;padding:8px;color:#6B7280">Fuente</th>
        <th style="text-align:left;padding:8px;color:#6B7280">Tipo</th>
        <th style="text-align:right;padding:8px;color:#6B7280">Monto</th>
        <th style="text-align:left;padding:8px;color:#6B7280">Etapa</th>
        <th style="text-align:left;padding:8px;color:#6B7280">Estado</th>
      </tr></thead>
      <tbody>${items.map(i => `<tr style="border-bottom:1px solid #F3F4F6"><td style="padding:8px;color:#111827;font-weight:500">${i.source}</td><td style="padding:8px;color:#6B7280">${CAPITAL_TYPE_LABELS[i.type] || i.type}</td><td style="padding:8px;text-align:right;color:#111827;font-weight:600">$${Number(i.amount || 0).toLocaleString()}</td><td style="padding:8px;color:#6B7280">${i.stage}</td><td style="padding:8px">${S.status(i.status)}</td></tr>`).join('')}</tbody>
    </table>
  `
}

// ──────────── Data Room ────────────
function formatDataRoom(data: Record<string, unknown>): string {
  const v = (data.values || data) as Record<string, unknown>
  const categories = (v.categories || []) as Array<{ label: string; docs: Array<{ label: string; status: string; priority: string }> }>
  return categories.map(cat => {
    const total = cat.docs.length
    const done = cat.docs.filter(d => d.status === 'done').length
    return `
      <div style="${S.sectionTitle}">${cat.label} <span style="font-size:0.75rem;color:#6B7280;font-weight:400">(${done}/${total})</span></div>
      ${cat.docs.map(d => `<div style="display:flex;align-items:center;gap:8px;padding:4px 0;font-size:0.8125rem">${S.status(d.status)}<span style="color:#111827">${d.label}</span><span style="font-size:0.6875rem;color:#9CA3AF;margin-left:auto">Prioridad: ${d.priority}</span></div>`).join('')}
    `
  }).join('')
}

// ──────────── Bankability ────────────
function formatBankability(data: Record<string, unknown>): string {
  const v = (data.values || data) as Record<string, unknown>
  const sections = (v.sections || []) as Array<{ title: string; items: Array<{ label: string; desc: string; weight: number; status: string; notes: string }> }>

  let totalWeight = 0, earnedWeight = 0
  sections.forEach(sec => sec.items.forEach(item => {
    totalWeight += item.weight
    if (item.status === 'done') earnedWeight += item.weight
    else if (item.status === 'partial') earnedWeight += item.weight * 0.5
  }))

  return `
    <div style="${S.card};border-left:4px solid ${earnedWeight / totalWeight >= 0.7 ? '#1F77F6' : '#2A222B'};margin-bottom:12px"><div style="${S.label}">Bankability Score</div><div style="font-size:1.5rem;font-weight:700;color:${earnedWeight / totalWeight >= 0.7 ? '#1F77F6' : '#2A222B'}">${earnedWeight.toFixed(0)}/${totalWeight} pts</div></div>
    ${sections.map(sec => {
      const secTotal = sec.items.reduce((s, i) => s + i.weight, 0)
      const secEarned = sec.items.reduce((s, i) => s + (i.status === 'done' ? i.weight : i.status === 'partial' ? i.weight * 0.5 : 0), 0)
      return `
        <div style="${S.sectionTitle}">${sec.title} <span style="font-size:0.75rem;color:#6B7280;font-weight:400">(${secEarned.toFixed(0)}/${secTotal} pts)</span></div>
        ${sec.items.map(item => `<div style="display:flex;align-items:center;gap:8px;padding:5px 0;font-size:0.8125rem">${S.status(item.status)}<span style="color:#111827">${item.label}</span><span style="font-size:0.6875rem;color:#9CA3AF;margin-left:auto">${item.weight} pts</span></div>`).join('')}
      `
    }).join('')}
  `
}

// ──────────── Reverse Due Diligence ────────────
const RDD_SECTIONS: Array<{ title: string; fields: Array<{ id: string; label: string }> }> = [
  { title: 'Equipo', fields: [{ id: 'q_t1', label: '¿Por qué son ustedes el equipo correcto?' }, { id: 'q_t2', label: '¿Qué experiencia técnica tienen?' }, { id: 'q_t3', label: '¿Cómo se complementan?' }] },
  { title: 'Tecnología', fields: [{ id: 'q_tech1', label: '¿Cuál es su IP o ventaja técnica?' }, { id: 'q_tech2', label: '¿En qué TRL están?' }, { id: 'q_tech3', label: '¿Cuáles son los riesgos técnicos principales?' }] },
  { title: 'Mercado', fields: [{ id: 'q_m1', label: '¿Cuál es el TAM/SAM/SOM?' }, { id: 'q_m2', label: '¿Quién es el early adopter?' }, { id: 'q_m3', label: '¿Cómo validan la demanda?' }] },
  { title: 'Financiero', fields: [{ id: 'q_f1', label: '¿Cuánto capital necesitan y para qué?' }, { id: 'q_f2', label: '¿Cuál es su runway actual?' }, { id: 'q_f3', label: '¿Cómo se ve su unit economics?' }] },
  { title: 'Impacto', fields: [{ id: 'q_i1', label: '¿Cuánto CO₂ evitan por unidad?' }, { id: 'q_i2', label: '¿Cómo miden impacto?' }, { id: 'q_i3', label: '¿Qué ODS abordan?' }] },
  { title: 'Riesgos', fields: [{ id: 'q_r1', label: '¿Cuáles son los 3 riesgos principales?' }, { id: 'q_r2', label: '¿Cómo los mitigan?' }, { id: 'q_r3', label: '¿Qué pasa si falla el piloto?' }] },
]

function formatReverseDD(data: Record<string, unknown>): string {
  const v = (data.values || data) as Record<string, string>
  return RDD_SECTIONS.map(sec => {
    const filled = sec.fields.filter(f => v[f.id]?.trim())
    if (filled.length === 0) return ''
    return `<div style="${S.sectionTitle}">${sec.title}</div>${filled.map(f => S.field(f.label, v[f.id])).join('')}`
  }).filter(Boolean).join('')
}

// ──────────── Registry ────────────
const FORMATTERS: Record<string, (data: Record<string, unknown>) => string> = {
  'trl-calculator': formatTRL,
  'lean-canvas': formatLeanCanvas,
  'lab-to-market': formatLabToMarket,
  'stakeholder-matrix': formatStakeholders,
  'founder-audit': formatFounderAudit,
  'business-models': formatBusinessModels,
  'unit-economics': formatUnitEconomics,
  'erp-estimator': formatERP,
  'pilots-framework': formatPilots,
  'pitch-deck': formatPitchDeck,
  'cap-table': formatCapTable,
  'capital-stack': formatCapitalStack,
  'data-room': formatDataRoom,
  'bankability': formatBankability,
  'reverse-dd': formatReverseDD,
}

export function formatToolData(toolId: string, data: Record<string, unknown>): string {
  const formatter = FORMATTERS[toolId]
  if (!formatter) {
    // Fallback: render key-value pairs
    const v = (data.values || data) as Record<string, unknown>
    return Object.entries(v)
      .filter(([, val]) => val !== null && val !== undefined && val !== '')
      .map(([key, val]) => S.field(key, typeof val === 'object' ? JSON.stringify(val, null, 2) : String(val)))
      .join('')
  }
  return formatter(data)
}
