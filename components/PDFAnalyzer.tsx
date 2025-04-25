'use client';

import { useState, useEffect, useRef } from 'react';
import ContentAnalysis from './ContentAnalysis';

interface PDFAnalyzerProps {
  onClose?: () => void;
}

export default function PDFAnalyzer({ onClose }: PDFAnalyzerProps) {
  // State for potential error messages
  const [error] = useState<string | null>(null);
  // Reference to the analyzer panel for click-outside detection
  const analyzerRef = useRef<HTMLDivElement>(null);

  // Handle click outside to close the analyzer
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (analyzerRef.current && !analyzerRef.current.contains(event.target as Node) && onClose) {
        onClose();
      }
    }

    // Add event listener
    document.addEventListener('mousedown', handleClickOutside);

    // Clean up
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [onClose]);

  return (
    <div ref={analyzerRef} className="analyzer-panel relative">
      <div className="analyzer-header">
        <h2 className="text-xl font-bold">Summary</h2>
        {onClose && (
          <button
            onClick={onClose}
            className="text-[var(--text-primary)] hover:text-[var(--cta-secondary)] hover:bg-[rgba(90,118,130,0.1)] p-2 rounded-full transition-all duration-200 absolute top-4 right-4 border border-[var(--border-medium)]"
            aria-label="Close"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        )}
      </div>

      <div className="analyzer-content">
        {error && (
          <div className="mb-4 p-3 analyzer-section-content">
            {error}
          </div>
        )}

        {/* Content - now showing only the analysis content */}
        <div className="mt-4">
          <ContentAnalysis filePath="/extracted/resume_content_improved.md" />

          {/* No bottom close button - using only the X icon in the upper right */}
        </div>
      </div>
    </div>
  );
}
