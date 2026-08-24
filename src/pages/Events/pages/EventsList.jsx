import React, { useEffect, useState } from 'react';
import { Calendar } from 'lucide-react';
import { getEvents } from '@/services';
import { useSettings } from '@/hooks/useSettings';
import { EventCard } from '@/components';

export default function EventsList() {
  const { settings } = useSettings();
  const language = settings?.language === 'ur' || settings?.language === 'Urdu' ? 'ur' : 'en';

  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadEvents = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await getEvents();
        setEvents(Array.isArray(data) ? data : []);
      } catch (err) {
        setError(err.response?.data?.message || err.message || 'Failed to load events');
      } finally {
        setLoading(false);
      }
    };
    loadEvents();
  }, []);

  const nowTime = Date.now();
  const upcomingEvents = events?.filter ? events.filter((e) => new Date(e?.eventDate).getTime() > nowTime) : [];
  const pastEvents = events?.filter ? events.filter((e) => new Date(e?.eventDate).getTime() <= nowTime) : [];

  return (
    <div className={`bg-background dark:bg-slate-900 py-12 min-h-screen ${language === 'ur' ? 'text-right' : 'text-left'}`} dir={language === 'ur' ? 'rtl' : 'ltr'}>
      <div className=" mx-auto px-4 sm:px-6">

        {/* Header Title */}
        <div className="mb-12 text-center">
          <span className="text-xs font-bold text-accent dark:text-amber-500 uppercase tracking-widest font-serif block mb-1">
            {language === 'en' ? 'PROGRAMS & GATHERINGS' : 'پروگرام اور اجتماعات'}
          </span>
          <h1 className="text-3xl font-extrabold text-primary dark:text-accent font-serif tracking-wide">
            {language === 'en' ? 'Seminars & Announcements' : 'سیمینارز اور اعلانات'}
          </h1>
          <p className="text-slate-550 dark:text-slate-400 text-sm font-light mt-2 max-w-md mx-auto">
            {language === 'en' ? 'Stay informed about educational seminars, workshops, and weekly scientific gatherings under the supervision of the scholar.' : 'عالم صاحب کی زیر نگرانی ہونے والے تعلیمی سیمینارز، ورکشاپس اور ہفتہ وار علمی مجالس سے باخبر رہیں۔'}
          </p>
        </div>

        {/* Content list Loader */}
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
          </div>
        ) : (
          <div className="space-y-12 text-start">

            {/* Section 1: Upcoming Programs */}
            <div className={language === 'ur' ? 'text-right' : 'text-left'}>
              <h2 className={`text-lg font-bold text-primary dark:text-accent font-serif mb-6 pb-2 border-b border-border/50 dark:border-slate-800 uppercase tracking-wider ${language === 'ur' ? 'text-right' : 'text-left'}`}>
                {language === 'en' ? 'Upcoming Programs' : 'آنے والے پروگرام'}
              </h2>
              {upcomingEvents.length > 0 ? (
                <div className="space-y-6">
                  {upcomingEvents.map((event) => (
                    <EventCard key={event._id} event={event} />
                  ))}
                </div>
              ) : (
                <div className="premium-card p-6 text-center text-slate-555 dark:text-slate-400 italic text-sm">
                  {language === 'en' ? 'No gatherings are scheduled in upcoming programs. Check back soon.' : 'آنے والے پروگراموں میں کوئی اجتماع طے شدہ نہیں ہے۔ جلد ہی دوبارہ دیکھیں۔'}
                </div>
              )}
            </div>

            {/* Section 2: Past Gatherings */}
            {pastEvents.length > 0 && (
              <div className={language === 'ur' ? 'text-right' : 'text-left'}>
                <h2 className={`text-lg font-bold text-slate-450 dark:text-slate-400 font-serif mb-6 pb-2 border-b border-slate-200 dark:border-slate-800 uppercase tracking-wider ${language === 'ur' ? 'text-right' : 'text-left'}`}>
                  {language === 'en' ? 'Completed Programs' : 'مکمل شدہ پروگرام'}
                </h2>
                <div className="space-y-6 opacity-75">
                  {pastEvents.map((event) => (
                    <EventCard key={event._id} event={event} />
                  ))}
                </div>
              </div>
            )}

            {/* Empty view case */}
            {(!events || events.length === 0) && (
              <div className="text-center py-16 premium-card">
                <Calendar className="w-12 h-12 text-accent mx-auto mb-4" />
                <h3 className="text-lg font-bold text-slate-700 dark:text-white font-serif">
                  {language === 'en' ? 'No programs scheduled' : 'کوئی پروگرام طے شدہ نہیں ہے'}
                </h3>
                <p className="text-slate-555 dark:text-slate-400 text-xs mt-1">
                  {language === 'en' ? 'No programs are currently registered in the system.' : 'سسٹم میں فی الحال کوئی پروگرام درج نہیں ہے۔'}
                </p>
              </div>
            )}

          </div>
        )}

      </div>
    </div>
  );
}
