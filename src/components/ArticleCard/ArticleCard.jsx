import React, { useState } from "react";
import { Link } from "react-router-dom";
import PropTypes from "prop-types";
import { Calendar, Eye, Clock, Tag, BookOpen, FileText } from "lucide-react";
import { COLORS } from "@/utils/themeColors";
import { BACKEND_URL } from "@/constants/urls";
import { ARTICLE_CATEGORY_TRANSLATIONS } from "@/utils/categories";
import { PdfViewer } from "../PdfViewer";

// Estimated reading time based on summary length
const getReadingTime = (text = "") => {
  const words = text?.trim()?.split(/\s+/)?.length || 0;
  const mins = Math.max(1, Math.ceil(words / 150));
  return mins;
};

export default function ArticleCard({ article }) {
  const [isPdfOpen, setIsPdfOpen] = useState(false);
  const [imgError, setImgError] = useState(false);

  if (!article) return null;

  const detailUrl = `/articles/slug/${article?.slug || article?._id}`;

  const formattedDate = article?.publishDate
    ? new Date(article?.publishDate).toLocaleDateString("ur-PK", {
        year: "numeric",
        month: "long",
        day: "numeric",
      })
    : "";

  const getImageSrc = (img) => {
    if (!img) return null;
    const url = typeof img === "object" ? img?.url : img;
    if (!url) return null;
    if (url?.startsWith("/")) return `${BACKEND_URL}${url}`;
    return url;
  };

  const pdfUrl =
    article?.pdf?.url ||
    (typeof article?.pdf === "string" ? article?.pdf : null);
  const imageSrc = getImageSrc(article?.featuredImage);
  const showImage = imageSrc && !imgError;

  const categoryLabel =
    ARTICLE_CATEGORY_TRANSLATIONS[article?.category] ||
    article?.category ||
    "اسلامی مقالات";

  const readingTime = getReadingTime(article?.summary || "");
  const excerpt = article?.summary
    ? article?.summary?.length > 200
      ? `${article?.summary?.slice(0, 200)}...`
      : article?.summary
    : "";

  return (
    <>
      <article
        dir="rtl"
        className="group rounded-2xl overflow-hidden border transition-all duration-300 hover:shadow-lg"
        style={{
          backgroundColor: COLORS?.white,
          borderColor: COLORS?.border,
          boxShadow: "0 1px 4px rgba(74,55,40,0.06)",
        }}
      >
        {/* ── Hero Banner Image ── */}
        <Link to={detailUrl} className="block relative overflow-hidden" style={{ height: showImage ? "200px" : "0" }}>
          {showImage && (
            <>
              <img
                src={imageSrc}
                alt={article?.title || ""}
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                onError={() => setImgError(true)}
              />
              {/* Gradient overlay */}
              <div
                className="absolute inset-0"
                style={{
                  background:
                    "linear-gradient(to bottom, transparent 40%, rgba(74,55,40,0.55) 100%)",
                }}
              />
              {/* Category badge over image */}
              <span
                className="absolute bottom-3 right-3 text-[10px] font-bold px-2.5 py-1 rounded-full"
                style={{
                  backgroundColor: COLORS?.accent,
                  color: COLORS?.white,
                }}
              >
                {categoryLabel}
              </span>
            </>
          )}
        </Link>

        {/* ── Card Body ── */}
        <div className="p-4 sm:p-5 flex flex-col gap-3">
          {/* Top meta row (category if no image, date, reading time, views) */}
          <div className="flex items-center justify-between gap-2 flex-wrap">
            {!showImage && (
              <span
                className="text-[10px] font-bold px-2.5 py-0.5 rounded-full"
                style={{
                  backgroundColor: `${COLORS?.secondary}`,
                  color: COLORS?.primary,
                }}
              >
                {categoryLabel}
              </span>
            )}
            <div
              className="flex items-center gap-3 text-[11px] ms-auto"
              style={{ color: COLORS?.textSecondary }}
            >
              {formattedDate && (
                <span className="flex items-center gap-1">
                  <Calendar className="w-3 h-3" />
                  {formattedDate}
                </span>
              )}
              <span className="flex items-center gap-1">
                <Clock className="w-3 h-3" />
                {readingTime} دقیقہ مطالعہ
              </span>
              {(article?.viewCount || 0) > 0 && (
                <span className="flex items-center gap-1">
                  <Eye className="w-3 h-3" />
                  {article?.viewCount}
                </span>
              )}
            </div>
          </div>

          {/* Article Title */}
          <Link to={detailUrl}>
            <h2
              className="font-bold text-base sm:text-lg leading-[1.8] font-serif line-clamp-2 group-hover:underline transition-colors"
              style={{ color: COLORS?.primary }}
            >
              {article?.title}
            </h2>
          </Link>

          {/* Excerpt */}
          {excerpt && (
            <p
              className="text-xs sm:text-sm leading-[2] line-clamp-3"
              style={{ color: COLORS?.textSecondary }}
            >
              {excerpt}
            </p>
          )}

          {/* Tags */}
          {Array.isArray(article?.tags) && article?.tags?.length > 0 && (
            <div className="flex flex-wrap gap-1.5">
              {article?.tags?.slice(0, 3)?.map((tag, idx) => (
                <span
                  key={idx}
                  className="inline-flex items-center gap-1 text-[10px] px-2 py-0.5 rounded-md"
                  style={{
                    backgroundColor: `${COLORS?.background}`,
                    border: `1px solid ${COLORS?.border}`,
                    color: COLORS?.textSecondary,
                  }}
                >
                  <Tag className="w-2.5 h-2.5 opacity-60" />
                  {tag}
                </span>
              ))}
            </div>
          )}

          {/* Divider */}
          <div
            className="border-t pt-3 flex items-center justify-between gap-3"
            style={{ borderColor: `${COLORS?.border}80` }}
          >
            {/* Author */}
            <div className="flex items-center gap-2">
              <div
                className="w-7 h-7 rounded-full flex items-center justify-center shrink-0"
                style={{
                  backgroundColor: `${COLORS?.primary}15`,
                }}
              >
                <BookOpen
                  className="w-3.5 h-3.5"
                  style={{ color: COLORS?.primary }}
                />
              </div>
              <span
                className="text-[11px] font-semibold line-clamp-1"
                style={{ color: COLORS?.textSecondary }}
              >
                {article?.author || "مفتی فیضان سرور مصباحی"}
              </span>
            </div>

            {/* Actions */}
            <div className="flex items-center gap-2">
              {pdfUrl && (
                <button
                  type="button"
                  onClick={() => setIsPdfOpen(true)}
                  className="text-[10px] font-bold px-2.5 py-1.5 rounded-lg border transition-colors cursor-pointer"
                  style={{
                    borderColor: COLORS?.border,
                    color: COLORS?.textSecondary,
                    backgroundColor: COLORS?.background,
                  }}
                >
                  <FileText className="w-3 h-3 inline-block me-1 -mt-0.5" />
                  PDF
                </button>
              )}
              <Link
                to={detailUrl}
                className="text-[11px] font-bold px-3 py-1.5 rounded-lg text-white transition-opacity hover:opacity-90"
                style={{ backgroundColor: COLORS?.primary }}
              >
                مضمون پڑھیں ←
              </Link>
            </div>
          </div>
        </div>
      </article>

      {isPdfOpen && pdfUrl && (
        <PdfViewer
          url={pdfUrl}
          title={article?.title}
          isModal={true}
          onClose={() => setIsPdfOpen(false)}
        />
      )}
    </>
  );
}

ArticleCard.propTypes = {
  article: PropTypes.shape({
    _id: PropTypes.string,
    title: PropTypes.string,
    slug: PropTypes.string,
    summary: PropTypes.string,
    category: PropTypes.string,
    featuredImage: PropTypes.oneOfType([
      PropTypes.string,
      PropTypes.shape({ url: PropTypes.string }),
    ]),
    pdf: PropTypes.oneOfType([
      PropTypes.string,
      PropTypes.shape({ url: PropTypes.string }),
    ]),
    publishDate: PropTypes.string,
    viewCount: PropTypes.number,
    tags: PropTypes.arrayOf(PropTypes.string),
  }),
};
