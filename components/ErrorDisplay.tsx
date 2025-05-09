'use client';

/**
 * ErrorDisplay Component
 * 
 * This component displays errors according to the Derrida and Dante philosophies.
 * - Derrida: Deconstructing errors to reveal their underlying structure
 * - Dante: Categorizing errors into different "realms" of severity
 * 
 * Instead of hiding errors behind generic messages or fallbacks, this component
 * explicitly reveals the nature of errors to help developers understand and fix them.
 */

import React from 'react';
import { DanteLogger } from '@/utils/DanteLogger';

// Error severity levels inspired by Dante's realms
export enum ErrorRealm {
  INFERNO = 'inferno', // Critical errors (system failures, data corruption)
  PURGATORIO = 'purgatorio', // Recoverable errors (network issues, timeouts)
  LIMBO = 'limbo' // Minor errors or warnings (non-critical issues)
}

// Error categories inspired by Derrida's deconstruction
export enum ErrorCategory {
  STRUCTURAL = 'structural', // Errors in the application structure
  CONTENT = 'content', // Errors related to content processing
  NETWORK = 'network', // Network-related errors
  AUTHENTICATION = 'authentication', // Authentication/authorization errors
  VALIDATION = 'validation', // Data validation errors
  UNKNOWN = 'unknown' // Uncategorized errors
}

// Error interface
export interface ErrorInfo {
  message: string;
  realm: ErrorRealm;
  category: ErrorCategory;
  details?: any;
  timestamp?: string;
  code?: string;
  suggestions?: string[];
}

interface ErrorDisplayProps {
  error: ErrorInfo;
  onRetry?: () => void;
  onDismiss?: () => void;
  className?: string;
}

/**
 * ErrorDisplay component
 */
const ErrorDisplay: React.FC<ErrorDisplayProps> = ({
  error,
  onRetry,
  onDismiss,
  className = ''
}) => {
  // Log the error when the component mounts
  React.useEffect(() => {
    // Log the error using DanteLogger
    switch (error.realm) {
      case ErrorRealm.INFERNO:
        DanteLogger.error.system(`${error.category.toUpperCase()} ERROR: ${error.message}`, error.details);
        break;
      case ErrorRealm.PURGATORIO:
        DanteLogger.error.dataFlow(`${error.category.toUpperCase()} ERROR: ${error.message}`, error.details);
        break;
      case ErrorRealm.LIMBO:
        DanteLogger.warn.deprecated(`${error.category.toUpperCase()} WARNING: ${error.message}`, error.details);
        break;
    }
  }, [error]);

  // Get the appropriate emoji based on realm and category
  const getEmoji = () => {
    switch (error.realm) {
      case ErrorRealm.INFERNO:
        return '🔥'; // Fire for critical errors
      case ErrorRealm.PURGATORIO:
        return '⚠️'; // Warning for recoverable errors
      case ErrorRealm.LIMBO:
        return '💭'; // Thought bubble for minor issues
      default:
        return '❓'; // Question mark for unknown realm
    }
  };

  // Get the appropriate color based on realm
  const getRealmColor = () => {
    switch (error.realm) {
      case ErrorRealm.INFERNO:
        return 'bg-red-50 border-red-500 text-red-900';
      case ErrorRealm.PURGATORIO:
        return 'bg-yellow-50 border-yellow-500 text-yellow-900';
      case ErrorRealm.LIMBO:
        return 'bg-blue-50 border-blue-500 text-blue-900';
      default:
        return 'bg-gray-50 border-gray-500 text-gray-900';
    }
  };

  // Get the appropriate category icon
  const getCategoryIcon = () => {
    switch (error.category) {
      case ErrorCategory.STRUCTURAL:
        return '🏗️'; // Building construction for structural errors
      case ErrorCategory.CONTENT:
        return '📄'; // Document for content errors
      case ErrorCategory.NETWORK:
        return '🌐'; // Globe for network errors
      case ErrorCategory.AUTHENTICATION:
        return '🔒'; // Lock for authentication errors
      case ErrorCategory.VALIDATION:
        return '✅'; // Checkmark for validation errors
      case ErrorCategory.UNKNOWN:
      default:
        return '❓'; // Question mark for unknown category
    }
  };

  return (
    <div className={`border-l-4 p-4 mb-4 rounded-r ${getRealmColor()} ${className}`}>
      <div className="flex items-start">
        <div className="flex-shrink-0 text-2xl mr-3">
          {getEmoji()}
        </div>
        <div className="flex-1">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-medium">
              {error.category.charAt(0).toUpperCase() + error.category.slice(1)} Error
            </h3>
            <span className="text-sm opacity-75">
              {getCategoryIcon()} {error.realm.charAt(0).toUpperCase() + error.realm.slice(1)}
            </span>
          </div>
          <div className="mt-2">
            <p className="text-sm">{error.message}</p>
            {error.code && (
              <p className="text-xs mt-1 font-mono">Code: {error.code}</p>
            )}
            {error.timestamp && (
              <p className="text-xs mt-1 opacity-75">Time: {error.timestamp}</p>
            )}
            {error.suggestions && error.suggestions.length > 0 && (
              <div className="mt-3">
                <p className="text-xs font-semibold">Suggestions:</p>
                <ul className="list-disc list-inside text-xs mt-1">
                  {error.suggestions.map((suggestion, index) => (
                    <li key={index}>{suggestion}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>
          {(onRetry || onDismiss) && (
            <div className="mt-3 flex space-x-2">
              {onRetry && (
                <button
                  onClick={onRetry}
                  className="text-xs px-3 py-1 rounded bg-white border border-current hover:bg-gray-100"
                >
                  Retry
                </button>
              )}
              {onDismiss && (
                <button
                  onClick={onDismiss}
                  className="text-xs px-3 py-1 rounded bg-white border border-current hover:bg-gray-100"
                >
                  Dismiss
                </button>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ErrorDisplay;
