import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

export const dynamic = 'force-dynamic'
export const runtime = 'nodejs'

/**
 * Lightweight health probe for UptimeRobot or similar.
 * Checks: app responsive + Supabase reachable.
 * Public (no auth). Returns 200 if healthy, 503 otherwise.
 */
export async function GET() {
  const started = Date.now()
  const checks: Record<string, { ok: boolean; ms?: number; error?: string }> = {
    app: { ok: true },
  }

  try {
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      { auth: { persistSession: false, autoRefreshToken: false } },
    )
    const t0 = Date.now()
    // Cheap query: just check the anon role can reach the DB
    const { error } = await supabase.from('news_items').select('id', { head: true, count: 'exact' }).limit(1)
    checks.supabase = error
      ? { ok: false, error: error.message, ms: Date.now() - t0 }
      : { ok: true, ms: Date.now() - t0 }
  } catch (err) {
    checks.supabase = { ok: false, error: err instanceof Error ? err.message : 'unknown' }
  }

  const allOk = Object.values(checks).every((c) => c.ok)
  return NextResponse.json(
    {
      status: allOk ? 'ok' : 'degraded',
      total_ms: Date.now() - started,
      checks,
      timestamp: new Date().toISOString(),
    },
    { status: allOk ? 200 : 503 },
  )
}
