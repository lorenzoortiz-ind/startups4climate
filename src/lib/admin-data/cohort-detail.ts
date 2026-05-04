/**
 * Loader for the /admin/cohortes/[id] detail view: cohort row + assigned startups.
 * Mutation guards (isDemo no-ops on save/delete) stay inline in the page —
 * they're not data sources, just safety rails.
 */
import { supabase } from '@/lib/supabase'
import { getCohortById, startupsByCohort } from '@/lib/demo/admin-fixtures'

export interface CohortDetailData {
  id: string
  name: string
  description: string | null
  start_date: string | null
  end_date: string | null
  status: string
  milestones: { name: string; stage: string; deadline: string }[]
  org_id: string
  access_mode: 'open' | 'closed'
  share_token: string | null
}

export interface StartupInCohort {
  assignment_id: string
  startup_id: string
  name: string
  founder_name: string
  vertical: string
  stage: string | null
  diagnostic_score: number | null
  tools_completed: number | null
  assignment_status: string
}

export interface CohortDetailResult {
  cohort: CohortDetailData
  startups: StartupInCohort[]
}

interface LoadArgs {
  isDemo: boolean
  cohortId: string
}

export async function loadCohortDetail({ isDemo, cohortId }: LoadArgs): Promise<CohortDetailResult> {
  if (isDemo) {
    const demoCohort = getCohortById(cohortId)
    if (!demoCohort) throw new Error('demo_not_found')
    const cohort: CohortDetailData = {
      id: demoCohort.id,
      name: demoCohort.name,
      description: demoCohort.description,
      start_date: demoCohort.startDate,
      end_date: demoCohort.endDate,
      status: demoCohort.status,
      org_id: 'demo-org-bioinnova',
      access_mode: 'closed',
      share_token: null,
      milestones: demoCohort.milestones.map((m) => ({
        name: m.title,
        stage: m.status === 'done' ? 'completed' : 'pending',
        deadline: m.date,
      })),
    }
    const startups: StartupInCohort[] = startupsByCohort(cohortId).map((s) => ({
      assignment_id: `demo-assign-${s.id}`,
      startup_id: s.id,
      name: s.name,
      founder_name: s.founderName,
      vertical: s.vertical,
      stage: s.stage,
      diagnostic_score: s.diagnosticScore,
      tools_completed: s.toolsCompleted,
      assignment_status: 'active',
    }))
    return { cohort, startups }
  }

  const { data: cohortData, error: cohortError } = await supabase
    .from('cohorts')
    .select('id, name, description, start_date, end_date, status, milestones, org_id, access_mode, share_token')
    .eq('id', cohortId)
    .maybeSingle()

  if (cohortError || !cohortData) throw new Error('cohort_not_found')

  const accessMode: 'open' | 'closed' = cohortData.access_mode === 'open' ? 'open' : 'closed'
  const cohort: CohortDetailData = {
    ...cohortData,
    milestones: (cohortData.milestones as CohortDetailData['milestones']) || [],
    access_mode: accessMode,
    share_token: cohortData.share_token || null,
  }

  const { data: assignments } = await supabase
    .from('cohort_startups')
    .select('id, startup_id, status')
    .eq('cohort_id', cohortId)

  if (!assignments || assignments.length === 0) {
    return { cohort, startups: [] }
  }

  const startupIds = assignments.map((a) => a.startup_id)
  const { data: startupsData } = await supabase
    .from('startups')
    .select('id, name, vertical, stage, diagnostic_score, tools_completed, founder_id')
    .in('id', startupIds)

  if (!startupsData) return { cohort, startups: [] }

  const founderIds = startupsData.map((s) => s.founder_id).filter(Boolean) as string[]
  const { data: profiles } = founderIds.length > 0
    ? await supabase.from('profiles').select('id, full_name').in('id', founderIds)
    : { data: [] }

  const profileMap: Record<string, string> = {}
  profiles?.forEach((p) => { if (p.full_name) profileMap[p.id] = p.full_name })

  const startups: StartupInCohort[] = startupsData.map((s) => {
    const assignment = assignments.find((a) => a.startup_id === s.id)
    return {
      assignment_id: assignment?.id || '',
      startup_id: s.id,
      name: s.name,
      founder_name: profileMap[s.founder_id] || 'Sin founder',
      vertical: s.vertical,
      stage: s.stage,
      diagnostic_score: s.diagnostic_score,
      tools_completed: s.tools_completed,
      assignment_status: assignment?.status || 'active',
    }
  })

  return { cohort, startups }
}
