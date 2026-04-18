'use client'

import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { Loader2, CheckCircle, XCircle, Mail } from 'lucide-react'
import { supabase } from '@/lib/supabase'
import { useAuth } from '@/context/AuthContext'

interface InvitationData {
  id: string
  org_id: string
  cohort_id: string | null
  email: string
  status: string
  expires_at: string
  invitation_type: string | null
  org_name?: string
}

const inputStyle: React.CSSProperties = {
  width: '100%',
  padding: '0.75rem 1rem',
  borderRadius: 'var(--radius-sm)',
  border: '1px solid var(--color-border)',
  background: 'var(--color-bg-card)',
  fontFamily: 'var(--font-body)',
  fontSize: '0.9375rem',
  color: 'var(--color-text-primary)',
  outline: 'none',
}

export default function InvitePage() {
  const params = useParams()
  const router = useRouter()
  const { appUser, login, register } = useAuth()
  const token = params.token as string

  const [invitation, setInvitation] = useState<InvitationData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [mode, setMode] = useState<'check' | 'register' | 'login' | 'accepting' | 'done' | 'error'>('check')

  // Register form
  const [fullName, setFullName] = useState('')
  const [password, setPassword] = useState('')
  const [startupName, setStartupName] = useState('')
  const [submitting, setSubmitting] = useState(false)

  // Load invitation
  useEffect(() => {
    async function loadInvitation() {
      setLoading(true)

      // Use service role or public query — invitations have RLS
      // For unauthenticated users, we query by token directly
      const { data, error: fetchError } = await supabase
        .from('invitations')
        .select('id, org_id, cohort_id, email, status, expires_at, invitation_type')
        .eq('token', token)
        .single()

      if (fetchError || !data) {
        setError('Invitación no encontrada o enlace inválido.')
        setMode('error')
        setLoading(false)
        return
      }

      if (data.status !== 'pending') {
        setError('Esta invitación ya fue utilizada o revocada.')
        setMode('error')
        setLoading(false)
        return
      }

      if (new Date(data.expires_at) < new Date()) {
        setError('Esta invitación ha expirado.')
        setMode('error')
        setLoading(false)
        return
      }

      // Get org name
      const { data: org } = await supabase
        .from('organizations')
        .select('name')
        .eq('id', data.org_id)
        .single()

      setInvitation({ ...data, org_name: org?.name || 'la organización' })
      setLoading(false)
    }

    loadInvitation()
  }, [token])

  // If user is already logged in, try to accept automatically
  useEffect(() => {
    if (!appUser || !invitation || mode !== 'check') return

    if (appUser.email.toLowerCase() === invitation.email.toLowerCase()) {
      acceptInvitation(appUser.id)
    } else {
      setMode('register')
    }
  }, [appUser, invitation])

  // If invitation loaded and no user, show register form
  useEffect(() => {
    if (!loading && invitation && !appUser && mode === 'check') {
      setMode('register')
    }
  }, [loading, invitation, appUser, mode])

  const isAdminOrgInvite = invitation?.invitation_type === 'admin_org'

  async function acceptInvitation(userId: string) {
    if (!invitation) return
    setMode('accepting')

    if (invitation.invitation_type === 'admin_org') {
      // Admin org invitation: set role and org_id
      await supabase
        .from('profiles')
        .update({ org_id: invitation.org_id, role: 'admin_org' })
        .eq('id', userId)
    } else {
      // Founder invitation (default): set org_id only
      await supabase
        .from('profiles')
        .update({ org_id: invitation.org_id })
        .eq('id', userId)

      // If cohort specified, link startup to cohort
      if (invitation.cohort_id) {
        const { data: startup } = await supabase
          .from('startups')
          .select('id')
          .eq('founder_id', userId)
          .single()

        if (startup) {
          const { error: linkErr } = await supabase
            .from('cohort_startups')
            .insert({
              cohort_id: invitation.cohort_id,
              startup_id: startup.id,
            })
          if (linkErr) console.error('[S4C Sync] cohort_startups link failed:', linkErr)
        }
      }
    }

    // Mark invitation as accepted
    const { error: acceptErr } = await supabase
      .from('invitations')
      .update({ status: 'accepted', accepted_at: new Date().toISOString() })
      .eq('id', invitation.id)
    if (acceptErr) console.error('[S4C Sync] invitation accept failed:', acceptErr)

    setMode('done')
    setTimeout(() => router.push(isAdminOrgInvite ? '/admin' : '/tools'), 2000)
  }

  async function handleRegister(e: React.FormEvent) {
    e.preventDefault()
    if (!invitation || !fullName.trim() || !password) return

    setSubmitting(true)
    setError(null)

    try {
      const defaultStartup = isAdminOrgInvite ? '' : (startupName.trim() || 'Mi Startup')
      await register(invitation.email, password, fullName.trim(), defaultStartup)

      // Wait for auth to settle
      await new Promise((r) => setTimeout(r, 1500))

      // Get current user
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) {
        setError('Error al crear la cuenta. Intenta de nuevo.')
        setSubmitting(false)
        return
      }

      // Create startup row only for founder invitations
      if (!isAdminOrgInvite && startupName.trim()) {
        const { error: startupErr } = await supabase.from('startups').upsert({
          founder_id: user.id,
          name: startupName.trim(),
          vertical: 'impact',
          country: 'PE',
        }, { onConflict: 'founder_id' })
        if (startupErr) console.error('[S4C Sync] invite startup upsert failed:', startupErr)
      }

      await acceptInvitation(user.id)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al registrarse.')
      setSubmitting(false)
    }
  }

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault()
    if (!invitation || !password) return

    setSubmitting(true)
    setError(null)

    try {
      await login(invitation.email, password)
      await new Promise((r) => setTimeout(r, 1000))
      const { data: { user } } = await supabase.auth.getUser()
      if (user) {
        await acceptInvitation(user.id)
      } else {
        setError('Error al iniciar sesión.')
        setSubmitting(false)
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Credenciales incorrectas.')
      setSubmitting(false)
    }
  }

  if (loading) {
    return (
      <div style={{
        minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center',
        background: 'var(--color-bg-primary)',
      }}>
        <Loader2 size={32} color="var(--color-accent-primary)" style={{ animation: 'spin 1s linear infinite' }} />

      </div>
    )
  }

  return (
    <div style={{
      minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center',
      background: 'var(--color-bg-primary)', padding: '2rem 1rem',
    }}>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        style={{
          maxWidth: 440, width: '100%',
          background: 'var(--color-bg-card)',
          border: '1px solid var(--color-border)',
          borderRadius: 'var(--radius-md)',
          padding: '2.5rem 2rem',
          boxShadow: 'var(--shadow-card)',
        }}
      >
        {/* Logo */}
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <h1 style={{
            fontFamily: 'var(--font-heading)', fontWeight: 700,
            fontSize: '1.375rem', color: 'var(--color-text-primary)',
          }}>
            Startups4Climate
          </h1>
        </div>

        {mode === 'error' && (
          <div style={{ textAlign: 'center' }}>
            <XCircle size={48} color="#DC2626" style={{ marginBottom: '1rem' }} />
            <p style={{
              fontFamily: 'var(--font-body)', fontSize: '1rem',
              color: 'var(--color-text-primary)', fontWeight: 500, marginBottom: '0.5rem',
            }}>
              Invitación no válida
            </p>
            <p style={{
              fontFamily: 'var(--font-body)', fontSize: '0.875rem',
              color: 'var(--color-text-secondary)',
            }}>
              {error}
            </p>
          </div>
        )}

        {mode === 'accepting' && (
          <div style={{ textAlign: 'center' }}>
            <Loader2 size={40} color="var(--color-accent-primary)" style={{ animation: 'spin 1s linear infinite', marginBottom: '1rem' }} />
            <p style={{
              fontFamily: 'var(--font-body)', fontSize: '1rem',
              color: 'var(--color-text-primary)',
            }}>
              Aceptando invitación...
            </p>
          </div>
        )}

        {mode === 'done' && (
          <div style={{ textAlign: 'center' }}>
            <CheckCircle size={48} color="#1F77F6" style={{ marginBottom: '1rem' }} />
            <p style={{
              fontFamily: 'var(--font-body)', fontSize: '1rem',
              color: 'var(--color-text-primary)', fontWeight: 500, marginBottom: '0.5rem',
            }}>
              ¡Te has unido a {invitation?.org_name}!
            </p>
            <p style={{
              fontFamily: 'var(--font-body)', fontSize: '0.875rem',
              color: 'var(--color-text-secondary)',
            }}>
              Redirigiendo a la plataforma...
            </p>
          </div>
        )}

        {mode === 'register' && invitation && (
          <>
            <div style={{ textAlign: 'center', marginBottom: '1.5rem' }}>
              <Mail size={32} color="var(--color-accent-primary)" style={{ marginBottom: '0.75rem' }} />
              <p style={{
                fontFamily: 'var(--font-body)', fontSize: '1rem',
                color: 'var(--color-text-primary)', fontWeight: 500, marginBottom: '0.25rem',
              }}>
                {isAdminOrgInvite
                  ? `Te invitaron como administrador de ${invitation.org_name}`
                  : `Te invitaron a ${invitation.org_name}`}
              </p>
              <p style={{
                fontFamily: 'var(--font-body)', fontSize: '0.8125rem',
                color: 'var(--color-text-muted)',
              }}>
                {invitation.email}
              </p>
            </div>

            {error && (
              <div style={{
                padding: '0.625rem 0.875rem', borderRadius: 'var(--radius-sm)',
                background: '#FEF2F2', border: '1px solid #FECACA',
                color: '#DC2626', fontFamily: 'var(--font-body)', fontSize: '0.8125rem',
                marginBottom: '1rem',
              }}>
                {error}
              </div>
            )}

            <form onSubmit={handleRegister}>
              <div style={{ marginBottom: '1rem' }}>
                <label style={{ fontFamily: 'var(--font-body)', fontSize: '0.8125rem', fontWeight: 600, color: 'var(--color-text-primary)', display: 'block', marginBottom: '0.375rem' }}>
                  Tu nombre completo *
                </label>
                <input
                  type="text"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="María García"
                  required
                  style={inputStyle}
                />
              </div>
              {!isAdminOrgInvite && (
                <div style={{ marginBottom: '1rem' }}>
                  <label style={{ fontFamily: 'var(--font-body)', fontSize: '0.8125rem', fontWeight: 600, color: 'var(--color-text-primary)', display: 'block', marginBottom: '0.375rem' }}>
                    Nombre de tu startup
                  </label>
                  <input
                    type="text"
                    value={startupName}
                    onChange={(e) => setStartupName(e.target.value)}
                    placeholder="EcoTech Solutions"
                    style={inputStyle}
                  />
                </div>
              )}
              <div style={{ marginBottom: '1.5rem' }}>
                <label style={{ fontFamily: 'var(--font-body)', fontSize: '0.8125rem', fontWeight: 600, color: 'var(--color-text-primary)', display: 'block', marginBottom: '0.375rem' }}>
                  Contraseña *
                </label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Mínimo 6 caracteres"
                  required
                  minLength={6}
                  style={inputStyle}
                />
              </div>
              <button
                type="submit"
                disabled={submitting}
                style={{
                  width: '100%', padding: '0.75rem',
                  borderRadius: 'var(--radius-sm)',
                  background: 'var(--color-accent-primary)',
                  color: '#fff', border: 'none', cursor: 'pointer',
                  fontFamily: 'var(--font-body)', fontSize: '0.9375rem', fontWeight: 600,
                  opacity: submitting ? 0.7 : 1,
                }}
              >
                {submitting ? 'Creando cuenta...' : 'Crear cuenta y unirme'}
              </button>
            </form>

            <div style={{ textAlign: 'center', marginTop: '1.25rem' }}>
              <button
                onClick={() => setMode('login')}
                style={{
                  background: 'none', border: 'none', cursor: 'pointer',
                  fontFamily: 'var(--font-body)', fontSize: '0.8125rem',
                  color: 'var(--color-accent-primary)', textDecoration: 'underline',
                }}
              >
                Ya tengo cuenta, iniciar sesión
              </button>
            </div>
          </>
        )}

        {mode === 'login' && invitation && (
          <>
            <div style={{ textAlign: 'center', marginBottom: '1.5rem' }}>
              <p style={{
                fontFamily: 'var(--font-body)', fontSize: '1rem',
                color: 'var(--color-text-primary)', fontWeight: 500,
              }}>
                Iniciar sesión
              </p>
              <p style={{
                fontFamily: 'var(--font-body)', fontSize: '0.8125rem',
                color: 'var(--color-text-muted)',
              }}>
                {invitation.email}
              </p>
            </div>

            {error && (
              <div style={{
                padding: '0.625rem 0.875rem', borderRadius: 'var(--radius-sm)',
                background: '#FEF2F2', border: '1px solid #FECACA',
                color: '#DC2626', fontFamily: 'var(--font-body)', fontSize: '0.8125rem',
                marginBottom: '1rem',
              }}>
                {error}
              </div>
            )}

            <form onSubmit={handleLogin}>
              <div style={{ marginBottom: '1.5rem' }}>
                <label style={{ fontFamily: 'var(--font-body)', fontSize: '0.8125rem', fontWeight: 600, color: 'var(--color-text-primary)', display: 'block', marginBottom: '0.375rem' }}>
                  Contraseña
                </label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  style={inputStyle}
                />
              </div>
              <button
                type="submit"
                disabled={submitting}
                style={{
                  width: '100%', padding: '0.75rem',
                  borderRadius: 'var(--radius-sm)',
                  background: 'var(--color-accent-primary)',
                  color: '#fff', border: 'none', cursor: 'pointer',
                  fontFamily: 'var(--font-body)', fontSize: '0.9375rem', fontWeight: 600,
                  opacity: submitting ? 0.7 : 1,
                }}
              >
                {submitting ? 'Entrando...' : 'Iniciar sesión y unirme'}
              </button>
            </form>

            <div style={{ textAlign: 'center', marginTop: '1.25rem' }}>
              <button
                onClick={() => { setMode('register'); setError(null) }}
                style={{
                  background: 'none', border: 'none', cursor: 'pointer',
                  fontFamily: 'var(--font-body)', fontSize: '0.8125rem',
                  color: 'var(--color-accent-primary)', textDecoration: 'underline',
                }}
              >
                No tengo cuenta, registrarme
              </button>
            </div>
          </>
        )}
      </motion.div>
    </div>
  )
}
