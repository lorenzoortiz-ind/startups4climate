'use client'

import { motion } from 'framer-motion'
import { Bot, ArrowRight } from 'lucide-react'
import Link from 'next/link'

export default function MentorPage() {
  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '100vh',
        background: 'var(--color-bg-primary)',
        padding: '2rem',
      }}
    >
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: 'easeOut' }}
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          textAlign: 'center',
          maxWidth: 480,
          gap: '1.5rem',
        }}
      >
        <div
          style={{
            width: 64,
            height: 64,
            borderRadius: 18,
            background: 'linear-gradient(135deg, rgba(31,119,246,0.12), rgba(31,119,246,0.04))',
            border: '1px solid rgba(31,119,246,0.2)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <Bot size={32} color="var(--color-accent-primary)" />
        </div>

        <h1
          style={{
            fontFamily: 'var(--font-heading)',
            fontSize: '1.5rem',
            fontWeight: 700,
            color: 'var(--color-text-primary)',
            lineHeight: 1.3,
          }}
        >
          El Mentor AI te acompa&ntilde;a en toda la plataforma
        </h1>

        <p
          style={{
            fontFamily: 'var(--font-body)',
            fontSize: '1rem',
            lineHeight: 1.6,
            color: 'var(--color-text-secondary)',
          }}
        >
          Usa el bot&oacute;n{' '}
          <span
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: 24,
              height: 24,
              borderRadius: '50%',
              background: 'linear-gradient(135deg, #1F77F6, #0069A6)',
              verticalAlign: 'middle',
              margin: '0 0.25rem',
            }}
          >
            <Bot size={14} color="white" />
          </span>{' '}
          en la esquina inferior derecha para iniciar una conversaci&oacute;n.
          Tu mentor est&aacute; disponible en cualquier herramienta de la plataforma.
        </p>

        <Link
          href="/tools"
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.5rem',
            padding: '0.75rem 1.5rem',
            borderRadius: 10,
            background: 'var(--color-accent-primary)',
            color: 'white',
            fontFamily: 'var(--font-body)',
            fontSize: '0.875rem',
            fontWeight: 600,
            textDecoration: 'none',
            transition: 'opacity 0.15s',
          }}
          onMouseEnter={(e) => (e.currentTarget.style.opacity = '0.9')}
          onMouseLeave={(e) => (e.currentTarget.style.opacity = '1')}
        >
          Ir al Dashboard
          <ArrowRight size={16} />
        </Link>
      </motion.div>
    </div>
  )
}
