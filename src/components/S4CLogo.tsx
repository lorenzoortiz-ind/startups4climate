export default function S4CLogo({ size = 32 }: { size?: number }) {
  const fontSize = size * 0.4
  return (
    <svg width={size} height={size} viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="s4c-bg" x1="0" y1="0" x2="40" y2="40" gradientUnits="userSpaceOnUse">
          <stop stopColor="#059669" />
          <stop offset="1" stopColor="#047857" />
        </linearGradient>
        <linearGradient id="s4c-leaf" x1="28" y1="4" x2="34" y2="14" gradientUnits="userSpaceOnUse">
          <stop stopColor="#34D399" />
          <stop offset="1" stopColor="#10B981" />
        </linearGradient>
      </defs>
      {/* Background rounded square */}
      <rect width="40" height="40" rx="10" fill="url(#s4c-bg)" />
      {/* Small leaf accent at top-right */}
      <path d="M32 6C32 6 28 8 28 12C28 14 29.5 15 31 15C33 15 34 13 34 11C34 8 32 6 32 6Z" fill="url(#s4c-leaf)" opacity="0.7" />
      {/* S4C text */}
      <text
        x="50%"
        y="54%"
        dominantBaseline="central"
        textAnchor="middle"
        fill="white"
        fontFamily="'JetBrains Mono', monospace"
        fontSize={fontSize}
        fontWeight="700"
        letterSpacing="0.5"
      >
        S4C
      </text>
    </svg>
  )
}
