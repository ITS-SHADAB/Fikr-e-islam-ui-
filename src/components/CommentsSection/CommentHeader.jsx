import React from "react";
import { MessageSquare, ArrowUpDown, ChevronDown } from "lucide-react";
import { COLORS } from "@/utils/themeColors";

export default function CommentHeader({
  totalCount = 0,
  sort = "newest",
  onSortChange,
  isRTL = false,
}) {
  return (
    <div
      className="flex items-center justify-between pb-3.5 mb-4 border-b transition-colors"
      style={{ borderColor: `${COLORS.border}30` }}
    >
      {/* Title & Count Badge */}
      <div className="flex items-center gap-2.5">
        <div
          className="w-8 h-8 rounded-lg flex items-center justify-center border shadow-2xs"
          style={{
            backgroundColor: `${COLORS.accent}15`,
            borderColor: `${COLORS.accent}40`,
            color: COLORS.accent,
          }}
        >
          <MessageSquare className="w-4 h-4" />
        </div>
        <h3
          className="text-base sm:text-lg font-bold font-serif"
          style={{ color: COLORS.primary }}
        >
          {isRTL ? "تبصرے اور آراء" : "Comments"}
        </h3>
        <span
          className="text-xs font-semibold px-2 py-0.5 rounded-full border shadow-2xs"
          style={{
            backgroundColor: COLORS.secondary || "#F3E3D8",
            borderColor: `${COLORS.border}40`,
            color: COLORS.primary,
          }}
        >
          {totalCount}
        </span>
      </div>

      {/* Sort Selector */}
      {totalCount > 1 && (
        <div className="relative inline-flex items-center">
          <label
            htmlFor="comment-sort"
            className="sr-only"
          >
            {isRTL ? "ترتیب" : "Sort comments"}
          </label>
          <div
            className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg border text-xs font-medium cursor-pointer transition-colors hover:bg-white/80"
            style={{
              backgroundColor: "rgba(255, 255, 255, 0.6)",
              borderColor: `${COLORS.border}50`,
              color: COLORS.textSecondary,
            }}
          >
            <ArrowUpDown className="w-3.5 h-3.5 opacity-70" />
            <select
              id="comment-sort"
              value={sort}
              onChange={(e) => onSortChange && onSortChange(e.target.value)}
              className="bg-transparent border-none outline-none text-xs font-semibold cursor-pointer appearance-none pr-4"
              style={{ color: COLORS.primary }}
            >
              <option value="newest">
                {isRTL ? "تازہ ترین پہلے" : "Newest first"}
              </option>
              <option value="oldest">
                {isRTL ? "قدیم ترین پہلے" : "Oldest first"}
              </option>
            </select>
            <ChevronDown className="w-3 h-3 opacity-60 pointer-events-none -ml-3" />
          </div>
        </div>
      )}
    </div>
  );
}
