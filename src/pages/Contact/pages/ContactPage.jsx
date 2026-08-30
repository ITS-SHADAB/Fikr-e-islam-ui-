import React, { useState } from 'react';
import {
  Mail,
  Phone,
  MapPin,
  Send,
  MessageSquare,
  CheckCircle2,
  AlertTriangle,
  Facebook,
  Youtube,
  Twitter,
  Instagram,
  Sparkles,
  Clock,
  Globe,
  ExternalLink,
} from 'lucide-react';
import { submitContact } from '@/services';
import { useSettings } from '@/hooks/useSettings';
import { COLORS } from '@/utils/themeColors';

export default function ContactPage() {
  const { settings } = useSettings();
  const language =
    settings?.language === 'ur' || settings?.language === 'Urdu' ? 'ur' : 'en';
  const isRTL = language === 'ur';

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
  });

  const [actionLoading, setActionLoading] = useState(false);
  const [actionError, setActionError] = useState(null);
  const [success, setSuccess] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    setActionError(null);

    if (
      !formData.name?.trim() ||
      !formData.email?.trim() ||
      !formData.subject?.trim() ||
      !formData.message?.trim()
    ) {
      setActionError(
        isRTL
          ? 'براہ کرم تمام لازمی خانے پر کریں۔'
          : 'Please fill in all required fields.'
      );
      return;
    }

    try {
      setActionLoading(true);
      const result = await submitContact(formData);
      setSuccess(true);
      setSuccessMsg(
        result?.message ||
          (isRTL
            ? 'آپ کا پیغام کامیابی کے ساتھ ارسال کر دیا گیا ہے۔ شکریہ!'
            : 'Your message has been sent successfully. Thank you!')
      );
      setFormData({
        name: '',
        email: '',
        subject: '',
        message: '',
      });
    } catch (err) {
      setActionError(
        err?.response?.data?.message ||
          err?.message ||
          (isRTL
            ? 'پیغام بھیجنے میں خرابی پیش آئی ہے۔ براہ کرم دوبارہ کوشش کریں۔'
            : 'Failed to send message. Please try again.')
      );
    } finally {
      setActionLoading(false);
    }
  };

  // Contacts fallback defaults with safe optional chaining
  const address =
    settings?.contactInfo?.address ||
    (isRTL
      ? 'جامعہ دار العلوم و الافتاء، کراچی، پاکستان'
      : 'Jamia Darul Uloom & Ifta, Karachi, Pakistan');

  const phone = settings?.contactInfo?.phone || '+92 300 1234567';
  const whatsapp = settings?.contactInfo?.whatsapp || '+92 300 1234567';
  const email = settings?.contactInfo?.email || 'contact@fikr-e-islam.com';
  const socialLinks = settings?.socialLinks || {};

  return (
    <div
      className="min-h-screen font-sans"
      style={{ backgroundColor: COLORS?.background }}
      dir={isRTL ? 'rtl' : 'ltr'}
    >
      {/* ══════════════════════════════════════════════════
          1. HERO HEADER — Contact & Inquiries Masthead
      ══════════════════════════════════════════════════ */}
      <div
        className="w-full py-10 sm:py-14 px-4 text-white"
        style={{
          background: `linear-gradient(135deg, ${COLORS?.primary} 0%, #20140b 100%)`,
        }}
      >
        <div className="max-w-5xl mx-auto text-center">
          <div
            className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full text-xs font-bold uppercase tracking-widest mb-3"
            style={{
              backgroundColor: `${COLORS?.accent}25`,
              color: COLORS?.accent,
            }}
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>{isRTL ? 'رابطہ و مراسلت' : 'GET IN TOUCH'}</span>
          </div>

          <h1 className="text-xl sm:text-2xl font-bold font-serif mb-3 leading-snug text-white">
            {isRTL ? 'رابطہ کی تفصیلات اور پیغام' : 'Contact Details & Inquiries'}
          </h1>
          <p
            className="text-xs sm:text-sm max-w-2xl mx-auto leading-relaxed"
            style={{ color: `${COLORS?.accent}cc` }}
          >
            {isRTL
              ? 'علمی سوالات، فتاویٰ کی تصدیق، کتب، دروس یا سیمینار کے دعوت ناموں سے متعلق ہم سے رابطہ کریں۔'
              : 'Feel free to reach out regarding academic inquiries, fatwa verifications, invitations, or book distribution.'}
          </p>
        </div>
      </div>

      {/* ══════════════════════════════════════════════════
          2. MAIN CONTENT — 2-COLUMN LAYOUT
      ══════════════════════════════════════════════════ */}
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-8 items-start">
          {/* ──────────────────────────────────────────────────
              LEFT / SIDEBAR: Contact Info Cards (5 Columns)
          ────────────────────────────────────────────────── */}
          <div className="lg:col-span-5 space-y-4">
            {/* Address Card */}
            <div
              className="rounded-2xl p-5 border shadow-xs transition-shadow hover:shadow-md"
              style={{
                backgroundColor: COLORS?.white,
                borderColor: COLORS?.border,
              }}
            >
              <div className="flex items-start gap-3.5">
                <div
                  className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0 shadow-xs"
                  style={{
                    backgroundColor: COLORS?.secondary,
                    color: COLORS?.primary,
                  }}
                >
                  <MapPin className="w-5 h-5" />
                </div>
                <div className="flex-1 min-w-0">
                  <span
                    className="block text-[11px] font-bold uppercase tracking-wider"
                    style={{ color: COLORS?.textSecondary }}
                  >
                    {isRTL ? 'مرکزی پتہ / دفتر' : 'Office Address'}
                  </span>
                  <p
                    className="text-xs sm:text-sm mt-1 leading-relaxed font-serif"
                    style={{ color: COLORS?.textPrimary }}
                  >
                    {address}
                  </p>
                </div>
              </div>
            </div>

            {/* Phone & WhatsApp Card */}
            <div
              className="rounded-2xl p-5 border shadow-xs transition-shadow hover:shadow-md"
              style={{
                backgroundColor: COLORS?.white,
                borderColor: COLORS?.border,
              }}
            >
              <div className="flex items-start gap-3.5">
                <div
                  className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0 shadow-xs"
                  style={{
                    backgroundColor: COLORS?.secondary,
                    color: COLORS?.primary,
                  }}
                >
                  <Phone className="w-5 h-5" />
                </div>
                <div className="flex-1 min-w-0">
                  <span
                    className="block text-[11px] font-bold uppercase tracking-wider"
                    style={{ color: COLORS?.textSecondary }}
                  >
                    {isRTL ? 'فون نمبر اور واٹس ایپ' : 'Phone & WhatsApp'}
                  </span>
                  <div className="mt-1 space-y-1">
                    {phone && (
                      <p
                        className="text-xs sm:text-sm font-semibold dir-ltr text-right"
                        style={{ color: COLORS?.textPrimary }}
                      >
                        {phone}
                      </p>
                    )}
                    {whatsapp && (
                      <a
                        href={`https://wa.me/${whatsapp.replace(/[^0-9]/g, '')}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1.5 text-xs font-bold transition-opacity hover:opacity-80"
                        style={{ color: '#16a34a' }}
                      >
                        <span>{isRTL ? 'واٹس ایپ پر رابطہ کریں' : 'Chat on WhatsApp'}</span>
                        <ExternalLink className="w-3 h-3" />
                      </a>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Email Card */}
            <div
              className="rounded-2xl p-5 border shadow-xs transition-shadow hover:shadow-md"
              style={{
                backgroundColor: COLORS?.white,
                borderColor: COLORS?.border,
              }}
            >
              <div className="flex items-start gap-3.5">
                <div
                  className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0 shadow-xs"
                  style={{
                    backgroundColor: COLORS?.secondary,
                    color: COLORS?.primary,
                  }}
                >
                  <Mail className="w-5 h-5" />
                </div>
                <div className="flex-1 min-w-0">
                  <span
                    className="block text-[11px] font-bold uppercase tracking-wider"
                    style={{ color: COLORS?.textSecondary }}
                  >
                    {isRTL ? 'سرکاری ای میل ایڈریس' : 'Official Email'}
                  </span>
                  <a
                    href={`mailto:${email}`}
                    className="text-xs sm:text-sm mt-1 block font-semibold hover:underline truncate"
                    style={{ color: COLORS?.primary }}
                  >
                    {email}
                  </a>
                </div>
              </div>
            </div>

            {/* Social Media Channels */}
            <div
              className="rounded-2xl p-5 border shadow-xs"
              style={{
                background: `linear-gradient(135deg, ${COLORS?.primary} 0%, #20140b 100%)`,
                borderColor: COLORS?.border,
                color: '#ffffff',
              }}
            >
              <h3 className="font-bold text-sm font-serif mb-1 text-white flex items-center gap-2">
                <Globe className="w-4 h-4 text-accent" />
                <span>{isRTL ? 'سوشل میڈیا روابط' : 'Social Channels'}</span>
              </h3>
              <p className="text-xs text-white/80 mb-3.5 leading-relaxed font-light">
                {isRTL
                  ? 'تازہ ترین بیانات، فتاویٰ اور علمی پیغامات کے لیے ہمارے چینلز کو فالو کریں۔'
                  : 'Follow our official channels for regular updates, videos, and lectures.'}
              </p>

              <div className="flex items-center gap-2 flex-wrap">
                {socialLinks?.facebook && (
                  <a
                    href={socialLinks.facebook}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-9 h-9 rounded-xl flex items-center justify-center transition-all hover:scale-105 border"
                    style={{
                      backgroundColor: 'rgba(255,255,255,0.1)',
                      borderColor: 'rgba(255,255,255,0.2)',
                      color: '#ffffff',
                    }}
                    title="Facebook"
                  >
                    <Facebook className="w-4 h-4" />
                  </a>
                )}
                {socialLinks?.youtube && (
                  <a
                    href={socialLinks.youtube}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-9 h-9 rounded-xl flex items-center justify-center transition-all hover:scale-105 border"
                    style={{
                      backgroundColor: 'rgba(255,255,255,0.1)',
                      borderColor: 'rgba(255,255,255,0.2)',
                      color: '#ffffff',
                    }}
                    title="YouTube"
                  >
                    <Youtube className="w-4 h-4" />
                  </a>
                )}
                {socialLinks?.twitter && (
                  <a
                    href={socialLinks.twitter}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-9 h-9 rounded-xl flex items-center justify-center transition-all hover:scale-105 border"
                    style={{
                      backgroundColor: 'rgba(255,255,255,0.1)',
                      borderColor: 'rgba(255,255,255,0.2)',
                      color: '#ffffff',
                    }}
                    title="Twitter / X"
                  >
                    <Twitter className="w-4 h-4" />
                  </a>
                )}
                {socialLinks?.instagram && (
                  <a
                    href={socialLinks.instagram}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-9 h-9 rounded-xl flex items-center justify-center transition-all hover:scale-105 border"
                    style={{
                      backgroundColor: 'rgba(255,255,255,0.1)',
                      borderColor: 'rgba(255,255,255,0.2)',
                      color: '#ffffff',
                    }}
                    title="Instagram"
                  >
                    <Instagram className="w-4 h-4" />
                  </a>
                )}
              </div>
            </div>
          </div>

          {/* ──────────────────────────────────────────────────
              RIGHT: Message Submission Form (7 Columns)
          ────────────────────────────────────────────────── */}
          <div className="lg:col-span-7">
            {success ? (
              <div
                className="rounded-2xl p-8 sm:p-12 text-center flex flex-col items-center justify-center min-h-[420px] border shadow-xs"
                style={{
                  backgroundColor: COLORS?.white,
                  borderColor: COLORS?.border,
                }}
              >
                <div
                  className="w-16 h-16 rounded-full flex items-center justify-center mb-4 shadow-xs"
                  style={{
                    backgroundColor: `${COLORS?.primary}15`,
                    color: COLORS?.primary,
                  }}
                >
                  <CheckCircle2 className="w-8 h-8" style={{ color: COLORS?.accent }} />
                </div>
                <h2
                  className="text-lg sm:text-xl font-bold font-serif mb-2"
                  style={{ color: COLORS?.primary }}
                >
                  {isRTL ? 'پیغام موصول ہو گیا' : 'Message Received'}
                </h2>
                <p
                  className="text-xs sm:text-sm leading-relaxed max-w-md mb-6"
                  style={{ color: COLORS?.textSecondary }}
                >
                  {successMsg}
                  <br />
                  {isRTL
                    ? 'ہمارا انتظامی عملہ جلد از جلد جائزہ لے کر آپ سے رابطہ کرے گا۔'
                    : 'Our administration will review your request and get back to you shortly.'}
                </p>
                <button
                  type="button"
                  onClick={() => setSuccess(false)}
                  className="px-6 py-2.5 rounded-xl text-xs font-bold text-white shadow-sm transition-transform hover:scale-105 cursor-pointer"
                  style={{ backgroundColor: COLORS?.primary }}
                >
                  {isRTL ? 'ایک اور پیغام بھیجیں' : 'Send Another Message'}
                </button>
              </div>
            ) : (
              <div
                className="rounded-2xl p-6 sm:p-8 border shadow-xs"
                style={{
                  backgroundColor: COLORS?.white,
                  borderColor: COLORS?.border,
                }}
              >
                {/* Form Heading */}
                <div
                  className="pb-4 mb-5 border-b flex items-center justify-between"
                  style={{ borderColor: `${COLORS?.border}90` }}
                >
                  <div className="flex items-center gap-2.5">
                    <div
                      className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0"
                      style={{
                        backgroundColor: `${COLORS?.primary}12`,
                        color: COLORS?.primary,
                      }}
                    >
                      <MessageSquare className="w-4 h-4" />
                    </div>
                    <h2
                      className="text-sm sm:text-base font-bold font-serif"
                      style={{ color: COLORS?.primary }}
                    >
                      {isRTL ? 'براہ راست پیغام بھیجیں' : 'Send a Message'}
                    </h2>
                  </div>
                  <span
                    className="text-[11px] font-medium"
                    style={{ color: COLORS?.textSecondary }}
                  >
                    {isRTL ? 'تمام خانے لازمی ہیں' : 'All fields required'}
                  </span>
                </div>

                <form onSubmit={handleFormSubmit} className="space-y-4">
                  {/* Alert error */}
                  {actionError && (
                    <div className="bg-red-50 border border-red-400 text-red-700 p-3.5 rounded-xl text-xs flex items-center gap-2.5 text-right">
                      <AlertTriangle className="w-4 h-4 shrink-0" />
                      <span>{actionError}</span>
                    </div>
                  )}

                  {/* Name & Email Row */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label
                        className="block text-xs font-bold uppercase tracking-wider mb-1.5"
                        style={{ color: COLORS?.textPrimary }}
                      >
                        {isRTL ? 'آپ کا نام *' : 'Your Name *'}
                      </label>
                      <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleInputChange}
                        required
                        placeholder={isRTL ? 'مثال: محمد عبداللہ' : 'e.g. Abdullah'}
                        className="w-full px-3.5 py-2.5 text-xs sm:text-sm rounded-xl border outline-none transition-all focus:border-primary"
                        style={{
                          borderColor: COLORS?.border,
                          backgroundColor: COLORS?.background,
                          color: COLORS?.textPrimary,
                        }}
                      />
                    </div>

                    <div>
                      <label
                        className="block text-xs font-bold uppercase tracking-wider mb-1.5"
                        style={{ color: COLORS?.textPrimary }}
                      >
                        {isRTL ? 'آپ کا ای میل ایڈریس *' : 'Your Email *'}
                      </label>
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        required
                        placeholder="abdullah@example.com"
                        className="w-full px-3.5 py-2.5 text-xs sm:text-sm rounded-xl border outline-none transition-all focus:border-primary"
                        style={{
                          borderColor: COLORS?.border,
                          backgroundColor: COLORS?.background,
                          color: COLORS?.textPrimary,
                        }}
                      />
                    </div>
                  </div>

                  {/* Subject */}
                  <div>
                    <label
                      className="block text-xs font-bold uppercase tracking-wider mb-1.5"
                      style={{ color: COLORS?.textPrimary }}
                    >
                      {isRTL ? 'پیغام کا موضوع *' : 'Subject *'}
                    </label>
                    <input
                      type="text"
                      name="subject"
                      value={formData.subject}
                      onChange={handleInputChange}
                      required
                      placeholder={
                        isRTL
                          ? 'مثال: علمی سوال / سیمینار کی دعوت / کتب کی طلب'
                          : 'e.g. Academic Inquiry / Lecture Invitation'
                      }
                      className="w-full px-3.5 py-2.5 text-xs sm:text-sm rounded-xl border outline-none transition-all focus:border-primary"
                      style={{
                        borderColor: COLORS?.border,
                        backgroundColor: COLORS?.background,
                        color: COLORS?.textPrimary,
                      }}
                    />
                  </div>

                  {/* Message */}
                  <div>
                    <label
                      className="block text-xs font-bold uppercase tracking-wider mb-1.5"
                      style={{ color: COLORS?.textPrimary }}
                    >
                      {isRTL ? 'آپ کا پیغام / تفصیل *' : 'Your Message *'}
                    </label>
                    <textarea
                      name="message"
                      value={formData.message}
                      onChange={handleInputChange}
                      required
                      rows={5}
                      placeholder={
                        isRTL
                          ? 'اپنا تفصیلی پیغام یا سوال یہاں تحریر کریں...'
                          : 'Type your message or inquiry here...'
                      }
                      className="w-full px-3.5 py-2.5 text-xs sm:text-sm rounded-xl border outline-none transition-all focus:border-primary resize-y leading-relaxed"
                      style={{
                        borderColor: COLORS?.border,
                        backgroundColor: COLORS?.background,
                        color: COLORS?.textPrimary,
                      }}
                    />
                  </div>

                  {/* Submit Button */}
                  <div className="pt-2">
                    <button
                      type="submit"
                      disabled={actionLoading}
                      className="w-full flex items-center justify-center gap-2 py-3 rounded-xl text-white font-bold text-xs sm:text-sm transition-transform hover:scale-[1.01] shadow-sm disabled:opacity-50 cursor-pointer"
                      style={{ backgroundColor: COLORS?.primary }}
                    >
                      <Send className="w-4 h-4 text-accent" />
                      <span>
                        {actionLoading
                          ? isRTL
                            ? 'پیغام بھیجا جا رہا ہے...'
                            : 'Sending...'
                          : isRTL
                          ? 'پیغام ارسال کریں'
                          : 'Send Message'}
                      </span>
                    </button>
                  </div>
                </form>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
