export default function WorkbookMockup({
  width,
  height,
}: {
  width?: number | string
  height?: number | string
}) {
  return (
    <svg
      viewBox="0 0 400 520"
      width={width}
      height={height}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      role="img"
      aria-label="Workbook: De la idea al escalamiento"
    >
      {/* Shadow beneath the book */}
      <ellipse cx="200" cy="498" rx="140" ry="12" fill="#000" opacity="0.08" />

      {/* Back cover — 3D depth */}
      <g transform="skewY(-1.5)">
        <rect x="62" y="42" width="270" height="380" rx="6" fill="#d4d0cc" />
        {/* Spine */}
        <rect x="54" y="42" width="16" height="380" rx="4" fill="#b8b4af" />
      </g>

      {/* Page edges */}
      <g transform="skewY(-1.5)">
        <rect x="68" y="48" width="258" height="370" rx="3" fill="#fafaf8" />
        {[362, 366, 370].map((y) => (
          <line key={y} x1="68" y1={y} x2="326" y2={y} stroke="#e8e4df" strokeWidth="0.5" />
        ))}
      </g>

      {/* Front cover */}
      <g transform="translate(0, -6) skewY(-1.5)">
        {/* Coral/orange cover background */}
        <rect x="56" y="34" width="274" height="380" rx="8" fill="#FF6B4A" />

        {/* Gradient overlay for depth */}
        <defs>
          <linearGradient id="coverGrad" x1="56" y1="34" x2="330" y2="414" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#fff" stopOpacity="0.15" />
            <stop offset="50%" stopColor="#fff" stopOpacity="0" />
            <stop offset="100%" stopColor="#000" stopOpacity="0.12" />
          </linearGradient>
        </defs>
        <rect x="56" y="34" width="274" height="380" rx="8" fill="url(#coverGrad)" />

        {/* Decorative large circle — top right */}
        <circle cx="310" cy="80" r="60" fill="#fff" opacity="0.06" />
        <circle cx="320" cy="65" r="30" fill="#fff" opacity="0.04" />

        {/* Decorative small circles — bottom left */}
        <circle cx="90" cy="370" r="24" fill="#fff" opacity="0.05" />
        <circle cx="110" cy="385" r="12" fill="#fff" opacity="0.04" />

        {/* Top brand */}
        <text
          x="193"
          y="80"
          textAnchor="middle"
          fontFamily="system-ui, -apple-system, sans-serif"
          fontSize="10.5"
          fontWeight="700"
          fill="#fff"
          opacity="0.7"
          letterSpacing="3.5"
        >
          <tspan fill="#fff">STARTUPS</tspan><tspan fill="#FF6B4A">4</tspan><tspan fill="#fff">CLIMATE</tspan>
        </text>

        {/* Thin rule below brand */}
        <line x1="100" y1="94" x2="286" y2="94" stroke="#fff" strokeOpacity="0.25" strokeWidth="0.75" />

        {/* Main title: WORKBOOK */}
        <text
          x="193"
          y="148"
          textAnchor="middle"
          fontFamily="system-ui, -apple-system, sans-serif"
          fontSize="36"
          fontWeight="800"
          fill="#fff"
          letterSpacing="2"
        >
          WORKBOOK
        </text>

        {/* Subtitle line 1 */}
        <text
          x="193"
          y="184"
          textAnchor="middle"
          fontFamily="system-ui, -apple-system, sans-serif"
          fontSize="14"
          fontWeight="600"
          fill="#fff"
          opacity="0.9"
          letterSpacing="0.5"
        >
          De la idea al escalamiento
        </text>

        {/* Horizontal rule */}
        <line x1="130" y1="204" x2="256" y2="204" stroke="#fff" strokeOpacity="0.3" strokeWidth="0.75" />

        {/* Description */}
        <text
          x="193"
          y="232"
          textAnchor="middle"
          fontFamily="system-ui, -apple-system, sans-serif"
          fontSize="11"
          fontWeight="500"
          fill="#fff"
          opacity="0.7"
        >
          {'Gu\u00EDa completa para founders'}
        </text>
        <text
          x="193"
          y="248"
          textAnchor="middle"
          fontFamily="system-ui, -apple-system, sans-serif"
          fontSize="11"
          fontWeight="500"
          fill="#fff"
          opacity="0.7"
        >
          {'de startups de impacto en Am\u00E9rica Latina'}
        </text>

        {/* 4 stage indicators with stage colors */}
        {[
          { cx: 120, color: '#FF6B4A', label: 'PRE-INC.' },
          { cx: 160, color: '#0D9488', label: 'INCUB.' },
          { cx: 200, color: '#D97706', label: 'ACELER.' },
          { cx: 240, color: '#3B82F6', label: 'ESCAL.' },
        ].map((dot, i) => (
          <g key={i}>
            <circle cx={dot.cx} cy="286" r="10" fill="#fff" opacity="0.15" />
            <circle cx={dot.cx} cy="286" r="4.5" fill="#fff" opacity="0.9" />
            <text
              x={dot.cx}
              y="308"
              textAnchor="middle"
              fontFamily="system-ui, sans-serif"
              fontSize="6.5"
              fill="#fff"
              opacity="0.5"
              fontWeight="600"
              letterSpacing="0.5"
            >
              {dot.label}
            </text>
          </g>
        ))}

        {/* Connecting line between stage dots */}
        <line x1="130" y1="286" x2="230" y2="286" stroke="#fff" strokeOpacity="0.2" strokeWidth="1" />

        {/* Bottom info */}
        <text
          x="193"
          y="350"
          textAnchor="middle"
          fontFamily="system-ui, -apple-system, sans-serif"
          fontSize="9"
          fontWeight="600"
          fill="#fff"
          opacity="0.45"
          letterSpacing="2"
        >
          {'8 CAP\u00CDTULOS \u00B7 +30 HERRAMIENTAS'}
        </text>

        {/* Bottom badge */}
        <rect x="148" y="368" width="90" height="24" rx="12" fill="#fff" opacity="0.18" />
        <text
          x="193"
          y="384"
          textAnchor="middle"
          fontFamily="system-ui, -apple-system, sans-serif"
          fontSize="8.5"
          fontWeight="700"
          fill="#fff"
          opacity="0.85"
          letterSpacing="1"
        >
          DESCARGA GRATIS
        </text>
      </g>
    </svg>
  )
}
