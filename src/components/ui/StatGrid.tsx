'use client'

import React from 'react'
import { TrendingUp, TrendingDown, Minus, type LucideIcon } from 'lucide-react'

export interface Stat {
  label: string
  value: string | number
  icon?: LucideIcon
  trend?: { direction: 'up' | 'down' | 'flat'; value?: number }
}

export interface StatGridProps {
  stats: Stat[]
  columns?: 2 | 3 | 4
}

const trendDirectionColor = (direction: 'up' | 'down' | 'flat'): string => {
  if (direction === 'up') return 'var(--color-success)'
  if (direction === 'down') return 'var(--color-danger)'
  return 'var(--color-text-muted)'
}

const StatGrid: React.FC<StatGridProps> = ({ stats, columns }) => {
  const gridTemplate = columns
    ? `repeat(${columns}, minmax(0, 1fr))`
    : 'repeat(auto-fit, minmax(180px, 1fr))'

  return (
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: gridTemplate,
        gap: 0,
        border: '1px solid var(--color-border)',
        borderRadius: 'var(--radius-card)',
        backgroundColor: 'var(--color-bg-card)',
        overflow: 'hidden',
      }}
    >
      {stats.map((stat, idx) => {
        const Icon = stat.icon
        const TrendIcon = stat.trend
          ? stat.trend.direction === 'up'
            ? TrendingUp
            : stat.trend.direction === 'down'
            ? TrendingDown
            : Minus
          : null
        const trendColor = stat.trend ? trendDirectionColor(stat.trend.direction) : undefined

        return (
          <div
            key={`${stat.label}-${idx}`}
            style={{
              padding: 'var(--space-4) var(--space-5)',
              borderRight: '1px solid var(--color-border)',
              borderBottom: '1px solid var(--color-border)',
              display: 'flex',
              flexDirection: 'column',
              gap: 'var(--space-2)',
              minWidth: 0,
            }}
          >
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 'var(--space-2)',
                color: 'var(--color-text-secondary)',
              }}
            >
              {Icon && <Icon size={14} strokeWidth={2} />}
              <span
                style={{
                  fontSize: 'var(--text-2xs)',
                  letterSpacing: '0.08em',
                  textTransform: 'uppercase',
                  fontWeight: 'var(--fw-semibold)' as unknown as number,
                }}
              >
                {stat.label}
              </span>
            </div>
            <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', gap: 'var(--space-2)' }}>
              <span
                style={{
                  fontFamily: 'var(--font-display)',
                  fontSize: '1.5rem',
                  fontWeight: 'var(--fw-bold)' as unknown as number,
                  letterSpacing: '-0.02em',
                  color: 'var(--color-ink)',
                  lineHeight: 1.1,
                }}
              >
                {stat.value}
              </span>
              {stat.trend && TrendIcon && (
                <span
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: 2,
                    fontSize: 'var(--text-2xs)',
                    color: trendColor,
                    fontWeight: 'var(--fw-semibold)' as unknown as number,
                  }}
                  aria-label={`Trend ${stat.trend.direction}`}
                >
                  <TrendIcon size={12} strokeWidth={2.5} />
                  {stat.trend.value !== undefined && <span>{stat.trend.value}%</span>}
                </span>
              )}
            </div>
          </div>
        )
      })}
    </div>
  )
}

export default StatGrid
