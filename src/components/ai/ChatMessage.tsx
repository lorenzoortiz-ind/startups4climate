'use client'

import { motion } from 'framer-motion'
import { Bot, User } from 'lucide-react'

interface ChatMessageProps {
  role: 'user' | 'assistant'
  content: string
  timestamp?: string
}

export default function ChatMessage({ role, content, timestamp }: ChatMessageProps) {
  const isUser = role === 'user'

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25, ease: 'easeOut' }}
      style={{
        display: 'flex',
        gap: '0.75rem',
        flexDirection: isUser ? 'row-reverse' : 'row',
        alignItems: 'flex-start',
        maxWidth: '100%',
      }}
    >
      {/* Avatar */}
      <div
        style={{
          width: 32,
          height: 32,
          borderRadius: '50%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          flexShrink: 0,
          background: isUser
            ? 'var(--color-accent-primary)'
            : 'var(--color-bg-muted)',
          color: isUser ? '#FFFFFF' : 'var(--color-text-secondary)',
        }}
      >
        {isUser ? (
          <User size={16} />
        ) : (
          <Bot size={16} />
        )}
      </div>

      {/* Bubble */}
      <div
        style={{
          maxWidth: '75%',
          padding: '0.75rem 1rem',
          borderRadius: 14,
          borderTopLeftRadius: isUser ? 14 : 4,
          borderTopRightRadius: isUser ? 4 : 14,
          background: isUser
            ? 'var(--color-chat-user-bg)'
            : 'var(--color-chat-assistant-bg)',
          border: `1px solid ${isUser ? 'rgba(13,148,136,0.15)' : 'var(--color-border)'}`,
        }}
      >
        <div
          style={{
            fontFamily: 'var(--font-body)',
            fontSize: '0.875rem',
            lineHeight: 1.6,
            color: 'var(--color-text-primary)',
            whiteSpace: 'pre-wrap',
            wordBreak: 'break-word',
          }}
        >
          {content}
        </div>
        {timestamp && (
          <div
            style={{
              fontFamily: 'var(--font-mono)',
              fontSize: '0.625rem',
              color: 'var(--color-text-muted)',
              marginTop: '0.375rem',
              textAlign: isUser ? 'right' : 'left',
            }}
          >
            {timestamp}
          </div>
        )}
      </div>
    </motion.div>
  )
}
