/**
 * Admin dashboard data loader. Returns the full payload (org info, cohorts,
 * top startups, aggregate metrics) for the /admin landing page.
 */
import { supabase } from '@/lib/supabase'
import { DEMO_ORG, DEMO_COHORTS, topStartupsByReadiness } from '@/lib/demo/admin-fixtures'

export interface DashboardCohortRow {
  id: string
  name: string
  status: string
  start_date: string | null
  end_date: string | null
  startup_count: number
}

export interface DashboardStartupRow {
  id: string
  name: string
  vertical: string
  stage: string | null
  diagnostic_score: number | null
  tools_completed: number | null
  founder_name: string
  country: string | null
}

export interface DashboardMetrics {
  totalStartups: number
  activeCohorts: number
  avgScore: number
  avgToolsCompleted: number
}

export interface DashboardData {
  orgName: string | null
  orgLogo: string | null
  cohorts: DashboardCohortRow[]
  startups: DashboardStartupRow[]
  metrics: DashboardMetrics
}

interface LoadDashboardArgs {
  isDemo: boolean
  orgId: string | null | undefined
}

const EMPTY_METRICS: DashboardMetrics = {
  totalStartups: 0,
  activeCohorts: 0,
  avgScore: 0,
  avgToolsCompleted: 0,
}

function buildDemoDashboard(): DashboardData {
  const cohorts: DashboardCohortRow[] = DEMO_COHORTS.map((c) => ({
    id: c.id,
    name: c.name,
    status: c.status,
    start_date: c.startDate,
    end_date: c.endDate,
    startup_count: c.startupIds.length,
  }))
  const startups: DashboardStartupRow[] = topStartupsByReadiness(5).map((s) => ({
    id: s.id,
    name: s.name,
    vertical: s.verticalLabel,
    stage: s.stageLabel,
    diagnostic_score: s.diagnosticScore,
    tools_completed: s.toolsCompleted,
    founder_name: s.founderName,
    country: 'Perú',
  }))
  return {
    orgName: DEMO_ORG.name,
    orgLogo: null,
    cohorts,
    startups,
    metrics: {
      totalStartups: DEMO_ORG.activeStartups,
      activeCohorts: DEMO_COHORTS.filter((c) => c.status === 'active').length,
      avgScore: 7.3,
      avgToolsCompleted: 23,
    },
  }
}

function avg(values: number[]): number {
  if (!values.length) return 0
  return Math.round((values.reduce((s, v) => s + v, 0) / values.length) * 10) / 10
}

export async function loadDashboard({ isDemo, orgId }: LoadDashboardArgs): Promise<DashboardData> {
  if (isDemo) return buildDemoDashboard()
  if (!orgId) {
    return { orgName: null, orgLogo: null, cohorts: [], startups: [], metrics: EMPTY_METRICS }
  }

  const [orgRes, cohortRes] = await Promise.all([
    supabase.from('organizations').select('name, logo_url').eq('id', orgId).maybeSingle(),
    supabase.from('cohorts').select('id, name, status, start_date, end_date').eq('org_id', orgId),
  ])

  const orgName = orgRes.data?.name ?? null
  const orgLogo = orgRes.data?.logo_url ?? null
  const cohortData = cohortRes.data ?? []
  const cohortIds = cohortData.map((c) => c.id)

  if (cohortIds.length === 0) {
    return {
      orgName,
      orgLogo,
      cohorts: cohortData.map((c) => ({ ...c, startup_count: 0 })),
      startups: [],
      metrics: EMPTY_METRICS,
    }
  }

  const { data: csData } = await supabase
    .from('cohort_startups')
    .select('cohort_id, startup_id')
    .in('cohort_id', cohortIds)

  const countMap: Record<string, number> = {}
  const startupIds = new Set<string>()
  ;(csData ?? []).forEach((cs) => {
    countMap[cs.cohort_id] = (countMap[cs.cohort_id] ?? 0) + 1
    startupIds.add(cs.startup_id)
  })

  const cohorts: DashboardCohortRow[] = cohortData.map((c) => ({
    ...c,
    startup_count: countMap[c.id] ?? 0,
  }))

  let startups: DashboardStartupRow[] = []
  if (startupIds.size > 0) {
    const { data: startupData } = await supabase
      .from('startups')
      .select('id, name, vertical, stage, diagnostic_score, tools_completed, country, founder_id')
      .in('id', Array.from(startupIds))

    const founderIds = (startupData ?? []).map((s) => s.founder_id).filter(Boolean) as string[]
    const { data: profileData } = founderIds.length > 0
      ? await supabase.from('profiles').select('id, full_name').in('id', founderIds)
      : { data: [] }

    startups = (startupData ?? []).map((s) => ({
      id: s.id,
      name: s.name,
      vertical: s.vertical,
      stage: s.stage,
      diagnostic_score: s.diagnostic_score,
      tools_completed: s.tools_completed,
      country: s.country,
      founder_name:
        profileData?.find((p) => p.id === s.founder_id)?.full_name || 'Sin nombre',
    }))
  }

  const scores = startups.map((s) => s.diagnostic_score ?? 0).filter((v) => v > 0)
  const tools = startups.map((s) => s.tools_completed ?? 0)

  return {
    orgName,
    orgLogo,
    cohorts,
    startups,
    metrics: {
      totalStartups: startups.length,
      activeCohorts: cohorts.filter((c) => c.status === 'active' || c.status === 'planned').length,
      avgScore: avg(scores),
      avgToolsCompleted: avg(tools),
    },
  }
}
