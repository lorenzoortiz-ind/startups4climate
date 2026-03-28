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
  login: (email: string, password: string) => Promise<{ error?: string; role?: string }>
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

/**
 * Build a minimal AppUser from the Supabase auth session.
 * Used as a fallback when the profiles table query fails so the user
 * is not stuck on a loading spinner forever.
 */
function fallbackAppUser(session: Session): AppUser {
  return {
    id: session.user.id,
    email: session.user.email ?? '',
    role: 'founder',
    org_id: null,
    full_name: session.user.user_metadata?.full_name ?? session.user.email ?? '',
    startup_name: session.user.user_metadata?.startup_name ?? null,
    stage: null,
    diagnosticScore: null,
    created_at: session.user.created_at ?? new Date().toISOString(),
  }
}

async function loadProfile(userId: string): Promise<AppUser | null> {
  try {
    // Race the profile query against a timeout so we never hang
    const result = await Promise.race([
      supabase
        .from('profiles')
        .select('id, email, full_name, role, org_id, startup_name, stage, diagnostic_score, created_at')
        .eq('id', userId)
        .single(),
      new Promise<{ data: null; error: { message: string } }>((resolve) =>
        setTimeout(() => resolve({ data: null, error: { message: 'Timeout' } }), 5000)
      ),
    ])

    const { data, error } = result

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
  } catch {
    // Network or unexpected errors — caller should use fallback
    return null
  }
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [appUser, setAppUser] = useState<AppUser | null>(null)
  const [loading, setLoading] = useState(true)
  const [authModalOpen, setAuthModalOpen] = useState(false)
  const [authModalMode, setAuthModalMode] = useState<'login' | 'register'>('login')

  const user = appUser ? appUserToUser(appUser) : null

  useEffect(() => {
    let cancelled = false

    // Get initial session
    supabase.auth.getSession().then(async ({ data: { session } }) => {
      if (cancelled) return
      if (session?.user) {
        // Set fallback immediately so the UI is never stuck loading
        setAppUser(fallbackAppUser(session))
        setLoading(false)
        // Then try to enrich with profile data in background
        try {
          const profile = await loadProfile(session.user.id)
          if (!cancelled && profile) {
            setAppUser(profile)
          }
        } catch {
          // Fallback already set — ignore
        }
      } else {
        setLoading(false)
      }
    })

    // Listen for auth state changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (_event, session) => {
      if (cancelled) return
      if (session?.user) {
        // Set fallback immediately, then enrich
        setAppUser(fallbackAppUser(session))
        try {
          const profile = await loadProfile(session.user.id)
          if (!cancelled && profile) {
            setAppUser(profile)
          }
        } catch {
          // Fallback already set — ignore
        }
      } else {
        setAppUser(null)
      }
    })

    return () => {
      cancelled = true
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

      // If email confirmation is enabled in Supabase, session will be null.
      // In that case, try to sign in immediately with password to get a session.
      let activeUser = data.user
      if (!data.session && data.user) {
        const { data: signInData, error: signInError } =
          await supabase.auth.signInWithPassword({
            email: email.toLowerCase(),
            password,
          })
        if (signInError) {
          // If the error is about email confirmation, tell the user to check their inbox
          // instead of showing a generic error.
          if (signInError.message.includes('Email not confirmed')) {
            return { error: 'Debes confirmar tu email antes de iniciar sesión. Revisa tu bandeja de entrada.' }
          }
          return { error: mapSupabaseError(signInError.message) }
        }
        activeUser = signInData.user
      }

      // Ensure profile exists (the DB trigger may not have fired yet)
      if (activeUser) {
        // Try to load existing profile first
        let profile = await loadProfile(activeUser.id)
        if (!profile) {
          // Create profile directly if it doesn't exist yet
          const now = new Date().toISOString()
          await supabase.from('profiles').upsert({
            id: activeUser.id,
            email: activeUser.email,
            full_name: name,
            startup_name: startup,
            role: 'founder',
            created_at: now,
          })
          profile = await loadProfile(activeUser.id)
        }
        // Use the active session for fallback if profile query keeps failing
        const { data: { session: activeSession } } = await supabase.auth.getSession()
        if (profile) {
          setAppUser(profile)
        } else if (activeSession) {
          setAppUser(fallbackAppUser(activeSession))
        }
      }

      return {}
    },
    []
  )

  const login = useCallback(async (email: string, password: string) => {
    let lastError: string | undefined

    // Retry up to 3 times for transient "Database error" issues
    // (e.g. PostgREST schema cache not yet refreshed after migration)
    const MAX_ATTEMPTS = 3
    for (let attempt = 0; attempt < MAX_ATTEMPTS; attempt++) {
      try {
        const { data, error } = await supabase.auth.signInWithPassword({
          email: email.toLowerCase(),
          password,
        })

        if (error) {
          console.warn(`[Auth] signInWithPassword failed (attempt ${attempt + 1}/${MAX_ATTEMPTS}):`, error.message)
          // Only retry on transient database errors
          if (error.message.includes('Database error') && attempt < MAX_ATTEMPTS - 1) {
            lastError = error.message
            await new Promise((r) => setTimeout(r, 2000))
            continue
          }
          return { error: mapSupabaseError(error.message) }
        }

        // Sign-in succeeded — try to load profile but never fail the login
        if (data.user && data.session) {
          try {
            const profile = await loadProfile(data.user.id)
            const resolved = profile ?? fallbackAppUser(data.session)
            setAppUser(resolved)
            return { role: resolved.role }
          } catch (profileErr) {
            // Profile load failed — use fallback so user is not stuck
            console.warn('[Auth] Profile load failed after successful sign-in, using fallback:', profileErr)
            const fallback = fallbackAppUser(data.session)
            setAppUser(fallback)
            return { role: fallback.role }
          }
        }

        return {}
      } catch (networkErr) {
        // Catch network-level errors (fetch failed, timeout, etc.)
        console.warn(`[Auth] Network error during sign-in (attempt ${attempt + 1}/${MAX_ATTEMPTS}):`, networkErr)
        if (attempt < MAX_ATTEMPTS - 1) {
          lastError = 'Network error'
          await new Promise((r) => setTimeout(r, 2000))
          continue
        }
        return { error: 'Error de conexión. Verifica tu conexión a internet e intenta de nuevo.' }
      }
    }

    // All retries exhausted
    return { error: mapSupabaseError(lastError ?? 'Database error') }
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
  if (message.includes('signups') && message.includes('disabled')) {
    return 'El registro no está disponible en este momento. Contacta al administrador.'
  }
  if (message.includes('Database error')) {
    return 'Error temporal del servidor. Intenta de nuevo en unos segundos.'
  }
  return message
}
