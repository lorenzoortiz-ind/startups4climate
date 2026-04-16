'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ArrowRight } from 'lucide-react'
import { useAuth } from '@/context/AuthContext'

export default function FloatingDiagnosticCTA() {
  const { user } = useAuth()
  const [visible, setVisible] = useState(false)
  const [diagnosticoVisible, setDiagnosticoVisible] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      setVisible(window.scrollY > 400)
    }
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  useEffect(() => {
    const el = document.getElementById('diagnostico')
    if (!el) return

    const observer = new IntersectionObserver(
      ([entry]) => {
        setDiagnosticoVisible(entry.isIntersecting)
      },
      { threshold: 0.1 }
    )

    observer.observe(el)
    return () => observer.disconnect()
  }, [])

  // Don't render for logged-in users
  if (user) return null

  const show = visible && !diagnosticoVisible

  const handleClick = () => {
    const el = document.getElementById('diagnostico')
    if (el) el.scrollIntoView({ behavior: 'smooth' })
  }

  return (
    <AnimatePresence>
      {show && (
        <motion.button
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 40 }}
          transition={{ type: 'spring', damping: 20, stiffness: 200 }}
          onClick={handleClick}
          style={{
            position: 'fixed',
            bottom: '2rem',
            right: '2rem',
            zIndex: 999,
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.5rem',
            padding: '0.875rem 1.5rem',
            backgroundColor: 'var(--color-accent-primary)',
            color: '#fff',
            border: 'none',
            borderRadius: 12,
            fontFamily: 'var(--font-body)',
            fontSize: '0.75rem',
            fontWeight: 600,
            cursor: 'pointer',
            boxShadow: '0 8px 24px rgba(255,107,74,0.30), 0 1px 2px rgba(0,0,0,0.4)',
          }}
          whileHover={{
            backgroundColor: 'var(--color-accent-hover)',
            scale: 1.02,
          }}
          whileTap={{ scale: 0.97 }}
        >
          Realiza tu diagnóstico <ArrowRight size={18} />
        </motion.button>
      )}
    </AnimatePresence>
  )
}
