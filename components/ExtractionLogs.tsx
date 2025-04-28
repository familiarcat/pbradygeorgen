'use client';

import React, { useState, useEffect } from 'react';
import { DanteLogger } from '@/utils/DanteLogger';
import { HesseLogger } from '@/utils/HesseLogger';

/**
 * Component to display PDF extraction logs
 * This provides visibility into the PDF extraction process
 *
 * Following Salinger philosophy of focused, purposeful UI with dark theme option
 * for technical information that should be accessible but not prominent.
 */
interface ExtractionLogsProps {
  darkMode?: boolean;
}

export default function ExtractionLogs({ darkMode = false }: ExtractionLogsProps) {
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

  // Determine theme classes based on darkMode prop
  const themeClasses = {
    container: darkMode ? "p-4 bg-gray-800 rounded-lg border border-gray-700" : "p-4 bg-gray-100 rounded-lg",
    heading: darkMode ? "text-xl font-mono font-bold mb-4 text-gray-200" : "text-xl font-bold mb-4",
    text: darkMode ? "text-gray-300" : "text-gray-700",
    errorText: darkMode ? "text-red-400" : "text-red-600",
    warningText: darkMode ? "text-yellow-400" : "text-yellow-600",
    errorContainer: darkMode ? "p-4 bg-gray-800 border-l-4 border-red-500 rounded-lg" : "p-4 bg-red-50 rounded-lg",
    warningContainer: darkMode ? "p-4 bg-gray-800 border-l-4 border-yellow-500 rounded-lg" : "p-4 bg-yellow-50 rounded-lg",
    button: darkMode
      ? "mt-4 px-4 py-2 bg-gray-700 text-gray-200 rounded hover:bg-gray-600 transition-colors"
      : "mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600",
    refreshButton: darkMode
      ? "px-4 py-2 bg-gray-700 text-gray-200 rounded hover:bg-gray-600 transition-colors"
      : "px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600",
  };

  if (loading) {
    return (
      <div className={themeClasses.container}>
        <h2 className={themeClasses.heading}>PDF Extraction Logs</h2>
        <div className="flex items-center">
          <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-gray-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          <p className={themeClasses.text}>Loading logs...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={themeClasses.errorContainer}>
        <h2 className={themeClasses.heading}>PDF Extraction Logs</h2>
        <p className={themeClasses.errorText}>Error: {error}</p>
        <button
          onClick={handleRefresh}
          className={themeClasses.button}
        >
          Try Again
        </button>
      </div>
    );
  }

  if (!logs || !logs.success) {
    return (
      <div className={themeClasses.warningContainer}>
        <h2 className={themeClasses.heading}>PDF Extraction Logs</h2>
        <p className={themeClasses.warningText}>No logs available: {logs?.error || 'Unknown error'}</p>
        <button
          onClick={handleRefresh}
          className={themeClasses.button}
        >
          Refresh
        </button>
      </div>
    );
  }

  return (
    <div className={themeClasses.container}>
      <div className="flex justify-between items-center mb-4">
        <h2 className={themeClasses.heading}>PDF Extraction Logs</h2>
        <button
          onClick={handleRefresh}
          className={themeClasses.refreshButton}
        >
          Refresh
        </button>
      </div>

      {/* PDF Information */}
      <div className={`mb-6 p-4 rounded-lg shadow ${darkMode ? 'bg-gray-700' : 'bg-white'}`}>
        <h3 className={`text-lg font-mono font-semibold mb-2 ${darkMode ? 'text-gray-200' : ''}`}>PDF Information</h3>
        {logs.pdfInfo ? (
          <div className={darkMode ? 'text-gray-300' : ''}>
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
          <p className={darkMode ? 'text-gray-400' : ''}>No PDF information available</p>
        )}
      </div>

      {/* Extraction Status */}
      {logs.log?.extractionStatus && (
        <div className={`mb-6 p-4 rounded-lg shadow ${darkMode ? 'bg-gray-700' : 'bg-white'}`}>
          <h3 className={`text-lg font-mono font-semibold mb-2 ${darkMode ? 'text-gray-200' : ''}`}>Extraction Status</h3>
          <div className="grid grid-cols-2 gap-2">
            <div className={`p-2 rounded ${darkMode ? 'bg-gray-600' : 'bg-gray-50'}`}>
              <p className={darkMode ? 'text-gray-300' : ''}><strong>Text:</strong> {logs.log.extractionStatus.textExtracted ? '✅' : '❌'}</p>
            </div>
            <div className={`p-2 rounded ${darkMode ? 'bg-gray-600' : 'bg-gray-50'}`}>
              <p className={darkMode ? 'text-gray-300' : ''}><strong>Markdown:</strong> {logs.log.extractionStatus.markdownExtracted ? '✅' : '❌'}</p>
            </div>
            <div className={`p-2 rounded ${darkMode ? 'bg-gray-600' : 'bg-gray-50'}`}>
              <p className={darkMode ? 'text-gray-300' : ''}><strong>Fonts:</strong> {logs.log.extractionStatus.fontsExtracted ? '✅' : '❌'}</p>
            </div>
            <div className={`p-2 rounded ${darkMode ? 'bg-gray-600' : 'bg-gray-50'}`}>
              <p className={darkMode ? 'text-gray-300' : ''}><strong>Colors:</strong> {logs.log.extractionStatus.colorsExtracted ? '✅' : '❌'}</p>
            </div>
          </div>
        </div>
      )}

      {/* Extraction Steps */}
      {logs.log?.extractionSteps && logs.log.extractionSteps.length > 0 && (
        <div className={`mb-6 p-4 rounded-lg shadow ${darkMode ? 'bg-gray-700' : 'bg-white'}`}>
          <h3 className={`text-lg font-mono font-semibold mb-2 ${darkMode ? 'text-gray-200' : ''}`}>Extraction Timeline</h3>
          <div className="overflow-auto max-h-60">
            {logs.log.extractionSteps.map((step: any, index: number) => {
              const icon = step.type === 'error' ? '❌' :
                          step.type === 'warning' ? '⚠️' :
                          step.type === 'success' ? '✅' : 'ℹ️';

              // Determine background color based on step type and theme
              const bgColor = darkMode
                ? step.type === 'error' ? 'bg-red-900/30 border-l-4 border-red-700' :
                  step.type === 'warning' ? 'bg-yellow-900/30 border-l-4 border-yellow-700' :
                  step.type === 'success' ? 'bg-green-900/30 border-l-4 border-green-700' : 'bg-blue-900/30 border-l-4 border-blue-700'
                : step.type === 'error' ? 'bg-red-50' :
                  step.type === 'warning' ? 'bg-yellow-50' :
                  step.type === 'success' ? 'bg-green-50' : 'bg-blue-50';

              return (
                <div key={index} className={`p-2 mb-2 rounded ${bgColor}`}>
                  <p className={darkMode ? 'text-gray-300' : ''}>
                    <span className="mr-2">{icon}</span>
                    <strong>{new Date(step.timestamp).toLocaleTimeString()}</strong>: {step.message}
                  </p>
                  {step.details && Object.keys(step.details).length > 0 && (
                    <pre className={`mt-1 p-2 rounded text-xs overflow-auto ${darkMode ? 'bg-gray-800 text-gray-300' : 'bg-gray-100'}`}>
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
        <div className={`mb-6 p-4 rounded-lg shadow ${darkMode ? 'bg-gray-700' : 'bg-white'}`}>
          <h3 className={`text-lg font-mono font-semibold mb-2 ${darkMode ? 'text-gray-200' : ''}`}>Extraction Summary</h3>
          <pre className={`whitespace-pre-wrap p-3 rounded text-sm ${darkMode ? 'bg-gray-800 text-gray-300' : 'bg-gray-50'}`}>
            {logs.summary}
          </pre>
        </div>
      )}

      {/* Raw Log Data */}
      <div className={`mb-6 p-4 rounded-lg shadow ${darkMode ? 'bg-gray-700' : 'bg-white'}`}>
        <h3 className={`text-lg font-mono font-semibold mb-2 ${darkMode ? 'text-gray-200' : ''}`}>Raw Log Data</h3>
        <details>
          <summary className={`cursor-pointer ${darkMode ? 'text-blue-400 hover:text-blue-300' : 'text-blue-600 hover:text-blue-800'}`}>
            Show Raw JSON
          </summary>
          <pre className={`mt-2 p-3 rounded text-xs overflow-auto max-h-60 ${darkMode ? 'bg-gray-800 text-gray-300' : 'bg-gray-50'}`}>
            {JSON.stringify(logs, null, 2)}
          </pre>
        </details>
      </div>

      <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
        Last updated: {new Date(logs.timestamp).toLocaleString()}
      </p>
    </div>
  );
}
