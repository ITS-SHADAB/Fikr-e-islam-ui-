import React, { useEffect, useRef, useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { X, Send, BarChart2 } from "lucide-react";
import { getComments, createComment, deleteComment } from "@/services";
import { ConfirmationBox } from "@/components";
import toast from "react-hot-toast";

/* ─────────────────────────────────────────
   Helpers
───────────────────────────────────────── */

function formatTimeAgo(dateStr) {
  if (!dateStr) return "";
  const diffMs = Date.now() - new Date(dateStr).getTime();
  const mins = Math.floor(diffMs / 60000);
  const hours = Math.floor(diffMs / 3600000);
  const days = Math.floor(diffMs / 86400000);
  if (mins < 1) return "now";
  if (mins < 60) return `${mins}m`;
  if (hours < 24) return `${hours}h`;
  if (days < 7) return `${days}d`;
  return `${Math.floor(days / 7)}w`;
}

function isCurrentUserComment(commentUser, loggedInUser) {
  if (!commentUser || !loggedInUser) return false;
  const commentUserId = commentUser._id || commentUser;
  return String(commentUserId) === String(loggedInUser._id);
}

/* ─────────────────────────────────────────
   Avatar
───────────────────────────────────────── */
const AVATAR_COLORS = [
  "#3d6b4f",
  "#7c4da0",
  "#c0602a",
  "#2563eb",
  "#be185d",
  "#0f766e",
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

  const style = {
    width: size,
    height: size,
    minWidth: size,
    borderRadius: "50%",
    backgroundColor: color,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    color: "#fff",
    fontWeight: 800,
    fontSize: Math.round(size * 0.4),
    overflow: "hidden",
    flexShrink: 0,
    userSelect: "none",
  };

  if (imgUrl) {
    return (
      <img src={imgUrl} alt={name} style={{ ...style, objectFit: "cover" }} />
    );
  }
  return <div style={style}>{initial}</div>;
}

/* ─────────────────────────────────────────
   Heart Button
───────────────────────────────────────── */
function HeartButton({ count = 0, liked = false, onToggle }) {
  return (
    <button
      type="button"
      onClick={onToggle}
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: 2,
        background: "none",
        border: "none",
        cursor: "pointer",
        padding: "2px 4px",
        color: liked ? "#e53e3e" : "#9ca3af",
        minWidth: 24,
      }}
    >
      <svg
        width="18"
        height="18"
        viewBox="0 0 24 24"
        fill={liked ? "currentColor" : "none"}
        stroke="currentColor"
        strokeWidth="1.8"
      >
        <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
      </svg>
      <span
        style={{
          fontSize: 11,
          lineHeight: 1,
          color: "#6b7280",
          fontWeight: 500,
        }}
      >
        {count}
      </span>
    </button>
  );
}

/* ─────────────────────────────────────────
   Single Comment Row
───────────────────────────────────────── */
function CommentRow({
  comment,
  isReply = false,
  isHighlighted = false,
  onReply,
  onDelete,
  canDelete,
}) {
  const [liked, setLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(comment.likes || 0);
  const isAuthor = comment.user?.role === "admin" || comment.isAuthor;

  const rowStyle = {
    display: "flex",
    alignItems: "flex-start",
    gap: 10,
    padding: isReply ? "8px 12px 8px 12px" : "10px 16px",
    backgroundColor: isHighlighted ? "#f0fdf4" : "transparent",
    borderRadius: isHighlighted ? 8 : 0,
    position: "relative",
  };

  const handleLike = () => {
    setLiked((prev) => {
      setLikeCount((c) => (prev ? c - 1 : c + 1));
      return !prev;
    });
  };

  return (
    <div style={rowStyle}>
      {/* Avatar */}
      <UserAvatar user={comment.user} size={isReply ? 32 : 36} />

      {/* Body */}
      <div style={{ flex: 1, minWidth: 0 }}>
        {/* Header row */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 6,
            flexWrap: "wrap",
            marginBottom: 2,
          }}
        >
          <span style={{ fontWeight: 700, fontSize: 13, color: "#111827" }}>
            {comment.user?.name || "User"}
          </span>
          <span style={{ fontSize: 12, color: "#9ca3af" }}>·</span>
          <span style={{ fontSize: 12, color: "#9ca3af" }}>
            {formatTimeAgo(comment.createdAt)}
          </span>
          {isAuthor && (
            <span
              style={{
                fontSize: 11,
                fontWeight: 600,
                color: "#374151",
                backgroundColor: "#f3f4f6",
                border: "1px solid #d1d5db",
                borderRadius: 4,
                padding: "1px 6px",
              }}
            >
              Author
            </span>
          )}
          {/* Three-dot menu for own / admin */}
          {canDelete && (
            <button
              type="button"
              onClick={onDelete}
              style={{
                marginLeft: "auto",
                background: "none",
                border: "none",
                cursor: "pointer",
                color: "#9ca3af",
                padding: "0 4px",
                fontSize: 18,
                lineHeight: 1,
                display: "flex",
                alignItems: "center",
                letterSpacing: 1,
              }}
              title="Delete comment"
            >
              ···
            </button>
          )}
        </div>

        {/* Comment text */}
        <p
          style={{
            fontSize: 13,
            color: "#1f2937",
            lineHeight: 1.5,
            margin: 0,
            wordBreak: "break-word",
          }}
        >
          {comment.replyToUser?.name && (
            <span style={{ color: "#2563eb", fontWeight: 600, marginRight: 4 }}>
              @{comment.replyToUser.name}
            </span>
          )}
          {comment.text}
        </p>

        {/* Reply link */}
        <button
          type="button"
          onClick={onReply}
          style={{
            background: "none",
            border: "none",
            padding: 0,
            fontSize: 12,
            color: "#6b7280",
            fontWeight: 600,
            cursor: "pointer",
            marginTop: 4,
          }}
        >
          Reply
        </button>
      </div>

      {/* Heart */}
      <HeartButton count={likeCount} liked={liked} onToggle={handleLike} />
    </div>
  );
}

/* ─────────────────────────────────────────
   Reply Thread — connected vertical line
───────────────────────────────────────── */
function ReplyThread({
  replies,
  parentComment,
  activeReplyId,
  onReply,
  onDelete,
  loggedInUser,
  isAdmin,
}) {
  const [expanded, setExpanded] = useState(false);
  if (!replies || replies.length === 0) return null;

  const LINE_COLOR  = '#c7d2fe'; // indigo-200
  const LINE_WIDTH  = 2;
  const INDENT      = 20;         // from left of avatar

  return (
    <div style={{ paddingLeft: 20 }}>

      {/* ── Toggle button ── */}
      <button
        type="button"
        onClick={() => setExpanded(v => !v)}
        style={{
          background: 'none', border: 'none',
          padding: '2px 0 6px',
          cursor: 'pointer',
          display: 'flex', alignItems: 'center', gap: 8,
          color: '#6366f1', fontSize: 12, fontWeight: 700,
          letterSpacing: '0.01em',
        }}
      >
        {/* Short horizontal tick */}
        <span style={{
          display: 'inline-block',
          width: 20, height: LINE_WIDTH,
          background: `linear-gradient(to right, ${LINE_COLOR}, #6366f1)`,
          borderRadius: 2,
        }} />
        {expanded
          ? 'Hide replies'
          : `View ${replies.length} ${replies.length === 1 ? 'reply' : 'replies'}`}
      </button>

      {/* ── Connected reply list ── */}
      {expanded && (
        <div style={{ position: 'relative' }}>

          {/* Continuous vertical line */}
          <div style={{
            position: 'absolute',
            left: INDENT,
            top: 0,
            bottom: 18,           // stops just before last reply's center
            width: LINE_WIDTH,
            background: `linear-gradient(to bottom, #6366f1 0%, ${LINE_COLOR} 100%)`,
            borderRadius: 2,
          }} />

          {replies.map((reply, idx) => {
            const isLast  = idx === replies.length - 1;
            const own     = isCurrentUserComment(reply.user, loggedInUser);
            const canDel  = Boolean(loggedInUser && (isAdmin || own));
            const isHl    = activeReplyId === reply._id;

            return (
              <div key={reply._id} style={{ display: 'flex', alignItems: 'flex-start', marginBottom: 4 }}>

                {/* Connector arm: vertical stub + horizontal dash */}
                <div style={{ position: 'relative', width: INDENT + 16, flexShrink: 0, alignSelf: 'stretch' }}>
                  {/* Horizontal branch */}
                  <div style={{
                    position: 'absolute',
                    left: INDENT,
                    top: 20,          // align with avatar center
                    width: 16,
                    height: LINE_WIDTH,
                    backgroundColor: LINE_COLOR,
                    borderRadius: '0 2px 2px 0',
                  }} />
                  {/* Curved corner for last reply */}
                  {isLast && (
                    <div style={{
                      position: 'absolute',
                      left: INDENT,
                      top: 20,
                      width: 10, height: 10,
                      borderLeft: `${LINE_WIDTH}px solid ${LINE_COLOR}`,
                      borderBottom: `${LINE_WIDTH}px solid ${LINE_COLOR}`,
                      borderBottomLeftRadius: 8,
                      background: 'transparent',
                      transform: 'translateY(-100%)',
                    }} />
                  )}
                </div>

                {/* Reply card — takes remaining width */}
                <div style={{ flex: 1, minWidth: 0 }}>
                  <CommentRow
                    comment={reply}
                    isReply
                    isHighlighted={isHl}
                    onReply={() => onReply(reply._id, parentComment._id, reply.user)}
                    onDelete={() => onDelete(reply)}
                    canDelete={canDel}
                  />
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}


/* ─────────────────────────────────────────
   Emoji Reaction Bar
───────────────────────────────────────── */
const EMOJIS = ["❤️", "🙌", "🔥", "🎉", "😢", "😍", "😮", "😂"];

function EmojiBar({ onSelect }) {
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        gap: 4,
        padding: "8px 16px",
        borderTop: "1px solid #f3f4f6",
        borderBottom: "1px solid #f3f4f6",
        backgroundColor: "#fff",
      }}
    >
      {EMOJIS.map((emoji) => (
        <button
          key={emoji}
          type="button"
          onClick={() => onSelect && onSelect(emoji)}
          style={{
            background: "none",
            border: "none",
            cursor: "pointer",
            fontSize: 22,
            padding: "2px 4px",
            borderRadius: 6,
            transition: "transform 0.15s",
            lineHeight: 1,
          }}
          onMouseEnter={(e) =>
            (e.currentTarget.style.transform = "scale(1.25)")
          }
          onMouseLeave={(e) => (e.currentTarget.style.transform = "scale(1)")}
        >
          {emoji}
        </button>
      ))}
    </div>
  );
}

/* ─────────────────────────────────────────
   Main CommentsSection
───────────────────────────────────────── */
export default function CommentsSection({ contentType, contentId, onClose }) {
  const navigate = useNavigate();
  const { isAuthenticated, loggedInUser } = useSelector((state) => state.auth);
  const isAdmin = loggedInUser?.role === "admin";

  // Comments list
  const [commentsList, setCommentsList] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  // New comment / reply input
  const [newCommentText, setNewCommentText] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Reply state
  const [activeReplyTargetId, setActiveReplyTargetId] = useState(null);
  const [replyParentId, setReplyParentId] = useState(null);
  const [replyToUser, setReplyToUser] = useState(null);

  // Delete confirmation
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [commentToDelete, setCommentToDelete] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const inputRef = useRef(null);

  // ── Fetch comments
  const loadComments = async () => {
    try {
      const response = await getComments(contentType, contentId);
      setCommentsList(response.comments || []);
    } catch (error) {
      console.warn("Failed to fetch comments", error);
    }
  };

  useEffect(() => {
    if (contentType && contentId) {
      setIsLoading(true);
      loadComments().finally(() => setIsLoading(false));
    }
  }, [contentType, contentId]);

  // ── Post comment or reply
  const handlePostComment = async (e) => {
    e && e.preventDefault();
    if (!isAuthenticated) {
      navigate("/login");
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
        // posting a reply
        await createComment({
          contentType,
          contentId,
          text,
          parentComment: replyParentId,
          replyToUser: replyToUser?._id || null,
        });
        toast.success("Reply posted!");
        setActiveReplyTargetId(null);
        setReplyParentId(null);
        setReplyToUser(null);
      } else {
        await createComment({ contentType, contentId, text });
        toast.success("Comment posted!");
      }
      setNewCommentText("");
      await loadComments();
    } catch (error) {
      toast.error(error?.response?.data?.message || "Failed to post");
    } finally {
      setIsSubmitting(false);
    }
  };

  // ── Start reply: pre-fill input with @mention
  const startReply = (targetId, parentId, user) => {
    if (!isAuthenticated) {
      navigate("/login");
      return;
    }
    setActiveReplyTargetId(targetId);
    setReplyParentId(parentId);
    setReplyToUser(user);
    setNewCommentText(`@${user?.name || ""} `);
    setTimeout(() => inputRef.current?.focus(), 50);
  };

  // ── Delete
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
    } catch (error) {
      toast.error(error?.response?.data?.message || "Failed to delete");
    } finally {
      setIsDeleting(false);
    }
  };

  const totalCount = commentsList.reduce(
    (acc, c) => acc + 1 + (c.replies?.length || 0),
    0
  );

  const inputPlaceholder = activeReplyTargetId
    ? `Replying to @${replyToUser?.name || ""}...`
    : "Add a comment...";

  return (
    <div
      dir="ltr"
      style={{
        display: "flex",
        flexDirection: "column",
        height: "100%",
        maxHeight: "100%",
        backgroundColor: "#fff",
        fontFamily:
          "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
        overflow: "hidden",
        borderRadius: 12,
        textAlign: "left",
      }}
    >
      {/* ──────────────────── HEADER ──────────────────── */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "12px 16px 10px",
          borderBottom: "1px solid #f3f4f6",
          flexShrink: 0,
        }}
      >
        {/* Center: title + count */}
        <div style={{ textAlign: "center" }}>
          <div
            style={{
              maxHeight: 300,
              overflowY: "auto",
              overflowX: "hidden",
              padding: "12px 14px 4px",
            }}
          >
            {totalCount} comments
          </div>
        </div>
      </div>

      {/* ──────────────────── COMMENTS LIST ──────────────────── */}
      <div
        style={{
          maxHeight: 300,
          overflowY: "auto",
          overflowX: "hidden",
        }}
      >
        {isLoading ? (
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              height: 120,
              gap: 10,
            }}
          >
            <div
              style={{
                width: 24,
                height: 24,
                border: "2px solid #e5e7eb",
                borderTopColor: "#374151",
                borderRadius: "50%",
                animation: "cs-spin 0.7s linear infinite",
              }}
            />
            <span style={{ fontSize: 12, color: "#6b7280" }}>
              Loading comments…
            </span>
          </div>
        ) : commentsList.length === 0 ? (
          <div
            style={{
              textAlign: "center",
              padding: "40px 24px",
              color: "#9ca3af",
              fontSize: 13,
            }}
          >
            No comments yet. Be the first to comment!
          </div>
        ) : (
          commentsList.map((parentComment) => {
            const replies = parentComment.replies || [];
            const isOwn = isCurrentUserComment(
              parentComment.user,
              loggedInUser
            );
            const canDel = Boolean(loggedInUser && (isAdmin || isOwn));

            return (
              <div key={parentComment._id}>
                {/* Thin divider */}
                <div
                  style={{
                    height: 1,
                    backgroundColor: "#f9fafb",
                    margin: "0 16px",
                  }}
                />

                {/* Parent comment */}
                <CommentRow
                  comment={parentComment}
                  isReply={false}
                  isHighlighted={false}
                  onReply={() =>
                    startReply(
                      parentComment._id,
                      parentComment._id,
                      parentComment.user
                    )
                  }
                  onDelete={() => handleDeleteRequest(parentComment)}
                  canDelete={canDel}
                />

                {/* Replies thread */}
                {replies.length > 0 && (
                  <ReplyThread
                    replies={replies}
                    parentComment={parentComment}
                    activeReplyId={activeReplyTargetId}
                    onReply={startReply}
                    onDelete={handleDeleteRequest}
                    loggedInUser={loggedInUser}
                    isAdmin={isAdmin}
                  />
                )}
              </div>
            );
          })
        )}
      </div>

      {/* ──────────────────── EMOJI BAR ──────────────────── */}
      <EmojiBar
        onSelect={(emoji) => {
          setNewCommentText((prev) => prev + emoji);
          inputRef.current?.focus();
        }}
      />

      {/* ──────────────────── COMMENT INPUT ──────────────────── */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 10,
          padding: "10px 16px 12px",
          borderTop: "1px solid #f3f4f6",
          backgroundColor: "#fff",
          flexShrink: 0,
        }}
      >
        {/* Current user avatar */}
        <UserAvatar user={loggedInUser} size={36} />

        {/* Pill-shaped input */}
        <div
          style={{
            flex: 1,
            backgroundColor: "#f3f4f6",
            borderRadius: 24,
            display: "flex",
            alignItems: "center",
            padding: "0 14px",
            height: 40,
            border: "1px solid #e5e7eb",
          }}
        >
          <input
            ref={inputRef}
            type="text"
            value={newCommentText}
            onChange={(e) => setNewCommentText(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                handlePostComment(e);
              }
              if (e.key === "Escape") {
                setActiveReplyTargetId(null);
                setReplyParentId(null);
                setReplyToUser(null);
                setNewCommentText("");
              }
            }}
            placeholder={inputPlaceholder}
            style={{
              flex: 1,
              background: "none",
              border: "none",
              outline: "none",
              fontSize: 13,
              color: "#111827",
              minWidth: 0,
            }}
          />
        </div>

        {/* Send button */}
        <button
          type="button"
          onClick={handlePostComment}
          disabled={isSubmitting || !newCommentText.trim()}
          style={{
            background: "none",
            border: "none",
            cursor: newCommentText.trim() ? "pointer" : "default",
            padding: 4,
            color: newCommentText.trim() ? "#374151" : "#d1d5db",
            display: "flex",
            alignItems: "center",
            transition: "color 0.2s",
          }}
        >
          <Send style={{ width: 22, height: 22 }} />
        </button>
      </div>

      {/* ── Keyframe for spinner ── */}
      <style>{`
        @keyframes cs-spin {
          to { transform: rotate(360deg); }
        }
      `}</style>

      {/* ── Delete Confirmation Dialog ── */}
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
            ? `Are you sure you want to delete this comment?\n\n"${commentToDelete.text.slice(0, 100)}${
                commentToDelete.text.length > 100 ? "..." : ""
              }"`
            : "Are you sure you want to delete this comment?"
        }
        type="danger"
        confirmText="Delete"
        cancelText="Cancel"
        isLoading={isDeleting}
      />
    </div>
  );
}
