'use client'

import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ArrowRight, X, Sparkles, Bot, Target } from 'lucide-react'
import { useAuth } from '@/context/AuthContext'

const STEPS = [
  {
    icon: Target,
    title: 'Empieza con el diagnóstico',
    body: 'En 5 minutos obtienes tu readiness score y sabes dónde enfocar. Es el punto de partida recomendado.',
    accent: '#F0721D',
  },
  {
    icon: Sparkles,
    title: '30 herramientas interactivas',
    body: 'Lean Canvas, Unit Economics, Pitch Deck, Cap Table y más. Todo guiado, con outputs descargables.',
    accent: '#5BB4FF',
  },
  {
    icon: Bot,
    title: 'Mentor AI cuando lo necesites',
    body: 'Pregunta lo que sea sobre tu startup — mercado, estrategia, fundraising. Adaptado a tu vertical.',
    accent: '#F0721D',
  },
]

function storageKey(userId: string) {
  return `s4c_${userId}_onboarded`
}

export default function OnboardingTour() {
  const { appUser } = useAuth()
  const [step, setStep] = useState(0)
  const [open, setOpen] = useState(false)

  useEffect(() => {
    if (!appUser || appUser.role !== 'founder') return
    try {
      const seen = localStorage.getItem(storageKey(appUser.id))
      if (!seen) {
        // Small delay to let page settle
        const t = setTimeout(() => setOpen(true), 600)
        return () => clearTimeout(t)
      }
    } catch {}
  }, [appUser])

  function finish() {
    if (appUser) {
      try { localStorage.setItem(storageKey(appUser.id), '1') } catch {}
    }
    setOpen(false)
  }

  function next() {
    if (step < STEPS.length - 1) setStep(step + 1)
    else finish()
  }

  if (!open || !appUser) return null
  const current = STEPS[step]
  const Icon = current.icon

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.25 }}
          style={{
            position: 'fixed',
            inset: 0,
            zIndex: 'var(--z-modal, 100)',
            background: 'rgba(0, 0, 0, 0.72)',
            backdropFilter: 'blur(6px)',
            WebkitBackdropFilter: 'blur(6px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '1.25rem',
          }}
          onClick={(e) => { if (e.target === e.currentTarget) finish() }}
        >
          <motion.div
            key={step}
            initial={{ opacity: 0, y: 16, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -8, scale: 0.98 }}
            transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
            className="glass-card"
            style={{
              width: '100%',
              maxWidth: 460,
              padding: '2rem 1.75rem 1.5rem',
              borderRadius: 20,
              position: 'relative',
              border: '1px solid rgba(255,255,255,0.08)',
              boxShadow: '0 24px 48px -12px rgba(0,0,0,0.5)',
            }}
          >
            <button
              onClick={finish}
              aria-label="Cerrar"
              style={{
                position: 'absolute',
                top: 14,
                right: 14,
                background: 'transparent',
                border: 'none',
                color: 'rgba(255,255,255,0.45)',
                cursor: 'pointer',
                padding: 6,
                borderRadius: 8,
                display: 'inline-flex',
              }}
            >
              <X size={16} />
            </button>

            <div style={{
              width: 52,
              height: 52,
              borderRadius: 14,
              background: `${current.accent}18`,
              border: `1px solid ${current.accent}50`,
              color: current.accent,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              marginBottom: '1.25rem',
            }}>
              <Icon size={22} strokeWidth={2} />
            </div>

            <h2 style={{
              fontFamily: 'var(--font-heading)',
              fontSize: '1.35rem',
              fontWeight: 500,
              letterSpacing: '-0.02em',
              lineHeight: 1.2,
              color: 'var(--color-ink)',
              margin: '0 0 .625rem',
            }}>
              {current.title}
            </h2>
            <p style={{
              fontFamily: 'var(--font-body)',
              fontSize: '.95rem',
              lineHeight: 1.55,
              color: 'var(--color-text-secondary)',
              margin: '0 0 1.75rem',
            }}>
              {current.body}
            </p>

            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '1rem' }}>
              <div style={{ display: 'flex', gap: 6 }}>
                {STEPS.map((_, i) => (
                  <span
                    key={i}
                    style={{
                      width: i === step ? 18 : 6,
                      height: 6,
                      borderRadius: 3,
                      background: i === step ? current.accent : 'rgba(255,255,255,0.2)',
                      transition: 'all .25s ease',
                    }}
                  />
                ))}
              </div>
              <div style={{ display: 'flex', gap: '.5rem' }}>
                <button
                  onClick={finish}
                  style={{
                    padding: '.55rem .9rem',
                    background: 'transparent',
                    border: 'none',
                    color: 'rgba(255,255,255,0.55)',
                    fontFamily: 'var(--font-body)',
                    fontSize: '.8125rem',
                    fontWeight: 500,
                    cursor: 'pointer',
                  }}
                >
                  Saltar
                </button>
                <button
                  onClick={next}
                  style={{
                    padding: '.625rem 1.15rem',
                    borderRadius: 10,
                    border: `1px solid ${current.accent}80`,
                    background: current.accent,
                    color: '#fff',
                    fontFamily: 'var(--font-body)',
                    fontSize: '.875rem',
                    fontWeight: 600,
                    cursor: 'pointer',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '.35rem',
                  }}
                >
                  {step < STEPS.length - 1 ? 'Siguiente' : 'Empezar'}
                  <ArrowRight size={14} strokeWidth={2.5} />
                </button>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
