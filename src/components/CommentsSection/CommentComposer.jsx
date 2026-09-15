import React, { useState, useRef, useEffect } from "react";
import { Send, LogIn, AlertCircle } from "lucide-react";
import { COLORS } from "@/utils/themeColors";
import UserAvatar from "./UserAvatar";

const MAX_CHARS = 2000;

export default function CommentComposer({
  loggedInUser,
  isAuthenticated,
  onOpenLogin,
  onSubmit,
  isSubmitting = false,
  placeholder,
  isRTL = false,
}) {
  const [text, setText] = useState("");
  const [isFocused, setIsFocused] = useState(false);
  const textareaRef = useRef(null);

  // Auto-grow textarea height
  useEffect(() => {
    const el = textareaRef.current;
    if (!el) return;
    el.style.height = "auto";
    el.style.height = `${Math.min(el.scrollHeight, 240)}px`;
  }, [text]);

  const handleSubmit = (e) => {
    e && e.preventDefault();
    const trimmed = text.trim();
    if (!trimmed || isSubmitting) return;
    onSubmit(trimmed, () => {
      setText("");
      if (textareaRef.current) {
        textareaRef.current.style.height = "auto";
      }
    });
  };

  const handleKeyDown = (e) => {
    // Submit on Ctrl+Enter or Cmd+Enter
    if ((e.ctrlKey || e.metaKey) && e.key === "Enter") {
      e.preventDefault();
      handleSubmit();
    }
  };

  if (!isAuthenticated) {
    return (
      <div
        className="rounded-2xl border p-4 sm:p-5 text-center flex flex-col sm:flex-row items-center justify-between gap-3 mb-6 shadow-xs"
        style={{
          backgroundColor: `${COLORS.cardBg || "#F7F1E8"}90`,
          borderColor: `${COLORS.border}40`,
        }}
      >
        <div className="text-right sm:text-start">
          <p
            className="text-sm font-bold font-serif"
            style={{ color: COLORS.primary }}
          >
            {isRTL
              ? "تبصرہ کرنے کے لیے لاگ ان کریں"
              : "Sign in to join the conversation"}
          </p>
          <p
            className="text-xs mt-0.5"
            style={{ color: COLORS.textSecondary }}
          >
            {isRTL
              ? "علمی گفتگو اور سوال و جواب کے تبادلے کے لیے اکاؤنٹ میں داخل ہوں"
              : "Share your scholarly reflections, questions, and insights"}
          </p>
        </div>
        <button
          type="button"
          onClick={onOpenLogin}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold text-white shadow-xs hover:opacity-90 transition-opacity shrink-0 cursor-pointer"
          style={{ backgroundColor: COLORS.primary }}
        >
          <LogIn className="w-3.5 h-3.5" style={{ color: COLORS.accent }} />
          <span>{isRTL ? "اکاؤنٹ میں داخل ہوں" : "Sign In"}</span>
        </button>
      </div>
    );
  }

  const remainingChars = MAX_CHARS - text.length;
  const isNearLimit = remainingChars <= 200;
  const isOverLimit = remainingChars < 0;

  return (
    <div
      className={`rounded-2xl border p-3.5 sm:p-4 mb-6 transition-all duration-300 shadow-xs ${
        isFocused ? "shadow-md ring-2 ring-amber-700/10" : ""
      }`}
      style={{
        backgroundColor: COLORS.white || "#FFFFFF",
        borderColor: isFocused ? COLORS.accent : `${COLORS.border}50`,
      }}
    >
      {/* Clear Helpful Header for New Users */}
      <div
        className="flex items-center gap-2 pb-2.5 mb-3 border-b text-xs font-bold font-serif"
        style={{
          borderColor: `${COLORS.border}25`,
          color: COLORS.primary,
        }}
      >
        <span
          className="w-5 h-5 rounded-md flex items-center justify-center text-xs"
          style={{
            backgroundColor: `${COLORS.accent}15`,
            color: COLORS.accent,
          }}
        >
          ✍
        </span>
        <span>
          {isRTL
            ? "اپنا تبصرہ یا سوال تحریر فرمائیں:"
            : "Share your comment or question:"}
        </span>
      </div>

      <div className="flex items-start gap-3">
        <UserAvatar user={loggedInUser} size={36} />

        <div className="flex-1 min-w-0">
          <textarea
            ref={textareaRef}
            rows={2}
            value={text}
            onChange={(e) => setText(e.target.value)}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            onKeyDown={handleKeyDown}
            placeholder={
              placeholder ||
              (isRTL
                ? "کتاب کے بارے میں اپنی رائے، تاثرات یا سوال یہاں لکھیں..."
                : "Write your thoughts, reflections, or questions here...")
            }
            className="w-full bg-transparent border-none outline-none text-xs sm:text-sm leading-relaxed resize-none placeholder:text-neutral-400"
            style={{
              color: COLORS.textPrimary,
              minHeight: "56px",
            }}
            maxLength={MAX_CHARS + 50}
          />

          {/* Bottom Bar: Character count, tips, and Actions */}
          <div
            className="flex items-center justify-between pt-2.5 mt-2 border-t"
            style={{ borderColor: `${COLORS.border}20` }}
          >
            <div className="flex items-center gap-2 text-[11px]">
              {isNearLimit ? (
                <span
                  className={`flex items-center gap-1 font-mono font-semibold ${
                    isOverLimit ? "text-rose-600 font-bold" : "text-amber-700"
                  }`}
                >
                  <AlertCircle className="w-3 h-3" />
                  {remainingChars} {isRTL ? "حروف باقی" : "chars left"}
                </span>
              ) : (
                <span
                  className="hidden sm:inline-block text-[11px] opacity-60"
                  style={{ color: COLORS.textSecondary }}
                >
                  {isRTL
                    ? "ارسال کے لیے: Ctrl + Enter"
                    : "Press Ctrl + Enter to post"}
                </span>
              )}
            </div>

            <div className="flex items-center gap-2">
              {text.trim().length > 0 && (
                <button
                  type="button"
                  onClick={() => setText("")}
                  className="px-3 py-1.5 rounded-lg text-xs font-semibold hover:bg-neutral-100 transition-colors cursor-pointer"
                  style={{ color: COLORS.textSecondary }}
                  disabled={isSubmitting}
                >
                  {isRTL ? "منسوخ" : "Cancel"}
                </button>
              )}

              <button
                type="button"
                onClick={handleSubmit}
                disabled={!text.trim() || isSubmitting || isOverLimit}
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold text-white shadow-xs transition-all disabled:opacity-40 disabled:cursor-not-allowed hover:opacity-90 cursor-pointer active:scale-95"
                style={{
                  backgroundColor: COLORS.primary,
                }}
              >
                {isSubmitting ? (
                  <span className="inline-block w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                ) : (
                  <Send className="w-3.5 h-3.5" style={{ color: COLORS.accent }} />
                )}
                <span>
                  {isSubmitting
                    ? isRTL
                      ? "شائع ہو رہا ہے..."
                      : "Posting..."
                    : isRTL
                    ? "تبصرہ شائع کریں"
                    : "Post Comment"}
                </span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
