import { ImageResponse } from 'next/og'

export const runtime = 'edge'
export const alt = 'Startups4Climate — Plataforma all-in-one para startups de impacto'
export const size = { width: 1200, height: 630 }
export const contentType = 'image/png'

export default async function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          padding: '72px',
          background: '#000000',
          backgroundImage:
            'radial-gradient(circle at 15% 110%, rgba(218,78,36,0.55) 0%, rgba(218,78,36,0) 55%), radial-gradient(circle at 85% 110%, rgba(31,119,246,0.40) 0%, rgba(31,119,246,0) 55%)',
          color: '#FFFFFF',
          fontFamily: 'sans-serif',
        }}
      >
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 14,
            padding: '8px 18px',
            border: '1px solid rgba(218,78,36,0.45)',
            borderRadius: 999,
            alignSelf: 'flex-start',
            background: 'rgba(218,78,36,0.10)',
          }}
        >
          <div
            style={{
              width: 10,
              height: 10,
              borderRadius: 999,
              background: '#F0721D',
              boxShadow: '0 0 12px #F0721D',
            }}
          />
          <span style={{ fontSize: 22, letterSpacing: 2, color: '#F0721D', fontWeight: 600 }}>
            STARTUPS4CLIMATE
          </span>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
          <div
            style={{
              fontSize: 88,
              fontWeight: 600,
              letterSpacing: '-0.03em',
              lineHeight: 1.02,
              maxWidth: 1000,
            }}
          >
            La infraestructura que tu{' '}
            <span style={{ color: '#F0721D' }}>startup de impacto</span>{' '}
            merece para escalar
          </div>
          <div
            style={{
              fontSize: 30,
              color: 'rgba(255,255,255,0.72)',
              letterSpacing: '-0.01em',
              maxWidth: 900,
            }}
          >
            Herramientas interactivas, mentor AI personalizado y oportunidades reales para founders LATAM.
          </div>
        </div>

        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'flex-end',
            width: '100%',
          }}
        >
          <div style={{ fontSize: 22, color: 'rgba(255,255,255,0.55)' }}>
            startups4climate.org
          </div>
          <div style={{ fontSize: 22, color: 'rgba(255,255,255,0.55)' }}>
            Por Redesign Lab
          </div>
        </div>
      </div>
    ),
    { ...size },
  )
}
