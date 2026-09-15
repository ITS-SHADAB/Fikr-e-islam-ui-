import React, { useState, useRef, useEffect } from "react";
import { Reply, Check, ShieldCheck, Award } from "lucide-react";
import { COLORS } from "@/utils/themeColors";
import UserAvatar from "./UserAvatar";
import CommentMenu from "./CommentMenu";

function formatTimeAgo(dateStr, isRTL = false) {
  if (!dateStr) return "";
  const diffMs = Date.now() - new Date(dateStr).getTime();
  const mins = Math.floor(diffMs / 60000);
  const hours = Math.floor(diffMs / 3600000);
  const days = Math.floor(diffMs / 86400000);
  const weeks = Math.floor(days / 7);
  const months = Math.floor(days / 30);
  const years = Math.floor(days / 365);

  if (isRTL) {
    if (mins < 1) return "ابھی";
    if (mins < 60) return `${mins} منٹ پہلے`;
    if (hours < 24) return `${hours} گھنٹے پہلے`;
    if (days < 7) return `${days} دن پہلے`;
    if (weeks < 5) return `${weeks} ہفتے پہلے`;
    if (months < 12) return `${months} ماہ پہلے`;
    return `${years} سال پہلے`;
  }

  if (mins < 1) return "just now";
  if (mins < 60) return `${mins}m ago`;
  if (hours < 24) return `${hours}h ago`;
  if (days < 7) return `${days}d ago`;
  if (weeks < 5) return `${weeks}w ago`;
  if (months < 12) return `${months}mo ago`;
  return `${years}y ago`;
}

function RoleBadge({ role, isRTL = false }) {
  if (!role || role === "user") return null;

  if (role === "admin") {
    return (
      <span
        className="inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full border shadow-2xs leading-none"
        style={{
          backgroundColor: `${COLORS.accent}20`,
          borderColor: `${COLORS.accent}50`,
          color: COLORS.primary,
        }}
        title="Administrator"
      >
        <ShieldCheck className="w-2.5 h-2.5" style={{ color: COLORS.accent }} />
        <span>{isRTL ? "منتظم" : "Admin"}</span>
      </span>
    );
  }

  if (role === "scholar" || role === "mufti") {
    return (
      <span
        className="inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full border shadow-2xs leading-none bg-emerald-50 border-emerald-300 text-emerald-800"
        title="Islamic Scholar"
      >
        <Award className="w-2.5 h-2.5 text-emerald-600" />
        <span>{isRTL ? "اہلِ علم" : "Scholar"}</span>
      </span>
    );
  }

  return (
    <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-neutral-100 text-neutral-600 border border-neutral-200 leading-none">
      {role}
    </span>
  );
}

export default function CommentItem({
  comment,
  isReply = false,
  loggedInUser,
  isAdmin = false,
  isEditing = false,
  onStartEdit,
  onSaveEdit,
  onCancelEdit,
  onDeleteRequest,
  onReplyClick,
  isRTL = false,
}) {
  const [editText, setEditText] = useState(comment?.text || "");
  const [isSaving, setIsSaving] = useState(false);
  const editTextareaRef = useRef(null);

  useEffect(() => {
    if (isEditing) {
      setEditText(comment.text || "");
      setTimeout(() => {
        if (editTextareaRef.current) {
          editTextareaRef.current.focus();
          editTextareaRef.current.style.height = "auto";
          editTextareaRef.current.style.height = `${editTextareaRef.current.scrollHeight}px`;
        }
      }, 50);
    }
  }, [isEditing, comment.text]);

  const handleSave = async () => {
    const trimmed = editText.trim();
    if (!trimmed || isSaving) return;
    try {
      setIsSaving(true);
      await onSaveEdit(comment._id, trimmed);
    } finally {
      setIsSaving(false);
    }
  };

  const isOwner =
    loggedInUser &&
    comment.user &&
    String(comment.user._id || comment.user) === String(loggedInUser._id);
  const canEdit = !comment.isDeleted && Boolean(loggedInUser && (isAdmin || isOwner));
  const canDelete = !comment.isDeleted && Boolean(loggedInUser && (isAdmin || isOwner));

  if (comment.isDeleted) {
    return (
      <div
        className={`flex items-start gap-2.5 py-2.5 px-3 rounded-xl border border-dashed my-1 ${
          isReply ? "text-xs" : "text-sm"
        }`}
        style={{
          backgroundColor: "rgba(0,0,0,0.02)",
          borderColor: `${COLORS.border}30`,
        }}
      >
        <div className="w-6 h-6 rounded-full bg-neutral-200 flex items-center justify-center text-neutral-400 shrink-0">
          ✕
        </div>
        <p className="italic text-neutral-500 text-xs py-0.5 leading-normal">
          {isRTL ? "یہ تبصرہ حذف کر دیا گیا ہے۔" : "This comment was deleted."}
        </p>
      </div>
    );
  }

  // Clean text from leading @username if already recorded
  const replyTargetName = comment.replyToUser?.name;
  let cleanText = comment.text || "";
  if (replyTargetName) {
    const prefix = new RegExp(`^@${replyTargetName}\\s*`, "i");
    cleanText = cleanText.replace(prefix, "");
  }

  return (
    <div
      className={`group flex items-start ${
        isReply
          ? "gap-2.5 p-2.5 sm:p-3 rounded-xl border border-amber-900/10 my-1.5"
          : "gap-3 py-1"
      } transition-colors`}
      style={{
        backgroundColor: isReply ? "rgba(250, 246, 240, 0.7)" : "transparent",
      }}
    >
      <UserAvatar user={comment.user} size={isReply ? 30 : 36} />

      <div className="flex-1 min-w-0">
        {/* Header: User Name, Role Badge, Time, Edited, and 3-dot Menu */}
        <div className="flex items-center justify-between gap-2 mb-1">
          <div className="flex items-center gap-1.5 flex-wrap">
            <span
              className="font-bold text-xs sm:text-[13px] leading-tight"
              style={{ color: COLORS.primary }}
            >
              {comment.user?.name || (isRTL ? "صارف" : "User")}
            </span>

            <RoleBadge role={comment.user?.role} isRTL={isRTL} />

            <span
              className="text-[11px] font-medium opacity-65"
              style={{ color: COLORS.textSecondary }}
            >
              • {formatTimeAgo(comment.createdAt, isRTL)}
            </span>

            {comment.isEdited && (
              <span
                className="text-[10px] italic opacity-60"
                style={{ color: COLORS.textSecondary }}
                title={comment.editedAt ? new Date(comment.editedAt).toLocaleString() : ""}
              >
                ({isRTL ? "ترمیم شدہ" : "edited"})
              </span>
            )}
          </div>

          {!isEditing && (
            <CommentMenu
              canEdit={canEdit}
              onEdit={() => onStartEdit(comment)}
              canDelete={canDelete}
              onDelete={() => onDeleteRequest(comment)}
              isRTL={isRTL}
            />
          )}
        </div>

        {/* Reply-To Target Pill Banner for Instant Context */}
        {replyTargetName && !isEditing && (
          <div className="mb-1.5">
            <span
              className="inline-flex items-center gap-1 text-[10.5px] font-bold px-2 py-0.5 rounded-full border shadow-2xs"
              style={{
                backgroundColor: `${COLORS.accent}14`,
                borderColor: `${COLORS.accent}35`,
                color: COLORS.primary,
              }}
            >
              <span className="opacity-75 font-normal">
                {isRTL ? "↩ جواب برائے:" : "↩ Replying to:"}
              </span>
              <span style={{ color: COLORS.accent }}>@{replyTargetName}</span>
            </span>
          </div>
        )}

        {/* Comment Body / Edit Mode */}
        {isEditing ? (
          <div
            className="mt-1 mb-2 p-2.5 rounded-xl border shadow-2xs"
            style={{
              backgroundColor: COLORS.white,
              borderColor: COLORS.accent,
            }}
          >
            <textarea
              ref={editTextareaRef}
              rows={2}
              value={editText}
              onChange={(e) => {
                setEditText(e.target.value);
                e.target.style.height = "auto";
                e.target.style.height = `${e.target.scrollHeight}px`;
              }}
              className="w-full bg-transparent border-none outline-none text-xs sm:text-[13px] leading-relaxed resize-none"
              style={{ color: COLORS.textPrimary }}
              maxLength={2000}
            />
            <div className="flex items-center justify-end gap-2 pt-2 mt-1 border-t border-neutral-100">
              <button
                type="button"
                onClick={onCancelEdit}
                className="px-2.5 py-1 rounded-lg text-xs font-semibold text-neutral-600 hover:bg-neutral-100 transition-colors cursor-pointer"
                disabled={isSaving}
              >
                {isRTL ? "منسوخ" : "Cancel"}
              </button>
              <button
                type="button"
                onClick={handleSave}
                disabled={!editText.trim() || isSaving}
                className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-bold text-white shadow-xs transition-all hover:opacity-90 disabled:opacity-40 cursor-pointer"
                style={{ backgroundColor: COLORS.primary }}
              >
                {isSaving ? (
                  <span className="w-3 h-3 border-2 border-white border-t-transparent rounded-full animate-spin" />
                ) : (
                  <Check className="w-3 h-3" style={{ color: COLORS.accent }} />
                )}
                <span>
                  {isSaving
                    ? isRTL
                      ? "محفوظ ہو رہا ہے..."
                      : "Saving..."
                    : isRTL
                    ? "محفوظ کریں"
                    : "Save"}
                </span>
              </button>
            </div>
          </div>
        ) : (
          <div
            className="text-xs sm:text-[13px] leading-relaxed mb-2 break-words font-normal"
            style={{ color: COLORS.textPrimary }}
          >
            <span className="whitespace-pre-wrap">{cleanText}</span>
          </div>
        )}

        {/* Action Row: Friendly Touch-Ready Reply Pill Button */}
        {!isEditing && (
          <div className="flex items-center gap-2 mt-0.5">
            <button
              type="button"
              onClick={() => onReplyClick(comment)}
              className="inline-flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded-full border transition-all hover:shadow-2xs active:scale-95 cursor-pointer"
              style={{
                borderColor: `${COLORS.border}70`,
                backgroundColor: COLORS.white,
                color: COLORS.primary,
              }}
              title={isRTL ? "اس تبصرے کا جواب دیں" : "Reply to this comment"}
            >
              <Reply className="w-3 h-3" style={{ color: COLORS.accent }} />
              <span>{isRTL ? "جواب دیں" : "Reply"}</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
