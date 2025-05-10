'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { DanteLogger } from '@/utils/DanteLogger';
import { useAdmin } from '@/contexts/AdminContext';

export default function ContentStatusPage() {
  const { isAdminMode } = useAdmin();
  const [contentStatus, setContentStatus] = useState<any>(null);
  const [validationStatus, setValidationStatus] = useState<any>(null);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [isValidating, setIsValidating] = useState(false);
  const [logs, setLogs] = useState<string[]>([]);
  const [activeTab, setActiveTab] = useState('status');
  const [jsonPreview, setJsonPreview] = useState<any>(null);

  // Add a log entry
  const addLog = (message: string) => {
    setLogs(prevLogs => [
      `[${new Date().toISOString()}] ${message}`,
      ...prevLogs.slice(0, 99) // Keep only the last 100 logs
    ]);
  };

  // Fetch content status
  const fetchContentStatus = async () => {
    try {
      addLog('Fetching content status...');
      const timestamp = new Date().getTime();
      const response = await fetch(`/api/refresh-content?t=${timestamp}`);

      if (!response.ok) {
        throw new Error(`API responded with status: ${response.status}`);
      }

      const data = await response.json();
      setContentStatus(data);
      addLog(`Content status fetched successfully: ${data.success ? 'OK' : 'Failed'}`);

      return data;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      addLog(`Error fetching content status: ${errorMessage}`);
      console.error('Error fetching content status:', error);
      return null;
    }
  };

  // Validate content
  const validateContent = async () => {
    try {
      setIsValidating(true);
      addLog('Validating content against Zod schemas...');

      const timestamp = new Date().getTime();
      const response = await fetch(`/api/validate-content?t=${timestamp}`);

      if (!response.ok) {
        throw new Error(`API responded with status: ${response.status}`);
      }

      const data = await response.json();
      setValidationStatus(data);

      if (data.valid) {
        addLog('Content validation successful! ✅');
      } else {
        addLog(`Content validation failed: ${data.errors?.length || 0} errors found ❌`);
      }

      return data;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      addLog(`Error validating content: ${errorMessage}`);
      console.error('Error validating content:', error);
      return null;
    } finally {
      setIsValidating(false);
    }
  };

  // Refresh content
  const refreshContent = async () => {
    try {
      setIsRefreshing(true);
      addLog('Refreshing content...');

      const response = await fetch('/api/refresh-content', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        throw new Error(`API responded with status: ${response.status}`);
      }

      const data = await response.json();

      if (data.success) {
        addLog(`Content refreshed successfully at ${data.timestamp}`);
        // Fetch the updated status
        await fetchContentStatus();
        // Validate the updated content
        await validateContent();
      } else {
        addLog(`Content refresh failed: ${data.error || 'Unknown error'}`);
      }

      return data;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      addLog(`Error refreshing content: ${errorMessage}`);
      console.error('Error refreshing content:', error);
      return null;
    } finally {
      setIsRefreshing(false);
    }
  };

  // Fetch JSON preview
  const fetchJsonPreview = async () => {
    try {
      addLog('Fetching JSON preview...');
      const timestamp = new Date().getTime();
      const response = await fetch(`/extracted/resume_content_analyzed.json?t=${timestamp}`);

      if (!response.ok) {
        throw new Error(`API responded with status: ${response.status}`);
      }

      const data = await response.json();
      setJsonPreview(data);
      addLog('JSON preview fetched successfully');

      return data;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      addLog(`Error fetching JSON preview: ${errorMessage}`);
      console.error('Error fetching JSON preview:', error);
      return null;
    }
  };

  // Initial fetch
  useEffect(() => {
    const initialize = async () => {
      await fetchContentStatus();
      await validateContent();
      await fetchJsonPreview();
    };

    initialize();

    // Log initialization
    addLog('Content Status Page initialized');
    console.log('Content Status Page initialized');

    // Cleanup
    return () => {
      console.log('Content Status Page unmounted');
    };
  }, []);

  return (
    <div className="container mx-auto p-4">
      {/* <h1 className="text-3xl font-bold mb-4">Content Status Dashboard</h1> */}

      <div className="mb-4 flex space-x-2 flex-wrap">
        <button
          onClick={refreshContent}
          disabled={isRefreshing}
          className="px-4 py-2 bg-blue-500 text-white rounded disabled:opacity-50 mb-2"
        >
          {isRefreshing ? 'Refreshing...' : 'Refresh Content'}
        </button>

        <button
          onClick={validateContent}
          disabled={isValidating}
          className="px-4 py-2 bg-green-500 text-white rounded disabled:opacity-50 mb-2"
        >
          {isValidating ? 'Validating...' : 'Validate Content'}
        </button>

        <button
          onClick={fetchJsonPreview}
          className="px-4 py-2 bg-purple-500 text-white rounded mb-2"
        >
          Fetch JSON Preview
        </button>

        {isAdminMode && (
          <Link href="/color-theme">
            <button
              className="px-4 py-2 bg-orange-500 text-white rounded mb-2 ml-2"
              onClick={() => DanteLogger.info.system('Color Theme Editor clicked from Content Status page')}
            >
              Edit Color Theme
            </button>
          </Link>
        )}
      </div>

      <div className="mb-4">
        <div className="flex border-b">
          <button
            className={`px-4 py-2 ${activeTab === 'status' ? 'bg-gray-200 border-t border-l border-r' : ''}`}
            onClick={() => setActiveTab('status')}
          >
            Status
          </button>
          <button
            className={`px-4 py-2 ${activeTab === 'validation' ? 'bg-gray-200 border-t border-l border-r' : ''}`}
            onClick={() => setActiveTab('validation')}
          >
            Validation
          </button>
          <button
            className={`px-4 py-2 ${activeTab === 'json' ? 'bg-gray-200 border-t border-l border-r' : ''}`}
            onClick={() => setActiveTab('json')}
          >
            JSON Preview
          </button>
          <button
            className={`px-4 py-2 ${activeTab === 'logs' ? 'bg-gray-200 border-t border-l border-r' : ''}`}
            onClick={() => setActiveTab('logs')}
          >
            Logs
          </button>
        </div>

        <div className="p-4 border border-t-0">
          {activeTab === 'status' && (
            <div>
              <h2 className="text-xl font-bold mb-2">Content Status</h2>
              {contentStatus ? (
                <div>
                  <div className="mb-4">
                    <h3 className="text-lg font-semibold">Build Info</h3>
                    <div className="bg-gray-100 p-2 rounded">
                      <p><strong>Timestamp:</strong> {contentStatus.buildInfo?.buildTimestamp}</p>
                      <p><strong>PDF Path:</strong> {contentStatus.buildInfo?.pdfInfo?.path}</p>
                      <p><strong>PDF Size:</strong> {contentStatus.buildInfo?.pdfInfo?.size} bytes</p>
                      <p><strong>Last Modified:</strong> {contentStatus.buildInfo?.pdfInfo?.lastModified}</p>
                      <p><strong>Content Fingerprint:</strong> {contentStatus.buildInfo?.pdfInfo?.contentFingerprint}</p>
                    </div>
                  </div>

                  <div className="mb-4">
                    <h3 className="text-lg font-semibold">Extraction Status</h3>
                    <div className="bg-gray-100 p-2 rounded">
                      <p><strong>Text Extracted:</strong> {contentStatus.buildInfo?.extractionStatus?.textExtracted ? '✅' : '❌'}</p>
                      <p><strong>Markdown Extracted:</strong> {contentStatus.buildInfo?.extractionStatus?.markdownExtracted ? '✅' : '❌'}</p>
                      <p><strong>Fonts Extracted:</strong> {contentStatus.buildInfo?.extractionStatus?.fontsExtracted ? '✅' : '❌'}</p>
                      <p><strong>Colors Extracted:</strong> {contentStatus.buildInfo?.extractionStatus?.colorsExtracted ? '✅' : '❌'}</p>
                      <p><strong>ChatGPT Analyzed:</strong> {contentStatus.buildInfo?.extractionStatus?.chatGptAnalyzed ? '✅' : '❌'}</p>
                    </div>
                  </div>

                  <div className="mb-4">
                    <h3 className="text-lg font-semibold">Analyzed Content Info</h3>
                    {contentStatus.analyzedInfo ? (
                      <div className="bg-gray-100 p-2 rounded">
                        <p><strong>Name:</strong> {contentStatus.analyzedInfo.name}</p>
                        <p><strong>Sections:</strong> {contentStatus.analyzedInfo.sections.join(', ')}</p>
                        <p><strong>Structured Sections:</strong> {contentStatus.analyzedInfo.structuredSections.join(', ')}</p>
                      </div>
                    ) : (
                      <p>No analyzed content info available</p>
                    )}
                  </div>

                  <div className="mb-4">
                    <h3 className="text-lg font-semibold">Files Exist</h3>
                    <div className="bg-gray-100 p-2 rounded">
                      <p><strong>Build Info:</strong> {contentStatus.filesExist?.buildInfo ? '✅' : '❌'}</p>
                      <p><strong>Analyzed Content:</strong> {contentStatus.filesExist?.analyzedContent ? '✅' : '❌'}</p>
                      <p><strong>Text Content:</strong> {contentStatus.filesExist?.textContent ? '✅' : '❌'}</p>
                      <p><strong>Markdown Content:</strong> {contentStatus.filesExist?.markdownContent ? '✅' : '❌'}</p>
                      <p><strong>Font Info:</strong> {contentStatus.filesExist?.fontInfo ? '✅' : '❌'}</p>
                      <p><strong>Color Theme:</strong> {contentStatus.filesExist?.colorTheme ? '✅' : '❌'}</p>
                    </div>
                  </div>
                </div>
              ) : (
                <p>Loading content status...</p>
              )}
            </div>
          )}

          {activeTab === 'validation' && (
            <div>
              <h2 className="text-xl font-bold mb-2">Validation Status</h2>
              {validationStatus ? (
                <div>
                  <div className="mb-4">
                    <h3 className="text-lg font-semibold">Validation Result</h3>
                    <div className={`p-2 rounded ${validationStatus.valid ? 'bg-green-100' : 'bg-red-100'}`}>
                      <p><strong>Valid:</strong> {validationStatus.valid ? '✅ Yes' : '❌ No'}</p>
                      <p><strong>Timestamp:</strong> {validationStatus.timestamp}</p>
                    </div>
                  </div>

                  {validationStatus.valid && validationStatus.contentPreview && (
                    <div className="mb-4">
                      <h3 className="text-lg font-semibold">Content Preview</h3>
                      <div className="bg-gray-100 p-2 rounded">
                        <p><strong>Name:</strong> {validationStatus.contentPreview.name}</p>
                        <p><strong>Sections:</strong> {validationStatus.contentPreview.sections.join(', ')}</p>
                        <p><strong>Structured Sections:</strong> {validationStatus.contentPreview.structuredSections.join(', ')}</p>
                      </div>
                    </div>
                  )}

                  {!validationStatus.valid && validationStatus.errors && (
                    <div className="mb-4">
                      <h3 className="text-lg font-semibold">Validation Errors</h3>
                      <div className="bg-red-100 p-2 rounded">
                        <ul className="list-disc pl-5">
                          {validationStatus.errors.map((error: any, index: number) => (
                            <li key={index}>
                              <strong>{error.path}:</strong> {error.message} ({error.code})
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <p>No validation data available. Click "Validate Content" to run validation.</p>
              )}
            </div>
          )}

          {activeTab === 'json' && (
            <div>
              <h2 className="text-xl font-bold mb-2">JSON Preview</h2>
              {jsonPreview ? (
                <div>
                  <div className="mb-4">
                    <h3 className="text-lg font-semibold">Structured Content</h3>
                    <div className="bg-gray-100 p-2 rounded overflow-auto max-h-96">
                      <pre>{JSON.stringify(jsonPreview.structuredContent, null, 2)}</pre>
                    </div>
                  </div>

                  <div className="mb-4">
                    <h3 className="text-lg font-semibold">Sections</h3>
                    <div className="bg-gray-100 p-2 rounded overflow-auto max-h-96">
                      <pre>{JSON.stringify(jsonPreview.sections, null, 2)}</pre>
                    </div>
                  </div>
                </div>
              ) : (
                <p>No JSON preview available. Click "Fetch JSON Preview" to load the data.</p>
              )}
            </div>
          )}

          {activeTab === 'logs' && (
            <div>
              <h2 className="text-xl font-bold mb-2">Logs</h2>
              <div className="bg-black text-green-400 p-2 rounded font-mono text-sm h-96 overflow-auto">
                {logs.length > 0 ? (
                  logs.map((log, index) => (
                    <div key={index} className="mb-1">{log}</div>
                  ))
                ) : (
                  <p>No logs available yet.</p>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
