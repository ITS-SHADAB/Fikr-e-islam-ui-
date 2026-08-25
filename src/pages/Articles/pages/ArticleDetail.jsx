import React, { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import {
  FileText,
  Download,
  ExternalLink,
  Calendar,
  User,
  Eye,
  Share2,
  ArrowRight,
  ArrowLeft,
  Copy,
  Check,
  Globe,
  Printer,
  Sparkles,
  Maximize2,
  Minimize2,
  Bookmark,
  MessageSquare
} from "lucide-react";
import { getArticleBySlug, getArticles } from "@/services";
import { useSettings } from "@/hooks/useSettings";
import { COLORS } from "@/utils/themeColors";
import { BACKEND_URL } from "@/constants/urls";
import { ARTICLE_CATEGORY_TRANSLATIONS } from "@/utils/categories";
import { PdfViewer } from "@/components";
import CommentsSection from "@/components/CommentsSection";
import toast from "react-hot-toast";

export default function ArticleDetail() {
  const { slug, id } = useParams();
  const rawParam = slug || id;
  const navigate = useNavigate();
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

  const getImageSrc = (img) => {
    if (!img) return null;
    const url = typeof img === "object" ? img.url : img;
    if (!url) return null;
    if (url.startsWith("/")) return `${BACKEND_URL}${url}`;
    return url;
  };

  useEffect(() => {
    const loadArticleData = async () => {
      try {
        setLoading(true);
        setError(null);
        window.scrollTo({ top: 0, behavior: "smooth" });

        let activeSlug = rawParam;

        // If parameter is a 24-character ObjectID hex representation, resolve to slug
        if (rawParam && /^[0-9a-fA-F]{24}$/.test(rawParam)) {
          const res = await getArticles({ limit: 1000 });
          const matched = res.articles?.find((a) => a._id === rawParam);
          if (matched && matched.slug) {
            activeSlug = matched.slug;
          }
        }

        const data = await getArticleBySlug(activeSlug);
        const articleData = data.article || data;
        setArticle(articleData);

        // Fetch related articles
        try {
          const allRes = await getArticles({
            category: articleData.category,
            limit: 4,
          });
          const otherArticles = (allRes.articles || []).filter(
            (a) => a._id !== articleData._id
          );
          setRelatedArticles(otherArticles.slice(0, 3));
        } catch (rErr) {
          console.warn("Failed to load related articles", rErr);
        }
      } catch (err) {
        setError(
          err.response?.data?.message ||
            err.message ||
            (isRTL ? "مضمون لوڈ کرنے میں ناکامی" : "Failed to load article")
        );
      } finally {
        setLoading(false);
      }
    };

    if (rawParam) {
      loadArticleData();
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
        url = `https://twitter.com/intent/tweet?url=${encodeURIComponent(shareUrl)}&text=${encodeURIComponent(article?.title || "")}`;
        break;
      case "whatsapp":
        url = `https://api.whatsapp.com/send?text=${encodeURIComponent((article?.title || "") + " - " + shareUrl)}`;
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
        <span className="text-sm font-medium" style={{ color: COLORS.textSecondary }}>
          {isRTL ? "مضمون کی تفصیلات لوڈ ہو رہی ہیں..." : "Loading article details..."}
        </span>
      </div>
    );
  }

  if (error || !article) {
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
          <FileText className="w-8 h-8" style={{ color: COLORS.primary }} />
        </div>
        <h2
          className="text-2xl font-bold font-serif mb-2"
          style={{ color: COLORS.textPrimary }}
        >
          {isRTL ? "مضمون دستیاب نہیں ہے" : "Article Not Found"}
        </h2>
        <p className="text-sm max-w-md mb-6" style={{ color: COLORS.textSecondary }}>
          {error || (isRTL ? "مطلوبہ مضمون موجود نہیں ہے یا ہٹا دیا گیا ہے۔" : "The requested article does not exist or has been removed.")}
        </p>
        <Link
          to="/articles"
          className="px-6 py-2.5 rounded-xl font-bold text-white text-sm shadow-md transition-transform hover:scale-105"
          style={{ backgroundColor: COLORS.primary }}
        >
          {isRTL ? "تمام مقالات دیکھیں" : "View All Articles"}
        </Link>
      </div>
    );
  }

  const {
    _id,
    title,
    summary,
    content,
    category,
    author = "مفتی فیضان سرور مصباحی",
    publishDate,
    featuredImage,
    pdf,
    tags = [],
    references = [],
    viewCount = 0,
  } = article;

  const pdfUrl = pdf?.url || (typeof pdf === "string" ? pdf : null);
  const featuredImageSrc = getImageSrc(featuredImage);
  const categoryLabel =
    ARTICLE_CATEGORY_TRANSLATIONS[category] || category || (isRTL ? "مضامین" : "Articles");

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
      className="min-h-screen py-6 md:py-10"
      style={{ backgroundColor: COLORS.background }}
    >
      <div className="w-full max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8">
        {/* Breadcrumbs & Navigation Bar */}
        <div className="flex items-center justify-between gap-4 mb-6 flex-wrap pb-4 border-b" style={{ borderColor: `${COLORS.border}80` }}>
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
              to="/articles"
              className="hover:underline transition-colors"
              style={{ color: COLORS.textSecondary }}
            >
              {isRTL ? "مضامین و مقالات" : "Articles"}
            </Link>
            <span style={{ color: COLORS.border }}>/</span>
            <Link
              to={`/articles?category=${encodeURIComponent(category || "")}`}
              className="hover:underline transition-colors font-semibold"
              style={{ color: COLORS.accent }}
            >
              {categoryLabel}
            </Link>
            <span style={{ color: COLORS.border }}>/</span>
            <span className="font-bold truncate max-w-xs sm:max-w-md" style={{ color: COLORS.primary }}>
              {title}
            </span>
          </nav>

          <Link
            to="/articles"
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
                <span>تمام مقالات</span>
              </>
            ) : (
              <>
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>All Articles</span>
              </>
            )}
          </Link>
        </div>

        {/* ══════════════════════════════════════════════════════════════
            FULL PAGE 2-COLUMN LAYOUT
        ══════════════════════════════════════════════════════════════ */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start mb-12">
          
          {/* ══════════════════════════════════════════════════════════════
              RIGHT COLUMN (in RTL): Sticky Presentation & Metadata Card
          ══════════════════════════════════════════════════════════════ */}
          <div className="lg:col-span-4 lg:sticky lg:top-24 space-y-6">
            <div
              className="rounded-3xl border shadow-md p-6 sm:p-7 transition-all flex flex-col items-center"
              style={{
                backgroundColor: COLORS.white,
                borderColor: COLORS.border,
              }}
            >
              {/* Featured Image Presentation Frame */}
              <div
                className="relative w-full max-w-[280px] aspect-[4/3] rounded-2xl overflow-hidden shadow-2xl border p-2.5 flex items-center justify-center select-none group"
                style={{
                  backgroundColor: COLORS.primary,
                  borderColor: `${COLORS.accent}60`,
                }}
              >
                {featuredImageSrc ? (
                  <div className="relative w-full h-full rounded-xl overflow-hidden shadow-inner border border-white/20">
                    <img
                      src={featuredImageSrc}
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
                    <div className="space-y-2">
                      <FileText className="w-14 h-14 mx-auto opacity-70" style={{ color: COLORS.accent }} />
                      <span className="font-bold text-sm block line-clamp-2 font-serif" style={{ color: COLORS.primary }}>
                        {title}
                      </span>
                    </div>
                  </div>
                )}
              </div>

              {/* Action Buttons: PDF (if available) / Quick Actions */}
              <div className="w-full mt-6 space-y-3">
                {pdfUrl && (
                  <>
                    <button
                      type="button"
                      onClick={() => setIsPdfModalOpen(true)}
                      className="w-full inline-flex items-center justify-center gap-2 px-6 py-3.5 text-sm font-bold text-white rounded-xl shadow-md cursor-pointer hover:opacity-95 hover:shadow-lg transition-all"
                      style={{ backgroundColor: COLORS.primary }}
                    >
                      <ExternalLink className="w-4 h-4" style={{ color: COLORS.accent }} />
                      <span>{isRTL ? "پی ڈی ایف مطالعہ کریں" : "Read PDF (Modal)"}</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => setShowEmbeddedPdf(!showEmbeddedPdf)}
                      className="w-full inline-flex items-center justify-center gap-2 px-6 py-2.5 text-xs font-bold rounded-xl border transition-all cursor-pointer hover:bg-slate-50 text-center"
                      style={{
                        borderColor: COLORS.accent,
                        color: COLORS.primary,
                        backgroundColor: showEmbeddedPdf ? `${COLORS.secondary}40` : "transparent",
                      }}
                    >
                      {showEmbeddedPdf ? (
                        <>
                          <Minimize2 className="w-3.5 h-3.5 text-accent" />
                          <span>{isRTL ? "پی ڈی ایف بند کریں" : "Hide PDF"}</span>
                        </>
                      ) : (
                        <>
                          <Maximize2 className="w-3.5 h-3.5 text-accent" />
                          <span>{isRTL ? "صفحہ پر پی ڈی ایف دیکھیں" : "View PDF on Page"}</span>
                        </>
                      )}
                    </button>

                    <a
                      href={pdfUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      download
                      className="w-full inline-flex items-center justify-center gap-2 px-6 py-2.5 text-xs font-semibold rounded-xl border transition-all cursor-pointer hover:bg-slate-50 text-center"
                      style={{
                        borderColor: COLORS.border,
                        color: COLORS.primary,
                        backgroundColor: "transparent",
                      }}
                    >
                      <Download className="w-3.5 h-3.5" style={{ color: COLORS.accent }} />
                      <span>{isRTL ? "پی ڈی ایف ڈاؤن لوڈ کریں" : "Download PDF"}</span>
                    </a>
                  </>
                )}
              </div>

              {/* Quick Actions Bar */}
              <div className="w-full pt-4 mt-4 border-t flex items-center justify-between gap-2" style={{ borderColor: `${COLORS.border}70` }}>
                <button
                  type="button"
                  onClick={copyToClipboard}
                  className="flex-1 inline-flex items-center justify-center gap-1.5 py-2 px-3 text-xs font-semibold rounded-lg border hover:bg-slate-50 transition-colors"
                  style={{ borderColor: COLORS.border, color: COLORS.textSecondary }}
                  title="Copy Link"
                >
                  {copied ? <Check className="w-3.5 h-3.5 text-green-600" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copied ? (isRTL ? "کاپی ہو گیا" : "Copied") : (isRTL ? "کاپی" : "Copy")}</span>
                </button>

                <button
                  type="button"
                  onClick={() => handleShareClick("whatsapp")}
                  className="p-2 rounded-lg border text-green-700 bg-green-50/50 hover:bg-green-50 border-green-200 transition-colors"
                  title="Share to WhatsApp"
                >
                  <Share2 className="w-4 h-4" />
                </button>

                <button
                  type="button"
                  onClick={handlePrint}
                  className="p-2 rounded-lg border hover:bg-slate-50 transition-colors"
                  style={{ borderColor: COLORS.border, color: COLORS.textSecondary }}
                  title="Print"
                >
                  <Printer className="w-4 h-4" />
                </button>
              </div>

              {/* Metadata Table */}
              <div className="w-full mt-5 space-y-2.5 pt-4 border-t text-xs" style={{ borderColor: `${COLORS.border}70` }}>
                <div className="flex items-center justify-between py-1.5 border-b border-dashed" style={{ borderColor: `${COLORS.border}50` }}>
                  <span style={{ color: COLORS.textSecondary }}>{isRTL ? "مصنف" : "Author"}</span>
                  <span className="font-bold text-right" style={{ color: COLORS.primary }}>{author}</span>
                </div>

                <div className="flex items-center justify-between py-1.5 border-b border-dashed" style={{ borderColor: `${COLORS.border}50` }}>
                  <span style={{ color: COLORS.textSecondary }}>{isRTL ? "شعبہ / زمرہ" : "Category"}</span>
                  <span className="font-bold" style={{ color: COLORS.primary }}>{categoryLabel}</span>
                </div>

                {formattedDate && (
                  <div className="flex items-center justify-between py-1.5 border-b border-dashed" style={{ borderColor: `${COLORS.border}50` }}>
                    <span style={{ color: COLORS.textSecondary }}>{isRTL ? "تاریخ اشاعت" : "Published"}</span>
                    <span className="font-bold" style={{ color: COLORS.primary }}>{formattedDate}</span>
                  </div>
                )}

                {viewCount > 0 && (
                  <div className="flex items-center justify-between py-1.5">
                    <span style={{ color: COLORS.textSecondary }}>{isRTL ? "مناظر" : "Views"}</span>
                    <span className="font-bold" style={{ color: COLORS.primary }}>{viewCount}</span>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* ══════════════════════════════════════════════════════════════
              LEFT / MAIN COLUMN (in RTL): Full Article Content, Overview, Comments
          ══════════════════════════════════════════════════════════════ */}
          <div className="lg:col-span-8 space-y-8">
            
            {/* Main Header & Article Card */}
            <div
              className="rounded-3xl border shadow-sm p-6 sm:p-8 md:p-10 space-y-6"
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
                  {isRTL ? "اردو" : "Urdu"}
                </span>
              </div>

              {/* Title */}
              <h1
                className="text-2xl sm:text-3xl md:text-4xl font-bold leading-[1.85] break-words"
                style={{ color: COLORS.primary }}
              >
                {title}
              </h1>

              {/* Author Row */}
              {author && (
                <div
                  className="flex items-center gap-3 p-4 rounded-2xl border"
                  style={{
                    backgroundColor: `${COLORS.background}60`,
                    borderColor: `${COLORS.border}80`,
                  }}
                >
                  <div
                    className="w-11 h-11 rounded-full flex items-center justify-center shrink-0 shadow-xs"
                    style={{ backgroundColor: COLORS.primary, color: COLORS.accent }}
                  >
                    <User className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="text-[11px] block font-medium" style={{ color: COLORS.textSecondary }}>
                      {isRTL ? "نگارش و تحقیق" : "Author / Scholar"}
                    </span>
                    <span className="text-base font-bold" style={{ color: COLORS.textPrimary }}>
                      {author}
                    </span>
                  </div>
                </div>
              )}

              {/* Summary Synopsis Box */}
              {summary && (
                <div
                  className="p-5 rounded-2xl border text-sm sm:text-base leading-[2.1] font-normal break-words italic"
                  style={{
                    backgroundColor: `${COLORS.secondary}30`,
                    borderColor: `${COLORS.accent}40`,
                    color: COLORS.primary,
                    borderRight: isRTL ? `4px solid ${COLORS.accent}` : undefined,
                    borderLeft: !isRTL ? `4px solid ${COLORS.accent}` : undefined,
                  }}
                >
                  {summary}
                </div>
              )}

              {/* Full Article Content / Body */}
              <div className="space-y-4 pt-2">
                <h3 className="text-lg font-bold flex items-center gap-2" style={{ color: COLORS.primary }}>
                  <Sparkles className="w-4 h-4 text-accent" />
                  <span>{isRTL ? "متنِ مضمون" : "Article Body"}</span>
                </h3>
                
                {content ? (
                  <div
                    className="prose prose-lg max-w-none text-base sm:text-lg leading-[2.2] font-normal whitespace-pre-line break-words"
                    style={{ color: COLORS.textPrimary }}
                    dangerouslySetInnerHTML={{ __html: content }}
                  />

                ) : (
                  <p className="text-sm font-light text-slate-500 italic">
                    {isRTL ? "اس مضمون کا مکمل متن جلد شائع کیا جائے گا۔" : "Full text will be published soon."}
                  </p>
                )}
              </div>

              {/* References & Sources */}
              {references && references.length > 0 && (
                <div className="space-y-2 pt-4 border-t" style={{ borderColor: `${COLORS.border}70` }}>
                  <h4 className="text-sm font-bold font-serif" style={{ color: COLORS.primary }}>
                    {isRTL ? "مراجع و مصادر" : "References & Sources"}
                  </h4>
                  <ul className="list-disc list-inside space-y-1 text-xs sm:text-sm text-slate-700">
                    {references.map((ref, idx) => (
                      <li key={idx}>{ref}</li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Topics & Tags */}
              {tags && tags.length > 0 && (
                <div className="pt-4 border-t" style={{ borderColor: `${COLORS.border}70` }}>
                  <span className="text-xs font-bold block mb-2" style={{ color: COLORS.textSecondary }}>
                    {isRTL ? "موضوعات و ٹیگز:" : "Topics & Tags:"}
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {tags.map((t, idx) => (
                      <span
                        key={idx}
                        className="px-3 py-1 rounded-lg text-xs font-medium border"
                        style={{
                          borderColor: COLORS.border,
                          backgroundColor: COLORS.white,
                          color: COLORS.textSecondary,
                        }}
                      >
                        #{t}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Embedded PDF Viewer if toggled */}
            {showEmbeddedPdf && pdfUrl && (
              <div
                className="rounded-3xl border shadow-lg overflow-hidden p-6 sm:p-8 transition-all space-y-4"
                style={{
                  backgroundColor: COLORS.white,
                  borderColor: COLORS.border,
                }}
              >
                <div className="flex items-center justify-between pb-3 border-b" style={{ borderColor: COLORS.border }}>
                  <h3 className="text-lg font-bold font-serif" style={{ color: COLORS.primary }}>
                    {isRTL ? "پی ڈی ایف قاری (In-Page Reader)" : "PDF Reader"}
                  </h3>
                  <button
                    type="button"
                    onClick={() => setIsPdfModalOpen(true)}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold rounded-lg border hover:bg-slate-50 transition-colors"
                    style={{ borderColor: COLORS.border, color: COLORS.primary }}
                  >
                    <Maximize2 className="w-3.5 h-3.5 text-accent" />
                    <span>{isRTL ? "مکمل اسکرین" : "Fullscreen"}</span>
                  </button>
                </div>
                <div className="w-full h-[750px] rounded-2xl overflow-hidden border" style={{ borderColor: COLORS.border }}>
                  <PdfViewer url={pdfUrl} title={title} isModal={false} />
                </div>
              </div>
            )}

            {/* ══════════════════════════════════════════════════════════════
                INSTAGRAM-STYLE COMMENTS SECTION
            ══════════════════════════════════════════════════════════════ */}
            <div
              className="rounded-3xl border shadow-sm p-6 sm:p-8"
              style={{
                backgroundColor: COLORS.white,
                borderColor: COLORS.border,
              }}
            >
              <CommentsSection
                contentType="article"
                contentId={_id}
                language={language}
              />
            </div>

          </div>
        </div>

        {/* ══════════════════════════════════════════════════════════════
            RELATED ARTICLES SECTION
        ══════════════════════════════════════════════════════════════ */}
        {relatedArticles.length > 0 && (
          <div className="mt-14 pt-8 border-t" style={{ borderColor: COLORS.border }}>
            <div className="flex items-center justify-between mb-6">
              <div>
                <span className="text-xs font-bold uppercase tracking-widest block mb-0.5" style={{ color: COLORS.accent }}>
                  {isRTL ? "متعلقہ مقالات" : "EXPLORE MORE"}
                </span>
                <h2 className="text-xl sm:text-2xl font-bold font-serif" style={{ color: COLORS.primary }}>
                  {isRTL ? "مزید متعلقہ علمی و تحقیقی مضامین" : "Related Articles"}
                </h2>
              </div>
              <Link
                to="/articles"
                className="text-xs sm:text-sm font-bold hover:underline"
                style={{ color: COLORS.accent }}
              >
                {isRTL ? "سب دیکھیں ←" : "View All →"}
              </Link>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {relatedArticles.map((relArt) => {
                const relImgSrc = getImageSrc(relArt.featuredImage);
                return (
                  <Link
                    key={relArt._id}
                    to={`/articles/${relArt.slug || relArt._id}`}
                    className="p-5 rounded-2xl border shadow-xs hover:shadow-md transition-all duration-300 flex flex-col justify-between group"
                    style={{
                      backgroundColor: COLORS.white,
                      borderColor: COLORS.border,
                    }}
                  >
                    <div className="flex items-start gap-4 mb-3">
                      <div
                        className="w-16 h-20 rounded-lg overflow-hidden shrink-0 shadow-sm border flex items-center justify-center p-1"
                        style={{ backgroundColor: COLORS.primary }}
                      >
                        {relImgSrc ? (
                          <img src={relImgSrc} alt={relArt.title} className="w-full h-full object-cover rounded" />
                        ) : (
                          <FileText className="w-6 h-6 text-white/80" />
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <span
                          className="text-[10px] font-bold px-2 py-0.5 rounded-full inline-block mb-1"
                          style={{ backgroundColor: COLORS.secondary, color: COLORS.primary }}
                        >
                          {ARTICLE_CATEGORY_TRANSLATIONS[relArt.category] || relArt.category}
                        </span>
                        <h4
                          className="font-bold text-sm line-clamp-2 group-hover:text-accent transition-colors font-serif"
                          style={{ color: COLORS.primary }}
                        >
                          {relArt.title}
                        </h4>
                        <span className="text-[11px] block mt-1 truncate" style={{ color: COLORS.textSecondary }}>
                          {relArt.author || "مفتی فیضان سرور مصباحی"}
                        </span>
                      </div>
                    </div>

                    <div className="pt-3 border-t flex items-center justify-between text-xs font-bold" style={{ borderColor: `${COLORS.border}60`, color: COLORS.accent }}>
                      <span>{isRTL ? "مضمون پڑھیں" : "Read Article"}</span>
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
