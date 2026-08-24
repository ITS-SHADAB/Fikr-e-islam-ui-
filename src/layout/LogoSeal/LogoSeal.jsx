import React from 'react'
import { COLORS } from '@/utils/themeColors'

export default function LogoSeal({ size = 76, opacity = 1 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 120 120" xmlns="http://www.w3.org/2000/svg" style={{ opacity, flexShrink: 0 }}>
      <circle cx="60" cy="60" r="56" fill="none" stroke={COLORS.accent} strokeWidth="2.5"/>
      <circle cx="60" cy="60" r="50" fill="none" stroke={COLORS.accent} strokeWidth="1"/>
      <g fill="none" stroke={COLORS.primary} strokeWidth="1.5">
        <polygon points="60,16 68,38 92,32 76,52 92,68 68,64 64,88 52,68 28,74 44,54 24,42 48,42"/>
      </g>
      <rect x="57" y="38" width="6" height="34" fill={COLORS.accent} opacity="0.85"/>
      <polygon points="60,28 54,40 66,40" fill={COLORS.primary}/>
      <circle cx="60" cy="24" r="6" fill={COLORS.primary}/>
      <circle cx="60" cy="24" r="2.5" fill={COLORS.accent}/>
      <line x1="60" y1="18" x2="60" y2="24" stroke={COLORS.primary} strokeWidth="1.5"/>
      <rect x="48" y="72" width="24" height="5" rx="2" fill={COLORS.accent} opacity="0.7"/>
      <path d="M44 80 Q60 74 76 80" fill="none" stroke={COLORS.accent} strokeWidth="2"/>
      <path d="M44 80 L44 92 Q60 86 76 92 L76 80" fill="none" stroke={COLORS.accent} strokeWidth="1.5"/>
      <line x1="60" y1="80" x2="60" y2="92" stroke={COLORS.accent} strokeWidth="1.5"/>
      <g stroke={COLORS.accent} strokeWidth="1" opacity="0.5">
        <line x1="60" y1="4"   x2="60" y2="14"/>
        <line x1="60" y1="106" x2="60" y2="116"/>
        <line x1="4"  y1="60"  x2="14" y2="60"/>
        <line x1="106" y1="60" x2="116" y2="60"/>
        <line x1="14" y1="14"  x2="21" y2="21"/>
        <line x1="99" y1="14"  x2="92" y2="21"/>
        <line x1="14" y1="106" x2="21" y2="99"/>
        <line x1="99" y1="106" x2="92" y2="99"/>
      </g>
      <text x="60" y="110" textAnchor="middle" fontSize="7" fill={COLORS.accent} fontFamily="serif" opacity="0.8">جامعة بنوری ٹاؤن</text>
    </svg>
  )
}
