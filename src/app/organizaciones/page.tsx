import Navbar from '@/components/Navbar'
import AuthModal from '@/components/AuthModal'
import ForOrganizations from '@/components/ForOrganizations'
import Footer from '@/components/Footer'

export default function OrganizacionesPage() {
  return (
    <>
      <Navbar />
      <AuthModal />
      <main>
        {/* Hero header for organizations page */}
        <section
          style={{
            paddingTop: '8rem',
            paddingBottom: '2rem',
            background: 'linear-gradient(135deg, rgba(124,58,237,0.04) 0%, rgba(5,150,105,0.04) 100%)',
            borderBottom: '1px solid var(--color-border)',
          }}
        >
          <div style={{ maxWidth: 1200, margin: '0 auto', padding: '0 1.5rem', textAlign: 'center' }}>
            <span
              style={{
                display: 'inline-block',
                padding: '0.3rem 0.875rem',
                borderRadius: 9999,
                background: 'rgba(124,58,237,0.06)',
                border: '1px solid rgba(124,58,237,0.12)',
                fontFamily: 'var(--font-body)',
                fontSize: '0.75rem',
                fontWeight: 600,
                color: '#7C3AED',
                letterSpacing: '0.03em',
                textTransform: 'uppercase',
                marginBottom: '1.25rem',
              }}
            >
              Para organizaciones
            </span>
            <h1
              style={{
                fontFamily: 'var(--font-heading)',
                fontSize: 'clamp(2rem, 4vw, 3rem)',
                fontWeight: 800,
                lineHeight: 1.15,
                letterSpacing: '-0.02em',
                color: 'var(--color-text-primary)',
                marginBottom: '1rem',
                maxWidth: 800,
                marginLeft: 'auto',
                marginRight: 'auto',
              }}
            >
              Potencia tu programa de innovación con tecnología
            </h1>
            <p
              style={{
                fontFamily: 'var(--font-body)',
                fontSize: '1.125rem',
                lineHeight: 1.7,
                color: 'var(--color-text-secondary)',
                maxWidth: 640,
                margin: '0 auto',
              }}
            >
              Incubadoras, aceleradoras y gobiernos ya usan Startups4Climate para gestionar
              cohortes, medir progreso y generar reportes con datos reales.
            </p>
          </div>
        </section>

        <ForOrganizations />
      </main>
      <Footer />
    </>
  )
}
