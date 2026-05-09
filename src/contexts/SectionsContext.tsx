'use client'

import React, { createContext, useContext, useState, useCallback } from 'react'

export interface SectionEntry {
  id: string
  label: string
  state: 'idle' | 'active' | 'done'
}

interface SectionsContextValue {
  sections: SectionEntry[]
  registerSection: (entry: SectionEntry) => void
  unregisterSection: (id: string) => void
  updateSection: (id: string, patch: Partial<SectionEntry>) => void
}

const SectionsContext = createContext<SectionsContextValue | null>(null)

export function SectionsProvider({ children }: { children: React.ReactNode }) {
  const [sections, setSections] = useState<SectionEntry[]>([])

  const registerSection = useCallback((entry: SectionEntry) => {
    setSections(prev => {
      if (prev.find(s => s.id === entry.id)) return prev
      return [...prev, entry]
    })
  }, [])

  const unregisterSection = useCallback((id: string) => {
    setSections(prev => prev.filter(s => s.id !== id))
  }, [])

  const updateSection = useCallback((id: string, patch: Partial<SectionEntry>) => {
    setSections(prev => prev.map(s => s.id === id ? { ...s, ...patch } : s))
  }, [])

  return (
    <SectionsContext.Provider value={{ sections, registerSection, unregisterSection, updateSection }}>
      {children}
    </SectionsContext.Provider>
  )
}

export function useSections() {
  const ctx = useContext(SectionsContext)
  if (!ctx) throw new Error('useSections must be used inside SectionsProvider')
  return ctx
}
