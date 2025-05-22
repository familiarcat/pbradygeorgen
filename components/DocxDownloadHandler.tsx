/**
 * DocxDownloadHandler Component
 *
 * A universal component for handling DOCX downloads and previews that can be used
 * in both the Introduction and Resume sections.
 *
 * This component follows:
 * - Derrida philosophy by deconstructing hardcoded download implementations
 * - Müller-Brockmann philosophy with clean, grid-based structure
 * - Hesse philosophy by ensuring mathematical harmony in implementation patterns
 * - Dante philosophy with methodical logging
 * - Kantian ethics by maintaining professional business orientation
 */

import React, { useState } from 'react';
import { DanteLogger } from '@/utils/DanteLogger';
import { HesseLogger } from '@/utils/HesseLogger';
import DocxService, { DocxDownloadOptions } from '@/utils/DocxService';
import DirectDocxDownloader from '@/utils/DirectDocxDownloader';
import { extractPdfStyleVariables } from '@/utils/CssVariableExtractor';

interface DocxDownloadHandlerProps {
  // Content and file information
  content: string;
  fileName: string;
  documentType: 'resume' | 'introduction';

  // UI customization
  className?: string;
  iconClassName?: string;
  buttonText?: string;
  loadingText?: string;

  // Callbacks
  onPreview?: () => void;
  onDownloadStart?: () => void;
  onDownloadComplete?: () => void;
  onError?: (error: Error) => void;

  // Styling options
  options?: DocxDownloadOptions;

  // Component type
  isPreviewButton?: boolean;

  // PDF-extracted styles
  usePdfStyles?: boolean;
}

const DocxDownloadHandler: React.FC<DocxDownloadHandlerProps> = ({
  // Content and file information
  content,
  fileName,
  documentType,

  // UI customization
  className = '',
  iconClassName = '',
  buttonText = 'Word Format',
  loadingText = 'Downloading...',

  // Callbacks
  onPreview,
  onDownloadStart,
  onDownloadComplete,
  onError,

  // Styling options
  options = {},

  // Component type
  isPreviewButton = false,

  // PDF-extracted styles
  usePdfStyles = true
}) => {
  const [isLoading, setIsLoading] = useState(false);

  /**
   * Handle the download process
   */
  const handleDownload = async () => {
    try {
      setIsLoading(true);

      // Notify that download has started
      if (onDownloadStart) {
        onDownloadStart();
      }

      HesseLogger.summary.start(`Exporting ${fileName} as DOCX`);
      DanteLogger.success.basic(`Starting DOCX download for ${fileName}`);

      // Check if this is an introduction document
      if (documentType === 'introduction') {
        try {
          // Use the dedicated API endpoint for downloading the Introduction DOCX file
          DanteLogger.success.basic('Using dedicated API endpoint for Introduction DOCX download');

          // Track if download has started
          let downloadStarted = false;

          // Try the direct download approach first (works in most modern browsers)
          try {
            DanteLogger.success.basic('Trying direct link download first');
            // Create a direct download link
            const link = document.createElement('a');
            link.href = `/api/download-introduction-docx?t=${new Date().getTime()}`;
            link.download = `${fileName}.docx`;
            link.setAttribute('type', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document');
            document.body.appendChild(link);
            link.click();

            // Clean up
            setTimeout(() => {
              document.body.removeChild(link);
            }, 100);

            downloadStarted = true;

            // Notify that download is complete after a short delay
            setTimeout(() => {
              DanteLogger.success.ux(`Downloaded ${fileName}.docx successfully via direct link`);
              HesseLogger.summary.complete(`${fileName}.docx downloaded successfully`);

              // Notify that download is complete
              if (onDownloadComplete) {
                onDownloadComplete();
              }
            }, 1000);
          } catch (directError) {
            console.error('Direct download failed:', directError);
            // Continue to iframe method
          }

          // If direct download failed, try the iframe approach
          if (!downloadStarted) {
            DanteLogger.success.basic('Falling back to iframe download method');
            // Create an iframe to handle the download (works in all browsers)
            const iframe = document.createElement('iframe');
            iframe.style.display = 'none';
            document.body.appendChild(iframe);

            // Set up a load event to track when the iframe has loaded
            iframe.onload = () => {
              // After loading, remove the iframe after a short delay
              setTimeout(() => {
                document.body.removeChild(iframe);
                DanteLogger.success.ux(`Downloaded ${fileName}.docx successfully via iframe`);
                HesseLogger.summary.complete(`${fileName}.docx downloaded successfully`);

                // Notify that download is complete
                if (onDownloadComplete) {
                  onDownloadComplete();
                }
              }, 1000);
            };

            // Set the iframe source to the dedicated API endpoint
            iframe.src = `/api/download-introduction-docx?t=${new Date().getTime()}`;
          }

          return; // Exit early if we're using the dedicated endpoint
        } catch (dedicatedError) {
          DanteLogger.error.runtime(`Error using dedicated endpoint: ${dedicatedError}`);
          // Continue to fallback methods
        }
      }

      // For resume or if the dedicated endpoint failed, use the direct DOCX downloader
      try {
        // Use the direct DOCX downloader for reliable downloads
        await DirectDocxDownloader.generateAndDownloadDocx(content, fileName);

        // Notify that download is complete
        if (onDownloadComplete) {
          onDownloadComplete();
        }

        DanteLogger.success.ux(`Downloaded ${fileName}.docx successfully`);
        HesseLogger.summary.complete(`${fileName}.docx downloaded successfully`);
        return; // Exit early if direct download succeeded
      } catch (directError) {
        DanteLogger.error.runtime(`Error using DirectDocxDownloader: ${directError}`);
        // Continue to fallback methods
      }

      // Try the fallback method if direct download fails
      try {
        DanteLogger.success.basic(`Trying fallback download method for ${fileName}`);

        // Apply PDF-extracted styles if enabled
        let docxOptions = { ...options };

        if (usePdfStyles) {
          // Extract PDF style variables with enhanced fallback mechanisms
          HesseLogger.summary.start('Extracting PDF style variables for DOCX generation');
          DanteLogger.success.basic('Extracting PDF style variables for DOCX generation');

          const extractedStyles = extractPdfStyleVariables({
            verbose: true,
            useDanteLogger: true
          });

          // Log the extracted styles with Dante logger
          DanteLogger.success.ux('PDF style variables extracted successfully');

          // Log detailed information about the extracted styles
          console.log(`[DocxDownloadHandler] Using PDF-extracted styles:`, extractedStyles);

          // Apply the styles to the options
          docxOptions = {
            ...docxOptions,
            headingFont: extractedStyles.headingFont,
            bodyFont: extractedStyles.bodyFont,
            primaryColor: extractedStyles.primaryColor,
            secondaryColor: extractedStyles.secondaryColor,
            textColor: extractedStyles.textColor,
            accentColor: extractedStyles.accentColor,
            backgroundColor: extractedStyles.backgroundColor,
            borderColor: extractedStyles.borderColor
          };

          HesseLogger.summary.complete('PDF style variables extracted and applied to DOCX options');
        }

        // Use the DocxService as fallback
        await DocxService.downloadDocx(content, fileName, docxOptions);

        // Notify that download is complete
        if (onDownloadComplete) {
          onDownloadComplete();
        }

        DanteLogger.success.ux(`Downloaded ${fileName}.docx successfully via fallback`);
      } catch (fallbackError) {
        DanteLogger.error.runtime(`Fallback download also failed: ${fallbackError}`);

        // Notify of error
        if (onError && fallbackError instanceof Error) {
          onError(fallbackError);
        } else if (onError) {
          onError(new Error(String(fallbackError)));
        }

        // Show alert as fallback if no error handler provided
        if (!onError) {
          alert('There was an error generating the Word document. Please try again.');
        }
      }
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * Handle the preview action
   */
  const handlePreview = () => {
    if (onPreview) {
      onPreview();
    } else {
      DanteLogger.error.runtime('No preview handler provided');
      alert('Preview functionality not available.');
    }
  };

  // Determine which action to take based on component type
  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();

    if (isPreviewButton) {
      handlePreview();
    } else {
      handleDownload();
    }
  };

  return (
    <a
      href="#"
      onClick={handleClick}
      className={className}
      aria-label={isPreviewButton ? 'Preview Word Document' : 'Download Word Document'}
    >
      {isLoading ? (
        <span className="loadingText">
          <svg className="loadingSpinner h-4 w-4 mr-2" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          {loadingText}
        </span>
      ) : (
        <>
          <svg xmlns="http://www.w3.org/2000/svg" className={iconClassName} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            {isPreviewButton ? (
              // Eye icon for preview
              <>
                <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
                <circle cx="12" cy="12" r="3"></circle>
              </>
            ) : (
              // Download icon for download
              <>
                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                <polyline points="7 10 12 15 17 10"></polyline>
                <line x1="12" y1="15" x2="12" y2="3"></line>
              </>
            )}
          </svg>
          {buttonText}
        </>
      )}
    </a>
  );
};

export default DocxDownloadHandler;
