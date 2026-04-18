/**
 * Superadmin (MINPRO) demo fixtures: programas de innovación
 * acompañados por el Ministerio de la Producción del Perú.
 *
 * Cifras alineadas con escala real de Innóvate Perú / ProInnóvate.
 * KPIs orientados a impacto de plataforma (no ejecución presupuestal).
 */

export type ProgramStatus = 'active' | 'completed' | 'planned' | 'at_risk'

export interface DemoProgram {
  id: string
  name: string
  executingOrg: string
  region: string
  vertical: string
  startDate: string
  endDate: string
  startupsCount: number
  cohortsCount: number
  readinessAvg: number // 0-100
  nps: number
  completionRate: number // 0-100
  toolsCompletionPct: number // 0-100
  retentionRate: number // 0-100
  fundingRaisedUSD: number
  mrrAggregateUSD: number
  status: ProgramStatus
  description: string
  // Impact metrics
  jobsGenerated: number
  co2Avoided: number // tCO2eq
  womenFoundersPct: number
  ruralFoundersPct: number
  // Milestones
  milestones: { date: string; title: string; status: 'done' | 'pending' }[]
  // Beneficiary startups (sample)
  beneficiaries: { name: string; vertical: string; readiness: number; mrrUSD: number }[]
}

export interface DemoExecutorOrg {
  id: string
  name: string
  region: string
  type: 'university' | 'incubator' | 'accelerator' | 'hub'
  cohortsCount: number
  startupsCount: number
  readinessAvg: number
  toolsCompletionPct: number
  programIds: string[]
}

/* ─────────────────── 8 Programas ─────────────────── */
export const DEMO_PROGRAMS: DemoProgram[] = [
  {
    id: 'prog-bioinnova-mdd',
    name: 'BioInnova Madre de Dios',
    executingOrg: 'BioInnova UNAMAD',
    region: 'Madre de Dios',
    vertical: 'Biotech amazónica',
    startDate: '2025-01-15',
    endDate: '2026-12-31',
    startupsCount: 38,
    cohortsCount: 3,
    readinessAvg: 74,
    nps: 81,
    completionRate: 73,
    toolsCompletionPct: 68,
    retentionRate: 92,
    fundingRaisedUSD: 820_000,
    mrrAggregateUSD: 78_400,
    status: 'active',
    description: 'Programa estrella de biotech amazónica. 3 cohortes desplegadas, 6 startups graduadas con tracción internacional. Foco en biomateriales, biofármacos y agritech amazónica.',
    jobsGenerated: 312,
    co2Avoided: 3_180,
    womenFoundersPct: 46,
    ruralFoundersPct: 38,
    milestones: [
      { date: '2025-03-01', title: 'Cohorte Verano 2025 lanzada (8 startups)', status: 'done' },
      { date: '2025-08-31', title: 'Cohorte Verano cerrada · 6 graduadas', status: 'done' },
      { date: '2025-09-15', title: 'Cohorte Otoño 2025 lanzada (12 startups)', status: 'done' },
      { date: '2026-03-01', title: 'Cohorte Primavera 2026 lanzada (6 startups)', status: 'done' },
      { date: '2026-04-15', title: 'Cierre Cohorte Otoño + Demo Day', status: 'pending' },
      { date: '2026-08-30', title: 'Cierre Cohorte Primavera', status: 'pending' },
      { date: '2026-12-31', title: 'Cierre programa + reporte final MINPRO', status: 'pending' },
    ],
    beneficiaries: [
      { name: 'TerraReciclo', vertical: 'Biomateriales', readiness: 91, mrrUSD: 22_000 },
      { name: 'BioPak Andina', vertical: 'Biomateriales', readiness: 89, mrrUSD: 18_500 },
      { name: 'AmazonBio Pack', vertical: 'Biomateriales', readiness: 87, mrrUSD: 14_200 },
      { name: 'KuntiPlant', vertical: 'Agritech', readiness: 84, mrrUSD: 9_800 },
      { name: 'AgroSinergia', vertical: 'Agritech', readiness: 82, mrrUSD: 11_200 },
    ],
  },
  {
    id: 'prog-wiener-health',
    name: 'Wiener Health Innovators',
    executingOrg: 'Universidad Wiener',
    region: 'Lima',
    vertical: 'Healthtech',
    startDate: '2025-04-01',
    endDate: '2027-03-31',
    startupsCount: 42,
    cohortsCount: 2,
    readinessAvg: 71,
    nps: 76,
    completionRate: 71,
    toolsCompletionPct: 62,
    retentionRate: 88,
    fundingRaisedUSD: 540_000,
    mrrAggregateUSD: 56_200,
    status: 'active',
    description: 'Programa de healthtech con foco en bienestar, telemedicina y dispositivos médicos accesibles para zonas peri-urbanas.',
    jobsGenerated: 218,
    co2Avoided: 410,
    womenFoundersPct: 54,
    ruralFoundersPct: 22,
    milestones: [
      { date: '2025-04-15', title: 'Cohorte 1 lanzada (14 startups)', status: 'done' },
      { date: '2025-12-15', title: 'Cohorte 1 cerrada · 9 graduadas', status: 'done' },
      { date: '2026-02-01', title: 'Cohorte 2 lanzada (14 startups)', status: 'done' },
      { date: '2026-09-15', title: 'Demo Day intermedio', status: 'pending' },
      { date: '2027-01-30', title: 'Cohorte 2 cierre', status: 'pending' },
    ],
    beneficiaries: [
      { name: 'AyaHealth', vertical: 'Healthtech', readiness: 84, mrrUSD: 7_200 },
      { name: 'TeleMed Andina', vertical: 'Healthtech', readiness: 81, mrrUSD: 5_900 },
      { name: 'BienestarKids', vertical: 'Healthtech', readiness: 78, mrrUSD: 5_200 },
      { name: 'MediBosque', vertical: 'Healthtech', readiness: 80, mrrUSD: 9_400 },
    ],
  },
  {
    id: 'prog-unamad-agri',
    name: 'UNAMAD AgriTech Amazónico',
    executingOrg: 'UNAMAD',
    region: 'Madre de Dios',
    vertical: 'Agritech',
    startDate: '2025-02-01',
    endDate: '2026-08-31',
    startupsCount: 26,
    cohortsCount: 2,
    readinessAvg: 67,
    nps: 74,
    completionRate: 68,
    toolsCompletionPct: 55,
    retentionRate: 85,
    fundingRaisedUSD: 320_000,
    mrrAggregateUSD: 38_600,
    status: 'active',
    description: 'Aceleración de agritech con cooperativas amazónicas. Foco en cacao, castaña, copoazú y café especial.',
    jobsGenerated: 162,
    co2Avoided: 1_240,
    womenFoundersPct: 39,
    ruralFoundersPct: 67,
    milestones: [
      { date: '2025-02-20', title: 'Cohorte 1 (10 startups)', status: 'done' },
      { date: '2025-08-30', title: 'Cohorte 1 cerrada', status: 'done' },
      { date: '2025-10-01', title: 'Cohorte 2 (8 startups)', status: 'done' },
      { date: '2026-06-30', title: 'Demo Day cooperativas', status: 'pending' },
    ],
    beneficiaries: [
      { name: 'EcoCacao Madre', vertical: 'Agritech', readiness: 76, mrrUSD: 6_400 },
      { name: 'NutriQuinua', vertical: 'Agritech', readiness: 78, mrrUSD: 8_200 },
      { name: 'CafeOriente', vertical: 'Agritech', readiness: 71, mrrUSD: 4_900 },
    ],
  },
  {
    id: 'prog-udep-piura',
    name: 'Hub UDEP · Innovación Norte',
    executingOrg: 'Hub UDEP',
    region: 'Piura',
    vertical: 'Multisector',
    startDate: '2025-03-15',
    endDate: '2027-02-28',
    startupsCount: 44,
    cohortsCount: 3,
    readinessAvg: 64,
    nps: 72,
    completionRate: 65,
    toolsCompletionPct: 51,
    retentionRate: 80,
    fundingRaisedUSD: 410_000,
    mrrAggregateUSD: 44_700,
    status: 'active',
    description: 'Hub regional norte. Foco en agroindustria, pesca sostenible y energía renovable. Vinculación con cluster minero responsable.',
    jobsGenerated: 268,
    co2Avoided: 1_980,
    womenFoundersPct: 38,
    ruralFoundersPct: 41,
    milestones: [
      { date: '2025-04-10', title: 'Cohorte 1 lanzada (12)', status: 'done' },
      { date: '2025-10-30', title: 'Cohorte 1 cerrada', status: 'done' },
      { date: '2026-01-15', title: 'Cohorte 2 lanzada (14)', status: 'done' },
      { date: '2026-08-30', title: 'Cohorte 3 prevista', status: 'pending' },
    ],
    beneficiaries: [
      { name: 'BiomarBio', vertical: 'Biomateriales', readiness: 73, mrrUSD: 4_600 },
      { name: 'PescaSostenible', vertical: 'Agritech', readiness: 70, mrrUSD: 3_700 },
      { name: 'AgroMango', vertical: 'Agritech', readiness: 68, mrrUSD: 3_400 },
    ],
  },
  {
    id: 'prog-innovate-cusco',
    name: 'Innóvate Cusco Andino',
    executingOrg: 'Innóvate Cusco',
    region: 'Cusco',
    vertical: 'Turismo regenerativo',
    startDate: '2025-05-01',
    endDate: '2026-10-31',
    startupsCount: 28,
    cohortsCount: 2,
    readinessAvg: 67,
    nps: 78,
    completionRate: 70,
    toolsCompletionPct: 58,
    retentionRate: 86,
    fundingRaisedUSD: 220_000,
    mrrAggregateUSD: 26_400,
    status: 'active',
    description: 'Programa de turismo regenerativo, emprendimientos comunitarios y patrimonio andino. Vinculación con MINCETUR.',
    jobsGenerated: 142,
    co2Avoided: 520,
    womenFoundersPct: 51,
    ruralFoundersPct: 58,
    milestones: [
      { date: '2025-05-20', title: 'Cohorte 1 (10)', status: 'done' },
      { date: '2025-11-30', title: 'Cohorte 1 cerrada', status: 'done' },
      { date: '2026-02-01', title: 'Cohorte 2 (10)', status: 'done' },
      { date: '2026-10-31', title: 'Cierre y reporte MINPRO', status: 'pending' },
    ],
    beneficiaries: [
      { name: 'AndinaFood', vertical: 'Agritech', readiness: 51, mrrUSD: 0 },
      { name: 'TurismoVivo', vertical: 'Turismo', readiness: 75, mrrUSD: 4_300 },
      { name: 'TextilQ’ente', vertical: 'Otros', readiness: 72, mrrUSD: 3_600 },
    ],
  },
  {
    id: 'prog-aceleragap',
    name: 'AceleraGap · Climate Tech',
    executingOrg: 'AceleraGap',
    region: 'Lima',
    vertical: 'Climate Tech',
    startDate: '2025-06-01',
    endDate: '2026-12-31',
    startupsCount: 32,
    cohortsCount: 2,
    readinessAvg: 78,
    nps: 84,
    completionRate: 81,
    toolsCompletionPct: 74,
    retentionRate: 94,
    fundingRaisedUSD: 1_280_000,
    mrrAggregateUSD: 96_800,
    status: 'active',
    description: 'Programa privado-público. Aceleración intensiva 6 meses, MRR mínimo USD 5K. Vinculación con BID Lab.',
    jobsGenerated: 412,
    co2Avoided: 7_650,
    womenFoundersPct: 36,
    ruralFoundersPct: 9,
    milestones: [
      { date: '2025-06-20', title: 'Cohorte 1 (12)', status: 'done' },
      { date: '2025-12-20', title: 'Cohorte 1 cierre · USD 1.2M en rondas', status: 'done' },
      { date: '2026-02-15', title: 'Cohorte 2 (10)', status: 'done' },
      { date: '2026-08-30', title: 'Demo Day inversionistas', status: 'pending' },
    ],
    beneficiaries: [
      { name: 'CarbonZero LatAm', vertical: 'Climate Tech', readiness: 88, mrrUSD: 19_900 },
      { name: 'EnerSmart Andes', vertical: 'Energía', readiness: 84, mrrUSD: 14_800 },
      { name: 'MoveGreen', vertical: 'Climate Tech', readiness: 81, mrrUSD: 11_200 },
    ],
  },
  {
    id: 'prog-energia-arequipa',
    name: 'Energía Verde Arequipa',
    executingOrg: 'Energía Verde Arequipa',
    region: 'Arequipa',
    vertical: 'Energía renovable',
    startDate: '2025-07-15',
    endDate: '2027-06-30',
    startupsCount: 18,
    cohortsCount: 1,
    readinessAvg: 58,
    nps: 68,
    completionRate: 54,
    toolsCompletionPct: 42,
    retentionRate: 72,
    fundingRaisedUSD: 95_000,
    mrrAggregateUSD: 12_400,
    status: 'at_risk',
    description: 'Programa de energías renovables. Avance por debajo de lo proyectado. Requiere ajuste de cronograma y refuerzo de mentoría.',
    jobsGenerated: 76,
    co2Avoided: 1_420,
    womenFoundersPct: 28,
    ruralFoundersPct: 35,
    milestones: [
      { date: '2025-08-10', title: 'Cohorte 1 lanzada (16)', status: 'done' },
      { date: '2026-02-01', title: 'Hito intermedio · retrasado', status: 'pending' },
      { date: '2026-09-30', title: 'Cohorte 2 prevista', status: 'pending' },
    ],
    beneficiaries: [
      { name: 'SolarSelva', vertical: 'Energía', readiness: 74, mrrUSD: 5_300 },
      { name: 'EnerPampa', vertical: 'Energía', readiness: 77, mrrUSD: 7_600 },
      { name: 'CleanRibera', vertical: 'Energía', readiness: 55, mrrUSD: 0 },
    ],
  },
  {
    id: 'prog-agrihub-libertad',
    name: 'AgriHub La Libertad',
    executingOrg: 'AgriHub La Libertad',
    region: 'La Libertad',
    vertical: 'Agritech',
    startDate: '2025-08-01',
    endDate: '2027-07-31',
    startupsCount: 20,
    cohortsCount: 2,
    readinessAvg: 62,
    nps: 71,
    completionRate: 66,
    toolsCompletionPct: 49,
    retentionRate: 81,
    fundingRaisedUSD: 215_000,
    mrrAggregateUSD: 22_400,
    status: 'active',
    description: 'Hub agroindustrial costa norte. Vinculado a clusters de espárrago, palta y caña.',
    jobsGenerated: 230,
    co2Avoided: 1_810,
    womenFoundersPct: 42,
    ruralFoundersPct: 49,
    milestones: [
      { date: '2025-08-20', title: 'Cohorte 1 (14)', status: 'done' },
      { date: '2026-02-28', title: 'Cohorte 1 cierre', status: 'done' },
      { date: '2026-04-01', title: 'Cohorte 2 (13)', status: 'done' },
      { date: '2026-10-30', title: 'Demo Day y cierre cohorte 2', status: 'pending' },
    ],
    beneficiaries: [
      { name: 'AgroCosta', vertical: 'Agritech', readiness: 73, mrrUSD: 4_200 },
      { name: 'PaltaPower', vertical: 'Agritech', readiness: 70, mrrUSD: 3_600 },
      { name: 'EsparragoTech', vertical: 'Agritech', readiness: 68, mrrUSD: 3_100 },
    ],
  },
]

/* ─────────────────── Executor orgs (8) ─────────────────── */
export const DEMO_EXECUTOR_ORGS: DemoExecutorOrg[] = [
  { id: 'org-bioinnova', name: 'BioInnova UNAMAD', region: 'Madre de Dios', type: 'university', cohortsCount: 3, startupsCount: 38, readinessAvg: 74, toolsCompletionPct: 68, programIds: ['prog-bioinnova-mdd'] },
  { id: 'org-wiener', name: 'Universidad Wiener', region: 'Lima', type: 'university', cohortsCount: 2, startupsCount: 42, readinessAvg: 71, toolsCompletionPct: 62, programIds: ['prog-wiener-health'] },
  { id: 'org-unamad', name: 'UNAMAD', region: 'Madre de Dios', type: 'university', cohortsCount: 2, startupsCount: 26, readinessAvg: 67, toolsCompletionPct: 55, programIds: ['prog-unamad-agri'] },
  { id: 'org-udep', name: 'Hub UDEP', region: 'Piura', type: 'hub', cohortsCount: 3, startupsCount: 44, readinessAvg: 64, toolsCompletionPct: 51, programIds: ['prog-udep-piura'] },
  { id: 'org-innovate-cusco', name: 'Innóvate Cusco', region: 'Cusco', type: 'incubator', cohortsCount: 2, startupsCount: 28, readinessAvg: 67, toolsCompletionPct: 58, programIds: ['prog-innovate-cusco'] },
  { id: 'org-aceleragap', name: 'AceleraGap', region: 'Lima', type: 'accelerator', cohortsCount: 2, startupsCount: 32, readinessAvg: 78, toolsCompletionPct: 74, programIds: ['prog-aceleragap'] },
  { id: 'org-energia-verde', name: 'Energía Verde Arequipa', region: 'Arequipa', type: 'incubator', cohortsCount: 1, startupsCount: 18, readinessAvg: 58, toolsCompletionPct: 42, programIds: ['prog-energia-arequipa'] },
  { id: 'org-agrihub', name: 'AgriHub La Libertad', region: 'La Libertad', type: 'hub', cohortsCount: 2, startupsCount: 20, readinessAvg: 62, toolsCompletionPct: 49, programIds: ['prog-agrihub-libertad'] },
]

/* ─────────────────── National KPIs ─────────────────── */
export const DEMO_MINPRO_KPIS = {
  programsActive: 8,
  startupsTotal: 248,
  readinessAvg: 71,
  toolsCompletionPct: 58,
  npsFounders: 64,
  mrrAggregateUSD: DEMO_PROGRAMS.reduce((s, p) => s + p.mrrAggregateUSD, 0), // ~412k
  fundingRaisedUSD: DEMO_PROGRAMS.reduce((s, p) => s + p.fundingRaisedUSD, 0), // ~4.8M
  jobsGenerated: 1_840,
  co2Avoided: 18_200,
  graduatedStartups: 62,
  retentionRate: 87,
  regions: 7,
  activeCohorts: DEMO_PROGRAMS.reduce((s, p) => s + p.cohortsCount, 0),
}

/* ─────────────────── Region distribution ─────────────────── */
export const DEMO_REGION_DISTRIBUTION = [
  { region: 'Lima', programs: 2, startups: 74, color: '#1F77F6' },
  { region: 'Madre de Dios', programs: 2, startups: 64, color: '#16A34A' },
  { region: 'Piura', programs: 1, startups: 44, color: '#1F77F6' },
  { region: 'La Libertad', programs: 1, startups: 20, color: '#F59E0B' },
  { region: 'Arequipa', programs: 1, startups: 18, color: '#8B5CF6' },
  { region: 'Cusco', programs: 1, startups: 28, color: '#EC4899' },
  { region: 'Loreto', programs: 0, startups: 0, color: '#94A3B8' },
]

/* ─────────────────── Vertical distribution ─────────────────── */
export const DEMO_VERTICAL_DISTRIBUTION_NATIONAL = [
  { key: 'biotech', label: 'Biotech', count: 48, color: '#1F77F6' },
  { key: 'agritech', label: 'Agritech', count: 42, color: '#16A34A' },
  { key: 'healthtech', label: 'Healthtech', count: 36, color: '#1F77F6' },
  { key: 'energia', label: 'Energía', count: 32, color: '#F59E0B' },
  { key: 'fintech', label: 'Fintech', count: 22, color: '#8B5CF6' },
  { key: 'edtech', label: 'EdTech', count: 18, color: '#EC4899' },
  { key: 'agtech', label: 'AgTech', count: 16, color: '#10B981' },
  { key: 'otros', label: 'Otros', count: 34, color: '#94A3B8' },
]

/* ─────────────────── Stage distribution ─────────────────── */
export const DEMO_STAGE_DISTRIBUTION_NATIONAL = [
  { key: 'pre_incubation', label: 'Pre-incubación', count: 102, color: '#94A3B8' },
  { key: 'incubation', label: 'Incubación', count: 82, color: '#1F77F6' },
  { key: 'acceleration', label: 'Aceleración', count: 44, color: '#1F77F6' },
  { key: 'scaling', label: 'Escalamiento', count: 20, color: '#DA4E24' },
]

/* ─────────────────── Gender distribution ─────────────────── */
export const DEMO_GENDER_DISTRIBUTION = [
  { key: 'women', label: 'Mujeres founders', pct: 41, color: '#EC4899' },
  { key: 'men', label: 'Hombres founders', pct: 52, color: '#1F77F6' },
  { key: 'mixed', label: 'Equipos mixtos', pct: 7, color: '#8B5CF6' },
]

/* ─────────────────── Alerts ─────────────────── */
export const DEMO_ALERTS = [
  { id: 'al-01', severity: 'high' as const, title: 'Energía Verde Arequipa con tools completion en 42% (esperado 60%)', programId: 'prog-energia-arequipa', date: '2026-04-12' },
  { id: 'al-02', severity: 'medium' as const, title: 'AgriHub La Libertad con retención de founders en 81% (objetivo 88%)', programId: 'prog-agrihub-libertad', date: '2026-04-10' },
  { id: 'al-03', severity: 'medium' as const, title: 'Hub UDEP avance de readiness por debajo de proyección Q1', programId: 'prog-udep-piura', date: '2026-04-08' },
]

/* ─────────────────── Próximos hitos ─────────────────── */
export const DEMO_UPCOMING_MILESTONES = [
  { date: '2026-04-15', program: 'BioInnova MDD', title: 'Cierre Cohorte Otoño + Demo Day' },
  { date: '2026-05-15', program: 'BioInnova MDD', title: 'Workshop validación de mercado' },
  { date: '2026-06-30', program: 'UNAMAD AgriTech', title: 'Demo Day cooperativas' },
  { date: '2026-08-30', program: 'AceleraGap', title: 'Demo Day inversionistas' },
  { date: '2026-09-15', program: 'Wiener Health', title: 'Demo Day intermedio' },
]

/* ─────────────────── Funding leverage (USD raised per startup acompañada) ─────────────────── */
export function programLeverage(p: DemoProgram): number {
  if (p.startupsCount === 0) return 0
  return Math.round(p.fundingRaisedUSD / p.startupsCount)
}

export function getProgramById(id: string): DemoProgram | undefined {
  return DEMO_PROGRAMS.find((p) => p.id === id)
}

/* ─────────────────── Helpers de formato ─────────────────── */
export function formatUSD(amount: number): string {
  if (amount >= 1_000_000) return `USD ${(amount / 1_000_000).toFixed(1)}M`
  if (amount >= 1_000) return `USD ${(amount / 1_000).toFixed(0)}K`
  return `USD ${amount.toLocaleString('es-PE')}`
}
