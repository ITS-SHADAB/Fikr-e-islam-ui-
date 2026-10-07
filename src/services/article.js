import API from './api';
import { ARTICLES } from '@/constants/urls';
import { notifyError } from '@/utils/errorHandler';
import { safeDecodeSlug } from '@/utils/seoHelpers';

export const getArticles = async (params) => {
  try {
    let url = ARTICLES;
    if (params) {
      const cleanParams = Object.fromEntries(
        Object.entries(params).filter(([_, v]) => v !== undefined && v !== null && v !== '')
      );
      const query = new URLSearchParams(cleanParams).toString();
      if (query) {
        url += `?${query}`;
      }
    }
    const response = await API.get(url);
    return response.data;
  } catch (error) {
    console.error("Get Articles Error:", error);
    throw error;
  }
};

export const getArticleBySlug = async (slug) => {
  try {
    const cleanSlug = safeDecodeSlug(slug);
    const response = await API.get(`${ARTICLES}/slug/${encodeURIComponent(cleanSlug)}`);
    return response.data;
  } catch (error) {
    console.error("Get Article By Slug Error:", error);
    throw error;
  }
};

export const createArticle = async (data) => {
  try {
    const response = await API.post(ARTICLES, data, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  } catch (error) {
    console.error("Create Article Error:", error);
    notifyError(error, 'article');
    throw error;
  }
};

export const updateArticle = async (id, data) => {
  try {
    const response = await API.put(`${ARTICLES}/${id}`, data, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  } catch (error) {
    console.error("Update Article Error:", error);
    notifyError(error, 'article');
    throw error;
  }
};

export const deleteArticle = async (id) => {
  try {
    const response = await API.delete(`${ARTICLES}/${id}`);
    return response.data;
  } catch (error) {
    console.error("Delete Article Error:", error);
    notifyError(error, 'article');
    throw error;
  }
};
