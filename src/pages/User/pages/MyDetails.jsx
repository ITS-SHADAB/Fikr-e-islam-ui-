import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { Navigate, Link } from 'react-router-dom';
import {
  User, Mail, Phone, ShieldCheck, Calendar, MessageCircle,
  HelpCircle, Clock, CheckCircle2, Tag, BookOpen,
  FileText, Scale, AlertCircle, RefreshCw, ArrowLeft,
  Star, Activity,
} from 'lucide-react';
import { getMyComments, getMyQuestions } from '@/services';
import { COLORS } from '@/utils/themeColors';

/* ── Helpers ──────────────────────────────────────────────────────────── */
function fmt(date) {
  if (!date) return '—';
  return new Date(date).toLocaleDateString('en-GB', {
    day: '2-digit', month: 'short', year: 'numeric',
  });
}

const CONTENT_ICON = { article: FileText, book: BookOpen, fatwa: Scale };
const CONTENT_LABEL = { article: 'Article', book: 'Book', fatwa: 'Fatwa' };
const CONTENT_COLOR = {
  article: 'text-primary bg-[#F7F4EF] border-[#D8CDBF]',
  book: 'text-emerald-700 bg-emerald-50 border-emerald-250',
  fatwa: 'text-amber-700 bg-amber-50 border-amber-250'
};

/* ── Avatar ───────────────────────────────────────────────────────────── */
function Avatar({ user }) {
  const initials = (user?.name || 'U').split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase();
  const imgUrl = typeof user?.profileImage === 'string' ? user.profileImage : user?.profileImage?.url;
  const [imgFailed, setImgFailed] = useState(false);

  if (imgUrl && !imgFailed) {
    return (
      <img
        src={imgUrl}
        alt={user.name}
        onError={() => setImgFailed(true)}
        className="w-24 h-24 rounded-none object-cover border-4 border-white shadow-md shrink-0"
      />
    );
  }
  return (
    <div
      style={{ backgroundColor: COLORS.primary }}
      className="w-24 h-24 border-4 border-white shadow-md flex items-center justify-center text-white text-3xl font-bold shrink-0"
    >
      {initials}
    </div>
  );
}

/* ── Stat box ─────────────────────────────────────────────────────────── */
function StatBox({ icon: Icon, value, label }) {
  return (
    <div
      style={{ backgroundColor: 'rgba(255, 255, 255, 0.1)', borderColor: 'rgba(255, 255, 255, 0.2)' }}
      className="flex items-center gap-3 border px-4 py-2 w-full sm:w-auto"
    >
      <div style={{ color: COLORS.accent }}>
        <Icon className="w-5 h-5" />
      </div>
      <div>
        <p className="text-white font-bold text-lg leading-none">{value}</p>
        <p className="text-white/80 text-[10px] font-bold uppercase tracking-wider mt-1">{label}</p>
      </div>
    </div>
  );
}

/* ── Info tile ────────────────────────────────────────────────────────── */
function InfoTile({ icon: Icon, label, value }) {
  return (
    <div
      style={{ borderColor: COLORS.border }}
      className="flex items-center gap-3 bg-white rounded-none px-4 py-3 border-2"
    >
      <div
        style={{ borderColor: COLORS.border }}
        className="w-8 h-8 bg-slate-100 rounded-none flex items-center justify-center border shrink-0"
      >
        <Icon className="w-4 h-4" style={{ color: COLORS.primary }} />
      </div>
      <div className="min-w-0">
        <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">{label}</p>
        <p className="text-sm font-bold text-slate-800 truncate leading-snug mt-0.5">{value}</p>
      </div>
    </div>
  );
}

/* ── Spinner / empty ──────────────────────────────────────────────────── */
function Loader() {
  return (
    <div className="flex items-center justify-center py-16">
      <div className="flex flex-col items-center gap-2">
        <RefreshCw className="w-6 h-6 animate-spin" style={{ color: COLORS.primary }} />
        <p className="text-xs text-slate-600 font-bold">Loading...</p>
      </div>
    </div>
  );
}

function Empty({ icon: Icon, message }) {
  return (
    <div
      style={{ borderColor: COLORS.border }}
      className="flex flex-col items-center justify-center py-14 text-center gap-3 bg-slate-50 border"
    >
      <Icon className="w-8 h-8 text-slate-400" />
      <p className="text-xs text-slate-600 font-bold max-w-[200px] leading-snug">{message}</p>
    </div>
  );
}

/* ── Comment card ─────────────────────────────────────────────────────── */
function CommentCard({ comment }) {
  const ContentIcon = CONTENT_ICON[comment.contentType] || FileText;
  const contentColor = CONTENT_COLOR[comment.contentType] || 'text-slate-700 bg-slate-100 border-slate-350';

  const getDetailLink = () => {
    if (comment.contentType === 'article') {
      return `/articles/${comment.contentId}`;
    }
    if (comment.contentType === 'fatwa') {
      return `/fatwas/${comment.contentId}`;
    }
    return '#';
  };

  return (
    <Link
      to={getDetailLink()}
      style={{ borderColor: COLORS.border }}
      className="block bg-white border-2 p-4 hover:bg-slate-50 transition-colors duration-150 decoration-none text-inherit cursor-pointer"
    >
      <div className="flex items-start gap-3">
        <div className={`w-8 h-8 rounded-none border flex items-center justify-center shrink-0 mt-0.5 ${contentColor}`}>
          <ContentIcon className="w-4 h-4" />
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-sm text-slate-800 font-medium leading-relaxed">
            {comment.text}
          </p>
          <div className="flex items-center gap-2 mt-3 flex-wrap">
            <span
              style={{ borderColor: COLORS.border }}
              className="inline-flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider text-slate-600 bg-slate-100 px-2 py-0.5 border"
            >
              <Tag className="w-2.5 h-2.5" />
              {CONTENT_LABEL[comment.contentType] || comment.contentType}
            </span>
            <span className="inline-flex items-center gap-1 text-[10px] text-slate-500 font-bold">
              <Clock className="w-2.5 h-2.5" />
              {fmt(comment.createdAt)}
            </span>
            {comment.isApproved ? (
              <span className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-700 bg-emerald-50 border border-emerald-250 px-2 py-0.5">
                <CheckCircle2 className="w-2.5 h-2.5" /> Approved
              </span>
            ) : (
              <span className="inline-flex items-center gap-1 text-[10px] font-bold text-amber-700 bg-amber-50 border border-amber-250 px-2 py-0.5">
                <AlertCircle className="w-2.5 h-2.5" /> Pending
              </span>
            )}
          </div>
        </div>
      </div>
    </Link>
  );
}

/* ── Question card ────────────────────────────────────────────────────── */
function QuestionCard({ question }) {
  return (
    <div style={{ borderColor: COLORS.border }} className="bg-white border-2 p-4">
      <div className="flex items-start gap-3">
        <div
          style={{ borderColor: COLORS.border }}
          className="w-8 h-8 bg-slate-100 border flex items-center justify-center shrink-0 mt-0.5"
        >
          <HelpCircle className="w-4 h-4 text-slate-600" />
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-bold text-slate-800">{question.question}</p>
          {question.answer && (
            <div className="mt-2 border-l-2 border-slate-400 pl-2.5">
              <p className="text-xs text-slate-600 font-medium leading-relaxed">{question.answer}</p>
            </div>
          )}
          <div className="flex items-center gap-2 mt-3 flex-wrap">
            <span className="inline-flex items-center gap-1 text-[10px] text-slate-500 font-bold">
              <Clock className="w-2.5 h-2.5" />
              {fmt(question.createdAt)}
            </span>
            {question.isAnswered ? (
              <span className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-700 bg-emerald-50 border border-emerald-255 px-2 py-0.5">
                <CheckCircle2 className="w-2.5 h-2.5" /> Answered
              </span>
            ) : (
              <span className="inline-flex items-center gap-1 text-[10px] font-bold text-amber-700 bg-amber-50 border border-amber-258 px-2 py-0.5">
                <AlertCircle className="w-2.5 h-2.5" /> Awaiting
              </span>
            )}
            {question.isPublic && (
              <span
                style={{ borderColor: COLORS.border }}
                className="inline-flex items-center gap-1 text-[10px] font-bold text-blue-700 bg-blue-50 border px-2 py-0.5"
              >
                <Star className="w-2.5 h-2.5" /> Public
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

/* ── Column header ────────────────────────────────────────────────────── */
function ColHeader({ icon: Icon, title, count, iconBg }) {
  return (
    <div style={{ borderColor: COLORS.border }} className="flex items-center justify-between mb-4 pb-3 border-b-2">
      <div className="flex items-center gap-2">
        <div
          style={{ backgroundColor: COLORS.primary, borderColor: COLORS.accent }}
          className="w-8 h-8 border flex items-center justify-center"
        >
          <Icon className="w-4 h-4 text-white" />
        </div>
        <h2 className="text-sm font-bold text-slate-800 uppercase tracking-wider">{title}</h2>
      </div>
      <span
        style={{ borderColor: COLORS.border }}
        className="text-xs font-bold text-slate-700 bg-slate-200 border px-2.5 py-1"
      >
        {count}
      </span>
    </div>
  );
}

/* ════════════════════════════════════════════════════════════════════════
   Main Page
═══════════════════════════════════════════════════════════════════════ */
export default function MyDetails() {
  const { isAuthenticated, loggedInUser } = useSelector((s) => s.auth);

  const [comments, setComments] = useState([]);
  const [questions, setQuestions] = useState([]);
  const [loadingC, setLoadingC] = useState(true);
  const [loadingQ, setLoadingQ] = useState(true);

  useEffect(() => {
    if (!isAuthenticated) return;

    getMyComments()
      .then((d) => setComments(Array.isArray(d?.comments) ? d.comments : Array.isArray(d) ? d : []))
      .catch(() => setComments([]))
      .finally(() => setLoadingC(false));

    getMyQuestions()
      .then((d) => setQuestions(Array.isArray(d?.questions) ? d.questions : Array.isArray(d) ? d : []))
      .catch(() => setQuestions([]))
      .finally(() => setLoadingQ(false));
  }, [isAuthenticated]);

  if (!isAuthenticated) return <Navigate to="/login" replace />;

  const user = loggedInUser;

  return (
    <div className="w-full min-h-screen bg-slate-100 py-6" dir="ltr">
      <div className="w-full  mx-auto px-4 sm:px-6 space-y-6">

        {/* ── Header Banner (Using colors matching the theme: Dark Brown & Soft Gold accent) ── */}
        <div
          style={{ backgroundColor: COLORS.primary, borderColor: COLORS.accent }}
          className="w-full border-b-4 p-6 sm:p-8"
        >
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
            <div className="flex items-center gap-4">
              <Avatar user={user} />
              <div>
                <h1 className="text-2xl sm:text-3xl font-extrabold text-white leading-tight">
                  {user?.name || 'User'}
                </h1>
                <div className="flex items-center gap-2 mt-1">
                  <span className="inline-flex items-center gap-1 text-[10px] font-bold uppercase tracking-widest text-slate-200">
                    <ShieldCheck className="w-3.5 h-3.5" />
                    {user?.role === 'admin' ? 'Administrator' : 'Registered User'}
                  </span>
                </div>
              </div>
            </div>

            {/* Stat Boxes */}
            <div className="flex flex-wrap gap-2 w-full sm:w-auto">
              <StatBox icon={MessageCircle} value={comments.length} label="Comments" />
              <StatBox icon={HelpCircle} value={questions.length} label="Questions" />
              <StatBox icon={Activity} value={comments.length + questions.length} label="Total Actions" />
            </div>
          </div>
        </div>

        {/* Action Link Row */}
        <div style={{ borderColor: COLORS.border }} className="flex justify-between items-center bg-white border-2 p-3">
          <Link
            to="/"
            style={{ color: COLORS.primary }}
            className="inline-flex items-center gap-1.5 hover:opacity-80 text-xs font-bold uppercase tracking-wider"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to official portal
          </Link>
        </div>

        {/* Info Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          <InfoTile icon={Mail} label="Email Address" value={user?.loginEmail || user?.email || '—'} />
          <InfoTile icon={Phone} label="Phone Number" value={user?.loginPhone || user?.contactPhone || '—'} />
          <InfoTile icon={Calendar} label="Member Since" value={fmt(user?.createdAt)} />
          <InfoTile icon={User} label="User Role" value={user?.role === 'admin' ? 'Administrator' : 'Registered User'} />
        </div>

        {/* Columns */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

          {/* Comments Column */}
          <div style={{ borderColor: COLORS.border }} className="bg-white border-2 p-5 flex flex-col">
            <ColHeader
              icon={MessageCircle}
              title="My Comments"
              count={loadingC ? '—' : comments.length}
            />
            {loadingC ? (
              <Loader />
            ) : comments.length === 0 ? (
              <Empty icon={MessageCircle} message="No comments posted yet." />
            ) : (
              <div className="overflow-y-auto space-y-3 max-h-[460px] pr-1">
                {comments.map((c) => <CommentCard key={c._id} comment={c} />)}
              </div>
            )}
          </div>

          {/* Questions Column */}
          <div style={{ borderColor: COLORS.border }} className="bg-white border-2 p-5 flex flex-col">
            <ColHeader
              icon={HelpCircle}
              title="My Questions"
              count={loadingQ ? '—' : questions.length}
            />
            {loadingQ ? (
              <Loader />
            ) : questions.length === 0 ? (
              <Empty icon={HelpCircle} message="No questions submitted yet." />
            ) : (
              <div className="overflow-y-auto space-y-3 max-h-[460px] pr-1">
                {questions.map((q) => <QuestionCard key={q._id} question={q} />)}
              </div>
            )}
          </div>

        </div>

      </div>
    </div>
  );
}
