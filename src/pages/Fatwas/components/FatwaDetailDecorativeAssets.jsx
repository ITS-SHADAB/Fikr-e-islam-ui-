import React from 'react';

/**
 * IslamicLantern - Vector illustration of the traditional golden hanging lantern (فانوس)
 * exactly matching the design in Image 2:
 * - Hanging ring at top with delicate chain
 * - Multi-tiered filigree dome cap
 * - Amber glowing glass chamber with diamond facets
 * - Bottom finial with decorative tassel
 */
export function IslamicLantern({ className = "w-[56px] h-[112px]", style }) {
  return (
    <svg
      viewBox="0 0 70 130"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      style={style}
      aria-hidden="true"
    >
      <defs>
        {/* Warm amber radial glow for the interior glass */}
        <radialGradient
          id="lanternAmberGlow"
          cx="50%"
          cy="55%"
          r="48%"
          fx="50%"
          fy="50%"
        >
          <stop offset="0%" stopColor="#FFF7D6" stopOpacity="0.95" />
          <stop offset="35%" stopColor="#F5D076" stopOpacity="0.85" />
          <stop offset="75%" stopColor="#C8A46A" stopOpacity="0.45" />
          <stop offset="100%" stopColor="#875E2E" stopOpacity="0.05" />
        </radialGradient>

        {/* Gold metal gradient */}
        <linearGradient id="metalGold" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#EAD7B8" />
          <stop offset="30%" stopColor="#C8A46A" />
          <stop offset="70%" stopColor="#A8793E" />
          <stop offset="100%" stopColor="#875E2E" />
        </linearGradient>

        {/* Dark gold shadow */}
        <linearGradient id="metalDark" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#594129" />
          <stop offset="50%" stopColor="#875E2E" />
          <stop offset="100%" stopColor="#3A291A" />
        </linearGradient>

        {/* Soft aura behind the lantern */}
        <radialGradient id="auraGlow" cx="50%" cy="56%" r="42%">
          <stop offset="0%" stopColor="#F5D076" stopOpacity="0.4" />
          <stop offset="100%" stopColor="#F5D076" stopOpacity="0" />
        </radialGradient>
      </defs>

      {/* Ambient warm aura */}
      <circle cx="35" cy="68" r="32" fill="url(#auraGlow)" />

      {/* Top Chain from ceiling - solid dark bronze connecting all the way to head */}
      <line
        x1="35"
        y1="0"
        x2="35"
        y2="25"
        stroke="#42301E"
        strokeWidth="1.5"
      />

      {/* Top Hanging Ring - solid dark bronze */}
      <circle
        cx="35"
        cy="19"
        r="4"
        stroke="#42301E"
        strokeWidth="1.5"
        fill="none"
      />

      {/* Lantern Cap - Dome Tier 1 */}
      <ellipse cx="35" cy="25" rx="7" ry="2.5" fill="url(#metalGold)" />
      <path
        d="M28 25 C28 20, 42 20, 42 25 Z"
        fill="url(#metalDark)"
      />

      {/* Dome Tier 2 (Arch flair) */}
      <path
        d="M22 34 C25 27, 45 27, 48 34 L22 34 Z"
        fill="url(#metalGold)"
        stroke="#875E2E"
        strokeWidth="0.5"
      />

      {/* Dome Tier 3 (Main base rim) */}
      <path
        d="M17 42 C18 34, 52 34, 53 42 L17 42 Z"
        fill="url(#metalDark)"
      />
      <ellipse cx="35" cy="42" rx="18" ry="3" fill="url(#metalGold)" />

      {/* Glass Body Chamber */}
      <path
        d="M19 42 L24 82 C25 90, 45 90, 46 82 L51 42 Z"
        fill="url(#lanternAmberGlow)"
        stroke="url(#metalGold)"
        strokeWidth="1.4"
      />

      {/* Inner Flame Glow */}
      <ellipse cx="35" cy="64" rx="4" ry="9" fill="#FFFBEB" />
      <ellipse cx="35" cy="65" rx="2" ry="5.5" fill="#FDE047" opacity="0.9" />

      {/* Vertical Struts on Glass */}
      <path
        d="M27 42 Q28 62 30 82"
        stroke="url(#metalGold)"
        strokeWidth="1"
        strokeOpacity="0.8"
        fill="none"
      />
      <path
        d="M35 42 L35 84"
        stroke="url(#metalGold)"
        strokeWidth="1.2"
        strokeOpacity="0.9"
        fill="none"
      />
      <path
        d="M43 42 Q42 62 40 82"
        stroke="url(#metalGold)"
        strokeWidth="1"
        strokeOpacity="0.8"
        fill="none"
      />

      {/* Decorative Diamond Motif on Glass */}
      <polygon
        points="35,52 39,63 35,74 31,63"
        stroke="#A8793E"
        strokeWidth="0.8"
        fill="none"
        strokeOpacity="0.6"
      />

      {/* Lantern Bottom Base */}
      <ellipse cx="35" cy="83" rx="12" ry="2.5" fill="url(#metalDark)" />
      <path
        d="M23 83 L26 91 C26 94, 44 94, 44 91 L47 83 Z"
        fill="url(#metalGold)"
      />

      {/* Bottom Tassel Finial */}
      <circle cx="35" cy="95" r="2.5" fill="url(#metalGold)" />
      <path
        d="M33 97 L31 112 C31 114, 39 114, 39 112 L37 97 Z"
        fill="url(#metalDark)"
      />
      <circle cx="35" cy="115" r="1.5" fill="#C8A46A" />
    </svg>
  );
}

/**
 * IslamicBookSeal - Ornate 16-feature Islamic shamsa rosette medallion
 * with 4 cardinal pointed ogival arch tips and 12 scallops,
 * enclosing an open Quran / book motif in gold on dark chocolate brown.
 */
export function IslamicBookSeal({ className = "w-[66px] h-[66px] sm:w-[78px] sm:h-[78px]", style }) {
  return (
    <svg
      viewBox="0 0 72 72"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={`${className} shrink-0 select-none`}
      style={style}
      aria-hidden="true"
    >
      <defs>
        <linearGradient id="bookSealGoldBorder" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#F5E4C8" />
          <stop offset="35%" stopColor="#C8A46A" />
          <stop offset="70%" stopColor="#A8793E" />
          <stop offset="100%" stopColor="#785025" />
        </linearGradient>
        <radialGradient id="bookSealDarkFill" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#4A3728" />
          <stop offset="85%" stopColor="#322215" />
          <stop offset="100%" stopColor="#22160C" />
        </radialGradient>
      </defs>

      {/* Ornate 16-feature Islamic Shamsa Medallion with 4 cardinal ogival peaks and 12 scallops */}
      <path
        d="M 31.28 12.26 C 34.00 9.88, 33.60 6.10, 36.00 2.50 C 38.40 6.10, 38.00 9.88, 40.72 12.26 C 45.02 8.23, 49.26 9.98, 49.44 15.88 C 54.96 13.80, 58.20 17.04, 56.12 22.56 C 62.02 22.74, 63.77 26.98, 59.74 31.28 C 62.12 34.00, 65.90 33.60, 69.50 36.00 C 65.90 38.40, 62.12 38.00, 59.74 40.72 C 63.77 45.02, 62.02 49.26, 56.12 49.44 C 58.20 54.96, 54.96 58.20, 49.44 56.12 C 49.26 62.02, 45.02 63.77, 40.72 59.74 C 38.00 62.12, 38.40 65.90, 36.00 69.50 C 33.60 65.90, 34.00 62.12, 31.28 59.74 C 26.98 63.77, 22.74 62.02, 22.56 56.12 C 17.04 58.20, 13.80 54.96, 15.88 49.44 C 9.98 49.26, 8.23 45.02, 12.26 40.72 C 9.88 38.00, 6.10 38.40, 2.50 36.00 C 6.10 33.60, 9.88 34.00, 12.26 31.28 C 8.23 26.98, 9.98 22.74, 15.88 22.56 C 13.80 17.04, 17.04 13.80, 22.56 15.88 C 22.74 9.98, 26.98 8.23, 31.28 12.26 Z"
        fill="url(#bookSealDarkFill)"
        stroke="url(#bookSealGoldBorder)"
        strokeWidth="1.6"
      />

      {/* Inner Circular Gold Rim */}
      <circle
        cx="36"
        cy="36"
        r="20.5"
        stroke="url(#bookSealGoldBorder)"
        strokeWidth="1"
        strokeDasharray="2.5 1.5"
        fill="none"
        opacity="0.6"
      />

      {/* Open Quran / Book Motif */}
      <g transform="translate(22, 24)" stroke="#DEC498" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" fill="none">
        {/* Left page */}
        <path d="M14 19 C8.5 16.5 2.5 17.5 1 18.5 L1 4 C2.5 3 8.5 2 14 4.8 Z" fill="#3D2C1E" fillOpacity="0.5" />
        {/* Right page */}
        <path d="M14 19 C19.5 16.5 25.5 17.5 27 18.5 L27 4 C25.5 3 19.5 2 14 4.8 Z" fill="#3D2C1E" fillOpacity="0.5" />
        {/* Spine */}
        <line x1="14" y1="4.8" x2="14" y2="19" stroke="#E5D1B0" strokeWidth="1.3" />
        {/* Left page text lines */}
        <line x1="4.5" y1="7.5" x2="11" y2="6.5" stroke="#DEC498" strokeWidth="1.1" />
        <line x1="4.5" y1="10.5" x2="11" y2="9.5" stroke="#DEC498" strokeWidth="1.1" />
        <line x1="4.5" y1="13.5" x2="11" y2="12.5" stroke="#DEC498" strokeWidth="1.1" />
        <line x1="4.5" y1="16.5" x2="10.5" y2="15.5" stroke="#DEC498" strokeWidth="1.1" />
        {/* Right page text lines */}
        <line x1="17" y1="6.5" x2="23.5" y2="7.5" stroke="#DEC498" strokeWidth="1.1" />
        <line x1="17" y1="9.5" x2="23.5" y2="10.5" stroke="#DEC498" strokeWidth="1.1" />
        <line x1="17" y1="12.5" x2="23.5" y2="13.5" stroke="#DEC498" strokeWidth="1.1" />
        <line x1="17.5" y1="15.5" x2="23.5" y2="16.5" stroke="#DEC498" strokeWidth="1.1" />
      </g>
    </svg>
  );
}

/**
 * PdfDocumentIllustration - Islamic mihrab arched frame behind a realistic 3D paper document
 * with folded corner, crimson-red PDF tag badge, and Acrobat ribbon glyph.
 */
export function PdfDocumentIllustration({ className = "w-28 h-36 sm:w-32 sm:h-40 md:w-36 md:h-44" }) {
  return (
    <svg
      viewBox="0 0 160 200"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={`${className} shrink-0 select-none drop-shadow-sm`}
      aria-hidden="true"
    >
      <defs>
        <filter id="docShadow" x="18" y="30" width="124" height="160" filterUnits="userSpaceOnUse">
          <feDropShadow dx="0" dy="6" stdDeviation="6" floodColor="#2B2118" floodOpacity="0.20" />
        </filter>
        <linearGradient id="archFillGrad" x1="80" y1="8" x2="80" y2="195" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#EFE6D9" stopOpacity="0.85" />
          <stop offset="45%" stopColor="#E5D6C2" stopOpacity="0.5" />
          <stop offset="100%" stopColor="#DFCEB7" stopOpacity="0.25" />
        </linearGradient>
        <linearGradient id="paperGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#FFFFFF" />
          <stop offset="100%" stopColor="#FBF8F3" />
        </linearGradient>
        <linearGradient id="redBadgeGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#D92424" />
          <stop offset="100%" stopColor="#B91C1C" />
        </linearGradient>
        <linearGradient id="archBorderGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#E5D1B5" />
          <stop offset="50%" stopColor="#C8A46A" />
          <stop offset="100%" stopColor="#A8793E" />
        </linearGradient>
      </defs>

      {/* ISLAMIC MIHRAB ARCH (Multi-foil Scalloped Arch with Pillars) */}
      <path
        d="M 18 198 L 18 90 C 18 68, 28 62, 38 52 C 48 42, 54 44, 66 30 C 74 20, 78 12, 80 8 C 82 12, 86 20, 94 30 C 106 44, 112 42, 122 52 C 132 62, 142 68, 142 90 L 142 198 Z"
        fill="url(#archFillGrad)"
        stroke="url(#archBorderGrad)"
        strokeWidth="2"
      />

      {/* Inner Arch Molding Contour */}
      <path
        d="M 26 198 L 26 94 C 26 74, 34 68, 44 58 C 52 48, 60 50, 70 37 C 76 28, 78 20, 80 16 C 82 20, 84 28, 90 37 C 100 50, 108 48, 116 58 C 126 68, 134 74, 134 94 L 134 198"
        fill="none"
        stroke="#D8C09A"
        strokeWidth="1.2"
        strokeDasharray="3.5 2"
        opacity="0.75"
      />

      {/* Side Pillar Capital Moldings */}
      <rect x="14" y="86" width="9" height="5" rx="1.5" fill="#C8A46A" opacity="0.85" />
      <rect x="137" y="86" width="9" height="5" rx="1.5" fill="#C8A46A" opacity="0.85" />

      {/* 3D WHITE PDF DOCUMENT WITH SHADOW */}
      <g filter="url(#docShadow)">
        {/* Base Paper Sheet with rounded corners & top-right fold cut */}
        <path
          d="M 38 48 C 38 44, 41 41, 45 41 L 100 41 L 122 63 L 122 170 C 122 174.5, 118.5 178, 114 178 L 46 178 C 41.5 178, 38 174.5, 38 170 Z"
          fill="url(#paperGrad)"
          stroke="#E5D9C8"
          strokeWidth="1.2"
        />

        {/* Top-Right Folded Corner Flap */}
        <path
          d="M 100 41 L 100 60 C 100 62, 101 63, 103 63 L 122 63 Z"
          fill="#ECE3D4"
          stroke="#D5C4AC"
          strokeWidth="1"
        />
        {/* Soft shade under folded corner */}
        <path
          d="M 100 63 L 100 67 L 104 63 Z"
          fill="#2B2118"
          fillOpacity="0.12"
        />

        {/* Faint subtle document text lines in upper area */}
        <rect x="48" y="55" width="28" height="2" rx="1" fill="#E2D6C5" opacity="0.6" />

        {/* ADOBE ACROBAT RED INFINITY LOOP SYMBOL IN CENTER */}
        <g transform="translate(62, 98)">
          <path
            d="M 18 56 C 16 45, 8 36, 3 36 C -1 36, -3 40, -3 43 C -3 48, 3 50, 9 49 C 18 47, 26 39, 31 24 C 34 14, 37 4, 35 1 C 33 -1, 31 -1, 29 1 C 25 7, 24 18, 26 30 C 28 41, 33 54, 40 60 C 45 64, 50 63, 50 59 C 50 52, 45 50, 39 52 C 32 54, 27 60, 23 66"
            stroke="#C81E1E"
            strokeWidth="4"
            strokeLinecap="round"
            strokeLinejoin="round"
            fill="none"
          />
        </g>
      </g>

      {/* RED PDF BADGE / RIBBON ON THE LEFT */}
      <g transform="translate(28, 72)">
        <rect
          x="0"
          y="0"
          width="44"
          height="22"
          rx="4.5"
          fill="url(#redBadgeGrad)"
          filter="drop-shadow(0 3px 4px rgba(185, 28, 28, 0.4))"
        />
        <text
          x="22"
          y="15.5"
          fill="#FFFFFF"
          fontSize="12.5"
          fontWeight="bold"
          fontFamily="system-ui, -apple-system, sans-serif"
          textAnchor="middle"
          letterSpacing="0.5"
        >
          PDF
        </text>
      </g>
    </svg>
  );
}

/**
 * GoldDiamondDivider - Refined horizontal divider featuring the #A8793E diamond motif
 * Example: ──────── ◆ ────────
 */
export function GoldDiamondDivider({ className = "my-5" }) {
  return (
    <div className={`flex items-center justify-center gap-3 ${className}`} aria-hidden="true">
      <span className="h-[1px] flex-1 max-w-[100px] sm:max-w-[140px] bg-gradient-to-r from-transparent to-[#C8A46A]" />
      <span className="w-2.5 h-2.5 rotate-45 border border-[#A8793E] bg-[#C8A46A] shadow-xs shrink-0" />
      <span className="h-[1px] flex-1 max-w-[100px] sm:max-w-[140px] bg-gradient-to-l from-transparent to-[#C8A46A]" />
    </div>
  );
}

/**
 * IslamicGeometricWatermark - Ultra-subtle ornamental geometric pattern for panel backgrounds
 */
export function IslamicGeometricWatermark({ className = "w-48 h-48 opacity-[0.035]" }) {
  return (
    <svg
      viewBox="0 0 100 100"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-hidden="true"
    >
      <g stroke="#A8793E" strokeWidth="1.2">
        <circle cx="50" cy="50" r="40" />
        <rect x="22" y="22" width="56" height="56" rx="2" />
        <rect x="22" y="22" width="56" height="56" rx="2" transform="rotate(45 50 50)" />
        <circle cx="50" cy="50" r="22" strokeDasharray="3 3" />
        <polygon points="50,15 62,38 85,50 62,62 50,85 38,62 15,50 38,38" />
      </g>
    </svg>
  );
}

/**
 * IslamicBackgroundPattern - Seamless background pattern for page atmosphere
 */
export function IslamicBackgroundPattern() {
  return (
    <svg
      className="absolute inset-0 w-full h-full pointer-events-none opacity-[0.035]"
      xmlns="http://www.w3.org/2000/svg"
      width="100%"
      height="100%"
      aria-hidden="true"
    >
      <defs>
        <pattern id="islamic-geom-tile" width="60" height="60" patternUnits="userSpaceOnUse">
          <path
            d="M30 0 L60 30 L30 60 L0 30 Z"
            fill="none"
            stroke="#2B2118"
            strokeWidth="0.8"
          />
          <path
            d="M30 10 L50 30 L30 50 L10 30 Z"
            fill="none"
            stroke="#A8793E"
            strokeWidth="0.6"
          />
          <circle cx="30" cy="30" r="4" fill="none" stroke="#2B2118" strokeWidth="0.6" />
          <circle cx="0" cy="0" r="6" fill="none" stroke="#A8793E" strokeWidth="0.6" />
          <circle cx="60" cy="0" r="6" fill="none" stroke="#A8793E" strokeWidth="0.6" />
          <circle cx="0" cy="60" r="6" fill="none" stroke="#A8793E" strokeWidth="0.6" />
          <circle cx="60" cy="60" r="6" fill="none" stroke="#A8793E" strokeWidth="0.6" />
        </pattern>
      </defs>
      <rect width="100%" height="100%" fill="url(#islamic-geom-tile)" />
    </svg>
  );
}

/**
 * CardGeometricTexture - Subtle Islamic geometric background texture for outer cards
 */
export function CardGeometricTexture({
  className = "opacity-[0.08]",
  strokeColor = "#C8A46A",
  secondaryColor = "#A8793E",
  patternId = "card-arabesque-tile",
}) {
  return (
    <svg
      className={`absolute inset-0 w-full h-full pointer-events-none rounded-[20px] md:rounded-[24px] ${className}`}
      xmlns="http://www.w3.org/2000/svg"
      width="100%"
      height="100%"
      aria-hidden="true"
    >
      <defs>
        <pattern id={patternId} width="48" height="48" patternUnits="userSpaceOnUse">
          <path
            d="M24 0 L32 16 L48 24 L32 32 L24 48 L16 32 L0 24 L16 16 Z"
            fill="none"
            stroke={strokeColor}
            strokeWidth="0.85"
          />
          <rect
            x="14"
            y="14"
            width="20"
            height="20"
            transform="rotate(45 24 24)"
            fill="none"
            stroke={secondaryColor}
            strokeWidth="0.6"
          />
          <circle cx="24" cy="24" r="3.5" fill="none" stroke={strokeColor} strokeWidth="0.6" />
          <circle cx="0" cy="0" r="4.5" fill="none" stroke={strokeColor} strokeWidth="0.6" />
          <circle cx="48" cy="0" r="4.5" fill="none" stroke={strokeColor} strokeWidth="0.6" />
          <circle cx="0" cy="48" r="4.5" fill="none" stroke={strokeColor} strokeWidth="0.6" />
          <circle cx="48" cy="48" r="4.5" fill="none" stroke={strokeColor} strokeWidth="0.6" />
        </pattern>
      </defs>
      <rect width="100%" height="100%" fill={`url(#${patternId})`} />
    </svg>
  );
}


