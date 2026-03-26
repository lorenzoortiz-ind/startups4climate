'use client'

import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  type ReactNode,
} from 'react'

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

  const login = useCallback(async (email: string, password: string) => {
    const users = getUsers()
    const record = users[email.toLowerCase()]
    if (!record) return { error: 'No encontramos una cuenta con ese email.' }
    if (record.password !== btoa(password)) return { error: 'Contraseña incorrecta.' }
    setUser(record.user)
    localStorage.setItem(SESSION_KEY, record.user.id)
    return {}
  }, [])

  const register = useCallback(
    async (email: string, password: string, name: string, startup: string) => {
      const users = getUsers()
      if (users[email.toLowerCase()]) return { error: 'Ya existe una cuenta con ese email.' }
      const newUser: User = {
        id: crypto.randomUUID(),
        name,
        email: email.toLowerCase(),
        startup,
        stage: null,
        diagnosticScore: null,
        createdAt: new Date().toISOString(),
      }
      users[email.toLowerCase()] = { password: btoa(password), user: newUser }
      saveUsers(users)
      setUser(newUser)
      localStorage.setItem(SESSION_KEY, newUser.id)
      return {}
    },
    []
  )

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
