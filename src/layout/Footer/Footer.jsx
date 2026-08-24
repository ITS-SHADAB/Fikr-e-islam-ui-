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
      style={{ backgroundColor: COLORS.background, color: COLORS.textPrimary, borderColor: COLORS.border }}
      className="islamic-pattern relative border-t-2 pt-16 pb-8"
    >
      {/* Metallic Gold Accent Top Line */}
      <div className="absolute top-0 left-0 right-0 h-1" style={{ backgroundColor: COLORS.accent }}></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12" dir={language === 'ur' ? 'rtl' : 'ltr'}>

        {/* Column 1: Biography / Mission */}
        <div className={language === 'ur' ? 'text-right' : 'text-left'}>
          <div className="flex items-center gap-2 mb-4 justify-start">
            <BookOpen className="w-6 h-6" style={{ color: COLORS.primary }} />
            <span className="text-lg font-bold tracking-wide" style={{ color: COLORS.primary }}>
              {scholarName}
            </span>
          </div>
          <p className="text-sm leading-relaxed mb-4 font-light" style={{ color: COLORS.textSecondary }}>
            {settings?.homepageSettings?.heroMission || ''}
          </p>
          <div className="flex items-center gap-2.5 justify-start">
            {socialLinks.facebook && (
              <a
                href={socialLinks.facebook}
                target="_blank"
                rel="noopener noreferrer"
                style={{ color: COLORS.primary, borderColor: COLORS.border }}
                className="p-2 rounded bg-white border hover:text-white theme-hover-bg-accent transition-colors"
              >
                <Facebook className="w-4 h-4" />
              </a>
            )}
            {socialLinks.youtube && (
              <a
                href={socialLinks.youtube}
                target="_blank"
                rel="noopener noreferrer"
                style={{ color: COLORS.primary, borderColor: COLORS.border }}
                className="p-2 rounded bg-white border hover:text-white theme-hover-bg-accent transition-colors"
              >
                <Youtube className="w-4 h-4" />
              </a>
            )}
            {socialLinks.twitter && (
              <a
                href={socialLinks.twitter}
                target="_blank"
                rel="noopener noreferrer"
                style={{ color: COLORS.primary, borderColor: COLORS.border }}
                className="p-2 rounded bg-white border hover:text-white theme-hover-bg-accent transition-colors"
              >
                <Twitter className="w-4 h-4" />
              </a>
            )}
            {socialLinks.instagram && (
              <a
                href={socialLinks.instagram}
                target="_blank"
                rel="noopener noreferrer"
                style={{ color: COLORS.primary, borderColor: COLORS.border }}
                className="p-2 rounded bg-white border hover:text-white theme-hover-bg-accent transition-colors"
              >
                <Instagram className="w-4 h-4" />
              </a>
            )}
          </div>
        </div>

        {/* Column 2: Sitemap Navigation */}
        <div className={language === 'ur' ? 'text-right' : 'text-left'}>
          <h3
            style={{ color: COLORS.primary, borderColor: COLORS.border }}
            className="font-semibold text-md mb-4 border-b pb-2 uppercase tracking-wider"
          >
            {language === 'en' ? 'Quick Links' : 'فوری لنکس'}
          </h3>
          <ul className="space-y-2.5 text-sm font-light">
            <li>
              <Link
                to="/about"
                style={{ color: COLORS.textSecondary }}
                className="hover:underline transition-all flex items-center gap-1 justify-start theme-hover-text-primary"
              >
                <span style={{ color: COLORS.accent }}>›</span> {language === 'en' ? 'Biography & Credentials' : 'سوانح اور اسناد'}
              </Link>
            </li>
            <li>
              <Link
                to="/articles"
                style={{ color: COLORS.textSecondary }}
                className="hover:underline transition-all flex items-center gap-1 justify-start theme-hover-text-primary"
              >
                <span style={{ color: COLORS.accent }}>›</span> {language === 'en' ? 'Scholarly Articles' : 'علمی مقالات'}
              </Link>
            </li>
            <li>
              <Link
                to="/fatwas"
                style={{ color: COLORS.textSecondary }}
                className="hover:underline transition-all flex items-center gap-1 justify-start theme-hover-text-primary"
              >
                <span style={{ color: COLORS.accent }}>›</span> {language === 'en' ? 'Fatwas & Shariah Rulings' : 'فتاویٰ اور شرعی احکام'}
              </Link>
            </li>
            <li>
              <Link
                to="/qa"
                style={{ color: COLORS.textSecondary }}
                className="hover:underline transition-all flex items-center gap-1 justify-start theme-hover-text-primary"
              >
                <span style={{ color: COLORS.accent }}>›</span> {language === 'en' ? 'Questions & Answers' : 'سوالات اور جوابات'}
              </Link>
            </li>
            <li>
              <Link
                to="/publications"
                style={{ color: COLORS.textSecondary }}
                className="hover:underline transition-all flex items-center gap-1 justify-start theme-hover-text-primary"
              >
                <span style={{ color: COLORS.accent }}>›</span> {language === 'en' ? 'Books & Library' : 'کتب اور مطالعہ'}
              </Link>
            </li>
            <li>
              <Link
                to="/lectures"
                style={{ color: COLORS.textSecondary }}
                className="hover:underline transition-all flex items-center gap-1 justify-start theme-hover-text-primary"
              >
                <span style={{ color: COLORS.accent }}>›</span> {language === 'en' ? 'Audio & Video Lectures' : 'آڈیو اور ویڈیو بیانات'}
              </Link>
            </li>
          </ul>
        </div>

        {/* Column 3: Contact details */}
        <div className={language === 'ur' ? 'text-right' : 'text-left'}>
          <h3
            style={{ color: COLORS.primary, borderColor: COLORS.border }}
            className="font-semibold text-md mb-4 border-b pb-2 uppercase tracking-wider"
          >
            {language === 'en' ? 'Contact Scholar' : 'عالم صاحب سے رابطہ'}
          </h3>
          <ul className="space-y-3.5 text-sm font-light">
            <li className="flex items-start gap-2.5 justify-start">
              <MapPin className="w-5 h-5 shrink-0 mt-0.5" style={{ color: COLORS.accent }} />
              <span style={{ color: COLORS.textPrimary }} className="leading-tight">{address}</span>
            </li>
            <li className="flex items-center gap-2.5 justify-start">
              <Phone className="w-4 h-4 shrink-0" style={{ color: COLORS.accent }} />
              <span style={{ color: COLORS.textPrimary }}>{phone}</span>
            </li>
            {whatsapp && (
              <li className="flex items-center gap-2.5 justify-start">
                <span
                  style={{ color: COLORS.textSecondary, backgroundColor: COLORS.secondary, borderColor: COLORS.border }}
                  className="font-bold text-xs rounded px-2 py-0.5 border"
                >
                  {language === 'en' ? 'WhatsApp' : 'واٹس ایپ'}
                </span>
                <span style={{ color: COLORS.textPrimary }}>{whatsapp}</span>
              </li>
            )}
            <li className="flex items-center gap-2.5 justify-start">
              <Mail className="w-4 h-4 shrink-0" style={{ color: COLORS.accent }} />
              <span style={{ color: COLORS.textPrimary }}>{email}</span>
            </li>
          </ul>
        </div>

        {/* Column 4: Newsletter Submission Mock */}
        <div className={language === 'ur' ? 'text-right' : 'text-left'}>
          <h3
            style={{ color: COLORS.primary, borderColor: COLORS.border }}
            className="font-semibold text-md mb-4 border-b pb-2 uppercase tracking-wider"
          >
            {language === 'en' ? 'Stay Informed' : 'باخبر رہیں'}
          </h3>
          <p className="text-xs mb-4 font-light leading-relaxed" style={{ color: COLORS.textSecondary }}>
            {language === 'en' ? 'Subscribe to receive updates about new Islamic articles, publications, or fatwas directly.' : 'نئے اسلامی مضامین، مطبوعات یا فتاویٰ شائع ہونے پر براہ راست معلومات حاصل کرنے کے لیے سبسکرائب کریں۔'}
          </p>
          <form
            onSubmit={(e) => e.preventDefault()}
            style={{ borderColor: COLORS.border }}
            className="flex border rounded overflow-hidden shadow-xs"
            dir={language === 'ur' ? 'rtl' : 'ltr'}
          >
            <Input
              type="email"
              placeholder={language === 'en' ? 'Your email address' : 'آپ کا ای میل ایڈریس'}
              border=""
              inputClassName="bg-white text-slate-800 text-xs px-3 py-2 w-full outline-none"
            />
            <button
              type="submit"
              style={{ backgroundColor: COLORS.primary }}
              className="text-white px-4 transition-colors flex items-center justify-center shrink-0 theme-hover-bg-accent"
            >
              <Send className="w-3.5 h-3.5" />
            </button>
          </form>
        </div>

      </div>

      {/* Footer base metadata */}
      {/* <div 
        style={{ borderColor: COLORS.border }}
        className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 border-t flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500" 
        dir={language === 'ur' ? 'rtl' : 'ltr'}
      >
        <p className={`mb-4 sm:mb-0 text-center ${language === 'ur' ? 'sm:text-right' : 'sm:text-left'}`}>
          &copy; {new Date().getFullYear()} {scholarName}{language === 'en' ? '. All rights reserved. Derived from classical guidance.' : '۔ جملہ حقوق محفوظ ہیں۔ کلاسیکی رہنمائی سے ماخوذ۔'}
        </p>
        <div className="flex items-center gap-4">
          <Link 
            to="/login" 
            style={{ color: COLORS.primary }}
            className="transition-colors flex items-center gap-1 font-semibold theme-hover-text-accent"
          >
            <Shield className="w-3.5 h-3.5" /> {language === 'en' ? 'Admin Panel' : 'ایڈمن پینل'}
          </Link>
        </div>
      </div> */}
    </footer>
  );
}
