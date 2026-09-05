import React from "react";

/**
 * AuthDivider: Elegant separator between primary Google CTA and secondary email/phone form.
 */
export default function AuthDivider({ text = "OR", className = "" }) {
  return (
    <div className={`relative flex items-center justify-center my-4 sm:my-5 ${className}`}>
      <div className="w-full border-t border-slate-200" aria-hidden="true" />
      <span className="shrink-0 px-3 text-[11px] font-bold tracking-widest text-slate-400 uppercase select-none">
        {text}
      </span>
      <div className="w-full border-t border-slate-200" aria-hidden="true" />
    </div>
  );
}
