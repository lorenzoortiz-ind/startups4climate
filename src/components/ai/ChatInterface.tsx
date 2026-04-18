'use client'

import { useState, useRef, useEffect, useCallback } from 'react'
import { motion } from 'framer-motion'
import { Bot } from 'lucide-react'
import ChatMessage from './ChatMessage'
import ChatInput from './ChatInput'

interface Message {
  id: string
  role: 'user' | 'assistant'
  content: string
  timestamp: string
}

interface ChatInterfaceProps {
  agentType: string
  placeholder?: string
  welcomeMessage?: string
  userContext?: Record<string, unknown>
}

function formatTime(): string {
  return new Date().toLocaleTimeString('es', {
    hour: '2-digit',
    minute: '2-digit',
  })
}

export default function ChatInterface({
  agentType,
  placeholder,
  welcomeMessage,
  userContext,
}: ChatInterfaceProps) {
  const [messages, setMessages] = useState<Message[]>([])
  const [loading, setLoading] = useState(false)
  const [conversationId, setConversationId] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)
  const scrollRef = useRef<HTMLDivElement>(null)

  // Scroll to bottom on new message
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight
    }
  }, [messages])

  const handleSend = useCallback(
    async (content: string) => {
      setError(null)

      const userMsg: Message = {
        id: crypto.randomUUID(),
        role: 'user',
        content,
        timestamp: formatTime(),
      }

      setMessages((prev) => [...prev, userMsg])
      setLoading(true)

      // Pre-create the assistant message so streamed deltas can append into it.
      const assistantId = crypto.randomUUID()
      let appendedAssistant = false

      try {
        const res = await fetch('/api/ai/chat', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            message: content,
            agentType,
            conversationId,
            userContext: userContext || {},
            stream: true,
          }),
        })

        if (!res.ok) {
          // Server returned JSON error (e.g. rate limit) — parse and bail.
          const data = await res.json().catch(() => ({}))
          setError(data.error || 'Error al enviar el mensaje.')
          setLoading(false)
          return
        }

        const reader = res.body?.getReader()
        if (!reader) {
          setError('Tu navegador no soporta streaming. Recarga e intenta de nuevo.')
          setLoading(false)
          return
        }

        const decoder = new TextDecoder()
        let buffer = ''

        while (true) {
          const { done, value } = await reader.read()
          if (done) break

          buffer += decoder.decode(value, { stream: true })
          // SSE frames are separated by a blank line
          const frames = buffer.split('\n\n')
          buffer = frames.pop() || ''

          for (const frame of frames) {
            const line = frame.trim()
            if (!line.startsWith('data:')) continue
            const payload = line.slice(5).trim()
            if (!payload) continue
            try {
              const evt = JSON.parse(payload) as {
                delta?: string
                done?: boolean
                conversationId?: string
              }

              if (evt.delta) {
                if (!appendedAssistant) {
                  appendedAssistant = true
                  setMessages((prev) => [
                    ...prev,
                    {
                      id: assistantId,
                      role: 'assistant',
                      content: evt.delta!,
                      timestamp: formatTime(),
                    },
                  ])
                  // Hide the typing indicator as soon as first token arrives
                  setLoading(false)
                } else {
                  setMessages((prev) =>
                    prev.map((m) =>
                      m.id === assistantId
                        ? { ...m, content: m.content + evt.delta }
                        : m
                    )
                  )
                }
              }

              if (evt.done && evt.conversationId && !conversationId) {
                setConversationId(evt.conversationId)
              }
            } catch {
              // Ignore malformed frames
            }
          }
        }
      } catch {
        setError('Error de conexión. Verifica tu internet e intenta de nuevo.')
      } finally {
        setLoading(false)
      }
    },
    [agentType, conversationId, userContext]
  )

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        height: '100%',
        minHeight: 0,
      }}
    >
      {/* Messages area */}
      <div
        ref={scrollRef}
        style={{
          flex: 1,
          overflowY: 'auto',
          padding: '1.5rem',
          display: 'flex',
          flexDirection: 'column',
          gap: '1rem',
        }}
      >
        {/* Welcome message */}
        {messages.length === 0 && welcomeMessage && (
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, ease: 'easeOut' }}
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              textAlign: 'center',
              padding: '3rem 1.5rem',
              gap: '1rem',
            }}
          >
            <div
              style={{
                width: 48,
                height: 48,
                borderRadius: 14,
                background: 'linear-gradient(135deg, rgba(13,148,136,0.1), rgba(13,148,136,0.05))',
                border: '1px solid rgba(13,148,136,0.15)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <Bot size={24} color="var(--color-accent-primary)" />
            </div>
            <p
              style={{
                fontFamily: 'var(--font-body)',
                fontSize: '0.9375rem',
                lineHeight: 1.6,
                color: 'var(--color-text-secondary)',
                maxWidth: 440,
              }}
            >
              {welcomeMessage}
            </p>
          </motion.div>
        )}

        {messages.map((msg) => (
          <ChatMessage
            key={msg.id}
            role={msg.role}
            content={msg.content}
            timestamp={msg.timestamp}
          />
        ))}

        {/* Loading indicator */}
        {loading && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.75rem',
            }}
          >
            <div
              style={{
                width: 32,
                height: 32,
                borderRadius: '50%',
                background: 'var(--color-bg-muted)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0,
              }}
            >
              <Bot size={16} color="var(--color-text-secondary)" />
            </div>
            <div
              style={{
                display: 'flex',
                gap: '0.25rem',
                padding: '0.75rem 1rem',
                borderRadius: 14,
                borderTopLeftRadius: 4,
                background: 'var(--color-chat-assistant-bg)',
                border: '1px solid var(--color-border)',
              }}
            >
              {[0, 1, 2].map((i) => (
                <div
                  key={i}
                  style={{
                    width: 6,
                    height: 6,
                    borderRadius: '50%',
                    background: 'var(--color-text-muted)',
                    animation: `pulse 1.2s ease-in-out ${i * 0.2}s infinite`,
                  }}
                />
              ))}
            </div>
          </motion.div>
        )}

        {/* Error message */}
        {error && (
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            style={{
              padding: '0.75rem 1rem',
              borderRadius: 10,
              background: 'rgba(220,38,38,0.06)',
              border: '1px solid rgba(220,38,38,0.15)',
              fontFamily: 'var(--font-body)',
              fontSize: '0.8125rem',
              color: 'var(--color-error)',
            }}
          >
            {error}
          </motion.div>
        )}
      </div>

      {/* Input area */}
      <div
        style={{
          padding: '0.75rem 1.5rem 1.5rem',
          borderTop: '1px solid var(--color-border)',
          background: 'var(--color-bg-card)',
        }}
      >
        <ChatInput
          onSend={handleSend}
          loading={loading}
          placeholder={placeholder}
        />
      </div>

      <style>{`
        @keyframes pulse {
          0%, 80%, 100% { opacity: 0.3; transform: scale(0.8); }
          40% { opacity: 1; transform: scale(1); }
        }
      `}</style>
    </div>
  )
}
