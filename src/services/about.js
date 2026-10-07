import API from './api';
import { SETTINGS } from '@/constants/urls';
import { notifyError } from '@/utils/errorHandler';

export const getSettings = async () => {
  try {
    const response = await API.get(SETTINGS);
    return response.data;
  } catch (error) {
    console.error("Get Settings Error:", error);
    throw error;
  }
};

export const putSettings = async (settingsData) => {
  try {
    const response = await API.put(SETTINGS, settingsData);
    return response.data;
  } catch (error) {
    console.error("Put Settings Error:", error);
    notifyError(error, 'settings');
    throw error;
  }
};

export const getStats = async () => {
  try {
    const response = await API.get(`${SETTINGS}/stats`);
    return response.data;
  } catch (error) {
    console.error("Get Stats Error:", error);
    throw error;
  }
};
