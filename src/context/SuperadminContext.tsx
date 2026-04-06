'use client'

import React, { createContext, useContext, useState, type ReactNode } from 'react'
import { useAuth } from './AuthContext'

interface SuperadminContextType {
  isSuperadmin: boolean
  selectedOrgId: string | null // null = all orgs
  setSelectedOrgId: (id: string | null) => void
  effectiveOrgId: string | null // returns selectedOrgId for superadmin, or appUser.org_id for admin_org
}

const SuperadminContext = createContext<SuperadminContextType | null>(null)

export function SuperadminProvider({ children }: { children: ReactNode }) {
  const { appUser } = useAuth()
  const isSuperadmin = appUser?.role === 'superadmin'
  const [selectedOrgId, setSelectedOrgId] = useState<string | null>(null)

  const effectiveOrgId = isSuperadmin ? selectedOrgId : (appUser?.org_id ?? null)

  return (
    <SuperadminContext.Provider value={{ isSuperadmin, selectedOrgId, setSelectedOrgId, effectiveOrgId }}>
      {children}
    </SuperadminContext.Provider>
  )
}

export function useSuperadmin() {
  const ctx = useContext(SuperadminContext)
  if (!ctx) throw new Error('useSuperadmin must be used within SuperadminProvider')
  return ctx
}
