import { getToken, onMessage } from "firebase/messaging";
import API from "@/services/api";
import {
  getFirebaseMessaging,
  isNotificationSupported,
} from "@/config/firebase";

const VAPID_KEY = import.meta.env.VITE_FIREBASE_VAPID_KEY;
const STORAGE_DISMISSED_KEY = "fikr_notification_prompt_dismissed_at";
const STORAGE_TOKEN_KEY = "fikr_fcm_token";
const STORAGE_SYNCED_USER_KEY = "fikr_fcm_synced_user";

// In-memory cache to avoid duplicate API calls during session
let lastRegisteredToken = null;
let lastSyncedUserId = null;
let swRegistrationPromise = null;
let inFlightSyncPromise = null;

/**
 * Get current browser notification permission state
 * @returns {'granted' | 'denied' | 'default' | 'unsupported'}
 */
export const getNotificationPermission = () => {
  if (typeof window === "undefined" || !("Notification" in window)) {
    return "unsupported";
  }
  return Notification.permission;
};

/**
 * Check if the subtle permission prompt was recently dismissed
 * @param {number} cooldownDays - Days before asking again (default 14)
 */
export const isPromptDismissed = (cooldownDays = 14) => {
  try {
    const raw = localStorage.getItem(STORAGE_DISMISSED_KEY);
    if (!raw) return false;
    const dismissedTime = parseInt(raw, 10);
    if (isNaN(dismissedTime)) return false;
    const elapsed = Date.now() - dismissedTime;
    return elapsed < cooldownDays * 24 * 60 * 60 * 1000;
  } catch {
    return false;
  }
};

/**
 * Record that user dismissed the subtle prompt
 */
export const setPromptDismissed = () => {
  try {
    localStorage.setItem(STORAGE_DISMISSED_KEY, String(Date.now()));
  } catch (err) {
    console.warn("Could not save dismissed state:", err);
  }
};

/**
 * Clear prompt dismissal state
 */
export const clearPromptDismissed = () => {
  try {
    localStorage.removeItem(STORAGE_DISMISSED_KEY);
  } catch (err) {
    console.warn("Could not clear dismissed state:", err);
  }
};

/**
 * Register the Firebase Messaging service worker once (singleton promise)
 */
export const registerServiceWorker = async () => {
  if (typeof window === "undefined" || !("serviceWorker" in navigator)) {
    return null;
  }

  if (swRegistrationPromise) return swRegistrationPromise;

  swRegistrationPromise = (async () => {
    try {
      const existing = await navigator.serviceWorker.getRegistration(
        "/firebase-messaging-sw.js"
      );
      if (existing) {
        return existing;
      }

      const registration = await navigator.serviceWorker.register(
        "/firebase-messaging-sw.js",
        { scope: "/" }
      );
      return registration;
    } catch (err) {
      console.warn("Service worker registration failed:", err);
      swRegistrationPromise = null;
      return null;
    }
  })();

  return swRegistrationPromise;
};

/**
 * Retrieve the FCM registration token from Firebase Messaging
 */
export const getFCMToken = async () => {
  try {
    const supported = await isNotificationSupported();
    if (!supported) return null;

    if (getNotificationPermission() !== "granted") {
      return null;
    }

    const messaging = await getFirebaseMessaging();
    if (!messaging) return null;

    if (!VAPID_KEY) {
      console.warn("VITE_FIREBASE_VAPID_KEY is not configured.");
      return null;
    }

    const serviceWorkerRegistration = await registerServiceWorker();
    if (!serviceWorkerRegistration) return null;

    const token = await getToken(messaging, {
      vapidKey: VAPID_KEY,
      serviceWorkerRegistration,
    });

    if (token) {
      try {
        localStorage.setItem(STORAGE_TOKEN_KEY, token);
      } catch {}
    }

    return token;
  } catch (error) {
    console.warn("Failed to obtain FCM token:", error);
    return null;
  }
};

/**
 * API 1: Register / Update FCM Token
 * POST /api/notifications/register
 * Sends session cookies automatically via withCredentials: true.
 * Backend's optionalUser binds user if logged in, or registers guest token if user: null.
 */
export const registerFCMToken = async (token) => {
  if (!token) return null;
  const response = await API.post("/notifications/register", { token });
  return response.data;
};

// Backward-compatible alias
export const registerFCMTokenApi = registerFCMToken;

/**
 * Safely syncs the token with backend, preventing duplicate network requests
 */
export const syncFCMTokenWithBackend = async (
  token,
  currentUserId = null,
  force = false
) => {
  if (!token) return false;

  const userKey = currentUserId ? String(currentUserId) : "guest";
  const storedUser = localStorage.getItem(STORAGE_SYNCED_USER_KEY);
  const storedToken = localStorage.getItem(STORAGE_TOKEN_KEY);

  if (
    !force &&
    lastRegisteredToken === token &&
    lastSyncedUserId === userKey &&
    storedUser === userKey &&
    storedToken === token
  ) {
    return true;
  }

  if (inFlightSyncPromise) return inFlightSyncPromise;

  inFlightSyncPromise = (async () => {
    try {
      await registerFCMToken(token);
      lastRegisteredToken = token;
      lastSyncedUserId = userKey;
      try {
        localStorage.setItem(STORAGE_SYNCED_USER_KEY, userKey);
        localStorage.setItem(STORAGE_TOKEN_KEY, token);
      } catch {}
      return true;
    } catch (err) {
      console.warn("Failed to sync FCM token with backend:", err);
      return false;
    } finally {
      inFlightSyncPromise = null;
    }
  })();

  return inFlightSyncPromise;
};

/**
 * Silently obtain or refresh FCM token if permission is already granted.
 * Does NOT prompt or show UI.
 */
export const getOrRegisterFCMToken = async ({
  currentUserId = null,
  force = false,
} = {}) => {
  const perm = getNotificationPermission();
  if (perm !== "granted") {
    return null;
  }

  const token = await getFCMToken();
  if (!token) return null;

  await syncFCMTokenWithBackend(token, currentUserId, force);
  return token;
};

// Backward-compatible alias
export const initAndSyncFCM = getOrRegisterFCMToken;

/**
 * Request notification permission via native dialog (must be called from user click)
 */
export const requestNotificationPermission = async ({
  currentUserId = null,
} = {}) => {
  if (typeof window === "undefined" || !("Notification" in window)) {
    return { permission: "unsupported", token: null };
  }

  try {
    const permission = await Notification.requestPermission();

    if (permission === "granted") {
      clearPromptDismissed();
      const token = await getOrRegisterFCMToken({ currentUserId, force: true });
      return { permission: "granted", token };
    } else {
      setPromptDismissed();
      return { permission, token: null };
    }
  } catch (error) {
    console.warn("Error requesting notification permission:", error);
    return { permission: "denied", token: null };
  }
};

const STORAGE_DISMISSED_IDS_KEY = "notification_dismissed_ids";

/**
 * Retrieve list of locally dismissed notification IDs
 */
export const getDismissedNotificationIds = () => {
  if (typeof window === "undefined") return [];
  try {
    const raw = sessionStorage.getItem(STORAGE_DISMISSED_IDS_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
};

/**
 * Add a notification ID to the locally dismissed list (frontend-only swipe/dismiss)
 */
export const addDismissedNotificationId = (id) => {
  if (!id || typeof window === "undefined") return;
  try {
    const current = getDismissedNotificationIds();
    if (!current.includes(id)) {
      // Retain latest 150 IDs to prevent storage bloat
      const updated = [...current, id].slice(-150);
      sessionStorage.setItem(STORAGE_DISMISSED_IDS_KEY, JSON.stringify(updated));
    }
  } catch {}
};

/**
 * Clear locally dismissed notification IDs
 */
export const clearDismissedNotificationIds = () => {
  if (typeof window === "undefined") return;
  try {
    sessionStorage.removeItem(STORAGE_DISMISSED_IDS_KEY);
  } catch {}
};

/**
 * Reset token cache on logout
 */
export const handleLogoutTokenReset = () => {
  lastSyncedUserId = null;
  try {
    localStorage.removeItem(STORAGE_SYNCED_USER_KEY);
  } catch {}
  clearDismissedNotificationIds();
};

// Global subscriber registry for incoming push notifications (singleton pattern)
const foregroundListeners = new Set();
let isForegroundListenerBound = false;

/**
 * Listen for foreground push notifications (when website is open)
 * Dispatches to all active subscribers and supports both FCM onMessage
 * and Service Worker postMessage (for background tab wakeups).
 */
export const listenToForegroundMessages = (onReceive) => {
  if (typeof onReceive !== "function") return () => {};

  foregroundListeners.add(onReceive);

  if (!isForegroundListenerBound) {
    isForegroundListenerBound = true;

    // 1. Firebase JS SDK onMessage (for active focused tab)
    getFirebaseMessaging()
      .then((messaging) => {
        if (!messaging) return;
        try {
          onMessage(messaging, (payload) => {
            foregroundListeners.forEach((listener) => {
              try {
                listener(payload);
              } catch (err) {
                console.warn("Foreground message subscriber error:", err);
              }
            });
          });
        } catch (err) {
          console.warn("FCM onMessage setup failed:", err);
        }
      })
      .catch((err) => {
        console.warn("getFirebaseMessaging failed in listener:", err);
      });

    // 2. Service Worker postMessage (for background -> foreground tab sync)
    if (typeof window !== "undefined" && "serviceWorker" in navigator) {
      navigator.serviceWorker.addEventListener("message", (event) => {
        if (event.data?.type === "FCM_FOREGROUND_MESSAGE" && event.data?.payload) {
          foregroundListeners.forEach((listener) => {
            try {
              listener(event.data.payload);
            } catch (err) {
              console.warn("Service worker message subscriber error:", err);
            }
          });
        }
      });
    }
  }

  return () => {
    foregroundListeners.delete(onReceive);
  };
};

/**
 * API 2: Get Notifications
 * GET /api/notifications
 * Requires authentication. Returns { success: true, count, data: [...] }
 */
export const getUserNotifications = async () => {
  const response = await API.get("/notifications");
  return response.data;
};

/**
 * API 3: Get Unread Count
 * GET /api/notifications/unread-count
 * Requires authentication. Returns { success: true, count: number }
 */
export const getUnreadCount = async () => {
  const response = await API.get("/notifications/unread-count");
  return response.data;
};

// Backward-compatible alias
export const getUnreadNotificationCount = getUnreadCount;

/**
 * API 4: Mark Single Notification as Read
 * PATCH /api/notifications/:id/read
 * Requires authentication. Returns { success: true, message, data: notification }
 */
export const markNotificationAsRead = async (id) => {
  if (!id) return null;
  const response = await API.patch(`/notifications/${id}/read`);
  return response.data;
};

/**
 * API 5: Mark All Notifications as Read
 * PATCH /api/notifications/read-all
 * Requires authentication. Returns { success: true, message, modifiedCount }
 */
export const markAllNotificationsAsRead = async () => {
  const response = await API.patch("/notifications/read-all");
  return response.data;
};

/**
 * Resolve target URL from notification object or payload data.
 * Checks explicit link/url, type, slug, and content IDs.
 */
export const getNotificationTargetUrl = (notification) => {
  if (!notification) return null;
  let data = notification.data || {};
  if (typeof data === "string") {
    try {
      data = JSON.parse(data);
    } catch {
      data = {};
    }
  }

  // 1. Explicit link / url / target / route
  if (data.link && typeof data.link === "string") return data.link;
  if (data.url && typeof data.url === "string") return data.url;
  if (data.target && typeof data.target === "string") return data.target;
  if (data.route && typeof data.route === "string") return data.route;

  // 2. Type and ID / slug mappings
  const type = (notification.type || data.type || "").toLowerCase();
  const slug = data.slug || data.articleSlug || data.fatwaSlug || data.bookSlug;
  const id =
    data.id ||
    data._id ||
    data.articleId ||
    data.fatwaId ||
    data.questionId ||
    data.bookId ||
    data.publicationId;

  if (type === "article" || type === "articles" || data.articleId) {
    return slug ? `/articles/${slug}` : id ? `/articles/${id}` : "/articles";
  }
  if (type === "fatwa" || type === "fatwas" || data.fatwaId) {
    return slug ? `/fatwas/${slug}` : id ? `/fatwas/${id}` : "/fatwas";
  }
  if (type === "qa" || type === "question" || type === "ask" || data.questionId) {
    return slug ? `/qa/${slug}` : id ? `/qa/${id}` : "/qa";
  }
  if (
    type === "book" ||
    type === "publication" ||
    type === "publications" ||
    data.bookId
  ) {
    return slug ? `/publications/${slug}` : id ? `/publications/${id}` : "/publications";
  }
  if (type === "lecture" || type === "lectures") {
    return "/lectures";
  }
  if (type === "event" || type === "events") {
    return "/events";
  }
  if (type === "profile" || type === "account" || type === "user") {
    return "/my-details";
  }

  return null;
};

/**
 * Format timestamp into friendly relative time (Urdu & English)
 */
export const formatNotificationTime = (dateString, isUrdu = true) => {
  if (!dateString) return "";
  try {
    const date = new Date(dateString);
    const now = new Date();
    const diffInSeconds = Math.max(0, Math.floor((now - date) / 1000));

    if (diffInSeconds < 60) {
      return isUrdu ? "ابھی ابھی" : "Just now";
    }
    const diffInMinutes = Math.floor(diffInSeconds / 60);
    if (diffInMinutes < 60) {
      return isUrdu ? `${diffInMinutes} منٹ پہلے` : `${diffInMinutes}m ago`;
    }
    const diffInHours = Math.floor(diffInMinutes / 60);
    if (diffInHours < 24) {
      return isUrdu ? `${diffInHours} گھنٹے پہلے` : `${diffInHours}h ago`;
    }
    const diffInDays = Math.floor(diffInHours / 24);
    if (diffInDays === 1) {
      return isUrdu ? "کل" : "Yesterday";
    }
    if (diffInDays < 7) {
      return isUrdu ? `${diffInDays} دن پہلے` : `${diffInDays}d ago`;
    }
    return date.toLocaleDateString(isUrdu ? "ur-PK" : "en-US", {
      month: "short",
      day: "numeric",
    });
  } catch {
    return "";
  }
};

export {
  sendAdminNotification,
  getAdminNotificationStats,
  getAdminNotificationCampaigns,
  getAdminNotificationCampaign,
  getAdminNotificationHistory,
  getAdminNotificationDetails,
} from "./adminNotification";