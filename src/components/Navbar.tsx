'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Menu, X, ArrowRight } from 'lucide-react'
import { useAuth, type User } from '@/context/AuthContext'
import { useRouter, usePathname } from 'next/navigation'
import Link from 'next/link'
import S4CLogo from '@/components/S4CLogo'

const navLinks: { label: string; href: string; isPage?: boolean }[] = [
  { label: 'Plataforma', href: '/#plataforma' },
  { label: 'Diagnóstico', href: '/#diagnostico' },
  { label: 'Quiénes somos', href: '/#about' },
  { label: 'Workbook', href: '/workbook', isPage: true },
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
          backgroundColor: scrolled ? 'rgba(247, 246, 242, 0.95)' : 'transparent',
          backdropFilter: scrolled ? 'blur(12px)' : 'none',
          borderBottom: scrolled ? '1px solid var(--color-border)' : '1px solid transparent',
          padding: '1rem 0',
          transition: 'all 0.3s var(--ease-smooth)',
        }}
      >
        <div style={{ maxWidth: 'var(--container-max)', margin: '0 auto', padding: '0 var(--container-px)' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: 48 }}>
            
            {/* Logo */}
            <a
              href="/"
              onClick={(e) => {
                e.preventDefault()
                if (pathname === '/') window.scrollTo({ top: 0, behavior: 'smooth' })
                else router.push('/')
              }}
              style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', textDecoration: 'none' }}
            >
              <S4CLogo size={32} />
              <span
                style={{
                  fontFamily: 'var(--font-heading)',
                  fontWeight: 700,
                  fontSize: '1.2rem',
                  color: 'var(--color-ink)',
                  letterSpacing: '-0.03em',
                }}
              >
                Startups<span style={{ color: '#FF6B4A' }}>4</span>Climate
              </span>
            </a>

            {/* Desktop Navigation */}
            <div className="hidden md:flex" style={{ alignItems: 'center', gap: '2.5rem' }}>
              {navLinks.map((link) => {
                const linkStyle: React.CSSProperties = {
                  fontFamily: 'var(--font-body)',
                  fontSize: '1rem',
                  fontWeight: 500,
                  color: 'var(--color-ink)',
                  textDecoration: 'none',
                  opacity: 0.8,
                  transition: 'opacity 0.2s ease',
                  cursor: 'pointer',
                }

                if (link.isPage) {
                  return (
                    <Link key={link.href} href={link.href} className="nav-hover" style={linkStyle}>
                      {link.label}
                    </Link>
                  )
                }

                return (
                  <a
                    key={link.href}
                    href={link.href}
                    className="nav-hover"
                    onClick={(e) => { e.preventDefault(); handleNavClick(link.href) }}
                    style={linkStyle}
                  >
                    {link.label}
                  </a>
                )
              })}
            </div>

            {/* Desktop CTAs */}
            <div className="hidden md:flex" style={{ alignItems: 'center', gap: '1rem' }}>
              {user ? (
                <button
                  onClick={() => { window.location.href = '/tools' }}
                  className="typeform-btn"
                >
                  Dashboard <ArrowRight size={18} />
                </button>
              ) : (
                <button
                  onClick={() => openAuthModal('login')}
                  className="typeform-btn"
                >
                  Ingresar
                </button>
              )}
            </div>

            {/* Mobile hamburger */}
            <button
              className="md:hidden"
              onClick={() => setMobileOpen(true)}
              style={{ background: 'none', border: 'none', color: 'var(--color-ink)', cursor: 'pointer' }}
            >
              <Menu size={28} />
            </button>
          </div>
        </div>
      </nav>

      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3, ease: [0.25, 1, 0.5, 1] }}
            style={{
              position: 'fixed',
              inset: 0,
              zIndex: 1001,
              backgroundColor: 'var(--color-paper)',
              display: 'flex',
              flexDirection: 'column',
              padding: '2rem var(--container-px)',
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '3rem' }}>
              <button
                onClick={() => setMobileOpen(false)}
                style={{ background: 'none', border: 'none', color: 'var(--color-ink)', cursor: 'pointer' }}
              >
                <X size={32} />
              </button>
            </div>
            
            <nav style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
              {navLinks.map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  onClick={(e) => { 
                    if (!link.isPage) {
                      e.preventDefault(); handleNavClick(link.href) 
                    } else {
                      setMobileOpen(false)
                    }
                  }}
                  style={{
                    fontSize: 'var(--text-display-md)',
                    fontFamily: 'var(--font-heading)',
                    fontWeight: 700,
                    color: 'var(--color-ink)',
                    textDecoration: 'none',
                    letterSpacing: '-0.02em',
                  }}
                >
                  {link.label}
                </a>
              ))}
            </nav>
            
            <div style={{ marginTop: 'auto', paddingBottom: '2rem' }}>
              <button
                onClick={() => { setMobileOpen(false); user ? window.location.href = '/tools' : openAuthModal('login') }}
                style={{
                  width: '100%',
                  padding: '1.5rem',
                  fontSize: '1.25rem',
                  borderRadius: 'var(--radius-xl)',
                  backgroundColor: 'var(--color-ink)',
                  color: 'var(--color-paper)',
                  border: 'none',
                  fontWeight: 700,
                }}
              >
                {user ? 'Dashboard' : 'Ingresar'}
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <style>{`
        .nav-hover:hover { opacity: 1 !important; color: var(--color-accent-primary) !important; }
        .typeform-btn {
          display: inline-flex;
          align-items: center;
          gap: 0.5rem;
          padding: 12px 24px;
          border-radius: var(--radius-xl);
          background-color: var(--color-ink);
          color: var(--color-paper);
          font-family: var(--font-body);
          font-size: 1rem;
          font-weight: 700;
          border: none;
          cursor: pointer;
        }
        .typeform-btn:hover {
          background-color: var(--color-accent-primary);
        }
      `}</style>
    </>
  )
}
