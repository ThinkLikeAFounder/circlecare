'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { AppConfig, UserSession, showConnect } from '@stacks/connect';

interface StacksContextType {
  userAddress: string | null;
  network: 'testnet' | 'mainnet';
  isConnected: boolean;
  connect: () => void;
  disconnect: () => void;
}

const StacksContext = createContext<StacksContextType | undefined>(undefined);

const appConfig = new AppConfig(['store_write', 'publish_data']);
const userSession = new UserSession({ appConfig });

export function StacksProvider({ children }: { children: ReactNode }) {
  const [userAddress, setUserAddress] = useState<string | null>(null);
  const [network] = useState<'testnet' | 'mainnet'>('testnet');
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    if (userSession.isSignInPending()) {
      userSession.handlePendingSignIn().then((userData) => {
        setUserAddress(userData.profile.stxAddress.testnet);
        setIsConnected(true);
      });
    } else if (userSession.isUserSignedIn()) {
      const userData = userSession.loadUserData();
      setUserAddress(userData.profile.stxAddress.testnet);
      setIsConnected(true);
    }
  }, []);

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

  return (
    <StacksContext.Provider value={{
      userAddress,
      network,
      isConnected,
      connect,
      disconnect,
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