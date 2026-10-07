import API from './api';
import { notifyError } from '@/utils/errorHandler';

export const getAdminUsers = async (params = {}) => {
  try {
    const response = await API.get('/admin/users', { params });
    return response.data;
  } catch (error) {
    console.error("Get Admin Users Error:", error);
    throw error;
  }
};

export const getUserById = async (id) => {
  try {
    const response = await API.get(`/admin/users/${id}`);
    return response.data;
  } catch (error) {
    console.error("Get User By ID Error:", error);
    throw error;
  }
};

export const updateUser = async (id, userData) => {
  try {
    const response = await API.put(`/admin/users/${id}`, userData);
    return response.data;
  } catch (error) {
    console.error("Update User Error:", error);
    notifyError(error, 'user');
    throw error;
  }
};

export const deleteUser = async (id) => {
  try {
    const response = await API.delete(`/admin/users/${id}`);
    return response.data;
  } catch (error) {
    console.error("Delete User Error:", error);
    notifyError(error, 'user');
    throw error;
  }
};
