import React from "react";
import {
  Scale,
  FileText,
  Download,
  ExternalLink,
  ArrowRight,
} from "lucide-react";
import {
  IslamicBookSeal,
  GoldDiamondDivider,
  IslamicGeometricWatermark,
  CardGeometricTexture,
} from "./FatwaDetailDecorativeAssets";

/**
 * FatwaSummaryCard - Section 2: Answer Summary & Integrated Download (جواب و خلاصہ)
 *
 * Exact visual recreation matching user's reference mockup:
 * - Outer Card: Radial gradient parchment (#F7F1E8) with Islamic geometric watermark
 * - Header Row: Left Capsule ("جواب وخلاصہ / Summary & Download") | Right Bismillah + Shamsa Medallion
 * - Box 1 (Summary Content):
 *    - Left gold vertical bar
 *    - Dynamic Urdu summary text in Payami Nastaleeq
 *    - Centered Gold Diamond Divider
 *    - "والله تعالى أعلم بالصواب"
 * - Box 2 (Download PDF Panel):
 *    - Tightly connected to Box 1 with precise ~18px gap (mt-3.5 sm:mt-4)
 *    - Minimal, exact height matching the reference image (no extra viewer toggle)
 *    - Left: Capsule ("مکمل فتویٰ ڈاؤنلوڈ کریں / Download Full PDF") + "اس فتویٰ کا مکمل متن ڈاؤنلوڈ کر کے پڑھ سکتے ہیں۔"
 *    - Right: Islamic Mihrab Arch + 3D PDF Document
 *    - Bottom: Two balanced action buttons (Dark Download button & Light New Tab button)
 */
export default function FatwaSummaryCard({
  summary,
  pdfUrl,
  fatwaTitle = "",
  onOpenModal,
  theme = {
    cardBg: "#F7F1E8",
    panelBg: "#FCF8F1",
    darkBrown: "#2B2118",
    mainText: "#2A211A",
    goldAccent: "#A8793E",
    secondaryBorder: "#C8A46A",
    lightGold: "#D8C09A",
    noticeBg: "#EFE6D9",
    textMuted: "#685545",
    cardShadow: "0 6px 25px rgba(43, 33, 24, 0.05)",
  },
}) {
  return (
    <section
      dir="ltr"
      aria-labelledby="summary-heading"
      className="rounded-[20px] md:rounded-[24px] p-4 sm:p-6 md:p-7 border relative overflow-hidden transition-all duration-300"
      style={{
        background: "radial-gradient(circle at 95% 0%, #DFCEB7 0%, #E9DEC9 28%, #F7F1E8 60%)",
        borderColor: theme.secondaryBorder,
        boxShadow: theme.cardShadow,
      }}
    >
      {/* Subtle Islamic geometric texture across outer card */}
      <CardGeometricTexture className="opacity-[0.06]" />

      {/* Top-right subtle warm shading and lace texture */}
      <div className="absolute top-0 right-0 w-48 sm:w-60 md:w-80 h-36 sm:h-44 md:h-52 pointer-events-none overflow-hidden rounded-tr-[20px] md:rounded-tr-[24px]">
        <CardGeometricTexture
          className="opacity-[0.20]"
          strokeColor="#A8793E"
          secondaryColor="#C8A46A"
        />
      </div>

      {/* ── HEADER ROW: Left Capsule | Right Bismillah + Islamic Book Medallion ── */}
      <div className="flex items-center justify-between gap-2 sm:gap-3 mb-3.5 sm:mb-4 relative z-10">
        {/* LEFT: Capsule ("جواب وخلاصہ / Summary & Download") */}
        <div
          className="inline-flex items-center gap-2.5 sm:gap-3 py-1 sm:py-1.5 px-3 sm:px-3.5 rounded-full border shadow-2xs"
          style={{
            backgroundColor: theme.noticeBg,
            borderColor: `${theme.secondaryBorder}60`,
          }}
        >
          {/* Scales Icon Container */}
          <div
            className="w-8 h-8 sm:w-8.5 sm:h-8.5 rounded-full flex items-center justify-center shrink-0 border shadow-xs"
            style={{
              backgroundColor: "#E4D5C2",
              borderColor: `${theme.secondaryBorder}60`,
              color: theme.darkBrown,
            }}
          >
            <Scale className="w-4 h-4 stroke-[2.2] text-[#2B2118]" />
          </div>

          {/* Title Text Block */}
          <div className="text-left flex flex-col justify-center pr-1 sm:pr-1.5">
            <h2
              id="summary-heading"
              className="text-base sm:text-[18px] font-bold font-['Payami_Nastaleeq',serif] leading-tight"
              style={{ color: theme.mainText }}
            >
              جواب وخلاصہ
            </h2>
            <span
              className="text-[10px] sm:text-[11px] font-semibold block font-sans leading-none mt-0.5 tracking-tight"
              style={{ color: theme.mainText }}
            >
              Summary & Download
            </span>
          </div>
        </div>

        {/* RIGHT: Bismillah Pill seamlessly connected into the Islamic Book Medallion */}
        <div className="flex items-center shrink-0 select-none">
          {/* Bismillah Pill */}
          <div
            className="px-3 sm:px-4 py-1 rounded-l-full border-y border-l border-r-0 shadow-xs -mr-7 sm:-mr-8 md:-mr-9 z-0 flex items-center justify-center h-[28px] sm:h-[32px] md:h-[35px]"
            style={{
              backgroundColor: "#38271A",
              borderColor: "rgba(168, 121, 62, 0.45)",
            }}
          >
            <span
              className="quran-font text-[10.5px] sm:text-[12px] md:text-[12.5px] font-semibold tracking-wide whitespace-nowrap block leading-none select-none pr-5 sm:pr-6 md:pr-7"
              style={{ color: "#F7F1E8" }}
            >
              بسم الله الرحمن الرحيم
            </span>
          </div>

          {/* Ornate Islamic Book Medallion (Shamsa) */}
          <div className="z-10 relative drop-shadow-md">
            <IslamicBookSeal className="w-[66px] h-[66px] sm:w-[78px] sm:h-[78px] md:w-[88px] md:h-[88px]" />
          </div>
        </div>
      </div>

      {/* ── BOX 1: SUMMARY CONTENT PANEL (#FCF8F1) ── */}
      <div
        className="rounded-[18px] p-4 sm:p-7 md:p-8 border relative shadow-2xs overflow-hidden z-10"
        style={{
          backgroundColor: theme.panelBg,
          borderColor: theme.lightGold,
        }}
      >
        {/* Extremely faint Islamic geometric watermark in inner panel */}
        <div className="absolute -bottom-8 -left-8 pointer-events-none select-none">
          <IslamicGeometricWatermark className="w-48 h-48 sm:w-56 sm:h-56 opacity-[0.035]" />
        </div>

        {/* Dynamic Urdu Summary Text with Left Gold Accent Bar */}
        <div className="relative pl-3.5 sm:pl-4 border-l-2 border-[#A8793E] py-1" dir="rtl">
          <p
            className="text-[17px] sm:text-[19px] md:text-[21px] font-['Payami_Nastaleeq',serif] leading-[1.68] sm:leading-[1.8] font-normal whitespace-pre-line break-words text-right relative z-10"
            style={{ color: theme.mainText }}
          >
            {summary || "تفصیلی فتویٰ کا متن درج نہیں ہے۔"}
          </p>
        </div>

        {/* Centered Gold Diamond Divider: ──────── ◆ ──────── */}
        <GoldDiamondDivider className="my-4 sm:my-5" />

        {/* Scholarly Attestation */}
        <div className="text-center relative z-10">
          <div
            className="text-lg sm:text-xl font-bold font-['Payami_Nastaleeq',serif]"
            style={{ color: theme.mainText }}
          >
            والله تعالى أعلم بالصواب
          </div>
        </div>
      </div>

      {/* ── BOX 2: INTEGRATED DOWNLOAD PDF PANEL (#FCF8F1) ── */}
      {/* Tightly connected to Box 1 with mt-2 sm:mt-2.5 (8-10px) */}
      <div
        className="mt-2 sm:mt-2.5 rounded-[18px] p-3.5 sm:p-4 md:p-5 pb-3.5 sm:pb-4 border relative shadow-2xs overflow-hidden z-10"
        style={{
          backgroundColor: theme.panelBg,
          borderColor: theme.lightGold,
        }}
      >
        {/* Top Row: Left (Capsule) | Right (Short Urdu Description) */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2.5 sm:gap-4 mb-3 sm:mb-3.5">
          {/* LEFT: Capsule ("مکمل فتویٰ ڈاؤنلوڈ کریں / Download Full PDF") */}
          <div
            className="inline-flex items-center gap-2.5 sm:gap-3 py-1 px-3 sm:px-3.5 rounded-full border shadow-2xs shrink-0"
            style={{
              backgroundColor: theme.noticeBg,
              borderColor: `${theme.secondaryBorder}60`,
            }}
          >
            {/* Document Icon Container with light-tan outer circle and dark squircle icon */}
            <div
              className="w-8 h-8 sm:w-8.5 sm:h-8.5 rounded-full flex items-center justify-center shrink-0 border shadow-xs"
              style={{
                backgroundColor: "#E4D5C2",
                borderColor: `${theme.secondaryBorder}60`,
              }}
            >
              <div
                className="w-5.5 h-5.5 sm:w-6 sm:h-6 rounded-[6px] flex items-center justify-center shadow-2xs"
                style={{ backgroundColor: "#2C2118" }}
              >
                <FileText className="w-3.5 h-3.5 stroke-[2.2] text-white" />
              </div>
            </div>

            {/* Title Text Block */}
            <div className="text-left flex flex-col justify-center pr-1 sm:pr-1.5">
              <h3
                className="text-[14.5px] sm:text-[16px] font-bold font-['Payami_Nastaleeq',serif] leading-tight"
                style={{ color: theme.mainText }}
              >
                مکمل فتویٰ ڈاؤنلوڈ کریں
              </h3>
              <span
                className="text-[9.5px] sm:text-[10.5px] font-semibold block font-sans leading-none mt-0.5 tracking-tight"
                style={{ color: theme.mainText }}
              >
                Download Full PDF
              </span>
            </div>
          </div>

          {/* RIGHT: Short Urdu Description */}
          <p
            dir="rtl"
            className="text-right font-['Payami_Nastaleeq',serif] text-[16px] sm:text-[17.5px] md:text-[18.5px] leading-relaxed font-medium"
            style={{ color: theme.mainText }}
          >
            اس فتویٰ کا مکمل متن ڈاؤنلوڈ کر کے پڑھ سکتے ہیں۔
          </p>
        </div>

        {/* Bottom Row: Two Balanced Action Buttons */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 sm:gap-3">
          {/* PRIMARY BUTTON: Dark Brown #2C2118 with Download Icon */}
          <a
            href={pdfUrl || "#"}
            download={Boolean(pdfUrl)}
            target={pdfUrl ? "_blank" : undefined}
            rel="noopener noreferrer"
            className="flex items-center justify-between px-4 sm:px-5 py-2.5 sm:py-3 rounded-xl sm:rounded-2xl font-bold transition-all duration-200 cursor-pointer shadow-xs hover:opacity-95 active:scale-[0.99] min-h-[44px] sm:min-h-[48px]"
            style={{
              backgroundColor: "#2C2118",
              color: "#FFFFFF",
            }}
          >
            <Download className="w-4 h-4 sm:w-4.5 sm:h-4.5 text-white shrink-0 stroke-[2.2]" />
            <span className="font-['Payami_Nastaleeq',serif] text-sm sm:text-base tracking-wide">
              PDF ڈاؤنلوڈ کریں
            </span>
            <ArrowRight className="w-4 h-4 sm:w-4.5 sm:h-4.5 text-white shrink-0" />
          </a>

          {/* SECONDARY BUTTON: Crisp Cream with Dark Border and ExternalLink Icon */}
          <button
            type="button"
            onClick={() => {
              if (pdfUrl) {
                window.open(pdfUrl, "_blank");
              } else if (onOpenModal) {
                onOpenModal();
              }
            }}
            className="flex items-center justify-between px-4 sm:px-5 py-2.5 sm:py-3 rounded-xl sm:rounded-2xl border font-bold transition-all duration-200 cursor-pointer shadow-xs hover:bg-[#F3E8D8] active:scale-[0.99] min-h-[44px] sm:min-h-[48px]"
            style={{
              backgroundColor: "#FAF6EF",
              borderColor: "#2C2118",
              color: "#2C2118",
            }}
          >
            <ExternalLink className="w-4 h-4 sm:w-4.5 sm:h-4.5 text-[#2C2118] shrink-0 stroke-[2.2]" />
            <span className="font-['Payami_Nastaleeq',serif] text-sm sm:text-base tracking-wide">
              نئی ٹیب میں کھولیں
            </span>
            <ArrowRight className="w-4 h-4 sm:w-4.5 sm:h-4.5 text-[#2C2118] shrink-0" />
          </button>
        </div>
      </div>
    </section>
  );
}
