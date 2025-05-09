'use client';

import React, { useEffect, useState } from 'react';
import { DanteLogger } from '@/utils/DanteLogger';
import { getAnalyzedPdfContent } from '@/app/actions/pdfContentActions';
import PdfThemeProvider from '@/components/PdfThemeProvider';
import SalingerThemeProvider from '@/components/SalingerThemeProvider';

interface PdfContentLayoutProps {
  children: React.ReactNode;
}

export default function PdfContentLayout({ children }: PdfContentLayoutProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [contentStatus, setContentStatus] = useState<{
    isValid: boolean;
    message: string;
  }>({
    isValid: false,
    message: 'Checking content status...'
  });

  // Check content status on mount
  useEffect(() => {
    const checkContentStatus = async () => {
      try {
        setIsLoading(true);

        // Add a timestamp to bust cache
        const timestamp = new Date().getTime();
        const response = await fetch(`/api/validate-content?t=${timestamp}`);

        if (!response.ok) {
          throw new Error(`API responded with status: ${response.status}`);
        }

        const data = await response.json();

        // Check if the response is successful (either data.valid or data.success)
        if (data.valid || data.success) {
          setContentStatus({
            isValid: true,
            message: 'Content is valid and ready for display'
          });
          DanteLogger.success.core('PDF content is valid');
        } else {
          setContentStatus({
            isValid: false,
            message: 'Content validation failed, refreshing...'
          });
          DanteLogger.error.dataFlow('PDF content validation failed, refreshing');

          // Refresh the content
          await refreshContent();
        }
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Unknown error';
        setError(errorMessage);
        DanteLogger.error.dataFlow(`Error checking content status: ${errorMessage}`, '');

        // Try to refresh the content
        await refreshContent();
      } finally {
        setIsLoading(false);
      }
    };

    checkContentStatus();
  }, []);

  // Refresh content
  const refreshContent = async () => {
    try {
      setIsLoading(true);
      setError(null);

      // Call the server action to get the analyzed content
      const result = await getAnalyzedPdfContent(true);

      if (result.success) {
        setContentStatus({
          isValid: true,
          message: 'Content refreshed successfully'
        });
        DanteLogger.success.core('PDF content refreshed successfully');
      } else {
        setContentStatus({
          isValid: false,
          message: 'Content refresh failed'
        });
        setError(result.error || 'Content refresh failed');
        DanteLogger.error.dataFlow(`Content refresh failed: ${result.error}`, '');
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      setError(errorMessage);
      setContentStatus({
        isValid: false,
        message: 'Content refresh failed'
      });
      DanteLogger.error.dataFlow(`Error refreshing content: ${errorMessage}`, '');
    } finally {
      setIsLoading(false);
    }
  };

  // Apply background color to the entire page
  useEffect(() => {
    // This ensures the background color is applied even before the theme providers are fully loaded
    const applyBackgroundColor = () => {
      // Get the extracted background color from the color_theme.json file
      fetch('/extracted/color_theme.json')
        .then(response => response.json())
        .then(data => {
          // Use the extracted background color or fallback to a default
          const extractedBgColor = data.background || '#f1f2f4';
          console.log('Applying extracted background color:', extractedBgColor);

          // Force the background color with !important to override any other styles
          const styleElement = document.createElement('style');
          styleElement.id = 'force-background-color';
          styleElement.textContent = `
            html, body, .pdf-content-layout, .salinger-theme {
              background-color: ${extractedBgColor} !important;
            }

            :root {
              --pdf-background-color: ${extractedBgColor} !important;
              --background-rgb: ${hexToRgb(extractedBgColor)} !important;
            }
          `;

          // Remove any existing style element
          const existingStyle = document.getElementById('force-background-color');
          if (existingStyle) {
            existingStyle.remove();
          }

          // Add the new style element
          document.head.appendChild(styleElement);

          // Also apply directly to elements
          document.documentElement.style.backgroundColor = extractedBgColor;
          document.body.style.backgroundColor = extractedBgColor;

          // Apply to container elements
          const containers = document.querySelectorAll('.pdf-content-layout, .salinger-theme');
          containers.forEach(container => {
            if (container instanceof HTMLElement) {
              container.style.backgroundColor = extractedBgColor;
            }
          });

          console.log('Background color applied successfully:', extractedBgColor);
        })
        .catch(error => {
          console.error('Error fetching color theme:', error);
          // Fallback to a default color if the fetch fails
          const defaultBgColor = '#f1f2f4';
          document.documentElement.style.backgroundColor = defaultBgColor;
          document.body.style.backgroundColor = defaultBgColor;
        });
    };

    // Helper function to convert hex to RGB
    const hexToRgb = (hex: string) => {
      // Remove # if present
      hex = hex.replace(/^#/, '');

      // Parse hex values
      const r = parseInt(hex.substring(0, 2), 16);
      const g = parseInt(hex.substring(2, 4), 16);
      const b = parseInt(hex.substring(4, 6), 16);

      return `${r}, ${g}, ${b}`;
    };

    // Apply immediately
    applyBackgroundColor();

    // Also apply on window load to ensure it persists
    window.addEventListener('load', applyBackgroundColor);

    // Apply again after a short delay to override any other styles
    setTimeout(applyBackgroundColor, 500);

    return () => {
      window.removeEventListener('load', applyBackgroundColor);
      const styleElement = document.getElementById('force-background-color');
      if (styleElement) {
        styleElement.remove();
      }
    };
  }, []);

  // State to store the extracted background color
  const [extractedBgColor, setExtractedBgColor] = useState('#f1f2f4');

  // Fetch the extracted background color
  useEffect(() => {
    fetch('/extracted/color_theme.json')
      .then(response => response.json())
      .then(data => {
        const bgColor = data.background || '#f1f2f4';
        setExtractedBgColor(bgColor);
      })
      .catch(error => {
        console.error('Error fetching color theme for inline style:', error);
      });
  }, []);

  return (
    <div
      className="pdf-content-layout flex flex-col min-h-screen w-full"
      style={{ backgroundColor: extractedBgColor }}
    >
      {isLoading && (
        <div className="fixed top-0 left-0 w-full bg-[var(--cta-primary)] text-white text-center py-1 z-50">
          Processing PDF content...
        </div>
      )}

      {error && (
        <div className="fixed top-0 left-0 w-full bg-[var(--state-error)] text-white text-center py-1 z-50">
          Error: {error}
        </div>
      )}

      {/* Success message is not displayed, but we keep the logic for Hesse and Dante logging */}
      {!isLoading && !error && contentStatus.isValid && contentStatus.message !== 'Content is valid and ready for display' && (
        <div className="fixed top-0 left-0 w-full bg-[var(--state-success)] text-white text-center py-1 z-50 opacity-0 transition-opacity duration-1000 animate-fade-out">
          {contentStatus.message}
        </div>
      )}

      {/* Wrap children with PdfThemeProvider and SalingerThemeProvider */}
      <PdfThemeProvider pdfUrl="/default_resume.pdf">
        <SalingerThemeProvider>
          <div
            className="w-full h-full"
            style={{ backgroundColor: extractedBgColor }}
          >
            {children}
          </div>
        </SalingerThemeProvider>
      </PdfThemeProvider>
    </div>
  );
}
