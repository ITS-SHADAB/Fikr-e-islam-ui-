import React, { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import {
  MessageSquare,
  Calendar,
  Eye,
  Share2,
  Copy,
  Check,
  ArrowRight,
  Printer,
  HelpCircle,
  Folder,
  CheckCircle2,
  BookOpen,
  Building2,
  Sparkles,
  ChevronLeft,
  Settings,
  Clock,
} from 'lucide-react';
import { getQuestionBySlug } from '@/services';
import { COLORS } from '@/utils/themeColors';
import { QA_TRANSLATIONS } from '@/utils/categories';
import toast from 'react-hot-toast';

export default function QADetail() {
  const { slug } = useParams();
  const navigate = useNavigate();
  const { loggedInUser, userRole } = useSelector((state) => state.auth);
  const isAdmin = userRole === 'admin' || loggedInUser?.role === 'admin';

  const [question, setQuestion] = useState(null);
  const [relatedQuestions, setRelatedQuestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (!slug) return;
    const fetchQuestion = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await getQuestionBySlug(slug);
        if (data?.question) {
          setQuestion(data.question);
          setRelatedQuestions(data.relatedQuestions || []);
        } else {
          setError('سوال نہیں ملا');
        }
      } catch (err) {
        setError(err?.response?.data?.message || 'سوال حاصل کرنے میں ناکامی');
      } finally {
        setLoading(false);
      }
    };
    fetchQuestion();
    window.scrollTo(0, 0);
  }, [slug]);

  const handleCopyLink = () => {
    const url = window.location.href;
    if (navigator.clipboard) {
      navigator.clipboard.writeText(url);
      setCopied(true);
      toast.success('لنک کاپی ہو گیا!');
      setTimeout(() => setCopied(false), 2500);
    }
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: question?.questionTitle || 'سوال و جواب',
          text: question?.questionTitle,
          url: window.location.href,
        });
      } catch (e) {}
    } else {
      handleCopyLink();
    }
  };

  const handlePrint = () => window.print();

  const categoryLabel = question?.category
    ? QA_TRANSLATIONS[question.category] || question.category
    : 'عام مسائل';

  const answeredDate = question?.answeredAt || question?.updatedAt || question?.createdAt;

  if (loading) {
    return (
      <div
        dir="rtl"
        className="min-h-[70vh] py-16 flex items-center justify-center"
        style={{ backgroundColor: COLORS.background }}
      >
        <div className="flex flex-col items-center gap-3">
          <div
            className="w-10 h-10 rounded-full border-3 border-t-transparent animate-spin"
            style={{ borderColor: `${COLORS.primary} transparent ${COLORS.primary} ${COLORS.primary}` }}
          />
          <span className="text-xs font-bold font-['Noto_Nastaliq_Urdu']" style={{ color: COLORS.textSecondary }}>
            تفصیلات لوڈ ہو رہی ہیں...
          </span>
        </div>
      </div>
    );
  }

  if (error || !question) {
    return (
      <div
        dir="rtl"
        className="min-h-screen py-16 px-4"
        style={{ backgroundColor: COLORS.background }}
      >
        <div
          className="max-w-xl mx-auto text-center p-8 rounded-2xl border bg-white shadow-xs"
          style={{ borderColor: COLORS.border }}
        >
          <HelpCircle className="w-12 h-12 mx-auto mb-3 text-red-500" />
          <h2 className="text-xl font-bold font-['Noto_Nastaliq_Urdu'] mb-2" style={{ color: COLORS.primary }}>
            {error || 'سوال نہیں ملا'}
          </h2>
          <p className="text-xs text-slate-500 mb-6">مطلوبہ سوال موجود نہیں ہے یا ہٹا دیا گیا ہے۔</p>
          <Link
            to="/qa"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg text-white font-bold text-xs uppercase tracking-wider transition-colors"
            style={{ backgroundColor: COLORS.primary }}
          >
            <ArrowRight className="w-4 h-4" />
            تمام سوال و جواب پر واپس جائیں
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div
      dir="rtl"
      className="min-h-screen py-6 md:py-10 text-right"
      style={{ backgroundColor: COLORS.background }}
    >
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* ── Top Navigation & Actions Bar ── */}
        <div className="flex flex-wrap items-center justify-between gap-3 mb-6">
          <div className="flex items-center gap-2 text-xs">
            <Link
              to="/qa"
              className="inline-flex items-center gap-1 font-bold transition-opacity hover:opacity-80"
              style={{ color: COLORS.primary }}
            >
              <ArrowRight className="w-3.5 h-3.5" />
              <span>فہرست سوال و جواب</span>
            </Link>
            <span className="text-slate-300">/</span>
            <span className="text-slate-500 font-medium truncate max-w-[200px] sm:max-w-[300px]">
              {categoryLabel}
            </span>
          </div>

          <div className="flex items-center gap-2">
            {isAdmin && (
              <Link
                to="/admin/questions"
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold border transition-colors cursor-pointer"
                style={{
                  backgroundColor: `${COLORS.primary}10`,
                  borderColor: `${COLORS.primary}25`,
                  color: COLORS.primary,
                }}
                title="ایڈمن پینل میں سوالات کا انتظام کریں"
              >
                <Settings className="w-3.5 h-3.5" />
                <span>انتظام سوالات</span>
              </Link>
            )}

            <button
              type="button"
              onClick={handleCopyLink}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full border bg-white text-xs font-medium hover:bg-slate-50 transition-colors cursor-pointer shadow-2xs"
              style={{ borderColor: COLORS.border, color: COLORS.textPrimary }}
              title="کاپی لنک"
            >
              {copied ? (
                <Check className="w-3.5 h-3.5 text-emerald-600" />
              ) : (
                <Copy className="w-3.5 h-3.5 text-slate-500" />
              )}
              <span>{copied ? 'کاپی ہو گیا' : 'کاپی لنک'}</span>
            </button>

            <button
              type="button"
              onClick={handleShare}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full border bg-white text-xs font-medium hover:bg-slate-50 transition-colors cursor-pointer shadow-2xs"
              style={{ borderColor: COLORS.border, color: COLORS.textPrimary }}
              title="شیئر کریں"
            >
              <Share2 className="w-3.5 h-3.5 text-slate-500" />
              <span>شیئر</span>
            </button>

            <button
              type="button"
              onClick={handlePrint}
              className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full border bg-white text-xs font-medium hover:bg-slate-50 transition-colors cursor-pointer shadow-2xs"
              style={{ borderColor: COLORS.border, color: COLORS.textPrimary }}
              title="پرنٹ کریں"
            >
              <Printer className="w-3.5 h-3.5 text-slate-500" />
              <span>پرنٹ</span>
            </button>
          </div>
        </div>

        {/* ── Main Document Container ── */}
        <article
          className="bg-white rounded-2xl border shadow-xs overflow-hidden mb-8"
          style={{
            borderColor: COLORS.border,
            borderRightWidth: '4px',
            borderRightColor: COLORS.primary,
          }}
        >
          {/* ── Header: Meta Badges & Question Title ── */}
          <div
            className="p-5 sm:p-7 border-b bg-gradient-to-b from-white to-[#FAF8F5]/40"
            style={{ borderColor: `${COLORS.border}70` }}
          >
            {/* Meta Pill Row */}
            <div className="flex flex-wrap items-center gap-2 mb-3.5">
              <span
                className="inline-flex items-center gap-1 text-[11px] font-bold px-2.5 py-0.5 rounded-full border"
                style={{
                  backgroundColor: `${COLORS.secondary}40`,
                  borderColor: COLORS.border,
                  color: COLORS.primary,
                }}
              >
                <Folder className="w-3 h-3 text-slate-500" />
                {categoryLabel}
              </span>

              {answeredDate && (
                <span className="inline-flex items-center gap-1 text-[11px] text-slate-500 font-medium">
                  <Calendar className="w-3 h-3 text-slate-400" />
                  {new Date(answeredDate).toLocaleDateString('ur-PK', {
                    year: 'numeric',
                    month: 'short',
                    day: 'numeric',
                  })}
                </span>
              )}

              {typeof question.viewCount === 'number' && (
                <span className="inline-flex items-center gap-1 text-[11px] text-slate-400 font-medium mr-auto">
                  <Eye className="w-3 h-3 text-slate-400" />
                  {question.viewCount} مناظر
                </span>
              )}
            </div>

            {/* Main Question Title with سوال Badge */}
            <div className="flex items-baseline gap-2 flex-wrap">
              <span
                className="inline-flex items-center gap-1 shrink-0 px-2 py-0.5 rounded-md text-[11px] font-bold"
                style={{
                  backgroundColor: `${COLORS.primary}12`,
                  color: COLORS.primary,
                }}
              >
                <HelpCircle className="w-3 h-3" />
                سوال
              </span>
              <h1
                className="text-base sm:text-lg md:text-xl font-bold font-['Noto_Nastaliq_Urdu'] leading-relaxed flex-1"
                style={{ color: COLORS.primary }}
              >
                {question.questionTitle}
              </h1>
            </div>
          </div>

          {/* ── Detailed Question Body ── */}
          {question.detailedQuestion && (
            <div
              className="p-5 sm:p-7 border-b bg-[#FAF8F5]/80"
              style={{ borderColor: `${COLORS.border}60` }}
            >
              <div className="flex items-center gap-1.5 mb-2.5">
                <span
                  className="w-2 h-2 rounded-full shrink-0"
                  style={{ backgroundColor: COLORS.accent }}
                />
                <h2
                  className="text-xs font-bold uppercase tracking-wider font-['Noto_Nastaliq_Urdu']"
                  style={{ color: COLORS.primary }}
                >
                  سائل کا تفصیلی سوال:
                </h2>
              </div>
              <blockquote
                className="text-xs sm:text-sm leading-relaxed text-slate-800 p-4 rounded-xl border bg-white font-['Noto_Nastaliq_Urdu'] italic shadow-2xs"
                style={{
                  borderColor: COLORS.border,
                  borderRightWidth: '3.5px',
                  borderRightColor: COLORS.accent,
                }}
              >
                {question.detailedQuestion}
              </blockquote>
            </div>
          )}

          {/* ── Official Answer Section ── */}
          <div className="p-5 sm:p-8">
            {/* Answer Header Bar */}
            <div className="flex flex-wrap items-center justify-between gap-3 mb-6 pb-4 border-b border-slate-100">
              <div className="flex items-center gap-3">
                <div
                  className="w-9 h-9 rounded-full flex items-center justify-center text-white shrink-0 shadow-2xs"
                  style={{ backgroundColor: COLORS.primary }}
                >
                  <BookOpen className="w-4 h-4" />
                </div>
                <div>
                  <div className="flex items-center gap-1.5 flex-wrap">
                    <span
                      className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[11px] font-bold"
                      style={{
                        backgroundColor: `${COLORS.accent}20`,
                        color: COLORS.accent,
                      }}
                    >
                      <BookOpen className="w-3 h-3" />
                      الجواب وباللہ التوفیق
                    </span>
                    <span className="text-xs font-bold text-slate-900 font-['Noto_Nastaliq_Urdu']">
                      {question.answeredBy?.name || 'مفتی صاحب'}
                    </span>
                    <span className="inline-flex items-center gap-0.5 text-[10px] font-bold text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded border border-emerald-200">
                      <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                      تصدیق شدہ فتویٰ
                    </span>
                  </div>
                  <div className="flex items-center gap-1 mt-0.5 text-[11px] text-slate-500">
                    <Building2 className="w-3 h-3 text-slate-400" />
                    <span>دار الافتاء و تحقیق، جامعہ</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Answer Content Body */}
            <div
              className="prose prose-slate max-w-none text-sm sm:text-base leading-loose text-slate-800 whitespace-pre-line font-['Noto_Nastaliq_Urdu']"
              style={{ lineHeight: '2.2' }}
              dangerouslySetInnerHTML={{
                __html: question.answerContent || 'جواب فی الحال درج نہیں ہے۔',
              }}
            />

            {/* Department Footer Stamp */}
            <div className="mt-8 pt-4 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500">
              <span className="font-['Noto_Nastaliq_Urdu']">
                واللہ تعالیٰ اعلم بالصواب
              </span>
              <span className="font-medium text-slate-400">
                دار الافتاء و الارشاد
              </span>
            </div>
          </div>
        </article>

        {/* ── Ask Question CTA Card (Only for Non-Admin Users) ── */}
        {!isAdmin && (
          <div
            className="rounded-2xl p-5 sm:p-7 mb-8 border flex flex-col sm:flex-row items-center justify-between gap-4 shadow-2xs"
            style={{
              backgroundColor: COLORS.white,
              borderColor: COLORS.border,
            }}
          >
            <div className="space-y-1 text-center sm:text-right">
              <h3
                className="text-sm sm:text-base font-bold font-['Noto_Nastaliq_Urdu']"
                style={{ color: COLORS.primary }}
              >
                کیا آپ کے پاس کوئی شرعی سوال ہے؟
              </h3>
              <p className="text-xs text-slate-500 max-w-md">
                اپنا سوال براہ راست دار الافتاء کو ارسال کریں اور مستند علماء کرام سے رہنمائی حاصل کریں۔
              </p>
            </div>
            <Link
              to="/ask"
              className="inline-flex items-center gap-2 px-5 py-2.5 text-white font-bold text-xs uppercase tracking-wider rounded-xl shrink-0 transition-opacity hover:opacity-90 shadow-2xs cursor-pointer"
              style={{ backgroundColor: COLORS.primary }}
            >
              <HelpCircle className="w-3.5 h-3.5 text-[#E5D8CA]" />
              نیا سوال پوچھیں
            </Link>
          </div>
        )}

        {/* ── Related Questions Section ── */}
        {relatedQuestions && relatedQuestions.length > 0 && (
          <div className="space-y-3">
            <h3
              className="text-sm sm:text-base font-bold font-['Noto_Nastaliq_Urdu'] flex items-center gap-2"
              style={{ color: COLORS.primary }}
            >
              <MessageSquare className="w-4 h-4 text-slate-500" />
              متعلقہ سوالات و جوابات
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {relatedQuestions.map((rq) => (
                <Link
                  key={rq._id}
                  to={`/qa/${rq.slug}`}
                  className="p-3.5 sm:p-4 rounded-xl border bg-white hover:shadow-xs transition-all group flex items-start justify-between gap-2"
                  style={{
                    borderColor: COLORS.border,
                    borderRightWidth: '3px',
                    borderRightColor: `${COLORS.accent}80`,
                  }}
                >
                  <div className="flex items-baseline gap-1.5 flex-1 min-w-0">
                    <span
                      className="inline-flex items-center gap-0.5 shrink-0 px-1.5 py-0.2 rounded text-[10px] font-bold"
                      style={{
                        backgroundColor: `${COLORS.primary}12`,
                        color: COLORS.primary,
                      }}
                    >
                      <HelpCircle className="w-2.5 h-2.5" />
                      سوال
                    </span>
                    <span className="text-xs sm:text-sm font-bold text-slate-800 group-hover:text-slate-900 transition-colors leading-snug line-clamp-2 font-['Noto_Nastaliq_Urdu'] flex-1">
                      {rq.questionTitle}
                    </span>
                  </div>
                  <ChevronLeft className="w-4 h-4 text-slate-300 group-hover:text-slate-500 shrink-0 transition-colors mt-0.5" />
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
