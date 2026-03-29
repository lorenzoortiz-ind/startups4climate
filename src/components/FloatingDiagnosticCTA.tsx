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
            padding: '1rem 1.5rem',
            backgroundColor: 'var(--color-ink)',
            color: 'var(--color-paper)',
            border: 'none',
            borderRadius: 'var(--radius-full)',
            fontFamily: 'var(--font-body)',
            fontSize: '1rem',
            fontWeight: 700,
            cursor: 'pointer',
            boxShadow: 'var(--shadow-float)',
          }}
          whileHover={{
            backgroundColor: 'var(--color-accent-primary)',
            scale: 1.03,
          }}
          whileTap={{ scale: 0.97 }}
        >
          Realiza tu diagnóstico <ArrowRight size={18} />
        </motion.button>
      )}
    </AnimatePresence>
  )
}
