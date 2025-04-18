import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { DataStore } from 'aws-amplify';
import config from '../amplifyconfiguration.json';

// Create auth context
interface AuthContextType {
  user: any | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  signIn: (username: string, password: string) => Promise<any>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  isAuthenticated: false,
  isLoading: false,
  signIn: async () => null,
  signOut: async () => {},
});

// Create DataStore context
interface AmplifyContextType {
  dataStoreReady: boolean;
  networkStatus: string;
  clearDataStore: () => Promise<void>;
}

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

        // Modify the configuration to handle API connection errors
        const modifiedConfig = { ...config };

        // Always disable sync in web environments to prevent connection issues
        if (typeof window !== 'undefined') {
          console.log('Web environment detected, disabling sync to prevent connection issues');
          if (modifiedConfig.DataStore) {
            modifiedConfig.DataStore.sync = false;
          }
        }

        // Configure Amplify
        const Amplify = require('aws-amplify').Amplify;
        Amplify.configure(modifiedConfig);
        console.log('Amplify configured successfully');

        // Mark DataStore as ready
        setDataStoreReady(true);
      } catch (error) {
        console.error('Error initializing Amplify:', error);
        // Force ready state even on error
        setDataStoreReady(true);
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
      if (DataStore && typeof DataStore.clear === 'function') {
        await DataStore.clear();
        console.log('DataStore cleared successfully');
      } else {
        console.warn('DataStore or DataStore.clear is not available');
      }
    } catch (error) {
      console.error('Error clearing DataStore:', error);
    }
  };

  // Auth context value
  const authValue = {
    user,
    isAuthenticated: false,
    isLoading,
    signIn,
    signOut,
  };

  // Amplify context value
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
