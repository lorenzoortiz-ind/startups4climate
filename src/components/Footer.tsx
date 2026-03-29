'use client'

import Link from 'next/link'

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
    { label: 'Sobre Redesign Lab', href: '#about' },
  ],
}

export default function Footer() {
  return (
    <footer style={{ background: '#0A0F1A', color: '#9CA3AF', padding: '5rem 0 2.5rem' }}>
      <div style={{ maxWidth: 1200, margin: '0 auto', padding: '0 2rem' }}>
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: '3rem',
          marginBottom: '3.5rem',
        }}>
          {/* Brand */}
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.625rem', marginBottom: '1.25rem' }}>
              <div style={{
                width: 36, height: 36, borderRadius: 10,
                background: 'linear-gradient(135deg, #059669, #0D9488)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                color: 'white', fontFamily: 'var(--font-mono)', fontSize: 12, fontWeight: 700,
              }}>S4C</div>
              <span style={{ fontFamily: 'var(--font-heading)', fontWeight: 700, fontSize: '1.0625rem', color: '#F9FAFB' }}>
                Startups<span style={{ color: '#34D399' }}>4</span>Climate
              </span>
            </div>
            <p style={{ fontFamily: 'var(--font-body)', fontSize: '0.9375rem', lineHeight: 1.7, color: '#94A3B8', maxWidth: 300 }}>
              Democratizando el desarrollo de startups de impacto en Latinoamérica.
            </p>
          </div>

          {/* Links */}
          {Object.entries(footerLinks).map(([title, links]) => (
            <div key={title}>
              <h4 style={{
                fontFamily: 'var(--font-heading)', fontSize: '0.875rem', fontWeight: 700,
                color: '#F1F5F9', textTransform: 'capitalize', marginBottom: '1rem',
                letterSpacing: '0.01em',
              }}>{title}</h4>
              <ul style={{ listStyle: 'none', padding: 0, display: 'flex', flexDirection: 'column', gap: '0.625rem' }}>
                {links.map(link => (
                  <li key={link.label}>
                    {'isPage' in link && link.isPage ? (
                      <Link
                        href={link.href}
                        style={{
                          fontFamily: 'var(--font-body)', fontSize: '0.9375rem',
                          color: '#94A3B8', textDecoration: 'none', transition: 'color 0.2s',
                        }}
                      >{link.label}</Link>
                    ) : (
                      <a
                        href={link.href}
                        target={link.href.startsWith('http') ? '_blank' : undefined}
                        rel={link.href.startsWith('http') ? 'noopener noreferrer' : undefined}
                        style={{
                          fontFamily: 'var(--font-body)', fontSize: '0.9375rem',
                          color: '#94A3B8', textDecoration: 'none', transition: 'color 0.2s',
                        }}
                        onMouseEnter={e => (e.currentTarget.style.color = '#E2E8F0')}
                        onMouseLeave={e => (e.currentTarget.style.color = '#94A3B8')}
                      >{link.label}</a>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Divider */}
        <div style={{
          height: 1,
          background: 'linear-gradient(to right, transparent, rgba(148,163,184,0.15), transparent)',
          marginBottom: '2rem',
        }} />

        {/* Bottom */}
        <div style={{
          display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'center', gap: '1rem',
        }}>
          <p style={{ fontFamily: 'var(--font-body)', fontSize: '0.8125rem', color: '#64748B' }}>
            &copy; {new Date().getFullYear()} Startups4Climate by Redesign Lab. Todos los derechos reservados.
          </p>
          <div style={{ display: 'flex', gap: '2rem' }}>
            {['Privacidad', 'Términos'].map(item => (
              <a key={item} href="#" style={{
                fontFamily: 'var(--font-body)', fontSize: '0.8125rem', color: '#64748B',
                textDecoration: 'none', transition: 'color 0.2s',
              }}
                onMouseEnter={e => (e.currentTarget.style.color = '#E2E8F0')}
                onMouseLeave={e => (e.currentTarget.style.color = '#64748B')}
              >{item}</a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  )
}
