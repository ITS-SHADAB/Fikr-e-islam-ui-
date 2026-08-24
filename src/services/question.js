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

export const getPublicQuestions = async (params) => {
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

    const response = await API.get(url, { params: queryParams });
    return response.data;
  } catch (error) {
    console.error("Get Public Questions Error:", error);
    toast.error(error.response?.data?.message || error.message);
    throw error;
  }
};

export const getPublicQuestionById = async (id) => {
  try {
    const response = await API.get(`${QUESTIONS}/${id}`);
    return response.data;
  } catch (error) {
    console.error("Get Public Question By ID Error:", error);
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

export const deleteQuestion = async (id) => {
  try {
    const response = await API.delete(`${QUESTIONS}/${id}`);
    return response.data;
  } catch (error) {
    console.error("Delete Question Error:", error);
    toast.error(error.response?.data?.message || error.message);
    throw error;
  }
};
