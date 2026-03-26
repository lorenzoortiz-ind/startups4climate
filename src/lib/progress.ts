import { supabase } from './supabase'

const PROGRESS_KEY = 's4c_tool_progress'

export interface ToolProgressEntry {
  completed: boolean
  completedAt: string | null
  data: Record<string, unknown>
  reportGenerated: boolean
  lastSaved: string | null
}

export type ProgressMap = Record<string, ToolProgressEntry>

function getAll(): Record<string, ProgressMap> {
  if (typeof window === 'undefined') return {}
  try {
    return JSON.parse(localStorage.getItem(PROGRESS_KEY) || '{}')
  } catch {
    return {}
  }
}

function saveAll(all: Record<string, ProgressMap>) {
  localStorage.setItem(PROGRESS_KEY, JSON.stringify(all))
}

export function getProgress(userId: string): ProgressMap {
  return getAll()[userId] || {}
}

export function saveToolData(userId: string, toolId: string, data: Record<string, unknown>) {
  const all = getAll()
  if (!all[userId]) all[userId] = {}
  const existing = all[userId][toolId]
  all[userId][toolId] = {
    completed: existing?.completed ?? false,
    completedAt: existing?.completedAt ?? null,
    reportGenerated: existing?.reportGenerated ?? false,
    data,
    lastSaved: new Date().toISOString(),
  }
  saveAll(all)
}

export function markToolCompleted(userId: string, toolId: string) {
  const all = getAll()
  if (!all[userId]) all[userId] = {}
  const existing = all[userId][toolId]
  all[userId][toolId] = {
    data: existing?.data ?? {},
    reportGenerated: existing?.reportGenerated ?? false,
    lastSaved: existing?.lastSaved ?? new Date().toISOString(),
    completed: true,
    completedAt: new Date().toISOString(),
  }
  saveAll(all)
}

export function markReportGenerated(userId: string, toolId: string) {
  const all = getAll()
  if (!all[userId]) all[userId] = {}
  const existing = all[userId][toolId]
  all[userId][toolId] = {
    data: existing?.data ?? {},
    completed: existing?.completed ?? false,
    completedAt: existing?.completedAt ?? null,
    lastSaved: existing?.lastSaved ?? null,
    reportGenerated: true,
  }
  saveAll(all)
}

export function getToolData(userId: string, toolId: string): Record<string, unknown> {
  return getProgress(userId)[toolId]?.data ?? {}
}

export function countCompleted(userId: string): number {
  const p = getProgress(userId)
  return Object.values(p).filter((e) => e.completed).length
}

/* ─── Supabase sync functions ─── */

/**
 * Upsert tool data to Supabase `tool_data` table.
 * Fires in background — callers should `.catch(() => {})`.
 */
export async function syncToolDataToSupabase(
  userId: string,
  toolId: string,
  data: Record<string, unknown>
) {
  const { error } = await supabase
    .from('tool_data')
    .upsert(
      {
        user_id: userId,
        tool_id: toolId,
        data,
        last_saved: new Date().toISOString(),
      },
      { onConflict: 'user_id,tool_id' }
    )
  if (error) throw error
}

/**
 * Load tool data from Supabase `tool_data` table.
 */
export async function loadToolDataFromSupabase(
  userId: string,
  toolId: string
): Promise<Record<string, unknown> | null> {
  const { data, error } = await supabase
    .from('tool_data')
    .select('data')
    .eq('user_id', userId)
    .eq('tool_id', toolId)
    .single()

  if (error || !data) return null
  return (data.data as Record<string, unknown>) ?? null
}

/**
 * Sync completion status to Supabase `tool_data` table.
 */
export async function syncProgressToSupabase(
  userId: string,
  toolId: string,
  completed: boolean,
  reportGenerated: boolean
) {
  const { error } = await supabase
    .from('tool_data')
    .upsert(
      {
        user_id: userId,
        tool_id: toolId,
        completed,
        report_generated: reportGenerated,
        last_saved: new Date().toISOString(),
      },
      { onConflict: 'user_id,tool_id' }
    )
  if (error) throw error
}
