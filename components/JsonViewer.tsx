'use client';

import { useState, useEffect } from 'react';
import { DanteLogger } from '@/utils/DanteLogger';
import { HesseLogger } from '@/utils/HesseLogger';

interface JsonViewerProps {
  onClose?: () => void;
}

export default function JsonViewer({ onClose }: JsonViewerProps) {
  const [jsonContent, setJsonContent] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<string>('structured');
  const [copySuccess, setCopySuccess] = useState<boolean>(false);
  const [showAnalyzed, setShowAnalyzed] = useState<boolean>(false);
  const [analyzedContent, setAnalyzedContent] = useState<any>(null);
  const [isAnalyzing, setIsAnalyzing] = useState<boolean>(false);

  useEffect(() => {
    async function fetchJsonContent() {
      try {
        setLoading(true);
        setError(null);

        // Add a timestamp to bust cache
        const timestamp = new Date().getTime();
        const response = await fetch(`/api/get-pdf-json?t=${timestamp}`);

        if (!response.ok) {
          throw new Error(`API responded with status: ${response.status}`);
        }

        const data = await response.json();

        if (!data.success) {
          throw new Error(data.error || 'Unknown error');
        }

        setJsonContent(data.content);
        DanteLogger.success.basic('JSON content loaded successfully');
      } catch (error) {
        console.error('Error loading JSON content:', error);
        setError(error instanceof Error ? error.message : 'Failed to load JSON content');
        DanteLogger.error.dataFlow('Error loading JSON content', { error });
      } finally {
        setLoading(false);
      }
    }

    fetchJsonContent();
  }, []);

  const fetchAnalyzedContent = async (forceRefresh = false) => {
    try {
      setIsAnalyzing(true);
      setError(null);

      // Add a timestamp to bust cache
      const timestamp = new Date().getTime();
      const response = await fetch(`/api/analyze-pdf-content?t=${timestamp}${forceRefresh ? '&forceRefresh=true' : ''}`);

      if (!response.ok) {
        throw new Error(`API responded with status: ${response.status}`);
      }

      const data = await response.json();

      if (!data.success) {
        throw new Error(data.error || 'Unknown error');
      }

      setAnalyzedContent(data.analyzedContent);
      setShowAnalyzed(true);
      DanteLogger.success.core('Analyzed content loaded successfully');
    } catch (error) {
      console.error('Error loading analyzed content:', error);
      setError(error instanceof Error ? error.message : 'Failed to load analyzed content');
      DanteLogger.error.dataFlow('Error loading analyzed content', { error });
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleRefresh = async () => {
    try {
      setLoading(true);
      setError(null);

      // Add a timestamp to bust cache and force refresh
      const timestamp = new Date().getTime();
      const response = await fetch(`/api/get-pdf-json?t=${timestamp}&forceRefresh=true`);

      if (!response.ok) {
        throw new Error(`API responded with status: ${response.status}`);
      }

      const data = await response.json();

      if (!data.success) {
        throw new Error(data.error || 'Unknown error');
      }

      setJsonContent(data.content);
      DanteLogger.success.basic('JSON content refreshed successfully');
    } catch (error) {
      console.error('Error refreshing JSON content:', error);
      setError(error instanceof Error ? error.message : 'Failed to refresh JSON content');
      DanteLogger.error.dataFlow('Error refreshing JSON content', { error });
    } finally {
      setLoading(false);
    }
  };

  const handleCopyJson = () => {
    if (!jsonContent && !analyzedContent) return;

    let contentToCopy;

    if (showAnalyzed && analyzedContent) {
      contentToCopy = JSON.stringify(analyzedContent, null, 2);
    } else {
      switch (activeTab) {
        case 'raw':
          contentToCopy = jsonContent.rawText;
          break;
        case 'structured':
          contentToCopy = JSON.stringify(jsonContent.structuredContent, null, 2);
          break;
        case 'full':
          contentToCopy = JSON.stringify(jsonContent, null, 2);
          break;
        default:
          contentToCopy = JSON.stringify(jsonContent.structuredContent, null, 2);
      }
    }

    navigator.clipboard.writeText(contentToCopy)
      .then(() => {
        setCopySuccess(true);
        DanteLogger.success.ux('JSON content copied to clipboard');

        // Reset the success message after 2 seconds
        setTimeout(() => {
          setCopySuccess(false);
        }, 2000);
      })
      .catch(err => {
        console.error('Error copying JSON content:', err);
        DanteLogger.error.runtime('Error copying JSON content', { error: err });
      });
  };

  const renderJsonContent = () => {
    if (showAnalyzed && analyzedContent) {
      return (
        <pre className="bg-[var(--bg-secondary)] p-4 rounded-md overflow-auto max-h-[60vh] text-sm">
          {JSON.stringify(analyzedContent, null, 2)}
        </pre>
      );
    }

    if (!jsonContent) return null;

    switch (activeTab) {
      case 'raw':
        return (
          <pre className="bg-[var(--bg-secondary)] p-4 rounded-md overflow-auto max-h-[60vh] text-sm">
            {jsonContent.rawText}
          </pre>
        );
      case 'structured':
        return (
          <pre className="bg-[var(--bg-secondary)] p-4 rounded-md overflow-auto max-h-[60vh] text-sm">
            {JSON.stringify(jsonContent.structuredContent, null, 2)}
          </pre>
        );
      case 'full':
        return (
          <pre className="bg-[var(--bg-secondary)] p-4 rounded-md overflow-auto max-h-[60vh] text-sm">
            {JSON.stringify(jsonContent, null, 2)}
          </pre>
        );
      default:
        return (
          <pre className="bg-[var(--bg-secondary)] p-4 rounded-md overflow-auto max-h-[60vh] text-sm">
            {JSON.stringify(jsonContent.structuredContent, null, 2)}
          </pre>
        );
    }
  };

  return (
    <div className="json-viewer bg-[var(--bg-primary)] text-[var(--text-primary)] p-6 rounded-lg shadow-lg">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold">PDF Content JSON Viewer</h2>
        {onClose && (
          <button
            onClick={onClose}
            className="bg-transparent border-none text-[var(--text-primary)] text-xl cursor-pointer p-1 rounded hover:bg-[rgba(0,0,0,0.1)]"
            aria-label="Close"
          >
            &times;
          </button>
        )}
      </div>

      <div className="flex justify-between items-center mb-4">
        <div className="flex space-x-2">
          {!showAnalyzed ? (
            <>
              <button
                onClick={() => setActiveTab('structured')}
                className={`px-3 py-1 rounded ${
                  activeTab === 'structured'
                    ? 'bg-[var(--cta-primary)] text-white'
                    : 'bg-[var(--bg-secondary)] text-[var(--text-primary)]'
                }`}
              >
                Structured
              </button>
              <button
                onClick={() => setActiveTab('raw')}
                className={`px-3 py-1 rounded ${
                  activeTab === 'raw'
                    ? 'bg-[var(--cta-primary)] text-white'
                    : 'bg-[var(--bg-secondary)] text-[var(--text-primary)]'
                }`}
              >
                Raw Text
              </button>
              <button
                onClick={() => setActiveTab('full')}
                className={`px-3 py-1 rounded ${
                  activeTab === 'full'
                    ? 'bg-[var(--cta-primary)] text-white'
                    : 'bg-[var(--bg-secondary)] text-[var(--text-primary)]'
                }`}
              >
                Full JSON
              </button>
            </>
          ) : (
            <button
              onClick={() => setShowAnalyzed(false)}
              className="px-3 py-1 rounded bg-[var(--bg-secondary)] text-[var(--text-primary)]"
            >
              Back to Original
            </button>
          )}
        </div>

        <div className="flex space-x-2">
          {!showAnalyzed ? (
            <button
              onClick={() => fetchAnalyzedContent()}
              disabled={loading || isAnalyzing}
              className="px-3 py-1 rounded bg-[var(--cta-accent)] text-white disabled:opacity-50"
            >
              {isAnalyzing ? 'Analyzing...' : 'Analyze with ChatGPT'}
            </button>
          ) : (
            <button
              onClick={() => fetchAnalyzedContent(true)}
              disabled={loading || isAnalyzing}
              className="px-3 py-1 rounded bg-[var(--cta-accent)] text-white disabled:opacity-50"
            >
              {isAnalyzing ? 'Analyzing...' : 'Re-Analyze'}
            </button>
          )}
          <button
            onClick={handleRefresh}
            disabled={loading || isAnalyzing}
            className="px-3 py-1 rounded bg-[var(--cta-secondary)] text-white disabled:opacity-50"
          >
            {loading ? 'Refreshing...' : 'Refresh'}
          </button>
          <button
            onClick={handleCopyJson}
            disabled={(!jsonContent && !analyzedContent) || loading || isAnalyzing}
            className="px-3 py-1 rounded bg-[var(--cta-primary)] text-white disabled:opacity-50"
          >
            {copySuccess ? 'Copied!' : 'Copy JSON'}
          </button>
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center items-center h-64">
          <div className="w-12 h-12 border-t-4 border-[var(--cta-primary)] border-solid rounded-full animate-spin"></div>
        </div>
      ) : isAnalyzing ? (
        <div className="flex flex-col justify-center items-center h-64">
          <div className="w-12 h-12 border-t-4 border-[var(--cta-accent)] border-solid rounded-full animate-spin mb-4"></div>
          <p className="text-[var(--text-secondary)]">Analyzing with ChatGPT...</p>
          <p className="text-xs text-[var(--text-tertiary)] mt-2">This may take a few moments</p>
        </div>
      ) : error ? (
        <div className="bg-[var(--state-error-light)] text-[var(--state-error)] p-4 rounded-md">
          <p className="font-bold">Error:</p>
          <p>{error}</p>
        </div>
      ) : (
        <div className="json-content">
          {renderJsonContent()}
        </div>
      )}

      <div className="mt-4 text-sm text-[var(--text-tertiary)]">
        {showAnalyzed ? (
          <p>
            This view shows the PDF content analyzed by ChatGPT. The AI has structured the raw text into
            sections and organized the content. Compare this with the original extraction to see how
            ChatGPT interprets the resume content.
          </p>
        ) : (
          <p>
            This view shows the extracted PDF content in JSON format before it's converted to text or markdown.
            Use this to diagnose issues with the content extraction and download functionality.
            Click "Analyze with ChatGPT" to see how AI would structure this content.
          </p>
        )}
      </div>
    </div>
  );
}
