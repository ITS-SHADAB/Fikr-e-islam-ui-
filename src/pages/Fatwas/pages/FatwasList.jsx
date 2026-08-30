import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Search, X, ShieldAlert, ChevronLeft, ChevronRight, Scale, BookOpen } from 'lucide-react';
import { getFatwas } from '@/services';
import { useSettings } from '@/hooks/useSettings';
import { FatwaCard } from '@/components';
import { COLORS } from '@/utils/themeColors';
import { FATWA_CATEGORIES } from '@/utils/categories';

export default function FatwasList() {
  const { settings } = useSettings();
  const language =
    settings?.language === 'ur' || settings?.language === 'Urdu' ? 'ur' : 'en';
  const isRTL = language === 'ur';
  const [searchParams] = useSearchParams();
  const queryCategory = searchParams.get('category');

  const [fatwas, setFatwas] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(1);
  const [pages, setPages] = useState(1);
  const [total, setTotal] = useState(0);
  const [searchTerm, setSearchTerm] = useState('');
  const [searchInput, setSearchInput] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');

  useEffect(() => {
    setSelectedCategory(queryCategory !== null ? queryCategory : '');
  }, [queryCategory]);

  const loadFatwas = async (
    pageNum = page,
    category = selectedCategory,
    search = searchTerm
  ) => {
    try {
      setLoading(true);
      setError(null);
      const data = await getFatwas({
        category,
        search,
        page: pageNum,
        limit: 9,
      });
      setFatwas(data?.fatwas || []);
      setPages(data?.pages || 1);
      setPage(data?.page || 1);
      setTotal(data?.total || 0);
    } catch (err) {
      setError(
        err?.response?.data?.message ||
          err?.message ||
          (isRTL ? 'فتاویٰ لوڈ کرنے میں ناکامی' : 'Failed to load fatwas')
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadFatwas(page, selectedCategory, searchTerm);
  }, [selectedCategory, page]);

  const handleSearchSubmit = (e) => {
    e?.preventDefault();
    setSearchTerm(searchInput);
    setPage(1);
    loadFatwas(1, selectedCategory, searchInput);
  };

  const handleCategoryChange = (category) => {
    setSelectedCategory(category);
    setPage(1);
    loadFatwas(1, category, searchTerm);
  };

  const handlePageChange = (pageNum) => {
    setPage(pageNum);
    loadFatwas(pageNum, selectedCategory, searchTerm);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const clearFilters = () => {
    setSelectedCategory('');
    setSearchTerm('');
    setSearchInput('');
    setPage(1);
    loadFatwas(1, '', '');
  };

  const categories = FATWA_CATEGORIES;
  const hasFilters = selectedCategory || searchTerm;

  return (
    <div
      dir={isRTL ? 'rtl' : 'ltr'}
      className="min-h-screen"
      style={{ backgroundColor: COLORS?.background }}
    >
      {/* ══════════════════════════════════════════════════
          HERO HEADER — Darul Ifta Banner & Search
      ══════════════════════════════════════════════════ */}
      <div
        className="w-full py-12 sm:py-16 px-4"
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
            className="text-xl sm:text-2xl font-bold font-serif mb-3 leading-snug"
            style={{ color: '#ffffff' }}
          >
            {isRTL ? 'فتاویٰ اور شرعی احکام' : 'Fatwas & Shariah Rulings'}
          </h1>
          <p
            className="text-sm sm:text-base max-w-2xl mx-auto mb-8"
            style={{ color: `${COLORS?.accent}cc` }}
          >
            {isRTL
              ? 'مستند اور محقق مفتیانِ کرام کے قلم سے روزمرہ اور جدید مسائل کے شرعی احکام'
              : 'Authentic Shariah rulings on contemporary and daily life questions by qualified Muftis'}
          </p>

          {/* Search Bar */}
          <form
            onSubmit={handleSearchSubmit}
            className="flex items-center max-w-xl mx-auto gap-2"
          >
            <div className="relative flex-1">
              <Search
                className="absolute top-1/2 -translate-y-1/2 w-4 h-4 pointer-events-none"
                style={{
                  [isRTL ? 'right' : 'left']: '14px',
                  color: COLORS?.textSecondary,
                }}
              />
              <input
                type="text"
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                placeholder={
                  isRTL
                    ? 'مسئلہ، فتویٰ یا کلیدی لفظ تلاش کریں...'
                    : 'Search rulings, keywords or questions...'
                }
                className="w-full py-3.5 rounded-xl text-sm outline-none border-0 font-medium shadow-md"
                style={{
                  backgroundColor: 'rgba(255,255,255,0.95)',
                  color: COLORS?.textPrimary,
                  paddingRight: isRTL ? '42px' : '16px',
                  paddingLeft: isRTL ? '16px' : '42px',
                }}
              />
            </div>
            <button
              type="submit"
              className="px-6 py-3.5 rounded-xl text-sm font-bold text-white shrink-0 transition-opacity hover:opacity-90 cursor-pointer shadow-md"
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
        className="sticky top-0 z-20 border-b shadow-sm"
        style={{ backgroundColor: COLORS?.white, borderColor: COLORS?.border }}
      >
        <div className="max-w-6xl mx-auto px-4">
          <div className="flex items-center gap-1.5 overflow-x-auto py-2.5 scrollbar-none">
            {/* All button */}
            <button
              onClick={() => handleCategoryChange('')}
              className="flex-shrink-0 text-xs font-bold px-4 py-2 rounded-full transition-all cursor-pointer"
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

            {categories?.map((cat) => {
              const isSelected = selectedCategory === cat?.value;
              return (
                <button
                  key={cat?.value}
                  onClick={() => handleCategoryChange(cat?.value)}
                  className="flex-shrink-0 text-xs font-bold px-4 py-2 rounded-full transition-all cursor-pointer"
                  style={{
                    backgroundColor: isSelected ? COLORS?.primary : 'transparent',
                    color: isSelected ? '#fff' : COLORS?.textSecondary,
                    border: `1px solid ${
                      isSelected ? COLORS?.primary : COLORS?.border
                    }`,
                  }}
                >
                  {isRTL ? cat?.labelUr : cat?.labelEn || cat?.labelUr}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* ══════════════════════════════════════════════════
          MAIN CONTENT AREA
      ══════════════════════════════════════════════════ */}
      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Active Filters Info Bar */}
        {(hasFilters || total > 0) && (
          <div className="flex items-center justify-between mb-6 flex-wrap gap-2">
            <p
              className="text-xs font-medium"
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
                  className="ms-2 italic"
                  style={{ color: COLORS?.textSecondary }}
                >
                  ("{searchTerm}")
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
                {isRTL ? 'فلٹر ختم کریں' : 'Clear filters'}
              </button>
            )}
          </div>
        )}

        {/* Fatwas Grid */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <div
                key={i}
                className="rounded-2xl overflow-hidden animate-pulse border p-5 space-y-4"
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
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-10">
              {fatwas.map((fatwa) => (
                <FatwaCard key={fatwa?._id} fatwa={fatwa} />
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
                  {isRTL ? (
                    <ChevronRight className="w-3.5 h-3.5" />
                  ) : (
                    <ChevronLeft className="w-3.5 h-3.5" />
                  )}
                  {isRTL ? 'پچھلا' : 'Prev'}
                </button>

                <div className="flex items-center gap-1">
                  {[...Array(pages).keys()].map((pNum) => (
                    <button
                      key={pNum + 1}
                      onClick={() => handlePageChange(pNum + 1)}
                      className="w-9 h-9 rounded-lg text-xs font-bold border transition-colors cursor-pointer"
                      style={{
                        backgroundColor:
                          page === pNum + 1 ? COLORS?.primary : COLORS?.white,
                        borderColor:
                          page === pNum + 1 ? COLORS?.primary : COLORS?.border,
                        color:
                          page === pNum + 1 ? '#fff' : COLORS?.textSecondary,
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
