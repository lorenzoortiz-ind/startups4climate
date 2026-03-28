export default function WorkbookMockup({
  width,
  height,
}: {
  width?: number | string
  height?: number | string
}) {
  return (
    <svg
      viewBox="0 0 400 500"
      width={width}
      height={height}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      role="img"
      aria-label="Workbook: Guia completa para founders de impacto"
    >
      {/* Shadow beneath the book */}
      <ellipse cx="210" cy="478" rx="150" ry="14" fill="#000" opacity="0.06" />

      {/* Back cover — slightly offset to create 3D depth */}
      <g transform="skewY(-2)">
        <rect x="62" y="38" width="260" height="360" rx="8" fill="#d1d5db" />
        {/* Spine edge */}
        <rect x="56" y="38" width="14" height="360" rx="4" fill="#9ca3af" />
      </g>

      {/* Page edges visible under the cover */}
      <g transform="skewY(-2)">
        <rect x="68" y="44" width="248" height="350" rx="4" fill="#f9fafb" />
        <line x1="68" y1="54" x2="68" y2="384" stroke="#e5e7eb" strokeWidth="1" />
        <line x1="316" y1="54" x2="316" y2="384" stroke="#e5e7eb" strokeWidth="1" />
        {/* Horizontal page lines for depth */}
        {[60, 66, 72].map((y) => (
          <line key={y} x1="68" y1={y + 320} x2="316" y2={y + 320} stroke="#e5e7eb" strokeWidth="0.5" />
        ))}
      </g>

      {/* Front cover with 3D perspective tilt */}
      <g transform="translate(0, -4) skewY(-2)">
        {/* Cover background */}
        <rect x="58" y="32" width="264" height="360" rx="10" fill="#059669" />

        {/* Subtle gradient overlay */}
        <defs>
          <linearGradient id="coverGrad" x1="58" y1="32" x2="322" y2="392" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#fff" stopOpacity="0.12" />
            <stop offset="100%" stopColor="#000" stopOpacity="0.08" />
          </linearGradient>
          <linearGradient id="accentLine" x1="58" y1="0" x2="322" y2="0" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#fff" stopOpacity="0.6" />
            <stop offset="100%" stopColor="#fff" stopOpacity="0.15" />
          </linearGradient>
        </defs>
        <rect x="58" y="32" width="264" height="360" rx="10" fill="url(#coverGrad)" />

        {/* Decorative top accent bar */}
        <rect x="58" y="32" width="264" height="6" rx="3" fill="url(#accentLine)" />

        {/* Decorative geometric elements */}
        {/* Top-right corner circles */}
        <circle cx="292" cy="72" r="28" fill="#fff" opacity="0.06" />
        <circle cx="304" cy="60" r="16" fill="#fff" opacity="0.04" />

        {/* Bottom-left decorative shape */}
        <rect x="78" y="340" width="60" height="3" rx="1.5" fill="#fff" opacity="0.12" />
        <rect x="78" y="348" width="40" height="3" rx="1.5" fill="#fff" opacity="0.08" />

        {/* Horizontal rule */}
        <line x1="90" y1="160" x2="290" y2="160" stroke="#fff" strokeOpacity="0.2" strokeWidth="1" />

        {/* Publisher / brand label at top */}
        <text
          x="190"
          y="74"
          textAnchor="middle"
          fontFamily="system-ui, -apple-system, sans-serif"
          fontSize="11"
          fontWeight="700"
          fill="#fff"
          opacity="0.6"
          letterSpacing="3"
        >
          STARTUPS4CLIMATE
        </text>

        {/* Main title */}
        <text
          x="190"
          y="118"
          textAnchor="middle"
          fontFamily="system-ui, -apple-system, sans-serif"
          fontSize="22"
          fontWeight="800"
          fill="#fff"
          letterSpacing="-0.5"
        >
          {'Gu\u00EDa completa para'}
        </text>
        <text
          x="190"
          y="146"
          textAnchor="middle"
          fontFamily="system-ui, -apple-system, sans-serif"
          fontSize="22"
          fontWeight="800"
          fill="#fff"
          letterSpacing="-0.5"
        >
          founders de impacto
        </text>

        {/* Subtitle */}
        <text
          x="190"
          y="186"
          textAnchor="middle"
          fontFamily="system-ui, -apple-system, sans-serif"
          fontSize="12.5"
          fontWeight="500"
          fill="#fff"
          opacity="0.75"
        >
          {'Desde la ideaci\u00F3n hasta el fundraising,'}
        </text>
        <text
          x="190"
          y="204"
          textAnchor="middle"
          fontFamily="system-ui, -apple-system, sans-serif"
          fontSize="12.5"
          fontWeight="500"
          fill="#fff"
          opacity="0.75"
        >
          {'paso a paso en Am\u00E9rica Latina'}
        </text>

        {/* Chapter preview icons — 4 stage dots */}
        {[
          { cx: 142, color: '#c4b5fd' },
          { cx: 172, color: '#6ee7b7' },
          { cx: 202, color: '#fcd34d' },
          { cx: 232, color: '#67e8f9' },
        ].map((dot, i) => (
          <g key={i}>
            <circle cx={dot.cx} cy="248" r="12" fill="#fff" opacity="0.12" />
            <circle cx={dot.cx} cy="248" r="5" fill={dot.color} opacity="0.9" />
          </g>
        ))}

        {/* Stage labels beneath dots */}
        <text x="142" y="272" textAnchor="middle" fontFamily="system-ui, sans-serif" fontSize="7" fill="#fff" opacity="0.45" fontWeight="600" letterSpacing="0.5">
          PRE-INC.
        </text>
        <text x="172" y="272" textAnchor="middle" fontFamily="system-ui, sans-serif" fontSize="7" fill="#fff" opacity="0.45" fontWeight="600" letterSpacing="0.5">
          INCUB.
        </text>
        <text x="202" y="272" textAnchor="middle" fontFamily="system-ui, sans-serif" fontSize="7" fill="#fff" opacity="0.45" fontWeight="600" letterSpacing="0.5">
          ACELER.
        </text>
        <text x="232" y="272" textAnchor="middle" fontFamily="system-ui, sans-serif" fontSize="7" fill="#fff" opacity="0.45" fontWeight="600" letterSpacing="0.5">
          ESCAL.
        </text>

        {/* Bottom tagline */}
        <text
          x="190"
          y="320"
          textAnchor="middle"
          fontFamily="system-ui, -apple-system, sans-serif"
          fontSize="10"
          fontWeight="600"
          fill="#fff"
          opacity="0.45"
          letterSpacing="1.5"
        >
          8 CAPITULOS &middot; 30 HERRAMIENTAS
        </text>

        {/* Bottom badge */}
        <rect x="145" y="350" width="90" height="24" rx="12" fill="#fff" opacity="0.15" />
        <text
          x="190"
          y="366"
          textAnchor="middle"
          fontFamily="system-ui, -apple-system, sans-serif"
          fontSize="9"
          fontWeight="700"
          fill="#fff"
          opacity="0.8"
          letterSpacing="0.5"
        >
          RECURSO GRATIS
        </text>
      </g>
    </svg>
  )
}
