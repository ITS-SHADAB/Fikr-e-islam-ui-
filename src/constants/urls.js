// Dynamic resolver for LAN/mobile access (e.g. mobile testing via --host)
const resolveHost = (url) => {
  if (!url) return url;
  if (
    typeof window !== "undefined" &&
    window.location?.hostname &&
    window.location.hostname !== "localhost" &&
    window.location.hostname !== "127.0.0.1" &&
    (url.includes("127.0.0.1") || url.includes("localhost"))
  ) {
    return url.replace(/127\.0\.0\.1|localhost/, window.location.hostname);
  }
  return url;
};

// URLs
export const BACKEND_URL = resolveHost(import.meta.env.VITE_BACKEND_URL);
export const BASE_URL = resolveHost(import.meta.env.VITE_API_URL);

// Auth
export const AUTH_LOGIN = "/users/login";
export const AUTH_ME = "/users/me";
export const AUTH_REGISTER = "/users/register";
export const AUTH_LOGOUT = "/users/logout";
export const AUTH_FORGOT_PASSWORD = "/users/forgot-password";
export const AUTH_RESET_PASSWORD = "/users/reset-password";
export const AUTH_GOOGLE = `${BACKEND_URL}/api/users/google`;

// Fatwas
export const FATWAS = "/fatwas";

// Articles
export const ARTICLES = "/articles";

// Settings
export const SETTINGS = "/settings";

// Contacts
export const CONTACTS = "/contacts";

// Events
export const EVENTS = "/events";

// Questions
export const QUESTIONS = "/questions";

// Publications & Lectures
export const PUBLICATIONS = "/books";
export const LECTURES = "/lectures";

// Content Counts
export const CONTENT_COUNTS = "/content-counts";

// YouTube
export const YOUTUBE = "/youtube";

