import type { SupabaseClient } from '@supabase/supabase-js'

/**
 * AI endpoint rate limits per role, per hour.
 * - founder:      30 req/h   (protects Gemini quota at 200-founder scale)
 * - admin_org:    200 req/h  (higher headroom for cohort managers)
 * - superadmin:   bypass     (operations / debugging)
 */
const LIMITS: Record<string, number> = {
  founder: 30,
  admin_org: 200,
  superadmin: Number.POSITIVE_INFINITY,
}

const WINDOW_MS = 60 * 60 * 1000 // 1 hour

export type AIEndpoint = 'chat' | 'feedback'
export type RateLimitRole = 'founder' | 'admin_org' | 'superadmin'

export interface RateLimitResult {
  allowed: boolean
  remaining: number
  resetAt: Date
  limit: number
}

/**
 * Check the per-user hourly usage of an AI endpoint and, if allowed, log a
 * new row into `ai_usage`. Uses the authenticated supabase client since the
 * project does not currently expose SUPABASE_SERVICE_ROLE_KEY — the RLS
 * policies on `ai_usage` restrict SELECT/INSERT to the owning user_id which
 * is enough for rate-limiting (the user cannot forge rows for another user).
 *
 * Fail-open on DB errors: if we cannot read/write the usage table we let the
 * request through rather than blocking a legit user on a transient outage.
 * All such errors are logged with the [S4C AI] prefix.
 */
export async function checkAndLogAIUsage(
  supabase: SupabaseClient,
  userId: string,
  endpoint: AIEndpoint,
  role: RateLimitRole
): Promise<RateLimitResult> {
  const now = new Date()
  const windowStart = new Date(now.getTime() - WINDOW_MS)
  const resetAt = new Date(now.getTime() + WINDOW_MS)
  const limit = LIMITS[role] ?? LIMITS.founder

  // Superadmin bypass
  if (!Number.isFinite(limit)) {
    return { allowed: true, remaining: Number.POSITIVE_INFINITY, resetAt, limit }
  }

  const { count, error: countError } = await supabase
    .from('ai_usage')
    .select('id', { count: 'exact', head: true })
    .eq('user_id', userId)
    .eq('endpoint', endpoint)
    .gte('created_at', windowStart.toISOString())

  if (countError) {
    console.error('[S4C AI] ai_usage count failed, failing open:', countError.message)
    return { allowed: true, remaining: limit, resetAt, limit }
  }

  const used = count ?? 0
  if (used >= limit) {
    return { allowed: false, remaining: 0, resetAt, limit }
  }

  const { error: insertError } = await supabase
    .from('ai_usage')
    .insert({ user_id: userId, endpoint })

  if (insertError) {
    // Don't block the request if logging fails — just observe.
    console.error('[S4C AI] ai_usage insert failed:', insertError.message)
  }

  return {
    allowed: true,
    remaining: Math.max(0, limit - used - 1),
    resetAt,
    limit,
  }
}

/**
 * Build the standard set of rate-limit headers for a response.
 */
export function rateLimitHeaders(result: RateLimitResult): Record<string, string> {
  const headers: Record<string, string> = {
    'X-RateLimit-Limit': Number.isFinite(result.limit) ? String(result.limit) : 'unlimited',
    'X-RateLimit-Remaining': Number.isFinite(result.remaining)
      ? String(result.remaining)
      : 'unlimited',
    'X-RateLimit-Reset': String(Math.floor(result.resetAt.getTime() / 1000)),
  }
  if (!result.allowed) {
    const retryAfter = Math.max(1, Math.ceil((result.resetAt.getTime() - Date.now()) / 1000))
    headers['Retry-After'] = String(retryAfter)
  }
  return headers
}
