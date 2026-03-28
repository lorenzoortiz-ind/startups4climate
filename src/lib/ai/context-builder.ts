export function buildStartupContext(
  startup: any,
  progress: any[] | null,
  profile?: any
): string {
  const parts: string[] = []

  if (startup) {
    parts.push(`STARTUP: ${startup.name || 'Sin nombre'}`)
    parts.push(`VERTICAL: ${startup.vertical || 'No definida'}`)
    parts.push(`PAIS: ${startup.country || 'No definido'}`)
    parts.push(`ETAPA: ${startup.stage || 'No definida'}`)
    parts.push(`SCORE DIAGNOSTICO: ${startup.diagnostic_score || 'No completado'}/100`)
    parts.push(`EQUIPO: ${startup.team_size || 'No definido'} personas`)
    parts.push(`MODELO DE INGRESOS: ${startup.revenue_model || 'No definido'}`)
    parts.push(`INGRESOS MENSUALES: ${startup.monthly_revenue ? '$' + startup.monthly_revenue + ' USD' : 'No reportados'}`)
    parts.push(`TAM: ${startup.tam_usd ? '$' + startup.tam_usd + ' USD' : 'No calculado'}`)
    parts.push(`CLIENTES PAGANDO: ${startup.has_paying_customers ? 'Si (' + startup.paying_customers_count + ')' : 'No'}`)
    if (startup.description) parts.push(`DESCRIPCION: ${startup.description}`)
    if (startup.website) parts.push(`WEBSITE: ${startup.website}`)
  } else {
    parts.push('No hay datos de la startup registrados aun.')
  }

  if (profile) {
    if (profile.full_name) parts.push(`FOUNDER: ${profile.full_name}`)
    if (profile.role) parts.push(`ROL DEL FOUNDER: ${profile.role}`)
  }

  const completedTools = progress?.filter((p) => p.completed) || []
  parts.push(`HERRAMIENTAS COMPLETADAS: ${completedTools.length}/30`)

  if (completedTools.length > 0) {
    const toolNames = completedTools.map((t) => t.tool_id).join(', ')
    parts.push(`HERRAMIENTAS COMPLETADAS (detalle): ${toolNames}`)
  }

  return parts.join('\n')
}
