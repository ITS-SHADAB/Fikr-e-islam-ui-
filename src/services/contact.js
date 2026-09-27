import API from './api';
import { CONTACTS } from '@/constants/urls';
import toast from 'react-hot-toast';

export const submitContact = async (data) => {
  try {
    const response = await API.post(CONTACTS, data);
    return response.data;
  } catch (error) {
    console.error("Submit Contact Error:", error);
    toast.error(error.response?.data?.message || error.message);
    throw error;
  }
};

export const getContacts = async (params = {}) => {
  try {
    const response = await API.get(CONTACTS, { params });
    return response.data;
  } catch (error) {
    console.error("Get Contacts Error:", error);
    toast.error(error.response?.data?.message || error.message);
    throw error;
  }
};

export const getUnseenCount = async () => {
  try {
    const response = await API.get(`${CONTACTS}/unseen-count`);
    return response.data;
  } catch (error) {
    console.error("Get Unseen Count Error:", error);
    throw error;
  }
};

export const getContactById = async (id) => {
  try {
    const response = await API.get(`${CONTACTS}/${id}`);
    return response.data;
  } catch (error) {
    console.error("Get Contact By ID Error:", error);
    toast.error(error.response?.data?.message || error.message);
    throw error;
  }
};

export const markContactSeen = async (id, status) => {
  try {
    const payload = status ? { status } : {};
    const response = await API.put(`${CONTACTS}/${id}/seen`, payload);
    return response.data;
  } catch (error) {
    console.error("Mark Contact Seen Error:", error);
    toast.error(error.response?.data?.message || error.message);
    throw error;
  }
};

// Backward compatibility alias for toggling status
export const markContactReadStatus = async (id, toggle = true) => {
  try {
    const response = await API.put(`${CONTACTS}/${id}`, { toggle });
    return response.data;
  } catch (error) {
    console.error("Mark Contact Read Status Error:", error);
    toast.error(error.response?.data?.message || error.message);
    throw error;
  }
};

export const deleteContact = async (id) => {
  try {
    const response = await API.delete(`${CONTACTS}/${id}`);
    return response.data;
  } catch (error) {
    console.error("Delete Contact Error:", error);
    toast.error(error.response?.data?.message || error.message);
    throw error;
  }
};

export const replyToContact = async (id, text) => {
  try {
    const response = await API.post(`${CONTACTS}/${id}/reply`, { text });
    return response.data;
  } catch (error) {
    console.error("Reply To Contact Error:", error);
    toast.error(error.response?.data?.message || error.message);
    throw error;
  }
};

export const deleteContactReply = async (id) => {
  try {
    const response = await API.delete(`${CONTACTS}/${id}/reply`);
    return response.data;
  } catch (error) {
    console.error("Delete Contact Reply Error:", error);
    toast.error(error.response?.data?.message || error.message);
    throw error;
  }
};

export const getMyContacts = async (params = {}) => {
  try {
    const response = await API.get(`${CONTACTS}/my`, { params });
    return response.data;
  } catch (error) {
    console.warn("getMyContacts warning:", error.response?.data?.message || error.message);
    return { success: true, messages: [] };
  }
};


