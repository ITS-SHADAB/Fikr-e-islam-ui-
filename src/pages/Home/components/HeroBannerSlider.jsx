import React, { useState, useEffect, useCallback, useRef } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { BookOpen, HelpCircle, ChevronRight, ChevronLeft } from "lucide-react";

// Clean visual background banner images (without text/buttons)
import banner1 from "@/assets/images/hero-banner-1.webp";
import banner2 from "@/assets/images/hero-banner-2.webp";
import banner3 from "@/assets/images/hero-banner-3.webp";

/**
 * Static Hero Slides Data Structure
 * Designed for straightforward migration to dynamic API/backend data in the future.
 */
const HERO_SLIDES = [
  {
    id: 1,
    image: banner1,
    publicUrl: "/assets/images/hero-banner-1.webp",
    alt: "دینی رہنمائی، آسان رسائی میں",
    title: "دینی رہنمائی، آسان رسائی میں",
    description:
      "سوالات کے جوابات، دینی مسائل، مضامین، کتب اور بیانات ایک جگہ، ایک مقصد کے ساتھ",
    primaryBtn: {
      text: "دینی مسائل پڑھیں",
      to: "/fatwas",
    },
    secondaryBtn: {
      text: "سوال پوچھیں",
      to: "/ask",
    },
    theme: "light",
  },
  {
    id: 2,
    image: banner2,
    publicUrl: "/assets/images/hero-banner-2.webp",
    alt: "علم و آگہی ہر مسلمان کا حق",
    title: "علم و آگہی ہر مسلمان کا حق",
    description:
      "معتبر دینی معلومات، مستند ذرائع اور آسان انداز میں پیشکش",
    primaryBtn: {
      text: "مزید پڑھیں",
      to: "/articles",
    },
    secondaryBtn: {
      text: "سوال پوچھیں",
      to: "/ask",
    },
    theme: "dark",
  },
  {
    id: 3,
    image: banner3,
    publicUrl: "/assets/images/hero-banner-3.webp",
    alt: "آئیں دین کو سمجھیں، زندگی سنواریں",
    title: "آئیں دین کو سمجھیں، زندگی سنواریں",
    description:
      "قرآن و سنت کی روشنی میں صحیح رہنمائی اور بہتر طرزِ زندگی کی طرف قدم",
    primaryBtn: {
      text: "دینی مسائل پڑھیں",
      to: "/fatwas",
    },
    secondaryBtn: {
      text: "سوال پوچھیں",
      to: "/ask",
    },
    theme: "light",
  },
];

// Animation variants for smooth horizontal carousel sliding
const slideVariants = {
  enter: (direction) => ({
    x: direction > 0 ? "100%" : "-100%",
    opacity: 0.85,
  }),
  center: {
    zIndex: 1,
    x: 0,
    opacity: 1,
  },
  exit: (direction) => ({
    zIndex: 0,
    x: direction < 0 ? "100%" : "-100%",
    opacity: 0.85,
  }),
};

export default function HeroBannerSlider() {
  const [[currentIndex, direction], setPage] = useState([0, 0]);
  const [isHovered, setIsHovered] = useState(false);
  const timerRef = useRef(null);

  const total = HERO_SLIDES.length;

  const paginate = useCallback(
    (newDirection, targetIndex = null) => {
      setPage(([prevIndex]) => {
        if (targetIndex !== null) {
          return [targetIndex, targetIndex > prevIndex ? 1 : -1];
        }
        const nextIdx = (prevIndex + newDirection + total) % total;
        return [nextIdx, newDirection];
      });
    },
    [total]
  );

  // Preload all 3 images on mount to ensure immediate display
  useEffect(() => {
    HERO_SLIDES.forEach((slide) => {
      const img = new Image();
      img.src = slide.image;
    });
  }, []);

  // Autoplay timer: advances every 4.5 seconds (paused when user hovers)
  useEffect(() => {
    if (isHovered) return;

    timerRef.current = setInterval(() => {
      paginate(1);
    }, 4500);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [paginate, isHovered]);

  const currentSlide = HERO_SLIDES[currentIndex];
  const isDark = currentSlide.theme === "dark";

  return (
    <section
      className="w-full pt-2 sm:pt-3 pb-2 sm:pb-3 bg-background relative select-none"
      aria-label="ہیرو بینر سلائیڈر"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Full-width container: stretches across the entire available homepage width */}
      <div className="w-full px-2 sm:px-4 lg:px-6">
        {/*
          Hero Frame: Wide & Short Website Banner
          - Mobile height preserved exactly at 180px (verified perfect)
          - Laptop/desktop height reduced to a sleek 250px-295px banner
          - Full width with rounded corners & subtle gold border
        */}
        <div
          className="relative w-full rounded-2xl sm:rounded-3xl overflow-hidden border border-[#A8793E]/35 shadow-[0_6px_24px_rgba(43,33,24,0.10)] bg-[#2B2118] h-[180px] sm:h-[220px] md:h-[250px] lg:h-[275px] xl:h-[295px]"
        >
          {/* Framer Motion AnimatePresence for robust, individual slide transitions */}
          <AnimatePresence initial={false} custom={direction}>
            <motion.div
              key={currentIndex}
              custom={direction}
              variants={slideVariants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{
                x: { type: "tween", duration: 0.6, ease: [0.25, 1, 0.5, 1] },
                opacity: { duration: 0.35 },
              }}
              drag="x"
              dragConstraints={{ left: 0, right: 0 }}
              dragElastic={0.4}
              onDragEnd={(e, { offset }) => {
                if (offset.x < -40) {
                  paginate(1); // Swiped left -> next
                } else if (offset.x > 40) {
                  paginate(-1); // Swiped right -> prev
                }
              }}
              className="absolute inset-0 w-full h-full overflow-hidden cursor-grab active:cursor-grabbing"
              dir="rtl"
            >
              {/* Background image: fills 100% of the slide area without distortion */}
              <img
                src={currentSlide.image}
                alt={currentSlide.alt}
                className="absolute inset-0 w-full h-full object-cover object-left sm:object-center pointer-events-none select-none"
                onError={(e) => {
                  if (currentSlide.publicUrl && e.currentTarget.src !== currentSlide.publicUrl) {
                    e.currentTarget.src = currentSlide.publicUrl;
                  }
                }}
                loading="eager"
                draggable={false}
              />

              {/* Gradient readability scrim */}
              <div
                className={`absolute inset-0 pointer-events-none transition-opacity duration-300 ${
                  isDark
                    ? "bg-gradient-to-t from-[#140D08]/92 via-[#1A120B]/60 to-transparent sm:bg-gradient-to-l sm:from-[#140D08]/90 sm:via-[#1A120B]/55 sm:to-transparent"
                    : "bg-gradient-to-t from-[#F7F1E8]/94 via-[#F7F1E8]/68 to-transparent sm:bg-gradient-to-l sm:from-[#F7F1E8]/92 sm:via-[#F7F1E8]/60 sm:to-transparent"
                }`}
              />

              {/* HTML/React Content Overlay: Anchored firmly to the RIGHT side on all screen sizes */}
              <div
                className="absolute inset-y-0 right-0 z-10 flex items-center justify-start pr-4 sm:pr-8 md:pr-10 lg:pr-14 pl-4 sm:pl-8 w-full sm:max-w-md md:max-w-lg lg:max-w-xl"
                dir="rtl"
              >
                <div className="w-full text-right flex flex-col items-start gap-1 sm:gap-1.5 md:gap-2">

                  {/* Title */}
                  <h1
                    className={`text-base sm:text-2xl md:text-3xl lg:text-4xl font-extrabold leading-tight tracking-tight drop-shadow-xs ${
                      isDark ? "text-[#FDFBF7]" : "text-[#2A211A]"
                    }`}
                    style={{ fontFamily: "'Payami Nastaleeq', 'Noto Nastaliq Urdu', serif" }}
                  >
                    {currentSlide.title}
                  </h1>

                  {/* Description */}
                  <p
                    className={`text-[11px] sm:text-xs md:text-sm lg:text-base leading-relaxed font-medium line-clamp-2 sm:line-clamp-none ${
                      isDark ? "text-[#E6D7C8]" : "text-[#5A4231]"
                    }`}
                  >
                    {currentSlide.description}
                  </p>

                  {/* Action Buttons */}
                  <div className="flex items-center gap-2 sm:gap-3 pt-0.5 sm:pt-1">
                    {/* Primary Button */}
                    <Link
                      to={currentSlide.primaryBtn.to}
                      className={`px-3 sm:px-5 py-1 sm:py-1.5 rounded-full font-bold text-[11px] sm:text-xs md:text-sm flex items-center gap-1.5 sm:gap-2 shadow-xs transition-all duration-200 active:scale-95 ${
                        isDark
                          ? "bg-[#A8793E] hover:bg-[#B8894E] text-[#1A120B]"
                          : "bg-[#2B2118] hover:bg-[#3E2F22] text-[#F7F1E8]"
                      }`}
                    >
                      <BookOpen className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
                      <span>{currentSlide.primaryBtn.text}</span>
                    </Link>

                    {/* Secondary Button */}
                    <Link
                      to={currentSlide.secondaryBtn.to}
                      className={`px-3 sm:px-5 py-1 sm:py-1.5 rounded-full font-bold text-[11px] sm:text-xs md:text-sm flex items-center gap-1.5 sm:gap-2 transition-all duration-200 active:scale-95 ${
                        isDark
                          ? "bg-[#2B2118]/50 hover:bg-[#2B2118]/80 text-[#FDFBF7] border border-[#A8793E]/60"
                          : "bg-[#F7F1E8]/70 hover:bg-[#F7F1E8] text-[#2A211A] border border-[#A8793E]/60"
                      }`}
                    >
                      <HelpCircle className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-[#A8793E]" />
                      <span>{currentSlide.secondaryBtn.text}</span>
                    </Link>
                  </div>

                </div>
              </div>
            </motion.div>
          </AnimatePresence>

          {/* Desktop Navigation Arrows */}
          <button
            type="button"
            onClick={() => paginate(-1)}
            aria-label="پچھلی سلائیڈ"
            className="hidden sm:flex absolute left-3 top-1/2 -translate-y-1/2 z-30 w-8 h-8 rounded-full bg-[#2B2118]/50 hover:bg-[#2B2118]/80 text-[#F7F1E8] items-center justify-center border border-[#A8793E]/40 backdrop-blur-xs transition-all duration-200 opacity-60 hover:opacity-100 active:scale-95 cursor-pointer"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <button
            type="button"
            onClick={() => paginate(1)}
            aria-label="اگلی سلائیڈ"
            className="hidden sm:flex absolute right-3 top-1/2 -translate-y-1/2 z-30 w-8 h-8 rounded-full bg-[#2B2118]/50 hover:bg-[#2B2118]/80 text-[#F7F1E8] items-center justify-center border border-[#A8793E]/40 backdrop-blur-xs transition-all duration-200 opacity-60 hover:opacity-100 active:scale-95 cursor-pointer"
          >
            <ChevronRight className="w-4 h-4" />
          </button>

          {/* Pagination Indicators matching project's SeamlessMobileSlider style */}
          <div
            className="absolute bottom-2 sm:bottom-3 left-1/2 -translate-x-1/2 z-30 flex items-center justify-center gap-2"
            dir="ltr"
            role="tablist"
            aria-label="سلائیڈر نیویگیشن"
          >
            {HERO_SLIDES.map((slide, idx) => {
              const isActive = currentIndex === idx;
              return (
                <button
                  key={slide.id}
                  type="button"
                  onClick={() => paginate(idx > currentIndex ? 1 : -1, idx)}
                  className="rounded-full transition-all duration-300 cursor-pointer focus:outline-none focus:ring-1 focus:ring-[#A8793E]"
                  style={{
                    width: isActive ? "24px" : "8px",
                    height: "7px",
                    backgroundColor: isActive
                      ? "#A8793E"
                      : isDark
                      ? "rgba(255,255,255,0.45)"
                      : "rgba(43,33,24,0.3)",
                    opacity: isActive ? 1 : 0.65,
                  }}
                  aria-label={`سلائیڈ ${idx + 1}: ${slide.title}`}
                  aria-selected={isActive}
                  role="tab"
                />
              );
            })}
          </div>

        </div>
      </div>
    </section>
  );
}
