import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate, Link } from 'react-router-dom';
import {
  HelpCircle,
  CheckCircle,
  AlertTriangle,
  Send,
  User,
  Lock,
  ArrowRight,
  ShieldCheck,
} from 'lucide-react';
import { submitQuestion } from '@/services';
import { COLORS } from '@/utils/themeColors';
import Modal from '@/components/Modal/Modal';
import Login from '@/pages/Admin/pages/Login';
import Signup from '@/pages/Admin/pages/Signup';

export default function AskQuestion() {
  const navigate = useNavigate();
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authMode, setAuthMode] = useState('login'); // 'login' | 'signup'

  const openLogin = () => {
    setAuthMode('login');
    setIsAuthModalOpen(true);
  };

  const openSignup = () => {
    setAuthMode('signup');
    setIsAuthModalOpen(true);
  };

  const closeAuthModal = () => {
    setIsAuthModalOpen(false);
  };

  const { isAuthenticated, loggedInUser } = useSelector((s) => s.auth);

  useEffect(() => {
    if (isAuthenticated && isAuthModalOpen) {
      setIsAuthModalOpen(false);
    }
  }, [isAuthenticated, isAuthModalOpen]);

  const [formData, setFormData] = useState({
    questionTitle: '',
    detailedQuestion: '',
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

    if (!isAuthenticated) {
      openLogin();
      return;
    }

    if (!formData.questionTitle.trim() || !formData.detailedQuestion.trim()) {
      setActionError('براہ کرم سوال کا عنوان اور تفصیلی سوال دونوں درج کریں۔');
      return;
    }

    if (formData.questionTitle.trim().length > 150) {
      setActionError('سوال کا عنوان زیادہ سے زیادہ 150 حروف پر مشتمل ہو سکتا ہے۔');
      return;
    }

    try {
      setActionLoading(true);
      const result = await submitQuestion({
        questionTitle: formData.questionTitle.trim(),
        detailedQuestion: formData.detailedQuestion.trim(),
      });
      setSuccess(true);
      setSuccessMsg(
        result.message ||
          'آپ کا سوال کامیابی سے دار الافتاء کو ارسال کر دیا گیا ہے۔ جواب کے بعد آپ کو مطلع کر دیا جائے گا۔'
      );
      setFormData({
        questionTitle: '',
        detailedQuestion: '',
      });
    } catch (err) {
      setActionError(
        err?.response?.data?.message || err?.message || 'سوال بھیجنے میں ناکامی ہوئی'
      );
    } finally {
      setActionLoading(false);
    }
  };

  return (
    <div
      dir="rtl"
      className="py-8 md:py-12 min-h-screen"
      style={{ backgroundColor: COLORS.background }}
    >
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Back Link */}
        <div className="mb-4">
          <Link
            to="/qa"
            className="inline-flex items-center gap-1.5 text-xs font-bold transition-opacity hover:opacity-85"
            style={{ color: COLORS.primary }}
          >
            <ArrowRight className="w-4 h-4" />
            تمام سوال و جواب پر واپس جائیں
          </Link>
        </div>

        {/* Success Card */}
        {success ? (
          <div
            className="bg-white border rounded-2xl p-6 sm:p-10 text-center shadow-xs"
            style={{ borderColor: COLORS.border }}
          >
            <CheckCircle className="w-16 h-16 text-emerald-600 mx-auto mb-4" />
            <h2 className="text-xl sm:text-2xl font-bold font-['Noto_Nastaliq_Urdu'] mb-2" style={{ color: COLORS.primary }}>
              سوال کامیابی سے موصول ہو گیا
            </h2>
            <p className="text-slate-700 text-xs sm:text-sm leading-relaxed mb-6 font-medium max-w-md mx-auto">
              {successMsg}
            </p>
            <div className="flex flex-wrap items-center justify-center gap-3">
              <button
                type="button"
                onClick={() => setSuccess(false)}
                className="px-5 py-2.5 text-white font-bold text-xs uppercase tracking-wider rounded-lg transition-colors cursor-pointer"
                style={{ backgroundColor: COLORS.primary }}
              >
                ایک اور سوال پوچھیں
              </button>
              <Link
                to="/my-details"
                className="px-5 py-2.5 font-bold text-xs uppercase tracking-wider rounded-lg border transition-colors bg-slate-50 hover:bg-slate-100 text-slate-800"
                style={{ borderColor: COLORS.border }}
              >
                میرے پوچھے گئے سوالات دیکھیں
              </Link>
            </div>
          </div>
        ) : (
          <div
            className="bg-white border rounded-2xl shadow-xs overflow-hidden"
            style={{ borderColor: COLORS.border }}
          >
            {/* Header Banner (Font size max text-xl) */}
            <div
              style={{ backgroundColor: COLORS.primary }}
              className="text-white p-5 sm:p-7 flex items-center gap-4"
            >
              <div className="w-11 h-11 bg-white/10 rounded-2xl flex items-center justify-center border border-white/20 shrink-0">
                <HelpCircle className="w-5 h-5 text-[#E5D8CA]" />
              </div>
              <div>
                <h1 className="text-lg sm:text-xl font-bold font-['Noto_Nastaliq_Urdu']">سوال پوچھیں</h1>
                <p className="text-xs text-slate-200 mt-1 font-medium">
                  اپنا مسئلہ براہِ راست مفتی صاحب کو ارسال کریں اور شرعی رہنمائی حاصل کریں
                </p>
              </div>
            </div>

            {/* Authentication Guard */}
            {!isAuthenticated ? (
              <div className="p-8 sm:p-12 text-center bg-slate-50/50">
                <Lock className="w-12 h-12 mx-auto mb-3 text-slate-400" />
                <h2 className="text-base font-bold text-slate-800 mb-2">
                  مفتی صاحب کو سوال ارسال کرنے کے لیے آپ کا لاگ ان ہونا ضروری ہے۔
                </h2>
                <p className="text-xs text-slate-500 mb-6 max-w-md mx-auto">
                  سوالات جمع کرنے اور ان کے جوابات کا باآسانی سراغ لگانے کے لیے آپ کا اکاؤنٹ ہونا ضروری ہے۔
                </p>
                <button
                  type="button"
                  onClick={openLogin}
                  className="px-6 py-3 text-white font-bold text-xs uppercase tracking-wider rounded-lg transition-all cursor-pointer shadow-xs"
                  style={{ backgroundColor: COLORS.primary }}
                >
                  سوال پوچھنے کے لیے لاگ ان کریں
                </button>
              </div>
            ) : (
              <form onSubmit={handleFormSubmit} className="p-5 sm:p-8 space-y-5 text-start">
                {actionError && (
                  <div className="bg-red-50 border-r-4 border-red-500 p-4 flex items-start gap-2.5 text-red-700 text-xs rounded-lg">
                    <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5" />
                    <span className="font-bold">{actionError}</span>
                  </div>
                )}

                {/* Logged in User Bar */}
                <div
                  className="p-3.5 rounded-xl border bg-slate-50/80 flex flex-wrap items-center justify-between gap-3 text-xs"
                  style={{ borderColor: COLORS.border }}
                >
                  <div className="flex items-center gap-2">
                    <User className="w-4 h-4 text-slate-500" />
                    <span className="font-bold text-slate-800">{loggedInUser?.name}</span>
                    {loggedInUser?.email && (
                      <span className="text-slate-500 hidden sm:inline">({loggedInUser.email})</span>
                    )}
                  </div>
                  <div className="flex items-center gap-1 text-[11px] text-emerald-700 font-medium bg-emerald-50 px-2 py-0.5 rounded">
                    <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                    <span>تصدیق شدہ سائل</span>
                  </div>
                </div>

                {/* Question Title */}
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <label className="block text-xs font-bold text-slate-700 uppercase">
                      سوال کا عنوان *
                    </label>
                    <span
                      className={`text-[11px] font-medium ${
                        formData.questionTitle.length > 150 ? 'text-red-500' : 'text-slate-400'
                      }`}
                    >
                      {formData.questionTitle.length}/150
                    </span>
                  </div>
                  <input
                    type="text"
                    name="questionTitle"
                    value={formData.questionTitle}
                    onChange={handleInputChange}
                    maxLength={150}
                    required
                    placeholder="مثال: تجارتی سامان پر زکوٰۃ کا طریقہ کار"
                    className="w-full px-3.5 py-2.5 text-sm bg-white border rounded-xl outline-none text-slate-800 font-medium focus:border-stone-600 transition-colors shadow-2xs font-['Noto_Nastaliq_Urdu']"
                    style={{ borderColor: COLORS.border }}
                  />
                  <p className="text-[11px] text-slate-400 mt-1">
                    اپنے سوال کا مختصر اور جامع عنوان درج کریں (زیادہ سے زیادہ 150 حروف)
                  </p>
                </div>

                {/* Detailed Question */}
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <label className="block text-xs font-bold text-slate-700 uppercase">
                      تفصیلی سوال *
                    </label>
                    <span
                      className={`text-[11px] font-medium ${
                        formData.detailedQuestion.length > 5000 ? 'text-red-500' : 'text-slate-400'
                      }`}
                    >
                      {formData.detailedQuestion.length}/5000
                    </span>
                  </div>
                  <textarea
                    name="detailedQuestion"
                    value={formData.detailedQuestion}
                    onChange={handleInputChange}
                    maxLength={5000}
                    required
                    placeholder="اپنے مسئلے کی تمام ضروری تفصیلات اور پس منظر واضح طور پر تحریر کریں..."
                    rows={6}
                    className="w-full px-3.5 py-2.5 text-sm bg-white border rounded-xl outline-none text-slate-800 font-medium focus:border-stone-600 transition-colors resize-y leading-relaxed shadow-2xs font-['Noto_Nastaliq_Urdu']"
                    style={{ borderColor: COLORS.border }}
                  />
                  <p className="text-[11px] text-slate-400 mt-1">
                    صحیح شرعی رہنمائی کے لیے تمام ضروری حقائق درج کریں (زیادہ سے زیادہ 5000 حروف)
                  </p>
                </div>

                {/* Guidelines Box */}
                <div
                  className="p-4 rounded-xl border bg-[#faf8f5]/80 text-xs space-y-1.5"
                  style={{ borderColor: COLORS.border }}
                >
                  <span className="font-bold block" style={{ color: COLORS.primary }}>
                    ❖ سوال پوچھنے کے ضروری آداب و ہدایات
                  </span>
                  <ul className="list-disc list-inside space-y-1 text-slate-600">
                    <li>سوال کو صاف اور واضح الفاظ میں تحریر کریں۔</li>
                    <li>غیر ضروری تفصیلات سے گریز کریں اور مسئلے کے اہم پہلو بیان کریں۔</li>
                    <li>آپ اپنے پوچھے گئے سوالات کی کیفیت "میری پروفائل" میں جا کر دیکھ سکتے ہیں۔</li>
                  </ul>
                </div>

                {/* Submit Button */}
                <div className="pt-2">
                  <button
                    type="submit"
                    disabled={
                      actionLoading ||
                      !formData.questionTitle.trim() ||
                      !formData.detailedQuestion.trim()
                    }
                    className="w-full flex items-center justify-center gap-2 py-3.5 text-white font-bold rounded-xl shadow-xs transition-colors text-xs sm:text-sm disabled:opacity-50 border-0 cursor-pointer"
                    style={{ backgroundColor: COLORS.primary }}
                  >
                    <Send className="w-4 h-4" />
                    {actionLoading ? 'سوال بھیجا جا رہا ہے...' : 'مفتی صاحب کو سوال بھیجیں'}
                  </button>
                </div>
              </form>
            )}
          </div>
        )}
      </div>

      {/* Local Auth Modal using existing Login and Signup in English layout */}
      <Modal
        isOpen={isAuthModalOpen}
        onClose={closeAuthModal}
        title={authMode === "login" ? "Sign In" : "Create Account"}
        maxWidth={authMode === "login" ? "max-w-md" : "max-w-xl"}
        height="max-h-[92vh]"
        dir="ltr"
      >
        {authMode === "login" ? (
          <Login
            isModal={true}
            onClose={closeAuthModal}
            onSwitchToSignup={() => setAuthMode("signup")}
          />
        ) : (
          <Signup
            isModal={true}
            onClose={closeAuthModal}
            onSwitchToLogin={() => setAuthMode("login")}
          />
        )}
      </Modal>
    </div>
  );
}
