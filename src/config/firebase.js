import { initializeApp, getApps, getApp } from "firebase/app";
import { getMessaging, isSupported } from "firebase/messaging";

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
};

// Singleton Firebase App initialization
export const app =
  getApps().length > 0 ? getApp() : initializeApp(firebaseConfig);

let messagingInstance = null;

/**
 * Check if notifications and Firebase messaging are supported in current browser
 */
export const isNotificationSupported = async () => {
  if (typeof window === "undefined") return false;
  if (!("Notification" in window)) return false;
  if (!("serviceWorker" in navigator)) return false;

  try {
    return await isSupported();
  } catch (err) {
    console.warn("FCM isSupported check failed:", err);
    return false;
  }
};

/**
 * Get or initialize Firebase Messaging instance (singleton)
 */
export const getFirebaseMessaging = async () => {
  if (messagingInstance) return messagingInstance;

  const supported = await isNotificationSupported();
  if (!supported) return null;

  try {
    messagingInstance = getMessaging(app);
    return messagingInstance;
  } catch (error) {
    console.warn("Failed to initialize Firebase Messaging:", error);
    return null;
  }
};

export default app;