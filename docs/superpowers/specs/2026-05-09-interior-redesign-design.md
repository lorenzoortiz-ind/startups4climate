# Interior Redesign — /tools/* y /admin/*

**Fecha:** 2026-05-09
**Versión:** 1.0
**Tipo:** Rediseño visual — sistema de diseño interno
**Alcance:** Sección founders `/tools/*` + sección admin `/admin/*`

---

## 1. Contexto

La interfaz interior de la plataforma (herramientas y panel admin) tenía un aspecto genérico que no reflejaba la identidad visual de Startups4Climate. Este rediseño establece un sistema de diseño cohesivo aplicado a ambas secciones, con una estética premium que diferencia S4C de herramientas "AI-generic".

**Principio rector:** Glass solo donde hay jerarquía (headers sticky que flotan sobre contenido), carbon plano en el cuerpo (secciones, inputs, tablas). 90% de la interfaz son neutrales oscuros; el color solo aparece en estados funcionales.

---

## 2. Design Tokens

### Paleta

| Token | Valor | Uso |
|-------|-------|-----|
| `--color-ember` | `#DA4E24` | Acción founders, estado activo, CTA principal |
| `--color-ember-subtle` | `rgba(218,78,36,0.15)` | Fondos de badges, section activa |
| `--color-ember-border` | `rgba(218,78,36,0.2)` | Bordes de elementos activos |
| `--color-cobalt` | `#1D4ED8` | Acento admin, acción secundaria |
| `--color-cobalt-light` | `#3B82F6` | Estado completado, info |
| `--color-cobalt-subtle` | `rgba(29,78,216,0.12)` | Fondos completado, admin sidebar active |
| `--color-cobalt-border` | `rgba(29,78,216,0.2)` | Bordes completado |
| `--color-base` | `#000000` | Fondo global |
| `--color-surface-1` | `#0A0A0A` | Sidebar, nav bar, action bar |
| `--color-surface-2` | `#0D0D0D` | Tool cards, stat cards |
| `--color-surface-3` | `#111111` | Secciones (ToolSection body) |
| `--color-surface-input` | `#0C0C0C` | Inputs, textareas |
| `--color-border` | `rgba(255,255,255,0.07)` | Borde estándar |
| `--color-border-subtle` | `rgba(255,255,255,0.05)` | Dividers, separadores internos |
| `--color-text-primary` | `rgba(255,255,255,0.85)` | Títulos, nombres, datos importantes |
| `--color-text-secondary` | `rgba(255,255,255,0.5)` | Body text, descripciones |
| `--color-text-muted` | `rgba(255,255,255,0.3)` | Labels, metadatos, estado inactivo |
| `--color-text-disabled` | `rgba(255,255,255,0.2)` | Elementos bloqueados, placeholders |

### Glass effect (solo headers sticky)

```css
background: rgba(10,10,10,0.88);
backdrop-filter: blur(20px);
-webkit-backdrop-filter: blur(20px);
border-bottom: 1px solid var(--color-border);
```

### Border radius

| Elemento | Radio |
|----------|-------|
| Modales, panels grandes | `16px` |
| Cards, secciones | `10px` |
| Inputs, botones | `6–7px` |
| Badges, pills | `20px` |
| Icon wrappers | `5–8px` |

---

## 3. Tipografía

**Sistema de dos capas:**

### Capa display — Mluvka (ya instalada)
- Uso: tool names (H1), page titles, step badges de módulo
- Weights: 700, 800
- Letter-spacing: `-0.025em`
- Line-height: `1.1`

```css
.t-display {
  font-family: 'Mluvka', sans-serif;
  font-weight: 800;
  letter-spacing: -0.025em;
}
```

### Capa UI — Geist (nueva dependencia)
- Uso: todo el texto operacional — labels, descripciones, inputs, tablas, body
- Import: `https://fonts.googleapis.com/css2?family=Geist:wght@300;400;500;600;700`
- Alternativa si no se quiere Google Fonts: `@vercel/font/geist` (package separado)

```css
/* globals.css — agregar después de Mluvka */
@import url('https://fonts.googleapis.com/css2?family=Geist:wght@300;400;500;600;700&display=swap');

body { font-family: 'Geist', -apple-system, sans-serif; }
```

### Escala tipográfica UI (Geist)

| Nombre | Tamaño | Weight | Uso |
|--------|--------|--------|-----|
| `t-tool-title` | `1rem` | `800` | Título de herramienta en header |
| `t-section-title` | `0.72rem` | `600` | Título de ToolSection |
| `t-body` | `0.72rem` | `400` | Descripciones, preguntas guía |
| `t-label` | `0.58rem` | `600` | Field labels (uppercase + tracking) |
| `t-meta` | `0.6rem` | `500` | Metadatos, step badges |
| `t-nano` | `0.55rem` | `600` | Tags, pills, tiempo estimado |

Labels siguen este patrón invariable:
```css
.field-label {
  font-size: 0.58rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.09em;
  color: var(--color-text-muted);
}
```

---

## 4. Sistema de iconos

**Librería:** `lucide-react` (ya instalada). **Prohibido usar emojis** en cualquier contexto de UI.

### Mapeo de etapas → íconos

| Etapa | Ícono Lucide | Color |
|-------|-------------|-------|
| Ideación (0) | `Lightbulb` | `#16A34A` |
| Pre-incubación (1) | `FlaskConical` | `#DA4E24` |
| Incubación (2) | `Rocket` | `#3B82F6` |
| Aceleración (3) | `Building2` | `#F0721D` |
| Escalamiento (4) | `TrendingUp` | `#5BB4FF` |

### Mapeo de estados → íconos

| Estado | Ícono Lucide | Color |
|--------|-------------|-------|
| Completada | `CheckCircle2` | `#22C55E` |
| En progreso | `Clock` | `#DA4E24` |
| Bloqueada | `Lock` | `rgba(255,255,255,0.25)` |
| Sin iniciar | `Circle` | `rgba(255,255,255,0.2)` |

### Stroke width estándar
Todos los iconos usan `strokeWidth={1.75}`. No mezclar con otros valores.

---

## 5. Componentes — shared.tsx

### 5.1 ToolSection

**3 estados visuales:**

```
Estado activo (sección expandida, en trabajo):
  - border: 1px solid rgba(218,78,36,0.2)
  - background: #111
  - section-num: background rgba(218,78,36,0.15), color #DA4E24, border ember
  - section-title: color rgba(255,255,255,0.85)
  - body: visible

Estado completado (colapsada, done):
  - border: 1px solid rgba(29,78,216,0.15)
  - background: rgba(29,78,216,0.02)
  - section-num: background rgba(29,78,216,0.12), color #3B82F6, ícono CheckCircle2
  - section-title: color rgba(255,255,255,0.4)
  - body: colapsado

Estado idle (colapsada, no iniciada):
  - border: 1px solid rgba(255,255,255,0.07)
  - background: #111
  - section-num: background rgba(255,255,255,0.05), color rgba(255,255,255,0.25)
  - section-title: color rgba(255,255,255,0.35)
  - body: colapsado
```

**Section header:**
```tsx
// padding: 0.6rem 0.85rem
// display: flex, align-items: center, gap: 0.55rem
// border-bottom: 1px solid var(--color-border-subtle) cuando expanded
```

**Field label (dentro de sec-body):**
```tsx
<label style={{
  display: 'block',
  fontSize: '0.58rem',
  fontWeight: 600,
  textTransform: 'uppercase',
  letterSpacing: '0.09em',
  color: 'var(--color-text-muted)',
  marginBottom: '0.3rem',
  fontFamily: 'Geist, sans-serif',
}}>
  {label}
</label>
```

**Input / Textarea (exportar como `inputStyle` / `textareaStyle`):**
```tsx
export const inputStyle: React.CSSProperties = {
  width: '100%',
  background: 'var(--color-surface-input)',
  border: '1px solid var(--color-border)',
  borderRadius: '7px',
  padding: '0.55rem 0.7rem',
  fontSize: '0.65rem',
  color: 'var(--color-text-secondary)',
  fontFamily: 'Geist, sans-serif',
  outline: 'none',
  transition: 'border-color 0.15s',
}
// :focus → border-color: rgba(218,78,36,0.3)
```

### 5.2 ToolActionBar

**Layout:** `height: 46px`, `background: var(--color-surface-1)`, `border-top: 1px solid var(--color-border)`, `display: flex`, `align-items: center`, `padding: 0 1.25rem`, `gap: 0.6rem`.

**Elementos (izquierda → derecha):**
1. Estado en texto: `"{n}/{total} secciones · guardado hace {t}"` — `font-size: 0.6rem`, `color: var(--color-text-disabled)`, `margin-right: auto`
2. Botón "Guardar" — ghost style
3. Botón "↓ Reporte" — cobalt subtle (solo si `onReport` definido)
4. Botón "Completar →" — ember fill (CTA principal)

```tsx
// Estilos de botones
const btnGhost = {
  fontSize: '0.63rem', fontWeight: 500,
  padding: '5px 12px', borderRadius: '6px',
  background: 'transparent',
  color: 'rgba(255,255,255,0.45)',
  border: '1px solid rgba(255,255,255,0.1)',
  fontFamily: 'Geist, sans-serif', cursor: 'pointer',
}

const btnPrimary = {
  fontSize: '0.63rem', fontWeight: 700,
  padding: '5px 14px', borderRadius: '6px',
  background: '#DA4E24', color: '#fff', border: 'none',
  fontFamily: 'Geist, sans-serif', cursor: 'pointer',
}

const btnReport = {
  fontSize: '0.63rem', fontWeight: 500,
  padding: '5px 12px', borderRadius: '6px',
  background: 'rgba(29,78,216,0.12)',
  color: '#3B82F6',
  border: '1px solid rgba(29,78,216,0.2)',
  fontFamily: 'Geist, sans-serif', cursor: 'pointer',
}
```

### 5.3 ToolProgress

Barra de progreso segmentada (una barra por sección, no porcentaje):

```tsx
// N barras horizontales, gap: 2px, height: 3px, border-radius: 2px
// Completada: background #3B82F6
// Activa: background #DA4E24
// Pendiente: background rgba(255,255,255,0.08)
```

---

## 6. ToolPage.tsx — Header sticky

### Estructura de capas

```
┌─────────────────────────────────────────────────┐
│  Nav bar (44px) — sticky top:0 — GLASS          │  ← tools/layout.tsx
├─────────────────────────────────────────────────┤
│  Tool header (variable) — sticky top:44px — GLASS│  ← ToolPage.tsx
│  ┌───────────────────────┬─────────────────────┐ │
│  │ step badge · stage    │                     │ │
│  │ TOOL TITLE (Mluvka)   │  outputs checklist  │ │
│  │ pregunta guía         │  (cobalt/empty)     │ │
│  └───────────────────────┴─────────────────────┘ │
├─────────────────────────────────────────────────┤
│  Tool body (scroll) — CARBON FLAT               │  ← ToolPage.tsx
│  ToolSections...                                │
├─────────────────────────────────────────────────┤
│  ToolActionBar (46px) — CARBON FLAT             │  ← ToolPage.tsx
└─────────────────────────────────────────────────┘
```

### Tool header — especificación

```tsx
// Contenedor
position: 'sticky'
top: 44  // debajo del nav bar (nav bar: zIndex 50, tool header: zIndex 40)
zIndex: 40
background: 'rgba(10,10,10,0.88)'
backdropFilter: 'blur(20px)'
WebkitBackdropFilter: 'blur(20px)'
borderBottom: '1px solid rgba(255,255,255,0.07)'
padding: '0.85rem 1.5rem 0.9rem'

// Layout interno: grid 2 columnas (1.6fr / 1fr)
// Columna izquierda:
//   - Fila 1: step badge + stage label (flex, gap 0.5rem)
//   - Fila 2: título (Mluvka 800, 1rem, tracking -0.025em)
//   - Fila 3: pregunta guía (Geist 0.65rem, rgba(255,255,255,0.45))
// Columna derecha:
//   - Lista de outputs (flex-col, gap 0.2rem)
//   - Cada output: checkbox 11px (cobalt done / empty) + texto 0.58rem
```

**Step badge:**
```tsx
// background: rgba(218,78,36,0.15)
// color: #DA4E24
// border: 1px solid rgba(218,78,36,0.2)
// font-size: 0.58rem, font-weight: 700
// padding: 2px 8px, border-radius: 20px
// font-family: Geist
```

### Comportamiento sticky al scroll

El tool header se vuelve visualmente separado del cuerpo cuando el usuario scrollea. Implementar con `position: 'sticky'` nativo — no `position: 'fixed'`. El efecto glass (backdrop-blur) crea el contraste visual necesario sin JavaScript.

**Transición al hacer scroll** (opcional, MOTION_INTENSITY bajo):
```tsx
// Agregar box-shadow sutil cuando scrolled:
// box-shadow: 0 1px 0 rgba(255,255,255,0.05), 0 4px 16px rgba(0,0,0,0.4)
// Detectar con useEffect + scroll listener en el contenedor del tool body
```

---

## 7. Tools Layout — /tools/layout.tsx

### Nav bar (top, sticky)

```
height: 52px
background: rgba(8,8,8,0.92), backdrop-filter: blur(16px)
border-bottom: 1px solid var(--color-border)

Elementos:
  [izq] Logo S4C (16px, ember bg) + "Tools / founders" (Geist 0.72rem)
  [der] Stage pill (ember) + botón "↓ Reporte global" (ghost)
```

### Sidebar izquierdo

```
width: 220px
background: var(--color-surface-1)
border-right: 1px solid var(--color-border)
```

**Header del sidebar:**
```
height: 52px, border-bottom: 1px solid var(--color-border)
[Logo S4C 22px] [Nombre sección]
```

**Secciones por etapa (colapsables):**
```tsx
// Section header: padding 0.3rem 1rem
//   - Dot de color de etapa (6px, border-radius 50%)
//   - Label etapa (Geist 0.68rem, font-weight 600)
//   - Contador "N/total" (Geist 0.58rem, muted) — alineado a la derecha
//   - Chevron ▾/▸

// Tool item: padding 0.28rem 1rem 0.28rem 2.1rem
//   - Check icon (12px): done=cobalt, active=ember, empty=border only
//   - Nombre tool (Geist 0.63rem)
//   - Estado activo: background rgba(218,78,36,0.08) + borde izq 2px ember

// Etapas futuras (bloqueadas): opacity 0.3, Lock icon en lugar de contador
```

**Sección transversales:**
```
Label "Transversales" (uppercase, 0.55rem, muted)
Items: Mentor AI, Passport — mismo estilo que tools
```

**Footer del sidebar:**
```
border-top: 1px solid var(--color-border-subtle)
padding: 0.65rem 1rem
[Avatar usuario 24px (cobalt subtle)] [Nombre] [Ícono logout]
```

---

## 8. Tools Dashboard — /tools/page.tsx

### Topbar

```
height: 52px, glass
[título "Dashboard"] [...] [stage pill ember] [btn reporte global ghost]
```

### Barra de progreso por etapa

```tsx
// Grid de 5 columnas (una por etapa)
// Cada celda:
//   - background: #0C0C0C, border: 1px solid var(--color-border)
//   - Etapa activa: border-color rgba(218,78,36,0.2), background rgba(218,78,36,0.03)
//   - Stage name: Geist 0.6rem, font-weight 600
//   - Barra 3px: completada=#3B82F6, activa=#DA4E24, pendiente=rgba(255,255,255,0.06)
//   - Fracción "N/total": Geist 0.58rem, muted
//   - Etapas bloqueadas: opacity 0.25
```

### Tool cards

```tsx
// Grid 3 columnas, gap 0.55rem
// background: var(--color-surface-2), border: 1px solid var(--color-border)
// border-radius: 8px, padding: 0.75rem 0.85rem

// Card activa: border-color rgba(218,78,36,0.2), background rgba(218,78,36,0.03)
// Card completada: border-color rgba(29,78,216,0.12), opacity 0.7

// Layout interno:
//   Fila 1: step "DE Step N" (Geist 0.55rem, muted) + status dot
//   Fila 2: nombre tool (Geist 0.7rem, font-weight 700)
//   Fila 3 (solo activa/no iniciada): pregunta guía corta (0.6rem, muted)
//   Footer: categoría (colored) + tiempo estimado (muted)
```

---

## 9. Admin Layout — /admin/layout.tsx

El admin usa **el mismo sistema de tokens** que founders con las siguientes diferencias:

### Acento diferenciado

| Contexto | Acento | Justificación |
|----------|--------|---------------|
| Founders `/tools/*` | Ember `#DA4E24` | Acción, energía, progreso |
| Admin `/admin/*` | Cobalt `#1D4ED8` / `#3B82F6` | Confianza, gestión, institucional |

### Sidebar admin

```
width: 190px
background: var(--color-surface-1)
border-right: 1px solid var(--color-border)

Header:
  height: 48px
  [Org avatar 22px (cobalt subtle)] [org name Geist 0.65rem font-weight 600]

Nav items:
  padding: 0.32rem 1rem
  font-size: 0.65rem (Geist)
  color: rgba(255,255,255,0.35) por defecto
  Activo: color #fff, background rgba(29,78,216,0.08), borde izq 2px #1D4ED8
  Badge solicitudes pendientes: ember pill (urgencia)
```

### Topbar admin

```
height: 48px, glass idéntico al de founders
[Page title Mluvka o Geist 700] [...] [acción principal cobalt]
```

---

## 10. Admin — Páginas internas

### Tablas (cohortes, founders, solicitudes)

```tsx
// Contenedor: border: 1px solid var(--color-border), border-radius: 8px, overflow: hidden

// thead:
//   background: rgba(255,255,255,0.02)
//   border-bottom: 1px solid rgba(255,255,255,0.06)
//   th: Geist 0.55rem, uppercase, letter-spacing 0.09em, color muted, font-weight 700

// tbody rows:
//   border-bottom: 1px solid rgba(255,255,255,0.04)
//   td: Geist 0.63rem, color text-secondary
//   td nombre/primario: font-weight 600, color text-primary
//   hover: background rgba(255,255,255,0.02)

// Status pills:
//   Activa/aprobada: cobalt subtle + cobalt light text
//   Pendiente/borrador: ember subtle + ember text
//   Finalizada/inactiva: rgba(255,255,255,0.05) + text-disabled
```

### Stat cards (dashboard admin)

```tsx
// background: var(--color-surface-2)
// border: 1px solid var(--color-border)
// border-radius: 9px, padding: 0.7rem 0.85rem
// value: Geist/Mluvka 1rem font-weight 800, color text-primary
// label: Geist 0.58rem uppercase letter-spacing 0.07em color text-disabled
// Card con alerta: ember subtle border + ember text para stat urgente
```

### Formularios admin (configuración)

Mismos estilos que ToolSection: labels uppercase Geist, inputs `inputStyle`, botones del mismo sistema. Sin glassmorphism en ningún caso.

---

## 11. Motion

**Principio:** mínimo y funcional. No hay animaciones decorativas. Solo transiciones que comunican estado.

| Elemento | Transición |
|----------|-----------|
| ToolSection expand/collapse | `height` con `AnimatePresence` + spring suave (`stiffness: 200, damping: 25`) |
| Tool card hover | `border-color 0.15s ease`, `background 0.15s ease` |
| Sidebar nav item active | `background 0.12s ease` |
| Sticky header shadow | `box-shadow 0.2s ease` al detectar scroll |
| Botones `:active` | `transform: scale(0.97) 0.08s` |

No usar `framer-motion` para elementos que ya funcionan con CSS `transition`. Preservar los `motion.div` existentes en ToolPage para la animación de entrada de la herramienta.

---

## 12. Archivos afectados

| Archivo | Cambio |
|---------|--------|
| `src/app/globals.css` | Agregar import Geist, nuevos tokens CSS (`--color-cobalt`, `--color-cobalt-*`) |
| `src/components/tools/shared.tsx` | Rediseño completo: ToolSection, ToolActionBar, ToolProgress, inputStyle, textareaStyle, labelStyle |
| `src/components/tools/ToolPage.tsx` | Tool header sticky glass, layout 2 cols con outputs checklist |
| `src/app/tools/layout.tsx` | Nav bar glass, sidebar por etapas colapsable, footer con user avatar |
| `src/app/tools/page.tsx` | Topbar glass, progress bar 5 etapas, tool cards rediseñadas |
| `src/app/admin/layout.tsx` | Sidebar cobalt, nav items, org avatar, topbar glass |
| `src/app/admin/page.tsx` | Stat cards, topbar |
| `src/app/admin/cohortes/page.tsx` | Tabla flat carbon, stat cards |
| `src/app/admin/configuracion/page.tsx` | Formularios con inputStyle unificado |
| `src/app/admin/reportes/page.tsx` | Cards y botones con nuevo sistema |

**Las 37 herramientas heredan automáticamente** los cambios en `shared.tsx` sin necesidad de modificar ningún archivo individual de herramienta.

---

## 13. Paridad Demo / Live

Según CLAUDE.md, cualquier cambio en `/tools/*` y `/admin/*` debe replicarse en:
- `/demo/founder` ↔ `/tools/*`
- `/demo/admin` ↔ `/admin/*`

Las rutas demo usan los mismos componentes compartidos (`shared.tsx`, `ToolPage.tsx`, `layout.tsx`). Si el redesign se hace correctamente vía tokens CSS y componentes compartidos, la paridad es automática.

---

## 14. Fuera de scope

- Rediseño de la landing `/` (tiene su propio spec `2026-05-06-landing-redesign-design.md`)
- Refactor de lógica de negocio (progress tracking, Supabase queries)
- Cambios en el auth flow
- Superadmin (`/superadmin/*`) — misma metodología pero spec separado
- Animaciones complejas (scroll-triggered, parallax)
- Mobile/responsive — se verifica que no rompa, no se rediseña el mobile en este sprint
- Tema claro (light mode)
