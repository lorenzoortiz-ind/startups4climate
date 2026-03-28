'use client'

import { motion } from 'framer-motion'
import { Bot } from 'lucide-react'
import ChatInterface from '@/components/ai/ChatInterface'

export default function MentorPage() {
  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        height: '100vh',
        background: 'var(--color-bg-primary)',
      }}
    >
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, ease: 'easeOut' }}
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '0.75rem',
          padding: '1rem 1.5rem',
          borderBottom: '1px solid var(--color-border)',
          background: 'var(--color-bg-card)',
          flexShrink: 0,
        }}
      >
        <div
          style={{
            width: 36,
            height: 36,
            borderRadius: 10,
            background:
              'linear-gradient(135deg, rgba(5,150,105,0.12), rgba(5,150,105,0.04))',
            border: '1px solid rgba(5,150,105,0.2)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <Bot size={18} color="var(--color-accent-primary)" />
        </div>
        <div>
          <h1
            style={{
              fontFamily: 'var(--font-heading)',
              fontSize: '1rem',
              fontWeight: 700,
              color: 'var(--color-text-primary)',
              lineHeight: 1.2,
            }}
          >
            Mentor AI
          </h1>
          <p
            style={{
              fontFamily: 'var(--font-body)',
              fontSize: '0.75rem',
              color: 'var(--color-text-muted)',
              lineHeight: 1.3,
            }}
          >
            Estrategia, mercado, producto, finanzas y mas
          </p>
        </div>
      </motion.div>

      {/* Chat */}
      <div style={{ flex: 1, minHeight: 0 }}>
        <ChatInterface
          agentType="mentor"
          placeholder="Pregunta sobre estrategia, mercado, producto..."
          welcomeMessage="Soy tu mentor AI. Puedo ayudarte con estrategia, mercado, producto, finanzas y mas. ¿En que estas trabajando?"
        />
      </div>
    </div>
  )
}
