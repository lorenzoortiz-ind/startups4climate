'use client'

import React, {
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
  ) => Promise<{ error?: string; role?: string }>
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
async function fallbackAppUser(session: Session): Promise<AppUser> {
  // Try a minimal query to at least get the role (critical for redirect)
  let role: 'founder' | 'admin_org' | 'superadmin' = 'founder'
  let org_id: string | null = null
  try {
    const { data } = await supabase
      .from('profiles')
      .select('role, org_id')
      .eq('id', session.user.id)
      .single()
    if (data?.role) role = data.role as typeof role
    if (data?.org_id) org_id = data.org_id
  } catch {
    // If even this fails, default to founder
  }

  return {
    id: session.user.id,
    email: session.user.email ?? '',
    role,
    org_id,
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
  // Flag to prevent onAuthStateChange from overwriting the user
  // that login/register already set with accurate role data.
  const loginInProgressRef = React.useRef(false)

  const user = appUser ? appUserToUser(appUser) : null

  useEffect(() => {
    let cancelled = false

    // Get initial user (getUser() validates with the server, unlike getSession())
    supabase.auth.getUser().then(async ({ data: { user: authUser } }) => {
      if (cancelled) return
      if (authUser) {
        // We still need a session object for fallbackAppUser, fetch it after verifying the user
        const { data: { session } } = await supabase.auth.getSession()
        if (session) {
          // Set fallback immediately so the UI is never stuck loading
          setAppUser(await fallbackAppUser(session))
        }
        setLoading(false)
        // Then try to enrich with profile data in background
        try {
          const profile = await loadProfile(authUser.id)
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
      // If login() or register() already set the user with accurate role data,
      // skip re-fetching here to avoid overwriting with stale/fallback data.
      if (loginInProgressRef.current) return
      if (session?.user) {
        // Set fallback immediately, then enrich
        setAppUser(await fallbackAppUser(session))
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
      loginInProgressRef.current = true
      try {
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
          loginInProgressRef.current = false
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
            loginInProgressRef.current = false
            if (signInError.message.includes('Email not confirmed')) {
              return { error: 'Debes confirmar tu email antes de iniciar sesión. Revisa tu bandeja de entrada.' }
            }
            return { error: mapSupabaseError(signInError.message) }
          }
          activeUser = signInData.user
        }

        // Set a minimal user IMMEDIATELY so the UI is never blocked
        // regardless of what happens with profile loading below
        const role: string = 'founder'
        if (activeUser) {
          const minimalUser: AppUser = {
            id: activeUser.id,
            email: activeUser.email ?? email,
            role: 'founder',
            org_id: null,
            full_name: name,
            startup_name: startup,
            stage: null,
            diagnosticScore: null,
            created_at: activeUser.created_at ?? new Date().toISOString(),
          }
          setAppUser(minimalUser)

          // Try to ensure profile exists in background — don't block the return
          ;(async () => {
            try {
              let profile = await loadProfile(activeUser!.id)
              if (!profile) {
                await supabase.from('profiles').upsert({
                  id: activeUser!.id,
                  email: activeUser!.email,
                  full_name: name,
                  startup_name: startup,
                  role: 'founder',
                  created_at: new Date().toISOString(),
                })
                profile = await loadProfile(activeUser!.id)
              }

              // Check for pending diagnostic results from the landing page quiz
              try {
                const pendingRaw = localStorage.getItem('s4c_diagnostic_pending')
                if (pendingRaw) {
                  const pending = JSON.parse(pendingRaw) as {
                    score: number
                    stage: string
                    answers: Record<string, unknown>
                    completedAt: string
                  }
                  // Update profile with diagnostic stage and score
                  await supabase
                    .from('profiles')
                    .update({
                      stage: pending.stage,
                      diagnostic_score: pending.score,
                    })
                    .eq('id', activeUser!.id)

                  // Also try to store the full answers (column may not exist yet)
                  try {
                    await supabase
                      .from('profiles')
                      .update({ diagnostic_data: pending.answers })
                      .eq('id', activeUser!.id)
                  } catch {
                    // Column doesn't exist yet — that's fine
                  }

                  // Clear from localStorage
                  localStorage.removeItem('s4c_diagnostic_pending')

                  // Re-load profile so the UI reflects the new stage
                  profile = await loadProfile(activeUser!.id)
                }
              } catch {
                // localStorage or parse error — continue silently
              }

              // Ensure a startup row exists so the founder appears in cohorts/reports
              await supabase.from('startups').upsert({
                founder_id: activeUser!.id,
                name: startup,
                stage: null,
                vertical: 'other',
                country: null,
              }, { onConflict: 'founder_id' })
              if (profile) {
                setAppUser(profile)
              }
            } catch {
              // Minimal user already set — ignore
            } finally {
              loginInProgressRef.current = false
            }
          })()

          return { role }
        }

        loginInProgressRef.current = false
        return { role }
      } catch {
        loginInProgressRef.current = false
        return { error: 'Error de conexión. Verifica tu internet e intenta de nuevo.' }
      }
    },
    []
  )

  const login = useCallback(async (email: string, password: string) => {
    try {
      // Prevent onAuthStateChange from overwriting user data we set here
      loginInProgressRef.current = true
      const { data, error } = await supabase.auth.signInWithPassword({
        email: email.toLowerCase(),
        password,
      })

      if (error) {
        loginInProgressRef.current = false
        return { error: mapSupabaseError(error.message) }
      }

      if (!data.user || !data.session) {
        loginInProgressRef.current = false
        return { error: 'No se pudo iniciar sesión.' }
      }

      // Get role via multiple methods for maximum reliability
      let role: string = 'founder'
      let orgId: string | null = null

      // Method 1: Direct REST fetch (bypasses PostgREST cache issues)
      try {
        const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
        const res = await fetch(
          `${supabaseUrl}/rest/v1/profiles?select=role,org_id&id=eq.${data.user.id}`,
          {
            headers: {
              'apikey': process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
              'Authorization': `Bearer ${data.session.access_token}`,
              'Accept': 'application/json',
            },
          }
        )
        if (res.ok) {
          const rows = await res.json()
          if (rows?.[0]?.role) role = rows[0].role
          if (rows?.[0]?.org_id) orgId = rows[0].org_id
        }
      } catch {
        // Method 1 failed — try method 2
      }

      // Method 2: Supabase client query (fallback if REST failed)
      if (role === 'founder') {
        try {
          const { data: profile } = await supabase
            .from('profiles')
            .select('role, org_id')
            .eq('id', data.user.id)
            .single()
          if (profile?.role) role = profile.role
          if (profile?.org_id) orgId = profile.org_id
        } catch {
          // Method 2 failed
        }
      }

      // Set a minimal user immediately so the UI is not blocked
      const appUserData: AppUser = {
        id: data.user.id,
        email: data.user.email ?? '',
        role: role as AppUser['role'],
        org_id: orgId,
        full_name: data.user.user_metadata?.full_name ?? data.user.email ?? '',
        startup_name: data.user.user_metadata?.startup_name ?? null,
        stage: null,
        diagnosticScore: null,
        created_at: data.user.created_at ?? new Date().toISOString(),
      }
      setAppUser(appUserData)

      // Enrich with full profile in background (don't block login)
      loadProfile(data.user.id).then((profile) => {
        if (profile) {
          // Preserve the role from direct fetch
          profile.role = role as AppUser['role']
          profile.org_id = orgId
          setAppUser(profile)
        }
      }).catch(() => {}).finally(() => {
        // Allow onAuthStateChange to resume normal behavior
        loginInProgressRef.current = false
      })

      return { role }
    } catch {
      loginInProgressRef.current = false
      return { error: 'Error de conexión. Verifica tu internet e intenta de nuevo.' }
    }
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
