import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Navigate, Link } from "react-router-dom";
import {
  User,
  Mail,
  Phone,
  ShieldCheck,
  Calendar,
  MessageCircle,
  HelpCircle,
  Clock,
  CheckCircle2,
  Tag,
  BookOpen,
  FileText,
  Scale,
  AlertCircle,
  RefreshCw,
  ArrowLeft,
  Star,
  Activity,
  Building2,
  ExternalLink,
} from "lucide-react";
import { getMyComments, getMyQuestions } from "@/services";
import { COLORS } from "@/utils/themeColors";
import { useAuthModal } from "@/context/AuthModalContext";

/* ── Helpers ──────────────────────────────────────────────────────────── */
function fmt(date) {
  if (!date) return "—";
  return new Date(date).toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

const CONTENT_ICON = { article: FileText, book: BookOpen, fatwa: Scale };
const CONTENT_LABEL = { article: "Article", book: "Book", fatwa: "Fatwa" };
const CONTENT_COLOR = {
  article: "text-primary bg-[#F7F4EF] border-[#D8CDBF]",
  book: "text-emerald-700 bg-emerald-50 border-emerald-250",
  fatwa: "text-amber-700 bg-amber-50 border-amber-250",
};

/* ── Avatar ───────────────────────────────────────────────────────────── */
function Avatar({ user }) {
  const initials = (user?.name || "U")
    .split(" ")
    .map((w) => w[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
  const imgUrl =
    typeof user?.profileImage === "string"
      ? user.profileImage
      : user?.profileImage?.url;
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
      style={{
        backgroundColor: "rgba(255, 255, 255, 0.1)",
        borderColor: "rgba(255, 255, 255, 0.2)",
      }}
      className="flex items-center gap-3 border px-4 py-2 w-full sm:w-auto"
    >
      <div style={{ color: COLORS.accent }}>
        <Icon className="w-5 h-5" />
      </div>
      <div>
        <p className="text-white font-bold text-lg leading-none">{value}</p>
        <p className="text-white/80 text-[10px] font-bold uppercase tracking-wider mt-1">
          {label}
        </p>
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
        <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">
          {label}
        </p>
        <p className="text-sm font-bold text-slate-800 truncate leading-snug mt-0.5">
          {value}
        </p>
      </div>
    </div>
  );
}

/* ── Spinner / empty ──────────────────────────────────────────────────── */
function Loader() {
  return (
    <div className="flex items-center justify-center py-16">
      <div className="flex flex-col items-center gap-2">
        <RefreshCw
          className="w-6 h-6 animate-spin"
          style={{ color: COLORS.primary }}
        />
        <p className="text-xs text-slate-600 font-bold">لوڈ ہو رہا ہے...</p>
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
      <p className="text-xs text-slate-600 font-bold max-w-[200px] leading-snug">
        {message}
      </p>
    </div>
  );
}

/* ── Comment card ─────────────────────────────────────────────────────── */
function CommentCard({ comment }) {
  const ContentIcon = CONTENT_ICON[comment.contentType] || FileText;
  const contentColor =
    CONTENT_COLOR[comment.contentType] ||
    "text-slate-700 bg-slate-100 border-slate-350";

  const getDetailLink = () => {
    if (comment.contentType === "article") {
      return `/articles/${comment.contentId}`;
    }
    if (comment.contentType === "fatwa") {
      return `/fatwas/${comment.contentId}`;
    }
    return "#";
  };

  return (
    <Link
      to={getDetailLink()}
      style={{ borderColor: COLORS.border }}
      className="block bg-white border-2 p-4 hover:bg-slate-50 transition-colors duration-150 decoration-none text-inherit cursor-pointer"
    >
      <div className="flex items-start gap-3">
        <div
          className={`w-8 h-8 rounded-none border flex items-center justify-center shrink-0 mt-0.5 ${contentColor}`}
        >
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
  const title = question.questionTitle || question.question || "بلا عنوان سوال";
  const rawAnswer = question.answerContent || question.answer || "";
  const cleanAnswer = rawAnswer.replace(/<[^>]*>?/gm, "").trim();

  const isAnswered =
    question.status === "answered" || Boolean(question.isAnswered);
  const isPending =
    question.status === "pending" ||
    (!isAnswered && question.status !== "rejected");
  const isRejected = question.status === "rejected";

  // First 50 characters preview
  const isLong = cleanAnswer.length > 50;
  const previewText = isLong ? cleanAnswer.slice(0, 50) + "..." : cleanAnswer;

  const cardContent = (
    <article
      className="relative bg-white border rounded-2xl overflow-hidden transition-all duration-200 hover:shadow-md cursor-pointer"
      style={{
        borderColor: COLORS.border,
        borderRightWidth: "4px",
        borderRightColor: isAnswered
          ? COLORS.primary
          : isRejected
            ? "#ef4444"
            : COLORS.accent,
      }}
    >
      {/* Card Body */}
      <div className="pt-4 pb-3 px-4 sm:px-5 space-y-2.5" dir="rtl">
        {/* Meta Row: date + status badges */}
        <div className="flex flex-wrap items-center justify-end gap-2 text-[11px] text-slate-500">
          <span className="inline-flex items-center gap-1 font-medium">
            <Calendar className="w-3 h-3 text-slate-400" />
            {fmt(question.createdAt)}
          </span>
          <span className="text-slate-300 select-none">|</span>
          {isAnswered && (
            <span className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-full">
              <CheckCircle2 className="w-2.5 h-2.5" /> جواب شدہ
            </span>
          )}
          {isPending && (
            <span className="inline-flex items-center gap-1 text-[10px] font-bold text-amber-700 bg-amber-50 border border-amber-200 px-2 py-0.5 rounded-full">
              <AlertCircle className="w-2.5 h-2.5" /> زیرِ غور
            </span>
          )}
          {isRejected && (
            <span className="inline-flex items-center gap-1 text-[10px] font-bold text-red-700 bg-red-50 border border-red-200 px-2 py-0.5 rounded-full">
              <AlertCircle className="w-2.5 h-2.5" /> مسترد
            </span>
          )}
        </div>

        {/* Question Title with سوال badge */}
        <div className="flex items-baseline gap-2 flex-wrap" dir="rtl">
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
          <h3
            className={`text-sm sm:text-base font-bold leading-relaxed font-['Noto_Nastaliq_Urdu'] text-slate-900 flex-1`}
          >
            {title}
          </h3>
        </div>

        {/* Answer preview with جواب badge */}
        {cleanAnswer && (
          <div className="flex items-baseline gap-2 flex-wrap" dir="rtl">
            <span
              className="inline-flex items-center gap-1 shrink-0 px-2 py-0.5 rounded-md text-[11px] font-bold"
              style={{
                backgroundColor: `${COLORS.accent}18`,
                color: COLORS.accent,
              }}
            >
              <BookOpen className="w-3 h-3" />
              جواب
            </span>
            <p
              className={`text-xs sm:text-sm text-slate-600 leading-relaxed font-['Noto_Nastaliq_Urdu'] flex-1`}
            >
              {previewText}
            </p>
          </div>
        )}
      </div>

      {/* Footer Row */}
      <div
        className="border-t px-4 sm:px-5 py-2.5 flex items-center justify-between"
        style={{ borderColor: `${COLORS.border}99` }}
        dir="rtl"
      >
        <div className="flex items-center gap-1.5 text-[11px] text-slate-400 font-medium">
          <Building2 className="w-3.5 h-3.5" />
          <span>دار الافتاء و تحقیق</span>
        </div>
        {question.slug && isAnswered && (
          <span
            className="inline-flex items-center gap-1 text-[11px] font-bold hover:underline"
            style={{ color: COLORS.primary }}
          >
            <span>مکمل تفصیل</span>
            <ExternalLink className="w-3 h-3" />
          </span>
        )}
      </div>
    </article>
  );

  if (question.slug && isAnswered) {
    return (
      <Link to={`/qa/${question.slug}`} className="block">
        {cardContent}
      </Link>
    );
  }

  return cardContent;
}

/* ── Column header ────────────────────────────────────────────────────── */
function ColHeader({ icon: Icon, title, count, iconBg }) {
  return (
    <div
      style={{ borderColor: COLORS.border }}
      className="flex items-center justify-between mb-4 pb-3 border-b-2"
    >
      <div className="flex items-center gap-2">
        <div
          style={{
            backgroundColor: COLORS.primary,
            borderColor: COLORS.accent,
          }}
          className="w-8 h-8 border flex items-center justify-center"
        >
          <Icon className="w-4 h-4 text-white" />
        </div>
        <h2 className="text-sm font-bold text-slate-800 uppercase tracking-wider">
          {title}
        </h2>
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
      .then((d) =>
        setComments(
          Array.isArray(d?.comments) ? d.comments : Array.isArray(d) ? d : []
        )
      )
      .catch(() => setComments([]))
      .finally(() => setLoadingC(false));

    getMyQuestions()
      .then((d) =>
        setQuestions(
          Array.isArray(d?.questions) ? d.questions : Array.isArray(d) ? d : []
        )
      )
      .catch(() => setQuestions([]))
      .finally(() => setLoadingQ(false));
  }, [isAuthenticated]);

  if (!isAuthenticated) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center p-4 bg-slate-50 text-center font-sans">
        <div className="max-w-md w-full bg-white p-8 rounded-2xl border border-slate-200 shadow-xs space-y-4">
          <User className="w-12 h-12 mx-auto text-slate-400" />
          <h2 className="text-lg font-bold text-slate-800">
            Please Sign In / لاگ ان کریں
          </h2>
          <p className="text-xs text-slate-500">
            Sign in to view your submitted questions and comments.
          </p>
          <button
            type="button"
            onClick={openLogin}
            className="px-6 py-2.5 text-white rounded-xl font-bold text-xs shadow-xs hover:opacity-90 transition-all cursor-pointer inline-flex items-center gap-1.5 mx-auto"
            style={{ backgroundColor: COLORS.primary }}
          >
            Sign In / لاگ ان
          </button>
        </div>
      </div>
    );
  }

  const user = loggedInUser;

  return (
    <div className="w-full min-h-screen bg-slate-100 py-6" dir="ltr">
      <div className="w-full  mx-auto px-4 sm:px-6 space-y-6">
        {/* ── Header Banner (Using colors matching the theme: Dark Brown & Soft Gold accent) ── */}
        <div
          style={{
            backgroundColor: COLORS.primary,
            borderColor: COLORS.accent,
          }}
          className="w-full border-b-4 p-6 sm:p-8"
        >
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
            <div className="flex items-center gap-4">
              <Avatar user={user} />
              <div>
                <h1 className="text-2xl sm:text-3xl font-extrabold text-white leading-tight">
                  {user?.name || "User"}
                </h1>
                <div className="flex items-center gap-2 mt-1">
                  <span className="inline-flex items-center gap-1 text-[10px] font-bold uppercase tracking-widest text-slate-200">
                    <ShieldCheck className="w-3.5 h-3.5" />
                    {user?.role === "admin"
                      ? "Administrator"
                      : "Registered User"}
                  </span>
                </div>
              </div>
            </div>

            {/* Stat Boxes */}
            <div className="flex flex-wrap gap-2 w-full sm:w-auto">
              <StatBox
                icon={MessageCircle}
                value={comments.length}
                label="Comments"
              />
              <StatBox
                icon={HelpCircle}
                value={questions.length}
                label="Questions"
              />
              <StatBox
                icon={Activity}
                value={comments.length + questions.length}
                label="Total Actions"
              />
            </div>
          </div>
        </div>

        {/* Action Link Row */}
        <div
          style={{ borderColor: COLORS.border }}
          className="flex justify-between items-center bg-white border-2 p-3"
        >
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
          <InfoTile
            icon={Mail}
            label="Email Address"
            value={user?.loginEmail || user?.email || "—"}
          />
          <InfoTile
            icon={Phone}
            label="Phone Number"
            value={user?.loginPhone || user?.contactPhone || "—"}
          />
          <InfoTile
            icon={Calendar}
            label="Member Since"
            value={fmt(user?.createdAt)}
          />
          <InfoTile
            icon={User}
            label="User Role"
            value={user?.role === "admin" ? "Administrator" : "Registered User"}
          />
        </div>

        {/* Columns */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Comments Column */}
          <div
            style={{ borderColor: COLORS.border }}
            className="bg-white border-2 p-5 flex flex-col"
          >
            <ColHeader
              icon={MessageCircle}
              title="My Comments"
              count={loadingC ? "—" : comments.length}
            />
            {loadingC ? (
              <Loader />
            ) : comments.length === 0 ? (
              <Empty icon={MessageCircle} message="No comments posted yet." />
            ) : (
              <div className="overflow-y-auto space-y-3 max-h-[460px] pr-1">
                {comments.map((c) => (
                  <CommentCard key={c._id} comment={c} />
                ))}
              </div>
            )}
          </div>

          {/* Questions Column */}
          <div
            style={{ borderColor: COLORS.border }}
            className="bg-white border-2 p-5 flex flex-col"
          >
            <ColHeader
              icon={HelpCircle}
              title="My Questions"
              count={loadingQ ? "—" : questions.length}
            />
            {loadingQ ? (
              <Loader />
            ) : questions.length === 0 ? (
              <Empty icon={HelpCircle} message="No questions submitted yet." />
            ) : (
              <div className="overflow-y-auto space-y-3 max-h-[460px] pr-1">
                {questions.map((q) => (
                  <QuestionCard key={q._id} question={q} />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
