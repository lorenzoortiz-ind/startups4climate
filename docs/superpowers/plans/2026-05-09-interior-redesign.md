# Interior Redesign (Tools + Admin) Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Apply the Glass + Carbon design system (Ember primary / Cobalt secondary, Mluvka display / Geist UI) to the full `/tools/*` founders section and `/admin/*` org-admin panel.

**Architecture:** Design tokens are added to `globals.css` first; shared components in `shared.tsx` are updated next so all 37 tools inherit changes automatically; then page-level layouts (`ToolPage.tsx`, `tools/layout.tsx`, `tools/page.tsx`, `admin/layout.tsx`) are updated in dependency order. Admin inner pages get a lighter pass (accent swap + flat action bars). Animations and mobile responsive are last.

**Tech Stack:** Next.js 15 App Router, Tailwind CSS v4, Framer Motion (already installed), Lucide React, CSS custom properties, Geist via Google Fonts `@import`

---

## File Map

| File | Status | Responsibility |
|------|--------|----------------|
| `src/app/globals.css` | Modify | Add Geist import, `--font-body` → Geist, new cobalt + surface tokens |
| `src/components/tools/shared.tsx` | Modify | `ToolSection` 3 states, flat `ToolActionBar`, stepped `ToolProgress`, Geist label/input exports |
| `src/components/tools/ToolPage.tsx` | Modify | Sticky glass tool header (2-col), compact top bar 44px |
| `src/app/tools/layout.tsx` | Modify | Glass nav bar 44px, sidebar stage dots → Lucide icons, user avatar footer |
| `src/app/tools/page.tsx` | Modify | 5-stage segmented progress bar, ToolCard flat redesign, cobalt "done" states |
| `src/app/admin/layout.tsx` | Modify | `--color-admin-sidebar-active` → cobalt, role badge cobalt |
| `src/app/admin/cohortes/page.tsx` | Modify | Cobalt table header accent, flat action bar |
| `src/app/admin/configuracion/page.tsx` | Modify | Geist inputs, cobalt focus ring |
| `src/app/admin/reportes/page.tsx` | Modify | Cobalt download CTA |

---

## Task 1: Token Foundation — globals.css

**Files:**
- Modify: `src/app/globals.css`

### Step 1.1 — Add Geist import right after `@import "tailwindcss"`

- [ ] Open `src/app/globals.css` and add after line 0 (`@import "tailwindcss";`):

```css
@import url('https://fonts.googleapis.com/css2?family=Geist:wght@400;500;600;700&display=swap');
```

The final top of the file should be:
```css
@import "tailwindcss";
@import url('https://fonts.googleapis.com/css2?family=Geist:wght@400;500;600;700&display=swap');
```

### Step 1.2 — Add cobalt + surface tokens to `:root`

- [ ] Inside `:root { }` (after the existing `--color-admin-sidebar-active` block around line 230), add:

```css
  /* === COBALT (admin accent + founders "done" state) === */
  --cobalt-400:              #60A5FA;
  --cobalt-500:              #3B82F6;
  --cobalt-600:              #1D4ED8;
  --cobalt-700:              #1E40AF;
  --color-cobalt:            #1D4ED8;
  --color-cobalt-hover:      #3B82F6;
  --color-cobalt-light:      rgba(29, 78, 216, 0.12);
  --color-cobalt-border:     rgba(29, 78, 216, 0.30);

  /* === SURFACE HIERARCHY (glass + carbon) === */
  --color-surface-1:         #0A0A0A;   /* base canvas */
  --color-surface-2:         #111111;   /* cards / sections */
  --color-surface-3:         #1A1A1A;   /* inputs / elevated */
  --color-surface-input:     #141414;   /* input fields */
  --color-surface-glass:     rgba(10,10,10,0.75); /* sticky headers */

  /* === TOOL HEADER === */
  --z-tool-header: 40;
```

### Step 1.3 — Update `@theme inline` to point `--font-body` at Geist

- [ ] Find the `@theme inline { }` block (around line 340) and replace the `--font-body` and `--font-sans` lines:

Old:
```css
  --font-body: 'Mluvka', 'General Sans', system-ui, sans-serif;
  --font-sans: 'Mluvka', 'General Sans', system-ui, sans-serif;
```

New:
```css
  --font-body: 'Geist', 'General Sans', system-ui, sans-serif;
  --font-sans: 'Geist', 'General Sans', system-ui, sans-serif;
```

(`--font-heading` stays Mluvka — tool names, page titles.)

### Step 1.4 — Update admin sidebar active token to cobalt

- [ ] Find (around line 230):
```css
  --color-admin-sidebar-active:  #DA4E24;
```
Replace with:
```css
  --color-admin-sidebar-active:  #1D4ED8;
```

### Step 1.5 — Verify build compiles

- [ ] Run: `npm run build 2>&1 | tail -20`
  Expected: no errors. Warnings about unused vars are fine.

### Step 1.6 — Commit

```bash
git add src/app/globals.css
git commit -m "feat: add Geist, cobalt tokens, surface hierarchy to design system"
```

---

## Task 2: shared.tsx — ToolSection 3-State Redesign

**Files:**
- Modify: `src/components/tools/shared.tsx`

This task updates `ToolSection` so all 37 tools inherit the flat carbon + 3-state border system.

### Step 2.1 — Write failing test (visual contract)

- [ ] Create `src/components/tools/__tests__/shared.test.tsx`:

```tsx
import { render } from '@testing-library/react'
import { ToolSection } from '../shared'

describe('ToolSection states', () => {
  it('idle: no ember or cobalt border, flat surface-2 background', () => {
    const { container } = render(
      <ToolSection title="Test" step={1} state="idle">content</ToolSection>
    )
    const section = container.firstChild as HTMLElement
    expect(section.style.background).toContain('#111')
    expect(section.style.border).not.toContain('DA4E24')
    expect(section.style.border).not.toContain('1D4ED8')
  })

  it('active: ember border rgba(218,78,36,0.5)', () => {
    const { container } = render(
      <ToolSection title="Test" step={1} state="active">content</ToolSection>
    )
    const section = container.firstChild as HTMLElement
    expect(section.style.border).toContain('DA4E24')
  })

  it('done: cobalt border rgba(29,78,216,0.4)', () => {
    const { container } = render(
      <ToolSection title="Test" step={1} state="done">content</ToolSection>
    )
    const section = container.firstChild as HTMLElement
    expect(section.style.border).toContain('1D4ED8')
  })
})
```

- [ ] Run: `npx jest src/components/tools/__tests__/shared.test.tsx --no-coverage 2>&1 | tail -20`
  Expected: FAIL — `ToolSection` doesn't accept `state` prop yet.

### Step 2.2 — Update `ToolSection` in shared.tsx

- [ ] In `src/components/tools/shared.tsx`, find the `ToolSection` component and replace its props interface and render:

```tsx
type ToolSectionState = 'idle' | 'active' | 'done'

interface ToolSectionProps {
  title: string
  step?: number
  children: React.ReactNode
  accentColor?: string          // legacy — kept for backward compat, ignored when `state` is set
  state?: ToolSectionState      // preferred API
  className?: string
  style?: React.CSSProperties
}

export function ToolSection({
  title,
  step,
  children,
  accentColor,
  state = 'idle',
  className,
  style,
}: ToolSectionProps) {
  const borderMap: Record<ToolSectionState, string> = {
    idle:   '1px solid rgba(255,255,255,0.07)',
    active: '1px solid rgba(218,78,36,0.50)',
    done:   '1px solid rgba(29,78,216,0.40)',
  }
  const badgeBgMap: Record<ToolSectionState, string> = {
    idle:   'rgba(255,255,255,0.07)',
    active: 'rgba(218,78,36,0.18)',
    done:   'rgba(29,78,216,0.18)',
  }
  const badgeColorMap: Record<ToolSectionState, string> = {
    idle:   'rgba(255,255,255,0.45)',
    active: '#DA4E24',
    done:   '#3B82F6',
  }

  // If a legacy accentColor prop is passed and no explicit state, infer active
  const resolvedState: ToolSectionState = accentColor && state === 'idle' ? 'active' : state

  return (
    <div
      className={className}
      style={{
        background: '#111111',
        borderRadius: 14,
        border: borderMap[resolvedState],
        padding: '1.5rem',
        marginBottom: '1.25rem',
        transition: 'border-color 0.2s ease',
        ...style,
      }}
    >
      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: '0.625rem',
        marginBottom: '1.25rem',
      }}>
        {step !== undefined && (
          <span style={{
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: 26,
            height: 26,
            borderRadius: 8,
            background: badgeBgMap[resolvedState],
            color: badgeColorMap[resolvedState],
            fontFamily: 'var(--font-body)',
            fontSize: '0.6875rem',
            fontWeight: 700,
            letterSpacing: '-0.01em',
            flexShrink: 0,
            transition: 'background 0.2s ease, color 0.2s ease',
          }}>
            {resolvedState === 'done' ? <CheckCircle2 size={13} /> : step}
          </span>
        )}
        <span style={{
          fontFamily: 'var(--font-heading)',
          fontSize: '0.9375rem',
          fontWeight: 700,
          color: resolvedState === 'idle' ? 'rgba(255,255,255,0.75)' : '#FFFFFF',
          letterSpacing: '-0.02em',
        }}>
          {title}
        </span>
      </div>
      {children}
    </div>
  )
}
```

Make sure `CheckCircle2` is imported from `lucide-react` at the top of the file.

### Step 2.3 — Run test to verify it passes

- [ ] Run: `npx jest src/components/tools/__tests__/shared.test.tsx --no-coverage 2>&1 | tail -20`
  Expected: PASS (3 tests)

### Step 2.4 — Commit

```bash
git add src/components/tools/shared.tsx src/components/tools/__tests__/shared.test.tsx
git commit -m "feat: ToolSection 3-state system (idle/active/done) with flat carbon surface"
```

---

## Task 3: shared.tsx — ToolActionBar, ToolProgress, Style Exports

**Files:**
- Modify: `src/components/tools/shared.tsx`

### Step 3.1 — Write failing tests

- [ ] Add to `src/components/tools/__tests__/shared.test.tsx`:

```tsx
import { ToolActionBar, ToolProgress } from '../shared'

describe('ToolActionBar', () => {
  it('renders flat bar (no boxShadow, no borderRadius card)', () => {
    const { container } = render(
      <ToolActionBar status="in_progress" onSave={() => {}} onComplete={() => {}} />
    )
    const bar = container.firstChild as HTMLElement
    expect(bar.style.boxShadow).toBe('')
    expect(bar.style.borderRadius).toBe('0px')
  })
})

describe('ToolProgress', () => {
  it('renders step dots, not a percentage bar', () => {
    const { getByText } = render(<ToolProgress current={2} total={5} />)
    expect(getByText('2 / 5')).toBeInTheDocument()
  })
})
```

- [ ] Run: `npx jest src/components/tools/__tests__/shared.test.tsx --no-coverage 2>&1 | tail -30`
  Expected: FAIL — `ToolActionBar` / `ToolProgress` don't match new interface.

### Step 3.2 — Replace `ToolActionBar` in shared.tsx

- [ ] Find the existing `ToolActionBar` component and replace entirely:

```tsx
interface ToolActionBarProps {
  status: 'not_started' | 'in_progress' | 'completed'
  onSave?: () => void
  onComplete?: () => void
  onGenerateReport?: () => void
  saving?: boolean
  completing?: boolean
  reportGenerated?: boolean
  disabled?: boolean
}

export function ToolActionBar({
  status,
  onSave,
  onComplete,
  onGenerateReport,
  saving = false,
  completing = false,
  reportGenerated = false,
  disabled = false,
}: ToolActionBarProps) {
  const statusLabel =
    status === 'completed'
      ? 'Completada'
      : status === 'in_progress'
      ? 'En progreso'
      : 'Sin empezar'

  const statusColor =
    status === 'completed'
      ? '#3B82F6'
      : status === 'in_progress'
      ? '#DA4E24'
      : 'rgba(255,255,255,0.35)'

  return (
    <div
      style={{
        position: 'sticky',
        bottom: 0,
        zIndex: 30,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: '1rem',
        height: 56,
        padding: '0 1.5rem',
        background: 'rgba(10,10,10,0.92)',
        backdropFilter: 'blur(16px)',
        WebkitBackdropFilter: 'blur(16px)',
        borderTop: '1px solid rgba(255,255,255,0.07)',
        borderRadius: 0,
        boxShadow: '',
        margin: '0 -1.5rem',     // bleed to container edges
      }}
    >
      {/* Left: status indicator */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
        <span style={{
          width: 6, height: 6, borderRadius: '50%',
          background: statusColor,
          flexShrink: 0,
        }} />
        <span style={{
          fontFamily: 'var(--font-body)',
          fontSize: '0.6875rem',
          fontWeight: 600,
          color: statusColor,
          textTransform: 'uppercase',
          letterSpacing: '0.08em',
        }}>
          {statusLabel}
        </span>
      </div>

      {/* Right: action buttons */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
        {onSave && status !== 'completed' && (
          <button
            onClick={onSave}
            disabled={saving || disabled}
            style={{
              height: 36,
              padding: '0 1rem',
              borderRadius: 8,
              border: '1px solid rgba(255,255,255,0.12)',
              background: 'transparent',
              color: 'rgba(255,255,255,0.70)',
              fontFamily: 'var(--font-body)',
              fontSize: '0.75rem',
              fontWeight: 500,
              cursor: saving || disabled ? 'not-allowed' : 'pointer',
              opacity: saving || disabled ? 0.5 : 1,
              transition: 'border-color 0.15s, color 0.15s',
            }}
          >
            {saving ? 'Guardando…' : 'Guardar'}
          </button>
        )}

        {onGenerateReport && status === 'completed' && (
          <button
            onClick={onGenerateReport}
            disabled={reportGenerated || disabled}
            style={{
              height: 36,
              padding: '0 1rem',
              borderRadius: 8,
              border: '1px solid rgba(29,78,216,0.35)',
              background: 'rgba(29,78,216,0.10)',
              color: '#60A5FA',
              fontFamily: 'var(--font-body)',
              fontSize: '0.75rem',
              fontWeight: 500,
              cursor: reportGenerated || disabled ? 'not-allowed' : 'pointer',
              opacity: reportGenerated || disabled ? 0.5 : 1,
            }}
          >
            {reportGenerated ? 'Reporte generado' : 'Generar reporte'}
          </button>
        )}

        {onComplete && status !== 'completed' && (
          <button
            onClick={onComplete}
            disabled={completing || disabled}
            style={{
              height: 36,
              padding: '0 1.25rem',
              borderRadius: 8,
              border: 'none',
              background: completing || disabled ? 'rgba(218,78,36,0.40)' : '#DA4E24',
              color: '#fff',
              fontFamily: 'var(--font-body)',
              fontSize: '0.75rem',
              fontWeight: 600,
              cursor: completing || disabled ? 'not-allowed' : 'pointer',
              transition: 'background 0.15s',
            }}
          >
            {completing ? 'Completando…' : 'Marcar completada'}
          </button>
        )}
      </div>
    </div>
  )
}
```

### Step 3.3 — Replace `ToolProgress` with stepped dots

- [ ] Find the existing `ToolProgress` and replace:

```tsx
interface ToolProgressProps {
  current: number
  total: number
  label?: string
}

export function ToolProgress({ current, total, label }: ToolProgressProps) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
      <div style={{ display: 'flex', gap: '4px' }}>
        {Array.from({ length: total }).map((_, i) => (
          <div
            key={i}
            style={{
              width: i < current ? 20 : 8,
              height: 4,
              borderRadius: 2,
              background: i < current ? '#DA4E24' : 'rgba(255,255,255,0.12)',
              transition: 'width 0.25s ease, background 0.25s ease',
            }}
          />
        ))}
      </div>
      <span style={{
        fontFamily: 'var(--font-body)',
        fontSize: '0.6875rem',
        color: 'rgba(255,255,255,0.45)',
        fontWeight: 500,
      }}>
        {current} / {total}
      </span>
      {label && (
        <span style={{
          fontFamily: 'var(--font-body)',
          fontSize: '0.6875rem',
          color: 'rgba(255,255,255,0.45)',
        }}>
          {label}
        </span>
      )}
    </div>
  )
}
```

### Step 3.4 — Update exported style objects (inputStyle, textareaStyle, labelStyle)

- [ ] Find the exported `inputStyle`, `textareaStyle`, `labelStyle` constants and replace them:

```tsx
export const inputStyle: React.CSSProperties = {
  width: '100%',
  padding: '0.625rem 0.875rem',
  borderRadius: 8,
  border: '1px solid rgba(255,255,255,0.09)',
  background: '#141414',
  color: '#FFFFFF',
  fontFamily: 'var(--font-body)',
  fontSize: '0.8125rem',
  fontWeight: 400,
  lineHeight: 1.5,
  outline: 'none',
  transition: 'border-color 0.15s ease',
  boxSizing: 'border-box' as const,
}

export const textareaStyle: React.CSSProperties = {
  ...inputStyle,
  minHeight: 100,
  resize: 'vertical' as const,
}

export const labelStyle: React.CSSProperties = {
  display: 'block',
  fontFamily: 'var(--font-body)',
  fontSize: '0.5625rem',
  fontWeight: 700,
  letterSpacing: '0.09em',
  textTransform: 'uppercase' as const,
  color: 'rgba(255,255,255,0.45)',
  marginBottom: '0.375rem',
}
```

### Step 3.5 — Run tests

- [ ] Run: `npx jest src/components/tools/__tests__/shared.test.tsx --no-coverage 2>&1 | tail -30`
  Expected: PASS (5 tests)

### Step 3.6 — Run build to check no broken imports

- [ ] Run: `npm run build 2>&1 | grep -E "error|Error" | head -20`
  Expected: no TypeScript errors

### Step 3.7 — Commit

```bash
git add src/components/tools/shared.tsx src/components/tools/__tests__/shared.test.tsx
git commit -m "feat: ToolActionBar flat sticky bar, ToolProgress stepped dots, Geist label/input styles"
```

---

## Task 4: ToolPage.tsx — Sticky Glass Tool Header

**Files:**
- Modify: `src/components/tools/ToolPage.tsx`

### Step 4.1 — Reduce top bar height from 56px → 44px

- [ ] In `src/components/tools/ToolPage.tsx`, find the top bar `div` with `height: 56` (around line 170) and change:

```tsx
// OLD
height: 56,

// NEW
height: 44,
```

Also update the mobile top offset class. Find `"lg:top-0 top-14"` and change to:
```tsx
className="lg:top-0 top-11"
```
(`top-11` = 44px, matching the 44px mobile nav).

### Step 4.2 — Make the tool header card sticky + glass

- [ ] Find the tool header card `motion.div` (around line 296 in original, after the top bar section). It currently has:
```tsx
style={{
  background: 'var(--color-bg-card)',
  borderRadius: 20,
  border: '1px solid var(--color-border)',
  padding: '1.75rem',
  boxShadow: 'var(--shadow-card)',
  position: 'relative',
  overflow: 'visible',
}}
```

Replace with:
```tsx
style={{
  background: 'rgba(10,10,10,0.82)',
  backdropFilter: 'blur(20px)',
  WebkitBackdropFilter: 'blur(20px)',
  borderRadius: 0,
  borderBottom: '1px solid rgba(255,255,255,0.07)',
  padding: '1rem 1.5rem',
  boxShadow: 'none',
  position: 'sticky',
  top: 44,
  zIndex: 40,
  margin: '0 -1.5rem',  // bleed to full width
}}
```

Also remove the gradient top-bar `div` (the 4px height stripe) — it's no longer needed since the card is no longer a card.

### Step 4.3 — Tighten the grid layout inside the sticky header

- [ ] Find the `gridTemplateColumns: 'minmax(0, 1.6fr) minmax(0, 1fr)'` grid inside the tool header. Replace the grid's padding from `1.75rem` (already removed in 4.2) — no change needed there. But update the grid gap:

```tsx
// OLD
gap: '1.75rem',

// NEW
gap: '1.25rem',
```

And add `alignItems: 'center'` (replacing `alignItems: 'start'`):
```tsx
alignItems: 'center',
```

### Step 4.4 — Style the outputs checklist items (right column) to be compact

- [ ] Find the outputs checklist section (right column of the grid). The checklist items typically render with `li` or similar. Wrap each output item so it uses the Geist body font at 0.6875rem, not Mluvka. The pattern to find and update:

```tsx
// Find each checklist item that renders an output. They typically look like:
// <li style={{ fontFamily: 'var(--font-body)', ... }}>

// Ensure the fontFamily is 'var(--font-body)' and fontSize is '0.6875rem'
// If outputs aren't styled, add a wrapper:
<ul style={{
  listStyle: 'none',
  margin: 0,
  padding: 0,
  display: 'flex',
  flexDirection: 'column',
  gap: '0.375rem',
}}>
  {tool.outputs?.map((output, i) => (
    <li key={i} style={{
      display: 'flex',
      alignItems: 'flex-start',
      gap: '0.375rem',
      fontFamily: 'var(--font-body)',
      fontSize: '0.6875rem',
      color: 'rgba(255,255,255,0.60)',
      lineHeight: 1.4,
    }}>
      <CheckCircle2 size={11} color="#3B82F6" style={{ flexShrink: 0, marginTop: 1 }} />
      {output}
    </li>
  ))}
</ul>
```

### Step 4.5 — Verify dev server renders no layout errors

- [ ] Run: `npm run dev &` and open `http://localhost:3000/tools/passport` (or any tool) in a browser.
  Expected: sticky header visible at top when scrolling. No horizontal overflow.

- [ ] Stop dev server: `pkill -f "next dev"`

### Step 4.6 — Run build

- [ ] Run: `npm run build 2>&1 | grep -E "error TS|Error:" | head -20`
  Expected: no TypeScript errors.

### Step 4.7 — Commit

```bash
git add src/components/tools/ToolPage.tsx
git commit -m "feat: ToolPage sticky glass header (44px offset, blur, 2-col grid)"
```

---

## Task 5: tools/layout.tsx — Nav Bar + Sidebar Redesign

**Files:**
- Modify: `src/app/tools/layout.tsx`

### Step 5.1 — Reduce nav bar height from 56px → 44px + apply glass

- [ ] In `src/app/tools/layout.tsx`, find the nav bar container (the `<header>` or `<div>` with `position: 'fixed'` and `height: 56`). Update:

```tsx
// OLD
height: 56,
background: 'var(--color-bg-card)',
borderBottom: '1px solid var(--color-border)',

// NEW
height: 44,
background: 'rgba(10,10,10,0.82)',
backdropFilter: 'blur(20px)',
WebkitBackdropFilter: 'blur(20px)',
borderBottom: '1px solid rgba(255,255,255,0.07)',
```

Also update any `paddingTop: 56` or `marginTop: 56` or `top: 56` references to `44` for content offset.

### Step 5.2 — Replace sidebar stage dots with Lucide icons

- [ ] At the top of `src/app/tools/layout.tsx`, add imports:
```tsx
import { Lightbulb, FlaskConical, Rocket, Building2, TrendingUp } from 'lucide-react'
```

- [ ] Find the `STAGE_CONFIG` or equivalent array that defines stage colors/labels. Add an `icon` field:

```tsx
const STAGE_ICONS = [Lightbulb, FlaskConical, Rocket, Building2, TrendingUp] as const

// Inside the StageSidebarSection or wherever stages are rendered:
// Replace the colored dot (typically a small div with cfg.color background) with:
const StageIcon = STAGE_ICONS[stageIndex] ?? Lightbulb

// OLD: <div style={{ width: 7, height: 7, borderRadius: '50%', background: cfg.color }} />
// NEW:
<StageIcon
  size={14}
  color={isExpanded ? 'var(--color-accent-primary)' : 'rgba(255,255,255,0.35)'}
  strokeWidth={1.75}
/>
```

### Step 5.3 — Update active tool background in sidebar

- [ ] Find the active tool link style. Currently: `background: 'rgba(218,78,36,0.12)'`

Update to include a left border accent:
```tsx
// Active tool link
background: 'rgba(218,78,36,0.10)',
borderLeft: '2px solid #DA4E24',
paddingLeft: '0.5rem',   // reduce left padding by 2px to keep alignment
```

For non-active hover:
```tsx
background: 'rgba(255,255,255,0.04)',
borderLeft: '2px solid transparent',
paddingLeft: '0.5rem',
```

### Step 5.4 — Add user avatar to sidebar footer

- [ ] Find the sidebar footer section (where logout button is). Before the logout button, add a user avatar block:

```tsx
{/* User avatar + name */}
<div style={{
  display: 'flex',
  alignItems: 'center',
  gap: '0.625rem',
  padding: '0.75rem',
  borderRadius: 10,
  background: 'rgba(255,255,255,0.04)',
  marginBottom: '0.5rem',
}}>
  {/* Initials avatar */}
  <div style={{
    width: 30,
    height: 30,
    borderRadius: '50%',
    background: 'rgba(218,78,36,0.20)',
    border: '1px solid rgba(218,78,36,0.35)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontFamily: 'var(--font-body)',
    fontSize: '0.625rem',
    fontWeight: 700,
    color: '#DA4E24',
    flexShrink: 0,
    textTransform: 'uppercase' as const,
  }}>
    {appUser?.full_name
      ?.split(' ')
      .map((n: string) => n[0])
      .slice(0, 2)
      .join('') ?? '?'}
  </div>
  <div style={{ minWidth: 0 }}>
    <div style={{
      fontFamily: 'var(--font-body)',
      fontSize: '0.6875rem',
      fontWeight: 600,
      color: '#F1F5F9',
      overflow: 'hidden',
      textOverflow: 'ellipsis',
      whiteSpace: 'nowrap',
    }}>
      {appUser?.full_name ?? '—'}
    </div>
    <div style={{
      fontFamily: 'var(--font-body)',
      fontSize: '0.5625rem',
      color: 'rgba(255,255,255,0.40)',
      overflow: 'hidden',
      textOverflow: 'ellipsis',
      whiteSpace: 'nowrap',
    }}>
      {appUser?.email ?? ''}
    </div>
  </div>
</div>
```

### Step 5.5 — Run build

- [ ] Run: `npm run build 2>&1 | grep -E "error TS|Error:" | head -20`
  Expected: no TypeScript errors.

### Step 5.6 — Commit

```bash
git add src/app/tools/layout.tsx
git commit -m "feat: tools layout glass nav 44px, sidebar Lucide stage icons, user avatar footer"
```

---

## Task 6: tools/page.tsx — Dashboard Redesign

**Files:**
- Modify: `src/app/tools/page.tsx`

### Step 6.1 — Replace ProgressRing with 5-stage segmented bar

- [ ] In `src/app/tools/page.tsx`, find the hero section with `<ProgressRing>`. Replace the entire right column (`hero-ring` div) with a 5-stage segmented progress bar:

```tsx
{/* Replace ProgressRing with 5-stage segmented bar */}
<div style={{
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'flex-end',
  gap: '0.75rem',
  flexShrink: 0,
  minWidth: 200,
}}>
  <div style={{
    fontFamily: 'var(--font-body)',
    fontSize: '0.5625rem',
    fontWeight: 700,
    textTransform: 'uppercase',
    letterSpacing: '0.1em',
    color: 'rgba(255,255,255,0.35)',
  }}>
    Progreso por etapa
  </div>
  {STAGE_META.map((stage, i) => {
    const stageTools = TOOLS_BY_STAGE[i] ?? []
    const stageDone = stageTools.filter(t => progressMap[t.id]?.completed).length
    const stagePct = stageTools.length > 0 ? stageDone / stageTools.length : 0
    const StageIcon = [Lightbulb, FlaskConical, Rocket, Building2, TrendingUp][i]
    return (
      <div key={i} style={{
        display: 'flex',
        alignItems: 'center',
        gap: '0.5rem',
        width: '100%',
      }}>
        <StageIcon size={12} color="rgba(255,255,255,0.35)" strokeWidth={1.75} />
        <div style={{
          flex: 1,
          height: 4,
          borderRadius: 2,
          background: 'rgba(255,255,255,0.08)',
          overflow: 'hidden',
        }}>
          <div style={{
            height: '100%',
            width: `${stagePct * 100}%`,
            borderRadius: 2,
            background: stagePct === 1 ? '#3B82F6' : '#DA4E24',
            transition: 'width 0.6s cubic-bezier(0.16,1,0.3,1)',
          }} />
        </div>
        <span style={{
          fontFamily: 'var(--font-body)',
          fontSize: '0.5625rem',
          color: 'rgba(255,255,255,0.35)',
          width: 36,
          textAlign: 'right',
          flexShrink: 0,
        }}>
          {stageDone}/{stageTools.length}
        </span>
      </div>
    )
  })}
  <div style={{
    fontFamily: 'var(--font-body)',
    fontSize: '0.75rem',
    fontWeight: 700,
    color: '#DA4E24',
  }}>
    {Math.round(pct)}% global
  </div>
</div>
```

Add `Lightbulb, FlaskConical, Rocket, Building2, TrendingUp` to the import list at the top if not already imported (they are — check line 6 of the file).

### Step 6.2 — Update CATEGORY_COLORS to use cobalt for non-ember categories

- [ ] Find `CATEGORY_COLORS` (around line 58) and update the cobalt categories:

```tsx
const CATEGORY_COLORS: Record<ToolCategory, { color: string; bg: string }> = {
  Estrategia: { color: '#DA4E24',  bg: 'rgba(218,78,36,0.08)' },
  Mercado:    { color: '#3B82F6',  bg: 'rgba(29,78,216,0.08)' },   // cobalt
  Producto:   { color: '#3B82F6',  bg: 'rgba(29,78,216,0.08)' },   // cobalt
  Finanzas:   { color: '#94A3B8',  bg: 'rgba(148,163,184,0.08)' }, // neutral
  Ventas:     { color: '#DA4E24',  bg: 'rgba(218,78,36,0.08)' },
  Marketing:  { color: '#DA4E24',  bg: 'rgba(218,78,36,0.08)' },
  Equipo:     { color: '#3B82F6',  bg: 'rgba(29,78,216,0.08)' },   // cobalt
}
```

### Step 6.3 — Update ToolCard: flat carbon surface, no gradient bg

- [ ] In `ToolCard`, find the `background:` property on the inner `motion.div`:

```tsx
// OLD
background: done
  ? `linear-gradient(135deg, ${tool.stageBg}, var(--color-bg-card))`
  : 'var(--color-bg-card)',

// NEW
background: '#111111',
```

Also update the border to use the 3-state pattern:
```tsx
// OLD
border: `1px solid ${hovered && !locked ? tool.stageBorder : (done ? tool.stageBorder : 'var(--color-border)')}`,

// NEW — done uses cobalt, active uses ember
border: done
  ? '1px solid rgba(29,78,216,0.35)'
  : hovered && !locked
  ? '1px solid rgba(218,78,36,0.40)'
  : '1px solid rgba(255,255,255,0.07)',
```

And update the "Completada" badge to cobalt:
```tsx
// Already uses var(--color-accent-secondary) — this will update automatically via cobalt token
// No change needed here if using var(--color-accent-secondary)
// But if hardcoded: update rgba(31,119,246,...) → rgba(29,78,216,...)
```

### Step 6.4 — Run build

- [ ] Run: `npm run build 2>&1 | grep -E "error TS|Error:" | head -20`
  Expected: no TypeScript errors.

### Step 6.5 — Commit

```bash
git add src/app/tools/page.tsx
git commit -m "feat: tools dashboard 5-stage progress bar, cobalt ToolCard done state, flat carbon cards"
```

---

## Task 7: admin/layout.tsx — Cobalt Sidebar

**Files:**
- Modify: `src/app/admin/layout.tsx`

The `--color-admin-sidebar-active` token was already updated to `#1D4ED8` in Task 1. This task handles the remaining inline color values.

### Step 7.1 — Update role badge from electric blue → cobalt

- [ ] Find the role badge (around line 190, `background: 'rgba(31,119,246,0.15)'`, `color: '#1F77F6'`):

```tsx
// OLD
background: 'rgba(31,119,246,0.15)',
color: '#1F77F6',

// NEW
background: 'rgba(29,78,216,0.15)',
color: '#3B82F6',
```

### Step 7.2 — Update nav link hover state to cobalt

- [ ] Find `onMouseEnter` / `onMouseLeave` handlers on nav links:

```tsx
// OLD onMouseEnter (active=false branch):
e.currentTarget.style.background = 'rgba(255,255,255,0.06)'
e.currentTarget.style.color = '#F1F5F9'

// NEW:
e.currentTarget.style.background = 'rgba(29,78,216,0.08)'
e.currentTarget.style.color = '#93C5FD'
```

### Step 7.3 — Add glass effect to admin sidebar (consistent with tools sidebar)

- [ ] The admin sidebar is a fixed `<aside>`. Find its outermost style object. Currently it uses `background: 'var(--color-admin-sidebar-bg)'` which is `#000000`. Update:

```tsx
// OLD
background: 'var(--color-admin-sidebar-bg)',

// NEW
background: 'rgba(5,5,5,0.95)',
backdropFilter: 'blur(12px)',
WebkitBackdropFilter: 'blur(12px)',
borderRight: '1px solid rgba(255,255,255,0.06)',
```

### Step 7.4 — Run build

- [ ] Run: `npm run build 2>&1 | grep -E "error TS|Error:" | head -20`

### Step 7.5 — Commit

```bash
git add src/app/admin/layout.tsx
git commit -m "feat: admin sidebar cobalt active state, glass surface, role badge cobalt"
```

---

## Task 8: Admin Inner Pages — Accent Swap + Flat Action Bars

**Files:**
- Modify: `src/app/admin/cohortes/page.tsx`
- Modify: `src/app/admin/configuracion/page.tsx`
- Modify: `src/app/admin/reportes/page.tsx`

### Step 8.1 — admin/cohortes/page.tsx: cobalt table header + action buttons

- [ ] In `src/app/admin/cohortes/page.tsx`, find all occurrences of `#DA4E24` or `color-accent-primary` used as table header accent, button primary, or badge background. Replace with cobalt:

```tsx
// Batch replace in cohortes/page.tsx:
// '#DA4E24' → '#1D4ED8'        (primary button bg)
// 'rgba(218,78,36,' → 'rgba(29,78,216,'  (light backgrounds)
// '#F0721D' → '#3B82F6'        (hover states)
// var(--color-accent-primary) → var(--color-cobalt)  (where used as admin accent)
```

**Exception:** Leave any ember color that is labeling founder/startup state badges (those indicate founder data, not admin actions).

- [ ] Run: `grep -n "DA4E24\|accent-primary\|F0721D" src/app/admin/cohortes/page.tsx | head -20`
  Review output before making changes.

- [ ] Apply changes surgically — do NOT use global find/replace. For each occurrence, decide: "Is this an admin action color?" → cobalt. "Is this a founder stage/status indicator?" → leave as ember.

### Step 8.2 — admin/configuracion/page.tsx: Geist inputs + cobalt focus

- [ ] In `src/app/admin/configuracion/page.tsx`, find all `<input>` and `<select>` style objects. Ensure they use:

```tsx
// Input style to apply:
{
  width: '100%',
  padding: '0.625rem 0.875rem',
  borderRadius: 8,
  border: '1px solid rgba(255,255,255,0.09)',
  background: '#141414',
  color: '#FFFFFF',
  fontFamily: 'var(--font-body)',   // Geist now
  fontSize: '0.8125rem',
  outline: 'none',
}
```

For focus state, add onFocus/onBlur handlers if not present:
```tsx
onFocus={(e) => { e.target.style.borderColor = 'rgba(29,78,216,0.60)' }}
onBlur={(e) => { e.target.style.borderColor = 'rgba(255,255,255,0.09)' }}
```

### Step 8.3 — admin/reportes/page.tsx: cobalt download CTA

- [ ] Find the primary download/generate button in reportes. Update its background from ember to cobalt:

```tsx
// OLD: background: '#DA4E24' or var(--color-accent-primary)
// NEW: background: '#1D4ED8'
```

### Step 8.4 — Run build

- [ ] Run: `npm run build 2>&1 | grep -E "error TS|Error:" | head -20`

### Step 8.5 — Commit

```bash
git add src/app/admin/cohortes/page.tsx src/app/admin/configuracion/page.tsx src/app/admin/reportes/page.tsx
git commit -m "feat: admin pages cobalt accent, flat inputs, Geist font propagation"
```

---

## Task 9: Animations + Mobile Responsive

**Files:**
- Modify: `src/app/tools/layout.tsx`
- Modify: `src/components/tools/ToolPage.tsx`
- Modify: `src/app/tools/page.tsx`
- Modify: `src/app/globals.css`

### Step 9.1 — Add stagger reveal to tools dashboard section headings

- [ ] In `src/app/tools/page.tsx`, find the stage section header renders (where stage name + tools grid appear). Wrap the grid with a stagger orchestrator. The existing `springReveal` motion is already present — extend to stagger tool cards:

```tsx
// The ToolCard already has:
// transition={{ duration: 0.35, delay: idx * 0.04 }}
// This stagger is correct. Verify it's on the card, not the grid wrapper.

// For the stage section header, add entrance animation:
<motion.div
  initial={{ opacity: 0, y: 12 }}
  animate={{ opacity: 1, y: 0 }}
  transition={{ type: 'spring', stiffness: 200, damping: 25, delay: stageIndex * 0.07 }}
>
  {/* stage header content */}
</motion.div>
```

### Step 9.2 — Add prefers-reduced-motion support in globals.css

- [ ] In `src/app/globals.css`, find the `@layer base` block and add:

```css
@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
  }
}
```

### Step 9.3 — Mobile: hamburger sidebar for tools layout

- [ ] In `src/app/tools/layout.tsx`, find the existing mobile hamburger button (already present per CLAUDE.md knowledge). Verify it's styled with the new 44px nav height:

```tsx
// The hamburger button should be vertically centered in the 44px nav bar
// If its top offset was hardcoded to `top: 16px` (half of 56px - 12px icon/2):
// Change to `top: 10px` (half of 44px - 12px icon/2) or use flexbox centering
```

- [ ] Verify the sidebar overlay closes on outside click and on route change. Look for `useEffect` with `pathname` dependency — if not present, add:

```tsx
// In the mobile sidebar state management:
useEffect(() => {
  setSidebarOpen(false)
}, [pathname])
```

### Step 9.4 — Mobile: compact tool header on small screens

- [ ] In `src/components/tools/ToolPage.tsx`, add a responsive class to the tool header grid. The grid is `gridTemplateColumns: 'minmax(0, 1.6fr) minmax(0, 1fr)'`. On mobile, collapse to single column:

```tsx
// Add a className to the grid container:
className="tool-header-grid"

// Add to globals.css in the responsive section:
@media (max-width: 640px) {
  .tool-header-grid {
    grid-template-columns: 1fr !important;
  }
  .tool-header-grid > *:last-child {
    display: none; /* hide outputs checklist on mobile — saves space */
  }
}
```

### Step 9.5 — Mobile: ToolActionBar safe area for iOS

- [ ] In `src/components/tools/shared.tsx`, update `ToolActionBar` bottom padding for iOS:

```tsx
// Add to the action bar's style object:
paddingBottom: 'max(0.5rem, env(safe-area-inset-bottom))',
height: 'auto',
minHeight: 56,
```

### Step 9.6 — Mobile: tools dashboard grid responsive

- [ ] In `src/app/tools/page.tsx`, find the metrics grid (`gridTemplateColumns: 'repeat(4, minmax(0, 1fr))'`). Add a className:

```tsx
className="metrics-grid"
```

- [ ] Add to `globals.css`:
```css
@media (max-width: 640px) {
  .metrics-grid {
    grid-template-columns: repeat(2, 1fr) !important;
  }
}
```

### Step 9.7 — Run build + verify no regressions

- [ ] Run: `npm run build 2>&1 | tail -20`
  Expected: successful build, `Route (app)` table shows all routes without errors.

### Step 9.8 — Run tests

- [ ] Run: `npx jest --no-coverage 2>&1 | tail -20`
  Expected: all tests pass.

### Step 9.9 — Commit

```bash
git add src/app/tools/layout.tsx src/components/tools/ToolPage.tsx src/app/tools/page.tsx src/app/globals.css
git commit -m "feat: stagger animations, prefers-reduced-motion, mobile responsive tools + admin"
```

---

## Spec Coverage Self-Review

| Spec Requirement | Task |
|-----------------|------|
| Geist for UI text | Task 1.3 — `--font-body` → Geist |
| Cobalt tokens | Task 1.2 |
| Surface hierarchy tokens | Task 1.2 |
| ToolSection 3 states (idle/active/done) | Task 2 |
| Flat carbon section surface `#111` | Task 2.2 |
| ToolActionBar flat 46px bar | Task 3.2 |
| ToolProgress stepped dots | Task 3.3 |
| Uppercase Geist labels | Task 3.4 |
| Sticky glass tool header | Task 4.2 |
| 2-column tool header grid | Task 4.3 |
| Outputs checklist in header | Task 4.4 |
| Nav bar glass 44px | Task 5.1 |
| Sidebar stage dots → Lucide | Task 5.2 |
| Active tool left-border accent | Task 5.3 |
| User avatar in sidebar footer | Task 5.4 |
| 5-stage segmented progress bar | Task 6.1 |
| Cobalt for "done" tool cards | Task 6.3 |
| Admin sidebar cobalt active | Task 1.4 + Task 7 |
| Admin pages cobalt accent | Task 8 |
| Stagger animations | Task 9.1 |
| prefers-reduced-motion | Task 9.2 |
| Mobile hamburger sidebar | Task 9.3 |
| Mobile compact tool header | Task 9.4 |
| iOS safe area action bar | Task 9.5 |
| Demo/live paridad | Automatic — shared components |
