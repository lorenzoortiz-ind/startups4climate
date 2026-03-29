'use client'

import Link from 'next/link'
import S4CLogo from '@/components/S4CLogo'

const footerLinks = {
  plataforma: [
    { label: 'Diagnóstico gratuito', href: '#diagnostico' },
    { label: 'Herramientas', href: '#plataforma' },
    { label: 'Workbook', href: '/workbook', isPage: true },
    { label: 'Acceder a la plataforma', href: '/tools' },
  ],
  organizaciones: [
    { label: 'Para organizaciones', href: '/organizaciones', isPage: true },
    { label: 'Solicitar demo', href: 'mailto:hello@redesignlab.org' },
    { label: 'Metodología', href: '#' },
  ],
  contacto: [
    { label: 'hello@redesignlab.org', href: 'mailto:hello@redesignlab.org' },
    { label: 'WhatsApp', href: 'https://wa.me/51989338401?text=Hola%2C%20vengo%20de%20Startups4climate%20y%20me%20gustar%C3%ADa%20saber%20m%C3%A1s%20sobre%20la%20plataforma.' },
    { label: 'Sobre Redesign Lab', href: 'https://www.redesignlab.org' },
  ],
}

export default function Footer() {
  return (
    <footer style={{ background: 'var(--color-ink)', color: 'var(--color-paper)', padding: '6rem 0 3rem' }}>
      <div style={{ maxWidth: 'var(--container-max)', margin: '0 auto', padding: '0 var(--container-px)' }}>

        {/* Top: Info + Logo & Links Grid */}
        <div style={{
          display: 'flex',
          flexWrap: 'wrap',
          gap: '4rem',
          justifyContent: 'space-between',
          marginBottom: '5rem',
        }}>
          
          {/* Logo & Info */}
          <div style={{ maxWidth: 320 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.5rem' }}>
              <S4CLogo size={32} />
              <span style={{
                fontFamily: 'var(--font-heading)',
                fontWeight: 700,
                fontSize: '1.25rem',
                color: 'var(--color-paper)',
                letterSpacing: '-0.02em',
              }}>
                Startups<span style={{ color: '#FF6B4A' }}>4</span>Climate
              </span>
            </div>
            <p style={{
              fontFamily: 'var(--font-body)',
              fontSize: '0.875rem',
              lineHeight: 1.6,
              color: 'rgba(255, 255, 255, 0.6)',
              margin: 0,
            }}>
              Democratizando el desarrollo de startups de impacto en Latinoamérica.
            </p>
          </div>

          {/* Links Grid */}
          <div style={{
            display: 'flex',
            flexWrap: 'wrap',
            gap: '4rem',
          }}>
            {Object.entries(footerLinks).map(([title, links]) => (
              <div key={title} style={{ minWidth: 160 }}>
                <h4 style={{
                  fontFamily: 'var(--font-body)',
                  fontSize: '0.6875rem',
                  fontWeight: 600,
                  color: 'rgba(255, 255, 255, 0.4)',
                  textTransform: 'uppercase',
                  letterSpacing: '0.12em',
                  marginBottom: '1.5rem',
                }}>
                  {title}
                </h4>
                <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                  {links.map(link => (
                    <li key={link.label}>
                      {'isPage' in link && link.isPage ? (
                        <Link
                          href={link.href}
                          style={{
                            fontFamily: 'var(--font-body)',
                            fontSize: '0.875rem',
                            color: 'rgba(255, 255, 255, 0.8)',
                            textDecoration: 'none',
                            transition: 'color 0.2s',
                          }}
                          onMouseOver={(e) => e.currentTarget.style.color = '#fff'}
                          onMouseOut={(e) => e.currentTarget.style.color = 'rgba(255, 255, 255, 0.8)'}
                        >
                          {link.label}
                        </Link>
                      ) : (
                        <a
                          href={link.href}
                          target={link.href.startsWith('http') ? '_blank' : undefined}
                          rel={link.href.startsWith('http') ? 'noopener noreferrer' : undefined}
                          style={{
                            fontFamily: 'var(--font-body)',
                            fontSize: '0.875rem',
                            color: 'rgba(255, 255, 255, 0.8)',
                            textDecoration: 'none',
                            transition: 'color 0.2s',
                          }}
                          onMouseOver={(e) => e.currentTarget.style.color = '#fff'}
                          onMouseOut={(e) => e.currentTarget.style.color = 'rgba(255, 255, 255, 0.8)'}
                        >
                          {link.label}
                        </a>
                      )}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        {/* Separator */}
        <div style={{ height: 1, background: 'rgba(255, 255, 255, 0.1)', marginBottom: '2rem' }} />

        {/* Bottom: Legal + Social */}
        <div style={{
          display: 'flex',
          flexWrap: 'wrap',
          justifyContent: 'space-between',
          alignItems: 'center',
          gap: '1.5rem',
        }}>
          <p style={{
            fontFamily: 'var(--font-body)',
            fontSize: '0.8125rem',
            color: 'rgba(255, 255, 255, 0.4)',
            margin: 0,
          }}>
            &copy; {new Date().getFullYear()} Startups4Climate by Redesign Lab. Todos los derechos reservados.
          </p>
          
          <div style={{ display: 'flex', alignItems: 'center', gap: '2rem' }}>
            <div style={{ display: 'flex', gap: '1.5rem' }}>
              {['Privacidad', 'Términos'].map(item => (
                <a key={item} href="#" style={{
                  fontFamily: 'var(--font-body)',
                  fontSize: '0.8125rem',
                  color: 'rgba(255, 255, 255, 0.5)',
                  textDecoration: 'none',
                }}
                onMouseOver={(e) => e.currentTarget.style.color = 'rgba(255, 255, 255, 0.8)'}
                onMouseOut={(e) => e.currentTarget.style.color = 'rgba(255, 255, 255, 0.5)'}
                >
                  {item}
                </a>
              ))}
            </div>
            
            <div style={{ width: 1, height: 16, background: 'rgba(255, 255, 255, 0.2)' }} />
            
            <div style={{ display: 'flex', gap: '1rem' }}>
              <a href="https://www.linkedin.com/company/redesignlab" target="_blank" rel="noopener noreferrer" style={{ color: 'rgba(255, 255, 255, 0.5)' }} onMouseOver={(e) => e.currentTarget.style.color = '#fff'} onMouseOut={(e) => e.currentTarget.style.color = 'rgba(255, 255, 255, 0.5)'}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" /><rect x="2" y="9" width="4" height="12" /><circle cx="4" cy="4" r="2" /></svg>
              </a>
              <a href="https://x.com/redesignlabpe" target="_blank" rel="noopener noreferrer" style={{ color: 'rgba(255, 255, 255, 0.5)' }} onMouseOver={(e) => e.currentTarget.style.color = '#fff'} onMouseOut={(e) => e.currentTarget.style.color = 'rgba(255, 255, 255, 0.5)'}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" /></svg>
              </a>
              <a href="https://instagram.com/redesignlab.pe" target="_blank" rel="noopener noreferrer" style={{ color: 'rgba(255, 255, 255, 0.5)' }} onMouseOver={(e) => e.currentTarget.style.color = '#fff'} onMouseOut={(e) => e.currentTarget.style.color = 'rgba(255, 255, 255, 0.5)'}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="2" width="20" height="20" rx="5" ry="5" /><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" /><line x1="17.5" y1="6.5" x2="17.51" y2="6.5" /></svg>
              </a>
            </div>
          </div>
        </div>

      </div>
    </footer>
  )
}
