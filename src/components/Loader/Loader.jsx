import React from "react";
import { COLORS } from "@/utils/themeColors";

import logoImg from "@/assets/images/logo.jpeg";

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
 * Beautiful Branded Rounded Logo Spinner with gold spinning halo ring,
 * ambient aura glow, counter-rotating orbit, and rhythmic Urdu animations.
 */
export function Spinner({ size = "md", text = "" }) {
  const containerSizes = {
    xs: "w-9 h-9",
    sm: "w-12 h-12",
    md: "w-20 h-20",
    lg: "w-28 h-28",
    xl: "w-36 h-36",
  };

  const imgSizes = {
    xs: "w-6 h-6",
    sm: "w-8 h-8",
    md: "w-13 h-13",
    lg: "w-18 h-18",
    xl: "w-24 h-24",
  };

  const isMini = size === "xs" || size === "sm";

  return (
    <div className="flex flex-col items-center justify-center py-6 gap-3.5 select-none animate-fadeIn">
      <div
        className={`relative ${
          containerSizes[size] || containerSizes.md
        } p-2 flex items-center justify-center`}
      >
        {/* Ambient Warm Golden Aura Glow (only on md+) */}
        {!isMini && (
          <div
            className="absolute inset-[-6px] rounded-full pointer-events-none"
            style={{
              background:
                "radial-gradient(circle, rgba(168, 121, 62, 0.28) 0%, rgba(168, 121, 62, 0.08) 55%, transparent 75%)",
              animation: "loaderAuraPulse 3s ease-in-out infinite",
            }}
          />
        )}

        {/* Outer Orbiting Golden Halo (Clockwise) */}
        <div
          className="absolute inset-0 rounded-full animate-spin pointer-events-none"
          style={{
            borderWidth: isMini ? "2px" : "3px",
            borderStyle: "solid",
            borderColor: `${COLORS.accent || "#A8793E"}20`,
            borderTopColor: COLORS.accent || "#A8793E",
            borderRightColor: `${COLORS.accent || "#A8793E"}80`,
            animationDuration: isMini ? "1s" : "2.4s",
          }}
        >
          {/* Orbiting Golden Jewel Bead on the Ring */}
          {!isMini && (
            <div
              className="absolute -top-[3.5px] left-1/2 -translate-x-1/2 w-2 h-2 rounded-full"
              style={{
                backgroundColor: COLORS.accent || "#A8793E",
                boxShadow: `0 0 8px ${COLORS.accent || "#A8793E"}`,
              }}
            />
          )}
        </div>

        {/* Inner Counter-Rotating Subtle Dashed Ring (Counter-Clockwise) */}
        {!isMini && (
          <div
            className="absolute inset-1.5 rounded-full pointer-events-none"
            style={{
              border: "1px dashed rgba(168, 121, 62, 0.40)",
              animation: "loaderCounterSpin 7s linear infinite",
            }}
          />
        )}

        {/* Rounded Center Logo with p-2 padding and Gentle Float */}
        <div
          className="p-2 rounded-full relative z-10 flex items-center justify-center"
          style={{
            animation: !isMini ? "loaderLogoBreathe 3s ease-in-out infinite" : "none",
          }}
        >
          <img
            src={logoImg}
            alt="Loading..."
            className={`${
              imgSizes[size] || imgSizes.md
            } rounded-full object-cover shadow-md border-2 border-[#A8793E]/80`}
          />
        </div>
      </div>

      {/* Urdu Label with Rhythmic Bouncing Dots and Ornamental Line */}
      {text && (
        <div className="flex flex-col items-center gap-1.5 mt-1" dir="rtl">
          <div className="flex items-center gap-2">
            <p
              className="text-xs sm:text-sm font-bold font-urdu tracking-wide"
              style={{ color: COLORS.textPrimary || "#2A211A" }}
            >
              {text}
            </p>

            {/* 3 Sequential Rhythmic Pulsing Jewel Dots */}
            <div className="flex items-center gap-1 shrink-0 pt-0.5" aria-hidden="true">
              <span
                className="w-1.5 h-1.5 rounded-full"
                style={{
                  backgroundColor: COLORS.accent || "#A8793E",
                  animation: "loaderDotBounce 1.4s infinite ease-in-out both",
                  animationDelay: "0s",
                }}
              />
              <span
                className="w-1.5 h-1.5 rounded-full"
                style={{
                  backgroundColor: COLORS.accent || "#A8793E",
                  animation: "loaderDotBounce 1.4s infinite ease-in-out both",
                  animationDelay: "0.2s",
                }}
              />
              <span
                className="w-1.5 h-1.5 rounded-full"
                style={{
                  backgroundColor: COLORS.accent || "#A8793E",
                  animation: "loaderDotBounce 1.4s infinite ease-in-out both",
                  animationDelay: "0.4s",
                }}
              />
            </div>
          </div>

          {/* Elegant Tapered Gold Accent Underline */}
          {!isMini && (
            <div
              className="h-[1.5px] w-20 rounded-full"
              style={{
                background: `linear-gradient(90deg, transparent, ${COLORS.accent || "#A8793E"}80, transparent)`,
              }}
            />
          )}
        </div>
      )}

      {/* Inlined Scoped Keyframes */}
      <style>{`
        @keyframes loaderAuraPulse {
          0%, 100% { transform: scale(0.95); opacity: 0.35; }
          50% { transform: scale(1.15); opacity: 0.75; }
        }
        @keyframes loaderCounterSpin {
          0% { transform: rotate(360deg); }
          100% { transform: rotate(0deg); }
        }
        @keyframes loaderLogoBreathe {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.04); }
        }
        @keyframes loaderDotBounce {
          0%, 80%, 100% { transform: scale(0.65); opacity: 0.35; }
          40% { transform: scale(1.25); opacity: 1; }
        }
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(4px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
}

/**
 * Dedicated LogoLoader for full-page or section loading
 */
export function LogoLoader({ size = "lg", text = "لوڈ ہو رہا ہے..." }) {
  return <Spinner size={size} text={text} />;
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
