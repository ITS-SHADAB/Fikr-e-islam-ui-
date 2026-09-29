import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

export const DEFAULT_STALE_TIME = 5 * 60 * 1000; // 5 minutes

export const STALE_TIMES = {
  articles: 5 * 60 * 1000,      // 5 minutes
  fatwas: 5 * 60 * 1000,        // 5 minutes
  publications: 5 * 60 * 1000,  // 5 minutes
  lectures: 5 * 60 * 1000,      // 5 minutes
  questions: 3 * 60 * 1000,     // 3 minutes
  events: 30 * 1000,            // 30 seconds (dynamic admin-managed resource, prevents render fetch storm)
  categories: 10 * 60 * 1000,   // 10 minutes (dynamic categories cached across components)
};

/**
 * Deterministic query key generator
 * Normalizes parameters by sorting keys and omitting undefined/null/empty strings.
 */
export const getQueryKey = (type, identifier = {}) => {
  if (typeof identifier === 'string' || typeof identifier === 'number') {
    return `${type}:${identifier}`;
  }

  const sorted = Object.keys(identifier || {})
    .sort()
    .reduce((acc, key) => {
      const val = identifier[key];
      if (val !== undefined && val !== null && val !== '') {
        acc[key] = val;
      }
      return acc;
    }, {});

  return `${type}:${JSON.stringify(sorted)}`;
};

/**
 * Async thunk for fetching content with built-in in-flight deduplication and freshness guard.
 */
export const fetchContentWithCache = createAsyncThunk(
  'content/fetchWithCache',
  async ({ key, fetcher }, { rejectWithValue }) => {
    try {
      const data = await fetcher();
      return { key, data, fetchedAt: Date.now() };
    } catch (err) {
      const message =
        err?.response?.data?.message || err?.message || 'Failed to fetch content';
      return rejectWithValue({ key, error: message });
    }
  },
  {
    condition: (
      { key, staleTime = DEFAULT_STALE_TIME, force = false },
      { getState }
    ) => {
      const { content } = getState();
      const entry = content?.queries?.[key];

      // 1. In-flight protection: if already fetching or revalidating, do not duplicate unless forced or stuck
      if (entry?.loading || entry?.isRefreshing) {
        if (force) {
          return true;
        }
        // Stale in-flight guard: if a request has been pending for > 15s (network dropped or hung), allow retry
        const elapsed = entry?.startedAt ? Date.now() - entry.startedAt : Infinity;
        if (elapsed > 15000) {
          return true;
        }
        return false;
      }

      // 2. Freshness check: if data exists and is fresh, do not fetch
      if (!force && entry?.fetchedAt && entry?.data) {
        const isFresh = Date.now() - entry.fetchedAt < staleTime;
        if (isFresh) {
          return false;
        }
      }

      // 3. Either no data or data is stale -> proceed with request
      return true;
    },
  }
);

const initialState = {
  queries: {},
};

const contentSlice = createSlice({
  name: 'content',
  initialState,
  reducers: {
    invalidateContentCache: (state, action) => {
      const { type, key } = action.payload || {};
      if (key && state.queries[key]) {
        delete state.queries[key];
      } else if (type) {
        Object.keys(state.queries).forEach((k) => {
          if (k.startsWith(`${type}:`)) {
            delete state.queries[k];
          }
        });
      }
    },
    clearContentCache: (state) => {
      state.queries = {};
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchContentWithCache.pending, (state, action) => {
        const { key } = action.meta.arg;
        const existing = state.queries[key];

        if (existing?.data) {
          // Stale-while-revalidate: keep cached data visible, trigger background refresh
          existing.isRefreshing = true;
          existing.error = null;
          existing.startedAt = Date.now();
        } else {
          // Initial fetch: no cached data yet
          state.queries[key] = {
            data: null,
            loading: true,
            isRefreshing: false,
            error: null,
            fetchedAt: null,
            startedAt: Date.now(),
          };
        }
      })
      .addCase(fetchContentWithCache.fulfilled, (state, action) => {
        const { key, data, fetchedAt } = action.payload;
        state.queries[key] = {
          data,
          loading: false,
          isRefreshing: false,
          error: null,
          fetchedAt,
          startedAt: null,
        };
      })
      .addCase(fetchContentWithCache.rejected, (state, action) => {
        // CRITICAL FIX: If this rejection was triggered by condition() returning false
        // (i.e. preventing a duplicate concurrent fetch), DO NOT overwrite in-flight state!
        // The original in-flight request is still running and will complete.
        if (action.meta?.condition) {
          return;
        }

        const key = action.payload?.key || action.meta?.arg?.key;
        const existing = state.queries[key];
        if (existing) {
          existing.loading = false;
          existing.isRefreshing = false;
          existing.startedAt = null;
          // Preserve valid cached data if present!
          existing.error =
            action.payload?.error || action.error?.message || 'Request failed';
        }
      });
  },
});

export const { invalidateContentCache, clearContentCache } = contentSlice.actions;

// Selectors
export const selectContentQuery = (state, key) =>
  state.content?.queries?.[key] || null;

export const selectContentData = (state, key) =>
  state.content?.queries?.[key]?.data || null;

export const selectContentStatus = (
  state,
  key,
  staleTime = DEFAULT_STALE_TIME
) => {
  const query = state.content?.queries?.[key];
  if (!query) {
    return {
      hasData: false,
      isFresh: false,
      loading: false,
      isRefreshing: false,
      error: null,
    };
  }
  const isFresh =
    query.fetchedAt && query.data
      ? Date.now() - query.fetchedAt < staleTime
      : false;

  return {
    hasData: !!query.data,
    isFresh,
    loading: query.loading,
    isRefreshing: query.isRefreshing,
    error: query.error,
  };
};

export default contentSlice.reducer;
