import { lazy } from 'react';

/**
 * Resilient lazy loader for code-split React components in Vite SPAs.
 * Handles transient network dropouts and deployment chunk hash mismatches.
 *
 * Flow:
 * 1. Attempt dynamic import.
 * 2. If it fails, retry once after a 500ms delay.
 * 3. If retry still fails and session has not yet auto-refreshed, force page reload to fetch new HTML chunk manifest.
 * 4. Otherwise, rethrow to be caught gracefully by Route ErrorBoundary.
 */
export function lazyWithRetry(componentImport) {
  return lazy(async () => {
    try {
      return await componentImport();
    } catch (firstError) {
      // First retry after a short pause
      try {
        await new Promise((resolve) => setTimeout(resolve, 500));
        return await componentImport();
      } catch (secondError) {
        const isChunkError =
          secondError?.name === 'ChunkLoadError' ||
          secondError?.message?.includes('dynamically imported module') ||
          secondError?.message?.includes('Failed to fetch');

        if (isChunkError && typeof window !== 'undefined') {
          const hasRefreshed = sessionStorage.getItem('chunk_retry_refreshed');
          if (!hasRefreshed) {
            sessionStorage.setItem('chunk_retry_refreshed', 'true');
            window.location.reload();
            return new Promise(() => {}); // prevent throwing before reload triggers
          }
        }

        throw secondError;
      }
    }
  });
}

export default lazyWithRetry;
