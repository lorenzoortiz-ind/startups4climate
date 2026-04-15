'use client'

import React from 'react'

type CalloutType = 'note' | 'tip' | 'caution' | 'important' | 'example'

export interface CalloutProps {
  type?: CalloutType
  title?: string
  children: React.ReactNode
}

const typeConfig: Record<CalloutType, { color: string; label: string }> = {
  note: { color: 'var(--color-text-secondary)', label: 'Nota' },
  tip: { color: 'var(--color-success)', label: 'Tip' },
  caution: { color: 'var(--color-warning)', label: 'Precaución' },
  important: { color: 'var(--color-accent-primary)', label: 'Importante' },
  example: { color: 'var(--color-info)', label: 'Ejemplo' },
}

const Callout: React.FC<CalloutProps> = ({ type = 'note', title, children }) => {
  const cfg = typeConfig[type]
  const displayTitle = title ?? cfg.label

  return (
    <div
      style={{
        borderLeft: `3px solid ${cfg.color}`,
        padding: 'var(--space-2) var(--space-4)',
        margin: 0,
      }}
    >
      <div
        style={{
          fontSize: 'var(--text-2xs)',
          textTransform: 'uppercase',
          letterSpacing: '0.1em',
          fontWeight: 'var(--fw-bold)' as unknown as number,
          color: cfg.color,
          marginBottom: 'var(--space-1)',
        }}
      >
        {displayTitle}
      </div>
      <div
        style={{
          fontSize: 'var(--text-sm)',
          color: 'var(--color-text-primary)',
          lineHeight: 1.55,
        }}
      >
        {children}
      </div>
    </div>
  )
}

export default Callout
