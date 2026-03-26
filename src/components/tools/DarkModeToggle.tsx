'use client'

import { useEffect, useState } from 'react'
import { Moon, Sun } from 'lucide-react'

const STORAGE_KEY = 's4c_dark_mode'

export default function DarkModeToggle() {
  const [dark, setDark] = useState(false)

  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY)
    if (saved === 'true') {
      setDark(true)
      document.documentElement.setAttribute('data-theme', 'dark')
    }
  }, [])

  const toggle = () => {
    const next = !dark
    setDark(next)
    if (next) {
      document.documentElement.setAttribute('data-theme', 'dark')
      localStorage.setItem(STORAGE_KEY, 'true')
    } else {
      document.documentElement.removeAttribute('data-theme')
      localStorage.setItem(STORAGE_KEY, 'false')
    }
  }

  return (
    <button
      onClick={toggle}
      aria-label={dark ? 'Activar modo claro' : 'Activar modo oscuro'}
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: '0.5rem',
        padding: '0.5rem 0.75rem',
        borderRadius: 8,
        background: 'transparent',
        border: 'none',
        cursor: 'pointer',
        color: 'var(--color-text-muted)',
        fontFamily: 'var(--font-body)',
        fontSize: '0.8125rem',
        width: '100%',
        textAlign: 'left',
        transition: 'color 0.15s',
      }}
      onMouseEnter={(e) => (e.currentTarget.style.color = 'var(--color-text-primary)')}
      onMouseLeave={(e) => (e.currentTarget.style.color = 'var(--color-text-muted)')}
    >
      {dark ? <Sun size={13} /> : <Moon size={13} />}
      {dark ? 'Modo claro' : 'Modo oscuro'}
    </button>
  )
}
