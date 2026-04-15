'use client'

import React from 'react'
import { motion } from 'framer-motion'
import { TrendingUp, TrendingDown, Minus, type LucideIcon } from 'lucide-react'

type MetricAccent = 'primary' | 'success' | 'warning' | 'info' | 'neutral'
type MetricSize = 'sm' | 'md' | 'lg'

export interface MetricCardProps {
  label: string
  value: string | number
  unit?: string
  icon?: LucideIcon
  trend?: { value: number; label?: string; direction: 'up' | 'down' | 'flat' }
  accent?: MetricAccent
  size?: MetricSize
  description?: string
}

const accentColorMap: Record<MetricAccent, string> = {
  primary: 'var(--color-accent-primary)',
  success: 'var(--color-success)',
  warning: 'var(--color-warning)',
  info: 'var(--color-info)',
  neutral: 'var(--color-text-secondary)',
}

const accentBgMap: Record<MetricAccent, string> = {
  primary: 'var(--color-accent-light)',
  success: 'var(--color-success-light)',
  warning: 'var(--color-warning-light)',
  info: 'var(--color-info-light)',
  neutral: 'var(--color-cream)',
}

const sizeMap: Record<MetricSize, { valueSize: string; labelSize: string; padding: string; iconBox: number; iconSize: number }> = {
  sm: {
    valueSize: '1.75rem',
    labelSize: 'var(--text-2xs)',
    padding: 'var(--space-4) var(--space-5)',
    iconBox: 32,
    iconSize: 16,
  },
  md: {
    valueSize: '2.25rem',
    labelSize: 'var(--text-xs)',
    padding: 'var(--space-5) var(--space-6)',
    iconBox: 40,
    iconSize: 20,
  },
  lg: {
    valueSize: '3rem',
    labelSize: 'var(--text-xs)',
    padding: 'var(--space-6) var(--space-8)',
    iconBox: 48,
    iconSize: 24,
  },
}

const trendDirectionColor = (direction: 'up' | 'down' | 'flat'): string => {
  if (direction === 'up') return 'var(--color-success)'
  if (direction === 'down') return 'var(--color-danger)'
  return 'var(--color-text-muted)'
}

const MetricCard: React.FC<MetricCardProps> = ({
  label,
  value,
  unit,
  icon: Icon,
  trend,
  accent = 'primary',
  size = 'md',
  description,
}) => {
  const s = sizeMap[size]
  const accentColor = accentColorMap[accent]
  const accentBg = accentBgMap[accent]

  const TrendIcon =
    trend?.direction === 'up' ? TrendingUp : trend?.direction === 'down' ? TrendingDown : Minus
  const trendColor = trend ? trendDirectionColor(trend.direction) : 'var(--color-text-muted)'

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, ease: [0.25, 1, 0.5, 1] }}
      style={{
        backgroundColor: 'var(--color-bg-card)',
        border: '1px solid var(--color-border)',
        borderRadius: 'var(--radius-card)',
        boxShadow: 'var(--shadow-card)',
        padding: s.padding,
        display: 'flex',
        flexDirection: 'column',
        gap: 'var(--space-3)',
      }}
    >
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: 'var(--space-3)',
        }}
      >
        <span
          style={{
            fontSize: s.labelSize,
            fontWeight: 'var(--fw-semibold)' as unknown as number,
            letterSpacing: '0.08em',
            textTransform: 'uppercase',
            color: 'var(--color-text-secondary)',
          }}
        >
          {label}
        </span>
        {Icon && (
          <span
            aria-hidden
            style={{
              width: s.iconBox,
              height: s.iconBox,
              borderRadius: 'var(--radius-sm)',
              backgroundColor: accentBg,
              color: accentColor,
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0,
            }}
          >
            <Icon size={s.iconSize} strokeWidth={2} />
          </span>
        )}
      </div>

      <div style={{ display: 'flex', alignItems: 'baseline', gap: 'var(--space-2)' }}>
        <span
          style={{
            fontFamily: 'var(--font-display)',
            fontSize: s.valueSize,
            fontWeight: 'var(--fw-bold)' as unknown as number,
            lineHeight: 1.05,
            letterSpacing: '-0.03em',
            color: 'var(--color-ink)',
          }}
        >
          {value}
        </span>
        {unit && (
          <span
            style={{
              fontSize: 'var(--text-sm)',
              color: 'var(--color-text-muted)',
              fontWeight: 'var(--fw-medium)' as unknown as number,
            }}
          >
            {unit}
          </span>
        )}
      </div>

      {(trend || description) && (
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 'var(--space-2)',
            flexWrap: 'wrap',
          }}
        >
          {trend && (
            <span
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 4,
                fontSize: 'var(--text-xs)',
                fontWeight: 'var(--fw-semibold)' as unknown as number,
                color: trendColor,
              }}
              aria-label={`Trend ${trend.direction} ${trend.value}%`}
            >
              <TrendIcon size={14} strokeWidth={2.5} />
              {trend.value}%
              {trend.label && (
                <span
                  style={{
                    color: 'var(--color-text-muted)',
                    fontWeight: 'var(--fw-normal)' as unknown as number,
                    marginLeft: 4,
                  }}
                >
                  {trend.label}
                </span>
              )}
            </span>
          )}
          {description && (
            <span
              style={{
                fontSize: 'var(--text-xs)',
                color: 'var(--color-text-muted)',
                lineHeight: 1.4,
              }}
            >
              {description}
            </span>
          )}
        </div>
      )}
    </motion.div>
  )
}

export default MetricCard
