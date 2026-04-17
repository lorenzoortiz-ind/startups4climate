/**
 * Centralized demo fixtures for admin_org demo user (Universidad BioInnova).
 * Used across /admin pages when isDemo === true && role === 'admin_org'.
 *
 * All numbers are illustrative for the MINPRO demo. Currency: PEN unless noted USD.
 */

export type CohortStatus = 'planned' | 'active' | 'completed'

export interface DemoStartup {
  id: string
  name: string
  vertical: string
  verticalLabel: string
  stage: 'pre_incubation' | 'incubation' | 'acceleration' | 'scaling'
  stageLabel: string
  founderName: string
  founderGender: 'F' | 'M'
  region: string
  readiness: number // 0-100
  diagnosticScore: number // 0-10
  toolsCompleted: number // out of 32
  mrr: number // USD
  tam: number // USD
  growthRate: number // % MoM
  fundingReceived: number // PEN
  cohortId: string
  status: 'on_track' | 'at_risk' | 'flag'
}

export interface DemoCohort {
  id: string
  name: string
  status: CohortStatus
  startDate: string
  endDate: string
  monthCurrent: number
  monthTotal: number
  startupIds: string[]
  description: string
  graduates: number
  toolsCompletionPct: number // 0-100
  retentionRate: number // 0-100
  npsFounders: number // -100 a 100
  fundingRaisedUSD: number
  milestones: { date: string; title: string; status: 'done' | 'pending' }[]
}

export interface DemoOpportunity {
  id: string
  title: string
  type: 'grant' | 'fund' | 'competition' | 'accelerator'
  amount: string
  deadline: string
  org: string
  vertical: string
  link: string
  status: 'open' | 'closing_soon' | 'new'
}

export interface DemoActor {
  id: string
  name: string
  category: 'incubator' | 'fund' | 'gov' | 'university' | 'corporate' | 'media' | 'event'
  region: string
  description: string
  link?: string
}

/* ─────────────────── KPIs ─────────────────── */
export const DEMO_ORG = {
  name: 'Universidad BioInnova',
  shortName: 'BioInnova',
  type: 'Universidad / Incubadora',
  region: 'Madre de Dios',
  contractStart: '2025-01-15',
  contractEnd: '2026-12-31',
  plan: 'Enterprise',
  maxStartups: 40,
  branding: '#0D9488',
  fundingRaisedUSD: 820_000,
  mrrAggregateUSD: 78_400,
  averageNps: 81,
  averageReadiness: 74,
  toolsCompletionRate: 68,
  retentionRate: 92,
  activeStartups: 24,
  graduatedStartups: 6,
  mentors: 12,
  programsActive: 3,
}

/* ─────────────────── 24 Startups ─────────────────── */
export const DEMO_STARTUPS: DemoStartup[] = [
  // Cohorte Otoño 2025 (12 active)
  { id: 'st-bi-01', name: 'AmazonBio Pack', vertical: 'biomateriales', verticalLabel: 'Biomateriales', stage: 'acceleration', stageLabel: 'Aceleración', founderName: 'Ana Quispe', founderGender: 'F', region: 'Madre de Dios', readiness: 87, diagnosticScore: 8.7, toolsCompleted: 28, mrr: 14200, tam: 2_400_000_000, growthRate: 22, fundingReceived: 180_000, cohortId: 'coh-bi-otono25', status: 'on_track' },
  { id: 'st-bi-02', name: 'KuntiPlant', vertical: 'agritech', verticalLabel: 'Agritech', stage: 'acceleration', stageLabel: 'Aceleración', founderName: 'Rosa Huamán', founderGender: 'F', region: 'Cusco', readiness: 84, diagnosticScore: 8.4, toolsCompleted: 26, mrr: 9800, tam: 1_100_000_000, growthRate: 18, fundingReceived: 145_000, cohortId: 'coh-bi-otono25', status: 'on_track' },
  { id: 'st-bi-03', name: 'EcoCacao Madre', vertical: 'agritech', verticalLabel: 'Agritech', stage: 'incubation', stageLabel: 'Incubación', founderName: 'Luis Torres', founderGender: 'M', region: 'Madre de Dios', readiness: 76, diagnosticScore: 7.6, toolsCompleted: 22, mrr: 6400, tam: 580_000_000, growthRate: 14, fundingReceived: 95_000, cohortId: 'coh-bi-otono25', status: 'on_track' },
  { id: 'st-bi-04', name: 'AyaHealth', vertical: 'healthtech', verticalLabel: 'Healthtech', stage: 'incubation', stageLabel: 'Incubación', founderName: 'María Fernández', founderGender: 'F', region: 'Lima', readiness: 79, diagnosticScore: 7.9, toolsCompleted: 24, mrr: 7200, tam: 920_000_000, growthRate: 16, fundingReceived: 110_000, cohortId: 'coh-bi-otono25', status: 'on_track' },
  { id: 'st-bi-05', name: 'BioFármaco Andes', vertical: 'healthtech', verticalLabel: 'Healthtech', stage: 'incubation', stageLabel: 'Incubación', founderName: 'Pedro Solano', founderGender: 'M', region: 'Cusco', readiness: 72, diagnosticScore: 7.2, toolsCompleted: 20, mrr: 4100, tam: 720_000_000, growthRate: 11, fundingReceived: 80_000, cohortId: 'coh-bi-otono25', status: 'at_risk' },
  { id: 'st-bi-06', name: 'SolarSelva', vertical: 'energia', verticalLabel: 'Energía', stage: 'incubation', stageLabel: 'Incubación', founderName: 'Carlos Mendoza', founderGender: 'M', region: 'Madre de Dios', readiness: 74, diagnosticScore: 7.4, toolsCompleted: 21, mrr: 5300, tam: 1_400_000_000, growthRate: 13, fundingReceived: 90_000, cohortId: 'coh-bi-otono25', status: 'on_track' },
  { id: 'st-bi-07', name: 'YakuTech', vertical: 'biomateriales', verticalLabel: 'Biomateriales', stage: 'incubation', stageLabel: 'Incubación', founderName: 'Lucía Vargas', founderGender: 'F', region: 'Loreto', readiness: 70, diagnosticScore: 7.0, toolsCompleted: 19, mrr: 3800, tam: 540_000_000, growthRate: 9, fundingReceived: 70_000, cohortId: 'coh-bi-otono25', status: 'at_risk' },
  { id: 'st-bi-08', name: 'AgroSmart Andes', vertical: 'agritech', verticalLabel: 'Agritech', stage: 'incubation', stageLabel: 'Incubación', founderName: 'Felipe Castro', founderGender: 'M', region: 'Arequipa', readiness: 68, diagnosticScore: 6.8, toolsCompleted: 18, mrr: 3200, tam: 480_000_000, growthRate: 10, fundingReceived: 55_000, cohortId: 'coh-bi-otono25', status: 'on_track' },
  { id: 'st-bi-09', name: 'PetroVerde', vertical: 'energia', verticalLabel: 'Energía', stage: 'pre_incubation', stageLabel: 'Pre-incubación', founderName: 'Diana Salas', founderGender: 'F', region: 'Madre de Dios', readiness: 58, diagnosticScore: 5.8, toolsCompleted: 12, mrr: 0, tam: 380_000_000, growthRate: 0, fundingReceived: 25_000, cohortId: 'coh-bi-otono25', status: 'on_track' },
  { id: 'st-bi-10', name: 'MercadoBio', vertical: 'otros', verticalLabel: 'Otros', stage: 'pre_incubation', stageLabel: 'Pre-incubación', founderName: 'Renato Aliaga', founderGender: 'M', region: 'Lima', readiness: 54, diagnosticScore: 5.4, toolsCompleted: 10, mrr: 0, tam: 220_000_000, growthRate: 0, fundingReceived: 18_000, cohortId: 'coh-bi-otono25', status: 'flag' },
  { id: 'st-bi-11', name: 'BiomarBio', vertical: 'biomateriales', verticalLabel: 'Biomateriales', stage: 'incubation', stageLabel: 'Incubación', founderName: 'Sofía Tello', founderGender: 'F', region: 'Piura', readiness: 73, diagnosticScore: 7.3, toolsCompleted: 22, mrr: 4600, tam: 510_000_000, growthRate: 12, fundingReceived: 60_000, cohortId: 'coh-bi-otono25', status: 'on_track' },
  { id: 'st-bi-12', name: 'CleanRibera', vertical: 'energia', verticalLabel: 'Energía', stage: 'pre_incubation', stageLabel: 'Pre-incubación', founderName: 'Ricardo Núñez', founderGender: 'M', region: 'La Libertad', readiness: 55, diagnosticScore: 5.5, toolsCompleted: 11, mrr: 0, tam: 290_000_000, growthRate: 0, fundingReceived: 22_000, cohortId: 'coh-bi-otono25', status: 'on_track' },

  // Cohorte Verano 2025 (8, completed, 6 graduated)
  { id: 'st-bi-13', name: 'TerraReciclo', vertical: 'biomateriales', verticalLabel: 'Biomateriales', stage: 'scaling', stageLabel: 'Escalamiento', founderName: 'Camila Rojas', founderGender: 'F', region: 'Lima', readiness: 91, diagnosticScore: 9.1, toolsCompleted: 31, mrr: 22000, tam: 1_800_000_000, growthRate: 24, fundingReceived: 220_000, cohortId: 'coh-bi-verano25', status: 'on_track' },
  { id: 'st-bi-14', name: 'BioPak Andina', vertical: 'biomateriales', verticalLabel: 'Biomateriales', stage: 'scaling', stageLabel: 'Escalamiento', founderName: 'José Salinas', founderGender: 'M', region: 'Arequipa', readiness: 89, diagnosticScore: 8.9, toolsCompleted: 30, mrr: 18500, tam: 1_500_000_000, growthRate: 21, fundingReceived: 195_000, cohortId: 'coh-bi-verano25', status: 'on_track' },
  { id: 'st-bi-15', name: 'AgroSinergia', vertical: 'agritech', verticalLabel: 'Agritech', stage: 'acceleration', stageLabel: 'Aceleración', founderName: 'Fernanda Loayza', founderGender: 'F', region: 'Cusco', readiness: 82, diagnosticScore: 8.2, toolsCompleted: 26, mrr: 11200, tam: 670_000_000, growthRate: 17, fundingReceived: 155_000, cohortId: 'coh-bi-verano25', status: 'on_track' },
  { id: 'st-bi-16', name: 'MediBosque', vertical: 'healthtech', verticalLabel: 'Healthtech', stage: 'acceleration', stageLabel: 'Aceleración', founderName: 'Hugo Ramos', founderGender: 'M', region: 'Madre de Dios', readiness: 80, diagnosticScore: 8.0, toolsCompleted: 25, mrr: 9400, tam: 540_000_000, growthRate: 16, fundingReceived: 130_000, cohortId: 'coh-bi-verano25', status: 'on_track' },
  { id: 'st-bi-17', name: 'NutriQuinua', vertical: 'agritech', verticalLabel: 'Agritech', stage: 'acceleration', stageLabel: 'Aceleración', founderName: 'Patricia Yupanqui', founderGender: 'F', region: 'Puno', readiness: 78, diagnosticScore: 7.8, toolsCompleted: 24, mrr: 8200, tam: 460_000_000, growthRate: 15, fundingReceived: 120_000, cohortId: 'coh-bi-verano25', status: 'on_track' },
  { id: 'st-bi-18', name: 'EnerPampa', vertical: 'energia', verticalLabel: 'Energía', stage: 'acceleration', stageLabel: 'Aceleración', founderName: 'Manuel Ortega', founderGender: 'M', region: 'Arequipa', readiness: 77, diagnosticScore: 7.7, toolsCompleted: 23, mrr: 7600, tam: 690_000_000, growthRate: 14, fundingReceived: 105_000, cohortId: 'coh-bi-verano25', status: 'on_track' },
  { id: 'st-bi-19', name: 'AquaPure Selva', vertical: 'otros', verticalLabel: 'Otros', stage: 'incubation', stageLabel: 'Incubación', founderName: 'Daniela Pinto', founderGender: 'F', region: 'Loreto', readiness: 64, diagnosticScore: 6.4, toolsCompleted: 16, mrr: 2400, tam: 310_000_000, growthRate: 7, fundingReceived: 45_000, cohortId: 'coh-bi-verano25', status: 'at_risk' },
  { id: 'st-bi-20', name: 'BiomedKids', vertical: 'healthtech', verticalLabel: 'Healthtech', stage: 'incubation', stageLabel: 'Incubación', founderName: 'Andrés Choque', founderGender: 'M', region: 'Lima', readiness: 66, diagnosticScore: 6.6, toolsCompleted: 17, mrr: 3100, tam: 420_000_000, growthRate: 9, fundingReceived: 50_000, cohortId: 'coh-bi-verano25', status: 'on_track' },

  // Cohorte Primavera 2026 (4 + 2 in pre-stage)
  { id: 'st-bi-21', name: 'GreenChain', vertical: 'otros', verticalLabel: 'Otros', stage: 'pre_incubation', stageLabel: 'Pre-incubación', founderName: 'Valeria Espinoza', founderGender: 'F', region: 'Madre de Dios', readiness: 48, diagnosticScore: 4.8, toolsCompleted: 8, mrr: 0, tam: 180_000_000, growthRate: 0, fundingReceived: 12_000, cohortId: 'coh-bi-primavera26', status: 'on_track' },
  { id: 'st-bi-22', name: 'BioFiber Lab', vertical: 'biomateriales', verticalLabel: 'Biomateriales', stage: 'pre_incubation', stageLabel: 'Pre-incubación', founderName: 'Esteban Rivera', founderGender: 'M', region: 'Madre de Dios', readiness: 52, diagnosticScore: 5.2, toolsCompleted: 9, mrr: 0, tam: 240_000_000, growthRate: 0, fundingReceived: 15_000, cohortId: 'coh-bi-primavera26', status: 'on_track' },
  { id: 'st-bi-23', name: 'AndinaFood', vertical: 'agritech', verticalLabel: 'Agritech', stage: 'pre_incubation', stageLabel: 'Pre-incubación', founderName: 'Mónica Barrios', founderGender: 'F', region: 'Cusco', readiness: 51, diagnosticScore: 5.1, toolsCompleted: 9, mrr: 0, tam: 210_000_000, growthRate: 0, fundingReceived: 14_000, cohortId: 'coh-bi-primavera26', status: 'on_track' },
  { id: 'st-bi-24', name: 'SolMakers', vertical: 'energia', verticalLabel: 'Energía', stage: 'pre_incubation', stageLabel: 'Pre-incubación', founderName: 'Iván Pacheco', founderGender: 'M', region: 'Madre de Dios', readiness: 49, diagnosticScore: 4.9, toolsCompleted: 8, mrr: 0, tam: 160_000_000, growthRate: 0, fundingReceived: 11_000, cohortId: 'coh-bi-primavera26', status: 'on_track' },
]

/* ─────────────────── Cohorts ─────────────────── */
export const DEMO_COHORTS: DemoCohort[] = [
  {
    id: 'coh-bi-verano25',
    name: 'BioInnova Verano 2025',
    status: 'completed',
    startDate: '2025-06-01',
    endDate: '2025-08-31',
    monthCurrent: 3,
    monthTotal: 3,
    startupIds: DEMO_STARTUPS.filter((s) => s.cohortId === 'coh-bi-verano25').map((s) => s.id),
    description: 'Cohorte piloto del programa BioInnova. 8 startups admitidas, 6 graduadas con tracción comercial validada.',
    graduates: 6,
    toolsCompletionPct: 84,
    retentionRate: 100,
    npsFounders: 78,
    fundingRaisedUSD: 320_000,
    milestones: [
      { date: '2025-06-15', title: 'Bootcamp inicial · 8 startups onboarded', status: 'done' },
      { date: '2025-07-01', title: 'Diagnóstico de readiness aplicado', status: 'done' },
      { date: '2025-07-30', title: 'Demo Day intermedio con 4 mentores externos', status: 'done' },
      { date: '2025-08-20', title: 'Pitch Day final con jurado de Innóvate Perú', status: 'done' },
      { date: '2025-08-31', title: 'Cierre + reporte ejecutivo a MINPRO', status: 'done' },
    ],
  },
  {
    id: 'coh-bi-otono25',
    name: 'BioInnova Otoño 2025',
    status: 'active',
    startDate: '2025-09-15',
    endDate: '2026-04-15',
    monthCurrent: 4,
    monthTotal: 6,
    startupIds: DEMO_STARTUPS.filter((s) => s.cohortId === 'coh-bi-otono25').map((s) => s.id),
    description: 'Cohorte ampliada con 12 startups de biomateriales, agritech, healthtech y energía. Mes 4 de 6.',
    graduates: 0,
    toolsCompletionPct: 71,
    retentionRate: 92,
    npsFounders: 74,
    fundingRaisedUSD: 410_000,
    milestones: [
      { date: '2025-09-20', title: 'Onboarding · 12 startups admitidas', status: 'done' },
      { date: '2025-10-15', title: 'Workshop biomateriales (UNAMAD)', status: 'done' },
      { date: '2025-12-10', title: 'Demo Day intermedio', status: 'done' },
      { date: '2026-02-20', title: 'Vinculación con inversionistas (3 fondos)', status: 'done' },
      { date: '2026-04-01', title: 'Pitch final con jurado de fondos LATAM', status: 'pending' },
      { date: '2026-04-15', title: 'Cierre cohorte', status: 'pending' },
    ],
  },
  {
    id: 'coh-bi-primavera26',
    name: 'BioInnova Primavera 2026',
    status: 'active',
    startDate: '2026-03-01',
    endDate: '2026-08-30',
    monthCurrent: 2,
    monthTotal: 6,
    startupIds: DEMO_STARTUPS.filter((s) => s.cohortId === 'coh-bi-primavera26').map((s) => s.id),
    description: 'Cohorte enfocada en early-stage. 6 founders en pre-incubación, foco en validación de hipótesis.',
    graduates: 0,
    toolsCompletionPct: 38,
    retentionRate: 100,
    npsFounders: 68,
    fundingRaisedUSD: 90_000,
    milestones: [
      { date: '2026-03-05', title: 'Bootcamp inicial', status: 'done' },
      { date: '2026-03-25', title: 'Diagnóstico de readiness aplicado', status: 'done' },
      { date: '2026-05-15', title: 'Workshop validación de mercado', status: 'pending' },
      { date: '2026-07-01', title: 'Demo Day intermedio', status: 'pending' },
      { date: '2026-08-30', title: 'Cierre y graduación', status: 'pending' },
    ],
  },
]

/* ─────────────────── Vertical breakdown ─────────────────── */
export const DEMO_VERTICAL_DISTRIBUTION = [
  { key: 'biomateriales', label: 'Biomateriales', count: 8, color: '#0D9488' },
  { key: 'agritech', label: 'Agritech', count: 6, color: '#16A34A' },
  { key: 'healthtech', label: 'Healthtech', count: 4, color: '#3B82F6' },
  { key: 'energia', label: 'Energía', count: 3, color: '#F59E0B' },
  { key: 'otros', label: 'Otros', count: 3, color: '#94A3B8' },
]

/* ─────────────────── Stage breakdown ─────────────────── */
export const DEMO_STAGE_DISTRIBUTION = [
  { key: 'pre_incubation', label: 'Pre-incubación', count: 8, color: '#94A3B8' },
  { key: 'incubation', label: 'Incubación', count: 10, color: '#3B82F6' },
  { key: 'acceleration', label: 'Aceleración', count: 4, color: '#0D9488' },
  { key: 'scaling', label: 'Escalamiento', count: 2, color: '#FF6B4A' },
]

/* ─────────────────── Reportes mock ─────────────────── */
export const DEMO_ADMIN_REPORTS = [
  {
    id: 'rep-perf-general',
    title: 'Performance General · Q1 2026',
    subtitle: 'Resumen consolidado de las 24 startups activas',
    metrics: [
      { label: 'Score readiness avg', value: '7.3 / 10' },
      { label: 'Tools completion rate', value: '73%' },
      { label: 'NPS promedio', value: '81' },
      { label: 'MRR consolidado', value: 'USD 142,400' },
    ],
    rows: 24,
    sheets: 5,
    lastGenerated: '2026-04-12',
  },
  {
    id: 'rep-vertical',
    title: 'Diagnóstico por Vertical',
    subtitle: 'Comparativo de readiness y MRR por sector',
    metrics: [
      { label: 'Vertical top', value: 'Biomateriales (8.4)' },
      { label: 'Vertical en alerta', value: 'Otros (5.7)' },
      { label: 'Mayor crecimiento', value: 'Agritech (+18% MoM)' },
      { label: 'Mayor funding levantado', value: 'Biomateriales (USD 215K)' },
    ],
    rows: 5,
    sheets: 4,
    lastGenerated: '2026-04-10',
  },
  {
    id: 'rep-engagement',
    title: 'Engagement de founders · 2026',
    subtitle: 'Adopción de herramientas y retención por cohorte',
    metrics: [
      { label: 'Tools completion rate', value: '68%' },
      { label: 'Retención founders', value: '92%' },
      { label: 'Sesiones AI mentor / mes', value: '412' },
      { label: 'Founders activos 30d', value: '21 / 24' },
    ],
    rows: 18,
    sheets: 3,
    lastGenerated: '2026-04-14',
  },
  {
    id: 'rep-esg',
    title: 'Impacto ESG · 2025-2026',
    subtitle: 'Métricas de impacto consolidadas',
    metrics: [
      { label: 'Empleos generados', value: '147' },
      { label: 'CO₂ evitado (tCO₂eq)', value: '892' },
      { label: '% mujeres founders', value: '46%' },
      { label: 'Founders rurales', value: '38%' },
    ],
    rows: 32,
    sheets: 6,
    lastGenerated: '2026-04-08',
  },
]

/* ─────────────────── Oportunidades curadas (12) ─────────────────── */
export const DEMO_OPPORTUNITIES: DemoOpportunity[] = [
  { id: 'op-01', title: 'ProInnóvate · Capital Semilla 2026', type: 'grant', amount: 'Hasta S/ 200,000', deadline: '2026-05-30', org: 'ProInnóvate (MINPRO)', vertical: 'Multisector', link: 'https://proinnovate.gob.pe', status: 'open' },
  { id: 'op-02', title: 'Concytec · Investigación Aplicada', type: 'grant', amount: 'Hasta S/ 350,000', deadline: '2026-06-15', org: 'CONCYTEC', vertical: 'Biotech, Healthtech', link: 'https://concytec.gob.pe', status: 'open' },
  { id: 'op-03', title: 'BID Lab · Climate Tech LATAM', type: 'fund', amount: 'USD 50K - 250K', deadline: '2026-05-10', org: 'BID Lab', vertical: 'Climate Tech', link: 'https://bidlab.org', status: 'closing_soon' },
  { id: 'op-04', title: 'Hivos · Mujeres en Innovación', type: 'grant', amount: 'EUR 15,000', deadline: '2026-04-30', org: 'Hivos', vertical: 'Multisector (mujeres)', link: 'https://hivos.org', status: 'closing_soon' },
  { id: 'op-05', title: 'Endeavor · Programa de Aceleración', type: 'accelerator', amount: 'Mentoría + red', deadline: '2026-07-01', org: 'Endeavor Perú', vertical: 'Multisector', link: 'https://endeavor.org.pe', status: 'open' },
  { id: 'op-06', title: 'Innóvate Perú · Reto Bioeconomía', type: 'competition', amount: 'S/ 500,000 al ganador', deadline: '2026-06-20', org: 'Innóvate Perú', vertical: 'Bioeconomía', link: 'https://innovateperu.gob.pe', status: 'new' },
  { id: 'op-07', title: 'IDB Invest · Climate Solutions', type: 'fund', amount: 'USD 100K - 1M', deadline: '2026-08-01', org: 'IDB Invest', vertical: 'Climate, Energy', link: 'https://idbinvest.org', status: 'open' },
  { id: 'op-08', title: 'Kunan · Premio Emprendimiento Social', type: 'competition', amount: 'S/ 80,000', deadline: '2026-05-25', org: 'Kunan / BCP', vertical: 'Impacto social', link: 'https://kunan.com.pe', status: 'closing_soon' },
  { id: 'op-09', title: 'GIZ · Aceleración Verde', type: 'accelerator', amount: 'EUR 50,000 + mentoría', deadline: '2026-07-15', org: 'GIZ Perú', vertical: 'Cleantech, Climate', link: 'https://giz.de', status: 'open' },
  { id: 'op-10', title: 'BBVA Open Talent', type: 'competition', amount: 'EUR 50,000', deadline: '2026-06-10', org: 'BBVA', vertical: 'Fintech, Sustainability', link: 'https://bbvaopentalent.com', status: 'open' },
  { id: 'op-11', title: 'Climate-KIC LATAM Fellowship', type: 'accelerator', amount: 'EUR 25,000', deadline: '2026-06-30', org: 'EIT Climate-KIC', vertical: 'Climate Tech', link: 'https://climate-kic.org', status: 'new' },
  { id: 'op-12', title: 'PNUD · Acelerador ODS', type: 'grant', amount: 'USD 30,000', deadline: '2026-07-20', org: 'PNUD Perú', vertical: 'ODS, Impacto', link: 'https://undp.org', status: 'open' },
]

/* ─────────────────── RADAR · 35 actores ─────────────────── */
export const DEMO_ECOSYSTEM_ACTORS: DemoActor[] = [
  // Incubadoras / Universidades (10)
  { id: 'a-01', name: 'UTEC Ventures', category: 'incubator', region: 'Lima', description: 'Incubadora de la UTEC, foco en deep tech y climate.' },
  { id: 'a-02', name: 'Emprende UP', category: 'incubator', region: 'Lima', description: 'Incubadora de la Universidad del Pacífico.' },
  { id: 'a-03', name: '1551 Innova UNMSM', category: 'incubator', region: 'Lima', description: 'Incubadora de la Universidad Nacional Mayor de San Marcos.' },
  { id: 'a-04', name: 'BioInnova UNAMAD', category: 'university', region: 'Madre de Dios', description: 'Hub de biotech amazónica.' },
  { id: 'a-05', name: 'Hub UDEP', category: 'incubator', region: 'Piura', description: 'Centro de emprendimiento Universidad de Piura.' },
  { id: 'a-06', name: 'Innóvate Cusco', category: 'incubator', region: 'Cusco', description: 'Programa regional de innovación.' },
  { id: 'a-07', name: 'Universidad Wiener', category: 'university', region: 'Lima', description: 'Programa de healthtech y bienestar.' },
  { id: 'a-08', name: 'CIDE-PUCP', category: 'incubator', region: 'Lima', description: 'Centro de innovación PUCP.' },
  { id: 'a-09', name: 'Startup UNI', category: 'incubator', region: 'Lima', description: 'Incubadora de la Universidad Nacional de Ingeniería.' },
  { id: 'a-10', name: 'AceleraGap', category: 'incubator', region: 'Lima', description: 'Aceleradora privada de impacto.' },
  // Fondos (8)
  { id: 'a-11', name: 'Salkantay Ventures', category: 'fund', region: 'Lima', description: 'Fondo VC LATAM, etapas seed-A.' },
  { id: 'a-12', name: 'Winnipeg Capital', category: 'fund', region: 'Lima', description: 'Fondo de impacto sostenible.' },
  { id: 'a-13', name: 'BID Lab', category: 'fund', region: 'Lima', description: 'Brazo de innovación del BID.' },
  { id: 'a-14', name: 'IDB Invest', category: 'fund', region: 'Lima', description: 'Inversión en infraestructura sostenible.' },
  { id: 'a-15', name: 'Kandeo Fund', category: 'fund', region: 'Lima', description: 'Fondo regional LatAm.' },
  { id: 'a-16', name: 'Acumen LatAm', category: 'fund', region: 'Lima', description: 'Capital paciente de impacto.' },
  { id: 'a-17', name: 'KAYA Impacto', category: 'fund', region: 'Lima', description: 'Inversión en startups peruanas.' },
  { id: 'a-18', name: 'Angel Ventures', category: 'fund', region: 'Lima', description: 'Red de inversionistas ángel.' },
  // Gobierno (5)
  { id: 'a-19', name: 'ProInnóvate', category: 'gov', region: 'Lima', description: 'Programa de innovación del MINPRO.' },
  { id: 'a-20', name: 'Innóvate Perú', category: 'gov', region: 'Lima', description: 'Fondo concursable de innovación.' },
  { id: 'a-21', name: 'CONCYTEC', category: 'gov', region: 'Lima', description: 'Consejo Nacional de Ciencia y Tecnología.' },
  { id: 'a-22', name: 'StartUp Perú', category: 'gov', region: 'Lima', description: 'Programa nacional de emprendimiento.' },
  { id: 'a-23', name: 'MINAM Verde', category: 'gov', region: 'Lima', description: 'Programa de economía circular del MINAM.' },
  // Corporates (6)
  { id: 'a-24', name: 'BCP Innovación', category: 'corporate', region: 'Lima', description: 'Programa de innovación abierta del BCP.' },
  { id: 'a-25', name: 'Backus Open Innovation', category: 'corporate', region: 'Lima', description: 'Innovación abierta de AB InBev.' },
  { id: 'a-26', name: 'BBVA Open Talent', category: 'corporate', region: 'Lima', description: 'Competencia global de fintech.' },
  { id: 'a-27', name: 'Alicorp Ventures', category: 'corporate', region: 'Lima', description: 'CVC del grupo Romero.' },
  { id: 'a-28', name: 'Falabella Lab', category: 'corporate', region: 'Lima', description: 'Hub de retail tech.' },
  { id: 'a-29', name: 'Telefónica Open Future', category: 'corporate', region: 'Lima', description: 'Hub de telco e IoT.' },
  // Eventos / Media (6)
  { id: 'a-30', name: 'PerúVenture', category: 'event', region: 'Lima', description: 'Conferencia anual VC.' },
  { id: 'a-31', name: 'Climate Week LATAM', category: 'event', region: 'Lima', description: 'Encuentro de startups climate.' },
  { id: 'a-32', name: 'Andina Tech Summit', category: 'event', region: 'Cusco', description: 'Cumbre regional de tecnología.' },
  { id: 'a-33', name: 'Stakeholders.com.pe', category: 'media', region: 'Lima', description: 'Medio especializado en sostenibilidad.' },
  { id: 'a-34', name: 'Forbes Perú', category: 'media', region: 'Lima', description: 'Cobertura empresarial e innovación.' },
  { id: 'a-35', name: 'InfoStartups', category: 'media', region: 'Lima', description: 'Comunidad y newsletter para founders.' },
]

/* ─────────────────── Helpers ─────────────────── */
export function topStartupsByReadiness(n: number = 5): DemoStartup[] {
  return [...DEMO_STARTUPS].sort((a, b) => b.readiness - a.readiness).slice(0, n)
}

export function startupsByCohort(cohortId: string): DemoStartup[] {
  return DEMO_STARTUPS.filter((s) => s.cohortId === cohortId)
}

export function getCohortById(id: string): DemoCohort | undefined {
  return DEMO_COHORTS.find((c) => c.id === id)
}
