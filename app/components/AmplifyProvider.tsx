import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { Amplify } from '../config/amplify-config';
import { configureAmplify } from '../config/amplify-config';

// Initialize Amplify
configureAmplify();

// Create context
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
  isLoading: true,
  signIn: async () => null,
  signOut: async () => {},
});

// Provider component
interface AmplifyProviderProps {
  children: ReactNode;
}

export const AmplifyProvider = ({ children }: AmplifyProviderProps) => {
  const [user, setUser] = useState<any | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check if user is already signed in
    checkUser();

    // Listen for auth events
    const listener = Hub.listen('auth', ({ payload: { event, data } }) => {
      switch (event) {
        case 'signIn':
          setUser(data);
          break;
        case 'signOut':
          setUser(null);
          break;
      }
    });

    return () => {
      // Cleanup listener
      listener();
    };
  }, []);

  const checkUser = async () => {
    try {
      console.log('Using mock Auth check for web deployment');
      // Always proceed as guest for web deployment
      setUser(null);
    } catch (error) {
      console.log('Auth check failed, proceeding as guest', error);
      setUser(null);
    } finally {
      setIsLoading(false);
    }
  };

  const signIn = async (username: string, password: string) => {
    try {
      console.log('Using mock signIn for web deployment');
      // Always return null for web deployment
      return null;
    } catch (error) {
      console.error('Error signing in:', error);
      throw error;
    }
  };

  const signOut = async () => {
    try {
      console.log('Using mock signOut for web deployment');
      // Do nothing for web deployment
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  const value = {
    user,
    isAuthenticated: !!user,
    isLoading,
    signIn,
    signOut,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

// Custom hook to use the auth context
export const useAuth = () => useContext(AuthContext);
