'use client'

import React, { useState } from 'react'
import { ChevronDown, Save, CheckCircle2, FileText, Lightbulb, BookOpen } from 'lucide-react'

/* ─── ToolSection: 3-state flat carbon surface section ─── */

type ToolSectionState = 'idle' | 'active' | 'done'

interface ToolSectionProps {
  title: string
  step?: number
  number?: number               // legacy alias for step — kept for backward compat
  subtitle?: string             // legacy prop — ignored in new design
  insight?: string              // legacy prop — ignored in new design
  insightSource?: string        // legacy prop — ignored in new design
  defaultOpen?: boolean         // legacy prop — ignored in new design
  children: React.ReactNode
  accentColor?: string          // legacy prop — kept for backward compat, overrides to 'active' state
  state?: ToolSectionState
  className?: string
  style?: React.CSSProperties
}

export function ToolSection({
  title,
  step,
  number,
  children,
  accentColor,
  state = 'idle',
  className,
  style,
}: ToolSectionProps) {
  const resolvedStep = step ?? number
  const resolvedState: ToolSectionState =
    accentColor && state === 'idle' ? 'active' : state

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
        {resolvedStep !== undefined && (
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
            {resolvedState === 'done' ? <CheckCircle2 size={13} /> : resolvedStep}
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

/* ─── InsightPanel: standalone strategic reference ─── */

export interface InsightPanelProps {
  title?: string
  children: React.ReactNode
  accentColor?: string
  icon?: React.ReactNode
}

export function InsightPanel({
  title = 'Referencia estratégica',
  children,
  accentColor = 'var(--color-accent-primary)',
  icon,
}: InsightPanelProps) {
  return (
    <div style={{
      display: 'flex',
      gap: '0.875rem',
      padding: '1rem 1.25rem',
      borderRadius: 12,
      background: `${accentColor}10`,
      border: `1px solid ${accentColor}22`,
    }}>
      <div style={{ flexShrink: 0, marginTop: 2 }}>
        {icon || <BookOpen size={16} color={accentColor} />}
      </div>
      <div>
        <span style={{
          fontFamily: 'var(--font-heading)',
          fontSize: '0.75rem',
          fontWeight: 700,
          color: accentColor,
          textTransform: 'uppercase',
          letterSpacing: '0.04em',
          display: 'block',
          marginBottom: '0.375rem',
        }}>
          {title}
        </span>
        <div style={{
          fontFamily: 'var(--font-body)',
          fontSize: '0.8125rem',
          lineHeight: 1.65,
          color: 'var(--color-text-secondary)',
        }}>
          {children}
        </div>
      </div>
    </div>
  )
}

/* ─── ToolActionBar: unified save/complete/report buttons ─── */

export interface ToolActionBarProps {
  onSave?: () => void
  onComplete: () => void
  onReport: () => void
  saved?: boolean
  accentColor?: string
}

export function ToolActionBar({ onSave, onComplete, onReport, saved = false, accentColor = '#1F77F6' }: ToolActionBarProps) {
  return (
    <div style={{
      display: 'flex',
      gap: '0.75rem',
      flexWrap: 'wrap',
      marginTop: '1rem',
      padding: '1.25rem 1.5rem',
      borderRadius: 14,
      background: 'var(--color-bg-card)',
      border: '1px solid var(--color-border)',
    }}>
      {onSave && (
        <button onClick={onSave} style={{
          ...btnBase,
          color: accentColor,
          border: `1.5px solid ${accentColor}40`,
          background: 'transparent',
        }}>
          <Save size={15} /> {saved ? '¡Guardado!' : 'Guardar progreso'}
        </button>
      )}
      <button onClick={onComplete} style={{
        ...btnBase,
        color: 'white',
        background: accentColor,
        border: 'none',
        boxShadow: `0 2px 8px ${accentColor}40`,
      }}>
        <CheckCircle2 size={15} /> Marcar como completada
      </button>
      <button onClick={onReport} style={{
        ...btnBase,
        color: 'var(--color-text-secondary)',
        border: '1.5px solid var(--color-border)',
        background: 'transparent',
      }}>
        <FileText size={15} /> Generar reporte
      </button>
    </div>
  )
}

/* ─── ToolProgress: inline completion indicator ─── */

export function ToolProgress({ filled, total, accentColor = 'var(--color-accent-primary)' }: {
  filled: number
  total: number
  accentColor?: string
}) {
  const pct = total > 0 ? Math.round((filled / total) * 100) : 0
  return (
    <div style={{
      background: 'var(--color-bg-card)',
      borderRadius: 12,
      border: '1px solid var(--color-border)',
      padding: '1rem 1.25rem',
      display: 'flex',
      alignItems: 'center',
      gap: '1rem',
    }}>
      <div style={{ flex: 1 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.375rem' }}>
          <span style={{ fontFamily: 'var(--font-body)', fontSize: '0.8125rem', color: 'var(--color-text-secondary)' }}>
            Progreso
          </span>
          <span style={{ fontFamily: 'var(--font-body)', fontSize: '0.8125rem', fontWeight: 700, color: accentColor }}>
            {filled}/{total} secciones
          </span>
        </div>
        <div style={{ height: 6, borderRadius: 3, background: 'var(--color-border)' }}>
          <div style={{
            height: '100%',
            borderRadius: 3,
            background: `linear-gradient(90deg, ${accentColor}, ${accentColor}CC)`,
            width: `${pct}%`,
            transition: 'width 0.4s ease',
          }} />
        </div>
      </div>
      <div style={{
        fontFamily: 'var(--font-heading)',
        fontSize: '1.25rem',
        fontWeight: 700,
        color: accentColor,
        minWidth: 45,
        textAlign: 'right',
      }}>
        {pct}%
      </div>
    </div>
  )
}

/* ─── Shared input/textarea styles ─── */

export const inputStyle: React.CSSProperties = {
  width: '100%',
  padding: '0.75rem 1rem',
  borderRadius: 10,
  border: '1px solid var(--color-border)',
  background: 'var(--color-bg-primary)',
  fontFamily: 'var(--font-body)',
  fontSize: '0.875rem',
  color: 'var(--color-text-primary)',
  outline: 'none',
  transition: 'border-color 0.2s, box-shadow 0.2s',
}

export const textareaStyle: React.CSSProperties = {
  ...inputStyle,
  resize: 'vertical' as const,
  lineHeight: 1.7,
  minHeight: 100,
}

export const labelStyle: React.CSSProperties = {
  fontFamily: 'var(--font-heading)',
  fontSize: '0.75rem',
  fontWeight: 600,
  color: 'var(--color-text-secondary)',
  display: 'block',
  marginBottom: '0.375rem',
  letterSpacing: '0.01em',
}

export const btnSmall: React.CSSProperties = {
  display: 'inline-flex',
  alignItems: 'center',
  gap: '0.3rem',
  padding: '0.4rem 0.875rem',
  borderRadius: 8,
  fontSize: '0.75rem',
  fontFamily: 'var(--font-body)',
  fontWeight: 600,
  background: 'transparent',
  border: '1px solid var(--color-border)',
  cursor: 'pointer',
  transition: 'all 0.15s',
}

const btnBase: React.CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  gap: '0.5rem',
  padding: '0.75rem 1.25rem',
  borderRadius: 10,
  fontFamily: 'var(--font-body)',
  fontSize: '0.875rem',
  fontWeight: 600,
  cursor: 'pointer',
  transition: 'all 0.15s',
}
