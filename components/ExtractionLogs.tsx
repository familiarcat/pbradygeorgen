'use client';

import React, { useState, useEffect } from 'react';
import { DanteLogger } from '@/utils/DanteLogger';
import { HesseLogger } from '@/utils/HesseLogger';

/**
 * Component to display PDF extraction logs
 * This provides visibility into the PDF extraction process
 */
export default function ExtractionLogs() {
  const [logs, setLogs] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [refreshKey, setRefreshKey] = useState<number>(0);

  useEffect(() => {
    const fetchLogs = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const response = await fetch('/api/extraction-logs');
        
        if (!response.ok) {
          throw new Error(`Failed to fetch logs: ${response.status} ${response.statusText}`);
        }
        
        const data = await response.json();
        setLogs(data);
        
        if (data.success) {
          DanteLogger.success.basic('Extraction logs fetched successfully');
        } else {
          DanteLogger.warn.deprecated(`Failed to fetch logs: ${data.error}`);
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Unknown error');
        DanteLogger.error.dataFlow(`Error fetching extraction logs: ${err}`);
      } finally {
        setLoading(false);
      }
    };
    
    fetchLogs();
  }, [refreshKey]);
  
  const handleRefresh = () => {
    HesseLogger.cache.invalidate('Refreshing extraction logs');
    setRefreshKey(prev => prev + 1);
  };
  
  if (loading) {
    return (
      <div className="p-4 bg-gray-100 rounded-lg">
        <h2 className="text-xl font-bold mb-4">PDF Extraction Logs</h2>
        <p>Loading logs...</p>
      </div>
    );
  }
  
  if (error) {
    return (
      <div className="p-4 bg-red-50 rounded-lg">
        <h2 className="text-xl font-bold mb-4">PDF Extraction Logs</h2>
        <p className="text-red-600">Error: {error}</p>
        <button 
          onClick={handleRefresh}
          className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          Try Again
        </button>
      </div>
    );
  }
  
  if (!logs || !logs.success) {
    return (
      <div className="p-4 bg-yellow-50 rounded-lg">
        <h2 className="text-xl font-bold mb-4">PDF Extraction Logs</h2>
        <p className="text-yellow-600">No logs available: {logs?.error || 'Unknown error'}</p>
        <button 
          onClick={handleRefresh}
          className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          Refresh
        </button>
      </div>
    );
  }
  
  return (
    <div className="p-4 bg-gray-100 rounded-lg">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold">PDF Extraction Logs</h2>
        <button 
          onClick={handleRefresh}
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          Refresh
        </button>
      </div>
      
      {/* PDF Information */}
      <div className="mb-6 p-4 bg-white rounded-lg shadow">
        <h3 className="text-lg font-semibold mb-2">PDF Information</h3>
        {logs.pdfInfo ? (
          <div>
            <p><strong>Path:</strong> {logs.pdfInfo.path}</p>
            <p><strong>Exists:</strong> {logs.pdfInfo.exists ? '✅' : '❌'}</p>
            {logs.pdfInfo.exists && (
              <>
                <p><strong>Size:</strong> {logs.pdfInfo.size} bytes</p>
                <p><strong>Last Modified:</strong> {new Date(logs.pdfInfo.lastModified).toLocaleString()}</p>
              </>
            )}
            {logs.contentFingerprint && (
              <p><strong>Content Fingerprint:</strong> {logs.contentFingerprint.substring(0, 8)}...</p>
            )}
          </div>
        ) : (
          <p>No PDF information available</p>
        )}
      </div>
      
      {/* Extraction Status */}
      {logs.log?.extractionStatus && (
        <div className="mb-6 p-4 bg-white rounded-lg shadow">
          <h3 className="text-lg font-semibold mb-2">Extraction Status</h3>
          <div className="grid grid-cols-2 gap-2">
            <div className="p-2 bg-gray-50 rounded">
              <p><strong>Text:</strong> {logs.log.extractionStatus.textExtracted ? '✅' : '❌'}</p>
            </div>
            <div className="p-2 bg-gray-50 rounded">
              <p><strong>Markdown:</strong> {logs.log.extractionStatus.markdownExtracted ? '✅' : '❌'}</p>
            </div>
            <div className="p-2 bg-gray-50 rounded">
              <p><strong>Fonts:</strong> {logs.log.extractionStatus.fontsExtracted ? '✅' : '❌'}</p>
            </div>
            <div className="p-2 bg-gray-50 rounded">
              <p><strong>Colors:</strong> {logs.log.extractionStatus.colorsExtracted ? '✅' : '❌'}</p>
            </div>
          </div>
        </div>
      )}
      
      {/* Extraction Steps */}
      {logs.log?.extractionSteps && logs.log.extractionSteps.length > 0 && (
        <div className="mb-6 p-4 bg-white rounded-lg shadow">
          <h3 className="text-lg font-semibold mb-2">Extraction Timeline</h3>
          <div className="overflow-auto max-h-60">
            {logs.log.extractionSteps.map((step: any, index: number) => {
              const icon = step.type === 'error' ? '❌' : 
                          step.type === 'warning' ? '⚠️' : 
                          step.type === 'success' ? '✅' : 'ℹ️';
              
              return (
                <div key={index} className={`p-2 mb-2 rounded ${
                  step.type === 'error' ? 'bg-red-50' : 
                  step.type === 'warning' ? 'bg-yellow-50' : 
                  step.type === 'success' ? 'bg-green-50' : 'bg-blue-50'
                }`}>
                  <p>
                    <span className="mr-2">{icon}</span>
                    <strong>{new Date(step.timestamp).toLocaleTimeString()}</strong>: {step.message}
                  </p>
                  {step.details && Object.keys(step.details).length > 0 && (
                    <pre className="mt-1 p-2 bg-gray-100 rounded text-xs overflow-auto">
                      {JSON.stringify(step.details, null, 2)}
                    </pre>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}
      
      {/* Summary */}
      {logs.summary && (
        <div className="mb-6 p-4 bg-white rounded-lg shadow">
          <h3 className="text-lg font-semibold mb-2">Extraction Summary</h3>
          <pre className="whitespace-pre-wrap bg-gray-50 p-3 rounded text-sm">
            {logs.summary}
          </pre>
        </div>
      )}
      
      {/* Raw Log Data */}
      <div className="mb-6 p-4 bg-white rounded-lg shadow">
        <h3 className="text-lg font-semibold mb-2">Raw Log Data</h3>
        <details>
          <summary className="cursor-pointer text-blue-600 hover:text-blue-800">Show Raw JSON</summary>
          <pre className="mt-2 p-3 bg-gray-50 rounded text-xs overflow-auto max-h-60">
            {JSON.stringify(logs, null, 2)}
          </pre>
        </details>
      </div>
      
      <p className="text-sm text-gray-500">
        Last updated: {new Date(logs.timestamp).toLocaleString()}
      </p>
    </div>
  );
}
