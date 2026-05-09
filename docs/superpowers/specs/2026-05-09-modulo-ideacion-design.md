# Módulo 00 — Ideación

**Fecha:** 2026-05-09
**Tipo:** Nueva feature — módulo de herramientas
**Prioridad:** Alta (desbloquea onboarding de founders sin idea)

---

## Contexto

La plataforma tiene 4 módulos organizados por etapa del ciclo de vida de una startup:
- 01 Pre-incubación
- 02 Incubación
- 03 Aceleración
- 04 Escalamiento

Todos están modelados en `StartupLifecycle.tsx` como un array `stages[]` con `id`, `number`, `title`, `focus`, `accent`, `tools[]`.

Se agrega el **Módulo 00 — Ideación** como etapa previa a Pre-incubación, orientado a founders que parten de cero (sin problema ni solución identificados).

---

## Objetivo

Llevar al founder de no tener ninguna idea a tener:
1. Un problema real validado con entrevistas
2. Un cliente target hipotético
3. Una solución inicial propuesta

Ese entregable (Herramienta 5 — Idea inicial) conecta directamente con las primeras dos herramientas de Pre-incubación:
- **Propósito & Equipo** — el founder ya sabe el "por qué" de su startup
- **Segmentación** — ya tiene un cliente hipotético identificado

---

## Estructura del módulo

### Metadatos
- **id:** `ideacion`
- **number:** `00`
- **title:** `Ideación`
- **focus:** `Descubre un problema real, entiende a quién le duele y formula tu primera solución`
- **accent:** `green` (diferente a `ember` y `electric` para señalar que es pre-etapa)
- **icon:** `Lightbulb` (Lucide)

### Herramientas (5)

| # | Nombre | Icono sugerido | Descripción |
|---|--------|---------------|-------------|
| 1 | Exploración de problemas | `Search` | Mapea retos y oportunidades de tu contexto. Identifica 3-5 problemas candidatos con potencial de impacto. |
| 2 | Selección del problema | `Filter` | Prioriza un problema usando 4 criterios: urgencia, frecuencia, disposición a pagar e impacto climático. |
| 3 | Mapa de empatía | `Heart` | Describe quién sufre el problema: comportamientos, frustraciones y motivaciones. Primer boceto de cliente. |
| 4 | Guía de entrevista | `MessageSquare` | Diseña preguntas para validar que el problema existe. Registra hallazgos de 3-5 entrevistas reales. |
| 5 | Idea inicial | `Sparkles` | Sintetiza: problema validado + cliente target + solución propuesta. Entregable que desbloquea Pre-incubación. |

---

## Cambios en el código

### 1. `StartupLifecycle.tsx`
Agregar el nuevo stage al inicio del array `stages[]`:

```ts
{
  id: 'ideacion',
  icon: Lightbulb,
  number: '00',
  title: 'Ideación',
  focus: 'Descubre un problema real, entiende a quién le duele y formula tu primera solución',
  accent: 'green' as const,
  tools: [
    { name: 'Exploración de problemas', icon: Search, desc: 'Mapea retos y oportunidades de tu contexto. Identifica 3-5 problemas candidatos.' },
    { name: 'Selección del problema', icon: Filter, desc: 'Prioriza un problema con 4 criterios: urgencia, frecuencia, disposición a pagar, impacto climático.' },
    { name: 'Mapa de empatía', icon: Heart, desc: 'Describe quién sufre el problema: comportamientos, frustraciones y motivaciones.' },
    { name: 'Guía de entrevista', icon: MessageSquare, desc: 'Diseña y documenta preguntas para validar que el problema existe con 3-5 entrevistas.' },
    { name: 'Idea inicial', icon: Sparkles, desc: 'Sintetiza problema validado + cliente target + solución propuesta.' },
  ],
},
```

**Nota:** El tipo `accent` debe extenderse para incluir `'green'`, o usar un color existente como fallback. Verificar si el componente tiene estilos para un tercer accent color.

### 2. Accent color `green`
Agregar soporte visual en `StartupLifecycle.tsx` para el accent `green`:
- Color hex sugerido: `#22C55E` (Tailwind green-500) o `#16A34A` (green-600) para mejor contraste sobre dark background
- Aplicar en el mismo patrón que `ember` (#DA4E24) y `electric` (#1F77F6)

### 3. Herramientas interactivas (`/tools/[id]`)
Las 5 herramientas del módulo deben existir como herramientas funcionales en la plataforma. Cada una requiere:
- Registro en el catálogo de tools (donde estén definidas las demás)
- Formulario/interface interactiva con feedback AI
- Guardado en `tool_data` con `tool_id` único

**IDs de tools sugeridos:**
- `exploracion-problemas`
- `seleccion-problema`
- `mapa-empatia`
- `guia-entrevista`
- `idea-inicial`

### 4. Conexión con Pre-incubación
La Herramienta 5 (`idea-inicial`) debe generar un resumen estructurado que se muestre como punto de partida sugerido en:
- `propósito-equipo` (primera tool de Pre-incubación)
- `segmentacion` (segunda tool de Pre-incubación)

Implementación mínima: mostrar un banner/card en esas tools con "Basado en tu Idea inicial: [resumen]" si el founder completó el módulo 00.

---

## Fuera de scope

- Reordenar las herramientas existentes de Pre-incubación
- Cambiar el diseño visual de `StartupLifecycle.tsx`
- Onboarding automatizado que guíe al founder a Ideación primero
- Lógica de "desbloqueo progresivo" entre módulos
