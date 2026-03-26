import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

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
