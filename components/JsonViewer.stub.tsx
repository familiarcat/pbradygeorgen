'use client';

import React from 'react';

interface JsonViewerProps {
  data: any;
  title?: string;
  expanded?: boolean;
}

/**
 * Simplified JsonViewer component for AWS Amplify build
 */
export default function JsonViewer({ data, title = 'JSON Data', expanded = false }: JsonViewerProps) {
  return (
    <div className="border border-gray-300 rounded-lg p-4 bg-white">
      <h3 className="text-lg font-bold mb-2">{title}</h3>
      <div className="bg-gray-100 p-4 rounded overflow-auto max-h-[500px]">
        <pre className="text-sm">{JSON.stringify(data, null, 2)}</pre>
      </div>
    </div>
  );
}
