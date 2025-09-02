"use strict";
'use client';
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = ExtractedContent;
const react_1 = require("react");
const StyledMarkdown_1 = __importDefault(require("./StyledMarkdown"));
const DynamicThemeProvider_1 = require("./DynamicThemeProvider");
function ExtractedContent({ filePath, showDownloadButton = true }) {
    const [content, setContent] = (0, react_1.useState)(null);
    const [loading, setLoading] = (0, react_1.useState)(true);
    const [error, setError] = (0, react_1.useState)(null);
    // Access the PDF theme context
    const themeContext = (0, DynamicThemeProvider_1.usePdfThemeContext)();
    // Function to handle downloading the content
    const handleDownload = () => {
        if (!content)
            return;
        // Create a blob with the content
        const blob = new Blob([content], { type: 'text/markdown' });
        const url = URL.createObjectURL(blob);
        // Create a temporary link and trigger download
        const a = document.createElement('a');
        a.href = url;
        a.download = getFileName(filePath);
        document.body.appendChild(a);
        a.click();
        // Clean up
        setTimeout(() => {
            document.body.removeChild(a);
            URL.revokeObjectURL(url);
        }, 0);
    };
    // Helper to get a nice filename from the path
    const getFileName = (path) => {
        // Extract the base name from the path
        const baseName = path.split('/').pop() || 'content';
        // If it doesn't have an extension, add .md
        if (!baseName.includes('.')) {
            return `${baseName}.md`;
        }
        return baseName;
    };
    (0, react_1.useEffect)(() => {
        async function fetchContent() {
            try {
                setLoading(true);
                const response = await fetch(filePath);
                if (!response.ok) {
                    throw new Error(`Failed to fetch content: ${response.status} ${response.statusText}`);
                }
                const text = await response.text();
                setContent(text);
                setError(null);
            }
            catch (err) {
                console.error('Error fetching content:', err);
                setError('Failed to load content. Please try again later.');
            }
            finally {
                setLoading(false);
            }
        }
        fetchContent();
    }, [filePath]);
    if (loading) {
        return (<div className="analyzer-section-content p-4">
        <div className="animate-pulse flex space-x-4">
          <div className="flex-1 space-y-4 py-1">
            <div className="h-4 bg-[var(--bg-tertiary)] rounded w-3/4"></div>
            <div className="space-y-2">
              <div className="h-4 bg-[var(--bg-tertiary)] rounded"></div>
              <div className="h-4 bg-[var(--bg-tertiary)] rounded w-5/6"></div>
            </div>
          </div>
        </div>
      </div>);
    }
    if (error) {
        return (<div className="analyzer-section-content p-4">
        <p className="text-[var(--state-error)]">{error}</p>
      </div>);
    }
    return (<div className="analyzer-section-content p-4">
      {showDownloadButton && content && (<div className="mb-4 flex justify-start">
          <button onClick={handleDownload} className="analyzer-button analyzer-button-primary text-sm flex items-center" style={{
                backgroundColor: 'var(--cta-primary-bg, rgba(126, 78, 45, 0.1))',
                color: 'var(--text-color, #333333)',
                fontFamily: 'var(--font-button, sans-serif)',
                padding: '0.5rem 0.75rem',
                borderRadius: '4px',
                border: 'none',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                transition: 'all 0.2s ease'
            }}>
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"/>
            </svg>
            Download Resume
          </button>
        </div>)}
      <div className="prose max-w-none" style={{
            maxHeight: 'calc(85vh - 6rem)',
            overflowY: 'auto',
            paddingRight: '0.5rem',
            fontFamily: 'var(--font-body, serif)',
            color: 'var(--text-color, #333333)'
        }}>
        {filePath.endsWith('.md') ? (<StyledMarkdown_1.default>{content || ''}</StyledMarkdown_1.default>) : (<pre className="whitespace-pre-wrap analyzer-section-content p-4 rounded" style={{
                fontFamily: 'var(--font-mono, monospace)',
                fontSize: '0.9rem',
                lineHeight: '1.5',
                color: 'var(--text-color, #333333)',
                backgroundColor: 'var(--bg-primary, #ffffff)',
                border: '1px solid var(--border-color, rgba(73, 66, 61, 0.1))',
                borderRadius: '4px',
                padding: '1rem'
            }}>{content}</pre>)}
      </div>
    </div>);
}
// Enhanced markdown formatter
function formatMarkdown(markdown) {
    return markdown
        // Headers with sticky positioning for better scrolling
        .replace(/^# (.*$)/gm, '<h1 class="text-2xl font-bold mb-4 sticky top-0 analyzer-section-header py-2 z-10">$1</h1>')
        .replace(/^## (.*$)/gm, '<h2 class="text-2xl font-bold mt-8 mb-4">$1</h2>')
        // Special handling for education entries (school name and years)
        .replace(/^### (BFA|BA|ASSC).*?\n\*\*(.*?) \((.*?)\)\*\*/gm, '<h3 class="text-xl font-bold mt-6 mb-1">$1</h3><p class="font-semibold -mt-1 mb-3 education-entry">$2 <span class="education-years">($3)</span></p>')
        // Special handling for company headers (h3) followed by job titles
        .replace(/^### (.*?)\n\*\*(.*?)\*\*/gm, '<h3 class="text-xl font-bold mt-6 mb-1">$1</h3><p class="font-semibold -mt-1 mb-3">$2</p>')
        // Regular h3 headers that don't match the pattern above
        .replace(/^### (.*$)/gm, '<h3 class="text-xl font-bold mt-6 mb-3">$1</h3>')
        .replace(/^#### (.*$)/gm, '<h4 class="text-lg font-bold mt-5 mb-2">$1</h4>')
        .replace(/^##### (.*$)/gm, '<h5 class="text-base font-bold mt-4 mb-2">$1</h5>')
        // Emphasis
        .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
        .replace(/\*(.*?)\*/g, '<em>$1</em>')
        // Lists
        .replace(/^- (.*$)/gm, '<li class="ml-6 mb-1">$1</li>')
        // Links
        .replace(/\[(.*?)\]\((.*?)\)/g, '<a href="$2" class="text-[var(--ui-primary)] hover:text-[var(--ui-primary-hover)] hover:underline" target="_blank">$1</a>')
        // Horizontal rule
        .replace(/^---$/gm, '<hr class="my-6 border-t border-[var(--border-light)]">')
        // Paragraphs and line breaks
        .replace(/\n\n/g, '</p><p class="mb-4">')
        // Wrap in paragraph tags
        .replace(/^(.+)$/gm, function (match) {
        if (match.startsWith('<h') ||
            match.startsWith('<li') ||
            match.startsWith('<hr') ||
            match.startsWith('<p') ||
            match.startsWith('</p')) {
            return match;
        }
        return '<p class="mb-4">' + match + '</p>';
    })
        // Fix duplicate paragraph tags
        .replace(/<\/p><p class="mb-4"><p class="mb-4">/g, '</p><p class="mb-4">')
        .replace(/<p class="mb-4"><\/p>/g, '')
        // Wrap lists
        .replace(/(<li class="ml-6 mb-1">.*<\/li>\s*)+/g, function (match) {
        return '<ul class="list-disc mb-4">' + match + '</ul>';
    });
}
//# sourceMappingURL=ExtractedContent.js.map