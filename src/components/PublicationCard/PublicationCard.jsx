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
  const [imageError, setImageError] = useState(false);

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
    if (img) {
      const url = typeof img === "object" ? img.url : img;
      if (url && typeof url === "string" && url.trim() !== "") {
        if (url.startsWith("/")) return `${BACKEND_URL}${url}`;
        return url;
      }
    }
    // High-resolution AI-crafted Islamic book covers matching website theme colors
    const isGreenTheme =
      category === "Quran" ||
      category === "Hadith" ||
      category === "قرآن و تفاسیر" ||
      category === "حدیث";
    return isGreenTheme
      ? "/assets/images/books/islamic-book-cover-green.jpg"
      : "/assets/images/books/islamic-book-cover.jpg";
  };

  const [imgSrc, setImgSrc] = useState(() => getCoverImageSrc(coverImage));

  React.useEffect(() => {
    setImgSrc(getCoverImageSrc(coverImage));
    setImageError(false);
  }, [coverImage, category]);

  const pdfUrl = pdf?.url || (typeof pdf === "string" ? pdf : null);
  const coverImageSrc = imgSrc;

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
        className="rounded-3xl p-4 sm:p-6 shadow-xs hover:shadow-md transition-all duration-300 relative overflow-hidden flex flex-col md:flex-row items-center justify-between gap-5 sm:gap-6 md:gap-8 text-right border group"
        style={{
          backgroundColor: COLORS.cardBg || "#F7F1E8",
          borderColor: `${COLORS.border}50` || "#EBDCCB",
        }}
      >
        {/* ══════════════════════════════════════════════════════════════
            RIGHT SIDE (1st child in RTL): 3D Luxury Hardcover Book Presentation
            - Responsive mobile width (max-w-[260px] to max-w-[300px])
            - Golden book ratio aspect-[3/4]
            - Realistic book spine (RTL right edge) with 3D gradient & groove
            - Real page depth layers (bottom & left edge in cream)
            - Gold corner embossing & rim highlight with website theme colors
            - Dual-layer image: ambient blur fill + crisp foreground cover (zero cropping!)
            - Ornate Islamic book cover fallback if image is missing/broken
        ══════════════════════════════════════════════════════════════ */}
        <Link
          to={detailUrl}
          className="relative shrink-0 select-none cursor-pointer group/cover block w-full max-w-[280px] sm:max-w-[300px] md:w-56 lg:w-60 mx-auto my-1"
          title={title}
        >
          {/* Outer Book Stage / Realistic Floating Shadow */}
          <div className="relative w-full aspect-[3/4] transition-transform duration-500 group-hover/cover:-translate-y-1.5 group-hover/cover:scale-[1.01]">
            {/* Under-book Depth Shadow (creates physical floating elevation) */}
            <div
              className="absolute -bottom-2.5 inset-x-3 h-5 rounded-full blur-md opacity-40 pointer-events-none transition-opacity duration-500 group-hover/cover:opacity-60"
              style={{ backgroundColor: COLORS.primary }}
            />

            {/* Book Pages Edge Simulation (Stacked paper look on left & bottom for RTL) */}
            <div
              className="absolute inset-0 rounded-2xl pointer-events-none translate-x-[-3px] translate-y-[3px] border-l-2 border-b-2 opacity-60"
              style={{
                borderColor: COLORS.secondary,
                backgroundColor: "rgba(243, 227, 216, 0.3)",
              }}
            />

            {/* Main Hardcover Book Container */}
            <div
              className="relative w-full h-full rounded-2xl overflow-hidden shadow-2xl border flex items-center justify-center"
              style={{
                backgroundColor: COLORS.primary,
                borderColor: `${COLORS.accent}80`,
              }}
            >
              {/* 3D Curved Spine Effect (Right side for RTL Urdu books) */}
              <div
                className="absolute top-0 right-0 bottom-0 w-4 sm:w-5 z-30 pointer-events-none rounded-r-2xl"
                style={{
                  background:
                    "linear-gradient(to left, rgba(0,0,0,0.55) 0%, rgba(255,255,255,0.18) 35%, rgba(0,0,0,0.15) 75%, transparent 100%)",
                }}
              />
              {/* Spine Crease / Hinge Indentation Line */}
              <div
                className="absolute top-0 right-4 sm:right-5 bottom-0 w-[1.5px] z-30 pointer-events-none"
                style={{
                  background:
                    "linear-gradient(to bottom, rgba(168,121,62,0.6) 0%, rgba(0,0,0,0.7) 50%, rgba(168,121,62,0.6) 100%)",
                }}
              />

              {/* Gold Foil Corner Accents (Islamic manuscript aesthetic) */}
              <div
                className="absolute top-2.5 right-6 w-3 h-3 border-t-2 border-r-2 rounded-tr z-30 pointer-events-none opacity-70"
                style={{ borderColor: COLORS.accent }}
              />
              <div
                className="absolute top-2.5 left-2.5 w-3 h-3 border-t-2 border-l-2 rounded-tl z-30 pointer-events-none opacity-70"
                style={{ borderColor: COLORS.accent }}
              />
              <div
                className="absolute bottom-2.5 right-6 w-3 h-3 border-b-2 border-r-2 rounded-br z-30 pointer-events-none opacity-70"
                style={{ borderColor: COLORS.accent }}
              />
              <div
                className="absolute bottom-2.5 left-2.5 w-3 h-3 border-b-2 border-l-2 rounded-bl z-30 pointer-events-none opacity-70"
                style={{ borderColor: COLORS.accent }}
              />

              {/* Cover Image Presentation */}
              {coverImageSrc && !imageError ? (
                <div className="relative w-full h-full p-2.5 sm:p-3 flex items-center justify-center overflow-hidden">
                  {/* Ambient Blurred Background to eliminate empty gaps without cutting off cover artwork */}
                  <img
                    src={coverImageSrc}
                    alt=""
                    aria-hidden="true"
                    className="absolute inset-0 w-full h-full object-cover filter blur-lg opacity-30 scale-110 pointer-events-none"
                    decoding="async"
                  />

                  {/* Crisp Primary Book Cover: 100% full view, zero text cropping! */}
                  <div className="relative z-20 w-full h-full rounded-xl overflow-hidden flex items-center justify-center border border-white/20 shadow-inner">
                    <img
                      src={coverImageSrc}
                      alt={title}
                      className="w-full h-full object-contain drop-shadow-md transition-transform duration-500 group-hover/cover:scale-[1.03]"
                      decoding="async"
                      onError={() => {
                        const fallbackCover = "/assets/images/books/islamic-book-cover.jpg";
                        if (imgSrc !== fallbackCover) {
                          setImgSrc(fallbackCover);
                        } else {
                          setImageError(true);
                        }
                      }}
                    />
                  </div>

                  {/* Luxury Soft Reflection Sheen */}
                  <div
                    className="absolute inset-0 z-30 pointer-events-none rounded-2xl opacity-20"
                    style={{
                      background:
                        "linear-gradient(125deg, rgba(255,255,255,0.4) 0%, rgba(255,255,255,0.08) 35%, transparent 65%)",
                    }}
                  />
                </div>
              ) : (
                /* Fallback: Ornate Islamic Hardcover Design */
                <div
                  className="relative w-full h-full p-4 sm:p-5 flex flex-col justify-between text-center select-none"
                  style={{ backgroundColor: COLORS.primary }}
                >
                  {/* Inner Gold Inset Border */}
                  <div
                    className="absolute inset-3 rounded-xl border border-dashed pointer-events-none opacity-40"
                    style={{ borderColor: COLORS.accent }}
                  />

                  {/* Header Emblem */}
                  <div className="pt-2 z-10">
                    <div
                      className="w-11 h-11 mx-auto rounded-full flex items-center justify-center border shadow-sm"
                      style={{
                        backgroundColor: `${COLORS.accent}25`,
                        borderColor: `${COLORS.accent}60`,
                      }}
                    >
                      <Book
                        className="w-5 h-5"
                        style={{ color: COLORS.accent }}
                      />
                    </div>
                  </div>

                  {/* Center Book Title & Author */}
                  <div className="py-2 z-10 px-2">
                    <h4
                      className="font-bold text-sm sm:text-base leading-relaxed line-clamp-3 mb-1.5"
                      style={{ color: COLORS.cardBg }}
                    >
                      {title}
                    </h4>
                    {author && (
                      <p
                        className="text-[11px] sm:text-xs font-semibold line-clamp-1"
                        style={{ color: COLORS.accent }}
                      >
                        {author}
                      </p>
                    )}
                  </div>

                  {/* Footer Publisher Tag */}
                  <div className="pb-1 z-10">
                    <span
                      className="text-[10px] tracking-wider px-2 py-0.5 rounded-full inline-block border"
                      style={{
                        color: COLORS.secondary,
                        borderColor: `${COLORS.secondary}40`,
                        backgroundColor: "rgba(0,0,0,0.25)",
                      }}
                    >
                      فکرِ اسلام پبلیکیشنز
                    </span>
                  </div>
                </div>
              )}
            </div>
          </div>
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
                className="text-lg sm:text-xl font-bold leading-[1.85] mb-2 group-hover/title:text-accent transition-colors"
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
                className="text-sm leading-[2.1] mb-4 font-normal"
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
                className="text-xs"
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
