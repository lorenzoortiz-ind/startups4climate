/**
 * Loader for /admin/benchmarking: org-vs-platform benchmark metrics.
 */
import { supabase } from '@/lib/supabase'
import { DEMO_STARTUPS, DEMO_ORG } from '@/lib/demo/admin-fixtures'

/** Re-export for demo-only startup table in benchmarking page */
export { DEMO_STARTUPS } from '@/lib/demo/admin-fixtures'

export interface BenchmarkMetric {
  metric: string
  org: number
  platform: number
}

export interface ChartPoint {
  name: string
  tuOrg: number
  promedio: number
}

export interface BenchmarkResult {
  metrics: BenchmarkMetric[]
  chart: ChartPoint[]
}

function avg(arr: number[]): number {
  if (arr.length === 0) return 0
  return Math.round((arr.reduce((a, b) => a + b, 0) / arr.length) * 10) / 10
}

// Auto-derived from DEMO_STARTUPS for consistency with the rest of the demo
const DEMO_TOOLS_AVG = +(DEMO_STARTUPS.reduce((s, x) => s + x.toolsCompleted, 0) / DEMO_STARTUPS.length).toFixed(1)
const DEMO_READINESS_AVG = +(DEMO_STARTUPS.reduce((s, x) => s + x.readiness, 0) / DEMO_STARTUPS.length).toFixed(1)
const DEMO_DIAG_AVG = +(DEMO_STARTUPS.reduce((s, x) => s + x.diagnosticScore, 0) / DEMO_STARTUPS.length).toFixed(1)

const DEMO_BENCHMARK: BenchmarkResult = {
  metrics: [
    { metric: 'Herramientas completadas (de 32)', org: DEMO_TOOLS_AVG, platform: 11.4 },
    { metric: 'Readiness score (0-100)', org: DEMO_READINESS_AVG, platform: 56 },
    { metric: 'Score diagnóstico (0-10)', org: DEMO_DIAG_AVG, platform: 5.6 },
    { metric: 'NPS programa', org: DEMO_ORG.averageNps, platform: 62 },
  ],
  chart: [
    { name: 'Herramientas', tuOrg: DEMO_TOOLS_AVG, promedio: 11.4 },
    { name: 'Readiness', tuOrg: DEMO_READINESS_AVG, promedio: 56 },
    { name: 'Score diag.', tuOrg: DEMO_DIAG_AVG, promedio: 5.6 },
    { name: 'NPS', tuOrg: DEMO_ORG.averageNps, promedio: 62 },
  ],
}

interface LoadArgs {
  isDemo: boolean
  orgId: string | null | undefined
}

export async function loadBenchmark({ isDemo, orgId }: LoadArgs): Promise<BenchmarkResult> {
  if (isDemo) return DEMO_BENCHMARK

  if (!orgId) return { metrics: [], chart: [] }

  // Get org's cohorts
  const { data: cohorts } = await supabase
    .from('cohorts')
    .select('id')
    .eq('org_id', orgId)

  const cohortIds = cohorts?.map((c) => c.id) || []

  // Get org's startup IDs
  let orgStartupIds: string[] = []
  if (cohortIds.length > 0) {
    const { data: assignments } = await supabase
      .from('cohort_startups')
      .select('startup_id')
      .in('cohort_id', cohortIds)
    orgStartupIds = assignments?.map((a) => a.startup_id) || []
  }

  // Get org's startups
  let orgStartups: { diagnostic_score: number | null; tools_completed: number | null; stage: string | null }[] = []
  if (orgStartupIds.length > 0) {
    const { data } = await supabase
      .from('startups')
      .select('diagnostic_score, tools_completed, stage')
      .in('id', orgStartupIds)
    orgStartups = data || []
  }

  // Get all platform startups
  const { data: allStartups } = await supabase
    .from('startups')
    .select('diagnostic_score, tools_completed, stage')

  const platformStartups = allStartups || []

  // Calculate metrics
  const orgScores = orgStartups.filter((s) => s.diagnostic_score != null).map((s) => s.diagnostic_score!)
  const platformScores = platformStartups.filter((s) => s.diagnostic_score != null).map((s) => s.diagnostic_score!)

  const orgTools = orgStartups.map((s) => s.tools_completed || 0)
  const platformTools = platformStartups.map((s) => s.tools_completed || 0)

  // Stage progress: map stages to % (pre=25, inc=50, acc=75, scal=100)
  const stageToPercent: Record<string, number> = {
    pre_incubation: 25,
    incubation: 50,
    acceleration: 75,
    scaling: 100,
  }
  const orgProgress = orgStartups.map((s) => stageToPercent[s.stage || ''] || 0)
  const platformProgress = platformStartups.map((s) => stageToPercent[s.stage || ''] || 0)

  const metrics: BenchmarkMetric[] = [
    { metric: 'Herramientas completadas', org: avg(orgTools), platform: avg(platformTools) },
    { metric: 'Avance de etapa (%)', org: avg(orgProgress), platform: avg(platformProgress) },
    { metric: 'Score diagnóstico', org: avg(orgScores), platform: avg(platformScores) },
  ]

  const chart: ChartPoint[] = [
    { name: 'Herramientas', tuOrg: metrics[0].org, promedio: metrics[0].platform },
    { name: 'Avance (%)', tuOrg: metrics[1].org, promedio: metrics[1].platform },
    { name: 'Score diag.', tuOrg: metrics[2].org, promedio: metrics[2].platform },
  ]

  return { metrics, chart }
}
