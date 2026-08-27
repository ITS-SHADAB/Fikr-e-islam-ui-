import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  ArrowRight,
  Save,
  Trash2,
  HelpCircle,
  CheckCircle,
  AlertTriangle,
  Search,
  MessageSquare,
  X,
  User,
  BookOpen,
  Building2,
  CheckCircle2,
  Folder,
  Calendar,
  ThumbsDown,
  ThumbsUp,
  Globe,
  Lock,
  BarChart2,
  Edit3,
  RotateCcw,
  Phone,
  Mail,
  Eye,
  Clock,
  Loader2,
} from 'lucide-react';
import {
  getAdminQuestions,
  getQuestionStats,
  answerQuestion,
  approveQuestion,
  rejectQuestion,
  publishQuestion,
  restoreQuestion,
  permanentDeleteQuestion,
} from '@/services';
import { Table, ConfirmationBox } from '@/components';
import { COLORS } from '@/utils/themeColors';
import {
  CATEGORY_MAP,
  FATWA_CATEGORY_TRANSLATIONS as categoryTranslations,
} from '@/utils/categories';

/* ── Status Badge Component (Compact, Small Text) ── */
function StatusBadge({ status, isDeleted }) {
  if (isDeleted) {
    return (
      <span className="text-[10px] font-bold px-2 py-0.5 rounded-md inline-block whitespace-nowrap bg-red-50 text-red-700 border border-red-200">
        حذف شدہ
      </span>
    );
  }
  const map = {
    pending:  { label: 'زیرِ التوا',  cls: 'bg-amber-50 text-amber-800 border-amber-200' },
    approved: { label: 'منظور شدہ',  cls: 'bg-blue-50 text-blue-800 border-blue-200' },
    answered: { label: 'جواب شدہ',   cls: 'bg-emerald-50 text-emerald-800 border-emerald-200' },
    rejected: { label: 'مسترد',       cls: 'bg-rose-50 text-rose-800 border-rose-200' },
  };
  const { label, cls } = map[status] || { label: status || 'نامعلوم', cls: 'bg-slate-50 text-slate-700 border-slate-200' };
  return (
    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-md inline-block whitespace-nowrap border ${cls}`}>
      {label}
    </span>
  );
}

export default function ManageQuestions() {
  // Modal states
  const [deleteTargetId, setDeleteTargetId] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [errorModal, setErrorModal] = useState({ isOpen: false, message: '' });

  // Data states
  const [questions, setQuestions] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [statsLoading, setStatsLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [pages, setPages] = useState(1);
  const [total, setTotal] = useState(0);

  // Filter states
  const [statusFilter, setStatusFilter] = useState('all');
  const [categoryFilter, setCategoryFilter] = useState('');
  const [searchTerm, setSearchTerm] = useState('');

  // Active Answering Modal State
  const [activeQuestion, setActiveQuestion] = useState(null);
  const [answerContent, setAnswerContent] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [isPublic, setIsPublic] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [actionId, setActionId] = useState(null); // Tracks which row action is loading
  const [actionError, setActionError] = useState(null);
  const [success, setSuccess] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');

  const categories = CATEGORY_MAP.questions || CATEGORY_MAP.fatwas || [];

  const showSuccess = (msg) => {
    setSuccessMsg(msg);
    setSuccess(true);
    setTimeout(() => setSuccess(false), 3000);
  };

  // Load stats from backend
  const loadStats = async () => {
    try {
      setStatsLoading(true);
      const data = await getQuestionStats();
      if (data?.stats) {
        setStats(data.stats);
      }
    } catch (err) {
      console.error('Failed to load stats:', err);
    } finally {
      setStatsLoading(false);
    }
  };

  // Load questions from backend
  const loadQuestions = async (
    pageNum = page,
    status = statusFilter,
    category = categoryFilter,
    search = searchTerm
  ) => {
    try {
      setLoading(true);
      const params = { page: pageNum, limit: 10 };
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
    loadStats();
  }, [page, statusFilter, categoryFilter]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    setPage(1);
    loadQuestions(1, statusFilter, categoryFilter, searchTerm);
  };

  const handlePageChange = (pNum) => {
    setPage(pNum);
    loadQuestions(pNum, statusFilter, categoryFilter, searchTerm);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const openAnswerModal = (q) => {
    setActiveQuestion(q);
    setAnswerContent(q.answerContent || '');
    setSelectedCategory(q.category || (categories[0]?.value || 'عام مسائل'));
    setIsPublic(q.isPublic !== undefined ? q.isPublic : true);
    setActionError(null);
  };

  const closeAnswerModal = () => {
    setActiveQuestion(null);
    setAnswerContent('');
    setActionError(null);
  };

  // ── Answer Submit ──
  const handleAnswerSubmit = async (e) => {
    e.preventDefault();
    setActionError(null);
    if (!activeQuestion) return;

    if (!answerContent.trim()) {
      setActionError('براہ کرم جواب درج کریں۔');
      return;
    }

    try {
      setActionLoading(true);
      await answerQuestion(activeQuestion._id, {
        answerContent,
        category: selectedCategory || activeQuestion.category || 'عام مسائل',
        isPublic,
      });
      showSuccess(
        isPublic
          ? 'جواب محفوظ اور پبلک شائع کر دیا گیا ہے۔'
          : 'جواب محفوظ ہو گیا (پرائیویٹ)۔'
      );
      closeAnswerModal();
      loadQuestions(page, statusFilter, categoryFilter, searchTerm);
      loadStats();
    } catch (err) {
      setActionError(err.response?.data?.message || err.message || 'جواب محفوظ کرنے میں ناکامی');
    } finally {
      setActionLoading(false);
    }
  };

  // ── Approve Question ──
  const handleApprove = async (q, e) => {
    e?.stopPropagation();
    try {
      setActionId(q._id);
      await approveQuestion(q._id);
      showSuccess('سوال منظور کر دیا گیا۔');
      loadQuestions(page, statusFilter, categoryFilter, searchTerm);
      loadStats();
    } catch (err) {
      setErrorModal({ isOpen: true, message: err.response?.data?.message || err.message });
    } finally {
      setActionId(null);
    }
  };

  // ── Reject Question ──
  const handleReject = async (q, e) => {
    e?.stopPropagation();
    try {
      setActionId(q._id);
      await rejectQuestion(q._id);
      if (activeQuestion?._id === q._id) closeAnswerModal();
      showSuccess('سوال مسترد کر دیا گیا۔');
      loadQuestions(page, statusFilter, categoryFilter, searchTerm);
      loadStats();
    } catch (err) {
      setErrorModal({ isOpen: true, message: err.response?.data?.message || err.message });
    } finally {
      setActionId(null);
    }
  };

  // ── Publish Toggle ──
  const handlePublishToggle = async (q, e) => {
    e?.stopPropagation();
    const newVal = !q.isPublic;
    try {
      setActionId(q._id);
      await publishQuestion(q._id, newVal);
      showSuccess(newVal ? 'سوال و جواب پبلک ہو گیا۔' : 'سوال و جواب پرائیویٹ ہو گیا۔');
      loadQuestions(page, statusFilter, categoryFilter, searchTerm);
      loadStats();
    } catch (err) {
      setErrorModal({ isOpen: true, message: err.response?.data?.message || err.message });
    } finally {
      setActionId(null);
    }
  };

  // ── Restore Deleted Question ──
  const handleRestore = async (id, e) => {
    e?.stopPropagation();
    try {
      setActionId(id);
      await restoreQuestion(id);
      showSuccess('سوال بحال کر دیا گیا۔');
      loadQuestions(page, statusFilter, categoryFilter, searchTerm);
      loadStats();
    } catch (err) {
      setErrorModal({ isOpen: true, message: err.response?.data?.message || err.message });
    } finally {
      setActionId(null);
    }
  };

  // ── Delete ──
  const handleDelete = (id, e) => {
    e?.stopPropagation();
    setDeleteTargetId(id);
    setShowDeleteModal(true);
  };

  const handleConfirmDelete = async () => {
    if (!deleteTargetId) return;
    const id = deleteTargetId;
    setShowDeleteModal(false);
    try {
      setActionId(id);
      await permanentDeleteQuestion(id);
      if (activeQuestion?._id === id) closeAnswerModal();
      showSuccess('سوال حذف کر دیا گیا۔');
      loadQuestions(page, statusFilter, categoryFilter, searchTerm);
      loadStats();
    } catch (err) {
      setErrorModal({ isOpen: true, message: err.response?.data?.message || err.message || 'سوال حذف کرنے میں ناکامی' });
    } finally {
      setDeleteTargetId(null);
      setActionId(null);
    }
  };

  return (
    <div className="min-h-screen bg-[#FAF8F5] py-5 px-3 sm:px-5 lg:px-6 text-right font-sans text-xs" dir="rtl">
      <div className="max-w-7xl mx-auto space-y-4">

        {/* ── Compact Header ── */}
        <div className="bg-white border border-[#E8E1D9] rounded-xl p-3.5 sm:p-4 flex flex-col sm:flex-row items-center justify-between gap-3 shadow-2xs">
          <div className="flex items-center gap-2.5 w-full sm:w-auto">
            <Link
              to="/admin/dashboard"
              className="p-1.5 border border-[#E8E1D9] bg-[#FAF8F5] hover:bg-[#F0EAE1] rounded-lg text-slate-600 transition-colors shrink-0"
              title="ڈیش بورڈ"
            >
              <ArrowRight className="w-4 h-4" />
            </Link>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full" style={{ backgroundColor: COLORS.accent }} />
                <h1 className="text-sm sm:text-base font-bold text-slate-900 font-['Noto_Nastaliq_Urdu'] leading-normal">
                  سوالات و جوابات کا انتظام
                </h1>
              </div>
              <p className="text-[11px] text-slate-500 mt-0.5">
                شرعی سوالات کا جائزہ لیں، فتویٰ و جواب درج کریں اور شائع کریں۔
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 self-stretch sm:self-auto justify-end">
            <span className="inline-flex items-center gap-1 text-[11px] font-bold px-2.5 py-1 rounded-lg border bg-slate-50 border-slate-200 text-slate-700">
              <BarChart2 className="w-3.5 h-3.5 text-slate-500" />
              کل سوالات: {total}
            </span>
          </div>
        </div>

        {/* ── Simple, Compact Stat Cards ── */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2">
          {[
            { id: 'all', label: 'کل سوالات', count: stats?.totalQuestions ?? total, color: 'text-slate-900', border: 'border-slate-200' },
            { id: 'pending', label: 'زیرِ التوا', count: stats?.pendingQuestions ?? 0, color: 'text-amber-700', border: 'border-amber-200' },
            { id: 'approved', label: 'منظور شدہ', count: stats?.approvedQuestions ?? 0, color: 'text-blue-700', border: 'border-blue-200' },
            { id: 'answered', label: 'جواب شدہ', count: stats?.answeredQuestions ?? 0, color: 'text-emerald-700', border: 'border-emerald-200' },
            { id: 'rejected', label: 'مسترد شدہ', count: stats?.rejectedQuestions ?? 0, color: 'text-rose-700', border: 'border-rose-200' },
            { id: 'deleted', label: 'حذف شدہ', count: stats?.deletedQuestions ?? 0, color: 'text-red-700', border: 'border-red-200' },
          ].map((st) => {
            const isSelected = statusFilter === st.id;
            return (
              <button
                key={st.id}
                type="button"
                onClick={() => {
                  setStatusFilter(st.id);
                  setPage(1);
                  loadQuestions(1, st.id, categoryFilter, searchTerm);
                }}
                className={`p-2.5 rounded-xl border bg-white transition-all text-right flex items-center justify-between cursor-pointer ${
                  isSelected ? 'border-[#4A3728] ring-1 ring-[#4A3728] shadow-2xs' : `${st.border} hover:bg-slate-50`
                }`}
              >
                <div>
                  <span className="text-[10px] text-slate-500 font-medium block">{st.label}</span>
                  <span className={`text-sm font-bold font-serif ${st.color}`}>
                    {statsLoading ? '...' : st.count}
                  </span>
                </div>
                {isSelected && <span className="w-1.5 h-1.5 rounded-full bg-[#4A3728]" />}
              </button>
            );
          })}
        </div>

        {/* ── Success Alert ── */}
        {success && (
          <div className="bg-emerald-50 border border-emerald-300 text-emerald-900 px-3.5 py-2.5 rounded-xl flex items-center gap-2 text-xs animate-in fade-in">
            <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0" />
            <span className="font-bold">{successMsg}</span>
          </div>
        )}

        {/* ── Simple Toolbar (Search + Category Filter + Status Tabs) ── */}
        <div className="bg-white border border-[#E8E1D9] rounded-xl p-3 flex flex-col lg:flex-row items-center justify-between gap-2.5 shadow-2xs">
          {/* Status Tabs */}
          <div className="flex items-center gap-1 w-full lg:w-auto overflow-x-auto pb-1 lg:pb-0 flex-wrap">
            {[
              { key: 'all', label: 'تمام' },
              { key: 'pending', label: 'زیرِ التوا' },
              { key: 'answered', label: 'جواب شدہ' },
              { key: 'approved', label: 'منظور شدہ' },
              { key: 'rejected', label: 'مسترد' },
              { key: 'deleted', label: 'ردی کی ٹوکری' },
            ].map((tab) => (
              <button
                key={tab.key}
                type="button"
                onClick={() => {
                  setStatusFilter(tab.key);
                  setPage(1);
                  loadQuestions(1, tab.key, categoryFilter, searchTerm);
                }}
                className={`px-2.5 py-1 rounded-lg text-[11px] font-bold transition-all shrink-0 cursor-pointer ${
                  statusFilter === tab.key
                    ? 'text-white shadow-2xs'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
                style={{
                  backgroundColor: statusFilter === tab.key ? COLORS.primary : undefined,
                }}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Search & Category */}
          <div className="flex flex-col sm:flex-row items-center gap-2 w-full lg:w-auto">
            <form onSubmit={handleSearchSubmit} className="relative w-full sm:w-56">
              <input
                type="text"
                placeholder="تلاش کریں..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full border border-[#D8CDBF] rounded-lg pr-7 pl-2.5 py-1.5 text-[11px] outline-none focus:border-[#4A3728] text-right bg-white"
                dir="rtl"
              />
              <button type="submit" className="absolute top-2 right-2 text-slate-400 hover:text-[#4A3728]">
                <Search className="w-3 h-3" />
              </button>
            </form>

            <select
              value={categoryFilter}
              onChange={(e) => {
                setCategoryFilter(e.target.value);
                setPage(1);
                loadQuestions(1, statusFilter, e.target.value, searchTerm);
              }}
              className="w-full sm:w-auto border border-[#D8CDBF] rounded-lg px-2.5 py-1.5 text-[11px] outline-none bg-white text-slate-700 focus:border-[#4A3728] text-right cursor-pointer"
              dir="rtl"
            >
              <option value="">تمام زمرے</option>
              {categories.map((cat) => (
                <option key={cat.value} value={cat.value}>
                  {cat.labelUr || cat.labelEn}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* ── Table Container with Proper Loading State ── */}
        <div className="bg-white border border-[#E8E1D9] rounded-xl shadow-2xs overflow-hidden relative">
          {/* Loading Overlay */}
          {loading && (
            <div className="py-16 flex flex-col items-center justify-center gap-2 bg-white/90">
              <div
                className="w-7 h-7 border-2 border-t-transparent rounded-full animate-spin"
                style={{ borderColor: `${COLORS.primary} transparent ${COLORS.primary} ${COLORS.primary}` }}
              />
              <span className="text-xs font-bold text-slate-500">سوالات لوڈ ہو رہے ہیں...</span>
            </div>
          )}

          {!loading && (
            <Table
              loadingTableContent={false}
              data={questions}
              currentPage={page}
              totalPages={pages}
              totalItems={total}
              pageSize={10}
              onPageChange={handlePageChange}
              onRowClick={(q) => openAnswerModal(q)}
              noRecordText="کوئی سوال موصول نہیں ہوا"
              tableLayout={[
                {
                  headData: 'سائل',
                  bodyData: (q) => {
                    const name = q.fullName || q.user?.name || 'نامعلوم';
                    const email = q.email || q.user?.email || '';
                    const phone = q.contactPhone || q.user?.contactPhone || '';
                    return (
                      <div className="flex items-center gap-2 max-w-[170px]">
                        <div
                          className="w-6 h-6 rounded-full flex items-center justify-center shrink-0"
                          style={{
                            backgroundColor: `${COLORS.primary}12`,
                            color: COLORS.primary,
                          }}
                        >
                          <User className="w-3 h-3" />
                        </div>
                        <div className="overflow-hidden text-right min-w-0">
                          <span className="font-bold text-[11px] text-slate-900 truncate block">
                            {name}
                          </span>
                          {(email || phone) && (
                            <span className="text-[10px] text-slate-400 truncate block font-mono">
                              {phone || email}
                            </span>
                          )}
                        </div>
                      </div>
                    );
                  },
                  tdClassName: 'border-b border-[#F0EAE1] py-2.5 px-3',
                },
                {
                  headData: 'سوال و عنوان',
                  bodyData: (q) => (
                    <div className="max-w-md text-right space-y-0.5">
                      <div className="flex items-baseline gap-1.5 flex-wrap">
                        <span
                          className="inline-flex items-center gap-0.5 px-1 py-0.2 rounded text-[9px] font-bold shrink-0"
                          style={{
                            backgroundColor: `${COLORS.primary}12`,
                            color: COLORS.primary,
                          }}
                        >
                          <HelpCircle className="w-2.5 h-2.5" />
                          سوال
                        </span>
                        <span className="font-bold font-['Noto_Nastaliq_Urdu'] text-[11px] sm:text-xs text-slate-900 line-clamp-1 flex-1">
                          {q.questionTitle}
                        </span>
                        {q.isEdited && (
                          <span className="text-[8px] text-amber-700 bg-amber-50 px-1 py-0.2 rounded border border-amber-200">
                            ترمیم شدہ
                          </span>
                        )}
                      </div>
                      <p className="text-[10px] text-slate-500 line-clamp-1">
                        {q.detailedQuestion || ''}
                      </p>
                    </div>
                  ),
                  tdClassName: 'border-b border-[#F0EAE1] py-2.5 px-3',
                },
                {
                  headData: 'زمرہ',
                  bodyData: (q) => (
                    <span
                      className="inline-flex items-center gap-1 text-[9px] font-bold px-2 py-0.5 rounded-md border whitespace-nowrap"
                      style={{
                        backgroundColor: `${COLORS.secondary}30`,
                        borderColor: COLORS.border,
                        color: COLORS.primary,
                      }}
                    >
                      <Folder className="w-2.5 h-2.5" />
                      {categoryTranslations[q.category] || q.category || 'عام مسائل'}
                    </span>
                  ),
                  tdClassName: 'border-b border-[#F0EAE1] py-2.5 px-3',
                },
                {
                  headData: 'تاریخ',
                  bodyData: (q) => (
                    <div className="text-[10px] text-slate-500 whitespace-nowrap space-y-0.5">
                      <div className="flex items-center gap-1">
                        <Calendar className="w-2.5 h-2.5 text-slate-400" />
                        <span>{q.createdAt ? new Date(q.createdAt).toLocaleDateString('ur-PK') : '—'}</span>
                      </div>
                      {typeof q.viewCount === 'number' && (
                        <div className="flex items-center gap-1 text-[9px] text-slate-400">
                          <Eye className="w-2.5 h-2.5" />
                          <span>{q.viewCount} مناظر</span>
                        </div>
                      )}
                    </div>
                  ),
                  tdClassName: 'border-b border-[#F0EAE1] py-2.5 px-3',
                },
                {
                  headData: 'حیثیت',
                  bodyData: (q) => <StatusBadge status={q.status} isDeleted={q.isDeleted} />,
                  tdClassName: 'border-b border-[#F0EAE1] py-2.5 px-3 text-center',
                },
                {
                  headData: 'اقدامات',
                  bodyData: (q) => {
                    const isBusy = actionId === q._id;
                    return (
                      <div className="flex items-center justify-center gap-1 flex-wrap" onClick={(e) => e.stopPropagation()}>
                        {isBusy ? (
                          <div className="flex items-center gap-1 text-[10px] text-slate-500 py-1">
                            <Loader2 className="w-3 h-3 animate-spin text-[#4A3728]" />
                            <span>پروسیسنگ...</span>
                          </div>
                        ) : q.isDeleted ? (
                          <button
                            type="button"
                            onClick={(e) => handleRestore(q._id, e)}
                            className="inline-flex items-center gap-0.5 px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200 hover:bg-emerald-100 transition-colors cursor-pointer"
                            title="بحال کریں"
                          >
                            <RotateCcw className="w-2.5 h-2.5" />
                            <span>بحال</span>
                          </button>
                        ) : (
                          <>
                            {/* Reply / Edit */}
                            <button
                              type="button"
                              onClick={() => openAnswerModal(q)}
                              className={`inline-flex items-center gap-0.5 px-2 py-0.5 rounded text-[10px] font-bold border transition-colors cursor-pointer ${
                                q.status === 'answered'
                                  ? 'bg-slate-100 text-slate-700 border-slate-200 hover:bg-slate-200'
                                  : 'bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-100'
                              }`}
                              title={q.status === 'answered' ? 'ترمیم' : 'جواب دیں'}
                            >
                              {q.status === 'answered' ? <Edit3 className="w-2.5 h-2.5" /> : <BookOpen className="w-2.5 h-2.5" />}
                              <span>{q.status === 'answered' ? 'ترمیم' : 'جواب'}</span>
                            </button>

                            {/* Pending Quick Actions */}
                            {q.status === 'pending' && (
                              <>
                                <button
                                  type="button"
                                  onClick={(e) => handleApprove(q, e)}
                                  className="inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded text-[10px] font-bold bg-blue-50 text-blue-700 border border-blue-200 hover:bg-blue-100 transition-colors cursor-pointer"
                                  title="منظور کریں"
                                >
                                  <ThumbsUp className="w-2.5 h-2.5" />
                                  <span>منظور</span>
                                </button>
                                <button
                                  type="button"
                                  onClick={(e) => handleReject(q, e)}
                                  className="inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded text-[10px] font-bold bg-rose-50 text-rose-700 border border-rose-200 hover:bg-rose-100 transition-colors cursor-pointer"
                                  title="مسترد کریں"
                                >
                                  <ThumbsDown className="w-2.5 h-2.5" />
                                  <span>مسترد</span>
                                </button>
                              </>
                            )}

                            {/* Answered: Public toggle */}
                            {q.status === 'answered' && (
                              <button
                                type="button"
                                onClick={(e) => handlePublishToggle(q, e)}
                                className={`inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded text-[10px] font-bold border transition-colors cursor-pointer ${
                                  q.isPublic
                                    ? 'bg-purple-50 text-purple-700 border-purple-200 hover:bg-purple-100'
                                    : 'bg-amber-50 text-amber-700 border-amber-200 hover:bg-amber-100'
                                }`}
                                title={q.isPublic ? 'پرائیویٹ کریں' : 'شائع کریں'}
                              >
                                {q.isPublic ? <><Globe className="w-2.5 h-2.5" /> پبلک</> : <><Lock className="w-2.5 h-2.5" /> پرائیویٹ</>}
                              </button>
                            )}
                          </>
                        )}

                        {/* Delete Button */}
                        <button
                          type="button"
                          onClick={(e) => handleDelete(q._id, e)}
                          className="p-1 text-red-500 hover:bg-red-50 rounded transition-colors cursor-pointer"
                          title="حذف کریں"
                        >
                          <Trash2 className="w-3 h-3" />
                        </button>
                      </div>
                    );
                  },
                  tdClassName: 'border-b border-[#F0EAE1] py-2.5 px-3 text-center',
                },
              ]}
              theadClassName="border-b border-[#E8E1D9]"
              thClassName="px-3 py-2.5 text-[11px] font-bold text-white uppercase tracking-wider"
            />
          )}
        </div>
      </div>

      {/* ── Direct Reply & Answer Modal (Simple & Compact) ── */}
      {activeQuestion && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/60 backdrop-blur-2xs animate-in fade-in duration-150">
          <div className="bg-white border border-[#E8E1D9] rounded-xl shadow-xl w-full max-w-xl max-h-[90vh] overflow-y-auto text-right text-xs" dir="rtl">

            {/* Modal Header */}
            <div className="p-3.5 border-b border-[#F0EAE1] bg-[#FAF8F5] flex items-center justify-between sticky top-0 z-10 rounded-t-xl">
              <div className="flex items-center gap-2">
                <div
                  className="w-7 h-7 rounded-full flex items-center justify-center shrink-0"
                  style={{ backgroundColor: `${COLORS.primary}15`, color: COLORS.primary }}
                >
                  <MessageSquare className="w-3.5 h-3.5" />
                </div>
                <div>
                  <h3 className="font-bold text-xs sm:text-sm text-slate-900 font-['Noto_Nastaliq_Urdu'] leading-normal">
                    شرعی سوال کا جواب
                  </h3>
                  <div className="flex items-center gap-1.5 text-[10px] text-slate-500">
                    <StatusBadge status={activeQuestion.status} isDeleted={activeQuestion.isDeleted} />
                    {activeQuestion.answeredBy?.name && (
                      <span className="text-slate-400 truncate">
                        | مفتی: {activeQuestion.answeredBy.name}
                      </span>
                    )}
                  </div>
                </div>
              </div>
              <button
                type="button"
                onClick={closeAnswerModal}
                className="p-1 text-slate-400 hover:text-slate-700 rounded-lg hover:bg-slate-200 transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-4 space-y-3.5">
              {actionError && (
                <div className="bg-red-50 border border-red-300 text-red-700 p-2.5 rounded-lg text-[11px] flex items-center gap-1.5">
                  <AlertTriangle className="w-3.5 h-3.5 shrink-0" />
                  <span>{actionError}</span>
                </div>
              )}

              {/* Asker Info (Small) */}
              <div className="bg-[#FAF8F5] border border-[#E8E1D9] rounded-lg p-2.5 text-[11px] grid grid-cols-1 sm:grid-cols-2 gap-2 text-slate-600">
                <div className="space-y-0.5">
                  <span className="font-bold text-slate-800 flex items-center gap-1">
                    <User className="w-3 h-3 text-slate-400" />
                    سائل: {activeQuestion.fullName || activeQuestion.user?.name || 'نامعلوم'}
                  </span>
                  {(activeQuestion.email || activeQuestion.user?.email) && (
                    <span className="text-slate-500 flex items-center gap-1 text-[10px]">
                      <Mail className="w-2.5 h-2.5 text-slate-400" />
                      {activeQuestion.email || activeQuestion.user?.email}
                    </span>
                  )}
                  {(activeQuestion.contactPhone || activeQuestion.user?.contactPhone) && (
                    <span className="text-slate-500 flex items-center gap-1 text-[10px] font-mono">
                      <Phone className="w-2.5 h-2.5 text-slate-400" />
                      {activeQuestion.contactPhone || activeQuestion.user?.contactPhone}
                    </span>
                  )}
                </div>
                <div className="space-y-0.5">
                  <span className="font-bold text-slate-800 flex items-center gap-1">
                    <Calendar className="w-3 h-3 text-slate-400" />
                    تاریخ سوال: {new Date(activeQuestion.createdAt).toLocaleDateString('ur-PK')}
                  </span>
                  {activeQuestion.answeredAt && (
                    <span className="text-slate-500 flex items-center gap-1 text-[10px]">
                      <CheckCircle2 className="w-2.5 h-2.5 text-emerald-600" />
                      تاریخ جواب: {new Date(activeQuestion.answeredAt).toLocaleDateString('ur-PK')}
                    </span>
                  )}
                </div>
              </div>

              {/* Question Text */}
              <div className="space-y-1">
                <div className="flex items-baseline gap-1.5 flex-wrap">
                  <span
                    className="inline-flex items-center gap-0.5 px-1.5 py-0.2 rounded text-[10px] font-bold shrink-0"
                    style={{ backgroundColor: `${COLORS.primary}12`, color: COLORS.primary }}
                  >
                    <HelpCircle className="w-2.5 h-2.5" />
                    سوال
                  </span>
                  <h4 className="font-bold font-['Noto_Nastaliq_Urdu'] text-xs sm:text-sm text-slate-900 flex-1 leading-relaxed">
                    {activeQuestion.questionTitle}
                  </h4>
                </div>
                <blockquote
                  className="bg-[#FAF8F5] border rounded-lg p-3 text-[11px] sm:text-xs text-slate-800 leading-relaxed font-['Noto_Nastaliq_Urdu'] italic"
                  style={{
                    borderColor: '#E8E1D9',
                    borderRightWidth: '3px',
                    borderRightColor: COLORS.accent,
                  }}
                >
                  {activeQuestion.detailedQuestion || activeQuestion.question}
                </blockquote>
              </div>

              {/* Answer Form */}
              <form onSubmit={handleAnswerSubmit} className="space-y-3 pt-1">
                {/* Category selector */}
                <div>
                  <label className="flex items-center gap-1 text-[11px] font-bold text-slate-700 mb-1">
                    <Folder className="w-3 h-3 text-slate-400" />
                    زمرہ منتخب کریں *
                  </label>
                  <select
                    required
                    value={selectedCategory}
                    onChange={(e) => setSelectedCategory(e.target.value)}
                    className="w-full border border-[#D8CDBF] rounded-lg px-2.5 py-1.5 text-xs outline-none bg-white text-slate-700 focus:border-[#4A3728] text-right cursor-pointer"
                    dir="rtl"
                  >
                    <option value="">زمرہ منتخب کریں...</option>
                    {categories.map((cat) => (
                      <option key={cat.value} value={cat.value}>
                        {cat.labelUr || cat.labelEn}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Answer Textarea */}
                <div>
                  <div className="flex items-center gap-1 mb-1">
                    <span
                      className="inline-flex items-center gap-0.5 px-1.5 py-0.2 rounded text-[10px] font-bold shrink-0"
                      style={{ backgroundColor: `${COLORS.accent}20`, color: COLORS.accent }}
                    >
                      <BookOpen className="w-2.5 h-2.5" />
                      جواب *
                    </span>
                    <span className="text-[10px] text-slate-500">
                      مفتی صاحب کا شرعی جواب درج کریں
                    </span>
                  </div>
                  <textarea
                    required
                    rows={6}
                    value={answerContent}
                    onChange={(e) => setAnswerContent(e.target.value)}
                    placeholder="الجواب وباللہ التوفیق: شرعی حکم اور تفصیلی جواب یہاں تحریر کریں..."
                    className="w-full border border-[#D8CDBF] rounded-lg p-2.5 text-xs outline-none focus:border-[#4A3728] transition-colors resize-y text-right leading-relaxed font-['Noto_Nastaliq_Urdu']"
                    dir="rtl"
                  />
                </div>

                {/* Verification Badge */}
                <div className="flex items-center gap-1.5 text-[10px] text-slate-500">
                  <Building2 className="w-3 h-3 text-slate-400" />
                  <span>دار الافتاء و تحقیق</span>
                  <span className="text-slate-300">|</span>
                  <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                  <span className="text-emerald-700 font-bold">تصدیق شدہ جواب</span>
                </div>

                {/* Public Checkbox */}
                <div className="p-2.5 bg-purple-50/70 border border-purple-200 rounded-lg space-y-0.5">
                  <div className="flex items-center gap-1.5">
                    <input
                      type="checkbox"
                      id="isPublicModal"
                      checked={isPublic}
                      onChange={(e) => setIsPublic(e.target.checked)}
                      className="w-3.5 h-3.5 text-[#4A3728] rounded border-gray-300 focus:ring-[#4A3728] cursor-pointer"
                    />
                    <label
                      htmlFor="isPublicModal"
                      className="text-[11px] font-bold text-slate-800 cursor-pointer select-none flex items-center gap-1"
                    >
                      <Globe className="w-3 h-3 text-purple-600" />
                      منظور کریں اور عوامی صفحے پر پبلک شائع کریں
                    </label>
                  </div>
                  <p className="text-[10px] text-slate-500 pr-5">
                    {isPublic
                      ? '✓ سوال منظور ہو کر عوامی ڈائریکٹری پر شائع ہو جائے گا۔'
                      : '🔒 صرف سائل اپنے اکاؤنٹ پر دیکھ سکے گا۔'}
                  </p>
                </div>

                {/* Modal Actions */}
                <div className="flex flex-wrap items-center justify-between gap-2 pt-3 border-t border-[#F0EAE1]">
                  <div className="flex items-center gap-1.5">
                    <button
                      type="submit"
                      disabled={actionLoading}
                      className="flex items-center gap-1 px-4 py-1.5 text-white rounded-lg text-xs font-bold shadow-2xs transition-all disabled:opacity-50 cursor-pointer"
                      style={{ backgroundColor: COLORS.primary }}
                    >
                      {actionLoading ? (
                        <>
                          <Loader2 className="w-3 h-3 animate-spin" />
                          <span>محفوظ ہو رہا ہے...</span>
                        </>
                      ) : (
                        <>
                          <Save className="w-3 h-3" style={{ color: COLORS.secondary }} />
                          <span>{isPublic ? 'جواب محفوظ اور پبلک کریں' : 'جواب محفوظ کریں (پرائیویٹ)'}</span>
                        </>
                      )}
                    </button>
                    <button
                      type="button"
                      onClick={closeAnswerModal}
                      className="px-3 py-1.5 border border-[#D8CDBF] rounded-lg text-xs font-bold text-slate-600 hover:bg-slate-50 transition-colors cursor-pointer"
                    >
                      منسوخ
                    </button>
                  </div>

                  {activeQuestion.status === 'pending' && (
                    <button
                      type="button"
                      onClick={(e) => handleReject(activeQuestion, e)}
                      disabled={actionLoading}
                      className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-[11px] font-bold bg-rose-50 text-rose-700 border border-rose-200 hover:bg-rose-100 transition-colors disabled:opacity-50 cursor-pointer"
                    >
                      <ThumbsDown className="w-3 h-3" />
                      <span>مسترد کریں</span>
                    </button>
                  )}
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      <ConfirmationBox
        isOpen={showDeleteModal}
        onClose={() => {
          setShowDeleteModal(false);
          setDeleteTargetId(null);
        }}
        onConfirm={handleConfirmDelete}
        title="سوال حذف کرنے کی تصدیق"
        message="کیا آپ واقعی اس سوال کو حذف کرنا چاہتے ہیں؟"
        type="danger"
        confirmText="ہاں، حذف کریں"
        cancelText="منسوخ کریں"
      />

      {/* Error Alert Modal */}
      <ConfirmationBox
        isOpen={errorModal.isOpen}
        onClose={() => setErrorModal({ isOpen: false, message: '' })}
        title="خرابی"
        message={errorModal.message}
        type="danger"
        confirmText="ٹھیک ہے"
        showCancel={false}
      />
    </div>
  );
}