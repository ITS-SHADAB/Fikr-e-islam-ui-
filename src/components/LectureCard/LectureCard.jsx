import React from "react";
import { Play, Video, Music, Calendar } from "lucide-react";
import { useSettings } from "@/hooks/useSettings";
import { COLORS } from "@/utils/themeColors";
import { LECTURE_CATEGORY_TRANSLATIONS } from "@/utils/categories";

export default function LectureCard({ lecture, onPlay }) {
  const { settings } = useSettings();
  const language =
    settings?.language === "ur" || settings?.language === "Urdu" ? "ur" : "en";

  const { title, description, category, videoUrl, thumbnail, publishDate } =
    lecture;

  const formattedDate = new Date(publishDate).toLocaleDateString(
    language === "ur" ? "ur-PK" : "en-US",
    {
      year: "numeric",
      month: "short",
      day: "numeric",
    }
  );

  const getMediaIcon = (styleObj = { color: COLORS.accent }) => {
    switch (category) {
      case "Audio Lectures":
      case "Bayan Recordings":
        return <Music className="w-4 h-4" style={styleObj} />;
      default:
        return <Video className="w-4 h-4" style={styleObj} />;
    }
  };

  const getYoutubeId = (url) => {
    const regExp =
      /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
    const match = url.match(regExp);
    return match && match[2].length === 11 ? match[2] : null;
  };

  const BACKEND_URL = "https://fikr-e-islam.onrender.com";
  const fallbackThumb =
    "https://images.unsplash.com/photo-1447069387593-a5de0862481e?auto=format&fit=crop&q=80&w=800";

  const getThumbnailUrl = () => {
    if (thumbnail) {
      if (thumbnail.startsWith("/")) return `${BACKEND_URL}${thumbnail}`;
      return thumbnail;
    }
    // Auto generate YouTube thumbnail if YouTube link is detected
    const ytId = getYoutubeId(videoUrl);
    if (ytId) {
      return `https://img.youtube.com/vi/${ytId}/hqdefault.jpg`;
    }
    return fallbackThumb;
  };

  return (
    <div
      onClick={() => onPlay(lecture)}
      className={`premium-card shadow-sm overflow-hidden flex flex-col h-full group cursor-pointer ${language === "ur" ? "text-right" : "text-left"}`}
    >
      {/* Thumbnail with Play Overlay */}
      <div className="relative h-44 w-full bg-slate-800 shrink-0 overflow-hidden">
        <img
          src={getThumbnailUrl()}
          alt={title}
          className="w-full h-full object-cover opacity-90 transition-transform duration-500 group-hover:scale-105"
          loading="lazy"
          onError={(e) => {
            e.currentTarget.onerror = null;
            e.currentTarget.src = fallbackThumb;
          }}
        />

        {/* Play Button Overlay */}
        <div className="absolute inset-0 flex items-center justify-center bg-black/20 group-hover:bg-black/35 transition-all">
          <button
            onClick={() => onPlay(lecture)}
            style={{ backgroundColor: COLORS.primary }}
            className="w-12 h-12 rounded-full text-white flex items-center justify-center shadow-lg transform transition-transform group-hover:scale-110 focus:outline-none theme-hover-bg-accent"
            aria-label="Play Lecture"
          >
            <Play className="w-5 h-5 fill-current ml-0.5" />
          </button>
        </div>

        {/* Media Type Badge */}
        <div
          style={{
            backgroundColor: COLORS.secondary,
            color: COLORS.textSecondary,
          }}
          className={`absolute bottom-3 ${language === "ur" ? "right-3" : "left-3"} text-[10px] font-bold px-2.5 py-1 rounded-full flex items-center gap-1 shadow`}
        >
          {getMediaIcon({ color: COLORS.textSecondary })}
          {language === "ur"
            ? LECTURE_CATEGORY_TRANSLATIONS[category] || category
            : category}
        </div>
      </div>

      {/* Card Content */}
      <div className="p-4 flex flex-col flex-grow">
        {/* Date */}
        <div className="flex items-center gap-1.5 text-xs text-slate-500 mb-2 justify-start">
          <Calendar className="w-3.5 h-3.5" style={{ color: COLORS.accent }} />
          {formattedDate}
        </div>

        {/* Title */}
        <h3
          style={{ color: COLORS.textPrimary }}
          className={`text-md font-bold transition-colors leading-[1.85] mb-2 line-clamp-2 ${language === "ur" ? "text-right" : "text-left"} group-hover:text-[var(--color-primary)]`}
        >
          {title}
        </h3>

        {/* Description */}
        <p
          className={`text-xs font-normal leading-[2.0] line-clamp-2 ${language === "ur" ? "text-right" : "text-left"}`}
          style={{ color: COLORS.textPrimary }}
        >
          {description}
        </p>


        {/* Play Link Actions */}
        <div
          className={`mt-auto pt-3 flex items-center justify-between border-t border-slate-100 ${language === "ur" ? "text-right" : "text-left"}`}
        >
          <button
            onClick={() => onPlay(lecture)}
            style={{ color: COLORS.primary }}
            className="text-xs font-bold transition-colors theme-hover-text-accent"
          >
            {language === "en" ? "Listen/Watch Now" : "ابھی سنیں/دیکھیں"}
          </button>

          <a
            href={videoUrl}
            target="_blank"
            rel="noopener noreferrer"
            onClick={(e) => e.stopPropagation()}
            className="text-[10px] text-slate-500 hover:text-slate-700 underline"
          >
            {language === "en" ? "Open Link" : "اصل لنک کھولیں"}
          </a>
        </div>
      </div>
    </div>
  );
}
