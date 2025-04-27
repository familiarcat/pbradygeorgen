'use client';

import React, { useState, useEffect, ReactNode } from 'react';
import styles from '@/styles/AxiomUI.module.css';

type TransitionType = 'fade' | 'slide' | 'scale' | 'rotate' | 'flip';
type TransitionDirection = 'up' | 'down' | 'left' | 'right' | 'none';

interface AxiomTransitionProps {
  children: ReactNode;
  show: boolean;
  type?: TransitionType;
  direction?: TransitionDirection;
  duration?: number;
  delay?: number;
  onComplete?: () => void;
  className?: string;
}

const AxiomTransition: React.FC<AxiomTransitionProps> = ({
  children,
  show,
  type = 'fade',
  direction = 'none',
  duration = 300,
  delay = 0,
  onComplete,
  className = '',
}) => {
  const [shouldRender, setShouldRender] = useState(show);
  const [isAnimating, setIsAnimating] = useState(false);
  
  useEffect(() => {
    let timer: NodeJS.Timeout;
    
    if (show) {
      // When showing, render immediately then animate in
      setShouldRender(true);
      
      // Start animation after a small delay to ensure DOM is ready
      timer = setTimeout(() => {
        setIsAnimating(true);
        
        // Call onComplete after animation finishes
        if (onComplete) {
          setTimeout(onComplete, duration);
        }
      }, 10);
    } else {
      // When hiding, animate out then stop rendering
      setIsAnimating(false);
      
      // Remove from DOM after animation completes
      timer = setTimeout(() => {
        setShouldRender(false);
        
        // Call onComplete after element is removed
        if (onComplete) {
          onComplete();
        }
      }, duration);
    }
    
    return () => clearTimeout(timer);
  }, [show, duration, onComplete]);
  
  // Don't render anything if we shouldn't
  if (!shouldRender) return null;
  
  // Determine the CSS classes based on transition type and direction
  const transitionClass = styles[`axiom-transition-${type}`] || '';
  const directionClass = direction !== 'none' ? styles[`axiom-direction-${direction}`] || '' : '';
  const stateClass = isAnimating ? styles['axiom-transition-active'] : styles['axiom-transition-inactive'];
  
  // Apply inline styles for custom duration and delay
  const inlineStyles = {
    '--axiom-transition-duration': `${duration}ms`,
    '--axiom-transition-delay': `${delay}ms`,
  } as React.CSSProperties;
  
  return (
    <div 
      className={`${styles.axiomTransition} ${transitionClass} ${directionClass} ${stateClass} ${className}`}
      style={inlineStyles}
    >
      {children}
    </div>
  );
};

export default AxiomTransition;
