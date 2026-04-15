export default function OrgDashboardMockup({
  width,
  height,
}: {
  width?: number | string
  height?: number | string
}) {
  return (
    <svg
      viewBox="0 0 440 320"
      width={width}
      height={height}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      role="img"
      aria-label="Dashboard de gestión para organizaciones"
    >
      {/* Shadow */}
      <ellipse cx="220" cy="310" rx="180" ry="8" fill="#000" opacity="0.06" />

      {/* Browser frame */}
      <rect x="20" y="12" width="400" height="280" rx="12" fill="#fff" stroke="#e5e7eb" strokeWidth="1.5" />

      {/* Title bar */}
      <rect x="20" y="12" width="400" height="36" rx="12" fill="#f9fafb" />
      <rect x="20" y="36" width="400" height="12" fill="#f9fafb" />
      <line x1="20" y1="48" x2="420" y2="48" stroke="#e5e7eb" strokeWidth="1" />

      {/* Traffic lights */}
      <circle cx="42" cy="30" r="5" fill="#FF5F57" />
      <circle cx="58" cy="30" r="5" fill="#FFBD2E" />
      <circle cx="74" cy="30" r="5" fill="#28C840" />

      {/* URL bar */}
      <rect x="100" y="22" width="240" height="16" rx="4" fill="#f0f0f0" />
      <text x="140" y="33" fontFamily="Mluvka, system-ui, sans-serif" fontSize="8" fill="#9ca3af" fontWeight="500">
        startups4climate.vercel.app/admin
      </text>

      {/* Sidebar */}
      <rect x="20" y="48" width="90" height="244" fill="#191919" />
      <rect x="20" y="280" width="90" height="12" rx="0 0 12 0" fill="#191919" />

      {/* Sidebar logo */}
      <text x="32" y="72" fontFamily="Mluvka, system-ui, sans-serif" fontSize="9" fontWeight="700" fill="#fff">
        S<tspan fill="#FF6B4A">4</tspan>C
      </text>
      <text x="52" y="72" fontFamily="Mluvka, system-ui, sans-serif" fontSize="6" fontWeight="500" fill="#666">
        Admin
      </text>

      {/* Sidebar menu items */}
      {[
        { y: 96, label: 'Dashboard', active: true },
        { y: 116, label: 'Cohortes', active: false },
        { y: 136, label: 'Startups', active: false },
        { y: 156, label: 'Reportes', active: false },
        { y: 176, label: 'Benchmark', active: false },
      ].map((item) => (
        <g key={item.label}>
          {item.active && <rect x="24" y={item.y - 8} width="82" height="16" rx="4" fill="rgba(255,107,74,0.15)" />}
          <text
            x="32"
            y={item.y}
            fontFamily="Mluvka, system-ui, sans-serif"
            fontSize="7.5"
            fontWeight={item.active ? '700' : '500'}
            fill={item.active ? '#FF6B4A' : '#888'}
          >
            {item.label}
          </text>
        </g>
      ))}

      {/* Main content area */}
      {/* Header */}
      <text x="126" y="72" fontFamily="Mluvka, system-ui, sans-serif" fontSize="12" fontWeight="700" fill="#191919" letterSpacing="-0.5">
        Panel de Portafolio
      </text>
      <text x="126" y="86" fontFamily="Mluvka, system-ui, sans-serif" fontSize="7" fill="#9ca3af" fontWeight="500">
        12 startups activas en 2 cohortes
      </text>

      {/* Stats cards row */}
      {[
        { x: 126, label: 'Startups', value: '12', color: '#FF6B4A' },
        { x: 204, label: 'Avg Score', value: '78', color: '#0D9488' },
        { x: 282, label: 'Cohortes', value: '2', color: '#D97706' },
        { x: 360, label: 'Reportes', value: '8', color: '#3B82F6' },
      ].map((stat) => (
        <g key={stat.label}>
          <rect x={stat.x} y="96" width="68" height="42" rx="6" fill="#fff" stroke="#e5e7eb" strokeWidth="1" />
          <circle cx={stat.x + 12} cy={108} r="3" fill={stat.color} opacity="0.3" />
          <text x={stat.x + 10} y="118" fontFamily="Mluvka, system-ui, sans-serif" fontSize="14" fontWeight="700" fill="#191919" letterSpacing="-0.5">
            {stat.value}
          </text>
          <text x={stat.x + 10} y="130" fontFamily="Mluvka, system-ui, sans-serif" fontSize="6" fill="#9ca3af" fontWeight="500">
            {stat.label}
          </text>
        </g>
      ))}

      {/* Mini chart area */}
      <rect x="126" y="150" width="148" height="90" rx="6" fill="#fff" stroke="#e5e7eb" strokeWidth="1" />
      <text x="136" y="166" fontFamily="Mluvka, system-ui, sans-serif" fontSize="7" fontWeight="600" fill="#191919">
        Progreso por etapa
      </text>

      {/* Bar chart */}
      {[
        { x: 140, h: 40, color: '#FF6B4A', label: 'Pre' },
        { x: 164, h: 55, color: '#0D9488', label: 'Inc' },
        { x: 188, h: 30, color: '#D97706', label: 'Acc' },
        { x: 212, h: 20, color: '#3B82F6', label: 'Esc' },
      ].map((bar) => (
        <g key={bar.label}>
          <rect
            x={bar.x}
            y={230 - bar.h}
            width="18"
            height={bar.h}
            rx="3"
            fill={bar.color}
            opacity="0.8"
          />
          <text
            x={bar.x + 9}
            y="238"
            textAnchor="middle"
            fontFamily="Mluvka, system-ui, sans-serif"
            fontSize="5.5"
            fill="#9ca3af"
            fontWeight="500"
          >
            {bar.label}
          </text>
        </g>
      ))}

      {/* Table area */}
      <rect x="284" y="150" width="126" height="90" rx="6" fill="#fff" stroke="#e5e7eb" strokeWidth="1" />
      <text x="294" y="166" fontFamily="Mluvka, system-ui, sans-serif" fontSize="7" fontWeight="600" fill="#191919">
        Startups recientes
      </text>

      {/* Table rows */}
      {[
        { name: 'EcoFintech', score: '82', color: '#0D9488' },
        { name: 'AgroSense', score: '71', color: '#D97706' },
        { name: 'CleanGrid', score: '65', color: '#FF6B4A' },
        { name: 'BioVerde', score: '88', color: '#3B82F6' },
      ].map((row, i) => (
        <g key={row.name}>
          <line x1="294" y1={178 + i * 16} x2="400" y2={178 + i * 16} stroke="#f0f0f0" strokeWidth="0.5" />
          <circle cx="300" cy={186 + i * 16} r="3" fill={row.color} opacity="0.2" />
          <text x="308" y={188 + i * 16} fontFamily="Mluvka, system-ui, sans-serif" fontSize="6.5" fill="#191919" fontWeight="500">
            {row.name}
          </text>
          <text x="380" y={188 + i * 16} fontFamily="Mluvka, system-ui, sans-serif" fontSize="6.5" fill={row.color} fontWeight="700">
            {row.score}
          </text>
        </g>
      ))}

      {/* Bottom status bar */}
      <rect x="126" y="252" width="284" height="24" rx="6" fill="#f9fafb" stroke="#e5e7eb" strokeWidth="0.5" />
      <circle cx="138" cy="264" r="3" fill="#28C840" />
      <text x="146" y="267" fontFamily="Mluvka, system-ui, sans-serif" fontSize="6" fill="#9ca3af" fontWeight="500">
        Datos actualizados en tiempo real
      </text>
    </svg>
  )
}
