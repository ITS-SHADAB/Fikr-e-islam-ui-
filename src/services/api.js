import axios from "axios";
import { BASE_URL } from "@/constants/urls";

const API = axios.create({
  baseURL: BASE_URL,
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

// Response interceptor
API.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Clear stale credentials
      localStorage.removeItem("adminToken");
      localStorage.removeItem("adminInfo");
    }

    return Promise.reject(error);
  }
);

export default API;
