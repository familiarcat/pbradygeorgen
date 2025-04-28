import React from 'react';
import ExtractionLogs from '@/components/ExtractionLogs';

export const metadata = {
  title: 'PDF Extraction Logs',
  description: 'View logs of the PDF extraction process',
  // No robots meta tag to keep this page hidden from search engines
};

// Hidden utility page with dark theme following Salinger philosophy
export default function ExtractionLogsPage() {
  return (
    <div className="min-h-screen bg-gray-900 text-gray-200">
      <div className="container mx-auto py-8 px-4">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-mono font-bold text-gray-100">PDF Extraction Logs</h1>
          <a
            href="/"
            className="px-4 py-2 bg-gray-800 hover:bg-gray-700 text-gray-200 rounded transition-colors"
          >
            Return to Main Page
          </a>
        </div>
        <p className="mb-6 text-gray-400 font-light italic border-l-4 border-gray-700 pl-4">
          This is a hidden utility page showing detailed logs of the PDF extraction process,
          including what content was extracted from the source PDF file and any issues that occurred
          during extraction. This page follows the Salinger philosophy of focused, purposeful UI
          with a dark theme for technical information.
        </p>
        <div className="overflow-auto max-h-[calc(100vh-200px)]">
          <ExtractionLogs darkMode={true} />
        </div>
      </div>
    </div>
  );
}
