import React, { useEffect, useRef, useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import {
  getComments,
  createComment,
  deleteComment,
  updateComment,
} from "@/services";
import { ConfirmationBox } from "@/components";
import Modal from "@/components/Modal/Modal";
import Login from "@/pages/Admin/pages/Login";
import Signup from "@/pages/Admin/pages/Signup";
import toast from "react-hot-toast";

function formatTimeAgo(dateStr) {
  if (!dateStr) return "";
  const diffMs = Date.now() - new Date(dateStr).getTime();
  const mins = Math.floor(diffMs / 60000);
  const hours = Math.floor(diffMs / 3600000);
  const days = Math.floor(diffMs / 86400000);
  const weeks = Math.floor(days / 7);
  const months = Math.floor(days / 30);
  const years = Math.floor(days / 365);
  if (mins < 1) return "just now";
  if (mins < 60) return `${mins}m ago`;
  if (hours < 24) return `${hours}h ago`;
  if (days < 7) return `${days}d ago`;
  if (weeks < 5) return `${weeks}w ago`;
  if (months < 12) return `${months}mo ago`;
  return `${years}y ago`;
}

function isCurrentUserComment(commentUser, loggedInUser) {
  if (!commentUser || !loggedInUser) return false;
  return String(commentUser._id || commentUser) === String(loggedInUser._id);
}

const AVATAR_COLORS = [
  "#1a73e8",
  "#e37400",
  "#0f9d58",
  "#d93025",
  "#7c4dff",
  "#00897b",
  "#c2185b",
  "#6d4c41",
];

function getAvatarColor(name = "") {
  let hash = 0;
  for (let i = 0; i < name.length; i++)
    hash = name.charCodeAt(i) + ((hash << 5) - hash);
  return AVATAR_COLORS[Math.abs(hash) % AVATAR_COLORS.length];
}

function UserAvatar({ user, size = 36 }) {
  const name = user?.name || "U";
  const initial = name.trim().charAt(0).toUpperCase();
  const imgUrl =
    typeof user?.profileImage === "string"
      ? user.profileImage
      : user?.profileImage?.url;
  const color = getAvatarColor(name);

  if (imgUrl) {
    return (
      <img
        src={imgUrl}
        alt={name}
        className="rounded-full object-cover shrink-0 select-none"
        style={{ width: size, height: size, minWidth: size }}
      />
    );
  }

  return (
    <div
      className="rounded-full flex items-center justify-center text-white font-bold select-none shrink-0 overflow-hidden"
      style={{
        width: size,
        height: size,
        minWidth: size,
        fontSize: Math.round(size * 0.44),
        backgroundColor: color,
        lineHeight: 1,
      }}
    >
      <span className="leading-none flex items-center justify-center text-center">
        {initial}
      </span>
    </div>
  );
}

function ThreeDotMenu({ onEdit, canEdit, onDelete, canDelete }) {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const close = (e) => {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    };
    document.addEventListener("mousedown", close);
    return () => document.removeEventListener("mousedown", close);
  }, []);

  if (!canEdit && !canDelete) return null;

  return (
    <div ref={ref} className="relative shrink-0">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="w-7 h-7 rounded-full flex items-center justify-center text-[#606060] hover:bg-[#f2f2f2] transition-colors"
        title="More actions"
      >
        <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="currentColor">
          <circle cx="12" cy="5" r="2" />
          <circle cx="12" cy="12" r="2" />
          <circle cx="12" cy="19" r="2" />
        </svg>
      </button>
      {open && (
        <div className="absolute right-0 top-[30px] bg-white rounded-lg shadow-[0_2px_12px_rgba(0,0,0,0.18)] z-50 min-w-[140px] overflow-hidden border border-neutral-100 py-1">
          {canEdit && (
            <button
              type="button"
              onClick={() => {
                setOpen(false);
                onEdit();
              }}
              className="flex items-center gap-2 w-full px-3.5 py-2 text-left text-xs text-[#0f0f0f] hover:bg-[#f2f2f2] font-medium transition-colors"
            >
              <svg
                className="w-3.5 h-3.5"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M12 20h9" />
                <path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z" />
              </svg>
              Edit
            </button>
          )}
          {canDelete && (
            <button
              type="button"
              onClick={() => {
                setOpen(false);
                onDelete();
              }}
              className="flex items-center gap-2 w-full px-3.5 py-2 text-left text-xs text-red-600 hover:bg-red-50 font-medium transition-colors"
            >
              <svg
                className="w-3.5 h-3.5"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <polyline points="3 6 5 6 21 6" />
                <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
              </svg>
              Delete
            </button>
          )}
        </div>
      )}
    </div>
  );
}

function CommentRow({
  comment,
  isReply = false,
  onReply,
  onEdit,
  onDelete,
  canEdit,
  canDelete,
  isEditing = false,
  onSaveEdit,
  onCancelEdit,
}) {
  const [editText, setEditText] = useState(comment.text || "");
  const [isSaving, setIsSaving] = useState(false);
  const editInputRef = useRef(null);
  const isAuthor = comment.user?.role === "admin" || comment.isAuthor;

  useEffect(() => {
    if (isEditing) {
      setEditText(comment.text || "");
      setTimeout(() => editInputRef.current?.focus(), 50);
    }
  }, [isEditing, comment.text]);

  const handleSave = async () => {
    if (!editText.trim()) return;
    try {
      setIsSaving(true);
      await onSaveEdit(comment._id, editText);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div
      className={`flex items-start ${isReply ? "gap-2 py-1.5 px-3" : "gap-2.5 py-2 px-3"}`}
    >
      <UserAvatar user={comment.user} size={isReply ? 22 : 26} />
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-1.5 mb-0.5">
          <span className="font-semibold text-xs text-[#0f0f0f]">
            {comment?.user?.name || "User"}
          </span>
          {isAuthor && (
            <span className="text-[10px] font-semibold text-emerald-800 bg-emerald-100 rounded px-1.5 py-0.5 leading-none">
              Author
            </span>
          )}
          <span className="text-[11px] text-[#909090]">
            {formatTimeAgo(comment.createdAt)}
          </span>
          {comment.updatedAt && comment.updatedAt !== comment.createdAt && (
            <span className="text-[10px] text-neutral-400 leading-none">
              (edited)
            </span>
          )}
          <div className="ml-auto">
            <ThreeDotMenu
              canEdit={canEdit}
              onEdit={onEdit}
              canDelete={canDelete}
              onDelete={onDelete}
            />
          </div>
        </div>

        {isEditing ? (
          <div className="mt-1 mb-1.5">
            <input
              ref={editInputRef}
              type="text"
              value={editText}
              onChange={(e) => setEditText(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  handleSave();
                }
                if (e.key === "Escape") onCancelEdit();
              }}
              className="w-full bg-[#f9f9f9] border border-[#d3d3d3] rounded-lg px-2.5 py-1.5 text-xs sm:text-[13px] text-[#0f0f0f] outline-none focus:border-neutral-900 transition-colors"
            />
            <div className="flex justify-end gap-1.5 mt-1.5">
              <button
                type="button"
                onClick={onCancelEdit}
                className="px-3 py-1 rounded-full bg-[#f2f2f2] hover:bg-[#e5e5e5] text-xs font-semibold text-[#606060] transition-colors"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleSave}
                disabled={isSaving || !editText.trim()}
                className={`px-3 py-1 rounded-full text-xs font-semibold transition-colors ${
                  editText.trim()
                    ? "bg-[#065fd4] hover:bg-[#0551b4] text-white cursor-pointer"
                    : "bg-[#e5e5e5] text-[#909090] cursor-default"
                }`}
              >
                {isSaving ? "Saving..." : "Save"}
              </button>
            </div>
          </div>
        ) : (
          <p className="text-[13px] text-[#0f0f0f] leading-relaxed mb-1 break-words">
            {comment.replyToUser?.name && (
              <span className="text-[#065fd4] font-semibold mr-1.5 select-none">
                @{comment.replyToUser.name}
              </span>
            )}
            {(() => {
              let displayText = comment.text || "";
              if (comment.replyToUser?.name) {
                const prefixRegex = new RegExp(
                  `^@${comment.replyToUser.name}\\s*`,
                  "i"
                );
                displayText = displayText.replace(prefixRegex, "");
              }
              return displayText;
            })()}
          </p>
        )}

        {!isEditing && (
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onReply}
              className="px-2.5 py-0.5 rounded-full text-xs font-semibold text-[#606060] hover:bg-[#f2f2f2] transition-colors"
            >
              Reply
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

function ReplyThread({
  replies,
  parentComment,
  activeReplyId,
  onReply,
  onEdit,
  onDelete,
  loggedInUser,
  isAdmin,
  editingCommentId,
  onSaveEdit,
  onCancelEdit,
}) {
  const [expanded, setExpanded] = useState(false);
  if (!replies || replies.length === 0) return null;

  return (
    <div className="pl-11">
      <button
        type="button"
        onClick={() => setExpanded((v) => !v)}
        className="flex items-center gap-1.5 text-[#065fd4] text-xs sm:text-[13px] font-semibold px-2 py-1 rounded-full hover:bg-[#e8f0fe] mb-0.5 transition-colors"
      >
        <svg
          className={`w-3.5 h-3.5 transition-transform duration-200 ${expanded ? "rotate-180" : ""}`}
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.5"
        >
          <polyline points="6 9 12 15 18 9" />
        </svg>
        {expanded
          ? "Hide replies"
          : `${replies.length} ${replies.length === 1 ? "reply" : "replies"}`}
      </button>
      {expanded &&
        replies.map((reply) => {
          const own = isCurrentUserComment(reply.user, loggedInUser);
          const canDel = Boolean(loggedInUser && (isAdmin || own));
          const hasNoReplies = !reply.replies || reply.replies.length === 0;
          const canEdit = Boolean(
            loggedInUser && (isAdmin || own) && hasNoReplies
          );
          return (
            <CommentRow
              key={reply._id}
              comment={reply}
              isReply
              isHighlighted={activeReplyId === reply._id}
              onReply={() => onReply(reply._id, parentComment._id, reply.user)}
              onEdit={() => onEdit(reply)}
              onDelete={() => onDelete(reply)}
              canEdit={canEdit}
              canDelete={canDel}
              isEditing={editingCommentId === reply._id}
              onSaveEdit={onSaveEdit}
              onCancelEdit={onCancelEdit}
            />
          );
        })}
    </div>
  );
}

export default function CommentsSection({ contentType, contentId }) {
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authMode, setAuthMode] = useState("login"); // "login" | "signup"

  const openLogin = () => {
    setAuthMode("login");
    setIsAuthModalOpen(true);
  };

  const openSignup = () => {
    setAuthMode("signup");
    setIsAuthModalOpen(true);
  };

  const closeAuthModal = () => {
    setIsAuthModalOpen(false);
  };

  const { loggedInUser, isAuthenticated, userRole } = useSelector(
    (s) => s.auth
  );
  const isAdmin = userRole === "admin";

  useEffect(() => {
    if (isAuthenticated && isAuthModalOpen) {
      setIsAuthModalOpen(false);
    }
  }, [isAuthenticated, isAuthModalOpen]);

  const [commentsList, setCommentsList] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [newCommentText, setNewCommentText] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [inputFocused, setInputFocused] = useState(false);
  const [activeReplyTargetId, setActiveReplyTargetId] = useState(null);
  const [replyParentId, setReplyParentId] = useState(null);
  const [replyToUser, setReplyToUser] = useState(null);
  const [editingCommentId, setEditingCommentId] = useState(null);
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [commentToDelete, setCommentToDelete] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const inputRef = useRef(null);

  const loadComments = async () => {
    try {
      const res = await getComments(contentType, contentId);
      setCommentsList(res.comments || []);
    } catch (e) {
      console.warn("Failed to fetch comments", e);
    }
  };

  useEffect(() => {
    if (contentType && contentId) {
      setIsLoading(true);
      loadComments().finally(() => setIsLoading(false));
    }
  }, [contentType, contentId]);

  const totalCount = commentsList.reduce(
    (acc, c) => acc + 1 + (c.replies?.length || 0),
    0
  );

  const cancelInput = () => {
    setInputFocused(false);
    setNewCommentText("");
    setActiveReplyTargetId(null);
    setReplyParentId(null);
    setReplyToUser(null);
  };

  const handlePostComment = async (e) => {
    e && e.preventDefault();
    if (!isAuthenticated) {
      openLogin();
      return;
    }
    const text = newCommentText.trim();
    if (!text) {
      toast.error("Please write a comment");
      return;
    }
    try {
      setIsSubmitting(true);
      if (activeReplyTargetId && replyParentId) {
        await createComment({
          contentType,
          contentId,
          text,
          parentComment: replyParentId,
          replyToUser: replyToUser?._id || null,
        });
        toast.success("Reply posted!");
      } else {
        await createComment({ contentType, contentId, text });
        toast.success("Comment posted!");
      }
      cancelInput();
      await loadComments();
    } catch (err) {
      toast.error(err?.response?.data?.message || "Failed to post");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleStartEdit = (comment) => {
    setEditingCommentId(comment._id);
  };

  const handleCancelEdit = () => {
    setEditingCommentId(null);
  };

  const handleSaveEdit = async (commentId, newText) => {
    const text = newText.trim();
    if (!text) {
      toast.error("Comment cannot be empty");
      return;
    }
    try {
      await updateComment(commentId, { text });
      toast.success("Comment updated!");
      setEditingCommentId(null);
      await loadComments();
    } catch (err) {
      toast.error(err?.response?.data?.message || "Failed to update comment");
    }
  };

  const startReply = (targetId, parentId, user) => {
    if (!isAuthenticated) {
      openLogin();
      return;
    }
    setActiveReplyTargetId(targetId);
    setReplyParentId(parentId);
    setReplyToUser(user);
    setNewCommentText("");
    setInputFocused(true);
    setTimeout(() => inputRef.current?.focus(), 50);
  };

  const handleDeleteRequest = (comment) => {
    setCommentToDelete({ id: comment._id, text: comment.text });
    setIsConfirmOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (!commentToDelete?.id) return;
    try {
      setIsDeleting(true);
      await deleteComment(commentToDelete.id);
      toast.success("Comment deleted");
      setIsConfirmOpen(false);
      setCommentToDelete(null);
      await loadComments();
    } catch (err) {
      toast.error(err?.response?.data?.message || "Failed to delete");
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div
      dir="ltr"
      className="flex flex-col bg-white rounded-lg text-left relative max-h-[480px]"
    >
      {/* â”€â”€ HEADER: title + count â”€â”€ */}
      <div className="p-3 pb-2 shrink-0 border-b border-[#f2f2f2]">
        <div className="flex items-center gap-2.5">
          <span className="text-[15px] font-semibold text-[#0f0f0f]">
            Comments
          </span>
          {totalCount > 0 && (
            <span className="text-[13px] text-[#606060]">{totalCount}</span>
          )}
        </div>
      </div>

      {/* â”€â”€ COMMENTS LIST (Scrollable Middle) â”€â”€ */}
      <div className="flex-1 overflow-y-auto overflow-x-hidden min-h-[160px]">
        {isLoading ? (
          <div className="flex flex-col items-center justify-center h-28 gap-2">
            <div className="w-5 h-5 border-2 border-neutral-300 border-t-neutral-900 rounded-full animate-spin" />
            <span className="text-xs text-[#909090]">Loadingâ€¦</span>
          </div>
        ) : commentsList.length === 0 ? (
          <div className="text-center py-8 px-4 text-[#909090] text-[13px]">
            <div className="text-2xl mb-1.5">ðŸ’¬</div>
            No comments yet. Be the first!
          </div>
        ) : (
          commentsList.map((parentComment) => {
            const replies = parentComment.replies || [];
            const isOwn = isCurrentUserComment(
              parentComment.user,
              loggedInUser
            );
            const canDel = Boolean(loggedInUser && (isAdmin || isOwn));
            const hasNoReplies =
              !parentComment.replies || parentComment.replies.length === 0;
            const canEdit = Boolean(
              loggedInUser && (isAdmin || isOwn) && hasNoReplies
            );

            return (
              <div key={parentComment._id}>
                <CommentRow
                  comment={parentComment}
                  isReply={false}
                  onReply={() =>
                    startReply(
                      parentComment._id,
                      parentComment._id,
                      parentComment.user
                    )
                  }
                  onEdit={() => handleStartEdit(parentComment)}
                  onDelete={() => handleDeleteRequest(parentComment)}
                  canEdit={canEdit}
                  canDelete={canDel}
                  isEditing={editingCommentId === parentComment._id}
                  onSaveEdit={handleSaveEdit}
                  onCancelEdit={handleCancelEdit}
                />
                {replies.length > 0 && (
                  <ReplyThread
                    replies={replies}
                    parentComment={parentComment}
                    activeReplyId={activeReplyTargetId}
                    onReply={startReply}
                    onEdit={handleStartEdit}
                    onDelete={handleDeleteRequest}
                    loggedInUser={loggedInUser}
                    isAdmin={isAdmin}
                    editingCommentId={editingCommentId}
                    onSaveEdit={handleSaveEdit}
                    onCancelEdit={handleCancelEdit}
                  />
                )}
              </div>
            );
          })
        )}
      </div>

      {/* â”€â”€ FIXED BOTTOM ADD COMMENT BAR (YouTube Mobile UI) â”€â”€ */}
      <div className="sticky bottom-0 bg-white px-2.5 py-2 shrink-0 border-t border-[#e5e5e5] z-10">
        {activeReplyTargetId && (
          <div className="mb-2 flex justify-between items-center text-xs text-[#606060]">
            <span>
              Replying to{" "}
              <strong className="text-[#0f0f0f]">@{replyToUser?.name}</strong>
            </span>
            <button
              type="button"
              onClick={cancelInput}
              className="text-xs text-[#606060] hover:text-[#0f0f0f] cursor-pointer"
            >
              âœ• Cancel
            </button>
          </div>
        )}
        <div className="flex gap-2 items-center">
          <UserAvatar user={loggedInUser} size={24} />
          <div className="flex-1 bg-[#f2f2f2] rounded-full flex items-center px-3 py-1 min-h-[36px]">
            <input
              ref={inputRef}
              type="text"
              value={newCommentText}
              onChange={(e) => setNewCommentText(e.target.value)}
              onFocus={() => setInputFocused(true)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  handlePostComment(e);
                }
                if (e.key === "Escape") cancelInput();
              }}
              placeholder={
                activeReplyTargetId
                  ? `Reply to @${replyToUser?.name || ""}...`
                  : "Add a comment..."
              }
              className="flex-1 bg-transparent border-none outline-none text-xs sm:text-[13px] text-[#0f0f0f] placeholder:text-neutral-500"
            />
          </div>
          <button
            type="button"
            onClick={handlePostComment}
            disabled={isSubmitting || !newCommentText.trim()}
            className={`p-1.5 flex items-center justify-center shrink-0 transition-colors ${
              newCommentText.trim()
                ? "text-[#065fd4] hover:text-[#0551b4] cursor-pointer"
                : "text-[#909090] cursor-default"
            }`}
            title="Send"
          >
            <svg
              className="w-5 h-5"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <line x1="22" y1="2" x2="11" y2="13" />
              <polygon points="22 2 15 22 11 13 2 9 22 2" />
            </svg>
          </button>
        </div>
      </div>

      <ConfirmationBox
        isOpen={isConfirmOpen}
        onClose={() => {
          setIsConfirmOpen(false);
          setCommentToDelete(null);
        }}
        onConfirm={handleConfirmDelete}
        title="Delete Comment"
        message={
          commentToDelete?.text
            ? `Delete this comment?\n\n"${commentToDelete.text.slice(0, 80)}${commentToDelete.text.length > 80 ? "..." : ""}"`
            : "Delete this comment?"
        }
        type="danger"
        confirmText="Delete"
        cancelText="Cancel"
        isLoading={isDeleting}
      />

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
