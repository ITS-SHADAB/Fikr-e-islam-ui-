import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { BookOpen, FileText } from 'lucide-react';
import { getArticles } from '@/services';
import { useSettings } from '@/hooks/useSettings';
import { ArticleCard, SectionSidebar } from '@/components';
import { COLORS } from '@/utils/themeColors';
import { ARTICLE_CATEGORIES } from '@/utils/categories';

export default function ArticlesList() {
  const { settings } = useSettings();
  const language = settings?.language === 'ur' || settings?.language === 'Urdu' ? 'ur' : 'en';
  const isRTL = language === 'ur';
  const [searchParams] = useSearchParams();
  const queryCategory = searchParams.get('category');

  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(1);
  const [pages, setPages] = useState(1);
  const [total, setTotal] = useState(0);

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');

  useEffect(() => {
    if (queryCategory !== null) {
      setSelectedCategory(queryCategory);
    } else {
      setSelectedCategory('');
    }
  }, [queryCategory]);

  const categories = ARTICLE_CATEGORIES;

  const loadArticles = async (pageNum = page, category = selectedCategory, search = searchTerm) => {
    try {
      setLoading(true);
      setError(null);
      const data = await getArticles({ category, search, page: pageNum, limit: 6 });
      setArticles(data.articles || []);
      setPages(data.pages || 1);
      setPage(data.page || 1);
      setTotal(data.total || 0);
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'Failed to load articles');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadArticles(page, selectedCategory, searchTerm);
  }, [selectedCategory, page]);

  const handleSearchSubmit = (e) => {
    e?.preventDefault();
    loadArticles(1, selectedCategory, searchTerm);
  };

  const handleCategoryChange = (category) => {
    setSelectedCategory(category);
    loadArticles(1, category, searchTerm);
  };

  const handlePageChange = (pageNum) => {
    loadArticles(pageNum, selectedCategory, searchTerm);
    window.scrollTo(0, 0);
  };

  return (
    <div
      dir={isRTL ? 'rtl' : 'ltr'}
      className="bg-background py-6 md:py-8 min-h-screen"
      style={{ backgroundColor: COLORS.background }}
    >
      <div className="mx-auto px-4 sm:px-6 lg:px-8">

        {/* Header Title */}
        <div className="mb-6 md:mb-8 text-center">
          <span
            className="text-xs font-bold uppercase tracking-widest block mb-1 font-serif"
            style={{ color: COLORS.accent }}
          >
            {isRTL ? 'مستند رہنمائی' : 'AUTHENTIC GUIDANCE'}
          </span>
          <div className="flex items-center justify-center gap-4 mb-2">
            <span style={{ color: COLORS.accent }} className="text-2xl select-none">❖</span>
            <h1
              className="text-3xl sm:text-4xl font-extrabold font-serif"
              style={{ color: COLORS.primary }}
            >
              {isRTL ? 'اسلامی مقالات' : 'Islamic Articles'}
            </h1>
            <span style={{ color: COLORS.accent }} className="text-2xl select-none">❖</span>
          </div>
          <p className="text-xs sm:text-sm font-light max-w-xl mx-auto" style={{ color: COLORS.textSecondary }}>
            {isRTL
              ? 'مختلف موضوعات پر مستند اور تحقیقی اسلامی مقالات کا مطالعہ کریں۔'
              : 'Read authentic and research-based Islamic articles on various topics.'}
          </p>
        </div>

        {/* ── Two-column layout (Sidebar on Right, Content on Left) ── */}
        <div className="flex flex-col lg:flex-row gap-6 items-start">

          {/* ── UNIFIED SIDEBAR (Mobile Sticky on Top + Desktop Sticky on Side) ── */}
          <SectionSidebar
            searchTerm={searchTerm}
            onSearchChange={setSearchTerm}
            onSearchSubmit={handleSearchSubmit}
            onClearSearch={() => {
              setSearchTerm('');
              loadArticles(1, selectedCategory, '');
            }}
            searchPlaceholder={isRTL ? 'مقالات تلاش کریں...' : 'Search articles...'}
            searchLabel={isRTL ? 'مقالات تلاش کریں' : 'Search Articles'}
            allLabel={isRTL ? 'تمام مقالات' : 'All Articles'}
            categoriesLabel={isRTL ? 'مضامین و ابواب' : 'Categories'}
            categories={categories}
            selectedCategory={selectedCategory}
            onCategoryChange={handleCategoryChange}
            isRTL={isRTL}
            icon={FileText}
            totalCount={total}
          />

          {/* ── MAIN: Article cards ── */}
          <div className="flex-1 min-w-0 w-full">
            {loading ? (
              <div className="flex items-center justify-center py-20">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2" style={{ borderColor: COLORS.primary }} />
              </div>
            ) : articles && articles.length > 0 ? (
              <>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
                  {articles.map((article) => (
                    <ArticleCard key={article._id} article={article} />
                  ))}
                </div>

                {/* Pagination Controls */}
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
                  {isRTL ? 'کوئی مضمون نہیں ملا' : 'No articles found'}
                </h3>
                <p className="text-xs" style={{ color: COLORS.textSecondary }}>
                  {isRTL ? 'براہ کرم تلاش کے الفاظ یا زمرے کے فلٹرز تبدیل کریں۔' : 'Please modify search terms or category filters.'}
                </p>
              </div>
            )}
          </div>
        </div>

      </div>
    </div>
  );
}
