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
    const handleScroll = () => setScrolled(window.scrollY > 20)
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
      <div
        style={{
          position: 'fixed',
          top: scrolled ? '0.85rem' : '1.25rem',
          left: 0,
          right: 0,
          zIndex: 1000,
          display: 'flex',
          justifyContent: 'center',
          padding: '0 1rem',
          pointerEvents: 'none',
          transition: 'top 0.3s var(--ease-smooth)',
        }}
      >
        <nav
          style={{
            pointerEvents: 'auto',
            width: '100%',
            maxWidth: 1080,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '0.55rem 0.75rem 0.55rem 1.25rem',
            borderRadius: 999,
            background: 'rgba(14, 14, 14, 0.72)',
            border: '1px solid rgba(255,255,255,0.08)',
            backdropFilter: 'blur(18px) saturate(160%)',
            WebkitBackdropFilter: 'blur(18px) saturate(160%)',
            boxShadow: scrolled
              ? '0 18px 50px -20px rgba(0,0,0,0.6), inset 0 1px 0 rgba(255,255,255,0.05)'
              : '0 10px 30px -16px rgba(0,0,0,0.5), inset 0 1px 0 rgba(255,255,255,0.05)',
            transition: 'all 0.3s var(--ease-smooth)',
          }}
        >
          {/* Logo */}
          <a
            href="/"
            onClick={(e) => {
              e.preventDefault()
              if (pathname === '/') window.scrollTo({ top: 0, behavior: 'smooth' })
              else router.push('/')
            }}
            style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', textDecoration: 'none' }}
          >
            <S4CLogo size={26} />
            <span
              style={{
                fontFamily: 'var(--font-heading)',
                fontWeight: 600,
                fontSize: '1rem',
                color: 'var(--color-text-primary)',
                letterSpacing: '-0.02em',
              }}
            >
              Startups<span className="text-ember">4</span>Climate
            </span>
          </a>

          {/* Desktop Navigation */}
          <div
            className="hidden md:flex"
            style={{ alignItems: 'center', gap: '1.75rem' }}
          >
            {navLinks.map((link) => {
              const linkStyle: React.CSSProperties = {
                fontFamily: 'var(--font-body)',
                fontSize: '0.85rem',
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

          {/* Desktop CTA */}
          <div className="hidden md:flex" style={{ alignItems: 'center', gap: '0.5rem' }}>
            {user ? (
              <button
                onClick={() => { window.location.href = '/tools' }}
                className="btn-ember"
                style={{ padding: '0.55rem 1.1rem', fontSize: '0.85rem' }}
              >
                Dashboard <ArrowRight size={15} />
              </button>
            ) : (
              <button
                onClick={() => openAuthModal('login')}
                className="btn-ember"
                style={{ padding: '0.55rem 1.1rem', fontSize: '0.85rem' }}
              >
                Ingresar <ArrowRight size={15} />
              </button>
            )}
          </div>

          {/* Mobile hamburger */}
          <button
            className="md:hidden"
            onClick={() => setMobileOpen(true)}
            aria-label="Abrir menú"
            style={{
              background: 'rgba(255,255,255,0.04)',
              border: '1px solid rgba(255,255,255,0.08)',
              color: 'var(--color-text-primary)',
              cursor: 'pointer',
              borderRadius: 999,
              width: 40,
              height: 40,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <Menu size={20} />
          </button>
        </nav>
      </div>

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
              padding: '2rem 1.5rem',
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '3rem' }}>
              <S4CLogo size={28} />
              <button
                onClick={() => setMobileOpen(false)}
                style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', color: 'var(--color-text-primary)', cursor: 'pointer', borderRadius: 999, width: 40, height: 40, display: 'flex', alignItems: 'center', justifyContent: 'center' }}
              >
                <X size={20} />
              </button>
            </div>

            <nav style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
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
                    fontSize: '2rem',
                    fontFamily: 'var(--font-heading)',
                    fontWeight: 500,
                    color: 'var(--color-text-primary)',
                    textDecoration: 'none',
                    letterSpacing: '-0.025em',
                    lineHeight: 1.05,
                  }}
                >
                  {link.label}
                </a>
              ))}
            </nav>

            <div style={{ marginTop: 'auto', paddingBottom: '2rem' }}>
              <button
                onClick={() => { setMobileOpen(false); user ? window.location.href = '/tools' : openAuthModal('login') }}
                className="btn-ember"
                style={{ width: '100%', justifyContent: 'center', padding: '1rem' }}
              >
                {user ? 'Dashboard' : 'Ingresar'} <ArrowRight size={18} />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <style>{`
        .nav-hover:hover { color: var(--color-text-primary) !important; }
      `}</style>
    </>
  )
}
