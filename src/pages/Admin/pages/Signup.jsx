import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, Link, Navigate } from "react-router-dom";
import {
  Eye,
  EyeOff,
  AlertTriangle,
  ArrowRight,
  CheckCircle2,
} from "lucide-react";
import { register, clearAuthError } from "../../../store/slices/authSlice";

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

/* ─── Field wrapper without prefix icon ───────────────────────────────── */
function Field({ label, required, hint, error, children }) {
  return (
    <div className="space-y-1 text-left w-full">
      <label className="flex items-center text-[11px] font-bold text-slate-500 uppercase tracking-widest">
        {label}
        {required && <RequiredStar />}
        {!required && (
          <span className="ml-2 text-[9px] font-semibold text-slate-300 normal-case tracking-normal border border-slate-200 rounded px-1.5 py-0.5">
            optional
          </span>
        )}
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

/* ─── Password strength bar ───────────────────────────────────────────── */
function PasswordStrength({ password }) {
  if (!password) return null;
  let score = 0;
  if (password.length >= 6) score++;
  if (password.length >= 10) score++;
  if (/[A-Z]/.test(password)) score++;
  if (/[0-9]/.test(password)) score++;
  if (/[^A-Za-z0-9]/.test(password)) score++;

  const labels = ["", "Very Weak", "Weak", "Fair", "Strong", "Very Strong"];
  const colors = [
    "",
    "bg-red-500",
    "bg-orange-400",
    "bg-yellow-400",
    "bg-green-400",
    "bg-emerald-500",
  ];

  return (
    <div className="px-1 pt-1 space-y-1 text-left">
      <div className="flex gap-1">
        {[1, 2, 3, 4, 5].map((i) => (
          <div
            key={i}
            className={`h-1 flex-1 rounded-full transition-all duration-300 ${
              i <= score ? colors[score] : "bg-slate-150 bg-slate-200"
            }`}
          />
        ))}
      </div>
      {score > 0 && (
        <p
          className={`text-[10px] font-semibold ${
            score <= 2
              ? "text-red-500"
              : score <= 3
                ? "text-yellow-600"
                : "text-emerald-600"
          }`}
        >
          {labels[score]}
        </p>
      )}
    </div>
  );
}

export default function Signup({ isModal = false, onClose, onSwitchToLogin }) {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { isAuthenticated, loading, error, userRole } = useSelector(
    (s) => s.auth
  );

  const [name, setName] = useState("");
  const [identifier, setIdentifier] = useState("");
  const [contactPhone, setContactPhone] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPass, setShowPass] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [localError, setLocalError] = useState(null);
  const [touched, setTouched] = useState({
    name: false,
    identifier: false,
    password: false,
    confirmPassword: false,
  });

  useEffect(() => {
    dispatch(clearAuthError());
    if (isAuthenticated && isModal) {
      onClose?.();
    } else if (isAuthenticated && !isModal) {
      navigate("/");
    }
  }, [isAuthenticated, isModal, onClose, navigate, dispatch]);

  const emailRx = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const phoneRx = /^[6-9]\d{9}$/;

  const fieldErrors = {
    name:
      touched.name && !name.trim()
        ? "Full name is required."
        : touched.name && name.trim().length < 2
          ? "Name must be at least 2 characters."
          : null,
    identifier:
      touched.identifier && !identifier.trim()
        ? "Email  is required."
        : touched.identifier &&
            !emailRx.test(identifier.trim()) &&
            !phoneRx.test(identifier.trim())
          ? "Enter a valid email or 10-digit phone (starts with 6-9)."
          : null,
    password:
      touched.password && !password
        ? "Password is required."
        : touched.password && password.length < 6
          ? "Password must be at least 6 characters."
          : null,
    confirmPassword:
      touched.confirmPassword && !confirmPassword
        ? "Please confirm your password."
        : touched.confirmPassword && password !== confirmPassword
          ? "Passwords do not match."
          : null,
  };

  const handleBlur = (field) => setTouched((p) => ({ ...p, [field]: true }));

  const handleSubmit = (e) => {
    e.preventDefault();
    setLocalError(null);
    dispatch(clearAuthError());

    setTouched({
      name: true,
      identifier: true,
      password: true,
      confirmPassword: true,
    });

    if (!name.trim()) {
      setLocalError("Full name is required.");
      return;
    }
    if (name.trim().length < 2) {
      setLocalError("Name must be at least 2 characters.");
      return;
    }
    if (!identifier.trim()) {
      setLocalError("Email or phone is required.");
      return;
    }
    if (!emailRx.test(identifier.trim()) && !phoneRx.test(identifier.trim())) {
      setLocalError(
        "Please enter a valid email or 10-digit phone number starting with 6-9."
      );
      return;
    }
    if (!password) {
      setLocalError("Password is required.");
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

    const payload = {
      name: name.trim(),
      identifier: identifier.trim(),
      contactPhone: contactPhone.trim() || undefined,
      password,
    };

    dispatch(register(payload));
  };

  if (isAuthenticated && !isModal) {
    return (
      <Navigate to={userRole === "admin" ? "/admin/dashboard" : "/"} replace />
    );
  }

  const displayError = localError || error;

  return (
    <div dir="ltr" className="text-left font-sans w-full">
      <style>{`
        @keyframes pulse-star {
          0%,100% { opacity:1; transform:scale(1); }
          50%      { opacity:0.5; transform:scale(1.4); }
        }
        @keyframes fade-slide-up {
          from { opacity:0; transform:translateY(20px); }
          to   { opacity:1; transform:translateY(0); }
        }
        .signup-card { animation: fade-slide-up 0.45s cubic-bezier(.22,1,.36,1) both; }
      `}</style>

      <div
        className={`${
          isModal
            ? "p-6 sm:p-8 w-full"
            : "min-h-screen bg-background flex items-center justify-center p-4 py-10 relative overflow-hidden"
        }`}
      >
        {!isModal && (
          <>
            {/* BG blobs */}
            <div className="absolute top-[-8%] right-[-8%] w-[500px] h-[500px] bg-primary/5 rounded-full blur-[110px] pointer-events-none" />
            <div className="absolute bottom-[-8%] left-[-8%] w-[400px] h-[400px] bg-accent/7 rounded-full blur-[100px] pointer-events-none" />
          </>
        )}

        {/* Card */}
        <div
          className={`w-full ${
            !isModal
              ? "max-w-xl relative signup-card mx-auto bg-card-bg rounded-3xl shadow-2xl border border-border/40 p-6 sm:p-10"
              : ""
          }`}
        >
          {/* Header */}
          <div className="text-center mb-5">
            <h1 className="text-xl sm:text-2xl font-extrabold text-slate-800 tracking-tight">
              Create Account
            </h1>
            <p className="text-slate-500 text-xs sm:text-sm mt-1 font-light">
              Register to access your account & services
            </p>
          </div>

          {/* Global error */}
          {displayError && (
            <div className="mb-5 bg-red-50 border border-red-200 rounded-xl px-4 py-3 flex items-start gap-2.5 text-red-700 text-xs">
              <AlertTriangle
                size={15}
                className="shrink-0 mt-0.5 text-red-500"
              />
              <div>
                <span className="font-bold">Error: </span>
                {displayError}
              </div>
            </div>
          )}

          <form
            onSubmit={handleSubmit}
            noValidate
            className="space-y-4 sm:space-y-5 w-full"
          >
            {/* ── Row 1: Full Name + Contact Phone ── */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
              <Field label="Full Name" required error={fieldErrors.name}>
                <input
                  id="signup-name"
                  type="text"
                  autoComplete="name"
                  placeholder="Your full name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  onBlur={() => handleBlur("name")}
                  className="w-full bg-transparent text-sm text-slate-800 placeholder:text-slate-400 outline-none border-none ring-0 min-w-0"
                />
              </Field>

              <Field label="Contact Phone">
                <input
                  id="signup-contact-phone"
                  type="text"
                  placeholder="Secondary phone (optional)"
                  value={contactPhone}
                  onChange={(e) => setContactPhone(e.target.value)}
                  className="w-full bg-transparent text-sm text-slate-800 placeholder:text-slate-400 outline-none border-none ring-0 min-w-0"
                />
              </Field>
            </div>

            {/* ── Row 2: Email / Phone (full-width) ── */}
            <Field
              label="Email"
              required
              hint="E.g. user@domain.com"
              error={fieldErrors.identifier}
            >
              <input
                id="signup-identifier"
                type="text"
                autoComplete="username"
                placeholder="Email address"
                value={identifier}
                onChange={(e) => setIdentifier(e.target.value)}
                onBlur={() => handleBlur("identifier")}
                className="w-full bg-transparent text-sm text-slate-800 placeholder:text-slate-400 outline-none border-none ring-0 min-w-0"
              />
            </Field>

            {/* ── Row 3: Password + Confirm Password ── */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
              {/* Password */}
              <div className="space-y-1">
                <Field label="Password" required error={fieldErrors.password}>
                  <input
                    id="signup-password"
                    type={showPass ? "text" : "password"}
                    autoComplete="new-password"
                    placeholder="Min 6 characters"
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
                <PasswordStrength password={password} />
              </div>

              {/* Confirm Password */}
              <div className="space-y-1">
                <Field
                  label="Confirm Password"
                  required
                  error={fieldErrors.confirmPassword}
                >
                  <input
                    id="signup-confirm-password"
                    type={showConfirm ? "text" : "password"}
                    autoComplete="new-password"
                    placeholder="Re-type password"
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
                {confirmPassword && password === confirmPassword && (
                  <p className="text-[10px] text-emerald-600 font-semibold flex items-center gap-1 px-1">
                    <CheckCircle2 size={11} /> Passwords match
                  </p>
                )}
              </div>
            </div>

            {/* ── Submit ── */}
            <button
              id="signup-submit"
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
                  <span>Creating Account...</span>
                </>
              ) : (
                <span>Create Account</span>
              )}
            </button>
          </form>

          {/* Login link */}
          <p className="mt-5 text-center text-xs text-slate-500">
            Already have an account?{" "}
            {onSwitchToLogin ? (
              <button
                type="button"
                onClick={onSwitchToLogin}
                className="text-primary hover:text-primary/80 font-bold transition-colors underline underline-offset-2 cursor-pointer inline"
              >
                Sign in here
              </button>
            ) : (
              <span className="text-primary font-bold">Sign in here</span>
            )}
          </p>

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
  );
}
