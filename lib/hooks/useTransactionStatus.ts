import { useQuery } from '@tanstack/react-query';
import { getNetwork } from '../stacks';
import { useStacks } from '../StacksProvider';
import { TransactionError, NetworkError, handleError } from '../errors';
import { toast } from '../toast';

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
      
      try {
        const baseUrl = network === 'testnet'
          ? 'https://api.testnet.hiro.so'
          : 'https://api.hiro.so';
        
        const response = await fetch(`${baseUrl}/extended/v1/tx/${txId}`);
        
        if (!response.ok) {
          if (response.status >= 500) {
            throw new NetworkError('Server error occurred');
          }
          throw new TransactionError(`Failed to fetch transaction: ${response.statusText}`, txId);
        }
        
        const data = await response.json();
        
        // Handle transaction status changes with notifications
        if (data.tx_status === 'success') {
          toast.success('Transaction confirmed successfully!');
        } else if (data.tx_status === 'abort_by_response' || data.tx_status === 'abort_by_post_condition') {
          toast.error('Transaction failed', 'Transaction Error');
        }
        
        return data;
      } catch (error) {
        if (error instanceof NetworkError || error instanceof TransactionError) {
          throw error;
        }
        throw new TransactionError('Failed to fetch transaction status', txId);
      }
    },
    enabled: !!txId,
    refetchInterval: (data) => {
      // Keep polling if pending
      if (data?.tx_status === 'pending') return 5000;
      return false;
    },
    onError: (error) => {
      handleError(error, 'Transaction Status');
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