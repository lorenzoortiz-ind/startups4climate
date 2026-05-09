# Tools UX Polish — Startups4Climate

**Fecha:** 2026-05-09  
**Objetivo:** Mejorar visibilidad del redesign interior, consistencia de anchos, navegación, y calidad visual de Radar/Oportunidades/Perfil  
**Superficies:** `/tools/*` (ToolPage, shared, layout, dashboard, radar, oportunidades, perfil)  
**Fuera de scope:** Admin, landing, superadmin, DiagnosticForm, nuevas features de AI

---

## 1. Sistema de anchos unificado

### Contenedor global

Todos los `/tools/*` comparten un único contenedor raíz:

```
max-width: 1200px
margin: 0 auto
padding: 0 1.5rem   /* 24px cada lado → 1152px usable */
```

Actualmente hay 4 valores distintos (720, 900, 960, 1200). Se unifican todos a 1200px de contenedor, con el layout interno resolviendo la proporción.

### Layout por página

| Página | Grid interno | Col izquierda | Col derecha |
|--------|-------------|---------------|-------------|
| Tool interior (ToolPage) | `1fr 228px` | contenido principal | panel contextual |
| Radar | `200px 1fr` | filtros persistentes | lista de items |
| Oportunidades | `200px 1fr` | filtros persistentes | lista de items |
| Perfil | `280px 1fr` (dentro del main) | avatar + score + stats | secciones editables |
| Dashboard (`/tools`) | sin cambio | — | — |

Gap entre columnas: `1.5rem` en todos los casos.  
En mobile (`< 768px`): todas las columnas se colapsan a una sola.

---

## 2. ToolPage — header sticky + panel contextual + secciones colapsables

### 2.1 Header sticky

El header actual ya es `position: sticky; top: 44px`. Se modifica su contenido:

**Layout actual:** back button · divider · etapa · herramienta · ToolProgress dots

**Layout nuevo:** back button · divider · breadcrumb `Etapa · Herramienta` · `flex:1` spacer · badge de progreso

**Badge de progreso (SectionBadge):**
- Formato: `N/Total · Nombre de sección activa ▾`
- Estilo: `background: rgba(218,78,36,0.10)`, `border: 1px solid rgba(218,78,36,0.25)`, `borderRadius: 6px`, `padding: 3px 10px`
- Color count: `#DA4E24`, texto sección: `rgba(255,255,255,0.6)`, chevron: `rgba(255,255,255,0.3)`
- Al hacer click: abre dropdown con lista de todas las secciones + estado (done/active/idle)
- Click en item del dropdown: scroll suave a esa sección con offset de 44px (altura header) + 8px extra
- El dropdown se cierra al hacer click fuera o al seleccionar item

**Dropdown de secciones:**
- Fondo `#141414`, border `rgba(255,255,255,0.09)`, borderRadius 8px, padding 6px
- Cada fila: dot de estado (cobalt=done, ember=active, gris=idle) + nombre de sección
- Fila activa: `background: rgba(218,78,36,0.08)`
- Ancho: 220px, posición: `top: 100%; right: 0`

**ToolProgress dots:** se eliminan del header (reemplazados por el badge).

### 2.2 Layout de dos columnas

Debajo del header, el contenido pasa de `maxWidth: 900` centrado a grid de dos columnas dentro del contenedor 1200px:

```
display: grid
grid-template-columns: 1fr 228px
gap: 1.5rem
align-items: start
padding: 1.5rem 0
```

La columna `1fr` contiene las ToolSections. La columna de 228px contiene el panel contextual.

### 2.3 ToolSection — colapsable (toggle libre)

`ToolSection` en `shared.tsx` se convierte en acordeón con toggle libre:

**Estado inicial:**
- Sección `state='done'`: comienza **colapsada**
- Sección `state='active'`: comienza **expandida**
- Sección `state='idle'`: comienza **colapsada**

**Comportamiento:**
- Click en el header de cualquier sección la expande o colapsa independientemente
- Varias secciones pueden estar abiertas simultáneamente
- Sin animación de collapse (solo display toggle) para evitar complejidad con contenido dinámico variable

**Header de ToolSection (nuevo):**
```
display: flex
align-items: center
justify-content: space-between
padding: 0.625rem 0.875rem
border-radius: 8px
cursor: pointer
user-select: none
```

- Lado izquierdo: número de sección (`01`) en badge + nombre + check si done
- Lado derecho: chevron `▸` rotado 90° cuando expandida

**Chevron:** Lucide `ChevronRight` size={14}, `transition: transform 0.15s ease`, `transform: rotate(90deg)` cuando abierta

**Estado interno:** `useState<boolean>` local en ToolSection, inicializado según el `state` prop

**API backward-compatible:** no cambia ninguna prop existente. Se añade `defaultOpen?: boolean` opcional que sobreescribe el comportamiento por default.

### 2.4 Panel contextual (ContextPanel)

Nuevo componente `ContextPanel` en `src/components/tools/ContextPanel.tsx`:

```typescript
interface ContextPanelProps {
  toolId: string           // para cargar outputs relevantes
  activeSectionLabel: string
  tip?: string             // tip para la sección activa
}
```

**Sección A — Outputs de herramientas anteriores:**
- Requiere verificar que el registro de herramientas (buscar `TOOL_META`, `TOOLS_REGISTRY` o equivalente en el codebase) incluya un array `feeds_into: string[]` por herramienta. Si no existe, el implementador debe añadirlo al registro antes de implementar este componente.
- Lee `tool_data` de las herramientas que listan el tool actual en sus `feeds_into[]`
- Muestra máximo 3 outputs, cada uno en una card:
  - Header: nombre de la herramienta origen en azul cobalto `rgba(59,130,246,0.6)`
  - Label del output en `rgba(255,255,255,0.25)` uppercase 7px
  - Valor en `rgba(255,255,255,0.5)` 8px, truncado a 3 líneas
- Si no hay outputs previos: no muestra la sección (sin estado vacío ruidoso)

**Sección B — Tip contextual:**
- Un párrafo de texto, `rgba(255,255,255,0.45)`, 8px, `line-height: 1.4`
- Borde izquierdo: `2px solid rgba(218,78,36,0.35)`, fondo `rgba(218,78,36,0.06)`
- Se define el tip por sección directamente en cada archivo de herramienta (prop `tip` en ToolSection)
- Si no hay tip: sección no se muestra

**Layout del panel:**
```
display: flex
flex-direction: column
gap: 1rem
padding-top: 0   /* el panel no tiene header propio */
position: sticky
top: calc(44px + 44px + 1.5rem)  /* nav + tool header + gap */
```

---

## 3. Radar y Oportunidades — rediseño a lista densa

### Estructura nueva (ambas páginas)

```
<página>
  <header>     título + metadata (count + última actualización)
  <body>
    <filtros>  columna 200px con grupos de filtros
    <lista>    columna 1fr con filas de items
```

### Header de página

```
padding: 1.25rem 0
border-bottom: 1px solid rgba(255,255,255,0.07)
display: flex
align-items: flex-end
justify-content: space-between
```

- Título: `font-size: 1.125rem`, `font-weight: 700`, `color: rgba(255,255,255,0.88)`
- Subtítulo: `font-size: 0.6875rem`, `color: rgba(255,255,255,0.35)` — `"N artículos · actualizado hace X min"`
- Sin cursivas

### Panel de filtros (columna 200px)

```
border-right: 1px solid rgba(255,255,255,0.06)
padding: 1rem 0.75rem 1rem 0
display: flex
flex-direction: column
gap: 0.25rem
```

**Grupos de filtros:**
- Label de grupo: 7px monospace uppercase, `rgba(255,255,255,0.2)`, `margin: 0.75rem 0 0.25rem` (0 el primero)
- Item: 8px, `rgba(255,255,255,0.4)`, `padding: 4px 8px`, `borderRadius: 5px`, cursor pointer
- Item activo: `background: rgba(218,78,36,0.10)`, `color: #DA4E24`

**Radar — grupos de filtros:**
- Categoría: Todos, Energía, Agua, Economía circular, Biodiversidad, Movilidad, Fondos
- Región: LATAM, Perú, México, Colombia, Chile, Brasil

**Oportunidades — grupos de filtros:**
- Tipo: Todos, Grant, Fondo, Competencia, Aceleración, Convocatoria
- Etapa: Pre-seed, Seed, Serie A, Cualquiera
- Región: LATAM, Global

**Comportamiento:** filtros son state local (`useState`), combinables (categoría AND región). Al cambiar un filtro se filtra el array en memoria (no nueva llamada a Supabase). "Todos" desactiva los otros items del grupo.

### Lista de items (columna `1fr`)

```
padding: 1rem 0 1rem 1.5rem
display: flex
flex-direction: column
gap: 0.375rem
```

**Fila de item:**
```
display: flex
align-items: center
gap: 0.75rem
padding: 0.5rem 0.75rem
border-radius: 7px
border: 1px solid rgba(255,255,255,0.06)
background: #111111
cursor: pointer   /* abre source_url en nueva tab */
```

Hover: `border-color: rgba(255,255,255,0.12)`, `background: #161616`

Estructura interna de fila:
- Dot de color (5×5px circle): ember para Radar, cobalt para Fondos en Oportunidades
- Columna de texto: título (9px 600 `rgba(255,255,255,0.78)`) + fuente · tiempo (7px `rgba(255,255,255,0.3)`)
- Tag de categoría al extremo derecho: 7px monospace, `borderRadius: 3px`, ember o cobalt según tipo

---

## 4. Perfil — tipografía y layout

### Escala tipográfica unificada

Reemplaza todos los valores hardcodeados (`0.75rem`, `0.875rem`, `0.9375rem`, `clamp(...)`, `var(--text-heading-md)`) por tokens:

| Uso | Token | Valor |
|-----|-------|-------|
| Label de campo | `--text-2xs` | 0.5625rem |
| Texto auxiliar / meta | `--text-xs` | 0.6875rem |
| Texto de campo / descripción | `--text-sm` | 0.8125rem |
| Texto principal | `--text-body` | 0.9375rem |
| Nombre del startup / header | `--text-heading-sm` | 1.125rem |
| Nombre del founder (grande) | `--text-heading-md` | 1.375rem |
| Score circular | 2rem (excepción — display number) | — |

### Layout nuevo del perfil

El archivo `src/app/tools/perfil/page.tsx` pasa de `maxWidth: 720` centrado a dos columnas dentro del contenedor 1200px:

**Columna izquierda (280px fijo):**
```
position: sticky
top: calc(44px + 1.5rem)
```
- Avatar circular (64px) con iniciales
- Nombre del founder (`--text-heading-md`, weight 700)
- Nombre del startup (`--text-heading-sm`, weight 600, `rgba(255,255,255,0.6)`)
- Divider
- Score de diagnóstico (número grande 2rem en ember, label "Startup Readiness")
- Etapa actual (badge ember)
- Divider
- Stats compactas: herramientas completadas, secciones llenadas
- Divider
- Link a "Editar perfil público" si aplica

**Columna derecha (`1fr` ~844px):**
Secciones acordeón iguales que las de ToolSection (mismo componente):
1. Información básica (nombre, país, vertical, etapa)
2. Sobre tu startup (descripción, web, redes)
3. Métricas actuales (MRR, usuarios, empleados)
4. Configuración de cuenta (email, password reset)

Sin panel contextual en perfil (no aplica outputs ni tips).

---

## 5. Tipografía — eliminar cursivas

**Regla global:** `fontStyle: 'italic'` se elimina de todos los archivos bajo `/src/`.

**Reemplazo:** el texto de ayuda/hint/placeholder que usaba italic pasa a `color: rgba(255,255,255,0.35)` sin italic.

**Archivos a modificar:**
- `src/components/tools/ToolPage.tsx` (línea 438)
- `src/components/tools/FullLifecycleUseCase.tsx`
- `src/components/tools/QuantifiedValueProp.tsx`
- `src/components/tools/FirstTenCustomers.tsx`
- `src/components/tools/CoreCompetitivePosition.tsx`
- `src/components/tools/LeanCanvas.tsx`
- `src/components/tools/ProductSpecification.tsx`
- `src/app/tools/passport/page.tsx`
- `src/app/tools/radar/page.tsx`

**No se cambia:** `font-style: italic` en citas textuales explícitas (`<blockquote>`, `<cite>`) si las hubiera — ninguna existe actualmente.

---

## 6. Cambios técnicos transversales

### Archivos nuevos
- `src/components/tools/ContextPanel.tsx` — panel contextual B+C
- `src/components/tools/SectionBadge.tsx` — badge de progreso del header con dropdown

### Archivos modificados
- `src/components/tools/shared.tsx` — ToolSection colapsable, eliminar ToolProgress del export o marcarlo deprecated
- `src/components/tools/ToolPage.tsx` — grid 2 cols, SectionBadge en header, eliminar ToolProgress
- `src/app/tools/radar/page.tsx` — rediseño completo
- `src/app/tools/oportunidades/page.tsx` — rediseño completo
- `src/app/tools/perfil/page.tsx` — layout 2 cols + tipografía unificada
- 9 archivos de componentes de herramientas — eliminar `fontStyle: 'italic'`

### Sin cambios
- `src/app/tools/page.tsx` (dashboard) — maxWidth ya es 1200, no requiere cambios
- `src/app/tools/layout.tsx` — sidebar y nav sin cambios
- Herramientas individuales — no se modifican salvo el italic removal

### Mobile
- `< 768px`: grid de 2 cols → 1 col en tool interior, radar, oportunidades, perfil
- Panel contextual en mobile: colapsado en un acordeón al inicio de la página
- SectionBadge: visible en mobile, dropdown funciona igual

### Accesibilidad
- SectionBadge: `aria-expanded`, `aria-haspopup="listbox"` en el botón
- ContextPanel outputs: `aria-label="Outputs de herramientas anteriores"`
- ToolSection toggle: `aria-expanded` en el header

---

## Fuera de scope

- Refactor de DiagnosticForm
- Nuevas features de AI en el panel contextual
- Cambios en `/admin`, `/superadmin`, o landing
- Animaciones de colapso con height transition (complejidad alta, bajo valor)
- Persistir estado de secciones colapsadas en localStorage
