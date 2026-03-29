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
        if (isOrgAdmin) {
          window.location.href = '/admin'
        } else if (mode === 'register') {
          window.location.href = '/tools/completar-perfil'
        } else {
          window.location.href = '/tools'
        }
      }, 800)
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
          zIndex: 9999,
          backgroundColor: 'rgba(25,25,25,0.6)',
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
          transition={{ type: 'spring', stiffness: 100, damping: 20 }}
          onClick={(e) => e.stopPropagation()}
          style={{
            width: '100%',
            maxWidth: 480,
            maxHeight: 'calc(100vh - 2rem)',
            overflowY: 'auto',
            background: 'var(--color-paper)',
            borderRadius: 'var(--radius-lg)',
            boxShadow: '0 40px 80px rgba(25,25,25,0.2), 0 8px 20px rgba(25,25,25,0.08)',
            position: 'relative',
          }}
        >
          {/* Close button */}
          <button
            onClick={closeAuthModal}
            style={{
              position: 'absolute',
              top: 20,
              right: 20,
              width: 36,
              height: 36,
              borderRadius: 'var(--radius-full)',
              border: '1px solid var(--color-border)',
              background: 'transparent',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              color: 'var(--color-text-muted)',
              transition: 'all 0.2s',
              zIndex: 10,
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = 'var(--color-bg-primary)'
              e.currentTarget.style.color = 'var(--color-ink)'
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = 'transparent'
              e.currentTarget.style.color = 'var(--color-text-muted)'
            }}
          >
            <X size={16} />
          </button>

          <AnimatePresence mode="wait">
            {success ? (
              <motion.div
                key="success"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ type: 'spring', stiffness: 100, damping: 20 }}
                style={{ padding: '3.5rem', textAlign: 'center' }}
              >
                <div
                  style={{
                    width: 72,
                    height: 72,
                    borderRadius: 'var(--radius-full)',
                    background: 'rgba(13,148,136,0.08)',
                    border: '1px solid rgba(13,148,136,0.15)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    margin: '0 auto 1.5rem',
                  }}
                >
                  <CheckCircle2 size={36} color="#0D9488" />
                </div>
                <h3
                  style={{
                    fontFamily: 'var(--font-heading)',
                    fontSize: 'var(--text-heading-md)',
                    fontWeight: 700,
                    color: 'var(--color-ink)',
                    letterSpacing: '-0.03em',
                    marginBottom: '0.5rem',
                  }}
                >
                  {mode === 'register' ? '¡Cuenta creada!' : '¡Bienvenido de vuelta!'}
                </h3>
                <p style={{ fontFamily: 'var(--font-body)', fontSize: 'var(--text-body)', color: 'var(--color-text-secondary)' }}>
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
              >
                {/* S4C Logo header strip */}
                <div
                  style={{
                    padding: '2rem 2.5rem 0',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem',
                    marginBottom: '0.5rem',
                  }}
                >
                  <span
                    style={{
                      fontFamily: 'var(--font-heading)',
                      fontSize: '0.9375rem',
                      fontWeight: 700,
                      color: 'var(--color-ink)',
                      letterSpacing: '-0.02em',
                    }}
                  >
                    Startups<span style={{ color: 'var(--color-accent-primary)' }}>4</span>Climate
                  </span>
                </div>

                {/* Tabs: Login / Registro */}
                {!orgMode && (
                  <div
                    style={{
                      display: 'flex',
                      gap: '0',
                      padding: '0 2.5rem',
                      borderBottom: '1px solid var(--color-border)',
                      marginBottom: '2rem',
                    }}
                  >
                    {(['login', 'register'] as const).map((tab) => (
                      <button
                        key={tab}
                        type="button"
                        onClick={() => {
                          setMode(tab)
                          setError('')
                        }}
                        style={{
                          background: 'none',
                          border: 'none',
                          borderBottom: mode === tab ? '2px solid var(--color-ink)' : '2px solid transparent',
                          padding: '0.875rem 0',
                          marginRight: '2rem',
                          marginBottom: '-1px',
                          fontFamily: 'var(--font-body)',
                          fontSize: 'var(--text-body)',
                          fontWeight: mode === tab ? 700 : 500,
                          color: mode === tab ? 'var(--color-ink)' : 'var(--color-text-secondary)',
                          cursor: 'pointer',
                          transition: 'all 0.2s',
                          letterSpacing: '-0.01em',
                        }}
                      >
                        {tab === 'login' ? 'Iniciar sesión' : 'Registrarse'}
                      </button>
                    ))}
                  </div>
                )}

                <div style={{ padding: orgMode ? '0 2.5rem 2.5rem' : '0 2.5rem 2.5rem' }}>
                  {/* Heading */}
                  <div style={{ marginBottom: '2rem' }}>
                    <h2
                      style={{
                        fontFamily: 'var(--font-heading)',
                        fontSize: 'var(--text-display-md)',
                        fontWeight: 700,
                        color: 'var(--color-ink)',
                        letterSpacing: '-0.04em',
                        lineHeight: 1.05,
                        marginBottom: '0.625rem',
                      }}
                    >
                      {mode === 'login'
                        ? (orgMode ? 'Acceso organizaciones' : 'Accede a tus herramientas')
                        : 'Crea tu cuenta gratis'}
                    </h2>
                    <p
                      style={{
                        fontFamily: 'var(--font-body)',
                        fontSize: 'var(--text-body)',
                        color: 'var(--color-text-secondary)',
                        lineHeight: 1.5,
                      }}
                    >
                      {mode === 'login'
                        ? (orgMode
                          ? 'Ingresa las credenciales proporcionadas por S4C.'
                          : '+30 herramientas operativas para startups de impacto.')
                        : <>Accede a la Plataforma <span style={{ color: 'var(--color-accent-primary)', fontWeight: 700 }}>S4C</span> sin costo.</>}
                    </p>
                  </div>

                  <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '0' }}>
                    {mode === 'register' && (
                      <>
                        <TypeformInput
                          icon={<User size={16} color="var(--color-text-muted)" />}
                          placeholder="Tu nombre completo"
                          value={form.name}
                          onChange={set('name')}
                          autoComplete="name"
                        />
                        <TypeformInput
                          icon={<Building2 size={16} color="var(--color-text-muted)" />}
                          placeholder="Nombre de tu startup"
                          value={form.startup}
                          onChange={set('startup')}
                          autoComplete="organization"
                        />
                      </>
                    )}
                    <TypeformInput
                      icon={<Mail size={16} color="var(--color-text-muted)" />}
                      type="email"
                      placeholder="Email"
                      value={form.email}
                      onChange={set('email')}
                      autoComplete="email"
                    />
                    <div style={{ position: 'relative' }}>
                      <TypeformInput
                        icon={<Lock size={16} color="var(--color-text-muted)" />}
                        type={showPassword ? 'text' : 'password'}
                        placeholder="Contraseña (min. 6 caracteres)"
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
                          right: 0,
                          bottom: 16,
                          background: 'none',
                          border: 'none',
                          cursor: 'pointer',
                          color: 'var(--color-text-muted)',
                          display: 'flex',
                          alignItems: 'center',
                          padding: 4,
                        }}
                      >
                        {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
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
                          border: '1px solid rgba(220,38,38,0.12)',
                          borderRadius: 'var(--radius-sm)',
                          padding: '0.625rem 0.875rem',
                          marginTop: '1rem',
                        }}
                      >
                        {error}
                      </motion.p>
                    )}

                    <button
                      type="submit"
                      disabled={loading}
                      className="auth-cta-btn"
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '0.5rem',
                        width: '100%',
                        padding: '1rem 2rem',
                        borderRadius: 'var(--radius-full)',
                        background: loading ? 'var(--color-text-secondary)' : 'var(--color-ink)',
                        color: 'var(--color-paper)',
                        fontFamily: 'var(--font-body)',
                        fontSize: 'var(--text-body-lg)',
                        fontWeight: 700,
                        border: 'none',
                        cursor: loading ? 'not-allowed' : 'pointer',
                        marginTop: '1.75rem',
                        letterSpacing: '-0.01em',
                      }}
                    >
                      {loading ? (
                        <Loader2 size={20} style={{ animation: 'spin 1s linear infinite' }} />
                      ) : (
                        <>
                          {mode === 'login' ? 'Acceder a la plataforma' : 'Crear cuenta gratis'}
                          <ArrowRight size={18} />
                        </>
                      )}
                    </button>
                  </form>

                  {/* Footer links */}
                  <div
                    style={{
                      marginTop: '1.5rem',
                      paddingTop: '1.25rem',
                      borderTop: '1px solid var(--color-border)',
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
                          fontSize: '0.875rem',
                          fontWeight: 600,
                          color: 'var(--color-accent-primary)',
                          cursor: 'pointer',
                        }}
                      >
                        Volver al login como founder
                      </button>
                    ) : (
                      <span
                        style={{
                          fontFamily: 'var(--font-body)',
                          fontSize: '0.875rem',
                          color: 'var(--color-text-secondary)',
                        }}
                      >
                        {mode === 'login' ? '¿Aún no tienes cuenta?' : '¿Ya tienes cuenta?'}{' '}
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
                            fontSize: '0.875rem',
                            fontWeight: 700,
                            color: 'var(--color-ink)',
                            cursor: 'pointer',
                            textDecoration: 'underline',
                            textUnderlineOffset: '3px',
                          }}
                        >
                          {mode === 'login' ? 'Regístrate gratis' : 'Iniciar sesión'}
                        </button>
                      </span>
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
                          fontSize: '0.8125rem',
                          fontWeight: 500,
                          color: 'var(--color-text-muted)',
                          cursor: 'pointer',
                          transition: 'color 0.2s',
                        }}
                        onMouseEnter={(e) => { e.currentTarget.style.color = 'var(--color-ink)' }}
                        onMouseLeave={(e) => { e.currentTarget.style.color = 'var(--color-text-muted)' }}
                      >
                        <Building2 size={13} />
                        Acceder como organización
                      </button>
                    </div>
                  )}
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          <style>{`
            @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
            .auth-cta-btn:hover:not(:disabled) {
              background: var(--color-accent-primary) !important;
            }
          `}</style>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  )
}

function TypeformInput({
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
        alignItems: 'flex-end',
        gap: '0.75rem',
        borderBottom: `2px solid ${focused ? 'var(--color-ink)' : 'var(--color-border)'}`,
        paddingBottom: '0.125rem',
        marginBottom: '1.25rem',
        transition: 'border-color 0.2s ease',
      }}
    >
      <span style={{ flexShrink: 0, display: 'flex', paddingBottom: '0.875rem', opacity: focused ? 1 : 0.5, transition: 'opacity 0.2s' }}>
        {icon}
      </span>
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
          padding: '0.5rem 0 0.875rem',
          paddingRight: paddingRight ? `${paddingRight}px` : undefined,
          border: 'none',
          background: 'transparent',
          fontFamily: 'var(--font-body)',
          fontSize: 'var(--text-heading-md)',
          color: 'var(--color-ink)',
          outline: 'none',
          letterSpacing: '-0.01em',
        }}
      />
    </div>
  )
}
