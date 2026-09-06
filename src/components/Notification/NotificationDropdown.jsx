import React, { useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  Bell,
  CheckCheck,
  RotateCw,
  FileText,
  HelpCircle,
  BookOpen,
  ArrowLeft,
  ArrowRight,
  Sparkles,
  AlertCircle,
  X,
} from "lucide-react";
import { useNotifications } from "@/hooks/useNotifications";
import { useSettings } from "@/hooks/useSettings";
import {
  formatNotificationTime,
  getNotificationTargetUrl,
} from "@/services/notificationService";

export default function NotificationDropdown({
  isOpen,
  onClose,
  anchorRef,
  headerHeight,
}) {
  const navigate = useNavigate();
  const dropdownRef = useRef(null);
  const isDraggingRef = useRef(false);
  const { settings } = useSettings();
  const isUrdu = settings?.language === "ur" || settings?.language === "Urdu";

  const {
    notifications,
    unreadCount,
    isLoading,
    error,
    refreshNotifications,
    markAsRead,
    markAllAsRead,
    dismissNotification,
  } = useNotifications();

  // Close dropdown on outside click or Escape key
  useEffect(() => {
    if (!isOpen) return;

    const handleClickOutside = (e) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(e.target) &&
        (!anchorRef?.current || !anchorRef.current.contains(e.target))
      ) {
        onClose();
      }
    };

    const handleKeyDown = (e) => {
      if (e.key === "Escape") {
        onClose();
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("touchstart", handleClickOutside, { passive: true });
    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("touchstart", handleClickOutside);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen, onClose, anchorRef]);

  /**
   * Handle clicking an unread notification:
   * 1. Immediately close dropdown
   * 2. Mark as read (optimistically removes from unread list & background syncs)
   * 3. Navigate smoothly to target URL if present
   */
  const handleNotificationClick = async (notification) => {
    if (isDraggingRef.current) return;

    const notifId = notification._id;
    const targetUrl = getNotificationTargetUrl(notification);

    // 1. Close dropdown immediately for responsive UX
    onClose();

    // 2. Mark as read in context (optimistic + background sync)
    try {
      await markAsRead(notifId);
    } catch {
      // Background sync errors are safely handled inside markAsRead
    }

    // 3. Navigate to target URL if present
    if (targetUrl) {
      if (targetUrl.startsWith("http://") || targetUrl.startsWith("https://")) {
        window.open(targetUrl, "_blank", "noopener,noreferrer");
      } else {
        navigate(targetUrl);
      }
    }
  };

  /**
   * Frontend-only dismissal via swipe or clicking [×]
   */
  const handleDismiss = (notifId, e) => {
    if (e && e.stopPropagation) {
      e.stopPropagation();
    }
    dismissNotification(notifId);
  };

  const getNotificationIcon = (type = "") => {
    const t = type.toLowerCase();
    if (t.includes("article")) {
      return <FileText className="w-3.5 h-3.5 text-[#DFC8A4]" />;
    }
    if (t.includes("fatwa") || t.includes("book") || t.includes("publication")) {
      return <BookOpen className="w-3.5 h-3.5 text-[#DFC8A4]" />;
    }
    if (t.includes("question") || t.includes("qa") || t.includes("ask")) {
      return <HelpCircle className="w-3.5 h-3.5 text-[#DFC8A4]" />;
    }
    return <Sparkles className="w-3.5 h-3.5 text-[#DFC8A4]" />;
  };

  const isMobileScreen = typeof window !== "undefined" && window.innerWidth < 640;
  const mobileTop = headerHeight ? `${headerHeight + 6}px` : "58px";
  const mobileMaxHeight = headerHeight
    ? `calc(100dvh - ${headerHeight + 16}px)`
    : "calc(100dvh - 75px)";

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Mobile Backdrop Overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.15 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-xs z-[9998] sm:hidden"
            onClick={onClose}
            aria-hidden="true"
          />

          {/* Main Notification Container (Fixed on mobile, absolute on desktop) */}
          <motion.div
            ref={dropdownRef}
            initial={{ opacity: 0, scale: 0.95, y: -6 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: -6 }}
            transition={{ duration: 0.16 }}
            style={{
              zIndex: 9999,
              ...(isMobileScreen
                ? {
                    top: mobileTop,
                    maxHeight: mobileMaxHeight,
                  }
                : {}),
            }}
            className={`fixed inset-x-2.5 sm:inset-x-auto top-[58px] sm:top-full sm:mt-2 sm:absolute ${
              isUrdu
                ? "sm:left-0 sm:right-auto text-right"
                : "sm:right-0 sm:left-auto text-left"
            } w-auto sm:w-96 sm:max-w-[420px] max-h-[calc(100dvh-75px)] sm:max-h-[520px] bg-[#2B2118] border border-[#A8793E] rounded-2xl shadow-2xl p-3 sm:p-4 text-[#F7F1E8] select-none z-[9999] flex flex-col`}
            dir={isUrdu ? "rtl" : "ltr"}
          >
          {/* Header */}
          <div className="flex items-center justify-between pb-3 border-b border-[#A8793E]/30 shrink-0">
            <div className="flex items-center gap-2">
              <span className="font-bold text-sm text-[#DFC8A4]">
                {isUrdu ? "اطلاعات (نوٹیفیکیشنز)" : "Notifications"}
              </span>
              {unreadCount > 0 && (
                <span className="px-2 py-0.5 text-[10px] font-bold bg-[#A8793E]/30 text-[#DFC8A4] rounded-full border border-[#A8793E]/50">
                  {unreadCount > 99 ? "99+" : unreadCount}{" "}
                  {isUrdu ? "نئی" : "new"}
                </span>
              )}
            </div>

            <div className="flex items-center gap-1.5">
              {/* Refresh Button */}
              <button
                type="button"
                onClick={() => refreshNotifications()}
                disabled={isLoading}
                title={isUrdu ? "ریفریش کریں" : "Refresh"}
                aria-label={isUrdu ? "ریفریش کریں" : "Refresh"}
                className="p-1 text-[#F7F1E8]/70 hover:text-[#DFC8A4] hover:bg-white/5 rounded-lg transition-colors cursor-pointer disabled:opacity-40"
              >
                <RotateCw
                  className={`w-3.5 h-3.5 ${isLoading ? "animate-spin" : ""}`}
                />
              </button>

              {/* Mark all as read */}
              <button
                type="button"
                onClick={() => markAllAsRead()}
                disabled={unreadCount === 0 || isLoading}
                title={
                  isUrdu
                    ? "تمام کو پڑھا ہوا نشان زد کریں"
                    : "Mark all as read"
                }
                className="flex items-center gap-1 px-2 py-1 text-[11px] font-semibold text-[#F7F1E8]/80 hover:text-[#DFC8A4] hover:bg-white/5 rounded-lg border border-[#A8793E]/30 disabled:opacity-30 disabled:pointer-events-none transition-colors cursor-pointer"
              >
                <CheckCheck className="w-3.5 h-3.5 text-[#A8793E]" />
                <span className="hidden sm:inline">
                  {isUrdu ? "سب پڑھ لیں" : "Mark all read"}
                </span>
              </button>

              {/* Mobile Close Button */}
              <button
                type="button"
                onClick={onClose}
                title={isUrdu ? "بند کریں" : "Close"}
                aria-label={isUrdu ? "بند کریں" : "Close"}
                className="p-1 text-[#F7F1E8]/70 hover:text-[#DFC8A4] hover:bg-white/10 rounded-lg sm:hidden cursor-pointer ml-0.5"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Body */}
          <div className="mt-2.5 flex-1 overflow-y-auto overscroll-contain custom-drawer-scrollbar space-y-2 pr-0.5 min-h-0">
            {/* Loading State */}
            {isLoading && notifications.length === 0 && (
              <div className="space-y-2 py-2">
                {[1, 2, 3].map((i) => (
                  <div
                    key={i}
                    className="p-3 rounded-xl bg-white/5 animate-pulse flex flex-col gap-2"
                  >
                    <div className="h-3 w-1/2 bg-white/10 rounded" />
                    <div className="h-2.5 w-3/4 bg-white/10 rounded" />
                  </div>
                ))}
              </div>
            )}

            {/* Error State */}
            {error && notifications.length === 0 && (
              <div className="py-6 px-3 text-center flex flex-col items-center gap-2">
                <AlertCircle className="w-6 h-6 text-red-400" />
                <p className="text-xs text-red-200">{error}</p>
                <button
                  type="button"
                  onClick={() => refreshNotifications()}
                  className="mt-1 px-3 py-1 bg-[#3D2E22] hover:bg-[#4D3A2C] text-xs font-bold text-[#DFC8A4] rounded-lg border border-[#A8793E]/40 transition-colors cursor-pointer"
                >
                  {isUrdu ? "دوبارہ کوشش کریں" : "Try Again"}
                </button>
              </div>
            )}

            {/* Empty State - Only shown when there are no unread notifications */}
            {!isLoading && !error && notifications.length === 0 && (
              <div className="py-8 px-4 text-center flex flex-col items-center justify-center gap-2.5">
                <div className="w-12 h-12 rounded-full bg-[#A8793E]/15 border border-[#A8793E]/30 flex items-center justify-center text-[#DFC8A4]">
                  <Bell className="w-5 h-5" />
                </div>
                <div className="flex flex-col gap-1">
                  <p className="text-xs sm:text-sm text-[#DFC8A4] font-bold">
                    {isUrdu ? "کوئی نئی اطلاع نہیں ہے" : "No new notifications"}
                  </p>
                  <p className="text-[11px] text-[#F7F1E8]/60">
                    {isUrdu
                      ? "آپ کے پاس تمام نئی اپڈیٹس موجود ہیں۔"
                      : "You're all caught up."}
                  </p>
                </div>
              </div>
            )}

            {/* Unread-Only Notification Items with Framer-Motion Swipe & Dismiss */}
            <AnimatePresence initial={false} mode="popLayout">
              {notifications.map((n) => {
                const targetUrl = getNotificationTargetUrl(n);

                return (
                  <motion.div
                    key={n._id}
                    layout
                    initial={{ opacity: 0, y: 8, scale: 0.98 }}
                    animate={{ opacity: 1, y: 0, scale: 1, x: 0 }}
                    exit={{
                      opacity: 0,
                      x: isUrdu ? 120 : -120,
                      scale: 0.88,
                      height: 0,
                      marginBottom: 0,
                      paddingTop: 0,
                      paddingBottom: 0,
                      transition: { duration: 0.22 },
                    }}
                    drag="x"
                    dragDirectionLock
                    dragConstraints={{ left: 0, right: 0 }}
                    dragElastic={0.65}
                    onDragStart={() => {
                      isDraggingRef.current = true;
                    }}
                    onDragEnd={(e, info) => {
                      setTimeout(() => {
                        isDraggingRef.current = false;
                      }, 80);
                      // If swiped horizontally past 70px or fast flick, dismiss
                      if (
                        Math.abs(info.offset.x) > 70 ||
                        Math.abs(info.velocity.x) > 400
                      ) {
                        handleDismiss(n._id, e);
                      }
                    }}
                    onClick={() => handleNotificationClick(n)}
                    role="button"
                    tabIndex={0}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" || e.key === " ") {
                        e.preventDefault();
                        handleNotificationClick(n);
                      }
                    }}
                    className="relative p-2.5 sm:p-3 rounded-xl border border-[#A8793E] bg-[#3D2E22] hover:bg-[#453426] shadow-sm transition-colors cursor-pointer flex flex-col gap-1 select-none active:cursor-grabbing group overflow-hidden"
                  >
                    {/* Top row: Icon, title with unread indicator, and close [×] button */}
                    <div className="flex items-start gap-2">
                      <div className="w-6 h-6 rounded-full bg-[#A8793E]/20 border border-[#A8793E]/40 flex items-center justify-center shrink-0 mt-0.5">
                        {getNotificationIcon(n.type)}
                      </div>

                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-1.5">
                          <span
                            className="w-2 h-2 rounded-full bg-[#DFC8A4] shrink-0 shadow-xs"
                            title={isUrdu ? "غیر پڑھا ہوا" : "Unread"}
                            aria-label={isUrdu ? "غیر پڑھا ہوا" : "Unread"}
                          />
                          <h4 className="text-xs font-bold text-[#DFC8A4] truncate">
                            {n.title}
                          </h4>
                        </div>
                      </div>

                      {/* Close / Dismiss [×] Button */}
                      <button
                        type="button"
                        onClick={(e) => handleDismiss(n._id, e)}
                        aria-label={isUrdu ? "اطلاع ہٹائیں" : "Dismiss notification"}
                        title={isUrdu ? "ہٹائیں" : "Dismiss"}
                        className="p-1 -mr-1 -mt-0.5 rounded-md text-[#F7F1E8]/40 hover:text-[#DFC8A4] hover:bg-white/10 transition-colors cursor-pointer shrink-0"
                      >
                        <X className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    {/* Body text */}
                    {n.message && (
                      <p className="text-[11px] sm:text-xs text-[#F7F1E8]/80 line-clamp-2 leading-relaxed ps-8">
                        {n.message}
                      </p>
                    )}

                    {/* Footer: timestamp & link arrow */}
                    <div className="flex items-center justify-between pt-1 text-[10px] text-[#F7F1E8]/55 ps-8">
                      <span>{formatNotificationTime(n.createdAt, isUrdu)}</span>

                      {targetUrl && (
                        <span className="inline-flex items-center gap-1 text-[#DFC8A4] group-hover:underline font-semibold">
                          {isUrdu ? "دیکھیں" : "View"}
                          {isUrdu ? (
                            <ArrowLeft className="w-2.5 h-2.5" />
                          ) : (
                            <ArrowRight className="w-2.5 h-2.5" />
                          )}
                        </span>
                      )}
                    </div>
                  </motion.div>
                );
              })}
            </AnimatePresence>
          </div>

          {/* Swipe / Dismiss footer hint when notifications exist */}
          {notifications.length > 0 && (
            <div className="pt-2 px-1 text-[10px] text-center text-[#F7F1E8]/40 border-t border-[#A8793E]/20 select-none shrink-0">
              {isUrdu
                ? "ہٹانے کے لیے سوائپ کریں یا × دبائیں"
                : "Swipe or tap × to dismiss"}
            </div>
          )}
        </motion.div>
      </>
    )}
  </AnimatePresence>
  );
}
