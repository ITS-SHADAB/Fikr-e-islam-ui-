import React, { useEffect, useState } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import {
  Play,
  Eye,
  Calendar,
  Youtube,
  Users,
  Video,
  ExternalLink,
  Share2,
} from 'lucide-react';
import toast from 'react-hot-toast';
import { getYoutubeVideos, getConnectionStatus } from '@/services';
import { useSettings } from '@/hooks/useSettings';
import { Spinner } from '@/components';

export default function YouTubeVideos() {
  const { settings } = useSettings();
  const language =
    settings?.language === 'ur' || settings?.language === 'Urdu' ? 'ur' : 'en';

  const [videos, setVideos] = useState([]);
  const [connection, setConnection] = useState(null);
  const [loading, setLoading] = useState(false);

  // Load connection status and videos list
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [connData, videoData] = await Promise.all([
          getConnectionStatus(),
          getYoutubeVideos(),
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

  const handleOpenVideo = (youtubeId) => {
    if (!youtubeId) return;
    const url = `https://www.youtube.com/watch?v=${youtubeId}`;
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  const handleShare = (e, video) => {
    e.stopPropagation();
    const url = `https://www.youtube.com/watch?v=${video.youtubeId}`;
    if (navigator.share) {
      navigator
        .share({
          title: video.title,
          url,
        })
        .catch(() => {});
    } else {
      navigator.clipboard?.writeText(url);
      toast.success(
        language === 'ur' ? 'ویڈیو لنک کاپی ہو گیا!' : 'Video link copied!'
      );
    }
  };

  return (
    <div
      className={`bg-background py-12 min-h-screen ${
        language === 'ur' ? 'text-right' : 'text-left'
      }`}
      dir={language === 'ur' ? 'rtl' : 'ltr'}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        {/* Header Hero Section */}
        {connection ? (
          <div className="premium-card p-6 sm:p-8 flex flex-col md:flex-row items-center justify-between gap-6 bg-card-bg border border-border/40 rounded-3xl shadow-xs">
            <div
              className={`flex flex-col sm:flex-row items-center gap-5 w-full md:w-auto ${
                language === 'ur'
                  ? 'sm:flex-row-reverse text-right'
                  : 'sm:flex-row text-left'
              }`}
            >
              {connection.channelThumbnail ? (
                <img
                  src={connection.channelThumbnail}
                  alt={connection.channelName}
                  className="w-20 h-20 rounded-full border-4 object-cover shadow-sm"
                  style={{ borderColor: '#ff0000' }}
                />
              ) : (
                <div className="w-20 h-20 rounded-full bg-red-600/10 border-4 border-red-600 flex items-center justify-center shadow-sm">
                  <Youtube className="w-10 h-10 text-red-600" />
                </div>
              )}
              <div className="space-y-1.5 text-center sm:text-start">
                <span className="text-[10px] font-bold text-red-600 bg-red-50 border border-red-100 px-2.5 py-0.5 rounded-full uppercase tracking-wider inline-flex items-center gap-1">
                  <Youtube size={12} />{' '}
                  {language === 'en' ? 'Official Channel' : 'آفیشل چینل'}
                </span>
                <h1 className="text-2xl font-black text-[#2A211A] font-serif leading-none">
                  {connection.channelName}
                </h1>
                <div
                  className={`flex flex-wrap items-center justify-center sm:justify-start gap-4 text-xs text-slate-500 mt-1 ${
                    language === 'ur' ? 'sm:flex-row-reverse' : ''
                  }`}
                >
                  <span className="flex items-center gap-1">
                    <Users size={13} className="text-red-550 shrink-0" />
                    <strong>
                      {parseInt(
                        connection.subscriberCount || 0
                      ).toLocaleString()}
                    </strong>{' '}
                    {language === 'en' ? 'subscribers' : 'سبسکرائبرز'}
                  </span>
                  <span className="flex items-center gap-1">
                    <Video size={13} className="text-accent shrink-0" />
                    <strong>{videos.length}</strong>{' '}
                    {language === 'en' ? 'videos' : 'ویڈیوز'}
                  </span>
                </div>
              </div>
            </div>

            <a
              href={`https://www.youtube.com/channel/${connection.channelId}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 px-6 py-3.5 bg-red-600 hover:bg-red-700 text-white font-bold text-xs rounded-xl shadow-md shadow-red-200 transition-all uppercase tracking-wider cursor-pointer hover:scale-[1.02] active:scale-[0.98]"
              style={{
                background: 'linear-gradient(135deg,#ff0000,#cc0000)',
              }}
            >
              <Youtube size={16} />
              {language === 'en' ? 'Subscribe Channel' : 'چینل سبسکرائب کریں'}
            </a>
          </div>
        ) : (
          <div className="mb-10 text-center">
            <span className="text-xs font-bold text-accent uppercase tracking-widest block mb-1">
              {language === 'en' ? 'VIDEO GALLERY' : 'ویڈیو گیلری'}
            </span>
            <h1 className="text-3xl sm:text-4xl font-extrabold text-[#2A211A] tracking-wide font-serif">
              {language === 'en'
                ? 'Official YouTube Videos'
                : 'آفیشل یوٹیوب ویڈیوز'}
            </h1>
            <p className="text-slate-600 text-sm font-light mt-2 max-w-md mx-auto">
              {language === 'en'
                ? 'Watch lectures, Quranic explanations and sermons directly on the official YouTube channel.'
                : 'آفیشل یوٹیوب چینل کے تمام ویڈیو بیانات اور خطابات یہاں سے براہِ راست یوٹیوب پر دیکھیں۔'}
            </p>
          </div>
        )}

        {/* Videos Grid list */}
        {loading ? (
          <div className="py-16">
            <Spinner
              size="lg"
              text="ویڈیوز لوڈ ہو رہی ہیں..."
            />
          </div>
        ) : videos.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {videos.map((video) => (
              <div
                key={video._id}
                onClick={() => handleOpenVideo(video.youtubeId)}
                className="group cursor-pointer rounded-2xl overflow-hidden border border-border/40 bg-card-bg shadow-xs transition-all duration-300 hover:shadow-xl hover:-translate-y-1 hover:border-accent/40 flex flex-col justify-between"
                title={
                  language === 'ur'
                    ? 'یوٹیوب پر دیکھنے کے لیے کلک کریں'
                    : 'Click to watch on YouTube'
                }
              >
                {/* Thumbnail */}
                <div className="aspect-video relative bg-slate-900 overflow-hidden shrink-0">
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

                  {/* Gradient overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent pointer-events-none" />

                  {/* YouTube badge */}
                  <div className="absolute top-2.5 right-2.5 bg-red-600 text-white text-[10px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1 shadow-xs">
                    <Youtube size={11} fill="currentColor" />
                    <span>YouTube</span>
                  </div>

                  {/* Center Play button */}
                  <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                    <div className="w-12 h-12 rounded-full bg-red-600 text-white flex items-center justify-center shadow-lg transition-transform duration-300 group-hover:scale-110">
                      <Play size={20} fill="currentColor" className="ml-0.5" />
                    </div>
                  </div>

                  {/* Views count */}
                  <div className="absolute bottom-2.5 right-2.5 bg-black/75 text-white text-[10px] font-bold px-2 py-0.5 rounded flex items-center gap-1 shadow-xs">
                    <Eye size={10} />
                    {parseInt(video.viewCount || 0).toLocaleString()}
                  </div>
                </div>

                {/* Content Details */}
                <div className="p-4 flex flex-col flex-1 text-start justify-between gap-3">
                  <div>
                    <h3 className="text-sm font-bold text-[#2A211A] line-clamp-2 leading-relaxed font-serif group-hover:text-red-600 transition-colors">
                      {video.title}
                    </h3>
                  </div>

                  <div className="flex items-center justify-between gap-2 pt-3 border-t border-border/30 text-[11px] text-slate-500">
                    <span className="flex items-center gap-1 font-medium">
                      <Calendar size={12} />
                      {new Date(video.uploadedAt).toLocaleDateString(
                        language === 'ur' ? 'ur-PK' : 'en-US'
                      )}
                    </span>

                    <div className="flex items-center gap-1.5">
                      <button
                        type="button"
                        onClick={(e) => handleShare(e, video)}
                        className="p-1.5 rounded-lg border border-border/40 hover:bg-slate-100 text-slate-600 hover:text-red-600 transition-colors"
                        title={
                          language === 'ur' ? 'لنک شیئر کریں' : 'Share link'
                        }
                      >
                        <Share2 size={13} />
                      </button>

                      <span className="inline-flex items-center gap-1 text-[11px] font-bold text-red-600 group-hover:underline">
                        <span>{language === 'ur' ? 'یوٹیوب' : 'Watch'}</span>
                        <ExternalLink size={11} />
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-24 text-slate-500 border border-dashed rounded-3xl p-8 bg-card-bg border-border/40 max-w-lg mx-auto">
            <Youtube className="w-14 h-14 mx-auto text-slate-400 mb-4" />
            <h3 className="text-md font-bold text-[#2A211A]">
              {language === 'en' ? 'No Videos Found' : 'کوئی ویڈیو نہیں ملی'}
            </h3>
            <p className="text-xs text-slate-500 font-light mt-1">
              {language === 'en'
                ? 'The channel videos list is currently empty. Please check back later.'
                : 'چینل کی ویڈیو گیلری اس وقت خالی ہے۔ براہ کرم بعد میں دوبارہ چیک کریں۔'}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
