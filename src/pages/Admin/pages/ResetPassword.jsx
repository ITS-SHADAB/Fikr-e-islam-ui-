import React, { useState, useEffect } from "react";
import { useParams, useSearchParams, useNavigate, Link } from "react-router-dom";
import { useDispatch } from "react-redux";
import {
  Eye,
  EyeOff,
  AlertTriangle,
  ArrowRight,
  CheckCircle2,
  Lock,
  X,
} from "lucide-react";
import toast from "react-hot-toast";
import { resetPasswordApi } from "@/services";
import { checkAuthStatus } from "@/store/slices/authSlice";

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

/* ─── Field wrapper matching Login & Signup design system ────────────── */
function Field({ label, required, hint, error, children }) {
  return (
    <div className="space-y-1 text-left w-full">
      <label className="flex items-center text-[11px] font-bold text-slate-500 uppercase tracking-widest">
        {label}
        {required && <RequiredStar />}
      </label>
      <div
        className={`relative flex items-center rounded-xl px-4 py-3 border-2 bg-white
          transition-all duration-200 group
          ${
            error
              ? "border-red-400 bg-red-50/30 shadow-sm shadow-red-100"
              : "border-slate-200 focus-within:border-primary focus-within:shadow-md focus-within:shadow-primary/10"
          }`}
      >
        {children}
      </div>
      {hint && !error && (
        <p className="text-[10px] text-slate-400 px-1">{hint}</p>
      )}
      {error && (
        <p className="text-[10px] text-red-500 px-1 flex items-center gap-1">
          <AlertTriangle size={10} /> {error}
        </p>
      )}
    </div>
  );
}

/**
 * ResetPassword Component
 * Matches the visual design/style of the Login modal:
 * - max-w-md width
 * - rounded-2xl corners & shadow-2xl
 * - dark brown top header bar (bg-primary text-[#F7F1E8] border-b border-border)
 * - cream card background (bg-card-bg)
 * - typography and input fields identical to Login/Signup
 */
export default function ResetPassword({
  isModal = false,
  token: propToken,
  onClose,
  onBackToLogin,
  onSwitchToLogin,
  onSwitchToForgotPassword,
}) {
  const { token: paramToken } = useParams();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleBack = onBackToLogin || onSwitchToLogin;

  // Extract token from prop, route param (:token) or query string (?token=...)
  const activeToken = (propToken || paramToken || searchParams.get("token") || "").trim();

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPass, setShowPass] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [touched, setTouched] = useState({ password: false, confirmPassword: false });
  const [loading, setLoading] = useState(false);
  const [localError, setLocalError] = useState(null);
  const [isTokenInvalid, setIsTokenInvalid] = useState(!activeToken);
  const [isSuccess, setIsSuccess] = useState(false);
  const [countdown, setCountdown] = useState(3);

  // Field validation
  const fieldErrors = {
    password:
      touched.password && !password
        ? "New password is required."
        : touched.password && password.length < 6
        ? "Password must be at least 6 characters."
        : null,
    confirmPassword:
      touched.confirmPassword && !confirmPassword
        ? "Please confirm your password."
        : touched.confirmPassword && confirmPassword !== password
        ? "Passwords do not match."
        : null,
  };

  const handleBlur = (field) => setTouched((prev) => ({ ...prev, [field]: true }));

  // Dynamic strength score
  let score = 0;
  if (password.length >= 6) score++;
  if (password.length >= 10) score++;
  if (/[A-Z]/.test(password)) score++;
  if (/[0-9]/.test(password)) score++;
  if (/[^A-Za-z0-9]/.test(password)) score++;

  const strengthLabels = ["", "Very Weak", "Weak", "Fair", "Strong", "Very Strong"];
  const strengthColors = ["", "bg-red-500", "bg-amber-500", "bg-yellow-500", "bg-blue-500", "bg-emerald-500"];
  const strengthTextColors = ["", "text-red-600", "text-amber-600", "text-yellow-600", "text-blue-600", "text-emerald-600"];

  const passwordsMatch = confirmPassword.length > 0 && password === confirmPassword;

  // Auto-redirect / close countdown on success
  useEffect(() => {
    let timer;
    if (isSuccess && countdown > 0) {
      timer = setTimeout(() => {
        setCountdown((prev) => prev - 1);
      }, 1000);
    } else if (isSuccess && countdown === 0) {
      if (isModal) {
        onClose?.();
      } else {
        navigate("/");
      }
    }
    return () => clearTimeout(timer);
  }, [isSuccess, countdown, isModal, onClose, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLocalError(null);
    setTouched({ password: true, confirmPassword: true });

    if (!activeToken) {
      setIsTokenInvalid(true);
      return;
    }

    if (!password) {
      setLocalError("Please enter your new password.");
      return;
    }

    if (password.length < 6) {
      setLocalError("Password must be at least 6 characters.");
      return;
    }

    if (password !== confirmPassword) {
      setLocalError("Passwords do not match.");
      return;
    }

    try {
      setLoading(true);
      const data = await resetPasswordApi(activeToken, {
        password,
        confirmPassword,
      });

      const msg = data?.message || "Password reset successfully. You are now logged in.";
      toast.success(msg);
      setIsSuccess(true);

      // Rehydrate authenticated session state via cookie
      try {
        await dispatch(checkAuthStatus()).unwrap();
      } catch (authErr) {
        console.warn("Auth check after reset returned:", authErr);
      }
    } catch (err) {
      const msg = err.message || "Reset link is invalid or has expired.";
      setLocalError(msg);
      toast.error(msg);

      if (
        msg.toLowerCase().includes("invalid") ||
        msg.toLowerCase().includes("expired")
      ) {
        setIsTokenInvalid(true);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div dir="ltr" className="text-left font-sans w-full">
      {/* Keyframe injection */}
      <style>{`
        @keyframes pulse-star {
          0%,100% { opacity:1; transform:scale(1); }
          50%      { opacity:0.5; transform:scale(1.4); }
        }
        @keyframes fade-slide-up {
          from { opacity:0; transform:translateY(16px); }
          to   { opacity:1; transform:translateY(0); }
        }
        .modal-card-frame { animation: fade-slide-up 0.4s cubic-bezier(.16,1,.3,1) both; }
      `}</style>

      <div
        className={`${
          isModal
            ? "w-full"
            : "min-h-[85vh] bg-background flex items-center justify-center p-4 py-10 relative overflow-hidden"
        }`}
      >
        {!isModal && (
          <>
            {/* Background ambient decorative glows */}
            <div className="absolute top-[-10%] right-[-10%] w-[480px] h-[480px] bg-primary/6 rounded-full blur-[100px] pointer-events-none" />
            <div className="absolute bottom-[-10%] left-[-10%] w-[380px] h-[380px] bg-accent/8 rounded-full blur-[90px] pointer-events-none" />
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-primary/5 rounded-full blur-[120px] pointer-events-none" />
          </>
        )}

        {/* ─── CARD CONTAINER (Matching Modal frame style) ────────────── */}
        <div
          className={`w-full ${
            !isModal
              ? "max-w-md relative modal-card-frame mx-auto bg-card-bg rounded-2xl shadow-2xl border border-border overflow-hidden"
              : ""
          }`}
        >
          {/* Dark Brown Header Bar (shown on standalone page to match Login modal header) */}
          {!isModal && (
            <div className="bg-primary text-[#F7F1E8] px-5 py-3.5 flex items-center justify-between border-b border-border shrink-0">
              <h3 className="font-bold text-sm sm:text-md font-serif tracking-wide line-clamp-1">
                Set New Password
              </h3>
              <Link
                to="/"
                className="p-1 rounded-lg text-[#F7F1E8]/80 hover:text-[#F7F1E8] hover:bg-white/10 focus:outline-none transition-colors cursor-pointer"
                title="Back to Home"
                aria-label="Back to Home"
              >
                <X className="w-5 h-5" />
              </Link>
            </div>
          )}

          {/* ─── CARD BODY ────────────────────────────────────────────── */}
          <div className={`${isModal ? "p-5 sm:p-7" : "p-6 sm:p-8"}`}>
            {/* Header Title & Subtitle */}
            <div className="text-center mb-5">
              <h1 className="text-xl sm:text-2xl font-extrabold text-slate-800 tracking-tight">
                Set New Password
              </h1>
              <p className="text-slate-500 text-xs sm:text-sm mt-1 font-light">
                Enter your new password to secure your account
              </p>
            </div>

            {/* ─── SUCCESS STATE ────────────────────────────────────────── */}
            {isSuccess ? (
              <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-5 sm:p-6 text-center space-y-3 animate-in fade-in duration-300">
                <div className="w-12 h-12 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto">
                  <CheckCircle2 size={26} />
                </div>
                <div>
                  <h3 className="text-sm sm:text-base font-bold text-slate-800">
                    Password Reset Successfully!
                  </h3>
                  <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                    Your password has been updated and you are now signed in. Redirecting in {countdown}s...
                  </p>
                </div>
                <div className="pt-2">
                  {isModal ? (
                    <button
                      type="button"
                      onClick={() => onClose?.()}
                      className="w-full py-2.5 px-4 bg-primary text-white font-bold rounded-xl text-xs hover:bg-primary/90 transition-all cursor-pointer shadow-md"
                    >
                      Done
                    </button>
                  ) : (
                    <Link
                      to="/"
                      className="inline-flex items-center justify-center gap-2 w-full py-2.5 px-4 bg-primary text-white font-bold rounded-xl text-xs hover:bg-primary/90 transition-all shadow-md"
                    >
                      <span>Continue to Official Portal</span>
                      <ArrowRight size={14} />
                    </Link>
                  )}
                </div>
              </div>
            ) : isTokenInvalid ? (
              /* ─── INVALID OR EXPIRED TOKEN STATE ───────────────────────── */
              <div className="bg-red-50 border border-red-200 rounded-2xl p-5 sm:p-6 text-center space-y-3 animate-in fade-in duration-300">
                <div className="w-12 h-12 bg-red-100 text-red-600 rounded-full flex items-center justify-center mx-auto">
                  <AlertTriangle size={24} />
                </div>
                <div>
                  <h3 className="text-sm sm:text-base font-bold text-slate-800">
                    Invalid or Expired Link
                  </h3>
                  <p className="text-xs text-slate-600 mt-1 leading-relaxed max-w-xs mx-auto">
                    This reset link is invalid or has expired (links expire in 15 minutes). Please request a new password reset link.
                  </p>
                </div>
                <div className="pt-2 flex flex-col gap-2">
                  {onSwitchToForgotPassword ? (
                    <button
                      type="button"
                      onClick={onSwitchToForgotPassword}
                      className="w-full py-2.5 px-4 bg-primary text-white font-bold rounded-xl text-xs hover:bg-primary/90 transition-all cursor-pointer shadow-md"
                    >
                      Request New Reset Link
                    </button>
                  ) : (
                    <Link
                      to="/forgot-password"
                      className="w-full py-2.5 px-4 bg-primary text-white font-bold rounded-xl text-xs hover:bg-primary/90 transition-all text-center shadow-md"
                    >
                      Request New Reset Link
                    </Link>
                  )}
                  {handleBack ? (
                    <button
                      type="button"
                      onClick={handleBack}
                      className="text-xs font-semibold text-slate-500 hover:text-primary transition-colors cursor-pointer pt-1"
                    >
                      Back to Sign In
                    </button>
                  ) : (
                    <Link
                      to="/login"
                      className="text-xs font-semibold text-slate-500 hover:text-primary transition-colors pt-1 text-center"
                    >
                      Back to Sign In
                    </Link>
                  )}
                </div>
              </div>
            ) : (
              /* ─── FORM ─────────────────────────────────────────────────── */
              <form onSubmit={handleSubmit} noValidate className="space-y-3.5 sm:space-y-4 w-full">
                {/* Global Error Banner */}
                {localError && (
                  <div className="mb-4 bg-red-50 border border-red-200 rounded-xl px-4 py-3 flex items-start gap-2.5 text-red-700 text-xs">
                    <AlertTriangle size={15} className="shrink-0 mt-0.5 text-red-500" />
                    <div>
                      <span className="font-bold">Error: </span>
                      {localError}
                    </div>
                  </div>
                )}

                {/* New Password Field */}
                <Field
                  label="New Password"
                  required
                  hint="Must be at least 6 characters"
                  error={fieldErrors.password}
                >
                  <input
                    id="reset-new-password"
                    type={showPass ? "text" : "password"}
                    autoComplete="new-password"
                    placeholder="Enter your new password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    onBlur={() => handleBlur("password")}
                    className="w-full bg-transparent text-sm text-slate-800 placeholder:text-slate-400 outline-none border-none ring-0 min-w-0"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPass(!showPass)}
                    className="text-slate-400 hover:text-primary transition-colors shrink-0 focus:outline-none cursor-pointer ml-2"
                    aria-label={showPass ? "Hide password" : "Show password"}
                  >
                    {showPass ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </Field>

                {/* Confirm Password Field */}
                <Field
                  label="Confirm Password"
                  required
                  error={fieldErrors.confirmPassword}
                >
                  <input
                    id="reset-confirm-password"
                    type={showConfirm ? "text" : "password"}
                    autoComplete="new-password"
                    placeholder="Re-enter your new password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    onBlur={() => handleBlur("confirmPassword")}
                    className="w-full bg-transparent text-sm text-slate-800 placeholder:text-slate-400 outline-none border-none ring-0 min-w-0"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirm(!showConfirm)}
                    className="text-slate-400 hover:text-primary transition-colors shrink-0 focus:outline-none cursor-pointer ml-2"
                    aria-label={showConfirm ? "Hide password" : "Show password"}
                  >
                    {showConfirm ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </Field>

                {/* Real-time Strength & Match Feedback */}
                {password && (
                  <div className="space-y-1.5 px-1">
                    <div className="flex gap-1.5">
                      {[1, 2, 3, 4, 5].map((level) => (
                        <div
                          key={level}
                          className={`h-1.5 flex-1 rounded-full transition-all duration-300 ${
                            level <= score ? strengthColors[score] : "bg-slate-200"
                          }`}
                        />
                      ))}
                    </div>
                    <div className="flex items-center justify-between text-[11px]">
                      <span className={strengthTextColors[score] || "text-slate-400"}>
                        {strengthLabels[score]}
                      </span>
                      {confirmPassword && (
                        <span
                          className={
                            passwordsMatch
                              ? "text-emerald-600 font-semibold flex items-center gap-1"
                              : "text-red-500 font-semibold flex items-center gap-1"
                          }
                        >
                          {passwordsMatch ? (
                            <>
                              <CheckCircle2 size={12} /> Passwords match
                            </>
                          ) : (
                            "Passwords do not match"
                          )}
                        </span>
                      )}
                    </div>
                  </div>
                )}

                {/* Primary CTA Submit Button */}
                <button
                  id="reset-submit"
                  type="submit"
                  disabled={loading}
                  className="w-full py-3 sm:py-3.5 mt-2 bg-gradient-to-r from-primary to-primary/85 hover:from-primary/90 hover:to-primary text-white font-bold rounded-xl shadow-md hover:shadow-lg hover:-translate-y-0.5 transition-all duration-200 text-sm tracking-wide flex items-center justify-center gap-2.5 disabled:opacity-60 disabled:pointer-events-none cursor-pointer"
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
                      <span>Saving Password...</span>
                    </>
                  ) : (
                    <span>Save New Password</span>
                  )}
                </button>
              </form>
            )}

            {/* Bottom Navigation Link: Back to Sign In */}
            {!isSuccess && !isTokenInvalid && (
              <p className="mt-4 sm:mt-5 text-center text-xs text-slate-500">
                Remember your password?{" "}
                {handleBack ? (
                  <button
                    type="button"
                    onClick={handleBack}
                    className="text-primary hover:text-primary/80 font-bold transition-colors underline underline-offset-2 cursor-pointer inline"
                  >
                    Sign in here
                  </button>
                ) : (
                  <Link
                    to="/login"
                    className="text-primary hover:text-primary/80 font-bold transition-colors underline underline-offset-2 inline"
                  >
                    Sign in here
                  </Link>
                )}
              </p>
            )}

            {/* Back link - only for standalone page */}
            {!isModal && (
              <div className="mt-5 text-center">
                <Link
                  to="/"
                  className="inline-flex items-center gap-1.5 text-xs text-slate-400 hover:text-primary transition-colors group font-medium"
                >
                  <span>Back to Official Portal</span>
                  <ArrowRight
                    size={13}
                    className="group-hover:translate-x-1 transition-transform"
                  />
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
