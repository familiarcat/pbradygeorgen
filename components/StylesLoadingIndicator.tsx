'use client';

import React, { useEffect, useState } from 'react';

interface StylesLoadingIndicatorProps {
  message?: string;
}

export default function StylesLoadingIndicator({ message = 'Loading PDF styles...' }: StylesLoadingIndicatorProps) {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    // Check if styles are already loaded
    if (document.body.classList.contains('pdf-styles-loaded')) {
      setIsVisible(false);
      return;
    }

    // Listen for the styles loaded event
    const handleStylesLoaded = () => {
      // Add a small delay for the animation
      setTimeout(() => {
        setIsVisible(false);
      }, 500);
    };

    document.addEventListener('pdf-styles-loaded', handleStylesLoaded);

    return () => {
      document.removeEventListener('pdf-styles-loaded', handleStylesLoaded);
    };
  }, []);

  if (!isVisible) return null;

  return (
    <div className="styles-loading-indicator">
      <div className="spinner"></div>
      <p>{message}</p>
      <style jsx>{`
        .styles-loading-indicator {
          position: fixed;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: center;
          background-color: rgba(255, 255, 255, 0.9);
          z-index: 9999;
          transition: opacity 0.5s ease;
        }
        
        .spinner {
          width: 40px;
          height: 40px;
          border: 4px solid rgba(0, 0, 0, 0.1);
          border-radius: 50%;
          border-top-color: var(--pdf-primary-color, #3a6ea5);
          animation: spin 1s ease-in-out infinite;
          margin-bottom: 1rem;
        }
        
        @keyframes spin {
          to {
            transform: rotate(360deg);
          }
        }
        
        p {
          font-family: var(--pdf-body-font, Arial, sans-serif);
          color: var(--pdf-text-color, #333333);
          font-size: 1rem;
          margin: 0;
        }
      `}</style>
    </div>
  );
}
