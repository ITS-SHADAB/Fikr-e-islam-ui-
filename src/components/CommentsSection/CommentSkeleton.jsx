import React from "react";

export default function CommentSkeleton({ count = 3 }) {
  return (
    <div className="space-y-4 py-2" aria-busy="true" aria-label="Loading comments">
      {Array.from({ length: count }).map((_, idx) => (
        <div
          key={idx}
          className="flex items-start gap-3 p-3 rounded-xl animate-pulse"
        >
          {/* Avatar Skeleton */}
          <div className="w-9 h-9 rounded-full bg-neutral-200/80 shrink-0" />

          {/* Content Skeleton */}
          <div className="flex-1 space-y-2 py-0.5">
            <div className="flex items-center gap-2">
              <div className="h-3.5 w-24 bg-neutral-200/80 rounded" />
              <div className="h-3 w-16 bg-neutral-200/50 rounded" />
            </div>
            <div className="h-3 w-4/5 bg-neutral-200/70 rounded" />
            <div className="h-3 w-2/5 bg-neutral-200/50 rounded" />

            <div className="flex items-center gap-3 pt-1">
              <div className="h-3 w-12 bg-neutral-200/60 rounded" />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
