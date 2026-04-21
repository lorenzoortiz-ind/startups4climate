'use client'

import { useState, useEffect, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Bot, X, Minus } from 'lucide-react'
import ChatInterface from './ChatInterface'
import { useAuth } from '@/context/AuthContext'

export default function MentorWidget() {
  const { user } = useAuth()
  const [open, setOpen] = useState(false)
  const [minimized, setMinimized] = useState(false)

  // Determine agent type based on user's startup vertical/stage
  const agentType = user?.stage ? `mentor-${user.stage}` : 'mentor'

  // Build user context from auth + localStorage profile data + completed tool data
  const userContext = useMemo(() => {
    const ctx: Record<string, unknown> = {}
    if (user) {
      ctx.name = user.name
      ctx.email = user.email
      ctx.startup = user.startup
      ctx.stage = user.stage
      ctx.diagnosticScore = user.diagnosticScore
    }
    if (typeof window !== 'undefined' && user) {
      // Profile extras (vertical, region, MRR, certifications, etc.)
      try {
        const extra = localStorage.getItem(`s4c_${user.id}_profile_extra`)
        if (extra) {
          const parsed = JSON.parse(extra)
          Object.assign(ctx, parsed)
        }
      } catch { /* ignore */ }

      // Completed tool data — build rich summaries for each completed tool
      try {
        const progressRaw = localStorage.getItem(`s4c_${user.id}_tool_progress`)
        if (progressRaw) {
          const progress = JSON.parse(progressRaw) as Record<string, {
            completed?: boolean
            data?: Record<string, unknown>
          }>
          const completedTools: string[] = []
          const toolSummaries: Record<string, unknown> = {}

          for (const [toolId, entry] of Object.entries(progress)) {
            if (!entry.completed) continue
            completedTools.push(toolId)
            if (entry.data && Object.keys(entry.data).length > 0) {
              // Extract the most relevant keys — keep to ~400 chars per tool
              const summary: Record<string, unknown> = {}
              const data = entry.data
              // Universal high-signal keys
              const KEY_PICK = [
                'pasion', 'proposito', 'problemaReal',
                'segmentoPrioritario', 'mercado', 'tamanoMercado',
                'hipotesis', 'descripcionMVP', 'mrr', 'mrrActual', 'clientes',
                'clientesPagando', 'npsScore', 'churnRate',
                'vision', 'roadmap', 'riesgos',
                'slides', 'elevatorPitch', 'fondosEnDD',
                'capTable', 'useOfFunds', 'fondosDD',
                'secciones', 'completeness',
                'proyeccion', 'unitEconomics', 'breakeven',
                'tam', 'sam', 'som',
                'canales', 'embudo',
              ]
              for (const k of KEY_PICK) {
                if (k in data) summary[k] = data[k]
              }
              if (Object.keys(summary).length > 0) {
                toolSummaries[toolId] = summary
              }
            }
          }

          if (completedTools.length > 0) {
            ctx.completedTools = completedTools
            ctx.toolData = toolSummaries
          }
        }
      } catch { /* ignore */ }
    }
    return ctx
  }, [user])

  // Close on Escape key
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && open) {
        setOpen(false)
      }
    }
    window.addEventListener('keydown', handleKey)
    return () => window.removeEventListener('keydown', handleKey)
  }, [open])

  return (
    <>
      {/* Chat Panel */}
      <AnimatePresence>
        {open && !minimized && (
          <motion.div
            initial={{ opacity: 0, y: 24, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 24, scale: 0.95 }}
            transition={{ duration: 0.25, ease: 'easeOut' }}
            style={{
              position: 'fixed',
              bottom: 88,
              right: 20,
              width: 400,
              height: 500,
              maxHeight: 'calc(100dvh - 120px)',
              zIndex: 1000,
              borderRadius: 16,
              overflow: 'hidden',
              background: 'var(--color-bg-card)',
              border: '1px solid var(--color-border)',
              boxShadow: '0 8px 32px rgba(0,0,0,0.12), 0 2px 8px rgba(0,0,0,0.08)',
              display: 'flex',
              flexDirection: 'column',
            }}
            className="mentor-widget-panel"
          >
            {/* Panel Header */}
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '0.75rem 1rem',
                borderBottom: '1px solid var(--color-border)',
                background: 'var(--color-bg-card)',
                flexShrink: 0,
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <div
                  style={{
                    width: 30,
                    height: 30,
                    borderRadius: 8,
                    background: 'linear-gradient(135deg, rgba(31,119,246,0.12), rgba(31,119,246,0.04))',
                    border: '1px solid rgba(31,119,246,0.2)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <Bot size={16} color="var(--color-accent-primary)" />
                </div>
                <div>
                  <div
                    style={{
                      fontFamily: 'var(--font-heading)',
                      fontSize: '0.8125rem',
                      fontWeight: 700,
                      color: 'var(--color-text-primary)',
                      lineHeight: 1.2,
                    }}
                  >
                    Mentor AI
                  </div>
                  <div
                    style={{
                      fontFamily: 'var(--font-body)',
                      fontSize: '0.6875rem',
                      color: 'var(--color-text-muted)',
                      lineHeight: 1.3,
                    }}
                  >
                    Tu asistente en toda la plataforma
                  </div>
                </div>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                <button
                  onClick={() => setMinimized(true)}
                  style={{
                    width: 28,
                    height: 28,
                    borderRadius: 6,
                    background: 'transparent',
                    border: 'none',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: 'var(--color-text-muted)',
                    transition: 'background 0.15s, color 0.15s',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = 'var(--color-bg-muted)'
                    e.currentTarget.style.color = 'var(--color-text-primary)'
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = 'transparent'
                    e.currentTarget.style.color = 'var(--color-text-muted)'
                  }}
                  aria-label="Minimizar"
                >
                  <Minus size={14} />
                </button>
                <button
                  onClick={() => setOpen(false)}
                  style={{
                    width: 28,
                    height: 28,
                    borderRadius: 6,
                    background: 'transparent',
                    border: 'none',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: 'var(--color-text-muted)',
                    transition: 'background 0.15s, color 0.15s',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = 'rgba(220,38,38,0.08)'
                    e.currentTarget.style.color = '#DC2626'
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = 'transparent'
                    e.currentTarget.style.color = 'var(--color-text-muted)'
                  }}
                  aria-label="Cerrar"
                >
                  <X size={14} />
                </button>
              </div>
            </div>

            {/* Chat Interface */}
            <div style={{ flex: 1, minHeight: 0 }}>
              <ChatInterface
                agentType={agentType}
                placeholder="Pregunta sobre estrategia, mercado, producto..."
                welcomeMessage="Soy tu mentor AI. Puedo ayudarte con estrategia, mercado, producto, finanzas y más. ¿En qué estás trabajando?"
                userContext={userContext}
              />
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Floating Action Button */}
      <motion.button
        onClick={() => {
          if (minimized) {
            setMinimized(false)
          } else {
            setOpen((o) => !o)
          }
        }}
        style={{
          position: 'fixed',
          bottom: 20,
          right: 20,
          width: 56,
          height: 56,
          borderRadius: '50%',
          background: 'linear-gradient(135deg, #1F77F6, #0069A6)',
          border: 'none',
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1000,
          boxShadow: '0 4px 16px rgba(31,119,246,0.3), 0 2px 4px rgba(0,0,0,0.1)',
          color: 'white',
        }}
        whileHover={{ scale: 1.08 }}
        whileTap={{ scale: 0.95 }}
        aria-label={open ? 'Cerrar mentor AI' : 'Abrir mentor AI'}
      >
        <AnimatePresence mode="wait">
          {open && !minimized ? (
            <motion.div
              key="close"
              initial={{ rotate: -90, opacity: 0 }}
              animate={{ rotate: 0, opacity: 1 }}
              exit={{ rotate: 90, opacity: 0 }}
              transition={{ duration: 0.15 }}
              style={{ display: 'flex' }}
            >
              <X size={24} />
            </motion.div>
          ) : (
            <motion.div
              key="bot"
              initial={{ rotate: 90, opacity: 0 }}
              animate={{ rotate: 0, opacity: 1 }}
              exit={{ rotate: -90, opacity: 0 }}
              transition={{ duration: 0.15 }}
              style={{ display: 'flex' }}
            >
              <Bot size={24} />
            </motion.div>
          )}
        </AnimatePresence>

        {/* Pulse animation when idle */}
        {!open && (
          <span
            style={{
              position: 'absolute',
              inset: -4,
              borderRadius: '50%',
              border: '2px solid rgba(31,119,246,0.4)',
              animation: 'mentorPulse 2.5s ease-in-out infinite',
              pointerEvents: 'none',
            }}
          />
        )}
      </motion.button>

      {/* Styles */}
      <style>{`
        @keyframes mentorPulse {
          0%, 100% { transform: scale(1); opacity: 0.6; }
          50% { transform: scale(1.12); opacity: 0; }
        }

        @media (max-width: 640px) {
          .mentor-widget-panel {
            width: calc(100vw - 16px) !important;
            right: 8px !important;
            bottom: 80px !important;
            height: calc(100dvh - 100px) !important;
            max-height: calc(100dvh - 100px) !important;
          }
        }
      `}</style>
    </>
  )
}
