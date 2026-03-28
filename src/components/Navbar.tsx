'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Menu, X, LayoutDashboard, ShieldCheck } from 'lucide-react'
import { useAuth, type User } from '@/context/AuthContext'
import { useRouter, usePathname } from 'next/navigation'
import Link from 'next/link'

const navLinks: { label: string; href: string; isPage?: boolean }[] = [
  { label: 'Plataforma', href: '#plataforma' },
  { label: 'Diagnóstico', href: '#diagnostico' },
  { label: 'Quiénes somos', href: '#about' },
  { label: 'Para organizaciones', href: '#organizaciones' },
  { label: 'Workbook', href: '/workbook', isPage: true },
]

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)
  const { user, openAuthModal } = useAuth()
  const router = useRouter()

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 40)
    }
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const handleNavClick = (href: string) => {
    setMobileOpen(false)
    const el = document.querySelector(href)
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' })
    }
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
          backgroundColor: scrolled ? 'rgba(255, 255, 255, 0.88)' : 'transparent',
          backdropFilter: scrolled ? 'blur(20px) saturate(180%)' : 'none',
          WebkitBackdropFilter: scrolled ? 'blur(20px) saturate(180%)' : 'none',
          borderBottom: scrolled ? '1px solid var(--color-border)' : '1px solid transparent',
          transition: 'all 0.3s ease',
        }}
      >
        <div style={{ maxWidth: 1200, margin: '0 auto', padding: '0 1.5rem' }}>
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              height: 64,
            }}
          >
            {/* Logo */}
            <a
              href="#"
              onClick={(e) => {
                e.preventDefault()
                window.scrollTo({ top: 0, behavior: 'smooth' })
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
              {navLinks.map((link) => (
                'isPage' in link && link.isPage ? (
                  <Link
                    key={link.href}
                    href={link.href}
                    style={{
                      fontFamily: 'var(--font-body)',
                      fontSize: '0.8125rem',
                      fontWeight: 500,
                      color: 'var(--color-text-secondary)',
                      textDecoration: 'none',
                      transition: 'color 0.2s ease',
                    }}
                    onMouseEnter={(e) => (e.currentTarget.style.color = 'var(--color-text-primary)')}
                    onMouseLeave={(e) => (e.currentTarget.style.color = 'var(--color-text-secondary)')}
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
                    style={{
                      fontFamily: 'var(--font-body)',
                      fontSize: '0.8125rem',
                      fontWeight: 500,
                      color: 'var(--color-text-secondary)',
                      textDecoration: 'none',
                      transition: 'color 0.2s ease',
                    }}
                    onMouseEnter={(e) => (e.currentTarget.style.color = 'var(--color-text-primary)')}
                    onMouseLeave={(e) => (e.currentTarget.style.color = 'var(--color-text-secondary)')}
                  >
                    {link.label}
                  </a>
                )
              ))}
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
                    fontSize: '0.8125rem',
                    fontWeight: 500,
                    color: 'var(--color-text-secondary)',
                    textDecoration: 'none',
                    transition: 'color 0.2s ease',
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.color = 'var(--color-text-primary)')}
                  onMouseLeave={(e) => (e.currentTarget.style.color = 'var(--color-text-secondary)')}
                >
                  <ShieldCheck size={14} /> Panel admin
                </Link>
              )}
              {user ? (
                <button
                  onClick={() => router.push('/tools')}
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '0.375rem',
                    padding: '0.5rem 1.125rem',
                    borderRadius: 9999,
                    backgroundColor: '#059669',
                    color: '#FFFFFF',
                    fontFamily: 'var(--font-body)',
                    fontSize: '0.8125rem',
                    fontWeight: 600,
                    border: 'none',
                    cursor: 'pointer',
                    transition: 'all 0.2s ease',
                    boxShadow: '0 2px 8px rgba(5, 150, 105, 0.25)',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = '#047857'
                    e.currentTarget.style.transform = 'scale(1.03)'
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = '#059669'
                    e.currentTarget.style.transform = 'scale(1)'
                  }}
                >
                  <LayoutDashboard size={14} /> Mi Plataforma
                </button>
              ) : (
                <button
                  onClick={() => openAuthModal('login')}
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '0.375rem',
                    padding: '0.5rem 1.25rem',
                    borderRadius: 9999,
                    backgroundColor: '#059669',
                    color: '#FFFFFF',
                    fontFamily: 'var(--font-body)',
                    fontSize: '0.8125rem',
                    fontWeight: 600,
                    border: 'none',
                    cursor: 'pointer',
                    transition: 'all 0.2s ease',
                    boxShadow: '0 2px 8px rgba(5, 150, 105, 0.25)',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = '#047857'
                    e.currentTarget.style.transform = 'scale(1.03)'
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = '#059669'
                    e.currentTarget.style.transform = 'scale(1)'
                  }}
                >
                  Acceder al Toolkit
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
              transition={{ duration: 0.2 }}
              style={{
                position: 'fixed',
                inset: 0,
                zIndex: 55,
                backgroundColor: 'rgba(0, 0, 0, 0.3)',
              }}
              onClick={() => setMobileOpen(false)}
            />
            {/* Drawer */}
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'tween', duration: 0.3, ease: 'easeInOut' }}
              style={{
                position: 'fixed',
                top: 0,
                right: 0,
                bottom: 0,
                zIndex: 60,
                width: 280,
                backgroundColor: '#FFFFFF',
                borderLeft: '1px solid var(--color-border)',
                display: 'flex',
                flexDirection: 'column',
                paddingTop: '5rem',
                paddingLeft: '1.5rem',
                paddingRight: '1.5rem',
                paddingBottom: '2rem',
              }}
            >
              <button
                onClick={() => setMobileOpen(false)}
                style={{
                  position: 'absolute',
                  top: 16,
                  right: 16,
                  padding: 8,
                  border: 'none',
                  background: 'transparent',
                  color: 'var(--color-text-secondary)',
                  cursor: 'pointer',
                }}
              >
                <X size={22} />
              </button>

              <nav style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                {navLinks.map((link) => {
                  const linkStyle = {
                    padding: '0.75rem 1rem',
                    borderRadius: 10,
                    fontFamily: 'var(--font-body)',
                    fontSize: '0.875rem',
                    fontWeight: 500,
                    color: 'var(--color-text-secondary)',
                    textDecoration: 'none',
                    transition: 'all 0.2s ease',
                    display: 'block' as const,
                  }
                  return 'isPage' in link && link.isPage ? (
                    <Link
                      key={link.href}
                      href={link.href}
                      onClick={() => setMobileOpen(false)}
                      style={linkStyle}
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
                      width: '100%', padding: '0.75rem 1.5rem', borderRadius: 9999,
                      backgroundColor: 'transparent', color: 'var(--color-text-secondary)',
                      fontFamily: 'var(--font-body)', fontSize: '0.875rem', fontWeight: 600,
                      border: '1px solid var(--color-border)', textDecoration: 'none',
                    }}
                  >
                    <ShieldCheck size={16} /> Panel admin
                  </Link>
                )}
                {user ? (
                  <button
                    onClick={() => { setMobileOpen(false); router.push('/tools') }}
                    style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', width: '100%', padding: '0.75rem 1.5rem', borderRadius: 9999, backgroundColor: '#059669', color: '#FFFFFF', fontFamily: 'var(--font-body)', fontSize: '0.875rem', fontWeight: 600, border: 'none', cursor: 'pointer', boxShadow: '0 2px 8px rgba(5, 150, 105, 0.25)' }}
                  >
                    <LayoutDashboard size={16} /> Mi Plataforma
                  </button>
                ) : (
                  <button
                    onClick={() => { setMobileOpen(false); openAuthModal('login') }}
                    style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: '100%', padding: '0.75rem 1.5rem', borderRadius: 9999, backgroundColor: '#059669', color: '#FFFFFF', fontFamily: 'var(--font-body)', fontSize: '0.875rem', fontWeight: 600, border: 'none', cursor: 'pointer', boxShadow: '0 2px 8px rgba(5, 150, 105, 0.25)' }}
                  >
                    Acceder al Toolkit
                  </button>
                )}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  )
}
