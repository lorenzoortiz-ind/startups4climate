# Landing Page Redesign — Startups4Climate

**Fecha:** 2026-05-06
**Objetivo:** Aumentar conversión de founders individuales (registro + diagnóstico)
**Estilo:** Dark glass actual + limpieza Linear. Sin orbs decorativos.
**Paleta:** Ember #DA4E24, Electric #1F77F6, dark base (#000/#0A0A0A), grays (#888/#555/#333)

---

## Estructura: 6 secciones (antes 8)

### 1. Hero — Mix B+C (propósito + producto)

**Layout:** Centrado, máximo whitespace.

- **Pill badge:** `Gratis para founders en América Latina` con dot indicator ember
- **H1:** "Democratizamos el **emprendimiento de impacto** en América Latina" — "emprendimiento de impacto" en ember
- **Subtitle:** Una oración con las 3 features core: herramientas, mentor AI, diagnóstico
- **CTA principal:** "Empezar gratis" (ember gradient) + link sutil "Ver herramientas"
- **Tool chips:** Lean Canvas, Unit Economics, Pitch Deck, Mentor AI, KPIs, TAM/SAM/SOM, "+24 más" en ember
- **Divider sutil** (1px rgba white 5%)
- **Stats compactas:** +30 Herramientas | +10 Universidades | **Gratis** Para founders LATAM (Gratis en ember)

**Eliminado vs actual:**
- Card de Mentor AI (se mueve a ValueProp)
- Segundo CTA "Solicitar demo" / "Para organizaciones"
- Orbs decorativos de fondo

### 2. Social Proof — Logo marquee

**Layout:** Marquee horizontal infinito, velocidad lenta.

- Logos de partners/universidades en PNG (user los provee)
- Texto superior: "Respaldado por" o "Aliados del ecosistema"
- Filtro grayscale por defecto, color on hover
- Fondo: transparente o sutil dark

### 3. ValueProp — Bento Grid (Opción A)

**Layout:** Grid asimétrico tipo Apple/Linear.

- **Header:** Label "Plataforma" en ember + "Todo lo que necesitas en un solo lugar"
- **Grid 2 filas:**
  - Row 1: Card grande "+30 Herramientas" (1.5fr) + Stack de 2 cards pequeñas "Mentor AI" y "RADAR" (1fr)
  - Row 2: Stack de 2 cards pequeñas "Oportunidades" y "Passport" (1fr) + Card grande "Diagnóstico" (1.5fr)
- Cards: fondo #0E0E0E, border rgba(255,255,255,0.06), border-radius 12px
- Iconos: emoji-free, usar Phosphor o SVG primitivos con accent tinting
- Cards grandes tienen icon badge + título + descripción
- Cards pequeñas solo título + una línea de subtítulo

### 4. StartupLifecycle — Polish (Opción C)

**Sin cambio de diseño.** Solo migración técnica:
- Inline styles a Tailwind
- ARIA roles y labels
- Verificar responsive mobile
- Mantener la estructura visual actual del timeline/lifecycle

### 5. Diagnostic — Embedded con spotlight (Opción A + spotlight)

**Layout:** DiagnosticForm embebido directamente en la landing.

- **Spotlight visual:** Ember glow sutil alrededor del contenedor (box-shadow con rgba de ember, blur amplio)
- Header: "Descubre tu nivel de startup readiness en 5 minutos"
- El formulario completo renderizado inline (no link externo)
- Background ligeramente diferenciado del resto de la página
- Protagonismo visual: es la sección más ancha o con más contraste

**Nota técnica:** DiagnosticForm.tsx actual tiene 1692 líneas. Considerar refactor en subcomponentes pero no bloquear el redesign por esto.

### 6. CTA Final — Dual action (Opción C)

**Layout:** Dos acciones lado a lado.

- **CTA primario:** "Crear cuenta gratis" (ember gradient, grande)
- **CTA secundario:** "Tomar el diagnóstico primero" (outline/ghost, redirige a sección 5)
- Texto de soporte: una línea sobre gratuidad y sin compromiso
- Fondo: gradient sutil o diferenciado para cierre

---

## Secciones eliminadas

1. **ProblemSection** — redundante, el hero ya comunica el dolor
2. **DiagnosticFeature** — reemplazado por Diagnostic spotlight embebido
3. **MethodologiesMarquee** — reemplazado por Social Proof con logos reales

---

## Cambios técnicos transversales

### Estilos
- **Migrar 100% inline styles a Tailwind CSS v4**
- Eliminar todos los `<style>` tags con `!important` embebidos en componentes
- Usar design tokens consistentes (spacing, colors, radii)

### Accesibilidad
- ARIA roles en todas las secciones landmark
- Labels en formularios e inputs
- Focus visible en CTAs y links
- Alt text descriptivo en imágenes

### Mobile
- Implementar menú hamburguesa funcional (el botón existe pero no hace nada)
- Verificar que todas las secciones sean responsive
- Tool chips en hero: wrap en mobile

### Footer
- Arreglar links rotos (Privacidad, Términos apuntan a `#`)
- Verificar que todos los links de navegación funcionen

### Performance
- Lazy load para secciones below the fold (Social Proof, ValueProp, Lifecycle)
- Verificar que DiagnosticForm no bloquee el render inicial

---

## Dependencias

- **Logos de partners:** User los provee en PNG. Necesarios para Social Proof.
- **No nuevas dependencias npm** — todo con Tailwind + componentes existentes
- **Phosphor icons** ya instalado (`@phosphor-icons/react`) — verificar en package.json

---

## Fuera de scope

- Refactor completo de DiagnosticForm (1692 líneas) — se hace después
- Página `/organizaciones` — solo landing principal
- Nuevas rutas o páginas
- Cambios en auth flow
- Cambios en `/tools/*` o `/admin/*`
