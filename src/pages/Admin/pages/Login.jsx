import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, Link, Navigate } from "react-router-dom";
import {
  Lock,
  Eye,
  EyeOff,
  Mail,
  AlertTriangle,
  ArrowRight,
  ShieldCheck,
} from "lucide-react";
import { login, clearAuthError } from "../../../store/slices/authSlice";

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

/* ─── Field wrapper with animated border ─────────────────────────────── */
function Field({ label, required, hint, error, icon: Icon, children }) {
  return (
    <div className="space-y-1">
      <label className="flex items-center text-[11px] font-bold text-slate-500 uppercase tracking-widest">
        {label}
        {required && <RequiredStar />}
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

export default function Login() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { isAuthenticated, loading, error, userRole } = useSelector(
    (s) => s.auth
  );

  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const [showPass, setShowPass] = useState(false);
  const [touched, setTouched] = useState({
    identifier: false,
    password: false,
  });
  const [localError, setLocalError] = useState(null);

  /* Redirect after auth */
  useEffect(() => {
    dispatch(clearAuthError());
    // if (isAuthenticated) {
    //   navigate(userRole === 'admin' ? '/admin/dashboard' : '/');
    // }
  }, [isAuthenticated, userRole, navigate, dispatch]);

  /* Per-field inline validation */
  const emailRx = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const phoneRx = /^[6-9]\d{9}$/;

  const fieldErrors = {
    identifier:
      touched.identifier && !identifier.trim()
        ? "Email or phone is required."
        : touched.identifier &&
            !emailRx.test(identifier.trim()) &&
            !phoneRx.test(identifier.trim())
          ? "Enter a valid email or 10-digit phone (starts with 6-9)."
          : null,
    password: touched.password && !password ? "Password is required." : null,
  };

  const handleBlur = (field) => setTouched((p) => ({ ...p, [field]: true }));

  const handleSubmit = (e) => {
    e.preventDefault();
    setLocalError(null);
    dispatch(clearAuthError());

    /* Mark all touched for full-form validation display */
    setTouched({ identifier: true, password: true });

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

    dispatch(login({ username: identifier.trim(), password }));
  };

  if (isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  const displayError = localError || error;

  return (
    <>
      {/* keyframe injection */}
      <style>{`
        @keyframes pulse-star {
          0%,100% { opacity:1; transform:scale(1); }
          50%      { opacity:0.5; transform:scale(1.4); }
        }
        @keyframes float-icon {
          0%,100% { transform: translateY(0px) rotate(0deg); }
          33%      { transform: translateY(-6px) rotate(-4deg); }
          66%      { transform: translateY(-3px) rotate(3deg); }
        }
        @keyframes spin-ring {
          to { stroke-dashoffset: -283; }
        }
        @keyframes fade-slide-up {
          from { opacity:0; transform:translateY(18px); }
          to   { opacity:1; transform:translateY(0); }
        }
        .login-card { animation: fade-slide-up 0.45s cubic-bezier(.22,1,.36,1) both; }
        .icon-float { animation: float-icon 3s ease-in-out infinite; }
        .ring-spin  { animation: spin-ring 1.4s linear infinite; }
      `}</style>

      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100 flex items-center justify-center p-4 relative overflow-hidden">
        {/* Background blobs */}
        <div className="absolute top-[-10%] right-[-10%] w-[480px] h-[480px] bg-primary/6 rounded-full blur-[100px] pointer-events-none" />
        <div className="absolute bottom-[-10%] left-[-10%] w-[380px] h-[380px] bg-accent/8 rounded-full blur-[90px] pointer-events-none" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-slate-200/40 rounded-full blur-[120px] pointer-events-none" />

        <div className="w-full max-w-md relative login-card">
          {/* Icon header */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-gradient-to-br from-primary to-primary/70 shadow-xl shadow-primary/30 mb-4 icon-float relative">
              <Lock className="w-8 h-8 text-white" strokeWidth={2.5} />
              {/* Animated ring */}
              <svg
                className="absolute inset-0 w-full h-full -rotate-90"
                viewBox="0 0 80 80"
              >
                <circle
                  cx="40"
                  cy="40"
                  r="36"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeDasharray="226 226"
                  strokeDashoffset="0"
                  className="text-white/20"
                />
                <circle
                  cx="40"
                  cy="40"
                  r="36"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeDasharray="56 226"
                  strokeLinecap="round"
                  className="text-white/70 ring-spin"
                />
              </svg>
            </div>
            <h1 className="text-3xl font-extrabold text-slate-800 tracking-tight">
              Welcome Back
            </h1>
            <p className="text-slate-500 text-sm mt-1 font-light">
              Sign in to access the Admin Portal
            </p>
          </div>

          {/* Card */}
          <div className="bg-white/80 backdrop-blur-xl rounded-3xl shadow-2xl shadow-slate-200/80 border border-white/70 p-8">
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

            <form onSubmit={handleSubmit} noValidate className="space-y-5">
              {/* Identifier */}
              <Field
                label="Email or Phone"
                required
                hint="E.g. admin@portal.com or 9876543210"
                error={fieldErrors.identifier}
                icon={Mail}
              >
                <input
                  id="login-identifier"
                  type="text"
                  autoComplete="username"
                  placeholder="Enter email or phone number"
                  value={identifier}
                  onChange={(e) => setIdentifier(e.target.value)}
                  onBlur={() => handleBlur("identifier")}
                  className="flex-1 bg-transparent text-sm text-slate-800 placeholder:text-slate-400 outline-none border-none ring-0 min-w-0"
                />
              </Field>

              {/* Password */}
              <Field
                label="Password"
                required
                error={fieldErrors.password}
                icon={Lock}
              >
                <input
                  id="login-password"
                  type={showPass ? "text" : "password"}
                  autoComplete="current-password"
                  placeholder="Enter your password"
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

              {/* Submit */}
              <button
                id="login-submit"
                type="submit"
                disabled={loading}
                className="w-full py-3.5 mt-2 bg-gradient-to-r from-primary to-primary/85 hover:from-primary/90 hover:to-primary text-white font-bold rounded-xl shadow-lg shadow-primary/25 hover:shadow-xl hover:shadow-primary/30 hover:-translate-y-0.5 transition-all duration-200 text-sm tracking-wide flex items-center justify-center gap-2.5 disabled:opacity-60 disabled:pointer-events-none"
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
                    <span>Authenticating...</span>
                  </>
                ) : (
                  <>
                    <ShieldCheck size={16} />
                    <span>Sign In</span>
                  </>
                )}
              </button>
            </form>

            {/* Register link */}
            <p className="mt-6 text-center text-xs text-slate-500">
              Don&apos;t have an account?{" "}
              <Link
                to="/signup"
                className="text-primary hover:text-primary/80 font-bold transition-colors underline underline-offset-2"
              >
                Create one here
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
