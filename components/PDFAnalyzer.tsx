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

    // Handle custom close event from ContentAnalysis
    function handleCustomClose() {
      if (onClose) {
        onClose();
      }
    }

    // Add event listeners
    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('close-content-analysis', handleCustomClose);

    // Clean up
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('close-content-analysis', handleCustomClose);
    };
  }, [onClose]);

  return (
    <div ref={analyzerRef} className="analyzer-panel relative">
      <div className="analyzer-header flex justify-between items-center border-b border-[var(--border-medium)] pb-3">
        <h2 className="text-[1.5rem] font-bold m-0 text-[var(--text-primary)] tracking-tight">Summary Preview</h2>
        {onClose && (
          <button
            onClick={onClose}
            className="bg-transparent border-none text-[var(--text-primary)] text-[1.5rem] cursor-pointer p-[0.25rem_0.5rem] rounded transition-all duration-200 hover:bg-[rgba(90,118,130,0.1)]"
            aria-label="Close"
          >
            &times;
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
