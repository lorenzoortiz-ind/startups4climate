'use client'

import { useState, useEffect, useRef, useCallback } from 'react'
import { getToolData, saveToolData, syncToolDataToSupabase, loadToolDataFromSupabase } from './progress'

/**
 * Hook that loads tool data from Supabase first (fallback to localStorage) and
 * auto-saves to both Supabase and localStorage with debounce.
 */
export function useToolState<T extends object>(
  userId: string,
  toolId: string,
  defaultValue: T
): [T, (updater: T | ((prev: T) => T)) => void, boolean] {
  const [state, setState] = useState<T>(defaultValue)
  const [loaded, setLoaded] = useState(false)

  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const stateRef = useRef(state)
  stateRef.current = state

  // Load from Supabase first, fallback to localStorage
  useEffect(() => {
    let cancelled = false

    async function load() {
      try {
        const remote = await loadToolDataFromSupabase(userId, toolId)
        if (!cancelled && remote && Object.keys(remote).length > 0) {
          const values = ('values' in remote && remote.values && typeof remote.values === 'object')
            ? remote.values as T
            : remote as unknown as T
          setState({ ...defaultValue, ...values })
          // Also cache to localStorage
          saveToolData(userId, toolId, remote)
          setLoaded(true)
          return
        }
      } catch {
        // Supabase failed, fall through to localStorage
      }

      // Fallback to localStorage
      if (!cancelled) {
        const saved = getToolData(userId, toolId) as { values?: T } & T
        if (saved && Object.keys(saved).length > 0) {
          if ('values' in saved && saved.values && typeof saved.values === 'object') {
            setState({ ...defaultValue, ...saved.values as T })
          } else {
            setState({ ...defaultValue, ...saved as T })
          }
        }
        setLoaded(true)
      }
    }

    load()
    return () => { cancelled = true }
  }, [userId, toolId]) // eslint-disable-line react-hooks/exhaustive-deps

  // Debounced save — 500ms after last change, Supabase first + localStorage backup
  useEffect(() => {
    if (!loaded) return
    if (timerRef.current) clearTimeout(timerRef.current)
    timerRef.current = setTimeout(() => {
      const payload = { values: stateRef.current }
      // Save to Supabase first
      syncToolDataToSupabase(userId, toolId, payload).catch(() => {})
      // Always cache to localStorage as backup
      saveToolData(userId, toolId, payload)
    }, 500)
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current)
    }
  }, [state, userId, toolId, loaded])

  // Save immediately on unmount
  useEffect(() => {
    return () => {
      const payload = { values: stateRef.current }
      saveToolData(userId, toolId, payload)
      syncToolDataToSupabase(userId, toolId, payload).catch(() => {})
    }
  }, [userId, toolId])

  const update = useCallback((updater: T | ((prev: T) => T)) => {
    setState(updater)
  }, [])

  return [state, update, loaded]
}
