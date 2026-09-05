import React from 'react';
import { COLORS } from '@/utils/themeColors';
import logoImg from '@/assets/images/logo.jpeg';

export default function LogoSeal({ size = 76, opacity = 1, className = '', style = {} }) {
  return (
    <div
      className={`relative inline-flex items-center justify-center rounded-full shrink-0 select-none ${className}`}
      style={{
        width: size,
        height: size,
        opacity,
        ...style,
      }}
    >
      {/* Outer Decorative Gold Ring */}
      <div
        className="absolute inset-0 rounded-full border-2 border-dashed pointer-events-none"
        style={{ borderColor: COLORS.accent || "#A8793E", opacity: 0.65 }}
      />
      {/* Inner Solid Accent Ring */}
      <div
        className="absolute inset-[3px] rounded-full border pointer-events-none"
        style={{ borderColor: COLORS.accent || "#A8793E", opacity: 0.9 }}
      />
      {/* Rounded Circular Logo */}
      <img
        src={logoImg}
        alt="Mufti Faizan Sarwar Logo Seal"
        className="w-full h-full rounded-full object-cover p-1 shadow-sm"
      />
    </div>
  );
}
