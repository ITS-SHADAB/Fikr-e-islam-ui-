import React, { useState } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, Mail, AlertTriangle, CheckCircle2 } from "lucide-react";
import toast from "react-hot-toast";
import { forgotPasswordApi } from "@/services";

/* ─── Animated required asterisk ─────────────────────────────────────── */
function RequiredStar() {
  return (
    <span
      className="ml-1 text-red-500 font-black text-sm"
      style={{ animation: "pulse-star 1.6s ease-in-out infinite" }}
      aria-hidden="true"
    >
      *
    </span>
  );
}

/**
 * ForgotPassword Component
 * Connected to POST /api/users/forgot-password
 */
export default function ForgotPassword({
  isModal = false,
  onClose,
  onBackToLogin,
  onSwitchToLogin,
}) {
  const [email, setEmail] = useState("");
  const [touched, setTouched] = useState(false);
  const [error, setError] = useState(null);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [serverMessage, setServerMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const emailRx = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const handleBack = onBackToLogin || onSwitchToLogin;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setTouched(true);
    setError(null);

    const trimmedEmail = email.trim().toLowerCase();

    if (!trimmedEmail) {
      setError("Please enter your email address.");
      return;
    }
    if (!emailRx.test(trimmedEmail)) {
      setError("Please enter a valid email address.");
      return;
    }

    try {
      setLoading(true);
      const data = await forgotPasswordApi(trimmedEmail);
      const msg =
        data?.message || "Password reset link has been sent to your email.";
      setServerMessage(msg);
      setIsSubmitted(true);
      toast.success(msg);
    } catch (err) {
      const msg =
        err.message ||
        "Unable to process your request. Please try again later.";
      setError(msg);
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div dir="ltr" className="text-left font-sans w-full">
      <style>{`
        @keyframes pulse-star {
          0%,100% { opacity:1; transform:scale(1); }
          50%      { opacity:0.5; transform:scale(1.4); }
        }
        @keyframes fade-slide-up {
          from { opacity:0; transform:translateY(18px); }
          to   { opacity:1; transform:translateY(0); }
        }
        .forgot-card { animation: fade-slide-up 0.45s cubic-bezier(.22,1,.36,1) both; }
      `}</style>

      <div
        className={`${
          isModal
            ? "p-6 sm:p-8 w-full"
            : "min-h-screen bg-background flex items-center justify-center p-4 relative overflow-hidden"
        }`}
      >
        {!isModal && (
          <>
            {/* Background decorative ambient glow */}
            <div className="absolute top-[-10%] right-[-10%] w-[480px] h-[480px] bg-primary/6 rounded-full blur-[100px] pointer-events-none" />
            <div className="absolute bottom-[-10%] left-[-10%] w-[380px] h-[380px] bg-accent/8 rounded-full blur-[90px] pointer-events-none" />
          </>
        )}

        <div
          className={`w-full ${
            !isModal
              ? "max-w-md relative forgot-card mx-auto bg-card-bg rounded-3xl shadow-2xl border border-border/40 p-6 sm:p-10"
              : ""
          }`}
        >
          {/* Header */}
          <div className="text-center mb-6">
            <h1 className="text-xl sm:text-2xl font-extrabold text-slate-800 tracking-tight">
              Forgot Password?
            </h1>
            <p className="text-slate-500 text-xs sm:text-sm mt-1.5 font-light leading-relaxed max-w-sm mx-auto">
              Enter your email address and we&apos;ll send you a password reset link.
            </p>
          </div>

          {/* Simulated Success Message (UI Demo) */}
          {isSubmitted ? (
            <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-5 text-center space-y-3 animate-in fade-in duration-300">
              <div className="w-11 h-11 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto">
                <CheckCircle2 size={24} />
              </div>
              <div>
                <h3 className="text-sm font-bold text-slate-800">
                  {serverMessage || "Reset link sent"}
                </h3>
                <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                  We&apos;ve sent instructions to{" "}
                  <span className="font-semibold text-slate-700">{email}</span>.
                  Please check your inbox and spam folder.
                </p>
              </div>
              <div className="pt-2">
                <button
                  type="button"
                  onClick={() => {
                    setIsSubmitted(false);
                    setEmail("");
                    setTouched(false);
                  }}
                  className="text-xs font-semibold text-primary hover:text-accent transition-colors underline underline-offset-2 cursor-pointer"
                >
                  Send to a different email
                </button>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} noValidate className="space-y-4 w-full">
              {/* Error Message */}
              {error && (
                <div className="bg-red-50 border border-red-200 rounded-xl px-4 py-3 flex items-start gap-2.5 text-red-700 text-xs">
                  <AlertTriangle size={15} className="shrink-0 mt-0.5 text-red-500" />
                  <div>
                    <span className="font-bold">Error: </span>
                    {error}
                  </div>
                </div>
              )}

              {/* Email Input Field */}
              <div className="space-y-1 text-left w-full">
                <label
                  htmlFor="forgot-email"
                  className="flex items-center text-[11px] font-bold text-slate-500 uppercase tracking-widest"
                >
                  Email Address
                  <RequiredStar />
                </label>
                <div
                  className={`relative flex items-center rounded-xl px-4 py-3 border-2 bg-white transition-all duration-200 ${
                    error || (touched && !email.trim())
                      ? "border-red-400 bg-red-50/30 shadow-sm shadow-red-100"
                      : "border-slate-200 focus-within:border-primary focus-within:shadow-md focus-within:shadow-primary/10"
                  }`}
                >
                  <Mail size={16} className="text-slate-400 mr-2 shrink-0" />
                  <input
                    id="forgot-email"
                    type="email"
                    autoComplete="email"
                    placeholder="Enter your registered email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    onBlur={() => setTouched(true)}
                    className="w-full bg-transparent text-sm text-slate-800 placeholder:text-slate-400 outline-none border-none ring-0 min-w-0"
                  />
                </div>
              </div>

              {/* Primary CTA Button: Send Reset Link */}
              <button
                id="forgot-submit"
                type="submit"
                disabled={loading}
                className="w-full py-3.5 mt-2 bg-gradient-to-r from-primary to-primary/85 hover:from-primary/90 hover:to-primary text-white font-bold rounded-xl shadow-lg shadow-primary/25 hover:shadow-xl hover:shadow-primary/30 hover:-translate-y-0.5 transition-all duration-200 text-sm tracking-wide flex items-center justify-center gap-2.5 disabled:opacity-60 disabled:pointer-events-none cursor-pointer"
              >
                {loading ? (
                  <>
                    <svg
                      className="animate-spin h-4 w-4 text-white"
                      viewBox="0 0 24 24"
                      fill="none"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      />
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.37 0 0 5.37 0 12h4z"
                      />
                    </svg>
                    <span>Sending Reset Link...</span>
                  </>
                ) : (
                  <span>Send Reset Link</span>
                )}
              </button>
            </form>
          )}

          {/* Secondary Link: Back to Sign In */}
          <div className="mt-6 text-center">
            {handleBack ? (
              <button
                type="button"
                onClick={handleBack}
                className="inline-flex items-center gap-2 text-xs font-semibold text-slate-600 hover:text-primary transition-colors group cursor-pointer"
              >
                <ArrowLeft
                  size={14}
                  className="group-hover:-translate-x-1 transition-transform"
                />
                <span>Back to Sign In</span>
              </button>
            ) : !isModal ? (
              <Link
                to="/"
                className="inline-flex items-center gap-2 text-xs font-semibold text-slate-600 hover:text-primary transition-colors group cursor-pointer"
              >
                <ArrowLeft
                  size={14}
                  className="group-hover:-translate-x-1 transition-transform"
                />
                <span>Back to Sign In</span>
              </Link>
            ) : null}
          </div>
        </div>
      </div>
    </div>
  );
}
