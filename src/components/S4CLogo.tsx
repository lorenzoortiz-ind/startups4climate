export default function S4CLogo({ size = 32 }: { size?: number }) {
  const fontSize = size * 0.4
  return (
    <svg width={size} height={size} viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect width="40" height="40" rx="8" fill="#000000" />
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
        <tspan fill="white">s</tspan>
        <tspan fill="#FF6B4A">4</tspan>
        <tspan fill="white">c</tspan>
      </text>
    </svg>
  )
}
