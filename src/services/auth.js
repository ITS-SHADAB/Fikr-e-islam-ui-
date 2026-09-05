import API from "./api";
import {
  AUTH_LOGIN,
  AUTH_LOGOUT,
  AUTH_ME,
  AUTH_REGISTER,
  AUTH_FORGOT_PASSWORD,
  AUTH_RESET_PASSWORD,
} from "@/constants/urls";
import toast from "react-hot-toast";

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

    toast.error(error.response?.data?.message || error.message);

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

    toast.error(error.response?.data?.message || error.message);

    throw error;
  }
};

// Logout User
export const logoutUser = async () => {
  try {
    const response = await API.post(AUTH_LOGOUT);

    return response.data;
  } catch (error) {
    console.error("Logout Error:", error);

    toast.error(error.response?.data?.message || error.message);

    throw error;
  }
};

// Check Current User
export const checkAuthStatus = async () => {
  try {
    const response = await API.get(AUTH_ME);

    return response.data;
  } catch (error) {
    // Silent error (useful for guest users)
    console.error("Auth Status Error:", error);

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
    const message =
      error.response?.data?.message ||
      error.message ||
      "Unable to process your request. Please try again later.";
    throw new Error(message);
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
    const message =
      error.response?.data?.message ||
      error.message ||
      "Reset link is invalid or has expired.";
    throw new Error(message);
  }
};
