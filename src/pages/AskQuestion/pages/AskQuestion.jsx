import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate, Link } from 'react-router-dom';
import { HelpCircle, CheckCircle, AlertTriangle, Send, User, Mail, Phone, Lock, ArrowRight, ArrowLeft } from 'lucide-react';
import { submitQuestion } from '@/services';
import { useSettings } from '@/hooks/useSettings';
import { Input } from '../../../components/Input';
import { QA_CATEGORIES } from '@/utils/categories';

/* ── Theme Colors ── */
const PALETTE = {
  primary: '#7B654D',      // Elegant brown
  secondary: '#E5D8CA',    // Light beige
  background: '#FAF7F2',   // Warm off-white
  text: '#2D2A26',         // Dark text
  border: '#E8E2DA',       // Warm border
  white: '#FFFFFF',
};

export default function AskQuestion() {
  const navigate = useNavigate();
  const { settings } = useSettings();
  const { isAuthenticated, loggedInUser } = useSelector((s) => s.auth);

  const language = settings?.language === 'ur' || settings?.language === 'Urdu' ? 'ur' : 'en';

  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phoneNumber: '',
    category: 'General Questions',
    questionTitle: '',
    detailedQuestion: '',
  });

  const [actionLoading, setActionLoading] = useState(false);
  const [actionError, setActionError] = useState(null);
  const [success, setSuccess] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');

  // Auto-populate logged in user info
  useEffect(() => {
    if (isAuthenticated && loggedInUser) {
      setFormData((prev) => ({
        ...prev,
        fullName: loggedInUser.name || '',
        email: loggedInUser.loginEmail || loggedInUser.email || '',
        phoneNumber: loggedInUser.loginPhone || loggedInUser.contactPhone || '',
      }));
    }
  }, [isAuthenticated, loggedInUser]);

  const categories = QA_CATEGORIES;

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    setActionError(null);

    if (!isAuthenticated) {
      navigate('/login');
      return;
    }

    if (!formData.fullName || !formData.email || !formData.questionTitle || !formData.detailedQuestion) {
      return;
    }

    try {
      setActionLoading(true);
      const result = await submitQuestion(formData);
      setSuccess(true);
      setSuccessMsg(result.message || (language === 'en' ? 'Your question has been submitted successfully.' : 'آپ کا سوال کامیابی کے ساتھ جمع کرا دیا گیا ہے۔'));
      setFormData({
        fullName: loggedInUser?.name || '',
        email: loggedInUser?.loginEmail || loggedInUser?.email || '',
        phoneNumber: loggedInUser?.loginPhone || loggedInUser?.contactPhone || '',
        category: 'General Questions',
        questionTitle: '',
        detailedQuestion: '',
      });
    } catch (err) {
      setActionError(err.response?.data?.message || err.message || 'Failed to submit question');
    } finally {
      setActionLoading(false);
    }
  };

  const t = {
    en: {
      askQuestion: "Ask Question",
      subtitle: "Send your query directly to the scholar/mufti",
      loginRequired: "You must be signed in to submit a question to the scholar.",
      loginBtn: "Sign In to Ask a Question",
      successTitle: "Question Submitted",
      askAnother: "Ask Another Question",
      fullName: "Full Name *",
      email: "Email Address *",
      phone: "Phone Number (Optional)",
      category: "Select Category *",
      title: "Question Title *",
      titlePlaceholder: "e.g. Zakat calculation on retirement funds",
      detail: "Detailed Question *",
      detailPlaceholder: "Provide all relevant details to explain your query to the scholar...",
      sendBtn: "Send to Scholar",
      sending: "Sending question...",
      backPortal: "Back to Official Portal"
    },
    ur: {
      askQuestion: "سوال پوچھیں",
      subtitle: "اپنا سوال براہِ راست عالم/مفتی صاحب کو ارسال کریں",
      loginRequired: "عالم صاحب کو سوال ارسال کرنے کے لیے آپ کا لاگ ان ہونا ضروری ہے۔",
      loginBtn: "سوال پوچھنے کے لیے لاگ ان کریں",
      successTitle: "سوال موصول ہو گیا",
      askAnother: "ایک اور سوال پوچھیں",
      fullName: "مکمل نام *",
      email: "ای میل ایڈریس *",
      phone: "فون نمبر (اختیاری)",
      category: "زمرہ منتخب کریں *",
      title: "سوال کا عنوان *",
      titlePlaceholder: "مثال: ریٹائرمنٹ فنڈز پر زکوٰۃ کا حساب",
      detail: "تفصیلی سوال *",
      detailPlaceholder: "عالم صاحب کو اپنا مسئلہ سمجھانے کے لیے تمام متعلقہ تفصیلات فراہم کریں...",
      sendBtn: "عالم صاحب کو بھیجیں",
      sending: "سوال بھیجا جا رہا ہے...",
      backPortal: "سرکاری پورٹل پر واپس جائیں"
    }
  }[language === 'ur' ? 'ur' : 'en'];

  return (
    <div className={`py-12 min-h-screen ${language === 'ur' ? 'text-right' : 'text-left'}`} style={{ backgroundColor: PALETTE.background }} dir={language === 'ur' ? 'rtl' : 'ltr'}>
      <div className="w-full px-4 sm:px-8 lg:px-12">

        {/* Back Link */}
        <Link
          to="/"
          className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider mb-6 transition-all hover:opacity-85"
          style={{ color: PALETTE.primary }}
        >
          {language === 'en' ? <ArrowLeft className="w-4 h-4" /> : <ArrowRight className="w-4 h-4" />}
          {t.backPortal}
        </Link>

        {/* Success Banner */}
        {success ? (
          <div className="bg-white border rounded-2xl p-10 text-center shadow-xs" style={{ borderColor: PALETTE.border }}>
            <CheckCircle className="w-16 h-16 text-emerald-600 mx-auto mb-4" />
            <h2 className="text-2xl font-bold font-serif mb-3" style={{ color: PALETTE.primary }}>
              {t.successTitle}
            </h2>
            <p className="text-slate-700 text-sm leading-relaxed mb-6 font-medium">{successMsg}</p>
            <button
              onClick={() => setSuccess(false)}
              className="px-6 py-2.5 text-white font-bold text-xs uppercase tracking-wider rounded-md transition-all cursor-pointer border-0"
              style={{ backgroundColor: PALETTE.primary }}
            >
              {t.askAnother}
            </button>
          </div>
        ) : (
          <div className="bg-white border rounded-2xl shadow-xs overflow-hidden" style={{ borderColor: PALETTE.border }}>

            {/* Header Banner */}
            <div
              style={{ backgroundColor: PALETTE.primary, borderColor: PALETTE.border }}
              className="text-white p-6 sm:p-8 border-b-2 flex items-center gap-4"
            >
              <div className="w-12 h-12 bg-white/10 rounded-full flex items-center justify-center border border-white/20 shrink-0">
                <HelpCircle className="w-6 h-6 text-[#E5D8CA]" />
              </div>
              <div>
                <h1 className="text-xl sm:text-2xl font-bold font-serif">
                  {t.askQuestion}
                </h1>
                <p className="text-xs text-slate-200 mt-1 font-bold">
                  {t.subtitle}
                </p>
              </div>
            </div>

            {/* Main authentication block check */}
            {!isAuthenticated ? (
              <div className="p-8 text-center bg-slate-50/50">
                <Lock className="w-12 h-12 mx-auto mb-3 text-slate-400" />
                <p className="text-sm font-bold text-slate-800 mb-5 leading-relaxed">
                  {t.loginRequired}
                </p>
                <button
                  onClick={() => navigate('/login')}
                  className="px-6 py-3 text-white font-bold text-xs uppercase tracking-wider rounded-lg transition-all cursor-pointer border-0"
                  style={{ backgroundColor: PALETTE.primary }}
                >
                  {t.loginBtn}
                </button>
              </div>
            ) : (
              /* Form Fields (Full width, clean borders, no animations) */
              <form onSubmit={handleFormSubmit} className="p-6 sm:p-8 space-y-6">

                {actionError && (
                  <div className="bg-red-50 border-r-4 border-red-500 p-4 flex items-start gap-2.5 text-red-700 text-xs rounded">
                    <AlertTriangle className="w-4.5 h-4.5 shrink-0 mt-0.5" />
                    <span className="font-bold">{actionError}</span>
                  </div>
                )}

                {/* Grid for Name, Email and Phone */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                  {/* Full Name */}
                  <div>
                    <label className="block text-xs font-bold text-slate-600 uppercase mb-2">
                      {t.fullName}
                    </label>
                    <div className="flex items-center gap-2 px-3 py-2 border bg-slate-50/80 rounded" style={{ borderColor: PALETTE.border }}>
                      <User className="w-4 h-4 text-slate-400 shrink-0" />
                      <input
                        type="text"
                        name="fullName"
                        value={formData.fullName}
                        onChange={handleInputChange}
                        required
                        disabled
                        className="w-full text-sm outline-none bg-transparent text-slate-700 font-bold"
                      />
                    </div>
                  </div>

                  {/* Email */}
                  <div>
                    <label className="block text-xs font-bold text-slate-600 uppercase mb-2">
                      {t.email}
                    </label>
                    <div className="flex items-center gap-2 px-3 py-2 border bg-slate-50/80 rounded" style={{ borderColor: PALETTE.border }}>
                      <Mail className="w-4 h-4 text-slate-400 shrink-0" />
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        required
                        disabled
                        className="w-full text-sm outline-none bg-transparent text-slate-700 font-bold"
                      />
                    </div>
                  </div>

                  {/* Phone */}
                  <div>
                    <label className="block text-xs font-bold text-slate-600 uppercase mb-2">
                      {t.phone}
                    </label>
                    <div className="flex items-center gap-2 px-3 py-2 border rounded bg-white" style={{ borderColor: PALETTE.border }}>
                      <Phone className="w-4 h-4 text-slate-400 shrink-0" />
                      <input
                        type="text"
                        name="phoneNumber"
                        value={formData.phoneNumber}
                        onChange={handleInputChange}
                        className="w-full text-sm outline-none bg-transparent text-slate-800 font-bold"
                      />
                    </div>
                  </div>
                </div>

                {/* Category selection */}
                <div>
                  <label className="block text-xs font-bold text-slate-600 uppercase mb-2">
                    {t.category}
                  </label>
                  <select
                    name="category"
                    value={formData.category}
                    onChange={handleInputChange}
                    required
                    className="w-full px-3 py-2.5 text-sm bg-white border rounded outline-none text-slate-700 font-bold focus:border-stone-500 transition-colors"
                    style={{ borderColor: PALETTE.border }}
                  >
                    {categories.map((cat) => (
                      <option key={cat.value} value={cat.value}>
                        {language === 'ur' ? cat.labelUr : cat.labelEn}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Question Title */}
                <div>
                  <label className="block text-xs font-bold text-slate-600 uppercase mb-2">
                    {t.title}
                  </label>
                  <input
                    type="text"
                    name="questionTitle"
                    value={formData.questionTitle}
                    onChange={handleInputChange}
                    required
                    placeholder={t.titlePlaceholder}
                    className="w-full px-3 py-2.5 text-sm bg-white border rounded outline-none text-slate-800 font-bold focus:border-stone-500 transition-colors"
                    style={{ borderColor: PALETTE.border }}
                  />
                </div>

                {/* Question Detail */}
                <div>
                  <label className="block text-xs font-bold text-slate-600 uppercase mb-2">
                    {t.detail}
                  </label>
                  <textarea
                    name="detailedQuestion"
                    value={formData.detailedQuestion}
                    onChange={handleInputChange}
                    required
                    placeholder={t.detailPlaceholder}
                    rows={6}
                    className="w-full px-3 py-2.5 text-sm bg-white border rounded outline-none text-slate-800 font-bold focus:border-stone-500 transition-colors resize-y leading-relaxed"
                    style={{ borderColor: PALETTE.border }}
                  />
                </div>

                {/* Submit Action */}
                <div className="pt-2">
                  <button
                    type="submit"
                    disabled={actionLoading}
                    className="w-full flex items-center justify-center gap-2 py-3.5 text-white font-bold rounded shadow-xs transition-colors text-sm disabled:opacity-50 border-0 cursor-pointer"
                    style={{ backgroundColor: PALETTE.primary }}
                  >
                    <Send className="w-4 h-4" />
                    {actionLoading ? t.sending : t.sendBtn}
                  </button>
                </div>

              </form>
            )}
          </div>
        )}

      </div>
    </div>
  );
}
