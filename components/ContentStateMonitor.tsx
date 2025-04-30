'use client';

import React, { useEffect, useState } from 'react';
import { DanteLogger } from '@/utils/DanteLogger';

interface ContentState {
  lastUpdated: string;
  fingerprint: string;
  isProcessed: boolean;
  isAnalyzed: boolean;
  pdfPath: string;
  pdfSize: number;
  pdfLastModified: string;
}

interface ContentStateMonitorProps {
  onStateChange?: (state: ContentState) => void;
  refreshInterval?: number; // in milliseconds
  showStatus?: boolean;
}

/**
 * ContentStateMonitor
 * 
 * A component that monitors the content state and triggers actions when it changes.
 * Follows Salinger's principle of authenticity by providing real-time status updates.
 */
export default function ContentStateMonitor({
  onStateChange,
  refreshInterval = 10000, // Default to 10 seconds
  showStatus = false
}: ContentStateMonitorProps) {
  const [contentState, setContentState] = useState<ContentState | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [lastChecked, setLastChecked] = useState<Date | null>(null);

  // Function to fetch the content state
  const fetchContentState = async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      // Add a timestamp to bust cache
      const timestamp = new Date().getTime();
      const response = await fetch(`/api/content-state?t=${timestamp}`);
      
      if (!response.ok) {
        throw new Error(`API responded with status: ${response.status}`);
      }
      
      const data = await response.json();
      
      if (!data.success) {
        throw new Error(data.error || 'Unknown error');
      }
      
      // Update the content state
      setContentState(data.state);
      setLastChecked(new Date());
      
      // Call the onStateChange callback if provided
      if (onStateChange) {
        onStateChange(data.state);
      }
      
      DanteLogger.success.core('Content state fetched successfully');
    } catch (error) {
      console.error('Error fetching content state:', error);
      setError(error instanceof Error ? error.message : 'Failed to fetch content state');
      DanteLogger.error.dataFlow('Error fetching content state', { error });
    } finally {
      setIsLoading(false);
    }
  };

  // Fetch the content state on mount and at the specified interval
  useEffect(() => {
    // Fetch immediately on mount
    fetchContentState();
    
    // Set up the interval
    const intervalId = setInterval(fetchContentState, refreshInterval);
    
    // Clean up the interval on unmount
    return () => clearInterval(intervalId);
  }, [refreshInterval]);

  // If we don't need to show the status, just return null
  if (!showStatus) {
    return null;
  }

  return (
    <div className="content-state-monitor">
      {isLoading && (
        <div className="fixed top-0 left-0 w-full bg-blue-500 text-white text-center py-1 z-50">
          Checking content state...
        </div>
      )}
      
      {error && (
        <div className="fixed top-0 left-0 w-full bg-red-500 text-white text-center py-1 z-50">
          Error: {error}
        </div>
      )}
      
      {!isLoading && !error && contentState && (
        <div className="fixed bottom-0 left-0 w-full bg-gray-800 text-white text-xs p-1 flex justify-between items-center">
          <div>
            <span className="font-bold">PDF:</span> {contentState.pdfPath.split('/').pop()}
          </div>
          <div>
            <span className={`px-2 py-1 rounded ${contentState.isProcessed ? 'bg-green-500' : 'bg-red-500'}`}>
              {contentState.isProcessed ? 'Processed' : 'Not Processed'}
            </span>
            <span className={`ml-2 px-2 py-1 rounded ${contentState.isAnalyzed ? 'bg-green-500' : 'bg-red-500'}`}>
              {contentState.isAnalyzed ? 'Analyzed' : 'Not Analyzed'}
            </span>
          </div>
          <div>
            <span className="font-bold">Last Updated:</span> {new Date(contentState.lastUpdated).toLocaleTimeString()}
          </div>
          <div>
            <span className="font-bold">Last Checked:</span> {lastChecked?.toLocaleTimeString() || 'Never'}
          </div>
        </div>
      )}
    </div>
  );
}
