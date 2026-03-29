'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Menu, X, LayoutDashboard, ShieldCheck } from 'lucide-react'
import { useAuth, type User } from '@/context/AuthContext'
import { useRouter, usePathname } from 'next/navigation'
import Link from 'next/link'
import S4CLogo from '@/components/S4CLogo'

/* ── Typeform-inspired color tokens ── */
const colors = {
  ink: '#2A222B',
  paper: '#FFFFFF',
  cream: '#FAF8F5',
  coral: '#FF6B4A',
  coralHover: '#E85D3A',
  teal: '#0D9488',
  tealHover: '#0B7C72',
  midGray: '#93908C',
  warmGray: '#E8E4DF',
  textPrimary: '#2A222B',
  textSecondary: '#5E5A60',
  borderSubtle: 'rgba(0,0,0,0.05)',
}

const navLinks: { label: string; href: string; isPage?: boolean }[] = [
  { label: 'Plataforma', href: '/#plataforma' },
  { label: 'Diagn\u00f3stico', href: '/#diagnostico' },
  { label: 'Qui\u00e9nes somos', href: '/#about' },
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
    const hash = href.startsWith('/') ? href.slice(1) : href
    if (pathname === '/') {
      const el = document.querySelector(hash)
      if (el) {
        el.scrollIntoView({ behavior: 'smooth' })
      }
    } else {
      router.push(href)
    }
  }

  /* ── Shared link style (desktop) ── */
  const linkBaseStyle: React.CSSProperties = {
    fontFamily: "'Inter', var(--font-body), sans-serif",
    fontSize: '16px',
    fontWeight: 400,
    color: colors.ink,
    textDecoration: 'none',
    position: 'relative',
    paddingBottom: '4px',
    transition: 'color 0.2s ease',
    cursor: 'pointer',
  }

  /* ── Desktop underline slide-in ── */
  const renderNavLink = (link: typeof navLinks[0]) => {
    const isHovered = hoveredLink === link.href
    const underline = (
      <span
        style={{
          position: 'absolute',
          bottom: 0,
          left: 0,
          width: '100%',
          height: 2,
          borderRadius: 1,
          background: colors.ink,
          transform: isHovered ? 'scaleX(1)' : 'scaleX(0)',
          transformOrigin: 'left',
          transition: 'transform 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
        }}
      />
    )

    const sharedProps = {
      style: {
        ...linkBaseStyle,
        color: isHovered ? colors.ink : colors.ink,
      } as React.CSSProperties,
      onMouseEnter: () => setHoveredLink(link.href),
      onMouseLeave: () => setHoveredLink(null),
    }

    if (link.isPage) {
      return (
        <Link key={link.href} href={link.href} {...sharedProps}>
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
        {...sharedProps}
      >
        {link.label}
        {underline}
      </a>
    )
  }

  /* ── CTA button style (desktop) ── */
  const ctaStyle: React.CSSProperties = {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '0.5rem',
    padding: '14px 28px',
    borderRadius: 8,
    backgroundColor: colors.ink,
    color: colors.paper,
    fontFamily: "'Inter', var(--font-body), sans-serif",
    fontSize: '0.9375rem',
    fontWeight: 600,
    border: 'none',
    cursor: 'pointer',
    transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
    textDecoration: 'none',
  }

  const handleCtaEnter = (e: React.MouseEvent<HTMLButtonElement | HTMLAnchorElement>) => {
    e.currentTarget.style.transform = 'scale(1.02)'
    e.currentTarget.style.backgroundColor = '#1a141b'
  }
  const handleCtaLeave = (e: React.MouseEvent<HTMLButtonElement | HTMLAnchorElement>) => {
    e.currentTarget.style.transform = 'scale(1)'
    e.currentTarget.style.backgroundColor = colors.ink
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
          backgroundColor: scrolled ? 'rgba(255, 255, 255, 0.95)' : 'rgba(255, 255, 255, 0.95)',
          backdropFilter: 'blur(8px)',
          WebkitBackdropFilter: 'blur(8px)',
          borderBottom: `1px solid ${colors.borderSubtle}`,
          padding: '16px 0',
          transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
        }}
      >
        <div style={{ maxWidth: 1200, margin: '0 auto', padding: '0 1.5rem' }}>
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              height: 40,
            }}
          >
            {/* ── Logo ── */}
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
              <S4CLogo size={36} />
              <span
                style={{
                  fontFamily: "'Inter', var(--font-heading), sans-serif",
                  fontWeight: 700,
                  fontSize: '1.05rem',
                  color: colors.ink,
                  letterSpacing: '-0.01em',
                }}
              >
                Startups<span style={{ color: colors.teal }}>4</span>Climate
              </span>
            </a>

            {/* ── Desktop nav links (center) ── */}
            <div
              className="hidden md:flex"
              style={{
                alignItems: 'center',
                gap: '2rem',
              }}
            >
              {navLinks.map(renderNavLink)}
            </div>

            {/* ── Desktop CTA (right) ── */}
            <div className="hidden md:flex" style={{ alignItems: 'center', gap: '0.75rem' }}>
              {user && (user as User & { role?: string }).role === 'admin' && (
                <Link
                  href="/admin"
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '0.375rem',
                    fontFamily: "'Inter', var(--font-body), sans-serif",
                    fontSize: '0.9375rem',
                    fontWeight: 500,
                    color: colors.textSecondary,
                    textDecoration: 'none',
                    transition: 'color 0.2s ease',
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.color = colors.ink)}
                  onMouseLeave={(e) => (e.currentTarget.style.color = colors.textSecondary)}
                >
                  <ShieldCheck size={15} /> Panel admin
                </Link>
              )}
              {user ? (
                <button
                  onClick={() => { window.location.href = '/tools' }}
                  style={ctaStyle}
                  onMouseEnter={handleCtaEnter}
                  onMouseLeave={handleCtaLeave}
                >
                  <LayoutDashboard size={15} /> Mi Plataforma
                </button>
              ) : (
                <button
                  onClick={() => openAuthModal('login')}
                  style={ctaStyle}
                  onMouseEnter={handleCtaEnter}
                  onMouseLeave={handleCtaLeave}
                >
                  Acceder gratis
                </button>
              )}
            </div>

            {/* ── Mobile hamburger ── */}
            <button
              className="md:hidden"
              onClick={() => setMobileOpen((v) => !v)}
              aria-label="Toggle menu"
              style={{
                padding: 8,
                borderRadius: 8,
                border: 'none',
                background: 'transparent',
                color: colors.ink,
                cursor: 'pointer',
                transition: 'transform 0.2s ease',
              }}
            >
              {mobileOpen ? <X size={22} /> : <Menu size={22} />}
            </button>
          </div>
        </div>
      </nav>

      {/* ── Mobile drawer ── */}
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
                zIndex: 1001,
                backgroundColor: 'rgba(42, 34, 43, 0.25)',
                backdropFilter: 'blur(4px)',
                WebkitBackdropFilter: 'blur(4px)',
              }}
              onClick={() => setMobileOpen(false)}
            />
            {/* Drawer panel */}
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
                backgroundColor: colors.paper,
                boxShadow: '-8px 0 30px rgba(42, 34, 43, 0.1)',
                display: 'flex',
                flexDirection: 'column',
                paddingTop: '5rem',
                paddingLeft: '1.75rem',
                paddingRight: '1.75rem',
                paddingBottom: '2rem',
              }}
            >
              {/* Close button */}
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
                  color: colors.textSecondary,
                  cursor: 'pointer',
                  transition: 'color 0.2s ease',
                }}
              >
                <X size={22} />
              </button>

              {/* Mobile nav links */}
              <nav style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                {navLinks.map((link) => {
                  const mobileLinkStyle: React.CSSProperties = {
                    padding: '0.875rem 1rem',
                    borderRadius: 8,
                    fontFamily: "'Inter', var(--font-body), sans-serif",
                    fontSize: '0.9375rem',
                    fontWeight: 500,
                    color: colors.textSecondary,
                    textDecoration: 'none',
                    transition: 'all 0.2s ease',
                    display: 'block',
                  }
                  const handleMobileEnter = (e: React.MouseEvent<HTMLAnchorElement>) => {
                    e.currentTarget.style.color = colors.ink
                    e.currentTarget.style.backgroundColor = colors.cream
                  }
                  const handleMobileLeave = (e: React.MouseEvent<HTMLAnchorElement>) => {
                    e.currentTarget.style.color = colors.textSecondary
                    e.currentTarget.style.backgroundColor = 'transparent'
                  }

                  return 'isPage' in link && link.isPage ? (
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
                      onClick={(e) => {
                        e.preventDefault()
                        handleNavClick(link.href)
                      }}
                      style={mobileLinkStyle}
                      onMouseEnter={handleMobileEnter}
                      onMouseLeave={handleMobileLeave}
                    >
                      {link.label}
                    </a>
                  )
                })}
              </nav>

              {/* Mobile CTA area */}
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
                      color: colors.textSecondary,
                      fontFamily: "'Inter', var(--font-body), sans-serif",
                      fontSize: '0.9375rem',
                      fontWeight: 600,
                      border: `1px solid ${colors.warmGray}`,
                      textDecoration: 'none',
                      transition: 'all 0.2s ease',
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
                      backgroundColor: colors.ink,
                      color: colors.paper,
                      fontFamily: "'Inter', var(--font-body), sans-serif",
                      fontSize: '0.9375rem',
                      fontWeight: 600,
                      border: 'none',
                      cursor: 'pointer',
                      transition: 'all 0.2s ease',
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
                      backgroundColor: colors.ink,
                      color: colors.paper,
                      fontFamily: "'Inter', var(--font-body), sans-serif",
                      fontSize: '0.9375rem',
                      fontWeight: 600,
                      border: 'none',
                      cursor: 'pointer',
                      transition: 'all 0.2s ease',
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
        @media (max-width: 767px) {
          nav > div > div {
            height: 28px !important;
          }
        }
      `}</style>
    </>
  )
}
