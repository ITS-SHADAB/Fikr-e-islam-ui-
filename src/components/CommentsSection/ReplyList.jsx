import React, { useState } from "react";
import { ChevronDown } from "lucide-react";
import { COLORS } from "@/utils/themeColors";
import CommentItem from "./CommentItem";

export default function ReplyList({
  replies = [],
  loggedInUser,
  isAdmin = false,
  editingCommentId,
  onStartEdit,
  onSaveEdit,
  onCancelEdit,
  onDeleteRequest,
  onReplyClick,
  isRTL = false,
}) {
  // If only 1 reply, start expanded by default for smooth UX; otherwise collapsed
  const [isExpanded, setIsExpanded] = useState(() => replies.length <= 1);

  if (!replies || replies.length === 0) return null;

  return (
    <div
      className={`${
        isRTL
          ? "mr-3 sm:mr-7 pr-3 border-r-2"
          : "ml-3 sm:ml-7 pl-3 border-l-2"
      } my-1.5 transition-all`}
      style={{
        borderColor: `${COLORS.accent}35`,
      }}
    >
      {/* Thread Toggle Pill Button */}
      {replies.length > 0 && (
        <button
          type="button"
          onClick={() => setIsExpanded((prev) => !prev)}
          className="inline-flex items-center gap-2 text-xs font-bold py-1 px-3 rounded-full my-1 transition-all cursor-pointer border shadow-2xs hover:shadow-xs active:scale-95"
          style={{
            borderColor: `${COLORS.accent}35`,
            backgroundColor: `${COLORS.accent}10`,
            color: COLORS.primary,
          }}
        >
          <span className="text-amber-800 text-sm leading-none font-bold">↳</span>
          <span>
            {isExpanded
              ? isRTL
                ? "جوابات چھپائیں"
                : "Hide replies"
              : isRTL
              ? `${replies.length} ${
                  replies.length === 1 ? "جواب دیکھیں" : "جوابات دیکھیں"
                }`
              : `View ${replies.length} ${
                  replies.length === 1 ? "reply" : "replies"
                }`}
          </span>
          <ChevronDown
            className={`w-3.5 h-3.5 transition-transform duration-200 text-amber-800 ${
              isExpanded ? "rotate-180" : ""
            }`}
          />
        </button>
      )}

      {/* Render Nested Replies */}
      {isExpanded && (
        <div className="space-y-1.5 mt-1 animate-in fade-in duration-150">
          {replies.map((reply) => (
            <CommentItem
              key={reply._id}
              comment={reply}
              isReply={true}
              loggedInUser={loggedInUser}
              isAdmin={isAdmin}
              isEditing={editingCommentId === reply._id}
              onStartEdit={onStartEdit}
              onSaveEdit={onSaveEdit}
              onCancelEdit={onCancelEdit}
              onDeleteRequest={onDeleteRequest}
              onReplyClick={onReplyClick}
              isRTL={isRTL}
            />
          ))}
        </div>
      )}
    </div>
  );
}
