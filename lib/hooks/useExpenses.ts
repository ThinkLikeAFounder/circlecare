import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useStacks } from '../StacksProvider';
import { getNetwork } from '../stacks';
import { addExpense, settleDebt, getMemberInfo, getCircleStats, AddExpenseParams, SettleDebtParams } from '../contracts';
import { openContractCall } from '@stacks/connect';
import { handleContractError, WalletError } from '../errors';
import { queryKeys } from '../queryClient';

export function useMemberInfo(circleId: number | null, memberAddress?: string) {
  const { network, userAddress } = useStacks();
  const address = memberAddress || userAddress;
  
  return useQuery({
    queryKey: queryKeys.member(circleId || 0, address),
    queryFn: async () => {
      if (!circleId || !address) return null;
      try {
        const stacksNetwork = getNetwork(network);
        return await getMemberInfo(circleId, address, stacksNetwork);
      } catch (error) {
        throw handleContractError(error);
      }
    },
    enabled: !!(circleId && address),
  });
}

export function useCircleStats(circleId: number | null) {
  const { network } = useStacks();
  
  return useQuery({
    queryKey: queryKeys.circleStats(circleId || 0),
    queryFn: async () => {
      if (!circleId) return null;
      try {
        const stacksNetwork = getNetwork(network);
        return await getCircleStats(circleId, stacksNetwork);
      } catch (error) {
        throw handleContractError(error);
      }
    },
    enabled: !!circleId,
  });
}

export function useAddExpense() {
  const { network, userAddress } = useStacks();
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (params: Omit<AddExpenseParams, 'network' | 'senderAddress'>) => {
      if (!userAddress) throw new WalletError('Wallet not connected');
      
      try {
        const stacksNetwork = getNetwork(network);
        const txOptions = await addExpense({
          ...params,
          network: stacksNetwork,
          senderAddress: userAddress,
        });

        return await openContractCall(txOptions);
      } catch (error) {
        throw handleContractError(error);
      }
    },
    onSuccess: (_, variables) => {
      // Invalidate relevant queries
      queryClient.invalidateQueries({ queryKey: queryKeys.circle(variables.circleId) });
      queryClient.invalidateQueries({ queryKey: queryKeys.member(variables.circleId) });
      queryClient.invalidateQueries({ queryKey: queryKeys.circleStats(variables.circleId) });
    },
  });
}

export function useSettleDebt() {
  const { network, userAddress } = useStacks();
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (params: Omit<SettleDebtParams, 'network' | 'senderAddress'>) => {
      if (!userAddress) throw new WalletError('Wallet not connected');
      
      try {
        const stacksNetwork = getNetwork(network);
        const txOptions = await settleDebt({
          ...params,
          network: stacksNetwork,
          senderAddress: userAddress,
        });

        return await openContractCall(txOptions);
      } catch (error) {
        throw handleContractError(error);
      }
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.circle(variables.circleId) });
      queryClient.invalidateQueries({ queryKey: queryKeys.member(variables.circleId) });
      queryClient.invalidateQueries({ queryKey: queryKeys.circleStats(variables.circleId) });
    },
  });
}