'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, ArrowRight, Eye, EyeOff, Loader2, CheckCircle2, Lock, User, Building2, Mail } from 'lucide-react'
import { useAuth } from '@/context/AuthContext'

export default function AuthModal() {
  const { authModalOpen, authModalMode, closeAuthModal, login, register } = useAuth()
  const [mode, setMode] = useState<'login' | 'register'>(authModalMode)
  const [loading, setLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)

  const [form, setForm] = useState({ email: '', password: '', name: '', startup: '' })

  useEffect(() => {
    if (authModalOpen) {
      setMode(authModalMode)
      setError('')
      setSuccess(false)
      setForm({ email: '', password: '', name: '', startup: '' })
    }
  }, [authModalOpen, authModalMode])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    if (!form.email || !form.password) {
      setError('Por favor completa todos los campos requeridos.')
      return
    }
    if (form.password.length < 6) {
      setError('La contraseña debe tener al menos 6 caracteres.')
      return
    }
    if (mode === 'register' && (!form.name || !form.startup)) {
      setError('Por favor completa todos los campos.')
      return
    }

    setLoading(true)
    const result =
      mode === 'login'
        ? await login(form.email, form.password)
        : await register(form.email, form.password, form.name, form.startup)
    setLoading(false)

    if (result.error) {
      setError(result.error)
    } else {
      setSuccess(true)
      setTimeout(() => {
        closeAuthModal()
        setSuccess(false)
        // Use full page navigation so the browser sends updated auth cookies
        // to the server middleware. router.push() does a client-side navigation
        // that skips cookie propagation, causing the middleware to reject the request.
        window.location.href = '/tools'
      }, 1200)
    }
  }

  const set = (field: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm((p) => ({ ...p, [field]: e.target.value }))
    setError('')
  }

  if (!authModalOpen) return null

  return (
    <AnimatePresence>
      <motion.div
        key="overlay"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.25 }}
        onClick={closeAuthModal}
        style={{
          position: 'fixed',
          inset: 0,
          zIndex: 200,
          backgroundColor: 'rgba(0,0,0,0.55)',
          backdropFilter: 'blur(8px)',
          WebkitBackdropFilter: 'blur(8px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '1rem',
        }}
      >
        <motion.div
          key="modal"
          initial={{ opacity: 0, y: 32, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 16, scale: 0.97 }}
          transition={{ type: 'spring', stiffness: 380, damping: 30 }}
          onClick={(e) => e.stopPropagation()}
          style={{
            width: '100%',
            maxWidth: 440,
            background: '#FFFFFF',
            borderRadius: 24,
            border: '1px solid rgba(0,0,0,0.08)',
            boxShadow:
              '0 32px 80px rgba(0,0,0,0.18), 0 8px 20px rgba(0,0,0,0.08), 0 0 0 1px rgba(255,255,255,0.9)',
            overflow: 'hidden',
            position: 'relative',
          }}
        >
          {/* Top gradient bar */}
          <div
            style={{
              height: 4,
              background: 'linear-gradient(90deg, #7C3AED, #059669, #D97706)',
            }}
          />

          {/* Close button */}
          <button
            onClick={closeAuthModal}
            style={{
              position: 'absolute',
              top: 18,
              right: 18,
              width: 32,
              height: 32,
              borderRadius: '50%',
              border: '1px solid var(--color-border)',
              background: 'white',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              color: 'var(--color-text-muted)',
              transition: 'all 0.2s',
              zIndex: 10,
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = '#F3F4F6'
              e.currentTarget.style.color = 'var(--color-text-primary)'
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = 'white'
              e.currentTarget.style.color = 'var(--color-text-muted)'
            }}
          >
            <X size={15} />
          </button>

          <AnimatePresence mode="wait">
            {success ? (
              <motion.div
                key="success"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.35 }}
                style={{ padding: '3rem 2rem', textAlign: 'center' }}
              >
                <div
                  style={{
                    width: 64,
                    height: 64,
                    borderRadius: '50%',
                    background: 'rgba(5,150,105,0.08)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    margin: '0 auto 1rem',
                  }}
                >
                  <CheckCircle2 size={32} color="#059669" />
                </div>
                <h3
                  style={{
                    fontFamily: 'var(--font-heading)',
                    fontSize: '1.25rem',
                    fontWeight: 700,
                    color: 'var(--color-text-primary)',
                    marginBottom: '0.375rem',
                  }}
                >
                  {mode === 'register' ? '!Cuenta creada!' : '!Bienvenido de vuelta!'}
                </h3>
                <p style={{ fontFamily: 'var(--font-body)', fontSize: '0.875rem', color: 'var(--color-text-secondary)' }}>
                  Accediendo a tu plataforma...
                </p>
              </motion.div>
            ) : (
              <motion.div
                key={mode}
                initial={{ opacity: 0, x: mode === 'register' ? 20 : -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: mode === 'register' ? -20 : 20 }}
                transition={{ duration: 0.25 }}
                style={{ padding: '2rem' }}
              >
                {/* Header */}
                <div style={{ marginBottom: '1.75rem' }}>
                  <div
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '0.5rem',
                      padding: '0.25rem 0.75rem',
                      borderRadius: 9999,
                      background: 'rgba(5,150,105,0.07)',
                      border: '1px solid rgba(5,150,105,0.14)',
                      fontFamily: 'var(--font-mono)',
                      fontSize: '0.6875rem',
                      fontWeight: 600,
                      color: '#059669',
                      letterSpacing: '0.04em',
                      textTransform: 'uppercase',
                      marginBottom: '0.75rem',
                    }}
                  >
                    Startups4Climate
                  </div>
                  <h2
                    style={{
                      fontFamily: 'var(--font-heading)',
                      fontSize: '1.375rem',
                      fontWeight: 800,
                      color: 'var(--color-text-primary)',
                      letterSpacing: '-0.02em',
                      marginBottom: '0.375rem',
                    }}
                  >
                    {mode === 'login' ? 'Accede a tus herramientas' : 'Crea tu cuenta gratuita'}
                  </h2>
                  <p
                    style={{
                      fontFamily: 'var(--font-body)',
                      fontSize: '0.875rem',
                      color: 'var(--color-text-secondary)',
                      lineHeight: 1.5,
                    }}
                  >
                    {mode === 'login'
                      ? <>+30 herramientas operativas para climate tech, listas para usar.</>
                      : <>Accede a la Plataforma <span style={{ background: 'linear-gradient(135deg, #059669, #0891B2)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', fontWeight: 700 }}>S4C</span> de climate tech sin costo.</>}
                  </p>
                </div>

                <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '0.875rem' }}>
                  {mode === 'register' && (
                    <>
                      <InputField
                        icon={<User size={15} color="#9CA3AF" />}
                        placeholder="Tu nombre completo"
                        value={form.name}
                        onChange={set('name')}
                        autoComplete="name"
                      />
                      <InputField
                        icon={<Building2 size={15} color="#9CA3AF" />}
                        placeholder="Nombre de tu startup"
                        value={form.startup}
                        onChange={set('startup')}
                        autoComplete="organization"
                      />
                    </>
                  )}
                  <InputField
                    icon={<Mail size={15} color="#9CA3AF" />}
                    type="email"
                    placeholder="Email"
                    value={form.email}
                    onChange={set('email')}
                    autoComplete="email"
                  />
                  <div style={{ position: 'relative' }}>
                    <InputField
                      icon={<Lock size={15} color="#9CA3AF" />}
                      type={showPassword ? 'text' : 'password'}
                      placeholder="Contrasena (min. 6 caracteres)"
                      value={form.password}
                      onChange={set('password')}
                      autoComplete={mode === 'login' ? 'current-password' : 'new-password'}
                      paddingRight={44}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword((p) => !p)}
                      style={{
                        position: 'absolute',
                        right: 12,
                        top: '50%',
                        transform: 'translateY(-50%)',
                        background: 'none',
                        border: 'none',
                        cursor: 'pointer',
                        color: 'var(--color-text-muted)',
                        display: 'flex',
                        alignItems: 'center',
                        padding: 4,
                      }}
                    >
                      {showPassword ? <EyeOff size={15} /> : <Eye size={15} />}
                    </button>
                  </div>

                  {error && (
                    <motion.p
                      initial={{ opacity: 0, y: -4 }}
                      animate={{ opacity: 1, y: 0 }}
                      style={{
                        fontFamily: 'var(--font-body)',
                        fontSize: '0.8125rem',
                        color: '#DC2626',
                        background: 'rgba(220,38,38,0.05)',
                        border: '1px solid rgba(220,38,38,0.12)',
                        borderRadius: 8,
                        padding: '0.625rem 0.875rem',
                      }}
                    >
                      {error}
                    </motion.p>
                  )}

                  <button
                    type="submit"
                    disabled={loading}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '0.5rem',
                      width: '100%',
                      padding: '0.875rem',
                      borderRadius: 12,
                      background: loading ? '#6EE7B7' : '#059669',
                      color: 'white',
                      fontFamily: 'var(--font-body)',
                      fontSize: '0.9375rem',
                      fontWeight: 600,
                      border: 'none',
                      cursor: loading ? 'not-allowed' : 'pointer',
                      transition: 'all 0.2s',
                      boxShadow: '0 4px 14px rgba(5,150,105,0.3)',
                      marginTop: '0.25rem',
                    }}
                    onMouseEnter={(e) => {
                      if (!loading) e.currentTarget.style.background = '#047857'
                    }}
                    onMouseLeave={(e) => {
                      if (!loading) e.currentTarget.style.background = '#059669'
                    }}
                  >
                    {loading ? (
                      <Loader2 size={18} style={{ animation: 'spin 1s linear infinite' }} />
                    ) : (
                      <>
                        {mode === 'login' ? 'Acceder a la plataforma' : 'Crear cuenta gratis'}
                        <ArrowRight size={17} />
                      </>
                    )}
                  </button>
                </form>

                <div
                  style={{
                    marginTop: '1.25rem',
                    paddingTop: '1.25rem',
                    borderTop: '1px solid var(--color-border)',
                    textAlign: 'center',
                  }}
                >
                  <span
                    style={{
                      fontFamily: 'var(--font-body)',
                      fontSize: '0.8125rem',
                      color: 'var(--color-text-secondary)',
                    }}
                  >
                    {mode === 'login' ? 'Aun no tienes cuenta?' : 'Ya tienes cuenta?'}{' '}
                  </span>
                  <button
                    type="button"
                    onClick={() => {
                      setMode(mode === 'login' ? 'register' : 'login')
                      setError('')
                    }}
                    style={{
                      background: 'none',
                      border: 'none',
                      fontFamily: 'var(--font-body)',
                      fontSize: '0.8125rem',
                      fontWeight: 600,
                      color: '#059669',
                      cursor: 'pointer',
                      textDecoration: 'underline',
                      textUnderlineOffset: 2,
                    }}
                  >
                    {mode === 'login' ? 'Registrate gratis' : 'Iniciar sesion'}
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  )
}

function InputField({
  icon,
  type = 'text',
  placeholder,
  value,
  onChange,
  autoComplete,
  paddingRight,
}: {
  icon: React.ReactNode
  type?: string
  placeholder: string
  value: string
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void
  autoComplete?: string
  paddingRight?: number
}) {
  const [focused, setFocused] = useState(false)

  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: '0.625rem',
        padding: '0 0.875rem',
        borderRadius: 10,
        border: `1px solid ${focused ? '#059669' : 'var(--color-border)'}`,
        background: focused ? 'rgba(5,150,105,0.02)' : 'var(--color-bg-primary)',
        transition: 'all 0.18s ease',
        boxShadow: focused ? '0 0 0 3px rgba(5,150,105,0.08)' : 'none',
      }}
    >
      <span style={{ flexShrink: 0, display: 'flex' }}>{icon}</span>
      <input
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        autoComplete={autoComplete}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        style={{
          flex: 1,
          padding: '0.75rem 0',
          paddingRight: paddingRight ? `${paddingRight}px` : undefined,
          border: 'none',
          background: 'transparent',
          fontFamily: 'var(--font-body)',
          fontSize: '0.875rem',
          color: 'var(--color-text-primary)',
          outline: 'none',
        }}
      />
    </div>
  )
}
