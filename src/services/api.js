import axios from "axios";
import { BASE_URL } from "@/constants/urls";
import { getUserFriendlyError, notifyError, isRequestCanceled } from "@/utils/errorHandler";

const API = axios.create({
  baseURL: BASE_URL,
  timeout: 15000,
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

// Request interceptor
API.interceptors.request.use(
  (config) => {
    // If sending FormData, let the browser set multipart/form-data with boundary
    if (config.data instanceof FormData) {
      delete config.headers["Content-Type"];
    }

    // Attach Bearer token if valid and present
    const token = localStorage.getItem("adminToken");
    if (token && token !== "undefined" && token !== "null") {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor: Centralized Axios error handling
API.interceptors.response.use(
  (response) => response,
  (error) => {
    // Handle silent cancellation
    if (isRequestCanceled(error)) {
      return Promise.reject(error);
    }

    // Clear stale credentials on 401 Unauthorized
    if (error.response?.status === 401) {
      localStorage.removeItem("adminToken");
      localStorage.removeItem("adminInfo");
    }

    // Preserve full developer technical details in the browser console
    console.error("[Axios API Error]", {
      url: error.config?.url,
      method: error.config?.method?.toUpperCase(),
      status: error.response?.status,
      statusText: error.response?.statusText,
      data: error.response?.data,
      code: error.code,
      message: error.message,
    });

    // Extract context hint from config if provided
    const context = error.config?.context || error.config?.url || "";

    // Generate sanitized, polite, natural Urdu user-friendly error object
    const friendly = getUserFriendlyError(error, context);

    // Attach user-friendly metadata
    error.userFriendly = friendly;
    error.friendlyMessage = friendly.message;
    error.originalMessage = error.message;

    // Overwrite error.message so ANY legacy or caller displaying error.message
    // never shows technical strings (Network Error, 500, timeout, CastError, etc.)
    error.message = friendly.message;

    // Optional toast notification if explicitly requested in request config
    if (error.config?.showToast) {
      notifyError(error, context);
    }

    return Promise.reject(error);
  }
);

export default API;
