import { useEffect, useRef, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  fetchContentWithCache,
  getQueryKey,
  DEFAULT_STALE_TIME,
  STALE_TIMES,
} from '@/store/slices/contentSlice';
import {
  getArticles,
  getArticleBySlug,
  getFatwas,
  getFatwaBySlug,
  getPublicQuestions,
  getQuestionBySlug,
  getPublications,
  getPublicationBySlug,
  getLectures,
  getEvents,
  getContentCounts,
} from '@/services';

/**
 * Filter out undefined, null, and empty string query parameters
 * to prevent URLSearchParams from generating e.g. "category=undefined".
 */
export function cleanQueryParams(params) {
  if (!params || typeof params !== 'object') return params;
  const clean = {};
  for (const [key, val] of Object.entries(params)) {
    if (val !== undefined && val !== null && val !== '') {
      clean[key] = val;
    }
  }
  return clean;
}

/**
 * Core generic hook for caching public content with Stale-While-Revalidate semantics.
 */
export function useCachedContent({
  type,
  params = {},
  fetcher,
  staleTime = DEFAULT_STALE_TIME,
  enabled = true,
}) {
  const dispatch = useDispatch();
  const normalizedParams = cleanQueryParams(params);
  const key = getQueryKey(type, normalizedParams);

  const queryState = useSelector((state) => state.content?.queries?.[key]);
  const fetcherRef = useRef(fetcher);
  fetcherRef.current = fetcher;

  const data = queryState?.data || null;
  const isFetched = !!queryState?.fetchedAt;
  const isFresh =
    isFetched && data ? Date.now() - queryState.fetchedAt < staleTime : false;

  // Dispatch fetch if not present or stale
  useEffect(() => {
    if (!enabled) return;

    // Check if fetch is needed
    if (!queryState || !isFresh) {
      dispatch(
        fetchContentWithCache({
          key,
          fetcher: () => fetcherRef.current(),
          staleTime,
          force: false,
        })
      );
    }
  }, [key, isFresh, enabled, staleTime, dispatch]);

  const refetch = useCallback(
    (force = true) => {
      return dispatch(
        fetchContentWithCache({
          key,
          fetcher: () => fetcherRef.current(),
          staleTime,
          force,
        })
      );
    },
    [key, staleTime, dispatch]
  );

  return {
    data,
    // loading is true ONLY on the initial load when there is no cached data to display
    loading: !!(queryState?.loading && !data),
    isRefreshing: !!queryState?.isRefreshing,
    error: queryState?.error || null,
    isFresh,
    refetch,
  };
}

// ── Domain-Specific Hooks ────────────────────────────────────────

// Articles
export function useArticlesList(params = {}, options = {}) {
  const cleanParams = cleanQueryParams(params);
  return useCachedContent({
    type: 'articles_list',
    params: cleanParams,
    fetcher: () => getArticles(cleanParams),
    staleTime: STALE_TIMES.articles,
    ...options,
  });
}

export function useArticleDetail(slug, options = {}) {
  return useCachedContent({
    type: 'articles_detail',
    params: slug,
    fetcher: () => getArticleBySlug(slug),
    staleTime: STALE_TIMES.articles,
    enabled: !!slug,
    ...options,
  });
}

// Fatwas
export function useFatwasList(params = {}, options = {}) {
  const cleanParams = cleanQueryParams(params);
  return useCachedContent({
    type: 'fatwas_list',
    params: cleanParams,
    fetcher: () => getFatwas(cleanParams),
    staleTime: STALE_TIMES.fatwas,
    ...options,
  });
}

export function useFatwaDetail(slug, options = {}) {
  return useCachedContent({
    type: 'fatwas_detail',
    params: slug,
    fetcher: () => getFatwaBySlug(slug),
    staleTime: STALE_TIMES.fatwas,
    enabled: !!slug,
    ...options,
  });
}

// Questions / QA
export function useQuestionsList(params = {}, options = {}) {
  const cleanParams = cleanQueryParams(params);
  return useCachedContent({
    type: 'questions_list',
    params: cleanParams,
    fetcher: () => getPublicQuestions(cleanParams),
    staleTime: STALE_TIMES.questions,
    ...options,
  });
}

export function useQuestionDetail(slug, options = {}) {
  return useCachedContent({
    type: 'questions_detail',
    params: slug,
    fetcher: () => getQuestionBySlug(slug),
    staleTime: STALE_TIMES.questions,
    enabled: !!slug,
    ...options,
  });
}

// Publications (Books)
export function usePublicationsList(params = {}, options = {}) {
  const cleanParams = cleanQueryParams(params);
  return useCachedContent({
    type: 'publications_list',
    params: cleanParams,
    fetcher: () => getPublications(cleanParams),
    staleTime: STALE_TIMES.publications,
    ...options,
  });
}

export function useBookDetail(slug, options = {}) {
  return useCachedContent({
    type: 'publications_detail',
    params: slug,
    fetcher: () => getPublicationBySlug(slug),
    staleTime: STALE_TIMES.publications,
    enabled: !!slug,
    ...options,
  });
}

// Lectures
export function useLecturesList(params = {}, options = {}) {
  const cleanParams = cleanQueryParams(params);
  return useCachedContent({
    type: 'lectures_list',
    params: cleanParams,
    fetcher: () => getLectures(cleanParams),
    staleTime: STALE_TIMES.lectures,
    ...options,
  });
}

// Events
export function useEventsList(params = {}, options = {}) {
  const cleanParams = cleanQueryParams(params);
  return useCachedContent({
    type: 'events_list',
    params: cleanParams,
    fetcher: () => getEvents(cleanParams),
    staleTime: STALE_TIMES.events,
    ...options,
  });
}

// Content Counts
export function useContentCounts(options = {}) {
  return useCachedContent({
    type: 'content_counts',
    params: {},
    fetcher: () => getContentCounts(),
    staleTime: DEFAULT_STALE_TIME,
    ...options,
  });
}

