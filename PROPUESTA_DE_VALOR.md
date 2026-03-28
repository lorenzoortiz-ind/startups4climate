# Startups4Climate — Propuesta de valor actual

> Documento de referencia para análisis y mejora del modelo de negocio.
> Fecha de generación: 27 de marzo de 2026.

---

## 1. Identidad y posicionamiento

**Nombre:** Startups4Climate
**Creada por:** Redesign Lab
**Equipo fundador:**
- **Eddie Ajalcrina** — Co-Founder & CEO. Estrategia de impacto y desarrollo de negocio en LATAM. Experiencia en ecosistemas de innovación y conexión con capital. Tags: Impact Strategy, Business Dev, LATAM Ecosystems.
- **Lorenzo Ortiz** — Co-Founder & CTO. Tecnología, producto y diseño de nuevos negocios. Background en finanzas avanzadas, desarrollo tech y escalamiento de startups. Tags: Product Dev, Ops & Tech, Startup Tools.

**Alianzas y colaboraciones mencionadas:** BID, MIT, SingularityU, ClimateKIC, Wyss Academy, Unión Europea, NESsT, CATAL1.5T, Stanford University.

**Tagline actual del hero:**
> "Lanza tu startup de impacto con las herramientas correctas"

**Subtítulo:**
> "+20 herramientas desde la idea hasta el negocio validado, organizadas en 4 etapas. Con acceso libre para cualquier founder en Latinoamérica."

**Badge del hero:** "Plataforma para startups de impacto en LATAM"

---

## 2. El problema que resuelve

La plataforma articula dos problemas estructurales:

### Problema 1: El capital
La inversión de venture capital existe a escala global, pero apenas el 2% llega a Latinoamérica. Los founders de la región enfrentan barreras estructurales para acceder a financiamiento: falta de redes, desconexión geográfica y ecosistemas de capital aún incipientes.

### Problema 2: El conocimiento
Las mejores metodologías, frameworks y herramientas para construir startups existen, pero están encerradas detrás de programas costosos, contenido exclusivamente en inglés o redes que dependen de la geografía. El talento está distribuido; el acceso al conocimiento, no.

### Puente narrativo
Las incubadoras y aceleradoras hacen un trabajo fundamental, pero su capacidad es limitada. Millones de personas con ideas transformadoras quedan fuera. La plataforma existe para que cualquier founder en Latinoamérica, con acceso a internet, pueda desarrollar su startup con herramientas de clase mundial.

---

## 3. Propuesta de valor (cómo lo resuelve)

La plataforma se posiciona como una solución *all-in-one* que democratiza el desarrollo de startups de impacto en Latinoamérica. Se articula en 4 pilares:

| Pilar | Subtítulo | Descripción |
|---|---|---|
| Herramientas paso a paso | A tu ritmo, sin rigidez | +20 herramientas que siguen una metodología probada. Sin programas rígidos de 12 semanas. |
| Diagnóstico personalizado | Tu punto de partida exacto | Evaluación que ubica al founder en su etapa y le muestra las herramientas relevantes. |
| Marco conceptual incluido | No asume que el usuario ya sabe todo | Cada herramienta viene con una explicación de por qué la necesita y bases teóricas. Aprendes mientras construyes. |
| Acceso desde cualquier lugar | Democratización real | Cualquier founder en LATAM con internet puede acceder. Sin filtros, sin aplicaciones, sin esperar turno. |

---

## 4. Audiencia objetivo

### Mercado geográfico
Latinoamérica (20 países del formulario de diagnóstico: Argentina, Bolivia, Brasil, Chile, Colombia, Costa Rica, Cuba, Ecuador, El Salvador, Guatemala, Honduras, México, Nicaragua, Panamá, Paraguay, Perú, República Dominicana, Uruguay, Venezuela).

### Segmento primario
Founders de startups de impacto en todas las verticales, no limitado a climatech. Verticales disponibles en el diagnóstico:
- Agritech, Biotech, Cleantech/Climatech, Deep Tech, E-commerce/Marketplace, Edtech, Fintech, Foodtech, Healthtech, Insurtech, Legaltech, Mobility/Logística, Proptech, SaaS/Enterprise, Social Impact, Otro.

### Segmento secundario
Inversores de impacto que buscan evaluar startups o acceder a dealflow curado en LATAM.

### Perfil del usuario
- El usuario promedio no es sofisticado. No sabe qué herramientas buscar.
- Necesita un marco conceptual y una explicación de por qué necesita cada herramienta antes de usarla (preámbulo).
- Puede estar en cualquiera de las 4 etapas de madurez.

---

## 5. Diagnóstico de Startup Readiness

Formulario en la landing page que captura datos del lead y evalúa su etapa:

### Datos capturados
- Nombre completo
- Email
- Nombre de la startup
- Descripción de la startup (mínimo 10 caracteres)
- Vertical (desplegable, 16 opciones)
- País (desplegable, 20 países LATAM)
- Teléfono (opcional)
- Website (opcional)

### Preguntas de evaluación (10 preguntas)
1. **¿En qué vertical se encuentra tu startup?** (tag, no scoring) — SaaS, Hardware/IoT, Deep Tech/Biotech, Marketplace, Servicios/Consultoría.
2. **¿En qué fase de desarrollo se encuentra tu startup hoy?** (score 1-4) — Idea, Prototipo, Pilotos, Ingresos recurrentes.
3. **¿Cuál es el estado actual de la validación de tu mercado?** (score 1-4) — Discovery, LOIs, Pilotos pagados, Ingresos recurrentes.
4. **¿Cuál es tu modelo de ingresos principal?** (tag) — Suscripción, Licencia, Transacción, Hardware+servicio, Aún no definido.
5-10. Preguntas adicionales de scoring sobre equipo, producto, finanzas, etc.

### Resultado
El usuario es clasificado en una de 4 etapas según su score:
- **Pre-incubación** (score bajo) — Ideación y descubrimiento.
- **Incubación** (score medio-bajo) — Validación y producto.
- **Aceleración** (score medio-alto) — Modelo de negocio y crecimiento.
- **Escalamiento** (score alto) — Producto, plan y fundraising.

Los datos se guardan en Supabase como lead.

---

## 6. Las 24 herramientas (roadmap completo)

Organizadas en 4 etapas, con 6 herramientas cada una. Lógica de desbloqueo progresivo: el founder solo tiene activas las herramientas de su etapa y las anteriores.

### Categorías temáticas (filtros)
Estrategia, Mercado, Cliente, Producto, Finanzas, Ventas, Marketing, Modelo de Negocio, Equipo.

### Etapa 1: Pre-incubación (Ideación y descubrimiento)
| # | Herramienta | Categoría | Tiempo est. | Outputs |
|---|---|---|---|---|
| 1 | Pasión, propósito y equipo fundador | Equipo | 20 min | Declaración de misión, inventario de habilidades, plan de reclutamiento |
| 2 | Segmentación de mercado | Mercado | 25 min | Matriz de segmentos, criterios de evaluación, top 6-12 oportunidades |
| 3 | Selección del mercado inicial | Mercado | 20 min | Mercado inicial seleccionado, justificación ponderada, mapa de expansión |
| 4 | Perfil del usuario final | Cliente | 25 min | Perfil demográfico/psicográfico, mapa de dolores, contexto de uso |
| 5 | Cálculo del TAM | Finanzas | 20 min | TAM en USD (bottom-up), número estimado de clientes |
| 6 | Perfil de la persona | Cliente | 15 min | Ficha de persona, día típico, criterios de decisión |

**Consejo de vida real al completar la etapa:**
> "Habla con al menos 20 personas que podrían ser tus clientes. No vendas nada todavía — solo escucha, observa y valida que el problema es real. La investigación primaria no se hace desde el escritorio."

### Etapa 2: Incubación (Validación y producto)
| # | Herramienta | Categoría | Tiempo est. | Outputs |
|---|---|---|---|---|
| 7 | Caso de uso del ciclo completo | Producto | 25 min | Mapa del ciclo de uso, puntos de fricción, oportunidades de mejora |
| 8 | Especificación de alto nivel del producto | Producto | 20 min | Brochure de producto, features principales, límites del MVP |
| 9 | Propuesta de valor cuantificada | Estrategia | 20 min | Valor en USD/tiempo/riesgo, comparación vs. status quo, ROI |
| 10 | Mapa de los primeros 10 clientes | Ventas | 20 min | Lista de 10 clientes, datos de contacto, estrategia de acercamiento |
| 11 | Core y posicionamiento competitivo | Estrategia | 20 min | Definición del core, mapa competitivo, barreras de entrada |
| 12 | Lean Canvas de impacto | Modelo de Negocio | 30 min | Canvas completo, hipótesis clave, métricas de validación |

**Consejo de vida real al completar la etapa:**
> "Enfócate al 100% en vender. Antes de buscar aceleración o inversión, necesitas tracción real: al menos 5 clientes pagando recurrentemente o $3,000-5,000 USD en MRR. Los inversores quieren ver que el mercado validó tu solución con dinero real."

### Etapa 3: Aceleración (Modelo de negocio y crecimiento)
| # | Herramienta | Categoría | Tiempo est. | Outputs |
|---|---|---|---|---|
| 13 | Unidad de decisión del cliente (DMU) | Ventas | 20 min | Mapa de la DMU con roles, estrategia por stakeholder, objeciones |
| 14 | Proceso de adquisición de clientes | Marketing | 20 min | Funnel completo, tasas de conversión, canales prioritarios |
| 15 | Diseño del modelo de negocio | Modelo de Negocio | 25 min | Modelo seleccionado, flujos de ingresos, estructura de costos |
| 16 | Framework de pricing | Finanzas | 20 min | Estructura de precios, justificación basada en valor, comparación |
| 17 | Calculadora LTV y unit economics | Finanzas | 25 min | LTV, COCA, ratio LTV/COCA, payback period |
| 18 | Mapa del proceso de ventas | Ventas | 20 min | Pipeline documentado, scripts, KPIs de ventas |

**Consejo de vida real al completar la etapa:**
> "Asegura que tu unit economics sea saludable (LTV/COCA > 3x), documenta tus procesos, y prepárate para escalar. Si vas a levantar capital, tu Data Room debería estar casi listo."

### Etapa 4: Escalamiento (Producto, plan y fundraising)
| # | Herramienta | Categoría | Tiempo est. | Outputs |
|---|---|---|---|---|
| 19 | Identificación y testeo de supuestos | Estrategia | 25 min | Supuestos priorizados, diseño de experimentos, criterios de éxito |
| 20 | Definición del MVBP | Producto | 25 min | Definición del MVBP, features incluidas/excluidas, roadmap |
| 21 | Validación de tracción | Ventas | 20 min | Evidencia de ventas, métricas de retención, testimoniales |
| 22 | Plan de producto y mercados adyacentes | Producto | 25 min | Roadmap 12-18 meses, TAM de mercados adyacentes, bowling alley |
| 23 | Pitch Deck Builder | Marketing | 45 min | 12 slides, narrative arc, talking points |
| 24 | Cap Table y estrategia de fundraising | Finanzas | 30 min | Cap table multi-ronda, dilución proyectada, estrategia de fundraising |

**Consejo de vida real al completar la etapa:**
> "Tienes una startup con producto validado, clientes reales, modelo sólido y plan de escalamiento. Ejecuta: escala tu equipo, automatiza, y si necesitas capital externo, ya tienes todo lo que un inversor necesita ver."

---

## 7. Características funcionales de cada herramienta

- **Preámbulo**: Explicación de por qué el founder necesita esta herramienta y bases teóricas (abierto por defecto).
- **Secciones colapsables**: Las secciones de texto se colapsan para mantener orden; las numéricas quedan visibles.
- **Auto-guardado**: Debounce de 500ms, guardado en localStorage y sincronización con Supabase.
- **Botón guardar**: Manual, con confirmación visual "Guardado".
- **Marcar como completada**: Registra progreso en el checklist de la etapa.
- **Generar reporte**: Descarga individual de la herramienta completada.
- **Reporte global**: Descarga consolidada de todas las herramientas.
- **Recomendaciones**: Al completar, se ofrecen recomendaciones para mejorar y un CTA hacia un producto o servicio relacionado.
- **Etiquetas de categoría**: Cada herramienta muestra su categoría (Marketing, Finanzas, etc.) con colores diferenciados.
- **Desbloqueo progresivo**: Las herramientas se desbloquean según la etapa del founder.

---

## 8. Modelo de monetización actual

### 8.1 Productos (entregables profesionales)
Accesibles solo para usuarios registrados, dentro de la plataforma. Pago vía Stripe.

| Producto | Precio (USD) | Etapa asociada |
|---|---|---|
| Investigación de mercado profunda | $299 | Pre-incubación |
| Branding & identidad visual | $599 | Pre-incubación |
| Diseño de producto MVP | $499 | Incubación |
| Modelamiento financiero profesional | $399 | Incubación |
| Dashboard financiero para inversores | $349 | Aceleración |
| Pitch Deck profesional | $249 | Aceleración |

**Rango de precios:** $249 — $599 USD.

### 8.2 Servicios (mentoría y acompañamiento)
Contacto vía email (hello@redesignlab.org) o Calendly.

#### Para founders
| Servicio | Precio |
|---|---|
| Sesión estratégica 1:1 | $99 USD/sesión |
| Workshop de Customer Discovery | $199 USD |
| Workshop de ventas para founders | $149 USD |
| Revisión y coaching de Pitch Deck | $149 USD |
| Acompañamiento de ventas B2B | $299 USD/mes |
| Asesoría de fundraising | $499 USD |

#### Para inversores
| Servicio | Precio |
|---|---|
| Due Diligence de startups | $799 USD |
| Dealflow curado LATAM | Custom |

**Rango de precios servicios:** $99 — $799 USD (+ custom).

### 8.3 Herramientas de la plataforma
Acceso 100% gratuito (las 24 herramientas). La plataforma es gratis para generar leads calificados que luego conviertan en productos y servicios pagos.

---

## 9. Recursos (stack tecnológico recomendado)

Sección dentro de la plataforma que recomienda herramientas tech por etapa:

### Pre-incubación
Google Workspace, Notion, Claude, Canva, WhatsApp Business (todos gratis).

### Incubación
Figma, Typeform/Google Forms, Mailchimp/Brevo, Trello/Linear, Calendly (todos gratis).

### Aceleración
Supabase, Vercel/Netlify, Stripe (paga por uso), HubSpot CRM, Google Analytics.

### Escalamiento
AWS/GCP (créditos para startups), Mixpanel/Amplitude, Notion+Pitch, QuickBooks/Xero, Loom.

---

## 10. Flujo del usuario

```
Landing page → Diagnóstico (10 preguntas + datos de contacto)
    → Resultado: etapa asignada
    → Registro / Login
    → Plataforma (/tools)
        → Dashboard con indicador de etapa
        → 24 herramientas (desbloqueadas según etapa)
        → Recursos (stack tech por etapa)
        → Productos (entregables, checkout con Stripe)
        → Servicios (mentoría, contacto por email/Calendly)
        → Perfil (editar datos, rol, LinkedIn)
        → Reportes individuales y globales
```

---

## 11. Checkout

- Formulario simplificado: nombre, email, teléfono (opcional), país, ciudad.
- Datos pre-cargados del usuario logueado.
- Pasarela: Stripe (link de pago, pendiente de configuración).
- Post-pago: pantalla de confirmación ("Pago confirmado, se le enviará el recurso a su correo en menos de 24 horas") y redirección a /tools.

---

## 12. Funcionalidades de la plataforma

| Funcionalidad | Estado |
|---|---|
| 24 herramientas interactivas con auto-guardado | Implementado |
| Diagnóstico con scoring y clasificación | Implementado |
| Desbloqueo progresivo por etapa | Implementado |
| Filtros por categoría temática | Implementado |
| Reportes individuales por herramienta | Implementado |
| Reporte global consolidado | Implementado |
| Sección de recursos (stack tech) | Implementado |
| Sección de productos (checkout Stripe) | Implementado |
| Sección de servicios | Implementado |
| Perfil de usuario editable | Implementado |
| Indicador de etapa en dashboard | Implementado |
| Dark mode | Implementado |
| Animaciones (Framer Motion) | Implementado |
| Consejos de vida real al completar etapa | Implementado |
| Autenticación (registro/login) | Implementado |
| Persistencia en Supabase | Implementado |
| Pasarela de pagos Stripe | Pendiente de configuración |

---

## 13. Métricas clave actuales (stats mostradas)

- **+20** herramientas
- **4** etapas
- **100%** gratuito (las herramientas)

---

## 14. CTA principal de la landing

> "Tu idea puede cambiar Latinoamérica. Nosotros te damos las herramientas para lograrlo."

**Botones:** "Acceder a la plataforma" (registro) | "Diagnóstico rápido" (scroll a formulario).

---

## 15. Modelo de negocio resumido

```
┌───────────────────────────────────────────────┐
│  ADQUISICIÓN (gratuito)                       │
│  Landing → Diagnóstico → Registro → Plataforma│
│  24 herramientas gratuitas                    │
│  (generan leads calificados)                  │
├───────────────────────────────────────────────┤
│  MONETIZACIÓN (pago)                          │
│  • Productos ($249-$599 USD)                  │
│    Entregables profesionales por etapa        │
│  • Servicios founders ($99-$499 USD)          │
│    Mentoría, workshops, acompañamiento        │
│  • Servicios inversores ($799+ USD)           │
│    Due diligence, dealflow curado             │
├───────────────────────────────────────────────┤
│  CONTEXTO                                     │
│  Los productos y servicios se ofrecen         │
│  contextualmente después de completar         │
│  cada herramienta (CTA relacionado).          │
│  Solo visibles para usuarios registrados.     │
└───────────────────────────────────────────────┘
```

---

## 16. Preguntas abiertas para análisis

1. ¿El modelo freemium (herramientas gratis → productos/servicios pagos) es el más adecuado, o debería haber un tier de suscripción?
2. ¿Los precios de productos y servicios están calibrados para el mercado LATAM?
3. ¿Cómo se escala la parte de servicios (sesiones 1:1, workshops) sin que dependa del tiempo de los fundadores?
4. ¿Debería haber un modelo de membresía o comunidad?
5. ¿Cómo se mide el éxito de la plataforma más allá del número de registros? (ej. founders que llegan a Incubación, founders que generan ingresos).
6. ¿El nombre "Startups4Climate" sigue siendo coherente si la plataforma ya no se limita a climatech?
7. ¿Cómo se monetiza el segmento de inversores más allá del due diligence y dealflow?
8. ¿Debería la plataforma ofrecer certificaciones o credenciales al completar cada etapa?
9. ¿Cuál es la estrategia de adquisición de usuarios (CAC) y cuál debería ser el LTV objetivo?
10. ¿Hay oportunidad de partnerships con programas de gobierno, universidades o aceleradoras regionales?
