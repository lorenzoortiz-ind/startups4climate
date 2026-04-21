import type { Metadata } from 'next'
import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Términos y condiciones | Startups4Climate',
  description:
    'Términos de uso de la plataforma Startups4Climate para founders y organizaciones.',
  robots: { index: true, follow: true },
  alternates: { canonical: 'https://www.startups4climate.org/terminos' },
}

export default function TerminosPage() {
  return (
    <section
      style={{
        minHeight: '100dvh',
        padding: 'clamp(6rem, 10vw, 8rem) clamp(1.25rem, 4vw, 3rem) 6rem',
        background: 'var(--color-bg-primary)',
      }}
    >
      <article
        style={{
          maxWidth: 760,
          margin: '0 auto',
          fontFamily: 'var(--font-body)',
          color: 'var(--color-text-secondary)',
          lineHeight: 1.65,
        }}
      >
        <Link
          href="/"
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.5rem',
            color: 'var(--color-accent-primary)',
            fontSize: '0.875rem',
            marginBottom: '2rem',
            textDecoration: 'none',
          }}
        >
          <ArrowLeft size={14} />
          Volver al inicio
        </Link>

        <h1
          style={{
            fontSize: 'clamp(2rem, 4vw, 3rem)',
            color: 'var(--color-ink)',
            marginBottom: '0.5rem',
          }}
        >
          Términos y condiciones
        </h1>
        <p style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)', marginBottom: '2.5rem' }}>
          Última actualización: abril 2026
        </p>

        <h2 style={{ color: 'var(--color-ink)', fontSize: '1.25rem', marginTop: '2rem' }}>
          1. Aceptación
        </h2>
        <p>
          Al crear una cuenta o usar la plataforma Startups4Climate aceptas estos términos. Si no
          estás de acuerdo, no uses el servicio.
        </p>

        <h2 style={{ color: 'var(--color-ink)', fontSize: '1.25rem', marginTop: '2rem' }}>
          2. El servicio
        </h2>
        <p>
          Startups4Climate es una plataforma de herramientas, diagnóstico y mentoría AI para
          founders de startups de impacto en América Latina. Operamos bajo Redesign Lab.
        </p>

        <h2 style={{ color: 'var(--color-ink)', fontSize: '1.25rem', marginTop: '2rem' }}>
          3. Cuentas y acceso
        </h2>
        <ul style={{ paddingLeft: '1.25rem' }}>
          <li>Eres responsable de mantener la confidencialidad de tu contraseña.</li>
          <li>Debes brindar información veraz sobre tu identidad y tu startup.</li>
          <li>Podemos suspender cuentas ante uso indebido, suplantación o violación de estos términos.</li>
        </ul>

        <h2 style={{ color: 'var(--color-ink)', fontSize: '1.25rem', marginTop: '2rem' }}>
          4. Uso aceptable
        </h2>
        <p>No puedes usar la plataforma para:</p>
        <ul style={{ paddingLeft: '1.25rem' }}>
          <li>Enviar spam, phishing o contenido malicioso.</li>
          <li>Ingeniería reversa, scraping masivo o saturación del motor AI.</li>
          <li>Publicar contenido ilegal, ofensivo o que infrinja derechos de terceros.</li>
          <li>Compartir tu cuenta con terceros fuera de tu equipo fundador.</li>
        </ul>

        <h2 style={{ color: 'var(--color-ink)', fontSize: '1.25rem', marginTop: '2rem' }}>
          5. Propiedad intelectual
        </h2>
        <p>
          El código, la marca, los textos y el diseño de la plataforma son propiedad de Redesign
          Lab. Tú conservas la propiedad de los datos de tu startup. Al cargarlos, nos otorgas una
          licencia limitada para procesarlos y mostrártelos dentro de la plataforma.
        </p>

        <h2 style={{ color: 'var(--color-ink)', fontSize: '1.25rem', marginTop: '2rem' }}>
          6. Contenido generado por AI
        </h2>
        <p>
          Las respuestas del Mentor AI son orientativas. No constituyen asesoría legal, financiera
          ni regulatoria. Validalas con profesionales antes de tomar decisiones críticas.
        </p>

        <h2 style={{ color: 'var(--color-ink)', fontSize: '1.25rem', marginTop: '2rem' }}>
          7. Gratuidad y planes B2B
        </h2>
        <p>
          Founders individuales acceden de forma gratuita. Organizaciones (universidades,
          aceleradoras, gobiernos) operan bajo contrato específico que complementa estos términos.
        </p>

        <h2 style={{ color: 'var(--color-ink)', fontSize: '1.25rem', marginTop: '2rem' }}>
          8. Limitación de responsabilidad
        </h2>
        <p>
          La plataforma se entrega &ldquo;tal cual&rdquo;. No garantizamos disponibilidad
          ininterrumpida ni resultados específicos para tu startup. Nuestra responsabilidad queda
          limitada al monto efectivamente pagado por tu organización en los últimos 12 meses (si
          aplica).
        </p>

        <h2 style={{ color: 'var(--color-ink)', fontSize: '1.25rem', marginTop: '2rem' }}>
          9. Terminación
        </h2>
        <p>
          Puedes eliminar tu cuenta cuando quieras desde tu perfil o escribiéndonos. Podemos dar
          de baja cuentas inactivas por más de 18 meses previo aviso por email.
        </p>

        <h2 style={{ color: 'var(--color-ink)', fontSize: '1.25rem', marginTop: '2rem' }}>
          10. Ley aplicable
        </h2>
        <p>
          Estos términos se rigen por las leyes del Perú. Cualquier disputa se resuelve en los
          tribunales de Lima.
        </p>

        <h2 style={{ color: 'var(--color-ink)', fontSize: '1.25rem', marginTop: '2rem' }}>
          Contacto
        </h2>
        <p>
          <a href="mailto:hello@redesignlab.org" style={{ color: 'var(--color-accent-primary)' }}>
            hello@redesignlab.org
          </a>{' '}
          · WhatsApp +51 989 338 401
        </p>
      </article>
    </section>
  )
}
