# Startups4Climate — Arquitectura técnica y filosofía de diseño

> Documento de referencia sobre las decisiones técnicas, stack tecnológico y filosofía de diseño de la plataforma.
> Fecha de generación: 27 de marzo de 2026.

---

## 1. Filosofía general

La plataforma está construida bajo tres principios:

1. **Velocidad de iteración sobre perfección**: se priorizó llegar rápido a un producto funcional que pueda validarse con usuarios reales. El stack completo (framework, hosting, base de datos, autenticación) fue elegido para minimizar fricción de desarrollo y costo operativo.

2. **CSS-in-JS con design tokens**: en lugar de usar una librería de componentes como shadcn/ui o Material UI, todo el diseño está implementado con estilos inline y CSS variables. Esto da control total sobre la estética sin depender de abstracciones de terceros, y permite iterar el diseño directamente en el componente sin saltar entre archivos.

3. **Client-first con persistencia dual**: la plataforma funciona 100% en el cliente (`'use client'`). Los datos se guardan primero en `localStorage` (velocidad) y se sincronizan en background con Supabase (persistencia). Esto permite que la app funcione offline y sea extremadamente rápida.

---

## 2. Stack tecnológico

### Core
| Tecnología | Versión | Propósito |
|---|---|---|
| **Next.js** | 16.2.1 | Framework React con App Router, Turbopack |
| **React** | 19.2.4 | UI library |
| **TypeScript** | ^5 | Tipado estricto (`strict: true`) |
| **Tailwind CSS** | v4 | Utilidades CSS (usado mínimamente, mayormente CSS-in-JS) |

### UI y animaciones
| Tecnología | Versión | Propósito |
|---|---|---|
| **Framer Motion** | 12.38.0 | Animaciones declarativas, whileInView, stagger, reduced-motion |
| **Lucide React** | 1.6.0 | Iconografía (120+ íconos usados en toda la plataforma) |

### Formularios y validación
| Tecnología | Versión | Propósito |
|---|---|---|
| **React Hook Form** | 7.72.0 | Formularios performantes (diagnóstico, perfil, checkout) |
| **@hookform/resolvers** | 5.2.2 | Integración con Zod |
| **Zod** | 4.3.6 | Validación de schemas (contactSchema, formularios) |

### Backend y datos
| Tecnología | Versión | Propósito |
|---|---|---|
| **Supabase JS** | 2.100.0 | Base de datos PostgreSQL, autenticación, almacenamiento |
| **localStorage** | - | Persistencia primaria client-side (auto-guardado) |

### Infraestructura
| Tecnología | Propósito |
|---|---|
| **Vercel** | Hosting, CI/CD, edge network |
| **GitHub** | Repositorio, control de versiones |
| **Stripe** | Pasarela de pagos (pendiente de configuración) |

### Dev tools
| Tecnología | Versión | Propósito |
|---|---|---|
| **ESLint** | ^9 | Linting con eslint-config-next |
| **@tailwindcss/postcss** | ^4 | Procesamiento de CSS |
| **Turbopack** | (integrado en Next.js 16) | Bundler de desarrollo |

---

## 3. Arquitectura de la aplicación

### Estructura de directorios

```
src/
├── app/                          # App Router (Next.js)
│   ├── layout.tsx                # Root layout (fonts, AuthProvider)
│   ├── page.tsx                  # Landing page
│   ├── globals.css               # Design tokens, dark mode, animaciones CSS
│   ├── checkout/
│   │   └── page.tsx              # Checkout con Stripe
│   ├── productos/
│   │   └── page.tsx              # Catálogo público de productos
│   ├── servicios/
│   │   └── page.tsx              # Catálogo público de servicios
│   └── tools/                    # Plataforma (requiere auth)
│       ├── layout.tsx            # Sidebar + navbar de la plataforma
│       ├── page.tsx              # Dashboard principal (24 herramientas)
│       ├── [id]/page.tsx         # Vista individual de herramienta (dinámica)
│       ├── perfil/page.tsx       # Edición de perfil de usuario
│       ├── productos/page.tsx    # Productos dentro de la plataforma
│       ├── recursos/page.tsx     # Stack tech recomendado por etapa
│       └── servicios/page.tsx    # Servicios dentro de la plataforma
│
├── components/                   # Componentes de la landing
│   ├── Hero.tsx                  # Sección hero con stats y card de preview
│   ├── SocialProof.tsx           # Línea de confianza
│   ├── ProblemSection.tsx        # Los dos problemas (capital + conocimiento)
│   ├── ValueProp.tsx             # 4 pilares de la plataforma
│   ├── StartupLifecycle.tsx      # 4 etapas con herramientas por etapa
│   ├── DiagnosticFeature.tsx     # Sección explicativa del diagnóstico
│   ├── DiagnosticForm.tsx        # Formulario de diagnóstico (10 preguntas)
│   ├── AboutRedesignLab.tsx      # Equipo + logos de aliados
│   ├── CTAFinal.tsx              # CTA final de la landing
│   ├── Navbar.tsx                # Navegación principal
│   ├── Footer.tsx                # Footer
│   ├── AuthModal.tsx             # Modal de login/registro
│   ├── S4CLogo.tsx               # Logotipo SVG
│   ├── FadeUp.tsx                # Componente reutilizable de animación
│   ├── AnimatedCounter.tsx       # Contadores animados (stats del hero)
│   ├── Services.tsx              # Servicios (landing, legacy)
│   ├── ServicesDetail.tsx        # Detalle de servicios (landing, legacy)
│   ├── ForInvestors.tsx          # Sección para inversores (landing, legacy)
│   └── tools/                    # Componentes de herramientas
│       ├── ToolPage.tsx          # Wrapper universal de herramienta
│       ├── DarkModeToggle.tsx    # Toggle de tema claro/oscuro
│       ├── ServiceBanner.tsx     # Banner de servicio relacionado
│       ├── PassionPurpose.tsx    # Herramienta 1
│       ├── MarketSegmentation.tsx # Herramienta 2
│       ├── BeachheadMarket.tsx   # Herramienta 3
│       ├── EndUserProfile.tsx    # Herramienta 4
│       ├── TAMCalculator.tsx     # Herramienta 5
│       ├── PersonaProfile.tsx    # Herramienta 6
│       ├── FullLifecycleUseCase.tsx # Herramienta 7
│       ├── ProductSpecification.tsx # Herramienta 8
│       ├── QuantifiedValueProp.tsx  # Herramienta 9
│       ├── FirstTenCustomers.tsx    # Herramienta 10
│       ├── CoreCompetitivePosition.tsx # Herramienta 11
│       ├── LeanCanvas.tsx           # Herramienta 12
│       ├── DecisionMakingUnit.tsx   # Herramienta 13
│       ├── CustomerAcquisitionProcess.tsx # Herramienta 14
│       ├── BusinessModelDesign.tsx  # Herramienta 15
│       ├── PricingFramework.tsx     # Herramienta 16
│       ├── UnitEconomics.tsx        # Herramienta 17
│       ├── SalesProcessMap.tsx      # Herramienta 18
│       ├── KeyAssumptions.tsx       # Herramienta 19
│       ├── MVBPDefinition.tsx       # Herramienta 20
│       ├── TractionValidation.tsx   # Herramienta 21
│       ├── ProductPlanScaling.tsx   # Herramienta 22
│       ├── PitchDeck.tsx            # Herramienta 23
│       ├── CapTable.tsx             # Herramienta 24
│       └── [legacy]                 # Componentes de versiones anteriores
│           ├── TRLCalculator.tsx
│           ├── ERPEstimator.tsx
│           ├── FounderAudit.tsx
│           ├── Bankability.tsx
│           ├── LabToMarket.tsx
│           ├── DataRoom.tsx
│           ├── ReverseDueDiligence.tsx
│           ├── PilotsFramework.tsx
│           ├── CapitalStack.tsx
│           ├── StakeholderMatrix.tsx
│           └── BusinessModels.tsx
│
├── context/
│   └── AuthContext.tsx           # Provider de autenticación (localStorage + Supabase)
│
└── lib/
    ├── supabase.ts               # Cliente Supabase (URL + anon key desde .env)
    ├── tools-data.ts             # Definición de las 24 herramientas (id, name, stage, etc.)
    ├── progress.ts               # CRUD de progreso (localStorage + sync Supabase)
    ├── useToolState.ts           # Hook genérico de estado con auto-guardado (debounce 500ms)
    └── report-formatters.ts      # Formateo de reportes por herramienta (Markdown/texto)
```

### Rutas de la aplicación

| Ruta | Tipo | Descripción |
|---|---|---|
| `/` | Estática | Landing page (hero, problema, plataforma, ciclo de vida, diagnóstico, about, CTA) |
| `/checkout` | Estática | Checkout con pre-carga de datos del usuario |
| `/productos` | Estática | Catálogo público de productos |
| `/servicios` | Estática | Catálogo público de servicios |
| `/tools` | Estática | Dashboard de herramientas (requiere auth) |
| `/tools/[id]` | Dinámica | Vista individual de cada herramienta |
| `/tools/perfil` | Estática | Edición de perfil del usuario |
| `/tools/productos` | Estática | Productos dentro de la plataforma |
| `/tools/recursos` | Estática | Stack tech recomendado |
| `/tools/servicios` | Estática | Servicios dentro de la plataforma |

---

## 4. Sistema de diseño

### Tipografía

Tres fuentes de Google Fonts, cargadas con `next/font` para optimización automática:

| Rol | Fuente | Pesos | Variable CSS |
|---|---|---|---|
| **Headings** | Plus Jakarta Sans | 500, 600, 700, 800 | `--font-heading` |
| **Body** | Inter | 400, 500, 600 | `--font-body` |
| **Mono/Datos** | JetBrains Mono | 400, 600 | `--font-mono` |

### Paleta de colores (light mode)

```css
/* Backgrounds */
--color-bg-primary:    #FAFAF8     /* Warm off-white */
--color-bg-warm:       #FFF8F3     /* Peachy warm */
--color-bg-card:       #FFFFFF     /* Pure white cards */
--color-bg-muted:      #F5F1EC     /* Muted warm gray */

/* Accent (verde principal) */
--color-accent-primary:   #059669  /* Emerald 600 */
--color-accent-hover:     #047857  /* Emerald 700 */

/* Warm gradient palette (blobs del hero) */
--color-warm-peach:     #FECDD3
--color-warm-coral:     #FED7AA
--color-warm-amber:     #FDE68A
--color-warm-lavender:  #DDD6FE
--color-warm-mint:      #A7F3D0

/* Colores por etapa */
Pre-incubación:  #7C3AED  (violet)
Incubación:      #059669  (emerald)
Aceleración:     #D97706  (amber)
Escalamiento:    #0891B2  (cyan)

/* Colores por categoría de herramienta */
Estrategia:       #6366F1  (indigo)
Mercado:          #0891B2  (cyan)
Cliente:          #D946EF  (fuchsia)
Producto:         #059669  (emerald)
Finanzas:         #D97706  (amber)
Ventas:           #DC2626  (red)
Marketing:        #7C3AED  (violet)
Modelo de Negocio:#0D9488  (teal)
Equipo:           #EA580C  (orange)
```

### Paleta de colores (dark mode)

Activado con `data-theme="dark"` en el `<html>`. Paleta sutil y profesional:

```css
--color-bg-primary:    #121318
--color-bg-warm:       #161820
--color-bg-card:       #1C1E28
--color-bg-muted:      #23262F
--color-text-primary:  #E8EAED
--color-text-secondary:#9BA1B0
--color-border:        #2A2D38
```

### Gradientes

```css
/* Hero background */
--gradient-hero: linear-gradient(135deg, #FFF1F2, #FFF7ED, #FFFBEB, #ECFDF5);

/* Texto gradiente */
.gradient-text: linear-gradient(135deg, #059669, #0D9488, #0891B2);
```

### Sombras

```css
--shadow-sm:       0 1px 2px rgba(0,0,0,0.04)
--shadow-card:     0 1px 3px rgba(0,0,0,0.06), 0 1px 2px rgba(0,0,0,0.04)
--shadow-elevated: 0 4px 20px rgba(0,0,0,0.08)
--shadow-glow:     0 4px 30px rgba(5,150,105,0.10)
```

### Radios de borde

```css
--radius-sm: 8px    --radius-md: 12px
--radius-lg: 16px   --radius-xl: 24px   --radius-2xl: 32px
```

---

## 5. Patrones de implementación

### 5.1 Componentes de herramienta

Cada una de las 24 herramientas sigue un patrón idéntico:

```tsx
'use client'

import { useState } from 'react'
import { useToolState } from '@/lib/useToolState'
import type { ToolComponentProps } from './ToolPage'

interface Data { /* campos específicos de esta herramienta */ }
const DEFAULT: Data = { /* valores iniciales */ }

export default function NombreHerramienta({ userId, onComplete, onGenerateReport }: ToolComponentProps) {
  const [data, setData] = useToolState<Data>(userId, 'tool-id', DEFAULT)
  const [saved, setSaved] = useState(false)
  const [openSections, setOpenSections] = useState<Record<string, boolean>>({})

  // ... secciones colapsables, inputs, cálculos
  // ... botón guardar, completar, generar reporte
}
```

**Características comunes:**
- `useToolState` hook: carga desde localStorage al montar, auto-guarda con debounce de 500ms, sincroniza con Supabase en background.
- Secciones de texto: colapsables por defecto (click para expandir con chevron).
- Secciones numéricas: siempre visibles.
- Botón "Guardar progreso": guardado manual con confirmación visual.
- Botón "Marcar como completada": registra en el mapa de progreso.
- Botón "Generar reporte": formatea el contenido y llama a `onGenerateReport`.
- CSS-in-JS: todos los estilos son inline con variables CSS.

### 5.2 Auto-guardado (`useToolState`)

```tsx
export function useToolState<T extends object>(userId, toolId, defaultValue) {
  // 1. Carga de localStorage al montar (SSR-safe)
  // 2. Debounce de 500ms en cada cambio de estado
  // 3. Guarda en localStorage
  // 4. Sincroniza con Supabase en background (catch silencioso)
  // 5. Guarda inmediatamente al desmontar (antes de navegar)
}
```

### 5.3 Progreso y desbloqueo

```tsx
// progress.ts
interface ToolProgressEntry {
  completed: boolean
  completedAt: string | null
  data: Record<string, unknown>
  reportGenerated: boolean
  lastSaved: string | null
}

type ProgressMap = Record<string, ToolProgressEntry>
```

El desbloqueo progresivo se evalúa en el dashboard (`tools/page.tsx`): una herramienta está bloqueada si su etapa es mayor que la etapa del usuario diagnosticada.

### 5.4 Autenticación

Sistema custom con localStorage como store primario:

```tsx
interface User {
  id: string
  name: string
  email: string
  startup: string
  stage: string | null
  diagnosticScore: number | null
  createdAt: string
}
```

- `AuthProvider` wrappea toda la app.
- `AuthModal` aparece para login/registro.
- Los passwords se guardan en localStorage (hashed en producción pendiente de implementar).
- La sesión persiste entre recargas.
- `updateUserStage(stage, score)` se llama después del diagnóstico.

### 5.5 Reportes

`report-formatters.ts` contiene funciones de formateo por herramienta que convierten los datos guardados en texto Markdown estructurado para descarga.

---

## 6. Animaciones

### Framer Motion

| Animación | Componente | Trigger | Descripción |
|---|---|---|---|
| Fade-up en scroll | `FadeUp.tsx` | `whileInView` | `translateY(24px→0)`, `opacity(0→1)`, `once: true` |
| Contadores animados | `AnimatedCounter.tsx` | `useInView` | Cuenta de 0 a N con `easeOut` en 1.5s |
| Stagger en tabs | `StartupLifecycle.tsx` | `whileInView` | `staggerChildren: 0.15s` en las 4 etapas |
| Barras de progreso | `Hero.tsx` | `animate` | `width: 0 → N%` con `duration: 1.2s` |
| Hover en cards | `tools/page.tsx` | `whileHover` | `y: -2`, `boxShadow` más pronunciado |
| Page transitions | `StartupLifecycle.tsx` | `AnimatePresence` | Cambio de contenido entre etapas |
| Blob animation | `globals.css` | CSS `@keyframes` | Movimiento orgánico de blobs del hero |

### Accesibilidad (reduced motion)

```css
@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after {
    animation-duration: 0.01ms !important;
    transition-duration: 0.01ms !important;
  }
}
```

Además, `useReducedMotion()` de Framer Motion desactiva las animaciones JS.

---

## 7. Base de datos (Supabase)

### Tablas utilizadas

| Tabla | Propósito |
|---|---|
| `diagnostic_leads` | Leads del formulario de diagnóstico (nombre, email, startup, score, respuestas) |
| `tool_progress` | Progreso de herramientas sincronizado desde localStorage |

### Modelo de datos del lead

```typescript
interface DiagnosticLead {
  source: 'startups4climate'
  nombre: string
  email: string
  empresa: string
  pais: string
  score: number
  perfil: 'early_stage' | 'growing' | 'investment_ready'
  respuestas: Record<string, number>
  score_por_dimension: {
    modelo: number
    equipo: number
    traccion: number
    financiero: number
  }
  synced_brevo: boolean
}
```

### Estrategia de persistencia

```
Usuario edita herramienta
    ↓
useToolState detecta cambio
    ↓ (debounce 500ms)
localStorage.setItem()           ← inmediato, offline-first
    ↓ (async, background)
syncToolDataToSupabase()          ← persistencia durable
    .catch(() => {})              ← falla silenciosa
```

---

## 8. Deployment

| Aspecto | Detalle |
|---|---|
| **Hosting** | Vercel |
| **Build** | `next build` con Turbopack |
| **CI/CD** | Push a `main` → deploy automático en Vercel |
| **Dominio** | startups4climate.org (configurado en Vercel) |
| **Variables de entorno** | `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY` (en `.env.local` y Vercel) |
| **Optimización de fuentes** | `next/font/google` con `display: 'swap'` |
| **Imágenes** | `next/image` con optimización automática |

---

## 9. SEO y metadata

```tsx
// layout.tsx
metadata: {
  title: 'Startups4Climate | El Sistema Operativo para Escalar Soluciones Climáticas en Latam',
  description: 'Plataforma de herramientas operativas para fundadores...',
  keywords: ['startups climáticas', 'climate tech', 'investor readiness', 'Latam', ...],
  openGraph: { ... },
  twitter: { card: 'summary_large_image', ... },
  metadataBase: new URL('https://startups4climate.org'),
}
```

> **Nota**: Los metadatos aún reflejan la orientación anterior (climate tech). Pendiente de actualizar para reflejar la nueva propuesta de valor ("startups de impacto" en general).

---

## 10. Decisiones de diseño relevantes

### Por qué CSS-in-JS inline en lugar de Tailwind
Tailwind v4 está instalado pero se usa mínimamente (solo clases responsive como `lg:!grid-cols-2` y `hidden lg:block`). Los estilos principales son inline con CSS variables porque:
- Permite control granular sin conflictos de especificidad.
- Las variables CSS (`var(--color-*)`) centralizan el theme y habilitan dark mode sin duplicar estilos.
- Facilita la iteración rápida con Claude Code (el estilo está junto al componente).

### Por qué localStorage como store primario
- Zero latencia de lectura (no hay fetch al cargar).
- Funciona offline.
- Supabase actúa como backup durable, no como fuente primaria.
- Trade-off aceptado: los datos no se comparten entre dispositivos hasta que se implemente sync bidireccional.

### Por qué no hay SSR para las herramientas
Todos los componentes son `'use client'` porque:
- Dependen de `localStorage` para cargar estado.
- Usan `useState`, `useEffect`, `useRef` extensivamente.
- La interactividad es el core de la experiencia (no hay SEO relevante en la zona de herramientas).

### Por qué Framer Motion en lugar de CSS puro
- `whileInView` con `viewport: { once: true }` es más limpio que IntersectionObserver manual.
- `AnimatePresence` permite transiciones de entrada/salida entre vistas.
- `useReducedMotion()` integra accesibilidad sin código adicional.
- El peso adicional (~30KB gzipped) se justifica por la cantidad de animaciones.

---

## 11. Deuda técnica conocida

| Item | Severidad | Descripción |
|---|---|---|
| Auth con localStorage | Alta | Passwords almacenados sin hashing robusto. Migrar a Supabase Auth. |
| Metadata desactualizada | Media | Title y description aún mencionan "climate tech". Actualizar. |
| Stripe pendiente | Media | Checkout tiene UI completa pero falta configurar Stripe real. |
| Sync bidireccional | Baja | Los datos solo van localStorage → Supabase. No hay pull de Supabase → localStorage. |
| Componentes legacy | Baja | 11 componentes de herramientas antiguas (`TRLCalculator`, `Bankability`, etc.) no se usan pero siguen en el repo. |
| Tests | Alta | No hay tests unitarios ni e2e. |
| Brevo sync | Baja | `synced_brevo: boolean` en el schema de leads, pero la integración con Brevo no está implementada. |

---

## 12. Métricas del codebase

| Métrica | Valor |
|---|---|
| Archivos `.tsx` | ~50 componentes |
| Archivos `.ts` (lib) | 5 módulos |
| Herramientas funcionales | 24 componentes interactivos |
| Herramientas legacy | 11 componentes (sin usar) |
| Rutas | 10 (8 estáticas + 1 dinámica + 1 layout) |
| Dependencias de producción | 8 |
| Dependencias de desarrollo | 6 |
| CSS variables definidas | ~35 tokens |
| Líneas de CSS global | ~180 |
