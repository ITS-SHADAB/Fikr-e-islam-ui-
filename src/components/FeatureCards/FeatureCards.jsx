import { COLORS } from '@/utils/themeColors';
import React from 'react'
import { FEATURE_CARDS } from '@/data/siteData'

const ICONS = {
  founder: (
    <svg viewBox="0 0 52 52" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M26 4 C16 4 8 14 8 24 C8 36 16 46 26 48 C36 46 44 36 44 24 C44 14 36 4 26 4Z" fill="none" stroke={COLORS.primary} strokeWidth="2.5"/>
      <path d="M22 20 L26 14 L30 20 L28 30 L24 30 Z" fill={COLORS.primary} opacity="0.7"/>
      <path d="M24 30 L26 46 L28 30" fill="none" stroke={COLORS.primary} strokeWidth="2"/>
      <line x1="14" y1="36" x2="22" y2="36" stroke={COLORS.accent} strokeWidth="1.5"/>
      <line x1="30" y1="36" x2="38" y2="36" stroke={COLORS.accent} strokeWidth="1.5"/>
    </svg>
  ),
  star: (
    <svg viewBox="0 0 52 52" fill="none" xmlns="http://www.w3.org/2000/svg">
      <g transform="translate(26,26)">
        <polygon points="0,-22 4,-10 14,-14 10,-4 22,0 10,4 14,14 4,10 0,22 -4,10 -14,14 -10,4 -22,0 -10,-4 -14,-14 -4,-10" fill="none" stroke={COLORS.primary} strokeWidth="2"/>
        <rect x="-12" y="-12" width="24" height="24" transform="rotate(45)" fill="none" stroke={COLORS.primary} strokeWidth="1.5"/>
        <polygon points="0,-9 6,-6 9,0 6,6 0,9 -6,6 -9,0 -6,-6" fill="none" stroke={COLORS.primary} strokeWidth="1"/>
        <circle cx="0" cy="0" r="4" fill={COLORS.accent} opacity="0.6"/>
      </g>
    </svg>
  ),
  books: (
    <svg viewBox="0 0 52 52" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect x="8"  y="36" width="36" height="9"  rx="1.5" fill={COLORS.primary} opacity="0.85"/>
      <rect x="10" y="26" width="32" height="10" rx="1.5" fill={COLORS.primary} opacity="0.85"/>
      <rect x="6"  y="14" width="40" height="12" rx="1.5" fill={COLORS.primary} opacity="0.85"/>
      <rect x="10" y="6"  width="32" height="10" rx="1.5" fill={COLORS.primary} opacity="0.85"/>
      <line x1="26" y1="14" x2="26" y2="45" stroke="rgba(255,255,255,0.25)" strokeWidth="1"/>
    </svg>
  ),
  minaret: (
    <svg viewBox="0 0 52 52" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect x="23" y="18" width="6" height="26" fill={COLORS.primary} opacity="0.9"/>
      <polygon points="26,8 20,20 32,20" fill={COLORS.primary} opacity="0.9"/>
      <circle cx="26" cy="5" r="5" fill={COLORS.primary}/>
      <circle cx="26" cy="5" r="2" fill={COLORS.accent}/>
      <rect x="18" y="24" width="16" height="3" rx="1" fill={COLORS.primary}/>
      <rect x="20" y="31" width="12" height="3" rx="1" fill={COLORS.primary}/>
      <path d="M10 44 Q26 38 42 44" fill="none" stroke={COLORS.primary} strokeWidth="2.5"/>
      <path d="M10 44 L10 50 Q26 46 42 50 L42 44" fill="none" stroke={COLORS.primary} strokeWidth="1.5"/>
      <line x1="26" y1="44" x2="26" y2="50" stroke={COLORS.primary} strokeWidth="1.5"/>
    </svg>
  ),
  library: (
    <svg viewBox="0 0 52 52" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect x="4"  y="10" width="7" height="36" rx="1.5" fill={COLORS.primary}/>
      <rect x="13" y="16" width="7" height="30" rx="1.5" fill={COLORS.primary}/>
      <rect x="22" y="8"  width="7" height="38" rx="1.5" fill={COLORS.primary}/>
      <rect x="31" y="14" width="7" height="32" rx="1.5" fill={COLORS.accent}/>
      <rect x="40" y="11" width="8" height="35" rx="1.5" fill={COLORS.primary}/>
      <line x1="2" y1="46" x2="50" y2="46" stroke={COLORS.primary} strokeWidth="2.5"/>
    </svg>
  ),
  contact: (
    <svg viewBox="0 0 52 52" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect x="10" y="10" width="32" height="40" rx="3" fill="none" stroke={COLORS.primary} strokeWidth="2.5"/>
      <rect x="20" y="6" width="12" height="9" rx="3" fill={COLORS.primary} opacity="0.8"/>
      <rect x="22" y="8" width="8" height="5" rx="2" fill={COLORS.secondary}/>
      <line x1="16" y1="26" x2="36" y2="26" stroke={COLORS.primary} strokeWidth="2"/>
      <line x1="16" y1="33" x2="36" y2="33" stroke={COLORS.primary} strokeWidth="2"/>
      <line x1="16" y1="40" x2="28" y2="40" stroke={COLORS.primary} strokeWidth="2"/>
      <line x1="32" y1="40" x2="42" y2="32" stroke={COLORS.primary} strokeWidth="2"/>
      <polygon points="42,32 36,38 39,42" fill={COLORS.primary}/>
    </svg>
  ),
}

export default function FeatureCards() {
  return (
    <section className="bg-secondary pt-[22px] px-4 md:px-7" aria-label="خدمات">
      <div className="max-w-[1440px] mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3.5">
        {FEATURE_CARDS.map((card) => (
          <div
            key={card.id}
            className="bg-background border border-border h-[130px] flex items-stretch overflow-visible cursor-pointer hover:shadow-[0_6px_24px_rgba(60,30,10,0.13)] transition-shadow relative"
          >
            {/* Text side */}
            <div className="flex-1 flex flex-col justify-center px-5 pr-5 text-right">
              <div className="text-[21px] font-bold text-primary leading-[1.5] mb-1">{card.title}</div>
              <div className="text-[15px] text-accent leading-[1.5]">{card.desc}</div>
            </div>
            {/* Semicircle icon side */}
            <div className="card-circle-side w-[115px] min-w-[115px] flex items-center justify-center shrink-0">
              <div className="relative z-10 w-[58px] h-[58px] flex items-center justify-center">
                {ICONS[card.icon]}
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}
