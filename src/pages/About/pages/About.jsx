import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  BookOpen,
  GraduationCap,
  Award,
  Trophy,
  Feather,
  Sparkles,
  User,
  CheckCircle,
  FileText,
  Bookmark,
  Scale,
  MessageSquare,
  ShieldCheck,
  Compass,
  ArrowRight,
  ArrowLeft,
  Calendar,
  Layers,
} from 'lucide-react';
import muftiSahebImg from '@/assets/images/muftiSaheb.png';
import logoImg from '@/assets/images/logo.jpeg';
import { useSettings } from '@/hooks/useSettings';
import { COLORS } from '@/utils/themeColors';

// Decorative Watermark SVGs
const StarburstWatermark = () => (
  <svg
    className="absolute left-3 bottom-3 w-28 h-28 opacity-10 pointer-events-none select-none"
    viewBox="0 0 100 100"
    fill="currentColor"
    style={{ color: COLORS?.accent }}
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
    className="absolute left-3 bottom-0 w-32 h-24 opacity-15 pointer-events-none select-none"
    viewBox="0 0 120 100"
    fill="currentColor"
    style={{ color: COLORS?.accent }}
  >
    <path d="M60 15 C48 32 44 45 44 60 L76 60 C76 45 72 32 60 15 Z" />
    <rect x="40" y="60" width="40" height="40" rx="1" />
    <path
      d="M60 70 C54 70 52 75 52 84 L68 84 C68 75 66 70 60 70 Z"
      fill="#FAF5EE"
    />
    <rect x="14" y="28" width="8" height="72" />
    <path d="M18 12 L13 28 L23 28 Z" />
    <rect x="98" y="28" width="8" height="72" />
    <path d="M102 12 L97 28 L107 28 Z" />
    <path d="M30 45 C24 53 22 58 22 65 L38 65 C38 58 36 53 30 45 Z" />
    <path d="M90 45 C84 53 82 58 82 65 L98 65 C98 58 96 53 90 45 Z" />
  </svg>
);

const SealWatermark = () => (
  <svg
    className="absolute left-3 bottom-2 w-24 h-28 opacity-15 pointer-events-none select-none"
    viewBox="0 0 100 120"
    fill="currentColor"
    style={{ color: COLORS?.accent }}
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
    <circle cx="50" cy="45" r="16" fill="currentColor" opacity="0.1" />
    <path d="M34 74 L22 115 L50 98 L78 115 L66 74 Z" opacity="0.35" />
  </svg>
);

const QuillWatermark = () => (
  <svg
    className="absolute left-3 bottom-2 w-24 h-28 opacity-15 pointer-events-none select-none"
    viewBox="0 0 100 100"
    fill="currentColor"
    style={{ color: COLORS?.accent }}
  >
    <path
      d="M30 65 C30 58 40 55 50 55 C60 55 70 58 70 65 L76 90 C76 94 72 96 50 96 C28 96 24 94 24 90 Z"
      opacity="0.35"
    />
    <ellipse cx="50" cy="55" rx="14" ry="4" opacity="0.6" />
    <path d="M48 60 C54 38 70 14 92 4 C83 26 72 46 48 60 Z" opacity="0.55" />
    <path
      d="M48 60 L92 4"
      stroke="currentColor"
      strokeWidth="1.5"
      opacity="0.7"
    />
  </svg>
);

const DiamondBullet = () => (
  <span
    className="text-xs leading-none shrink-0 select-none"
    style={{ color: COLORS?.accent }}
  >
    ✦
  </span>
);

export default function About() {
  const { settings } = useSettings();
  const language =
    settings?.language === 'ur' || settings?.language === 'Urdu' ? 'ur' : 'en';
  const isRTL = language === 'ur';

  const scholarName =
    settings?.scholarInfo?.fullName ||
    (isRTL
      ? 'مفتی فیضان سرور مصباحی حفظہ اللہ'
      : 'Mufti Faizan Sarwar Misbahi');

  const scholarTitle =
    settings?.scholarInfo?.title ||
    (isRTL
      ? 'استاذ الحدیث و رئیس دار الافتاء'
      : 'Professor of Hadith & Head of Darul Ifta');

  const scholarPhoto = settings?.scholarInfo?.photo || muftiSahebImg;

  const scholarBio =
    settings?.scholarInfo?.biography ||
    (isRTL
      ? 'جامعہ کے ممتاز عالم، فقیہِ عصر اور محقق۔ علومِ اسلامیہ، فقہ و اصولِ فقہ، تفسیرِ قرآن اور علومِ حدیث میں گہری مہارت کے حامل۔ تدریس، افتاء اور تحقیقی و اصلاحی مقالات کے ذریعے امتِ مسلمہ کی فکری و دینی رہنمائی میں مسلسل مصروفِ عمل ہیں۔'
      : 'Eminent Islamic scholar, jurist and researcher specializing in Islamic Jurisprudence, Quranic Exegesis, and Hadith sciences. Actively serving the community through teaching, issuing authentic rulings, and authoring research papers.');

  const scholarQuote = isRTL
    ? 'علمِ دین محض معلومات کا نام نہیں، بلکہ یہ ایک نور ہے جو دلوں کو منور کرتا اور کردار کو سنوارتا ہے۔'
    : 'Islamic knowledge is not mere information; it is a sacred light that illuminates hearts and refines human character.';

  return (
    <div
      className="min-h-screen py-8 sm:py-12 px-4 sm:px-6 lg:px-8 font-sans"
      style={{ backgroundColor: COLORS?.background }}
      dir={isRTL ? 'rtl' : 'ltr'}
    >
      <div className="max-w-5xl mx-auto space-y-8">
        {/* ══════════════════════════════════════════════════════════════
            1. HERO SCHOLAR PROFILE BANNER
        ══════════════════════════════════════════════════════════════ */}
        <div
          className="rounded-2xl shadow-lg relative overflow-hidden text-white"
          style={{
            background: `linear-gradient(135deg, ${COLORS?.primary} 0%, #20140b 100%)`,
          }}
        >
          {/* Subtle Background Pattern */}
          <div
            className="absolute inset-0 opacity-[0.05] pointer-events-none"
            style={{
              backgroundImage: `radial-gradient(${COLORS?.accent} 1.5px, transparent 1.5px)`,
              backgroundSize: '20px 20px',
            }}
          />

          <div className="relative z-10 p-6 sm:p-10 flex flex-col md:flex-row items-center justify-between gap-8">
            {/* Right/Main: Scholar Info & Typography */}
            <div className="flex-1 space-y-4 text-start w-full">
              {/* Badge & Official Emblem */}
              <div className="flex items-center gap-3">
                <div className="w-11 h-11 rounded-full border-2 border-[#A8793E] overflow-hidden shrink-0 shadow-md bg-white">
                  <img
                    src={logoImg}
                    alt="Logo"
                    className="w-full h-full object-cover rounded-full"
                  />
                </div>
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider"
                  style={{ backgroundColor: `${COLORS?.accent}30`, color: COLORS?.accent }}
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>{isRTL ? 'سوانح حیات و تعارف' : 'Biography & Scholarly Profile'}</span>
                </div>
              </div>

              {/* Scholar Name & Title */}
              <div className="space-y-1">
                <h1 className="text-xl sm:text-2xl font-bold font-serif leading-relaxed text-white">
                  {scholarName}
                </h1>
                <p className="text-xs sm:text-sm font-semibold font-serif" style={{ color: COLORS?.accent }}>
                  {scholarTitle}
                </p>
              </div>

              {/* Bio description */}
              <p className="text-xs sm:text-sm leading-[2.2] font-light text-white/90">
                {scholarBio}
              </p>

              {/* Quote Block */}
              <div
                className="rounded-xl p-3.5 sm:p-4 text-xs leading-relaxed"
                style={{
                  backgroundColor: 'rgba(255,255,255,0.08)',
                  borderRight: isRTL ? `4px solid ${COLORS?.accent}` : undefined,
                  borderLeft: !isRTL ? `4px solid ${COLORS?.accent}` : undefined,
                  color: 'rgba(255,255,255,0.9)',
                }}
              >
                "{scholarQuote}"
              </div>

              {/* Quick Navigation CTAs */}
              <div className="flex flex-wrap items-center gap-2.5 pt-2">
                <Link
                  to="/fatwas"
                  className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold transition-transform hover:scale-105"
                  style={{ backgroundColor: COLORS?.accent, color: '#fff' }}
                >
                  <Scale className="w-3.5 h-3.5" />
                  <span>{isRTL ? 'فتاویٰ دیکھیں' : 'View Fatwas'}</span>
                </Link>
                <Link
                  to="/articles"
                  className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold border transition-colors hover:bg-white/10"
                  style={{ borderColor: 'rgba(255,255,255,0.3)', color: '#fff' }}
                >
                  <FileText className="w-3.5 h-3.5" />
                  <span>{isRTL ? 'علمی مقالات' : 'Read Articles'}</span>
                </Link>
                <Link
                  to="/books"
                  className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold border transition-colors hover:bg-white/10"
                  style={{ borderColor: 'rgba(255,255,255,0.3)', color: '#fff' }}
                >
                  <BookOpen className="w-3.5 h-3.5" />
                  <span>{isRTL ? 'تصنیفات و کتب' : 'Books'}</span>
                </Link>
              </div>
            </div>

            {/* Left: Scholar Portrait Arched Frame */}
            <div className="relative w-56 sm:w-64 shrink-0 flex items-center justify-center">
              <div
                className="relative w-52 sm:w-60 h-68 sm:h-76 rounded-t-full rounded-b-2xl overflow-hidden border-4 shadow-2xl flex items-end justify-center group"
                style={{
                  backgroundColor: COLORS?.secondary,
                  borderColor: 'rgba(255,255,255,0.25)',
                }}
              >
                <img
                  src={scholarPhoto}
                  alt={scholarName}
                  className="w-full h-full object-cover object-top relative z-10 transition-transform duration-500 group-hover:scale-105"
                  onError={(e) => {
                    if (e.currentTarget.src !== muftiSahebImg) {
                      e.currentTarget.src = muftiSahebImg;
                    }
                  }}
                />
              </div>
            </div>
          </div>
        </div>

        {/* ══════════════════════════════════════════════════════════════
            2. FOUR CORE SCHOLARLY PILLARS (2x2 GRID)
        ══════════════════════════════════════════════════════════════ */}
        <div>
          <div className="text-center mb-6">
            <span
              className="text-xs font-bold uppercase tracking-widest block mb-1 font-serif"
              style={{ color: COLORS?.accent }}
            >
              {isRTL ? 'علمی و فکری خاکہ' : 'ACADEMIC OVERVIEW'}
            </span>
            <h2
              className="text-xl sm:text-2xl font-bold font-serif"
              style={{ color: COLORS?.primary }}
            >
              {isRTL ? 'علمی اسناد، مہارت اور خدمات' : 'Credentials, Expertise & Contributions'}
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5 sm:gap-6">
            {/* Card 1: تعلیم اور اسناد */}
            <div
              className="rounded-2xl p-5 sm:p-6 shadow-xs relative overflow-hidden flex flex-col justify-between border"
              style={{
                backgroundColor: COLORS?.white,
                borderColor: COLORS?.border,
              }}
            >
              <StarburstWatermark />

              <div>
                <div
                  className="flex items-center justify-between pb-3 mb-4 border-b"
                  style={{ borderColor: `${COLORS?.border}90` }}
                >
                  <h3
                    className="text-sm sm:text-base font-bold font-serif"
                    style={{ color: COLORS?.primary }}
                  >
                    {isRTL ? 'تعلیم اور اسناد' : 'Education & Sanad'}
                  </h3>
                  <div
                    className="w-9 h-9 rounded-xl flex items-center justify-center border shrink-0"
                    style={{
                      backgroundColor: COLORS?.secondary,
                      borderColor: COLORS?.border,
                      color: COLORS?.primary,
                    }}
                  >
                    <GraduationCap className="w-4 h-4" />
                  </div>
                </div>

                <ul
                  className="space-y-2.5 text-xs sm:text-sm font-serif relative z-10 leading-relaxed"
                  style={{ color: COLORS?.textPrimary }}
                >
                  <li className="flex items-center gap-2">
                    <DiamondBullet />
                    <span>
                      {isRTL
                        ? 'درسِ نظامی و عالمیہ سند (علومِ اسلامیہ)'
                        : 'Dars-e-Nizami (Islamic Sciences Degree)'}
                    </span>
                  </li>
                  <li className="flex items-center gap-2">
                    <DiamondBullet />
                    <span>
                      {isRTL
                        ? 'تخصص فی الفقہ و الافتاء (فتویٰ نویسی)'
                        : 'Specialization in Fiqh & Fatwa issuance'}
                    </span>
                  </li>
                  <li className="flex items-center gap-2">
                    <DiamondBullet />
                    <span>
                      {isRTL
                        ? 'تخصص فی علوم الحدیث النبوی الشریف'
                        : 'Advanced specialization in Hadith sciences'}
                    </span>
                  </li>
                  <li className="flex items-center gap-2">
                    <DiamondBullet />
                    <span>
                      {isRTL
                        ? 'اجازت فی الحدیث و التفسیر معتبر شیوخ سے'
                        : 'Formal Ijazah in Hadith and Tafseer'}
                    </span>
                  </li>
                  <li className="flex items-center gap-2">
                    <DiamondBullet />
                    <span>
                      {isRTL
                        ? 'عربی ادب، بلاغت، اصولِ فقہ و منطق کی اسناد'
                        : 'Certifications in Arabic Literature and Rhetoric'}
                    </span>
                  </li>
                </ul>
              </div>
            </div>

            {/* Card 2: مہارت کے شعبے */}
            <div
              className="rounded-2xl p-5 sm:p-6 shadow-xs relative overflow-hidden flex flex-col justify-between border"
              style={{
                backgroundColor: COLORS?.white,
                borderColor: COLORS?.border,
              }}
            >
              <MosqueWatermark />

              <div>
                <div
                  className="flex items-center justify-between pb-3 mb-4 border-b"
                  style={{ borderColor: `${COLORS?.border}90` }}
                >
                  <h3
                    className="text-sm sm:text-base font-bold font-serif"
                    style={{ color: COLORS?.primary }}
                  >
                    {isRTL ? 'فقہی و علمی مہارت کے شعبے' : 'Fields of Expertise'}
                  </h3>
                  <div
                    className="w-9 h-9 rounded-xl flex items-center justify-center border shrink-0"
                    style={{
                      backgroundColor: COLORS?.secondary,
                      borderColor: COLORS?.border,
                      color: COLORS?.primary,
                    }}
                  >
                    <Award className="w-4 h-4" />
                  </div>
                </div>

                {/* Skills Tags Grid */}
                <div className="space-y-2.5 relative z-10 pt-1">
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                    {[
                      isRTL ? 'علم الحدیث و رجال' : 'Hadith Sciences',
                      isRTL ? 'فقہ و اصول فقہ' : 'Islamic Fiqh',
                      isRTL ? 'تفسیر و علوم قرآن' : 'Quranic Exegesis',
                      isRTL ? 'دعوت و اصلاح' : 'Dawah & Guidance',
                      isRTL ? 'عصری معاشی مسائل' : 'Islamic Finance',
                      isRTL ? 'معاشرتی و عائلی رہنمائی' : 'Family Guidance',
                    ].map((tag, idx) => (
                      <div
                        key={idx}
                        className="border rounded-xl py-2 px-2 text-center font-bold text-[11px] transition-colors"
                        style={{
                          backgroundColor: COLORS?.background,
                          borderColor: COLORS?.border,
                          color: COLORS?.primary,
                        }}
                      >
                        {tag}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Card 3: تدریسی و تنظیمی تجربات */}
            <div
              className="rounded-2xl p-5 sm:p-6 shadow-xs relative overflow-hidden flex flex-col justify-between border"
              style={{
                backgroundColor: COLORS?.white,
                borderColor: COLORS?.border,
              }}
            >
              <SealWatermark />

              <div>
                <div
                  className="flex items-center justify-between pb-3 mb-4 border-b"
                  style={{ borderColor: `${COLORS?.border}90` }}
                >
                  <h3
                    className="text-sm sm:text-base font-bold font-serif"
                    style={{ color: COLORS?.primary }}
                  >
                    {isRTL ? 'خدمات اور تدریسی تجربات' : 'Academic Contributions'}
                  </h3>
                  <div
                    className="w-9 h-9 rounded-xl flex items-center justify-center border shrink-0"
                    style={{
                      backgroundColor: COLORS?.secondary,
                      borderColor: COLORS?.border,
                      color: COLORS?.primary,
                    }}
                  >
                    <Trophy className="w-4 h-4" />
                  </div>
                </div>

                <ul
                  className="space-y-2.5 text-xs sm:text-sm font-serif relative z-10 leading-relaxed"
                  style={{ color: COLORS?.textPrimary }}
                >
                  <li className="flex items-center gap-2">
                    <DiamondBullet />
                    <span>
                      {isRTL
                        ? 'جامعہ کے دار الافتاء میں فتاویٰ نویسی و تصدیق'
                        : 'Issuance and verification of formal Shariah rulings'}
                    </span>
                  </li>
                  <li className="flex items-center gap-2">
                    <DiamondBullet />
                    <span>
                      {isRTL
                        ? 'متعدد دینی مدارس میں کتبِ حدیث و فقہ کی تدریس'
                        : 'Teaching Hadith & Fiqh at prominent Islamic seminaries'}
                    </span>
                  </li>
                  <li className="flex items-center gap-2">
                    <DiamondBullet />
                    <span>
                      {isRTL
                        ? 'ہزاروں سائلین کے مسائل کا بروقت شرعی حل'
                        : 'Guiding thousands of community members on daily life issues'}
                    </span>
                  </li>
                  <li className="flex items-center gap-2">
                    <DiamondBullet />
                    <span>
                      {isRTL
                        ? 'علمی سیمینارز اور تربیتی نشستوں کا انعقاد'
                        : 'Conducting academic seminars and workshops'}
                    </span>
                  </li>
                </ul>
              </div>
            </div>

            {/* Card 4: تصنیفی و تحقیقی کام */}
            <div
              className="rounded-2xl p-5 sm:p-6 shadow-xs relative overflow-hidden flex flex-col justify-between border"
              style={{
                backgroundColor: COLORS?.white,
                borderColor: COLORS?.border,
              }}
            >
              <QuillWatermark />

              <div>
                <div
                  className="flex items-center justify-between pb-3 mb-4 border-b"
                  style={{ borderColor: `${COLORS?.border}90` }}
                >
                  <h3
                    className="text-sm sm:text-base font-bold font-serif"
                    style={{ color: COLORS?.primary }}
                  >
                    {isRTL ? 'تحقیق اور تصنیفی خدمات' : 'Publications & Research'}
                  </h3>
                  <div
                    className="w-9 h-9 rounded-xl flex items-center justify-center border shrink-0"
                    style={{
                      backgroundColor: COLORS?.secondary,
                      borderColor: COLORS?.border,
                      color: COLORS?.primary,
                    }}
                  >
                    <Feather className="w-4 h-4" />
                  </div>
                </div>

                <ul
                  className="space-y-2.5 text-xs sm:text-sm font-serif relative z-10 leading-relaxed"
                  style={{ color: COLORS?.textPrimary }}
                >
                  <li className="flex items-center gap-2">
                    <DiamondBullet />
                    <span>
                      {isRTL
                        ? 'مختلف موضوعات پر تحقیقی کتب و کتبچے'
                        : 'Authored research monographs and books'}
                    </span>
                  </li>
                  <li className="flex items-center gap-2">
                    <DiamondBullet />
                    <span>
                      {isRTL
                        ? 'فقہی و فکری موضوعات پر علمی مقالات'
                        : 'Scholarly research papers on jurisprudential issues'}
                    </span>
                  </li>
                  <li className="flex items-center gap-2">
                    <DiamondBullet />
                    <span>
                      {isRTL
                        ? 'احادیث کی تخریج و تحقیق کا علمی کام'
                        : 'Hadith verification and authentication studies'}
                    </span>
                  </li>
                  <li className="flex items-center gap-2">
                    <DiamondBullet />
                    <span>
                      {isRTL
                        ? 'اصلاحی دروس، بیانات اور فکری خطبات'
                        : 'Recorded educational lectures and spiritual guidance'}
                    </span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        {/* ══════════════════════════════════════════════════════════════
            3. SCHOLARLY METHODOLOGY CALLOUT (منہج و اصول)
        ══════════════════════════════════════════════════════════════ */}
        <div
          className="rounded-2xl p-6 sm:p-8 border shadow-xs text-start"
          style={{
            backgroundColor: COLORS?.white,
            borderColor: COLORS?.border,
          }}
        >
          <div className="flex items-center gap-3 mb-3">
            <div
              className="w-9 h-9 rounded-xl flex items-center justify-center shadow-xs"
              style={{ backgroundColor: `${COLORS?.primary}15`, color: COLORS?.primary }}
            >
              <Compass className="w-5 h-5" />
            </div>
            <h3
              className="text-base sm:text-lg font-bold font-serif"
              style={{ color: COLORS?.primary }}
            >
              {isRTL ? 'علمی و تحقیقی منہج' : 'Academic Methodology'}
            </h3>
          </div>
          <p
            className="text-xs sm:text-sm leading-[2.3] font-normal"
            style={{ color: COLORS?.textSecondary }}
          >
            {isRTL
              ? 'قرآن و سنت کی روشنی میں سلفِ صالحین اور ائمۂ اربعہ بالخصوص فقہِ حنفی کے مستند مصادر و مراجع سے اخذ و استنباط، اعتدال و توازن کا التزام، اور دورِ حاضر کے جدید تقاضوں اور پیچیدہ مسائل میں امت کی شرعی رہنمائی دار الافتاء کا بنیادی فکری منہج ہے۔'
              : 'Our methodology is deeply grounded in the Quran and Sunnah, adhering to the authenticated classical sources of Islamic jurisprudence (Fiqh), practicing moderation, and offering balanced Islamic guidance on modern contemporary challenges.'}
          </p>
        </div>
      </div>
    </div>
  );
}
