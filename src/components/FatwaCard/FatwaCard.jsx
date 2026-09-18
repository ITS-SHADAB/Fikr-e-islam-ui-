import React, { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { Link } from "react-router-dom";
import {
  Calendar,
  Eye,
  Tag,
  ArrowLeft,
  ArrowRight,
  Scale,
  BookOpen,
  FileText,
  Share2,
  Bookmark,
  Copy,
  Check,
  ExternalLink,
  X,
} from "lucide-react";
import { FaWhatsapp } from "react-icons/fa";
import { toast } from "react-hot-toast";
import { useSettings } from "@/hooks/useSettings";
import { FATWA_CATEGORY_TRANSLATIONS } from "@/utils/categories";

export default function FatwaCard({ fatwa }) {
  const { settings } = useSettings();
  const language =
    settings?.language === "ur" || settings?.language === "Urdu" ? "ur" : "en";
  const isRTL = language === "ur";
  const [isSaved, setIsSaved] = useState(false);
  const [showShareModal, setShowShareModal] = useState(false);

  // Close share modal on Escape key
  useEffect(() => {
    if (!showShareModal) return;
    const handleKeyDown = (e) => {
      if (e.key === "Escape") setShowShareModal(false);
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [showShareModal]);

  if (!fatwa) return null;

  const slug = fatwa?.slug;
  const title = fatwa?.title;
  const category = fatwa?.category;
  const question = fatwa?.question;
  const summary = fatwa?.summary;
  const publishDate = fatwa?.publishDate;
  const viewCount = fatwa?.viewCount || 0;
  const tags = Array.isArray(fatwa?.tags) ? fatwa.tags : [];

  const categoryLabel =
    FATWA_CATEGORY_TRANSLATIONS?.[category] ||
    category ||
    (isRTL ? "عام" : "General");

  const formattedDate = publishDate
    ? new Date(publishDate).toLocaleDateString(isRTL ? "ur-PK" : "en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
      })
    : "";

  // Short previews for compact card height
  const answerPreview = summary
    ? summary.length > 130
      ? `${summary.slice(0, 130)}...`
      : summary
    : "";

  const questionPreview = question
    ? question.length > 120
      ? `${question.slice(0, 120)}...`
      : question
    : "";

  const fatwaIdentifier = slug || fatwa?._id || "";
  const fullShareUrl =
    typeof window !== "undefined" && window?.location?.origin
      ? `${window.location.origin}/fatwas/${fatwaIdentifier}`
      : `https://fikr-e-islam.com/fatwas/${fatwaIdentifier}`;

  const handleWhatsAppShare = (e) => {
    e?.preventDefault();
    e?.stopPropagation();
    setShowShareModal(false);
    const whatsappMessage = `${
      title ? title + "\n\n" : ""
    }مکمل فتویٰ پڑھیں:\n${fullShareUrl}`;
    const whatsappUrl = `https://api.whatsapp.com/send?text=${encodeURIComponent(
      whatsappMessage
    )}`;
    window.open(whatsappUrl, "_blank", "noopener,noreferrer");
  };

  const handleCopyLink = (e) => {
    e?.preventDefault();
    e?.stopPropagation();

    let copied = false;
    if (navigator?.clipboard?.writeText) {
      try {
        navigator.clipboard.writeText(fullShareUrl);
        copied = true;
      } catch {
        copied = false;
      }
    }

    if (!copied) {
      try {
        const textArea = document.createElement("textarea");
        textArea.value = fullShareUrl;
        textArea.style.position = "fixed";
        textArea.style.top = "-9999px";
        textArea.style.left = "-9999px";
        document.body.appendChild(textArea);
        textArea.focus();
        textArea.select();
        copied = document.execCommand("copy");
        document.body.removeChild(textArea);
      } catch (err) {
        console.error("Fallback copy failed", err);
      }
    }

    toast.success(isRTL ? "لنک کاپی ہو گیا!" : "Link copied!");
    setShowShareModal(false);
  };

  const handleNativeShare = async (e) => {
    e?.preventDefault();
    e?.stopPropagation();
    setShowShareModal(false);
    if (typeof navigator !== "undefined" && navigator.share) {
      try {
        await navigator.share({
          title: title,
          text: title,
          url: fullShareUrl,
        });
      } catch {
        // User cancelled share dialog
      }
    }
  };

  const handleBookmark = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsSaved((prev) => {
      const next = !prev;
      toast.success(
        next
          ? isRTL
            ? "فتویٰ محفوظ کر لیا گیا!"
            : "Fatwa bookmarked!"
          : isRTL
          ? "فتویٰ ہٹا دیا گیا!"
          : "Bookmark removed!"
      );
      return next;
    });
  };

  return (
    <article
      dir={isRTL ? "rtl" : "ltr"}
      className="group relative flex flex-col h-full rounded-[22px] sm:rounded-[26px] border border-[#DECDBB] bg-gradient-to-b from-[#FAF7F2] via-[#FAF6EF] to-[#F5EEE3] overflow-hidden transition-all duration-300 hover:border-[#A8793E] hover:shadow-[0_12px_32px_rgba(43,33,24,0.12)] hover:-translate-y-1 p-3.5 sm:p-4 md:p-4.5 gap-2.5 sm:gap-3"
    >
      {/* ── 1. Top Meta Header (Category Pill + Date & Views Pill) ── */}
      <div className="flex items-center justify-between gap-2 relative z-10">
        {/* Right (in RTL): Category Pill */}
        <span className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full text-xs font-bold bg-[#2A1D15] text-[#FAF6EF] shadow-2xs">
          <BookOpen className="w-3.5 h-3.5 text-[#DFC8A4]" />
          <span>{categoryLabel}</span>
        </span>

        {/* Left (in RTL): Connected Date & Views Capsule */}
        <div className="inline-flex items-center gap-2 px-2.5 sm:px-3 py-0.5 sm:py-1 rounded-full bg-[#EFE3D5] border border-[#DECDBB] text-[11px] sm:text-xs text-[#5A4535] shadow-2xs">
          {formattedDate && (
            <span className="flex items-center gap-1">
              <Calendar className="w-3 h-3 text-[#8C5E28]" />
              <span>{formattedDate}</span>
            </span>
          )}
          {formattedDate && <div className="w-[1px] h-3 bg-[#DECDBB]" />}
          <span className="flex items-center gap-1">
            <Eye className="w-3 h-3 text-[#8C5E28]" />
            <span>{viewCount}</span>
          </span>
        </div>
      </div>

      {/* ── 2. Title Section with Scales Emblem & Central Floral Flourish ── */}
      <div className="relative z-10 pt-0.5">
        <div className="flex items-center gap-2.5 sm:gap-3">
          {/* Sharia Scales Emblem */}
          <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-full bg-[#EFE3D3] border border-[#DECDBB] text-[#9E6D38] flex items-center justify-center shrink-0 shadow-2xs">
            <Scale className="w-5 h-5 sm:w-5.5 sm:h-5.5" />
          </div>

          {/* Title Text */}
          <h3 className="flex-1 font-bold text-base sm:text-[18px] md:text-[19px] leading-[1.7] font-['Payami_Nastaleeq',serif] text-[#1E1711] line-clamp-2 text-right">
            <Link
              to={`/fatwas/${slug}`}
              className="hover:text-[#8C5E28] transition-colors"
            >
              {title}
            </Link>
          </h3>
        </div>

        {/* Delicate Golden Ornamental Divider */}
        <div className="flex items-center justify-center gap-2 my-1 select-none">
          <div className="h-[1px] w-12 sm:w-16 bg-gradient-to-r from-transparent to-[#C5A87C]" />
          <svg
            viewBox="0 0 24 24"
            className="w-3.5 h-3.5 text-[#A8793E]"
            fill="currentColor"
          >
            <path d="M12 2 L14.5 9.5 L22 12 L14.5 14.5 L12 22 L9.5 14.5 L2 12 L9.5 9.5 Z" />
          </svg>
          <div className="h-[1px] w-12 sm:w-16 bg-gradient-to-l from-transparent to-[#C5A87C]" />
        </div>
      </div>

      {/* ── 3. Question Box (with Top-Right Wave Banner) ── */}
      {questionPreview && (
        <div className="relative overflow-hidden rounded-[16px] sm:rounded-[18px] border border-[#DECDBB] bg-[#FCF9F4] p-3 sm:p-3.5 pt-8 sm:pt-8.5 shadow-2xs">
          {/* Top-Right Dark Brown Wave Shape Banner (Sleek, compact & centered) */}
          <div className="absolute top-0 right-0 z-10 select-none h-7 sm:h-7.5 w-[140px] sm:w-[150px]">
            <svg
              viewBox="0 0 150 30"
              preserveAspectRatio="none"
              className="w-full h-full block"
              fill="#3E2A1D"
            >
              <path d="M0,0 C16,0 20,30 36,30 L150,30 L150,0 Z" />
            </svg>
            <div className="absolute top-0 right-0 h-full w-[105px] sm:w-[115px] flex items-center justify-center gap-2 text-[#FAF6EF] pointer-events-none px-1">
              {/* Question Icon on the RIGHT */}
              <div className="w-4 h-4 rounded-full bg-[#C8A46A] text-[#2B2118] font-bold text-[10px] flex items-center justify-center shrink-0 shadow-xs">
                ?
              </div>
              {/* Text to the left of the icon */}
              <span className="text-[11px] sm:text-[12px] font-bold font-['Payami_Nastaleeq',serif] pt-0.5 leading-none whitespace-nowrap">
                {isRTL ? "سوال کا حوالہ" : "Question Ref"}
              </span>
            </div>
          </div>

          {/* Urdu Question Text (Without quotation marks or left badge) */}
          <p className="text-xs sm:text-[13px] text-[#3A2A1E] font-['Payami_Nastaleeq',serif] leading-[1.8] line-clamp-2 text-right px-3 sm:px-3.5 font-normal">
            {questionPreview}
          </p>
        </div>
      )}

      {/* ── 4. Answer / Summary Box (with Top-Right Wave Banner) ── */}
      {answerPreview && (
        <div className="relative overflow-hidden rounded-[16px] sm:rounded-[18px] border border-[#DECDBB] bg-[#FCF9F4] p-3 sm:p-3.5 pt-8 sm:pt-8.5 shadow-2xs">
          {/* Subtle Islamic Lace Texture Watermark */}
          <div className="absolute -bottom-6 -left-6 w-24 h-24 opacity-[0.05] pointer-events-none select-none">
            <svg viewBox="0 0 100 100" fill="currentColor" className="text-[#3E2A1D]">
              <circle cx="50" cy="50" r="40" stroke="currentColor" strokeWidth="2" fill="none" />
              <path d="M50 10 L62 38 L90 50 L62 62 L50 90 L38 62 L10 50 L38 38 Z" fill="none" stroke="currentColor" strokeWidth="1.5" />
            </svg>
          </div>

          {/* Top-Right Dark Brown Wave Shape Banner (Static decorative banner) */}
          <div className="absolute top-0 right-0 z-10 select-none h-7 sm:h-7.5 w-[135px] sm:w-[145px]">
            <svg
              viewBox="0 0 145 30"
              preserveAspectRatio="none"
              className="w-full h-full block"
              fill="#3E2A1D"
            >
              <path d="M0,0 C16,0 20,30 36,30 L145,30 L145,0 Z" />
            </svg>
            <div className="absolute top-0 right-0 h-full w-[100px] sm:w-[110px] flex items-center justify-center gap-2 text-[#FAF6EF] pointer-events-none px-1">
              {/* Summary Icon on the RIGHT */}
              <div className="w-4 h-4 rounded-full bg-[#C8A46A] text-[#2B2118] flex items-center justify-center shrink-0 shadow-xs">
                <FileText className="w-2.5 h-2.5 text-[#2B2118]" />
              </div>
              {/* Text to the left of the icon */}
              <span className="text-[11px] sm:text-[12px] font-bold font-['Payami_Nastaleeq',serif] pt-0.5 leading-none whitespace-nowrap">
                {isRTL ? "خلاصہ جواب" : "Summary"}
              </span>
            </div>
          </div>

          {/* Urdu Summary Text (Clickable to Fatwa Detail) */}
          <Link
            to={`/fatwas/${slug}`}
            className="block group/summary cursor-pointer"
            title={isRTL ? "مکمل فتویٰ پڑھیں" : "Read Full Fatwa"}
          >
            <p className="text-xs sm:text-[13px] text-[#241A12] group-hover/summary:text-[#8C5E28] font-['Payami_Nastaleeq',serif] leading-[1.8] line-clamp-2 text-right px-3 sm:px-3.5 font-normal transition-colors">
              {answerPreview}
            </p>
          </Link>
        </div>
      )}

      {/* ── 5. Tags Section ── */}
      {tags.length > 0 && (
        <div className="flex flex-wrap items-center justify-start gap-1.5 pt-0.5">
          {tags.slice(0, 3).map((tag, idx) => (
            <span
              key={idx}
              className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-[#EFE3D5] border border-[#DECDBB] text-xs text-[#4A3728] font-medium hover:bg-[#E5D7C7] transition-colors"
            >
              <Tag className="w-3 h-3 text-[#8C5E28]" />
              <span>{tag.startsWith('"') ? tag : `"${tag}"`}</span>
            </span>
          ))}
        </div>
      )}

      {/* ── 6. Footer Action Bar (CTA Button + Share + Bookmark) ── */}
      <div className="pt-2 mt-auto border-t border-[#DECDBB]/60 flex items-center justify-between gap-2">
        {/* Left (in RTL): Primary CTA Button with Rich Gold Gradient */}
        <Link
          to={`/fatwas/${slug}`}
          className="inline-flex items-center gap-1.5 sm:gap-2 px-4 py-1.5 rounded-full bg-gradient-to-r from-[#B58546] via-[#A8793E] to-[#8C5E28] hover:from-[#A07238] hover:to-[#7A4F1E] text-white text-xs font-bold transition-all duration-200 shadow-xs hover:shadow-md cursor-pointer border border-[#C5A87C]/30"
        >
          {isRTL && (
            <ArrowLeft className="w-3.5 h-3.5 transition-transform duration-200 group-hover:-translate-x-0.5" />
          )}
          <span>{isRTL ? "مکمل فتویٰ پڑھیں" : "Read Full Fatwa"}</span>
          {!isRTL && (
            <ArrowRight className="w-3.5 h-3.5 transition-transform duration-200 group-hover:translate-x-0.5" />
          )}
        </Link>

        {/* Right (in RTL): Share & Bookmark Action Pills */}
        <div className="flex items-center gap-1.5">
          {/* Share Button */}
          <button
            type="button"
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              setShowShareModal(true);
            }}
            className="inline-flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-full bg-[#EFE3D5] border border-[#DECDBB] text-xs font-semibold text-[#4A3728] hover:bg-[#E5D7C7] hover:border-[#A8793E]/60 transition-colors cursor-pointer"
            title={isRTL ? "شیئر کریں" : "Share"}
          >
            <Share2 className="w-3.5 h-3.5 text-[#8C5E28]" />
            <span>{isRTL ? "شیئر کریں" : "Share"}</span>
          </button>

          {/* Bookmark Button */}
          <button
            type="button"
            onClick={handleBookmark}
            className={`inline-flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-full border text-xs font-semibold transition-colors cursor-pointer ${
              isSaved
                ? "bg-[#9E6D38] border-[#9E6D38] text-white"
                : "bg-[#EFE3D5] border-[#DECDBB] text-[#4A3728] hover:bg-[#E5D7C7] hover:border-[#A8793E]/60"
            }`}
            title={isRTL ? "محفوظ کریں" : "Save"}
          >
            <Bookmark
              className={`w-3.5 h-3.5 ${
                isSaved ? "text-white fill-white" : "text-[#8C5E28]"
              }`}
            />
            <span>
              {isRTL
                ? isSaved
                  ? "محفوظ"
                  : "محفوظ کریں"
                : isSaved
                ? "Saved"
                : "Save"}
            </span>
          </button>
        </div>
      </div>

      {/* ── Responsive Share Modal Dialog (Rendered via Portal to Document Body) ── */}
      {showShareModal &&
        typeof document !== "undefined" &&
        createPortal(
          <div
            className="fixed inset-0 z-[99999] flex items-center justify-center p-3 sm:p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200"
            onClick={() => setShowShareModal(false)}
            dir={isRTL ? "rtl" : "ltr"}
          >
            <div
              className="relative w-full max-w-[340px] sm:max-w-[380px] rounded-[24px] bg-[#FAF7F2] border border-[#DECDBB] shadow-[0_20px_50px_rgba(43,33,24,0.35)] p-4 sm:p-5 animate-in zoom-in-95 duration-200 text-right select-none"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Modal Header */}
              <div className="flex items-center justify-between pb-3 mb-3.5 border-b border-[#DECDBB]/60">
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-full bg-[#EFE3D5] text-[#8C5E28] flex items-center justify-center shrink-0">
                    <Share2 className="w-3.5 h-3.5" />
                  </div>
                  <h4 className="font-bold text-sm sm:text-base font-['Payami_Nastaleeq',serif] text-[#2A211A] pt-0.5">
                    {isRTL ? "فتویٰ شیئر کریں" : "Share Fatwa"}
                  </h4>
                </div>
                <button
                  type="button"
                  onClick={() => setShowShareModal(false)}
                  className="w-7 h-7 rounded-full bg-[#EFE3D5] hover:bg-[#DECDBB] text-[#5A4535] flex items-center justify-center transition-colors cursor-pointer"
                  title={isRTL ? "بند کریں" : "Close"}
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Title Preview */}
              <p className="text-xs sm:text-[13px] font-medium text-[#3A2A1E] font-['Payami_Nastaleeq',serif] line-clamp-2 leading-[1.7] mb-3.5 bg-[#F3EBE0] p-2.5 rounded-xl border border-[#DECDBB]/70">
                {title}
              </p>

              {/* Direct WhatsApp Share Button */}
              <button
                type="button"
                onClick={handleWhatsAppShare}
                className="w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl bg-[#25D366] hover:bg-[#20bd5a] text-white font-bold text-xs sm:text-sm shadow-xs transition-all cursor-pointer mb-3 active:scale-[0.98]"
              >
                <FaWhatsapp className="w-4.5 h-4.5 text-white shrink-0" />
                <span className="pt-0.5">{isRTL ? "واٹس ایپ پر شیئر کریں" : "Share via WhatsApp"}</span>
              </button>

              {/* URL Preview & Copy Button */}
              <div className="flex items-center gap-1.5 p-1 rounded-xl bg-[#F0EAE1] border border-[#DECDBB]">
                <input
                  type="text"
                  readOnly
                  value={fullShareUrl}
                  className="flex-1 min-w-0 bg-transparent px-2.5 py-1 text-[11px] sm:text-xs text-[#4A3728] focus:outline-none select-all font-mono"
                  dir="ltr"
                />
                <button
                  type="button"
                  onClick={handleCopyLink}
                  className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-[#A8793E] hover:bg-[#8F632E] text-white text-xs font-bold transition-colors cursor-pointer shrink-0 shadow-2xs active:scale-95"
                >
                  <Copy className="w-3.5 h-3.5" />
                  <span>{isRTL ? "کاپی کریں" : "Copy"}</span>
                </button>
              </div>

              {/* Mobile Native Share (if supported) */}
              {typeof navigator !== "undefined" &&
                typeof navigator.share === "function" && (
                  <button
                    type="button"
                    onClick={handleNativeShare}
                    className="w-full flex items-center justify-center gap-1.5 text-xs text-[#8C5E28] hover:text-[#5C3D18] hover:underline font-semibold mt-3 pt-2 border-t border-[#DECDBB]/50 transition-colors cursor-pointer"
                  >
                    <ExternalLink className="w-3 h-3" />
                    <span>{isRTL ? "دیگر ایپس پر شیئر کریں" : "Share via other apps"}</span>
                  </button>
                )}
            </div>
          </div>,
          document.body
        )}
    </article>
  );
}
