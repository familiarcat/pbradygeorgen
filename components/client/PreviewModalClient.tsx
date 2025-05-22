'use client';

/**
 * Preview Modal Client Component
 *
 * A specialized modal for previewing content in different formats.
 * This component extends the base Modal component and adds preview-specific functionality.
 *
 * Following philosophies:
 * - Salinger: Intuitive UX with consistent preview behavior
 * - Hesse: Mathematical harmony in preview layout
 * - Derrida: Deconstruction through format-specific rendering
 * - Dante: Methodical logging of preview events
 */

import React, { useRef, useState } from 'react';
import Modal from '@/components/shared/Modal';
import StyledMarkdown from '@/components/StyledMarkdown';
import { DanteLogger } from '@/utils/DanteLogger';
import { HesseLogger } from '@/utils/HesseLogger';
import { usePdfThemeContext } from '@/components/DynamicThemeProvider';
import styles from '@/styles/SharedModal.module.css';
import docxStyles from '@/styles/DocxPreview.module.css';

// Define the supported preview formats
export type PreviewFormat = 'markdown' | 'pdf' | 'text' | 'docx';

export interface PreviewModalProps {
  /** Whether the modal is open */
  isOpen: boolean;
  /** Function to call when the modal should close */
  onClose: () => void;
  /** The content to preview */
  content: string;
  /** The format of the content */
  format: PreviewFormat;
  /** The title of the preview */
  title: string;
  /** The file name for downloads */
  fileName: string;
  /** Optional PDF data URL for PDF previews */
  pdfDataUrl?: string;
  /** Optional DOCX URL for DOCX previews */
  docxUrl?: string;
  /** Optional callback for downloading the content */
  onDownload?: () => Promise<void>;
  /** Optional callback for downloading with a data URL */
  onDownloadWithDataUrl?: (dataUrl: string) => Promise<void>;
  /** Optional position of the modal */
  position?: 'left' | 'right' | 'center';
}

/**
 * Preview Modal Client Component
 *
 * A specialized modal for previewing content in different formats.
 */
const PreviewModalClient: React.FC<PreviewModalProps> = ({
  isOpen,
  onClose,
  content,
  format,
  title,
  fileName,
  pdfDataUrl,
  docxUrl,
  onDownload,
  onDownloadWithDataUrl,
  position = 'center',
}) => {
  // State for tracking download status
  const [isDownloading, setIsDownloading] = useState(false);

  // Refs for content elements
  const textRef = useRef<HTMLPreElement>(null);

  // Access the PDF theme context to use extracted styles
  const themeContext = usePdfThemeContext();

  // Handle download button click
  const handleDownload = async () => {
    try {
      setIsDownloading(true);
      DanteLogger.success.basic(`Starting download for ${fileName}.${format}`);
      HesseLogger.summary.start(`Downloading ${fileName}.${format}`);

      let downloadStarted = false;

      // Handle download based on format
      if (format === 'pdf' && pdfDataUrl) {
        console.log('DOWNLOAD STRATEGY: Using PDF data URL');

        try {
          // Create a link element
          const link = document.createElement('a');
          link.href = pdfDataUrl;
          link.download = `${fileName}.pdf`;
          link.setAttribute('type', 'application/pdf');

          // Append to body, click, and remove
          document.body.appendChild(link);
          link.click();

          // Small delay before removing the element
          setTimeout(() => {
            document.body.removeChild(link);
          }, 100);

          downloadStarted = true;
          console.log('PDF download completed via data URL');
        } catch (pdfError) {
          console.error(`PDF download failed:`, pdfError);

          // Try the handler if available
          if (onDownloadWithDataUrl) {
            console.log('Falling back to data URL handler');
            try {
              await onDownloadWithDataUrl(pdfDataUrl);
              downloadStarted = true;
              console.log('Data URL handler download completed');
            } catch (handlerError) {
              console.error(`Data URL handler download failed:`, handlerError);
              throw handlerError;
            }
          } else {
            throw pdfError;
          }
        }
      }
      // For DOCX format
      else if (format === 'docx') {
        console.log('DOWNLOAD STRATEGY: Using DOCX-specific handler');

        // Check if this is an introduction document
        if (fileName.includes('introduction')) {
          try {
            console.log('Using dedicated API endpoint for Introduction DOCX download');

            // Try the direct download approach first (works in most modern browsers)
            try {
              console.log('Trying direct link download first');
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
              console.log(`Downloaded ${fileName}.docx successfully via direct link`);
            } catch (directError) {
              console.error('Direct download failed:', directError);
              // Continue to iframe method if direct download failed
            }

            // If direct download failed, try the iframe approach
            if (!downloadStarted) {
              console.log('Falling back to iframe download method');
              // Create an iframe to handle the download (works in all browsers)
              const iframe = document.createElement('iframe');
              iframe.style.display = 'none';
              document.body.appendChild(iframe);

              // Set up a load event to track when the iframe has loaded
              iframe.onload = () => {
                // After loading, remove the iframe after a short delay
                setTimeout(() => {
                  document.body.removeChild(iframe);
                  console.log(`Downloaded ${fileName}.docx successfully via iframe`);
                  downloadStarted = true;
                }, 1000);
              };

              // Set the iframe source to the dedicated API endpoint
              iframe.src = `/api/download-introduction-docx?t=${new Date().getTime()}`;
            }
          } catch (dedicatedError) {
            console.error(`Dedicated endpoint download failed:`, dedicatedError);

            // Continue to fallback methods
            try {
              console.log(`Calling handler for DOCX format with fileName: ${fileName}`);

              // Import the DirectDocxDownloader dynamically
              const DirectDocxDownloaderModule = await import('@/utils/DirectDocxDownloader');
              const DirectDocxDownloader = DirectDocxDownloaderModule.default;

              // Use the direct downloader with the content and fileName
              await DirectDocxDownloader.generateAndDownloadDocx(content, fileName);

              downloadStarted = true;
              console.log('DOCX download completed via DirectDocxDownloader');
            } catch (docxError) {
              console.error(`DOCX download failed:`, docxError);

              // Fallback to the standard handler if available
              if (onDownload) {
                try {
                  console.log('Falling back to standard download handler for DOCX');
                  await onDownload();
                  downloadStarted = true;
                  console.log('Fallback DOCX download completed');
                } catch (fallbackError) {
                  console.error(`Fallback DOCX download failed:`, fallbackError);
                  throw fallbackError;
                }
              } else {
                throw docxError;
              }
            }
          }
        } else {
          // For non-introduction documents, use the standard approach
          try {
            console.log(`Calling handler for DOCX format with fileName: ${fileName}`);

            // Import the DirectDocxDownloader dynamically
            const DirectDocxDownloaderModule = await import('@/utils/DirectDocxDownloader');
            const DirectDocxDownloader = DirectDocxDownloaderModule.default;

            // Use the direct downloader with the content and fileName
            await DirectDocxDownloader.generateAndDownloadDocx(content, fileName);

            downloadStarted = true;
            console.log('DOCX download completed via DirectDocxDownloader');
          } catch (docxError) {
            console.error(`DOCX download failed:`, docxError);

            // Fallback to the standard handler if available
            if (onDownload) {
              try {
                console.log('Falling back to standard download handler for DOCX');
                await onDownload();
                downloadStarted = true;
                console.log('Fallback DOCX download completed');
              } catch (fallbackError) {
                console.error(`Fallback DOCX download failed:`, fallbackError);
                throw fallbackError;
              }
            } else {
              throw docxError;
            }
          }
        }
      }
      // For all other formats (markdown, text)
      else {
        console.log('DOWNLOAD STRATEGY: Using format-specific handler');

        if (onDownload) {
          try {
            console.log(`Calling handler for ${format} format`);
            await onDownload();
            downloadStarted = true;
            console.log('Format handler download completed');
          } catch (handlerError) {
            console.error(`${format} handler download failed:`, handlerError);
            throw handlerError; // Re-throw to be caught by outer try/catch
          }
        } else {
          console.error(`No download handler available for ${format} format`);
          throw new Error(`No download handler available for ${format} format`);
        }
      }

      // If no download was started, throw an error
      if (!downloadStarted) {
        throw new Error(`No download method succeeded for ${fileName}.${format}`);
      }

      DanteLogger.success.ux(`Downloaded ${fileName}.${format} successfully`);
      HesseLogger.summary.complete(`Downloaded ${fileName}.${format} successfully`);
    } catch (error) {
      DanteLogger.error.runtime(`Error downloading ${fileName}.${format}: ${error}`);
      HesseLogger.summary.error(`Download failed: ${error}`);
      alert(`Failed to download ${fileName}.${format}. Please try again.`);
    } finally {
      setIsDownloading(false);
    }
  };

  // Render the appropriate preview content based on format
  const renderPreviewContent = () => {
    switch (format) {
      case 'markdown':
        return <StyledMarkdown>{content}</StyledMarkdown>;

      case 'pdf':
        // First try to use pdfDataUrl if available
        if (pdfDataUrl) {
          return (
            <div className={docxStyles.pdfPreview}>
              <iframe
                src={pdfDataUrl}
                className={docxStyles.pdfFrame}
                title={`${title} PDF Preview`}
              />
            </div>
          );
        }

        // Then try to use pdfSource if available
        if (pdfSource) {
          return (
            <div className={docxStyles.pdfPreview}>
              <iframe
                src={pdfSource}
                className={docxStyles.pdfFrame}
                title={`${title} PDF Preview`}
              />
            </div>
          );
        }

        // If neither is available, show a message
        return <div className={styles.noPreviewMessage}>PDF preview not available</div>;

      case 'text':
        return (
          <pre
            ref={textRef}
            className={docxStyles.textPreview}
          >
            {content}
          </pre>
        );

      case 'docx':
        return (
          <div className={docxStyles.docxPreview}>
            <div className={docxStyles.docxHeader}>
              <svg className={docxStyles.docxIcon} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                <polyline points="14 2 14 8 20 8"></polyline>
                <line x1="16" y1="13" x2="8" y2="13"></line>
                <line x1="16" y1="17" x2="8" y2="17"></line>
                <polyline points="10 9 9 9 8 9"></polyline>
              </svg>
              <h3 className={docxStyles.docxTitle}>{title}</h3>
            </div>
            <div className={docxStyles.docxContent}>
              <StyledMarkdown>{content}</StyledMarkdown>
            </div>
          </div>
        );

      default:
        return <div>Preview not available for this format</div>;
    }
  };

  // Create the footer with download and cancel buttons
  const renderFooter = () => (
    <>
      <button
        type="button"
        className={styles.downloadButton}
        onClick={handleDownload}
        disabled={isDownloading}
        aria-label={`Download ${fileName}.${format}`}
        data-testid="preview-download-button"
      >
        {isDownloading ? 'Downloading...' : 'Download'}
        {!isDownloading && (
          <svg className={styles.downloadIcon} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
            <polyline points="7 10 12 15 17 10"></polyline>
            <line x1="12" y1="15" x2="12" y2="3"></line>
          </svg>
        )}
      </button>
      <button
        type="button"
        className={styles.cancelButton}
        onClick={onClose}
        aria-label="Close preview"
        data-testid="preview-cancel-button"
      >
        Close
      </button>
    </>
  );

  // Render the modal
  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={`${title} Preview`}
      footer={renderFooter()}
      position={position}
      id="preview-modal"
      ariaLabel={`Preview of ${title}`}
      ariaDescribedby="preview-content"
    >
      <div id="preview-content">
        {renderPreviewContent()}
      </div>
    </Modal>
  );
};

export default PreviewModalClient;
