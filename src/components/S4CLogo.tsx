export default function S4CLogo({ size = 32 }: { size?: number }) {
  const fontSize = size * 0.4
  return (
    <svg width={size} height={size} viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="s4c-bg" x1="0" y1="0" x2="40" y2="40" gradientUnits="userSpaceOnUse">
          <stop stopColor="#2A222B" />
          <stop offset="1" stopColor="#1E181C" />
        </linearGradient>
      </defs>
      <rect width="40" height="40" rx="10" fill="url(#s4c-bg)" />
      <circle cx="32" cy="8" r="4" fill="#FF6B4A" opacity="0.8" />
      <text
        x="50%"
        y="54%"
        dominantBaseline="central"
        textAnchor="middle"
        fontFamily="var(--font-mluvka), 'Mluvka', system-ui, sans-serif"
        fontSize={fontSize}
        fontWeight="700"
        letterSpacing="0.5"
      >
        <tspan fill="white">S</tspan>
        <tspan fill="#FF6B4A">4</tspan>
        <tspan fill="white">C</tspan>
      </text>
    </svg>
  )
}
