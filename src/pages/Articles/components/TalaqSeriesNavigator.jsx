import React from "react";
import PropTypes from "prop-types";
import { Link } from "react-router-dom";
import {
  BookOpen,
  ArrowRight,
  ArrowLeft,
  CheckCircle2,
  Scale,
  FileText,
  User,
  ExternalLink,
} from "lucide-react";

export const TALAQ_SERIES_PARTS = [
  {
    partNumber: 1,
    partLabel: "قسط اول",
    title: "ایک مجلس کی تین طلاقیں: جامعہ منعمیہ پٹنہ کے فتوے کا علمی جائزہ",
    slug: "ایک-مجلس-کی-تین-طلاقیں-جامعہ-منعمیہ-پٹنہ-کے-فتوے-کا-علمی-جائزہ-قسط-اول",
    topic: "جامعہ منعمیہ کے فتوے کا تنقیدی و اصولی جائزہ",
  },
  {
    partNumber: 2,
    partLabel: "قسط دوم",
    title: "ایک مجلس کی تین طلاقیں: مذاہبِ اربعہ اور فقہی اصولوں کی روشنی میں",
    slug: "ایک-مجلس-کی-تین-طلاقیں-مذاہب-اربعہ-اور-فقہی-اصولوں-کی-روشنی-میں-قسط-دوم",
    topic: "فقہِ حنفی، مالکی، شافعی و حنبلی کا اجماع و موقف",
  },
  {
    partNumber: 3,
    partLabel: "قسط سوم",
    title: "ایک مجلس کی تین طلاقیں: قرآنی و تفسیری دلائل کا تحقیقی جائزہ",
    slug: "ایک-مجلس-کی-تین-طلاقیں-قرآنی-و-تفسیری-دلائل-کا-تحقیقی-جائزہ-قسط-سوم",
    topic: "آیاتِ طلاق اور معتبر تفاسیر کی روشنی میں دلائل",
  },
  {
    partNumber: 4,
    partLabel: "قسط چہارم",
    title: "ایک مجلس کی تین طلاقیں: حدیثی دلائل کا فنی و اصولی جائزہ",
    slug: "ایک-مجلس-کی-تین-طلاقیں-حدیثی-دلائل-کا-فنی-و-اصولی-جائزہ-قسط-چہارم",
    topic: "احادیثِ صحیحہ و آثارِ صحابہؓ کی اسنادی تحقیق",
  },
  {
    partNumber: 5,
    partLabel: "قسط پنجم",
    title: "ایک مجلس کی تین طلاقیں: روایتِ طاؤس عن ابی الصہباء کا فنی و تحقیقی جائزہ",
    slug: "ایک-مجلس-کی-تین-طلاقیں-روایت-طاؤس-عن-ابی-الصہباء-کا-فنی-و-تحقیقی-جائزہ-قسط-پنجم",
    topic: "روایتِ طاؤس کے فنی جوابات اور محدثین کی توجیہات",
  },
];

export const RELATED_TALAQ_FATWAS = [
  {
    title: "اکٹھی دی گئی تین طلاقیں، تین ہی مانی جائیں گی، اس باب میں جہالت عذر نہیں",
    slug: "اکٹھی-دی-گئی-تین-طلاقیں-تین-ہی-مانی-جائیں-گی-اس-باب-میں-جہالت-عذر-نہیں",
    category: "طلاق",
  },
  {
    title: "تین طلاق اور عدت میں نکاح کا حکم",
    slug: "تین-طلاق-اور-عدت-میں-نکاح-کا-حکم",
    category: "طلاق",
  },
  {
    title: "طلاقِ مغلظہ کا مسئلہ اور رجوع کی شرعی صورتیں",
    slug: "طلاق-مغلظہ-کا-مسئلہ",
    category: "طلاق",
  },
];

export default function TalaqSeriesNavigator({
  currentSlug = "",
  theme = {
    cardBg: "#F7F1E8",
    panelBg: "#FCF8F1",
    darkBrown: "#2B2118",
    goldAccent: "#A8793E",
    secondaryBorder: "#C8A46A",
    lightGold: "#D8C09A",
    noticeBg: "#EFE6D9",
    textMuted: "#685545",
  },
}) {
  const currentIndex = TALAQ_SERIES_PARTS.findIndex(
    (p) => p.slug === currentSlug || currentSlug?.includes(encodeURI(p.slug))
  );

  const isSeriesArticle = currentIndex !== -1;
  if (!isSeriesArticle) return null;

  const currentPart = TALAQ_SERIES_PARTS[currentIndex];
  const prevPart = currentIndex > 0 ? TALAQ_SERIES_PARTS[currentIndex - 1] : null;
  const nextPart =
    currentIndex < TALAQ_SERIES_PARTS.length - 1
      ? TALAQ_SERIES_PARTS[currentIndex + 1]
      : null;

  return (
    <section
      dir="rtl"
      aria-labelledby="talaq-series-heading"
      className="my-6 rounded-[22px] sm:rounded-[26px] border p-4 sm:p-6 md:p-7 relative overflow-hidden transition-all duration-300"
      style={{
        backgroundColor: theme.cardBg,
        borderColor: theme.secondaryBorder,
        boxShadow: "0 6px 24px rgba(43, 33, 24, 0.05)",
      }}
    >
      {/* Series Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 mb-4 pb-3.5 border-b"
        style={{ borderColor: theme.lightGold }}
      >
        <div className="flex items-center gap-2.5">
          <div
            className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl flex items-center justify-center border shadow-xs"
            style={{
              backgroundColor: "#2B2118",
              borderColor: theme.secondaryBorder,
              color: "#FAF6EF",
            }}
          >
            <BookOpen className="w-5 h-5 text-amber-300" />
          </div>
          <div>
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] sm:text-xs font-bold uppercase tracking-wider mb-1"
              style={{
                backgroundColor: theme.noticeBg,
                color: theme.goldAccent,
              }}
            >
              <Scale className="w-3 h-3" />
              <span>تحقیقی فقہی سلسلہ (5 اقساط)</span>
            </div>
            <h2
              id="talaq-series-heading"
              className="text-base sm:text-lg md:text-xl font-bold font-['Payami_Nastaleeq',serif] leading-tight"
              style={{ color: theme.darkBrown }}
            >
              سلسلۂ مضامین: ایک مجلس کی تین طلاقیں
            </h2>
          </div>
        </div>

        <Link
          to="/about"
          className="inline-flex items-center gap-1.5 text-xs font-medium px-3 py-1.5 rounded-xl border transition-colors hover:bg-white"
          style={{
            borderColor: `${theme.secondaryBorder}70`,
            color: theme.textMuted,
            backgroundColor: "rgba(255,255,255,0.6)",
          }}
          title="مصنف کا تعارف"
        >
          <User className="w-3.5 h-3.5 text-[#A8793E]" />
          <span className="font-['Payami_Nastaleeq',serif]">بقلم: مفتی محمد فیضان سرور مصباحی</span>
        </Link>
      </div>

      <p
        className="text-xs sm:text-sm font-['Payami_Nastaleeq',serif] leading-[2] mb-5 opacity-90"
        style={{ color: theme.textMuted }}
      >
        ایک نشست کی تین طلاقوں کے شرعی وقوع پر مفتی محمد فیضان سرور مصباحی کا تفصیلی علمی و فنی جائزہ۔ اس علمی سلسلے کی تمام اقساط درج ذیل ہیں:
      </p>

      {/* Part Navigation Grid */}
      <div className="space-y-2 mb-6">
        {TALAQ_SERIES_PARTS.map((part, idx) => {
          const isCurrent = idx === currentIndex;
          return (
            <Link
              key={part.slug}
              to={`/articles/${part.slug}`}
              className={`flex items-center justify-between gap-3 p-3 sm:p-3.5 rounded-xl border transition-all duration-200 ${
                isCurrent
                  ? "shadow-sm scale-[1.01]"
                  : "hover:bg-white/80 active:scale-[0.99]"
              }`}
              style={{
                backgroundColor: isCurrent ? "#2B2118" : theme.panelBg,
                borderColor: isCurrent ? "#2B2118" : `${theme.secondaryBorder}60`,
                color: isCurrent ? "#FAF6EF" : theme.darkBrown,
              }}
            >
              <div className="flex items-center gap-3 min-w-0">
                <span
                  className="w-7 h-7 rounded-lg flex items-center justify-center font-bold text-xs shrink-0 font-mono"
                  style={{
                    backgroundColor: isCurrent ? theme.goldAccent : "#E4D5C2",
                    color: isCurrent ? "#FFFFFF" : theme.darkBrown,
                  }}
                >
                  {part.partNumber}
                </span>
                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <span
                      className="text-xs font-bold font-['Payami_Nastaleeq',serif] shrink-0"
                      style={{
                        color: isCurrent ? "#D8C09A" : theme.goldAccent,
                      }}
                    >
                      {part.partLabel}:
                    </span>
                    <span className="text-xs sm:text-sm font-semibold font-['Payami_Nastaleeq',serif] truncate">
                      {part.topic}
                    </span>
                  </div>
                </div>
              </div>

              {isCurrent ? (
                <span className="inline-flex items-center gap-1 text-[11px] font-bold px-2 py-0.5 rounded-full shrink-0 bg-[#A8793E] text-white">
                  <CheckCircle2 className="w-3 h-3" />
                  <span>زیرِ مطالعہ</span>
                </span>
              ) : (
                <ArrowLeft
                  className="w-4 h-4 shrink-0 transition-transform group-hover:-translate-x-1"
                  style={{ color: theme.goldAccent }}
                />
              )}
            </Link>
          );
        })}
      </div>

      {/* Prev / Next Buttons */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-6 pt-2 border-t"
        style={{ borderColor: `${theme.lightGold}80` }}
      >
        {prevPart ? (
          <Link
            to={`/articles/${prevPart.slug}`}
            className="flex items-center justify-between p-3 rounded-xl border transition-all hover:bg-white group"
            style={{
              borderColor: theme.secondaryBorder,
              backgroundColor: theme.panelBg,
            }}
          >
            <div className="flex items-center gap-2">
              <ArrowRight className="w-4 h-4 text-[#A8793E] transition-transform group-hover:translate-x-1" />
              <div className="text-start">
                <span className="block text-[11px] text-[#A8793E] font-bold font-['Payami_Nastaleeq',serif]">
                  پچھلی قسط ({prevPart.partLabel})
                </span>
                <span className="block text-xs sm:text-sm font-bold text-[#2B2118] font-['Payami_Nastaleeq',serif] line-clamp-1">
                  {prevPart.topic}
                </span>
              </div>
            </div>
          </Link>
        ) : (
          <div className="hidden sm:block" />
        )}

        {nextPart && (
          <Link
            to={`/articles/${nextPart.slug}`}
            className="flex items-center justify-between p-3 rounded-xl border transition-all hover:bg-white group sm:col-start-2"
            style={{
              borderColor: theme.secondaryBorder,
              backgroundColor: theme.panelBg,
            }}
          >
            <div className="text-start">
              <span className="block text-[11px] text-[#A8793E] font-bold font-['Payami_Nastaleeq',serif]">
                اگلی قسط ({nextPart.partLabel})
              </span>
              <span className="block text-xs sm:text-sm font-bold text-[#2B2118] font-['Payami_Nastaleeq',serif] line-clamp-1">
                {nextPart.topic}
              </span>
            </div>
            <ArrowLeft className="w-4 h-4 text-[#A8793E] transition-transform group-hover:-translate-x-1" />
          </Link>
        )}
      </div>

      {/* Related Practical Talaq Fatwas (Semantic Linking) */}
      <div
        className="rounded-2xl p-4 sm:p-5 border"
        style={{
          backgroundColor: theme.panelBg,
          borderColor: theme.lightGold,
        }}
      >
        <div className="flex items-center justify-between mb-3 pb-2 border-b"
          style={{ borderColor: `${theme.secondaryBorder}50` }}
        >
          <div className="flex items-center gap-2">
            <Scale className="w-4 h-4 text-[#A8793E]" />
            <h3 className="text-xs sm:text-sm font-bold font-['Payami_Nastaleeq',serif] text-[#2B2118]">
              متعلقہ دار الافتاء کے شرعی فتاویٰ (طلاق کے عملی مسائل)
            </h3>
          </div>
          <Link
            to="/fatwas?category=طلاق"
            className="text-[11px] font-bold text-[#A8793E] hover:underline"
          >
            تمام طلاق فتاویٰ ←
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
          {RELATED_TALAQ_FATWAS.map((tf) => (
            <Link
              key={tf.slug}
              to={`/fatwas/${tf.slug}`}
              className="p-2.5 rounded-xl border bg-white/70 hover:bg-white transition-all text-right group flex flex-col justify-between"
              style={{ borderColor: `${theme.secondaryBorder}40` }}
            >
              <span className="text-xs font-semibold text-[#2B2118] font-['Payami_Nastaleeq',serif] line-clamp-2 mb-1.5 leading-snug group-hover:text-[#A8793E]">
                {tf.title}
              </span>
              <span className="text-[10px] text-[#A8793E] font-medium flex items-center gap-1 self-start font-['Payami_Nastaleeq',serif]">
                <span>فتویٰ مطالعہ کریں</span>
                <ArrowLeft className="w-2.5 h-2.5" />
              </span>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}

TalaqSeriesNavigator.propTypes = {
  currentSlug: PropTypes.string,
  theme: PropTypes.object,
};
