'use client';

import { useState } from 'react';
import { extractTextFromPDF, generateMarkdownSummary, saveToMarkdown } from '@/utils/pdfExtractor';
import ExtractedContent from './ExtractedContent';

interface PDFAnalyzerProps {
  pdfUrl: string;
}

export default function PDFAnalyzer({ pdfUrl }: PDFAnalyzerProps) {
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [pdfText, setPdfText] = useState<string | null>(null);
  const [markdownContent, setMarkdownContent] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [showFullText, setShowFullText] = useState(false);

  const analyzePDF = async () => {
    setIsAnalyzing(true);
    setError(null);
    setPdfText(null);
    setMarkdownContent(null);

    try {
      // Client-side extraction
      console.log('Starting PDF analysis for:', pdfUrl);
      const text = await extractTextFromPDF(pdfUrl);

      if (!text || text.trim() === '') {
        throw new Error('No text content could be extracted from the PDF');
      }

      setPdfText(text);
      console.log('PDF text extracted successfully, generating markdown...');

      // Generate markdown
      const markdown = generateMarkdownSummary(text);
      setMarkdownContent(markdown);
      console.log('Markdown generation complete');
    } catch (err) {
      console.error('Error analyzing PDF:', err);
      let errorMessage = 'Failed to analyze PDF.';

      if (err instanceof Error) {
        errorMessage += ' Error: ' + err.message;
      }

      errorMessage += ' Please try again or use a different browser.';
      setError(errorMessage);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const downloadMarkdown = () => {
    if (markdownContent) {
      saveToMarkdown(markdownContent, 'pdf-content-summary.md');
    }
  };

  // Extract a summary of the PDF content
  const extractSummary = (text: string): string => {
    if (!text) return 'No content available';

    // Get the first 500 characters as a preview
    const preview = text.substring(0, 500);

    // Count words
    const wordCount = text.split(/\s+/).filter(word => word.length > 0).length;

    // Try to identify document type based on content
    let documentType = 'Unknown document type';

    if (text.toLowerCase().includes('resume') ||
        text.toLowerCase().includes('experience') && text.toLowerCase().includes('education')) {
      documentType = 'Resume/CV';
    } else if (text.toLowerCase().includes('dear') && text.toLowerCase().includes('sincerely')) {
      documentType = 'Letter';
    } else if (text.toLowerCase().includes('abstract') && text.toLowerCase().includes('references')) {
      documentType = 'Academic paper';
    }

    return `${documentType} with approximately ${wordCount} words.\n\nPreview: ${preview}...`;
  };

  return (
    <div className="bg-gray-100 p-4 rounded-lg shadow-md">
      <h2 className="text-xl font-bold mb-4">PDF Content Analyzer</h2>

      <div className="mb-4">
        <button
          onClick={analyzePDF}
          disabled={isAnalyzing}
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:bg-blue-300"
        >
          {isAnalyzing ? 'Analyzing...' : 'Analyze PDF Content'}
        </button>
      </div>

      {error && (
        <div className="mb-4 p-3 bg-red-100 text-red-700 rounded">
          {error}
        </div>
      )}

      {/* Pre-extracted content from server-side script */}
      <div className="mb-6 border-t border-gray-300 pt-4 mt-4">
        <h3 className="text-lg font-semibold mb-2">Pre-Extracted Content</h3>
        <p className="text-sm text-gray-600 mb-4">
          This content was extracted server-side for better accuracy and is available immediately.
        </p>
        <ExtractedContent filePath="/extracted/resume_content_improved.md" />
      </div>

      {pdfText && (
        <div className="mb-4 border-t border-gray-300 pt-4 mt-4">
          <h3 className="text-lg font-semibold mb-2">Client-Side Extraction Summary</h3>
          <div className="bg-white p-3 rounded border border-gray-300 whitespace-pre-wrap">
            {extractSummary(pdfText)}
          </div>

          <div className="mt-2">
            <button
              onClick={() => setShowFullText(!showFullText)}
              className="text-blue-600 hover:underline"
            >
              {showFullText ? 'Hide Full Text' : 'Show Full Text'}
            </button>
          </div>

          {showFullText && (
            <div className="mt-2 bg-white p-3 rounded border border-gray-300 max-h-96 overflow-y-auto whitespace-pre-wrap">
              {pdfText}
            </div>
          )}
        </div>
      )}

      {markdownContent && (
        <div className="mb-4">
          <div className="flex justify-between items-center mb-2">
            <h3 className="text-lg font-semibold">Markdown Summary</h3>
            <button
              onClick={downloadMarkdown}
              className="px-3 py-1 bg-green-600 text-white rounded hover:bg-green-700 text-sm"
            >
              Download .md
            </button>
          </div>
          <div className="bg-white p-3 rounded border border-gray-300 max-h-96 overflow-y-auto whitespace-pre-wrap">
            {markdownContent}
          </div>
        </div>
      )}
    </div>
  );
}
