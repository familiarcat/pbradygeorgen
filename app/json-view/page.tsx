'use client';

import { useState } from 'react';
import JsonViewer from '@/components/JsonViewer';
import { DanteLogger } from '@/utils/DanteLogger';

export default function JsonViewPage() {
  const [showJsonViewer, setShowJsonViewer] = useState(true);

  const handleClose = () => {
    setShowJsonViewer(false);
    window.location.href = '/';
    DanteLogger.success.ux('JSON viewer closed');
  };

  return (
    <div className="min-h-screen bg-[var(--bg-primary)] p-4 md:p-8">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-[var(--text-primary)]">PDF Content JSON Viewer</h1>
          <button
            onClick={() => window.location.href = '/'}
            className="px-4 py-2 bg-[var(--cta-secondary)] text-white rounded hover:bg-[var(--cta-secondary-dark)]"
          >
            Back to Home
          </button>
        </div>
        
        {showJsonViewer && <JsonViewer onClose={handleClose} />}
      </div>
    </div>
  );
}
