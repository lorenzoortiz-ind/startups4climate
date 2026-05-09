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
        <span style={{ color: 'rgba(255,255,255,0.6)', fontSize: '0.6875rem', fontWeight: 500, maxWidth: 140, overflow: 'hidden', textOverflow: 'ellipsis' }}>
          · {activeSectionLabel}
        </span>
        <ChevronDown
          size={11}
          color="rgba(255,255,255,0.3)"
          style={{ transition: 'transform 0.15s ease', transform: open ? 'rotate(180deg)' : 'none', flexShrink: 0 }}
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
            const sectionId = `section-${s.label.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '')}`
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
