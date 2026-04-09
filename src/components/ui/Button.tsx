'use client'

import React, { forwardRef, type ButtonHTMLAttributes, type ReactNode } from 'react'

type ButtonVariant = 'primary' | 'secondary' | 'ghost' | 'danger' | 'success'
type ButtonSize = 'sm' | 'md' | 'lg'

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant
  size?: ButtonSize
  loading?: boolean
  icon?: ReactNode
  iconPosition?: 'left' | 'right'
  fullWidth?: boolean
}

const variantStyles: Record<ButtonVariant, React.CSSProperties> = {
  primary: {
    backgroundColor: 'var(--color-accent-primary)',
    color: '#FFFFFF',
    border: 'none',
  },
  secondary: {
    backgroundColor: 'transparent',
    color: 'var(--color-ink)',
    border: '1.5px solid var(--color-border-strong)',
  },
  ghost: {
    backgroundColor: 'transparent',
    color: 'var(--color-text-secondary)',
    border: '1.5px solid var(--color-border)',
  },
  danger: {
    backgroundColor: 'var(--color-danger)',
    color: '#FFFFFF',
    border: 'none',
  },
  success: {
    backgroundColor: 'var(--color-success)',
    color: '#FFFFFF',
    border: 'none',
  },
}

const variantHoverStyles: Record<ButtonVariant, React.CSSProperties> = {
  primary: { backgroundColor: 'var(--color-accent-hover)' },
  secondary: { backgroundColor: 'var(--color-cream)' },
  ghost: { backgroundColor: 'var(--color-cream)' },
  danger: { backgroundColor: '#B91C1C' },
  success: { backgroundColor: '#0F766E' },
}

const sizeStyles: Record<ButtonSize, React.CSSProperties> = {
  sm: {
    padding: '0.4rem 0.9rem',
    fontSize: 'var(--text-sm)',
    borderRadius: 'var(--radius-xs)',
    gap: '0.35rem',
  },
  md: {
    padding: '0.55rem 1.2rem',
    fontSize: 'var(--text-base)',
    borderRadius: 'var(--radius-sm)',
    gap: '0.45rem',
  },
  lg: {
    padding: '0.75rem 1.6rem',
    fontSize: 'var(--text-md)',
    borderRadius: 'var(--radius-sm)',
    gap: '0.5rem',
  },
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      variant = 'primary',
      size = 'md',
      loading = false,
      icon,
      iconPosition = 'left',
      fullWidth = false,
      disabled,
      children,
      style,
      onMouseEnter,
      onMouseLeave,
      ...rest
    },
    ref
  ) => {
    const [hovered, setHovered] = React.useState(false)

    const isDisabled = disabled || loading

    const composedStyle: React.CSSProperties = {
      display: 'inline-flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontFamily: 'var(--font-body)',
      fontWeight: 'var(--fw-semibold)' as unknown as number,
      letterSpacing: '-0.01em',
      cursor: isDisabled ? 'not-allowed' : 'pointer',
      opacity: isDisabled ? 0.55 : 1,
      transition: 'all 0.2s var(--ease-smooth)',
      width: fullWidth ? '100%' : undefined,
      whiteSpace: 'nowrap',
      lineHeight: 1.4,
      ...variantStyles[variant],
      ...sizeStyles[size],
      ...(hovered && !isDisabled ? variantHoverStyles[variant] : {}),
      ...style,
    }

    return (
      <button
        ref={ref}
        disabled={isDisabled}
        style={composedStyle}
        onMouseEnter={(e) => {
          setHovered(true)
          onMouseEnter?.(e)
        }}
        onMouseLeave={(e) => {
          setHovered(false)
          onMouseLeave?.(e)
        }}
        {...rest}
      >
        {loading && (
          <span
            style={{
              width: size === 'sm' ? 14 : 16,
              height: size === 'sm' ? 14 : 16,
              border: '2px solid rgba(255,255,255,0.3)',
              borderTopColor: '#fff',
              borderRadius: '50%',
              animation: 'spin 0.6s linear infinite',
              flexShrink: 0,
            }}
          />
        )}
        {!loading && icon && iconPosition === 'left' && (
          <span style={{ display: 'flex', alignItems: 'center', flexShrink: 0 }}>{icon}</span>
        )}
        {children && <span>{children}</span>}
        {!loading && icon && iconPosition === 'right' && (
          <span style={{ display: 'flex', alignItems: 'center', flexShrink: 0 }}>{icon}</span>
        )}
      </button>
    )
  }
)

Button.displayName = 'Button'

export default Button
