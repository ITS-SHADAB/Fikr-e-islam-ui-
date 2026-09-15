import React, { useState, useRef, useEffect } from "react";
import { Send, X, CornerDownLeft } from "lucide-react";
import { COLORS } from "@/utils/themeColors";
import UserAvatar from "./UserAvatar";

const MAX_CHARS = 2000;

export default function ReplyComposer({
  targetUser,
  loggedInUser,
  onSubmitReply,
  onCancel,
  isSubmitting = false,
  isRTL = false,
}) {
  const [text, setText] = useState("");
  const inputRef = useRef(null);

  useEffect(() => {
    // Focus automatically when reply composer is opened
    const timer = setTimeout(() => {
      if (inputRef.current) {
        inputRef.current.focus();
      }
    }, 60);
    return () => clearTimeout(timer);
  }, []);

  const handleSubmit = (e) => {
    e && e.preventDefault();
    const trimmed = text.trim();
    if (!trimmed || isSubmitting) return;
    onSubmitReply(trimmed, () => {
      setText("");
    });
  };

  const handleKeyDown = (e) => {
    if ((e.ctrlKey || e.metaKey) && e.key === "Enter") {
      e.preventDefault();
      handleSubmit();
    }
    if (e.key === "Escape") {
      onCancel();
    }
  };

  return (
    <div
      className="rounded-2xl border p-3 my-2 shadow-xs transition-all animate-in fade-in duration-200"
      style={{
        backgroundColor: COLORS.white || "#FFFFFF",
        borderColor: `${COLORS.accent}60`,
      }}
    >
      {/* Target User Banner (Instagram-style) */}
      <div
        className="flex items-center justify-between pb-2 mb-2 border-b text-xs"
        style={{ borderColor: `${COLORS.border}20` }}
      >
        <div className="flex items-center gap-1.5 font-medium">
          <CornerDownLeft className="w-3 h-3 text-amber-700 opacity-70" />
          <span style={{ color: COLORS.textSecondary }}>
            {isRTL ? "جواب برائے:" : "Replying to"}
          </span>
          <span
            className="font-bold px-2 py-0.5 rounded-full text-[11px] border"
            style={{
              backgroundColor: `${COLORS.accent}15`,
              borderColor: `${COLORS.accent}40`,
              color: COLORS.primary,
            }}
          >
            @{targetUser?.name || "User"}
          </span>
        </div>

        <button
          type="button"
          onClick={onCancel}
          className="p-1 rounded-full hover:bg-black/5 text-neutral-400 hover:text-neutral-700 transition-colors cursor-pointer"
          title={isRTL ? "منسوخ کریں" : "Cancel reply"}
          aria-label={isRTL ? "منسوخ کریں" : "Cancel reply"}
        >
          <X className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Input Field */}
      <div className="flex items-start gap-2.5">
        <UserAvatar user={loggedInUser} size={28} />

        <div className="flex-1 min-w-0">
          <textarea
            ref={inputRef}
            rows={2}
            value={text}
            onChange={(e) => setText(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={
              isRTL
                ? `اپنا جواب تحریر کریں...`
                : `Write your reply to @${targetUser?.name || "user"}...`
            }
            className="w-full bg-transparent border-none outline-none text-xs sm:text-sm leading-relaxed resize-none placeholder:text-neutral-400"
            style={{
              color: COLORS.textPrimary,
              minHeight: "42px",
            }}
            maxLength={MAX_CHARS}
          />

          <div className="flex items-center justify-end gap-2 pt-2 mt-1 border-t border-neutral-100">
            <button
              type="button"
              onClick={onCancel}
              className="px-3 py-1 rounded-lg text-xs font-semibold text-neutral-600 hover:bg-neutral-100 transition-colors cursor-pointer"
              disabled={isSubmitting}
            >
              {isRTL ? "منسوخ" : "Cancel"}
            </button>

            <button
              type="button"
              onClick={handleSubmit}
              disabled={!text.trim() || isSubmitting}
              className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-xl text-xs font-bold text-white shadow-xs transition-all disabled:opacity-40 disabled:cursor-not-allowed hover:opacity-90 cursor-pointer"
              style={{ backgroundColor: COLORS.primary }}
            >
              {isSubmitting ? (
                <span className="inline-block w-3 h-3 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                <Send className="w-3 h-3" style={{ color: COLORS.accent }} />
              )}
              <span>
                {isSubmitting
                  ? isRTL
                    ? "ارسال..."
                    : "Sending..."
                  : isRTL
                  ? "جواب دیں"
                  : "Reply"}
              </span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
