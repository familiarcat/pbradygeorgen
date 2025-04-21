'use client';

import { useState } from 'react';
import ContentAnalysis from './ContentAnalysis';

interface PDFAnalyzerProps {
  onClose?: () => void;
}

export default function PDFAnalyzer({ onClose }: PDFAnalyzerProps) {
  // State for potential error messages
  const [error] = useState<string | null>(null);
  // No longer need tabs since we're removing the Download Resume tab
  // and focusing solely on the analysis content

  return (
    <div className="analyzer-panel relative">
      <div className="analyzer-header">
        <h2 className="text-xl font-bold">Contact</h2>
        {onClose && (
          <button
            onClick={onClose}
            className="text-[var(--text-tertiary)] hover:text-[var(--text-primary)] transition-colors duration-200"
            aria-label="Close"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
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
        </div>
      </div>
    </div>
  );
}
