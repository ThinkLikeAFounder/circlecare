import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useStacks } from '../StacksProvider';
import { getNetwork } from '../stacks';
import { addExpense, settleDebt, getMemberInfo, getCircleStats, AddExpenseParams, SettleDebtParams } from '../contracts';
import { openContractCall } from '@stacks/connect';

export function useMemberInfo(circleId: number | null, memberAddress?: string) {
  const { network, userAddress } = useStacks();
  const address = memberAddress || userAddress;
  
  return useQuery({
    queryKey: ['member', circleId, address],
    queryFn: async () => {
      if (!circleId || !address) return null;
      const stacksNetwork = getNetwork(network);
      return getMemberInfo(circleId, address, stacksNetwork);
    },
    enabled: !!(circleId && address),
  });
}

export function useCircleStats(circleId: number | null) {
  const { network } = useStacks();
  
  return useQuery({
    queryKey: ['circle-stats', circleId],
    queryFn: async () => {
      if (!circleId) return null;
      const stacksNetwork = getNetwork(network);
      return getCircleStats(circleId, stacksNetwork);
    },
    enabled: !!circleId,
  });
}

export function useAddExpense() {
  const { network, userAddress } = useStacks();
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (params: Omit<AddExpenseParams, 'network' | 'senderAddress'>) => {
      if (!userAddress) throw new Error('Wallet not connected');
      
      const stacksNetwork = getNetwork(network);
      const txOptions = await addExpense({
        ...params,
        network: stacksNetwork,
        senderAddress: userAddress,
      });

      return openContractCall(txOptions);
    },
    onSuccess: (_, variables) => {
      // Invalidate relevant queries
      queryClient.invalidateQueries({ queryKey: ['circle', variables.circleId] });
      queryClient.invalidateQueries({ queryKey: ['member', variables.circleId] });
      queryClient.invalidateQueries({ queryKey: ['circle-stats', variables.circleId] });
    },
  });
}

export function useSettleDebt() {
  const { network, userAddress } = useStacks();
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (params: Omit<SettleDebtParams, 'network' | 'senderAddress'>) => {
      if (!userAddress) throw new Error('Wallet not connected');
      
      const stacksNetwork = getNetwork(network);
      const txOptions = await settleDebt({
        ...params,
        network: stacksNetwork,
        senderAddress: userAddress,
      });

      return openContractCall(txOptions);
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['circle', variables.circleId] });
      queryClient.invalidateQueries({ queryKey: ['member'] });
      queryClient.invalidateQueries({ queryKey: ['circle-stats', variables.circleId] });
    },
  });
}