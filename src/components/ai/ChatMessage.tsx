'use client'

import { motion } from 'framer-motion'
import { Bot, User } from 'lucide-react'

interface ChatMessageProps {
  role: 'user' | 'assistant'
  content: string
  timestamp?: string
}

/**
 * Lightweight markdown renderer for assistant messages.
 * Handles: **bold**, *italic*, bullet lists (- / *), numbered lists,
 * and blank-line paragraph breaks. No external deps needed.
 */
function renderMarkdown(text: string): React.ReactNode[] {
  const lines = text.split('\n')
  const nodes: React.ReactNode[] = []
  let key = 0

  const inlineStyle = (line: string): React.ReactNode => {
    // **bold** and *italic* inline
    const parts = line.split(/(\*\*[^*]+\*\*|\*[^*]+\*)/g)
    return parts.map((part, i) => {
      if (part.startsWith('**') && part.endsWith('**')) {
        return <strong key={i} style={{ fontWeight: 700 }}>{part.slice(2, -2)}</strong>
      }
      if (part.startsWith('*') && part.endsWith('*') && part.length > 2) {
        return <em key={i}>{part.slice(1, -1)}</em>
      }
      return part
    })
  }

  let i = 0
  while (i < lines.length) {
    const line = lines[i]

    // ### / ## / # Headers → render as bold paragraph (no jumbo text)
    if (/^#{1,3}\s/.test(line)) {
      const text = line.replace(/^#{1,3}\s+/, '')
      nodes.push(
        <p key={key++} style={{ margin: '0.25rem 0 0.125rem', lineHeight: 1.5 }}>
          <strong>{inlineStyle(text)}</strong>
        </p>
      )
      i++
      continue
    }

    // --- / === horizontal rules → small visual divider
    if (/^[-=]{3,}$/.test(line.trim())) {
      nodes.push(
        <hr key={key++} style={{ border: 'none', borderTop: '1px solid var(--color-border)', margin: '0.5rem 0' }} />
      )
      i++
      continue
    }

    // Bullet list item (- or * at start, but not **)
    if (/^[\-\*]\s/.test(line) && !line.startsWith('**')) {
      const items: React.ReactNode[] = []
      while (i < lines.length && /^[\-\*]\s/.test(lines[i]) && !lines[i].startsWith('**')) {
        items.push(
          <li key={i} style={{ marginBottom: '0.2rem' }}>
            {inlineStyle(lines[i].replace(/^[\-\*]\s/, ''))}
          </li>
        )
        i++
      }
      nodes.push(
        <ul key={key++} style={{ paddingLeft: '1.25rem', margin: '0.25rem 0', listStyle: 'disc' }}>
          {items}
        </ul>
      )
      continue
    }

    // Numbered list item
    if (/^\d+\.\s/.test(line)) {
      const items: React.ReactNode[] = []
      while (i < lines.length && /^\d+\.\s/.test(lines[i])) {
        items.push(
          <li key={i} style={{ marginBottom: '0.2rem' }}>
            {inlineStyle(lines[i].replace(/^\d+\.\s/, ''))}
          </li>
        )
        i++
      }
      nodes.push(
        <ol key={key++} style={{ paddingLeft: '1.25rem', margin: '0.25rem 0' }}>
          {items}
        </ol>
      )
      continue
    }

    // Empty line → small gap
    if (line.trim() === '') {
      nodes.push(<div key={key++} style={{ height: '0.4rem' }} />)
      i++
      continue
    }

    // Normal paragraph line
    nodes.push(
      <p key={key++} style={{ margin: 0, lineHeight: 1.6 }}>
        {inlineStyle(line)}
      </p>
    )
    i++
  }

  return nodes
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
        {isUser ? <User size={16} /> : <Bot size={16} />}
      </div>

      {/* Bubble */}
      <div
        style={{
          maxWidth: '78%',
          padding: '0.75rem 1rem',
          borderRadius: 14,
          borderTopLeftRadius: isUser ? 14 : 4,
          borderTopRightRadius: isUser ? 4 : 14,
          background: isUser
            ? 'var(--color-chat-user-bg)'
            : 'var(--color-chat-assistant-bg)',
          border: `1px solid ${isUser ? 'rgba(31,119,246,0.15)' : 'var(--color-border)'}`,
        }}
      >
        <div
          style={{
            fontFamily: 'var(--font-body)',
            fontSize: '0.875rem',
            color: 'var(--color-text-primary)',
            wordBreak: 'break-word',
          }}
        >
          {isUser ? content : renderMarkdown(content)}
        </div>
        {timestamp && (
          <div
            style={{
              fontFamily: 'var(--font-body)',
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
