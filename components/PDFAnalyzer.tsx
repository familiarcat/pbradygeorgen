'use client';

import { useState } from 'react';
import ExtractedContent from './ExtractedContent';
import ContentAnalysis from './ContentAnalysis';

export default function PDFAnalyzer() {
  // State for potential error messages
  const [error] = useState<string | null>(null);
  // State for active tab
  const [activeTab, setActiveTab] = useState<'content' | 'analysis'>('content');

  return (
    <div className="bg-gray-100 p-4 rounded-lg shadow-md">
      <h2 className="text-xl font-bold mb-4">PDF Content Analyzer</h2>

      {error && (
        <div className="mb-4 p-3 bg-red-100 text-red-700 rounded">
          {error}
        </div>
      )}

      {/* Tab navigation */}
      <div className="flex border-b border-gray-300 mb-4">
        <button
          className={`py-2 px-4 font-medium text-sm transition-colors duration-200 ${
            activeTab === 'content'
              ? 'text-blue-600 border-b-2 border-blue-600 -mb-px'
              : 'text-gray-500 hover:text-gray-700'
          }`}
          onClick={() => setActiveTab('content')}
        >
          Extracted Content
        </button>
        <button
          className={`py-2 px-4 font-medium text-sm transition-colors duration-200 ${
            activeTab === 'analysis'
              ? 'text-blue-600 border-b-2 border-blue-600 -mb-px'
              : 'text-gray-500 hover:text-gray-700'
          }`}
          onClick={() => setActiveTab('analysis')}
        >
          AI Analysis
        </button>
      </div>

      {/* Content based on active tab with smooth transitions */}
      <div className="relative overflow-hidden">
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
  );
}
