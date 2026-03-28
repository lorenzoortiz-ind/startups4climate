'use client'

import { useEffect, useRef, useState } from 'react'
import { useInView, useReducedMotion } from 'framer-motion'

interface AnimatedCounterProps {
  value: number
  prefix?: string
  suffix?: string
  duration?: number
  style?: React.CSSProperties
}

export default function AnimatedCounter({
  value,
  prefix = '',
  suffix = '',
  duration = 1.5,
  style,
}: AnimatedCounterProps) {
  const ref = useRef<HTMLSpanElement>(null)
  const isInView = useInView(ref, { once: true })
  const prefersReducedMotion = useReducedMotion()
  const [display, setDisplay] = useState(prefersReducedMotion ? value : 0)

  useEffect(() => {
    if (!isInView || prefersReducedMotion) {
      setDisplay(value)
      return
    }

    const start = performance.now()
    const durationMs = duration * 1000

    function tick(now: number) {
      const elapsed = now - start
      const progress = Math.min(elapsed / durationMs, 1)
      // easeOut curve
      const eased = 1 - Math.pow(1 - progress, 3)
      setDisplay(Math.round(eased * value))
      if (progress < 1) {
        requestAnimationFrame(tick)
      }
    }

    requestAnimationFrame(tick)
  }, [isInView, value, duration, prefersReducedMotion])

  return (
    <span ref={ref} style={style}>
      {prefix}{display}{suffix}
    </span>
  )
}
