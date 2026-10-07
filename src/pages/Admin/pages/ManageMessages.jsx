import React, { useEffect, useState, useCallback, useMemo } from 'react';
import {
  Mail,
  MailOpen,
  Phone,
  Calendar,
  Clock,
  Trash2,
  Search,
  RefreshCw,
  Eye,
  CheckCircle,
  X,
  AlertCircle,
  Copy,
  UserCheck,
  UserX,
  User,
  MessageSquare,
  ChevronRight,
  ChevronLeft,
  ShieldCheck,
  ExternalLink,
  Check,
  Send,
  Edit3,
  CornerDownLeft,
} from 'lucide-react';
import {
  getContacts,
  markContactSeen,
  deleteContact,
  replyToContact,
  deleteContactReply,
} from '@/services';
import { ConfirmationBox } from '@/components';
import { notifyError } from '@/utils/errorHandler';
import toast from 'react-hot-toast';

/* ─────────────────────────────────────────
   Metric Stat Card
───────────────────────────────────────── */
function MetricCard({ label, value, icon: Icon, color, bg, highlight }) {
  return (
    <div className="relative rounded-2xl border border-slate-200 bg-white p-4 sm:p-5 shadow-xs hover:shadow-md transition-all duration-200 overflow-hidden flex items-center justify-between gap-3 group">
      <div
        style={{ backgroundColor: bg }}
        className="absolute -top-6 -right-6 w-20 h-20 rounded-full opacity-25 group-hover:scale-125 transition-transform duration-300 pointer-events-none"
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
          <p className="text-xs font-semibold text-slate-500 mt-1 font-urdu leading-relaxed">{label}</p>
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

export default function ManageMessages() {
  const [messages, setMessages] = useState([]);
  const [counts, setCounts] = useState({ total: 0, unseen: 0, seen: 0 });
  const [pagination, setPagination] = useState({ page: 1, limit: 20, total: 0, pages: 1 });
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState('all'); // 'all' | 'unseen' | 'seen'
  const [activeMessage, setActiveMessage] = useState(null);
  const [deleteId, setDeleteId] = useState(null);
  const [actionLoading, setActionLoading] = useState(false);
  const [replyText, setReplyText] = useState('');
  const [replyLoading, setReplyLoading] = useState(false);
  const [isEditingReply, setIsEditingReply] = useState(false);

  // Fetch messages from backend
  const fetchMessages = useCallback(async (pageToLoad = 1, currentTab = activeTab, search = searchQuery) => {
    try {
      setLoading(true);
      const params = {
        page: pageToLoad,
        limit: 20,
      };
      if (currentTab !== 'all') {
        params.status = currentTab;
      }
      if (search && search.trim()) {
        params.search = search.trim();
      }

      const res = await getContacts(params);

      if (res && res.messages) {
        setMessages(res.messages);
        if (res.counts) {
          setCounts(res.counts);
        }
        if (res.pagination) {
          setPagination(res.pagination);
        }
      } else if (Array.isArray(res)) {
        setMessages(res);
        setCounts({
          total: res.length,
          unseen: res.filter((m) => m.status === 'unseen' || !m.isRead).length,
          seen: res.filter((m) => m.status === 'seen' || m.isRead).length,
        });
      }
    } catch (err) {
      console.error('Error fetching messages:', err);
      notifyError(err, 'contact');
    } finally {
      setLoading(false);
    }
  }, [activeTab, searchQuery]);

  useEffect(() => {
    fetchMessages(1, activeTab, searchQuery);
  }, [fetchMessages, activeTab]);

  // Handle Search Input Submit or Clear
  const handleSearchSubmit = (e) => {
    e.preventDefault();
    fetchMessages(1, activeTab, searchQuery);
  };

  // Auto-open specific message if query parameter present (from notification click)
  useEffect(() => {
    if (!messages || messages.length === 0) return;
    try {
      const params = new URLSearchParams(window.location.search);
      const targetId = params.get('contactId') || params.get('id');
      if (targetId) {
        const found = messages.find((m) => String(m._id) === String(targetId));
        if (found) {
          handleOpenMessage(found);
        }
      }
    } catch {}
  }, [messages]);

  // Open Message and automatically mark as SEEN if it was UNSEEN
  const handleOpenMessage = async (msg) => {
    setActiveMessage(msg);
    setReplyText(msg.reply?.text || '');
    setIsEditingReply(false);

    // If already seen, no need to call API
    if (msg.status === 'seen') {
      return;
    }

    // Immediately update local state for responsive UI
    setMessages((prev) =>
      prev.map((m) =>
        m._id === msg._id
          ? { ...m, status: 'seen', isRead: true, seenAt: new Date().toISOString() }
          : m
      )
    );
    setCounts((prev) => ({
      ...prev,
      unseen: Math.max(0, prev.unseen - 1),
      seen: prev.seen + 1,
    }));
    setActiveMessage((prev) =>
      prev && prev._id === msg._id
        ? { ...prev, status: 'seen', isRead: true, seenAt: new Date().toISOString() }
        : prev
    );

    // Persist to backend
    try {
      const res = await markContactSeen(msg._id, 'seen');
      if (res?.contact) {
        setActiveMessage((prev) =>
          prev && prev._id === msg._id ? { ...prev, ...res.contact } : prev
        );
        setMessages((prev) =>
          prev.map((m) => (m._id === msg._id ? { ...m, ...res.contact } : m))
        );
      }
    } catch (err) {
      console.error('Failed to mark message as seen on server:', err);
    }
  };

  // Send / Save reply (Only for registered user messages)
  const handleSendReply = async () => {
    if (!activeMessage) return;

    if (!activeMessage.userId) {
      toast.error('صرف رجسٹرڈ صارفین کے پیغامات کا جواب دیا جا سکتا ہے۔');
      return;
    }

    if (!replyText.trim()) {
      toast.error('براہ کرم جواب کا متن تحریر کریں');
      return;
    }

    try {
      setReplyLoading(true);
      const res = await replyToContact(activeMessage._id, replyText.trim());

      const updatedContact = res?.contact || {
        ...activeMessage,
        status: 'seen',
        isRead: true,
        reply: {
          text: replyText.trim(),
          repliedAt: new Date().toISOString(),
          repliedBy: { name: 'Admin' },
        },
      };

      setActiveMessage(updatedContact);
      setMessages((prev) =>
        prev.map((m) => (m._id === activeMessage._id ? updatedContact : m))
      );
      setIsEditingReply(false);
      toast.success('جواب کامیابی سے محفوظ اور ارسال ہو گیا');
    } catch (err) {
      console.error('Error sending reply:', err);
      notifyError(err, 'contact');
    } finally {
      setReplyLoading(false);
    }
  };

  // Delete / Remove reply
  const handleDeleteReply = async () => {
    if (!activeMessage || !activeMessage.userId) return;

    try {
      setReplyLoading(true);
      const res = await deleteContactReply(activeMessage._id);

      const updatedContact = res?.contact || {
        ...activeMessage,
        reply: null,
      };

      setActiveMessage(updatedContact);
      setReplyText('');
      setIsEditingReply(false);
      setMessages((prev) =>
        prev.map((m) => (m._id === activeMessage._id ? updatedContact : m))
      );
      toast.success('جواب کامیابی سے ہٹا دیا گیا');
    } catch (err) {
      console.error('Error deleting reply:', err);
      notifyError(err, 'contact');
    } finally {
      setReplyLoading(false);
    }
  };

  // Toggle Seen / Unseen Status manually
  const handleToggleStatus = async (id, e) => {
    if (e) e.stopPropagation();
    const current = messages.find((m) => m._id === id);
    if (!current) return;

    const nextStatus = current.status === 'seen' ? 'unseen' : 'seen';

    try {
      setActionLoading(true);
      const res = await markContactSeen(id, nextStatus);
      const updatedContact = res?.contact || {
        ...current,
        status: nextStatus,
        isRead: nextStatus === 'seen',
        seenAt: nextStatus === 'seen' ? new Date().toISOString() : null,
      };

      setMessages((prev) =>
        prev.map((m) => (m._id === id ? { ...m, ...updatedContact } : m))
      );

      if (activeMessage && activeMessage._id === id) {
        setActiveMessage((prev) => ({ ...prev, ...updatedContact }));
      }

      setCounts((prev) => {
        if (nextStatus === 'seen') {
          return {
            ...prev,
            unseen: Math.max(0, prev.unseen - 1),
            seen: prev.seen + 1,
          };
        } else {
          return {
            ...prev,
            unseen: prev.unseen + 1,
            seen: Math.max(0, prev.seen - 1),
          };
        }
      });

      toast.success(
        nextStatus === 'seen'
          ? 'پیغام دیکھا ہوا نشان زد کر دیا گیا'
          : 'پیغام غیر دیکھا نشان زد کر دیا گیا'
      );
    } catch (err) {
      console.error('Error toggling message status:', err);
      notifyError(err, 'contact');
    } finally {
      setActionLoading(false);
    }
  };

  // Delete message
  const handleDeleteConfirm = async () => {
    if (!deleteId) return;
    try {
      setActionLoading(true);
      await deleteContact(deleteId);

      const target = messages.find((m) => m._id === deleteId);
      setMessages((prev) => prev.filter((m) => m._id !== deleteId));

      if (target) {
        setCounts((prev) => ({
          total: Math.max(0, prev.total - 1),
          unseen:
            target.status === 'unseen'
              ? Math.max(0, prev.unseen - 1)
              : prev.unseen,
          seen:
            target.status === 'seen'
              ? Math.max(0, prev.seen - 1)
              : prev.seen,
        }));
      }

      if (activeMessage && activeMessage._id === deleteId) {
        setActiveMessage(null);
      }
      setDeleteId(null);
      toast.success('پیغام کامیابی سے حذف کر دیا گیا');
    } catch (err) {
      console.error('Error deleting message:', err);
      notifyError(err, 'contact');
    } finally {
      setActionLoading(false);
    }
  };

  // Copy mobile number
  const handleCopyMobile = (mobile, e) => {
    if (e) e.stopPropagation();
    navigator.clipboard.writeText(mobile);
    toast.success('موبائل نمبر کاپی ہو گیا');
  };

  // Copy email
  const handleCopyEmail = (email, e) => {
    if (e) e.stopPropagation();
    if (!email) return;
    navigator.clipboard.writeText(email);
    toast.success('ای میل کاپی ہو گیا');
  };

  // Format date
  const formatDate = (dateStr) => {
    if (!dateStr) return '—';
    try {
      const d = new Date(dateStr);
      return d.toLocaleDateString('ur-PK', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      });
    } catch {
      return dateStr;
    }
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-6 max-w-7xl mx-auto" dir="rtl">
      {/* ── Page Header ── */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-200 pb-5">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-slate-800 flex items-center gap-2.5">
            <Mail className="w-6 h-6 text-primary" />
            <span className="font-urdu text-2xl sm:text-3xl font-bold">پیغامات کا انتظام</span>
            <span className="text-sm font-sans text-slate-400 font-semibold">/ Messages</span>
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1 font-urdu leading-relaxed">
            ویب سائٹ کے زائرین اور رجسٹرڈ صارفین کی جانب سے موصول ہونے والے تمام پیغامات / All visitor and user messages
          </p>
        </div>
        <button
          onClick={() => fetchMessages(pagination.page, activeTab, searchQuery)}
          disabled={loading}
          className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 shadow-2xs transition-all cursor-pointer disabled:opacity-50"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
          <span className="font-urdu text-sm">ریفریش کریں</span>
          <span className="font-sans text-xs">/ Refresh</span>
        </button>
      </div>

      {/* ── Stat Cards ── */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <MetricCard
          label="کل پیغامات / All Messages"
          value={counts.total}
          icon={Mail}
          color="#3b82f6"
          bg="#eff6ff"
        />
        <MetricCard
          label="غیر دیکھی پیغامات / Unseen Messages"
          value={counts.unseen}
          icon={Clock}
          color="#f59e0b"
          bg="#fffbeb"
          highlight={counts.unseen > 0}
        />
        <MetricCard
          label="دیکھی گئی پیغامات / Seen Messages"
          value={counts.seen}
          icon={CheckCircle}
          color="#10b981"
          bg="#ecfdf5"
        />
      </div>

      {/* ── Filter & Search Toolbar ── */}
      <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-xs flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
        {/* Categories / Tabs */}
        <div className="inline-flex items-center p-1 rounded-xl bg-slate-100 border border-slate-200 text-xs font-bold flex-wrap gap-1">
          <button
            onClick={() => setActiveTab('all')}
            className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
              activeTab === 'all'
                ? 'bg-white text-slate-800 shadow-2xs'
                : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            <span className="font-urdu text-sm">تمام پیغامات</span>
            <span className="font-sans text-xs"> / All ({counts.total})</span>
          </button>
          <button
            onClick={() => setActiveTab('unseen')}
            className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'unseen'
                ? 'bg-white text-amber-700 shadow-2xs font-extrabold'
                : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            <span
              className={`w-2 h-2 rounded-full ${
                counts.unseen > 0 ? 'bg-amber-500 animate-pulse' : 'bg-slate-300'
              }`}
            />
            <span className="font-urdu text-sm">غیر دیکھی</span>
            <span className="font-sans text-xs"> / Unseen ({counts.unseen})</span>
          </button>
          <button
            onClick={() => setActiveTab('seen')}
            className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
              activeTab === 'seen'
                ? 'bg-white text-emerald-700 shadow-2xs font-bold'
                : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            <span className="font-urdu text-sm">دیکھی گئی</span>
            <span className="font-sans text-xs"> / Seen ({counts.seen})</span>
          </button>
        </div>

        {/* Search */}
        <form onSubmit={handleSearchSubmit} className="relative flex-1 sm:max-w-xs">
          <Search className="w-4 h-4 absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="تلاش کریں... / Search..."
            className="w-full pr-9 pl-3 py-2 text-xs rounded-xl border border-slate-200 outline-none focus:border-primary transition-all bg-slate-50 focus:bg-white"
          />
        </form>
      </div>

      {/* ── Messages Table ── */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
        {loading ? (
          <div className="p-12 text-center text-slate-400 text-sm">
            <RefreshCw className="w-6 h-6 animate-spin mx-auto mb-2 text-primary" />
            <p>پیغامات لوڈ ہو رہے ہیں... / Loading messages...</p>
          </div>
        ) : messages.length === 0 ? (
          <div className="p-12 text-center text-slate-400 text-sm">
            <AlertCircle className="w-8 h-8 mx-auto mb-2 text-slate-300" />
            <p>اس زمرے میں کوئی پیغام نہیں ملا۔ / No messages found in this category.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-right text-xs">
              <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 font-bold uppercase tracking-wider text-[11px]">
                <tr>
                  <th className="py-3.5 px-4"><span className="font-urdu text-sm">بھیجنے والا</span> <span className="font-sans text-[11px] font-normal">/ Sender</span></th>
                  <th className="py-3.5 px-4"><span className="font-urdu text-sm">صارف کی قسم</span> <span className="font-sans text-[11px] font-normal">/ User Type</span></th>
                  <th className="py-3.5 px-4"><span className="font-urdu text-sm">موبائل نمبر</span> <span className="font-sans text-[11px] font-normal">/ Mobile</span></th>
                  <th className="py-3.5 px-4"><span className="font-urdu text-sm">پیغام</span> <span className="font-sans text-[11px] font-normal">/ Message</span></th>
                  <th className="py-3.5 px-4"><span className="font-urdu text-sm">تاریخ و وقت</span> <span className="font-sans text-[11px] font-normal">/ Date</span></th>
                  <th className="py-3.5 px-4"><span className="font-urdu text-sm">حیثیت</span> <span className="font-sans text-[11px] font-normal">/ Status</span></th>
                  <th className="py-3.5 px-4 text-center"><span className="font-urdu text-sm">اقدامات</span> <span className="font-sans text-[11px] font-normal">/ Actions</span></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {messages.map((msg) => {
                  const isUnseen = msg.status === 'unseen';
                  const isRegistered = Boolean(msg.userId);

                  return (
                    <tr
                      key={msg._id}
                      onClick={() => handleOpenMessage(msg)}
                      className={`hover:bg-slate-50/80 transition-colors cursor-pointer ${
                        isUnseen ? 'bg-amber-50/35 font-semibold' : ''
                      }`}
                    >
                      {/* Name with unseen indicator */}
                      <td className="py-3.5 px-4 text-slate-800">
                        <div className="flex items-center gap-2">
                          <span
                            className={`w-2.5 h-2.5 rounded-full shrink-0 ${
                              isUnseen
                                ? 'bg-amber-500 shadow-xs ring-2 ring-amber-200 animate-pulse'
                                : 'bg-slate-300'
                            }`}
                          />
                          <span className="font-bold font-urdu text-sm sm:text-base">{msg.name || 'نامعلوم / Unknown'}</span>
                        </div>
                      </td>

                      {/* User Account / Guest Indicator */}
                      <td className="py-3.5 px-4 whitespace-nowrap">
                        {isRegistered ? (
                          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-blue-50 text-blue-800 border border-blue-200">
                            <UserCheck className="w-3.5 h-3.5 text-blue-600" />
                            <span className="font-urdu">رجسٹرڈ صارف</span>
                            <span className="text-[10px] text-blue-600 font-sans">/ Registered</span>
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-slate-100 text-slate-600 border border-slate-200">
                            <UserX className="w-3.5 h-3.5 text-slate-400" />
                            <span className="font-urdu">مہمان صارف</span>
                            <span className="text-[10px] text-slate-500 font-sans">/ Guest</span>
                          </span>
                        )}
                      </td>

                      {/* Mobile Number */}
                      <td className="py-3.5 px-4" dir="ltr">
                        <div className="inline-flex items-center gap-1.5 text-slate-700 font-mono font-medium">
                          <Phone className="w-3.5 h-3.5 text-accent shrink-0" />
                          <a
                            href={`tel:${msg.mobileNumber}`}
                            onClick={(e) => e.stopPropagation()}
                            className="hover:underline text-primary font-bold"
                          >
                            {msg.mobileNumber || '—'}
                          </a>
                          <button
                            onClick={(e) => handleCopyMobile(msg.mobileNumber, e)}
                            title="نمبر کاپی کریں / Copy Number"
                            className="p-1 hover:bg-slate-200 rounded text-slate-400 hover:text-slate-600 transition-colors"
                          >
                            <Copy className="w-3 h-3" />
                          </button>
                        </div>
                      </td>

                      {/* Message Preview */}
                      <td className="py-3.5 px-4 max-w-xs truncate text-slate-600 font-urdu text-sm sm:text-base leading-relaxed">
                        {msg.message || '—'}
                      </td>

                      {/* Date */}
                      <td className="py-3.5 px-4 text-slate-400 whitespace-nowrap text-xs font-sans">
                        {formatDate(msg.createdAt)}
                      </td>

                      {/* Status */}
                      <td className="py-3.5 px-4 whitespace-nowrap">
                        <div className="flex flex-col items-start gap-1">
                          {isUnseen ? (
                            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-amber-100 text-amber-900 border border-amber-300">
                              <Clock className="w-3.5 h-3.5 text-amber-700" />
                              <span className="font-urdu">غیر دیکھی</span>
                              <span className="text-[10px] text-amber-700 font-sans">/ Unseen</span>
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-800 border border-emerald-200">
                              <CheckCircle className="w-3.5 h-3.5 text-emerald-600" />
                              <span className="font-urdu">دیکھی گئی</span>
                              <span className="text-[10px] text-emerald-700 font-sans">/ Seen</span>
                            </span>
                          )}

                          {isRegistered && msg.reply?.text ? (
                            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-purple-50 text-purple-800 border border-purple-200 font-urdu">
                              <CornerDownLeft className="w-3 h-3 text-purple-600" />
                              <span>جواب دیا گیا</span>
                            </span>
                          ) : isRegistered ? (
                            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold bg-blue-50 text-blue-700 border border-blue-200 font-urdu">
                              <CornerDownLeft className="w-3 h-3 text-blue-500" />
                              <span>جواب طلب</span>
                            </span>
                          ) : null}
                        </div>
                      </td>

                      {/* Actions */}
                      <td
                        className="py-3.5 px-4 text-center whitespace-nowrap"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <div className="inline-flex items-center gap-1">
                          <button
                            onClick={() => handleOpenMessage(msg)}
                            title="تفصیل دیکھیں / View Details"
                            className="p-1.5 hover:bg-slate-100 rounded-lg text-slate-600 hover:text-primary transition-colors cursor-pointer"
                          >
                            <Eye className="w-4 h-4" />
                          </button>
                          <button
                            onClick={(e) => handleToggleStatus(msg._id, e)}
                            title={
                              isUnseen
                                ? 'دیکھی گئی نشان زد کریں / Mark Seen'
                                : 'غیر دیکھی بنائیں / Mark Unseen'
                            }
                            className="p-1.5 hover:bg-slate-100 rounded-lg text-slate-600 hover:text-amber-600 transition-colors cursor-pointer"
                          >
                            {isUnseen ? (
                              <MailOpen className="w-4 h-4" />
                            ) : (
                              <Mail className="w-4 h-4" />
                            )}
                          </button>
                          <button
                            onClick={() => setDeleteId(msg._id)}
                            title="پیغام حذف کریں / Delete Message"
                            className="p-1.5 hover:bg-red-50 rounded-lg text-slate-400 hover:text-red-600 transition-colors cursor-pointer"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}

        {/* ── Pagination Footer ── */}
        {pagination.pages > 1 && (
          <div className="px-5 py-3.5 bg-slate-50 border-t border-slate-200 flex items-center justify-between text-xs">
            <span className="text-slate-500">
              کل {pagination.total} میں سے صفحہ {pagination.page} از {pagination.pages} / Page {pagination.page} of {pagination.pages}
            </span>
            <div className="inline-flex items-center gap-1.5">
              <button
                onClick={() => fetchMessages(pagination.page - 1)}
                disabled={pagination.page <= 1 || loading}
                className="px-3 py-1.5 rounded-lg border border-slate-200 bg-white text-slate-700 hover:bg-slate-100 disabled:opacity-40 disabled:pointer-events-none inline-flex items-center gap-1 cursor-pointer"
              >
                <ChevronRight className="w-3.5 h-3.5" />
                <span>پچھلا / Prev</span>
              </button>
              <button
                onClick={() => fetchMessages(pagination.page + 1)}
                disabled={pagination.page >= pagination.pages || loading}
                className="px-3 py-1.5 rounded-lg border border-slate-200 bg-white text-slate-700 hover:bg-slate-100 disabled:opacity-40 disabled:pointer-events-none inline-flex items-center gap-1 cursor-pointer"
              >
                <span>اگلا / Next</span>
                <ChevronLeft className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* ── Message Detail Modal ── */}
      {activeMessage && (
        <div
          className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-slate-900/70 backdrop-blur-xs animate-fade-in"
          onClick={() => setActiveMessage(null)}
          dir="rtl"
        >
          <div
            className="bg-white rounded-t-3xl sm:rounded-2xl border border-slate-200 shadow-2xl w-full max-w-2xl max-h-[92vh] sm:max-h-[88vh] flex flex-col overflow-hidden animate-scale-up"
            onClick={(e) => e.stopPropagation()}
          >
            {/* ── Modal Header: Account & Sender Details Directly in Header ── */}
            <div className="p-4 sm:p-5 border-b border-slate-200/90 bg-gradient-to-b from-slate-50 via-slate-50/95 to-slate-100/70 backdrop-blur-md shrink-0 space-y-3.5">
              {/* Top Row: User Profile & Close Button */}
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-3 min-w-0">
                  {/* Avatar */}
                  <div className="relative shrink-0">
                    {activeMessage.userId?.profileImage ? (
                      <img
                        src={activeMessage.userId.profileImage}
                        alt={activeMessage.name}
                        className="w-12 h-12 rounded-2xl object-cover border-2 border-primary/20 shadow-2xs"
                      />
                    ) : (
                      <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-primary/15 to-primary/5 border border-primary/25 text-primary font-bold text-xl flex items-center justify-center shadow-2xs font-urdu">
                        {(activeMessage.name || 'ص').charAt(0)}
                      </div>
                    )}
                    {activeMessage.userId ? (
                      <span
                        className="absolute -bottom-1 -left-1 w-4 h-4 bg-emerald-500 border-2 border-white rounded-full flex items-center justify-center"
                        title="رجسٹرڈ صارف / Registered User"
                      >
                        <Check className="w-2.5 h-2.5 text-white" />
                      </span>
                    ) : (
                      <span
                        className="absolute -bottom-1 -left-1 w-4 h-4 bg-slate-400 border-2 border-white rounded-full flex items-center justify-center"
                        title="مہمان صارف / Guest Visitor"
                      >
                        <User className="w-2.5 h-2.5 text-white" />
                      </span>
                    )}
                  </div>

                  {/* Name, Badges & Timestamp */}
                  <div className="min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <h3 className="text-lg sm:text-xl font-bold text-slate-900 leading-snug truncate font-urdu">
                        {activeMessage.name || 'نامعلوم / Unknown'}
                      </h3>

                      {/* User Type Badge */}
                      {activeMessage.userId ? (
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-blue-100 text-blue-900 border border-blue-200 shrink-0">
                          <UserCheck className="w-3.5 h-3.5 text-blue-600" />
                          <span className="font-urdu">رجسٹرڈ صارف</span>
                          <span className="text-[10px] text-blue-600 font-sans font-medium">/ Registered</span>
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-slate-200 text-slate-700 shrink-0">
                          <UserX className="w-3.5 h-3.5 text-slate-500" />
                          <span className="font-urdu">مہمان صارف</span>
                          <span className="text-[10px] text-slate-500 font-sans font-medium">/ Guest</span>
                        </span>
                      )}

                      {/* Read Status Badge */}
                      {activeMessage.status === 'seen' ? (
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-800 border border-emerald-200 shrink-0">
                          <CheckCircle className="w-3.5 h-3.5 text-emerald-600" />
                          <span className="font-urdu">دیکھی گئی</span>
                          <span className="text-[10px] text-emerald-700 font-sans font-medium">/ Seen</span>
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-amber-100 text-amber-900 border border-amber-300 shrink-0">
                          <Clock className="w-3.5 h-3.5 text-amber-600" />
                          <span className="font-urdu">غیر دیکھی</span>
                          <span className="text-[10px] text-amber-700 font-sans font-bold">/ Unseen</span>
                        </span>
                      )}
                    </div>

                    {/* Received Date & Time */}
                    <div className="flex items-center gap-1.5 text-xs text-slate-500 mt-1">
                      <Calendar className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                      <span className="font-urdu text-sm">موصولہ تاریخ:</span>
                      <span className="font-sans text-xs">{formatDate(activeMessage.createdAt)}</span>
                    </div>
                  </div>
                </div>

                {/* Close Button */}
                <button
                  onClick={() => setActiveMessage(null)}
                  className="w-8 h-8 rounded-full bg-slate-200/80 hover:bg-slate-300 text-slate-600 hover:text-slate-900 transition-colors flex items-center justify-center cursor-pointer shrink-0"
                  title="بند کریں / Close"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* ── Dedicated Account & Contact Details Section in Header ── */}
              <div className="bg-white rounded-2xl border border-slate-200/90 p-3 sm:p-3.5 shadow-2xs space-y-2.5">
                <div className="flex items-center justify-between text-xs font-semibold text-slate-700 pb-1.5 border-b border-slate-100">
                  <span className="inline-flex items-center gap-1.5 text-slate-800">
                    <User className="w-3.5 h-3.5 text-primary" />
                    <span className="font-urdu text-sm font-bold">اکاؤنٹ و رابطے کی تفصیلات</span>
                    <span className="text-[11px] text-slate-400 font-sans">/ Account & Contact</span>
                  </span>
                  {activeMessage.userId ? (
                    <span className="text-xs text-emerald-700 font-medium inline-flex items-center gap-1 font-urdu">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                      <span>منسلک اکاؤنٹ (Linked)</span>
                    </span>
                  ) : (
                    <span className="text-xs text-slate-400 font-urdu">
                      غیر رجسٹرڈ زائر (Guest)
                    </span>
                  )}
                </div>

                {/* Account Details Content Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                  {/* Phone & Call Action */}
                  <div className="bg-slate-50/80 rounded-xl p-2.5 border border-slate-200/70 flex items-center justify-between gap-2">
                    <div className="min-w-0" dir="ltr">
                      <span className="text-[10px] text-slate-400 block font-urdu text-right">موبائل نمبر / Phone:</span>
                      <span className="font-mono font-bold text-xs sm:text-sm text-slate-800 tracking-wide truncate block">
                        {activeMessage.mobileNumber || '—'}
                      </span>
                    </div>
                    <div className="flex items-center gap-1 shrink-0">
                      <button
                        onClick={(e) => handleCopyMobile(activeMessage.mobileNumber, e)}
                        title="کاپی کریں / Copy"
                        className="p-1 hover:bg-slate-200 rounded text-slate-500 hover:text-slate-800 transition-colors cursor-pointer"
                      >
                        <Copy className="w-3.5 h-3.5" />
                      </button>
                      <a
                        href={`tel:${activeMessage.mobileNumber}`}
                        className="px-2.5 py-1 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs inline-flex items-center gap-1 shadow-2xs font-urdu"
                        title="کال کریں / Call"
                      >
                        <Phone className="w-2.5 h-2.5" />
                        <span>کال</span>
                      </a>
                    </div>
                  </div>

                  {/* Registered Account Email & Role or Guest Notice */}
                  {activeMessage.userId && typeof activeMessage.userId === 'object' ? (
                    <div className="bg-slate-50/80 rounded-xl p-2.5 border border-slate-200/70 flex items-center justify-between gap-2">
                      <div className="min-w-0" dir="ltr">
                        <span className="text-[10px] text-slate-400 block font-urdu text-right">
                          اکاؤنٹ ای میل / Email:
                        </span>
                        <span className="font-mono font-medium text-xs text-slate-800 truncate block">
                          {activeMessage.userId.loginEmail || '—'}
                        </span>
                      </div>
                      <div className="flex items-center gap-1 shrink-0">
                        {activeMessage.userId.loginEmail && (
                          <button
                            onClick={(e) => handleCopyEmail(activeMessage.userId.loginEmail, e)}
                            title="ای میل کاپی کریں / Copy Email"
                            className="p-1 hover:bg-slate-200 rounded text-slate-500 hover:text-slate-800 transition-colors cursor-pointer"
                          >
                            <Copy className="w-3.5 h-3.5" />
                          </button>
                        )}
                        <span className="px-1.5 py-0.5 rounded bg-primary/10 text-primary font-bold uppercase text-[10px] font-sans border border-primary/20">
                          {activeMessage.userId.role || 'USER'}
                        </span>
                      </div>
                    </div>
                  ) : (
                    <div className="bg-slate-50/80 rounded-xl p-2.5 border border-slate-200/70 flex items-center gap-2 text-slate-500 text-xs font-urdu">
                      <UserX className="w-4 h-4 text-slate-400 shrink-0" />
                      <span>کوئی رجسٹرڈ اکاؤنٹ منسلک نہیں ہے (مہمان پیغام)</span>
                    </div>
                  )}
                </div>

                {/* Additional user account metadata if available */}
                {activeMessage.userId && typeof activeMessage.userId === 'object' && (
                  <div className="flex items-center justify-between text-xs text-slate-500 pt-1 border-t border-slate-100 flex-wrap gap-2">
                    <div className="flex items-center gap-1.5">
                      <span className="font-urdu">اکاؤنٹ کا نام:</span>
                      <strong className="text-slate-800 font-urdu text-sm font-bold">
                        {activeMessage.userId.name || activeMessage.name}
                      </strong>
                    </div>
                    <div className="flex items-center gap-1.5 font-urdu text-xs">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                      <span className="text-emerald-700 font-medium">اکاؤنٹ فعال ہے (Active)</span>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* ── Modal Body: Message Content (Payami Nastaleeq font-urdu) ── */}
            <div className="p-4 sm:p-6 space-y-4 sm:space-y-6 overflow-y-auto flex-1 overscroll-contain">
              {/* Message Content Container with Payami Nastaleeq font-urdu */}
              <div className="space-y-2.5">
                <div className="flex items-center justify-between text-xs sm:text-sm font-semibold text-slate-700">
                  <span className="inline-flex items-center gap-1.5">
                    <MessageSquare className="w-4 h-4 text-primary" />
                    <span className="font-urdu text-base font-bold">پیغام کا متن</span>
                    <span className="text-xs text-slate-400 font-sans">/ Message Content</span>
                  </span>
                  <span className="text-xs text-slate-400 font-urdu">
                    {activeMessage.message?.length || 0} حروف
                  </span>
                </div>

                <div className="relative rounded-2xl border-r-4 border-r-primary border border-slate-200/90 bg-white sm:bg-slate-50/50 p-4 sm:p-6 shadow-2xs transition-all">
                  <p
                    className="font-urdu text-base sm:text-xl text-slate-800 leading-[2.3] sm:leading-[2.6] tracking-normal whitespace-pre-wrap break-words select-text"
                    dir="rtl"
                  >
                    {activeMessage.message || '—'}
                  </p>
                </div>
              </div>

              {/* ── Admin / Mufti Reply Section: Only for Registered Users ── */}
              {!activeMessage.userId ? (
                <div className="rounded-2xl border border-slate-200/90 bg-slate-50/80 p-4 sm:p-5 text-right space-y-3" dir="rtl">
                  <div className="flex items-start gap-3">
                    <div className="w-9 h-9 rounded-xl bg-amber-100 text-amber-800 flex items-center justify-center shrink-0 mt-0.5 shadow-2xs">
                      <UserX className="w-4 h-4" />
                    </div>
                    <div className="flex-1 space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="font-urdu text-sm sm:text-base font-bold text-slate-800">
                          مہمان زائر (غیر رجسٹرڈ صارف)
                        </span>
                        <span className="text-[10px] sm:text-[11px] font-sans font-semibold text-amber-800 bg-amber-100/90 px-2 py-0.5 rounded-md">
                          Guest Visitor
                        </span>
                      </div>
                      <p className="font-urdu text-xs sm:text-sm text-slate-600 leading-[2.2]">
                        یہ پیغام ایک مہمان زائر نے بغیر لاگ ان کیے بھیجا ہے۔ چونکہ ان کا ویب سائٹ پر کوئی اکاؤنٹ نہیں ہے، اس لیے آن لائن جواب کا آپشن صرف رجسٹرڈ صارفین کے لیے ہوتا ہے۔ آپ دیے گئے موبائل نمبر پر کال یا ایس ایم ایس کے ذریعے رابطہ کر سکتے ہیں۔
                      </p>
                    </div>
                  </div>
                  <div className="pt-2 border-t border-slate-200/80 flex items-center justify-end gap-2">
                    <button
                      onClick={(e) => handleCopyMobile(activeMessage.mobileNumber, e)}
                      className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-semibold bg-white border border-slate-200 text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer"
                    >
                      <Copy className="w-3.5 h-3.5 text-slate-500" />
                      <span className="font-urdu text-xs">نمبر کاپی کریں</span>
                    </button>
                    <a
                      href={`tel:${activeMessage.mobileNumber}`}
                      className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-xl text-xs font-bold text-white bg-primary hover:bg-primary/95 transition-all shadow-xs"
                    >
                      <Phone className="w-3.5 h-3.5 text-accent" />
                      <span className="font-urdu text-xs">کال کریں</span>
                    </a>
                  </div>
                </div>
              ) : activeMessage.reply?.text && !isEditingReply ? (
                <div className="space-y-3 rounded-2xl border border-emerald-200/90 bg-emerald-50/50 p-4 sm:p-5 shadow-2xs">
                  <div className="flex items-center justify-between gap-2 border-b border-emerald-200/70 pb-3">
                    <div className="flex items-center gap-2.5">
                      <div className="w-8 h-8 rounded-xl bg-emerald-600 text-white flex items-center justify-center shrink-0 shadow-2xs">
                        <CornerDownLeft className="w-4 h-4" />
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-urdu text-base font-bold text-emerald-950">
                            ایڈمن / مفتی صاحب کا جواب
                          </span>
                          <span className="text-[11px] font-sans font-bold text-emerald-700 bg-emerald-100/90 px-2 py-0.5 rounded-md">
                            Reply
                          </span>
                        </div>
                        <div className="flex items-center gap-2 text-xs text-emerald-700 font-urdu mt-0.5">
                          <span>
                            بذریعہ: {activeMessage.reply.repliedBy?.name || 'ایڈمن / مفتی'}
                          </span>
                          <span>•</span>
                          <span className="font-sans text-[11px]">{formatDate(activeMessage.reply.repliedAt)}</span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-1.5">
                      <button
                        onClick={() => {
                          setReplyText(activeMessage.reply.text);
                          setIsEditingReply(true);
                        }}
                        className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-semibold text-emerald-800 bg-emerald-100 hover:bg-emerald-200 transition-colors cursor-pointer"
                        title="ترمیم کریں / Edit"
                      >
                        <Edit3 className="w-3.5 h-3.5" />
                        <span className="font-urdu text-xs">ترمیم</span>
                      </button>
                      <button
                        onClick={handleDeleteReply}
                        disabled={replyLoading}
                        className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-semibold text-red-700 bg-red-50 hover:bg-red-100 transition-colors cursor-pointer disabled:opacity-50"
                        title="جواب حذف کریں / Delete Reply"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                        <span className="font-urdu text-xs">حذف</span>
                      </button>
                    </div>
                  </div>

                  <div className="pt-1">
                    <p
                      className="font-urdu text-base sm:text-lg text-slate-800 leading-[2.3] sm:leading-[2.5] tracking-normal whitespace-pre-wrap break-words select-text"
                      dir="rtl"
                    >
                      {activeMessage.reply.text}
                    </p>
                  </div>
                </div>
              ) : (
                <div className="space-y-3 rounded-2xl border border-slate-200 bg-slate-50/70 p-4 sm:p-5">
                  <div className="flex items-center justify-between">
                    <span className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-semibold text-slate-700">
                      <CornerDownLeft className="w-4 h-4 text-primary" />
                      <span className="font-urdu text-base font-bold">
                        {isEditingReply ? 'جواب میں ترمیم کریں' : 'جواب تحریر کریں'}
                      </span>
                      <span className="text-xs text-slate-400 font-sans">
                        / {isEditingReply ? 'Edit Reply' : 'Send Reply'}
                      </span>
                    </span>
                    {isEditingReply && (
                      <button
                        type="button"
                        onClick={() => {
                          setIsEditingReply(false);
                          setReplyText(activeMessage.reply?.text || '');
                        }}
                        className="text-xs text-slate-500 hover:text-slate-700 font-urdu underline cursor-pointer"
                      >
                        منسوخ کریں / Cancel
                      </button>
                    )}
                  </div>

                  <div className="relative">
                    <textarea
                      rows={3}
                      value={replyText}
                      onChange={(e) => setReplyText(e.target.value)}
                      placeholder="اپنا جواب یہاں تحریر فرمائیں... (اردو یا انگریزی)"
                      dir="rtl"
                      className="w-full rounded-xl border border-slate-200 bg-white p-3 text-sm sm:text-base font-urdu leading-[2.2] text-slate-800 placeholder:text-slate-400 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all resize-y min-h-[90px]"
                    />
                  </div>

                  <div className="flex items-center justify-between gap-2 pt-1">
                    <span className="text-[11px] text-slate-400 font-sans">
                      {replyText.length} حروف
                    </span>
                    <button
                      type="button"
                      onClick={handleSendReply}
                      disabled={replyLoading || !replyText.trim()}
                      className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-bold text-white bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 transition-all cursor-pointer shadow-xs"
                    >
                      <Send className="w-3.5 h-3.5" />
                      <span className="font-urdu text-sm">
                        {isEditingReply ? 'جواب اپ ڈیٹ کریں' : 'جواب محفوظ / ارسال کریں'}
                      </span>
                      <span className="text-xs font-sans text-emerald-100">
                        / {isEditingReply ? 'Update' : 'Send'}
                      </span>
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* ── Modal Footer: Phone Responsive Layout ── */}
            <div className="px-4 sm:px-6 py-3 sm:py-4 bg-slate-50 border-t border-slate-200 shrink-0">
              <div className="flex flex-col-reverse sm:flex-row items-stretch sm:items-center justify-between gap-2.5">
                <button
                  onClick={(e) => handleToggleStatus(activeMessage._id, e)}
                  disabled={actionLoading}
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-medium bg-white border border-slate-300 text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer min-h-[44px] shadow-2xs"
                >
                  {activeMessage.status === 'seen' ? (
                    <>
                      <Mail className="w-4 h-4 text-amber-600" />
                      <span className="font-urdu text-sm">غیر دیکھی بنائیں</span>
                      <span className="text-xs text-slate-400 font-sans">/ Mark Unseen</span>
                    </>
                  ) : (
                    <>
                      <CheckCircle className="w-4 h-4 text-emerald-600" />
                      <span className="font-urdu text-sm">دیکھی گئی نشان زد کریں</span>
                      <span className="text-xs text-slate-400 font-sans">/ Mark Seen</span>
                    </>
                  )}
                </button>

                <div className="flex items-center gap-2">
                  <a
                    href={`tel:${activeMessage.mobileNumber}`}
                    className="flex-1 sm:flex-initial inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl text-xs sm:text-sm font-bold text-white bg-primary hover:bg-primary/95 transition-all shadow-xs min-h-[44px]"
                  >
                    <Phone className="w-4 h-4 text-accent" />
                    <span className="font-urdu text-sm">کال کریں</span>
                    <span className="text-xs text-white/80 font-sans">/ Call</span>
                  </a>
                  <button
                    onClick={() => setDeleteId(activeMessage._id)}
                    className="inline-flex items-center justify-center gap-1.5 px-3.5 py-2.5 rounded-xl text-xs sm:text-sm font-semibold text-red-600 bg-red-50 hover:bg-red-100 border border-red-200 transition-colors cursor-pointer min-h-[44px]"
                    title="حذف کریں / Delete"
                  >
                    <Trash2 className="w-4 h-4" />
                    <span className="sm:hidden font-urdu text-xs">حذف</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ── Delete Confirmation Dialog ── */}
      <ConfirmationBox
        isOpen={Boolean(deleteId)}
        title="پیغام حذف کریں / Delete Message"
        message="کیا آپ واقعی اس پیغام کو حذف کرنا چاہتے ہیں؟ یہ عمل واپس نہیں لیا جا سکتا۔ / Are you sure you want to delete this message? This action cannot be undone."
        onConfirm={handleDeleteConfirm}
        onClose={() => setDeleteId(null)}
        onCancel={() => setDeleteId(null)}
        confirmText="حذف کریں / Delete"
        cancelText="منسوخ کریں / Cancel"
        type="danger"
        isLoading={actionLoading}
      />
    </div>
  );
}

