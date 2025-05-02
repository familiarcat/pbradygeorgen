'use client';

import React, { useEffect, useRef, useState } from 'react';
import styles from '@/styles/SummaryModal.module.css';
import { DanteLogger } from '@/utils/DanteLogger';
import { HesseLogger } from '@/utils/HesseLogger';
import ReactMarkdown from 'react-markdown';
import PdfGenerator from '@/utils/PdfGenerator';
import PreviewModal from './PreviewModal';

interface SummaryModalProps {
  isOpen: boolean;
  onClose: () => void;
  content: string;
  position?: 'left' | 'right' | 'center';
  isLoading?: boolean;

  // Cover Letter download handlers
  onPdfPreview?: () => void;
  onPdfDownload?: () => void;
  onMarkdownPreview?: () => void;
  onMarkdownDownload?: () => void;
  onTextPreview?: () => void;
  onTextDownload?: () => void;
}

const SummaryModal: React.FC<SummaryModalProps> = ({
  isOpen,
  onClose,
  content,
  position = 'left',
  isLoading = false,

  // Cover Letter download handlers
  onPdfPreview,
  onPdfDownload,
  onMarkdownPreview,
  onMarkdownDownload,
  onTextPreview,
  onTextDownload
}) => {
  const modalRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);

  // States for download operations
  const [isGeneratingPdf, setIsGeneratingPdf] = useState(false);
  const [isGeneratingMd, setIsGeneratingMd] = useState(false);
  const [isGeneratingTxt, setIsGeneratingTxt] = useState(false);

  // States for loading and content
  const [isLoadingContent, setIsLoadingContent] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [localContent, setLocalContent] = useState(content);

  // States for preview modals
  // Track which preview is active to prevent multiple previews from showing simultaneously
  const [activePreview, setActivePreview] = useState<'pdf' | 'markdown' | 'text' | null>(null);
  const [previewContent, setPreviewContent] = useState('');
  const [pdfDataUrl, setPdfDataUrl] = useState<string | null>(null);

  // Computed states for previews based on activePreview
  const showPdfPreview = activePreview === 'pdf';
  const showMdPreview = activePreview === 'markdown';
  const showTxtPreview = activePreview === 'text';

  // State for dropdown
  const [showDownloadOptions, setShowDownloadOptions] = useState(false);

  // Function to handle PDF export
  const handleExportToPdf = async (): Promise<void> => {
    return new Promise(async (resolve, reject) => {
      try {
        setIsGeneratingPdf(true);
        HesseLogger.summary.start('Exporting summary as PDF with dark theme');
        console.log('Starting PDF export for Cover Letter');

        // Validate content before attempting to generate PDF
        if (!localContent || localContent.trim() === '') {
          const errorMsg = 'Cannot export PDF: Content is empty';
          console.error(errorMsg);
          DanteLogger.error.runtime(errorMsg);
          alert('Cannot export PDF: The content is empty. Please try refreshing the content.');
          reject(new Error(errorMsg));
          return;
        }

        // Define consistent options for both preview and download
        const pdfOptions = {
          title: 'P. Brady Georgen - Cover Letter',
          fileName: 'pbradygeorgen_cover_letter.pdf',
          headerText: 'P. Brady Georgen - Cover Letter',
          footerText: 'Generated with Salinger Design',
          pageSize: 'letter' as const, // Explicitly type as literal 'letter'
          margins: { top: 8, right: 8, bottom: 8, left: 8 }
        };

        console.log('Exporting PDF with content length:', localContent.length);

        try {
          // If we have a cached PDF data URL from the preview, use it for consistency
          if (pdfDataUrl) {
            DanteLogger.success.basic('Using cached PDF data URL for download');
            console.log('Using cached PDF data URL for download');

            // Create a link to download the PDF from the data URL
            const link = document.createElement('a');
            link.href = pdfDataUrl;
            link.download = 'pbradygeorgen_cover_letter.pdf';
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
          } else {
            // Generate a new PDF if we don't have a cached data URL
            DanteLogger.success.basic('Generating new PDF data URL for download');
            console.log('Generating new PDF data URL for download');

            // First generate a data URL to ensure consistency with preview
            const dataUrl = await PdfGenerator.generatePdfDataUrlFromMarkdown(localContent, pdfOptions);

            if (!dataUrl) {
              throw new Error('Failed to generate PDF data URL');
            }

            // Then download using the data URL
            const link = document.createElement('a');
            link.href = dataUrl;
            link.download = 'pbradygeorgen_cover_letter.pdf';
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
          }
        } catch (pdfError) {
          console.error('Error generating or downloading PDF:', pdfError);
          DanteLogger.error.runtime(`Error generating or downloading PDF: ${pdfError}`);

          // Fallback to text download if PDF generation fails
          console.log('Falling back to text download');
          DanteLogger.warn.deprecated('Falling back to text download due to PDF generation failure');

          const plainText = localContent
            .replace(/#{1,6}\s+/g, '') // Remove headers
            .replace(/\*\*/g, '') // Remove bold
            .replace(/\*/g, '') // Remove italic
            .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1') // Replace links with just the text
            .replace(/!\[([^\]]+)\]\([^)]+\)/g, '$1') // Replace images with alt text
            .replace(/`{1,3}[^`]*`{1,3}/g, '') // Remove code blocks
            .replace(/>/g, '') // Remove blockquotes
            .replace(/\n\s*\n/g, '\n\n'); // Normalize line breaks

          const blob = new Blob([plainText], { type: 'text/plain' });
          const url = URL.createObjectURL(blob);
          const a = document.createElement('a');
          a.href = url;
          a.download = 'pbradygeorgen_cover_letter.txt';
          document.body.appendChild(a);
          a.click();
          document.body.removeChild(a);
          URL.revokeObjectURL(url);

          alert('Could not generate PDF. A text version has been downloaded instead.');
        }

        DanteLogger.success.ux('Exported cover letter as PDF using Salinger dark theme');
        HesseLogger.summary.complete('Cover letter exported as PDF with dark theme styling');
        resolve();
      } catch (error) {
        console.error('Error exporting to PDF:', error);
        DanteLogger.error.runtime(`Error exporting to PDF: ${error}`);
        HesseLogger.summary.error(`PDF export failed: ${error}`);
        alert(`There was an error generating the PDF: ${error instanceof Error ? error.message : 'Unknown error'}. Please try refreshing the content.`);
        reject(error);
      } finally {
        setIsGeneratingPdf(false);
      }
    });
  };

  // Function to handle PDF preview
  const handlePdfPreview = async () => {
    try {
      HesseLogger.summary.start('Generating PDF preview with dark theme');
      console.log('Starting PDF preview generation for Cover Letter');

      // Validate content before attempting to generate PDF
      if (!localContent || localContent.trim() === '') {
        const errorMsg = 'Cannot generate PDF preview: Content is empty';
        console.error(errorMsg);
        DanteLogger.error.runtime(errorMsg);
        alert('Cannot generate PDF preview: The content is empty. Please try refreshing the content.');
        return;
      }

      // Define consistent options for both preview and download - same as in export function
      const pdfOptions = {
        title: 'P. Brady Georgen - Cover Letter',
        fileName: 'pbradygeorgen_cover_letter.pdf',
        headerText: 'P. Brady Georgen - Cover Letter',
        footerText: 'Generated with Salinger Design',
        pageSize: 'letter' as const, // Explicitly type as literal 'letter'
        margins: { top: 8, right: 8, bottom: 8, left: 8 }
      };

      console.log('Generating PDF preview with content length:', localContent.length);

      // Generate a real-time PDF preview optimized for a single page
      const dataUrl = await PdfGenerator.generatePdfDataUrlFromMarkdown(localContent, pdfOptions);

      if (!dataUrl) {
        throw new Error('Failed to generate PDF data URL');
      }

      console.log('PDF data URL generated:', dataUrl ? `${dataUrl.substring(0, 50)}...` : 'null');

      // Store the data URL for the preview
      setPdfDataUrl(dataUrl);
      console.log('PDF data URL stored in state');

      // Show the preview modal
      setActivePreview('pdf');
      console.log('Active preview set to PDF');

      DanteLogger.success.ux('Opened PDF preview with Salinger dark theme');
      HesseLogger.summary.complete('PDF preview generated with dark theme styling');
    } catch (error) {
      console.error('Error in PDF preview generation:', error);
      DanteLogger.error.runtime(`Error showing PDF preview: ${error}`);
      HesseLogger.summary.error(`PDF preview failed: ${error}`);
      alert(`There was an error generating the PDF preview: ${error instanceof Error ? error.message : 'Unknown error'}. Please try refreshing the content.`);
    }
  };

  // Function to handle downloading from a PDF data URL
  // This function is kept for future use but currently not called directly
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const handleDownloadFromDataUrl = (dataUrl: string): Promise<void> => {
    return new Promise((resolve, reject) => {
      try {
        DanteLogger.success.basic('Downloading PDF from data URL');

        // Create a link to download the PDF from the data URL
        const link = document.createElement('a');
        link.href = dataUrl;
        link.download = 'pbradygeorgen_cover_letter.pdf';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);

        DanteLogger.success.ux('Downloaded PDF from preview data URL');
        resolve();
      } catch (error) {
        DanteLogger.error.runtime(`Error downloading PDF from data URL: ${error}`);
        alert('There was an error downloading the PDF. Please try again.');
        reject(error);
      }
    });
  };

  // Function to handle Markdown export
  const handleExportToMarkdown = async (): Promise<void> => {
    return new Promise(async (resolve, reject) => {
      try {
        setIsGeneratingMd(true);
        HesseLogger.summary.start('Exporting summary as Markdown');
        console.log('Starting Markdown export for Cover Letter');

        // Validate content before attempting to export
        if (!localContent || localContent.trim() === '') {
          const errorMsg = 'Cannot export Markdown: Content is empty';
          console.error(errorMsg);
          DanteLogger.error.runtime(errorMsg);
          alert('Cannot export Markdown: The content is empty. Please try refreshing the content.');
          reject(new Error(errorMsg));
          return;
        }

        console.log('Exporting Markdown with content length:', localContent.length);

        // Create and download the file
        const blob = new Blob([localContent], { type: 'text/markdown' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'pbradygeorgen_cover_letter.md';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);

        DanteLogger.success.ux('Exported summary as Markdown');
        HesseLogger.summary.complete('Summary exported as Markdown');
        console.log('Markdown export completed successfully');
        resolve();
      } catch (error) {
        console.error('Error exporting to Markdown:', error);
        DanteLogger.error.runtime(`Error exporting to Markdown: ${error}`);
        HesseLogger.summary.error(`Error exporting to Markdown: ${error}`);
        alert(`There was an error generating the Markdown file: ${error instanceof Error ? error.message : 'Unknown error'}. Please try refreshing the content.`);
        reject(error);
      } finally {
        setIsGeneratingMd(false);
      }
    });
  };

  // Function to handle Markdown preview
  const handleMarkdownPreview = async () => {
    try {
      HesseLogger.summary.start('Opening Markdown preview');
      setPreviewContent(localContent);
      setActivePreview('markdown');
      DanteLogger.success.ux('Opened Markdown preview with Salinger design');
    } catch (error) {
      DanteLogger.error.runtime(`Error showing Markdown preview: ${error}`);
      HesseLogger.summary.error(`Markdown preview failed: ${error}`);
      alert('There was an error generating the Markdown preview. Please try again.');
    }
  };

  // Function to handle Text export
  const handleExportToText = async (): Promise<void> => {
    return new Promise(async (resolve, reject) => {
      try {
        setIsGeneratingTxt(true);
        HesseLogger.summary.start('Exporting summary as Text');

        // Convert markdown to plain text by removing markdown syntax
        const plainText = localContent
          .replace(/#{1,6}\s+/g, '') // Remove headers
          .replace(/\*\*/g, '') // Remove bold
          .replace(/\*/g, '') // Remove italic
          .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1') // Replace links with just the text
          .replace(/!\[([^\]]+)\]\([^)]+\)/g, '$1') // Replace images with alt text
          .replace(/`{1,3}[^`]*`{1,3}/g, '') // Remove code blocks
          .replace(/>/g, '') // Remove blockquotes
          .replace(/\n\s*\n/g, '\n\n'); // Normalize line breaks

        // Create and download the file
        const blob = new Blob([plainText], { type: 'text/plain' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'pbradygeorgen_cover_letter.txt';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);

        DanteLogger.success.ux('Exported summary as Text');
        HesseLogger.summary.complete('Summary exported as Text');
        resolve();
      } catch (error) {
        DanteLogger.error.runtime(`Error exporting to Text: ${error}`);
        HesseLogger.summary.error(`Error exporting to Text: ${error}`);
        alert('There was an error generating the Text file. Please try again.');
        reject(error);
      } finally {
        setIsGeneratingTxt(false);
      }
    });
  };

  // Function to handle Text preview
  const handleTextPreview = async () => {
    try {
      HesseLogger.summary.start('Opening Text preview');

      // Convert markdown to plain text
      const plainText = localContent
        .replace(/#{1,6}\s+/g, '') // Remove headers
        .replace(/\*\*/g, '') // Remove bold
        .replace(/\*/g, '') // Remove italic
        .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1') // Replace links with just the text
        .replace(/!\[([^\]]+)\]\([^)]+\)/g, '$1') // Replace images with alt text
        .replace(/`{1,3}[^`]*`{1,3}/g, '') // Remove code blocks
        .replace(/>/g, '') // Remove blockquotes
        .replace(/\n\s*\n/g, '\n\n'); // Normalize line breaks

      setPreviewContent(plainText);
      setActivePreview('text');
      DanteLogger.success.ux('Opened Text preview with Salinger design');
    } catch (error) {
      DanteLogger.error.runtime(`Error showing Text preview: ${error}`);
      HesseLogger.summary.error(`Text preview failed: ${error}`);
      alert('There was an error generating the Text preview. Please try again.');
    }
  };

  // Handle click outside to close modal or dropdown
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      // Close the modal if clicking outside
      if (modalRef.current && !modalRef.current.contains(event.target as Node)) {
        onClose();
      }

      // Close the dropdown if clicking outside the dropdown container
      if (showDownloadOptions) {
        const dropdownContainer = document.querySelector(`.${styles.downloadContainer}`);
        if (dropdownContainer && !dropdownContainer.contains(event.target as Node)) {
          setShowDownloadOptions(false);
        }
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen, onClose, showDownloadOptions]);

  // Reset state when modal is closed
  useEffect(() => {
    if (!isOpen) {
      // Reset preview states when modal is closed
      setActivePreview(null);
      setPdfDataUrl(null);
      console.log('Modal closed, reset preview states');
    }
  }, [isOpen]);

  // Content freshness checking removed as it's now handled server-side

  // Function to fetch the Cover Letter content
  const fetchCoverLetter = async (forceRefresh = false) => {
    try {
      setIsLoadingContent(true);
      setError(null);

      // Clear PDF data URL when fetching new content
      setPdfDataUrl(null);

      console.log(`Fetching Cover Letter content (forceRefresh: ${forceRefresh})`);

      // Call the API to get the Cover Letter content with cache-busting
      const response = await fetch(`/api/cover-letter?forceRefresh=${forceRefresh}&t=${Date.now()}`);

      if (!response.ok) {
        let errorText = '';
        try {
          errorText = await response.text();
          console.error('API error response:', errorText);
        } catch (textError) {
          console.error('Could not read error response text:', textError);
        }
        throw new Error(`API responded with status: ${response.status}${errorText ? ` - ${errorText}` : ''}`);
      }

      let data;
      try {
        data = await response.json();
      } catch (jsonError) {
        console.error('Error parsing JSON response:', jsonError);
        throw new Error('Invalid response format from server');
      }

      if (!data.success) {
        throw new Error(data.error || 'Failed to get Cover Letter content');
      }

      // Validate content
      if (!data.content || data.content.trim() === '') {
        throw new Error('Received empty content from server');
      }

      console.log(`Received content (${data.content.length} characters)`);

      // Set the content
      setLocalContent(data.content);

      console.log('Cover Letter content fetched successfully');
      DanteLogger.success.basic('Cover Letter content fetched successfully');
      return true;
    } catch (error) {
      console.error('Error fetching Cover Letter content:', error);
      DanteLogger.error.dataFlow(`Error fetching Cover Letter content: ${error}`);
      setError(error instanceof Error ? error.message : 'Failed to fetch Cover Letter content');
      return false;
    } finally {
      setIsLoadingContent(false);
    }
  };

  // Function to handle refresh button click
  const handleRefresh = async () => {
    console.log('Manual refresh requested');
    await fetchCoverLetter(true);
  };

  // Fetch content when the modal is opened
  useEffect(() => {
    if (isOpen) {
      console.log('SummaryModal opened, fetching latest content');

      // Always fetch content when modal is opened
      // This ensures we're always showing the latest content
      fetchCoverLetter(true);
    }
  }, [isOpen]);

  // Handle escape key to close
  useEffect(() => {
    const handleEscKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscKey);
    }

    return () => {
      document.removeEventListener('keydown', handleEscKey);
    };
  }, [isOpen, onClose]);

  // Prevent scrolling when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'auto';
    }

    return () => {
      document.body.style.overflow = 'auto';
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className={styles.modalOverlay}>
      <div
        ref={modalRef}
        className={`${styles.modalContent} ${
          position === 'left'
            ? styles.modalContentLeft
            : position === 'right'
              ? styles.modalContentRight
              : ''
        }`}>
        <div className={styles.modalHeader}>
          <h2 className={styles.modalTitle}>Cover Letter</h2>

          {/* Content freshness warning removed as it's now handled server-side */}

          <div className={styles.headerActions}>
            {/* Refresh button */}
            <button
              className={styles.refreshActionButton}
              onClick={handleRefresh}
              disabled={isLoadingContent}
              title="Refresh content"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className={`${styles.actionIcon} ${isLoadingContent ? styles.spinAnimation : ''}`}
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M23 4v6h-6"></path>
                <path d="M1 20v-6h6"></path>
                <path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10"></path>
                <path d="M20.49 15a9 9 0 0 1-14.85 3.36L1 14"></path>
              </svg>
              {isLoadingContent ? 'Refreshing...' : 'Refresh'}
            </button>

            {/* Download dropdown container - Styled like SalingerHeader */}
            <div className={styles.downloadContainer}>
              <a
                href="#"
                className={styles.actionLink}
                onClick={(e) => e.preventDefault()} // Prevent default to allow dropdown to work
                aria-label="Download Summary"
                aria-haspopup="true"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className={styles.actionIcon} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                  <polyline points="7 10 12 15 17 10"></polyline>
                  <line x1="12" y1="15" x2="12" y2="3"></line>
                </svg>
                Download Cover Letter
              </a>

              {/* Dropdown menu with Salinger-inspired styling */}
              <div className={styles.downloadMenu}>
                <div className={styles.downloadOptionGroup}>
                  <a
                    href="#"
                    onClick={(e) => {
                      e.preventDefault();
                      if (onPdfPreview) {
                        onPdfPreview();
                      } else {
                        handlePdfPreview(); // Fallback to internal handler
                      }
                    }}
                    className={styles.previewButton}
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className={styles.previewIcon} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
                      <circle cx="12" cy="12" r="3"></circle>
                    </svg>
                    Preview
                  </a>
                  <a
                    href="#"
                    onClick={(e) => {
                      e.preventDefault();
                      if (onPdfDownload) {
                        onPdfDownload();
                      } else {
                        handleExportToPdf(); // Fallback to internal handler
                      }
                    }}
                    className={styles.downloadOption}
                  >
                    {isGeneratingPdf ? (
                      <span className={styles.loadingText}>
                        <svg className={`${styles.loadingSpinner} h-4 w-4 mr-2`} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Downloading...
                      </span>
                    ) : (
                      <>
                        <svg xmlns="http://www.w3.org/2000/svg" className={styles.downloadIcon} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                          <polyline points="7 10 12 15 17 10"></polyline>
                          <line x1="12" y1="15" x2="12" y2="3"></line>
                        </svg>
                        PDF Format
                      </>
                    )}
                  </a>
                </div>

                <div className={styles.downloadOptionGroup}>
                  <a
                    href="#"
                    onClick={(e) => {
                      e.preventDefault();
                      if (onMarkdownPreview) {
                        onMarkdownPreview();
                      } else {
                        handleMarkdownPreview(); // Fallback to internal handler
                      }
                    }}
                    className={styles.previewButton}
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className={styles.previewIcon} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
                      <circle cx="12" cy="12" r="3"></circle>
                    </svg>
                    Preview
                  </a>
                  <a
                    href="#"
                    onClick={(e) => {
                      e.preventDefault();
                      if (onMarkdownDownload) {
                        onMarkdownDownload();
                      } else {
                        handleExportToMarkdown(); // Fallback to internal handler
                      }
                    }}
                    className={styles.downloadOption}
                  >
                    {isGeneratingMd ? (
                      <span className={styles.loadingText}>
                        <svg className={`${styles.loadingSpinner} h-4 w-4 mr-2`} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Downloading...
                      </span>
                    ) : (
                      <>
                        <svg xmlns="http://www.w3.org/2000/svg" className={styles.downloadIcon} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                          <polyline points="7 10 12 15 17 10"></polyline>
                          <line x1="12" y1="15" x2="12" y2="3"></line>
                        </svg>
                        Markdown Format
                      </>
                    )}
                  </a>
                </div>

                <div className={styles.downloadOptionGroup}>
                  <a
                    href="#"
                    onClick={(e) => {
                      e.preventDefault();
                      if (onTextPreview) {
                        onTextPreview();
                      } else {
                        handleTextPreview(); // Fallback to internal handler
                      }
                    }}
                    className={styles.previewButton}
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className={styles.previewIcon} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
                      <circle cx="12" cy="12" r="3"></circle>
                    </svg>
                    Preview
                  </a>
                  <a
                    href="#"
                    onClick={(e) => {
                      e.preventDefault();
                      if (onTextDownload) {
                        onTextDownload();
                      } else {
                        handleExportToText(); // Fallback to internal handler
                      }
                    }}
                    className={styles.downloadOption}
                  >
                    {isGeneratingTxt ? (
                      <span className={styles.loadingText}>
                        <svg className={`${styles.loadingSpinner} h-4 w-4 mr-2`} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Downloading...
                      </span>
                    ) : (
                      <>
                        <svg xmlns="http://www.w3.org/2000/svg" className={styles.downloadIcon} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                          <polyline points="7 10 12 15 17 10"></polyline>
                          <line x1="12" y1="15" x2="12" y2="3"></line>
                        </svg>
                        Text Format
                      </>
                    )}
                  </a>
                </div>
              </div>
            </div>

            <button className={styles.closeButton} onClick={onClose} aria-label="Close">
              &times;
            </button>
          </div>
        </div>
        <div className={styles.modalBody}>
          {isLoading || isLoadingContent ? (
            <div className={styles.loadingContainer}>
              <div className={styles.loadingSpinner}>
                <svg className="animate-spin h-10 w-10" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
              </div>
              <div className={styles.loadingText}>Generating Cover Letter...</div>
            </div>
          ) : error ? (
            <div className={styles.errorContainer}>
              <div className={styles.errorIcon}>
                <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
              </div>
              <div className={styles.errorText}>{error}</div>
              <button
                onClick={() => fetchCoverLetter(true)}
                className={styles.retryButton}
              >
                Try Again
              </button>
            </div>
          ) : (
            <div ref={contentRef} className={styles.markdownPreview}>
              <ReactMarkdown>{localContent}</ReactMarkdown>
            </div>
          )}
        </div>
      </div>

      {/* Preview Modals */}
      {showPdfPreview && (
        <PreviewModal
          isOpen={showPdfPreview}
          onClose={() => {
            console.log('Closing PDF preview, resetting active preview');
            setActivePreview(null);
          }}
          content=""
          format="pdf"
          fileName="pbradygeorgen_cover_letter"
          onDownload={async () => {
            console.log('PDF download triggered from preview modal');
            try {
              // Create a direct download link if we have a data URL
              if (pdfDataUrl) {
                console.log('Using cached PDF data URL for direct download');
                const link = document.createElement('a');
                link.href = pdfDataUrl;
                link.download = 'pbradygeorgen_cover_letter.pdf';
                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);
                return Promise.resolve();
              } else {
                // Otherwise use the export function
                return await handleExportToPdf();
              }
            } catch (error) {
              console.error('Error in PDF download from preview:', error);
              return Promise.reject(error);
            }
          }}
          onDownloadWithDataUrl={async (dataUrl) => {
            console.log('PDF data URL download triggered from preview modal');
            try {
              // Direct download approach
              const link = document.createElement('a');
              link.href = dataUrl;
              link.download = 'pbradygeorgen_cover_letter.pdf';
              document.body.appendChild(link);
              link.click();
              document.body.removeChild(link);
              return Promise.resolve();
            } catch (error) {
              console.error('Error in PDF data URL download:', error);
              return Promise.reject(error);
            }
          }}
          position="right"
          pdfDataUrl={pdfDataUrl || undefined} // Use the dynamically generated PDF data URL
        />
      )}

      {showMdPreview && (
        <PreviewModal
          isOpen={showMdPreview}
          onClose={() => setActivePreview(null)}
          content={localContent}
          format="markdown"
          fileName="pbradygeorgen_cover_letter"
          onDownload={async () => {
            console.log('Markdown download triggered from preview modal');
            try {
              // Direct download approach
              const blob = new Blob([localContent], { type: 'text/markdown' });
              const url = URL.createObjectURL(blob);
              const a = document.createElement('a');
              a.href = url;
              a.download = 'pbradygeorgen_cover_letter.md';
              document.body.appendChild(a);
              a.click();
              document.body.removeChild(a);
              URL.revokeObjectURL(url);
              return Promise.resolve();
            } catch (error) {
              console.error('Error in Markdown download from preview:', error);
              return handleExportToMarkdown(); // Fall back to the handler
            }
          }}
          position="right"
        />
      )}

      {showTxtPreview && (
        <PreviewModal
          isOpen={showTxtPreview}
          onClose={() => setActivePreview(null)}
          content={previewContent}
          format="text"
          fileName="pbradygeorgen_cover_letter"
          onDownload={async () => {
            console.log('Text download triggered from preview modal');
            try {
              // Direct download approach
              const blob = new Blob([previewContent], { type: 'text/plain' });
              const url = URL.createObjectURL(blob);
              const a = document.createElement('a');
              a.href = url;
              a.download = 'pbradygeorgen_cover_letter.txt';
              document.body.appendChild(a);
              a.click();
              document.body.removeChild(a);
              URL.revokeObjectURL(url);
              return Promise.resolve();
            } catch (error) {
              console.error('Error in Text download from preview:', error);
              return handleExportToText(); // Fall back to the handler
            }
          }}
          position="right"
        />
      )}
    </div>
  );
};

export default SummaryModal;
