import Link from 'next/link'
import { ArrowLeft, Compass } from 'lucide-react'

export default function NotFound() {
  return (
    <section
      style={{
        position: 'relative',
        minHeight: '100dvh',
        background: 'var(--color-bg-primary)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        overflow: 'hidden',
        padding: 'clamp(2rem, 6vw, 4rem) clamp(1.25rem, 4vw, 3rem)',
      }}
    >
      <div
        className="orb orb-ember orb-lg"
        style={{ bottom: '-380px', left: '-300px' }}
        aria-hidden
      />
      <div
        className="orb orb-electric orb-lg"
        style={{ top: '-380px', right: '-300px' }}
        aria-hidden
      />

      <div
        style={{
          position: 'relative',
          zIndex: 1,
          maxWidth: 640,
          textAlign: 'center',
        }}
      >
        <span className="pill-ember" style={{ marginBottom: '1.5rem' }}>
          <Compass size={14} strokeWidth={2.4} />
          Error 404
        </span>

        <h1
          style={{
            fontFamily: 'var(--font-heading)',
            fontSize: 'clamp(2.4rem, 6vw, 4.2rem)',
            fontWeight: 500,
            lineHeight: 1.02,
            letterSpacing: '-0.03em',
            color: 'var(--color-ink)',
            margin: '1rem 0 1.25rem',
          }}
        >
          Esta ruta no existe —{' '}
          <span className="gradient-text">pero tu startup sí</span>
        </h1>

        <p
          style={{
            fontFamily: 'var(--font-body)',
            fontSize: '1.05rem',
            lineHeight: 1.55,
            color: 'var(--color-text-secondary)',
            margin: '0 auto 2rem',
            maxWidth: 480,
          }}
        >
          El enlace que seguiste está roto o la página fue movida. Te llevamos de
          vuelta a terreno conocido.
        </p>

        <div
          style={{
            display: 'flex',
            gap: '0.75rem',
            justifyContent: 'center',
            flexWrap: 'wrap',
          }}
        >
          <Link href="/" className="btn-ember">
            <ArrowLeft size={18} />
            Volver al inicio
          </Link>
          <Link href="/tools" className="btn-ghost">
            Ir a la plataforma
          </Link>
        </div>
      </div>
    </section>
  )
}
