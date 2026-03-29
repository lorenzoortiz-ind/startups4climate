'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Menu, X, LayoutDashboard, ShieldCheck } from 'lucide-react'
import { useAuth, type User } from '@/context/AuthContext'
import { useRouter, usePathname } from 'next/navigation'
import Link from 'next/link'

const navLinks: { label: string; href: string; isPage?: boolean }[] = [
  { label: 'Plataforma', href: '/#plataforma' },
  { label: 'Diagnóstico', href: '/#diagnostico' },
  { label: 'Quiénes somos', href: '/#about' },
  { label: 'Workbook', href: '/workbook', isPage: true },
  { label: 'Para organizaciones', href: '/organizaciones', isPage: true },
]

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)
  const [hoveredLink, setHoveredLink] = useState<string | null>(null)
  const { user, openAuthModal } = useAuth()
  const router = useRouter()
  const pathname = usePathname()

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 40)
    }
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const handleNavClick = (href: string) => {
    setMobileOpen(false)
    // href is like "/#plataforma" — extract the hash part
    const hash = href.startsWith('/') ? href.slice(1) : href
    if (pathname === '/') {
      // Already on landing page, just scroll
      const el = document.querySelector(hash)
      if (el) {
        el.scrollIntoView({ behavior: 'smooth' })
      }
    } else {
      // Navigate to landing page with hash
      router.push(href)
    }
  }

  const linkBaseStyle = {
    fontFamily: 'var(--font-body)',
    fontSize: '0.9375rem',
    fontWeight: 500 as const,
    color: scrolled ? 'var(--color-text-secondary)' : 'rgba(17,24,39,0.7)',
    textDecoration: 'none' as const,
    transition: 'color 0.25s ease',
    position: 'relative' as const,
    paddingBottom: '2px',
  }

  const renderNavLink = (link: typeof navLinks[0]) => {
    const isHovered = hoveredLink === link.href
    const underline = (
      <span
        style={{
          position: 'absolute',
          bottom: -2,
          left: 0,
          right: 0,
          height: 2,
          borderRadius: 1,
          background: '#059669',
          transform: isHovered ? 'scaleX(1)' : 'scaleX(0)',
          transformOrigin: 'left',
          transition: 'transform 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
        }}
      />
    )

    if (link.isPage) {
      return (
        <Link
          key={link.href}
          href={link.href}
          style={{
            ...linkBaseStyle,
            color: isHovered ? 'var(--color-text-primary)' : linkBaseStyle.color,
          }}
          onMouseEnter={() => setHoveredLink(link.href)}
          onMouseLeave={() => setHoveredLink(null)}
        >
          {link.label}
          {underline}
        </Link>
      )
    }

    return (
      <a
        key={link.href}
        href={link.href}
        onClick={(e) => {
          e.preventDefault()
          handleNavClick(link.href)
        }}
        style={{
          ...linkBaseStyle,
          color: isHovered ? 'var(--color-text-primary)' : linkBaseStyle.color,
        }}
        onMouseEnter={() => setHoveredLink(link.href)}
        onMouseLeave={() => setHoveredLink(null)}
      >
        {link.label}
        {underline}
      </a>
    )
  }

  return (
    <>
      <nav
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          zIndex: 50,
          backgroundColor: scrolled ? 'rgba(255, 255, 255, 0.92)' : 'transparent',
          backdropFilter: scrolled ? 'blur(16px) saturate(180%)' : 'none',
          WebkitBackdropFilter: scrolled ? 'blur(16px) saturate(180%)' : 'none',
          borderBottom: scrolled ? '1px solid rgba(0,0,0,0.06)' : '1px solid transparent',
          transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
        }}
      >
        <div style={{ maxWidth: 1200, margin: '0 auto', padding: '0 1.5rem' }}>
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              height: 72,
            }}
          >
            {/* Logo */}
            <a
              href="/"
              onClick={(e) => {
                e.preventDefault()
                if (pathname === '/') {
                  window.scrollTo({ top: 0, behavior: 'smooth' })
                } else {
                  router.push('/')
                }
              }}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.625rem',
                textDecoration: 'none',
              }}
            >
              <div
                style={{
                  width: 36,
                  height: 36,
                  borderRadius: 10,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  background: 'linear-gradient(135deg, #059669, #047857)',
                  color: '#fff',
                  fontFamily: 'var(--font-mono)',
                  fontSize: 13,
                  fontWeight: 700,
                  letterSpacing: '0.02em',
                }}
              >
                S4C
              </div>
              <span
                style={{
                  fontFamily: 'var(--font-heading)',
                  fontWeight: 700,
                  fontSize: '1.05rem',
                  color: 'var(--color-text-primary)',
                  letterSpacing: '-0.01em',
                }}
              >
                Startups<span style={{ color: '#059669' }}>4</span>Climate
              </span>
            </a>

            {/* Desktop nav links */}
            <div
              className="hidden md:flex"
              style={{
                alignItems: 'center',
                gap: '2rem',
              }}
            >
              {navLinks.map(renderNavLink)}
            </div>

            {/* Desktop CTA */}
            <div className="hidden md:flex" style={{ alignItems: 'center', gap: '0.75rem' }}>
              {user && (user as User & { role?: string }).role === 'admin' && (
                <Link
                  href="/admin"
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '0.375rem',
                    fontFamily: 'var(--font-body)',
                    fontSize: '0.9375rem',
                    fontWeight: 500,
                    color: 'var(--color-text-secondary)',
                    textDecoration: 'none',
                    transition: 'color 0.25s ease',
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.color = 'var(--color-text-primary)')}
                  onMouseLeave={(e) => (e.currentTarget.style.color = 'var(--color-text-secondary)')}
                >
                  <ShieldCheck size={15} /> Panel admin
                </Link>
              )}
              {user ? (
                <button
                  onClick={() => { window.location.href = '/tools' }}
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '0.5rem',
                    padding: '0.5rem 1.25rem',
                    borderRadius: 9999,
                    backgroundColor: '#059669',
                    color: '#FFFFFF',
                    fontFamily: 'var(--font-body)',
                    fontSize: '0.875rem',
                    fontWeight: 600,
                    border: 'none',
                    cursor: 'pointer',
                    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                    boxShadow: '0 2px 8px rgba(5, 150, 105, 0.2)',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = '#047857'
                    e.currentTarget.style.transform = 'translateY(-1px)'
                    e.currentTarget.style.boxShadow = '0 4px 16px rgba(5, 150, 105, 0.3)'
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = '#059669'
                    e.currentTarget.style.transform = 'translateY(0)'
                    e.currentTarget.style.boxShadow = '0 2px 8px rgba(5, 150, 105, 0.2)'
                  }}
                >
                  <LayoutDashboard size={15} /> Mi Plataforma
                </button>
              ) : (
                <button
                  onClick={() => openAuthModal('login')}
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '0.375rem',
                    padding: '0.5rem 1.5rem',
                    borderRadius: 9999,
                    backgroundColor: '#059669',
                    color: '#FFFFFF',
                    fontFamily: 'var(--font-body)',
                    fontSize: '0.875rem',
                    fontWeight: 600,
                    border: 'none',
                    cursor: 'pointer',
                    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                    boxShadow: '0 2px 8px rgba(5, 150, 105, 0.2)',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = '#047857'
                    e.currentTarget.style.transform = 'translateY(-1px)'
                    e.currentTarget.style.boxShadow = '0 4px 16px rgba(5, 150, 105, 0.3)'
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = '#059669'
                    e.currentTarget.style.transform = 'translateY(0)'
                    e.currentTarget.style.boxShadow = '0 2px 8px rgba(5, 150, 105, 0.2)'
                  }}
                >
                  Acceder gratis
                </button>
              )}
            </div>

            {/* Mobile hamburger */}
            <button
              className="md:hidden"
              onClick={() => setMobileOpen((v) => !v)}
              aria-label="Toggle menu"
              style={{
                padding: 8,
                borderRadius: 8,
                border: 'none',
                background: 'transparent',
                color: 'var(--color-text-primary)',
                cursor: 'pointer',
                transition: 'transform 0.2s ease',
              }}
            >
              {mobileOpen ? <X size={22} /> : <Menu size={22} />}
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile drawer */}
      <AnimatePresence>
        {mobileOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.25 }}
              style={{
                position: 'fixed',
                inset: 0,
                zIndex: 55,
                backgroundColor: 'rgba(0, 0, 0, 0.2)',
                backdropFilter: 'blur(4px)',
                WebkitBackdropFilter: 'blur(4px)',
              }}
              onClick={() => setMobileOpen(false)}
            />
            {/* Drawer */}
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 30, stiffness: 300 }}
              style={{
                position: 'fixed',
                top: 0,
                right: 0,
                bottom: 0,
                zIndex: 60,
                width: 300,
                backgroundColor: '#FFFFFF',
                boxShadow: '-8px 0 30px rgba(0,0,0,0.08)',
                display: 'flex',
                flexDirection: 'column',
                paddingTop: '5rem',
                paddingLeft: '1.75rem',
                paddingRight: '1.75rem',
                paddingBottom: '2rem',
              }}
            >
              <button
                onClick={() => setMobileOpen(false)}
                style={{
                  position: 'absolute',
                  top: 18,
                  right: 18,
                  padding: 8,
                  borderRadius: 8,
                  border: 'none',
                  background: 'transparent',
                  color: 'var(--color-text-secondary)',
                  cursor: 'pointer',
                  transition: 'color 0.2s ease',
                }}
              >
                <X size={22} />
              </button>

              <nav style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                {navLinks.map((link) => {
                  const linkStyle = {
                    padding: '0.875rem 1rem',
                    borderRadius: 12,
                    fontFamily: 'var(--font-body)',
                    fontSize: '0.9375rem',
                    fontWeight: 500 as const,
                    color: 'var(--color-text-secondary)',
                    textDecoration: 'none' as const,
                    transition: 'all 0.2s ease',
                    display: 'block' as const,
                  }
                  return 'isPage' in link && link.isPage ? (
                    <Link
                      key={link.href}
                      href={link.href}
                      onClick={() => setMobileOpen(false)}
                      style={linkStyle}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.color = 'var(--color-text-primary)'
                        e.currentTarget.style.backgroundColor = '#F0FDF4'
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.color = 'var(--color-text-secondary)'
                        e.currentTarget.style.backgroundColor = 'transparent'
                      }}
                    >
                      {link.label}
                    </Link>
                  ) : (
                    <a
                      key={link.href}
                      href={link.href}
                      onClick={(e) => {
                        e.preventDefault()
                        handleNavClick(link.href)
                      }}
                      style={linkStyle}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.color = 'var(--color-text-primary)'
                        e.currentTarget.style.backgroundColor = '#F0FDF4'
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.color = 'var(--color-text-secondary)'
                        e.currentTarget.style.backgroundColor = 'transparent'
                      }}
                    >
                      {link.label}
                    </a>
                  )
                })}
              </nav>

              <div style={{ marginTop: 'auto', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                {user && (user as User & { role?: string }).role === 'admin' && (
                  <Link
                    href="/admin"
                    onClick={() => setMobileOpen(false)}
                    style={{
                      display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem',
                      width: '100%', padding: '0.875rem 1.5rem', borderRadius: 9999,
                      backgroundColor: 'transparent', color: 'var(--color-text-secondary)',
                      fontFamily: 'var(--font-body)', fontSize: '0.9375rem', fontWeight: 600,
                      border: '1px solid var(--color-border)', textDecoration: 'none',
                      transition: 'all 0.2s ease',
                    }}
                  >
                    <ShieldCheck size={16} /> Panel admin
                  </Link>
                )}
                {user ? (
                  <button
                    onClick={() => { setMobileOpen(false); window.location.href = '/tools' }}
                    style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', width: '100%', padding: '0.875rem 1.5rem', borderRadius: 9999, backgroundColor: '#059669', color: '#FFFFFF', fontFamily: 'var(--font-body)', fontSize: '0.9375rem', fontWeight: 600, border: 'none', cursor: 'pointer', boxShadow: '0 2px 12px rgba(5, 150, 105, 0.25)', transition: 'all 0.2s ease' }}
                  >
                    <LayoutDashboard size={16} /> Mi Plataforma
                  </button>
                ) : (
                  <button
                    onClick={() => { setMobileOpen(false); openAuthModal('login') }}
                    style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: '100%', padding: '0.875rem 1.5rem', borderRadius: 9999, backgroundColor: '#059669', color: '#FFFFFF', fontFamily: 'var(--font-body)', fontSize: '0.9375rem', fontWeight: 600, border: 'none', cursor: 'pointer', boxShadow: '0 2px 12px rgba(5, 150, 105, 0.25)', transition: 'all 0.2s ease' }}
                  >
                    Acceder gratis
                  </button>
                )}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      <style>{`
        @media (max-width: 767px) {
          nav > div > div {
            height: 60px !important;
          }
        }
      `}</style>
    </>
  )
}
