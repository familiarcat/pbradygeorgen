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

      // Apply PDF-extracted styles if enabled
      let docxOptions = { ...options };

      if (usePdfStyles) {
        // Get CSS variables from the document
        const computedStyle = getComputedStyle(document.documentElement);

        // Get font variables
        const headingFont = computedStyle.getPropertyValue('--dynamic-heading-font').trim() ||
                           computedStyle.getPropertyValue('--font-heading').trim() ||
                           'sans-serif';

        const bodyFont = computedStyle.getPropertyValue('--dynamic-primary-font').trim() ||
                        computedStyle.getPropertyValue('--font-body').trim() ||
                        'serif';

        // Get color variables
        const primaryColor = computedStyle.getPropertyValue('--dynamic-primary').trim() ||
                            computedStyle.getPropertyValue('--primary-color').trim() ||
                            '#00A99D';

        const secondaryColor = computedStyle.getPropertyValue('--dynamic-secondary').trim() ||
                              computedStyle.getPropertyValue('--secondary-color').trim() ||
                              '#333333';

        const textColor = computedStyle.getPropertyValue('--dynamic-text').trim() ||
                         computedStyle.getPropertyValue('--text-color').trim() ||
                         '#333333';

        // Log the extracted styles
        console.log(`[DocxDownloadHandler] Using PDF-extracted styles:`, {
          headingFont,
          bodyFont,
          primaryColor,
          secondaryColor,
          textColor
        });

        // Apply the styles to the options
        docxOptions = {
          ...docxOptions,
          headingFont,
          bodyFont,
          primaryColor,
          secondaryColor,
          textColor
        };
      }

      // Use the enhanced DocxService to handle the download
      await DocxService.downloadDocx(content, fileName, docxOptions);

      // Notify that download is complete
      if (onDownloadComplete) {
        onDownloadComplete();
      }

      DanteLogger.success.ux(`Downloaded ${fileName}.docx successfully`);
    } catch (error) {
      DanteLogger.error.runtime(`Error downloading DOCX: ${error}`);

      // Notify of error
      if (onError && error instanceof Error) {
        onError(error);
      } else if (onError) {
        onError(new Error(String(error)));
      }

      // Show alert as fallback if no error handler provided
      if (!onError) {
        alert('There was an error generating the Word document. Please try again.');
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
