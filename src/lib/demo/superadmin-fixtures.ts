/**
 * Superadmin (MINPRO) demo fixtures: programas de innovación financiados
 * por el Ministerio de la Producción del Perú.
 *
 * Cifras alineadas con escala real de Innóvate Perú / ProInnóvate.
 * Moneda: Soles Peruanos (S/) salvo indicación.
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
  budgetAssigned: number // S/
  budgetExecuted: number // S/
  startupsCount: number
  cohortsCount: number
  readinessAvg: number // 0-100
  nps: number
  completionRate: number // 0-100
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
  beneficiaries: { name: string; vertical: string; readiness: number; mrrPEN: number }[]
}

export interface DemoExecutorOrg {
  id: string
  name: string
  region: string
  type: 'university' | 'incubator' | 'accelerator' | 'hub'
  cohortsCount: number
  startupsCount: number
  budgetExecutedPEN: number
  readinessAvg: number
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
    budgetAssigned: 4_560_000,
    budgetExecuted: 3_420_000,
    startupsCount: 24,
    cohortsCount: 3,
    readinessAvg: 71,
    nps: 81,
    completionRate: 73,
    status: 'active',
    description: 'Programa estrella de biotech amazónica. 3 cohortes desplegadas, 6 startups graduadas con tracción internacional. Foco en biomateriales, biofármacos y agritech amazónica.',
    jobsGenerated: 147,
    co2Avoided: 892,
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
      { name: 'TerraReciclo', vertical: 'Biomateriales', readiness: 91, mrrPEN: 84_000 },
      { name: 'BioPak Andina', vertical: 'Biomateriales', readiness: 89, mrrPEN: 70_300 },
      { name: 'AmazonBio Pack', vertical: 'Biomateriales', readiness: 87, mrrPEN: 53_960 },
      { name: 'KuntiPlant', vertical: 'Agritech', readiness: 84, mrrPEN: 37_240 },
      { name: 'AgroSinergia', vertical: 'Agritech', readiness: 82, mrrPEN: 42_560 },
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
    budgetAssigned: 3_800_000,
    budgetExecuted: 2_660_000,
    startupsCount: 28,
    cohortsCount: 2,
    readinessAvg: 68,
    nps: 76,
    completionRate: 71,
    status: 'active',
    description: 'Programa de healthtech con foco en bienestar, telemedicina y dispositivos médicos accesibles para zonas peri-urbanas.',
    jobsGenerated: 132,
    co2Avoided: 210,
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
      { name: 'AyaHealth', vertical: 'Healthtech', readiness: 84, mrrPEN: 27_360 },
      { name: 'TeleMed Andina', vertical: 'Healthtech', readiness: 81, mrrPEN: 22_400 },
      { name: 'BienestarKids', vertical: 'Healthtech', readiness: 78, mrrPEN: 19_800 },
      { name: 'MediBosque', vertical: 'Healthtech', readiness: 80, mrrPEN: 35_720 },
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
    budgetAssigned: 2_100_000,
    budgetExecuted: 1_680_000,
    startupsCount: 18,
    cohortsCount: 2,
    readinessAvg: 65,
    nps: 74,
    completionRate: 68,
    status: 'active',
    description: 'Aceleración de agritech con cooperativas amazónicas. Foco en cacao, castaña, copoazú y café especial.',
    jobsGenerated: 96,
    co2Avoided: 340,
    womenFoundersPct: 39,
    ruralFoundersPct: 67,
    milestones: [
      { date: '2025-02-20', title: 'Cohorte 1 (10 startups)', status: 'done' },
      { date: '2025-08-30', title: 'Cohorte 1 cerrada', status: 'done' },
      { date: '2025-10-01', title: 'Cohorte 2 (8 startups)', status: 'done' },
      { date: '2026-06-30', title: 'Demo Day cooperativas', status: 'pending' },
    ],
    beneficiaries: [
      { name: 'EcoCacao Madre', vertical: 'Agritech', readiness: 76, mrrPEN: 24_320 },
      { name: 'NutriQuinua', vertical: 'Agritech', readiness: 78, mrrPEN: 31_160 },
      { name: 'CafeOriente', vertical: 'Agritech', readiness: 71, mrrPEN: 18_500 },
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
    budgetAssigned: 3_200_000,
    budgetExecuted: 1_920_000,
    startupsCount: 32,
    cohortsCount: 3,
    readinessAvg: 64,
    nps: 72,
    completionRate: 65,
    status: 'active',
    description: 'Hub regional norte. Foco en agroindustria, pesca sostenible y energía renovable. Vinculación con cluster minero responsable.',
    jobsGenerated: 178,
    co2Avoided: 520,
    womenFoundersPct: 38,
    ruralFoundersPct: 41,
    milestones: [
      { date: '2025-04-10', title: 'Cohorte 1 lanzada (12)', status: 'done' },
      { date: '2025-10-30', title: 'Cohorte 1 cerrada', status: 'done' },
      { date: '2026-01-15', title: 'Cohorte 2 lanzada (14)', status: 'done' },
      { date: '2026-08-30', title: 'Cohorte 3 prevista', status: 'pending' },
    ],
    beneficiaries: [
      { name: 'BiomarBio', vertical: 'Biomateriales', readiness: 73, mrrPEN: 17_480 },
      { name: 'PescaSostenible', vertical: 'Agritech', readiness: 70, mrrPEN: 14_200 },
      { name: 'AgroMango', vertical: 'Agritech', readiness: 68, mrrPEN: 12_900 },
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
    budgetAssigned: 1_800_000,
    budgetExecuted: 1_350_000,
    startupsCount: 20,
    cohortsCount: 2,
    readinessAvg: 67,
    nps: 78,
    completionRate: 70,
    status: 'active',
    description: 'Programa de turismo regenerativo, emprendimientos comunitarios y patrimonio andino. Vinculación con MINCETUR.',
    jobsGenerated: 84,
    co2Avoided: 145,
    womenFoundersPct: 51,
    ruralFoundersPct: 58,
    milestones: [
      { date: '2025-05-20', title: 'Cohorte 1 (10)', status: 'done' },
      { date: '2025-11-30', title: 'Cohorte 1 cerrada', status: 'done' },
      { date: '2026-02-01', title: 'Cohorte 2 (10)', status: 'done' },
      { date: '2026-10-31', title: 'Cierre y reporte MINPRO', status: 'pending' },
    ],
    beneficiaries: [
      { name: 'AndinaFood', vertical: 'Agritech', readiness: 51, mrrPEN: 0 },
      { name: 'TurismoVivo', vertical: 'Turismo', readiness: 75, mrrPEN: 16_200 },
      { name: 'TextilQ’ente', vertical: 'Otros', readiness: 72, mrrPEN: 13_400 },
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
    budgetAssigned: 4_200_000,
    budgetExecuted: 3_780_000,
    startupsCount: 22,
    cohortsCount: 2,
    readinessAvg: 76,
    nps: 84,
    completionRate: 81,
    status: 'active',
    description: 'Programa privado-público. Aceleración intensiva 6 meses, MRR mínimo USD 5K. Vinculación con BID Lab.',
    jobsGenerated: 198,
    co2Avoided: 1240,
    womenFoundersPct: 36,
    ruralFoundersPct: 9,
    milestones: [
      { date: '2025-06-20', title: 'Cohorte 1 (12)', status: 'done' },
      { date: '2025-12-20', title: 'Cohorte 1 cierre · USD 1.2M en rondas', status: 'done' },
      { date: '2026-02-15', title: 'Cohorte 2 (10)', status: 'done' },
      { date: '2026-08-30', title: 'Demo Day inversionistas', status: 'pending' },
    ],
    beneficiaries: [
      { name: 'CarbonZero LatAm', vertical: 'Climate Tech', readiness: 88, mrrPEN: 76_400 },
      { name: 'EnerSmart Andes', vertical: 'Energía', readiness: 84, mrrPEN: 56_200 },
      { name: 'MoveGreen', vertical: 'Climate Tech', readiness: 81, mrrPEN: 42_800 },
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
    budgetAssigned: 2_400_000,
    budgetExecuted: 720_000,
    startupsCount: 16,
    cohortsCount: 1,
    readinessAvg: 58,
    nps: 68,
    completionRate: 54,
    status: 'at_risk',
    description: 'Programa de energías renovables. Avance por debajo de lo proyectado. Requiere ajuste de cronograma y refuerzo de mentoría.',
    jobsGenerated: 42,
    co2Avoided: 380,
    womenFoundersPct: 28,
    ruralFoundersPct: 35,
    milestones: [
      { date: '2025-08-10', title: 'Cohorte 1 lanzada (16)', status: 'done' },
      { date: '2026-02-01', title: 'Hito intermedio · retrasado', status: 'pending' },
      { date: '2026-09-30', title: 'Cohorte 2 prevista', status: 'pending' },
    ],
    beneficiaries: [
      { name: 'SolarSelva', vertical: 'Energía', readiness: 74, mrrPEN: 20_140 },
      { name: 'EnerPampa', vertical: 'Energía', readiness: 77, mrrPEN: 28_880 },
      { name: 'CleanRibera', vertical: 'Energía', readiness: 55, mrrPEN: 0 },
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
    budgetAssigned: 2_100_000,
    budgetExecuted: 882_000,
    startupsCount: 27,
    cohortsCount: 2,
    readinessAvg: 62,
    nps: 71,
    completionRate: 66,
    status: 'active',
    description: 'Hub agroindustrial costa norte. Vinculado a clusters de espárrago, palta y caña.',
    jobsGenerated: 124,
    co2Avoided: 290,
    womenFoundersPct: 42,
    ruralFoundersPct: 49,
    milestones: [
      { date: '2025-08-20', title: 'Cohorte 1 (14)', status: 'done' },
      { date: '2026-02-28', title: 'Cohorte 1 cierre', status: 'done' },
      { date: '2026-04-01', title: 'Cohorte 2 (13)', status: 'done' },
      { date: '2026-10-30', title: 'Demo Day y cierre cohorte 2', status: 'pending' },
    ],
    beneficiaries: [
      { name: 'AgroCosta', vertical: 'Agritech', readiness: 73, mrrPEN: 16_800 },
      { name: 'PaltaPower', vertical: 'Agritech', readiness: 70, mrrPEN: 14_500 },
      { name: 'EsparragoTech', vertical: 'Agritech', readiness: 68, mrrPEN: 12_200 },
    ],
  },
]

/* ─────────────────── Executor orgs (8) ─────────────────── */
export const DEMO_EXECUTOR_ORGS: DemoExecutorOrg[] = [
  { id: 'org-bioinnova', name: 'BioInnova UNAMAD', region: 'Madre de Dios', type: 'university', cohortsCount: 3, startupsCount: 24, budgetExecutedPEN: 3_420_000, readinessAvg: 71, programIds: ['prog-bioinnova-mdd'] },
  { id: 'org-wiener', name: 'Universidad Wiener', region: 'Lima', type: 'university', cohortsCount: 2, startupsCount: 28, budgetExecutedPEN: 2_660_000, readinessAvg: 68, programIds: ['prog-wiener-health'] },
  { id: 'org-unamad', name: 'UNAMAD', region: 'Madre de Dios', type: 'university', cohortsCount: 2, startupsCount: 18, budgetExecutedPEN: 1_680_000, readinessAvg: 65, programIds: ['prog-unamad-agri'] },
  { id: 'org-udep', name: 'Hub UDEP', region: 'Piura', type: 'hub', cohortsCount: 3, startupsCount: 32, budgetExecutedPEN: 1_920_000, readinessAvg: 64, programIds: ['prog-udep-piura'] },
  { id: 'org-innovate-cusco', name: 'Innóvate Cusco', region: 'Cusco', type: 'incubator', cohortsCount: 2, startupsCount: 20, budgetExecutedPEN: 1_350_000, readinessAvg: 67, programIds: ['prog-innovate-cusco'] },
  { id: 'org-aceleragap', name: 'AceleraGap', region: 'Lima', type: 'accelerator', cohortsCount: 2, startupsCount: 22, budgetExecutedPEN: 3_780_000, readinessAvg: 76, programIds: ['prog-aceleragap'] },
  { id: 'org-energia-verde', name: 'Energía Verde Arequipa', region: 'Arequipa', type: 'incubator', cohortsCount: 1, startupsCount: 16, budgetExecutedPEN: 720_000, readinessAvg: 58, programIds: ['prog-energia-arequipa'] },
  { id: 'org-agrihub', name: 'AgriHub La Libertad', region: 'La Libertad', type: 'hub', cohortsCount: 2, startupsCount: 27, budgetExecutedPEN: 882_000, readinessAvg: 62, programIds: ['prog-agrihub-libertad'] },
]

/* ─────────────────── National KPIs ─────────────────── */
export const DEMO_MINPRO_KPIS = {
  programsActive: 8,
  startupsTotal: 187,
  budgetExecutedPEN: DEMO_PROGRAMS.reduce((s, p) => s + p.budgetExecuted, 0), // ~16.4M
  budgetAssignedPEN: DEMO_PROGRAMS.reduce((s, p) => s + p.budgetAssigned, 0), // ~24.2M
  executionPct: 0,
  regions: 7,
  jobsGenerated: DEMO_PROGRAMS.reduce((s, p) => s + p.jobsGenerated, 0),
  co2Avoided: DEMO_PROGRAMS.reduce((s, p) => s + p.co2Avoided, 0),
  graduatedStartups: 47,
  pipelineCapital: 4_200_000, // PEN, capital privado vinculado
}

DEMO_MINPRO_KPIS.executionPct = Math.round(
  (DEMO_MINPRO_KPIS.budgetExecutedPEN / DEMO_MINPRO_KPIS.budgetAssignedPEN) * 100
)

/* ─────────────────── Region distribution ─────────────────── */
export const DEMO_REGION_DISTRIBUTION = [
  { region: 'Lima', programs: 2, startups: 50, color: '#0D9488' },
  { region: 'Madre de Dios', programs: 2, startups: 42, color: '#16A34A' },
  { region: 'Piura', programs: 1, startups: 32, color: '#3B82F6' },
  { region: 'La Libertad', programs: 1, startups: 27, color: '#F59E0B' },
  { region: 'Arequipa', programs: 1, startups: 16, color: '#8B5CF6' },
  { region: 'Cusco', programs: 1, startups: 20, color: '#EC4899' },
  { region: 'Loreto', programs: 0, startups: 0, color: '#94A3B8' },
]

/* ─────────────────── Vertical distribution ─────────────────── */
export const DEMO_VERTICAL_DISTRIBUTION_NATIONAL = [
  { key: 'biotech', label: 'Biotech', count: 38, color: '#0D9488' },
  { key: 'agritech', label: 'Agritech', count: 32, color: '#16A34A' },
  { key: 'healthtech', label: 'Healthtech', count: 28, color: '#3B82F6' },
  { key: 'energia', label: 'Energía', count: 24, color: '#F59E0B' },
  { key: 'fintech', label: 'Fintech', count: 18, color: '#8B5CF6' },
  { key: 'edtech', label: 'EdTech', count: 15, color: '#EC4899' },
  { key: 'agtech', label: 'AgTech', count: 12, color: '#10B981' },
  { key: 'otros', label: 'Otros', count: 20, color: '#94A3B8' },
]

/* ─────────────────── Stage distribution ─────────────────── */
export const DEMO_STAGE_DISTRIBUTION_NATIONAL = [
  { key: 'pre_incubation', label: 'Pre-incubación', count: 78, color: '#94A3B8' },
  { key: 'incubation', label: 'Incubación', count: 62, color: '#3B82F6' },
  { key: 'acceleration', label: 'Aceleración', count: 32, color: '#0D9488' },
  { key: 'scaling', label: 'Escalamiento', count: 15, color: '#FF6B4A' },
]

/* ─────────────────── Gender distribution ─────────────────── */
export const DEMO_GENDER_DISTRIBUTION = [
  { key: 'women', label: 'Mujeres founders', pct: 41, color: '#EC4899' },
  { key: 'men', label: 'Hombres founders', pct: 52, color: '#3B82F6' },
  { key: 'mixed', label: 'Equipos mixtos', pct: 7, color: '#8B5CF6' },
]

/* ─────────────────── Alerts ─────────────────── */
export const DEMO_ALERTS = [
  { id: 'al-01', severity: 'high' as const, title: 'Energía Verde Arequipa con 30% de ejecución (esperado 50%)', programId: 'prog-energia-arequipa', date: '2026-04-12' },
  { id: 'al-02', severity: 'medium' as const, title: 'AgriHub La Libertad ejecución 42% (esperado 50%)', programId: 'prog-agrihub-libertad', date: '2026-04-10' },
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

/* ─────────────────── ROI estimate (PEN executed → revenue/funding generated) ─────────────────── */
export function programRoi(p: DemoProgram): number {
  const totalRevenueProxy = p.beneficiaries.reduce((s, b) => s + b.mrrPEN * 12, 0)
  if (p.budgetExecuted === 0) return 0
  return Math.round((totalRevenueProxy / p.budgetExecuted) * 100) / 100
}

export function getProgramById(id: string): DemoProgram | undefined {
  return DEMO_PROGRAMS.find((p) => p.id === id)
}

/* ─────────────────── Helpers de formato ─────────────────── */
export function formatPEN(amount: number): string {
  if (amount >= 1_000_000) return `S/ ${(amount / 1_000_000).toFixed(1)}M`
  if (amount >= 1_000) return `S/ ${(amount / 1_000).toFixed(0)}K`
  return `S/ ${amount.toLocaleString('es-PE')}`
}

export function formatUSD(amount: number): string {
  if (amount >= 1_000_000) return `USD ${(amount / 1_000_000).toFixed(1)}M`
  if (amount >= 1_000) return `USD ${(amount / 1_000).toFixed(0)}K`
  return `USD ${amount.toLocaleString('es-PE')}`
}
