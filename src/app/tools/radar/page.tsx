'use client'

import { motion } from 'framer-motion'
import { Radio, Bot, Newspaper } from 'lucide-react'
import ChatInterface from '@/components/ai/ChatInterface'

export default function RadarPage() {
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
              'linear-gradient(135deg, rgba(99,102,241,0.12), rgba(99,102,241,0.04))',
            border: '1px solid rgba(99,102,241,0.2)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <Radio size={18} color="#6366F1" />
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
            RADAR — Ecosistema de innovacion LATAM
          </h1>
          <p
            style={{
              fontFamily: 'var(--font-body)',
              fontSize: '0.75rem',
              color: 'var(--color-text-muted)',
              lineHeight: 1.3,
            }}
          >
            Tendencias, noticias y pulso del ecosistema
          </p>
        </div>
      </motion.div>

      {/* Content: split on desktop, chat-only on mobile */}
      <div
        style={{
          flex: 1,
          minHeight: 0,
          display: 'flex',
        }}
      >
        {/* Left panel: news placeholder (hidden on mobile) */}
        <div
          className="hidden md:flex"
          style={{
            width: '40%',
            flexShrink: 0,
            borderRight: '1px solid var(--color-border)',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '2rem',
            background: 'var(--color-bg-card)',
          }}
        >
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.1, ease: 'easeOut' }}
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: '1rem',
              textAlign: 'center',
            }}
          >
            <div
              style={{
                width: 56,
                height: 56,
                borderRadius: 16,
                background: 'var(--color-bg-muted)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <Newspaper size={28} color="var(--color-text-muted)" />
            </div>
            <div>
              <p
                style={{
                  fontFamily: 'var(--font-heading)',
                  fontSize: '0.9375rem',
                  fontWeight: 600,
                  color: 'var(--color-text-secondary)',
                  marginBottom: '0.5rem',
                }}
              >
                Proximamente
              </p>
              <p
                style={{
                  fontFamily: 'var(--font-body)',
                  fontSize: '0.8125rem',
                  color: 'var(--color-text-muted)',
                  lineHeight: 1.5,
                  maxWidth: 280,
                }}
              >
                Feed de noticias del ecosistema de innovacion en Latinoamerica,
                curado y actualizado automaticamente.
              </p>
            </div>
          </motion.div>
        </div>

        {/* Right panel: chat */}
        <div style={{ flex: 1, minHeight: 0 }}>
          <ChatInterface
            agentType="radar"
            placeholder="Pregunta sobre el ecosistema, tendencias, fondos..."
            welcomeMessage="Soy tu radar del ecosistema. Puedo informarte sobre tendencias, noticias, fondos de inversion y programas relevantes en LATAM. ¿Que quieres explorar?"
          />
        </div>
      </div>
    </div>
  )
}
