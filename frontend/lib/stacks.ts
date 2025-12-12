import { StacksTestnet, StacksMainnet, StacksNetwork } from '@stacks/network'

export const FACTORY_CONTRACT = process.env.NEXT_PUBLIC_FACTORY_CONTRACT || 'ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM.circle-factory'
export const TREASURY_CONTRACT = process.env.NEXT_PUBLIC_TREASURY_CONTRACT || 'ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM.circle-treasury'

export function getNetwork(network: 'testnet' | 'mainnet'): StacksNetwork {
  return network === 'testnet' ? new StacksTestnet() : new StacksMainnet()
}

export function getApiUrl(network: 'testnet' | 'mainnet'): string {
  return network === 'testnet' 
    ? 'https://api.testnet.hiro.so'
    : 'https://api.hiro.so'
}