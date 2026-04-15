'use client'

import React from 'react'
import { motion } from 'framer-motion'

export interface ProgressRingProps {
  value: number
  size?: number
  strokeWidth?: number
  color?: string
  trackColor?: string
  label?: string
  sublabel?: string
  showPercentage?: boolean
}

const ProgressRing: React.FC<ProgressRingProps> = ({
  value,
  size = 80,
  strokeWidth = 8,
  color = 'var(--color-accent-primary)',
  trackColor = 'var(--color-border)',
  label,
  sublabel,
  showPercentage = false,
}) => {
  const clamped = Math.max(0, Math.min(100, value))
  const radius = (size - strokeWidth) / 2
  const circumference = 2 * Math.PI * radius
  const offset = circumference - (clamped / 100) * circumference

  return (
    <div
      role="progressbar"
      aria-valuenow={clamped}
      aria-valuemin={0}
      aria-valuemax={100}
      style={{
        position: 'relative',
        width: size,
        height: size,
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <svg
        width={size}
        height={size}
        viewBox={`0 0 ${size} ${size}`}
        style={{ transform: 'rotate(-90deg)' }}
      >
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="transparent"
          stroke={trackColor}
          strokeWidth={strokeWidth}
        />
        <motion.circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="transparent"
          stroke={color}
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeDasharray={circumference}
          initial={{ strokeDashoffset: circumference }}
          animate={{ strokeDashoffset: offset }}
          transition={{ duration: 0.9, ease: [0.25, 1, 0.5, 1] }}
        />
      </svg>
      {(label || sublabel || showPercentage) && (
        <div
          style={{
            position: 'absolute',
            inset: 0,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            textAlign: 'center',
            padding: 4,
          }}
        >
          {showPercentage && !label && (
            <span
              style={{
                fontFamily: 'var(--font-display)',
                fontSize: Math.max(size * 0.22, 14),
                fontWeight: 'var(--fw-bold)' as unknown as number,
                color: 'var(--color-ink)',
                letterSpacing: '-0.03em',
                lineHeight: 1,
              }}
            >
              {Math.round(clamped)}%
            </span>
          )}
          {label && (
            <span
              style={{
                fontFamily: 'var(--font-display)',
                fontSize: Math.max(size * 0.2, 13),
                fontWeight: 'var(--fw-bold)' as unknown as number,
                color: 'var(--color-ink)',
                letterSpacing: '-0.02em',
                lineHeight: 1.1,
              }}
            >
              {label}
            </span>
          )}
          {sublabel && (
            <span
              style={{
                fontSize: Math.max(size * 0.09, 10),
                color: 'var(--color-text-muted)',
                marginTop: 2,
                lineHeight: 1.2,
              }}
            >
              {sublabel}
            </span>
          )}
        </div>
      )}
    </div>
  )
}

export default ProgressRing
