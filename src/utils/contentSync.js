/**
 * Real-time Cross-Tab and Cross-Window Synchronization Utility
 *
 * Ensures that whenever an admin creates, updates, or deletes content
 * in one tab, all other open tabs in the browser immediately receive
 * the notification and invalidate/update their React state and cache
 * without requiring manual user refresh.
 */

const CHANNEL_NAME = 'fikr_content_sync_channel';
const STORAGE_KEY = 'fikr_content_sync_event';

let broadcastChannel = null;

try {
  if (typeof window !== 'undefined' && 'BroadcastChannel' in window) {
    broadcastChannel = new BroadcastChannel(CHANNEL_NAME);
  }
} catch (e) {
  console.warn('[ContentSync] BroadcastChannel not supported or restricted, falling back to storage events.', e);
}

/**
 * Broadcast a content mutation event to all other open tabs/windows
 *
 * @param {Object} event
 * @param {'create'|'update'|'delete'} event.action
 * @param {'article'|'fatwa'|'book'|'lecture'|'question'|'event'} event.contentType
 * @param {string} [event.id]
 * @param {Array<string>} [event.types]
 * @param {Object} [event.item]
 */
export const broadcastContentChange = (event) => {
  if (!event || typeof window === 'undefined') return;

  const payload = {
    ...event,
    timestamp: Date.now(),
  };

  // 1. Primary: BroadcastChannel (instant in modern browsers)
  if (broadcastChannel) {
    try {
      broadcastChannel.postMessage(payload);
    } catch (err) {
      console.warn('[ContentSync] BroadcastChannel postMessage error:', err);
    }
  }

  // 2. Secondary fallback: LocalStorage storage event
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(payload));
  } catch (err) {
    // Ignore quota or private mode errors
  }
};

/**
 * Register a listener for content mutation events from other tabs
 *
 * @param {Function} onMessage - Callback receiving the event payload
 * @returns {Function} cleanup unsubscribe function
 */
export const initContentSyncListener = (onMessage) => {
  if (typeof window === 'undefined' || typeof onMessage !== 'function') {
    return () => {};
  }

  // BroadcastChannel message handler
  const handleBroadcastMessage = (event) => {
    if (event?.data) {
      onMessage(event.data);
    }
  };

  // LocalStorage storage event handler (fires only in OTHER tabs)
  const handleStorageEvent = (event) => {
    if (event.key === STORAGE_KEY && event.newValue) {
      try {
        const parsed = JSON.parse(event.newValue);
        onMessage(parsed);
      } catch (err) {
        console.warn('[ContentSync] Storage event parse error:', err);
      }
    }
  };

  if (broadcastChannel) {
    broadcastChannel.addEventListener('message', handleBroadcastMessage);
  }

  window.addEventListener('storage', handleStorageEvent);

  return () => {
    if (broadcastChannel) {
      broadcastChannel.removeEventListener('message', handleBroadcastMessage);
    }
    window.removeEventListener('storage', handleStorageEvent);
  };
};
