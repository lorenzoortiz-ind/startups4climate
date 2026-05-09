# Módulo 00 — Ideación + Sistema de Desbloqueo Progresivo

**Fecha:** 2026-05-09
**Versión:** 2.0 (reemplaza v1.0 del mismo día)
**Tipo:** Nueva feature — módulo de herramientas + sistema de acceso por etapa
**Estándar metodológico:** Design Thinking (Stanford d.school) · Disciplined Entrepreneurship Step 0 (Aulet, MIT) · Jobs-to-be-Done (Christensen) · Lean Startup Customer Discovery (Ries)
**Estándar pedagógico:** Taxonomía de Bloom (aplicar → analizar → crear) · Aprendizaje basado en problemas · Scaffolding progresivo · Feedback inmediato con IA

---

## 1. Contexto

La plataforma tiene 4 módulos que siguen DE Steps 1-24. El módulo de Ideación cubre el **Step 0** — el trabajo previo a cualquier metodología de startup: descubrir que existe un problema real que vale la pena resolver.

**Audiencia:** Founders que parten de cero. No tienen problema identificado, no tienen solución, no tienen equipo necesariamente. Pueden venir de una comunidad local, universidad o programa de impacto.

**Propósito didáctico:** Activar la mentalidad de observación y empatía antes de entrar a frameworks estructurados. El founder debe aprender a *ver* el mundo como fuente de oportunidades, no como consumidor pasivo.

---

## 2. Sistema de Desbloqueo Progresivo

### Reglas de acceso

| Origen | Etapa asignada | Ideación requerida |
|--------|---------------|-------------------|
| Auto-registro, sin org, declara "no sé en qué etapa estoy" | `ideacion` | ✅ Bloqueante — debe completar Idea inicial antes de Pre-incubación |
| Auto-registro, sin org, se declara en Pre-incubación+ | `pre-incubacion` | ⚠️ Recomendada — el sistema sugiere completarla, pero no bloquea |
| Invitado por admin_org a cohorte en cualquier etapa | La etapa de la cohorte | ❌ No requerida — la org ya evaluó al founder offline |
| Diagnóstico de readiness con score bajo | Recalibra sugerencia | ⚠️ El sistema sugiere regresar a Ideación, no fuerza |

### Regla de acceso hacia adelante

Una vez desbloqueada una etapa, el founder tiene acceso a esa etapa y todas las superiores. Las etapas inferiores permanecen accesibles como referencia opcional.

### Cambios en DB

**`cohorts`** — agregar columna:
```sql
ALTER TABLE cohorts ADD COLUMN stage text
  CHECK (stage IN ('ideacion','pre-incubacion','incubacion','aceleracion','escalamiento'));
```

**`profiles.stage`** — migrar valores numéricos a nombres semánticos:
```sql
UPDATE profiles SET stage = CASE
  WHEN stage = '1' THEN 'pre-incubacion'
  WHEN stage = '2' THEN 'incubacion'
  WHEN stage = '3' THEN 'aceleracion'
  WHEN stage = '4' THEN 'escalamiento'
  ELSE stage
END;
```
Agregar `'ideacion'` como valor válido.

### Onboarding flow (nuevo founder sin org)

1. Registro completado → pantalla "¿En qué etapa está tu startup?"
2. Opciones: Ideación / Pre-incubación / Incubación / Aceleración / Escalamiento / "No lo sé aún"
3. Si elige "No lo sé" o "Ideación" → `profiles.stage = 'ideacion'` → acceso directo al módulo 00
4. Si elige Pre-incubación → `profiles.stage = 'pre-incubacion'` + banner recomendando completar Ideación primero
5. Si elige Incubación+ → `profiles.stage` = etapa elegida, Ideación visible pero no recomendada activamente

---

## 3. Módulo 00 — Ideación

### Metadatos

```ts
{
  id: 'ideacion',
  icon: Lightbulb,
  number: '00',
  title: 'Ideación',
  focus: 'Descubre un problema real que vale la pena resolver, entiende a quién le duele y formula tu primera hipótesis de solución',
  accent: 'green',  // hex: #16A34A — diferente a ember y electric
}
```

### Las 5 herramientas

---

#### 00.1 — Exploración de problemas
**Marco metodológico:** Design Thinking — fase Empatizar · Observación etnográfica · Técnica "How Might We" (IDEO)
**Nivel Bloom:** Observar → Identificar → Cuestionar (niveles 1-2)
**Propósito didáctico:** Romper el sesgo de solución. El founder aprende a observar su entorno como campo fértil de problemas antes de pensar en productos.

**Qué hace el founder:**
- Elige un territorio o contexto que conoce bien (comunidad, sector, lugar)
- Mapea fricciones, ineficiencias, injusticias o necesidades no cubiertas
- Genera una lista de 5-8 problemas candidatos usando la pregunta guía: *"¿Qué le resulta difícil, costoso, lento o injusto a la gente en este contexto?"*

**Entregable:** Lista priorizada de 3-5 problemas con descripción del contexto y quién los vive.

**Feedback AI:** Evalúa si cada problema está formulado desde el punto de vista del afectado (no de la solución), si hay especificidad suficiente y sugiere ángulos no explorados.

**Feeds into:** 00.2 Selección del problema

---

#### 00.2 — Selección del problema
**Marco metodológico:** Disciplined Entrepreneurship Step 0 (Aulet) · Matriz de priorización ICE · Impact/Confidence/Ease
**Nivel Bloom:** Analizar → Evaluar (niveles 4-5)
**Propósito didáctico:** Desarrollar criterio de selección estratégica. No todos los problemas valen lo mismo. El founder aprende a razonar con evidencia, no con intuición.

**Qué hace el founder:**
- Toma la lista de la herramienta anterior
- Evalúa cada problema en 4 dimensiones (escala 1-5):
  1. **Urgencia** — ¿Con qué frecuencia ocurre? ¿Qué tan doloroso es?
  2. **Mercado** — ¿Cuánta gente lo vive? ¿Hay masa crítica?
  3. **Disposición a pagar** — ¿Pagarían por resolverlo? ¿Ya gastan en soluciones parciales?
  4. **Impacto climático/social** — ¿Qué tan relevante es para un futuro sostenible?
- Elige el problema con mayor score total

**Entregable:** 1 problema seleccionado con justificación cuantificada en las 4 dimensiones.

**Feedback AI:** Cuestiona los puntajes con preguntas de Socratic coaching ("¿Tienes evidencia de que pagarían, o es una suposición?"), valida la coherencia del reasoning.

**Feeds into:** 00.3 Mapa de empatía

---

#### 00.3 — Mapa de empatía
**Marco metodológico:** Design Thinking — Definir · Mapa de Empatía (XPLANE/Dave Gray) · Proto-persona
**Nivel Bloom:** Analizar → Comprender desde la perspectiva del otro (niveles 2-4)
**Propósito didáctico:** Shift de perspectiva fundamental: el founder deja de verse como protagonista y pone al afectado en el centro. Es el corazón del Human-Centered Design.

**Qué hace el founder:**
Describe a la persona que vive el problema seleccionado desde 4 dimensiones:
- **Piensa y siente** — sus preocupaciones, aspiraciones, miedos no expresados
- **Ve** — su entorno, lo que observa a su alrededor, los influenciadores que sigue
- **Dice y hace** — comportamiento observable, lo que declara públicamente
- **Escucha** — qué le dicen colegas, medios, figuras de autoridad

**Entregable:** Mapa de empatía completo con nombre ficticio, foto representativa y 3 insights síntesis.

**Feedback AI:** Detecta si el founder proyecta sus propias creencias sobre el afectado, señala generalidades sin evidencia y sugiere preguntas de entrevista derivadas del mapa.

**Feeds into:** 00.4 Guía de entrevista · 01.4 Usuario final · 01.6 Persona

---

#### 00.4 — Guía de entrevista
**Marco metodológico:** Lean Startup Customer Discovery (Ries/Blank) · The Mom Test (Fitzpatrick) · Entrevistas de problema vs entrevistas de solución
**Nivel Bloom:** Aplicar → Crear (niveles 3-6)
**Propósito didáctico:** El peor error en early stage es validar con preguntas que sesgan la respuesta. El founder aprende a diseñar conversaciones que revelan la verdad aunque sea incómoda.

**Qué hace el founder:**
- Diseña 6-8 preguntas abiertas siguiendo los principios de *The Mom Test*:
  - Preguntan sobre el pasado, no el futuro
  - No revelan la solución que tienes en mente
  - Indagan comportamiento real, no intención hipotética
- Documenta los resultados de 3-5 entrevistas reales:
  - Citas textuales relevantes
  - Patrones encontrados
  - Supuestos confirmados / refutados

**Entregable:** Guía de entrevista + registro de hallazgos con al menos 3 entrevistas completadas.

**Feedback AI:** Revisa cada pregunta y señala si está sesgada, si es cerrada cuando debería ser abierta, o si revela la solución prematuramente. Post-entrevistas, ayuda a sintetizar patrones.

**Feeds into:** 00.5 Idea inicial

---

#### 00.5 — Idea inicial
**Marco metodológico:** DE Step 0 → puente a Steps 1-5 · Value Proposition Canvas simplificado (Osterwalder) · Problem/Solution Fit
**Nivel Bloom:** Sintetizar → Crear (nivel 6 — el más alto de Bloom)
**Propósito didáctico:** El cierre del módulo. El founder sintetiza todo el trabajo previo en una hipótesis articulada y rigurosa. No es un pitch — es un documento de trabajo que guiará las primeras semanas de Pre-incubación.

**Estructura del entregable:**
```
PROBLEMA: [1-2 oraciones. Específico, desde la perspectiva del afectado]
  Evidencia: [citas de entrevistas que lo confirman]

CLIENTE: [descripción del afectado principal]
  Frecuencia del problema: [diaria / semanal / mensual / esporádica]
  Soluciones actuales que usa: [cómo lo resuelve hoy, aunque sea mal]

HIPÓTESIS DE SOLUCIÓN: [1-2 oraciones. Qué harías diferente]
  Por qué tú: [qué te da ventaja para resolverlo — conocimiento, acceso, red]

SUPUESTO MÁS RIESGOSO: [la cosa más importante que debes confirmar antes de seguir]
```

**Feedback AI:** Evalúa coherencia entre problema, cliente y solución. Detecta saltos lógicos. Señala si la solución asume demasiado sin evidencia. Genera 3 preguntas críticas que el founder debería responder en Pre-incubación.

**Desbloquea:** Módulo 01 — Pre-incubación (si el founder venía de Ideación)
**Feeds into:** 01.1 Propósito & Equipo · 01.2 Segmentación

---

## 4. Conexión Ideación → Pre-incubación

Cuando el founder completa Idea inicial, el sistema:
1. Marca el módulo 00 como completado
2. Desbloquea Pre-incubación (si estaba bloqueado)
3. Pre-llena contexto en:
   - **Propósito & Equipo** — carga el problema identificado como punto de partida del "por qué"
   - **Segmentación** — carga el cliente hipotético como primer segmento a explorar

Implementación: guardar `tool_data` de `idea-inicial` en Supabase y leerlo desde las tools de Pre-incubación con un banner "Basado en tu Idea inicial: [resumen]".

---

## 5. Estándares de calidad para todas las herramientas del módulo

Cada herramienta debe cumplir:

- **Claridad de propósito** — el founder entiende en 10 segundos qué va a hacer y por qué importa
- **Marco teórico visible** — la fuente metodológica aparece en la interfaz (sin jerga innecesaria)
- **Instrucciones en primera persona** — "Escribe", "Elige", "Describe" — verbos de acción directa
- **Entregable concreto** — siempre hay algo que el founder puede descargar, compartir o llevar a una reunión
- **Feedback AI accionable** — no evaluativo genérico ("¡Buen trabajo!") sino Socratic coaching específico
- **Tiempo estimado** — cada herramienta muestra cuánto toma completarla (Ideación: 20-45 min por tool)
- **Ejemplo real** — al menos un ejemplo de una startup latinoamericana de impacto completa la herramienta

---

## 6. Fuera de scope

- Gamificación (badges, puntos) — decisión futura
- Módulos opcionales dentro de Ideación
- Onboarding guiado paso a paso (wizard) — es una mejora futura al flujo actual
- Cambios en el diseño visual del componente `StartupLifecycle.tsx`
