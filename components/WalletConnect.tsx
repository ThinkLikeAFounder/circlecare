'use client';

import { useStacks } from '../lib/StacksProvider';

export function WalletConnect() {
  const {
    userAddress,
    network,
    isConnected,
    isLoading,
    connect,
    disconnect,
    switchNetwork,
  } = useStacks();

  const formatAddress = (address: string) => {
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  };

  if (isLoading) {
    return (
      <div className="flex items-center gap-2">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-gray-300 border-t-blue-600" />
        <span className="text-sm text-gray-600">Loading...</span>
      </div>
    );
  }

  if (!isConnected) {
    return (
      <button
        onClick={connect}
        className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
      >
        Connect Wallet
      </button>
    );
  }

  return (
    <div className="flex items-center gap-3">
      <select
        value={network}
        onChange={(e) => switchNetwork(e.target.value as 'testnet' | 'mainnet')}
        className="rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
      >
        <option value="testnet">Testnet</option>
        <option value="mainnet">Mainnet</option>
      </select>

      <div className="flex items-center gap-2 rounded-lg border border-gray-300 bg-white px-4 py-2">
        <div className="h-2 w-2 rounded-full bg-green-500" />
        <span className="text-sm font-medium text-gray-700">
          {formatAddress(userAddress!)}
        </span>
      </div>

      <button
        onClick={disconnect}
        className="rounded-lg border border-red-300 bg-white px-4 py-2 text-sm font-medium text-red-600 transition-colors hover:bg-red-50 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
      >
        Disconnect
      </button>
    </div>
  );
}
