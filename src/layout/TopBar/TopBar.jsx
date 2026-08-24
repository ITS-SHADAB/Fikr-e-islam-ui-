import React from 'react'
import { SITE } from '@/data/siteData'
import { COLORS } from '@/utils/themeColors'

export default function TopBar() {
  return (
    <div 
      style={{ backgroundColor: COLORS.primary, borderColor: COLORS.border }}
      className="h-11 flex items-center px-4 md:px-7 border-b relative z-50 font-serif"
    >
      <div className="w-full max-w-[1440px] mx-auto flex items-center justify-between gap-2">

        {/* Date — right side (RTL default) */}
        <div 
          style={{ color: COLORS.secondary }}
          className="flex items-center text-[11px] sm:text-[13px] whitespace-nowrap overflow-hidden text-ellipsis"
        >
          <span>{SITE.hijriDate}</span>
          <span className="mx-1.5 sm:mx-2" style={{ color: COLORS.accent }}>·</span>
          <span>{SITE.gregDate}</span>
        </div>


        {/* Bismillah — absolute center */}
        <div 
          style={{ color: COLORS.secondary }}
          className="absolute left-1/2 -translate-x-1/2 text-[15px] sm:text-[17px] whitespace-nowrap hidden lg:block select-none"
        >
          {SITE.bismillah}
        </div>

        {/* Actions — left side */}
        <div className="flex items-center mr-auto shrink-0">
          <button 
            style={{ backgroundColor: COLORS.primary, color: COLORS.secondary, borderLeft: `1px solid ${COLORS.border}` }}
            className="border-none px-3 sm:px-5 h-11 text-[12px] sm:text-[14px] hover:opacity-85 transition-colors"
          >
            لاگ ان
          </button>
          <button 
            style={{ backgroundColor: COLORS.accent, color: COLORS.white }}
            className="px-3 sm:px-4 h-11 text-[12px] sm:text-[14px] flex items-center gap-1 hover:opacity-90 transition-colors"
          >
            اردو <span className="text-[9px] sm:text-[10px]">▾</span>
          </button>
        </div>

      </div>
    </div>
  )
}
