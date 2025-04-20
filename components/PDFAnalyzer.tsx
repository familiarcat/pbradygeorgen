'use client';

import { useState } from 'react';
import ExtractedContent from './ExtractedContent';
import ContentAnalysis from './ContentAnalysis';

interface PDFAnalyzerProps {
  onClose?: () => void;
}

export default function PDFAnalyzer({ onClose }: PDFAnalyzerProps) {
  // State for potential error messages
  const [error] = useState<string | null>(null);
  // State for active tab
  const [activeTab, setActiveTab] = useState<'content' | 'analysis'>('content');

  return (
    <div className="analyzer-panel relative">
      <div className="analyzer-header">
        <h2 className="text-xl font-bold">PDF Content Analyzer</h2>
        {onClose && (
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 transition-colors duration-200"
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

        {/* Tab navigation */}
        <div className="analyzer-tabs">
          <button
            className={`analyzer-tab ${
              activeTab === 'content' ? 'analyzer-tab-active' : 'analyzer-tab-inactive'
            }`}
            onClick={() => setActiveTab('content')}
          >
            Extracted Content
          </button>
          <button
            className={`analyzer-tab ${
              activeTab === 'analysis' ? 'analyzer-tab-active' : 'analyzer-tab-inactive'
            }`}
            onClick={() => setActiveTab('analysis')}
          >
            AI Analysis
          </button>
        </div>

        {/* Content based on active tab with smooth transitions */}
        <div className="relative overflow-hidden mt-4">
          <div
            className={`transition-all duration-300 ease-in-out ${
              activeTab === 'content' ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-full absolute inset-0'
            }`}
          >
            <ExtractedContent filePath="/extracted/resume_content_improved.md" />
          </div>

          <div
            className={`transition-all duration-300 ease-in-out ${
              activeTab === 'analysis' ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-full absolute inset-0'
            }`}
          >
            <ContentAnalysis filePath="/extracted/resume_content_improved.md" />
          </div>
        </div>
      </div>
    </div>
  );
}
