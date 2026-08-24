import API from './api';
import { PUBLICATIONS, LECTURES } from '@/constants/urls';
import toast from 'react-hot-toast';

// --- Publications (Books) ---
export const getPublications = async (params) => {
  try {
    let url = PUBLICATIONS;
    if (params) {
      const query = new URLSearchParams(params).toString();
      if (query) {
        url += `?${query}`;
      }
    }
    const response = await API.get(url);
    return response.data;
  } catch (error) {
    console.error("Get Publications Error:", error);
    toast.error(error.response?.data?.message || error.message);
    throw error;
  }
};

export const getPublicationBySlug = async (slug) => {
  try {
    const response = await API.get(`${PUBLICATIONS}/slug/${slug}`);
    return response.data;
  } catch (error) {
    console.error("Get Publication By Slug Error:", error);
    toast.error(error.response?.data?.message || error.message);
    throw error;
  }
};

export const createPublication = async (data) => {
  try {
    const response = await API.post(PUBLICATIONS, data, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  } catch (error) {
    console.error("Create Publication Error:", error);
    toast.error(error.response?.data?.message || error.message);
    throw error;
  }
};

export const updatePublication = async (id, data) => {
  try {
    const response = await API.put(`${PUBLICATIONS}/${id}`, data, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  } catch (error) {
    console.error("Update Publication Error:", error);
    toast.error(error.response?.data?.message || error.message);
    throw error;
  }
};

export const deletePublication = async (id) => {
  try {
    const response = await API.delete(`${PUBLICATIONS}/${id}`);
    return response.data;
  } catch (error) {
    console.error("Delete Publication Error:", error);
    toast.error(error.response?.data?.message || error.message);
    throw error;
  }
};

// --- Lectures ---
export const getLectures = async (params) => {
  try {
    let url = LECTURES;
    if (params) {
      const query = new URLSearchParams(params).toString();
      if (query) {
        url += `?${query}`;
      }
    }
    const response = await API.get(url);
    return response.data;
  } catch (error) {
    console.error("Get Lectures Error:", error);
    toast.error(error.response?.data?.message || error.message);
    throw error;
  }
};

export const createLecture = async (data) => {
  try {
    const response = await API.post(LECTURES, data);
    return response.data;
  } catch (error) {
    console.error("Create Lecture Error:", error);
    toast.error(error.response?.data?.message || error.message);
    throw error;
  }
};

export const updateLecture = async (id, data) => {
  try {
    const response = await API.put(`${LECTURES}/${id}`, data);
    return response.data;
  } catch (error) {
    console.error("Update Lecture Error:", error);
    toast.error(error.response?.data?.message || error.message);
    throw error;
  }
};

export const deleteLecture = async (id) => {
  try {
    const response = await API.delete(`${LECTURES}/${id}`);
    return response.data;
  } catch (error) {
    console.error("Delete Lecture Error:", error);
    toast.error(error.response?.data?.message || error.message);
    throw error;
  }
};
