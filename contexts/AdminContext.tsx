'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { DanteLogger } from '@/utils/DanteLogger';

// Define the context type
interface AdminContextType {
  isAdminMode: boolean;
  toggleAdminMode: () => void;
  enableAdminMode: () => void;
  disableAdminMode: () => void;
}

// Create the context with a default value
const AdminContext = createContext<AdminContextType>({
  isAdminMode: false,
  toggleAdminMode: () => {},
  enableAdminMode: () => {},
  disableAdminMode: () => {},
});

// Custom hook to use the admin context
export const useAdmin = () => useContext(AdminContext);

// Provider component
interface AdminProviderProps {
  children: ReactNode;
}

export const AdminProvider: React.FC<AdminProviderProps> = ({ children }) => {
  // State for admin mode
  const [isAdminMode, setIsAdminMode] = useState<boolean>(false);
  
  // Load admin mode state from localStorage on mount
  useEffect(() => {
    // Only run in browser
    if (typeof window !== 'undefined') {
      try {
        const savedAdminMode = localStorage.getItem('alexai_admin_mode');
        if (savedAdminMode) {
          const isAdmin = JSON.parse(savedAdminMode);
          setIsAdminMode(isAdmin);
          
          if (isAdmin) {
            DanteLogger.info.system('Admin mode enabled from saved state');
          }
        }
      } catch (error) {
        DanteLogger.error.system('Error loading admin mode state', error);
      }
    }
  }, []);
  
  // Save admin mode state to localStorage when it changes
  useEffect(() => {
    // Only run in browser
    if (typeof window !== 'undefined') {
      try {
        localStorage.setItem('alexai_admin_mode', JSON.stringify(isAdminMode));
      } catch (error) {
        DanteLogger.error.system('Error saving admin mode state', error);
      }
    }
  }, [isAdminMode]);
  
  // Toggle admin mode
  const toggleAdminMode = () => {
    setIsAdminMode(prev => {
      const newState = !prev;
      DanteLogger.info.system(`Admin mode ${newState ? 'enabled' : 'disabled'}`);
      return newState;
    });
  };
  
  // Enable admin mode
  const enableAdminMode = () => {
    if (!isAdminMode) {
      setIsAdminMode(true);
      DanteLogger.info.system('Admin mode enabled');
    }
  };
  
  // Disable admin mode
  const disableAdminMode = () => {
    if (isAdminMode) {
      setIsAdminMode(false);
      DanteLogger.info.system('Admin mode disabled');
    }
  };
  
  // Provide the admin context to children
  return (
    <AdminContext.Provider value={{ isAdminMode, toggleAdminMode, enableAdminMode, disableAdminMode }}>
      {children}
    </AdminContext.Provider>
  );
};

// Export the context for direct usage
export default AdminContext;
