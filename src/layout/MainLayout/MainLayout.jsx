import React, { useEffect, useState, useRef } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { useSettings } from '@/hooks/useSettings';
import { Navbar, Footer } from '@/layout';
import { COLORS } from '@/utils/themeColors';

export const fontFamilies = {
  'Inter': "'Inter', sans-serif",
  'Roboto': "'Roboto', sans-serif",
  'Playfair Display': "'Playfair Display', serif",
  'Lora': "'Lora', serif",
  'Outfit': "'Outfit', sans-serif",
};

export default function MainLayout() {
  const { pathname } = useLocation();
  const {
    settings,
    loading,
    error,
    pendingLanguageChange,
    changeLanguage,
    clearLanguageChangeRequest,
    refreshSettings
  } = useSettings();

  const [transitionState, setTransitionState] = useState('idle'); // 'idle', 'leaving', 'entering'
  const [overlayFade, setOverlayFade] = useState('hidden'); // 'hidden', 'in', 'out'
  const modalRef = useRef(null);

  const englishFont = settings?.englishFont || 'Inter';

  // Scroll to top automatically when navigation path changes
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  const language = settings?.language === 'ur' || settings?.language === 'Urdu' ? 'ur' : 'en';

  // Apply typography and direction configuration dynamically for Urdu & RTL
  useEffect(() => {
    if (language === 'ur') {
      document.body.style.fontFamily = "'Pyami Nastaliq', 'Payami Nastaleeq', 'Noto Nastaliq Urdu', 'Noto Sans Arabic', 'Inter', sans-serif";
      document.body.dir = 'rtl';
    } else {
      document.body.style.fontFamily = "'Inter', sans-serif";
      document.body.dir = 'ltr';
    }
  }, [language]);

  const handleConfirm = () => {
    // T = 0 to T = 1.0s: Fade out content and show white overlay
    setTransitionState('leaving');
    setOverlayFade('in');

    setTimeout(() => {
      // T = 1.0s: Switch language state, clear pending change request, start fade-in
      changeLanguage(pendingLanguageChange);
      clearLanguageChangeRequest();
      setTransitionState('entering');
      setOverlayFade('out');

      // T = 2.0s: Completion of visual transition sequence
      setTimeout(() => {
        setTransitionState('idle');
        setOverlayFade('hidden');
      }, 1000);
    }, 1000);
  };

  const handleCancel = () => {
    clearLanguageChangeRequest();
  };

  // Keyboard accessibility and focus trap for the language confirmation modal
  useEffect(() => {
    if (!pendingLanguageChange) return;

    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        handleCancel();
      }
      if (e.key === 'Tab' && modalRef.current) {
        const focusableElements = modalRef.current.querySelectorAll(
          'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
        );
        if (focusableElements.length > 0) {
          const firstElement = focusableElements[0];
          const lastElement = focusableElements[focusableElements.length - 1];

          if (e.shiftKey) {
            if (document.activeElement === firstElement) {
              lastElement.focus();
              e.preventDefault();
            }
          } else {
            if (document.activeElement === lastElement) {
              firstElement.focus();
              e.preventDefault();
            }
          }
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);

    // Auto focus confirm button inside modal
    setTimeout(() => {
      const confirmBtn = modalRef.current?.querySelector('.confirm-btn');
      confirmBtn?.focus();
    }, 50);

    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [pendingLanguageChange]);

  // If initial API call is in progress, show spinner/loader
  if ((loading && !settings) || (!settings && !error)) {
    return (
      <div
        style={{ backgroundColor: COLORS.background, color: COLORS.primary }}
        className="flex flex-col items-center justify-center min-h-screen"
        dir={language === 'ur' ? 'rtl' : 'ltr'}
      >
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2" style={{ borderColor: COLORS.accent }}></div>
        <p className="mt-4 text-sm font-bold tracking-wider animate-pulse" style={{ color: COLORS.textSecondary }}>
          {language === 'ur' ? 'پورٹل لوڈ ہو رہا ہے...' : 'Portal is loading...'}
        </p>
      </div>
    );
  }

  // If API call fails or there's no response, show "Server is under maintenance"
  if (error && !settings) {
    return (
      <div
        style={{ backgroundColor: COLORS.background }}
        className="flex flex-col items-center justify-center min-h-screen text-center p-6"
        dir={language === 'ur' ? 'rtl' : 'ltr'}
      >
        <div
          style={{ backgroundColor: COLORS.white, borderColor: COLORS.border }}
          className="max-w-md w-full p-8 rounded-2xl shadow-xl border relative overflow-hidden"
        >
          <div className="absolute top-0 left-0 right-0 h-1.5 bg-red-500"></div>
          <div className="w-16 h-16 bg-red-50 text-red-500 rounded-full flex items-center justify-center mx-auto mb-6">
            <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          </div>
          <h1 className="text-2xl font-bold mb-3" style={{ color: COLORS.primary }}>
            {language === 'ur' ? 'سسٹم کی دیکھ بھال جاری ہے' : 'System is under maintenance'}
          </h1>
          <p className="text-sm leading-relaxed mb-6 font-light" style={{ color: `rgba(107, 91, 75, 0.8)` }}>
            {language === 'ur' ? 'ہم اس وقت سسٹم کی دیکھ بھال کر رہے ہیں یا اپنی ترتیبات کو اپ ڈیٹ کر رہے ہیں۔ براہ کرم چند لمحوں بعد دوبارہ کوشش کریں۔' : 'We are currently maintaining the system or updating our settings. Please try again in a few moments.'}
          </p>
          <button
            onClick={() => refreshSettings()}
            style={{ backgroundColor: COLORS.primary }}
            className="px-6 py-2.5 text-white font-bold rounded shadow-md hover:opacity-90 transition-all text-xs"
          >
            {language === 'ur' ? 'دوبارہ کوشش کریں' : 'Try Again'}
          </button>
        </div>
      </div>
    );
  }

  let pageTransitionClass = "flex-grow lang-content-transition";
  if (transitionState === 'leaving') {
    pageTransitionClass += " lang-content-leaving";
  } else if (transitionState === 'entering') {
    pageTransitionClass += " lang-content-entering";
  }

  let overlayClass = "lang-overlay-transition";
  if (overlayFade === 'in') {
    overlayClass += " lang-overlay-in";
  } else if (overlayFade === 'out') {
    overlayClass += " lang-overlay-out";
  } else {
    overlayClass += " hidden";
  }

  return (
    <div className="flex flex-col min-h-screen bg-background relative">
      {/* Premium header navigation */}
      <Navbar />

      {/* Main page content area */}
      <main className={pageTransitionClass}>
        <Outlet />
      </main>

      {/* Footer information */}
      <Footer />

      {/* Language Switch Centered Confirmation Modal */}
      {pendingLanguageChange && transitionState === 'idle' && (
        <div className="fixed inset-0 z-[9998] flex items-center justify-center p-4">
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-slate-900/50 animate-modal-fade-in cursor-pointer"
            onClick={handleCancel}
          />

          {/* Modal Box */}
          <div
            ref={modalRef}
            style={{ backgroundColor: COLORS.white, borderColor: COLORS.border }}
            className={`relative border rounded-2xl p-6 shadow-2xl max-w-sm w-full z-10 transform animate-modal-scale-up ${language === 'ur' ? 'text-right' : 'text-left'}`}
            dir={language === 'ur' ? 'rtl' : 'ltr'}
            role="dialog"
            aria-modal="true"
            aria-labelledby="lang-modal-title"
            aria-describedby="lang-modal-desc"
          >
            <div className="space-y-6">
              <div className="space-y-2">
                <h3 id="lang-modal-title" className="text-lg font-bold font-serif" style={{ color: COLORS.primary }}>
                  {language === 'en' ? 'Change Language' : 'زبان تبدیل کریں'}
                </h3>
                <p id="lang-modal-desc" className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed font-light">
                  {language === 'en'
                    ? 'Are you sure you want to switch the website language?'
                    : 'کیا آپ واقعی ویب سائٹ کی زبان تبدیل کرنا چاہتے ہیں؟'}
                </p>
              </div>

              <div className={`flex items-center gap-3 justify-end ${language === 'ur' ? 'flex-row' : 'flex-row-reverse'}`}>
                <button
                  type="button"
                  onClick={handleCancel}
                  className="px-4 py-2 text-xs font-bold text-slate-500 hover:text-slate-700 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 rounded transition-colors uppercase tracking-wider font-serif"
                >
                  {language === 'en' ? 'Cancel' : 'منسوخ کریں'}
                </button>
                <button
                  type="button"
                  onClick={handleConfirm}
                  style={{ backgroundColor: COLORS.primary }}
                  className="confirm-btn px-5 py-2 text-xs font-bold text-white rounded shadow transition-all hover:opacity-95 uppercase tracking-wider font-serif"
                >
                  {language === 'en' ? 'Confirm' : 'تصدیق کریں'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Full-Screen Transition Overlay */}
      {overlayFade !== 'hidden' && (
        <div className={overlayClass} style={{ pointerEvents: 'all' }}>
          <div className="flex flex-col items-center gap-5">
            {/* Elegant Spinner */}
            <div className="relative w-16 h-16">
              <div className="absolute inset-0 rounded-full border-4 border-slate-100" />
              <div className="absolute inset-0 rounded-full border-4 animate-spin" style={{ borderTopColor: COLORS.accent }} />
            </div>
            {/* Pulsing loading state text */}
            <span className="font-serif text-sm font-bold tracking-wider animate-pulse-slow" style={{ color: COLORS.primary }}>
              {pendingLanguageChange === 'ur' ? 'زبان تبدیل کی جا رہی ہے...' : 'Switching Language...'}
            </span>
          </div>
        </div>
      )}

      {/* Style block for premium animations, keyframes, transitions */}
      <style dangerouslySetInnerHTML={{
        __html: `
        /* Reduced-motion fallback */
        @media (prefers-reduced-motion: reduce) {
          .lang-content-transition, .lang-overlay-transition {
            transition: opacity 0.3s ease !important;
            transform: none !important;
            filter: none !important;
          }
          .lang-content-leaving {
            opacity: 0 !important;
          }
        }

        @media (prefers-reduced-motion: no-preference) {
          .lang-content-transition {
            transition: opacity 1s cubic-bezier(0.4, 0, 0.2, 1),
                        transform 1s cubic-bezier(0.4, 0, 0.2, 1),
                        filter 1s cubic-bezier(0.4, 0, 0.2, 1);
            will-change: opacity, transform, filter;
          }
          .lang-content-leaving {
            opacity: 0;
            transform: scale(0.98);
            filter: blur(5px);
          }
          .lang-content-entering {
            opacity: 1;
            transform: scale(1);
            filter: blur(0);
          }
          
          .lang-overlay-transition {
            position: fixed;
            inset: 0;
            background: white;
            z-index: 9999;
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            transition: opacity 1s cubic-bezier(0.4, 0, 0.2, 1);
            will-change: opacity;
          }
          
          .lang-overlay-in {
            opacity: 1;
          }
          .lang-overlay-out {
            opacity: 0;
          }
        }

        /* Modal animations */
        @keyframes modal-fade-in {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes modal-scale-up {
          from { transform: scale(0.95); opacity: 0; }
          to { transform: scale(1); opacity: 1; }
        }
        .animate-modal-fade-in {
          animation: modal-fade-in 0.2s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }
        .animate-modal-scale-up {
          animation: modal-scale-up 0.25s cubic-bezier(0.34, 1.56, 0.64, 1) forwards;
        }
        
        /* Loading spinner animations */
        @keyframes pulse-slow {
          0%, 100% { opacity: 1; transform: scale(1); }
          50% { opacity: 0.6; transform: scale(0.97); }
        }
        .animate-pulse-slow {
          animation: pulse-slow 1.5s cubic-bezier(0.4, 0, 0.2, 1) infinite;
        }
      `}} />
    </div>
  );
}
