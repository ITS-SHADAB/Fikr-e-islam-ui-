import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import PropTypes from "prop-types";
import {
  BookOpen,
  Bookmark,
  Download,
  Calendar,
  User,
  ArrowLeft,
  Building2,
  Info,
} from "lucide-react";
import { PdfViewer } from "../PdfViewer";
import { COLORS } from "@/utils/themeColors";
import { BACKEND_URL } from "@/constants/urls";
import {
  PUBLICATION_CATEGORY_TRANSLATIONS,
  BOOK_LANGUAGE_TRANSLATIONS,
} from "@/utils/categories";

/* ── Grand Islamic Mimbar / Mihrab Arch Background for Book Stage ── */
export function MihrabArchBackground({ className = "" }) {
  return (
    <svg
      viewBox="0 0 260 320"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={`pointer-events-none select-none ${className}`}
      aria-hidden="true"
    >
      <defs>
        {/* Soft, Gentle, Understated Light Cream-Gold Gradients (Exact same light color from Home page) */}
        <linearGradient id="mimbarArchBg" x1="130" y1="12" x2="130" y2="320" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#F9EEDB" stopOpacity="0.90" />
          <stop offset="30%" stopColor="#FCF5E8" stopOpacity="0.85" />
          <stop offset="70%" stopColor="#FDF8F0" stopOpacity="0.80" />
          <stop offset="100%" stopColor="#FAF6EF" stopOpacity="0.75" />
        </linearGradient>

        <radialGradient id="mimbarInnerGlow" cx="130" cy="95" r="130" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#FFF6E0" stopOpacity="0.75" />
          <stop offset="50%" stopColor="#FAF1DA" stopOpacity="0.30" />
          <stop offset="100%" stopColor="#FAF6EF" stopOpacity="0" />
        </radialGradient>

        <linearGradient id="goldBorderGrad" x1="130" y1="10" x2="130" y2="320" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#B38038" />
          <stop offset="40%" stopColor="#CF9F53" />
          <stop offset="70%" stopColor="#DFC07C" />
          <stop offset="100%" stopColor="#CF9F53" />
        </linearGradient>

        <linearGradient id="pillarGrad" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="#B88944" />
          <stop offset="35%" stopColor="#E5C78A" />
          <stop offset="70%" stopColor="#F5DC9F" />
          <stop offset="100%" stopColor="#B88944" />
        </linearGradient>
      </defs>

      {/* Outer Rectangular Niche Frame: Unified elegant soft cream-gold */}
      <rect
        x="4"
        y="10"
        width="252"
        height="308"
        rx="18"
        fill="url(#mimbarArchBg)"
        stroke="#D8C09A"
        strokeWidth="1"
        strokeOpacity="0.45"
      />

      {/* Inner Radiant Amber/Cream Glow */}
      <rect
        x="6"
        y="12"
        width="248"
        height="304"
        rx="16"
        fill="url(#mimbarInnerGlow)"
      />

      {/* Corner Spandrel Arabesque Accents (Top-Left & Top-Right) */}
      <path
        d="M 12 18 L 48 18 C 30 24, 18 36, 18 54 L 18 18 Z"
        fill="#C8A46A"
        fillOpacity="0.28"
      />
      <path
        d="M 248 18 L 212 18 C 230 24, 242 36, 242 54 L 242 18 Z"
        fill="#C8A46A"
        fillOpacity="0.28"
      />

      {/* Left Fluted Pillar (عمود المنبر الأيسر) */}
      <rect x="14" y="115" width="9" height="195" rx="2" fill="url(#pillarGrad)" stroke="#A8793E" strokeWidth="0.7" strokeOpacity="0.4" />
      <path d="M 11 115 L 26 115 L 24 122 L 13 122 Z" fill="#A8793E" fillOpacity="0.7" />
      <path d="M 12 305 L 25 305 L 27 312 L 10 312 Z" fill="#A8793E" fillOpacity="0.7" />

      {/* Right Fluted Pillar (عمود المنبر الأيمن) */}
      <rect x="237" y="115" width="9" height="195" rx="2" fill="url(#pillarGrad)" stroke="#A8793E" strokeWidth="0.7" strokeOpacity="0.4" />
      <path d="M 234 115 L 249 115 L 247 122 L 236 122 Z" fill="#A8793E" fillOpacity="0.7" />
      <path d="M 235 305 L 248 305 L 250 312 L 233 312 Z" fill="#A8793E" fillOpacity="0.7" />

      {/* Primary Pointed Islamic Mihrab Arch Profile (First Line) */}
      <path
        d="M 23 310 L 23 125 C 23 68, 85 24, 130 14 C 175 24, 237 68, 237 125 L 237 310"
        stroke="url(#goldBorderGrad)"
        strokeWidth="2"
        strokeLinecap="round"
        fill="none"
      />

      {/* Inner Concentric Arch (Second Line - Perfectly Parallel and Adjusted) */}
      <path
        d="M 33 310 L 33 127 
           C 33 76, 88 33, 130 24 
           C 172 33, 227 76, 227 127 
           L 227 310"
        stroke="#A8793E"
        strokeWidth="1.2"
        strokeOpacity="0.75"
        strokeLinecap="round"
        fill="none"
      />

      {/* Delicate Inner Dashed Contour (Third Line) */}
      <path
        d="M 41 310 L 41 133 
           C 41 84, 91 41, 130 32 
           C 169 41, 219 84, 219 133 
           L 219 310"
        stroke="#C8A46A"
        strokeWidth="0.8"
        strokeDasharray="4 3"
        strokeOpacity="0.55"
        strokeLinecap="round"
        fill="none"
      />

      {/* Apex Sunburst Rays (نور المحراب الذهبي) */}
      <g stroke="#A8793E" strokeWidth="0.8" strokeOpacity="0.38">
        <line x1="130" y1="26" x2="130" y2="46" />
        <line x1="130" y1="26" x2="116" y2="44" />
        <line x1="130" y1="26" x2="144" y2="44" />
        <line x1="130" y1="26" x2="104" y2="48" />
        <line x1="130" y1="26" x2="156" y2="48" />
        <line x1="130" y1="26" x2="94" y2="56" />
        <line x1="130" y1="26" x2="166" y2="56" />
      </g>

      {/* Top Finial & Crescent Ornament (قبة وهلال ذهبي) */}
      <g filter="drop-shadow(0 1px 2px rgba(43,33,24,0.15))">
        {/* Finial Base Bead */}
        <circle cx="130" cy="14" r="3.5" fill="#A8793E" />
        <circle cx="130" cy="14" r="1.8" fill="#FFF2D6" />
        {/* Golden Crescent Needle */}
        <path
          d="M 130 4 L 131.5 11 L 130 13 L 128.5 11 Z"
          fill="#A8793E"
        />
        <circle cx="130" cy="4" r="1.5" fill="#C8A46A" />
      </g>
    </svg>
  );
}

/* ── Delicate Olive / Leaf Branch Silhouette on Far Left ── */
export function OliveBranchSilhouette({ className = "" }) {
  return (
    <svg
      viewBox="0 0 100 230"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={`pointer-events-none select-none ${className}`}
      aria-hidden="true"
    >
      <path
        d="M 5 220 Q 38 150 25 90 Q 16 42 48 8"
        stroke="#524332"
        strokeWidth="1.2"
        strokeLinecap="round"
        strokeOpacity="0.2"
      />
      <path d="M 20 188 Q 44 182 52 165 Q 36 165 20 188 Z" fill="#524332" fillOpacity="0.16" />
      <path d="M 23 156 Q 2 146 0 128 Q 14 132 23 156 Z" fill="#524332" fillOpacity="0.16" />
      <path d="M 26 122 Q 56 110 62 88 Q 44 94 26 122 Z" fill="#524332" fillOpacity="0.18" />
      <path d="M 24 88 Q 6 74 3 54 Q 18 60 24 88 Z" fill="#524332" fillOpacity="0.17" />
      <path d="M 32 56 Q 60 44 65 24 Q 48 30 32 56 Z" fill="#524332" fillOpacity="0.19" />
      <path d="M 42 24 Q 58 10 72 2 Q 56 16 42 24 Z" fill="#524332" fillOpacity="0.2" />
    </svg>
  );
}

/* ── 3D Round Pedestal / Display Stand with Soft Cream-Gold Tones ── */
export function PedestalStage({ className = "" }) {
  return (
    <div className={`pointer-events-none select-none ${className}`} aria-hidden="true">
      <svg viewBox="0 0 280 64" fill="none" className="w-full h-full">
        <defs>
          {/* Soft subtle cream-gold desk surface (gentle, matches home page) */}
          <linearGradient id="deskTopGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#FAF4EA" />
            <stop offset="45%" stopColor="#F5EADA" />
            <stop offset="85%" stopColor="#EDE0CC" />
            <stop offset="100%" stopColor="#E2D0B6" />
          </linearGradient>

          {/* 3D Bevel Rim Gradient */}
          <linearGradient id="deskBevelGrad" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="#B38038" />
            <stop offset="25%" stopColor="#D4A853" />
            <stop offset="50%" stopColor="#F5DC9F" />
            <stop offset="75%" stopColor="#D4A853" />
            <stop offset="100%" stopColor="#B38038" />
          </linearGradient>

          {/* Front Skirt Depth Gradient */}
          <linearGradient id="deskFrontSkirtGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#D4A853" />
            <stop offset="50%" stopColor="#B38038" />
            <stop offset="100%" stopColor="#8A5E25" />
          </linearGradient>
        </defs>

        {/* Light, subtle floor shadow */}
        <ellipse cx="140" cy="54" rx="120" ry="6" fill="rgba(43,33,24,0.10)" filter="blur(3px)" />

        {/* Pedestal Front Skirt / Depth */}
        <path d="M 12 24 C 12 44, 268 44, 268 24 L 268 36 C 268 56, 12 56, 12 36 Z" fill="url(#deskFrontSkirtGrad)" opacity="0.85" />

        {/* Pedestal Front Bevel / Rim */}
        <path d="M 12 24 C 12 44, 268 44, 268 24 L 268 28 C 268 48, 12 48, 12 28 Z" fill="url(#deskBevelGrad)" />

        {/* Pedestal Top Ellipse Surface */}
        <ellipse cx="140" cy="24" rx="128" ry="16" fill="url(#deskTopGrad)" stroke="#C8A46A" strokeWidth="1" strokeOpacity="0.75" />

        {/* Concentric Decorative Ring on Top Surface */}
        <ellipse cx="140" cy="24" rx="120" ry="13.5" fill="none" stroke="#FFFBF2" strokeWidth="0.8" strokeDasharray="5 3" opacity="0.8" />

        {/* Light, subtle contact shadow where Book Base touches the Desk */}
        <ellipse cx="140" cy="24" rx="85" ry="2.5" fill="rgba(43,33,24,0.22)" filter="blur(1.5px)" />
        {/* Gentle grounding balance for the bottom-right corner */}
        <ellipse cx="165" cy="24.5" rx="42" ry="2" fill="rgba(43,33,24,0.18)" filter="blur(1.5px)" />
      </svg>
    </div>
  );
}

/* ── Authentic Islamic Rosette / Arabesque Knot Divider ── */
function IslamicRosetteDivider({ className = "" }) {
  return (
    <div
      className={`flex items-center justify-center gap-3 my-2 sm:my-2.5 opacity-90 ${className}`}
      dir="ltr"
      aria-hidden="true"
    >
      <span className="h-[1px] flex-1 bg-gradient-to-r from-transparent via-[#C5A880]/55 to-transparent" />
      <svg
        className="w-5 h-5 text-[#A8793E] shrink-0 select-none"
        viewBox="0 0 32 32"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* Rounded Square 1 (Horizontal/Vertical) */}
        <rect
          x="7"
          y="7"
          width="18"
          height="18"
          rx="4"
          stroke="#A8793E"
          strokeWidth="1.25"
          fill="rgba(250, 246, 239, 0.7)"
        />
        {/* Rounded Square 2 (Rotated 45 degrees to create the 8 rounded lobes) */}
        <rect
          x="7"
          y="7"
          width="18"
          height="18"
          rx="4"
          transform="rotate(45 16 16)"
          stroke="#A8793E"
          strokeWidth="1.25"
          fill="rgba(250, 246, 239, 0.7)"
        />
        {/* Inner Concentric Ring */}
        <circle cx="16" cy="16" r="4.5" stroke="#C5A880" strokeWidth="1.1" fill="#FAF6EE" />
        {/* Center Core Accent */}
        <circle cx="16" cy="16" r="1.6" fill="#A8793E" />
      </svg>
      <span className="h-[1px] flex-1 bg-gradient-to-l from-transparent via-[#C5A880]/55 to-transparent" />
    </div>
  );
}

export default function PublicationCard({ publication }) {
  const [isPdfOpen, setIsPdfOpen] = useState(false);
  const [imageError, setImageError] = useState(false);
  const [isBookmarked, setIsBookmarked] = useState(false);

  if (!publication) return null;

  const {
    _id,
    slug,
    title,
    summary,
    category,
    blanguage = "Urdu",
    author,
    publishDate,
    coverImage,
    pdf,
    pageCount,
    tags,
    institution,
    publisher,
  } = publication;

  const detailUrl = `/publications/slug/${slug || _id}`;

  // Bookmark sync with localStorage
  useEffect(() => {
    try {
      const saved = localStorage.getItem(`bookmarked_book_${_id}`);
      if (saved === "true") setIsBookmarked(true);
    } catch {}
  }, [_id]);

  const handleToggleBookmark = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsBookmarked((prev) => {
      const next = !prev;
      try {
        localStorage.setItem(`bookmarked_book_${_id}`, String(next));
      } catch {}
      return next;
    });
  };

  const formattedDate = publishDate
    ? new Date(publishDate).toLocaleDateString("ur-PK", {
        year: "numeric",
        month: "long",
        day: "numeric",
      })
    : "";

  const getCoverImageSrc = (img) => {
    if (img) {
      const url = typeof img === "object" ? img.url : img;
      if (url && typeof url === "string" && url.trim() !== "") {
        if (url.startsWith("/")) return `${BACKEND_URL}${url}`;
        return url;
      }
    }
    const isGreenTheme =
      category === "Quran" ||
      category === "Hadith" ||
      category === "قرآن و تفاسیر" ||
      category === "حدیث";
    return isGreenTheme
      ? "/assets/images/books/islamic-book-cover-green.jpg"
      : "/assets/images/books/islamic-book-cover.jpg";
  };

  const [imgSrc, setImgSrc] = useState(() => getCoverImageSrc(coverImage));

  useEffect(() => {
    setImgSrc(getCoverImageSrc(coverImage));
    setImageError(false);
  }, [coverImage, category]);

  const pdfUrl = pdf?.url || (typeof pdf === "string" ? pdf : null);
  const coverImageSrc = imgSrc;

  const categoryLabel =
    PUBLICATION_CATEGORY_TRANSLATIONS[category] || category || "کتاب";
  const languageLabel =
    BOOK_LANGUAGE_TRANSLATIONS[blanguage] || blanguage || "اردو";

  // Normalized tags array (take at most 4)
  const tagList = Array.isArray(tags)
    ? tags.filter(Boolean).slice(0, 4)
    : typeof tags === "string" && tags.trim()
    ? tags.split(",").map((t) => t.trim()).filter(Boolean).slice(0, 4)
    : [];

  const handleDownload = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (!pdfUrl) return;

    const cleanTitle = (title || "book")
      .replace(/[/\\?%*:|"<>]/g, "-")
      .replace(/\s+/g, "_")
      .slice(0, 75);
    const fileName = `${cleanTitle}.pdf`;

    try {
      if (pdfUrl.includes("res.cloudinary.com") && pdfUrl.includes("/upload/")) {
        let downloadUrl = pdfUrl;
        if (!downloadUrl.includes("fl_attachment")) {
          downloadUrl = downloadUrl.replace("/upload/", "/upload/fl_attachment/");
        }
        const link = document.createElement("a");
        link.href = downloadUrl;
        link.setAttribute("download", fileName);
        link.setAttribute("target", "_blank");
        link.setAttribute("rel", "noopener noreferrer");
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      } else {
        const link = document.createElement("a");
        link.href = pdfUrl;
        link.download = fileName;
        link.target = "_blank";
        link.rel = "noopener noreferrer";
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      }
    } catch {
      setIsPdfOpen(true);
    }
  };

  return (
    <>
      <article
        className="group relative rounded-[26px] sm:rounded-[30px] md:rounded-[32px] p-3.5 xs:p-4 sm:p-5 md:p-6 transition-all duration-300 overflow-hidden border shadow-[0_6px_25px_rgba(43,33,24,0.06),0_2px_8px_rgba(43,33,24,0.03)] hover:shadow-[0_12px_36px_rgba(43,33,24,0.1)] hover:-translate-y-0.5"
        style={{
          background: "linear-gradient(175deg, #FAF6EE 0%, #F6EFE5 50%, #F2E9DC 100%)",
          borderColor: "rgba(168, 121, 62, 0.22)",
        }}
      >
        {/* ══════════════════════════════════════════════════════════════
            TOP BAR: Category Pill on Left, Bookmark on Right
        ══════════════════════════════════════════════════════════════ */}
        <div className="flex items-center justify-between gap-3 mb-2 sm:mb-2.5 relative z-20" dir="ltr">
          {/* Category Badge on LEFT */}
          <div
            className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full shadow-2xs select-none"
            style={{
              backgroundColor: COLORS.primary || "#2B2118",
              color: "#FAF6EF",
            }}
          >
            <BookOpen className="w-3.5 h-3.5 text-[#C8A46A] shrink-0" />
            <span className="font-['Payami_Nastaleeq',serif] text-xs sm:text-[13px] font-bold pt-0.5 leading-none">
              {categoryLabel}
            </span>
          </div>

          {/* Bookmark Button on RIGHT */}
          <button
            type="button"
            onClick={handleToggleBookmark}
            className="w-8 h-8 sm:w-8.5 sm:h-8.5 rounded-full flex items-center justify-center border transition-all duration-200 cursor-pointer shadow-2xs hover:scale-105"
            style={{
              borderColor: "rgba(168, 121, 62, 0.3)",
              backgroundColor: isBookmarked ? "#FAF4EB" : "rgba(255, 255, 255, 0.9)",
              color: COLORS.accent || "#A8793E",
            }}
            title={isBookmarked ? "بک مارک ہٹائیں" : "بک مارک کریں"}
            aria-label={isBookmarked ? "Remove bookmark" : "Bookmark this book"}
          >
            <Bookmark
              className={`w-3.5 h-3.5 sm:w-4 sm:h-4 transition-colors ${
                isBookmarked ? "fill-[#A8793E] text-[#A8793E]" : "text-[#A8793E]"
              }`}
            />
          </button>
        </div>

        {/* ══════════════════════════════════════════════════════════════
            TWO-COLUMN DESKTOP (BOOK LEFT 5-COLS | CONTENT RIGHT 7-COLS)
            STACKED ON MOBILE (BOOK TOP | CONTENT BELOW)
            Using [direction:ltr] container with 12-column grid so Column 1 is strictly LEFT
            and Column 2 is strictly RIGHT on desktop without gap overflow!
        ══════════════════════════════════════════════════════════════ */}
        <div className="flex flex-col md:grid md:grid-cols-12 md:items-center gap-4 sm:gap-5 md:gap-6 [direction:ltr]">

          {/* ──────────────────────────────────────────────────────────
              COLUMN 1: BOOK IMAGE STAGE
              - Desktop (>= 768px): md:col-span-5, strictly on the LEFT, compact & smaller
              - Mobile (< 768px): Centered on TOP, larger hero presentation
          ────────────────────────────────────────────────────────── */}
          <div className="w-full md:col-span-5 min-w-0 flex items-center justify-center relative select-none">
            <Link
              to={detailUrl}
              className="relative w-full flex flex-col items-center justify-end cursor-pointer group/stage pt-2 pb-1"
              title={title}
            >
              {/* Background Grand Islamic Mimbar Arch - Wider on mobile, clean & neat on desktop */}
              <MihrabArchBackground className="absolute -inset-x-3 sm:-inset-x-4 md:inset-x-0 -top-3.5 sm:-top-5 md:top-0 md:bottom-2 w-[calc(100%+24px)] sm:w-[calc(100%+32px)] md:w-full h-[calc(100%+18px)] sm:h-[calc(100%+24px)] md:h-[98%] opacity-100" />

              {/* Foliage Silhouette on Far Left */}
              <OliveBranchSilhouette className="absolute -left-2 sm:-left-3 top-2 w-12 sm:w-16 md:w-18 h-32 sm:h-44 md:h-48 z-0 opacity-75" />

              {/* Ambient Warm Radial Glow: Soft and understated */}
              <div
                className="absolute inset-0 rounded-full pointer-events-none filter blur-xl opacity-25 -z-10"
                style={{
                  background:
                    "radial-gradient(circle at 50% 40%, rgba(245, 226, 175, 0.4) 0%, rgba(250, 235, 200, 0.2) 45%, rgba(247, 241, 232, 0) 80%)",
                }}
              />

              {/*
                3D Book Artwork:
                - Mobile (< 768px): w-[74%] to w-[78%]
                - Desktop (>= 768px): md:w-[72%] lg:w-[74%]
              */}
              <div className="relative z-10 w-[74%] xs:w-[76%] sm:w-[78%] md:w-[72%] lg:w-[74%] max-w-[265px] sm:max-w-[305px] md:max-w-[215px] lg:max-w-[235px] h-[265px] xs:h-[295px] sm:h-[325px] md:h-[215px] lg:h-[230px] flex items-end justify-center transition-transform duration-500 ease-out group-hover/stage:-translate-y-1">
                <img
                  src={coverImageSrc}
                  alt={title}
                  className="w-full h-full object-contain object-bottom filter drop-shadow-[0_2px_4px_rgba(43,33,24,0.18)] origin-bottom-left rotate-[1.1deg]"
                  decoding="async"
                  onError={() => {
                    const fallbackCover = "/assets/images/books/islamic-book-cover.jpg";
                    if (imgSrc !== fallbackCover) {
                      setImgSrc(fallbackCover);
                    } else {
                      setImageError(true);
                    }
                  }}
                />
              </div>

              {/* Pedestal Stage (Base / Desk): Connected firmly to book base with light subtle shadow */}
              <div className="relative z-0 -mt-7 xs:-mt-7.5 sm:-mt-8 md:-mt-6 lg:-mt-6.5 w-[90%] xs:w-[92%] sm:w-[94%] md:w-[86%] lg:w-[88%] max-w-[280px] sm:max-w-[320px] md:max-w-[230px] lg:max-w-[245px] mx-auto">
                <PedestalStage className="w-full" />
              </div>
            </Link>
          </div>

          {/* ──────────────────────────────────────────────────────────
              COLUMN 2: CONTENT & ACTIONS
              - Desktop (>= 768px): md:col-span-7, strictly on the RIGHT, compact horizontal layout
              - Mobile (< 768px): Below the book image
              - [direction:rtl] with min-w-0 and right padding to ensure zero clipping
          ────────────────────────────────────────────────────────── */}
          <div className="w-full md:col-span-7 min-w-0 flex flex-col justify-between text-right [direction:rtl] pr-0.5 sm:pr-1 md:pr-2">
            <div>
              {/* Book Title */}
              <Link to={detailUrl} className="block group/title">
                <h3
                  className="text-base xs:text-lg sm:text-xl md:text-[20px] lg:text-[22px] font-bold font-['Payami_Nastaleeq',serif] leading-[1.7] sm:leading-[1.75] text-right transition-colors group-hover/title:text-[#A8793E]"
                  style={{ color: COLORS.primary || "#2B2118" }}
                >
                  {title}
                </h3>
              </Link>

              {/* Islamic Rosette Divider */}
              <IslamicRosetteDivider className="my-1 sm:my-1.5" />

              {/* Compact Metadata List with Small Line Icons */}
              <div className="space-y-1 text-[11px] sm:text-xs font-['Payami_Nastaleeq',serif] select-none">
                {/* Author */}
                {author && (
                  <div className="flex items-center gap-1.5 sm:gap-2" style={{ color: COLORS.primary || "#2B2118" }}>
                    <User className="w-3.5 h-3.5 text-[#A8793E] shrink-0" />
                    <span className="font-semibold">{author}</span>
                  </div>
                )}

                {/* Institution / Publisher (if provided) */}
                {(institution || publisher) && (
                  <div className="flex items-center gap-1.5 sm:gap-2 text-[#5A4638]">
                    <Building2 className="w-3.5 h-3.5 text-[#A8793E] shrink-0" />
                    <span>{institution || publisher}</span>
                  </div>
                )}
              </div>

              {/* Tags Row */}
              {tagList.length > 0 && (
                <div className="flex flex-wrap items-center gap-1.5 my-1.5 select-none">
                  {tagList.map((tag, idx) => (
                    <span
                      key={idx}
                      className="px-2 sm:px-2.5 py-0.5 rounded-full text-[10.5px] sm:text-[11px] font-['Payami_Nastaleeq',serif] border shadow-2xs"
                      style={{
                        backgroundColor: "rgba(243, 230, 214, 0.8)",
                        borderColor: "rgba(168, 121, 62, 0.25)",
                        color: "#3D3025",
                      }}
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              )}

              {/* Book Description / Introduction (کتاب کا تعارف) */}
              {summary && (
                <div className="mt-1.5 mb-2 sm:mb-2.5">
                  <div className="flex items-center gap-1.5 mb-1 select-none">
                    <span
                      className="w-1.5 h-3.5 sm:h-4 rounded-full shrink-0"
                      style={{ backgroundColor: COLORS.accent || "#A8793E" }}
                    />
                    <h4
                      className="text-xs sm:text-[13px] font-bold font-['Payami_Nastaleeq',serif] leading-none pt-0.5"
                      style={{ color: COLORS.primary || "#2B2118" }}
                    >
                      کتاب کا تعارف
                    </h4>
                  </div>

                  <p
                    className="text-[11px] sm:text-xs md:text-[12.5px] font-['Payami_Nastaleeq',serif] leading-[1.85] sm:leading-[1.9] line-clamp-2 md:line-clamp-3 text-right"
                    style={{ color: "#3D3025" }}
                  >
                    {summary}
                  </p>

                  <Link
                    to={detailUrl}
                    className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10.5px] sm:text-xs font-bold font-['Payami_Nastaleeq',serif] border transition-colors mt-1 shadow-2xs hover:bg-[#E8DCCB]"
                    style={{
                      backgroundColor: "#EFE4D3",
                      borderColor: "rgba(168, 121, 62, 0.25)",
                      color: COLORS.primary || "#2B2118",
                    }}
                  >
                    <span>مزید پڑھیں</span>
                    <ArrowLeft className="w-3 h-3 text-[#A8793E]" />
                  </Link>
                </div>
              )}
            </div>

            {/* ──────────────────────────────────────────────────────────
                ACTION BUTTONS: Both Secondary & Primary side-by-side
            ────────────────────────────────────────────────────────── */}
            <div
              className="pt-2 sm:pt-2.5 border-t grid grid-cols-2 gap-2 sm:gap-2.5 mt-1 sm:mt-1.5"
              style={{ borderColor: "rgba(168, 121, 62, 0.2)" }}
            >
              {/* Secondary Action: تفصیلات دیکھیں */}
              <Link
                to={detailUrl}
                className="flex items-center justify-center gap-1.5 px-3 py-2 text-xs sm:text-[12.5px] font-bold font-['Payami_Nastaleeq',serif] rounded-xl sm:rounded-2xl border transition-all duration-200 cursor-pointer shadow-xs hover:bg-[#F3E8D8] active:scale-[0.99] min-h-[38px] sm:min-h-[40px]"
                style={{
                  backgroundColor: "#FAF6EF",
                  borderColor: "#A8793E",
                  color: COLORS.primary || "#2B2118",
                }}
              >
                <Info className="w-3.5 h-3.5 text-[#A8793E] shrink-0" />
                <span>تفصیلات دیکھیں</span>
              </Link>

              {/* Primary Action: ڈاؤن لوڈ کریں */}
              {pdfUrl ? (
                <button
                  type="button"
                  onClick={handleDownload}
                  className="flex items-center justify-center gap-1.5 px-3 py-2 text-xs sm:text-[12.5px] font-bold font-['Payami_Nastaleeq',serif] text-white rounded-xl sm:rounded-2xl border-0 transition-all duration-200 cursor-pointer shadow-sm hover:opacity-95 active:scale-[0.99] min-h-[38px] sm:min-h-[40px]"
                  style={{ backgroundColor: COLORS.primary || "#2B2118" }}
                >
                  <Download className="w-3.5 h-3.5 text-[#C8A46A] shrink-0 stroke-[2.2]" />
                  <span>ڈاؤن لوڈ کریں</span>
                </button>
              ) : (
                <span
                  className="flex items-center justify-center text-xs font-['Payami_Nastaleeq',serif] py-2 text-center opacity-70"
                  style={{ color: "#7A6855" }}
                >
                  پی ڈی ایف دستیاب نہیں
                </span>
              )}
            </div>
          </div>
        </div>
      </article>

      {/* PDF Viewer Modal (Preserved & accessible) */}
      {isPdfOpen && pdfUrl && (
        <PdfViewer
          url={pdfUrl}
          title={title}
          isModal={true}
          onClose={() => setIsPdfOpen(false)}
        />
      )}
    </>
  );
}

PublicationCard.propTypes = {
  publication: PropTypes.shape({
    _id: PropTypes.string,
    slug: PropTypes.string,
    title: PropTypes.string,
    summary: PropTypes.string,
    category: PropTypes.string,
    blanguage: PropTypes.string,
    author: PropTypes.string,
    publishDate: PropTypes.oneOfType([PropTypes.string, PropTypes.instanceOf(Date)]),
    coverImage: PropTypes.oneOfType([
      PropTypes.string,
      PropTypes.shape({
        url: PropTypes.string,
        public_id: PropTypes.string,
      }),
    ]),
    pdf: PropTypes.oneOfType([
      PropTypes.string,
      PropTypes.shape({
        url: PropTypes.string,
        public_id: PropTypes.string,
      }),
    ]),
    pageCount: PropTypes.number,
    tags: PropTypes.oneOfType([PropTypes.arrayOf(PropTypes.string), PropTypes.string]),
    institution: PropTypes.string,
    publisher: PropTypes.string,
  }),
};
