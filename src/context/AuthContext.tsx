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
import type { Session } from '@supabase/supabase-js'

export interface AppUser {
  id: string
  email: string
  role: 'founder' | 'admin_org' | 'superadmin'
  org_id: string | null
  full_name: string
  startup_name: string | null
  stage: string | null
  diagnosticScore: number | null
  created_at: string
}

/**
 * Backward-compatible User shape consumed by existing components.
 * Maps AppUser fields to the legacy field names.
 */
export interface User {
  id: string
  name: string
  email: string
  startup: string
  stage: string | null
  diagnosticScore: number | null
  createdAt: string
}

interface AuthContextType {
  user: User | null
  appUser: AppUser | null
  loading: boolean
  login: (email: string, password: string) => Promise<{ error?: string }>
  register: (
    email: string,
    password: string,
    name: string,
    startup: string
  ) => Promise<{ error?: string }>
  logout: () => Promise<void>
  updateProfile: (updates: Partial<Pick<AppUser, 'full_name' | 'startup_name' | 'stage' | 'diagnosticScore'>>) => Promise<{ error?: string }>
  openAuthModal: (mode?: 'login' | 'register') => void
  closeAuthModal: () => void
  authModalOpen: boolean
  authModalMode: 'login' | 'register'
  updateUserStage: (stage: string, score: number) => void
}

const AuthContext = createContext<AuthContextType | null>(null)

function appUserToUser(appUser: AppUser): User {
  return {
    id: appUser.id,
    name: appUser.full_name,
    email: appUser.email,
    startup: appUser.startup_name || '',
    stage: appUser.stage,
    diagnosticScore: appUser.diagnosticScore,
    createdAt: appUser.created_at,
  }
}

async function loadProfile(userId: string): Promise<AppUser | null> {
  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', userId)
    .single()

  if (error || !data) return null

  return {
    id: data.id,
    email: data.email,
    role: data.role || 'founder',
    org_id: data.org_id || null,
    full_name: data.full_name || '',
    startup_name: data.startup_name || null,
    stage: data.stage || null,
    diagnosticScore: data.diagnostic_score ?? null,
    created_at: data.created_at || new Date().toISOString(),
  }
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [appUser, setAppUser] = useState<AppUser | null>(null)
  const [loading, setLoading] = useState(true)
  const [authModalOpen, setAuthModalOpen] = useState(false)
  const [authModalMode, setAuthModalMode] = useState<'login' | 'register'>('login')

  const user = appUser ? appUserToUser(appUser) : null

  useEffect(() => {
    // Get initial session
    supabase.auth.getSession().then(async ({ data: { session } }) => {
      if (session?.user) {
        const profile = await loadProfile(session.user.id)
        if (profile) {
          setAppUser(profile)
        }
      }
      setLoading(false)
    })

    // Listen for auth state changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (_event, session) => {
      if (session?.user) {
        const profile = await loadProfile(session.user.id)
        if (profile) {
          setAppUser(profile)
        }
      } else {
        setAppUser(null)
      }
    })

    return () => {
      subscription.unsubscribe()
    }
  }, [])

  const register = useCallback(
    async (email: string, password: string, name: string, startup: string) => {
      const { data, error } = await supabase.auth.signUp({
        email: email.toLowerCase(),
        password,
        options: {
          data: {
            full_name: name,
            startup_name: startup,
          },
        },
      })

      if (error) {
        return { error: mapSupabaseError(error.message) }
      }

      // If email confirmation is disabled, user is immediately available
      if (data.user) {
        const profile = await loadProfile(data.user.id)
        if (profile) {
          setAppUser(profile)
        }
      }

      return {}
    },
    []
  )

  const login = useCallback(async (email: string, password: string) => {
    const { data, error } = await supabase.auth.signInWithPassword({
      email: email.toLowerCase(),
      password,
    })

    if (error) {
      return { error: mapSupabaseError(error.message) }
    }

    if (data.user) {
      const profile = await loadProfile(data.user.id)
      if (profile) {
        setAppUser(profile)
      }
    }

    return {}
  }, [])

  const logout = useCallback(async () => {
    await supabase.auth.signOut()
    setAppUser(null)
  }, [])

  const updateProfile = useCallback(
    async (updates: Partial<Pick<AppUser, 'full_name' | 'startup_name' | 'stage' | 'diagnosticScore'>>) => {
      if (!appUser) return { error: 'No hay sesión activa.' }

      const dbUpdates: Record<string, unknown> = {}
      if (updates.full_name !== undefined) dbUpdates.full_name = updates.full_name
      if (updates.startup_name !== undefined) dbUpdates.startup_name = updates.startup_name
      if (updates.stage !== undefined) dbUpdates.stage = updates.stage
      if (updates.diagnosticScore !== undefined) dbUpdates.diagnostic_score = updates.diagnosticScore

      const { error } = await supabase
        .from('profiles')
        .update(dbUpdates)
        .eq('id', appUser.id)

      if (error) {
        return { error: 'No se pudo actualizar el perfil.' }
      }

      setAppUser((prev) => prev ? { ...prev, ...updates } : prev)
      return {}
    },
    [appUser]
  )

  const openAuthModal = useCallback((mode: 'login' | 'register' = 'login') => {
    setAuthModalMode(mode)
    setAuthModalOpen(true)
  }, [])

  const closeAuthModal = useCallback(() => {
    setAuthModalOpen(false)
  }, [])

  const updateUserStage = useCallback(
    (stage: string, score: number) => {
      if (!appUser) return

      setAppUser((prev) => prev ? { ...prev, stage, diagnosticScore: score } : prev)

      // Sync to Supabase in background
      supabase
        .from('profiles')
        .update({ stage, diagnostic_score: score })
        .eq('id', appUser.id)
        .then(() => {})
    },
    [appUser]
  )

  return (
    <AuthContext.Provider
      value={{
        user,
        appUser,
        loading,
        login,
        register,
        logout,
        updateProfile,
        openAuthModal,
        closeAuthModal,
        authModalOpen,
        authModalMode,
        updateUserStage,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within AuthProvider')
  return ctx
}

function mapSupabaseError(message: string): string {
  if (message.includes('Invalid login credentials')) {
    return 'Email o contraseña incorrectos.'
  }
  if (message.includes('User already registered')) {
    return 'Ya existe una cuenta con ese email.'
  }
  if (message.includes('Email not confirmed')) {
    return 'Revisa tu email para confirmar tu cuenta.'
  }
  if (message.includes('Password should be at least')) {
    return 'La contraseña debe tener al menos 6 caracteres.'
  }
  if (message.includes('Unable to validate email')) {
    return 'El email ingresado no es válido.'
  }
  if (message.includes('Email rate limit exceeded')) {
    return 'Demasiados intentos. Intenta de nuevo en unos minutos.'
  }
  return message
}
