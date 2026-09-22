import PropTypes from 'prop-types';
import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import {
  Calendar,
  MapPin,
  Clock,
  ExternalLink,
  Share2,
  CalendarPlus,
  Sparkles,
  CheckCircle,
  Tag,
  Image as ImageIcon,
  ZoomIn,
  Navigation,
  X,
} from 'lucide-react';
import { useSettings } from '@/hooks/useSettings';
import { COLORS } from '@/utils/themeColors';
import { getEventPosterUrl, getGoogleMapsUrl } from '@/utils/utils';
import toast from 'react-hot-toast';

export { getEventPosterUrl, getGoogleMapsUrl };

export default function EventCard({ event, isCompact = false }) {
  const { settings } = useSettings();
  const language =
    settings?.language === 'ur' || settings?.language === 'Urdu' ? 'ur' : 'en';
  const isRTL = language === 'ur';

  const [isPosterModalOpen, setIsPosterModalOpen] = useState(false);
  const [imgError, setImgError] = useState(false);

  // Close modal on Escape key & lock body scroll while modal is active
  useEffect(() => {
    if (!isPosterModalOpen) return;
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        setIsPosterModalOpen(false);
      }
    };
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    window.addEventListener('keydown', handleKeyDown);
    return () => {
      document.body.style.overflow = prevOverflow;
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isPosterModalOpen]);

  if (!event) return null;

  const { title, description, eventDate, location } = event;
  const posterUrl = getEventPosterUrl(event);
  const mapsUrl = getGoogleMapsUrl(event);

  const parsedDate = new Date(eventDate);
  const locale = isRTL ? 'ur-PK' : 'en-US';
  const monthName = parsedDate
    .toLocaleDateString(locale, { month: 'short' })
    .toUpperCase();
  const dayNum = parsedDate.toLocaleString(locale, { day: 'numeric' });
  const yearNum = parsedDate.toLocaleString(locale, { year: 'numeric' });
  const dayName = parsedDate.toLocaleDateString(locale, { weekday: 'long' });

  const formattedTime = parsedDate.toLocaleTimeString(locale, {
    hour: '2-digit',
    minute: '2-digit',
  });

  const isUpcoming = parsedDate.getTime() > Date.now();

  const handleShare = () => {
    const shareText = `${title}\n${isRTL ? 'تاریخ:' : 'Date:'} ${dayNum} ${monthName} ${yearNum} (${dayName})\n${isRTL ? 'وقت:' : 'Time:'} ${formattedTime}\n${isRTL ? 'مقام:' : 'Location:'} ${location}`;
    if (navigator?.share) {
      navigator.share({ title, text: shareText, url: window?.location?.href });
    } else {
      navigator?.clipboard?.writeText(
        `${shareText}\n${window?.location?.href}`
      );
      toast.success(isRTL ? 'تفصیلات کاپی ہو گئیں!' : 'Details copied!');
    }
  };

  const createGoogleCalendarUrl = () => {
    const startTime = parsedDate.toISOString().replace(/-|:|\.\d\d\d/g, '');
    const endDate = new Date(parsedDate.getTime() + 2 * 60 * 60 * 1000);
    const endTime = endDate.toISOString().replace(/-|:|\.\d\d\d/g, '');
    return `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(
      title || ''
    )}&dates=${startTime}/${endTime}&details=${encodeURIComponent(
      description || ''
    )}&location=${encodeURIComponent(location || '')}`;
  };

  return (
    <>
      <div
        dir={isRTL ? 'rtl' : 'ltr'}
        className="rounded-2xl border-2 overflow-hidden flex flex-col md:flex-row group transition-all duration-300 hover:shadow-lg"
        style={{
          backgroundColor: COLORS?.white,
          borderColor: COLORS?.border,
          borderRight: isRTL ? `5px solid ${COLORS?.accent}` : undefined,
          boxShadow: '0 2px 8px rgba(74,55,40,0.06)',
        }}
      >
        {/* Poster Image with Floating Date Overlay (Image occupies the full edge) */}
        {posterUrl && !imgError ? (
          <div
            className="relative w-full h-48 sm:h-52 md:h-auto md:w-56 shrink-0 overflow-hidden cursor-pointer border-b md:border-b-0 bg-slate-100 group/poster select-none"
            style={{
              borderLeft: isRTL ? `1px solid ${COLORS?.border}` : undefined,
              borderRight: !isRTL ? `1px solid ${COLORS?.border}` : undefined,
            }}
            onClick={() => setIsPosterModalOpen(true)}
            title={isRTL ? 'پوسٹر بڑا کر کے دیکھیں' : 'Click to view full poster'}
          >
            <img
              src={posterUrl}
              alt={title}
              className="w-full h-full object-cover transition-transform duration-500 group-hover/poster:scale-105"
              onError={() => setImgError(true)}
              loading="lazy"
            />

            {/* Date Badge floating directly on the poster image */}
            <div
              className={`absolute top-2.5 ${isRTL ? 'right-2.5' : 'left-2.5'} z-10 flex flex-col items-center justify-center rounded-xl px-2.5 py-1 shadow-md border backdrop-blur-xs select-none`}
              style={{
                background: `linear-gradient(135deg, ${COLORS?.primary}ee 0%, #2f1d12ee 100%)`,
                borderColor: `${COLORS?.accent}90`,
                color: '#ffffff',
              }}
            >
              <span className="text-base sm:text-lg font-black font-serif leading-none">
                {dayNum}
              </span>
              <span className="text-[9px] font-bold uppercase tracking-wider text-amber-300 mt-0.5">
                {monthName}
              </span>
              <span className="text-[9px] text-slate-200 font-medium">
                {dayName}
              </span>
            </div>

            {/* Subtle bottom badge for quick tap awareness */}
            <div className="absolute bottom-1.5 inset-x-2 flex items-center justify-center pointer-events-none">
              <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-black/70 backdrop-blur-xs text-white text-[10px] sm:text-[11px] font-semibold shadow-md transition-transform group-hover/poster:scale-105">
                <ZoomIn className="w-3 h-3 text-amber-300" />
                <span>{isRTL ? 'پوسٹر دیکھیں' : 'View Poster'}</span>
              </span>
            </div>

            {/* Hover overlay with zoom icon */}
            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover/poster:opacity-100 transition-opacity flex items-center justify-center text-white text-xs font-bold gap-2 p-2 text-center pointer-events-none">
              <div className="w-8 h-8 rounded-full bg-white/20 backdrop-blur-xs flex items-center justify-center">
                <ZoomIn className="w-4 h-4 text-amber-300" />
              </div>
              <span className="font-serif">{isRTL ? 'پوسٹر بڑا کریں' : 'Enlarge Poster'}</span>
            </div>
          </div>
        ) : (
          /* Graceful Fallback When Poster is Not Available or Errors */
          <div
            className="relative w-full h-28 md:h-auto md:w-56 shrink-0 overflow-hidden border-b md:border-b-0 flex flex-col items-center justify-center p-3 text-center"
            style={{
              background: `linear-gradient(135deg, ${COLORS?.secondary}40 0%, ${COLORS?.background} 100%)`,
              borderLeft: isRTL ? `1px solid ${COLORS?.border}` : undefined,
              borderRight: !isRTL ? `1px solid ${COLORS?.border}` : undefined,
            }}
          >
            <div
              className="rounded-xl flex flex-col items-center justify-center shadow-xs border px-3 py-1.5"
              style={{
                background: `linear-gradient(135deg, ${COLORS?.primary} 0%, #2f1d12 100%)`,
                borderColor: COLORS?.accent,
                color: '#ffffff',
              }}
            >
              <span className="text-lg font-black font-serif leading-none">
                {dayNum}
              </span>
              <span className="text-[9px] font-bold uppercase tracking-wider text-amber-300 mt-0.5">
                {monthName}
              </span>
            </div>
            <span
              className="text-[11px] font-semibold mt-1"
              style={{ color: COLORS?.primary }}
            >
              {dayName}
            </span>
          </div>
        )}

        {/* Content Body */}
        <div className="p-2.5 sm:p-3.5 md:p-4 flex flex-col justify-between flex-1 gap-2">
          <div>
            {/* Top row: Time */}
            <div className="flex items-center justify-between gap-2 mb-1">
              <div
                className="inline-flex items-center gap-1 text-[11px] font-semibold px-2 py-0.5 rounded-md border"
                style={{
                  backgroundColor: `${COLORS?.primary}08`,
                  borderColor: `${COLORS?.border}`,
                  color: COLORS?.primary,
                }}
              >
                <Clock className="w-3 h-3" style={{ color: COLORS?.accent }} />
                <span>{formattedTime}</span>
              </div>
            </div>

            {/* Event Title */}
            <h3
              className="text-sm sm:text-base font-bold font-serif leading-snug mb-0.5 group-hover:text-accent transition-colors line-clamp-1 sm:line-clamp-2"
              style={{ color: COLORS?.primary }}
            >
              {title}
            </h3>

            {/* Description (compact 2 lines max) */}
            {description && (
              <p
                className="text-[11px] sm:text-xs leading-relaxed font-normal line-clamp-2 mb-1.5 text-slate-600"
              >
                {description}
              </p>
            )}

            {/* Location Row: Google Maps strictly on LEFT, Address strictly on RIGHT */}
            {location && (
              <div
                dir="ltr"
                className="rounded-lg border px-2.5 py-1.5 flex items-center justify-between gap-2.5 transition-colors mt-1"
                style={{
                  backgroundColor: `${COLORS?.background}`,
                  borderColor: `${COLORS?.border}`,
                }}
              >
                {/* Physical LEFT: Google Maps Button */}
                <a
                  href={mapsUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center gap-1.5 text-[10px] sm:text-[11px] font-bold px-2.5 py-1.5 rounded-lg transition-all shadow-2xs shrink-0 cursor-pointer hover:opacity-90 active:scale-95 whitespace-nowrap"
                  style={{
                    backgroundColor: COLORS?.primary,
                    color: '#ffffff',
                  }}
                  title={isRTL ? 'گوگل میپس پر راستہ دیکھیں' : 'Open in Google Maps'}
                >
                  <Navigation className="w-3 h-3 text-amber-300 shrink-0" />
                  <span>{isRTL ? 'گوگل میپس' : 'Maps'}</span>
                  <ExternalLink className="w-2.5 h-2.5 opacity-80 shrink-0" />
                </a>

                {/* Physical RIGHT: Address with Location Icon */}
                <div className="flex items-center justify-end gap-1.5 min-w-0 max-w-[65%] sm:max-w-[70%]">
                  <div className="min-w-0 text-right truncate" dir={isRTL ? 'rtl' : 'ltr'}>
                    {event.coordinates?.latitude !== undefined &&
                      event.coordinates?.longitude !== undefined && (
                        <span className="text-[9px] font-mono px-1 py-0.2 rounded bg-amber-100/90 text-amber-900 border border-amber-300/70 inline-flex items-center me-1 shrink-0">
                          📍 GPS
                        </span>
                      )}
                    <span
                      className="text-[11px] sm:text-xs font-semibold text-slate-800 truncate"
                      title={location}
                    >
                      {location}
                    </span>
                  </div>
                  <div
                    className="w-6 h-6 rounded-md flex items-center justify-center shrink-0 shadow-2xs"
                    style={{
                      backgroundColor: `${COLORS?.secondary}`,
                      color: COLORS?.accent,
                    }}
                  >
                    <MapPin className="w-3.5 h-3.5 text-accent" />
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Action Row: Buttons on Left */}
          <div
            dir="ltr"
            className="pt-1.5 border-t flex items-center justify-between gap-2 text-xs"
            style={{ borderColor: `${COLORS?.border}90` }}
          >
            {/* Buttons on Left */}
            <div className="flex items-center gap-1.5 flex-wrap">
              {/* View Poster button */}
              {posterUrl && !imgError && (
                <button
                  type="button"
                  onClick={() => setIsPosterModalOpen(true)}
                  className="inline-flex items-center gap-1 px-2 py-1 rounded-md border hover:bg-slate-50 transition-colors font-semibold cursor-pointer shadow-2xs text-[10px] sm:text-[11px]"
                  style={{
                    borderColor: `${COLORS?.accent}60`,
                    color: COLORS?.primary,
                    backgroundColor: `${COLORS?.secondary}20`,
                  }}
                  title={isRTL ? 'پوسٹر دیکھیں' : 'View Full Poster'}
                >
                  <ZoomIn className="w-3 h-3 text-accent" />
                  <span>{isRTL ? 'پوسٹر دیکھیں' : 'View Poster'}</span>
                </button>
              )}

              {isUpcoming && (
                <a
                  href={createGoogleCalendarUrl()}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 font-semibold px-2 py-1 rounded-md border transition-all hover:bg-slate-50 shadow-2xs text-[10px] sm:text-[11px]"
                  style={{
                    borderColor: `${COLORS?.accent}70`,
                    color: COLORS?.primary,
                    backgroundColor: `${COLORS?.background}`,
                  }}
                >
                  <CalendarPlus className="w-3 h-3 text-accent" />
                  <span>{isRTL ? 'کیلنڈر' : 'Calendar'}</span>
                </a>
              )}

              {/* Share Button on Left */}
              <button
                type="button"
                onClick={handleShare}
                className="inline-flex items-center gap-1 px-2 py-1 rounded-md border hover:bg-slate-50 transition-colors font-semibold cursor-pointer shadow-2xs text-[10px] sm:text-[11px]"
                style={{
                  borderColor: COLORS?.border,
                  color: COLORS?.textSecondary,
                  backgroundColor: COLORS?.white,
                }}
                title={isRTL ? 'شیئر کریں' : 'Share'}
              >
                <Share2 className="w-3 h-3" />
                <span>{isRTL ? 'شیئر' : 'Share'}</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Poster Image Preview Modal via Portal (Escapes any overflow or CSS transform context) */}
      {isPosterModalOpen && posterUrl && !imgError && typeof document !== 'undefined' &&
        createPortal(
          <div
            className="fixed inset-0 z-[99999] flex items-center justify-center p-3 sm:p-6 bg-black/85 backdrop-blur-sm animate-in fade-in duration-200"
            onClick={() => setIsPosterModalOpen(false)}
            dir={isRTL ? 'rtl' : 'ltr'}
          >
            <div
              className="relative max-w-3xl w-full max-h-[94vh] flex flex-col rounded-2xl overflow-hidden bg-white shadow-2xl border-2 animate-in zoom-in-95 duration-200"
              style={{ borderColor: COLORS?.accent }}
              onClick={(e) => e.stopPropagation()}
            >
              {/* Header */}
              <div
                className="flex items-center justify-between px-4 py-3 border-b shrink-0"
                style={{
                  backgroundColor: `${COLORS?.secondary}30`,
                  borderColor: `${COLORS?.border}`,
                }}
              >
                <div className="flex items-center gap-2 min-w-0 pr-2">
                  <span className="w-2 h-2 rounded-full bg-accent animate-pulse shrink-0" />
                  <span
                    className="text-xs sm:text-sm font-bold font-serif truncate"
                    style={{ color: COLORS?.primary }}
                  >
                    {title}
                  </span>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <a
                    href={posterUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-lg border hover:bg-white transition-colors cursor-pointer text-slate-700 shadow-2xs"
                    title={isRTL ? 'مکمل تصویر الگ ونڈو میں کھولیں' : 'Open full size in new tab'}
                  >
                    <ExternalLink className="w-3.5 h-3.5 text-accent" />
                    <span className="hidden sm:inline">
                      {isRTL ? 'اصل تصویر' : 'Original Size'}
                    </span>
                  </a>
                  <button
                    type="button"
                    onClick={() => setIsPosterModalOpen(false)}
                    className="p-1.5 rounded-lg hover:bg-slate-200 text-slate-700 transition-colors cursor-pointer"
                    title={isRTL ? 'بند کریں' : 'Close'}
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
              </div>

              {/* Image Content */}
              <div className="flex-1 p-2 sm:p-4 overflow-auto flex items-center justify-center bg-slate-900/5">
                <img
                  src={posterUrl}
                  alt={title}
                  className="max-w-full max-h-[78vh] object-contain rounded-xl shadow-md select-none"
                />
              </div>

              {/* Footer */}
              <div
                className="px-4 py-2.5 border-t text-xs flex items-center justify-between gap-3 shrink-0"
                style={{
                  backgroundColor: `${COLORS?.background}`,
                  borderColor: `${COLORS?.border}`,
                  color: COLORS?.textSecondary,
                }}
              >
                <div className="flex items-center gap-1.5 min-w-0 flex-1">
                  <MapPin className="w-3.5 h-3.5 text-accent shrink-0" />
                  <span className="text-[11px] truncate font-medium">{location}</span>
                </div>
                <span className="text-[11px] text-slate-400 shrink-0 hidden sm:inline">
                  {isRTL ? 'بند کرنے کے لیے کہیں بھی کلک کریں یا Esc دبائیں' : 'Click outside or press Esc to close'}
                </span>
              </div>
            </div>
          </div>,
          document.body
        )}
    </>
  );
}

EventCard.propTypes = {
  event: PropTypes.shape({
    _id: PropTypes.string,
    title: PropTypes.string.isRequired,
    description: PropTypes.string,
    eventDate: PropTypes.string.isRequired,
    location: PropTypes.string,
    coordinates: PropTypes.shape({
      latitude: PropTypes.number,
      longitude: PropTypes.number,
    }),
    posterImage: PropTypes.oneOfType([
      PropTypes.string,
      PropTypes.shape({
        url: PropTypes.string,
        public_id: PropTypes.string,
      }),
    ]),
  }).isRequired,
  isCompact: PropTypes.bool,
};
