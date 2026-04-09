'use client'

import { useState, useRef, useCallback } from 'react'
import { Send } from 'lucide-react'

interface ChatInputProps {
  onSend: (message: string) => void
  loading: boolean
  placeholder?: string
}

export default function ChatInput({ onSend, loading, placeholder }: ChatInputProps) {
  const [value, setValue] = useState('')
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  const handleSend = useCallback(() => {
    const trimmed = value.trim()
    if (!trimmed || loading) return
    onSend(trimmed)
    setValue('')
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto'
    }
  }, [value, loading, onSend])

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
      if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault()
        handleSend()
      }
    },
    [handleSend]
  )

  const handleInput = useCallback((e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setValue(e.target.value)
    // Auto-resize
    const el = e.target
    el.style.height = 'auto'
    el.style.height = Math.min(el.scrollHeight, 160) + 'px'
  }, [])

  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'flex-end',
        gap: '0.5rem',
        padding: '0.75rem 1rem',
        background: 'var(--color-chat-input-bg)',
        border: '1px solid var(--color-chat-input-border)',
        borderRadius: 16,
        transition: 'border-color 0.15s ease',
      }}
    >
      <textarea
        ref={textareaRef}
        value={value}
        onChange={handleInput}
        onKeyDown={handleKeyDown}
        disabled={loading}
        placeholder={placeholder || 'Escribe tu mensaje...'}
        rows={1}
        style={{
          flex: 1,
          resize: 'none',
          border: 'none',
          outline: 'none',
          background: 'transparent',
          fontFamily: 'var(--font-body)',
          fontSize: '0.875rem',
          lineHeight: 1.5,
          color: 'var(--color-text-primary)',
          maxHeight: 160,
          overflowY: 'auto',
        }}
      />
      <button
        onClick={handleSend}
        disabled={loading || !value.trim()}
        style={{
          width: 36,
          height: 36,
          borderRadius: 10,
          border: 'none',
          cursor: loading || !value.trim() ? 'default' : 'pointer',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          flexShrink: 0,
          background:
            loading || !value.trim()
              ? 'var(--color-bg-muted)'
              : 'var(--color-accent-primary)',
          color:
            loading || !value.trim()
              ? 'var(--color-text-muted)'
              : '#FFFFFF',
          transition: 'all 0.15s ease',
        }}
        aria-label="Enviar mensaje"
      >
        {loading ? (
          <div
            style={{
              width: 16,
              height: 16,
              borderRadius: '50%',
              border: '2px solid var(--color-text-muted)',
              borderTopColor: 'transparent',
              animation: 'spin 0.8s linear infinite',
            }}
          />
        ) : (
          <Send size={16} />
        )}
      </button>

    </div>
  )
}
