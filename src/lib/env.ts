import { z } from 'zod'

const schema = z.object({
  NEXT_PUBLIC_SUPABASE_URL: z.string().url(),
  NEXT_PUBLIC_SUPABASE_ANON_KEY: z.string().min(1),
  GEMINI_API_KEY: z.string().min(1),
  RESEND_API_KEY: z.string().min(1),
})

// Validate at import time and log clearly — don't throw so Next.js build succeeds.
// Use requireEnv() at request time for hard failures with descriptive errors.
const _parsed = schema.safeParse(process.env)
if (!_parsed.success && typeof window === 'undefined') {
  const msgs = _parsed.error.issues.map((i) => `  ${String(i.path[0])}: ${i.message}`).join('\n')
  console.error(`[S4C ENV] Variables de entorno faltantes o inválidas:\n${msgs}\n→ Revisa Vercel → Settings → Environment Variables`)
}

export const serverEnv = {
  GEMINI_API_KEY: process.env.GEMINI_API_KEY ?? '',
  RESEND_API_KEY: process.env.RESEND_API_KEY ?? '',
  NEXT_PUBLIC_SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL ?? '',
  NEXT_PUBLIC_SUPABASE_ANON_KEY: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? '',
}

export function requireEnv<K extends keyof typeof serverEnv>(key: K): string {
  const val = serverEnv[key]
  if (!val) {
    throw new Error(
      `[S4C] Variable de entorno requerida no configurada: ${key}\n` +
      `→ Revisa Vercel → Settings → Environment Variables`
    )
  }
  return val
}
