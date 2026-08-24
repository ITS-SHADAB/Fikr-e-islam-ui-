import API from './api';
import { FATWAS } from '@/constants/urls';
import toast from 'react-hot-toast';

export const getFatwas = async (params) => {
  try {
    let url = FATWAS;
    if (params) {
      const query = new URLSearchParams(params).toString();
      if (query) {
        url += `?${query}`;
      }
    }
    const response = await API.get(url);
    return response.data;
  } catch (error) {
    console.error("Get Fatwas Error:", error);
    toast.error(error.response?.data?.message || error.message);
    throw error;
  }
};

export const getFatwaBySlug = async (slug) => {
  try {
    const response = await API.get(`${FATWAS}/slug/${slug}`);
    return response.data;
  } catch (error) {
    console.error("Get Fatwa By Slug Error:", error);
    toast.error(error.response?.data?.message || error.message);
    throw error;
  }
};

export const createFatwa = async (data) => {
  try {
    const response = await API.post(FATWAS, data);
    return response.data;
  } catch (error) {
    console.error("Create Fatwa Error:", error);
    toast.error(error.response?.data?.message || error.message);
    throw error;
  }
};

export const updateFatwa = async (id, data) => {
  try {
    const response = await API.put(`${FATWAS}/${id}`, data);
    return response.data;
  } catch (error) {
    console.error("Update Fatwa Error:", error);
    toast.error(error.response?.data?.message || error.message);
    throw error;
  }
};

export const deleteFatwa = async (id) => {
  try {
    const response = await API.delete(`${FATWAS}/${id}`);
    return response.data;
  } catch (error) {
    console.error("Delete Fatwa Error:", error);
    toast.error(error.response?.data?.message || error.message);
    throw error;
  }
};
