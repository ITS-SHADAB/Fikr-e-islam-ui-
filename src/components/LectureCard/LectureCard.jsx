import React from "react";
import PropTypes from "prop-types";
import { Play, Video, Music, Calendar, ExternalLink, User } from "lucide-react";
import { useSettings } from "@/hooks/useSettings";
import { COLORS } from "@/utils/themeColors";
import { LECTURE_CATEGORY_TRANSLATIONS } from "@/utils/categories";
import { BACKEND_URL } from "@/constants/urls";

export default function LectureCard({ lecture, onPlay }) {
  const { settings } = useSettings();
  const language =
    settings?.language === "ur" || settings?.language === "Urdu" ? "ur" : "en";
  const isRTL = language === "ur";

  if (!lecture) return null;

  const { title, description, category, videoUrl, thumbnail, publishDate } =
    lecture;

  const formattedDate = publishDate
    ? new Date(publishDate).toLocaleDateString(isRTL ? "ur-PK" : "en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
      })
    : "";

  const isAudio =
    category === "Audio Lectures" || category === "Bayan Recordings";

  const getMediaIcon = (styleObj = { color: COLORS.accent }) => {
    if (isAudio) {
      return <Music className="w-3.5 h-3.5" style={styleObj} />;
    }
    return <Video className="w-3.5 h-3.5" style={styleObj} />;
  };

  const getYoutubeId = (url) => {
    if (!url) return null;
    const regExp =
      /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|shorts\/|&v=)([^#&?]*).*/;
    const match = url.match(regExp);
    return match && match[2].length === 11 ? match[2] : null;
  };

  const fallbackThumb =
    "https://images.unsplash.com/photo-1542816417-0983c9c9ad53?auto=format&fit=crop&q=80&w=800";

  const getThumbnailUrl = () => {
    if (thumbnail) {
      if (thumbnail.startsWith("/")) return `${BACKEND_URL}${thumbnail}`;
      return thumbnail;
    }
    const ytId = getYoutubeId(videoUrl);
    if (ytId) {
      return `https://img.youtube.com/vi/${ytId}/hqdefault.jpg`;
    }
    return fallbackThumb;
  };

  const categoryLabel =
    LECTURE_CATEGORY_TRANSLATIONS[category] || category || (isRTL ? "خطاب" : "Lecture");

  return (
    <div
      dir={isRTL ? "rtl" : "ltr"}
      className="group rounded-2xl overflow-hidden border flex flex-col justify-between transition-all duration-300 hover:shadow-lg"
      style={{
        backgroundColor: COLORS.white,
        borderColor: COLORS.border,
        boxShadow: "0 1px 4px rgba(74,55,40,0.06)",
      }}
    >
      {/* Thumbnail with Play Overlay */}
      <div
        className="relative h-48 w-full bg-slate-900 shrink-0 overflow-hidden cursor-pointer"
        onClick={() => onPlay && onPlay(lecture)}
      >
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

        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />

        {/* Play Button Center Overlay */}
        <div className="absolute inset-0 flex items-center justify-center bg-black/15 group-hover:bg-black/30 transition-all">
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              if (onPlay) onPlay(lecture);
            }}
            style={{ backgroundColor: COLORS.primary }}
            className="w-12 h-12 rounded-full text-white flex items-center justify-center shadow-xl transform transition-transform group-hover:scale-110 cursor-pointer border-2 border-white/30"
            aria-label="Play Lecture"
          >
            <Play className={`w-5 h-5 fill-current ${isRTL ? "-mr-0.5" : "-ml-0.5"}`} />
          </button>
        </div>

        {/* Category Badge over Thumbnail */}
        <div
          style={{
            backgroundColor: isAudio ? COLORS.secondary : COLORS.primary,
            color: isAudio ? COLORS.primary : COLORS.white,
          }}
          className={`absolute bottom-3 ${isRTL ? "right-3" : "left-3"} text-[10px] font-bold px-2.5 py-1 rounded-full flex items-center gap-1.5 shadow-md`}
        >
          {getMediaIcon({ color: isAudio ? COLORS.primary : COLORS.accent })}
          <span>{categoryLabel}</span>
        </div>
      </div>

      {/* Card Content Body */}
      <div className="p-4 sm:p-5 flex flex-col flex-1 justify-between gap-3">
        <div>
          {/* Meta: Date & Speaker */}
          <div className="flex items-center justify-between text-xs mb-2.5" style={{ color: COLORS.textSecondary }}>
            {formattedDate && (
              <span className="flex items-center gap-1 font-medium">
                <Calendar className="w-3.5 h-3.5" style={{ color: COLORS.accent }} />
                {formattedDate}
              </span>
            )}
            <span className="flex items-center gap-1 font-semibold" style={{ color: COLORS.primary }}>
              <User className="w-3.5 h-3.5" style={{ color: COLORS.accent }} />
              {isRTL ? "مفتی فیضان سرور مصباحی" : "Mufti Faizan Sarwar"}
            </span>
          </div>

          {/* Title */}
          <h3
            onClick={() => onPlay && onPlay(lecture)}
            className="font-bold text-base sm:text-lg font-serif leading-[1.8] line-clamp-2 cursor-pointer transition-colors group-hover:text-accent mb-2"
            style={{ color: COLORS.primary }}
          >
            {title}
          </h3>

          {/* Description */}
          {description && (
            <p
              className="text-xs sm:text-sm font-normal leading-[2] line-clamp-2 mb-3"
              style={{ color: COLORS.textSecondary }}
            >
              {description}
            </p>
          )}
        </div>

        {/* Actions Footer */}
        <div
          className="pt-3 border-t flex items-center justify-between gap-2"
          style={{ borderColor: `${COLORS.border}80` }}
        >
          <button
            type="button"
            onClick={() => onPlay && onPlay(lecture)}
            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-bold text-white transition-opacity hover:opacity-90 shadow-2xs cursor-pointer"
            style={{ backgroundColor: COLORS.primary }}
          >
            <Play className="w-3 h-3 fill-current" />
            <span>{isAudio ? (isRTL ? "آڈیو سنیں" : "Listen Audio") : (isRTL ? "ویڈیو دیکھیں" : "Watch Video")}</span>
          </button>

          {videoUrl && (
            <a
              href={videoUrl}
              target="_blank"
              rel="noopener noreferrer"
              onClick={(e) => e.stopPropagation()}
              className="inline-flex items-center gap-1 text-[11px] font-semibold hover:underline"
              style={{ color: COLORS.textSecondary }}
            >
              <span>{isRTL ? "اصل لنک" : "Original Link"}</span>
              <ExternalLink className="w-3 h-3" />
            </a>
          )}
        </div>
      </div>
    </div>
  );
}

LectureCard.propTypes = {
  lecture: PropTypes.shape({
    _id: PropTypes.string,
    title: PropTypes.string.isRequired,
    description: PropTypes.string,
    category: PropTypes.string,
    videoUrl: PropTypes.string,
    thumbnail: PropTypes.string,
    publishDate: PropTypes.string,
  }).isRequired,
  onPlay: PropTypes.func,
};
