'use client'

import { useState, useEffect, useRef, useCallback } from 'react'
import { getToolData, saveToolData } from './progress'

/**
 * Hook that loads tool data from localStorage on mount and auto-saves on change with debounce.
 * Replaces the manual useState + useEffect(saveToolData) pattern in every tool component.
 */
export function useToolState<T extends Record<string, unknown>>(
  userId: string,
  toolId: string,
  defaultValue: T
): [T, (updater: T | ((prev: T) => T)) => void] {
  const [state, setState] = useState<T>(() => {
    if (typeof window === 'undefined') return defaultValue
    const saved = getToolData(userId, toolId) as { values?: T } & T
    // Most tools store { values: {...} }, some store direct fields
    if (saved && Object.keys(saved).length > 0) {
      if ('values' in saved && saved.values && typeof saved.values === 'object') {
        return { ...defaultValue, ...saved.values as T }
      }
      return { ...defaultValue, ...saved as T }
    }
    return defaultValue
  })

  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const stateRef = useRef(state)
  stateRef.current = state

  // Debounced save — 500ms after last change
  useEffect(() => {
    if (timerRef.current) clearTimeout(timerRef.current)
    timerRef.current = setTimeout(() => {
      saveToolData(userId, toolId, { values: stateRef.current })
    }, 500)
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current)
    }
  }, [state, userId, toolId])

  // Save immediately on unmount (before navigating away)
  useEffect(() => {
    return () => {
      saveToolData(userId, toolId, { values: stateRef.current })
    }
  }, [userId, toolId])

  const update = useCallback((updater: T | ((prev: T) => T)) => {
    setState(updater)
  }, [])

  return [state, update]
}
