import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { motion, AnimatePresence } from "framer-motion";
import {
  Menu,
  X,
  BookOpen,
  User,
  HelpCircle,
  LogOut,
  LayoutDashboard,
  Settings,
} from "lucide-react";
import { logout } from "@/store/slices/authSlice";
import { useSettings } from "@/hooks/useSettings";
import { COLORS } from "@/utils/themeColors";
import { logoutUser } from "@/services";
import Modal from "@/components/Modal/Modal";
import Login from "@/pages/Admin/pages/Login";
import Signup from "@/pages/Admin/pages/Signup";

import { CATEGORY_MAP } from "@/utils/categories";

export default function Navbar() {
  const location = useLocation();
  const dispatch = useDispatch();
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authMode, setAuthMode] = useState("login"); // "login" | "signup"

  const openLogin = () => {
    setAuthMode("login");
    setIsAuthModalOpen(true);
  };

  const openSignup = () => {
    setAuthMode("signup");
    setIsAuthModalOpen(true);
  };

  const closeAuthModal = () => {
    setIsAuthModalOpen(false);
  };
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [hoveredIndex, setHoveredIndex] = useState(null);
  const [mobileOpenDropdown, setMobileOpenDropdown] = useState(null);

  const { isAuthenticated, loggedInUser, userRole } = useSelector(
    (state) => state.auth
  );
  const [showProfileDropdown, setShowProfileDropdown] = useState(false);

  useEffect(() => {
    if (isAuthenticated && isAuthModalOpen) {
      setIsAuthModalOpen(false);
    }
  }, [isAuthenticated, isAuthModalOpen]);

  const getInitials = (user) => {
    if (!user) return "U";
    const name = user.name;
    const email = user.loginEmail;

    if (name && name.trim()) {
      if (!name.includes("@")) {
        return name
          .trim()
          .split(/\s+/)
          .map((word) => word[0])
          .join("")
          .toUpperCase()
          .slice(0, 3);
      }
    }

    if (email && email.trim()) {
      const username = email.split("@")[0];
      return username
        .split(/[._-]/)
        .filter(Boolean)
        .map((word) => word[0])
        .join("")
        .toUpperCase()
        .slice(0, 3);
    }

    if (user.loginPhone) {
      return user.loginPhone.slice(-4);
    }

    return "U";
  };

  useEffect(() => {
    if (!showProfileDropdown) return;
    const clickAway = () => setShowProfileDropdown(false);
    window.addEventListener("click", clickAway);
    return () => window.removeEventListener("click", clickAway);
  }, [showProfileDropdown]);
  const { settings } = useSettings();
  const language =
    settings?.language === "ur" || settings?.language === "Urdu" ? "ur" : "en";

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 20) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const closeMenu = () => {
    setIsOpen(false);
    setMobileOpenDropdown(null);
  };

  const handleLogout = async () => {
    try {
      await logoutUser();
    } catch (err) {
      console.warn("API logout failed, clearing local state anyway", err);
    }
    dispatch(logout());
    closeMenu();
    window.location.reload();
  };

  const allItems = [
    {
      label: language === "en" ? "Home" : "صفحہ اول",
      href: "/",
      hasDropdown: false,
    },
    {
      label: language === "en" ? "About" : "تعارف",
      href: "/about",
      hasDropdown: false,
    },
    {
      label: language === "en" ? "Fatwas" : "فقہ و فتاویٰ",
      href: "/fatwas",
      hasDropdown: true,
      hasCategories: true,
      categories: CATEGORY_MAP.fatwas,
    },
    {
      label: language === "en" ? "Publications" : "کتب و رسائل",
      href: "/publications",
      hasDropdown: true,
      hasCategories: true,
      categories: CATEGORY_MAP.publications,
    },
    {
      label: language === "en" ? "Articles" : "مضامین و مقالات",
      href: "/articles",
      hasDropdown: true,
      hasCategories: true,
      categories: CATEGORY_MAP.articles,
    },
    {
      label: language === "en" ? "Lectures" : "خطبات",
      href: "/lectures",
      hasDropdown: true,
      hasCategories: true,
      categories: CATEGORY_MAP.lectures,
    },
    // { label: language === "en" ? "Videos" : "ویڈیوز", href: "/youtube-videos", hasDropdown: false },
    {
      label: language === "en" ? "Q&A" : "سوال و جواب",
      href: "/qa",
      hasDropdown: true,
      hasCategories: true,
      categories: CATEGORY_MAP.qa,
    },
    {
      label: language === "en" ? "Events" : "پروگرام",
      href: "/events",
      hasDropdown: false,
    },
    {
      label: language === "en" ? "Contact" : "رابطہ",
      href: "/contact",
      hasDropdown: false,
    },
  ];

  return (
    <header
      className={`sticky top-0 z-40 w-full transition-all duration-300 border-b flex items-center ${
        scrolled ? "h-16 shadow-md" : "h-20"
      }`}
      style={{
        backgroundColor: scrolled ? COLORS.white : `rgba(247, 244, 239, 0.95)`,
        borderColor: COLORS.border,
      }}
    >
      <div
        className="mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between w-full h-full"
        dir={language === "ur" ? "rtl" : "ltr"}
      >
        <Link
          to="/"
          className="flex items-center gap-3 hover:opacity-95 transition-opacity shrink-0"
        >
          <div
            style={{ backgroundColor: COLORS.primary }}
            className="w-10 h-10 rounded-full flex items-center justify-center shadow-md shrink-0"
          >
            <BookOpen className="w-5 h-5" style={{ color: COLORS.accent }} />
          </div>
        </Link>

        {/* Desktop Navigation Links */}
        <nav className="hidden lg:flex items-stretch h-full gap-0">
          {allItems.map((item, index) => {
            const isActive =
              location.pathname === item.href ||
              (item.href !== "/" && location.pathname.startsWith(item.href));
            const isHovered = hoveredIndex === index;

            return (
              <React.Fragment key={item.label}>
                <div
                  className="h-full flex items-center relative"
                  onMouseEnter={() => setHoveredIndex(index)}
                  onMouseLeave={() => setHoveredIndex(null)}
                >
                  <Link
                    to={item.href}
                    style={{
                      backgroundColor: isHovered
                        ? COLORS.primary
                        : "transparent",
                      color: isHovered
                        ? COLORS.white
                        : isActive
                          ? COLORS.primary
                          : COLORS.textSecondary,
                      borderTop: isHovered
                        ? `3px solid ${COLORS.accent}`
                        : "3px solid transparent",
                    }}
                    className={`h-full px-4 xl:px-5 flex items-center gap-1.5 text-[15px] xl:text-[16px] font-semibold transition-all duration-300`}
                  >
                    <span>{item.label}</span>
                  </Link>

                  {/* Floating Submenu Dropdown Panel */}
                  <AnimatePresence>
                    {isHovered && item.hasDropdown && (
                      <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        transition={{ duration: 0.28, ease: "easeOut" }}
                        style={{
                          backgroundColor: COLORS.primary,
                          borderColor: COLORS.accent,
                          zIndex: 9999,
                        }}
                        className={`absolute ${
                          language === "ur"
                            ? "right-0 text-right"
                            : "left-0 text-left"
                        } top-full w-[360px] shadow-2xl border-x border-b overflow-hidden rounded-none mt-0`}
                      >
                        <ul className="divide-y divide-[rgba(184,156,125,0.18)] max-h-[50vh] overflow-y-auto custom-scrollbar">
                          {item.hasCategories ? (
                            <>
                              <li>
                                <Link
                                  to={item.href}
                                  className="flex items-center px-6 h-[64px] text-[15px] font-medium text-white transition-all duration-300 hover:bg-[rgba(255,255,255,0.06)]"
                                  style={{
                                    borderRight:
                                      language === "ur"
                                        ? `4px solid ${COLORS.accent}`
                                        : "none",
                                    borderLeft:
                                      language === "en"
                                        ? `4px solid ${COLORS.accent}`
                                        : "none",
                                  }}
                                >
                                  {language === "ur"
                                    ? "تمام موضوعات"
                                    : "All Topics"}
                                </Link>
                              </li>
                              {item.categories.map((cat) => {
                                const isSubActive = location.search.includes(
                                  cat.value
                                );
                                return (
                                  <li key={cat.value}>
                                    <Link
                                      to={`${item.href}?category=${encodeURIComponent(cat.value)}`}
                                      style={{
                                        color: isSubActive
                                          ? COLORS.accent
                                          : COLORS.white,
                                      }}
                                      className="flex items-center px-6 h-[64px] text-[15px] font-medium transition-all duration-300 hover:bg-[rgba(255,255,255,0.06)]"
                                    >
                                      {language === "ur"
                                        ? cat.labelUr
                                        : cat.labelEn}
                                    </Link>
                                  </li>
                                );
                              })}
                            </>
                          ) : (
                            item.dropdownItems.map((sub) => {
                              const isSubActive =
                                location.pathname === sub.href;
                              return (
                                <li key={sub.label}>
                                  <Link
                                    to={sub.href}
                                    style={{
                                      color: isSubActive
                                        ? COLORS.accent
                                        : COLORS.white,
                                    }}
                                    className="flex items-center px-6 h-[64px] text-[15px] font-medium transition-all duration-300 hover:bg-[rgba(255,255,255,0.06)]"
                                  >
                                    {sub.label}
                                  </Link>
                                </li>
                              );
                            })
                          )}
                        </ul>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
                {index < allItems.length - 1 && (
                  <div
                    className="self-center w-[1px] h-5"
                    style={{ backgroundColor: COLORS.border }}
                  />
                )}
              </React.Fragment>
            );
          })}
        </nav>

        <div className="hidden lg:flex items-center gap-3">
          {isAuthenticated || userRole === "admin" ? (
            <div
              className="flex items-center gap-2.5 relative"
              onClick={(e) => e.stopPropagation()}
            >
              {userRole !== "admin" && (
                <Link
                  to="/ask"
                  style={{ backgroundColor: COLORS.primary }}
                  className="flex items-center gap-1.5 px-3.5 py-2 text-xs font-bold text-white rounded-md shadow-sm hover:shadow-md transition-all hover:opacity-90"
                >
                  <HelpCircle
                    className="w-3.5 h-3.5"
                    style={{ color: COLORS.accent }}
                  />
                  {language === "en" ? "Ask" : "سوال"}
                </Link>
              )}
              {userRole === "admin" && (
                <Link
                  to="/admin/dashboard"
                  style={{ backgroundColor: COLORS.primary }}
                  className="flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-white rounded-md shadow-sm hover:shadow-md transition-all hover:opacity-90"
                >
                  <LayoutDashboard
                    className="w-3.5 h-3.5"
                    style={{ color: COLORS.accent }}
                  />
                  ڈیش بورڈ
                </Link>
              )}

              {/* User Profile Badge/Icon Toggle */}
              <button
                onClick={() => setShowProfileDropdown(!showProfileDropdown)}
                style={{ backgroundColor: COLORS.accent, color: COLORS.white }}
                className="w-9 h-9 rounded-full flex items-center justify-center font-bold text-[13px] shadow-sm hover:scale-105 transition-all cursor-pointer border border-white/20 select-none shrink-0"
              >
                {getInitials(loggedInUser)}
              </button>

              {/* Profile Dropdown Menu */}
              {showProfileDropdown && (
                <div
                  style={{ zIndex: 9999 }}
                  className={`absolute ${language === "ur" ? "left-0 text-right" : "right-0 text-left"} top-full mt-2 w-64 bg-white border border-slate-200 rounded-lg shadow-xl p-4 transition-all duration-200`}
                >
                  <div className="flex flex-col gap-1.5 pb-3 border-b border-slate-100">
                    <span className="font-bold text-slate-800 text-sm">
                      {loggedInUser?.name}
                    </span>
                    <span className="text-xs text-slate-500 font-mono">
                      {loggedInUser?.loginEmail ||
                        loggedInUser?.loginPhone ||
                        "-"}
                    </span>
                    {loggedInUser?.contactPhone && (
                      <span className="text-xs text-slate-400 font-mono">
                        {loggedInUser?.contactPhone}
                      </span>
                    )}
                    <span className="self-start mt-1 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider bg-primary/10 text-primary rounded">
                      {loggedInUser?.role || "user"}
                    </span>
                  </div>
                  {/* My Details — visible to all logged-in users */}
                  <Link
                    to="/my-details"
                    onClick={() => setShowProfileDropdown(false)}
                    className="mt-2.5 flex items-center gap-2 w-full px-3 py-2 text-xs font-bold text-primary bg-primary/5 hover:bg-primary/10 rounded border border-primary/15 transition-colors"
                  >
                    <User className="w-3.5 h-3.5 text-primary" />
                    {language === "en" ? "My Details" : "میری تفصیلات"}
                  </Link>
                  {userRole === "admin" && (
                    <Link
                      to="/admin/settings"
                      onClick={() => setShowProfileDropdown(false)}
                      className="mt-2 flex items-center justify-center gap-2 w-full px-3 py-2 text-xs font-bold text-slate-700 bg-slate-50 hover:bg-slate-100 rounded border border-slate-200 transition-colors"
                    >
                      <Settings className="w-3.5 h-3.5 text-slate-500" />
                      {language === "en"
                        ? "Website Settings"
                        : "ویب سائٹ کی ترتیبات"}
                    </Link>
                  )}
                  <button
                    onClick={() => {
                      handleLogout();
                    }}
                    className="mt-3 flex items-center justify-center gap-2 w-full px-3 py-2 text-xs font-bold text-red-700 bg-red-50 hover:bg-red-100 rounded border border-red-150 transition-colors"
                  >
                    <LogOut className="w-3.5 h-3.5" />
                    {language === "en" ? "Logout" : "لاگ آؤٹ"}
                  </button>
                </div>
              )}
            </div>
          ) : (
            <div className="flex items-center gap-3">
              <Link
                to="/ask"
                style={{ backgroundColor: COLORS.primary }}
                className="flex items-center gap-1.5 px-5 py-2.5 text-sm font-bold text-white rounded-md shadow-sm hover:shadow-md transition-all hover:opacity-90"
              >
                <HelpCircle className="w-4 h-4" />
                سوال
              </Link>
              <button
                type="button"
                onClick={openLogin}
                title={
                  language === "en" ? "Login / Signup" : "لاگ ان / سائن اپ"
                }
                className="flex items-center justify-center p-2.5 rounded-md border border-slate-200 text-slate-600 hover:bg-slate-100 hover:text-primary transition-all duration-200 shadow-xs cursor-pointer"
              >
                <User className="w-4.5 h-4.5" />
              </button>
            </div>
          )}
        </div>

        <div className="flex items-center lg:hidden gap-2">
          {userRole !== "admin" && (
            <Link
              to="/ask"
              style={{ backgroundColor: COLORS.primary }}
              className="px-3 py-1.5 text-xs font-bold text-white rounded-full shadow-sm transition-all hover:opacity-90"
            >
              {language === "en" ? "Ask Q" : "سوال پوچھیں"}
            </Link>
          )}
          {!isAuthenticated && userRole !== "admin" && (
            <button
              type="button"
              onClick={openLogin}
              className="p-1.5 rounded-full border border-slate-200 text-slate-600 hover:bg-slate-100 hover:text-primary transition-all duration-200 shadow-xs flex items-center justify-center cursor-pointer"
              title={language === "en" ? "Login / Signup" : "لاگ ان / سائن اپ"}
            >
              <User className="w-4 h-4" />
            </button>
          )}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="p-1.5 rounded text-textSecondary hover:bg-slate-100 focus:outline-none"
            aria-label="Toggle Menu"
          >
            {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {isOpen && (
        <div
          className="lg:hidden fixed inset-0 z-50 bg-slate-900/45 transition-opacity duration-300"
          onClick={closeMenu}
        >
          <div
            style={{
              backgroundColor: COLORS.white,
              borderColor: COLORS.border,
            }}
            className={`fixed top-0 ${language === "ur" ? "left-0 border-r" : "right-0 border-l"} h-full w-[290px] max-w-[85vw] shadow-2xl p-5 flex flex-col overflow-hidden`}
            onClick={(e) => e.stopPropagation()}
            dir={language === "ur" ? "rtl" : "ltr"}
          >
            {/* Header */}
            <div
              className="flex items-center justify-between pb-4 border-b shrink-0"
              style={{ borderColor: COLORS.border }}
            >
              <span
                className="font-bold text-lg"
                style={{ color: COLORS.textPrimary }}
              >
                {language === "en" ? "Navigation" : "نیویگیشن"}
              </span>
              <button
                onClick={closeMenu}
                className="p-1.5 rounded-full text-textSecondary hover:bg-slate-100 hover:text-slate-800 transition-colors"
                aria-label="Close navigation"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Scrollable Nav List */}
            <nav className="flex-1 overflow-y-auto my-3 py-1 pe-1 custom-drawer-scrollbar flex flex-col gap-1.5">
              {allItems.map((item, index) => {
                const isActive =
                  location.pathname === item.href ||
                  (item.href !== "/" &&
                    location.pathname.startsWith(item.href));

                if (!item.hasDropdown) {
                  return (
                    <Link
                      key={item.label}
                      to={item.href}
                      onClick={closeMenu}
                      style={
                        isActive
                          ? {
                              backgroundColor: COLORS.secondary,
                              color: COLORS.primary,
                            }
                          : { color: COLORS.textSecondary }
                      }
                      className={`px-3.5 py-2.5 rounded-lg text-base font-medium transition-all ${isActive ? "font-bold shadow-xs" : "hover:bg-slate-100/80 hover:text-slate-900"}`}
                    >
                      {item.label}
                    </Link>
                  );
                }

                const isDropdownOpen = mobileOpenDropdown === index;
                return (
                  <div key={item.label} className="flex flex-col">
                    <button
                      onClick={() =>
                        setMobileOpenDropdown(isDropdownOpen ? null : index)
                      }
                      style={{ color: COLORS.textSecondary }}
                      className={`flex items-center justify-between px-3.5 py-2.5 rounded-lg text-base font-medium transition-all hover:bg-slate-100/80 hover:text-slate-900 ${isDropdownOpen ? "bg-slate-50 font-semibold" : ""}`}
                    >
                      <span>{item.label}</span>
                      <span
                        className={`text-[10px] transition-transform duration-200 ${isDropdownOpen ? "rotate-180" : ""}`}
                        style={{ color: COLORS.accent }}
                      >
                        ▼
                      </span>
                    </button>
                    <AnimatePresence>
                      {isDropdownOpen && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: "auto", opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          className="overflow-hidden"
                        >
                          <ul
                            style={{
                              backgroundColor: COLORS.primary,
                              borderColor: COLORS.accent,
                            }}
                            className="mt-1.5 mx-1 rounded-lg border overflow-hidden divide-y divide-[rgba(184,156,125,0.18)] shadow-sm"
                          >
                            {item.hasCategories ? (
                              <>
                                <li>
                                  <Link
                                    to={item.href}
                                    onClick={closeMenu}
                                    className={`block py-2.5 px-4 text-sm font-semibold text-white transition-colors hover:bg-[rgba(255,255,255,0.08)] ${language === "ur" ? "text-right" : "text-left"}`}
                                  >
                                    {"تمام موضوعات"}
                                  </Link>
                                </li>
                                {item.categories.map((cat) => {
                                  const isSubActive = location.search.includes(
                                    cat.value
                                  );
                                  return (
                                    <li key={cat.value}>
                                      <Link
                                        to={`${item.href}?category=${encodeURIComponent(cat.value)}`}
                                        onClick={closeMenu}
                                        style={{
                                          color: isSubActive
                                            ? COLORS.accent
                                            : COLORS.white,
                                        }}
                                        className={`block py-2.5 px-4 text-sm font-medium transition-colors hover:bg-[rgba(255,255,255,0.08)] ${language === "ur" ? "text-right" : "text-left"}`}
                                      >
                                        {language === "ur"
                                          ? cat.labelUr
                                          : cat.labelEn}
                                      </Link>
                                    </li>
                                  );
                                })}
                              </>
                            ) : (
                              item.dropdownItems?.map((sub) => {
                                const isSubActive =
                                  location.pathname === sub.href;
                                return (
                                  <li key={sub.label}>
                                    <Link
                                      to={sub.href}
                                      onClick={closeMenu}
                                      style={{
                                        color: isSubActive
                                          ? COLORS.accent
                                          : COLORS.white,
                                      }}
                                      className={`block py-2.5 px-4 text-sm font-medium transition-colors hover:bg-[rgba(255,255,255,0.08)] ${language === "ur" ? "text-right" : "text-left"}`}
                                    >
                                      {sub.label}
                                    </Link>
                                  </li>
                                );
                              })
                            )}
                          </ul>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                );
              })}
            </nav>

            {/* Bottom Auth / Profile Section */}
            <div
              className="pt-4 border-t flex flex-col gap-2.5 shrink-0 mt-auto"
              style={{ borderColor: COLORS.border }}
            >
              {isAuthenticated || userRole === "admin" ? (
                <>
                  {/* User Profile Info inside Mobile Menu */}
                  {/* <div className="bg-slate-50/90 border border-slate-200/80 rounded-lg p-3 text-slate-700 flex flex-col gap-1 shadow-xs">
                    <span className="font-bold text-sm text-slate-800">{loggedInUser?.name}</span>
                    <span className="text-xs text-slate-500 font-mono break-all">{loggedInUser?.loginEmail || loggedInUser?.loginPhone || "-"}</span>
                    <span className="self-start mt-1 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider bg-primary/10 text-primary rounded">
                      {loggedInUser?.role || "user"}
                    </span>
                  </div> */}

                  {userRole === "admin" && (
                    <>
                      <Link
                        to="/admin/dashboard"
                        onClick={closeMenu}
                        className="flex items-center justify-center gap-2 w-full px-4 py-2.5 text-sm font-semibold text-white rounded-lg shadow-sm hover:opacity-95 transition-opacity"
                        style={{ backgroundColor: COLORS.primary }}
                      >
                        <LayoutDashboard
                          className="w-4 h-4"
                          style={{ color: COLORS.accent }}
                        />
                        {language === "en"
                          ? "Admin Dashboard"
                          : "انتظامی ڈیش بورڈ"}
                      </Link>
                      <Link
                        to="/admin/settings"
                        onClick={closeMenu}
                        className="flex items-center justify-center gap-2 w-full px-4 py-2.5 text-sm font-semibold text-slate-700 bg-slate-50 hover:bg-slate-100 rounded-lg border border-slate-200 transition-colors"
                      >
                        <Settings className="w-4 h-4 text-slate-500" />
                        {language === "en"
                          ? "Website Settings"
                          : "ویب سائٹ کی ترتیبات"}
                      </Link>
                    </>
                  )}

                  {/* My Details — all authenticated users */}

                  {userRole !== "admin" && (
                    <Link
                      to="/my-details"
                      onClick={closeMenu}
                      className="flex items-center gap-2 w-full px-4 py-2.5 text-sm font-semibold text-primary bg-primary/5 hover:bg-primary/10 rounded-lg border border-primary/20 transition-colors"
                    >
                      <User className="w-4 h-4 text-primary" />
                      {"میری تفصیلات"}
                    </Link>
                  )}

                  <button
                    onClick={handleLogout}
                    className="flex items-center justify-center gap-2 w-full px-4 py-2.5 text-sm font-semibold text-red-700 bg-red-50 hover:bg-red-100 rounded-lg border border-red-200 transition-colors cursor-pointer"
                  >
                    <LogOut className="w-4 h-4" />
                    {language === "en" ? "Logout" : "لاگ آؤٹ"}
                  </button>
                </>
              ) : (
                <button
                  type="button"
                  onClick={() => {
                    closeMenu();
                    openLogin();
                  }}
                  style={{
                    backgroundColor: COLORS.background,
                    color: COLORS.textSecondary,
                    borderColor: COLORS.border,
                  }}
                  className="flex items-center justify-center gap-2 w-full px-4 py-2.5 text-sm font-semibold rounded-lg border hover:bg-slate-200 hover:text-[var(--color-primary)] transition-colors shadow-xs cursor-pointer"
                >
                  <User className="w-4 h-4" />
                  {language === "en" ? "Login / Signup" : "لاگ ان / سائن اپ"}
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Local Auth Modal using existing Login and Signup in English layout */}
      <Modal
        isOpen={isAuthModalOpen}
        onClose={closeAuthModal}
        title={authMode === "login" ? "Sign In" : "Create Account"}
        maxWidth={authMode === "login" ? "max-w-md" : "max-w-xl"}
        height="max-h-[92vh]"
        dir="ltr"
      >
        {authMode === "login" ? (
          <Login
            isModal={true}
            onClose={closeAuthModal}
            onSwitchToSignup={() => setAuthMode("signup")}
          />
        ) : (
          <Signup
            isModal={true}
            onClose={closeAuthModal}
            onSwitchToLogin={() => setAuthMode("login")}
          />
        )}
      </Modal>
    </header>
  );
}
