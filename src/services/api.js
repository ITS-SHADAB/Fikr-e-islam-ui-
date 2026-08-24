// import axios from 'axios';

// const API = axios.create({
//   baseURL: 'https://jamia-madarsha-server.onrender.com/api',
//   withCredentials: true,
//   headers: {
//     'Content-Type': 'application/json',
//   },
// });

// // Request interceptor — automatically attach authorization token
// API.interceptors.request.use(
//   (config) => {
//     const token = localStorage.getItem('adminToken');
//     if (token) {
//       config.headers.Authorization = `Bearer ${token}`;
//     }
//     return config;
//   },
//   (error) => Promise.reject(error)
// );

// // Response interceptor — handle 401 Unauthorized globally
// API.interceptors.response.use(
//   (response) => response,
//   (error) => {
//     if (error.response?.status === 401) {
//       // Clear stored credentials and redirect to login
//       localStorage.removeItem('adminToken');
//       localStorage.removeItem('adminInfo');
//       if (window.location.pathname !== '/login') {
//         window.location.href = '/login';
//       }
//     }
//     return Promise.reject(error);
//   }
// );

// export default API;

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
      // Clear stale credentials so isAuthenticated resets to false on next load
      localStorage.removeItem('adminToken');
      localStorage.removeItem('adminInfo');
      // Redirect to login page (only if not already there)
      if (window.location.pathname !== '/login') {
        window.location.href = '/login';
      }
    }

    return Promise.reject(error);
  }
);

export default API;
