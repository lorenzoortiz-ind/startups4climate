'use client'

import React from 'react'
import { X, type LucideIcon } from 'lucide-react'

type ChipVariant =
  | 'default'
  | 'primary'
  | 'success'
  | 'warning'
  | 'info'
  | 'stage-1'
  | 'stage-2'
  | 'stage-3'
  | 'stage-4'

type ChipSize = 'xs' | 'sm' | 'md'

export interface ChipProps {
  children: React.ReactNode
  variant?: ChipVariant
  size?: ChipSize
  icon?: LucideIcon
  onClick?: () => void
  removable?: boolean
  onRemove?: () => void
}

const variantColors: Record<ChipVariant, { bg: string; color: string; border: string }> = {
  default: {
    bg: 'var(--color-cream)',
    color: 'var(--color-text-secondary)',
    border: 'var(--color-border)',
  },
  primary: {
    bg: 'var(--color-accent-light)',
    color: 'var(--color-accent-primary)',
    border: 'rgba(255, 107, 74, 0.25)',
  },
  success: {
    bg: 'var(--color-success-light)',
    color: 'var(--color-success)',
    border: 'var(--color-success-border)',
  },
  warning: {
    bg: 'var(--color-warning-light)',
    color: 'var(--color-warning)',
    border: 'var(--color-warning-border)',
  },
  info: {
    bg: 'var(--color-info-light)',
    color: 'var(--color-info)',
    border: 'var(--color-info-border)',
  },
  'stage-1': {
    bg: 'rgba(255, 107, 74, 0.08)',
    color: 'var(--color-stage-1)',
    border: 'rgba(255, 107, 74, 0.25)',
  },
  'stage-2': {
    bg: 'rgba(13, 148, 136, 0.08)',
    color: 'var(--color-stage-2)',
    border: 'rgba(13, 148, 136, 0.25)',
  },
  'stage-3': {
    bg: 'rgba(217, 119, 6, 0.08)',
    color: 'var(--color-stage-3)',
    border: 'rgba(217, 119, 6, 0.25)',
  },
  'stage-4': {
    bg: 'rgba(59, 130, 246, 0.08)',
    color: 'var(--color-stage-4)',
    border: 'rgba(59, 130, 246, 0.25)',
  },
}

const sizeMap: Record<ChipSize, { padding: string; fontSize: string; iconSize: number; gap: number }> = {
  xs: { padding: '2px 8px', fontSize: 'var(--text-2xs)', iconSize: 10, gap: 4 },
  sm: { padding: '3px 10px', fontSize: 'var(--text-xs)', iconSize: 12, gap: 5 },
  md: { padding: '5px 12px', fontSize: 'var(--text-sm)', iconSize: 14, gap: 6 },
}

const Chip: React.FC<ChipProps> = ({
  children,
  variant = 'default',
  size = 'sm',
  icon: Icon,
  onClick,
  removable = false,
  onRemove,
}) => {
  const [hovered, setHovered] = React.useState(false)
  const c = variantColors[variant]
  const s = sizeMap[size]

  const clickable = typeof onClick === 'function'

  return (
    <span
      onClick={clickable ? onClick : undefined}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      role={clickable ? 'button' : undefined}
      tabIndex={clickable ? 0 : undefined}
      onKeyDown={
        clickable
          ? (e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault()
                onClick?.()
              }
            }
          : undefined
      }
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: s.gap,
        backgroundColor: c.bg,
        color: c.color,
        border: `1px solid ${c.border}`,
        borderRadius: 'var(--radius-full)',
        padding: s.padding,
        fontSize: s.fontSize,
        fontWeight: 'var(--fw-semibold)' as unknown as number,
        letterSpacing: '-0.005em',
        lineHeight: 1.3,
        cursor: clickable ? 'pointer' : 'default',
        userSelect: 'none',
        transition: 'all 0.15s var(--ease-smooth)',
        transform: clickable && hovered ? 'translateY(-1px)' : undefined,
        boxShadow: clickable && hovered ? 'var(--shadow-card)' : 'none',
        whiteSpace: 'nowrap',
      }}
    >
      {Icon && <Icon size={s.iconSize} strokeWidth={2.25} />}
      <span>{children}</span>
      {removable && (
        <button
          type="button"
          aria-label="Quitar"
          onClick={(e) => {
            e.stopPropagation()
            onRemove?.()
          }}
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            background: 'transparent',
            border: 'none',
            padding: 0,
            marginLeft: 2,
            cursor: 'pointer',
            color: 'inherit',
            opacity: 0.7,
            borderRadius: 'var(--radius-full)',
          }}
        >
          <X size={s.iconSize} strokeWidth={2.5} />
        </button>
      )}
    </span>
  )
}

export default Chip
