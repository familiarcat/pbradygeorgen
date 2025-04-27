'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { DanteLogger } from '@/utils/DanteLogger';

// Define the types for our Axiom of Choice context
export interface AxiomChoice {
  id: string;
  weight: number;
  position: 'left' | 'right' | 'center' | 'top' | 'bottom';
  size: 'small' | 'medium' | 'large';
  priority: number;
  lastSelected: number;
}

export interface AxiomContextType {
  // Current UI state
  choices: Record<string, AxiomChoice>;
  activeChoices: string[];
  
  // Methods for managing choices
  registerChoice: (id: string, initialState?: Partial<AxiomChoice>) => void;
  unregisterChoice: (id: string) => void;
  updateChoice: (id: string, updates: Partial<AxiomChoice>) => void;
  selectChoice: (id: string) => void;
  
  // UI state helpers
  getOptimalPosition: (id: string) => 'left' | 'right' | 'center' | 'top' | 'bottom';
  getOptimalSize: (id: string) => 'small' | 'medium' | 'large';
  getPredictedNextChoice: () => string | null;
}

// Default values for the context
const defaultAxiomContext: AxiomContextType = {
  choices: {},
  activeChoices: [],
  registerChoice: () => {},
  unregisterChoice: () => {},
  updateChoice: () => {},
  selectChoice: () => {},
  getOptimalPosition: () => 'center',
  getOptimalSize: () => 'medium',
  getPredictedNextChoice: () => null,
};

// Create the context
const AxiomContext = createContext<AxiomContextType>(defaultAxiomContext);

// Hook for using the Axiom context
export const useAxiom = () => useContext(AxiomContext);

interface AxiomProviderProps {
  children: ReactNode;
}

export const AxiomProvider: React.FC<AxiomProviderProps> = ({ children }) => {
  // State for tracking UI choices
  const [choices, setChoices] = useState<Record<string, AxiomChoice>>({});
  const [activeChoices, setActiveChoices] = useState<string[]>([]);
  const [userInteractionHistory, setUserInteractionHistory] = useState<string[]>([]);

  // Register a new choice
  const registerChoice = (id: string, initialState?: Partial<AxiomChoice>) => {
    setChoices(prev => {
      // If choice already exists, don't overwrite it
      if (prev[id]) return prev;
      
      // Create a new choice with default values merged with initialState
      const newChoice: AxiomChoice = {
        id,
        weight: 1,
        position: 'center',
        size: 'medium',
        priority: 1,
        lastSelected: 0,
        ...initialState,
      };
      
      DanteLogger.success.ux(`Axiom choice registered: ${id}`);
      return { ...prev, [id]: newChoice };
    });
  };

  // Unregister a choice
  const unregisterChoice = (id: string) => {
    setChoices(prev => {
      const newChoices = { ...prev };
      delete newChoices[id];
      return newChoices;
    });
    
    setActiveChoices(prev => prev.filter(choiceId => choiceId !== id));
  };

  // Update a choice's properties
  const updateChoice = (id: string, updates: Partial<AxiomChoice>) => {
    setChoices(prev => {
      if (!prev[id]) return prev;
      
      return {
        ...prev,
        [id]: {
          ...prev[id],
          ...updates,
        },
      };
    });
  };

  // Select a choice (mark it as active)
  const selectChoice = (id: string) => {
    if (!choices[id]) return;
    
    // Update the choice's lastSelected timestamp
    updateChoice(id, { lastSelected: Date.now() });
    
    // Add to active choices if not already there
    setActiveChoices(prev => {
      if (prev.includes(id)) return prev;
      return [...prev, id];
    });
    
    // Add to user interaction history
    setUserInteractionHistory(prev => [...prev, id]);
    
    DanteLogger.success.ux(`Axiom choice selected: ${id}`);
  };

  // Get the optimal position for a UI element based on Axiom of Choice
  const getOptimalPosition = (id: string): 'left' | 'right' | 'center' | 'top' | 'bottom' => {
    const choice = choices[id];
    if (!choice) return 'center';
    
    // If this choice has a high priority, give it a more prominent position
    if (choice.priority > 2) {
      return 'center';
    }
    
    // Check if there are other active choices that might conflict
    const otherActiveChoices = activeChoices
      .filter(choiceId => choiceId !== id)
      .map(choiceId => choices[choiceId]);
    
    // If there are other active choices on the right, position this on the left
    const rightPositionedChoices = otherActiveChoices.filter(c => c.position === 'right');
    if (rightPositionedChoices.length > 0) {
      return 'left';
    }
    
    // If there are other active choices on the left, position this on the right
    const leftPositionedChoices = otherActiveChoices.filter(c => c.position === 'left');
    if (leftPositionedChoices.length > 0) {
      return 'right';
    }
    
    // Default to the choice's current position
    return choice.position;
  };

  // Get the optimal size for a UI element based on Axiom of Choice
  const getOptimalSize = (id: string): 'small' | 'medium' | 'large' => {
    const choice = choices[id];
    if (!choice) return 'medium';
    
    // Higher priority choices get larger sizes
    if (choice.priority > 2) {
      return 'large';
    }
    
    // Lower priority choices get smaller sizes
    if (choice.priority < 1) {
      return 'small';
    }
    
    // Default to the choice's current size
    return choice.size;
  };

  // Predict the next choice the user might make based on interaction history
  const getPredictedNextChoice = (): string | null => {
    if (userInteractionHistory.length < 2) return null;
    
    // Simple prediction: if user has selected A then B multiple times, predict B after A
    const lastChoice = userInteractionHistory[userInteractionHistory.length - 1];
    
    // Count patterns in history
    const patterns: Record<string, number> = {};
    
    for (let i = 0; i < userInteractionHistory.length - 1; i++) {
      const current = userInteractionHistory[i];
      const next = userInteractionHistory[i + 1];
      
      const pattern = `${current}:${next}`;
      patterns[pattern] = (patterns[pattern] || 0) + 1;
    }
    
    // Find patterns that start with the last choice
    const relevantPatterns = Object.entries(patterns)
      .filter(([pattern]) => pattern.startsWith(`${lastChoice}:`))
      .sort((a, b) => b[1] - a[1]); // Sort by frequency
    
    if (relevantPatterns.length > 0) {
      // Extract the predicted next choice from the most frequent pattern
      const [pattern] = relevantPatterns[0];
      const predictedChoice = pattern.split(':')[1];
      
      // Only return if the choice exists
      if (choices[predictedChoice]) {
        return predictedChoice;
      }
    }
    
    return null;
  };

  // Context value
  const contextValue: AxiomContextType = {
    choices,
    activeChoices,
    registerChoice,
    unregisterChoice,
    updateChoice,
    selectChoice,
    getOptimalPosition,
    getOptimalSize,
    getPredictedNextChoice,
  };

  return (
    <AxiomContext.Provider value={contextValue}>
      {children}
    </AxiomContext.Provider>
  );
};

export default AxiomProvider;
