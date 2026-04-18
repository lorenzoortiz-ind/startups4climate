'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import { Loader2, CheckCircle2, Lock, AlertCircle } from 'lucide-react'

export default function ResetPasswordPage() {
  const router = useRouter()
  const [password, setPassword] = useState('')
  const [confirm, setConfirm] = useState('')
  const [status, setStatus] = useState<'idle' | 'saving' | 'success' | 'error'>('idle')
  const [errorMsg, setErrorMsg] = useState<string | null>(null)
  const [sessionReady, setSessionReady] = useState<boolean | null>(null)

  // Verify a recovery session exists before showing the form.
  // Supabase attaches the session automatically after callback exchange.
  useEffect(() => {
    let cancelled = false
    ;(async () => {
      const { data } = await supabase.auth.getSession()
      if (!cancelled) setSessionReady(!!data.session)
    })()
    return () => {
      cancelled = true
    }
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setErrorMsg(null)
    if (password.length < 8) {
      setErrorMsg('La contraseña debe tener al menos 8 caracteres.')
      setStatus('error')
      return
    }
    if (password !== confirm) {
      setErrorMsg('Las contraseñas no coinciden.')
      setStatus('error')
      return
    }
    setStatus('saving')
    const { error } = await supabase.auth.updateUser({ password })
    if (error) {
      console.error('[S4C Auth] password update failed:', error)
      setErrorMsg(
        error.message === 'New password should be different from the old password.'
          ? 'La nueva contraseña debe ser distinta de la anterior.'
          : 'No pudimos actualizar tu contraseña. Intenta con el link desde tu email de nuevo.',
      )
      setStatus('error')
      return
    }
    setStatus('success')
    setTimeout(() => router.push('/tools'), 1600)
  }

  return (
    <main
      style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'var(--color-bg-primary)',
        padding: 'clamp(1.5rem, 5vw, 3rem)',
      }}
    >
      <div
        style={{
          width: '100%',
          maxWidth: 420,
          padding: '2.5rem',
          background: 'rgba(14,14,14,0.85)',
          border: '1px solid rgba(218,78,36,0.35)',
          borderRadius: 20,
          boxShadow: '0 30px 80px -20px rgba(218,78,36,0.3)',
          backdropFilter: 'blur(20px)',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.5rem' }}>
          <div
            style={{
              width: 44,
              height: 44,
              borderRadius: 12,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              background: 'linear-gradient(135deg, #DA4E24, #F0721D)',
              color: '#fff',
            }}
          >
            <Lock size={20} strokeWidth={2.2} />
          </div>
          <div>
            <h1
              style={{
                fontFamily: 'var(--font-heading)',
                fontSize: '1.4rem',
                fontWeight: 500,
                color: 'var(--color-ink)',
                margin: 0,
                letterSpacing: '-0.02em',
              }}
            >
              Nueva contraseña
            </h1>
            <p
              style={{
                fontFamily: 'var(--font-body)',
                fontSize: '0.85rem',
                color: 'var(--color-text-secondary)',
                margin: '0.25rem 0 0 0',
              }}
            >
              Define la contraseña que usarás desde ahora.
            </p>
          </div>
        </div>

        {sessionReady === false && (
          <div
            style={{
              padding: '1rem',
              borderRadius: 12,
              background: 'rgba(218,78,36,0.08)',
              border: '1px solid rgba(218,78,36,0.3)',
              display: 'flex',
              gap: '0.65rem',
              alignItems: 'flex-start',
              marginBottom: '1rem',
            }}
          >
            <AlertCircle size={16} color="#F0721D" style={{ flexShrink: 0, marginTop: 2 }} />
            <p
              style={{
                fontFamily: 'var(--font-body)',
                fontSize: '0.8rem',
                color: 'var(--color-text-secondary)',
                margin: 0,
                lineHeight: 1.5,
              }}
            >
              El link expiró o ya fue usado. Vuelve al login y solicita un nuevo email de recuperación.
            </p>
          </div>
        )}

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '0.875rem' }}>
          <label style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem' }}>
            <span
              style={{
                fontFamily: 'var(--font-body)',
                fontSize: '0.75rem',
                fontWeight: 600,
                color: 'var(--color-text-secondary)',
                letterSpacing: '0.02em',
              }}
            >
              Nueva contraseña
            </span>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              disabled={status === 'saving' || status === 'success' || sessionReady === false}
              required
              minLength={8}
              autoComplete="new-password"
              placeholder="Mínimo 8 caracteres"
              style={{
                padding: '0.75rem 0.9rem',
                borderRadius: 10,
                background: 'rgba(255,255,255,0.04)',
                border: '1px solid var(--color-border-strong)',
                color: 'var(--color-ink)',
                fontFamily: 'var(--font-body)',
                fontSize: '0.9rem',
                outline: 'none',
              }}
            />
          </label>

          <label style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem' }}>
            <span
              style={{
                fontFamily: 'var(--font-body)',
                fontSize: '0.75rem',
                fontWeight: 600,
                color: 'var(--color-text-secondary)',
                letterSpacing: '0.02em',
              }}
            >
              Confirmar contraseña
            </span>
            <input
              type="password"
              value={confirm}
              onChange={(e) => setConfirm(e.target.value)}
              disabled={status === 'saving' || status === 'success' || sessionReady === false}
              required
              minLength={8}
              autoComplete="new-password"
              style={{
                padding: '0.75rem 0.9rem',
                borderRadius: 10,
                background: 'rgba(255,255,255,0.04)',
                border: '1px solid var(--color-border-strong)',
                color: 'var(--color-ink)',
                fontFamily: 'var(--font-body)',
                fontSize: '0.9rem',
                outline: 'none',
              }}
            />
          </label>

          {errorMsg && (
            <p
              style={{
                fontFamily: 'var(--font-body)',
                fontSize: '0.75rem',
                color: '#F0721D',
                margin: 0,
              }}
            >
              {errorMsg}
            </p>
          )}

          <button
            type="submit"
            disabled={status === 'saving' || status === 'success' || sessionReady === false}
            style={{
              marginTop: '0.5rem',
              padding: '0.9rem',
              borderRadius: 999,
              background: status === 'success' ? '#10B981' : 'var(--color-accent-primary)',
              color: '#fff',
              border: 'none',
              fontFamily: 'var(--font-body)',
              fontSize: '0.85rem',
              fontWeight: 700,
              cursor: status === 'saving' || status === 'success' ? 'default' : 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '0.5rem',
              letterSpacing: '-0.01em',
              opacity: sessionReady === false ? 0.5 : 1,
            }}
          >
            {status === 'saving' && <Loader2 size={16} className="animate-spin" />}
            {status === 'success' && <CheckCircle2 size={16} />}
            {status === 'saving'
              ? 'Guardando...'
              : status === 'success'
                ? 'Contraseña actualizada'
                : 'Guardar contraseña'}
          </button>
        </form>

        <p
          style={{
            marginTop: '1.25rem',
            fontFamily: 'var(--font-body)',
            fontSize: '0.7rem',
            color: 'var(--color-text-muted)',
            textAlign: 'center',
            margin: '1.25rem 0 0 0',
          }}
        >
          ¿Problemas?{' '}
          <a href="mailto:hello@redesignlab.org" style={{ color: 'var(--color-accent-primary)' }}>
            hello@redesignlab.org
          </a>
        </p>
      </div>
    </main>
  )
}
