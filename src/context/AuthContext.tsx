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
  loading: boolean
  login: (email: string, password: string) => Promise<{ error?: string }>
  register: (
    email: string,
    password: string,
    name: string,
    startup: string
  ) => Promise<{ error?: string }>
  logout: () => void
  openAuthModal: (mode?: 'login' | 'register') => void
  closeAuthModal: () => void
  authModalOpen: boolean
  authModalMode: 'login' | 'register'
  updateUserStage: (stage: string, score: number) => void
}

const AuthContext = createContext<AuthContextType | null>(null)

const USERS_KEY = 's4c_users'
const SESSION_KEY = 's4c_session'

type UserRecord = { password: string; user: User }

function getUsers(): Record<string, UserRecord> {
  if (typeof window === 'undefined') return {}
  try {
    return JSON.parse(localStorage.getItem(USERS_KEY) || '{}')
  } catch {
    return {}
  }
}

function saveUsers(users: Record<string, UserRecord>) {
  localStorage.setItem(USERS_KEY, JSON.stringify(users))
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const [authModalOpen, setAuthModalOpen] = useState(false)
  const [authModalMode, setAuthModalMode] = useState<'login' | 'register'>('login')

  useEffect(() => {
    const sessionId = localStorage.getItem(SESSION_KEY)
    if (sessionId) {
      const users = getUsers()
      const found = Object.values(users).find((u) => u.user.id === sessionId)
      if (found) setUser(found.user)
    }
    setLoading(false)
  }, [])

  const register = useCallback(
    async (email: string, password: string, name: string, startup: string) => {
      const users = getUsers()
      if (users[email.toLowerCase()]) return { error: 'Ya existe una cuenta con ese email.' }

      let newUser: User

      try {
        // Try to insert into Supabase first to get a UUID
        const { data, error } = await supabase
          .from('users')
          .insert({
            name,
            email: email.toLowerCase(),
            startup,
          })
          .select()
          .single()

        if (error) throw error

        newUser = {
          id: data.id,
          name: data.name,
          email: data.email,
          startup: data.startup,
          stage: data.stage || null,
          diagnosticScore: data.diagnostic_score || null,
          createdAt: data.created_at || new Date().toISOString(),
        }
      } catch {
        // Fallback: create user locally if Supabase is unreachable
        newUser = {
          id: crypto.randomUUID(),
          name,
          email: email.toLowerCase(),
          startup,
          stage: null,
          diagnosticScore: null,
          createdAt: new Date().toISOString(),
        }
      }

      // Always store in localStorage as cache/fallback
      users[email.toLowerCase()] = { password: btoa(password), user: newUser }
      saveUsers(users)
      setUser(newUser)
      localStorage.setItem(SESSION_KEY, newUser.id)
      return {}
    },
    []
  )

  const login = useCallback(async (email: string, password: string) => {
    const users = getUsers()
    const localRecord = users[email.toLowerCase()]

    try {
      // Try Supabase lookup first
      const { data, error } = await supabase
        .from('users')
        .select()
        .eq('email', email.toLowerCase())
        .single()

      if (!error && data) {
        // Verify password against localStorage (passwords are only stored locally)
        if (localRecord && localRecord.password !== btoa(password)) {
          return { error: 'Contraseña incorrecta.' }
        }

        const loadedUser: User = {
          id: data.id,
          name: data.name,
          email: data.email,
          startup: data.startup,
          stage: data.stage || null,
          diagnosticScore: data.diagnostic_score || null,
          createdAt: data.created_at || new Date().toISOString(),
        }

        // Update localStorage cache with Supabase data
        users[email.toLowerCase()] = {
          password: localRecord?.password || btoa(password),
          user: loadedUser,
        }
        saveUsers(users)
        setUser(loadedUser)
        localStorage.setItem(SESSION_KEY, loadedUser.id)
        return {}
      }
    } catch {
      // Supabase unreachable — fall back to localStorage
    }

    // Fallback to localStorage-only login
    if (!localRecord) return { error: 'No encontramos una cuenta con ese email.' }
    if (localRecord.password !== btoa(password)) return { error: 'Contraseña incorrecta.' }
    setUser(localRecord.user)
    localStorage.setItem(SESSION_KEY, localRecord.user.id)
    return {}
  }, [])

  const logout = useCallback(() => {
    setUser(null)
    localStorage.removeItem(SESSION_KEY)
  }, [])

  const openAuthModal = useCallback((mode: 'login' | 'register' = 'login') => {
    setAuthModalMode(mode)
    setAuthModalOpen(true)
  }, [])

  const closeAuthModal = useCallback(() => {
    setAuthModalOpen(false)
  }, [])

  const updateUserStage = useCallback(
    (stage: string, score: number) => {
      if (!user) return
      const users = getUsers()
      const record = users[user.email]
      if (!record) return
      const updated: User = { ...record.user, stage, diagnosticScore: score }
      record.user = updated
      users[user.email] = record
      saveUsers(users)
      setUser(updated)

      // Sync to Supabase in background
      Promise.resolve(
        supabase
          .from('users')
          .update({ stage, diagnostic_score: score })
          .eq('id', user.id)
      ).catch(() => {})
    },
    [user]
  )

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        login,
        register,
        logout,
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
