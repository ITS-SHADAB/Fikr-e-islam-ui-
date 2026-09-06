import React, { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import {
  Play,
  X,
  Music,
  Share2,
  ExternalLink,
  Calendar,
  User,
  Video,
  Youtube,
  Radio,
  Tv,
} from "lucide-react";
import toast from "react-hot-toast";
import { getLectures } from "@/services";
import { useSettings } from "@/hooks/useSettings";
import { LectureCard, SectionSidebar, SectionLoader } from "@/components";
import { COLORS } from "@/utils/themeColors";
import { LECTURE_CATEGORIES, LECTURE_CATEGORY_TRANSLATIONS } from "@/utils/categories";

export default function LecturesList() {
  const { settings } = useSettings();
  const language =
    settings?.language === "ur" || settings?.language === "Urdu" ? "ur" : "en";
  const isRTL = language === "ur";
  const [searchParams] = useSearchParams();
  const queryCategory = searchParams.get("category");

  const [lectures, setLectures] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [activeMedia, setActiveMedia] = useState(null);

  useEffect(() => {
    if (queryCategory !== null) {
      setSelectedCategory(queryCategory);
    } else {
      setSelectedCategory("");
    }
  }, [queryCategory]);

  const categories = LECTURE_CATEGORIES;

  const loadLectures = async (
    category = selectedCategory,
    search = searchTerm
  ) => {
    try {
      setLoading(true);
      setError(null);
      const data = await getLectures({ category, search });
      setLectures(Array.isArray(data) ? data : []);
    } catch (err) {
      setError(
        err.response?.data?.message || err.message || "Failed to load lectures"
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadLectures(selectedCategory, searchTerm);
  }, [selectedCategory]);

  const handleSearchSubmit = (e) => {
    e?.preventDefault();
    loadLectures(selectedCategory, searchTerm);
  };

  const handleCategoryChange = (category) => {
    setSelectedCategory(category);
    loadLectures(category, searchTerm);
  };

  const isAudioMedia = (cat = "") => {
    return cat === "Audio Lectures" || cat === "Bayan Recordings";
  };

  const getYoutubeTargetUrl = (url = "") => {
    if (!url) return settings?.socialLinks?.youtube || "https://www.youtube.com";
    const ytRegExp =
      /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|shorts\/|&v=)([^#&?]*).*/;
    const match = url.match(ytRegExp);
    if (match && match[2].length === 11) {
      return `https://www.youtube.com/watch?v=${match[2]}`;
    }
    return url;
  };

  const handleLectureAction = (lecture) => {
    if (!lecture) return;
    const isAudio =
      isAudioMedia(lecture.category) &&
      !lecture.videoUrl?.includes("youtube") &&
      !lecture.videoUrl?.includes("youtu.be");

    if (isAudio) {
      setActiveMedia(lecture);
    } else {
      // Navigate directly to YouTube in a new tab — never embed or open on this page
      const targetUrl = getYoutubeTargetUrl(lecture.videoUrl);
      window.open(targetUrl, "_blank", "noopener,noreferrer");
    }
  };

  const handleShare = (lecture) => {
    if (!lecture) return;
    const shareUrl = getYoutubeTargetUrl(lecture.videoUrl);
    const shareText = `${lecture.title}\n${
      isRTL ? "مفتی فیضان سرور مصباحی کا خطاب" : "Lecture by Mufti Faizan Sarwar"
    }`;

    if (navigator.share) {
      navigator.share({
        title: lecture.title,
        text: shareText,
        url: shareUrl,
      });
    } else {
      navigator.clipboard?.writeText(`${shareText}\n${shareUrl}`);
      toast.success(isRTL ? "یوٹیوب لنک کاپی ہو گیا!" : "YouTube link copied!");
    }
  };

  const youtubeChannelUrl =
    settings?.socialLinks?.youtube || "https://www.youtube.com";

  return (
    <div
      dir={isRTL ? "rtl" : "ltr"}
      className="bg-background py-8 md:py-12 min-h-screen"
      style={{ backgroundColor: COLORS.background }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header Title */}
        <div className="mb-8 md:mb-10 text-center">
          <span
            className="text-xs font-bold uppercase tracking-widest block mb-1.5 font-serif"
            style={{ color: COLORS.accent }}
          >
            {isRTL ? "ملٹی میڈیا لائبریری" : "MULTIMEDIA LIBRARY"}
          </span>
          <div className="flex items-center justify-center gap-4 mb-2.5">
            <span
              style={{ color: COLORS.accent }}
              className="text-2xl select-none"
            >
              ❖
            </span>
            <h1
              className="text-3xl sm:text-4xl lg:text-5xl font-extrabold font-serif"
              style={{ color: COLORS.primary }}
            >
              {isRTL ? "خطابات اور بیانات" : "Lectures & Sermons"}
            </h1>
            <span
              style={{ color: COLORS.accent }}
              className="text-2xl select-none"
            >
              ❖
            </span>
          </div>
          <p
            className="text-xs sm:text-sm font-light max-w-xl mx-auto leading-relaxed"
            style={{ color: COLORS.textSecondary }}
          >
            {isRTL
              ? "مفتی فیضان سرور مصباحی کے تمام باضابطہ ویڈیو بیانات، خطباتِ جمعہ اور علمی دروس یوٹیوب پر دیکھیں۔"
              : "Explore official video lectures, Friday sermons, and Islamic scholarly discourses on YouTube."}
          </p>
        </div>

        {/* YouTube Channel Hero Showcase Banner */}
        <div
          className="mb-10 rounded-3xl p-6 sm:p-8 border shadow-xs flex flex-col md:flex-row items-center justify-between gap-6 relative overflow-hidden transition-all"
          style={{
            backgroundColor: COLORS.white,
            borderColor: `${COLORS.border}70`,
          }}
        >
          {/* Subtle YouTube Watermark */}
          <div className="absolute -right-6 -bottom-6 opacity-5 pointer-events-none select-none">
            <Youtube className="w-48 h-48 text-red-600" />
          </div>

          <div className="flex flex-col sm:flex-row items-center sm:items-start gap-5 text-center sm:text-start relative z-10">
            <div className="w-16 h-16 sm:w-18 sm:h-18 rounded-2xl flex items-center justify-center text-white shadow-lg shadow-red-600/25 shrink-0 bg-gradient-to-tr from-red-650 to-red-500" style={{ background: "linear-gradient(135deg, #FF0000 0%, #C00000 100%)" }}>
              <Youtube className="w-9 h-9 fill-white" />
            </div>

            <div className="space-y-1.5">
              <div className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full text-[11px] font-bold bg-red-50 text-red-600 border border-red-200 uppercase tracking-wider">
                <span className="w-2 h-2 rounded-full bg-red-600 animate-pulse" />
                <span>{isRTL ? "آفیشل یوٹیوب چینل" : "Official YouTube Channel"}</span>
              </div>
              <h2
                className="text-xl sm:text-2xl font-black font-serif"
                style={{ color: COLORS.primary }}
              >
                {isRTL ? "مفتی فیضان سرور آفیشل یوٹیوب چینل" : "Mufti Faizan Sarwar Official Channel"}
              </h2>
              <p
                className="text-xs sm:text-sm font-light max-w-xl leading-relaxed"
                style={{ color: COLORS.textSecondary }}
              >
                {isRTL
                  ? "ہمارے تمام نئے بیانات، قرآنی دروس اور فتاویٰ سیشنز براہِ راست یوٹیوب پر دیکھنے کے لیے آفیشل چینل سبسکرائب کریں۔"
                  : "Watch all weekly lectures, Quranic lessons, and fatwa sessions directly on YouTube. Subscribe now."}
              </p>
            </div>
          </div>

          <div className="relative z-10 shrink-0">
            <a
              href={youtubeChannelUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2.5 px-6 py-3 rounded-xl font-bold text-xs sm:text-sm text-white shadow-md hover:shadow-xl hover:brightness-110 active:scale-95 transition-all duration-200 uppercase tracking-wider cursor-pointer"
              style={{
                background: "linear-gradient(135deg, #FF0000 0%, #CC0000 100%)",
              }}
            >
              <Youtube className="w-5 h-5 fill-current" />
              <span>{isRTL ? "چینل سبسکرائب کریں" : "Subscribe on YouTube"}</span>
              <ExternalLink className="w-4 h-4 opacity-80" />
            </a>
          </div>
        </div>

        {/* Two-column layout (Sidebar on Side, Content Area) */}
        <div className="flex flex-col lg:flex-row gap-8 items-start">
          {/* UNIFIED SIDEBAR */}
          <SectionSidebar
            searchTerm={searchTerm}
            onSearchChange={setSearchTerm}
            onSearchSubmit={handleSearchSubmit}
            onClearSearch={() => {
              setSearchTerm("");
              loadLectures(selectedCategory, "");
            }}
            searchPlaceholder={
              isRTL ? "بیانات تلاش کریں..." : "Search lectures..."
            }
            searchLabel={isRTL ? "بیانات تلاش کریں" : "Search Lectures"}
            allLabel={isRTL ? "تمام بیانات" : "All Lectures"}
            categoriesLabel={isRTL ? "شعبہ جات / فارمیٹس" : "Categories"}
            categories={categories}
            selectedCategory={selectedCategory}
            onCategoryChange={handleCategoryChange}
            isRTL={isRTL}
            icon={Play}
            totalCount={lectures.length}
          />

          {/* MAIN: Lecture Cards Grid */}
          <div className="flex-1 min-w-0 w-full">
            {loading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
                <SectionLoader type="lecture" count={6} />
              </div>
            ) : lectures && lectures.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
                {lectures.map((lecture) => (
                  <LectureCard
                    key={lecture._id}
                    lecture={lecture}
                    onPlay={handleLectureAction}
                  />
                ))}
              </div>
            ) : (
              <div
                className="text-center py-16 rounded-2xl border p-8 shadow-xs"
                style={{
                  backgroundColor: COLORS.white,
                  borderColor: COLORS.border,
                }}
              >
                <div
                  className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4"
                  style={{ backgroundColor: `${COLORS.primary}10` }}
                >
                  <Youtube
                    className="w-8 h-8"
                    style={{ color: COLORS.accent }}
                  />
                </div>
                <h3
                  className="text-lg font-bold font-serif mb-1.5"
                  style={{ color: COLORS.textPrimary }}
                >
                  {isRTL ? "کوئی بیان نہیں ملا" : "No lectures found"}
                </h3>
                <p
                  className="text-xs max-w-sm mx-auto"
                  style={{ color: COLORS.textSecondary }}
                >
                  {isRTL
                    ? "براہ کرم فارمیٹ فلٹر بیجز یا تلاش کے الفاظ تبدیل کر کے دوبارہ کوشش کریں۔"
                    : "Please modify filters or search terms to find lectures."}
                </p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Audio-only modal (only displays if an audio lecture without YouTube is selected) */}
      {activeMedia && isAudioMedia(activeMedia.category) && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-xs p-4 animate-fade-in"
          onClick={() => setActiveMedia(null)}
          dir={isRTL ? "rtl" : "ltr"}
        >
          <div
            className="rounded-3xl border-2 shadow-2xl overflow-hidden w-full max-w-2xl relative flex flex-col"
            style={{
              backgroundColor: COLORS.white,
              borderColor: COLORS.accent,
            }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div
              className="px-5 py-4 flex items-center justify-between border-b"
              style={{
                backgroundColor: COLORS.primary,
                borderColor: `${COLORS.accent}40`,
              }}
            >
              <div className="flex items-center gap-2.5 overflow-hidden pe-3">
                <span
                  className="text-[10px] font-bold px-2.5 py-1 rounded-full uppercase tracking-wider shrink-0"
                  style={{
                    backgroundColor: COLORS.accent,
                    color: COLORS.white,
                  }}
                >
                  {LECTURE_CATEGORY_TRANSLATIONS[activeMedia.category] ||
                    activeMedia.category}
                </span>
                <h3 className="font-bold text-sm sm:text-base font-serif text-white truncate">
                  {activeMedia.title}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setActiveMedia(null)}
                className="p-1.5 rounded-full text-white/80 hover:text-white hover:bg-white/10 cursor-pointer shrink-0 transition-colors"
                aria-label="Close Player"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Audio Player Area */}
            <div className="w-full flex flex-col items-center justify-center bg-gradient-to-b from-slate-900 to-slate-950 p-8 text-center gap-6">
              <div
                className="w-20 h-20 rounded-full flex items-center justify-center shadow-2xl border-2 border-accent/60 animate-pulse"
                style={{
                  backgroundColor: COLORS.primary,
                  color: COLORS.accent,
                }}
              >
                <Music className="w-10 h-10" />
              </div>
              <div className="space-y-1.5 max-w-md">
                <span
                  className="text-xs font-bold uppercase tracking-wider block font-serif"
                  style={{ color: COLORS.accent }}
                >
                  {isRTL ? "آڈیو بیان" : "Audio Recording"}
                </span>
                <h4 className="text-white font-serif text-base line-clamp-1 font-bold">
                  {activeMedia.title}
                </h4>
              </div>
              <div className="w-full max-w-md">
                <audio
                  controls
                  className="w-full rounded-xl shadow-lg"
                  autoPlay
                  src={
                    activeMedia.videoUrl ||
                    activeMedia.url ||
                    activeMedia.audioUrl
                  }
                >
                  Your browser does not support the audio element.
                </audio>
              </div>
            </div>

            {/* Modal Footer Info */}
            <div
              className="p-4 sm:p-5 flex flex-col gap-3 border-t"
              style={{
                borderColor: COLORS.border,
                backgroundColor: COLORS.background,
              }}
            >
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div className="flex items-center gap-4 text-xs">
                  <span
                    className="font-bold font-serif flex items-center gap-1.5"
                    style={{ color: COLORS.primary }}
                  >
                    <User className="w-4 h-4" style={{ color: COLORS.accent }} />
                    {isRTL ? "مفتی فیضان سرور مصباحی" : "Mufti Faizan Sarwar"}
                  </span>
                  {activeMedia.publishDate && (
                    <span
                      className="flex items-center gap-1 font-medium"
                      style={{ color: COLORS.textSecondary }}
                    >
                      <Calendar className="w-3.5 h-3.5" />
                      {new Date(activeMedia.publishDate).toLocaleDateString(
                        isRTL ? "ur-PK" : "en-US",
                        { year: "numeric", month: "short", day: "numeric" }
                      )}
                    </span>
                  )}
                </div>

                <button
                  type="button"
                  onClick={() => handleShare(activeMedia)}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border text-xs font-bold hover:bg-white transition-colors cursor-pointer shadow-2xs"
                  style={{
                    borderColor: COLORS.border,
                    color: COLORS.primary,
                    backgroundColor: COLORS.white,
                  }}
                >
                  <Share2 className="w-3.5 h-3.5" style={{ color: COLORS.accent }} />
                  <span>{isRTL ? "شیئر کریں" : "Share"}</span>
                </button>
              </div>

              {activeMedia.description && (
                <p
                  className="text-xs leading-[2] font-normal line-clamp-3 pt-1 border-t"
                  style={{
                    color: COLORS.textSecondary,
                    borderColor: `${COLORS.border}70`,
                  }}
                >
                  {activeMedia.description}
                </p>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
