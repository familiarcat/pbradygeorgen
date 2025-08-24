'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import ClientSideVariables from './ClientSideVariables';
import ScrollFix from './ScrollFix';
import SalingerHeader from '@/components/SalingerHeader';
import DynamicThemeProvider from '@/components/DynamicThemeProvider';
import { DanteLogger } from '@/utils/DanteLogger';

export default function StyleTestPage() {
  const [pdfUrl, setPdfUrl] = useState<string>('/resume_redesign.pdf');
  const [pdfName, setPdfName] = useState<string>('resume_redesign.pdf');

  // Load PDF URL from localStorage if available
  useEffect(() => {
    const storedPdfUrl = localStorage.getItem('currentPdfUrl');
    const storedPdfName = localStorage.getItem('currentPdfName');

    if (storedPdfUrl) {
      setPdfUrl(storedPdfUrl);
    }

    if (storedPdfName) {
      setPdfName(storedPdfName);
    }

    DanteLogger.success.basic('Style Test Page loaded', { pdfUrl, pdfName });
  }, []);

  // Mock handlers for SalingerHeader
  const handleDownload = () => {
    DanteLogger.success.ux('Download clicked in Style Test');
  };

  const handleViewSummary = () => {
    DanteLogger.success.ux('View Summary clicked in Style Test');
  };

  const handleContact = () => {
    DanteLogger.success.ux('Contact clicked in Style Test');
    // Fetch the user info to get the email
    fetch('/api/user-info')
      .then(response => response.json())
      .then(data => {
        if (data.success && data.userInfo && data.userInfo.email) {
          // Use the email from user_info.json
          window.location.href = `mailto:${data.userInfo.email}?subject=Style%500Test%500Contact`;
          DanteLogger.success.ux('Contact action triggered with extracted email', { email: data.userInfo.email });
        } else {
          // Fallback to a default email if user info is not available
          window.location.href = 'mailto:contact@example.com?subject=Style%500Test%500Contact';
          DanteLogger.error.runtime('Contact action triggered with fallback email (user email not found)');
        }
      })
      .catch(error => {
        console.error('Error fetching user info for contact:', error);
        // Fallback to a default email if there's an error
        window.location.href = 'mailto:contact@example.com?subject=Style%500Test%500Contact';
        DanteLogger.error.runtime('Error in contact action', { error: error.message });
      });
  };

  const handleUpload = () => {
    DanteLogger.success.ux('Upload clicked in Style Test');
  };

  return (
    <DynamicThemeProvider pdfUrl={pdfUrl}>
      <div className="min-h-screen flex flex-col TODO_REVIEW_TAILWIND" >
        <SalingerHeader
          onDownload={handleDownload}
          onViewSummary={handleViewSummary}
          onContact={handleContact}
          onUpload={handleUpload}
          fileName={pdfName}
        />

        <div className="p-8 style-test-container">
          <ScrollFix />
          <h1 className="text-3xl font-bold mb-6 TODO_REVIEW_TAILWIND" >
            PDF-Driven Styling Test
          </h1>

      <div className="mb-8">
        <h2 className="text-2xl font-bold mb-4 TODO_REVIEW_TAILWIND">
          Typography
        </h2>
        <h1 style={{
          fontFamily: 'var(--pdf-heading-font, sans-serif)',
          color: 'var(--text-color, #333333)',
          marginBottom: '0.5rem'
        }}>
          Heading 1 with PDF Font
        </h1>
        <h2 style={{
          fontFamily: 'var(--pdf-heading-font, sans-serif)',
          color: 'var(--text-color, #333333)',
          marginBottom: '0.5rem'
        }}>
          Heading 2 with PDF Font
        </h2>
        <p style={{
          fontFamily: 'var(--pdf-body-font, serif)',
          color: 'var(--text-color, #333333)',
          marginBottom: '1rem'
        }}>
          This paragraph uses the body font extracted from the PDF.
          The text should be styled according to the PDF's typography.
          All text elements in the application should use these theme variables for consistent styling.
        </p>
        <code style={{
          fontFamily: 'var(--pdf-mono-font, monospace)',
          backgroundColor: 'var(--bg-secondary, #ebebeb)',
          padding: '0.25rem 0.5rem',
          borderRadius: '0.25rem',
          color: 'var(--text-color, #333333)'
        }}>
          This code block uses the monospace font from the PDF.
        </code>
      </div>

      <div className="mb-8">
        <h2 className="text-2xl font-bold mb-4">
          Colors
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          <div className="p-4 rounded shadow-sm">
            --pdf-primary-color
          </div>
          <div className="p-4 rounded shadow-sm">
            --pdf-secondary-color
          </div>
          <div className="p-4 rounded shadow-sm">
            --pdf-accent-color
          </div>
          <div className="p-4 rounded shadow-sm">
            --pdf-background-color
          </div>
          <div className="p-4 rounded shadow-sm">
            --text-color
          </div>
          <div className="p-4 rounded shadow-sm">
            --text-secondary
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mt-4">
          <div className="p-4 rounded shadow-sm">
            --cta-primary-bg
          </div>
          <div className="p-4 rounded shadow-sm">
            --hover-bg
          </div>
          <div className="p-4 rounded shadow-sm">
            --active-bg
          </div>
        </div>
      </div>

      <div className="mb-8">
        <h2 className="text-2xl font-bold mb-4">
          UI Elements
        </h2>
        <div className="space-y-4">
          <div>
            <button
              className="mr-2 mb-2 px-4 py-2 rounded transition-all"
              style={{
                backgroundColor: 'var(--cta-primary-bg, rgba(126, 78, 45, 0.1))',
                color: 'var(--text-color, #333333)',
                fontFamily: 'var(--font-button, sans-serif)',
                border: '1px solid transparent'
              }}
            >
              Primary Button (CTA Style)
            </button>
            <button
              className="mr-2 mb-2 px-4 py-2 rounded transition-all"
              style={{
                backgroundColor: 'var(--pdf-secondary-color, #004e98)',
                color: 'var(--pdf-secondary-contrast, #ffffff)',
                fontFamily: 'var(--font-button, sans-serif)'
              }}
            >
              Secondary Button
            </button>
            <button
              className="mr-2 mb-2 px-4 py-2 rounded transition-all"
              style={{
                backgroundColor: 'var(--pdf-accent-color, #ff61000)',
                color: 'var(--pdf-accent-contrast, #000000)',
                fontFamily: 'var(--font-button, sans-serif)'
              }}
            >
              Accent Button
            </button>
          </div>

          <div>
            <input
              type="text"
              placeholder="Input with PDF styling"
              className="mr-2 mb-2 p-2 rounded"
              style={{
                border: '1px solid var(--pdf-border-color, #dddddd)',
                fontFamily: 'var(--pdf-body-font, serif)',
                color: 'var(--text-color, #333333)',
                backgroundColor: 'var(--bg-primary, #ffffff)'
              }}
            />
          </div>

          <div className="p-4 rounded" style={{
            backgroundColor: 'var(--bg-primary, #ffffff)',
            boxShadow: 'var(--pdf-card-shadow, 0 4px 6px rgba(0, 0, 0, 0.1))',
            border: '1px solid var(--border-color, #dddddd)'
          }}>
            <h3 className="font-bold mb-2">
              Card with PDF Styling
            </h3>
            <p>
              This card uses background, shadow, and border colors from the PDF.
              All components in the application should use these theme variables for consistent styling.
            </p>
          </div>
        </div>
      </div>

      <div className="mt-8">
        <Link href="/" className="hover:underline">
          Back to Home
        </Link>
      </div>

      <ClientSideVariables />
        </div>
      </div>
    </DynamicThemeProvider>
  );
}
