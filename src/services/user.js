import API from './api';
import toast from 'react-hot-toast';

export const getAdminUsers = async (params = {}) => {
  try {
    const response = await API.get('/admin/users', { params });
    return response.data;
  } catch (error) {
    console.error("Get Admin Users Error:", error);
    toast.error(error.response?.data?.message || error.message);
    throw error;
  }
};

export const getUserById = async (id) => {
  try {
    const response = await API.get(`/admin/users/${id}`);
    return response.data;
  } catch (error) {
    console.error("Get User By ID Error:", error);
    toast.error(error.response?.data?.message || error.message);
    throw error;
  }
};

export const updateUser = async (id, userData) => {
  try {
    const response = await API.put(`/admin/users/${id}`, userData);
    return response.data;
  } catch (error) {
    console.error("Update User Error:", error);
    toast.error(error.response?.data?.message || error.message);
    throw error;
  }
};

export const deleteUser = async (id) => {
  try {
    const response = await API.delete(`/admin/users/${id}`);
    return response.data;
  } catch (error) {
    console.error("Delete User Error:", error);
    toast.error(error.response?.data?.message || error.message);
    throw error;
  }
};
