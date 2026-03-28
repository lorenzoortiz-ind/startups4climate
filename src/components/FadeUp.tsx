'use client'

import { type ReactNode } from 'react'
import { motion, useReducedMotion } from 'framer-motion'

interface FadeUpProps {
  children: ReactNode
  delay?: number
  duration?: number
  y?: number
  className?: string
  style?: React.CSSProperties
}

export default function FadeUp({
  children,
  delay = 0,
  duration = 0.5,
  y = 24,
  className,
  style,
}: FadeUpProps) {
  const prefersReducedMotion = useReducedMotion()

  return (
    <motion.div
      initial={prefersReducedMotion ? false : { opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-60px' }}
      transition={prefersReducedMotion ? { duration: 0 } : { duration, delay, ease: 'easeOut' }}
      className={className}
      style={style}
    >
      {children}
    </motion.div>
  )
}
