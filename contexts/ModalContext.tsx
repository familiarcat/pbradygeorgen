'use client';

/**
 * Modal Context
 * 
 * A context provider for managing modals throughout the application.
 * This follows our shared philosophical frameworks:
 * - Salinger: Intuitive UX with consistent modal behavior
 * - Hesse: Mathematical harmony in modal management
 * - Derrida: Deconstruction of modal state
 * - Dante: Methodical logging of modal events
 */

import React, { createContext, useContext, useState, useCallback } from 'react';
import { DanteLogger } from '@/utils/DanteLogger';
import { HesseLogger } from '@/utils/HesseLogger';

// Define the modal types
export type ModalType = 'preview' | 'summary' | 'resume' | 'custom';

// Define the modal state
interface ModalState {
  isOpen: boolean;
  type: ModalType;
  props: Record<string, any>;
  zIndex: number;
}

// Define the modal context
interface ModalContextType {
  // Modal state
  openModals: ModalState[];
  
  // Modal actions
  openModal: (type: ModalType, props?: Record<string, any>) => void;
  closeModal: (type: ModalType) => void;
  closeAllModals: () => void;
  
  // Modal state getters
  isModalOpen: (type: ModalType) => boolean;
  getModalProps: (type: ModalType) => Record<string, any> | undefined;
  getModalZIndex: (type: ModalType) => number;
  
  // Modal state setters
  updateModalProps: (type: ModalType, props: Record<string, any>) => void;
}

// Create the modal context
const ModalContext = createContext<ModalContextType | undefined>(undefined);

// Base z-index for modals
const BASE_Z_INDEX = 1000;

/**
 * Modal Provider Component
 * 
 * Provides modal state and actions to the application.
 */
export const ModalProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // State for tracking open modals
  const [openModals, setOpenModals] = useState<ModalState[]>([]);

  // Open a modal
  const openModal = useCallback((type: ModalType, props: Record<string, any> = {}) => {
    DanteLogger.success.ux(`Opening modal: ${type}`);
    HesseLogger.summary.start(`Modal: ${type}`);
    
    setOpenModals(prevModals => {
      // Check if modal is already open
      const existingModalIndex = prevModals.findIndex(modal => modal.type === type);
      
      if (existingModalIndex >= 0) {
        // Update existing modal
        const updatedModals = [...prevModals];
        updatedModals[existingModalIndex] = {
          ...updatedModals[existingModalIndex],
          isOpen: true,
          props: { ...updatedModals[existingModalIndex].props, ...props }
        };
        return updatedModals;
      } else {
        // Add new modal
        return [
          ...prevModals,
          {
            isOpen: true,
            type,
            props,
            zIndex: BASE_Z_INDEX + prevModals.length
          }
        ];
      }
    });
  }, []);

  // Close a modal
  const closeModal = useCallback((type: ModalType) => {
    DanteLogger.success.ux(`Closing modal: ${type}`);
    HesseLogger.summary.complete(`Modal: ${type}`);
    
    setOpenModals(prevModals => {
      // Find the modal to close
      const modalIndex = prevModals.findIndex(modal => modal.type === type);
      
      if (modalIndex >= 0) {
        // Create a new array without the closed modal
        return prevModals.filter((_, index) => index !== modalIndex);
      }
      
      return prevModals;
    });
  }, []);

  // Close all modals
  const closeAllModals = useCallback(() => {
    DanteLogger.success.ux('Closing all modals');
    HesseLogger.summary.complete('All modals');
    
    setOpenModals([]);
  }, []);

  // Check if a modal is open
  const isModalOpen = useCallback((type: ModalType) => {
    return openModals.some(modal => modal.type === type && modal.isOpen);
  }, [openModals]);

  // Get modal props
  const getModalProps = useCallback((type: ModalType) => {
    const modal = openModals.find(modal => modal.type === type);
    return modal?.props;
  }, [openModals]);

  // Get modal z-index
  const getModalZIndex = useCallback((type: ModalType) => {
    const modal = openModals.find(modal => modal.type === type);
    return modal?.zIndex || BASE_Z_INDEX;
  }, [openModals]);

  // Update modal props
  const updateModalProps = useCallback((type: ModalType, props: Record<string, any>) => {
    setOpenModals(prevModals => {
      // Find the modal to update
      const modalIndex = prevModals.findIndex(modal => modal.type === type);
      
      if (modalIndex >= 0) {
        // Create a new array with the updated modal
        const updatedModals = [...prevModals];
        updatedModals[modalIndex] = {
          ...updatedModals[modalIndex],
          props: { ...updatedModals[modalIndex].props, ...props }
        };
        return updatedModals;
      }
      
      return prevModals;
    });
  }, []);

  // Create the context value
  const contextValue: ModalContextType = {
    openModals,
    openModal,
    closeModal,
    closeAllModals,
    isModalOpen,
    getModalProps,
    getModalZIndex,
    updateModalProps
  };

  // Provide the context to children
  return (
    <ModalContext.Provider value={contextValue}>
      {children}
    </ModalContext.Provider>
  );
};

/**
 * Use Modal Hook
 * 
 * A hook for accessing the modal context.
 */
export const useModal = () => {
  const context = useContext(ModalContext);
  
  if (context === undefined) {
    throw new Error('useModal must be used within a ModalProvider');
  }
  
  return context;
};

export default ModalContext;
