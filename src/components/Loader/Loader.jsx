import React from "react";
import { COLORS } from "@/utils/themeColors";

/**
 * Modern shimmering skeleton for cards and sections
 */
export function Skeleton({ className = "", style = {} }) {
  return (
    <div
      className={`relative overflow-hidden bg-neutral-200/70 dark:bg-neutral-800/60 rounded-xl ${className}`}
      style={style}
    >
      <div className="absolute inset-0 -translate-x-full animate-[shimmer_1.8s_infinite] bg-gradient-to-r from-transparent via-white/40 to-transparent" />
    </div>
  );
}

/**
 * Spinner with primary & accent theme colors
 */
export function Spinner({ size = "md", text = "" }) {
  const sizeClasses = {
    sm: "w-5 h-5 border-2",
    md: "w-8 h-8 border-[3px]",
    lg: "w-12 h-12 border-4",
  };

  return (
    <div className="flex flex-col items-center justify-center py-8 gap-3">
      <div
        className={`${sizeClasses[size] || sizeClasses.md} rounded-full animate-spin`}
        style={{
          borderColor: `${COLORS.secondary || "#D9CFC1"}40`,
          borderTopColor: COLORS.primary || "#4A3728",
        }}
      />
      {text && (
        <p
          className="text-xs sm:text-sm font-bold font-serif tracking-wider animate-pulse"
          style={{ color: COLORS.textSecondary || "#6B5B4B" }}
        >
          {text}
        </p>
      )}
    </div>
  );
}

/**
 * Card Skeleton tailored to specific content types
 */
export function CardSkeleton({ type = "article" }) {
  if (type === "publication") {
    return (
      <div className="rounded-2xl border border-neutral-200/80 bg-white p-5 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row gap-5 items-start">
          <Skeleton className="w-24 h-32 sm:w-28 sm:h-38 rounded-xl shrink-0" />
          <div className="flex-1 space-y-3 w-full">
            <div className="flex justify-between items-center">
              <Skeleton className="w-20 h-5 rounded-full" />
              <Skeleton className="w-16 h-4 rounded-md" />
            </div>
            <Skeleton className="w-3/4 h-6 rounded-md" />
            <Skeleton className="w-full h-4 rounded-md" />
            <Skeleton className="w-5/6 h-4 rounded-md" />
            <div className="pt-2 flex gap-3">
              <Skeleton className="w-28 h-8 rounded-lg" />
              <Skeleton className="w-24 h-8 rounded-lg" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (type === "qa") {
    return (
      <div className="rounded-2xl border border-neutral-200/80 bg-white p-6 shadow-xs space-y-4 min-h-[220px] flex flex-col justify-between">
        <div className="space-y-3">
          <div className="flex justify-between items-center">
            <Skeleton className="w-20 h-5 rounded-full" />
            <Skeleton className="w-16 h-3 rounded-md" />
          </div>
          <Skeleton className="w-5/6 h-5 rounded-md" />
          <Skeleton className="w-full h-4 rounded-md" />
          <Skeleton className="w-4/5 h-4 rounded-md" />
        </div>
        <Skeleton className="w-28 h-4 rounded-md mt-2" />
      </div>
    );
  }

  if (type === "event") {
    return (
      <div className="rounded-2xl border border-neutral-200/80 bg-white p-5 shadow-xs space-y-3">
        <div className="flex justify-between items-start">
          <div className="flex items-center gap-3">
            <Skeleton className="w-12 h-12 rounded-xl shrink-0" />
            <div className="space-y-1.5">
              <Skeleton className="w-40 h-5 rounded-md" />
              <Skeleton className="w-24 h-3.5 rounded-md" />
            </div>
          </div>
          <Skeleton className="w-16 h-6 rounded-full" />
        </div>
        <Skeleton className="w-full h-4 rounded-md" />
      </div>
    );
  }

  if (type === "lecture") {
    return (
      <div className="rounded-2xl border border-neutral-200/80 bg-white overflow-hidden shadow-xs space-y-3">
        <Skeleton className="w-full h-44 rounded-t-2xl rounded-b-none" />
        <div className="p-4 space-y-3">
          <div className="flex justify-between items-center">
            <Skeleton className="w-20 h-5 rounded-full" />
            <Skeleton className="w-14 h-3 rounded-md" />
          </div>
          <Skeleton className="w-4/5 h-5 rounded-md" />
          <Skeleton className="w-full h-4 rounded-md" />
        </div>
      </div>
    );
  }

  // Default: Article / Fatwa card skeleton
  return (
    <div className="rounded-2xl border border-neutral-200/80 bg-white overflow-hidden shadow-xs space-y-3">
      <Skeleton className="w-full h-44 rounded-t-2xl rounded-b-none" />
      <div className="p-5 space-y-3">
        <div className="flex justify-between items-center">
          <Skeleton className="w-20 h-5 rounded-full" />
          <Skeleton className="w-16 h-3 rounded-md" />
        </div>
        <Skeleton className="w-4/5 h-5 rounded-md" />
        <Skeleton className="w-full h-4 rounded-md" />
        <Skeleton className="w-2/3 h-4 rounded-md" />
        <div className="pt-2 flex justify-between items-center border-t border-neutral-100">
          <Skeleton className="w-20 h-3 rounded-md" />
          <Skeleton className="w-16 h-4 rounded-md" />
        </div>
      </div>
    </div>
  );
}

/**
 * Grid or list loader for sections
 */
export function SectionLoader({ type = "article", count = 3, layout = "grid" }) {
  const items = Array.from({ length: count });

  if (layout === "list") {
    return (
      <div className="space-y-4 w-full">
        {items.map((_, i) => (
          <CardSkeleton key={i} type={type} />
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 w-full">
      {items.map((_, i) => (
        <CardSkeleton key={i} type={type} />
      ))}
    </div>
  );
}

export default SectionLoader;
