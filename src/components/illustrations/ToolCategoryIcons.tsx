'use client'

import React from 'react'
import type { ToolCategory } from '@/lib/tools-data'

interface CategoryIconProps {
  width?: number | string
  height?: number | string
  className?: string
  color?: string
}

const DEFAULT_COLOR = '#059669'
const LINE_COLOR = '#1a1a1a'

/** Estrategia — compass/target */
function EstrategiaIcon({ width = 48, height = 48, className, color = DEFAULT_COLOR }: CategoryIconProps) {
  return (
    <svg width={width} height={height} viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
      <circle cx="24" cy="24" r="18" stroke={LINE_COLOR} strokeWidth="2" fill={color} fillOpacity={0.08} />
      <circle cx="24" cy="24" r="10" stroke={LINE_COLOR} strokeWidth="1.5" fill="none" />
      <circle cx="24" cy="24" r="2.5" fill={color} />
      {/* Crosshair lines */}
      <line x1="24" y1="6" x2="24" y2="14" stroke={color} strokeWidth="2" strokeLinecap="round" />
      <line x1="24" y1="34" x2="24" y2="42" stroke={color} strokeWidth="2" strokeLinecap="round" />
      <line x1="6" y1="24" x2="14" y2="24" stroke={color} strokeWidth="2" strokeLinecap="round" />
      <line x1="34" y1="24" x2="42" y2="24" stroke={color} strokeWidth="2" strokeLinecap="round" />
      {/* Compass needle */}
      <path d="M24 14L28 24L24 34L20 24Z" stroke={color} strokeWidth="1.5" fill={color} fillOpacity={0.15} />
    </svg>
  )
}

/** Mercado — pie chart with people */
function MercadoIcon({ width = 48, height = 48, className, color = DEFAULT_COLOR }: CategoryIconProps) {
  return (
    <svg width={width} height={height} viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
      {/* Pie chart */}
      <circle cx="22" cy="24" r="14" stroke={LINE_COLOR} strokeWidth="2" fill={color} fillOpacity={0.08} />
      {/* Pie slices */}
      <path d="M22 24L22 10A14 14 0 0 1 34.1 18.3Z" stroke={LINE_COLOR} strokeWidth="1.5" fill={color} fillOpacity={0.2} />
      <path d="M22 24L34.1 18.3A14 14 0 0 1 36 24Z" stroke={LINE_COLOR} strokeWidth="1.5" fill={color} fillOpacity={0.1} />
      {/* Small person icon */}
      <circle cx="40" cy="10" r="3" stroke={LINE_COLOR} strokeWidth="1.5" fill="none" />
      <path d="M36 19Q40 15 44 19" stroke={LINE_COLOR} strokeWidth="1.5" strokeLinecap="round" fill="none" />
    </svg>
  )
}

/** Cliente — user with magnifying glass */
function ClienteIcon({ width = 48, height = 48, className, color = DEFAULT_COLOR }: CategoryIconProps) {
  return (
    <svg width={width} height={height} viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
      {/* Person head */}
      <circle cx="20" cy="16" r="7" stroke={LINE_COLOR} strokeWidth="2" fill={color} fillOpacity={0.08} />
      {/* Person body */}
      <path d="M8 40C8 32 13 27 20 27C24 27 27 28.5 29 31" stroke={LINE_COLOR} strokeWidth="2" strokeLinecap="round" fill="none" />
      {/* Magnifying glass */}
      <circle cx="36" cy="30" r="7" stroke={color} strokeWidth="2" fill={color} fillOpacity={0.1} />
      <line x1="41" y1="35" x2="46" y2="40" stroke={color} strokeWidth="2.5" strokeLinecap="round" />
    </svg>
  )
}

/** Producto — box/cube */
function ProductoIcon({ width = 48, height = 48, className, color = DEFAULT_COLOR }: CategoryIconProps) {
  return (
    <svg width={width} height={height} viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
      {/* Cube top */}
      <path d="M24 6L42 16L24 26L6 16Z" stroke={LINE_COLOR} strokeWidth="2" strokeLinejoin="round" fill={color} fillOpacity={0.12} />
      {/* Cube left face */}
      <path d="M6 16L24 26L24 44L6 34Z" stroke={LINE_COLOR} strokeWidth="2" strokeLinejoin="round" fill={color} fillOpacity={0.06} />
      {/* Cube right face */}
      <path d="M42 16L24 26L24 44L42 34Z" stroke={LINE_COLOR} strokeWidth="2" strokeLinejoin="round" fill={color} fillOpacity={0.04} />
      {/* Center line accent */}
      <line x1="24" y1="26" x2="24" y2="44" stroke={color} strokeWidth="1.5" opacity={0.5} />
    </svg>
  )
}

/** Finanzas — coins stacked with bar chart */
function FinanzasIcon({ width = 48, height = 48, className, color = DEFAULT_COLOR }: CategoryIconProps) {
  return (
    <svg width={width} height={height} viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
      {/* Bar chart */}
      <rect x="6" y="28" width="7" height="14" rx="1" stroke={LINE_COLOR} strokeWidth="1.5" fill={color} fillOpacity={0.1} />
      <rect x="16" y="20" width="7" height="22" rx="1" stroke={LINE_COLOR} strokeWidth="1.5" fill={color} fillOpacity={0.15} />
      <rect x="26" y="14" width="7" height="28" rx="1" stroke={LINE_COLOR} strokeWidth="1.5" fill={color} fillOpacity={0.2} />
      {/* Baseline */}
      <line x1="4" y1="42" x2="44" y2="42" stroke={LINE_COLOR} strokeWidth="1.5" strokeLinecap="round" />
      {/* Coin stack */}
      <ellipse cx="39" cy="28" rx="7" ry="3" stroke={color} strokeWidth="1.5" fill={color} fillOpacity={0.12} />
      <path d="M32 28L32 24" stroke={color} strokeWidth="1.5" />
      <path d="M46 28L46 24" stroke={color} strokeWidth="1.5" />
      <ellipse cx="39" cy="24" rx="7" ry="3" stroke={color} strokeWidth="1.5" fill={color} fillOpacity={0.12} />
      <path d="M32 24L32 20" stroke={color} strokeWidth="1.5" />
      <path d="M46 24L46 20" stroke={color} strokeWidth="1.5" />
      <ellipse cx="39" cy="20" rx="7" ry="3" stroke={color} strokeWidth="1.5" fill={color} fillOpacity={0.15} />
      {/* Trend line */}
      <path d="M8 24L18 18L28 12L38 8" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeDasharray="2 2" />
      <circle cx="38" cy="8" r="2" fill={color} />
    </svg>
  )
}

/** Ventas — handshake */
function VentasIcon({ width = 48, height = 48, className, color = DEFAULT_COLOR }: CategoryIconProps) {
  return (
    <svg width={width} height={height} viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
      {/* Left arm */}
      <path d="M4 22L12 18L20 22L24 20" stroke={LINE_COLOR} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" fill="none" />
      {/* Right arm */}
      <path d="M44 22L36 18L28 22L24 20" stroke={LINE_COLOR} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" fill="none" />
      {/* Clasped hands */}
      <path d="M18 22C18 22 20 26 24 26C28 26 30 22 30 22" stroke={color} strokeWidth="2" strokeLinecap="round" fill={color} fillOpacity={0.1} />
      {/* Lower detail */}
      <path d="M16 24L22 30L26 30L32 24" stroke={LINE_COLOR} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" fill="none" />
      {/* Sleeves */}
      <path d="M4 18L4 30L12 28L12 16Z" stroke={LINE_COLOR} strokeWidth="1.5" fill={color} fillOpacity={0.08} />
      <path d="M44 18L44 30L36 28L36 16Z" stroke={LINE_COLOR} strokeWidth="1.5" fill={color} fillOpacity={0.08} />
      {/* Deal sparkles */}
      <line x1="24" y1="8" x2="24" y2="12" stroke={color} strokeWidth="1.5" strokeLinecap="round" />
      <line x1="18" y1="10" x2="20" y2="13" stroke={color} strokeWidth="1.5" strokeLinecap="round" />
      <line x1="30" y1="10" x2="28" y2="13" stroke={color} strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  )
}

/** Marketing — megaphone */
function MarketingIcon({ width = 48, height = 48, className, color = DEFAULT_COLOR }: CategoryIconProps) {
  return (
    <svg width={width} height={height} viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
      {/* Megaphone cone */}
      <path d="M10 18L10 30L16 30L36 40L36 8L16 18Z" stroke={LINE_COLOR} strokeWidth="2" strokeLinejoin="round" fill={color} fillOpacity={0.08} />
      {/* Megaphone bell */}
      <path d="M36 8C36 8 42 12 42 24C42 36 36 40 36 40" stroke={LINE_COLOR} strokeWidth="2" strokeLinecap="round" fill="none" />
      {/* Speaker body */}
      <rect x="6" y="18" width="10" height="12" rx="2" stroke={LINE_COLOR} strokeWidth="2" fill={color} fillOpacity={0.12} />
      {/* Sound waves */}
      <path d="M44 18C46 20 46 28 44 30" stroke={color} strokeWidth="1.5" strokeLinecap="round" fill="none" />
      <path d="M46 14C50 18 50 30 46 34" stroke={color} strokeWidth="1.5" strokeLinecap="round" fill="none" />
      {/* Handle */}
      <path d="M12 30L12 38L16 38L16 30" stroke={LINE_COLOR} strokeWidth="1.5" fill="none" />
    </svg>
  )
}

/** Modelo de Negocio — puzzle pieces */
function ModeloNegocioIcon({ width = 48, height = 48, className, color = DEFAULT_COLOR }: CategoryIconProps) {
  return (
    <svg width={width} height={height} viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
      {/* Top-left piece */}
      <path
        d="M6 6L20 6L20 10C20 10 17 10 17 13C17 16 20 16 20 16L20 22L16 22C16 22 16 19 13 19C10 19 10 22 10 22L6 22Z"
        stroke={LINE_COLOR}
        strokeWidth="1.5"
        strokeLinejoin="round"
        fill={color}
        fillOpacity={0.12}
      />
      {/* Top-right piece */}
      <path
        d="M22 6L36 6L36 22L32 22C32 22 32 19 29 19C26 19 26 22 26 22L22 22L22 16C22 16 25 16 25 13C25 10 22 10 22 10Z"
        stroke={LINE_COLOR}
        strokeWidth="1.5"
        strokeLinejoin="round"
        fill={color}
        fillOpacity={0.08}
      />
      {/* Bottom-left piece */}
      <path
        d="M6 24L10 24C10 24 10 27 13 27C16 27 16 24 16 24L20 24L20 28C20 28 17 28 17 31C17 34 20 34 20 34L20 40L6 40Z"
        stroke={LINE_COLOR}
        strokeWidth="1.5"
        strokeLinejoin="round"
        fill={color}
        fillOpacity={0.06}
      />
      {/* Bottom-right piece */}
      <path
        d="M22 24L26 24C26 24 26 27 29 27C32 27 32 24 32 24L36 24L36 40L22 40L22 34C22 34 25 34 25 31C25 28 22 28 22 28Z"
        stroke={LINE_COLOR}
        strokeWidth="1.5"
        strokeLinejoin="round"
        fill={color}
        fillOpacity={0.15}
      />
      {/* Floating piece hint */}
      <path d="M38 10L44 10L44 18L38 18Z" stroke={color} strokeWidth="1.5" strokeDasharray="2 2" fill="none" opacity={0.4} />
    </svg>
  )
}

/** Equipo — people group */
function EquipoIcon({ width = 48, height = 48, className, color = DEFAULT_COLOR }: CategoryIconProps) {
  return (
    <svg width={width} height={height} viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
      {/* Center person */}
      <circle cx="24" cy="14" r="6" stroke={LINE_COLOR} strokeWidth="2" fill={color} fillOpacity={0.1} />
      <path d="M14 38C14 30 18 26 24 26C30 26 34 30 34 38" stroke={LINE_COLOR} strokeWidth="2" strokeLinecap="round" fill={color} fillOpacity={0.08} />
      {/* Left person */}
      <circle cx="8" cy="18" r="4.5" stroke={LINE_COLOR} strokeWidth="1.5" fill="none" />
      <path d="M0 38C0 32 3 28 8 28C11 28 13 29.5 14 32" stroke={LINE_COLOR} strokeWidth="1.5" strokeLinecap="round" fill="none" />
      {/* Right person */}
      <circle cx="40" cy="18" r="4.5" stroke={LINE_COLOR} strokeWidth="1.5" fill="none" />
      <path d="M48 38C48 32 45 28 40 28C37 28 35 29.5 34 32" stroke={LINE_COLOR} strokeWidth="1.5" strokeLinecap="round" fill="none" />
      {/* Connection dots */}
      <circle cx="16" cy="22" r="1.5" fill={color} fillOpacity={0.5} />
      <circle cx="32" cy="22" r="1.5" fill={color} fillOpacity={0.5} />
    </svg>
  )
}

/** Map category names to icon components */
export const CATEGORY_ICON_MAP: Record<ToolCategory, React.ComponentType<CategoryIconProps>> = {
  'Estrategia': EstrategiaIcon,
  'Mercado': MercadoIcon,
  'Producto': ProductoIcon,
  'Finanzas': FinanzasIcon,
  'Ventas': VentasIcon,
  'Marketing': MarketingIcon,
  'Equipo': EquipoIcon,
}

/** Convenience wrapper that selects the right icon by category name */
export function ToolCategoryIcon({
  category,
  width = 48,
  height = 48,
  className,
  color,
}: CategoryIconProps & { category: ToolCategory }) {
  const IconComponent = CATEGORY_ICON_MAP[category]
  if (!IconComponent) return null
  return <IconComponent width={width} height={height} className={className} color={color} />
}

// Named exports for direct use
export {
  EstrategiaIcon,
  MercadoIcon,
  ClienteIcon,
  ProductoIcon,
  FinanzasIcon,
  VentasIcon,
  MarketingIcon,
  ModeloNegocioIcon,
  EquipoIcon,
}
