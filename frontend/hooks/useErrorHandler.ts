'use client';

import { useCallback } from 'react';
import { handleError } from '@/lib/errors';

export function useErrorHandler() {
  const handleAsyncError = useCallback(
    async <T>(
      asyncFn: () => Promise<T>,
      context?: string,
      onError?: (error: unknown) => void
    ): Promise<T | null> => {
      try {
        return await asyncFn();
      } catch (error) {
        handleError(error, context);
        onError?.(error);
        return null;
      }
    },
    []
  );

  const handleSyncError = useCallback(
    <T>(
      syncFn: () => T,
      context?: string,
      onError?: (error: unknown) => void
    ): T | null => {
      try {
        return syncFn();
      } catch (error) {
        handleError(error, context);
        onError?.(error);
        return null;
      }
    },
    []
  );

  return {
    handleAsyncError,
    handleSyncError,
    handleError: (error: unknown, context?: string) => handleError(error, context),
  };
}