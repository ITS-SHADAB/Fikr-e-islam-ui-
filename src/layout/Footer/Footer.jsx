import React from 'react';
import { Link } from 'react-router-dom';
import { BookOpen, Mail, Phone, MapPin, Send, Facebook, Youtube, Shield } from 'lucide-react';
import { FaWhatsapp, FaTelegramPlane } from 'react-icons/fa';
import { useSettings } from '@/hooks/useSettings';
import { COLORS } from '@/utils/themeColors';
import { OFFICIAL_CONTACT, OFFICIAL_SOCIAL_LINKS, formatPhoneNumber, getTelLink } from '@/constants/contact';

import { Input } from '@/components';
import logoImg from '@/assets/images/logo.jpeg';

export default function Footer() {
  const { settings } = useSettings();
  const language = settings?.language === 'ur' || settings?.language === 'Urdu' ? 'ur' : 'en';

  const scholarName = settings?.scholarInfo?.fullName || '';
  const scholarTitle = settings?.scholarInfo?.title || '';

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

  return (
    <footer
      style={{ backgroundColor: "#2B2118", color: "#F7F1E8", borderColor: "#A8793E" }}
      className="islamic-pattern relative border-t-2 pt-14 pb-8"
    >
      {/* Metallic Gold Accent Top Line */}
      <div className="absolute top-0 left-0 right-0 h-1" style={{ backgroundColor: "#A8793E" }}></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12" dir={language === 'ur' ? 'rtl' : 'ltr'}>

        {/* Column 1: Biography / Mission */}
        <div className={language === 'ur' ? 'text-right' : 'text-left'}>
          <div className="flex items-center gap-3 mb-4 justify-start">
            <div className="w-12 h-12 rounded-full border-2 border-[#A8793E] overflow-hidden shrink-0 shadow-md bg-[#2B2118]">
              <img
                src={logoImg}
                alt="Logo"
                className="w-full h-full object-cover rounded-full"
              />
            </div>
            <div>
              <span className="text-lg font-bold tracking-wide block leading-snug" style={{ color: "#F7F1E8" }}>
                {scholarName || (language === 'ur' ? "مفتی فیضان سرور مصباحی" : "Mufti Faizan Sarwar")}
              </span>
              <span className="text-xs text-[#DFC8A4] block">
                {scholarTitle || (language === 'ur' ? "قاضی شریعت و ترجمان اہل سنت" : "Islamic Scholar & Jurist")}
              </span>
            </div>
          </div>
          <p className="text-sm leading-relaxed mb-4 font-light text-[#DFC8A4]">
            {settings?.homepageSettings?.heroMission || ''}
          </p>
          <div className="flex items-center gap-2.5 justify-start">
            {socialLinks.facebook && (
              <a
                href={socialLinks.facebook}
                target="_blank"
                rel="noopener noreferrer"
                style={{ backgroundColor: '#1877F2', borderColor: '#1877F2', color: '#ffffff' }}
                className="p-2 rounded-xl border shadow-xs hover:opacity-90 hover:scale-105 transition-all flex items-center justify-center"
                aria-label="Facebook"
                title="Facebook"
              >
                <Facebook className="w-4 h-4" />
              </a>
            )}
            {socialLinks.youtube && (
              <a
                href={socialLinks.youtube}
                target="_blank"
                rel="noopener noreferrer"
                style={{ backgroundColor: '#FF0000', borderColor: '#FF0000', color: '#ffffff' }}
                className="p-2 rounded-xl border shadow-xs hover:opacity-90 hover:scale-105 transition-all flex items-center justify-center"
                aria-label="YouTube"
                title="YouTube"
              >
                <Youtube className="w-4 h-4" />
              </a>
            )}
            {socialLinks.whatsapp && (
              <a
                href={socialLinks.whatsapp}
                target="_blank"
                rel="noopener noreferrer"
                style={{ backgroundColor: '#25D366', borderColor: '#25D366', color: '#ffffff' }}
                className="p-2 rounded-xl border shadow-xs hover:opacity-90 hover:scale-105 transition-all flex items-center justify-center"
                aria-label="WhatsApp"
                title="WhatsApp Channel"
              >
                <FaWhatsapp className="w-4 h-4" />
              </a>
            )}
            {socialLinks.telegram && (
              <a
                href={socialLinks.telegram}
                target="_blank"
                rel="noopener noreferrer"
                style={{ backgroundColor: '#0088cc', borderColor: '#0088cc', color: '#ffffff' }}
                className="p-2 rounded-xl border shadow-xs hover:opacity-90 hover:scale-105 transition-all flex items-center justify-center"
                aria-label="Telegram"
                title="Telegram Channel"
              >
                <FaTelegramPlane className="w-4 h-4" />
              </a>
            )}
          </div>
        </div>

        {/* Column 2: Sitemap Navigation */}
        <div className={language === 'ur' ? 'text-right' : 'text-left'}>
          <h3
            style={{ color: "#F7F1E8", borderColor: "#A8793E" }}
            className="font-semibold text-md mb-4 border-b pb-2 uppercase tracking-wider"
          >
            {language === 'en' ? 'Quick Links' : 'فوری لنکس'}
          </h3>
          <ul className="space-y-2.5 text-sm font-light">
            <li>
              <Link
                to="/about"
                className="text-[#DFC8A4] hover:text-[#F7F1E8] hover:underline transition-all flex items-center gap-1 justify-start"
              >
                <span style={{ color: "#A8793E" }}>›</span> {language === 'en' ? 'Biography & Credentials' : 'سوانح اور اسناد'}
              </Link>
            </li>
            <li>
              <Link
                to="/articles"
                className="text-[#DFC8A4] hover:text-[#F7F1E8] hover:underline transition-all flex items-center gap-1 justify-start"
              >
                <span style={{ color: "#A8793E" }}>›</span> {language === 'en' ? 'Scholarly Articles' : 'علمی مقالات'}
              </Link>
            </li>
            <li>
              <Link
                to="/fatwas"
                className="text-[#DFC8A4] hover:text-[#F7F1E8] hover:underline transition-all flex items-center gap-1 justify-start"
              >
                <span style={{ color: "#A8793E" }}>›</span> {language === 'en' ? 'Fatwas & Shariah Rulings' : 'فتاویٰ اور شرعی احکام'}
              </Link>
            </li>
            <li>
              <Link
                to="/qa"
                className="text-[#DFC8A4] hover:text-[#F7F1E8] hover:underline transition-all flex items-center gap-1 justify-start"
              >
                <span style={{ color: "#A8793E" }}>›</span> {language === 'en' ? 'Questions & Answers' : 'سوالات اور جوابات'}
              </Link>
            </li>
            <li>
              <Link
                to="/publications"
                className="text-[#DFC8A4] hover:text-[#F7F1E8] hover:underline transition-all flex items-center gap-1 justify-start"
              >
                <span style={{ color: "#A8793E" }}>›</span> {language === 'en' ? 'Books & Library' : 'کتب اور مطالعہ'}
              </Link>
            </li>
            <li>
              <Link
                to="/lectures"
                className="text-[#DFC8A4] hover:text-[#F7F1E8] hover:underline transition-all flex items-center gap-1 justify-start"
              >
                <span style={{ color: "#A8793E" }}>›</span> {language === 'en' ? 'Audio & Video Lectures' : 'آڈیو اور ویڈیو بیانات'}
              </Link>
            </li>
          </ul>
        </div>

        {/* Column 3: Contact details */}
        <div className={language === 'ur' ? 'text-right' : 'text-left'}>
          <h3
            style={{ color: "#F7F1E8", borderColor: "#A8793E" }}
            className="font-semibold text-md mb-4 border-b pb-2 uppercase tracking-wider"
          >
            {language === 'en' ? 'Contact Mufti Sahab' : 'مفتی صاحب سے رابطہ کریں'}
          </h3>
          <ul className="space-y-3.5 text-sm font-light">
            <li className="flex items-start gap-2.5 justify-start">
              <MapPin className="w-5 h-5 shrink-0 mt-0.5" style={{ color: "#A8793E" }} />
              <span className="leading-tight text-[#F7F1E8]">{address}</span>
            </li>
            <li className="flex items-center gap-2.5 justify-start">
              <Phone className="w-4 h-4 shrink-0" style={{ color: "#A8793E" }} />
              <a
                href={getTelLink(phone)}
                dir="ltr"
                style={{ direction: 'ltr', unicodeBidi: 'isolate' }}
                className="text-[#F7F1E8] hover:text-[#DFC8A4] transition-colors dir-ltr font-sans inline-block"
              >
                <bdi dir="ltr">{formatPhoneNumber(phone)}</bdi>
              </a>
            </li>
            {whatsapp && (
              <li className="flex items-center gap-2.5 justify-start">
                <a
                  href={whatsapp}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 text-[#F7F1E8] hover:text-[#DFC8A4] transition-colors"
                >
                  <span
                    style={{ color: "#ffffff", backgroundColor: "#25D366", borderColor: "#25D366" }}
                    className="font-bold text-xs rounded-lg px-2.5 py-1 border flex items-center gap-1.5 shadow-2xs hover:brightness-105 transition-all"
                  >
                    <FaWhatsapp className="w-3.5 h-3.5 text-white" />
                    {language === 'en' ? 'WhatsApp Channel' : 'واٹس ایپ چینل'}
                  </span>
                </a>
              </li>
            )}
            <li className="flex items-center gap-2.5 justify-start">
              <Mail className="w-4 h-4 shrink-0" style={{ color: "#A8793E" }} />
              <a
                href={`mailto:${email}`}
                className="text-[#F7F1E8] hover:text-[#DFC8A4] transition-colors truncate font-sans"
              >
                {email}
              </a>
            </li>
          </ul>
        </div>

        {/* Column 4: Newsletter Submission */}
        <div className={language === 'ur' ? 'text-right' : 'text-left'}>
          <h3
            style={{ color: "#F7F1E8", borderColor: "#A8793E" }}
            className="font-semibold text-md mb-4 border-b pb-2 uppercase tracking-wider"
          >
            {language === 'en' ? 'Stay Informed' : 'باخبر رہیں'}
          </h3>
          <p className="text-xs mb-4 font-light leading-relaxed text-[#DFC8A4]">
            {language === 'en' ? 'Subscribe to receive updates about new Islamic articles, publications, or fatwas directly.' : 'نئے اسلامی مضامین، مطبوعات یا فتاویٰ شائع ہونے پر براہ راست معلومات حاصل کرنے کے لیے سبسکرائب کریں۔'}
          </p>
          <form
            onSubmit={(e) => e.preventDefault()}
            style={{ borderColor: "#A8793E" }}
            className="flex border rounded-xl overflow-hidden shadow-xs"
            dir={language === 'ur' ? 'rtl' : 'ltr'}
          >
            <Input
              type="email"
              placeholder={language === 'en' ? 'Your email address' : 'آپ کا ای میل ایڈریس'}
              border=""
              inputClassName="bg-[#1E1610] text-[#F7F1E8] text-xs px-3 py-2 w-full outline-none placeholder:text-[#A8793E]/60"
            />
            <button
              type="submit"
              style={{ backgroundColor: "#A8793E" }}
              className="text-[#2B2118] px-4 transition-colors flex items-center justify-center shrink-0 hover:bg-[#DFC8A4] hover:text-[#2B2118] cursor-pointer"
            >
              <Send className="w-3.5 h-3.5" />
            </button>
          </form>
        </div>

      </div>
    </footer>
  );
}
