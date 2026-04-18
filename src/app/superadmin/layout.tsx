'use client'

import { useState, useEffect } from 'react'
import { usePathname, useRouter } from 'next/navigation'
import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'
import {
  LayoutDashboard,
  LogOut,
  Menu,
  X,
  ChevronLeft,
  Building2,
  UsersRound,
  Activity,
  LifeBuoy,
  ScrollText,
  Wrench,
  Shield,
  Briefcase,
} from 'lucide-react'
import { ErrorBoundary } from '@/components/ErrorBoundary'
import S4CLogo from '@/components/S4CLogo'
import { useAuth } from '@/context/AuthContext'
import { SuperadminProvider } from '@/context/SuperadminContext'
import { supabase } from '@/lib/supabase'
import DemoLinkRewriter from '@/components/DemoLinkRewriter'

const NAV_ITEMS = [
  { href: '/superadmin', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/superadmin/programas', label: 'Programas', icon: Briefcase },
  { href: '/superadmin/organizaciones', label: 'Organizaciones', icon: Building2 },
  { href: '/superadmin/usuarios', label: 'Usuarios', icon: UsersRound },
  { href: '/superadmin/metricas', label: 'Métricas globales', icon: Activity },
  { href: '/superadmin/incidencias', label: 'Incidencias', icon: LifeBuoy },
  { href: '/superadmin/actividad', label: 'Actividad', icon: ScrollText },
  { href: '/superadmin/plataforma', label: 'Plataforma', icon: Wrench },
] as const

export default function SuperadminLayout({ children }: { children: React.ReactNode }) {
  const { appUser, loading, logout, isDemo } = useAuth()
  const pathname = usePathname()
  const router = useRouter()
  const [mobileOpen, setMobileOpen] = useState(false)
  const [orgLogo, setOrgLogo] = useState<string | null>(null)
  const [orgName, setOrgName] = useState<string | null>(null)

  useEffect(() => {
    setMobileOpen(false)
  }, [pathname])

  useEffect(() => {
    // Demo / superadmin display info — MINPRO branding
    if (isDemo) {
      setOrgLogo(null)
      setOrgName('Ministerio de la Producción')
      return
    }
    if (!appUser?.org_id) {
      setOrgName('Ministerio de la Producción')
      return
    }
    supabase
      .from('organizations')
      .select('name, logo_url')
      .eq('id', appUser.org_id)
      .maybeSingle()
      .then(({ data }) => {
        if (data) {
          setOrgLogo(data.logo_url)
          setOrgName(data.name)
        } else {
          setOrgName('Ministerio de la Producción')
        }
      })
  }, [appUser?.org_id, isDemo])

  // Route guards — superadmin only
  useEffect(() => {
    if (loading) return
    if (!appUser) {
      router.replace('/')
      return
    }
    if (appUser.role === 'admin_org') {
      router.replace('/admin')
      return
    }
    if (appUser.role !== 'superadmin') {
      router.replace('/tools')
    }
  }, [loading, appUser, router])

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
          border: '3px solid #E5E7EB', borderTopColor: '#DA4E24',
          animation: 'spin 0.8s linear infinite',
        }} />
      </div>
    )
  }

  if (!appUser) return null
  if (appUser.role !== 'superadmin') return null

  const isActive = (href: string) => {
    if (href === '/superadmin') return pathname === '/superadmin'
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
        padding: '0 0.5rem', marginBottom: '1.25rem',
      }}>
        {orgLogo ? (
          <img
            src={orgLogo}
            alt={orgName || 'Logo'}
            style={{
              width: 36, height: 36, borderRadius: 8,
              objectFit: 'contain', background: '#fff',
              flexShrink: 0,
            }}
          />
        ) : (
          <div style={{ flexShrink: 0, display: 'flex' }}>
            <S4CLogo size={36} />
          </div>
        )}
        <div style={{ minWidth: 0 }}>
          <div style={{
            fontFamily: 'var(--font-heading)', fontWeight: 700,
            fontSize: '0.75rem', color: '#F1F5F9',
            lineHeight: 1.2,
            overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
          }}>
            {orgName || 'S4C Superadmin'}
          </div>
          <div style={{
            fontFamily: 'var(--font-body)', fontSize: '0.625rem',
            color: '#94A3B8', opacity: 0.7,
          }}>
            Panel de gobierno
          </div>
        </div>
      </div>

      {/* Role badge */}
      <div style={{
        display: 'inline-flex', alignItems: 'center', gap: '0.3rem',
        background: 'rgba(218,78,36,0.15)',
        color: '#DA4E24',
        fontFamily: 'var(--font-body)',
        fontSize: '0.5625rem',
        fontWeight: 600,
        textTransform: 'uppercase',
        padding: '0.2rem 0.5rem',
        borderRadius: 4,
        letterSpacing: '0.06em',
        marginBottom: '0.75rem',
        width: 'fit-content',
      }}>
        <Shield size={10} />
        Super Administrador
      </div>

      {/* Navigation */}
      <nav style={{ display: 'flex', flexDirection: 'column', gap: '0.375rem', flex: 1 }}>
        {NAV_ITEMS.map((item) => {
          const active = isActive(item.href)
          const Icon = item.icon
          return (
            <Link
              key={item.href}
              href={item.href}
              style={{
                display: 'flex', alignItems: 'center', gap: '0.75rem',
                padding: '0.625rem 0.75rem', borderRadius: 'var(--radius-full)',
                textDecoration: 'none', transition: 'all 0.15s ease',
                background: active ? 'var(--color-admin-sidebar-active)' : 'transparent',
                color: active ? '#fff' : '#94A3B8',
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
                  e.currentTarget.style.color = '#94A3B8'
                }
              }}
            >
              <Icon size={18} />
              <span style={{
                fontFamily: 'var(--font-body)', fontSize: '0.75rem',
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

        <div style={{
          padding: '0.75rem',
          borderRadius: 'var(--radius-sm)',
          background: 'rgba(255,255,255,0.04)',
          marginBottom: '0.75rem',
        }}>
          <div style={{
            fontFamily: 'var(--font-body)', fontSize: '0.6875rem',
            fontWeight: 600, color: '#F1F5F9', marginBottom: '0.125rem',
          }}>
            {appUser.full_name}
          </div>
          <div style={{
            fontFamily: 'var(--font-body)', fontSize: '0.625rem',
            color: '#94A3B8', opacity: 0.7,
          }}>
            {appUser.email}
          </div>
        </div>

        <Link href="/tools" style={{
          display: 'flex', alignItems: 'center', gap: '0.5rem',
          padding: '0.5rem 0.75rem', borderRadius: 'var(--radius-sm)',
          textDecoration: 'none', transition: 'color 0.15s',
          color: '#94A3B8',
          fontFamily: 'var(--font-body)', fontSize: '0.6875rem',
          background: 'none', border: 'none', width: '100%',
          marginBottom: '0.25rem',
        }}>
          <ChevronLeft size={16} />
          Ir a la plataforma
        </Link>

        <button
          onClick={async () => { await logout(); router.replace('/') }}
          style={{
            display: 'flex', alignItems: 'center', gap: '0.5rem',
            padding: '0.5rem 0.75rem', borderRadius: 'var(--radius-sm)',
            background: 'transparent', border: 'none', cursor: 'pointer',
            color: '#94A3B8',
            fontFamily: 'var(--font-body)', fontSize: '0.6875rem',
            width: '100%', textAlign: 'left', transition: 'color 0.15s',
          }}
          onMouseEnter={(e) => (e.currentTarget.style.color = '#FCA5A5')}
          onMouseLeave={(e) => (e.currentTarget.style.color = '#94A3B8')}
        >
          <LogOut size={16} />
          Cerrar sesión
        </button>
      </div>
    </div>
  )

  return (
    <SuperadminProvider>
    <div data-app-layout style={{ display: 'flex', minHeight: '100vh', background: 'var(--color-bg-primary)' }}>
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
          display: 'flex',
          position: 'fixed', top: 0, left: 0, right: 0, zIndex: 50,
          height: 56, background: 'var(--color-admin-sidebar-bg)',
          alignItems: 'center', justifyContent: 'space-between',
          padding: '0 1rem',
        }}
      >
        <div style={{
          display: 'flex', alignItems: 'center', gap: '0.5rem',
        }}>
          <S4CLogo size={28} />
          <span style={{
            fontFamily: 'var(--font-heading)', fontWeight: 700,
            fontSize: '0.75rem', color: '#F1F5F9',
          }}>
            S4C Superadmin
          </span>
        </div>
        <button
          onClick={() => setMobileOpen((o) => !o)}
          aria-label={mobileOpen ? "Cerrar menú" : "Abrir menú"}
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
            fontSize: '0.8125rem', color: 'var(--color-text-primary)',
          }}>
            {orgName || 'Superadmin'}
          </div>
          <div style={{
            display: 'flex', alignItems: 'center', gap: '1rem',
          }}>
            <span style={{
              fontFamily: 'var(--font-body)', fontSize: '0.6875rem',
              color: 'var(--color-text-secondary)',
            }}>
              {appUser.full_name}
            </span>
            <div style={{
              width: 32, height: 32, borderRadius: '50%',
              background: 'var(--color-accent-light)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontFamily: 'var(--font-heading)', fontSize: '0.625rem', fontWeight: 700,
              color: 'var(--color-accent-primary)',
            }}>
              {appUser.full_name.charAt(0).toUpperCase()}
            </div>
          </div>
        </div>

        <ErrorBoundary>{children}</ErrorBoundary>
      </main>

      {/* Keep browser URL within /demo-superadmin/* during demo sessions */}
      <DemoLinkRewriter />
    </div>
    </SuperadminProvider>
  )
}
