import { describe, it, expect, vi } from 'vitest';
import { renderHook, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useUserCircles, useCircleInfo, useCreateCircle } from '../../lib/hooks/useCircles';
import { useMemberInfo, useAddExpense } from '../../lib/hooks/useExpenses';

// Mock the StacksProvider
vi.mock('../../lib/StacksProvider', () => ({
  useStacks: () => ({
    userAddress: 'ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM',
    network: 'testnet',
    isConnected: true,
  }),
}));

// Mock contract functions
vi.mock('../../lib/contracts', () => ({
  getUserCircles: vi.fn().mockResolvedValue([]),
  getCircleInfo: vi.fn().mockResolvedValue(null),
  createCircle: vi.fn().mockResolvedValue({}),
  getMemberInfo: vi.fn().mockResolvedValue(null),
  addExpense: vi.fn().mockResolvedValue({}),
}));

// Mock Stacks Connect
vi.mock('@stacks/connect', () => ({
  openContractCall: vi.fn().mockResolvedValue({ txId: 'mock-tx-id' }),
}));

const createWrapper = () => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: { retry: false },
      mutations: { retry: false },
    },
  });
  
  return ({ children }: { children: React.ReactNode }) => (
    <QueryClientProvider client={queryClient}>
      {children}
    </QueryClientProvider>
  );
};

describe('React Query Hooks', () => {
  describe('useUserCircles', () => {
    it('should fetch user circles', async () => {
      const { result } = renderHook(() => useUserCircles(), {
        wrapper: createWrapper(),
      });

      await waitFor(() => {
        expect(result.current.isSuccess).toBe(true);
      });

      expect(result.current.data).toEqual([]);
    });
  });

  describe('useCircleInfo', () => {
    it('should fetch circle info when circleId is provided', async () => {
      const { result } = renderHook(() => useCircleInfo(1), {
        wrapper: createWrapper(),
      });

      await waitFor(() => {
        expect(result.current.isSuccess).toBe(true);
      });

      expect(result.current.data).toBeNull();
    });

    it('should not fetch when circleId is null', () => {
      const { result } = renderHook(() => useCircleInfo(null), {
        wrapper: createWrapper(),
      });

      expect(result.current.isIdle).toBe(true);
    });
  });

  describe('useCreateCircle', () => {
    it('should create circle mutation', () => {
      const { result } = renderHook(() => useCreateCircle(), {
        wrapper: createWrapper(),
      });

      expect(result.current.mutate).toBeDefined();
      expect(result.current.isIdle).toBe(true);
    });
  });

  describe('useMemberInfo', () => {
    it('should fetch member info when both circleId and address are provided', async () => {
      const { result } = renderHook(() => useMemberInfo(1, 'ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM'), {
        wrapper: createWrapper(),
      });

      await waitFor(() => {
        expect(result.current.isSuccess).toBe(true);
      });

      expect(result.current.data).toBeNull();
    });
  });

  describe('useAddExpense', () => {
    it('should create add expense mutation', () => {
      const { result } = renderHook(() => useAddExpense(), {
        wrapper: createWrapper(),
      });

      expect(result.current.mutate).toBeDefined();
      expect(result.current.isIdle).toBe(true);
    });
  });
});