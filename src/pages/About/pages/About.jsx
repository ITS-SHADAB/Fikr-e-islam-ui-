import React from 'react';
import {
  BookOpen,
  GraduationCap,
  Award,
  Trophy,
  Feather,
  Sparkles,
} from 'lucide-react';
import muftiSahebImg from '@/assets/images/muftiSaheb.png';

// Decorative SVGs matching the design
const StarburstWatermark = () => (
  <svg
    className="absolute left-4 bottom-4 w-32 h-32 text-[#8C5D35]/10 pointer-events-none select-none"
    viewBox="0 0 100 100"
    fill="currentColor"
  >
    <path
      d="M50 0 L61 39 L100 50 L61 61 L50 100 L39 61 L0 50 L39 39 Z"
      opacity="0.5"
    />
    <path
      d="M50 10 L58 42 L90 50 L58 58 L50 90 L42 58 L10 50 L42 42 Z"
      opacity="0.3"
    />
    <circle
      cx="50"
      cy="50"
      r="18"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      opacity="0.4"
    />
    <circle
      cx="50"
      cy="50"
      r="30"
      fill="none"
      stroke="currentColor"
      strokeWidth="1"
      strokeDasharray="3 3"
      opacity="0.3"
    />
  </svg>
);

const MosqueWatermark = () => (
  <svg
    className="absolute left-3 bottom-0 w-36 h-28 text-[#8C5D35]/12 pointer-events-none select-none"
    viewBox="0 0 120 100"
    fill="currentColor"
  >
    {/* Main Dome */}
    <path d="M60 15 C48 32 44 45 44 60 L76 60 C76 45 72 32 60 15 Z" />
    <rect x="40" y="60" width="40" height="40" rx="1" />
    <path
      d="M60 70 C54 70 52 75 52 84 L68 84 C68 75 66 70 60 70 Z"
      fill="#FAF5EE"
    />
    {/* Left Minaret */}
    <rect x="14" y="28" width="8" height="72" />
    <path d="M18 12 L13 28 L23 28 Z" />
    {/* Right Minaret */}
    <rect x="98" y="28" width="8" height="72" />
    <path d="M102 12 L97 28 L107 28 Z" />
    {/* Left Small Dome */}
    <path d="M30 45 C24 53 22 58 22 65 L38 65 C38 58 36 53 30 45 Z" />
    {/* Right Small Dome */}
    <path d="M90 45 C84 53 82 58 82 65 L98 65 C98 58 96 53 90 45 Z" />
  </svg>
);

const SealWatermark = () => (
  <svg
    className="absolute left-4 bottom-2 w-28 h-32 text-[#8C5D35]/12 pointer-events-none select-none"
    viewBox="0 0 100 120"
    fill="currentColor"
  >
    <circle
      cx="50"
      cy="45"
      r="34"
      fill="none"
      stroke="currentColor"
      strokeWidth="3"
      opacity="0.4"
    />
    <circle
      cx="50"
      cy="45"
      r="26"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeDasharray="4 2"
      opacity="0.5"
    />
    <circle
      cx="50"
      cy="45"
      r="16"
      fill="currentColor"
      opacity="0.1"
    />
    <path
      d="M34 74 L22 115 L50 98 L78 115 L66 74 Z"
      opacity="0.35"
    />
  </svg>
);

const QuillWatermark = () => (
  <svg
    className="absolute left-4 bottom-2 w-28 h-32 text-[#8C5D35]/15 pointer-events-none select-none"
    viewBox="0 0 100 100"
    fill="currentColor"
  >
    {/* Inkpot */}
    <path
      d="M30 65 C30 58 40 55 50 55 C60 55 70 58 70 65 L76 90 C76 94 72 96 50 96 C28 96 24 94 24 90 Z"
      opacity="0.35"
    />
    <ellipse cx="50" cy="55" rx="14" ry="4" opacity="0.6" />
    {/* Quill Feather */}
    <path
      d="M48 60 C54 38 70 14 92 4 C83 26 72 46 48 60 Z"
      opacity="0.55"
    />
    <path
      d="M48 60 L92 4"
      stroke="currentColor"
      strokeWidth="1.5"
      opacity="0.7"
    />
  </svg>
);

// Diamond bullet icon
const DiamondBullet = () => (
  <span className="text-[#8C5D35] text-xs leading-none shrink-0 select-none">
    ✦
  </span>
);

export default function About() {
  return (
    <div
      className="min-h-screen bg-[#FBF9F5] py-10 px-4 sm:px-6 lg:px-8 font-sans text-right"
      dir="rtl"
    >
      <div className="max-w-6xl mx-auto space-y-7">
        {/* ══════════════════════════════════════════════════════════════
            1. TOP HERO INTRODUCTION BANNER
        ══════════════════════════════════════════════════════════════ */}
        <div className="bg-[#FAF6F0] border-2 border-[#EBDCCB] rounded-3xl p-6 sm:p-8 md:p-9 shadow-sm relative overflow-hidden flex flex-col md:flex-row items-center justify-between gap-8 md:gap-10 text-right">
          {/* Subtle Background Pattern */}
          <div className="absolute inset-0 opacity-[0.03] bg-[radial-gradient(#8C5D35_1.5px,transparent_1.5px)] [background-size:18px_18px] pointer-events-none"></div>

          {/* Right: Scholar Info & Bio (Renders on the Right in RTL) */}
          <div className="flex-1 space-y-4 text-right z-10 w-full">
            {/* Top Row: Subtitle + Book Badge on Top Right */}
            <div className="flex items-center justify-end gap-3">
              <span className="text-xs sm:text-sm font-semibold text-[#8C5D35] font-serif">
                علم کا نور بانٹتے
              </span>
              <div className="w-12 h-12 rounded-2xl bg-[#EFE3D3] text-[#5C3417] flex items-center justify-center shadow-xs border border-[#DFCEBA] shrink-0">
                <BookOpen className="w-6 h-6" />
              </div>
            </div>

            {/* Scholar Name & Subtitle */}
            <div className="space-y-1">
              <h1 className="text-2xl sm:text-3xl font-bold text-[#2C1810] font-serif leading-relaxed">
                حضرت مولانا سید محمد یوسف بنوری رحمہ اللہ
              </h1>
              <p className="text-sm sm:text-base font-semibold text-[#6D4327] font-serif">
                بانی و شیخ الحدیث جامعہ علوم اسلامیہ
              </p>
            </div>

            {/* Ornamental Divider Line */}
            <div className="flex items-center gap-3 pt-2 pb-1">
              <div className="flex-1 h-px bg-gradient-to-l from-transparent via-[#D4BEA7] to-transparent"></div>
              <span className="text-[#8C5D35] text-xs">✤</span>
              <div className="flex-1 h-px bg-gradient-to-r from-transparent via-[#D4BEA7] to-transparent"></div>
            </div>

            {/* Sawanih-e-Hayat Heading & Text */}
            <div className="space-y-1.5 pt-1">
              <h2 className="text-base sm:text-lg font-bold text-[#2C1810] font-serif">
                سوانح حیات
              </h2>
              <p className="text-xs sm:text-sm text-slate-700 leading-relaxed font-serif font-light">
                جامعہ العلوم الاسلامیہ علامہ بنوری ٹاؤن، عظیم شخصیت و تصنیف، اور مفسرِ قرآن کی علمی خدمات پوری دنیا میں روشنی ہیں۔
              </p>
            </div>
          </div>

          {/* Left: Scholar Arched Frame (Renders on the Left in RTL) */}
          <div className="relative w-full md:w-80 lg:w-96 shrink-0 flex items-center justify-center">
            {/* Arch Silhouette Container */}
            <div className="relative w-64 sm:w-72 h-80 sm:h-92 rounded-t-full rounded-b-2xl overflow-hidden border-4 border-white shadow-xl bg-gradient-to-b from-[#F2E5D5] to-[#E5D2BE] flex items-end justify-center">
              {/* Islamic Arch Border Ornament */}
              <div className="absolute inset-0 border border-[#D8C2AA] rounded-t-full rounded-b-2xl pointer-events-none"></div>
              <img
                src={muftiSahebImg}
                alt="حضرت مولانا سید محمد یوسف بنوری رحمہ اللہ"
                className="w-full h-full object-cover object-top relative z-10 scale-105 hover:scale-110 transition-transform duration-500"
              />
            </div>
          </div>
        </div>

        {/* ══════════════════════════════════════════════════════════════
            2. FOUR MODULAR FEATURE CARDS (2x2 GRID)
        ══════════════════════════════════════════════════════════════ */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-7">
          {/* ───────────────────────────────────────────────────────────
              Card 1: تعلیم اور استاد (Top Right)
          ─────────────────────────────────────────────────────────── */}
          <div className="bg-[#FAF6F0] border-2 border-[#EBDCCB] rounded-3xl p-6 sm:p-7 shadow-xs relative overflow-hidden min-h-[290px] flex flex-col justify-between">
            <StarburstWatermark />

            <div>
              {/* Header */}
              <div className="flex items-center justify-between pb-3 mb-4 border-b border-[#E3D0BE]">
                <div className="flex items-center gap-2">
                  <h3 className="text-base sm:text-lg font-bold text-[#2C1810] font-serif">
                    تعلیم اور استاد
                  </h3>
                </div>
                <div className="w-10 h-10 rounded-2xl bg-[#EFE3D3] text-[#5C3417] flex items-center justify-center border border-[#DFCEBA] shrink-0">
                  <GraduationCap className="w-5 h-5" />
                </div>
              </div>

              {/* Bullet List */}
              <ul className="space-y-2.5 text-xs sm:text-sm text-slate-800 font-serif relative z-10 leading-relaxed">
                <li className="flex items-center gap-2">
                  <DiamondBullet />
                  <span>مدرسہ تعلیم دارالعلوم دیوبند و دیگر مدارس علوم اسلامیہ سے وابستہ</span>
                </li>
                <li className="flex items-center gap-2">
                  <DiamondBullet />
                  <span>پروفیسر عسکری علی تعلیم</span>
                </li>
                <li className="flex items-center gap-2">
                  <DiamondBullet />
                  <span>تخصص فی علوم الحدیث و الفقہ</span>
                </li>
                <li className="flex items-center gap-2">
                  <DiamondBullet />
                  <span>تعلیمی اسناد</span>
                </li>
                <li className="flex items-center gap-2">
                  <DiamondBullet />
                  <span>اجازت فی الحدیث و التفسیر</span>
                </li>
                <li className="flex items-center gap-2">
                  <DiamondBullet />
                  <span>اجازات علوم، عربی، ادب، حدیث</span>
                </li>
                <li className="flex items-center gap-2">
                  <DiamondBullet />
                  <span>رئیس مجلس علمی</span>
                </li>
              </ul>
            </div>
          </div>

          {/* ───────────────────────────────────────────────────────────
              Card 2: مہارت کے شعبے (Top Left)
          ─────────────────────────────────────────────────────────── */}
          <div className="bg-[#FAF6F0] border-2 border-[#EBDCCB] rounded-3xl p-6 sm:p-7 shadow-xs relative overflow-hidden min-h-[290px] flex flex-col justify-between">
            <MosqueWatermark />

            <div>
              {/* Header */}
              <div className="flex items-center justify-between pb-3 mb-5 border-b border-[#E3D0BE]">
                <div className="flex items-center gap-2">
                  <h3 className="text-base sm:text-lg font-bold text-[#2C1810] font-serif">
                    مہارت کے شعبے
                  </h3>
                </div>
                <div className="w-10 h-10 rounded-2xl bg-[#EFE3D3] text-[#5C3417] flex items-center justify-center border border-[#DFCEBA] shrink-0">
                  <Award className="w-5 h-5" />
                </div>
              </div>

              {/* 2 Rows of 3 Rounded Pill Tags */}
              <div className="space-y-3 relative z-10 pt-2">
                {/* Row 1 */}
                <div className="grid grid-cols-3 gap-2 sm:gap-2.5">
                  {[
                    'علم الحدیث و رجال',
                    'فقہ و اصول فقہ',
                    'تفسیر و علوم القرآن',
                  ].map((tag, idx) => (
                    <div
                      key={idx}
                      className="bg-[#F3E8DB] hover:bg-[#EBDCCB] text-[#4A2612] border border-[#DFCBB7] rounded-full py-1.5 px-2 text-center font-bold text-[11px] sm:text-xs transition-colors shadow-2xs leading-normal"
                    >
                      {tag}
                    </div>
                  ))}
                </div>

                {/* Row 2 */}
                <div className="grid grid-cols-3 gap-2 sm:gap-2.5">
                  {[
                    'دعوت و اصلاح',
                    'تعلیم و تربیت',
                    'فقہ و مسائلِ زمانہ',
                  ].map((tag, idx) => (
                    <div
                      key={idx}
                      className="bg-[#F3E8DB] hover:bg-[#EBDCCB] text-[#4A2612] border border-[#DFCBB7] rounded-full py-1.5 px-2 text-center font-bold text-[11px] sm:text-xs transition-colors shadow-2xs leading-normal"
                    >
                      {tag}
                    </div>
                  ))}
                </div>

              </div>
            </div>
          </div>

          {/* ───────────────────────────────────────────────────────────
              Card 3: تجربہ اور کامیابیاں (Bottom Right)
          ─────────────────────────────────────────────────────────── */}
          <div className="bg-[#FAF6F0] border-2 border-[#EBDCCB] rounded-3xl p-6 sm:p-7 shadow-xs relative overflow-hidden min-h-[270px] flex flex-col justify-between">
            <SealWatermark />

            <div>
              {/* Header */}
              <div className="flex items-center justify-between pb-3 mb-4 border-b border-[#E3D0BE]">
                <div className="flex items-center gap-2">
                  <h3 className="text-base sm:text-lg font-bold text-[#2C1810] font-serif">
                    تجربہ اور کامیابیاں
                  </h3>
                </div>
                <div className="w-10 h-10 rounded-2xl bg-[#EFE3D3] text-[#5C3417] flex items-center justify-center border border-[#DFCEBA] shrink-0">
                  <Trophy className="w-5 h-5" />
                </div>
              </div>

              {/* Bullet List */}
              <ul className="space-y-3 text-xs sm:text-sm text-slate-800 font-serif relative z-10 leading-relaxed">
                <li className="flex items-center gap-2">
                  <DiamondBullet />
                  <span>مدرسہ جامعہ العلوم الاسلامیہ کے قیام و ترقی میں اہم کردار</span>
                </li>
                <li className="flex items-center gap-2">
                  <DiamondBullet />
                  <span>ہزاروں طلبہ کی تعلیم و تربیت</span>
                </li>
                <li className="flex items-center gap-2">
                  <DiamondBullet />
                  <span>دینی و علمی خدمات پر متعدد اعزازات</span>
                </li>
                <li className="flex items-center gap-2">
                  <DiamondBullet />
                  <span>قوم و ملت کی راہنمائی و رہبری</span>
                </li>
              </ul>
            </div>
          </div>

          {/* ───────────────────────────────────────────────────────────
              Card 4: تحقیق اور تحقیقاتی کام (Bottom Left)
          ─────────────────────────────────────────────────────────── */}
          <div className="bg-[#FAF6F0] border-2 border-[#EBDCCB] rounded-3xl p-6 sm:p-7 shadow-xs relative overflow-hidden min-h-[270px] flex flex-col justify-between">
            <QuillWatermark />

            <div>
              {/* Header */}
              <div className="flex items-center justify-between pb-3 mb-4 border-b border-[#E3D0BE]">
                <div className="flex items-center gap-2">
                  <h3 className="text-base sm:text-lg font-bold text-[#2C1810] font-serif">
                    تحقیق اور تحقیقاتی کام
                  </h3>
                </div>
                <div className="w-10 h-10 rounded-2xl bg-[#EFE3D3] text-[#5C3417] flex items-center justify-center border border-[#DFCEBA] shrink-0">
                  <Feather className="w-5 h-5" />
                </div>
              </div>

              {/* Bullet List */}
              <ul className="space-y-2.5 text-xs sm:text-sm text-slate-800 font-serif relative z-10 leading-relaxed">
                <li className="flex items-center gap-2">
                  <DiamondBullet />
                  <span>تحقیق و تالیف</span>
                </li>
                <li className="flex items-center gap-2">
                  <DiamondBullet />
                  <span>شرح جامع ترمذی (معارف السنن)</span>
                </li>
                <li className="flex items-center gap-2">
                  <DiamondBullet />
                  <span>تحقیق و تخریج احادیث</span>
                </li>
                <li className="flex items-center gap-2">
                  <DiamondBullet />
                  <span>دینی و علمی مقالات کی اشاعت</span>
                </li>
                <li className="flex items-center gap-2">
                  <DiamondBullet />
                  <span>خطبات، دروس و تقاریر</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
