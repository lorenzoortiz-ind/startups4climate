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
            bottom: '1.5rem',
            right: '1.5rem',
            zIndex: 999,
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.5rem',
            padding: '0.7rem 1.1rem',
            background: 'linear-gradient(180deg, #FF8918 0%, #DA4E24 100%)',
            color: '#fff',
            border: '1px solid rgba(255,255,255,0.12)',
            borderRadius: 999,
            fontFamily: 'var(--font-body)',
            fontSize: '0.85rem',
            fontWeight: 600,
            letterSpacing: '-0.005em',
            cursor: 'pointer',
            boxShadow:
              'inset 0 1px 0 rgba(255,255,255,0.25), 0 12px 30px -8px rgba(218,78,36,0.55), 0 0 0 1px rgba(218,78,36,0.45)',
          }}
          whileHover={{ scale: 1.04 }}
          whileTap={{ scale: 0.96 }}
        >
          Realiza tu diagnóstico <ArrowRight size={16} />
        </motion.button>
      )}
    </AnimatePresence>
  )
}
