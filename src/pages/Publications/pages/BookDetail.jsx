import React, { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import {
  BookOpen,
  Download,
  User,
  ArrowRight,
  ArrowLeft,
  Globe,
  ChevronDown,
  ChevronUp,
  MessageSquare,
  Tag,
  Calendar,
  Share2,
  FileText,
  Home,
} from "lucide-react";
import { getPublicationBySlug } from "@/services";
import { useCachedContent } from "@/hooks/useContentCache";
import { STALE_TIMES } from "@/store/slices/contentSlice";
import { useSettings } from "@/hooks/useSettings";
import { COLORS } from "@/utils/themeColors";
import { BACKEND_URL } from "@/constants/urls";
import {
  PUBLICATION_CATEGORY_TRANSLATIONS,
  BOOK_LANGUAGE_TRANSLATIONS,
} from "@/utils/categories";
import { PdfViewer, Spinner } from "@/components";
import CommentsSection from "@/components/CommentsSection";
import {
  MihrabArchBackground,
  OliveBranchSilhouette,
  PedestalStage,
} from "@/components/PublicationCard/PublicationCard";
import { CardGeometricTexture } from "@/pages/Fatwas/components/FatwaDetailDecorativeAssets";
import toast from "react-hot-toast";

export default function BookDetail() {
  const { id, slug } = useParams();
  const rawParam = slug || id;
  const navigate = useNavigate();
  const { settings } = useSettings();
  const language =
    settings?.language === "ur" || settings?.language === "Urdu" ? "ur" : "en";
  const isRTL = language === "ur";

  const { data: detailData, loading, error } = useCachedContent({
    type: "publications_detail",
    params: rawParam,
    fetcher: async () => {
      const data = await getPublicationBySlug(rawParam);
      const bookData = data?.book || data;
      const relatedBooks = data?.related || [];
      return { book: bookData, relatedBooks };
    },
    staleTime: STALE_TIMES.publications,
    enabled: !!rawParam,
  });

  const book = detailData?.book || null;
  const relatedBooks = detailData?.relatedBooks || [];

  const [isPdfModalOpen, setIsPdfModalOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  const [isSummaryExpanded, setIsSummaryExpanded] = useState(false);
  const [isCommentsOpen, setIsCommentsOpen] = useState(false);

  const getCoverImageSrc = (img, bookCategory) => {
    if (img) {
      const url = typeof img === "object" ? img.url : img;
      if (url && typeof url === "string" && url.trim() !== "") {
        if (url.startsWith("/")) return `${BACKEND_URL}${url}`;
        return url;
      }
    }
    const isGreenTheme =
      bookCategory === "Quran" ||
      bookCategory === "Hadith" ||
      bookCategory === "قرآن و تفاسیر" ||
      bookCategory === "حدیث";
    return isGreenTheme
      ? "/assets/images/books/islamic-book-cover-green.jpg"
      : "/assets/images/books/islamic-book-cover.jpg";
  };

  const [imgSrc, setImgSrc] = useState(() =>
    getCoverImageSrc(book?.coverImage, book?.category)
  );

  useEffect(() => {
    setImgSrc(getCoverImageSrc(book?.coverImage, book?.category));
  }, [book?.coverImage, book?.category]);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [rawParam]);

  const shareUrl = typeof window !== "undefined" ? window.location.href : "";

  const copyToClipboard = () => {
    if (typeof navigator !== "undefined" && navigator.clipboard) {
      navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      toast.success(isRTL ? "لنک کاپی ہو گیا ہے!" : "Link copied to clipboard!");
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleNativeShare = async () => {
    const fullShareText = `${book?.title || ""}\n${book?.author ? `مصنف: ${book.author}\n` : ""
      }${shareUrl}`;
    if (typeof navigator !== "undefined" && navigator.share) {
      try {
        await navigator.share({
          title: book?.title || "کتاب",
          text: fullShareText,
          url: shareUrl,
        });
      } catch (err) {
        if (err.name !== "AbortError") {
          copyToClipboard();
        }
      }
    } else {
      copyToClipboard();
    }
  };

  if (loading) {
    return (
      <div
        className="min-h-screen flex items-center justify-center"
        style={{ backgroundColor: COLORS.background }}
      >
        <Spinner size="lg" text="کتاب کی تفصیلات لوڈ ہو رہی ہیں..." />
      </div>
    );
  }

  if (error || !book) {
    return (
      <div
        className="min-h-screen flex flex-col items-center justify-center p-6 text-center"
        style={{ backgroundColor: COLORS.background }}
        dir={isRTL ? "rtl" : "ltr"}
      >
        <div
          className="w-16 h-16 rounded-full flex items-center justify-center mb-4 shadow-sm"
          style={{ backgroundColor: `${COLORS.primary}15` }}
        >
          <BookOpen className="w-8 h-8" style={{ color: COLORS.primary }} />
        </div>
        <h2
          className="text-2xl font-bold font-serif mb-2"
          style={{ color: COLORS.textPrimary }}
        >
          {isRTL ? "کتاب دستیاب نہیں ہے" : "Book Not Found"}
        </h2>
        <p
          className="text-sm max-w-md mb-6"
          style={{ color: COLORS.textSecondary }}
        >
          {error ||
            (isRTL
              ? "مطلوبہ کتاب موجود نہیں ہے یا ہٹا دی گئی ہے۔"
              : "The requested book does not exist or has been removed.")}
        </p>
        <Link
          to="/publications"
          className="px-6 py-2.5 rounded-xl font-bold text-white text-sm shadow-md transition-transform hover:scale-105"
          style={{ backgroundColor: COLORS.primary }}
        >
          {isRTL ? "تمام کتب دیکھیں" : "View All Books"}
        </Link>
      </div>
    );
  }

  const {
    _id,
    title,
    summary,
    category,
    blanguage = "Urdu",
    author = "مفتی فیضان سرور مصباحی",
    publishDate,
    coverImage,
    pdf,
    pageCount,
    tags = [],
    viewCount = 0,
  } = book;

  const pdfUrl = pdf?.url || (typeof pdf === "string" ? pdf : null);

  const handleImageError = () => {
    const isGreen =
      category === "Quran" ||
      category === "Hadith" ||
      category === "قرآن و تفاسیر" ||
      category === "حدیث";
    const fallback = isGreen
      ? "/assets/images/books/islamic-book-cover-green.jpg"
      : "/assets/images/books/islamic-book-cover.jpg";
    if (imgSrc !== fallback) {
      setImgSrc(fallback);
    }
  };

  const coverImageSrc = imgSrc;
  const categoryLabel =
    PUBLICATION_CATEGORY_TRANSLATIONS[category] ||
    category ||
    (isRTL ? "کتب و رسائل" : "Books");
  const bookLang = book?.language || blanguage || "Urdu";
  const languageLabel =
    BOOK_LANGUAGE_TRANSLATIONS[bookLang] ||
    bookLang ||
    (isRTL ? "اردو" : "Urdu");

  // Robust date fallback and multi-resolution responsive formatting
  const rawDate =
    publishDate ||
    book?.publishDate ||
    book?.createdAt ||
    book?.updatedAt ||
    book?.year ||
    book?.publishedYear;

  const formatPublicationDate = (d) => {
    if (!d) return { full: "—", mobileLine1: "—", mobileLine2: "" };
    if (/^\d{4}$/.test(String(d).trim())) {
      const yr = String(d).trim();
      const yrDisplay = isRTL ? `${yr}ء` : yr;
      return { full: yrDisplay, mobileLine1: yrDisplay, mobileLine2: "" };
    }
    const dt = new Date(d);
    if (isNaN(dt.getTime())) {
      const fallbackStr = String(d).slice(0, 15);
      return { full: fallbackStr, mobileLine1: fallbackStr, mobileLine2: "" };
    }
    const day = dt.getDate();
    const year = dt.getFullYear();
    const urduMonths = [
      "جنوری", "فروری", "مارچ", "اپریل", "مئی", "جون",
      "جولائی", "اگست", "ستمبر", "اکتوبر", "نومبر", "دسمبر"
    ];
    const enMonths = [
      "Jan", "Feb", "Mar", "Apr", "May", "Jun",
      "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
    ];
    const month = isRTL ? urduMonths[dt.getMonth()] : enMonths[dt.getMonth()];
    const yrFormatted = isRTL ? `${year}ء` : `${year}`;

    return {
      full: `${day} ${month} ${yrFormatted}`,
      mobileLine1: `${day} ${month}`,
      mobileLine2: `${yrFormatted}`,
    };
  };

  const {
    full: fullFormattedDate,
    mobileLine1,
    mobileLine2,
  } = formatPublicationDate(rawDate);

  // Summary text inline processing (260 chars cutoff matching previous visible volume)
  const cleanSummary = (summary || "").replace(/\s+/g, " ").trim();
  const BOOK_DETAIL_MAX_CHARS = 260;
  const isSummaryLong = cleanSummary.length > BOOK_DETAIL_MAX_CHARS;

  let truncatedBookSummary = cleanSummary;
  if (isSummaryLong) {
    const cut = cleanSummary.slice(0, BOOK_DETAIL_MAX_CHARS);
    const lastSpace = cut.lastIndexOf(" ");
    let text = (lastSpace > 180 ? cut.slice(0, lastSpace) : cut).trim();
    text = text.replace(/[۔،,.\s]+$/, "");
    truncatedBookSummary = text;
  }

  return (
    <div
      dir={isRTL ? "rtl" : "ltr"}
      className="w-full py-2.5 sm:py-4 md:py-5 pb-6 sm:pb-8 md:pb-10"
      style={{ backgroundColor: COLORS.background }}
    >
      <div className="w-full max-w-4xl lg:max-w-5xl mx-auto px-3 sm:px-6 space-y-2.5 sm:space-y-3.5">
        {/* ══════════════════════════════════════════════════════════════
            1. BREADCRUMBS & LANGUAGE PILL (Exact Match to Target Design)
               In RTL: 1st child is on the RIGHT (Language Pill),
                       2nd child is on the LEFT (Breadcrumbs with Home Icon)
        ══════════════════════════════════════════════════════════════ */}
        <div
          className="flex items-center justify-between gap-2 pb-2 border-b text-xs sm:text-sm font-medium"
          style={{ borderColor: `${COLORS.border}70` }}
        >
          {/* Right in RTL: Language Indicator Pill */}
          <div
            className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold shadow-2xs border select-none shrink-0"
            style={{
              backgroundColor: "rgba(255, 255, 255, 0.9)",
              borderColor: `${COLORS.border}90`,
              color: COLORS.primary,
            }}
          >
            <Globe className="w-3.5 h-3.5 text-amber-700" />
            <span className="font-serif">{language === "ur" ? "اردو" : "English"}</span>
            <ChevronDown className="w-3 h-3 text-slate-400" />
          </div>

          {/* Left in RTL: Breadcrumb Path starting with Home */}
          <nav className="flex items-center gap-1 sm:gap-2 flex-wrap text-slate-600 min-w-0">
            <span
              className="font-bold truncate max-w-[100px] sm:max-w-xs font-serif"
              style={{ color: COLORS.primary }}
              title={title}
            >
              {title}
            </span>
            <span className="text-amber-800/40 text-xs">‹</span>

            <Link
              to={`/publications?category=${encodeURIComponent(category || "")}`}
              className="hover:text-amber-800 transition-colors font-serif font-semibold truncate max-w-[90px] sm:max-w-none"
              style={{ color: COLORS.accent }}
            >
              {categoryLabel}
            </Link>
            <span className="text-amber-800/40 text-xs">‹</span>

            <Link
              to="/publications"
              className="hover:text-amber-800 transition-colors font-serif truncate"
              style={{ color: COLORS.textSecondary }}
            >
              {isRTL ? "کتب و رسائل" : "Publications"}
            </Link>
            <span className="text-amber-800/40 text-xs">‹</span>

            <Link
              to="/"
              className="inline-flex items-center gap-1 hover:text-amber-800 transition-colors shrink-0"
              style={{ color: COLORS.textSecondary }}
            >
              <Home className="w-4 h-4 text-amber-800" />
              <span className="font-serif hidden xs:inline">{isRTL ? "ہوم" : "Home"}</span>
            </Link>
          </nav>
        </div>

        {/* ══════════════════════════════════════════════════════════════
            2. BOOK HERO SECTION: Side-by-Side (Matching Target Screenshot)
               In RTL:
               1st child (RIGHT): Title, Category, Author, Divider, 3 Stat Pills
               2nd child (LEFT): 3D Book on Grand Islamic Mimbar Arch Stage
        ══════════════════════════════════════════════════════════════ */}
        <div className="grid grid-cols-12 gap-2.5 sm:gap-6 md:gap-8 items-center pt-1">
          {/* Right Column in RTL: Category Badge, Title, Author & 3 Stat Boxes */}
          <div className="col-span-7 sm:col-span-7 space-y-2 sm:space-y-2.5 min-w-0 flex flex-col justify-center">
            {/* Category Pill - Subtle Border Style */}
            <div className="flex items-center">
              <span
                className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10.5px] sm:text-xs font-bold shadow-2xs font-serif border"
                style={{
                  backgroundColor: "rgba(255, 255, 255, 0.65)",
                  borderColor: "rgba(200, 164, 106, 0.6)",
                  color: "#5C3E20",
                }}
              >
                <BookOpen className="w-3 h-3 text-[#8C6239] shrink-0" />
                <span className="break-words">{categoryLabel}</span>
              </span>
            </div>

            {/* Book Title */}
            <h1
              className="text-lg xs:text-xl sm:text-2xl md:text-3xl font-bold font-serif leading-snug sm:leading-tight break-words"
              style={{ color: "#24180E" }}
            >
              {title}
            </h1>

            {/* Author Row - Clean Border Style without Bulky Box Gradient */}
            {author && (
              <div
                className="flex items-center gap-2 py-1 px-2.5 rounded-lg border text-xs sm:text-sm font-serif"
                style={{
                  borderColor: "rgba(200, 164, 106, 0.5)",
                  backgroundColor: "rgba(255, 255, 255, 0.5)",
                }}
              >
                <User className="w-3.5 h-3.5 text-[#8C6239] shrink-0" />
                <span className="text-[#8C6239] font-medium text-[11px] sm:text-xs shrink-0">
                  {isRTL ? "مصنف:" : "Author:"}
                </span>
                <span className="font-bold text-[#2B1E16] break-words min-w-0">
                  {author}
                </span>
              </div>
            )}

            {/* Unified Metadata Strip - Clean Border Style with Segmented Dividers */}
            <div
              className="grid grid-cols-3 rounded-xl border divide-x divide-x-reverse text-center py-2 px-1 shadow-2xs"
              style={{
                borderColor: "rgba(200, 164, 106, 0.55)",
                backgroundColor: "rgba(255, 255, 255, 0.55)",
              }}
            >
              {/* Stat 1: Language / زبان */}
              <div className="flex flex-col items-center justify-center px-1 min-w-0">
                <div className="flex items-center gap-1 text-[#8C6239] mb-0.5">
                  <Globe className="w-3 h-3 shrink-0" />
                  <span className="text-[10px] sm:text-[11px] font-medium font-serif">
                    {isRTL ? "زبان" : "Language"}
                  </span>
                </div>
                <span
                  className="text-[11px] sm:text-xs font-bold font-serif text-[#2B1E16] break-words line-clamp-1 max-w-full"
                  title={languageLabel}
                >
                  {languageLabel}
                </span>
              </div>

              {/* Stat 2: Pages / صفحات */}
              <div
                className="flex flex-col items-center justify-center px-1 min-w-0 border-r border-l sm:border-x"
                style={{ borderColor: "rgba(200, 164, 106, 0.35)" }}
              >
                <div className="flex items-center gap-1 text-[#8C6239] mb-0.5">
                  <BookOpen className="w-3 h-3 shrink-0" />
                  <span className="text-[10px] sm:text-[11px] font-medium font-serif">
                    {isRTL ? "صفحات" : "Pages"}
                  </span>
                </div>
                <span className="text-[11px] sm:text-xs font-bold font-serif text-[#2B1E16]">
                  {pageCount || "—"}
                </span>
              </div>

              {/* Stat 3: Publication Date / تاریخِ اشاعت */}
              <div className="flex flex-col items-center justify-center px-0.5 sm:px-1 min-w-0">
                <div className="flex items-center justify-center gap-1 text-[#8C6239] mb-0.5 text-center">
                  <Calendar className="w-3 h-3 shrink-0" />
                  <span className="text-[8px] xs:text-[9px] sm:text-[10.5px] font-medium font-serif shrink-0 whitespace-nowrap">
                    {isRTL ? "تاریخِ اشاعت" : "Publication Date"}
                  </span>
                </div>
                {/* Responsive Date: Exactly 1 line on desktop, exactly 2 lines on small mobile screen */}
                <div
                  className="font-bold font-serif text-[#2B1E16] text-center max-w-full"
                  title={fullFormattedDate}
                >
                  {/* Big screen: exactly 1 line */}
                  <span className="hidden sm:inline text-xs whitespace-nowrap">
                    {fullFormattedDate}
                  </span>
                  {/* Small screen: exactly 2 lines */}
                  <span className="flex sm:hidden flex-col items-center justify-center leading-tight">
                    <span className="text-[9px] xs:text-[10px] leading-tight whitespace-nowrap">
                      {mobileLine1}
                    </span>
                    {mobileLine2 && (
                      <span className="text-[8px] xs:text-[8.5px] text-[#5C3E20]/90 leading-tight whitespace-nowrap mt-0.5">
                        {mobileLine2}
                      </span>
                    )}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Left Column in RTL: 3D Book on Grand Islamic Mimbar Arch Stage */}
          <div className="col-span-5 sm:col-span-5 flex justify-center">
            <div
              className="relative w-full rounded-2xl sm:rounded-3xl p-2.5 sm:p-4 flex flex-col items-center justify-end select-none overflow-hidden"
              style={{
                background:
                  "radial-gradient(ellipse at 50% 25%, #FFFDF9 0%, #FAF3E6 50%, #EFE1CC 100%)",
                border: "1.5px solid #C8A46A",
                boxShadow:
                  "0 0 0 3px #FAF4EA, 0 0 0 4.5px rgba(200, 164, 106, 0.55), 0 10px 30px rgba(43, 33, 24, 0.09)",
              }}
            >
              {/* Floating Circular Share Button */}
              <button
                type="button"
                onClick={handleNativeShare}
                className="absolute top-2.5 right-2.5 z-20 w-7 h-7 sm:w-8 sm:h-8 rounded-full flex items-center justify-center shadow-md transition-transform hover:scale-105 active:scale-95 cursor-pointer border"
                style={{
                  backgroundColor: "#3A2618",
                  borderColor: "rgba(200, 164, 106, 0.6)",
                  color: "#DFC07C",
                }}
                title={isRTL ? "کتاب شیئر کریں" : "Share Book"}
              >
                <Share2 className="w-3.5 h-3.5" />
              </button>

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

              {/* 3D Book Artwork resting firmly on desk */}
              <div className="relative z-10 w-[84%] max-w-[195px] sm:max-w-[225px] h-[195px] sm:h-[255px] flex items-end justify-center transition-transform duration-300 ease-out hover:-translate-y-1">
                <img
                  src={coverImageSrc}
                  alt={title}
                  className="w-auto max-w-full max-h-full object-contain object-bottom filter drop-shadow-[0_12px_20px_rgba(43,33,24,0.24)] drop-shadow-[0_2px_4px_rgba(43,33,24,0.12)] rounded-xs"
                  decoding="async"
                  onError={handleImageError}
                />
              </div>

              {/* Pedestal Stage (Base / Desk) */}
              <div className="relative z-0 -mt-4 sm:-mt-5 w-[94%] max-w-[230px] mx-auto pointer-events-none">
                <PedestalStage className="w-full" />
              </div>
            </div>
          </div>
        </div>

        {/* ══════════════════════════════════════════════════════════════
            3. SUMMARY / INTRODUCTION CARD ("کتاب کا تعارف و خلاصہ")
               - Rich Warm Yellowish Parchment Texture
               - Exact Islamic Geometric Texture matching Fatwa Detail Summary
               - Corner Illustration Removed Per Request
               - Full-width comfortable text layout
               - Truncated Text with "مزید پڑھیں ∨" Toggle
        ══════════════════════════════════════════════════════════════ */}
        <div
          className="relative rounded-2xl sm:rounded-3xl border p-3.5 sm:p-5 md:p-6 overflow-hidden shadow-xs space-y-2.5"
          style={{
            background:
              "radial-gradient(circle at 95% 0%, #DFCEB7 0%, #E9DEC9 28%, #F7F1E8 60%)",
            borderColor: "#C8A46A",
            boxShadow: "0 6px 25px rgba(43, 33, 24, 0.05)",
          }}
        >
          {/* Subtle Islamic geometric texture across outer card (Exact Fatwa Detail Match) */}
          <CardGeometricTexture
            className="opacity-[0.06]"
            strokeColor="#C8A46A"
            secondaryColor="#A8793E"
            patternId="book-arabesque-base"
          />

          {/* Top-right subtle warm shading and lace texture (Exact Fatwa Detail Match) */}
          <div className="absolute top-0 right-0 w-48 sm:w-60 md:w-80 h-36 sm:h-44 md:h-52 pointer-events-none overflow-hidden rounded-tr-2xl sm:rounded-tr-3xl">
            <CardGeometricTexture
              className="opacity-[0.20]"
              strokeColor="#A8793E"
              secondaryColor="#C8A46A"
              patternId="book-arabesque-lace"
            />
          </div>

          {/* Header with Clear Hierarchy */}
          <div className="relative z-10 flex items-center justify-start gap-2.5">
            <div
              className="w-7 h-7 sm:w-8 sm:h-8 rounded-xl flex items-center justify-center shadow-xs shrink-0"
              style={{
                backgroundColor: "#4A3728",
                color: "#DFC07C",
              }}
            >
              <FileText className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
            </div>
            <h3
              className="text-sm sm:text-base md:text-lg font-bold font-serif"
              style={{ color: "#2B1E16" }}
            >
              {isRTL ? "کتاب کا تعارف و خلاصہ" : "Book Overview & Synopsis"}
            </h3>
          </div>

          {/* Summary Body - Optimized Typography & Full Width Flow */}
          <div
            className={`relative z-10 text-xs sm:text-[14px] md:text-[15px] leading-[1.85] sm:leading-[2.05] font-normal break-words ${
              isRTL ? "font-['Payami_Nastaleeq',serif] text-right" : "font-serif text-left"
            }`}
            style={{ color: "#2A1D13" }}
          >
            {cleanSummary ? (
              isSummaryLong ? (
                isSummaryExpanded ? (
                  <p className="inline">
                    <span>{cleanSummary}</span>{" "}
                    <button
                      type="button"
                      onClick={() => setIsSummaryExpanded(false)}
                      className={`inline font-bold text-[#8C6239] hover:text-[#4A3728] underline decoration-dotted underline-offset-4 hover:underline-offset-2 transition-colors cursor-pointer text-xs sm:text-[14px] md:text-[15px] mr-1.5 ${
                        isRTL ? "font-['Payami_Nastaleeq',serif]" : "font-serif"
                      }`}
                    >
                      {isRTL ? "مختصر کریں" : "Show Less"}
                    </button>
                  </p>
                ) : (
                  <p className="inline">
                    <span>{truncatedBookSummary}</span>
                    <span className="text-[#2A1D13] mx-0.5 tracking-wider select-none font-bold">...</span>{" "}
                    <button
                      type="button"
                      onClick={() => setIsSummaryExpanded(true)}
                      className={`inline font-bold text-[#8C6239] hover:text-[#4A3728] underline decoration-dotted underline-offset-4 hover:underline-offset-2 transition-colors cursor-pointer text-xs sm:text-[14px] md:text-[15px] ${
                        isRTL ? "font-['Payami_Nastaleeq',serif]" : "font-serif"
                      }`}
                    >
                      {isRTL ? "مزید پڑھیں" : "Read More"}
                    </button>
                  </p>
                )
              ) : (
                <span>{cleanSummary}</span>
              )
            ) : isRTL ? (
              "اس کتاب کا کوئی تفصیلی تعارف دستیاب نہیں ہے۔"
            ) : (
              "No summary available for this book."
            )}
          </div>

          {/* Delicate Ornamental Divider at bottom */}
          <div className="relative z-10 flex items-center justify-center pt-2 text-[#9E732E] opacity-70">
            <span className="h-px bg-[#DEC596] flex-1"></span>
            <span className="px-2 text-xs">✦</span>
            <span className="h-px bg-[#DEC596] flex-1"></span>
          </div>
        </div>

        {/* ══════════════════════════════════════════════════════════════
            4. ACTION BUTTONS: Online Reading (1st) & PDF Download (2nd)
               - Online Reading: Light cream / outlined button
               - PDF Download: DARK BROWN (#3A2618) full-width button
        ══════════════════════════════════════════════════════════════ */}
        <div className="space-y-2 sm:space-y-2.5">
          {/* 1st Button: Online Reading (Light Cream / Outlined Premium Button) */}
          <button
            type="button"
            onClick={() => {
              if (pdfUrl) {
                setIsPdfModalOpen(true);
              } else {
                toast.error(
                  isRTL ? "پی ڈی ایف جلد دستیاب ہوگی" : "PDF will be available soon"
                );
              }
            }}
            className="w-full flex items-center justify-center gap-2.5 py-3 sm:py-3.5 px-6 rounded-2xl border-2 transition-all duration-200 cursor-pointer shadow-xs hover:shadow-md hover:bg-[#F3EADB] active:scale-[0.99] font-serif text-sm sm:text-base font-bold"
            style={{
              backgroundColor: "#FAF6EE",
              borderColor: "#C9A96E",
              color: "#4A3728",
            }}
          >
            <BookOpen className="w-5 h-5 text-[#8C6239]" />
            <span>{isRTL ? "آن لائن مطالعہ کریں" : "Read Online"}</span>
            {isRTL ? (
              <ArrowLeft className="w-4 h-4 text-[#8C6239]/70 ms-1" />
            ) : (
              <ArrowRight className="w-4 h-4 text-[#8C6239]/70 ms-1" />
            )}
          </button>

          {/* 2nd Button: PDF Download (DARK BROWN Full-Width Primary Button) */}
          {pdfUrl ? (
            <a
              href={pdfUrl}
              target="_blank"
              rel="noopener noreferrer"
              download
              className="w-full flex items-center justify-center gap-2.5 py-3.5 sm:py-4 px-6 rounded-2xl transition-all duration-200 cursor-pointer shadow-md hover:shadow-lg active:scale-[0.99] font-serif text-sm sm:text-base font-bold text-white hover:opacity-95"
              style={{
                backgroundColor: "#3A2618",
              }}
            >
              <Download className="w-5 h-5 text-[#DFC07C]" />
              <span>{isRTL ? "PDF ڈاؤن لوڈ کریں" : "Download PDF"}</span>
            </a>
          ) : (
            <button
              type="button"
              disabled
              className="w-full flex items-center justify-center gap-2.5 py-3.5 sm:py-4 px-6 rounded-2xl font-serif text-sm sm:text-base font-bold text-white/70 cursor-not-allowed opacity-70"
              style={{
                backgroundColor: "#4A3728",
              }}
            >
              <Download className="w-5 h-5 opacity-60" />
              <span>
                {isRTL ? "پی ڈی ایف جلد دستیاب ہوگی" : "PDF Available Soon"}
              </span>
            </button>
          )}
        </div>

        {/* ══════════════════════════════════════════════════════════════
            5. COMMENTS / REVIEWS ACCORDION (Directly Below PDF Download)
        ══════════════════════════════════════════════════════════════ */}
        <div
          className="rounded-2xl border transition-all duration-300 shadow-xs overflow-hidden"
          style={{
            backgroundColor: "#FAF6EE",
            borderColor: isCommentsOpen
              ? "rgba(168, 121, 62, 0.45)"
              : "rgba(223, 192, 124, 0.4)",
          }}
        >
          <button
            type="button"
            onClick={() => setIsCommentsOpen((v) => !v)}
            className="w-full flex items-center justify-between gap-3 p-3 sm:p-3.5 cursor-pointer hover:bg-[#F5EFE0] transition-colors"
          >
            <div className="flex items-center gap-2.5 sm:gap-3">
              <div
                className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl flex items-center justify-center shadow-xs shrink-0"
                style={{
                  backgroundColor: "#ECE1D0",
                  color: "#4A3728",
                }}
              >
                <MessageSquare className="w-4 h-4 text-[#8C6239]" />
              </div>
              <div className="text-right">
                <span
                  className="text-xs sm:text-sm font-bold block font-serif leading-snug"
                  style={{ color: "#2B1E16" }}
                >
                  {isRTL ? "تبصرے و آراء" : "Comments & Reviews"}
                </span>
                <span
                  className="text-[10px] sm:text-[11px] block font-serif"
                  style={{ color: COLORS.textSecondary }}
                >
                  {isRTL
                    ? isCommentsOpen
                      ? "تبصرے بند کریں"
                      : "اپنے خیالات کا اظہار کریں"
                    : isCommentsOpen
                      ? "Close comments"
                      : "Share your thoughts"}
                </span>
              </div>
            </div>
            <ChevronDown
              className={`w-4 h-4 text-slate-500 transition-transform duration-300 shrink-0 ${
                isCommentsOpen ? "rotate-180" : ""
              }`}
            />
          </button>

          {isCommentsOpen && (
            <div
              className="p-3 sm:p-4 border-t"
              style={{
                backgroundColor: COLORS.white,
                borderColor: `${COLORS.border}70`,
              }}
            >
              <CommentsSection
                contentType="book"
                contentId={_id}
                language={language}
              />
            </div>
          )}
        </div>


        {/* ══════════════════════════════════════════════════════════════
            7. RELATED BOOKS SECTION
        ══════════════════════════════════════════════════════════════ */}
        {relatedBooks?.length > 0 && (
          <div
            className="mt-4 sm:mt-5 pt-3 sm:pt-4 border-t"
            style={{ borderColor: `${COLORS.border}70` }}
          >
            <div className="flex items-center justify-between mb-3 sm:mb-4">
              <div>
                <span
                  className="text-[10px] sm:text-xs font-bold uppercase tracking-widest block mb-0.5"
                  style={{ color: COLORS.accent }}
                >
                  {isRTL ? "متعلقہ کتب" : "EXPLORE MORE"}
                </span>
                <h2
                  className="text-lg sm:text-xl font-bold font-serif"
                  style={{ color: COLORS.primary }}
                >
                  {isRTL ? "مزید مفید علمی و اصلاحی کتب" : "Related Publications"}
                </h2>
              </div>
              <Link
                to="/publications"
                className="text-xs sm:text-sm font-bold hover:underline font-serif"
                style={{ color: COLORS.accent }}
              >
                {isRTL ? "سب دیکھیں ←" : "View All →"}
              </Link>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
              {relatedBooks.map((relBook) => {
                const relCoverSrc = getCoverImageSrc(
                  relBook.coverImage,
                  relBook.category
                );
                return (
                  <Link
                    key={relBook._id}
                    to={`/publications/slug/${relBook.slug || relBook._id}`}
                    className="p-3.5 sm:p-4 rounded-2xl border shadow-2xs hover:shadow-md transition-all duration-300 flex flex-col justify-between group"
                    style={{
                      backgroundColor: "#FAF6EE",
                      borderColor: "rgba(223, 192, 124, 0.4)",
                    }}
                  >
                    <div className="flex items-center gap-3 mb-2.5">
                      <div
                        className="w-13 h-16 sm:w-15 sm:h-18 rounded-xl overflow-hidden shrink-0 flex items-center justify-center p-0.5"
                        style={{
                          background:
                            "radial-gradient(ellipse at 50% 25%, #FFFDF9 0%, #FAF3E6 50%, #EFE1CC 100%)",
                          border: "1px solid #C8A46A",
                          boxShadow:
                            "0 0 0 1.5px #FAF4EA, 0 0 0 2.5px rgba(200, 164, 106, 0.45), 0 4px 12px rgba(43, 33, 24, 0.08)",
                        }}
                      >
                        {relCoverSrc ? (
                          <img
                            src={relCoverSrc}
                            alt={relBook.title}
                            className="w-full h-full object-cover rounded-lg"
                            onError={(e) => {
                              const isGreen =
                                relBook.category === "Quran" ||
                                relBook.category === "Hadith" ||
                                relBook.category === "قرآن و تفاسیر" ||
                                relBook.category === "حدیث";
                              e.currentTarget.src = isGreen
                                ? "/assets/images/books/islamic-book-cover-green.jpg"
                                : "/assets/images/books/islamic-book-cover.jpg";
                            }}
                          />
                        ) : (
                          <BookOpen className="w-6 h-6 text-white/80" />
                        )}
                      </div>
                      <div className="flex-1 min-w-0 py-0.5 space-y-0.5">
                        <div>
                          <span
                            className="text-[9px] sm:text-[10px] font-bold px-2 py-0.5 rounded-full inline-block shadow-2xs leading-normal font-serif"
                            style={{
                              backgroundColor: "#F3EADB",
                              color: "#4A3728",
                            }}
                          >
                            {PUBLICATION_CATEGORY_TRANSLATIONS[
                              relBook.category
                            ] || relBook.category}
                          </span>
                        </div>
                        <h4
                          className="font-bold text-sm font-serif leading-[2.1] group-hover:text-accent transition-colors block truncate"
                          style={{ color: COLORS.primary }}
                        >
                          {relBook.title}
                        </h4>
                        {relBook.author && (
                          <span
                            className="text-xs block leading-tight text-slate-500 font-medium font-serif truncate"
                          >
                            {relBook.author}
                          </span>
                        )}
                      </div>
                    </div>

                    <div
                      className="pt-2 mt-1 border-t flex items-center justify-between text-xs font-bold font-serif"
                      style={{
                        borderColor: `${COLORS.border}50`,
                        color: COLORS.accent,
                      }}
                    >
                      <span>{isRTL ? "تفصیلات دیکھیں" : "View Details"}</span>
                      <span>{isRTL ? "←" : "→"}</span>
                    </div>
                  </Link>
                );
              })}
            </div>
          </div>
        )}
      </div>

      {/* Fullscreen PDF Viewer Modal */}
      {isPdfModalOpen && pdfUrl && (
        <PdfViewer
          url={pdfUrl}
          title={title}
          isModal={true}
          onClose={() => setIsPdfModalOpen(false)}
        />
      )}
    </div>
  );
}
