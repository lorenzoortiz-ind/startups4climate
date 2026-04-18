# Cuestionario de Diagnóstico — DiagnosticForm

## Flujo general

**12 pasos**: Datos de contacto → 10 preguntas → Pantalla de carga → Resultados

Componente: `src/components/DiagnosticForm.tsx`

---

## Paso 0 — Datos de contacto

| Campo | Validación |
|-------|------------|
| Tu nombre | Mín. 2 caracteres, requerido |
| Email | Formato email, requerido |
| Nombre de tu startup | Mín. 2 caracteres, requerido |
| Vertical | Selección requerida |
| Describe brevemente tu idea | Mín. 10 caracteres, requerido |
| País (código telefónico) | Selector 17 países LATAM, default México +52 |
| Teléfono (WhatsApp) | Opcional |
| Sitio web | Opcional |

**Opciones de vertical:** Fintech · Healthtech · Edtech · Agritech · Cleantech / Energía · Logística / Movilidad · Proptech · Biotech · Deep Tech · Otra

---

## Preguntas (P1–P10)

### P1 — Naturaleza del Producto *(tipo: tag)*
**¿En qué vertical se encuentra tu startup?**

- SaaS / Software
- Hardware / IoT
- Deep Tech / Biotech
- Marketplace / Plataforma
- Servicios / Consultoría

---

### P2 — Nivel de Madurez *(tipo: score)*
**¿En qué fase de desarrollo se encuentra tu startup hoy?**

| Opción | Score |
|--------|-------|
| Idea o prueba de concepto inicial | 1 |
| Prototipo funcional o MVP lanzado | 2 |
| Pilotos con clientes o primeros usuarios activos | 3 |
| Ingresos recurrentes y tracción demostrada | 4 |

---

### P3 — Validación Comercial *(tipo: score)*
**¿Cuál es el estado actual de la validación de tu mercado?**

| Opción | Score |
|--------|-------|
| Validando el problema mediante entrevistas | 1 |
| Tenemos cartas de intención o pilotos no pagados | 2 |
| Pilotos pagados o primeros ingresos iniciales | 3 |
| Ingresos recurrentes demostrados o contratos firmados | 4 |

---

### P4 — Modelo de Negocio *(tipo: tag)*
**¿Cuál es tu modelo de ingresos principal?**

- Suscripción (SaaS)
- Venta directa
- Marketplace / comisiones
- Freemium
- Licenciamiento

---

### P5 — Medición de Impacto *(tipo: score)*
**¿Cómo mides el impacto positivo de tu startup?**

| Opción | Score |
|--------|-------|
| Aún no medimos o solo tenemos una narrativa cualitativa | 1 |
| Tenemos métricas básicas internas de impacto | 2 |
| Contamos con verificación de terceros o certificaciones | 4 |

---

### P6 — Necesidad de Financiamiento *(tipo: score)*
**¿Cuánto capital buscas levantar en los próximos 12–18 meses?**

| Opción | Score |
|--------|-------|
| Bootstrapping o menos de $250k | 1 |
| Entre $250k y $1.5M | 2 |
| Entre $1.5M y $5M | 3 |
| Más de $5M | 4 |

---

### P7 — Equipo Fundador *(tipo: tag)*
**¿Cuántas personas hay en tu equipo fundador?**

- Solo founder
- 2 co-founders
- 3+ co-founders
- Equipo completo (>5)

---

### P8 — Composición del Equipo *(tipo: score)*
**¿Cuál es el balance actual del equipo fundador?**

| Opción | Score |
|--------|-------|
| Perfil 100% técnico/científico | 1 |
| Principalmente negocio, buscando expertise técnico | 2 |
| Equilibrado entre perfil técnico y de negocios | 3 |

---

### P9 — Cuello de Botella Operativo *(tipo: tag)*
**¿Cuál es tu principal obstáculo hoy?**

- Encontrar product-market fit
- Conseguir clientes
- Estructurar financieramente
- Levantar inversión

---

### P10 — Preparación para Inversión *(tipo: score)*
**¿Si un inversor te pidiera acceso a tu Data Room hoy, qué tan listo estás?**

| Opción | Score |
|--------|-------|
| No tenemos Data Room estructurado aún | 1 |
| Tenemos Pitch Deck básico y proyecciones a 12 meses | 2 |
| Modelo financiero y aspectos legales listos | 3 |
| Todo lo anterior + métricas de tracción y auditorías listas | 4 |

---

## Paso 11 — Pantalla de carga

> *"Analizando tu startup… Calculando tu Startup Readiness Score y preparando tu roadmap personalizado."*

Acciones en background:
- INSERT en tabla `diagnostic_leads` (nombre, email, startup, score, perfil, respuestas, tags)
- INSERT en tabla `diagnostics` (user_id si existe, score, perfil, dimension_scores)
- Guarda `s4c_diagnostic_pending` en `localStorage` para founders no registrados aún

---

## Paso 12 — Resultados

**Score total** = suma de las 6 preguntas tipo score (P2, P3, P5, P6, P8, P10)
**Máximo posible:** 24 pts

### Perfiles de resultado

| Rango | Etapa | Tag | Color |
|-------|-------|-----|-------|
| 6–11 | ETAPA 1: Pre-incubación | Ideación | #FF6B4A |
| 12–18 | ETAPA 2: Incubación | Validación | #0D9488 |
| 19–21 | ETAPA 3: Aceleración | Crecimiento | #D97706 |
| 22–24 | ETAPA 4: Escalamiento | Escala | #3B82F6 |

### Herramientas recomendadas por etapa

| Etapa | Herramientas |
|-------|-------------|
| Pre-incubación | Propósito & Equipo · Segmentación de Mercado · Mercado inicial · Perfil del Usuario |
| Incubación | Propuesta de Valor · Primeros 10 Clientes · Lean Canvas · Especificación de Producto |
| Aceleración | Unit Economics · Proceso de Ventas · Modelo de Negocio · Framework de Pricing |
| Escalamiento | Pitch Deck · Cap Table · Plan de Producto · Validación de Tracción |

### Dimensiones del score (dimension_scores)

| Dimensión | Pregunta fuente |
|-----------|----------------|
| madurez | P2 |
| validacion | P3 |
| impacto | P5 |
| financiamiento | P6 |
| equipo | P8 |
| data_room | P10 |

### CTAs en pantalla de resultados

1. **"Acceder a las Herramientas"** → `/tools`
2. **"Agenda una Sesión Estratégica"** → Calendly
