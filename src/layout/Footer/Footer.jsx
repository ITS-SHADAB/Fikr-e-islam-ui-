import React from 'react';
import { Link } from 'react-router-dom';
import { BookOpen, Mail, Phone, MapPin, Send, Facebook, Youtube, Twitter, Instagram, Shield } from 'lucide-react';
import { useSettings } from '@/hooks/useSettings';
import { COLORS } from '@/utils/themeColors';

import { Input } from '@/components';

export default function Footer() {
  const { settings } = useSettings();
  const language = settings?.language === 'ur' || settings?.language === 'Urdu' ? 'ur' : 'en';

  const scholarName = settings?.scholarInfo?.fullName || '';
  const scholarTitle = settings?.scholarInfo?.title || '';

  const address = settings?.contactInfo?.address || '';
  const phone = settings?.contactInfo?.phone || '';
  const whatsapp = settings?.contactInfo?.whatsapp || '';
  const email = settings?.contactInfo?.email || '';

  const socialLinks = settings?.socialLinks || {};

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
          <div className="flex items-center gap-2 mb-4 justify-start">
            <BookOpen className="w-6 h-6" style={{ color: "#A8793E" }} />
            <span className="text-lg font-bold tracking-wide" style={{ color: "#F7F1E8" }}>
              {scholarName}
            </span>
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
                style={{ color: "#F7F1E8", borderColor: "#A8793E" }}
                className="p-2 rounded-xl bg-[#3D2E22] border hover:text-[#DFC8A4] hover:border-[#DFC8A4] transition-colors"
                aria-label="Facebook"
              >
                <Facebook className="w-4 h-4" />
              </a>
            )}
            {socialLinks.youtube && (
              <a
                href={socialLinks.youtube}
                target="_blank"
                rel="noopener noreferrer"
                style={{ color: "#F7F1E8", borderColor: "#A8793E" }}
                className="p-2 rounded-xl bg-[#3D2E22] border hover:text-[#DFC8A4] hover:border-[#DFC8A4] transition-colors"
                aria-label="YouTube"
              >
                <Youtube className="w-4 h-4" />
              </a>
            )}
            {socialLinks.twitter && (
              <a
                href={socialLinks.twitter}
                target="_blank"
                rel="noopener noreferrer"
                style={{ color: "#F7F1E8", borderColor: "#A8793E" }}
                className="p-2 rounded-xl bg-[#3D2E22] border hover:text-[#DFC8A4] hover:border-[#DFC8A4] transition-colors"
                aria-label="Twitter"
              >
                <Twitter className="w-4 h-4" />
              </a>
            )}
            {socialLinks.instagram && (
              <a
                href={socialLinks.instagram}
                target="_blank"
                rel="noopener noreferrer"
                style={{ color: "#F7F1E8", borderColor: "#A8793E" }}
                className="p-2 rounded-xl bg-[#3D2E22] border hover:text-[#DFC8A4] hover:border-[#DFC8A4] transition-colors"
                aria-label="Instagram"
              >
                <Instagram className="w-4 h-4" />
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
            {language === 'en' ? 'Contact Scholar' : 'عالم صاحب سے رابطہ'}
          </h3>
          <ul className="space-y-3.5 text-sm font-light">
            <li className="flex items-start gap-2.5 justify-start">
              <MapPin className="w-5 h-5 shrink-0 mt-0.5" style={{ color: "#A8793E" }} />
              <span className="leading-tight text-[#F7F1E8]">{address}</span>
            </li>
            <li className="flex items-center gap-2.5 justify-start">
              <Phone className="w-4 h-4 shrink-0" style={{ color: "#A8793E" }} />
              <span className="text-[#F7F1E8]">{phone}</span>
            </li>
            {whatsapp && (
              <li className="flex items-center gap-2.5 justify-start">
                <span
                  style={{ color: "#F7F1E8", backgroundColor: "#3D2E22", borderColor: "#A8793E" }}
                  className="font-bold text-xs rounded px-2 py-0.5 border"
                >
                  {language === 'en' ? 'WhatsApp' : 'واٹس ایپ'}
                </span>
                <span className="text-[#F7F1E8]">{whatsapp}</span>
              </li>
            )}
            <li className="flex items-center gap-2.5 justify-start">
              <Mail className="w-4 h-4 shrink-0" style={{ color: "#A8793E" }} />
              <span className="text-[#F7F1E8]">{email}</span>
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
