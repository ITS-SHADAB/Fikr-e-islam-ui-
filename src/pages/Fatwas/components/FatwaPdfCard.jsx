import React from "react";
import {
  FileText,
  Download,
  ExternalLink,
  ArrowRight,
  Info,
  Maximize2,
  Minimize2,
} from "lucide-react";
import {
  PdfDocumentIllustration,
  CardGeometricTexture,
} from "./FatwaDetailDecorativeAssets";
import { PdfViewer } from "@/components";

/**
 * FatwaPdfCard - Section 3: Download PDF / مکمل فتویٰ ڈاؤنلوڈ کریں
 * 
 * Target layout matching IMAGE 1:
 * - Visually LEFT-composed header with Light cream heading capsule (#EFE6D9)
 * - Outer card subtle geometric texture (#C8A46A at ~0.08 opacity)
 * - Inner panel (#FCF8F1) with:
 *    LEFT: Dynamic RTL Urdu description in Payami Nastaleeq (#2A211A)
 *    RIGHT: Arched mihrab frame with 3D paper PDF document illustration
 * - Two visually strong action buttons (Dark brown primary & Cream outline secondary)
 * - Official authenticity notice strip (#EFE6D9)
 */
/**
 * PdfCapsuleDocumentIcon - Dark brown circular badge with white document icon
 * matching the question bubble and scales icons across all 3 cards.
 */
function PdfCapsuleDocumentIcon({ className = "w-8 h-8 sm:w-8.5 sm:h-8.5" }) {
  return (
    <div
      className={`${className} rounded-full flex items-center justify-center shrink-0 border shadow-xs`}
      style={{
        backgroundColor: "#3A2A1D",
        borderColor: "rgba(168, 121, 62, 0.4)",
      }}
    >
      <FileText className="w-4 h-4 stroke-[2.2] text-white" />
    </div>
  );
}

export default function FatwaPdfCard({
  pdfUrl,
  fatwaTitle = "",
  onOpenModal,
  showEmbeddedPdf,
  onToggleEmbedded,
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
  if (!pdfUrl) return null;

  return (
    <section
      dir="ltr"
      aria-labelledby="pdf-heading"
      className="rounded-[20px] md:rounded-[24px] p-4 sm:p-6 md:p-7 border relative overflow-hidden transition-all duration-300"
      style={{
        background: "radial-gradient(circle at 95% 0%, #DFCEB7 0%, #E9DEC9 28%, #F7F1E8 60%)",
        borderColor: theme.secondaryBorder,
        boxShadow: theme.cardShadow,
      }}
    >
      {/* Subtle Islamic geometric texture across outer card */}
      <CardGeometricTexture className="opacity-[0.06]" />

      {/* TOP ROW: Left Column (Capsule + Description Text) | Right Column (Mihrab Arch + 3D PDF Document) */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 sm:gap-6 mb-5 sm:mb-6 relative z-10">
        {/* LEFT: Capsule + Urdu Description with Left Gold Accent Bar */}
        <div className="flex-1 w-full sm:w-auto flex flex-col items-start">
          {/* Heading Capsule (#EFE6D9) matching Question and Summary cards */}
          <div
            className="inline-flex items-center gap-2.5 sm:gap-3 py-1 sm:py-1.5 px-3 sm:px-3.5 rounded-full border shadow-2xs mb-4 sm:mb-5"
            style={{
              backgroundColor: theme.noticeBg,
              borderColor: `${theme.secondaryBorder}60`,
            }}
          >
            {/* Document Icon */}
            <PdfCapsuleDocumentIcon />

            {/* Title Text Block: Compact height & tight baseline */}
            <div className="text-left flex flex-col justify-center pr-1 sm:pr-1.5">
              <h2
                id="pdf-heading"
                className="text-base sm:text-[18px] font-bold font-['Payami_Nastaleeq',serif] leading-tight"
                style={{ color: theme.mainText }}
              >
                مکمل فتویٰ ڈاؤنلوڈ کریں
              </h2>
              <span
                className="text-[10px] sm:text-[11px] font-semibold block font-sans leading-none mt-0.5 tracking-tight"
                style={{ color: theme.mainText }}
              >
                Download PDF
              </span>
            </div>
          </div>

          {/* Description Text with Left Gold Accent Line */}
          <div className="relative pl-3.5 sm:pl-4 border-l-2 border-[#A8793E]/80 py-1 w-full" dir="rtl">
            <p
              className="text-[16px] sm:text-[18px] md:text-[19px] font-['Payami_Nastaleeq',serif] leading-[2.2] sm:leading-[2.4] font-medium text-right"
              style={{ color: theme.mainText }}
            >
              دارالافتاء کی جانب سے جاری کردہ اس فتویٰ کا مکمل متن، آپ ڈاؤنلوڈ کر کے پڑھ سکتے ہیں۔
            </p>
          </div>
        </div>

        {/* RIGHT: Mihrab Arch + 3D PDF Document */}
        <div className="shrink-0 w-full sm:w-auto flex justify-center sm:justify-end select-none">
          <PdfDocumentIllustration className="w-32 h-40 sm:w-36 sm:h-44 md:w-40 md:h-48" />
        </div>
      </div>

      {/* Two Action Buttons: Left Primary Download | Right Secondary Open Tab */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 mb-3.5 sm:mb-4 relative z-10">
        {/* PRIMARY: Dark Brown #2C2118 with Download Icon */}
        <a
          href={pdfUrl}
          download
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center justify-between px-5 sm:px-6 py-3 sm:py-3.5 rounded-xl sm:rounded-2xl font-bold transition-all duration-200 cursor-pointer shadow-xs hover:opacity-95 active:scale-[0.99] min-h-[48px] sm:min-h-[52px]"
          style={{
            backgroundColor: "#2C2118",
            color: "#FFFFFF",
          }}
        >
          <div className="flex items-center gap-2.5">
            <Download className="w-4 h-4 sm:w-5 sm:h-5 text-white shrink-0 stroke-[2.2]" />
            <span className="font-['Payami_Nastaleeq',serif] text-base sm:text-lg tracking-wide">
              PDF ڈاؤنلوڈ کریں
            </span>
          </div>
          <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5 text-white shrink-0" />
        </a>

        {/* SECONDARY: Cream #FAF6EF with Gold Border #D8C09A and ExternalLink Icon */}
        <button
          type="button"
          onClick={() => {
            if (pdfUrl) {
              window.open(pdfUrl, "_blank");
            } else if (onOpenModal) {
              onOpenModal();
            }
          }}
          className="flex items-center justify-between px-5 sm:px-6 py-3 sm:py-3.5 rounded-xl sm:rounded-2xl border font-bold transition-all duration-200 cursor-pointer shadow-xs hover:bg-[#F3E8D8] active:scale-[0.99] min-h-[48px] sm:min-h-[52px]"
          style={{
            backgroundColor: "#FAF6EF",
            borderColor: "#D8C09A",
            color: "#2C2118",
          }}
        >
          <div className="flex items-center gap-2.5">
            <ExternalLink className="w-4 h-4 sm:w-5 sm:h-5 text-[#2C2118] shrink-0 stroke-[2.2]" />
            <span className="font-['Payami_Nastaleeq',serif] text-base sm:text-lg tracking-wide">
              نئی ٹیب میں کھولیں
            </span>
          </div>
          <ArrowRight className="w-4 h-4 text-[#2C2118] shrink-0" />
        </button>
      </div>

      {/* Embedded Reader Toggle Button (Subtle & clean) */}
      <div className="flex justify-center mb-3 relative z-10">
        <button
          type="button"
          onClick={onToggleEmbedded}
          className="inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-lg border transition-colors hover:bg-black/5 cursor-pointer"
          style={{
            borderColor: theme.lightGold,
            color: theme.textMuted,
            backgroundColor: showEmbeddedPdf ? `${theme.goldAccent}18` : "transparent",
          }}
        >
          {showEmbeddedPdf ? (
            <Minimize2 className="w-3.5 h-3.5 text-[#A8793E]" />
          ) : (
            <Maximize2 className="w-3.5 h-3.5 text-[#A8793E]" />
          )}
          <span className="font-['Payami_Nastaleeq',serif]">
            {showEmbeddedPdf ? "قاری بند کریں" : "صفحہ پر مکمل فتویٰ پڑھیں"}
          </span>
        </button>
      </div>

      {/* Embedded PDF Viewer if opened */}
      {showEmbeddedPdf && (
        <div
          className="mb-3.5 rounded-xl overflow-hidden border shadow-inner relative z-10"
          style={{
            height: "650px",
            borderColor: theme.secondaryBorder,
          }}
        >
          <PdfViewer url={pdfUrl} title={fatwaTitle} isModal={false} />
        </div>
      )}

      {/* Official Authenticity Notice Strip (#EFE6D9) */}
      <div
        className="rounded-xl sm:rounded-2xl py-2 px-4 border flex items-center justify-center gap-2 text-center shadow-2xs relative z-10"
        style={{
          backgroundColor: theme.noticeBg,
          borderColor: `${theme.secondaryBorder}50`,
        }}
      >
        <Info className="w-4 h-4 shrink-0 text-[#685545]" />
        <span
          dir="rtl"
          className="text-xs sm:text-[13px] font-medium font-['Payami_Nastaleeq',serif]"
          style={{ color: "#4A3B30" }}
        >
          یہ فائل دارالافتاء کی جانب سے جاری کردہ مستند متن ہے۔
        </span>
      </div>
    </section>
  );
}
