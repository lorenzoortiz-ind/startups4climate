import type { Metadata } from 'next'
import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Política de privacidad | Startups4Climate',
  description:
    'Cómo recolectamos, usamos y protegemos tus datos en la plataforma Startups4Climate.',
  robots: { index: true, follow: true },
  alternates: { canonical: 'https://www.startups4climate.org/privacidad' },
}

export default function PrivacidadPage() {
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
          fontSize: '1rem',
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
          Política de privacidad
        </h1>
        <p style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)', marginBottom: '2.5rem' }}>
          Última actualización: abril 2026
        </p>

        <h2 style={{ color: 'var(--color-ink)', fontSize: '1.25rem', marginTop: '2rem' }}>
          Quiénes somos
        </h2>
        <p>
          Startups4Climate es un producto de Redesign Lab (RUC: 20601234567), con domicilio en
          Lima, Perú. Operamos la plataforma <strong>startups4climate.org</strong> y somos
          responsables del tratamiento de los datos personales que recolectamos aquí.
        </p>

        <h2 style={{ color: 'var(--color-ink)', fontSize: '1.25rem', marginTop: '2rem' }}>
          Qué datos recolectamos
        </h2>
        <ul style={{ paddingLeft: '1.25rem' }}>
          <li>Datos de registro: nombre, email, rol, organización.</li>
          <li>Datos de tu startup: nombre, vertical, etapa, país, avance en las herramientas.</li>
          <li>Resultados del diagnóstico de startup readiness.</li>
          <li>Interacciones con el Mentor AI y las herramientas (guardadas para que puedas retomar tu trabajo).</li>
          <li>Datos técnicos mínimos (cookies de sesión, tipo de navegador, IP agregada).</li>
        </ul>

        <h2 style={{ color: 'var(--color-ink)', fontSize: '1.25rem', marginTop: '2rem' }}>
          Para qué los usamos
        </h2>
        <ul style={{ paddingLeft: '1.25rem' }}>
          <li>Prestar el servicio: guardar tu progreso, enviarte reportes, conectarte con tu organización.</li>
          <li>Comunicarnos contigo sobre tu cuenta, actualizaciones críticas y oportunidades relevantes.</li>
          <li>Mejorar la plataforma con métricas agregadas (nunca datos individuales identificables).</li>
        </ul>

        <h2 style={{ color: 'var(--color-ink)', fontSize: '1.25rem', marginTop: '2rem' }}>
          Con quién los compartimos
        </h2>
        <p>
          Solo con proveedores indispensables para operar la plataforma: Supabase (base de datos),
          Resend (emails transaccionales), Google (motor de AI vía API). No vendemos tus datos a
          terceros. Si tu cuenta pertenece a una organización (universidad, aceleradora, gobierno),
          el administrador de esa organización puede ver tu progreso dentro de la plataforma.
        </p>

        <h2 style={{ color: 'var(--color-ink)', fontSize: '1.25rem', marginTop: '2rem' }}>
          Tus derechos
        </h2>
        <p>
          Puedes acceder, rectificar, oponerte al tratamiento o solicitar la eliminación de tus
          datos escribiendo a{' '}
          <a
            href="mailto:hello@redesignlab.org"
            style={{ color: 'var(--color-accent-primary)' }}
          >
            hello@redesignlab.org
          </a>
          . Responderemos en un plazo máximo de 15 días hábiles conforme a la Ley 29733 de
          Protección de Datos Personales del Perú.
        </p>

        <h2 style={{ color: 'var(--color-ink)', fontSize: '1.25rem', marginTop: '2rem' }}>
          Retención
        </h2>
        <p>
          Conservamos tus datos mientras tu cuenta esté activa. Si la eliminas, borramos la
          información personal en 30 días, exceptuando registros que debamos mantener por
          obligación legal o para defender derechos.
        </p>

        <h2 style={{ color: 'var(--color-ink)', fontSize: '1.25rem', marginTop: '2rem' }}>
          Contacto
        </h2>
        <p>
          Redesign Lab · Lima, Perú ·{' '}
          <a href="mailto:hello@redesignlab.org" style={{ color: 'var(--color-accent-primary)' }}>
            hello@redesignlab.org
          </a>{' '}
          · WhatsApp +51 989 338 401
        </p>
      </article>
    </section>
  )
}
