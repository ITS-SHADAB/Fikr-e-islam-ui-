import React from 'react';
import PropTypes from 'prop-types';
import {
  WifiOff,
  Clock,
  AlertTriangle,
  FileQuestion,
  RefreshCw,
  Loader2,
  ShieldAlert,
} from 'lucide-react';
import { getUserFriendlyError } from '@/utils/errorHandler';
import { useSettings } from '@/hooks/useSettings';
import { COLORS } from '@/utils/themeColors';

/**
 * Modern, production-grade inline error state component with Urdu typography,
 * contextual icons, polite messaging, and interactive retry capability.
 */
export default function InlineErrorState({
  error,
  context = '',
  onRetry,
  isRetrying = false,
  title,
  message,
  compact = false,
  className = '',
}) {
  const { settings } = useSettings();
  const language =
    settings?.language === 'ur' || settings?.language === 'Urdu' ? 'ur' : 'en';
  const isRTL = language === 'ur';

  const parsed = getUserFriendlyError(error, context, language);
  const displayMessage = message || parsed.message;

  // Icon selection according to error type
  const renderIcon = () => {
    const iconClass = compact ? 'w-5 h-5' : 'w-7 h-7';
    switch (parsed.type) {
      case 'NETWORK':
        return <WifiOff className={iconClass} />;
      case 'TIMEOUT':
        return <Clock className={iconClass} />;
      case 'NOT_FOUND':
        return <FileQuestion className={iconClass} />;
      case 'UNAUTHORIZED':
      case 'FORBIDDEN':
        return <ShieldAlert className={iconClass} />;
      default:
        return <AlertTriangle className={iconClass} />;
    }
  };

  const [internalRetrying, setInternalRetrying] = React.useState(false);
  const retrying = Boolean(isRetrying || internalRetrying);

  const handleRetry = async (e) => {
    e?.preventDefault?.();
    if (!onRetry || retrying) return;
    try {
      setInternalRetrying(true);
      await Promise.resolve(onRetry());
    } finally {
      setInternalRetrying(false);
    }
  };

  const defaultTitle =
    parsed.title ||
    (isRTL
      ? parsed.type === 'NETWORK'
        ? 'انٹرنیٹ کنکشن منقطع ہے'
        : parsed.type === 'TIMEOUT'
        ? 'رابطہ قائم نہیں ہو سکا'
        : parsed.type === 'NOT_FOUND'
        ? 'معلومات دستیاب نہیں ہیں'
        : 'مواد لوڈ کرنے میں دشواری پیش آئی'
      : parsed.type === 'NETWORK'
      ? 'Network Disconnected'
      : parsed.type === 'TIMEOUT'
      ? 'Connection Timed Out'
      : parsed.type === 'NOT_FOUND'
      ? 'Content Not Found'
      : 'Unable to Load Content');

  const displayTitle = title || defaultTitle;

  if (compact) {
    return (
      <div
        dir={isRTL ? 'rtl' : 'ltr'}
        className={`w-full p-4 rounded-xl border flex items-center justify-between gap-3 text-start transition-all ${className}`}
        style={{
          backgroundColor: '#FFFDF9',
          borderColor: `${COLORS?.accent || '#C8A46A'}40`,
        }}
      >
        <div className="flex items-center gap-3">
          <div
            className="w-9 h-9 rounded-lg flex items-center justify-center shrink-0"
            style={{
              backgroundColor: `${COLORS?.primary || '#3A2B20'}12`,
              color: COLORS?.primary || '#3A2B20',
            }}
          >
            {renderIcon()}
          </div>
          <div>
            <h4 className="text-xs font-bold font-serif text-[#2B2118]">
              {displayTitle}
            </h4>
            <p className="text-[11px] text-slate-600 font-sans mt-0.5 max-w-sm">
              {displayMessage}
            </p>
          </div>
        </div>

        {onRetry && (
          <button
            type="button"
            onClick={handleRetry}
            disabled={retrying}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border text-xs font-bold transition-all shrink-0 cursor-pointer disabled:opacity-60 active:scale-95"
            style={{
              borderColor: COLORS?.accent || '#C8A46A',
              color: COLORS?.primary || '#3A2B20',
              backgroundColor: '#FFFFFF',
            }}
          >
            {retrying ? (
              <Loader2 className="w-3.5 h-3.5 animate-spin text-accent" />
            ) : (
              <RefreshCw className="w-3.5 h-3.5 text-accent" />
            )}
            <span>
              {retrying
                ? isRTL
                  ? 'کوشش جاری ہے...'
                  : 'Retrying...'
                : isRTL
                ? 'دوبارہ کوشش'
                : 'Retry'}
            </span>
          </button>
        )}
      </div>
    );
  }

  return (
    <div
      dir={isRTL ? 'rtl' : 'ltr'}
      className={`w-full py-10 sm:py-14 px-6 rounded-2xl border-2 text-center transition-all flex flex-col items-center justify-center shadow-xs ${className}`}
      style={{
        backgroundColor: '#FCFAF7',
        borderColor: `${COLORS?.border || '#E6DFD5'}`,
      }}
    >
      {/* Icon Badge */}
      <div
        className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl flex items-center justify-center mb-4 border shadow-2xs"
        style={{
          backgroundColor: '#FFFFFF',
          borderColor: `${COLORS?.accent || '#C8A46A'}60`,
          color: COLORS?.primary || '#3A2B20',
        }}
      >
        {renderIcon()}
      </div>

      {/* Title */}
      <h3
        className="text-base sm:text-lg font-bold font-serif mb-2 leading-tight"
        style={{ color: COLORS?.primary || '#2B2118' }}
      >
        {displayTitle}
      </h3>

      {/* Polite Explanatory Message */}
      <p
        className="text-xs sm:text-sm max-w-md mx-auto leading-relaxed text-slate-600 mb-6"
        style={{ color: '#5A4A3E' }}
      >
        {displayMessage}
      </p>

      {/* Action: Retry Button */}
      {onRetry && (
        <button
          type="button"
          onClick={handleRetry}
          disabled={retrying}
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl border-2 text-xs sm:text-sm font-bold shadow-xs hover:shadow-md transition-all cursor-pointer disabled:opacity-60 active:scale-95"
          style={{
            backgroundColor: COLORS?.primary || '#3A2B20',
            borderColor: COLORS?.accent || '#C8A46A',
            color: '#FFFFFF',
          }}
        >
          {retrying ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin text-amber-300" />
              <span>
                {isRTL ? 'دوبارہ کوشش جاری ہے...' : 'Retrying...'}
              </span>
            </>
          ) : (
            <>
              <RefreshCw className="w-4 h-4 text-amber-300" />
              <span>{isRTL ? 'دوبارہ کوشش کریں' : 'Try Again'}</span>
            </>
          )}
        </button>
      )}
    </div>
  );
}

InlineErrorState.propTypes = {
  error: PropTypes.any,
  context: PropTypes.string,
  onRetry: PropTypes.func,
  isRetrying: PropTypes.bool,
  title: PropTypes.string,
  message: PropTypes.string,
  compact: PropTypes.bool,
  className: PropTypes.string,
};
