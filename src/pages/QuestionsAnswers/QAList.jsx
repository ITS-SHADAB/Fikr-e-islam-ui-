import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Search, SlidersHorizontal, MessageSquare, ChevronDown, ChevronUp } from 'lucide-react';
import { getPublicQuestions } from '@/services';
import { useSettings } from '@/hooks/useSettings';
import { Input } from '@/components';

import { QA_CATEGORIES, QA_TRANSLATIONS } from '@/utils/categories';

export default function QAList() {
  const { settings } = useSettings();
  const language = settings?.language === 'ur' || settings?.language === 'Urdu' ? 'ur' : 'en';
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
    e.preventDefault();
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
    <div className={`bg-background dark:bg-slate-900 py-12 min-h-screen ${language === 'ur' ? 'text-right' : 'text-left'}`} dir={language === 'ur' ? 'rtl' : 'ltr'}>
      <div className=" mx-auto px-4 sm:px-6">

        {/* Header Title */}
        <div className="mb-10 text-center">
          <span className="text-xs font-bold text-accent dark:text-amber-500 uppercase tracking-widest font-serif block mb-1">
            {language === 'en' ? 'MUTUAL DISCUSSION' : 'باہمی گفتگو'}
          </span>
          <h1 className="text-3xl font-extrabold text-primary dark:text-accent font-serif tracking-wide">
            {language === 'en' ? 'Questions & Answers' : 'سوالات اور جوابات'}
          </h1>
          <p className="text-slate-550 dark:text-slate-400 text-sm font-light mt-2 max-w-md mx-auto">
            {language === 'en' ? 'Read religious and jurisprudential inquiries asked by the public and answered by the Mufti.' : 'عوام کی طرف سے پوچھے گئے اور مفتی صاحب کے جواب دیے گئے دینی و فقہی مسائل کا مطالعہ کریں۔'}
          </p>
        </div>

        {/* Search & Filter Toolbar */}
        <div className={`premium-card p-5 mb-8 flex flex-col sm:flex-row items-center justify-between gap-4 ${language === 'ur' ? 'sm:flex-row' : 'sm:flex-row-reverse'}`}>
          <form onSubmit={handleSearchSubmit} className="relative w-full sm:w-80">
            <Input
              type="text"
              placeholder={language === 'en' ? 'Search Q&A...' : 'سوال و جواب تلاش کریں...'}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              inputClassName={`w-full pr-9 pl-4 py-2 text-sm bg-slate-50 dark:bg-slate-900 border border-border dark:border-slate-700 rounded outline-none focus:border-accent dark:focus:border-accent focus:bg-white dark:focus:bg-slate-900 transition-all placeholder:text-slate-400 ${language === 'ur' ? 'text-right text-pr-9' : 'text-left pl-9'}`}
              border=""
            />
            <button type="submit" className={`absolute ${language === 'ur' ? 'right-3' : 'left-3'} top-2.5 text-slate-400 hover:text-primary dark:hover:text-accent`}>
              <Search className="w-4.5 h-4.5" />
            </button>
          </form>

          <div className="flex items-center gap-3 w-full sm:w-auto shrink-0 justify-start sm:justify-end">
            <SlidersHorizontal className="w-4.5 h-4.5 text-slate-400" />
            <select
              value={selectedCategory}
              onChange={(e) => handleCategoryChange(e.target.value)}
              className={`px-3.5 py-2 text-sm bg-slate-50 dark:bg-slate-900 border border-border dark:border-slate-700 rounded outline-none text-slate-700 dark:text-slate-300 focus:border-accent dark:focus:border-accent ${language === 'ur' ? 'text-right' : 'text-left'}`}
            >
              <option value="">{language === 'en' ? 'All Categories' : 'تمام زمرے'}</option>
              {categories.map((cat) => (
                <option key={cat.value} value={cat.value}>
                  {language === 'ur' ? cat.labelUr : cat.labelEn}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Content list Accordion */}
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
          </div>
        ) : questions && questions.length > 0 ? (
          <div className="space-y-4 mb-10 text-start">
            {questions.map((q) => {
              const isExpanded = expandedId === q._id;
              return (
                <div key={q._id} className="premium-card rounded shadow-xs overflow-hidden transition-all duration-300 text-start">

                  {/* Collapsible Header */}
                  <button
                    onClick={() => toggleExpand(q._id)}
                    className={`w-full p-5 text-start flex items-start justify-between gap-4 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors ${language === 'ur' ? 'flex-row-reverse text-right' : 'flex-row text-left'}`}
                  >
                    <div className="space-y-2">
                      <div className="flex flex-wrap items-center gap-3">
                        <span className="bg-primary/10 dark:bg-amber-950/30 text-primary dark:text-accent text-[10px] font-bold px-2 py-0.5 rounded">
                          {language === 'ur' ? (QA_TRANSLATIONS[q.category] || q.category) : q.category}
                        </span>
                        <span className="text-[10px] text-slate-500 dark:text-slate-400">
                          {new Date(q.answeredAt || q.updatedAt).toLocaleDateString(language === 'ur' ? 'ur-PK' : 'en-US')}
                        </span>
                      </div>
                      <h3 className={`text-sm sm:text-md font-bold text-slate-900 dark:text-white leading-snug font-serif ${language === 'ur' ? 'text-right' : 'text-left'}`}>
                        {q.questionTitle}
                      </h3>
                    </div>

                    <div className="text-slate-500 dark:text-slate-400 hover:text-primary dark:hover:text-accent mt-1 shrink-0">
                      {isExpanded ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
                    </div>
                  </button>

                  {/* Collapsible Content */}
                  {isExpanded && (
                    <div className="px-5 pb-5 pt-1 border-t border-slate-100 dark:border-slate-700 bg-slate-50/20 dark:bg-slate-900/10 text-start">

                      {/* Detailed Question */}
                      <div className={`bg-slate-50 dark:bg-slate-900 border-accent dark:border-amber-500 p-4 rounded mb-5 text-xs text-start ${language === 'ur' ? 'border-r-2' : 'border-l-2'}`}>
                        <span className="block font-bold text-primary dark:text-accent mb-1.5">
                          {language === 'en' ? 'Question Detail:' : 'سوال کی تفصیل:'}
                        </span>
                        <p className="text-slate-700 dark:text-slate-300 leading-relaxed">
                          "{q.detailedQuestion}"
                        </p>
                      </div>

                      {/* Detailed Answer */}
                      <div className="text-sm leading-relaxed">
                        <span className="block text-xs font-bold text-slate-500 dark:text-slate-400 mb-2">
                          {language === 'en' ? 'Scholar Answer:' : 'عالم کا جواب:'}
                        </span>
                        <div
                          className={`prose prose-sm dark:prose-invert text-slate-800 dark:text-slate-200 leading-relaxed font-light whitespace-pre-line ${language === 'ur' ? 'text-right' : 'text-left'}`}
                          dangerouslySetInnerHTML={{ __html: q.answerContent }}
                        ></div>
                      </div>

                    </div>
                  )}

                </div>
              );
            })}
          </div>
        ) : (
          <div className="text-center py-16 premium-card">
            <MessageSquare className="w-12 h-12 text-accent mx-auto mb-4" />
            <h3 className="text-lg font-bold text-slate-700 dark:text-white font-serif">
              {language === 'en' ? 'No answered questions found' : 'کوئی جواب شدہ سوال نہیں ملا'}
            </h3>
            <p className="text-slate-550 dark:text-slate-400 text-xs mt-1">
              {language === 'en' ? 'Please modify search terms or category filters.' : 'براہ کرم تلاش کے الفاظ یا زمرے کے فلٹرز تبدیل کریں۔'}
            </p>
          </div>
        )}

        {/* Pagination Controls */}
        {!loading && pages > 1 && (
          <div className="flex justify-center items-center gap-1.5 pt-4 text-slate-800 dark:text-white">
            <button
              onClick={() => handlePageChange(Math.max(1, page - 1))}
              disabled={page === 1}
              className="px-3.5 py-1.5 rounded text-xs font-bold border border-border dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 disabled:opacity-50 hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors"
            >
              {language === 'en' ? 'Previous' : 'پچھلا'}
            </button>
            {[...Array(pages).keys()].map((pNum) => (
              <button
                key={pNum + 1}
                onClick={() => handlePageChange(pNum + 1)}
                className={`w-8.5 h-8.5 rounded text-xs font-bold border transition-colors ${page === pNum + 1
                  ? 'bg-primary border-primary text-white'
                  : 'bg-white dark:bg-slate-800 border-border dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700'
                  }`}
              >
                {pNum + 1}
              </button>
            ))}
            <button
              onClick={() => handlePageChange(Math.min(pages, page + 1))}
              disabled={page === pages}
              className="px-3.5 py-1.5 rounded text-xs font-bold border border-border dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 disabled:opacity-50 hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors"
            >
              {language === 'en' ? 'Next' : 'اگلا'}
            </button>
          </div>
        )}

      </div>
    </div>
  );
}
