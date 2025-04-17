import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';

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
  isLoading: false,
  signIn: async () => null,
  signOut: async () => {},
});

// Provider component
interface AmplifyProviderProps {
  children: ReactNode;
}

export const AmplifyProvider = ({ children }: AmplifyProviderProps) => {
  // For web deployment, we'll use a simplified version without any Amplify dependencies
  const [user] = useState<any | null>(null);
  const [isLoading] = useState(false);

  // Simple mock functions
  const signIn = async () => {
    console.log('Mock signIn called');
    return null;
  };

  const signOut = async () => {
    console.log('Mock signOut called');
  };

  const value = {
    user,
    isAuthenticated: false,
    isLoading,
    signIn,
    signOut,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

// Custom hook to use the auth context
export const useAuth = () => useContext(AuthContext);
