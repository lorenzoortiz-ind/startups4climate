import { createClient, SupabaseClient } from '@supabase/supabase-js'

let _supabase: SupabaseClient | null = null

export function getSupabase(): SupabaseClient {
  if (!_supabase) {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://placeholder.supabase.co'
    const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'placeholder-key'
    _supabase = createClient(supabaseUrl, supabaseAnonKey)
  }
  return _supabase
}

// Convenience export for client-side usage
export const supabase = {
  from: (table: string) => getSupabase().from(table),
}

export interface DiagnosticLead {
  source: 'startups4climate'
  nombre: string
  email: string
  empresa: string
  pais: string
  score: number
  perfil: 'early_stage' | 'growing' | 'investment_ready'
  respuestas: Record<string, number>
  score_por_dimension: {
    modelo: number
    equipo: number
    traccion: number
    financiero: number
  }
  synced_brevo: boolean
}
