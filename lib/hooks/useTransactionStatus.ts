import { useQuery } from '@tanstack/react-query';
import { getNetwork } from '../stacks';
import { useStacks } from '../StacksProvider';

export interface TransactionStatus {
  tx_id: string;
  tx_status: 'pending' | 'success' | 'abort_by_response' | 'abort_by_post_condition';
  tx_result: {
    hex: string;
    repr: string;
  };
  block_height?: number;
  burn_block_time?: number;
  canonical: boolean;
  microblock_canonical: boolean;
}

export function useTransactionStatus(txId: string | null) {
  const { network } = useStacks();
  
  return useQuery<TransactionStatus | null>({
    queryKey: ['transaction', txId],
    queryFn: async () => {
      if (!txId) return null;
      
      const baseUrl = network === 'testnet'
        ? 'https://api.testnet.hiro.so'
        : 'https://api.hiro.so';
      
      const response = await fetch(`${baseUrl}/extended/v1/tx/${txId}`);
      if (!response.ok) {
        throw new Error('Failed to fetch transaction status');
      }
      return response.json();
    },
    enabled: !!txId,
    refetchInterval: (data) => {
      // Keep polling if pending
      if (data?.tx_status === 'pending') return 5000;
      return false;
    },
  });
}

export function useTransactionHistory(address: string | null) {
  const { network } = useStacks();
  
  return useQuery({
    queryKey: ['transactions', address],
    queryFn: async () => {
      if (!address) return [];
      
      const baseUrl = network === 'testnet'
        ? 'https://api.testnet.hiro.so'
        : 'https://api.hiro.so';
      
      const response = await fetch(`${baseUrl}/extended/v1/address/${address}/transactions`);
      if (!response.ok) {
        throw new Error('Failed to fetch transaction history');
      }
      return response.json();
    },
    enabled: !!address,
  });
}