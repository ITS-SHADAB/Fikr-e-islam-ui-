import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Bell, X, Check, ArrowRight, ArrowLeft } from "lucide-react";
import toast from "react-hot-toast";
import { useNotifications } from "@/hooks/useNotifications";
import { useSettings } from "@/hooks/useSettings";
import {
  listenToForegroundMessages,
  getNotificationTargetUrl,
} from "@/services/notificationService";

export default function NotificationManager() {
  const navigate = useNavigate();
  const { settings } = useSettings();
  const isUrdu =
    settings?.language === "ur" || settings?.language === "Urdu";

  const {
    shouldShowPrompt,
    isRegistering,
    requestPermission,
    dismissPrompt,
    addForegroundNotification,
  } = useNotifications();

  // Listen for foreground push messages to show interactive toast popup
  useEffect(() => {
    const unsubscribe = listenToForegroundMessages((payload) => {
      const title =
        payload.notification?.title ||
        payload.data?.title ||
        (isUrdu ? "نئی اطلاع" : "New Notification");

      const body =
        payload.notification?.body ||
        payload.data?.message ||
        payload.data?.body ||
        "";

      const targetLink = getNotificationTargetUrl(payload);

      // Display interactive foreground toast
      toast.custom(
        (t) => (
          <div
            className={`flex items-start gap-3 p-3.5 sm:p-4 rounded-2xl bg-[#2B2118] text-[#F7F1E8] border border-[#A8793E] shadow-2xl max-w-sm sm:max-w-md w-full cursor-pointer select-none transition-all duration-200 hover:border-[#DFC8A4] ${
              t.visible ? "animate-in fade-in zoom-in-95" : "animate-out fade-out"
            }`}
            dir={isUrdu ? "rtl" : "ltr"}
            onClick={() => {
              toast.dismiss(t.id);
              if (targetLink) {
                if (targetLink.startsWith("http")) {
                  window.open(targetLink, "_blank", "noopener,noreferrer");
                } else {
                  navigate(targetLink);
                }
              }
            }}
          >
            <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-[#A8793E]/25 border border-[#A8793E]/50 flex items-center justify-center shrink-0 text-[#DFC8A4]">
              <Bell className="w-4 h-4 animate-bounce" />
            </div>

            <div className="flex-1 min-w-0">
              <h4 className="font-bold text-xs sm:text-sm text-[#DFC8A4] truncate">
                {title}
              </h4>
              {body && (
                <p className="text-[11px] sm:text-xs text-[#F7F1E8]/80 line-clamp-2 mt-0.5 leading-relaxed">
                  {body}
                </p>
              )}
              {targetLink && (
                <span className="inline-flex items-center gap-1 text-[10px] sm:text-[11px] text-[#DFC8A4] font-medium mt-1">
                  {isUrdu ? "دیکھنے کے لیے کلک کریں" : "Click to view"}
                  {isUrdu ? (
                    <ArrowLeft className="w-3 h-3" />
                  ) : (
                    <ArrowRight className="w-3 h-3" />
                  )}
                </span>
              )}
            </div>

            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                toast.dismiss(t.id);
              }}
              className="text-[#F7F1E8]/60 hover:text-[#F7F1E8] p-1 rounded-full hover:bg-white/10 transition-colors"
              aria-label="Close"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        ),
        { duration: 6000, position: "top-center" }
      );
    });

    return () => {
      if (typeof unsubscribe === "function") {
        unsubscribe();
      }
    };
  }, [navigate, isUrdu]);

  const handleAllow = async () => {
    const res = await requestPermission();
    if (res.permission === "granted") {
      toast.success(
        isUrdu ? "اطلاعات فعال کر دی گئیں" : "Notifications enabled",
        {
          style: {
            background: "#2B2118",
            color: "#DFC8A4",
            border: "1px solid #A8793E",
          },
        }
      );
    }
  };

  return (
    <AnimatePresence>
      {shouldShowPrompt && (
        <motion.aside
          initial={{ opacity: 0, y: 30, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 30, scale: 0.95 }}
          transition={{ duration: 0.3, ease: "easeOut" }}
          className="fixed bottom-4 sm:bottom-6 inset-x-4 sm:inset-x-auto sm:right-6 sm:left-auto z-[9999] max-w-md w-full sm:w-[380px]"
          dir={isUrdu ? "rtl" : "ltr"}
          aria-label="Notification Permission Banner"
        >
          <div className="relative p-4 sm:p-4.5 rounded-2xl bg-[#2B2118] text-[#F7F1E8] border border-[#A8793E] shadow-2xl flex flex-col gap-3">
            {/* Top row: Icon, text, and close */}
            <div className="flex items-start gap-3">
              <div className="w-9 h-9 rounded-full bg-[#A8793E]/20 border border-[#A8793E]/60 flex items-center justify-center shrink-0 text-[#DFC8A4]">
                <Bell className="w-4 h-4" />
              </div>

              <div className="flex-1 min-w-0 pr-1">
                <h3 className="font-bold text-xs sm:text-sm text-[#DFC8A4] leading-snug">
                  {isUrdu
                    ? "نئی اپڈیٹس اور فتاویٰ کی بروقت اطلاعات"
                    : "Stay updated with new fatwas & articles"}
                </h3>
                <p className="text-[11px] sm:text-xs text-[#F7F1E8]/75 mt-1 leading-relaxed">
                  {isUrdu
                    ? "اہم مضامین اور سوالات کے جوابات کی نوٹیفکیشن فوری حاصل کریں۔"
                    : "Enable browser notifications to receive important updates directly."}
                </p>
              </div>

              <button
                type="button"
                onClick={dismissPrompt}
                className="text-[#F7F1E8]/50 hover:text-[#F7F1E8] p-1 rounded-lg hover:bg-white/10 transition-colors"
                title={isUrdu ? "بند کریں" : "Dismiss"}
                aria-label="Dismiss notification prompt"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Bottom action buttons */}
            <div className="flex items-center justify-end gap-2 pt-1 border-t border-[#A8793E]/25">
              <button
                type="button"
                onClick={dismissPrompt}
                disabled={isRegistering}
                className="px-3 py-1.5 text-xs text-[#F7F1E8]/70 hover:text-[#F7F1E8] hover:bg-white/5 rounded-xl transition-colors cursor-pointer font-medium"
              >
                {isUrdu ? "بعد میں" : "Later"}
              </button>

              <button
                type="button"
                onClick={handleAllow}
                disabled={isRegistering}
                className="px-3.5 py-1.5 text-xs font-bold text-[#2B2118] bg-gradient-to-r from-[#C5A87C] via-[#DFC8A4] to-[#A8793E] hover:opacity-95 active:scale-98 rounded-xl transition-all shadow-md flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
              >
                <Check className="w-3.5 h-3.5" />
                <span>
                  {isRegistering
                    ? isUrdu
                      ? "انتظار فرمائیں..."
                      : "Enabling..."
                    : isUrdu
                    ? "اطلاعات آن کریں"
                    : "Allow"}
                </span>
              </button>
            </div>
          </div>
        </motion.aside>
      )}
    </AnimatePresence>
  );
}
