/**
 * Axiom Selection Algorithm
 * 
 * This utility implements the mathematical concept of the Axiom of Choice
 * for UI selection and positioning. It provides functions to determine
 * optimal UI element placement, size, and priority based on user behavior
 * and content context.
 */

import { DanteLogger } from './DanteLogger';

// Types
export interface AxiomChoice {
  id: string;
  weight: number;
  position: 'left' | 'right' | 'center' | 'top' | 'bottom';
  size: 'small' | 'medium' | 'large';
  priority: number;
  lastSelected: number;
}

export interface UserInteraction {
  choiceId: string;
  timestamp: number;
  duration?: number;
}

/**
 * Calculate the optimal position for a UI element based on the Axiom of Choice
 */
export function calculateOptimalPosition(
  choice: AxiomChoice,
  allChoices: Record<string, AxiomChoice>,
  activeChoices: string[],
  screenWidth: number
): 'left' | 'right' | 'center' | 'top' | 'bottom' {
  // If this is a high priority choice, center it
  if (choice.priority > 2) {
    return 'center';
  }
  
  // Check for conflicts with other active choices
  const otherActiveChoices = activeChoices
    .filter(id => id !== choice.id)
    .map(id => allChoices[id])
    .filter(Boolean);
  
  // Count choices in each position
  const positionCounts = {
    left: otherActiveChoices.filter(c => c.position === 'left').length,
    right: otherActiveChoices.filter(c => c.position === 'right').length,
    center: otherActiveChoices.filter(c => c.position === 'center').length,
    top: otherActiveChoices.filter(c => c.position === 'top').length,
    bottom: otherActiveChoices.filter(c => c.position === 'bottom').length,
  };
  
  // On mobile, prefer top/bottom over left/right
  if (screenWidth < 768) {
    if (positionCounts.top < positionCounts.bottom) {
      return 'top';
    } else {
      return 'bottom';
    }
  }
  
  // On desktop, use left/right/center
  if (positionCounts.left <= positionCounts.right) {
    return 'left';
  } else {
    return 'right';
  }
}

/**
 * Calculate the optimal size for a UI element based on the Axiom of Choice
 */
export function calculateOptimalSize(
  choice: AxiomChoice,
  allChoices: Record<string, AxiomChoice>,
  activeChoices: string[],
  screenWidth: number
): 'small' | 'medium' | 'large' {
  // On mobile, prefer smaller sizes
  if (screenWidth < 768) {
    return 'small';
  }
  
  // Higher priority choices get larger sizes
  if (choice.priority > 2) {
    return 'large';
  }
  
  // Lower priority choices get smaller sizes
  if (choice.priority < 1) {
    return 'small';
  }
  
  return 'medium';
}

/**
 * Predict the next choice a user might make based on interaction history
 */
export function predictNextChoice(
  interactionHistory: UserInteraction[],
  allChoices: Record<string, AxiomChoice>
): string | null {
  if (interactionHistory.length < 2) {
    return null;
  }
  
  // Get the most recent interaction
  const lastInteraction = interactionHistory[interactionHistory.length - 1];
  
  // Count patterns in history
  const patterns: Record<string, number> = {};
  
  for (let i = 0; i < interactionHistory.length - 1; i++) {
    const current = interactionHistory[i].choiceId;
    const next = interactionHistory[i + 1].choiceId;
    
    const pattern = `${current}:${next}`;
    patterns[pattern] = (patterns[pattern] || 0) + 1;
  }
  
  // Find patterns that start with the last choice
  const relevantPatterns = Object.entries(patterns)
    .filter(([pattern]) => pattern.startsWith(`${lastInteraction.choiceId}:`))
    .sort((a, b) => b[1] - a[1]); // Sort by frequency
  
  if (relevantPatterns.length > 0) {
    // Extract the predicted next choice from the most frequent pattern
    const [pattern] = relevantPatterns[0];
    const predictedChoice = pattern.split(':')[1];
    
    // Only return if the choice exists
    if (allChoices[predictedChoice]) {
      DanteLogger.success.ux(`Axiom predicted next choice: ${predictedChoice}`);
      return predictedChoice;
    }
  }
  
  return null;
}

/**
 * Apply the Axiom of Choice to select one element from each set
 * This is a more direct implementation of the mathematical concept
 */
export function applyAxiomOfChoice<T>(
  sets: T[][],
  selectionCriteria: (item: T) => number
): T[] {
  // For each set, select the item with the highest criteria value
  return sets.map(set => {
    if (set.length === 0) {
      throw new Error('Cannot select from an empty set');
    }
    
    // Sort by selection criteria and take the first item
    return [...set].sort((a, b) => selectionCriteria(b) - selectionCriteria(a))[0];
  });
}

export default {
  calculateOptimalPosition,
  calculateOptimalSize,
  predictNextChoice,
  applyAxiomOfChoice
};
