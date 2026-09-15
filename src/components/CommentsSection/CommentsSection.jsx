import React, { useState, useEffect, useCallback } from "react";
import { useSelector } from "react-redux";
import { AlertCircle, RefreshCw } from "lucide-react";
import toast from "react-hot-toast";

import {
  getComments,
  createComment,
  updateComment,
  deleteComment,
} from "@/services";
import { ConfirmationBox } from "@/components";
import { useAuthModal } from "@/context/AuthModalContext";
import { COLORS } from "@/utils/themeColors";

import CommentHeader from "./CommentHeader";
import CommentComposer from "./CommentComposer";
import CommentItem from "./CommentItem";
import ReplyList from "./ReplyList";
import ReplyComposer from "./ReplyComposer";
import CommentSkeleton from "./CommentSkeleton";
import CommentEmptyState from "./CommentEmptyState";

export default function CommentsSection({
  contentType,
  contentId,
  language = "ur",
}) {
  const isRTL = language === "ur" || language === "Urdu";
  const { openLogin } = useAuthModal();

  // Auth state
  const { loggedInUser, isAuthenticated, userRole } = useSelector(
    (s) => s.auth
  );
  const isAdmin = userRole === "admin" || loggedInUser?.role === "admin";

  // Comments state
  const [commentsList, setCommentsList] = useState([]);
  const [totalComments, setTotalComments] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [fetchError, setFetchError] = useState(null);
  const [sort, setSort] = useState("newest");

  // Interactions state
  const [isSubmittingTopLevel, setIsSubmittingTopLevel] = useState(false);
  const [replyTarget, setReplyTarget] = useState(null); // { rootParentId, targetId, targetUser }
  const [isSubmittingReply, setIsSubmittingReply] = useState(false);
  const [editingCommentId, setEditingCommentId] = useState(null);
  const [commentToDelete, setCommentToDelete] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);

  // Fetch comments
  const loadComments = useCallback(
    async (showLoading = true) => {
      if (!contentType || !contentId) return;
      if (showLoading) setIsLoading(true);
      setFetchError(null);

      try {
        const res = await getComments(contentType, contentId, sort);
        if (res && res.success) {
          setCommentsList(res.comments || []);
          setTotalComments(res.totalComments || 0);
        } else {
          setCommentsList(res?.comments || []);
          setTotalComments(res?.totalComments || 0);
        }
      } catch (err) {
        console.error("Failed to load comments:", err);
        setFetchError(
          err?.response?.data?.message || "Failed to load comments."
        );
      } finally {
        if (showLoading) setIsLoading(false);
      }
    },
    [contentType, contentId, sort]
  );

  useEffect(() => {
    loadComments(true);
  }, [loadComments]);

  // Handle Top-Level Comment Creation
  const handlePostTopLevel = async (text, onSuccess) => {
    if (!isAuthenticated) {
      openLogin();
      return;
    }

    try {
      setIsSubmittingTopLevel(true);
      const res = await createComment({
        contentType,
        contentId,
        text,
      });

      toast.success(
        isRTL ? "تبصرہ کامیابی کے ساتھ شائع ہو گیا!" : "Comment posted!"
      );
      if (onSuccess) onSuccess();

      // Refresh list seamlessly
      await loadComments(false);
    } catch (err) {
      console.error("Post comment error:", err);
      toast.error(err?.response?.data?.message || "Failed to post comment");
    } finally {
      setIsSubmittingTopLevel(false);
    }
  };

  // Open Reply Composer
  const handleReplyClick = (targetComment, rootParentId) => {
    if (!isAuthenticated) {
      openLogin();
      return;
    }

    // Cancel any active editing
    setEditingCommentId(null);

    setReplyTarget({
      rootParentId: rootParentId || targetComment._id,
      targetId: targetComment._id,
      targetUser: targetComment.user,
    });
  };

  // Cancel Reply
  const handleCancelReply = () => {
    setReplyTarget(null);
  };

  // Submit Reply
  const handlePostReply = async (text, onSuccess) => {
    if (!replyTarget || !isAuthenticated) return;

    try {
      setIsSubmittingReply(true);
      await createComment({
        contentType,
        contentId,
        text,
        parentComment: replyTarget.rootParentId,
        replyToUser: replyTarget.targetUser?._id || null,
      });

      toast.success(
        isRTL ? "جواب کامیابی سے شائع ہو گیا!" : "Reply posted!"
      );
      if (onSuccess) onSuccess();
      setReplyTarget(null);

      // Refresh comments
      await loadComments(false);
    } catch (err) {
      console.error("Post reply error:", err);
      toast.error(err?.response?.data?.message || "Failed to post reply");
    } finally {
      setIsSubmittingReply(false);
    }
  };

  // Start Edit
  const handleStartEdit = (comment) => {
    setReplyTarget(null);
    setEditingCommentId(comment._id);
  };

  // Save Edit
  const handleSaveEdit = async (commentId, newText) => {
    try {
      await updateComment(commentId, { text: newText });
      toast.success(
        isRTL ? "تبصرہ کامیابی کے ساتھ اپ ڈیٹ ہو گیا!" : "Comment updated!"
      );
      setEditingCommentId(null);
      await loadComments(false);
    } catch (err) {
      console.error("Edit comment error:", err);
      toast.error(err?.response?.data?.message || "Failed to update comment");
    }
  };

  // Request Delete
  const handleDeleteRequest = (comment) => {
    setCommentToDelete(comment);
  };

  // Confirm Soft Delete
  const handleConfirmDelete = async () => {
    if (!commentToDelete?._id) return;
    try {
      setIsDeleting(true);
      await deleteComment(commentToDelete._id);
      toast.success(isRTL ? "تبصرہ حذف کر دیا گیا!" : "Comment deleted");
      setCommentToDelete(null);
      await loadComments(false);
    } catch (err) {
      console.error("Delete comment error:", err);
      toast.error(err?.response?.data?.message || "Failed to delete comment");
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <section
      dir={isRTL ? "rtl" : "ltr"}
      className="w-full transition-colors text-start"
      aria-label={isRTL ? "تبصرہ سیکشن" : "Comments section"}
    >
      {/* ── 1. Header: Title, Count, Sort ── */}
      <CommentHeader
        totalCount={totalComments}
        sort={sort}
        onSortChange={(newSort) => setSort(newSort)}
        isRTL={isRTL}
      />

      {/* ── 2. Top-Level Comment Composer ── */}
      <CommentComposer
        loggedInUser={loggedInUser}
        isAuthenticated={isAuthenticated}
        onOpenLogin={openLogin}
        onSubmit={handlePostTopLevel}
        isSubmitting={isSubmittingTopLevel}
        isRTL={isRTL}
      />

      {/* ── 3. Comments List / States ── */}
      {isLoading ? (
        <CommentSkeleton count={3} />
      ) : fetchError ? (
        /* Error State with Retry */
        <div
          className="rounded-2xl border p-6 text-center my-4"
          style={{
            backgroundColor: `${COLORS.cardBg || "#F7F1E8"}60`,
            borderColor: `${COLORS.border}40`,
          }}
        >
          <AlertCircle className="w-8 h-8 text-rose-500 mx-auto mb-2 opacity-80" />
          <p
            className="text-sm font-semibold mb-1"
            style={{ color: COLORS.primary }}
          >
            {isRTL
              ? "تبصرے لوڈ کرنے میں مسئلہ پیش آیا"
              : "Unable to load comments"}
          </p>
          <p
            className="text-xs mb-3"
            style={{ color: COLORS.textSecondary }}
          >
            {fetchError}
          </p>
          <button
            type="button"
            onClick={() => loadComments(true)}
            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-bold text-white shadow-xs hover:opacity-90 transition-opacity cursor-pointer"
            style={{ backgroundColor: COLORS.primary }}
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>{isRTL ? "دوبارہ کوشش کریں" : "Try Again"}</span>
          </button>
        </div>
      ) : commentsList.length === 0 ? (
        /* Empty State */
        <CommentEmptyState isRTL={isRTL} />
      ) : (
        /* Render Comments Tree */
        <div className="space-y-4">
          {commentsList.map((topComment) => {
            const replies = topComment.replies || [];
            const isReplyingToThisThread =
              replyTarget && replyTarget.rootParentId === topComment._id;

            return (
              <div
                key={topComment._id}
                className="rounded-2xl border p-3.5 sm:p-4.5 transition-all shadow-2xs hover:shadow-xs"
                style={{
                  backgroundColor: COLORS.white || "#FFFFFF",
                  borderColor: `${COLORS.border}50`,
                }}
              >
                {/* Top-Level Comment */}
                <CommentItem
                  comment={topComment}
                  isReply={false}
                  loggedInUser={loggedInUser}
                  isAdmin={isAdmin}
                  isEditing={editingCommentId === topComment._id}
                  onStartEdit={handleStartEdit}
                  onSaveEdit={handleSaveEdit}
                  onCancelEdit={() => setEditingCommentId(null)}
                  onDeleteRequest={handleDeleteRequest}
                  onReplyClick={(target) =>
                    handleReplyClick(target, topComment._id)
                  }
                  isRTL={isRTL}
                />

                {/* Threaded Replies (Collapsible) */}
                {replies.length > 0 && (
                  <ReplyList
                    replies={replies}
                    loggedInUser={loggedInUser}
                    isAdmin={isAdmin}
                    editingCommentId={editingCommentId}
                    onStartEdit={handleStartEdit}
                    onSaveEdit={handleSaveEdit}
                    onCancelEdit={() => setEditingCommentId(null)}
                    onDeleteRequest={handleDeleteRequest}
                    onReplyClick={(target) =>
                      handleReplyClick(target, topComment._id)
                    }
                    isRTL={isRTL}
                  />
                )}

                {/* In-Place Instagram-Style Reply Composer */}
                {isReplyingToThisThread && (
                  <div
                    className={`${
                      isRTL
                        ? "mr-3 sm:mr-7 pr-3 border-r-2"
                        : "ml-3 sm:ml-7 pl-3 border-l-2"
                    } mt-2`}
                    style={{ borderColor: COLORS.accent }}
                  >
                    <ReplyComposer
                      targetUser={replyTarget.targetUser}
                      loggedInUser={loggedInUser}
                      onSubmitReply={handlePostReply}
                      onCancel={handleCancelReply}
                      isSubmitting={isSubmittingReply}
                      isRTL={isRTL}
                    />
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* ── 4. Confirmation Dialog for Soft Delete ── */}
      <ConfirmationBox
        isOpen={Boolean(commentToDelete)}
        onClose={() => setCommentToDelete(null)}
        onConfirm={handleConfirmDelete}
        title={isRTL ? "تبصرہ حذف کریں" : "Delete Comment"}
        message={
          commentToDelete?.text
            ? isRTL
              ? `کیا آپ واقعی اس تبصرے کو حذف کرنا چاہتے ہیں؟\n\n"${commentToDelete.text.slice(
                  0,
                  60
                )}..."`
              : `Are you sure you want to delete this comment?\n\n"${commentToDelete.text.slice(
                  0,
                  60
                )}..."`
            : isRTL
            ? "کیا آپ واقعی یہ تبصرہ حذف کرنا چاہتے ہیں؟"
            : "Are you sure you want to delete this comment?"
        }
        type="danger"
        confirmText={isRTL ? "حذف کریں" : "Delete"}
        cancelText={isRTL ? "منسوخ" : "Cancel"}
        isLoading={isDeleting}
      />
    </section>
  );
}
