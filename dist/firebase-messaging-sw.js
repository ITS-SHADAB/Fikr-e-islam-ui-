/* eslint-disable no-undef */
importScripts(
  "https://www.gstatic.com/firebasejs/10.14.1/firebase-app-compat.js"
);
importScripts(
  "https://www.gstatic.com/firebasejs/10.14.1/firebase-messaging-compat.js"
);

// Firebase configuration matching project credentials
firebase.initializeApp({
  apiKey: "AIzaSyAlqH3uozP4TniAbA4gq8TUJOUETPv85Ds",
  authDomain: "fikr-e-islam-efebd.firebaseapp.com",
  projectId: "fikr-e-islam-efebd",
  storageBucket: "fikr-e-islam-efebd.firebasestorage.app",
  messagingSenderId: "601539036333",
  appId: "1:601539036333:web:ab868ff4617356fc2a7224",
});

const messaging = firebase.messaging();

/**
 * Handle background push messages
 */
messaging.onBackgroundMessage((payload) => {
  const notificationTitle =
    payload.notification?.title ||
    payload.data?.title ||
    "فکرِ اسلام (Fikr-e-Islam)";

  const notificationBody =
    payload.notification?.body ||
    payload.data?.message ||
    payload.data?.body ||
    "";

  const targetLink = payload.data?.link || payload.data?.url || "/";

  const notificationOptions = {
    body: notificationBody,
    icon: payload.notification?.icon || "/favicon.ico",
    badge: "/favicon.ico",
    data: {
      url: targetLink,
      ...payload.data,
    },
    dir: "rtl",
    lang: "ur",
  };

  // Broadcast to open client windows so open tabs immediately update their bell badge & dropdown
  if (self.clients && self.clients.matchAll) {
    self.clients
      .matchAll({ type: "window", includeUncontrolled: true })
      .then((windowClients) => {
        for (const client of windowClients) {
          client.postMessage({
            type: "FCM_FOREGROUND_MESSAGE",
            payload,
          });
        }
      })
      .catch(() => {});
  }

  return self.registration.showNotification(
    notificationTitle,
    notificationOptions
  );
});

/**
 * Handle notification click in OS / browser tray
 */
self.addEventListener("notificationclick", (event) => {
  event.notification.close();

  const targetUrl = event.notification.data?.url || "/";
  const absoluteUrl = new URL(targetUrl, self.location.origin).href;

  event.waitUntil(
    clients
      .matchAll({ type: "window", includeUncontrolled: true })
      .then((windowClients) => {
        // Focus existing open window if available
        for (const client of windowClients) {
          if (client.url && "focus" in client) {
            client.navigate(absoluteUrl);
            return client.focus();
          }
        }
        // If no open window, open a new window
        if (clients.openWindow) {
          return clients.openWindow(absoluteUrl);
        }
      })
  );
});