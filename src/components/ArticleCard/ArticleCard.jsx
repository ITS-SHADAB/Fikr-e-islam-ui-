import PropTypes from "prop-types";
import React from "react";
import { Link } from "react-router-dom";
import { Calendar, Eye, ArrowLeft, ArrowRight } from "lucide-react";
import { useSettings } from "@/hooks/useSettings";
import { BACKEND_URL } from "@/constants/urls";
import { ARTICLE_CATEGORY_TRANSLATIONS } from "@/utils/categories";

export default function ArticleCard({ article }) {
  const { settings } = useSettings();
  const language =
    settings?.language === "ur" || settings?.language === "Urdu" ? "ur" : "en";

  const {
    title,
    slug,
    summary,
    category,
    featuredImage,
    publishDate,
    viewCount,
  } = article;

  const formattedDate = new Date(publishDate).toLocaleDateString(
    language === "ur" ? "ur-PK" : "en-US",
    {
      year: "numeric",
      month: "short",
      day: "numeric",
    }
  );

  const placeholderImage =
    "https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&q=80&w=800";

  // Backend returns featuredImage as { url, public_id } object
  const getImageSrc = (imgField) => {
    if (!imgField) return placeholderImage;
    // Object form from backend: { url, public_id }
    const url = typeof imgField === "object" ? imgField.url : imgField;
    if (!url) return placeholderImage;
    if (url.startsWith("/")) return `${BACKEND_URL}${url}`;
    return url;
  };

  return (
    <Link
      to={`/articles/${article._id || slug}`}
      className="premium-card flex flex-col h-full overflow-hidden group hover:no-underline text-inherit cursor-pointer"
    >
      {/* Featured Image */}
      <div className="relative h-52 w-full overflow-hidden bg-secondary shrink-0">
        <img
          src={getImageSrc(featuredImage)}
          alt={title}
          className="absolute inset-0 w-full h-full object-cover object-center transition-transform duration-500 group-hover:scale-105"
          loading="lazy"
          onError={(e) => {
            e.currentTarget.onerror = null;
            e.currentTarget.src = placeholderImage;
          }}
        />
        {/* subtle gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent pointer-events-none" />
        <div className="absolute top-3 left-3 bg-secondary text-textSecondary text-xs font-bold uppercase tracking-wider px-2.5 py-1 rounded shadow-sm">
          {language === "ur"
            ? ARTICLE_CATEGORY_TRANSLATIONS[category] || category
            : category}
        </div>
      </div>

      {/* Card Content */}
      <div className="p-4 flex flex-col flex-grow text-start">
        {/* Date and View Statistics */}
        <div className="flex items-center gap-4 text-xs text-slate-500 mb-4 justify-start">
          <span className="flex items-center gap-2">
            <Calendar className="w-5 h-5 text-accent" />
            {formattedDate}
          </span>
          <span className="flex items-center gap-2">
            <Eye className="w-5 h-5 text-accent" />
            {viewCount} {language === "en" ? "views" : "بار دیکھا گیا"}
          </span>
        </div>

        {/* Title */}
        <h3 className="text-lg font-bold text-slate-900 group-hover:text-primary transition-colors line-clamp-2 leading-snug mb-4">
          {title}
        </h3>

        {/* Summary Description */}
        <p className="text-textPrimary text-sm line-clamp-3 leading-relaxed mb-4 font-light">
          {summary}
        </p>

        {/* Read More link */}
        <div className="mt-auto pt-2 justify-start flex">
          <span className="inline-flex items-center gap-2 text-sm font-bold text-primary hover:text-accent transition-colors">
            {language === "en" ? "Read Article" : "مضمون پڑھیں"}
            {language === "en" ? (
              <ArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-1" />
            ) : (
              <ArrowLeft className="w-5 h-5 transition-transform group-hover:-translate-x-1" />
            )}
          </span>
        </div>
      </div>
    </Link>
  );
}

ArticleCard.propTypes = {
  article: PropTypes.shape({
    title: PropTypes.string.isRequired,
    slug: PropTypes.string.isRequired,
    summary: PropTypes.string.isRequired,
    category: PropTypes.string.isRequired,
    // Backend returns featuredImage as { url, public_id } object
    featuredImage: PropTypes.oneOfType([
      PropTypes.string,
      PropTypes.shape({ url: PropTypes.string, public_id: PropTypes.string }),
    ]),
    publishDate: PropTypes.string.isRequired,
    viewCount: PropTypes.number.isRequired,
  }).isRequired,
};
