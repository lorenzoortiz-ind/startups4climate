interface StartupData {
  name?: string
  vertical?: string
  country?: string
  stage?: string
  diagnostic_score?: number
  team_size?: number
  revenue_model?: string
  monthly_revenue?: number
  tam_usd?: number
  has_paying_customers?: boolean
  paying_customers_count?: number
  description?: string
  website?: string
}

interface ToolProgress {
  tool_id: string
  completed: boolean
  data?: Record<string, unknown>
}

interface ProfileData {
  id: string
  email: string
  role?: string
  full_name?: string
  org_id?: string | null
  startup_name?: string
  stage?: string
  diagnostic_score?: number
}

export function buildStartupContext(
  startup: StartupData | null,
  progress: ToolProgress[] | null,
  profile?: ProfileData | null,
  userContext?: Record<string, unknown>
): string {
  const parts: string[] = []

  // Always include founder info from profile first
  if (profile) {
    if (profile.full_name) parts.push(`FOUNDER: ${profile.full_name}`)
    if (profile.role) parts.push(`ROL DEL FOUNDER: ${profile.role}`)
  }

  if (startup) {
    parts.push(`STARTUP: ${startup.name || 'Sin nombre'}`)
    parts.push(`VERTICAL: ${startup.vertical || 'No definida'}`)
    parts.push(`PAIS: ${startup.country || 'No definido'}`)
    parts.push(`ETAPA: ${startup.stage || profile?.stage || 'No definida'}`)
    parts.push(`SCORE DIAGNOSTICO: ${startup.diagnostic_score || profile?.diagnostic_score || 'No completado'}/100`)
    parts.push(`EQUIPO: ${startup.team_size || 'No definido'} personas`)
    parts.push(`MODELO DE INGRESOS: ${startup.revenue_model || 'No definido'}`)
    parts.push(`INGRESOS MENSUALES: ${startup.monthly_revenue ? '$' + startup.monthly_revenue + ' USD' : 'No reportados'}`)
    parts.push(`TAM: ${startup.tam_usd ? '$' + startup.tam_usd + ' USD' : 'No calculado'}`)
    parts.push(`CLIENTES PAGANDO: ${startup.has_paying_customers ? 'Si (' + startup.paying_customers_count + ')' : 'No'}`)
    if (startup.description) parts.push(`DESCRIPCION: ${startup.description}`)
    if (startup.website) parts.push(`WEBSITE: ${startup.website}`)
  } else if (profile) {
    // Fallback: use profile data when startups table has no row
    if (profile.startup_name) {
      parts.push(`STARTUP: ${profile.startup_name}`)
    } else {
      parts.push('STARTUP: Sin nombre')
    }
    if (profile.stage) parts.push(`ETAPA: ${profile.stage}`)
    if (profile.diagnostic_score) parts.push(`SCORE DIAGNÓSTICO: ${profile.diagnostic_score}/100`)
    parts.push('(Datos detallados de la startup aún no registrados. Pide al founder que complete su perfil para darte más contexto.)')
  } else {
    parts.push('No hay datos de la startup ni del founder registrados aún.')
  }

  const completedTools = progress?.filter((p) => p.completed) || []
  parts.push(`HERRAMIENTAS COMPLETADAS: ${completedTools.length}/30`)

  if (completedTools.length > 0) {
    const toolNames = completedTools.map((t) => t.tool_id).join(', ')
    parts.push(`HERRAMIENTAS COMPLETADAS (detalle): ${toolNames}`)
  }

  // Merge client-side profile context (from localStorage / auth)
  // This ensures the AI has profile data even if Supabase tables are empty
  if (userContext && Object.keys(userContext).length > 0) {
    if (userContext.vertical) parts.push(`VERTICAL (perfil): ${userContext.vertical}`)
    if (userContext.country) parts.push(`PAIS (perfil): ${userContext.country}`)
    if (userContext.role) parts.push(`ROL: ${userContext.role}`)
    if (userContext.experience) parts.push(`EXPERIENCIA: ${userContext.experience}`)
    if (userContext.descripcion || userContext.description) parts.push(`DESCRIPCION (perfil): ${userContext.descripcion || userContext.description}`)
    if (userContext.teamSize) parts.push(`EQUIPO (perfil): ${userContext.teamSize} personas`)
    if (userContext.website) parts.push(`WEBSITE (perfil): ${userContext.website}`)
    if (userContext.linkedin) parts.push(`LINKEDIN: ${userContext.linkedin}`)
    if (userContext.startup) parts.push(`STARTUP (nombre): ${userContext.startup}`)
    if (userContext.name) parts.push(`FOUNDER (nombre): ${userContext.name}`)
  }

  return parts.join('\n')
}
