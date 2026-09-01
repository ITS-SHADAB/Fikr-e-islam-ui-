import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import {
  Calendar,
  Eye,
  ArrowRight,
  ArrowLeft,
  Bookmark,
  HelpCircle,
  FileText,
  Download,
  ExternalLink,
  Share2,
  Copy,
  Check,
  Printer,
  Scale,
  Tag,
  ChevronDown,
  MessageSquare,
  Maximize2,
  Minimize2,
} from "lucide-react";
import { getFatwaBySlug, getFatwas } from "@/services";
import { useSettings } from "@/hooks/useSettings";
import { FatwaCard, PdfViewer } from "@/components";
import CommentsSection from "@/components/CommentsSection";
import { FATWA_CATEGORY_TRANSLATIONS } from "@/utils/categories";
import { COLORS } from "@/utils/themeColors";
import toast from "react-hot-toast";

export default function FatwaDetail() {
  const { slug } = useParams();
  const { settings } = useSettings();
  const language =
    settings?.language === "ur" || settings?.language === "Urdu" ? "ur" : "en";
  const isRTL = language === "ur";

  const [fatwa, setFatwa] = useState(null);
  const [related, setRelated] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isPdfModalOpen, setIsPdfModalOpen] = useState(false);
  const [showEmbeddedPdf, setShowEmbeddedPdf] = useState(false);
  const [copied, setCopied] = useState(false);
  const [isCommentsOpen, setIsCommentsOpen] = useState(false);

  useEffect(() => {
    const loadFatwa = async () => {
      try {
        setLoading(true);
        setError(null);
        window.scrollTo({ top: 0, behavior: "smooth" });

        let activeSlug = slug;

        // If parameter is a 24-character ObjectID hex representation, resolve to slug
        if (/^[0-9a-fA-F]{24}$/.test(slug)) {
          const res = await getFatwas({ limit: 1000 });
          const matched = res?.fatwas?.find((f) => f?._id === slug);
          if (matched?.slug) {
            activeSlug = matched.slug;
          }
        }

        const data = await getFatwaBySlug(activeSlug);
        const fatwaData = data?.fatwa || data;
        setFatwa(fatwaData);

        if (data?.related && data?.related?.length > 0) {
          setRelated(data.related);
        } else if (fatwaData?.category) {
          try {
            const allRes = await getFatwas({
              category: fatwaData?.category,
              limit: 4,
            });
            const others = (allRes?.fatwas || [])?.filter(
              (f) => f?._id !== fatwaData?._id
            );
            setRelated(others?.slice(0, 3) || []);
          } catch (rErr) {
            console.warn("Failed to load related fatwas", rErr);
          }
        }
      } catch (err) {
        setError(
          err?.response?.data?.message ||
            err?.message ||
            (isRTL ? "فتویٰ لوڈ کرنے میں ناکامی" : "Failed to load fatwa")
        );
      } finally {
        setLoading(false);
      }
    };

    if (slug) loadFatwa();
  }, [slug, isRTL]);

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
        className="min-h-screen flex flex-col items-center justify-center gap-4"
        style={{ backgroundColor: COLORS?.background }}
      >
        <div
          className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2"
          style={{ borderColor: COLORS?.primary }}
        />
        <span
          className="text-sm font-medium"
          style={{ color: COLORS?.textSecondary }}
        >
          {isRTL ? "فتویٰ لوڈ ہو رہا ہے..." : "Loading fatwa..."}
        </span>
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
          className="text-sm max-w-md mb-6"
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

  const pdfUrl =
    fatwa?.pdf?.url || (typeof fatwa?.pdf === "string" ? fatwa?.pdf : null);
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

  return (
    <div
      dir={isRTL ? "rtl" : "ltr"}
      style={{ backgroundColor: COLORS?.background }}
    >
      {/* ══════════════════════════════════════════════════════════════
          HERO BANNER — Ruling headline & category
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
                  {isRTL ? "تاریخ صدور:" : "Issued:"} {formattedDate}
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
            <span className="flex items-center gap-1.5">
              <span
                className="w-2 h-2 rounded-full inline-block"
                style={{ backgroundColor: COLORS?.accent }}
              />
              <span>{isRTL ? "دار الافتاء و التحقیق" : "Darul Ifta"}</span>
            </span>
          </div>
        </div>
      </div>

      {/* ══════════════════════════════════════════════════════════════
          MAIN ARTICLE COLUMN
      ══════════════════════════════════════════════════════════════ */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8 sm:py-12">
        {/* Actions Bar (Back link, Copy, Share, Print) */}
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
            <span>{isRTL ? "تمام فتاویٰ کی فہرست" : "All Fatwas"}</span>
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
                <Copy className="w-3.5 h-3.5" />
              )}
              <span>
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
              className="flex items-center gap-1.5 text-xs font-semibold px-3 py-2 rounded-xl border cursor-pointer transition-colors"
              style={{
                borderColor: "#bbf7d0",
                color: "#15803d",
                backgroundColor: "#f0fdf4",
              }}
            >
              <Share2 className="w-3.5 h-3.5" />
              <span>{isRTL ? "واٹس ایپ" : "WhatsApp"}</span>
            </button>

            <button
              onClick={() => window?.print()}
              className="flex items-center gap-1.5 text-xs font-semibold p-2.5 rounded-xl border cursor-pointer hover:bg-white transition-colors"
              style={{
                borderColor: COLORS?.border,
                color: COLORS?.textSecondary,
              }}
              title={isRTL ? "پرنٹ کریں" : "Print"}
            >
              <Printer className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* ── 1. The Question Block ── */}
        <div
          className="rounded-2xl p-5 sm:p-7 mb-8 shadow-xs border"
          style={{
            backgroundColor: `${COLORS?.secondary}45`,
            borderColor: COLORS?.border,
            borderRight: isRTL ? `5px solid ${COLORS?.accent}` : undefined,
            borderLeft: !isRTL ? `5px solid ${COLORS?.accent}` : undefined,
          }}
        >
          <div className="flex items-center gap-2 mb-3">
            <div
              className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0"
              style={{
                backgroundColor: COLORS?.primary,
                color: COLORS?.accent,
              }}
            >
              <HelpCircle className="w-4 h-4" />
            </div>
            <div>
              <span
                className="text-xs font-bold uppercase tracking-wider block font-serif"
                style={{ color: COLORS?.primary }}
              >
                {isRTL ? "سائل کا دریافت کردہ سوال" : "Question Asked"}
              </span>
            </div>
          </div>
          <p
            className="text-sm sm:text-base leading-[2.2] font-medium"
            style={{ color: COLORS?.textPrimary }}
          >
            "{fatwa?.question}"
          </p>
        </div>

        {/* ── 2. The Formal Shariah Answer & Ruling ── */}
        <div
          className="rounded-2xl border p-6 sm:p-9 mb-8 shadow-sm"
          style={{
            backgroundColor: COLORS?.white,
            borderColor: COLORS?.border,
          }}
        >
          {/* Answer Heading & Invocations */}
          <div
            className="pb-4 mb-6 border-b flex flex-col sm:flex-row sm:items-center justify-between gap-3"
            style={{ borderColor: COLORS?.border }}
          >
            <div className="flex items-center gap-2.5">
              <div
                className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0"
                style={{
                  backgroundColor: `${COLORS?.primary}15`,
                  color: COLORS?.primary,
                }}
              >
                <Scale className="w-4 h-4" />
              </div>
              <h2
                className="text-base sm:text-lg font-bold font-serif"
                style={{ color: COLORS?.primary }}
              >
                {isRTL
                  ? "الجواب وباللہ التوفیق (شرعی فتویٰ)"
                  : "Shariah Ruling & Fatwa"}
              </h2>
            </div>

            <span
              className="text-sm quran-font font-semibold"
              style={{ color: COLORS?.accent }}
            >
              بسم الله الرحمن الرحيم
            </span>
          </div>

          {/* Answer Prose / Summary */}
          <div
            className="text-sm sm:text-base leading-[2.4] font-normal whitespace-pre-line break-words"
            style={{ color: COLORS?.textPrimary }}
          >
            {fatwa?.summary ||
              (isRTL
                ? "تفصیلی فتویٰ کا متن درج نہیں ہے۔"
                : "No fatwa summary available.")}
          </div>

          {/* Concluding Signature */}
          <div
            className="pt-6 mt-8 border-t flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs"
            style={{
              borderColor: `${COLORS?.border}80`,
              color: COLORS?.textSecondary,
            }}
          >
            <span
              className="font-serif font-bold"
              style={{ color: COLORS?.primary }}
            >
              واللہ تعالٰی اعلم بالصواب
            </span>
            <span>
              {isRTL
                ? "دار الافتاء — جامعہ دار العلوم"
                : "Darul Ifta — Islamic Jurisprudence Council"}
            </span>
          </div>
        </div>

        {/* ── 3. Classical References List ── */}
        {fatwa?.references && fatwa?.references?.length > 0 && (
          <div
            className="rounded-2xl p-5 sm:p-6 mb-8 border"
            style={{
              backgroundColor: COLORS?.white,
              borderColor: COLORS?.border,
            }}
          >
            <h3
              className="text-sm font-bold font-serif mb-3.5 flex items-center gap-2"
              style={{ color: COLORS?.primary }}
            >
              <Bookmark className="w-4 h-4 text-accent" />
              <span>
                {isRTL
                  ? "علمی حوالہ جات و کتبِ فقہ"
                  : "Academic References & Sources"}
              </span>
            </h3>
            <ul className="list-disc list-inside space-y-2 text-xs sm:text-sm text-slate-700">
              {fatwa?.references?.map((ref, idx) => (
                <li key={idx} className="leading-relaxed font-light">
                  {ref}
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* ── 4. Subject Tags ── */}
        {fatwa?.tags && fatwa?.tags?.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-8">
            {fatwa?.tags?.map((t, idx) => (
              <span
                key={idx}
                className="inline-flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-xl font-medium border"
                style={{
                  backgroundColor: COLORS?.white,
                  borderColor: COLORS?.border,
                  color: COLORS?.textSecondary,
                }}
              >
                <Tag className="w-3 h-3 opacity-60" />
                <span>{t}</span>
              </span>
            ))}
          </div>
        )}

        {/* ── 5. PDF Section ── */}
        {pdfUrl && (
          <div
            className="rounded-2xl border p-5 sm:p-6 mb-8 shadow-xs"
            style={{
              backgroundColor: COLORS?.white,
              borderColor: COLORS?.border,
            }}
          >
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div>
                <h3
                  className="font-bold text-base font-serif mb-1"
                  style={{ color: COLORS?.primary }}
                >
                  {isRTL
                    ? "مہر و دستخط شدہ فتویٰ (PDF)"
                    : "Official Signed Fatwa (PDF)"}
                </h3>
                <p className="text-xs" style={{ color: COLORS?.textSecondary }}>
                  {isRTL
                    ? "دارالافتاء کا جاری کردہ اصل مہر شدہ فتویٰ آن لائن دیکھیں یا ڈاؤن لوڈ کریں۔"
                    : "View or download the official stamped fatwa document in PDF format."}
                </p>
              </div>

              <div className="flex flex-wrap items-center gap-2">
                <button
                  type="button"
                  onClick={() => setIsPdfModalOpen(true)}
                  className="flex items-center gap-2 px-4 py-2.5 text-xs font-bold text-white rounded-xl cursor-pointer hover:opacity-90 transition-opacity"
                  style={{ backgroundColor: COLORS?.primary }}
                >
                  <ExternalLink className="w-3.5 h-3.5 text-accent" />
                  <span>{isRTL ? "آن لائن پڑھیں" : "Read Online"}</span>
                </button>

                <button
                  type="button"
                  onClick={() => setShowEmbeddedPdf(!showEmbeddedPdf)}
                  className="flex items-center gap-2 px-4 py-2.5 text-xs font-bold rounded-xl border cursor-pointer transition-colors hover:bg-slate-50"
                  style={{
                    borderColor: COLORS?.accent,
                    color: COLORS?.primary,
                    backgroundColor: showEmbeddedPdf
                      ? `${COLORS?.secondary}50`
                      : "transparent",
                  }}
                >
                  {showEmbeddedPdf ? (
                    <Minimize2 className="w-3.5 h-3.5" />
                  ) : (
                    <Maximize2 className="w-3.5 h-3.5" />
                  )}
                  <span>
                    {showEmbeddedPdf
                      ? isRTL
                        ? "قاری بند کریں"
                        : "Hide Reader"
                      : isRTL
                        ? "صفحہ پر پڑھیں"
                        : "Read Here"}
                  </span>
                </button>

                <a
                  href={pdfUrl}
                  download
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 px-4 py-2.5 text-xs font-semibold rounded-xl border cursor-pointer transition-colors hover:bg-slate-50"
                  style={{
                    borderColor: COLORS?.border,
                    color: COLORS?.textSecondary,
                  }}
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>{isRTL ? "ڈاؤن لوڈ" : "Download"}</span>
                </a>
              </div>
            </div>

            {/* Embedded PDF Viewer */}
            {showEmbeddedPdf && (
              <div
                className="mt-5 rounded-xl overflow-hidden border"
                style={{ height: "700px", borderColor: COLORS?.border }}
              >
                <PdfViewer url={pdfUrl} title={fatwa?.title} isModal={false} />
              </div>
            )}
          </div>
        )}

        {/* ── 6. Comments Accordion ── */}
        <div
          className="rounded-2xl border overflow-hidden mb-8"
          style={{
            backgroundColor: COLORS?.white,
            borderColor: COLORS?.border,
          }}
        >
          <button
            type="button"
            onClick={() => setIsCommentsOpen((v) => !v)}
            className="w-full flex items-center justify-between gap-3 px-5 py-4 cursor-pointer transition-colors hover:bg-slate-50"
            style={{
              borderBottom: isCommentsOpen
                ? `1px solid ${COLORS?.border}`
                : "none",
            }}
          >
            <div className="flex items-center gap-3">
              <div
                className="w-9 h-9 rounded-xl flex items-center justify-center"
                style={{
                  backgroundColor: isCommentsOpen
                    ? COLORS?.primary
                    : `${COLORS?.primary}12`,
                  color: isCommentsOpen ? COLORS?.accent : COLORS?.primary,
                }}
              >
                <MessageSquare className="w-4 h-4" />
              </div>
              <div className="text-right">
                <span
                  className="text-sm font-bold block font-serif"
                  style={{ color: COLORS?.primary }}
                >
                  {isRTL ? "تبصرے و آراء" : "Comments & Discussion"}
                </span>
                <span
                  className="text-[11px]"
                  style={{ color: COLORS?.textSecondary }}
                >
                  {isRTL
                    ? isCommentsOpen
                      ? "تبصرے بند کریں"
                      : "تبصرہ لکھیں اور آراء دیکھیں"
                    : isCommentsOpen
                      ? "Hide comments"
                      : "View and post comments"}
                </span>
              </div>
            </div>
            <ChevronDown
              className={`w-4 h-4 transition-transform duration-300 shrink-0 ${
                isCommentsOpen ? "rotate-180" : ""
              }`}
              style={{ color: COLORS?.textSecondary }}
            />
          </button>

          {isCommentsOpen && (
            <div className="p-4 sm:p-6">
              <CommentsSection
                contentType="fatwa"
                contentId={fatwa?._id}
                language={language}
              />
            </div>
          )}
        </div>

        {/* ── 7. Related Fatwas ── */}
        {related && related?.length > 0 && (
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
                <span>{isRTL ? "متعلقہ فتاویٰ" : "Related Fatwas"}</span>
              </h2>
              <Link
                to="/fatwas"
                className="text-xs font-bold hover:underline"
                style={{ color: COLORS?.accent }}
              >
                {isRTL ? "سب دیکھیں ←" : "View All →"}
              </Link>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              {related?.map((relFatwa) => (
                <FatwaCard key={relFatwa?._id} fatwa={relFatwa} />
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Fullscreen PDF Modal */}
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
