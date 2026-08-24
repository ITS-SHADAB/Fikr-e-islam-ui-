import React, { useEffect } from 'react';
import { createPortal } from 'react-dom';
import PropTypes from 'prop-types';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  AlertTriangle, 
  Trash2, 
  Info, 
  CheckCircle2, 
  HelpCircle, 
  AlertCircle,
  X 
} from 'lucide-react';

const TYPE_CONFIG = {
  danger: {
    icon: Trash2,
    iconBg: 'bg-red-100 dark:bg-red-950/50 text-red-600 dark:text-red-400 border-red-200 dark:border-red-800/60',
    headerBadge: 'bg-red-50 text-red-700 border-red-200',
    confirmBtn: 'bg-red-600 hover:bg-red-700 text-white shadow-red-500/20 focus:ring-red-500',
    accentBorder: 'border-t-4 border-t-red-500',
    defaultConfirmText: 'حذف کریں / Confirm',
  },
  warning: {
    icon: AlertTriangle,
    iconBg: 'bg-amber-100 dark:bg-amber-950/50 text-amber-600 dark:text-amber-400 border-amber-200 dark:border-amber-800/60',
    headerBadge: 'bg-amber-50 text-amber-700 border-amber-200',
    confirmBtn: 'bg-amber-600 hover:bg-amber-700 text-white shadow-amber-500/20 focus:ring-amber-500',
    accentBorder: 'border-t-4 border-t-amber-500',
    defaultConfirmText: 'تصدیق کریں / Proceed',
  },
  info: {
    icon: Info,
    iconBg: 'bg-sky-100 dark:bg-sky-950/50 text-sky-600 dark:text-sky-400 border-sky-200 dark:border-sky-800/60',
    headerBadge: 'bg-sky-50 text-sky-700 border-sky-200',
    confirmBtn: 'bg-sky-600 hover:bg-sky-700 text-white shadow-sky-500/20 focus:ring-sky-500',
    accentBorder: 'border-t-4 border-t-sky-500',
    defaultConfirmText: 'ٹھیک ہے / OK',
  },
  success: {
    icon: CheckCircle2,
    iconBg: 'bg-emerald-100 dark:bg-emerald-950/50 text-emerald-600 dark:text-emerald-400 border-emerald-200 dark:border-emerald-800/60',
    headerBadge: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    confirmBtn: 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-emerald-500/20 focus:ring-emerald-500',
    accentBorder: 'border-t-4 border-t-emerald-500',
    defaultConfirmText: 'ٹھیک ہے / OK',
  },
  alert: {
    icon: AlertCircle,
    iconBg: 'bg-primary/10 text-primary border-primary/20',
    headerBadge: 'bg-primary/5 text-primary border-primary/20',
    confirmBtn: 'bg-primary hover:bg-primary/90 text-white shadow-primary/20 focus:ring-primary',
    accentBorder: 'border-t-4 border-t-primary',
    defaultConfirmText: 'ٹھیک ہے / OK',
  },
  confirm: {
    icon: HelpCircle,
    iconBg: 'bg-primary/10 text-primary border-primary/20',
    headerBadge: 'bg-primary/5 text-primary border-primary/20',
    confirmBtn: 'bg-primary hover:bg-primary/90 text-white shadow-primary/20 focus:ring-primary',
    accentBorder: 'border-t-4 border-t-primary',
    defaultConfirmText: 'ہاں، جاری رکھیں / Confirm',
  },
};

// Check if a text is likely Urdu / Arabic (RTL)
const isUrduText = (str) => {
  if (typeof str !== 'string') return false;
  return /[\u0600-\u06FF\u0750-\u077F]/.test(str);
};

export default function ConfirmationBox({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  type = 'confirm',
  confirmText,
  cancelText,
  showCancel,
  confirmButtonColor,
  isLoading = false,
  isRTL,
}) {
  const config = TYPE_CONFIG[type] || TYPE_CONFIG.confirm;
  const IconComponent = config.icon;

  // Auto detect RTL if not explicitly provided
  const detectedRTL = isRTL !== undefined 
    ? isRTL 
    : (isUrduText(title) || isUrduText(message));

  // Determine if cancel button should be displayed
  const shouldShowCancel = showCancel !== undefined 
    ? showCancel 
    : (type !== 'alert' && type !== 'info' && type !== 'success');

  const resolvedConfirmText = confirmText || (
    detectedRTL ? (type === 'danger' ? 'ہاں، حذف کریں' : 'ٹھیک ہے') : config.defaultConfirmText
  );

  const resolvedCancelText = cancelText || (
    detectedRTL ? 'منسوخ کریں' : 'Cancel'
  );

  const resolvedTitle = title || (
    detectedRTL 
      ? (type === 'danger' ? 'حذف کرنے کی تصدیق' : type === 'warning' ? 'انتباہ' : 'اطلاع') 
      : (type === 'danger' ? 'Confirm Action' : type === 'warning' ? 'Warning' : 'Notice')
  );

  // Close on escape key
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && !isLoading) {
        onClose?.();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, isLoading, onClose]);

  if (typeof document === 'undefined') return null;

  return createPortal(
    <AnimatePresence>
      {isOpen && (
        <div 
          className="fixed inset-0 z-[99999] flex items-center justify-center p-4 sm:p-6 overflow-y-auto"
          aria-labelledby="confirmation-dialog-title"
          aria-describedby="confirmation-dialog-description"
          role="dialog"
          aria-modal="true"
        >
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={isLoading ? undefined : onClose}
            className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm transition-opacity"
          />

          {/* Modal Container */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 15 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 15 }}
            transition={{ type: 'spring', damping: 25, stiffness: 350 }}
            className={`relative w-full max-w-md bg-white dark:bg-slate-900 rounded-2xl shadow-2xl overflow-hidden border border-slate-100 dark:border-slate-800 ${config.accentBorder} ${
              detectedRTL ? 'text-right' : 'text-left'
            }`}
            dir={detectedRTL ? 'rtl' : 'ltr'}
          >
            {/* Top Close Button */}
            {!isLoading && (
              <button
                type="button"
                onClick={onClose}
                className={`absolute top-4 ${
                  detectedRTL ? 'left-4' : 'right-4'
                } p-1.5 rounded-full text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors focus:outline-none focus:ring-2 focus:ring-slate-300`}
                aria-label="Close"
              >
                <X className="w-4 h-4" />
              </button>
            )}

            <div className="p-6 sm:p-7">
              {/* Header Icon + Title */}
              <div className={`flex items-start gap-4 ${detectedRTL ? 'flex-row' : 'flex-row'}`}>
                <div
                  className={`shrink-0 w-12 h-12 rounded-2xl border flex items-center justify-center shadow-inner ${config.iconBg}`}
                >
                  <IconComponent className="w-6 h-6 animate-pulse" />
                </div>

                <div className="flex-1 pt-1 min-w-0">
                  <h3
                    id="confirmation-dialog-title"
                    className={`text-lg sm:text-xl font-bold text-slate-900 dark:text-slate-100 leading-snug ${
                      detectedRTL ? 'font-urdu font-medium' : 'font-sans'
                    }`}
                  >
                    {resolvedTitle}
                  </h3>

                  {/* Message Content */}
                  <div
                    id="confirmation-dialog-description"
                    className={`mt-2.5 text-sm sm:text-[15px] text-slate-600 dark:text-slate-300 leading-relaxed font-normal ${
                      detectedRTL ? 'font-urdu leading-loose' : 'font-sans'
                    }`}
                  >
                    {typeof message === 'string' ? (
                      <p className="whitespace-pre-line">{message}</p>
                    ) : (
                      message
                    )}
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div
                className={`mt-7 pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center gap-3 ${
                  detectedRTL ? 'flex-row-reverse justify-start' : 'justify-end'
                }`}
              >
                {shouldShowCancel && (
                  <button
                    type="button"
                    disabled={isLoading}
                    onClick={onClose}
                    className="px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700 text-sm font-semibold transition-all shadow-sm focus:outline-none focus:ring-2 focus:ring-slate-300 disabled:opacity-50"
                  >
                    {resolvedCancelText}
                  </button>
                )}

                <button
                  type="button"
                  disabled={isLoading}
                  onClick={onConfirm || onClose}
                  className={`inline-flex items-center justify-center px-5 py-2.5 rounded-xl text-sm font-bold shadow-md transition-all focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-60 cursor-pointer ${
                    confirmButtonColor || config.confirmBtn
                  }`}
                >
                  {isLoading ? (
                    <div className="flex items-center gap-2">
                      <span className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                      <span>{detectedRTL ? 'پروسیسنگ...' : 'Processing...'}</span>
                    </div>
                  ) : (
                    resolvedConfirmText
                  )}
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>,
    document.body
  );
}

ConfirmationBox.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  onConfirm: PropTypes.func,
  title: PropTypes.node,
  message: PropTypes.node,
  type: PropTypes.oneOf(['danger', 'warning', 'info', 'success', 'alert', 'confirm']),
  confirmText: PropTypes.string,
  cancelText: PropTypes.string,
  showCancel: PropTypes.bool,
  confirmButtonColor: PropTypes.string,
  isLoading: PropTypes.bool,
  isRTL: PropTypes.bool,
};
