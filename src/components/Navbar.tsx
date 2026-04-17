'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Menu, X, ArrowRight } from 'lucide-react'
import { useAuth } from '@/context/AuthContext'
import { useRouter, usePathname } from 'next/navigation'
import Link from 'next/link'
import S4CLogo from '@/components/S4CLogo'

const navLinks: { label: string; href: string; isPage?: boolean }[] = [
  { label: 'Plataforma', href: '/#plataforma' },
  { label: 'Diagnóstico', href: '/#diagnostico' },
  { label: 'Quiénes somos', href: '/#about' },
  { label: 'Workbook', href: '/workbook', isPage: true },
  { label: 'Organizaciones', href: '/organizaciones', isPage: true },
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
          backgroundColor: scrolled ? 'rgba(11, 14, 20, 0.72)' : 'rgba(11, 14, 20, 0.0)',
          backdropFilter: scrolled ? 'blur(12px) saturate(160%)' : 'blur(6px)',
          WebkitBackdropFilter: scrolled ? 'blur(12px) saturate(160%)' : 'blur(6px)',
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
                  color: 'var(--color-text-primary)',
                  letterSpacing: '-0.03em',
                }}
              >
                Startups<span style={{ color: '#FF6B4A' }}>4</span>Climate
              </span>
            </a>

            {/* Desktop Navigation */}
            <div className="hidden md:flex" style={{ alignItems: 'center', gap: '2rem', flex: 1, justifyContent: 'center' }}>
              {navLinks.map((link) => {
                const linkStyle: React.CSSProperties = {
                  fontFamily: 'var(--font-body)',
                  fontSize: '0.9rem',
                  fontWeight: 500,
                  color: 'var(--color-text-secondary)',
                  textDecoration: 'none',
                  transition: 'color 0.15s ease',
                  cursor: 'pointer',
                  whiteSpace: 'nowrap',
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
            <div className="hidden md:flex" style={{ alignItems: 'center', gap: '0.75rem' }}>
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
              aria-label="Abrir menú"
              style={{ background: 'none', border: 'none', color: 'var(--color-text-primary)', cursor: 'pointer' }}
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
              backgroundColor: 'var(--color-bg-primary)',
              display: 'flex',
              flexDirection: 'column',
              padding: '2rem var(--container-px)',
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '3rem' }}>
              <button
                onClick={() => setMobileOpen(false)}
                style={{ background: 'none', border: 'none', color: 'var(--color-text-primary)', cursor: 'pointer' }}
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
                    color: 'var(--color-text-primary)',
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
                  borderRadius: 'var(--radius-md)',
                  backgroundColor: 'var(--color-accent-primary)',
                  color: '#fff',
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
        .nav-hover:hover { color: var(--color-text-primary) !important; }
        .typeform-btn {
          display: inline-flex;
          align-items: center;
          gap: 0.5rem;
          padding: 9px 18px;
          border-radius: 8px;
          background-color: var(--color-accent-primary);
          color: #fff;
          font-family: var(--font-body);
          font-size: 0.875rem;
          font-weight: 600;
          border: none;
          cursor: pointer;
          white-space: nowrap;
          box-shadow: 0 1px 2px rgba(0,0,0,0.3);
          transition: background 0.15s ease;
        }
        .typeform-btn:hover {
          background-color: var(--color-accent-hover);
        }
      `}</style>
    </>
  )
}
