import React from "react";
import {
  IslamicLantern,
  CardGeometricTexture,
} from "./FatwaDetailDecorativeAssets";

/**
 * QuestionBubbleIcon - Exact dark brown speech-bubble icon with ?
 * matching the reference screenshot.
 */
function QuestionBubbleIcon({ className = "w-8 h-8 sm:w-9 sm:h-9" }) {
  return (
    <svg
      viewBox="0 0 38 38"
      className={`${className} shrink-0 select-none`}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      {/* Speech bubble silhouette with tail pointing bottom-left */}
      <path
        d="M19 4 C10.716 4 4 10.49 4 18.5 C4 21.6 5.08 24.45 6.95 26.75 L5.2 32.8 L11.4 30.7 C13.68 32.16 16.24 33 19 33 C27.284 33 34 26.51 34 18.5 C34 10.49 27.284 4 19 4 Z"
        fill="#2B2118"
        stroke="#A8793E"
        strokeWidth="1.3"
      />
      {/* Centered Question Mark */}
      <text
        x="19"
        y="23"
        textAnchor="middle"
        fill="#F7F1E8"
        fontSize="17"
        fontWeight="bold"
        fontFamily="serif"
      >
        ?
      </text>
    </svg>
  );
}

/**
 * QuestionLeftNotch - Distinctive gold vertical accent bar with center triangular notch
 * matching the left border in the reference image.
 */
function QuestionLeftNotch() {
  return (
    <div className="absolute top-6 -left-[2px] w-2 h-16 pointer-events-none select-none">
      <svg
        viewBox="0 0 8 60"
        className="w-2 h-16"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden="true"
      >
        <path
          d="M4 0 L4 23 L0 29 L4 35 L4 60 L8 60 L8 0 Z"
          fill="#A8793E"
        />
      </svg>
    </div>
  );
}

/**
 * FatwaQuestionCard - Section 1: Question / سوال
 *
 * Exact visual match to user's reference image:
 * - Hanging lamp icon on the RIGHT corner (larger, suspended from top)
 * - Top-right corner has darker warm tan vignette with clearly visible geometric pattern
 * - Sleek, compact height heading capsule (#EFE6D9) on LEFT with Question speech-bubble
 * - Gold vertical accent bar with center triangular notch on LEFT edge of inner panel
 * - Dynamic RTL Urdu text in Payami Nastaleeq
 */
export default function FatwaQuestionCard({
  question,
  theme = {
    cardBg: "#F7F1E8",
    panelBg: "#FCF8F1",
    darkBrown: "#2B2118",
    mainText: "#2A211A",
    goldAccent: "#A8793E",
    secondaryBorder: "#C8A46A",
    lightGold: "#D8C09A",
    noticeBg: "#EFE6D9",
    cardShadow: "0 6px 25px rgba(43, 33, 24, 0.05)",
  },
}) {
  if (!question) return null;

  return (
    <section
      dir="ltr"
      aria-labelledby="question-heading"
      className="rounded-[20px] md:rounded-[24px] p-4 sm:p-6 md:p-7 border relative overflow-hidden transition-all duration-300"
      style={{
        background: "radial-gradient(circle at 95% 0%, #DFCEB7 0%, #E9DEC9 28%, #F7F1E8 60%)",
        borderColor: theme.secondaryBorder,
        boxShadow: theme.cardShadow,
      }}
    >
      {/* Base subtle Islamic geometric texture */}
      <CardGeometricTexture className="opacity-[0.06]" />

      {/* RIGHT CORNER: Darker warm wash + highlighted geometric lace texture */}
      <div className="absolute top-0 right-0 w-48 sm:w-60 md:w-80 h-36 sm:h-44 md:h-52 pointer-events-none overflow-hidden rounded-tr-[20px] md:rounded-tr-[24px]">
        <CardGeometricTexture
          className="opacity-[0.25]"
          strokeColor="#A8793E"
          secondaryColor="#C8A46A"
        />
      </div>

      {/* TOP-RIGHT: Hanging Lamp (suspended from top border, slightly bigger) */}
      <div className="absolute top-0 right-3 sm:right-6 md:right-8 z-20 select-none pointer-events-none drop-shadow-md">
        <IslamicLantern className="w-[54px] h-[108px] sm:w-[64px] sm:h-[126px] md:w-[72px] md:h-[142px]" />
      </div>

      {/* Header Row: Left-composed compact heading capsule */}
      <div className="flex items-center justify-between gap-3 mb-3 sm:mb-3.5 relative z-10 pr-16 sm:pr-22">
        {/* Sleek, Compact Height Heading Capsule (#EFE6D9) */}
        <div
          className="inline-flex items-center gap-2.5 sm:gap-3 py-1 sm:py-1.5 px-3 sm:px-3.5 rounded-full border shadow-2xs"
          style={{
            backgroundColor: theme.noticeBg,
            borderColor: `${theme.secondaryBorder}60`,
          }}
        >
          {/* Question Speech-Bubble Icon */}
          <QuestionBubbleIcon className="w-8 h-8 sm:w-8.5 sm:h-8.5" />

          {/* Text Block: Adjusted tight height & proper baseline */}
          <div className="text-left flex flex-col justify-center pr-1 sm:pr-1.5">
            <h2
              id="question-heading"
              className="text-base sm:text-[18px] font-bold font-['Payami_Nastaleeq',serif] leading-tight"
              style={{ color: theme.mainText }}
            >
              سائل کا سوال
            </h2>
            <span
              className="text-[10px] sm:text-[11px] font-semibold block font-sans leading-none mt-0.5 tracking-tight"
              style={{ color: theme.mainText }}
            >
              Question
            </span>
          </div>
        </div>
      </div>

      {/* Inner Question Panel (#FCF8F1) */}
      <div
        className="rounded-[18px] p-4 sm:p-6 md:p-8 border relative shadow-2xs z-10"
        style={{
          backgroundColor: theme.panelBg,
          borderColor: theme.lightGold,
        }}
      >
        {/* Gold vertical accent notch on the LEFT border matching target image */}
        <QuestionLeftNotch />

        {/* Urdu Question Text: RTL, Right-aligned, Payami Nastaleeq font */}
        <p
          dir="rtl"
          className="text-[20px] sm:text-[23px] md:text-[26px] font-['Payami_Nastaleeq',serif] leading-[1.62] sm:leading-[1.75] font-medium text-right"
          style={{ color: theme.mainText }}
        >
          ”{question}“
        </p>
      </div>
    </section>
  );
}
