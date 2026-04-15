'use client'

import React from 'react'
import { motion } from 'framer-motion'

export interface Bar {
  label: string
  value: number
  color?: string
}

export interface BarChartProps {
  bars: Bar[]
  maxValue?: number
  showValues?: boolean
  unit?: string
  height?: number
}

const BarChart: React.FC<BarChartProps> = ({
  bars,
  maxValue,
  showValues = true,
  unit = '',
  height = 24,
}) => {
  const computedMax = maxValue ?? Math.max(...bars.map((b) => b.value), 1)

  return (
    <div
      role="group"
      aria-label="Bar chart"
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: 'var(--space-3)',
        width: '100%',
      }}
    >
      {bars.map((bar, idx) => {
        const pct = computedMax > 0 ? Math.max(0, Math.min(100, (bar.value / computedMax) * 100)) : 0
        const color = bar.color ?? 'var(--color-accent-primary)'

        return (
          <div
            key={`${bar.label}-${idx}`}
            style={{
              display: 'grid',
              gridTemplateColumns: 'minmax(80px, 120px) 1fr auto',
              alignItems: 'center',
              gap: 'var(--space-3)',
            }}
          >
            <span
              style={{
                fontSize: 'var(--text-xs)',
                color: 'var(--color-text-secondary)',
                fontWeight: 'var(--fw-medium)' as unknown as number,
                whiteSpace: 'nowrap',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
              }}
            >
              {bar.label}
            </span>
            <div
              style={{
                width: '100%',
                height,
                backgroundColor: 'var(--color-cream)',
                borderRadius: 'var(--radius-xs)',
                overflow: 'hidden',
                position: 'relative',
              }}
              aria-label={`${bar.label}: ${bar.value}${unit}`}
            >
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${pct}%` }}
                transition={{ duration: 0.7, ease: [0.25, 1, 0.5, 1], delay: idx * 0.05 }}
                style={{
                  height: '100%',
                  backgroundColor: color,
                  borderRadius: 'var(--radius-xs)',
                }}
              />
            </div>
            {showValues && (
              <span
                style={{
                  fontFamily: 'var(--font-display)',
                  fontSize: 'var(--text-sm)',
                  fontWeight: 'var(--fw-semibold)' as unknown as number,
                  color: 'var(--color-ink)',
                  letterSpacing: '-0.01em',
                  minWidth: 40,
                  textAlign: 'right',
                }}
              >
                {bar.value}
                {unit}
              </span>
            )}
          </div>
        )
      })}
    </div>
  )
}

export default BarChart
