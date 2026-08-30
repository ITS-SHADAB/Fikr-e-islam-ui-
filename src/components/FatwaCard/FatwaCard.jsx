import React from "react";
import { Link } from "react-router-dom";
import { Calendar, Eye, Tag, ArrowLeft, ArrowRight, HelpCircle, Scale } from "lucide-react";
import { useSettings } from "@/hooks/useSettings";
import { FATWA_CATEGORY_TRANSLATIONS } from "@/utils/categories";
import { COLORS } from "@/utils/themeColors";

export default function FatwaCard({ fatwa }) {
  const { settings } = useSettings();
  const language =
    settings?.language === "ur" || settings?.language === "Urdu" ? "ur" : "en";
  const isRTL = language === "ur";

  if (!fatwa) return null;

  const slug = fatwa?.slug;
  const title = fatwa?.title;
  const category = fatwa?.category;
  const question = fatwa?.question;
  const summary = fatwa?.summary;
  const publishDate = fatwa?.publishDate;
  const viewCount = fatwa?.viewCount || 0;
  const tags = fatwa?.tags || [];

  const categoryLabel = FATWA_CATEGORY_TRANSLATIONS?.[category] || category || "";

  const formattedDate = publishDate
    ? new Date(publishDate).toLocaleDateString(isRTL ? "ur-PK" : "en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
      })
    : "";

  // Short preview of the answer from summary
  const answerPreview = summary
    ? summary.length > 160
      ? `${summary.slice(0, 160)}...`
      : summary
    : "";

  const questionPreview = question
    ? question.length > 130
      ? `${question.slice(0, 130)}...`
      : question
    : "";

  return (
    <article
      dir={isRTL ? "rtl" : "ltr"}
      className="group flex flex-col rounded-2xl border overflow-hidden transition-all duration-300 hover:shadow-lg"
      style={{
        backgroundColor: COLORS?.white,
        borderColor: COLORS?.border,
        boxShadow: "0 1px 4px rgba(74,55,40,0.06)",
      }}
    >
      {/* ── Category & Meta Header ── */}
      <div
        className="flex items-center justify-between px-4 py-3 border-b"
        style={{
          backgroundColor: `${COLORS?.primary}08`,
          borderColor: `${COLORS?.border}90`,
        }}
      >
        <span
          className="text-[10px] font-bold px-2.5 py-1 rounded-full"
          style={{ backgroundColor: COLORS?.secondary, color: COLORS?.primary }}
        >
          {categoryLabel}
        </span>
        <div
          className="flex items-center gap-3 text-[11px]"
          style={{ color: COLORS?.textSecondary }}
        >
          {formattedDate && (
            <span className="flex items-center gap-1">
              <Calendar className="w-3 h-3" />
              {formattedDate}
            </span>
          )}
          {viewCount > 0 && (
            <span className="flex items-center gap-1">
              <Eye className="w-3 h-3" />
              {viewCount}
            </span>
          )}
        </div>
      </div>

      {/* ── Card Body ── */}
      <div className="flex flex-col flex-1 p-4 sm:p-5 gap-3">
        {/* Title (Fatwa ruling headline) */}
        <Link to={`/fatwas/${slug}`}>
          <h3
            className="font-bold text-sm sm:text-base leading-[1.85] font-serif line-clamp-2 group-hover:underline"
            style={{ color: COLORS?.primary }}
          >
            <Scale
              className="w-3.5 h-3.5 inline-block mb-0.5 opacity-70"
              style={{ color: COLORS?.accent, marginLeft: isRTL ? "6px" : "0", marginRight: !isRTL ? "6px" : "0" }}
            />
            {title}
          </h3>
        </Link>

        {/* Question block */}
        {questionPreview && (
          <div
            className="rounded-lg p-3"
            style={{
              backgroundColor: `${COLORS?.secondary}50`,
              borderRight: isRTL ? `3px solid ${COLORS?.accent}` : undefined,
              borderLeft: !isRTL ? `3px solid ${COLORS?.accent}` : undefined,
            }}
          >
            <span
              className="text-[10px] font-bold block mb-1 flex items-center gap-1"
              style={{ color: COLORS?.accent }}
            >
              <HelpCircle className="w-3 h-3" />
              {isRTL ? "سوال" : "Question"}
            </span>
            <p
              className="text-xs leading-[1.9] italic"
              style={{ color: COLORS?.textSecondary }}
            >
              "{questionPreview}"
            </p>
          </div>
        )}

        {/* Answer summary */}
        {answerPreview && (
          <div>
            <span
              className="text-[10px] font-bold block mb-1"
              style={{ color: COLORS?.textSecondary }}
            >
              {isRTL ? "خلاصہ جواب:" : "Summary:"}
            </span>
            <p
              className="text-xs sm:text-sm leading-[2] line-clamp-3"
              style={{ color: COLORS?.textPrimary }}
            >
              {answerPreview}
            </p>
          </div>
        )}

        {/* Tags */}
        {Array.isArray(tags) && tags.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mt-auto pt-1">
            {tags.slice(0, 3).map((tag, idx) => (
              <span
                key={idx}
                className="inline-flex items-center gap-1 text-[10px] px-2 py-0.5 rounded-md border"
                style={{
                  backgroundColor: COLORS?.background,
                  borderColor: COLORS?.border,
                  color: COLORS?.textSecondary,
                }}
              >
                <Tag className="w-2.5 h-2.5 opacity-60" />
                {tag}
              </span>
            ))}
          </div>
        )}

        {/* Footer CTA */}
        <div
          className="pt-3 mt-auto border-t flex items-center justify-between"
          style={{ borderColor: `${COLORS?.border}80` }}
        >
          <span className="text-[10px]" style={{ color: COLORS?.textSecondary }}>
            {isRTL ? "دارالافتاء" : "Darul Ifta"}
          </span>
          <Link
            to={`/fatwas/${slug}`}
            className="inline-flex items-center gap-1.5 text-xs font-bold transition-colors hover:underline"
            style={{ color: COLORS?.primary }}
          >
            {isRTL ? "مکمل فتویٰ پڑھیں" : "Read Full Fatwa"}
            {isRTL ? (
              <ArrowLeft className="w-3.5 h-3.5" />
            ) : (
              <ArrowRight className="w-3.5 h-3.5" />
            )}
          </Link>
        </div>
      </div>
    </article>
  );
}
