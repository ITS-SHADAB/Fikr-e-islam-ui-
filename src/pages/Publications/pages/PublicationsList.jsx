import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { BookOpen, Book } from 'lucide-react';
import { getPublications } from '@/services';
import { useSettings } from '@/hooks/useSettings';
import { PublicationCard, SectionSidebar } from '@/components';
import { COLORS } from '@/utils/themeColors';
import { PUBLICATION_CATEGORIES } from '@/utils/categories';

export default function PublicationsList() {
  const { settings } = useSettings();
  const language = settings?.language === 'ur' || settings?.language === 'Urdu' ? 'ur' : 'en';
  const [searchParams] = useSearchParams();
  const queryCategory = searchParams.get('category');

  const [publications, setPublications] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(1);
  const [pages, setPages] = useState(1);
  const [total, setTotal] = useState(0);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');

  const isRTL = language === 'ur';

  useEffect(() => {
    if (queryCategory !== null) {
      setSelectedCategory(queryCategory);
    } else {
      setSelectedCategory('');
    }
  }, [queryCategory]);

  const loadPublications = async (pageNum = page, category = selectedCategory, search = searchTerm) => {
    try {
      setLoading(true);
      setError(null);
      const data = await getPublications({ category, search, page: pageNum, limit: 10 });
      setPublications(data.books || []);
      setPages(data.pages || 1);
      setPage(data.page || 1);
      setTotal(data.total || 0);
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'Failed to load');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadPublications(page, selectedCategory, searchTerm);
  }, [selectedCategory, page]);

  const handleSearchSubmit = (e) => {
    e?.preventDefault();
    loadPublications(1, selectedCategory, searchTerm);
  };

  const handleCategoryChange = (category) => {
    setSelectedCategory(category);
    loadPublications(1, category, searchTerm);
  };

  const handlePageChange = (pageNum) => {
    loadPublications(pageNum, selectedCategory, searchTerm);
    window.scrollTo(0, 0);
  };

  const categories = PUBLICATION_CATEGORIES;

  return (
    <div
      dir={isRTL ? 'rtl' : 'ltr'}
      className="min-h-screen py-6 md:py-8"
      style={{ backgroundColor: COLORS.background }}
    >
      <div className="mx-auto px-4 sm:px-6 lg:px-8">

        {/* ── Page heading ── */}
        <div className="text-center mb-6 md:mb-8">
          <span
            className="text-xs font-bold uppercase tracking-widest block mb-1 font-serif"
            style={{ color: COLORS.accent }}
          >
            {isRTL ? 'علمی تصانیف' : 'SCIENTIFIC WORKS'}
          </span>

          <div className="flex items-center justify-center gap-4 mb-2">
            {/* decorative diamond */}
            <span style={{ color: COLORS.accent }} className="text-2xl select-none">❖</span>
            <h1
              className="text-2xl sm:text-3xl md:text-4xl font-extrabold font-serif"
              style={{ color: COLORS.primary }}
            >
              {isRTL ? 'کتب و مطبوعات' : 'Books & Publications'}
            </h1>
            <span style={{ color: COLORS.accent }} className="text-2xl select-none">❖</span>
          </div>

          <p className="text-[11px] sm:text-sm font-light max-w-xl mx-auto" style={{ color: COLORS.textSecondary }}>
            {isRTL
              ? 'گوگل ڈرائیو پر موجود کتابیں، مقالات اور تعلیمی نوٹس حاصل کریں اور ان کا مطالعہ کریں۔'
              : 'Access and study books, articles, and educational notes on Google Drive.'}
          </p>
        </div>

        {/* ── Two-column layout (Sidebar on Right, Content on Left) ── */}
        <div className="flex flex-col lg:flex-row gap-6 items-start">

          {/* ── REUSABLE UNIFIED SIDEBAR (Mobile Sticky on Top + Desktop Sticky on Side) ── */}
          <SectionSidebar
            searchTerm={searchTerm}
            onSearchChange={setSearchTerm}
            onSearchSubmit={handleSearchSubmit}
            onClearSearch={() => {
              setSearchTerm('');
              loadPublications(1, selectedCategory, '');
            }}
            searchPlaceholder={isRTL ? 'کتب و مطبوعات تلاش کریں...' : 'Search books...'}
            searchLabel={isRTL ? 'کتب تلاش کریں' : 'Search Books'}
            allLabel={isRTL ? 'تمام کتب' : 'All Books'}
            categoriesLabel={isRTL ? 'موضوعات' : 'Categories'}
            categories={categories}
            selectedCategory={selectedCategory}
            onCategoryChange={handleCategoryChange}
            isRTL={isRTL}
            icon={Book}
            totalCount={total}
          />

          {/* ── MAIN: publication cards ── */}
          <div className="flex-1 min-w-0 w-full">
            {loading ? (
              <div className="flex items-center justify-center py-20">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2" style={{ borderColor: COLORS.primary }} />
              </div>
            ) : publications && publications.length > 0 ? (
              <>
                <div className="flex flex-col gap-4 mb-10">
                  {publications.map((pub) => (
                    <PublicationCard key={pub._id} publication={pub} />
                  ))}
                </div>

                {/* Pagination */}
                {pages > 1 && (
                  <div className="flex justify-center items-center gap-1.5 pt-4">
                    <button
                      onClick={() => handlePageChange(Math.max(1, page - 1))}
                      disabled={page === 1}
                      className="px-3.5 py-1.5 rounded text-xs font-bold border disabled:opacity-40 transition-colors"
                      style={{ borderColor: COLORS.border, backgroundColor: COLORS.white, color: COLORS.textSecondary }}
                    >
                      {isRTL ? 'پچھلا' : 'Previous'}
                    </button>
                    {[...Array(pages).keys()].map((pNum) => (
                      <button
                        key={pNum + 1}
                        onClick={() => handlePageChange(pNum + 1)}
                        className="w-8 h-8 rounded text-xs font-bold border transition-colors"
                        style={{
                          backgroundColor: page === pNum + 1 ? COLORS.primary : COLORS.white,
                          borderColor: page === pNum + 1 ? COLORS.primary : COLORS.border,
                          color: page === pNum + 1 ? '#fff' : COLORS.textSecondary,
                        }}
                      >
                        {pNum + 1}
                      </button>
                    ))}
                    <button
                      onClick={() => handlePageChange(Math.min(pages, page + 1))}
                      disabled={page === pages}
                      className="px-3.5 py-1.5 rounded text-xs font-bold border disabled:opacity-40 transition-colors"
                      style={{ borderColor: COLORS.border, backgroundColor: COLORS.white, color: COLORS.textSecondary }}
                    >
                      {isRTL ? 'اگلا' : 'Next'}
                    </button>
                  </div>
                )}
              </>
            ) : (
              <div className="text-center py-16 rounded-lg border" style={{ backgroundColor: COLORS.white, borderColor: COLORS.border }}>
                <BookOpen className="w-12 h-12 mx-auto mb-4" style={{ color: COLORS.accent }} />
                <h3 className="text-lg font-bold font-serif mb-1" style={{ color: COLORS.textPrimary }}>
                  {isRTL ? 'کوئی مطبوعہ دستیاب نہیں ہے' : 'No publications available'}
                </h3>
                <p className="text-xs" style={{ color: COLORS.textSecondary }}>
                  {isRTL ? 'براہ کرم تلاش کے الفاظ یا فلٹر تبدیل کریں۔' : 'Try changing the search or filters.'}
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
