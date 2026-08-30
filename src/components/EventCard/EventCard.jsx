import PropTypes from 'prop-types';
import React, { useState } from 'react';
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
} from 'lucide-react';
import { useSettings } from '@/hooks/useSettings';
import { COLORS } from '@/utils/themeColors';
import toast from 'react-hot-toast';

export default function EventCard({ event, isCompact = false }) {
  const { settings } = useSettings();
  const language =
    settings?.language === 'ur' || settings?.language === 'Urdu' ? 'ur' : 'en';
  const isRTL = language === 'ur';

  const [isPosterModalOpen, setIsPosterModalOpen] = useState(false);

  if (!event) return null;

  const { title, description, eventDate, location, posterImage } = event;

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
          borderLeft: !isRTL ? `5px solid ${COLORS?.accent}` : undefined,
          boxShadow: '0 2px 8px rgba(74,55,40,0.06)',
        }}
      >
        {/* Date Stamp Block with rich warm colors */}
        <div
          className="p-4 sm:p-5 flex flex-row md:flex-col items-center justify-between md:justify-center text-center gap-3 shrink-0 border-b md:border-b-0"
          style={{
            background: `linear-gradient(180deg, ${COLORS?.secondary}35 0%, ${COLORS?.background} 100%)`,
            borderLeft: isRTL ? `1px solid ${COLORS?.border}` : undefined,
            borderRight: !isRTL ? `1px solid ${COLORS?.border}` : undefined,
            minWidth: '130px',
          }}
        >
          {/* Day Number badge */}
          <div
            className="w-14 h-14 md:w-16 md:h-16 rounded-2xl flex flex-col items-center justify-center shadow-xs border-2 transition-transform group-hover:scale-105"
            style={{
              background: isUpcoming
                ? `linear-gradient(135deg, ${COLORS?.primary} 0%, #2f1d12 100%)`
                : COLORS?.secondary,
              borderColor: COLORS?.accent,
              color: isUpcoming ? '#ffffff' : COLORS?.primary,
            }}
          >
            <span className="text-xl md:text-2xl font-black font-serif leading-none">
              {dayNum}
            </span>
            <span
              className="text-[10px] md:text-xs font-bold uppercase tracking-wider mt-0.5"
              style={{ color: isUpcoming ? COLORS?.accent : COLORS?.textSecondary }}
            >
              {monthName}
            </span>
          </div>

          <div className="flex flex-col items-end md:items-center">
            <span
              className="text-xs font-bold font-serif"
              style={{ color: COLORS?.primary }}
            >
              {dayName}
            </span>
            <span
              className="text-[11px] font-semibold"
              style={{ color: COLORS?.accent }}
            >
              {yearNum}
            </span>
          </div>

          {/* Status badge on mobile */}
          <div className="block md:hidden">
            <span
              className="text-[10px] font-bold px-2.5 py-1 rounded-full uppercase tracking-wider shadow-2xs"
              style={{
                backgroundColor: isUpcoming ? '#059669' : '#64748b',
                color: '#ffffff',
              }}
            >
              {isUpcoming
                ? isRTL
                  ? 'آنے والا پروگرام'
                  : 'Upcoming'
                : isRTL
                ? 'مکمل شدہ'
                : 'Completed'}
            </span>
          </div>
        </div>

        {/* Poster Image (Optional) */}
        {posterImage && (
          <div
            className="relative h-44 md:h-auto md:w-44 shrink-0 overflow-hidden cursor-pointer border-b md:border-b-0"
            style={{
              borderLeft: isRTL ? `1px solid ${COLORS?.border}` : undefined,
              borderRight: !isRTL ? `1px solid ${COLORS?.border}` : undefined,
            }}
            onClick={() => setIsPosterModalOpen(true)}
          >
            <img
              src={posterImage}
              alt={title}
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
              onError={(e) => {
                e.currentTarget.style.display = 'none';
              }}
            />
            <div
              className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white text-xs font-bold gap-1"
            >
              <ExternalLink className="w-4 h-4" />
              <span>{isRTL ? 'پوسٹر دیکھیں' : 'View Poster'}</span>
            </div>
          </div>
        )}

        {/* Content Body */}
        <div className="p-4 sm:p-6 flex flex-col justify-between flex-1 gap-3.5">
          <div>
            {/* Top row: Status Badge on Desktop + Time */}
            <div className="flex items-center justify-between gap-2 mb-2">
              <span
                className="hidden md:inline-flex items-center gap-1 text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-wider text-white shadow-xs"
                style={{
                  backgroundColor: isUpcoming ? '#059669' : '#64748b',
                }}
              >
                <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
                <span>
                  {isUpcoming
                    ? isRTL
                      ? 'آنے والا سیمینار / مجلس'
                      : 'Upcoming Gathering'
                    : isRTL
                    ? 'مکمل شدہ مجلس'
                    : 'Completed'}
                </span>
              </span>

              <div
                className="inline-flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded-lg border ms-auto"
                style={{
                  backgroundColor: `${COLORS?.primary}08`,
                  borderColor: `${COLORS?.border}`,
                  color: COLORS?.primary,
                }}
              >
                <Clock className="w-3.5 h-3.5" style={{ color: COLORS?.accent }} />
                <span>{formattedTime}</span>
              </div>
            </div>

            {/* Event Title */}
            <h3
              className="text-base sm:text-lg font-bold font-serif leading-[1.8] mb-2 group-hover:text-accent transition-colors"
              style={{ color: COLORS?.primary }}
            >
              {title}
            </h3>

            {/* Description */}
            {description && (
              <p
                className="text-xs sm:text-sm leading-[2.1] font-normal line-clamp-3 mb-3"
                style={{ color: COLORS?.textSecondary }}
              >
                {description}
              </p>
            )}

            {/* Location Tag with warm accent pill */}
            {location && (
              <div
                className="inline-flex items-center gap-1.5 text-xs font-medium px-3 py-1.5 rounded-xl border shadow-2xs"
                style={{
                  backgroundColor: `${COLORS?.secondary}35`,
                  borderColor: `${COLORS?.accent}60`,
                  color: COLORS?.primary,
                }}
              >
                <MapPin className="w-3.5 h-3.5" style={{ color: COLORS?.accent }} />
                <span className="line-clamp-1 font-semibold">{location}</span>
              </div>
            )}
          </div>

          {/* Action Row */}
          <div
            className="pt-3 border-t flex flex-wrap items-center justify-between gap-2 text-xs"
            style={{ borderColor: `${COLORS?.border}90` }}
          >
            {isUpcoming ? (
              <a
                href={createGoogleCalendarUrl()}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 font-bold px-3 py-1.5 rounded-xl border transition-all hover:bg-slate-50 shadow-2xs"
                style={{
                  borderColor: `${COLORS?.accent}70`,
                  color: COLORS?.primary,
                  backgroundColor: `${COLORS?.background}`,
                }}
              >
                <CalendarPlus className="w-3.5 h-3.5" style={{ color: COLORS?.accent }} />
                <span>
                  {isRTL ? 'کیلنڈر میں شامل کریں' : 'Add to Google Calendar'}
                </span>
              </a>
            ) : (
              <span
                className="text-[11px] font-medium"
                style={{ color: COLORS?.textSecondary }}
              >
                {isRTL ? 'یہ مجلس منعقد ہو چکی ہے' : 'This gathering has concluded'}
              </span>
            )}

            <button
              type="button"
              onClick={handleShare}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border hover:bg-slate-50 transition-colors font-semibold cursor-pointer shadow-2xs"
              style={{
                borderColor: COLORS?.border,
                color: COLORS?.textSecondary,
                backgroundColor: COLORS?.white,
              }}
            >
              <Share2 className="w-3 h-3" />
              <span>{isRTL ? 'شیئر کریں' : 'Share'}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Poster Image Preview Modal */}
      {isPosterModalOpen && posterImage && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-xs"
          onClick={() => setIsPosterModalOpen(false)}
        >
          <div
            className="relative max-w-2xl w-full rounded-2xl overflow-hidden bg-white shadow-2xl p-2 border-2"
            style={{ borderColor: COLORS?.accent }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between p-2 border-b">
              <span className="text-xs font-bold" style={{ color: COLORS?.primary }}>
                {title}
              </span>
              <button
                type="button"
                onClick={() => setIsPosterModalOpen(false)}
                className="text-xs font-bold px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-slate-200 cursor-pointer"
              >
                ✕
              </button>
            </div>
            <div className="p-2 flex items-center justify-center max-h-[80vh] overflow-auto">
              <img
                src={posterImage}
                alt={title}
                className="max-w-full max-h-[75vh] object-contain rounded-xl"
              />
            </div>
          </div>
        </div>
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
    posterImage: PropTypes.string,
  }).isRequired,
  isCompact: PropTypes.bool,
};
