'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { ArrowLeft, Check, Copy, Globe2, Lock } from 'lucide-react'
import { supabase } from '@/lib/supabase'
import { useAuth } from '@/context/AuthContext'

type ShareState = {
  is_public: boolean
  token: string | null
  startup_name: string | null
}

export default function CompartirPassportPage() {
  const { appUser } = useAuth()
  const [state, setState] = useState<ShareState | null>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [copied, setCopied] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!appUser) return
    ;(async () => {
      const { data, error: err } = await supabase
        .from('startups')
        .select('name, is_public, public_share_token')
        .eq('founder_id', appUser.id)
        .maybeSingle()
      if (err) {
        setError('No pudimos cargar tu startup.')
      } else if (!data) {
        setError('No tienes un startup aún. Ve a tu perfil para crearlo.')
      } else {
        setState({
          is_public: !!data.is_public,
          token: data.public_share_token,
          startup_name: data.name,
        })
      }
      setLoading(false)
    })()
  }, [appUser])

  async function toggle(enable: boolean) {
    setSaving(true)
    setError(null)
    const { data, error: err } = await supabase.rpc('toggle_public_passport', { p_enable: enable })
    const payload = data as { ok: boolean; is_public?: boolean; token?: string; error?: string } | null
    if (err || !payload?.ok) {
      setError('No pudimos actualizar. Intenta de nuevo.')
    } else {
      setState((s) => s ? { ...s, is_public: !!payload.is_public, token: payload.token || s.token } : s)
    }
    setSaving(false)
  }

  const shareUrl = state?.token
    ? `${typeof window !== 'undefined' ? window.location.origin : 'https://startups4climate.org'}/passport/${state.token}`
    : ''

  async function copyLink() {
    if (!shareUrl) return
    await navigator.clipboard.writeText(shareUrl)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <main id="main-content" style={{ minHeight: '100dvh', padding: 'clamp(2rem,5vw,3.5rem) clamp(1.25rem,4vw,2.5rem)' }}>
      <div style={{ maxWidth: 720, margin: '0 auto' }}>
        <Link
          href="/tools"
          style={{ display: 'inline-flex', alignItems: 'center', gap: '.4rem', fontSize: '.875rem', color: 'rgba(255,255,255,0.55)', textDecoration: 'none', fontFamily: 'var(--font-body)', marginBottom: '2rem' }}
        >
          <ArrowLeft size={14} /> Volver a la plataforma
        </Link>

        <span className="pill-ember" style={{ marginBottom: '1rem' }}>
          <span className="dot" /> Startup Passport
        </span>

        <h1 style={{ fontFamily: 'var(--font-heading)', fontSize: 'clamp(1.9rem,4vw,2.6rem)', fontWeight: 500, letterSpacing: '-0.03em', lineHeight: 1.1, margin: '.5rem 0 .75rem', color: 'var(--color-ink)' }}>
          Comparte tu Passport con inversores
        </h1>
        <p style={{ fontFamily: 'var(--font-body)', fontSize: '1rem', lineHeight: 1.55, color: 'var(--color-text-secondary)', maxWidth: 560, margin: '0 0 2.5rem' }}>
          Genera un link público y de solo lectura con los datos clave de tu startup. Compártelo en correos, aplicaciones a fondos o LinkedIn.
        </p>

        {loading ? (
          <div className="glass-card" style={{ padding: '2rem', borderRadius: 16, textAlign: 'center', color: 'rgba(255,255,255,0.55)', fontSize: '.875rem' }}>
            Cargando...
          </div>
        ) : error ? (
          <div className="glass-card" style={{ padding: '1.5rem', borderRadius: 16, border: '1px solid rgba(218,78,36,0.3)', color: '#F0721D', fontSize: '.9rem' }}>
            {error}
          </div>
        ) : state && (
          <>
            <div className="glass-card" style={{ padding: '1.75rem', borderRadius: 18, marginBottom: '1rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '1rem', flexWrap: 'wrap' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                  <div style={{
                    width: 44, height: 44, borderRadius: 12,
                    background: state.is_public ? 'rgba(31,119,246,0.15)' : 'rgba(255,255,255,0.04)',
                    border: state.is_public ? '1px solid rgba(31,119,246,0.35)' : '1px solid rgba(255,255,255,0.08)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    color: state.is_public ? '#5BB4FF' : 'rgba(255,255,255,0.4)',
                  }}>
                    {state.is_public ? <Globe2 size={20} /> : <Lock size={20} />}
                  </div>
                  <div>
                    <div style={{ fontFamily: 'var(--font-heading)', fontSize: '1.05rem', fontWeight: 500, color: 'var(--color-ink)', letterSpacing: '-0.01em' }}>
                      {state.is_public ? 'Passport público' : 'Passport privado'}
                    </div>
                    <div style={{ fontFamily: 'var(--font-body)', fontSize: '.8125rem', color: 'rgba(255,255,255,0.55)', marginTop: 2 }}>
                      {state.is_public
                        ? 'Cualquiera con el link puede verlo'
                        : 'Sólo tú y tu organización pueden verlo'}
                    </div>
                  </div>
                </div>
                <button
                  onClick={() => toggle(!state.is_public)}
                  disabled={saving}
                  style={{
                    padding: '.625rem 1.25rem',
                    borderRadius: 10,
                    border: state.is_public ? '1px solid rgba(255,255,255,0.12)' : '1px solid rgba(218,78,36,0.5)',
                    background: state.is_public ? 'rgba(255,255,255,0.04)' : '#DA4E24',
                    color: state.is_public ? 'var(--color-text-primary)' : '#fff',
                    fontFamily: 'var(--font-body)',
                    fontSize: '.875rem',
                    fontWeight: 600,
                    cursor: saving ? 'wait' : 'pointer',
                    opacity: saving ? 0.6 : 1,
                    transition: 'all 0.2s ease',
                  }}
                >
                  {saving ? 'Guardando...' : state.is_public ? 'Hacer privado' : 'Activar enlace público'}
                </button>
              </div>
            </div>

            {state.is_public && state.token && (
              <div className="glass-card" style={{ padding: '1.25rem', borderRadius: 14, display: 'flex', alignItems: 'center', gap: '.75rem', flexWrap: 'wrap', border: '1px solid rgba(31,119,246,0.25)' }}>
                <div style={{ flex: 1, minWidth: 240, overflow: 'hidden' }}>
                  <div style={{ fontFamily: 'var(--font-body)', fontSize: '.7rem', textTransform: 'uppercase', letterSpacing: '.1em', color: 'rgba(255,255,255,0.45)', marginBottom: 4 }}>
                    Tu link público
                  </div>
                  <div style={{ fontFamily: 'var(--font-mono, monospace)', fontSize: '.8125rem', color: 'var(--color-text-primary)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                    {shareUrl}
                  </div>
                </div>
                <div style={{ display: 'flex', gap: '.5rem' }}>
                  <button
                    onClick={copyLink}
                    style={{
                      padding: '.5rem .9rem',
                      borderRadius: 8,
                      border: '1px solid rgba(255,255,255,0.12)',
                      background: copied ? 'rgba(91,180,255,0.15)' : 'rgba(255,255,255,0.04)',
                      color: copied ? '#5BB4FF' : 'var(--color-text-primary)',
                      fontFamily: 'var(--font-body)',
                      fontSize: '.8125rem',
                      fontWeight: 500,
                      cursor: 'pointer',
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '.4rem',
                      transition: 'all .2s ease',
                    }}
                  >
                    {copied ? <><Check size={14} /> Copiado</> : <><Copy size={14} /> Copiar</>}
                  </button>
                  <a
                    href={shareUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{
                      padding: '.5rem .9rem',
                      borderRadius: 8,
                      border: '1px solid rgba(218,78,36,0.3)',
                      background: 'rgba(218,78,36,0.08)',
                      color: '#F0721D',
                      fontFamily: 'var(--font-body)',
                      fontSize: '.8125rem',
                      fontWeight: 500,
                      textDecoration: 'none',
                    }}
                  >
                    Ver →
                  </a>
                </div>
              </div>
            )}

            <div style={{ marginTop: '2rem', padding: '1rem 1.25rem', borderRadius: 10, background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.06)' }}>
              <p style={{ fontFamily: 'var(--font-body)', fontSize: '.8125rem', lineHeight: 1.55, color: 'rgba(255,255,255,0.6)', margin: 0 }}>
                <strong style={{ color: 'rgba(255,255,255,0.85)' }}>Qué se muestra:</strong> nombre, descripción, vertical, país, etapa, equipo, score, MVP y tracción.{' '}
                <strong style={{ color: 'rgba(255,255,255,0.85)' }}>Qué no:</strong> email, teléfono, ni datos financieros internos (CAC, LTV, revenue).
              </p>
            </div>
          </>
        )}
      </div>
    </main>
  )
}
