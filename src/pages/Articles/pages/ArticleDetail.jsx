import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import {
  FileText,
  Calendar,
  User,
  Eye,
  Share2,
  ArrowRight,
  ArrowLeft,
  Copy,
  BookOpen,
  Home,
  Check,
  Printer,
  Download,
  MessageSquare,
  ChevronDown,
} from "lucide-react";
import { FaWhatsapp } from "react-icons/fa";

// Estimated reading time helper
const getReadingTime = (text = "") => {
  const words = text?.trim()?.split(/\s+/)?.filter(Boolean)?.length || 0;
  return Math.max(1, Math.ceil(words / 200));
};
import { getArticleBySlug, getArticles } from "@/services";
import { useCachedContent } from "@/hooks/useContentCache";
import { STALE_TIMES } from "@/store/slices/contentSlice";
import { useSettings } from "@/hooks/useSettings";
import { BACKEND_URL } from "@/constants/urls";
import { ARTICLE_CATEGORY_TRANSLATIONS } from "@/utils/categories";
import { ArticleCard, PdfViewer, Spinner } from "@/components";
import CommentsSection from "@/components/CommentsSection";
import toast from "react-hot-toast";
import {
  IslamicBackgroundPattern,
  GoldDiamondDivider,
  CardGeometricTexture,
  IslamicBookSeal,
  IslamicGeometricWatermark,
} from "@/pages/Fatwas/components/FatwaDetailDecorativeAssets";

// ═════════════════════════════════════════════════════════════════════
// Exact Palette from Fatwa Detail / Design System
// ═════════════════════════════════════════════════════════════════════
const THEME = {
  cardBg: "#F7F1E8",
  panelBg: "#FCF8F1",
  darkBrown: "#2B2118",
  mainText: "#2A211A",
  goldAccent: "#A8793E",
  secondaryBorder: "#C8A46A",
  lightGold: "#D8C09A",
  noticeBg: "#EFE6D9",
  textMuted: "#685545",
  cardShadow: "0 8px 30px rgba(43, 33, 24, 0.06)",
};

export default function ArticleDetail() {
  const { slug, id } = useParams();
  const rawParam = slug || id;
  const { settings } = useSettings();
  const language =
    settings?.language === "ur" || settings?.language === "Urdu" ? "ur" : "en";
  const isRTL = language === "ur";

  const { data: detailData, loading, error } = useCachedContent({
    type: "articles_detail",
    params: rawParam,
    fetcher: async () => {
      const data = await getArticleBySlug(rawParam);
      const articleData = data?.article || data;
      let related = data?.related || [];
      if (!related.length || !related[0]?.summary) {
        try {
          let allRes = await getArticles({
            category: articleData?.category,
            limit: 4,
          });
          let others = (allRes?.articles || [])?.filter(
            (a) => a?._id !== articleData?._id
          );
          if (!others.length) {
            allRes = await getArticles({ limit: 4 });
            others = (allRes?.articles || [])?.filter(
              (a) => a?._id !== articleData?._id
            );
          }
          if (others.length > 0) {
            related = others.slice(0, 3);
          }
        } catch {}
      }
      return { article: articleData, related };
    },
    staleTime: STALE_TIMES.articles,
    enabled: !!rawParam,
  });

  const article = detailData?.article || null;
  const relatedArticles = detailData?.related || [];

  const [isPdfModalOpen, setIsPdfModalOpen] = useState(false);
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
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [rawParam]);

  const shareUrl = typeof window !== "undefined" ? window?.location?.href : "";

  const handleShare = (platform) => {
    const urls = {
      whatsapp: `https://api.whatsapp.com/send?text=${encodeURIComponent(
        (article?.title || "") + " - " + shareUrl
      )}`,
      twitter: `https://twitter.com/intent/tweet?url=${encodeURIComponent(
        shareUrl
      )}&text=${encodeURIComponent(article?.title || "")}`,
    };
    if (urls[platform])
      window.open(urls[platform], "_blank", "width=600,height=400");
  };

  const copyLink = () => {
    navigator?.clipboard?.writeText(shareUrl);
    setCopied(true);
    toast.success(isRTL ? "لنک کاپی ہو گیا!" : "Link copied!");
    setTimeout(() => setCopied(false), 2000);
  };

  // Trigger PDF download with clean sanitized filename
  const handleDownloadPdf = async () => {
    if (!pdfUrl) {
      toast.error(isRTL ? "پی ڈی ایف دستیاب نہیں ہے" : "PDF not available");
      return;
    }

    const cleanTitle = (article?.title || "article")
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
        link.style.display = "none";
        link.href = downloadUrl;
        link.setAttribute("download", fileName);
        link.setAttribute("target", "_blank");
        link.setAttribute("rel", "noopener noreferrer");
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      } else {
        const response = await fetch(pdfUrl);
        if (!response.ok) throw new Error("Fetch failed");
        const blob = await response.blob();
        const pdfBlob = new Blob([blob], { type: "application/pdf" });
        const blobUrl = window.URL.createObjectURL(pdfBlob);

        const link = document.createElement("a");
        link.style.display = "none";
        link.href = blobUrl;
        link.download = fileName;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);

        setTimeout(() => {
          window.URL.revokeObjectURL(blobUrl);
        }, 1500);
      }
      toast.success(isRTL ? "پی ڈی ایف ڈاؤنلوڈ شروع ہو گئی ہے" : "Downloading PDF...");
    } catch (err) {
      console.warn("Direct download failed:", err);
      const fallbackLink = document.createElement("a");
      fallbackLink.style.display = "none";
      fallbackLink.href = pdfUrl;
      fallbackLink.target = "_blank";
      fallbackLink.rel = "noopener noreferrer";
      document.body.appendChild(fallbackLink);
      fallbackLink.click();
      document.body.removeChild(fallbackLink);
    }
  };

  /* ── Loading State ── */
  if (loading) {
    return (
      <div
        className="min-h-screen flex items-center justify-center"
        style={{ backgroundColor: "#E8DFD2" }}
      >
        <Spinner size="lg" text="مضمون لوڈ ہو رہا ہے..." />
      </div>
    );
  }

  /* ── Error State ── */
  if (error || !article) {
    return (
      <div
        className="min-h-screen flex flex-col items-center justify-center p-6 text-center"
        style={{ backgroundColor: "#E8DFD2" }}
        dir={isRTL ? "rtl" : "ltr"}
      >
        <FileText
          className="w-16 h-16 mb-4 opacity-30"
          style={{ color: THEME.goldAccent }}
        />
        <h2
          className="text-2xl font-bold font-['Payami_Nastaleeq',serif] mb-2"
          style={{ color: THEME.darkBrown }}
        >
          {isRTL ? "مضمون دستیاب نہیں" : "Article Not Found"}
        </h2>
        <p
          className="text-sm max-w-md mb-6 font-['Payami_Nastaleeq',serif]"
          style={{ color: THEME.textMuted }}
        >
          {error ||
            (isRTL
              ? "مطلوبہ مضمون موجود نہیں یا ہٹا دیا گیا ہے۔"
              : "The article was not found or removed.")}
        </p>
        <Link
          to="/articles"
          className="px-6 py-2.5 rounded-xl font-bold text-white text-sm font-['Payami_Nastaleeq',serif]"
          style={{ backgroundColor: THEME.darkBrown }}
        >
          {isRTL ? "تمام مقالات" : "All Articles"}
        </Link>
      </div>
    );
  }

  const rawPdfUrl =
    article?.pdf?.url ||
    (typeof article?.pdf === "string" ? article?.pdf : null);
  const pdfUrl = rawPdfUrl ? rawPdfUrl.replace(/^http:\/\//i, "https://") : null;
  const featuredImageSrc = getImageSrc(article?.featuredImage);
  const showHeroImage = featuredImageSrc && !heroImgError;
  const categoryLabel =
    ARTICLE_CATEGORY_TRANSLATIONS[article?.category] ||
    article?.category ||
    (isRTL ? "عقیدہ و ایمان" : "Islamic Articles");

  // Format date safely
  const formattedDate = article?.publishDate
    ? new Date(article?.publishDate).toLocaleDateString(
        isRTL ? "ur-PK" : "en-US",
        {
          year: "numeric",
          month: "long",
          day: "numeric",
        }
      )
    : "19 فروری 2026";

  const readingTime = getReadingTime(article?.summary || "");
  const viewsDisplay = article?.viewCount ?? article?.views ?? 1;

  const referencesList = Array.isArray(article?.references)
    ? article.references.filter(Boolean)
    : typeof article?.references === "string" && article.references.trim()
      ? article.references.split("\n").map((r) => r.trim()).filter(Boolean)
      : [];
  const hasReferences = referencesList.length > 0;

  const articleContent = article?.content || article?.body || "";

  return (
    <div
      dir={isRTL ? "rtl" : "ltr"}
      className="min-h-screen relative overflow-hidden"
      style={{ backgroundColor: "#E8DFD2" }}
    >
      {/* Background Decorative Pattern */}
      <IslamicBackgroundPattern />

      {/* ══════════════════════════════════════════════════════════════
          BREADCRUMB — Immediately below Header
      ══════════════════════════════════════════════════════════════ */}
      <div className="max-w-4xl lg:max-w-5xl mx-auto px-4 sm:px-6 pt-3 sm:pt-4 pb-2 relative z-10">
        <nav
          className="flex items-center gap-1.5 sm:gap-2 text-xs sm:text-sm font-['Payami_Nastaleeq',serif] flex-wrap text-right select-none"
          style={{ color: THEME.textMuted }}
          dir="rtl"
        >
          <Link
            to="/"
            className="hover:text-[#A8793E] transition-colors flex items-center gap-1 shrink-0"
            title={isRTL ? "صفحہ اول" : "Home"}
          >
            <Home className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-[#A8793E]" />
          </Link>
          <span className="text-[#C8A46A] opacity-60">/</span>
          <Link to="/articles" className="hover:text-[#A8793E] transition-colors shrink-0">
            {isRTL ? "مقالات" : "Articles"}
          </Link>
          <span className="text-[#C8A46A] opacity-60">/</span>
          <Link
            to={`/articles?category=${encodeURIComponent(article?.category || "")}`}
            className="hover:text-[#A8793E] transition-colors shrink-0"
          >
            {categoryLabel}
          </Link>
          <span className="text-[#C8A46A] opacity-60">/</span>
          <span
            className="font-bold truncate max-w-[150px] sm:max-w-xs md:max-w-md"
            style={{ color: THEME.darkBrown }}
          >
            {article?.title}
          </span>
        </nav>
      </div>

      {/* ══════════════════════════════════════════════════════════════
          ARTICLE HERO / BANNER — Full-width with Right-aligned Text
      ══════════════════════════════════════════════════════════════ */}
      <div
        className="relative w-full overflow-hidden min-h-[300px] sm:min-h-[380px] md:min-h-[440px] flex flex-col justify-between"
        style={{
          backgroundColor: THEME.darkBrown,
        }}
      >
        {/* Existing Article Image as Full-width Background */}
        {showHeroImage && (
          <img
            src={featuredImageSrc}
            alt={article?.title || ""}
            className="absolute inset-0 w-full h-full object-cover select-none"
            onError={() => setHeroImgError(true)}
          />
        )}

        {/* Dark Editorial Gradient Overlay for Text Readability */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background: showHeroImage
              ? "linear-gradient(to top, rgba(20, 10, 5, 0.96) 0%, rgba(25, 14, 8, 0.70) 50%, rgba(25, 14, 8, 0.40) 100%)"
              : `linear-gradient(135deg, ${THEME.darkBrown} 0%, #1a120b 100%)`,
          }}
        />

        {/* Inner Container for Hero Content (Right-Aligned) */}
        <div
          className="relative z-10 w-full max-w-4xl lg:max-w-5xl mx-auto px-4 sm:px-6 py-6 sm:py-8 flex flex-col justify-between flex-1"
          dir="rtl"
        >
          {/* Top of Hero: Category Badge on the right */}
          <div className="flex justify-start w-full mb-3">
            <span
              className="inline-block px-3.5 py-1 sm:px-4 sm:py-1.5 rounded-full text-xs sm:text-sm font-['Payami_Nastaleeq',serif] font-bold text-white shadow-sm"
              style={{
                backgroundColor: THEME.goldAccent,
                border: "1px solid rgba(255, 255, 255, 0.25)",
              }}
            >
              {categoryLabel}
            </span>
          </div>

          {/* Middle: Title aligned to the RIGHT */}
          <div className="my-auto py-3 text-right w-full">
            <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-[44px] font-bold font-['Payami_Nastaleeq',serif] text-white leading-[1.8] sm:leading-[1.9] drop-shadow-md text-right">
              {article?.title}
            </h1>
          </div>

          {/* Bottom of Hero: Metadata Bar (Always visible & right-aligned with dark pill backing) */}
          <div className="flex flex-wrap items-center justify-start gap-2.5 sm:gap-4 text-xs sm:text-sm font-['Payami_Nastaleeq',serif] pt-3 sm:pt-4 border-t border-white/20 text-white w-full text-right">
            {/* Author */}
            <span className="flex items-center gap-1.5 font-medium bg-black/40 px-2.5 py-1 rounded-lg backdrop-blur-xs border border-white/10">
              <User className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-[#DEC498] shrink-0" />
              <span>{article?.author || "مفتی فیضان سرور مصباحی"}</span>
            </span>

            {/* Date */}
            <span className="flex items-center gap-1.5 font-medium bg-black/40 px-2.5 py-1 rounded-lg backdrop-blur-xs border border-white/10">
              <Calendar className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-[#DEC498] shrink-0" />
              <span>{formattedDate}</span>
            </span>

            {/* Views - Always clearly visible */}
            <span className="flex items-center gap-1.5 font-medium bg-black/40 px-2.5 py-1 rounded-lg backdrop-blur-xs border border-white/10">
              <Eye className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-[#DEC498] shrink-0" />
              <span>
                {viewsDisplay} {isRTL ? "مناظر" : "views"}
              </span>
            </span>
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="max-w-4xl lg:max-w-5xl mx-auto px-4 sm:px-6 pb-6 sm:pb-8 relative z-10">
        {/* ══════════════════════════════════════════════════════════════
            ACTION BAR — Below Hero
        ══════════════════════════════════════════════════════════════ */}
        <div
          className="flex flex-wrap items-center justify-between gap-2.5 sm:gap-3 my-2.5 sm:my-3"
          dir="rtl"
        >
          {/* Action 1: تمام مقالات (Back link) */}
          <Link
            to="/articles"
            className="inline-flex items-center gap-2 text-xs sm:text-sm font-bold font-['Payami_Nastaleeq',serif] px-4 py-2.5 rounded-xl border transition-all hover:bg-white shadow-xs"
            style={{
              borderColor: THEME.secondaryBorder,
              color: THEME.darkBrown,
              backgroundColor: THEME.cardBg,
            }}
          >
            {isRTL ? (
              <ArrowRight className="w-4 h-4" />
            ) : (
              <ArrowLeft className="w-4 h-4" />
            )}
            <span>{isRTL ? "تمام مقالات" : "All Articles"}</span>
          </Link>

          {/* Secondary Actions */}
          <div className="flex flex-wrap items-center gap-2">
            {/* Copy Link */}
            <button
              onClick={copyLink}
              className="flex items-center gap-1.5 text-xs sm:text-sm font-semibold font-['Payami_Nastaleeq',serif] px-3.5 py-2.5 rounded-xl border cursor-pointer hover:bg-white transition-colors shadow-xs"
              style={{
                borderColor: THEME.secondaryBorder,
                color: THEME.textMuted,
                backgroundColor: THEME.cardBg,
              }}
            >
              {copied ? (
                <Check className="w-4 h-4 text-green-600" />
              ) : (
                <Copy className="w-4 h-4 text-[#A8793E]" />
              )}
              <span>
                {copied
                  ? isRTL
                    ? "کاپی ہو گیا!"
                    : "Copied!"
                  : isRTL
                  ? "لنک کاپی کریں"
                  : "Copy Link"}
              </span>
            </button>

            {/* WhatsApp Share */}
            <button
              onClick={() => handleShare("whatsapp")}
              className="flex items-center gap-1.5 text-xs sm:text-sm font-semibold font-['Payami_Nastaleeq',serif] px-3.5 py-2.5 rounded-xl border cursor-pointer transition-all shadow-xs hover:brightness-105 active:scale-95 text-white"
              style={{
                borderColor: "#25D366",
                color: "#ffffff",
                backgroundColor: "#25D366",
              }}
            >
              <FaWhatsapp className="w-4 h-4 text-white" />
              <span>{isRTL ? "واٹس ایپ پر شیئر کریں" : "Share on WhatsApp"}</span>
            </button>

            {/* Print */}
            <button
              onClick={() => window?.print()}
              className="flex items-center gap-1.5 text-xs sm:text-sm font-semibold font-['Payami_Nastaleeq',serif] px-3.5 py-2.5 rounded-xl border cursor-pointer hover:bg-white transition-colors shadow-xs"
              style={{
                borderColor: THEME.secondaryBorder,
                color: THEME.textMuted,
                backgroundColor: THEME.cardBg,
              }}
            >
              <Printer className="w-4 h-4 text-[#A8793E]" />
              <span>{isRTL ? "پرنٹ کریں" : "Print"}</span>
            </button>
          </div>
        </div>

        {/* ══════════════════════════════════════════════════════════════
            COMBINED ARTICLE INFORMATION SECTION (Summary + PDF in ONE unified card)
            Modeled exactly like FatwaSummaryCard
        ══════════════════════════════════════════════════════════════ */}
        <section
          aria-labelledby="article-summary-heading"
          className="rounded-[20px] md:rounded-[24px] p-3.5 sm:p-5 md:p-6 border relative overflow-hidden transition-all duration-300 mb-2.5 sm:mb-3"
          style={{
            background:
              "radial-gradient(circle at 95% 0%, #DFCEB7 0%, #E9DEC9 28%, #F7F1E8 60%)",
            borderColor: THEME.secondaryBorder,
            boxShadow: THEME.cardShadow,
          }}
        >
          {/* Subtle Islamic geometric texture across outer card */}
          <CardGeometricTexture className="opacity-[0.06]" />

          {/* Top-right subtle warm shading and lace texture */}
          <div className="absolute top-0 right-0 w-48 sm:w-60 md:w-80 h-36 sm:h-44 md:h-52 pointer-events-none overflow-hidden rounded-tr-[20px] md:rounded-tr-[24px]">
            <CardGeometricTexture
              className="opacity-[0.20]"
              strokeColor="#A8793E"
              secondaryColor="#C8A46A"
            />
          </div>

          {/* ── HEADER ROW: Left Capsule | Right Bismillah + Islamic Book Medallion ── */}
          <div
            className="flex items-center justify-between gap-1.5 sm:gap-3 mb-2.5 sm:mb-3 relative z-10"
            dir="ltr"
          >
            {/* LEFT: Capsule ("مضمون کا خلاصہ") */}
            <div
              className="inline-flex items-center gap-1.5 sm:gap-2.5 py-1 sm:py-1.5 px-2.5 sm:px-3.5 rounded-full border shadow-2xs whitespace-nowrap shrink-0"
              style={{
                backgroundColor: THEME.noticeBg,
                borderColor: `${THEME.secondaryBorder}60`,
              }}
            >
              <div
                className="w-7 h-7 sm:w-8 sm:h-8 rounded-full flex items-center justify-center shrink-0 border shadow-xs"
                style={{
                  backgroundColor: "#E4D5C2",
                  borderColor: `${THEME.secondaryBorder}60`,
                  color: THEME.darkBrown,
                }}
              >
                <FileText className="w-3.5 h-3.5 sm:w-4 sm:h-4 stroke-[2.2] text-[#2B2118]" />
              </div>

              <h2
                id="article-summary-heading"
                className="font-bold whitespace-nowrap leading-none pr-0.5 select-none"
                style={{ color: THEME.mainText }}
              >
                <span className="text-[14px] xs:text-[15.5px] sm:text-[17px] font-['Payami_Nastaleeq',serif] leading-none pt-0.5">
                  {isRTL ? "مضمون کا خلاصہ" : "Article Summary"}
                </span>
              </h2>
            </div>

            {/* RIGHT: Bismillah Pill seamlessly connected into the Islamic Book Medallion */}
            <div className="flex items-center shrink-0 select-none">
              <div
                className="px-2.5 xs:px-3 sm:px-4 py-1 rounded-l-full border-y border-l border-r-0 shadow-xs -mr-6 xs:-mr-7 sm:-mr-8 md:-mr-9 z-0 flex items-center justify-center h-[28px] sm:h-[32px] md:h-[35px]"
                style={{
                  backgroundColor: "#38271A",
                  borderColor: "rgba(168, 121, 62, 0.45)",
                }}
              >
                <span
                  className="quran-font text-[9.5px] xs:text-[11px] sm:text-[12px] md:text-[12.5px] font-semibold tracking-wide whitespace-nowrap block leading-none select-none pr-4 xs:pr-5 sm:pr-6 md:pr-7"
                  style={{ color: "#F7F1E8" }}
                >
                  بسم الله الرحمن الرحيم
                </span>
              </div>

              <div className="z-10 relative drop-shadow-md">
                <IslamicBookSeal className="w-[58px] h-[58px] xs:w-[66px] xs:h-[66px] sm:w-[78px] sm:h-[78px] md:w-[88px] md:h-[88px]" />
              </div>
            </div>
          </div>

          {/* ── BOX 1: SUMMARY CONTENT PANEL (#FCF8F1) ── */}
          {article?.summary && (
            <div
              className="rounded-[18px] p-3.5 sm:p-6 md:p-7 border relative shadow-2xs overflow-hidden z-10"
              style={{
                backgroundColor: THEME.panelBg,
                borderColor: THEME.lightGold,
              }}
            >
              <div className="absolute -bottom-8 -left-8 pointer-events-none select-none">
                <IslamicGeometricWatermark className="w-48 h-48 sm:w-56 sm:h-56 opacity-[0.035]" />
              </div>

              {/* Dynamic Urdu Summary Text with Right Gold Accent Bar */}
              <div
                className="relative pr-3.5 sm:pr-4 border-r-2 border-[#A8793E] py-1"
                dir="rtl"
              >
                <p
                  className="text-[16px] xs:text-[17px] sm:text-[19px] md:text-[21px] font-['Payami_Nastaleeq',serif] leading-[1.8] sm:leading-[2] font-normal whitespace-pre-line break-words text-right relative z-10"
                  style={{ color: THEME.mainText }}
                >
                  {article?.summary}
                </p>
              </div>

              {/* Centered Gold Diamond Divider */}
              <GoldDiamondDivider className="my-3 sm:my-3.5" />
            </div>
          )}

          {/* ── BOX 2: INTEGRATED PDF ACTION PANEL (#FCF8F1) ── */}
          {pdfUrl && (
            <div
              className="mt-2 sm:mt-2.5 rounded-[18px] p-3 sm:p-3.5 border relative shadow-2xs overflow-hidden z-10"
              style={{
                backgroundColor: THEME.panelBg,
                borderColor: THEME.lightGold,
              }}
              dir="rtl"
            >
              {/* Exactly Two Action Buttons: Left (Download) & Right (Online Read) */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 sm:gap-3">
                {/* BUTTON 1: Dark Brown Download Button */}
                <button
                  type="button"
                  onClick={handleDownloadPdf}
                  className="flex items-center justify-between px-4 sm:px-5 py-2.5 sm:py-3 rounded-xl sm:rounded-2xl font-bold transition-all duration-200 cursor-pointer shadow-xs hover:opacity-95 active:scale-[0.99] min-h-[46px] sm:min-h-[48px] select-none border-0"
                  style={{
                    backgroundColor: THEME.darkBrown,
                    color: "#FFFFFF",
                  }}
                >
                  <Download className="w-4 h-4 sm:w-4.5 sm:h-4.5 text-white shrink-0 stroke-[2.2]" />
                  <span className="font-['Payami_Nastaleeq',serif] text-[14.5px] sm:text-base tracking-wide mx-2">
                    {isRTL ? "مکمل مضمون ڈاؤنلوڈ کریں" : "Download PDF"}
                  </span>
                  <ArrowRight className="w-4 h-4 sm:w-4.5 sm:h-4.5 text-white shrink-0" />
                </button>

                {/* BUTTON 2: Crisp Cream Online Read Button */}
                <button
                  type="button"
                  onClick={() => setIsPdfModalOpen(true)}
                  className="flex items-center justify-between px-4 sm:px-5 py-2.5 sm:py-3 rounded-xl sm:rounded-2xl border font-bold transition-all duration-200 shadow-xs hover:bg-[#F3E8D8] active:scale-[0.99] min-h-[46px] sm:min-h-[48px] select-none cursor-pointer"
                  style={{
                    backgroundColor: "#FAF6EF",
                    borderColor: THEME.darkBrown,
                    color: THEME.darkBrown,
                  }}
                >
                  <BookOpen className="w-4 h-4 sm:w-4.5 sm:h-4.5 text-[#2C2118] shrink-0 stroke-[2.2]" />
                  <span className="font-['Payami_Nastaleeq',serif] text-[14.5px] sm:text-base tracking-wide mx-2">
                    {isRTL ? "آن لائن پڑھیں" : "Read Online"}
                  </span>
                  <ArrowRight className="w-4 h-4 sm:w-4.5 sm:h-4.5 text-[#2C2118] shrink-0" />
                </button>
              </div>
            </div>
          )}
        </section>

        {/* ══════════════════════════════════════════════════════════════
            ARTICLE CONTENT — Reading Experience (مکمل مضمون)
        ══════════════════════════════════════════════════════════════ */}
        {articleContent && (
          <section
            className="rounded-[20px] sm:rounded-[24px] border p-4 sm:p-6 md:p-8 mb-2.5 sm:mb-3 relative overflow-hidden"
            style={{
              backgroundColor: THEME.cardBg,
              borderColor: THEME.secondaryBorder,
              boxShadow: THEME.cardShadow,
            }}
            dir="rtl"
          >
            <CardGeometricTexture />

            <div className="relative z-10">
              {/* Heading */}
              <div
                className="flex items-center gap-3 mb-4 pb-3 border-b"
                style={{ borderColor: THEME.lightGold }}
              >
                <div
                  className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl flex items-center justify-center border shadow-xs shrink-0"
                  style={{
                    backgroundColor: THEME.noticeBg,
                    borderColor: THEME.secondaryBorder,
                    color: THEME.darkBrown,
                  }}
                >
                  <BookOpen className="w-4.5 h-4.5 stroke-[2.2]" />
                </div>
                <h2
                  className="text-xl sm:text-2xl md:text-3xl font-bold font-['Payami_Nastaleeq',serif] leading-none"
                  style={{ color: THEME.darkBrown }}
                >
                  {isRTL ? "مکمل مضمون" : "Full Article"}
                </h2>
              </div>

              {/* Scholarly Reading Surface */}
              <div
                className="font-['Payami_Nastaleeq',serif] text-base sm:text-lg md:text-[19px] leading-[2.3] sm:leading-[2.4] text-right space-y-4"
                style={{ color: THEME.mainText }}
              >
                {articleContent.split("\n\n").map((paragraph, pIdx) => {
                  const trimmed = paragraph.trim();
                  if (!trimmed) return null;

                  // Check if this paragraph is a Quranic verse, Hadith, or scholarly quotation
                  const isQuotation =
                    trimmed.startsWith("«") ||
                    trimmed.startsWith("”") ||
                    trimmed.startsWith('"') ||
                    trimmed.includes("قال الله تعالى") ||
                    trimmed.includes("قال رسول الله") ||
                    trimmed.includes("حضرت");

                  if (isQuotation) {
                    return (
                      <div
                        key={pIdx}
                        className="my-4 p-4 sm:p-5 rounded-2xl border text-center relative overflow-hidden"
                        style={{
                          backgroundColor: THEME.panelBg,
                          borderColor: THEME.secondaryBorder,
                        }}
                      >
                        <GoldDiamondDivider className="my-2" />
                        <p
                          className="text-lg sm:text-xl md:text-2xl font-['Payami_Nastaleeq',serif] leading-[2.2] font-semibold my-2.5"
                          style={{ color: THEME.darkBrown }}
                        >
                          {trimmed}
                        </p>
                        <GoldDiamondDivider className="my-2" />
                      </div>
                    );
                  }

                  return <p key={pIdx}>{trimmed}</p>;
                })}
              </div>
            </div>
          </section>
        )}

        {/* ══════════════════════════════════════════════════════════════
            COMMENTS SECTION (تبصرے و آراء — Card Accordion)
        ══════════════════════════════════════════════════════════════ */}
        <section
          className="rounded-[20px] sm:rounded-[24px] border overflow-hidden transition-shadow duration-300 mb-2.5 sm:mb-3"
          style={{
            backgroundColor: THEME.cardBg,
            borderColor: THEME.secondaryBorder,
            boxShadow: THEME.cardShadow,
          }}
        >
          <button
            type="button"
            onClick={() => setIsCommentsOpen((v) => !v)}
            className="w-full flex items-center justify-between gap-3 px-4 sm:px-6 py-3 sm:py-3.5 cursor-pointer transition-colors hover:bg-black/5"
            style={{
              borderBottom: isCommentsOpen
                ? `1px solid ${THEME.lightGold}`
                : "none",
            }}
          >
            <div className="flex items-center gap-3 sm:gap-3.5">
              <div
                className="w-10 h-10 sm:w-11 sm:h-11 rounded-xl flex items-center justify-center border shadow-xs shrink-0 transition-colors"
                style={{
                  backgroundColor: isCommentsOpen ? "#2C2118" : "#E4D5C2",
                  borderColor: isCommentsOpen ? "#2C2118" : THEME.secondaryBorder,
                  color: isCommentsOpen ? "#FAF6EF" : "#2C2118",
                }}
              >
                <MessageSquare className="w-5 h-5 stroke-[2.2]" />
              </div>
              <div className="text-start" dir="rtl">
                <span
                  className="text-[17px] sm:text-[19px] md:text-[20px] font-bold block font-['Payami_Nastaleeq',serif] leading-none pt-0.5 select-none"
                  style={{ color: THEME.darkBrown }}
                >
                  {isRTL ? "تبصرے و آراء" : "Comments & Feedback"}
                </span>
                <span
                  className="text-[12px] sm:text-[13px] font-['Payami_Nastaleeq',serif] block leading-snug mt-1 opacity-80 select-none"
                  style={{ color: THEME.textMuted }}
                >
                  {isCommentsOpen
                    ? isRTL
                      ? "تبصروں کا خانہ بند کریں"
                      : "Close comments"
                    : isRTL
                    ? "مضمون پر اپنے تاثرات لکھیں یا دوسروں کے تبصرے دیکھیں"
                    : "Write your feedback or view comments"}
                </span>
              </div>
            </div>
            <ChevronDown
              className={`w-4 h-4 transition-transform duration-300 shrink-0 ${
                isCommentsOpen ? "rotate-180" : ""
              }`}
              style={{ color: THEME.textMuted }}
            />
          </button>

          {isCommentsOpen && (
            <div
              className="p-3.5 sm:p-5"
              style={{ backgroundColor: THEME.panelBg }}
            >
              <CommentsSection
                contentType="article"
                contentId={article?._id}
                language={language}
              />
            </div>
          )}
        </section>

        {/* ══════════════════════════════════════════════════════════════
            RELATED ARTICLES (متعلقہ مضامین)
        ══════════════════════════════════════════════════════════════ */}
        {relatedArticles?.length > 0 && (
          <section className="mb-4 sm:mb-6">
            <div
              className="flex items-center justify-between mb-2.5 pb-1.5 border-b"
              style={{ borderColor: THEME.lightGold }}
              dir="rtl"
            >
              <h2
                className="text-lg sm:text-xl font-bold font-['Payami_Nastaleeq',serif] flex items-center gap-2"
                style={{ color: THEME.darkBrown }}
              >
                <span
                  className="w-1.5 h-5 rounded-full"
                  style={{ backgroundColor: THEME.goldAccent }}
                />
                <span>{isRTL ? "متعلقہ مضامین" : "Related Articles"}</span>
              </h2>
              <Link
                to="/articles"
                className="text-xs sm:text-sm font-bold font-['Payami_Nastaleeq',serif] hover:underline flex items-center gap-1"
                style={{ color: THEME.goldAccent }}
              >
                <span>{isRTL ? "تمام مقالات دیکھیں" : "View All"}</span>
                {isRTL ? (
                  <ArrowLeft className="w-3.5 h-3.5" />
                ) : (
                  <ArrowRight className="w-3.5 h-3.5" />
                )}
              </Link>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3.5 sm:gap-4.5">
              {relatedArticles?.map((relArt) => (
                <ArticleCard key={relArt?._id} article={relArt} />
              ))}
            </div>
          </section>
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
