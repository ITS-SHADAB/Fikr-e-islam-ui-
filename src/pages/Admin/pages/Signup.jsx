import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, Link, Navigate } from "react-router-dom";
import {
  Lock,
  Eye,
  EyeOff,
  Mail,
  Phone,
  User,
  AlertTriangle,
  ArrowRight,
  UserPlus,
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

/* ─── Field wrapper ───────────────────────────────────────────────────── */
function Field({ label, required, hint, error, icon: Icon, children }) {
  return (
    <div className="space-y-1">
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
        className={`relative flex items-center gap-3 rounded-xl px-4 py-3 border-2 bg-white
          transition-all duration-200 group
          ${
            error
              ? "border-red-400 bg-red-50/30 shadow-sm shadow-red-100"
              : "border-slate-200 focus-within:border-primary focus-within:shadow-md focus-within:shadow-primary/10"
          }`}
      >
        {Icon && (
          <Icon
            size={17}
            className={`shrink-0 transition-colors duration-200 ${
              error
                ? "text-red-400"
                : "text-slate-400 group-focus-within:text-primary"
            }`}
          />
        )}
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
    <div className="px-1 pt-1 space-y-1">
      <div className="flex gap-1">
        {[1, 2, 3, 4, 5].map((i) => (
          <div
            key={i}
            className={`h-1 flex-1 rounded-full transition-all duration-300 ${
              i <= score ? colors[score] : "bg-slate-200"
            }`}
          />
        ))}
      </div>
      <p
        className={`text-[10px] font-semibold ${score <= 2 ? "text-red-400" : score <= 3 ? "text-yellow-500" : "text-emerald-600"}`}
      >
        {labels[score]}
      </p>
    </div>
  );
}

export default function Signup() {
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
    if (isAuthenticated) {
      navigate("/");
    }
  }, [isAuthenticated, navigate, dispatch]);

  const emailRx = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const phoneRx = /^[6-9]\d{9}$/;

  const fieldErrors = {
    name:
      touched.name && name.trim().length < 2
        ? "Full name must be at least 2 characters."
        : null,
    identifier:
      touched.identifier && !identifier.trim()
        ? "Email or phone is required."
        : touched.identifier &&
            !emailRx.test(identifier.trim()) &&
            !phoneRx.test(identifier.trim())
          ? "Enter a valid email or 10-digit phone (starts 6-9)."
          : null,
    password:
      touched.password && password.length < 6
        ? "Password must be at least 6 characters."
        : null,
    confirmPassword:
      touched.confirmPassword && password !== confirmPassword
        ? "Passwords do not match."
        : null,
  };

  const handleBlur = (f) => setTouched((p) => ({ ...p, [f]: true }));

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

    if (!name || name.trim().length < 2) {
      setLocalError("Full name must be at least 2 characters.");
      return;
    }
    if (!identifier.trim()) {
      setLocalError("Email or phone is required.");
      return;
    }
    if (!emailRx.test(identifier.trim()) && !phoneRx.test(identifier.trim())) {
      setLocalError(
        "Enter a valid email or 10-digit phone number starting with 6-9."
      );
      return;
    }
    if (contactPhone && !phoneRx.test(contactPhone.trim())) {
      setLocalError(
        "Contact phone must be a 10-digit number starting with 6-9."
      );
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

    dispatch(
      register({
        name: name.trim(),
        identifier: identifier.trim(),
        contactPhone: contactPhone.trim(),
        password,
      })
    );
  };

  if (isAuthenticated) {
    return (
      <Navigate to={userRole === "admin" ? "/admin/dashboard" : "/"} replace />
    );
  }

  const displayError = localError || error;

  return (
    <>
      <style>{`
        @keyframes pulse-star {
          0%,100% { opacity:1; transform:scale(1); }
          50%      { opacity:0.5; transform:scale(1.4); }
        }
        @keyframes float-icon {
          0%,100% { transform: translateY(0px) rotate(0deg); }
          33%      { transform: translateY(-5px) rotate(-3deg); }
          66%      { transform: translateY(-2px) rotate(2deg); }
        }
        @keyframes ring-orbit {
          to { transform: rotate(360deg); }
        }
        @keyframes fade-slide-up {
          from { opacity:0; transform:translateY(20px); }
          to   { opacity:1; transform:translateY(0); }
        }
        .signup-card { animation: fade-slide-up 0.45s cubic-bezier(.22,1,.36,1) both; }
        .icon-float  { animation: float-icon 3.2s ease-in-out infinite; }
        .orbit-ring  { animation: ring-orbit 3s linear infinite; transform-origin: center; }
      `}</style>

      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-indigo-50/40 flex items-center justify-center p-4 py-10 relative overflow-hidden">
        {/* BG blobs */}
        <div className="absolute top-[-8%] right-[-8%] w-[500px] h-[500px] bg-primary/5 rounded-full blur-[110px] pointer-events-none" />
        <div className="absolute bottom-[-8%] left-[-8%] w-[400px] h-[400px] bg-accent/7 rounded-full blur-[100px] pointer-events-none" />

        {/* Card — wider to fit 2-column grid */}
        <div className="w-full max-w-2xl relative signup-card">
          {/* Header */}
          <div className="text-center mb-7">
            <div className="inline-flex items-center justify-center w-20 h-20 mb-4 relative">
              <svg
                className="absolute inset-0 w-full h-full orbit-ring"
                viewBox="0 0 80 80"
              >
                <circle
                  cx="40"
                  cy="40"
                  r="36"
                  fill="none"
                  stroke="#10b981"
                  strokeWidth="2.5"
                  strokeDasharray="20 206"
                  strokeLinecap="round"
                />
              </svg>
              <div className="w-[68px] h-[68px] rounded-full bg-gradient-to-br from-primary to-primary/70 shadow-xl shadow-primary/30 flex items-center justify-center icon-float">
                <UserPlus className="w-7 h-7 text-white" strokeWidth={2.2} />
              </div>
            </div>
            <h1 className="text-3xl font-extrabold text-slate-800 tracking-tight">
              Create Account
            </h1>
            <p className="text-slate-500 text-sm mt-1 font-light">
              Register to access the Scholar Portal
            </p>
          </div>

          {/* Card body */}
          <div className="bg-white/80 backdrop-blur-xl rounded-3xl shadow-2xl shadow-slate-200/80 border border-white/70 p-8 sm:p-10">
            {/* Global error */}
            {displayError && (
              <div className="mb-6 bg-red-50 border border-red-200 rounded-xl px-4 py-3 flex items-start gap-2.5 text-red-700 text-xs">
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

            <form onSubmit={handleSubmit} noValidate className="space-y-5">
              {/* ── Row 1: Full Name + Contact Phone ── */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Field
                  label="Full Name"
                  required
                  error={fieldErrors.name}
                  icon={User}
                >
                  <input
                    id="signup-name"
                    type="text"
                    autoComplete="name"
                    placeholder="Your full name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    onBlur={() => handleBlur("name")}
                    className="flex-1 bg-transparent text-sm text-slate-800 placeholder:text-slate-400 outline-none border-none ring-0 min-w-0"
                  />
                </Field>

                <Field label="Contact Phone" icon={Phone}>
                  <input
                    id="signup-contact-phone"
                    type="text"
                    placeholder="Secondary phone (optional)"
                    value={contactPhone}
                    onChange={(e) => setContactPhone(e.target.value)}
                    className="flex-1 bg-transparent text-sm text-slate-800 placeholder:text-slate-400 outline-none border-none ring-0 min-w-0"
                  />
                </Field>
              </div>

              {/* ── Row 2: Email / Phone (full-width) ── */}
              <Field
                label="Email or Login Phone"
                required
                hint="E.g. user@domain.com or 9876543210 (starts with 6-9)"
                error={fieldErrors.identifier}
                icon={Mail}
              >
                <input
                  id="signup-identifier"
                  type="text"
                  autoComplete="username"
                  placeholder="Email address or 10-digit phone number"
                  value={identifier}
                  onChange={(e) => setIdentifier(e.target.value)}
                  onBlur={() => handleBlur("identifier")}
                  className="flex-1 bg-transparent text-sm text-slate-800 placeholder:text-slate-400 outline-none border-none ring-0 min-w-0"
                />
              </Field>

              {/* ── Row 3: Password + Confirm Password ── */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Password */}
                <div className="space-y-1">
                  <Field
                    label="Password"
                    required
                    error={fieldErrors.password}
                    icon={Lock}
                  >
                    <input
                      id="signup-password"
                      type={showPass ? "text" : "password"}
                      autoComplete="new-password"
                      placeholder="Min 6 characters"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      onBlur={() => handleBlur("password")}
                      className="flex-1 bg-transparent text-sm text-slate-800 placeholder:text-slate-400 outline-none border-none ring-0 min-w-0"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPass(!showPass)}
                      className="text-slate-400 hover:text-primary transition-colors shrink-0 focus:outline-none"
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
                    icon={
                      confirmPassword && password === confirmPassword
                        ? CheckCircle2
                        : Lock
                    }
                  >
                    <input
                      id="signup-confirm-password"
                      type={showConfirm ? "text" : "password"}
                      autoComplete="new-password"
                      placeholder="Re-type password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      onBlur={() => handleBlur("confirmPassword")}
                      className="flex-1 bg-transparent text-sm text-slate-800 placeholder:text-slate-400 outline-none border-none ring-0 min-w-0"
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirm(!showConfirm)}
                      className="text-slate-400 hover:text-primary transition-colors shrink-0 focus:outline-none"
                      aria-label={
                        showConfirm ? "Hide password" : "Show password"
                      }
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
                className="w-full py-3.5 bg-gradient-to-r from-primary to-primary/85 hover:from-primary/90 hover:to-primary text-white font-bold rounded-xl shadow-lg shadow-primary/25 hover:shadow-xl hover:shadow-primary/30 hover:-translate-y-0.5 transition-all duration-200 text-sm tracking-wide flex items-center justify-center gap-2.5 disabled:opacity-60 disabled:pointer-events-none"
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
                  <>
                    <UserPlus size={16} />
                    <span>Create Account</span>
                  </>
                )}
              </button>
            </form>

            {/* Login link */}
            <p className="mt-6 text-center text-xs text-slate-500">
              Already have an account?{" "}
              <Link
                to="/login"
                className="text-primary hover:text-primary/80 font-bold transition-colors underline underline-offset-2"
              >
                Sign in here
              </Link>
            </p>
          </div>

          {/* Back link */}
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
        </div>
      </div>
    </>
  );
}
