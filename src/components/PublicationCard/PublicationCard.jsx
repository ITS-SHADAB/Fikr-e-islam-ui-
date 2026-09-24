import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import PropTypes from "prop-types";
import {
  BookOpen,
  Bookmark,
  Download,
  Calendar,
  User,
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
          <stop offset="0%" stopColor="#6E4215" />
          <stop offset="25%" stopColor="#B58133" />
          <stop offset="50%" stopColor="#ECC26E" />
          <stop offset="75%" stopColor="#B58133" />
          <stop offset="100%" stopColor="#6E4215" />
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

      {/* Left Fluted Pillar (عمود المنبر الأيسر) - Rich Bronze-Gold with 3D Fluting */}
      <g filter="drop-shadow(0 1px 3px rgba(43,33,24,0.18))">
        {/* Pillar Shaft */}
        <rect x="13" y="115" width="11" height="195" rx="2" fill="url(#pillarGrad)" stroke="#5A3510" strokeWidth="0.8" />
        {/* Inner Fluted Groove Lines for 3D depth */}
        <line x1="16.5" y1="124" x2="16.5" y2="303" stroke="#5A3510" strokeWidth="0.6" strokeOpacity="0.65" />
        <line x1="18.5" y1="124" x2="18.5" y2="303" stroke="#FFF5DE" strokeWidth="0.7" strokeOpacity="0.85" />
        <line x1="20.5" y1="124" x2="20.5" y2="303" stroke="#5A3510" strokeWidth="0.6" strokeOpacity="0.65" />
        {/* Capital (Top) */}
        <path d="M 10 114 L 27 114 L 25 124 L 12 124 Z" fill="#8C5C24" stroke="#5A3510" strokeWidth="0.8" />
        <rect x="9" y="111.5" width="19" height="3" rx="1" fill="#C89642" stroke="#5A3510" strokeWidth="0.6" />
        {/* Base (Bottom) */}
        <path d="M 11 303 L 26 303 L 28 313 L 9 313 Z" fill="#8C5C24" stroke="#5A3510" strokeWidth="0.8" />
        <rect x="8" y="312.5" width="21" height="3.5" rx="1" fill="#C89642" stroke="#5A3510" strokeWidth="0.6" />
      </g>

      {/* Right Fluted Pillar (عمود المنبر الأيمن) - Rich Bronze-Gold with 3D Fluting */}
      <g filter="drop-shadow(0 1px 3px rgba(43,33,24,0.18))">
        {/* Pillar Shaft */}
        <rect x="236" y="115" width="11" height="195" rx="2" fill="url(#pillarGrad)" stroke="#5A3510" strokeWidth="0.8" />
        {/* Inner Fluted Groove Lines for 3D depth */}
        <line x1="239.5" y1="124" x2="239.5" y2="303" stroke="#5A3510" strokeWidth="0.6" strokeOpacity="0.65" />
        <line x1="241.5" y1="124" x2="241.5" y2="303" stroke="#FFF5DE" strokeWidth="0.7" strokeOpacity="0.85" />
        <line x1="243.5" y1="124" x2="243.5" y2="303" stroke="#5A3510" strokeWidth="0.6" strokeOpacity="0.65" />
        {/* Capital (Top) */}
        <path d="M 233 114 L 250 114 L 248 124 L 235 124 Z" fill="#8C5C24" stroke="#5A3510" strokeWidth="0.8" />
        <rect x="232" y="111.5" width="19" height="3" rx="1" fill="#C89642" stroke="#5A3510" strokeWidth="0.6" />
        {/* Base (Bottom) */}
        <path d="M 234 303 L 249 303 L 251 313 L 232 313 Z" fill="#8C5C24" stroke="#5A3510" strokeWidth="0.8" />
        <rect x="231" y="312.5" width="21" height="3.5" rx="1" fill="#C89642" stroke="#5A3510" strokeWidth="0.6" />
      </g>

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

  // Summary text inline processing (word boundary truncation with clean trailing punctuation)
  const cleanSummary = (summary || "").replace(/\s+/g, " ").trim();
  const MAX_SUMMARY_CHARS = 260;
  const isTruncated = cleanSummary.length > MAX_SUMMARY_CHARS;

  let displaySummary = cleanSummary;
  if (isTruncated) {
    const cut = cleanSummary.slice(0, MAX_SUMMARY_CHARS);
    const lastSpace = cut.lastIndexOf(" ");
    let text = (lastSpace > 180 ? cut.slice(0, lastSpace) : cut).trim();
    text = text.replace(/[۔،,.\s]+$/, "");
    displaySummary = text;
  } else {
    displaySummary = displaySummary.replace(/[۔،,.\s]+$/, "");
  }

  return (
    <>
      <article
        className="group relative rounded-[22px] sm:rounded-[26px] p-3 sm:p-4 md:p-4.5 transition-all duration-300 overflow-hidden border shadow-[0_5px_22px_rgba(43,33,24,0.06),0_2px_6px_rgba(43,33,24,0.03)] hover:shadow-[0_12px_32px_rgba(43,33,24,0.1)] hover:border-[rgba(168,121,62,0.4)] hover:-translate-y-0.5"
        style={{
          background: "linear-gradient(175deg, #FAF6EE 0%, #F6EFE5 50%, #F2E9DC 100%)",
          borderColor: "rgba(168, 121, 62, 0.24)",
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
            <span className="font-['Payami_Nastaleeq',serif] text-xs sm:text-[12.5px] font-bold pt-0.5 leading-none">
              {categoryLabel}
            </span>
          </div>

          {/* Bookmark Button on RIGHT */}
          <button
            type="button"
            onClick={handleToggleBookmark}
            className="w-7.5 h-7.5 sm:w-8 sm:h-8 rounded-full flex items-center justify-center border transition-all duration-200 cursor-pointer shadow-2xs hover:scale-105"
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
              COLUMN 1: BOOK IMAGE STAGE (Exact Match to BookDetail scale & width)
              - Desktop (>= 768px): md:col-span-5, strictly on the LEFT
              - Mobile (< 768px): Centered on TOP with full original width & presence
          ────────────────────────────────────────────────────────── */}
          <div className="w-full md:col-span-5 min-w-0 flex items-center justify-center relative select-none">
            <Link
              to={detailUrl}
              className="relative w-full max-w-[240px] sm:max-w-[260px] md:max-w-none mx-auto rounded-2xl sm:rounded-3xl p-2.5 sm:p-4 flex flex-col items-center justify-end cursor-pointer group/stage overflow-hidden transition-all duration-300 hover:shadow-lg"
              style={{
                background:
                  "radial-gradient(ellipse at 50% 25%, #FFFDF9 0%, #FAF3E6 50%, #EFE1CC 100%)",
                border: "1.5px solid #C8A46A",
                boxShadow:
                  "0 0 0 3px #FAF4EA, 0 0 0 4.5px rgba(200, 164, 106, 0.55), 0 10px 30px rgba(43, 33, 24, 0.09)",
              }}
              title={title}
            >
              {/* Background Grand Islamic Mimbar Arch - Crisp & Majestic */}
              <MihrabArchBackground className="absolute inset-0 w-full h-full opacity-100 pointer-events-none" />

              {/* Foliage Silhouette on Far Left */}
              <OliveBranchSilhouette className="absolute -left-1 top-2 w-8 sm:w-12 h-24 sm:h-36 z-0 opacity-65 pointer-events-none" />

              {/* Ambient Warm Golden Glow */}
              <div
                className="absolute inset-0 rounded-full pointer-events-none filter blur-xl opacity-35 -z-10"
                style={{
                  background:
                    "radial-gradient(circle at 50% 40%, rgba(245, 226, 175, 0.6) 0%, rgba(250, 235, 200, 0.3) 45%, transparent 75%)",
                }}
              />

              {/* 3D Book Artwork resting firmly on desk - Full Width & Height */}
              <div className="relative z-10 w-[84%] max-w-[195px] sm:max-w-[225px] h-[195px] sm:h-[245px] flex items-end justify-center transition-transform duration-300 ease-out group-hover/stage:-translate-y-1">
                <img
                  src={coverImageSrc}
                  alt={title}
                  className="w-auto max-w-full max-h-full object-contain object-bottom filter drop-shadow-[0_12px_20px_rgba(43,33,24,0.24)] drop-shadow-[0_2px_4px_rgba(43,33,24,0.12)] rounded-xs"
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

              {/* Pedestal Stage (Base / Desk) */}
              <div className="relative z-0 -mt-4 sm:-mt-5 w-[94%] max-w-[230px] mx-auto pointer-events-none">
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
                  className="text-base xs:text-lg sm:text-xl md:text-[20px] lg:text-[22px] font-bold font-['Payami_Nastaleeq',serif] leading-[1.65] sm:leading-[1.7] text-right transition-colors group-hover/title:text-[#A8793E]"
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

              {/* Book Description / Introduction (کتاب کا تعارف) with Inline مزید پڑھیں */}
              {cleanSummary && (
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
                    className="text-[11.5px] sm:text-xs md:text-[12.5px] font-['Payami_Nastaleeq',serif] leading-[1.85] sm:leading-[1.9] text-right"
                    style={{ color: "#3D3025" }}
                  >
                    <span>{displaySummary}</span>
                    {isTruncated ? (
                      <>
                        <span className="text-[#3D3025] mx-0.5 tracking-wider select-none font-bold">...</span>{" "}
                        <Link
                          to={detailUrl}
                          className="inline font-bold font-['Payami_Nastaleeq',serif] text-[#8C6239] hover:text-[#4A3728] underline decoration-dotted underline-offset-4 hover:underline-offset-2 transition-colors cursor-pointer text-[11.5px] sm:text-xs md:text-[12.5px]"
                          title="مزید تفصیلات پڑھیں"
                        >
                          مزید پڑھیں
                        </Link>
                      </>
                    ) : (
                      <>
                        {" "}
                        <Link
                          to={detailUrl}
                          className="inline font-bold font-['Payami_Nastaleeq',serif] text-[#8C6239] hover:text-[#4A3728] underline decoration-dotted underline-offset-4 hover:underline-offset-2 transition-colors cursor-pointer text-[11.5px] sm:text-xs md:text-[12.5px]"
                          title="مزید تفصیلات پڑھیں"
                        >
                          مزید پڑھیں
                        </Link>
                      </>
                    )}
                  </p>
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
