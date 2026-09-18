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
 * Dynamically scales with card height when text is longer, perfectly centered at all times.
 */
function QuestionLeftNotch() {
  return (
    <div className="absolute top-1/2 -translate-y-1/2 -left-[2px] w-2 h-[55%] min-h-[38px] max-h-[135px] pointer-events-none select-none flex flex-col items-end">
      {/* Top vertical line (dynamically grows with text) */}
      <div className="w-[3.5px] flex-1 bg-[#A8793E] rounded-t-[1px]" />

      {/* Center triangle notch pointing left */}
      <svg
        viewBox="0 0 8 16"
        className="w-2 h-4 shrink-0 -my-[0.5px]"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden="true"
      >
        <path
          d="M4.5 0 L0 8 L4.5 16 L8 16 L8 0 Z"
          fill="#A8793E"
        />
      </svg>

      {/* Bottom vertical line (dynamically grows with text) */}
      <div className="w-[3.5px] flex-1 bg-[#A8793E] rounded-b-[1px]" />
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

      {/* TOP-RIGHT: Hanging Lamp with Dark Ceiling Line & Continuous Thin Suspension */}
      <div className="absolute top-0 right-3 sm:right-6 md:right-8 z-20 pointer-events-none select-none flex flex-col items-center">
        {/* Dark Ceiling Mount Line (retained as requested by user) */}
        <div
          className="w-8 sm:w-10 h-1 sm:h-1.5 rounded-b-xs shrink-0"
          style={{
            backgroundColor: "#2B2118",
            borderBottom: `1px solid ${theme.secondaryBorder}80`,
          }}
        />

        {/* Full-Sized Islamic Lamp with thin line connected seamlessly all the way to the head */}
        <IslamicLantern className="w-[46px] h-[92px] sm:w-[54px] sm:h-[108px] md:w-[62px] md:h-[124px] drop-shadow-sm -mt-[1px] relative z-10" />
      </div>

      {/* Header Row: Left-composed compact heading capsule */}
      <div className="flex items-center justify-between gap-3 mb-3.5 sm:mb-4 relative z-10">
        {/* Sleek, Compact Height Heading Capsule (#EFE6D9) - Pure Urdu, No English */}
        <div
          className="inline-flex items-center gap-1.5 sm:gap-2.5 py-1 sm:py-1.5 px-2.5 sm:px-3.5 rounded-full border shadow-2xs whitespace-nowrap shrink-0"
          style={{
            backgroundColor: theme.noticeBg,
            borderColor: `${theme.secondaryBorder}60`,
          }}
        >
          {/* Question Speech-Bubble Icon */}
          <QuestionBubbleIcon className="w-7 h-7 sm:w-8 sm:h-8" />

          {/* Urdu Title: Pure سائل کا سوال */}
          <h2
            id="question-heading"
            className="font-bold whitespace-nowrap leading-none pr-0.5 select-none"
            style={{ color: theme.mainText }}
          >
            <span className="text-[14px] xs:text-[15.5px] sm:text-[17px] font-['Payami_Nastaleeq',serif] leading-none pt-0.5">
              سائل کا سوال
            </span>
          </h2>
        </div>
      </div>

      {/* Inner Question Panel (#FCF8F1) with dedicated right clearance for the lamp */}
      <div
        className="rounded-[18px] p-3.5 sm:p-6 md:p-8 pr-14 sm:pr-20 md:pr-24 border relative shadow-2xs z-10"
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
          className="text-[19px] sm:text-[22px] md:text-[25px] font-['Payami_Nastaleeq',serif] leading-[1.65] sm:leading-[1.78] font-medium text-right relative z-10 break-words"
          style={{ color: theme.mainText }}
        >
          ”{question}“
        </p>
      </div>
    </section>
  );
}
