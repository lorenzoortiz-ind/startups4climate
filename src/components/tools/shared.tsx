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
        minHeight: 56,
        paddingTop: '0.75rem',
        paddingBottom: 'max(0.75rem, env(safe-area-inset-bottom))',
        paddingLeft: '1.5rem',
        paddingRight: '1.5rem',
        background: 'rgba(10,10,10,0.92)',
        backdropFilter: 'blur(16px)',
        WebkitBackdropFilter: 'blur(16px)',
        borderTop: '1px solid rgba(255,255,255,0.07)',
        borderRadius: 0,
        margin: '0 -1.5rem',
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

/* ─── ToolProgress: inline completion indicator ─── */

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

/* ─── Shared input/textarea styles ─── */

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
  boxSizing: 'border-box',
}

export const textareaStyle: React.CSSProperties = {
  ...inputStyle,
  minHeight: 100,
  resize: 'vertical',
}

export const labelStyle: React.CSSProperties = {
  display: 'block',
  fontFamily: 'var(--font-body)',
  fontSize: '0.5625rem',
  fontWeight: 700,
  letterSpacing: '0.09em',
  textTransform: 'uppercase',
  color: 'rgba(255,255,255,0.45)',
  marginBottom: '0.375rem',
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
