import React from "react";
import PropTypes from "prop-types";
import { motion, AnimatePresence } from "framer-motion";
import {
  FileText,
  BookOpen,
  HelpCircle,
  Video,
  Calendar,
  Scale,
  Search,
  AlertCircle,
  Loader2,
  ExternalLink,
  ChevronLeft,
  ChevronRight,
  Sparkles,
} from "lucide-react";

/**
 * Type-specific badges, icons, and labels for search results
 */
const TYPE_CONFIG = {
  fatwa: {
    labelUrdu: "فتویٰ",
    labelEn: "Fatwa",
    icon: Scale,
    badgeCls: "bg-amber-500/15 text-amber-300 border-amber-500/40",
    iconColor: "text-amber-400",
  },
  article: {
    labelUrdu: "مضمون",
    labelEn: "Article",
    icon: FileText,
    badgeCls: "bg-[#C5A572]/20 text-[#DFC8A4] border-[#A8793E]/50",
    iconColor: "text-[#DFC8A4]",
  },
  book: {
    labelUrdu: "کتاب",
    labelEn: "Book",
    icon: BookOpen,
    badgeCls: "bg-emerald-500/15 text-emerald-300 border-emerald-500/40",
    iconColor: "text-emerald-400",
  },
  lecture: {
    labelUrdu: "بیان",
    labelEn: "Lecture",
    icon: Video,
    badgeCls: "bg-sky-500/15 text-sky-300 border-sky-500/40",
    iconColor: "text-sky-400",
  },
  event: {
    labelUrdu: "پروگرام",
    labelEn: "Event",
    icon: Calendar,
    badgeCls: "bg-rose-500/15 text-rose-300 border-rose-500/40",
    iconColor: "text-rose-400",
  },
  question: {
    labelUrdu: "سوال و جواب",
    labelEn: "Q&A",
    icon: HelpCircle,
    badgeCls: "bg-cyan-500/15 text-cyan-300 border-cyan-500/40",
    iconColor: "text-cyan-400",
  },
};

const DEFAULT_TYPE_CONFIG = {
  labelUrdu: "مواد",
  labelEn: "Content",
  icon: Sparkles,
  badgeCls: "bg-stone-500/15 text-stone-300 border-stone-500/40",
  iconColor: "text-stone-300",
};

/**
 * Safe frontend route resolver for search results
 */
export const resolveResultUrl = (result) => {
  if (!result) return "/";
  const { type, slug, url } = result;

  if (type === "article") {
    return slug ? `/articles/${slug}` : url || "/articles";
  }

  if (type === "fatwa") {
    return slug ? `/fatwas/${slug}` : url || "/fatwas";
  }

  if (type === "book") {
    // Frontend route is /publications/:slug (also aliased to /books/:slug)
    return slug ? `/publications/${slug}` : url || "/publications";
  }

  if (type === "question") {
    // Frontend route is /qa/:slug (also aliased to /questions/:slug)
    return slug ? `/qa/${slug}` : url || "/qa";
  }

  if (type === "event") {
    return "/events";
  }

  if (type === "lecture") {
    // If backend provided an external YouTube link, preserve it
    if (url && (url.startsWith("http://") || url.startsWith("https://"))) {
      return url;
    }
    return "/lectures";
  }

  return url || "/";
};

export default function HeaderSearchResults({
  isOpen,
  isLoading,
  error,
  results = [],
  query = "",
  selectedIndex = -1,
  onSelectResult,
  onClose,
  isUrdu = true,
  mode = "desktop",
}) {
  if (!isOpen) return null;

  const trimmedQuery = query.trim();
  const isShortQuery = trimmedQuery.length > 0 && trimmedQuery.length < 2;

  // Arrow indicator based on direction
  const DirectionArrow = isUrdu ? ChevronLeft : ChevronRight;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: -6, scale: 0.98 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: -6, scale: 0.98 }}
        transition={{ duration: 0.15 }}
        onClick={(e) => e.stopPropagation()}
        className={`bg-[#2B2118] border border-[#A8793E] shadow-2xl rounded-2xl text-[#F7F1E8] z-50 overflow-hidden flex flex-col ${
          mode === "mobile"
            ? "absolute top-full left-1 right-1 sm:left-3 sm:right-3 mt-1.5 max-h-[calc(100dvh-120px)]"
            : "absolute top-full mt-2 right-0 left-auto w-[420px] sm:w-[460px] max-w-[90vw] max-h-[480px]"
        }`}
        dir={isUrdu ? "rtl" : "ltr"}
      >
        {/* Results Header / Summary */}
        <div className="px-3.5 py-2 border-b border-[#A8793E]/25 bg-[#241A13] flex items-center justify-between text-xs shrink-0 select-none">
          <div className="flex items-center gap-1.5 text-[#DFC8A4] font-medium">
            <Search className="w-3.5 h-3.5 text-[#A8793E]" />
            <span>
              {isUrdu ? "تلاش کے نتائج" : "Search Results"}
            </span>
            {trimmedQuery && (
              <span className="text-[#DFC8A4]/70 truncate max-w-[140px] sm:max-w-[180px]">
                ({trimmedQuery})
              </span>
            )}
          </div>

          {isLoading ? (
            <div className="flex items-center gap-1 text-[11px] text-[#A8793E]">
              <Loader2 className="w-3 h-3 animate-spin text-[#DFC8A4]" />
              <span>{isUrdu ? "تلاش جاری ہے..." : "Searching..."}</span>
            </div>
          ) : results.length > 0 ? (
            <span className="text-[11px] px-2 py-0.5 rounded-full bg-[#3D2E22] text-[#DFC8A4] border border-[#A8793E]/40 font-sans font-semibold">
              {results.length} {isUrdu ? "نتائج" : "found"}
            </span>
          ) : null}
        </div>

        {/* Scrollable Results Body */}
        <div className="overflow-y-auto overscroll-contain flex-1 divide-y divide-[#A8793E]/15 scrollbar-thin scrollbar-thumb-[#A8793E]/40 scrollbar-track-transparent">
          {/* 1. Loading State */}
          {isLoading && results.length === 0 && (
            <div className="p-4 space-y-3">
              {[1, 2, 3].map((i) => (
                <div
                  key={i}
                  className="flex items-start gap-2.5 animate-pulse"
                >
                  <div className="w-10 h-10 rounded-lg bg-[#3D2E22] shrink-0" />
                  <div className="flex-1 space-y-2">
                    <div className="h-3.5 bg-[#3D2E22] rounded w-3/4" />
                    <div className="h-2.5 bg-[#3D2E22] rounded w-1/2" />
                    <div className="h-2 bg-[#3D2E22] rounded w-full" />
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* 2. Error State */}
          {!isLoading && error && (
            <div className="p-6 text-center space-y-2 select-none">
              <div className="w-10 h-10 rounded-full bg-rose-500/15 border border-rose-500/30 flex items-center justify-center mx-auto text-rose-400">
                <AlertCircle className="w-5 h-5" />
              </div>
              <p className="text-xs text-rose-200 font-medium">
                {isUrdu
                  ? "تلاش کے دوران مسئلہ پیش آیا۔ براہِ کرم دوبارہ کوشش کریں۔"
                  : "Unable to search right now. Please try again."}
              </p>
            </div>
          )}

          {/* 3. Short Query Hint (< 2 characters) */}
          {isShortQuery && (
            <div className="p-5 text-center text-xs text-[#DFC8A4]/70 select-none">
              {isUrdu
                ? "براہِ کرم کم از کم 2 حروف درج کریں..."
                : "Please enter at least 2 characters..."}
            </div>
          )}

          {/* 4. Empty Results State */}
          {!isLoading && !error && !isShortQuery && results.length === 0 && trimmedQuery.length >= 2 && (
            <div className="p-6 text-center space-y-2 select-none">
              <div className="w-10 h-10 rounded-full bg-[#3D2E22] border border-[#A8793E]/30 flex items-center justify-center mx-auto text-[#DFC8A4]">
                <Search className="w-5 h-5 text-[#A8793E]" />
              </div>
              <p className="text-xs sm:text-sm font-semibold text-[#F7F1E8]">
                {isUrdu ? "کوئی نتیجہ نہیں ملا" : "No results found"}
              </p>
              <p className="text-[11px] text-[#DFC8A4]/70 max-w-[260px] mx-auto leading-relaxed">
                {isUrdu
                  ? `"${trimmedQuery}" کے لیے کوئی مواد دستیاب نہیں۔ مختلف الفاظ یا املا کے ساتھ کوشش کریں۔`
                  : `No matching content for "${trimmedQuery}". Try different keywords.`}
              </p>
            </div>
          )}

          {/* 5. Results List */}
          {!error &&
            results.map((item, index) => {
              const typeCfg =
                TYPE_CONFIG[item.type?.toLowerCase()] || DEFAULT_TYPE_CONFIG;
              const TypeIcon = typeCfg.icon;
              const isSelected = selectedIndex === index;
              const isExternal =
                item.type === "lecture" &&
                item.url &&
                (item.url.startsWith("http://") || item.url.startsWith("https://"));

              return (
                <div
                  key={item.id || item.slug || `${item.type}-${index}`}
                  role="button"
                  tabIndex={0}
                  onClick={() => onSelectResult(item)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" || e.key === " ") {
                      e.preventDefault();
                      onSelectResult(item);
                    }
                  }}
                  className={`group p-2.5 sm:p-3 flex items-start gap-2.5 cursor-pointer transition-colors duration-150 select-none ${
                    isSelected
                      ? "bg-[#3D2E22] text-[#F7F1E8]"
                      : "hover:bg-[#35271C] text-[#F7F1E8]/90"
                  }`}
                >
                  {/* Thumbnail / Type Icon Box */}
                  <div className="shrink-0 relative">
                    {item.image ? (
                      <img
                        src={item.image}
                        alt=""
                        className="w-10 h-10 sm:w-11 sm:h-11 rounded-lg object-cover border border-[#A8793E]/30 shrink-0 bg-[#3D2E22]"
                        onError={(e) => {
                          // Hide broken image and fall back to icon
                          e.currentTarget.style.display = "none";
                          if (e.currentTarget.nextSibling) {
                            e.currentTarget.nextSibling.style.display = "flex";
                          }
                        }}
                      />
                    ) : null}
                    <div
                      style={{ display: item.image ? "none" : "flex" }}
                      className="w-10 h-10 sm:w-11 sm:h-11 rounded-lg bg-[#3D2E22] border border-[#A8793E]/30 items-center justify-center shrink-0"
                    >
                      <TypeIcon className={`w-5 h-5 ${typeCfg.iconColor}`} />
                    </div>
                  </div>

                  {/* Text Details */}
                  <div className="flex-1 min-w-0 space-y-1">
                    {/* Badges: Type & Category */}
                    <div className="flex items-center gap-1.5 flex-wrap">
                      <span
                        className={`inline-flex items-center gap-1 text-[10px] font-bold px-1.5 py-0.5 rounded border leading-none ${typeCfg.badgeCls}`}
                      >
                        <TypeIcon className="w-2.5 h-2.5" />
                        <span>{isUrdu ? typeCfg.labelUrdu : typeCfg.labelEn}</span>
                      </span>

                      {item.category && (
                        <span className="text-[10px] text-[#DFC8A4]/80 px-1.5 py-0.5 rounded bg-black/20 border border-[#A8793E]/20 font-medium truncate max-w-[130px]">
                          {item.category}
                        </span>
                      )}
                    </div>

                    {/* Result Title */}
                    <h4
                      className="text-xs sm:text-sm font-semibold text-[#F7F1E8] group-hover:text-[#DFC8A4] transition-colors leading-snug line-clamp-2"
                      style={{
                        fontFamily: isUrdu
                          ? "'Noto Nastaliq Urdu', 'Noto Naskh Arabic', sans-serif"
                          : "inherit",
                      }}
                    >
                      {item.title}
                    </h4>

                    {/* Result Description (Truncated) */}
                    {item.description && (
                      <p className="text-[11px] text-[#DFC8A4]/70 line-clamp-2 leading-relaxed">
                        {item.description}
                      </p>
                    )}
                  </div>

                  {/* Action Icon Indicator */}
                  <div className="self-center shrink-0 text-[#A8793E] group-hover:text-[#DFC8A4] group-hover:scale-110 transition-all p-1">
                    {isExternal ? (
                      <ExternalLink className="w-3.5 h-3.5" />
                    ) : (
                      <DirectionArrow className="w-4 h-4" />
                    )}
                  </div>
                </div>
              );
            })}
        </div>

        {/* Footer info: Press Esc to close */}
        <div className="px-3 py-1.5 bg-[#241A13] border-t border-[#A8793E]/25 text-[10px] text-[#DFC8A4]/60 flex items-center justify-between shrink-0 select-none">
          <span>
            {isUrdu ? "نیویگیٹ کرنے کے لیے کلک کریں" : "Click to view result"}
          </span>
          <button
            type="button"
            onClick={onClose}
            className="hover:text-[#F7F1E8] cursor-pointer"
          >
            {isUrdu ? "بند کریں (Esc)" : "Close (Esc)"}
          </button>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}

HeaderSearchResults.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  isLoading: PropTypes.bool.isRequired,
  error: PropTypes.string,
  results: PropTypes.arrayOf(
    PropTypes.shape({
      type: PropTypes.string,
      id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
      title: PropTypes.string,
      slug: PropTypes.string,
      category: PropTypes.string,
      description: PropTypes.string,
      image: PropTypes.string,
      author: PropTypes.string,
      date: PropTypes.string,
      url: PropTypes.string,
      score: PropTypes.number,
    })
  ),
  query: PropTypes.string,
  selectedIndex: PropTypes.number,
  onSelectResult: PropTypes.func.isRequired,
  onClose: PropTypes.func.isRequired,
  isUrdu: PropTypes.bool,
  mode: PropTypes.oneOf(["desktop", "mobile"]),
};
