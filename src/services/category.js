import API from './api';

/**
 * Fetch dynamic categories with content counts from centralized backend API.
 *
 * @param {'article' | 'fatwa' | 'book' | 'question'} contentType
 * @returns {Promise<{ success: boolean, contentType: string, totalCategories: number, categories: Array<{ name: string, count: number }> }>}
 */
export const getCategories = async (contentType) => {
  const type = typeof contentType === 'string' ? contentType.trim().toLowerCase() : '';
  if (!type) {
    return {
      success: true,
      contentType: '',
      totalCategories: 0,
      categories: [],
    };
  }

  const response = await API.get(`/categories/${type}`);
  return response.data;
};

export const categoryService = {
  getCategories,
};

export default categoryService;
