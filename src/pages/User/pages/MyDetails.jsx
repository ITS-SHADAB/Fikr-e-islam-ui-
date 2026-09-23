import React, { useEffect, useState, useMemo, useRef } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import {
  User,
  Mail,
  Phone,
  ShieldCheck,
  Calendar,
  MessageSquare,
  HelpCircle,
  BookOpen,
  FileText,
  Scale,
  AlertCircle,
  RefreshCw,
  Edit3,
  Camera,
  X,
  ChevronLeft,
  ChevronRight,
  MoreVertical,
  Trash2,
  ExternalLink,
  Settings,
  Home,
  LogOut,
  Activity,
  Layers,
  ArrowRight,
} from "lucide-react";
import {
  getMyComments,
  getMyQuestions,
  updateMyProfile,
  deleteComment,
  updateMyQuestion,
  deleteMyQuestion,
} from "@/services";
import { updateUserProfile, logout } from "@/store/slices/authSlice";
import { useAuthModal } from "@/context/AuthModalContext";
import { Spinner, Modal } from "@/components";
import toast from "react-hot-toast";

/* ── Typography & Direction Helpers ───────────────────────────────────── */
function isUrduText(text) {
  if (!text) return false;
  return /[\u0600-\u06FF\u0750-\u077F]/.test(text);
}

const URDU_MONTHS = [
  "جنوری",
  "فروری",
  "مارچ",
  "اپریل",
  "مئی",
  "جون",
  "جولائی",
  "اگست",
  "ستمبر",
  "اکتوبر",
  "نومبر",
  "دسمبر",
];

function formatUrduDate(dateStr) {
  if (!dateStr) return "—";
  const d = new Date(dateStr);
  if (isNaN(d.getTime())) return "—";
  const day = String(d.getDate()).padStart(2, "0");
  const month = URDU_MONTHS[d.getMonth()] || "ستمبر";
  const year = d.getFullYear();
  return `${day} ${month} ${year}`;
}

function formatEnglishDate(dateStr) {
  if (!dateStr) return "—";
  const d = new Date(dateStr);
  if (isNaN(d.getTime())) return "—";
  return d.toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

/* ── Content Type Icon & Style Config ─────────────────────────────────── */
const CONTENT_STYLE = {
  fatwa: {
    icon: Scale,
    label: "FATWA",
    urduLabel: "فتاویٰ",
    badgeClass: "bg-[#F3E8DC] text-[#7A5328] border-[#DFC8B2]",
    iconBoxClass: "bg-[#F7EFE6] text-[#A8793E] border-[#E8D7C3]",
    getRoute: (c) => `/fatwas/${c.contentSlug || c.contentId}`,
  },
  book: {
    icon: BookOpen,
    label: "BOOK",
    urduLabel: "کتابیں",
    badgeClass: "bg-[#E5F2EC] text-[#1E6B47] border-[#C1DFD1]",
    iconBoxClass: "bg-[#EAF5F0] text-[#1E7F55] border-[#C8E5D8]",
    getRoute: (c) => `/publications/${c.contentSlug || c.contentId}`,
  },
  article: {
    icon: FileText,
    label: "ARTICLE",
    urduLabel: "مضامین",
    badgeClass: "bg-[#EFE7DC] text-[#4F3C2C] border-[#D8C7B3]",
    iconBoxClass: "bg-[#F0EAE1] text-[#3A2B20] border-[#DFD4C4]",
    getRoute: (c) => `/articles/${c.contentSlug || c.contentId}`,
  },
  question: {
    icon: HelpCircle,
    label: "QUESTION",
    urduLabel: "سوالات",
    badgeClass: "bg-[#E4ECF6] text-[#2C4A73] border-[#BACEE4]",
    iconBoxClass: "bg-[#EBF1F8] text-[#2C4A73] border-[#CAD9EC]",
    getRoute: (c) => `/qa/${c.contentSlug || c.contentId}`,
  },
};

/* ── Avatar Component ─────────────────────────────────────────────────── */
function UserAvatar({ user, size = "md" }) {
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

  // Exact fixed size configurations to ensure the avatar never blows out:
  // sm: mobile avatar (56px x 56px)
  // md: standard avatar (72px x 72px)
  // lg: desktop sidebar avatar (80px x 80px)
  const sizeMap = {
    sm: "w-14 h-14 min-w-[56px] min-h-[56px] max-w-[56px] max-h-[56px] text-lg",
    md: "w-18 h-18 sm:w-20 sm:h-20 min-w-[72px] min-h-[72px] max-w-[80px] max-h-[80px] text-xl",
    lg: "w-20 h-20 min-w-[80px] min-h-[80px] max-w-[80px] max-h-[80px] text-2xl",
  };

  const containerClass = sizeMap[size] || sizeMap.md;

  return (
    <div
      className={`${containerClass} aspect-square rounded-2xl overflow-hidden shrink-0 border-2 border-[#C49A5A]/50 shadow-md relative bg-gradient-to-br from-[#4A3B7A] to-[#2B1B54] flex items-center justify-center`}
      style={{ aspectRatio: "1 / 1" }}
    >
      {imgUrl && !imgFailed ? (
        <img
          src={imgUrl}
          alt={user?.name || "User Avatar"}
          onError={() => setImgFailed(true)}
          className="w-full h-full object-cover object-center block"
          style={{ width: "100%", height: "100%", objectFit: "cover", objectPosition: "center" }}
        />
      ) : (
        <span className="text-white font-bold tracking-wider select-none font-serif">
          {initials}
        </span>
      )}
    </div>
  );
}

/* ── Scholarly Empty State ────────────────────────────────────────────── */
function EmptyState({
  title = "ابھی کوئی تبصرہ موجود نہیں",
  description = "آپ کے تبصرے یہاں نظر آئیں گے۔",
  actionText = "مواد دیکھیں",
  actionLink = "/articles",
}) {
  return (
    <div className="flex flex-col items-center justify-center py-16 px-4 text-center rounded-[20px] bg-[#FBF7F0] border border-[#D8C6AC] shadow-sm my-4">
      <div className="w-16 h-16 rounded-2xl bg-[#EFE4D5] border border-[#D8C6AC] flex items-center justify-center mb-4 text-[#A8793E] shadow-inner">
        <MessageSquare className="w-8 h-8 opacity-80" />
      </div>
      <h3 className="font-urdu text-2xl text-[#21170F] font-bold mb-1" dir="rtl">
        {title}
      </h3>
      <p className="font-urdu text-sm sm:text-base text-[#5F554B] max-w-md leading-relaxed mb-6" dir="rtl">
        {description}
      </p>
      {actionLink && (
        <Link
          to={actionLink}
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#2B2118] text-[#F7F1E8] font-urdu text-sm hover:bg-[#3A2B20] transition-colors border border-[#A8793E]/40 shadow-sm"
          dir="rtl"
        >
          <span>{actionText}</span>
          <ArrowRight className="w-4 h-4 text-[#C49A5A]" />
        </Link>
      )}
    </div>
  );
}

/* ── Skeleton Loading Cards ───────────────────────────────────────────── */
function SkeletonCards({ count = 4 }) {
  return (
    <div className="space-y-4">
      {Array.from({ length: count }).map((_, i) => (
        <div
          key={i}
          className="p-5 rounded-[18px] bg-[#FBF7F0] border border-[#D8C6AC] shadow-sm animate-pulse flex items-start gap-4"
        >
          <div className="w-12 h-12 rounded-xl bg-[#EFE4D5] shrink-0" />
          <div className="flex-1 space-y-3">
            <div className="h-4 bg-[#EFE4D5] rounded-md w-3/4" />
            <div className="h-3 bg-[#EFE4D5] rounded-md w-1/2" />
            <div className="flex items-center gap-3 pt-2">
              <div className="h-5 bg-[#EFE4D5] rounded-md w-16" />
              <div className="h-4 bg-[#EFE4D5] rounded-md w-32" />
            </div>
          </div>
          <div className="w-24 h-4 bg-[#EFE4D5] rounded-md shrink-0 hidden sm:block" />
        </div>
      ))}
    </div>
  );
}

/* ── Single Comment Card ──────────────────────────────────────────────── */
function CommentCard({ comment, onDelete, openMenuId, setOpenMenuId }) {
  const isMenuOpen = openMenuId === comment._id;
  const menuRef = useRef(null);

  const styleConfig =
    CONTENT_STYLE[comment.contentType] || CONTENT_STYLE.article;
  const ContentIcon = styleConfig.icon;
  const contentRoute = styleConfig.getRoute(comment);

  const isUrdu = isUrduText(comment.text);
  const formattedDate = formatUrduDate(comment.createdAt);

  // Close dropdown on click outside
  useEffect(() => {
    function handleClickOutside(e) {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        if (openMenuId === comment._id) {
          setOpenMenuId(null);
        }
      }
    }
    if (isMenuOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isMenuOpen, comment._id, openMenuId, setOpenMenuId]);

  return (
    <div className="group relative rounded-[18px] bg-[#FBF7F0] border border-[#D8C6AC] hover:border-[#B58A4D] p-4 sm:p-5 shadow-[0_4px_18px_rgba(43,33,24,0.04)] hover:shadow-[0_6px_22px_rgba(43,33,24,0.08)] transition-all duration-200">
      <div className="flex flex-col sm:flex-row items-start justify-between gap-4">
        {/* Left side: Icon + Comment Content */}
        <div className="flex items-start gap-3.5 sm:gap-4 flex-1 min-w-0">
          {/* Content Type Icon */}
          <div
            className={`w-11 h-11 sm:w-12 sm:h-12 rounded-xl sm:rounded-2xl border flex items-center justify-center shrink-0 mt-0.5 shadow-xs ${styleConfig.iconBoxClass}`}
          >
            <ContentIcon className="w-5 h-5 sm:w-6 sm:h-6" />
          </div>

          {/* Comment Body */}
          <div className="flex-1 min-w-0">
            {/* Comment Text */}
            <div
              className={`text-[#241C16] text-[15px] sm:text-base leading-relaxed ${
                isUrdu
                  ? "font-urdu text-right leading-[2.3] text-lg"
                  : "font-serif text-left font-normal"
              }`}
              dir={isUrdu ? "rtl" : "ltr"}
            >
              {comment.text}
            </div>

            {/* Content Badge + Related Title Link */}
            <div className="flex items-center gap-2 mt-3 flex-wrap text-xs">
              <span
                className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-md text-[10.5px] font-bold tracking-wider uppercase border ${styleConfig.badgeClass}`}
              >
                {styleConfig.label}
              </span>

              <span className="text-[#A8793E] select-none text-xs">•</span>

              <Link
                to={contentRoute}
                className="font-medium text-[#5F554B] hover:text-[#21170F] hover:underline truncate max-w-[280px] sm:max-w-md transition-colors"
                title={comment.contentTitle || "مواد دیکھیں"}
              >
                {comment.contentTitle || `${styleConfig.label} #${comment.contentId?.slice(-6)}`}
              </Link>
            </div>
          </div>
        </div>

        {/* Right side: Date + 3-Dot Actions Menu */}
        <div className="flex items-center justify-between sm:justify-end gap-3 w-full sm:w-auto pt-2 sm:pt-0 border-t sm:border-t-0 border-[#D8C6AC]/50 shrink-0">
          {/* Formatted Date */}
          <div
            className="flex items-center gap-1.5 text-xs text-[#7A7066] font-medium"
            dir="rtl"
          >
            <Calendar className="w-3.5 h-3.5 text-[#A8793E]" />
            <span className="font-urdu text-sm text-[#5F554B]">
              {formattedDate}
            </span>
          </div>

          {/* Three-Dot Menu Action Wrapper */}
          <div
            ref={menuRef}
            className="relative shrink-0"
            style={{ position: "relative" }}
          >
            <button
              type="button"
              onClick={() =>
                setOpenMenuId(isMenuOpen ? null : comment._id)
              }
              aria-label="Actions"
              className="w-8 h-8 rounded-lg flex items-center justify-center text-[#7A7066] hover:text-[#21170F] hover:bg-[#EFE4D5] transition-colors cursor-pointer"
            >
              <MoreVertical className="w-4 h-4" />
            </button>

            {/* Dropdown Menu (Floating Overlay - completely out of normal document flow) */}
            {isMenuOpen && (
              <div
                className="absolute left-0 rounded-xl py-1.5 font-urdu text-right shadow-lg"
                style={{
                  position: "absolute",
                  left: 0,
                  right: "auto",
                  top: "calc(100% + 8px)",
                  zIndex: 100,
                  width: "11rem",
                  maxWidth: "calc(100vw - 36px)",
                  backgroundColor: "#FBF7F0",
                  border: "1px solid #D8C6AC",
                  boxShadow:
                    "0 10px 25px -5px rgba(43, 33, 24, 0.12), 0 8px 10px -6px rgba(43, 33, 24, 0.06)",
                }}
                dir="rtl"
              >
                <Link
                  to={contentRoute}
                  onClick={() => setOpenMenuId(null)}
                  className="flex items-center gap-2 px-3.5 py-2 text-sm text-[#241C16] hover:bg-[#EFE4D5] transition-colors"
                >
                  <ExternalLink className="w-3.5 h-3.5 text-[#A8793E]" />
                  <span>مواد دیکھیں</span>
                </Link>

                <button
                  type="button"
                  onClick={() => {
                    setOpenMenuId(null);
                    onDelete(comment);
                  }}
                  className="w-full flex items-center gap-2 px-3.5 py-2 text-sm text-red-700 hover:bg-red-50 transition-colors text-right cursor-pointer"
                >
                  <Trash2 className="w-3.5 h-3.5 text-red-500" />
                  <span>تبصرہ حذف کریں</span>
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

/* ── Single Question Card ─────────────────────────────────────────────── */
function UserQuestionCard({
  question,
  onEdit,
  onDelete,
  openMenuId,
  setOpenMenuId,
}) {
  const isMenuOpen = openMenuId === question._id;
  const menuRef = useRef(null);

  const title = question.questionTitle || question.question || "بلا عنوان سوال";
  const rawAnswer = question.answerContent || question.answer || "";
  const cleanAnswer = rawAnswer.replace(/<[^>]*>?/gm, "").trim();

  const isAnswered =
    question.status === "answered" || Boolean(question.isAnswered);
  const isPending =
    question.status === "pending" ||
    (!isAnswered && question.status !== "rejected");
  const isRejected = question.status === "rejected";

  const isLong = cleanAnswer.length > 90;
  const previewText = isLong ? cleanAnswer.slice(0, 90) + "..." : cleanAnswer;
  const formattedDate = formatUrduDate(question.createdAt);

  // Close dropdown on click outside
  useEffect(() => {
    function handleClickOutside(e) {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        if (openMenuId === question._id) {
          setOpenMenuId(null);
        }
      }
    }
    if (isMenuOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isMenuOpen, question._id, openMenuId, setOpenMenuId]);

  return (
    <div className="group relative rounded-[18px] bg-[#FBF7F0] border border-[#D8C6AC] hover:border-[#B58A4D] p-4 sm:p-5 shadow-[0_4px_18px_rgba(43,33,24,0.04)] hover:shadow-md transition-all duration-200">
      <div className="flex flex-col gap-3" dir="rtl">
        {/* Meta row: Status badge (Right) + Date & 3-Dot Actions (Left) */}
        <div className="flex items-center justify-between text-xs">
          <div className="flex items-center gap-2">
            {isAnswered && (
              <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold text-emerald-800 bg-emerald-50 border border-emerald-300">
                جواب شدہ
              </span>
            )}
            {isPending && (
              <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold text-amber-800 bg-amber-50 border border-amber-300">
                زیرِ غور
              </span>
            )}
            {isRejected && (
              <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold text-red-800 bg-red-50 border border-red-300">
                مسترد
              </span>
            )}
            {question.isEdited && (
              <span className="text-[10px] text-[#8C7A6B] bg-[#EFE4D5]/70 px-2 py-0.5 rounded-md font-urdu">
                ترمیم شدہ
              </span>
            )}
          </div>

          <div className="flex items-center gap-2">
            {/* Formatted Date */}
            <div className="flex items-center gap-1.5 text-[#7A7066]">
              <Calendar className="w-3.5 h-3.5 text-[#A8793E]" />
              <span className="font-urdu text-sm">{formattedDate}</span>
            </div>

            {/* Three-Dot Actions Menu Wrapper */}
            <div
              ref={menuRef}
              className="relative shrink-0"
              style={{ position: "relative" }}
            >
              <button
                type="button"
                onClick={() => setOpenMenuId(isMenuOpen ? null : question._id)}
                aria-label="سوال کے اختیارات"
                className="w-8 h-8 rounded-lg flex items-center justify-center text-[#7A7066] hover:text-[#21170F] hover:bg-[#EFE4D5] transition-colors cursor-pointer"
              >
                <MoreVertical className="w-4 h-4" />
              </button>

              {/* Dropdown Menu (Floating Overlay - completely out of normal document flow) */}
              {isMenuOpen && (
                <div
                  className="absolute left-0 rounded-xl py-1.5 font-urdu text-right shadow-lg"
                  style={{
                    position: "absolute",
                    left: 0,
                    top: "calc(100% + 8px)",
                    zIndex: 100,
                    width: "12rem",
                    maxWidth: "calc(100vw - 36px)",
                    backgroundColor: "#FBF7F0",
                    border: "1px solid #D8C6AC",
                    boxShadow:
                      "0 10px 25px -5px rgba(43, 33, 24, 0.12), 0 8px 10px -6px rgba(43, 33, 24, 0.06)",
                  }}
                  dir="rtl"
                >
                  {/* View Full Answer (if answered) */}
                  {question.slug && isAnswered && (
                    <Link
                      to={`/qa/${question.slug}`}
                      onClick={() => setOpenMenuId(null)}
                      className="flex items-center gap-2 px-3.5 py-2 text-sm text-[#241C16] hover:bg-[#EFE4D5] transition-colors"
                    >
                      <ExternalLink className="w-3.5 h-3.5 text-[#A8793E]" />
                      <span>مکمل جواب دیکھیں</span>
                    </Link>
                  )}

                  {/* Edit Question (if pending) */}
                  {isPending && onEdit && (
                    <button
                      type="button"
                      onClick={() => {
                        setOpenMenuId(null);
                        onEdit(question);
                      }}
                      className="w-full flex items-center gap-2 px-3.5 py-2 text-sm text-[#241C16] hover:bg-[#EFE4D5] transition-colors text-right cursor-pointer"
                    >
                      <Edit3 className="w-3.5 h-3.5 text-[#A8793E]" />
                      <span>سوال میں ترمیم کریں</span>
                    </button>
                  )}

                  {/* Delete Question (if pending) */}
                  {isPending && onDelete && (
                    <button
                      type="button"
                      onClick={() => {
                        setOpenMenuId(null);
                        onDelete(question);
                      }}
                      className="w-full flex items-center gap-2 px-3.5 py-2 text-sm text-red-700 hover:bg-red-50 transition-colors text-right cursor-pointer"
                    >
                      <Trash2 className="w-3.5 h-3.5 text-red-500" />
                      <span>سوال حذف کریں</span>
                    </button>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Question Title */}
        <div className="flex items-baseline gap-2">
          <span className="px-2 py-0.5 rounded-md text-[11px] font-bold bg-[#2B2118]/10 text-[#2B2118] shrink-0 font-urdu">
            سوال
          </span>
          {question.slug && isAnswered ? (
            <Link
              to={`/qa/${question.slug}`}
              className="font-urdu text-lg sm:text-xl font-bold text-[#21170F] hover:text-[#A8793E] hover:underline transition-colors leading-relaxed"
            >
              {title}
            </Link>
          ) : (
            <h4 className="font-urdu text-lg sm:text-xl font-bold text-[#21170F] leading-relaxed">
              {title}
            </h4>
          )}
        </div>

        {/* Detailed Question Preview if not answered */}
        {question.detailedQuestion && !cleanAnswer && (
          <p className="font-urdu text-sm sm:text-base text-[#5F554B] leading-relaxed line-clamp-3 bg-[#F7EFE4]/60 p-3 rounded-xl border border-[#D8C6AC]/40">
            {question.detailedQuestion}
          </p>
        )}

        {/* Answer Snippet */}
        {cleanAnswer && (
          <div className="bg-[#F7F1E8] border border-[#D8C6AC]/60 p-3 rounded-xl mt-1 flex items-baseline gap-2">
            <span className="px-2 py-0.5 rounded-md text-[11px] font-bold bg-[#A8793E]/15 text-[#A8793E] shrink-0 font-urdu">
              جواب
            </span>
            <p className="font-urdu text-sm text-[#5F554B] leading-relaxed flex-1">
              {previewText}
            </p>
          </div>
        )}

        {/* View Detail Link if answered */}
        {question.slug && isAnswered && (
          <div className="pt-1 flex justify-end">
            <Link
              to={`/qa/${question.slug}`}
              className="inline-flex items-center gap-1 font-urdu text-sm text-[#A8793E] hover:text-[#21170F] font-bold"
            >
              <span>مکمل جواب دیکھیں</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}

/* ── Profile Overview Information Tile ────────────────────────────────── */
function InfoCard({ icon: Icon, urduLabel, englishLabel, value }) {
  return (
    <div className="p-4 rounded-[16px] bg-[#FBF7F0] border border-[#D8C6AC] shadow-xs flex items-center gap-3.5">
      <div className="w-11 h-11 rounded-xl bg-[#EFE4D5] border border-[#D8C6AC] flex items-center justify-center shrink-0 text-[#A8793E]">
        <Icon className="w-5 h-5" />
      </div>
      <div className="min-w-0">
        <p className="text-[10px] uppercase font-bold text-[#7A7066] tracking-wider">
          {englishLabel} • <span className="font-urdu text-xs">{urduLabel}</span>
        </p>
        <p className="text-sm sm:text-base font-bold text-[#21170F] truncate mt-0.5">
          {value || "—"}
        </p>
      </div>
    </div>
  );
}

/* ════════════════════════════════════════════════════════════════════════
   MAIN MY DETAILS COMPONENT
═══════════════════════════════════════════════════════════════════════ */
export default function MyDetails() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { openLogin } = useAuthModal();
  const { isAuthenticated, loggedInUser } = useSelector((s) => s.auth);

  // Active Tab: comments (default), overview, questions, settings
  const [activeTab, setActiveTab] = useState("comments");

  // Data states
  const [comments, setComments] = useState([]);
  const [questions, setQuestions] = useState([]);
  const [loadingC, setLoadingC] = useState(true);
  const [loadingQ, setLoadingQ] = useState(true);
  const [errorC, setErrorC] = useState(null);

  // Filter state for comments: "all", "article", "fatwa", "book", "question"
  const [activeFilter, setActiveFilter] = useState("all");

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;

  // 3-dot menu state
  const [openMenuId, setOpenMenuId] = useState(null);
  const [openQuestionMenuId, setOpenQuestionMenuId] = useState(null);

  // Delete comment confirmation modal state
  const [deleteConfirmComment, setDeleteConfirmComment] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);

  // Edit Question Modal state
  const [editQuestionModal, setEditQuestionModal] = useState(null);
  const [editQuestionTitle, setEditQuestionTitle] = useState("");
  const [editQuestionDetail, setEditQuestionDetail] = useState("");
  const [editQuestionLoading, setEditQuestionLoading] = useState(false);
  const [editQuestionError, setEditQuestionError] = useState("");

  // Delete Question Modal state
  const [deleteConfirmQuestion, setDeleteConfirmQuestion] = useState(null);
  const [isDeletingQuestion, setIsDeletingQuestion] = useState(false);

  // Edit Profile Modal
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [editName, setEditName] = useState("");
  const [editPhone, setEditPhone] = useState("");
  const [editImageFile, setEditImageFile] = useState(null);
  const [previewImage, setPreviewImage] = useState(null);
  const [editLoading, setEditLoading] = useState(false);
  const [editError, setEditError] = useState("");

  // Fetch comments & questions
  const loadComments = () => {
    setLoadingC(true);
    setErrorC(null);
    getMyComments()
      .then((d) => {
        const list = Array.isArray(d?.comments)
          ? d.comments
          : Array.isArray(d)
          ? d
          : [];
        setComments(list);
      })
      .catch((err) => {
        setErrorC("تبصرے لوڈ نہیں ہو سکے۔");
        setComments([]);
      })
      .finally(() => setLoadingC(false));
  };

  const loadQuestions = () => {
    setLoadingQ(true);
    getMyQuestions()
      .then((d) => {
        const list = Array.isArray(d?.questions)
          ? d.questions
          : Array.isArray(d)
          ? d
          : [];
        setQuestions(list);
      })
      .catch(() => setQuestions([]))
      .finally(() => setLoadingQ(false));
  };

  useEffect(() => {
    if (!isAuthenticated) return;
    loadComments();
    loadQuestions();
  }, [isAuthenticated]);

  // Reset page when filter changes
  useEffect(() => {
    setCurrentPage(1);
  }, [activeFilter]);

  // Compute counts for filters
  const filterCounts = useMemo(() => {
    const counts = {
      all: comments.length,
      article: 0,
      fatwa: 0,
      book: 0,
      question: questions.length,
    };
    for (const c of comments) {
      if (c.contentType === "article") counts.article += 1;
      else if (c.contentType === "fatwa") counts.fatwa += 1;
      else if (c.contentType === "book") counts.book += 1;
    }
    return counts;
  }, [comments, questions]);

  // Filtered comments list
  const filteredComments = useMemo(() => {
    if (activeFilter === "all") return comments;
    if (activeFilter === "question") return [];
    return comments.filter((c) => c.contentType === activeFilter);
  }, [comments, activeFilter]);

  // Pagination computation
  const totalItems =
    activeFilter === "question" ? questions.length : filteredComments.length;
  const totalPages = Math.max(1, Math.ceil(totalItems / itemsPerPage));
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentComments = filteredComments.slice(
    startIndex,
    startIndex + itemsPerPage
  );
  const currentQuestions = questions.slice(
    startIndex,
    startIndex + itemsPerPage
  );

  // Delete Comment Handler
  const handleDeleteComment = async () => {
    if (!deleteConfirmComment) return;
    try {
      setIsDeleting(true);
      await deleteComment(deleteConfirmComment._id);
      setComments((prev) =>
        prev.filter((c) => c._id !== deleteConfirmComment._id)
      );
      toast.success("تبصرہ کامیابی سے حذف کر دیا گیا");
      setDeleteConfirmComment(null);
    } catch (err) {
      toast.error(
        err.response?.data?.message || err.message || "تبصرہ حذف کرنے میں ناکامی"
      );
    } finally {
      setIsDeleting(false);
    }
  };

  // Question Edit Handlers
  const handleOpenEditQuestion = (q) => {
    setEditQuestionModal(q);
    setEditQuestionTitle(q.questionTitle || q.question || "");
    setEditQuestionDetail(q.detailedQuestion || "");
    setEditQuestionError("");
  };

  const handleUpdateQuestion = async (e) => {
    e.preventDefault();
    setEditQuestionError("");

    if (!editQuestionTitle.trim()) {
      setEditQuestionError("سوال کا عنوان درکار ہے / Question title is required");
      return;
    }
    if (!editQuestionDetail.trim()) {
      setEditQuestionError(
        "تفصیلی سوال درکار ہے / Detailed question is required"
      );
      return;
    }

    try {
      setEditQuestionLoading(true);
      const res = await updateMyQuestion(editQuestionModal._id, {
        questionTitle: editQuestionTitle.trim(),
        detailedQuestion: editQuestionDetail.trim(),
      });

      if (res?.success) {
        setQuestions((prev) =>
          prev.map((q) =>
            q._id === editQuestionModal._id
              ? {
                  ...q,
                  ...(res.question || {}),
                  questionTitle: editQuestionTitle.trim(),
                  detailedQuestion: editQuestionDetail.trim(),
                  isEdited: true,
                }
              : q
          )
        );
        toast.success(res.message || "سوال کامیابی سے تبدیل ہو گیا!");
        setEditQuestionModal(null);
      }
    } catch (err) {
      setEditQuestionError(
        err.response?.data?.message ||
          err.message ||
          "سوال اپ ڈیٹ کرنے میں غلطی ہوئی۔"
      );
    } finally {
      setEditQuestionLoading(false);
    }
  };

  // Question Delete Handlers
  const handleOpenDeleteQuestion = (q) => {
    setDeleteConfirmQuestion(q);
  };

  const handleDeleteQuestion = async () => {
    if (!deleteConfirmQuestion) return;
    try {
      setIsDeletingQuestion(true);
      const res = await deleteMyQuestion(deleteConfirmQuestion._id);
      setQuestions((prev) =>
        prev.filter((q) => q._id !== deleteConfirmQuestion._id)
      );
      toast.success(res?.message || "سوال کامیابی سے حذف کر دیا گیا");
      setDeleteConfirmQuestion(null);
    } catch (err) {
      toast.error(
        err.response?.data?.message ||
          err.message ||
          "سوال حذف کرنے میں ناکامی"
      );
    } finally {
      setIsDeletingQuestion(false);
    }
  };

  // Edit Profile Handlers
  const openEditModal = () => {
    setEditName(loggedInUser?.name || "");
    setEditPhone(loggedInUser?.contactPhone || "");
    setEditImageFile(null);
    setPreviewImage(null);
    setEditError("");
    setIsEditOpen(true);
  };

  const handleImageChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      setEditImageFile(file);
      setPreviewImage(URL.createObjectURL(file));
    }
  };

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    setEditError("");

    if (!editName.trim()) {
      setEditError("نام درکار ہے / Name is required");
      return;
    }

    const phoneRegex = /^[6-9]\d{9}$/;
    if (editPhone.trim() && !phoneRegex.test(editPhone.trim())) {
      setEditError(
        "رابطہ نمبر درست ۱۰ ہندسی ہونا چاہیے۔ / Must be valid 10 digits starting with 6-9."
      );
      return;
    }

    try {
      setEditLoading(true);
      const formData = new FormData();
      formData.append("name", editName.trim());
      if (editPhone.trim()) {
        formData.append("contactPhone", editPhone.trim());
      }
      if (editImageFile) {
        formData.append("profileImage", editImageFile);
      }

      const res = await updateMyProfile(formData);
      if (res?.success) {
        dispatch(updateUserProfile(res.data));
        toast.success(res.message || "پروفائل کامیابی سے تبدیل ہو گئی!");
        setIsEditOpen(false);
      }
    } catch (err) {
      setEditError(
        err.response?.data?.message ||
          err.message ||
          "پروفائل اپ ڈیٹ کرنے میں غلطی ہوئی۔"
      );
    } finally {
      setEditLoading(false);
    }
  };

  const handleLogout = () => {
    if (window.confirm("کیا آپ واقعی لاگ آؤٹ کرنا چاہتے ہیں؟")) {
      dispatch(logout());
      navigate("/");
    }
  };

  // Unauthenticated view
  if (!isAuthenticated) {
    return (
      <div className="min-h-[75vh] flex items-center justify-center p-4 bg-[#F3E8DA]">
        <div className="max-w-md w-full bg-[#FBF7F0] p-8 rounded-[22px] border border-[#D8C6AC] shadow-lg text-center space-y-5">
          <div className="w-16 h-16 rounded-2xl bg-[#EFE4D5] border border-[#D8C6AC] flex items-center justify-center mx-auto text-[#A8793E]">
            <User className="w-8 h-8" />
          </div>
          <h2 className="font-urdu text-2xl font-bold text-[#21170F]" dir="rtl">
            براہ کرم لاگ ان کریں
          </h2>
          <p className="font-urdu text-sm sm:text-base text-[#5F554B] leading-relaxed" dir="rtl">
            اپنے تبصرے، سوالات اور پروفائل کی تفصیلات دیکھنے کے لیے اکاؤنٹ میں لاگ ان کریں۔
          </p>
          <button
            type="button"
            onClick={openLogin}
            className="w-full py-3 px-6 rounded-xl bg-[#2B2118] text-[#F7F1E8] font-urdu text-base font-bold shadow-md hover:bg-[#3A2B20] transition-colors border border-[#A8793E]/40 cursor-pointer"
          >
            لاگ ان کریں / Sign In
          </button>
        </div>
      </div>
    );
  }

  const user = loggedInUser;
  const isAdmin = user?.role === "admin";

  return (
    <div className="min-h-screen bg-[#F3E8DA] text-[#241C16] py-6 sm:py-10 px-3 sm:px-6 lg:px-8 selection:bg-[#A8793E]/20">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* ── Breadcrumb Bar ────────────────────────────────────────────── */}
        <div className="flex items-center justify-between text-xs sm:text-sm text-[#7A7066] px-1">
          <div className="flex items-center gap-2">
            <Link
              to="/"
              className="inline-flex items-center gap-1.5 hover:text-[#21170F] transition-colors font-medium"
            >
              <Home className="w-4 h-4 text-[#A8793E]" />
              <span className="hidden sm:inline">ہوم</span>
            </Link>
            <span className="text-[#A8793E]/50 select-none">/</span>
            <span
              onClick={() => setActiveTab("overview")}
              className="cursor-pointer hover:text-[#21170F] font-urdu text-sm"
            >
              پروفائل
            </span>
            <span className="text-[#A8793E]/50 select-none">/</span>
            <span className="font-urdu text-sm text-[#21170F] font-bold">
              {activeTab === "comments"
                ? "میرے تبصرے"
                : activeTab === "questions"
                ? "میرے سوالات"
                : activeTab === "settings"
                ? "اکاؤنٹ کی ترتیبات"
                : "پروفائل کا جائزہ"}
            </span>
          </div>

          <button
            type="button"
            onClick={openEditModal}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#FBF7F0] border border-[#D8C6AC] hover:border-[#B58A4D] text-[#3A2B20] font-urdu text-xs font-bold transition-all shadow-2xs cursor-pointer"
            dir="rtl"
          >
            <Edit3 className="w-3.5 h-3.5 text-[#A8793E]" />
            <span>پروفائل میں ترمیم</span>
          </button>
        </div>

        {/* ── Mobile Navigation Tabs (< 768px) ─────────────────────────── */}
        <div className="block md:hidden bg-[#21170F] rounded-[20px] p-4 border border-[#B58A4D]/35 shadow-lg">
          {/* User mini badge */}
          <div className="flex items-center gap-3 pb-3 border-b border-[#A8793E]/20">
            <UserAvatar user={user} size="sm" />
            <div className="min-w-0 flex-1">
              <h2 className="text-white text-base sm:text-lg font-bold truncate font-serif">
                {user?.name || "User"}
              </h2>
            </div>
          </div>

          {/* All 5 Navigation Menus - Responsive Grid (All items 100% visible) */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 pt-3" dir="rtl">
            <button
              type="button"
              onClick={() => {
                setActiveTab("comments");
                setActiveFilter("all");
              }}
              className={`px-3 py-2.5 rounded-xl font-urdu text-xs sm:text-sm flex items-center justify-center gap-2 transition-all cursor-pointer ${
                activeTab === "comments" && activeFilter !== "question"
                  ? "bg-[#F7F1E8] text-[#2B2118] font-bold shadow-sm border border-[#A8793E]/40"
                  : "bg-white/10 text-white/90 hover:bg-white/20 border border-white/10"
              }`}
            >
              <MessageSquare className={`w-4 h-4 ${activeTab === "comments" && activeFilter !== "question" ? "text-[#A8793E]" : "text-[#C49A5A]"}`} />
              <span>میرے تبصرے</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab("overview")}
              className={`px-3 py-2.5 rounded-xl font-urdu text-xs sm:text-sm flex items-center justify-center gap-2 transition-all cursor-pointer ${
                activeTab === "overview"
                  ? "bg-[#F7F1E8] text-[#2B2118] font-bold shadow-sm border border-[#A8793E]/40"
                  : "bg-white/10 text-white/90 hover:bg-white/20 border border-white/10"
              }`}
            >
              <User className={`w-4 h-4 ${activeTab === "overview" ? "text-[#A8793E]" : "text-[#C49A5A]"}`} />
              <span>پروفائل کا جائزہ</span>
            </button>

            <button
              type="button"
              onClick={() => {
                setActiveTab("questions");
                setActiveFilter("question");
              }}
              className={`px-3 py-2.5 rounded-xl font-urdu text-xs sm:text-sm flex items-center justify-center gap-2 transition-all cursor-pointer ${
                activeTab === "questions" || (activeTab === "comments" && activeFilter === "question")
                  ? "bg-[#F7F1E8] text-[#2B2118] font-bold shadow-sm border border-[#A8793E]/40"
                  : "bg-white/10 text-white/90 hover:bg-white/20 border border-white/10"
              }`}
            >
              <HelpCircle className={`w-4 h-4 ${activeTab === "questions" || (activeTab === "comments" && activeFilter === "question") ? "text-[#A8793E]" : "text-[#C49A5A]"}`} />
              <span>میرے سوالات</span>
            </button>

            <button
              type="button"
              onClick={openEditModal}
              className="px-3 py-2.5 rounded-xl font-urdu text-xs sm:text-sm flex items-center justify-center gap-2 bg-white/10 text-white/90 hover:bg-white/20 border border-white/10 transition-all cursor-pointer"
            >
              <Edit3 className="w-4 h-4 text-[#C49A5A]" />
              <span>پروفائل میں ترمیم</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab("settings")}
              className={`col-span-2 sm:col-span-1 px-3 py-2.5 rounded-xl font-urdu text-xs sm:text-sm flex items-center justify-center gap-2 transition-all cursor-pointer ${
                activeTab === "settings"
                  ? "bg-[#F7F1E8] text-[#2B2118] font-bold shadow-sm border border-[#A8793E]/40"
                  : "bg-white/10 text-white/90 hover:bg-white/20 border border-white/10"
              }`}
            >
              <Settings className={`w-4 h-4 ${activeTab === "settings" ? "text-[#A8793E]" : "text-[#C49A5A]"}`} />
              <span>اکاؤنٹ کی ترتیبات</span>
            </button>
          </div>
        </div>

        {/* ── Main Two-Column Layout ────────────────────────────────────── */}
        <div className="flex flex-col md:flex-row gap-6 items-start">
          {/* ════════════════════════════════════════════════════════════════
              DESKTOP SIDEBAR (Left Column)
          ═════════════════════════════════════════════════════════════════ */}
          <aside className="hidden md:flex w-72 lg:w-80 shrink-0 bg-[#21170F] text-[#F7F1E8] rounded-[22px] border border-[#B58A4D]/35 p-6 shadow-xl flex-col min-h-[640px] relative overflow-hidden select-none">
            {/* Top User Info Section */}
            <div className="flex flex-col items-center text-center pb-6 border-b border-[#A8793E]/25">
              <div className="mb-3">
                <UserAvatar user={user} size="lg" />
              </div>
              <h2 className="text-white text-xl lg:text-2xl font-bold tracking-wide uppercase font-serif">
                {user?.name || "MD SHADAB"}
              </h2>
            </div>

            {/* Navigation Menu List */}
            <nav className="py-6 space-y-2 flex-1" dir="rtl">
              <button
                type="button"
                onClick={() => setActiveTab("overview")}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-urdu text-base transition-all duration-150 cursor-pointer ${
                  activeTab === "overview"
                    ? "bg-[#F7F1E8] text-[#2B2118] font-bold shadow-md"
                    : "text-white/80 hover:bg-white/10 hover:text-white"
                }`}
              >
                <User
                  className={`w-5 h-5 ${
                    activeTab === "overview" ? "text-[#A8793E]" : "text-[#C49A5A]"
                  }`}
                />
                <span>پروفائل کا جائزہ</span>
              </button>

              <button
                type="button"
                onClick={() => setActiveTab("comments")}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-urdu text-base transition-all duration-150 cursor-pointer ${
                  activeTab === "comments"
                    ? "bg-[#F7F1E8] text-[#2B2118] font-bold shadow-md"
                    : "text-white/80 hover:bg-white/10 hover:text-white"
                }`}
              >
                <MessageSquare
                  className={`w-5 h-5 ${
                    activeTab === "comments" ? "text-[#A8793E]" : "text-[#C49A5A]"
                  }`}
                />
                <span>میرے تبصرے</span>
              </button>

              <button
                type="button"
                onClick={() => setActiveTab("questions")}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-urdu text-base transition-all duration-150 cursor-pointer ${
                  activeTab === "questions"
                    ? "bg-[#F7F1E8] text-[#2B2118] font-bold shadow-md"
                    : "text-white/80 hover:bg-white/10 hover:text-white"
                }`}
              >
                <HelpCircle
                  className={`w-5 h-5 ${
                    activeTab === "questions" ? "text-[#A8793E]" : "text-[#C49A5A]"
                  }`}
                />
                <span>میرے سوالات</span>
              </button>

              <button
                type="button"
                onClick={openEditModal}
                className="w-full flex items-center gap-3 px-4 py-3 rounded-xl font-urdu text-base text-white/80 hover:bg-white/10 hover:text-white transition-all duration-150 cursor-pointer"
              >
                <Edit3 className="w-5 h-5 text-[#C49A5A]" />
                <span>پروفائل میں ترمیم</span>
              </button>

              <button
                type="button"
                onClick={() => setActiveTab("settings")}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-urdu text-base transition-all duration-150 cursor-pointer ${
                  activeTab === "settings"
                    ? "bg-[#F7F1E8] text-[#2B2118] font-bold shadow-md"
                    : "text-white/80 hover:bg-white/10 hover:text-white"
                }`}
              >
                <Settings
                  className={`w-5 h-5 ${
                    activeTab === "settings" ? "text-[#A8793E]" : "text-[#C49A5A]"
                  }`}
                />
                <span>اکاؤنٹ کی ترتیبات</span>
              </button>
            </nav>

            {/* Bottom Ornamental Quote Cartouche */}
            <div className="mt-auto pt-6 border-t border-[#A8793E]/20 text-center relative overflow-hidden">
              <div className="relative z-10 flex flex-col items-center">
                <div className="text-[#C49A5A] mb-2 flex items-center justify-center gap-2">
                  <div className="h-[1px] w-6 bg-gradient-to-r from-transparent to-[#C49A5A]/50" />
                  <BookOpen className="w-5 h-5 text-[#C49A5A]" />
                  <div className="h-[1px] w-6 bg-gradient-to-l from-transparent to-[#C49A5A]/50" />
                </div>
                <p
                  className="font-urdu text-sm text-[#E6D7C3] leading-relaxed px-2"
                  dir="rtl"
                >
                  علم کا اشتراک ایک بہتر امت کی تعمیر کی طرف پہلا قدم ہے۔
                </p>
                <div className="mt-2 text-[#C49A5A]/70 text-xs">❖</div>
              </div>
            </div>
          </aside>

          {/* ════════════════════════════════════════════════════════════════
              MAIN CONTENT AREA (Right Column)
          ═════════════════════════════════════════════════════════════════ */}
          <main className="flex-1 w-full space-y-6">
            {/* ─── TAB 1: MY COMMENTS (میرے تبصرے) ─── */}
            {activeTab === "comments" && (
              <>
                {/* Hero Banner Section */}
                <div className="relative rounded-[22px] bg-[#FBF7F0] border border-[#D8C6AC] shadow-xs p-5 sm:p-7 overflow-hidden">
                  <div className="flex flex-col md:flex-row items-center justify-between gap-5 sm:gap-6">
                    {/* Left: Comment icon + Urdu title + description */}
                    <div className="flex items-start gap-3.5 sm:gap-5 flex-1 w-full" dir="rtl">
                      <div className="w-13 h-13 sm:w-16 sm:h-16 rounded-2xl bg-[#2B2118] border border-[#A8793E]/40 flex items-center justify-center shrink-0 shadow-md">
                        <MessageSquare className="w-6 h-6 sm:w-8 sm:h-8 text-[#F7F1E8]" />
                      </div>

                      <div className="flex-1 text-right">
                        <h1 className="font-urdu text-2xl sm:text-4xl lg:text-[40px] font-bold text-[#21170F] tracking-wide leading-tight">
                          میرے تبصرے
                        </h1>
                        <p className="font-urdu text-xs sm:text-base text-[#5F554B] leading-relaxed mt-1.5 sm:mt-2 max-w-xl">
                          یہاں آپ اپنے تمام تبصرے دیکھ سکتے ہیں جو آپ نے مضامین، فتاویٰ، کتب اور دیگر مواد پر کیے ہیں۔
                        </p>
                      </div>
                    </div>

                    {/* Right: Islamic Scholarly Vignette Card - VISIBLE ON BOTH MOBILE AND DESKTOP */}
                    <div className="w-full md:w-auto flex items-center justify-center shrink-0">
                      <div className="w-full sm:w-auto min-w-[240px] max-w-[300px] py-3 px-4 sm:py-4 sm:px-5 rounded-2xl bg-gradient-to-b from-[#FFFDF9] to-[#F5ECE0] border border-[#D8C6AC] shadow-inner text-center overflow-hidden flex sm:flex-col items-center justify-center gap-3 sm:gap-1.5">
                        <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-full overflow-hidden border-2 border-[#C49A5A]/40 shadow-xs bg-[#EFE4D5] shrink-0">
                          <img
                            src="/assets/images/scholarly_quill_books.jpg"
                            alt="Scholarship Emblem"
                            onError={(e) => {
                              e.target.style.display = "none";
                            }}
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <div className="flex flex-col items-center">
                          <p
                            className="font-urdu text-sm sm:text-base text-[#21170F] font-bold leading-snug"
                            dir="rtl"
                          >
                            اچھے کلمات
                          </p>
                          <p
                            className="font-urdu text-xs sm:text-sm text-[#5F554B] leading-snug"
                            dir="rtl"
                          >
                            صدقہ جاریہ ہیں۔
                          </p>
                        </div>
                        <div className="hidden sm:flex mt-1 items-center justify-center gap-1.5 text-[#A8793E]">
                          <div className="h-[1px] w-5 bg-[#A8793E]/40" />
                          <span className="text-[10px]">❖</span>
                          <div className="h-[1px] w-5 bg-[#A8793E]/40" />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Filter Tabs Row - FLEX-WRAP (ALL TABS INCLUDING سوالات 100% VISIBLE) */}
                <div
                  className="flex flex-wrap items-center gap-2 sm:gap-2.5 py-1"
                  dir="rtl"
                >
                  {/* Filter: All (تمام) */}
                  <button
                    type="button"
                    onClick={() => setActiveFilter("all")}
                    className={`inline-flex items-center gap-1.5 sm:gap-2 px-3.5 sm:px-4 py-1.5 sm:py-2 rounded-full font-urdu text-xs sm:text-sm transition-all duration-150 cursor-pointer ${
                      activeFilter === "all"
                        ? "bg-[#2B2118] text-[#F7F1E8] font-bold shadow-sm border border-[#A8793E]/40"
                        : "bg-[#FBF7F0] text-[#241C16] border border-[#D8C6AC] hover:bg-[#EFE4D5]"
                    }`}
                  >
                    <MessageSquare className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-[#A8793E]" />
                    <span>تمام</span>
                    <span
                      className={`text-[11px] sm:text-xs px-2 py-0.5 rounded-full font-sans font-bold ${
                        activeFilter === "all"
                          ? "bg-white/20 text-white"
                          : "bg-[#EFE4D5] text-[#5F554B]"
                      }`}
                    >
                      {filterCounts.all}
                    </span>
                  </button>

                  {/* Filter: Articles (مضامین) */}
                  <button
                    type="button"
                    onClick={() => setActiveFilter("article")}
                    className={`inline-flex items-center gap-1.5 sm:gap-2 px-3.5 sm:px-4 py-1.5 sm:py-2 rounded-full font-urdu text-xs sm:text-sm transition-all duration-150 cursor-pointer ${
                      activeFilter === "article"
                        ? "bg-[#2B2118] text-[#F7F1E8] font-bold shadow-sm border border-[#A8793E]/40"
                        : "bg-[#FBF7F0] text-[#241C16] border border-[#D8C6AC] hover:bg-[#EFE4D5]"
                    }`}
                  >
                    <FileText className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-[#3A2B20]" />
                    <span>مضامین</span>
                    <span
                      className={`text-[11px] sm:text-xs px-2 py-0.5 rounded-full font-sans font-bold ${
                        activeFilter === "article"
                          ? "bg-white/20 text-white"
                          : "bg-[#EFE4D5] text-[#5F554B]"
                      }`}
                    >
                      {filterCounts.article}
                    </span>
                  </button>

                  {/* Filter: Fatwas (فتاویٰ) */}
                  <button
                    type="button"
                    onClick={() => setActiveFilter("fatwa")}
                    className={`inline-flex items-center gap-1.5 sm:gap-2 px-3.5 sm:px-4 py-1.5 sm:py-2 rounded-full font-urdu text-xs sm:text-sm transition-all duration-150 cursor-pointer ${
                      activeFilter === "fatwa"
                        ? "bg-[#2B2118] text-[#F7F1E8] font-bold shadow-sm border border-[#A8793E]/40"
                        : "bg-[#FBF7F0] text-[#241C16] border border-[#D8C6AC] hover:bg-[#EFE4D5]"
                    }`}
                  >
                    <Scale className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-[#A8793E]" />
                    <span>فتاویٰ</span>
                    <span
                      className={`text-[11px] sm:text-xs px-2 py-0.5 rounded-full font-sans font-bold ${
                        activeFilter === "fatwa"
                          ? "bg-white/20 text-white"
                          : "bg-[#EFE4D5] text-[#5F554B]"
                      }`}
                    >
                      {filterCounts.fatwa}
                    </span>
                  </button>

                  {/* Filter: Books (کتابیں) */}
                  <button
                    type="button"
                    onClick={() => setActiveFilter("book")}
                    className={`inline-flex items-center gap-1.5 sm:gap-2 px-3.5 sm:px-4 py-1.5 sm:py-2 rounded-full font-urdu text-xs sm:text-sm transition-all duration-150 cursor-pointer ${
                      activeFilter === "book"
                        ? "bg-[#2B2118] text-[#F7F1E8] font-bold shadow-sm border border-[#A8793E]/40"
                        : "bg-[#FBF7F0] text-[#241C16] border border-[#D8C6AC] hover:bg-[#EFE4D5]"
                    }`}
                  >
                    <BookOpen className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-[#1E7F55]" />
                    <span>کتابیں</span>
                    <span
                      className={`text-[11px] sm:text-xs px-2 py-0.5 rounded-full font-sans font-bold ${
                        activeFilter === "book"
                          ? "bg-white/20 text-white"
                          : "bg-[#EFE4D5] text-[#5F554B]"
                      }`}
                    >
                      {filterCounts.book}
                    </span>
                  </button>

                  {/* Filter: Questions (سوالات) */}
                  <button
                    type="button"
                    onClick={() => setActiveFilter("question")}
                    className={`inline-flex items-center gap-1.5 sm:gap-2 px-3.5 sm:px-4 py-1.5 sm:py-2 rounded-full font-urdu text-xs sm:text-sm transition-all duration-150 cursor-pointer ${
                      activeFilter === "question"
                        ? "bg-[#2B2118] text-[#F7F1E8] font-bold shadow-sm border border-[#A8793E]/40"
                        : "bg-[#FBF7F0] text-[#241C16] border border-[#D8C6AC] hover:bg-[#EFE4D5]"
                    }`}
                  >
                    <HelpCircle className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-[#2C4A73]" />
                    <span>سوالات</span>
                    <span
                      className={`text-[11px] sm:text-xs px-2 py-0.5 rounded-full font-sans font-bold ${
                        activeFilter === "question"
                          ? "bg-white/20 text-white"
                          : "bg-[#EFE4D5] text-[#5F554B]"
                      }`}
                    >
                      {filterCounts.question}
                    </span>
                  </button>
                </div>

                {/* ── Comment Cards List ── */}
                {loadingC ? (
                  <SkeletonCards count={4} />
                ) : errorC ? (
                  <div className="p-8 text-center bg-[#FBF7F0] border border-red-200 rounded-[20px] space-y-3 font-urdu">
                    <p className="text-red-700 text-lg font-bold">
                      تبصرے لوڈ نہیں ہو سکے
                    </p>
                    <p className="text-sm text-[#5F554B]">
                      براہ کرم دوبارہ کوشش کریں۔
                    </p>
                    <button
                      type="button"
                      onClick={loadComments}
                      className="inline-flex items-center gap-2 px-4 py-2 bg-[#2B2118] text-white rounded-xl text-sm font-urdu hover:bg-[#3A2B20] transition-colors cursor-pointer"
                    >
                      <RefreshCw className="w-4 h-4" />
                      <span>دوبارہ کوشش کریں</span>
                    </button>
                  </div>
                ) : activeFilter === "question" ? (
                  /* Display Questions if question filter clicked */
                  questions.length === 0 ? (
                    <EmptyState
                      title="ابھی کوئی سوال موجود نہیں"
                      description="آپ کے پوچھے گئے سوالات یہاں نظر آئیں گے۔"
                      actionText="سوال پوچھیں"
                      actionLink="/ask"
                    />
                  ) : (
                    <div className="space-y-4">
                      {currentQuestions.map((q) => (
                        <UserQuestionCard
                          key={q._id}
                          question={q}
                          onEdit={handleOpenEditQuestion}
                          onDelete={handleOpenDeleteQuestion}
                          openMenuId={openQuestionMenuId}
                          setOpenMenuId={setOpenQuestionMenuId}
                        />
                      ))}
                    </div>
                  )
                ) : filteredComments.length === 0 ? (
                  <EmptyState
                    title="ابھی کوئی تبصرہ موجود نہیں"
                    description="آپ کے تبصرے یہاں نظر آئیں گے۔"
                    actionText="مواد دیکھیں"
                    actionLink="/articles"
                  />
                ) : (
                  <div className="space-y-4">
                    {currentComments.map((comment) => (
                      <CommentCard
                        key={comment._id}
                        comment={comment}
                        onDelete={(c) => setDeleteConfirmComment(c)}
                        openMenuId={openMenuId}
                        setOpenMenuId={setOpenMenuId}
                      />
                    ))}
                  </div>
                )}

                {/* ── Pagination Controls ── */}
                {totalItems > 0 && (
                  <div className="pt-4 flex flex-col sm:flex-row items-center justify-between gap-4 border-t border-[#D8C6AC]/50">
                    {/* Urdu summary count */}
                    <p className="font-urdu text-sm text-[#5F554B]" dir="rtl">
                      کل {totalItems} {activeFilter === "question" ? "سوالات" : "تبصروں"} میں سے{" "}
                      {startIndex + 1} تا{" "}
                      {Math.min(startIndex + itemsPerPage, totalItems)} دکھائے جا رہے ہیں۔
                    </p>

                    {/* Pagination buttons */}
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                        disabled={currentPage === 1}
                        className="w-9 h-9 rounded-full bg-[#FBF7F0] border border-[#D8C6AC] text-[#3A2B20] hover:bg-[#EFE4D5] flex items-center justify-center disabled:opacity-40 disabled:pointer-events-none transition-colors cursor-pointer"
                        title="پچھلا صفحہ"
                      >
                        <ChevronLeft className="w-4 h-4" />
                      </button>

                      {/* Pages indicators */}
                      {Array.from({ length: totalPages }).map((_, idx) => {
                        const pageNum = idx + 1;
                        // For large pages, limit window
                        if (
                          totalPages > 5 &&
                          Math.abs(pageNum - currentPage) > 2 &&
                          pageNum !== 1 &&
                          pageNum !== totalPages
                        ) {
                          return null;
                        }
                        return (
                          <button
                            key={pageNum}
                            type="button"
                            onClick={() => setCurrentPage(pageNum)}
                            className={`w-9 h-9 rounded-full text-sm font-bold flex items-center justify-center transition-all cursor-pointer ${
                              currentPage === pageNum
                                ? "bg-[#21170F] text-white shadow-sm"
                                : "bg-[#FBF7F0] border border-[#D8C6AC] text-[#3A2B20] hover:bg-[#EFE4D5]"
                            }`}
                          >
                            {pageNum}
                          </button>
                        );
                      })}

                      <button
                        type="button"
                        onClick={() =>
                          setCurrentPage((p) => Math.min(totalPages, p + 1))
                        }
                        disabled={currentPage === totalPages}
                        className="w-9 h-9 rounded-full bg-[#FBF7F0] border border-[#D8C6AC] text-[#3A2B20] hover:bg-[#EFE4D5] flex items-center justify-center disabled:opacity-40 disabled:pointer-events-none transition-colors cursor-pointer"
                        title="اگلا صفحہ"
                      >
                        <ChevronRight className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                )}
              </>
            )}

            {/* ─── TAB 2: PROFILE OVERVIEW (پروفائل کا جائزہ) ─── */}
            {activeTab === "overview" && (
              <div className="space-y-6">
                {/* Stats Row */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  {/* Comments count */}
                  <div className="p-5 rounded-[20px] bg-[#FBF7F0] border border-[#D8C6AC] shadow-xs flex items-center justify-between">
                    <div>
                      <p className="font-sans text-3xl font-extrabold text-[#21170F]">
                        {comments.length}
                      </p>
                      <p className="font-urdu text-base text-[#5F554B] mt-1" dir="rtl">
                        میرے تبصرے
                      </p>
                    </div>
                    <div className="w-12 h-12 rounded-xl bg-[#EFE4D5] border border-[#D8C6AC] flex items-center justify-center text-[#A8793E]">
                      <MessageSquare className="w-6 h-6" />
                    </div>
                  </div>

                  {/* Questions count */}
                  <div className="p-5 rounded-[20px] bg-[#FBF7F0] border border-[#D8C6AC] shadow-xs flex items-center justify-between">
                    <div>
                      <p className="font-sans text-3xl font-extrabold text-[#21170F]">
                        {questions.length}
                      </p>
                      <p className="font-urdu text-base text-[#5F554B] mt-1" dir="rtl">
                        میرے سوالات
                      </p>
                    </div>
                    <div className="w-12 h-12 rounded-xl bg-[#EFE4D5] border border-[#D8C6AC] flex items-center justify-center text-[#2C4A73]">
                      <HelpCircle className="w-6 h-6" />
                    </div>
                  </div>

                  {/* Total Actions */}
                  <div className="p-5 rounded-[20px] bg-[#FBF7F0] border border-[#D8C6AC] shadow-xs flex items-center justify-between">
                    <div>
                      <p className="font-sans text-3xl font-extrabold text-[#21170F]">
                        {comments.length + questions.length}
                      </p>
                      <p className="font-urdu text-base text-[#5F554B] mt-1" dir="rtl">
                        کل سرگرمیاں
                      </p>
                    </div>
                    <div className="w-12 h-12 rounded-xl bg-[#EFE4D5] border border-[#D8C6AC] flex items-center justify-center text-[#1E7F55]">
                      <Activity className="w-6 h-6" />
                    </div>
                  </div>
                </div>

                {/* Profile Information Tiles */}
                <div className="rounded-[22px] bg-[#FBF7F0] border border-[#D8C6AC] p-6 shadow-xs space-y-4">
                  <div className="flex items-center justify-between border-b border-[#D8C6AC]/60 pb-3" dir="rtl">
                    <h3 className="font-urdu text-xl font-bold text-[#21170F]">
                      بنیادی معلومات
                    </h3>
                    <button
                      type="button"
                      onClick={openEditModal}
                      className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-[#2B2118] text-[#F7F1E8] font-urdu text-xs hover:bg-[#3A2B20] transition-colors"
                    >
                      <Edit3 className="w-3 h-3 text-[#C49A5A]" />
                      <span>ترمیم کریں</span>
                    </button>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <InfoCard
                      icon={Mail}
                      englishLabel="Email Address"
                      urduLabel="ای میل ایڈریس"
                      value={user?.loginEmail || user?.email}
                    />

                    <InfoCard
                      icon={Phone}
                      englishLabel="Phone Number"
                      urduLabel="رابطہ نمبر"
                      value={user?.loginPhone || user?.contactPhone}
                    />

                    <InfoCard
                      icon={Calendar}
                      englishLabel="Member Since"
                      urduLabel="رکنیت کی تاریخ"
                      value={formatUrduDate(user?.createdAt)}
                    />

                    <InfoCard
                      icon={ShieldCheck}
                      englishLabel="User Role"
                      urduLabel="صارف کا کردار"
                      value={isAdmin ? "Administrator (ایڈمنسٹریٹر)" : "Registered User (صارف)"}
                    />
                  </div>
                </div>
              </div>
            )}

            {/* ─── TAB 3: MY QUESTIONS (میرے سوالات) ─── */}
            {activeTab === "questions" && (
              <div className="space-y-4">
                <div className="flex items-center justify-between p-5 rounded-[20px] bg-[#FBF7F0] border border-[#D8C6AC]" dir="rtl">
                  <div>
                    <h2 className="font-urdu text-2xl font-bold text-[#21170F]">
                      میرے سوالات
                    </h2>
                    <p className="font-urdu text-sm text-[#5F554B]">
                      دار الافتاء کو ارسال کیے گئے آپ کے شرعی سوالات اور ان کے جوابات۔
                    </p>
                  </div>
                  <Link
                    to="/ask"
                    className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#2B2118] text-[#F7F1E8] font-urdu text-sm hover:bg-[#3A2B20] transition-colors shadow-xs"
                  >
                    <span>نیا سوال پوچھیں</span>
                    <ArrowRight className="w-4 h-4 text-[#C49A5A]" />
                  </Link>
                </div>

                {loadingQ ? (
                  <SkeletonCards count={3} />
                ) : questions.length === 0 ? (
                  <EmptyState
                    title="ابھی کوئی سوال موجود نہیں"
                    description="آپ نے ابھی تک کوئی سوال ارسال نہیں کیا ہے۔"
                    actionText="نیا سوال پوچھیں"
                    actionLink="/ask"
                  />
                ) : (
                  <div className="space-y-4">
                    {questions.map((q) => (
                      <UserQuestionCard
                        key={q._id}
                        question={q}
                        onEdit={handleOpenEditQuestion}
                        onDelete={handleOpenDeleteQuestion}
                        openMenuId={openQuestionMenuId}
                        setOpenMenuId={setOpenQuestionMenuId}
                      />
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* ─── TAB 4: SETTINGS (اکاؤنٹ کی ترتیبات) ─── */}
            {activeTab === "settings" && (
              <div className="space-y-6">
                <div className="rounded-[22px] bg-[#FBF7F0] border border-[#D8C6AC] p-6 shadow-xs space-y-4" dir="rtl">
                  <h3 className="font-urdu text-xl font-bold text-[#21170F] border-b border-[#D8C6AC]/60 pb-3">
                    اکاؤنٹ کی ترتیبات
                  </h3>

                  <div className="space-y-3 font-urdu text-sm text-[#5F554B]">
                    <div className="p-4 rounded-xl bg-[#F7F1E8] border border-[#D8C6AC]/60 flex items-center justify-between">
                      <div>
                        <p className="text-[#21170F] font-bold text-base">
                          ذاتی معلومات اور تصویر
                        </p>
                        <p className="text-xs text-[#7A7066] mt-0.5">
                          اپنا نام، موبائل نمبر یا پروفائل فوٹو تبدیل کریں۔
                        </p>
                      </div>
                      <button
                        type="button"
                        onClick={openEditModal}
                        className="px-4 py-2 rounded-xl bg-[#2B2118] text-white text-xs font-bold hover:bg-[#3A2B20] transition-colors cursor-pointer"
                      >
                        تبدیل کریں
                      </button>
                    </div>

                    <div className="p-4 rounded-xl bg-[#F7F1E8] border border-[#D8C6AC]/60 flex items-center justify-between">
                      <div>
                        <p className="text-[#21170F] font-bold text-base">
                          پاس ورڈ ری سیٹ
                        </p>
                        <p className="text-xs text-[#7A7066] mt-0.5">
                          اپنا پاس ورڈ ری سیٹ کرنے کے لیے لنک حاصل کریں۔
                        </p>
                      </div>
                      <Link
                        to="/forgot-password"
                        className="px-4 py-2 rounded-xl bg-[#FBF7F0] border border-[#D8C6AC] text-[#21170F] text-xs font-bold hover:bg-[#EFE4D5] transition-colors"
                      >
                        پاس ورڈ بھول گئے؟
                      </Link>
                    </div>

                    <div className="p-4 rounded-xl bg-red-50 border border-red-200 flex items-center justify-between">
                      <div>
                        <p className="text-red-800 font-bold text-base">
                          اکاؤنٹ سے لاگ آؤٹ
                        </p>
                        <p className="text-xs text-red-600 mt-0.5">
                          اپنے سیشن کو محفوظ طریقے سے ختم کریں۔
                        </p>
                      </div>
                      <button
                        type="button"
                        onClick={handleLogout}
                        className="px-4 py-2 rounded-xl bg-red-600 text-white text-xs font-bold hover:bg-red-700 transition-colors cursor-pointer flex items-center gap-1.5"
                      >
                        <LogOut className="w-3.5 h-3.5" />
                        <span>لاگ آؤٹ</span>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </main>
        </div>
      </div>

      {/* ─── DELETE COMMENT CONFIRMATION MODAL ─── */}
      <Modal
        isOpen={Boolean(deleteConfirmComment)}
        onClose={() => setDeleteConfirmComment(null)}
        title="تبصرہ حذف کریں"
        maxWidth="max-w-md"
        dir="rtl"
      >
        <div className="p-4 sm:p-5 space-y-4 font-urdu text-right" dir="rtl">
          <p className="text-base text-[#21170F] leading-relaxed">
            کیا آپ واقعی یہ تبصرہ حذف کرنا چاہتے ہیں؟ یہ عمل واپس نہیں کیا جا سکتا۔
          </p>
          <div className="p-3 bg-[#F7F1E8] rounded-xl border border-[#D8C6AC] text-sm text-[#5F554B] italic break-words max-h-36 overflow-y-auto">
            "{deleteConfirmComment?.text}"
          </div>
          <div className="flex items-center justify-end gap-3 pt-3 border-t border-[#D8C6AC]">
            <button
              type="button"
              onClick={() => setDeleteConfirmComment(null)}
              className="px-4 py-2 rounded-xl border border-[#D8C6AC] text-sm text-[#5F554B] hover:bg-[#EFE4D5] transition-colors cursor-pointer"
            >
              منسوخ کریں
            </button>
            <button
              type="button"
              disabled={isDeleting}
              onClick={handleDeleteComment}
              className="px-5 py-2 rounded-xl bg-red-700 text-white text-sm font-bold hover:bg-red-800 transition-colors cursor-pointer flex items-center gap-2 disabled:opacity-50"
            >
              {isDeleting ? (
                <>
                  <Spinner size="sm" />
                  <span>حذف ہو رہا ہے...</span>
                </>
              ) : (
                <span>ہاں، حذف کریں</span>
              )}
            </button>
          </div>
        </div>
      </Modal>

      {/* ─── EDIT QUESTION MODAL ─── */}
      <Modal
        isOpen={Boolean(editQuestionModal)}
        onClose={() => setEditQuestionModal(null)}
        title="سوال میں ترمیم کریں"
        maxWidth="max-w-lg"
        dir="rtl"
      >
        <form
          onSubmit={handleUpdateQuestion}
          className="p-4 sm:p-5 space-y-4 font-urdu text-right"
          dir="rtl"
        >
          {editQuestionError && (
            <div className="bg-red-50 border border-red-200 text-red-700 text-xs p-3 rounded-xl flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0 text-red-500" />
              <span>{editQuestionError}</span>
            </div>
          )}

          <div className="space-y-1.5">
            <label className="block text-sm font-bold text-[#21170F]">
              عنوانِ سوال / Question Title <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={editQuestionTitle}
              onChange={(e) => setEditQuestionTitle(e.target.value)}
              required
              placeholder="مثال: کیا شیئرز کی خرید و فروخت جائز ہے؟"
              className="w-full px-3.5 py-2.5 text-base border border-[#D8C6AC] bg-[#FBF7F0] rounded-xl outline-none focus:border-[#A8793E] focus:ring-1 focus:ring-[#A8793E] transition-all font-urdu text-right"
              dir="rtl"
            />
          </div>

          <div className="space-y-1.5">
            <label className="block text-sm font-bold text-[#21170F]">
              تفصیلی سوال / Detailed Question <span className="text-red-500">*</span>
            </label>
            <textarea
              rows={5}
              value={editQuestionDetail}
              onChange={(e) => setEditQuestionDetail(e.target.value)}
              required
              placeholder="اپنا تفصیلی سوال یہاں لکھیں..."
              className="w-full px-3.5 py-2.5 text-base border border-[#D8C6AC] bg-[#FBF7F0] rounded-xl outline-none focus:border-[#A8793E] focus:ring-1 focus:ring-[#A8793E] transition-all font-urdu text-right resize-y min-h-[120px]"
              dir="rtl"
            />
          </div>

          <div className="flex items-center justify-end gap-3 pt-3 border-t border-[#D8C6AC]">
            <button
              type="button"
              onClick={() => setEditQuestionModal(null)}
              className="px-4 py-2 border border-[#D8C6AC] rounded-xl text-sm font-semibold text-[#5F554B] hover:bg-[#EFE4D5] transition-colors cursor-pointer"
            >
              منسوخ کریں
            </button>
            <button
              type="submit"
              disabled={editQuestionLoading}
              className="px-6 py-2 rounded-xl text-sm font-bold text-[#F7F1E8] bg-[#2B2118] hover:bg-[#3A2B20] transition-all shadow-xs disabled:opacity-50 cursor-pointer flex items-center gap-2 border border-[#A8793E]/40"
            >
              {editQuestionLoading ? (
                <>
                  <Spinner size="sm" />
                  <span>محفوظ ہو رہا ہے...</span>
                </>
              ) : (
                <span>تبدیلیاں محفوظ کریں</span>
              )}
            </button>
          </div>
        </form>
      </Modal>

      {/* ─── DELETE QUESTION CONFIRMATION MODAL ─── */}
      <Modal
        isOpen={Boolean(deleteConfirmQuestion)}
        onClose={() => setDeleteConfirmQuestion(null)}
        title="سوال حذف کریں"
        maxWidth="max-w-md"
        dir="rtl"
      >
        <div className="p-4 sm:p-5 space-y-4 font-urdu text-right" dir="rtl">
          <p className="text-base text-[#21170F] leading-relaxed">
            کیا آپ واقعی یہ سوال حذف کرنا چاہتے ہیں؟ یہ عمل واپس نہیں کیا جا سکتا۔
          </p>
          <div className="p-3 bg-[#F7F1E8] rounded-xl border border-[#D8C6AC] text-sm text-[#5F554B] font-bold break-words max-h-36 overflow-y-auto">
            "{deleteConfirmQuestion?.questionTitle || deleteConfirmQuestion?.question || "بلا عنوان سوال"}"
          </div>
          <div className="flex items-center justify-end gap-3 pt-3 border-t border-[#D8C6AC]">
            <button
              type="button"
              onClick={() => setDeleteConfirmQuestion(null)}
              className="px-4 py-2 rounded-xl border border-[#D8C6AC] text-sm text-[#5F554B] hover:bg-[#EFE4D5] transition-colors cursor-pointer"
            >
              منسوخ کریں
            </button>
            <button
              type="button"
              disabled={isDeletingQuestion}
              onClick={handleDeleteQuestion}
              className="px-5 py-2 rounded-xl bg-red-700 text-white text-sm font-bold hover:bg-red-800 transition-colors cursor-pointer flex items-center gap-2 disabled:opacity-50"
            >
              {isDeletingQuestion ? (
                <>
                  <Spinner size="sm" />
                  <span>حذف ہو رہا ہے...</span>
                </>
              ) : (
                <span>ہاں، حذف کریں</span>
              )}
            </button>
          </div>
        </div>
      </Modal>

      {/* ─── EDIT PROFILE MODAL ─── */}
      <Modal
        isOpen={isEditOpen}
        onClose={() => setIsEditOpen(false)}
        title="Edit Profile / پروفائل میں ترمیم"
        maxWidth="max-w-md"
        dir="ltr"
      >
        <form onSubmit={handleUpdateProfile} className="space-y-4 p-2">
          {editError && (
            <div className="bg-red-50 border border-red-200 text-red-700 text-xs p-3 rounded-xl flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0 text-red-500" />
              <span>{editError}</span>
            </div>
          )}

          {/* Photo Upload */}
          <div className="flex flex-col items-center justify-center gap-3 py-2">
            <div className="relative">
              <div
                className="w-20 h-20 min-w-[80px] min-h-[80px] max-w-[80px] max-h-[80px] aspect-square rounded-2xl overflow-hidden border-2 border-[#A8793E] shadow-sm bg-[#2B2118] flex items-center justify-center shrink-0"
                style={{ width: "80px", height: "80px", aspectRatio: "1 / 1" }}
              >
                {previewImage ? (
                  <img
                    src={previewImage}
                    alt="Preview"
                    className="w-full h-full object-cover object-center block"
                    style={{ width: "100%", height: "100%", objectFit: "cover", objectPosition: "center" }}
                  />
                ) : user?.profileImage?.url || (typeof user?.profileImage === "string" && user.profileImage) ? (
                  <img
                    src={typeof user.profileImage === "string" ? user.profileImage : user.profileImage.url}
                    alt={user.name}
                    className="w-full h-full object-cover object-center block"
                    style={{ width: "100%", height: "100%", objectFit: "cover", objectPosition: "center" }}
                  />
                ) : (
                  <div className="w-full h-full bg-gradient-to-br from-[#4A3B7A] to-[#2B1B54] flex items-center justify-center text-white text-2xl font-bold font-serif">
                    {(user?.name || "U")[0]?.toUpperCase()}
                  </div>
                )}
              </div>
              <label
                htmlFor="profile-image-upload"
                className="absolute bottom-0 right-0 p-1.5 rounded-full bg-[#2B2118] text-[#F7F1E8] hover:bg-[#3A2B20] cursor-pointer shadow-md transition-colors border border-[#A8793E]"
                title="Change Photo"
              >
                <Camera className="w-3.5 h-3.5" />
                <input
                  id="profile-image-upload"
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="hidden"
                />
              </label>
            </div>
            <span className="text-[11px] text-slate-500 font-medium font-urdu">
              تصویر تبدیل کرنے کے لیے کیمرہ آئیکن پر کلک کریں
            </span>
          </div>

          {/* Full Name */}
          <div className="space-y-1">
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wide">
              Full Name / مکمل نام *
            </label>
            <input
              type="text"
              value={editName}
              onChange={(e) => setEditName(e.target.value)}
              required
              placeholder="Your full name"
              className="w-full px-3 py-2 text-sm border border-[#D8C6AC] bg-[#FBF7F0] rounded-xl outline-none focus:border-[#A8793E] transition-colors"
            />
          </div>

          {/* Contact Phone */}
          <div className="space-y-1">
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wide">
              Contact Phone / رابطہ نمبر
            </label>
            <input
              type="tel"
              value={editPhone}
              onChange={(e) => setEditPhone(e.target.value)}
              placeholder="e.g. 9876543210 (10 digits)"
              className="w-full px-3 py-2 text-sm border border-[#D8C6AC] bg-[#FBF7F0] rounded-xl outline-none focus:border-[#A8793E] transition-colors"
            />
            <span className="text-[10.5px] text-slate-500 block">
              10-digit mobile number starting with 6, 7, 8, or 9
            </span>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center justify-end gap-2 pt-3 border-t border-[#D8C6AC]">
            <button
              type="button"
              onClick={() => setIsEditOpen(false)}
              className="px-4 py-2 border border-[#D8C6AC] rounded-xl text-xs font-semibold text-slate-600 hover:bg-[#EFE4D5] transition-colors cursor-pointer"
            >
              Cancel / منسوخ
            </button>
            <button
              type="submit"
              disabled={editLoading}
              className="px-5 py-2 rounded-xl text-xs font-bold text-[#F7F1E8] bg-[#2B2118] hover:bg-[#3A2B20] transition-all shadow-xs disabled:opacity-50 cursor-pointer flex items-center gap-1.5 border border-[#A8793E]/40"
            >
              {editLoading ? (
                <>
                  <Spinner size="sm" />
                  <span>Saving...</span>
                </>
              ) : (
                <span>Save Changes / محفوظ کریں</span>
              )}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
