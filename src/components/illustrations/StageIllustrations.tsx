'use client'

import React from 'react'

interface IllustrationProps {
  width?: number | string
  height?: number | string
  className?: string
}

/**
 * Pre-incubation: A lightbulb with radiating lines and a seedling at the base.
 * Represents ideation and the birth of an idea.
 */
export function PreIncubationIllustration({
  width = 200,
  height = 200,
  className,
}: IllustrationProps) {
  return (
    <svg
      width={width}
      height={height}
      viewBox="0 0 200 200"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      {/* Lightbulb body */}
      <path
        d="M100 30C72 30 50 52 50 80C50 100 62 110 70 120L70 135L130 135L130 120C138 110 150 100 150 80C150 52 128 30 100 30Z"
        stroke="#1a1a1a"
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="#7C3AED"
        fillOpacity={0.1}
      />
      {/* Bulb base lines */}
      <line x1="75" y1="142" x2="125" y2="142" stroke="#1a1a1a" strokeWidth="2.5" strokeLinecap="round" />
      <line x1="78" y1="149" x2="122" y2="149" stroke="#1a1a1a" strokeWidth="2.5" strokeLinecap="round" />
      <line x1="82" y1="156" x2="118" y2="156" stroke="#1a1a1a" strokeWidth="2.5" strokeLinecap="round" />
      {/* Bulb tip */}
      <path d="M90 156Q100 168 110 156" stroke="#1a1a1a" strokeWidth="2.5" strokeLinecap="round" fill="none" />
      {/* Filament */}
      <path
        d="M88 110L92 90L96 105L100 85L104 105L108 90L112 110"
        stroke="#7C3AED"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
      />
      {/* Radiating lines */}
      <line x1="100" y1="12" x2="100" y2="22" stroke="#7C3AED" strokeWidth="2" strokeLinecap="round" />
      <line x1="140" y1="22" x2="135" y2="30" stroke="#7C3AED" strokeWidth="2" strokeLinecap="round" />
      <line x1="60" y1="22" x2="65" y2="30" stroke="#7C3AED" strokeWidth="2" strokeLinecap="round" />
      <line x1="162" y1="52" x2="154" y2="56" stroke="#7C3AED" strokeWidth="2" strokeLinecap="round" />
      <line x1="38" y1="52" x2="46" y2="56" stroke="#7C3AED" strokeWidth="2" strokeLinecap="round" />
      <line x1="168" y1="80" x2="158" y2="80" stroke="#7C3AED" strokeWidth="2" strokeLinecap="round" />
      <line x1="32" y1="80" x2="42" y2="80" stroke="#7C3AED" strokeWidth="2" strokeLinecap="round" />
      {/* Small seedling at base */}
      <path d="M100 172L100 182" stroke="#059669" strokeWidth="2" strokeLinecap="round" />
      <path
        d="M100 178C95 174 88 175 87 180C86 185 92 187 100 182"
        stroke="#059669"
        strokeWidth="1.5"
        fill="#059669"
        fillOpacity={0.15}
      />
      <path
        d="M100 175C105 170 112 171 113 176C114 181 108 183 100 178"
        stroke="#059669"
        strokeWidth="1.5"
        fill="#059669"
        fillOpacity={0.15}
      />
    </svg>
  )
}

/**
 * Incubation: A beaker/flask with a plant growing inside, surrounded by data points.
 * Represents testing and validating.
 */
export function IncubationIllustration({
  width = 200,
  height = 200,
  className,
}: IllustrationProps) {
  return (
    <svg
      width={width}
      height={height}
      viewBox="0 0 200 200"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      {/* Flask body */}
      <path
        d="M78 30L78 80L45 150C40 160 47 172 58 172L142 172C153 172 160 160 155 150L122 80L122 30"
        stroke="#1a1a1a"
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="#059669"
        fillOpacity={0.08}
      />
      {/* Flask neck */}
      <line x1="72" y1="30" x2="128" y2="30" stroke="#1a1a1a" strokeWidth="2.5" strokeLinecap="round" />
      {/* Liquid level */}
      <path
        d="M62 130Q80 122 100 130Q120 138 138 130L155 150C160 160 153 172 142 172L58 172C47 172 40 160 45 150Z"
        fill="#059669"
        fillOpacity={0.15}
        stroke="none"
      />
      {/* Bubbles */}
      <circle cx="85" cy="145" r="4" stroke="#059669" strokeWidth="1.5" fill="none" />
      <circle cx="110" cy="155" r="3" stroke="#059669" strokeWidth="1.5" fill="none" />
      <circle cx="95" cy="160" r="2.5" stroke="#059669" strokeWidth="1.5" fill="none" />
      {/* Plant growing inside flask */}
      <path d="M100 130L100 90" stroke="#059669" strokeWidth="2" strokeLinecap="round" />
      <path
        d="M100 105C92 98 84 100 84 106C84 112 92 114 100 108"
        stroke="#059669"
        strokeWidth="1.5"
        fill="#059669"
        fillOpacity={0.2}
      />
      <path
        d="M100 95C108 88 116 90 116 96C116 102 108 104 100 98"
        stroke="#059669"
        strokeWidth="1.5"
        fill="#059669"
        fillOpacity={0.2}
      />
      <path
        d="M100 88C96 82 90 83 90 88C90 92 96 94 100 90"
        stroke="#059669"
        strokeWidth="1.5"
        fill="#059669"
        fillOpacity={0.2}
      />
      {/* Data points — small chart left */}
      <rect x="28" y="50" width="24" height="16" rx="3" stroke="#1a1a1a" strokeWidth="1.5" fill="none" />
      <line x1="32" y1="58" x2="36" y2="54" stroke="#059669" strokeWidth="1.5" strokeLinecap="round" />
      <line x1="36" y1="54" x2="40" y2="56" stroke="#059669" strokeWidth="1.5" strokeLinecap="round" />
      <line x1="40" y1="56" x2="48" y2="52" stroke="#059669" strokeWidth="1.5" strokeLinecap="round" />
      {/* Data points — bar chart right */}
      <rect x="148" y="60" width="24" height="16" rx="3" stroke="#1a1a1a" strokeWidth="1.5" fill="none" />
      <line x1="152" y1="72" x2="152" y2="66" stroke="#059669" strokeWidth="1.5" strokeLinecap="round" />
      <line x1="157" y1="72" x2="157" y2="64" stroke="#059669" strokeWidth="1.5" strokeLinecap="round" />
      <line x1="162" y1="72" x2="162" y2="68" stroke="#059669" strokeWidth="1.5" strokeLinecap="round" />
      <line x1="167" y1="72" x2="167" y2="63" stroke="#059669" strokeWidth="1.5" strokeLinecap="round" />
      {/* Small dots */}
      <circle cx="35" cy="85" r="2" fill="#059669" fillOpacity={0.4} />
      <circle cx="165" cy="42" r="2" fill="#059669" fillOpacity={0.4} />
      <circle cx="155" cy="95" r="2" fill="#059669" fillOpacity={0.4} />
    </svg>
  )
}

/**
 * Acceleration: A rocket launching with an upward trajectory graph behind it.
 * Represents growth and speed.
 */
export function AccelerationIllustration({
  width = 200,
  height = 200,
  className,
}: IllustrationProps) {
  return (
    <svg
      width={width}
      height={height}
      viewBox="0 0 200 200"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      {/* Background trajectory graph */}
      <path
        d="M25 170C50 168 80 160 100 140C120 120 130 90 140 60C145 45 148 35 155 25"
        stroke="#D97706"
        strokeWidth="2"
        strokeLinecap="round"
        strokeDasharray="6 4"
        fill="none"
      />
      {/* Graph area fill */}
      <path
        d="M25 170C50 168 80 160 100 140C120 120 130 90 140 60C145 45 148 35 155 25L155 170Z"
        fill="#D97706"
        fillOpacity={0.06}
      />
      {/* Axis lines */}
      <line x1="25" y1="170" x2="175" y2="170" stroke="#1a1a1a" strokeWidth="1.5" strokeLinecap="round" />
      <line x1="25" y1="170" x2="25" y2="20" stroke="#1a1a1a" strokeWidth="1.5" strokeLinecap="round" />
      {/* Axis ticks */}
      <line x1="60" y1="170" x2="60" y2="174" stroke="#1a1a1a" strokeWidth="1" />
      <line x1="100" y1="170" x2="100" y2="174" stroke="#1a1a1a" strokeWidth="1" />
      <line x1="140" y1="170" x2="140" y2="174" stroke="#1a1a1a" strokeWidth="1" />
      {/* Rocket body */}
      <g transform="translate(105 48) rotate(35)">
        <path
          d="M0-30C-4-30-10-15-10 5L-10 25L-6 25L-6 32L0 28L6 32L6 25L10 25L10 5C10-15 4-30 0-30Z"
          stroke="#1a1a1a"
          strokeWidth="2.5"
          strokeLinejoin="round"
          fill="#D97706"
          fillOpacity={0.12}
        />
        {/* Rocket window */}
        <circle cx="0" cy="0" r="4" stroke="#D97706" strokeWidth="2" fill="#D97706" fillOpacity={0.2} />
        {/* Rocket fins */}
        <path d="M-10 18L-18 28L-10 24" stroke="#1a1a1a" strokeWidth="1.5" fill="#D97706" fillOpacity={0.1} />
        <path d="M10 18L18 28L10 24" stroke="#1a1a1a" strokeWidth="1.5" fill="#D97706" fillOpacity={0.1} />
        {/* Exhaust flames */}
        <path
          d="M-4 32Q-2 42 0 38Q2 42 4 32"
          stroke="#D97706"
          strokeWidth="1.5"
          fill="#D97706"
          fillOpacity={0.3}
        />
        <path
          d="M-2 36Q0 46 2 36"
          stroke="#D97706"
          strokeWidth="1"
          fill="#D97706"
          fillOpacity={0.2}
        />
      </g>
      {/* Speed lines */}
      <line x1="60" y1="115" x2="78" y2="100" stroke="#D97706" strokeWidth="1.5" strokeLinecap="round" opacity={0.5} />
      <line x1="55" y1="130" x2="70" y2="118" stroke="#D97706" strokeWidth="1.5" strokeLinecap="round" opacity={0.4} />
      <line x1="50" y1="145" x2="62" y2="135" stroke="#D97706" strokeWidth="1.5" strokeLinecap="round" opacity={0.3} />
      {/* Data points on curve */}
      <circle cx="50" cy="168" r="3" fill="#D97706" fillOpacity={0.6} />
      <circle cx="80" cy="160" r="3" fill="#D97706" fillOpacity={0.6} />
      <circle cx="100" cy="140" r="3" fill="#D97706" fillOpacity={0.6} />
      <circle cx="130" cy="90" r="3" fill="#D97706" fillOpacity={0.6} />
    </svg>
  )
}

/**
 * Scaling: A globe with connected network nodes, showing expansion.
 * Represents scaling globally.
 */
export function ScalingIllustration({
  width = 200,
  height = 200,
  className,
}: IllustrationProps) {
  return (
    <svg
      width={width}
      height={height}
      viewBox="0 0 200 200"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      {/* Globe */}
      <circle cx="100" cy="100" r="70" stroke="#1a1a1a" strokeWidth="2.5" fill="#0891B2" fillOpacity={0.06} />
      {/* Globe horizontal lines */}
      <ellipse cx="100" cy="100" rx="70" ry="25" stroke="#1a1a1a" strokeWidth="1" fill="none" opacity={0.3} />
      <ellipse cx="100" cy="100" rx="70" ry="50" stroke="#1a1a1a" strokeWidth="1" fill="none" opacity={0.3} />
      {/* Globe vertical meridians */}
      <ellipse cx="100" cy="100" rx="25" ry="70" stroke="#1a1a1a" strokeWidth="1" fill="none" opacity={0.3} />
      <ellipse cx="100" cy="100" rx="50" ry="70" stroke="#1a1a1a" strokeWidth="1" fill="none" opacity={0.3} />
      {/* Central vertical line */}
      <line x1="100" y1="30" x2="100" y2="170" stroke="#1a1a1a" strokeWidth="1" opacity={0.3} />
      {/* Network nodes on globe */}
      <circle cx="72" cy="72" r="6" stroke="#0891B2" strokeWidth="2" fill="#0891B2" fillOpacity={0.2} />
      <circle cx="130" cy="80" r="6" stroke="#0891B2" strokeWidth="2" fill="#0891B2" fillOpacity={0.2} />
      <circle cx="90" cy="120" r="6" stroke="#0891B2" strokeWidth="2" fill="#0891B2" fillOpacity={0.2} />
      <circle cx="140" cy="115" r="6" stroke="#0891B2" strokeWidth="2" fill="#0891B2" fillOpacity={0.2} />
      <circle cx="65" cy="105" r="6" stroke="#0891B2" strokeWidth="2" fill="#0891B2" fillOpacity={0.2} />
      <circle cx="108" cy="60" r="6" stroke="#0891B2" strokeWidth="2" fill="#0891B2" fillOpacity={0.2} />
      <circle cx="115" cy="140" r="6" stroke="#0891B2" strokeWidth="2" fill="#0891B2" fillOpacity={0.2} />
      {/* Network connection lines */}
      <line x1="72" y1="72" x2="130" y2="80" stroke="#0891B2" strokeWidth="1.5" opacity={0.5} />
      <line x1="72" y1="72" x2="90" y2="120" stroke="#0891B2" strokeWidth="1.5" opacity={0.5} />
      <line x1="72" y1="72" x2="108" y2="60" stroke="#0891B2" strokeWidth="1.5" opacity={0.5} />
      <line x1="130" y1="80" x2="140" y2="115" stroke="#0891B2" strokeWidth="1.5" opacity={0.5} />
      <line x1="130" y1="80" x2="108" y2="60" stroke="#0891B2" strokeWidth="1.5" opacity={0.5} />
      <line x1="90" y1="120" x2="140" y2="115" stroke="#0891B2" strokeWidth="1.5" opacity={0.5} />
      <line x1="90" y1="120" x2="65" y2="105" stroke="#0891B2" strokeWidth="1.5" opacity={0.5} />
      <line x1="90" y1="120" x2="115" y2="140" stroke="#0891B2" strokeWidth="1.5" opacity={0.5} />
      <line x1="140" y1="115" x2="115" y2="140" stroke="#0891B2" strokeWidth="1.5" opacity={0.5} />
      <line x1="65" y1="105" x2="72" y2="72" stroke="#0891B2" strokeWidth="1.5" opacity={0.5} />
      <line x1="108" y1="60" x2="115" y2="140" stroke="#0891B2" strokeWidth="1.5" opacity={0.3} />
      {/* Outer orbiting dots */}
      <circle cx="28" cy="50" r="3" fill="#0891B2" fillOpacity={0.4} />
      <circle cx="172" cy="55" r="3" fill="#0891B2" fillOpacity={0.4} />
      <circle cx="20" cy="130" r="3" fill="#0891B2" fillOpacity={0.4} />
      <circle cx="180" cy="140" r="3" fill="#0891B2" fillOpacity={0.4} />
      {/* Dashed lines to outer dots */}
      <line x1="28" y1="50" x2="72" y2="72" stroke="#0891B2" strokeWidth="1" strokeDasharray="3 3" opacity={0.3} />
      <line x1="172" y1="55" x2="130" y2="80" stroke="#0891B2" strokeWidth="1" strokeDasharray="3 3" opacity={0.3} />
      <line x1="20" y1="130" x2="65" y2="105" stroke="#0891B2" strokeWidth="1" strokeDasharray="3 3" opacity={0.3} />
      <line x1="180" y1="140" x2="140" y2="115" stroke="#0891B2" strokeWidth="1" strokeDasharray="3 3" opacity={0.3} />
    </svg>
  )
}

/**
 * Tool: A wrench combined with a document, with a gear accent.
 * For use as a background or accent on tool pages.
 */
export function ToolIllustration({
  width = 200,
  height = 200,
  className,
}: IllustrationProps) {
  const gearAngles = [0, 45, 90, 135, 180, 225, 270, 315]

  return (
    <svg
      width={width}
      height={height}
      viewBox="0 0 200 200"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      {/* Document */}
      <rect
        x="55"
        y="30"
        width="100"
        height="130"
        rx="6"
        stroke="#1a1a1a"
        strokeWidth="2.5"
        fill="#059669"
        fillOpacity={0.06}
      />
      {/* Document fold */}
      <path d="M125 30L155 30L155 60L125 30Z" stroke="#1a1a1a" strokeWidth="1.5" fill="white" />
      <path d="M125 30L125 60L155 60" stroke="#1a1a1a" strokeWidth="2" strokeLinejoin="round" fill="none" />
      {/* Checkmark boxes */}
      <rect x="72" y="70" width="10" height="10" rx="2" stroke="#059669" strokeWidth="1.5" fill="none" />
      <path d="M74 75L77 78L80 72" stroke="#059669" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      <rect x="72" y="85" width="10" height="10" rx="2" stroke="#059669" strokeWidth="1.5" fill="none" />
      <path d="M74 90L77 93L80 87" stroke="#059669" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      {/* Document lines */}
      <line x1="88" y1="75" x2="138" y2="75" stroke="#1a1a1a" strokeWidth="1.5" strokeLinecap="round" opacity={0.3} />
      <line x1="88" y1="90" x2="130" y2="90" stroke="#1a1a1a" strokeWidth="1.5" strokeLinecap="round" opacity={0.3} />
      <line x1="72" y1="105" x2="138" y2="105" stroke="#1a1a1a" strokeWidth="1.5" strokeLinecap="round" opacity={0.3} />
      <line x1="72" y1="120" x2="125" y2="120" stroke="#1a1a1a" strokeWidth="1.5" strokeLinecap="round" opacity={0.3} />
      <line x1="72" y1="135" x2="132" y2="135" stroke="#1a1a1a" strokeWidth="1.5" strokeLinecap="round" opacity={0.3} />
      {/* Wrench overlapping bottom-left */}
      <g transform="translate(38 120) rotate(-45)">
        <path
          d="M0 10C0 4.5 4.5 0 10 0L12 0L12 4L8 8L12 12L12 16L10 16C4.5 16 0 11.5 0 6Z"
          stroke="#1a1a1a"
          strokeWidth="2"
          fill="#059669"
          fillOpacity={0.12}
        />
        <rect x="10" y="4" width="40" height="8" rx="1" stroke="#1a1a1a" strokeWidth="2" fill="#059669" fillOpacity={0.08} />
        <path
          d="M50 4L58 0L58 4L54 8L58 12L58 16L50 12Z"
          stroke="#1a1a1a"
          strokeWidth="2"
          fill="#059669"
          fillOpacity={0.12}
        />
      </g>
      {/* Small gear accent */}
      <circle cx="158" cy="150" r="14" stroke="#059669" strokeWidth="2" fill="#059669" fillOpacity={0.1} />
      <circle cx="158" cy="150" r="6" stroke="#059669" strokeWidth="2" fill="none" />
      {/* Gear teeth */}
      {gearAngles.map((angle) => {
        const rad = (angle * Math.PI) / 180
        const x1 = 158 + 12 * Math.cos(rad)
        const y1 = 150 + 12 * Math.sin(rad)
        const x2 = 158 + 17 * Math.cos(rad)
        const y2 = 150 + 17 * Math.sin(rad)
        return (
          <line
            key={angle}
            x1={x1}
            y1={y1}
            x2={x2}
            y2={y2}
            stroke="#059669"
            strokeWidth="2.5"
            strokeLinecap="round"
          />
        )
      })}
    </svg>
  )
}

/** Map stage numbers to their illustration components */
export const STAGE_ILLUSTRATIONS = {
  1: PreIncubationIllustration,
  2: IncubationIllustration,
  3: AccelerationIllustration,
  4: ScalingIllustration,
} as const
