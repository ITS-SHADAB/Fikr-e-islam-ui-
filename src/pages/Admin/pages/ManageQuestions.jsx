import React, { useEffect, useState, useRef, useMemo } from 'react';
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
  Plus,
  ChevronDown,
  Check,
  Tag,
} from 'lucide-react';
import toast from 'react-hot-toast';
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
import { Table, ConfirmationBox, RichTextEditor } from '@/components';
import { COLORS } from '@/utils/themeColors';
import { useCategories } from '@/hooks/useCategories';
import {
  CATEGORY_MAP,
  FATWA_CATEGORY_TRANSLATIONS as categoryTranslations,
  QA_CATEGORIES,
  QA_TRANSLATIONS,
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

/* ── Category Combobox with Search, Autocomplete & Create New Option ── */
function CategoryCombobox({
  value,
  onChange,
  categories = [],
  loading = false,
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [highlightedIndex, setHighlightedIndex] = useState(-1);
  const containerRef = useRef(null);
  const inputRef = useRef(null);

  // Close dropdown on click outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (containerRef.current && !containerRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const normalize = (s) => (s || '').trim().replace(/\s+/g, ' ').toLowerCase();

  const cleanQuery = query.trim();
  const normQuery = normalize(cleanQuery);

  const filteredCategories = useMemo(() => {
    if (!normQuery) return categories;
    return categories.filter((c) => {
      const val = normalize(c.value || c.name);
      const ur = normalize(c.labelUr);
      const en = normalize(c.labelEn);
      return val.includes(normQuery) || ur.includes(normQuery) || en.includes(normQuery);
    });
  }, [categories, normQuery]);

  const isExactMatch = useMemo(() => {
    if (!normQuery) return false;
    return categories.some((c) => {
      return (
        normalize(c.value || c.name) === normQuery ||
        normalize(c.labelUr) === normQuery ||
        normalize(c.labelEn) === normQuery
      );
    });
  }, [categories, normQuery]);

  const canCreate = Boolean(normQuery && !isExactMatch);
  const totalOptions = filteredCategories.length + (canCreate ? 1 : 0);

  const handleSelect = (categoryVal) => {
    const clean = (categoryVal || '').trim().replace(/\s+/g, ' ');
    const canonical = QA_TRANSLATIONS[clean] || categoryTranslations[clean] || clean;
    onChange(canonical);
    setQuery('');
    setIsOpen(false);
    setHighlightedIndex(-1);
  };

  const handleKeyDown = (e) => {
    if (!isOpen) {
      if (e.key === 'ArrowDown' || e.key === 'Enter') {
        setIsOpen(true);
        e.preventDefault();
      }
      return;
    }

    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setHighlightedIndex((prev) => (prev + 1) % (totalOptions || 1));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setHighlightedIndex((prev) => (prev - 1 + totalOptions) % (totalOptions || 1));
    } else if (e.key === 'Enter') {
      e.preventDefault();
      if (canCreate && highlightedIndex === 0) {
        handleSelect(cleanQuery);
      } else {
        const catIdx = canCreate ? highlightedIndex - 1 : highlightedIndex;
        if (catIdx >= 0 && catIdx < filteredCategories.length) {
          handleSelect(filteredCategories[catIdx].labelUr || filteredCategories[catIdx].value || filteredCategories[catIdx].name);
        } else if (canCreate) {
          handleSelect(cleanQuery);
        }
      }
    } else if (e.key === 'Escape') {
      setIsOpen(false);
      setHighlightedIndex(-1);
    }
  };

  const currentCategory = useMemo(() => {
    if (!value) return null;
    const normVal = normalize(value);
    return categories.find(
      (c) =>
        normalize(c.value || c.name) === normVal ||
        normalize(c.labelUr) === normVal ||
        normalize(c.name) === normVal
    );
  }, [categories, value]);

  const displayLabel =
    currentCategory?.labelUr ||
    QA_TRANSLATIONS[value] ||
    categoryTranslations[value] ||
    value ||
    '';

  return (
    <div className="relative text-right font-sans" dir="rtl" ref={containerRef}>
      <div
        onClick={() => {
          setIsOpen(!isOpen);
          setTimeout(() => inputRef.current?.focus(), 50);
        }}
        className={`w-full min-h-[48px] flex items-center justify-between gap-3 px-3.5 py-1.5 border rounded-xl bg-white cursor-pointer transition-all ${
          isOpen
            ? 'border-[#4A3728] ring-2 ring-[#4A3728]/15 shadow-sm'
            : 'border-[#D8CDBF] hover:border-slate-400'
        }`}
      >
        <div className="flex items-center gap-2 flex-1 min-w-0 overflow-hidden">
          <Folder className="w-4 h-4 text-slate-400 shrink-0" />
          {value ? (
            <span className="font-['Payami_Nastaleeq',serif] text-[15px] sm:text-[16px] text-slate-900 leading-[2.2] pt-1 block truncate">
              {displayLabel}
            </span>
          ) : (
            <span className="text-slate-400 text-xs">ایک زمرہ منتخب کریں یا تلاش کریں...</span>
          )}
        </div>

        <div className="flex items-center gap-1 shrink-0">
          {value && (
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                onChange('');
                setQuery('');
              }}
              className="p-1 text-slate-400 hover:text-rose-600 rounded-md hover:bg-slate-100 transition-colors cursor-pointer"
              title="زمرہ صاف کریں"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
          <ChevronDown
            className={`w-4 h-4 text-slate-400 transition-transform duration-200 ${
              isOpen ? 'rotate-180 text-[#4A3728]' : ''
            }`}
          />
        </div>
      </div>

      {isOpen && (
        <div className="absolute top-full left-0 right-0 mt-1.5 bg-white border border-[#D8CDBF] rounded-xl shadow-xl z-50 overflow-hidden animate-in fade-in duration-100">
          <div className="p-2.5 border-b border-[#F0EAE1] bg-[#FAF8F5]">
            <div className="relative">
              <input
                ref={inputRef}
                type="text"
                value={query}
                onChange={(e) => {
                  setQuery(e.target.value);
                  setHighlightedIndex(0);
                }}
                onKeyDown={handleKeyDown}
                placeholder="زمرہ تلاش کریں یا نیا زمرہ لکھیں..."
                className="w-full pl-8 pr-3 py-2 text-xs border border-[#D8CDBF] rounded-lg outline-none bg-white focus:border-[#4A3728] focus:ring-1 focus:ring-[#4A3728]/20 text-right font-['Payami_Nastaleeq',serif] text-[14px] leading-normal placeholder:font-sans placeholder:text-slate-400 placeholder:text-xs"
                dir="rtl"
              />
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-3" />
            </div>
          </div>

          <div className="max-h-60 overflow-y-auto p-1.5 space-y-0.5 divide-y divide-slate-50 text-xs">
            {canCreate && (
              <div
                onClick={() => handleSelect(cleanQuery)}
                className={`px-3.5 py-1.5 rounded-lg flex items-center justify-between gap-3 cursor-pointer transition-colors min-h-[46px] ${
                  highlightedIndex === 0
                    ? 'bg-amber-100 text-amber-900 font-bold'
                    : 'bg-amber-50 hover:bg-amber-100 text-amber-900'
                }`}
              >
                <div className="flex items-center gap-2 flex-1 min-w-0">
                  <Plus className="w-4 h-4 text-amber-700 shrink-0" />
                  <span className="text-xs text-amber-800 shrink-0">نیا زمرہ:</span>
                  <span className="font-['Payami_Nastaleeq',serif] text-[15px] sm:text-[16px] leading-[2.2] pt-1 font-bold text-amber-950 truncate underline">
                    "{cleanQuery}"
                  </span>
                </div>
                <span className="text-[10px] bg-amber-200/80 text-amber-900 px-2 py-0.5 rounded-full font-bold shrink-0">
                  + شامل کریں
                </span>
              </div>
            )}

            {filteredCategories.map((cat, idx) => {
              const actualIdx = canCreate ? idx + 1 : idx;
              const isSelected =
                normalize(value) === normalize(cat.value || cat.name) ||
                normalize(value) === normalize(cat.labelUr);
              const isHighlighted = highlightedIndex === actualIdx;
              const label =
                cat.labelUr ||
                QA_TRANSLATIONS[cat.value || cat.name] ||
                categoryTranslations[cat.value || cat.name] ||
                cat.value ||
                cat.name;

              return (
                <div
                  key={cat.value || cat.name || idx}
                  onClick={() => handleSelect(cat.labelUr || cat.value || cat.name)}
                  className={`px-3.5 py-1.5 rounded-lg flex items-center justify-between gap-3 cursor-pointer transition-colors min-h-[46px] ${
                    isHighlighted
                      ? 'bg-[#FAF8F5] text-slate-900'
                      : isSelected
                      ? 'bg-[#4A3728]/10 text-[#4A3728] font-bold'
                      : 'hover:bg-slate-50 text-slate-800'
                  }`}
                >
                  <div className="flex items-center gap-2.5 flex-1 min-w-0">
                    {isSelected ? (
                      <Check className="w-4 h-4 text-[#4A3728] shrink-0" />
                    ) : (
                      <span className="w-4 shrink-0" />
                    )}
                    <span className="font-['Payami_Nastaleeq',serif] text-[15px] sm:text-[16px] leading-[2.2] pt-1 truncate text-slate-900">
                      {label}
                    </span>
                  </div>

                  {typeof cat.count === 'number' && (
                    <span className="text-[11px] px-2 py-0.5 rounded-full bg-slate-100 text-slate-600 font-mono shrink-0 border border-slate-200">
                      {cat.count}
                    </span>
                  )}
                </div>
              );
            })}

            {filteredCategories.length === 0 && !canCreate && (
              <div className="py-5 text-center text-slate-400 text-xs">
                {loading ? 'لوڈ ہو رہا ہے...' : 'کوئی زمرہ نہیں ملا'}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

/* ── Status Options Definition ── */
const STATUS_OPTIONS = [
  { key: 'answered', label: 'جواب شدہ (Answered)', desc: 'مفتی صاحب کا جواب درج ہو گیا', cls: 'border-emerald-300 text-emerald-800 bg-emerald-50' },
  { key: 'approved', label: 'منظور شدہ (Approved)', desc: 'سوال بغیر جواب کے منظور ہے', cls: 'border-blue-300 text-blue-800 bg-blue-50' },
  { key: 'pending', label: 'زیرِ التوا (Pending)', desc: 'جائزہ یا جواب ابھی باقی ہے', cls: 'border-amber-300 text-amber-800 bg-amber-50' },
  { key: 'rejected', label: 'مسترد (Rejected)', desc: 'غیر متعلق یا نامناسب سوال', cls: 'border-rose-300 text-rose-800 bg-rose-50' },
];

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
  const [selectedStatus, setSelectedStatus] = useState('answered');
  const [isPublic, setIsPublic] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [actionId, setActionId] = useState(null); // Tracks which row action is loading
  const [actionError, setActionError] = useState(null);
  const [success, setSuccess] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');
  const [showUnsavedModal, setShowUnsavedModal] = useState(false);

  // Auto-dismiss timeout ref for error notifications
  const errorTimeoutRef = useRef(null);

  useEffect(() => {
    return () => {
      if (errorTimeoutRef.current) {
        clearTimeout(errorTimeoutRef.current);
      }
    };
  }, []);

  // Notification type error helper (toast + auto-dismissing modal banner)
  const showErrorNotification = (msg) => {
    toast.error(msg, {
      duration: 3500,
      position: 'top-center',
      style: {
        fontFamily: "'Payami Nastaleeq', 'Noto Nastaliq Urdu', serif",
        fontSize: '15px',
        lineHeight: '1.9',
        padding: '10px 18px',
        borderRadius: '12px',
        direction: 'rtl',
      },
    });

    setActionError(msg);
    if (errorTimeoutRef.current) {
      clearTimeout(errorTimeoutRef.current);
    }
    errorTimeoutRef.current = setTimeout(() => {
      setActionError(null);
    }, 3500);
  };

  // Editable question fields (admin can correct before replying)
  const [editableTitle, setEditableTitle] = useState('');
  const [editableDetailedQuestion, setEditableDetailedQuestion] = useState('');

  const {
    categories: dynamicCategories = [],
    loading: categoriesLoading,
    refetch: refetchCategories,
  } = useCategories('question');

  // Combined categories list with normalized deduplication in Urdu (Payami)
  const allCategoriesList = useMemo(() => {
    const normalize = (s) => (s || '').trim().replace(/\s+/g, ' ').toLowerCase();
    const map = new Map();

    // 1. Dynamic categories with real counts from server
    dynamicCategories.forEach((cat) => {
      const rawVal = cat.name || cat.value || '';
      const norm = normalize(rawVal);
      if (norm) {
        const urduLabel = cat.labelUr || QA_TRANSLATIONS[rawVal] || categoryTranslations[rawVal] || rawVal;
        map.set(normalize(urduLabel), {
          value: urduLabel,
          labelUr: urduLabel,
          labelEn: cat.labelEn || rawVal,
          count: typeof cat.count === 'number' ? cat.count : undefined,
        });
      }
    });

    // 2. Default QA_CATEGORIES
    QA_CATEGORIES.forEach((cat) => {
      const urduLabel = cat.labelUr;
      const normUrdu = normalize(urduLabel);
      if (!map.has(normUrdu)) {
        map.set(normUrdu, {
          value: urduLabel,
          labelUr: urduLabel,
          labelEn: cat.labelEn,
          count: undefined,
        });
      }
    });

    // 3. If selectedCategory is set and not yet in map, add it
    if (selectedCategory) {
      const urduLabel = QA_TRANSLATIONS[selectedCategory] || categoryTranslations[selectedCategory] || selectedCategory;
      const normSel = normalize(urduLabel);
      if (!map.has(normSel)) {
        map.set(normSel, {
          value: urduLabel,
          labelUr: urduLabel,
          labelEn: urduLabel,
          count: undefined,
        });
      }
    }

    return Array.from(map.values());
  }, [dynamicCategories, selectedCategory]);

  const categories = allCategoriesList;

  const showSuccess = (msg) => {
    setSuccessMsg(msg);
    setSuccess(true);
    setTimeout(() => setSuccess(false), 3000);
  };

  // Determine if form has unsaved modifications
  const isDirty = useMemo(() => {
    if (!activeQuestion) return false;
    const origTitle = (activeQuestion.questionTitle || '').trim();
    const origDetails = (activeQuestion.detailedQuestion || activeQuestion.question || '').trim();
    const origCat = (activeQuestion.category || '').trim();
    const origAns = (activeQuestion.answerContent || '').trim();
    const origStatus = activeQuestion.status === 'pending' ? 'answered' : (activeQuestion.status || 'answered');
    const origPublic = activeQuestion.isPublic !== undefined ? activeQuestion.isPublic : true;

    return (
      editableTitle.trim() !== origTitle ||
      editableDetailedQuestion.trim() !== origDetails ||
      selectedCategory.trim() !== origCat ||
      answerContent.trim() !== origAns ||
      selectedStatus !== origStatus ||
      isPublic !== origPublic
    );
  }, [activeQuestion, editableTitle, editableDetailedQuestion, selectedCategory, answerContent, selectedStatus, isPublic]);

  // Prevent accidental page close / refresh when form is dirty
  useEffect(() => {
    const handleBeforeUnload = (e) => {
      if (activeQuestion && isDirty) {
        e.preventDefault();
        e.returnValue = '';
      }
    };
    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, [activeQuestion, isDirty]);

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
    const rawCat = q.category || '';
    const canonicalCat = QA_TRANSLATIONS[rawCat] || categoryTranslations[rawCat] || rawCat;
    setSelectedCategory(canonicalCat);
    setSelectedStatus(q.status === 'pending' ? 'answered' : (q.status || 'answered'));
    setIsPublic(q.isPublic !== undefined ? q.isPublic : true);
    if (errorTimeoutRef.current) clearTimeout(errorTimeoutRef.current);
    setActionError(null);
    setEditableTitle(q.questionTitle || '');
    setEditableDetailedQuestion(q.detailedQuestion || q.question || '');
    setShowUnsavedModal(false);
  };

  const handleRequestClose = () => {
    if (isDirty) {
      setShowUnsavedModal(true);
    } else {
      closeAnswerModal(true);
    }
  };

  const closeAnswerModal = (force = false) => {
    if (!force && isDirty) {
      setShowUnsavedModal(true);
      return;
    }
    if (errorTimeoutRef.current) clearTimeout(errorTimeoutRef.current);
    setActiveQuestion(null);
    setAnswerContent('');
    setActionError(null);
    setEditableTitle('');
    setEditableDetailedQuestion('');
    setSelectedCategory('');
    setSelectedStatus('answered');
    setShowUnsavedModal(false);
  };

  const handleResetForm = () => {
    if (!activeQuestion) return;
    setEditableTitle(activeQuestion.questionTitle || '');
    setEditableDetailedQuestion(activeQuestion.detailedQuestion || activeQuestion.question || '');
    const rawCat = activeQuestion.category || '';
    const canonicalCat = QA_TRANSLATIONS[rawCat] || categoryTranslations[rawCat] || rawCat;
    setSelectedCategory(canonicalCat);
    setAnswerContent(activeQuestion.answerContent || '');
    setSelectedStatus(activeQuestion.status === 'pending' ? 'answered' : (activeQuestion.status || 'answered'));
    setIsPublic(activeQuestion.isPublic !== undefined ? activeQuestion.isPublic : true);
    if (errorTimeoutRef.current) clearTimeout(errorTimeoutRef.current);
    setActionError(null);
  };

  // ── Answer Submit ──
  const handleAnswerSubmit = async (e) => {
    e?.preventDefault();
    if (errorTimeoutRef.current) clearTimeout(errorTimeoutRef.current);
    setActionError(null);
    if (!activeQuestion) return;

    const trimmedTitle = editableTitle.trim();
    const trimmedDetails = editableDetailedQuestion.trim();
    const trimmedCategory = selectedCategory.trim();
    const trimmedAnswer = answerContent.trim();
    const plainAnswer = answerContent.replace(/<[^>]*>/g, '').replace(/&nbsp;/g, ' ').trim();

    if (!trimmedTitle) {
      showErrorNotification('براہ کرم سوال کا عنوان درج کریں۔');
      return;
    }
    if (trimmedTitle.length > 150) {
      showErrorNotification('سوال کا عنوان 150 حروف سے زیادہ نہیں ہو سکتا۔');
      return;
    }

    if (!trimmedCategory) {
      showErrorNotification('براہ کرم ایک زمرہ منتخب کریں یا نیا زمرہ بنائیں۔');
      return;
    }

    if (!trimmedDetails) {
      showErrorNotification('براہ کرم تفصیلی سوال درج کریں۔');
      return;
    }
    if (trimmedDetails.length > 5000) {
      showErrorNotification('تفصیلی سوال 5000 حروف سے زیادہ نہیں ہو سکتا۔');
      return;
    }

    if (selectedStatus === 'answered' && !plainAnswer) {
      showErrorNotification('براہ کرم مفتی صاحب کا جواب تحریر کریں۔');
      return;
    }

    try {
      setActionLoading(true);
      const payload = {
        questionTitle: trimmedTitle,
        category: trimmedCategory,
        detailedQuestion: trimmedDetails,
        answerContent: trimmedAnswer,
        status: selectedStatus,
        isPublic: Boolean(isPublic),
      };

      await answerQuestion(activeQuestion._id, payload);

      if (typeof refetchCategories === 'function') {
        try {
          refetchCategories(true);
        } catch (_) {}
      }

      showSuccess('سوال کی معلومات اور جواب کامیابی سے محفوظ ہو گئے۔');
      closeAnswerModal(true);
      loadQuestions(page, statusFilter, categoryFilter, searchTerm);
      loadStats();
    } catch (err) {
      const msg = err.response?.data?.message || err.message || 'جواب محفوظ کرنے میں ناکامی';
      showErrorNotification(msg);
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
      showSuccess('سوال مستقل طور پر حذف کر دیا گیا۔');
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
              className="w-full sm:w-auto border border-[#D8CDBF] rounded-lg px-3 py-1.5 font-['Payami_Nastaleeq',serif] text-[13px] leading-[1.8] outline-none bg-white text-slate-700 focus:border-[#4A3728] text-right cursor-pointer"
              dir="rtl"
            >
              <option value="">تمام زمرے</option>
              {categories.map((cat) => (
                <option key={cat.value} value={cat.value}>
                  {cat.labelUr || cat.labelEn || cat.name}
                  {typeof cat.count === 'number' ? ` (${cat.count})` : ''}
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
                    <div className="max-w-md text-right space-y-1">
                      <div className="flex items-center gap-1.5 flex-wrap">
                        <span
                          className="inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded text-[10px] font-bold shrink-0"
                          style={{
                            backgroundColor: `${COLORS.primary}12`,
                            color: COLORS.primary,
                          }}
                        >
                          <HelpCircle className="w-2.5 h-2.5" />
                          سوال
                        </span>
                        <span className="font-bold font-['Payami_Nastaleeq',serif] text-[14px] sm:text-[15px] leading-[1.9] pt-1 text-slate-900 line-clamp-1 flex-1">
                          {q.questionTitle}
                        </span>
                        {q.isEdited && (
                          <span className="text-[9px] text-amber-700 bg-amber-50 px-1.5 py-0.5 rounded border border-amber-200">
                            ترمیم شدہ
                          </span>
                        )}
                      </div>
                      <p className="text-[12px] font-['Payami_Nastaleeq',serif] leading-[1.8] text-slate-500 line-clamp-1">
                        {q.detailedQuestion || ''}
                      </p>
                    </div>
                  ),
                  tdClassName: 'border-b border-[#F0EAE1] py-2.5 px-3',
                },
                {
                  headData: 'زمرہ',
                  bodyData: (q) => {
                    const categoryName =
                      QA_TRANSLATIONS[q.category] ||
                      categoryTranslations[q.category] ||
                      q.category ||
                      'عام مسائل';
                    return (
                      <span
                        className="inline-flex items-center gap-1.5 font-['Payami_Nastaleeq',serif] text-[13px] sm:text-[14px] leading-[1.9] pt-1 pb-0.5 px-2.5 rounded-lg border whitespace-nowrap"
                        style={{
                          backgroundColor: `${COLORS.secondary}25`,
                          borderColor: COLORS.border,
                          color: COLORS.primary,
                        }}
                      >
                        <Folder className="w-3 h-3 text-slate-400 shrink-0" />
                        <span>{categoryName}</span>
                      </span>
                    );
                  },
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
                          title="مستقل حذف کریں"
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

      {/* ── Production-Level Answer & Question Edit Modal ── */}
      {activeQuestion && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-black/60 backdrop-blur-2xs animate-in fade-in duration-150"
          onClick={handleRequestClose}
        >
          <div
            className="bg-white border border-[#E8E1D9] rounded-2xl shadow-2xl w-full max-w-3xl max-h-[92vh] overflow-y-auto text-right text-xs flex flex-col"
            dir="rtl"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="p-4 border-b border-[#F0EAE1] bg-[#FAF8F5] flex items-center justify-between sticky top-0 z-20 rounded-t-2xl">
              <div className="flex items-center gap-2.5">
                <div
                  className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0"
                  style={{ backgroundColor: `${COLORS.primary}15`, color: COLORS.primary }}
                >
                  <MessageSquare className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="font-bold text-sm sm:text-base text-slate-900 font-['Payami_Nastaleeq',serif] leading-[1.8]">
                    شرعی سوال کا جواب اور تدوین (Question & Answer Workflow)
                  </h3>
                  <div className="flex items-center gap-2 text-[10px] text-slate-500 mt-0.5">
                    <StatusBadge status={activeQuestion.status} isDeleted={activeQuestion.isDeleted} />
                    {activeQuestion.answeredBy?.name && (
                      <span className="text-slate-400">
                        مفتی: <strong className="text-slate-600 font-semibold">{activeQuestion.answeredBy.name}</strong>
                      </span>
                    )}
                    {isDirty && (
                      <span className="text-[9px] font-bold text-amber-700 bg-amber-50 px-1.5 py-0.2 rounded border border-amber-200">
                        غیر محفوظ ترامیم موجود ہیں
                      </span>
                    )}
                  </div>
                </div>
              </div>

              <button
                type="button"
                onClick={handleRequestClose}
                className="p-1.5 text-slate-400 hover:text-slate-700 rounded-lg hover:bg-slate-200 transition-colors cursor-pointer"
                title="بند کریں"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Modal Content */}
            <form onSubmit={handleAnswerSubmit} className="p-4 sm:p-5 space-y-4 text-right font-sans" dir="rtl">
              {actionError && (
                <div className="bg-rose-50 border border-rose-200 text-rose-800 p-3.5 rounded-xl text-xs sm:text-sm flex items-center justify-between gap-3 shadow-md animate-in fade-in slide-in-from-top-2 duration-200">
                  <div className="flex items-center gap-2.5 flex-1 min-w-0">
                    <AlertTriangle className="w-4 h-4 text-rose-600 shrink-0" />
                    <span className="font-['Payami_Nastaleeq',serif] text-[14px] sm:text-[15px] leading-[1.9] pt-1 text-rose-900 truncate">
                      {actionError}
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      setActionError(null);
                      if (errorTimeoutRef.current) clearTimeout(errorTimeoutRef.current);
                    }}
                    className="p-1 text-rose-400 hover:text-rose-700 rounded-md hover:bg-rose-100 transition-colors cursor-pointer shrink-0"
                    title="بند کریں"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                </div>
              )}

              {/* Asker Details Card */}
              <div className="bg-[#FAF8F5] border border-[#E8E1D9] rounded-xl p-3 text-[11px] grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 text-slate-600">
                <div>
                  <span className="text-[10px] text-slate-400 block font-bold mb-0.5">سائل کا نام:</span>
                  <span className="font-bold text-slate-800 flex items-center gap-1">
                    <User className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                    {activeQuestion.fullName || activeQuestion.user?.name || 'نامعلوم سائل'}
                  </span>
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 block font-bold mb-0.5">رابطہ / فون:</span>
                  <span className="text-slate-700 flex items-center gap-1 font-mono">
                    <Phone className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                    {activeQuestion.contactPhone || activeQuestion.user?.loginPhone || activeQuestion.user?.contactPhone || '—'}
                  </span>
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 block font-bold mb-0.5">ای میل:</span>
                  <span className="text-slate-700 flex items-center gap-1 truncate font-mono">
                    <Mail className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                    {activeQuestion.email || activeQuestion.user?.loginEmail || activeQuestion.user?.email || '—'}
                  </span>
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 block font-bold mb-0.5">تاریخ سوال:</span>
                  <span className="text-slate-700 flex items-center gap-1">
                    <Calendar className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                    {activeQuestion.createdAt ? new Date(activeQuestion.createdAt).toLocaleDateString('ur-PK') : '—'}
                  </span>
                </div>
              </div>

              {/* ── SECTION 1: QUESTION ── */}
              <div className="bg-white border border-[#E8E1D9] rounded-xl p-4 space-y-3.5 shadow-2xs">
                <div className="flex items-center justify-between pb-2 border-b border-[#F0EAE1]">
                  <div className="flex items-center gap-2">
                    <div
                      className="w-6 h-6 rounded-md flex items-center justify-center text-xs font-bold"
                      style={{ backgroundColor: `${COLORS.primary}12`, color: COLORS.primary }}
                    >
                      1
                    </div>
                    <h4 className="font-bold text-xs sm:text-sm text-slate-900 font-['Payami_Nastaleeq',serif] leading-[1.8]">
                      سوال کی تفصیلات (Question Details)
                    </h4>
                  </div>
                  <span className="text-[10px] text-slate-400 flex items-center gap-1">
                    <Edit3 className="w-3 h-3 text-slate-400" />
                    ضرورت پڑنے پر سوال کی تصحیح کریں
                  </span>
                </div>

                {/* Title & Category Grid */}
                <div className="grid grid-cols-1 md:grid-cols-12 gap-3.5">
                  {/* Title */}
                  <div className="md:col-span-7 space-y-1">
                    <div className="flex items-center justify-between">
                      <label className="text-[11px] font-bold text-slate-700 flex items-center gap-1">
                        <HelpCircle className="w-3.5 h-3.5 text-slate-400" />
                        عنوانِ سوال *
                      </label>
                      <span className={`text-[10px] font-mono ${editableTitle.length > 140 ? 'text-amber-600 font-bold' : 'text-slate-400'}`}>
                        {editableTitle.length}/150
                      </span>
                    </div>
                    <input
                      type="text"
                      value={editableTitle}
                      maxLength={150}
                      onChange={(e) => setEditableTitle(e.target.value)}
                      required
                      placeholder="شرعی سوال کا عنوان درج کریں..."
                      className="w-full border border-[#D8CDBF] rounded-lg px-3 py-2 outline-none focus:border-[#4A3728] focus:ring-1 focus:ring-[#4A3728]/20 text-right bg-white transition-colors font-['Payami_Nastaleeq',serif] text-[15px] leading-[2] pt-1.5 pb-1 min-h-[44px]"
                      dir="rtl"
                    />
                  </div>

                  {/* Category Combobox */}
                  <div className="md:col-span-5 space-y-1">
                    <div className="flex items-center justify-between">
                      <label className="text-[11px] font-bold text-slate-700 flex items-center gap-1">
                        <Folder className="w-3.5 h-3.5 text-slate-400" />
                        زمرہ (Category) *
                      </label>
                      {categoriesLoading && (
                        <span className="text-[10px] text-slate-400 flex items-center gap-1">
                          <Loader2 className="w-2.5 h-2.5 animate-spin" />
                          لوڈ ہو رہا ہے...
                        </span>
                      )}
                    </div>
                    <CategoryCombobox
                      value={selectedCategory}
                      onChange={setSelectedCategory}
                      categories={allCategoriesList}
                      loading={categoriesLoading}
                    />
                  </div>
                </div>

                {/* Detailed Question Textarea */}
                <div className="space-y-1">
                  <div className="flex items-center justify-between">
                    <label className="text-[11px] font-bold text-slate-700 flex items-center gap-1">
                      <MessageSquare className="w-3.5 h-3.5 text-slate-400" />
                      تفصیلی سوال کا متن *
                    </label>
                    <span className={`text-[10px] font-mono ${editableDetailedQuestion.length > 4800 ? 'text-amber-600 font-bold' : 'text-slate-400'}`}>
                      {editableDetailedQuestion.length}/5000
                    </span>
                  </div>
                  <textarea
                    rows={4}
                    maxLength={5000}
                    value={editableDetailedQuestion}
                    onChange={(e) => setEditableDetailedQuestion(e.target.value)}
                    required
                    placeholder="سائل کا تفصیلی سوال..."
                    className="w-full border border-[#D8CDBF] rounded-lg p-3 outline-none focus:border-[#4A3728] focus:ring-1 focus:ring-[#4A3728]/20 text-right bg-white transition-colors resize-y font-['Payami_Nastaleeq',serif] text-[14px] sm:text-[15px] leading-[2.2]"
                    dir="rtl"
                  />
                </div>
              </div>

              {/* ── SECTION 2: ANSWER ── */}
              <div className="bg-white border border-[#E8E1D9] rounded-xl p-4 space-y-3 shadow-2xs">
                <div className="flex items-center justify-between pb-2 border-b border-[#F0EAE1]">
                  <div className="flex items-center gap-2">
                    <div
                      className="w-6 h-6 rounded-md flex items-center justify-center text-xs font-bold"
                      style={{ backgroundColor: `${COLORS.accent}20`, color: COLORS.accent }}
                    >
                      2
                    </div>
                    <h4 className="font-bold text-xs sm:text-sm text-slate-900 font-['Payami_Nastaleeq',serif] leading-[1.8]">
                      مفتی صاحب کا شرعی جواب (Mufti Answer Content)
                    </h4>
                  </div>
                  <div className="flex items-center gap-1.5 text-[10px] text-slate-500">
                    <Building2 className="w-3 h-3 text-slate-400" />
                    <span>دار الافتاء و تحقیق</span>
                    <span className="text-slate-300">|</span>
                    <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                    <span className="text-emerald-700 font-bold">مصدقہ فتویٰ</span>
                  </div>
                </div>

                <div>
                  <RichTextEditor
                    value={answerContent}
                    onChange={setAnswerContent}
                    placeholder="الجواب وباللہ التوفیق: شرعی حکم، دلائل اور تفصیلی جواب یہاں تحریر کریں..."
                  />
                </div>
              </div>

              {/* ── SECTION 3: PUBLISHING & STATUS ── */}
              <div className="bg-white border border-[#E8E1D9] rounded-xl p-4 space-y-3.5 shadow-2xs">
                <div className="flex items-center gap-2 pb-2 border-b border-[#F0EAE1]">
                  <div className="w-6 h-6 rounded-md flex items-center justify-center text-xs font-bold bg-purple-50 text-purple-700">
                    3
                  </div>
                  <h4 className="font-bold text-xs sm:text-sm text-slate-900 font-['Payami_Nastaleeq',serif] leading-[1.8]">
                    حیثیت اور اشاعت (Status & Visibility)
                  </h4>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-12 gap-3.5 items-start">
                  {/* Status Selection Pills */}
                  <div className="md:col-span-7 space-y-1.5">
                    <label className="text-[11px] font-bold text-slate-700 block">
                      سوال کی حیثیت (Question Status)
                    </label>
                    <div className="grid grid-cols-2 gap-2">
                      {STATUS_OPTIONS.map((st) => {
                        const isSelected = selectedStatus === st.key;
                        return (
                          <button
                            key={st.key}
                            type="button"
                            onClick={() => setSelectedStatus(st.key)}
                            className={`p-2.5 rounded-lg border text-right transition-all flex flex-col gap-0.5 cursor-pointer ${
                              isSelected
                                ? `${st.cls} ring-2 ring-offset-1 ring-[#4A3728]/30 font-bold shadow-2xs`
                                : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
                            }`}
                          >
                            <div className="flex items-center justify-between w-full">
                              <span className="text-[12px] font-['Payami_Nastaleeq',serif] leading-[1.8]">
                                {st.label}
                              </span>
                              {isSelected && <Check className="w-3 h-3 shrink-0" />}
                            </div>
                            <span className="text-[9px] text-slate-500 font-normal">
                              {st.desc}
                            </span>
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Public Visibility Toggle Card */}
                  <div className="md:col-span-5 space-y-1.5">
                    <label className="text-[11px] font-bold text-slate-700 block">
                      عوامی نمائش (Public Visibility)
                    </label>
                    <div
                      onClick={() => setIsPublic(!isPublic)}
                      className={`p-3 rounded-lg border cursor-pointer transition-all ${
                        isPublic
                          ? 'bg-purple-50/70 border-purple-300 text-purple-900 shadow-2xs'
                          : 'bg-slate-50 border-slate-200 text-slate-700'
                      }`}
                    >
                      <div className="flex items-center gap-2 mb-1">
                        <input
                          type="checkbox"
                          id="isPublicToggle"
                          checked={isPublic}
                          onChange={(e) => setIsPublic(e.target.checked)}
                          onClick={(e) => e.stopPropagation()}
                          className="w-4 h-4 text-[#4A3728] rounded border-gray-300 focus:ring-[#4A3728] cursor-pointer"
                        />
                        <label
                          htmlFor="isPublicToggle"
                          className="text-[11px] font-bold cursor-pointer select-none flex items-center gap-1.5"
                        >
                          {isPublic ? (
                            <>
                              <Globe className="w-3.5 h-3.5 text-purple-600 shrink-0" />
                              <span>عوامی صفحے پر شائع کریں (Public)</span>
                            </>
                          ) : (
                            <>
                              <Lock className="w-3.5 h-3.5 text-slate-500 shrink-0" />
                              <span>نجی رکھیں (Private)</span>
                            </>
                          )}
                        </label>
                      </div>
                      <p className="text-[10px] leading-relaxed text-slate-500 pr-6">
                        {isPublic
                          ? '✓ سوال و جواب عام قارئین کے لیے عوامی ویب سائٹ اور گلوبل سرچ میں شامل ہو جائے گا۔'
                          : '🔒 سوال و جواب صرف سائل اپنے اکاؤنٹ سے دیکھ سکے گا، عوامی سرچ میں نہیں آئے گا۔'}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* ── SECTION 4: ACTIONS ── */}
              <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-[#F0EAE1]">
                <div className="flex items-center gap-2">
                  {/* Submit Button */}
                  <button
                    type="submit"
                    disabled={actionLoading}
                    className="flex items-center gap-1.5 px-5 py-2 text-white rounded-lg text-xs font-bold shadow-2xs transition-all disabled:opacity-50 cursor-pointer"
                    style={{ backgroundColor: COLORS.primary }}
                  >
                    {actionLoading ? (
                      <>
                        <Loader2 className="w-3.5 h-3.5 animate-spin" />
                        <span>محفوظ ہو رہا ہے...</span>
                      </>
                    ) : (
                      <>
                        <Save className="w-3.5 h-3.5" style={{ color: COLORS.secondary }} />
                        <span>محفوظ اور اپڈیٹ کریں (Answer & Update)</span>
                      </>
                    )}
                  </button>

                  {/* Reset Button */}
                  <button
                    type="button"
                    onClick={handleResetForm}
                    disabled={!isDirty || actionLoading}
                    className="inline-flex items-center gap-1 px-3 py-2 border border-[#D8CDBF] rounded-lg text-xs font-bold text-slate-600 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                    title="تمام تبدیلیاں منسوخ کر کے اصل حالت بحال کریں"
                  >
                    <RotateCcw className="w-3.5 h-3.5 text-slate-400" />
                    <span>ری سیٹ (Reset)</span>
                  </button>

                  {/* Cancel Button */}
                  <button
                    type="button"
                    onClick={handleRequestClose}
                    disabled={actionLoading}
                    className="px-3.5 py-2 border border-slate-200 rounded-lg text-xs font-bold text-slate-600 hover:bg-slate-100 transition-colors cursor-pointer"
                  >
                    منسوخ
                  </button>
                </div>

                {/* Quick Reject Button if Pending */}
                {activeQuestion.status === 'pending' && (
                  <button
                    type="button"
                    onClick={(e) => handleReject(activeQuestion, e)}
                    disabled={actionLoading}
                    className="inline-flex items-center gap-1 px-3 py-2 rounded-lg text-xs font-bold bg-rose-50 text-rose-700 border border-rose-200 hover:bg-rose-100 transition-colors disabled:opacity-50 cursor-pointer"
                  >
                    <ThumbsDown className="w-3.5 h-3.5" />
                    <span>سوال مسترد کریں (Reject)</span>
                  </button>
                )}
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Unsaved Changes Confirmation Modal */}
      <ConfirmationBox
        isOpen={showUnsavedModal}
        onClose={() => setShowUnsavedModal(false)}
        onConfirm={() => {
          setShowUnsavedModal(false);
          closeAnswerModal(true);
        }}
        title="غیر محفوظ تبدیلیاں"
        message="آپ نے فارم میں ترامیم کی ہیں جو ابھی تک محفوظ نہیں ہوئیں۔ کیا آپ واقعی ان تبدیلیوں کو ضائع کر کے ونڈو بند کرنا چاہتے ہیں؟"
        type="warning"
        confirmText="ہاں، تبدیلیاں ضائع کریں"
        cancelText="واپس فارم پر جائیں"
      />

      {/* Delete Confirmation Modal */}
      <ConfirmationBox
        isOpen={showDeleteModal}
        onClose={() => {
          setShowDeleteModal(false);
          setDeleteTargetId(null);
        }}
        onConfirm={handleConfirmDelete}
        title="مستقل حذف کی تصدیق"
        message="کیا آپ واقعی اس سوال کو مستقل طور پر ڈیٹا بیس سے حذف کرنا چاہتے ہیں؟ یہ عمل ناقابلِ واپسی ہے اور سوال دوبارہ بحال نہیں کیا جا سکے گا۔"
        type="danger"
        confirmText="ہاں، مستقل حذف کریں"
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