import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  Calendar,
  Folder,
  Bookmark,
  Share2,
  BookOpen,
  ArrowLeft,
  ArrowRight,
} from "lucide-react";
import toast from "react-hot-toast";
import { useSettings } from "@/hooks/useSettings";
import { QA_TRANSLATIONS, FATWA_TRANSLATIONS } from "@/utils/categories";

function stripHtml(html) {
  if (!html) return "";
  return html.replace(/<[^>]*>?/gm, "").trim();
}

export default function QaCard({ question }) {
  const { settings } = useSettings();
  const language =
    settings?.language === "ur" || settings?.language === "Urdu" ? "ur" : "en";
  const isRTL = language === "ur";

  const [isBookmarked, setIsBookmarked] = useState(false);

  if (!question) return null;

  const _id = question?._id || "";
  const slug = question?.slug || _id;
  const qaDetailUrl = `/qa/${slug}`;
  const title = question?.questionTitle || question?.title || "";
  const category = question?.category || "";
  const date =
    question?.answeredAt || question?.updatedAt || question?.createdAt;

  // Category translation
  const categoryLabel = isRTL
    ? QA_TRANSLATIONS[category] ||
      FATWA_TRANSLATIONS[category] ||
      category ||
      "عام معلومات"
    : category || "General";

  // Formatted date (e.g., 23 ستمبر 2026)
  const formattedDate = date
    ? new Date(date).toLocaleDateString(isRTL ? "ur-PK" : "en-US", {
        day: "numeric",
        month: "long",
        year: "numeric",
      })
    : "";

  // Answer / question snippet preview
  const rawText =
    question?.detailedQuestion || stripHtml(question?.answerContent) || "";
  const previewText = rawText
    ? rawText.length > 140
      ? `${rawText.slice(0, 140)}...`
      : rawText
    : "";

  // Bookmark sync with localStorage
  useEffect(() => {
    if (!_id) return;
    try {
      const saved = localStorage.getItem(`bookmarked_qa_${_id}`);
      if (saved === "true") setIsBookmarked(true);
    } catch {}
  }, [_id]);

  const handleToggleBookmark = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsBookmarked((prev) => {
      const next = !prev;
      try {
        localStorage.setItem(`bookmarked_qa_${_id}`, String(next));
        toast.success(
          next
            ? isRTL
              ? "سوال بک مارک کر لیا گیا"
              : "Question bookmarked"
            : isRTL
            ? "بک مارک ہٹا دیا گیا"
            : "Bookmark removed"
        );
      } catch {}
      return next;
    });
  };

  const handleShare = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    const shareUrl = `${window.location.origin}/qa/${slug}`;
    if (navigator.share) {
      try {
        await navigator.share({
          title: title || "سوال و جواب",
          text: title,
          url: shareUrl,
        });
      } catch {}
    } else {
      try {
        await navigator.clipboard.writeText(shareUrl);
        toast.success(isRTL ? "لنک کاپی ہو گیا!" : "Link copied!");
      } catch {
        toast.error("Sharing not supported");
      }
    }
  };

  return (
    <article
      className="group relative rounded-[20px] sm:rounded-[24px] p-3.5 sm:p-4.5 md:p-5 transition-all duration-300 overflow-hidden border shadow-[0_4px_20px_rgba(43,33,24,0.06),0_1px_4px_rgba(43,33,24,0.03)] hover:shadow-[0_10px_28px_rgba(43,33,24,0.09)] hover:border-[#C8A46A]/70 flex flex-col justify-between"
      style={{
        background:
          "linear-gradient(175deg, #FCF9F2 0%, #F9F3E8 60%, #F4ECE0 100%)",
        borderColor: "rgba(200, 164, 106, 0.45)",
      }}
      dir={isRTL ? "rtl" : "ltr"}
    >
      {/* ── Background Subtle Islamic Geometric Watermark ── */}
      <div className="absolute inset-0 opacity-[0.03] pointer-events-none select-none overflow-hidden">
        <svg
          className="w-full h-full"
          viewBox="0 0 400 400"
          fill="none"
          stroke="#2B2118"
        >
          <pattern
            id="islamic-qa-pattern"
            x="0"
            y="0"
            width="80"
            height="80"
            patternUnits="userSpaceOnUse"
          >
            <path d="M40 0 L80 40 L40 80 L0 40 Z" strokeWidth="1" />
            <circle cx="40" cy="40" r="28" strokeWidth="1" />
            <path d="M40 12 L68 40 L40 68 L12 40 Z" strokeWidth="0.8" />
          </pattern>
          <rect width="100%" height="100%" fill="url(#islamic-qa-pattern)" />
        </svg>
      </div>

      {/* ── Top Golden Ambient Arch Glow ── */}
      <div
        className="absolute -top-12 left-1/2 -translate-x-1/2 w-48 sm:w-64 h-24 rounded-full pointer-events-none filter blur-xl opacity-25"
        style={{
          background:
            "radial-gradient(circle, rgba(200, 164, 106, 0.8) 0%, transparent 70%)",
        }}
      />

      <div className="relative z-10 flex flex-col">
        {/* ══════════════════════════════════════════════════════════════
            1. TOP METADATA ROW: Date & Category on LEFT, Icons on RIGHT
        ══════════════════════════════════════════════════════════════ */}
        <div className="flex items-center justify-between gap-2 select-none mb-1.5 [direction:ltr]">
          {/* Metadata: Date and Category Pill on the LEFT */}
          <div className="flex items-center gap-1.5 sm:gap-2 flex-wrap min-w-0 [direction:rtl]">
            {/* Date with Calendar Icon */}
            {formattedDate && (
              <div className="flex items-center gap-1 text-[11px] sm:text-xs font-['Payami_Nastaleeq',serif] text-[#5A4638] shrink-0">
                <Calendar className="w-3.5 h-3.5 text-[#8C5E28] shrink-0" />
                <span className="font-semibold pt-0.5">{formattedDate}</span>
              </div>
            )}

            {formattedDate && (
              <span className="text-[#C8A46A]/40 text-xs select-none">|</span>
            )}

            {/* Category Pill */}
            <div className="inline-flex items-center gap-1 px-2.5 py-0.5 sm:px-3 sm:py-0.75 rounded-full bg-[#F3E8DC] border border-[#C8A46A]/45 text-[#4A321A] text-[11px] sm:text-xs font-['Payami_Nastaleeq',serif] font-bold shadow-2xs">
              <Folder className="w-3 h-3 text-[#8C5E28] shrink-0" />
              <span className="pt-0.5">{categoryLabel}</span>
            </div>
          </div>

          {/* Action Buttons: Bookmark & Share on the RIGHT */}
          <div className="flex items-center gap-1.5 shrink-0 [direction:ltr]">
            {/* Bookmark Button */}
            <button
              type="button"
              onClick={handleToggleBookmark}
              className="w-7.5 h-7.5 sm:w-8 sm:h-8 rounded-full flex items-center justify-center border transition-all duration-200 cursor-pointer shadow-2xs hover:scale-105 active:scale-95"
              style={{
                backgroundColor: isBookmarked ? "#F3E6D5" : "#FAF4EB",
                borderColor: "rgba(168, 121, 62, 0.4)",
                color: "#8C5E28",
              }}
              title={isBookmarked ? "بک مارک ہٹائیں" : "بک مارک کریں"}
              aria-label="Bookmark question"
            >
              <Bookmark
                className={`w-3.5 h-3.5 transition-colors ${
                  isBookmarked
                    ? "fill-[#A8793E] text-[#A8793E]"
                    : "text-[#8C5E28]"
                }`}
              />
            </button>

            {/* Share Button */}
            <button
              type="button"
              onClick={handleShare}
              className="w-7.5 h-7.5 sm:w-8 sm:h-8 rounded-full flex items-center justify-center border transition-all duration-200 cursor-pointer shadow-2xs hover:scale-105 active:scale-95"
              style={{
                backgroundColor: "#FAF4EB",
                borderColor: "rgba(168, 121, 62, 0.4)",
                color: "#8C5E28",
              }}
              title="شیئر کریں"
              aria-label="Share question"
            >
              <Share2 className="w-3.5 h-3.5 text-[#8C5E28]" />
            </button>
          </div>
        </div>

        {/* ══════════════════════════════════════════════════════════════
            2. ORNAMENTAL "سوال" BADGE (Centered with Flanking Lines)
        ══════════════════════════════════════════════════════════════ */}
        <div className="flex items-center justify-center gap-1.5 sm:gap-2 my-2 sm:my-2.5 relative z-10 select-none">
          {/* Flanking line right */}
          <div className="flex-1 flex items-center justify-end overflow-hidden">
            <div className="h-[1px] w-full max-w-[120px] bg-gradient-to-l from-[#C8A46A]/70 via-[#C8A46A]/30 to-transparent" />
            <span className="text-[#C8A46A] text-[9px] sm:text-[10px] mx-1">
              ❖
            </span>
          </div>

          {/* Ornamental Question Badge */}
          <div
            className="inline-flex items-center gap-1.5 px-3 py-0.5 sm:px-3.5 sm:py-1 rounded-full shadow-xs border"
            style={{
              backgroundColor: "#5C3A1E",
              borderColor: "#C8A46A",
            }}
          >
            <span className="w-4 h-4 rounded-full bg-white text-[#5C3A1E] font-bold text-[11px] flex items-center justify-center shrink-0 shadow-2xs">
              ?
            </span>
            <span className="text-[#FAF4EB] text-xs sm:text-[13px] font-bold font-['Payami_Nastaleeq',serif] pt-0.5 leading-none">
              {isRTL ? "سوال" : "Question"}
            </span>
          </div>

          {/* Flanking line left */}
          <div className="flex-1 flex items-center justify-start overflow-hidden">
            <span className="text-[#C8A46A] text-[9px] sm:text-[10px] mx-1">
              ❖
            </span>
            <div className="h-[1px] w-full max-w-[120px] bg-gradient-to-r from-[#C8A46A]/70 via-[#C8A46A]/30 to-transparent" />
          </div>
        </div>

        {/* ══════════════════════════════════════════════════════════════
            3. MAIN QUESTION WITH FLOATING QUOTES
        ══════════════════════════════════════════════════════════════ */}
        <div className="relative text-center my-1 px-1 sm:px-2">
          <div className="flex items-center justify-center gap-1.5 sm:gap-2">
            <span className="text-[#DFC07C]/50 text-2xl sm:text-3xl font-serif select-none leading-none shrink-0">
              “
            </span>
            <Link to={qaDetailUrl} className="block group/q flex-1 min-w-0">
              <h3 className="text-base xs:text-lg sm:text-[19px] md:text-[20px] font-bold font-['Payami_Nastaleeq',serif] leading-[1.55] sm:leading-[1.6] text-center text-[#1E140C] group-hover/q:text-[#8C5E28] transition-colors line-clamp-2 break-words">
                {title}
              </h3>
            </Link>
            <span className="text-[#DFC07C]/50 text-2xl sm:text-3xl font-serif select-none leading-none shrink-0">
              ”
            </span>
          </div>
        </div>

        {/* ══════════════════════════════════════════════════════════════
            4. DELICATE ROSETTE DIVIDER
        ══════════════════════════════════════════════════════════════ */}
        <div className="flex items-center justify-center gap-2 my-1.5 select-none overflow-hidden max-w-full">
          <div className="h-[1px] w-10 sm:w-16 bg-gradient-to-r from-transparent to-[#C5A87C]/70" />
          <svg
            viewBox="0 0 24 24"
            className="w-3 h-3 text-[#A8793E] shrink-0"
            fill="currentColor"
          >
            <path d="M12 2 L14.5 9.5 L22 12 L14.5 14.5 L12 22 L9.5 14.5 L2 12 L9.5 9.5 Z" />
          </svg>
          <div className="h-[1px] w-10 sm:w-16 bg-gradient-to-l from-transparent to-[#C5A87C]/70" />
        </div>

        {/* ══════════════════════════════════════════════════════════════
            5. ANSWER PREVIEW BOX (With Gold Accent Bar)
        ══════════════════════════════════════════════════════════════ */}
        {previewText && (
          <div
            className="relative rounded-xl sm:rounded-2xl p-2.5 sm:p-3 my-1 border overflow-hidden"
            style={{
              backgroundColor: "rgba(245, 239, 229, 0.75)",
              borderColor: "rgba(222, 205, 187, 0.7)",
            }}
          >
            {/* Vertical Gold Accent Bar on Right (or Left if LTR) */}
            <span
              className={`absolute ${
                isRTL ? "right-0 rounded-l-full" : "left-0 rounded-r-full"
              } top-2 bottom-2 w-1`}
              style={{ backgroundColor: "#A8793E" }}
            />
            <p
              className={`text-xs sm:text-[12.5px] font-['Payami_Nastaleeq',serif] leading-[1.75] sm:leading-[1.8] text-[#3D2B1C] line-clamp-2 font-normal break-words ${
                isRTL ? "text-right pr-2" : "text-left pl-2"
              }`}
            >
              {previewText}
            </p>
          </div>
        )}
      </div>

      {/* ══════════════════════════════════════════════════════════════
          6. CTA BUTTON: "مکمل جواب پڑھیں ←" on the LEFT SIDE
      ══════════════════════════════════════════════════════════════ */}
      <div className="flex items-center justify-start [direction:ltr] mt-2.5 pt-1 relative z-10">
        <Link
          to={qaDetailUrl}
          className="inline-flex items-center gap-2 px-3.5 py-1.5 sm:px-4 sm:py-2 rounded-full border transition-all duration-200 shadow-xs hover:shadow-sm hover:brightness-105 active:scale-[0.98] group/btn cursor-pointer select-none [direction:ltr]"
          style={{
            background: "linear-gradient(135deg, #70451B 0%, #4D2E0E 100%)",
            borderColor: "rgba(200, 164, 106, 0.5)",
          }}
        >
          <BookOpen className="w-3.5 h-3.5 text-[#DFC07C] shrink-0" />
          <ArrowLeft className="w-3.5 h-3.5 text-[#DFC07C] shrink-0 group-hover/btn:-translate-x-0.5 transition-transform" />
          <span className="text-[#FAF4EB] text-xs sm:text-[12.5px] font-bold font-['Payami_Nastaleeq',serif] pt-0.5 leading-none">
            {isRTL ? "مکمل جواب پڑھیں" : "Read Full Answer"}
          </span>
        </Link>
      </div>
    </article>
  );
}
