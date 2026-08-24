import React, { useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { NAV_ITEMS } from '@/constants/navigation'
import { SITE } from '@/data/siteData'
import { LogoSeal } from '@/layout';
import { Input } from '@/components';
import { COLORS } from '@/utils/themeColors'

export default function Header() {
  const location = useLocation()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [activeDropdownIndex, setActiveDropdownIndex] = useState(null)

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen)
  }

  const toggleDropdown = (index, e) => {
    e.preventDefault()
    e.stopPropagation()
    setActiveDropdownIndex(activeDropdownIndex === index ? null : index)
  }

  const closeMobileMenu = () => {
    setMobileMenuOpen(false)
    setActiveDropdownIndex(null)
  }

  return (
    <header 
      style={{ backgroundColor: COLORS.white, borderBottomColor: COLORS.border }}
      className="border-b px-4 md:px-7 sticky top-0 z-40 shadow-sm font-serif"
    >
      <div className="max-w-[1440px] mx-auto h-[80px] md:h-[100px] flex items-center justify-between gap-2 md:gap-4">

        {/* Hamburger Menu Button (Leftmost in RTL / Visually Left) */}
        <button
          onClick={toggleMobileMenu}
          style={{ borderColor: COLORS.border, backgroundColor: COLORS.background }}
          className="flex lg:hidden flex-col justify-center items-center w-10 h-10 border rounded transition-colors focus:outline-none theme-hover-bg-secondary"
          aria-label="مینو"
        >
          <span style={{ backgroundColor: COLORS.primary }} className={`block w-6 h-0.5 transition-all duration-300 ${mobileMenuOpen ? 'rotate-45 translate-y-1.5' : ''}`}></span>
          <span style={{ backgroundColor: COLORS.primary }} className={`block w-6 h-0.5 my-1 transition-all duration-300 ${mobileMenuOpen ? 'opacity-0' : ''}`}></span>
          <span style={{ backgroundColor: COLORS.primary }} className={`block w-6 h-0.5 transition-all duration-300 ${mobileMenuOpen ? '-rotate-45 -translate-y-1.5' : ''}`}></span>
        </button>

        {/* Search — leftmost in Desktop, responsive width on smaller devices */}
        <div 
          style={{ borderColor: COLORS.border, backgroundColor: COLORS.white }}
          className="flex items-center border h-[36px] md:h-[38px] shrink-0 overflow-hidden"
        >
          <button 
            style={{ backgroundColor: COLORS.white, borderRight: `1px solid ${COLORS.border}`, color: COLORS.textSecondary }}
            className="border-none w-[36px] md:w-[38px] h-[36px] md:h-[38px] flex items-center justify-center text-[15px] hover:bg-gray-50 transition-colors"
          >
            🔍
          </button>
          <Input
            type="text"
            placeholder="تلاش..."
            style={{ color: COLORS.textPrimary }}
            inputClassName="border-none outline-none px-2 md:px-3.5 text-[13px] md:text-[14px] w-[80px] sm:w-[120px] md:w-[170px] direction-rtl bg-transparent font-[inherit] placeholder:text-textSecondary/50"
            aria-label="تلاش"
            border=""
          />
        </div>

        {/* Navigation — center (Desktop Only) */}
        <nav className="hidden lg:flex flex-1 justify-center h-full" aria-label="مرکزی نیویگیشن">
          <ul className="flex items-stretch h-[100px]">
            {NAV_ITEMS.map((item) => {
              const isActive = location.pathname === item.href || 
                               (item.href !== '/' && location.pathname.startsWith(item.href))

              return (
                <li key={item.label} className="relative group flex items-stretch">
                  <Link
                    to={item.hasDropdown && item.dropdownItems ? item.dropdownItems[0].href : item.href}
                    style={isActive ? { color: COLORS.primary } : { color: COLORS.textPrimary }}
                    className={`nav-link flex items-center gap-1.5 px-[14px] xl:px-[18px] text-[18px] xl:text-[19px] whitespace-nowrap h-[100px] ${isActive ? 'active' : ''}`}
                  >
                    {item.label}
                    {item.hasDropdown && (
                      <span style={{ color: COLORS.accent }} className="text-[11px] select-none transition-transform group-hover:rotate-180">
                        ‹
                      </span>
                    )}
                  </Link>

                  {/* Dropdown menu */}
                  {item.hasDropdown && item.dropdownItems && (
                    <div 
                      style={{ backgroundColor: COLORS.primary, borderTopColor: COLORS.accent }}
                      className="absolute right-0 top-[100px] hidden group-hover:block border-t-2 shadow-xl min-w-[320px] z-[100] text-right"
                    >
                      <ul className="py-1">
                        {item.dropdownItems.map((subItem, idx) => {
                          const isSubActive = location.pathname === subItem.href

                          return (
                            <li key={idx} style={{ borderBottomColor: COLORS.border }} className="border-b last:border-none">
                              <Link
                                to={subItem.href}
                                style={isSubActive ? { backgroundColor: COLORS.accent, color: COLORS.white } : { color: COLORS.white }}
                                className="block px-6 py-3.5 text-[16px] transition-colors leading-relaxed whitespace-normal theme-hover-bg-accent"
                              >
                                {subItem.label}
                              </Link>
                            </li>
                          )
                        })}
                      </ul>
                    </div>
                  )}
                </li>
              )
            })}
          </ul>
        </nav>

        {/* Logo — rightmost in RTL */}
        <Link to="/" className="flex items-center gap-2 md:gap-3.5 shrink-0 hover:opacity-95 transition-opacity max-w-[60%] sm:max-w-none">
          <div className="leading-[1.2] sm:leading-[1.35] text-right">
            <span style={{ color: COLORS.primary }} className="block text-[18px] sm:text-[24px] md:text-[30px] font-bold leading-[1.2] whitespace-nowrap overflow-hidden text-ellipsis">
              {SITE.nameArabic}
            </span>
            <span style={{ color: COLORS.accent }} className="block text-[9px] sm:text-[11px] md:text-[13px] mt-0.5 whitespace-nowrap overflow-hidden text-ellipsis">
              {SITE.nameUrdu}
            </span>
          </div>
          <div className="w-[50px] h-[50px] md:w-[76px] md:h-[76px] flex items-center justify-center shrink-0">
            <div className="md:hidden">
              <LogoSeal size={50} />
            </div>
            <div className="hidden md:block">
              <LogoSeal size={76} />
            </div>
          </div>
        </Link>

      </div>

      {/* Mobile Drawer Overlay */}
      <div
        className={`fixed inset-0 z-[1000] bg-black bg-opacity-50 transition-opacity duration-300 lg:hidden ${
          mobileMenuOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
        }`}
        onClick={closeMobileMenu}
      >
        <div
          style={{ backgroundColor: COLORS.primary }}
          className={`fixed top-0 right-0 h-full w-[80%] max-w-[350px] text-white z-[1001] shadow-2xl transition-transform duration-300 transform ${
            mobileMenuOpen ? 'translate-x-0' : 'translate-x-full'
          }`}
          onClick={(e) => e.stopPropagation()}
        >
          {/* Drawer Header */}
          <div 
            style={{ borderBottomColor: COLORS.border, backgroundColor: COLORS.accent }}
            className="flex items-center justify-between p-5 border-b"
          >
            <span style={{ color: COLORS.secondary }} className="font-bold text-[18px]">مینو</span>
            <button
              onClick={closeMobileMenu}
              className="text-white hover:text-red-500 text-[24px] leading-none focus:outline-none transition-colors"
            >
              &times;
            </button>
          </div>

          {/* Drawer Content */}
          <nav className="overflow-y-auto h-[calc(100%-80px)] p-4 text-right custom-drawer-scrollbar">
            <ul className="space-y-2">
              {NAV_ITEMS.map((item, index) => {
                const isActive = location.pathname === item.href || 
                                 (item.href !== '/' && location.pathname.startsWith(item.href))
                const isDropdownOpen = activeDropdownIndex === index

                return (
                  <li key={item.label} style={{ borderBottomColor: COLORS.border }} className="border-b last:border-none pb-2">
                    {item.hasDropdown ? (
                      <div>
                        {/* Parent trigger link */}
                        <div className="flex items-center justify-between py-3 px-2">
                          <button
                            onClick={(e) => toggleDropdown(index, e)}
                            style={{ color: COLORS.accent, backgroundColor: COLORS.primary, transform: isDropdownOpen ? 'rotate(90deg)' : 'rotate(0deg)' }}
                            className="text-[14px] w-8 h-8 flex items-center justify-center rounded focus:outline-none transition-transform"
                          >
                            ‹
                          </button>
                          <Link
                            to={item.dropdownItems ? item.dropdownItems[0].href : item.href}
                            onClick={closeMobileMenu}
                            style={{ color: isActive ? COLORS.accent : COLORS.white }}
                            className="text-[19px] font-semibold text-right flex-1"
                          >
                            {item.label}
                          </Link>
                        </div>

                        {/* Dropdown Items list */}
                        {isDropdownOpen && item.dropdownItems && (
                          <ul 
                            style={{ backgroundColor: COLORS.primary, borderRightColor: COLORS.accent }}
                            className="mt-2 p-2 space-y-1 rounded border-r-2"
                          >
                            {item.dropdownItems.map((subItem, sIdx) => {
                              const isSubActive = location.pathname === subItem.href
                              return (
                                <li key={sIdx}>
                                  <Link
                                    to={subItem.href}
                                    onClick={closeMobileMenu}
                                    style={{ color: isSubActive ? COLORS.secondary : COLORS.white }}
                                    className="block p-2 text-[16px] text-right hover:opacity-80 transition-opacity"
                                  >
                                    {subItem.label}
                                  </Link>
                                </li>
                              )
                            })}
                          </ul>
                        )}
                      </div>
                    ) : (
                      <Link
                        to={item.href}
                        onClick={closeMobileMenu}
                        style={{ color: isActive ? COLORS.accent : COLORS.white }}
                        className="block py-3 px-2 text-[19px] font-semibold"
                      >
                        {item.label}
                      </Link>
                    )}
                  </li>
                )
              })}
            </ul>
          </nav>
        </div>
      </div>
    </header>
  )
}
