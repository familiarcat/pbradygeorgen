'use client';

import React, { useEffect, useState } from 'react';
import ReactMarkdown from 'react-markdown';
import { usePdfThemeContext } from './DynamicThemeProvider';
import { DanteLogger } from '@/utils/DanteLogger';

interface StyledMarkdownProps {
  children: string;
  className?: string;
}

/**
 * StyledMarkdown component that applies PDF-extracted styles to markdown content
 *
 * This component wraps ReactMarkdown and applies PDF-extracted styles to all elements
 * rendered by ReactMarkdown, ensuring consistent styling throughout the application.
 *
 * This component has been enhanced to ensure PDF-extracted styles are properly applied
 * with high specificity and improved spacing to prevent text overlap.
 */
const StyledMarkdown: React.FC<StyledMarkdownProps> = ({ children, className }) => {
  // Access the PDF theme context to get extracted styles
  const themeContext = usePdfThemeContext();
  const [stylesLoaded, setStylesLoaded] = useState(false);

  // Check if PDF styles are loaded
  useEffect(() => {
    const checkStylesLoaded = () => {
      const pdfStylesLoaded = document.documentElement.getAttribute('data-pdf-styles-loaded') === 'true';
      setStylesLoaded(pdfStylesLoaded);

      if (pdfStylesLoaded) {
        DanteLogger.success.basic('StyledMarkdown: PDF styles detected and will be applied');
      } else {
        DanteLogger.error.runtime('StyledMarkdown: PDF styles not detected, using fallbacks');
      }
    };

    // Check immediately
    checkStylesLoaded();

    // Also listen for the custom event when styles are loaded
    const handleStylesLoaded = () => {
      DanteLogger.success.basic('StyledMarkdown: PDF styles loaded event received');
      setStylesLoaded(true);
    };

    document.addEventListener('pdf-styles-loaded', handleStylesLoaded);

    return () => {
      document.removeEventListener('pdf-styles-loaded', handleStylesLoaded);
    };
  }, []);

  // Check if this is being rendered inside a SummaryModal (Introduction)
  const isSummaryModal = document.querySelector('.summary-modal-content') !== null;

  // Define components with PDF-extracted styles with higher specificity
  const components = {
    h1: ({ node, ...props }: any) => (
      <h1
        style={{
          fontFamily: 'var(--pdf-heading-font, var(--font-heading, "Helvetica Neue", Arial, sans-serif))' + ' !important',
          color: isSummaryModal
            ? 'var(--text-color, #F5F3E7)' + ' !important'
            : 'var(--pdf-text-color, var(--text-color, var(--dynamic-text, #333333)))' + ' !important',
          fontSize: '1.8rem',
          marginTop: '0.5rem',
          marginBottom: '1.5rem', // Increased for better spacing
          fontWeight: 600, // Increased for better visibility
          letterSpacing: '-0.5px',
          textAlign: 'left' as const,
          lineHeight: '1.4', // Added for consistent spacing
          display: 'block', // Ensures proper block formatting
          width: '100%' // Ensures full width
        }}
        {...props}
      />
    ),
    h2: ({ node, ...props }: any) => (
      <h2
        style={{
          fontFamily: 'var(--pdf-heading-font, var(--font-heading, "Helvetica Neue", Arial, sans-serif))' + ' !important',
          color: isSummaryModal
            ? 'var(--text-color, #F5F3E7)' + ' !important'
            : 'var(--pdf-text-color, var(--text-color, var(--dynamic-text, #333333)))' + ' !important',
          fontSize: '1.5rem',
          marginTop: '2rem', // Increased for better spacing
          marginBottom: '1rem', // Increased for better spacing
          fontWeight: 600, // Increased for better visibility
          borderBottom: isSummaryModal
            ? '1px solid rgba(255, 255, 255, 0.1)' + ' !important'
            : '1px solid var(--pdf-border-color, var(--border-color, var(--dynamic-border, rgba(73, 66, 61, 0.1))))' + ' !important',
          paddingBottom: '0.5rem',
          textAlign: 'left' as const,
          lineHeight: '1.4', // Added for consistent spacing
          display: 'block', // Ensures proper block formatting
          width: '100%' // Ensures full width
        }}
        {...props}
      />
    ),
    h3: ({ node, ...props }: any) => (
      <h3
        style={{
          fontFamily: 'var(--pdf-heading-font, var(--font-heading, "Helvetica Neue", Arial, sans-serif))' + ' !important',
          color: isSummaryModal
            ? 'var(--text-color, #F5F3E7)' + ' !important'
            : 'var(--pdf-text-color, var(--text-color, var(--dynamic-text, #333333)))' + ' !important',
          fontSize: '1.25rem',
          marginTop: '1.75rem', // Increased for better spacing
          marginBottom: '0.75rem', // Increased for better spacing
          fontWeight: 600, // Increased for better visibility
          textAlign: 'left' as const,
          lineHeight: '1.4', // Added for consistent spacing
          display: 'block', // Ensures proper block formatting
          width: '100%' // Ensures full width
        }}
        {...props}
      />
    ),
    h4: ({ node, ...props }: any) => (
      <h4
        style={{
          fontFamily: 'var(--pdf-heading-font, var(--font-heading, "Helvetica Neue", Arial, sans-serif))' + ' !important',
          color: isSummaryModal
            ? 'var(--text-color, #F5F3E7)' + ' !important'
            : 'var(--pdf-text-color, var(--text-color, var(--dynamic-text, #333333)))' + ' !important',
          fontSize: '1.1rem',
          marginTop: '1.5rem', // Increased for better spacing
          marginBottom: '0.75rem', // Increased for better spacing
          fontWeight: 500, // Increased for better visibility
          fontStyle: 'italic',
          textAlign: 'left' as const,
          lineHeight: '1.4', // Added for consistent spacing
          display: 'block', // Ensures proper block formatting
          width: '100%' // Ensures full width
        }}
        {...props}
      />
    ),
    p: ({ node, ...props }: any) => (
      <p
        style={{
          fontFamily: 'var(--pdf-body-font, var(--font-body, "Helvetica Neue", Arial, sans-serif))' + ' !important',
          color: isSummaryModal
            ? 'var(--text-color, #F5F3E7)' + ' !important'
            : 'var(--pdf-text-color, var(--text-color, var(--dynamic-text, #333333)))' + ' !important',
          marginBottom: '1.25rem', // Increased for better spacing
          lineHeight: '1.8', // Increased for better readability and to prevent overlap
          textAlign: 'left' as const,
          display: 'block', // Ensures proper block formatting
          width: '100%', // Ensures full width
          marginTop: '0.5rem', // Added for consistent spacing
          fontWeight: 400, // Normal weight for body text
          WebkitHyphens: 'none' as const, // Disables hyphenation to prevent excessive hyphens
          msHyphens: 'none' as const, // For IE/Edge
          hyphens: 'none' as const, // TypeScript needs 'as const' for the enum type
          overflowWrap: 'break-word' as const, // Prevents text from overflowing
          wordWrap: 'break-word' as const, // Ensures words break properly
          wordBreak: 'normal' as const // Ensures words break properly
        }}
        {...props}
      />
    ),
    ul: ({ node, ...props }: any) => (
      <ul
        style={{
          marginBottom: '1.25rem', // Increased for better spacing
          paddingLeft: '2.5rem', // Increased for better indentation
          listStylePosition: 'outside', // Ensures bullets are outside the text
          listStyleType: 'disc', // Explicit bullet style
          display: 'block', // Ensures proper block formatting
          width: '100%' // Ensures full width
        }}
        {...props}
      />
    ),
    ol: ({ node, ...props }: any) => (
      <ol
        style={{
          marginBottom: '1.25rem', // Increased for better spacing
          paddingLeft: '2.5rem', // Increased for better indentation
          listStylePosition: 'outside', // Ensures numbers are outside the text
          listStyleType: 'decimal', // Explicit number style
          display: 'block', // Ensures proper block formatting
          width: '100%' // Ensures full width
        }}
        {...props}
      />
    ),
    li: ({ node, ...props }: any) => (
      <li
        style={{
          fontFamily: 'var(--pdf-body-font, var(--font-body, "Helvetica Neue", Arial, sans-serif))' + ' !important',
          color: isSummaryModal
            ? 'var(--text-color, #F5F3E7)' + ' !important'
            : 'var(--pdf-text-color, var(--text-color, var(--dynamic-text, #333333)))' + ' !important',
          marginBottom: '0.75rem', // Increased for better spacing
          textAlign: 'left' as const,
          lineHeight: '1.6', // Added for consistent spacing
          paddingLeft: '0.5rem', // Added for better readability
          display: 'list-item', // Ensures proper list item formatting
          fontWeight: 400 // Normal weight for list items
        }}
        {...props}
      />
    ),
    a: ({ node, ...props }: any) => (
      <a
        style={{
          color: isSummaryModal
            ? 'var(--primary, #00A99D)' + ' !important'
            : 'var(--pdf-primary-color, var(--primary, var(--dynamic-primary, #5A7682)))' + ' !important',
          textDecoration: 'none',
          fontWeight: 500, // Added for better visibility
          borderBottom: isSummaryModal
            ? '1px dotted var(--primary, #00A99D)'
            : '1px dotted var(--pdf-primary-color, var(--primary, var(--dynamic-primary, #5A7682)))' // Added for better visibility
        }}
        {...props}
      />
    ),
    code: ({ node, inline, ...props }: any) => (
      <code
        style={{
          fontFamily: 'var(--pdf-mono-font, var(--font-mono, var(--dynamic-mono-font, monospace)))' + ' !important',
          backgroundColor: inline ? 'var(--code-bg, rgba(73, 66, 61, 0.05))' : 'transparent',
          padding: inline ? '0.2rem 0.4rem' : '0',
          borderRadius: '3px',
          fontSize: '0.9em',
          lineHeight: inline ? 'inherit' : '1.6', // Added for consistent spacing
          display: inline ? 'inline' : 'block' // Ensures proper formatting
        }}
        {...props}
      />
    ),
    pre: ({ node, ...props }: any) => (
      <pre
        style={{
          backgroundColor: 'var(--code-bg, rgba(73, 66, 61, 0.05))',
          padding: '1rem',
          borderRadius: '4px',
          overflowX: 'auto',
          marginBottom: '1.25rem', // Increased for better spacing
          marginTop: '1rem', // Added for consistent spacing
          display: 'block', // Ensures proper block formatting
          width: '100%' // Ensures full width
        }}
        {...props}
      />
    ),
    blockquote: ({ node, ...props }: any) => (
      <blockquote
        style={{
          borderLeft: '4px solid var(--pdf-border-color, var(--border-color, rgba(73, 66, 61, 0.1)))' + ' !important',
          paddingLeft: '1.5rem', // Increased for better spacing
          marginLeft: '0',
          marginRight: '0',
          marginTop: '1rem', // Added for consistent spacing
          marginBottom: '1.25rem', // Increased for better spacing
          fontStyle: 'italic',
          color: 'var(--pdf-text-secondary, var(--text-secondary, #666666))' + ' !important',
          display: 'block', // Ensures proper block formatting
          width: '100%', // Ensures full width
          lineHeight: '1.6' // Added for consistent spacing
        }}
        {...props}
      />
    ),
    table: ({ node, ...props }: any) => (
      <table
        style={{
          width: '100%',
          borderCollapse: 'collapse',
          marginBottom: '1.25rem', // Increased for better spacing
          marginTop: '1rem', // Added for consistent spacing
          display: 'block', // Ensures proper block formatting
          overflowX: 'auto' // Added for better handling of wide tables
        }}
        {...props}
      />
    ),
    th: ({ node, ...props }: any) => (
      <th
        style={{
          fontFamily: 'var(--pdf-heading-font, var(--font-heading, serif))' + ' !important',
          color: 'var(--pdf-text-color, var(--text-color, #333333))' + ' !important',
          fontWeight: 'bold',
          padding: '0.75rem', // Increased for better spacing
          borderBottom: '2px solid var(--pdf-border-color, var(--border-color, rgba(73, 66, 61, 0.1)))' + ' !important',
          textAlign: 'left' as const
        }}
        {...props}
      />
    ),
    td: ({ node, ...props }: any) => (
      <td
        style={{
          fontFamily: 'var(--pdf-body-font, var(--font-body, serif))' + ' !important',
          color: 'var(--pdf-text-color, var(--text-color, #333333))' + ' !important',
          padding: '0.75rem', // Increased for better spacing
          borderBottom: '1px solid var(--pdf-border-color, var(--border-color, rgba(73, 66, 61, 0.1)))' + ' !important',
          lineHeight: '1.4' // Added for consistent spacing
        }}
        {...props}
      />
    ),
    hr: ({ node, ...props }: any) => {
      // Check if this is an Introduction document
      const isIntroduction = document.location.pathname.includes('introduction') ||
                            document.title.toLowerCase().includes('introduction');

      // If it's an Introduction, don't render horizontal rules
      if (isIntroduction) {
        return <div style={{ margin: '1.5rem 0' }} {...props} />;
      }

      // Otherwise render a subtle horizontal rule
      return (
        <hr
          style={{
            border: 'none',
            borderTop: '1px solid var(--pdf-border-color, var(--border-color, rgba(73, 66, 61, 0.1)))' + ' !important',
            margin: '2.5rem 0', // Further increased for better spacing
            display: 'block', // Ensures proper block formatting
            width: '100%', // Ensures full width
            opacity: '0.5', // Make horizontal rules more subtle
            height: '1px' // Ensure consistent height
          }}
          {...props}
        />
      );
    },
    img: ({ node, ...props }: any) => (
      <img
        style={{
          maxWidth: '100%',
          height: 'auto',
          borderRadius: '4px',
          display: 'block', // Ensures proper block formatting
          marginTop: '1rem', // Added for consistent spacing
          marginBottom: '1.25rem' // Increased for better spacing
        }}
        {...props}
      />
    )
  };

  // Log when rendering with PDF styles
  useEffect(() => {
    if (stylesLoaded) {
      DanteLogger.success.ux('StyledMarkdown: Rendering with PDF-extracted styles');
    }
  }, [stylesLoaded]);

  // Clean up the markdown content if it has triple backticks
  const cleanMarkdown = () => {
    if (!children) return '';

    let content = children.trim();
    if (content.startsWith('```')) {
      const endBackticks = content.lastIndexOf('```');
      if (endBackticks > 3) {
        // Extract content between backticks, skipping the language identifier if present
        const firstLineEnd = content.indexOf('\n');
        if (firstLineEnd > 0) {
          content = content.substring(firstLineEnd + 1, endBackticks).trim();
        } else {
          content = content.substring(3, endBackticks).trim();
        }
      }
    }
    return content;
  };

  // Get the cleaned markdown content
  const cleanedMarkdown = cleanMarkdown();

  // Log the first few characters of the cleaned markdown for debugging
  useEffect(() => {
    console.log('StyledMarkdown content (first 50 chars):',
      cleanedMarkdown.substring(0, 50).replace(/\n/g, '\\n'));
  }, [cleanedMarkdown]);

  // We already have isSummaryModal defined above

  // Determine the appropriate styles based on the context
  const containerStyles = isSummaryModal ? {
    // Styles for Introduction modal (dark theme)
    fontFamily: 'var(--pdf-body-font, var(--font-body, "Helvetica Neue", Arial, sans-serif))' + ' !important',
    color: 'var(--text-color, #F5F3E7)' + ' !important',
    backgroundColor: 'transparent' + ' !important',
    padding: '1.5rem', // Increased padding for better readability
    width: '100%',
    maxWidth: '100%',
    overflowWrap: 'break-word' as const, // Prevents text from overflowing
    wordWrap: 'break-word' as const, // Ensures words break properly
    wordBreak: 'normal' as const, // Ensures words break properly
    WebkitHyphens: 'none' as const, // Disables hyphenation to prevent excessive hyphens
    msHyphens: 'none' as const, // For IE/Edge
    hyphens: 'none' as const, // TypeScript needs 'as const' for the enum type
    textAlign: 'left' as const, // Ensures left alignment
    lineHeight: '1.6', // Consistent line height
    fontWeight: 400, // Normal weight for body text
    fontSize: '16px', // Base font size
    letterSpacing: '0.01em', // Slight letter spacing for readability
    border: 'none',
    borderRadius: '0',
    boxShadow: 'none'
  } : {
    // Default styles for other contexts (light theme)
    fontFamily: 'var(--pdf-body-font, var(--font-body, "Helvetica Neue", Arial, sans-serif))' + ' !important',
    color: 'var(--pdf-text-color, var(--text-color, var(--dynamic-text, #333333)))' + ' !important',
    backgroundColor: 'var(--pdf-background-color, var(--background, var(--dynamic-background, #ffffff)))' + ' !important',
    padding: '1.5rem', // Increased padding for better readability
    width: '100%',
    maxWidth: '100%',
    overflowWrap: 'break-word' as const, // Prevents text from overflowing
    wordWrap: 'break-word' as const, // Ensures words break properly
    wordBreak: 'normal' as const, // Ensures words break properly
    WebkitHyphens: 'none' as const, // Disables hyphenation to prevent excessive hyphens
    msHyphens: 'none' as const, // For IE/Edge
    hyphens: 'none' as const, // TypeScript needs 'as const' for the enum type
    textAlign: 'left' as const, // Ensures left alignment
    lineHeight: '1.6', // Consistent line height
    fontWeight: 400, // Normal weight for body text
    fontSize: '16px', // Base font size
    letterSpacing: '0.01em', // Slight letter spacing for readability
    border: '1px solid var(--pdf-border-color, var(--border-color, rgba(73, 66, 61, 0.1)))',
    borderRadius: '4px',
    boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)'
  };

  return (
    <div
      className={`${className} pdf-styled-markdown ${isSummaryModal ? 'summary-modal-markdown' : ''}`}
      style={containerStyles}
      data-pdf-styles-loaded={stylesLoaded ? 'true' : 'false'} // Add data attribute for CSS targeting
    >
      <ReactMarkdown components={components}>
        {cleanedMarkdown}
      </ReactMarkdown>
    </div>
  );
};

export default StyledMarkdown;
