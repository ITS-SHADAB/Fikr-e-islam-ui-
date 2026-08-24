import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Play, X, Music } from 'lucide-react';
import { getLectures } from '@/services';
import { useSettings } from '@/hooks/useSettings';
import { LectureCard, SectionSidebar } from '@/components';
import { COLORS } from '@/utils/themeColors';
import { LECTURE_CATEGORIES } from '@/utils/categories';

export default function LecturesList() {
  const { settings } = useSettings();
  const language = settings?.language === 'ur' || settings?.language === 'Urdu' ? 'ur' : 'en';
  const isRTL = language === 'ur';
  const [searchParams] = useSearchParams();
  const queryCategory = searchParams.get('category');

  const [lectures, setLectures] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [activeMedia, setActiveMedia] = useState(null);

  useEffect(() => {
    if (queryCategory !== null) {
      setSelectedCategory(queryCategory);
    } else {
      setSelectedCategory('');
    }
  }, [queryCategory]);

  const categories = LECTURE_CATEGORIES;

  const loadLectures = async (category = selectedCategory, search = searchTerm) => {
    try {
      setLoading(true);
      setError(null);
      const data = await getLectures({ category, search });
      setLectures(Array.isArray(data) ? data : []);
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'Failed to load lectures');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadLectures(selectedCategory, searchTerm);
  }, [selectedCategory]);

  const handleSearchSubmit = (e) => {
    e?.preventDefault();
    loadLectures(selectedCategory, searchTerm);
  };

  const handleCategoryChange = (category) => {
    setSelectedCategory(category);
    loadLectures(category, searchTerm);
  };

  const isAudioMedia = (category) => {
    return category === 'Audio Lectures' || category === 'Bayan Recordings';
  };

  return (
    <div
      dir={isRTL ? 'rtl' : 'ltr'}
      className="bg-background py-6 md:py-8 min-h-screen"
      style={{ backgroundColor: COLORS.background }}
    >
      <div className="mx-auto px-4 sm:px-6 lg:px-8">

        {/* Header Title */}
        <div className="mb-6 md:mb-8 text-center">
          <span
            className="text-xs font-bold uppercase tracking-widest block mb-1 font-serif"
            style={{ color: COLORS.accent }}
          >
            {isRTL ? 'ملٹی میڈیا لائبریری' : 'MULTIMEDIA LIBRARY'}
          </span>
          <div className="flex items-center justify-center gap-4 mb-2">
            <span style={{ color: COLORS.accent }} className="text-2xl select-none">❖</span>
            <h1
              className="text-3xl sm:text-4xl font-extrabold font-serif"
              style={{ color: COLORS.primary }}
            >
              {isRTL ? 'خطابات اور بیانات' : 'Lectures & Sermons'}
            </h1>
            <span style={{ color: COLORS.accent }} className="text-2xl select-none">❖</span>
          </div>
          <p className="text-xs sm:text-sm font-light max-w-xl mx-auto" style={{ color: COLORS.textSecondary }}>
            {isRTL
              ? 'ہفتہ وار بیانات اور شرعی سیمینارز کے ویڈیو خطابات دیکھیں یا آڈیو ریکارڈنگز سنیں۔'
              : 'Watch video lectures or listen to audio recordings of weekly sermons and Shariah seminars.'}
          </p>
        </div>

        {/* ── Two-column layout (Sidebar on Right, Content on Left) ── */}
        <div className="flex flex-col lg:flex-row gap-6 items-start">

          {/* ── UNIFIED SIDEBAR (Mobile Sticky on Top + Desktop Sticky on Side) ── */}
          <SectionSidebar
            searchTerm={searchTerm}
            onSearchChange={setSearchTerm}
            onSearchSubmit={handleSearchSubmit}
            onClearSearch={() => {
              setSearchTerm('');
              loadLectures(selectedCategory, '');
            }}
            searchPlaceholder={isRTL ? 'بیانات تلاش کریں...' : 'Search lectures...'}
            searchLabel={isRTL ? 'بیانات تلاش کریں' : 'Search Lectures'}
            allLabel={isRTL ? 'تمام بیانات' : 'All Lectures'}
            categoriesLabel={isRTL ? 'شعبہ جات / فارمیٹس' : 'Categories'}
            categories={categories}
            selectedCategory={selectedCategory}
            onCategoryChange={handleCategoryChange}
            isRTL={isRTL}
            icon={Play}
            totalCount={lectures.length}
          />

          {/* ── MAIN: Lecture cards ── */}
          <div className="flex-1 min-w-0 w-full">
            {loading ? (
              <div className="flex items-center justify-center py-20">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2" style={{ borderColor: COLORS.primary }} />
              </div>
            ) : lectures && lectures.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
                {lectures.map((lecture) => (
                  <LectureCard key={lecture._id} lecture={lecture} onPlay={(l) => setActiveMedia(l)} />
                ))}
              </div>
            ) : (
              <div className="text-center py-16 rounded-lg border" style={{ backgroundColor: COLORS.white, borderColor: COLORS.border }}>
                <Play className="w-12 h-12 mx-auto mb-4" style={{ color: COLORS.accent }} />
                <h3 className="text-lg font-bold font-serif mb-1" style={{ color: COLORS.textPrimary }}>
                  {isRTL ? 'کوئی بیان نہیں ملا' : 'No lectures found'}
                </h3>
                <p className="text-xs" style={{ color: COLORS.textSecondary }}>
                  {isRTL ? 'براہ کرم فارمیٹ فلٹر بیجز یا تلاش کے الفاظ تبدیل کریں۔' : 'Please modify filters or search terms.'}
                </p>
              </div>
            )}
          </div>
        </div>

      </div>

      {/* Embedded Player Media Modal */}
      {activeMedia && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-900/85 p-4" dir={isRTL ? 'rtl' : 'ltr'}>
          <div className="rounded-2xl border shadow-2xl overflow-hidden w-full max-w-3xl relative flex flex-col" style={{ backgroundColor: COLORS.white, borderColor: COLORS.border }}>

            {/* Modal Header */}
            <div className="px-5 py-3.5 flex items-center justify-between border-b" style={{ backgroundColor: COLORS.primary, borderColor: `${COLORS.accent}40` }}>
              <h3 className="font-bold text-sm sm:text-base font-serif text-white line-clamp-1">{activeMedia.title}</h3>
              <button
                type="button"
                onClick={() => setActiveMedia(null)}
                className="p-1 rounded text-white/80 hover:text-white hover:bg-white/10 cursor-pointer"
                aria-label="Close Player"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Body: Player Area */}
            <div className="bg-black aspect-video flex items-center justify-center">
              {isAudioMedia(activeMedia.category) ? (
                <div className="w-full h-full flex flex-col items-center justify-center bg-slate-950 p-6 text-center gap-6">
                  <div className="w-16 h-16 rounded-full flex items-center justify-center shadow-xl animate-pulse" style={{ backgroundColor: COLORS.primary, color: COLORS.accent }}>
                    <Music className="w-8 h-8" />
                  </div>
                  <div className="w-full max-w-md">
                    <audio controls className="w-full" autoPlay>
                      <source src={activeMedia.url || activeMedia.audioUrl} type="audio/mpeg" />
                      Your browser does not support the audio element.
                    </audio>
                  </div>
                </div>
              ) : (
                <iframe
                  src={activeMedia.url?.includes('embed') ? activeMedia.url : activeMedia.url?.replace('watch?v=', 'embed/')}
                  title={activeMedia.title}
                  className="w-full h-full border-0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
              )}
            </div>

            {/* Modal Footer info */}
            <div className="p-4 flex items-center justify-between text-xs border-t" style={{ borderColor: COLORS.border, backgroundColor: COLORS.background }}>
              <span className="font-bold" style={{ color: COLORS.primary }}>
                {activeMedia.speaker || 'مفتی فیضان سرور مصباحی'}
              </span>
              <span className="font-medium" style={{ color: COLORS.textSecondary }}>
                {activeMedia.category}
              </span>
            </div>

          </div>
        </div>
      )}
    </div>
  );
}
