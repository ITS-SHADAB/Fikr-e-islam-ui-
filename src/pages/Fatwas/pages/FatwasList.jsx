import React, { useEffect, useState, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Search, X, ShieldAlert, ChevronLeft, ChevronRight, Scale } from 'lucide-react';
import { useFatwasList } from '@/hooks/useContentCache';
import { useContentSearch } from '@/hooks/useContentSearch';
import { useCategories } from '@/hooks/useCategories';
import { useSettings } from '@/hooks/useSettings';
import { FatwaCard } from '@/components';
import { COLORS } from '@/utils/themeColors';

export default function FatwasList() {
  const { settings } = useSettings();
  const language =
    settings?.language === 'ur' || settings?.language === 'Urdu' ? 'ur' : 'en';
  const isRTL = language === 'ur';
  const [searchParams] = useSearchParams();
  const queryCategory = searchParams.get('category');

  const [page, setPage] = useState(1);
  const [selectedCategory, setSelectedCategory] = useState('');

  useEffect(() => {
    setSelectedCategory(queryCategory !== null ? queryCategory : '');
  }, [queryCategory]);

  // Centralized Global Search (contentType = fatwa)
  const {
    searchTerm,
    setSearchTerm,
    searchResults,
    isSearching,
    searchError,
    clearSearch,
    isSearchActive,
  } = useContentSearch({
    contentType: 'fatwa',
    limit: 12,
  });

  // Standard listing for pagination and categories (no search parameter sent)
  const {
    data,
    loading: listLoading,
    error: listError,
  } = useFatwasList({
    category: selectedCategory,
    page,
    limit: 9,
  });

  const displayedFatwas = useMemo(() => {
    if (isSearchActive) {
      if (selectedCategory) {
        return searchResults.filter((item) => item.category === selectedCategory);
      }
      return searchResults;
    }
    return data?.fatwas || [];
  }, [isSearchActive, searchResults, selectedCategory, data?.fatwas]);

  const fatwas = displayedFatwas;
  const loading = isSearchActive ? isSearching : listLoading;
  const error = isSearchActive ? searchError : listError;
  const pages = isSearchActive ? 1 : (data?.pages || 1);
  const total = isSearchActive ? displayedFatwas.length : (data?.total || 0);

  const handleSearchSubmit = (e) => {
    e?.preventDefault();
    if (document.activeElement && typeof document.activeElement.blur === 'function') {
      document.activeElement.blur();
    }
    setPage(1);
  };

  const handleCategoryChange = (category) => {
    setSelectedCategory(category);
    setPage(1);
  };

  const handlePageChange = (pageNum) => {
    setPage(pageNum);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const clearFilters = () => {
    setSelectedCategory('');
    clearSearch();
    setPage(1);
  };

  const { categories = [], loading: categoriesLoading } = useCategories('fatwa');
  const hasFilters = selectedCategory || isSearchActive;

  const getPageNumbers = (current, totalCount) => {
    if (totalCount <= 5) {
      return Array.from({ length: totalCount }, (_, i) => i + 1);
    }
    const pageArr = [];
    if (current <= 3) {
      pageArr.push(1, 2, 3, 4, '...', totalCount);
    } else if (current >= totalCount - 2) {
      pageArr.push(1, '...', totalCount - 3, totalCount - 2, totalCount - 1, totalCount);
    } else {
      pageArr.push(1, '...', current - 1, current, current + 1, '...', totalCount);
    }
    return pageArr;
  };

  return (
    <div
      dir={isRTL ? 'rtl' : 'ltr'}
      className="min-h-screen w-full max-w-full overflow-x-hidden"
      style={{ backgroundColor: COLORS?.background }}
    >
      {/* ══════════════════════════════════════════════════
          HERO HEADER — Darul Ifta Banner & Search
      ══════════════════════════════════════════════════ */}
      <div
        className="w-full py-8 sm:py-12 md:py-16 px-3.5 sm:px-4"
        style={{
          background: `linear-gradient(135deg, ${COLORS?.primary} 0%, #24160d 100%)`,
        }}
      >
        <div className="max-w-5xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-widest mb-3"
            style={{ backgroundColor: `${COLORS?.accent}25`, color: COLORS?.accent }}
          >
            <Scale className="w-3.5 h-3.5" />
            <span>{isRTL ? 'دار الافتاء و التحقیق' : 'DARUL IFTA & RESEARCH'}</span>
          </div>

          <h1
            className="text-lg sm:text-xl md:text-2xl font-bold font-serif mb-2 sm:mb-3 leading-snug px-2"
            style={{ color: '#ffffff' }}
          >
            {isRTL ? 'فتاویٰ اور شرعی احکام' : 'Fatwas & Shariah Rulings'}
          </h1>
          <p
            className="text-xs sm:text-sm md:text-base max-w-2xl mx-auto mb-6 sm:mb-8 px-2"
            style={{ color: `${COLORS?.accent}cc` }}
          >
            {isRTL
              ? 'مستند اور محقق مفتیانِ کرام کے قلم سے روزمرہ اور جدید مسائل کے شرعی احکام'
              : 'Authentic Shariah rulings on contemporary and daily life questions by qualified Muftis'}
          </p>

          {/* Search Bar */}
          <form
            onSubmit={handleSearchSubmit}
            className="flex items-center max-w-xl mx-auto gap-2 w-full"
          >
            <div className="relative flex-1 min-w-0">
              <Search
                className="absolute top-1/2 -translate-y-1/2 w-4 h-4 pointer-events-none"
                style={{
                  [isRTL ? 'right' : 'left']: '12px',
                  color: COLORS?.textSecondary,
                }}
              />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => {
                  setSearchTerm(e.target.value);
                  setPage(1);
                }}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.target.blur();
                  }
                }}
                placeholder={
                  isRTL
                    ? 'مسئلہ، فتویٰ یا کلیدی لفظ تلاش کریں...'
                    : 'Search rulings, keywords or questions...'
                }
                className="w-full py-2.5 sm:py-3.5 rounded-xl text-xs sm:text-sm outline-none border-0 font-medium shadow-md"
                style={{
                  backgroundColor: 'rgba(255,255,255,0.95)',
                  color: COLORS?.textPrimary,
                  paddingRight: isRTL ? '38px' : '36px',
                  paddingLeft: isRTL ? '36px' : '38px',
                }}
              />
              {searchTerm && (
                <button
                  type="button"
                  onClick={clearSearch}
                  className="absolute top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 p-1 cursor-pointer"
                  style={{ [isRTL ? 'left' : 'right']: '10px' }}
                  title={isRTL ? 'صاف کریں' : 'Clear'}
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>
            <button
              type="submit"
              className="px-4 sm:px-6 py-2.5 sm:py-3.5 rounded-xl text-xs sm:text-sm font-bold text-white shrink-0 transition-opacity hover:opacity-90 cursor-pointer shadow-md"
              style={{ backgroundColor: COLORS?.accent }}
            >
              {isRTL ? 'تلاش کریں' : 'Search'}
            </button>
          </form>
        </div>
      </div>

      {/* ══════════════════════════════════════════════════
          CATEGORY TAB BAR (Sticky)
      ══════════════════════════════════════════════════ */}
      <div
        className="sticky top-0 z-20 border-b shadow-2xs w-full max-w-full overflow-hidden"
        style={{ backgroundColor: COLORS?.white, borderColor: COLORS?.border }}
      >
        <div className="max-w-6xl mx-auto px-3 sm:px-4 w-full">
          <div className="flex items-center gap-1.5 overflow-x-auto py-2.5 scrollbar-none w-full touch-pan-x">
            {/* All button */}
            <button
              onClick={() => handleCategoryChange('')}
              className="flex-shrink-0 text-xs font-bold px-3.5 sm:px-4 py-1.5 sm:py-2 rounded-full transition-all cursor-pointer"
              style={{
                backgroundColor: !selectedCategory ? COLORS?.primary : 'transparent',
                color: !selectedCategory ? '#fff' : COLORS?.textSecondary,
                border: `1px solid ${
                  !selectedCategory ? COLORS?.primary : COLORS?.border
                }`,
              }}
            >
              {isRTL ? 'تمام فتاویٰ' : 'All Fatwas'}
              {!selectedCategory && total > 0 && (
                <span
                  className="ms-1.5 text-[10px] font-bold px-1.5 py-0.5 rounded-full"
                  style={{
                    backgroundColor: `${COLORS?.accent}40`,
                    color: COLORS?.accent,
                  }}
                >
                  {total}
                </span>
              )}
            </button>

            {categoriesLoading && categories.length === 0 ? (
              <div className="flex items-center gap-1.5" role="status" aria-label="Loading categories">
                {[1, 2, 3, 4].map((i) => (
                  <div
                    key={i}
                    className="h-8 w-20 rounded-full animate-pulse bg-slate-200/70 shrink-0"
                  />
                ))}
              </div>
            ) : (
              categories.map((cat) => {
                const isSelected = selectedCategory === cat?.value;
                return (
                  <button
                    key={cat?.value}
                    onClick={() => handleCategoryChange(cat?.value)}
                    className="flex-shrink-0 text-xs font-bold px-3.5 sm:px-4 py-1.5 sm:py-2 rounded-full transition-all cursor-pointer flex items-center gap-1.5"
                    style={{
                      backgroundColor: isSelected ? COLORS?.primary : 'transparent',
                      color: isSelected ? '#fff' : COLORS?.textSecondary,
                      border: `1px solid ${
                        isSelected ? COLORS?.primary : COLORS?.border
                      }`,
                    }}
                  >
                    <span>{isRTL ? cat?.labelUr : cat?.labelEn || cat?.labelUr}</span>
                    {typeof cat?.count === 'number' && (
                      <span
                        className="text-[10px] font-semibold px-1.5 py-0.2 rounded-full font-mono"
                        style={{
                          backgroundColor: isSelected ? 'rgba(255,255,255,0.25)' : 'rgba(0,0,0,0.06)',
                          color: isSelected ? '#fff' : COLORS?.textSecondary,
                        }}
                      >
                        {cat.count}
                      </span>
                    )}
                  </button>
                );
              })
            )}
          </div>
        </div>
      </div>

      {/* ══════════════════════════════════════════════════
          MAIN CONTENT AREA
      ══════════════════════════════════════════════════ */}
      <div className="max-w-6xl mx-auto px-3.5 sm:px-4 py-6 sm:py-8 w-full max-w-full overflow-hidden">
        {/* Active Filters Info Bar */}
        {(hasFilters || total > 0) && (
          <div className="flex items-center justify-between mb-5 sm:mb-6 flex-wrap gap-2 w-full min-w-0">
            <p
              className="text-xs font-medium truncate max-w-full"
              style={{ color: COLORS?.textSecondary }}
            >
              {total > 0
                ? isRTL
                  ? `${total} فتاویٰ دستیاب ہیں`
                  : `${total} fatwas available`
                : isRTL
                ? 'کوئی فتویٰ نہیں ملا'
                : 'No fatwas found'}
              {selectedCategory && (
                <span
                  className="ms-2 font-bold"
                  style={{ color: COLORS?.accent }}
                >
                  —{' '}
                  {categories.find((c) => c?.value === selectedCategory)
                    ?.labelUr || selectedCategory}
                </span>
              )}
              {searchTerm && (
                <span
                  className="ms-2"
                  style={{ color: COLORS?.textSecondary }}
                >
                  ("{searchTerm}")
                </span>
              )}
            </p>
            {hasFilters && (
              <button
                onClick={clearFilters}
                className="text-xs flex items-center gap-1 font-bold cursor-pointer hover:underline shrink-0"
                style={{ color: COLORS?.primary }}
              >
                <X className="w-3.5 h-3.5" />
                {isRTL ? 'فلٹر ختم کریں' : 'Clear filters'}
              </button>
            )}
          </div>
        )}

        {/* Fatwas Grid */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 w-full">
            {[...Array(6)].map((_, i) => (
              <div
                key={i}
                className="rounded-2xl overflow-hidden animate-pulse border p-4 sm:p-5 space-y-4 w-full"
                style={{
                  backgroundColor: COLORS?.white,
                  borderColor: COLORS?.border,
                }}
              >
                <div
                  className="h-4 rounded w-1/3"
                  style={{ backgroundColor: COLORS?.secondary }}
                />
                <div
                  className="h-5 rounded w-4/5"
                  style={{ backgroundColor: COLORS?.border }}
                />
                <div
                  className="h-16 rounded w-full"
                  style={{ backgroundColor: `${COLORS?.border}50` }}
                />
                <div
                  className="h-12 rounded w-full"
                  style={{ backgroundColor: `${COLORS?.border}40` }}
                />
              </div>
            ))}
          </div>
        ) : fatwas && fatwas.length > 0 ? (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 mb-8 sm:mb-10 w-full">
              {fatwas.map((fatwa) => (
                <FatwaCard key={fatwa?._id} fatwa={fatwa} />
              ))}
            </div>

            {/* Pagination */}
            {pages > 1 && (
              <div className="flex flex-wrap justify-center items-center gap-1.5 sm:gap-2 pt-4 w-full max-w-full">
                <button
                  onClick={() => handlePageChange(Math.max(1, page - 1))}
                  disabled={page === 1}
                  className="flex items-center gap-1 px-3 sm:px-4 py-1.5 sm:py-2 rounded-lg text-xs font-bold border disabled:opacity-40 transition-colors cursor-pointer"
                  style={{
                    borderColor: COLORS?.border,
                    backgroundColor: COLORS?.white,
                    color: COLORS?.textSecondary,
                  }}
                >
                  {isRTL ? (
                    <ChevronRight className="w-3.5 h-3.5" />
                  ) : (
                    <ChevronLeft className="w-3.5 h-3.5" />
                  )}
                  {isRTL ? 'پچھلا' : 'Prev'}
                </button>

                <div className="flex items-center gap-1 flex-wrap justify-center">
                  {getPageNumbers(page, pages).map((pNum, idx) =>
                    pNum === '...' ? (
                      <span
                        key={`ellipsis-${idx}`}
                        className="px-1.5 py-1 text-xs text-gray-400 font-bold"
                      >
                        ...
                      </span>
                    ) : (
                      <button
                        key={pNum}
                        onClick={() => handlePageChange(pNum)}
                        className="w-8 h-8 sm:w-9 sm:h-9 rounded-lg text-xs font-bold border transition-colors cursor-pointer"
                        style={{
                          backgroundColor:
                            page === pNum ? COLORS?.primary : COLORS?.white,
                          borderColor:
                            page === pNum ? COLORS?.primary : COLORS?.border,
                          color:
                            page === pNum ? '#fff' : COLORS?.textSecondary,
                        }}
                      >
                        {pNum}
                      </button>
                    )
                  )}
                </div>

                <button
                  onClick={() => handlePageChange(Math.min(pages, page + 1))}
                  disabled={page === pages}
                  className="flex items-center gap-1 px-3 sm:px-4 py-1.5 sm:py-2 rounded-lg text-xs font-bold border disabled:opacity-40 transition-colors cursor-pointer"
                  style={{
                    borderColor: COLORS?.border,
                    backgroundColor: COLORS?.white,
                    color: COLORS?.textSecondary,
                  }}
                >
                  {isRTL ? 'اگلا' : 'Next'}
                  {isRTL ? (
                    <ChevronLeft className="w-3.5 h-3.5" />
                  ) : (
                    <ChevronRight className="w-3.5 h-3.5" />
                  )}
                </button>
              </div>
            )}
          </>
        ) : (
          <div
            className="text-center py-24 rounded-2xl border"
            style={{
              backgroundColor: COLORS?.white,
              borderColor: COLORS?.border,
            }}
          >
            <ShieldAlert
              className="w-14 h-14 mx-auto mb-4 opacity-40"
              style={{ color: COLORS?.primary }}
            />
            <h3
              className="text-xl font-bold font-serif mb-2"
              style={{ color: COLORS?.textPrimary }}
            >
              {isRTL ? 'کوئی فتویٰ دستیاب نہیں' : 'No fatwas found'}
            </h3>
            <p className="text-sm mb-6" style={{ color: COLORS?.textSecondary }}>
              {isRTL
                ? 'دیگر فقہی ابواب یا مختلف کلیدی الفاظ تلاش کریں'
                : 'Try modifying your search keywords or category filters'}
            </p>
            {hasFilters && (
              <button
                onClick={clearFilters}
                className="px-6 py-2.5 rounded-xl text-sm font-bold text-white cursor-pointer transition-opacity hover:opacity-90"
                style={{ backgroundColor: COLORS?.primary }}
              >
                {isRTL ? 'تمام فتاویٰ دیکھیں' : 'View All Fatwas'}
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
