'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { AppConfig, UserSession, showConnect } from '@stacks/connect';

interface StacksContextType {
  userAddress: string | null;
  network: 'testnet' | 'mainnet';
  isConnected: boolean;
  isLoading: boolean;
  connect: () => void;
  disconnect: () => void;
  switchNetwork: (newNetwork: 'testnet' | 'mainnet') => void;
}

const StacksContext = createContext<StacksContextType | undefined>(undefined);

const appConfig = new AppConfig(['store_write', 'publish_data']);
const userSession = new UserSession({ appConfig });

const NETWORK_STORAGE_KEY = 'circlecare_network';

export function StacksProvider({ children }: { children: ReactNode }) {
  const [userAddress, setUserAddress] = useState<string | null>(null);
  const [network, setNetwork] = useState<'testnet' | 'mainnet'>('testnet');
  const [isConnected, setIsConnected] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Load saved network preference
    const savedNetwork = localStorage.getItem(NETWORK_STORAGE_KEY);
    if (savedNetwork === 'mainnet' || savedNetwork === 'testnet') {
      setNetwork(savedNetwork);
    }

    // Check for pending sign in or existing session
    if (userSession.isSignInPending()) {
      userSession.handlePendingSignIn().then((userData) => {
        const address = network === 'mainnet'
          ? userData.profile.stxAddress.mainnet
          : userData.profile.stxAddress.testnet;
        setUserAddress(address);
        setIsConnected(true);
        setIsLoading(false);
      }).catch(() => {
        setIsLoading(false);
      });
    } else if (userSession.isUserSignedIn()) {
      const userData = userSession.loadUserData();
      const address = network === 'mainnet'
        ? userData.profile.stxAddress.mainnet
        : userData.profile.stxAddress.testnet;
      setUserAddress(address);
      setIsConnected(true);
      setIsLoading(false);
    } else {
      setIsLoading(false);
    }
  }, [network]);

  const connect = () => {
    showConnect({
      appDetails: {
        name: 'CircleCare',
        icon: '/icon.png',
      },
      redirectTo: '/',
      onFinish: () => {
        window.location.reload();
      },
      userSession,
    });
  };

  const disconnect = () => {
    userSession.signUserOut();
    setUserAddress(null);
    setIsConnected(false);
  };

  const switchNetwork = (newNetwork: 'testnet' | 'mainnet') => {
    setNetwork(newNetwork);
    localStorage.setItem(NETWORK_STORAGE_KEY, newNetwork);

    // Update address if user is connected
    if (userSession.isUserSignedIn()) {
      const userData = userSession.loadUserData();
      const address = newNetwork === 'mainnet'
        ? userData.profile.stxAddress.mainnet
        : userData.profile.stxAddress.testnet;
      setUserAddress(address);
    }
  };

  return (
    <StacksContext.Provider value={{
      userAddress,
      network,
      isConnected,
      isLoading,
      connect,
      disconnect,
      switchNetwork,
    }}>
      {children}
    </StacksContext.Provider>
  );
}

export function useStacks() {
  const context = useContext(StacksContext);
  if (context === undefined) {
    throw new Error('useStacks must be used within a StacksProvider');
  }
  return context;
}