import React, { useState, useRef, useEffect } from "react";
import { MoreVertical, Edit2, Trash2 } from "lucide-react";
import { COLORS } from "@/utils/themeColors";

export default function CommentMenu({
  canEdit = false,
  onEdit,
  canDelete = false,
  onDelete,
  isRTL = false,
}) {
  const [open, setOpen] = useState(false);
  const menuRef = useRef(null);

  useEffect(() => {
    if (!open) return;
    const handleClickOutside = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setOpen(false);
      }
    };
    const handleKeyDown = (e) => {
      if (e.key === "Escape") setOpen(false);
    };
    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [open]);

  if (!canEdit && !canDelete) return null;

  return (
    <div ref={menuRef} className="relative shrink-0">
      <button
        type="button"
        onClick={() => setOpen((prev) => !prev)}
        className="w-7 h-7 rounded-full flex items-center justify-center transition-colors hover:bg-black/5 cursor-pointer"
        style={{ color: COLORS.textSecondary }}
        aria-label={isRTL ? "مزید اختیارات" : "More options"}
        aria-expanded={open}
        title={isRTL ? "مزید اختیارات" : "More options"}
      >
        <MoreVertical className="w-3.5 h-3.5 opacity-75" />
      </button>

      {open && (
        <div
          className={`absolute ${
            isRTL ? "left-0" : "right-0"
          } top-8 bg-white rounded-xl shadow-lg z-50 min-w-[130px] overflow-hidden border py-1 animate-in fade-in zoom-in-95 duration-150`}
          style={{ borderColor: `${COLORS.border}35` }}
          role="menu"
        >
          {canEdit && (
            <button
              type="button"
              onClick={() => {
                setOpen(false);
                onEdit();
              }}
              className="flex items-center gap-2.5 w-full px-3.5 py-2 text-start text-xs font-semibold hover:bg-neutral-50 transition-colors cursor-pointer"
              style={{ color: COLORS.primary }}
              role="menuitem"
            >
              <Edit2 className="w-3.5 h-3.5" style={{ color: COLORS.accent }} />
              <span>{isRTL ? "تبصرہ تبدیل کریں" : "Edit"}</span>
            </button>
          )}

          {canDelete && (
            <button
              type="button"
              onClick={() => {
                setOpen(false);
                onDelete();
              }}
              className="flex items-center gap-2.5 w-full px-3.5 py-2 text-start text-xs font-semibold text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer border-t border-neutral-100"
              role="menuitem"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>{isRTL ? "حذف کریں" : "Delete"}</span>
            </button>
          )}
        </div>
      )}
    </div>
  );
}
