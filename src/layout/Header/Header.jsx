import React, { useState, useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { motion, AnimatePresence } from "framer-motion";
import {
  Menu,
  X,
  Home,
  Search,
  User,
  HelpCircle,
  LogOut,
  LayoutDashboard,
  Settings,
  ChevronDown,
  Bell,
} from "lucide-react";
import { useNotifications } from "@/hooks/useNotifications";
import NotificationDropdown from "@/components/Notification/NotificationDropdown";
import { logout } from "@/store/slices/authSlice";
import { useSettings } from "@/hooks/useSettings";
import { logoutUser } from "@/services";
import { useAuthModal } from "@/context/AuthModalContext";
import headerProfileImg from "@/assets/images/header-profile.jpg";

import logoImg from "@/assets/images/logo.jpeg";

/* ─── Corner Botanical Arabesque Branch SVG ─── */
function CornerArabesque({ className = "" }) {
  return (
    <svg
      viewBox="0 0 120 120"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={`text-[#C5A572] pointer-events-none select-none ${className}`}
    >
      {/* Outer corner line */}
      <path
        d="M3 116 L3 24 C3 12 12 3 24 3 L116 3"
        stroke="currentColor"
        strokeWidth="1.1"
        strokeLinecap="round"
      />
      {/* Inner dotted border */}
      <path
        d="M8 112 L8 28 C8 17 17 8 28 8 L112 8"
        stroke="currentColor"
        strokeWidth="0.7"
        strokeDasharray="2.5 2.5"
        opacity="0.6"
      />

      {/* Main blooming branch vine */}
      <path
        d="M6 100 C12 62 38 34 76 14 C90 8 106 6 114 6"
        stroke="currentColor"
        strokeWidth="1"
        strokeLinecap="round"
        fill="none"
      />

      {/* Secondary vine stems */}
      <path
        d="M20 78 C28 58 48 42 70 34"
        stroke="currentColor"
        strokeWidth="0.75"
        fill="none"
      />
      <path
        d="M40 52 C52 40 68 32 88 26"
        stroke="currentColor"
        strokeWidth="0.7"
        fill="none"
      />

      {/* Foliage / Leaves */}
      <path
        d="M12 90 C16 82 24 82 24 90 C24 98 16 98 12 90 Z"
        fill="currentColor"
        opacity="0.65"
      />
      <path
        d="M6 82 C14 78 18 84 14 92 C10 88 6 82 6 82 Z"
        fill="currentColor"
        opacity="0.55"
      />
      <path
        d="M22 68 C28 62 36 64 34 72 C28 72 22 68 22 68 Z"
        fill="currentColor"
        opacity="0.7"
      />

      {/* 4-Petal Flower Florets */}
      <g transform="translate(94, 16) scale(0.85)">
        <circle cx="0" cy="0" r="1.5" fill="#4A3728" />
        <ellipse cx="0" cy="-4.5" rx="1.8" ry="3.5" fill="currentColor" />
        <ellipse cx="0" cy="4.5" rx="1.8" ry="3.5" fill="currentColor" />
        <ellipse cx="-4.5" cy="0" rx="3.5" ry="1.8" fill="currentColor" />
        <ellipse cx="4.5" cy="0" rx="3.5" ry="1.8" fill="currentColor" />
        <circle cx="3.2" cy="-3.2" r="0.9" fill="currentColor" opacity="0.8" />
        <circle cx="-3.2" cy="-3.2" r="0.9" fill="currentColor" opacity="0.8" />
        <circle cx="3.2" cy="3.2" r="0.9" fill="currentColor" opacity="0.8" />
        <circle cx="-3.2" cy="3.2" r="0.9" fill="currentColor" opacity="0.8" />
      </g>

      <g transform="translate(58, 38) scale(0.75)">
        <circle cx="0" cy="0" r="1.5" fill="#4A3728" />
        <ellipse cx="0" cy="-4" rx="1.6" ry="3" fill="currentColor" />
        <ellipse cx="0" cy="4.5" rx="1.6" ry="3" fill="currentColor" />
        <ellipse cx="-4" cy="0" rx="3" ry="1.6" fill="currentColor" />
        <ellipse cx="4" cy="0" rx="3" ry="1.6" fill="currentColor" />
      </g>

      {/* Corner tip diamond floret */}
      <polygon points="14,14 17,10 20,14 17,18" fill="currentColor" />
      <circle cx="17" cy="14" r="1" fill="#4A3728" />
    </svg>
  );
}

/* ─── 8-Petal Rosette Medallion SVG ─── */
function RosetteMedallion({ className = "" }) {
  return (
    <svg
      className={`text-[#C5A572] ${className}`}
      viewBox="0 0 24 24"
      fill="currentColor"
    >
      <circle cx="12" cy="12" r="2.2" fill="#4A3728" />
      <path d="M12 2 C12.8 4.5 13.5 6.5 12 8 C10.5 6.5 11.2 4.5 12 2 Z" />
      <path d="M12 22 C12.8 19.5 13.5 17.5 12 16 C10.5 17.5 11.2 19.5 12 22 Z" />
      <path d="M2 12 C4.5 12.8 6.5 13.5 8 12 C6.5 10.5 4.5 11.2 2 12 Z" />
      <path d="M22 12 C19.5 12.8 17.5 13.5 16 12 C17.5 10.5 19.5 11.2 22 12 Z" />
      <path d="M4.9 4.9 C7.2 6.3 8.7 8.1 8 9.5 C6.7 9 5.3 7.3 4.9 4.9 Z" />
      <path d="M19.1 19.1 C16.8 17.7 15.3 15.9 16 14.5 C17.3 15 18.7 16.7 19.1 19.1 Z" />
      <path d="M19.1 4.9 C17.7 7.2 15.9 8.7 14.5 8 C15 6.7 16.7 5.3 19.1 4.9 Z" />
      <path d="M4.9 19.1 C6.3 16.8 8.1 15.3 9.5 16 C9 17.3 7.3 18.7 4.9 19.1 Z" />
    </svg>
  );
}

export default function Header() {
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [isOpen, setIsOpen] = useState(false);
  const [showProfileDropdown, setShowProfileDropdown] = useState(false);
  const [showNotifDropdown, setShowNotifDropdown] = useState(false);
  const notifBellRef = useRef(null);
  const { unreadCount, refreshNotifications, hasLoadedNotifications } = useNotifications();
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const searchInputRef = useRef(null);
  const profileDropdownRef = useRef(null);
  const headerContainerRef = useRef(null);
  const [headerHeight, setHeaderHeight] = useState(0);

  // Fast, zero-re-render scroll styling for sticky header effect (prevents main thread freeze)
  useEffect(() => {
    const el = headerContainerRef.current;
    if (!el) return;

    let isPast = false;
    const handleScroll = () => {
      const past = window.scrollY > 15;
      if (past !== isPast) {
        isPast = past;
        if (past) {
          el.classList.add("header-scrolled");
        } else {
          el.classList.remove("header-scrolled");
        }
      }
    };

    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const { isAuthenticated, loggedInUser, userRole } = useSelector(
    (state) => state.auth
  );
  const { settings } = useSettings();
  const language =
    settings?.language === "ur" || settings?.language === "Urdu" ? "ur" : "en";
  const isUrdu = language === "ur";
  const { openLogin, openResetPassword, closeAuthModal } = useAuthModal();

  // Click outside profile dropdown
  useEffect(() => {
    if (!showProfileDropdown) return;
    const handleClickOutside = (event) => {
      if (
        profileDropdownRef.current &&
        !profileDropdownRef.current.contains(event.target)
      ) {
        setShowProfileDropdown(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("touchstart", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("touchstart", handleClickOutside);
    };
  }, [showProfileDropdown]);

  // Close dropdowns on route changes
  useEffect(() => {
    setShowProfileDropdown(false);
    setShowNotifDropdown(false);
  }, [location.pathname]);

  // Escape key & focus for search popover
  useEffect(() => {
    if (!isSearchOpen) return;
    const handleKeyDown = (e) => {
      if (e.key === "Escape") {
        setIsSearchOpen(false);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    if (searchInputRef.current) {
      searchInputRef.current.focus();
    }
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isSearchOpen]);

  // Body scroll locking when mobile drawer is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  // Measure header bottom position to place mobile menu exactly below navbar
  useEffect(() => {
    let ticking = false;
    const updateHeaderHeight = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          if (headerContainerRef.current) {
            const rect = headerContainerRef.current.getBoundingClientRect();
            const newH = Math.round(rect.bottom);
            setHeaderHeight((prev) => (Math.abs(prev - newH) > 1 ? newH : prev));
          }
          ticking = false;
        });
        ticking = true;
      }
    };

    updateHeaderHeight();
    window.addEventListener("resize", updateHeaderHeight);
    return () => {
      window.removeEventListener("resize", updateHeaderHeight);
    };
  }, [isOpen]);

  const closeMenu = () => {
    setIsOpen(false);
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

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;
    navigate(`/articles?search=${encodeURIComponent(searchQuery.trim())}`);
    setIsSearchOpen(false);
    setSearchQuery("");
  };

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
          .slice(0, 2);
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
        .slice(0, 2);
    }

    if (user.loginPhone) {
      return user.loginPhone.slice(-3);
    }

    return "U";
  };

  const getUserDisplayName = (user) => {
    if (!user) return isUrdu ? "پروفائل" : "Profile";
    if (user.name && user.name.trim()) return user.name.trim();
    if (user.loginEmail && user.loginEmail.trim()) return user.loginEmail.split("@")[0];
    if (user.loginPhone) return user.loginPhone;
    return isUrdu ? "پروفائل" : "Profile";
  };

  // Exact navigation items matching the reference screenshot verbatim
  const navLinks = [
    {
      label: isUrdu ? "تعارف" : "About",
      href: "/about",
    },
    {
      label: isUrdu ? "فتاویٰ" : "Fatwas",
      href: "/fatwas",
    },
    {
      label: isUrdu ? "سوال وجواب" : "Q&A",
      href: "/qa",
    },
    {
      label: isUrdu ? "مقالات" : "Articles",
      href: "/articles",
      hasDropdown: true,
    },
    {
      label: isUrdu ? "کتب ورسائل" : "Publications",
      href: "/publications",
    },
    {
      label: isUrdu ? "خطبات" : "Lectures",
      href: "/lectures",
    },
    {
      label: isUrdu ? "پروگرام" : "Events",
      href: "/events",
    },
    {
      label: isUrdu ? "رابطہ" : "Contact",
      href: "/contact",
    },
  ];

  // Mobile navigation items
  const allMobileItems = [
    {
      label: isUrdu ? "صفحہ اول" : "Home",
      href: "/",
      icon: Home,
    },
    ...navLinks,
  ];

  // Feature / Page mapping based on existing navigation
  const featureRoutes = [
    ...allMobileItems,
    { href: "/books", label: isUrdu ? "کتب ورسائل" : "Publications" },
    { href: "/ask", label: isUrdu ? "ممبر بنیں" : "Member" },
    { href: "/my-details", label: isUrdu ? "میری تفصیلات" : "My Details" },
    { href: "/login", label: isUrdu ? "لاگ ان" : "Login" },
    { href: "/signup", label: isUrdu ? "سائن اپ" : "Signup" },
    {
      href: "/forgot-password",
      label: isUrdu ? "پاس ورڈ بھول گئے" : "Forgot Password",
    },
    {
      href: "/reset-password",
      label: isUrdu ? "نیا پاس ورڈ" : "Set New Password",
    },
    {
      href: "/new-password",
      label: isUrdu ? "نیا پاس ورڈ" : "Set New Password",
    },
  ];

  const currentFeature =
    featureRoutes.find((item) => item.href === location.pathname) ||
    featureRoutes
      .filter((item) => item.href !== "/")
      .find(
        (item) =>
          location.pathname.startsWith(item.href + "/") ||
          location.pathname.startsWith(item.href)
      ) ||
    allMobileItems[0];

  const isFeatureActive =
    Boolean(currentFeature?.href) &&
    (location.pathname === currentFeature.href ||
      (currentFeature.href !== "/" &&
        location.pathname.startsWith(currentFeature.href)));

  return (
    <div
      ref={headerContainerRef}
      className="w-full sticky top-0 z-40 select-none py-1 sm:py-1.5 px-2 sm:px-4 md:px-6 sticky-header-wrapper bg-transparent"
      dir="rtl"
    >
      <div className="max-w-[1360px] mx-auto">
        {/* ══════════════════════════════════════════════════════════════
            ONE SINGLE CONNECTED HEADER COMPONENT (#F7F1E8 + #2B2118)
            ══════════════════════════════════════════════════════════════ */}
        <header className="relative w-full rounded-2xl sm:rounded-3xl border border-[#A8793E] bg-[#2B2118] text-[#F7F1E8] shadow-[0_6px_24px_rgba(43,33,24,0.18)]">
          {/* ────────────────────────────────────────────────────────────
              1. TOP CREAM BRANDING AREA (#F7F1E8 with Fine Gold Accents #A8793E)
              ──────────────────────────────────────────────────────────── */}
          <div className="relative w-full bg-[#F7F1E8] text-[#2A211A] py-2 sm:py-2.5 md:py-3 px-3 sm:px-6 min-h-[86px] sm:min-h-[100px] md:min-h-[110px] overflow-hidden rounded-t-2xl sm:rounded-t-3xl flex items-center justify-center">
            {/* Outer Inset Decorative Frame */}
            <div className="absolute inset-1 sm:inset-1.5 rounded-[12px] sm:rounded-[18px] border border-[#A8793E]/40 pointer-events-none" />
            {/* Inner Fine Dotted Accent Frame */}
            <div className="absolute inset-2 sm:inset-2.5 rounded-[10px] sm:rounded-[15px] border border-[#A8793E]/25 border-dashed pointer-events-none opacity-60" />

            {/* Subtle Islamic Geometric Pattern Watermark */}
            <svg
              className="absolute inset-0 w-full h-full opacity-[0.045] pointer-events-none text-[#A8793E]"
              xmlns="http://www.w3.org/2000/svg"
            >
              <defs>
                <pattern
                  id="islamic-star-pattern"
                  width="44"
                  height="44"
                  patternUnits="userSpaceOnUse"
                >
                  <path
                    d="M22 0 L27 16 L44 22 L27 28 L22 44 L17 28 L0 22 L17 16 Z"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="0.9"
                  />
                  <circle
                    cx="22"
                    cy="22"
                    r="5"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="0.7"
                  />
                </pattern>
              </defs>
              <rect
                width="100%"
                height="100%"
                fill="url(#islamic-star-pattern)"
              />
            </svg>

            {/* Top Corner Botanical Arabesque Branch Ornaments */}
            <CornerArabesque className="absolute top-0 left-0 w-8 h-8 sm:w-10 sm:h-10 lg:w-12 lg:h-12 opacity-40 text-[#A8793E] pointer-events-none" />
            <CornerArabesque className="absolute top-0 right-0 w-8 h-8 sm:w-10 sm:h-10 lg:w-12 lg:h-12 -scale-x-100 opacity-40 text-[#A8793E] pointer-events-none" />

            {/* 1. Profile Image (Placed on LEFT side - Links to /about) */}
            <Link
              to="/about"
              className="absolute left-3.5 sm:left-6 md:left-9 lg:left-12 xl:left-14 top-1/2 -translate-y-1/2 z-20 group block focus:outline-none"
              title={
                isUrdu
                  ? "تعارف - مفتی فیضان سرور مصباحی"
                  : "About - Mufti Faizan Sarwar Misbahi"
              }
            >
              <div className="w-12 h-12 sm:w-16 sm:h-16 md:w-20 md:h-20 lg:w-[84px] lg:h-[84px] rounded-full overflow-hidden border-2 border-[#A8793E]/70 shadow-[0_2px_12px_rgba(43,33,24,0.18)] bg-[#2B2118] shrink-0 transition-transform duration-300 group-hover:scale-105 group-hover:border-[#C5A87C]">
                <img
                  src={headerProfileImg}
                  alt={
                    isUrdu
                      ? "مفتی فیضان سرور مصباحی"
                      : "Mufti Faizan Sarwar Misbahi"
                  }
                  className="w-full h-full object-cover scale-[1.14] transition-transform duration-300 group-hover:scale-[1.18]"
                />
              </div>
            </Link>

            {/* 2. Islamic Calligraphy Logo Seal (Placed on RIGHT side) */}
            <Link
              to="/"
              className="absolute right-3.5 sm:right-6 md:right-9 lg:right-12 xl:right-14 top-1/2 -translate-y-1/2 z-20 group block focus:outline-none"
              title={
                isUrdu
                  ? "مہر و نشان - مفتی فیضان سرور مصباحی"
                  : "Seal - Mufti Faizan Sarwar Misbahi"
              }
            >
              <div className="w-12 h-12 sm:w-16 sm:h-16 md:w-20 md:h-20 lg:w-[84px] lg:h-[84px] rounded-full overflow-hidden border-2 border-[#A8793E] shadow-[0_2px_14px_rgba(43,33,24,0.22)] bg-[#2B2118] shrink-0 p-[2px] transition-transform duration-300 group-hover:scale-105 group-hover:border-[#C5A87C]">
                <img
                  src={logoImg}
                  alt={
                    isUrdu
                      ? "مفتی محمد فیضان سرور مصباحی مہر"
                      : "Calligraphy Seal"
                  }
                  className="w-full h-full object-contain rounded-full transition-transform duration-300 group-hover:scale-105"
                />
              </div>
            </Link>

            {/* Center Calligraphic Branding Content (Vertically compact) */}
            <div className="relative z-10 flex flex-col items-center justify-center text-center max-w-3xl mx-auto py-0 px-16 sm:px-24 md:px-28 lg:px-34">
              {/* Bismillah with Gold Diamond Florets */}
              <div
                style={{
                  fontFamily: "'Payami Quran', 'Noto Naskh Arabic', serif",
                }}
                className="flex items-center justify-center gap-1.5 text-[10px] sm:text-[11px] text-[#2A211A] font-medium leading-none mb-0 select-none"
              >
                <span className="text-[#A8793E] text-[7.5px] sm:text-[8px] select-none leading-none">
                  ❖
                </span>
                <span className="tracking-wide">
                  بِسْمِ اللهِ الرَّحْمٰنِ الرَّحِيْم
                </span>
                <span className="text-[#A8793E] text-[7.5px] sm:text-[8px] select-none leading-none">
                  ❖
                </span>
              </div>

              {/* Scholar Main Calligraphic Name Title & Brand Logo */}
              <Link
                to="/"
                className="group flex items-center justify-center gap-2.5 sm:gap-3.5 transition-transform duration-200 hover:scale-[1.01] -my-0.5 sm:-my-1 py-0.5"
              >
                <h1
                  style={{
                    fontFamily: "'Payami Quran', 'Noto Naskh Arabic', serif",
                  }}
                  className="text-xl sm:text-2xl md:text-[26px] lg:text-[28px] font-bold text-[#2A211A] leading-tight tracking-tight group-hover:text-[#5C4433] transition-colors my-0 py-0"
                >
                  مفتی فیضان سرور مصباحی
                </h1>
              </Link>

              {/* Continuous Straight Divider Line with Subheading Badge (Placed JUST below the name) */}
              <div className="relative flex items-center justify-center w-full max-w-[480px] sm:max-w-[560px] md:max-w-[620px] mx-auto -mt-0.5 sm:-mt-1 mb-0.5 px-3">
                {/* Continuous horizontal divider line running behind the badge */}
                <div className="absolute inset-x-0 top-1/2 -translate-y-1/2 h-[1px] bg-gradient-to-r from-transparent via-[#A8793E]/65 to-transparent pointer-events-none" />

                {/* Subtitle text badge with solid cream background that cleanly masks the line behind it */}
                <div
                  style={{
                    fontFamily:
                      "'Payami Nastaleeq', 'Noto Nastaliq Urdu', serif",
                  }}
                  className="relative z-10 bg-[#F7F1E8] px-3 py-0 flex items-center gap-1.5 text-[10.5px] sm:text-[11.5px] md:text-[12px] font-semibold text-[#2A211A] select-none"
                >
                  <span className="text-[#A8793E] text-[7.5px] sm:text-[8px] select-none">
                    ❖
                  </span>
                  <span className="tracking-wide">
                    قاضی شریعت و ترجمان اہل سنت
                  </span>
                  <span className="text-[#A8793E] text-[7.5px] sm:text-[8px] select-none">
                    ❖
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* ────────────────────────────────────────────────────────────
              2. DISTINCT VISIBLE ISLAMIC S-CURVED TRANSITION
                 (Compact height, clean cream fill above curve line)
              ──────────────────────────────────────────────────────────── */}
          <div className="relative w-full -mt-[1px] z-20 pointer-events-none">
            <svg
              viewBox="0 0 1200 24"
              preserveAspectRatio="none"
              className="w-full h-3.5 sm:h-4 lg:h-4.5 block"
            >
              <defs>
                <linearGradient
                  id="goldCurveGrad"
                  x1="0%"
                  y1="0%"
                  x2="100%"
                  y2="0%"
                >
                  <stop offset="0%" stopColor="#A8793E" stopOpacity="0.8" />
                  <stop offset="25%" stopColor="#C5A87C" stopOpacity="0.95" />
                  <stop offset="50%" stopColor="#DFC8A4" stopOpacity="1" />
                  <stop offset="75%" stopColor="#C5A87C" stopOpacity="0.95" />
                  <stop offset="100%" stopColor="#A8793E" stopOpacity="0.8" />
                </linearGradient>
              </defs>

              {/* Pure cream background fill above the curve line */}
              <rect width="1200" height="24" fill="#F7F1E8" />

              {/* Dark chocolate fill strictly below the curve line */}
              <path
                d="M 0 0 L 210 0 C 265 0, 295 18, 350 18 L 850 18 C 905 18, 935 0, 990 0 L 1200 0 L 1200 24 L 0 24 Z"
                fill="#2B2118"
              />

              {/* Primary Antique Gold S-curve Line */}
              <path
                d="M 0 0 L 210 0 C 265 0, 295 18, 350 18 L 850 18 C 905 18, 935 0, 990 0 L 1200 0"
                stroke="url(#goldCurveGrad)"
                strokeWidth="1.3"
                fill="none"
              />
            </svg>
          </div>

          {/* ────────────────────────────────────────────────────────────
              3. LOWER DARK-BROWN NAVBAR (#2B2118 - Ultra-Compact)
              ──────────────────────────────────────────────────────────── */}
          <nav
            className="relative z-20 w-full bg-[#2B2118] px-3 sm:px-5 py-0.5 sm:py-0.5 flex items-center justify-between min-h-[30px] sm:min-h-[34px] rounded-b-2xl sm:rounded-b-3xl"
            aria-label="مرکزی نیویگیشن"
          >
            {/* ── RIGHT SIDE (RTL START): Search Icon + Home Pill Button ── */}
            <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
              {/* Inline Expandable Search Box with Instant Close Response */}
              <div className="relative flex items-center z-30">
                {isSearchOpen ? (
                  <div
                    className="relative flex items-center bg-[#2B2118] border border-[#A8793E] rounded-full px-2 py-0.5 shadow-md animate-in fade-in zoom-in-95 duration-150"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <form
                      onSubmit={handleSearchSubmit}
                      className="flex items-center"
                    >
                      <button
                        type="submit"
                        className="text-[#A8793E] hover:text-[#DFC8A4] transition-colors p-1 cursor-pointer flex items-center justify-center"
                        title={isUrdu ? "تلاش کریں" : "Submit search"}
                      >
                        <Search className="w-3.5 h-3.5" />
                      </button>
                      <input
                        ref={searchInputRef}
                        type="text"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        placeholder={isUrdu ? "تلاش کریں..." : "Search..."}
                        className="w-32 sm:w-44 md:w-52 bg-transparent text-xs text-[#F7F1E8] placeholder-[#A8793E]/70 focus:outline-none text-right font-normal px-1"
                        dir={isUrdu ? "rtl" : "ltr"}
                      />
                    </form>
                    <button
                      type="button"
                      onMouseDown={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        setIsSearchOpen(false);
                      }}
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        setIsSearchOpen(false);
                      }}
                      className="w-5 h-5 flex items-center justify-center rounded-full text-[#A8793E] hover:text-[#F7F1E8] hover:bg-white/10 transition-colors cursor-pointer mr-0.5"
                      title={isUrdu ? "بند کریں" : "Close"}
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ) : (
                  <button
                    type="button"
                    onClick={() => setIsSearchOpen(true)}
                    className="w-7.5 h-7.5 sm:w-8 sm:h-8 rounded-full border border-[#A8793E] bg-[#2B2118] text-[#F7F1E8] hover:text-[#DFC8A4] hover:border-[#DFC8A4] hover:scale-105 active:scale-95 transition-all flex items-center justify-center shadow-xs cursor-pointer"
                    title={isUrdu ? "تلاش کریں" : "Search"}
                    aria-label="تلاش"
                  >
                    <Search className="w-3.5 h-3.5 text-[#F7F1E8]" />
                  </button>
                )}
              </div>

              {/* Feature / Home Pill Button (Dynamic current page title) */}
              <Link
                to={currentFeature?.href || "/"}

                className={`rounded-full px-2.5 sm:px-3 py-1 flex items-center gap-1.5 text-[12px] sm:text-[13px] font-semibold transition-all duration-200 shrink-0 border ${isFeatureActive
                  ? "border-[#A8793E] bg-[#3D2E22] text-[#F7F1E8] shadow-[0_0_10px_rgba(168,121,62,0.25)]"
                  : "border-[#A8793E] bg-[#2B2118] text-[#F7F1E8]/90 hover:border-[#DFC8A4] hover:text-[#F7F1E8] hover:bg-[#3D2E22]"
                  }`}
              >
                <Home className="w-3.5 h-3.5 text-[#F7F1E8]" />
                <span>
                  {currentFeature?.label || (isUrdu ? "صفحہ اول" : "Home")}
                </span>
                <ChevronDown className="w-3 h-3 text-[#A8793E] opacity-80" />
              </Link>
            </div>

            {/* ── CENTER (DESKTOP): Navigation Links with Antique Gold Separators ── */}
            <div className="hidden lg:flex items-center justify-center flex-1 mx-2 xl:mx-3 pt-0.5">
              <div className="flex items-center flex-nowrap gap-0.5 xl:gap-1">
                {navLinks.map((item, index) => {
                  const isActive =
                    location.pathname === item.href ||
                    (item.href !== "/" &&
                      location.pathname.startsWith(item.href));

                  return (
                    <React.Fragment key={item.href}>
                      <Link
                        to={item.href}

                        className={`px-2 xl:px-2.5 py-0.5 text-[13px] xl:text-[14px] whitespace-nowrap transition-all duration-200 select-none flex items-center gap-1 ${isActive
                          ? "text-[#DFC8A4] font-bold"
                          : "text-[#F7F1E8]/90 hover:text-[#DFC8A4] font-medium"
                          }`}

                      >
                        <span>{item.label}</span>
                        {item.hasDropdown && (
                          <ChevronDown className="w-3 h-3 text-[#A8793E] opacity-80 inline-block" />
                        )}
                      </Link>

                      {/* Thin Vertical Gold Separator */}
                      {index < navLinks.length - 1 && (
                        <div className="w-[1px] h-3 xl:h-3.5 bg-[#A8793E]/40 self-center mx-0.5 xl:mx-1 shrink-0" />
                      )}
                    </React.Fragment>
                  );
                })}
              </div>
            </div>

            {/* ── LEFT SIDE (RTL END): Member & Login Buttons / Mobile Toggle ── */}
            <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
              {/* Member Button (ممبر بنیں) */}
              <Link
                to="/ask"
                className="hidden md:flex items-center gap-1.5 px-2.5 sm:px-3 py-1 rounded-full text-xs sm:text-[12px] font-semibold text-[#F7F1E8] border border-[#A8793E] bg-[#2B2118] hover:bg-[#3D2E22] hover:border-[#DFC8A4] transition-all shrink-0"
              >
                <HelpCircle className="w-3.5 h-3.5 text-[#A8793E]" />
                <span>{isUrdu ? "ممبر بنیں" : "Member"}</span>
              </Link>

              {/* Notification Bell & Profile for Logged-in Users */}
              {isAuthenticated || userRole === "admin" ? (
                <>
                  {/* Notification Bell */}
                  <div ref={notifBellRef} className="relative z-50">
                      <button
                        type="button"
                        onClick={() => {
                          setShowProfileDropdown(false);
                          setShowNotifDropdown((prev) => {
                            const nextState = !prev;
                            if (nextState) {
                              refreshNotifications({ silent: hasLoadedNotifications });
                            }
                            return nextState;
                          });
                        }}
                        className="relative w-7.5 h-7.5 sm:w-8 sm:h-8 rounded-full border border-[#A8793E] bg-[#2B2118] text-[#F7F1E8] flex items-center justify-center hover:bg-[#3D2E22] hover:border-[#DFC8A4] transition-all cursor-pointer shadow-xs"
                        aria-label={isUrdu ? "اطلاعات" : "Notifications"}
                        title={isUrdu ? "اطلاعات" : "Notifications"}
                      >
                        <Bell className="w-4 h-4 text-[#DFC8A4]" />
                        {unreadCount > 0 && (
                          <span className="absolute -top-1 -right-1 min-w-[17px] h-[17px] px-1 bg-[#D97706] text-[#2B2118] font-bold text-[10px] leading-none rounded-full flex items-center justify-center border-2 border-[#2B2118] shadow-sm">
                            {unreadCount > 99 ? "99+" : unreadCount}
                          </span>
                        )}
                      </button>

                      <NotificationDropdown
                        isOpen={showNotifDropdown}
                        onClose={() => setShowNotifDropdown(false)}
                        anchorRef={notifBellRef}
                        headerHeight={headerHeight}
                      />
                    </div>

                    {/* Profile Dropdown Trigger */}
                    <div ref={profileDropdownRef} className="relative z-50">
                      <button
                        type="button"
                        onClick={() => {
                          setShowNotifDropdown(false);
                          setShowProfileDropdown((prev) => !prev);
                        }}
                        className="rounded-full border border-[#A8793E] bg-[#2B2118] text-[#F7F1E8] px-2 sm:px-2.5 py-0.5 flex items-center gap-1.5 text-xs font-semibold hover:bg-[#3D2E22] transition-all cursor-pointer shadow-xs"
                      >
                        <div className="w-5 h-5 rounded-full bg-[#A8793E] text-[#2B2118] font-bold text-[10px] flex items-center justify-center shrink-0">
                          {getInitials(loggedInUser)}
                        </div>
                        <span className="inline-block max-w-[70px] sm:max-w-[110px] truncate">
                          {getUserDisplayName(loggedInUser)}
                        </span>
                        <ChevronDown className="w-3 h-3 text-[#A8793E]" />
                      </button>

                      {/* Profile Dropdown */}
                      <AnimatePresence>
                        {showProfileDropdown && (
                          <motion.div
                            initial={{ opacity: 0, scale: 0.95, y: -6 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.95, y: -6 }}
                            transition={{ duration: 0.16 }}
                            style={{ zIndex: 9999 }}
                            className={`absolute left-0 ${isUrdu ? "text-right" : "text-left"} top-full mt-2 w-64 max-w-[calc(100vw-32px)] bg-[#2B2118] border border-[#A8793E] rounded-2xl shadow-2xl p-4 transition-all z-50`}
                          >
                            <div className="flex flex-col gap-1 pb-3 border-b border-[#A8793E]/30">
                              <span className="font-bold text-[#F7F1E8] text-sm">
                                {loggedInUser?.name}
                              </span>
                              <span className="text-xs text-[#F7F1E8]/60 font-mono truncate">
                                {loggedInUser?.loginEmail ||
                                  loggedInUser?.loginPhone ||
                                  "-"}
                              </span>
                              <span className="self-start mt-1 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider bg-[#A8793E]/25 text-[#DFC8A4] rounded-full border border-[#A8793E]/40">
                                {loggedInUser?.role || "user"}
                              </span>
                            </div>

                            <Link
                              to="/"
                              onClick={() => setShowProfileDropdown(false)}
                              className="mt-2.5 flex items-center gap-2 w-full px-3 py-2 text-xs font-bold text-[#F7F1E8] hover:text-[#DFC8A4] bg-[#3D2E22] hover:bg-[#4D3A2C] rounded-xl border border-[#A8793E]/40 transition-colors"
                            >
                              <Home className="w-3.5 h-3.5 text-[#A8793E]" />
                              {isUrdu ? "صفحہ اول" : "Home"}
                            </Link>

                            <Link
                              to="/my-details"
                              onClick={() => setShowProfileDropdown(false)}
                              className="mt-2 flex items-center gap-2 w-full px-3 py-2 text-xs font-bold text-[#F7F1E8] hover:text-[#DFC8A4] bg-[#3D2E22] hover:bg-[#4D3A2C] rounded-xl border border-[#A8793E]/40 transition-colors"
                            >
                              <User className="w-3.5 h-3.5 text-[#A8793E]" />
                              {isUrdu ? "میری تفصیلات" : "My Details"}
                            </Link>

                            {userRole === "admin" && (
                              <>
                                <Link
                                  to="/admin/dashboard"
                                  onClick={() => setShowProfileDropdown(false)}
                                  className="mt-2 flex items-center gap-2 w-full px-3 py-2 text-xs font-bold text-[#F7F1E8] hover:text-[#DFC8A4] bg-[#3D2E22] hover:bg-[#4D3A2C] rounded-xl border border-[#A8793E]/40 transition-colors"
                                >
                                  <LayoutDashboard className="w-3.5 h-3.5 text-[#A8793E]" />
                                  {isUrdu ? "ڈیش بورڈ" : "Admin Dashboard"}
                                </Link>
                                <Link
                                  to="/admin/settings"
                                  onClick={() => setShowProfileDropdown(false)}
                                  className="mt-2 flex items-center gap-2 w-full px-3 py-2 text-xs font-bold text-[#F7F1E8] hover:text-[#DFC8A4] bg-[#3D2E22] hover:bg-[#4D3A2C] rounded-xl border border-[#A8793E]/40 transition-colors"
                                >
                                  <Settings className="w-3.5 h-3.5 text-[#A8793E]" />
                                  {isUrdu
                                    ? "ویب سائٹ کی ترتیبات"
                                    : "Website Settings"}
                                </Link>
                              </>
                            )}

                            <button
                              type="button"
                              onClick={handleLogout}
                              className="mt-3 flex items-center justify-center gap-2 w-full px-3 py-2 text-xs font-bold text-red-300 hover:text-red-200 bg-red-950/40 hover:bg-red-900/50 rounded-xl border border-red-800/40 transition-colors cursor-pointer"
                            >
                              <LogOut className="w-3.5 h-3.5 text-red-400" />
                              {isUrdu ? "لاگ آؤٹ" : "Logout"}
                            </button>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  </>
                ) : (
                  <button
                    type="button"
                    onClick={openLogin}
                    className="rounded-full border border-[#A8793E] bg-[#2B2118] text-[#F7F1E8] px-2.5 sm:px-3 py-1 flex items-center gap-1.5 text-xs sm:text-[12.5px] font-semibold hover:bg-[#3D2E22] hover:border-[#DFC8A4] hover:text-[#F7F1E8] transition-all duration-200 cursor-pointer shadow-xs"
                    title={isUrdu ? "لاگ ان / سائن اپ" : "Login / Signup"}
                  >
                    <User className="w-3.5 h-3.5 text-[#F7F1E8]" />
                    <span>{isUrdu ? "لاگ ان" : "Login"}</span>
                  </button>
              )}

                  {/* Mobile Hamburger Toggle */}
                  <button
                    type="button"
                    onClick={() => setIsOpen(!isOpen)}
                    className="lg:hidden w-7.5 h-7.5 sm:w-8 sm:h-8 rounded-full border border-[#A8793E] bg-[#2B2118] text-[#F7F1E8] flex items-center justify-center hover:bg-[#3D2E22] hover:border-[#DFC8A4] transition-all cursor-pointer"
                    aria-label="Toggle Menu"
                  >
                    {isOpen ? (
                      <X className="w-4 h-4" />
                    ) : (
                      <Menu className="w-4 h-4" />
                    )}
                  </button>
                </div>
          </nav>
        </header>
      </div>

      {/* ────────────────────────────────────────────────────────────
          RESPONSIVE MOBILE DRAWER (Positioned immediately below navbar)
          ──────────────────────────────────────────────────────────── */}
      {typeof document !== "undefined" &&
        createPortal(
          <AnimatePresence>
            {isOpen && (
              <div
                className="lg:hidden fixed left-0 right-0 bottom-0 z-[99999] bg-black/75 backdrop-blur-xs transition-opacity duration-300 flex flex-col justify-start"
                style={{
                  top: `${headerHeight || 120}px`,
                  height: `calc(100dvh - ${headerHeight || 120}px)`,
                }}
                onClick={closeMenu}
              >
                <motion.div
                  initial={{ x: isUrdu ? "100%" : "-100%" }}
                  animate={{ x: 0 }}
                  exit={{ x: isUrdu ? "100%" : "-100%" }}
                  transition={{ type: "tween", duration: 0.25 }}
                  className={`absolute top-0 bottom-3 sm:bottom-4 ${isUrdu ? "right-0 border-l" : "left-0 border-r"
                    } border-b border-[#A8793E]/40 rounded-b-2xl w-[280px] sm:w-[300px] max-w-[85vw] bg-gradient-to-b from-[#2B2118] via-[#33261C] to-[#241A13] shadow-2xl flex flex-col text-[#F7F1E8] z-[100000] overflow-hidden`}
                  onClick={(e) => e.stopPropagation()}
                  dir={isUrdu ? "rtl" : "ltr"}
                >
                  {/* Drawer Header */}
                  <div className="flex items-center justify-between px-4 py-2.5 border-b border-[#A8793E]/30 shrink-0 bg-[#2B2118]">
                    <span className="font-bold text-base sm:text-lg text-[#DFC8A4]">
                      {isUrdu ? "مینو" : "Navigation"}
                    </span>
                    <button
                      type="button"
                      onClick={closeMenu}
                      className="p-1 rounded-full text-[#F7F1E8]/80 hover:bg-[#3D2E22] hover:text-[#F7F1E8] transition-colors cursor-pointer"
                      aria-label="Close navigation"
                    >
                      <X className="w-5 h-5" />
                    </button>
                  </div>

                  {/* Drawer Scrollable Body */}
                  <div className="flex-1 overflow-y-auto overscroll-contain px-3 py-2.5 custom-drawer-scrollbar flex flex-col gap-2">
                    {/* Mobile Search Field */}
                    <form onSubmit={handleSearchSubmit} className="shrink-0">
                      <div className="relative flex items-center">
                        <input
                          type="text"
                          value={searchQuery}
                          onChange={(e) => setSearchQuery(e.target.value)}
                          placeholder={isUrdu ? "تلاش کریں..." : "Search..."}
                          className="w-full bg-[#1E1610] border border-[#A8793E]/40 rounded-xl px-3 py-1.5 pl-8 text-xs sm:text-sm text-[#F7F1E8] placeholder-[#A8793E]/60 focus:outline-none focus:border-[#DFC8A4] text-right font-normal"
                          dir={isUrdu ? "rtl" : "ltr"}
                        />
                        <button
                          type="submit"
                          className="absolute left-2.5 text-[#A8793E] hover:text-[#DFC8A4] cursor-pointer"
                        >
                          <Search className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </form>

                    {/* Navigation Links */}
                    <nav className="flex flex-col gap-1 shrink-0">
                      {allMobileItems.map((item) => {
                        const isActive =
                          location.pathname === item.href ||
                          (item.href !== "/" &&
                            location.pathname.startsWith(item.href));

                        return (
                          <Link
                            key={item.href}
                            to={item.href}
                            onClick={closeMenu}
                            className={`px-3 py-1.5 rounded-lg text-[13.5px] sm:text-sm transition-all flex items-center gap-2 ${isActive
                              ? "bg-[#3D2E22] text-[#DFC8A4] font-bold border border-[#A8793E]/40 shadow-xs"
                              : "text-[#F7F1E8]/90 hover:bg-[#33261C] hover:text-[#DFC8A4] font-medium"
                              }`}
                          >
                            {item.icon && (
                              <item.icon className="w-4 h-4 text-[#A8793E]" />
                            )}
                            <span>{item.label}</span>
                          </Link>
                        );
                      })}
                    </nav>

                    {/* Bottom Auth Section */}
                    <div className="pt-2 border-t border-[#A8793E]/30 flex flex-col gap-1.5 shrink-0 pb-3 mt-auto">
                      <Link
                        to="/ask"
                        onClick={closeMenu}
                        className="flex items-center justify-center gap-2 w-full px-3 py-1.5 text-xs font-bold text-[#2B2118] bg-[#A8793E] hover:bg-[#DFC8A4] rounded-xl shadow-sm transition-colors"
                      >
                        <HelpCircle className="w-4 h-4" />
                        {isUrdu
                          ? "ممبر بنیں / سوال پوچھیں"
                          : "Member / Ask Question"}
                      </Link>

                      {isAuthenticated || userRole === "admin" ? (
                        <>
                          {/* Mobile Drawer Notifications Button */}
                          <button
                            type="button"
                            onClick={() => {
                              closeMenu();
                              setShowProfileDropdown(false);
                              setShowNotifDropdown(true);
                              refreshNotifications({ silent: hasLoadedNotifications });
                            }}
                            className="flex items-center justify-between w-full px-3 py-1.5 text-xs font-bold text-[#F7F1E8] bg-[#3D2E22] hover:bg-[#4D3A2C] rounded-xl border border-[#A8793E]/30 transition-colors cursor-pointer"
                          >
                            <span className="flex items-center gap-2">
                              <Bell className="w-3.5 h-3.5 text-[#A8793E]" />
                              {isUrdu ? "اطلاعات (نوٹیفیکیشنز)" : "Notifications"}
                            </span>
                            {unreadCount > 0 && (
                              <span className="px-1.5 py-0.5 text-[10px] font-bold bg-[#A8793E] text-[#2B2118] rounded-full">
                                {unreadCount > 99 ? "99+" : unreadCount}
                              </span>
                            )}
                          </button>

                          <Link
                            to="/my-details"
                            onClick={closeMenu}
                            className="flex items-center justify-center gap-2 w-full px-3 py-1.5 text-xs font-bold text-[#F7F1E8] bg-[#3D2E22] hover:bg-[#4D3A2C] rounded-xl border border-[#A8793E]/30 transition-colors"
                          >
                            <User className="w-3.5 h-3.5 text-[#A8793E]" />
                            {isUrdu ? "میری تفصیلات" : "My Details"}
                          </Link>
                          {userRole === "admin" && (
                            <Link
                              to="/admin/dashboard"
                              onClick={closeMenu}
                              className="flex items-center justify-center gap-2 w-full px-3 py-1.5 text-xs font-bold text-[#F7F1E8] bg-[#3D2E22] hover:bg-[#4D3A2C] rounded-xl border border-[#A8793E]/30 transition-colors"
                            >
                              <LayoutDashboard className="w-3.5 h-3.5 text-[#A8793E]" />
                              {isUrdu ? "ڈیش بورڈ" : "Dashboard"}
                            </Link>
                          )}
                          <button
                            type="button"
                            onClick={handleLogout}
                            className="flex items-center justify-center gap-2 w-full px-3 py-1.5 text-xs font-bold text-red-300 bg-red-950/40 hover:bg-red-900/50 rounded-xl border border-red-800/40 transition-colors cursor-pointer"
                          >
                            <LogOut className="w-3.5 h-3.5" />
                            {isUrdu ? "لاگ آؤٹ" : "Logout"}
                          </button>
                        </>
                      ) : (
                        <button
                          type="button"
                          onClick={() => {
                            closeMenu();
                            openLogin();
                          }}
                          className="flex items-center justify-center gap-2 w-full px-3 py-1.5 text-xs font-bold text-[#F7F1E8] bg-[#3D2E22] hover:bg-[#4D3A2C] rounded-xl border border-[#A8793E]/40 shadow-sm transition-colors cursor-pointer"
                        >
                          <User className="w-4 h-4 text-[#A8793E]" />
                          {isUrdu ? "لاگ ان کریں" : "Login / Signup"}
                        </button>
                      )}
                    </div>
                  </div>
                </motion.div>
              </div>
            )}
          </AnimatePresence>,
          document.body
        )}

    </div>
  );
}
