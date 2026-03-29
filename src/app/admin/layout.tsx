'use client'

import { useState, useEffect } from 'react'
import { usePathname, useRouter } from 'next/navigation'
import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'
import {
  LayoutDashboard,
  Users,
  FileBarChart,
  BarChart3,
  Settings,
  LogOut,
  Menu,
  X,
  ChevronLeft,
  Radar,
  Lightbulb,
  BookOpen,
} from 'lucide-react'
import { useAuth } from '@/context/AuthContext'

const NAV_ITEMS = [
  { href: '/admin', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/admin/cohortes', label: 'Cohortes', icon: Users },
  { href: '/admin/reportes', label: 'Reportes', icon: FileBarChart },
  { href: '/admin/benchmarking', label: 'Benchmarking', icon: BarChart3 },
  { href: '/tools/radar', label: 'RADAR', icon: Radar },
  { href: '/tools/oportunidades', label: 'Oportunidades', icon: Lightbulb },
  { href: '/tools/recursos', label: 'Recursos', icon: BookOpen },
  { href: '/admin/configuracion', label: 'Configuración', icon: Settings },
] as const

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const { appUser, loading, logout } = useAuth()
  const pathname = usePathname()
  const router = useRouter()
  const [mobileOpen, setMobileOpen] = useState(false)

  useEffect(() => {
    setMobileOpen(false)
  }, [pathname])

  // Apply dark mode on mount
  useEffect(() => {
    const saved = localStorage.getItem('s4c_dark_mode')
    if (saved === 'true') {
      document.documentElement.setAttribute('data-theme', 'dark')
    }
    return () => {
      document.documentElement.removeAttribute('data-theme')
    }
  }, [])

  if (loading) {
    return (
      <div style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'var(--color-bg-primary)',
      }}>
        <div style={{
          width: 40, height: 40, borderRadius: '50%',
          border: '3px solid #E5E7EB', borderTopColor: '#FF6B4A',
          animation: 'spin 0.8s linear infinite',
        }} />
        <style>{`@keyframes spin{from{transform:rotate(0)}to{transform:rotate(360deg)}}`}</style>
      </div>
    )
  }

  if (!appUser || (appUser.role !== 'admin_org' && appUser.role !== 'superadmin')) {
    return (
      <div style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'var(--color-bg-primary)',
        padding: '2rem',
      }}>
        <div style={{
          maxWidth: 440,
          textAlign: 'center',
          padding: '3rem 2rem',
          borderRadius: 'var(--radius-lg)',
          background: 'var(--color-bg-card)',
          border: '1px solid var(--color-border)',
          boxShadow: 'var(--shadow-card)',
        }}>
          <div style={{
            width: 56, height: 56, borderRadius: '50%',
            background: 'rgba(220,38,38,0.08)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            margin: '0 auto 1.25rem',
          }}>
            <Settings size={24} color="#DC2626" />
          </div>
          <h2 style={{
            fontFamily: 'var(--font-heading)', fontWeight: 700,
            fontSize: '1.25rem', color: 'var(--color-text-primary)',
            marginBottom: '0.5rem',
          }}>
            Acceso restringido
          </h2>
          <p style={{
            fontFamily: 'var(--font-body)', fontSize: '0.875rem',
            color: 'var(--color-text-secondary)', lineHeight: 1.6,
            marginBottom: '1.5rem',
          }}>
            Necesitas permisos de administrador para acceder al panel de gestión.
            Contacta al administrador de tu organización.
          </p>
          <Link href="/tools" style={{
            display: 'inline-flex', alignItems: 'center', gap: '0.5rem',
            padding: '0.625rem 1.25rem', borderRadius: 'var(--radius-sm)',
            background: 'var(--color-accent-primary)', color: '#fff',
            fontFamily: 'var(--font-body)', fontSize: '0.875rem', fontWeight: 600,
            textDecoration: 'none', transition: 'background 0.15s',
          }}>
            <ChevronLeft size={16} />
            Volver a la plataforma
          </Link>
        </div>
      </div>
    )
  }

  const isActive = (href: string) => {
    if (href === '/admin') return pathname === '/admin'
    return pathname.startsWith(href)
  }

  const sidebarContent = (
    <div style={{
      display: 'flex', flexDirection: 'column', height: '100%',
      padding: '1.5rem 1rem', overflowY: 'auto',
    }}>
      {/* Logo / Brand */}
      <div style={{
        display: 'flex', alignItems: 'center', gap: '0.625rem',
        padding: '0 0.5rem', marginBottom: '2rem',
      }}>
        <div style={{
          width: 32, height: 32, borderRadius: 8,
          background: 'var(--color-admin-sidebar-active)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          flexShrink: 0,
        }}>
          <LayoutDashboard size={16} color="#fff" />
        </div>
        <div>
          <div style={{
            fontFamily: 'var(--font-heading)', fontWeight: 700,
            fontSize: '0.875rem', color: '#F1F5F9',
            lineHeight: 1.2,
          }}>
            S4C Admin
          </div>
          <div style={{
            fontFamily: 'var(--font-body)', fontSize: '0.6875rem',
            color: 'var(--color-admin-sidebar-text)', opacity: 0.7,
          }}>
            Panel de gestión
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem', flex: 1 }}>
        {NAV_ITEMS.map((item) => {
          const active = isActive(item.href)
          const Icon = item.icon
          return (
            <Link
              key={item.href}
              href={item.href}
              style={{
                display: 'flex', alignItems: 'center', gap: '0.75rem',
                padding: '0.625rem 0.75rem', borderRadius: 'var(--radius-sm)',
                textDecoration: 'none', transition: 'all 0.15s ease',
                background: active ? 'var(--color-admin-sidebar-active)' : 'transparent',
                color: active ? '#fff' : 'var(--color-admin-sidebar-text)',
              }}
              onMouseEnter={(e) => {
                if (!active) {
                  e.currentTarget.style.background = 'rgba(255,255,255,0.06)'
                  e.currentTarget.style.color = '#F1F5F9'
                }
              }}
              onMouseLeave={(e) => {
                if (!active) {
                  e.currentTarget.style.background = 'transparent'
                  e.currentTarget.style.color = 'var(--color-admin-sidebar-text)'
                }
              }}
            >
              <Icon size={18} />
              <span style={{
                fontFamily: 'var(--font-body)', fontSize: '0.875rem',
                fontWeight: active ? 600 : 400,
              }}>
                {item.label}
              </span>
            </Link>
          )
        })}
      </nav>

      {/* Bottom section */}
      <div style={{ marginTop: 'auto', paddingTop: '1rem' }}>
        <div style={{
          height: 1, background: 'rgba(255,255,255,0.08)',
          margin: '0 0.5rem 1rem',
        }} />

        {/* User info */}
        <div style={{
          padding: '0.75rem',
          borderRadius: 'var(--radius-sm)',
          background: 'rgba(255,255,255,0.04)',
          marginBottom: '0.75rem',
        }}>
          <div style={{
            fontFamily: 'var(--font-body)', fontSize: '0.8125rem',
            fontWeight: 600, color: '#F1F5F9', marginBottom: '0.125rem',
          }}>
            {appUser.full_name}
          </div>
          <div style={{
            fontFamily: 'var(--font-body)', fontSize: '0.6875rem',
            color: 'var(--color-admin-sidebar-text)', opacity: 0.7,
          }}>
            {appUser.email}
          </div>
        </div>

        <Link href="/tools" style={{
          display: 'flex', alignItems: 'center', gap: '0.5rem',
          padding: '0.5rem 0.75rem', borderRadius: 'var(--radius-sm)',
          textDecoration: 'none', transition: 'color 0.15s',
          color: 'var(--color-admin-sidebar-text)',
          fontFamily: 'var(--font-body)', fontSize: '0.8125rem',
          background: 'none', border: 'none', width: '100%',
          marginBottom: '0.25rem',
        }}>
          <ChevronLeft size={14} />
          Ir a la plataforma
        </Link>

        <button
          onClick={async () => { await logout(); router.replace('/') }}
          style={{
            display: 'flex', alignItems: 'center', gap: '0.5rem',
            padding: '0.5rem 0.75rem', borderRadius: 'var(--radius-sm)',
            background: 'transparent', border: 'none', cursor: 'pointer',
            color: 'var(--color-admin-sidebar-text)',
            fontFamily: 'var(--font-body)', fontSize: '0.8125rem',
            width: '100%', textAlign: 'left', transition: 'color 0.15s',
          }}
          onMouseEnter={(e) => (e.currentTarget.style.color = '#FCA5A5')}
          onMouseLeave={(e) => (e.currentTarget.style.color = 'var(--color-admin-sidebar-text)')}
        >
          <LogOut size={14} />
          Cerrar sesión
        </button>
      </div>
    </div>
  )

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: 'var(--color-bg-primary)' }}>
      {/* Desktop sidebar */}
      <aside
        className="hidden lg:flex"
        style={{
          width: 260, flexShrink: 0,
          background: 'var(--color-admin-sidebar-bg)',
          position: 'fixed', top: 0, left: 0, bottom: 0,
          zIndex: 40, flexDirection: 'column',
        }}
      >
        {sidebarContent}
      </aside>

      {/* Mobile header */}
      <header
        className="lg:hidden"
        style={{
          position: 'fixed', top: 0, left: 0, right: 0, zIndex: 50,
          height: 56, background: 'var(--color-admin-sidebar-bg)',
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          padding: '0 1rem',
        }}
      >
        <div style={{
          display: 'flex', alignItems: 'center', gap: '0.5rem',
        }}>
          <div style={{
            width: 28, height: 28, borderRadius: 6,
            background: 'var(--color-admin-sidebar-active)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            <LayoutDashboard size={14} color="#fff" />
          </div>
          <span style={{
            fontFamily: 'var(--font-heading)', fontWeight: 700,
            fontSize: '0.875rem', color: '#F1F5F9',
          }}>
            S4C Admin
          </span>
        </div>
        <button
          onClick={() => setMobileOpen((o) => !o)}
          style={{
            background: 'none', border: 'none', cursor: 'pointer',
            color: '#F1F5F9', display: 'flex',
          }}
        >
          {mobileOpen ? <X size={22} /> : <Menu size={22} />}
        </button>
      </header>

      {/* Mobile drawer */}
      <AnimatePresence>
        {mobileOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setMobileOpen(false)}
              style={{
                position: 'fixed', inset: 0, zIndex: 55,
                background: 'rgba(0,0,0,0.5)',
              }}
            />
            <motion.aside
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'tween', duration: 0.28, ease: 'easeInOut' }}
              style={{
                position: 'fixed', top: 0, left: 0, bottom: 0,
                width: 280, zIndex: 60,
                background: 'var(--color-admin-sidebar-bg)',
              }}
              onClick={(e) => e.stopPropagation()}
            >
              {sidebarContent}
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      {/* Main content area */}
      <main
        style={{ flex: 1, minHeight: '100vh' }}
        className="lg:ml-[260px] pt-14 lg:pt-0"
      >
        {/* Top header bar */}
        <div style={{
          height: 56, background: 'var(--color-bg-card)',
          borderBottom: '1px solid var(--color-border)',
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          padding: '0 1.5rem',
        }}
          className="hidden lg:flex"
        >
          <div style={{
            fontFamily: 'var(--font-heading)', fontWeight: 600,
            fontSize: '0.9375rem', color: 'var(--color-text-primary)',
          }}>
            {appUser.startup_name || 'Mi Organización'}
          </div>
          <div style={{
            display: 'flex', alignItems: 'center', gap: '1rem',
          }}>
            <span style={{
              fontFamily: 'var(--font-body)', fontSize: '0.8125rem',
              color: 'var(--color-text-secondary)',
            }}>
              {appUser.full_name}
            </span>
            <div style={{
              width: 32, height: 32, borderRadius: '50%',
              background: 'var(--color-accent-light)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontFamily: 'var(--font-heading)', fontSize: '0.75rem', fontWeight: 700,
              color: 'var(--color-accent-primary)',
            }}>
              {appUser.full_name.charAt(0).toUpperCase()}
            </div>
          </div>
        </div>

        {children}
      </main>
    </div>
  )
}
