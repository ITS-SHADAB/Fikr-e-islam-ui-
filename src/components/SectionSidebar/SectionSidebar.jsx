import React, { useState, useRef, useEffect } from 'react';
import { Search, SlidersHorizontal, Book, Layers, X, Check, ChevronDown, ChevronUp } from 'lucide-react';
import { COLORS } from '@/utils/themeColors';

/* ─── Desktop Sidebar Section Header (Theme primary + accent icon) ─── */
export function SidebarHeader({ label, icon: Icon = Book }) {
  return (
    <div
      className="flex items-center justify-between px-4 py-3 select-none"
      style={{ backgroundColor: COLORS.primary }}
    >
      <span className="text-base font-bold text-[#F7F1E8] font-serif">{label}</span>
      <Icon className="w-4 h-4" style={{ color: COLORS.accent }} />
    </div>
  );
}

/* ─── Desktop Sidebar Link Button ─── */
export function SidebarLink({ label, active, onClick, count }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="w-full text-right px-4 py-2.5 text-sm font-medium transition-all rounded-sm flex items-center justify-between border-b last:border-b-0 hover:bg-black/5 cursor-pointer"
      style={{
        color: active ? COLORS.primary : COLORS.textPrimary,
        fontWeight: active ? 700 : 500,
        backgroundColor: active ? `${COLORS.secondary}` : 'transparent',
        borderColor: `${COLORS.border}50`,
      }}
    >
      <span className="truncate">{label}</span>
      <div className="flex items-center gap-1.5 shrink-0">
        {typeof count === 'number' && (
          <span className="text-[11px] px-1.5 py-0.2 rounded-full font-mono bg-black/5 text-[#2A211A]">
            {count}
          </span>
        )}
        <span className="text-xs" style={{ color: COLORS.accent }}>•</span>
      </div>
    </button>
  );
}

/**
 * SectionSidebar: Universal Sidebar Component for Jamia Banuri Town
 * Handles both Desktop Sticky Sidebar and Mobile Sticky Top Search & One-by-One Filter Dropdown
 */
export default function SectionSidebar({
  searchTerm = '',
  onSearchChange,
  onSearchSubmit,
  onClearSearch,
  searchPlaceholder = 'تلاش کریں...',
  searchLabel = 'تلاش',
  categories = [],
  categoriesLabel = 'موضوعات',
  allLabel = 'تمام',
  selectedCategory = '',
  onCategoryChange,
  isRTL = true,
  icon: Icon = Book,
  totalCount,
  children,
  className = '',
}) {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  // Close dropdown on outside click
  useEffect(() => {
    const handleOutsideClick = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setIsDropdownOpen(false);
      }
    };
    if (isDropdownOpen) {
      document.addEventListener('mousedown', handleOutsideClick);
    }
    return () => {
      document.removeEventListener('mousedown', handleOutsideClick);
    };
  }, [isDropdownOpen]);

  const handleFormSubmit = (e) => {
    e.preventDefault();
    if (onSearchSubmit) onSearchSubmit(e);
  };

  const handleClear = () => {
    if (onClearSearch) {
      onClearSearch();
    } else if (onSearchChange) {
      onSearchChange('');
    }
  };

  const getCategoryLabel = (cat) => {
    if (!cat) return '';
    if (typeof cat === 'string') return cat;
    if (isRTL) return cat.labelUr || cat.label || cat.value;
    return cat.labelEn || cat.label || cat.value;
  };

  const getCategoryValue = (cat) => {
    if (!cat) return '';
    if (typeof cat === 'string') return cat;
    return cat.value;
  };

  const selectedCategoryLabel = selectedCategory
    ? getCategoryLabel(categories.find((c) => getCategoryValue(c) === selectedCategory) || selectedCategory)
    : allLabel;

  return (
    <>
      {/* ══════════════════════════════════════════════════════════════
          1. MOBILE VIEW: Compact Sticky Top Search & One-by-One Dropdown
      ══════════════════════════════════════════════════════════════ */}
      <div
        ref={dropdownRef}
        className={`lg:hidden sticky top-16 md:top-20 z-30 mb-6 p-2.5 rounded-2xl border shadow-md backdrop-blur-md transition-all ${className}`}
        style={{
          backgroundColor: COLORS.cardBg,
          borderColor: COLORS.border,
        }}
        dir={isRTL ? 'rtl' : 'ltr'}
      >
        {/* Top Search & Filter Dropdown Row */}
        <div className="flex items-center gap-2">
          {/* Search Box */}
          <form onSubmit={handleFormSubmit} className="relative flex-1 min-w-0">
            <input
              type="text"
              placeholder={searchPlaceholder}
              value={searchTerm}
              onChange={(e) => onSearchChange && onSearchChange(e.target.value)}
              className="w-full border rounded-xl py-2 text-xs outline-none transition-all shadow-2xs placeholder:text-slate-400 focus:bg-white focus:border-amber-600"
              style={{
                borderColor: COLORS.border,
                backgroundColor: COLORS.background,
                color: COLORS.textPrimary,
                textAlign: isRTL ? 'right' : 'left',
                paddingRight: isRTL ? '2.25rem' : '0.75rem',
                paddingLeft: isRTL ? '2rem' : '2.25rem',
              }}
              dir={isRTL ? 'rtl' : 'ltr'}
            />
            <button
              type="submit"
              className="absolute top-2.5 transition-opacity hover:opacity-70 cursor-pointer"
              style={{
                [isRTL ? 'right' : 'left']: '0.65rem',
                color: COLORS.accent,
              }}
              aria-label="Search"
            >
              <Search className="w-3.5 h-3.5" />
            </button>

            {searchTerm && (
              <button
                type="button"
                onClick={handleClear}
                className="absolute top-2 text-xs text-slate-400 hover:text-slate-700 cursor-pointer px-1 py-0.5 rounded-full"
                style={{
                  [isRTL ? 'left' : 'right']: '0.65rem',
                }}
                aria-label="Clear search"
              >
                ✕
              </button>
            )}
          </form>

          {/* Compact Dropdown Filter Button */}
          <button
            type="button"
            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            className="px-3 py-2 text-xs font-bold rounded-xl border flex items-center gap-1.5 shadow-xs transition-all shrink-0 cursor-pointer max-w-[145px]"
            style={{
              backgroundColor: selectedCategory ? COLORS.primary : COLORS.white,
              borderColor: selectedCategory ? COLORS.primary : COLORS.border,
              color: selectedCategory ? COLORS.white : COLORS.textPrimary,
            }}
          >
            <SlidersHorizontal className="w-3.5 h-3.5 shrink-0" style={{ color: COLORS.accent }} />
            <span className="truncate">{selectedCategoryLabel}</span>
            {isDropdownOpen ? (
              <ChevronUp className="w-3.5 h-3.5 shrink-0" />
            ) : (
              <ChevronDown className="w-3.5 h-3.5 shrink-0" />
            )}
          </button>
        </div>

        {/* ── One-by-One Vertical Dropdown Menu (Opens downwards) ── */}
        {isDropdownOpen && (
          <div
            className="mt-2.5 pt-2.5 border-t space-y-1 max-h-64 overflow-y-auto custom-drawer-scrollbar animate-fade-in"
            style={{ borderColor: `${COLORS.border}80` }}
          >
            <div className="flex items-center justify-between px-1 pb-1.5 text-[11px] font-bold" style={{ color: COLORS.textSecondary }}>
              <span>{isRTL ? 'موضوع منتخب کریں (ایک ایک کر کے):' : 'Select category:'}</span>
              {selectedCategory && (
                <button
                  type="button"
                  onClick={() => {
                    if (onCategoryChange) onCategoryChange('');
                    setIsDropdownOpen(false);
                  }}
                  className="underline text-[11px] font-bold cursor-pointer"
                  style={{ color: COLORS.accent }}
                >
                  {isRTL ? 'فلٹر ختم کریں' : 'Reset'}
                </button>
              )}
            </div>

            {/* "All" Option */}
            <button
              type="button"
              onClick={() => {
                if (onCategoryChange) onCategoryChange('');
                setIsDropdownOpen(false);
              }}
              className="w-full p-2.5 rounded-xl text-xs font-bold text-start flex items-center justify-between border transition-all cursor-pointer"
              style={{
                backgroundColor: selectedCategory === '' ? `${COLORS.secondary}60` : COLORS.white,
                borderColor: selectedCategory === '' ? COLORS.primary : `${COLORS.border}70`,
                color: selectedCategory === '' ? COLORS.primary : COLORS.textPrimary,
              }}
            >
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full" style={{ backgroundColor: COLORS.accent }} />
                <span>{allLabel}</span>
              </div>
              {selectedCategory === '' && <Check className="w-4 h-4" style={{ color: COLORS.primary }} />}
            </button>

            {/* List Each Option One-by-One */}
            {categories.map((cat, idx) => {
              const val = getCategoryValue(cat);
              const lbl = getCategoryLabel(cat);
              const isSelected = selectedCategory === val;
              return (
                <button
                  key={val || idx}
                  type="button"
                  onClick={() => {
                    if (onCategoryChange) onCategoryChange(val);
                    setIsDropdownOpen(false);
                  }}
                  className="w-full p-2.5 rounded-xl text-xs font-medium text-start flex items-center justify-between border transition-all hover:bg-slate-50 cursor-pointer"
                  style={{
                    backgroundColor: isSelected ? `${COLORS.secondary}60` : COLORS.white,
                    borderColor: isSelected ? COLORS.primary : `${COLORS.border}70`,
                    color: isSelected ? COLORS.primary : COLORS.textPrimary,
                    fontWeight: isSelected ? 700 : 500,
                  }}
                >
                  <div className="flex items-center gap-2 truncate">
                    <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: isSelected ? COLORS.accent : COLORS.border }} />
                    <span className="truncate">{lbl}</span>
                  </div>
                  {isSelected && <Check className="w-4 h-4 shrink-0" style={{ color: COLORS.primary }} />}
                </button>
              );
            })}
          </div>
        )}
      </div>

      {/* ══════════════════════════════════════════════════════════════
          2. DESKTOP VIEW: Classic Sticky Sidebar
      ══════════════════════════════════════════════════════════════ */}
      <aside
        className={`hidden lg:block w-full lg:w-72 xl:w-80 shrink-0 sticky top-24 space-y-6 ${className}`}
        dir={isRTL ? 'rtl' : 'ltr'}
      >
        {/* Search Card */}
        <div
          className="rounded-3xl border shadow-sm overflow-hidden"
          style={{
            backgroundColor: COLORS.white,
            borderColor: COLORS.border,
          }}
        >
          <SidebarHeader label={searchLabel} icon={Search} />
          <div className="p-4" style={{ backgroundColor: COLORS.white }}>
            <form onSubmit={handleFormSubmit} className="relative">
              <input
                type="text"
                placeholder={searchPlaceholder}
                value={searchTerm}
                onChange={(e) => onSearchChange && onSearchChange(e.target.value)}
                className="w-full border rounded-xl py-2.5 text-xs outline-none transition-all shadow-2xs focus:bg-white focus:border-amber-600"
                style={{
                  borderColor: COLORS.border,
                  backgroundColor: COLORS.background,
                  color: COLORS.textPrimary,
                  textAlign: isRTL ? 'right' : 'left',
                  paddingRight: isRTL ? '2.5rem' : '0.75rem',
                  paddingLeft: isRTL ? '2rem' : '2.5rem',
                }}
                dir={isRTL ? 'rtl' : 'ltr'}
              />
              <button
                type="submit"
                className="absolute top-3 transition-opacity hover:opacity-70 cursor-pointer"
                style={{
                  [isRTL ? 'right' : 'left']: '0.75rem',
                  color: COLORS.accent,
                }}
                aria-label="Search"
              >
                <Search className="w-4 h-4" />
              </button>

              {searchTerm && (
                <button
                  type="button"
                  onClick={handleClear}
                  className="absolute top-2.5 text-xs text-slate-400 hover:text-slate-700 cursor-pointer px-1 py-0.5 rounded-full"
                  style={{
                    [isRTL ? 'left' : 'right']: '0.75rem',
                  }}
                  aria-label="Clear search"
                >
                  ✕
                </button>
              )}
            </form>
          </div>
        </div>

        {/* Categories Navigation Card */}
        {categories && categories.length > 0 && (
          <div
            className="rounded-3xl border shadow-sm overflow-hidden"
            style={{
              backgroundColor: COLORS.white,
              borderColor: COLORS.border,
            }}
          >
            <SidebarHeader label={categoriesLabel} icon={Icon} />

            {/* "All" Link Button */}
            <SidebarLink
              label={allLabel}
              active={selectedCategory === ''}
              count={totalCount}
              onClick={() => onCategoryChange && onCategoryChange('')}
            />

            {/* Category Links List */}
            <div className="max-h-[380px] overflow-y-auto custom-drawer-scrollbar">
              {categories.map((cat, idx) => {
                const val = getCategoryValue(cat);
                const lbl = getCategoryLabel(cat);
                const isSelected = selectedCategory === val;
                return (
                  <SidebarLink
                    key={val || idx}
                    label={lbl}
                    active={isSelected}
                    onClick={() => onCategoryChange && onCategoryChange(val)}
                  />
                );
              })}
            </div>
          </div>
        )}

        {/* Optional Custom Slots / Widgets */}
        {children}
      </aside>
    </>
  );
}
