'use client';

import React, { useState, useEffect, useRef, ReactNode } from 'react';
import { useAxiom } from './AxiomProvider';
import styles from '@/styles/AxiomUI.module.css';
import { DanteLogger } from '@/utils/DanteLogger';

interface AxiomContainerProps {
  id: string;
  children: ReactNode;
  initialPosition?: 'left' | 'right' | 'center' | 'top' | 'bottom';
  initialSize?: 'small' | 'medium' | 'large';
  priority?: number;
  onPositionChange?: (position: 'left' | 'right' | 'center' | 'top' | 'bottom') => void;
  onSizeChange?: (size: 'small' | 'medium' | 'large') => void;
  className?: string;
}

const AxiomContainer: React.FC<AxiomContainerProps> = ({
  id,
  children,
  initialPosition = 'center',
  initialSize = 'medium',
  priority = 1,
  onPositionChange,
  onSizeChange,
  className = '',
}) => {
  // Get Axiom context
  const { 
    registerChoice, 
    unregisterChoice, 
    updateChoice, 
    getOptimalPosition, 
    getOptimalSize 
  } = useAxiom();
  
  // State for current position and size
  const [position, setPosition] = useState<'left' | 'right' | 'center' | 'top' | 'bottom'>(initialPosition);
  const [size, setSize] = useState<'small' | 'medium' | 'large'>(initialSize);
  const [isTransitioning, setIsTransitioning] = useState(false);
  
  // Ref for the container element
  const containerRef = useRef<HTMLDivElement>(null);
  
  // Register this container with the Axiom system
  useEffect(() => {
    registerChoice(id, {
      position: initialPosition,
      size: initialSize,
      priority,
    });
    
    return () => {
      unregisterChoice(id);
    };
  }, [id, initialPosition, initialSize, priority, registerChoice, unregisterChoice]);
  
  // Update position based on Axiom's optimal position
  useEffect(() => {
    const optimalPosition = getOptimalPosition(id);
    
    if (optimalPosition !== position) {
      setIsTransitioning(true);
      
      // Notify about position change
      if (onPositionChange) {
        onPositionChange(optimalPosition);
      }
      
      // Update the position
      setPosition(optimalPosition);
      
      // Update the choice in the Axiom system
      updateChoice(id, { position: optimalPosition });
      
      // Log the transition
      DanteLogger.success.ux(`Axiom container ${id} transitioning to ${optimalPosition} position`);
      
      // Reset transitioning state after animation completes
      const timer = setTimeout(() => {
        setIsTransitioning(false);
      }, 300); // Match the CSS transition duration
      
      return () => clearTimeout(timer);
    }
  }, [id, position, getOptimalPosition, updateChoice, onPositionChange]);
  
  // Update size based on Axiom's optimal size
  useEffect(() => {
    const optimalSize = getOptimalSize(id);
    
    if (optimalSize !== size) {
      setIsTransitioning(true);
      
      // Notify about size change
      if (onSizeChange) {
        onSizeChange(optimalSize);
      }
      
      // Update the size
      setSize(optimalSize);
      
      // Update the choice in the Axiom system
      updateChoice(id, { size: optimalSize });
      
      // Log the transition
      DanteLogger.success.ux(`Axiom container ${id} transitioning to ${optimalSize} size`);
      
      // Reset transitioning state after animation completes
      const timer = setTimeout(() => {
        setIsTransitioning(false);
      }, 300); // Match the CSS transition duration
      
      return () => clearTimeout(timer);
    }
  }, [id, size, getOptimalSize, updateChoice, onSizeChange]);
  
  // Determine the CSS classes based on position and size
  const positionClass = styles[`axiom-position-${position}`] || '';
  const sizeClass = styles[`axiom-size-${size}`] || '';
  const transitionClass = isTransitioning ? styles['axiom-transitioning'] : '';
  
  return (
    <div 
      ref={containerRef}
      className={`${styles.axiomContainer} ${positionClass} ${sizeClass} ${transitionClass} ${className}`}
      data-axiom-id={id}
      data-axiom-position={position}
      data-axiom-size={size}
    >
      {children}
    </div>
  );
};

export default AxiomContainer;
