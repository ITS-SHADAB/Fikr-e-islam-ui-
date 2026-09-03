import React from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { useSettings } from "@/hooks/useSettings";

/**
 * AnimatedFeatureCard
 * Premium, rich, harmonious card design tailored specifically for Fikr-e-Islam website.
 * - Deep, full-color harmony using the website's palette (#2B2118, #A8793E, #F3E3D8, #F7F1E8, #3E2E20)
 * - Rich 2-tone gold & dark brown crest badge with soft ambient glow
 * - Warm ivory-cream parchment background with top and bottom golden accent trims
 * - High-contrast Nastaliq Urdu typography for effortless readability
 * - Luxury #2B2118 button with gold arrow badge and micro-motion
 * - Subtle, smooth hover elevation (300ms) with shadow depth
 */
export default function AnimatedFeatureCard({
  icon: Icon,
  title,
  description,
  to,
  index = 0,
}) {
  const { settings } = useSettings();
  const language =
    settings?.language === "ur" || settings?.language === "Urdu" ? "ur" : "en";
  const isRTL = language === "ur";

  return (
    <div className="h-full">
      <Link
        to={to}
        className="group block h-full select-none transition-transform duration-300 ease-out hover:-translate-y-2"
      >
        {/* Main Card Shell */}
        <div className="relative h-full overflow-hidden rounded-[26px] sm:rounded-[28px] border-2 border-[#A8793E]/45 bg-gradient-to-b from-[#FFFDF9] via-[#FAF3EA] to-[#F3E7D7] shadow-[0_6px_20px_rgba(43,33,24,0.07),0_2px_6px_rgba(168,121,62,0.05)] transition-all duration-300 ease-out group-hover:border-[#A8793E] group-hover:shadow-[0_16px_36px_rgba(43,33,24,0.15),0_4px_12px_rgba(168,121,62,0.12)] flex flex-col">
          
          {/* Top Decorative Gold Header Ribbon */}
          <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-transparent via-[#A8793E] to-transparent opacity-80" />

          {/* Inner Inset Gold Frame */}
          <div className="absolute inset-2 sm:inset-2.5 rounded-[20px] sm:rounded-[22px] border border-[#A8793E]/25 pointer-events-none z-0" />

          {/* Top-Right Delicate Islamic Concentric Arcs & Diamond Stars (Matching Reference Mockup) */}
          <svg
            className="absolute top-0 right-0 w-28 h-28 sm:w-32 sm:h-32 text-[#A8793E] opacity-[0.22] pointer-events-none select-none z-0 transition-opacity duration-300 group-hover:opacity-[0.34]"
            viewBox="0 0 100 100"
            fill="none"
          >
            {/* Concentric arcs radiating inward from top-right corner (100, 0) */}
            <circle cx="100" cy="0" r="22" stroke="currentColor" strokeWidth="0.75" strokeDasharray="2 2" />
            <circle cx="100" cy="0" r="42" stroke="currentColor" strokeWidth="0.8" />
            <circle cx="100" cy="0" r="62" stroke="currentColor" strokeWidth="0.75" strokeDasharray="3 2.5" />
            <circle cx="100" cy="0" r="82" stroke="currentColor" strokeWidth="0.8" />

            {/* Rotated delicate diamond stars along the arc orbits */}
            <rect x="76.5" y="10.5" width="3" height="3" transform="rotate(45 78 12)" fill="currentColor" />
            <rect x="60.5" y="26.5" width="3.5" height="3.5" transform="rotate(45 62 28)" fill="currentColor" />
            <rect x="44.5" y="44.5" width="3.5" height="3.5" transform="rotate(45 46 46)" fill="currentColor" />
            <rect x="84.5" y="40.5" width="3" height="3" transform="rotate(45 86 42)" fill="currentColor" />
            <rect x="30.5" y="66.5" width="3" height="3" transform="rotate(45 32 68)" fill="currentColor" />
          </svg>

          {/* Bottom-Left Authentic Islamic Mehrab Archway Watermark */}
          <svg
            className="absolute bottom-0 left-0 w-28 h-36 sm:w-34 sm:h-42 text-[#A8793E] opacity-[0.16] pointer-events-none select-none z-0 transition-opacity duration-300 group-hover:opacity-[0.26]"
            viewBox="0 0 120 150"
            fill="none"
          >
            {/* Outer Pointed Ogee Arch */}
            <path
              d="M 0 150 L 0 68 C 0 46 18 34 38 22 C 46 16 54 8 54 0 C 54 8 62 16 70 22 C 90 34 108 46 108 68 L 108 150"
              stroke="currentColor"
              strokeWidth="1.25"
              fill="currentColor"
              fillOpacity="0.04"
            />
            {/* Intermediate Nested Arch */}
            <path
              d="M 0 150 L 0 80 C 0 62 14 52 34 40 C 40 36 46 28 46 18 C 46 28 52 36 58 40 C 78 52 92 62 92 80 L 92 150"
              stroke="currentColor"
              strokeWidth="1"
              fill="currentColor"
              fillOpacity="0.06"
            />
            {/* Innermost Pointed Mehrab Arch */}
            <path
              d="M 0 150 L 0 92 C 0 78 12 70 28 60 C 34 56 38 48 38 38 C 38 48 42 56 48 60 C 64 70 76 78 76 92 L 76 150"
              stroke="currentColor"
              strokeWidth="0.9"
              fill="currentColor"
              fillOpacity="0.12"
            />
            {/* Central Rosette Star within the arch */}
            <g opacity="0.5" stroke="currentColor" strokeWidth="0.75">
              <circle cx="38" cy="98" r="14" strokeDasharray="2 2" />
              <polygon points="38,88 42,94 48,94 44,98 46,104 38,100 30,104 32,98 28,94 34,94" fill="currentColor" fillOpacity="0.2" />
            </g>
            {/* Foundation Base Lines */}
            <line x1="0" y1="144" x2="108" y2="144" stroke="currentColor" strokeWidth="0.9" opacity="0.6" />
            <line x1="0" y1="148" x2="108" y2="148" stroke="currentColor" strokeWidth="0.6" opacity="0.4" />
          </svg>

          {/* Card Content */}
          <div className="relative z-10 flex flex-col items-center text-center p-5 sm:p-6 md:p-6.5 flex-1">
            
            {/* Rich Crest Icon Badge: Dark Brown with Gold Rim & Glowing Ring */}
            <div className="relative mb-3 flex items-center justify-center">
              {/* Soft ambient gold halo */}
              <div className="absolute inset-0 rounded-2xl bg-[#A8793E]/20 blur-md transition-all duration-300 group-hover:bg-[#A8793E]/35 group-hover:blur-lg" />
              
              {/* Badge Container */}
              <div className="relative w-13 h-13 sm:w-15 sm:h-15 rounded-2xl bg-gradient-to-br from-[#2B2118] via-[#382B20] to-[#241B13] border-2 border-[#A8793E] ring-4 ring-[#F3E3D8] shadow-[0_6px_16px_rgba(43,33,24,0.25)] flex items-center justify-center transition-transform duration-300 group-hover:scale-105">
                <Icon className="w-6 h-6 sm:w-7 sm:h-7 text-[#F7F1E8]" strokeWidth={2} />
              </div>
            </div>

            {/* Card Title */}
            <h3
              className="text-2xl sm:text-[26px] font-extrabold text-[#2B2118] leading-tight tracking-tight mt-0.5 mb-1 transition-colors duration-300 group-hover:text-[#A8793E]"
              style={{ fontFamily: "'Payami Nastaleeq', 'Noto Nastaliq Urdu', serif" }}
            >
              {title}
            </h3>

            {/* Under-Title Decorative Gold Flourish: ― • ❖ • ― */}
            <div className="flex items-center justify-center gap-2 my-2 w-full select-none pointer-events-none opacity-90">
              <span className="h-[1px] w-8 sm:w-12 bg-gradient-to-r from-transparent to-[#A8793E]" />
              <span className="w-1 h-1 rounded-full bg-[#A8793E]" />
              {/* Center Diamond Rosette */}
              <span className="relative flex items-center justify-center w-3 h-3">
                <span className="w-2.5 h-2.5 rotate-45 border border-[#A8793E] bg-[#F7F1E8]" />
                <span className="absolute w-1 h-1 rotate-45 bg-[#A8793E]" />
              </span>
              <span className="w-1 h-1 rounded-full bg-[#A8793E]" />
              <span className="h-[1px] w-8 sm:w-12 bg-gradient-to-l from-transparent to-[#A8793E]" />
            </div>

            {/* Description: Deep rich brown, crystal clear and highly readable */}
            <p
              className="text-xs sm:text-[13.5px] leading-[2.2] sm:leading-[2.3] font-medium text-[#3E2E20] min-h-[54px] flex-1 px-1 sm:px-2 break-words"
              style={{ fontFamily: "'Payami Nastaleeq', 'Noto Nastaliq Urdu', serif" }}
            >
              {description}
            </p>

            {/* Action Button: High-End Pill with Gold Badge & Micro-Arrow Animation */}
            <div className="relative mt-4 sm:mt-5 flex items-center justify-center">
              <div className="inline-flex items-center gap-2 sm:gap-2.5 px-4 sm:px-5 py-1.5 sm:py-2 rounded-full bg-gradient-to-r from-[#2B2118] via-[#382B20] to-[#2B2118] border border-[#A8793E]/75 shadow-[0_4px_12px_rgba(43,33,24,0.22)] transition-all duration-300 group-hover:border-[#A8793E] group-hover:shadow-[0_6px_18px_rgba(168,121,62,0.32)]">
                {isRTL ? (
                  <>
                    {/* Urdu Label */}
                    <span
                      className="text-xs sm:text-sm font-bold text-[#F7F1E8] px-1"
                      style={{ fontFamily: "'Payami Nastaleeq', 'Noto Nastaliq Urdu', serif" }}
                    >
                      مزید پڑھیں
                    </span>

                    {/* Circular Gold Arrow Badge */}
                    <span className="w-6 h-6 sm:w-6.5 sm:h-6.5 rounded-full bg-[#A8793E] text-[#2B2118] flex items-center justify-center shadow-xs transition-transform duration-300 group-hover:-translate-x-1 shrink-0">
                      <ArrowLeft className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-[#2B2118]" strokeWidth={2.75} />
                    </span>
                  </>
                ) : (
                  <>
                    {/* English Label */}
                    <span className="text-xs sm:text-sm font-bold text-[#F7F1E8] px-1 font-serif">
                      Read More
                    </span>

                    {/* Circular Gold Arrow Badge */}
                    <span className="w-6 h-6 sm:w-6.5 sm:h-6.5 rounded-full bg-[#A8793E] text-[#2B2118] flex items-center justify-center shadow-xs transition-transform duration-300 group-hover:translate-x-1 shrink-0">
                      <ArrowRight className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-[#2B2118]" strokeWidth={2.75} />
                    </span>
                  </>
                )}
              </div>
            </div>

          </div>

          {/* Bottom Delicate Gold Accent Trim */}
          <div className="absolute bottom-0 inset-x-0 h-1 bg-gradient-to-r from-transparent via-[#A8793E]/60 to-transparent" />

        </div>
      </Link>
    </div>
  );
}
