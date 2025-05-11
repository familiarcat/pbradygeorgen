'use client';

import React, { useEffect, useRef, useState } from 'react';
import styles from '@/styles/SummaryModal.module.css';
import { DanteLogger } from '@/utils/DanteLogger';
import { HesseLogger } from '@/utils/HesseLogger';
import ReactMarkdown from 'react-markdown';
import PdfGenerator from '@/utils/PdfGenerator';
import PreviewModal from './PreviewModal';
import { useSalingerTheme } from './SalingerThemeProvider';
import { useAdmin } from '@/contexts/AdminContext';

// Default cover letter content for fallback
const DEFAULT_COVER_LETTER = `# Benjamin Stein

## Summary

I'm a seasoned software developer with a passion for blending cutting-edge technology with creative design. My journey spans over 15 years in full-stack development, UI/UX design, and creative technology. I've built my expertise in React, React Native, AWS, and various other technologies while working with companies like Daugherty Business Solutions, where I've helped transform complex business challenges into elegant digital solutions.

## My Skills

- Full Stack Development
- JavaScript/TypeScript
- React/React Native
- AWS
- UI/UX Design
- Creative Technology
- Problem-Solving

## Industries I've Worked In

- Business Solutions
- Communications
- Healthcare/Pharmaceutical
- Financial Services

## My Career Journey

I've spent 9 years as a Senior Software Developer at Daugherty Business Solutions, where I've grown both technically and as a leader. I've had the privilege of working with major clients including Cox Communications, Bayer, Charter Communications, and Mastercard. My career path has allowed me to blend technical development with creative design, giving me a unique perspective on digital solutions.

## My Education

I hold dual Bachelor's degrees in Graphic Design and Philosophy from Webster University, which gives me both practical skills and a thoughtful approach to problem-solving.

## What I'm Looking For

- I'm looking for opportunities that combine technical leadership with creative direction, where I can apply both my development expertise and design sensibilities
- I thrive in cross-functional teams where I can bridge the gap between technical implementation and creative vision
- My experience with enterprise clients has prepared me for complex business environments where thoughtful solutions make a real difference`;

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

  // Use Salinger theme for consistent styling
  const salingerTheme = useSalingerTheme();

  // Get admin mode state
  const { isAdminMode } = useAdmin();

  // States for download operations
  const [isGeneratingPdf, setIsGeneratingPdf] = useState(false);
  const [isGeneratingMd, setIsGeneratingMd] = useState(false);
  const [isGeneratingTxt, setIsGeneratingTxt] = useState(false);

  // Debug logging for color palette
  const [cssVars, setCssVars] = useState<Record<string, string>>({});

  useEffect(() => {
    if (isOpen) {
      console.log('SummaryModal opened - Checking CSS variables:');
      const computedStyle = getComputedStyle(document.documentElement);
      const vars = {
        '--pdf-modal-header': computedStyle.getPropertyValue('--pdf-modal-header'),
        '--pdf-modal-body': computedStyle.getPropertyValue('--pdf-modal-body'),
        '--modal-header-bg': computedStyle.getPropertyValue('--modal-header-bg'),
        '--modal-bg': computedStyle.getPropertyValue('--modal-bg')
      };

      console.log('CSS Variables:', vars);
      setCssVars(vars);

      // Log to DanteLogger for visibility in terminal
      DanteLogger.info.system(`🎨 Modal CSS Variables: ${JSON.stringify(vars)}`);
    }
  }, [isOpen]);

  // States for loading and content
  const [isLoadingContent, setIsLoadingContent] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [localContent, setLocalContent] = useState(content);

  // States for OpenAI metadata
  const [contentMetadata, setContentMetadata] = useState<any>(null);
  const [showMetadata, setShowMetadata] = useState(false);

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
  const [isMobileView, setIsMobileView] = useState(false);
  const [dropdownPosition, setDropdownPosition] = useState<'left' | 'right' | 'breakout'>('left');
  const downloadContainerRef = useRef<HTMLDivElement>(null);

  // Reset dropdown state when modal is opened/closed
  useEffect(() => {
    if (!isOpen) {
      setShowDownloadOptions(false);
    }
  }, [isOpen]);

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
          title: 'Benjamin Stein - Cover Letter',
          fileName: 'benjamin_stein_cover_letter.pdf',
          headerText: 'Benjamin Stein - Cover Letter',
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
            link.download = 'benjamin_stein_cover_letter.pdf';
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
            link.download = 'benjamin_stein_cover_letter.pdf';
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
          a.download = 'benjamin_stein_cover_letter.txt';
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
        title: 'Benjamin Stein - Cover Letter',
        fileName: 'benjamin_stein_cover_letter.pdf',
        headerText: 'Benjamin Stein - Cover Letter',
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
        a.download = 'benjamin_stein_cover_letter.md';
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
      setShowMdPreview(true);
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
        a.download = 'benjamin_stein_cover_letter.txt';
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
      setShowTxtPreview(true);
      setActivePreview('text');
      DanteLogger.success.ux('Opened Text preview with Salinger design');
    } catch (error) {
      DanteLogger.error.runtime(`Error showing Text preview: ${error}`);
      HesseLogger.summary.error(`Text preview failed: ${error}`);
      alert('There was an error generating the Text preview. Please try again.');
    }
  };

  // Function to calculate dropdown position
  const calculateDropdownPosition = () => {
    if (!downloadContainerRef.current || !modalRef.current) return;

    const containerRect = downloadContainerRef.current.getBoundingClientRect();
    const modalRect = modalRef.current.getBoundingClientRect();
    const windowWidth = window.innerWidth;

    // Calculate available space to the right of the dropdown
    const availableSpaceRight = windowWidth - containerRect.right;
    const dropdownWidth = 280; // Minimum width of dropdown

    // Check if there's enough space to the right within the modal
    const rightEdgeWithinModal = containerRect.left + dropdownWidth;
    const exceedsModalRight = rightEdgeWithinModal > modalRect.right;

    // Check if there's enough space to the right of the screen
    const exceedsWindowRight = containerRect.left + dropdownWidth > windowWidth;

    // Check if there's enough space to the left
    const availableSpaceLeft = containerRect.left;
    const exceedsModalLeft = containerRect.right - dropdownWidth < modalRect.left;
    const exceedsWindowLeft = containerRect.right - dropdownWidth < 0;

    // Log the calculations for debugging
    console.log('Dropdown position calculation:', {
      containerLeft: containerRect.left,
      containerRight: containerRect.right,
      modalLeft: modalRect.left,
      modalRight: modalRect.right,
      windowWidth,
      availableSpaceRight,
      availableSpaceLeft,
      exceedsModalRight,
      exceedsWindowRight,
      exceedsModalLeft,
      exceedsWindowLeft
    });

    // Decision logic for dropdown position
    if (exceedsModalRight) {
      // Not enough space to the right within modal
      if (availableSpaceRight >= dropdownWidth) {
        // Enough space to break out of modal to the right
        console.log('Setting dropdown position to breakout');
        setDropdownPosition('breakout');

        // Set the dropdown position using inline styles
        // This needs to be done after the state update and render
        setTimeout(() => {
          if (downloadContainerRef.current) {
            const dropdown = downloadContainerRef.current.querySelector(`.${styles.downloadMenu}`);
            if (dropdown && dropdown instanceof HTMLElement) {
              dropdown.style.left = `${containerRect.left}px`;
              dropdown.style.top = `${containerRect.bottom}px`;

              // Don't force the dropdown to be visible - let the state handle it
            }
          }
        }, 0);
      } else {
        // Not enough space to break out, align to right
        console.log('Setting dropdown position to right');
        setDropdownPosition('right');
      }
    } else {
      // Default left alignment
      console.log('Setting dropdown position to left');
      setDropdownPosition('left');
    }
  };

  // Detect mobile view and calculate dropdown position
  useEffect(() => {
    const checkMobileView = () => {
      // Check if the device is mobile or the screen is small
      const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
      const isSmallScreen = window.innerWidth <= 768;
      setIsMobileView(isMobile || isSmallScreen);

      // Calculate dropdown position
      calculateDropdownPosition();
    };

    // Initial check
    checkMobileView();

    // Add resize listener
    window.addEventListener('resize', checkMobileView);

    return () => {
      window.removeEventListener('resize', checkMobileView);
    };
  }, []);

  // Initialize dropdown state when modal opens
  useEffect(() => {
    if (isOpen) {
      // Ensure dropdown is hidden when modal opens
      setShowDownloadOptions(false);
      // Calculate position for when it will be shown
      calculateDropdownPosition();
    }
  }, [isOpen]);

  // Recalculate dropdown position when its visibility changes
  useEffect(() => {
    if (isOpen && showDownloadOptions) {
      calculateDropdownPosition();
    }
  }, [isOpen, showDownloadOptions]);

  // Handle click/touch outside to close modal or dropdown
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent | TouchEvent) => {
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
      // Add both mouse and touch event listeners for mobile compatibility
      document.addEventListener('mousedown', handleClickOutside);
      document.addEventListener('touchstart', handleClickOutside);
    }

    return () => {
      // Clean up both event listeners
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('touchstart', handleClickOutside);
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

      // Clear any preview states
      setActivePreview(null);
      setPreviewContent('');

      console.log(`Fetching Cover Letter content (forceRefresh: ${forceRefresh})`);

      // Add a timestamp to ensure we're not getting cached results
      const timestamp = Date.now();

      try {
        // Call the new generic cover letter API with cache-busting
        const response = await fetch(`/api/generic-cover-letter?t=${timestamp}`);

        if (response.ok) {
          let data;
          try {
            data = await response.json();

            if (data.success && data.content && data.content.trim() !== '') {
              console.log(`📄 Received content from API (${data.content.length} characters)`);

              // Set the content
              setLocalContent(data.content);

              // Store metadata if available
              if (data.metadata) {
                console.log('📋 Content metadata:', data.metadata);
                setContentMetadata(data.metadata);
              }

              console.log('✅ Cover Letter content fetched successfully from API');
              DanteLogger.success.basic('Cover Letter content fetched successfully from API');
              return true;
            }
          } catch (jsonError) {
            console.error('Error parsing JSON response:', jsonError);
          }
        } else {
          let errorText = '';
          try {
            errorText = await response.text();
            console.error('API error response:', errorText);
          } catch (textError) {
            console.error('Could not read error response text:', textError);
          }
          console.error(`API responded with status: ${response.status}${errorText ? ` - ${errorText}` : ''}`);
        }
      } catch (apiError) {
        console.error('Error fetching from API:', apiError);
      }

      // If API fails, try to fetch from static file
      try {
        const response = await fetch(`/extracted/cover_letter.md?t=${Date.now()}`);

        if (response.ok) {
          const text = await response.text();

          if (text && text.trim() !== '') {
            console.log(`Received content from static file (${text.length} characters)`);
            setLocalContent(text);
            console.log('Cover Letter content fetched successfully from static file');
            DanteLogger.success.basic('Cover Letter content fetched successfully from static file');
            return true;
          }
        }

        console.log('Static file response did not contain valid content, using default');
      } catch (fileError) {
        console.error('Error fetching from static file:', fileError);
      }

      // If all else fails, use the default content
      console.log('Using default cover letter content');
      setLocalContent(DEFAULT_COVER_LETTER);
      DanteLogger.success.basic('Using default Cover Letter content');
      return true;
    } catch (error) {
      console.error('Error in fetchCoverLetter:', error);
      DanteLogger.error.dataFlow(`Error fetching Cover Letter content: ${error}`);

      // Even if there's an error, use the default content
      console.log('Error occurred, using default cover letter content');
      setLocalContent(DEFAULT_COVER_LETTER);
      setError(null); // Clear any error since we're using default content
      return true;
    } finally {
      setIsLoadingContent(false);
    }
  };

  // Function to handle regeneration button click
  const handleRegenerate = async () => {
    try {
      console.log('🔄 Regeneration requested');
      if (DanteLogger) DanteLogger.success.basic('Cover letter regeneration requested');

      setIsLoadingContent(true);
      setError(null);

      // Clear any cached data
      setPdfDataUrl(null);

      // Add a timestamp to ensure we're not getting cached results
      const timestamp = Date.now();

      // Call the new generic cover letter API to regenerate the cover letter
      const response = await fetch(`/api/generic-cover-letter`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          timestamp: timestamp // Add timestamp to prevent caching and ensure a different variation
        }),
      });

      if (response.ok) {
        const data = await response.json();

        if (data.success) {
          console.log('✅ Cover letter regenerated successfully');
          if (DanteLogger) DanteLogger.success.core('Cover letter regenerated successfully');

          // Fetch the newly generated cover letter with cache busting
          await fetchCoverLetter(true);

          // Show success message
          if (DanteLogger) DanteLogger.success.perfection('Generated a new universal cover letter');
        } else {
          console.error('❌ Error regenerating cover letter:', data.error);
          if (DanteLogger) DanteLogger.error.dataFlow(`Error regenerating cover letter: ${data.error}`);
          setError(data.message || 'Failed to regenerate cover letter');
        }
      } else {
        console.error('❌ API responded with status:', response.status);
        if (DanteLogger) DanteLogger.error.dataFlow(`API responded with status: ${response.status}`);
        setError('Failed to regenerate cover letter. Please try again later.');
      }
    } catch (error) {
      console.error('❌ Error in handleRegenerate:', error);
      if (DanteLogger) DanteLogger.error.system('Error in handleRegenerate', error);
      setError(error instanceof Error ? error.message : 'Failed to regenerate cover letter');
    } finally {
      setIsLoadingContent(false);
    }
  };

  // Function to handle PDF download
  const handlePdfDownload = async () => {
    try {
      console.log('📄 PDF download requested');
      if (DanteLogger) DanteLogger.success.basic('Cover letter PDF download requested');

      // Import the DownloadService dynamically
      const { DownloadService } = await import('@/utils/DownloadService');

      // Use the DownloadService to download the cover letter as PDF
      await DownloadService.downloadContent(
        'cover_letter',
        'pdf',
        'benjamin_stein_cover_letter',
        {
          title: 'Benjamin Stein - Cover Letter',
          headerText: 'Benjamin Stein - Cover Letter',
          footerText: 'Generated with Salinger Design',
          pageSize: 'letter',
          margins: { top: 8, right: 8, bottom: 8, left: 8 },
          isDarkTheme: true
        }
      );

      console.log('✅ Cover letter PDF downloaded successfully');
      if (DanteLogger) DanteLogger.success.core('Cover letter PDF downloaded successfully');
    } catch (error) {
      console.error('❌ Error downloading PDF:', error);
      if (DanteLogger) DanteLogger.error.system('Error downloading PDF', error);
      setError(error instanceof Error ? error.message : 'Failed to download PDF');
    }
  };

  // Function to handle Markdown download
  const handleMarkdownDownload = async () => {
    try {
      console.log('📄 Markdown download requested');
      if (DanteLogger) DanteLogger.success.basic('Cover letter Markdown download requested');

      // Import the DownloadService dynamically
      const { DownloadService } = await import('@/utils/DownloadService');

      // Use the DownloadService to download the cover letter as Markdown
      await DownloadService.downloadContent(
        'cover_letter',
        'markdown',
        'benjamin_stein_cover_letter',
        {
          addTimestamp: true,
          contentType: 'cover_letter'
        }
      );

      console.log('✅ Cover letter Markdown downloaded successfully');
      if (DanteLogger) DanteLogger.success.core('Cover letter Markdown downloaded successfully');
    } catch (error) {
      console.error('❌ Error downloading Markdown:', error);
      if (DanteLogger) DanteLogger.error.system('Error downloading Markdown', error);
      setError(error instanceof Error ? error.message : 'Failed to download Markdown');
    }
  };

  // Function to handle Text download
  const handleTextDownload = async () => {
    try {
      console.log('📄 Text download requested');
      if (DanteLogger) DanteLogger.success.basic('Cover letter Text download requested');

      // Import the DownloadService dynamically
      const { DownloadService } = await import('@/utils/DownloadService');

      // Use the DownloadService to download the cover letter as Text
      await DownloadService.downloadContent(
        'cover_letter',
        'text',
        'benjamin_stein_cover_letter'
      );

      console.log('✅ Cover letter Text downloaded successfully');
      if (DanteLogger) DanteLogger.success.core('Cover letter Text downloaded successfully');
    } catch (error) {
      console.error('❌ Error downloading Text:', error);
      if (DanteLogger) DanteLogger.error.system('Error downloading Text', error);
      setError(error instanceof Error ? error.message : 'Failed to download Text');
    }
  };

  // Initialize with default content and fetch when the modal is opened
  useEffect(() => {
    // Initialize with default content if no content is provided
    if (!localContent || localContent.trim() === '') {
      console.log('Initializing with default cover letter content');
      setLocalContent(DEFAULT_COVER_LETTER);
    }

    if (isOpen) {
      console.log('SummaryModal opened, fetching latest content');

      // Always fetch content when modal is opened
      // This ensures we're always showing the latest content
      fetchCoverLetter(true);
    }
  }, [isOpen, localContent]);

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
            {/* Regenerate button - only visible in Admin mode */}
            {isAdminMode && (
              <button
                className={styles.regenerateActionButton}
                onClick={handleRegenerate}
                disabled={isLoadingContent}
                title="Regenerate cover letter with OpenAI"
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
                  <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83"/>
                </svg>
                {isLoadingContent ? <span>Regenerating...</span> : <span>Regenerate</span>}
              </button>
            )}

            {/* Download dropdown */}
            <div className={styles.downloadContainer} ref={downloadContainerRef}>
              <button
                className={styles.actionLink}
                onClick={(e) => {
                  // Only toggle dropdown on click for mobile devices
                  if (isMobileView) {
                    e.preventDefault();
                    e.stopPropagation(); // Prevent event bubbling
                    console.log('Download button clicked on mobile, toggling dropdown');
                    setShowDownloadOptions(!showDownloadOptions);
                    // Recalculate position when toggling
                    setTimeout(calculateDropdownPosition, 0);
                  }
                }}
                onMouseEnter={() => {
                  // For desktop, we use CSS hover, but we also set the state for consistency
                  if (!isMobileView) {
                    console.log('Download button hovered on desktop');
                    // Recalculate position on hover
                    setTimeout(calculateDropdownPosition, 0);
                    // Set dropdown to visible for desktop as a fallback
                    // Only set state if it's not already set to prevent unnecessary renders
                    if (!showDownloadOptions) {
                      setShowDownloadOptions(true);
                    }
                  }
                }}
                onMouseLeave={() => {
                  // For desktop, we use CSS hover, but we also set the state for consistency
                  if (!isMobileView) {
                    console.log('Download button unhovered on desktop');
                    // Add a small delay to prevent flickering
                    setTimeout(() => {
                      // Check if the mouse is still outside the dropdown container
                      const downloadContainer = downloadContainerRef.current;
                      if (downloadContainer && !downloadContainer.matches(':hover')) {
                        setShowDownloadOptions(false);
                      }
                    }, 150);
                  }
                }}
                onTouchStart={(e) => {
                  // For iOS devices, ensure touch events work properly
                  e.stopPropagation();
                }}
                aria-label="Download Cover Letter"
                aria-haspopup="true"
                aria-expanded={showDownloadOptions}
                title="Download cover letter"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className={styles.actionIcon}
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                  <polyline points="7 10 12 15 17 10"></polyline>
                  <line x1="12" y1="15" x2="12" y2="3"></line>
                </svg>
                <span>Download</span>
              </button>

              <div
                className={`
                  ${styles.downloadMenu}
                  ${showDownloadOptions ? styles.downloadMenuVisible : ''}
                  ${dropdownPosition === 'right' ? styles.downloadMenuRight : ''}
                  ${dropdownPosition === 'breakout' ? styles.downloadMenuBreakout : ''}
                `}
                onMouseEnter={() => {
                  // Keep dropdown open when mouse enters the dropdown
                  if (!isMobileView) {
                    if (!showDownloadOptions) {
                      setShowDownloadOptions(true);
                    }
                  }
                }}
                onMouseLeave={() => {
                  // Close dropdown when mouse leaves the dropdown
                  if (!isMobileView) {
                    setTimeout(() => {
                      // Only close if the mouse is not over the download button
                      const downloadButton = downloadContainerRef.current?.querySelector(`.${styles.actionLink}`);
                      if (downloadButton && !downloadButton.matches(':hover')) {
                        setShowDownloadOptions(false);
                      }
                    }, 150);
                  }
                }}>
                <div className={styles.downloadOptionGroup}>
                  <a
                    href="#"
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation(); // Prevent event bubbling
                      handlePdfPreview();
                      setShowDownloadOptions(false); // Close dropdown after selection
                    }}
                    onTouchStart={(e) => {
                      // For iOS devices, ensure touch events work properly
                      e.stopPropagation();
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
                      e.stopPropagation(); // Prevent event bubbling
                      handlePdfDownload();
                      setShowDownloadOptions(false); // Close dropdown after selection
                    }}
                    onTouchStart={(e) => {
                      // For iOS devices, ensure touch events work properly
                      e.stopPropagation();
                    }}
                    className={styles.downloadOption}
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className={styles.downloadIcon}
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                      <polyline points="14 2 14 8 20 8"></polyline>
                      <path d="M12 18v-6"></path>
                      <path d="M8 15h8"></path>
                    </svg>
                    PDF Format
                  </a>
                </div>
                <div className={styles.downloadOptionGroup}>
                  <a
                    href="#"
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation(); // Prevent event bubbling
                      handleMarkdownPreview();
                      setShowDownloadOptions(false); // Close dropdown after selection
                    }}
                    onTouchStart={(e) => {
                      // For iOS devices, ensure touch events work properly
                      e.stopPropagation();
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
                      e.stopPropagation(); // Prevent event bubbling
                      handleMarkdownDownload();
                      setShowDownloadOptions(false); // Close dropdown after selection
                    }}
                    onTouchStart={(e) => {
                      // For iOS devices, ensure touch events work properly
                      e.stopPropagation();
                    }}
                    className={styles.downloadOption}
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className={styles.downloadIcon}
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                      <polyline points="14 2 14 8 20 8"></polyline>
                      <line x1="16" y1="13" x2="8" y2="13"></line>
                      <line x1="16" y1="17" x2="8" y2="17"></line>
                      <polyline points="10 9 9 9 8 9"></polyline>
                    </svg>
                    Markdown Format
                  </a>
                </div>
                <div className={styles.downloadOptionGroup}>
                  <a
                    href="#"
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation(); // Prevent event bubbling
                      handleTextPreview();
                      setShowDownloadOptions(false); // Close dropdown after selection
                    }}
                    onTouchStart={(e) => {
                      // For iOS devices, ensure touch events work properly
                      e.stopPropagation();
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
                      e.stopPropagation(); // Prevent event bubbling
                      handleTextDownload();
                      setShowDownloadOptions(false); // Close dropdown after selection
                    }}
                    onTouchStart={(e) => {
                      // For iOS devices, ensure touch events work properly
                      e.stopPropagation();
                    }}
                    className={styles.downloadOption}
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className={styles.downloadIcon}
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                      <polyline points="14 2 14 8 20 8"></polyline>
                      <line x1="16" y1="13" x2="8" y2="13"></line>
                      <line x1="16" y1="17" x2="8" y2="17"></line>
                      <polyline points="10 9 9 9 8 9"></polyline>
                    </svg>
                    Text Format
                  </a>
                </div>
              </div>
            </div>

            {/* Metadata toggle button - only show if we have metadata */}
            {contentMetadata && (
              <button
                className={`${styles.metadataToggleButton} ${showMetadata ? styles.metadataActive : ''}`}
                onClick={() => setShowMetadata(!showMetadata)}
                title={showMetadata ? "Hide OpenAI metadata" : "Show OpenAI metadata"}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className={styles.actionIcon}
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <circle cx="12" cy="12" r="10"></circle>
                  <line x1="12" y1="16" x2="12" y2="12"></line>
                  <line x1="12" y1="8" x2="12.01" y2="8"></line>
                </svg>
                <span>{showMetadata ? 'Hide Info' : 'Show Info'}</span>
              </button>
            )}

            {/* Redundant Download Cover Letter button removed */}

            <button className={styles.closeButton} onClick={onClose} aria-label="Close">
              &times;
            </button>
          </div>
        </div>
        <div className={styles.modalBody}>
          {/* Debug display for CSS variables - only visible in admin mode */}
          {isAdminMode && Object.keys(cssVars).length > 0 && (
            <div style={{
              padding: '10px',
              marginBottom: '10px',
              border: '1px solid #ccc',
              borderRadius: '4px',
              fontSize: '12px',
              fontFamily: 'monospace',
              backgroundColor: 'rgba(0,0,0,0.05)'
            }}>
              <h4 style={{ marginBottom: '5px', fontWeight: 'bold' }}>CSS Variables (Debug):</h4>
              <ul style={{ listStyle: 'none', padding: 0 }}>
                {Object.entries(cssVars).map(([key, value]) => (
                  <li key={key} style={{ marginBottom: '2px' }}>
                    <strong>{key}:</strong> <span style={{ color: value }}>{value}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

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
              <div className={styles.errorText}>
                {error}
                <p className={styles.errorSubtext}>Using default content for now. API connection issues may occur in development mode.</p>
              </div>
              <div className={styles.errorActions}>
                <button
                  onClick={() => fetchCoverLetter(true)}
                  className={styles.retryButton}
                >
                  Try Again
                </button>
                <button
                  onClick={() => {
                    setError(null);
                    setLocalContent(DEFAULT_COVER_LETTER);
                  }}
                  className={styles.fallbackButton}
                >
                  Use Default Content
                </button>
              </div>

              {/* Show default content even when there's an error */}
              <div className={styles.fallbackContent}>
                <ReactMarkdown>{DEFAULT_COVER_LETTER}</ReactMarkdown>
              </div>
            </div>
          ) : (
            <>
              {/* Metadata panel - only shown when toggled */}
              {showMetadata && contentMetadata && (
                <div className={styles.metadataPanel}>
                  <h3 className={styles.metadataPanelTitle}>OpenAI Generation Metadata</h3>
                  <div className={styles.metadataContent}>
                    {contentMetadata.contentFingerprint && (
                      <div className={styles.metadataItem}>
                        <span className={styles.metadataLabel}>Content Fingerprint:</span>
                        <span className={styles.metadataValue}>{contentMetadata.contentFingerprint.substring(0, 8)}...</span>
                      </div>
                    )}
                    {contentMetadata.timestamp && (
                      <div className={styles.metadataItem}>
                        <span className={styles.metadataLabel}>Generated:</span>
                        <span className={styles.metadataValue}>
                          {new Date(contentMetadata.timestamp).toLocaleString()}
                        </span>
                      </div>
                    )}
                    {contentMetadata.source && (
                      <div className={styles.metadataItem}>
                        <span className={styles.metadataLabel}>Source:</span>
                        <span className={styles.metadataValue}>{contentMetadata.source}</span>
                      </div>
                    )}
                    {contentMetadata.params && (
                      <>
                        <div className={styles.metadataItem}>
                          <span className={styles.metadataLabel}>Company:</span>
                          <span className={styles.metadataValue}>{contentMetadata.params.company || 'Not specified'}</span>
                        </div>
                        <div className={styles.metadataItem}>
                          <span className={styles.metadataLabel}>Position:</span>
                          <span className={styles.metadataValue}>{contentMetadata.params.position || 'Not specified'}</span>
                        </div>
                        {contentMetadata.params.hiringManager && (
                          <div className={styles.metadataItem}>
                            <span className={styles.metadataLabel}>Hiring Manager:</span>
                            <span className={styles.metadataValue}>{contentMetadata.params.hiringManager}</span>
                          </div>
                        )}
                      </>
                    )}
                  </div>
                </div>
              )}

              {/* Main content */}
              <div ref={contentRef} className={styles.markdownPreview}>
                <ReactMarkdown>{localContent}</ReactMarkdown>
              </div>
            </>
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
          fileName="default_pdf"
          onDownload={async () => {
            console.log('Text download triggered from preview modal');
            try {
              // Direct download approach
              const blob = new Blob([previewContent], { type: 'text/plain' });
              const url = URL.createObjectURL(blob);
              const a = document.createElement('a');
              a.href = url;
              a.download = 'default_cover_letter.txt';
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
