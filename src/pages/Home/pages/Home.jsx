import React, { useEffect, useState, useMemo } from "react";
import { Link } from "react-router-dom";
import {
  BookOpen,
  Book,
  FileText,
  HelpCircle,
  Calendar,
  Play,
  ArrowRight,
  ArrowLeft,
  Mail,
  Phone,
  MapPin,
  Users,
  ShieldCheck,
  ChevronDown,
  X,
  Music,
  Feather,
  Video,
  GraduationCap,
  BookMarked,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import {
  useArticlesList,
  useFatwasList,
  useQuestionsList,
  usePublicationsList,
  useLecturesList,
  useEventsList,
  useContentCounts,
} from "@/hooks/useContentCache";
import { useSettings } from "@/hooks/useSettings";
import { COLORS } from "@/utils/themeColors";
import { OFFICIAL_CONTACT, OFFICIAL_SOCIAL_LINKS, formatPhoneNumber, getTelLink } from "@/constants/contact";

import {
  ArticleCard,
  FatwaCard,
  LectureCard,
  PublicationCard,
  EventCard,
  QaCard,
  SectionLoader,
} from "@/components";
import SeamlessMobileSlider from "../components/SeamlessMobileSlider";
import { FATWA_TRANSLATIONS, LECTURE_TRANSLATIONS } from "@/utils/categories";
import AnimatedFeatureCard from "../components/AnimatedFeatureCard";
import HeroBannerSlider from "../components/HeroBannerSlider";

function SectionHeading({ title, linkTo, linkLabel }) {
  const { settings } = useSettings();
  const language =
    settings?.language === "ur" || settings?.language === "Urdu" ? "ur" : "en";
  const isRTL = language === "ur";

  return (
    <div className="flex items-center justify-between mb-2.5 sm:mb-3.5 border-b border-[#A8793E]/35 pb-1.5 sm:pb-2">
      <div
        className={`flex items-center ${isRTL ? "border-r-4 border-[#C8A46A] pr-3 sm:pr-4 text-right" : "border-l-4 border-[#C8A46A] pl-3 sm:pl-4 text-left"}`}
      >
        <h2
          className={`text-xl sm:text-2xl md:text-3xl font-extrabold text-primary leading-none pt-0.5 ${
            isRTL ? "font-['Payami_Nastaleeq',serif]" : ""
          }`}
        >
          {title}
        </h2>
      </div>
      {linkTo && (
        <Link
          to={linkTo}
          className={`text-xs sm:text-sm font-bold text-primary hover:text-accent flex items-center gap-1 transition-colors shrink-0 ${
            isRTL ? "font-['Payami_Nastaleeq',serif]" : ""
          }`}
        >
          <span>{linkLabel}</span>{" "}
          {language === "en" ? (
            <ArrowRight className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-[#A8793E]" />
          ) : (
            <ArrowLeft className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-[#A8793E]" />
          )}
        </Link>
      )}
    </div>
  );
}
// Statistics / Categories Quick Access Section (Compact & Proportional Islamic Cards)
function StatisticsSection({ stats }) {
  return (
    <section className="py-2.5 sm:py-3.5 bg-background border-b border-border relative select-none">
      <div className="w-full max-w-7xl mx-auto px-2 sm:px-6 lg:px-8">
        {/* Outer Warm Beige Islamic Panel Frame */}
        <div className="bg-[#F7F1E8] rounded-xl sm:rounded-2xl border border-[#A8793E]/40 p-2 sm:p-3 lg:p-4 shadow-[0_2px_8px_rgba(43,33,24,0.05)]">

          {/* 6 Cards Grid: 3 cards per line on mobile, 3 on tablet, 6 on desktop */}
          <div className="grid grid-cols-3 lg:grid-cols-6 gap-1.5 sm:gap-2.5 lg:gap-3 w-full">
            {stats.map((stat, index) => {
              const Icon = stat.icon;
              return (
                <Link
                  key={index}
                  to={stat.to}
                  aria-label={stat.ariaLabel || `${stat.label}${stat.value ? ` (${stat.value}+)` : ''}`}
                  className="relative bg-[#F7F1E8] rounded-lg sm:rounded-xl border border-[#A8793E]/30 py-2.5 px-1 sm:py-3.5 sm:px-2.5 min-h-[105px] sm:min-h-[125px] h-full flex flex-col items-center justify-center text-center shadow-[0_1px_4px_rgba(43,33,24,0.03)] hover:shadow-[0_4px_12px_rgba(43,33,24,0.09)] hover:border-[#A8793E] hover:-translate-y-0.5 active:translate-y-0 transition-all duration-200 group overflow-hidden cursor-pointer no-underline focus:outline-hidden focus-visible:ring-2 focus-visible:ring-[#A8793E] focus-visible:ring-offset-1 w-full"
                >
                  {/* Top-Left Subtle Islamic Lattice Accent */}
                  <svg
                    className="absolute top-0 left-0 w-6 h-6 sm:w-8 sm:h-8 text-[#A8793E] opacity-20 pointer-events-none select-none z-0"
                    viewBox="0 0 60 60"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="0.75"
                  >
                    <path d="M0 0 L60 0 C60 25 35 60 0 60 Z" fill="currentColor" fillOpacity="0.03" />
                    <path d="M0 15 C20 15 45 35 45 60" />
                    <path d="M0 30 C15 30 30 45 30 60" />
                    <line x1="15" y1="0" x2="60" y2="45" strokeWidth="0.5" strokeDasharray="1.5 1.5" />
                    <polygon points="25,12 28,15 25,18 22,15" strokeWidth="0.6" />
                  </svg>

                  {/* Dark Brown Circle Badge with Light Outer Ring */}
                  <div className="relative z-10 w-7 h-7 sm:w-8 sm:h-8 lg:w-8.5 lg:h-8.5 rounded-full bg-[#2B2118] text-[#F7F1E8] flex items-center justify-center ring-2 ring-[#F3E3D8] border border-[#A8793E]/60 shadow-[0_1px_3px_rgba(43,33,24,0.12)] mb-1 transition-transform duration-200 group-hover:scale-105 shrink-0">
                    <Icon className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-[#F7F1E8]" />
                  </div>

                  {/* Number Counter (+48, +35, etc.) */}
                  {stat.value !== undefined && stat.value !== null && stat.value !== "" && (
                    <div
                      className="relative z-10 flex items-center justify-center gap-0.5 font-sans font-bold text-[#2B2118] text-sm sm:text-base lg:text-lg leading-none my-0.5 select-none"
                      dir="ltr"
                    >
                      <span className="text-[#A8793E] font-bold text-xs sm:text-sm leading-none">+</span>
                      <span>{stat.value}</span>
                    </div>
                  )}

                  {/* Section Urdu Title */}
                  <p className="relative z-10 font-urdu text-[11px] min-[360px]:text-xs sm:text-sm lg:text-[14px] font-bold text-[#2A211A] leading-tight tracking-wide mb-1 transition-colors duration-200 group-hover:text-[#A8793E] max-w-full px-0.5">
                    {stat.label}
                  </p>

                  {/* Under-Card Flourish with 8-Petal Rosette */}
                  <div className="relative z-10 flex items-center justify-center gap-0.5 sm:gap-1 w-full select-none pointer-events-none opacity-75 mt-0.5">
                    <span className="h-[1px] w-2 sm:w-3.5 lg:w-4.5 bg-gradient-to-r from-transparent to-[#A8793E]/70" />
                    <svg
                      className="w-2 h-2 sm:w-2.5 sm:h-2.5 text-[#A8793E] shrink-0"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.5"
                    >
                      <circle cx="12" cy="12" r="2.5" fill="currentColor" />
                      <path d="M12 2 L12 22 M2 12 L22 12 M5 5 L19 19 M5 19 L19 5" strokeWidth="1" />
                      <circle cx="12" cy="12" r="7" strokeWidth="0.75" strokeDasharray="1 2" />
                    </svg>
                    <span className="h-[1px] w-2 sm:w-3.5 lg:w-4.5 bg-gradient-to-l from-transparent to-[#A8793E]/70" />
                  </div>

                </Link>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}

const HOMEPAGE_ITEM_LIMIT = { limit: 3 };

export default function Home() {
  const { settings } = useSettings();
  const { data: articlesData, loading: isLoadingArticles } = useArticlesList(HOMEPAGE_ITEM_LIMIT);
  const { data: fatwasData, loading: isLoadingFatwas } = useFatwasList(HOMEPAGE_ITEM_LIMIT);
  const { data: questionsData, loading: isLoadingQuestions } = useQuestionsList(HOMEPAGE_ITEM_LIMIT);
  const { data: publicationsData, loading: isLoadingPublications } = usePublicationsList(HOMEPAGE_ITEM_LIMIT);
  const { data: lecturesData, loading: isLoadingLectures } = useLecturesList(HOMEPAGE_ITEM_LIMIT);
  const { data: eventsData, loading: isLoadingEvents } = useEventsList(HOMEPAGE_ITEM_LIMIT);
  const { data: countsData, loading: isLoadingCounts } = useContentCounts();

  const articles = Array.isArray(articlesData?.articles) ? articlesData.articles : [];
  const fatwas = Array.isArray(fatwasData?.fatwas) ? fatwasData.fatwas : [];
  const questions = Array.isArray(questionsData?.questions) ? questionsData.questions : [];
  const publications = Array.isArray(publicationsData?.books) ? publicationsData.books : [];
  const lectures = Array.isArray(lecturesData)
    ? lecturesData
    : Array.isArray(lecturesData?.lectures)
      ? lecturesData.lectures
      : [];
  const rawEvents = Array.isArray(eventsData) ? eventsData : eventsData?.events || [];
  const events = useMemo(() => {
    const map = new Map();
    rawEvents.forEach((item) => {
      if (item && item._id) {
        map.set(item._id, item);
      }
    });
    return Array.from(map.values());
  }, [rawEvents]);

  const [activeMedia, setActiveMedia] = useState(null);

  const getEmbedUrl = (url) => {
    if (!url) return "";
    const regExp =
      /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|shorts\/|&v=)([^#&?]*).*/;
    const match = url.match(regExp);
    if (match && match[2].length === 11) {
      return `https://www.youtube.com/embed/${match[2]}?autoplay=1&rel=0`;
    }
    if (url.includes("facebook.com") || url.includes("fb.watch")) {
      return `https://www.facebook.com/plugins/video.php?href=${encodeURIComponent(url)}&show_text=0`;
    }
    return url;
  };

  const isAudioMedia = (cat) => {
    return cat === "Audio Lectures" || cat === "Bayan Recordings";
  };

  const handleLectureAction = (lecture) => {
    if (!lecture) return;
    const isAudio =
      isAudioMedia(lecture.category) &&
      !lecture.videoUrl?.includes("youtube") &&
      !lecture.videoUrl?.includes("youtu.be");

    if (isAudio) {
      setActiveMedia(lecture);
    } else {
      const ytRegExp =
        /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|shorts\/|&v=)([^#&?]*).*/;
      const match = lecture.videoUrl?.match(ytRegExp);
      const ytChannel =
        settings?.socialLinks?.youtube &&
        !settings.socialLinks.youtube.includes("fikr") &&
        settings.socialLinks.youtube.includes("faizansarwarmisbahi")
          ? settings.socialLinks.youtube
          : OFFICIAL_SOCIAL_LINKS.youtube;

      const targetUrl =
        match && match[2].length === 11
          ? `https://www.youtube.com/watch?v=${match[2]}`
          : lecture.videoUrl || ytChannel;
      window.open(targetUrl, "_blank", "noopener,noreferrer");
    }
  };

  const language =
    settings?.language === "ur" || settings?.language === "Urdu" ? "ur" : "en";

  const counts = countsData?.data || countsData || {};
  const getCountValue = (key, fallbackKey) => {
    if (counts && counts[key] !== undefined && counts[key] !== null) return counts[key];
    if (fallbackKey && counts && counts[fallbackKey] !== undefined && counts[fallbackKey] !== null) return counts[fallbackKey];
    if (key === "questions") {
      const qTotal = questionsData?.totalQuestions ?? questionsData?.total ?? (Array.isArray(questionsData?.questions) ? questionsData.questions.length : null);
      if (qTotal !== null && qTotal !== undefined) return qTotal;
    }
    if (key === "events") {
      const eTotal = Array.isArray(eventsData) ? eventsData.length : (eventsData?.events?.length ?? eventsData?.total ?? null);
      if (eTotal !== null && eTotal !== undefined) return eTotal;
    }
    if (isLoadingCounts) return "...";
    return null;
  };

  const stats = [
    {
      value: getCountValue("fatwas"),
      label: language === "en" ? "Fatwas" : "فتاویٰ",
      icon: Feather,
      to: "/fatwas",
      ariaLabel: language === "en" ? "View all Fatwas" : "شرعی فتاویٰ",
    },
    {
      value: getCountValue("articles"),
      label: language === "en" ? "Articles" : "مقالات",
      icon: Users,
      to: "/articles",
      ariaLabel: language === "en" ? "View all Articles" : "علمی مقالات",
    },
    {
      value: getCountValue("books", "publications"),
      label: language === "en" ? "Publications" : "مطبوعات",
      icon: BookOpen,
      to: "/publications",
      ariaLabel: language === "en" ? "View all Publications" : "کتب و مطبوعات",
    },
    {
      value: getCountValue("lectures"),
      label: language === "en" ? "Lectures" : "بیانات",
      icon: Video,
      to: "/lectures",
      ariaLabel: language === "en" ? "View all Lectures" : "آڈیو و ویڈیو بیانات",
    },
    {
      value: getCountValue("questions"),
      label: language === "en" ? "Q&A" : "سوال و جواب",
      icon: HelpCircle,
      to: "/qa",
      ariaLabel: language === "en" ? "View all Questions and Answers" : "سوالات و جوابات",
    },
    {
      value: getCountValue("events"),
      label: language === "en" ? "Events" : "پروگرام",
      icon: Calendar,
      to: "/events",
      ariaLabel: language === "en" ? "View all Events and Programs" : "پروگرام اور اجتماعات",
    },
  ];

  const heroName = settings?.scholarInfo?.fullName || settings?.homepageSettings?.heroName || "";
  const address =
    settings?.contactInfo?.address &&
    !settings.contactInfo.address.includes("123 Islamic Center") &&
    !settings.contactInfo.address.includes("100 مینار روڈ")
      ? settings.contactInfo.address
      : OFFICIAL_CONTACT.address;
  const phone =
    settings?.contactInfo?.phone &&
    !settings.contactInfo.phone.includes("555") &&
    !settings.contactInfo.phone.includes("9876543210")
      ? settings.contactInfo.phone
      : OFFICIAL_CONTACT.phone;
  const email =
    settings?.contactInfo?.email &&
    !settings.contactInfo.email.includes("example.com") &&
    !settings.contactInfo.email.includes("fikr") &&
    !settings.contactInfo.email.includes("scholar@")
      ? settings.contactInfo.email
      : OFFICIAL_CONTACT.email;

  const FEATURES = [
    {
      icon: GraduationCap,
      title: language === "en" ? "Articles" : "علمی مقالات",
      description:
        language === "en"
          ? "Research-based Islamic articles covering Quran, Hadith, Fiqh, beliefs, contemporary issues, and educational topics."
          : "قرآن، حدیث، فقہ، عقائد، عصری مسائل اور اسلامی تعلیمات پر مبنی تحقیقی و مستند مقالات۔",
      to: "/articles",
    },
    {
      icon: ShieldCheck,
      title: language === "en" ? "Fiqh & Fatwas" : "فقہ و فتاویٰ",
      description:
        language === "en"
          ? "Authentic Islamic rulings and jurisprudential guidance based on the Quran, Sunnah, and reliable scholarship."
          : "قرآن، سنت اور معتبر فقہی مصادر کی روشنی میں مستند فقہی رہنمائی اور فتاویٰ۔",
      to: "/fatwas",
    },
    {
      icon: BookMarked,
      title: language === "en" ? "Publications" : "کتب و مطبوعات",
      description:
        language === "en"
          ? "Read and download scholarly books and publications on various educational and Islamic topics."
          : "مفتی صاحب اور اکابرین کی مختلف علمی، اصلاحی اور تحقیقی کتب کا مطالعہ اور ڈاؤن لوڈ۔",
      to: "/publications",
    },
    {
      icon: HelpCircle,
      title: language === "en" ? "Questions & Answers" : "سوال و جواب",
      description:
        language === "en"
          ? "Find answers to frequently asked Islamic questions and benefit from authentic guidance."
          : "عوامی دینی و فقہی سوالات کے مدلل و مستند جوابات اور آن لائن شرعی استفسار کی سہولت۔",
      to: "/qa",
    },
    {
      icon: Video,
      title: language === "en" ? "Lectures & Sermons" : "آڈیو و ویڈیو بیانات",
      description:
        language === "en"
          ? "Listen to inspiring lectures, Friday sermons, and discourses on spiritual, moral, and social guidance."
          : "اصلاحِ باطن، اخلاق و معاملات اور معارفِ شریعت پر مشتمل فکر انگیز صوتی و بصری خطبات۔",
      to: "/lectures",
    },
    {
      icon: Calendar,
      title: language === "en" ? "Events & Programs" : "پروگرام اور اجتماعات",
      description:
        language === "en"
          ? "Stay informed about upcoming conferences, educational seminars, and religious gatherings."
          : "جامعہ اور ادارے کے زیر اہتمام منعقد ہونے والے اہم سیمینارز، علمی دروس اور دینی اجتماعات۔",
      to: "/events",
    },
  ];

  return (
    <div className="bg-background min-h-screen relative">
      {/* 1. HERO BANNER CAROUSEL */}
      <HeroBannerSlider />

      {/* Stats Section */}
      <StatisticsSection stats={stats} />

      {/* FEATURE CARDS SECTION */}
      <section className="pt-2.5 sm:pt-4 md:pt-5 pb-4 sm:pb-5.5 md:pb-7 mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Heading & Subtitle: Introduction for service cards */}
        <div className="text-center mb-2.5 sm:mb-3.5 md:mb-4 flex flex-col items-center">
          <div className="inline-flex items-center justify-center gap-3 mb-2.5">
            <span className="h-px w-10 sm:w-16 bg-gradient-to-r from-transparent via-[#C5A880] to-[#C5A880]/40" />
            <span className="w-2 h-2 rotate-45 border border-[#C5A880] bg-[#FAF6F0]" />
            <h2 className="text-2xl sm:text-3xl lg:text-3.5xl font-bold text-primary px-2">
              {language === "en" ? "Our Services" : "ہماری خدمات"}
            </h2>
            <span className="w-2 h-2 rotate-45 border border-[#C5A880] bg-[#FAF6F0]" />
            <span className="h-px w-10 sm:w-16 bg-gradient-to-l from-transparent via-[#C5A880] to-[#C5A880]/40" />
          </div>
          <p className="text-sm sm:text-base text-textSecondary font-normal leading-relaxed max-w-xl mx-auto">
            {language === "en"
              ? "Gain knowledge, ask questions, and receive authentic guidance"
              : "علم حاصل کریں، سوال پوچھیں اور مستند رہنمائی حاصل کریں"}
          </p>
        </div>

        {/* Desktop View: Grid (3 columns x 2 rows for 6 cards) */}
        <div className="hidden sm:grid sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-7">
          {FEATURES.map((feature, idx) => (
            <div key={feature.title}>
              <AnimatedFeatureCard
                icon={feature.icon}
                title={feature.title}
                description={feature.description}
                to={feature.to}
                index={idx}
              />
            </div>
          ))}
        </div>

        {/* Mobile View: Slide One-by-One with Seamless infinite loop & scale transition */}
        <SeamlessMobileSlider
          items={FEATURES}
          language={language}
          enableScale={true}
          duration={700}
          activeDotColor={COLORS.primary}
          dotColor={COLORS.border}
          renderCard={(feature, idx) => (
            <AnimatedFeatureCard
              icon={feature.icon}
              title={feature.title}
              description={feature.description}
              to={feature.to}
              index={idx}
            />
          )}
        />
      </section>

      {/* 2. LATEST ARTICLES */}
      <section className="py-3 sm:py-4.5 md:py-6 mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeading
          title={language === "en" ? "Latest Articles" : "تازہ ترین مقالات"}
          linkTo="/articles"
          linkLabel={language === "en" ? "All Articles" : "تمام مقالات"}
        />

        {isLoadingArticles ? (
          <SectionLoader type="article" count={3} />
        ) : articles && articles.length > 0 ? (
          <>
            {/* Desktop: grid */}
            <div className="hidden sm:grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {articles.slice(0, 3).map((article) => (
                <div key={article._id}>
                  <ArticleCard article={article} />
                </div>
              ))}
            </div>

            {/* Mobile: one-by-one slider with Seamless infinite swipe */}
            <SeamlessMobileSlider
              items={articles.slice(0, 3)}
              language={language}
              duration={500}
              activeDotColor={COLORS.primary}
              dotColor={COLORS.border}
              renderCard={(article) => <ArticleCard article={article} />}
            />
          </>
        ) : (
          <p className="text-slate-400 text-center py-6">
            {language === "en"
              ? "No articles available."
              : "کوئی مضمون دستیاب نہیں ہے۔"}
          </p>
        )}
      </section>

      {/* 3. FEATURED FATWAS */}
      <section className="bg-background border-y border-border py-3 sm:py-4.5 md:py-6">
        <div className="mx-auto px-4 sm:px-6 lg:px-8">
          <SectionHeading
            title={language === "en" ? "Featured Fatwas" : "منتخب فتاویٰ"}
            linkTo="/fatwas"
            linkLabel={language === "en" ? "All Rulings" : "تمام احکام"}
          />

          {isLoadingFatwas ? (
            <SectionLoader type="fatwa" count={3} />
          ) : fatwas && fatwas.length > 0 ? (
            <>
              {/* Desktop: grid */}
              <div className="hidden sm:grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {fatwas.slice(0, 3).map((fatwa) => (
                  <div key={fatwa._id}>
                    <FatwaCard fatwa={fatwa} />
                  </div>
                ))}
              </div>

              {/* Mobile: one-by-one slider with Seamless infinite swipe */}
              <SeamlessMobileSlider
                items={fatwas.slice(0, 3)}
                language={language}
                duration={500}
                activeDotColor={COLORS.primary}
                dotColor={COLORS.border}
                renderCard={(fatwa) => <FatwaCard fatwa={fatwa} />}
              />
            </>
          ) : (
            <p className="text-slate-400 text-center py-6">
              {language === "en"
                ? "No fatwas available."
                : "کوئی فتویٰ دستیاب نہیں ہے۔"}
            </p>
          )}
        </div>
      </section>

      {/* 4. RECENT Q&A */}
      <section className="py-3 sm:py-4.5 md:py-6 mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeading
          title={language === "en" ? "Recent Q&A" : "حالیہ سوال و جواب"}
          linkTo="/qa"
          linkLabel={language === "en" ? "All Questions" : "تمام سوالات"}
        />

        {isLoadingQuestions ? (
          <SectionLoader type="qa" count={3} />
        ) : questions && questions.length > 0 ? (
          <>
            {/* Desktop: grid */}
            <div className="hidden sm:grid sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5 md:gap-6">
              {questions.slice(0, 3).map((q) => (
                <QaCard key={q._id} question={q} />
              ))}
            </div>

            {/* Mobile: one-by-one slider with Seamless infinite swipe */}
            <SeamlessMobileSlider
              items={questions.slice(0, 3)}
              language={language}
              duration={500}
              activeDotColor={COLORS.primary}
              dotColor={COLORS.border}
              renderCard={(q) => <QaCard question={q} />}
            />
          </>
        ) : (
          <p className="text-slate-400 text-center py-6">
            {language === "en"
              ? "No answered questions available."
              : "کوئی جواب شدہ سوال دستیاب نہیں ہے۔"}
          </p>
        )}
      </section>

      {/* 5. LATEST PUBLICATIONS */}
      <section className="py-3 sm:py-4.5 md:py-6 bg-white border-t border-border">
        <div className="mx-auto px-4 sm:px-6 lg:px-8">
          <SectionHeading
            title={
              language === "en" ? "Latest Publications" : "تازہ ترین مطبوعات"
            }
            linkTo="/publications"
            linkLabel={language === "en" ? "View All" : "سب دیکھیں"}
          />

          {isLoadingPublications ? (
            <SectionLoader type="publication" count={3} layout="list" />
          ) : publications && publications.length > 0 ? (
            <>
              {/* Desktop: Show all 3 publication cards in one list */}
              <div className="hidden sm:flex sm:flex-col sm:gap-6">
                {publications.slice(0, 3).map((pub) => (
                  <div key={pub._id}>
                    <PublicationCard publication={pub} />
                  </div>
                ))}
              </div>

              {/* Mobile: One-by-one Seamless infinite slider */}
              <SeamlessMobileSlider
                items={publications.slice(0, 3)}
                language={language}
                duration={500}
                activeDotColor={COLORS.primary}
                dotColor={COLORS.border}
                renderCard={(pub) => <PublicationCard publication={pub} />}
              />
            </>
          ) : (
            <p className="text-slate-400 text-center py-6">
              {language === "en"
                ? "No publications available."
                : "کوئی مطبوعہ دستیاب نہیں ہے۔"}
            </p>
          )}
        </div>
      </section>

      {/* 6. LATEST LECTURES */}
      <section className="py-3 sm:py-4.5 md:py-6 bg-background border-t border-border">
        <div className="mx-auto px-4 sm:px-6 lg:px-8">
          <SectionHeading
            title={language === "en" ? "Latest Lectures" : "تازہ ترین بیانات"}
            linkTo="/lectures"
            linkLabel={language === "en" ? "View All" : "سب دیکھیں"}
          />

          {isLoadingLectures ? (
            <SectionLoader type="lecture" count={3} />
          ) : lectures && lectures.length > 0 ? (
            <>
              {/* Desktop: grid */}
              <div className="hidden sm:grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {lectures.slice(0, 3).map((lecture) => (
                  <div key={lecture._id}>
                    <LectureCard
                      lecture={lecture}
                      onPlay={handleLectureAction}
                    />
                  </div>
                ))}
              </div>

              {/* Mobile: one-by-one Seamless infinite slider */}
              <div className="block sm:hidden">
                <SeamlessMobileSlider
                  items={lectures.slice(0, 3)}
                  language={language}
                  duration={500}
                  activeDotColor={COLORS.primary}
                  dotColor={COLORS.border}
                  renderCard={(lec) => (
                    <LectureCard
                      lecture={lec}
                      onPlay={handleLectureAction}
                    />
                  )}
                />
              </div>
            </>
          ) : (
            <p className="text-slate-400 text-center py-6">
              {language === "en"
                ? "No bayans available."
                : "کوئی بیان دستیاب نہیں ہے۔"}
            </p>
          )}
        </div>
      </section>

      {/* 7. EVENTS & CONTACT INFO (SPLIT) */}
      <section
        className="py-3 sm:py-4.5 md:py-6 mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 lg:grid-cols-12 gap-5 lg:gap-7"
        dir={language === "ur" ? "rtl" : "ltr"}
      >
        {/* Upcoming Programs */}
        <div className="lg:col-span-8">
          <div
            className={`flex items-end justify-between mb-2.5 sm:mb-4 border-b border-border pb-1.5 sm:pb-2 ${language === "ur" ? "text-right" : "text-left"}`}
          >
            <h2 className="text-xl font-bold text-primary flex items-center gap-2">
              <Calendar className="w-5.5 h-5.5 text-accent" />
              {language === "en"
                ? "Upcoming Programs & Gatherings"
                : "آنے والے پروگرام اور اجتماعات"}
            </h2>
            <Link
              to="/events"
              className="text-xs font-bold text-primary hover:text-accent transition-colors"
            >
              {language === "en" ? "View All" : "سب دیکھیں"}
            </Link>
          </div>

          {isLoadingEvents ? (
            <SectionLoader type="event" count={3} layout="list" />
          ) : events && events.length > 0 ? (
            <>
              {/* Desktop: stacked list */}
              <div className="hidden sm:block space-y-4">
                {events.slice(0, 3).map((event) => (
                  <div key={event._id}>
                    <EventCard event={event} />
                  </div>
                ))}
              </div>

              {/* Mobile: one-by-one Seamless infinite slider */}
              <div className="block sm:hidden">
                <SeamlessMobileSlider
                  items={events.slice(0, 3)}
                  language={language}
                  duration={500}
                  activeDotColor={COLORS.primary}
                  dotColor={COLORS.border}
                  renderCard={(event) => <EventCard event={event} />}
                />
              </div>
            </>
          ) : (
            <p className="text-slate-400 text-center py-6">
              {language === "en"
                ? "No scheduled programs."
                : "کوئی طے شدہ پروگرام نہیں ہے۔"}
            </p>
          )}
        </div>

        {/* Contact info card */}
        <div
          className={`lg:col-span-4 ${language === "ur" ? "text-right" : "text-left"}`}
        >
          <h2 className="text-xl font-bold text-primary mb-2.5 sm:mb-4 border-b border-border pb-1.5 sm:pb-2">
            {language === "en" ? "Contact Details" : "مفتی صاحب سے رابطہ کریں"}
          </h2>

          <div className="premium-card p-6 space-y-6 bg-white relative overflow-hidden group">
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-accent via-primary to-accent" />

            <p className="text-slate-700 text-xs leading-relaxed font-light">
              {language === "en"
                ? `For meetings, invitations, or inquiries, feel free to contact ${heroName ? `${heroName}'s` : "our"} office.`
                : `ملاقات، دعوت ناموں یا سوالات کے لیے بلا جھجھک ${heroName ? `${heroName} کے` : "ہمارے"} دفتر سے رابطہ کریں۔`}
            </p>

            <ul className="space-y-4.5 text-sm">
              <li className="flex gap-3 items-start justify-start">
                <MapPin className="w-5 h-5 text-accent shrink-0 mt-0.5" />
                <span className="text-slate-700 leading-tight font-light">
                  {address}
                </span>
              </li>
              <li className="flex gap-3 items-center justify-start">
                <Phone className="w-5 h-5 text-accent shrink-0" />
                <a
                  href={getTelLink(phone)}
                  dir="ltr"
                  style={{ direction: 'ltr', unicodeBidi: 'isolate' }}
                  className="text-slate-700 hover:text-accent leading-tight font-light dir-ltr transition-colors font-sans inline-block"
                >
                  <bdi dir="ltr">{formatPhoneNumber(phone)}</bdi>
                </a>
              </li>
              <li className="flex gap-3 items-center justify-start">
                <Mail className="w-5 h-5 text-accent shrink-0" />
                <a
                  href={`mailto:${email}`}
                  className="text-slate-700 hover:text-accent leading-tight font-light truncate transition-colors"
                >
                  {email}
                </a>
              </li>
            </ul>

            <div>
              <Link
                to="/contact"
                className="w-full flex items-center justify-center gap-1.5 px-4 py-2.5 bg-primary hover:bg-primary/90 text-white text-xs font-bold rounded transition-colors relative overflow-hidden group font-serif"
              >
                {language === "en" ? "Send Message" : "پیغام بھیجیں"}
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Embedded Player Media Modal */}
      {activeMedia && isAudioMedia(activeMedia.category) && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-xs animate-fade-in"
          onClick={() => setActiveMedia(null)}
          dir={language === "ur" ? "rtl" : "ltr"}
        >
          <div
            className="rounded-3xl border-2 shadow-2xl overflow-hidden w-full max-w-4xl relative flex flex-col"
            style={{
              backgroundColor: COLORS.white,
              borderColor: COLORS.accent,
            }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div
              className="px-5 py-4 flex items-center justify-between border-b"
              style={{
                backgroundColor: COLORS.primary,
                borderColor: `${COLORS.accent}40`,
              }}
            >
              <div className="flex items-center gap-2.5 overflow-hidden pe-3">
                <span
                  className="text-[10px] font-bold px-2.5 py-1 rounded-full uppercase tracking-wider shrink-0"
                  style={{
                    backgroundColor: COLORS.accent,
                    color: COLORS.white,
                  }}
                >
                  {LECTURE_TRANSLATIONS[activeMedia.category] ||
                    activeMedia.category}
                </span>
                <h3 className="font-bold text-sm sm:text-base font-serif text-white truncate">
                  {activeMedia.title}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setActiveMedia(null)}
                className="p-1.5 rounded-full text-white/80 hover:text-white hover:bg-white/10 cursor-pointer shrink-0 transition-colors"
                aria-label="Close modal"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Media Player Viewport */}
            <div className="relative aspect-video w-full bg-black flex items-center justify-center">
              {isAudioMedia(activeMedia.category) ? (
                <div className="flex flex-col items-center justify-center gap-4 p-8 w-full bg-gradient-to-b from-slate-900 to-slate-950 text-center">
                  <div
                    className="w-16 h-16 rounded-full flex items-center justify-center border-2 border-accent shadow-2xl animate-pulse"
                    style={{
                      backgroundColor: COLORS.primary,
                      color: COLORS.accent,
                    }}
                  >
                    <Music className="w-8 h-8" />
                  </div>
                  <div className="space-y-1 text-center max-w-md">
                    <span
                      className="text-xs font-bold uppercase tracking-wider block font-serif"
                      style={{ color: COLORS.accent }}
                    >
                      {language === "en"
                        ? "Audio lecture is playing"
                        : "آڈیو بیان چل رہا ہے"}
                    </span>
                    <span className="text-slate-200 font-light text-sm line-clamp-1 font-serif">
                      {activeMedia.title}
                    </span>
                  </div>
                  <audio
                    src={activeMedia.videoUrl || activeMedia.url || activeMedia.audioUrl}
                    controls
                    autoPlay
                    className="w-full max-w-md mt-2 rounded-xl"
                  />
                </div>
              ) : activeMedia.videoUrl &&
                (activeMedia.videoUrl.includes("youtube.com") ||
                  activeMedia.videoUrl.includes("youtu.be") ||
                  activeMedia.videoUrl.includes("facebook.com") ||
                  activeMedia.videoUrl.includes("fb.watch")) ? (
                <iframe
                  title={activeMedia.title}
                  src={getEmbedUrl(activeMedia.videoUrl || activeMedia.url)}
                  className="w-full h-full border-none"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
              ) : (
                <div className="w-full h-full flex flex-col items-center justify-center p-6 text-center bg-slate-900 text-white gap-4">
                  <Play className="w-12 h-12 text-accent" />
                  <p className="text-sm text-slate-300 max-w-sm font-light font-serif">
                    {language === "en"
                      ? `This video link is located on an external platform (${activeMedia.category}).`
                      : `یہ ویڈیو لنک بیرونی پلیٹ فارم (${LECTURE_TRANSLATIONS[activeMedia.category] || activeMedia.category}) پر موجود ہے۔`}
                  </p>
                  <a
                    href={activeMedia.videoUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-5 py-2.5 text-white font-bold text-xs rounded-xl hover:opacity-90 transition-all uppercase tracking-wider font-serif shadow-sm"
                    style={{ backgroundColor: COLORS.primary }}
                  >
                    {language === "en"
                      ? "Open on External Platform"
                      : "بیرونی پلیٹ فارم پر کھولیں"}
                  </a>
                </div>
              )}
            </div>

            {/* Modal Footer Description */}
            {activeMedia.description && (
              <div className="p-4 sm:p-5 bg-slate-50 border-t border-slate-100 max-h-32 overflow-y-auto">
                <span className="block text-[10px] font-bold text-slate-500 uppercase mb-1 font-serif">
                  {language === "en" ? "Description" : "تفصیل"}
                </span>
                <p className="text-slate-700 text-xs font-light leading-relaxed font-serif">
                  {activeMedia.description}
                </p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
