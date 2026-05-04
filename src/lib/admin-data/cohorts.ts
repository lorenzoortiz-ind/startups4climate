/**
 * Admin data loaders for cohort views. Encapsulates the demo/real branching
 * so admin pages don't have to know whether they're rendering fixtures or
 * Supabase data — they just call load*() with the auth context and render
 * whatever comes back.
 */
import { supabase } from '@/lib/supabase'
import { DEMO_COHORTS } from '@/lib/demo/admin-fixtures'

export interface CohortRow {
  id: string
  name: string
  description: string | null
  start_date: string | null
  end_date: string | null
  status: string
  created_at: string
  startup_count: number
  pending_requests_count: number
}

const DEMO_COHORTS_NORMALIZED: CohortRow[] = DEMO_COHORTS.map((c) => ({
  id: c.id,
  name: c.name,
  description: c.description,
  start_date: c.startDate,
  end_date: c.endDate,
  status: c.status,
  created_at: c.startDate,
  startup_count: c.startupIds.length,
  pending_requests_count: 0,
}))

interface LoadCohortsArgs {
  isDemo: boolean
  orgId: string | null | undefined
}

export async function loadCohorts({ isDemo, orgId }: LoadCohortsArgs): Promise<CohortRow[]> {
  if (isDemo) return DEMO_COHORTS_NORMALIZED
  if (!orgId) return []

  const { data, error } = await supabase
    .from('cohorts_with_counts')
    .select('id, name, description, start_date, end_date, status, created_at, startup_count, pending_requests_count')
    .eq('org_id', orgId)
    .order('created_at', { ascending: false })

  if (error) throw error
  return (data ?? []) as CohortRow[]
}
