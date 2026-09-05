import axios from "axios";
import { BASE_URL } from "@/constants/urls";

const API = axios.create({
  baseURL: BASE_URL,
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

// Response interceptor
API.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Clear stale credentials so isAuthenticated resets to false
      localStorage.removeItem("adminToken");
      localStorage.removeItem("adminInfo");
    }

    return Promise.reject(error);
  }
);

export default API;
