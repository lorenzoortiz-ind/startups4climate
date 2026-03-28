export type ToolCategory =
  | 'Estrategia'
  | 'Mercado'
  | 'Cliente'
  | 'Producto'
  | 'Finanzas'
  | 'Ventas'
  | 'Marketing'
  | 'Modelo de Negocio'
  | 'Equipo'

export interface ToolDef {
  id: string
  name: string
  shortName: string
  description: string
  preambulo: string
  stage: 1 | 2 | 3 | 4
  stageName: string
  stageColor: string
  stageBg: string
  stageBorder: string
  category: ToolCategory
  estimatedTime: string
  outputs: string[]
  relatedService?: string
  relatedProduct?: string
  stepNumber: number
  transversal?: boolean
}

export const STAGE_META = {
  1: {
    name: 'Pre-incubación',
    subtitle: 'Ideación y Descubrimiento',
    description: 'Encuentra tu idea, entiende tu mercado y define a tu cliente ideal. Aquí naces como startup. +30 herramientas te acompañan en cada paso.',
    color: '#7C3AED',
    bg: 'rgba(124,58,237,0.07)',
    border: 'rgba(124,58,237,0.18)',
    phaseAdvice: 'Has completado la etapa de Pre-incubación. Antes de avanzar, es momento de salir a la calle: habla con al menos 20 personas que podrían ser tus clientes. No vendas nada todavía — solo escucha, observa y valida que el problema que identificaste es real y duele lo suficiente como para que alguien pague por resolverlo. La investigación primaria de mercado no se hace desde el escritorio.',
  },
  2: {
    name: 'Incubación',
    subtitle: 'Validación y Producto',
    description: 'Construye tu producto, cuantifica tu propuesta de valor y consigue tus primeros clientes reales. +30 herramientas disponibles.',
    color: '#059669',
    bg: 'rgba(5,150,105,0.07)',
    border: 'rgba(5,150,105,0.18)',
    phaseAdvice: 'Has completado la etapa de Incubación. Es hora de enfocarte al 100% en vender. Antes de buscar aceleración o inversión, necesitas demostrar tracción real: apunta a tener al menos 5 clientes pagando recurrentemente o $3,000-5,000 USD en ingresos mensuales recurrentes (MRR). Los inversores quieren ver que el mercado ya validó tu solución con dinero real, no solo con palabras de aliento. Sal a vender hoy.',
  },
  3: {
    name: 'Aceleración',
    subtitle: 'Modelo de Negocio y Crecimiento',
    description: 'Diseña tu modelo de negocio, define tu pricing y estructura tu proceso de ventas para crecer. +30 herramientas disponibles.',
    color: '#D97706',
    bg: 'rgba(217,119,6,0.07)',
    border: 'rgba(217,119,6,0.18)',
    phaseAdvice: 'Has completado la etapa de Aceleración. Ya tienes un modelo de negocio validado y clientes pagando. Ahora es el momento de profesionalizar tu operación: asegura que tu unit economics sea saludable (LTV/COCA > 3x), documenta tus procesos, y prepárate para escalar. Si estás considerando levantar capital, tu Data Room debería estar casi listo.',
  },
  4: {
    name: 'Escalamiento',
    subtitle: 'Producto, Plan y Fundraising',
    description: 'Valida tus supuestos, define tu MVP, demuestra tracción y prepárate para escalar. +30 herramientas disponibles.',
    color: '#0891B2',
    bg: 'rgba(8,145,178,0.07)',
    border: 'rgba(8,145,178,0.18)',
    phaseAdvice: 'Has completado todas las etapas del roadmap. Ahora tienes una startup con un producto validado, clientes reales, un modelo de negocio sólido y un plan de escalamiento. Es momento de ejecutar: escala tu equipo, automatiza lo que puedas, y si necesitas capital externo, ya tienes todo lo que un inversor necesita ver. Recuerda: la ejecución disciplinada es lo que separa a las startups que sobreviven de las que transforman industrias.',
  },
} as const

export const CATEGORIES: ToolCategory[] = [
  'Estrategia',
  'Mercado',
  'Cliente',
  'Producto',
  'Finanzas',
  'Ventas',
  'Marketing',
  'Modelo de Negocio',
  'Equipo',
]

const stageProps = (stage: 1 | 2 | 3 | 4) => ({
  stage,
  stageName: STAGE_META[stage].name,
  stageColor: STAGE_META[stage].color,
  stageBg: STAGE_META[stage].bg,
  stageBorder: STAGE_META[stage].border,
})

export const TOOLS: ToolDef[] = [
  // ── Stage 1: Pre-incubación (6 herramientas) ──────────────────
  {
    id: 'passion-purpose',
    name: 'Pasión, Propósito y Equipo Fundador',
    shortName: 'Propósito & Equipo',
    description:
      'Define por qué existes como startup, cuál es tu misión, tus valores y evalúa las brechas de tu equipo fundador.',
    preambulo:
      'Antes de buscar clientes o construir un producto, necesitas responder una pregunta fundamental: ¿por qué tú y por qué ahora? Los equipos fundadores más exitosos tienen una misión clara que los une, valores compartidos y habilidades complementarias. Esta herramienta te ayuda a articular tu razón de ser y a identificar las brechas en tu equipo que necesitas cerrar antes de avanzar.',
    ...stageProps(1),
    category: 'Equipo',
    estimatedTime: '20 min',
    outputs: ['Declaración de misión', 'Inventario de habilidades del equipo', 'Plan de reclutamiento de cofounders'],
    relatedService: 'Sesión estratégica 1:1',
    stepNumber: 0,
  },
  {
    id: 'market-segmentation',
    name: 'Segmentación de Mercado',
    shortName: 'Segmentación',
    description:
      'Explora y lista todos los posibles segmentos de mercado donde tu idea podría crear valor.',
    preambulo:
      'Uno de los errores más comunes de los founders es enamorarse de una sola idea de mercado sin explorar alternativas. La segmentación de mercado te obliga a pensar ampliamente antes de enfocarte. No estás eligiendo un mercado todavía — estás mapeando todas las oportunidades posibles para luego tomar una decisión informada. Este paso reduce enormemente el riesgo de construir algo para el mercado equivocado.',
    ...stageProps(1),
    category: 'Mercado',
    estimatedTime: '25 min',
    outputs: ['Matriz de segmentos potenciales', 'Criterios de evaluación por segmento', 'Top 6-12 oportunidades de mercado'],
    relatedProduct: 'Investigación de mercado profunda',
    stepNumber: 1,
  },
  {
    id: 'beachhead-market',
    name: 'Selección del mercado inicial',
    shortName: 'Mercado inicial',
    description:
      'Elige tu primer mercado de entrada — el nicho donde ganarás tu primera batalla antes de expandirte.',
    preambulo:
      'Tu mercado inicial es el primer mercado pequeño y específico donde vas a dominar. No es tu mercado final, es tu playa de desembarco. Los emprendedores que intentan atacar varios mercados a la vez dispersan recursos y terminan sin ganar en ninguno. Enfócate en un solo segmento donde puedas generar referencias boca a boca, aprender rápido y construir una posición dominante antes de expandirte.',
    ...stageProps(1),
    category: 'Mercado',
    estimatedTime: '20 min',
    outputs: ['Mercado inicial seleccionado', 'Justificación con criterios ponderados', 'Mapa de expansión futura'],
    stepNumber: 2,
  },
  {
    id: 'end-user-profile',
    name: 'Perfil del Usuario Final',
    shortName: 'Usuario Final',
    description:
      'Construye un perfil detallado de quién es el usuario final de tu producto en el mercado inicial.',
    preambulo:
      'Tu usuario final es la persona real que va a usar tu producto. No es lo mismo que tu cliente (quien paga). Necesitas entender profundamente quién es, qué hace, qué le frustra, cuáles son sus prioridades y cómo toma decisiones. Sin un perfil claro, terminarás diseñando un producto para todos y para nadie. Este paso se basa en investigación real, no en suposiciones.',
    ...stageProps(1),
    category: 'Cliente',
    estimatedTime: '25 min',
    outputs: ['Perfil demográfico y psicográfico', 'Mapa de dolores y necesidades', 'Contexto de uso del producto'],
    relatedService: 'Workshop de Customer Discovery',
    stepNumber: 3,
  },
  {
    id: 'tam-calculator',
    name: 'Cálculo del TAM (Mercado Total Direccionable)',
    shortName: 'Cálculo del TAM',
    description:
      'Calcula el tamaño de tu mercado en tu mercado inicial usando análisis bottom-up.',
    preambulo:
      'El TAM (Total Addressable Market) responde a la pregunta: ¿cuánto dinero podrías generar si capturaras el 100% de tu mercado inicial? Este número es fundamental para saber si vale la pena perseguir este mercado. Lo importante es hacerlo con un análisis bottom-up (contando clientes reales × precio), no top-down (tomando porcentajes de mercados globales). Los inversores ven esto inmediatamente y un TAM inflado destruye tu credibilidad.',
    ...stageProps(1),
    category: 'Finanzas',
    estimatedTime: '20 min',
    outputs: ['TAM del Mercado Inicial (USD)', 'Metodología bottom-up documentada', 'Número estimado de clientes potenciales'],
    stepNumber: 4,
  },
  {
    id: 'persona-profile',
    name: 'Perfil de la Persona',
    shortName: 'Persona',
    description:
      'Crea una persona concreta y representativa de tu mercado inicial con nombre, foto y contexto.',
    preambulo:
      'Una Persona es diferente de un perfil de usuario. Es UNA persona real (o muy realista) que representa a tu cliente ideal. Debe tener nombre, edad, cargo, frustraciones específicas y motivaciones. Cuando tu equipo tome decisiones de producto, diseño o marketing, deben preguntarse: ¿esto le serviría a [Nombre de tu Persona]? Es una herramienta de alineación interna poderosa.',
    ...stageProps(1),
    category: 'Cliente',
    estimatedTime: '15 min',
    outputs: ['Ficha de Persona completa', 'Día típico de la Persona', 'Criterios de decisión de compra'],
    stepNumber: 5,
  },

  // ── Stage 2: Incubación (8 herramientas) ──────────────────────
  {
    id: 'full-lifecycle-usecase',
    name: 'Caso de Uso del Ciclo Completo',
    shortName: 'Ciclo de Uso',
    description:
      'Mapea cómo tu Persona descubre, adquiere, usa y recomienda tu producto en un escenario de la vida real.',
    preambulo:
      'El Caso de Uso del Ciclo Completo (Full Life Cycle Use Case) describe la experiencia completa de tu usuario con tu producto, desde antes de conocerlo hasta que lo recomienda (o lo abandona). Este ejercicio expone las fricciones ocultas en tu propuesta: ¿cómo se entera? ¿Qué tan fácil es probarlo? ¿Qué pasa después de la primera compra? Es una prueba de estrés de tu modelo antes de invertir en desarrollo.',
    ...stageProps(2),
    category: 'Producto',
    estimatedTime: '25 min',
    outputs: ['Mapa completo del ciclo de uso', 'Puntos de fricción identificados', 'Oportunidades de mejora priorizadas'],
    stepNumber: 6,
  },
  {
    id: 'product-specification',
    name: 'Especificación de Alto Nivel del Producto',
    shortName: 'Especificación',
    description:
      'Define qué hace tu producto (y qué NO hace) con una brochure visual que alinee a todo el equipo.',
    preambulo:
      'Antes de escribir una línea de código o diseñar un prototipo, necesitas una especificación de alto nivel que deje claro: ¿qué hace el producto? ¿Qué NO hace? ¿Cuáles son sus features principales? Piénsalo como un brochure de producto: lo suficientemente claro para que un cliente lo entienda, pero sin entrar en detalles técnicos de implementación. Esto alinea al equipo y evita el scope creep.',
    ...stageProps(2),
    category: 'Producto',
    estimatedTime: '20 min',
    outputs: ['Brochure de producto', 'Lista de features principales', 'Límites explícitos del MVP'],
    relatedProduct: 'Diseño de producto MVP',
    stepNumber: 7,
  },
  {
    id: 'quantified-value-prop',
    name: 'Propuesta de Valor Cuantificada',
    shortName: 'Propuesta de Valor',
    description:
      'Cuantifica en números concretos el valor que tu producto entrega al cliente vs. la alternativa actual.',
    preambulo:
      'Decir "nuestro producto es mejor" no es suficiente. Necesitas cuantificar exactamente cuánto valor entregas: ¿cuánto dinero le ahorras a tu cliente? ¿Cuánto tiempo? ¿Cuánto riesgo reduces? Y lo más importante: ¿cómo se compara esto con lo que usan hoy (su status quo)? Un valor cuantificado te da poder en negociaciones de precio, en tu pitch a inversores y en tu copy de marketing.',
    ...stageProps(2),
    category: 'Estrategia',
    estimatedTime: '20 min',
    outputs: ['Valor cuantificado en USD/tiempo/riesgo', 'Comparación vs. status quo', 'ROI estimado para el cliente'],
    stepNumber: 8,
  },
  {
    id: 'first-10-customers',
    name: 'Mapa de los Primeros 10 Clientes',
    shortName: 'Primeros 10 Clientes',
    description:
      'Identifica con nombre y apellido a tus primeros 10 clientes potenciales en el mercado inicial.',
    preambulo:
      'Si no puedes listar 10 clientes potenciales reales con nombre y datos de contacto, probablemente no conoces bien tu mercado. Este ejercicio te obliga a pasar de lo abstracto a lo concreto. Estos 10 clientes son tu grupo de prueba, tus primeros evangelistas y la fuente de tus primeros ingresos. Si tu mercado inicial es correcto, encontrar 10 debería ser posible.',
    ...stageProps(2),
    category: 'Ventas',
    estimatedTime: '20 min',
    outputs: ['Lista de 10 clientes potenciales', 'Datos de contacto y contexto', 'Estrategia de primer acercamiento'],
    relatedService: 'Acompañamiento de ventas B2B',
    stepNumber: 9,
  },
  {
    id: 'core-competitive-position',
    name: 'Core y Posicionamiento Competitivo',
    shortName: 'Core & Competencia',
    description:
      'Define tu ventaja competitiva sostenible (Core) y mapea tu posición vs. la competencia.',
    preambulo:
      'Tu Core es aquello que haces significativamente mejor que cualquier competidor y que es muy difícil de replicar. No es una feature del producto — es algo más profundo: puede ser tu red de distribución, tu know-how técnico, tu data, o tu equipo. Sin un Core claro, cualquier competidor con más dinero te puede copiar. El posicionamiento competitivo, por otro lado, te ayuda a comunicar en qué ejes eres superior.',
    ...stageProps(2),
    category: 'Estrategia',
    estimatedTime: '20 min',
    outputs: ['Definición del Core', 'Mapa de posicionamiento competitivo', 'Barreras de entrada identificadas'],
    stepNumber: 10,
  },
  {
    id: 'lean-canvas',
    name: 'Lean Canvas de Impacto',
    shortName: 'Lean Canvas',
    description:
      'Modelo de negocio en una página que sintetiza tu problema, solución, métricas, canales y ventaja injusta.',
    preambulo:
      'El Lean Canvas es una herramienta de síntesis. Después de haber investigado tu mercado, definido tu Persona y cuantificado tu valor, es momento de ponerlo todo junto en una sola página. Este canvas adaptado incluye un bloque de impacto social/ambiental para startups que apuestan por generar un cambio positivo. Es tu GPS de negocio: debería evolucionar cada semana.',
    ...stageProps(2),
    category: 'Modelo de Negocio',
    estimatedTime: '30 min',
    outputs: ['Canvas completo en 1 página', 'Hipótesis clave identificadas', 'Métricas de validación'],
    stepNumber: 11,
    transversal: true,
  },
  {
    id: 'competitor-analysis',
    name: 'Análisis de Competidores',
    shortName: 'Competidores',
    description:
      'Mapea y analiza a tus competidores directos e indirectos para encontrar tu espacio único en el mercado.',
    preambulo:
      'Conocer a tu competencia no es opcional — es una ventaja estratégica. El análisis competitivo te ayuda a entender quién más está resolviendo el mismo problema (o uno similar), qué están haciendo bien, dónde fallan y dónde hay espacios sin cubrir. No se trata de copiar: se trata de diferenciarte con inteligencia. En LATAM, muchos mercados tienen competidores globales que no entienden las dinámicas locales — esa puede ser tu oportunidad.',
    ...stageProps(2),
    category: 'Estrategia',
    estimatedTime: '25 min',
    outputs: ['Mapa de competidores directos e indirectos', 'Matriz comparativa de features y precios', 'Espacios de oportunidad identificados'],
    stepNumber: 12,
  },
  {
    id: 'impact-metrics',
    name: 'Métricas de Impacto',
    shortName: 'Impacto',
    description:
      'Define y cuantifica el impacto social y ambiental de tu startup alineado a los Objetivos de Desarrollo Sostenible (ODS).',
    preambulo:
      'Medir el impacto no es un lujo — es una necesidad para startups que quieren atraer inversores de impacto, fondos climáticos y clientes conscientes. Las métricas de impacto te permiten demostrar con datos que tu startup genera un cambio positivo real. Alinearte a los ODS (Objetivos de Desarrollo Sostenible) de la ONU te da un framework reconocido internacionalmente para comunicar tu impacto. Los inversores cada vez más exigen métricas ESG y de impacto como parte de su due diligence.',
    ...stageProps(2),
    category: 'Estrategia',
    estimatedTime: '25 min',
    outputs: ['ODS alineados a tu startup', 'KPIs de impacto definidos', 'Framework de medición y reporte'],
    stepNumber: 13,
  },

  // ── Stage 3: Aceleración (8 herramientas) ──────────────────────
  {
    id: 'decision-making-unit',
    name: 'Unidad de Decisión del Cliente (DMU)',
    shortName: 'DMU',
    description:
      'Identifica todas las personas que influyen en la decisión de compra de tu producto.',
    preambulo:
      'Rara vez una sola persona decide comprar tu producto, especialmente en B2B. La DMU (Decision-Making Unit) incluye al champion (quien te apoya), al comprador económico (quien paga), al usuario final, a los influenciadores técnicos y a los posibles saboteadores. Si no mapeas este proceso, podrías convencer al usuario pero nunca cerrar la venta porque no hablaste con quien firma el cheque.',
    ...stageProps(3),
    category: 'Ventas',
    estimatedTime: '20 min',
    outputs: ['Mapa de la DMU con roles', 'Estrategia por stakeholder', 'Objeciones anticipadas por rol'],
    relatedService: 'Estrategia de ventas B2B',
    stepNumber: 14,
  },
  {
    id: 'customer-acquisition-process',
    name: 'Proceso de Adquisición de Clientes',
    shortName: 'Adquisición',
    description:
      'Mapea paso a paso cómo un cliente pasa de no conocerte a hacer su primera compra.',
    preambulo:
      'El proceso de adquisición de clientes es el camino que recorre tu Persona desde que se entera de tu existencia hasta que se convierte en cliente pagando. Incluye todas las etapas: awareness, interés, evaluación, compra y onboarding. Mapear esto te permite identificar dónde pierdes clientes potenciales y dónde invertir tus esfuerzos de marketing y ventas.',
    ...stageProps(3),
    category: 'Marketing',
    estimatedTime: '20 min',
    outputs: ['Funnel de adquisición completo', 'Tasas de conversión estimadas por etapa', 'Canales prioritarios identificados'],
    stepNumber: 15,
  },
  {
    id: 'business-model-design',
    name: 'Diseño del Modelo de Negocio',
    shortName: 'Modelo de Negocio',
    description:
      'Elige y estructura cómo tu startup genera, entrega y captura valor económico.',
    preambulo:
      'Tu modelo de negocio no es tu producto. Es la lógica económica detrás de tu empresa: ¿cómo generas ingresos? ¿Cobras suscripción, por uso, por licencia, por transacción? ¿Quién paga: el usuario final o un tercero? Elegir el modelo equivocado puede matar una buena idea. Este paso te ayuda a evaluar opciones (SaaS, marketplace, freemium, hardware-as-a-service, etc.) y elegir la que maximice valor para tu cliente y tu empresa.',
    ...stageProps(3),
    category: 'Modelo de Negocio',
    estimatedTime: '25 min',
    outputs: ['Modelo de negocio seleccionado', 'Flujos de ingresos mapeados', 'Estructura de costos estimada'],
    relatedProduct: 'Modelamiento financiero profesional',
    stepNumber: 16,
  },
  {
    id: 'pricing-framework',
    name: 'Framework de Pricing',
    shortName: 'Pricing',
    description:
      'Define tu estructura de precios basándote en el valor que entregas, no solo en tus costos.',
    preambulo:
      'El precio no es un número que inventas. Es una decisión estratégica que comunica el valor de tu producto. Cobrar muy poco destruye márgenes y credibilidad. Cobrar demasiado sin justificación mata conversiones. Este framework te guía a fijar precios basados en el valor que entregas al cliente (value-based pricing), que es la estrategia más sostenible para startups de impacto.',
    ...stageProps(3),
    category: 'Finanzas',
    estimatedTime: '20 min',
    outputs: ['Estructura de precios definida', 'Justificación basada en valor', 'Comparación con alternativas del mercado'],
    stepNumber: 17,
  },
  {
    id: 'ltv-unit-economics',
    name: 'Calculadora LTV y Unit Economics',
    shortName: 'LTV & Economics',
    description:
      'Calcula el Lifetime Value de tus clientes, COCA y las métricas financieras clave de tu negocio.',
    preambulo:
      'El LTV (Lifetime Value) es cuánto dinero genera un cliente durante toda su relación contigo. El COCA (Cost of Customer Acquisition) es cuánto te cuesta conseguir un cliente nuevo. La relación LTV/COCA debe ser mayor a 3x para que tu negocio sea sostenible. Esta herramienta te ayuda a calcular ambos y a entender si tu modelo económico funciona antes de escalar.',
    ...stageProps(3),
    category: 'Finanzas',
    estimatedTime: '25 min',
    outputs: ['LTV calculado', 'COCA calculado', 'Ratio LTV/COCA', 'Payback period', 'Dashboard de unit economics'],
    relatedProduct: 'Dashboard financiero para inversores',
    stepNumber: 18,
  },
  {
    id: 'sales-process-map',
    name: 'Mapa del Proceso de Ventas',
    shortName: 'Proceso de Ventas',
    description:
      'Diseña y documenta tu proceso de ventas de principio a fin para que sea repetible y escalable.',
    preambulo:
      'Una startup no puede depender de un vendedor estrella. Necesitas un proceso de ventas documentado, repetible y medible. Este mapa te lleva desde la prospección hasta el cierre, pasando por la calificación de leads, las demos, las propuestas y la negociación. Un buen proceso de ventas permite que cualquier persona nueva en tu equipo pueda empezar a vender rápidamente.',
    ...stageProps(3),
    category: 'Ventas',
    estimatedTime: '20 min',
    outputs: ['Pipeline de ventas documentado', 'Scripts y templates por etapa', 'KPIs de ventas definidos'],
    relatedService: 'Workshop de ventas para founders',
    stepNumber: 19,
  },
  {
    id: 'okr-tracker',
    name: 'OKR Tracker',
    shortName: 'OKRs',
    description:
      'Define y da seguimiento a tus Objetivos y Resultados Clave (OKRs) para mantener foco y alineación en tu equipo.',
    preambulo:
      'Los OKRs (Objectives and Key Results) son el sistema de gestión que usan las startups más exitosas del mundo para mantener al equipo alineado y enfocado. Un Objetivo es lo que quieres lograr (cualitativo y ambicioso). Los Key Results son cómo mides el progreso (cuantitativos y verificables). Sin OKRs claros, los equipos pierden foco, trabajan en prioridades desalineadas y no pueden medir si están avanzando o girando en círculos.',
    ...stageProps(3),
    category: 'Estrategia',
    estimatedTime: '20 min',
    outputs: ['OKRs del trimestre definidos', 'Key Results con métricas medibles', 'Cadencia de seguimiento semanal'],
    stepNumber: 20,
  },
  {
    id: 'regulatory-compass',
    name: 'Brújula Regulatoria',
    shortName: 'Regulatorio',
    description:
      'Identifica las regulaciones clave que aplican a tu startup según tu vertical y país en LATAM.',
    preambulo:
      'En Latinoamérica, el entorno regulatorio puede ser tu mayor aliado o tu peor enemigo. Dependiendo de tu vertical (fintech, healthtech, cleantech, agritech, etc.) y del país donde operes, existen regulaciones específicas que pueden bloquear tu lanzamiento o darte una ventaja competitiva si las entiendes antes que la competencia. Esta herramienta te ayuda a mapear el panorama regulatorio de tu industria, identificar licencias y permisos necesarios, y anticipar cambios regulatorios que podrían afectar tu negocio.',
    ...stageProps(3),
    category: 'Estrategia',
    estimatedTime: '25 min',
    outputs: ['Mapa regulatorio por país y vertical', 'Licencias y permisos requeridos', 'Riesgos regulatorios y plan de mitigación'],
    stepNumber: 21,
  },

  // ── Stage 4: Escalamiento (8 herramientas) ─────────────────────
  {
    id: 'key-assumptions',
    name: 'Identificación y Testeo de Supuestos',
    shortName: 'Supuestos Clave',
    description:
      'Lista y prioriza los supuestos más riesgosos de tu negocio, y diseña experimentos rápidos para validarlos.',
    preambulo:
      'Todo plan de negocio está basado en supuestos: "los clientes pagarán X", "el costo de adquisición será Y", "la retención será Z". El problema es que la mayoría de estos supuestos no se validan hasta que ya es demasiado tarde. Esta herramienta te ayuda a identificar tus supuestos más riesgosos (aquellos que si están equivocados, destruyen tu negocio) y a diseñar experimentos simples y baratos para testearlos rápidamente.',
    ...stageProps(4),
    category: 'Estrategia',
    estimatedTime: '25 min',
    outputs: ['Lista priorizada de supuestos', 'Diseño de experimentos de validación', 'Criterios de éxito/fracaso por supuesto'],
    stepNumber: 22,
  },
  {
    id: 'mvbp-definition',
    name: 'Definición del MVBP (Producto Mínimo Viable)',
    shortName: 'MVBP',
    description:
      'Define la versión más pequeña de tu producto que entrega valor suficiente para que el cliente pague.',
    preambulo:
      'El MVBP (Minimum Viable Business Product) no es un prototipo roto. Es la versión más simple de tu producto que: (1) el cliente percibe como valiosa, (2) el cliente está dispuesto a pagar por ella, y (3) puedes entregar con tus recursos actuales. La clave está en "Business" — no basta con que funcione técnicamente, tiene que funcionar como negocio. Resiste la tentación de agregar más features.',
    ...stageProps(4),
    category: 'Producto',
    estimatedTime: '25 min',
    outputs: ['Definición del MVBP', 'Features incluidas y excluidas', 'Roadmap de iteración post-lanzamiento'],
    relatedProduct: 'Desarrollo de MVP/prototipo',
    stepNumber: 23,
  },
  {
    id: 'traction-validation',
    name: 'Validación de Tracción: ¿Los clientes pagan?',
    shortName: 'Validación',
    description:
      'Demuestra con evidencia real que los clientes quieren, usan y pagan por tu producto.',
    preambulo:
      'Este es el momento de la verdad: ¿los clientes realmente pagan por tu producto? No LOIs, no "sí, me parece interesante", no promesas — dinero real cambiando de manos. La validación de tracción es la métrica más importante para cualquier startup en esta etapa. Si los clientes no pagan, algo en tu cadena (producto, precio, mercado, mensaje) necesita cambiar. Mejor descubrirlo ahora que después de levantar capital.',
    ...stageProps(4),
    category: 'Ventas',
    estimatedTime: '20 min',
    outputs: ['Evidencia de ventas reales', 'Métricas de retención y satisfacción', 'Testimoniales y casos de éxito'],
    stepNumber: 24,
  },
  {
    id: 'product-plan-scaling',
    name: 'Plan de Producto y Mercados Adyacentes',
    shortName: 'Plan & Expansión',
    description:
      'Desarrolla tu roadmap de producto y mapea los mercados adyacentes para tu expansión futura.',
    preambulo:
      'Ahora que dominaste tu mercado inicial, es momento de planificar tu expansión. El Product Plan define las próximas versiones de tu producto y las features que necesitarás. Los Mercados Adyacentes (Follow-on Markets) son los segmentos donde puedes expandirte aprovechando tu Core y la credibilidad ganada. La expansión debe ser estratégica: cada nuevo mercado debe ser más fácil de ganar que el anterior.',
    ...stageProps(4),
    category: 'Producto',
    estimatedTime: '25 min',
    outputs: ['Roadmap de producto a 12-18 meses', 'TAM de mercados adyacentes', 'Estrategia de bowling alley'],
    stepNumber: 25,
  },
  {
    id: 'pitch-deck-builder',
    name: 'Pitch Deck Builder',
    shortName: 'Pitch Deck',
    description:
      'Construye tu narrativa para inversores con los 12 slides esenciales que demuestran tracción y visión.',
    preambulo:
      'Un pitch deck no es una presentación de producto. Es una narrativa que convence a un inversor de que tu startup tiene un mercado grande, un equipo capaz, una ventaja competitiva real y un plan creíble para crecer. Los mejores pitch decks cuentan una historia: hay un problema grave → existe una oportunidad → tu equipo tiene la solución → ya tienes tracción → con inversión, puedes escalar.',
    ...stageProps(4),
    category: 'Marketing',
    estimatedTime: '45 min',
    outputs: ['12 slides estructurados', 'Narrative arc validado', 'Talking points por slide'],
    relatedService: 'Revisión y coaching de Pitch Deck',
    stepNumber: 26,
    transversal: true,
  },
  {
    id: 'cap-table-fundraising',
    name: 'Cap Table y Estrategia de Fundraising',
    shortName: 'Cap Table',
    description:
      'Simula tu estructura accionaria en múltiples rondas y define tu estrategia de levantamiento de capital.',
    preambulo:
      'El Cap Table (tabla de capitalización) muestra quién posee qué porcentaje de tu empresa. Antes de aceptar cualquier inversión, necesitas simular cómo se diluirá tu participación en cada ronda futura. Una mala estructura de cap table puede hacerte perder el control de tu empresa o desmotivar a cofounders clave. Esta herramienta te ayuda a planificar estratégicamente y a entender las implicaciones de cada decisión de financiamiento.',
    ...stageProps(4),
    category: 'Finanzas',
    estimatedTime: '30 min',
    outputs: ['Cap table multi-ronda', 'Dilución proyectada por ronda', 'Estrategia de fundraising documentada'],
    relatedProduct: 'Modelo financiero para inversores',
    relatedService: 'Asesoría de fundraising',
    stepNumber: 27,
  },
  {
    id: 'data-room-builder',
    name: 'Data Room Builder',
    shortName: 'Data Room',
    description:
      'Organiza y prepara tu Data Room virtual con todos los documentos que un inversor necesita para hacer due diligence.',
    preambulo:
      'El Data Room es la carpeta organizada con todos los documentos que un inversor revisa antes de decidir si invierte en tu startup. Incluye financieros, legales, métricas, contratos, cap table, proyecciones y más. Tener un Data Room listo y profesional antes de levantar capital te da una ventaja enorme: demuestra seriedad, acelera el proceso de due diligence y genera confianza. Los founders que improvisan su Data Room a última hora pierden semanas valiosas y proyectan desorganización.',
    ...stageProps(4),
    category: 'Finanzas',
    estimatedTime: '30 min',
    outputs: ['Checklist de documentos del Data Room', 'Estructura de carpetas organizada', 'Estado de completitud por documento'],
    stepNumber: 28,
  },
  {
    id: 'financial-model-builder',
    name: 'Modelo Financiero',
    shortName: 'Modelo Financiero',
    description:
      'Construye proyecciones financieras a 3-5 años con los supuestos clave que los inversores quieren ver.',
    preambulo:
      'Un modelo financiero no es un ejercicio de Excel — es la historia numérica de tu startup. Los inversores quieren ver que entiendes cómo tu negocio genera dinero, cuáles son tus drivers de crecimiento, cuándo alcanzarás breakeven y cuánto capital necesitas para llegar ahí. Un buen modelo financiero incluye proyecciones de ingresos, costos, flujo de caja y métricas clave (MRR, ARR, burn rate, runway). No necesita ser perfecto, pero sí coherente con tu tracción actual y tus supuestos de crecimiento.',
    ...stageProps(4),
    category: 'Finanzas',
    estimatedTime: '35 min',
    outputs: ['Proyecciones financieras a 3-5 años', 'Estado de resultados proyectado', 'Análisis de breakeven y runway'],
    relatedProduct: 'Modelo financiero para inversores',
    stepNumber: 29,
  },
]

export const TOOLS_BY_STAGE: Record<1 | 2 | 3 | 4, ToolDef[]> = {
  1: TOOLS.filter((t) => t.stage === 1),
  2: TOOLS.filter((t) => t.stage === 2),
  3: TOOLS.filter((t) => t.stage === 3),
  4: TOOLS.filter((t) => t.stage === 4),
}

export const TRANSVERSAL_TOOLS: ToolDef[] = TOOLS.filter((t) => t.transversal)

export function getToolById(id: string): ToolDef | undefined {
  return TOOLS.find((t) => t.id === id)
}

export const TOOL_TO_PROFILE_MAP: Record<string, (data: any) => Partial<any>> = {
  'tam-calculator': (data) => ({ tam_usd: data.totalTAM }),
  'ltv-unit-economics': (data) => ({ ltv: data.ltv, cac: data.cac }),
  'pricing-framework': (data) => ({ revenue_model: data.selectedModel }),
  'traction-validation': (data) => ({
    has_paying_customers: (data.payingCustomers || 0) > 0,
    paying_customers_count: data.payingCustomers || 0,
    monthly_revenue: data.mrr || 0,
  }),
  'passion-purpose': (data) => ({ team_size: data.teamMembers?.length }),
}
