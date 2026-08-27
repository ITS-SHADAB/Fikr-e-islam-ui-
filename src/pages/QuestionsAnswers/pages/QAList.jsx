import React, { useEffect, useState } from 'react';
import { useSearchParams, Link, useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import {
  MessageSquare,
  Calendar,
  Eye,
  Copy,
  Check,
  HelpCircle,
  ChevronDown,
  Building2,
  BookOpen,
  Settings,
} from 'lucide-react';
import { getPublicQuestions } from '@/services';
import { SectionSidebar } from '@/components';
import { COLORS } from '@/utils/themeColors';
import { QA_CATEGORIES, QA_TRANSLATIONS } from '@/utils/categories';
import toast from 'react-hot-toast';

export default function QAList() {
  const navigate = useNavigate();
  const { loggedInUser, userRole } = useSelector((state) => state.auth);
  const isAdmin = userRole === 'admin' || loggedInUser?.role === 'admin';

  const [searchParams, setSearchParams] = useSearchParams();
  const queryCategory = searchParams.get('category');

  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [pages, setPages] = useState(1);
  const [total, setTotal] = useState(0);

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState(queryCategory || '');
  const [copiedId, setCopiedId] = useState(null);

  useEffect(() => {
    if (queryCategory !== null) {
      setSelectedCategory(queryCategory);
    } else {
      setSelectedCategory('');
    }
  }, [queryCategory]);

  const categories = QA_CATEGORIES;

  const loadQuestions = async (pageNum = 1, category = selectedCategory, search = searchTerm) => {
    try {
      setLoading(true);
      const data = await getPublicQuestions({
        category: category || undefined,
        search: search || undefined,
        page: pageNum,
        limit: 8,
      });
      setQuestions(data.questions || []);
      setPages(data.totalPages || 1);
      setPage(data.currentPage || pageNum);
      setTotal(data.totalQuestions || 0);
    } catch (err) {
      // Handled silently
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadQuestions(page, selectedCategory, searchTerm);
  }, [selectedCategory, page]);

  const handleSearchSubmit = (e) => {
    e?.preventDefault();
    setPage(1);
    loadQuestions(1, selectedCategory, searchTerm);
  };

  const handleCategoryChange = (category) => {
    setSelectedCategory(category);
    setPage(1);
    if (category) {
      setSearchParams({ category });
    } else {
      setSearchParams({});
    }
    loadQuestions(1, category, searchTerm);
  };

  const handlePageChange = (pageNum) => {
    setPage(pageNum);
    loadQuestions(pageNum, selectedCategory, searchTerm);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleCopyQuestionLink = (e, slug, id) => {
    e.preventDefault();
    e.stopPropagation();
    const url = `${window.location.origin}/qa/${slug}`;
    if (navigator.clipboard) {
      navigator.clipboard.writeText(url);
      setCopiedId(id);
      toast.success('سوال کا لنک کاپی ہو گیا!');
      setTimeout(() => setCopiedId(null), 2500);
    }
  };

  return (
    <div
      dir="rtl"
      className="py-6 md:py-8 min-h-screen"
      style={{ backgroundColor: COLORS.background }}
    >
      <div className="mx-auto px-4 sm:px-6 lg:px-8">
        {/* Page Header */}
        <div className="mb-6 md:mb-8 text-center">
          <span
            className="text-xs font-bold uppercase tracking-widest block mb-1 font-['Noto_Nastaliq_Urdu']"
            style={{ color: COLORS.accent }}
          >
            باہمی گفتگو و رہنمائی
          </span>
          <div className="flex items-center justify-center gap-2 mb-2">
            <span style={{ color: COLORS.accent }} className="text-base select-none">❖</span>
            <h1 className="text-lg sm:text-xl font-extrabold font-['Noto_Nastaliq_Urdu']" style={{ color: COLORS.primary }}>
              سوالات اور جوابات
            </h1>
            <span style={{ color: COLORS.accent }} className="text-base select-none">❖</span>
          </div>
          <p className="text-xs sm:text-sm font-light max-w-xl mx-auto" style={{ color: COLORS.textSecondary }}>
            عوام کی طرف سے پوچھے گئے اور مفتی صاحب کے جواب دیے گئے دینی و فقہی مسائل کا مطالعہ کریں۔
          </p>
          <div className="mt-4 flex justify-center">
            {isAdmin ? (
              <Link
                to="/admin/questions"
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full text-xs font-bold border transition-colors shadow-2xs cursor-pointer"
                style={{
                  backgroundColor: `${COLORS.primary}10`,
                  borderColor: `${COLORS.primary}25`,
                  color: COLORS.primary,
                }}
              >
                <Settings className="w-3.5 h-3.5" />
                <span>ایڈمن: سوالات کا انتظام کریں</span>
              </Link>
            ) : (
              <Link
                to="/ask"
                className="inline-flex items-center gap-2 px-5 py-2 rounded-full text-white text-xs font-bold uppercase tracking-wider shadow-xs hover:opacity-90 transition-opacity"
                style={{ backgroundColor: COLORS.primary }}
              >
                <HelpCircle className="w-3.5 h-3.5 text-[#E5D8CA]" />
                نیا سوال پوچھیں
              </Link>
            )}
          </div>
        </div>

        {/* Two-column layout */}
        <div className="flex flex-col lg:flex-row gap-6 items-start">
          {/* Sidebar */}
          <SectionSidebar
            searchTerm={searchTerm}
            onSearchChange={setSearchTerm}
            onSearchSubmit={handleSearchSubmit}
            onClearSearch={() => {
              setSearchTerm('');
              setPage(1);
              loadQuestions(1, selectedCategory, '');
            }}
            searchPlaceholder="سوال و جواب تلاش کریں..."
            searchLabel="سوالات تلاش کریں"
            allLabel="تمام سوالات"
            categoriesLabel="ابواب و شعبہ جات"
            categories={categories}
            selectedCategory={selectedCategory}
            onCategoryChange={handleCategoryChange}
            isRTL={true}
            icon={MessageSquare}
            totalCount={total}
          />

          {/* Main Content */}
          <div className="flex-1 min-w-0 w-full">
            {loading ? (
              <div className="flex items-center justify-center py-20">
                <div
                  className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2"
                  style={{ borderColor: COLORS.primary }}
                />
              </div>
            ) : questions && questions.length > 0 ? (
              <>
                <div className="space-y-4 mb-10">
                  {questions.map((q) => {
                    const categoryLabel = q.category
                      ? QA_TRANSLATIONS[q.category] || q.category
                      : 'سوال و جواب';

                    const rawAnswer = q.answerContent || '';
                    const cleanAnswer = rawAnswer.replace(/<[^>]*>?/gm, '').trim();
                    const isLong = cleanAnswer.length > 50;
                    const previewText = isLong
                      ? cleanAnswer.slice(0, 50) + '...'
                      : cleanAnswer;

                    return (
                      <article
                        key={q._id}
                        onClick={() => navigate(`/qa/${q.slug}`)}
                        className="relative rounded-2xl border bg-white cursor-pointer overflow-hidden transition-all duration-200 hover:shadow-md"
                        style={{
                          borderColor: COLORS.border,
                          borderRightWidth: '4px',
                          borderRightColor: COLORS.primary,
                        }}
                      >
                        {/* Absolute Copy Button — top left corner (RTL: visually top-right) */}
                        <button
                          type="button"
                          onClick={(e) => handleCopyQuestionLink(e, q.slug, q._id)}
                          className="absolute top-4 left-4 w-10 h-10 rounded-full flex items-center justify-center text-white shadow-sm transition-transform active:scale-95 cursor-pointer z-10"
                          style={{ backgroundColor: COLORS.primary }}
                          title="کاپی لنک"
                        >
                          {copiedId === q._id ? (
                            <Check className="w-4 h-4 text-emerald-300" />
                          ) : (
                            <Copy className="w-4 h-4" />
                          )}
                        </button>

                        {/* Card Body */}
                        <div className="pt-4 pb-3 pr-4 pl-16 sm:pl-20">
                          {/* Meta Row: views | date | category */}
                          <div className="flex flex-wrap items-center justify-end gap-2 sm:gap-3 mb-2 text-[11px] sm:text-xs text-slate-500">
                            {typeof q.viewCount === 'number' && (
                              <span className="inline-flex items-center gap-1 font-medium">
                                <Eye className="w-3.5 h-3.5 text-slate-400" />
                                {q.viewCount}
                              </span>
                            )}
                            <span className="text-slate-300 select-none">|</span>
                            <span className="inline-flex items-center gap-1 font-medium">
                              <Calendar className="w-3.5 h-3.5 text-slate-400" />
                              {new Date(q.answeredAt || q.createdAt).toLocaleDateString('ur-PK', {
                                month: 'short',
                                day: 'numeric',
                                year: 'numeric',
                              })}
                            </span>
                            <span className="text-slate-300 select-none">|</span>
                            <span
                              className="text-[11px] font-bold px-2.5 py-0.5 rounded-full text-slate-800"
                              style={{ backgroundColor: COLORS.secondary }}
                            >
                              {categoryLabel}
                            </span>
                          </div>

                          {/* Question: سوال badge + title — natural RTL row */}
                          <div className="flex items-baseline gap-2 mb-2 flex-wrap">
                            <span
                              className="inline-flex items-center gap-1 shrink-0 px-2 py-0.5 rounded-md text-[11px] font-bold"
                              style={{
                                backgroundColor: `${COLORS.primary}12`,
                                color: COLORS.primary,
                              }}
                            >
                              <HelpCircle className="w-3 h-3" />
                              سوال
                            </span>
                            <h2 className="text-base sm:text-lg md:text-xl font-bold leading-relaxed font-['Noto_Nastaliq_Urdu'] text-slate-900 flex-1">
                              {q.questionTitle}
                            </h2>
                          </div>

                          {/* Answer: جواب badge + snippet — natural RTL row */}
                          {cleanAnswer && (
                            <div className="flex items-baseline gap-2 flex-wrap">
                              <span
                                className="inline-flex items-center gap-1 shrink-0 px-2 py-0.5 rounded-md text-[11px] font-bold"
                                style={{
                                  backgroundColor: `${COLORS.accent}18`,
                                  color: COLORS.accent,
                                }}
                              >
                                <BookOpen className="w-3 h-3" />
                                جواب
                              </span>
                              <p className="text-sm sm:text-base md:text-lg text-slate-600 font-['Noto_Nastaliq_Urdu'] leading-relaxed flex-1">
                                {previewText}
                              </p>
                            </div>
                          )}
                        </div>

                        {/* Bottom Footer */}
                        <div
                          className="border-t px-4 py-2.5 flex items-center justify-between"
                          style={{ borderColor: `${COLORS.border}99` }}
                        >
                          {/* Left (RTL: right visually) — مزید پڑھیں */}
                          <button
                            type="button"
                            onClick={() => navigate(`/qa/${q.slug}`)}
                            className="inline-flex items-center gap-1.5 text-xs font-bold rounded-full px-3 py-1.5 border transition-colors cursor-pointer"
                            style={{
                              color: COLORS.textSecondary,
                              borderColor: COLORS.border,
                              backgroundColor: COLORS.secondary,
                            }}
                          >
                            <ChevronDown className="w-3.5 h-3.5" />
                            مزید پڑھیں
                          </button>

                          {/* Right (RTL: left visually) — دار الافتاء */}
                          <div className="flex items-center gap-1.5 text-[11px] text-slate-400 font-['Noto_Nastaliq_Urdu'] font-medium">
                            <Building2 className="w-3.5 h-3.5 text-slate-400" />
                            <span>دار الافتاء و تحقیق</span>
                          </div>
                        </div>
                      </article>
                    );
                  })}
                </div>

                {/* Pagination */}
                {pages > 1 && (
                  <div className="flex justify-center items-center gap-1.5 pt-4">
                    <button
                      onClick={() => handlePageChange(Math.max(1, page - 1))}
                      disabled={page === 1}
                      className="px-3.5 py-1.5 rounded text-xs font-bold border disabled:opacity-40 transition-colors cursor-pointer"
                      style={{
                        borderColor: COLORS.border,
                        backgroundColor: COLORS.white,
                        color: COLORS.textSecondary,
                      }}
                    >
                      پچھلا
                    </button>
                    {[...Array(pages).keys()].map((pNum) => (
                      <button
                        key={pNum + 1}
                        onClick={() => handlePageChange(pNum + 1)}
                        className="w-8 h-8 rounded text-xs font-bold border transition-colors cursor-pointer"
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
                      className="px-3.5 py-1.5 rounded text-xs font-bold border disabled:opacity-40 transition-colors cursor-pointer"
                      style={{
                        borderColor: COLORS.border,
                        backgroundColor: COLORS.white,
                        color: COLORS.textSecondary,
                      }}
                    >
                      اگلا
                    </button>
                  </div>
                )}
              </>
            ) : (
              <div
                className="text-center py-16 rounded-2xl border bg-white"
                style={{ borderColor: COLORS.border }}
              >
                <MessageSquare className="w-12 h-12 mx-auto mb-3" style={{ color: COLORS.accent }} />
                <h3 className="text-lg font-bold font-['Noto_Nastaliq_Urdu'] mb-1" style={{ color: COLORS.textPrimary }}>
                  کوئی جواب شدہ سوال نہیں ملا
                </h3>
                <p className="text-xs text-slate-500 max-w-sm mx-auto mb-5">
                  براہ کرم تلاش کے الفاظ یا زمرے کے فلٹرز تبدیل کریں۔
                </p>
                {!isAdmin && (
                  <Link
                    to="/ask"
                    className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg text-white font-bold text-xs uppercase tracking-wider transition-colors shadow-2xs"
                    style={{ backgroundColor: COLORS.primary }}
                  >
                    <HelpCircle className="w-4 h-4 text-[#E5D8CA]" />
                    نیا سوال پوچھیں
                  </Link>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
