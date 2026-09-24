import API from "./api";
import { SEARCH } from "@/constants/urls";

/**
 * Perform global search across all content types via centralized Atlas Search.
 *
 * @param {string} query - The search query (min 2 characters).
 * @param {Object} [options]
 * @param {number} [options.limit=10] - Max results to return.
 * @param {string} [options.contentType] - Optional content type filter ('article' | 'fatwa' | 'book' | 'lecture' | 'event' | 'question').
 * @param {AbortSignal} [options.signal] - Optional AbortSignal to cancel stale requests.
 * @returns {Promise<{ success: boolean, query: string, contentType: string, total: number, results: Array }>}
 */
export const globalSearch = async (
  query,
  { limit = 10, contentType, signal } = {}
) => {
  const trimmed = typeof query === "string" ? query.trim() : "";

  if (!trimmed || trimmed.length < 2) {
    return {
      success: true,
      query: trimmed,
      contentType: contentType || "all",
      total: 0,
      results: [],
    };
  }

  const params = {
    q: trimmed,
    limit,
  };

  if (contentType) {
    params.contentType = contentType;
  }

  const response = await API.get(SEARCH, {
    params,
    signal,
  });

  return response.data;
};
