import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  useRef,
} from "react";
import { useSelector } from "react-redux";
import toast from "react-hot-toast";
import {
  getNotificationPermission,
  getOrRegisterFCMToken,
  requestNotificationPermission,
  setPromptDismissed,
  isPromptDismissed,
  handleLogoutTokenReset,
  getUserNotifications,
  getUnreadCount,
  markNotificationAsRead,
  markAllNotificationsAsRead,
  getDismissedNotificationIds,
  addDismissedNotificationId,
  clearDismissedNotificationIds,
  listenToForegroundMessages,
} from "@/services/notificationService";
import {
  getAdminActivityNotifications,
  getAdminUnreadActivityCount,
  markAdminActivityNotificationAsRead,
  markAllAdminActivityNotificationsAsRead,
  deleteAdminActivityNotification,
} from "@/services/adminNotification";

const NotificationContext = createContext({
  permission: "default",
  token: null,
  notifications: [],
  unreadCount: 0,
  isLoading: false,
  isCountLoading: false,
  isRegistering: false,
  error: null,
  shouldShowPrompt: false,
  hasLoadedNotifications: false,
  refreshNotifications: async () => {},
  refreshUnreadCount: async () => {},
  markAsRead: async () => {},
  markAllAsRead: async () => {},
  dismissNotification: () => {},
  promptPermission: async () => {},
  requestPermission: async () => {},
  dismissPrompt: () => {},
  addForegroundNotification: () => {},

  // 🛡️ Dedicated Admin Notification State
  adminNotifications: [],
  adminUnreadCount: 0,
  isAdminLoading: false,
  hasLoadedAdminNotifications: false,
  refreshAdminNotifications: async () => {},
  refreshAdminUnreadCount: async () => {},
  markAdminAsRead: async () => {},
  markAllAdminAsRead: async () => {},
  dismissAdminNotification: () => {},
});

export function NotificationProvider({ children }) {
  const [permission, setPermission] = useState(() =>
    getNotificationPermission()
  );
  const [token, setToken] = useState(null);
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [isCountLoading, setIsCountLoading] = useState(false);
  const [isRegistering, setIsRegistering] = useState(false);
  const [error, setError] = useState(null);
  const [shouldShowPrompt, setShouldShowPrompt] = useState(false);
  const [hasLoadedNotifications, setHasLoadedNotifications] = useState(false);

  // 🛡️ Dedicated Admin Notification State
  const [adminNotifications, setAdminNotifications] = useState([]);
  const [adminUnreadCount, setAdminUnreadCount] = useState(0);
  const [isAdminLoading, setIsAdminLoading] = useState(false);
  const [isAdminCountLoading, setIsAdminCountLoading] = useState(false);
  const [hasLoadedAdminNotifications, setHasLoadedAdminNotifications] = useState(false);

  const { isAuthenticated, loggedInUser, userRole } = useSelector(
    (state) => state.auth || {}
  );
  const isAdmin = userRole === "admin" || loggedInUser?.role === "admin";
  const currentUserId = loggedInUser?._id || null;
  const previousAuthRef = useRef(isAuthenticated);

  /**
   * Fetch unread notification count (Authenticated users only)
   */
  const refreshUnreadCount = useCallback(async () => {
    if (!isAuthenticated) {
      setUnreadCount(0);
      return 0;
    }

    try {
      setIsCountLoading(true);
      const res = await getUnreadCount();
      if (res && typeof res.count === "number") {
        const dismissedIds = getDismissedNotificationIds();
        const adjustedCount = Math.max(0, res.count - dismissedIds.length);
        setUnreadCount(adjustedCount);
        return adjustedCount;
      }
      return 0;
    } catch (err) {
      if (process.env.NODE_ENV !== "production") {
        console.warn("Failed to fetch unread notification count:", err);
      }
      return 0;
    } finally {
      setIsCountLoading(false);
    }
  }, [isAuthenticated]);

  /**
   * Fetch unread notification history (Authenticated users only)
   * Strictly filters for isRead === false and excludes locally dismissed IDs
   */
  const refreshNotifications = useCallback(
    async ({ silent = false } = {}) => {
      if (!isAuthenticated) {
        setNotifications([]);
        setUnreadCount(0);
        return [];
      }

      try {
        if (!silent) setIsLoading(true);
        setError(null);
        const res = await getUserNotifications();
        const list = Array.isArray(res?.data) ? res.data : [];
        const dismissedIds = getDismissedNotificationIds();

        // ONLY UNREAD NOTIFICATIONS + EXCLUDE LOCALLY DISMISSED
        const unreadOnly = list.filter(
          (n) => n && !n.isRead && !dismissedIds.includes(n._id)
        );

        setNotifications(unreadOnly);
        setHasLoadedNotifications(true);

        // Keep unread count strictly aligned with visible unread items
        setUnreadCount(unreadOnly.length);
        return unreadOnly;
      } catch (err) {
        setError(err?.response?.data?.message || "Failed to load notifications.");
        if (process.env.NODE_ENV !== "production") {
          console.warn("Failed to fetch notifications:", err);
        }
        return [];
      } finally {
        if (!silent) setIsLoading(false);
      }
    },
    [isAuthenticated]
  );

  /**
   * 🛡️ Fetch unread admin activity notification count (Admin only)
   */
  const refreshAdminUnreadCount = useCallback(async () => {
    if (!isAuthenticated || !isAdmin) {
      setAdminUnreadCount(0);
      return 0;
    }

    try {
      setIsAdminCountLoading(true);
      const res = await getAdminUnreadActivityCount();
      const count =
        typeof res?.count === "number"
          ? res.count
          : typeof res?.unreadCount === "number"
          ? res.unreadCount
          : 0;
      const dismissedIds = getDismissedNotificationIds();
      const adjustedCount = Math.max(0, count - dismissedIds.length);
      setAdminUnreadCount(adjustedCount);
      return adjustedCount;
    } catch (err) {
      if (process.env.NODE_ENV !== "production") {
        console.warn("Failed to fetch admin unread count:", err);
      }
      return 0;
    } finally {
      setIsAdminCountLoading(false);
    }
  }, [isAuthenticated, isAdmin]);

  /**
   * 🛡️ Fetch admin activity notifications (Admin only)
   * Strictly filters for unread notifications and excludes locally dismissed items.
   */
  const refreshAdminNotifications = useCallback(
    async ({ silent = false } = {}) => {
      if (!isAuthenticated || !isAdmin) {
        setAdminNotifications([]);
        setAdminUnreadCount(0);
        return [];
      }

      try {
        if (!silent) setIsAdminLoading(true);
        const res = await getAdminActivityNotifications({ page: 1, limit: 30, unread: true });
        const list = Array.isArray(res?.data) ? res.data : [];
        const dismissedIds = getDismissedNotificationIds();

        // ONLY UNREAD NOTIFICATIONS + EXCLUDE LOCALLY DISMISSED
        const unreadOnly = list.filter(
          (n) => n && !n.isRead && !dismissedIds.includes(n._id)
        );

        setAdminNotifications(unreadOnly);
        setHasLoadedAdminNotifications(true);

        setAdminUnreadCount(unreadOnly.length);
        return unreadOnly;
      } catch (err) {
        if (process.env.NODE_ENV !== "production") {
          console.warn("Failed to fetch admin activity notifications:", err);
        }
        return [];
      } finally {
        if (!silent) setIsAdminLoading(false);
      }
    },
    [isAuthenticated, isAdmin]
  );

  /**
   * 🛡️ Mark single admin notification as read
   * Optimistically removes notification from visible list and decrements unread count immediately.
   */
  const markAdminAsRead = useCallback(
    async (id) => {
      if (!id || !isAuthenticated) return;

      // Optimistically remove from visible list and decrement count immediately
      setAdminNotifications((prev) => prev.filter((n) => n._id !== id));
      setAdminUnreadCount((prev) => Math.max(0, prev - 1));
      addDismissedNotificationId(id);

      const isMongoId = typeof id === "string" && /^[0-9a-fA-F]{24}$/.test(id);
      if (!isMongoId) return;

      try {
        await markAdminActivityNotificationAsRead(id);
      } catch (err) {
        if (process.env.NODE_ENV !== "production") {
          console.warn(
            "Background markAdminActivityNotificationAsRead failed:",
            id,
            err
          );
        }
      }
    },
    [isAuthenticated]
  );

  /**
   * 🛡️ Mark all admin notifications as read
   * Optimistically clears all notifications from modal and resets count to 0.
   */
  const markAllAdminAsRead = useCallback(async () => {
    if (!isAuthenticated || !isAdmin) return;
    if (adminUnreadCount === 0 && adminNotifications.length === 0) return;

    const prevNotifs = [...adminNotifications];
    const prevCount = adminUnreadCount;

    // Optimistically clear all notifications from visible list and reset count
    adminNotifications.forEach((n) => {
      if (n?._id) addDismissedNotificationId(n._id);
    });
    setAdminNotifications([]);
    setAdminUnreadCount(0);

    try {
      await markAllAdminActivityNotificationsAsRead();
    } catch (err) {
      setAdminNotifications(prevNotifs);
      setAdminUnreadCount(prevCount);
      toast.error("Could not mark all admin notifications as read.");
      if (process.env.NODE_ENV !== "production") {
        console.warn("markAllAdminAsRead failed:", err);
      }
    }
  }, [isAuthenticated, isAdmin, adminUnreadCount, adminNotifications]);

  /**
   * 🛡️ Dismiss single admin notification (Swipe, [×] click, or detail modal dismiss)
   */
  const dismissAdminNotification = useCallback(
    (id) => {
      if (!id) return;
      addDismissedNotificationId(id);
      setAdminNotifications((prev) => prev.filter((n) => n._id !== id));
      setAdminUnreadCount((prev) => Math.max(0, prev - 1));

      const isMongoId = typeof id === "string" && /^[0-9a-fA-F]{24}$/.test(id);
      if (isMongoId && isAuthenticated) {
        markAdminActivityNotificationAsRead(id).catch(() => {});
        deleteAdminActivityNotification(id).catch(() => {});
      }
    },
    [isAuthenticated]
  );

  /**
   * Mark a single notification as read (Optimistically removes from visible list & background syncs)
   */
  const markAsRead = useCallback(
    async (id) => {
      if (!id || !isAuthenticated) return;

      const target = notifications.find((n) => n._id === id);
      // Already read or not in unread list
      if (!target || target.isRead) {
        return;
      }

      // Optimistic update: IMMEDIATELY remove from unread list and decrease count
      setNotifications((prev) => prev.filter((n) => n._id !== id));
      setUnreadCount((prev) => Math.max(0, prev - 1));

      // Record in local dismissed list so it doesn't reappear on reload
      addDismissedNotificationId(id);

      // If id is not a 24-char hex ObjectId (e.g. client/foreground ID), mark read locally only
      const isMongoId = typeof id === "string" && /^[0-9a-fA-F]{24}$/.test(id);
      if (!isMongoId) {
        return;
      }

      try {
        await markNotificationAsRead(id);
      } catch (err) {
        // Backend mark failed (404 not found, network offline, 500, etc.)
        // We do NOT rollback or interrupt the user. The notification remains marked read locally.
        if (process.env.NODE_ENV !== "production") {
          console.warn("Background markNotificationAsRead failed for id:", id, err);
        }
      }
    },
    [notifications, isAuthenticated]
  );

  /**
   * Frontend-only swipe / close dismiss (persisted in sessionStorage & quietly synced to backend)
   */
  const dismissNotification = useCallback(
    (id) => {
      if (!id) return;
      addDismissedNotificationId(id);
      setNotifications((prev) => prev.filter((n) => n._id !== id));
      setUnreadCount((prev) => Math.max(0, prev - 1));

      // Quietly attempt backend mark as read if valid ObjectId
      const isMongoId = typeof id === "string" && /^[0-9a-fA-F]{24}$/.test(id);
      if (isMongoId && isAuthenticated) {
        markNotificationAsRead(id).catch((err) => {
          if (process.env.NODE_ENV !== "production") {
            console.warn("Background dismiss markNotificationAsRead error:", err);
          }
        });
      }
    },
    [isAuthenticated]
  );

  /**
   * Mark all notifications as read (Clears visible list immediately, with rollback on error)
   */
  const markAllAsRead = useCallback(async () => {
    if (!isAuthenticated) return;

    if (unreadCount === 0 && notifications.length === 0) return;

    // Optimistic state snapshot
    const prevNotifications = [...notifications];
    const prevUnreadCount = unreadCount;

    // Optimistic update: clear all unread immediately & set count to 0
    setNotifications([]);
    setUnreadCount(0);

    try {
      await markAllNotificationsAsRead();
    } catch (err) {
      // Rollback on failure
      setNotifications(prevNotifications);
      setUnreadCount(prevUnreadCount);
      toast.error("Could not mark all notifications as read. Please try again.");
      if (process.env.NODE_ENV !== "production") {
        console.warn("Mark all notifications read failed:", err);
      }
    }
  }, [isAuthenticated, unreadCount, notifications]);

  /**
   * Silent FCM token sync for granted permission
   */
  const silentSync = useCallback(async () => {
    const currentPerm = getNotificationPermission();
    setPermission(currentPerm);

    if (currentPerm === "granted") {
      try {
        setIsRegistering(true);
        const fcmToken = await getOrRegisterFCMToken({ currentUserId });
        if (fcmToken) {
          setToken(fcmToken);
        }
      } catch (err) {
        console.warn("Silent FCM token sync error:", err);
      } finally {
        setIsRegistering(false);
      }
    }
  }, [currentUserId]);

  /**
   * User-triggered permission request
   */
  const promptPermission = useCallback(async () => {
    setIsRegistering(true);
    setShouldShowPrompt(false);
    try {
      const res = await requestNotificationPermission({ currentUserId });
      setPermission(res.permission);
      if (res.token) {
        setToken(res.token);
      }
      if (res.permission === "granted" && isAuthenticated) {
        refreshUnreadCount();
      }
      return res;
    } finally {
      setIsRegistering(false);
    }
  }, [currentUserId, isAuthenticated, refreshUnreadCount]);

  /**
   * Dismiss the polite banner
   */
  const dismissPrompt = useCallback(() => {
    setPromptDismissed();
    setShouldShowPrompt(false);
  }, []);

  /**
   * Add a new foreground notification received via FCM or Service Worker
   * Immediately updates unreadCount and notifications so bell badge reflects it instantly.
   */
  const addForegroundNotification = useCallback(
    async (payload) => {
      if (!payload) return;

      const rawId =
        payload.data?.notificationId ||
        payload.data?._id ||
        payload.data?.id ||
        payload.messageId ||
        String(Date.now());

      const dismissedIds = getDismissedNotificationIds();
      if (dismissedIds.includes(rawId)) return;

      const title =
        payload.notification?.title ||
        payload.data?.title ||
        "نئی اطلاع";

      const message =
        payload.notification?.body ||
        payload.data?.message ||
        payload.data?.body ||
        "";

      const type = payload.data?.type || "announcement";
      let data = payload.data || {};
      if (typeof data === "string") {
        try {
          data = JSON.parse(data);
        } catch {
          data = {};
        }
      }

      const newNotif = {
        _id: rawId,
        title,
        message,
        type,
        data,
        isRead: false,
        readAt: null,
        createdAt: new Date().toISOString(),
      };

      // 🛡️ Admin foreground push message
      const isAdminType =
        type === "admin_question" ||
        type === "admin_comment" ||
        type === "admin_contact" ||
        (typeof type === "string" && type.startsWith("admin_"));

      if (isAdmin && isAdminType) {
        let wasAdded = false;
        setAdminNotifications((prev) => {
          const isDuplicate = prev.some((n) => {
            if (n._id === rawId) return true;
            if (
              n.title === title &&
              n.message === message &&
              Math.abs(new Date(n.createdAt).getTime() - Date.now()) < 60000
            ) {
              return true;
            }
            return false;
          });

          if (isDuplicate) return prev;
          wasAdded = true;
          return [newNotif, ...prev];
        });

        if (wasAdded) {
          setAdminUnreadCount((prev) => prev + 1);
          setHasLoadedAdminNotifications(true);
        }

        // Silently reconcile with backend admin activity endpoint
        try {
          const res = await getAdminActivityNotifications({ page: 1, limit: 30 });
          const list = Array.isArray(res?.data) ? res.data : [];
          const currentDismissed = getDismissedNotificationIds();

          const visibleFromBackend = list.filter(
            (n) => n && !currentDismissed.includes(n._id)
          );

          setAdminNotifications((prev) => {
            const merged = [...visibleFromBackend];
            prev.forEach((local) => {
              const matched = merged.some(
                (b) =>
                  b._id === local._id ||
                  (b.title === local.title &&
                    b.message === local.message &&
                    Math.abs(
                      new Date(b.createdAt).getTime() -
                        new Date(local.createdAt).getTime()
                    ) < 60000)
              );
              if (!matched && !currentDismissed.includes(local._id)) {
                merged.unshift(local);
              }
            });
            return merged;
          });

          const unreadFromBackend = visibleFromBackend.filter((n) => !n.isRead);
          setAdminUnreadCount(unreadFromBackend.length);
        } catch (err) {
          if (process.env.NODE_ENV !== "production") {
            console.warn("Silent admin reconcile with backend failed:", err);
          }
        }

        // If it's an admin-specific notification, return to avoid duplicating in user list
        if (isAdminType) {
          return;
        }
      }

      // 1. Immediately update notifications & unread count (with strict deduplication)
      let wasAdded = false;
      setNotifications((prev) => {
        const isDuplicate = prev.some((n) => {
          if (n._id === rawId) return true;
          if (
            n.title === title &&
            n.message === message &&
            Math.abs(new Date(n.createdAt).getTime() - Date.now()) < 60000
          ) {
            return true;
          }
          return false;
        });

        if (isDuplicate) {
          return prev;
        }

        wasAdded = true;
        return [newNotif, ...prev];
      });

      if (wasAdded) {
        setUnreadCount((prev) => prev + 1);
        setHasLoadedNotifications(true);
      }

      // 2. Silently reconcile with backend so temporary FCM IDs are upgraded to MongoDB ObjectIds
      if (isAuthenticated) {
        try {
          const res = await getUserNotifications();
          const list = Array.isArray(res?.data) ? res.data : [];
          const currentDismissed = getDismissedNotificationIds();

          const unreadFromBackend = list.filter(
            (n) => n && !n.isRead && !currentDismissed.includes(n._id)
          );

          setNotifications((prev) => {
            const merged = [...unreadFromBackend];
            // Ensure any recent foreground notification not yet indexed by DB is kept
            prev.forEach((local) => {
              const matchedInBackend = merged.some(
                (b) =>
                  b._id === local._id ||
                  (b.title === local.title &&
                    b.message === local.message &&
                    Math.abs(
                      new Date(b.createdAt).getTime() -
                        new Date(local.createdAt).getTime()
                    ) < 60000)
              );
              if (!matchedInBackend && !currentDismissed.includes(local._id)) {
                merged.unshift(local);
              }
            });
            return merged;
          });

          // Ensure count matches reconciled unread items
          setUnreadCount((prevCount) => {
            return Math.max(prevCount, unreadFromBackend.length);
          });
        } catch (err) {
          if (process.env.NODE_ENV !== "production") {
            console.warn("Silent reconcile with backend failed:", err);
          }
        }
      }
    },
    [isAuthenticated, isAdmin]
  );

  // Persistent real-time listener for incoming FCM notifications
  useEffect(() => {
    const unsubscribe = listenToForegroundMessages((payload) => {
      addForegroundNotification(payload);
    });
    return () => {
      if (typeof unsubscribe === "function") {
        unsubscribe();
      }
    };
  }, [addForegroundNotification]);

  // Handle tab visibility and window focus (syncs if user returns from another tab/window)
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.visibilityState === "visible" && isAuthenticated) {
        refreshUnreadCount();
        if (hasLoadedNotifications) {
          refreshNotifications({ silent: true });
        }
        if (isAdmin) {
          refreshAdminUnreadCount();
          refreshAdminNotifications({ silent: true });
        }
      }
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);
    window.addEventListener("focus", handleVisibilityChange);

    return () => {
      document.removeEventListener("visibilitychange", handleVisibilityChange);
      window.removeEventListener("focus", handleVisibilityChange);
    };
  }, [
    isAuthenticated,
    hasLoadedNotifications,
    isAdmin,
    refreshUnreadCount,
    refreshNotifications,
    refreshAdminUnreadCount,
    refreshAdminNotifications,
  ]);

  // Synchronize on mount and auth state change
  useEffect(() => {
    silentSync();

    if (isAuthenticated) {
      refreshUnreadCount();
      if (isAdmin) {
        refreshAdminUnreadCount();
        refreshAdminNotifications({ silent: true });
      }
    } else {
      setNotifications([]);
      setUnreadCount(0);
      setHasLoadedNotifications(false);
      setAdminNotifications([]);
      setAdminUnreadCount(0);
      setHasLoadedAdminNotifications(false);
      if (previousAuthRef.current) {
        handleLogoutTokenReset();
      }
    }

    previousAuthRef.current = isAuthenticated;
  }, [
    isAuthenticated,
    currentUserId,
    isAdmin,
    silentSync,
    refreshUnreadCount,
    refreshAdminUnreadCount,
    refreshAdminNotifications,
  ]);

  // Handle polite prompt appearance
  useEffect(() => {
    const currentPerm = getNotificationPermission();
    setPermission(currentPerm);

    if (currentPerm === "default" && !isPromptDismissed()) {
      const timer = setTimeout(() => {
        setShouldShowPrompt(true);
      }, 4000);
      return () => clearTimeout(timer);
    } else {
      setShouldShowPrompt(false);
    }
  }, [permission]);

  const value = {
    permission,
    token,
    notifications,
    unreadCount,
    isLoading,
    isCountLoading,
    isRegistering,
    error,
    shouldShowPrompt,
    hasLoadedNotifications,
    refreshNotifications,
    refreshUnreadCount,
    markAsRead,
    markAllAsRead,
    dismissNotification,
    promptPermission,
    requestPermission: promptPermission,
    dismissPrompt,
    addForegroundNotification,

    // 🛡️ Dedicated Admin Notification State & Actions
    adminNotifications,
    adminUnreadCount,
    isAdminLoading,
    isAdminCountLoading,
    hasLoadedAdminNotifications,
    refreshAdminNotifications,
    refreshAdminUnreadCount,
    markAdminAsRead,
    markAllAdminAsRead,
    dismissAdminNotification,
  };

  return (
    <NotificationContext.Provider value={value}>
      {children}
    </NotificationContext.Provider>
  );
}

export function useNotifications() {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error(
      "useNotifications must be used within a NotificationProvider"
    );
  }
  return context;
}

export default NotificationContext;
