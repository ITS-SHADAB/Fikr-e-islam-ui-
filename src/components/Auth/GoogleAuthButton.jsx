import React from "react";
import { AUTH_GOOGLE } from "@/constants/urls";

/**
 * Official multi-colored Google 'G' icon
 */
export function GoogleIcon({ className = "w-5 h-5 shrink-0" }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      aria-hidden="true"
      focusable="false"
    >
      <path
        fill="#4285F4"
        d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.82-2.4 3.68v3.05h3.88c2.27-2.09 3.66-5.17 3.66-9.17z"
      />
      <path
        fill="#34A853"
        d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.25v3.15C3.26 21.36 7.33 24 12 24z"
      />
      <path
        fill="#FBBC05"
        d="M5.28 14.27c-.25-.72-.38-1.49-.38-2.27s.13-1.55.38-2.27V6.58H1.25C.45 8.16 0 9.98 0 12s.45 3.84 1.25 5.42l4.03-3.15z"
      />
      <path
        fill="#EA4335"
        d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.33 0 3.26 2.64 1.25 6.58l4.03 3.15c.95-2.83 3.6-4.98 6.72-4.98z"
      />
    </svg>
  );
}

/**
 * GoogleAuthButton: Primary CTA for social authentication.
 * Prominently styled to be visually preferred and easiest option while harmonious with Fikr-e-Islam design tokens.
 */
export default function GoogleAuthButton({
  text = "Continue with Google",
  onClick,
  disabled = false,
  className = "",
}) {
  const handleClick = (e) => {
    if (onClick) {
      onClick(e);
    }
    if (!e?.defaultPrevented) {
      window.location.href = AUTH_GOOGLE;
    }
  };

  return (
    <button
      type="button"
      id="google-auth-button"
      onClick={handleClick}
      disabled={disabled}
      className={`w-full group relative flex items-center justify-center gap-3 px-4 py-3 sm:py-3.5 
        bg-white hover:bg-slate-50/90 active:bg-slate-100/90
        text-slate-800 font-semibold text-sm tracking-wide
        rounded-xl border-2 border-slate-200 hover:border-[#A8793E]/60
        shadow-sm hover:shadow-md active:scale-[0.99]
        transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-[#A8793E]/30
        disabled:opacity-60 disabled:pointer-events-none cursor-pointer ${className}`}
      aria-label={text}
    >
      <GoogleIcon className="w-5 h-5" />
      <span className="text-slate-800 group-hover:text-slate-900 transition-colors">
        {text}
      </span>
      <span className="hidden xs:inline-flex sm:inline-flex items-center text-[10px] font-bold text-[#A8793E] bg-[#A8793E]/10 border border-[#A8793E]/20 px-2 py-0.5 rounded-full ml-auto uppercase tracking-wider">
        Fast
      </span>
    </button>
  );
}
