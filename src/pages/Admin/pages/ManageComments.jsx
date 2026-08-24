import React, { useEffect, useState, useCallback } from 'react';
import { Link } from 'react-router-dom';
import {
  MessageSquare,
  CheckCircle,
  Clock,
  Trash2,
  RotateCcw,
  Search,
  RefreshCw,
  ArrowRight,
  ShieldCheck,
  BarChart3,
  MessageCircle,
  ChevronLeft,
  ChevronRight,
  X,
  BookOpen,
  FileText,
  HelpCircle,
  User,
  Calendar,
  ExternalLink,
  Filter,
} from 'lucide-react';
import {
  getAllAdminComments,
  getCommentStats,
  approveAdminComment,
  restoreAdminComment,
  deleteComment,
} from '@/services';
import { COLORS } from '@/utils/themeColors';
import { ConfirmationBox } from '@/components';
import toast from 'react-hot-toast';

/* ─────────────────────────────────────────
   Stat Metric Card
───────────────────────────────────────── */
function MetricCard({ label, value, icon: Icon, color, bg, border, highlight }) {
  return (
    <div
      style={{
        backgroundColor: '#ffffff',
        borderColor: border || '#e5e7eb',
      }}
      className="relative rounded-2xl border p-4 sm:p-5 shadow-xs hover:shadow-md transition-all duration-200 overflow-hidden flex items-center justify-between gap-3 group"
    >
      {/* Soft Background Accent Glow */}
      <div
        style={{ backgroundColor: bg }}
        className="absolute -top-6 -right-6 w-20 h-20 rounded-full opacity-30 group-hover:scale-125 transition-transform duration-300 pointer-events-none"
      />

      <div className="flex items-center gap-3.5 z-10">
        <div
          style={{ backgroundColor: bg, color }}
          className="w-12 h-12 rounded-xl flex items-center justify-center shrink-0 shadow-2xs group-hover:scale-105 transition-transform"
        >
          <Icon className="w-5 h-5" />
        </div>
        <div className="text-right" dir="rtl">
          <p className="text-2xl sm:text-3xl font-extrabold text-slate-800 leading-none tracking-tight">
            {value !== undefined && value !== null ? value : '--'}
          </p>
          <p className="text-xs font-semibold text-slate-500 mt-1">{label}</p>
        </div>
      </div>

      {highlight && (
        <span className="relative flex h-2.5 w-2.5 me-1">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75" />
          <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-amber-500" />
        </span>
      )}
    </div>
  );
}

/* ─────────────────────────────────────────
   Status Badges
───────────────────────────────────────── */
function StatusBadge({ cmt }) {
  if (cmt.isDeleted) {
    return (
      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-rose-50 text-rose-700 border border-rose-200">
        <Trash2 className="w-3 h-3" />
        <span>حذف شدہ</span>
      </span>
    );
  }
  if (!cmt.isApproved) {
    return (
      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-amber-50 text-amber-800 border border-amber-200">
        <Clock className="w-3 h-3 text-amber-600" />
        <span>زیرِ جائزہ</span>
      </span>
    );
  }
  return (
    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
      <CheckCircle className="w-3 h-3 text-emerald-600" />
      <span>منظور شدہ</span>
    </span>
  );
}

/* ─────────────────────────────────────────
   Content Type Badge
───────────────────────────────────────── */
function TypeBadge({ type }) {
  const map = {
    article: { label: 'مضمون', icon: FileText, color: '#4f46e5', bg: '#eef2ff', border: '#c7d2fe' },
    book: { label: 'کتاب', icon: BookOpen, color: '#0891b2', bg: '#ecfeff', border: '#a5f3fc' },
    fatwa: { label: 'فتویٰ', icon: HelpCircle, color: '#b45309', bg: '#fef3c7', border: '#fde68a' },
  };
  const cfg = map[type] || { label: type || 'مواد', icon: MessageCircle, color: '#64748b', bg: '#f1f5f9', border: '#e2e8f0' };
  const Icon = cfg.icon;

  return (
    <span
      style={{ backgroundColor: cfg.bg, color: cfg.color, borderColor: cfg.border }}
      className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10.5px] font-bold border"
    >
      <Icon className="w-3 h-3" />
      <span>{cfg.label}</span>
    </span>
  );
}

/* ─────────────────────────────────────────
   User Avatar
───────────────────────────────────────── */
function UserAvatarBadge({ user }) {
  const name = user?.name || 'صارف';
  const initial = name.trim().charAt(0).toUpperCase() || 'U';
  const imgUrl = typeof user?.profileImage === 'string' ? user.profileImage : user?.profileImage?.url;

  if (imgUrl) {
    return (
      <img
        src={imgUrl}
        alt={name}
        className="w-10 h-10 rounded-xl object-cover shrink-0 ring-2 ring-stone-200 shadow-2xs"
      />
    );
  }

  return (
    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#7B4A2D] to-[#964718] flex items-center justify-center text-white text-sm font-black shrink-0 shadow-2xs">
      {initial}
    </div>
  );
}

/* ─────────────────────────────────────────
   Urdu Date & Time Formatter
───────────────────────────────────────── */
const URDU_MONTHS = [
  'جنوری', 'فروری', 'مارچ', 'اپریل', 'مئی', 'جون',
  'جولائی', 'اگست', 'ستمبر', 'اکتوبر', 'نومبر', 'دسمبر'
];

function formatUrduDateTime(dateStr) {
  if (!dateStr) return '--';
  const d = new Date(dateStr);
  const day = d.getDate();
  const month = URDU_MONTHS[d.getMonth()];
  const year = d.getFullYear();
  let hours = d.getHours();
  const minutes = d.getMinutes().toString().padStart(2, '0');
  const period = hours >= 12 ? 'شام' : 'صبح';
  hours = hours % 12 || 12;

  return `${day} ${month} ${year} • ${hours}:${minutes} ${period}`;
}

const STATUS_FILTERS = [
  { key: 'all', label: 'تمام تبصرے' },
  { key: 'pending', label: 'زیرِ جائزہ' },
  { key: 'approved', label: 'منظور شدہ' },
  { key: 'deleted', label: 'حذف شدہ' },
];

const CONTENT_FILTERS = [
  { key: 'all', label: 'تمام مواد' },
  { key: 'book', label: 'کتب' },
  { key: 'article', label: 'مضامین' },
  { key: 'fatwa', label: 'فتاویٰ' },
];

/* ─────────────────────────────────────────
   Main Component: ManageComments
───────────────────────────────────────── */
export default function ManageComments() {
  const [comments, setComments] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [status, setStatus] = useState('all');
  const [contentTypeFilter, setContentTypeFilter] = useState('all');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const [search, setSearch] = useState('');
  const [expandedTextIds, setExpandedTextIds] = useState({});

  // Confirmation box state
  const [confirmBox, setConfirmBox] = useState({ open: false, commentId: null, text: '' });
  const [isActionLoading, setIsActionLoading] = useState(false);
  const LIMIT = 15;

  const fetchStats = useCallback(async () => {
    try {
      const res = await getCommentStats();
      setStats(res.stats || null);
    } catch {
      // silent
    }
  }, []);

  const fetchComments = useCallback(async () => {
    try {
      setLoading(true);
      const res = await getAllAdminComments({ status, page, limit: LIMIT });
      setComments(res.comments || []);
      setTotalPages(res.totalPages || 1);
      setTotalCount(res.totalComments || 0);
    } catch (err) {
      toast.error(err?.response?.data?.message || 'تبصرے لوڈ کرنے میں ناکامی');
    } finally {
      setLoading(false);
    }
  }, [status, page]);

  useEffect(() => {
    fetchStats();
  }, [fetchStats]);

  useEffect(() => {
    setPage(1);
  }, [status, contentTypeFilter]);

  useEffect(() => {
    fetchComments();
  }, [fetchComments]);

  // Filter by search and content type
  const displayedComments = comments.filter((c) => {
    const matchesSearch =
      !search.trim() ||
      c.text?.toLowerCase().includes(search.toLowerCase()) ||
      c.user?.name?.toLowerCase().includes(search.toLowerCase()) ||
      String(c.contentId)?.toLowerCase().includes(search.toLowerCase());

    const matchesType =
      contentTypeFilter === 'all' || c.contentType === contentTypeFilter;

    return matchesSearch && matchesType;
  });

  const handleApprove = async (id) => {
    try {
      await approveAdminComment(id);
      toast.success('تبصرہ منظور کر دیا گیا');
      fetchComments();
      fetchStats();
    } catch (err) {
      toast.error(err?.response?.data?.message || 'منظوری میں ناکامی');
    }
  };

  const handleRestore = async (id) => {
    try {
      await restoreAdminComment(id);
      toast.success('تبصرہ بحال کر دیا گیا');
      fetchComments();
      fetchStats();
    } catch (err) {
      toast.error(err?.response?.data?.message || 'بحالی میں ناکامی');
    }
  };

  const handleDelete = async () => {
    if (!confirmBox.commentId) return;
    try {
      setIsActionLoading(true);
      await deleteComment(confirmBox.commentId);
      toast.success('تبصرہ حذف کر دیا گیا');
      setConfirmBox({ open: false, commentId: null, text: '' });
      fetchComments();
      fetchStats();
    } catch (err) {
      toast.error(err?.response?.data?.message || 'حذف کرنے میں ناکامی');
    } finally {
      setIsActionLoading(false);
    }
  };

  const toggleExpandText = (id) => {
    setExpandedTextIds((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  return (
    <div className="min-h-screen bg-[#f8f9fa] p-4 sm:p-6 lg:p-8 font-sans text-slate-800" dir="rtl">
      {/* ── Top Header ── */}
      <div className="flex items-center justify-between flex-wrap gap-4 mb-6 bg-white p-5 rounded-2xl border border-stone-200/80 shadow-xs">
        <div className="flex items-center gap-3.5">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-[#7B4A2D] to-[#B85D3B] flex items-center justify-center text-white shadow-md">
            <MessageSquare className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl sm:text-2xl font-black text-slate-900 leading-none">
                تبصرہ جات کا انتظام
              </h1>
              <span className="px-2.5 py-0.5 rounded-full bg-stone-100 text-stone-700 text-xs font-bold border border-stone-200">
                {totalCount} کل تبصرے
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-1">
              ویب سائٹ کے تمام مواد پر موصولہ تبصروں کا جائزہ لیں، منظوری دیں یا حذف کریں
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => {
              fetchComments();
              fetchStats();
            }}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold bg-white border border-stone-300 text-slate-700 hover:bg-stone-50 cursor-pointer shadow-2xs transition-all active:scale-95"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin text-[#7B4A2D]' : ''}`} />
            <span>تازہ کریں</span>
          </button>
          <Link
            to="/admin/dashboard"
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold bg-[#7B4A2D] text-white hover:bg-[#683e25] shadow-2xs transition-all active:scale-95"
          >
            <ArrowRight className="w-3.5 h-3.5" />
            <span>ڈیش بورڈ</span>
          </Link>
        </div>
      </div>

      {/* ── Stats Metric Cards ── */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3.5 sm:gap-4 mb-6">
        <MetricCard
          label="کل تبصرے"
          value={stats?.totalComments}
          icon={MessageSquare}
          color="#7B4A2D"
          bg="#faeee8"
          border="#f0d3c7"
        />
        <MetricCard
          label="زیرِ جائزہ (Review)"
          value={stats?.pendingComments}
          icon={Clock}
          color="#d97706"
          bg="#fef3c7"
          border="#fde68a"
          highlight={Boolean(stats?.pendingComments > 0)}
        />
        <MetricCard
          label="منظور شدہ (Approved)"
          value={stats?.approvedComments}
          icon={CheckCircle}
          color="#16a34a"
          bg="#dcfce7"
          border="#bbf7d0"
        />
        <MetricCard
          label="حذف شدہ (Deleted)"
          value={stats?.deletedComments}
          icon={Trash2}
          color="#e11d48"
          bg="#ffe4e6"
          border="#fecdd3"
        />
      </div>

      {/* ── Filter Bar & Smart Search ── */}
      <div className="bg-white rounded-2xl border border-stone-200/80 shadow-xs p-4 mb-6 space-y-3 sm:space-y-0 sm:flex sm:items-center sm:justify-between sm:gap-3 flex-wrap">
        {/* Status Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0 scrollbar-none">
          {STATUS_FILTERS.map((f) => {
            const isActive = status === f.key;
            return (
              <button
                key={f.key}
                type="button"
                onClick={() => setStatus(f.key)}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap select-none ${
                  isActive
                    ? 'bg-[#7B4A2D] text-white shadow-xs'
                    : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
                }`}
              >
                {f.label}
              </button>
            );
          })}
        </div>

        {/* Content Type Filter + Search */}
        <div className="flex items-center gap-2.5 flex-1 max-w-lg w-full">
          {/* Content Filter Dropdown */}
          <div className="relative shrink-0">
            <select
              value={contentTypeFilter}
              onChange={(e) => setContentTypeFilter(e.target.value)}
              className="bg-stone-100 border border-stone-300 text-xs font-bold text-slate-700 rounded-xl px-3 py-2 outline-none cursor-pointer hover:bg-stone-200/70"
            >
              {CONTENT_FILTERS.map((cf) => (
                <option key={cf.key} value={cf.key}>
                  {cf.label}
                </option>
              ))}
            </select>
          </div>

          {/* Search Box */}
          <div className="relative flex-1 min-w-0">
            <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-400" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="متن، صارف یا مواد سے تلاش کریں..."
              className="w-full pl-8 pr-9 py-2 rounded-xl border border-stone-300 text-xs sm:text-sm bg-stone-50/70 outline-none focus:bg-white focus:border-[#7B4A2D] focus:ring-1 focus:ring-[#7B4A2D]/20 transition-all placeholder:text-stone-400"
              dir="rtl"
            />
            {search && (
              <button
                type="button"
                onClick={() => setSearch('')}
                className="absolute left-2.5 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-700 cursor-pointer p-0.5"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </div>
      </div>

      {/* ── Comments List ── */}
      <div className="bg-white rounded-2xl border border-stone-200/80 shadow-xs overflow-hidden mb-6">
        {loading ? (
          <div className="flex flex-col items-center justify-center py-20 gap-3">
            <div className="animate-spin rounded-full h-8 w-8 border-2 border-[#7B4A2D] border-t-transparent" />
            <span className="text-xs font-bold text-stone-500">تبصرے لوڈ ہو رہے ہیں...</span>
          </div>
        ) : displayedComments.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 gap-3 text-center p-6">
            <div className="w-16 h-16 rounded-full bg-stone-100 flex items-center justify-center text-stone-400">
              <MessageSquare className="w-8 h-8" />
            </div>
            <div>
              <p className="text-base font-bold text-slate-800">کوئی تبصرہ نہیں ملا</p>
              <p className="text-xs text-stone-500 mt-0.5">
                منتخب شدہ فلٹرز کے مطابق کوئی تبصرہ موجود نہیں ہے۔
              </p>
            </div>
          </div>
        ) : (
          <div className="divide-y divide-stone-100">
            {displayedComments.map((cmt) => {
              const isTextExpanded = Boolean(expandedTextIds[cmt._id]);
              const isReply = Boolean(cmt.parentComment);
              const textLength = cmt.text?.length || 0;
              const isLongText = textLength > 180;

              return (
                <div
                  key={cmt._id}
                  className="p-4 sm:p-5 hover:bg-stone-50/60 transition-colors flex items-start gap-3 sm:gap-4"
                >
                  {/* User Avatar */}
                  <UserAvatarBadge user={cmt.user} />

                  {/* Main Comment Details */}
                  <div className="flex-1 min-w-0 space-y-1.5">
                    {/* Top Row: User name, Badges, Date */}
                    <div className="flex items-center justify-between gap-2 flex-wrap">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="font-extrabold text-slate-900 text-sm">
                          {cmt.user?.name || 'صارف'}
                        </span>

                        {cmt.user?.role === 'admin' && (
                          <span className="inline-flex items-center gap-0.5 px-2 py-0.2 rounded-full bg-amber-100 text-amber-800 text-[9.5px] font-bold border border-amber-200">
                            <ShieldCheck className="w-3 h-3 text-amber-600" />
                            <span>منتظم</span>
                          </span>
                        )}

                        <TypeBadge type={cmt.contentType} />

                        {isReply && (
                          <span className="inline-flex items-center gap-0.5 px-2 py-0.5 rounded-full bg-sky-50 text-sky-700 text-[10px] font-bold border border-sky-200">
                            <span>جواب</span>
                          </span>
                        )}

                        <StatusBadge cmt={cmt} />

                        {cmt.isEdited && (
                          <span className="text-[9.5px] font-bold text-purple-700 bg-purple-50 px-2 py-0.5 rounded-full border border-purple-200">
                            ترمیم شدہ
                          </span>
                        )}
                      </div>

                      {/* Timestamp */}
                      <span className="text-[11px] text-stone-400 font-medium whitespace-nowrap">
                        {formatUrduDateTime(cmt.createdAt)}
                      </span>
                    </div>

                    {/* Comment Body */}
                    <div className="text-xs sm:text-[13px] text-slate-700 leading-relaxed bg-stone-50/70 p-3 rounded-xl border border-stone-200/70 whitespace-pre-wrap break-words [overflow-wrap:anywhere]">
                      {cmt.replyToUser?.name && (
                        <span
                          dir="ltr"
                          className="inline-block bg-white text-stone-700 border border-stone-300 font-bold px-1.5 py-0.2 rounded text-[10px] me-1.5 select-none"
                        >
                          @{cmt.replyToUser.name}
                        </span>
                      )}

                      <span>
                        {isTextExpanded || !isLongText
                          ? cmt.text
                          : `${cmt.text.slice(0, 180)}...`}
                      </span>

                      {isLongText && (
                        <button
                          type="button"
                          onClick={() => toggleExpandText(cmt._id)}
                          className="text-xs font-bold text-[#7B4A2D] hover:underline ms-2 cursor-pointer inline-block"
                        >
                          {isTextExpanded ? 'مختصر کریں' : 'مزید پڑھیں'}
                        </button>
                      )}
                    </div>

                    {/* Metadata Footer */}
                    <div className="flex items-center justify-between gap-2 pt-0.5 flex-wrap text-[11px] text-stone-500">
                      <span className="inline-flex items-center gap-1 font-mono text-[10.5px]">
                        <span>مواد ID:</span>
                        <span className="text-stone-700 font-semibold">{String(cmt.contentId)}</span>
                      </span>

                      {cmt.user?.email && (
                        <span className="inline-flex items-center gap-1 font-sans text-stone-500">
                          <span>ای میل:</span>
                          <span className="font-semibold">{cmt.user.email}</span>
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex flex-col gap-1.5 shrink-0 self-center sm:self-start">
                    {/* Approve Button */}
                    {!cmt.isDeleted && !cmt.isApproved && (
                      <button
                        type="button"
                        onClick={() => handleApprove(cmt._id)}
                        className="inline-flex items-center justify-center gap-1 px-3 py-1.5 rounded-xl text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 shadow-2xs transition-all active:scale-95 cursor-pointer"
                        title="منظور کریں"
                      >
                        <CheckCircle className="w-3.5 h-3.5" />
                        <span>منظور</span>
                      </button>
                    )}

                    {/* Restore Button */}
                    {cmt.isDeleted && (
                      <button
                        type="button"
                        onClick={() => handleRestore(cmt._id)}
                        className="inline-flex items-center justify-center gap-1 px-3 py-1.5 rounded-xl text-xs font-bold text-white bg-sky-600 hover:bg-sky-700 shadow-2xs transition-all active:scale-95 cursor-pointer"
                        title="بحال کریں"
                      >
                        <RotateCcw className="w-3.5 h-3.5" />
                        <span>بحال</span>
                      </button>
                    )}

                    {/* Delete Button */}
                    {!cmt.isDeleted && (
                      <button
                        type="button"
                        onClick={() =>
                          setConfirmBox({
                            open: true,
                            commentId: cmt._id,
                            text: cmt.text,
                          })
                        }
                        className="inline-flex items-center justify-center gap-1 px-3 py-1.5 rounded-xl text-xs font-bold text-rose-600 bg-rose-50 border border-rose-200 hover:bg-rose-100 shadow-2xs transition-all active:scale-95 cursor-pointer"
                        title="حذف کریں"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                        <span>حذف</span>
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* ── Pagination ── */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between flex-wrap gap-3 bg-white p-4 rounded-2xl border border-stone-200/80 shadow-xs">
          <span className="text-xs font-bold text-stone-500">
            صفحہ {page} از {totalPages} (کل {totalCount} تبصرے)
          </span>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page <= 1}
              className="inline-flex items-center gap-1 px-3.5 py-1.5 rounded-xl text-xs font-bold bg-stone-100 border border-stone-200 text-stone-700 disabled:opacity-40 cursor-pointer hover:bg-stone-200 shadow-2xs transition-all"
            >
              <ChevronRight className="w-4 h-4" />
              <span>پچھلا</span>
            </button>

            <span className="px-3 py-1 bg-[#7B4A2D] text-white rounded-xl text-xs font-extrabold">
              {page}
            </span>

            <button
              type="button"
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              disabled={page >= totalPages}
              className="inline-flex items-center gap-1 px-3.5 py-1.5 rounded-xl text-xs font-bold bg-stone-100 border border-stone-200 text-stone-700 disabled:opacity-40 cursor-pointer hover:bg-stone-200 shadow-2xs transition-all"
            >
              <span>اگلا</span>
              <ChevronLeft className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* ── Confirmation Box Dialog ── */}
      <ConfirmationBox
        isOpen={confirmBox.open}
        onClose={() => setConfirmBox({ open: false, commentId: null, text: '' })}
        onConfirm={handleDelete}
        title="تبصرہ حذف کریں"
        message={
          confirmBox.text
            ? `کیا آپ واقعی یہ تبصرہ حذف کرنا چاہتے ہیں؟\n\n"${confirmBox.text.slice(0, 100)}${
                confirmBox.text.length > 100 ? '...' : ''
              }"`
            : 'کیا آپ واقعی یہ تبصرہ حذف کرنا چاہتے ہیں؟'
        }
        type="danger"
        confirmText="ہاں، حذف کریں"
        cancelText="منسوخ"
        isLoading={isActionLoading}
      />
    </div>
  );
}