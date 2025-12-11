import { QueryClient } from '@tanstack/react-query';
import { handleContractError } from './errors';

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 30 * 1000, // 30 seconds
      cacheTime: 5 * 60 * 1000, // 5 minutes
      retry: (failureCount, error) => {
        // Don't retry on wallet errors
        if (error?.message?.includes('wallet') || error?.message?.includes('connect')) {
          return false;
        }
        // Retry up to 3 times for other errors
        return failureCount < 3;
      },
      retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
    },
    mutations: {
      retry: false, // Don't retry mutations by default
      onError: (error) => {
        console.error('Mutation error:', handleContractError(error));
      },
    },
  },
});

// Query keys factory for consistent cache management
export const queryKeys = {
  circles: (userAddress?: string) => ['circles', userAddress],
  circle: (circleId: number) => ['circle', circleId],
  member: (circleId: number, address?: string) => ['member', circleId, address],
  circleStats: (circleId: number) => ['circle-stats', circleId],
  transaction: (txId: string) => ['transaction', txId],
  transactions: (address: string) => ['transactions', address],
} as const;