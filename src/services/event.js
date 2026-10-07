import API from './api';
import { EVENTS } from '@/constants/urls';
import { notifyError } from '@/utils/errorHandler';

export const getEvents = async (params = {}) => {
  try {
    const cleanParams = Object.fromEntries(
      Object.entries(params || {}).filter(
        ([_, v]) => v !== undefined && v !== null && v !== ''
      )
    );
    // Cache-busting timestamp parameter prevents browser/proxy caching stale responses
    cleanParams._t = Date.now();

    const query = new URLSearchParams(cleanParams).toString();
    const url = `${EVENTS}?${query}`;

    const response = await API.get(url, {
      headers: {
        'Cache-Control': 'no-cache, no-store, must-revalidate',
        Pragma: 'no-cache',
        Expires: '0',
      },
    });
    return response.data;
  } catch (error) {
    console.error("Get Events Error:", error);
    throw error;
  }
};

export const createEvent = async (data) => {
  try {
    const response = await API.post(EVENTS, data);
    return response.data;
  } catch (error) {
    console.error("Create Event Error:", error);
    notifyError(error, 'event');
    throw error;
  }
};

export const updateEvent = async (id, data) => {
  try {
    const response = await API.put(`${EVENTS}/${id}`, data);
    return response.data;
  } catch (error) {
    console.error("Update Event Error:", error);
    notifyError(error, 'event');
    throw error;
  }
};

export const deleteEvent = async (id) => {
  try {
    const response = await API.delete(`${EVENTS}/${id}`);
    return response.data;
  } catch (error) {
    console.error("Delete Event Error:", error);
    notifyError(error, 'event');
    throw error;
  }
};
