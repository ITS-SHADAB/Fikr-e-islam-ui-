import React, { useEffect } from 'react';
import { Outlet } from 'react-router-dom';

/**
 * AuthLayout
 *
 * Minimal shell for authentication pages (Login, Signup, etc.).
 * Forces English + LTR while mounted.
 * On unmount, always restores Urdu RTL — the app's permanent language.
 */
export default function AuthLayout() {
  useEffect(() => {
    // Force LTR + English font for all auth pages
    document.body.dir = 'ltr';
    document.body.style.fontFamily = "'Inter', 'Outfit', sans-serif";

    // On unmount: always restore Urdu RTL (the rest of the app is always Urdu)
    return () => {
      document.body.dir = 'rtl';
      document.body.style.fontFamily =
        "'Pyami Nastaliq', 'Payami Nastaleeq', 'Noto Nastaliq Urdu', 'Noto Sans Arabic', 'Inter', sans-serif";
    };
  }, []);

  return (
    <div dir="ltr" lang="en" style={{ textAlign: 'left', fontFamily: "'Inter', 'Outfit', sans-serif" }}>
      <Outlet />
    </div>
  );
}
