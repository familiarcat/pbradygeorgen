import React from 'react';
import ExtractionLogs from '@/components/ExtractionLogs';

export const metadata = {
  title: 'PDF Extraction Logs',
  description: 'View logs of the PDF extraction process',
};

export default function ExtractionLogsPage() {
  return (
    <div className="container mx-auto py-8 px-4">
      <h1 className="text-2xl font-bold mb-6">PDF Extraction Logs</h1>
      <p className="mb-4">
        This page shows detailed logs of the PDF extraction process, including what content was extracted
        from the source PDF file and any issues that occurred during extraction.
      </p>
      <ExtractionLogs />
    </div>
  );
}
