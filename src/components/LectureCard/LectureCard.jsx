import React, { useState } from "react";
import PropTypes from "prop-types";
import {
  Play,
  Video,
  Music,
  Calendar,
  ExternalLink,
  User,
  Youtube,
  Share2,
  Check,
} from "lucide-react";
import toast from "react-hot-toast";
import { useSettings } from "@/hooks/useSettings";
import { COLORS } from "@/utils/themeColors";
import { LECTURE_CATEGORY_TRANSLATIONS } from "@/utils/categories";
import { BACKEND_URL } from "@/constants/urls";

export default function LectureCard({ lecture, onPlay }) {
  const { settings } = useSettings();
  const [copied, setCopied] = useState(false);

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

  const getYoutubeId = (url) => {
    if (!url) return null;
    const regExp =
      /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|shorts\/|&v=)([^#&?]*).*/;
    const match = url.match(regExp);
    return match && match[2].length === 11 ? match[2] : null;
  };

  const ytId = getYoutubeId(videoUrl);
  const isYoutube =
    !!ytId || videoUrl?.includes("youtube") || videoUrl?.includes("youtu.be");

  const fallbackThumb =
    "https://images.unsplash.com/photo-1542816417-0983c9c9ad53?auto=format&fit=crop&q=80&w=800";

  const getThumbnailUrl = () => {
    if (thumbnail) {
      if (thumbnail.startsWith("/")) return `${BACKEND_URL}${thumbnail}`;
      return thumbnail;
    }
    if (ytId) {
      return `https://img.youtube.com/vi/${ytId}/hqdefault.jpg`;
    }
    return fallbackThumb;
  };

  const getDestinationUrl = () => {
    if (!videoUrl) return "https://www.youtube.com";
    if (ytId) return `https://www.youtube.com/watch?v=${ytId}`;
    return videoUrl;
  };

  const handleCardClick = (e) => {
    if (e) e.stopPropagation();
    // For pure audio file without YouTube, invoke onPlay if provided
    if (isAudio && !isYoutube && onPlay) {
      onPlay(lecture);
      return;
    }
    // Direct navigation to YouTube in new tab
    const dest = getDestinationUrl();
    window.open(dest, "_blank", "noopener,noreferrer");
  };

  const handleShare = (e) => {
    e.stopPropagation();
    const shareUrl = getDestinationUrl();
    const shareText = `${title}\n${
      isRTL ? "مفتی فیضان سرور مصباحی کا خطاب" : "Lecture by Mufti Faizan Sarwar"
    }`;

    if (navigator.share) {
      navigator
        .share({
          title,
          text: shareText,
          url: shareUrl,
        })
        .catch(() => {});
    } else if (navigator.clipboard) {
      navigator.clipboard.writeText(`${shareText}\n${shareUrl}`);
      setCopied(true);
      toast.success(
        isRTL ? "یوٹیوب ویڈیو لنک کاپی ہو گیا!" : "YouTube video link copied!"
      );
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const categoryLabel =
    LECTURE_CATEGORY_TRANSLATIONS[category] ||
    category ||
    (isRTL ? "خطاب" : "Lecture");

  const targetUrl = getDestinationUrl();

  return (
    <div
      dir={isRTL ? "rtl" : "ltr"}
      onClick={handleCardClick}
      className="group rounded-2xl overflow-hidden border flex flex-col justify-between transition-all duration-300 hover:shadow-xl hover:-translate-y-1 cursor-pointer select-none"
      style={{
        backgroundColor: COLORS.white,
        borderColor: COLORS.border,
        boxShadow: "0 2px 8px rgba(74,55,40,0.06)",
      }}
      role="link"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          handleCardClick(e);
        }
      }}
      title={isRTL ? "یوٹیوب پر دیکھنے کے لیے کلک کریں" : "Click to watch on YouTube"}
    >
      {/* Thumbnail with Rich YouTube Badges & Play Overlay */}
      <div className="relative aspect-video w-full bg-slate-900 shrink-0 overflow-hidden">
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

        {/* Gradient Vignette */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/25 to-black/15 pointer-events-none" />

        {/* Top Badges: Category & YouTube pill */}
        <div className="absolute top-3 inset-x-3 flex items-center justify-between pointer-events-none z-10">
          <span
            className="text-[10px] font-bold px-2.5 py-1 rounded-full flex items-center gap-1.5 shadow-md backdrop-blur-md border border-white/10"
            style={{
              backgroundColor: isAudio ? "rgba(43, 33, 24, 0.85)" : "rgba(0, 0, 0, 0.7)",
              color: isAudio ? COLORS.secondary : "#FFFFFF",
            }}
          >
            {isAudio ? (
              <Music className="w-3 h-3 text-amber-400" />
            ) : (
              <Video className="w-3 h-3 text-red-400" />
            )}
            <span>{categoryLabel}</span>
          </span>

          <span className="flex items-center gap-1 bg-red-600 text-white text-[10px] font-bold px-2.5 py-0.5 rounded-full shadow-md uppercase tracking-wider">
            <Youtube size={12} fill="currentColor" />
            <span>YouTube</span>
          </span>
        </div>

        {/* Center YouTube Play Button Overlay */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <div
            className="w-13 h-13 sm:w-14 sm:h-14 rounded-full flex items-center justify-center shadow-2xl transition-all duration-300 group-hover:scale-110 group-hover:shadow-[0_0_25px_rgba(255,0,0,0.5)] border-2 border-white/40"
            style={{
              background: "linear-gradient(135deg, #FF0000 0%, #C80000 100%)",
            }}
          >
            <Play className={`w-6 h-6 fill-white text-white ${isRTL ? "-mr-0.5" : "-ml-0.5"}`} />
          </div>
        </div>

        {/* Bottom Hover Tooltip hint */}
        <div className="absolute bottom-2.5 inset-x-0 mx-auto w-max pointer-events-none z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <span className="bg-black/85 backdrop-blur-xs text-white text-[10px] font-semibold px-3 py-1 rounded-full flex items-center gap-1.5 shadow-lg border border-white/10">
            <span>{isRTL ? "یوٹیوب پر دیکھیں" : "Watch on YouTube"}</span>
            <ExternalLink className="w-3 h-3 text-red-400" />
          </span>
        </div>
      </div>

      {/* Card Content Body */}
      <div className="p-4 sm:p-5 flex flex-col flex-1 justify-between gap-3">
        <div>
          {/* Meta: Date & Speaker */}
          <div
            className="flex items-center justify-between text-xs mb-2.5"
            style={{ color: COLORS.textSecondary }}
          >
            {formattedDate && (
              <span className="flex items-center gap-1 font-medium">
                <Calendar className="w-3.5 h-3.5" style={{ color: COLORS.accent }} />
                {formattedDate}
              </span>
            )}
            <span
              className="flex items-center gap-1 font-semibold"
              style={{ color: COLORS.primary }}
            >
              <User className="w-3.5 h-3.5" style={{ color: COLORS.accent }} />
              {isRTL ? "مفتی فیضان سرور مصباحی" : "Mufti Faizan Sarwar"}
            </span>
          </div>

          {/* Title */}
          <h3
            className="font-bold text-base sm:text-lg font-serif leading-[1.8] line-clamp-2 transition-colors duration-200 group-hover:text-red-700 mb-2"
            style={{ color: COLORS.primary }}
          >
            {title}
          </h3>

          {/* Description */}
          {description && (
            <p
              className="text-xs sm:text-sm font-normal leading-[1.9] line-clamp-2 mb-2"
              style={{ color: COLORS.textSecondary }}
            >
              {description}
            </p>
          )}
        </div>

        {/* Actions Footer */}
        <div
          className="pt-3 border-t flex items-center justify-between gap-2"
          style={{ borderColor: `${COLORS.border}50` }}
        >
          {/* Primary Action Button: Watch on YouTube */}
          <a
            href={targetUrl}
            target="_blank"
            rel="noopener noreferrer"
            onClick={(e) => e.stopPropagation()}
            className="inline-flex items-center gap-2 px-3.5 py-1.5 sm:px-4 sm:py-2 rounded-xl text-xs font-bold text-white shadow-sm transition-all duration-200 hover:shadow-md hover:brightness-110 active:scale-95 cursor-pointer"
            style={{
              background: "linear-gradient(135deg, #FF0000 0%, #CC0000 100%)",
            }}
          >
            <Youtube className="w-4 h-4 fill-current shrink-0" />
            <span>{isRTL ? "یوٹیوب پر دیکھیں" : "Watch on YouTube"}</span>
            <ExternalLink className="w-3 h-3 opacity-90 shrink-0" />
          </a>

          {/* Secondary Action: Share Video Link */}
          <button
            type="button"
            onClick={handleShare}
            title={isRTL ? "لنک شیئر کریں" : "Share video link"}
            className="p-2 rounded-xl border transition-all duration-200 hover:bg-black/5 active:scale-95 cursor-pointer flex items-center justify-center text-slate-700 hover:text-red-600 shadow-2xs"
            style={{
              borderColor: `${COLORS.border}70`,
              backgroundColor: COLORS.white,
            }}
            aria-label="Share video link"
          >
            {copied ? (
              <Check className="w-4 h-4 text-emerald-600" />
            ) : (
              <Share2 className="w-4 h-4" />
            )}
          </button>
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
