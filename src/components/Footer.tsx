'use client'

import Link from 'next/link'

const footerLinks = {
  plataforma: [
    { label: 'Diagnostico gratuito', href: '#diagnostico' },
    { label: 'Herramientas', href: '#plataforma' },
    { label: 'Workbook', href: '/workbook', isPage: true },
    { label: 'Acceder a la plataforma', href: '/tools' },
  ],
  organizaciones: [
    { label: 'Para organizaciones', href: '/organizaciones', isPage: true },
    { label: 'Solicitar demo', href: 'mailto:hello@redesignlab.org' },
    { label: 'Metodologia', href: '#' },
  ],
  contacto: [
    { label: 'hello@redesignlab.org', href: 'mailto:hello@redesignlab.org' },
    { label: 'WhatsApp', href: 'https://wa.me/51989338401?text=Hola%2C%20vengo%20de%20Startups4climate%20y%20me%20gustar%C3%ADa%20saber%20m%C3%A1s%20sobre%20la%20plataforma.' },
    { label: 'Sobre Redesign Lab', href: '#about' },
  ],
}

const linkColor = 'rgba(255,255,255,0.7)'
const linkHoverColor = '#FFFFFF'
const legalColor = 'rgba(255,255,255,0.4)'
const legalHoverColor = 'rgba(255,255,255,0.7)'

export default function Footer() {
  return (
    <footer style={{ background: '#2A222B', color: linkColor, padding: '80px 0 40px' }}>
      <div style={{ maxWidth: 1200, margin: '0 auto', padding: '0 2rem' }}>

        {/* Logo */}
        <div style={{ marginBottom: '3.5rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.625rem', marginBottom: '1rem' }}>
            <div style={{
              width: 36, height: 36, borderRadius: 10,
              background: 'linear-gradient(135deg, #0D9488, #0D9488)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              color: 'white', fontFamily: 'var(--font-mono)', fontSize: 12, fontWeight: 700,
            }}>S4C</div>
            <span style={{ fontFamily: 'var(--font-heading)', fontWeight: 700, fontSize: '1.0625rem', color: '#FFFFFF' }}>
              Startups<span style={{ color: '#0D9488' }}>4</span>Climate
            </span>
          </div>
          <p style={{
            fontFamily: 'var(--font-body)', fontSize: 14, lineHeight: 1.7,
            color: 'rgba(255,255,255,0.5)', maxWidth: 340, margin: 0,
          }}>
            Democratizando el desarrollo de startups de impacto en Latinoamerica.
          </p>
        </div>

        {/* Columns */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
          gap: '2.5rem',
          marginBottom: '3.5rem',
        }}>
          {Object.entries(footerLinks).map(([title, links]) => (
            <div key={title}>
              <h4 style={{
                fontFamily: 'var(--font-heading)',
                fontSize: 14,
                fontWeight: 500,
                color: '#FFFFFF',
                textTransform: 'uppercase',
                letterSpacing: '0.05em',
                marginBottom: '1.25rem',
                marginTop: 0,
              }}>{title}</h4>
              <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                {links.map(link => (
                  <li key={link.label}>
                    {'isPage' in link && link.isPage ? (
                      <Link
                        href={link.href}
                        style={{
                          fontFamily: 'var(--font-body)', fontSize: 14,
                          color: linkColor, textDecoration: 'none', transition: 'color 0.2s',
                        }}
                      >{link.label}</Link>
                    ) : (
                      <a
                        href={link.href}
                        target={link.href.startsWith('http') ? '_blank' : undefined}
                        rel={link.href.startsWith('http') ? 'noopener noreferrer' : undefined}
                        style={{
                          fontFamily: 'var(--font-body)', fontSize: 14,
                          color: linkColor, textDecoration: 'none', transition: 'color 0.2s',
                        }}
                        onMouseEnter={e => (e.currentTarget.style.color = linkHoverColor)}
                        onMouseLeave={e => (e.currentTarget.style.color = linkColor)}
                      >{link.label}</a>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Social icons */}
        <div style={{ display: 'flex', gap: '1.25rem', marginBottom: '2.5rem' }}>
          {/* LinkedIn */}
          <a
            href="https://www.linkedin.com/company/redesignlab"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="LinkedIn"
            style={{ color: 'rgba(255,255,255,0.4)', transition: 'color 0.2s' }}
            onMouseEnter={e => (e.currentTarget.style.color = linkHoverColor)}
            onMouseLeave={e => (e.currentTarget.style.color = 'rgba(255,255,255,0.4)')}
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
              <rect x="2" y="9" width="4" height="12" />
              <circle cx="4" cy="4" r="2" />
            </svg>
          </a>
          {/* X / Twitter */}
          <a
            href="https://x.com/redesignlabpe"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="X"
            style={{ color: 'rgba(255,255,255,0.4)', transition: 'color 0.2s' }}
            onMouseEnter={e => (e.currentTarget.style.color = linkHoverColor)}
            onMouseLeave={e => (e.currentTarget.style.color = 'rgba(255,255,255,0.4)')}
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
              <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
            </svg>
          </a>
          {/* Instagram */}
          <a
            href="https://instagram.com/redesignlab.pe"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Instagram"
            style={{ color: 'rgba(255,255,255,0.4)', transition: 'color 0.2s' }}
            onMouseEnter={e => (e.currentTarget.style.color = linkHoverColor)}
            onMouseLeave={e => (e.currentTarget.style.color = 'rgba(255,255,255,0.4)')}
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
              <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
              <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
            </svg>
          </a>
        </div>

        {/* Separator */}
        <div style={{
          height: 1,
          background: 'rgba(255,255,255,0.1)',
          marginBottom: '1.5rem',
        }} />

        {/* Bottom: legal links + copyright */}
        <div style={{
          display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'center', gap: '1rem',
        }}>
          <p style={{
            fontFamily: 'var(--font-body)', fontSize: 13, color: 'rgba(255,255,255,0.35)', margin: 0,
          }}>
            &copy; {new Date().getFullYear()} Startups4Climate by Redesign Lab. Todos los derechos reservados.
          </p>
          <div style={{ display: 'flex', gap: '2rem' }}>
            {['Privacidad', 'Terminos'].map(item => (
              <a key={item} href="#" style={{
                fontFamily: 'var(--font-body)', fontSize: 13, color: legalColor,
                textDecoration: 'none', transition: 'color 0.2s',
              }}
                onMouseEnter={e => (e.currentTarget.style.color = legalHoverColor)}
                onMouseLeave={e => (e.currentTarget.style.color = legalColor)}
              >{item}</a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  )
}
