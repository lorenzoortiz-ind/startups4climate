export type ToolCategory =
  | 'Estrategia'
  | 'Mercado'
  | 'Producto'
  | 'Finanzas'
  | 'Ventas'
  | 'Marketing'
  | 'Equipo'

export interface ToolDef {
  id: string
  name: string
  shortName: string
  description: string
  guidingQuestion: string
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
    color: '#FF6B4A',
    bg: 'rgba(255,107,74,0.07)',
    border: 'rgba(255,107,74,0.18)',
    phaseAdvice: 'Has completado la etapa de Pre-incubación. Antes de avanzar, es momento de salir a la calle: habla con al menos 20 personas que podrían ser tus clientes. No vendas nada todavía — solo escucha, observa y valida que el problema que identificaste es real y duele lo suficiente como para que alguien pague por resolverlo. La investigación primaria de mercado no se hace desde el escritorio.',
  },
  2: {
    name: 'Incubación',
    subtitle: 'Validación y Producto',
    description: 'Construye tu producto, cuantifica tu propuesta de valor y consigue tus primeros clientes reales. +30 herramientas disponibles.',
    color: '#0D9488',
    bg: 'rgba(13,148,136,0.07)',
    border: 'rgba(13,148,136,0.18)',
    phaseAdvice: 'Has completado la etapa de Incubación. Es hora de enfocarte al 100% en vender. Antes de buscar aceleración o inversión, necesitas demostrar tracción real: apunta a tener al menos 5 clientes pagando recurrentemente o $3,000-5,000 USD en ingresos mensuales recurrentes (MRR). Los inversores quieren ver que el mercado ya validó tu solución con dinero real, no solo con palabras de aliento. Sal a vender hoy.',
  },
  3: {
    name: 'Aceleración',
    subtitle: 'Modelo de Negocio y Crecimiento',
    description: 'Diseña tu modelo de negocio, define tu pricing y estructura tu proceso de ventas para crecer. +30 herramientas disponibles.',
    color: '#2A222B',
    bg: 'rgba(42,34,43,0.07)',
    border: 'rgba(42,34,43,0.18)',
    phaseAdvice: 'Has completado la etapa de Aceleración. Ya tienes un modelo de negocio validado y clientes pagando. Ahora es el momento de profesionalizar tu operación: asegura que tu unit economics sea saludable (LTV/COCA > 3x), documenta tus procesos, y prepárate para escalar. Si estás considerando levantar capital, tu Data Room debería estar casi listo.',
  },
  4: {
    name: 'Escalamiento',
    subtitle: 'Producto, Plan y Fundraising',
    description: 'Valida tus supuestos, define tu MVP, demuestra tracción y prepárate para escalar. +30 herramientas disponibles.',
    color: '#0D9488',
    bg: 'rgba(13,148,136,0.07)',
    border: 'rgba(13,148,136,0.18)',
    phaseAdvice: 'Has completado todas las etapas del roadmap. Ahora tienes una startup con un producto validado, clientes reales, un modelo de negocio sólido y un plan de escalamiento. Es momento de ejecutar: escala tu equipo, automatiza lo que puedas, y si necesitas capital externo, ya tienes todo lo que un inversor necesita ver. Recuerda: la ejecución disciplinada es lo que separa a las startups que sobreviven de las que transforman industrias.',
  },
} as const

export const CATEGORIES: ToolCategory[] = [
  'Estrategia',
  'Mercado',
  'Producto',
  'Finanzas',
  'Ventas',
  'Marketing',
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
    guidingQuestion: '¿Por qué existe tu startup y quién la impulsa?',
    preambulo:
      'Las startups más exitosas nacen de founders que conectan su pasión personal con un problema real del mercado. Esta herramienta te ayuda a articular por qué tú y tu equipo son las personas indicadas para resolver este problema. Define tu norte antes de construir cualquier cosa.',
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
    guidingQuestion: '¿Quiénes son tus potenciales clientes y cómo los agrupas?',
    preambulo:
      'No puedes venderle a todo el mundo al mismo tiempo. Segmentar tu mercado te permite identificar los grupos de clientes con mayor potencial y enfocar tus recursos donde más impacto tendrán. Prioriza con datos, no con intuición.',
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
    guidingQuestion: '¿Cuál es el primer mercado que vas a conquistar?',
    preambulo:
      'Tu mercado inicial es el primer segmento donde vas a dominar antes de expandirte. Elegir bien este mercado es la diferencia entre crecer rápido y quedarse estancado. Selecciona un nicho lo suficientemente pequeño para ganar, pero con potencial para escalar.',
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
    guidingQuestion: '¿Quién usa tu producto en el día a día?',
    preambulo:
      'Conocer a tu usuario final va más allá de la demografía. Necesitas entender sus frustraciones diarias, sus aspiraciones y cómo toman decisiones. Construye un perfil detallado que guíe cada decisión de producto.',
    ...stageProps(1),
    category: 'Mercado',
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
    guidingQuestion: '¿Cuánto vale la oportunidad de mercado total?',
    preambulo:
      'El Mercado Total Direccionable es el ingreso máximo que podrías generar si capturaras el 100% de tu mercado objetivo. Los inversores lo usan para evaluar si tu oportunidad es lo suficientemente grande. Calcula tu TAM con un enfoque bottom-up para tener cifras creíbles.',
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
    guidingQuestion: '¿Quién es tu cliente ideal y qué lo motiva?',
    preambulo:
      'Una persona es la representación semificticia de tu cliente ideal basada en investigación real. Te permite tomar decisiones de producto, marketing y ventas centradas en las necesidades reales de quien va a pagar. Construye tu persona con datos, no suposiciones.',
    ...stageProps(1),
    category: 'Mercado',
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
    guidingQuestion: '¿Cómo es la experiencia completa de tu usuario con tu producto?',
    preambulo:
      'Mapear el ciclo completo de uso te muestra exactamente cómo tu cliente descubre, adopta y obtiene valor de tu producto. Este ejercicio revela puntos de fricción y oportunidades de mejora que no son visibles desde dentro. Diseña la experiencia que tus usuarios merecen.',
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
    guidingQuestion: '¿Qué debe hacer tu producto y qué no?',
    preambulo:
      'Antes de escribir una línea de código, define qué debe hacer tu producto y qué queda fuera del alcance. Una especificación clara alinea a tu equipo, reduce el desperdicio y acelera el desarrollo. Documenta las funcionalidades esenciales para tu primera versión.',
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
    guidingQuestion: '¿Cuánto valor concreto generas para tu cliente?',
    preambulo:
      'Tu propuesta de valor cuantificada traduce los beneficios de tu producto en números concretos para tu cliente. En lugar de decir que tu solución es mejor, demuestras cuánto tiempo, dinero o esfuerzo ahorra. Los clientes compran resultados, no características.',
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
    guidingQuestion: '¿Quiénes serán tus primeros clientes reales?',
    preambulo:
      'Tus primeros 10 clientes definen el ADN comercial de tu startup. Cada uno te enseña algo nuevo sobre cómo vender, qué funciona y qué necesitas ajustar. Planifica cómo los vas a encontrar, convencer y retener.',
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
    guidingQuestion: '¿Qué te hace diferente y difícil de copiar?',
    preambulo:
      'Tu ventaja competitiva es aquello que haces mejor que cualquier alternativa en el mercado y que es difícil de replicar. Sin una posición competitiva clara, compites solo por precio. Identifica tu fortaleza central y construye tu estrategia alrededor de ella.',
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
    guidingQuestion: '¿Cómo se ve tu modelo de negocio en una sola página?',
    preambulo:
      'El Lean Canvas condensa tu modelo de negocio en una sola página. Es la herramienta más usada por aceleradoras como Y Combinator y Techstars para evaluar startups rápidamente. Complétalo en 20 minutos y revísalo cada vez que pivotees.',
    ...stageProps(2),
    category: 'Estrategia',
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
    guidingQuestion: '¿Quiénes compiten contigo y cómo te diferencias?',
    preambulo:
      'Conocer a tus competidores no se trata de copiarlos, sino de encontrar espacios donde puedes ser mejor. Analiza sus fortalezas, debilidades y estrategias para posicionarte de forma diferenciada. El mercado ya está educando a tus clientes.',
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
    guidingQuestion: '¿Qué impacto social o ambiental genera tu startup?',
    preambulo:
      'Medir tu impacto social o ambiental con métricas concretas te diferencia ante inversores de impacto y organismos internacionales. Los fondos como BID Lab o Acumen exigen evidencia medible. Define tus indicadores de impacto desde el primer día.',
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
    guidingQuestion: '¿Quién decide la compra y quién influye en esa decisión?',
    preambulo:
      'En ventas B2B, rara vez una sola persona toma la decisión de compra. La Unidad de Toma de Decisiones incluye a quien aprueba el presupuesto, quien influye técnicamente y quien usa el producto. Mapea a cada actor para diseñar tu estrategia de venta.',
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
    guidingQuestion: '¿Cómo vas a conseguir clientes de forma repetible?',
    preambulo:
      'Un proceso de adquisición bien diseñado te permite conseguir clientes de forma predecible y escalable. Define cada paso desde que un prospecto te conoce hasta que se convierte en cliente que paga. La repetibilidad es lo que separa una startup de un proyecto.',
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
    guidingQuestion: '¿Cómo genera dinero tu startup?',
    preambulo:
      'Tu modelo de negocio explica cómo tu startup crea, entrega y captura valor económico. Es el motor que convierte tu solución en un negocio sostenible. Diseña un modelo que sea simple, escalable y alineado con cómo pagan tus clientes.',
    ...stageProps(3),
    category: 'Estrategia',
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
    guidingQuestion: '¿Cuánto deberías cobrar y por qué?',
    preambulo:
      'El precio correcto maximiza tus ingresos sin perder clientes. Un framework de pricing te ayuda a encontrar el punto donde tus clientes perciben que el valor supera el costo. Experimenta con diferentes modelos hasta encontrar el que acelere tu crecimiento.',
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
    guidingQuestion: '¿Cuánto vale cada cliente a lo largo del tiempo?',
    preambulo:
      'El Valor de Vida del Cliente mide cuánto ingreso genera cada cliente durante toda su relación con tu startup. Junto con el Costo de Adquisición, estos indicadores te dicen si tu negocio es viable a largo plazo. Si el valor de vida es al menos 3 veces mayor que el costo de adquisición, vas por buen camino.',
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
    guidingQuestion: '¿Cuáles son los pasos para cerrar una venta?',
    preambulo:
      'Un proceso de ventas documentado convierte el arte de vender en un sistema replicable. Cada etapa tiene actividades específicas, herramientas y métricas de conversión. Construye tu pipeline y mide qué funciona en cada paso.',
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
    guidingQuestion: '¿Cuáles son tus objetivos clave y cómo los mides?',
    preambulo:
      'Los Objetivos y Resultados Clave son el sistema que usan empresas como Google e Intel para alinear a todos los equipos hacia las metas más importantes. Define pocos objetivos ambiciosos con resultados medibles para cada trimestre. Lo que no se mide, no se mejora.',
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
    guidingQuestion: '¿Qué regulaciones afectan a tu startup?',
    preambulo:
      'Ignorar el entorno regulatorio puede matar una startup con tracción. Identifica las regulaciones, licencias y normativas que aplican a tu industria y mercado antes de que se conviertan en un obstáculo. La prevención es más barata que la corrección.',
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
    guidingQuestion: '¿Cuáles son tus hipótesis más riesgosas?',
    preambulo:
      'Toda startup se construye sobre hipótesis que aún no han sido validadas. Identificar tus supuestos más riesgosos y diseñar experimentos para testearlos te ahorra meses de trabajo en la dirección equivocada. Valida antes de escalar.',
    ...stageProps(4),
    category: 'Estrategia',
    estimatedTime: '25 min',
    outputs: ['Lista priorizada de supuestos', 'Diseño de experimentos de validación', 'Criterios de éxito/fracaso por supuesto'],
    stepNumber: 22,
  },
  {
    id: 'mvbp-definition',
    name: 'Definición del MVBP (Producto Mínimo Viable)',
    shortName: 'Producto Mín. Viable',
    description:
      'Define la versión más pequeña de tu producto que entrega valor suficiente para que el cliente pague.',
    guidingQuestion: '¿Cuál es la versión más simple que puedes lanzar?',
    preambulo:
      'Tu Producto Mínimo Viable es la versión más simple de tu solución que entrega valor real a tus primeros clientes. No se trata de lanzar algo incompleto, sino de enfocarte en las funcionalidades que resuelven el problema central. Construye solo lo necesario para aprender del mercado.',
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
    guidingQuestion: '¿Están tus clientes dispuestos a pagar?',
    preambulo:
      'La validación definitiva de tu startup es que los clientes paguen por tu solución. Las métricas de tracción como ingresos recurrentes, tasa de retención y crecimiento orgánico son la evidencia que los inversores necesitan ver. Demuestra con datos que tu negocio funciona.',
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
    guidingQuestion: '¿Hacia dónde crece tu producto después del primer mercado?',
    preambulo:
      'Después de dominar tu mercado inicial, necesitas un plan claro para expandirte a mercados adyacentes y nuevos segmentos. Esta hoja de ruta define las fases de crecimiento de tu producto y los recursos necesarios en cada etapa. Crece con estrategia, no con improvisación.',
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
    guidingQuestion: '¿Cómo cuentas la historia de tu startup a inversores?',
    preambulo:
      'Tu pitch deck es la presentación que abre puertas con inversores, aceleradoras y socios estratégicos. Las mejores presentaciones cuentan una historia clara en 10 a 12 diapositivas siguiendo la estructura validada por fondos como Sequoia y Andreessen Horowitz. Cada slide debe responder una pregunta clave sobre tu startup.',
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
    guidingQuestion: '¿Cómo se distribuye la propiedad de tu empresa?',
    preambulo:
      'La tabla de capitalización muestra quién es dueño de qué porcentaje de tu empresa y cómo cambia con cada ronda de inversión. Una cap table bien estructurada desde el inicio evita conflictos futuros y facilita el fundraising. Planifica tu dilución antes de necesitar capital.',
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
    guidingQuestion: '¿Tienes toda la documentación lista para inversores?',
    preambulo:
      'El data room es el repositorio organizado de todos los documentos que un inversor necesita revisar antes de invertir. Tenerlo listo antes de empezar a levantar capital demuestra profesionalismo y acelera el proceso de due diligence. Prepara tu documentación como si mañana tuvieras una reunión con un fondo.',
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
    guidingQuestion: '¿Cuáles son tus proyecciones financieras a 3 años?',
    preambulo:
      'Tu modelo financiero proyecta ingresos, costos y flujo de caja para los próximos 3 a 5 años. Es la herramienta que los inversores usan para evaluar la viabilidad económica de tu startup. Construye proyecciones realistas basadas en supuestos que puedas defender.',
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

/**
 * Phase-specific preambulos for transversal tools.
 * Each transversal tool appears in every stage with context tailored to that phase.
 */
export const TRANSVERSAL_PREAMBULOS: Record<string, Record<1 | 2 | 3 | 4, string>> = {
  'lean-canvas': {
    1: 'En la etapa de Pre-incubación, tu Lean Canvas es un borrador de hipótesis. Enfócate en definir claramente el problema que quieres resolver, los segmentos de clientes que has identificado y tu propuesta de valor única. No te preocupes por tener todas las respuestas — lo importante es documentar tus supuestos iniciales para poder validarlos en campo. Este canvas será tu punto de partida para las entrevistas de descubrimiento.',
    2: 'En Incubación ya tienes datos reales de tu mercado y tu Persona definida. Es momento de actualizar tu Lean Canvas con información validada: tu propuesta de valor cuantificada, los canales que realmente funcionan, las métricas clave que estás midiendo y tu estructura de costos real. El canvas debe reflejar lo que has aprendido, no lo que asumías al inicio.',
    3: 'En Aceleración, tu Lean Canvas debe reflejar un modelo de negocio en funcionamiento. Actualiza tu estructura de ingresos con datos reales de pricing y LTV, refina tus canales basándote en el COCA real, y documenta tu ventaja competitiva (Core) validada. Este canvas es tu mapa ejecutivo para escalar — cada bloque debe tener métricas reales detrás.',
    4: 'En Escalamiento, tu Lean Canvas se convierte en tu herramienta de planificación estratégica. Actualiza los bloques con tus métricas de tracción demostradas, incluye los mercados adyacentes que planeas atacar, y asegura que tu estructura de costos refleje la realidad de escalar. Este canvas debe ser lo suficientemente sólido para compartir con inversores como resumen ejecutivo de tu negocio.',
  },
  'pitch-deck-builder': {
    1: 'En Pre-incubación, tu Pitch Deck es un ejercicio de claridad narrativa. No necesitas métricas de tracción todavía — enfócate en articular el problema que resuelves, el tamaño de la oportunidad y por qué tu equipo es el indicado. Este deck es útil para aplicar a programas de incubación, concursos de ideas y para alinear a tu equipo cofundador sobre la visión.',
    2: 'En Incubación, tu Pitch Deck debe incorporar los datos que has generado: tu TAM calculado, tu propuesta de valor cuantificada, tu Persona y tus primeros aprendizajes de mercado. Es ideal para aplicar a aceleradoras, competencias de startups y primeras conversaciones con mentores e inversores ángel.',
    3: 'En Aceleración, tu Pitch Deck debe demostrar tracción y un modelo de negocio validado. Incluye métricas reales: clientes pagando, LTV/COCA, MRR, tasas de retención y tu proceso de ventas documentado. Este es el deck que usarás para levantar tu primera ronda de inversión o para cerrar alianzas estratégicas clave.',
    4: 'En Escalamiento, tu Pitch Deck es tu arma para levantar capital de crecimiento. Debe contar una historia convincente con métricas sólidas de tracción, unit economics saludables, un plan de expansión claro y proyecciones financieras respaldadas por datos reales. Cada slide debe demostrar que invertir en tu startup es una oportunidad de alto retorno.',
  },
}

/**
 * Returns the transversal tools adapted for a specific stage.
 * Each gets a stage-specific preambulo and a shortName with stage label.
 */
export function getTransversalToolsForStage(stageNum: 1 | 2 | 3 | 4): (ToolDef & { transversalStage: number })[] {
  return TRANSVERSAL_TOOLS.map((tool) => ({
    ...tool,
    transversalStage: stageNum,
  }))
}

export function getTransversalPreambulo(toolId: string, stage: 1 | 2 | 3 | 4): string | undefined {
  return TRANSVERSAL_PREAMBULOS[toolId]?.[stage]
}

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
