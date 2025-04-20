'use client';

import { useState, useEffect } from 'react';

interface ExtractedContentProps {
  filePath: string;
  showDownloadButton?: boolean;
}

export default function ExtractedContent({ filePath, showDownloadButton = true }: ExtractedContentProps) {
  const [content, setContent] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchContent() {
      try {
        setLoading(true);
        const response = await fetch(filePath);

        if (!response.ok) {
          throw new Error(`Failed to fetch content: ${response.status} ${response.statusText}`);
        }

        const text = await response.text();
        setContent(text);
      } catch (err) {
        console.error('Error fetching content:', err);
        setError(err instanceof Error ? err.message : 'Failed to load content');
      } finally {
        setLoading(false);
      }
    }

    fetchContent();
  }, [filePath]);

  const handleDownload = () => {
    if (!content) return;

    // Create a blob from the content
    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);

    // Create a temporary link and trigger download
    const a = document.createElement('a');
    a.href = url;
    a.download = `extracted_content${filePath.endsWith('.md') ? '.md' : '.txt'}`;
    document.body.appendChild(a);
    a.click();

    // Clean up
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  if (loading) {
    return (
      <div className="p-4 bg-white rounded-lg shadow">
        <div className="animate-pulse">
          <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
          <div className="h-4 bg-gray-200 rounded w-1/2 mb-2"></div>
          <div className="h-4 bg-gray-200 rounded w-5/6 mb-2"></div>
          <div className="h-4 bg-gray-200 rounded w-2/3 mb-2"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4 bg-white rounded-lg shadow">
        <div className="text-red-600">
          <p>Error loading content: {error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 aw-content-panel">
      {showDownloadButton && content && (
        <div className="mb-4 flex justify-start">
          <button
            onClick={handleDownload}
            className="aw-button-primary text-sm flex items-center"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
            </svg>
            Download for AI
          </button>
        </div>
      )}
      <div className="prose max-w-none max-h-[400px] overflow-y-auto pr-2">
        {filePath.endsWith('.md') ? (
          <div dangerouslySetInnerHTML={{ __html: formatMarkdown(content || '') }} />
        ) : (
          <pre className="whitespace-pre-wrap font-mono text-sm bg-gray-50 p-4 rounded">{content}</pre>
        )}
      </div>
    </div>
  );
}

// Enhanced markdown formatter
function formatMarkdown(markdown: string): string {
  return markdown
    // Headers with sticky positioning for better scrolling
    .replace(/^# (.*$)/gm, '<h1 class="text-3xl font-bold mb-4 sticky top-0 bg-[var(--content-bg)] py-2 z-10">$1</h1>')
    .replace(/^## (.*$)/gm, '<h2 class="text-2xl font-bold mt-6 mb-3 sticky top-0 bg-[var(--content-bg)] py-2 z-10">$1</h2>')
    .replace(/^### (.*$)/gm, '<h3 class="text-xl font-bold mt-4 mb-2 sticky top-0 bg-[var(--content-bg)] py-2 z-10">$1</h3>')
    .replace(/^#### (.*$)/gm, '<h4 class="text-lg font-bold mt-3 mb-2 sticky top-0 bg-[var(--content-bg)] py-2 z-10">$1</h4>')
    .replace(/^##### (.*$)/gm, '<h5 class="text-base font-bold mt-2 mb-1 sticky top-0 bg-[var(--content-bg)] py-2 z-10">$1</h5>')

    // Emphasis
    .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
    .replace(/\*(.*?)\*/g, '<em>$1</em>')

    // Lists
    .replace(/^\s*\d+\.\s+(.*$)/gm, '<li class="mb-1">$1</li>')
    .replace(/^\s*\*\s+(.*$)/gm, '<li class="mb-1">$1</li>')
    .replace(/^\s*-\s+(.*$)/gm, '<li class="mb-1">$1</li>')

    // Wrap lists in <ul> or <ol>
    .replace(/(<li.*?<\/li>\n)+/g, (match) => {
      if (match.includes('1.')) {
        return `<ol class="list-decimal pl-5 mb-4">${match}</ol>`;
      }
      return `<ul class="list-disc pl-5 mb-4">${match}</ul>`;
    })

    // Links
    .replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" class="text-blue-600 hover:underline" target="_blank" rel="noopener noreferrer">$1</a>')

    // Code blocks
    .replace(/```([\s\S]*?)```/g, '<pre class="bg-gray-100 p-3 rounded font-mono text-sm overflow-x-auto mb-4">$1</pre>')

    // Inline code
    .replace(/`([^`]+)`/g, '<code class="bg-gray-100 px-1 py-0.5 rounded font-mono text-sm">$1</code>')

    // Blockquotes
    .replace(/^>\s+(.*$)/gm, '<blockquote class="border-l-4 border-gray-300 pl-4 italic text-gray-700 mb-4">$1</blockquote>')

    // Horizontal rules
    .replace(/^---$/gm, '<hr class="border-t border-gray-300 my-4">')

    // Paragraphs (must come last)
    .replace(/^([^<].*[^>])$/gm, '<p class="mb-4">$1</p>')

    // Fix any double-wrapped paragraphs
    .replace(/<p><p>/g, '<p>')
    .replace(/<\/p><\/p>/g, '</p>');
}
