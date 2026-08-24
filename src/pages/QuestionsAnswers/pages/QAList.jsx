import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { MessageSquare, ChevronDown, ChevronUp } from 'lucide-react';
import { getPublicQuestions } from '@/services';
import { useSettings } from '@/hooks/useSettings';
import { SectionSidebar } from '@/components';
import { COLORS } from '@/utils/themeColors';
import { QA_CATEGORIES, QA_TRANSLATIONS } from '@/utils/categories';

export default function QAList() {
  const { settings } = useSettings();
  const language = settings?.language === 'ur' || settings?.language === 'Urdu' ? 'ur' : 'en';
  const isRTL = language === 'ur';
  const [searchParams] = useSearchParams();
  const queryCategory = searchParams.get('category');

  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(1);
  const [pages, setPages] = useState(1);
  const [total, setTotal] = useState(0);

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [expandedId, setExpandedId] = useState(null);

  useEffect(() => {
    if (queryCategory !== null) {
      setSelectedCategory(queryCategory);
    } else {
      setSelectedCategory('');
    }
  }, [queryCategory]);

  const categories = QA_CATEGORIES;

  const loadQuestions = async (pageNum = page, category = selectedCategory, search = searchTerm) => {
    try {
      setLoading(true);
      setError(null);
      const data = await getPublicQuestions({ category, search, page: pageNum, limit: 6 });
      setQuestions(data.questions || []);
      setPages(data.totalPages || 1);
      setPage(data.currentPage || 1);
      setTotal(data.totalQuestions || 0);
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'Failed to load questions');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadQuestions(page, selectedCategory, searchTerm);
  }, [selectedCategory, page]);

  const handleSearchSubmit = (e) => {
    e?.preventDefault();
    loadQuestions(1, selectedCategory, searchTerm);
  };

  const handleCategoryChange = (category) => {
    setSelectedCategory(category);
    loadQuestions(1, category, searchTerm);
  };

  const handlePageChange = (pageNum) => {
    loadQuestions(pageNum, selectedCategory, searchTerm);
    window.scrollTo(0, 0);
  };

  const toggleExpand = (id) => {
    setExpandedId(expandedId === id ? null : id);
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
            {isRTL ? 'باہمی گفتگو' : 'MUTUAL DISCUSSION'}
          </span>
          <div className="flex items-center justify-center gap-4 mb-2">
            <span style={{ color: COLORS.accent }} className="text-2xl select-none">❖</span>
            <h1
              className="text-3xl sm:text-4xl font-extrabold font-serif"
              style={{ color: COLORS.primary }}
            >
              {isRTL ? 'سوالات اور جوابات' : 'Questions & Answers'}
            </h1>
            <span style={{ color: COLORS.accent }} className="text-2xl select-none">❖</span>
          </div>
          <p className="text-xs sm:text-sm font-light max-w-xl mx-auto" style={{ color: COLORS.textSecondary }}>
            {isRTL
              ? 'عوام کی طرف سے پوچھے گئے اور مفتی صاحب کے جواب دیے گئے دینی و فقہی مسائل کا مطالعہ کریں۔'
              : 'Read religious and jurisprudential inquiries asked by the public and answered by the Mufti.'}
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
              loadQuestions(1, selectedCategory, '');
            }}
            searchPlaceholder={isRTL ? 'سوال و جواب تلاش کریں...' : 'Search Q&A...'}
            searchLabel={isRTL ? 'سوالات تلاش کریں' : 'Search Questions'}
            allLabel={isRTL ? 'تمام سوالات' : 'All Questions'}
            categoriesLabel={isRTL ? 'ابواب و شعبہ جات' : 'Categories'}
            categories={categories}
            selectedCategory={selectedCategory}
            onCategoryChange={handleCategoryChange}
            isRTL={isRTL}
            icon={MessageSquare}
            totalCount={total}
          />

          {/* ── MAIN: Questions list Accordion ── */}
          <div className="flex-1 min-w-0 w-full">
            {loading ? (
              <div className="flex items-center justify-center py-20">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2" style={{ borderColor: COLORS.primary }} />
              </div>
            ) : questions && questions.length > 0 ? (
              <>
                <div className="space-y-4 mb-10 text-start">
                  {questions.map((q) => {
                    const isExpanded = expandedId === q._id;
                    return (
                      <div
                        key={q._id}
                        className="rounded-2xl border shadow-2xs overflow-hidden transition-all duration-300"
                        style={{
                          backgroundColor: COLORS.white,
                          borderColor: COLORS.border,
                        }}
                      >
                        {/* Collapsible Header */}
                        <button
                          type="button"
                          onClick={() => toggleExpand(q._id)}
                          className="w-full p-5 text-start flex items-start justify-between gap-4 hover:bg-slate-50 transition-colors cursor-pointer"
                        >
                          <div className="space-y-2">
                            <div className="flex flex-wrap items-center gap-3">
                              <span
                                className="text-[10px] font-bold px-2 py-0.5 rounded-full"
                                style={{
                                  backgroundColor: COLORS.secondary,
                                  color: COLORS.primary,
                                }}
                              >
                                {isRTL ? (QA_TRANSLATIONS[q.category] || q.category) : q.category}
                              </span>
                              <span className="text-[11px]" style={{ color: COLORS.textSecondary }}>
                                {new Date(q.answeredAt || q.updatedAt).toLocaleDateString(isRTL ? 'ur-PK' : 'en-US')}
                              </span>
                            </div>
                            <h3 className="text-sm sm:text-base font-bold leading-snug font-serif" style={{ color: COLORS.primary }}>
                              {q.questionTitle}
                            </h3>
                          </div>

                          <div className="mt-1 shrink-0" style={{ color: COLORS.accent }}>
                            {isExpanded ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
                          </div>
                        </button>

                        {/* Collapsible Content */}
                        {isExpanded && (
                          <div className="px-5 pb-5 pt-1 border-t" style={{ borderColor: `${COLORS.border}70`, backgroundColor: `${COLORS.background}50` }}>

                            {/* Detailed Question */}
                            <div
                              className="p-4 rounded-xl mb-4 text-xs"
                              style={{
                                backgroundColor: COLORS.white,
                                borderRight: isRTL ? `3px solid ${COLORS.accent}` : undefined,
                                borderLeft: !isRTL ? `3px solid ${COLORS.accent}` : undefined,
                              }}
                            >
                              <span className="block font-bold mb-1.5" style={{ color: COLORS.primary }}>
                                {isRTL ? 'سوال کی تفصیل:' : 'Question Detail:'}
                              </span>
                              <p className="italic leading-relaxed" style={{ color: COLORS.textPrimary }}>
                                "{q.detailedQuestion}"
                              </p>
                            </div>

                            {/* Detailed Answer */}
                            <div className="text-sm leading-relaxed p-2">
                              <span className="block text-xs font-bold mb-2" style={{ color: COLORS.textSecondary }}>
                                {isRTL ? 'عالم کا جواب:' : 'Scholar Answer:'}
                              </span>
                              <div
                                className="prose prose-sm leading-relaxed font-light whitespace-pre-line"
                                style={{ color: COLORS.textPrimary }}
                                dangerouslySetInnerHTML={{ __html: q.answerContent }}
                              />
                            </div>
                          </div>
                        )}
                      </div>
                    );
                  })}
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
                <MessageSquare className="w-12 h-12 mx-auto mb-4" style={{ color: COLORS.accent }} />
                <h3 className="text-lg font-bold font-serif mb-1" style={{ color: COLORS.textPrimary }}>
                  {isRTL ? 'کوئی جواب شدہ سوال نہیں ملا' : 'No answered questions found'}
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
