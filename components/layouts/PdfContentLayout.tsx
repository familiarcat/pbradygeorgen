'use client';

import React, { useEffect, useState } from 'react';
import { DanteLogger } from '@/utils/DanteLogger';
import { getAnalyzedPdfContent } from '@/app/actions/pdfContentActions';
import PdfThemeProvider from '@/components/PdfThemeProvider';

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

        if (data.valid) {
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
        DanteLogger.error.dataFlow(`Error checking content status: ${errorMessage}`);

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
        DanteLogger.error.dataFlow(`Content refresh failed: ${result.error}`);
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      setError(errorMessage);
      setContentStatus({
        isValid: false,
        message: 'Content refresh failed'
      });
      DanteLogger.error.dataFlow(`Error refreshing content: ${errorMessage}`);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="pdf-content-layout">
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

      {!isLoading && !error && contentStatus.isValid && (
        <div className="fixed top-0 left-0 w-full bg-[var(--state-success)] text-white text-center py-1 z-50 opacity-0 transition-opacity duration-1000 animate-fade-out">
          {contentStatus.message}
        </div>
      )}

      {/* Wrap children with PdfThemeProvider */}
      <PdfThemeProvider pdfUrl="/default_resume.pdf">
        {children}
      </PdfThemeProvider>
    </div>
  );
}
