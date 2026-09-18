import React, { useState } from "react";
import {
  Scale,
  Download,
  ArrowRight,
  BookOpen,
  Loader2,
} from "lucide-react";
import {
  IslamicBookSeal,
  GoldDiamondDivider,
  IslamicGeometricWatermark,
  CardGeometricTexture,
} from "./FatwaDetailDecorativeAssets";

/**
 * FatwaSummaryCard - Section 2: Answer Summary & Integrated Download (جواب و خلاصہ)
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
  const [isDownloading, setIsDownloading] = useState(false);

  const securePdfUrl = pdfUrl ? pdfUrl.replace(/^http:\/\//i, "https://") : "";

  // Trigger actual secure file download in browser
  const handleDownload = async (e) => {
    e?.preventDefault();
    e?.stopPropagation();
    if (!securePdfUrl || isDownloading) return;

    setIsDownloading(true);

    // Sanitize title for filename
    const cleanTitle = (fatwaTitle || "fatwa")
      .replace(/[/\\?%*:|"<>]/g, "-")
      .replace(/\s+/g, "_")
      .slice(0, 75);
    const fileName = `${cleanTitle}.pdf`;

    try {
      // If Cloudinary URL, use HTTPS + fl_attachment to force secure attachment download headers directly from Cloudinary
      if (securePdfUrl.includes("res.cloudinary.com") && securePdfUrl.includes("/upload/")) {
        let downloadUrl = securePdfUrl;
        if (!downloadUrl.includes("fl_attachment")) {
          downloadUrl = downloadUrl.replace("/upload/", "/upload/fl_attachment/");
        }

        const link = document.createElement("a");
        link.style.display = "none";
        link.href = downloadUrl;
        link.setAttribute("download", fileName);
        link.setAttribute("target", "_blank");
        link.setAttribute("rel", "noopener noreferrer");
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      } else {
        // For self-hosted or other HTTPS URLs, fetch blob
        const response = await fetch(securePdfUrl);
        if (!response.ok) {
          throw new Error(`Fetch error: ${response.status}`);
        }

        const blob = await response.blob();
        const pdfBlob = new Blob([blob], { type: "application/pdf" });
        const blobUrl = window.URL.createObjectURL(pdfBlob);

        const link = document.createElement("a");
        link.style.display = "none";
        link.href = blobUrl;
        link.download = fileName;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);

        setTimeout(() => {
          window.URL.revokeObjectURL(blobUrl);
        }, 1500);
      }
    } catch (error) {
      console.warn("Direct download failed, falling back to secure window open:", error);
      const fallbackLink = document.createElement("a");
      fallbackLink.style.display = "none";
      fallbackLink.href = securePdfUrl;
      fallbackLink.target = "_blank";
      fallbackLink.rel = "noopener noreferrer";
      document.body.appendChild(fallbackLink);
      fallbackLink.click();
      document.body.removeChild(fallbackLink);
    } finally {
      setTimeout(() => {
        setIsDownloading(false);
      }, 700);
    }
  };

  return (
    <section
      dir="ltr"
      aria-labelledby="summary-heading"
      className="rounded-[20px] md:rounded-[24px] p-3.5 sm:p-6 md:p-7 border relative overflow-hidden transition-all duration-300"
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
      <div className="flex items-center justify-between gap-1.5 sm:gap-3 mb-3.5 sm:mb-4 relative z-10">
        {/* LEFT: Capsule ("خلاصۂ جواب" responsive single line without English word) */}
        <div
          className="inline-flex items-center gap-1.5 sm:gap-2.5 py-1 sm:py-1.5 px-2.5 sm:px-3.5 rounded-full border shadow-2xs whitespace-nowrap shrink-0"
          style={{
            backgroundColor: theme.noticeBg,
            borderColor: `${theme.secondaryBorder}60`,
          }}
        >
          {/* Scales Icon Container */}
          <div
            className="w-7 h-7 sm:w-8 sm:h-8 rounded-full flex items-center justify-center shrink-0 border shadow-xs"
            style={{
              backgroundColor: "#E4D5C2",
              borderColor: `${theme.secondaryBorder}60`,
              color: theme.darkBrown,
            }}
          >
            <Scale className="w-3.5 h-3.5 sm:w-4 sm:h-4 stroke-[2.2] text-[#2B2118]" />
          </div>

          {/* Urdu Title: Pure خلاصۂ جواب */}
          <h2
            id="summary-heading"
            className="font-bold whitespace-nowrap leading-none pr-0.5 select-none"
            style={{ color: theme.mainText }}
          >
            <span className="text-[14px] xs:text-[15.5px] sm:text-[17px] font-['Payami_Nastaleeq',serif] leading-none pt-0.5">
              خلاصۂ جواب
            </span>
          </h2>
        </div>

        {/* RIGHT: Bismillah Pill seamlessly connected into the Islamic Book Medallion */}
        <div className="flex items-center shrink-0 select-none">
          {/* Bismillah Pill */}
          <div
            className="px-2.5 xs:px-3 sm:px-4 py-1 rounded-l-full border-y border-l border-r-0 shadow-xs -mr-6 xs:-mr-7 sm:-mr-8 md:-mr-9 z-0 flex items-center justify-center h-[28px] sm:h-[32px] md:h-[35px]"
            style={{
              backgroundColor: "#38271A",
              borderColor: "rgba(168, 121, 62, 0.45)",
            }}
          >
            <span
              className="quran-font text-[9.5px] xs:text-[11px] sm:text-[12px] md:text-[12.5px] font-semibold tracking-wide whitespace-nowrap block leading-none select-none pr-4 xs:pr-5 sm:pr-6 md:pr-7"
              style={{ color: "#F7F1E8" }}
            >
              بسم الله الرحمن الرحيم
            </span>
          </div>

          {/* Ornate Islamic Book Medallion (Shamsa) */}
          <div className="z-10 relative drop-shadow-md">
            <IslamicBookSeal className="w-[58px] h-[58px] xs:w-[66px] xs:h-[66px] sm:w-[78px] sm:h-[78px] md:w-[88px] md:h-[88px]" />
          </div>
        </div>
      </div>

      {/* ── BOX 1: SUMMARY CONTENT PANEL (#FCF8F1) ── */}
      <div
        className="rounded-[18px] p-3.5 sm:p-7 md:p-8 border relative shadow-2xs overflow-hidden z-10"
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
            className="text-[16px] xs:text-[17px] sm:text-[19px] md:text-[21px] font-['Payami_Nastaleeq',serif] leading-[1.68] sm:leading-[1.8] font-normal whitespace-pre-line break-words text-right relative z-10"
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
        className="mt-2 sm:mt-2.5 rounded-[18px] p-3 sm:p-4 border relative shadow-2xs overflow-hidden z-10"
        style={{
          backgroundColor: theme.panelBg,
          borderColor: theme.lightGold,
        }}
      >
        {/* Exactly Two Action Buttons: Left (Download) & Right (Online Read in New Tab) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 sm:gap-3">
          {/* BUTTON 1 (LEFT): Dark Brown #2C2118 with Actual Programmatic Download */}
          <button
            type="button"
            onClick={handleDownload}
            disabled={!securePdfUrl || isDownloading}
            title={securePdfUrl ? "مکمل فتویٰ ڈاؤنلوڈ کریں" : "پی ڈی ایف دستیاب نہیں ہے"}
            className="flex items-center justify-between px-3.5 sm:px-5 py-2.5 sm:py-3 rounded-xl sm:rounded-2xl font-bold transition-all duration-200 cursor-pointer shadow-xs hover:opacity-95 active:scale-[0.99] min-h-[46px] sm:min-h-[48px] disabled:opacity-60 disabled:cursor-not-allowed select-none border-0"
            style={{
              backgroundColor: "#2C2118",
              color: "#FFFFFF",
            }}
          >
            {isDownloading ? (
              <Loader2 className="w-4 h-4 sm:w-4.5 sm:h-4.5 text-[#D8C09A] shrink-0 animate-spin" />
            ) : (
              <Download className="w-4 h-4 sm:w-4.5 sm:h-4.5 text-white shrink-0 stroke-[2.2]" />
            )}
            <span className="font-['Payami_Nastaleeq',serif] text-[14.5px] sm:text-base tracking-wide mx-2">
              {isDownloading ? "ڈاؤنلوڈ ہو رہا ہے..." : "مکمل فتویٰ ڈاؤنلوڈ کریں"}
            </span>
            <ArrowRight
              className={`w-4 h-4 sm:w-4.5 sm:h-4.5 text-white shrink-0 transition-opacity duration-200 ${
                isDownloading ? "opacity-0" : "opacity-100"
              }`}
            />
          </button>

          {/* BUTTON 2 (RIGHT): Crisp Cream with Dark Border - Opens PDF in New Tab */}
          <a
            href={securePdfUrl || "#"}
            target="_blank"
            rel="noopener noreferrer"
            title={securePdfUrl ? "پی ڈی ایف آن لائن نئے ٹیب میں پڑھیں" : "پی ڈی ایف دستیاب نہیں ہے"}
            className={`flex items-center justify-between px-3.5 sm:px-5 py-2.5 sm:py-3 rounded-xl sm:rounded-2xl border font-bold transition-all duration-200 shadow-xs hover:bg-[#F3E8D8] active:scale-[0.99] min-h-[46px] sm:min-h-[48px] select-none ${
              !securePdfUrl ? "opacity-60 pointer-events-none" : "cursor-pointer"
            }`}
            style={{
              backgroundColor: "#FAF6EF",
              borderColor: "#2C2118",
              color: "#2C2118",
            }}
          >
            <BookOpen className="w-4 h-4 sm:w-4.5 sm:h-4.5 text-[#2C2118] shrink-0 stroke-[2.2]" />
            <span className="font-['Payami_Nastaleeq',serif] text-[14.5px] sm:text-base tracking-wide mx-2">
              آن لائن پڑھیں
            </span>
            <ArrowRight className="w-4 h-4 sm:w-4.5 sm:h-4.5 text-[#2C2118] shrink-0" />
          </a>
        </div>
      </div>
    </section>
  );
}
