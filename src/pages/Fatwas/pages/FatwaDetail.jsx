import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Calendar, Eye, ArrowRight, ArrowLeft, Bookmark, HelpCircle, FileText, Download, ExternalLink, MessageCircle } from 'lucide-react';
import { getFatwaBySlug, getComments, getFatwas } from '@/services';
import { useSettings } from '@/hooks/useSettings';
import { FatwaCard, PdfViewer, CommentsSection } from '@/components';
import { FATWA_CATEGORY_TRANSLATIONS } from '@/utils/categories';

export default function FatwaDetail() {
  const { slug } = useParams();

  const { settings } = useSettings();
  const language = settings?.language === 'ur' || settings?.language === 'Urdu' ? 'ur' : 'en';

  const [current, setCurrent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showPdf, setShowPdf] = useState(false);
  const [commentCount, setCommentCount] = useState(0);

  useEffect(() => {
    const loadFatwa = async () => {
      try {
        setLoading(true);
        setError(null);
        let activeSlug = slug;

        // If parameter is a 24-character ObjectID hex representation, resolve to slug
        if (/^[0-9a-fA-F]{24}$/.test(slug)) {
          const res = await getFatwas({ limit: 1000 });
          const matched = res.fatwas?.find(f => f._id === slug);
          if (matched) {
            activeSlug = matched.slug;
          }
        }

        const data = await getFatwaBySlug(activeSlug);
        setCurrent(data);

        // Fetch comments to display count in metadata
        try {
          const comms = await getComments('fatwa', data.fatwa._id);
          setCommentCount(comms.totalComments || 0);
        } catch (e) {
          console.warn("Failed to fetch comment count", e);
        }
      } catch (err) {
        setError(err.response?.data?.message || err.message || 'Failed to load fatwa');
      } finally {
        setLoading(false);
      }
    };
    loadFatwa();
  }, [slug]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-background">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (error || !current) {
    return (
      <div className="max-w-xl mx-auto px-4 py-20 text-center" dir={language === 'ur' ? 'rtl' : 'ltr'}>
        <h2 className="text-2xl font-bold text-red-700 font-serif">
          {language === 'en' ? 'Error Loading Fatwa' : 'فتویٰ لوڈ کرنے میں خرابی'}
        </h2>
        <p className="text-slate-555 text-sm mt-2">{error || (language === 'en' ? 'Fatwa not found.' : 'فتویٰ نہیں ملا۔')}</p>
        <Link to="/fatwas" className="inline-flex items-center gap-1.5 mt-6 px-4 py-2 bg-primary text-white rounded font-semibold text-sm hover:bg-primary/90">
          {language === 'en' ? <ArrowLeft className="w-4.5 h-4.5" /> : <ArrowRight className="w-4.5 h-4.5" />}
          {language === 'en' ? 'Back to Fatwas' : 'فتاویٰ پر واپس جائیں'}
        </Link>
      </div>
    );
  }

  const { fatwa, related } = current;
  const { title, category, question, detailedAnswer, references, publishDate, viewCount, pdf } = fatwa;
  const pdfUrl = pdf?.url || (typeof pdf === 'string' ? pdf : null);

  const formattedDate = new Date(publishDate).toLocaleDateString(language === 'ur' ? 'ur-PK' : 'en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  return (
    <div className={`bg-background py-12 min-h-screen ${language === 'ur' ? 'text-right' : 'text-left'}`} dir={language === 'ur' ? 'rtl' : 'ltr'}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        
        {/* Navigation Breadcrumb back button */}
        <Link to="/fatwas" className="inline-flex items-center gap-1 text-sm font-bold text-textPrimary hover:text-accent dark:hover:text-amber-400 mb-6">
          {language === 'en' ? <ArrowLeft className="w-4 h-4" /> : <ArrowRight className="w-4 h-4" />}
          {language === 'en' ? 'Back to Fatwas' : 'فتاویٰ پر واپس جائیں'}
        </Link>
 
        {/* Two Column Grid: Main Fatwa Content & Sidebar Comments Section */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Main Fatwa Details Area (Left/2-3rds Width) */}
          <div className="lg:col-span-8">
            <div className="premium-card overflow-hidden mb-8">
              
              {/* Header Banner */}
              <div className={`bg-primary islamic-pattern text-white px-6 py-8 sm:px-10 relative border-b border-accent/35 ${language === 'ur' ? 'text-right' : 'text-left'}`}>
                <span className="bg-primary text-white text-xs font-bold px-3 py-1 rounded shadow-sm inline-block mb-3">
                  {language === 'ur' ? (FATWA_CATEGORY_TRANSLATIONS[category] || category) : category}
                </span>
                <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-white leading-[1.85] break-words">
                  {title}
                </h1>
              </div>

              <div className="p-6 sm:p-10">
                {/* Metadata bar */}
                <div className="flex flex-wrap items-center gap-6 text-xs text-slate-500 dark:text-slate-400 mb-8 pb-4 border-b border-slate-100 dark:border-slate-700 justify-start">
                  <span className="flex items-center gap-1.5">
                    <Calendar className="w-4 h-4 text-accent dark:text-amber-500" />
                    {language === 'en' ? 'Published:' : 'شائع ہوا:'} {formattedDate}
                  </span>
                  <span className="flex items-center gap-1.5">
                    <Eye className="w-4 h-4 text-accent dark:text-amber-500" />
                    {viewCount} {language === 'en' ? 'views' : 'بار دیکھا گیا'}
                  </span>
                  {/* Comments Option after View */}
                  <span className="flex items-center gap-1.5">
                    <MessageCircle className="w-4 h-4 text-accent dark:text-amber-500" />
                    {commentCount} {language === 'en' ? 'comments' : 'تبصرے'}
                  </span>
                </div>
     
                {/* 1. Original Question block */}
                <div className={`mb-8 bg-slate-50 dark:bg-slate-800/60 rounded p-5 sm:p-6 shadow-xs ${
                  language === 'ur' ? 'border-r-4 border-accent dark:border-amber-500 text-right' : 'border-l-4 border-accent dark:border-amber-500 text-left'
                }`}>
                  <h2 className="text-sm font-bold text-textPrimary flex items-center gap-2 mb-3">
                    <HelpCircle className="w-5 h-5 text-accent dark:text-amber-500 shrink-0" />
                    {language === 'en' ? 'Question Asked' : 'پوچھا گیا سوال'}
                  </h2>
                  <p className="text-slate-700 dark:text-slate-300 text-base leading-[2.1] font-normal break-words">
                    "{question}"
                  </p>
                </div>
     
                {/* 2. Scholar Answer block */}
                <div className={language === 'ur' ? 'text-right' : 'text-left'}>
                  <h2 className={`text-sm font-bold text-slate-800 dark:text-slate-200 flex items-center gap-2 mb-4 border-b border-slate-100 dark:border-slate-700 pb-2 ${language === 'ur' ? 'text-right' : 'text-left'}`}>
                    <FileText className="w-5 h-5 text-accent dark:text-amber-500 shrink-0" />
                    {language === 'en' ? 'Shariah Ruling & Detailed Fatwa' : 'شرعی حکم اور تفصیلی فتویٰ'}
                  </h2>
                  <div
                    className={`prose max-w-none text-slate-800 dark:text-slate-200 leading-[2.2] font-normal text-base space-y-6 break-words ${language === 'ur' ? 'text-right' : 'text-left'}`}
                    dangerouslySetInnerHTML={{ __html: detailedAnswer }}
                  ></div>

                  {/* PDF View / Download section */}
                  {pdfUrl && (
                    <div className="mt-8 pt-6 border-t border-slate-100 dark:border-slate-700 flex flex-col gap-6">
                      <div className="flex items-center justify-start gap-4">
                        <button
                          type="button"
                          onClick={() => setShowPdf(!showPdf)}
                          className="inline-flex items-center gap-1.5 px-5 py-2.5 bg-primary hover:bg-primary/95 text-white rounded text-xs font-bold transition-colors shadow-sm cursor-pointer border-0"
                        >
                          <ExternalLink className="w-4 h-4 text-accent" />
                          {showPdf 
                            ? (language === 'en' ? 'Hide Reader' : 'ریڈر چھپائیں')
                            : (language === 'en' ? 'View PDF Fatwa' : 'فتویٰ پی ڈی ایف دیکھیں')
                          }
                        </button>
                        <a
                          href={pdfUrl}
                          download
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1.5 px-5 py-2.5 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-800 dark:text-white rounded text-xs font-bold transition-colors shadow-xs decoration-none"
                          title={language === 'en' ? 'Download PDF' : 'پی ڈی ایف ڈاؤن لوڈ کریں'}
                        >
                          <Download className="w-4 h-4 text-accent" />
                          {language === 'en' ? 'Download' : 'ڈاؤن لوڈ کریں'}
                        </a>
                      </div>

                      {/* Inline PDF Viewer */}
                      {showPdf && (
                        <div className="w-full mt-2">
                          <PdfViewer url={pdfUrl} title={title} />
                        </div>
                      )}
                    </div>
                  )}
                </div>

                {/* 3. Classical References list */}
                {references && references.length > 0 && (
                  <div className={`mt-8 pt-6 border-t border-slate-100 dark:border-slate-700 ${language === 'ur' ? 'text-right' : 'text-left'}`}>
                    <h3 className="text-sm font-bold text-slate-800 dark:text-slate-200 uppercase tracking-widest font-serif mb-3 flex items-center gap-1.5">
                      <Bookmark className="w-4 h-4 text-accent dark:text-amber-500" /> 
                      {language === 'en' ? 'Academic References / Sources' : 'علمی حوالہ جات / کتب کے مراجع'}
                    </h3>
                    <ul className="list-decimal list-inside text-xs text-slate-600 dark:text-slate-400 space-y-1">
                      {references.map((ref, idx) => (
                        <li key={idx} className="font-light">{ref}</li>
                      ))}
                    </ul>
                  </div>
                )}

              </div>

            </div>

            {/* Related Fatwas Grid (Falls directly below fatwa content column) */}
            {related && related.length > 0 && (
              <div className={language === 'ur' ? 'text-right' : 'text-left'}>
                <h3 className="text-xl font-bold text-textPrimary font-serif mb-6 pb-2 border-b border-border">
                  {language === 'en' ? 'Related Fatwas' : 'متعلقہ فتاویٰ'}
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {related.map((rel) => (
                    <FatwaCard key={rel._id} fatwa={rel} />
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Sidebar Section (Right/1-third Width) - YouTube Collapsible Comments Section */}
          <div className="lg:col-span-4 lg:sticky lg:top-20">
            <CommentsSection contentType="fatwa" contentId={fatwa._id} language={language} />
          </div>

        </div>

      </div>
    </div>
  );
}
