'use client'

import React, { forwardRef, type InputHTMLAttributes, type ReactNode } from 'react'

type InputSize = 'sm' | 'md' | 'lg'
type InputVariant = 'underline' | 'outlined' | 'filled'

interface InputProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'size'> {
  /** Visual style */
  variant?: InputVariant
  /** Size preset */
  inputSize?: InputSize
  /** Label text above the input */
  label?: string
  /** Helper text below the input */
  helperText?: string
  /** Error message (replaces helperText, triggers error styling) */
  error?: string
  /** Left icon/adornment */
  leftIcon?: ReactNode
  /** Right icon/adornment */
  rightIcon?: ReactNode
  /** Full width */
  fullWidth?: boolean
}

const sizeMap: Record<InputSize, { padding: string; fontSize: string; iconSize: number }> = {
  sm: { padding: '0.4rem 0.65rem', fontSize: 'var(--text-sm)', iconSize: 14 },
  md: { padding: '0.55rem 0.85rem', fontSize: 'var(--text-base)', iconSize: 16 },
  lg: { padding: '0.7rem 1rem', fontSize: 'var(--text-md)', iconSize: 18 },
}

const Input = forwardRef<HTMLInputElement, InputProps>(
  (
    {
      variant = 'outlined',
      inputSize = 'md',
      label,
      helperText,
      error,
      leftIcon,
      rightIcon,
      fullWidth = true,
      disabled,
      style,
      id,
      ...rest
    },
    ref
  ) => {
    const [focused, setFocused] = React.useState(false)
    const inputId = id || (label ? `input-${label.replace(/\s+/g, '-').toLowerCase()}` : undefined)

    const hasError = !!error
    const size = sizeMap[inputSize]

    const borderColor = hasError
      ? 'var(--color-danger)'
      : focused
      ? 'var(--color-input-focus)'
      : 'var(--color-border)'

    const getWrapperStyles = (): React.CSSProperties => {
      const base: React.CSSProperties = {
        display: 'flex',
        alignItems: 'center',
        gap: '0.5rem',
        transition: 'all 0.2s var(--ease-smooth)',
        width: fullWidth ? '100%' : undefined,
        opacity: disabled ? 0.55 : 1,
        cursor: disabled ? 'not-allowed' : undefined,
      }

      switch (variant) {
        case 'underline':
          return {
            ...base,
            borderBottom: `2px solid ${borderColor}`,
            padding: `${size.padding.split(' ')[0]} 0`,
            background: 'transparent',
            borderRadius: 0,
          }
        case 'filled':
          return {
            ...base,
            background: 'var(--color-cream)',
            border: `1.5px solid ${hasError ? 'var(--color-danger)' : 'transparent'}`,
            borderRadius: 'var(--radius-sm)',
            padding: size.padding,
          }
        case 'outlined':
        default:
          return {
            ...base,
            background: 'var(--color-bg-card)',
            border: `1.5px solid ${borderColor}`,
            borderRadius: 'var(--radius-sm)',
            padding: size.padding,
          }
      }
    }

    const inputStyle: React.CSSProperties = {
      flex: 1,
      border: 'none',
      outline: 'none',
      background: 'transparent',
      fontSize: size.fontSize,
      fontFamily: 'var(--font-body)',
      color: 'var(--color-ink)',
      padding: 0,
      margin: 0,
      width: '100%',
      lineHeight: 1.5,
    }

    const iconStyle: React.CSSProperties = {
      display: 'flex',
      alignItems: 'center',
      color: hasError ? 'var(--color-danger)' : 'var(--color-text-muted)',
      flexShrink: 0,
    }

    return (
      <div style={{ width: fullWidth ? '100%' : undefined, ...style }}>
        {label && (
          <label
            htmlFor={inputId}
            style={{
              display: 'block',
              marginBottom: 'var(--space-1)',
              fontSize: 'var(--text-xs)',
              fontWeight: 'var(--fw-medium)' as unknown as number,
              color: hasError ? 'var(--color-danger)' : 'var(--color-text-secondary)',
              letterSpacing: '-0.01em',
            }}
          >
            {label}
          </label>
        )}
        <div style={getWrapperStyles()}>
          {leftIcon && <span style={iconStyle}>{leftIcon}</span>}
          <input
            ref={ref}
            id={inputId}
            disabled={disabled}
            onFocus={(e) => {
              setFocused(true)
              rest.onFocus?.(e)
            }}
            onBlur={(e) => {
              setFocused(false)
              rest.onBlur?.(e)
            }}
            style={inputStyle}
            {...rest}
          />
          {rightIcon && <span style={iconStyle}>{rightIcon}</span>}
        </div>
        {(error || helperText) && (
          <p
            style={{
              marginTop: 'var(--space-1)',
              fontSize: 'var(--text-2xs)',
              color: hasError ? 'var(--color-danger)' : 'var(--color-text-muted)',
              lineHeight: 1.4,
            }}
          >
            {error || helperText}
          </p>
        )}
      </div>
    )
  }
)

Input.displayName = 'Input'

export default Input
