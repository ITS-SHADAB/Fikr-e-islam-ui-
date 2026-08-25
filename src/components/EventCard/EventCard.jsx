import PropTypes from 'prop-types';
import React from 'react';
import { Calendar, MapPin, Clock } from 'lucide-react';
import { useSettings } from '@/hooks/useSettings';

export default function EventCard({ event }) {
  const { settings } = useSettings();
  const language = settings?.language === 'ur' || settings?.language === 'Urdu' ? 'ur' : 'en';

  const { title, description, eventDate, location, posterImage } = event;

  const parsedDate = new Date(eventDate);
  const locale = language === 'ur' ? 'ur-PK' : 'en-US';
  const monthName = parsedDate.toLocaleDateString(locale, { month: 'short' }).toUpperCase();
  const dayNum = parsedDate.toLocaleString(locale, { day: 'numeric' });
  const yearNum = parsedDate.toLocaleString(locale, { year: 'numeric' });

  const formattedTime = parsedDate.toLocaleTimeString(locale, {
    hour: '2-digit',
    minute: '2-digit',
  });

  const isUpcoming = parsedDate.getTime() > Date.now();
  const BACKEND_URL = 'https://fikr-e-islam.onrender.com';
  const placeholderPoster = 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?auto=format&fit=crop&q=80&w=800';

  const getImageSrc = (url) => {
    if (!url) return placeholderPoster;
    if (url.startsWith('/')) return `${BACKEND_URL}${url}`;
    return url;
  };

  return (
    <div className={`premium-card shadow-sm overflow-hidden flex flex-col h-full md:flex-row group ${language === 'ur' ? 'text-right' : 'text-left'}`}>

      {/* Poster Image */}
      <div className="relative h-48 md:h-auto md:w-48 bg-slate-100 dark:bg-slate-900 shrink-0 overflow-hidden">
        <img
          src={getImageSrc(posterImage)}
          alt={title}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          loading="lazy"
          onError={(e) => { e.currentTarget.onerror = null; e.currentTarget.src = placeholderPoster; }}
        />

        {/* Status Badge */}
        <div className={`absolute top-3 right-3 text-xs font-bold uppercase tracking-wider px-2.5 py-1 rounded-full shadow-sm ${isUpcoming ? 'bg-secondary text-textSecondary' : 'bg-slate-500 text-white'
          }`}>
          {isUpcoming
            ? (language === 'en' ? 'Upcoming' : 'آنے والا')
            : (language === 'en' ? 'Past Program' : 'گزشتہ پروگرام')
          }
        </div>
      </div>

      {/* Card Content */}
      <div className={`p-4 flex flex-col flex-grow md:flex-row items-stretch gap-4 ${language === 'ur' ? 'text-right' : 'text-left'}`}>

        {/* Date Stamp Block (Right Side on Desktop in RTL) */}
        <div className={`flex flex-row md:flex-col items-center justify-center border-b md:border-b-0 ${language === 'ur' ? 'md:border-l md:pl-4' : 'md:border-r md:pr-4'
          } border-border pb-4 md:pb-0 shrink-0 text-center gap-4`}>
          <div className="w-12 md:w-16 h-12 md:h-16 rounded bg-secondary flex flex-col items-center justify-center text-primary">
            <span className="text-lg font-bold leading-none">{dayNum}</span>
            <span className="text-xs font-bold uppercase tracking-wider mt-0.5">{monthName}</span>
          </div>
          <span className="text-xs text-slate-500 font-semibold">{yearNum}</span>
        </div>

        {/* Textual Details */}
        <div className={`flex flex-col flex-grow justify-between ${language === 'ur' ? 'text-right' : 'text-left'}`}>
          <div>
            {/* Title */}
            <h3 className={`text-base font-bold text-slate-900 group-hover:text-primary transition-colors leading-snug mb-4 font-serif ${language === 'ur' ? 'text-right' : 'text-left'}`}>
              {title}
            </h3>

            {/* Description */}
            <p className={`text-textPrimary text-sm font-light leading-relaxed line-clamp-3 mb-4 ${language === 'ur' ? 'text-right' : 'text-left'}`}>
              {description}
            </p>
          </div>

          {/* Time and Location markers */}
          <div className={`flex flex-col gap-4 pt-4 border-t border-slate-100 text-sm text-slate-500 justify-start ${language === 'ur' ? 'text-right' : 'text-left'}`}>
            <span className="flex items-center gap-2">
              <Clock className="w-5 h-5 text-accent shrink-0" />
              {formattedTime}
            </span>
            <span className="flex items-start gap-2">
              <MapPin className="w-5 h-5 text-accent shrink-0 mt-0.5" />
              <span className="line-clamp-1">{location}</span>
            </span>
          </div>
        </div>

      </div>

    </div>
  );
}

EventCard.propTypes = {
  event: PropTypes.shape({
    title: PropTypes.string.isRequired,
    description: PropTypes.string.isRequired,
    eventDate: PropTypes.string.isRequired,
    location: PropTypes.string.isRequired,
    posterImage: PropTypes.string,
  }).isRequired,
};
