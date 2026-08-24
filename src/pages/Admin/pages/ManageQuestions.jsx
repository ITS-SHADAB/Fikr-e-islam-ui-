import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  ArrowRight,
  Save,
  Trash2,
  HelpCircle,
  CheckCircle,
  AlertTriangle,
  Eye,
  EyeOff,
  Search,
  MessageSquare,
  X,
  User,
  Clock,
  Send,
  Edit2
} from 'lucide-react';
import { getAdminQuestions, answerQuestion, deleteQuestion } from '@/services';
import { useSettings } from '@/hooks/useSettings';
import { Input, Table, ConfirmationBox } from '@/components';
import {
  CATEGORY_MAP,
  FATWA_CATEGORY_TRANSLATIONS as categoryTranslations,
} from '@/utils/categories';

export default function ManageQuestions() {
  const { language } = useSettings();
  const [deleteTargetId, setDeleteTargetId] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [errorModal, setErrorModal] = useState({ isOpen: false, message: '' });
  const isUrdu = language === 'ur';


  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [pages, setPages] = useState(1);
  const [total, setTotal] = useState(0);

  // Filters
  const [statusFilter, setStatusFilter] = useState('all');
  const [categoryFilter, setCategoryFilter] = useState('');
  const [searchTerm, setSearchTerm] = useState('');

  // Active / Answering State
  const [activeQuestion, setActiveQuestion] = useState(null);
  const [answerContent, setAnswerContent] = useState('');
  const [isPublic, setIsPublic] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [actionError, setActionError] = useState(null);
  const [success, setSuccess] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');

  const categories = CATEGORY_MAP.questions || CATEGORY_MAP.fatwas || [];

  const loadQuestions = async (
    pageNum = page,
    status = statusFilter,
    category = categoryFilter,
    search = searchTerm
  ) => {
    try {
      setLoading(true);
      const params = {
        page: pageNum,
        limit: 10,
      };
      if (status && status !== 'all') params.status = status;
      if (category) params.category = category;
      if (search) params.search = search;

      const data = await getAdminQuestions(params);
      const list = data?.questions || (Array.isArray(data) ? data : []);
      setQuestions(list);
      setPage(data?.currentPage || pageNum);
      setPages(data?.totalPages || Math.ceil((data?.totalQuestions || list.length) / 10) || 1);
      setTotal(data?.totalQuestions !== undefined ? data.totalQuestions : list.length);
    } catch (err) {
      console.error('Failed to load questions:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadQuestions(page, statusFilter, categoryFilter, searchTerm);
  }, [page, statusFilter, categoryFilter]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    setPage(1);
    loadQuestions(1, statusFilter, categoryFilter, searchTerm);
  };

  const handleStatusChange = (status) => {
    setStatusFilter(status);
    setPage(1);
    loadQuestions(1, status, categoryFilter, searchTerm);
  };

  const handleCategoryChange = (cat) => {
    setCategoryFilter(cat);
    setPage(1);
    loadQuestions(1, statusFilter, cat, searchTerm);
  };

  const handlePageChange = (pNum) => {
    setPage(pNum);
    loadQuestions(pNum, statusFilter, categoryFilter, searchTerm);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const openAnswerModal = (q) => {
    setActiveQuestion(q);
    setAnswerContent(q.answerContent || q.detailedAnswer || '');
    setIsPublic(q.isPublic !== undefined ? q.isPublic : true);
    setActionError(null);
  };

  const closeAnswerModal = () => {
    setActiveQuestion(null);
    setAnswerContent('');
    setActionError(null);
  };

  const handleAnswerSubmit = async (e) => {
    e.preventDefault();
    setActionError(null);
    if (!activeQuestion) return;

    if (!answerContent.trim()) {
      setActionError(isUrdu ? 'براہ کرم جواب درج کریں۔' : 'Please provide an answer.');
      return;
    }

    try {
      setActionLoading(true);
      await answerQuestion(activeQuestion._id, {
        answerContent,
        detailedAnswer: answerContent,
        isPublic,
      });
      setSuccessMsg(isUrdu ? 'جواب کامیابی سے محفوظ کر دیا گیا ہے۔' : 'Answer saved successfully.');
      setSuccess(true);
      closeAnswerModal();
      loadQuestions(page, statusFilter, categoryFilter, searchTerm);
      setTimeout(() => setSuccess(false), 3500);
    } catch (err) {
      setActionError(err.response?.data?.message || err.message || 'Failed to save answer');
    } finally {
      setActionLoading(false);
    }
  };

  const handleDelete = (id) => {
    setDeleteTargetId(id);
    setShowDeleteModal(true);
  };

  const handleConfirmDelete = async () => {
    if (!deleteTargetId) return;
    const id = deleteTargetId;
    setShowDeleteModal(false);
    setActionError(null);
    try {
      await deleteQuestion(id);
      if (activeQuestion?._id === id) closeAnswerModal();
      setSuccessMsg(isUrdu ? 'سوال کامیابی سے حذف کر دیا گیا ہے۔' : 'Question deleted successfully.');
      setSuccess(true);
      loadQuestions(page, statusFilter, categoryFilter, searchTerm);
      setTimeout(() => setSuccess(false), 3000);
    } catch (err) {
      setErrorModal({
        isOpen: true,
        message: err.response?.data?.message || err.message || 'Failed to delete question'
      });
    } finally {
      setDeleteTargetId(null);
    }
  };



  return (
    <div
      className={`min-h-screen bg-slate-50 py-8 px-4 sm:px-6 lg:px-8 font-sans ${
        isUrdu ? 'text-right' : 'text-left'
      }`}
      dir={isUrdu ? 'rtl' : 'ltr'}
    >
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header Bar */}
        <div className="bg-white border-2 border-gray-300 rounded-lg p-5 flex flex-col sm:flex-row items-center justify-between gap-4 shadow-sm">
          <div className="flex items-center gap-3 w-full sm:w-auto">
            <Link
              to="/admin/dashboard"
              className="p-2 border-2 border-gray-300 bg-slate-50 hover:bg-slate-100 rounded text-slate-600 transition-colors shrink-0"
              title={isUrdu ? 'ڈیش بورڈ واپس' : 'Back to Dashboard'}
            >
              <ArrowRight
                className={`w-5 h-5 ${!isUrdu ? 'rotate-180' : ''}`}
              />
            </Link>
            <div className="flex flex-col gap-1.5">
              <h1 className="text-xl sm:text-2xl font-bold text-primary font-serif leading-normal">
                سوالات و جوابات کا انتظام
              </h1>
              <p className="text-xs text-slate-500 font-medium leading-relaxed">
                سائلین کے پوچھے گئے مسائل کا جائزہ لیں، شرعی جواب دیں اور شائع کریں۔
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 self-stretch sm:self-auto justify-end">
            <span className="text-xs font-bold text-primary bg-primary/10 px-3.5 py-2 rounded border border-primary/20">
              مجموعی سوالات: {total}
            </span>
          </div>
        </div>

        {/* Success Banner */}
        {success && (
          <div
            className={`bg-emerald-50 border-2 border-emerald-500 text-emerald-800 p-4 rounded-lg flex items-center gap-3 shadow-sm ${
              isUrdu ? 'text-right' : 'text-left'
            }`}
          >
            <CheckCircle className="w-5 h-5 text-emerald-600 shrink-0" />
            <span className="text-xs sm:text-sm font-bold">{successMsg}</span>
          </div>
        )}

        {/* Search & Filter Toolbar */}
        <div className="bg-white border-2 border-gray-300 rounded-lg p-4 flex flex-col lg:flex-row items-center justify-between gap-4 shadow-sm">
          {/* Status Tabs */}
          <div className="flex items-center gap-1.5 w-full lg:w-auto overflow-x-auto pb-1 lg:pb-0">
            {[
              { key: 'all', labelUr: 'تمام', labelEn: 'All' },
              { key: 'pending', labelUr: 'زیرِ التوا', labelEn: 'Pending' },
              { key: 'answered', labelUr: 'جواب شدہ', labelEn: 'Answered' },
            ].map((tab) => (
              <button
                key={tab.key}
                onClick={() => handleStatusChange(tab.key)}
                className={`px-3.5 py-1.5 rounded text-xs font-bold transition-all shrink-0 ${
                  statusFilter === tab.key
                    ? 'bg-primary text-white shadow-sm border-2 border-primary'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200 border-2 border-transparent'
                }`}
              >
                {isUrdu ? tab.labelUr : tab.labelEn}
              </button>
            ))}
          </div>

          {/* Search Input & Category Filter */}
          <div className="flex flex-col sm:flex-row items-center gap-3 w-full lg:w-auto">
            <form onSubmit={handleSearchSubmit} className="relative w-full sm:w-64">
              <input
                type="text"
                placeholder={isUrdu ? 'سوال یا سائل تلاش کریں...' : 'Search question or asker...'}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className={`w-full border-2 border-gray-300 rounded px-3 py-1.5 text-xs outline-none focus:border-primary transition-colors ${
                  isUrdu ? 'pr-8 pl-3 text-right' : 'pl-8 pr-3 text-left'
                }`}
                dir={isUrdu ? 'rtl' : 'ltr'}
              />
              <button
                type="submit"
                className={`absolute top-2 text-slate-400 hover:text-primary ${
                  isUrdu ? 'right-2.5' : 'left-2.5'
                }`}
              >
                <Search className="w-4 h-4" />
              </button>
            </form>

            <select
              value={categoryFilter}
              onChange={(e) => handleCategoryChange(e.target.value)}
              className={`w-full sm:w-auto border-2 border-gray-300 rounded px-3 py-1.5 text-xs outline-none bg-white text-slate-700 focus:border-primary ${
                isUrdu ? 'text-right' : 'text-left'
              }`}
              dir={isUrdu ? 'rtl' : 'ltr'}
            >
              <option value="">{isUrdu ? 'تمام زمرے' : 'All Categories'}</option>
              {categories.map((cat) => (
                <option key={cat.value} value={cat.value}>
                  {isUrdu ? cat.labelUr : cat.labelEn}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Main Table with Integrated Pagination */}
        <div className="bg-white border-2 border-gray-300 rounded-lg shadow-md overflow-hidden">
          <Table
            loadingTableContent={loading}
            data={questions}
            currentPage={page}
            totalPages={pages}
            totalItems={total}
            pageSize={10}
            onPageChange={handlePageChange}
            onRowClick={(q) => openAnswerModal(q)}
            language={language}
            noRecordText={
              isUrdu
                ? 'کوئی سوال موصول نہیں ہوا'
                : 'No questions submitted yet'
            }
            tableLayout={[
              {
                headData: isUrdu ? 'سائل' : 'Asker',
                bodyData: (q) => {
                  const askerName = q.fullName || q.user?.name || (isUrdu ? 'نامعلوم' : 'Anonymous');
                  const askerEmail = q.email || q.user?.email || '';
                  return (
                    <div className="flex items-center gap-2 max-w-[180px]">
                      <div className="w-7 h-7 rounded-full bg-slate-100 flex items-center justify-center text-slate-500 shrink-0 border border-gray-200">
                        <User className="w-3.5 h-3.5" />
                      </div>
                      <div className={`overflow-hidden ${isUrdu ? 'text-right' : 'text-left'}`}>
                        <span className="font-bold text-xs text-slate-800 truncate block">
                          {askerName}
                        </span>
                        {askerEmail && (
                          <span className="text-[10px] text-slate-400 truncate block">
                            {askerEmail}
                          </span>
                        )}
                      </div>
                    </div>
                  );
                },
                tdClassName: `border-b border-gray-200 py-3 ${
                  isUrdu ? 'text-right' : 'text-left'
                }`,
              },
              {
                headData: isUrdu ? 'عنوان و سوال' : 'Question Title',
                bodyData: (q) => (
                  <div className={`max-w-md ${isUrdu ? 'text-right' : 'text-left'}`}>
                    <span className="font-bold font-serif text-xs text-slate-900 line-clamp-1 block">
                      {q.questionTitle}
                    </span>
                    <span className="text-[11px] text-slate-500 line-clamp-1 block font-light mt-0.5">
                      {q.detailedQuestion || q.question}
                    </span>
                  </div>
                ),
                tdClassName: `border-b border-gray-200 py-3 ${
                  isUrdu ? 'text-right' : 'text-left'
                }`,
              },
              {
                headData: isUrdu ? 'زمرہ' : 'Category',
                bodyData: (q) => (
                  <span className="bg-primary/10 text-primary text-[10px] font-bold px-2 py-0.5 rounded border border-primary/20 whitespace-nowrap">
                    {categoryTranslations[q.category] || q.category || (isUrdu ? 'عام' : 'General')}
                  </span>
                ),
                tdClassName: `border-b border-gray-200 py-3 ${
                  isUrdu ? 'text-right' : 'text-left'
                }`,
              },
              {
                headData: isUrdu ? 'تاریخ' : 'Date',
                bodyData: (q) => (
                  <span className="text-[11px] text-slate-500 font-medium whitespace-nowrap">
                    {q.createdAt
                      ? new Date(q.createdAt).toLocaleDateString(
                          isUrdu ? 'ur-PK' : 'en-US'
                        )
                      : '—'}
                  </span>
                ),
                tdClassName: `border-b border-gray-200 py-3 ${
                  isUrdu ? 'text-right' : 'text-left'
                }`,
              },
              {
                headData: isUrdu ? 'حیثیت' : 'Status',
                bodyData: (q) => {
                  const isAnswered = q.status === 'answered' || Boolean(q.answerContent || q.detailedAnswer);
                  return (
                    <span
                      className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full inline-block whitespace-nowrap ${
                        isAnswered
                          ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                          : 'bg-amber-100 text-amber-800 border border-amber-300'
                      }`}
                    >
                      {isAnswered
                        ? isUrdu
                          ? 'جواب شدہ'
                          : 'Answered'
                        : isUrdu
                        ? 'زیرِ التوا'
                        : 'Pending'}
                    </span>
                  );
                },
                tdClassName: `border-b border-gray-200 py-3 text-center`,
              },
              {
                headData: isUrdu ? 'شائع' : 'Public',
                bodyData: (q) => {
                  const pub = q.isPublic !== false;
                  return (
                    <div className="flex items-center justify-center">
                      {pub ? (
                        <span
                          className="text-emerald-600 flex items-center gap-1 text-[11px] font-bold"
                          title={isUrdu ? 'پبلک' : 'Public'}
                        >
                          <Eye className="w-4 h-4" />
                        </span>
                      ) : (
                        <span
                          className="text-slate-400 flex items-center gap-1 text-[11px] font-bold"
                          title={isUrdu ? 'پرائیویٹ' : 'Private'}
                        >
                          <EyeOff className="w-4 h-4" />
                        </span>
                      )}
                    </div>
                  );
                },
                tdClassName: `border-b border-gray-200 py-3 text-center`,
              },
              {
                headData: isUrdu ? 'حذف' : 'Delete',
                bodyData: (q) => (
                  <div className="inline-flex items-center justify-center">
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDelete(q._id);
                      }}
                      className="p-1.5 text-red-600 hover:bg-red-50 rounded transition-colors border border-transparent hover:border-red-300"
                      title={isUrdu ? 'حذف کریں' : 'Delete'}
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ),
                tdClassName: `border-b border-gray-200 py-3 text-center`,
              },
            ]}
            theadClassName="border-b-2 border-gray-300 bg-primary"
            thClassName="px-4 py-3 text-xs font-bold text-white uppercase tracking-wider border-b-2 border-gray-300"
          />
        </div>
      </div>

      {/* Answer Modal Dialog */}
      {activeQuestion && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
          <div
            className={`bg-white border-2 border-gray-300 rounded-xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto ${
              isUrdu ? 'text-right' : 'text-left'
            }`}
            dir={isUrdu ? 'rtl' : 'ltr'}
          >
            {/* Modal Header */}
            <div className="p-4 sm:p-5 border-b-2 border-gray-200 bg-slate-50 flex items-center justify-between sticky top-0 z-10">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded bg-primary/10 text-primary flex items-center justify-center font-bold">
                  <MessageSquare className="w-4 h-4 text-accent" />
                </div>
                <div>
                  <h3 className="font-bold text-base text-primary font-serif">
                    {isUrdu ? 'شرعی سوال کا جواب درج کریں' : 'Provide Islamic Answer'}
                  </h3>
                  <span className="text-[11px] text-slate-500 font-medium">
                    {categoryTranslations[activeQuestion.category] || activeQuestion.category}
                  </span>
                </div>
              </div>
              <button
                type="button"
                onClick={closeAnswerModal}
                className="p-1.5 text-slate-400 hover:text-slate-700 rounded-lg hover:bg-slate-200 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Content */}
            <form onSubmit={handleAnswerSubmit} className="p-5 space-y-5">
              {actionError && (
                <div className="bg-red-50 border-2 border-red-400 text-red-700 p-3 rounded text-xs flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4 shrink-0" />
                  <span>{actionError}</span>
                </div>
              )}

              {/* Asker & Date Info */}
              <div className="bg-slate-50 border border-gray-200 rounded-lg p-3.5 text-xs grid grid-cols-1 sm:grid-cols-2 gap-2 text-slate-600">
                <div>
                  <span className="font-bold text-slate-700 block">
                    {isUrdu ? 'سائل:' : 'Asker:'}{' '}
                    {activeQuestion.fullName || activeQuestion.user?.name || (isUrdu ? 'نامعلوم' : 'Anonymous')}
                  </span>
                  {activeQuestion.email && (
                    <span className="text-slate-400 block text-[11px] mt-0.5">
                      {activeQuestion.email}
                    </span>
                  )}
                </div>
                <div>
                  <span className="font-bold text-slate-700 block">
                    {isUrdu ? 'تاریخ سوال:' : 'Date Submitted:'}{' '}
                    {new Date(activeQuestion.createdAt).toLocaleDateString(
                      isUrdu ? 'ur-PK' : 'en-US'
                    )}
                  </span>
                </div>
              </div>

              {/* Question Text */}
              <div>
                <h4 className="font-bold font-serif text-sm text-slate-900 mb-1.5">
                  {isUrdu ? 'سوال:' : 'Question:'} {activeQuestion.questionTitle}
                </h4>
                <div
                  className={`bg-amber-50/60 border rounded-lg p-3.5 text-xs text-slate-800 leading-relaxed ${
                    isUrdu ? 'border-r-4 border-r-accent' : 'border-l-4 border-l-accent'
                  }`}
                >
                  {activeQuestion.detailedQuestion || activeQuestion.question}
                </div>
              </div>

              {/* Answer Field */}
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  {isUrdu ? 'مفتی / عالم صاحب کا جواب *' : 'Scholar Answer *'}
                </label>
                <textarea
                  required
                  rows={6}
                  value={answerContent}
                  onChange={(e) => setAnswerContent(e.target.value)}
                  placeholder={
                    isUrdu
                      ? 'الجواب وباللہ التوفیق: شرعی حکم اور جواب یہاں تحریر کریں...'
                      : 'Write the Islamic ruling and detailed explanation here...'
                  }
                  className={`w-full border-2 border-gray-300 rounded-lg p-3 text-xs outline-none focus:border-primary transition-colors resize-y ${
                    isUrdu ? 'text-right' : 'text-left'
                  }`}
                  dir={isUrdu ? 'rtl' : 'ltr'}
                ></textarea>
              </div>

              {/* Public Visibility Toggle */}
              <div className="flex items-center gap-2 pt-1">
                <input
                  type="checkbox"
                  id="isPublicModal"
                  checked={isPublic}
                  onChange={(e) => setIsPublic(e.target.checked)}
                  className="w-4 h-4 text-primary rounded border-gray-300 focus:ring-primary cursor-pointer"
                />
                <label
                  htmlFor="isPublicModal"
                  className="text-xs font-bold text-slate-700 cursor-pointer select-none"
                >
                  {isUrdu
                    ? 'منظور کریں اور سوال و جواب کے صفحے پر پبلک کریں'
                    : 'Approve and publish to public Q&A directory'}
                </label>
              </div>

              {/* Modal Actions */}
              <div className="flex items-center justify-end gap-2 pt-4 border-t-2 border-gray-200">
                <button
                  type="button"
                  onClick={closeAnswerModal}
                  className="px-4 py-2 border-2 border-gray-300 rounded text-xs font-bold text-slate-600 hover:bg-slate-50 transition-colors uppercase tracking-wider"
                >
                  {isUrdu ? 'منسوخ کریں' : 'Cancel'}
                </button>
                <button
                  type="submit"
                  disabled={actionLoading}
                  className="flex items-center gap-1.5 px-6 py-2 bg-primary hover:bg-primary/90 text-white rounded text-xs font-bold shadow-sm transition-all uppercase tracking-wider disabled:opacity-50 border-2 border-primary/70 cursor-pointer"
                >
                  <Save className="w-4 h-4 text-accent" />
                  {actionLoading
                    ? isUrdu
                      ? 'محفوظ کیا جا رہا ہے...'
                      : 'Saving...'
                    : isUrdu
                    ? 'جواب محفوظ کریں'
                    : 'Save Answer'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Question Confirmation Box */}
      <ConfirmationBox
        isOpen={showDeleteModal}
        onClose={() => {
          setShowDeleteModal(false);
          setDeleteTargetId(null);
        }}
        onConfirm={handleConfirmDelete}
        title={isUrdu ? 'سوال حذف کرنے کی تصدیق' : 'Delete Question'}
        message={isUrdu ? 'کیا آپ واقعی اس سوال کو حذف کرنا چاہتے ہیں؟' : 'Are you sure you want to delete this question?'}
        type="danger"
        confirmText={isUrdu ? 'ہاں، حذف کریں' : 'Delete'}
        cancelText={isUrdu ? 'منسوخ کریں' : 'Cancel'}
      />

      {/* Error Alert Box */}
      <ConfirmationBox
        isOpen={errorModal.isOpen}
        onClose={() => setErrorModal({ isOpen: false, message: '' })}
        title={isUrdu ? 'خرابی' : 'Error'}
        message={errorModal.message}
        type="danger"
        confirmText={isUrdu ? 'ٹھیک ہے' : 'OK'}
        showCancel={false}
      />
    </div>
  );
}