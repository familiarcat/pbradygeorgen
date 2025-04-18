import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { dataStoreSync } from '../services/DataStoreSync';

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
  syncStatus: string;
  clearDataStore: () => Promise<void>;
  forceSync: () => Promise<void>;
  initializeData: () => Promise<void>;
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
  syncStatus: 'not_started',
  clearDataStore: async () => {},
  forceSync: async () => {},
  initializeData: async () => {},
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
  const [syncStatus, setSyncStatus] = useState('not_started');

  // Initialize DataStoreSync service
  useEffect(() => {
    const initializeDataStore = async () => {
      try {
        console.log('Initializing DataStoreSync service');
        await dataStoreSync.initialize();
        console.log('DataStoreSync service initialized successfully');

        // Update initial status
        const status = dataStoreSync.getStatus();
        setDataStoreReady(status.isReady);
        setNetworkStatus(status.networkStatus);
        setSyncStatus(status.syncStatus);

        // Set up listener for status updates
        const removeListener = dataStoreSync.addListener((event) => {
          console.log('DataStoreSync event:', event);

          if (event.type === 'ready') {
            setDataStoreReady(true);
          } else if (event.type === 'networkStatus') {
            setNetworkStatus(event.status);
          } else if (['syncQueriesStarted', 'syncQueriesReady', 'fullSyncStarted', 'fullSyncCompleted'].includes(event.type)) {
            setSyncStatus(event.type);
          }
        });

        return () => {
          removeListener();
        };
      } catch (error) {
        console.error('Error initializing DataStoreSync service:', error);
      }
    };

    initializeDataStore();
  }, []);

  // Simple mock functions for auth
  const signIn = async () => {
    console.log('Mock signIn called');
    return null;
  };

  const signOut = async () => {
    console.log('Mock signOut called');
  };

  // DataStore functions - delegate to the DataStoreSync service
  const clearDataStore = async () => {
    try {
      await dataStoreSync.clear();
    } catch (error) {
      console.error('Error clearing DataStore:', error);
    }
  };

  // Force sync with remote
  const forceSync = async () => {
    try {
      await dataStoreSync.forceSync();
    } catch (error) {
      console.error('Error forcing DataStore sync:', error);
    }
  };

  // Initialize data if needed
  const initializeData = async () => {
    try {
      await dataStoreSync.initializeData();
    } catch (error) {
      console.error('Error initializing data:', error);
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
    syncStatus,
    clearDataStore,
    forceSync,
    initializeData,
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
