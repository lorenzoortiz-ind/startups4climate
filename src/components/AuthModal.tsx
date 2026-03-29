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
  const [orgMode, setOrgMode] = useState(false)

  const [form, setForm] = useState({ email: '', password: '', name: '', startup: '' })

  useEffect(() => {
    if (authModalOpen) {
      setMode(authModalMode)
      setError('')
      setSuccess(false)
      setForm({ email: '', password: '', name: '', startup: '' })
      setOrgMode(false)
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
      setError('La contrasena debe tener al menos 6 caracteres.')
      return
    }
    if (mode === 'register' && (!form.name || !form.startup)) {
      setError('Por favor completa todos los campos.')
      return
    }

    setLoading(true)
    let result: { error?: string; role?: string }
    try {
      result =
        mode === 'login'
          ? await login(form.email, form.password)
          : await register(form.email, form.password, form.name, form.startup)
    } catch {
      setError('Error de conexion. Verifica tu internet e intenta de nuevo.')
      setLoading(false)
      return
    }
    setLoading(false)

    if (result.error) {
      setError(result.error)
    } else {
      setSuccess(true)
      // Check if user is org admin - redirect to admin dashboard
      const isOrgAdmin = result.role === 'admin_org' || result.role === 'superadmin'
      // Wait for auth state to fully propagate before redirecting
      setTimeout(() => {
        closeAuthModal()
        setSuccess(false)
        // Use full page navigation so the browser sends updated auth cookies
        // to the server middleware. router.push() does a client-side navigation
        // that skips cookie propagation, causing the middleware to reject the request.
        window.location.href = mode === 'register'
          ? '/tools/completar-perfil'
          : isOrgAdmin ? '/admin' : '/tools'
      }, 1800)
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
          backgroundColor: 'rgba(42,34,43,0.6)',
          backdropFilter: 'blur(12px)',
          WebkitBackdropFilter: 'blur(12px)',
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
            borderRadius: 16,
            boxShadow:
              '0 32px 80px rgba(42,34,43,0.18), 0 8px 20px rgba(42,34,43,0.08)',
            overflow: 'hidden',
            position: 'relative',
          }}
        >
          {/* Close button */}
          <button
            onClick={closeAuthModal}
            style={{
              position: 'absolute',
              top: 18,
              right: 18,
              width: 32,
              height: 32,
              borderRadius: 8,
              border: '1px solid #E8E4DF',
              background: 'white',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              color: '#93908C',
              transition: 'all 0.2s',
              zIndex: 10,
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = '#FAF8F5'
              e.currentTarget.style.color = '#2A222B'
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = 'white'
              e.currentTarget.style.color = '#93908C'
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
                style={{ padding: '3rem', textAlign: 'center' }}
              >
                <div
                  style={{
                    width: 64,
                    height: 64,
                    borderRadius: '50%',
                    background: 'rgba(13,148,136,0.08)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    margin: '0 auto 1rem',
                  }}
                >
                  <CheckCircle2 size={32} color="#0D9488" />
                </div>
                <h3
                  style={{
                    fontFamily: 'var(--font-heading)',
                    fontSize: '1.375rem',
                    fontWeight: 700,
                    color: '#2A222B',
                    marginBottom: '0.375rem',
                  }}
                >
                  {mode === 'register' ? '!Cuenta creada!' : '!Bienvenido de vuelta!'}
                </h3>
                <p style={{ fontFamily: 'var(--font-body)', fontSize: '0.9375rem', color: '#5E5A60' }}>
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
                style={{ padding: '3rem' }}
              >
                {/* Header */}
                <div style={{ marginBottom: '1.75rem' }}>
                  <h2
                    style={{
                      fontFamily: 'var(--font-heading)',
                      fontSize: '1.75rem',
                      fontWeight: 700,
                      color: '#2A222B',
                      letterSpacing: '-0.01em',
                      marginBottom: '0.5rem',
                      lineHeight: 1.2,
                    }}
                  >
                    {mode === 'login'
                      ? (orgMode ? 'Acceso para organizaciones' : 'Accede a tus herramientas')
                      : 'Crea tu cuenta gratuita'}
                  </h2>
                  <p
                    style={{
                      fontFamily: 'var(--font-body)',
                      fontSize: '0.9375rem',
                      color: '#5E5A60',
                      lineHeight: 1.5,
                    }}
                  >
                    {mode === 'login'
                      ? (orgMode
                        ? <>Ingresa las credenciales proporcionadas por S4C.</>
                        : <>+30 herramientas operativas para startups de impacto, listas para usar.</>)
                      : <>Accede a la Plataforma <span style={{ color: '#FF6B4A', fontWeight: 700 }}>S4C</span> sin costo.</>}
                  </p>
                </div>

                <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '0.875rem' }}>
                  {mode === 'register' && (
                    <>
                      <InputField
                        icon={<User size={15} color="#93908C" />}
                        placeholder="Tu nombre completo"
                        value={form.name}
                        onChange={set('name')}
                        autoComplete="name"
                      />
                      <InputField
                        icon={<Building2 size={15} color="#93908C" />}
                        placeholder="Nombre de tu startup"
                        value={form.startup}
                        onChange={set('startup')}
                        autoComplete="organization"
                      />
                    </>
                  )}
                  <InputField
                    icon={<Mail size={15} color="#93908C" />}
                    type="email"
                    placeholder="Email"
                    value={form.email}
                    onChange={set('email')}
                    autoComplete="email"
                  />
                  <div style={{ position: 'relative' }}>
                    <InputField
                      icon={<Lock size={15} color="#93908C" />}
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
                        color: '#93908C',
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
                        fontSize: '0.875rem',
                        color: '#DC2626',
                        background: 'rgba(220,38,38,0.04)',
                        border: '1px solid rgba(220,38,38,0.1)',
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
                      borderRadius: 8,
                      background: loading ? '#3D3540' : '#2A222B',
                      color: 'white',
                      fontFamily: 'var(--font-body)',
                      fontSize: '0.9375rem',
                      fontWeight: 600,
                      border: 'none',
                      cursor: loading ? 'not-allowed' : 'pointer',
                      transition: 'all 0.2s',
                      marginTop: '0.25rem',
                    }}
                    onMouseEnter={(e) => {
                      if (!loading) e.currentTarget.style.background = '#3D3540'
                    }}
                    onMouseLeave={(e) => {
                      if (!loading) e.currentTarget.style.background = '#2A222B'
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
                    borderTop: '1px solid #E8E4DF',
                    textAlign: 'center',
                  }}
                >
                  {orgMode ? (
                    <button
                      type="button"
                      onClick={() => {
                        setOrgMode(false)
                        setForm({ email: '', password: '', name: '', startup: '' })
                        setError('')
                      }}
                      style={{
                        background: 'none',
                        border: 'none',
                        fontFamily: 'var(--font-body)',
                        fontSize: '0.8125rem',
                        fontWeight: 600,
                        color: '#FF6B4A',
                        cursor: 'pointer',
                        textDecoration: 'none',
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.textDecoration = 'underline'
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.textDecoration = 'none'
                      }}
                    >
                      Volver al login como founder
                    </button>
                  ) : (
                    <>
                      <span
                        style={{
                          fontFamily: 'var(--font-body)',
                          fontSize: '0.8125rem',
                          color: '#5E5A60',
                        }}
                      >
                        {mode === 'login' ? 'Aun no tienes cuenta?' : 'Ya tienes cuenta?'}{' '}
                      </span>
                      <button
                        type="button"
                        onClick={() => {
                          setMode(mode === 'login' ? 'register' : 'login')
                          setOrgMode(false)
                          setError('')
                        }}
                        style={{
                          background: 'none',
                          border: 'none',
                          fontFamily: 'var(--font-body)',
                          fontSize: '0.8125rem',
                          fontWeight: 600,
                          color: '#FF6B4A',
                          cursor: 'pointer',
                          textDecoration: 'none',
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.textDecoration = 'underline'
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.textDecoration = 'none'
                        }}
                      >
                        {mode === 'login' ? 'Registrate gratis' : 'Iniciar sesion'}
                      </button>
                    </>
                  )}
                </div>

                {mode === 'login' && !orgMode && (
                  <div
                    style={{
                      paddingTop: '0.75rem',
                      textAlign: 'center',
                    }}
                  >
                    <button
                      type="button"
                      onClick={() => {
                        setOrgMode(true)
                        setForm({ email: '', password: '', name: '', startup: '' })
                        setError('')
                      }}
                      style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '0.375rem',
                        background: 'none',
                        border: 'none',
                        padding: 0,
                        fontFamily: 'var(--font-body)',
                        fontSize: '0.75rem',
                        fontWeight: 500,
                        color: '#93908C',
                        cursor: 'pointer',
                        textDecoration: 'none',
                        transition: 'all 0.2s',
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.color = '#2A222B'
                        e.currentTarget.style.textDecoration = 'underline'
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.color = '#93908C'
                        e.currentTarget.style.textDecoration = 'none'
                      }}
                    >
                      <Building2 size={13} />
                      Acceder como organizacion
                    </button>
                  </div>
                )}
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
        padding: '0 1rem',
        borderRadius: 8,
        border: `1px solid ${focused ? '#2A222B' : '#E8E4DF'}`,
        background: '#FFFFFF',
        transition: 'all 0.18s ease',
        boxShadow: focused ? '0 0 0 3px rgba(42,34,43,0.06)' : 'none',
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
          padding: '0.875rem 0',
          paddingRight: paddingRight ? `${paddingRight}px` : undefined,
          border: 'none',
          background: 'transparent',
          fontFamily: 'var(--font-body)',
          fontSize: '0.9375rem',
          color: '#2A222B',
          outline: 'none',
        }}
      />
    </div>
  )
}
