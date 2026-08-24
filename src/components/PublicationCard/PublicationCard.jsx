import React, { useState } from "react";
import { Link } from "react-router-dom";
import {
  Book,
  Download,
  ExternalLink,
  Calendar,
  User,
  FileText,
  Eye,
  Info,
} from "lucide-react";
import { COLORS } from "@/utils/themeColors";
import { BACKEND_URL } from "@/constants/urls";
import {
  PUBLICATION_CATEGORY_TRANSLATIONS,
  BOOK_LANGUAGE_TRANSLATIONS,
} from "@/utils/categories";
import { PdfViewer } from "../PdfViewer";

export default function PublicationCard({ publication }) {
  const [isPdfOpen, setIsPdfOpen] = useState(false);

  if (!publication) return null;

  const {
    _id,
    slug,
    title,
    summary,
    category,
    blanguage = "Urdu",
    author,
    publishDate,
    coverImage,
    pdf,
    pageCount,
  } = publication;

  const detailUrl = `/publications/slug/${slug || _id}`;

  const formattedDate = publishDate
    ? new Date(publishDate).toLocaleDateString("ur-PK", {
        year: "numeric",
        month: "long",
      })
    : "";

  const getCoverImageSrc = (img) => {
    if (!img) return null;
    const url = typeof img === "object" ? img.url : img;
    if (!url) return null;
    if (url.startsWith("/")) return `${BACKEND_URL}${url}`;
    return url;
  };

  const pdfUrl = pdf?.url || (typeof pdf === "string" ? pdf : null);
  const coverImageSrc = getCoverImageSrc(coverImage);

  const categoryLabel =
    PUBLICATION_CATEGORY_TRANSLATIONS[category] || category || "کتب و رسائل";
  const languageLabel =
    BOOK_LANGUAGE_TRANSLATIONS[blanguage] || blanguage || "اردو";

  const truncatedSummary = summary
    ? summary.length > 200
      ? `${summary.slice(0, 200)}...`
      : summary
    : "";

  return (
    <>
      <div
        dir="rtl"
        className="rounded-3xl p-5 sm:p-6 shadow-xs hover:shadow-md transition-all duration-300 relative overflow-hidden flex flex-col md:flex-row items-center justify-between gap-6 md:gap-8 text-right border group"
        style={{
          backgroundColor: COLORS.background || "FAF6F0",
          borderColor: COLORS.border || "#EBDCCB",
        }}
      >
        {/* ══════════════════════════════════════════════════════════════
            RIGHT SIDE (1st child in RTL): Book Cover & Thumbnail
        ══════════════════════════════════════════════════════════════ */}
        <Link
          to={detailUrl}
          className="relative w-full md:w-56 lg:w-60 h-56 sm:h-60 rounded-2xl overflow-hidden shadow-md border flex items-center justify-center p-3 shrink-0 select-none cursor-pointer transition-transform duration-300 group-hover:scale-[1.02]"
          style={{
            backgroundColor: COLORS.primary,
            borderColor: `${COLORS.accent}40`,
          }}
          title={title}
        >
          {coverImageSrc ? (
            <div className="relative w-32 sm:w-36 h-44 sm:h-48 rounded shadow-xl overflow-hidden border border-white/20">
              <img
                src={coverImageSrc}
                alt={title}
                className="w-full h-full object-cover"
                onError={(e) => {
                  e.currentTarget.style.display = "none";
                }}
              />
            </div>
          ) : (
            /* Open Book Aesthetic Mockup */
            <div
              className="relative w-40 sm:w-44 h-32 sm:h-36 rounded-sm shadow-xl border flex items-center justify-center p-2"
              style={{
                backgroundColor: COLORS.background || "#F4EBE1",
                borderColor: COLORS.border,
              }}
            >
              {/* Spine crease */}
              <div className="absolute inset-y-0 left-1/2 w-2.5 -ml-1.5 bg-gradient-to-r from-black/10 via-black/20 to-black/10 z-10 pointer-events-none"></div>

              {/* Left Page */}
              <div className="flex-1 h-full pr-1 flex flex-col justify-between py-1 border-r border-black/10 text-right">
                <span
                  className="text-[8px] font-bold pb-0.5 truncate block"
                  style={{ color: COLORS.accent }}
                >
                  {categoryLabel}
                </span>
                <div className="space-y-1">
                  <div className="h-1 bg-slate-300/80 rounded w-full"></div>
                  <div className="h-1 bg-slate-300/80 rounded w-4/5"></div>
                  <div className="h-1 bg-slate-300/80 rounded w-full"></div>
                </div>
                <span className="text-[7px] text-slate-400 text-center font-mono">
                  148
                </span>
              </div>

              {/* Right Page */}
              <div className="flex-1 h-full pl-1 flex flex-col justify-between py-1 text-right">
                <span
                  className="text-[8px] font-extrabold line-clamp-1 block"
                  style={{ color: COLORS.primary }}
                >
                  {title}
                </span>
                <div className="space-y-1">
                  <div className="h-1 bg-slate-300/80 rounded w-full"></div>
                  <div className="h-1 bg-slate-300/80 rounded w-5/6"></div>
                  <div className="h-1 bg-slate-300/80 rounded w-2/3"></div>
                </div>
                <span className="text-[7px] text-slate-400 text-center font-mono">
                  149
                </span>
              </div>
            </div>
          )}
        </Link>

        {/* ══════════════════════════════════════════════════════════════
            LEFT SIDE (2nd child in RTL): Content, Meta, 50ch Summary & Action Buttons
        ══════════════════════════════════════════════════════════════ */}
        <div className="flex-1 flex flex-col justify-between text-right z-10 w-full space-y-3">
          <div>
            {/* Top Bar: Category Pill on the Right, Language on the Left */}
            <div
              className="flex items-center justify-between pb-2 border-b"
              style={{ borderColor: `${COLORS.border}80` }}
            >
              <span
                style={{
                  backgroundColor: COLORS.secondary,
                  color: COLORS.primary,
                }}
                className="text-xs font-bold px-3 py-1 rounded-full text-[11px] shadow-xs"
              >
                {categoryLabel}
              </span>
              <span
                className="text-xs font-semibold"
                style={{ color: COLORS.accent }}
              >
                {languageLabel}
              </span>
            </div>

            {/* Book Title linking to details page */}
            <Link to={detailUrl} className="block group/title mt-2">
              <h3
                style={{ color: COLORS.primary }}
                className="text-lg sm:text-xl font-bold leading-snug mb-2 font-serif group-hover/title:text-accent transition-colors"
              >
                {title}
              </h3>
            </Link>

            {/* Author Meta Row */}
            {author && (
              <div
                className="flex items-center gap-1.5 text-xs font-semibold mb-2"
                style={{ color: COLORS.accent }}
              >
                <User className="w-3.5 h-3.5 shrink-0" />
                <span>مصنف: {author}</span>
              </div>
            )}

            {/* Date & Page Count Meta Row */}
            <div
              className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs mb-3"
              style={{ color: COLORS.textSecondary }}
            >
              {pageCount && (
                <div className="flex items-center gap-1.5">
                  <FileText className="w-3.5 h-3.5 shrink-0" />
                  <span>{pageCount} صفحات</span>
                </div>
              )}
              {formattedDate && (
                <div className="flex items-center gap-1.5">
                  <Calendar className="w-3.5 h-3.5 shrink-0" />
                  <span>{formattedDate}</span>
                </div>
              )}
            </div>

            {/* Summary / Description (Truncated to 50 characters with ...) */}
            {truncatedSummary && (
              <p
                className="text-sm leading-relaxed mb-4 font-light"
                style={{ color: COLORS.textPrimary }}
              >
                {truncatedSummary}
              </p>
            )}
          </div>

          {/* Action Buttons: Details, Read Online & Download */}
          <div
            className="pt-3 border-t flex flex-wrap items-center justify-end gap-2.5 sm:gap-3"
            style={{ borderColor: `${COLORS.border}80` }}
          >
            {/* View Details Page button */}
            <Link
              to={detailUrl}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold rounded-xl cursor-pointer border transition-colors hover:bg-white shadow-xs"
              style={{
                borderColor: COLORS.border,
                color: COLORS.primary,
                backgroundColor: "rgba(255,255,255,0.7)",
              }}
            >
              <Info className="w-3.5 h-3.5" style={{ color: COLORS.accent }} />
              <span>تفصیلات دیکھیں</span>
            </Link>

            {pdfUrl ? (
              <>
                <button
                  type="button"
                  onClick={() => setIsPdfOpen(true)}
                  className="inline-flex items-center gap-2 px-5 py-2 text-sm font-bold text-white rounded-xl cursor-pointer border-0 hover:opacity-90 transition-opacity shadow-sm"
                  style={{ backgroundColor: COLORS.primary }}
                >
                  <Download
                    className="w-4 h-4"
                    style={{ color: COLORS.accent }}
                  />
                  <span>ڈاؤن لوڈ کریں</span>
                </button>
              </>
            ) : (
              <span
                className="text-xs italic"
                style={{ color: COLORS.textSecondary }}
              >
                پی ڈی ایف دستیاب نہیں
              </span>
            )}
          </div>
        </div>
      </div>

      {/* PDF Viewer modal */}
      {isPdfOpen && pdfUrl && (
        <PdfViewer
          url={pdfUrl}
          title={title}
          isModal={true}
          onClose={() => setIsPdfOpen(false)}
        />
      )}
    </>
  );
}
