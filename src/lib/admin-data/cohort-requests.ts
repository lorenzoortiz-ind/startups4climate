/**
 * Admin cohort-requests data loaders. Wraps the /api/cohort-requests endpoint
 * for real users and returns canned demo rows for the demo flow.
 */
export type RequestStatus = 'pending' | 'approved' | 'rejected'

export interface CohortRequestRow {
  id: string
  cohort_id: string
  founder_id: string
  startup_id: string
  status: RequestStatus
  message: string | null
  review_note: string | null
  reviewed_by: string | null
  reviewed_at: string | null
  created_at: string
  cohorts: {
    id: string
    name: string
    start_date: string | null
    end_date: string | null
  } | null
  startups: { id: string; name: string } | null
  profiles: { id: string; full_name: string | null; email: string | null } | null
}

const DEMO_COHORT_REF = {
  id: 'demo-cohort-1',
  name: 'Cohorte Innovación Climática 2026',
  start_date: '2026-05-01',
  end_date: '2026-08-31',
}

const DEMO_REQUESTS: CohortRequestRow[] = [
  // Pendientes
  {
    id: 'demo-req-1',
    cohort_id: 'demo-cohort-1',
    founder_id: 'demo-founder-1',
    startup_id: 'demo-startup-1',
    status: 'pending',
    message: 'Desarrollamos sistemas de purificación de agua para comunidades rurales en la sierra del Perú. Tenemos 3 pilotos activos y tracción real. Creemos que esta cohorte puede ayudarnos a escalar.',
    review_note: null,
    reviewed_by: null,
    reviewed_at: null,
    created_at: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
    cohorts: DEMO_COHORT_REF,
    startups: { id: 'demo-startup-1', name: 'AquaImpact Perú' },
    profiles: { id: 'demo-founder-1', full_name: 'Carlos Mendoza', email: 'carlos@aquaimpact.pe' },
  },
  {
    id: 'demo-req-2',
    cohort_id: 'demo-cohort-1',
    founder_id: 'demo-founder-2',
    startup_id: 'demo-startup-2',
    status: 'pending',
    message: 'Producimos biocombustible de segunda generación a partir de residuos agrícolas en Colombia. Buscamos mentoría para estructurar nuestro modelo de ingresos y acceder a fondos de impacto.',
    review_note: null,
    reviewed_by: null,
    reviewed_at: null,
    created_at: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
    cohorts: DEMO_COHORT_REF,
    startups: { id: 'demo-startup-2', name: 'GreenFuels Colombia' },
    profiles: { id: 'demo-founder-2', full_name: 'Valentina Rojas', email: 'v.rojas@greenfuels.co' },
  },
  {
    id: 'demo-req-3',
    cohort_id: 'demo-cohort-1',
    founder_id: 'demo-founder-3',
    startup_id: 'demo-startup-3',
    status: 'pending',
    message: null,
    review_note: null,
    reviewed_by: null,
    reviewed_at: null,
    created_at: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
    cohorts: DEMO_COHORT_REF,
    startups: { id: 'demo-startup-3', name: 'SolarMicro Bolivia' },
    profiles: { id: 'demo-founder-3', full_name: 'Diego Huanca', email: 'diego@solarmicro.bo' },
  },
  // Aprobadas
  {
    id: 'demo-req-4',
    cohort_id: 'demo-cohort-1',
    founder_id: 'demo-founder-4',
    startup_id: 'demo-startup-4',
    status: 'approved',
    message: 'Startup de créditos de carbono para comunidades forestales en la Amazonía peruana. Nuestro modelo genera ingresos directos para las comunidades que conservan el bosque.',
    review_note: 'Excelente fit con el verticale de clima del cohort. Equipo sólido con experiencia en forestería.',
    reviewed_by: 'admin@demo.startups4climate.org',
    reviewed_at: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
    created_at: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(),
    cohorts: DEMO_COHORT_REF,
    startups: { id: 'demo-startup-4', name: 'EcoBio Perú' },
    profiles: { id: 'demo-founder-4', full_name: 'Ana Quispe', email: 'founder@demo.startups4climate.org' },
  },
  {
    id: 'demo-req-5',
    cohort_id: 'demo-cohort-1',
    founder_id: 'demo-founder-5',
    startup_id: 'demo-startup-5',
    status: 'approved',
    message: 'Plataforma de monitoreo de huella de carbono para pymes en Chile. Certificación automatizada y marketplace de compensación.',
    review_note: null,
    reviewed_by: 'admin@demo.startups4climate.org',
    reviewed_at: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
    created_at: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000).toISOString(),
    cohorts: DEMO_COHORT_REF,
    startups: { id: 'demo-startup-5', name: 'CarbonCO Chile' },
    profiles: { id: 'demo-founder-5', full_name: 'Sebastián Torres', email: 's.torres@carbonco.cl' },
  },
  // Rechazadas
  {
    id: 'demo-req-6',
    cohort_id: 'demo-cohort-1',
    founder_id: 'demo-founder-6',
    startup_id: 'demo-startup-6',
    status: 'rejected',
    message: 'Plataforma de e-commerce para productores agrícolas en México.',
    review_note: 'El verticale de marketplace agro no encaja con el foco climático de esta cohorte. Te recomendamos aplicar en la próxima cohorte de AgriTech.',
    reviewed_by: 'admin@demo.startups4climate.org',
    reviewed_at: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
    created_at: new Date(Date.now() - 8 * 24 * 60 * 60 * 1000).toISOString(),
    cohorts: DEMO_COHORT_REF,
    startups: { id: 'demo-startup-6', name: 'TechFarm MX' },
    profiles: { id: 'demo-founder-6', full_name: 'Marcos Vilca', email: 'm.vilca@techfarm.mx' },
  },
]

interface LoadArgs {
  isDemo: boolean
}

export async function loadCohortRequests({ isDemo }: LoadArgs, status: RequestStatus): Promise<CohortRequestRow[]> {
  if (isDemo) return DEMO_REQUESTS.filter((r) => r.status === status)

  const res = await fetch(`/api/cohort-requests?status=${status}`, { cache: 'no-store' })
  const json = (await res.json()) as { requests?: CohortRequestRow[]; error?: string }
  if (!res.ok) throw new Error(json.error || 'Error al obtener solicitudes')
  return json.requests ?? []
}

export interface CohortRequestCounts {
  pending: number
  approved: number
  rejected: number
}

export async function loadCohortRequestCounts({ isDemo }: LoadArgs): Promise<CohortRequestCounts> {
  if (isDemo) {
    return {
      pending: DEMO_REQUESTS.filter((r) => r.status === 'pending').length,
      approved: DEMO_REQUESTS.filter((r) => r.status === 'approved').length,
      rejected: DEMO_REQUESTS.filter((r) => r.status === 'rejected').length,
    }
  }
  const [p, a, r] = await Promise.all([
    loadCohortRequests({ isDemo }, 'pending'),
    loadCohortRequests({ isDemo }, 'approved'),
    loadCohortRequests({ isDemo }, 'rejected'),
  ])
  return { pending: p.length, approved: a.length, rejected: r.length }
}
