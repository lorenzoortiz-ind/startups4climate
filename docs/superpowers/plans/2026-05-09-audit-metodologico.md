# Auditoría Metodológica — Implementación

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Actualizar el contenido de 24 herramientas existentes para alinearlo al framework DE (Aulet), añadir la nueva herramienta Experimentos (DE Step 21) y renombrar MVBP.

**Architecture:** Content-only update en `src/lib/tools-data.ts` + nuevo componente `Experiments.tsx` + registro en `ToolPage.tsx` + actualización de `StartupLifecycle.tsx`. Sin cambios a base de datos ni a rutas de navegación.

**Tech Stack:** TypeScript, React, Next.js 15, `useToolState` hook, Supabase-first, componentes compartidos en `shared.tsx`

**Spec de referencia:** `docs/superpowers/specs/2026-05-09-audit-metodologico-design.md`

---

### Task 1: Actualizar contenido Stage 1 (Pre-incubación) en tools-data.ts

**Files:**
- Modify: `src/lib/tools-data.ts`

- [ ] **Step 1: Actualizar `passion-purpose` (01.1)**

En `src/lib/tools-data.ts`, reemplazar el bloque del tool `passion-purpose`:

```ts
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
  outputs: [
    'Declaración de propósito en 3 oraciones (WHY / HOW / WHAT)',
    'Matriz de evaluación del equipo en 4 dimensiones',
    'Plan de cierre de las 2 brechas más críticas',
  ],
  relatedService: 'Sesión estratégica 1:1',
  stepNumber: 0,
},
```

- [ ] **Step 2: Actualizar `market-segmentation` (01.2)**

```ts
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
  outputs: [
    'Mapa de 6–12 segmentos con descripción y ejemplo real por segmento',
    'Ejemplo de cliente real (con nombre imaginable) por segmento',
    'Primera clasificación por atractivo relativo sin compromiso aún',
  ],
  relatedProduct: 'Investigación de mercado profunda',
  stepNumber: 1,
},
```

- [ ] **Step 3: Actualizar `beachhead-market` (01.3)**

```ts
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
  outputs: [
    'Beachhead seleccionado con scoring en 7 criterios de Aulet',
    'Justificación del rechazo de las 2 alternativas principales',
    'Primeras implicaciones para el End User Profile (01.4)',
  ],
  stepNumber: 2,
},
```

- [ ] **Step 4: Actualizar `end-user-profile` (01.4)**

```ts
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
  outputs: [
    'Perfil del End User en 6 dimensiones con fuentes de evidencia',
    'Mapa explícito End User / Economic Buyer / Champion',
    '3 preguntas de entrevista para confirmar los datos más débiles del perfil',
  ],
  relatedService: 'Workshop de Customer Discovery',
  stepNumber: 3,
},
```

- [ ] **Step 5: Actualizar `tam-calculator` (01.5)**

```ts
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
  outputs: [
    'Modelo TAM bottom-up: N clientes × precio unitario anual con fuentes citadas',
    'Rango bajo / central / alto con análisis de sensibilidad',
    'Los 2 supuestos con mayor impacto en el resultado identificados',
  ],
  stepNumber: 4,
},
```

- [ ] **Step 6: Actualizar `persona-profile` (01.6)**

```ts
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
  outputs: [
    'Tarjeta de Persona: nombre, foto representativa, datos demográficos mínimos',
    'Día típico en 3 momentos clave donde el producto podría aparecer',
    '3 miedos profesionales + cita textual de entrevista real o la más representativa',
  ],
  stepNumber: 5,
},
```

- [ ] **Step 7: Verificar que el archivo compila sin errores**

```bash
cd /Users/lorenzo/Documents/GitHub/Startups4climate
npx tsc --noEmit
```

Expected: Sin errores TypeScript.

- [ ] **Step 8: Commit**

```bash
git add src/lib/tools-data.ts
git commit -m "content: audit metodológico Stage 1 — Pre-incubación (DE Steps 0-5)"
```

---

### Task 2: Actualizar contenido Stage 2 (Incubación) en tools-data.ts

**Files:**
- Modify: `src/lib/tools-data.ts`

- [ ] **Step 1: Actualizar `full-lifecycle-usecase` (02.1)**

```ts
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
  outputs: [
    'Mapa de 6 etapas con actores, pasos y fricciones identificadas por etapa',
    'Oportunidades de mejora priorizadas por impacto en adopción',
    'Las 2 etapas más críticas para el éxito del onboarding',
  ],
  stepNumber: 6,
},
```

- [ ] **Step 2: Actualizar `product-specification` (02.2)**

```ts
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
  outputs: [
    'Funciones nucleares (3–5) con mejora cuantificada vs. alternativa actual del cliente',
    'Exclusiones explícitas con justificación estratégica de cada corte',
    'Diagrama de bloques funcionales de alto nivel (sin UX — solo arquitectura funcional)',
  ],
  relatedProduct: 'Diseño de producto MVP',
  stepNumber: 7,
},
```

- [ ] **Step 3: Actualizar `quantified-value-prop` (02.3)**

```ts
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
  outputs: [
    'Value Proposition Canvas completo (Jobs, Pains, Gains → Pain Relievers, Gain Creators)',
    'Afirmación de valor cuantificada en formato Aulet con evidencia de fuente',
    '2+ dimensiones de valor cuantificadas (tiempo / dinero / riesgo / impacto)',
  ],
  stepNumber: 8,
},
```

- [ ] **Step 4: Actualizar `first-10-customers` (02.4)**

```ts
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
  outputs: [
    'Lista de 10 clientes con nombre, empresa, cargo y canal de acceso',
    'Priorización de los 3 mejores con criterios estratégicos documentados',
    'Plan de acción concreto (mensaje específico, intro necesaria) para los 3 top',
  ],
  relatedService: 'Acompañamiento de ventas B2B',
  stepNumber: 9,
},
```

- [ ] **Step 5: Actualizar `core-competitive-position` (02.5)**

Esta es una corrección crítica: la herramienta ahora tiene **dos partes explícitas** — Core (DE Step 10) y Posición Competitiva (DE Step 11).

```ts
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
  outputs: [
    'Core definido con categoría (IP / efectos de red / datos / distribución / dominio / escala) y justificación de dificultad de réplica',
    'Mapa de posicionamiento competitivo 2×2 con ejes justificados por relevancia al cliente',
    'El cuadrante sin ocupar que representa la oportunidad estratégica',
  ],
  stepNumber: 10,
},
```

- [ ] **Step 6: Actualizar `lean-canvas` (02.6)**

Esta es una corrección crítica: clarificar que es el Lean Canvas de **Ash Maurya** (no el BMC de Osterwalder) y mapear las fuentes de cada bloque.

```ts
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
  outputs: [
    'Lean Canvas completo de 9 bloques con herramienta fuente de evidencia por bloque',
    '3 supuestos más riesgosos del canvas identificados y priorizados',
    'Preguntas críticas de validación para las próximas semanas',
  ],
  stepNumber: 11,
  transversal: true,
},
```

- [ ] **Step 7: Verificar que el archivo compila sin errores**

```bash
npx tsc --noEmit
```

Expected: Sin errores TypeScript.

- [ ] **Step 8: Commit**

```bash
git add src/lib/tools-data.ts
git commit -m "content: audit metodológico Stage 2 — Incubación (DE Steps 6-11)"
```

---

### Task 3: Actualizar contenido Stage 3 (Aceleración) en tools-data.ts

**Files:**
- Modify: `src/lib/tools-data.ts`

- [ ] **Step 1: Actualizar `decision-making-unit` (03.1)**

```ts
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
  outputs: [
    'Mapa de DMU con 6 roles, perfiles y motivaciones por rol',
    'Objeciones anticipadas y táctica de engagement por rol',
    'Roles más críticos para trabajar en los primeros 10 clientes (02.4)',
  ],
  relatedService: 'Estrategia de ventas B2B',
  stepNumber: 14,
},
```

- [ ] **Step 2: Actualizar `customer-acquisition-process` (03.2)**

```ts
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
  outputs: [
    'Customer Acquisition Journey con 6 etapas, fricciones y actores del DMU por etapa',
    'Los 2 cuellos de botella más críticos del proceso de compra del cliente tipo',
    'Conexión explícita con el Proceso de ventas (03.6)',
  ],
  stepNumber: 15,
},
```

- [ ] **Step 3: Actualizar `business-model-design` (03.3)**

```ts
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
  outputs: [
    'Business Model Canvas completo de 9 bloques (Osterwalder)',
    '3–5 follow-on markets con TAM estimado, puerta de entrada y sinergias',
    'Mapa de expansión geográfica o vertical con lógica de bowling alley',
  ],
  relatedProduct: 'Modelamiento financiero profesional',
  stepNumber: 16,
},
```

- [ ] **Step 4: Actualizar `pricing-framework` (03.4)**

```ts
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
  outputs: [
    'Justificación de precio por los 3 marcos (value / cost-plus / competitive)',
    'Estructura de precios definitiva con lógica de posicionamiento',
    'Evidencia de disposición a pagar de al menos 3 clientes potenciales reales',
  ],
  stepNumber: 17,
},
```

- [ ] **Step 5: Actualizar `ltv-unit-economics` (03.5)**

```ts
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
  outputs: [
    'LTV calculado: (Precio anual × Margen bruto) × Tasa de retención en años',
    'COCA calculado incluyendo todos los costos de ventas + marketing',
    'Ratio LTV/COCA + Payback Period + análisis de sensibilidad de 3 escenarios',
  ],
  relatedProduct: 'Dashboard financiero para inversores',
  stepNumber: 18,
},
```

- [ ] **Step 6: Actualizar `sales-process-map` (03.6)**

```ts
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
  outputs: [
    'Pipeline de 5 etapas con criterios MEDDIC de calificación por etapa',
    'Métricas de conversión estimadas + ciclo de ventas en días',
    'Tamaño del pipeline requerido dado el objetivo de revenue',
  ],
  relatedService: 'Workshop de ventas para founders',
  stepNumber: 19,
},
```

- [ ] **Step 7: Verificar compilación**

```bash
npx tsc --noEmit
```

Expected: Sin errores TypeScript.

- [ ] **Step 8: Commit**

```bash
git add src/lib/tools-data.ts
git commit -m "content: audit metodológico Stage 3 — Aceleración (DE Steps 12-19)"
```

---

### Task 4: Actualizar Stage 4 + añadir Experimentos + renombrar MVBP en tools-data.ts

**Files:**
- Modify: `src/lib/tools-data.ts`

- [ ] **Step 1: Actualizar `key-assumptions` (04.1)**

```ts
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
```

- [ ] **Step 2: Añadir el ToolDef de `key-experiments` (04.2) — NUEVO**

Insertar este bloque **inmediatamente después** del bloque de `key-assumptions` (antes de `mvbp-definition`):

```ts
{
  id: 'key-experiments',
  name: 'Diseño de Experimentos',
  shortName: 'Experimentos',
  description:
    'Diseña experimentos controlados para testar los 3 supuestos más riesgosos usando la plantilla de David Bland (DE Step 21): hipótesis, experimento, métrica, criterio de éxito/fracaso, muestra mínima y duración.',
  guidingQuestion: '¿Cómo conviertes supuestos riesgosos en conocimiento validado sin construir demasiado?',
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
```

- [ ] **Step 3: Actualizar `mvbp-definition` (04.3) — renombrar + reescribir**

```ts
{
  id: 'mvbp-definition',
  name: 'MVBP — Producto Mínimo Viable de Negocio',
  shortName: 'MVBP',
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
```

- [ ] **Step 4: Actualizar `traction-validation` (04.4) y renumerar stepNumber**

```ts
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
```

- [ ] **Step 5: Actualizar `product-plan-scaling`, `pitch-deck-builder`, `cap-table-fundraising` con nuevos stepNumbers y contenido**

```ts
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
```

- [ ] **Step 6: Actualizar stepNumbers de las herramientas no-DE que no cambian de contenido**

Las siguientes herramientas no son parte del audit DE pero necesitan stepNumber actualizado para mantener orden consistente. Solo actualizar el campo `stepNumber`:

```ts
// competitor-analysis: stepNumber: 12  → sin cambio (ya era 12, OK)
// impact-metrics: stepNumber: 13  → sin cambio (ya era 13, OK)
// okr-tracker: stepNumber: 20  → sin cambio (ya era 20, OK)
// regulatory-compass: stepNumber: 21  → sin cambio (ya era 21, OK)
// data-room-builder: stepNumber: 28  → cambiar a 29
// financial-model-builder: stepNumber: 29  → cambiar a 30
```

Actualizar en el archivo:
```ts
// data-room-builder
stepNumber: 29,

// financial-model-builder
stepNumber: 30,
```

- [ ] **Step 7: Verificar compilación**

```bash
npx tsc --noEmit
```

Expected: Sin errores TypeScript.

- [ ] **Step 8: Commit**

```bash
git add src/lib/tools-data.ts
git commit -m "content: audit metodológico Stage 4 — Escalamiento + nueva herramienta Experimentos + renombrar MVBP"
```

---

### Task 5: Actualizar StartupLifecycle.tsx

**Files:**
- Modify: `src/components/StartupLifecycle.tsx`

- [ ] **Step 1: Añadir import de FlaskConical si no está ya importado**

Verificar que `FlaskConical` está en los imports (ya está en el archivo). Si no estuviera, añadir a la lista de imports de lucide-react.

- [ ] **Step 2: Actualizar el array `tools` de la etapa `escalamiento`**

Reemplazar el array `tools` de la etapa `escalamiento` en el array `stages`:

```ts
{
  id: 'escalamiento',
  icon: TrendingUp,
  number: '04',
  title: 'Escalamiento',
  focus: 'Valida supuestos con experimentos controlados, lanza tu MVBP con revenue real y prepara tu ronda de inversión',
  accent: 'electric' as const,
  tools: [
    { name: 'Supuestos clave', icon: Beaker, desc: 'Lista y prioriza los supuestos más riesgosos en el mapa de impacto × certeza.' },
    { name: 'Experimentos', icon: FlaskConical, desc: 'Diseña experimentos controlados con hipótesis falsificables y criterios predefinidos.' },
    { name: 'MVBP', icon: Package, desc: 'Define el Mínimo Viable de Negocio: el cliente real usa Y paga precio real.' },
    { name: 'Validación', icon: ShieldCheck, desc: 'Documenta transacciones reales y decide si perseverar o pivotar con evidencia.' },
    { name: 'Plan & Expansión', icon: Expand, desc: 'Roadmap en 3 horizontes + OKRs + follow-on markets con timing.' },
    { name: 'Pitch deck', icon: Presentation, desc: 'Tesis de inversión en 12 slides con fuentes cruzadas de herramientas anteriores.' },
    { name: 'Cap table', icon: Wallet, desc: 'Simula dilución en 2 rondas y analiza términos críticos de term sheets.' },
  ],
},
```

- [ ] **Step 3: Verificar que el componente renderiza sin errores**

```bash
npx tsc --noEmit
```

Expected: Sin errores.

- [ ] **Step 4: Commit**

```bash
git add src/components/StartupLifecycle.tsx
git commit -m "content: StartupLifecycle — añadir Experimentos, renombrar MVBP, actualizar descripción Escalamiento"
```

---

### Task 6: Crear Experiments.tsx component

**Files:**
- Create: `src/components/tools/KeyExperiments.tsx`

- [ ] **Step 1: Crear el componente completo**

Crear `/Users/lorenzo/Documents/GitHub/Startups4climate/src/components/tools/KeyExperiments.tsx`:

```tsx
'use client'

import { useToolState } from '@/lib/useToolState'
import { ToolSection, ToolActionBar } from '@/components/tools/shared'
import { PlusCircle, Trash2, FlaskConical } from 'lucide-react'

const ACCENT = '#1F77F6'

interface Experiment {
  id: string
  hypothesis: string
  action: string
  metric: string
  successCriteria: string
  failureCriteria: string
  sampleSize: string
  duration: string
  status: 'design' | 'running' | 'completed'
  results: string
  learning: string
  changedMVBP: boolean
}

interface Data {
  assumptionSource: string
  experiments: Experiment[]
}

function newExperiment(): Experiment {
  return {
    id: Math.random().toString(36).slice(2),
    hypothesis: '',
    action: '',
    metric: '',
    successCriteria: '',
    failureCriteria: '',
    sampleSize: '',
    duration: '',
    status: 'design',
    results: '',
    learning: '',
    changedMVBP: false,
  }
}

const DEFAULT: Data = {
  assumptionSource: '',
  experiments: [newExperiment(), newExperiment(), newExperiment()],
}

interface Props {
  userId: string
  onComplete: () => void
  onGenerateReport: (content: string) => void
}

const inputStyle = {
  width: '100%',
  padding: '10px 14px',
  borderRadius: 8,
  border: '1px solid rgba(255,255,255,0.10)',
  background: 'rgba(255,255,255,0.04)',
  color: 'var(--color-ink)',
  fontSize: '0.9rem',
  fontFamily: 'var(--font-body)',
  outline: 'none',
  boxSizing: 'border-box' as const,
}

const textareaStyle = {
  ...inputStyle,
  resize: 'vertical' as const,
  minHeight: 72,
}

const labelStyle = {
  fontFamily: 'var(--font-body)',
  fontSize: '0.78rem',
  fontWeight: 600 as const,
  color: 'var(--color-text-muted)',
  letterSpacing: '0.05em',
  textTransform: 'uppercase' as const,
  display: 'block' as const,
  marginBottom: 6,
}

export default function KeyExperiments({ userId, onComplete, onGenerateReport }: Props) {
  const [data, setData] = useToolState<Data>(userId, 'key-experiments', DEFAULT)

  function update(field: keyof Data, value: string) {
    setData((prev) => ({ ...prev, [field]: value }))
  }

  function updateExp(id: string, field: keyof Experiment, value: string | boolean) {
    setData((prev) => ({
      ...prev,
      experiments: prev.experiments.map((e) =>
        e.id === id ? { ...e, [field]: value } : e,
      ),
    }))
  }

  function addExperiment() {
    setData((prev) => ({ ...prev, experiments: [...prev.experiments, newExperiment()] }))
  }

  function removeExperiment(id: string) {
    if (data.experiments.length <= 3) return
    setData((prev) => ({ ...prev, experiments: prev.experiments.filter((e) => e.id !== id) }))
  }

  const hasMinimum =
    data.experiments.length >= 3 &&
    data.experiments.some((e) => e.status === 'completed' && e.results.trim().length > 10)

  function handleReport() {
    const lines: string[] = ['DISEÑO DE EXPERIMENTOS — DE Step 21\n']
    if (data.assumptionSource.trim()) {
      lines.push(`Supuestos de base (04.1):\n${data.assumptionSource}\n`)
    }
    data.experiments.forEach((exp, i) => {
      lines.push(`────────────────────────────`)
      lines.push(`EXPERIMENTO ${i + 1} [${exp.status.toUpperCase()}]`)
      lines.push(`Hipótesis: ${exp.hypothesis}`)
      lines.push(`Experimento: ${exp.action}`)
      lines.push(`Métrica: ${exp.metric}`)
      lines.push(`Criterio de éxito: ${exp.successCriteria}`)
      lines.push(`Criterio de fracaso: ${exp.failureCriteria}`)
      lines.push(`Muestra mínima: ${exp.sampleSize}`)
      lines.push(`Duración: ${exp.duration}`)
      if (exp.status !== 'design') {
        lines.push(`\nResultados: ${exp.results}`)
        lines.push(`Aprendizaje: ${exp.learning}`)
        lines.push(`¿Cambia el MVBP?: ${exp.changedMVBP ? 'Sí' : 'No'}`)
      }
      lines.push('')
    })
    onGenerateReport(lines.join('\n'))
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      {/* Context banner */}
      <div
        style={{
          padding: '1rem 1.25rem',
          borderRadius: 10,
          border: `1px solid ${ACCENT}30`,
          background: `${ACCENT}08`,
          fontSize: '0.88rem',
          color: 'var(--color-text-secondary)',
          lineHeight: 1.55,
        }}
      >
        <strong style={{ color: ACCENT }}>David Bland — Testing Business Ideas:</strong> Un experimento bien
        diseñado define el criterio de éxito <em>antes</em> de correr el experimento. Sin eso, cualquier
        resultado confirmará lo que ya creías.
      </div>

      {/* Section 1: Reference assumptions from 04.1 */}
      <ToolSection
        number={1}
        title="¿De qué supuestos partes?"
        subtitle="Referencia los 3 supuestos priorizados en Supuestos Clave (04.1)"
        accent={ACCENT}
      >
        <div>
          <label style={labelStyle}>Resumen de los 3 supuestos de 04.1 que vas a testar</label>
          <textarea
            style={{ ...textareaStyle, minHeight: 90 }}
            placeholder={
              'Ej: 1) Los restaurantes pagarían $150/mes por automatizar el inventario. ' +
              '2) El gerente de operaciones es el Champion (no el dueño). ' +
              '3) El CAC vía referidos es < $200.'
            }
            value={data.assumptionSource}
            onChange={(e) => update('assumptionSource', e.target.value)}
          />
        </div>
      </ToolSection>

      {/* Section 2: Experiment designs */}
      <ToolSection
        number={2}
        title="Diseña 3 experimentos"
        subtitle="Un experimento por supuesto. Define todos los campos antes de ejecutar."
        accent={ACCENT}
      >
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.75rem' }}>
          {data.experiments.map((exp, idx) => (
            <div
              key={exp.id}
              style={{
                padding: '1.5rem',
                borderRadius: 12,
                border: '1px solid rgba(255,255,255,0.08)',
                background: 'rgba(255,255,255,0.02)',
                display: 'flex',
                flexDirection: 'column',
                gap: '1rem',
              }}
            >
              {/* Header */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span
                  style={{
                    fontFamily: 'var(--font-heading)',
                    fontSize: '0.95rem',
                    fontWeight: 600,
                    color: ACCENT,
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.4rem',
                  }}
                >
                  <FlaskConical size={15} strokeWidth={2} />
                  Experimento {idx + 1}
                </span>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <select
                    style={{ ...inputStyle, width: 'auto', cursor: 'pointer', padding: '6px 10px' }}
                    value={exp.status}
                    onChange={(e) => updateExp(exp.id, 'status', e.target.value)}
                  >
                    <option value="design">En diseño</option>
                    <option value="running">En ejecución</option>
                    <option value="completed">Completado</option>
                  </select>
                  {data.experiments.length > 3 && (
                    <button
                      onClick={() => removeExperiment(exp.id)}
                      style={{
                        background: 'none',
                        border: 'none',
                        color: 'var(--color-text-muted)',
                        cursor: 'pointer',
                        padding: 4,
                        display: 'flex',
                      }}
                      title="Eliminar experimento"
                    >
                      <Trash2 size={14} />
                    </button>
                  )}
                </div>
              </div>

              {/* Hypothesis & action (full width) */}
              <div>
                <label style={labelStyle}>Hipótesis — "Creemos que..."</label>
                <textarea
                  style={{ ...textareaStyle, minHeight: 60 }}
                  placeholder='Creemos que los gerentes de restaurante pagarían $150/mes para eliminar las pérdidas por inventario mal controlado.'
                  value={exp.hypothesis}
                  onChange={(e) => updateExp(exp.id, 'hypothesis', e.target.value)}
                />
              </div>
              <div>
                <label style={labelStyle}>Experimento — "Para validarlo, haremos..."</label>
                <textarea
                  style={{ ...textareaStyle, minHeight: 60 }}
                  placeholder='Ofreceremos 10 demostraciones con propuesta de precio real ($150/mes) a gerentes de restaurante en Lima, sin descuento introductorio.'
                  value={exp.action}
                  onChange={(e) => updateExp(exp.id, 'action', e.target.value)}
                />
              </div>

              {/* 2-column grid for metric, sample, success, failure, duration */}
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: '1fr 1fr',
                  gap: '1rem',
                }}
              >
                <div>
                  <label style={labelStyle}>Métrica</label>
                  <input
                    type="text"
                    style={inputStyle}
                    placeholder="% de asistentes que solicitan contrato"
                    value={exp.metric}
                    onChange={(e) => updateExp(exp.id, 'metric', e.target.value)}
                  />
                </div>
                <div>
                  <label style={labelStyle}>Muestra mínima</label>
                  <input
                    type="text"
                    style={inputStyle}
                    placeholder="10 demostraciones"
                    value={exp.sampleSize}
                    onChange={(e) => updateExp(exp.id, 'sampleSize', e.target.value)}
                  />
                </div>
                <div>
                  <label style={labelStyle}>Criterio de ÉXITO (definir antes)</label>
                  <input
                    type="text"
                    style={inputStyle}
                    placeholder="3 de 10 solicitan contrato (30%+)"
                    value={exp.successCriteria}
                    onChange={(e) => updateExp(exp.id, 'successCriteria', e.target.value)}
                  />
                </div>
                <div>
                  <label style={labelStyle}>Criterio de FRACASO (definir antes)</label>
                  <input
                    type="text"
                    style={inputStyle}
                    placeholder="Menos de 1 de 10 solicita contrato (<10%)"
                    value={exp.failureCriteria}
                    onChange={(e) => updateExp(exp.id, 'failureCriteria', e.target.value)}
                  />
                </div>
                <div>
                  <label style={labelStyle}>Duración del experimento</label>
                  <input
                    type="text"
                    style={inputStyle}
                    placeholder="2 semanas"
                    value={exp.duration}
                    onChange={(e) => updateExp(exp.id, 'duration', e.target.value)}
                  />
                </div>
              </div>

              {/* Results section — only visible when running or completed */}
              {exp.status !== 'design' && (
                <div
                  style={{
                    paddingTop: '1rem',
                    borderTop: '1px solid rgba(255,255,255,0.07)',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '1rem',
                  }}
                >
                  <p
                    style={{
                      fontFamily: 'var(--font-body)',
                      fontSize: '0.78rem',
                      color: ACCENT,
                      fontWeight: 600,
                      margin: 0,
                      textTransform: 'uppercase',
                      letterSpacing: '0.05em',
                    }}
                  >
                    Resultados
                  </p>
                  <div>
                    <label style={labelStyle}>¿Qué pasó? (datos reales)</label>
                    <textarea
                      style={{ ...textareaStyle, minHeight: 70 }}
                      placeholder="Hicimos 10 demos. 4 solicitaron contrato (40%). 2 pidieron bajar precio a $100."
                      value={exp.results}
                      onChange={(e) => updateExp(exp.id, 'results', e.target.value)}
                    />
                  </div>
                  <div>
                    <label style={labelStyle}>¿Qué aprendiste?</label>
                    <textarea
                      style={{ ...textareaStyle, minHeight: 70 }}
                      placeholder="El supuesto se confirma: hay disposición a pagar. El segmento más receptivo: restaurantes de 20+ mesas. Los de <10 mesas no ven suficiente problema."
                      value={exp.learning}
                      onChange={(e) => updateExp(exp.id, 'learning', e.target.value)}
                    />
                  </div>
                  <label
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.6rem',
                      cursor: 'pointer',
                      fontFamily: 'var(--font-body)',
                      fontSize: '0.88rem',
                      color: 'var(--color-text-secondary)',
                    }}
                  >
                    <input
                      type="checkbox"
                      checked={exp.changedMVBP}
                      onChange={(e) => updateExp(exp.id, 'changedMVBP', e.target.checked)}
                      style={{ cursor: 'pointer', accentColor: ACCENT }}
                    />
                    Este resultado cambia el alcance del MVBP o el modelo de negocio
                  </label>
                </div>
              )}
            </div>
          ))}

          {/* Add experiment button */}
          <button
            onClick={addExperiment}
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '0.5rem',
              background: 'none',
              border: `1px dashed ${ACCENT}50`,
              borderRadius: 10,
              padding: '0.75rem 1.25rem',
              color: ACCENT,
              cursor: 'pointer',
              fontSize: '0.88rem',
              fontFamily: 'var(--font-body)',
              width: '100%',
              transition: 'border-color 0.15s',
            }}
          >
            <PlusCircle size={15} />
            Agregar experimento adicional
          </button>
        </div>
      </ToolSection>

      <ToolActionBar
        isComplete={hasMinimum}
        onComplete={onComplete}
        onGenerateReport={handleReport}
        completeLabel="Marcar como completado"
        reportLabel="Generar reporte"
        incompleteMessage="Diseña al menos 3 experimentos y documenta los resultados de al menos 1."
        accent={ACCENT}
      />
    </div>
  )
}
```

- [ ] **Step 2: Verificar compilación**

```bash
npx tsc --noEmit
```

Expected: Sin errores TypeScript. Si `ToolActionBar` no acepta `accent` prop, verificar la interfaz en `shared.tsx`. Si no existe, añadirla con valor default `'#DA4E24'`.

- [ ] **Step 3: Commit**

```bash
git add src/components/tools/KeyExperiments.tsx
git commit -m "feat: nueva herramienta Experimentos — DE Step 21 (diseño de experimentos controlados)"
```

---

### Task 7: Registrar KeyExperiments en ToolPage.tsx

**Files:**
- Modify: `src/components/tools/ToolPage.tsx`

- [ ] **Step 1: Añadir import dinámico de KeyExperiments en TOOL_COMPONENTS**

En `src/components/tools/ToolPage.tsx`, dentro del objeto `TOOL_COMPONENTS`, añadir:

```ts
'key-experiments': dynamic(() => import('./KeyExperiments'), { ssr: false }),
```

Debe quedar junto a los demás imports de Stage 4. Ejemplo del contexto:

```ts
// Stage 4
'key-assumptions': dynamic(() => import('./KeyAssumptions'), { ssr: false }),
'key-experiments': dynamic(() => import('./KeyExperiments'), { ssr: false }),  // ← añadir
'mvbp-definition': dynamic(() => import('./MVBPDefinition'), { ssr: false }),
```

- [ ] **Step 2: Verificar compilación**

```bash
npx tsc --noEmit
```

Expected: Sin errores TypeScript.

- [ ] **Step 3: Build de producción local para detectar errores de runtime**

```bash
npm run build 2>&1 | tail -30
```

Expected: ✓ Compiled successfully, sin errores de módulos.

- [ ] **Step 4: Commit**

```bash
git add src/components/tools/ToolPage.tsx
git commit -m "feat: registrar KeyExperiments en ToolPage — herramienta 04.2 disponible en ruta /tools"
```

---

### Task 8: Verificación final y TypeScript check

**Files:**
- Read: `src/lib/tools-data.ts`
- Read: `src/components/StartupLifecycle.tsx`

- [ ] **Step 1: Verificar que la herramienta key-experiments aparece en el sidebar**

Verificar manualmente en `src/lib/tools-data.ts` que:
1. `key-experiments` tiene `stage: 4`
2. `TOOLS_BY_STAGE[4]` la incluirá automáticamente (lo hace el `.filter()`)
3. `stepNumber: 23` la ordena correctamente entre `key-assumptions (22)` y `mvbp-definition (24)`

```bash
grep -n "key-experiments\|key-assumptions\|mvbp-definition" src/lib/tools-data.ts
```

Expected: Las tres líneas en orden correcto (key-assumptions antes de key-experiments, key-experiments antes de mvbp-definition).

- [ ] **Step 2: Verificar conteo de herramientas por stage**

```bash
grep -c "stageProps(4)" src/lib/tools-data.ts
```

Expected: 10 (8 anteriores + key-experiments nuevo = 9... pero recordando que data-room-builder y financial-model-builder son stage 4 = 8+1=9. Verificar el conteo exacto).

Si el número no es el esperado, revisar que no se haya duplicado ningún bloque.

- [ ] **Step 3: TypeScript check completo**

```bash
npx tsc --noEmit
```

Expected: Exit code 0, sin errores.

- [ ] **Step 4: Build completo**

```bash
npm run build 2>&1 | grep -E "error|Error|warning|✓" | head -20
```

Expected: `✓ Compiled successfully` o similar sin errores críticos.

- [ ] **Step 5: Commit final con tag de versión del audit**

```bash
git add -A
git commit -m "feat: audit metodológico completo — 24 herramientas + Experimentos (DE Step 21) + MVBP renombrado"
```

---

## Self-Review del Plan

### Cobertura de spec

| Requerimiento del spec | Cubierto en | Status |
|------------------------|-------------|--------|
| 01.1 Golden Circle + matriz gaps | Task 1 Step 1 | ✅ |
| 01.2 6–12 segmentos Aulet | Task 1 Step 2 | ✅ |
| 01.3 7 criterios beachhead | Task 1 Step 3 | ✅ |
| 01.4 End User vs Economic Buyer | Task 1 Step 4 | ✅ |
| 01.5 Bottom-up TAM | Task 1 Step 5 | ✅ |
| 01.6 Persona con cita textual | Task 1 Step 6 | ✅ |
| 02.1 6 etapas ciclo de uso Aulet | Task 2 Step 1 | ✅ |
| 02.2 Principio 10x better | Task 2 Step 2 | ✅ |
| 02.3 Value Proposition Canvas | Task 2 Step 3 | ✅ |
| 02.4 Clientes reales con nombre | Task 2 Step 4 | ✅ |
| 02.5 Separar Core (S10) + Competencia (S11) | Task 2 Step 5 | ✅ |
| 02.6 Lean Canvas Maurya + fuentes por bloque | Task 2 Step 6 | ✅ |
| 03.1 6 roles DMU Aulet | Task 3 Step 1 | ✅ |
| 03.2 Step 13 (cliente) vs Step 18 (startup) | Task 3 Step 2 | ✅ |
| 03.3 BMC (Osterwalder) + Follow-on Markets | Task 3 Step 3 | ✅ |
| 03.4 3 marcos pricing | Task 3 Step 4 | ✅ |
| 03.5 Análisis de sensibilidad | Task 3 Step 5 | ✅ |
| 03.6 MEDDIC + distinción Step 13 vs 18 | Task 3 Step 6 | ✅ |
| 04.1 Assumption Map David Bland | Task 4 Step 1 | ✅ |
| 04.2 Nueva herramienta Experimentos (DE Step 21) | Task 4 Step 2 + Task 6 | ✅ |
| 04.3 MVBP renombrado + 3 criterios Aulet | Task 4 Step 3 | ✅ |
| 04.4 Evidencia conductual vs social | Task 4 Step 4 | ✅ |
| 04.5 OKRs + Follow-on markets timing | Task 4 Step 5 | ✅ |
| 04.6 12 slides Sequoia + fuentes cruzadas | Task 4 Step 5 | ✅ |
| 04.7 3 términos críticos term sheets | Task 4 Step 5 | ✅ |
| StartupLifecycle: añadir Experimentos | Task 5 | ✅ |
| StartupLifecycle: renombrar MVBP | Task 5 | ✅ |
| Componente Experiments.tsx completo | Task 6 | ✅ |
| Registrar en ToolPage.tsx | Task 7 | ✅ |

### Verificaciones de tipo

- `key-experiments` usa `stage: 4` (tipo `1 | 2 | 3 | 4` — correcto, no requiere cambio de tipo)
- `stepNumber: 23` es `number` — correcto
- `ToolActionBar` recibe `accent?: string` — verificar en Task 6 Step 2

### Alcance confirmado

Este plan NO toca:
- `StartupLifecycle.tsx` diseño visual (solo array `tools` de escalamiento)
- Base de datos / Supabase (cero cambios)
- Rutas o navegación
- Herramientas no-DE (competitor-analysis, impact-metrics, okr-tracker, regulatory-compass, data-room-builder, financial-model-builder) — solo stepNumber de las últimas 2
