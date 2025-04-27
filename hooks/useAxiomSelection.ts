'use client';

import { useState, useEffect } from 'react';
import { useAxiom } from '@/components/axiom-ui/AxiomProvider';
import { DanteLogger } from '@/utils/DanteLogger';

interface AxiomSelectionOptions {
  id: string;
  choices: string[];
  initialSelection?: string | null;
  priority?: number;
  autoPredict?: boolean;
}

interface AxiomSelectionResult {
  selectedId: string | null;
  predictedId: string | null;
  isPredicting: boolean;
  selectChoice: (id: string) => void;
  clearSelection: () => void;
  getOptimalPosition: (id: string) => 'left' | 'right' | 'center' | 'top' | 'bottom';
  getOptimalSize: (id: string) => 'small' | 'medium' | 'large';
}

/**
 * Custom hook for implementing Axiom of Choice selection logic
 */
export function useAxiomSelection({
  id,
  choices,
  initialSelection = null,
  priority = 1,
  autoPredict = true,
}: AxiomSelectionOptions): AxiomSelectionResult {
  // Get Axiom context
  const { 
    registerChoice, 
    unregisterChoice, 
    selectChoice: axiomSelectChoice, 
    getPredictedNextChoice,
    getOptimalPosition,
    getOptimalSize
  } = useAxiom();
  
  // State for current selection
  const [selectedId, setSelectedId] = useState<string | null>(initialSelection);
  const [predictedId, setPredictedId] = useState<string | null>(null);
  const [isPredicting, setIsPredicting] = useState(false);
  
  // Register this selection group with the Axiom system
  useEffect(() => {
    registerChoice(id, { priority });
    
    return () => {
      unregisterChoice(id);
    };
  }, [id, priority, registerChoice, unregisterChoice]);
  
  // Update prediction when needed
  useEffect(() => {
    if (autoPredict && !selectedId) {
      const prediction = getPredictedNextChoice();
      
      // Only update if the prediction is one of our choices
      if (prediction && choices.includes(prediction)) {
        setPredictedId(prediction);
        setIsPredicting(true);
        
        DanteLogger.success.ux(`Axiom predicted next choice: ${prediction}`);
      } else {
        setPredictedId(null);
        setIsPredicting(false);
      }
    } else {
      setPredictedId(null);
      setIsPredicting(false);
    }
  }, [autoPredict, choices, selectedId, getPredictedNextChoice]);
  
  // Handle selection change
  const selectChoice = (id: string) => {
    setSelectedId(id);
    axiomSelectChoice(id);
    DanteLogger.success.ux(`Axiom selection changed to: ${id}`);
  };
  
  // Handle clearing selection
  const clearSelection = () => {
    setSelectedId(null);
  };
  
  return {
    selectedId,
    predictedId,
    isPredicting,
    selectChoice,
    clearSelection,
    getOptimalPosition,
    getOptimalSize
  };
}
