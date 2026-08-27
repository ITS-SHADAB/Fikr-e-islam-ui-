import API from "./api";
import {
  AUTH_LOGIN,
  AUTH_LOGOUT,
  AUTH_ME,
  AUTH_REGISTER,
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
