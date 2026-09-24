import React, { useEffect, useState, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Search, X, BookOpen, ChevronLeft, ChevronRight, Filter } from 'lucide-react';
import { useArticlesList } from '@/hooks/useContentCache';
import { useContentSearch } from '@/hooks/useContentSearch';
import { useCategories } from '@/hooks/useCategories';
import { useSettings } from '@/hooks/useSettings';
import { ArticleCard } from '@/components';
import { COLORS } from '@/utils/themeColors';

export default function ArticlesList() {
  const { settings } = useSettings();
  const language = settings?.language === 'ur' || settings?.language === 'Urdu' ? 'ur' : 'en';
  const isRTL = language === 'ur';
  const [searchParams] = useSearchParams();
  const queryCategory = searchParams.get('category');

  const [page, setPage] = useState(1);
  const [selectedCategory, setSelectedCategory] = useState('');
  const [showMobileFilters, setShowMobileFilters] = useState(false);

  useEffect(() => {
    setSelectedCategory(queryCategory !== null ? queryCategory : '');
  }, [queryCategory]);

  // Centralized Global Search (contentType = article)
  const {
    searchTerm,
    setSearchTerm,
    searchResults,
    isSearching,
    searchError,
    clearSearch,
    isSearchActive,
  } = useContentSearch({
    contentType: 'article',
    limit: 12,
  });

  // Standard listing for pagination and categories (no search parameter sent)
  const {
    data,
    loading: listLoading,
    error: listError,
  } = useArticlesList({
    category: selectedCategory,
    page,
    limit: 9,
  });

  const displayedArticles = useMemo(() => {
    if (isSearchActive) {
      if (selectedCategory) {
        return searchResults.filter((item) => item.category === selectedCategory);
      }
      return searchResults;
    }
    return data?.articles || [];
  }, [isSearchActive, searchResults, selectedCategory, data?.articles]);

  const articles = displayedArticles;
  const loading = isSearchActive ? isSearching : listLoading;
  const error = isSearchActive ? searchError : listError;
  const pages = isSearchActive ? 1 : (data?.pages || 1);
  const total = isSearchActive ? displayedArticles.length : (data?.total || 0);

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
    setShowMobileFilters(false);
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

  const { categories = [], loading: categoriesLoading } = useCategories('article');
  const hasFilters = selectedCategory || isSearchActive;

  return (
    <div dir={isRTL ? 'rtl' : 'ltr'} className="min-h-screen" style={{ backgroundColor: COLORS?.background }}>

      {/* ══════════════════════════════════════════════════
          HERO HEADER — Editorial masthead
      ══════════════════════════════════════════════════ */}
      <div
        className="w-full py-12 sm:py-16 px-4"
        style={{
          background: `linear-gradient(135deg, ${COLORS?.primary} 0%, #2d1f15 100%)`,
        }}
      >
        <div className="max-w-5xl mx-auto text-center">
          <span
            className="text-xs font-bold uppercase tracking-[0.25em] mb-3 block"
            style={{ color: COLORS?.accent }}
          >
            {isRTL ? 'مستند علمی مقالات' : 'SCHOLARLY ARTICLES'}
          </span>
          <h1
            className="text-xl sm:text-2xl font-bold font-serif mb-3 leading-snug"
            style={{ color: '#ffffff' }}
          >
            {isRTL ? 'اسلامی مضامین و مقالات' : 'Islamic Articles'}
          </h1>
          <p className="text-sm sm:text-base max-w-2xl mx-auto mb-8" style={{ color: `${COLORS?.accent}cc` }}>
            {isRTL
              ? 'علمائے کرام کے قلم سے تحریر کردہ مستند، تحقیقی اور فکر انگیز مقالات'
              : 'Authentic, research-based Islamic articles authored by distinguished scholars'}
          </p>

          {/* Search Bar */}
          <form onSubmit={handleSearchSubmit} className="flex items-center max-w-lg mx-auto gap-2">
            <div className="relative flex-1">
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
                placeholder={isRTL ? 'مقالات تلاش کریں...' : 'Search articles...'}
                className="w-full py-3 rounded-xl text-sm outline-none border-0 font-medium"
                style={{
                  backgroundColor: 'rgba(255,255,255,0.95)',
                  color: COLORS?.textPrimary,
                  paddingRight: isRTL ? '40px' : '36px',
                  paddingLeft: isRTL ? '36px' : '40px',
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
              className="px-5 py-3 rounded-xl text-sm font-bold text-white shrink-0 transition-opacity hover:opacity-90 cursor-pointer"
              style={{ backgroundColor: COLORS?.accent }}
            >
              {isRTL ? 'تلاش' : 'Search'}
            </button>
          </form>
        </div>
      </div>

      {/* ══════════════════════════════════════════════════
          CATEGORY TAB BAR
      ══════════════════════════════════════════════════ */}
      <div
        className="sticky top-0 z-20 border-b shadow-sm"
        style={{ backgroundColor: COLORS?.white, borderColor: COLORS?.border }}
      >
        <div className="max-w-6xl mx-auto px-4">
          <div className="flex items-center gap-1 overflow-x-auto py-2.5 scrollbar-none">
            {/* All categories button */}
            <button
              onClick={() => handleCategoryChange('')}
              className="flex-shrink-0 text-xs font-bold px-4 py-2 rounded-full transition-all cursor-pointer"
              style={{
                backgroundColor: !selectedCategory ? COLORS?.primary : 'transparent',
                color: !selectedCategory ? '#fff' : COLORS?.textSecondary,
                border: `1px solid ${!selectedCategory ? COLORS?.primary : COLORS?.border}`,
              }}
            >
              {isRTL ? 'سب' : 'All'}
              {!selectedCategory && total > 0 && (
                <span
                  className="ms-1.5 text-[10px] font-bold px-1.5 py-0.5 rounded-full"
                  style={{ backgroundColor: `${COLORS?.accent}40`, color: COLORS?.accent }}
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
                const isSelected = selectedCategory === cat.value;
                return (
                  <button
                    key={cat.value}
                    onClick={() => handleCategoryChange(cat.value)}
                    className="flex-shrink-0 text-xs font-bold px-4 py-2 rounded-full transition-all cursor-pointer flex items-center gap-1.5"
                    style={{
                      backgroundColor: isSelected ? COLORS?.primary : 'transparent',
                      color: isSelected ? '#fff' : COLORS?.textSecondary,
                      border: `1px solid ${isSelected ? COLORS?.primary : COLORS?.border}`,
                    }}
                  >
                    <span>{isRTL ? cat.labelUr : (cat.labelEn || cat.labelUr)}</span>
                    {typeof cat.count === 'number' && (
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
          CONTENT AREA
      ══════════════════════════════════════════════════ */}
      <div className="max-w-6xl mx-auto px-4 py-8">

        {/* Active Filters Info Bar */}
        {(hasFilters || total > 0) && (
          <div className="flex items-center justify-between mb-6 flex-wrap gap-2">
            <p className="text-xs font-medium" style={{ color: COLORS?.textSecondary }}>
              {total > 0
                ? isRTL
                  ? `${total} مقالات ملے`
                  : `${total} articles found`
                : isRTL
                  ? 'کوئی نتیجہ نہیں'
                  : 'No results'}
              {selectedCategory && (
                <span
                  className="ms-2 font-bold"
                  style={{ color: COLORS?.accent }}
                >
                  — {categories.find((c) => c.value === selectedCategory)?.labelUr || selectedCategory}
                </span>
              )}
            </p>
            {hasFilters && (
              <button
                onClick={clearFilters}
                className="text-xs flex items-center gap-1 font-bold cursor-pointer hover:underline"
                style={{ color: COLORS?.primary }}
              >
                <X className="w-3.5 h-3.5" />
                {isRTL ? 'فلٹر ہٹائیں' : 'Clear filters'}
              </button>
            )}
          </div>
        )}

        {/* Articles Grid */}
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <div
                key={i}
                className="rounded-2xl overflow-hidden animate-pulse"
                style={{ backgroundColor: COLORS?.white, border: `1px solid ${COLORS?.border}` }}
              >
                <div className="h-48 w-full" style={{ backgroundColor: COLORS?.secondary }} />
                <div className="p-5 space-y-3">
                  <div className="h-3 rounded w-1/3" style={{ backgroundColor: COLORS?.border }} />
                  <div className="h-5 rounded w-3/4" style={{ backgroundColor: COLORS?.border }} />
                  <div className="h-3 rounded w-full" style={{ backgroundColor: `${COLORS?.border}80` }} />
                  <div className="h-3 rounded w-4/5" style={{ backgroundColor: `${COLORS?.border}60` }} />
                </div>
              </div>
            ))}
          </div>
        ) : articles && articles.length > 0 ? (
          <>
            {/* Article Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-10">
              {articles.map((article) => (
                <ArticleCard key={article?._id} article={article} />
              ))}
            </div>

            {/* Pagination */}
            {pages > 1 && (
              <div className="flex justify-center items-center gap-2 pt-4">
                <button
                  onClick={() => handlePageChange(Math.max(1, page - 1))}
                  disabled={page === 1}
                  className="flex items-center gap-1 px-4 py-2 rounded-lg text-xs font-bold border disabled:opacity-40 transition-colors cursor-pointer"
                  style={{
                    borderColor: COLORS?.border,
                    backgroundColor: COLORS?.white,
                    color: COLORS?.textSecondary,
                  }}
                >
                  {isRTL ? <ChevronRight className="w-3.5 h-3.5" /> : <ChevronLeft className="w-3.5 h-3.5" />}
                  {isRTL ? 'پچھلا' : 'Prev'}
                </button>

                <div className="flex items-center gap-1">
                  {[...Array(pages).keys()].map((pNum) => (
                    <button
                      key={pNum + 1}
                      onClick={() => handlePageChange(pNum + 1)}
                      className="w-9 h-9 rounded-lg text-xs font-bold border transition-colors cursor-pointer"
                      style={{
                        backgroundColor: page === pNum + 1 ? COLORS?.primary : COLORS?.white,
                        borderColor: page === pNum + 1 ? COLORS?.primary : COLORS?.border,
                        color: page === pNum + 1 ? '#fff' : COLORS?.textSecondary,
                      }}
                    >
                      {pNum + 1}
                    </button>
                  ))}
                </div>

                <button
                  onClick={() => handlePageChange(Math.min(pages, page + 1))}
                  disabled={page === pages}
                  className="flex items-center gap-1 px-4 py-2 rounded-lg text-xs font-bold border disabled:opacity-40 transition-colors cursor-pointer"
                  style={{
                    borderColor: COLORS?.border,
                    backgroundColor: COLORS?.white,
                    color: COLORS?.textSecondary,
                  }}
                >
                  {isRTL ? 'اگلا' : 'Next'}
                  {isRTL ? <ChevronLeft className="w-3.5 h-3.5" /> : <ChevronRight className="w-3.5 h-3.5" />}
                </button>
              </div>
            )}
          </>
        ) : (
          <div
            className="text-center py-24 rounded-2xl border"
            style={{ backgroundColor: COLORS?.white, borderColor: COLORS?.border }}
          >
            <BookOpen
              className="w-14 h-14 mx-auto mb-4 opacity-40"
              style={{ color: COLORS?.primary }}
            />
            <h3
              className="text-xl font-bold font-serif mb-2"
              style={{ color: COLORS?.textPrimary }}
            >
              {isRTL ? 'کوئی مضمون نہیں ملا' : 'No articles found'}
            </h3>
            <p className="text-sm mb-6" style={{ color: COLORS?.textSecondary }}>
              {isRTL ? 'دیگر زمرے یا کلیدی الفاظ آزمائیں' : 'Try different categories or keywords'}
            </p>
            {hasFilters && (
              <button
                onClick={clearFilters}
                className="px-6 py-2.5 rounded-xl text-sm font-bold text-white cursor-pointer transition-opacity hover:opacity-90"
                style={{ backgroundColor: COLORS?.primary }}
              >
                {isRTL ? 'تمام مقالات دیکھیں' : 'View All Articles'}
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
