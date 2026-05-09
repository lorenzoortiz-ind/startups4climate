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
  stage: 0 | 1 | 2 | 3 | 4
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
  0: {
    name: 'Ideación',
    subtitle: 'Descubrimiento y Problema',
    description: 'Descubre un problema real que vale la pena resolver, entiende a quién le duele y formula tu primera hipótesis de solución. El punto de partida de todo.',
    color: '#16A34A',
    bg: 'rgba(22,163,74,0.07)',
    border: 'rgba(22,163,74,0.18)',
    phaseAdvice: 'Has completado el módulo de Ideación. Ahora tienes un problema validado, un cliente hipotético y una primera hipótesis de solución. Antes de avanzar a Pre-incubación, revisa que la evidencia de tus entrevistas sea sólida: ¿al menos 3 personas te han confirmado el problema con sus propias palabras? Si es así, estás listo para comenzar a construir.',
  },
  1: {
    name: 'Pre-incubación',
    subtitle: 'Validación y Descubrimiento',
    description: 'Encuentra tu idea, entiende tu mercado y define a tu cliente ideal. Aquí naces como startup. +30 herramientas te acompañan en cada paso.',
    color: '#DA4E24',
    bg: 'rgba(218,78,36,0.07)',
    border: 'rgba(218,78,36,0.18)',
    phaseAdvice: 'Has completado la etapa de Pre-incubación. Antes de avanzar, es momento de salir a la calle: habla con al menos 20 personas que podrían ser tus clientes. No vendas nada todavía — solo escucha, observa y valida que el problema que identificaste es real y duele lo suficiente como para que alguien pague por resolverlo. La investigación primaria de mercado no se hace desde el escritorio.',
  },
  2: {
    name: 'Incubación',
    subtitle: 'Validación y Producto',
    description: 'Construye tu producto, cuantifica tu propuesta de valor y consigue tus primeros clientes reales. +30 herramientas disponibles.',
    color: '#1F77F6',
    bg: 'rgba(31,119,246,0.07)',
    border: 'rgba(31,119,246,0.18)',
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
    color: '#1F77F6',
    bg: 'rgba(31,119,246,0.07)',
    border: 'rgba(31,119,246,0.18)',
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

const stageProps = (stage: 0 | 1 | 2 | 3 | 4) => ({
  stage,
  stageName: STAGE_META[stage].name,
  stageColor: STAGE_META[stage].color,
  stageBg: STAGE_META[stage].bg,
  stageBorder: STAGE_META[stage].border,
})

export const TOOLS: ToolDef[] = [
  // ── Stage 0: Ideación (5 herramientas) ──────────────────────────
  {
    id: 'problem-exploration',
    name: 'Exploración de Problemas',
    shortName: 'Exploración',
    description:
      'Mapea fricciones, ineficiencias e injusticias en un territorio que conoces bien. Genera tu lista de problemas candidatos.',
    guidingQuestion: '¿Qué le resulta difícil, costoso, lento o injusto a la gente en este contexto?',
    preambulo:
      'Antes de buscar soluciones, necesitas ver el mundo con otros ojos. Esta herramienta te entrena para observar tu entorno como un campo fértil de problemas reales — no como consumidor, sino como investigador. Los mejores negocios nacen de problemas que todos sufren pero nadie se ha tomado en serio resolver.',
    ...stageProps(0),
    category: 'Estrategia',
    estimatedTime: '30 min',
    outputs: [
      'Lista de 5-8 problemas candidatos con contexto',
      'Descripción del territorio explorado',
      'Perfil de quién vive cada problema',
    ],
    stepNumber: 0,
  },
  {
    id: 'problem-selection',
    name: 'Selección del Problema',
    shortName: 'Selección',
    description:
      'Evalúa cada problema candidato en 4 dimensiones y elige el que tiene mayor potencial de convertirse en un negocio real.',
    guidingQuestion: '¿Cuál de los problemas identificados merece convertirse en tu startup?',
    preambulo:
      'No todos los problemas son iguales. Algunos duelen mucho pero son difíciles de monetizar; otros son comercialmente atractivos pero no generan impacto. Esta herramienta te da un proceso riguroso para elegir con criterio, no con intuición.',
    ...stageProps(0),
    category: 'Estrategia',
    estimatedTime: '25 min',
    outputs: [
      '1 problema seleccionado con justificación',
      'Matriz de evaluación ICE completada',
      'Razones documentadas para descartar los demás',
    ],
    stepNumber: 1,
  },
  {
    id: 'empathy-map',
    name: 'Mapa de Empatía',
    shortName: 'Empatía',
    description:
      'Describe a la persona que vive el problema desde 4 dimensiones: qué piensa, qué ve, qué dice/hace, qué escucha.',
    guidingQuestion: '¿Qué está viviendo la persona que tiene este problema?',
    preambulo:
      'El mapa de empatía te fuerza a salir de tu perspectiva y entrar en la del afectado. Es el paso que separa a los founders que diseñan para sí mismos de los que diseñan para el cliente. Sin este shift, construirás lo que tú quieres, no lo que el mundo necesita.',
    ...stageProps(0),
    category: 'Mercado',
    estimatedTime: '30 min',
    outputs: [
      'Mapa de empatía completo en 4 dimensiones',
      'Perfil del afectado con nombre ficticio',
      '3 insights síntesis derivados del mapa',
    ],
    stepNumber: 2,
  },
  {
    id: 'interview-guide',
    name: 'Guía de Entrevista',
    shortName: 'Entrevistas',
    description:
      'Diseña preguntas que revelan la verdad sobre el problema. Documenta los hallazgos de al menos 3 entrevistas reales.',
    guidingQuestion: '¿Qué necesito preguntarle a alguien para saber si este problema es real y vale la pena resolver?',
    preambulo:
      'Las preguntas mal diseñadas confirman lo que ya crees. Las preguntas bien diseñadas te dicen la verdad aunque sea incómoda. Esta herramienta te enseña los principios de The Mom Test (Fitzpatrick): nunca preguntes si les gusta tu idea, pregunta sobre su comportamiento pasado.',
    ...stageProps(0),
    category: 'Mercado',
    estimatedTime: '45 min',
    outputs: [
      'Guía de 6-8 preguntas abiertas validadas',
      'Registro de hallazgos de 3+ entrevistas',
      'Patrones confirmados y supuestos refutados',
    ],
    stepNumber: 3,
  },
  {
    id: 'initial-idea',
    name: 'Idea Inicial',
    shortName: 'Idea Inicial',
    description:
      'Sintetiza todo tu trabajo de Ideación en una hipótesis articulada: problema, cliente, solución y supuesto más riesgoso.',
    guidingQuestion: '¿Cuál es tu hipótesis de negocio más sólida dado lo que has descubierto?',
    preambulo:
      'La Idea Inicial no es un pitch — es un documento de trabajo. Articula lo que crees con la evidencia que tienes y señala claramente lo que aún no sabes. Es el punto de partida para Pre-incubación: lo que llevas contigo al comenzar a construir.',
    ...stageProps(0),
    category: 'Estrategia',
    estimatedTime: '35 min',
    outputs: [
      'Hipótesis de problema con evidencia',
      'Perfil del cliente con frecuencia y soluciones actuales',
      'Hipótesis de solución con ventaja diferencial',
      'Supuesto más riesgoso identificado',
    ],
    stepNumber: 4,
  },

  // ── Stage 1: Pre-incubación (6 herramientas) ──────────────────
  {
    id: 'passion-purpose',
    name: 'Pasión, Propósito y Equipo Fundador',
    shortName: 'Propósito & Equipo',
    description:
      'Articula el propósito fundacional de tu startup con el Golden Circle (WHY/HOW/WHAT), evalúa las 4 dimensiones del equipo fundador e identifica las 2 brechas más críticas para cubrirlas.',
    guidingQuestion: '¿Por qué existe tu startup y tiene tu equipo lo que se necesita para ganar?',
    preambulo:
      'Las startups más exitosas nacen de founders que saben exactamente por qué existen. El Golden Circle (Simon Sinek) ordena este trabajo en tres niveles: WHY (propósito), HOW (diferenciación), WHAT (oferta). Antes de hablar de mercados, el equipo debe tener autoconsciencia honesta de sus gaps — porque los equipos mueren de lo que no saben que no saben.',
    ...stageProps(1),
    category: 'Equipo',
    estimatedTime: '20 min',
    outputs: ['Declaración de propósito en 3 oraciones (WHY / HOW / WHAT)', 'Matriz de evaluación del equipo en 4 dimensiones', 'Plan de cierre de las 2 brechas más críticas'],
    relatedService: 'Sesión estratégica 1:1',
    stepNumber: 5,
  },
  {
    id: 'market-segmentation',
    name: 'Segmentación de Mercado',
    shortName: 'Segmentación',
    description:
      'Explora 6–12 segmentos posibles usando los 4 parámetros de Aulet (DE Step 1) antes de comprometerte con uno. No puedes elegir bien si no ves todas las opciones.',
    guidingQuestion: '¿Quiénes son todos los grupos que podrían beneficiarse de tu solución?',
    preambulo:
      'El error más común en esta etapa es elegir el primer mercado por familiaridad, no por potencial estratégico. Aulet (DE Step 1) enseña que debes explorar 6–12 segmentos antes de comprometerte con uno. Para cada segmento: describe al cliente, el contexto de uso, cómo resuelve hoy el problema y qué resultado busca.',
    ...stageProps(1),
    category: 'Mercado',
    estimatedTime: '25 min',
    outputs: ['Mapa de 6–12 segmentos con descripción y ejemplo real por segmento', 'Ejemplo de cliente real (con nombre imaginable) por segmento', 'Primera clasificación por atractivo relativo sin compromiso aún'],
    relatedProduct: 'Investigación de mercado profunda',
    stepNumber: 6,
  },
  {
    id: 'beachhead-market',
    name: 'Selección del mercado inicial',
    shortName: 'Mercado inicial',
    description:
      'Elige tu beachhead evaluando cada segmento en los 7 criterios de Aulet (DE Step 2) y justifica el rechazo de las 2 alternativas más tentadoras.',
    guidingQuestion: '¿Cuál es el primer mercado que puedes dominar y que abre puertas a mercados más grandes?',
    preambulo:
      'Elegir el beachhead es la decisión más importante de los primeros 18 meses. Aulet (DE Step 2) define 7 criterios para hacerla con rigor: dolor reconocido, presupuesto y autoridad, acceso actual, efecto dominó, masa crítica, competencia manejable y si ganar aquí abre lo que viene. La tentación de "apuntar a todos" es el camino más seguro al fracaso.',
    ...stageProps(1),
    category: 'Mercado',
    estimatedTime: '20 min',
    outputs: ['Beachhead seleccionado con scoring en 7 criterios de Aulet', 'Justificación del rechazo de las 2 alternativas principales', 'Primeras implicaciones para el End User Profile (01.4)'],
    stepNumber: 7,
  },
  {
    id: 'end-user-profile',
    name: 'Perfil del Usuario Final',
    shortName: 'Usuario Final',
    description:
      'Construye el perfil del End User en 6 dimensiones con evidencia empírica y distingue explícitamente entre End User, Economic Buyer y Champion (Aulet, DE Step 3).',
    guidingQuestion: '¿Quién usa tu producto en el día a día y cómo difiere de quien paga la compra?',
    preambulo:
      'El usuario final (quien usa el producto) frecuentemente no es quien paga ni quien decide la compra. Confundirlos es el error más costoso en ventas B2B. Aulet (DE Step 3) exige construir este perfil con datos observados — no con supuestos proyectados del founder. Las 6 dimensiones: demografía relevante, flujo de trabajo actual, motivaciones y miedos profesionales, métricas por las que es evaluado, herramientas que ya usa, nivel de sofisticación técnica.',
    ...stageProps(1),
    category: 'Mercado',
    estimatedTime: '25 min',
    outputs: ['Perfil del End User en 6 dimensiones con fuentes de evidencia', 'Mapa explícito End User / Economic Buyer / Champion', '3 preguntas de entrevista para confirmar los datos más débiles del perfil'],
    relatedService: 'Workshop de Customer Discovery',
    stepNumber: 8,
  },
  {
    id: 'tam-calculator',
    name: 'Cálculo del TAM (Mercado Total Direccionable)',
    shortName: 'Cálculo del TAM',
    description:
      'Calcula el TAM de tu beachhead con el método bottom-up de Aulet (DE Step 4): cuenta clientes reales posibles × gasto anual estimado, con supuestos y fuentes documentados.',
    guidingQuestion: '¿Cuántos clientes reales existen en tu beachhead y cuánto pagarían cada año?',
    preambulo:
      'El TAM bottom-up (Aulet, DE Step 4) parte de contar cuántas unidades de cliente existen con tu perfil específico y multiplicarlas por el gasto anual estimado. Esta metodología produce cifras creíbles, no aspiracionales. El rango ideal para un beachhead: $10M–$100M — suficiente para ser viable, suficientemente pequeño para ser ganado.',
    ...stageProps(1),
    category: 'Finanzas',
    estimatedTime: '20 min',
    outputs: ['Modelo TAM bottom-up: N clientes × precio unitario anual con fuentes citadas', 'Rango bajo / central / alto con análisis de sensibilidad', 'Los 2 supuestos con mayor impacto en el resultado identificados'],
    stepNumber: 9,
  },
  {
    id: 'persona-profile',
    name: 'Perfil de la Persona',
    shortName: 'Persona',
    description:
      'Sintetiza la investigación de Pre-incubación en una Persona con nombre, día típico en 3 momentos, 3 miedos profesionales y una cita textual de entrevista real (Aulet, DE Step 5).',
    guidingQuestion: '¿Quién es específicamente la persona que vive el problema que resuelves?',
    preambulo:
      'La Persona es el artefacto de cierre del módulo Pre-incubación (Aulet, DE Step 5). Obliga a consolidar semanas de investigación en una representación tan concreta que todo el equipo toma decisiones con la misma imagen mental. Una buena Persona tiene nombre, tiene miedo, tiene deadline, tiene jefe. Una mala Persona es demografía sin vida.',
    ...stageProps(1),
    category: 'Mercado',
    estimatedTime: '15 min',
    outputs: ['Tarjeta de Persona: nombre, foto representativa, datos demográficos mínimos', 'Día típico en 3 momentos clave donde el producto podría aparecer', '3 miedos profesionales + cita textual de entrevista real o la más representativa'],
    stepNumber: 10,
  },

  // ── Stage 2: Incubación (8 herramientas) ──────────────────────
  {
    id: 'full-lifecycle-usecase',
    name: 'Caso de Uso del Ciclo Completo',
    shortName: 'Ciclo de Uso',
    description:
      'Mapea las 6 etapas del ciclo de vida del cliente con tu producto (Aulet, DE Step 6): descubrimiento, compra, instalación, primer uso, uso continuo y mantenimiento. Las fricciones ocultas están en las etapas que ignoras.',
    guidingQuestion: '¿Cómo experimenta tu Persona el ciclo completo con tu producto, desde que lo descubre hasta que lo mantiene?',
    preambulo:
      'El Step 6 de Aulet revela los problemas de adopción que matan startups perfectamente funcionales: el producto funciona, pero nadie puede instalarlo o nadie sabe que existe. Mapear las 6 etapas completas —no solo la de "uso"— es donde aparecen las fricciones reales que definen si tu producto sobrevive o no.',
    ...stageProps(2),
    category: 'Producto',
    estimatedTime: '25 min',
    outputs: ['Mapa de 6 etapas con actores, pasos y fricciones identificadas por etapa', 'Oportunidades de mejora priorizadas por impacto en adopción', 'Las 2 etapas más críticas para el éxito del onboarding'],
    stepNumber: 11,
  },
  {
    id: 'product-specification',
    name: 'Especificación de Alto Nivel del Producto',
    shortName: 'Especificación',
    description:
      'Define las 3–5 funciones nucleares de tu producto con la mejora cuantificada vs. el status quo ("10x better" de Aulet, DE Step 7) y las exclusiones explícitas con justificación estratégica.',
    guidingQuestion: '¿Qué hace tu producto, cuánto mejor lo hace que la alternativa actual, y qué queda deliberadamente fuera?',
    preambulo:
      'La Especificación no es una lista de features — es un contrato de valor (Aulet, DE Step 7). Aulet introduce el principio "10x better": si no puedes articular por qué tu producto es al menos 10x mejor en una dimensión que importa al cliente, tu propuesta de valor no supera la inercia del status quo. Las exclusiones explícitas son tan importantes como lo que incluyes.',
    ...stageProps(2),
    category: 'Producto',
    estimatedTime: '20 min',
    outputs: ['Funciones nucleares (3–5) con mejora cuantificada vs. alternativa actual del cliente', 'Exclusiones explícitas con justificación estratégica de cada corte', 'Diagrama de bloques funcionales de alto nivel (sin UX — solo arquitectura funcional)'],
    relatedProduct: 'Diseño de producto MVP',
    stepNumber: 12,
  },
  {
    id: 'quantified-value-prop',
    name: 'Propuesta de Valor Cuantificada',
    shortName: 'Propuesta de Valor',
    description:
      'Cuantifica el valor que entregas usando el Value Proposition Canvas (Osterwalder) y el formato Aulet: "Para [Persona], [producto] hace [job] [X% mejor / $Y ahorrado / Z horas menos] comparado con [alternativa actual]".',
    guidingQuestion: '¿En cuánto dinero, tiempo o riesgo concreto se traduce el valor que entregas a tu cliente?',
    preambulo:
      '"Ahorramos tiempo" no es una propuesta de valor — es una aspiración. Aulet (DE Step 8) exige cuantificación en las unidades del cliente: dinero, horas, errores, vidas — no en las del producto (velocidad, cobertura, features). El Value Proposition Canvas de Osterwalder estructura el trabajo en Jobs-to-be-done, Pains y Gains.',
    ...stageProps(2),
    category: 'Estrategia',
    estimatedTime: '20 min',
    outputs: ['Value Proposition Canvas completo (Jobs, Pains, Gains → Pain Relievers, Gain Creators)', 'Afirmación de valor cuantificada en formato Aulet con evidencia de fuente', '2+ dimensiones de valor cuantificadas (tiempo / dinero / riesgo / impacto)'],
    stepNumber: 13,
  },
  {
    id: 'first-10-customers',
    name: 'Mapa de los Primeros 10 Clientes',
    shortName: 'Primeros 10 Clientes',
    description:
      'Identifica 10 clientes potenciales reales con nombre completo, empresa, cargo y canal de acceso. Define el siguiente paso concreto para los 3 más prioritarios (Aulet, DE Step 9).',
    guidingQuestion: '¿A quién específicamente le venderás primero y cómo llegarás a ellos mañana?',
    preambulo:
      'Aulet (DE Step 9) es tajante: si no puedes nombrar 10 clientes potenciales con nombre completo, no conoces tu mercado. No vale "empresas del sector alimentario" — vale "María Castillo, Gerente de Innovación, Alicorp Lima". Los early adopters son aliados estratégicos, no abstractos. Prioriza por potencial de conversión, no por quién es más fácil de contactar.',
    ...stageProps(2),
    category: 'Ventas',
    estimatedTime: '20 min',
    outputs: ['Lista de 10 clientes con nombre, empresa, cargo y canal de acceso', 'Priorización de los 3 mejores con criterios estratégicos documentados', 'Plan de acción concreto (mensaje específico, intro necesaria) para los 3 top'],
    relatedService: 'Acompañamiento de ventas B2B',
    stepNumber: 14,
  },
  {
    id: 'core-competitive-position',
    name: 'Core y Posicionamiento Competitivo',
    shortName: 'Core & Competencia',
    description:
      'Parte A — Define tu Core (DE Step 10): la ventaja interna difícil de replicar en 18 meses. Parte B — Mapea tu Posición Competitiva (DE Step 11): 2 ejes relevantes al cliente, 4–6 competidores, cuadrante sin ocupar.',
    guidingQuestion: '¿Qué hay en ti que es difícil de copiar, y cómo te posicionas frente a lo que ya existe?',
    preambulo:
      'Aulet separa Step 10 (Core: ventaja interna) y Step 11 (Posición: mapa externo) porque son thinking fundamentalmente distinto. El Core es lo que hay en ti que es difícil de copiar — IP, efectos de red, datos únicos, distribución, conocimiento del dominio. La Posición Competitiva es cómo te ven en relación al campo existente. Confundirlos produce founders que creen que su ventaja es "mejor servicio" cuando la competencia tiene 10 patentes.',
    ...stageProps(2),
    category: 'Estrategia',
    estimatedTime: '20 min',
    outputs: ['Core definido con categoría (IP / efectos de red / datos / distribución / dominio / escala) y justificación de dificultad de réplica', 'Mapa de posicionamiento competitivo 2×2 con ejes justificados por relevancia al cliente', 'El cuadrante sin ocupar que representa la oportunidad estratégica'],
    stepNumber: 15,
  },
  {
    id: 'lean-canvas',
    name: 'Lean Canvas de Impacto',
    shortName: 'Lean Canvas',
    description:
      'Completa los 9 bloques del Lean Canvas de Ash Maurya con evidencia de herramientas anteriores por bloque, e identifica los 3 supuestos más riesgosos del canvas. Es un artefacto vivo, no un formulario.',
    guidingQuestion: '¿Cómo conecta todo lo aprendido en un modelo de negocio de una página orientado a incertidumbre?',
    preambulo:
      'El Lean Canvas (Ash Maurya — Running Lean) está diseñado para incertidumbre, no para ejecución. A diferencia del Business Model Canvas de Osterwalder (que se completa en 03.3), el Lean Canvas coloca el problema y la solución al centro. Maurya lo posiciona como artefacto vivo que se actualiza semanalmente: un canvas "terminado" en esta etapa es un canvas mal entendido.',
    ...stageProps(2),
    category: 'Estrategia',
    estimatedTime: '30 min',
    outputs: ['Lean Canvas completo de 9 bloques con herramienta fuente de evidencia por bloque', '3 supuestos más riesgosos del canvas identificados y priorizados', 'Preguntas críticas de validación para las próximas semanas'],
    stepNumber: 16,
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
    stepNumber: 17,
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
    stepNumber: 18,
  },

  // ── Stage 3: Aceleración (8 herramientas) ──────────────────────
  {
    id: 'decision-making-unit',
    name: 'Unidad de Decisión del Cliente (DMU)',
    shortName: 'DMU',
    description:
      'Mapea los 6 roles de la DMU de Aulet (DE Step 12) para tu beachhead: Champion, Economic Buyer, Primary User, Influencer, Veto y Procurement — con motivaciones, objeciones y táctica de engagement por rol.',
    guidingQuestion: '¿Quiénes participan en la decisión de compra, qué los motiva y cómo trabajas con cada uno?',
    preambulo:
      'En B2B, la persona que usa el producto no es quien firma el cheque, ni quien puede bloquearte. Aulet (DE Step 12) define 6 roles en la DMU y exige mapearlos todos. El founder que solo habla con el End User fracasa en el momento de cerrar la venta. El DMU es el mapa del campo de juego político de cada deal.',
    ...stageProps(3),
    category: 'Ventas',
    estimatedTime: '20 min',
    outputs: ['Mapa de DMU con 6 roles, perfiles y motivaciones por rol', 'Objeciones anticipadas y táctica de engagement por rol', 'Roles más críticos para trabajar en los primeros 10 clientes (02.4)'],
    relatedService: 'Estrategia de ventas B2B',
    stepNumber: 19,
  },
  {
    id: 'customer-acquisition-process',
    name: 'Proceso de Adquisición de Clientes',
    shortName: 'Adquisición',
    description:
      'Mapea el proceso de compra desde la perspectiva del cliente (Aulet, DE Step 13): 6 etapas desde reconocimiento del problema hasta post-compra, con fricciones y roles del DMU integrados por etapa.',
    guidingQuestion: '¿Qué proceso interno sigue tu cliente para reconocer, evaluar y finalmente comprarte?',
    preambulo:
      'Aulet distingue Step 13 (proceso de compra desde el cliente) de Step 18 (proceso de ventas desde la startup — herramienta 03.6). Aquí el founder se pone en los zapatos del cliente: ¿cómo busca opciones? ¿quién influye? ¿qué lo frena? Este mapa y el Proceso de ventas (03.6) son complementarios y deben leerse juntos.',
    ...stageProps(3),
    category: 'Marketing',
    estimatedTime: '20 min',
    outputs: ['Customer Acquisition Journey con 6 etapas, fricciones y actores del DMU por etapa', 'Los 2 cuellos de botella más críticos del proceso de compra del cliente tipo', 'Conexión explícita con el Proceso de ventas (03.6)'],
    stepNumber: 20,
  },
  {
    id: 'business-model-design',
    name: 'Diseño del Modelo de Negocio',
    shortName: 'Modelo de Negocio',
    description:
      'Diseña el modelo de negocio con el Business Model Canvas de Osterwalder (DE Step 15) y mapea 3–5 follow-on markets con TAM estimado (DE Step 14). A diferencia del Lean Canvas (02.6), el BMC se usa aquí porque el modelo tiene mayor certeza.',
    guidingQuestion: '¿Cómo crea, entrega y captura valor tu startup, y qué mercados adyacentes abres al ganar el beachhead?',
    preambulo:
      'El modelo de negocio no es el producto — es la arquitectura completa de cómo crear, entregar y capturar valor. Aulet dedicó dos steps separados: Step 15 para el diseño del modelo (Business Model Canvas) y Step 14 para los follow-on markets que justifican la escalabilidad. El mismo producto con distinto modelo puede ser un negocio mediocre o un unicornio.',
    ...stageProps(3),
    category: 'Estrategia',
    estimatedTime: '25 min',
    outputs: ['Business Model Canvas completo de 9 bloques (Osterwalder)', '3–5 follow-on markets con TAM estimado, puerta de entrada y sinergias', 'Mapa de expansión geográfica o vertical con lógica de bowling alley'],
    relatedProduct: 'Modelamiento financiero profesional',
    stepNumber: 21,
  },
  {
    id: 'pricing-framework',
    name: 'Framework de Pricing',
    shortName: 'Pricing',
    description:
      'Fija tu precio analizando 3 marcos — value-based (% del valor entregado al cliente), cost-plus (piso mínimo) y competitive (rango de referencia del mercado) — y prueba la reacción con clientes potenciales reales.',
    guidingQuestion: '¿Cuánto deberías cobrar basándote en el valor que entregas, no en lo que cuesta producir?',
    preambulo:
      'El precio no es solo un número — es un mensaje de posicionamiento. Aulet (DE Step 16) enseña que el precio demasiado bajo daña la credibilidad ("si es tan barato, ¿cómo puede ser tan bueno?"), mientras el precio sin justificación paraliza la venta. El punto de partida es el valor cuantificado en 02.3, no el costo de producción.',
    ...stageProps(3),
    category: 'Finanzas',
    estimatedTime: '20 min',
    outputs: ['Justificación de precio por los 3 marcos (value / cost-plus / competitive)', 'Estructura de precios definitiva con lógica de posicionamiento', 'Evidencia de disposición a pagar de al menos 3 clientes potenciales reales'],
    stepNumber: 22,
  },
  {
    id: 'ltv-unit-economics',
    name: 'Calculadora LTV y Unit Economics',
    shortName: 'LTV & Economics',
    description:
      'Calcula LTV y COCA con las fórmulas de Aulet (DE Steps 17+19), evalúa si el ratio LTV/COCA > 3x, y analiza la sensibilidad del modelo ante cambios de precio (–20%) y retención (–10%).',
    guidingQuestion: '¿Tu modelo es sostenible: el valor de cada cliente supera 3x lo que cuesta adquirirlo?',
    preambulo:
      'LTV y COCA son las métricas que definen si un modelo de negocio es viable. Aulet cubre estos en Steps 17 y 19 porque son las palancas más directas para decidir cuánto invertir en ventas, qué canales priorizar y cuándo escalar. La meta mínima para startups B2B: LTV/COCA > 3x. Si no se cumple, el lever más rápido de mover es precio o retención.',
    ...stageProps(3),
    category: 'Finanzas',
    estimatedTime: '25 min',
    outputs: ['LTV calculado: (Precio anual × Margen bruto) × Tasa de retención en años', 'COCA calculado incluyendo todos los costos de ventas + marketing', 'Ratio LTV/COCA + Payback Period + análisis de sensibilidad de 3 escenarios'],
    relatedProduct: 'Dashboard financiero para inversores',
    stepNumber: 23,
  },
  {
    id: 'sales-process-map',
    name: 'Mapa del Proceso de Ventas',
    shortName: 'Proceso de Ventas',
    description:
      'Diseña el pipeline de ventas en 5 etapas con criterios de avance MEDDIC (DE Step 18), métricas de conversión estimadas y tamaño de pipeline requerido para tu objetivo de revenue. Complemento al proceso del cliente (03.2).',
    guidingQuestion: '¿Cómo conviertes prospectos en clientes de forma repetible y escalable?',
    preambulo:
      'El Proceso de ventas (Aulet, DE Step 18) convierte el arte de vender en un sistema replicable. El framework MEDDIC (Metrics, Economic Buyer, Decision Criteria, Decision Process, Identify Pain, Champion) estructura la calificación de deals. Un proceso documentado es el activo que permite que cualquier vendedor nuevo se incorpore al playbook sin depender del founder.',
    ...stageProps(3),
    category: 'Ventas',
    estimatedTime: '20 min',
    outputs: ['Pipeline de 5 etapas con criterios MEDDIC de calificación por etapa', 'Métricas de conversión estimadas + ciclo de ventas en días', 'Tamaño del pipeline requerido dado el objetivo de revenue'],
    relatedService: 'Workshop de ventas para founders',
    stepNumber: 24,
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
    stepNumber: 25,
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
    stepNumber: 26,
  },

  // ── Stage 4: Escalamiento (8 herramientas) ─────────────────────
  {
    id: 'key-assumptions',
    name: 'Identificación y Testeo de Supuestos',
    shortName: 'Supuestos Clave',
    description:
      'Lista todos los supuestos del negocio por categoría, aplica la Assumption Map de David Bland (importancia × certeza) y prioriza los 3 más riesgosos para testar primero con la herramienta Experimentos (04.2).',
    guidingQuestion: '¿Qué estás asumiendo como verdadero que, si resultara falso, hundiría el negocio?',
    preambulo:
      'El supuesto más riesgoso no es el más probable de ser falso — es el que, si fuese falso, hundiría el negocio. Aulet (DE Step 20) y David Bland (Assumption Mapping) coinciden: hay que listar todos los supuestos antes de testear cualquiera, clasificarlos en el mapa de impacto × certeza, y atacar el cuadrante crítico: alta importancia + baja certeza.',
    ...stageProps(4),
    category: 'Estrategia',
    estimatedTime: '25 min',
    outputs: [
      'Mapa de supuestos por categoría (cliente, producto, canal/adquisición, financiero)',
      'Assumption Map 2×2 (importancia × certeza) con supuestos clasificados',
      '3 supuestos prioritarios en formato falsificable para diseñar experimentos (04.2)',
    ],
    stepNumber: 22,
  },
  {
    id: 'key-experiments',
    name: 'Diseño de Experimentos',
    shortName: 'Experimentos',
    description:
      'Diseña experimentos controlados para testar los 3 supuestos más riesgosos usando la plantilla de David Bland (DE Step 21): hipótesis, experimento, métrica, criterio de éxito/fracaso, muestra mínima y duración.',
    guidingQuestion:
      '¿Cómo conviertes supuestos riesgosos en conocimiento validado sin construir demasiado?',
    preambulo:
      'La diferencia entre un equipo que aprende y uno que se autoengaña es la calidad del experimento. "Salir a vender y ver qué pasa" no es un experimento — es una conversación. Un experimento bien diseñado tiene hipótesis clara, métrica predefinida y criterio de éxito/fracaso definido ANTES de ejecutarlo. Aulet (DE Step 21) y David Bland (Testing Business Ideas) son las referencias.',
    ...stageProps(4),
    category: 'Estrategia',
    estimatedTime: '35 min',
    outputs: [
      '3 diseños de experimento en plantilla completa (hipótesis, métrica, criterio éxito/fracaso, muestra, duración)',
      'Resultados del experimento #1 con datos reales vs. criterio predefinido',
      'Aprendizaje documentado: ¿confirma o refuta el supuesto? ¿cambia el MVBP?',
    ],
    stepNumber: 23,
  },
  {
    id: 'mvbp-definition',
    name: 'Definición del MVBP (Producto Mínimo Viable)',
    shortName: 'Producto Mín. Viable',
    description:
      'Define el Minimum Viable Business Product (Aulet, DE Step 22): la versión mínima que un cliente real del beachhead usa Y paga precio real. Sin revenue real, no es un MVBP — es un prototipo.',
    guidingQuestion: '¿Cuál es la versión más simple que un cliente real del beachhead usaría Y pagaría?',
    preambulo:
      'La distinción entre MVP (Ries) y MVBP (Aulet) no es semántica — es estratégica. Un MVP puede ser una landing page o un prototipo. El MVBP de Aulet tiene tres requisitos irrenunciables: (1) lo usa el End User del beachhead, no un sustituto; (2) entrega el job-to-be-done mínimo; (3) genera revenue real. Sin pago, no hay MVBP — hay un experimento de producto.',
    ...stageProps(4),
    category: 'Producto',
    estimatedTime: '25 min',
    outputs: [
      'MVBP definido con los 3 criterios de Aulet: usuario, valor mínimo, revenue real',
      'Features incluidas y excluidas con justificación del corte estratégico',
      'Métrica de éxito: N clientes pagando precio real en X semanas',
    ],
    relatedProduct: 'Desarrollo de MVP/prototipo',
    stepNumber: 24,
  },
  {
    id: 'traction-validation',
    name: 'Validación de Tracción: ¿Los clientes pagan?',
    shortName: 'Validación',
    description:
      'Documenta las primeras transacciones reales, la evidencia de valor entregado al cliente y los patrones de los primeros pagadores para decidir si perseverar o pivotar (Aulet, DE Step 23).',
    guidingQuestion: '¿Los clientes reales están pagando por tu MVBP y generando valor verificable?',
    preambulo:
      '"Validar" no es que alguien te diga que le gustó el producto — es que te pague. Aulet (DE Step 23) lo llama "The Dogs Will Eat the Dog Food": el único test que importa es la conducta real con dinero real, no las señales sociales sesgadas por cortesía. La distinción entre evidencia de interés y evidencia de comportamiento es la diferencia entre esperanza y negocio.',
    ...stageProps(4),
    category: 'Ventas',
    estimatedTime: '20 min',
    outputs: [
      'Dashboard de validación: transacciones con nombre, monto, fecha y canal',
      'Métricas de valor entregado al cliente (antes vs. después con el MVBP)',
      'Análisis de patrones de primeros pagadores + decisión de perseverar o pivotar con justificación',
    ],
    stepNumber: 25,
  },
  {
    id: 'product-plan-scaling',
    name: 'Plan de Producto y Mercados Adyacentes',
    shortName: 'Plan & Expansión',
    description:
      'Construye el roadmap de producto en 3 horizontes (6m, 12–18m, 3 años), define los 3 OKRs de los próximos 12 meses y actualiza el mapa de follow-on markets de 03.3 con timing real (Aulet, DE Step 24).',
    guidingQuestion: '¿Cómo crece tu producto desde el beachhead validado hacia los mercados adyacentes?',
    preambulo:
      'Una startup que validó su beachhead pero no tiene visión de expansión no puede hacer fundraising creíble ni atraer talento senior. Aulet (DE Step 24) distingue el Product Plan (roadmap técnico) del Follow-on Markets Plan (expansión de mercado) — ambos deben sincronizarse para que la historia tenga lógica de crecimiento.',
    ...stageProps(4),
    category: 'Producto',
    estimatedTime: '25 min',
    outputs: [
      'Product Roadmap en 3 horizontes: 6m (MVBP 2.0), 12–18m (primer follow-on), 3 años (plataforma)',
      '3 OKRs para los próximos 12 meses con Key Results medibles',
      'Mapa de follow-on markets actualizado con timing, recursos y sinergias con el beachhead',
    ],
    stepNumber: 26,
  },
  {
    id: 'pitch-deck-builder',
    name: 'Pitch Deck Builder',
    shortName: 'Pitch Deck',
    description:
      'Construye los 12 slides del framework Sequoia Capital con evidencia documentada por slide — cada slide conecta a una herramienta anterior específica. El Pitch Deck es una tesis de inversión, no una presentación.',
    guidingQuestion: '¿Puedes contar la historia completa de tu startup en 12 slides que respondan cada pregunta de todo inversor?',
    preambulo:
      'El Pitch Deck no es una presentación de PowerPoint — es una tesis de inversión. El framework de 12 slides de Sequoia Capital es el estándar porque obliga a responder las preguntas que todo inversor tiene: ¿Es el problema real? ¿Es el mercado grande? ¿Puede este equipo ganar? ¿Por qué ahora? La calidad del deck es un proxy de la claridad del pensamiento del founder.',
    ...stageProps(4),
    category: 'Marketing',
    estimatedTime: '45 min',
    outputs: [
      '12 slides estructurados con evidencia documentada por slide',
      'Tabla de fuentes cruzadas: qué herramienta anterior alimenta cada slide',
      'Los 3 slides con evidencia más débil identificados para fortalecer antes de presentar',
    ],
    relatedService: 'Revisión y coaching de Pitch Deck',
    stepNumber: 27,
    transversal: true,
  },
  {
    id: 'cap-table-fundraising',
    name: 'Cap Table y Estrategia de Fundraising',
    shortName: 'Cap Table',
    description:
      'Construye el cap table actual, simula dilución en ronda Seed + Serie A, y analiza 3 términos críticos de term sheets: liquidation preference, anti-dilution y pro-rata rights (Venture Deals, Brad Feld).',
    guidingQuestion: '¿Cómo evoluciona la propiedad de tu empresa en múltiples rondas y qué términos debes entender antes de firmar?',
    preambulo:
      'Los founders que no entienden el cap table firman acuerdos que destruyen su control antes de llegar a la Serie A. Venture Deals (Brad Feld) y los SAFEs de Y Combinator son los estándares de referencia. La dilución de porcentaje no es lo mismo que dilución de valor — puedes tener menos % de una empresa mucho más valiosa.',
    ...stageProps(4),
    category: 'Finanzas',
    estimatedTime: '30 min',
    outputs: [
      'Cap table actual con todos los accionistas, porcentajes e instrumentos',
      'Simulación Seed + Serie A con dilución calculada del fundador por ronda',
      'Análisis de 3 términos críticos de term sheets con implicaciones prácticas',
    ],
    relatedProduct: 'Modelo financiero para inversores',
    relatedService: 'Asesoría de fundraising',
    stepNumber: 28,
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
    stepNumber: 29,
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
    stepNumber: 30,
  },
]

export const TOOLS_BY_STAGE: Record<0 | 1 | 2 | 3 | 4, ToolDef[]> = {
  0: TOOLS.filter((t) => t.stage === 0),
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

export const TOOL_TO_PROFILE_MAP: Record<string, (data: Record<string, unknown>) => Record<string, unknown>> = {
  'tam-calculator': (data) => ({ tam_usd: data.totalTAM }),
  'ltv-unit-economics': (data) => ({ ltv: data.ltv, cac: data.cac }),
  'pricing-framework': (data) => ({ revenue_model: data.selectedModel }),
  'traction-validation': (data) => ({
    has_paying_customers: (Number(data.payingCustomers) || 0) > 0,
    paying_customers_count: Number(data.payingCustomers) || 0,
    monthly_revenue: Number(data.mrr) || 0,
  }),
  'passion-purpose': (data) => ({ team_size: Array.isArray(data.teamMembers) ? data.teamMembers.length : undefined }),
}
