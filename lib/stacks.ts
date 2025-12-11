import { StacksTestnet, StacksMainnet, StacksNetwork } from '@stacks/network';

export const FACTORY_CONTRACT = 'ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM.circle-factory';
export const TREASURY_CONTRACT = 'ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM.circle-treasury';

export function getNetwork(network: 'testnet' | 'mainnet'): StacksNetwork {
  return network === 'testnet' ? new StacksTestnet() : new StacksMainnet();
}