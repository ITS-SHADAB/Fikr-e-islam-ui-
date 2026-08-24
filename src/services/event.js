import API from './api';
import { EVENTS } from '@/constants/urls';
import toast from 'react-hot-toast';

export const getEvents = async (params) => {
  try {
    let url = EVENTS;
    if (params) {
      const query = new URLSearchParams(params).toString();
      if (query) {
        url += `?${query}`;
      }
    }
    const response = await API.get(url);
    return response.data;
  } catch (error) {
    console.error("Get Events Error:", error);
    toast.error(error.response?.data?.message || error.message);
    throw error;
  }
};

export const createEvent = async (data) => {
  try {
    const response = await API.post(EVENTS, data);
    return response.data;
  } catch (error) {
    console.error("Create Event Error:", error);
    toast.error(error.response?.data?.message || error.message);
    throw error;
  }
};

export const updateEvent = async (id, data) => {
  try {
    const response = await API.put(`${EVENTS}/${id}`, data);
    return response.data;
  } catch (error) {
    console.error("Update Event Error:", error);
    toast.error(error.response?.data?.message || error.message);
    throw error;
  }
};

export const deleteEvent = async (id) => {
  try {
    const response = await API.delete(`${EVENTS}/${id}`);
    return response.data;
  } catch (error) {
    console.error("Delete Event Error:", error);
    toast.error(error.response?.data?.message || error.message);
    throw error;
  }
};
