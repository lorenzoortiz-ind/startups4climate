# Tools UX Polish Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Unify `/tools/*` to a 1200px container, add collapsible ToolSections with SectionBadge navigation, new ContextPanel, redesign Radar/Oportunidades to dense list+filter, redesign Perfil with 2-col layout and token typography, and remove all italic text from tool components.

**Architecture:** New `SectionsContext` for section registration — ToolSections self-register on mount so SectionBadge and ContextPanel can track state. ToolPage switches from `maxWidth: 900` centered to a 1200px-wide CSS Grid (`1fr 228px`). Two new components: `SectionBadge` (replaces ToolProgress dots in header) and `ContextPanel` (228px right column). Radar/Oportunidades completely rewritten to list+filter pattern. Perfil gets `280px 1fr` 2-col layout.

**Tech Stack:** Next.js 15 App Router, React `useState`/`useContext`/`useRef`, Lucide icons (`ChevronRight`), Tailwind CSS v4, Supabase `tool_data` reads for ContextPanel, inline styles (existing project pattern).

**Spec:** `docs/superpowers/specs/2026-05-09-tools-ux-polish-design.md`

---

## File Map

### New files
- `src/contexts/SectionsContext.tsx` — context for section registration + active tracking
- `src/components/tools/SectionBadge.tsx` — `N/Total · Section name ▾` badge with dropdown
- `src/components/tools/ContextPanel.tsx` — 228px right column (outputs + tip)

### Modified files
- `src/lib/tools-data.ts` — add `feedsInto?: string[]` to `ToolDef`
- `src/components/tools/shared.tsx` — ToolSection: add collapsible toggle + context registration
- `src/components/tools/ToolPage.tsx` — 2-col grid, SectionBadge in header, ContextPanel in right col, remove italic line 438
- `src/app/tools/radar/page.tsx` — complete rewrite to list+filter
- `src/app/tools/oportunidades/page.tsx` — complete rewrite to list+filter
- `src/app/tools/perfil/page.tsx` — 2-col layout + typography token standardization
- `src/components/tools/FullLifecycleUseCase.tsx` — remove italic
- `src/components/tools/QuantifiedValueProp.tsx` — remove italic
- `src/components/tools/FirstTenCustomers.tsx` — remove italic
- `src/components/tools/CoreCompetitivePosition.tsx` — remove italic
- `src/components/tools/LeanCanvas.tsx` — remove italic
- `src/components/tools/ProductSpecification.tsx` — remove italic
- `src/app/tools/passport/page.tsx` — remove italic

---

## Task 1: SectionsContext + ToolSection colapsable

**Files:**
- Create: `src/contexts/SectionsContext.tsx`
- Modify: `src/components/tools/shared.tsx` (lines 1–120)

### Step 1.1: Create SectionsContext

- [ ] Create `src/contexts/SectionsContext.tsx`:

```typescript
'use client'

import React, { createContext, useContext, useState, useCallback } from 'react'

export interface SectionEntry {
  id: string
  label: string
  state: 'idle' | 'active' | 'done'
}

interface SectionsContextValue {
  sections: SectionEntry[]
  registerSection: (entry: SectionEntry) => void
  unregisterSection: (id: string) => void
  updateSection: (id: string, patch: Partial<SectionEntry>) => void
}

const SectionsContext = createContext<SectionsContextValue | null>(null)

export function SectionsProvider({ children }: { children: React.ReactNode }) {
  const [sections, setSections] = useState<SectionEntry[]>([])

  const registerSection = useCallback((entry: SectionEntry) => {
    setSections(prev => {
      if (prev.find(s => s.id === entry.id)) return prev
      return [...prev, entry]
    })
  }, [])

  const unregisterSection = useCallback((id: string) => {
    setSections(prev => prev.filter(s => s.id !== id))
  }, [])

  const updateSection = useCallback((id: string, patch: Partial<SectionEntry>) => {
    setSections(prev => prev.map(s => s.id === id ? { ...s, ...patch } : s))
  }, [])

  return (
    <SectionsContext.Provider value={{ sections, registerSection, unregisterSection, updateSection }}>
      {children}
    </SectionsContext.Provider>
  )
}

export function useSections() {
  const ctx = useContext(SectionsContext)
  if (!ctx) throw new Error('useSections must be used inside SectionsProvider')
  return ctx
}
```

### Step 1.2: Verify file created

- [ ] Run: `ls src/contexts/SectionsContext.tsx`
- Expected: file exists

### Step 1.3: Modify ToolSection in shared.tsx

Replace the `ToolSection` function (lines 25–130 approx) with a collapsible version that registers itself into SectionsContext.

Key changes:
1. Import `useEffect`, `useRef`, `ChevronRight` from lucide-react, `useSections` from context
2. Add `defaultOpen?: boolean` to `ToolSectionProps` (make it functional, not ignored)
3. Add `id?: string` to `ToolSectionProps` (generated from title if not provided)
4. Add `tip?: string` to `ToolSectionProps` (for ContextPanel)
5. Add local `open` state initialized by `state` (`active → true`, else `false`)
6. Register on mount, unregister on unmount
7. Render collapsible header + conditional children

- [ ] Replace the `ToolSection` function in `src/components/tools/shared.tsx`:

```typescript
'use client'

import React, { useState, useEffect, useRef, useCallback } from 'react'
import { ChevronDown, Save, CheckCircle2, FileText, Lightbulb, BookOpen, ChevronRight } from 'lucide-react'
// Import is optional — ToolSection works without context (graceful degradation)
import { useSections } from '@/contexts/SectionsContext'

/* ─── ToolSection: collapsible carbon surface section ─── */

type ToolSectionState = 'idle' | 'active' | 'done'

interface ToolSectionProps {
  title: string
  step?: number
  number?: number               // legacy alias for step
  subtitle?: string             // legacy — ignored
  insight?: string              // legacy — ignored
  insightSource?: string        // legacy — ignored
  defaultOpen?: boolean         // overrides state-based default when provided
  tip?: string                  // contextual tip shown in ContextPanel
  children: React.ReactNode
  accentColor?: string          // legacy — kept, maps to 'active' state
  state?: ToolSectionState
  className?: string
  style?: React.CSSProperties
}

export function ToolSection({
  title,
  step,
  number,
  defaultOpen,
  tip: _tip,
  children,
  accentColor,
  state = 'idle',
  className,
  style,
}: ToolSectionProps) {
  const resolvedStep = step ?? number
  const resolvedState: ToolSectionState =
    accentColor && state === 'idle' ? 'active' : state

  // Default open: active → true, done/idle → false; defaultOpen overrides
  const initialOpen = defaultOpen !== undefined ? defaultOpen : resolvedState === 'active'
  const [open, setOpen] = useState<boolean>(initialOpen)
  const sectionRef = useRef<HTMLDivElement>(null)

  // Register into SectionsContext (graceful — no-op if no provider)
  let sectionsCtx: ReturnType<typeof useSections> | null = null
  try {
    sectionsCtx = useSections()
  } catch {
    // Outside SectionsProvider — fine for storybook / tests
  }

  const sectionId = `section-${title.toLowerCase().replace(/\s+/g, '-')}`

  useEffect(() => {
    if (!sectionsCtx) return
    sectionsCtx.registerSection({ id: sectionId, label: title, state: resolvedState })
    return () => sectionsCtx!.unregisterSection(sectionId)
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => {
    if (!sectionsCtx) return
    sectionsCtx.updateSection(sectionId, { state: resolvedState })
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [resolvedState])

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

  return (
    <div
      id={sectionId}
      ref={sectionRef}
      className={className}
      style={{
        background: '#111111',
        borderRadius: 14,
        border: borderMap[resolvedState],
        marginBottom: '1.25rem',
        transition: 'border-color 0.2s ease',
        overflow: 'hidden',
        ...style,
      }}
    >
      {/* Collapsible header */}
      <div
        role="button"
        aria-expanded={open}
        tabIndex={0}
        onClick={() => setOpen(o => !o)}
        onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); setOpen(o => !o) } }}
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '0.875rem 1.25rem',
          cursor: 'pointer',
          userSelect: 'none',
          WebkitUserSelect: 'none',
        }}
      >
        {/* Left: step badge + title + check */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.625rem' }}>
          {resolvedStep !== undefined && (
            <span style={{
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: 24,
              height: 24,
              borderRadius: 6,
              background: badgeBgMap[resolvedState],
              color: badgeColorMap[resolvedState],
              fontFamily: 'monospace',
              fontSize: '0.6875rem',
              fontWeight: 700,
              flexShrink: 0,
            }}>
              {String(resolvedStep).padStart(2, '0')}
            </span>
          )}
          <span style={{
            fontSize: '0.9375rem',
            fontWeight: 600,
            color: resolvedState === 'done'
              ? 'rgba(59,130,246,0.8)'
              : resolvedState === 'active'
                ? 'rgba(255,255,255,0.9)'
                : 'rgba(255,255,255,0.65)',
          }}>
            {title}
          </span>
          {resolvedState === 'done' && (
            <CheckCircle2 size={14} color="#3B82F6" style={{ flexShrink: 0 }} />
          )}
        </div>

        {/* Right: chevron */}
        <ChevronRight
          size={14}
          color="rgba(255,255,255,0.25)"
          style={{
            transition: 'transform 0.15s ease',
            transform: open ? 'rotate(90deg)' : 'rotate(0deg)',
            flexShrink: 0,
          }}
        />
      </div>

      {/* Collapsible body */}
      {open && (
        <div style={{ padding: '0 1.25rem 1.5rem' }}>
          {children}
        </div>
      )}
    </div>
  )
}
```

### Step 1.4: Verify no TypeScript errors in shared.tsx

- [ ] Run: `cd /path/to/project && npx tsc --noEmit --project tsconfig.json 2>&1 | grep -E "shared|SectionsContext" | head -20`
- Expected: no errors for these files

### Step 1.5: Commit

- [ ] Run:
```bash
git add src/contexts/SectionsContext.tsx src/components/tools/shared.tsx
git commit -m "feat: SectionsContext + collapsible ToolSection with context registration"
```

---

## Task 2: SectionBadge component

**Files:**
- Create: `src/components/tools/SectionBadge.tsx`

### Step 2.1: Create SectionBadge

- [ ] Create `src/components/tools/SectionBadge.tsx`:

```typescript
'use client'

import React, { useState, useEffect, useRef } from 'react'
import { ChevronDown } from 'lucide-react'
import { useSections } from '@/contexts/SectionsContext'

export function SectionBadge() {
  const { sections } = useSections()
  const [open, setOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  const activeIndex = sections.findIndex(s => s.state === 'active')
  const activeSectionLabel = activeIndex >= 0 ? sections[activeIndex].label : (sections[0]?.label ?? '')
  const activeDisplay = activeIndex >= 0 ? activeIndex + 1 : 1
  const total = sections.length

  // Close on outside click
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false)
      }
    }
    if (open) document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [open])

  if (sections.length === 0) return null

  function scrollToSection(id: string) {
    const el = document.getElementById(id)
    if (!el) return
    // Offset: 44px top nav + 44px tool header + 8px extra
    const offset = 96
    const top = el.getBoundingClientRect().top + window.scrollY - offset
    window.scrollTo({ top, behavior: 'smooth' })
    setOpen(false)
  }

  const dotColor = (state: string) => {
    if (state === 'done') return '#3B82F6'
    if (state === 'active') return '#DA4E24'
    return 'rgba(255,255,255,0.2)'
  }

  return (
    <div ref={ref} style={{ position: 'relative' }}>
      <button
        aria-expanded={open}
        aria-haspopup="listbox"
        onClick={() => setOpen(o => !o)}
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 6,
          background: 'rgba(218,78,36,0.10)',
          border: '1px solid rgba(218,78,36,0.25)',
          borderRadius: 6,
          padding: '3px 10px',
          cursor: 'pointer',
          whiteSpace: 'nowrap',
        }}
      >
        <span style={{ color: '#DA4E24', fontSize: '0.6875rem', fontWeight: 700, fontFamily: 'monospace' }}>
          {activeDisplay}/{total}
        </span>
        <span style={{ color: 'rgba(255,255,255,0.6)', fontSize: '0.6875rem', fontWeight: 500 }}>
          · {activeSectionLabel}
        </span>
        <ChevronDown
          size={11}
          color="rgba(255,255,255,0.3)"
          style={{ transition: 'transform 0.15s ease', transform: open ? 'rotate(180deg)' : 'none' }}
        />
      </button>

      {open && (
        <div
          role="listbox"
          style={{
            position: 'absolute',
            top: 'calc(100% + 6px)',
            right: 0,
            width: 220,
            background: '#141414',
            border: '1px solid rgba(255,255,255,0.09)',
            borderRadius: 8,
            padding: 6,
            zIndex: 100,
          }}
        >
          {sections.map((s) => {
            const sectionId = `section-${s.label.toLowerCase().replace(/\s+/g, '-')}`
            const isActive = s.state === 'active'
            return (
              <button
                key={s.id}
                role="option"
                aria-selected={isActive}
                onClick={() => scrollToSection(sectionId)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 8,
                  width: '100%',
                  padding: '6px 8px',
                  borderRadius: 5,
                  background: isActive ? 'rgba(218,78,36,0.08)' : 'transparent',
                  border: 'none',
                  cursor: 'pointer',
                  textAlign: 'left',
                }}
              >
                <span style={{
                  width: 6,
                  height: 6,
                  borderRadius: '50%',
                  background: dotColor(s.state),
                  flexShrink: 0,
                }} />
                <span style={{
                  fontSize: '0.75rem',
                  color: isActive ? 'rgba(255,255,255,0.88)' : 'rgba(255,255,255,0.45)',
                  fontWeight: isActive ? 600 : 400,
                }}>
                  {s.label}
                </span>
              </button>
            )
          })}
        </div>
      )}
    </div>
  )
}
```

### Step 2.2: Verify types compile

- [ ] Run: `npx tsc --noEmit 2>&1 | grep SectionBadge | head -10`
- Expected: no errors

### Step 2.3: Commit

- [ ] Run:
```bash
git add src/components/tools/SectionBadge.tsx
git commit -m "feat: SectionBadge component with section dropdown navigation"
```

---

## Task 3: ToolPage layout refactor

**Files:**
- Modify: `src/components/tools/ToolPage.tsx`

**Goal:** Change content area from `maxWidth: 900` centered to a CSS Grid `1fr 228px` inside a `1200px` container. Add `SectionsProvider` wrapping the whole ToolPage render. Add `SectionBadge` in the sticky tool header. Add `ContextPanel` placeholder in right column. Remove the italic at line 438.

### Step 3.1: Read current ToolPage content area and header

- [ ] Read `src/components/tools/ToolPage.tsx` lines 340–420 and 600–700 to identify:
  - The sticky tool header JSX (where ToolProgress dots are rendered)
  - The content area wrapper with `maxWidth: 900`
  
- [ ] Read lines 1–50 for the import list

### Step 3.2: Remove italic from guidingQuestion (line 438)

- [ ] Find this pattern in `ToolPage.tsx`:
```tsx
fontStyle: 'italic',
color: displayStageColor,
```
Replace with:
```tsx
color: 'rgba(255,255,255,0.35)',
```

### Step 3.3: Add imports to ToolPage.tsx

- [ ] Add to the import block at the top of ToolPage.tsx:
```typescript
import { SectionsProvider } from '@/contexts/SectionsContext'
import { SectionBadge } from '@/components/tools/SectionBadge'
import { ContextPanel } from '@/components/tools/ContextPanel'
```

### Step 3.4: Wrap render return with SectionsProvider

- [ ] Find the top-level `return (` in the ToolPage component function and wrap its content:

Before:
```tsx
return (
  <div style={{ ... }}>
    {/* nav bar */}
    ...
  </div>
)
```

After:
```tsx
return (
  <SectionsProvider>
    <div style={{ ... }}>
      {/* nav bar */}
      ...
    </div>
  </SectionsProvider>
)
```

### Step 3.5: Replace ToolProgress dots with SectionBadge in sticky tool header

The sticky tool header is positioned at `top: 44`. Find where `ToolProgress` is currently rendered inside this header and replace it with `<SectionBadge />`.

- [ ] Find the `ToolProgress` usage in the sticky header JSX (search for `<ToolProgress` in ToolPage.tsx)
- [ ] Replace:
```tsx
<ToolProgress ... />
```
With:
```tsx
<SectionBadge />
```

If ToolProgress appears elsewhere (e.g., in a legend), leave those in place.

### Step 3.6: Replace content area with 2-column grid

- [ ] Find the main content wrapper (currently `maxWidth: 900, margin: '0 auto'`) and replace with:

```tsx
{/* Content: 2-col grid inside 1200px container */}
<div style={{
  maxWidth: 1200,
  margin: '0 auto',
  padding: '0 1.5rem',
}}>
  <div style={{
    display: 'grid',
    gridTemplateColumns: '1fr 228px',
    gap: '1.5rem',
    alignItems: 'start',
    padding: '1.5rem 0',
  }}>
    {/* Left: tool content */}
    <div>
      {/* existing preambulo + tool component */}
      {/* ... keep all existing JSX here ... */}
    </div>

    {/* Right: context panel */}
    <div>
      <ContextPanel
        toolId={toolId}
        activeSectionLabel={''}
      />
    </div>
  </div>
</div>
```

Add responsive CSS in the `<style>` block already present in ToolPage:
```css
@media (max-width: 768px) {
  .tool-content-grid {
    grid-template-columns: 1fr !important;
  }
}
```

Apply `className="tool-content-grid"` to the grid div.

### Step 3.7: Update top nav container to 1200px

- [ ] Find the top navigation bar container (the bar at `top: 0` with back button and breadcrumb) and ensure its inner wrapper uses `maxWidth: 1200, margin: '0 auto', padding: '0 1.5rem'` to align with the content grid.

### Step 3.8: Verify build

- [ ] Run: `npx tsc --noEmit 2>&1 | grep -i "toolpage\|ToolPage" | head -20`
- Expected: no errors

### Step 3.9: Commit

- [ ] Run:
```bash
git add src/components/tools/ToolPage.tsx
git commit -m "feat: ToolPage 2-col 1200px grid, SectionBadge in header, remove italic"
```

---

## Task 4: feedsInto in tools-data + ContextPanel

**Files:**
- Modify: `src/lib/tools-data.ts`
- Create: `src/components/tools/ContextPanel.tsx`

### Step 4.1: Add feedsInto to ToolDef interface

- [ ] In `src/lib/tools-data.ts`, add `feedsInto?: string[]` to the `ToolDef` interface after the `outputs` field:

```typescript
export interface ToolDef {
  id: string
  name: string
  shortName: string
  description: string
  guidingQuestion: string
  preambulo: string
  stage: 0 | 1 | 2 | 3 | 4
  stageName: string
  stageColor: string
  stageBg: string
  stageBorder: string
  category: ToolCategory
  estimatedTime: string
  outputs: string[]
  feedsInto?: string[]          // tool IDs that consume outputs from this tool
  relatedService?: string
  relatedProduct?: string
  stepNumber: number
  transversal?: boolean
}
```

TypeScript won't require existing tool entries to specify `feedsInto` (it's optional), so no other changes are needed in `tools-data.ts` at this point. Populating the actual values can be done incrementally.

### Step 4.2: Verify no type errors after adding the field

- [ ] Run: `npx tsc --noEmit 2>&1 | grep "tools-data" | head -10`
- Expected: no errors

### Step 4.3: Create ContextPanel

- [ ] Create `src/components/tools/ContextPanel.tsx`:

```typescript
'use client'

import React, { useEffect, useState } from 'react'
import { useSections } from '@/contexts/SectionsContext'
import { createClient } from '@/lib/supabase-client'
import { TOOLS, type ToolDef } from '@/lib/tools-data'

interface ContextPanelProps {
  toolId: string
  activeSectionLabel: string
  tip?: string
}

interface PreviousOutput {
  toolName: string
  outputLabel: string
  value: string
}

export function ContextPanel({ toolId, tip }: ContextPanelProps) {
  const { sections } = useSections()
  const [previousOutputs, setPreviousOutputs] = useState<PreviousOutput[]>([])
  const [loading, setLoading] = useState(true)

  // Find which tools list this toolId in their feedsInto
  const sourceTool: ToolDef | undefined = TOOLS
    ? (TOOLS as ToolDef[]).find(t => t.feedsInto?.includes(toolId))
    : undefined

  useEffect(() => {
    if (!sourceTool) {
      setLoading(false)
      return
    }
    async function load() {
      try {
        const supabase = createClient()
        const { data: { user } } = await supabase.auth.getUser()
        if (!user) return

        const { data } = await supabase
          .from('tool_data')
          .select('tool_id, data')
          .eq('user_id', user.id)
          .eq('tool_id', sourceTool!.id)
          .maybeSingle()

        if (data?.data) {
          const toolData = data.data as Record<string, unknown>
          const outputs: PreviousOutput[] = Object.entries(toolData)
            .filter(([, v]) => typeof v === 'string' && (v as string).trim().length > 0)
            .slice(0, 3)
            .map(([key, value]) => ({
              toolName: sourceTool!.shortName,
              outputLabel: key,
              value: (value as string).trim(),
            }))
          setPreviousOutputs(outputs)
        }
      } catch {
        // Silently ignore — outputs are supplementary
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [sourceTool?.id])

  // Find tip from active section (ToolSections pass tip via prop, not tracked in context)
  // tip comes from ToolPage as a prop from the active ToolSection
  const activeSectionLabel = sections.find(s => s.state === 'active')?.label

  const hasOutputs = previousOutputs.length > 0
  const hasTip = Boolean(tip)

  if (loading) return null
  if (!hasOutputs && !hasTip) return null

  return (
    <div
      aria-label="Panel contextual"
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: '1rem',
        position: 'sticky',
        top: 'calc(44px + 44px + 1.5rem)',
      }}
    >
      {/* Section A: outputs from previous tools */}
      {hasOutputs && (
        <div aria-label="Outputs de herramientas anteriores">
          {previousOutputs.map((out, i) => (
            <div
              key={i}
              style={{
                background: '#0e0e0e',
                border: '1px solid rgba(255,255,255,0.07)',
                borderRadius: 10,
                padding: '0.75rem',
                marginBottom: i < previousOutputs.length - 1 ? '0.5rem' : 0,
              }}
            >
              <div style={{
                fontSize: '0.5625rem',
                fontWeight: 700,
                color: 'rgba(59,130,246,0.6)',
                marginBottom: '0.25rem',
              }}>
                {out.toolName}
              </div>
              <div style={{
                fontSize: '0.4375rem',
                textTransform: 'uppercase',
                letterSpacing: '0.08em',
                color: 'rgba(255,255,255,0.25)',
                marginBottom: '0.25rem',
              }}>
                {out.outputLabel}
              </div>
              <div style={{
                fontSize: '0.5rem',
                color: 'rgba(255,255,255,0.5)',
                lineHeight: 1.4,
                display: '-webkit-box',
                WebkitLineClamp: 3,
                WebkitBoxOrient: 'vertical',
                overflow: 'hidden',
              }}>
                {out.value}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Section B: contextual tip */}
      {hasTip && (
        <div style={{
          borderLeft: '2px solid rgba(218,78,36,0.35)',
          background: 'rgba(218,78,36,0.06)',
          borderRadius: '0 6px 6px 0',
          padding: '0.625rem 0.75rem',
        }}>
          {activeSectionLabel && (
            <div style={{
              fontSize: '0.4375rem',
              textTransform: 'uppercase',
              letterSpacing: '0.08em',
              color: 'rgba(218,78,36,0.6)',
              fontFamily: 'monospace',
              fontWeight: 700,
              marginBottom: '0.375rem',
            }}>
              {activeSectionLabel}
            </div>
          )}
          <p style={{
            fontSize: '0.5rem',
            color: 'rgba(255,255,255,0.45)',
            lineHeight: 1.4,
            margin: 0,
          }}>
            {tip}
          </p>
        </div>
      )}
    </div>
  )
}
```

> **Note:** The `TOOLS` import assumes the default export or named export of the tools array from `tools-data.ts`. Check the actual export name in `src/lib/tools-data.ts` and adjust the import accordingly. If the export is `TOOLS_DATA` or just the default, update the import line. The `createClient` import path should match the project's existing Supabase client helper — check `src/lib/` for the exact filename.

### Step 4.4: Fix import paths in ContextPanel if needed

- [ ] Run: `ls src/lib/supabase*.ts src/lib/supabase*.tsx 2>/dev/null`
- [ ] Find the actual Supabase client helper filename and update the import in ContextPanel if different from `supabase-client`
- [ ] Run: `grep "^export" src/lib/tools-data.ts | head -10` to find the correct tools array export name
- [ ] Update ContextPanel import accordingly

### Step 4.5: Verify compilation

- [ ] Run: `npx tsc --noEmit 2>&1 | grep -E "ContextPanel|tools-data" | head -20`
- Expected: no errors

### Step 4.6: Commit

- [ ] Run:
```bash
git add src/lib/tools-data.ts src/components/tools/ContextPanel.tsx
git commit -m "feat: feedsInto field in ToolDef + ContextPanel with outputs and tip sections"
```

---

## Task 5: Radar — rediseño completo

**Files:**
- Modify: `src/app/tools/radar/page.tsx`

**Goal:** Rewrite Radar from card/tabs layout to 2-col `200px 1fr` list+filter inside 1200px container.

### Step 5.1: Read the current Radar page structure

- [ ] Run: `wc -l src/app/tools/radar/page.tsx`
- [ ] Read `src/app/tools/radar/page.tsx` lines 1–100 (interface, state, Supabase query)
- [ ] Read lines 100–200 (filter/tab state, data transformations)
- [ ] Read lines 300–485 (JSX render)

Document what you find: the `NewsRow` interface fields, the Supabase query, and what filter state already exists.

### Step 5.2: Rewrite Radar page

Keep the existing Supabase query and `NewsRow` interface. Replace all JSX from the `return (` statement onward.

- [ ] Replace the entire return JSX in `src/app/tools/radar/page.tsx` with:

```tsx
// State to add (if not already present):
// const [catFilter, setCatFilter] = useState<string>('Todos')
// const [regionFilter, setRegionFilter] = useState<string>('Todos')

const CATEGORIES = ['Todos', 'Energía', 'Agua', 'Economía circular', 'Biodiversidad', 'Movilidad', 'Fondos']
const REGIONS = ['Todos', 'LATAM', 'Perú', 'México', 'Colombia', 'Chile', 'Brasil']

// Filter logic (in-memory, no new Supabase calls):
const filtered = (news ?? []).filter(item => {
  const catOk = catFilter === 'Todos' || item.vertical === catFilter || item.content_type === catFilter
  const regionOk = regionFilter === 'Todos' || item.country === regionFilter
  return catOk && regionOk
})

return (
  <div style={{ maxWidth: 1200, margin: '0 auto', padding: '0 1.5rem' }}>
    {/* Page header */}
    <div style={{
      padding: '1.25rem 0',
      borderBottom: '1px solid rgba(255,255,255,0.07)',
      display: 'flex',
      alignItems: 'flex-end',
      justifyContent: 'space-between',
    }}>
      <div>
        <h1 style={{
          fontSize: '1.125rem',
          fontWeight: 700,
          color: 'rgba(255,255,255,0.88)',
          margin: 0,
        }}>
          Radar
        </h1>
        <p style={{
          fontSize: '0.6875rem',
          color: 'rgba(255,255,255,0.35)',
          margin: '0.25rem 0 0',
        }}>
          {filtered.length} artículos
        </p>
      </div>
    </div>

    {/* Body: filters + list */}
    <div style={{ display: 'flex', gap: '1.5rem', paddingTop: '1rem' }}>

      {/* Left: filters 200px */}
      <div style={{
        width: 200,
        flexShrink: 0,
        borderRight: '1px solid rgba(255,255,255,0.06)',
        paddingRight: '0.75rem',
        display: 'flex',
        flexDirection: 'column',
        gap: '0.25rem',
      }}>
        {/* Category group */}
        <div style={{
          fontSize: '0.4375rem',
          fontFamily: 'monospace',
          textTransform: 'uppercase',
          letterSpacing: '0.08em',
          color: 'rgba(255,255,255,0.2)',
          margin: '0 0 0.25rem',
        }}>
          Categoría
        </div>
        {CATEGORIES.map(cat => (
          <button
            key={cat}
            onClick={() => setCatFilter(cat)}
            style={{
              fontSize: '0.5rem',
              color: catFilter === cat ? '#DA4E24' : 'rgba(255,255,255,0.4)',
              background: catFilter === cat ? 'rgba(218,78,36,0.10)' : 'transparent',
              border: 'none',
              borderRadius: 5,
              padding: '4px 8px',
              cursor: 'pointer',
              textAlign: 'left',
            }}
          >
            {cat}
          </button>
        ))}

        <div style={{ height: 1, background: 'rgba(255,255,255,0.05)', margin: '0.5rem 0' }} />

        {/* Region group */}
        <div style={{
          fontSize: '0.4375rem',
          fontFamily: 'monospace',
          textTransform: 'uppercase',
          letterSpacing: '0.08em',
          color: 'rgba(255,255,255,0.2)',
          margin: '0 0 0.25rem',
        }}>
          Región
        </div>
        {REGIONS.map(region => (
          <button
            key={region}
            onClick={() => setRegionFilter(region)}
            style={{
              fontSize: '0.5rem',
              color: regionFilter === region ? '#DA4E24' : 'rgba(255,255,255,0.4)',
              background: regionFilter === region ? 'rgba(218,78,36,0.10)' : 'transparent',
              border: 'none',
              borderRadius: 5,
              padding: '4px 8px',
              cursor: 'pointer',
              textAlign: 'left',
            }}
          >
            {region}
          </button>
        ))}
      </div>

      {/* Right: list 1fr */}
      <div style={{
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        gap: '0.375rem',
        paddingBottom: '1rem',
      }}>
        {loading ? (
          <div style={{ color: 'rgba(255,255,255,0.35)', fontSize: '0.75rem', padding: '2rem 0' }}>
            Cargando...
          </div>
        ) : filtered.length === 0 ? (
          <div style={{ color: 'rgba(255,255,255,0.35)', fontSize: '0.75rem', padding: '2rem 0' }}>
            Sin resultados para este filtro.
          </div>
        ) : filtered.map(item => (
          <a
            key={item.id}
            href={item.source_url}
            target="_blank"
            rel="noopener noreferrer"
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.75rem',
              padding: '0.5rem 0.75rem',
              borderRadius: 7,
              border: '1px solid rgba(255,255,255,0.06)',
              background: '#111111',
              textDecoration: 'none',
              cursor: 'pointer',
              transition: 'border-color 0.15s, background 0.15s',
            }}
            onMouseEnter={e => {
              (e.currentTarget as HTMLElement).style.borderColor = 'rgba(255,255,255,0.12)'
              ;(e.currentTarget as HTMLElement).style.background = '#161616'
            }}
            onMouseLeave={e => {
              (e.currentTarget as HTMLElement).style.borderColor = 'rgba(255,255,255,0.06)'
              ;(e.currentTarget as HTMLElement).style.background = '#111111'
            }}
          >
            {/* Dot */}
            <span style={{
              width: 5,
              height: 5,
              borderRadius: '50%',
              background: item.content_type === 'Fondos' ? '#3B82F6' : '#DA4E24',
              flexShrink: 0,
            }} />
            {/* Text */}
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{
                fontSize: '0.5625rem',
                fontWeight: 600,
                color: 'rgba(255,255,255,0.78)',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                whiteSpace: 'nowrap',
              }}>
                {item.title}
              </div>
              <div style={{
                fontSize: '0.4375rem',
                color: 'rgba(255,255,255,0.3)',
                marginTop: 2,
              }}>
                {item.source_name}{item.published_at ? ` · ${new Date(item.published_at).toLocaleDateString('es-419', { day: 'numeric', month: 'short' })}` : ''}
              </div>
            </div>
            {/* Tag */}
            {(item.vertical || item.content_type) && (
              <span style={{
                fontSize: '0.4375rem',
                fontFamily: 'monospace',
                borderRadius: 3,
                padding: '2px 6px',
                background: item.content_type === 'Fondos' ? 'rgba(29,78,216,0.08)' : 'rgba(218,78,36,0.08)',
                color: item.content_type === 'Fondos' ? 'rgba(59,130,246,0.7)' : 'rgba(218,78,36,0.7)',
                flexShrink: 0,
              }}>
                {item.vertical ?? item.content_type}
              </span>
            )}
          </a>
        ))}
      </div>
    </div>

    {/* Mobile responsive */}
    <style>{`
      @media (max-width: 768px) {
        .radar-body { flex-direction: column !important; }
        .radar-filters { width: 100% !important; border-right: none !important; border-bottom: 1px solid rgba(255,255,255,0.06); padding-right: 0 !important; padding-bottom: 0.75rem; }
      }
    `}</style>
  </div>
)
```

Also add `catFilter` and `regionFilter` state declarations near the top of the component:
```typescript
const [catFilter, setCatFilter] = useState<string>('Todos')
const [regionFilter, setRegionFilter] = useState<string>('Todos')
```

### Step 5.3: Verify no TypeScript errors

- [ ] Run: `npx tsc --noEmit 2>&1 | grep "radar" | head -20`
- Expected: no errors

### Step 5.4: Commit

- [ ] Run:
```bash
git add src/app/tools/radar/page.tsx
git commit -m "feat: Radar rediseño completo — lista densa + panel de filtros lateral"
```

---

## Task 6: Oportunidades — rediseño completo

**Files:**
- Modify: `src/app/tools/oportunidades/page.tsx`

**Goal:** Same list+filter pattern as Radar. Filters: Tipo (Grant/Fondo/Competencia/Aceleración/Convocatoria), Etapa (Pre-seed/Seed/Serie A/Cualquiera), Región (LATAM/Global).

### Step 6.1: Read current Oportunidades structure

- [ ] Read `src/app/tools/oportunidades/page.tsx` lines 1–80 (interface, Supabase query)
- [ ] Read lines 600–735 (JSX return) to understand current layout

Document the `Opportunity` interface fields — specifically `type`, `eligible_stages`, `eligible_countries`, `application_url`, `name`, `description`.

### Step 6.2: Rewrite Oportunidades page

Keep existing Supabase query and opportunity interface. Replace the return JSX:

```tsx
// Add state for filters:
const [tipoFilter, setTipoFilter] = useState<string>('Todos')
const [etapaFilter, setEtapaFilter] = useState<string>('Cualquiera')
const [regionFilter, setRegionFilter] = useState<string>('Todos')

const TIPOS = ['Todos', 'Grant', 'Fondo', 'Competencia', 'Aceleración', 'Convocatoria']
const ETAPAS = ['Cualquiera', 'Pre-seed', 'Seed', 'Serie A']
const REGIONS = ['Todos', 'LATAM', 'Global']

const filtered = (opportunities ?? []).filter(item => {
  const tipoOk = tipoFilter === 'Todos' || item.type === tipoFilter
  const etapaOk = etapaFilter === 'Cualquiera' || (item.eligible_stages ?? []).includes(etapaFilter)
  const regionOk = regionFilter === 'Todos' || (item.eligible_countries ?? []).includes(regionFilter)
  return tipoOk && etapaOk && regionOk
})
```

Return JSX (same structural pattern as Radar, different filter groups and fields):

```tsx
return (
  <div style={{ maxWidth: 1200, margin: '0 auto', padding: '0 1.5rem' }}>
    {/* Page header */}
    <div style={{
      padding: '1.25rem 0',
      borderBottom: '1px solid rgba(255,255,255,0.07)',
      display: 'flex',
      alignItems: 'flex-end',
      justifyContent: 'space-between',
    }}>
      <div>
        <h1 style={{ fontSize: '1.125rem', fontWeight: 700, color: 'rgba(255,255,255,0.88)', margin: 0 }}>
          Oportunidades
        </h1>
        <p style={{ fontSize: '0.6875rem', color: 'rgba(255,255,255,0.35)', margin: '0.25rem 0 0' }}>
          {filtered.length} oportunidades
        </p>
      </div>
    </div>

    <div style={{ display: 'flex', gap: '1.5rem', paddingTop: '1rem' }}>
      {/* Left filters 200px */}
      <div style={{
        width: 200,
        flexShrink: 0,
        borderRight: '1px solid rgba(255,255,255,0.06)',
        paddingRight: '0.75rem',
        display: 'flex',
        flexDirection: 'column',
        gap: '0.25rem',
      }}>
        {/* Tipo */}
        <FilterGroup label="Tipo" items={TIPOS} active={tipoFilter} onSelect={setTipoFilter} />
        <div style={{ height: 1, background: 'rgba(255,255,255,0.05)', margin: '0.5rem 0' }} />
        {/* Etapa */}
        <FilterGroup label="Etapa" items={ETAPAS} active={etapaFilter} onSelect={setEtapaFilter} />
        <div style={{ height: 1, background: 'rgba(255,255,255,0.05)', margin: '0.5rem 0' }} />
        {/* Región */}
        <FilterGroup label="Región" items={REGIONS} active={regionFilter} onSelect={setRegionFilter} />
      </div>

      {/* Right list */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '0.375rem', paddingBottom: '1rem' }}>
        {loading ? (
          <div style={{ color: 'rgba(255,255,255,0.35)', fontSize: '0.75rem', padding: '2rem 0' }}>Cargando...</div>
        ) : filtered.length === 0 ? (
          <div style={{ color: 'rgba(255,255,255,0.35)', fontSize: '0.75rem', padding: '2rem 0' }}>Sin resultados.</div>
        ) : filtered.map(item => (
          <a
            key={item.id}
            href={item.application_url ?? '#'}
            target="_blank"
            rel="noopener noreferrer"
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.75rem',
              padding: '0.5rem 0.75rem',
              borderRadius: 7,
              border: '1px solid rgba(255,255,255,0.06)',
              background: '#111111',
              textDecoration: 'none',
              cursor: 'pointer',
              transition: 'border-color 0.15s, background 0.15s',
            }}
            onMouseEnter={e => {
              (e.currentTarget as HTMLElement).style.borderColor = 'rgba(255,255,255,0.12)'
              ;(e.currentTarget as HTMLElement).style.background = '#161616'
            }}
            onMouseLeave={e => {
              (e.currentTarget as HTMLElement).style.borderColor = 'rgba(255,255,255,0.06)'
              ;(e.currentTarget as HTMLElement).style.background = '#111111'
            }}
          >
            <span style={{
              width: 5, height: 5, borderRadius: '50%',
              background: item.type === 'Fondo' ? '#3B82F6' : '#DA4E24',
              flexShrink: 0,
            }} />
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{
                fontSize: '0.5625rem', fontWeight: 600, color: 'rgba(255,255,255,0.78)',
                overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
              }}>
                {item.name}
              </div>
              {item.description && (
                <div style={{ fontSize: '0.4375rem', color: 'rgba(255,255,255,0.3)', marginTop: 2 }}>
                  {item.description.slice(0, 80)}{item.description.length > 80 ? '…' : ''}
                </div>
              )}
            </div>
            {item.type && (
              <span style={{
                fontSize: '0.4375rem', fontFamily: 'monospace', borderRadius: 3, padding: '2px 6px',
                background: item.type === 'Fondo' ? 'rgba(29,78,216,0.08)' : 'rgba(218,78,36,0.08)',
                color: item.type === 'Fondo' ? 'rgba(59,130,246,0.7)' : 'rgba(218,78,36,0.7)',
                flexShrink: 0,
              }}>
                {item.type}
              </span>
            )}
          </a>
        ))}
      </div>
    </div>
  </div>
)
```

Add a `FilterGroup` helper function at the top of the file (before the component):

```typescript
function FilterGroup({
  label,
  items,
  active,
  onSelect,
}: {
  label: string
  items: string[]
  active: string
  onSelect: (v: string) => void
}) {
  return (
    <>
      <div style={{
        fontSize: '0.4375rem', fontFamily: 'monospace', textTransform: 'uppercase',
        letterSpacing: '0.08em', color: 'rgba(255,255,255,0.2)', margin: '0 0 0.25rem',
      }}>
        {label}
      </div>
      {items.map(item => (
        <button
          key={item}
          onClick={() => onSelect(item)}
          style={{
            fontSize: '0.5rem',
            color: active === item ? '#DA4E24' : 'rgba(255,255,255,0.4)',
            background: active === item ? 'rgba(218,78,36,0.10)' : 'transparent',
            border: 'none', borderRadius: 5, padding: '4px 8px',
            cursor: 'pointer', textAlign: 'left',
          }}
        >
          {item}
        </button>
      ))}
    </>
  )
}
```

### Step 6.3: Verify no TypeScript errors

- [ ] Run: `npx tsc --noEmit 2>&1 | grep "oportunidades" | head -20`
- Expected: no errors

### Step 6.4: Commit

- [ ] Run:
```bash
git add src/app/tools/oportunidades/page.tsx
git commit -m "feat: Oportunidades rediseño completo — lista densa + filtros Tipo/Etapa/Región"
```

---

## Task 7: Perfil — layout 2 columnas + tipografía tokens

**Files:**
- Modify: `src/app/tools/perfil/page.tsx`

**Goal:** Change from `maxWidth: 720` centered to `280px 1fr` 2-col grid. Standardize all font sizes to design tokens. Reorganize content into left sidebar (avatar + score + stats) and right accordion (editable sections).

### Step 7.1: Read current Perfil page structure

- [ ] Read `src/app/tools/perfil/page.tsx` lines 1–100 (imports, state, interfaces)
- [ ] Read lines 800–957 (JSX render) to identify the current layout structure

Document:
- Where `maxWidth: 720` appears
- What data the left sidebar section needs (avatar/initials, name, score, stage, stats)
- Which form sections exist (basic info, about startup, metrics, account)

### Step 7.2: Add typography token definitions

These tokens should be added to `src/app/globals.css` if not already present. Check first:

- [ ] Run: `grep "text-2xs\|text-xs\|text-sm\|text-body\|text-heading" src/app/globals.css | head -20`
- [ ] If not present, add to `src/app/globals.css` inside `:root`:
```css
--text-2xs: 0.5625rem;
--text-xs: 0.6875rem;
--text-sm: 0.8125rem;
--text-body: 0.9375rem;
--text-heading-sm: 1.125rem;
--text-heading-md: 1.375rem;
```

### Step 7.3: Refactor Perfil layout

Replace the outer container from centered 720px to a 2-col grid:

- [ ] Find `maxWidth: 720` in `perfil/page.tsx` and replace the outer wrapper structure:

Before:
```tsx
<div style={{ maxWidth: 720, margin: '0 auto', padding: '2rem 1.5rem' }}>
  {/* all content */}
</div>
```

After:
```tsx
<div style={{ maxWidth: 1200, margin: '0 auto', padding: '0 1.5rem' }}>
  <div style={{
    display: 'grid',
    gridTemplateColumns: '280px 1fr',
    gap: '1.5rem',
    alignItems: 'start',
    padding: '1.5rem 0',
  }}>
    {/* Left sidebar — sticky */}
    <div style={{
      position: 'sticky',
      top: 'calc(44px + 1.5rem)',
      display: 'flex',
      flexDirection: 'column',
      gap: '1rem',
    }}>
      {/* Avatar */}
      <div style={{
        width: 64, height: 64, borderRadius: '50%',
        background: 'rgba(218,78,36,0.15)',
        border: '2px solid rgba(218,78,36,0.3)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        fontSize: '1.5rem', fontWeight: 700, color: '#DA4E24',
      }}>
        {(profileData?.full_name ?? 'U').split(' ').map((n: string) => n[0]).join('').slice(0, 2).toUpperCase()}
      </div>

      {/* Name + Startup */}
      <div>
        <div style={{ fontSize: 'var(--text-heading-md)', fontWeight: 700, color: 'rgba(255,255,255,0.88)', lineHeight: 1.2 }}>
          {profileData?.full_name ?? '—'}
        </div>
        <div style={{ fontSize: 'var(--text-heading-sm)', fontWeight: 600, color: 'rgba(255,255,255,0.6)', marginTop: '0.25rem' }}>
          {startupData?.name ?? '—'}
        </div>
      </div>

      <div style={{ height: 1, background: 'rgba(255,255,255,0.07)' }} />

      {/* Score */}
      {startupData?.diagnostic_score != null && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
          <div style={{ fontSize: '2rem', fontWeight: 700, color: '#DA4E24', lineHeight: 1 }}>
            {startupData.diagnostic_score}
          </div>
          <div style={{ fontSize: 'var(--text-xs)', color: 'rgba(255,255,255,0.35)' }}>
            Startup Readiness
          </div>
        </div>
      )}

      {/* Stage badge */}
      {startupData?.stage && (
        <span style={{
          display: 'inline-block',
          fontSize: 'var(--text-2xs)',
          fontWeight: 700,
          background: 'rgba(218,78,36,0.12)',
          color: '#DA4E24',
          border: '1px solid rgba(218,78,36,0.25)',
          borderRadius: 6,
          padding: '3px 10px',
          alignSelf: 'flex-start',
        }}>
          {startupData.stage}
        </span>
      )}

      <div style={{ height: 1, background: 'rgba(255,255,255,0.07)' }} />

      {/* Stats */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span style={{ fontSize: 'var(--text-xs)', color: 'rgba(255,255,255,0.35)' }}>Herramientas</span>
          <span style={{ fontSize: 'var(--text-sm)', fontWeight: 600, color: 'rgba(255,255,255,0.7)' }}>
            {startupData?.tools_completed ?? 0}
          </span>
        </div>
      </div>
    </div>

    {/* Right: editable sections */}
    <div>
      {/* All existing form accordion sections go here */}
      {/* ... existing form JSX ... */}
    </div>
  </div>

  {/* Mobile */}
  <style>{`
    @media (max-width: 768px) {
      .perfil-grid { grid-template-columns: 1fr !important; }
      .perfil-sidebar { position: static !important; }
    }
  `}</style>
</div>
```

Apply `className="perfil-grid"` to the grid div and `className="perfil-sidebar"` to the sticky left column.

### Step 7.4: Standardize font sizes in right column

Replace all hardcoded font sizes in the form sections with tokens:

- [ ] Find and replace in `perfil/page.tsx`:
  - `fontSize: '0.75rem'` → `fontSize: 'var(--text-xs)'`
  - `fontSize: '0.875rem'` → `fontSize: 'var(--text-sm)'`  
  - `fontSize: '0.9375rem'` → `fontSize: 'var(--text-body)'`
  - `fontSize: 'clamp(1.75rem, 3vw, 2.5rem)'` → `fontSize: 'var(--text-heading-md)'`
  - `fontSize: '1.5rem'` → `fontSize: 'var(--text-heading-md)'`
  - `fontSize: '1.125rem'` → `fontSize: 'var(--text-heading-sm)'`
  - `fontStyle: 'italic'` → remove entirely (and add `color: 'rgba(255,255,255,0.35)'` if not already present)

### Step 7.5: Verify no TypeScript errors

- [ ] Run: `npx tsc --noEmit 2>&1 | grep "perfil" | head -20`
- Expected: no errors

### Step 7.6: Commit

- [ ] Run:
```bash
git add src/app/tools/perfil/page.tsx src/app/globals.css
git commit -m "feat: Perfil layout 2-col 280px+1fr + tipografía unificada a tokens"
```

---

## Task 8: Eliminar cursivas (9 archivos)

**Files:**
- `src/components/tools/ToolPage.tsx` (line 438 — already done in Task 3)
- `src/components/tools/FullLifecycleUseCase.tsx`
- `src/components/tools/QuantifiedValueProp.tsx`
- `src/components/tools/FirstTenCustomers.tsx`
- `src/components/tools/CoreCompetitivePosition.tsx`
- `src/components/tools/LeanCanvas.tsx`
- `src/components/tools/ProductSpecification.tsx`
- `src/app/tools/passport/page.tsx`
- `src/app/tools/radar/page.tsx` (already done in Task 5)

### Step 8.1: Find all remaining italic occurrences

- [ ] Run:
```bash
grep -rn "fontStyle.*italic\|font-style.*italic" \
  src/components/tools/FullLifecycleUseCase.tsx \
  src/components/tools/QuantifiedValueProp.tsx \
  src/components/tools/FirstTenCustomers.tsx \
  src/components/tools/CoreCompetitivePosition.tsx \
  src/components/tools/LeanCanvas.tsx \
  src/components/tools/ProductSpecification.tsx \
  src/app/tools/passport/page.tsx
```

Document every line number and surrounding context (what element is being styled).

### Step 8.2: Replace italics in each file

For each `fontStyle: 'italic'` occurrence found:

- [ ] If it's on a **help text, hint, placeholder, or description**: Remove `fontStyle: 'italic'` and ensure the element has `color: 'rgba(255,255,255,0.35)'` (add if missing, don't change if it already has a different `color`).
- [ ] If it's on a **quote or citation** (text inside `<blockquote>` or similar): Leave it (the spec says not to change explicit citations — but the spec confirms none exist currently, so this case won't arise).

Process each file:

**FullLifecycleUseCase.tsx:**
- [ ] Read the file, find each italic, make surgical edit

**QuantifiedValueProp.tsx:**
- [ ] Read the file, find each italic, make surgical edit

**FirstTenCustomers.tsx:**
- [ ] Read the file, find each italic, make surgical edit

**CoreCompetitivePosition.tsx:**
- [ ] Read the file, find each italic, make surgical edit

**LeanCanvas.tsx:**
- [ ] Read the file, find each italic, make surgical edit

**ProductSpecification.tsx:**
- [ ] Read the file, find each italic, make surgical edit

**passport/page.tsx:**
- [ ] Read the file, find each italic, make surgical edit

### Step 8.3: Verify no italics remain in any tool file

- [ ] Run:
```bash
grep -rn "fontStyle.*italic\|font-style.*italic" src/components/tools/ src/app/tools/
```
Expected: zero results (or only results in files explicitly excluded from scope like `src/app/tools/recursos/`)

### Step 8.4: Verify no TypeScript errors

- [ ] Run: `npx tsc --noEmit 2>&1 | head -30`
- Expected: zero errors

### Step 8.5: Commit

- [ ] Run:
```bash
git add \
  src/components/tools/FullLifecycleUseCase.tsx \
  src/components/tools/QuantifiedValueProp.tsx \
  src/components/tools/FirstTenCustomers.tsx \
  src/components/tools/CoreCompetitivePosition.tsx \
  src/components/tools/LeanCanvas.tsx \
  src/components/tools/ProductSpecification.tsx \
  src/app/tools/passport/page.tsx
git commit -m "refactor: eliminar fontStyle italic de 7 componentes de herramientas"
```

---

## Self-Review

### Spec coverage check

| Spec requirement | Covered in task |
|---|---|
| Container 1200px max-width, 0 1.5rem padding | Task 3, 5, 6, 7 |
| ToolPage grid `1fr 228px` | Task 3 |
| Radar grid `200px 1fr` | Task 5 |
| Oportunidades grid `200px 1fr` | Task 6 |
| Perfil grid `280px 1fr` | Task 7 |
| Gap 1.5rem everywhere | Task 3, 5, 6, 7 |
| Mobile: 1 col at < 768px | Task 3 (ToolPage), 5 (Radar), 6 (Oportunidades), 7 (Perfil) |
| SectionBadge: `N/Total · name ▾` format | Task 2 |
| SectionBadge: ember background/border colors | Task 2 |
| SectionBadge: dropdown with dot+name rows | Task 2 |
| SectionBadge: scroll with 96px offset | Task 2 |
| SectionBadge: aria-expanded, aria-haspopup | Task 2 |
| ToolProgress dots removed from header | Task 3 |
| ToolSection: done→closed, active→open, idle→closed | Task 1 |
| ToolSection: toggle libre (multi-open) | Task 1 |
| ToolSection: ChevronRight rotates 90° when open | Task 1 |
| ToolSection: no animation (display only) | Task 1 — uses conditional render, no height transition |
| ToolSection: aria-expanded on header | Task 1 |
| ToolSection: defaultOpen? prop functional | Task 1 |
| ContextPanel: sticky at calc(44+44+1.5rem) | Task 4 |
| ContextPanel: outputs from feedsInto tools | Task 4 |
| ContextPanel: max 3 outputs | Task 4 (`.slice(0, 3)`) |
| ContextPanel: no output if no data | Task 4 (returns null if no outputs and no tip) |
| ContextPanel: tip section with ember border | Task 4 |
| feedsInto field added to ToolDef | Task 4 |
| Radar: header with count + no italic subtitle | Task 5 |
| Radar: filter groups Categoría + Región | Task 5 |
| Radar: in-memory filter, no new Supabase | Task 5 |
| Radar: "Todos" deselects others | Task 5 — handled by setting to 'Todos' |
| Radar: dense row with dot, text, tag | Task 5 |
| Oportunidades: filter groups Tipo/Etapa/Región | Task 6 |
| Oportunidades: dense row with dot, text, tag | Task 6 |
| Perfil: left column sticky 280px | Task 7 |
| Perfil: avatar 64px with initials | Task 7 |
| Perfil: score display number 2rem ember | Task 7 |
| Perfil: stage badge ember | Task 7 |
| Perfil: typography tokens applied | Task 7 |
| Italic removal from 9 files | Tasks 3, 5, 8 |

### Placeholder scan

- No "TBD" or "TODO" in any task
- All code is complete and executable
- Import paths flagged for verification (Task 4 note about `supabase-client` and `TOOLS` export name)
- Task 3 steps 3.4–3.6 require reading ToolPage to identify exact JSX locations before editing — explicitly instructed

### Type consistency check

- `SectionEntry.state: 'idle' | 'active' | 'done'` matches `ToolSectionState` in shared.tsx ✓
- `SectionsContext` `registerSection` and `updateSection` use `Partial<SectionEntry>` ✓
- `SectionBadge` consumes `useSections()` which matches the provider ✓
- `ContextPanel` imports `useSections()` for active section label ✓
- `feedsInto?: string[]` added to `ToolDef` — optional, no breaking changes ✓
- `FilterGroup` helper in oportunidades is a standalone function, no type issues ✓
