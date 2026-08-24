import API from './api';
import toast from 'react-hot-toast';

export const getComments = async (contentType, contentId) => {
  try {
    const response = await API.get(`/comments/${contentType}/${contentId}`, {
      params: { _t: Date.now() }
    });
    return response.data;
  } catch (error) {
    console.error("Get Comments Error:", error);
    toast.error(error.response?.data?.message || error.message);
    throw error;
  }
};

export const createComment = async (data) => {
  try {
    const response = await API.post('/comments', data);
    return response.data;
  } catch (error) {
    console.error("Create Comment Error:", error);
    toast.error(error.response?.data?.message || error.message);
    throw error;
  }
};

export const updateComment = async (commentId, data) => {
  try {
    const response = await API.put(`/comments/${commentId}`, data);
    return response.data;
  } catch (error) {
    console.error("Update Comment Error:", error);
    toast.error(error.response?.data?.message || error.message);
    throw error;
  }
};

export const deleteComment = async (commentId) => {
  try {
    const response = await API.delete(`/comments/${commentId}`);
    return response.data;
  } catch (error) {
    console.error("Delete Comment Error:", error);
    toast.error(error.response?.data?.message || error.message);
    throw error;
  }
};

/* ── Admin-only comment APIs ── */
export const getAllAdminComments = async ({ status = 'all', page = 1, limit = 15 } = {}) => {
  try {
    const response = await API.get('/comments/admin', { params: { status, page, limit } });
    return response.data;
  } catch (error) {
    console.error("Get All Admin Comments Error:", error);
    throw error;
  }
};

export const getCommentStats = async () => {
  try {
    const response = await API.get('/comments/admin/stats');
    return response.data;
  } catch (error) {
    console.error("Get Comment Stats Error:", error);
    throw error;
  }
};

export const approveAdminComment = async (commentId) => {
  try {
    const response = await API.patch(`/comments/admin/${commentId}/approve`);
    return response.data;
  } catch (error) {
    console.error("Approve Comment Error:", error);
    throw error;
  }
};

export const restoreAdminComment = async (commentId) => {
  try {
    const response = await API.patch(`/comments/admin/${commentId}/restore`);
    return response.data;
  } catch (error) {
    console.error("Restore Comment Error:", error);
    throw error;
  }
};

