import React, { useEffect, useState } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { Play, X, Eye, Calendar, Youtube, Users, Video } from 'lucide-react';
import YouTube from 'react-youtube';
import { getYoutubeVideos, getConnectionStatus } from '@/services';
import { useSettings } from '@/hooks/useSettings';

export default function YouTubeVideos() {
  const { settings } = useSettings();
  const language = settings?.language === 'ur' || settings?.language === 'Urdu' ? 'ur' : 'en';

  const [videos, setVideos] = useState([]);
  const [connection, setConnection] = useState(null);
  const [loading, setLoading] = useState(false);
  const [activeVideo, setActiveVideo] = useState(null); // Selected video for react-youtube player modal

  // Load connection status and videos list
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [connData, videoData] = await Promise.all([
          getConnectionStatus(),
          getYoutubeVideos()
        ]);
        setConnection(connData?.connection || null);
        setVideos(videoData?.videos || []);
      } catch (err) {
        console.error('Failed to load YouTube videos page data:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const playerOpts = {
    height: '100%',
    width: '100%',
    playerVars: {
      autoplay: 1,
      modestbranding: 1,
      rel: 0
    }
  };

  return (
    <div className={`bg-background py-12 min-h-screen ${language === 'ur' ? 'text-right' : 'text-left'}`} dir={language === 'ur' ? 'rtl' : 'ltr'}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">

        {/* Header Hero Section */}
        {connection ? (
          <div className="premium-card p-6 sm:p-8 flex flex-col md:flex-row items-center justify-between gap-6 bg-card-bg border border-border/40 rounded-2xl shadow-xs">
            <div className={`flex flex-col sm:flex-row items-center gap-5 w-full md:w-auto ${language === 'ur' ? 'sm:flex-row-reverse text-right' : 'sm:flex-row text-left'}`}>
              {connection.channelThumbnail ? (
                <img
                  src={connection.channelThumbnail}
                  alt={connection.channelName}
                  className="w-20 h-20 rounded-full border-4 object-cover shadow-sm"
                  style={{ borderColor: '#ff0000' }}
                />
              ) : (
                <div className="w-20 h-20 rounded-full bg-red-550/10 border-4 border-red-600 flex items-center justify-center shadow-sm">
                  <Youtube className="w-10 h-10 text-red-600" />
                </div>
              )}
              <div className="space-y-1.5 text-center sm:text-start">
                <span className="text-[10px] font-bold text-red-600 bg-red-50 border border-red-100 px-2 py-0.5 rounded-full uppercase tracking-wider inline-flex items-center gap-1">
                  <Youtube size={10} /> {language === 'en' ? 'Official Channel' : 'آفیشل چینل'}
                </span>
                <h1 className="text-2xl font-black text-[#2A211A] font-serif leading-none">
                  {connection.channelName}
                </h1>
                <div className={`flex flex-wrap items-center justify-center sm:justify-start gap-4 text-xs text-slate-500 mt-1 ${language === 'ur' ? 'sm:flex-row-reverse' : ''}`}>
                  <span className="flex items-center gap-1">
                    <Users size={13} className="text-red-550 shrink-0" />
                    <strong>{parseInt(connection.subscriberCount || 0).toLocaleString()}</strong> {language === 'en' ? 'subscribers' : 'سبسکرائبرز'}
                  </span>
                  <span className="flex items-center gap-1">
                    <Video size={13} className="text-accent shrink-0" />
                    <strong>{videos.length}</strong> {language === 'en' ? 'videos' : 'ویڈیوز'}
                  </span>
                </div>
              </div>
            </div>

            <a
              href={`https://www.youtube.com/channel/${connection.channelId}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 px-6 py-3 bg-red-650 hover:bg-red-700 text-white font-bold text-xs rounded-xl shadow-md shadow-red-200 transition-all uppercase tracking-wider"
              style={{ background: 'linear-gradient(135deg,#ff0000,#cc0000)' }}
            >
              <Youtube size={14} />
              {language === 'en' ? 'Subscribe' : 'سبسکرائب کریں'}
            </a>
          </div>
        ) : (
          <div className="mb-10 text-center">
            <span className="text-xs font-bold text-accent dark:text-amber-500 uppercase tracking-widest block mb-1">
              {language === 'en' ? 'VIDEO GALLERY' : 'ویڈیو گیلری'}
            </span>
            <h1 className="text-3xl sm:text-4xl font-extrabold text-[#2A211A] tracking-wide font-serif">
              {language === 'en' ? 'Islamic Video Lectures' : 'اسلامی ویڈیو بیانات'}
            </h1>
            <p className="text-slate-600 text-sm font-light mt-2 max-w-md mx-auto">
              {language === 'en' ? 'Watch video lessons, Quranic explanations and sermons directly from the official channel.' : 'آفیشل چینل کے خطابات، قرآنی تشریحات اور ہفتہ وار ویڈیو بیانات یہاں دیکھیں۔'}
            </p>
          </div>
        )}

        {/* Videos Grid list */}
        {loading ? (
          <div className="flex flex-col items-center justify-center py-20 gap-3 text-slate-400">
            <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-primary"></div>
            <span className="text-xs font-bold">{language === 'en' ? 'Loading videos...' : 'ویڈیوز لوڈ ہو رہی ہیں...'}</span>
          </div>
        ) : videos.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {videos.map((video) => (
              <div
                key={video._id}
                onClick={() => setActiveVideo(video)}
                className="group cursor-pointer rounded-2xl overflow-hidden border border-border/40 bg-card-bg shadow-xs transition-all duration-300 hover:shadow-md hover:border-border flex flex-col"
              >
                {/* Thumbnail */}
                <div className="aspect-video relative bg-slate-900 overflow-hidden flex-shrink-0">
                  {video.thumbnailUrl ? (
                    <img
                      src={video.thumbnailUrl}
                      alt={video.title}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <Youtube className="w-12 h-12 text-slate-700" />
                    </div>
                  )}
                  {/* Hover Overlay */}
                  <div className="absolute inset-0 bg-black/35 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <div className="w-12 h-12 rounded-full bg-red-600 text-white flex items-center justify-center shadow-lg transition-transform duration-300 scale-90 group-hover:scale-100">
                      <Play size={20} fill="currentColor" className="ml-1" />
                    </div>
                  </div>
                  {/* Views count */}
                  <div className="absolute bottom-2.5 right-2.5 bg-black/75 text-white text-[10px] font-bold px-2 py-0.5 rounded flex items-center gap-1 shadow-xs">
                    <Eye size={10} />
                    {parseInt(video.viewCount || 0).toLocaleString()}
                  </div>
                </div>

                {/* Content Details */}
                <div className="p-4 flex flex-col flex-1 text-start">
                  <h3 className="text-sm font-bold text-[#2A211A] line-clamp-2 leading-relaxed font-serif group-hover:text-red-600 transition-colors flex-1">
                    {video.title}
                  </h3>
                  <div className="flex items-center gap-3 text-[10px] text-slate-500 font-medium mt-4 pt-3 border-t border-border/30">
                    <span className="flex items-center gap-1">
                      <Calendar size={11} />
                      {new Date(video.uploadedAt).toLocaleDateString(language === 'ur' ? 'ur-PK' : 'en-US')}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-24 text-slate-500 border border-dashed rounded-2xl p-8 bg-card-bg border-border/40 max-w-lg mx-auto">
            <Youtube className="w-14 h-14 mx-auto text-slate-400 mb-4" />
            <h3 className="text-md font-bold text-[#2A211A]">{language === 'en' ? 'No Videos Found' : 'کوئی ویڈیو نہیں ملی'}</h3>
            <p className="text-xs text-slate-500 font-light mt-1">
              {language === 'en' ? 'The channel videos list is currently empty. Please check back later.' : 'چینل کی ویڈیو گیلری اس وقت خالی ہے۔ براہ کرم بعد میں دوبارہ چیک کریں۔'}
            </p>
          </div>
        )}

      </div>

      {/* Modern Modal Player Popup (Uses react-youtube) */}
      {activeVideo && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-xs p-4 overflow-hidden">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl overflow-hidden w-full max-w-4xl relative flex flex-col text-start max-h-[90vh]">
            
            {/* Header */}
            <div className={`px-5 py-4 border-b border-slate-800 flex items-center justify-between gap-4 ${language === 'ur' ? 'flex-row-reverse text-right' : 'flex-row text-left'}`}>
              <h3 className="text-white font-bold text-sm sm:text-md font-serif line-clamp-1 flex-1 pr-6">
                {activeVideo.title}
              </h3>
              <button
                onClick={() => setActiveVideo(null)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 focus:outline-none transition-colors"
                aria-label="Close video player"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Video container with react-youtube */}
            <div className="bg-black aspect-video w-full flex items-center justify-center overflow-hidden">
              <YouTube
                videoId={activeVideo.youtubeId}
                opts={playerOpts}
                className="w-full h-full"
                containerClassName="w-full h-full"
              />
            </div>

            {/* Footer details */}
            <div className="p-5 bg-slate-900 border-t border-slate-800 overflow-y-auto max-h-[20vh] custom-scrollbar">
              <span className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1.5">
                {language === 'en' ? 'Description' : 'تفصیل'}
              </span>
              <p className="text-slate-300 text-xs font-light leading-relaxed whitespace-pre-wrap">
                {activeVideo.description || (language === 'en' ? 'No description available for this video.' : 'اس ویڈیو کے لیے کوئی تفصیل دستیاب نہیں ہے۔')}
              </p>
            </div>

          </div>
        </div>
      )}
    </div>
  );
}
