import toast from 'react-hot-toast';

/**
 * Checks if a string contains Urdu / Arabic characters.
 */
function containsUrduCharacters(str) {
  if (typeof str !== 'string') return false;
  // Arabic/Urdu unicode range: \u0600-\u06FF, \u0750-\u077F, \uFB50-\uFDFF, \uFE70-\uFEFF
  return /[\u0600-\u06FF\u0750-\u077F\uFB50-\uFDFF\uFE70-\uFEFF]/.test(str);
}

/**
 * Detects whether a string looks like raw technical error details,
 * database errors, stack traces, HTML error pages, or internal messages.
 */
function isTechnicalError(str) {
  if (typeof str !== 'string') return false;
  const s = str.trim();
  if (!s) return false;

  const technicalPatterns = [
    /casterror/i,
    /objectid/i,
    /e11000/i,
    /duplicate key/i,
    /mongoservererror/i,
    /mongoose/i,
    /jwt\s*(expired|malformed|must be provided|invalid)/i,
    /token\s*(expired|invalid|malformed)/i,
    /syntaxerror/i,
    /typeerror/i,
    /referenceerror/i,
    /rangeerror/i,
    /cannot read propert/i,
    /is not a function/i,
    /undefined is not/i,
    /unexpected token/i,
    /json\.parse/i,
    /at\s+[\w\.\/<>]+\s*\(?/i,
    /node_modules/i,
    /<!doctype/i,
    /<html/i,
    /<body/i,
    /internal server error/i,
    /bad gateway/i,
    /gateway timeout/i,
    /service unavailable/i,
    /status code\s*\d{3}/i,
    /request failed with status code/i,
    /axioserror/i,
    /err_network/i,
    /econnrefused/i,
    /enotfound/i,
    /econnaborted/i,
    /timeout of \d+ms exceeded/i,
    /network error/i,
    /failed to fetch/i,
    /load failed/i,
    /cross-origin/i,
  ];

  return technicalPatterns.some((pattern) => pattern.test(s));
}

/**
 * Checks if an error is a request cancellation/abort.
 */
export function isRequestCanceled(error) {
  if (!error) return false;
  return (
    error.name === 'CanceledError' ||
    error.code === 'ERR_CANCELED' ||
    error.message === 'canceled'
  );
}

/**
 * Core function to parse any technical/network/HTTP error into a polite,
 * user-friendly message tailored for Urdu (default) and English interfaces.
 * Never leaks raw technical details, stack traces, Axios objects, or DB error codes.
 *
 * @param {any} error - The caught error (AxiosError, Error, string, object, etc.)
 * @param {string|object} context - Context hint (e.g. 'login', 'signup', 'articles', 'fatwas', 'qa', 'comments', 'events', 'publications', 'settings', 'contact')
 * @param {string} lang - 'ur' (default) or 'en'
 * @returns {object} { type, title, message, status, canRetry, isNetwork, isTimeout, isNotFound, isAuth, userFriendly: true }
 */
export function getUserFriendlyError(error, context = '', lang = 'ur') {
  // If already parsed friendly error object
  if (error && error.userFriendly && typeof error.message === 'string') {
    return error;
  }
  if (
    error &&
    typeof error === 'object' &&
    error.type &&
    typeof error.message === 'string' &&
    error.canRetry !== undefined &&
    error.title
  ) {
    return { ...error, userFriendly: true };
  }

  const isUrdu = lang === 'ur' || lang === 'Urdu';
  const ctx = typeof context === 'string'
    ? context.toLowerCase()
    : (context?.context || '').toLowerCase();

  // If request was canceled/aborted, treat as silent
  if (isRequestCanceled(error)) {
    return {
      type: 'CANCELED',
      title: isUrdu ? 'منسوخ شدہ' : 'Canceled',
      message: '',
      status: null,
      canRetry: false,
      isSilent: true,
      userFriendly: true,
    };
  }

  // Extract response status and server-provided message
  let status = error?.response?.status || (error?.status ? Number(error.status) : null);
  const serverMsg = error?.response?.data?.message || error?.data?.message;

  // 1. Timeout detection
  const isTimeout =
    error?.code === 'ECONNABORTED' ||
    status === 504 ||
    status === 408 ||
    (typeof error?.message === 'string' && error.message.toLowerCase().includes('timeout')) ||
    (typeof error === 'string' && error.toLowerCase().includes('timeout'));

  if (isTimeout) {
    return {
      type: 'TIMEOUT',
      title: isUrdu ? 'رابطہ قائم نہیں ہو سکا' : 'Connection Timed Out',
      message: isUrdu
        ? 'سرور سے رابطہ قائم کرنے میں معمول سے زیادہ وقت لگا۔ براہ کرم دوبارہ کوشش فرمائیں۔'
        : 'The request timed out. Please check your connection and try again.',
      status: status || 504,
      canRetry: true,
      isTimeout: true,
      userFriendly: true,
    };
  }

  // 2. Network / Offline detection
  const isNetwork =
    (typeof navigator !== 'undefined' && navigator?.onLine === false) ||
    error?.code === 'ERR_NETWORK' ||
    error?.code === 'ENOTFOUND' ||
    error?.code === 'ECONNREFUSED' ||
    error?.message === 'Network Error' ||
    (!error?.response && error?.request) ||
    (typeof error === 'string' &&
      (error.toLowerCase().includes('network') ||
        error.toLowerCase().includes('failed to fetch') ||
        error.toLowerCase().includes('connection')));

  if (isNetwork) {
    return {
      type: 'NETWORK',
      title: isUrdu ? 'انٹرنیٹ کنکشن منقطع ہے' : 'Network Disconnected',
      message: isUrdu
        ? 'انٹرنیٹ کنکشن دستیاب نہیں ہے یا سرور سے رابطہ منقطع ہے۔ براہ کرم اپنا نیٹ ورک چیک کریں۔'
        : 'Network connection unavailable. Please check your internet connection.',
      status: 0,
      canRetry: true,
      isNetwork: true,
      userFriendly: true,
    };
  }

  // 3. String error input handling (if error was thrown as a string)
  if (typeof error === 'string') {
    const trimmed = error.trim();
    // If string already contains clean Urdu text, preserve and format it
    if (containsUrduCharacters(trimmed) && trimmed.length > 2 && !isTechnicalError(trimmed)) {
      return {
        type: 'CUSTOM',
        title: isUrdu ? 'اطلاع' : 'Notice',
        message: trimmed,
        status: status || null,
        canRetry: false,
        userFriendly: true,
      };
    }
  }

  // 4. Server-provided clean Urdu message check
  // If the backend sent a genuine clean Urdu message (not an exception trace), respect it
  if (
    typeof serverMsg === 'string' &&
    containsUrduCharacters(serverMsg) &&
    serverMsg.trim().length > 3 &&
    !isTechnicalError(serverMsg)
  ) {
    return {
      type: status && status >= 500 ? 'SERVER' : 'API_ERROR',
      title: isUrdu
        ? status && status >= 500
          ? 'عارضی مسئلہ'
          : 'اطلاع'
        : 'Notice',
      message: serverMsg.trim(),
      status: status || null,
      canRetry: Boolean(status && status >= 500),
      userFriendly: true,
    };
  }

  // 5. HTTP Status Code handling with Contextual Messages
  if (status) {
    switch (status) {
      case 400: {
        // Validation / Bad Request
        let msg = isUrdu
          ? 'درخواست کی معلومات درست نہیں ہیں۔ براہ کرم چیک کر کے دوبارہ کوشش کریں۔'
          : 'Invalid request data. Please check and try again.';

        if (ctx.includes('login') || ctx.includes('auth')) {
          msg = isUrdu
            ? 'ای میل یا پاس ورڈ درست نہیں ہے۔'
            : 'Invalid email or password.';
        } else if (ctx.includes('signup') || ctx.includes('register')) {
          msg = isUrdu
            ? 'فراہم کردہ معلومات درست نہیں ہیں۔ تمام ضروری خانے چیک کریں۔'
            : 'Please complete all required fields correctly.';
        } else if (ctx.includes('password') || ctx.includes('reset') || ctx.includes('forgot')) {
          msg = isUrdu
            ? 'پاس ورڈ یا ای میل کی معلومات درست نہیں ہیں۔'
            : 'Please provide valid email and password.';
        } else if (ctx.includes('upload') || ctx.includes('poster') || ctx.includes('file') || ctx.includes('image')) {
          msg = isUrdu
            ? 'فائل کا فارمیٹ یا سائز درست نہیں ہے۔ براہ کرم درست فائل منتخب کریں۔'
            : 'Invalid file format or size. Please choose an allowed file.';
        } else if (ctx.includes('comment')) {
          msg = isUrdu
            ? 'تبصرہ درج کرنے کے لیے مطلوبہ معلومات فراہم کریں۔'
            : 'Please enter a valid comment.';
        } else if (ctx.includes('question') || ctx.includes('qa') || ctx.includes('ask')) {
          msg = isUrdu
            ? 'سوال کا عنوان اور تفصیلی سوال درست طریقے سے درج فرمائیں۔'
            : 'Please provide question title and details.';
        } else if (ctx.includes('contact') || ctx.includes('message')) {
          msg = isUrdu
            ? 'براہ کرم تمام مطلوبہ خانے اور درست موبائل نمبر درج فرمائیں۔'
            : 'Please fill all required fields with a valid mobile number.';
        } else if (ctx.includes('fatwa')) {
          msg = isUrdu
            ? 'فتویٰ کے تمام ضروری اندراجات مکمل فرمائیں۔'
            : 'Please provide valid fatwa details.';
        } else if (ctx.includes('article')) {
          msg = isUrdu
            ? 'مضمون کا عنوان اور ضروری تفصیلات فراہم فرمائیں۔'
            : 'Please provide valid article details.';
        } else if (ctx.includes('book') || ctx.includes('publication')) {
          msg = isUrdu
            ? 'کتاب کا عنوان اور ضروری معلومات فراہم فرمائیں۔'
            : 'Please provide valid publication details.';
        } else if (ctx.includes('event')) {
          msg = isUrdu
            ? 'پروگرام کی ضروری تفصیلات اور تاریخ درست درج فرمائیں۔'
            : 'Please provide valid event details.';
        } else if (
          typeof serverMsg === 'string' &&
          serverMsg.length < 120 &&
          !isTechnicalError(serverMsg)
        ) {
          msg = serverMsg;
        }

        return {
          type: 'VALIDATION',
          title: isUrdu ? 'معلومات درست نہیں ہیں' : 'Validation Error',
          message: msg,
          status: 400,
          canRetry: false,
          userFriendly: true,
        };
      }

      case 401: {
        // Unauthorized
        const msg = ctx.includes('login')
          ? isUrdu
            ? 'ای میل یا پاس ورڈ درست نہیں ہے۔'
            : 'Invalid email or password.'
          : isUrdu
          ? 'اس کارروائی کے لیے لاگ ان ہونا ضروری ہے۔ براہ کرم لاگ ان کریں۔'
          : 'Session expired or login required. Please sign in.';

        return {
          type: 'UNAUTHORIZED',
          title: isUrdu ? 'اجازت درکار ہے' : 'Authentication Required',
          message: msg,
          status: 401,
          canRetry: false,
          isAuth: true,
          userFriendly: true,
        };
      }

      case 403: {
        // Forbidden
        return {
          type: 'FORBIDDEN',
          title: isUrdu ? 'رسائی کی اجازت نہیں' : 'Access Denied',
          message: isUrdu
            ? 'آپ کو اس کارروائی یا مواد تک رسائی کی اجازت نہیں ہے۔'
            : 'You do not have permission to access this resource.',
          status: 403,
          canRetry: false,
          isAuth: true,
          userFriendly: true,
        };
      }

      case 404: {
        // Not found
        let notFoundMsg = isUrdu
          ? 'مطلوبہ معلومات یا صفحہ دستیاب نہیں ہے۔'
          : 'The requested information could not be found.';

        if (ctx.includes('article')) {
          notFoundMsg = isUrdu ? 'مطلوبہ مضمون دستیاب نہیں ہے یا حذف ہو چکا ہے۔' : 'Article not found.';
        } else if (ctx.includes('fatwa')) {
          notFoundMsg = isUrdu ? 'مطلوبہ فتویٰ دستیاب نہیں ہے یا حذف ہو چکا ہے۔' : 'Fatwa not found.';
        } else if (ctx.includes('event')) {
          notFoundMsg = isUrdu ? 'مطلوبہ پروگرام دستیاب نہیں ہے۔' : 'Event not found.';
        } else if (ctx.includes('book') || ctx.includes('publication')) {
          notFoundMsg = isUrdu ? 'مطلوبہ کتاب دستیاب نہیں ہے۔' : 'Publication not found.';
        } else if (ctx.includes('lecture')) {
          notFoundMsg = isUrdu ? 'مطلوبہ درس یا خطاب دستیاب نہیں ہے۔' : 'Lecture not found.';
        } else if (ctx.includes('question') || ctx.includes('qa')) {
          notFoundMsg = isUrdu ? 'مطلوبہ سوال دستیاب نہیں ہے۔' : 'Question not found.';
        } else if (ctx.includes('user') || ctx.includes('profile')) {
          notFoundMsg = isUrdu ? 'صارف کا اکاؤنٹ دستیاب نہیں ہے۔' : 'User account not found.';
        } else if (ctx.includes('contact') || ctx.includes('message')) {
          notFoundMsg = isUrdu ? 'مطلوبہ پیغام دستیاب نہیں ہے۔' : 'Message not found.';
        } else if (ctx.includes('comment')) {
          notFoundMsg = isUrdu ? 'مطلوبہ تبصرہ دستیاب نہیں ہے۔' : 'Comment not found.';
        }

        return {
          type: 'NOT_FOUND',
          title: isUrdu ? 'معلومات دستیاب نہیں ہیں' : 'Not Found',
          message: notFoundMsg,
          status: 404,
          canRetry: false,
          isNotFound: true,
          userFriendly: true,
        };
      }

      case 409: {
        // Conflict
        const msg = ctx.includes('signup') || ctx.includes('user') || ctx.includes('register')
          ? isUrdu
            ? 'اس ای میل یا موبائل نمبر پر پہلے سے اکاؤنٹ موجود ہے۔'
            : 'An account with this email or phone already exists.'
          : isUrdu
          ? 'یہ معلومات پہلے سے سسٹم میں موجود ہیں۔'
          : 'A duplicate record already exists.';

        return {
          type: 'CONFLICT',
          title: isUrdu ? 'پہلے سے موجود ہے' : 'Already Exists',
          message: msg,
          status: 409,
          canRetry: false,
          userFriendly: true,
        };
      }

      case 413: {
        // Payload too large
        return {
          type: 'PAYLOAD_TOO_LARGE',
          title: isUrdu ? 'فائل کا سائز زیادہ ہے' : 'File Too Large',
          message: isUrdu
            ? 'فائل کا سائز مقررہ حد سے زیادہ ہے۔ براہ کرم چھوٹی فائل منتخب کریں۔'
            : 'File is too large. Please upload a smaller file.',
          status: 413,
          canRetry: false,
          userFriendly: true,
        };
      }

      case 429: {
        // Rate limit
        return {
          type: 'RATE_LIMIT',
          title: isUrdu ? 'درخواستوں کی حد' : 'Rate Limited',
          message: isUrdu
            ? 'بہت زیادہ درخواستیں بھیجی گئی ہیں۔ براہ کرم کچھ لمحے انتظار فرمائیں۔'
            : 'Too many requests. Please wait a moment before trying again.',
          status: 429,
          canRetry: true,
          userFriendly: true,
        };
      }

      case 500:
      case 502:
      case 503: {
        // Server error - ALWAYS polite, NEVER leak internal server details
        return {
          type: 'SERVER',
          title: isUrdu ? 'سرور پر عارضی مسئلہ' : 'Server Issue',
          message: isUrdu
            ? 'سرور پر عارضی مسئلہ پیش آیا ہے۔ کچھ دیر بعد دوبارہ کوشش فرمائیں۔'
            : 'A temporary server issue occurred. Please try again shortly.',
          status,
          canRetry: true,
          userFriendly: true,
        };
      }

      default:
        break;
    }
  }

  // 6. Fallback unknown error
  return {
    type: 'UNKNOWN',
    title: isUrdu ? 'عارضی دشواری' : 'Temporary Issue',
    message: isUrdu
      ? 'غیر متوقع دشواری پیش آئی۔ براہ کرم دوبارہ کوشش فرمائیں۔'
      : 'An unexpected issue occurred. Please try again.',
    status: status || null,
    canRetry: true,
    userFriendly: true,
  };
}

/**
 * Returns just the user-friendly message string.
 */
export function getErrorMessage(error, context = '', lang = 'ur') {
  return getUserFriendlyError(error, context, lang).message;
}

// -------------------------------------------------------------
// Toast Deduplication / Throttling Mechanism
// Prevents toast storms when multiple parallel queries fail at once
// -------------------------------------------------------------
const recentToasts = new Map();
const TOAST_THROTTLE_MS = 3500;

/**
 * Dispatches a polite, professionally formatted error toast notification.
 * Automatically deduplicates identical error types within 3.5 seconds to avoid spam.
 * Preserves full developer technical details in the browser console.
 *
 * @param {any} error - Caught error
 * @param {string|object} context - Context string (e.g. 'login', 'events', 'comments')
 * @param {object} options - react-hot-toast options
 */
export function notifyError(error, context = '', options = {}) {
  // Silent on aborted requests
  if (isRequestCanceled(error)) return null;

  // Log full technical trace for developers in browser console
  console.error('[Application Error Log]', {
    context,
    timestamp: new Date().toISOString(),
    error,
  });

  const parsed = getUserFriendlyError(error, context);
  if (!parsed.message) return null;

  // Deduplication check
  const now = Date.now();
  const throttleKey = `${parsed.type}:${parsed.message}`;
  const lastTime = recentToasts.get(throttleKey);

  if (lastTime && now - lastTime < TOAST_THROTTLE_MS) {
    // Suppress duplicate toast
    return null;
  }
  recentToasts.set(throttleKey, now);

  // Clean stale keys periodically
  if (recentToasts.size > 30) {
    for (const [k, time] of recentToasts.entries()) {
      if (now - time > 10000) recentToasts.delete(k);
    }
  }

  // Custom styled toast with Urdu support and warm aesthetic matching the portal
  return toast.error(parsed.message, {
    duration: 4000,
    style: {
      borderRadius: '14px',
      background: '#2B2118',
      color: '#FFFFFF',
      fontSize: '13px',
      fontFamily: "'Payami Nastaleeq', 'Noto Nastaliq Urdu', system-ui, sans-serif",
      padding: '12px 18px',
      boxShadow: '0 8px 24px rgba(43, 33, 24, 0.25)',
      direction: 'rtl',
      textAlign: 'right',
      maxWidth: '440px',
      border: '1px solid rgba(168, 121, 62, 0.4)',
    },
    iconTheme: {
      primary: '#E06B6B',
      secondary: '#2B2118',
    },
    ...options,
  });
}
