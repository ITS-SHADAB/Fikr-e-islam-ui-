import React, { useEffect, useState, useCallback, useRef, useMemo } from "react";
import {
  Bell,
  Send,
  Users,
  UserCheck,
  UserX,
  User,
  Search,
  Clock,
  AlertTriangle,
  RotateCw,
  Eye,
  X,
  Sparkles,
  FileText,
  BookOpen,
  HelpCircle,
  BarChart3,
  Shield,
  Layers,
  Lock,
  Check,
  Loader2,
} from "lucide-react";
import toast from "react-hot-toast";
import {
  sendAdminNotification,
  getAdminNotificationStats,
  getAdminNotificationCampaigns,
  getAdminNotificationCampaign,
  getAdminUsers,
  getAdminQuestions,
  getArticles,
  getFatwas,
  getPublications,
} from "@/services";
import { useSettings } from "@/hooks/useSettings";

/* ─── Type Icons & Badges ─── */
const TYPE_CONFIG = {
  announcement: {
    labelUrdu: "اعلان",
    labelEn: "Announcement",
    icon: Sparkles,
    color: "#d97706",
    bg: "rgba(217, 119, 6, 0.12)",
    hasContent: false,
  },
  question: {
    labelUrdu: "سوال و جواب",
    labelEn: "Question / Q&A",
    icon: HelpCircle,
    color: "#7c3aed",
    bg: "rgba(124, 58, 237, 0.12)",
    hasContent: true,
    contentType: "question",
    placeholderUrdu: "سوال کا عنوان یا متن تلاش کریں...",
    placeholderEn: "Search question by title or text...",
  },
  article: {
    labelUrdu: "مضمون / مقالہ",
    labelEn: "Article",
    icon: FileText,
    color: "#2563eb",
    bg: "rgba(37, 99, 235, 0.12)",
    hasContent: true,
    contentType: "article",
    placeholderUrdu: "مضمون کا عنوان تلاش کریں...",
    placeholderEn: "Search article by title...",
  },
  fatwa: {
    labelUrdu: "فتویٰ",
    labelEn: "Fatwa",
    icon: BookOpen,
    color: "#059669",
    bg: "rgba(5, 150, 105, 0.12)",
    hasContent: true,
    contentType: "fatwa",
    placeholderUrdu: "فتویٰ کا عنوان یا نمبر تلاش کریں...",
    placeholderEn: "Search fatwa by title or number...",
  },
  book: {
    labelUrdu: "کتاب / اشاعت",
    labelEn: "Book / Publication",
    icon: BookOpen,
    color: "#0891b2",
    bg: "rgba(8, 145, 178, 0.12)",
    hasContent: true,
    contentType: "book",
    placeholderUrdu: "کتاب کا نام یا مصنف تلاش کریں...",
    placeholderEn: "Search publication by title or author...",
  },
  general: {
    labelUrdu: "عام اطلاع",
    labelEn: "General Notice",
    icon: Bell,
    color: "#475569",
    bg: "rgba(71, 85, 105, 0.12)",
    hasContent: false,
  },
};

/* ─── Audience Config ─── */
const AUDIENCE_CONFIG = {
  everyone: { labelUrdu: "تمام افراد (لاگ ان + مہمان)", labelEn: "Everyone (Logged-in + Guests)", icon: Users, color: "#2563eb", bg: "rgba(37,99,235,0.12)" },
  logged_in: { labelUrdu: "تمام لاگ ان صارفین", labelEn: "All Logged-in Users", icon: UserCheck, color: "#059669", bg: "rgba(5,150,105,0.12)" },
  guests: { labelUrdu: "تمام مہمان ڈیوائسز", labelEn: "All Guest Devices", icon: UserX, color: "#d97706", bg: "rgba(217,119,6,0.12)" },
  specific: { labelUrdu: "مخصوص صارف", labelEn: "Specific User", icon: User, color: "#7c3aed", bg: "rgba(124,58,237,0.12)" },
};

export default function ManageNotifications() {
  const { settings } = useSettings();
  const isUrdu = settings?.language === "ur" || settings?.language === "Urdu";

  // ─── Tabs: 'composer' | 'history' | 'overview' ───
  const [activeTab, setActiveTab] = useState("composer");

  // ─── Stats State ───
  const [stats, setStats] = useState(null);
  const [statsLoading, setStatsLoading] = useState(true);
  const [statsError, setStatsError] = useState(null);

  // ─── Campaign History State ───
  const [campaigns, setCampaigns] = useState([]);
  const [historyLoading, setHistoryLoading] = useState(true);
  const [historyError, setHistoryError] = useState(null);
  const [searchFilter, setSearchFilter] = useState("");
  const [audienceFilter, setAudienceFilter] = useState("all");

  // ─── Selected Campaign for Details Modal ───
  const [selectedCampaign, setSelectedCampaign] = useState(null);
  const [detailsLoading, setDetailsLoading] = useState(false);

  // ─── Composer Form State ───
  const [audience, setAudience] = useState("everyone");
  const [recipient, setRecipient] = useState(null); // { _id, name, loginEmail, loginPhone }
  const [title, setTitle] = useState("");
  const [message, setMessage] = useState("");
  const [type, setType] = useState("announcement");
  const [targetLink, setTargetLink] = useState("");
  const [isSending, setIsSending] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);

  // ─── User Search State (for audience === 'specific') ───
  const [userSearchQuery, setUserSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [isSearchingUsers, setIsSearchingUsers] = useState(false);
  const [showUserDropdown, setShowUserDropdown] = useState(false);
  const searchTimerRef = useRef(null);
  const userDropdownRef = useRef(null);

  // ─── Related Content Search State ───
  const [selectedContent, setSelectedContent] = useState(null);
  const [contentSearchQuery, setContentSearchQuery] = useState("");
  const [contentSearchResults, setContentSearchResults] = useState([]);
  const [isSearchingContent, setIsSearchingContent] = useState(false);
  const [showContentDropdown, setShowContentDropdown] = useState(false);
  const contentSearchTimerRef = useRef(null);
  const contentDropdownRef = useRef(null);

  /**
   * Fetch Stats
   */
  const loadStats = useCallback(async () => {
    try {
      setStatsLoading(true);
      setStatsError(null);
      const res = await getAdminNotificationStats();
      if (res && res.data) {
        setStats(res.data);
      }
    } catch (err) {
      console.warn("Load notification stats failed:", err);
      setStatsError(err.response?.data?.message || (isUrdu ? "اعداد و شمار حاصل نہیں ہو سکے" : "Failed to load statistics"));
    } finally {
      setStatsLoading(false);
    }
  }, [isUrdu]);

  /**
   * Fetch Campaign History
   */
  const loadHistory = useCallback(async () => {
    try {
      setHistoryLoading(true);
      setHistoryError(null);
      const res = await getAdminNotificationCampaigns();
      const list = Array.isArray(res?.data) ? res.data : [];
      setCampaigns(list);
    } catch (err) {
      console.warn("Load notification history failed:", err);
      setHistoryError(err.response?.data?.message || (isUrdu ? "ہسٹری حاصل نہیں ہو سکی" : "Failed to load history"));
    } finally {
      setHistoryLoading(false);
    }
  }, [isUrdu]);

  useEffect(() => {
    loadStats();
    loadHistory();
  }, [loadStats, loadHistory]);

  // Close dropdowns on click outside & cleanup timers on unmount
  useEffect(() => {
    const handleOutsideClick = (e) => {
      if (contentDropdownRef.current && !contentDropdownRef.current.contains(e.target)) {
        setShowContentDropdown(false);
      }
      if (userDropdownRef.current && !userDropdownRef.current.contains(e.target)) {
        setShowUserDropdown(false);
      }
    };
    document.addEventListener("mousedown", handleOutsideClick);
    return () => {
      document.removeEventListener("mousedown", handleOutsideClick);
      if (contentSearchTimerRef.current) clearTimeout(contentSearchTimerRef.current);
      if (searchTimerRef.current) clearTimeout(searchTimerRef.current);
    };
  }, []);

  /**
   * Compute actual existing frontend route for selected content
   */
  const computeContentRoute = (item, contentType) => {
    if (!item) return "";
    const identifier = item.slug || item._id;
    if (!identifier) return "";

    switch (contentType) {
      case "question":
        return `/qa/${identifier}`;
      case "article":
        return `/articles/${identifier}`;
      case "fatwa":
        return `/fatwas/${identifier}`;
      case "book":
        return `/publications/${identifier}`;
      default:
        return "";
    }
  };

  /**
   * Handle Notification Type change
   * Automatically clears previous content selection & route
   */
  const handleTypeChange = (newType) => {
    setType(newType);
    setSelectedContent(null);
    setTargetLink("");
    setContentSearchQuery("");
    setContentSearchResults([]);
    setShowContentDropdown(false);
  };

  /**
   * Debounced Content Search
   */
  const handleContentSearchChange = (query) => {
    setContentSearchQuery(query);
    if (!query.trim()) {
      setContentSearchResults([]);
      setShowContentDropdown(false);
      return;
    }

    if (contentSearchTimerRef.current) {
      clearTimeout(contentSearchTimerRef.current);
    }

    contentSearchTimerRef.current = setTimeout(async () => {
      try {
        setIsSearchingContent(true);
        const q = query.trim();
        let results = [];

        if (type === "question") {
          const res = await getAdminQuestions({ search: q, limit: 8 });
          results = Array.isArray(res?.questions) ? res.questions : [];
        } else if (type === "article") {
          const res = await getArticles({ search: q, limit: 8 });
          results = Array.isArray(res?.articles) ? res.articles : (Array.isArray(res) ? res : []);
        } else if (type === "fatwa") {
          const res = await getFatwas({ search: q, limit: 8 });
          results = Array.isArray(res?.fatwas) ? res.fatwas : (Array.isArray(res) ? res : []);
        } else if (type === "book") {
          const res = await getPublications({ search: q, limit: 8 });
          results = Array.isArray(res?.books) ? res.books : (Array.isArray(res) ? res : []);
        }

        setContentSearchResults(results);
        setShowContentDropdown(true);
      } catch (err) {
        console.warn("Content search failed:", err);
        setContentSearchResults([]);
      } finally {
        setIsSearchingContent(false);
      }
    }, 300);
  };

  /**
   * Select Content Item & automatically generate route
   */
  const handleSelectContent = (item) => {
    setSelectedContent(item);
    const route = computeContentRoute(item, type);
    setTargetLink(route);
    setContentSearchQuery("");
    setContentSearchResults([]);
    setShowContentDropdown(false);
  };

  /**
   * Clear Selected Content Item & clear route
   */
  const handleClearContent = () => {
    setSelectedContent(null);
    setTargetLink("");
    setContentSearchQuery("");
    setContentSearchResults([]);
    setShowContentDropdown(false);
  };

  /**
   * Debounced User Search
   */
  const handleUserSearchChange = (query) => {
    setUserSearchQuery(query);
    if (!query.trim()) {
      setSearchResults([]);
      setShowUserDropdown(false);
      return;
    }

    if (searchTimerRef.current) {
      clearTimeout(searchTimerRef.current);
    }

    searchTimerRef.current = setTimeout(async () => {
      try {
        setIsSearchingUsers(true);
        const res = await getAdminUsers({ search: query.trim(), limit: 8 });
        const users = Array.isArray(res?.data) ? res.data : [];
        setSearchResults(users);
        setShowUserDropdown(true);
      } catch (err) {
        console.warn("Search users failed:", err);
      } finally {
        setIsSearchingUsers(false);
      }
    }, 300);
  };

  /**
   * Select Recipient
   */
  const handleSelectRecipient = (u) => {
    setRecipient(u);
    setUserSearchQuery("");
    setSearchResults([]);
    setShowUserDropdown(false);
  };

  /**
   * Open Campaign Details Modal
   */
  const handleViewDetails = async (campaign) => {
    setSelectedCampaign(campaign);
    try {
      setDetailsLoading(true);
      const res = await getAdminNotificationCampaign(campaign._id);
      if (res && res.data) {
        setSelectedCampaign(res.data);
      }
    } catch (err) {
      console.warn("Failed to fetch campaign details:", err);
    } finally {
      setDetailsLoading(false);
    }
  };

  /**
   * Submit Notification (Send Campaign)
   */
  const handleSendNotification = async () => {
    if (!title.trim()) {
      toast.error(isUrdu ? "براہ کرم عنوان درج کریں" : "Please enter a title");
      return;
    }
    if (!message.trim()) {
      toast.error(isUrdu ? "براہ کرم پیغام درج کریں" : "Please enter a message");
      return;
    }
    if (audience === "specific" && !recipient) {
      toast.error(isUrdu ? "براہ کرم وصول کنندہ صارف منتخب کریں" : "Please select a specific recipient user");
      return;
    }

    setShowConfirmModal(false);
    setIsSending(true);

    try {
      const payload = {
        audience,
        recipient: audience === "specific" ? recipient._id : null,
        title: title.trim(),
        message: message.trim(),
        type,
        data: targetLink.trim() ? { link: targetLink.trim() } : {},
      };

      const res = await sendAdminNotification(payload);

      toast.success(res?.message || (isUrdu ? "نوٹیفیکیشن کامیابی سے بھیج دیا گیا!" : "Notification sent successfully!"));

      // Reset form
      setTitle("");
      setMessage("");
      setTargetLink("");
      setSelectedContent(null);
      setContentSearchQuery("");
      setContentSearchResults([]);
      setShowContentDropdown(false);
      setRecipient(null);
      setUserSearchQuery("");
      setSearchResults([]);
      setShowUserDropdown(false);
      setAudience("everyone");
      setType("announcement");

      // Reload stats and history
      loadStats();
      loadHistory();
      setActiveTab("history");
    } catch (err) {
      console.error("Send notification error:", err);
      toast.error(err.response?.data?.message || err.message || (isUrdu ? "نوٹیفیکیشن بھیجنے میں ناکامی" : "Failed to send notification"));
    } finally {
      setIsSending(false);
    }
  };

  // ─── Filtered Campaign History (Memoized for optimal performance) ───
  const filteredCampaigns = useMemo(() => {
    return campaigns.filter((c) => {
      if (audienceFilter !== "all" && c.audience !== audienceFilter) {
        return false;
      }
      if (!searchFilter.trim()) return true;
      const q = searchFilter.toLowerCase();
      const titleMatch = c.title?.toLowerCase().includes(q);
      const msgMatch = c.message?.toLowerCase().includes(q);
      const recipientMatch =
        c.recipient?.name?.toLowerCase().includes(q) ||
        c.recipient?.loginEmail?.toLowerCase().includes(q);
      return titleMatch || msgMatch || recipientMatch;
    });
  }, [campaigns, audienceFilter, searchFilter]);

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12" dir={isUrdu ? "rtl" : "ltr"}>
      {/* ── Header ── */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-slate-200">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-[#A8793E] to-[#785424] flex items-center justify-center text-white shadow-md">
            <Bell className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-xl sm:text-2xl font-black text-slate-800 tracking-tight">
              {isUrdu ? "اطلاعات اور نوٹیفیکیشنز کا انتظام" : "Push Notifications & Campaigns"}
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 font-medium">
              {isUrdu
                ? "صارفین، ممبران اور مہمانوں کو فوری پش نوٹیفیکیشنز ارسال کریں اور کارکردگی کا جائزہ لیں۔"
                : "Broadcast FCM push notifications to all users, guests, or specific members with live analytics."}
            </p>
          </div>
        </div>

        {/* Quick Refresh Button */}
        <div className="flex items-center gap-2 self-stretch sm:self-auto">
          <button
            type="button"
            onClick={() => {
              loadStats();
              loadHistory();
            }}
            disabled={statsLoading || historyLoading}
            className="flex items-center justify-center gap-2 px-3 py-2 bg-white hover:bg-slate-50 text-slate-700 rounded-xl border border-slate-200 text-xs font-bold transition-all shadow-xs cursor-pointer disabled:opacity-50"
          >
            <RotateCw className={`w-3.5 h-3.5 text-[#A8793E] ${statsLoading || historyLoading ? "animate-spin" : ""}`} />
            <span>{isUrdu ? "ریفریش" : "Refresh Data"}</span>
          </button>
        </div>
      </div>

      {/* ── Navigation Tabs ── */}
      <div className="flex items-center gap-2 border-b border-slate-200 overflow-x-auto pb-0.5">
        <button
          type="button"
          onClick={() => setActiveTab("composer")}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-t-xl text-xs sm:text-sm font-bold transition-all cursor-pointer border-b-2 whitespace-nowrap ${
            activeTab === "composer"
              ? "border-[#A8793E] text-[#A8793E] bg-[#A8793E]/5"
              : "border-transparent text-slate-600 hover:text-slate-900 hover:bg-slate-50"
          }`}
        >
          <Send className="w-4 h-4" />
          <span>{isUrdu ? "نیا نوٹیفیکیشن بھیجیں" : "Send Notification"}</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab("history")}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-t-xl text-xs sm:text-sm font-bold transition-all cursor-pointer border-b-2 whitespace-nowrap ${
            activeTab === "history"
              ? "border-[#A8793E] text-[#A8793E] bg-[#A8793E]/5"
              : "border-transparent text-slate-600 hover:text-slate-900 hover:bg-slate-50"
          }`}
        >
          <Clock className="w-4 h-4" />
          <span>{isUrdu ? "نوٹیفیکیشن ہسٹری" : "Campaign History"}</span>
          {campaigns.length > 0 && (
            <span className="px-2 py-0.5 text-[10px] font-bold rounded-full bg-slate-200 text-slate-700">
              {campaigns.length}
            </span>
          )}
        </button>

        <button
          type="button"
          onClick={() => setActiveTab("overview")}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-t-xl text-xs sm:text-sm font-bold transition-all cursor-pointer border-b-2 whitespace-nowrap ${
            activeTab === "overview"
              ? "border-[#A8793E] text-[#A8793E] bg-[#A8793E]/5"
              : "border-transparent text-slate-600 hover:text-slate-900 hover:bg-slate-50"
          }`}
        >
          <BarChart3 className="w-4 h-4" />
          <span>{isUrdu ? "اعداد و شمار و تجزیات" : "Analytics & Stats"}</span>
        </button>
      </div>

      {/* ── TAB 1: COMPOSER ── */}
      {activeTab === "composer" && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Form Column */}
          <div className="lg:col-span-7 bg-white border border-slate-200 rounded-2xl p-5 sm:p-6 shadow-xs space-y-5">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <Send className="w-5 h-5 text-[#A8793E]" />
                <h2 className="text-base font-bold text-slate-800">
                  {isUrdu ? "نوٹیفیکیشن تحریر کریں" : "Notification Composer"}
                </h2>
              </div>
              <span className="text-[11px] text-slate-400 font-mono">FCM Engine v1</span>
            </div>

            {/* Audience Selector */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
                <Users className="w-3.5 h-3.5 text-[#A8793E]" />
                <span>{isUrdu ? "مخاطب (Audience)" : "Audience"}</span>
                <span className="text-red-500">*</span>
              </label>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {Object.entries(AUDIENCE_CONFIG).map(([key, config]) => {
                  const Icon = config.icon;
                  const isSelected = audience === key;
                  return (
                    <button
                      key={key}
                      type="button"
                      onClick={() => {
                        setAudience(key);
                        if (key !== "specific") setRecipient(null);
                      }}
                      className={`p-2.5 rounded-xl border text-center flex flex-col items-center gap-1.5 transition-all cursor-pointer ${
                        isSelected
                          ? "border-[#A8793E] bg-[#A8793E]/10 text-[#785424] shadow-xs font-bold ring-1 ring-[#A8793E]"
                          : "border-slate-200 hover:border-slate-300 text-slate-600 hover:bg-slate-50"
                      }`}
                    >
                      <Icon className="w-4 h-4" style={{ color: config.color }} />
                      <span className="text-[11px] leading-tight line-clamp-1">
                        {isUrdu ? config.labelUrdu.split("(")[0] : config.labelEn.split("(")[0]}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Specific User Search (Visible only if audience === 'specific') */}
            {audience === "specific" && (
              <div className="space-y-2 p-3.5 bg-slate-50 rounded-xl border border-slate-200 relative" ref={userDropdownRef}>
                <label className="text-xs font-bold text-slate-700 flex items-center justify-between">
                  <span className="flex items-center gap-1.5">
                    <User className="w-3.5 h-3.5 text-[#A8793E]" />
                    {isUrdu ? "صارف تلاش کر کے منتخب کریں" : "Search & Select User"}
                    <span className="text-red-500">*</span>
                  </span>
                  {recipient && (
                    <span className="text-[10px] text-emerald-600 font-bold bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                      {isUrdu ? "منتخب شدہ" : "Selected"}
                    </span>
                  )}
                </label>

                {recipient ? (
                  <div className="flex items-center justify-between p-2.5 bg-white border border-emerald-300 rounded-xl shadow-xs">
                    <div className="flex items-center gap-2.5 min-w-0">
                      <div className="w-8 h-8 rounded-full bg-emerald-100 text-emerald-800 font-bold text-xs flex items-center justify-center shrink-0">
                        {recipient.name?.[0]?.toUpperCase() || "U"}
                      </div>
                      <div className="min-w-0">
                        <p className="text-xs font-bold text-slate-800 truncate">{recipient.name}</p>
                        <p className="text-[10px] text-slate-500 font-mono truncate">{recipient.loginEmail || recipient.loginPhone || "User"}</p>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => setRecipient(null)}
                      title={isUrdu ? "صارف ہٹائیں" : "Remove user"}
                      className="p-1 text-slate-400 hover:text-red-500 rounded-lg hover:bg-red-50 transition-colors cursor-pointer"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                ) : (
                  <div className="relative">
                    <div className="relative flex items-center">
                      <input
                        type="text"
                        value={userSearchQuery}
                        onChange={(e) => handleUserSearchChange(e.target.value)}
                        placeholder={isUrdu ? "نام یا ای میل سے تلاش کریں..." : "Search user by name or email..."}
                        className="w-full bg-white border border-slate-300 rounded-xl px-3 py-2 text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:border-[#A8793E] focus:ring-1 focus:ring-[#A8793E]"
                      />
                      <Search className="w-4 h-4 text-slate-400 absolute left-3 pointer-events-none" />
                    </div>

                    {/* Dropdown search results */}
                    {showUserDropdown && searchResults.length > 0 && (
                      <div className="absolute top-full mt-1 left-0 right-0 bg-white border border-slate-200 rounded-xl shadow-xl max-h-48 overflow-y-auto z-30 p-1 divide-y divide-slate-100">
                        {searchResults.map((u) => (
                          <div
                            key={u._id}
                            onClick={() => handleSelectRecipient(u)}
                            className="p-2 hover:bg-slate-50 rounded-lg cursor-pointer flex items-center justify-between text-xs transition-colors"
                          >
                            <div className="min-w-0">
                              <p className="font-bold text-slate-800 truncate">{u.name}</p>
                              <p className="text-[10px] text-slate-400 font-mono truncate">{u.loginEmail || u.loginPhone || "-"}</p>
                            </div>
                            <span className="text-[10px] px-1.5 py-0.5 bg-slate-100 text-slate-600 rounded">
                              {u.role || "user"}
                            </span>
                          </div>
                        ))}
                      </div>
                    )}

                    {showUserDropdown && searchResults.length === 0 && !isSearchingUsers && (
                      <div className="absolute top-full mt-1 left-0 right-0 bg-white border border-slate-200 rounded-xl shadow-lg p-3 text-center text-xs text-slate-500 z-30">
                        {isUrdu ? "کوئی صارف نہیں ملا" : "No users found"}
                      </div>
                    )}
                  </div>
                )}
              </div>
            )}

            {/* Notification Type */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
                <Layers className="w-3.5 h-3.5 text-[#A8793E]" />
                <span>{isUrdu ? "اطلاع کی قسم (Notification Type)" : "Notification Type"}</span>
                <span className="text-red-500">*</span>
              </label>

              <select
                value={type}
                onChange={(e) => handleTypeChange(e.target.value)}
                className="w-full bg-white border border-slate-300 rounded-xl px-3 py-2 text-xs text-slate-800 focus:outline-none focus:border-[#A8793E] cursor-pointer"
              >
                {Object.entries(TYPE_CONFIG).map(([key, cfg]) => (
                  <option key={key} value={key}>
                    {isUrdu ? cfg.labelUrdu : cfg.labelEn} ({key})
                  </option>
                ))}
              </select>
            </div>

            {/* Title Input */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <label className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-[#A8793E]" />
                  <span>{isUrdu ? "عنوان (Title)" : "Title"}</span>
                  <span className="text-red-500">*</span>
                </label>
                <span className={`text-[10px] font-mono ${title.length > 140 ? "text-amber-600" : "text-slate-400"}`}>
                  {title.length}/150
                </span>
              </div>
              <input
                type="text"
                value={title}
                maxLength={150}
                onChange={(e) => setTitle(e.target.value)}
                placeholder={isUrdu ? "مثال: نیا علمی مقالہ شائع کر دیا گیا ہے" : "e.g., Important Announcement regarding Ramadan"}
                className="w-full bg-white border border-slate-300 rounded-xl px-3 py-2 text-xs sm:text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:border-[#A8793E]"
              />
            </div>

            {/* Message Textarea */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <label className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
                  <FileText className="w-3.5 h-3.5 text-[#A8793E]" />
                  <span>{isUrdu ? "پیغام کی تفصیل (Message)" : "Message Body"}</span>
                  <span className="text-red-500">*</span>
                </label>
                <span className={`text-[10px] font-mono ${message.length > 480 ? "text-amber-600" : "text-slate-400"}`}>
                  {message.length}/500
                </span>
              </div>
              <textarea
                rows={3}
                value={message}
                maxLength={500}
                onChange={(e) => setMessage(e.target.value)}
                placeholder={isUrdu ? "اطلاع کا تفصیلی متن یہاں تحریر کریں..." : "Detailed message for recipients..."}
                className="w-full bg-white border border-slate-300 rounded-xl p-3 text-xs sm:text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:border-[#A8793E]"
              />
            </div>

            {/* Related Content & Automatic Target Route */}
            {TYPE_CONFIG[type]?.hasContent ? (
              <div className="space-y-3 p-3.5 bg-slate-50/80 rounded-xl border border-slate-200">
                {/* Related Content Search */}
                <div className="space-y-2 relative" ref={contentDropdownRef}>
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
                      {React.createElement(TYPE_CONFIG[type]?.icon || FileText, {
                        className: "w-3.5 h-3.5",
                        style: { color: TYPE_CONFIG[type]?.color },
                      })}
                      <span>
                        {isUrdu
                          ? `متعلقہ مواد منتخب کریں (${TYPE_CONFIG[type]?.labelUrdu})`
                          : `Select Related Content (${TYPE_CONFIG[type]?.labelEn})`}
                      </span>
                      <span className="text-red-500">*</span>
                    </label>
                    {selectedContent && (
                      <span className="text-[10px] text-emerald-700 font-bold bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200 flex items-center gap-1">
                        <Check className="w-2.5 h-2.5" />
                        {isUrdu ? "منتخب شدہ" : "Selected"}
                      </span>
                    )}
                  </div>

                  {selectedContent ? (
                    <div className="flex items-center justify-between p-2.5 bg-white border border-emerald-300 rounded-xl shadow-xs">
                      <div className="flex items-center gap-2.5 min-w-0">
                        <div
                          className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0"
                          style={{
                            backgroundColor: TYPE_CONFIG[type]?.bg,
                            color: TYPE_CONFIG[type]?.color,
                          }}
                        >
                          {React.createElement(TYPE_CONFIG[type]?.icon || FileText, {
                            className: "w-4 h-4",
                          })}
                        </div>
                        <div className="min-w-0">
                          <p className="text-xs font-bold text-slate-800 truncate">
                            {selectedContent.questionTitle ||
                              selectedContent.title ||
                              selectedContent.titleUrdu ||
                              (selectedContent.fatwaNumber
                                ? `فتویٰ نمبر: ${selectedContent.fatwaNumber}`
                                : "عنوان")}
                          </p>
                          <div className="flex items-center gap-2 text-[10px] text-slate-400">
                            {selectedContent.category && (
                              <span className="truncate">{selectedContent.category}</span>
                            )}
                            {selectedContent.slug && (
                              <span className="font-mono text-slate-500 truncate">
                                /{selectedContent.slug}
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                      <button
                        type="button"
                        onClick={handleClearContent}
                        title={isUrdu ? "مواد ہٹائیں" : "Deselect content"}
                        className="p-1.5 text-slate-400 hover:text-red-500 rounded-lg hover:bg-red-50 transition-colors cursor-pointer shrink-0"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  ) : (
                    <div className="relative">
                      <div className="relative flex items-center">
                        <input
                          type="text"
                          value={contentSearchQuery}
                          onChange={(e) => handleContentSearchChange(e.target.value)}
                          placeholder={
                            isUrdu
                              ? TYPE_CONFIG[type]?.placeholderUrdu || "تلاش کریں..."
                              : TYPE_CONFIG[type]?.placeholderEn || "Search..."
                          }
                          className="w-full bg-white border border-slate-300 rounded-xl px-3 py-2 text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:border-[#A8793E] focus:ring-1 focus:ring-[#A8793E]"
                        />
                        {isSearchingContent ? (
                          <Loader2 className="w-4 h-4 text-[#A8793E] animate-spin absolute left-3 pointer-events-none" />
                        ) : (
                          <Search className="w-4 h-4 text-slate-400 absolute left-3 pointer-events-none" />
                        )}
                      </div>

                      {/* Search Dropdown */}
                      {showContentDropdown && contentSearchResults.length > 0 && (
                        <div className="absolute top-full mt-1 left-0 right-0 bg-white border border-slate-200 rounded-xl shadow-xl max-h-52 overflow-y-auto z-30 p-1 divide-y divide-slate-100">
                          {contentSearchResults.map((item) => {
                            const itemTitle =
                              item.questionTitle ||
                              item.title ||
                              item.titleUrdu ||
                              (item.fatwaNumber ? `فتویٰ نمبر: ${item.fatwaNumber}` : "عنوان");
                            const itemSub =
                              item.category ||
                              item.author ||
                              (item.user?.name ? `سائل: ${item.user.name}` : "");

                            return (
                              <div
                                key={item._id || item.slug}
                                onClick={() => handleSelectContent(item)}
                                className="p-2 hover:bg-slate-50 rounded-lg cursor-pointer flex items-center justify-between text-xs transition-colors"
                              >
                                <div className="min-w-0 pr-2">
                                  <p className="font-bold text-slate-800 truncate">{itemTitle}</p>
                                  {itemSub && (
                                    <p className="text-[10px] text-slate-400 truncate">{itemSub}</p>
                                  )}
                                </div>
                                <span className="text-[10px] font-mono px-1.5 py-0.5 bg-slate-100 text-slate-600 rounded shrink-0">
                                  {computeContentRoute(item, type)}
                                </span>
                              </div>
                            );
                          })}
                        </div>
                      )}

                      {showContentDropdown && contentSearchResults.length === 0 && !isSearchingContent && (
                        <div className="absolute top-full mt-1 left-0 right-0 bg-white border border-slate-200 rounded-xl shadow-lg p-3 text-center text-xs text-slate-500 z-30">
                          {isUrdu ? "کوئی متعلقہ مواد نہیں ملا" : "No matching content found"}
                        </div>
                      )}
                    </div>
                  )}
                </div>

                {/* Target Route Display (Strictly Read-Only, Auto-Generated) */}
                <div className="space-y-1 pt-1 border-t border-slate-200/70">
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
                      <Lock className="w-3.5 h-3.5 text-emerald-600" />
                      <span>{isUrdu ? "ہدف صفحہ / روٹ (Target URL / Route)" : "Target URL / Route"}</span>
                    </label>
                    <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200 flex items-center gap-1">
                      <Check className="w-2.5 h-2.5" />
                      {isUrdu ? "خودکار تیار کردہ" : "Auto-generated"}
                    </span>
                  </div>

                  <div className="relative">
                    <input
                      type="text"
                      readOnly
                      disabled
                      value={targetLink}
                      placeholder={
                        isUrdu
                          ? "متعلقہ مواد منتخب کریں تاکہ روٹ خودکار طور پر تیار ہو..."
                          : "Select related content above to generate route..."
                      }
                      className="w-full bg-slate-100/90 border border-slate-200 rounded-xl px-3 py-2 text-xs font-mono text-slate-700 cursor-not-allowed select-all focus:outline-none"
                    />
                    <div className="absolute left-3 top-1/2 -translate-y-1/2 flex items-center gap-1">
                      <Lock className="w-3.5 h-3.5 text-slate-400" />
                    </div>
                  </div>
                  <p className="text-[10px] text-slate-400">
                    {isUrdu
                      ? "🔒 یہ روٹ منتخب کردہ مواد کے مطابق خودکار تیار ہوتا ہے اور دستی طور پر تبدیل نہیں کیا جا سکتا۔"
                      : "🔒 This route is automatically generated from the selected content and cannot be manually edited."}
                  </p>
                </div>
              </div>
            ) : null}

            {/* Send Button Trigger */}
            <div className="pt-2 flex items-center justify-end gap-3">
              <button
                type="button"
                onClick={() => setShowConfirmModal(true)}
                disabled={isSending || !title.trim() || !message.trim() || (audience === "specific" && !recipient)}
                className="flex items-center gap-2 px-6 py-2.5 bg-gradient-to-r from-[#A8793E] to-[#785424] hover:from-[#966b35] hover:to-[#6a4a1f] text-white rounded-xl text-xs sm:text-sm font-bold shadow-md transition-all cursor-pointer disabled:opacity-50 disabled:pointer-events-none"
              >
                <Send className="w-4 h-4" />
                <span>{isUrdu ? "نوٹیفیکیشن ارسال کریں" : "Broadcast Notification"}</span>
              </button>
            </div>
          </div>

          {/* Live Mobile Push Preview Column */}
          <div className="lg:col-span-5 space-y-4">
            <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs space-y-3">
              <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                <span className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
                  <Eye className="w-3.5 h-3.5 text-[#A8793E]" />
                  {isUrdu ? "پش نوٹیفیکیشن لائیو پیش منظر" : "Live Device Push Preview"}
                </span>
                <span className="text-[10px] text-slate-400 uppercase tracking-wider font-semibold">Native Mockup</span>
              </div>

              {/* Smartphone Frame Mockup */}
              <div className="bg-[#1e1b18] rounded-2xl p-3.5 text-white shadow-xl border border-[#3d2e22] space-y-2">
                <div className="flex items-center justify-between text-[10px] text-slate-400 pb-1 border-b border-white/10">
                  <span className="flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                    مفتی فیضان سرور مصباحی
                  </span>
                  <span>{isUrdu ? "ابھی ابھی" : "Just now"}</span>
                </div>

                <div className="flex items-start gap-2.5 pt-1">
                  <div className="w-8 h-8 rounded-xl bg-[#A8793E] text-white flex items-center justify-center shrink-0 shadow-sm mt-0.5">
                    <Bell className="w-4 h-4" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="text-xs font-bold text-[#DFC8A4] truncate">
                      {title.trim() || (isUrdu ? "نوٹیفیکیشن کا عنوان یہاں نظر آئے گا" : "Notification Title Preview")}
                    </h4>
                    <p className="text-[11px] text-slate-300 line-clamp-2 mt-0.5 leading-relaxed">
                      {message.trim() || (isUrdu ? "اطلاع کا مکمل پیغام یہاں موبائل اسکرین پر نظر آئے گا۔" : "Detailed message body will appear right here on recipient devices.")}
                    </p>
                    {targetLink.trim() && (
                      <span className="inline-flex items-center gap-1 text-[10px] text-[#DFC8A4] font-semibold mt-1">
                        <span>{isUrdu ? "لنک کھولیں:" : "Target:"}</span>
                        <span className="underline font-mono">{targetLink}</span>
                      </span>
                    )}
                  </div>
                </div>
              </div>

              {/* Delivery info callout */}
              <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 text-[11px] text-slate-600 space-y-1">
                <p className="font-bold text-slate-700 flex items-center gap-1">
                  <Shield className="w-3.5 h-3.5 text-[#A8793E]" />
                  {isUrdu ? "ترسیل کی تفصیلات:" : "Delivery Information:"}
                </p>
                <p className="text-slate-500">
                  {audience === "everyone" && (isUrdu ? "یہ نوٹیفیکیشن تمام لاگ ان اور غیر لاگ ان (مہمان) صارفین کو ایک ساتھ ارسال ہو گا۔" : "Delivered to both registered users and guest browser tokens.")}
                  {audience === "logged_in" && (isUrdu ? "یہ نوٹیفیکیشن صرف لاگ ان صارفین کو ارسال ہو گا۔" : "Delivered to registered and authenticated members only.")}
                  {audience === "guests" && (isUrdu ? "یہ نوٹیفیکیشن صرف غیر لاگ ان مہمان ڈیوائسز کو ارسال ہو گا۔" : "Delivered to anonymous guest device tokens only.")}
                  {audience === "specific" && (isUrdu ? `صرف مخصوص صارف: ${recipient?.name || "صارف منتخب کریں"}` : `Direct delivery to: ${recipient?.name || "Select a user"}`)}
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ── TAB 2: CAMPAIGN HISTORY ── */}
      {activeTab === "history" && (
        <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs space-y-4">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pb-3 border-b border-slate-100">
            <div>
              <h2 className="text-base font-bold text-slate-800">
                {isUrdu ? "ارسال کردہ نوٹیفیکیشنز کی تاریخ" : "Broadcast Campaigns History"}
              </h2>
              <p className="text-xs text-slate-500">
                {isUrdu ? "تمام گزشتہ نوٹیفیکیشنز اور ان کی ترسیل کے نتائج دیکھیں" : "View delivery metrics, read rates, and details for previous campaigns."}
              </p>
            </div>

            {/* Filters */}
            <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto">
              {/* Search */}
              <div className="relative flex-1 sm:w-56">
                <input
                  type="text"
                  value={searchFilter}
                  onChange={(e) => setSearchFilter(e.target.value)}
                  placeholder={isUrdu ? "تلاش کریں..." : "Filter campaigns..."}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-1.5 text-xs text-slate-700 focus:outline-none focus:border-[#A8793E]"
                />
                <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              </div>

              {/* Audience Filter */}
              <select
                value={audienceFilter}
                onChange={(e) => setAudienceFilter(e.target.value)}
                className="bg-slate-50 border border-slate-200 rounded-xl px-3 py-1.5 text-xs text-slate-700 focus:outline-none focus:border-[#A8793E] cursor-pointer"
              >
                <option value="all">{isUrdu ? "تمام مخاطبین" : "All Audiences"}</option>
                <option value="everyone">{isUrdu ? "Everyone" : "Everyone"}</option>
                <option value="logged_in">{isUrdu ? "Logged-in Users" : "Logged-in Users"}</option>
                <option value="guests">{isUrdu ? "Guests" : "Guests"}</option>
                <option value="specific">{isUrdu ? "Specific User" : "Specific User"}</option>
              </select>
            </div>
          </div>

          {/* Loading state */}
          {historyLoading && (
            <div className="space-y-3 py-8">
              {[1, 2, 3].map((i) => (
                <div key={i} className="h-16 bg-slate-100 rounded-xl animate-pulse" />
              ))}
            </div>
          )}

          {/* Error state */}
          {!historyLoading && historyError && (
            <div className="py-8 text-center flex flex-col items-center gap-2">
              <AlertTriangle className="w-8 h-8 text-amber-500" />
              <p className="text-xs text-slate-600">{historyError}</p>
              <button
                type="button"
                onClick={loadHistory}
                className="px-3 py-1.5 bg-[#A8793E] text-white rounded-lg text-xs font-bold"
              >
                {isUrdu ? "دوبارہ کوشش کریں" : "Try Again"}
              </button>
            </div>
          )}

          {/* Empty state */}
          {!historyLoading && !historyError && filteredCampaigns.length === 0 && (
            <div className="py-12 text-center flex flex-col items-center justify-center gap-2 text-slate-400">
              <div className="w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center text-slate-400">
                <Bell className="w-6 h-6" />
              </div>
              <p className="text-sm font-bold text-slate-700">
                {isUrdu ? "کوئی نوٹیفیکیشن مہم نہیں ملی" : "No notification campaigns found"}
              </p>
              <p className="text-xs text-slate-400">
                {isUrdu ? "اوپر موجود فارم سے پہلا نوٹیفیکیشن ارسال کریں۔" : "Send your first notification using the composer tab."}
              </p>
            </div>
          )}

          {/* Table */}
          {!historyLoading && !historyError && filteredCampaigns.length > 0 && (
            <div className="overflow-x-auto">
              <table className="w-full text-right text-xs border-collapse" dir={isUrdu ? "rtl" : "ltr"}>
                <thead>
                  <tr className="border-b border-slate-200 bg-slate-50/75 text-slate-500 font-bold">
                    <th className="py-3 px-3.5 text-right">{isUrdu ? "عنوان و پیغام" : "Notification"}</th>
                    <th className="py-3 px-3 text-center">{isUrdu ? "مخاطب" : "Audience"}</th>
                    <th className="py-3 px-3 text-center">{isUrdu ? "ارسال شدہ" : "Sent"}</th>
                    <th className="py-3 px-3 text-center">{isUrdu ? "پڑھا گیا" : "Read"}</th>
                    <th className="py-3 px-3 text-center">{isUrdu ? "پڑھنے کی شرح" : "Read Rate"}</th>
                    <th className="py-3 px-3 text-center">{isUrdu ? "تاریخ" : "Date"}</th>
                    <th className="py-3 px-3 text-center">{isUrdu ? "تفصیلات" : "Action"}</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filteredCampaigns.map((c) => {
                    const aud = AUDIENCE_CONFIG[c.audience] || AUDIENCE_CONFIG.everyone;
                    const typeCfg = TYPE_CONFIG[c.type] || TYPE_CONFIG.general;
                    const TypeIcon = typeCfg.icon;

                    return (
                      <tr key={c._id} className="hover:bg-slate-50/80 transition-colors">
                        {/* Title & Preview */}
                        <td className="py-3.5 px-3.5 max-w-xs">
                          <div className="flex items-start gap-2">
                            <span
                              className="p-1 rounded-md shrink-0 mt-0.5"
                              style={{ backgroundColor: typeCfg.bg, color: typeCfg.color }}
                              title={typeCfg.labelEn}
                            >
                              <TypeIcon className="w-3.5 h-3.5" />
                            </span>
                            <div className="min-w-0">
                              <p className="font-bold text-slate-800 truncate">{c.title}</p>
                              <p className="text-[11px] text-slate-400 line-clamp-1">{c.message}</p>
                            </div>
                          </div>
                        </td>

                        {/* Audience */}
                        <td className="py-3.5 px-3 text-center">
                          <span
                            className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10.5px] font-semibold"
                            style={{ backgroundColor: aud.bg, color: aud.color }}
                          >
                            <aud.icon className="w-3 h-3" />
                            <span>
                              {c.audience === "specific" && c.recipient?.name
                                ? c.recipient.name
                                : isUrdu ? aud.labelUrdu.split("(")[0] : aud.labelEn.split("(")[0]}
                            </span>
                          </span>
                        </td>

                        {/* Sent */}
                        <td className="py-3.5 px-3 text-center font-mono font-bold text-slate-700">
                          {c.sent || 0}
                          {c.totalRecipients > 0 && (
                            <span className="text-slate-400 text-[10px] font-normal"> / {c.totalRecipients}</span>
                          )}
                        </td>

                        {/* Read */}
                        <td className="py-3.5 px-3 text-center font-mono text-emerald-700 font-bold">
                          {c.read || 0}
                        </td>

                        {/* Read Rate */}
                        <td className="py-3.5 px-3 text-center">
                          <span className="inline-block px-2 py-0.5 text-[11px] font-bold rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
                            {typeof c.readRate === "number" ? `${c.readRate}%` : "0%"}
                          </span>
                        </td>

                        {/* Date */}
                        <td className="py-3.5 px-3 text-center text-[11px] text-slate-500 font-mono">
                          {c.createdAt
                            ? new Date(c.createdAt).toLocaleDateString(isUrdu ? "ur-PK" : "en-US", {
                                month: "short",
                                day: "numeric",
                                hour: "2-digit",
                                minute: "2-digit",
                              })
                            : "-"}
                        </td>

                        {/* Action View */}
                        <td className="py-3.5 px-3 text-center">
                          <button
                            type="button"
                            onClick={() => handleViewDetails(c)}
                            className="inline-flex items-center gap-1 px-2.5 py-1 bg-slate-100 hover:bg-[#A8793E] hover:text-white text-slate-700 rounded-lg text-xs font-semibold transition-colors cursor-pointer"
                          >
                            <Eye className="w-3.5 h-3.5" />
                            <span>{isUrdu ? "دیکھیں" : "View"}</span>
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {/* ── TAB 3: ANALYTICS & STATS ── */}
      {activeTab === "overview" && (
        <div className="space-y-6">
          {/* Stats Metric Cards Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4">
            {/* Total Campaigns */}
            <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-xs flex flex-col justify-between">
              <span className="text-[11px] font-bold text-slate-400 uppercase">{isUrdu ? "کل مہمات" : "Total Campaigns"}</span>
              <p className="text-2xl font-black text-slate-800 mt-2 font-mono">{stats?.totalCampaigns ?? 0}</p>
            </div>

            {/* Total Recipients */}
            <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-xs flex flex-col justify-between">
              <span className="text-[11px] font-bold text-slate-400 uppercase">{isUrdu ? "کل وصول کنندگان" : "Total Recipients"}</span>
              <p className="text-2xl font-black text-blue-700 mt-2 font-mono">{stats?.totalRecipients ?? 0}</p>
            </div>

            {/* Total Sent */}
            <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-xs flex flex-col justify-between">
              <span className="text-[11px] font-bold text-slate-400 uppercase">{isUrdu ? "ارسال شدہ" : "Sent"}</span>
              <p className="text-2xl font-black text-emerald-700 mt-2 font-mono">{stats?.totalSent ?? 0}</p>
            </div>

            {/* Total Read */}
            <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-xs flex flex-col justify-between">
              <span className="text-[11px] font-bold text-slate-400 uppercase">{isUrdu ? "پڑھا گیا" : "Read"}</span>
              <p className="text-2xl font-black text-indigo-700 mt-2 font-mono">{stats?.totalRead ?? 0}</p>
            </div>

            {/* Total Pending */}
            <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-xs flex flex-col justify-between">
              <span className="text-[11px] font-bold text-slate-400 uppercase">{isUrdu ? "زیر التواء" : "Pending"}</span>
              <p className="text-2xl font-black text-amber-600 mt-2 font-mono">{stats?.totalPending ?? 0}</p>
            </div>

            {/* Read Rate */}
            <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-xs flex flex-col justify-between">
              <span className="text-[11px] font-bold text-slate-400 uppercase">{isUrdu ? "پڑھنے کی شرح" : "Read Rate"}</span>
              <p className="text-2xl font-black text-teal-700 mt-2 font-mono">{stats?.readRate ? `${stats.readRate}%` : "0%"}</p>
            </div>
          </div>

          {/* Performance Summary Banner */}
          <div className="bg-gradient-to-br from-[#2B2118] via-[#33261C] to-[#1E1610] text-white rounded-2xl p-6 shadow-xl border border-[#A8793E]/40 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="space-y-1">
              <h3 className="text-base font-bold text-[#DFC8A4] flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-[#A8793E]" />
                {isUrdu ? "پش نوٹیفیکیشنز پرفارمنس کا جائزہ" : "FCM Push Delivery Performance Overview"}
              </h3>
              <p className="text-xs text-[#F7F1E8]/70">
                {isUrdu
                  ? "نوٹیفیکیشنز کی ترسیل فوری طور پر بیک اینڈ اور فائر بیس کلاؤڈ میسجنگ انجن سے ہم آہنگ رہتی ہے۔"
                  : "Notifications are dispatched real-time via Firebase Cloud Messaging across desktop and mobile devices."}
              </p>
            </div>

            <button
              type="button"
              onClick={() => setActiveTab("composer")}
              className="px-4 py-2 bg-[#A8793E] hover:bg-[#DFC8A4] text-[#2B2118] font-bold rounded-xl text-xs transition-colors cursor-pointer shrink-0"
            >
              {isUrdu ? "+ نیا نوٹیفیکیشن تحریر کریں" : "+ Compose Notification"}
            </button>
          </div>
        </div>
      )}

      {/* ── CONFIRMATION MODAL BEFORE SENDING ── */}
      {showConfirmModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white border border-slate-200 rounded-2xl max-w-md w-full p-5 shadow-2xl space-y-4 animate-in fade-in zoom-in-95">
            <div className="flex items-center gap-3 text-amber-600">
              <div className="w-10 h-10 rounded-full bg-amber-100 flex items-center justify-center shrink-0">
                <AlertTriangle className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-slate-800">
                  {isUrdu ? "نوٹیفیکیشن ارسال کرنے کی تصدیق" : "Confirm Notification Dispatch"}
                </h3>
                <p className="text-xs text-slate-500">
                  {isUrdu ? "کیا آپ واقعی یہ نوٹیفیکیشن بھیجنا چاہتے ہیں؟" : "Are you sure you want to broadcast this campaign?"}
                </p>
              </div>
            </div>

            <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-xs space-y-1.5">
              <p><span className="font-bold text-slate-700">{isUrdu ? "عنوان:" : "Title:"}</span> {title}</p>
              <p><span className="font-bold text-slate-700">{isUrdu ? "مخاطب:" : "Audience:"}</span> {AUDIENCE_CONFIG[audience]?.labelEn}</p>
              {audience === "specific" && recipient && (
                <p><span className="font-bold text-slate-700">{isUrdu ? "صارف:" : "Recipient:"}</span> {recipient.name} ({recipient.loginEmail || recipient.loginPhone || "صارف"})</p>
              )}
              {selectedContent && (
                <p><span className="font-bold text-slate-700">{isUrdu ? "متعلقہ مواد:" : "Related Content:"}</span> {selectedContent.questionTitle || selectedContent.title || selectedContent.titleUrdu || selectedContent.fatwaNumber}</p>
              )}
              {targetLink && (
                <p><span className="font-bold text-slate-700">{isUrdu ? "ہدف روٹ:" : "Target Route:"}</span> <span className="font-mono text-emerald-700 font-bold">🔒 {targetLink}</span></p>
              )}
            </div>

            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setShowConfirmModal(false)}
                className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold transition-colors cursor-pointer"
              >
                {isUrdu ? "منسوخ کریں" : "Cancel"}
              </button>
              <button
                type="button"
                onClick={handleSendNotification}
                disabled={isSending}
                className="px-5 py-2 bg-[#A8793E] hover:bg-[#785424] text-white rounded-xl text-xs font-bold transition-colors cursor-pointer flex items-center gap-2"
              >
                <Send className="w-3.5 h-3.5" />
                <span>{isUrdu ? "ہاں، ارسال کریں" : "Yes, Broadcast Now"}</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── CAMPAIGN DETAILS MODAL ── */}
      {selectedCampaign && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white border border-slate-200 rounded-2xl max-w-lg w-full p-5 sm:p-6 shadow-2xl space-y-4 animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <FileText className="w-5 h-5 text-[#A8793E]" />
                <h3 className="text-base font-bold text-slate-800">
                  {isUrdu ? "نوٹیفیکیشن مہم کی تفصیلات" : "Campaign Details"}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setSelectedCampaign(null)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Campaign info */}
            <div className="space-y-3 text-xs">
              <div>
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">{isUrdu ? "عنوان" : "Title"}</span>
                <p className="text-sm font-bold text-slate-800 mt-0.5">{selectedCampaign.title}</p>
              </div>

              <div>
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">{isUrdu ? "پیغام" : "Message"}</span>
                <p className="text-xs text-slate-700 mt-0.5 leading-relaxed bg-slate-50 p-2.5 rounded-xl border border-slate-100">
                  {selectedCampaign.message}
                </p>
              </div>

              <div className="grid grid-cols-2 gap-2 pt-1">
                <div>
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">{isUrdu ? "مخاطب" : "Audience"}</span>
                  <p className="font-semibold text-slate-800 capitalize">{selectedCampaign.audience}</p>
                </div>
                <div>
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">{isUrdu ? "قسم" : "Type"}</span>
                  <p className="font-semibold text-slate-800 capitalize">{selectedCampaign.type}</p>
                </div>
              </div>

              {selectedCampaign.data?.link && (
                <div>
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">{isUrdu ? "ہدف لنک" : "Target Link"}</span>
                  <p className="text-xs text-blue-600 font-mono mt-0.5 break-all">{selectedCampaign.data.link}</p>
                </div>
              )}

              {/* Metrics Grid */}
              <div className="pt-2 border-t border-slate-100">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-2">{isUrdu ? "کارکردگی و اعداد و شمار" : "Delivery Metrics"}</span>
                <div className="grid grid-cols-3 gap-2">
                  <div className="p-2.5 bg-slate-50 rounded-xl border border-slate-200 text-center">
                    <span className="text-[10px] text-slate-400">{isUrdu ? "ارسال شدہ" : "Sent"}</span>
                    <p className="text-base font-bold text-slate-800 font-mono">{selectedCampaign.sent || 0}</p>
                  </div>
                  <div className="p-2.5 bg-emerald-50 rounded-xl border border-emerald-200 text-center">
                    <span className="text-[10px] text-emerald-600">{isUrdu ? "پڑھا گیا" : "Read"}</span>
                    <p className="text-base font-bold text-emerald-800 font-mono">{selectedCampaign.read || 0}</p>
                  </div>
                  <div className="p-2.5 bg-indigo-50 rounded-xl border border-indigo-200 text-center">
                    <span className="text-[10px] text-indigo-600">{isUrdu ? "شرح" : "Read Rate"}</span>
                    <p className="text-base font-bold text-indigo-800 font-mono">{selectedCampaign.readRate || 0}%</p>
                  </div>
                </div>
              </div>

              {selectedCampaign.createdAt && (
                <p className="text-[10px] text-slate-400 pt-2 border-t border-slate-100 text-right">
                  {isUrdu ? "ارسال کی تاریخ:" : "Created:"} {new Date(selectedCampaign.createdAt).toLocaleString(isUrdu ? "ur-PK" : "en-US")}
                </p>
              )}
            </div>

            <div className="pt-2 flex justify-end">
              <button
                type="button"
                onClick={() => setSelectedCampaign(null)}
                className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold transition-colors cursor-pointer"
              >
                {isUrdu ? "بند کریں" : "Close"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
