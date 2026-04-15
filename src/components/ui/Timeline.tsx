'use client'

import React from 'react'
import { Check, type LucideIcon } from 'lucide-react'

export interface TimelineItem {
  title: string
  description?: string
  date?: string
  status?: 'completed' | 'current' | 'upcoming'
  icon?: LucideIcon
}

export interface TimelineProps {
  items: TimelineItem[]
}

const Timeline: React.FC<TimelineProps> = ({ items }) => {
  return (
    <>
      <style>{`
        @keyframes s4c-timeline-pulse {
          0%, 100% { box-shadow: 0 0 0 0 rgba(255, 107, 74, 0.45); }
          50% { box-shadow: 0 0 0 6px rgba(255, 107, 74, 0); }
        }
      `}</style>
      <ol
        style={{
          listStyle: 'none',
          padding: 0,
          margin: 0,
          position: 'relative',
          paddingLeft: 0,
        }}
      >
        {items.map((item, idx) => {
          const status = item.status ?? 'upcoming'
          const isLast = idx === items.length - 1
          const CustomIcon = item.icon

          let markerBg = 'var(--color-bg-card)'
          let markerBorder = '2px solid var(--color-border-strong)'
          let markerColor = 'var(--color-ink)'
          let extraAnimation: React.CSSProperties = {}

          if (status === 'completed') {
            markerBg = 'var(--color-ink)'
            markerBorder = '2px solid var(--color-ink)'
            markerColor = 'var(--color-paper)'
          } else if (status === 'current') {
            markerBg = 'var(--color-accent-primary)'
            markerBorder = '2px solid var(--color-accent-primary)'
            markerColor = 'var(--color-paper)'
            extraAnimation = { animation: 's4c-timeline-pulse 1.8s ease-out infinite' }
          } else {
            markerBg = 'var(--color-bg-card)'
            markerBorder = '2px solid var(--color-border)'
            markerColor = 'var(--color-text-muted)'
          }

          const titleColor = status === 'upcoming' ? 'var(--color-text-secondary)' : 'var(--color-ink)'

          return (
            <li
              key={`${item.title}-${idx}`}
              style={{
                position: 'relative',
                paddingLeft: 'var(--space-8)',
                paddingBottom: isLast ? 0 : 'var(--space-6)',
              }}
            >
              {!isLast && (
                <span
                  aria-hidden
                  style={{
                    position: 'absolute',
                    left: 11,
                    top: 24,
                    bottom: 0,
                    width: 2,
                    backgroundColor: 'var(--color-border)',
                  }}
                />
              )}
              <span
                aria-hidden
                style={{
                  position: 'absolute',
                  left: 0,
                  top: 0,
                  width: 24,
                  height: 24,
                  borderRadius: '50%',
                  background: markerBg,
                  border: markerBorder,
                  color: markerColor,
                  display: 'inline-flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  ...extraAnimation,
                }}
              >
                {status === 'completed' && !CustomIcon && <Check size={12} strokeWidth={3} />}
                {CustomIcon && <CustomIcon size={12} strokeWidth={2.5} />}
              </span>
              <div
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  gap: 2,
                }}
              >
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'baseline',
                    justifyContent: 'space-between',
                    gap: 'var(--space-3)',
                    flexWrap: 'wrap',
                  }}
                >
                  <span
                    style={{
                      fontFamily: 'var(--font-heading)',
                      fontSize: 'var(--text-base)',
                      fontWeight: 'var(--fw-semibold)' as unknown as number,
                      color: titleColor,
                      letterSpacing: '-0.01em',
                      lineHeight: 1.3,
                    }}
                  >
                    {item.title}
                  </span>
                  {item.date && (
                    <span
                      style={{
                        fontSize: 'var(--text-2xs)',
                        color: 'var(--color-text-muted)',
                        letterSpacing: '0.04em',
                        textTransform: 'uppercase',
                        fontWeight: 'var(--fw-medium)' as unknown as number,
                        flexShrink: 0,
                      }}
                    >
                      {item.date}
                    </span>
                  )}
                </div>
                {item.description && (
                  <p
                    style={{
                      fontSize: 'var(--text-sm)',
                      color: 'var(--color-text-secondary)',
                      lineHeight: 1.5,
                      margin: 0,
                      marginTop: 2,
                    }}
                  >
                    {item.description}
                  </p>
                )}
              </div>
            </li>
          )
        })}
      </ol>
    </>
  )
}

export default Timeline
