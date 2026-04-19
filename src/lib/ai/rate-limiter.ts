import { createSupabaseServer } from '@/lib/supabase-server'

// Checks whether a user has exceeded their daily AI conversation quota.
// Queries Supabase server-side (with user auth via SSR cookies) to count today's conversations.
// The actual inline check in /api/ai/chat/route.ts uses the same pattern but avoids
// this helper because it already has a server client available in context.
export async function checkRateLimit(
  userId: string,
  maxPerDay: number = 30
): Promise<boolean> {
  const supabase = await createSupabaseServer()
  const today = new Date().toISOString().split('T')[0]

  const { count } = await supabase
    .from('ai_conversations')
    .select('*', { count: 'exact', head: true })
    .eq('user_id', userId)
    .gte('created_at', today + 'T00:00:00Z')

  return (count || 0) < maxPerDay
}
