'use client'

import React, { Component, type ReactNode, type ErrorInfo } from 'react'

interface Props {
  children: ReactNode
  fallback?: ReactNode
}

interface State {
  hasError: boolean
  error: Error | null
}

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props)
    this.state = { hasError: false, error: null }
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error }
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    console.error('ErrorBoundary caught:', error, info.componentStack)
  }

  handleRetry = () => {
    this.setState({ hasError: false, error: null })
  }

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) return this.props.fallback

      return (
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          minHeight: '60vh',
          padding: '2rem',
        }}>
          <div style={{
            background: 'var(--color-bg-card)',
            border: '1px solid var(--color-border)',
            borderRadius: 'var(--radius-md)',
            padding: '2.5rem 2rem',
            maxWidth: 440,
            width: '100%',
            textAlign: 'center',
            boxShadow: 'var(--shadow-card)',
          }}>
            <div style={{
              width: 48,
              height: 48,
              borderRadius: '50%',
              background: '#FEF2F2',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 1rem',
              fontSize: '1.25rem',
            }}>
              ⚠
            </div>

            <h2 style={{
              fontFamily: 'var(--font-heading)',
              fontWeight: 700,
              fontSize: '1.125rem',
              color: 'var(--color-text-primary)',
              marginBottom: '0.5rem',
            }}>
              Algo salió mal
            </h2>

            <p style={{
              fontFamily: 'var(--font-body)',
              fontSize: '0.875rem',
              color: 'var(--color-text-secondary)',
              lineHeight: 1.6,
              marginBottom: '1.5rem',
            }}>
              Ocurrió un error inesperado. Puedes intentar de nuevo o recargar la página.
            </p>

            {this.state.error && (
              <details style={{
                textAlign: 'left',
                marginBottom: '1.5rem',
                padding: '0.75rem',
                borderRadius: 'var(--radius-sm)',
                background: 'var(--color-bg-muted)',
                fontSize: '0.75rem',
                fontFamily: 'monospace',
                color: 'var(--color-text-muted)',
              }}>
                <summary style={{ cursor: 'pointer', marginBottom: '0.5rem' }}>
                  Detalles del error
                </summary>
                {this.state.error.message}
              </details>
            )}

            <button
              onClick={this.handleRetry}
              style={{
                padding: '0.625rem 1.5rem',
                borderRadius: 'var(--radius-sm)',
                background: 'var(--color-accent-primary)',
                color: '#fff',
                border: 'none',
                cursor: 'pointer',
                fontFamily: 'var(--font-body)',
                fontSize: '0.875rem',
                fontWeight: 600,
              }}
            >
              Reintentar
            </button>
          </div>
        </div>
      )
    }

    return this.props.children
  }
}
