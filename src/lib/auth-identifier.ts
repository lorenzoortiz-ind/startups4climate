/**
 * Login identifier normalization.
 *
 * Supabase auth requires an email format. To let admin_org users (e.g.
 * `amazonas101`) log in with just a short identifier, we transparently
 * append a default domain when the input does not contain "@". Founders
 * and other users with real emails keep working unchanged because their
 * input already contains "@".
 */
const DEFAULT_USERNAME_DOMAIN = 'startups4climate.org'

export function normalizeLoginIdentifier(input: string): string {
  const trimmed = input.trim().toLowerCase()
  if (!trimmed) return trimmed
  if (trimmed.includes('@')) return trimmed
  return `${trimmed}@${DEFAULT_USERNAME_DOMAIN}`
}
