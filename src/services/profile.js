import API from './api';
import toast from 'react-hot-toast';

// Get comments made by the currently logged-in user
// Uses the existing GET /comments/:contentType/:contentId endpoint indirectly
// by fetching the user's own profile data which the server exposes via /users/me
export const getMyComments = async () => {
  try {
    const response = await API.get('/comments/my');
    return response.data;
  } catch (error) {
    // Silently return empty array if endpoint not available yet
    console.warn('getMyComments:', error.response?.data?.message || error.message);
    return { comments: [] };
  }
};

// Get questions submitted by the currently logged-in user
export const getMyQuestions = async () => {
  try {
    const response = await API.get('/questions/my');
    return response.data;
  } catch (error) {
    console.warn('getMyQuestions:', error.response?.data?.message || error.message);
    return { questions: [] };
  }
};

// Get current user profile
export const getMyProfile = async () => {
  try {
    const response = await API.get('/users/me');
    return response.data;
  } catch (error) {
    console.error('getMyProfile:', error.response?.data?.message || error.message);
    throw error;
  }
};

// Update current user profile
// PUT /api/users/update_profile
// Supports name, contactPhone, and file profileImage
export const updateMyProfile = async (formData) => {
  try {
    const response = await API.put('/users/update_profile', formData);
    return response.data;
  } catch (error) {
    console.error('updateMyProfile:', error.response?.data?.message || error.message);
    toast.error(error.response?.data?.message || error.message);
    throw error;
  }
};

