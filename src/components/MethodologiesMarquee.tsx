'use client'

const METHODOLOGIES = [
  { brand: 'MIT', name: 'Disciplined Entrepreneurship' },
  { brand: 'Stanford', name: 'Lean Startup' },
  { brand: 'Strategyzer', name: 'Business Model Canvas' },
  { brand: 'LeanStack', name: 'Lean Canvas' },
  { brand: 'Stanford d.school', name: 'Design Thinking' },
  { brand: 'IDEO', name: 'Human-Centered Design' },
  { brand: 'Y Combinator', name: 'Pitch Framework' },
  { brand: 'Sequoia', name: 'Fundraising Memo' },
  { brand: 'a16z', name: 'Startup Playbook' },
  { brand: 'Intel · Google', name: 'OKRs' },
  { brand: 'GIIN', name: 'IRIS+ Impact Metrics' },
  { brand: 'Naciones Unidas', name: 'SDG Compass' },
]

export default function MethodologiesMarquee() {
  const loop = [...METHODOLOGIES, ...METHODOLOGIES]

  return (
    <section
      aria-label="Fundamento metodológico"
      style={{
        position: 'relative',
        background: 'var(--color-bg-primary)',
        padding: 'clamp(3rem, 6vh, 5rem) 0',
        borderTop: '1px solid var(--color-border)',
        borderBottom: '1px solid var(--color-border)',
        overflow: 'hidden',
      }}
    >
      <div
        style={{
          maxWidth: 1280,
          margin: '0 auto 2rem',
          padding: '0 clamp(1.25rem, 4vw, 3rem)',
          textAlign: 'center',
        }}
      >
        <span
          style={{
            fontFamily: 'var(--font-body)',
            fontSize: '0.72rem',
            fontWeight: 600,
            letterSpacing: '0.14em',
            textTransform: 'uppercase',
            color: 'var(--color-text-muted)',
          }}
        >
          Construido sobre marcos académicos validados
        </span>
      </div>

      <div className="methodologies-marquee" aria-hidden>
        <div className="methodologies-track">
          {loop.map((m, i) => (
            <div key={i} className="method-chip">
              <span className="method-brand">{m.brand}</span>
              <span className="method-divider">·</span>
              <span className="method-name">{m.name}</span>
            </div>
          ))}
        </div>
      </div>

      <style>{`
        .methodologies-marquee {
          position: relative;
          width: 100%;
          overflow: hidden;
          mask-image: linear-gradient(to right, transparent, #000 8%, #000 92%, transparent);
          -webkit-mask-image: linear-gradient(to right, transparent, #000 8%, #000 92%, transparent);
        }
        .methodologies-track {
          display: flex;
          gap: 1rem;
          width: max-content;
          animation: methodologies-scroll 60s linear infinite;
        }
        .methodologies-marquee:hover .methodologies-track {
          animation-play-state: paused;
        }
        .method-chip {
          display: inline-flex;
          align-items: center;
          gap: 0.6rem;
          padding: 0.65rem 1.15rem;
          border-radius: 999px;
          border: 1px solid var(--color-border-strong);
          background: rgba(255, 255, 255, 0.025);
          white-space: nowrap;
          flex-shrink: 0;
        }
        .method-brand {
          font-family: var(--font-body);
          font-size: 0.68rem;
          font-weight: 600;
          letter-spacing: 0.1em;
          text-transform: uppercase;
          color: var(--color-text-secondary);
        }
        .method-divider {
          color: var(--color-accent-primary);
          font-weight: 500;
        }
        .method-name {
          font-family: var(--font-body);
          font-size: 0.88rem;
          font-weight: 500;
          color: var(--color-text-primary);
          letter-spacing: -0.005em;
        }
        @keyframes methodologies-scroll {
          from { transform: translate3d(0, 0, 0); }
          to { transform: translate3d(-50%, 0, 0); }
        }
        @media (prefers-reduced-motion: reduce) {
          .methodologies-track {
            animation: none;
          }
        }
      `}</style>
    </section>
  )
}
