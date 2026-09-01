import React, { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import {
  BookOpen,
  Download,
  ExternalLink,
  User,
  ArrowRight,
  ArrowLeft,
  Globe,
  Layers,
  Printer,
  Sparkles,
  Maximize2,
  Minimize2,
  ChevronDown,
  ChevronUp,
  MessageSquare,
} from "lucide-react";
import { getPublicationBySlug, getPublications } from "@/services";
import { useSettings } from "@/hooks/useSettings";
import { COLORS } from "@/utils/themeColors";
import { BACKEND_URL } from "@/constants/urls";
import {
  PUBLICATION_CATEGORY_TRANSLATIONS,
  BOOK_LANGUAGE_TRANSLATIONS,
} from "@/utils/categories";
import { PdfViewer } from "@/components";
import CommentsSection from "@/components/CommentsSection";

import toast from "react-hot-toast";

export default function BookDetail() {
  const { id, slug } = useParams();
  const rawParam = slug || id;
  const navigate = useNavigate();
  const { settings } = useSettings();
  const language =
    settings?.language === "ur" || settings?.language === "Urdu" ? "ur" : "en";
  const isRTL = language === "ur";

  const [book, setBook] = useState(null);
  const [relatedBooks, setRelatedBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isPdfModalOpen, setIsPdfModalOpen] = useState(false);
  const [showEmbeddedPdf, setShowEmbeddedPdf] = useState(false);
  const [copied, setCopied] = useState(false);
  const [isSummaryExpanded, setIsSummaryExpanded] = useState(false);
  const [isCommentsOpen, setIsCommentsOpen] = useState(false);

  const getCoverImageSrc = (img) => {
    if (!img) return null;
    const url = typeof img === "object" ? img.url : img;
    if (!url) return null;
    if (url.startsWith("/")) return `${BACKEND_URL}${url}`;
    return url;
  };

  useEffect(() => {
    const loadBookData = async () => {
      try {
        setLoading(true);
        setError(null);
        window.scrollTo({ top: 0, behavior: "smooth" });

        let activeSlug = rawParam;

        // If parameter is a 24-character ObjectID hex representation, resolve to slug
        if (rawParam && /^[0-9a-fA-F]{24}$/.test(rawParam)) {
          const res = await getPublications({ limit: 1000 });
          const matched = res.books?.find((b) => b._id === rawParam);
          if (matched && matched.slug) {
            activeSlug = matched.slug;
          }
        }

        const data = await getPublicationBySlug(activeSlug);
        const bookData = data.book || data;
        setBook(bookData);

        // Fetch other books for related section
        try {
          const allRes = await getPublications({
            category: bookData.category,
            limit: 4,
          });
          const otherBooks = (allRes.books || []).filter(
            (b) => b._id !== bookData._id
          );
          setRelatedBooks(otherBooks.slice(0, 3));
        } catch (rErr) {
          console.warn("Failed to load related books", rErr);
        }
      } catch (err) {
        setError(
          err.response?.data?.message ||
            err.message ||
            (isRTL ? "کتاب لوڈ کرنے میں ناکامی" : "Failed to load book")
        );
      } finally {
        setLoading(false);
      }
    };

    if (rawParam) {
      loadBookData();
    }
  }, [rawParam, isRTL]);

  const shareUrl = window.location.href;

  const handleShareClick = (platform) => {
    let url = "";
    switch (platform) {
      case "facebook":
        url = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`;
        break;
      case "twitter":
        url = `https://twitter.com/intent/tweet?url=${encodeURIComponent(shareUrl)}&text=${encodeURIComponent(book?.title || "")}`;
        break;
      case "whatsapp":
        url = `https://api.whatsapp.com/send?text=${encodeURIComponent((book?.title || "") + " - " + shareUrl)}`;
        break;
      default:
        break;
    }
    if (url) {
      window.open(url, "_blank", "width=600,height=400");
    }
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(shareUrl);
    setCopied(true);
    toast.success(isRTL ? "لنک کاپی ہو گیا ہے!" : "Link copied to clipboard!");
    setTimeout(() => setCopied(false), 2000);
  };

  const handlePrint = () => {
    window.print();
  };

  if (loading) {
    return (
      <div
        className="min-h-screen flex flex-col items-center justify-center gap-4"
        style={{ backgroundColor: COLORS.background }}
      >
        <div
          className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2"
          style={{ borderColor: COLORS.primary }}
        />
        <span
          className="text-sm font-medium"
          style={{ color: COLORS.textSecondary }}
        >
          {isRTL
            ? "کتاب کی تفصیلات لوڈ ہو رہی ہیں..."
            : "Loading book details..."}
        </span>
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
    references = [],
    viewCount = 0,
  } = book;

  const pdfUrl = pdf?.url || (typeof pdf === "string" ? pdf : null);
  const coverImageSrc = getCoverImageSrc(coverImage);
  const categoryLabel =
    PUBLICATION_CATEGORY_TRANSLATIONS[category] ||
    category ||
    (isRTL ? "کتب و رسائل" : "Books");
  const languageLabel =
    BOOK_LANGUAGE_TRANSLATIONS[blanguage] ||
    blanguage ||
    (isRTL ? "اردو" : "Urdu");

  const formattedDate = publishDate
    ? new Date(publishDate).toLocaleDateString(isRTL ? "ur-PK" : "en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      })
    : "";

  return (
    <div
      dir={isRTL ? "rtl" : "ltr"}
      className="min-h-screen py-2 md:py-10"
      style={{ backgroundColor: COLORS.background }}
    >
      <div className="w-full max-w-[1440px] mx-auto px-1 sm:px-6 lg:px-8">
        {/* Breadcrumbs & Navigation Bar */}
        <div
          className="flex items-center justify-between gap-2 mb-2 sm:mb-6 flex-wrap pb-2 sm:pb-4 border-b"
          style={{ borderColor: `${COLORS.border}80` }}
        >
          <nav className="flex items-center gap-2 text-xs md:text-sm flex-wrap font-medium">
            <Link
              to="/"
              className="hover:underline transition-colors"
              style={{ color: COLORS.textSecondary }}
            >
              {isRTL ? "صفحہ اول" : "Home"}
            </Link>
            <span style={{ color: COLORS.border }}>/</span>
            <Link
              to="/publications"
              className="hover:underline transition-colors"
              style={{ color: COLORS.textSecondary }}
            >
              {isRTL ? "کتب و مطبوعات" : "Publications"}
            </Link>
            <span style={{ color: COLORS.border }}>/</span>
            <Link
              to={`/publications?category=${encodeURIComponent(category || "")}`}
              className="hover:underline transition-colors font-semibold"
              style={{ color: COLORS.accent }}
            >
              {categoryLabel}
            </Link>
            <span style={{ color: COLORS.border }}>/</span>
            <span
              className="font-bold truncate max-w-xs sm:max-w-md"
              style={{ color: COLORS.primary }}
            >
              {title}
            </span>
          </nav>

          <Link
            to="/publications"
            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-bold border transition-colors hover:bg-white shadow-xs"
            style={{
              borderColor: COLORS.border,
              backgroundColor: "rgba(255,255,255,0.7)",
              color: COLORS.primary,
            }}
          >
            {isRTL ? (
              <>
                <ArrowRight className="w-3.5 h-3.5" />
                <span>تمام کتب</span>
              </>
            ) : (
              <>
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>All Books</span>
              </>
            )}
          </Link>
        </div>

        {/* ══════════════════════════════════════════════════════════════
            FULL PAGE 2-COLUMN LAYOUT
        ══════════════════════════════════════════════════════════════ */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-2 sm:gap-8 items-start mb-4 sm:mb-12">
          {/* ══════════════════════════════════════════════════════════════
              RIGHT COLUMN (in RTL): Sticky Book Presentation & Metadata Card
          ══════════════════════════════════════════════════════════════ */}
          <div className="lg:col-span-4 lg:sticky lg:top-24 space-y-6">
            <div
              className="rounded-2xl border shadow-md p-2 sm:p-7 transition-all flex flex-col items-center"
              style={{
                backgroundColor: COLORS.white,
                borderColor: COLORS.border,
              }}
            >
              {/* High-Resolution Book Cover Frame */}
              <div
                className="relative w-full max-w-[280px] aspect-[3/4] rounded-2xl overflow-hidden shadow-2xl border p-3 flex items-center justify-center select-none group"
                style={{
                  backgroundColor: COLORS.primary,
                  borderColor: `${COLORS.accent}60`,
                }}
              >
                {coverImageSrc ? (
                  <div className="relative w-full h-full rounded-xl overflow-hidden shadow-inner border border-white/20">
                    <img
                      src={coverImageSrc}
                      alt={title}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                      onError={(e) => {
                        e.currentTarget.style.display = "none";
                      }}
                    />
                  </div>
                ) : (
                  <div
                    className="relative w-full h-full rounded-xl shadow-inner border flex items-center justify-center p-4 text-center"
                    style={{
                      backgroundColor: COLORS.background || "#FAF6F0",
                      borderColor: COLORS.border,
                    }}
                  >
                    <div className="space-y-3">
                      <BookOpen
                        className="w-16 h-16 mx-auto opacity-70"
                        style={{ color: COLORS.primary }}
                      />
                      <span
                        className="font-bold text-lg block line-clamp-2 font-serif"
                        style={{ color: COLORS.primary }}
                      >
                        {title}
                      </span>
                      <span
                        className="text-xs font-semibold block"
                        style={{ color: COLORS.accent }}
                      >
                        {author}
                      </span>
                    </div>
                  </div>
                )}
              </div>

              <div
                className="w-full mt-6 space-y-2.5 pt-5 border-t text-xs hidden lg:block"
                style={{ borderColor: `${COLORS.border}70` }}
              >
                <div
                  className="flex items-center justify-between py-1.5 border-b border-dashed"
                  style={{ borderColor: `${COLORS.border}50` }}
                >
                  <span style={{ color: COLORS.textSecondary }}>
                    {isRTL ? "مصنف" : "Author"}
                  </span>
                  <span
                    className="font-bold text-right"
                    style={{ color: COLORS.primary }}
                  >
                    {author}
                  </span>
                </div>

                <div
                  className="flex items-center justify-between py-1.5 border-b border-dashed"
                  style={{ borderColor: `${COLORS.border}50` }}
                >
                  <span style={{ color: COLORS.textSecondary }}>
                    {isRTL ? "شعبہ / زمرہ" : "Category"}
                  </span>
                  <span className="font-bold" style={{ color: COLORS.primary }}>
                    {categoryLabel}
                  </span>
                </div>

                {formattedDate && (
                  <div
                    className="flex items-center justify-between py-1.5 border-b border-dashed"
                    style={{ borderColor: `${COLORS.border}50` }}
                  >
                    <span style={{ color: COLORS.textSecondary }}>
                      {isRTL ? "اشاعت" : "Published"}
                    </span>
                    <span
                      className="font-bold"
                      style={{ color: COLORS.primary }}
                    >
                      {formattedDate}
                    </span>
                  </div>
                )}

                {viewCount > 0 && (
                  <div className="flex items-center justify-between py-1.5">
                    <span style={{ color: COLORS.textSecondary }}>
                      {isRTL ? "مناظر" : "Views"}
                    </span>
                    <span
                      className="font-bold"
                      style={{ color: COLORS.primary }}
                    >
                      {viewCount}
                    </span>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* ══════════════════════════════════════════════════════════════
              LEFT / MAIN COLUMN (in RTL): Full Content, Overview, Embedded PDF, Comments
          ══════════════════════════════════════════════════════════════ */}
          <div className="lg:col-span-8 space-y-2 sm:space-y-8">
            {/* Main Header & Overview Card */}
            <div
              className="rounded-2xl border shadow-sm p-2 sm:p-8 md:p-10 space-y-3 sm:space-y-6"
              style={{
                backgroundColor: COLORS.white,
                borderColor: COLORS.border,
              }}
            >
              {/* Badges */}
              <div className="flex flex-wrap items-center gap-2.5">
                <span
                  className="px-3.5 py-1 rounded-full text-xs font-bold shadow-xs"
                  style={{
                    backgroundColor: COLORS.secondary,
                    color: COLORS.primary,
                  }}
                >
                  {categoryLabel}
                </span>
                <span
                  className="px-3 py-1 rounded-full text-xs font-semibold border"
                  style={{
                    borderColor: COLORS.border,
                    color: COLORS.textSecondary,
                    backgroundColor: `${COLORS.background}80`,
                  }}
                >
                  <Globe className="w-3 h-3 inline-block me-1 -mt-0.5" />
                  {languageLabel}
                </span>
              </div>

              {/* Title */}
              <h1
                className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold leading-[1.85] break-words"
                style={{ color: COLORS.primary }}
              >
                {title}
              </h1>

              {/* Author Row */}
              {author && (
                <div
                  className="flex items-center gap-2 p-2 sm:p-4 rounded-xl sm:rounded-2xl border"
                  style={{
                    backgroundColor: `${COLORS.background}60`,
                    borderColor: `${COLORS.border}80`,
                  }}
                >
                  <div
                    className="w-8 h-8 sm:w-11 sm:h-11 rounded-full flex items-center justify-center shrink-0 shadow-xs"
                    style={{
                      backgroundColor: COLORS.primary,
                      color: COLORS.accent,
                    }}
                  >
                    <User className="w-5 h-5" />
                  </div>
                  <div>
                    <span
                      className="text-[11px] block font-medium"
                      style={{ color: COLORS.textSecondary }}
                    >
                      {isRTL ? "مصنف / تالیف" : "Author / Compiler"}
                    </span>
                    <span
                      className="text-sm sm:text-base font-bold"
                      style={{ color: COLORS.textPrimary }}
                    >
                      {author}
                    </span>
                  </div>
                </div>
              )}

              {/* Full Description / Overview */}
              <div className="space-y-3 pt-2">
                <h3
                  className="text-sm sm:text-lg font-bold flex items-center gap-2"
                  style={{ color: COLORS.primary }}
                >
                  <Sparkles className="w-4 h-4 text-accent" />
                  <span>
                    {isRTL
                      ? "کتاب کا تعارف و خلاصہ"
                      : "Book Overview & Synopsis"}
                  </span>
                </h3>
                <div
                  className="p-4 sm:p-6 rounded-2xl border text-sm sm:text-base leading-[2.2] whitespace-pre-line font-normal break-words"
                  style={{
                    backgroundColor: `${COLORS.background}50`,
                    borderColor: `${COLORS.border}70`,
                    color: COLORS.textPrimary,
                  }}
                >
                  {summary ? (
                    summary.length > 400 ? (
                      <>
                        {/* Desktop View: Full Summary */}
                        <div className="hidden lg:block">{summary}</div>

                        {/* Mobile View: Truncated or Expanded */}
                        <div className="block lg:hidden">
                          {isSummaryExpanded
                            ? summary
                            : `${summary.slice(0, 400)}...`}

                          <div className="pt-2">
                            <button
                              type="button"
                              onClick={() =>
                                setIsSummaryExpanded(!isSummaryExpanded)
                              }
                              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all shadow-xs border"
                              style={{
                                backgroundColor: COLORS.white,
                                borderColor: COLORS.accent,
                                color: COLORS.primary,
                              }}
                            >
                              {isSummaryExpanded ? (
                                <>
                                  <ChevronUp
                                    className="w-3.5 h-3.5"
                                    style={{ color: COLORS.accent }}
                                  />
                                  <span>
                                    {isRTL ? "مختصر کریں" : "Show Less"}
                                  </span>
                                </>
                              ) : (
                                <>
                                  <ChevronDown
                                    className="w-3.5 h-3.5"
                                    style={{ color: COLORS.accent }}
                                  />
                                  <span>
                                    {isRTL ? "مزید پڑھیں" : "Read More"}
                                  </span>
                                </>
                              )}
                            </button>
                          </div>
                        </div>
                      </>
                    ) : (
                      summary
                    )
                  ) : isRTL ? (
                    "اس کتاب کا کوئی تفصیلی تعارف دستیاب نہیں ہے۔"
                  ) : (
                    "No summary available for this book."
                  )}
                </div>
              </div>

              {/* ── Instagram-Style Comments Toggle ── */}
              <div
                className="pt-4 mt-2 border-t"
                style={{ borderColor: `${COLORS.border}70` }}
              >
                <button
                  type="button"
                  onClick={() => setIsCommentsOpen((v) => !v)}
                  className="w-full flex items-center justify-between gap-3 px-4 py-3 rounded-2xl border transition-all hover:shadow-sm group cursor-pointer"
                  style={{
                    backgroundColor: isCommentsOpen
                      ? `${COLORS.primary}08`
                      : `${COLORS.background}60`,
                    borderColor: isCommentsOpen
                      ? `${COLORS.primary}40`
                      : COLORS.border,
                  }}
                >
                  <div className="flex items-center gap-3">
                    <div
                      className="w-9 h-9 rounded-xl flex items-center justify-center shadow-xs transition-all"
                      style={{
                        backgroundColor: isCommentsOpen
                          ? COLORS.primary
                          : `${COLORS.primary}15`,
                        color: isCommentsOpen ? COLORS.accent : COLORS.primary,
                      }}
                    >
                      <MessageSquare className="w-4 h-4" />
                    </div>
                    <div className="text-right">
                      <span
                        className="text-xs sm:text-sm font-bold block font-serif leading-snug"
                        style={{ color: COLORS.primary }}
                      >
                        {isRTL ? "تبصرے و آراء" : "Comments"}
                      </span>
                      <span
                        className="text-[10px] sm:text-[11px]"
                        style={{ color: COLORS.textSecondary }}
                      >
                        {isRTL
                          ? isCommentsOpen
                            ? "تبصرے بند کریں"
                            : "تبصرے دیکھیں اور لکھیں"
                          : isCommentsOpen
                            ? "Hide comments"
                            : "View & post comments"}
                      </span>
                    </div>
                  </div>
                  <ChevronDown
                    className={`w-4 h-4 transition-transform duration-300 shrink-0 ${
                      isCommentsOpen ? "rotate-180" : ""
                    }`}
                    style={{ color: COLORS.textSecondary }}
                  />
                </button>

                {/* Expandable Comments Panel */}
                {isCommentsOpen && (
                  <div
                    className="mt-4 rounded-2xl border p-2 sm:p-4"
                    style={{
                      backgroundColor: COLORS.white,
                      borderColor: COLORS.border,
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

              {/* References & Sources if available */}
              {references && references?.length > 0 && (
                <div className="space-y-2 pt-2">
                  <h4
                    className="text-sm font-bold font-serif"
                    style={{ color: COLORS.primary }}
                  >
                    {isRTL ? "مراجع و مصادر" : "References & Sources"}
                  </h4>
                  <ul className="list-disc list-inside space-y-1 text-xs sm:text-sm text-slate-700">
                    {references?.map((ref, idx) => (
                      <li key={idx}>{ref}</li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Mobile-Only Metadata Table (After References & Sources) */}
              <div
                className="w-full mt-4 space-y-2.5 pt-4 border-t text-xs block lg:hidden"
                style={{ borderColor: `${COLORS.border}70` }}
              >
                <div
                  className="flex items-center justify-between py-1.5 border-b border-dashed"
                  style={{ borderColor: `${COLORS.border}50` }}
                >
                  <span style={{ color: COLORS.textSecondary }}>
                    {isRTL ? "مصنف" : "Author"}
                  </span>
                  <span
                    className="font-bold text-right"
                    style={{ color: COLORS.primary }}
                  >
                    {author}
                  </span>
                </div>

                <div
                  className="flex items-center justify-between py-1.5 border-b border-dashed"
                  style={{ borderColor: `${COLORS.border}50` }}
                >
                  <span style={{ color: COLORS.textSecondary }}>
                    {isRTL ? "شعبہ / زمرہ" : "Category"}
                  </span>
                  <span className="font-bold" style={{ color: COLORS.primary }}>
                    {categoryLabel}
                  </span>
                </div>

                {formattedDate && (
                  <div
                    className="flex items-center justify-between py-1.5 border-b border-dashed"
                    style={{ borderColor: `${COLORS.border}50` }}
                  >
                    <span style={{ color: COLORS.textSecondary }}>
                      {isRTL ? "اشاعت" : "Published"}
                    </span>
                    <span
                      className="font-bold"
                      style={{ color: COLORS.primary }}
                    >
                      {formattedDate}
                    </span>
                  </div>
                )}

                {viewCount > 0 && (
                  <div className="flex items-center justify-between py-1.5">
                    <span style={{ color: COLORS.textSecondary }}>
                      {isRTL ? "مناظر" : "Views"}
                    </span>
                    <span
                      className="font-bold"
                      style={{ color: COLORS.primary }}
                    >
                      {viewCount}
                    </span>
                  </div>
                )}
              </div>

              {/* Action Buttons: Read & Download & Quick Actions */}
              <div
                className="pt-6 mt-6 border-t space-y-4"
                style={{ borderColor: `${COLORS.border}70` }}
              >
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  {pdfUrl ? (
                    <>
                      <button
                        type="button"
                        onClick={() => setIsPdfModalOpen(true)}
                        className="inline-flex items-center justify-center gap-2 px-5 py-3 text-sm font-bold text-white rounded-xl shadow-md cursor-pointer hover:opacity-95 hover:shadow-lg transition-all"
                        style={{ backgroundColor: COLORS.primary }}
                      >
                        <ExternalLink
                          className="w-4 h-4"
                          style={{ color: COLORS.accent }}
                        />
                        <span>
                          {isRTL
                            ? "آن لائن مطالعہ کریں"
                            : "Read Online (Modal)"}
                        </span>
                      </button>

                      <button
                        type="button"
                        onClick={() => setShowEmbeddedPdf(!showEmbeddedPdf)}
                        className="inline-flex items-center justify-center gap-2 px-5 py-3 text-sm font-bold rounded-xl border transition-all cursor-pointer hover:bg-slate-50 text-center"
                        style={{
                          borderColor: COLORS.accent,
                          color: COLORS.primary,
                          backgroundColor: showEmbeddedPdf
                            ? `${COLORS.secondary}40`
                            : "transparent",
                        }}
                      >
                        {showEmbeddedPdf ? (
                          <>
                            <Minimize2 className="w-4 h-4 text-accent" />
                            <span>
                              {isRTL
                                ? "صفحہ پر قاری بند کریں"
                                : "Hide In-Page Reader"}
                            </span>
                          </>
                        ) : (
                          <>
                            <Maximize2 className="w-4 h-4 text-accent" />
                            <span>
                              {isRTL
                                ? "صفحہ پر پڑھیں (Full Reader)"
                                : "Read on This Page"}
                            </span>
                          </>
                        )}
                      </button>

                      <a
                        href={pdfUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        download
                        className="inline-flex items-center justify-center gap-2 px-5 py-3 text-sm font-semibold rounded-xl border transition-all cursor-pointer hover:bg-slate-50 text-center"
                        style={{
                          borderColor: COLORS.border,
                          color: COLORS.primary,
                          backgroundColor: "transparent",
                        }}
                      >
                        <Download
                          className="w-4 h-4"
                          style={{ color: COLORS.accent }}
                        />
                        <span>
                          {isRTL ? "پی ڈی ایف ڈاؤن لوڈ کریں" : "Download PDF"}
                        </span>
                      </a>
                    </>
                  ) : (
                    <div
                      className="col-span-full py-3 px-4 rounded-xl border text-center text-xs font-medium"
                      style={{
                        borderColor: COLORS.border,
                        color: COLORS.textSecondary,
                        backgroundColor: `${COLORS.background}80`,
                      }}
                    >
                      {isRTL
                        ? "پی ڈی ایف جلد دستیاب ہوگی"
                        : "PDF will be available soon"}
                    </div>
                  )}
                </div>
              </div>
            </div>

            {showEmbeddedPdf && pdfUrl && (
              <div
                className="rounded-3xl border shadow-lg overflow-hidden p-6 sm:p-8 transition-all space-y-4"
                style={{
                  backgroundColor: COLORS.white,
                  borderColor: COLORS.border,
                }}
              >
                <div
                  className="flex items-center justify-between pb-3 border-b"
                  style={{ borderColor: COLORS.border }}
                >
                  <h3
                    className="text-lg font-bold font-serif"
                    style={{ color: COLORS.primary }}
                  >
                    {isRTL
                      ? "آن لائن مطالعہ (In-Page Reader)"
                      : "Online Reading"}
                  </h3>
                  <button
                    type="button"
                    onClick={() => setIsPdfModalOpen(true)}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold rounded-lg border hover:bg-slate-50 transition-colors"
                    style={{
                      borderColor: COLORS.border,
                      color: COLORS.primary,
                    }}
                  >
                    <Maximize2 className="w-3.5 h-3.5 text-accent" />
                    <span>{isRTL ? "مکمل اسکرین" : "Fullscreen"}</span>
                  </button>
                </div>
                <div
                  className="w-full h-[750px] rounded-2xl overflow-hidden border"
                  style={{ borderColor: COLORS.border }}
                >
                  <PdfViewer url={pdfUrl} title={title} isModal={false} />
                </div>
              </div>
            )}
          </div>
        </div>

        {relatedBooks?.length > 0 && (
          <div
            className="mt-14 pt-8 border-t"
            style={{ borderColor: COLORS.border }}
          >
            <div className="flex items-center justify-between mb-6">
              <div>
                <span
                  className="text-xs font-bold uppercase tracking-widest block mb-0.5"
                  style={{ color: COLORS.accent }}
                >
                  {isRTL ? "متعلقہ کتب" : "EXPLORE MORE"}
                </span>
                <h2
                  className="text-xl sm:text-2xl font-bold font-serif"
                  style={{ color: COLORS.primary }}
                >
                  {isRTL
                    ? "مزید مفید علمی و اصلاحی کتب"
                    : "Related Publications"}
                </h2>
              </div>
              <Link
                to="/publications"
                className="text-xs sm:text-sm font-bold hover:underline"
                style={{ color: COLORS.accent }}
              >
                {isRTL ? "سب دیکھیں ←" : "View All →"}
              </Link>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {relatedBooks.map((relBook) => {
                const relCoverSrc = getCoverImageSrc(relBook.coverImage);
                return (
                  <Link
                    key={relBook._id}
                    to={`/publications/slug/${relBook.slug || relBook._id}`}
                    className="p-4 sm:p-5 rounded-2xl border shadow-xs hover:shadow-md transition-all duration-300 flex flex-col justify-between group overflow-visible"
                    style={{
                      backgroundColor: COLORS.white,
                      borderColor: COLORS.border,
                    }}
                  >
                    <div className="flex items-center gap-3.5 sm:gap-4 mb-3">
                      <div
                        className="w-14 h-18 sm:w-16 sm:h-20 rounded-xl overflow-hidden shrink-0 shadow-xs border flex items-center justify-center p-1"
                        style={{
                          backgroundColor: COLORS.primary,
                          borderColor: `${COLORS.accent}40`,
                        }}
                      >
                        {relCoverSrc ? (
                          <img
                            src={relCoverSrc}
                            alt={relBook.title}
                            className="w-full h-full object-cover rounded-lg"
                          />
                        ) : (
                          <BookOpen className="w-6 h-6 text-white/80" />
                        )}
                      </div>
                      <div className="flex-1 min-w-0 py-0.5 space-y-1">
                        <div>
                          <span
                            className="text-[10px] sm:text-[11px] font-bold px-2.5 py-1 rounded-full inline-block shadow-2xs leading-normal"
                            style={{
                              backgroundColor: COLORS.secondary,
                              color: COLORS.primary,
                            }}
                          >
                            {PUBLICATION_CATEGORY_TRANSLATIONS[
                              relBook.category
                            ] || relBook.category}
                          </span>
                        </div>
                        <h4
                          className="font-bold text-sm sm:text-base font-serif leading-[2.2] group-hover:text-accent transition-colors block"
                          style={{ color: COLORS.primary }}
                        >
                          {relBook.title}
                        </h4>
                        {relBook.author && (
                          <span
                            className="text-xs sm:text-[13px] block leading-[2] text-slate-600 font-medium"
                            style={{ color: COLORS.textSecondary }}
                          >
                            {relBook.author}
                          </span>
                        )}
                      </div>
                    </div>

                    <div
                      className="pt-3 mt-2 border-t flex items-center justify-between text-xs sm:text-sm font-bold"
                      style={{
                        borderColor: `${COLORS.border}60`,
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
