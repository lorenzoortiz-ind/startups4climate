'use client'

import React, { useState } from 'react'
import {
  Sparkles,
  AlertTriangle,
  CheckCircle,
  Info,
  Lightbulb,
  ChevronDown,
  type LucideIcon,
} from 'lucide-react'

type InsightVariant = 'insight' | 'warning' | 'success' | 'info' | 'tip'

export interface InsightBoxProps {
  variant?: InsightVariant
  title: string
  children: React.ReactNode
  icon?: LucideIcon
  collapsible?: boolean
  defaultOpen?: boolean
}

const variantConfig: Record<
  InsightVariant,
  { icon: LucideIcon; color: string; bg: string; border: string }
> = {
  insight: {
    icon: Sparkles,
    color: 'var(--color-purple)',
    bg: 'rgba(139, 92, 246, 0.06)',
    border: 'var(--color-purple)',
  },
  warning: {
    icon: AlertTriangle,
    color: 'var(--color-warning)',
    bg: 'var(--color-warning-light)',
    border: 'var(--color-warning)',
  },
  success: {
    icon: CheckCircle,
    color: 'var(--color-success)',
    bg: 'var(--color-success-light)',
    border: 'var(--color-success)',
  },
  info: {
    icon: Info,
    color: 'var(--color-info)',
    bg: 'var(--color-info-light)',
    border: 'var(--color-info)',
  },
  tip: {
    icon: Lightbulb,
    color: 'var(--color-accent-primary)',
    bg: 'var(--color-accent-light)',
    border: 'var(--color-accent-primary)',
  },
}

const InsightBox: React.FC<InsightBoxProps> = ({
  variant = 'insight',
  title,
  children,
  icon,
  collapsible = false,
  defaultOpen = true,
}) => {
  const [open, setOpen] = useState(defaultOpen)
  const cfg = variantConfig[variant]
  const Icon = icon ?? cfg.icon

  return (
    <div
      style={{
        backgroundColor: cfg.bg,
        borderLeft: `3px solid ${cfg.border}`,
        borderRadius: 'var(--radius-sm)',
        padding: 'var(--space-4) var(--space-5)',
        display: 'flex',
        gap: 'var(--space-4)',
        alignItems: 'flex-start',
      }}
    >
      <span
        aria-hidden
        style={{
          color: cfg.color,
          flexShrink: 0,
          marginTop: 2,
          display: 'inline-flex',
        }}
      >
        <Icon size={22} strokeWidth={2} />
      </span>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div
          onClick={collapsible ? () => setOpen((o) => !o) : undefined}
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: 'var(--space-3)',
            cursor: collapsible ? 'pointer' : 'default',
            userSelect: collapsible ? 'none' : 'auto',
          }}
          role={collapsible ? 'button' : undefined}
          aria-expanded={collapsible ? open : undefined}
        >
          <h4
            style={{
              fontFamily: 'var(--font-heading)',
              fontSize: 'var(--text-base)',
              fontWeight: 'var(--fw-semibold)' as unknown as number,
              color: 'var(--color-ink)',
              margin: 0,
              letterSpacing: '-0.01em',
              lineHeight: 1.3,
            }}
          >
            {title}
          </h4>
          {collapsible && (
            <ChevronDown
              size={16}
              style={{
                color: 'var(--color-text-muted)',
                transition: 'transform 0.2s var(--ease-smooth)',
                transform: open ? 'rotate(180deg)' : 'rotate(0deg)',
                flexShrink: 0,
              }}
            />
          )}
        </div>
        {(!collapsible || open) && (
          <div
            style={{
              marginTop: 'var(--space-2)',
              fontSize: 'var(--text-sm)',
              color: 'var(--color-text-secondary)',
              lineHeight: 1.55,
            }}
          >
            {children}
          </div>
        )}
      </div>
    </div>
  )
}

export default InsightBox
