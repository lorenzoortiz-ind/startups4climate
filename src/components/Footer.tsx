'use client'

import Link from 'next/link'

const footerLinks = {
  plataforma: [
    { label: 'Diagnóstico gratuito', href: '#diagnostico' },
    { label: 'Ciclo de vida', href: '#ciclo-de-vida' },
    { label: 'Herramientas gratuitas', href: '/tools', isPage: true },
  ],
  servicios: [
    { label: 'Productos digitales', href: '/productos', isPage: true },
    { label: 'Servicios para fundadores', href: '/servicios#fundadores', isPage: true },
    { label: 'Servicios para inversores', href: '/servicios#inversores', isPage: true },
  ],
  contacto: [
    { label: 'hello@redesignlab.org', href: 'mailto:hello@redesignlab.org' },
    { label: 'WhatsApp', href: 'https://wa.me/51989338401' },
    { label: 'Sobre Redesign Lab', href: '#about' },
  ],
}

export default function Footer() {
  return (
    <footer style={{ background: '#111827', color: '#9CA3AF', padding: '4rem 0 2rem' }}>
      <div style={{ maxWidth: 1200, margin: '0 auto', padding: '0 1.5rem' }}>
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: '2.5rem',
          marginBottom: '3rem',
        }}>
          {/* Brand */}
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem' }}>
              <div style={{
                width: 32, height: 32, borderRadius: 8,
                background: 'linear-gradient(135deg, #059669, #0D9488)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                color: 'white', fontFamily: 'var(--font-mono)', fontSize: 11, fontWeight: 700,
              }}>S4C</div>
              <span style={{ fontFamily: 'var(--font-heading)', fontWeight: 700, fontSize: '1rem', color: '#F9FAFB' }}>
                Startups<span style={{ color: '#059669' }}>4</span>Climate
              </span>
            </div>
            <p style={{ fontFamily: 'var(--font-body)', fontSize: '0.8125rem', lineHeight: 1.6, color: '#6B7280', maxWidth: 280 }}>
              Estructura y capital para escalar soluciones climáticas en Latinoamérica.
            </p>
          </div>

          {/* Links */}
          {Object.entries(footerLinks).map(([title, links]) => (
            <div key={title}>
              <h4 style={{
                fontFamily: 'var(--font-heading)', fontSize: '0.8125rem', fontWeight: 700,
                color: '#F9FAFB', textTransform: 'capitalize', marginBottom: '0.75rem',
              }}>{title}</h4>
              <ul style={{ listStyle: 'none', padding: 0, display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                {links.map(link => (
                  <li key={link.label}>
                    {'isPage' in link && link.isPage ? (
                      <Link
                        href={link.href}
                        style={{
                          fontFamily: 'var(--font-body)', fontSize: '0.8125rem',
                          color: '#6B7280', textDecoration: 'none', transition: 'color 0.2s',
                        }}
                      >{link.label}</Link>
                    ) : (
                      <a
                        href={link.href}
                        target={link.href.startsWith('http') ? '_blank' : undefined}
                        rel={link.href.startsWith('http') ? 'noopener noreferrer' : undefined}
                        style={{
                          fontFamily: 'var(--font-body)', fontSize: '0.8125rem',
                          color: '#6B7280', textDecoration: 'none', transition: 'color 0.2s',
                        }}
                        onMouseEnter={e => (e.currentTarget.style.color = '#D1D5DB')}
                        onMouseLeave={e => (e.currentTarget.style.color = '#6B7280')}
                      >{link.label}</a>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom */}
        <div style={{
          borderTop: '1px solid #1F2937', paddingTop: '1.5rem',
          display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'center', gap: '0.75rem',
        }}>
          <p style={{ fontFamily: 'var(--font-body)', fontSize: '0.75rem', color: '#4B5563' }}>
            &copy; {new Date().getFullYear()} Startups4Climate by Redesign Lab. Todos los derechos reservados.
          </p>
          <div style={{ display: 'flex', gap: '1.5rem' }}>
            {['Privacidad', 'Términos'].map(item => (
              <a key={item} href="#" style={{
                fontFamily: 'var(--font-body)', fontSize: '0.75rem', color: '#4B5563',
                textDecoration: 'none', transition: 'color 0.2s',
              }}
                onMouseEnter={e => (e.currentTarget.style.color = '#9CA3AF')}
                onMouseLeave={e => (e.currentTarget.style.color = '#4B5563')}
              >{item}</a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  )
}
