import API from './api';
import { QUESTIONS } from '@/constants/urls';
import toast from 'react-hot-toast';

export const submitQuestion = async (data) => {
  try {
    const response = await API.post(`${QUESTIONS}/ask`, data);
    return response.data;
  } catch (error) {
    console.error("Submit Question Error:", error);
    toast.error(error.response?.data?.message || error.message);
    throw error;
  }
};

export const getPublicQuestions = async (params = {}) => {
  try {
    let url = QUESTIONS;
    const queryParams = { ...params };

    if (queryParams.search && queryParams.search.trim()) {
      url = `${QUESTIONS}/search`;
      queryParams.q = queryParams.search.trim();
      delete queryParams.search;
    } else {
      delete queryParams.search;
    }

    // Clean empty values
    if (!queryParams.category) {
      delete queryParams.category;
    }

    const response = await API.get(url, { params: queryParams });
    return response.data;
  } catch (error) {
    console.error("Get Public Questions Error:", error);
    toast.error(error.response?.data?.message || error.message);
    throw error;
  }
};

export const getQuestionBySlug = async (slug) => {
  try {
    const response = await API.get(`${QUESTIONS}/${slug}`);
    return response.data;
  } catch (error) {
    console.error("Get Question By Slug Error:", error);
    throw error;
  }
};

export const getPublicQuestionById = getQuestionBySlug;

export const getMyQuestionsList = async (params = {}) => {
  try {
    const response = await API.get(`${QUESTIONS}/my`, { params });
    return response.data;
  } catch (error) {
    console.error("Get My Questions Error:", error);
    throw error;
  }
};

export const updateMyQuestion = async (questionId, data) => {
  try {
    const response = await API.put(`${QUESTIONS}/${questionId}`, data);
    return response.data;
  } catch (error) {
    console.error("Update Question Error:", error);
    toast.error(error.response?.data?.message || error.message);
    throw error;
  }
};

export const deleteMyQuestion = async (questionId) => {
  try {
    const response = await API.delete(`${QUESTIONS}/${questionId}`);
    return response.data;
  } catch (error) {
    console.error("Delete Question Error:", error);
    toast.error(error.response?.data?.message || error.message);
    throw error;
  }
};

export const getAdminQuestions = async (params) => {
  try {
    const response = await API.get("/admin/questions", { params });
    return response.data;
  } catch (error) {
    console.error("Get Admin Questions Error:", error);
    toast.error(error.response?.data?.message || error.message);
    throw error;
  }
};

export const getQuestionStats = async () => {
  try {
    const response = await API.get("/admin/questions/stats");
    return response.data;
  } catch (error) {
    console.error("Get Question Stats Error:", error);
    toast.error(error.response?.data?.message || error.message);
    throw error;
  }
};

export const getAdminQuestionById = async (id) => {
  try {
    const response = await API.get(`/admin/questions/${id}`);
    return response.data;
  } catch (error) {
    console.error("Get Admin Question By Id Error:", error);
    toast.error(error.response?.data?.message || error.message);
    throw error;
  }
};

export const restoreQuestion = async (id) => {
  try {
    const response = await API.patch(`/admin/questions/${id}/restore`);
    return response.data;
  } catch (error) {
    console.error("Restore Question Error:", error);
    toast.error(error.response?.data?.message || error.message);
    throw error;
  }
};

export const permanentDeleteQuestion = async (id) => {
  try {
    const response = await API.delete(`/admin/questions/${id}/permanent`);
    return response.data;
  } catch (error) {
    console.error("Permanent Delete Question Error:", error);
    toast.error(error.response?.data?.message || error.message);
    throw error;
  }
};

export const answerQuestion = async (id, data) => {
  try {
    const response = await API.patch(`/admin/questions/${id}/answer`, data);
    return response.data;
  } catch (error) {
    console.error("Answer Question Error:", error);
    toast.error(error.response?.data?.message || error.message);
    throw error;
  }
};

export const approveQuestion = async (id) => {
  try {
    const response = await API.patch(`/admin/questions/${id}/approve`);
    return response.data;
  } catch (error) {
    console.error("Approve Question Error:", error);
    toast.error(error.response?.data?.message || error.message);
    throw error;
  }
};

export const rejectQuestion = async (id) => {
  try {
    const response = await API.patch(`/admin/questions/${id}/reject`);
    return response.data;
  } catch (error) {
    console.error("Reject Question Error:", error);
    toast.error(error.response?.data?.message || error.message);
    throw error;
  }
};

export const publishQuestion = async (id, isPublic) => {
  try {
    const response = await API.patch(`/admin/questions/${id}/publish`, { isPublic });
    return response.data;
  } catch (error) {
    console.error("Publish Question Error:", error);
    toast.error(error.response?.data?.message || error.message);
    throw error;
  }
};

// Admin soft-delete (sets isDeleted: true)
export const deleteQuestion = async (id) => {
  try {
    const response = await API.delete(`/admin/questions/${id}/permanent`);
    return response.data;
  } catch (error) {
    console.error("Delete Question Error:", error);
    toast.error(error.response?.data?.message || error.message);
    throw error;
  }
};
