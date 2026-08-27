import React, { useState, useEffect } from "react";
import { Outlet, NavLink, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  LayoutDashboard,
  FileText,
  Bookmark,
  HelpCircle,
  BookOpen,
  Mic,
  CalendarDays,
  Users,
  Settings,
  LogOut,
  Menu,
  X,
  Shield,
  ChevronRight,
  Globe,
  ChevronLeft,
  Bell,
  MessageSquare,
  Youtube,
} from "lucide-react";
import { logout } from "@/store/slices/authSlice";
import { logoutUser } from "@/services";
import toast from "react-hot-toast";
import { ConfirmationBox } from "@/components";

const NAV_LINKS = [
  { to: "/", label: "عوامی ویب سائٹ", icon: Globe },
  { to: "/admin/dashboard", label: "ڈیش بورڈ", icon: LayoutDashboard },
  { to: "/admin/articles", label: "مقالات", icon: FileText },
  { to: "/admin/fatwas", label: "فتاویٰ", icon: Bookmark },
  { to: "/admin/questions", label: "سوالات", icon: HelpCircle },
  { to: "/admin/publications", label: "مطبوعات", icon: BookOpen },
  { to: "/admin/lectures", label: "بیانات", icon: Mic },
  { to: "/admin/events", label: "پروگرامات", icon: CalendarDays },
  { to: "/admin/users", label: "صارفین", icon: Users },
  { to: "/admin/comments", label: "تبصرے", icon: MessageSquare },
  { to: "/admin/settings", label: "ترتیبات", icon: Settings },
  // { to: '/admin/youtube', label: 'یوٹیوب', icon: Youtube },
];

// Premium gradient sidebar palette
const SB = {
  bg: "linear-gradient(160deg, #0f172a 0%, #1e1b4b 60%, #312e81 100%)",
  border: "rgba(129,140,248,0.15)",
  active: "rgba(251,191,36,0.18)",
  activeBorder: "#fbbf24",
  activeText: "#fde68a",
  hoverBg: "rgba(255,255,255,0.07)",
  icon: "#818cf8",
  iconActive: "#fbbf24",
  text: "#c7d2fe",
  textMuted: "#6d7fc7",
  divider: "rgba(129,140,248,0.12)",
};

export default function AdminLayout() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const { loggedInUser } = useSelector((state) => state.auth);

  const [collapsed, setCollapsed] = useState(false); // desktop collapse
  const [mobileOpen, setMobileOpen] = useState(false); // mobile slide-over

  const [notifications, setNotifications] = useState([]);
  const [showNotifDropdown, setShowNotifDropdown] = useState(false);

  const handleNotificationClick = (notif) => {
    // Remove from notification list
    setNotifications((prev) => prev.filter((n) => n._id !== notif._id));
    setShowNotifDropdown(false);

    // Route to corresponding management section
    if (notif.contentType === "article") {
      navigate("/admin/articles");
    } else if (notif.contentType === "fatwa") {
      navigate("/admin/fatwas");
    } else if (notif.contentType === "book") {
      navigate("/admin/publications");
    }
  };

  const handleConfirmLogout = async () => {
    setShowLogoutModal(false);
    try {
      await logoutUser();
    } catch (err) {
      console.warn("Logout request failed:", err);
    }
    dispatch(logout());
    toast.success("کامیابی سے لاگ آؤٹ ہو گئے");
    navigate("/");
  };

  const sidebarW = collapsed ? "w-[68px]" : "w-64";

  return (
    <div
      className="flex h-screen overflow-hidden"
      style={{ background: "#f1f5f9" }}
    >
      {/* ── Mobile backdrop ── */}
      {mobileOpen && (
        <div
          className="fixed inset-0 z-20 lg:hidden"
          style={{
            background: "rgba(15,23,42,0.6)",
            backdropFilter: "blur(2px)",
          }}
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* ══════════════ SIDEBAR ══════════════ */}
      <aside
        style={{ background: SB.bg, borderRight: `1px solid ${SB.border}` }}
        className={`
          fixed inset-y-0 left-0 z-30 flex flex-col h-screen
          ${sidebarW}
          transition-[width] duration-300 ease-in-out
          shadow-[4px_0_32px_rgba(0,0,0,0.35)]
          lg:translate-x-0 lg:static lg:z-auto lg:h-screen
          ${mobileOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}
        `}
      >
        {/* ── Brand header ── */}
        <div
          className="flex items-center flex-shrink-0 px-3 py-4"
          style={{
            borderBottom: `1px solid ${SB.divider}`,
            gap: collapsed ? "0" : "10px",
          }}
        >
          {/* Shield logo — always visible */}
          <div
            className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0"
            style={{
              background: "linear-gradient(135deg,#fbbf24,#f59e0b)",
              boxShadow: "0 4px 12px rgba(251,191,36,0.35)",
            }}
          >
            <Shield className="w-4 h-4 text-white" />
          </div>

          {/* Brand text — hidden when collapsed */}
          {!collapsed && (
            <div
              className="min-w-0 flex-1 text-right overflow-hidden"
              dir="rtl"
            >
              <p className="text-sm font-bold text-white truncate">
                جامعہ بنوری ٹاؤن
              </p>
              <p
                className="text-[10px] font-medium"
                style={{ color: SB.textMuted }}
              >
                ایڈمن پینل
              </p>
            </div>
          )}

          {/* ── Collapse toggle — ALWAYS visible on desktop ── */}
          <button
            onClick={() => setCollapsed(!collapsed)}
            className="hidden lg:flex items-center justify-center w-7 h-7 rounded-lg flex-shrink-0"
            style={{
              marginLeft: collapsed ? "auto" : undefined,
              marginRight: collapsed ? "auto" : undefined,
              background: "rgba(255,255,255,0.10)",
              color: SB.text,
            }}
            title={collapsed ? "سائیڈبار کھولیں" : "سائیڈبار بند کریں"}
          >
            {collapsed ? (
              <ChevronRight className="w-3.5 h-3.5" />
            ) : (
              <ChevronLeft className="w-3.5 h-3.5" />
            )}
          </button>

          {/* Mobile close — only on mobile */}
          <button
            className="lg:hidden ml-auto text-indigo-300"
            onClick={() => setMobileOpen(false)}
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* ── Navigation ── */}
        <nav className="flex-1 overflow-y-auto py-3 px-2 space-y-0.5" dir="rtl">
          {NAV_LINKS.map(({ to, label, icon: Icon }) => (
            <NavLink
              key={to}
              to={to}
              onClick={() => setMobileOpen(false)}
              title={collapsed ? label : ""}
              className="block"
            >
              {({ isActive }) => (
                <div
                  className="flex items-center gap-3 px-3 py-2.5 rounded-xl cursor-pointer relative"
                  style={{
                    background: isActive ? SB.active : "transparent",
                    borderLeft: isActive
                      ? `3px solid ${SB.activeBorder}`
                      : "3px solid transparent",
                    color: isActive ? SB.activeText : SB.text,
                  }}
                  onMouseEnter={(e) => {
                    if (!isActive)
                      e.currentTarget.style.background = SB.hoverBg;
                  }}
                  onMouseLeave={(e) => {
                    if (!isActive)
                      e.currentTarget.style.background = "transparent";
                  }}
                >
                  <Icon
                    className="w-4 h-4 flex-shrink-0"
                    style={{ color: isActive ? SB.iconActive : SB.icon }}
                  />
                  {!collapsed && (
                    <span className="text-sm font-medium flex-1 leading-none">
                      {label}
                    </span>
                  )}
                </div>
              )}
            </NavLink>
          ))}
        </nav>

        {/* ── User + Logout ── */}
        <div
          style={{ borderTop: `1px solid ${SB.divider}` }}
          className="px-3 py-3 space-y-2"
        >
          {!collapsed && (
            <div className="flex items-center gap-2 px-1" dir="rtl">
              <div
                className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0"
                style={{
                  background: "rgba(129,140,248,0.2)",
                  color: "#818cf8",
                }}
              >
                <Users className="w-4 h-4" />
              </div>
              <div className="min-w-0 text-right">
                <p className="text-sm font-semibold text-white truncate">
                  {loggedInUser?.name || "ایڈمنسٹریٹر"}
                </p>
                <p className="text-xs truncate" style={{ color: SB.textMuted }}>
                  {loggedInUser?.loginEmail || ""}
                </p>
              </div>
            </div>
          )}
          <button
            onClick={() => setShowLogoutModal(true)}
            title={collapsed ? "لاگ آؤٹ" : ""}
            className="flex items-center gap-2 w-full px-3 py-2 rounded-xl text-sm font-medium"
            style={{
              background: "rgba(239,68,68,0.12)",
              border: "1px solid rgba(239,68,68,0.25)",
              color: "#fca5a5",
            }}
            dir="rtl"
            onMouseEnter={(e) =>
              (e.currentTarget.style.background = "rgba(239,68,68,0.22)")
            }
            onMouseLeave={(e) =>
              (e.currentTarget.style.background = "rgba(239,68,68,0.12)")
            }
          >
            <LogOut className="w-4 h-4 flex-shrink-0" />
            {!collapsed && <span>لاگ آؤٹ</span>}
          </button>
        </div>
      </aside>

      {/* ══════════════ MAIN CONTENT ══════════════ */}
      <div className="flex flex-col flex-1 min-w-0 overflow-hidden">
        {/* Top bar */}
        <header
          className="flex items-center gap-3 h-14 px-5 flex-shrink-0"
          style={{
            background: "#ffffff",
            borderBottom: "1px solid #e2e8f0",
            boxShadow: "0 1px 12px rgba(15,23,42,0.06)",
          }}
        >
          {/* Mobile hamburger */}
          <button
            className="lg:hidden text-slate-500 hover:text-slate-900"
            onClick={() => setMobileOpen(true)}
          >
            <Menu className="w-5 h-5" />
          </button>

          {/* Breadcrumb */}
          <div className="flex items-center gap-2 text-sm" dir="rtl">
            <Shield className="w-4 h-4 text-indigo-400" />
            <span className="font-bold text-slate-800">ایڈمن پورٹل</span>
            <span className="text-slate-300">/</span>
            <span className="text-slate-500 font-light">جامعہ بنوری ٹاؤن</span>
          </div>

          <div className="mr-auto flex items-center gap-3">
            {/* View Live Website Quick Button */}
            <NavLink
              to="/"
              target="_blank"
              className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-indigo-50 text-indigo-700 hover:bg-indigo-100 transition-colors border border-indigo-200"
            >
              <Globe className="w-3.5 h-3.5" />
              <span>لائیو ویب سائٹ</span>
            </NavLink>

            {/* Notification Bell */}
            <div className="relative">
              <button
                onClick={() => setShowNotifDropdown(!showNotifDropdown)}
                className="relative p-2 rounded-xl text-slate-500 hover:text-slate-900 hover:bg-slate-100 transition-colors"
              >
                <Bell className="w-5 h-5" />
                {notifications.length > 0 && (
                  <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-red-500 ring-2 ring-white"></span>
                )}
              </button>

              {/* Notification dropdown */}
              {showNotifDropdown && (
                <div
                  className="absolute left-0 mt-2 w-80 rounded-2xl bg-white shadow-2xl p-4 z-50 border border-slate-100"
                  dir="rtl"
                >
                  <div className="flex justify-between items-center pb-3 border-b border-slate-100 mb-3">
                    <span className="text-xs font-bold text-slate-800">
                      اطلاعات (Notifications)
                    </span>
                    <span className="text-[10px] text-accent font-semibold px-2 py-0.5 rounded-full bg-amber-50">
                      {notifications.length} نئی
                    </span>
                  </div>
                  {notifications.length === 0 ? (
                    <p className="text-center py-6 text-xs text-slate-400 font-bold">
                      کوئی نیا نوٹیفیکیشن نہیں ہے
                    </p>
                  ) : (
                    <div className="space-y-2 max-h-[300px] overflow-y-auto">
                      {notifications.map((n, idx) => (
                        <div
                          key={idx}
                          onClick={() => handleNotificationClick(n)}
                          className="p-2.5 rounded-lg bg-slate-50 border border-slate-100 flex flex-col gap-1 text-right cursor-pointer hover:bg-slate-100 transition-colors"
                        >
                          <div className="flex justify-between items-center text-[10px]">
                            <span className="font-bold text-primary">
                              {n.user?.name || "صارف"}
                            </span>
                            <span className="text-slate-400 font-light">
                              {n.contentType === "article"
                                ? "مضمون"
                                : n.contentType === "fatwa"
                                  ? "فتویٰ"
                                  : "کتاب"}
                            </span>
                          </div>
                          <p className="text-xs text-slate-700 font-medium leading-relaxed">
                            "{n.text}"
                          </p>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 overflow-y-auto">
          <Outlet />
        </main>
      </div>

      {/* Logout Confirmation Box */}
      <ConfirmationBox
        isOpen={showLogoutModal}
        onClose={() => setShowLogoutModal(false)}
        onConfirm={handleConfirmLogout}
        title="لاگ آؤٹ کی تصدیق"
        message="کیا آپ واقعی ایڈمن پینل سے لاگ آؤٹ کرنا چاہتے ہیں؟"
        type="warning"
        confirmText="ہاں، لاگ آؤٹ کریں"
        cancelText="منسوخ کریں"
      />
    </div>
  );
}
