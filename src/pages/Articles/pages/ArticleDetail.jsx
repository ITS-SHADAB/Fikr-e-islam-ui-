import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import {
  FileText,
  Download,
  Calendar,
  User,
  Eye,
  Share2,
  ArrowRight,
  ArrowLeft,
  Copy,
  Check,
  Clock,
  Printer,
  Tag,
  ChevronDown,
  MessageSquare,
  ExternalLink,
  Maximize2,
  Minimize2,
} from "lucide-react";
import { getArticleBySlug, getArticles } from "@/services";
import { useSettings } from "@/hooks/useSettings";
import { COLORS } from "@/utils/themeColors";
import { BACKEND_URL } from "@/constants/urls";
import { ARTICLE_CATEGORY_TRANSLATIONS } from "@/utils/categories";
import { PdfViewer } from "@/components";
import CommentsSection from "@/components/CommentsSection";
import toast from "react-hot-toast";

const getReadingTime = (text = "") => {
  const words = text?.trim()?.split(/\s+/)?.length || 0;
  return Math.max(1, Math.ceil(words / 150));
};

export default function ArticleDetail() {
  const { slug, id } = useParams();
  const rawParam = slug || id;
  const { settings } = useSettings();
  const language =
    settings?.language === "ur" || settings?.language === "Urdu" ? "ur" : "en";
  const isRTL = language === "ur";

  const [article, setArticle] = useState(null);
  const [relatedArticles, setRelatedArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isPdfModalOpen, setIsPdfModalOpen] = useState(false);
  const [showEmbeddedPdf, setShowEmbeddedPdf] = useState(false);
  const [copied, setCopied] = useState(false);
  const [isCommentsOpen, setIsCommentsOpen] = useState(false);
  const [heroImgError, setHeroImgError] = useState(false);

  const getImageSrc = (img) => {
    if (!img) return null;
    const url = typeof img === "object" ? img?.url : img;
    if (!url) return null;
    if (url?.startsWith("/")) return `${BACKEND_URL}${url}`;
    return url;
  };

  useEffect(() => {
    const loadArticle = async () => {
      try {
        setLoading(true);
        setError(null);
        setHeroImgError(false);
        window.scrollTo({ top: 0, behavior: "smooth" });

        let activeSlug = rawParam;
        if (rawParam && /^[0-9a-fA-F]{24}$/.test(rawParam)) {
          const res = await getArticles({ limit: 1000 });
          const matched = res?.articles?.find((a) => a?._id === rawParam);
          if (matched?.slug) activeSlug = matched.slug;
        }

        const data = await getArticleBySlug(activeSlug);
        const articleData = data?.article || data;
        setArticle(articleData);

        if (data?.related?.length > 0) {
          setRelatedArticles(data.related);
        } else if (articleData?.category) {
          try {
            const allRes = await getArticles({ category: articleData?.category, limit: 4 });
            const others = (allRes?.articles || [])?.filter(
              (a) => a?._id !== articleData?._id
            );
            setRelatedArticles(others?.slice(0, 3) || []);
          } catch {}
        }
      } catch (err) {
        setError(
          err?.response?.data?.message ||
            err?.message ||
            (isRTL ? "مضمون لوڈ کرنے میں ناکامی" : "Failed to load article")
        );
      } finally {
        setLoading(false);
      }
    };
    if (rawParam) loadArticle();
  }, [rawParam, isRTL]);

  const shareUrl = typeof window !== "undefined" ? window?.location?.href : "";

  const handleShare = (platform) => {
    const urls = {
      whatsapp: `https://api.whatsapp.com/send?text=${encodeURIComponent((article?.title || "") + " - " + shareUrl)}`,
      twitter: `https://twitter.com/intent/tweet?url=${encodeURIComponent(shareUrl)}&text=${encodeURIComponent(article?.title || "")}`,
    };
    if (urls[platform]) window.open(urls[platform], "_blank", "width=600,height=400");
  };

  const copyLink = () => {
    navigator?.clipboard?.writeText(shareUrl);
    setCopied(true);
    toast.success(isRTL ? "لنک کاپی ہو گیا!" : "Link copied!");
    setTimeout(() => setCopied(false), 2000);
  };

  /* ── Loading State ── */
  if (loading) {
    return (
      <div className="min-h-screen" style={{ backgroundColor: COLORS?.background }}>
        {/* Hero skeleton */}
        <div className="w-full h-72 sm:h-96 animate-pulse" style={{ backgroundColor: COLORS?.secondary }} />
        <div className="max-w-3xl mx-auto px-4 py-10 space-y-4">
          {[80, 60, 100, 100, 70].map((w, i) => (
            <div key={i} className="h-4 rounded animate-pulse" style={{ width: `${w}%`, backgroundColor: COLORS?.border }} />
          ))}
        </div>
      </div>
    );
  }

  /* ── Error State ── */
  if (error || !article) {
    return (
      <div
        className="min-h-screen flex flex-col items-center justify-center p-6 text-center"
        style={{ backgroundColor: COLORS?.background }}
        dir={isRTL ? "rtl" : "ltr"}
      >
        <FileText className="w-16 h-16 mb-4 opacity-30" style={{ color: COLORS?.primary }} />
        <h2 className="text-2xl font-bold font-serif mb-2" style={{ color: COLORS?.textPrimary }}>
          {isRTL ? "مضمون دستیاب نہیں" : "Article Not Found"}
        </h2>
        <p className="text-sm max-w-md mb-6" style={{ color: COLORS?.textSecondary }}>
          {error || (isRTL ? "مطلوبہ مضمون موجود نہیں یا ہٹا دیا گیا ہے۔" : "The article was not found or removed.")}
        </p>
        <Link
          to="/articles"
          className="px-6 py-2.5 rounded-xl font-bold text-white text-sm"
          style={{ backgroundColor: COLORS?.primary }}
        >
          {isRTL ? "تمام مقالات" : "All Articles"}
        </Link>
      </div>
    );
  }

  const pdfUrl = article?.pdf?.url || (typeof article?.pdf === "string" ? article?.pdf : null);
  const featuredImageSrc = getImageSrc(article?.featuredImage);
  const showHeroImage = featuredImageSrc && !heroImgError;
  const categoryLabel =
    ARTICLE_CATEGORY_TRANSLATIONS[article?.category] || article?.category || (isRTL ? "اسلامی مقالات" : "Islamic Articles");
  const formattedDate = article?.publishDate
    ? new Date(article?.publishDate).toLocaleDateString(isRTL ? "ur-PK" : "en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      })
    : "";
  const readingTime = getReadingTime(article?.summary || "");

  return (
    <div dir={isRTL ? "rtl" : "ltr"} style={{ backgroundColor: COLORS?.background }}>

      {/* ══════════════════════════════════════════════════════════════
          HERO SECTION — Full-width banner with overlay or solid color
      ══════════════════════════════════════════════════════════════ */}
      <div
        className="relative w-full overflow-hidden"
        style={{
          minHeight: showHeroImage ? "380px" : "220px",
          backgroundColor: COLORS?.primary,
        }}
      >
        {showHeroImage && (
          <img
            src={featuredImageSrc}
            alt={article?.title || ""}
            className="absolute inset-0 w-full h-full object-cover"
            onError={() => setHeroImgError(true)}
          />
        )}
        {/* Dark gradient overlay */}
        <div
          className="absolute inset-0"
          style={{
            background: showHeroImage
              ? "linear-gradient(to top, rgba(30,15,5,0.92) 0%, rgba(30,15,5,0.55) 50%, rgba(30,15,5,0.2) 100%)"
              : `linear-gradient(135deg, ${COLORS?.primary} 0%, #2d1f15 100%)`,
          }}
        />

        {/* ── Breadcrumb (top) ── */}
        <div className="relative z-10 px-4 sm:px-8 pt-5">
          <nav className="flex items-center gap-1.5 text-xs font-medium flex-wrap" style={{ color: "rgba(255,255,255,0.65)" }}>
            <Link to="/" className="hover:text-white transition-colors">{isRTL ? "صفحہ اول" : "Home"}</Link>
            <span>/</span>
            <Link to="/articles" className="hover:text-white transition-colors">{isRTL ? "مقالات" : "Articles"}</Link>
            <span>/</span>
            <span className="text-white font-semibold truncate max-w-xs">{categoryLabel}</span>
          </nav>
        </div>

        {/* ── Hero Content ── */}
        <div className="relative z-10 px-4 sm:px-8 pb-10 pt-6 max-w-4xl">
          {/* Category pill */}
          <span
            className="inline-block text-[10px] font-bold uppercase tracking-wider px-3 py-1 rounded-full mb-4"
            style={{ backgroundColor: COLORS?.accent, color: "#fff" }}
          >
            {categoryLabel}
          </span>

          {/* Title */}
          <h1
            className="text-xl sm:text-2xl font-bold font-serif leading-[1.7] mb-3"
            style={{ color: "#ffffff" }}
          >
            {article?.title}
          </h1>

          {/* Article Meta Row */}
          <div className="flex flex-wrap items-center gap-3 sm:gap-5 text-xs font-medium" style={{ color: "rgba(255,255,255,0.75)" }}>
            {/* Author */}
            <div className="flex items-center gap-1.5">
              <div
                className="w-7 h-7 rounded-full flex items-center justify-center"
                style={{ backgroundColor: "rgba(255,255,255,0.15)" }}
              >
                <User className="w-3.5 h-3.5 text-white" />
              </div>
              <span>{article?.author || "مفتی فیضان سرور مصباحی"}</span>
            </div>

            {formattedDate && (
              <span className="flex items-center gap-1">
                <Calendar className="w-3.5 h-3.5" />
                {formattedDate}
              </span>
            )}
            <span className="flex items-center gap-1">
              <Clock className="w-3.5 h-3.5" />
              {readingTime} {isRTL ? "دقیقہ مطالعہ" : "min read"}
            </span>
            {(article?.viewCount || 0) > 0 && (
              <span className="flex items-center gap-1">
                <Eye className="w-3.5 h-3.5" />
                {article?.viewCount} {isRTL ? "مناظر" : "views"}
              </span>
            )}
          </div>
        </div>
      </div>

      {/* ══════════════════════════════════════════════════════════════
          ARTICLE BODY — max-width readable column
      ══════════════════════════════════════════════════════════════ */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8 sm:py-12">

        {/* ── Action Toolbar ── */}
        <div
          className="flex flex-wrap items-center justify-between gap-3 pb-6 mb-8 border-b"
          style={{ borderColor: COLORS?.border }}
        >
          <Link
            to="/articles"
            className="inline-flex items-center gap-1.5 text-xs font-bold px-3 py-2 rounded-lg border transition-colors hover:bg-white"
            style={{ borderColor: COLORS?.border, color: COLORS?.primary, backgroundColor: "rgba(255,255,255,0.7)" }}
          >
            {isRTL ? <ArrowRight className="w-3.5 h-3.5" /> : <ArrowLeft className="w-3.5 h-3.5" />}
            {isRTL ? "تمام مقالات" : "All Articles"}
          </Link>

          <div className="flex items-center gap-2">
            <button
              onClick={copyLink}
              className="flex items-center gap-1.5 text-xs font-semibold px-3 py-2 rounded-lg border cursor-pointer hover:bg-white transition-colors"
              style={{ borderColor: COLORS?.border, color: COLORS?.textSecondary }}
            >
              {copied ? <Check className="w-3.5 h-3.5 text-green-600" /> : <Copy className="w-3.5 h-3.5" />}
              {copied ? (isRTL ? "کاپی!" : "Copied!") : (isRTL ? "لنک کاپی" : "Copy")}
            </button>
            <button
              onClick={() => handleShare("whatsapp")}
              className="flex items-center gap-1.5 text-xs font-semibold px-3 py-2 rounded-lg border cursor-pointer transition-colors"
              style={{
                borderColor: "#c7f0c7",
                color: "#15803d",
                backgroundColor: "#f0fff0",
              }}
            >
              <Share2 className="w-3.5 h-3.5" />
              {isRTL ? "واٹس ایپ" : "Share"}
            </button>
            <button
              onClick={() => window?.print()}
              className="flex items-center gap-1.5 text-xs font-semibold px-3 py-2 rounded-lg border cursor-pointer hover:bg-white transition-colors"
              style={{ borderColor: COLORS?.border, color: COLORS?.textSecondary }}
            >
              <Printer className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* ── Article Summary / Body ── */}
        {article?.summary && (
          <div
            className="rounded-2xl p-6 sm:p-8 mb-8 border-r-4"
            style={{
              backgroundColor: `${COLORS?.secondary}40`,
              borderRightColor: COLORS?.accent,
              borderTopColor: "transparent",
              borderBottomColor: "transparent",
              borderLeftColor: "transparent",
              border: isRTL
                ? `0 0 0 4px ${COLORS?.accent}`
                : undefined,
              borderRight: isRTL ? `4px solid ${COLORS?.accent}` : undefined,
              borderLeft: !isRTL ? `4px solid ${COLORS?.accent}` : undefined,
            }}
          >
            <p
              className="text-sm sm:text-base leading-[2.4] font-normal"
              style={{ color: COLORS?.textPrimary }}
            >
              {article?.summary}
            </p>
          </div>
        )}

        {/* ── Tags ── */}
        {article?.tags?.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-8">
            {article?.tags?.map((t, idx) => (
              <span
                key={idx}
                className="inline-flex items-center gap-1 text-xs px-3 py-1.5 rounded-lg font-medium border"
                style={{
                  backgroundColor: COLORS?.white,
                  borderColor: COLORS?.border,
                  color: COLORS?.textSecondary,
                }}
              >
                <Tag className="w-3 h-3 opacity-60" />
                {t}
              </span>
            ))}
          </div>
        )}

        {/* ── References ── */}
        {article?.references?.length > 0 && (
          <div
            className="rounded-xl p-5 mb-8 border"
            style={{ backgroundColor: COLORS?.white, borderColor: COLORS?.border }}
          >
            <h3
              className="text-sm font-bold font-serif mb-3 flex items-center gap-2"
              style={{ color: COLORS?.primary }}
            >
              <span
                className="w-1.5 h-5 rounded-full inline-block"
                style={{ backgroundColor: COLORS?.accent }}
              />
              {isRTL ? "مراجع و مصادر" : "References & Sources"}
            </h3>
            <ol className="list-decimal list-inside space-y-1.5">
              {article?.references?.map((ref, idx) => (
                <li
                  key={idx}
                  className="text-xs sm:text-sm"
                  style={{ color: COLORS?.textSecondary }}
                >
                  {ref}
                </li>
              ))}
            </ol>
          </div>
        )}

        {/* ══════════════════════════════════════════════════════════════
            PDF SECTION — if available
        ══════════════════════════════════════════════════════════════ */}
        {pdfUrl && (
          <div
            className="rounded-2xl border p-5 sm:p-6 mb-8"
            style={{ backgroundColor: COLORS?.white, borderColor: COLORS?.border }}
          >
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div>
                <h3
                  className="font-bold text-base font-serif mb-1"
                  style={{ color: COLORS?.primary }}
                >
                  {isRTL ? "مکمل مضمون — پی ڈی ایف" : "Full Article — PDF"}
                </h3>
                <p className="text-xs" style={{ color: COLORS?.textSecondary }}>
                  {isRTL
                    ? "اس مضمون کو PDF میں آن لائن پڑھیں یا ڈاؤن لوڈ کریں"
                    : "Read or download this article in PDF format"}
                </p>
              </div>
              <div className="flex flex-wrap items-center gap-2">
                <button
                  onClick={() => setIsPdfModalOpen(true)}
                  className="flex items-center gap-2 px-4 py-2.5 text-xs font-bold text-white rounded-xl cursor-pointer hover:opacity-90 transition-opacity"
                  style={{ backgroundColor: COLORS?.primary }}
                >
                  <ExternalLink className="w-3.5 h-3.5" />
                  {isRTL ? "آن لائن پڑھیں" : "Read Online"}
                </button>
                <button
                  onClick={() => setShowEmbeddedPdf(!showEmbeddedPdf)}
                  className="flex items-center gap-2 px-4 py-2.5 text-xs font-bold rounded-xl border cursor-pointer transition-colors hover:bg-slate-50"
                  style={{
                    borderColor: COLORS?.accent,
                    color: COLORS?.primary,
                    backgroundColor: showEmbeddedPdf ? `${COLORS?.secondary}50` : "transparent",
                  }}
                >
                  {showEmbeddedPdf ? <Minimize2 className="w-3.5 h-3.5" /> : <Maximize2 className="w-3.5 h-3.5" />}
                  {showEmbeddedPdf
                    ? (isRTL ? "قاری بند کریں" : "Hide Reader")
                    : (isRTL ? "یہاں پڑھیں" : "Read Here")}
                </button>
                <a
                  href={pdfUrl}
                  download
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 px-4 py-2.5 text-xs font-semibold rounded-xl border cursor-pointer transition-colors hover:bg-slate-50"
                  style={{ borderColor: COLORS?.border, color: COLORS?.textSecondary }}
                >
                  <Download className="w-3.5 h-3.5" />
                  {isRTL ? "ڈاؤن لوڈ" : "Download"}
                </a>
              </div>
            </div>

            {/* Embedded Reader */}
            {showEmbeddedPdf && (
              <div
                className="mt-5 rounded-xl overflow-hidden border"
                style={{ height: "700px", borderColor: COLORS?.border }}
              >
                <PdfViewer url={pdfUrl} title={article?.title} isModal={false} />
              </div>
            )}
          </div>
        )}

        {/* ══════════════════════════════════════════════════════════════
            COMMENTS SECTION
        ══════════════════════════════════════════════════════════════ */}
        <div
          className="rounded-2xl border overflow-hidden mb-8"
          style={{ backgroundColor: COLORS?.white, borderColor: COLORS?.border }}
        >
          <button
            type="button"
            onClick={() => setIsCommentsOpen((v) => !v)}
            className="w-full flex items-center justify-between gap-3 px-5 py-4 cursor-pointer transition-colors hover:bg-slate-50"
            style={{ borderBottom: isCommentsOpen ? `1px solid ${COLORS?.border}` : "none" }}
          >
            <div className="flex items-center gap-3">
              <div
                className="w-9 h-9 rounded-xl flex items-center justify-center"
                style={{
                  backgroundColor: isCommentsOpen ? COLORS?.primary : `${COLORS?.primary}12`,
                  color: isCommentsOpen ? COLORS?.accent : COLORS?.primary,
                }}
              >
                <MessageSquare className="w-4 h-4" />
              </div>
              <div className="text-right">
                <span className="text-sm font-bold block font-serif" style={{ color: COLORS?.primary }}>
                  {isRTL ? "تبصرے و آراء" : "Comments & Feedback"}
                </span>
                <span className="text-[11px]" style={{ color: COLORS?.textSecondary }}>
                  {isRTL
                    ? isCommentsOpen ? "تبصرے بند کریں" : "تبصرہ لکھیں"
                    : isCommentsOpen ? "Hide comments" : "View & add comments"}
                </span>
              </div>
            </div>
            <ChevronDown
              className={`w-4 h-4 transition-transform duration-300 shrink-0 ${isCommentsOpen ? "rotate-180" : ""}`}
              style={{ color: COLORS?.textSecondary }}
            />
          </button>

          {isCommentsOpen && (
            <div className="p-4 sm:p-6">
              <CommentsSection
                contentType="article"
                contentId={article?._id}
                language={language}
              />
            </div>
          )}
        </div>

        {/* ══════════════════════════════════════════════════════════════
            RELATED ARTICLES
        ══════════════════════════════════════════════════════════════ */}
        {relatedArticles?.length > 0 && (
          <div>
            <div
              className="flex items-center justify-between mb-5 pb-3 border-b"
              style={{ borderColor: COLORS?.border }}
            >
              <h2
                className="text-lg font-bold font-serif flex items-center gap-2"
                style={{ color: COLORS?.primary }}
              >
                <span
                  className="w-1.5 h-5 rounded-full"
                  style={{ backgroundColor: COLORS?.accent }}
                />
                {isRTL ? "متعلقہ مقالات" : "Related Articles"}
              </h2>
              <Link
                to="/articles"
                className="text-xs font-bold hover:underline"
                style={{ color: COLORS?.accent }}
              >
                {isRTL ? "سب دیکھیں ←" : "View All →"}
              </Link>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {relatedArticles?.map((relArt) => {
                const relImg = getImageSrc(relArt?.featuredImage);
                const relCategory =
                  ARTICLE_CATEGORY_TRANSLATIONS[relArt?.category] || relArt?.category;
                return (
                  <Link
                    key={relArt?._id}
                    to={`/articles/slug/${relArt?.slug || relArt?._id}`}
                    className="group rounded-xl overflow-hidden border transition-all hover:shadow-md"
                    style={{ backgroundColor: COLORS?.white, borderColor: COLORS?.border }}
                  >
                    {/* Related article thumbnail */}
                    <div
                      className="relative h-32 w-full overflow-hidden"
                      style={{ backgroundColor: COLORS?.primary }}
                    >
                      {relImg ? (
                        <img
                          src={relImg}
                          alt={relArt?.title || ""}
                          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <FileText className="w-8 h-8 opacity-30 text-white" />
                        </div>
                      )}
                      <div
                        className="absolute inset-0"
                        style={{
                          background: "linear-gradient(to top, rgba(30,15,5,0.75) 0%, transparent 60%)",
                        }}
                      />
                      <span
                        className="absolute bottom-2 right-2 text-[9px] font-bold px-2 py-0.5 rounded-full"
                        style={{ backgroundColor: COLORS?.accent, color: "#fff" }}
                      >
                        {relCategory}
                      </span>
                    </div>

                    <div className="p-3">
                      <h4
                        className="text-xs sm:text-sm font-bold font-serif line-clamp-2 leading-[1.7] group-hover:underline"
                        style={{ color: COLORS?.primary }}
                      >
                        {relArt?.title}
                      </h4>
                      <span
                        className="text-[10px] block mt-1 truncate"
                        style={{ color: COLORS?.textSecondary }}
                      >
                        {relArt?.author || "مفتی فیضان سرور مصباحی"}
                      </span>
                    </div>
                  </Link>
                );
              })}
            </div>
          </div>
        )}
      </div>

      {/* Fullscreen PDF Modal */}
      {isPdfModalOpen && pdfUrl && (
        <PdfViewer
          url={pdfUrl}
          title={article?.title}
          isModal={true}
          onClose={() => setIsPdfModalOpen(false)}
        />
      )}
    </div>
  );
}
