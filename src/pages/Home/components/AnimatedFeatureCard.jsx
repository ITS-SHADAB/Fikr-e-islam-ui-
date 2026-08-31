import React from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { useSettings } from "@/hooks/useSettings";

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
      <Link to={to} className="group block h-full select-none">
        <div className="relative h-full overflow-hidden rounded-[26px] sm:rounded-3xl border border-[#E2D6C5] bg-gradient-to-b from-[#FDFAF5] via-[#FFFDF9] to-[#F8F3EA] shadow-[0_8px_24px_rgba(74,55,40,0.06)] transition-shadow duration-300 group-hover:shadow-[0_14px_36px_rgba(74,55,40,0.11)] group-hover:border-[#C5A880] flex flex-col">
          
          {/* Inner Inset Border Frame (Matching Reference Image) */}
          <div className="absolute inset-2 sm:inset-2.5 rounded-[20px] sm:rounded-[22px] border border-[#E8DDD0] pointer-events-none z-0" />

          {/* Top-Right Islamic Geometric Star Lattice (Native coordinates without CSS transform) */}
          <svg
            className="absolute top-0 right-0 w-32 h-32 sm:w-36 sm:h-36 text-[#B89C7D] opacity-25 pointer-events-none select-none z-0"
            viewBox="0 0 120 120"
            fill="none"
            stroke="currentColor"
            strokeWidth="0.75"
          >
            {/* Concentric Islamic Arcs from Top-Right (120, 0) */}
            <path d="M120 0 L0 0 L0 120 C0 53.73 53.73 0 120 0 Z" fill="currentColor" fillOpacity="0.03" />
            <path d="M120 20 C64.77 20 20 64.77 20 120" />
            <path d="M120 40 C75.82 40 40 75.82 40 120" />
            <path d="M120 60 C86.86 60 60 86.86 60 120" />
            <path d="M120 80 C97.91 80 80 97.91 80 120" />
            {/* Cross diagonal lattice lines */}
            <path d="M100 0 L0 100 M80 0 L0 80 M60 0 L0 60 M40 0 L0 40 M20 0 L0 20" strokeWidth="0.5" strokeDasharray="2 2" />
            {/* Islamic Stars / Diamonds */}
            <polygon points="40,25 45,30 40,35 35,30" strokeWidth="0.6" />
            <polygon points="70,55 75,60 70,65 65,60" strokeWidth="0.6" />
            <polygon points="31,65 35,69 31,73 27,69" strokeWidth="0.5" />
            <circle cx="40" cy="30" r="1.5" fill="currentColor" fillOpacity="0.4" />
            <circle cx="70" cy="60" r="1.5" fill="currentColor" fillOpacity="0.4" />
          </svg>

          {/* Bottom-Left Islamic Arches & Dome Architectural Silhouette */}
          <svg
            className="absolute bottom-0 left-0 w-28 h-32 sm:w-32 sm:h-36 text-[#B89C7D] opacity-30 pointer-events-none select-none z-0"
            viewBox="0 0 110 120"
            fill="none"
            stroke="currentColor"
            strokeWidth="0.9"
          >
            {/* Large Main Arch */}
            <path
              d="M 0 120 L 0 55 C 0 35 15 25 35 15 C 40 12 45 6 45 0 C 45 6 50 12 55 15 C 75 25 90 35 90 55 L 90 120"
              fill="currentColor"
              fillOpacity="0.05"
            />
            <path d="M 0 120 L 0 58 C 0 40 15 30 35 20 C 40 17 45 10 45 4 C 45 10 50 17 55 20 C 75 30 90 40 90 58 L 90 120" strokeWidth="0.75" />
            <path d="M 8 120 L 8 64 C 8 48 20 38 38 28 C 42 25 45 20 45 16 C 45 20 48 25 52 28 C 70 38 82 48 82 64 L 82 120" strokeWidth="0.6" />
            
            {/* Secondary Nested Arch */}
            <path
              d="M 0 120 L 0 75 C 0 60 10 52 25 45 C 28 43 30 38 30 34 C 30 38 32 43 35 45 C 50 52 60 60 60 75 L 60 120"
              fill="currentColor"
              fillOpacity="0.07"
            />
            <path d="M 0 120 L 0 78 C 0 64 10 56 25 49 C 28 47 30 42 30 38 C 30 42 32 47 35 49 C 50 56 60 64 60 78 L 60 120" strokeWidth="0.75" />

            {/* Small Foreground Arch */}
            <path
              d="M 0 120 L 0 92 C 0 82 6 76 15 70 C 17 68 18 64 18 60 C 18 64 19 68 21 70 C 30 76 36 82 36 92 L 36 120"
              fill="currentColor"
              fillOpacity="0.1"
            />
            <path d="M 0 120 L 0 94 C 0 85 6 79 15 73 C 17 71 18 68 18 64 C 18 68 19 71 21 73 C 30 79 36 85 36 94 L 36 120" strokeWidth="0.75" />

            {/* Base decorative horizontal lines */}
            <line x1="0" y1="115" x2="95" y2="115" strokeWidth="0.6" />
            <line x1="0" y1="110" x2="95" y2="110" strokeWidth="0.4" />
          </svg>

          {/* Card Content */}
          <div className="relative z-10 flex flex-col items-center text-center p-6 sm:p-7 flex-1">
            
            {/* Icon Halo & Premium Squircle Badge (Pure SVG Rosette Halo) */}
            <div className="relative mb-3 flex items-center justify-center">
              {/* Rosette Star Halo SVG */}
              <svg
                className="absolute w-20 h-20 text-[#C5A880]/35 pointer-events-none"
                viewBox="0 0 80 80"
                fill="none"
                stroke="currentColor"
                strokeWidth="0.75"
              >
                <circle cx="40" cy="40" r="32" strokeWidth="0.5" strokeDasharray="3 3" />
                <rect x="18" y="18" width="44" height="44" rx="8" />
                <rect x="18" y="18" width="44" height="44" rx="8" transform="rotate(45 40 40)" />
              </svg>
              
              {/* Badge Container */}
              <div className="relative w-14 h-14 sm:w-16 sm:h-16 rounded-2xl bg-gradient-to-b from-[#F7F2EB] to-[#EAE0D2] border border-[#D4C3AE] shadow-[inset_0_1px_2px_rgba(255,255,255,0.9),0_4px_12px_rgba(74,55,40,0.08)] flex items-center justify-center">
                <Icon className="w-6 h-6 sm:w-7 sm:h-7 text-[#382A1D]" />
              </div>
            </div>

            {/* Title */}
            <h3 className="text-xl sm:text-2xl font-bold text-[#2D241D] leading-snug tracking-tight mb-1 mt-1">
              {title}
            </h3>

            {/* Under-Title Delicate Flourish */}
            <div className="flex items-center justify-center gap-1.5 my-2 w-full select-none pointer-events-none">
              <span className="h-[1px] w-6 sm:w-8 bg-gradient-to-r from-transparent to-[#C5A880]/60" />
              <span className="w-1.5 h-1.5 rotate-45 bg-[#C5A880]" />
              <span className="h-[1px] w-6 sm:w-8 bg-gradient-to-l from-transparent to-[#C5A880]/60" />
            </div>

            {/* Description */}
            <p className="text-xs sm:text-[13.5px] leading-[2.1] font-normal text-[#5A4838] min-h-[58px] flex-1 px-1 mt-1 break-words">
              {description}
            </p>

            {/* Pill Button ("مزید جانیں" - Matching Reference Design) */}
            <div className="inline-flex items-center gap-3 px-5 py-2 mt-4 rounded-full bg-gradient-to-r from-[#F7F2EB] via-[#F4ECE2] to-[#EFE7DC] border border-[#D4C3AE] text-[#382A1D] font-bold text-xs sm:text-sm shadow-2xs group-hover:border-[#C5A880] group-hover:shadow-xs transition-all duration-300">
              {isRTL && (
                <span className="w-6 h-6 rounded-full bg-[#E5D7C5] flex items-center justify-center text-[#382A1D] group-hover:-translate-x-1 transition-transform duration-300 shrink-0 shadow-2xs">
                  <ArrowLeft className="w-3.5 h-3.5" />
                </span>
              )}
              
              <span>{isRTL ? "مزید جانیں" : "Learn More"}</span>

              {!isRTL && (
                <span className="w-6 h-6 rounded-full bg-[#E5D7C5] flex items-center justify-center text-[#382A1D] group-hover:translate-x-1 transition-transform duration-300 shrink-0 shadow-2xs">
                  <ArrowRight className="w-3.5 h-3.5" />
                </span>
              )}
            </div>

          </div>
        </div>
      </Link>
    </div>
  );
}
