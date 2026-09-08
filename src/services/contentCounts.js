import API from './api';
import { CONTENT_COUNTS } from '@/constants/urls';

export const getContentCounts = async () => {
  try {
    const response = await API.get(CONTENT_COUNTS);
    return response.data;
  } catch (error) {
    console.error("Get Content Counts Error:", error);
    throw error;
  }
};
