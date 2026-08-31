import React, { useEffect, useState, useMemo } from 'react';
import {
  Calendar as CalendarIcon,
  ChevronLeft,
  ChevronRight,
  Search,
  MapPin,
  Clock,
  Sparkles,
  CalendarDays,
  ListFilter,
  CheckCircle,
  X,
  Layers,
  LayoutGrid,
  CalendarCheck2,
  Bookmark,
  CalendarPlus,
} from 'lucide-react';
import { getEvents } from '@/services';
import { useSettings } from '@/hooks/useSettings';
import { EventCard } from '@/components';
import { COLORS } from '@/utils/themeColors';

const URDU_MONTHS = [
  'جنوری',
  'فروری',
  'مارچ',
  'اپریل',
  'مئی',
  'جون',
  'جولائی',
  'اگست',
  'ستمبر',
  'اکتوبر',
  'نومبر',
  'دسمبر',
];

const URDU_WEEKDAYS_SHORT = ['اتوار', 'پیر', 'منگل', 'بدھ', 'جمعرات', 'جمعہ', 'ہفتہ'];
const URDU_WEEKDAYS_MINI = ['ات', 'پی', 'من', 'بد', 'جم', 'جع', 'ہف'];
const ENGLISH_WEEKDAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

export default function EventsList() {
  const { settings } = useSettings();
  const language =
    settings?.language === 'ur' || settings?.language === 'Urdu' ? 'ur' : 'en';
  const isRTL = language === 'ur';

  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Calendar State
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(null);
  const [activeTab, setActiveTab] = useState('all'); // 'all', 'upcoming', 'past', 'calendar'
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const loadEvents = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await getEvents();
        setEvents(Array.isArray(data) ? data : data?.events || []);
      } catch (err) {
        setError(
          err?.response?.data?.message ||
            err?.message ||
            (isRTL ? 'پروگرام لوڈ کرنے میں ناکامی' : 'Failed to load events')
        );
      } finally {
        setLoading(false);
      }
    };
    loadEvents();
  }, [isRTL]);

  // Year and Month of Calendar View
  const currentYear = currentDate.getFullYear();
  const currentMonth = currentDate.getMonth();

  const handlePrevMonth = () => {
    setCurrentDate(new Date(currentYear, currentMonth - 1, 1));
  };

  const handleNextMonth = () => {
    setCurrentDate(new Date(currentYear, currentMonth + 1, 1));
  };

  const handleToday = () => {
    const today = new Date();
    setCurrentDate(today);
    setSelectedDate(today);
    setActiveTab('calendar');
  };

  // Map events to date strings (YYYY-MM-DD)
  const eventsByDate = useMemo(() => {
    const map = {};
    events?.forEach((ev) => {
      if (!ev?.eventDate) return;
      const d = new Date(ev.eventDate);
      const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(
        2,
        '0'
      )}-${String(d.getDate()).padStart(2, '0')}`;
      if (!map[key]) map[key] = [];
      map[key].push(ev);
    });
    return map;
  }, [events]);

  // Calendar Days Computation
  const calendarDays = useMemo(() => {
    const firstDayIndex = new Date(currentYear, currentMonth, 1).getDay();
    const totalDaysInMonth = new Date(
      currentYear,
      currentMonth + 1,
      0
    ).getDate();
    const prevMonthDays = new Date(currentYear, currentMonth, 0).getDate();

    const days = [];

    // Previous month padding days
    for (let i = firstDayIndex - 1; i >= 0; i--) {
      days.push({
        day: prevMonthDays - i,
        month: currentMonth - 1,
        year: currentYear,
        isCurrentMonth: false,
      });
    }

    // Current month days
    for (let i = 1; i <= totalDaysInMonth; i++) {
      days.push({
        day: i,
        month: currentMonth,
        year: currentYear,
        isCurrentMonth: true,
      });
    }

    // Next month padding days to complete grid
    const remaining = 35 - (days.length % 35);
    if (remaining > 0 && remaining < 7) {
      for (let i = 1; i <= remaining; i++) {
        days.push({
          day: i,
          month: currentMonth + 1,
          year: currentYear,
          isCurrentMonth: false,
        });
      }
    }

    return days;
  }, [currentYear, currentMonth]);

  const nowTime = Date.now();
  const upcomingEvents = useMemo(
    () =>
      events?.filter
        ? events.filter(
            (e) => new Date(e?.eventDate).getTime() >= nowTime - 86400000
          )
        : [],
    [events, nowTime]
  );
  const pastEvents = useMemo(
    () =>
      events?.filter
        ? events.filter(
            (e) => new Date(e?.eventDate).getTime() < nowTime - 86400000
          )
        : [],
    [events, nowTime]
  );

  // Selected date key
  const selectedDateKey = selectedDate
    ? `${selectedDate.getFullYear()}-${String(
        selectedDate.getMonth() + 1
      ).padStart(2, '0')}-${String(selectedDate.getDate()).padStart(2, '0')}`
    : null;

  const selectedDateEvents = selectedDateKey
    ? eventsByDate[selectedDateKey] || []
    : [];

  // Filtered events based on tab and search
  const displayedEvents = useMemo(() => {
    let list = events;

    if (activeTab === 'upcoming') {
      list = upcomingEvents;
    } else if (activeTab === 'past') {
      list = pastEvents;
    } else if (activeTab === 'calendar' && selectedDate) {
      list = selectedDateEvents;
    }

    if (searchTerm?.trim()) {
      const q = searchTerm.toLowerCase();
      list = list.filter(
        (ev) =>
          ev?.title?.toLowerCase()?.includes(q) ||
          ev?.description?.toLowerCase()?.includes(q) ||
          ev?.location?.toLowerCase()?.includes(q)
      );
    }

    return list;
  }, [
    activeTab,
    events,
    upcomingEvents,
    pastEvents,
    selectedDate,
    selectedDateEvents,
    searchTerm,
  ]);

  const todayObj = new Date();
  const todayKey = `${todayObj.getFullYear()}-${String(
    todayObj.getMonth() + 1
  ).padStart(2, '0')}-${String(todayObj.getDate()).padStart(2, '0')}`;

  const currentMonthName = isRTL
    ? URDU_MONTHS[currentMonth]
    : currentDate.toLocaleDateString('en-US', { month: 'long' });

  return (
    <div
      dir={isRTL ? 'rtl' : 'ltr'}
      className="min-h-screen font-sans"
      style={{ backgroundColor: COLORS?.background }}
    >
      {/* ══════════════════════════════════════════════════
          1. HERO HEADER — Rich Editorial Masthead with Border Accents
      ══════════════════════════════════════════════════ */}
      <div
        className="w-full py-8 sm:py-12 px-4 text-white relative overflow-hidden border-b-4"
        style={{
          background: `linear-gradient(135deg, ${COLORS?.primary} 0%, #22140a 100%)`,
          borderBottomColor: COLORS?.accent,
        }}
      >
        <div className="w-full max-w-7xl mx-auto text-center relative z-10 px-4">
          <div
            className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-bold uppercase tracking-widest mb-3 border"
            style={{
              backgroundColor: `${COLORS?.accent}25`,
              borderColor: `${COLORS?.accent}60`,
              color: COLORS?.accent,
            }}
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>{isRTL ? 'سیمینارز، اعلانات و شیڈول' : 'SCHEDULE & ANNOUNCEMENTS'}</span>
          </div>

          <h1 className="text-xl sm:text-2xl font-bold font-serif mb-2 leading-snug text-white">
            {isRTL
              ? 'سیمینارز، علمی مجالس اور اعلانات'
              : 'Seminars, Academic Gatherings & Events'}
          </h1>

          {/* Ornamental Divider */}
          <div className="flex items-center justify-center gap-2 py-1 max-w-xs mx-auto">
            <div className="flex-1 h-px bg-white/20" />
            <span className="text-xs" style={{ color: COLORS?.accent }}>✤</span>
            <div className="flex-1 h-px bg-white/20" />
          </div>

          <p
            className="text-xs sm:text-sm max-w-2xl mx-auto leading-relaxed mt-1"
            style={{ color: `${COLORS?.accent}dd` }}
          >
            {isRTL
              ? 'دار الافتاء کے تحت منعقد ہونے والے خصوصی دروس، علمی سیمینارز اور مجالس کا ماہانہ کیلنڈر اور اعلانات'
              : 'Official monthly calendar of seminars, workshops, and educational gatherings.'}
          </p>

          {/* Stat Badges */}
          <div className="flex flex-wrap items-center justify-center gap-2.5 sm:gap-3.5 mt-4">
            <div
              className="px-3.5 py-1.5 rounded-xl border-2 text-xs font-bold shadow-xs"
              style={{
                backgroundColor: 'rgba(255,255,255,0.1)',
                borderColor: `${COLORS?.accent}80`,
                color: '#ffffff',
              }}
            >
              <span>{isRTL ? 'کل پروگرام:' : 'Total Events:'} </span>
              <span className="text-amber-300 ms-1 font-black">{events?.length || 0}</span>
            </div>

            <div
              className="px-3.5 py-1.5 rounded-xl border-2 text-xs font-bold shadow-xs"
              style={{
                backgroundColor: `${COLORS?.primary}15`,
                borderColor: COLORS?.accent,
                color: '#ffffff',
              }}
            >
              <span className="w-2 h-2 rounded-full bg-amber-400 inline-block me-1.5 animate-pulse" />
              <span>{isRTL ? 'آنے والی مجالس:' : 'Upcoming:'} </span>
              <span className="text-amber-300 ms-1 font-black">
                {upcomingEvents?.length || 0}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* ══════════════════════════════════════════════════
          2. MAIN CONTENT — 50% / 50% SPLIT (CALENDAR & DETAILS)
      ══════════════════════════════════════════════════ */}
      <div className="w-full max-w-full px-4 sm:px-6 lg:px-8 xl:px-12 py-6 sm:py-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8 items-start">

          {/* ──────────────────────────────────────────────
              COLUMN 1: Interactive Monthly Calendar (50% on Desktop)
          ────────────────────────────────────────────── */}
          <div className="w-full lg:sticky lg:top-20 space-y-4">
            <div
              className="rounded-2xl border-2 shadow-sm p-4 sm:p-6 overflow-hidden"
              style={{
                backgroundColor: COLORS?.white,
                borderColor: COLORS?.border,
                boxShadow: '0 4px 16px rgba(74,55,40,0.06)',
              }}
            >
              {/* Calendar Header / Toolbar */}
              <div
                className="flex items-center justify-between gap-2 pb-4 mb-4 border-b-2"
                style={{ borderColor: `${COLORS?.border}` }}
              >
                <div className="flex items-center gap-2.5">
                  <div
                    className="w-10 h-10 rounded-xl flex items-center justify-center shadow-xs border shrink-0"
                    style={{
                      backgroundColor: `${COLORS?.secondary}`,
                      borderColor: `${COLORS?.accent}60`,
                      color: COLORS?.primary,
                    }}
                  >
                    <CalendarIcon className="w-5 h-5" />
                  </div>
                  <div>
                    <h2
                      className="text-base sm:text-lg font-bold font-serif leading-none flex items-center gap-2"
                      style={{ color: COLORS?.primary }}
                    >
                      <span>{currentMonthName} {currentYear}</span>
                    </h2>
                    <span
                      className="text-[10px] sm:text-[11px] font-semibold block mt-1"
                      style={{ color: COLORS?.accent }}
                    >
                      {isRTL
                        ? 'تاریخ پر کلک کر کے اس دن کا شیڈول دیکھیں'
                        : 'Tap a date to view day schedule'}
                    </span>
                  </div>
                </div>

                {/* Navigation Buttons */}
                <div className="flex items-center gap-1.5">
                  <button
                    type="button"
                    onClick={handleToday}
                    className="px-3 py-1.5 rounded-xl border-2 text-xs font-bold hover:bg-slate-50 transition-all cursor-pointer shadow-2xs"
                    style={{
                      borderColor: COLORS?.accent,
                      color: COLORS?.primary,
                      backgroundColor: `${COLORS?.secondary}35`,
                    }}
                  >
                    {isRTL ? 'آج' : 'Today'}
                  </button>

                  <div className="flex items-center gap-1">
                    <button
                      type="button"
                      onClick={handlePrevMonth}
                      className="p-1.5 sm:p-2 rounded-xl border-2 hover:bg-slate-50 transition-colors cursor-pointer"
                      style={{
                        borderColor: COLORS?.border,
                        color: COLORS?.textSecondary,
                        backgroundColor: COLORS?.white,
                      }}
                      title={isRTL ? 'پچھلا مہینہ' : 'Previous Month'}
                    >
                      {isRTL ? (
                        <ChevronRight className="w-4 h-4" />
                      ) : (
                        <ChevronLeft className="w-4 h-4" />
                      )}
                    </button>
                    <button
                      type="button"
                      onClick={handleNextMonth}
                      className="p-1.5 sm:p-2 rounded-xl border-2 hover:bg-slate-50 transition-colors cursor-pointer"
                      style={{
                        borderColor: COLORS?.border,
                        color: COLORS?.textSecondary,
                        backgroundColor: COLORS?.white,
                      }}
                      title={isRTL ? 'اگلا مہینہ' : 'Next Month'}
                    >
                      {isRTL ? (
                        <ChevronLeft className="w-4 h-4" />
                      ) : (
                        <ChevronRight className="w-4 h-4" />
                      )}
                    </button>
                  </div>
                </div>
              </div>

              {/* Weekday Names Header with Friday Golden Accent */}
              <div className="grid grid-cols-7 gap-1 sm:gap-1.5 mb-2 text-center">
                {(isRTL ? URDU_WEEKDAYS_SHORT : ENGLISH_WEEKDAYS).map(
                  (dayName, idx) => {
                    const isFriday = idx === 5;
                    return (
                      <div
                        key={idx}
                        className="py-1.5 sm:py-2 text-[10px] sm:text-xs font-bold font-serif rounded-xl border truncate shadow-2xs"
                        style={{
                          color: isFriday ? '#92400e' : COLORS?.primary,
                          backgroundColor: isFriday
                            ? `${COLORS?.secondary}`
                            : `${COLORS?.background}`,
                          borderColor: isFriday ? COLORS?.accent : `${COLORS?.border}80`,
                        }}
                      >
                        <span className="hidden sm:inline">{dayName}</span>
                        <span className="sm:hidden">
                          {isRTL ? URDU_WEEKDAYS_MINI[idx] : dayName.slice(0, 2)}
                        </span>
                      </div>
                    );
                  }
                )}
              </div>

              {/* Calendar Days Grid */}
              <div className="grid grid-cols-7 gap-1 sm:gap-1.5">
                {calendarDays.map((item, idx) => {
                  const itemDateKey = `${item.year}-${String(
                    item.month + 1
                  ).padStart(2, '0')}-${String(item.day).padStart(2, '0')}`;
                  const dayEvents = eventsByDate[itemDateKey] || [];
                  const hasEvents = dayEvents.length > 0;
                  const isToday = itemDateKey === todayKey;
                  const isSelected = itemDateKey === selectedDateKey;

                  return (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => {
                        const d = new Date(item.year, item.month, item.day);
                        setSelectedDate(d);
                        setActiveTab('calendar');
                      }}
                      className={`min-h-[48px] sm:min-h-[64px] p-1 sm:p-1.5 rounded-xl border-2 flex flex-col justify-between items-center sm:items-start transition-all cursor-pointer relative group ${
                        !item.isCurrentMonth ? 'opacity-30' : ''
                      }`}
                      style={{
                        backgroundColor: isSelected
                          ? `${COLORS?.primary}18`
                          : isToday
                          ? `${COLORS?.secondary}50`
                          : hasEvents
                          ? `${COLORS?.accent}18`
                          : COLORS?.white,
                        borderColor: isSelected
                          ? COLORS?.accent
                          : isToday
                          ? COLORS?.primary
                          : hasEvents
                          ? `${COLORS?.accent}90`
                          : `${COLORS?.border}90`,
                        boxShadow: isSelected
                          ? '0 0 0 2px rgba(184, 156, 125, 0.35)'
                          : hasEvents
                          ? '0 1px 3px rgba(184, 156, 125, 0.18)'
                          : 'none',
                      }}
                    >
                      {/* Top row: Day Number + Event Indicator */}
                      <div className="flex items-center justify-between w-full">
                        <span
                          className={`text-xs sm:text-sm font-bold font-serif rounded-full w-5 h-5 sm:w-6 sm:h-6 flex items-center justify-center ${
                            isToday ? 'text-white shadow-xs' : ''
                          }`}
                          style={{
                            backgroundColor: isToday ? COLORS?.primary : 'transparent',
                            color: isToday
                              ? '#ffffff'
                              : isSelected
                              ? COLORS?.accent
                              : COLORS?.textPrimary,
                          }}
                        >
                          {item.day}
                        </span>

                        {/* Dot Indicator */}
                        {hasEvents && (
                          <span
                            className="w-2 h-2 rounded-full shadow-xs shrink-0"
                            style={{ backgroundColor: COLORS?.accent }}
                            title={`${dayEvents.length} event(s)`}
                          />
                        )}
                      </div>

                      {/* Event Marker Title Pill (visible on sm+) */}
                      {hasEvents && (
                        <div className="w-full mt-1 hidden sm:block">
                          <div
                            className="truncate text-[9px] font-bold px-1.5 py-0.5 rounded-md text-white shadow-2xs block"
                            style={{ backgroundColor: COLORS?.primary }}
                          >
                            {dayEvents[0]?.title}
                          </div>
                          {dayEvents.length > 1 && (
                            <span className="text-[8px] font-semibold text-accent block mt-0.5 text-end">
                              +{dayEvents.length - 1} {isRTL ? 'مزید' : 'more'}
                            </span>
                          )}
                        </div>
                      )}

                      {/* Mobile mini event count badge */}
                      {hasEvents && (
                        <span
                          className="sm:hidden text-[9px] font-bold mt-0.5 px-1 rounded-full text-white"
                          style={{ backgroundColor: COLORS?.accent }}
                        >
                          {dayEvents.length}
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Selected Date Indicator Card under calendar */}
            {selectedDate && (
              <div
                className="rounded-2xl p-4 border-2 flex items-center justify-between gap-3 shadow-xs"
                style={{
                  background: `linear-gradient(135deg, ${COLORS?.secondary}50 0%, ${COLORS?.background} 100%)`,
                  borderColor: COLORS?.accent,
                }}
              >
                <div className="flex items-center gap-2.5">
                  <div
                    className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0 border"
                    style={{
                      backgroundColor: COLORS?.white,
                      borderColor: COLORS?.accent,
                      color: COLORS?.primary,
                    }}
                  >
                    <CalendarCheck2 className="w-4 h-4 text-accent" />
                  </div>
                  <div>
                    <span
                      className="text-xs sm:text-sm font-bold font-serif block leading-tight"
                      style={{ color: COLORS?.primary }}
                    >
                      {isRTL
                        ? `${selectedDate.getDate()} ${
                            URDU_MONTHS[selectedDate.getMonth()]
                          } ${selectedDate.getFullYear()}`
                        : selectedDate.toLocaleDateString('en-US', {
                            month: 'short',
                            day: 'numeric',
                            year: 'numeric',
                          })}
                    </span>
                    <span
                      className="text-[11px] font-semibold"
                      style={{ color: COLORS?.accent }}
                    >
                      {selectedDateEvents?.length > 0
                        ? isRTL
                          ? `${selectedDateEvents.length} پروگرام طے شدہ`
                          : `${selectedDateEvents.length} event(s) scheduled`
                        : isRTL
                        ? 'اس تاریخ کو کوئی پروگرام نہیں ہے'
                        : 'No events scheduled on this date'}
                    </span>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => {
                    setSelectedDate(null);
                    setActiveTab('all');
                  }}
                  className="p-1.5 rounded-xl border hover:bg-white transition-colors cursor-pointer text-xs font-bold flex items-center gap-1 shadow-2xs"
                  style={{
                    borderColor: COLORS?.border,
                    color: COLORS?.primary,
                    backgroundColor: COLORS?.white,
                  }}
                  title={isRTL ? 'تمام پروگرام دیکھیں' : 'Clear filter'}
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            )}
          </div>

          {/* ──────────────────────────────────────────────
              COLUMN 2: Program Feed & Details (50% on Desktop)
          ────────────────────────────────────────────── */}
          <div className="w-full space-y-4">
            {/* Filter Tabs & Search Bar */}
            <div
              className="rounded-2xl p-3.5 sm:p-4 border-2 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-3"
              style={{
                backgroundColor: COLORS?.white,
                borderColor: COLORS?.border,
              }}
            >
              {/* Filter Tabs */}
              <div className="flex items-center gap-1.5 overflow-x-auto w-full sm:w-auto pb-1 sm:pb-0 scrollbar-none">
                <button
                  type="button"
                  onClick={() => {
                    setActiveTab('all');
                    setSelectedDate(null);
                  }}
                  className="px-3.5 py-2 rounded-xl text-xs font-bold transition-all shrink-0 cursor-pointer shadow-2xs"
                  style={{
                    backgroundColor:
                      activeTab === 'all' ? COLORS?.primary : 'transparent',
                    color: activeTab === 'all' ? '#fff' : COLORS?.textSecondary,
                    border: `1px solid ${
                      activeTab === 'all' ? COLORS?.primary : COLORS?.border
                    }`,
                  }}
                >
                  {isRTL ? 'تمام' : 'All'} ({events?.length || 0})
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setActiveTab('upcoming');
                    setSelectedDate(null);
                  }}
                  className="px-3.5 py-2 rounded-xl text-xs font-bold transition-all shrink-0 cursor-pointer shadow-2xs"
                  style={{
                    backgroundColor:
                      activeTab === 'upcoming' ? COLORS?.primary : 'transparent',
                    color:
                      activeTab === 'upcoming' ? '#fff' : COLORS?.textSecondary,
                    border: `1px solid ${
                      activeTab === 'upcoming' ? COLORS?.primary : COLORS?.border
                    }`,
                  }}
                >
                  {isRTL ? 'آنے والے' : 'Upcoming'} ({upcomingEvents?.length || 0})
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setActiveTab('past');
                    setSelectedDate(null);
                  }}
                  className="px-3.5 py-2 rounded-xl text-xs font-bold transition-all shrink-0 cursor-pointer shadow-2xs"
                  style={{
                    backgroundColor:
                      activeTab === 'past' ? COLORS?.primary : 'transparent',
                    color:
                      activeTab === 'past' ? '#fff' : COLORS?.textSecondary,
                    border: `1px solid ${
                      activeTab === 'past' ? COLORS?.primary : COLORS?.border
                    }`,
                  }}
                >
                  {isRTL ? 'گزشتہ' : 'Past'} ({pastEvents?.length || 0})
                </button>
              </div>

              {/* Search Bar */}
              <div className="relative w-full sm:w-56">
                <Search
                  className="w-4 h-4 absolute top-1/2 -translate-y-1/2 pointer-events-none"
                  style={{
                    [isRTL ? 'right' : 'left']: '12px',
                    color: COLORS?.textSecondary,
                  }}
                />
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder={isRTL ? 'پروگرام تلاش کریں...' : 'Search events...'}
                  className="w-full py-2 rounded-xl border-2 text-xs outline-none focus:border-primary transition-colors"
                  style={{
                    borderColor: COLORS?.border,
                    paddingRight: isRTL ? '36px' : '12px',
                    paddingLeft: isRTL ? '12px' : '36px',
                    backgroundColor: COLORS?.background,
                    color: COLORS?.textPrimary,
                  }}
                />
              </div>
            </div>

            {/* Program Cards Feed */}
            <div className="space-y-4">
              {loading ? (
                <div className="flex items-center justify-center py-14">
                  <div
                    className="animate-spin rounded-full h-9 w-9 border-t-2 border-b-2"
                    style={{ borderColor: COLORS?.primary }}
                  />
                </div>
              ) : displayedEvents?.length > 0 ? (
                <div className="space-y-4">
                  {displayedEvents.map((event) => (
                    <EventCard key={event?._id} event={event} />
                  ))}
                </div>
              ) : (
                <div
                  className="rounded-2xl p-10 text-center border-2 shadow-xs"
                  style={{
                    backgroundColor: COLORS?.white,
                    borderColor: COLORS?.border,
                  }}
                >
                  <CalendarDays
                    className="w-12 h-12 mx-auto mb-3 opacity-30"
                    style={{ color: COLORS?.primary }}
                  />
                  <h3
                    className="text-base sm:text-lg font-bold font-serif mb-1"
                    style={{ color: COLORS?.primary }}
                  >
                    {isRTL
                      ? 'اس انتخاب میں کوئی پروگرام نہیں ملا'
                      : 'No scheduled programs found'}
                  </h3>
                  <p
                    className="text-xs max-w-sm mx-auto mb-4"
                    style={{ color: COLORS?.textSecondary }}
                  >
                    {isRTL
                      ? 'دیگر تواریخ منتخب کریں یا تمام پروگراموں کی فہرست دیکھیں'
                      : 'Please check other dates or view all programs'}
                  </p>
                  <button
                    type="button"
                    onClick={() => {
                      setActiveTab('all');
                      setSelectedDate(null);
                      setSearchTerm('');
                    }}
                    className="px-5 py-2.5 rounded-xl text-xs font-bold text-white shadow-sm cursor-pointer transition-transform hover:scale-105"
                    style={{ backgroundColor: COLORS?.primary }}
                  >
                    {isRTL ? 'تمام پروگرامز دیکھیں' : 'View All Events'}
                  </button>
                </div>
              )}
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
