import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { useAuthModal } from '@/context/AuthModalContext';
import {
  BookOpen,
  BookMarked,
  GraduationCap,
  FileText,
  Mail,
  Megaphone,
  Lock,
  ShieldCheck,
  Copyright,
  ChevronLeft,
  ChevronRight,
  X,
  Youtube,
  Facebook,
  Phone,
  MapPin,
  LogIn,
  User,
  HelpCircle,
  Radio
} from 'lucide-react';
import { FaWhatsapp, FaTelegramPlane } from 'react-icons/fa';
import { useSettings } from '@/hooks/useSettings';
import {
  OFFICIAL_CONTACT,
  OFFICIAL_SOCIAL_LINKS,
  formatPhoneNumber,
  getTelLink
} from '@/constants/contact';
import logoImg from '@/assets/images/logo.jpeg';
import logoWebp from '@/assets/images/logo.webp';

/**
 * Symmetrical Islamic Arabesque Knot/Flourish Ornament Component
 */
function IslamicArabesqueFlourish({ className = "w-28 sm:w-32 h-4 my-0.5 text-[#C99A5A]" }) {
  return (
    <svg
      viewBox="0 0 160 28"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={`${className} shrink-0 select-none mx-auto`}
      aria-hidden="true"
    >
      <defs>
        <linearGradient id="goldOrnamentGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#DFC8A4" />
          <stop offset="50%" stopColor="#C99A5A" />
          <stop offset="100%" stopColor="#8F632D" />
        </linearGradient>
      </defs>
      {/* Left side flourish */}
      <path
        d="M 72 14 C 60 14, 55 6, 44 6 C 36 6, 32 11, 24 11 C 18 11, 14 8, 4 8"
        stroke="url(#goldOrnamentGrad)"
        strokeWidth="1.2"
        strokeLinecap="round"
      />
      <path
        d="M 68 14 C 58 14, 52 20, 42 20 C 35 20, 30 15, 20 15 C 15 15, 10 18, 2 18"
        stroke="url(#goldOrnamentGrad)"
        strokeWidth="1"
        strokeLinecap="round"
        strokeOpacity="0.75"
      />
      <circle cx="44" cy="6" r="1.8" fill="url(#goldOrnamentGrad)" />
      <circle cx="24" cy="11" r="1.4" fill="url(#goldOrnamentGrad)" />

      {/* Center 8-petal Islamic Diamond Knot */}
      <g transform="translate(80, 14)">
        <rect x="-4.5" y="-4.5" width="9" height="9" transform="rotate(45)" fill="url(#goldOrnamentGrad)" />
        <rect x="-3" y="-3" width="6" height="6" transform="rotate(45)" fill="#21170F" />
        <circle cx="0" cy="0" r="1.5" fill="url(#goldOrnamentGrad)" />
        <circle cx="0" cy="-8" r="1.2" fill="url(#goldOrnamentGrad)" />
        <circle cx="0" cy="8" r="1.2" fill="url(#goldOrnamentGrad)" />
      </g>

      {/* Right side flourish (symmetrical mirror) */}
      <path
        d="M 88 14 C 100 14, 105 6, 116 6 C 124 6, 128 11, 136 11 C 142 11, 146 8, 156 8"
        stroke="url(#goldOrnamentGrad)"
        strokeWidth="1.2"
        strokeLinecap="round"
      />
      <path
        d="M 92 14 C 102 14, 108 20, 118 20 C 125 20, 130 15, 140 15 C 145 15, 150 18, 158 18"
        stroke="url(#goldOrnamentGrad)"
        strokeWidth="1"
        strokeLinecap="round"
        strokeOpacity="0.75"
      />
      <circle cx="116" cy="6" r="1.8" fill="url(#goldOrnamentGrad)" />
      <circle cx="136" cy="11" r="1.4" fill="url(#goldOrnamentGrad)" />
    </svg>
  );
}

/**
 * Section Pill Header Divider
 * ─── ❖ [ Title ] ❖ ───
 */
function SectionPillDivider({ title }) {
  return (
    <div className="flex items-center justify-center gap-1.5 sm:gap-2.5 my-2 sm:my-2.5 select-none" aria-hidden="true">
      <span className="h-[1px] flex-1 max-w-[30px] xs:max-w-[45px] sm:max-w-[70px] bg-gradient-to-r from-transparent via-[#A8793E]/40 to-[#A8793E]" />
      <span className="text-[#C99A5A] text-[9px] font-serif leading-none select-none">❖</span>
      
      <div className="bg-[#21170F]/90 border border-[#A8793E]/70 rounded-full px-3.5 sm:px-4 py-0.5 shadow-xs shadow-black/40">
        <span className="font-urdu text-[11px] sm:text-xs font-medium text-[#F7F1E8] tracking-wide block">
          {title}
        </span>
      </div>

      <span className="text-[#C99A5A] text-[9px] font-serif leading-none select-none">❖</span>
      <span className="h-[1px] flex-1 max-w-[30px] xs:max-w-[45px] sm:max-w-[70px] bg-gradient-to-l from-transparent via-[#A8793E]/40 to-[#A8793E]" />
    </div>
  );
}

export default function Footer() {
  const { settings } = useSettings();
  const language = settings?.language === 'ur' || settings?.language === 'Urdu' ? 'ur' : 'en';
  const isRTL = language === 'ur';

  const scholarName = settings?.scholarInfo?.fullName || '';
  const scholarTitle = settings?.scholarInfo?.title || '';

  const { openLogin } = useAuthModal();
  const { isAuthenticated } = useSelector((s) => s.auth);

  // Legal & Policy modal state
  const [activePolicy, setActivePolicy] = useState(null);

  // Keyboard accessibility and body scroll lock for Policy modal
  useEffect(() => {
    if (activePolicy) {
      document.body.style.overflow = 'hidden';
      const handleKeyDown = (e) => {
        if (e.key === 'Escape') setActivePolicy(null);
      };
      window.addEventListener('keydown', handleKeyDown);
      return () => {
        document.body.style.overflow = '';
        window.removeEventListener('keydown', handleKeyDown);
      };
    }
  }, [activePolicy]);

  // Contact details resolution (strictly preserving previous logic)
  const address =
    settings?.contactInfo?.address &&
    !settings.contactInfo.address.includes('123 Islamic Center') &&
    !settings.contactInfo.address.includes('100 مینار روڈ')
      ? settings.contactInfo.address
      : OFFICIAL_CONTACT.address;

  const phone =
    settings?.contactInfo?.phone &&
    !settings.contactInfo.phone.includes('555') &&
    !settings.contactInfo.phone.includes('9876543210')
      ? settings.contactInfo.phone
      : OFFICIAL_CONTACT.phone;

  const whatsapp =
    settings?.contactInfo?.whatsapp &&
    !settings.contactInfo.whatsapp.includes('555') &&
    !settings.contactInfo.whatsapp.includes('9876543210') &&
    settings.contactInfo.whatsapp.includes('channel')
      ? settings.contactInfo.whatsapp
      : OFFICIAL_SOCIAL_LINKS.whatsapp;

  const email =
    settings?.contactInfo?.email &&
    !settings.contactInfo.email.includes('example.com') &&
    !settings.contactInfo.email.includes('fikr') &&
    !settings.contactInfo.email.includes('scholar@')
      ? settings.contactInfo.email
      : OFFICIAL_CONTACT.email;

  // Social links resolution (strictly preserving previous URLs)
  const socialLinks = {
    facebook:
      settings?.socialLinks?.facebook &&
      !settings.socialLinks.facebook.includes('scholardemo') &&
      !settings.socialLinks.facebook.includes('fikr') &&
      settings.socialLinks.facebook.includes('share/1JcsQwS4h5')
        ? settings.socialLinks.facebook
        : OFFICIAL_SOCIAL_LINKS.facebook,

    youtube:
      settings?.socialLinks?.youtube &&
      !settings.socialLinks.youtube.includes('scholardemo') &&
      !settings.socialLinks.youtube.includes('fikr') &&
      settings.socialLinks.youtube.includes('faizansarwarmisbahi')
        ? settings.socialLinks.youtube
        : OFFICIAL_SOCIAL_LINKS.youtube,

    whatsapp:
      settings?.socialLinks?.whatsapp &&
      !settings.socialLinks.whatsapp.includes('555') &&
      !settings.socialLinks.whatsapp.includes('9876543210') &&
      settings.socialLinks.whatsapp.includes('channel')
        ? settings.socialLinks.whatsapp
        : OFFICIAL_SOCIAL_LINKS.whatsapp,

    telegram:
      settings?.socialLinks?.telegram &&
      !settings.socialLinks.telegram.includes('scholardemo') &&
      !settings.socialLinks.telegram.includes('fikr') &&
      settings.socialLinks.telegram.includes('faizansarwarmisbahi')
        ? settings.socialLinks.telegram
        : OFFICIAL_SOCIAL_LINKS.telegram,
  };

  // 1. All Previous Links + Additional Pages (Total 8, perfectly 2x4 on mobile, 4x2 on desktop)
  const importantLinks = [
    {
      to: '/articles',
      labelUr: 'علمی مضامین',
      labelEn: 'Articles',
      icon: GraduationCap,
    },
    {
      to: '/about',
      labelUr: 'ہمارے بارے میں',
      labelEn: 'About Us',
      icon: BookOpen,
    },
    {
      to: '/publications',
      labelUr: 'اشاعت و کتب',
      labelEn: 'Publications & Books',
      icon: BookMarked,
    },
    {
      to: '/fatwas',
      labelUr: 'شرعی رہنمائی (فتاویٰ)',
      labelEn: 'Fatwas & Guidance',
      icon: FileText,
    },
    {
      to: '/qa',
      labelUr: 'سوالات و جوابات',
      labelEn: 'Questions & Answers',
      icon: HelpCircle,
    },
    {
      to: '/lectures',
      labelUr: 'آڈیو و ویڈیو بیانات',
      labelEn: 'Audio & Video Lectures',
      icon: Radio,
    },
    {
      to: '/contact',
      labelUr: 'رابطہ و معاونت',
      labelEn: 'Contact & Support',
      icon: Mail,
    },
    {
      to: '/events',
      labelUr: 'تقاریب اور اعلانات',
      labelEn: 'Events & Notices',
      icon: Megaphone,
    },
  ];

  // 2. Legal & Policy cards with complete policy text
  const policyCards = [
    {
      id: 'privacy',
      labelUr: 'رازداری کی پالیسی',
      labelEn: 'Privacy Policy',
      icon: Lock,
      contentUr:
        'ہم اپنے معزز قارئین اور صارفین کی ذاتی معلومات اور رازداری کا مکمل احترام کرتے ہیں۔ اس پلیٹ فارم پر موصول ہونے والی سوالات، آراء یا رابطے کی تفصیلات کو مکمل طور پر صیغہ راز میں رکھا جاتا ہے اور کسی تیسرے فریق کو فروخت یا بلا اجازت فراہم نہیں کیا جاتا۔ ویب سائٹ پر صارفین کے ڈیٹا کے تحفظ کے لیے مروجہ حفاظتی تدابیر اختیار کی گئی ہیں۔',
      contentEn:
        'We deeply value and respect the privacy of our visitors and users. Any personal details, queries, or contact information provided on this platform are kept strictly confidential and will never be shared or sold to third parties without consent.',
    },
    {
      id: 'terms',
      labelUr: 'استعمال کی شرائط',
      labelEn: 'Terms of Use',
      icon: ShieldCheck,
      contentUr:
        'اس ویب سائٹ پر شائع شدہ تمام مواد بشمول علمی مقالات، شرعی فتاویٰ، بیانات اور کتب صرف دینی رہنمائی اور تعلیمی استفادے کے لیے فراہم کی گئی ہیں۔ کسی بھی مواد کو بلا اجازت تجارتی مقاصد کے لیے فروخت کرنا، یا سیاق و سباق سے ہٹ کر توڑ مروڑ کر پیش کرنا سخت منع ہے۔ علمی تحقیق کے لیے حوالہ کے ساتھ نقل کرنے کی اجازت ہے۔',
      contentEn:
        'All materials published on this website including scholarly articles, fatwas, lectures, and publications are for educational and religious guidance only. Unauthorized commercial redistribution or altering the content is strictly prohibited.',
    },
    {
      id: 'disclaimer',
      labelUr: 'ڈس کلیمر',
      labelEn: 'Disclaimer',
      icon: FileText,
      contentUr:
        'ویب سائٹ پر موجود فتاویٰ اور شرعی رہنمائی سائل کے مخصوص سوال، حالات اور پیش کردہ شواہد کی روشنی میں صادر کیے جاتے ہیں۔ کسی قانونی، عدالتی، یا پیچیدہ خاندانی و مالی نزاع کے حتمی تصفیے کے لیے فریقین کا روبرو حاضر ہونا اور باقاعدہ دار القضاء سے رجوع فرمانا ضروری ہے۔ عام قارئین کسی فتویٰ کو تمام مختلف حالات پر خود بخود قیاس نہ کریں۔',
      contentEn:
        'The fatwas and religious guidance published on this platform are based on specific questions and contextual scenarios presented by the inquirers. For formal judicial rulings or legal disputes, direct consultation with an established Dar-ul-Ifta is required.',
    },
    {
      id: 'copyright',
      labelUr: 'کاپی رائٹ پالیسی',
      labelEn: 'Copyright Policy',
      icon: Copyright,
      contentUr:
        'اس ویب سائٹ کے تمام تحریری، سمعی، بصری اور تصنیفی حقوق بحق مفتی فیضان سرور مصباحی و ادارہ محفوظ ہیں۔ دینی و اصلاحی اشاعت کے لیے ویب سائٹ کا حوالہ دیتے ہوئے بلا معاوضہ شیئر کیا جا سکتا ہے، تاہم کسی بھی کتاب، فتویٰ یا مضمون کی طباعت و اشاعت سے قبل پیشگی اجازت ضروری ہے۔',
      contentEn:
        'All written, audio, visual, and published content on this website is protected under copyright law in favor of Mufti Faizan Sarwar Misbahi. Non-commercial scholarly sharing with explicit attribution is permitted.',
    },
  ];

  const currentYear = new Date().getFullYear();
  const defaultDesc =
    "دین اسلام کی صحیح تعلیمات کی اشاعت اور امت مسلمہ کی رہنمائی کے لیے علمی، شرعی، اور اصلاحی خدمات کا ایک مستند پلیٹ فارم۔";

  return (
    <footer
      style={{ backgroundColor: "#2B2118", color: "#F7F1E8", borderColor: "#A8793E" }}
      className="islamic-pattern relative border-t border-[#A8793E]/30 pt-5 sm:pt-6 pb-4 overflow-hidden select-none"
      dir={isRTL ? 'rtl' : 'ltr'}
    >
      {/* Top horizontal gold accent line */}
      <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-[#A8793E] to-transparent opacity-80" />

      {/* Main Centered Container */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 relative z-10 flex flex-col items-center text-center">

        {/* ── 1. MAIN IDENTITY SECTION ── */}
        <div className="flex flex-col items-center">
          {/* Centered Circular Seal / Calligraphy Emblem */}
          <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-full p-0.5 border-2 border-[#A8793E] bg-[#21170F] shadow-sm shadow-black/40 flex items-center justify-center overflow-hidden transition-transform duration-300 hover:scale-105">
            <picture className="w-full h-full">
              <source type="image/webp" srcSet={logoWebp} />
              <img
                src={logoImg}
                alt="Mufti Faizan Sarwar Emblem"
                width="64"
                height="64"
                loading="lazy"
                decoding="async"
                className="w-full h-full object-cover rounded-full select-none"
              />
            </picture>
          </div>

          {/* Scholar Name in prominent Nastaleeq */}
          <h2 className="font-urdu text-lg sm:text-xl text-[#F7F1E8] font-normal mt-1.5 leading-snug tracking-wide select-none drop-shadow-sm">
            {scholarName || (isRTL ? "مفتی فیضان سرور مصباحی" : "Mufti Faizan Sarwar Misbahi")}
          </h2>

          {/* Scholar Honorific Subtitle */}
          <div className="font-urdu text-[11px] sm:text-xs text-[#D8C8B5] mt-0.5 space-y-0.5 select-none leading-normal">
            <div>{scholarTitle || (isRTL ? "فضیلۃ الشیخ حافظ مولانا" : "Islamic Scholar & Jurist")}</div>
            <div className="text-[#C99A5A] text-[10px] sm:text-[11px]">
              {isRTL ? "دامت برکاتہم العالیہ" : "May Allah protect him"}
            </div>
          </div>

          {/* Symmetrical Gold Arabesque Flourish Divider */}
          <IslamicArabesqueFlourish className="w-28 sm:w-32 h-4 my-0.5 text-[#C99A5A]" />
        </div>

        {/* ── 2. SHORT DESCRIPTION ── */}
        <p className="font-urdu text-[11px] sm:text-xs text-[#D8C8B5] leading-[1.8] max-w-md sm:max-w-lg mx-auto mt-0.5 px-2 text-center select-none font-light">
          {settings?.homepageSettings?.heroMission || defaultDesc}
        </p>

        {/* ── 3. SOCIAL MEDIA ICONS ── */}
        <div className="flex items-center justify-center gap-2.5 sm:gap-3 my-2 sm:my-2.5" dir="ltr">
          {socialLinks.facebook && (
            <a
              href={socialLinks.facebook}
              target="_blank"
              rel="noopener noreferrer"
              className="w-8 h-8 sm:w-8.5 sm:h-8.5 rounded-full bg-[#1877F2] hover:bg-[#166fe5] text-white flex items-center justify-center shadow-xs transition-all duration-200 hover:scale-110 active:scale-95 cursor-pointer"
              aria-label="Facebook Page"
              title="Facebook"
            >
              <Facebook className="w-3.5 h-3.5 text-white" />
            </a>
          )}

          {socialLinks.youtube && (
            <a
              href={socialLinks.youtube}
              target="_blank"
              rel="noopener noreferrer"
              className="w-8 h-8 sm:w-8.5 sm:h-8.5 rounded-full bg-[#FF0000] hover:bg-[#e60000] text-white flex items-center justify-center shadow-xs transition-all duration-200 hover:scale-110 active:scale-95 cursor-pointer"
              aria-label="YouTube Channel"
              title="YouTube"
            >
              <Youtube className="w-3.5 h-3.5 text-white" />
            </a>
          )}

          {socialLinks.whatsapp && (
            <a
              href={socialLinks.whatsapp}
              target="_blank"
              rel="noopener noreferrer"
              className="w-8 h-8 sm:w-8.5 sm:h-8.5 rounded-full bg-[#25D366] hover:bg-[#20ba59] text-white flex items-center justify-center shadow-xs transition-all duration-200 hover:scale-110 active:scale-95 cursor-pointer"
              aria-label="WhatsApp Channel"
              title="WhatsApp Channel"
            >
              <FaWhatsapp className="w-3.5 h-3.5 text-white" />
            </a>
          )}

          {socialLinks.telegram && (
            <a
              href={socialLinks.telegram}
              target="_blank"
              rel="noopener noreferrer"
              className="w-8 h-8 sm:w-8.5 sm:h-8.5 rounded-full bg-[#0088cc] hover:bg-[#0077b5] text-white flex items-center justify-center shadow-xs transition-all duration-200 hover:scale-110 active:scale-95 cursor-pointer"
              aria-label="Telegram Channel"
              title="Telegram"
            >
              <FaTelegramPlane className="w-3.5 h-3.5 ml-[-1px] text-white" />
            </a>
          )}
        </div>

        {/* ── 4. ALL IMPORTANT LINKS ── */}
        <div className="w-full mt-1 sm:mt-1.5">
          <SectionPillDivider title={isRTL ? "اہم لنکس" : "Important Links"} />

          <div className="grid grid-cols-2 md:grid-cols-4 gap-1.5 sm:gap-2.5 w-full max-w-4xl mx-auto">
            {importantLinks.map((item, index) => {
              const IconComponent = item.icon;
              return (
                <Link
                  key={index}
                  to={item.to}
                  className="bg-[#21170F]/80 hover:bg-[#2A1D13] active:bg-[#1A120B] border border-[#A8793E]/25 hover:border-[#A8793E]/60 rounded-xl px-2.5 sm:px-3 py-1.5 sm:py-2 transition-all duration-200 flex items-center justify-between group shadow-xs hover:shadow-md hover:shadow-black/20 active:scale-[0.98]"
                >
                  <div className="w-6 h-6 sm:w-6.5 sm:h-6.5 rounded-lg bg-[#2B2118]/70 flex items-center justify-center shrink-0 border border-[#A8793E]/20 group-hover:border-[#A8793E]/40 transition-colors">
                    <IconComponent className="w-3.5 h-3.5 text-[#C99A5A] group-hover:text-[#E2B778] transition-colors" />
                  </div>

                  <span className="font-urdu text-[11px] xs:text-[12px] sm:text-xs text-[#F7F1E8] group-hover:text-white transition-colors truncate px-1 text-center flex-1">
                    {isRTL ? item.labelUr : item.labelEn}
                  </span>

                  <div className="shrink-0 text-[#A8793E]/50 group-hover:text-[#C99A5A] transition-colors">
                    {isRTL ? (
                      <ChevronLeft className="w-3 h-3 group-hover:-translate-x-0.5 transition-transform" />
                    ) : (
                      <ChevronRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
                    )}
                  </div>
                </Link>
              );
            })}
          </div>
        </div>

        {/* ── 5. CONTACT DETAILS SECTION ── */}
        <div className="w-full mt-1.5 sm:mt-2">
          <SectionPillDivider title={isRTL ? "مفتی صاحب سے رابطہ" : "Contact Details"} />

          <div className="bg-[#21170F]/80 border border-[#A8793E]/30 rounded-xl p-2.5 sm:p-3 max-w-3xl mx-auto w-full shadow-md text-right">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-2 sm:gap-2.5 text-xs font-light">
              {/* Address */}
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 rounded-lg bg-[#2B2118] border border-[#A8793E]/20 flex items-center justify-center shrink-0">
                  <MapPin className="w-3.5 h-3.5 text-[#C99A5A]" />
                </div>
                <span className="leading-tight text-[#F7F1E8] font-urdu text-[11px] sm:text-xs">
                  {address}
                </span>
              </div>

              {/* Phone */}
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 rounded-lg bg-[#2B2118] border border-[#A8793E]/20 flex items-center justify-center shrink-0">
                  <Phone className="w-3.5 h-3.5 text-[#C99A5A]" />
                </div>
                <a
                  href={getTelLink(phone)}
                  dir="ltr"
                  className="text-[#F7F1E8] hover:text-[#C99A5A] transition-colors font-sans text-xs font-medium"
                >
                  <bdi dir="ltr">{formatPhoneNumber(phone)}</bdi>
                </a>
              </div>

              {/* Email */}
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 rounded-lg bg-[#2B2118] border border-[#A8793E]/20 flex items-center justify-center shrink-0">
                  <Mail className="w-3.5 h-3.5 text-[#C99A5A]" />
                </div>
                <a
                  href={`mailto:${email}`}
                  className="text-[#F7F1E8] hover:text-[#C99A5A] transition-colors truncate font-sans text-xs"
                  title={email}
                >
                  {email}
                </a>
              </div>
            </div>

            {/* Direct WhatsApp Channel Button */}
            {whatsapp && (
              <div className="mt-2 pt-1.5 border-t border-[#A8793E]/20 flex justify-center">
                <a
                  href={whatsapp}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 bg-[#25D366] hover:bg-[#20ba59] text-white px-3.5 py-0.5 rounded-full text-[11px] font-semibold shadow-xs transition-transform hover:scale-105 active:scale-95"
                >
                  <FaWhatsapp className="w-3 h-3" />
                  <span>{isRTL ? "واٹس ایپ چینل میں شامل ہوں" : "Join WhatsApp Channel"}</span>
                </a>
              </div>
            )}
          </div>
        </div>

        {/* ── 6. AUTHENTICATION & STAY INFORMED (باخبر رہیں / لاگ ان) ── */}
        <div className="w-full mt-1.5 sm:mt-2">
          <SectionPillDivider title={isRTL ? "باخبر رہیں" : "Stay Informed"} />

          <div className="max-w-md mx-auto w-full px-2 text-center">
            <p className="font-urdu text-[11px] sm:text-xs text-[#D8C8B5] leading-normal mb-2">
              {isRTL
                ? isAuthenticated
                  ? "آپ لاگ ان ہیں۔ اپنے سوالات، پیغامات اور پروفائل کے لیے تفصیلات دیکھیں۔"
                  : "مفتی صاحب سے سوال پوچھنے، پیغامات بھیجنے اور رہنمائی حاصل کرنے کے لیے لاگ ان کریں۔"
                : isAuthenticated
                  ? "You are logged in. Access your submitted questions, messages, and profile."
                  : "Log in to ask religious questions, send messages, and stay informed."}
            </p>

            <div className="flex items-center justify-center">
              {isAuthenticated ? (
                <Link
                  to="/my-details"
                  className="inline-flex items-center justify-center gap-1.5 px-5 py-1.5 rounded-xl bg-gradient-to-r from-[#A8793E] via-[#C99A5A] to-[#A8793E] text-[#21170F] font-urdu font-bold text-xs sm:text-[13px] hover:from-[#C99A5A] hover:to-[#DFB778] transition-all duration-300 shadow-sm hover:scale-105 active:scale-95 cursor-pointer"
                >
                  <User className="w-3.5 h-3.5 text-[#21170F]" />
                  <span>{isRTL ? "میری تفصیلات / اکاؤنٹ" : "My Account"}</span>
                </Link>
              ) : (
                <button
                  type="button"
                  onClick={openLogin}
                  className="inline-flex items-center justify-center gap-1.5 px-6 py-1.5 rounded-xl bg-gradient-to-r from-[#A8793E] via-[#C99A5A] to-[#A8793E] text-[#21170F] font-urdu font-bold text-xs sm:text-[13px] hover:from-[#C99A5A] hover:to-[#DFB778] transition-all duration-300 shadow-sm hover:scale-105 active:scale-95 cursor-pointer"
                >
                  <LogIn className="w-3.5 h-3.5 text-[#21170F]" />
                  <span>{isRTL ? "لاگ ان کریں" : "Login"}</span>
                </button>
              )}
            </div>
          </div>
        </div>

        {/* ── 7. LEGAL & POLICY SECTION ── */}
        <div className="w-full mt-1.5 sm:mt-2">
          <SectionPillDivider title={isRTL ? "قانونی و پالیسی" : "Legal & Policy"} />

          <div className="grid grid-cols-2 md:grid-cols-4 gap-1.5 sm:gap-2.5 w-full max-w-3xl mx-auto">
            {policyCards.map((card) => {
              const IconComponent = card.icon;
              return (
                <button
                  key={card.id}
                  type="button"
                  onClick={() => setActivePolicy(card)}
                  className="bg-[#21170F]/80 hover:bg-[#2A1D13] active:bg-[#1A120B] border border-[#A8793E]/25 hover:border-[#A8793E]/60 rounded-xl px-2.5 sm:px-3 py-1.5 sm:py-2 transition-all duration-200 flex items-center justify-between group shadow-xs hover:shadow-md hover:shadow-black/20 active:scale-[0.98] text-right cursor-pointer"
                >
                  <div className="w-6 h-6 sm:w-6.5 sm:h-6.5 rounded-lg bg-[#2B2118]/70 flex items-center justify-center shrink-0 border border-[#A8793E]/20 group-hover:border-[#A8793E]/40 transition-colors">
                    <IconComponent className="w-3.5 h-3.5 text-[#C99A5A] group-hover:text-[#E2B778] transition-colors" />
                  </div>

                  <span className="font-urdu text-[11px] xs:text-[12px] sm:text-xs text-[#F7F1E8] group-hover:text-white transition-colors truncate px-1 text-center flex-1">
                    {isRTL ? card.labelUr : card.labelEn}
                  </span>

                  <div className="shrink-0 text-[#A8793E]/50 group-hover:text-[#C99A5A] transition-colors">
                    {isRTL ? (
                      <ChevronLeft className="w-3 h-3 group-hover:-translate-x-0.5 transition-transform" />
                    ) : (
                      <ChevronRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
                    )}
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* ── 8. COPYRIGHT SECTION ── */}
        <div className="w-full mt-3 sm:mt-4 pt-1.5 flex flex-col items-center">
          <div className="flex items-center justify-center gap-2 w-full max-w-xs mx-auto mb-1.5 select-none opacity-80" aria-hidden="true">
            <span className="h-[1px] flex-1 bg-gradient-to-r from-transparent to-[#A8793E]/60" />
            <span className="text-[#C99A5A] text-[9px] font-serif leading-none select-none">❖</span>
            <span className="h-[1px] flex-1 bg-gradient-to-l from-transparent to-[#A8793E]/60" />
          </div>

          <p className="font-urdu text-[10.5px] sm:text-[11.5px] text-[#D8C8B5] tracking-wide text-center leading-relaxed select-none">
            {isRTL
              ? `© ${currentYear} ${scholarName || "مفتی فیضان سرور مصباحی"}۔ تمام حقوق محفوظ ہیں۔`
              : `© ${currentYear} ${scholarName || "Mufti Faizan Sarwar Misbahi"}. All Rights Reserved.`}
          </p>
        </div>

      </div>

      {/* ── LEGAL & POLICY DETAIL MODAL (No 404, accessible popup) ── */}
      {activePolicy && (
        <div
          className="fixed inset-0 z-50 bg-black/75 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-200"
          onClick={() => setActivePolicy(null)}
          role="dialog"
          aria-modal="true"
          aria-labelledby="policy-dialog-title"
        >
          <div
            className="bg-[#21170F] border border-[#A8793E]/60 rounded-2xl max-w-lg w-full max-h-[85vh] flex flex-col shadow-2xl relative overflow-hidden"
            onClick={(e) => e.stopPropagation()}
            dir={isRTL ? 'rtl' : 'ltr'}
          >
            <div className="h-1 w-full bg-gradient-to-r from-[#A8793E]/20 via-[#C99A5A] to-[#A8793E]/20" />

            <div className="px-5 py-4 border-b border-[#A8793E]/30 flex items-center justify-between bg-[#2B2118]/60">
              <div className="flex items-center gap-2.5">
                <span className="text-[#C99A5A] text-sm">❖</span>
                <h3 id="policy-dialog-title" className="font-urdu text-lg sm:text-xl font-medium text-[#F7F1E8]">
                  {isRTL ? activePolicy.labelUr : activePolicy.labelEn}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setActivePolicy(null)}
                className="w-8 h-8 rounded-lg bg-[#2B2118] border border-[#A8793E]/30 text-[#D8C8B5] hover:text-white hover:border-[#A8793E] flex items-center justify-center transition-colors cursor-pointer"
                aria-label="Close"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-5 sm:p-6 overflow-y-auto space-y-4 text-justify font-urdu text-sm sm:text-[14.5px] text-[#D8C8B5] leading-[2.3]">
              <p>{isRTL ? activePolicy.contentUr : activePolicy.contentEn}</p>
              
              <div className="pt-2 border-t border-[#A8793E]/20 flex items-center justify-between text-xs text-[#A8793E]">
                <span>دارالقضاء ادارۂ شرعیہ</span>
                <span>{scholarName || "مفتی فیضان سرور مصباحی"}</span>
              </div>
            </div>

            <div className="px-5 py-3 border-t border-[#A8793E]/30 bg-[#2B2118]/40 flex justify-end">
              <button
                type="button"
                onClick={() => setActivePolicy(null)}
                className="px-5 py-1.5 rounded-lg bg-[#A8793E] hover:bg-[#C99A5A] text-[#21170F] font-semibold text-xs sm:text-sm transition-colors cursor-pointer"
              >
                {isRTL ? "بند کریں" : "Close"}
              </button>
            </div>
          </div>
        </div>
      )}
    </footer>
  );
}
