import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useStacks } from '../StacksProvider';
import { getNetwork } from '../stacks';
import { 
  getUserCircles, 
  getCircleInfo, 
  createCircle,
  CreateCircleParams 
} from '../contracts';
import { openContractCall } from '@stacks/connect';
import { handleContractError, WalletError } from '../errors';
import { queryKeys } from '../queryClient';

export function useUserCircles() {
  const { userAddress, network } = useStacks();
  
  return useQuery({
    queryKey: queryKeys.circles(userAddress || undefined),
    queryFn: async () => {
      if (!userAddress) return [];
      try {
        const stacksNetwork = getNetwork(network);
        return await getUserCircles(userAddress, stacksNetwork);
      } catch (error) {
        throw handleContractError(error);
      }
    },
    enabled: !!userAddress,
  });
}

export function useCircleInfo(circleId: number | null) {
  const { network } = useStacks();
  
  return useQuery({
    queryKey: queryKeys.circle(circleId || 0),
    queryFn: async () => {
      if (!circleId) return null;
      try {
        const stacksNetwork = getNetwork(network);
        return await getCircleInfo(circleId, stacksNetwork);
      } catch (error) {
        throw handleContractError(error);
      }
    },
    enabled: !!circleId,
  });
}

export function useCreateCircle() {
  const { network, userAddress } = useStacks();
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (params: Omit<CreateCircleParams, 'network' | 'senderAddress'>) => {
      if (!userAddress) throw new WalletError('Wallet not connected');
      
      try {
        const stacksNetwork = getNetwork(network);
        const txOptions = await createCircle({
          ...params,
          network: stacksNetwork,
          senderAddress: userAddress,
        });

        return await openContractCall(txOptions);
      } catch (error) {
        throw handleContractError(error);
      }
    },
    onSuccess: () => {
      // Invalidate circles cache to refetch
      queryClient.invalidateQueries({ queryKey: queryKeys.circles() });
    },
  });
}