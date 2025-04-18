import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { Amplify, DataStore } from 'aws-amplify';
import config from '../amplifyconfiguration.json';

// Create context
interface AuthContextType {
  user: any | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  signIn: (username: string, password: string) => Promise<any>;
  signOut: () => Promise<void>;
}

interface AmplifyContextType {
  dataStoreReady: boolean;
  networkStatus: string;
  clearDataStore: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  isAuthenticated: false,
  isLoading: false,
  signIn: async () => null,
  signOut: async () => {},
});

const AmplifyContext = createContext<AmplifyContextType>({
  dataStoreReady: false,
  networkStatus: 'unknown',
  clearDataStore: async () => {},
});

// Provider component
interface AmplifyProviderProps {
  children: ReactNode;
}

export const AmplifyProvider = ({ children }: AmplifyProviderProps) => {
  // For web deployment, we'll use a simplified version without any Amplify dependencies
  const [user] = useState<any | null>(null);
  const [isLoading] = useState(false);
  const [dataStoreReady, setDataStoreReady] = useState(false);
  const [networkStatus, setNetworkStatus] = useState('unknown');

  // Initialize Amplify with our configuration
  useEffect(() => {
    const initializeAmplify = async () => {
      try {
        console.log('Initializing Amplify with configuration');
        Amplify.configure(config);
        console.log('Amplify configured successfully');

        // Set up DataStore listeners
        const subscription = DataStore.observe('datastore').subscribe({
          next: (msg) => {
            console.log('DataStore event:', msg.payload);
            const { event, data } = msg.payload;

            if (event === 'ready') {
              console.log('DataStore is ready');
              setDataStoreReady(true);
            } else if (event === 'networkStatus' && data && typeof data === 'object' && 'active' in data) {
              const status = data.active ? 'online' : 'offline';
              console.log(`Network status: ${status}`);
              setNetworkStatus(status);
            }
          },
          error: (error) => {
            console.error('DataStore subscription error:', error);
          }
        });

        return () => {
          subscription.unsubscribe();
        };
      } catch (error) {
        console.error('Error initializing Amplify:', error);
      }
    };

    initializeAmplify();
  }, []);

  // Simple mock functions for auth
  const signIn = async () => {
    console.log('Mock signIn called');
    return null;
  };

  const signOut = async () => {
    console.log('Mock signOut called');
  };

  // DataStore functions
  const clearDataStore = async () => {
    try {
      console.log('Clearing DataStore');
      await DataStore.clear();
      console.log('DataStore cleared successfully');
    } catch (error) {
      console.error('Error clearing DataStore:', error);
    }
  };

  const authValue = {
    user,
    isAuthenticated: false,
    isLoading,
    signIn,
    signOut,
  };

  const amplifyValue = {
    dataStoreReady,
    networkStatus,
    clearDataStore,
  };

  return (
    <AuthContext.Provider value={authValue}>
      <AmplifyContext.Provider value={amplifyValue}>
        {children}
      </AmplifyContext.Provider>
    </AuthContext.Provider>
  );
};

// Custom hooks to use the contexts
export const useAuth = () => useContext(AuthContext);
export const useAmplify = () => useContext(AmplifyContext);
