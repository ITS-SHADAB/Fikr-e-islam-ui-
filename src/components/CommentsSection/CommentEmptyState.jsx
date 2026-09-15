import React from "react";
import { MessageSquareDashed } from "lucide-react";
import { COLORS } from "@/utils/themeColors";

export default function CommentEmptyState({ isRTL = false }) {
  return (
    <div
      className="text-center py-10 px-4 rounded-2xl border border-dashed my-2 transition-colors"
      style={{
        backgroundColor: "rgba(255, 255, 255, 0.4)",
        borderColor: `${COLORS.border}40`,
      }}
    >
      <div
        className="w-12 h-12 mx-auto rounded-full flex items-center justify-center mb-3 shadow-2xs border"
        style={{
          backgroundColor: `${COLORS.accent}15`,
          borderColor: `${COLORS.accent}35`,
          color: COLORS.accent,
        }}
      >
        <MessageSquareDashed className="w-6 h-6 opacity-80" />
      </div>
      <h4
        className="text-sm font-bold font-serif mb-1"
        style={{ color: COLORS.primary }}
      >
        {isRTL ? "ابھی تک کوئی تبصرہ نہیں ہے" : "Start the conversation"}
      </h4>
      <p
        className="text-xs max-w-sm mx-auto"
        style={{ color: COLORS.textSecondary }}
      >
        {isRTL
          ? "سب سے پہلے اپنی قیمتی رائے، سوال یا علمی نکتہ تحریر فرمائیں۔"
          : "Be the first to share your scholarly reflections, questions, or insights."}
      </p>
    </div>
  );
}
