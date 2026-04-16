'use client'

import React, { useState } from 'react'
import { ChevronDown, Save, CheckCircle2, FileText, Lightbulb, BookOpen } from 'lucide-react'

/* ─── ToolSection: numbered, collapsible section with optional insight ─── */

export interface ToolSectionProps {
  number: number
  title: string
  subtitle?: string
  insight?: string          // Academic or strategic insight shown as inline tip
  insightSource?: string    // e.g. "MIT Disciplined Entrepreneurship"
  defaultOpen?: boolean
  accentColor?: string
  children: React.ReactNode
}

export function ToolSection({
  number,
  title,
  subtitle,
  insight,
  insightSource,
  defaultOpen = false,
  accentColor = 'var(--color-accent-primary)',
  children,
}: ToolSectionProps) {
  const [open, setOpen] = useState(defaultOpen)

  return (
    <div style={{
      background: 'var(--color-bg-card)',
      borderRadius: 16,
      border: '1px solid var(--color-border)',
      overflow: 'hidden',
      boxShadow: 'var(--shadow-card)',
    }}>
      <button
        onClick={() => setOpen(!open)}
        style={{
          width: '100%',
          display: 'flex',
          alignItems: 'center',
          gap: '1rem',
          padding: '1.125rem 1.5rem',
          background: 'none',
          border: 'none',
          cursor: 'pointer',
          textAlign: 'left',
        }}
      >
        {/* Step number badge */}
        <div style={{
          width: 36,
          height: 36,
          borderRadius: 10,
          background: `${accentColor}10`,
          border: `1px solid ${accentColor}22`,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          flexShrink: 0,
        }}>
          <span style={{
            fontFamily: 'var(--font-heading)',
            fontSize: '0.8125rem',
            fontWeight: 700,
            color: accentColor,
          }}>
            {number.toString().padStart(2, '0')}
          </span>
        </div>

        <div style={{ flex: 1, minWidth: 0 }}>
          <span style={{
            fontFamily: 'var(--font-heading)',
            fontSize: '0.9375rem',
            fontWeight: 700,
            color: 'var(--color-text-primary)',
            display: 'block',
          }}>
            {title}
          </span>
          {subtitle && (
            <span style={{
              fontFamily: 'var(--font-body)',
              fontSize: '0.75rem',
              color: 'var(--color-text-muted)',
              display: 'block',
              marginTop: '0.125rem',
            }}>
              {subtitle}
            </span>
          )}
        </div>

        <ChevronDown
          size={18}
          color="var(--color-text-muted)"
          style={{
            transition: 'transform 0.2s',
            transform: open ? 'rotate(180deg)' : 'rotate(0)',
            flexShrink: 0,
          }}
        />
      </button>

      {open && (
        <div style={{ padding: '0 1.5rem 1.5rem' }}>
          {/* Insight panel (inline academic reference) */}
          {insight && (
            <div style={{
              display: 'flex',
              gap: '0.75rem',
              padding: '0.875rem 1rem',
              borderRadius: 10,
              background: `${accentColor}06`,
              border: `1px solid ${accentColor}15`,
              marginBottom: '1.125rem',
            }}>
              <Lightbulb size={16} color={accentColor} style={{ flexShrink: 0, marginTop: 2 }} />
              <div>
                <p style={{
                  fontFamily: 'var(--font-body)',
                  fontSize: '0.8125rem',
                  lineHeight: 1.6,
                  color: 'var(--color-text-secondary)',
                  margin: 0,
                }}>
                  {insight}
                </p>
                {insightSource && (
                  <span style={{
                    fontFamily: 'var(--font-body)',
                    fontSize: '0.6875rem',
                    color: 'var(--color-text-muted)',
                    fontStyle: 'italic',
                    marginTop: '0.25rem',
                    display: 'block',
                  }}>
                    — {insightSource}
                  </span>
                )}
              </div>
            </div>
          )}
          {children}
        </div>
      )}
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
      background: `${accentColor}06`,
      borderTop: `1px solid ${accentColor}15`,
      borderRight: `1px solid ${accentColor}15`,
      borderBottom: `1px solid ${accentColor}15`,
      borderLeft: `3px solid ${accentColor}`,
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

export function ToolActionBar({ onSave, onComplete, onReport, saved = false, accentColor = '#0D9488' }: ToolActionBarProps) {
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
