/**
 * Utility functions for generating, sharing, and copying short URLs.
 */

/**
 * Returns the origin URL safely (e.g. https://muftifaizansarwar.in or http://localhost:5173).
 */
export const getOrigin = () => {
  if (typeof window !== "undefined" && window.location?.origin) {
    return window.location.origin;
  }
  return "https://muftifaizansarwar.in";
};

/**
 * Builds the canonical short share URL for a fatwa or article.
 * Format:
 *   Fatwas:   https://muftifaizansarwar.in/f/:shortCode
 *   Articles: https://muftifaizansarwar.in/a/:shortCode
 *
 * If shortCode is not yet available, falls back safely to canonical route with slug.
 *
 * @param {'fatwa'|'article'} type
 * @param {object} item
 * @returns {string}
 */
export const getShareUrl = (type, item) => {
  const origin = getOrigin();
  const prefix = type === "fatwa" ? "f" : "a";

  if (item?.shortCode) {
    return `${origin}/${prefix}/${item.shortCode}`;
  }

  // Fallback if item is loaded without shortCode yet
  const canonicalFolder = type === "fatwa" ? "fatwas" : "articles";
  const identifier = item?.slug || item?._id || "";
  return `${origin}/${canonicalFolder}/${identifier}`;
};

/**
 * Checks if the browser supports native Web Share API.
 * @returns {boolean}
 */
export const canNativeShare = () => {
  return typeof navigator !== "undefined" && typeof navigator.share === "function";
};

/**
 * Triggers native share sheet with the given title and short URL.
 * @param {{ title: string, text?: string, url: string }} options
 * @returns {Promise<boolean>} True if shared successfully, false if cancelled/unsupported
 */
export const triggerNativeShare = async ({ title, text, url }) => {
  if (!canNativeShare()) return false;

  try {
    await navigator.share({
      title: title || "فکرِ اسلام",
      text: text || title || "",
      url,
    });
    return true;
  } catch (error) {
    // User cancelled or share aborted — do not show error
    if (error?.name === "AbortError") {
      return false;
    }
    console.warn("Native share error:", error);
    return false;
  }
};

/**
 * Safely copies text to the clipboard with resilient textarea fallback.
 * @param {string} text
 * @returns {Promise<boolean>}
 */
export const copyToClipboard = async (text) => {
  if (!text) return false;

  if (navigator?.clipboard?.writeText) {
    try {
      await navigator.clipboard.writeText(text);
      return true;
    } catch {
      // Continue to fallback
    }
  }

  // Fallback for older browsers or restricted permissions
  try {
    const textArea = document.createElement("textarea");
    textArea.value = text;
    textArea.style.position = "fixed";
    textArea.style.top = "-9999px";
    textArea.style.left = "-9999px";
    document.body.appendChild(textArea);
    textArea.focus();
    textArea.select();
    const successful = document.execCommand("copy");
    document.body.removeChild(textArea);
    return successful;
  } catch (err) {
    console.error("Clipboard copy failed:", err);
    return false;
  }
};

/**
 * Generates the WhatsApp share URL with title and short URL.
 * @param {string} title
 * @param {string} url
 * @param {'fatwa'|'article'} type
 * @returns {string}
 */
export const getWhatsAppShareUrl = (title, url, type = "fatwa") => {
  const label = type === "fatwa" ? "مکمل فتویٰ پڑھیں:" : "مکمل مضمون پڑھیں:";
  const message = `${title ? title + "\n\n" : ""}${label}\n${url}`;
  return `https://api.whatsapp.com/send?text=${encodeURIComponent(message)}`;
};

/**
 * Generates the Twitter/X share URL with title and short URL.
 * @param {string} title
 * @param {string} url
 * @returns {string}
 */
export const getTwitterShareUrl = (title, url) => {
  return `https://twitter.com/intent/tweet?url=${encodeURIComponent(url)}&text=${encodeURIComponent(title || "")}`;
};
