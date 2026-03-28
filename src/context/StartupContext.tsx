'use client'

import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  type ReactNode,
} from 'react'
import { supabase } from '@/lib/supabase'
import { useAuth } from './AuthContext'

export interface StartupProfile {
  id: string
  name: string
  description: string | null
  vertical: string
  country: string
  stage: string | null
  diagnostic_score: number | null
  team_size: number | null
  revenue_model: string | null
  monthly_revenue: number | null
  tam_usd: number | null
  ltv: number | null
  cac: number | null
  has_mvp: boolean
  has_paying_customers: boolean
  paying_customers_count: number
  tools_completed: number
  current_stage_progress: number
}

interface StartupContextType {
  startup: StartupProfile | null
  loading: boolean
  updateStartup: (data: Partial<StartupProfile>) => Promise<void>
  refreshStartup: () => Promise<void>
}

const StartupContext = createContext<StartupContextType | null>(null)

const STARTUP_CACHE_KEY = 's4c_startup'

function getCachedStartup(): StartupProfile | null {
  if (typeof window === 'undefined') return null
  try {
    const cached = localStorage.getItem(STARTUP_CACHE_KEY)
    return cached ? JSON.parse(cached) : null
  } catch {
    return null
  }
}

function cacheStartup(startup: StartupProfile | null) {
  if (typeof window === 'undefined') return
  if (startup) {
    localStorage.setItem(STARTUP_CACHE_KEY, JSON.stringify(startup))
  } else {
    localStorage.removeItem(STARTUP_CACHE_KEY)
  }
}

export function StartupProvider({ children }: { children: ReactNode }) {
  const { user } = useAuth()
  const [startup, setStartup] = useState<StartupProfile | null>(null)
  const [loading, setLoading] = useState(true)

  const fetchStartup = useCallback(async () => {
    if (!user) {
      setStartup(null)
      cacheStartup(null)
      setLoading(false)
      return
    }

    setLoading(true)

    try {
      const { data, error } = await supabase
        .from('startups')
        .select('*')
        .eq('user_id', user.id)
        .single()

      if (error) throw error

      const profile: StartupProfile = {
        id: data.id,
        name: data.name ?? user.startup ?? '',
        description: data.description ?? null,
        vertical: data.vertical ?? '',
        country: data.country ?? '',
        stage: data.stage ?? null,
        diagnostic_score: data.diagnostic_score ?? null,
        team_size: data.team_size ?? null,
        revenue_model: data.revenue_model ?? null,
        monthly_revenue: data.monthly_revenue ?? null,
        tam_usd: data.tam_usd ?? null,
        ltv: data.ltv ?? null,
        cac: data.cac ?? null,
        has_mvp: data.has_mvp ?? false,
        has_paying_customers: data.has_paying_customers ?? false,
        paying_customers_count: data.paying_customers_count ?? 0,
        tools_completed: data.tools_completed ?? 0,
        current_stage_progress: data.current_stage_progress ?? 0,
      }

      setStartup(profile)
      cacheStartup(profile)
    } catch {
      // Supabase unreachable or no startup row — fall back to cache
      const cached = getCachedStartup()
      if (cached) {
        setStartup(cached)
      } else {
        setStartup(null)
      }
    } finally {
      setLoading(false)
    }
  }, [user])

  useEffect(() => {
    fetchStartup()
  }, [fetchStartup])

  const updateStartup = useCallback(
    async (data: Partial<StartupProfile>) => {
      if (!startup) return

      // Optimistically update local state
      const updated = { ...startup, ...data }
      setStartup(updated)
      cacheStartup(updated)

      // Sync to Supabase in background
      try {
        // Remove id from the update payload — it's the primary key
        const { id: _id, ...updatePayload } = data
        await supabase
          .from('startups')
          .update(updatePayload)
          .eq('id', startup.id)
      } catch {
        // Silently fail — local state is already updated
        // Next refresh will reconcile with the server
      }
    },
    [startup]
  )

  const refreshStartup = useCallback(async () => {
    await fetchStartup()
  }, [fetchStartup])

  return (
    <StartupContext.Provider
      value={{
        startup,
        loading,
        updateStartup,
        refreshStartup,
      }}
    >
      {children}
    </StartupContext.Provider>
  )
}

export function useStartup() {
  const ctx = useContext(StartupContext)
  if (!ctx) throw new Error('useStartup debe usarse dentro de StartupProvider')
  return ctx
}
