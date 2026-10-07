import API from "./api";
import {
  AUTH_LOGIN,
  AUTH_LOGOUT,
  AUTH_ME,
  AUTH_REGISTER,
  AUTH_FORGOT_PASSWORD,
  AUTH_RESET_PASSWORD,
} from "@/constants/urls";
import { notifyError } from "@/utils/errorHandler";
import { handleLogoutTokenReset } from "./notificationService";

// Register User
export const registerUser = async (formData) => {
  try {
    const payload = {
      name: formData.name,
      identifier: formData.identifier,
      contactPhone: formData.contactPhone || "",
      password: formData.password,
    };

    const response = await API.post(AUTH_REGISTER, payload);
    return response.data;
  } catch (error) {
    console.error("Register Error:", error);
    notifyError(error, 'signup');
    throw error;
  }
};

// Login User
export const loginUser = async (formData) => {
  try {
    const payload = {
      identifier: formData.identifier || formData.username,
      password: formData.password,
    };

    const response = await API.post(AUTH_LOGIN, payload);
    return response.data;
  } catch (error) {
    console.error("Login Error:", error);
    notifyError(error, 'login');
    throw error;
  }
};

// Logout User
export const logoutUser = async () => {
  try {
    try {
      await handleLogoutTokenReset();
    } catch (tokenErr) {
      console.warn("Could not unregister FCM token during logout:", tokenErr);
    }
    const response = await API.post(AUTH_LOGOUT);
    return response.data;
  } catch (error) {
    console.error("Logout Error:", error);
    notifyError(error, 'auth');
    throw error;
  }
};

// Check Current User
export const checkAuthStatus = async () => {
  try {
    const response = await API.get(AUTH_ME);
    return response.data;
  } catch (error) {
    // Expected 401 for guest users - do not pollute console
    if (error.response?.status !== 401) {
      console.error("Auth Status Error:", error);
    }
    throw error;
  }
};

// Forgot Password
export const forgotPasswordApi = async (email) => {
  try {
    const response = await API.post(AUTH_FORGOT_PASSWORD, { email });
    return response.data;
  } catch (error) {
    console.error("Forgot Password Error:", error);
    notifyError(error, 'password');
    throw error;
  }
};

// Reset Password
export const resetPasswordApi = async (token, { password, confirmPassword }) => {
  try {
    const response = await API.post(`${AUTH_RESET_PASSWORD}/${token}`, {
      password,
      confirmPassword,
    });
    return response.data;
  } catch (error) {
    console.error("Reset Password Error:", error);
    notifyError(error, 'password');
    throw error;
  }
};
