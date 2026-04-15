'use client'

import React from 'react'

export interface SectionHeaderProps {
  kicker?: string
  title: string
  description?: string
  action?: React.ReactNode
  align?: 'left' | 'center'
}

const SectionHeader: React.FC<SectionHeaderProps> = ({
  kicker,
  title,
  description,
  action,
  align = 'left',
}) => {
  const isCenter = align === 'center'

  return (
    <div
      style={{
        display: 'flex',
        alignItems: isCenter ? 'center' : 'flex-end',
        justifyContent: 'space-between',
        gap: 'var(--space-6)',
        flexWrap: 'wrap',
        textAlign: isCenter ? 'center' : 'left',
      }}
    >
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          gap: 'var(--space-2)',
          alignItems: isCenter ? 'center' : 'flex-start',
          flex: 1,
          minWidth: 0,
        }}
      >
        {kicker && (
          <span
            style={{
              fontSize: 'var(--text-2xs)',
              fontWeight: 'var(--fw-bold)' as unknown as number,
              textTransform: 'uppercase',
              letterSpacing: '0.14em',
              color: 'var(--color-accent-primary)',
              lineHeight: 1.2,
            }}
          >
            {kicker}
          </span>
        )}
        <h2
          style={{
            fontFamily: 'var(--font-heading)',
            fontSize: 'var(--text-2xl)',
            fontWeight: 'var(--fw-bold)' as unknown as number,
            letterSpacing: '-0.03em',
            lineHeight: 1.15,
            color: 'var(--color-ink)',
            margin: 0,
          }}
        >
          {title}
        </h2>
        {description && (
          <p
            style={{
              fontSize: 'var(--text-md)',
              color: 'var(--color-text-secondary)',
              lineHeight: 1.5,
              margin: 0,
              maxWidth: '64ch',
            }}
          >
            {description}
          </p>
        )}
      </div>
      {action && !isCenter && <div style={{ flexShrink: 0 }}>{action}</div>}
      {action && isCenter && <div style={{ width: '100%', display: 'flex', justifyContent: 'center' }}>{action}</div>}
    </div>
  )
}

export default SectionHeader
