'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Menu, X, LayoutDashboard, ShieldCheck } from 'lucide-react'
import { useAuth, type User } from '@/context/AuthContext'
import { useRouter, usePathname } from 'next/navigation'
import Link from 'next/link'
import S4CLogo from '@/components/S4CLogo'

const navLinks: { label: string; href: string; isPage?: boolean }[] = [
  { label: 'Plataforma', href: '/#plataforma' },
  { label: 'Diagnostico', href: '/#diagnostico' },
  { label: 'Quienes somos', href: '/#about' },
  { label: 'Workbook', href: '/workbook', isPage: true },
  { label: 'Para organizaciones', href: '/organizaciones', isPage: true },
]

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)
  const { user, openAuthModal } = useAuth()
  const router = useRouter()
  const pathname = usePathname()

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 40)
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const handleNavClick = (href: string) => {
    setMobileOpen(false)
    const hash = href.startsWith('/') ? href.slice(1) : href
    if (pathname === '/') {
      const el = document.querySelector(hash)
      if (el) el.scrollIntoView({ behavior: 'smooth' })
    } else {
      router.push(href)
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
          zIndex: 1000,
          backgroundColor: scrolled ? 'rgba(255,255,255,0.92)' : 'rgba(255,255,255,0.95)',
          backdropFilter: scrolled ? 'blur(12px)' : 'blur(8px)',
          WebkitBackdropFilter: scrolled ? 'blur(12px)' : 'blur(8px)',
          borderBottom: '1px solid rgba(0,0,0,0.06)',
          padding: '14px 0',
          transition: 'all 0.3s cubic-bezier(0.25,0.1,0.25,1)',
        }}
      >
        <div style={{ maxWidth: 1200, margin: '0 auto', padding: '0 clamp(1.5rem, 4vw, 5rem)' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: 40 }}>
            {/* Logo */}
            <a
              href="/"
              onClick={(e) => {
                e.preventDefault()
                if (pathname === '/') window.scrollTo({ top: 0, behavior: 'smooth' })
                else router.push('/')
              }}
              style={{ display: 'flex', alignItems: 'center', gap: '0.625rem', textDecoration: 'none' }}
            >
              <S4CLogo size={36} />
              <span
                style={{
                  fontFamily: 'var(--font-heading)',
                  fontWeight: 400,
                  fontSize: '1.05rem',
                  color: '#2A222B',
                  letterSpacing: '-0.02em',
                }}
              >
                Startups<span style={{ color: '#0D9488' }}>4</span>Climate
              </span>
            </a>

            {/* Desktop nav links (center) */}
            <div className="hidden md:flex" style={{ alignItems: 'center', gap: '2rem' }}>
              {navLinks.map((link) => {
                const linkStyle: React.CSSProperties = {
                  fontFamily: 'var(--font-body)',
                  fontSize: '15px',
                  fontWeight: 500,
                  color: '#2A222B',
                  textDecoration: 'none',
                  transition: 'opacity 0.2s ease',
                  cursor: 'pointer',
                }

                if (link.isPage) {
                  return (
                    <Link
                      key={link.href}
                      href={link.href}
                      className="nav-link-hover"
                      style={linkStyle}
                    >
                      {link.label}
                    </Link>
                  )
                }

                return (
                  <a
                    key={link.href}
                    href={link.href}
                    className="nav-link-hover"
                    onClick={(e) => { e.preventDefault(); handleNavClick(link.href) }}
                    style={linkStyle}
                  >
                    {link.label}
                  </a>
                )
              })}
            </div>

            {/* Desktop CTA (right) */}
            <div className="hidden md:flex" style={{ alignItems: 'center', gap: '0.75rem' }}>
              {user && (user as User & { role?: string }).role === 'admin' && (
                <Link
                  href="/admin"
                  className="nav-link-hover"
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '0.375rem',
                    fontFamily: 'var(--font-body)',
                    fontSize: '15px',
                    fontWeight: 500,
                    color: '#5E5A60',
                    textDecoration: 'none',
                    transition: 'opacity 0.2s ease',
                  }}
                >
                  <ShieldCheck size={15} /> Panel admin
                </Link>
              )}
              {user ? (
                <button
                  onClick={() => { window.location.href = '/tools' }}
                  className="nav-cta-btn"
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '0.5rem',
                    padding: '14px 28px',
                    borderRadius: 8,
                    backgroundColor: '#2A222B',
                    color: '#FFFFFF',
                    fontFamily: 'var(--font-body)',
                    fontSize: '15px',
                    fontWeight: 600,
                    border: 'none',
                    cursor: 'pointer',
                    transition: 'transform 0.2s ease, background-color 0.2s ease',
                  }}
                >
                  <LayoutDashboard size={15} /> Mi Plataforma
                </button>
              ) : (
                <button
                  onClick={() => openAuthModal('login')}
                  className="nav-cta-btn"
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '0.5rem',
                    padding: '14px 28px',
                    borderRadius: 8,
                    backgroundColor: '#2A222B',
                    color: '#FFFFFF',
                    fontFamily: 'var(--font-body)',
                    fontSize: '15px',
                    fontWeight: 600,
                    border: 'none',
                    cursor: 'pointer',
                    transition: 'transform 0.2s ease, background-color 0.2s ease',
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
                color: '#2A222B',
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
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.25 }}
              style={{
                position: 'fixed',
                inset: 0,
                zIndex: 1001,
                backgroundColor: 'rgba(42,34,43,0.25)',
                backdropFilter: 'blur(4px)',
                WebkitBackdropFilter: 'blur(4px)',
              }}
              onClick={() => setMobileOpen(false)}
            />
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
                zIndex: 1002,
                width: 300,
                backgroundColor: '#FFFFFF',
                boxShadow: '-8px 0 30px rgba(42,34,43,0.1)',
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
                  color: '#5E5A60',
                  cursor: 'pointer',
                }}
              >
                <X size={22} />
              </button>

              <nav style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                {navLinks.map((link) => {
                  const mobileLinkStyle: React.CSSProperties = {
                    padding: '0.875rem 1rem',
                    borderRadius: 8,
                    fontFamily: 'var(--font-body)',
                    fontSize: '15px',
                    fontWeight: 500,
                    color: '#5E5A60',
                    textDecoration: 'none',
                    transition: 'all 0.2s ease',
                    display: 'block',
                  }
                  const handleMobileEnter = (e: React.MouseEvent<HTMLAnchorElement>) => {
                    e.currentTarget.style.color = '#2A222B'
                    e.currentTarget.style.backgroundColor = '#FAF8F5'
                  }
                  const handleMobileLeave = (e: React.MouseEvent<HTMLAnchorElement>) => {
                    e.currentTarget.style.color = '#5E5A60'
                    e.currentTarget.style.backgroundColor = 'transparent'
                  }

                  return link.isPage ? (
                    <Link
                      key={link.href}
                      href={link.href}
                      onClick={() => setMobileOpen(false)}
                      style={mobileLinkStyle}
                      onMouseEnter={handleMobileEnter}
                      onMouseLeave={handleMobileLeave}
                    >
                      {link.label}
                    </Link>
                  ) : (
                    <a
                      key={link.href}
                      href={link.href}
                      onClick={(e) => { e.preventDefault(); handleNavClick(link.href) }}
                      style={mobileLinkStyle}
                      onMouseEnter={handleMobileEnter}
                      onMouseLeave={handleMobileLeave}
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
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '0.5rem',
                      width: '100%',
                      padding: '0.875rem 1.5rem',
                      borderRadius: 8,
                      backgroundColor: 'transparent',
                      color: '#5E5A60',
                      fontFamily: 'var(--font-body)',
                      fontSize: '15px',
                      fontWeight: 600,
                      border: '1px solid #E8E4DF',
                      textDecoration: 'none',
                    }}
                  >
                    <ShieldCheck size={16} /> Panel admin
                  </Link>
                )}
                {user ? (
                  <button
                    onClick={() => { setMobileOpen(false); window.location.href = '/tools' }}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '0.5rem',
                      width: '100%',
                      padding: '0.875rem 1.5rem',
                      borderRadius: 8,
                      backgroundColor: '#2A222B',
                      color: '#FFFFFF',
                      fontFamily: 'var(--font-body)',
                      fontSize: '15px',
                      fontWeight: 600,
                      border: 'none',
                      cursor: 'pointer',
                    }}
                  >
                    <LayoutDashboard size={16} /> Mi Plataforma
                  </button>
                ) : (
                  <button
                    onClick={() => { setMobileOpen(false); openAuthModal('login') }}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      width: '100%',
                      padding: '0.875rem 1.5rem',
                      borderRadius: 8,
                      backgroundColor: '#2A222B',
                      color: '#FFFFFF',
                      fontFamily: 'var(--font-body)',
                      fontSize: '15px',
                      fontWeight: 600,
                      border: 'none',
                      cursor: 'pointer',
                    }}
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
        .nav-link-hover:hover { opacity: 0.6 !important; }
        .nav-cta-btn:hover { transform: scale(1.02) !important; background-color: #1a141b !important; }
      `}</style>
    </>
  )
}
