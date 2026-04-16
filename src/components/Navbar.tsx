'use client'

import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Menu, X, ArrowRight, ChevronDown, Building2, Rocket, Crown } from 'lucide-react'
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
  const { user, openAuthModal, enterDemoMode } = useAuth()
  const router = useRouter()
  const pathname = usePathname()
  const [demoLoading, setDemoLoading] = useState<string | null>(null)
  const [demoOpen, setDemoOpen] = useState(false)
  const demoRef = useRef<HTMLDivElement>(null)

  const handleDemoEnter = (role: 'founder' | 'admin_org' | 'superadmin', redirect: string, key: string) => {
    setDemoLoading(key)
    setDemoOpen(false)
    try {
      enterDemoMode(role)
      // Soft navigation keeps the React context alive (no cookie/session required).
      router.push(redirect)
    } finally {
      // Small delay so the button shows state during nav
      setTimeout(() => setDemoLoading(null), 400)
    }
  }

  // Always expose the Demo dropdown on public pages (even with stale session)
  // so demo viewers can switch personas. On authenticated pages, only show
  // when no user is signed in.
  const PUBLIC_PATHS = ['/', '/organizaciones', '/workbook']
  const showDemoButton = !user || PUBLIC_PATHS.includes(pathname || '/')

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 40)
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  // Close demo dropdown on outside click / Escape
  useEffect(() => {
    if (!demoOpen) return
    const handleClickOutside = (e: MouseEvent) => {
      if (demoRef.current && !demoRef.current.contains(e.target as Node)) {
        setDemoOpen(false)
      }
    }
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setDemoOpen(false)
    }
    document.addEventListener('mousedown', handleClickOutside)
    document.addEventListener('keydown', handleEsc)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
      document.removeEventListener('keydown', handleEsc)
    }
  }, [demoOpen])

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
              {showDemoButton && (
                <div ref={demoRef} style={{ position: 'relative' }}>
                  <button
                    onClick={() => setDemoOpen((o) => !o)}
                    disabled={demoLoading !== null}
                    aria-haspopup="menu"
                    aria-expanded={demoOpen}
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '0.35rem',
                      padding: '9px 14px',
                      borderRadius: 'var(--radius-md)',
                      background: demoOpen ? 'rgba(255,107,74,0.14)' : 'rgba(255,107,74,0.08)',
                      color: '#FF6B4A',
                      border: '1px solid rgba(255,107,74,0.25)',
                      fontFamily: 'var(--font-body)',
                      fontSize: '0.85rem',
                      fontWeight: 600,
                      cursor: demoLoading ? 'wait' : 'pointer',
                      whiteSpace: 'nowrap',
                      transition: 'background 0.15s ease',
                    }}
                  >
                    {demoLoading ? 'Cargando...' : 'Demo'}
                    <ChevronDown
                      size={14}
                      style={{
                        transition: 'transform 0.2s ease',
                        transform: demoOpen ? 'rotate(180deg)' : 'rotate(0)',
                      }}
                    />
                  </button>

                  <AnimatePresence>
                    {demoOpen && (
                      <motion.div
                        initial={{ opacity: 0, y: -6 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -6 }}
                        transition={{ duration: 0.15 }}
                        role="menu"
                        style={{
                          position: 'absolute',
                          top: 'calc(100% + 8px)',
                          right: 0,
                          minWidth: 240,
                          background: 'var(--color-bg-elevated)',
                          border: '1px solid var(--color-border-strong)',
                          borderRadius: 12,
                          boxShadow: '0 12px 32px -8px rgba(0,0,0,0.6)',
                          padding: 6,
                          zIndex: 1002,
                        }}
                      >
                        <button
                          onClick={() => handleDemoEnter('founder', '/tools', 'ana')}
                          role="menuitem"
                          className="demo-menu-item"
                          style={{
                            width: '100%',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '0.75rem',
                            padding: '10px 12px',
                            borderRadius: 10,
                            background: 'transparent',
                            border: 'none',
                            cursor: 'pointer',
                            textAlign: 'left',
                            fontFamily: 'var(--font-body)',
                          }}
                        >
                          <div style={{
                            width: 32,
                            height: 32,
                            borderRadius: 8,
                            background: 'rgba(255,107,74,0.12)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            flexShrink: 0,
                          }}>
                            <Rocket size={16} color="#FF6B4A" />
                          </div>
                          <div style={{ minWidth: 0 }}>
                            <div style={{ fontSize: '0.875rem', fontWeight: 600, color: 'var(--color-text-primary)' }}>
                              Demo Founder
                            </div>
                            <div style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)' }}>
                              Vista de fundadora (Ana Quispe)
                            </div>
                          </div>
                        </button>

                        <button
                          onClick={() => handleDemoEnter('admin_org', '/admin', 'bio')}
                          role="menuitem"
                          className="demo-menu-item"
                          style={{
                            width: '100%',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '0.75rem',
                            padding: '10px 12px',
                            borderRadius: 10,
                            background: 'transparent',
                            border: 'none',
                            cursor: 'pointer',
                            textAlign: 'left',
                            fontFamily: 'var(--font-body)',
                          }}
                        >
                          <div style={{
                            width: 32,
                            height: 32,
                            borderRadius: 8,
                            background: 'rgba(13,148,136,0.12)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            flexShrink: 0,
                          }}>
                            <Building2 size={16} color="#0D9488" />
                          </div>
                          <div style={{ minWidth: 0 }}>
                            <div style={{ fontSize: '0.875rem', fontWeight: 600, color: 'var(--color-text-primary)' }}>
                              Demo Organización
                            </div>
                            <div style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)' }}>
                              Panel admin (BioInnova)
                            </div>
                          </div>
                        </button>

                        <button
                          onClick={() => handleDemoEnter('superadmin', '/admin/programas', 'minpro')}
                          role="menuitem"
                          className="demo-menu-item"
                          style={{
                            width: '100%',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '0.75rem',
                            padding: '10px 12px',
                            borderRadius: 10,
                            background: 'transparent',
                            border: 'none',
                            cursor: 'pointer',
                            textAlign: 'left',
                            fontFamily: 'var(--font-body)',
                          }}
                        >
                          <div style={{
                            width: 32,
                            height: 32,
                            borderRadius: 8,
                            background: 'rgba(245,158,11,0.12)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            flexShrink: 0,
                          }}>
                            <Crown size={16} color="#F59E0B" />
                          </div>
                          <div style={{ minWidth: 0 }}>
                            <div style={{ fontSize: '0.875rem', fontWeight: 600, color: 'var(--color-text-primary)' }}>
                              Demo Superadmin
                            </div>
                            <div style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)' }}>
                              Vista MINPRO (programas)
                            </div>
                          </div>
                        </button>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              )}
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
        .demo-menu-item:hover {
          background: rgba(255,255,255,0.04) !important;
        }
      `}</style>
    </>
  )
}
