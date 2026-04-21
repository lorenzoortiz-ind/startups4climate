import type { Metadata } from 'next'
import Link from 'next/link'
import { ArrowLeft, Compass, Layers, LineChart, Sparkles } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Metodología | Startups4Climate',
  description:
    'Cómo diseñamos las herramientas, el diagnóstico de readiness y el scoring de startups de impacto en Startups4Climate.',
  robots: { index: true, follow: true },
  alternates: { canonical: 'https://www.startups4climate.org/metodologia' },
}

const pillars = [
  {
    icon: Compass,
    title: 'Diagnóstico de readiness',
    body: 'Un instrumento de 32 preguntas organizado en 6 dimensiones: equipo, problema, solución, mercado, modelo de negocio y tracción. Cada respuesta pondera según la etapa declarada (idea, MVP, tracción, crecimiento) y produce un score 0–100 + una etapa sugerida.',
  },
  {
    icon: Layers,
    title: 'Herramientas interactivas',
    body: 'Las 30+ herramientas están agrupadas por fase del ciclo de vida de una startup. Cada una expone un marco conceptual corto, un formulario guiado y un output descargable. El progreso se persiste en Supabase para que puedas retomar en cualquier dispositivo.',
  },
  {
    icon: Sparkles,
    title: 'Mentor AI contextual',
    body: 'Gemini 2.5 Flash como motor, prompt-enginneado con el contexto de tu startup (vertical, etapa, país) y el avance específico de cada herramienta. No reemplaza mentoría humana: complementa y acelera.',
  },
  {
    icon: LineChart,
    title: 'Scoring y benchmarking',
    body: 'Calculamos métricas agregadas por cohorte, vertical y país — nunca a nivel individual expuesto. Los admins de organización ven promedios de sus founders vs. la plataforma completa para decidir dónde intervenir.',
  },
]

export default function MetodologiaPage() {
  return (
    <section
      style={{
        minHeight: '100dvh',
        padding: 'clamp(6rem, 10vw, 8rem) clamp(1.25rem, 4vw, 3rem) 6rem',
        background: 'var(--color-bg-primary)',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      <div
        className="orb orb-ember orb-sm"
        style={{ top: '10%', right: '-200px', opacity: 0.18 }}
        aria-hidden
      />

      <article
        style={{
          maxWidth: 840,
          margin: '0 auto',
          fontFamily: 'var(--font-body)',
          color: 'var(--color-text-secondary)',
          lineHeight: 1.65,
          position: 'relative',
          zIndex: 1,
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

        <span className="pill-ember" style={{ marginBottom: '1.25rem' }}>
          <span className="dot" />
          Cómo funciona S4C
        </span>

        <h1
          style={{
            fontSize: 'clamp(2rem, 4.5vw, 3.4rem)',
            color: 'var(--color-ink)',
            marginBottom: '1rem',
            letterSpacing: '-0.03em',
            lineHeight: 1.05,
          }}
        >
          Nuestra <span className="gradient-text">metodología</span>
        </h1>
        <p style={{ fontSize: '1.05rem', maxWidth: 640, marginBottom: '3rem' }}>
          Startups4Climate combina un diagnóstico cuantitativo, herramientas interactivas con
          outputs accionables y mentoría AI contextualizada. Este es el marco en el que se
          sostienen todas las decisiones de producto.
        </p>

        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
            gap: '1.25rem',
            marginBottom: '3rem',
          }}
        >
          {pillars.map((p) => {
            const Icon = p.icon
            return (
              <div
                key={p.title}
                className="glass-card"
                style={{
                  padding: '1.75rem',
                  borderRadius: 18,
                }}
              >
                <div
                  style={{
                    width: 40,
                    height: 40,
                    borderRadius: 10,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    background:
                      'linear-gradient(135deg, rgba(218,78,36,0.18), rgba(255,137,24,0.10))',
                    border: '1px solid rgba(218,78,36,0.35)',
                    color: '#F0721D',
                    marginBottom: '1rem',
                  }}
                >
                  <Icon size={18} strokeWidth={2} />
                </div>
                <h3
                  style={{
                    fontSize: '1.125rem',
                    color: 'var(--color-ink)',
                    marginBottom: '0.5rem',
                    letterSpacing: '-0.02em',
                    lineHeight: 1.2,
                  }}
                >
                  {p.title}
                </h3>
                <p style={{ fontSize: '0.9rem', lineHeight: 1.55, margin: 0 }}>{p.body}</p>
              </div>
            )
          })}
        </div>

        <h2 style={{ color: 'var(--color-ink)', fontSize: '1.5rem', marginTop: '3rem' }}>
          Principios de diseño
        </h2>
        <ul style={{ paddingLeft: '1.25rem', margin: '1rem 0 2rem' }}>
          <li><strong>Específico a LATAM.</strong> Ejemplos, casos y regulación centrados en la región, no adaptaciones de frameworks de Silicon Valley.</li>
          <li><strong>Salida accionable.</strong> Cada herramienta produce un artefacto descargable o compartible, no una pantalla de &ldquo;felicitaciones&rdquo;.</li>
          <li><strong>Persistencia real.</strong> La fuente de verdad es Supabase. Puedes retomar en cualquier dispositivo sin perder progreso.</li>
          <li><strong>Privacidad por defecto.</strong> Los datos individuales nunca se exponen a otros founders ni a organizaciones ajenas a la tuya.</li>
        </ul>

        <h2 style={{ color: 'var(--color-ink)', fontSize: '1.5rem', marginTop: '3rem' }}>
          ¿Quieres más detalle?
        </h2>
        <p>
          Escríbenos a{' '}
          <a href="mailto:hello@redesignlab.org" style={{ color: 'var(--color-accent-primary)' }}>
            hello@redesignlab.org
          </a>{' '}
          y te enviamos el whitepaper completo con rúbricas de scoring y validación metodológica.
        </p>
      </article>
    </section>
  )
}
