'use client'

import { useState, Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import { motion } from 'framer-motion'
import {
  ShieldCheck,
  Lock,
  CreditCard,
  CheckCircle2,
  ArrowLeft,
} from 'lucide-react'

/* ─── Options matching DiagnosticForm ─── */
const verticalOptions = [
  'Fintech',
  'Healthtech',
  'Edtech',
  'Agritech',
  'Cleantech / Climatech',
  'Biotech',
  'Deep Tech',
  'Proptech',
  'Legaltech',
  'Insurtech',
  'Mobility / Logistica',
  'E-commerce / Marketplace',
  'SaaS / Enterprise',
  'Social Impact',
  'Foodtech',
  'Otro',
]

const countryOptions = [
  'Argentina',
  'Bolivia',
  'Brasil',
  'Chile',
  'Colombia',
  'Costa Rica',
  'Cuba',
  'Ecuador',
  'El Salvador',
  'Guatemala',
  'Honduras',
  'Mexico',
  'Nicaragua',
  'Panama',
  'Paraguay',
  'Peru',
  'Republica Dominicana',
  'Uruguay',
  'Venezuela',
]

/* ─── Shared styles ─── */
const labelStyle: React.CSSProperties = {
  display: 'block',
  fontFamily: 'var(--font-body)',
  fontSize: '0.8125rem',
  fontWeight: 600,
  color: 'var(--color-text-primary, #111827)',
  marginBottom: '0.375rem',
}

const inputStyle: React.CSSProperties = {
  width: '100%',
  padding: '0.75rem 1rem',
  borderRadius: 10,
  border: '1px solid var(--color-border, #e5e7eb)',
  fontFamily: 'var(--font-body)',
  fontSize: '0.875rem',
  color: 'var(--color-text-primary, #111827)',
  background: 'var(--color-bg-card, #ffffff)',
  outline: 'none',
  transition: 'border-color 0.2s ease, box-shadow 0.2s ease',
  boxSizing: 'border-box' as const,
}

const selectStyle: React.CSSProperties = {
  ...inputStyle,
  appearance: 'none' as const,
  backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 12 12'%3E%3Cpath fill='%236B7280' d='M2 4l4 4 4-4'/%3E%3C/svg%3E")`,
  backgroundRepeat: 'no-repeat',
  backgroundPosition: 'right 1rem center',
  paddingRight: '2.5rem',
}

const sectionTitleStyle: React.CSSProperties = {
  fontFamily: 'var(--font-heading)',
  fontSize: '1rem',
  fontWeight: 700,
  color: 'var(--color-text-primary, #111827)',
  marginBottom: '1rem',
  paddingBottom: '0.625rem',
  borderBottom: '1px solid var(--color-border, #e5e7eb)',
}

function CheckoutContent() {
  const searchParams = useSearchParams()
  const productName = searchParams.get('product') || 'Producto Digital'
  const productPrice = searchParams.get('price') || '99'
  const priceNum = parseInt(productPrice, 10) || 99

  const [focusedField, setFocusedField] = useState<string | null>(null)

  const handleFocus = (field: string) => () => setFocusedField(field)
  const handleBlur = () => setFocusedField(null)

  const getFocusStyle = (field: string): React.CSSProperties =>
    focusedField === field
      ? { borderColor: '#059669', boxShadow: '0 0 0 3px rgba(5,150,105,0.1)' }
      : {}

  return (
    <div
      style={{
        minHeight: '100vh',
        background: '#F9FAFB',
      }}
    >
      {/* Top bar */}
      <div
        style={{
          background: '#ffffff',
          borderBottom: '1px solid #e5e7eb',
          padding: '0.875rem 1.5rem',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}
      >
        <a
          href="/"
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.375rem',
            fontFamily: 'var(--font-body)',
            fontSize: '0.8125rem',
            fontWeight: 500,
            color: 'var(--color-text-secondary, #6b7280)',
            textDecoration: 'none',
          }}
        >
          <ArrowLeft size={14} />
          Volver
        </a>
        <div
          style={{
            fontFamily: 'var(--font-heading)',
            fontSize: '1rem',
            fontWeight: 700,
            color: 'var(--color-text-primary, #111827)',
            letterSpacing: '-0.01em',
          }}
        >
          Startups4Climate
        </div>
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.375rem',
            fontFamily: 'var(--font-mono)',
            fontSize: '0.6875rem',
            color: '#059669',
            fontWeight: 600,
          }}
        >
          <Lock size={12} />
          Checkout seguro
        </div>
      </div>

      {/* Main content */}
      <div
        style={{
          maxWidth: 1080,
          margin: '0 auto',
          padding: '2.5rem 1.5rem 4rem',
          display: 'flex',
          gap: '2.5rem',
          alignItems: 'flex-start',
          flexWrap: 'wrap',
        }}
      >
        {/* LEFT COLUMN - Form */}
        <motion.div
          initial={{ opacity: 0, x: -16 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.4 }}
          style={{
            flex: '1 1 58%',
            minWidth: 320,
          }}
        >
          {/* Contact info */}
          <div
            style={{
              background: '#ffffff',
              borderRadius: 16,
              border: '1px solid #e5e7eb',
              padding: '1.75rem',
              marginBottom: '1.25rem',
              boxShadow: '0 1px 3px rgba(0,0,0,0.04)',
            }}
          >
            <h2 style={sectionTitleStyle}>Informacion de contacto</h2>
            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                gap: '0.875rem',
              }}
            >
              <div>
                <label style={labelStyle}>Nombre completo</label>
                <input
                  type="text"
                  placeholder="Tu nombre"
                  style={{ ...inputStyle, ...getFocusStyle('name') }}
                  onFocus={handleFocus('name')}
                  onBlur={handleBlur}
                />
              </div>
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                  gap: '0.875rem',
                }}
              >
                <div>
                  <label style={labelStyle}>Email</label>
                  <input
                    type="email"
                    placeholder="tu@email.com"
                    style={{ ...inputStyle, ...getFocusStyle('email') }}
                    onFocus={handleFocus('email')}
                    onBlur={handleBlur}
                  />
                </div>
                <div>
                  <label style={labelStyle}>Telefono</label>
                  <input
                    type="tel"
                    placeholder="+51 999 999 999"
                    style={{ ...inputStyle, ...getFocusStyle('phone') }}
                    onFocus={handleFocus('phone')}
                    onBlur={handleBlur}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Startup info */}
          <div
            style={{
              background: '#ffffff',
              borderRadius: 16,
              border: '1px solid #e5e7eb',
              padding: '1.75rem',
              marginBottom: '1.25rem',
              boxShadow: '0 1px 3px rgba(0,0,0,0.04)',
            }}
          >
            <h2 style={sectionTitleStyle}>Informacion de tu startup</h2>
            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                gap: '0.875rem',
              }}
            >
              <div>
                <label style={labelStyle}>Nombre de la startup</label>
                <input
                  type="text"
                  placeholder="Mi Startup"
                  style={{ ...inputStyle, ...getFocusStyle('startup') }}
                  onFocus={handleFocus('startup')}
                  onBlur={handleBlur}
                />
              </div>
              <div>
                <label style={labelStyle}>Vertical</label>
                <select
                  defaultValue=""
                  style={{ ...selectStyle, ...getFocusStyle('vertical') }}
                  onFocus={handleFocus('vertical')}
                  onBlur={handleBlur}
                >
                  <option value="" disabled>
                    Selecciona una vertical
                  </option>
                  {verticalOptions.map((v) => (
                    <option key={v} value={v}>
                      {v}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* Billing info */}
          <div
            style={{
              background: '#ffffff',
              borderRadius: 16,
              border: '1px solid #e5e7eb',
              padding: '1.75rem',
              boxShadow: '0 1px 3px rgba(0,0,0,0.04)',
            }}
          >
            <h2 style={sectionTitleStyle}>Informacion de facturacion</h2>
            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                gap: '0.875rem',
              }}
            >
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                  gap: '0.875rem',
                }}
              >
                <div>
                  <label style={labelStyle}>Pais</label>
                  <select
                    defaultValue=""
                    style={{ ...selectStyle, ...getFocusStyle('country') }}
                    onFocus={handleFocus('country')}
                    onBlur={handleBlur}
                  >
                    <option value="" disabled>
                      Selecciona un pais
                    </option>
                    {countryOptions.map((c) => (
                      <option key={c} value={c}>
                        {c}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label style={labelStyle}>Ciudad</label>
                  <input
                    type="text"
                    placeholder="Tu ciudad"
                    style={{ ...inputStyle, ...getFocusStyle('city') }}
                    onFocus={handleFocus('city')}
                    onBlur={handleBlur}
                  />
                </div>
              </div>
              <div>
                <label style={labelStyle}>
                  Direccion{' '}
                  <span
                    style={{
                      fontWeight: 400,
                      color: 'var(--color-text-muted, #9ca3af)',
                    }}
                  >
                    (opcional)
                  </span>
                </label>
                <input
                  type="text"
                  placeholder="Calle y numero"
                  style={{ ...inputStyle, ...getFocusStyle('address') }}
                  onFocus={handleFocus('address')}
                  onBlur={handleBlur}
                />
              </div>
            </div>
          </div>
        </motion.div>

        {/* RIGHT COLUMN - Order summary */}
        <motion.div
          initial={{ opacity: 0, x: 16 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.4, delay: 0.1 }}
          style={{
            flex: '1 1 36%',
            minWidth: 300,
            position: 'sticky',
            top: '2rem',
          }}
        >
          <div
            style={{
              background: '#ffffff',
              borderRadius: 16,
              border: '1px solid #e5e7eb',
              overflow: 'hidden',
              boxShadow: '0 1px 3px rgba(0,0,0,0.04)',
            }}
          >
            {/* Header */}
            <div
              style={{
                padding: '1.25rem 1.5rem',
                borderBottom: '1px solid #e5e7eb',
              }}
            >
              <h3
                style={{
                  fontFamily: 'var(--font-heading)',
                  fontSize: '1rem',
                  fontWeight: 700,
                  color: 'var(--color-text-primary, #111827)',
                  margin: 0,
                }}
              >
                Resumen del pedido
              </h3>
            </div>

            {/* Product line */}
            <div style={{ padding: '1.25rem 1.5rem' }}>
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'flex-start',
                  gap: '1rem',
                  marginBottom: '1.25rem',
                  paddingBottom: '1.25rem',
                  borderBottom: '1px solid #f3f4f6',
                }}
              >
                <div style={{ flex: 1 }}>
                  <div
                    style={{
                      fontFamily: 'var(--font-body)',
                      fontSize: '0.875rem',
                      fontWeight: 600,
                      color: 'var(--color-text-primary, #111827)',
                      marginBottom: '0.25rem',
                      lineHeight: 1.4,
                    }}
                  >
                    {productName}
                  </div>
                  <div
                    style={{
                      fontFamily: 'var(--font-mono)',
                      fontSize: '0.6875rem',
                      color: 'var(--color-text-muted, #9ca3af)',
                    }}
                  >
                    Producto digital
                  </div>
                </div>
                <div
                  style={{
                    fontFamily: 'var(--font-heading)',
                    fontSize: '1rem',
                    fontWeight: 700,
                    color: 'var(--color-text-primary, #111827)',
                    whiteSpace: 'nowrap',
                  }}
                >
                  ${priceNum} USD
                </div>
              </div>

              {/* Subtotal */}
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  marginBottom: '0.5rem',
                }}
              >
                <span
                  style={{
                    fontFamily: 'var(--font-body)',
                    fontSize: '0.8125rem',
                    color: 'var(--color-text-secondary, #6b7280)',
                  }}
                >
                  Subtotal
                </span>
                <span
                  style={{
                    fontFamily: 'var(--font-body)',
                    fontSize: '0.8125rem',
                    fontWeight: 600,
                    color: 'var(--color-text-primary, #111827)',
                  }}
                >
                  ${priceNum} USD
                </span>
              </div>

              {/* Total */}
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  paddingTop: '0.875rem',
                  borderTop: '1px solid #e5e7eb',
                  marginTop: '0.5rem',
                }}
              >
                <span
                  style={{
                    fontFamily: 'var(--font-heading)',
                    fontSize: '1rem',
                    fontWeight: 700,
                    color: 'var(--color-text-primary, #111827)',
                  }}
                >
                  Total
                </span>
                <span
                  style={{
                    fontFamily: 'var(--font-heading)',
                    fontSize: '1.375rem',
                    fontWeight: 800,
                    color: '#059669',
                  }}
                >
                  ${priceNum} USD
                </span>
              </div>
            </div>

            {/* CTA */}
            <div style={{ padding: '0 1.5rem 1.5rem' }}>
              <button
                disabled
                style={{
                  width: '100%',
                  padding: '0.9375rem 1.5rem',
                  borderRadius: 12,
                  background: '#059669',
                  color: 'white',
                  fontFamily: 'var(--font-body)',
                  fontSize: '0.9375rem',
                  fontWeight: 700,
                  border: 'none',
                  cursor: 'not-allowed',
                  opacity: 0.85,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '0.5rem',
                  boxShadow: '0 4px 20px rgba(5,150,105,0.25)',
                  transition: 'all 0.2s',
                }}
              >
                <CreditCard size={18} strokeWidth={2} />
                Pagar con Stripe
              </button>
              <p
                style={{
                  fontFamily: 'var(--font-mono)',
                  fontSize: '0.6875rem',
                  color: 'var(--color-text-muted, #9ca3af)',
                  textAlign: 'center',
                  marginTop: '0.5rem',
                  fontWeight: 600,
                }}
              >
                Proximamente
              </p>
            </div>

            {/* Trust badges */}
            <div
              style={{
                padding: '1rem 1.5rem',
                borderTop: '1px solid #f3f4f6',
                display: 'flex',
                flexDirection: 'column',
                gap: '0.5rem',
              }}
            >
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                }}
              >
                <ShieldCheck size={14} color="#059669" />
                <span
                  style={{
                    fontFamily: 'var(--font-body)',
                    fontSize: '0.75rem',
                    color: 'var(--color-text-secondary, #6b7280)',
                  }}
                >
                  Pago seguro
                </span>
              </div>
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                }}
              >
                <CheckCircle2 size={14} color="#059669" />
                <span
                  style={{
                    fontFamily: 'var(--font-body)',
                    fontSize: '0.75rem',
                    color: 'var(--color-text-secondary, #6b7280)',
                  }}
                >
                  Garantia de satisfaccion
                </span>
              </div>
            </div>
          </div>

          {/* Security note */}
          <div
            style={{
              marginTop: '1rem',
              padding: '0.875rem 1.25rem',
              borderRadius: 12,
              background: 'rgba(5,150,105,0.04)',
              border: '1px solid rgba(5,150,105,0.1)',
              display: 'flex',
              alignItems: 'flex-start',
              gap: '0.5rem',
            }}
          >
            <Lock
              size={13}
              color="#059669"
              style={{ flexShrink: 0, marginTop: 2 }}
            />
            <p
              style={{
                fontFamily: 'var(--font-body)',
                fontSize: '0.75rem',
                lineHeight: 1.55,
                color: 'var(--color-text-secondary, #6b7280)',
                margin: 0,
              }}
            >
              Los pagos seran procesados de forma segura a traves de Stripe.
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  )
}

export default function CheckoutPage() {
  return (
    <Suspense fallback={<div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>Cargando...</div>}>
      <CheckoutContent />
    </Suspense>
  )
}
