import React, { useEffect, useState } from "react";
import { useParams, Link, Navigate } from "react-router-dom";
import {
  Calendar,
  Eye,
  ArrowRight,
  ArrowLeft,
  Bookmark,
  HelpCircle,
  FileText,
  BookOpen,
  Download,
  ExternalLink,
  Share2,
  Copy,
  Check,
  Printer,
  Scale,
  ChevronDown,
  MessageSquare,
  Maximize2,
  Minimize2,
  Info,
} from "lucide-react";
import { FaWhatsapp } from "react-icons/fa";
import { getFatwaBySlug, getFatwas } from "@/services";
import { useCachedContent } from "@/hooks/useContentCache";
import { STALE_TIMES } from "@/store/slices/contentSlice";
import { useSettings } from "@/hooks/useSettings";
import { FatwaCard, PdfViewer, Spinner, SEO } from "@/components";
import { getFatwaSchema, getBreadcrumbSchema } from "@/utils/seoHelpers";
import CommentsSection from "@/components/CommentsSection";
import { FATWA_CATEGORY_TRANSLATIONS } from "@/utils/categories";
import { COLORS } from "@/utils/themeColors";
import toast from "react-hot-toast";
import {
  IslamicBackgroundPattern,
  GoldDiamondDivider,
} from "../components/FatwaDetailDecorativeAssets";
import FatwaQuestionCard from "../components/FatwaQuestionCard";
import FatwaSummaryCard from "../components/FatwaSummaryCard";

// ═════════════════════════════════════════════════════════════════════
// Exact Palette for the 3 Image 2 Target Cards
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

const DUPLICATE_FATWAS_REDIRECT = {
  'جاندار-کی-تصویر-والے-کپڑے-کی-بنائی-و-کڑھائی-پر-کمائی-کا-حکم-1': 'جاندار-کی-تصویر-والے-کپڑے-کی-بنائی-و-کڑھائی-پر-کمائی-کا-حکم',
  'امام-مسجد-سے-متعلق-دس-متفرق-سوالات-کے-جوابات-1': 'امام-مسجد-سے-متعلق-دس-متفرق-سوالات-کے-جوابات',
  'بیوی-کی-کمائی-میں-شوہر-کے-تصرف-کا-حکم-1': 'بیوی-کی-کمائی-میں-شوہر-کے-تصرف-کا-حکم',
};

export default function FatwaDetail() {
  const { slug, id } = useParams();
  const rawParam = slug || id;

  if (rawParam && DUPLICATE_FATWAS_REDIRECT[rawParam]) {
    return <Navigate to={`/fatwas/${DUPLICATE_FATWAS_REDIRECT[rawParam]}`} replace />;
  }

  const { settings } = useSettings();
  const language =
    settings?.language === "ur" || settings?.language === "Urdu" ? "ur" : "en";
  const isRTL = language === "ur";

  const { data: detailData, loading, error } = useCachedContent({
    type: "fatwas_detail",
    params: rawParam,
    fetcher: async () => {
      const data = await getFatwaBySlug(rawParam);
      const fatwaData = data?.fatwa || data;
      const related = data?.related || [];
      return { fatwa: fatwaData, related };
    },
    staleTime: STALE_TIMES.fatwas,
    enabled: !!rawParam,
  });

  const fatwa = detailData?.fatwa || null;
  const related = detailData?.related || [];

  const [isPdfModalOpen, setIsPdfModalOpen] = useState(false);
  const [showEmbeddedPdf, setShowEmbeddedPdf] = useState(false);
  const [copied, setCopied] = useState(false);
  const [isCommentsOpen, setIsCommentsOpen] = useState(false);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [rawParam]);

  const shareUrl = typeof window !== "undefined" ? window?.location?.href : "";

  const handleShare = (platform) => {
    const urls = {
      whatsapp: `https://api.whatsapp.com/send?text=${encodeURIComponent(
        (fatwa?.title || "") + " - " + shareUrl
      )}`,
      twitter: `https://twitter.com/intent/tweet?url=${encodeURIComponent(
        shareUrl
      )}&text=${encodeURIComponent(fatwa?.title || "")}`,
    };
    if (urls[platform]) {
      window.open(urls[platform], "_blank", "width=600,height=400");
    }
  };

  const copyLink = () => {
    navigator?.clipboard?.writeText(shareUrl);
    setCopied(true);
    toast.success(isRTL ? "لنک کاپی ہو گیا!" : "Link copied!");
    setTimeout(() => setCopied(false), 2000);
  };

  if (loading) {
    return (
      <div
        className="min-h-screen flex items-center justify-center"
        style={{ backgroundColor: COLORS?.background }}
      >
        <Spinner size="lg" text="فتویٰ لوڈ ہو رہا ہے..." />
      </div>
    );
  }

  if (error || !fatwa) {
    return (
      <div
        className="min-h-screen flex flex-col items-center justify-center p-6 text-center"
        style={{ backgroundColor: COLORS?.background }}
        dir={isRTL ? "rtl" : "ltr"}
      >
        <SEO
          title={isRTL ? "فتویٰ دستیاب نہیں" : "Fatwa Not Found"}
          description={isRTL ? "مطلوبہ فتویٰ موجود نہیں ہے یا ہٹا دیا گیا ہے۔" : "The requested fatwa does not exist or has been removed."}
          noindex={true}
        />
        <FileText
          className="w-16 h-16 mb-4 opacity-30"
          style={{ color: COLORS?.primary }}
        />
        <h2
          className="text-2xl font-bold font-serif mb-2"
          style={{ color: COLORS?.textPrimary }}
        >
          {isRTL ? "فتویٰ دستیاب نہیں" : "Fatwa Not Found"}
        </h2>
        <p
          className="text-sm max-w-md mb-6 font-['Payami_Nastaleeq',serif]"
          style={{ color: COLORS?.textSecondary }}
        >
          {error ||
            (isRTL
              ? "مطلوبہ فتویٰ موجود نہیں ہے یا ہٹا دیا گیا ہے۔"
              : "The requested fatwa does not exist or has been removed.")}
        </p>
        <Link
          to="/fatwas"
          className="px-6 py-2.5 rounded-xl font-bold text-white text-sm"
          style={{ backgroundColor: COLORS?.primary }}
        >
          {isRTL ? "تمام فتاویٰ" : "All Fatwas"}
        </Link>
      </div>
    );
  }

  const rawPdfUrl =
    fatwa?.pdf?.url || (typeof fatwa?.pdf === "string" ? fatwa?.pdf : null);
  const pdfUrl = rawPdfUrl ? rawPdfUrl.replace(/^http:\/\//i, "https://") : null;
  const categoryLabel =
    FATWA_CATEGORY_TRANSLATIONS?.[fatwa?.category] ||
    fatwa?.category ||
    (isRTL ? "عام مسائل" : "General");

  const formattedDate = fatwa?.publishDate
    ? new Date(fatwa?.publishDate).toLocaleDateString(
        isRTL ? "ur-PK" : "en-US",
        {
          year: "numeric",
          month: "long",
          day: "numeric",
        }
      )
    : "";

  // Trigger PDF download from top action bar
  const handleDownloadPdf = async () => {
    if (!pdfUrl) {
      toast.error(isRTL ? "پی ڈی ایف دستیاب نہیں ہے" : "PDF not available");
      return;
    }

    const cleanTitle = (fatwa?.title || "fatwa")
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

  return (
    <div
      dir={isRTL ? "rtl" : "ltr"}
      style={{ backgroundColor: COLORS?.background }}
    >
      <SEO
        title={fatwa.title}
        description={fatwa.summary || fatwa.question}
        canonical={`/fatwas/${fatwa.slug || rawParam}`}
        type="article"
        schema={[
          getFatwaSchema({
            title: fatwa.title,
            summary: fatwa.summary || fatwa.question,
            slug: fatwa.slug || rawParam,
            publishDate: fatwa.publishDate || fatwa.createdAt,
            updatedAt: fatwa.updatedAt,
            category: categoryLabel,
          }),
          getBreadcrumbSchema([
            { name: isRTL ? "فتاویٰ" : "Fatwas", url: "/fatwas" },
            { name: fatwa.title, url: `/fatwas/${fatwa.slug || rawParam}` },
          ]),
        ]}
      />
      {/* ══════════════════════════════════════════════════════════════
          HERO BANNER — Ruling headline & category (PRESERVED AS WAS)
      ══════════════════════════════════════════════════════════════ */}
      <div
        className="w-full relative overflow-hidden"
        style={{
          background: `linear-gradient(135deg, ${COLORS?.primary} 0%, #25160c 100%)`,
        }}
      >
        {/* Navigation Breadcrumb */}
        <div className="max-w-4xl mx-auto px-4 sm:px-6 pt-6">
          <nav
            className="flex items-center gap-1.5 text-xs font-medium flex-wrap"
            style={{ color: "rgba(255,255,255,0.7)" }}
          >
            <Link to="/" className="hover:text-white transition-colors">
              {isRTL ? "صفحہ اول" : "Home"}
            </Link>
            <span>/</span>
            <Link to="/fatwas" className="hover:text-white transition-colors">
              {isRTL ? "فتاویٰ" : "Fatwas"}
            </Link>
            <span>/</span>
            <Link
              to={`/fatwas?category=${encodeURIComponent(
                fatwa?.category || ""
              )}`}
              className="hover:text-white transition-colors"
            >
              {categoryLabel}
            </Link>
          </nav>
        </div>

        {/* Header Content */}
        <div className="max-w-4xl mx-auto px-4 sm:px-6 pt-5 pb-10">
          <div className="flex flex-wrap items-center gap-2 mb-3">
            <span
              className="inline-flex items-center gap-1 text-[11px] font-bold px-3 py-1 rounded-full uppercase tracking-wider text-white"
              style={{ backgroundColor: COLORS?.accent }}
            >
              <Scale className="w-3 h-3" />
              <span>{categoryLabel}</span>
            </span>

            {/* Display official fatwa number if available in database */}
            {(fatwa?.fatwaNumber || fatwa?.number) && (
              <span
                className="inline-flex items-center gap-1 text-[11px] font-bold px-3 py-1 rounded-full uppercase tracking-wider text-white bg-amber-900/60 border border-amber-400/30"
              >
                <FileText className="w-3 h-3 text-amber-300" />
                <span>فتویٰ نمبر: {fatwa.fatwaNumber || fatwa.number}</span>
              </span>
            )}
          </div>

          <h1 className="text-xl sm:text-2xl font-bold font-serif leading-[1.8] text-white mb-3">
            {fatwa?.title}
          </h1>

          {/* Meta Bar */}
          <div
            className="flex flex-wrap items-center gap-4 text-xs font-medium"
            style={{ color: "rgba(255,255,255,0.8)" }}
          >
            {formattedDate && (
              <span className="flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5 text-accent" />
                <span>
                  {isRTL ? "تاریخِ اشاعت:" : "Published:"} {formattedDate}
                </span>
              </span>
            )}
            {(fatwa?.viewCount || 0) > 0 && (
              <span className="flex items-center gap-1.5">
                <Eye className="w-3.5 h-3.5 text-accent" />
                <span>
                  {fatwa?.viewCount} {isRTL ? "بار دیکھا گیا" : "views"}
                </span>
              </span>
            )}
            <Link
              to="/about"
              className="flex items-center gap-1.5 hover:text-white transition-colors"
              title="مفتی محمد فیضان سرور مصباحی کے متعلق جانیں"
            >
              <span
                className="w-2 h-2 rounded-full inline-block"
                style={{ backgroundColor: COLORS?.accent }}
              />
              <span className="hover:underline">{isRTL ? "دار الافتاء: مفتی محمد فیضان سرور مصباحی" : "Darul Ifta: Mufti Faizan Sarwar"}</span>
            </Link>
          </div>
        </div>
      </div>

      {/* ══════════════════════════════════════════════════════════════
          MAIN CONTENT AREA (#E8DFD2 with subtle Islamic geometric pattern)
      ══════════════════════════════════════════════════════════════ */}
      <div
        className="w-full relative overflow-hidden py-6 sm:py-10"
        style={{ backgroundColor: "#E8DFD2" }}
      >
        <IslamicBackgroundPattern />
        <div className="max-w-4xl lg:max-w-5xl mx-auto px-4 sm:px-6 relative z-10">
        {/* Actions Bar (Back link, Copy, Share, Print — PRESERVED AS WAS) */}
        <div
          className="flex flex-wrap items-center justify-between gap-3 pb-5 mb-8 border-b"
          style={{ borderColor: COLORS?.border }}
        >
          <Link
            to="/fatwas"
            className="inline-flex items-center gap-1.5 text-xs font-bold px-3.5 py-2 rounded-xl border transition-colors hover:bg-white shadow-xs"
            style={{
              borderColor: COLORS?.border,
              color: COLORS?.primary,
              backgroundColor: "rgba(255,255,255,0.7)",
            }}
          >
            {isRTL ? (
              <ArrowRight className="w-3.5 h-3.5" />
            ) : (
              <ArrowLeft className="w-3.5 h-3.5" />
            )}
            <span className="font-['Payami_Nastaleeq',serif]">
              {isRTL ? "تمام فتاویٰ کی فہرست" : "All Fatwas"}
            </span>
          </Link>

          <div className="flex items-center gap-2">
            <button
              onClick={copyLink}
              className="flex items-center gap-1.5 text-xs font-semibold px-3 py-2 rounded-xl border cursor-pointer hover:bg-white transition-colors"
              style={{
                borderColor: COLORS?.border,
                color: COLORS?.textSecondary,
              }}
            >
              {copied ? (
                <Check className="w-3.5 h-3.5 text-green-600" />
              ) : (
                <Copy className="w-3.5 h-3.5 text-[#A8793E]" />
              )}
              <span className="font-['Payami_Nastaleeq',serif]">
                {copied
                  ? isRTL
                    ? "کاپی ہو گیا!"
                    : "Copied!"
                  : isRTL
                  ? "لنک کاپی"
                  : "Copy"}
              </span>
            </button>

            <button
              onClick={() => handleShare("whatsapp")}
              className="flex items-center gap-1.5 text-xs font-semibold px-3 py-2 rounded-xl border cursor-pointer transition-all shadow-xs hover:brightness-105 active:scale-95"
              style={{
                borderColor: "#25D366",
                color: "#ffffff",
                backgroundColor: "#25D366",
              }}
            >
              <FaWhatsapp className="w-3.5 h-3.5 text-white" />
              <span className="font-['Payami_Nastaleeq',serif] pt-0.5">
                {isRTL ? "واٹس ایپ" : "WhatsApp"}
              </span>
            </button>

            <button
              onClick={handleDownloadPdf}
              className="flex items-center gap-1.5 text-xs font-semibold p-2.5 rounded-xl border cursor-pointer hover:bg-white transition-colors"
              style={{
                borderColor: COLORS?.border,
                color: COLORS?.textSecondary,
              }}
              title={isRTL ? "پی ڈی ایف ڈاؤنلوڈ کریں" : "Download PDF"}
            >
              <Printer className="w-3.5 h-3.5 text-[#A8793E]" />
            </button>
          </div>
        </div>

        {/* ── CORE CONTENT SECTIONS: QUESTION & SUMMARY (WITH INTEGRATED PDF DOWNLOAD) ── */}
        <div className="space-y-2 sm:space-y-2.5 md:space-y-3 relative z-10">
          {/* Section 1: Question / سوال */}
          <FatwaQuestionCard
            question={fatwa?.question}
            isRTL={isRTL}
            theme={THEME}
          />

          {/* Section 2: Answer Summary / جواب و خلاصہ (Includes Integrated PDF Download at bottom) */}
          <FatwaSummaryCard
            summary={fatwa?.summary}
            darulIftaText={isRTL ? "دار الافتاء — جامعہ دار العلوم" : "Darul Ifta"}
            pdfUrl={pdfUrl}
            fatwaTitle={fatwa?.title}
            onOpenModal={() => setIsPdfModalOpen(true)}
            isRTL={isRTL}
            theme={THEME}
          />
        </div>

        {/* ── SUBSEQUENT SECTIONS: SEMANTIC RESEARCH CALLOUTS, COMMENTS, RELATED FATWAS ── */}
        <div className="mt-3.5 sm:mt-4 space-y-3 sm:space-y-3.5 relative z-10">

          {/* ══════════════════════════════════════════════════════════════
              SEMANTIC LINK 1: TALAQ RESEARCH SERIES (ایک مجلس کی تین طلاقیں)
          ══════════════════════════════════════════════════════════════ */}
          {(fatwa?.category === 'طلاق' || fatwa?.title?.includes('طلاق')) && (
            <section
              className="rounded-[20px] sm:rounded-[24px] border p-4 sm:p-5 transition-all"
              style={{
                backgroundColor: THEME.cardBg,
                borderColor: THEME.secondaryBorder,
                boxShadow: THEME.cardShadow,
              }}
              dir="rtl"
            >
              <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div
                    className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0 border"
                    style={{
                      backgroundColor: "#2B2118",
                      borderColor: THEME.secondaryBorder,
                      color: "#FAF6EF",
                    }}
                  >
                    <BookOpen className="w-5 h-5 text-amber-300" />
                  </div>
                  <div>
                    <span className="text-[11px] font-bold text-[#A8793E] font-['Payami_Nastaleeq',serif] block">
                      متعلقہ علمی و فقہی تحقیقی سلسلہ (5 اقساط)
                    </span>
                    <h3 className="text-sm sm:text-base font-bold font-['Payami_Nastaleeq',serif] text-[#2B2118]">
                      ایک مجلس کی تین طلاقیں: جامعہ منعمیہ پٹنہ کے فتوے کا علمی جائزہ
                    </h3>
                    <p className="text-xs font-['Payami_Nastaleeq',serif] text-[#685545] mt-0.5">
                      ایک نشست میں تین طلاق کے وقوع پر مفتی محمد فیضان سرور مصباحی کا تفصیلی علمی، قرآنی و حدیثی مقالہ۔
                    </p>
                  </div>
                </div>

                <Link
                  to="/articles/ایک-مجلس-کی-تین-طلاقیں-جامعہ-منعمیہ-پٹنہ-کے-فتوے-کا-علمی-جائزہ-قسط-اول"
                  className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold text-white shrink-0 hover:opacity-95 transition-all shadow-xs"
                  style={{ backgroundColor: "#2B2118" }}
                >
                  <span>تحقیقی مقالہ پڑھیں</span>
                  <ArrowLeft className="w-3.5 h-3.5" />
                </Link>
              </div>
            </section>
          )}

          {/* ══════════════════════════════════════════════════════════════
              SEMANTIC LINK 2: SALAH RESEARCH BOOK (مسئلۂ ترکِ رفع الیدین اور احناف)
          ══════════════════════════════════════════════════════════════ */}
          {(fatwa?.category === 'نماز' || fatwa?.title?.includes('نماز') || fatwa?.title?.includes('مسجد') || fatwa?.category === 'نماز جمعہ') && (
            <section
              className="rounded-[20px] sm:rounded-[24px] border p-4 sm:p-5 transition-all"
              style={{
                backgroundColor: THEME.cardBg,
                borderColor: THEME.secondaryBorder,
                boxShadow: THEME.cardShadow,
              }}
              dir="rtl"
            >
              <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div
                    className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0 border"
                    style={{
                      backgroundColor: "#2B2118",
                      borderColor: THEME.secondaryBorder,
                      color: "#FAF6EF",
                    }}
                  >
                    <BookOpen className="w-5 h-5 text-amber-300" />
                  </div>
                  <div>
                    <span className="text-[11px] font-bold text-[#A8793E] font-['Payami_Nastaleeq',serif] block">
                      متعلقہ فقہی تصنیف و مطالعہ
                    </span>
                    <h3 className="text-sm sm:text-base font-bold font-['Payami_Nastaleeq',serif] text-[#2B2118]">
                      مسئلۂ ترکِ رفع الیدین اور احناف
                    </h3>
                    <p className="text-xs font-['Payami_Nastaleeq',serif] text-[#685545] mt-0.5">
                      نماز میں ترکِ رفع الیدین اور حنفی فقہی اصولوں پر مفتی محمد فیضان سرور مصباحی کی مستند کتاب۔
                    </p>
                  </div>
                </div>

                <Link
                  to="/publications/مسئلہ-ترک-رفع-الیدین-اور-احناف"
                  className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold text-white shrink-0 hover:opacity-95 transition-all shadow-xs"
                  style={{ backgroundColor: "#2B2118" }}
                >
                  <span>کتاب دیکھیں</span>
                  <ArrowLeft className="w-3.5 h-3.5" />
                </Link>
              </div>
            </section>
          )}

          {/* ══════════════════════════════════════════════════════════════
              CARD 5: COMMENTS ACCORDION (تبصرے و آراء)
          ══════════════════════════════════════════════════════════════ */}
          <section
            className="rounded-[20px] sm:rounded-[24px] border overflow-hidden transition-shadow duration-300"
            style={{
              backgroundColor: THEME.cardBg,
              borderColor: THEME.secondaryBorder,
              boxShadow: THEME.cardShadow,
            }}
          >
            <button
              type="button"
              onClick={() => setIsCommentsOpen((v) => !v)}
              className="w-full flex items-center justify-between gap-3 px-4 sm:px-6 py-3.5 sm:py-4 cursor-pointer transition-colors hover:bg-black/5"
              style={{
                borderBottom: isCommentsOpen
                  ? `1px solid ${THEME.lightGold}`
                  : "none",
              }}
            >
              <div className="flex items-center gap-3 sm:gap-3.5">
                {/* Dark Luxury Message Icon Container */}
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
                <div className="text-start">
                  <span
                    className="text-[17px] sm:text-[19px] md:text-[20px] font-bold block font-['Payami_Nastaleeq',serif] leading-none pt-0.5 select-none"
                    style={{ color: THEME.darkBrown }}
                  >
                    تبصرے و آراء
                  </span>
                  <span
                    className="text-[12px] sm:text-[13px] font-['Payami_Nastaleeq',serif] block leading-snug mt-1 opacity-80 select-none"
                    style={{ color: THEME.textMuted }}
                  >
                    {isCommentsOpen
                      ? "تبصروں کا خانہ بند کریں"
                      : "فتویٰ پر اپنے تاثرات لکھیں یا دوسروں کے تبصرے دیکھیں"}
                  </span>
                </div>
              </div>
              <ChevronDown
                className={`w-5 h-5 transition-transform duration-300 shrink-0 stroke-[2.2] text-[#2C2118] ${
                  isCommentsOpen ? "rotate-180" : ""
                }`}
              />
            </button>

            {isCommentsOpen && (
              <div
                className="p-4 sm:p-6 border-t"
                style={{
                  backgroundColor: THEME.panelBg,
                  borderColor: THEME.lightGold,
                }}
              >
                <CommentsSection
                  contentType="fatwa"
                  contentId={fatwa?._id}
                  language={language}
                />
              </div>
            )}
          </section>

          {/* ══════════════════════════════════════════════════════════════
              CARD 6: RELATED FATWAS (متعلقہ فتاویٰ)
          ══════════════════════════════════════════════════════════════ */}
          {related && related?.length > 0 && (
            <section className="pt-2">
              <div
                className="flex items-center justify-between mb-4 pb-2 border-b"
                style={{ borderColor: THEME.secondaryBorder }}
              >
                <h2
                  className="text-lg sm:text-xl font-bold font-['Payami_Nastaleeq',serif] flex items-center gap-2"
                  style={{ color: THEME.darkBrown }}
                >
                  <span
                    className="w-1.5 h-4 rounded-full"
                    style={{ backgroundColor: THEME.goldAccent }}
                  />
                  <span>متعلقہ فتاویٰ</span>
                </h2>
                <Link
                  to="/fatwas"
                  className="text-xs font-bold font-['Payami_Nastaleeq',serif] hover:underline"
                  style={{ color: THEME.goldAccent }}
                >
                  سب دیکھیں ←
                </Link>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3.5">
                {related?.map((relFatwa) => (
                  <FatwaCard key={relFatwa?._id} fatwa={relFatwa} />
                ))}
              </div>
            </section>
          )}
        </div>
      </div>
    </div>

      {/* Fullscreen PDF Modal (Preserved) */}
      {isPdfModalOpen && pdfUrl && (
        <PdfViewer
          url={pdfUrl}
          title={fatwa?.title}
          isModal={true}
          onClose={() => setIsPdfModalOpen(false)}
        />
      )}
    </div>
  );
}
