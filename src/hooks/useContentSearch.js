import { useState, useEffect, useRef, useMemo } from 'react';
import { globalSearch } from '@/services/search';

/**
 * Normalizers to map SearchDocument results from GET /api/search
 * to the exact shape expected by page card components.
 */
export const normalizeSearchResult = (item) => {
  if (!item) return null;

  switch (item.type?.toLowerCase()) {
    case 'article':
      return {
        _id: item.id,
        id: item.id,
        title: item.title,
        slug: item.slug,
        category: item.category,
        summary: item.description,
        featuredImage: item.image,
        publishDate: item.date,
        author: item.author,
        url: item.url,
      };

    case 'fatwa':
      return {
        _id: item.id,
        id: item.id,
        title: item.title,
        slug: item.slug,
        category: item.category,
        question: item.description,
        summary: item.description,
        publishDate: item.date,
        url: item.url,
      };

    case 'book':
      return {
        _id: item.id,
        id: item.id,
        title: item.title,
        slug: item.slug,
        category: item.category,
        summary: item.description,
        coverImage: item.image,
        author: item.author,
        publishDate: item.date,
        url: item.url,
      };

    case 'question':
      return {
        _id: item.id,
        id: item.id,
        slug: item.slug,
        questionTitle: item.title,
        detailedQuestion: item.description,
        answerContent: item.description,
        category: item.category,
        answeredAt: item.date,
        createdAt: item.date,
        url: item.url,
      };

    case 'lecture':
      return {
        _id: item.id,
        id: item.id,
        title: item.title,
        description: item.description,
        category: item.category,
        videoUrl: item.url,
        thumbnail: item.image,
        publishDate: item.date,
      };

    case 'event':
      return {
        _id: item.id,
        id: item.id,
        title: item.title,
        description: item.description,
        posterImage: item.image,
        eventDate: item.date,
        location: item.description,
        url: item.url,
      };

    default:
      return {
        _id: item.id,
        id: item.id,
        title: item.title,
        description: item.description,
        slug: item.slug,
        category: item.category,
        image: item.image,
        date: item.date,
        url: item.url,
      };
  }
};

/**
 * Universal Hook for Centralized Global Search on Content Pages
 * Handles:
 * - 350ms debouncing
 * - In-flight request cancellation via AbortController
 * - Minimum query length of 2 characters
 * - State handling (loading, error, results)
 * - Result normalization
 *
 * @param {Object} options
 * @param {'article' | 'fatwa' | 'book' | 'question' | 'lecture' | 'event'} options.contentType
 * @param {number} [options.limit=12]
 * @param {number} [options.debounceMs=350]
 */
export function useContentSearch({
  contentType,
  limit = 12,
  debounceMs = 350,
} = {}) {
  const [searchTerm, setSearchTerm] = useState('');
  const [debouncedQuery, setDebouncedQuery] = useState('');
  const [rawResults, setRawResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const [searchError, setSearchError] = useState(null);
  const abortControllerRef = useRef(null);

  // Debounce the input query
  useEffect(() => {
    const trimmed = searchTerm.trim();
    if (!trimmed || trimmed.length < 2) {
      setDebouncedQuery('');
      setRawResults([]);
      setIsSearching(false);
      setSearchError(null);
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
        abortControllerRef.current = null;
      }
      return;
    }

    const timer = setTimeout(() => {
      setDebouncedQuery(trimmed);
    }, debounceMs);

    return () => clearTimeout(timer);
  }, [searchTerm, debounceMs]);

  // Execute global search with contentType
  useEffect(() => {
    if (!debouncedQuery || debouncedQuery.length < 2) {
      setRawResults([]);
      setIsSearching(false);
      setSearchError(null);
      return;
    }

    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }

    const controller = new AbortController();
    abortControllerRef.current = controller;
    setIsSearching(true);
    setSearchError(null);

    globalSearch(debouncedQuery, {
      contentType,
      limit,
      signal: controller.signal,
    })
      .then((res) => {
        if (!controller.signal.aborted) {
          const results = Array.isArray(res?.results) ? res.results : [];
          setRawResults(results);
          setIsSearching(false);
        }
      })
      .catch((err) => {
        if (
          err.name === 'CanceledError' ||
          err.code === 'ERR_CANCELED' ||
          controller.signal.aborted
        ) {
          return;
        }
        console.error(`[Search Error] ${contentType}:`, err);
        setSearchError(
          err?.response?.data?.message || err?.message || 'Search failed'
        );
        setIsSearching(false);
      });

    return () => {
      controller.abort();
    };
  }, [debouncedQuery, contentType, limit]);

  // Map to normalized data
  const normalizedResults = useMemo(() => {
    return rawResults.map(normalizeSearchResult).filter(Boolean);
  }, [rawResults]);

  const clearSearch = () => {
    setSearchTerm('');
    setDebouncedQuery('');
    setRawResults([]);
    setIsSearching(false);
    setSearchError(null);
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
      abortControllerRef.current = null;
    }
  };

  return {
    searchTerm,
    setSearchTerm,
    debouncedQuery,
    searchResults: normalizedResults,
    rawResults,
    isSearching,
    searchError,
    clearSearch,
    isSearchActive: debouncedQuery.length >= 2,
  };
}
