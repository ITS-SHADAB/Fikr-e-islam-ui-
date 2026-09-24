import { useMemo } from 'react';
import { useCachedContent } from './useContentCache';
import { getCategories } from '@/services/category';
import { STALE_TIMES } from '@/store/slices/contentSlice';
import {
  ARTICLE_CATEGORIES,
  ARTICLE_TRANSLATIONS,
  ARTICLE_EN_LABELS,
  FATWA_CATEGORIES,
  FATWA_TRANSLATIONS,
  FATWA_EN_LABELS,
  PUBLICATION_CATEGORIES,
  PUBLICATION_TRANSLATIONS,
  PUBLICATION_EN_LABELS,
  QA_CATEGORIES,
  QA_TRANSLATIONS,
  QA_EN_LABELS,
} from '@/utils/categories';

/**
 * Maps content types to existing static category dictionaries for localized label lookups.
 */
const CATEGORY_DICTIONARIES = {
  article: {
    list: ARTICLE_CATEGORIES,
    ur: ARTICLE_TRANSLATIONS,
    en: ARTICLE_EN_LABELS,
  },
  fatwa: {
    list: FATWA_CATEGORIES,
    ur: FATWA_TRANSLATIONS,
    en: FATWA_EN_LABELS,
  },
  book: {
    list: PUBLICATION_CATEGORIES,
    ur: PUBLICATION_TRANSLATIONS,
    en: PUBLICATION_EN_LABELS,
  },
  question: {
    list: QA_CATEGORIES,
    ur: QA_TRANSLATIONS,
    en: QA_EN_LABELS,
  },
};

/**
 * Normalize and enrich a single backend category item with localized labels.
 *
 * Contract:
 * - name: string (backend raw normalized category name)
 * - value: string (exact value to pass to backend when filtering content)
 * - count: number (exact count returned by backend aggregation)
 * - labelUr: string (Urdu display label)
 * - labelEn: string (English display label)
 */
export function normalizeCategoryItem(item, contentType) {
  if (!item) return null;
  const rawName = typeof item === 'string' ? item : item.name;
  if (!rawName || typeof rawName !== 'string') return null;

  const trimmedName = rawName.trim();
  if (!trimmedName) return null;

  const count = typeof item.count === 'number' ? item.count : 0;
  const dict = CATEGORY_DICTIONARIES[contentType];

  // 1. Direct key lookup in translation maps (e.g. 'SALAH', 'QURAN_TAFSEER')
  let labelUr = dict?.ur?.[trimmedName];
  let labelEn = dict?.en?.[trimmedName];

  // 2. Search across existing definitions for value / English / Urdu match
  if (!labelUr || !labelEn) {
    const matched = dict?.list?.find(
      (c) =>
        c.value?.toLowerCase() === trimmedName.toLowerCase() ||
        c.labelUr === trimmedName ||
        c.labelEn?.toLowerCase() === trimmedName.toLowerCase()
    );
    if (matched) {
      labelUr = labelUr || matched.labelUr;
      labelEn = labelEn || matched.labelEn;
    }
  }

  // 3. Fallback: if newly added category in backend, use the backend name directly
  return {
    name: trimmedName,
    value: trimmedName,
    count,
    labelUr: labelUr || trimmedName,
    labelEn: labelEn || trimmedName,
  };
}

/**
 * Filter, sort, and normalize dynamic categories from backend API response.
 *
 * Rules:
 * 1. Only display categories returned by the backend.
 * 2. Do NOT display empty categories (count <= 0).
 * 3. Sort by backend-provided count in descending order.
 * 4. Never recalculate counts on frontend.
 */
export function normalizeCategories(rawCategories, contentType) {
  if (!Array.isArray(rawCategories) || rawCategories.length === 0) {
    return [];
  }

  const normalized = [];
  for (const item of rawCategories) {
    const parsed = normalizeCategoryItem(item, contentType);
    if (parsed && parsed.count > 0) {
      normalized.push(parsed);
    }
  }

  // Sort categories by backend-provided count descending
  return normalized.sort((a, b) => b.count - a.count);
}

/**
 * Custom hook to dynamically fetch and cache categories for a specific content type.
 *
 * Uses existing Redux-backed useCachedContent:
 * - Cached with 10-minute stale time across route/state changes
 * - Automatic in-flight request deduplication
 * - Non-blocking: does not block the page while loading
 * - Error-resilient: does not crash on API failures
 *
 * @param {'article' | 'fatwa' | 'book' | 'question'} contentType
 * @param {Object} [options]
 * @returns {{
 *   categories: Array<{ name: string, value: string, count: number, labelUr: string, labelEn: string }>,
 *   rawCategories: Array<{ name: string, count: number }>,
 *   totalCategories: number,
 *   loading: boolean,
 *   isRefreshing: boolean,
 *   error: string | null,
 *   refetch: (force?: boolean) => void
 * }}
 */
export function useCategories(contentType, options = {}) {
  const cleanType =
    typeof contentType === 'string' ? contentType.trim().toLowerCase() : '';

  const {
    data,
    loading,
    isRefreshing,
    error,
    refetch,
  } = useCachedContent({
    type: 'categories',
    params: cleanType,
    fetcher: () => getCategories(cleanType),
    staleTime: STALE_TIMES.categories || 10 * 60 * 1000,
    enabled: !!cleanType,
    ...options,
  });

  const categories = useMemo(() => {
    const list = data?.categories;
    return normalizeCategories(list, cleanType);
  }, [data?.categories, cleanType]);

  return {
    categories,
    rawCategories: data?.categories || [],
    totalCategories: data?.totalCategories || categories.length,
    loading,
    isRefreshing,
    error,
    refetch,
  };
}

export default useCategories;
