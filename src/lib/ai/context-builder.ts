export function buildStartupContext(
  startup: any,
  progress: any[] | null
): string {
  if (!startup) return 'No hay datos de la startup registrados aun.'

  const completedTools = progress?.filter((p) => p.completed) || []

  return `
STARTUP: ${startup.name}
VERTICAL: ${startup.vertical}
PAIS: ${startup.country}
ETAPA: ${startup.stage || 'No definida'}
SCORE DIAGNOSTICO: ${startup.diagnostic_score || 'No completado'}/100
EQUIPO: ${startup.team_size || 'No definido'} personas
MODELO DE INGRESOS: ${startup.revenue_model || 'No definido'}
INGRESOS MENSUALES: ${startup.monthly_revenue ? '$' + startup.monthly_revenue + ' USD' : 'No reportados'}
TAM: ${startup.tam_usd ? '$' + startup.tam_usd + ' USD' : 'No calculado'}
CLIENTES PAGANDO: ${startup.has_paying_customers ? 'Si (' + startup.paying_customers_count + ')' : 'No'}
HERRAMIENTAS COMPLETADAS: ${completedTools.length}/30
DESCRIPCION: ${startup.description || 'No provista'}
  `.trim()
}
