import React, { useState } from "react";
import {
  Mail,
  Phone,
  MapPin,
  Send,
  MessageSquareCode,
  CheckCircle2,
  AlertTriangle,
  Facebook,
  Youtube,
  Twitter,
  Instagram,
} from "lucide-react";
import { submitContact } from "@/services";
import { useSettings } from "@/hooks/useSettings";
import { Input } from "../../../components/Input";

export default function ContactPage() {
  const { settings } = useSettings();
  const language =
    settings?.language === "ur" || settings?.language === "Urdu" ? "ur" : "en";

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });

  const [actionLoading, setActionLoading] = useState(false);
  const [actionError, setActionError] = useState(null);
  const [success, setSuccess] = useState(false);
  const [successMsg, setSuccessMsg] = useState("");

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    setActionError(null);

    if (
      !formData.name ||
      !formData.email ||
      !formData.subject ||
      !formData.message
    ) {
      return;
    }

    try {
      setActionLoading(true);
      const result = await submitContact(formData);
      setSuccess(true);
      setSuccessMsg(
        result.message ||
          (language === "en"
            ? "Your message has been submitted successfully."
            : "آپ کا پیغام کامیابی کے ساتھ درج کر لیا گیا ہے۔")
      );
      setFormData({
        name: "",
        email: "",
        subject: "",
        message: "",
      });
    } catch (err) {
      setActionError(
        err.response?.data?.message ||
          err.message ||
          "Failed to submit contact request"
      );
    } finally {
      setActionLoading(false);
    }
  };

  // Contacts fallback defaults
  const address = settings?.contactInfo?.address || "";
  const phone = settings?.contactInfo?.phone || "";
  const whatsapp = settings?.contactInfo?.whatsapp || "";
  const email = settings?.contactInfo?.email || "";
  const socialLinks = settings?.socialLinks || {};

  return (
    <div
      className={`bg-background dark:bg-slate-900 py-12 min-h-screen ${language === "ur" ? "text-right" : "text-left"}`}
      dir={language === "ur" ? "rtl" : "ltr"}
    >
      <div className=" mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 lg:grid-cols-12 gap-10">
        {/* Left Side: Contact Information Cards (5 columns) */}
        <div
          className={`lg:col-span-5 space-y-6 ${language === "ur" ? "text-right" : "text-left"}`}
        >
          <div>
            <span
              className={`text-xs font-bold text-accent dark:text-amber-500 uppercase tracking-widest block mb-1 font-serif ${language === "ur" ? "text-right" : "text-left"}`}
            >
              {language === "en" ? "Contact Us" : "رابطہ کریں"}
            </span>
            <h1
              className={`text-3xl font-extrabold text-primary dark:text-accent font-serif tracking-wide ${language === "ur" ? "text-right" : "text-left"}`}
            >
              {language === "en" ? "Contact Details" : "رابطے کی تفصیلات"}
            </h1>
            <p
              className={`text-slate-550 dark:text-slate-400 text-sm font-light mt-2 leading-relaxed ${language === "ur" ? "text-right" : "text-left"}`}
            >
              {language === "en"
                ? "If you have any questions about fatwas, books, invitations, or lectures, contact us through the official contact portal."
                : "اگر آپ کے پاس فتاویٰ، کتب، دعوت ناموں یا خطابات کے بارے میں کوئی سوال ہے تو سرکاری رابطہ پورٹل کے ذریعے رابطہ کریں۔"}
            </p>
          </div>

          <div className="premium-card p-6 space-y-6">
            {/* Address */}
            <div
              className={`flex gap-4 items-start ${language === "ur" ? "flex-row" : "flex-row-reverse"}`}
            >
              <div className="p-2.5 rounded bg-primary/5 dark:bg-amber-950/20 text-primary dark:text-accent border border-primary/10 dark:border-accent/20 shrink-0">
                <MapPin className="w-5 h-5" />
              </div>
              <div
                className={`flex-grow ${language === "ur" ? "text-right" : "text-left"}`}
              >
                <span className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase">
                  {language === "en" ? "Office Address" : "دفتر کا پتہ"}
                </span>
                <p className="text-slate-700 dark:text-slate-350 text-sm mt-1 leading-relaxed font-light">
                  {address}
                </p>
              </div>
            </div>

            {/* Phone */}
            <div
              className={`flex gap-4 items-start ${language === "ur" ? "flex-row" : "flex-row-reverse"}`}
            >
              <div className="p-2.5 rounded bg-primary/5 dark:bg-amber-950/20 text-primary dark:text-accent border border-primary/10 dark:border-accent/20 shrink-0">
                <Phone className="w-5 h-5" />
              </div>
              <div
                className={`flex-grow ${language === "ur" ? "text-right" : "text-left"}`}
              >
                <span className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase">
                  {language === "en" ? "Phone Numbers" : "فون نمبرز"}
                </span>
                <p className="text-slate-700 dark:text-slate-350 text-sm mt-1 font-light">
                  {language === "en" ? "Office:" : "دفتر:"} {phone}
                </p>
                {whatsapp && (
                  <p className="text-accent dark:text-amber-400 text-xs font-semibold mt-1">
                    {language === "en" ? "WhatsApp Link:" : "واٹس ایپ لنک:"}{" "}
                    {whatsapp}
                  </p>
                )}
              </div>
            </div>

            {/* Email */}
            <div
              className={`flex gap-4 items-start ${language === "ur" ? "flex-row" : "flex-row-reverse"}`}
            >
              <div className="p-2.5 rounded bg-primary/5 dark:bg-amber-950/20 text-primary dark:text-accent border border-primary/10 dark:border-accent/20 shrink-0">
                <Mail className="w-5 h-5" />
              </div>
              <div
                className={`flex-grow ${language === "ur" ? "text-right" : "text-left"}`}
              >
                <span className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase">
                  {language === "en" ? "Email Address" : "ای میل ایڈریس"}
                </span>
                <p className="text-slate-700 dark:text-slate-350 text-sm mt-1 font-light">
                  {email}
                </p>
              </div>
            </div>
          </div>

          {/* Social icons */}
          <div className="bg-primary islamic-pattern text-white p-6 rounded-lg border border-accent/35 relative overflow-hidden shadow-sm">
            <h3 className="font-bold text-md mb-3 font-serif">
              {language === "en"
                ? "Connect on Social Media"
                : "سوشل میڈیا پر جڑیں"}
            </h3>
            <p className="text-xs text-slate-300 mb-4 font-light">
              {language === "en"
                ? "Follow our social media pages for regular video sermons and updates."
                : "باقاعدہ ویڈیو بیانات اور اپ ڈیٹس کے لیے ہمارے سوشل میڈیا پیجز فالو کریں۔"}
            </p>
            <div className="flex items-center gap-2.5 relative z-10 justify-start">
              {socialLinks.facebook && (
                <a
                  href={socialLinks.facebook}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2.5 rounded bg-primary text-accent hover:bg-primary border border-accent/30 transition-colors"
                >
                  <Facebook className="w-4 h-4" />
                </a>
              )}
              {socialLinks.youtube && (
                <a
                  href={socialLinks.youtube}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2.5 rounded bg-primary text-accent hover:bg-primary border border-accent/30 transition-colors"
                >
                  <Youtube className="w-4 h-4" />
                </a>
              )}
              {socialLinks.twitter && (
                <a
                  href={socialLinks.twitter}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2.5 rounded bg-primary text-accent hover:bg-primary border border-accent/30 transition-colors"
                >
                  <Twitter className="w-4 h-4" />
                </a>
              )}
              {socialLinks.instagram && (
                <a
                  href={socialLinks.instagram}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2.5 rounded bg-primary text-accent hover:bg-primary border border-accent/30 transition-colors"
                >
                  <Instagram className="w-4 h-4" />
                </a>
              )}
            </div>
          </div>
        </div>

        {/* Right Side: Message Submission Form (7 columns) */}
        <div className="lg:col-span-7">
          {success ? (
            <div className="premium-card p-10 shadow-sm text-center flex flex-col items-center justify-center min-h-[400px]">
              <CheckCircle2 className="w-16 h-16 text-accent dark:text-accent mb-4" />
              <h2 className="text-2xl font-bold text-primary dark:text-accent font-serif mb-3">
                {language === "en" ? "Message Received" : "پیغام موصول ہو گیا"}
              </h2>
              <p className="text-slate-700 dark:text-slate-400 text-sm leading-relaxed max-w-sm font-light mb-6">
                {successMsg}
                {language === "en"
                  ? " Our administrative office will review it and reply as soon as possible."
                  : " ہمارا انتظامی دفتر اس کا جائزہ لے گا اور جلد از جلد جواب دے گا۔"}
              </p>
              <button
                onClick={() => setSuccess(false)}
                className="px-5 py-2.5 bg-primary text-white text-xs font-bold rounded uppercase tracking-wider font-serif hover:bg-primary/90 transition-colors"
              >
                {language === "en"
                  ? "Send Another Message"
                  : "ایک اور پیغام بھیجیں"}
              </button>
            </div>
          ) : (
            <div className="premium-card shadow-sm p-6 sm:p-8">
              <h2
                className={`text-xl font-bold text-slate-900 dark:text-white font-serif mb-6 border-b border-slate-100 dark:border-slate-750 pb-3 flex items-center gap-2 ${language === "ur" ? "flex-row-reverse text-right" : "flex-row text-left"}`}
              >
                <MessageSquareCode className="w-5 h-5 text-accent dark:text-amber-500" />
                {language === "en" ? "Send Message" : "پیغام بھیجیں"}
              </h2>

              <form onSubmit={handleFormSubmit} className="space-y-4">
                {/* Alert error */}
                {actionError && (
                  <div className="bg-red-50 dark:bg-red-950/20 border-r-4 border-red-500 p-4 flex items-start gap-2 text-red-700 dark:text-red-400 text-xs shrink-0">
                    <AlertTriangle className="w-4.5 h-4.5 shrink-0" />
                    <span>{actionError}</span>
                  </div>
                )}

                {/* Name & Email */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-600 dark:text-slate-400 uppercase mb-1">
                      {language === "en" ? "Your Name *" : "آپ کا نام *"}
                    </label>
                    <Input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      required
                      placeholder={
                        language === "en" ? "e.g. Abdullah" : "مثال: عبداللہ"
                      }
                      inputClassName={`w-full px-3 py-2 text-sm bg-slate-50 dark:bg-slate-900 border border-border dark:border-slate-700 text-slate-800 dark:text-white rounded outline-none focus:border-accent dark:focus:border-accent focus:bg-white dark:focus:bg-slate-900 transition-all placeholder:text-slate-400 ${language === "ur" ? "text-right" : "text-left"}`}
                      border=""
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-600 dark:text-slate-400 uppercase mb-1">
                      {language === "en"
                        ? "Your Email Address *"
                        : "آپ کا ای میل ایڈریس *"}
                    </label>
                    <Input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      required
                      placeholder="abdullah@example.com"
                      inputClassName={`w-full px-3 py-2 text-sm bg-slate-50 dark:bg-slate-900 border border-border dark:border-slate-700 text-slate-800 dark:text-white rounded outline-none focus:border-accent dark:focus:border-accent focus:bg-white dark:focus:bg-slate-900 transition-all placeholder:text-slate-400 ${language === "ur" ? "text-right" : "text-left"}`}
                      border=""
                    />
                  </div>
                </div>

                {/* Subject */}
                <div>
                  <label className="block text-xs font-bold text-slate-600 dark:text-slate-400 uppercase mb-1">
                    {language === "en" ? "Subject *" : "موضوع *"}
                  </label>
                  <Input
                    type="text"
                    name="subject"
                    value={formData.subject}
                    onChange={handleInputChange}
                    required
                    placeholder={
                      language === "en"
                        ? "e.g. Seminar Invitation"
                        : "مثال: سیمینار کی دعوت / فقہی سوال"
                    }
                    inputClassName={`w-full px-3 py-2 text-sm bg-slate-50 dark:bg-slate-900 border border-border dark:border-slate-700 text-slate-800 dark:text-white rounded outline-none focus:border-accent dark:focus:border-accent focus:bg-white dark:focus:bg-slate-900 transition-all placeholder:text-slate-400 ${language === "ur" ? "text-right" : "text-left"}`}
                    border=""
                  />
                </div>

                {/* Message */}
                <div>
                  <label className="block text-xs font-bold text-slate-600 dark:text-slate-400 uppercase mb-1">
                    {language === "en" ? "Your Message *" : "آپ کا پیغام *"}
                  </label>
                  <textarea
                    name="message"
                    value={formData.message}
                    onChange={handleInputChange}
                    required
                    placeholder={
                      language === "en"
                        ? "Write your message here..."
                        : "اپنا پیغام یہاں لکھیں..."
                    }
                    rows={6}
                    className={`w-full px-3 py-2 text-sm bg-slate-50 dark:bg-slate-900 border border-border dark:border-slate-700 text-slate-800 dark:text-white rounded outline-none focus:border-accent dark:focus:border-accent focus:bg-white dark:focus:bg-slate-900 transition-all resize-y placeholder:text-slate-400 ${language === "ur" ? "text-right" : "text-left"}`}
                  ></textarea>
                </div>

                {/* Submit button */}
                <div className="pt-2">
                  <button
                    type="submit"
                    disabled={actionLoading}
                    className="w-full flex items-center justify-center gap-2 py-3 bg-primary hover:bg-primary/90 dark:bg-primary dark:hover:bg-primary/90 text-white font-bold rounded shadow-sm transition-all uppercase tracking-wider font-serif text-sm disabled:opacity-50"
                  >
                    <Send className="w-4 h-4 text-accent" />
                    {actionLoading
                      ? language === "en"
                        ? "Sending message..."
                        : "پیغام بھیجا جا رہا ہے..."
                      : language === "en"
                        ? "Send Message"
                        : "پیغام بھیجیں"}
                  </button>
                </div>
              </form>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
