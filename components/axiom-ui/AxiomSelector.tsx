'use client';

import React, { useState, useEffect, ReactNode } from 'react';
import { useAxiom } from './AxiomProvider';
import styles from '@/styles/AxiomUI.module.css';
import { DanteLogger } from '@/utils/DanteLogger';

interface AxiomSelectorProps {
  children: ReactNode | ((selectedId: string | null) => ReactNode);
  choices: string[];
  initialSelection?: string | null;
  onSelectionChange?: (selectedId: string | null) => void;
  autoPredict?: boolean;
  className?: string;
}

const AxiomSelector: React.FC<AxiomSelectorProps> = ({
  children,
  choices,
  initialSelection = null,
  onSelectionChange,
  autoPredict = true,
  className = '',
}) => {
  // Get Axiom context
  const { selectChoice, getPredictedNextChoice } = useAxiom();
  
  // State for current selection
  const [selectedId, setSelectedId] = useState<string | null>(initialSelection);
  const [predictedId, setPredictedId] = useState<string | null>(null);
  const [isPredicting, setIsPredicting] = useState(false);
  
  // Register all choices with the Axiom system
  useEffect(() => {
    // When choices change, update the selected ID if it's no longer valid
    if (selectedId && !choices.includes(selectedId)) {
      setSelectedId(null);
    }
  }, [choices, selectedId]);
  
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
  const handleSelect = (id: string) => {
    setSelectedId(id);
    selectChoice(id);
    
    if (onSelectionChange) {
      onSelectionChange(id);
    }
    
    DanteLogger.success.ux(`Axiom selection changed to: ${id}`);
  };
  
  // Handle clearing selection
  const handleClear = () => {
    setSelectedId(null);
    
    if (onSelectionChange) {
      onSelectionChange(null);
    }
  };
  
  // Render children based on selection
  const renderContent = () => {
    if (typeof children === 'function') {
      return children(selectedId);
    }
    
    return children;
  };
  
  return (
    <div 
      className={`${styles.axiomSelector} ${isPredicting ? styles.axiomPredicting : ''} ${className}`}
      data-axiom-selected={selectedId || ''}
      data-axiom-predicted={predictedId || ''}
    >
      {renderContent()}
      
      {/* Prediction indicator */}
      {isPredicting && predictedId && (
        <div className={styles.axiomPredictionIndicator}>
          <span className={styles.axiomPredictionDot}></span>
          <span className={styles.axiomPredictionLabel}>Suggested Next</span>
        </div>
      )}
    </div>
  );
};

export default AxiomSelector;
