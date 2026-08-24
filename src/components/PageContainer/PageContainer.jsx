import React from 'react'

export default function PageContainer({ title, subtitle, children }) {
  return (
    <div className="bg-background min-h-[60vh] py-10 px-4 md:px-7 font-serif">
      <div className="max-w-[1100px] mx-auto bg-white border border-border shadow-[0_4px_20px_rgba(60,30,10,0.05)] rounded-sm overflow-hidden">
        
        {/* Banner Header */}
        <div className="pattern-bg p-8 md:p-12 text-center relative border-b-2 border-border">
          <div className="absolute inset-0 bg-background opacity-80 -z-10"></div>
          <h1 className="text-[28px] md:text-[34px] font-bold text-primary leading-relaxed select-none">
            {title}
          </h1>
          {subtitle && (
            <p className="text-textSecondary text-[15px] md:text-[17px] mt-2 font-sans font-medium">
              {subtitle}
            </p>
          )}
        </div>

        {/* Page Content */}
        <div className="p-6 md:p-10 text-[17px] md:text-[19px] text-textPrimary leading-[2.1] text-right space-y-6 direction-rtl">
          {children}
        </div>

      </div>
    </div>
  )
}
